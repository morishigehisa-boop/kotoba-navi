import { SQUARES_PER_STAGE, MASTERY_PER_SQUARE, stageInfo } from '../../lib/gamification'
import RoomBackground from './RoomBackground'

// 下から上へジグザグに進む10マス分の座標（viewBox 0 0 100 220、余裕を持たせた配置）
const PATH_POINTS = [
  { x: 22, y: 205 },
  { x: 58, y: 188 },
  { x: 78, y: 160 },
  { x: 55, y: 138 },
  { x: 22, y: 122 },
  { x: 25, y: 92 },
  { x: 60, y: 78 },
  { x: 80, y: 52 },
  { x: 52, y: 32 },
  { x: 50, y: 14 }
]

export default function SugorokuScreen({ masteryEventTotal, characterEmoji, onBack }) {
  const info = stageInfo(masteryEventTotal)
  const linePoints = PATH_POINTS.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <div>
      <div className="card" style={{ alignItems: 'stretch' }}>
        <div className="label">すごろくマップ</div>
        <div className="sugoroku-stage-name" style={{ marginTop: 20 }}>第{info.stageIndex + 1}ステージ：{info.theme.name}</div>
        <div className="sugoroku-progress">
          {info.squareInStage + 1} / {SQUARES_PER_STAGE} マス目　・　あと{MASTERY_PER_SQUARE - info.towardNextSquare}問 かんぺきで つぎのマスへ
        </div>

        <RoomBackground themeId={info.theme.id} height={440}>
          <svg viewBox="0 0 100 220" preserveAspectRatio="none" className="room-bg-path-overlay">
            <polyline points={linePoints} fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeDasharray="1.5 4" strokeLinecap="round" opacity="0.9" />
            {PATH_POINTS.map((p, i) => {
              const isDone = i < info.squareInStage
              const isCurrent = i === info.squareInStage
              const isGoal = i === PATH_POINTS.length - 1
              const fill = isDone ? 'var(--fox)' : isCurrent ? '#FFFFFF' : 'rgba(255,255,255,0.55)'
              const stroke = isCurrent ? 'var(--fox-dark)' : isDone ? 'var(--fox-dark)' : '#FFFFFF'
              return (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={isGoal ? 10 : 8} fill={fill} stroke={stroke} strokeWidth={isCurrent ? 2.2 : 1.6} />
                  {!isCurrent && (
                    <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize="8" fontWeight="800" fill={isDone ? '#fff' : '#5A5749'}>
                      {isGoal ? '🏁' : i + 1}
                    </text>
                  )}
                  {isCurrent && (
                    <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="12">{characterEmoji}</text>
                  )}
                </g>
              )
            })}
          </svg>
        </RoomBackground>

        <div className="sugoroku-mastery-hint">
          問題を「かんぺき」にするたびに、すごろくが進みます。10ステージ（全100マス）をまわると、また第1ステージから旅がつづきます。
        </div>
      </div>
      <button className="restart pick-another" onClick={onBack}>もどる</button>
    </div>
  )
}
