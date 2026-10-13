// ことばナビの問題の「出題形式（answer_type）」まわりの定義。管理画面の一覧・編集・取り込み・抽出で共通に使う。
// content の形は supabase/schema.sql を参照。

const ANSWER_TYPE_LABELS = {
  self_recall: '自己採点',
  synonym_forward: '似た意味(順)',
  synonym_reverse: '似た意味(逆)',
  fill_blank: '穴埋め',
  pair_fill: '二文穴埋め',
  antonym_pair: '対になる表現',
  synonym_pair: '類義語(二文穴埋め)',
  wago_fill: '和語(穴埋め)',
  meaning_first_fill: '意味→穴埋め',
  choice: '選択式'
}
export const typeLabel = (t) => ANSWER_TYPE_LABELS[t] || t

// content の形ごとのグループ
const TYPE_GROUPS = {
  recall: ['self_recall', 'fill_blank', 'wago_fill', 'meaning_first_fill'], // { sentence?, q, a }
  synonym: ['synonym_forward', 'synonym_reverse'], // { q, shown, a: [] }
  pair: ['pair_fill', 'antonym_pair', 'synonym_pair'], // { sentenceA, answerA, sentenceB, answerB }
  choice: ['choice'] // { reading, sentence, choices: [], answer }
}
export const groupOf = (t) => Object.keys(TYPE_GROUPS).find((g) => TYPE_GROUPS[g].includes(t)) || null

// 複数の答え・選択肢は「／」区切りで入力する
const SEPARATOR = '／'
export const splitSlash = (s) => (s || '').split(SEPARATOR).map((v) => v.trim()).filter(Boolean)
export const joinSlash = (list) => (list || []).join(SEPARATOR)

// 管理番号の表示（例：Q0012）
export const formatQid = (id) => `Q${String(id).padStart(4, '0')}`

// 一覧に出す要約（main：答えなど／sub：問題文など）
export function summarizeContent(q) {
  const c = q.content
  switch (groupOf(q.answer_type)) {
    case 'recall':
      return { main: c.a, sub: c.q }
    case 'synonym':
      return { main: `${c.shown} → ${joinSlash(c.a)}`, sub: c.q }
    case 'pair':
      return { main: `①${c.answerA} ②${c.answerB}`, sub: `${c.sentenceA} / ${c.sentenceB}` }
    case 'choice':
      return { main: `${c.reading}：${c.answer}`, sub: `選択肢: ${joinSlash(c.choices)}` }
    default:
      return { main: '(不明な形式)', sub: '' }
  }
}

// 'P.12-13' のようなページ範囲が、指定した範囲と重なるか
function pageOverlaps(sourcePage, from, to) {
  const [p1, p2] = String(sourcePage || '').split('-').map(Number)
  const qFrom = p1
  const qTo = p2 === undefined ? p1 : p2
  if (Number.isNaN(qFrom)) return false
  if (from !== '' && qTo < Number(from)) return false
  if (to !== '' && qFrom > Number(to)) return false
  return true
}

/**
 * 問題の絞り込み（管理画面の一覧・プレビュー・問題集作成で共通）。空文字の条件は「指定なし」。
 * @param f { category, type, book, pageFrom, pageTo, idFrom, idTo, search, maxCorrect, maxStreak }
 */
export function filterQuestions(questions, f) {
  const has = (v) => v !== undefined && v !== ''
  return questions.filter((q) => {
    if (has(f.idFrom) && q.id < Number(f.idFrom)) return false
    if (has(f.idTo) && q.id > Number(f.idTo)) return false
    if (f.category && q.category !== f.category) return false
    if (f.type && q.answer_type !== f.type) return false
    if (f.book && q.source_book !== f.book) return false
    if ((has(f.pageFrom) || has(f.pageTo)) && !pageOverlaps(q.source_page, f.pageFrom ?? '', f.pageTo ?? '')) return false
    if (has(f.maxCorrect) && q.correct_count > Number(f.maxCorrect)) return false
    if (has(f.maxStreak) && q.streak_count > Number(f.maxStreak)) return false
    if (f.search) {
      const s = summarizeContent(q)
      if (!String(s.main).includes(f.search) && !String(s.sub).includes(f.search)) return false
    }
    return true
  })
}

