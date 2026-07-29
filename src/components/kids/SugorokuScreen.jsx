import { SQUARES_PER_STAGE, MASTERY_PER_SQUARE, stageInfo } from '../../lib/gamification'
import RoomBackground from './RoomBackground'

export default function SugorokuScreen({ masteryEventTotal, characterEmoji, onBack }) {
  const info = stageInfo(masteryEventTotal)

  return (
    <div>
      <div className="card" style={{ alignItems: 'stretch' }}>
        <div className="label">すごろくマップ</div>
        <RoomBackground themeId={info.theme.id} height={110} />
        <div className="sugoroku-stage-name">第{info.stageIndex + 1}ステージ：{info.theme.name}</div>
        <div className="sugoroku-progress">
          {info.squareInStage + 1} / {SQUARES_PER_STAGE} マス目　・　あと{MASTERY_PER_SQUARE - info.towardNextSquare}問 かんぺきで つぎのマスへ
        </div>

        <div className="sugoroku-board">
          {[...Array(SQUARES_PER_STAGE)].map((_, i) => {
            const isDone = i < info.squareInStage
            const isCurrent = i === info.squareInStage
            return (
              <div key={i} className={`sugoroku-square ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                {isCurrent && <span className="sugoroku-token">{characterEmoji}</span>}
                {i + 1}
              </div>
            )
          })}
        </div>
        <div className="sugoroku-mastery-hint">
          問題を「かんぺき」にするたびに、すごろくが進みます。10ステージ（全100マス）をまわると、また第1ステージから旅がつづきます。
        </div>
      </div>
      <button className="restart pick-another" onClick={onBack}>もどる</button>
    </div>
  )
}
