import { useEffect, useMemo, useState } from 'react'
import {
  fetchQuestions,
  fetchQuestionSetsWithItems,
  createQuestionSet,
  updateQuestionSet,
  deleteQuestionSet,
  reorderQuestionSets,
  insertQuestions,
  deleteQuestion,
  bulkUpdateQuestions,
  bulkDeleteQuestions,
  saveFilterHistory,
  fetchFilterHistory,
  fetchFuriganaEntries
} from '../../lib/api'
import { boxOf } from '../../lib/today'
import { setCustomFurigana } from '../../lib/furigana'
import { useConfirm } from './useConfirm'
import './admin.css'
import PreviewPanel from './PreviewPanel'
import { EditModal } from './EditModal'
import FuriganaPanel from './FuriganaPanel'

// 未正解・1回・2回・3回・かんぺき の5段階
const ADMIN_BOX_COLORS = ['#D8D2C0', '#F5D18C', '#F5A742', '#E8863A', '#4CB27A']

const ANSWER_TYPE_LABELS = {
  self_recall: '自己採点',
  synonym_forward: '似た意味(順)',
  synonym_reverse: '似た意味(逆)',
  fill_blank: '穴埋め',
  pair_fill: '二文穴埋め',
  antonym_pair: '対になる表現',
  synonym_pair: '類義語(二文穴埋め)',
  choice: '選択式'
}

// 統一CSVフォーマット: 1つのヘッダーで全パターンをカバーし、行ごとの answer_type 列で
// どの出題形式かを自動判定する（出題形式を事前に選ぶ必要がない）。
const UNIFIED_CSV_HEADER =
  'category,answer_type,question_text,sentence,shown_proverb,answer,answer_proverbs,sentence_a,answer_a,sentence_b,answer_b,reading,choices,source_book,source_page'

const UNIFIED_CSV_EXAMPLE = [
  UNIFIED_CSV_HEADER,
  'ことわざ,self_recall,苦労せず大きな利益を得ること。,,,ぬれ手で粟,,,,,,,,言葉ナビ上巻,12-13',
  '慣用句,fill_blank,都合の悪いことには触れないでおく。,自分の失敗ばかり（　　）人の批判ばかりする。,,棚に上げる,,,,,,,,言葉ナビ上巻,74',
  'ことわざ(似た意味),synonym_forward,名人でも時には失敗する。,,河童の川流れ,,弘法にも筆の誤り／猿も木から落ちる,,,,,,,言葉ナビ上巻,34-35',
  '類義語,pair_fill,,,,,,個人でも本を（　　）できる時代だ。,出版,雑誌を（　　）する。,刊行,,,言葉ナビ上巻,88-89',
  'ことわざ(対になる),antonym_pair,,,,,,危険な手段を用いること。,危ない橋を渡る,用心に用心を重ねること。,石橋を叩いて渡る,,,言葉ナビ上巻,37',
  '類義語,synonym_pair,,,,,,外国から届いた手紙に（　　）を書く。,返事,管制塔の呼びかけに（　　）する。,応答,,,言葉ナビ上巻,88',
  '同音異義語,choice,,（　　）技術の発展による恩恵を受ける。,,科学,,,,,,カガク,科学／化学,言葉ナビ上巻,144'
].join('\n')

function splitPipe(s) {
  return (s || '').split('／').map((v) => v.trim()).filter(Boolean)
}

function buildQuestionFromRow(row) {
  const t = row.answer_type
  const base = { category: row.category, answer_type: t, source_book: row.source_book, source_page: row.source_page }
  switch (t) {
    case 'self_recall':
      return { ...base, content: { q: row.question_text, a: row.answer } }
    case 'fill_blank':
      return { ...base, content: { sentence: row.sentence, q: row.question_text, a: row.answer } }
    case 'synonym_forward':
    case 'synonym_reverse':
      return { ...base, content: { q: row.question_text, shown: row.shown_proverb, a: splitPipe(row.answer_proverbs) } }
    case 'pair_fill':
    case 'antonym_pair':
    case 'synonym_pair':
      return { ...base, content: { sentenceA: row.sentence_a, answerA: row.answer_a, sentenceB: row.sentence_b, answerB: row.answer_b } }
    case 'choice':
      return { ...base, content: { reading: row.reading, sentence: row.sentence, choices: splitPipe(row.choices), answer: row.answer } }
    default:
      throw new Error(`不明な出題形式です: "${t}"`)
  }
}

