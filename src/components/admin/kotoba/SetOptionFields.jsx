import DatePicker from '../DatePicker'

// 問題集の「名前・目標完了日・ランダム出題」の入力欄（作成と編集で共通）
export default function SetOptionFields({ name, onName, goalAt, onGoalAt, shuffle, onShuffle, wideName = false }) {
  return (
    <>
      <div className="form-row" style={wideName ? { maxWidth: 'none' } : undefined}>
        <label className="f-label">問題集の名前</label>
        <input type="text" value={name} onChange={(e) => onName(e.target.value)} />
      </div>
      <div className="form-row" style={{ maxWidth: 'none' }}>
        <label className="f-label">全問記憶の目標完了日（任意）</label>
        <DatePicker value={goalAt} onChange={onGoalAt} />
      </div>
      <div className="form-row" style={{ maxWidth: 'none' }}>
        <label className="toggle-row">
          <input type="checkbox" checked={shuffle} onChange={(e) => onShuffle(e.target.checked)} />
          <span>ランダム出題（開くたびに問題の順番を入れかえる）</span>
        </label>
      </div>
    </>
  )
}
