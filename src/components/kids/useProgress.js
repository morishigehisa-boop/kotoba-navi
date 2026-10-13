import { useRef, useState } from 'react'
import { updateProgress, logPoints } from '../../lib/api'
import {
  computeStreakUpdate, titleForPoints, WEEKLY_MISSIONS, weeklyResetIfNeeded, stageInfo,
  ownedKey, isCharacterComplete, nextLockedCharacter
} from '../../lib/gamification'
import { playFanfareBig, playLevelUp, playBadgeGet, playItemGet, playCharacterUnlock } from '../../lib/sound'

/**
 * ごほうびの記録（user_progress：ポイント・連続日数・今週のミッション・すごろく・ショップ）。
 * 画面の state と DB を同時に更新する。最新の値は ref にも持ち、同じタイミングで続けて呼んでも
 * （例：ポイント加算 → ミッション加算）前の変更を上書きしないようにしている。
 * @param fx  演出の関数 { celebrate, setMascot, onMilestone, onNewCharacter }
 */
export function useProgress(fx) {
  const [progress, setProgressState] = useState(null)
  const ref = useRef(null)
  const fxRef = useRef(fx)
  fxRef.current = fx

  // 読み込んだ値をそのまま入れる（DBには書かない）
  function load(value) {
    ref.current = value
    setProgressState(value)
  }

  // patch を画面とDBに反映する
  function commit(patch) {
    const next = { ...ref.current, ...patch }
    ref.current = next
    setProgressState(next)
    updateProgress(patch).catch(console.error)
    return next
  }

  // ポイントを増減し、履歴（point_logs）にも残す。称号が上がったらお祝いする
  function addPoints(n, source = 'other', label) {
    if (!n) return
    logPoints(source, n, label)
    const prevPoints = ref.current.points
    const nextPoints = Math.max(0, prevPoints + n) // やることの取り消しでマイナスになる場合があるので、0未満にはしない
    commit({ points: nextPoints })
    const nextTitle = titleForPoints(nextPoints)
    if (n > 0 && nextTitle !== titleForPoints(prevPoints)) {
      setTimeout(() => {
        playLevelUp()
        fxRef.current.celebrate()
        fxRef.current.setMascot({ state: 'happy', text: `称号アップ！「${nextTitle}」になったよ！` })
      }, 200)
    }
  }

  // 週替わりミッションを進める。週が変わっていれば自動リセットしてから加算する。
  // delta：進める数（正解1問＝1。やることは、ポイントを正解何問ぶんかに直した数）。取り消しのときはマイナス
  function addWeeklyCount(delta = 1) {
    const reset = weeklyResetIfNeeded(ref.current)
    const base = reset ? { ...ref.current, ...reset } : ref.current
    const count = Math.max(0, (base.weekly_correct_count || 0) + delta)
    const claimed = [...(base.weekly_missions_claimed || [])]
    const reached = delta > 0 ? WEEKLY_MISSIONS.filter((m) => count >= m.count && !claimed.includes(m.id)) : []
    reached.forEach((m) => claimed.push(m.id))
    commit({ weekly_correct_count: count, weekly_missions_claimed: claimed, week_start_date: base.week_start_date })
    if (reached.length > 0) {
      addPoints(reached.reduce((sum, m) => sum + m.reward, 0), 'mission', '今週のミッション')
      setTimeout(() => { playBadgeGet(); fxRef.current.celebrate() }, 260)
    }
  }

  // 「1問でもやれば継続」の連続日数。同じ日に何度呼んでも増えない
  function creditTodayActivity() {
    const prev = ref.current
    const result = computeStreakUpdate(prev)
    if (!result.changed) return
    commit({
      streak_count: result.streak_count,
      freeze_tokens: result.freeze_tokens,
      last_activity_date: result.last_activity_date,
      longest_streak: Math.max(prev.longest_streak, result.streak_count)
    })
    if (result.newMilestone) fxRef.current.onMilestone(result.newMilestone)
  }

  // 「習得」が1つ増えたことをすごろくに反映する（ことばナビの「完璧」・さんすうの「3回連続正解」の共通処理）
  // 新しいステージに着いたら、その背景をもらえる
  function addMasteryEvent() {
    const prev = ref.current
    const prevTotal = prev.mastery_event_total || 0
    const prevInfo = stageInfo(prevTotal)
    const nextInfo = stageInfo(prevTotal + 1)
    const patch = { mastery_event_total: prevTotal + 1 }
    const reachedNewStage = nextInfo.boardPosition > prevInfo.boardPosition && nextInfo.squareInStage === 0
    if (reachedNewStage && !prev.unlocked_backgrounds.includes(nextInfo.theme.id)) {
      patch.unlocked_backgrounds = [...prev.unlocked_backgrounds, nextInfo.theme.id]
      setTimeout(() => { playFanfareBig(); fxRef.current.celebrate() }, 300)
    }
    commit(patch)
  }

  // ---- ショップ ----
  function purchase(item) {
    const p = ref.current
    const key = ownedKey(p.active_character, item.id)
    if (p.points < item.cost || p.owned_items.includes(key)) return
    const owned = [...p.owned_items, key]
    const patch = { owned_items: owned, points: p.points - item.cost }
    playItemGet()
    // 今のキャラクターのアイテムを全部集めたら、次のキャラクターを解放する
    if (isCharacterComplete(owned, p.active_character)) {
      const locked = nextLockedCharacter(p.unlocked_characters)
      if (locked) {
        patch.unlocked_characters = [...p.unlocked_characters, locked.id]
        fxRef.current.onNewCharacter(locked)
        setTimeout(playCharacterUnlock, 320)
      }
    }
    logPoints('other', -item.cost, `ショップ：${item.name}`)
    commit(patch)
  }

  const equip = (itemId) => commit({ equipped_item: itemId })
  const equipBackground = (themeId) => commit({ active_background: themeId })
  function switchCharacter(characterId) {
    if (!ref.current.unlocked_characters.includes(characterId)) return
    // アイテムはキャラクターごとに所持しているので、切り替え時にそうびは一旦外す
    commit({ active_character: characterId, equipped_item: null })
  }

  return {
    progress, load, addPoints, addWeeklyCount, creditTodayActivity, addMasteryEvent,
    purchase, equip, equipBackground, switchCharacter
  }
}
