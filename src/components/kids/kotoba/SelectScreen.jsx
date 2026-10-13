import { WEEKLY_MISSIONS } from '../../../lib/gamification'
import { BOX_LEVELS, setProgress } from '../../../lib/today'
import { toISODate, formatMD } from '../../../lib/dates'

// ことばナビのはじめの画面：今日やる問題・締切を過ぎた問題・今週のミッション・問題集の一覧
export default function SelectScreen({
  today, overdue, sets, questionsById, title, freezeTokens, weeklyCorrectCount, weeklyMissionsClaimed,
  pendingSession, onResumeSession, onDismissSession, onStartToday, onStartOverdue, onStartSet
}) {
  const todaySub =
    today.picked.length === 0
      ? '今日はやることなし！'
      : today.totalEligible > today.picked.length
        ? `候補${today.totalEligible}問から${today.picked.length}問を抽出`
        : `${today.picked.length}問を自動で作成`

  return (
    <div>
      <div className="title-banner">
        <span>🎖️ {title}</span>
        <span className="freeze-badge">🧊 フリーズ ×{freezeTokens}</span>
      </div>

      {pendingSession && (
        <div className="resume-card">
          <div className="resume-text">
            📖 前回の続きがあります（{pendingSession.idx || 0}/{pendingSession.questionIds.length}問目）
          </div>
          <div className="resume-buttons">
            <button className="restart" style={{ marginTop: 0 }} onClick={onResumeSession}>続きからやる</button>
            <button className="btn-dismiss-resume" onClick={onDismissSession}>消す</button>
          </div>
        </div>
      )}

      <button className="set-card today-card" onClick={onStartToday}>
        <div className="set-icon today-icon">🔥</div>
        <div className="set-body">
          <div className="set-name">今日やる問題</div>
          <div className="set-sub">{todaySub}</div>
        </div>
        <div className="set-count">{today.picked.length}問</div>
      </button>

      {overdue.picked.length > 0 && (
        <button className="set-card overdue-card" onClick={onStartOverdue}>
          <div className="set-icon overdue-icon">⏰</div>
          <div className="set-body">
            <div className="set-name">締切を過ぎた問題</div>
            <div className="set-sub">
              {overdue.totalOverdue > overdue.picked.length ? `候補${overdue.totalOverdue}問から${overdue.picked.length}問` : 'まだできていないよ'}
            </div>
          </div>
          <div className="set-count">{overdue.picked.length}問</div>
        </button>
      )}

      <MissionCard count={weeklyCorrectCount} claimed={weeklyMissionsClaimed} />

      <div className="set-heading" style={{ marginTop: 18 }}>問題集を選んでね</div>
      {sets.map((set) => <SetCard key={set.id} set={set} progress={setProgress(set, questionsById)} onClick={() => onStartSet(set)} />)}
      {sets.length === 0 && <div className="hint">まだ問題集がありません（管理画面で作成してください）</div>}
    </div>
  )
}

function MissionCard({ count, claimed }) {
  const next = WEEKLY_MISSIONS.find((m) => !claimed.includes(m.id))
  if (!next) {
    return (
      <div className="mission-card">
        <div className="mission-title"><span>📅 今週のミッション</span><span className="mission-done">全部達成！！🎉</span></div>
      </div>
    )
  }
  return (
    <div className="mission-card">
      <div className="mission-title">
        <span>📅 今週のミッション</span>
        <span>{Math.min(count, next.count)}/{next.count}問</span>
      </div>
      <div className="mission-bar-wrap">
        <div className="mission-bar" style={{ width: `${Math.min(100, Math.round((count / next.count) * 100))}%` }} />
      </div>
      <div className="hint" style={{ marginTop: 6, marginBottom: 0 }}>あと{Math.max(0, next.count - count)}問で ⭐{next.reward}pt ゲット！</div>
    </div>
  )
}

function SetCard({ set, progress, onClick }) {
  const { total, counts, rate } = progress
  const tier = rate === 0 ? 'tier-none' : rate === 100 ? 'tier-done' : 'tier-mid'
  return (
    <button className="set-card set-card-progress" onClick={onClick}>
      <div className="set-card-top">
        <div className="set-icon" style={{ background: '#FFF1DA', color: '#E36A1E' }}>📖</div>
        <div className="set-body">
          <div className="set-name">{set.name}</div>
          <div className="set-sub">
            {set.questionIds.length}問
            {set.goal_at && <span className="goal-tag"> ・🎯 {formatMD(toISODate(new Date(set.goal_at)), false)}まで</span>}
          </div>
        </div>
        <div className={`set-count ${tier}`}>{rate}%</div>
      </div>
      <div className="set-progress-wrap" title={BOX_LEVELS.map((b, i) => `${b.short}${counts[i]}`).join('・')}>
        {BOX_LEVELS.map((b, i) => (total > 0 && counts[i] > 0 ? (
          <div key={i} className="set-progress-seg" style={{ width: `${(counts[i] / total) * 100}%`, background: b.color }} />
        ) : null))}
      </div>
    </button>
  )
}
