import { useState } from 'react'
import { createQuestionSet, saveFilterHistory } from '../../../lib/api'
import { typeLabel, formatQid, summarizeContent, filterQuestions } from '../../../lib/questionTypes'
import { useToast } from '../useToast'
import FilterSelect from '../FilterSelect'
import SetOptionFields from './SetOptionFields'

const EMPTY_FILTER = { book: '', category: '', type: '', pageFrom: '', pageTo: '', maxCorrect: '', maxStreak: '' }

// 条件から付ける、問題集の名前の案
function suggestName(f) {
  const parts = [f.book, f.category]
  if (f.pageFrom || f.pageTo) parts.push(`P.${f.pageFrom || '?'}〜${f.pageTo || '?'}`)
  if (f.maxCorrect !== '') parts.push(`累計正解${f.maxCorrect}回以下`)
  if (f.maxStreak !== '') parts.push(`連続正解${f.maxStreak}回以下`)
  return parts.filter(Boolean).join(' ') || 'すべての問題'
}

// 問題集作成：条件で問題を抽出して、問題集として保存する
export default function MakePanel({ questions, books, categories, types, onSaved }) {
  const [notify, toastEl] = useToast()
  const [filter, setFilter] = useState(EMPTY_FILTER)
  const [previewed, setPreviewed] = useState(false)
  const [setName, setSetName] = useState('')
  const [goalAt, setGoalAt] = useState('')
  const [shuffle, setShuffle] = useState(true)
  const [saving, setSaving] = useState(false)

  const setField = (key) => (value) => setFilter((f) => ({ ...f, [key]: value }))
  const filtersActive = Object.values(filter).some((v) => v !== '')
  const result = previewed ? filterQuestions(questions, filter) : []

  async function handleSave() {
    if (!setName.trim()) { notify('問題集の名前を入力してください'); return }
    const finalResult = filterQuestions(questions, filter)
    if (finalResult.length === 0) { notify('該当する問題がありません'); return }
    setSaving(true)
    try {
      const condition = {
        source_book: filter.book || null, category: filter.category || null, answer_type: filter.type || null,
        page_from: filter.pageFrom || null, page_to: filter.pageTo || null,
        max_correct_count: filter.maxCorrect === '' ? null : Number(filter.maxCorrect),
        max_streak_count: filter.maxStreak === '' ? null : Number(filter.maxStreak)
      }
      const name = setName.trim()
      await createQuestionSet({
        name,
        filter_condition: condition,
        goal_at: goalAt ? new Date(goalAt).toISOString() : null,
        shuffle,
        questionIds: finalResult.map((q) => q.id)
      })
      await saveFilterHistory({ name, filter_condition: condition, result_count: finalResult.length })
      onSaved(name, finalResult.length)
      setSetName(''); setGoalAt(''); setShuffle(true); setPreviewed(false)
    } catch (e) {
      notify(`保存に失敗しました：${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  const numberField = (key, label, placeholder) => (
    <div><label className="f-label">{label}</label>
      <input type="number" placeholder={placeholder} value={filter[key]} onChange={(e) => setField(key)(e.target.value)} />
    </div>
  )

  return (
    <>
      <div className="card">
        <h2>抽出条件を指定</h2>
        <div className="form-grid">
          <div><label className="f-label">インプット問題集</label>
            <FilterSelect value={filter.book} onChange={setField('book')} allLabel="すべて" options={books} />
          </div>
          <div><label className="f-label">カテゴリー</label>
            <FilterSelect value={filter.category} onChange={setField('category')} allLabel="すべて" options={categories} />
          </div>
          <div><label className="f-label">出題形式</label>
            <FilterSelect value={filter.type} onChange={setField('type')} allLabel="すべて" options={types} labelOf={typeLabel} />
          </div>
          <div></div>
          {numberField('pageFrom', 'ページ開始', '例: 12')}
          {numberField('pageTo', 'ページ終了', '例: 20')}
          {numberField('maxCorrect', '累計正解回数（以下）', '例: 2（空欄で指定なし）')}
          {numberField('maxStreak', '連続正解回数（以下）', '例: 1（空欄で指定なし）')}
        </div>
        <button className="btn btn-secondary" onClick={() => { setPreviewed(true); setSetName(suggestName(filter)) }}>この条件で抽出する</button>
        {filtersActive && (
          <button className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => { setFilter(EMPTY_FILTER); setPreviewed(false) }}>
            条件をリセット
          </button>
        )}
        {previewed && (
          <>
            <div className="preview-count">条件に一致する問題: <b>{result.length}</b> 問</div>
            {result.length > 0 && (
              <div className="table-scroll">
                <table>
                  <thead><tr><th>管理番号</th><th>出題形式</th><th>問題内容</th><th>出典</th><th>累計正解</th></tr></thead>
                  <tbody>
                    {result.map((q) => (
                      <tr key={q.id}>
                        <td className="id-cell">{formatQid(q.id)}</td>
                        <td><span className="pill pill-type">{typeLabel(q.answer_type)}</span></td>
                        <td><div className="content-main">{summarizeContent(q).main}</div></td>
                        <td>{q.source_book} P.{q.source_page}</td>
                        <td className="count-cell">{q.correct_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {previewed && result.length > 0 && (
        <div className="card">
          <h2>問題集として保存</h2>
          <SetOptionFields name={setName} onName={setSetName} goalAt={goalAt} onGoalAt={setGoalAt} shuffle={shuffle} onShuffle={setShuffle} />
          <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
            {saving ? '保存中…' : 'この条件で問題集を作成する'}
          </button>
        </div>
      )}
      {toastEl}
    </>
  )
}
