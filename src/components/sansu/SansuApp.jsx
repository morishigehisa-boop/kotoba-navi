import { useEffect, useState } from 'react'
import SetupScreen from './SetupScreen'
import StudyScreen from './StudyScreen'
import ResultScreen from './ResultScreen'
import './sansu.css'

export default function StudyPage() {
  const [stage, setStage] = useState('setup') // setup | study | result
  const [filters, setFilters] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => { document.title = 'さんすうナビ' }, [])

  function handleStart(f) {
    setFilters(f)
    setStage('study')
  }

  function handleFinish(r) {
    setResult(r)
    setStage('result')
  }

  function handleQuit(r) {
    setResult({ ...r, interrupted: true })
    setStage('result')
  }

  function handleRestart() {
    setFilters(null)
    setResult(null)
    setStage('setup')
  }

  if (stage === 'setup') return <SetupScreen onStart={handleStart} />
  if (stage === 'study') return <StudyScreen filters={filters} onFinish={handleFinish} onQuit={handleQuit} />
  if (stage === 'result') return <ResultScreen result={result} onRestart={handleRestart} />
  return null
}
