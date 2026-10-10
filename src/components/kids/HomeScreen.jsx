import { useEffect, useMemo, useState } from 'react'
import { SUBJECTS, SUBJECT_EMOJI, subjectStyle, formatMD, toISODate, buildHomeTasks, fetchTasks, fetchTaskCompletions, completeTask, uncompleteTask } from '../../lib/tasks'

function TaskRow({ item, onToggle, done, soon }) {
  const { task, late } = item
  return (
    <button className={`task-row ${done ? 'done' : ''} ${item.overdue ? 'overdue' : ''} ${soon ? 'soon' : ''}`} onClick={() => onToggle(item, !done)} disabled={soon} style={subjectStyle(task.subject)}>
      <span className="task-check">{done ? '✓' : ''}</span>
      <span className="task-text">
        <span className="task-title">{task.title}</span>
        {late && <span className="task-note">{done ? '' : '⚠️ '}{task.frequency === 'once' ? `${formatMD(item.date)} までだったよ` : `${formatMD(item.date)} の分`}</span>}
        {soon && <span className="task-note">{formatMD(item.date)} まで</span>}
      </span>
    </button>
  )
}

// ホーム画面：管理画面で登録した「今日のやること」を教科ごとに並べる。
// おわったものは、タップで一覧から消える（下の「きょうおわったこと」から戻せる）。
export default function HomeScreen({ onStartKotoba, pendingSession, onResumeSession }) {
  const [tasks, setTasks] = useState(null)
  const [completions, setCompletions] = useState([])
  const [todayISO, setTodayISO] = useState(() => toISODate())
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetchTasks(), fetchTaskCompletions()])
      .then(([t, c]) => { setTasks(t); setCompletions(c) })
      .catch(() => { setTasks([]); setError('やることを よみこめなかったよ。もういちど ひらいてね') })
  }, [])

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

  async function handleToggle(item, toDone) {
    const { id } = item.task
    const prev = completions
    // 先に画面へ反映して、通信が失敗したら元にもどす
    setCompletions(toDone ? [...prev, { task_id: id, occurrence_date: item.date, completed_at: new Date().toISOString() }] : prev.filter((c) => !(c.task_id === id && c.occurrence_date === item.date)))
    setError('')
    try {
      await (toDone ? completeTask(id, item.date) : uncompleteTask(id, item.date))
    } catch {
      setCompletions(prev)
      setError('うまくいかなかったよ。もういちど おしてね')
    }
  }

  const groups = SUBJECTS.map((s) => [s, todayItems.filter((i) => i.task.subject === s)]).filter(([, list]) => list.length > 0)
  const allDone = tasks !== null && todayItems.length === 0 && doneToday.length > 0

  return (
    <div className="home">
      <h2 className="home-title">📝 きょうのやること</h2>
      {error && <div className="home-error">{error}</div>}

      {tasks === null && <p className="home-empty">よみこみちゅう…</p>}
      {tasks !== null && todayItems.length === 0 && (
        <div className="home-empty">{allDone ? '🎉 ぜんぶ おわったよ！すごい！' : 'きょうの やることは ないよ'}</div>
      )}

      {groups.map(([subject, list]) => (
        <section key={subject} className="task-group">
          <div className="task-subject" style={subjectStyle(subject)}>{SUBJECT_EMOJI[subject]} {subject}</div>
          {list.map((item) => <TaskRow key={`${item.task.id}|${item.date}`} item={item} onToggle={handleToggle} />)}
        </section>
      ))}

      {upcoming.length > 0 && (
        <section className="task-group">
          <div className="task-subject soon-label">⏰ もうすぐ</div>
          {upcoming.map((item) => <TaskRow key={`${item.task.id}|${item.date}`} item={item} soon />)}
        </section>
      )}

      {doneToday.length > 0 && (
        <section className="task-group">
          <div className="task-subject done-label">✅ きょうおわったこと（おすと もどせるよ）</div>
          {doneToday.map((item) => <TaskRow key={`${item.task.id}|${item.date}`} item={item} done onToggle={handleToggle} />)}
        </section>
      )}

      {pendingSession && (
        <div className="resume-card">
          <div className="resume-text">📖 ことばナビの つづきが あるよ（{pendingSession.idx || 0}/{pendingSession.questionIds.length}問目）</div>
          <div className="resume-buttons">
            <button className="restart" style={{ marginTop: 0 }} onClick={onResumeSession}>つづきから やる</button>
          </div>
        </div>
      )}

      <div className="app-switch">
        <button className="app-tile kotoba" onClick={onStartKotoba}><span className="app-emoji">📚</span>ことばナビ</button>
        <a className="app-tile sansu" href="/sansu"><span className="app-emoji">🔢</span>さんすうナビ</a>
      </div>
    </div>
  )
}
