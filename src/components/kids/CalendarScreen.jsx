import { useEffect, useState } from 'react'
import { fetchActivityDates } from '../../lib/api'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function toDateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function CalendarScreen({ onBack }) {
  const [dates, setDates] = useState(null)
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d })

  useEffect(() => {
    fetchActivityDates().then(setDates).catch(() => setDates([]))
  }, [])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const now = new Date()
  const todayStr = toDateStr(now.getFullYear(), now.getMonth(), now.getDate())

  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const activeSet = new Set(dates || [])
  const monthActiveCount = (dates || []).filter((d) => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length

  return (
    <div>
      <div className="card" style={{ alignItems: 'stretch' }}>
        <div className="label">カレンダー</div>
        <div className="cal-header">
          <button className="cal-nav" onClick={() => setCursor(new Date(year, month - 1, 1))}>◀</button>
          <div className="cal-title">{year}年 {month + 1}月</div>
          <button className="cal-nav" onClick={() => setCursor(new Date(year, month + 1, 1))}>▶</button>
        </div>
        <div className="hint" style={{ marginTop: 0, textAlign: 'center' }}>
          この月は {monthActiveCount}日 がんばったね！
        </div>

        {dates === null ? (
          <div className="hint" style={{ textAlign: 'center', marginTop: 20 }}>よみこみちゅう…</div>
        ) : (
          <div className="cal-grid">
            {WEEKDAYS.map((w) => <div className="cal-weekday" key={w}>{w}</div>)}
            {cells.map((d, i) => {
              if (d === null) return <div key={i} className="cal-cell cal-empty" />
              const dateStr = toDateStr(year, month, d)
              const active = activeSet.has(dateStr)
              const isToday = dateStr === todayStr
              return (
                <div key={i} className={`cal-cell ${isToday ? 'cal-today' : ''}`}>
                  <span className="cal-day-num">{d}</span>
                  {active && <span className="cal-stamp">🐾</span>}
                </div>
              )
            })}
          </div>
        )}
      </div>
      <button className="restart pick-another" onClick={onBack}>もどる</button>
    </div>
  )
}
