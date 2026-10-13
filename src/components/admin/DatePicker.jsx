import { useState } from 'react'
import { toISODate, parseISO, addDaysISO, daysBetweenISO, isoOf, monthCells, WEEKDAY_LABELS } from '../../lib/dates'

function addMonths(months) {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return toISODate(d)
}

const QUICK_OPTIONS = [
  { label: '1週間後', getValue: () => addDaysISO(toISODate(), 7) },
  { label: '2週間後', getValue: () => addDaysISO(toISODate(), 14) },
  { label: '1か月後', getValue: () => addMonths(1) },
  { label: '3か月後', getValue: () => addMonths(3) }
]

// value / onChange は "YYYY-MM-DD" 形式（空文字は未設定）
export default function DatePicker({ value, onChange }) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [cursor, setCursor] = useState(() => {
    const base = value ? parseISO(value) : new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const todayStr = toISODate()
  const cells = monthCells(year, month)

  function selectDay(day) {
    onChange(isoOf(year, month, day))
    setShowCalendar(false)
  }

  const displayLabel = value
    ? (() => {
        const d = parseISO(value)
        const diff = daysBetweenISO(todayStr, value)
        const base = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
        if (diff === 0) return `${base}（今日）`
        if (diff < 0) return `${base}（${-diff}日すぎています）`
        return `${base}（あと${diff}日）`
      })()
    : '未設定'

  return (
    <div className="dp">
      <div className="dp-value">
        <span className={value ? 'dp-value-set' : 'dp-value-none'}>{displayLabel}</span>
        {value && (
          <button className="dp-clear" onClick={() => onChange('')} type="button">クリア</button>
        )}
      </div>

      <div className="dp-quick">
        {QUICK_OPTIONS.map((opt) => {
          const optValue = opt.getValue()
          return (
            <button
              key={opt.label}
              type="button"
              className={`dp-quick-btn ${value === optValue ? 'dp-quick-active' : ''}`}
              onClick={() => onChange(optValue)}
            >
              {opt.label}
            </button>
          )
        })}
        <button
          type="button"
          className={`dp-quick-btn dp-quick-cal ${showCalendar ? 'dp-quick-active' : ''}`}
          onClick={() => setShowCalendar((v) => !v)}
        >
          📅 日付をえらぶ
        </button>
      </div>

      {showCalendar && (
        <div className="dp-calendar">
          <div className="dp-cal-header">
            <button type="button" className="dp-nav" onClick={() => setCursor(new Date(year, month - 1, 1))}>◀</button>
            <div className="dp-cal-title">{year}年 {month + 1}月</div>
            <button type="button" className="dp-nav" onClick={() => setCursor(new Date(year, month + 1, 1))}>▶</button>
          </div>
          <div className="dp-grid">
            {WEEKDAY_LABELS.map((w, i) => (
              <div key={w} className={`dp-weekday ${i === 0 ? 'dp-sun' : ''} ${i === 6 ? 'dp-sat' : ''}`}>{w}</div>
            ))}
            {cells.map((d, i) => {
              if (d === null) return <div key={i} className="dp-cell dp-empty" />
              const dateStr = isoOf(year, month, d)
              const isSelected = dateStr === value
              const isToday = dateStr === todayStr
              const dow = i % 7
              return (
                <button
                  key={i}
                  type="button"
                  className={`dp-cell dp-day ${isSelected ? 'dp-selected' : ''} ${isToday ? 'dp-today' : ''} ${dow === 0 ? 'dp-sun' : ''} ${dow === 6 ? 'dp-sat' : ''}`}
                  onClick={() => selectDay(d)}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
