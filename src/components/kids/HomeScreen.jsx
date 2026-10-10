import { useEffect, useMemo, useState } from 'react'
import Character from './Character'
import { LoadingView, ErrorView } from '../common/Status'
import { SUBJECTS, SUBJECT_EMOJI, subjectStyle, formatMD, toISODate, buildHomeTasks, fetchTasks, fetchTaskCompletions, completeTask, uncompleteTask } from '../../lib/tasks'

const LATE_OPEN_LIMIT = 5 // おくれている分が これ以下なら、はじめから ひらいておく

function TaskRow({ item, done, soon, showSubject, onToggle, onOpenApp }) {
  const { task } = item
  return (
    <div className={`task-row ${done ? 'done' : ''} ${soon ? 'soon' : ''}`} style={subjectStyle(task.subject)}>
      <button className="task-main" disabled={soon} onClick={() => onToggle(item, !done)}>
        <span className="task-check">{done ? '✓' : ''}</span>
        <span className="task-text">
          {showSubject && <span className="task-subject-tag">{SUBJECT_EMOJI[task.subject]} {task.subject}</span>}
          <span className="task-title">{task.title}</span>
          {soon && <span className="task-note">{formatMD(item.date)} まで</span>}
          {done && item.late && <span className="task-note">{formatMD(item.date)} の分</span>}
        </span>
      </button>
      {!done && !soon && task.link_to && (
        <button className="task-go" onClick={() => onOpenApp(task.link_to)}>▶ はじめる</button>
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

  function load() {
    setLoadFailed(false)
    Promise.all([fetchTasks(), fetchTaskCompletions()])
      .then(([t, c]) => { setTasks(t); setCompletions(c) })
      .catch((e) => { console.error(e); setLoadFailed(true) })
  }

  useEffect(load, [])

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
  const todayLeft = todayItems.filter((i) => !i.late)
  const lateItems = todayItems.filter((i) => i.late)
  const todayDoneCount = doneToday.filter((i) => !i.late).length
  const todayTotal = todayLeft.length + todayDoneCount
  const lateIsOpen = lateOpen ?? lateItems.length <= LATE_OPEN_LIMIT

  async function handleToggle(item, toDone) {
    const { id } = item.task
    const prev = completions
    const next = toDone
      ? [...prev, { task_id: id, occurrence_date: item.date, completed_at: new Date().toISOString() }]
      : prev.filter((c) => !(c.task_id === id && c.occurrence_date === item.date))
    // 先に画面へ反映して、通信が失敗したら元にもどす
    setCompletions(next)
    setError('')
    try {
      await (toDone ? completeTask(id, item.date) : uncompleteTask(id, item.date))
    } catch (e) {
      console.error(e)
      setCompletions(prev)
      setError('うまくいかなかったよ。もういちど おしてね')
      return
    }
    const after = buildHomeTasks(tasks, next, todayISO)
    const allTodayDone = after.todayItems.every((i) => i.late) && after.doneToday.some((i) => !i.late)
    onTaskChange(toDone ? 'done' : 'undone', { allTodayDone })
  }

  const message = tasks === null
    ? 'きょうの やること、みてみよう'
    : todayTotal === 0
      ? lateItems.length > 0 ? 'おくれている分を やってみよう' : 'きょうの やることは ないよ'
      : todayLeft.length === 0
        ? '🎉 きょうの分は ぜんぶ おわったよ！'
        : `あと ${todayLeft.length}こ！ がんばろう`

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
            <div className="home-progress" aria-label={`きょうの分 ${todayDoneCount}/${todayTotal}`}>
              <div className="progress-wrap"><div className="progress-bar" style={{ width: `${Math.round((todayDoneCount / todayTotal) * 100)}%` }} /></div>
              <span className="home-progress-num">{todayDoneCount}/{todayTotal}</span>
            </div>
          )}
        </div>
      </div>

      {pendingSession && (
        <div className="resume-card">
          <div className="resume-text">📖 ことばナビの つづきが あるよ（{pendingSession.idx || 0}/{pendingSession.questionIds.length}問目）</div>
          <div className="resume-buttons">
            <button className="restart" style={{ marginTop: 0 }} onClick={onResumeSession}>つづきから やる</button>
          </div>
        </div>
      )}

      {error && <div className="home-error">{error}</div>}
      {loadFailed && <ErrorView message="やることを ひらけなかったよ" onRetry={load} />}
      {!loadFailed && tasks === null && <LoadingView />}

      {groups.map(([subject, list]) => (
        <section key={subject} className="task-group">
          <div className="task-subject" style={subjectStyle(subject)}>{SUBJECT_EMOJI[subject]} {subject}</div>
          {list.map((item) => <TaskRow key={`${item.task.id}|${item.date}`} item={item} {...rowProps} />)}
        </section>
      ))}

      {lateItems.length > 0 && (
        <section className="task-group late-group">
          <button className="late-toggle" aria-expanded={lateIsOpen} onClick={() => setLateOpen(!lateIsOpen)}>
            <span>⚠️ おくれている分 {lateItems.length}こ</span>
            <span className="late-toggle-hint">{lateIsOpen ? '▲ とじる' : '▼ ひらく'}</span>
          </button>
          {lateIsOpen && lateDates.map((date) => (
            <div key={date}>
              <div className="late-date">{formatMD(date)}</div>
              {lateItems.filter((i) => i.date === date).map((item) => <TaskRow key={`${item.task.id}|${item.date}`} item={item} showSubject {...rowProps} />)}
            </div>
          ))}
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="task-group">
          <div className="task-subject soon-label">⏰ もうすぐ</div>
          {upcoming.map((item) => <TaskRow key={`${item.task.id}|${item.date}`} item={item} soon showSubject {...rowProps} />)}
        </section>
      )}

      {doneToday.length > 0 && (
        <section className="task-group">
          <div className="task-subject done-label">✅ きょうおわったこと（おすと もどせるよ）</div>
          {doneToday.map((item) => <TaskRow key={`${item.task.id}|${item.date}`} item={item} done showSubject {...rowProps} />)}
        </section>
      )}
    </div>
  )
}
