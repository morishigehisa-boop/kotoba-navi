import { useMemo, useState } from 'react'
import { SUBJECT_EMOJI, subjectStyle, completionKey, buildHomeTasks, moveTaskOccurrences, undoTaskMoves, SKIPPED_DATE } from '../../lib/tasks'
import { formatMD, addDaysISO } from '../../lib/dates'
import { useConfirm } from './useConfirm'
import { useToast } from './useToast'

// 遅れている分（未完了）を選んで「今日にする」「明日にする」「消す」。消した分は未完了のまま、どこにも出さない
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
  if (lateItems.length === 0) return toastEl // 最後の1件を整理したあとも、お知らせは出す

  const keyOf = (i) => completionKey(i.task.id, i.date)
  const chosen = lateItems.filter((i) => selected.has(keyOf(i)))
  const allOn = chosen.length === lateItems.length && lateItems.length > 0
  const toggle = (i) => setSelected((prev) => {
    const next = new Set(prev)
    if (next.has(keyOf(i))) next.delete(keyOf(i))
    else next.add(keyOf(i))
    return next
  })

  // 選んだ分を toDate に移す（SKIPPED_DATE なら消す）。直後なら「元に戻す」で前の状態にもどせる
  async function run(toDate, message) {
    const items = chosen
    const prevTo = new Map(moves.map((m) => [completionKey(m.task_id, m.from_date), m.to_date]))
    const before = items.map((i) => ({ task_id: i.task.id, from_date: i.date, to_date: prevTo.get(keyOf(i)) || null }))
    setBusy(true)
    try {
      await moveTaskOccurrences(items, toDate)
      setSelected(new Set())
      await onChanged()
      notify(message, 'success', { undo: async () => { await undoTaskMoves(before); await onChanged() } })
    } catch (e) {
      console.error(e)
      notify(`うまくいきませんでした：${e.message}`)
    } finally {
      setBusy(false)
    }
  }

  async function skip() {
    if (!(await confirm(`選んだ ${chosen.length}件 を消しますか？\n未完了のまま、子どもの画面にも管理画面にも出なくなります（直後なら「元に戻す」で戻せます）。`))) return
    run(SKIPPED_DATE, `${chosen.length}件を消しました`)
  }

  return (
    <div className="late-panel">
      <button className="late-panel-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span>⚠️ 遅れている分 {lateItems.length}件</span>
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
                <button className="btn btn-primary" disabled={busy || chosen.length === 0} onClick={() => run(todayISO, `${chosen.length}件を今日の分にしました`)}>
                  今日にする（{chosen.length}）
                </button>
                <button className="btn btn-secondary" disabled={busy || chosen.length === 0} onClick={() => run(addDaysISO(todayISO, 1), `${chosen.length}件を明日の分にしました`)}>
                  明日にする（{chosen.length}）
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
        </div>
      )}
      {confirmModal}
      {toastEl}
    </div>
  )
}
