import { useEffect, useState } from 'react'
import { TASK_POINT_OPTIONS, DEFAULT_TASK_POINTS, SUBJECTS, SUBJECT_EMOJI, SUBJECT_COLORS, FREQUENCIES, LINK_APPS, taskPoints, describeSchedule, fetchTasks, saveTask, deleteTask, reorderTasks } from '../../lib/tasks'
import { toISODate, WEEKDAY_LABELS } from '../../lib/dates'
import { toggleItem } from '../../lib/utils'
import { LoadingView, ErrorView } from '../common/Status'
import { useSubjectFilter } from './useSubjectFilter'
import { useConfirm } from './useConfirm'
import { useToast } from './useToast'
import { useDragReorder } from './useDragReorder'
import SubjectFilter from './SubjectFilter'

const emptyForm = () => ({ subject: SUBJECTS[0], title: '', due_date: toISODate(), frequency: 'once', weekdays: [], end_date: '', link_to: '', points: DEFAULT_TASK_POINTS, auto_complete: false })
// 登録済みのやること → 入力フォームの値（編集・複製で使う）
const taskToForm = (t) => ({
  subject: t.subject, title: t.title, due_date: t.due_date, frequency: t.frequency, weekdays: t.weekdays || [],
  end_date: t.end_date || '', link_to: t.link_to || '', points: taskPoints(t), auto_complete: !!t.auto_complete
})
const SMALL_BTN = { padding: '6px 12px', fontSize: 12 }

