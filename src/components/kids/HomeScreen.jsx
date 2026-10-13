import { useEffect, useMemo, useState } from 'react'
import Character from './Character'
import { LoadingView, ErrorView } from '../common/Status'
import { SUBJECTS, SUBJECT_EMOJI, subjectStyle, taskPoints, completionKey, buildHomeTasks, buildTomorrowItems, fetchMilestones, fetchTasks, fetchTaskCompletions, completeTask, uncompleteTask } from '../../lib/tasks'
import { toISODate, formatMD, daysBetweenISO } from '../../lib/dates'

const LATE_OPEN_LIMIT = 5 // おくれている分が これ以下なら、はじめから ひらいておく

function TaskRow({ item, done, soon, noNote, showSubject, onToggle, onOpenApp }) {
  const { task } = item
  return (
    <div className={`task-row ${done ? 'done' : ''} ${soon ? 'soon' : ''}`} style={subjectStyle(task.subject)}>
      <button className="task-main" disabled={soon} onClick={() => onToggle(item, !done)}>
        <span className="task-check">{done ? '✓' : ''}</span>
        <span className="task-text">
          {showSubject && <span className="task-subject-tag">{SUBJECT_EMOJI[task.subject]} {task.subject}</span>}
          <span className="task-title">{task.title}</span>
          {soon && !noNote && <span className="task-note">{formatMD(item.date)} まで</span>}
          {done && item.late && <span className="task-note">{formatMD(item.date)} の分</span>}
        </span>
      </button>
      {!done && !soon && task.link_to && (
        <button className="task-go" onClick={() => onOpenApp(task.link_to)}>▶ 始める</button>
      )}
    </div>
  )
}

