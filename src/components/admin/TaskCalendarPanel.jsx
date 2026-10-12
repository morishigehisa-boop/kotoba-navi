import { useEffect, useMemo, useState } from 'react'
import { SUBJECTS, SUBJECT_EMOJI, WEEKDAY_LABELS, subjectStyle, toISODate, occursOn, fetchTasks, fetchTaskCompletions } from '../../lib/tasks'
import { LoadingView, ErrorView } from '../common/Status'

const DAYS = 10 // 今日から何日分ひょうじするか

// 今日から DAYS 日分の日付（'YYYY-MM-DD'）を作る
function buildDays(todayISO) {
  const [y, m, d] = todayISO.split('-').map(Number)
  return Array.from({ length: DAYS }, (_, i) => {
    const dt = new Date(y, m - 1, d + i)
    return { iso: toISODate(dt), label: `${dt.getMonth() + 1}/${dt.getDate()}`, wd: dt.getDay() }
  })
}

// 「何日に どのやることが 子どもの画面に出るか」を、日付ごとに並べて見る画面。
// やることは、期日の日に出る（終わるまで翌日以降も「おくれている分」として残る）
export default function TaskCalendarPanel() {
  const [tasks, setTasks] = useState(null)
  const [completions, setCompletions] = useState([])
  const [failed, setFailed] = useState(false)
  const [subjects, setSubjects] = useState(SUBJECTS) // 表示する教科（すべてONからスタート）
  const todayISO = toISODate()

  function load() {
    setFailed(false)
    Promise.all([fetchTasks(), fetchTaskCompletions()])
      .then(([t, c]) => { setTasks(t); setCompletions(c) })
      .catch((e) => { console.error(e); setFailed(true) })
  }
  useEffect(load, [])

  const doneKeys = useMemo(() => new Set(completions.map((c) => `${c.task_id}|${c.occurrence_date}`)), [completions])

  const days = useMemo(() => {
    const list = buildDays(todayISO)
    return list.map((day) => ({
      ...day,
      items: (tasks || [])
        .filter((t) => t.is_active && subjects.includes(t.subject) && occursOn(t, day.iso))
        .map((t) => ({ task: t, done: doneKeys.has(`${t.id}|${day.iso}`) }))
    }))
  }, [tasks, subjects, doneKeys, todayISO])

  const toggle = (s) => setSubjects((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))

  if (failed) return <ErrorView onRetry={load} />
  if (tasks === null) return <LoadingView />

  return (
    <div>
      <div className="cal-filter">
        <span className="cal-filter-label">教科:</span>
        <button className={`cal-chip ${subjects.length === SUBJECTS.length ? 'on' : ''}`} onClick={() => setSubjects(SUBJECTS)}>すべて</button>
        {SUBJECTS.map((s) => (
          <button key={s} className={`cal-chip ${subjects.includes(s) ? 'on' : ''}`} style={subjectStyle(s)} onClick={() => toggle(s)}>
            {SUBJECT_EMOJI[s]} {s}
          </button>
        ))}
      </div>
      <p className="hint cal-note">今日から{DAYS}日分です。やることは期日の日に出て、終わらないと翌日以降も「おくれている分」として残ります。おやすみ中のものは出ません。</p>

      <div className="cal-grid">
        {days.map((day) => (
          <div key={day.iso} className={`cal-day ${day.iso === todayISO ? 'today' : ''} ${day.wd === 0 ? 'sun' : day.wd === 6 ? 'sat' : ''}`}>
            <div className="cal-day-head">
              <span>{day.label}（{WEEKDAY_LABELS[day.wd]}）</span>
              {day.iso === todayISO && <span className="cal-today-badge">今日</span>}
              <span className="cal-count">{day.items.length}こ</span>
            </div>
            {day.items.length === 0 ? (
              <div className="cal-empty">なし</div>
            ) : (
              day.items.map(({ task, done }) => (
                <div key={task.id} className={`cal-task ${done ? 'done' : ''}`} style={subjectStyle(task.subject)} title={`${task.subject}：${task.title}`}>
                  {task.title}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
