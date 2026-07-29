import { useMemo, useState } from 'react'
import { buildPreviewHtml } from './previewHtml'

const ANSWER_TYPE_LABELS_LOCAL = {
  self_recall: '自己採点',
  synonym_forward: '似た意味(順)',
  synonym_reverse: '似た意味(逆)',
  fill_blank: '穴埋め',
  pair_fill: '二文穴埋め',
  antonym_pair: '対になる',
  choice: '選択式'
}

export default function PreviewPanel({ questions, books, categories, types, sets }) {
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const [book, setBook] = useState('')
  const [pageFrom, setPageFrom] = useState('')
  const [pageTo, setPageTo] = useState('')
  const [setId, setSetId] = useState('')
  const [index, setIndex] = useState(0)

  const filtered = useMemo(() => {
    let base = questions
    if (setId) {
      const chosenSet = sets.find((s) => String(s.id) === setId)
      if (chosenSet) {
        const byId = new Map(questions.map((q) => [q.id, q]))
        base = chosenSet.questionIds.map((id) => byId.get(id)).filter(Boolean)
      }
    }
    return base.filter((q) => {
      if (category && q.category !== category) return false
      if (type && q.answer_type !== type) return false
      if (book && q.source_book !== book) return false
      if (pageFrom !== '' || pageTo !== '') {
        const pages = String(q.source_page || '').split('-').map(Number)
        const qFrom = pages[0]
        const qTo = pages[1] === undefined ? pages[0] : pages[1]
        if (Number.isNaN(qFrom)) return false
        if (pageFrom !== '' && qTo < parseInt(pageFrom)) return false
        if (pageTo !== '' && qFrom > parseInt(pageTo)) return false
      }
      return true
    })
  }, [questions, sets, category, type, book, pageFrom, pageTo, setId])

  const safeIndex = Math.min(index, Math.max(0, filtered.length - 1))
  const item = filtered[safeIndex]

  function resetFilter(setter) {
    return (e) => { setter(e.target.value); setIndex(0) }
  }

  return (
    <div className="card">
      <h2>子ども画面プレビュー</h2>
      <p className="lead" style={{ marginBottom: 14 }}>
        実際に子どもアプリで使っているデザインをそのまま表示しています。左が問題（タップ前）、右が答え（タップ後）です。
      </p>

      <div className="filters">
        <select value={setId} onChange={resetFilter(setSetId)}>
          <option value="">作成した問題集: すべて</option>
          {sets.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={category} onChange={resetFilter(setCategory)}>
          <option value="">カテゴリー: すべて</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={type} onChange={resetFilter(setType)}>
          <option value="">出題形式: すべて</option>
          {types.map((t) => <option key={t} value={t}>{ANSWER_TYPE_LABELS_LOCAL[t] || t}</option>)}
        </select>
        <select value={book} onChange={resetFilter(setBook)}>
          <option value="">インプット問題集: すべて</option>
          {books.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <input type="number" placeholder="ページ開始" style={{ width: 110 }} value={pageFrom} onChange={resetFilter(setPageFrom)} />
        <input type="number" placeholder="ページ終了" style={{ width: 110 }} value={pageTo} onChange={resetFilter(setPageTo)} />
      </div>

      {!item ? (
        <div className="empty">該当する問題がありません</div>
      ) : (
        <>
          <div className="preview-nav">
            <button className="btn btn-secondary" disabled={safeIndex === 0} onClick={() => setIndex(safeIndex - 1)}>◀ 前の問題</button>
            <div className="preview-nav-info">
              Q{String(item.id).padStart(4, '0')}　{safeIndex + 1} / {filtered.length}
            </div>
            <button className="btn btn-secondary" disabled={safeIndex >= filtered.length - 1} onClick={() => setIndex(safeIndex + 1)}>次の問題 ▶</button>
          </div>

          <div className="preview-grid">
            <div>
              <div className="preview-col-title">問題（タップ前）</div>
              <iframe title="question" className="preview-frame" srcDoc={buildPreviewHtml(item, false)} />
            </div>
            <div>
              <div className="preview-col-title">答え（タップ後）</div>
              <iframe title="answer" className="preview-frame" srcDoc={buildPreviewHtml(item, true)} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
