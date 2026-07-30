import { useEffect, useMemo, useRef, useState } from 'react'
import { buildPreviewHtml } from './previewHtml'
import { EditModal } from './EditModal'
import { addFuriganaEntry, updateFuriganaEntry, deleteFuriganaEntry } from '../../lib/api'

const ANSWER_TYPE_LABELS_LOCAL = {
  self_recall: '自己採点',
  synonym_forward: '似た意味(順)',
  synonym_reverse: '似た意味(逆)',
  fill_blank: '穴埋め',
  pair_fill: '二文穴埋め',
  antonym_pair: '対になる',
  choice: '選択式'
}

export default function PreviewPanel({ questions, books, categories, types, sets, furiganaEntries, onChanged }) {
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const [book, setBook] = useState('')
  const [pageFrom, setPageFrom] = useState('')
  const [pageTo, setPageTo] = useState('')
  const [setId, setSetId] = useState('')
  const [index, setIndex] = useState(0)
  const [editing, setEditing] = useState(false)
  const [furiWord, setFuriWord] = useState('')
  const [furiReading, setFuriReading] = useState('')
  const [furiEditingId, setFuriEditingId] = useState(null)
  const [furiEditWord, setFuriEditWord] = useState('')
  const [furiEditReading, setFuriEditReading] = useState('')

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

  const [pinnedId, setPinnedId] = useState(null)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id])

  // 左右キーで前の問題・次の問題に移動する（フォームの入力中は無視する）
  useEffect(() => {
    function onKeyDown(e) {
      if (editing) return
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'ArrowRight') {
        setIndex((v) => Math.min(v + 1, filtered.length - 1))
      } else if (e.key === 'ArrowLeft') {
        setIndex((v) => Math.max(v - 1, 0))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [filtered.length, editing])

  function resetFilter(setter) {
    return (e) => { setter(e.target.value); setIndex(0) }
  }

  function itemText(q) {
    if (!q) return ''
    const c = q.content
    return [c.q, c.a, c.sentence, c.shown, c.sentenceA, c.sentenceB, c.answerA, c.answerB, c.reading, c.answer, ...(Array.isArray(c.a) ? c.a : []), ...(c.choices || [])]
      .filter(Boolean).join(' ')
  }

  const relevantFurigana = useMemo(() => {
    if (!item) return []
    const text = itemText(item)
    return furiganaEntries.filter((e) => text.includes(e.word))
  }, [item, furiganaEntries])

  const furiWordInputRef = useRef(null)

  async function handleAddFurigana() {
    if (!furiWord.trim() || !furiReading.trim()) { window.alert('単語と読みの両方を入力してください'); return }
    try {
      await addFuriganaEntry(furiWord.trim(), furiReading.trim())
      setFuriWord(''); setFuriReading('')
      await onChanged('ふりがなを追加しました')
    } catch {
      window.alert('追加に失敗しました（同じ単語が既に登録されている可能性があります）')
    } finally {
      furiWordInputRef.current?.focus()
    }
  }

  function startEditFurigana(e) {
    setFuriEditingId(e.id); setFuriEditWord(e.word); setFuriEditReading(e.reading)
  }

  async function saveEditFurigana() {
    if (!furiEditWord.trim() || !furiEditReading.trim()) return
    await updateFuriganaEntry(furiEditingId, { word: furiEditWord.trim(), reading: furiEditReading.trim() })
    setFuriEditingId(null)
    await onChanged('ふりがなを更新しました')
  }

  async function handleDeleteFurigana(e) {
    const ok = window.confirm(`「${e.word}（${e.reading}）」を削除しますか？`)
    if (!ok) return
    await deleteFuriganaEntry(e.id)
    await onChanged('ふりがなを削除しました')
  }

  return (
    <div className="card">
      <h2>子ども画面プレビュー</h2>
      <p className="lead" style={{ marginBottom: 8 }}>
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
            <div className="preview-nav-buttons">
              <button className="btn btn-secondary" disabled={safeIndex === 0} onClick={() => setIndex(safeIndex - 1)}>◀ 前の問題</button>
              <button className="btn btn-secondary" disabled={safeIndex >= filtered.length - 1} onClick={() => setIndex(safeIndex + 1)}>次の問題 ▶</button>
            </div>
            <div className="preview-nav-info">
              Q{String(item.id).padStart(4, '0')}　{safeIndex + 1} / {filtered.length}
            </div>
            <button className="btn btn-primary" onClick={() => setEditing(true)}>この問題を編集</button>
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

          <div className="furigana-inline">
            <div className="preview-col-title" style={{ marginTop: 12 }}>ふりがな</div>
            {relevantFurigana.length > 0 && (
              <div className="table-scroll" style={{ marginBottom: 8 }}>
                <table>
                  <thead><tr><th>単語</th><th>読み</th><th></th></tr></thead>
                  <tbody>
                    {relevantFurigana.map((e) => (
                      <tr key={e.id}>
                        {furiEditingId === e.id ? (
                          <>
                            <td><input type="text" value={furiEditWord} onChange={(ev) => setFuriEditWord(ev.target.value)} /></td>
                            <td><input type="text" value={furiEditReading} onChange={(ev) => setFuriEditReading(ev.target.value)} /></td>
                            <td className="row-actions">
                              <button className="btn btn-primary" onClick={saveEditFurigana}>保存</button>
                              <button className="btn btn-secondary" onClick={() => setFuriEditingId(null)}>キャンセル</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td><b>{e.word}</b></td>
                            <td>{e.reading}</td>
                            <td className="row-actions">
                              <button className="btn btn-secondary" onClick={() => startEditFurigana(e)}>編集</button>
                              <button className="btn btn-danger" onClick={() => handleDeleteFurigana(e)}>削除</button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="filters" style={{ marginBottom: 0 }}>
              <input ref={furiWordInputRef} type="text" placeholder="単語（例: 竹馬）" style={{ width: 140 }} value={furiWord} onChange={(e) => setFuriWord(e.target.value)} />
              <input type="text" placeholder="読み（例: ちくば）" style={{ width: 140 }} value={furiReading} onChange={(e) => setFuriReading(e.target.value)} />
              <button className="btn btn-primary" onClick={handleAddFurigana}>ふりがなを追加</button>
            </div>
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