function summarizeContent(q) {
  const c = q.content
  switch (q.answer_type) {
    case 'self_recall':
    case 'fill_blank':
      return { main: c.a, sub: c.q }
    case 'synonym_forward':
    case 'synonym_reverse':
      return { main: `${c.shown} → ${(c.a || []).join('／')}`, sub: c.q }
    case 'pair_fill':
    case 'antonym_pair':
    case 'synonym_pair':
      return { main: `①${c.answerA}　②${c.answerB}`, sub: `${c.sentenceA} / ${c.sentenceB}` }
    case 'choice':
      return { main: `${c.reading}：${c.answer}`, sub: `選択肢: ${(c.choices || []).join('／')}` }
    default:
      return { main: '(不明な形式)', sub: '' }
  }
}

function formatGoal(goalAt) {
  if (!goalAt) return { text: '未設定', cls: 'goal-none' }
  const goal = new Date(goalAt)
  const now = new Date()
  const diffMs = goal - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  const label = `${goal.getFullYear()}/${String(goal.getMonth() + 1).padStart(2, '0')}/${String(goal.getDate()).padStart(2, '0')}`
  if (diffMs < 0) return { text: `${label}（期限切れ）`, cls: 'goal-over' }
  if (diffDays <= 3) return { text: `${label}（あと${diffDays}日）`, cls: 'goal-soon' }
  return { text: `${label}（あと${diffDays}日）`, cls: 'goal-ok' }
}

function toastShow(setToast, msg, setToastType, type = 'success') {
  setToast(msg)
  if (setToastType) setToastType(type)
  setTimeout(() => setToast(''), 2200)
}

