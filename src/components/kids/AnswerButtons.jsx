// 「タップして答えを見る」→「もう少し／できた！」のボタン（ことばナビ・さんすうナビ共通）
export default function AnswerButtons({ revealed, disabled, onReveal, onAnswer }) {
  if (!revealed) return <button className="btn btn-reveal" onClick={onReveal}>タップして答えを見る</button>
  return (
    <div className="btn-row">
      <button className="btn btn-bad" disabled={disabled} onClick={() => onAnswer(false)}>もう少し</button>
      <button className="btn btn-ok" disabled={disabled} onClick={() => onAnswer(true)}>できた！</button>
    </div>
  )
}

// 学習中の上の帯（✕ やめる ＋ 進み具合のバー）
export function StudyHeader({ done, total, onQuit }) {
  const pct = Math.min(100, Math.round((done / Math.max(1, total)) * 100))
  return (
    <>
      <div className="quit-row">
        <button className="quit-btn" onClick={onQuit}>✕ やめる</button>
      </div>
      <div className="progress-wrap">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
    </>
  )
}
