import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { fetchTasks, fetchTaskCompletions, occursOn, toISODate } from '../../lib/tasks'

// 「さんすう」と「やること」の記録（ことばナビの記録は、下の「がんばり記録」に表示される）
async function countRows(filter) {
  let q = supabase.from('sansu_questions').select('id', { count: 'exact', head: true })
  if (filter) q = filter(q)
  const { count, error } = await q
  if (error) throw error
  return count || 0
}

// 直近7日間（今日をふくむ）の「やること」の達成状況
function weekStats(tasks, completions) {
  const done = new Set(completions.map((c) => `${c.task_id}|${c.occurrence_date}`))
  const base = new Date()
  let total = 0
  let finished = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(base)
    d.setDate(d.getDate() - i)
    const iso = toISODate(d)
    for (const t of tasks) {
      if (!occursOn(t, iso)) continue
      total += 1
      if (done.has(`${t.id}|${iso}`)) finished += 1
    }
  }
  return { total, finished }
}

export default function OverallRecord() {
  const [data, setData] = useState(null)

  useEffect(() => {
    let alive = true
    Promise.all([countRows(), countRows((q) => q.eq('is_mastered', true)), fetchTasks(), fetchTaskCompletions()])
      .then(([all, mastered, tasks, completions]) => {
        if (alive) setData({ all, mastered, week: weekStats(tasks, completions) })
      })
      .catch(console.error)
    return () => { alive = false }
  }, [])

  if (!data) return null
  const { all, mastered, week } = data
  const rate = week.total > 0 ? Math.round((week.finished / week.total) * 100) : null
  return (
    <div className="overall-record">
      <div className="overall-card">
        <div className="overall-title">🔢 さんすう</div>
        <div className="overall-num">{mastered}<span> / {all}問</span></div>
        <div className="overall-sub">3回連続で正解できた問題</div>
      </div>
      <div className="overall-card">
        <div className="overall-title">✅ やること（7日間）</div>
        <div className="overall-num">{rate === null ? '—' : `${rate}%`}<span> {week.finished} / {week.total}個</span></div>
        <div className="overall-sub">終わらせた割合</div>
      </div>
    </div>
  )
}
