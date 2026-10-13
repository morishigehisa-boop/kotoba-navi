import { useEffect, useRef, useState } from 'react'
import { shuffle } from '../../../lib/utils'
import { loadJSON, saveJSON, removeItem, STORAGE_KEYS } from '../../../lib/storage'
import { NEXT_QUESTION_DELAY_MS } from '../feedback'

// ことばナビの出題の進み方（本番 → 結果 → 間違えた問題の復習）を管理する。
// ポイント・効果音などのごほうびは、onAnswer（呼び出し側）が担当する。
// 「今日やる問題」などを途中でやめても、次回起動時に続きから再開できるよう、途中経過を端末に保存する。
const loadSnapshot = () => loadJSON(STORAGE_KEYS.kotobaSession)
const clearSnapshot = () => removeItem(STORAGE_KEYS.kotobaSession)

/**
 * @param questionsById  Map（id → 問題）
 * @param onAnswer       (question, isCorrect, mode) 1問答えるたびに呼ぶ。mode は 'main' | 'review'
 */
export function useKotobaSession({ questionsById, onAnswer }) {
  const [mode, setMode] = useState('main') // 'main' | 'review'
  const [main, setMain] = useState({ list: [], idx: 0, correct: 0, wrong: [] })
  const [review, setReview] = useState({ list: [], idx: 0, correct: 0, failed: [] })
  const [isToday, setIsToday] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [choiceFeedback, setChoiceFeedback] = useState(null)
  const [pendingSession, setPendingSession] = useState(null)
  const [active, setActive] = useState(false) // 出題画面を開いているか
  const answeringRef = useRef(false)

  const byIds = (ids) => (ids || []).map((id) => questionsById.get(id)).filter(Boolean)

  const cur = mode === 'review' ? review : main
  const current = cur.list[cur.idx]
  const finished = cur.idx >= cur.list.length

  // 起動時：保存してある途中経過のうち、問題がまだ残っているものだけを「続きから」に出す
  function restorePending(questions) {
    const snap = loadSnapshot()
    if (!snap?.questionIds?.length) return
    if (snap.questionIds.some((id) => questions.some((q) => q.id === id))) setPendingSession(snap)
    else clearSnapshot()
  }

  // 本番の途中経過を自動保存し、終わったら消す
  useEffect(() => {
    if (!active || mode !== 'main' || main.list.length === 0) return
    if (main.idx >= main.list.length) { clearSnapshot(); return }
    saveJSON(STORAGE_KEYS.kotobaSession, {
      questionIds: main.list.map((q) => q.id),
      idx: main.idx,
      correctCount: main.correct,
      wrongQuestionIds: main.wrong.map((q) => q.id),
      isTodayAutoSession: isToday
    })
  }, [active, mode, main, isToday])

  function begin(state, today) {
    setMain(state)
    setMode('main')
    setIsToday(today)
    setRevealed(false)
    setChoiceFeedback(null)
    setPendingSession(null)
    setActive(true)
    answeringRef.current = false
  }

  function startSet(list, { isToday: today = false, randomize = true } = {}) {
    begin({ list: randomize ? shuffle(list) : [...list], idx: 0, correct: 0, wrong: [] }, today)
  }

  // 戻り値：再開できたら true
  function resume() {
    if (!pendingSession) return false
    const list = byIds(pendingSession.questionIds)
    if (list.length === 0) { dismissPending(); return false }
    begin({
      list,
      idx: Math.min(pendingSession.idx || 0, list.length),
      correct: pendingSession.correctCount || 0,
      wrong: byIds(pendingSession.wrongQuestionIds)
    }, !!pendingSession.isTodayAutoSession)
    return true
  }

  function dismissPending() {
    setPendingSession(null)
    clearSnapshot()
  }

  // 途中でやめる：途中経過は残して、あとで「続きから」できるようにする（答えた分の記録はもう保存ずみ）
  function quit() {
    setActive(false)
    const snap = loadSnapshot()
    if (snap?.questionIds?.length && (snap.idx || 0) < snap.questionIds.length) setPendingSession(snap)
  }

  function goNext() {
    answeringRef.current = false
    setRevealed(false)
    setChoiceFeedback(null)
    if (mode === 'main') setMain((s) => ({ ...s, idx: s.idx + 1 }))
    else setReview((s) => ({ ...s, idx: s.idx + 1 }))
  }

  function answer(isCorrect) {
    // 次の問題へ進むまでの間の連打・二重タップは無視する（問題が飛ばされるのを防ぐ）
    if (answeringRef.current || !current) return
    answeringRef.current = true
    const q = current
    if (mode === 'main') {
      setMain((s) => (isCorrect ? { ...s, correct: s.correct + 1 } : { ...s, wrong: [...s.wrong, q] }))
    } else {
      setReview((s) => (isCorrect ? { ...s, correct: s.correct + 1 } : { ...s, failed: [...s.failed, q] }))
    }
    try {
      onAnswer(q, isCorrect, mode)
    } catch (err) {
      console.error(err) // 演出などで失敗しても、次の問題へは必ず進める
    }
    setTimeout(goNext, NEXT_QUESTION_DELAY_MS)
  }

  // 選択式：選んだらまず正解を見せて、少し待ってから答えとして記録する
  function choose(choice) {
    if (choiceFeedback || !current) return
    const correct = current.content.answer
    setChoiceFeedback({ chosen: choice, correct })
    setTimeout(() => answer(choice === correct), NEXT_QUESTION_DELAY_MS)
  }

  function restart() {
    setMain((s) => ({ list: shuffle(s.list), idx: 0, correct: 0, wrong: [] }))
    setMode('main')
    setRevealed(false)
  }

  function startReview() {
    setReview({ list: shuffle(main.wrong), idx: 0, correct: 0, failed: [] })
    setMode('review')
    setRevealed(false)
  }

  function reviewAgain() {
    setReview((s) => ({ list: shuffle(s.failed), idx: 0, correct: 0, failed: [] }))
    setRevealed(false)
  }

  return {
    mode, main, review, isToday, current, finished, revealed, choiceFeedback, pendingSession,
    progress: { done: cur.idx, total: cur.list.length },
    restorePending, startSet, resume, dismissPending, quit,
    reveal: () => setRevealed(true), answer, choose, restart, startReview, reviewAgain,
    backToSummary: () => setMode('main')
  }
}