// ホーム画面：管理画面で登録した「きょうのやること」を、教科ごとに並べる。
// おわったものはタップで一覧から消え、下の「きょうおわったこと」から戻せる。
// @param onTaskChange  完了／取り消しのたびに親へ知らせる（ポイントや効果音は親が担当）
export default function HomeScreen({ character, accessory, pendingSession, onResumeSession, onOpenApp, onTaskChange }) {
  const [tasks, setTasks] = useState(null)
  const [completions, setCompletions] = useState([])
  const [loadFailed, setLoadFailed] = useState(false)
  const [todayISO, setTodayISO] = useState(() => toISODate())
  const [error, setError] = useState('')
  const [lateOpen, setLateOpen] = useState(null) // null＝件数におまかせ
  const [tomorrowOpen, setTomorrowOpen] = useState(false)
  const [events, setEvents] = useState([])

  function load() {
    setLoadFailed(false)
    Promise.all([fetchTasks(), fetchTaskCompletions()])
      .then(([t, c]) => { setTasks(t); setCompletions(c) })
      .catch((e) => { console.error(e); setLoadFailed(true) })
  }

  useEffect(load, [])

  // イベント（テストなど）は、読めなくてもホームは使えるようにする
  useEffect(() => { fetchMilestones().then(setEvents).catch(console.error) }, [])

  // 画面を開いたまま日付がかわっても、今日の分に切りかわるようにする
  useEffect(() => {
    const refresh = () => setTodayISO(toISODate())
    document.addEventListener('visibilitychange', refresh)
    return () => document.removeEventListener('visibilitychange', refresh)
  }, [])

  const { todayItems, upcoming, doneToday } = useMemo(
    () => buildHomeTasks(tasks || [], completions, todayISO),
    [tasks, completions, todayISO]
  )
  const tomorrowItems = useMemo(() => buildTomorrowItems(tasks || [], todayISO), [tasks, todayISO])
  const tomorrowISO = tomorrowItems[0]?.date
  // 「もうすぐ」には、あしたの分を二重に出さない
  const soonItems = upcoming.filter((i) => i.date !== tomorrowISO)
  // 近いイベントを2つ（今日以降）
  const nextEvents = useMemo(() => events.filter((e) => e.event_date >= todayISO).slice(0, 2), [events, todayISO])
  const todayLeft = todayItems.filter((i) => !i.late)
  const lateItems = todayItems.filter((i) => i.late)
  const todayDoneCount = doneToday.filter((i) => !i.late).length
  const todayTotal = todayLeft.length + todayDoneCount
  const lateIsOpen = lateOpen ?? lateItems.length <= LATE_OPEN_LIMIT

  async function handleToggle(item, toDone) {
    const { id, title } = item.task
    const prev = completions
    const pts = taskPoints(item.task)
    const next = toDone
      ? [...prev, { task_id: id, occurrence_date: item.date, completed_at: new Date().toISOString(), points_awarded: pts }]
      : prev.filter((c) => !(c.task_id === id && c.occurrence_date === item.date))
    // 先に画面へ反映して、通信が失敗したら元にもどす
    setCompletions(next)
    setError('')
    let points = pts
    try {
      if (toDone) {
        const inserted = await completeTask(id, item.date, pts)
        if (!inserted) return // 連打などで、すでに完了ずみ。ポイントは二重に付けない
      } else {
        points = await uncompleteTask(id, item.date) // 完了したときに付いたポイントを取り消す
      }
    } catch (e) {
      console.error(e)
      setCompletions(prev)
      setError('うまくいかなかったよ。もう一度押してね')
      return
    }
    const after = buildHomeTasks(tasks, next, todayISO)
    const allTodayDone = after.todayItems.every((i) => i.late) && after.doneToday.some((i) => !i.late)
    onTaskChange(toDone ? 'done' : 'undone', { allTodayDone, points, title })
  }

  const message = tasks === null
    ? '今日のやること、見てみよう'
    : todayTotal === 0
      ? lateItems.length > 0 ? '遅れている分をやってみよう' : '今日のやることはないよ'
      : todayLeft.length === 0
        ? '🎉 今日の分は全部終わったよ！'
        : `あと${todayLeft.length}個！頑張ろう`

  const groups = SUBJECTS.map((s) => [s, todayLeft.filter((i) => i.task.subject === s)]).filter(([, list]) => list.length > 0)
  const lateDates = [...new Set(lateItems.map((i) => i.date))].sort()
  const rowProps = { onToggle: handleToggle, onOpenApp }

  return (
    <div className="home">
      <div className="home-hero">
        <div className="mascot-mini">
          <Character character={character} state={todayTotal > 0 && todayLeft.length === 0 ? 'happy' : 'idle'} accessory={accessory} />
        </div>
        <div className="home-hero-body">
          <div className="home-app-name">勉強がんばるアプリ</div>
          <div className="home-message">{message}</div>
          {todayTotal > 0 && (
            <div className="home-progress" aria-label={`今日の分 ${todayDoneCount}/${todayTotal}`}>
              <div className="progress-wrap"><div className="progress-bar" style={{ width: `${Math.round((todayDoneCount / todayTotal) * 100)}%` }} /></div>
              <span className="home-progress-num">{todayDoneCount}/{todayTotal}</span>
            </div>
          )}
        </div>
      </div>

      {nextEvents.length > 0 && (
        <div className="home-events">
          {nextEvents.map((e) => {
            const n = daysBetweenISO(todayISO, e.event_date)
            return (
              <div key={e.id} className="home-event">
                <span className="home-event-flag">🚩</span>
                <span className="home-event-title">{e.title}</span>
                <span className="home-event-date">{formatMD(e.event_date, false)}</span>
                <span className={`home-event-left ${n <= 3 ? 'near' : ''}`}>{n === 0 ? '今日！' : `あと${n}日`}</span>
              </div>
            )
          })}
        </div>
      )}

      {pendingSession && (
        <div className="resume-card">
          <div className="resume-text">📖 ことばナビの続き（{pendingSession.idx || 0}/{pendingSession.questionIds.length}問）</div>
          <button className="resume-go" onClick={onResumeSession}>続きから</button>
        </div>
      )}

      {error && <div className="home-error">{error}</div>}
      {loadFailed && <ErrorView message="やることを開けなかったよ" onRetry={load} />}
      {!loadFailed && tasks === null && <LoadingView />}

      {lateItems.length > 0 && (
        <section className="task-group late-group">
          <button className="late-toggle" aria-expanded={lateIsOpen} onClick={() => setLateOpen(!lateIsOpen)}>
            <span>⚠️ 遅れている分 {lateItems.length}個</span>
            <span className="late-toggle-hint">{lateIsOpen ? '▲ 閉じる' : '▼ 開く'}</span>
          </button>
          {lateIsOpen && lateDates.map((date) => (
            <div key={date}>
              <div className="late-date">{formatMD(date)}</div>
              {lateItems.filter((i) => i.date === date).map((item) => <TaskRow key={completionKey(item.task.id, item.date)} item={item} showSubject {...rowProps} />)}
            </div>
          ))}
        </section>
      )}

      {groups.map(([subject, list]) => (
        <section key={subject} className="task-group">
          <div className="task-subject" style={subjectStyle(subject)}>{SUBJECT_EMOJI[subject]} {subject}</div>
          {list.map((item) => <TaskRow key={completionKey(item.task.id, item.date)} item={item} {...rowProps} />)}
        </section>
      ))}

      {soonItems.length > 0 && (
        <section className="task-group">
          <div className="task-subject soon-label">⏰ もうすぐ</div>
          {soonItems.map((item) => <TaskRow key={completionKey(item.task.id, item.date)} item={item} soon showSubject {...rowProps} />)}
        </section>
      )}

      {tomorrowItems.length > 0 && (
        <section className="task-group late-group tomorrow-group">
          <button className="late-toggle" aria-expanded={tomorrowOpen} onClick={() => setTomorrowOpen(!tomorrowOpen)}>
            <span>🌙 明日の分 {tomorrowItems.length}個</span>
            <span className="late-toggle-hint">{tomorrowOpen ? '▲ 閉じる' : '▼ 開く'}</span>
          </button>
          {tomorrowOpen && tomorrowItems.map((item) => <TaskRow key={completionKey(item.task.id, item.date)} item={item} soon noNote showSubject {...rowProps} />)}
        </section>
      )}

      {doneToday.length > 0 && (
        <section className="task-group">
          <div className="task-subject done-label">✅ 今日終わったこと（押すと戻せるよ）</div>
          {doneToday.map((item) => <TaskRow key={completionKey(item.task.id, item.date)} item={item} done showSubject {...rowProps} />)}
        </section>
      )}
    </div>
  )
}
