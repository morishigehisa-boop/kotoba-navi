import { useEffect, useMemo, useRef, useState } from 'react'
import Character from './Character'
import Confetti from './Confetti'
import { addFurigana, setCustomFurigana } from '../../lib/furigana'
import { playCorrect, playWrong, playFanfareBig, playCharacterUnlock, playItemGet, playLevelUp, playBadgeGet, playComeback } from '../../lib/sound'
import { fetchQuestions, fetchQuestionSetsWithItems, recordAnswer, fetchProgress, updateProgress, fetchFuriganaEntries } from '../../lib/api'
import { buildTodaySet, buildOverdueSet } from '../../lib/today'
import {
  computeStreakUpdate,
  titleForPoints,
  SHOP_ITEMS_BY_CHARACTER,
  itemsForCharacter,
  CHARACTERS,
  ownedKey,
  isItemOwned,
  isCharacterComplete,
  nextLockedCharacter,
  categoryProgress,
  tierForRate,
  WEEKLY_MISSIONS,
  weeklyResetIfNeeded,
  stageInfo,
  STAGE_THEMES
} from '../../lib/gamification'
import { boxOf } from '../../lib/today'
import RecordScreen from './RecordScreen'
import ShopScreen from './ShopScreen'
import SugorokuScreen from './SugorokuScreen'
import RoomBackground from './RoomBackground'
import './kids.css'

