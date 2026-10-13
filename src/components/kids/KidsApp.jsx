import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Character from './Character'
import Confetti from './Confetti'
import RoomBackground from './RoomBackground'
import BottomNav from './BottomNav'
import HomeScreen from './HomeScreen'
import SansuScreen from './SansuScreen'
import RecordScreen from './RecordScreen'
import OverallRecord from './OverallRecord'
import PointHistory from './PointHistory'
import ShopScreen from './ShopScreen'
import SugorokuScreen from './SugorokuScreen'
import ModalCard, { QuitConfirm } from './ModalCard'
import { StudyHeader } from './AnswerButtons'
import SelectScreen from './kotoba/SelectScreen'
import QuizCard from './kotoba/QuizCard'
import { QuizSummary, ReviewSummary } from './kotoba/QuizSummary'
import { useKotobaSession } from './kotoba/useKotobaSession'
import { useProgress } from './useProgress'
import { useRewardChecks } from './useRewardChecks'
import { happyMascot, SAD_MASCOT } from './feedback'
import { LoadingView, ErrorView } from '../common/Status'
import { setCustomFurigana } from '../../lib/furigana'
import { playTaskDone, playTaskAllDone, playCorrect, playWrong, playFanfareBig, playComeback, isMuted, setMuted } from '../../lib/sound'
import { fetchQuestions, fetchQuestionSetsWithItems, recordAnswer, fetchProgress, fetchFuriganaEntries } from '../../lib/api'
import { buildTodaySet, buildOverdueSet } from '../../lib/today'
import { titleForPoints, characterById, POINTS } from '../../lib/gamification'
import { fetchTasks, fetchTaskCompletions, completeTask, findAutoCompleteTarget } from '../../lib/tasks'
import { toISODate } from '../../lib/dates'
import { loadString, saveString, loadJSON, saveJSON, STORAGE_KEYS } from '../../lib/storage'
import './kids.css'

// 「今日のやることを全部達成」ボーナスは、1日1回だけ（取り消して付けなおしても増えない）
function claimTaskBonus() {
  const today = toISODate()
  if (loadString(STORAGE_KEYS.taskBonusDate) === today) return false
  saveString(STORAGE_KEYS.taskBonusDate, today)
  return true
}

// 下のメニューのどれを光らせるか（画面 → メニュー）
const NAV_OF_SCREEN = { home: 'home', select: 'kotoba', quiz: 'kotoba', sansu: 'sansu', record: 'record', shop: 'shop' }

/**
 * 子ども画面全体。画面の切りかえと、学習 → ごほうび（ポイント・連続日数・すごろく・やること）のつなぎ役。
 * 画面: 'home' | 'select'（ことばナビのはじめ）| 'quiz' | 'sansu' | 'record' | 'shop'
 */
