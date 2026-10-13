import { supabase } from './supabase'
import { fetchAllRows, run } from './db'
import { toISODate, parseISO, addDaysISO, lastDayOfMonth, WEEKDAY_LABELS } from './dates'

// 「やること」（タスク管理）の取得・保存と、「今日の分」を計算する関数。
// 日付は端末のローカル日付の 'YYYY-MM-DD' 文字列で扱う（lib/dates.js）。

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
  { value: 'once', label: '1度だけ' },
  { value: 'daily', label: '毎日' },
  { value: 'weekly', label: '毎週' },
  { value: 'monthly', label: '毎月' }
]
const UPCOMING_DAYS = 3

// ホームの「始める」ボタンで開くアプリ（tasks.link_to の値）。autoLabel＝自動完了になるタイミング
export const LINK_APPS = {
  kotoba: { label: 'ことばナビ', emoji: '📚', autoLabel: 'ことばナビの「今日やる問題」を終えたとき' },
  sansu: { label: 'さんすうナビ', emoji: '🔢', autoLabel: 'さんすうナビを最後までやったとき' }
}

// ポイントの選択肢（登録画面）と初期値。DBの check 制約（10,50,100,150,200）と合わせる
export const TASK_POINT_OPTIONS = [200, 150, 100, 50, 10]
export const DEFAULT_TASK_POINTS = 100
export const taskPoints = (task) => task.points ?? DEFAULT_TASK_POINTS

// 完了の記録を探すときのキー（やることID＋その回の日付）
export const completionKey = (taskId, iso) => `${taskId}|${iso}`

// 毎週のくり返しの曜日。曜日を選んでいない場合は、期日の曜日を使う
const weekdaysOf = (task) => (task.weekdays?.length ? task.weekdays : [parseISO(task.due_date).getDay()])

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
    case 'weekly':
      return weekdaysOf(task).includes(d.getDay())
    case 'monthly': {
      // 29〜31日が期日の月は、月末に寄せる
      const want = Math.min(parseISO(task.due_date).getDate(), lastDayOfMonth(d.getFullYear(), d.getMonth()))
      return d.getDate() === want
    }
    default:
      return false
  }
}

// 並び順：教科の順 → 管理画面で並べた順（sort_order）
const bySubject = (a, b) => SUBJECTS.indexOf(a.task.subject) - SUBJECTS.indexOf(b.task.subject)
const byOrder = (a, b) => a.task.sort_order - b.task.sort_order

/**
 * ホームに出す一覧をつくる。
 * 「くり返し」は、設定した曜日・日ごとに「期限が当日の1件」として扱う。
 * - todayItems : 今日の分 ＋ 過去の分で未完了のもの（late: true）。完了するまで毎日出し続ける
 * - upcoming   : 3日以内に期日がくる「1度だけ」
 * - doneToday  : 今日完了したもの（過去の分を今日やった場合も含む。まちがえて押したとき戻せる）
 * @param completions [{ task_id, occurrence_date, completed_at? }]
 */
export function buildHomeTasks(tasks, completions, todayISO) {
  const completedAt = new Map(completions.map((c) => [completionKey(c.task_id, c.occurrence_date), c.completed_at]))
  const limit = addDaysISO(todayISO, UPCOMING_DAYS)
  const todayItems = []
  const doneToday = []
  const upcoming = []

  tasks.forEach((t) => {
    if (!t.is_active) return
    if (t.frequency === 'once' && t.due_date > todayISO) {
      if (t.due_date <= limit && !completedAt.has(completionKey(t.id, t.due_date))) upcoming.push({ task: t, date: t.due_date })
      return
    }
    // 期日から今日（終了日があればその日）までの「出番」を1件ずつ数える
    const last = t.end_date && t.end_date < todayISO ? t.end_date : todayISO
    for (let d = t.due_date; d <= last; d = addDaysISO(d, 1)) {
      if (!occursOn(t, d)) continue
      const doneAt = completedAt.get(completionKey(t.id, d))
      const late = d < todayISO
      if (doneAt === undefined) todayItems.push({ task: t, date: d, late })
      // 今日完了したものだけ「今日終わったこと」に出す（完了日時が不明なときは今日の分だけ）
      else if (doneAt ? toISODate(new Date(doneAt)) === todayISO : d === todayISO) doneToday.push({ task: t, date: d, late })
    }
  })

  todayItems.sort((a, b) => Number(b.late) - Number(a.late) || a.date.localeCompare(b.date) || bySubject(a, b) || byOrder(a, b))
  upcoming.sort((a, b) => a.date.localeCompare(b.date) || bySubject(a, b) || byOrder(a, b))
  doneToday.sort((a, b) => bySubject(a, b) || byOrder(a, b) || a.date.localeCompare(b.date))
  return { todayItems, upcoming, doneToday }
}