function Ruby({ text }) {
  if (!text) return null
  return <span dangerouslySetInnerHTML={{ __html: addFurigana(text) }} />
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const HAPPY_LINES = ['やったね！', 'その調子！', 'さすが！', 'よくできました！']
// 未正解・1回・2回・3回・かんぺき の5段階（がんばりグラフと同じ配色）
const BOX_BAR_COLORS = ['#D8D2C0', '#FFD9A0', '#FFB86B', '#FF9A45', '#FF8A3D']

function formatGoalShort(iso) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function KidsApp() {
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [allSets, setAllSets] = useState([])
  const [progress, setProgress] = useState(null) // { streak_count, longest_streak, points, freeze_tokens, last_activity_date, owned_items, equipped_item }

  const [screen, setScreen] = useState('select') // 'select' | 'quiz' | 'record' | 'shop'
  const [mode, setMode] = useState('main') // 'main' | 'review'
  const [sessionQuestions, setSessionQuestions] = useState([])
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongQuestions, setWrongQuestions] = useState([])
  const [reviewList, setReviewList] = useState([])
  const [reviewIdx, setReviewIdx] = useState(0)
  const [reviewCorrect, setReviewCorrect] = useState(0)
  const [reviewFailed, setReviewFailed] = useState([])

  const [mascot, setMascot] = useState({ state: 'idle', text: '' })
  const [isTodayAutoSession, setIsTodayAutoSession] = useState(false)
  const [choiceFeedback, setChoiceFeedback] = useState(null)
  const [confettiOn, setConfettiOn] = useState(false)
  const [struggleToast, setStruggleToast] = useState(false)
  const categoryTierRef = useRef(new Map())
  const seededCategoryTierRef = useRef(false)
  const masteredQuestionsRef = useRef(new Set())
  const seededMasteredRef = useRef(false)

  function celebrate() {
    setConfettiOn(false)
    requestAnimationFrame(() => setConfettiOn(true))
  }
  const [milestone, setMilestone] = useState(null) // マイルストーン達成のお祝いモーダル
  const [newCharacter, setNewCharacter] = useState(null) // 新キャラクター解放のお祝いモーダル

  useEffect(() => {
    ;(async () => {
      try {
        const [qs, sets, prog, furiganaEntries] = await Promise.all([
          fetchQuestions(), fetchQuestionSetsWithItems(), fetchProgress(), fetchFuriganaEntries()
        ])
        setCustomFurigana(furiganaEntries)
        setQuestions(qs)
        setAllSets(sets)
        setProgress(prog)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const goalSets = useMemo(() => allSets.filter((s) => s.goal_at), [allSets])
  // 目標日時があってもなくても、一覧では全ての問題集を選べるようにする
  const allSetsSorted = useMemo(() => [...allSets].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)), [allSets])
  const questionsById = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions])

  // 「問題集がかんぺきになった」効果音を、既にかんぺきな問題集で誤って鳴らさないための記録
  const completedSetsRef = useRef(new Set())
  const seededCompletedRef = useRef(false)
  useEffect(() => {
    if (seededCompletedRef.current || loading) return
    allSetsSorted.forEach((set) => {
      const allDone = set.questionIds.length > 0 && set.questionIds.every((id) => {
        const q = questionsById.get(id)
        return q && boxOf(q) >= 4
      })
      if (allDone) completedSetsRef.current.add(set.id)
    })
    seededCompletedRef.current = true
  }, [loading, allSetsSorted, questionsById])

  // カテゴリーバッジも同様に、既に到達済みのティアを起動時に記録しておく
  useEffect(() => {
    if (seededCategoryTierRef.current || loading || questions.length === 0) return
    categoryProgress(questions).forEach((c) => {
      if (c.tier) categoryTierRef.current.set(c.category, c.tier.id)
    })
    seededCategoryTierRef.current = true
  }, [loading, questions])

  // すごろく：既に「かんぺき」になっている問題を、起動時に記録しておく（二重カウント防止）
  useEffect(() => {
    if (seededMasteredRef.current || loading || questions.length === 0) return
    questions.forEach((q) => { if (boxOf(q) >= 4) masteredQuestionsRef.current.add(q.id) })
    seededMasteredRef.current = true
  }, [loading, questions])

  // 4. すごろく風マップ：問題が新たに「かんぺき」になるたびに進める
  function checkMasteryProgress(updatedQuestion) {
    if (boxOf(updatedQuestion) < 4) return
    if (masteredQuestionsRef.current.has(updatedQuestion.id)) return
    masteredQuestionsRef.current.add(updatedQuestion.id)

    setProgress((prev) => {
      const prevTotal = prev.mastery_event_total || 0
      const nextTotal = prevTotal + 1
      const prevInfo = stageInfo(prevTotal)
      const nextInfo = stageInfo(nextTotal)
      let patch = { mastery_event_total: nextTotal }
      let next = { ...prev, ...patch }

      if (nextInfo.boardPosition > prevInfo.boardPosition && nextInfo.squareInStage === 0) {
        const newThemeId = nextInfo.theme.id
        if (!prev.unlocked_backgrounds.includes(newThemeId)) {
          const nextBackgrounds = [...prev.unlocked_backgrounds, newThemeId]
          patch.unlocked_backgrounds = nextBackgrounds
          next.unlocked_backgrounds = nextBackgrounds
          setTimeout(() => { playFanfareBig(); celebrate() }, 300)
        }
      }

      updateProgress(patch).catch(console.error)
      return next
    })
  }

  // 正解によって、まだお祝いしていない問題集が新たに「かんぺき」になったら効果音を鳴らす
  function checkSetCompletion(updatedQuestion) {
    allSetsSorted.forEach((set) => {
      if (completedSetsRef.current.has(set.id)) return
      if (!set.questionIds.includes(updatedQuestion.id)) return
      const allDone = set.questionIds.every((id) => {
        const q = id === updatedQuestion.id ? updatedQuestion : questionsById.get(id)
        return q && boxOf(q) >= 4
      })
      if (allDone) {
        completedSetsRef.current.add(set.id)
        playFanfareBig()
        celebrate()
      }
    })
  }

  // 6. カテゴリー別マスターバッジ：新しいティア（どう/ぎん/きん）に到達したら演出
  function checkCategoryBadge(updatedQuestion) {
    const updatedQuestions = questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    const cats = categoryProgress(updatedQuestions)
    const target = cats.find((c) => c.category === updatedQuestion.category)
    if (!target) return
    const newTierId = target.tier ? target.tier.id : null
    const prevTierId = categoryTierRef.current.get(updatedQuestion.category) || null
    if (newTierId && newTierId !== prevTierId) {
      categoryTierRef.current.set(updatedQuestion.category, newTierId)
      playBadgeGet()
      celebrate()
    }
  }

  const today = useMemo(() => buildTodaySet(questions, goalSets), [questions, goalSets])
  const overdue = useMemo(() => buildOverdueSet(questions, goalSets), [questions, goalSets])

  function patchQuestionLocal(id, patch) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)))
  }

  // ポイントを加算し、DBにも永続化する
  function addPoints(n) {
    setProgress((prev) => {
      const nextPoints = prev.points + n
      const prevTitle = titleForPoints(prev.points)
      const nextTitle = titleForPoints(nextPoints)
      const next = { ...prev, points: nextPoints }
      updateProgress({ points: nextPoints }).catch(console.error)
      if (nextTitle !== prevTitle) {
        setTimeout(() => { playLevelUp(); celebrate(); setMascot({ state: 'happy', text: `称号アップ！「${nextTitle}」に なったよ！` }) }, 200)
      }
      return next
    })
  }

  // 1. 週替わりミッション：正解のたびに呼ぶ。週が変わっていれば自動リセットしてから加算する。
  function incrementWeeklyMission() {
    setProgress((prev) => {
      const reset = weeklyResetIfNeeded(prev)
      const base = reset ? { ...prev, ...reset } : prev
      const nextCount = (base.weekly_correct_count || 0) + 1
      const claimed = [...(base.weekly_missions_claimed || [])]
      let bonus = 0
      let newlyClaimed = null
      WEEKLY_MISSIONS.forEach((m) => {
        if (nextCount >= m.count && !claimed.includes(m.id)) {
          claimed.push(m.id)
          bonus += m.reward
          newlyClaimed = m
        }
      })
      const nextPoints = base.points + bonus
      const next = {
        ...base,
        weekly_correct_count: nextCount,
        weekly_missions_claimed: claimed,
        points: nextPoints
      }
      updateProgress({
        weekly_correct_count: nextCount,
        weekly_missions_claimed: claimed,
        points: nextPoints,
        week_start_date: next.week_start_date
      }).catch(console.error)
      if (newlyClaimed) {
        setTimeout(() => { playBadgeGet(); celebrate() }, 260)
      }
      return next
    })
  }

  // 「1問でもやれば継続」のストリーク判定。同じ日に何度呼んでも安全(冪等)。
  function creditTodayActivity() {
    setProgress((prev) => {
      const result = computeStreakUpdate(prev)
      if (!result.changed) return prev
      const next = {
        ...prev,
        streak_count: result.streak_count,
        freeze_tokens: result.freeze_tokens,
        last_activity_date: result.last_activity_date,
        longest_streak: Math.max(prev.longest_streak, result.streak_count)
      }
      updateProgress({
        streak_count: next.streak_count,
        freeze_tokens: next.freeze_tokens,
        last_activity_date: next.last_activity_date,
        longest_streak: next.longest_streak
      }).catch(console.error)
      if (result.newMilestone) setMilestone(result.newMilestone)
      return next
    })
  }

  function startSet(list, { isToday = false } = {}) {
    setSessionQuestions(shuffle(list))
    setIdx(0)
    setCorrectCount(0)
    setWrongQuestions([])
    setMode('main')
    setIsTodayAutoSession(isToday)
    setRevealed(false)
    setScreen('quiz')
    setMascot({ state: 'idle', text: 'きょうも いっしょに がんばろう！' })
  }

  function currentList() {
    return mode === 'review' ? reviewList : sessionQuestions
  }
  function currentIdx() {
    return mode === 'review' ? reviewIdx : idx
  }
  const list = currentList()
  const i = currentIdx()
  const current = list[i]
  const finished = i >= list.length

  function goNext() {
    setRevealed(false)
    setChoiceFeedback(null)
    if (mode === 'main') setIdx((v) => v + 1)
    else setReviewIdx((v) => v + 1)
  }

  function handleReveal() {
    setRevealed(true)
  }

  function handleAnswer(isCorrect) {
    const q = current
    if (mode === 'main') {
      creditTodayActivity()
      if (isCorrect) {
        const wasStruggling = (q.wrong_count || 0) >= 3 && q.last_correct !== true
        setCorrectCount((v) => v + 1)
        addPoints(10)
        incrementWeeklyMission()
        if (wasStruggling) {
          playComeback()
          celebrate()
          setStruggleToast(true)
          setTimeout(() => setStruggleToast(false), 2200)
          setMascot({ state: 'happy', text: 'にがてだった問題、ついに できたね！！' })
        } else {
          playCorrect()
          setMascot({ state: 'happy', text: HAPPY_LINES[Math.floor(Math.random() * HAPPY_LINES.length)] })
        }
      } else {
        setWrongQuestions((v) => [...v, q])
        playWrong()
        setMascot({ state: 'sad', text: 'だいじょうぶ、次で覚えよう' })
      }
      recordAnswer({ question: q, isCorrect, sessionType: 'main' })
        .then((patch) => {
          if (!patch) return
          patchQuestionLocal(q.id, patch)
          if (isCorrect) {
            const updated = { ...q, ...patch }
            checkSetCompletion(updated)
            checkCategoryBadge(updated)
            checkMasteryProgress(updated)
          }
        })
        .catch(console.error)
    } else {
      if (isCorrect) {
        setReviewCorrect((v) => v + 1)
        addPoints(5)
        playCorrect()
        setMascot({ state: 'happy', text: '今度は できたね！' })
      } else {
        setReviewFailed((v) => [...v, q])
        playWrong()
        setMascot({ state: 'sad', text: 'もう一回 見直してみよう' })
      }
      recordAnswer({ question: q, isCorrect, sessionType: 'review' }).catch(console.error)
    }
    setTimeout(goNext, 700)
  }

  function handleChoiceSelect(choice) {
    if (choiceFeedback) return
    const isCorrect = choice === current.content.answer
    setChoiceFeedback({ chosen: choice, correct: current.content.answer })
    setTimeout(() => handleAnswer(isCorrect), 700)
  }

  function handleQuit() {
    const ok = window.confirm('とちゅうで やめますか？\nここまでの きろくは のこりません。')
    if (ok) setScreen('select')
  }

  function restartSameSet() {
    setSessionQuestions((prev) => shuffle(prev))
    setIdx(0)
    setCorrectCount(0)
    setWrongQuestions([])
    setMode('main')
    setRevealed(false)
  }

  function startReview() {
    setMode('review')
    setReviewList(shuffle(wrongQuestions))
    setReviewIdx(0)
    setReviewCorrect(0)
    setReviewFailed([])
    setRevealed(false)
  }

  function backToSummaryFromReview() {
    setMode('main')
  }

  function reviewAgain() {
    setReviewList(shuffle(reviewFailed))
    setReviewFailed([])
    setReviewIdx(0)
    setReviewCorrect(0)
    setRevealed(false)
  }

  function continueToday() {
    const next = buildTodaySet(questions, goalSets)
    startSet(next.picked, { isToday: true })
  }

  async function handlePurchase(item) {
    const key = ownedKey(progress.active_character, item.id)
    if (progress.points < item.cost || progress.owned_items.includes(key)) return
    const nextOwned = [...progress.owned_items, key]
    const nextPoints = progress.points - item.cost
    let patch = { owned_items: nextOwned, points: nextPoints }
    playItemGet()

    // 今のキャラクターのアイテムを全部集めたら、次のキャラクターを解放する
    if (isCharacterComplete(nextOwned, progress.active_character)) {
      const locked = nextLockedCharacter(progress.unlocked_characters)
      if (locked) {
        patch.unlocked_characters = [...progress.unlocked_characters, locked.id]
        setNewCharacter(locked)
        setTimeout(playCharacterUnlock, 320)
      }
    }

    setProgress((prev) => ({ ...prev, ...patch }))
    await updateProgress(patch).catch(console.error)
  }

  async function handleEquip(itemId) {
    setProgress((prev) => ({ ...prev, equipped_item: itemId }))
    await updateProgress({ equipped_item: itemId }).catch(console.error)
  }

  async function handleEquipBackground(themeId) {
    setProgress((prev) => ({ ...prev, active_background: themeId }))
    await updateProgress({ active_background: themeId }).catch(console.error)
  }

  async function handleSwitchCharacter(characterId) {
    if (!progress.unlocked_characters.includes(characterId)) return
    // アイテムはキャラクターごとに所持しているので、切り替え時にそうびは一旦外す
    setProgress((prev) => ({ ...prev, active_character: characterId, equipped_item: null }))
    await updateProgress({ active_character: characterId, equipped_item: null }).catch(console.error)
  }

  if (loading || !progress) {
    return (
      <div className="app">
        <p className="hint" style={{ textAlign: 'center', marginTop: 40 }}>
          よみこみちゅう…
        </p>
      </div>
    )
  }

  return (
    <div className="app">
      <Confetti active={confettiOn} onDone={() => setConfettiOn(false)} />
      {struggleToast && <div className="struggle-toast">🎊 にがて克服！</div>}
      <div className="topbar">
        <div className="stat streak">
          <span className="flame">🔥</span>
          {progress.streak_count} 日連続
        </div>
        <div className="stat point">⭐ {progress.points} ポイント</div>
      </div>

      {screen === 'quiz' && (
        <div id="quizChrome">
          <div className="quit-row">
            <button className="quit-btn" onClick={handleQuit}>
              ✕ やめる
            </button>
          </div>
          <div className="progress-wrap">
            <div className="progress-bar" style={{ width: `${Math.min(100, Math.round((i / Math.max(1, list.length)) * 100))}%` }} />
          </div>
        </div>
      )}

      {screen !== 'sugoroku' && (
        <>
          <div className={`mascot-zone ${progress.active_background ? 'has-room' : ''}`}>
            {progress.active_background && (
              <RoomBackground themeId={progress.active_background} height={130} />
            )}
            <Character character={progress.active_character} state={mascot.state} accessory={progress.equipped_item} />
          </div>
          <div className="speech">{mascot.text}</div>
        </>
      )}

      {screen === 'select' && (
        <SelectScreen
          today={today}
          overdue={overdue}
          staticSets={allSetsSorted}
          questionsById={questionsById}
          title={titleForPoints(progress.points)}
          freezeTokens={progress.freeze_tokens}
          weeklyCorrectCount={progress.weekly_correct_count || 0}
          weeklyMissionsClaimed={progress.weekly_missions_claimed || []}
          onStartToday={() => {
            if (today.picked.length === 0) {
              setMascot({ state: 'happy', text: 'きょうは もうやることないよ！すごい！' })
              return
            }
            startSet(today.picked, { isToday: true })
          }}
          onStartOverdue={() => startSet(overdue.picked, { isToday: false })}
          onStartSet={(set) => {
            const list = set.questionIds.map((id) => questionsById.get(id)).filter(Boolean)
            startSet(list, { isToday: false })
          }}
          onShowRecord={() => setScreen('record')}
          onShowShop={() => setScreen('shop')}
          onShowSugoroku={() => setScreen('sugoroku')}
        />
      )}

      {screen === 'record' && <RecordScreen questions={questions} onBack={() => setScreen('select')} />}

      {screen === 'sugoroku' && (
        <SugorokuScreen
          masteryEventTotal={progress.mastery_event_total || 0}
          characterEmoji={CHARACTERS.find((c) => c.id === progress.active_character)?.emoji || '🦊'}
          onBack={() => setScreen('select')}
        />
      )}

      {screen === 'shop' && (
        <ShopScreen
          points={progress.points}
          ownedItems={progress.owned_items}
          equippedItem={progress.equipped_item}
          activeCharacter={progress.active_character}
          unlockedCharacters={progress.unlocked_characters}
          unlockedBackgrounds={progress.unlocked_backgrounds || []}
          activeBackground={progress.active_background}
          onPurchase={handlePurchase}
          onEquip={handleEquip}
          onSwitchCharacter={handleSwitchCharacter}
          onEquipBackground={handleEquipBackground}
          onBack={() => setScreen('select')}
        />
      )}

      {screen === 'quiz' && !finished && (
        <QuizCard
          item={current}
          revealed={revealed}
          reviewMode={mode === 'review'}
          choiceFeedback={choiceFeedback}
          onReveal={handleReveal}
          onAnswer={handleAnswer}
          onChoice={handleChoiceSelect}
        />
      )}

      {screen === 'quiz' && finished && mode === 'main' && (
        <Summary
          correctCount={correctCount}
          total={sessionQuestions.length}
          streak={progress.streak_count}
          wrongCount={wrongQuestions.length}
          isTodayAutoSession={isTodayAutoSession}
          questions={questions}
          goalSets={goalSets}
          onRestart={restartSameSet}
          onReview={startReview}
          onPickAnother={() => setScreen('select')}
          onContinueToday={continueToday}
          onFinishBonus={() => addPoints(20)}
        />
      )}

      {screen === 'quiz' && finished && mode === 'review' && (
        <ReviewSummary
          reviewCorrect={reviewCorrect}
          total={reviewList.length}
          stillWrongCount={reviewFailed.length}
          onBack={backToSummaryFromReview}
          onReviewAgain={reviewAgain}
        />
      )}

      {milestone && <MilestoneModal milestone={milestone} onClose={() => setMilestone(null)} />}
      {newCharacter && <NewCharacterModal character={newCharacter} onClose={() => setNewCharacter(null)} />}
    </div>
  )
}

