import { useEffect, useMemo, useState } from 'react'
import { SUBJECTS, SUBJECT_EMOJI, WEEKDAY_LABELS, subjectStyle, toISODate, occursOn, fetchTasks, fetchTaskCompletions } from '../../lib/tasks'
import { LoadingView, ErrorView } from '../common/Status'

const RANGES = [7, 10, 30] // ひょうじする日数の選びかた
const RANGE_KEY = 'kotoba_navi_admin_cal_range'

// 「くりかえし」か「1どだけ」かを示す記号（タスクの右はしに出す）
const MARK = { repeat: { icon: '🔁', label: 'くりかえし' }, once: { icon: '①', label: '1どだけ' } }

// startISO から count 日分の日付（'YYYY-MM-DD'）を作る
function buildDays(startISO, count) {
  const [y, m, d] = startISO.split('-').map(Number)
  return Array.from({ length: count }, (_, i) => {
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
  const [range, setRangeState] = useState(() => {
    try { const n = Number(localStorage.getItem(RANGE_KEY)); return RANGES.includes(n) ? n : 10 } catch { return 10 }
  })
  const [offset, setOffset] = useState(0) // 今日から何日ずらしているか
  const todayISO = toISODate()

  function setRange(n) {
    setRangeState(n)
    try { localStorage.setItem(RANGE_KEY, String(n)) } catch {}
  }

  function load() {
    setFailed(false)
    Promise.all([fetchTasks(), fetchTaskCompletions()])
      .then(([t, c]) => { setTasks(t); setCompletions(c) })
      .catch((e) => { console.error(e); setFailed(true) })
  }
  useEffect(load, [])

  const doneKeys = useMemo(() => new Set(completions.map((c) => `${c.task_id}|${c.occurrence_date}`)), [completions])

  const days = useMemo(() => {
    const [y, m, d] = todayISO.split('-').map(Number)
    const list = buildDays(toISODate(new Date(y, m - 1, d + offset)), range)
    return list.map((day) => ({
      ...day,
      items: (tasks || [])
        .filter((t) => t.is_active && subjects.includes(t.subject) && occursOn(t, day.iso))
        .map((t) => ({ task: t, done: doneKeys.has(`${t.id}|${day.iso}`) }))
    }))
  }, [tasks, subjects, doneKeys, todayISO, range, offset])

  const allOn = subjects.length === SUBJECTS.length
  const toggle = (s) => setSubjects((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))

  if (failed) return <ErrorView onRetry={load} />
  if (tasks === null) return <LoadingView />

  return (
    <div>
      <div className="cal-filter">
        <span className="cal-filter-label">教科:</span>
        {/* 全教科ONのときに押すと全部OFF、それ以外は全部ON */}
        <button className={`cal-chip ${allOn ? 'on' : ''}`} onClick={() => setSubjects(allOn ? [] : SUBJECTS)}>すべて</button>
        {SUBJECTS.map((s) => (
          <button key={s} className={`cal-chip ${subjects.includes(s) ? 'on' : ''}`} style={subjectStyle(s)} onClick={() => toggle(s)}>
            {SUBJECT_EMOJI[s]} {s}
          </button>
        ))}
      </div>
      <div className="cal-nav">
        <button className="cal-nav-btn" onClick={() => setOffset((o) => o - range)} aria-label="前の期間">←</button>
        <div className="cal-nav-label">{days[0].label} 〜 {days[days.length - 1].label}</div>
        <button className="cal-nav-btn" onClick={() => setOffset((o) => o + range)} aria-label="次の期間">→</button>
        {offset !== 0 && <button className="cal-chip" onClick={() => setOffset(0)}>今日にもどる</button>}
        <div className="cal-range">
          {RANGES.map((n) => (
            <button key={n} className={`cal-chip ${range === n ? 'on' : ''}`} onClick={() => { setRange(n); setOffset(0) }}>{n}日間</button>
          ))}
        </div>
      </div>
      <p className="cal-note">
        {MARK.repeat.icon} ＝{MARK.repeat.label}　{MARK.once.icon} ＝{MARK.once.label}。やることは期日の日に出て、終わらないと翌日以降も「おくれている分」として残ります。おやすみ中のものは出ません。
      </p>

      <div className={`cal-grid r${range}`}>
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
                  <span className="cal-task-title">{task.title}</span>
                  <span className="cal-mark" title={task.frequency === 'once' ? MARK.once.label : MARK.repeat.label}>
                    {task.frequency === 'once' ? MARK.once.icon : MARK.repeat.icon}
                  </span>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
