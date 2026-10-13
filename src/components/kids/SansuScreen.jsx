import { useEffect, useState } from 'react'
import { fetchSansuUnits, countSansuQuestions, fetchSansuQuestions, recordSansuAnswer, SANSU_DIFFICULTIES, MASTERED_STREAK } from '../../lib/sansuApi'
import { shuffle, toggleItem } from '../../lib/utils'
import { loadJSON, saveJSON, removeItem, STORAGE_KEYS } from '../../lib/storage'
import { LoadingView, ErrorView } from '../common/Status'
import AnswerButtons, { StudyHeader } from './AnswerButtons'
import { QuitConfirm } from './ModalCard'
import { NEXT_QUESTION_DELAY_MS } from './feedback'

// 途中でやめても、あとで「つづきから」できるように、残りの問題の順番を端末に保存する
// { filters, ids: 残りの問題ID, answered: 答えた数, results: { correct, incorrect } }
function loadResume() {
  const r = loadJSON(STORAGE_KEYS.sansuResume)
  return Array.isArray(r?.ids) && r.ids.length > 0 ? r : null
}
const saveResume = (data) => saveJSON(STORAGE_KEYS.sansuResume, data)
const clearResume = () => removeItem(STORAGE_KEYS.sansuResume)

/**
 * さんすうナビ（算数の復習）。ことばナビと同じ画面の中で動く。
 * @param onStageChange  'setup' | 'study' | 'result' が変わるたびに親へ知らせる（学習中は下のメニューを隠すため）
 * @param onAnswered     1問答えるたびに呼ぶ（ポイント・連続日数・マスコットの反応は親が担当）
 * @param onFinished     最後まで終えたときに呼ぶ（おわりのボーナス用）
 * @param onGoHome       結果画面の「ホームへ」
 */
export default function SansuScreen({ onStageChange, onAnswered, onMastered, onFinished, onGoHome }) {
  const [stage, setStage] = useState('setup')
  const [filters, setFilters] = useState(null)
  const [result, setResult] = useState(null)
  const [resume, setResume] = useState(null) // つづきから始めるときだけ入る

  useEffect(() => {
    onStageChange(stage)
    return () => onStageChange('setup')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])

  function finish(r, interrupted) {
    setResult({ ...r, interrupted })
    setStage('result')
    if (!interrupted && r.total > 0) onFinished(r)
    if (!interrupted) clearResume()
  }

  if (stage === 'study') {
    return (
      <Study
        filters={filters}
        resume={resume}
        onAnswered={onAnswered}
        onMastered={onMastered}
        onFinish={(r) => finish(r, false)}
        onQuit={(r) => (r.total > 0 ? finish(r, true) : setStage('setup'))}
      />
    )
  }
  if (stage === 'result') {
    return <Result result={result} onRestart={() => setStage('setup')} onGoHome={onGoHome} />
  }
  return (
    <Setup
      onStart={(f) => { clearResume(); setResume(null); setFilters(f); setStage('study') }}
      onResume={(saved) => { setResume(saved); setFilters(saved.filters); setStage('study') }}
    />
  )
}

function Setup({ onStart, onResume }) {
  const [saved] = useState(loadResume)
  const [units, setUnits] = useState([])
  const [selectedUnits, setSelectedUnits] = useState([])
  const [difficulties, setDifficulties] = useState(['easy', 'normal', 'hard'])
  const [excludeMastered, setExcludeMastered] = useState(false)
  const [count, setCount] = useState(0)
  const [state, setState] = useState('loading') // loading | error | ready

  async function loadUnits() {
    setState('loading')
    try {
      const list = await fetchSansuUnits()
      setUnits(list)
      setSelectedUnits(list)
      setState('ready')
    } catch (e) {
      console.error(e)
      setState('error')
    }
  }

  useEffect(() => { loadUnits() }, [])

  // 条件を変えるたびに、対象の問題数を数えなおす（古い結果で上書きしない）
  useEffect(() => {
    if (state !== 'ready') return
    if (selectedUnits.length === 0 || difficulties.length === 0) { setCount(0); return }
    let cancelled = false
    countSansuQuestions({ units: selectedUnits, difficulties, excludeMastered })
      .then((n) => { if (!cancelled) setCount(n) })
      .catch(console.error)
    return () => { cancelled = true }
  }, [state, selectedUnits, difficulties, excludeMastered])

  if (state === 'loading') return <LoadingView />
  if (state === 'error') return <ErrorView onRetry={loadUnits} />
  if (units.length === 0) {
    return (
      <div className="sansu-panel">
        <div className="sansu-empty">📝 問題がまだないよ</div>
        <p className="hint" style={{ textAlign: 'center' }}>おうちの人に登録してもらってね</p>
      </div>
    )
  }

  return (
    <div className="sansu-panel">
      <h2 className="sansu-title">🔢 さんすうナビ</h2>

      <div className="sansu-section">単元を選ぶ</div>
      <div className="chip-row">
        {units.map((unit) => (
          <button key={unit} className={`chip ${selectedUnits.includes(unit) ? 'chip-on' : ''}`} onClick={() => setSelectedUnits((p) => toggleItem(p, unit))}>
            {unit}
          </button>
        ))}
      </div>

      <div className="sansu-section">難しさを選ぶ</div>
      <div className="chip-row">
        {SANSU_DIFFICULTIES.map((d) => (
          <button key={d.value} className={`chip ${difficulties.includes(d.value) ? 'chip-on' : ''}`} onClick={() => setDifficulties((p) => toggleItem(p, d.value))}>
            {d.label}
          </button>
        ))}
      </div>

      <label className="sansu-check">
        <input type="checkbox" checked={excludeMastered} onChange={(e) => setExcludeMastered(e.target.checked)} />
        <span>{MASTERED_STREAK}回連続でできた問題は除く</span>
      </label>

      <p className="sansu-count">問題は <b>{count}</b> 問</p>

      {saved && (
        <button className="restart" onClick={() => onResume(saved)}>
          ▶ つづきから（あと{saved.ids.length}問）
        </button>
      )}
      <button className={`restart ${saved ? 'pick-another' : ''}`} disabled={count === 0} onClick={() => onStart({ units: selectedUnits, difficulties, excludeMastered })}>
        始める
      </button>
    </div>
  )
}

