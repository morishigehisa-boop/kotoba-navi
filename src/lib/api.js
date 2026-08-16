import { supabase } from './supabase'

export async function fetchQuestions() {
  const PAGE_SIZE = 1000
  let all = []
  let from = 0
  while (true) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)
    if (error) throw error
    all = all.concat(data)
    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }
  return all
}

export async function fetchQuestionSetsWithItems() {
  const { data: sets, error: e1 } = await supabase
    .from('question_sets')
    .select('*')
    .order('sort_order', { ascending: true })
  if (e1) throw e1

  const PAGE_SIZE = 1000
  let items = []
  let from = 0
  while (true) {
    const { data, error: e2 } = await supabase
      .from('question_set_items')
      .select('question_set_id, question_id, position')
      .order('position', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)
    if (e2) throw e2
    items = items.concat(data)
    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }

  return sets.map((set) => ({
    ...set,
    questionIds: items.filter((i) => i.question_set_id === set.id).map((i) => i.question_id)
  }))
}

// ドラッグ&ドロップ後の並び順（question_setsのidの配列、新しい順）をまとめて保存する
export async function reorderQuestionSets(orderedIds) {
  await Promise.all(
    orderedIds.map((id, index) => supabase.from('question_sets').update({ sort_order: index }).eq('id', id))
  )
}

export async function createQuestionSet({ name, filter_condition, goal_at, questionIds }) {
  const { data: maxRow } = await supabase
    .from('question_sets')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()
  const nextSortOrder = (maxRow?.sort_order ?? -1) + 1

  const { data: set, error: e1 } = await supabase
    .from('question_sets')
    .insert({ name, filter_condition, goal_at: goal_at || null, sort_order: nextSortOrder })
    .select()
    .single()
  if (e1) throw e1

  if (questionIds.length > 0) {
    const rows = questionIds.map((question_id, position) => ({
      question_set_id: set.id,
      question_id,
      position
    }))
    const { error: e2 } = await supabase.from('question_set_items').insert(rows)
    if (e2) throw e2
  }
  return set
}

export async function updateQuestionSet(id, patch) {
  const { error } = await supabase.from('question_sets').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteQuestionSet(id) {
  // question_set_items は on delete cascade で自動的に削除される。questions本体は削除しない。
  const { error } = await supabase.from('question_sets').delete().eq('id', id)
  if (error) throw error
}

export async function insertQuestions(rows) {
  const { error } = await supabase.from('questions').insert(rows)
  if (error) throw error
}

export async function updateQuestion(id, patch) {
  const { error } = await supabase.from('questions').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteQuestion(id) {
  // question_set_items は on delete cascade で自動的に削除される
  const { error } = await supabase.from('questions').delete().eq('id', id)
  if (error) throw error
}

export async function bulkUpdateQuestions(ids, patch) {
  const { error } = await supabase.from('questions').update(patch).in('id', ids)
  if (error) throw error
}

export async function bulkDeleteQuestions(ids) {
  const { error } = await supabase.from('questions').delete().in('id', ids)
  if (error) throw error
}

export async function fetchProgress() {
  const { data, error } = await supabase.from('user_progress').select('*').eq('id', 1).single()
  if (error) throw error
  return data
}

export async function updateProgress(patch) {
  const { data, error } = await supabase
    .from('user_progress')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single()
  if (error) throw error
  return data
}
// がんばりカレンダー用：学習した日の一覧（YYYY-MM-DD、重複なし）を取得
export async function fetchActivityDates() {
  const { data, error } = await supabase.from('answer_logs').select('answered_at')
  if (error) throw error
  const set = new Set(data.map((r) => r.answered_at.slice(0, 10)))
  return [...set]
}

// ふりがな辞書（管理画面から編集する追加分）
export async function fetchFuriganaEntries() {
  const { data, error } = await supabase.from('furigana_entries').select('*').order('word', { ascending: true })
  if (error) throw error
  return data
}

export async function addFuriganaEntry(word, reading) {
  const { error } = await supabase.from('furigana_entries').insert({ word, reading })
  if (error) throw error
}

export async function updateFuriganaEntry(id, patch) {
  const { error } = await supabase.from('furigana_entries').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteFuriganaEntry(id) {
  const { error } = await supabase.from('furigana_entries').delete().eq('id', id)
  if (error) throw error
}

export async function saveFilterHistory({ name, filter_condition, result_count }) {
  const { error } = await supabase.from('filter_history').insert({ name, filter_condition, result_count })
  if (error) throw error
}

export async function fetchFilterHistory() {
  const { data, error } = await supabase
    .from('filter_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30)
  if (error) throw error
  return data
}

// 回答を記録し、questions側の集計値（累計正解・連続正解・最終結果）を更新する。
// session_type='review' のときは集計値を更新しない（復習の正解は正解数にカウントしない）。
export async function recordAnswer({ question, isCorrect, sessionType, questionSetId }) {
  await supabase.from('answer_logs').insert({
    question_id: question.id,
    question_set_id: questionSetId || null,
    session_type: sessionType,
    is_correct: isCorrect
  })

  if (sessionType === 'review') return

  const patch = isCorrect
    ? {
        correct_count: (question.correct_count || 0) + 1,
        streak_count: (question.streak_count || 0) + 1,
        last_correct: true,
        last_answered_at: new Date().toISOString()
      }
    : {
        streak_count: 0,
        wrong_count: (question.wrong_count || 0) + 1,
        last_correct: false,
        last_answered_at: new Date().toISOString()
      }

  const { error } = await supabase.from('questions').update(patch).eq('id', question.id)
  if (error) throw error
  return patch
}