export default function KidsApp({ initialScreen = 'home' }) {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [questions, setQuestions] = useState([])
  const [allSets, setAllSets] = useState([])
  const [screen, setScreen] = useState(initialScreen)
  const [backTo, setBackTo] = useState('home') // きろく・ショップの「もどる」先
  const [recordTab, setRecordTab] = useState('record') // きろく画面の中の切り替え：'record'（がんばり記録）／'sugoroku'
  const [sansuStage, setSansuStage] = useState('setup') // さんすうナビの 'setup' | 'study' | 'result'（学習中は下のメニューを隠す）

  const [mascot, setMascot] = useState({ state: 'idle', text: '' })
  const [confettiOn, setConfettiOn] = useState(false)
  const [struggleToast, setStruggleToast] = useState(false)
  const [pointToast, setPointToast] = useState(null) // { n, key }：やることでもらったポイントの表示
  const pointToastTimer = useRef(null)
  const [showQuitConfirm, setShowQuitConfirm] = useState(false)
  const [soundMuted, setSoundMuted] = useState(() => isMuted())
  const [milestone, setMilestone] = useState(null) // 連続日数のお祝い
  const [newCharacter, setNewCharacter] = useState(null) // 新キャラクター解放のお祝い

  function celebrate() {
    setConfettiOn(false)
    requestAnimationFrame(() => setConfettiOn(true))
  }

  const rewards = useProgress({ celebrate, setMascot, onMilestone: setMilestone, onNewCharacter: setNewCharacter })
  const { progress } = rewards

  const goalSets = useMemo(() => allSets.filter((s) => s.goal_at), [allSets])
  // 目標日があってもなくても、一覧では全ての問題集を選べるようにする
  const sortedSets = useMemo(() => [...allSets].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)), [allSets])
  const questionsById = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions])
  const today = useMemo(() => buildTodaySet(questions, goalSets), [questions, goalSets])
  const overdue = useMemo(() => buildOverdueSet(questions, goalSets), [questions, goalSets])

  // 問題集の完成・カテゴリーバッジ・すごろく（ことばナビの「完璧」）の判定
  const rewardChecks = useRewardChecks({ loading, questions, questionsById, sets: sortedSets, celebrate, onMastered: rewards.addMasteryEvent })

  const session = useKotobaSession({ questionsById, onAnswer: handleKotobaAnswer })

  const loadAll = useCallback(async () => {
    setLoadError(false)
    setLoading(true)
    try {
      const [qs, sets, prog, furiganaEntries] = await Promise.all([fetchQuestions(), fetchQuestionSetsWithItems(), fetchProgress(), fetchFuriganaEntries()])
      setCustomFurigana(furiganaEntries)
      setQuestions(qs)
      setAllSets(sets)
      rewards.load(prog)
      session.restorePending(qs)
    } catch (e) {
      console.error(e)
      setLoadError(true) // 読み込みに失敗したら、読み込み中のまま止まらず、やりなおせるようにする
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  // 正解1問ぶんのごほうび（ことばナビ・さんすうナビ共通）
  function rewardCorrect(source, label) {
    rewards.addPoints(POINTS.correct, source, label)
    rewards.addWeeklyCount()
  }

  // ---- ことばナビ ----
  function handleKotobaAnswer(q, isCorrect, mode) {
    if (mode === 'review') {
      if (isCorrect) {
        rewards.addPoints(POINTS.review, 'kotoba', 'ことばナビ 復習')
        playCorrect()
        setMascot({ state: 'happy', text: '今度はできたね！' })
      } else {
        playWrong()
        setMascot({ state: 'sad', text: 'もう一回見直してみよう' })
      }
      recordAnswer({ question: q, isCorrect, sessionType: 'review' }).catch(console.error)
      return
    }

    rewards.creditTodayActivity()
    if (isCorrect) {
      rewardCorrect('kotoba', 'ことばナビ 正解')
      const wasStruggling = (q.wrong_count || 0) >= 3 && q.last_correct !== true
      if (wasStruggling) {
        playComeback()
        celebrate()
        setStruggleToast(true)
        setTimeout(() => setStruggleToast(false), 2200)
        setMascot({ state: 'happy', text: '苦手だった問題、ついにできたね！！' })
      } else {
        playCorrect()
        setMascot(happyMascot())
      }
    } else {
      playWrong()
      setMascot(SAD_MASCOT)
    }
    recordAnswer({ question: q, isCorrect, sessionType: 'main' })
      .then((patch) => {
        if (!patch) return
        const updated = { ...q, ...patch }
        setQuestions((prev) => prev.map((x) => (x.id === q.id ? updated : x)))
        if (isCorrect) rewardChecks.afterCorrect(updated)
      })
      .catch(console.error)
  }

  function startKotoba(list, options) {
    session.startSet(list, options)
    setScreen('quiz')
    setMascot({ state: 'idle', text: '今日も一緒に頑張ろう！' })
  }

  function startToday() {
    if (today.picked.length === 0) {
      setMascot({ state: 'happy', text: '今日はもうやることないよ！すごい！' })
      return
    }
    startKotoba(today.picked, { isToday: true })
  }

  function resumeKotoba() {
    if (!session.resume()) return
    setScreen('quiz')
    setMascot({ state: 'idle', text: '続きから頑張ろう！' })
  }

  function handleKotobaFinished() {
    rewards.addPoints(POINTS.finishBonus, 'bonus', 'ことばナビ 最後までできた')
    if (!session.isToday) return
    autoCompleteLinkedTask('kotoba') // 「今日やる問題」を終えたら、連動するやることを完了にする
    if (today.leftoverDueTotal === 0) playFanfareBig()
  }

  // ---- さんすうナビ（ことばナビと同じポイント・連続日数にためる） ----
  const sansuCountedRef = useRef(null) // すごろくに数えた、さんすうの問題ID（開き直しても二重に数えないよう端末に保存）
  if (sansuCountedRef.current === null) sansuCountedRef.current = new Set(loadJSON(STORAGE_KEYS.sansuCounted, []))

  function handleSansuAnswered(isCorrect) {
    rewards.creditTodayActivity()
    if (isCorrect) {
      rewardCorrect('sansu', 'さんすう 正解')
      playCorrect()
      setMascot(happyMascot())
    } else {
      playWrong()
      setMascot(SAD_MASCOT)
    }
  }

  // さんすうの問題が3回連続正解（習得）になったら、ことばナビの「完璧」と同じようにすごろくを進める
  function handleSansuMastered(question) {
    if (sansuCountedRef.current.has(question.id)) return
    sansuCountedRef.current.add(question.id)
    saveJSON(STORAGE_KEYS.sansuCounted, [...sansuCountedRef.current])
    rewards.addMasteryEvent()
  }

  function handleSansuFinished() {
    rewards.addPoints(POINTS.finishBonus, 'bonus', 'さんすう 最後までできた')
    autoCompleteLinkedTask('sansu')
    playFanfareBig()
    celebrate()
    setMascot({ state: 'happy', text: '最後までできたね！すごい！' })
  }

  // ---- やること（ホーム） ----
  function showPointToast(n) {
    clearTimeout(pointToastTimer.current)
    setPointToast({ n, key: Date.now() })
    pointToastTimer.current = setTimeout(() => setPointToast(null), 1800)
  }

  // やることを完了／取り消したときの処理。ポイント・連続日数・今週のミッション・履歴をまとめて反映する
  // points: そのやることのポイント（取り消しのときは、完了したときに付いたポイント）
  function handleTaskChange(kind, { allTodayDone, points, title }) {
    const missionCount = Math.round(points / POINTS.correct) // ミッションは「正解何問ぶんか」で数える
    if (kind === 'undone') {
      rewards.addPoints(-points, 'task', `取り消し：${title}`)
      rewards.addWeeklyCount(-missionCount)
      return
    }
    rewards.creditTodayActivity() // やることだけをやった日も「連続」に数える
    rewards.addPoints(points, 'task', title)
    rewards.addWeeklyCount(missionCount)
    showPointToast(points)
    playTaskDone()
    if (allTodayDone && claimTaskBonus()) {
      rewards.addPoints(POINTS.taskAllDone, 'bonus', '今日のやることを全部達成')
      playTaskAllDone()
      celebrate()
    }
  }

  // アプリの学習を終えたとき、「自動で完了にする」設定のやること（1件）を完了にする
  async function autoCompleteLinkedTask(app) {
    try {
      const [tasks, completions] = await Promise.all([fetchTasks(), fetchTaskCompletions()])
      const target = findAutoCompleteTarget(tasks, completions, toISODate(), app)
      if (!target) return
      const { task, date } = target
      if (!(await completeTask(task.id, date, task.points))) return // すでに完了ずみ
      handleTaskChange('done', { allTodayDone: false, points: task.points, title: task.title })
      setMascot({ state: 'happy', text: `「${task.title}」を完了にしたよ！` })
    } catch (e) {
      console.error(e) // 失敗しても学習結果には影響させない（ホームから手動で完了にできる）
    }
  }

  // ---- 画面の切りかえ ----
  function handleNavSelect(key) {
    if (NAV_OF_SCREEN[screen] === key && screen !== 'quiz') return
    if (key === 'kotoba') setScreen('select')
    else if (key === 'sansu') {
      setScreen('sansu')
      setMascot({ state: 'idle', text: 'さんすうも一緒に頑張ろう！' })
    } else if (key === 'record' || key === 'shop') {
      setBackTo(screen) // 「もどる」で今いた画面に戻れるようにする
      setScreen(key)
    } else setScreen(key)
  }

  if (loadError) return <div className="app"><ErrorView onRetry={loadAll} /></div>
  if (loading || !progress) return <div className="app"><LoadingView /></div>

  const sansuStudying = screen === 'sansu' && sansuStage === 'study'
  const quizStudying = screen === 'quiz' && !session.finished
  // 学習中（ことばナビ・さんすうナビの出題）は、下のメニューを隠して集中できるようにする
  const showNav = !quizStudying && !sansuStudying
  // 問題を解いている間は、小さなキャラ＋ふきだしの1行だけ出す。ホーム・すごろくはキャラを自分で表示する
  const showMascotStrip = screen === 'quiz' || sansuStudying
  const showMascotZone = !showMascotStrip && screen !== 'home' && !(screen === 'record' && recordTab === 'sugoroku')
  const characterProps = { character: progress.active_character, state: mascot.state, accessory: progress.equipped_item }
  const goBack = () => setScreen(backTo)

  return (
    <div className={`app ${showNav ? 'has-nav' : ''}`}>
      <Confetti active={confettiOn} onDone={() => setConfettiOn(false)} />
      {pointToast && <div className="point-toast" key={pointToast.key}>⭐ +{pointToast.n}pt</div>}
      {struggleToast && <div className="struggle-toast">🎊 苦手克服！</div>}
      <div className="topbar">
        <div className="stat streak"><span className="flame">🔥</span>{progress.streak_count} 日連続</div>
        <button
          className="stat mute-btn"
          title={soundMuted ? '音をオンにする' : '音をオフにする'}
          onClick={() => { setMuted(!soundMuted); setSoundMuted(!soundMuted) }}
        >
          {soundMuted ? '🔇' : '🔊'}
        </button>
        <div className="stat point">⭐ {progress.points} ポイント</div>
      </div>

      {screen === 'quiz' && (
        <div id="quizChrome">
          <StudyHeader done={session.progress.done} total={session.progress.total} onQuit={() => setShowQuitConfirm(true)} />
        </div>
      )}

      {showMascotStrip && (
        <div className="mascot-strip">
          <div className="mascot-strip-fox" key={`${mascot.state}|${mascot.text}`}><Character {...characterProps} /></div>
          {mascot.text && <div className="mascot-strip-bubble">{mascot.text}</div>}
        </div>
      )}

      {showMascotZone && (
        <>
          <div className={`mascot-zone ${progress.active_background ? 'has-room' : ''}`}>
            {progress.active_background && <RoomBackground themeId={progress.active_background} height={130} />}
            <Character {...characterProps} />
          </div>
          <div className="speech">{mascot.text}</div>
        </>
      )}

      {screen === 'home' && (
        <HomeScreen
          character={progress.active_character}
          accessory={progress.equipped_item}
          pendingSession={session.pendingSession}
          onResumeSession={resumeKotoba}
          onOpenApp={(app) => handleNavSelect(app)}
          onTaskChange={handleTaskChange}
        />
      )}

      {screen === 'select' && (
        <SelectScreen
          today={today}
          overdue={overdue}
          sets={sortedSets}
          questionsById={questionsById}
          title={titleForPoints(progress.points)}
          freezeTokens={progress.freeze_tokens}
          weeklyCorrectCount={progress.weekly_correct_count || 0}
          weeklyMissionsClaimed={progress.weekly_missions_claimed || []}
          pendingSession={session.pendingSession}
          onResumeSession={resumeKotoba}
          onDismissSession={session.dismissPending}
          onStartToday={startToday}
          onStartOverdue={() => startKotoba(overdue.picked)}
          // 管理画面でランダム出題がオンの問題集は、開くたびに順番を入れ替える
          onStartSet={(set) => startKotoba(set.questionIds.map((id) => questionsById.get(id)).filter(Boolean), { randomize: !!set.shuffle })}
        />
      )}

      {screen === 'record' && (
        <>
          <div className="sub-tabs" role="tablist">
            <button role="tab" aria-selected={recordTab === 'record'} className={`sub-tab ${recordTab === 'record' ? 'on' : ''}`} onClick={() => setRecordTab('record')}>📊 がんばり記録</button>
            <button role="tab" aria-selected={recordTab === 'sugoroku'} className={`sub-tab ${recordTab === 'sugoroku' ? 'on' : ''}`} onClick={() => setRecordTab('sugoroku')}>🗺️ すごろく</button>
          </div>
          {recordTab === 'record' ? (
            <>
              <OverallRecord />
              <PointHistory />
              <RecordScreen questions={questions} onBack={goBack} />
            </>
          ) : (
            <SugorokuScreen
              masteryEventTotal={progress.mastery_event_total || 0}
              characterEmoji={characterById(progress.active_character).emoji}
              onBack={goBack}
            />
          )}
        </>
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
          onPurchase={rewards.purchase}
          onEquip={rewards.equip}
          onSwitchCharacter={rewards.switchCharacter}
          onEquipBackground={rewards.equipBackground}
          onBack={goBack}
        />
      )}

      {screen === 'sansu' && (
        <SansuScreen
          onStageChange={setSansuStage}
          onAnswered={handleSansuAnswered}
          onMastered={handleSansuMastered}
          onFinished={handleSansuFinished}
          onGoHome={() => setScreen('home')}
        />
      )}

      {quizStudying && (
        <QuizCard
          item={session.current}
          revealed={session.revealed}
          reviewMode={session.mode === 'review'}
          choiceFeedback={session.choiceFeedback}
          onReveal={session.reveal}
          onAnswer={session.answer}
          onChoice={session.choose}
        />
      )}

      {screen === 'quiz' && session.finished && session.mode === 'main' && (
        <QuizSummary
          correctCount={session.main.correct}
          total={session.main.list.length}
          streak={progress.streak_count}
          wrongCount={session.main.wrong.length}
          leftoverToday={session.isToday ? today.leftoverDueTotal : null}
          onShown={handleKotobaFinished}
          onRestart={session.restart}
          onReview={session.startReview}
          onPickAnother={() => setScreen('select')}
          onContinueToday={() => startKotoba(today.picked, { isToday: true })}
        />
      )}

      {screen === 'quiz' && session.finished && session.mode === 'review' && (
        <ReviewSummary
          reviewCorrect={session.review.correct}
          total={session.review.list.length}
          stillWrongCount={session.review.failed.length}
          onBack={session.backToSummary}
          onReviewAgain={session.reviewAgain}
        />
      )}

      {showNav && <BottomNav active={NAV_OF_SCREEN[screen]} onSelect={handleNavSelect} />}

      {milestone && (
        <ModalCard
          emoji={milestone.emoji}
          label={milestone.label}
          hint="ストリークフリーズを1個もらったよ！"
          onClose={() => setMilestone(null)}
          actions={[{ label: 'やったー！', onClick: () => setMilestone(null) }]}
        />
      )}
      {newCharacter && (
        <ModalCard
          emoji={newCharacter.emoji}
          label="新しいキャラクター解放！"
          hint={`「${newCharacter.name}」が ショップから選べるようになったよ！`}
          onClose={() => setNewCharacter(null)}
          actions={[{ label: 'やったー！', onClick: () => setNewCharacter(null) }]}
        />
      )}
      {showQuitConfirm && (
        <QuitConfirm
          hint="ここまでの記録は残るよ。あとで「続きから」できるよ。"
          onCancel={() => setShowQuitConfirm(false)}
          onQuit={() => { setShowQuitConfirm(false); session.quit(); setScreen('select') }}
        />
      )}
    </div>
  )
}