// ---- CSV取り込み ----
// 統一CSVフォーマット: 1つのヘッダーで全パターンをカバーし、行ごとの answer_type 列で
// どの出題形式かを自動判定する（出題形式を事前に選ぶ必要がない）。
const CSV_HEADER =
  'category,answer_type,question_text,sentence,shown_proverb,answer,answer_proverbs,sentence_a,answer_a,sentence_b,answer_b,reading,choices,source_book,source_page'

export const CSV_EXAMPLE = [
  CSV_HEADER,
  'ことわざ,self_recall,苦労せず大きな利益を得ること。,,,ぬれ手で粟,,,,,,,,言葉ナビ上巻,12-13',
  '慣用句,fill_blank,都合の悪いことには触れないでおく。,自分の失敗ばかり（　　）人の批判ばかりする。,,棚に上げる,,,,,,,,言葉ナビ上巻,74',
  'ことわざ(似た意味),synonym_forward,名人でも時には失敗する。,,河童の川流れ,,弘法にも筆の誤り／猿も木から落ちる,,,,,,,言葉ナビ上巻,34-35',
  '類義語,pair_fill,,,,,,個人でも本を（　　）できる時代だ。,出版,雑誌を（　　）する。,刊行,,,言葉ナビ上巻,88-89',
  'ことわざ(対になる),antonym_pair,,,,,,危険な手段を用いること。,危ない橋を渡る,用心に用心を重ねること。,石橋を叩いて渡る,,,言葉ナビ上巻,37',
  '類義語,synonym_pair,,,,,,外国から届いた手紙に（　　）を書く。,返事,管制塔の呼びかけに（　　）する。,応答,,,言葉ナビ上巻,88',
  '和語,wago_fill,相手の話にうなずいてうまく調子を合わせること。,「（　　）を打つ」,,あいづち,,,,,,,,和語①,13',
  '三字熟語,meaning_first_fill,人に対して威圧的な態度をとるさま。,「あの人はとたんに（　　）にふるまう」,,居丈高,,,,,,,,漢字とことば 5年下,33',
  '同音異義語,choice,,（　　）技術の発展による恩恵を受ける。,,科学,,,,,,カガク,科学／化学,言葉ナビ上巻,144'
].join('\n')

// 見出し行＋データ行のCSVを、見出しをキーにしたオブジェクトの配列にする（値にカンマを含めない前提の簡易版）
export function parseCsvRows(text) {
  const lines = text.trim().split('\n').filter((l) => l.trim())
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const cols = line.split(',').map((c) => c.trim())
    return Object.fromEntries(headers.map((h, i) => [h, cols[i] ?? '']))
  })
}

// CSVの1行 → questions テーブルの1行
export function buildQuestionFromRow(row) {
  const t = row.answer_type
  const base = { category: row.category, answer_type: t, source_book: row.source_book, source_page: row.source_page }
  switch (groupOf(t)) {
    case 'recall':
      return { ...base, content: t === 'self_recall' ? { q: row.question_text, a: row.answer } : { sentence: row.sentence, q: row.question_text, a: row.answer } }
    case 'synonym':
      return { ...base, content: { q: row.question_text, shown: row.shown_proverb, a: splitSlash(row.answer_proverbs) } }
    case 'pair':
      return { ...base, content: { sentenceA: row.sentence_a, answerA: row.answer_a, sentenceB: row.sentence_b, answerB: row.answer_b } }
    case 'choice':
      return { ...base, content: { reading: row.reading, sentence: row.sentence, choices: splitSlash(row.choices), answer: row.answer } }
    default:
      throw new Error(`不明な出題形式です: "${t}"`)
  }
}