// 「やること」の登録・編集・おやすみ（無効化）・削除。子どものホーム画面に表示される。
export default function TasksPanel() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formOpen, setFormOpen] = useState(false) // 登録・編集のポップアップ
  const [duplicating, setDuplicating] = useState(false) // 複製元から作っているとき
  const [filterSubjects, setFilterSubjects] = useSubjectFilter() // 一覧に出す教科（前回の選択を引き継ぐ）
  const [confirm, confirmModal] = useConfirm()
  const [notify, toastEl] = useToast()

  const reload = () => fetchTasks().then(setTasks)

  function firstLoad() {
    setLoading(true)
    setLoadFailed(false)
    reload().catch((e) => { console.error(e); setLoadFailed(true) }).finally(() => setLoading(false))
  }

  useEffect(firstLoad, [])

  const visible = tasks.filter((t) => filterSubjects.includes(t.subject))
  const allOn = filterSubjects.length === SUBJECTS.length

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const toggleWeekday = (d) => set({ weekdays: toggleItem(form.weekdays, d) })

  // ポップアップを閉じて、入力をもとに戻す
  function resetForm() {
    setForm(emptyForm())
    setEditingId(null)
    setDuplicating(false)
    setFormOpen(false)
  }

  // ポップアップを開く。duplicate：登録済みのやることをコピーした内容で新規登録する（内容を変えて登録できる）
  function openForm({ task = null, duplicate = false } = {}) {
    setForm(task ? taskToForm(task) : emptyForm())
    setEditingId(task && !duplicate ? task.id : null)
    setDuplicating(duplicate)
    setFormOpen(true)
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
          link_to: form.link_to || null,
          points: form.points,
          auto_complete: !!form.link_to && form.auto_complete, // 開く先がないと自動で完了にできない
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

  const drag = useDragReorder(tasks, applyOrder)

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
      {formOpen && (
        // 入力途中の内容が消えないよう、外側をタップしても閉じない（「キャンセル」で閉じる）
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: 560 }}>
            <h2>{editingId ? 'やることを編集' : duplicating ? 'やることを複製して登録' : 'やることを登録'}</h2>
            {duplicating && <p className="lead" style={{ margin: '0 0 12px' }}>コピーした内容です。変えたいところを直して「登録する」を押してください。</p>}
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
                <label className="f-label">繰り返し</label>
                <select value={form.frequency} onChange={(e) => set({ frequency: e.target.value })}>
                  {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              <div>
                <label className="f-label">ポイント（完了したときにもらえる）</label>
                <select value={form.points} onChange={(e) => set({ points: Number(e.target.value) })}>
                  {TASK_POINT_OPTIONS.map((p) => <option key={p} value={p}>{p} pt</option>)}
                </select>
              </div>
              <div>
                <label className="f-label">開く先（ホームの「始める」ボタン）</label>
                <select value={form.link_to} onChange={(e) => set({ link_to: e.target.value })}>
                  <option value="">なし</option>
                  {Object.entries(LINK_APPS).map(([key, app]) => <option key={key} value={key}>{app.emoji} {app.label}</option>)}
                </select>
              </div>
              {form.link_to && (
                <div className="task-form-wide">
                  <label className="auto-complete-check">
                    <input type="checkbox" checked={form.auto_complete} onChange={(e) => set({ auto_complete: e.target.checked })} />
                    <span>アプリの学習を終えたら、自動で完了にする（{LINK_APPS[form.link_to]?.autoLabel}）</span>
                  </label>
                </div>
              )}
              {form.frequency === 'weekly' && (
                <div className="task-form-wide">
                  <label className="f-label">曜日（複数選べます。未選択なら期日の曜日）</label>
                  <div className="weekday-row">
                    {WEEKDAY_LABELS.map((w, d) => (
                      <button key={d} type="button" className={`weekday-chip ${form.weekdays.includes(d) ? 'on' : ''}`} onClick={() => toggleWeekday(d)}>{w}</button>
                    ))}
                  </div>
                </div>
              )}
              {form.frequency !== 'once' && (
                <div>
                  <label className="f-label">終了日（空なら無期限）</label>
                  <input type="date" className="task-date" value={form.end_date} min={form.due_date} onChange={(e) => set({ end_date: e.target.value })} />
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={resetForm}>キャンセル</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{editingId ? '更新する' : '登録する'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="task-list-head">
          <h2>登録済みのやること（{allOn ? `${tasks.length}件` : `${visible.length}/${tasks.length}件`}）</h2>
          <button className="btn btn-primary" onClick={() => openForm()}>＋ やることを登録</button>
        </div>
        <SubjectFilter subjects={filterSubjects} onChange={setFilterSubjects} />
        <p className="lead" style={{ marginBottom: 10 }}>行をドラッグ&ドロップして順番を変えられます。子どもの画面では、同じ教科の中でこの順に並びます。</p>
        {loading ? <LoadingView /> : loadFailed ? <ErrorView onRetry={firstLoad} /> : tasks.length === 0 ? <p className="empty">まだ登録がありません</p> : visible.length === 0 ? <p className="empty">この教科のやることはありません</p> : (
          <table>
            <thead>
              <tr><th></th><th>教科</th><th>やること</th><th>繰り返し</th><th>ポイント</th><th>期日</th><th>終了日</th><th>表示</th><th></th></tr>
            </thead>
            <tbody>
              {visible.map((t) => {
                const finished = t.end_date && t.end_date < today
                return (
                  <tr key={t.id} {...drag.rowProps(t)} className={drag.rowClass(t)} style={{ opacity: t.is_active && !finished ? 1 : 0.5 }}>
                    <td className="drag-handle" title="ドラッグして並び替え">⠿</td>
                    <td><span className="pill" style={{ background: SUBJECT_COLORS[t.subject]?.soft, color: SUBJECT_COLORS[t.subject]?.main }}>{SUBJECT_EMOJI[t.subject]} {t.subject}</span></td>
                    <td>
                      {t.title}
                      {t.link_to && <span className="pill pill-ok" style={{ marginLeft: 6 }}>▶ {LINK_APPS[t.link_to]?.label}{t.auto_complete ? '（自動完了）' : ''}</span>}
                    </td>
                    <td>{describeSchedule(t)}</td>
                    <td>{taskPoints(t)} pt</td>
                    <td>{t.due_date}</td>
                    <td>{t.end_date || '—'}{finished ? '（終了）' : ''}</td>
                    <td>
                      <button className="btn btn-secondary" style={SMALL_BTN} onClick={() => toggleActive(t)}>
                        {t.is_active ? '表示中' : '休止中'}
                      </button>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-secondary" style={SMALL_BTN} onClick={() => openForm({ task: t })}>編集</button>
                        <button className="btn btn-secondary" style={SMALL_BTN} onClick={() => openForm({ task: t, duplicate: true })}>複製</button>
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
