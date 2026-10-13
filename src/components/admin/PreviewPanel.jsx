import { useEffect, useMemo, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import kidsCss from '../kids/kids.css?raw'
import QuizCard from '../kids/kotoba/QuizCard'
import { EditModal } from './EditModal'
import FilterSelect from './FilterSelect'
import { FuriganaTable, FuriganaAddForm } from './FuriganaEditor'
import { typeLabel, formatQid, filterQuestions } from '../../lib/questionTypes'

// 子どもアプリと同じ部品（QuizCard）を、子どもアプリのCSSと一緒に iframe の中に表示する
function previewHtml(item, revealed) {
  const choiceFeedback = revealed && item.content.choices ? { chosen: item.content.answer, correct: item.content.answer } : null
  const card = renderToStaticMarkup(<QuizCard item={item} revealed={revealed} choiceFeedback={choiceFeedback} showActions={false} />)
  return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><style>${kidsCss}
body{ padding:16px; } .app{ max-width:none; padding:0; } .card{ min-height:200px; }
</style></head><body><div class="app">${card}</div></body></html>`
}

// 問題に出てくる文字（ふりがなの対象を探すため）
function itemText(q) {
  const c = q.content
  return [c.q, c.sentence, c.shown, c.sentenceA, c.sentenceB, c.answerA, c.answerB, c.reading, c.answer, ...[].concat(c.a || []), ...(c.choices || [])]
    .filter(Boolean).join(' ')
}

const EMPTY_FILTER = { setId: '', category: '', type: '', book: '', pageFrom: '', pageTo: '' }

export default function PreviewPanel({ questions, books, categories, types, sets, furiganaEntries, onChanged }) {
  const [filter, setFilter] = useState(EMPTY_FILTER)
  const [index, setIndex] = useState(0)
  const [editing, setEditing] = useState(false)
  const [pinnedId, setPinnedId] = useState(null)

  // 条件を変えたら、1問目から表示する
  const setField = (key) => (value) => { setFilter((f) => ({ ...f, [key]: value })); setIndex(0) }
  const filtersActive = Object.values(filter).some((v) => v !== '')

  const filtered = useMemo(() => {
    let base = questions
    const chosenSet = filter.setId && sets.find((s) => String(s.id) === filter.setId)
    if (chosenSet) {
      const byId = new Map(questions.map((q) => [q.id, q]))
      base = chosenSet.questionIds.map((id) => byId.get(id)).filter(Boolean)
    }
    return filterQuestions(base, filter)
  }, [questions, sets, filter])

  // 編集などでquestionsが更新された後も、同じ問題を表示し続ける
  useEffect(() => {
    if (pinnedId === null) return
    const idx = filtered.findIndex((q) => q.id === pinnedId)
    if (idx >= 0) setIndex(idx)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions])

  const safeIndex = Math.min(index, Math.max(0, filtered.length - 1))
  const item = filtered[safeIndex]

  useEffect(() => {
    if (item) setPinnedId(item.id)
  }, [item?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // 左右キーで前の問題・次の問題に移動する（フォームの入力中は無視する）
  useEffect(() => {
    function onKeyDown(e) {
      if (editing) return
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'ArrowRight') setIndex((v) => Math.min(v + 1, filtered.length - 1))
      else if (e.key === 'ArrowLeft') setIndex((v) => Math.max(v - 1, 0))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [filtered.length, editing])

  const relevantFurigana = useMemo(() => {
    if (!item) return []
    const text = itemText(item)
    return furiganaEntries.filter((e) => text.includes(e.word))
  }, [item, furiganaEntries])

  return (
    <div className="card">
      <h2>子ども画面プレビュー</h2>
      <p className="lead" style={{ marginBottom: 8 }}>
        実際に子どもアプリで使っている部品とデザインをそのまま表示しています。左が問題（タップ前）、右が答え（タップ後）です。
      </p>

      <div className="filters">
        <select value={filter.setId} onChange={(e) => setField('setId')(e.target.value)}>
          <option value="">作成した問題集: すべて</option>
          {sets.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <FilterSelect value={filter.category} onChange={setField('category')} allLabel="カテゴリー: すべて" options={categories} />
        <FilterSelect value={filter.type} onChange={setField('type')} allLabel="出題形式: すべて" options={types} labelOf={typeLabel} />
        <FilterSelect value={filter.book} onChange={setField('book')} allLabel="インプット問題集: すべて" options={books} />
        <input type="number" placeholder="ページ開始" style={{ width: 110 }} value={filter.pageFrom} onChange={(e) => setField('pageFrom')(e.target.value)} />
        <input type="number" placeholder="ページ終了" style={{ width: 110 }} value={filter.pageTo} onChange={(e) => setField('pageTo')(e.target.value)} />
        {filtersActive && <button className="btn btn-secondary" onClick={() => { setFilter(EMPTY_FILTER); setIndex(0) }}>フィルターをリセット</button>}
      </div>

      {!item ? (
        <div className="empty">🔍 該当する問題がありません{filtersActive && '（フィルターを見直してみてください）'}</div>
      ) : (
        <>
          <div className="preview-nav">
            <div className="preview-nav-buttons">
              <button className="btn btn-secondary" disabled={safeIndex === 0} onClick={() => setIndex(safeIndex - 1)}>◀ 前の問題</button>
              <button className="btn btn-secondary" disabled={safeIndex >= filtered.length - 1} onClick={() => setIndex(safeIndex + 1)}>次の問題 ▶</button>
            </div>
            <div className="preview-nav-info">{formatQid(item.id)} {safeIndex + 1} / {filtered.length}</div>
            <button className="btn btn-primary" onClick={() => setEditing(true)}>この問題を編集</button>
          </div>

          <div className="preview-grid">
            <div>
              <div className="preview-col-title">問題（タップ前）</div>
              <iframe title="question" className="preview-frame" srcDoc={previewHtml(item, false)} />
            </div>
            <div>
              <div className="preview-col-title">答え（タップ後）</div>
              <iframe title="answer" className="preview-frame" srcDoc={previewHtml(item, true)} />
            </div>
          </div>

          <div className="furigana-inline">
            <div className="preview-col-title" style={{ marginTop: 12 }}>ふりがな</div>
            {relevantFurigana.length > 0 && (
              <div className="table-scroll" style={{ marginBottom: 8 }}>
                <FuriganaTable entries={relevantFurigana} onChanged={onChanged} />
              </div>
            )}
            <FuriganaAddForm onChanged={onChanged} wordPlaceholder="単語（例: 竹馬）" readingPlaceholder="読み（例: ちくば）" buttonLabel="ふりがなを追加" />
          </div>
        </>
      )}

      {editing && item && (
        <EditModal
          question={item}
          onClose={() => setEditing(false)}
          onSaved={async () => {
            setEditing(false)
            await onChanged('問題を更新しました')
          }}
        />
      )}
    </div>
  )
}
