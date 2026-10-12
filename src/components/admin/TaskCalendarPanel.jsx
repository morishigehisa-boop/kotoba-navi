import { useEffect, useMemo, useState } from 'react'
import { SUBJECTS, SUBJECT_EMOJI, WEEKDAY_LABELS, subjectStyle, toISODate, occursOn, fetchTasks, fetchTaskCompletions, fetchMilestones, saveMilestone, deleteMilestone } from '../../lib/tasks'
import { LoadingView, ErrorView } from '../common/Status'
import { useConfirm } from './useConfirm'
import { useToast } from './useToast'

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
  const [milestones, setMilestones] = useState([])
  const [failed, setFailed] = useState(false)
  const [showEvents, setShowEvents] = useState(false) // イベント登録・一覧の開閉
  const [evForm, setEvForm] = useState({ event_date: toISODate(), title: '' })
  const [evEditingId, setEvEditingId] = useState(null)
  const [evSaving, setEvSaving] = useState(false)
  const [confirm, confirmModal] = useConfirm()
  const [notify, toastEl] = useToast()
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
    Promise.all([fetchTasks(), fetchTaskCompletions(), fetchMilestones()])
      .then(([t, c, m]) => { setTasks(t); setCompletions(c); setMilestones(m) })
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

  // 表示中の期間にあるイベント（日付ごと）／今日以降のイベント一覧
  const eventsByDate = useMemo(() => {
    const map = new Map()
    milestones.forEach((m) => map.set(m.event_date, [...(map.get(m.event_date) || []), m]))
    return map
  }, [milestones])
  const rangeEvents = milestones.filter((m) => m.event_date >= days[0].iso && m.event_date <= days[days.length - 1].iso)
  const daysUntil = (iso) => Math.round((new Date(iso) - new Date(todayISO)) / 86400000)

  const allOn = subjects.length === SUBJECTS.length
  async function submitEvent(e) {
    e.preventDefault()
    const title = evForm.title.trim()
    if (!title || !evForm.event_date) return notify('日付とイベント名を入れてください')
    setEvSaving(true)
    try {
      await saveMilestone({ event_date: evForm.event_date, title }, evEditingId)
      setMilestones(await fetchMilestones())
      setEvForm({ event_date: evForm.event_date, title: '' })
      setEvEditingId(null)
      notify(evEditingId ? 'イベントを更新しました' : 'イベントを登録しました')
    } catch (err) {
      notify(`保存に失敗しました：${err.message}`)
    } finally {
      setEvSaving(false)
    }
  }

  async function removeEvent(m) {
    if (!(await confirm(`「${m.title}」（${m.event_date}）を削除しますか？`))) return
    try {
      await deleteMilestone(m.id)
      setMilestones((p) => p.filter((x) => x.id !== m.id))
      if (evEditingId === m.id) { setEvEditingId(null); setEvForm({ event_date: toISODate(), title: '' }) }
    } catch (err) {
      notify(`削除に失敗しました：${err.message}`)
    }
  }

  const toggle = (s) => setSubjects((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))

  if (failed) return <ErrorView onRetry={load} />
  if (tasks === null) return <LoadingView />

  return (
    <div>
      {/* マイルストーン：表示中の期間にあるイベントを、カレンダーの上に並べる */}
      <div className="ms-bar">
        <div className="ms-list">
          {rangeEvents.length === 0 ? (
            <span className="ms-none">この期間のイベントはありません</span>
          ) : (
            rangeEvents.map((m) => {
              const n = daysUntil(m.event_date)
              const [, mo, d] = m.event_date.split('-').map(Number)
              return (
                <span key={m.id} className="ms-chip">
                  🚩 {mo}/{d}（{WEEKDAY_LABELS[new Date(m.event_date).getUTCDay()]}）{m.title}
                  {n >= 0 && <b className="ms-left">{n === 0 ? '今日' : `あと${n}日`}</b>}
                </span>
              )
            })
          )}
        </div>
        <button className="btn btn-secondary ms-manage" onClick={() => setShowEvents((v) => !v)}>
          {showEvents ? '閉じる' : '＋ イベントを登録・編集'}
        </button>
      </div>

      {showEvents && (
        <div className="card ms-panel">
          <form className="ms-form" onSubmit={submitEvent}>
            <input type="date" value={evForm.event_date} onChange={(e) => setEvForm({ ...evForm, event_date: e.target.value })} />
            <input type="text" placeholder="イベント名（例：漢字テスト）" maxLength={40} value={evForm.title} onChange={(e) => setEvForm({ ...evForm, title: e.target.value })} />
            <button className="btn btn-primary" disabled={evSaving}>{evEditingId ? '更新する' : '登録する'}</button>
            {evEditingId && <button type="button" className="btn btn-secondary" onClick={() => { setEvEditingId(null); setEvForm({ event_date: toISODate(), title: '' }) }}>やめる</button>}
          </form>
          {milestones.length === 0 ? (
            <p className="empty">まだイベントがありません</p>
          ) : (
            <ul className="ms-items">
              {milestones.map((m) => (
                <li key={m.id} className={m.event_date < todayISO ? 'past' : ''}>
                  <span className="ms-items-date">{m.event_date}</span>
                  <span className="ms-items-title">{m.title}</span>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => { setEvEditingId(m.id); setEvForm({ event_date: m.event_date, title: m.title }) }}>編集</button>
                  <button className="btn btn-danger" onClick={() => removeEvent(m)}>削除</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {confirmModal}
      {toastEl}

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
