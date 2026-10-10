import { supabase } from './supabase'

// さんすうナビのデータ取得。1,000行の上限があるため、一覧は必ず .range() でページ分けして取る。
const PAGE_SIZE = 1000
export const MASTERED_STREAK = 3 // 3回連続で正解したら「できるようになった」

async function fetchAll(build) {
  let all = []
  let from = 0
  while (true) {
    const { data, error } = await build(supabase.from('sansu_questions')).range(from, from + PAGE_SIZE - 1)
    if (error) throw error
    all = all.concat(data)
    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }
  return all
}

function applyFilters(query, { units, difficulties, excludeMastered }) {
  let q = query.in('unit', units).in('difficulty', difficulties)
  if (excludeMastered) q = q.eq('is_mastered', false)
  return q
}

export async function fetchSansuUnits() {
  const rows = await fetchAll((q) => q.select('unit').order('id', { ascending: true }))
  return [...new Set(rows.map((r) => r.unit))].sort()
}

export async function countSansuQuestions(filters) {
  const { count, error } = await applyFilters(
    supabase.from('sansu_questions').select('id', { count: 'exact', head: true }),
    filters
  )
  if (error) throw error
  return count || 0
}

export const fetchSansuQuestions = (filters) =>
  fetchAll((q) => applyFilters(q.select('*').order('id', { ascending: true }), filters))

export async function recordSansuAnswer(question, isCorrect) {
  const { error: logError } = await supabase.from('sansu_answer_logs').insert({ question_id: question.id, is_correct: isCorrect })
  if (logError) throw logError

  const consecutive = isCorrect ? (question.consecutive_correct || 0) + 1 : 0
  const { error } = await supabase
    .from('sansu_questions')
    .update({
      consecutive_correct: consecutive,
      is_mastered: consecutive >= MASTERED_STREAK,
      last_answered_at: new Date().toISOString()
    })
    .eq('id', question.id)
  if (error) throw error
}
