import { useEffect, useState } from 'react'
import { BOX_LEVELS, MASTERED_BOX, countByBox } from '../../lib/today'
import { categoryProgress, BADGE_TIERS } from '../../lib/gamification'
import { fetchActivityDates } from '../../lib/api'
import { WEEKDAY_LABELS, toISODate, isoOf, monthCells } from '../../lib/dates'

// バッジの説明文（例：30%で銅、60%で銀、100%で金）
const BADGE_RULE = [...BADGE_TIERS].reverse().map((t) => `${t.min}%で${t.label}`).join('、')

export default function RecordScreen({ questions, onBack }) {
  const total = questions.length
  const counts = countByBox(questions)
  const masteredCount = counts[MASTERED_BOX]
  const masteredRate = total > 0 ? Math.round((masteredCount / total) * 100) : 0
  const categories = categoryProgress(questions)

  const [dates, setDates] = useState(null)
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d })

  useEffect(() => {
    fetchActivityDates().then(setDates).catch(() => setDates([]))
  }, [])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const todayStr = toISODate()
  const cells = monthCells(year, month)
  const activeSet = new Set(dates || [])
  const monthPrefix = isoOf(year, month, 1).slice(0, 8) // 'YYYY-MM-'
  const monthActiveCount = (dates || []).filter((d) => d.startsWith(monthPrefix)).length

  return (
    <div>
      <div className="card" style={{ alignItems: 'stretch' }}>
        <div className="label">頑張りグラフ</div>
        <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 6 }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--fox-dark)' }}>{masteredRate}%</div>
          <div className="hint" style={{ marginTop: 0 }}>全部で {total}問中 {masteredCount}問が完璧！</div>
        </div>

        <div style={{ marginTop: 18 }}>
          {BOX_LEVELS.map((m, i) => {
            const count = counts[i]
            const pct = total > 0 ? Math.round((count / total) * 100) : 0
            return (
              <div key={i} style={{ marginBottom: 14 }}>
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
        <div className="hint" style={{ marginTop: 20 }}>カテゴリーごとに {BADGE_RULE}！</div>
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
          この月は {monthActiveCount}日 頑張ったね！
        </div>
        {dates === null ? (
          <div className="hint" style={{ textAlign: 'center', marginTop: 20 }}>読み込み中…</div>
        ) : (
          <div className="cal-grid">
            {WEEKDAY_LABELS.map((w) => <div className="cal-weekday" key={w}>{w}</div>)}
            {cells.map((d, i) => {
              if (d === null) return <div key={i} className="cal-cell cal-empty" />
              const dateStr = isoOf(year, month, d)
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