function Study({ filters, resume, onAnswered, onMastered, onFinish, onQuit }) {
  const [questions, setQuestions] = useState([])
  const [state, setState] = useState('loading') // loading | error | ready
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState(resume?.results || { correct: 0, incorrect: 0 })
  const [showQuit, setShowQuit] = useState(false)

  const offset = resume?.answered || 0 // つづきから始めたとき、すでに答えた数

  async function load() {
    setState('loading')
    try {
      const rows = await fetchSansuQuestions(filters)
      if (resume) {
        // 保存した順番どおりに、残りの問題だけを最新の内容で並べなおす
        const byId = new Map(rows.map((r) => [r.id, r]))
        const rest = resume.ids.map((id) => byId.get(id)).filter(Boolean)
        if (rest.length === 0) clearResume()
        setQuestions(rest)
      } else {
        setQuestions(shuffle(rows))
      }
      setState('ready')
    } catch (e) {
      console.error(e)
      setState('error')
    }
  }

  useEffect(() => { load() }, [])

  function answer(isCorrect) {
    if (busy) return
    setBusy(true)
    const current = questions[index]
    const next = { correct: results.correct + (isCorrect ? 1 : 0), incorrect: results.incorrect + (isCorrect ? 0 : 1) }
    setResults(next)
    onAnswered(isCorrect)
    saveResume({ filters, ids: questions.slice(index + 1).map((q) => q.id), answered: offset + index + 1, results: next })
    recordSansuAnswer(current, isCorrect)
      .then((r) => { if (r?.newlyMastered) onMastered?.(current) })
      .catch(console.error)
    setTimeout(() => {
      if (index + 1 >= questions.length) {
        onFinish({ ...next, total: offset + questions.length })
      } else {
        setIndex(index + 1)
        setRevealed(false)
        setBusy(false)
      }
    }, NEXT_QUESTION_DELAY_MS)
  }

  if (state === 'loading') return <LoadingView />
  if (state === 'error') return <ErrorView onRetry={load} />
  if (questions.length === 0) {
    return (
      <div className="sansu-panel">
        <div className="sansu-empty">問題がないよ</div>
        <button className="restart" onClick={() => onQuit({ ...results, total: 0 })}>もどる</button>
      </div>
    )
  }

  const current = questions[index]
  return (
    <div>
      <StudyHeader done={offset + index} total={offset + questions.length} onQuit={() => setShowQuit(true)} />

      <div className="card sansu-card" key={current.id}>
        <div className="label">{current.unit}</div>
        <p className="sansu-question">{current.question_text}</p>
        {current.image_urls?.length > 0 && (
          <div className="sansu-images">
            {current.image_urls.map((url, i) => <img key={i} src={url} alt="問題の図" />)}
          </div>
        )}

        {revealed && (
          <div className="shown-proverb sansu-answer">
            <div className="hint" style={{ marginTop: 0 }}>答え</div>
            {current.answer && <div className="answer">{current.answer}</div>}
            {current.answer_image_urls?.length > 0 && (
              <div className="sansu-images">
                {current.answer_image_urls.map((url, i) => <img key={i} src={url} alt="答えの図" />)}
              </div>
            )}
          </div>
        )}
      </div>

      <AnswerButtons revealed={revealed} disabled={busy} onReveal={() => setRevealed(true)} onAnswer={answer} />

      {showQuit && (
        <QuitConfirm
          hint="ここまでの記録は残るよ。あとで「つづきから」できるよ。"
          onCancel={() => setShowQuit(false)}
          onQuit={() => onQuit({ ...results, total: results.correct + results.incorrect })}
        />
      )}
    </div>
  )
}

function Result({ result, onRestart, onGoHome }) {
  const rate = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0
  const message = result.interrupted ? 'ここまでよく頑張ったね！' : rate >= 80 ? 'すごい！よくできたね！' : rate >= 50 ? 'いい調子！次も頑張ろう！' : '間違えたところが次の力！'
  return (
    <div className="sansu-panel">
      <div className="card sansu-result">
        <div className="label">{result.interrupted ? '途中まで' : '結果'}</div>
        <div className="sansu-rate">{rate}<small>%</small></div>
        <div className="meaning">{result.total}問中 {result.correct}問できた</div>
        <div className="hint">{message}</div>
      </div>
      <button className="restart" onClick={onRestart}>もう一度選ぶ</button>
      <button className="restart pick-another" onClick={onGoHome}>ホームへ</button>
    </div>
  )
}