function MilestoneModal({ milestone, onClose }) {
  return (
    <div className="milestone-backdrop" onClick={onClose}>
      <div className="milestone-card" onClick={(e) => e.stopPropagation()}>
        <div className="milestone-emoji">{milestone.emoji}</div>
        <div className="milestone-label">{milestone.label}</div>
        <div className="hint">ストリークフリーズを 1こ もらったよ！</div>
        <button className="restart" onClick={onClose}>やったー！</button>
      </div>
    </div>
  )
}

function NewCharacterModal({ character, onClose }) {
  return (
    <div className="milestone-backdrop" onClick={onClose}>
      <div className="milestone-card" onClick={(e) => e.stopPropagation()}>
        <div className="milestone-emoji">{character.emoji}</div>
        <div className="milestone-label">新しいキャラクター かいほう！</div>
        <div className="hint">「{character.name}」が ショップから えらべるようになったよ！</div>
        <button className="restart" onClick={onClose}>やったー！</button>
      </div>
    </div>
  )
}

function SelectScreen({ today, overdue, staticSets, questionsById, title, freezeTokens, weeklyCorrectCount, weeklyMissionsClaimed, onStartToday, onStartOverdue, onStartSet, onShowRecord, onShowShop, onShowSugoroku }) {
  const todaySub =
    today.picked.length === 0
      ? 'きょうは やることなし！'
      : today.totalEligible > today.picked.length
      ? `候補${today.totalEligible}問から${today.picked.length}問を抽出`
      : `${today.picked.length}問を自動で作成`

  const nextMission = WEEKLY_MISSIONS.find((m) => !weeklyMissionsClaimed.includes(m.id))

  return (
    <div>
      <div className="title-banner">
        <span>🎖️ {title}</span>
        <span className="freeze-badge">🧊 フリーズ ×{freezeTokens}</span>
      </div>

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
            <div className="set-name">締切をすぎた問題</div>
            <div className="set-sub">
              {overdue.totalOverdue > overdue.picked.length
                ? `候補${overdue.totalOverdue}問から${overdue.picked.length}問`
                : 'まだ できていないよ'}
            </div>
          </div>
          <div className="set-count">{overdue.picked.length}問</div>
        </button>
      )}

      {nextMission ? (
        <div className="mission-card">
          <div className="mission-title">
            <span>📅 今週のミッション</span>
            <span>{Math.min(weeklyCorrectCount, nextMission.count)}/{nextMission.count}問</span>
          </div>
          <div className="mission-bar-wrap">
            <div className="mission-bar" style={{ width: `${Math.min(100, Math.round((weeklyCorrectCount / nextMission.count) * 100))}%` }} />
          </div>
          <div className="hint" style={{ marginTop: 6, marginBottom: 0 }}>あと{Math.max(0, nextMission.count - weeklyCorrectCount)}問で ⭐{nextMission.reward}pt ゲット！</div>
        </div>
      ) : (
        <div className="mission-card">
          <div className="mission-title"><span>📅 今週のミッション</span><span className="mission-done">ぜんぶ たっせい！🎉</span></div>
        </div>
      )}

      <div className="two-col three-col">
        <button className="set-card progress-card" onClick={onShowRecord}>
          <div className="set-icon progress-icon">📊</div>
          <div className="set-body">
            <div className="set-name">がんばり記録</div>
          </div>
        </button>
        <button className="set-card sugoroku-card" onClick={onShowSugoroku}>
          <div className="set-icon sugoroku-icon">🗺️</div>
          <div className="set-body">
            <div className="set-name">すごろく</div>
          </div>
        </button>
        <button className="set-card shop-card" onClick={onShowShop}>
          <div className="set-icon shop-icon">🛍️</div>
          <div className="set-body">
            <div className="set-name">ショップ</div>
          </div>
        </button>
      </div>

      <div className="set-heading" style={{ marginTop: 18 }}>
        問題集をえらんでね
      </div>
      {staticSets.map((set) => {
        const members = set.questionIds.map((id) => questionsById.get(id)).filter(Boolean)
        const total = members.length
        const boxCounts = [0, 1, 2, 3, 4].map((b) => members.filter((q) => boxOf(q) === b).length)
        const mastered = boxCounts[4]
        const rate = total > 0 ? Math.round((mastered / total) * 100) : 0
        const tier = rate === 0 ? 'tier-none' : rate === 100 ? 'tier-done' : 'tier-mid'
        return (
          <button className="set-card set-card-progress" key={set.id} onClick={() => onStartSet(set)}>
            <div className="set-card-top">
              <div className="set-icon" style={{ background: '#FFF1DA', color: '#E36A1E' }}>
                📖
              </div>
              <div className="set-body">
                <div className="set-name">{set.name}</div>
                <div className="set-sub">
                  {set.questionIds.length}問
                  {set.goal_at && <span className="goal-tag"> ・🎯 {formatGoalShort(set.goal_at)}まで</span>}
                </div>
              </div>
              <div className={`set-count ${tier}`}>{rate}%</div>
            </div>
            <div className="set-progress-wrap" title={`未正解${boxCounts[0]}・1回${boxCounts[1]}・2回${boxCounts[2]}・3回${boxCounts[3]}・かんぺき${boxCounts[4]}`}>
              {BOX_BAR_COLORS.map((color, i) => (
                total > 0 && boxCounts[i] > 0 ? (
                  <div key={i} className="set-progress-seg" style={{ width: `${(boxCounts[i] / total) * 100}%`, background: color }} />
                ) : null
              ))}
            </div>
          </button>
        )
      })}
      {staticSets.length === 0 && <div className="hint">まだ問題集がありません（管理画面で作成してください）</div>}
    </div>
  )
}