export default function AdminApp() {
  const [tab, setTab] = useState('list')
  const [questions, setQuestions] = useState([])
  const [sets, setSets] = useState([])
  const [history, setHistory] = useState([])
  const [furiganaEntries, setFuriganaEntries] = useState([])
  const [toast, setToast] = useState('')
  const [toastType, setToastType] = useState('success')
  const [loading, setLoading] = useState(true)
  const [confirm, confirmModal] = useConfirm()

  async function reloadAll() {
    const [qs, s, h, fe] = await Promise.all([fetchQuestions(), fetchQuestionSetsWithItems(), fetchFilterHistory(), fetchFuriganaEntries()])
    setQuestions(qs)
    setSets(s)
    setHistory(h)
    setFuriganaEntries(fe)
    setCustomFurigana(fe)
  }

  useEffect(() => {
    reloadAll()
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const books = useMemo(() => [...new Set(questions.map((q) => q.source_book))].filter(Boolean), [questions])
  const categories = useMemo(() => [...new Set(questions.map((q) => q.category))].filter(Boolean), [questions])
  const types = useMemo(() => [...new Set(questions.map((q) => q.answer_type))].filter(Boolean), [questions])

  if (loading) return <div className="wrap"><p>よみこみちゅう…</p></div>

  return (
    <div className="wrap">
      <h1>ことばナビ 管理画面</h1>
      <p className="lead">問題の登録・成績確認・問題集の作成をおこないます</p>

      <div className="tabs">
        {[
          ['list', '問題一覧'],
          ['preview', 'プレビュー'],
          ['make', '問題集作成'],
          ['sets', '問題集一覧'],
          ['history', '抽出条件履歴'],
          ['import', 'インポート'],
          ['furigana', 'ふりがな辞書']
        ].map(([key, label]) => (
          <button key={key} className={`tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'list' && (
        <ListPanel
          questions={questions}
          books={books}
          categories={categories}
          types={types}
          onChanged={async (msg) => {
            await reloadAll()
            toastShow(setToast, msg, setToastType)
          }}
        />
      )}
      {tab === 'preview' && (
        <PreviewPanel
          questions={questions}
          books={books}
          categories={categories}
          types={types}
          sets={sets}
          furiganaEntries={furiganaEntries}
          onChanged={async (msg) => {
            await reloadAll()
            toastShow(setToast, msg, setToastType)
          }}
        />
      )}
      {tab === 'make' && (
        <MakePanel
          questions={questions}
          books={books}
          categories={categories}
          types={types}
          onSaved={async (name, count) => {
            await reloadAll()
            toastShow(setToast, `「${name}」を作成しました（${count}問）`, setToastType)
            setTab('sets')
          }}
        />
      )}
      {tab === 'sets' && (
        <SetsPanel
          sets={sets}
          questions={questions}
          onDelete={async (set) => {
            const ok = await confirm(`「${set.name}」を削除しますか？\n（問題データ自体は削除されません。問題集の紐付けのみ削除されます）`)
            if (!ok) return
            await deleteQuestionSet(set.id)
            await reloadAll()
            toastShow(setToast, `「${set.name}」を削除しました`, setToastType)
          }}
          onReorder={async (orderedIds) => {
            await reorderQuestionSets(orderedIds)
            await reloadAll()
          }}
          onEdit={async (set, patch) => {
            await updateQuestionSet(set.id, patch)
            await reloadAll()
            toastShow(setToast, `「${patch.name}」を更新しました`, setToastType)
          }}
          onToggleReviewed={async (set, reviewed) => {
            await updateQuestionSet(set.id, { reviewed })
            await reloadAll()
          }}
        />
      )}
      {tab === 'history' && <HistoryPanel history={history} />}
      {tab === 'import' && (
        <ImportPanel
          onImported={async (count, typeLabel) => {
            await reloadAll()
            toastShow(setToast, `${count}問を追加しました（${typeLabel}）`, setToastType)
          }}
        />
      )}
      {tab === 'furigana' && (
        <FuriganaPanel
          entries={furiganaEntries}
          onChanged={async (msg) => {
            await reloadAll()
            toastShow(setToast, msg, setToastType)
          }}
        />
      )}

      {toast && <div className={`toast show toast-${toastType}`}>{toastType === 'error' ? '⚠️ ' : '✅ '}{toast}</div>}
      {confirmModal}
    </div>
  )
}

function ListPanel({ questions, books, categories, types, onChanged }) {
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const [book, setBook] = useState('')
  const [search, setSearch] = useState('')
  const [pageFrom, setPageFrom] = useState('')
  const [pageTo, setPageTo] = useState('')
  const [idFrom, setIdFrom] = useState('')
  const [idTo, setIdTo] = useState('')
  const [editing, setEditing] = useState(null) // 編集中の question オブジェクト
  const [bulkCategory, setBulkCategory] = useState('')
  const [bulkBook, setBulkBook] = useState('')
  const [bulkPage, setBulkPage] = useState('')
  const [bulkBusy, setBulkBusy] = useState(false)
  const [confirm, confirmModal] = useConfirm()

  const rows = questions.filter((q) => {
    if (idFrom !== '' && q.id < parseInt(idFrom)) return false
    if (idTo !== '' && q.id > parseInt(idTo)) return false
    if (category && q.category !== category) return false
    if (type && q.answer_type !== type) return false
    if (book && q.source_book !== book) return false
    if (search) {
      const s = summarizeContent(q)
      if (!s.main.includes(search) && !s.sub.includes(search)) return false
    }
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

  const idRangeActive = idFrom !== '' || idTo !== ''
  const filtersActive = idRangeActive || category || type || book || search || pageFrom !== '' || pageTo !== ''

  function resetFilters() {
    setIdFrom(''); setIdTo(''); setCategory(''); setType(''); setBook(''); setSearch(''); setPageFrom(''); setPageTo('')
  }

  async function handleDelete(q) {
    const s = summarizeContent(q)
    const ok = await confirm(`この問題を削除しますか？\n「${s.main}」\n（問題集に含まれている場合は、その紐付けも削除されます）`)
    if (!ok) return
    await deleteQuestion(q.id)
    onChanged('問題を削除しました')
  }

  async function handleBulkDelete() {
    if (rows.length === 0) return
    const ok = await confirm(`管理番号Q${String(idFrom || rows[0].id).padStart(4, '0')}〜Q${String(idTo || rows[rows.length - 1].id).padStart(4, '0')}の範囲で、現在の絞り込み条件に一致する ${rows.length}問 を削除します。\nこの操作は取り消せません。よろしいですか？`)
    if (!ok) return
    setBulkBusy(true)
    try {
      await bulkDeleteQuestions(rows.map((q) => q.id))
      await onChanged(`${rows.length}問を一括削除しました`)
    } finally {
      setBulkBusy(false)
    }
  }

  async function handleBulkUpdate() {
    if (rows.length === 0) return
    const patch = {}
    if (bulkCategory.trim()) patch.category = bulkCategory.trim()
    if (bulkBook.trim()) patch.source_book = bulkBook.trim()
    if (bulkPage.trim()) patch.source_page = bulkPage.trim()
    if (Object.keys(patch).length === 0) { window.alert('更新する項目を1つ以上入力してください'); return }
    const ok = await confirm(`絞り込み条件に一致する ${rows.length}問 を、入力した内容で一括更新します。よろしいですか？`)
    if (!ok) return
    setBulkBusy(true)
    try {
      await bulkUpdateQuestions(rows.map((q) => q.id), patch)
      setBulkCategory(''); setBulkBook(''); setBulkPage('')
      await onChanged(`${rows.length}問を一括更新しました`)
    } finally {
      setBulkBusy(false)
    }
  }

  return (
    <div className="card">
      <div className="filters">
        <input type="number" placeholder="管理番号(開始)" style={{ width: 120 }} value={idFrom} onChange={(e) => setIdFrom(e.target.value)} />
        <input type="number" placeholder="管理番号(終了)" style={{ width: 120 }} value={idTo} onChange={(e) => setIdTo(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">カテゴリー: すべて</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">出題形式: すべて</option>
          {types.map((t) => <option key={t} value={t}>{ANSWER_TYPE_LABELS[t] || t}</option>)}
        </select>
        <select value={book} onChange={(e) => setBook(e.target.value)}>
          <option value="">問題集: すべて</option>
          {books.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <input type="number" placeholder="ページ開始" style={{ width: 110 }} value={pageFrom} onChange={(e) => setPageFrom(e.target.value)} />
        <input type="number" placeholder="ページ終了" style={{ width: 110 }} value={pageTo} onChange={(e) => setPageTo(e.target.value)} />
        <input type="text" placeholder="キーワードを検索" value={search} onChange={(e) => setSearch(e.target.value)} />
        {filtersActive && <button className="btn btn-secondary" onClick={resetFilters}>フィルターをリセット</button>}
      </div>

      {idRangeActive && (
        <div className="bulk-panel">
          <div className="bulk-panel-title">一括操作（絞り込み条件に一致する {rows.length}問 が対象）</div>
          <div className="bulk-panel-row">
            <input type="text" placeholder="カテゴリーを一括変更" style={{ width: 160 }} value={bulkCategory} onChange={(e) => setBulkCategory(e.target.value)} disabled={bulkBusy} />
            <input type="text" placeholder="出典(問題集名)を一括変更" style={{ width: 180 }} value={bulkBook} onChange={(e) => setBulkBook(e.target.value)} disabled={bulkBusy} />
            <input type="text" placeholder="ページを一括変更" style={{ width: 140 }} value={bulkPage} onChange={(e) => setBulkPage(e.target.value)} disabled={bulkBusy} />
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
                  <td className="id-cell">Q{String(q.id).padStart(4, '0')}</td>
                  <td><span className="pill pill-cat">{q.category}</span></td>
                  <td><span className="pill pill-type">{ANSWER_TYPE_LABELS[q.answer_type] || q.answer_type}</span></td>
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
    </div>
  )
}



function MakePanel({ questions, books, categories, types, onSaved }) {
  const [book, setBook] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const [pageFrom, setPageFrom] = useState('')
  const [pageTo, setPageTo] = useState('')
  const [maxCorrect, setMaxCorrect] = useState('')
  const [maxStreak, setMaxStreak] = useState('')
  const [previewed, setPreviewed] = useState(false)
  const [setName, setSetName] = useState('')
  const [goalAt, setGoalAt] = useState('')
  const [saving, setSaving] = useState(false)

  function extract() {
    const pf = pageFrom === '' ? null : parseInt(pageFrom)
    const pt = pageTo === '' ? null : parseInt(pageTo)
    const mc = maxCorrect === '' ? null : parseInt(maxCorrect)
    const ms = maxStreak === '' ? null : parseInt(maxStreak)
    return questions.filter((q) => {
      if (book && q.source_book !== book) return false
      if (category && q.category !== category) return false
      if (type && q.answer_type !== type) return false
      if (pf !== null || pt !== null) {
        const pages = String(q.source_page).split('-').map(Number)
        const qFrom = pages[0]
        const qTo = pages[1] === undefined ? pages[0] : pages[1]
        if (pf !== null && qTo < pf) return false
        if (pt !== null && qFrom > pt) return false
      }
      if (mc !== null && q.correct_count > mc) return false
      if (ms !== null && q.streak_count > ms) return false
      return true
    })
  }

  function conditionLabel() {
    const parts = [book || 'すべての問題集', category || 'すべてのカテゴリー']
    if (type) parts.push(ANSWER_TYPE_LABELS[type] || type)
    if (pageFrom || pageTo) parts.push(`P.${pageFrom || '?'}〜${pageTo || '?'}`)
    if (maxCorrect !== '') parts.push(`累計正解${maxCorrect}回以下`)
    if (maxStreak !== '') parts.push(`連続正解${maxStreak}回以下`)
    return parts.join(' / ')
  }

  function generateName() {
    const parts = []
    if (book) parts.push(book)
    if (category) parts.push(category)
    if (pageFrom || pageTo) parts.push(`P.${pageFrom || '?'}〜${pageTo || '?'}`)
    if (maxCorrect !== '') parts.push(`累計正解${maxCorrect}回以下`)
    if (maxStreak !== '') parts.push(`連続正解${maxStreak}回以下`)
    return parts.length ? parts.join(' ') : 'すべての問題'
  }

  const result = previewed ? extract() : []

  async function handleSave() {
    if (!setName.trim()) { window.alert('問題集の名前を入力してください'); return }
    const finalResult = extract()
    if (finalResult.length === 0) { window.alert('該当する問題がありません'); return }
    setSaving(true)
    try {
      const condition = {
        source_book: book || null, category: category || null, answer_type: type || null,
        page_from: pageFrom || null, page_to: pageTo || null,
        max_correct_count: maxCorrect === '' ? null : Number(maxCorrect),
        max_streak_count: maxStreak === '' ? null : Number(maxStreak)
      }
      await createQuestionSet({
        name: setName.trim(),
        filter_condition: condition,
        goal_at: goalAt ? new Date(goalAt).toISOString() : null,
        questionIds: finalResult.map((q) => q.id)
      })
      await saveFilterHistory({ name: setName.trim(), filter_condition: condition, result_count: finalResult.length })
      onSaved(setName.trim(), finalResult.length)
      setSetName(''); setGoalAt(''); setPreviewed(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="card">
        <h2>抽出条件を指定</h2>
        <div className="form-grid">
          <div><label className="f-label">インプット問題集</label>
            <select value={book} onChange={(e) => setBook(e.target.value)}>
              <option value="">すべて</option>{books.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div><label className="f-label">カテゴリー</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">すべて</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="f-label">出題形式</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">すべて</option>{types.map((t) => <option key={t} value={t}>{ANSWER_TYPE_LABELS[t] || t}</option>)}
            </select>
          </div>
          <div></div>
          <div><label className="f-label">ページ開始</label>
            <input type="number" placeholder="例: 12" value={pageFrom} onChange={(e) => setPageFrom(e.target.value)} />
          </div>
          <div><label className="f-label">ページ終了</label>
            <input type="number" placeholder="例: 20" value={pageTo} onChange={(e) => setPageTo(e.target.value)} />
          </div>
          <div><label className="f-label">累計正解回数（以下）</label>
            <input type="number" placeholder="例: 2（空欄で指定なし）" value={maxCorrect} onChange={(e) => setMaxCorrect(e.target.value)} />
          </div>
          <div><label className="f-label">連続正解回数（以下）</label>
            <input type="number" placeholder="例: 1（空欄で指定なし）" value={maxStreak} onChange={(e) => setMaxStreak(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-secondary" onClick={() => { setPreviewed(true); setSetName(generateName()) }}>この条件で抽出する</button>
        {(book || category || type || pageFrom !== '' || pageTo !== '' || maxCorrect !== '' || maxStreak !== '') && (
          <button
            className="btn btn-secondary"
            style={{ marginLeft: 8 }}
            onClick={() => { setBook(''); setCategory(''); setType(''); setPageFrom(''); setPageTo(''); setMaxCorrect(''); setMaxStreak(''); setPreviewed(false) }}
          >
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
                    {result.map((q) => {
                      const s = summarizeContent(q)
                      return (
                        <tr key={q.id}>
                          <td className="id-cell">Q{String(q.id).padStart(4, '0')}</td>
                          <td><span className="pill pill-type">{ANSWER_TYPE_LABELS[q.answer_type] || q.answer_type}</span></td>
                          <td><div className="content-main">{s.main}</div></td>
                          <td>{q.source_book} P.{q.source_page}</td>
                          <td className="count-cell">{q.correct_count}</td>
                        </tr>
                      )
                    })}
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
          <div className="form-row">
            <label className="f-label">問題集の名前</label>
            <input type="text" value={setName} onChange={(e) => setSetName(e.target.value)} />
          </div>
          <div className="form-row">
            <label className="f-label">全問記憶の目標完了日（任意）</label>
            <input type="date" value={goalAt} onChange={(e) => setGoalAt(e.target.value)} />
          </div>
          <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
            {saving ? '保存中…' : 'この条件で問題集を作成する'}
          </button>
        </div>
      )}
    </>
  )
}

function SetsPanel({ sets, questions, onDelete, onReorder, onEdit, onToggleReviewed }) {
  const [order, setOrder] = useState(sets)
  const [dragId, setDragId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    setOrder(sets)
  }, [sets])

  const questionsById = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions])

  function progressOf(set) {
    const members = set.questionIds.map((id) => questionsById.get(id)).filter(Boolean)
    const total = members.length
    const boxCounts = [0, 1, 2, 3, 4].map((b) => members.filter((q) => boxOf(q) === b).length)
    const done = boxCounts[4]
    return { total, boxCounts, done, doneRate: total > 0 ? Math.round((done / total) * 100) : 0 }
  }

  function handleDrop(targetId) {
    if (dragId === null || dragId === targetId) { setDragOverId(null); return }
    const fromIdx = order.findIndex((s) => s.id === dragId)
    const toIdx = order.findIndex((s) => s.id === targetId)
    const next = [...order]
    const [moved] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, moved)
    setOrder(next)
    setDragId(null)
    setDragOverId(null)
    onReorder(next.map((s) => s.id))
  }

  function moveByOffset(index, offset) {
    const target = index + offset
    if (target < 0 || target >= order.length) return
    const next = [...order]
    ;[next[index], next[target]] = [next[target], next[index]]
    setOrder(next)
    onReorder(next.map((s) => s.id))
  }

  return (
    <div className="card">
      <h2>作成した問題集</h2>
      <p className="lead" style={{ marginBottom: 10 }}>行をドラッグ&ドロップすると、子どもアプリでの表示順を変更できます。「レビュー」は、プレビューで内容をチェックし終わった問題集にチェックを入れてください。</p>
      <div className="table-scroll">
        <table className="responsive-table sets-table">
          <thead><tr><th></th><th>問題集名</th><th>問題数</th><th>進捗</th><th>目標完了日</th><th>作成日</th><th></th><th>レビュー</th></tr></thead>
          <tbody>
            {order.length === 0 && <tr><td colSpan="8" className="empty">まだ問題集がありません</td></tr>}
            {order.map((s) => {
              const goal = formatGoal(s.goal_at)
              const p = progressOf(s)
              return (
                <tr
                  key={s.id}
                  draggable
                  onDragStart={() => setDragId(s.id)}
                  onDragOver={(e) => { e.preventDefault(); setDragOverId(s.id) }}
                  onDragEnd={() => { setDragId(null); setDragOverId(null) }}
                  onDrop={() => handleDrop(s.id)}
                  className={`drag-row ${dragOverId === s.id ? 'drag-over' : ''} ${dragId === s.id ? 'dragging' : ''} ${s.reviewed ? 'reviewed-row' : ''}`}
                >
                  <td className="drag-handle" title="ドラッグして並び替え">⠿</td>
                  <td>
                    <b>{s.name}</b>
                    <div className="mobile-reorder-btns">
                      <button className="btn btn-secondary" disabled={order.indexOf(s) === 0} onClick={() => moveByOffset(order.indexOf(s), -1)}>▲ 上へ</button>
                      <button className="btn btn-secondary" disabled={order.indexOf(s) === order.length - 1} onClick={() => moveByOffset(order.indexOf(s), 1)}>▼ 下へ</button>
                    </div>
                  </td>
                  <td className="count-cell">{s.questionIds.length}</td>
                  <td style={{ minWidth: 160 }}>
                    <div className="progress-stack" title={`未正解${p.boxCounts[0]}・1回${p.boxCounts[1]}・2回${p.boxCounts[2]}・3回${p.boxCounts[3]}・かんぺき${p.boxCounts[4]}`}>
                      {ADMIN_BOX_COLORS.map((color, i) => (
                        p.total > 0 && p.boxCounts[i] > 0 ? (
                          <div key={i} className="progress-seg" style={{ width: `${(p.boxCounts[i] / p.total) * 100}%`, background: color }} />
                        ) : null
                      ))}
                    </div>
                    <div className="progress-stack-label">かんぺき {p.doneRate}%（{p.done}/{p.total}）</div>
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

function toDateInputValue(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function SetEditModal({ set, onClose, onSave }) {
  const [name, setName] = useState(set.name)
  const [goalAt, setGoalAt] = useState(toDateInputValue(set.goal_at))
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!name.trim()) { window.alert('問題集の名前を入力してください'); return }
    setSaving(true)
    try {
      await onSave({ name: name.trim(), goal_at: goalAt ? new Date(goalAt).toISOString() : null })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <h2>問題集を編集</h2>
        <div className="form-row" style={{ maxWidth: 'none' }}>
          <label className="f-label">問題集の名前</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-row" style={{ maxWidth: 'none' }}>
          <label className="f-label">全問記憶の目標完了日（任意）</label>
          <input type="date" value={goalAt} onChange={(e) => setGoalAt(e.target.value)} />
          {goalAt && (
            <button className="btn btn-secondary" style={{ marginTop: 8 }} onClick={() => setGoalAt('')}>
              目標完了日をクリア
            </button>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>キャンセル</button>
          <button className="btn btn-primary" disabled={saving} onClick={handleSave}>{saving ? '保存中…' : '保存する'}</button>
        </div>
      </div>
    </div>
  )
}

function HistoryPanel({ history }) {
  return (
    <div className="card">
      <h2>抽出条件の履歴</h2>
      {history.length === 0 && <div className="empty">まだ抽出条件の履歴はありません</div>}
      {history.map((h) => (
        <div className="history-item" key={h.id}>
          <div>
            <div><b>{h.name}</b></div>
            <div className="history-cond">{h.result_count}問（{new Date(h.created_at).toLocaleString('ja-JP')}）</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ImportPanel({ onImported }) {
  const [csv, setCsv] = useState('')
  const [result, setResult] = useState('')
  const [errors, setErrors] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [importing, setImporting] = useState(false)

  function parseCsvRows(text) {
    const lines = text.trim().split('\n').filter((l) => l.trim())
    if (lines.length < 2) return []
    const headers = lines[0].split(',').map((h) => h.trim())
    return lines.slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const cols = line.split(',').map((c) => c.trim())
        const row = {}
        headers.forEach((h, i) => { row[h] = cols[i] ?? '' })
        return row
      })
  }

  function readFile(file) {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      window.alert('.csvファイルを選択してください')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      // Excel等が付与するBOM(先頭の見えない文字)を除去しておく
      const text = String(e.target.result).replace(/^\uFEFF/, '')
      setCsv(text)
      setResult('')
      setErrors([])
    }
    reader.readAsText(file, 'utf-8')
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    readFile(file)
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    readFile(file)
    e.target.value = ''
  }

  async function handleImport() {
    const rows = parseCsvRows(csv)
    if (rows.length === 0) { setResult('CSVの内容を確認してください（見出し行＋データ行が必要です）'); setErrors([]); return }

    const records = []
    const rowErrors = []
    rows.forEach((row, i) => {
      try {
        records.push(buildQuestionFromRow(row))
      } catch (e) {
        rowErrors.push(`${i + 2}行目: ${e.message}`)
      }
    })
    setErrors(rowErrors)

    if (records.length === 0) { setResult('取り込める行がありませんでした。'); return }

    setImporting(true)
    try {
      await insertQuestions(records)
      const typeCounts = records.reduce((acc, r) => {
        acc[r.answer_type] = (acc[r.answer_type] || 0) + 1
        return acc
      }, {})
      const summary = Object.entries(typeCounts).map(([t, n]) => `${ANSWER_TYPE_LABELS[t] || t}${n}問`).join('／')
      setResult(`${records.length}問を取り込みました（${summary}）`)
      setCsv('')
      onImported(records.length, summary)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="card">
      <h2>紙の問題集から作ったCSVを取り込む</h2>
      <p className="lead" style={{ marginBottom: 14 }}>
        写真から読み取った問題をこのチャットでCSV化してから、下に貼り付けるか、CSVファイルをドラッグ&ドロップしてください。行ごとの<code>answer_type</code>列から出題形式を自動判定するので、事前に形式を選ぶ必要はありません。使わない列は空欄のままでOKです。
      </p>
      <div className="format-hint">{UNIFIED_CSV_EXAMPLE}</div>

      <label
        className={`csv-dropzone ${dragOver ? 'drag-active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div>📄 CSVファイルをここにドラッグ&ドロップ、またはクリックして選択</div>
        <input type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={handleFileSelect} />
      </label>

      <textarea value={csv} onChange={(e) => setCsv(e.target.value)} placeholder={UNIFIED_CSV_EXAMPLE} />
      <div style={{ marginTop: 12 }}>
        <button className="btn btn-primary" disabled={importing} onClick={handleImport}>
          {importing ? <span className="spinner-inline"><span className="spinner" />取り込み中…</span> : '取り込む'}
        </button>
      </div>
      {result && <div className="preview-count">{result}</div>}
      {errors.length > 0 && (
        <div className="preview-count" style={{ color: '#D94848' }}>
          読み込めなかった行があります：<br />
          {errors.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}
    </div>
  )
}
