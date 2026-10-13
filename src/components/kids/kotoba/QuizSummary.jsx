import { useEffect, useRef } from 'react'
import { POINTS } from '../../../lib/gamification'

// ことばナビの結果画面。表示したときに1回だけ onShown を呼ぶ（おわりのボーナスなど）
// leftoverToday：「今日やる問題」で、まだ残っている問題数（今日やる問題以外のときは null）
export function QuizSummary({ correctCount, total, streak, wrongCount, leftoverToday, onShown, onRestart, onReview, onPickAnother, onContinueToday }) {
  const shownRef = useRef(false) // ボーナスを二重に付けないよう、1回だけにする
  useEffect(() => {
    if (shownRef.current) return
    shownRef.current = true
    onShown()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rate = total > 0 ? Math.round((correctCount / total) * 100) : 0
  return (
    <div className="card summary">
      <h2>今日の結果</h2>
      <div className="big">{correctCount} / {total}</div>
      <div className="hint">正解率 {rate}%</div>
      <div className="badges">
        <div className="badge">⭐ +{correctCount * POINTS.correct + POINTS.finishBonus} ポイント</div>
        <div className="badge">🔥 {streak}日連続</div>
      </div>
      {leftoverToday > 0 && (
        <>
          <div className="hint" style={{ margin: '14px 0 4px', color: 'var(--fox-dark)', fontWeight: 700 }}>
            まだ今日やるべき問題が{leftoverToday}問残っています
          </div>
          <button className="restart today-continue" onClick={onContinueToday}>続けて今日の分をやる（あと{leftoverToday}問）</button>
        </>
      )}
      <button className="restart" onClick={onRestart}>もう一度最初から</button>
      {wrongCount > 0 && (
        <button className="restart review-btn" onClick={onReview}>間違えた問題を復習する（{wrongCount}問）</button>
      )}
      <button className="restart pick-another" onClick={onPickAnother}>別の問題集を選ぶ</button>
    </div>
  )
}

export function ReviewSummary({ reviewCorrect, total, stillWrongCount, onBack, onReviewAgain }) {
  return (
    <div className="card summary">
      <h2>復習結果</h2>
      <div className="big">{reviewCorrect} / {total}</div>
      <div className="hint">※この結果は最初の正解数には反映されません</div>
      <div className="badges">
        <div className="badge">⭐ +{reviewCorrect * POINTS.review} ポイント</div>
      </div>
      <button className="restart" onClick={onBack}>結果画面にもどる</button>
      {stillWrongCount > 0 && (
        <button className="restart today-continue" onClick={onReviewAgain}>まだ間違えた問題をもう一度（{stillWrongCount}問）</button>
      )}
    </div>
  )
}
