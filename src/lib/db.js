import { supabase } from './supabase'

// Supabase は1回の取得が最大1,000行なので、一覧は必ずこの関数で .range() を使ってページ分けして取る。
// 使い方: fetchAllRows('tasks', (q) => q.select('*').order('id'))
const PAGE_SIZE = 1000

export async function fetchAllRows(table, build) {
  let all = []
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await build(supabase.from(table)).range(from, from + PAGE_SIZE - 1)
    if (error) throw error
    all = all.concat(data)
    if (data.length < PAGE_SIZE) return all
  }
}

// { error } を返す Supabase の呼び出しで、失敗したら例外にする
export async function run(query) {
  const { data, error } = await query
  if (error) throw error
  return data
}
