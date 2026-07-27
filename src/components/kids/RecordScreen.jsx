import { useEffect, useState } from 'react'
import { boxOf } from '../../lib/today'
import { categoryProgress } from '../../lib/gamification'
import { fetchActivityDates } from '../../lib/api'

const BOX_META = [
  { box: 0, label: 'まだ これから', color: '#EFE3CB', textColor: '#8A7B62' },
  { box: 1, label: '1かい せいかい', color: '#FFD9A0', textColor: '#B5670E' },
  { box: 2, label: '2れんぞく せいかい', color: '#FFB86B', textColor: '#A85200' },
  { box: 3, label: '3れんぞく せいかい', color: '#FF9A45', textColor: '#8C3E00' },
  { box: 4, label: '🌟 かんぺき！', color: '#FF8A3D', textColor: '#7A3300' }
]
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function toDateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function RecordScreen({ questions, onBack }) {
  const total = questions.length
  const counts = BOX_META.map((m) => questions.filter((q) => boxOf(q) === m.box).length)
  const masteredCount = counts[4]
  const masteredRate = total > 0 ? Math.round((masteredCount / total) * 100) : 0
  const categories = categoryProgress(questions)

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
        <div className="label">がんばりグラフ</div>
        <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 6 }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--fox-dark)' }}>{masteredRate}%</div>
          <div className="hint" style={{ marginTop: 0 }}>ぜんぶで {total}問中 {masteredCount}問が かんぺき！</div>
        </div>

        <div style={{ marginTop: 18 }}>
          {BOX_META.map((m, i) => {
            const count = counts[i]
            const pct = total > 0 ? Math.round((count / total) * 100) : 0
            return (
              <div key={m.box} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                  <span>{m.label}</span>
                  <span>{count}問</span>
                </div>
                <div style={{ height: 18, background: '#F3EEDF', borderRadius: 10, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.max(pct, count > 0 ? 4 : 0)}%`,
                      background: m.color,
                      borderRadius: 10,
                      transition: 'width .5s ease'
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card" style={{ alignItems: 'stretch' }}>
        <div className="label">バッジ</div>
        <div className="hint" style={{ marginTop: 20 }}>カテゴリーごとに 30%でどう、60%でぎん、100%できん！</div>
        <div className="badge-row">
          {categories.map((c) => (
            <div className="category-badge" key={c.category}>
              <div className="medal">{c.tier ? c.tier.emoji : '⬜'}</div>
              <div className="cat-name">{c.category}</div>
              <div className="cat-rate">{c.rate}%</div>
            </div>
          ))}
        </div>
      </div>

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
