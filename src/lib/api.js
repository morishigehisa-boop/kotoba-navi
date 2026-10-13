import { supabase } from './supabase'
import { fetchAllRows, run } from './db'

// ことばナビ・ごほうび（user_progress / point_logs）・ふりがな辞書のデータ取得と保存

// ---- 問題 ----
export const fetchQuestions = () => fetchAllRows('questions', (q) => q.select('*').order('id', { ascending: true }))

export const insertQuestions = (rows) => run(supabase.from('questions').insert(rows))
export const updateQuestion = (id, patch) => run(supabase.from('questions').update(patch).eq('id', id))
// question_set_items は on delete cascade で自動的に削除される
export const deleteQuestion = (id) => run(supabase.from('questions').delete().eq('id', id))
export const bulkUpdateQuestions = (ids, patch) => run(supabase.from('questions').update(patch).in('id', ids))
export const bulkDeleteQuestions = (ids) => run(supabase.from('questions').delete().in('id', ids))

// 回答を記録し、questions側の集計値（累計正解・連続正解・最終結果）を更新する。
// session_type='review' のときは集計値を更新しない（復習の正解は正解数にカウントしない）。
// 戻り値：更新した集計値（復習のときは undefined）
export async function recordAnswer({ question, isCorrect, sessionType, questionSetId }) {
  const { error: logError } = await supabase.from('answer_logs').insert({
    question_id: question.id,
    question_set_id: questionSetId || null,
    session_type: sessionType,
    is_correct: isCorrect
  })
  // 履歴が残せなくても、学習の集計（定着度）は更新する
  if (logError) console.error(logError)

  if (sessionType === 'review') return

  const now = new Date().toISOString()
  const patch = isCorrect
    ? { correct_count: (question.correct_count || 0) + 1, streak_count: (question.streak_count || 0) + 1, last_correct: true, last_answered_at: now }
    : { streak_count: 0, wrong_count: (question.wrong_count || 0) + 1, last_correct: false, last_answered_at: now }
  await updateQuestion(question.id, patch)
  return patch
}

// ---- 問題集 ----
export async function fetchQuestionSetsWithItems() {
  const [sets, items] = await Promise.all([
    fetchAllRows('question_sets', (q) => q.select('*').order('sort_order', { ascending: true }).order('id', { ascending: true })),
    fetchAllRows('question_set_items', (q) => q.select('question_set_id, question_id, position').order('position', { ascending: true }))
  ])
  const idsBySet = new Map()
  items.forEach((i) => {
    if (!idsBySet.has(i.question_set_id)) idsBySet.set(i.question_set_id, [])
    idsBySet.get(i.question_set_id).push(i.question_id)
  })
  return sets.map((set) => ({ ...set, questionIds: idsBySet.get(set.id) || [] }))
}

// ドラッグ&ドロップ後の並び順（question_setsのidの配列）をまとめて保存する
export async function reorderQuestionSets(orderedIds) {
  await Promise.all(orderedIds.map((id, index) => run(supabase.from('question_sets').update({ sort_order: index }).eq('id', id))))
}

export async function createQuestionSet({ name, filter_condition, goal_at, shuffle, questionIds }) {
  const maxRow = await run(supabase.from('question_sets').select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle())
  const set = await run(
    supabase
      .from('question_sets')
      .insert({ name, filter_condition, goal_at: goal_at || null, shuffle: !!shuffle, sort_order: (maxRow?.sort_order ?? -1) + 1 })
      .select()
      .single()
  )
  if (questionIds.length > 0) {
    await run(supabase.from('question_set_items').insert(questionIds.map((question_id, position) => ({ question_set_id: set.id, question_id, position }))))
  }
  return set
}

export const updateQuestionSet = (id, patch) => run(supabase.from('question_sets').update(patch).eq('id', id))
// question_set_items は on delete cascade で自動的に削除される。questions本体は削除しない。
export const deleteQuestionSet = (id) => run(supabase.from('question_sets').delete().eq('id', id))

// ---- 抽出条件の履歴 ----
export const saveFilterHistory = ({ name, filter_condition, result_count }) =>
  run(supabase.from('filter_history').insert({ name, filter_condition, result_count }))

export const fetchFilterHistory = () =>
  run(supabase.from('filter_history').select('*').order('created_at', { ascending: false }).limit(30))

// ---- ごほうび（ポイント・連続日数・キャラクターなど。1行だけのテーブル） ----
export const fetchProgress = () => run(supabase.from('user_progress').select('*').eq('id', 1).single())

export const updateProgress = (patch) =>
  run(supabase.from('user_progress').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', 1).select().single())

// ポイントの履歴を残す（何でいくら増減したか）。失敗しても学習は止めない
export function logPoints(source, delta, label) {
  if (!delta) return
  supabase.from('point_logs').insert({ source, delta, label: label || null }).then(({ error }) => {
    if (error) console.error(error)
  })
}

// ポイント履歴を新しい順に count 件（from 件目から）
export const fetchPointLogs = (from, count) =>
  run(
    supabase
      .from('point_logs')
      .select('id, source, delta, label, created_at')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(from, from + count - 1)
  )

// がんばりカレンダー用：学習した日の一覧（YYYY-MM-DD、重複なし）
// answer_logsは件数が多くなるため、DB側で日付を集計して返す関数を使う
export async function fetchActivityDates() {
  const data = await run(supabase.rpc('get_activity_dates'))
  return data.map((r) => r.activity_date)
}

// ---- ふりがな辞書（管理画面から編集する追加分） ----
export const fetchFuriganaEntries = () => fetchAllRows('furigana_entries', (q) => q.select('*').order('word', { ascending: true }))
export const addFuriganaEntry = (word, reading) => run(supabase.from('furigana_entries').insert({ word, reading }))
export const updateFuriganaEntry = (id, patch) => run(supabase.from('furigana_entries').update(patch).eq('id', id))
export const deleteFuriganaEntry = (id) => run(supabase.from('furigana_entries').delete().eq('id', id))
