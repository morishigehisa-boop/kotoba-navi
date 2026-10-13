import { SUBJECTS, SUBJECT_EMOJI, subjectStyle } from '../../lib/tasks'
import { toggleItem } from '../../lib/utils'

// 教科のしぼりこみチップ（やること一覧・予定カレンダーで共通）
export default function SubjectFilter({ subjects, onChange }) {
  const allOn = subjects.length === SUBJECTS.length
  return (
    <div className="cal-filter">
      <span className="cal-filter-label">教科:</span>
      {/* 全教科ONのときに押すと全部OFF、それ以外は全部ON */}
      <button className={`cal-chip ${allOn ? 'on' : ''}`} onClick={() => onChange(allOn ? [] : SUBJECTS)}>すべて</button>
      {SUBJECTS.map((s) => (
        <button key={s} className={`cal-chip ${subjects.includes(s) ? 'on' : ''}`} style={subjectStyle(s)} onClick={() => onChange(toggleItem(subjects, s))}>
          {SUBJECT_EMOJI[s]} {s}
        </button>
      ))}
    </div>
  )
}
