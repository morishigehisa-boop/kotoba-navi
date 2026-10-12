import { useEffect, useState } from 'react'
import { fetchSansuUnits, countSansuQuestions, fetchSansuQuestions, recordSansuAnswer } from '../../lib/sansuApi'
import { LoadingView, ErrorView } from '../common/Status'

const DIFFICULTIES = [
  { value: 'easy', label: '易しい' },
  { value: 'normal', label: 'ふつう' },
  { value: 'hard', label: '難しい' }
]
const NEXT_DELAY_MS = 600 // 「できた／もう少し」を押してから次の問題に進むまでの間

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const toggle = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

/**
 * さんすうナビ（算数の復習）。ことばナビと同じ画面の中で動く。
 * @param onStageChange  'setup' | 'study' | 'result' が変わるたびに親へ知らせる（学習中は下のメニューを隠すため）
 * @param onAnswered     1問答えるたびに呼ぶ（ポイント・連続日数・マスコットの反応は親が担当）
 * @param onFinished     最後まで終えたときに呼ぶ（おわりのボーナス用）
 * @param onGoHome       結果画面の「ホームへ」
 */
export default function SansuScreen({ onStageChange, onAnswered, onFinished, onGoHome }) {
  const [stage, setStage] = useState('setup')
  const [filters, setFilters] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => {
    onStageChange(stage)
    return () => onStageChange('setup')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])

  function finish(r, interrupted) {
    setResult({ ...r, interrupted })
    setStage('result')
    if (!interrupted && r.total > 0) onFinished(r)
  }

  if (stage === 'study') {
    return (
      <Study
        filters={filters}
        onAnswered={onAnswered}
        onFinish={(r) => finish(r, false)}
        onQuit={(r) => (r.total > 0 ? finish(r, true) : setStage('setup'))}
      />
    )
  }
  if (stage === 'result') {
    return <Result result={result} onRestart={() => setStage('setup')} onGoHome={onGoHome} />
  }
  return <Setup onStart={(f) => { setFilters(f); setStage('study') }} />
}

function Setup({ onStart }) {
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
          <button key={unit} className={`chip ${selectedUnits.includes(unit) ? 'chip-on' : ''}`} onClick={() => setSelectedUnits((p) => toggle(p, unit))}>
            {unit}
          </button>
        ))}
      </div>

      <div className="sansu-section">難しさを選ぶ</div>
      <div className="chip-row">
        {DIFFICULTIES.map((d) => (
          <button key={d.value} className={`chip ${difficulties.includes(d.value) ? 'chip-on' : ''}`} onClick={() => setDifficulties((p) => toggle(p, d.value))}>
            {d.label}
          </button>
        ))}
      </div>

      <label className="sansu-check">
        <input type="checkbox" checked={excludeMastered} onChange={(e) => setExcludeMastered(e.target.checked)} />
        <span>3回連続でできた問題は除く</span>
      </label>

      <p className="sansu-count">問題は <b>{count}</b> 問</p>

      <button className="restart" disabled={count === 0} onClick={() => onStart({ units: selectedUnits, difficulties, excludeMastered })}>
        始める
      </button>
    </div>
  )
}

function Study({ filters, onAnswered, onFinish, onQuit }) {
  const [questions, setQuestions] = useState([])
  const [state, setState] = useState('loading') // loading | error | ready
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState({ correct: 0, incorrect: 0 })
  const [showQuit, setShowQuit] = useState(false)

  async function load() {
    setState('loading')
    try {
      setQuestions(shuffle(await fetchSansuQuestions(filters)))
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
    recordSansuAnswer(current, isCorrect).catch(console.error)
    setTimeout(() => {
      if (index + 1 >= questions.length) {
        onFinish({ ...next, total: questions.length })
      } else {
        setIndex(index + 1)
        setRevealed(false)
        setBusy(false)
      }
    }, NEXT_DELAY_MS)
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
      <div className="quit-row">
        <button className="quit-btn" onClick={() => setShowQuit(true)}>✕ やめる</button>
      </div>
      <div className="progress-wrap">
        <div className="progress-bar" style={{ width: `${Math.round((index / questions.length) * 100)}%` }} />
      </div>

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

      {revealed ? (
        <div className="btn-row">
          <button className="btn btn-bad" disabled={busy} onClick={() => answer(false)}>もう少し</button>
          <button className="btn btn-ok" disabled={busy} onClick={() => answer(true)}>できた！</button>
        </div>
      ) : (
        <button className="btn btn-reveal" onClick={() => setRevealed(true)}>タップして答えを見る</button>
      )}

      {showQuit && (
        <div className="milestone-backdrop" onClick={() => setShowQuit(false)}>
          <div className="milestone-card" onClick={(e) => e.stopPropagation()}>
            <div className="milestone-emoji">🤔</div>
            <div className="milestone-label">途中でやめますか？</div>
            <div className="hint">ここまでの記録は残るよ。</div>
            <button className="restart" onClick={() => setShowQuit(false)}>続ける</button>
            <button className="restart pick-another" onClick={() => onQuit({ ...results, total: results.correct + results.incorrect })}>やめる</button>
          </div>
        </div>
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