// あしたの分（くり返しも含む）。まだ終わらせられないので、完了の記録は見ない
export function buildTomorrowItems(tasks, todayISO) {
  const date = addDaysISO(todayISO, 1)
  return tasks
    .filter((t) => t.is_active && occursOn(t, date))
    .map((task) => ({ task, date }))
    .sort((a, b) => bySubject(a, b) || byOrder(a, b))
}

// 管理画面の一覧に出す、くり返しの説明文
export function describeSchedule(t) {
  if (t.frequency === 'weekly') return `毎週（${[...weekdaysOf(t)].sort().map((d) => WEEKDAY_LABELS[d]).join('・')}）`
  if (t.frequency === 'monthly') return `毎月（${parseISO(t.due_date).getDate()}日）`
  return FREQUENCIES.find((f) => f.value === t.frequency)?.label || ''
}

// 「アプリの学習を終えたら自動で完了にする」やることを1件探す。
// 対象は link_to が同じで auto_complete のやること。遅れている分があれば古い順に1件ずつ（まとめて消さない）
export function findAutoCompleteTarget(tasks, completions, todayISO, app) {
  const linked = tasks.filter((t) => t.auto_complete && t.link_to === app)
  return buildHomeTasks(linked, completions, todayISO).todayItems[0] || null
}

// ---- 取得・保存 ----
export const fetchTasks = () =>
  fetchAllRows('tasks', (q) => q.select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true }).order('id', { ascending: true }))

export const fetchTaskCompletions = () =>
  fetchAllRows('task_completions', (q) => q.select('task_id, occurrence_date, completed_at, points_awarded').order('id', { ascending: true }))

export const saveTask = (values, id) =>
  run(id ? supabase.from('tasks').update(values).eq('id', id) : supabase.from('tasks').insert(values))

// 並べ替え：順番が変わった行だけ sort_order を更新する（1始まりの連番）
export async function reorderTasks(ordered) {
  const changed = ordered.map((t, i) => ({ id: t.id, order: i + 1, old: t.sort_order })).filter((r) => r.order !== r.old)
  await Promise.all(changed.map((r) => run(supabase.from('tasks').update({ sort_order: r.order }).eq('id', r.id))))
}

export const deleteTask = (id) => run(supabase.from('tasks').delete().eq('id', id))

// 完了を記録する。そのときのポイントも一緒に残す（あとでポイント設定を変えても、取り消しがずれないように）
// 戻り値：新しく記録できたら true、すでに完了ずみ（二重タップ）なら false → ポイントの二重加算を防ぐ
export async function completeTask(taskId, occurrenceDate, points) {
  const { error } = await supabase.from('task_completions').insert({ task_id: taskId, occurrence_date: occurrenceDate, points_awarded: points })
  if (error) {
    if (error.code === '23505') return false // 一意制約違反＝すでに完了ずみ
    throw error
  }
  return true
}

// 完了を取り消す。戻り値：取り消した完了で付いていたポイント（なければ0）
export async function uncompleteTask(taskId, occurrenceDate) {
  const data = await run(
    supabase.from('task_completions').delete().eq('task_id', taskId).eq('occurrence_date', occurrenceDate).select('points_awarded')
  )
  return (data || []).reduce((sum, r) => sum + (r.points_awarded || 0), 0)
}

// ---- マイルストーン（テスト・行事などの目標日）。ホームと予定カレンダーの上に表示する ----
export const fetchMilestones = () =>
  fetchAllRows('milestones', (q) => q.select('id, event_date, title').order('event_date', { ascending: true }).order('id', { ascending: true }))

export const saveMilestone = ({ event_date, title }, id) =>
  run(id ? supabase.from('milestones').update({ event_date, title }).eq('id', id) : supabase.from('milestones').insert({ event_date, title }))

export const deleteMilestone = (id) => run(supabase.from('milestones').delete().eq('id', id))
