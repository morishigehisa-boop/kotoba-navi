import { SQUARES_PER_STAGE, MASTERY_PER_SQUARE, stageInfo } from '../../lib/gamification'
import RoomBackground from './RoomBackground'

// 下から上へジグザグに進む10マス分の座標（viewBox 0 0 100 140）
const PATH_POINTS = [
  { x: 20, y: 128 },
  { x: 45, y: 118 },
  { x: 74, y: 108 },
  { x: 78, y: 88 },
  { x: 55, y: 78 },
  { x: 26, y: 68 },
  { x: 22, y: 48 },
  { x: 48, y: 38 },
  { x: 76, y: 28 },
  { x: 50, y: 14 }
]

export default function SugorokuScreen({ masteryEventTotal, characterEmoji, onBack }) {
  const info = stageInfo(masteryEventTotal)
  const linePoints = PATH_POINTS.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <div>
      <div className="card" style={{ alignItems: 'stretch' }}>
        <div className="label">すごろくマップ</div>

        <RoomBackground themeId={info.theme.id} height={260}>
          <svg viewBox="0 0 100 140" preserveAspectRatio="none" className="room-bg-path-overlay">
            <polyline points={linePoints} fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeDasharray="1 3" strokeLinecap="round" opacity="0.9" />
            {PATH_POINTS.map((p, i) => {
              const isDone = i < info.squareInStage
              const isCurrent = i === info.squareInStage
              const isGoal = i === PATH_POINTS.length - 1
              const fill = isDone ? 'var(--fox)' : isCurrent ? '#FFFFFF' : 'rgba(255,255,255,0.55)'
              const stroke = isCurrent ? 'var(--fox-dark)' : isDone ? 'var(--fox-dark)' : '#FFFFFF'
              return (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={isGoal ? 8.5 : 7} fill={fill} stroke={stroke} strokeWidth={isCurrent ? 2 : 1.4} />
                  {!isCurrent && (
                    <text x={p.x} y={p.y + 2.6} textAnchor="middle" fontSize="7" fontWeight="800" fill={isDone ? '#fff' : '#5A5749'}>
                      {isGoal ? '🏁' : i + 1}
                    </text>
                  )}
                  {isCurrent && (
                    <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize="10">{characterEmoji}</text>
                  )}
                </g>
              )
            })}
          </svg>
        </RoomBackground>

        <div className="sugoroku-stage-name">第{info.stageIndex + 1}ステージ：{info.theme.name}</div>
        <div className="sugoroku-progress">
          {info.squareInStage + 1} / {SQUARES_PER_STAGE} マス目　・　あと{MASTERY_PER_SQUARE - info.towardNextSquare}問 かんぺきで つぎのマスへ
        </div>
        <div className="sugoroku-mastery-hint">
          問題を「かんぺき」にするたびに、すごろくが進みます。10ステージ（全100マス）をまわると、また第1ステージから旅がつづきます。
        </div>
      </div>
      <button className="restart pick-another" onClick={onBack}>もどる</button>
    </div>
  )
}
