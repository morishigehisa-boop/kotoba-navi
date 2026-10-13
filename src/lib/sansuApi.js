import { supabase } from './supabase'
import { fetchAllRows, run } from './db'

// さんすうナビのデータ取得・保存（子ども画面・管理画面の共通）
export const MASTERED_STREAK = 3 // 3回連続で正解したら「できるようになった（習得）」
export const SANSU_DIFFICULTIES = [
  { value: 'easy', label: '易しい' },
  { value: 'normal', label: 'ふつう' },
  { value: 'hard', label: '難しい' }
]
export const difficultyLabel = (value) => SANSU_DIFFICULTIES.find((d) => d.value === value)?.label || value

const IMAGE_BUCKET = 'sansu-images'
const IMAGE_MAX_WIDTH = 1000 // アップロード前に、この幅まで縮小する
const IMAGE_QUALITY = 0.8

const fetchQuestionRows = (build) => fetchAllRows('sansu_questions', build)

function applyFilters(query, { units, difficulties, excludeMastered }) {
  let q = query.in('unit', units).in('difficulty', difficulties)
  if (excludeMastered) q = q.eq('is_mastered', false)
  return q
}

async function countRows(build) {
  const { count, error } = await build(supabase.from('sansu_questions').select('id', { count: 'exact', head: true }))
  if (error) throw error
  return count || 0
}

// ---- 子ども画面 ----
export async function fetchSansuUnits() {
  const rows = await fetchQuestionRows((q) => q.select('unit').order('id', { ascending: true }))
  return [...new Set(rows.map((r) => r.unit))].sort()
}

export const countSansuQuestions = (filters) => countRows((q) => applyFilters(q, filters))

export const fetchSansuQuestions = (filters) =>
  fetchQuestionRows((q) => applyFilters(q.select('*').order('id', { ascending: true }), filters))

// きろく画面用：全問題数と、習得した問題数
export async function fetchSansuMasteryCounts() {
  const [all, mastered] = await Promise.all([countRows((q) => q), countRows((q) => q.eq('is_mastered', true))])
  return { all, mastered }
}

export async function recordSansuAnswer(question, isCorrect) {
  await run(supabase.from('sansu_answer_logs').insert({ question_id: question.id, is_correct: isCorrect }))

  const consecutive = isCorrect ? (question.consecutive_correct || 0) + 1 : 0
  const nowMastered = consecutive >= MASTERED_STREAK
  await run(
    supabase
      .from('sansu_questions')
      .update({ consecutive_correct: consecutive, is_mastered: nowMastered, last_answered_at: new Date().toISOString() })
      .eq('id', question.id)
  )
  // 今回の正解で、はじめて「習得」になったか（すごろくを進める判定に使う）
  return { newlyMastered: nowMastered && !question.is_mastered }
}

// ---- 管理画面 ----
export const fetchRecentSansuQuestions = (limit) =>
  run(supabase.from('sansu_questions').select('*').order('created_at', { ascending: false }).limit(limit))

export const insertSansuQuestion = (row) => run(supabase.from('sansu_questions').insert(row))
export const deleteSansuQuestion = (id) => run(supabase.from('sansu_questions').delete().eq('id', id))

// 単元・教材名の選択肢（option_type: 'unit' | 'source'）
export async function fetchSansuOptions() {
  const rows = await fetchAllRows('sansu_meta_options', (q) => q.select('*').order('name', { ascending: true }))
  return { units: rows.filter((o) => o.option_type === 'unit'), sources: rows.filter((o) => o.option_type === 'source') }
}

// すでに同じ名前がある場合（一意制約違反）は、何もしない
export async function addSansuOption(type, name) {
  const trimmed = name.trim()
  if (!trimmed) return
  const { error } = await supabase.from('sansu_meta_options').insert({ option_type: type, name: trimmed })
  if (error && error.code !== '23505') throw error
}

export const deleteSansuOption = (id) => run(supabase.from('sansu_meta_options').delete().eq('id', id))

// 画像を縮小・JPEG圧縮してアップロードし、公開URLを返す
export async function uploadSansuImage(file) {
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
  const blob = await compressImage(file)
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(fileName, blob, { contentType: 'image/jpeg' })
  if (error) throw error
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(fileName).data.publicUrl
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, IMAGE_MAX_WIDTH / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      canvas.toBlob(resolve, 'image/jpeg', IMAGE_QUALITY)
    }
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e) }
    img.src = url
  })
}
