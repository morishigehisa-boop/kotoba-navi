import { useState } from 'react'
import { updateQuestion } from '../../lib/api'

export const ANSWER_TYPE_LABELS = {
  self_recall: '自己採点',
  synonym_forward: '似た意味(順)',
  synonym_reverse: '似た意味(逆)',
  fill_blank: '穴埋め',
  pair_fill: '二文穴埋め',
  antonym_pair: '対になる',
  synonym_pair: '類義語(二文穴埋め)',
  choice: '選択式'
}

export function EditModal({ question, onClose, onSaved }) {
  const [category, setCategory] = useState(question.category)
  const [sourceBook, setSourceBook] = useState(question.source_book || '')
  const [sourcePage, setSourcePage] = useState(question.source_page || '')
  const [content, setContent] = useState(() => {
    const c = { ...question.content }
    // 編集フォームでは配列項目をテキストで扱う
    if (Array.isArray(c.a)) c.aText = c.a.join('／')
    if (Array.isArray(c.choices)) c.choicesText = c.choices.join('／')
    return c
  })
  const [saving, setSaving] = useState(false)

  function setField(key, value) {
    setContent((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const c = { ...content }
      if ('aText' in c) { c.a = c.aText.split('／').map((s) => s.trim()).filter(Boolean); delete c.aText }
      if ('choicesText' in c) { c.choices = c.choicesText.split('／').map((s) => s.trim()).filter(Boolean); delete c.choicesText }
      await updateQuestion(question.id, {
        category, source_book: sourceBook, source_page: sourcePage, content: c
      })
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  const t = question.answer_type

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>問題を編集（Q{String(question.id).padStart(4, '0')} ／ {ANSWER_TYPE_LABELS[t] || t}）</h2>

        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div><label className="f-label">カテゴリー</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div></div>
          <div><label className="f-label">出典（問題集名）</label>
            <input type="text" value={sourceBook} onChange={(e) => setSourceBook(e.target.value)} />
          </div>
          <div><label className="f-label">ページ</label>
            <input type="text" value={sourcePage} onChange={(e) => setSourcePage(e.target.value)} />
          </div>
        </div>

        <hr />

        {(t === 'self_recall' || t === 'fill_blank') && (
          <>
            {t === 'fill_blank' && (
              <div className="form-row" style={{ maxWidth: 'none' }}>
                <label className="f-label">穴埋め例文</label>
                <textarea value={content.sentence || ''} onChange={(e) => setField('sentence', e.target.value)} />
              </div>
            )}
            <div className="form-row" style={{ maxWidth: 'none' }}>
              <label className="f-label">意味</label>
              <textarea value={content.q || ''} onChange={(e) => setField('q', e.target.value)} />
            </div>
            <div className="form-row">
              <label className="f-label">答え</label>
              <input type="text" value={content.a || ''} onChange={(e) => setField('a', e.target.value)} />
            </div>
          </>
        )}

        {(t === 'synonym_forward' || t === 'synonym_reverse') && (
          <>
            <div className="form-row" style={{ maxWidth: 'none' }}>
              <label className="f-label">意味</label>
              <textarea value={content.q || ''} onChange={(e) => setField('q', e.target.value)} />
            </div>
            <div className="form-row">
              <label className="f-label">表示することわざ</label>
              <input type="text" value={content.shown || ''} onChange={(e) => setField('shown', e.target.value)} />
            </div>
            <div className="form-row">
              <label className="f-label">答え（複数の場合は／で区切る）</label>
              <input type="text" value={content.aText ?? ''} onChange={(e) => setField('aText', e.target.value)} />
            </div>
          </>
        )}

        {(t === 'pair_fill' || t === 'antonym_pair' || t === 'synonym_pair') && (
          <>
            <div className="form-row" style={{ maxWidth: 'none' }}>
              <label className="f-label">{t === 'antonym_pair' ? '意味①' : t === 'synonym_pair' ? '例文①' : '例文①'}</label>
              <input type="text" value={content.sentenceA || ''} onChange={(e) => setField('sentenceA', e.target.value)} />
            </div>
            <div className="form-row">
              <label className="f-label">答え①</label>
              <input type="text" value={content.answerA || ''} onChange={(e) => setField('answerA', e.target.value)} />
            </div>
            <div className="form-row" style={{ maxWidth: 'none' }}>
              <label className="f-label">{t === 'antonym_pair' ? '意味②' : t === 'synonym_pair' ? '例文②' : '例文②'}</label>
              <input type="text" value={content.sentenceB || ''} onChange={(e) => setField('sentenceB', e.target.value)} />
            </div>
            <div className="form-row">
              <label className="f-label">答え②</label>
              <input type="text" value={content.answerB || ''} onChange={(e) => setField('answerB', e.target.value)} />
            </div>
          </>
        )}

        {t === 'choice' && (
          <>
            <div className="form-row">
              <label className="f-label">読み（カタカナ）</label>
              <input type="text" value={content.reading || ''} onChange={(e) => setField('reading', e.target.value)} />
            </div>
            <div className="form-row" style={{ maxWidth: 'none' }}>
              <label className="f-label">穴埋め例文</label>
              <input type="text" value={content.sentence || ''} onChange={(e) => setField('sentence', e.target.value)} />
            </div>
            <div className="form-row">
              <label className="f-label">選択肢（／で区切る）</label>
              <input type="text" value={content.choicesText ?? ''} onChange={(e) => setField('choicesText', e.target.value)} />
            </div>
            <div className="form-row">
              <label className="f-label">正解</label>
              <input type="text" value={content.answer || ''} onChange={(e) => setField('answer', e.target.value)} />
            </div>
          </>
        )}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>キャンセル</button>
          <button className="btn btn-primary" disabled={saving} onClick={handleSave}>{saving ? '保存中…' : '保存する'}</button>
        </div>
      </div>
    </div>
  )
}
