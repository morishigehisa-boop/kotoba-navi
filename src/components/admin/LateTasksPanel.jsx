import { useMemo, useState } from 'react'
import { SUBJECT_EMOJI, subjectStyle, completionKey, buildHomeTasks, moveTaskOccurrences, restoreTaskOccurrence, SKIPPED_DATE } from '../../lib/tasks'
import { formatMD } from '../../lib/dates'
import { useConfirm } from './useConfirm'
import { useToast } from './useToast'

// 遅れている分（未完了）を選んで「今日にする」「消す」。消した分は未完了のまま、子どもの画面に出なくなる
export default function LateTasksPanel({ tasks, completions, moves, todayISO, onChanged }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(() => new Set())
  const [busy, setBusy] = useState(false)
  const [confirm, confirmModal] = useConfirm()
  const [notify, toastEl] = useToast()

  const lateItems = useMemo(
    () => buildHomeTasks(tasks, completions, todayISO, moves).todayItems.filter((i) => i.late),
    [tasks, completions, todayISO, moves]
  )
  const skipped = useMemo(() => {
    const byId = new Map(tasks.map((t) => [t.id, t]))
    return moves
      .filter((m) => m.to_date === SKIPPED_DATE && byId.has(m.task_id))
      .map((m) => ({ task: byId.get(m.task_id), date: m.from_date }))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [tasks, moves])

  if (lateItems.length === 0 && skipped.length === 0) return null

  const keyOf = (i) => completionKey(i.task.id, i.date)
  const chosen = lateItems.filter((i) => selected.has(keyOf(i)))
  const allOn = chosen.length === lateItems.length && lateItems.length > 0
  const toggle = (i) => setSelected((prev) => {
    const next = new Set(prev)
    if (next.has(keyOf(i))) next.delete(keyOf(i))
    else next.add(keyOf(i))
    return next
  })

  async function run(action, message) {
    setBusy(true)
    try {
      await action()
      setSelected(new Set())
      await onChanged()
      notify(message, 'success')
    } catch (e) {
      console.error(e)
      notify(`うまくいきませんでした：${e.message}`)
    } finally {
      setBusy(false)
    }
  }

  async function skip() {
    if (!(await confirm(`選んだ ${chosen.length}件 を消しますか？\n未完了のまま、子どもの画面には出なくなります（下の「消した分」から戻せます）。`))) return
    run(() => moveTaskOccurrences(chosen, SKIPPED_DATE), `${chosen.length}件を消しました`)
  }

  return (
    <div className="late-panel">
      <button className="late-panel-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span>⚠️ 遅れている分 {lateItems.length}件{skipped.length > 0 && `（消した分 ${skipped.length}件）`}</span>
        <span className="late-panel-hint">{open ? '▲ 閉じる' : '▼ 開いて整理する'}</span>
      </button>
      {open && (
        <div className="late-panel-body">
          {lateItems.length > 0 && (
            <>
              <div className="late-panel-actions">
                <label className="toggle-row">
                  <input type="checkbox" checked={allOn} onChange={() => setSelected(allOn ? new Set() : new Set(lateItems.map(keyOf)))} />
                  <span>すべて選ぶ</span>
                </label>
                <button className="btn btn-primary" disabled={busy || chosen.length === 0} onClick={() => run(() => moveTaskOccurrences(chosen, todayISO), `${chosen.length}件を今日の分にしました`)}>
                  今日にする（{chosen.length}）
                </button>
                <button className="btn btn-danger" disabled={busy || chosen.length === 0} onClick={skip}>消す（{chosen.length}）</button>
              </div>
              {lateItems.map((i) => (
                <label key={keyOf(i)} className="late-panel-row" style={subjectStyle(i.task.subject)}>
                  <input type="checkbox" checked={selected.has(keyOf(i))} onChange={() => toggle(i)} />
                  <span className="late-panel-date">{formatMD(i.date)}</span>
                  <span className="late-panel-title">{SUBJECT_EMOJI[i.task.subject]} {i.task.title}</span>
                </label>
              ))}
            </>
          )}
          {skipped.length > 0 && (
            <>
              <div className="late-panel-sub">消した分（未完了のまま、子どもの画面には出ません）</div>
              {skipped.map((i) => (
                <div key={keyOf(i)} className="late-panel-row skipped" style={subjectStyle(i.task.subject)}>
                  <span className="late-panel-date">{formatMD(i.date)}</span>
                  <span className="late-panel-title">{SUBJECT_EMOJI[i.task.subject]} {i.task.title}</span>
                  <button className="btn btn-secondary" disabled={busy} onClick={() => run(() => restoreTaskOccurrence(i.task.id, i.date), '元にもどしました')}>戻す</button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      {confirmModal}
      {toastEl}
    </div>
  )
}
