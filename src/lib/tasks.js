import { supabase } from './supabase'

// 「やること」（タスク管理）の取得・保存と、「今日の分」を計算する関数。
// 日付は端末のローカル日付の 'YYYY-MM-DD' 文字列で扱う（タイムゾーンのずれを避ける）。

export const SUBJECTS = ['算数', '国語', '理科', '社会']
export const SUBJECT_EMOJI = { 算数: '🔢', 国語: '📖', 理科: '🔬', 社会: '🌏' }
// 教科ごとのテーマカラー（main=濃い色 / soft=うすい背景）
export const SUBJECT_COLORS = {
  算数: { main: '#3B82D6', soft: '#E8F1FC' },
  国語: { main: '#E5484D', soft: '#FDECEC' },
  理科: { main: '#F08A24', soft: '#FFF0DD' },
  社会: { main: '#3AA76D', soft: '#E5F5EC' }
}
export const subjectStyle = (s) => ({ '--c': SUBJECT_COLORS[s]?.main, '--soft': SUBJECT_COLORS[s]?.soft })

export const FREQUENCIES = [
  { value: 'once', label: '1どだけ' },
  { value: 'daily', label: 'まいにち' },
  { value: 'weekly', label: 'まいしゅう' },
  { value: 'monthly', label: 'まいつき' }
]
export const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']
export const UPCOMING_DAYS = 3

const PAGE_SIZE = 1000

export function toISODate(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

// 'YYYY-MM-DD' を、ずれのないローカル日付に直す
function parseISO(s) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function addDays(iso, n) {
  const d = parseISO(iso)
  d.setDate(d.getDate() + n)
  return toISODate(d)
}

function lastDayOfMonth(y, m0) {
  return new Date(y, m0 + 1, 0).getDate()
}

// そのタスクが、指定日に「出番」かどうか
export function occursOn(task, iso) {
  if (iso < task.due_date) return false
  if (task.end_date && iso > task.end_date) return false
  const d = parseISO(iso)
  switch (task.frequency) {
    case 'once':
      return iso === task.due_date
    case 'daily':
      return true
    case 'weekly': {
      // 曜日を選んでいない場合は、期日の曜日を使う
      const days = task.weekdays?.length ? task.weekdays : [parseISO(task.due_date).getDay()]
      return days.includes(d.getDay())
    }
    case 'monthly': {
      // 29〜31日が期日の月は、月末に寄せる
      const want = Math.min(parseISO(task.due_date).getDate(), lastDayOfMonth(d.getFullYear(), d.getMonth()))
      return d.getDate() === want
    }
    default:
      return false
  }
}

const key = (taskId, iso) => `${taskId}|${iso}`

/**
 * ホームに出す一覧をつくる。
 * - todayItems : 今日の分 ＋ 期限をすぎた「1どだけ」の未完了（overdue: true）
 * - upcoming   : 3日以内に期日がくる「1どだけ」
 * - doneToday  : 今日の分で完了ずみのもの（まちがえて押したとき戻せる）
 * 繰り返しタスクの過去の取りこぼしは、たまらないように消える。
 */
export function buildHomeTasks(tasks, completions, todayISO) {
  const done = new Set(completions.map((c) => key(c.task_id, c.occurrence_date)))
  const limit = addDays(todayISO, UPCOMING_DAYS)
  const todayItems = []
  const doneToday = []
  const upcoming = []

  tasks.forEach((t) => {
    if (!t.is_active) return
    if (t.frequency === 'once') {
      const isDone = done.has(key(t.id, t.due_date))
      if (t.due_date < todayISO && !isDone) todayItems.push({ task: t, date: t.due_date, overdue: true })
      else if (t.due_date === todayISO) (isDone ? doneToday : todayItems).push({ task: t, date: todayISO, overdue: false })
      else if (t.due_date > todayISO && t.due_date <= limit && !isDone) upcoming.push({ task: t, date: t.due_date })
      return
    }
    if (occursOn(t, todayISO)) {
      (done.has(key(t.id, todayISO)) ? doneToday : todayItems).push({ task: t, date: todayISO, overdue: false })
    }
  })

  const bySubject = (a, b) => SUBJECTS.indexOf(a.task.subject) - SUBJECTS.indexOf(b.task.subject)
  todayItems.sort((a, b) => Number(b.overdue) - Number(a.overdue) || a.date.localeCompare(b.date) || bySubject(a, b))
  upcoming.sort((a, b) => a.date.localeCompare(b.date) || bySubject(a, b))
  doneToday.sort(bySubject)
  return { todayItems, upcoming, doneToday }
}

// 管理画面の一覧に出す、くり返しの説明文
export function describeSchedule(t) {
  if (t.frequency === 'once') return '1どだけ'
  if (t.frequency === 'daily') return 'まいにち'
  if (t.frequency === 'weekly') {
    const days = t.weekdays?.length ? t.weekdays : [parseISO(t.due_date).getDay()]
    return `まいしゅう（${[...days].sort().map((d) => WEEKDAY_LABELS[d]).join('・')}）`
  }
  return `まいつき（${parseISO(t.due_date).getDate()}日）`
}

async function fetchAll(table, build) {
  let all = []
  let from = 0
  while (true) {
    const { data, error } = await build(supabase.from(table)).range(from, from + PAGE_SIZE - 1)
    if (error) throw error
    all = all.concat(data)
    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }
  return all
}

export const fetchTasks = () =>
  fetchAll('tasks', (q) => q.select('*').order('due_date', { ascending: true }).order('created_at', { ascending: true }))

export const fetchTaskCompletions = () =>
  fetchAll('task_completions', (q) => q.select('task_id, occurrence_date').order('id', { ascending: true }))

export async function saveTask(values, id) {
  const q = id ? supabase.from('tasks').update(values).eq('id', id) : supabase.from('tasks').insert(values)
  const { error } = await q
  if (error) throw error
}

export async function deleteTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}

export async function completeTask(taskId, occurrenceDate) {
  const { error } = await supabase.from('task_completions').insert({ task_id: taskId, occurrence_date: occurrenceDate })
  // 23505 = すでに完了ずみ（二重タップ）。成功と同じ扱いにする
  if (error && error.code !== '23505') throw error
}

export async function uncompleteTask(taskId, occurrenceDate) {
  const { error } = await supabase.from('task_completions').delete().eq('task_id', taskId).eq('occurrence_date', occurrenceDate)
  if (error) throw error
}
