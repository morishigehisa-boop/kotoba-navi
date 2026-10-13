import { useState } from 'react'
import { deleteQuestion, bulkUpdateQuestions, bulkDeleteQuestions } from '../../../lib/api'
import { typeLabel, formatQid, summarizeContent, filterQuestions } from '../../../lib/questionTypes'
import { useConfirm } from '../useConfirm'
import { useToast } from '../useToast'
import { EditModal } from '../EditModal'
import FilterSelect from '../FilterSelect'

const EMPTY_FILTER = { idFrom: '', idTo: '', category: '', type: '', book: '', pageFrom: '', pageTo: '', search: '' }
const EMPTY_BULK = { category: '', source_book: '', source_page: '' }

// 問題一覧：絞り込み・編集・削除。管理番号の範囲を指定すると、一括変更・一括削除ができる
export default function ListPanel({ questions, books, categories, types, onChanged }) {
  const [filter, setFilter] = useState(EMPTY_FILTER)
  const [editing, setEditing] = useState(null) // 編集中の question オブジェクト
  const [bulk, setBulk] = useState(EMPTY_BULK)
  const [bulkBusy, setBulkBusy] = useState(false)
  const [confirm, confirmModal] = useConfirm()
  const [notify, toastEl] = useToast()

  const setField = (key) => (value) => setFilter((f) => ({ ...f, [key]: value }))
  const rows = filterQuestions(questions, filter)
  const idRangeActive = filter.idFrom !== '' || filter.idTo !== ''
  const filtersActive = Object.values(filter).some((v) => v !== '')

  async function handleDelete(q) {
    const ok = await confirm(`この問題を削除しますか？\n「${summarizeContent(q).main}」\n（問題集に含まれている場合は、その紐付けも削除されます）`)
    if (!ok) return
    await deleteQuestion(q.id)
    onChanged('問題を削除しました')
  }

  async function runBulk(action) {
    setBulkBusy(true)
    try {
      await action()
    } finally {
      setBulkBusy(false)
    }
  }

  async function handleBulkDelete() {
    if (rows.length === 0) return
    const from = formatQid(filter.idFrom || rows[0].id)
    const to = formatQid(filter.idTo || rows[rows.length - 1].id)
    const ok = await confirm(`管理番号${from}〜${to}の範囲で、現在の絞り込み条件に一致する ${rows.length}問 を削除します。\nこの操作は取り消せません。よろしいですか？`)
    if (!ok) return
    await runBulk(async () => {
      await bulkDeleteQuestions(rows.map((q) => q.id))
      await onChanged(`${rows.length}問を一括削除しました`)
    })
  }

  async function handleBulkUpdate() {
    if (rows.length === 0) return
    const patch = Object.fromEntries(Object.entries(bulk).map(([k, v]) => [k, v.trim()]).filter(([, v]) => v))
    if (Object.keys(patch).length === 0) { notify('更新する項目を1つ以上入力してください'); return }
    if (!(await confirm(`絞り込み条件に一致する ${rows.length}問 を、入力した内容で一括更新します。よろしいですか？`))) return
    await runBulk(async () => {
      await bulkUpdateQuestions(rows.map((q) => q.id), patch)
      setBulk(EMPTY_BULK)
      await onChanged(`${rows.length}問を一括更新しました`)
    })
  }

  const bulkInput = (key, placeholder, width) => (
    <input type="text" placeholder={placeholder} style={{ width }} value={bulk[key]} onChange={(e) => setBulk((b) => ({ ...b, [key]: e.target.value }))} disabled={bulkBusy} />
  )

  return (
    <div className="card">
      <div className="filters">
        <input type="number" placeholder="管理番号(開始)" style={{ width: 120 }} value={filter.idFrom} onChange={(e) => setField('idFrom')(e.target.value)} />
        <input type="number" placeholder="管理番号(終了)" style={{ width: 120 }} value={filter.idTo} onChange={(e) => setField('idTo')(e.target.value)} />
        <FilterSelect value={filter.category} onChange={setField('category')} allLabel="カテゴリー: すべて" options={categories} />
        <FilterSelect value={filter.type} onChange={setField('type')} allLabel="出題形式: すべて" options={types} labelOf={typeLabel} />
        <FilterSelect value={filter.book} onChange={setField('book')} allLabel="問題集: すべて" options={books} />
        <input type="number" placeholder="ページ開始" style={{ width: 110 }} value={filter.pageFrom} onChange={(e) => setField('pageFrom')(e.target.value)} />
        <input type="number" placeholder="ページ終了" style={{ width: 110 }} value={filter.pageTo} onChange={(e) => setField('pageTo')(e.target.value)} />
        <input type="text" placeholder="キーワードを検索" value={filter.search} onChange={(e) => setField('search')(e.target.value)} />
        {filtersActive && <button className="btn btn-secondary" onClick={() => setFilter(EMPTY_FILTER)}>フィルターをリセット</button>}
      </div>

      {idRangeActive && (
        <div className="bulk-panel">
          <div className="bulk-panel-title">一括操作（絞り込み条件に一致する {rows.length}問 が対象）</div>
          <div className="bulk-panel-row">
            {bulkInput('category', 'カテゴリーを一括変更', 160)}
            {bulkInput('source_book', '出典(問題集名)を一括変更', 180)}
            {bulkInput('source_page', 'ページを一括変更', 140)}
            <button className="btn btn-primary" disabled={bulkBusy || rows.length === 0} onClick={handleBulkUpdate}>一括更新する</button>
            <button className="btn btn-danger" disabled={bulkBusy || rows.length === 0} onClick={handleBulkDelete}>この範囲を一括削除</button>
            {bulkBusy && <span className="spinner-inline"><span className="spinner" />処理中…</span>}
          </div>
          <div className="hint" style={{ marginTop: 6, marginBottom: 0 }}>
            空欄の項目は変更されません。他のフィルター（カテゴリー・出題形式など）と組み合わせて、対象をさらに絞り込めます。
          </div>
        </div>
      )}

      <div className="table-scroll">
        <table className="responsive-table list-table">
          <thead>
            <tr>
              <th>管理番号</th><th>カテゴリー</th><th>出題形式</th><th>問題内容</th>
              <th>最終結果</th><th>最終正解日時</th><th>累計正解</th><th>連続正解</th><th>不正解回数</th><th>出典</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan="11" className="empty">🔍 該当する問題がありません{filtersActive && '（フィルターを見直してみてください）'}</td></tr>}
            {rows.map((q) => {
              const s = summarizeContent(q)
              return (
                <tr key={q.id}>
                  <td className="id-cell">{formatQid(q.id)}</td>
                  <td><span className="pill pill-cat">{q.category}</span></td>
                  <td><span className="pill pill-type">{typeLabel(q.answer_type)}</span></td>
                  <td><div className="content-main">{s.main}</div><div className="content-sub">{s.sub}</div></td>
                  <td>{q.last_correct === null ? '未回答' : q.last_correct ? <span className="pill pill-ok">正解</span> : <span className="pill pill-bad">不正解</span>}</td>
                  <td>{q.last_answered_at ? new Date(q.last_answered_at).toLocaleString('ja-JP') : '-'}</td>
                  <td className="count-cell">{q.correct_count}</td>
                  <td className="count-cell">{q.streak_count}</td>
                  <td className="count-cell">{q.wrong_count || 0}</td>
                  <td>{q.source_book} P.{q.source_page}</td>
                  <td className="row-actions">
                    <button className="btn btn-secondary" onClick={() => setEditing(q)}>編集</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(q)}>削除</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditModal
          question={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); onChanged('問題を更新しました') }}
        />
      )}
      {confirmModal}
      {toastEl}
    </div>
  )
}
