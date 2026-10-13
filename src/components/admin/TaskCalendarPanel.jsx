import { useEffect, useMemo, useState } from 'react'
import { subjectStyle, occursOn, completionKey, fetchTasks, fetchTaskCompletions, fetchMilestones } from '../../lib/tasks'
import { toISODate, parseISO, addDaysISO, daysBetweenISO, formatMD, WEEKDAY_LABELS } from '../../lib/dates'
import { loadString, saveString, STORAGE_KEYS } from '../../lib/storage'
import { LoadingView, ErrorView } from '../common/Status'
import { useSubjectFilter } from './useSubjectFilter'
import SubjectFilter from './SubjectFilter'

const RANGES = [7, 10, 30] // 表示する日数の選び方
const DEFAULT_RANGE = 10

// 「くりかえし」か「1どだけ」かを示す記号（タスクの右はしに出す）
const MARK = { repeat: { icon: '🔁', label: '繰り返し' }, once: { icon: '①', label: '1度だけ' } }

// startISO から count 日分の日付（'YYYY-MM-DD'）を作る
function buildDays(startISO, count) {
  return Array.from({ length: count }, (_, i) => {
    const iso = addDaysISO(startISO, i)
    return { iso, label: formatMD(iso, false), wd: parseISO(iso).getDay() }
  })
}

// 「何日に どのやることが 子どもの画面に出るか」を、日付ごとに並べて見る画面。
// やることは、期日の日に出る（終わるまで翌日以降も「遅れている分」として残る）
export default function TaskCalendarPanel() {
  const [tasks, setTasks] = useState(null)
  const [completions, setCompletions] = useState([])
  const [milestones, setMilestones] = useState([])
  const [failed, setFailed] = useState(false)
  const [subjects, setSubjects] = useSubjectFilter() // 表示する教科（前回の選択を引き継ぐ）
  const [range, setRangeState] = useState(() => {
    const n = Number(loadString(STORAGE_KEYS.adminCalRange))
    return RANGES.includes(n) ? n : DEFAULT_RANGE
  })
  const [offset, setOffset] = useState(0) // 今日から何日ずらしているか
  const todayISO = toISODate()

  function setRange(n) {
    setRangeState(n)
    saveString(STORAGE_KEYS.adminCalRange, String(n))
  }

  function load() {
    setFailed(false)
    Promise.all([fetchTasks(), fetchTaskCompletions(), fetchMilestones()])
      .then(([t, c, m]) => { setTasks(t); setCompletions(c); setMilestones(m) })
      .catch((e) => { console.error(e); setFailed(true) })
  }
  useEffect(load, [])

  const doneKeys = useMemo(() => new Set(completions.map((c) => completionKey(c.task_id, c.occurrence_date))), [completions])

  const days = useMemo(() => {
    const list = buildDays(addDaysISO(todayISO, offset), range)
    return list.map((day) => ({
      ...day,
      items: (tasks || [])
        .filter((t) => t.is_active && subjects.includes(t.subject) && occursOn(t, day.iso))
        .map((t) => ({ task: t, done: doneKeys.has(completionKey(t.id, day.iso)) }))
    }))
  }, [tasks, subjects, doneKeys, todayISO, range, offset])

  // 表示中の期間にあるイベント（日付ごと）／今日以降のイベント一覧
  const eventsByDate = useMemo(() => {
    const map = new Map()
    milestones.forEach((m) => map.set(m.event_date, [...(map.get(m.event_date) || []), m]))
    return map
  }, [milestones])
  // 上の黄色い帯は、表示中の期間に関係なく「今日から1ヶ月先まで」のイベントを出す
  const upcomingEvents = useMemo(() => {
    const t = parseISO(todayISO)
    const limit = toISODate(new Date(t.getFullYear(), t.getMonth() + 1, t.getDate())) // 1ヶ月後の同じ日
    return milestones.filter((e) => e.event_date >= todayISO && e.event_date <= limit)
  }, [milestones, todayISO])

  if (failed) return <ErrorView onRetry={load} />
  if (tasks === null) return <LoadingView />

  return (
    <div>
      {/* マイルストーン：今日から1ヶ月先までのイベントを、カレンダーの上に並べる */}
      <div className="ms-bar">
        <div className="ms-list">
          {upcomingEvents.length === 0 ? (
            <span className="ms-none">今後1ヶ月のイベントはありません</span>
          ) : (
            upcomingEvents.map((m) => {
              const n = daysBetweenISO(todayISO, m.event_date)
              return (
                <span key={m.id} className="ms-chip">
                  🚩 {formatMD(m.event_date)}{m.title}
                  {n >= 0 && <b className="ms-left">{n === 0 ? '今日' : `あと${n}日`}</b>}
                </span>
              )
            })
          )}
        </div>
      </div>

      <SubjectFilter subjects={subjects} onChange={setSubjects} />
      <div className="cal-nav">
        <button className="cal-nav-btn" onClick={() => setOffset((o) => o - range)} aria-label="前の期間">←</button>
        <div className="cal-nav-label">{days[0].label} 〜 {days[days.length - 1].label}</div>
        <button className="cal-nav-btn" onClick={() => setOffset((o) => o + range)} aria-label="次の期間">→</button>
        {offset !== 0 && <button className="cal-chip" onClick={() => setOffset(0)}>今日に戻る</button>}
        <div className="cal-range">
          {RANGES.map((n) => (
            <button key={n} className={`cal-chip ${range === n ? 'on' : ''}`} onClick={() => { setRange(n); setOffset(0) }}>{n}日間</button>
          ))}
        </div>
      </div>
      <p className="cal-note">
        {MARK.repeat.icon} ＝{MARK.repeat.label} {MARK.once.icon} ＝{MARK.once.label}。やることは期日の日に出て、終わらないと翌日以降も「遅れている分」として残ります。休止中のものは出ません。
      </p>

      <div className={`cal-grid r${range}`}>
        {days.map((day) => (
          <div key={day.iso} className={`cal-day ${day.iso === todayISO ? 'today' : ''} ${day.wd === 0 ? 'sun' : day.wd === 6 ? 'sat' : ''}`}>
            <div className="cal-day-head">
              <span>{day.label}（{WEEKDAY_LABELS[day.wd]}）</span>
              {day.iso === todayISO && <span className="cal-today-badge">今日</span>}
              <span className="cal-count">{day.items.length}件</span>
            </div>
            {(eventsByDate.get(day.iso) || []).map((m) => (
              <div key={m.id} className="cal-event">🚩 {m.title}</div>
            ))}
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
