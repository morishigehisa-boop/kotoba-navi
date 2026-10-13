import { useEffect, useState } from 'react'
import { fetchTasks, fetchTaskCompletions, occursOn, completionKey } from '../../lib/tasks'
import { fetchSansuMasteryCounts, MASTERED_STREAK } from '../../lib/sansuApi'
import { toISODate, addDaysISO } from '../../lib/dates'

const WEEK_DAYS = 7

// 直近7日間（今日をふくむ）の「やること」の達成状況
function weekStats(tasks, completions) {
  const done = new Set(completions.map((c) => completionKey(c.task_id, c.occurrence_date)))
  const today = toISODate()
  let total = 0
  let finished = 0
  for (let i = 0; i < WEEK_DAYS; i++) {
    const iso = addDaysISO(today, -i)
    for (const t of tasks) {
      if (!occursOn(t, iso)) continue
      total += 1
      if (done.has(completionKey(t.id, iso))) finished += 1
    }
  }
  return { total, finished }
}

// 「さんすう」と「やること」の記録（ことばナビの記録は、下の「がんばり記録」に表示される）
export default function OverallRecord() {
  const [data, setData] = useState(null)

  useEffect(() => {
    let alive = true
    Promise.all([fetchSansuMasteryCounts(), fetchTasks(), fetchTaskCompletions()])
      .then(([sansu, tasks, completions]) => { if (alive) setData({ ...sansu, week: weekStats(tasks, completions) }) })
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
        <div className="overall-sub">{MASTERED_STREAK}回連続で正解できた問題</div>
      </div>
      <div className="overall-card">
        <div className="overall-title">✅ やること（{WEEK_DAYS}日間）</div>
        <div className="overall-num">{rate === null ? '—' : `${rate}%`}<span> {week.finished} / {week.total}個</span></div>
        <div className="overall-sub">終わらせた割合</div>
      </div>
    </div>
  )
}
