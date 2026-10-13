import { useEffect, useRef } from 'react'
import { isMastered } from '../../lib/today'
import { categoryProgress } from '../../lib/gamification'
import { playFanfareBig, playBadgeGet } from '../../lib/sound'

/**
 * ことばナビで正解したあとの「新しく達成したか」の判定（お祝いの演出・すごろく）。
 * 起動したときにすでに達成ずみのものを覚えておき、同じものを二度お祝いしないようにする。
 * - 問題集が全部「完璧」になった
 * - カテゴリーのバッジ（銅・銀・金）が上がった
 * - 問題が新しく「完璧」になった → onMastered（すごろくを進める）
 */
export function useRewardChecks({ loading, questions, questionsById, sets, celebrate, onMastered }) {
  const seededRef = useRef(false)
  const completedSetsRef = useRef(new Set())
  const categoryTierRef = useRef(new Map())
  const masteredRef = useRef(new Set())

  useEffect(() => {
    if (seededRef.current || loading || questions.length === 0) return
    sets.forEach((set) => { if (isSetComplete(set, questionsById)) completedSetsRef.current.add(set.id) })
    categoryProgress(questions).forEach((c) => { if (c.tier) categoryTierRef.current.set(c.category, c.tier.id) })
    questions.forEach((q) => { if (isMastered(q)) masteredRef.current.add(q.id) })
    seededRef.current = true
  }, [loading, questions, questionsById, sets])

  // updated：正解して集計値が更新された問題（questions にはまだ反映されていない前提で、差し替えて判定する）
  function afterCorrect(updated) {
    const byId = new Map(questionsById).set(updated.id, updated)

    sets.forEach((set) => {
      if (completedSetsRef.current.has(set.id) || !set.questionIds.includes(updated.id)) return
      if (!isSetComplete(set, byId)) return
      completedSetsRef.current.add(set.id)
      playFanfareBig()
      celebrate()
    })

    const target = categoryProgress([...byId.values()]).find((c) => c.category === updated.category)
    const newTier = target?.tier?.id || null
    if (newTier && newTier !== categoryTierRef.current.get(updated.category)) {
      categoryTierRef.current.set(updated.category, newTier)
      playBadgeGet()
      celebrate()
    }

    if (isMastered(updated) && !masteredRef.current.has(updated.id)) {
      masteredRef.current.add(updated.id)
      onMastered()
    }
  }

  return { afterCorrect }
}

function isSetComplete(set, byId) {
  return set.questionIds.length > 0 && set.questionIds.every((id) => {
    const q = byId.get(id)
    return q && isMastered(q)
  })
}
