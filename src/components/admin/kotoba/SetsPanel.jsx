import { useEffect, useMemo, useState } from 'react'
import { BOX_LEVELS, setProgress } from '../../../lib/today'
import { toISODate, daysBetweenISO } from '../../../lib/dates'
import { useToast } from '../useToast'
import { useDragReorder } from '../useDragReorder'
import SetOptionFields from './SetOptionFields'

// 管理画面の進み具合バーの色（未正解・1回・2回・3回・完璧）。完璧はひと目で分かるよう緑にしている
const ADMIN_BOX_COLORS = ['#D8D2C0', '#F5D18C', '#F5A742', '#E8863A', '#4CB27A']

function formatGoal(goalAt) {
  if (!goalAt) return { text: '未設定', cls: 'goal-none' }
  const goalISO = toISODate(new Date(goalAt))
  const label = goalISO.replaceAll('-', '/')
  const days = daysBetweenISO(toISODate(), goalISO)
  if (days < 0) return { text: `${label}（期限切れ）`, cls: 'goal-over' }
  return { text: `${label}（あと${days}日）`, cls: days <= 3 ? 'goal-soon' : 'goal-ok' }
}

// 問題集一覧：並べ替え（子どもアプリでの表示順）・編集・削除・レビュー済みのチェック
export default function SetsPanel({ sets, questions, onDelete, onReorder, onEdit, onToggleReviewed }) {
  const [order, setOrder] = useState(sets)
  const [editing, setEditing] = useState(null)
  useEffect(() => { setOrder(sets) }, [sets])

  const questionsById = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions])
  const drag = useDragReorder(order, (next) => { setOrder(next); onReorder(next.map((s) => s.id)) })

  return (
    <div className="card">
      <h2>作成した問題集</h2>
      <p className="lead" style={{ marginBottom: 10 }}>行をドラッグ&ドロップすると、子どもアプリでの表示順を変更できます。「レビュー」は、プレビューで内容をチェックし終わった問題集にチェックを入れてください。</p>
      <div className="table-scroll">
        <table className="responsive-table sets-table">
          <thead><tr><th></th><th>問題集名</th><th>問題数</th><th>進捗</th><th>目標完了日</th><th>作成日</th><th></th><th>レビュー</th></tr></thead>
          <tbody>
            {order.length === 0 && <tr><td colSpan="8" className="empty">まだ問題集がありません</td></tr>}
            {order.map((s, index) => {
              const goal = formatGoal(s.goal_at)
              const p = setProgress(s, questionsById)
              return (
                <tr key={s.id} {...drag.rowProps(s)} className={`${drag.rowClass(s)} ${s.reviewed ? 'reviewed-row' : ''}`}>
                  <td className="drag-handle" title="ドラッグして並び替え">⠿</td>
                  <td>
                    <b>{s.name}</b>
                    {s.shuffle && <span className="pill pill-shuffle">🔀 ランダム</span>}
                    <div className="mobile-reorder-btns">
                      <button className="btn btn-secondary" disabled={index === 0} onClick={() => drag.move(index, -1)}>▲ 上へ</button>
                      <button className="btn btn-secondary" disabled={index === order.length - 1} onClick={() => drag.move(index, 1)}>▼ 下へ</button>
                    </div>
                  </td>
                  <td className="count-cell">{s.questionIds.length}</td>
                  <td style={{ minWidth: 160 }}>
                    <div className="progress-stack" title={BOX_LEVELS.map((b, i) => `${b.short}${p.counts[i]}`).join('・')}>
                      {ADMIN_BOX_COLORS.map((color, i) => (p.total > 0 && p.counts[i] > 0 ? (
                        <div key={i} className="progress-seg" style={{ width: `${(p.counts[i] / p.total) * 100}%`, background: color }} />
                      ) : null))}
                    </div>
                    <div className="progress-stack-label">完璧 {p.rate}%（{p.mastered}/{p.total}）</div>
                  </td>
                  <td><span className={goal.cls}>{goal.text}</span></td>
                  <td>{new Date(s.created_at).toLocaleString('ja-JP')}</td>
                  <td className="row-actions">
                    <button className="btn btn-secondary" onClick={() => setEditing(s)}>編集</button>
                    <button className="btn btn-danger" onClick={() => onDelete(s)}>削除</button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <input type="checkbox" checked={!!s.reviewed} onChange={(e) => onToggleReviewed(s, e.target.checked)} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <SetEditModal
          set={editing}
          onClose={() => setEditing(null)}
          onSave={async (patch) => { await onEdit(editing, patch); setEditing(null) }}
        />
      )}
    </div>
  )
}

function SetEditModal({ set, onClose, onSave }) {
  const [notify, toastEl] = useToast()
  const [name, setName] = useState(set.name)
  const [goalAt, setGoalAt] = useState(set.goal_at ? toISODate(new Date(set.goal_at)) : '')
  const [shuffle, setShuffle] = useState(!!set.shuffle)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!name.trim()) { notify('問題集の名前を入力してください'); return }
    setSaving(true)
    try {
      await onSave({ name: name.trim(), goal_at: goalAt ? new Date(goalAt).toISOString() : null, shuffle })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <h2>問題集を編集</h2>
        <SetOptionFields name={name} onName={setName} goalAt={goalAt} onGoalAt={setGoalAt} shuffle={shuffle} onShuffle={setShuffle} wideName />
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>キャンセル</button>
          <button className="btn btn-primary" disabled={saving} onClick={handleSave}>{saving ? '保存中…' : '保存する'}</button>
        </div>
      </div>
      {toastEl}
    </div>
  )
}
