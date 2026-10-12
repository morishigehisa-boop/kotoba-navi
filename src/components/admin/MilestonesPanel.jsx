import { useEffect, useState } from 'react'
import { toISODate, fetchMilestones, saveMilestone, deleteMilestone } from '../../lib/tasks'
import { LoadingView, ErrorView } from '../common/Status'
import { useConfirm } from './useConfirm'
import { useToast } from './useToast'

const emptyForm = () => ({ event_date: toISODate(), title: '' })

// マイルストーン（テスト・行事などの目標日）の登録・編集・削除。予定カレンダーの上に表示される。
export default function MilestonesPanel() {
  const [milestones, setMilestones] = useState(null)
  const [failed, setFailed] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formOpen, setFormOpen] = useState(false) // 登録・編集のポップアップ
  const [confirm, confirmModal] = useConfirm()
  const [notify, toastEl] = useToast()
  const todayISO = toISODate()

  function load() {
    setFailed(false)
    fetchMilestones().then(setMilestones).catch((e) => { console.error(e); setFailed(true) })
  }
  useEffect(load, [])

  // ポップアップを閉じて、入力をもとに戻す
  function closeForm() {
    setEditingId(null)
    setForm(emptyForm())
    setFormOpen(false)
  }

  function startNew() {
    setEditingId(null)
    setForm(emptyForm())
    setFormOpen(true)
  }

  function startEdit(m) {
    setEditingId(m.id)
    setForm({ event_date: m.event_date, title: m.title })
    setFormOpen(true)
  }

  async function submit(e) {
    e.preventDefault()
    const title = form.title.trim()
    if (!title || !form.event_date) return notify('日付とイベント名を入れてください')
    setSaving(true)
    try {
      await saveMilestone({ event_date: form.event_date, title }, editingId)
      setMilestones(await fetchMilestones())
      notify(editingId ? 'イベントを更新しました' : 'イベントを登録しました')
      closeForm()
    } catch (err) {
      notify(`保存に失敗しました：${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function remove(m) {
    if (!(await confirm(`「${m.title}」（${m.event_date}）を削除しますか？`))) return
    try {
      await deleteMilestone(m.id)
      setMilestones((p) => p.filter((x) => x.id !== m.id))
      if (editingId === m.id) closeForm()
    } catch (err) {
      notify(`削除に失敗しました：${err.message}`)
    }
  }

  if (failed) return <ErrorView onRetry={load} />
  if (milestones === null) return <LoadingView />

  return (
    <div>
      <p className="lead">テストや行事など、目標になる日を登録します。「予定カレンダー」の上に表示されます。</p>
      {formOpen && (
        // 入力途中の内容が消えないよう、外側をタップしても閉じない（「キャンセル」で閉じる）
        <div className="modal-backdrop">
          <form className="modal" style={{ maxWidth: 480 }} onSubmit={submit}>
            <h2>{editingId ? 'イベントを編集' : 'イベントを登録'}</h2>
            <div className="ms-form-fields">
              <label className="f-label">日付</label>
              <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
              <label className="f-label">イベント名</label>
              <input type="text" placeholder="例：漢字テスト" maxLength={40} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} autoFocus />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={closeForm}>キャンセル</button>
              <button className="btn btn-primary" disabled={saving}>{editingId ? '更新する' : '登録する'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="task-list-head">
          <h2>登録ずみのイベント（{milestones.length}件）</h2>
          <button className="btn btn-primary" onClick={startNew}>＋ イベントを登録</button>
        </div>
        {milestones.length === 0 ? (
          <p className="empty">まだイベントがありません</p>
        ) : (
          <ul className="ms-items">
            {milestones.map((m) => (
              <li key={m.id} className={m.event_date < todayISO ? 'past' : ''}>
                <span className="ms-items-date">{m.event_date}</span>
                <span className="ms-items-title">{m.title}</span>
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => startEdit(m)}>編集</button>
                <button className="btn btn-danger" onClick={() => remove(m)}>削除</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {confirmModal}
      {toastEl}
    </div>
  )
}