function QuizCard({ item, revealed, reviewMode, choiceFeedback, onReveal, onAnswer, onChoice }) {
  const c = item.content

  if (c.choices) {
    return (
      <div>
        {reviewMode && <div className="hint" style={{ marginBottom: 8 }}>📖 復習タイム（正解数にはカウントされません）</div>}
        <div className="card" style={{ alignItems: 'flex-start' }}>
          <div className="label">どうおん</div>
          <div className="reading-tag" style={{ marginTop: 20 }}>
            {c.reading}
          </div>
          <div className="sentence" style={{ marginTop: 12 }}>
            <Ruby text={c.sentence} />
          </div>
        </div>
        <div className="choice-grid">
          {c.choices.map((choice) => {
            let cls = 'choice-btn'
            if (choiceFeedback) {
              if (choice === choiceFeedback.correct) cls += ' choice-correct'
              else if (choice === choiceFeedback.chosen) cls += ' choice-wrong'
            }
            return (
              <button key={choice} className={cls} disabled={!!choiceFeedback} onClick={() => onChoice(choice)}>
                <Ruby text={choice} />
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (c.sentenceA) {
    let labelText = '対になる表現'
    let labelClass = 'label'
    let hintText = '2つとも なんという ことわざ？'
    if (item.category === '類義語') {
      labelText = '類義語'
      labelClass = 'label label-ruigigo'
      hintText = 'この二つの文章の意味になる類義語はなに？'
    } else if (item.category === '対義語') {
      labelText = '対義語'
      labelClass = 'label label-taigigo'
      hintText = 'この二つの文章の意味になる対義語はなに？'
    }
    return (
      <div>
        {reviewMode && <div className="hint" style={{ marginBottom: 8 }}>📖 復習タイム（正解数にはカウントされません）</div>}
        <div className="card" style={{ alignItems: 'flex-start' }}>
          <div className={labelClass}>{labelText}</div>
          <div className="pair-block" style={{ marginTop: 20 }}>
            <div className="pair-sentence">
              <span className="pair-num">1</span>
              <Ruby text={c.sentenceA} />
            </div>
            <div className={`pair-answer ${revealed ? '' : 'pair-answer-hidden'}`}><Ruby text={c.answerA} /></div>
          </div>
          <div className="pair-block">
            <div className="pair-sentence">
              <span className="pair-num">2</span>
              <Ruby text={c.sentenceB} />
            </div>
            <div className={`pair-answer ${revealed ? '' : 'pair-answer-hidden'}`}><Ruby text={c.answerB} /></div>
          </div>
          {!revealed && <div className="hint">{hintText}</div>}
        </div>
        {!revealed ? (
          <button className="btn btn-reveal" onClick={onReveal}>
            タップして こたえを見る
          </button>
        ) : (
          <div className="btn-row">
            <button className="btn btn-bad" onClick={() => onAnswer(false)}>もう少し</button>
            <button className="btn btn-ok" onClick={() => onAnswer(true)}>できた！</button>
          </div>
        )}
      </div>
    )
  }

  const isArrayAnswer = Array.isArray(c.a)
  return (
    <div>
      {reviewMode && <div className="hint" style={{ marginBottom: 8 }}>📖 復習タイム（正解数にはカウントされません）</div>}
      <div className="card">
        {c.sentence ? (
          <>
            <div className="label">れいぶん</div>
            <div className="sentence"><Ruby text={c.sentence} /></div>
            <div className="label label-2">いみ</div>
          </>
        ) : (
          <div className="label">いみ</div>
        )}
        <div className={`meaning${c.sentence ? ' with-sentence' : ''}`}>
          <Ruby text={c.q} />
        </div>
        {c.shown && <div className="shown-proverb"><Ruby text={c.shown} /></div>}
        {!revealed ? (
          <div className="hint">{c.shown ? 'にた いみの ことわざは？' : c.sentence ? 'あてはまる 慣用句は？' : 'こたえを かんがえてみよう'}</div>
        ) : isArrayAnswer ? (
          <>
            {c.a.length > 1 && <div className="multi-badge">こたえは {c.a.length}つ あります</div>}
            {c.a.map((x) => (
              <div className="answer" key={x}><Ruby text={x} /></div>
            ))}
          </>
        ) : (
          <div className="answer"><Ruby text={c.a} /></div>
        )}
      </div>
      {!revealed ? (
        <button className="btn btn-reveal" onClick={onReveal}>
          タップして こたえを見る
        </button>
      ) : (
        <div className="btn-row">
          <button className="btn btn-bad" onClick={() => onAnswer(false)}>もう少し</button>
          <button className="btn btn-ok" onClick={() => onAnswer(true)}>できた！</button>
        </div>
      )}
    </div>
  )
}

function Summary({
  correctCount, total, streak, wrongCount, isTodayAutoSession, questions, goalSets,
  onRestart, onReview, onPickAnother, onContinueToday, onFinishBonus
}) {
  useEffect(() => {
    onFinishBonus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rate = total > 0 ? Math.round((correctCount / total) * 100) : 0
  const todayCheck = isTodayAutoSession ? buildTodaySet(questions, goalSets) : null
  const leftover = todayCheck ? todayCheck.leftoverDueTotal : 0

  useEffect(() => {
    if (isTodayAutoSession && leftover === 0) playFanfareBig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="card summary">
      <h2>きょうの けっか</h2>
      <div className="big">{correctCount} / {total}</div>
      <div className="hint">せいかいりつ {rate}%</div>
      <div className="badges">
        <div className="badge">⭐ +{correctCount * 10 + 20} ポイント</div>
        <div className="badge">🔥 {streak}日連続</div>
      </div>
      {leftover > 0 && (
        <>
          <div className="hint" style={{ margin: '14px 0 4px', color: 'var(--fox-dark)', fontWeight: 700 }}>
            まだ きょう やるべき問題が {leftover}問 のこっています
          </div>
          <button className="restart today-continue" onClick={onContinueToday}>
            つづけて 今日のぶんをやる（あと{leftover}問）
          </button>
        </>
      )}
      <button className="restart" onClick={onRestart}>もう一度 さいしょから</button>
      {wrongCount > 0 && (
        <button className="restart review-btn" onClick={onReview}>
          まちがえた問題を復習する（{wrongCount}問）
        </button>
      )}
      <button className="restart pick-another" onClick={onPickAnother}>べつの問題集をえらぶ</button>
    </div>
  )
}

function ReviewSummary({ reviewCorrect, total, stillWrongCount, onBack, onReviewAgain }) {
  return (
    <div className="card summary">
      <h2>復習けっか</h2>
      <div className="big">{reviewCorrect} / {total}</div>
      <div className="hint">※この結果は最初の正解数には反映されません</div>
      <div className="badges">
        <div className="badge">⭐ +{reviewCorrect * 5} ポイント</div>
      </div>
      <button className="restart" onClick={onBack}>けっか画面にもどる</button>
      {stillWrongCount > 0 && (
        <button className="restart today-continue" onClick={onReviewAgain}>
          まだまちがえた問題を もう一度（{stillWrongCount}問）
        </button>
      )}
    </div>
  )
}
