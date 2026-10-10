import { useEffect, useState } from 'react'
import { SUBJECTS, SUBJECT_EMOJI, SUBJECT_COLORS, FREQUENCIES, WEEKDAY_LABELS, toISODate, describeSchedule, fetchTasks, saveTask, deleteTask, reorderTasks } from '../../lib/tasks'
import { useConfirm } from './useConfirm'
import { useToast } from './useToast'

const emptyForm = () => ({ subject: '算数', title: '', due_date: toISODate(), frequency: 'once', weekdays: [], end_date: '' })

// 「やること」の登録・編集・おやすみ（無効化）・削除。子どものホーム画面に表示される。
export default function TasksPanel() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm())
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [dragId, setDragId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const [confirm, confirmModal] = useConfirm()
  const [notify, toastEl] = useToast()

  const reload = () => fetchTasks().then(setTasks)

  useEffect(() => {
    reload().catch((e) => notify(`よみこみに失敗しました：${e.message}`)).finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const toggleWeekday = (d) =>
    set({ weekdays: form.weekdays.includes(d) ? form.weekdays.filter((x) => x !== d) : [...form.weekdays, d] })

  function resetForm() {
    setForm(emptyForm())
    setEditingId(null)
  }

  function startEdit(t) {
    setEditingId(t.id)
    setForm({ subject: t.subject, title: t.title, due_date: t.due_date, frequency: t.frequency, weekdays: t.weekdays || [], end_date: t.end_date || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSave() {
    if (!form.title.trim()) return notify('「やること」を入力してください')
    if (!form.due_date) return notify('期日を選んでください')
    if (form.end_date && form.end_date < form.due_date) return notify('終了日は、期日より後の日にしてください')
    setSaving(true)
    try {
      await saveTask(
        {
          subject: form.subject,
          title: form.title.trim(),
          due_date: form.due_date,
          frequency: form.frequency,
          weekdays: form.frequency === 'weekly' ? form.weekdays : [],
          end_date: form.frequency === 'once' ? null : form.end_date || null,
          // 新規は一番下に追加する
          ...(editingId ? {} : { sort_order: tasks.reduce((m, t) => Math.max(m, t.sort_order), 0) + 1 })
        },
        editingId
      )
      await reload()
      notify(editingId ? '更新しました' : '登録しました', 'success')
      resetForm()
    } catch (e) {
      notify(`保存に失敗しました：${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  // 並び順を画面に先に反映し、保存に失敗したら元に戻す
  async function applyOrder(next) {
    const prev = tasks
    setTasks(next.map((t, i) => ({ ...t, sort_order: i + 1 })))
    try {
      await reorderTasks(next)
    } catch (e) {
      setTasks(prev)
      notify(`並べ替えに失敗しました：${e.message}`)
    }
  }

  function handleDrop(targetId) {
    setDragOverId(null)
    if (dragId === null || dragId === targetId) return setDragId(null)
    const next = [...tasks]
    const [moved] = next.splice(tasks.findIndex((t) => t.id === dragId), 1)
    next.splice(tasks.findIndex((t) => t.id === targetId), 0, moved)
    setDragId(null)
    applyOrder(next)
  }

  function moveByOffset(index, offset) {
    const target = index + offset
    if (target < 0 || target >= tasks.length) return
    const next = [...tasks]
    ;[next[index], next[target]] = [next[target], next[index]]
    applyOrder(next)
  }

  async function toggleActive(t) {
    try {
      await saveTask({ is_active: !t.is_active }, t.id)
      await reload()
    } catch (e) {
      notify(`変更に失敗しました：${e.message}`)
    }
  }

  async function handleDelete(t) {
    if (!(await confirm(`「${t.title}」を削除しますか？\n完了の記録も消えます。`))) return
    try {
      await deleteTask(t.id)
      await reload()
      notify('削除しました', 'success')
    } catch (e) {
      notify(`削除に失敗しました：${e.message}`)
    }
  }

  const today = toISODate()

  return (
    <div>
      <div className="card">
        <h2>{editingId ? 'やることを編集' : 'やることを登録'}</h2>
        <div className="task-form">
          <div>
            <label className="f-label">教科</label>
            <select value={form.subject} onChange={(e) => set({ subject: e.target.value })}>
              {SUBJECTS.map((s) => <option key={s} value={s}>{SUBJECT_EMOJI[s]} {s}</option>)}
            </select>
          </div>
          <div className="task-form-wide">
            <label className="f-label">やること</label>
            <input type="text" value={form.title} placeholder="例：計算ドリル 3ページ" onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div>
            <label className="f-label">{form.frequency === 'once' ? '完了目標日' : '最初の期日'}</label>
            <input type="date" className="task-date" value={form.due_date} onChange={(e) => set({ due_date: e.target.value })} />
          </div>
          <div>
            <label className="f-label">くり返し</label>
            <select value={form.frequency} onChange={(e) => set({ frequency: e.target.value })}>
              {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          {form.frequency === 'weekly' && (
            <div className="task-form-wide">
              <label className="f-label">曜日（複数えらべます。未選択なら期日の曜日）</label>
              <div className="weekday-row">
                {WEEKDAY_LABELS.map((w, d) => (
                  <button key={d} type="button" className={`weekday-chip ${form.weekdays.includes(d) ? 'on' : ''}`} onClick={() => toggleWeekday(d)}>{w}</button>
                ))}
              </div>
            </div>
          )}
          {form.frequency !== 'once' && (
            <div>
              <label className="f-label">終了日（空なら、ずっと続く）</label>
              <input type="date" className="task-date" value={form.end_date} min={form.due_date} onChange={(e) => set({ end_date: e.target.value })} />
            </div>
          )}
        </div>
        <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{editingId ? '更新する' : '登録する'}</button>
          {editingId && <button className="btn btn-secondary" onClick={resetForm}>キャンセル</button>}
        </div>
      </div>

      <div className="card">
        <h2>登録ずみのやること（{tasks.length}件）</h2>
        <p className="lead" style={{ marginBottom: 10 }}>行をドラッグ&ドロップするか、▲▼で順番を変えられます。子どもの画面では、同じ教科の中でこの順に並びます。</p>
        {loading ? <p className="empty">よみこみちゅう…</p> : tasks.length === 0 ? <p className="empty">まだ登録がありません</p> : (
          <table>
            <thead>
              <tr><th></th><th>教科</th><th>やること</th><th>くり返し</th><th>期日</th><th>終了日</th><th>表示</th><th></th></tr>
            </thead>
            <tbody>
              {tasks.map((t, index) => {
                const finished = t.end_date && t.end_date < today
                return (
                  <tr
                    key={t.id}
                    draggable
                    onDragStart={() => setDragId(t.id)}
                    onDragOver={(e) => { e.preventDefault(); setDragOverId(t.id) }}
                    onDragEnd={() => { setDragId(null); setDragOverId(null) }}
                    onDrop={() => handleDrop(t.id)}
                    className={`drag-row ${dragOverId === t.id ? 'drag-over' : ''} ${dragId === t.id ? 'dragging' : ''}`}
                    style={{ opacity: t.is_active && !finished ? 1 : 0.5 }}
                  >
                    <td className="drag-handle" title="ドラッグして並び替え">⠿</td>
                    <td><span className="pill" style={{ background: SUBJECT_COLORS[t.subject]?.soft, color: SUBJECT_COLORS[t.subject]?.main }}>{SUBJECT_EMOJI[t.subject]} {t.subject}</span></td>
                    <td>{t.title}</td>
                    <td>{describeSchedule(t)}</td>
                    <td>{t.due_date}</td>
                    <td>{t.end_date || '—'}{finished ? '（終了）' : ''}</td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => toggleActive(t)}>
                        {t.is_active ? 'ひょうじ中' : 'おやすみ'}
                      </button>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }} disabled={index === 0} onClick={() => moveByOffset(index, -1)} title="上へ">▲</button>
                        <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }} disabled={index === tasks.length - 1} onClick={() => moveByOffset(index, 1)} title="下へ">▼</button>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => startEdit(t)}>編集</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(t)}>削除</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
      {confirmModal}
      {toastEl}
    </div>
  )
}
