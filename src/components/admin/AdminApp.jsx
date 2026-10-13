import { useEffect, useMemo, useState } from 'react'
import { fetchQuestions, fetchQuestionSetsWithItems, fetchFilterHistory, fetchFuriganaEntries, deleteQuestionSet, reorderQuestionSets, updateQuestionSet } from '../../lib/api'
import { setCustomFurigana } from '../../lib/furigana'
import { uniqueValues } from '../../lib/utils'
import { loadString, saveString, STORAGE_KEYS } from '../../lib/storage'
import { useConfirm } from './useConfirm'
import { useToast } from './useToast'
import { LoadingView, ErrorView } from '../common/Status'
import TaskCalendarPanel from './TaskCalendarPanel'
import TasksPanel from './TasksPanel'
import MilestonesPanel from './MilestonesPanel'
import PreviewPanel from './PreviewPanel'
import FuriganaPanel from './FuriganaPanel'
import ListPanel from './kotoba/ListPanel'
import MakePanel from './kotoba/MakePanel'
import SetsPanel from './kotoba/SetsPanel'
import ImportPanel from './kotoba/ImportPanel'
import './admin.css'

// 管理画面は「ホーム（やること）」と「ことばナビ」に分ける（さんすうナビはCSSが衝突しないよう別ページ /admin/sansu）
const AREAS = [
  ['home', '🏠 ホーム（やること）'],
  ['kotoba', '📚 ことばナビ']
]
const HOME_TABS = [
  ['calendar', '📅 予定カレンダー'],
  ['tasks', '📝 やること一覧'],
  ['events', '🚩 イベント一覧']
]
const KOTOBA_TABS = [
  ['list', '問題一覧'],
  ['preview', 'プレビュー'],
  ['make', '問題集作成'],
  ['sets', '問題集一覧'],
  ['history', '抽出条件履歴'],
  ['import', 'インポート'],
  ['furigana', 'ふりがな辞書']
]

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map(([key, label]) => (
        <button key={key} className={`tab ${active === key ? 'active' : ''}`} onClick={() => onChange(key)}>{label}</button>
      ))}
    </div>
  )
}

export default function AdminApp() {
  // 最後に開いた方（ホーム／ことばナビ）を覚えておく
  const [area, setAreaState] = useState(() => (loadString(STORAGE_KEYS.adminArea) === 'home' ? 'home' : 'kotoba'))
  const setArea = (a) => { setAreaState(a); saveString(STORAGE_KEYS.adminArea, a) }
  const [homeTab, setHomeTab] = useState('calendar')

  return (
    <div className="wrap">
      <h1>勉強がんばるアプリ 管理画面</h1>
      <div className="area-switch">
        {AREAS.map(([key, label]) => (
          <button key={key} className={`area-btn ${area === key ? 'active' : ''}`} onClick={() => setArea(key)}>{label}</button>
        ))}
        <a className="area-btn" href="/admin/sansu">🔢 さんすうナビ</a>
      </div>

      {area === 'home' && (
        <>
          <Tabs tabs={HOME_TABS} active={homeTab} onChange={setHomeTab} />
          {homeTab === 'calendar' && <TaskCalendarPanel />}
          {homeTab === 'tasks' && (
            <>
              <p className="lead">子どもアプリのホームに出る「やること」の登録・並べ替えを行います</p>
              <TasksPanel />
            </>
          )}
          {homeTab === 'events' && <MilestonesPanel />}
        </>
      )}
      {area === 'kotoba' && <KotobaAdmin />}
    </div>
  )
}

// ことばナビの管理：問題・問題集・ふりがな辞書をまとめて読み込み、変更のたびに読み込み直す
function KotobaAdmin() {
  const [tab, setTab] = useState('list')
  const [data, setData] = useState({ questions: [], sets: [], history: [], furigana: [] })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [confirm, confirmModal] = useConfirm()
  const [notify, toastEl] = useToast()

  async function reloadAll() {
    const [questions, sets, history, furigana] = await Promise.all([fetchQuestions(), fetchQuestionSetsWithItems(), fetchFilterHistory(), fetchFuriganaEntries()])
    setData({ questions, sets, history, furigana })
    setCustomFurigana(furigana)
  }

  function load() {
    setLoading(true)
    setLoadError(false)
    reloadAll()
      .catch((e) => { console.error(e); setLoadError(true) })
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  // 変更のあと：読み込み直して、お知らせを出す
  async function changed(message) {
    await reloadAll()
    if (message) notify(message, 'success')
  }

  // 失敗したら、画面にお知らせを出す（未処理の例外で止まらないように）
  const safely = (fn) => async (...args) => {
    try {
      await fn(...args)
    } catch (e) {
      console.error(e)
      notify(`うまくいきませんでした：${e.message}`)
    }
  }

  const { questions, sets, history, furigana } = data
  const books = useMemo(() => uniqueValues(questions.map((q) => q.source_book)), [questions])
  const categories = useMemo(() => uniqueValues(questions.map((q) => q.category)), [questions])
  const types = useMemo(() => uniqueValues(questions.map((q) => q.answer_type)), [questions])
  const filterOptions = { questions, books, categories, types }

  if (loading) return <LoadingView />
  if (loadError) return <ErrorView onRetry={load} />

  return (
    <>
      <p className="lead">問題の登録・成績確認・問題集の作成を行います</p>
      <Tabs tabs={KOTOBA_TABS} active={tab} onChange={setTab} />

      {tab === 'list' && <ListPanel {...filterOptions} onChanged={changed} />}
      {tab === 'preview' && <PreviewPanel {...filterOptions} sets={sets} furiganaEntries={furigana} onChanged={changed} />}
      {tab === 'make' && (
        <MakePanel {...filterOptions} onSaved={async (name, count) => { await changed(`「${name}」を作成しました（${count}問）`); setTab('sets') }} />
      )}
      {tab === 'sets' && (
        <SetsPanel
          sets={sets}
          questions={questions}
          onDelete={safely(async (set) => {
            if (!(await confirm(`「${set.name}」を削除しますか？\n（問題データ自体は削除されません。問題集の紐付けのみ削除されます）`))) return
            await deleteQuestionSet(set.id)
            await changed(`「${set.name}」を削除しました`)
          })}
          onReorder={safely(async (orderedIds) => { await reorderQuestionSets(orderedIds); await changed() })}
          onEdit={safely(async (set, patch) => { await updateQuestionSet(set.id, patch); await changed(`「${patch.name}」を更新しました`) })}
          onToggleReviewed={safely(async (set, reviewed) => { await updateQuestionSet(set.id, { reviewed }); await changed() })}
        />
      )}
      {tab === 'history' && <HistoryPanel history={history} />}
      {tab === 'import' && <ImportPanel onImported={(count, summary) => changed(`${count}問を追加しました（${summary}）`)} />}
      {tab === 'furigana' && <FuriganaPanel entries={furigana} onChanged={changed} />}

      {toastEl}
      {confirmModal}
    </>
  )
}

function HistoryPanel({ history }) {
  return (
    <div className="card">
      <h2>抽出条件の履歴</h2>
      {history.length === 0 && <div className="empty">まだ抽出条件の履歴はありません</div>}
      {history.map((h) => (
        <div className="history-item" key={h.id}>
          <div>
            <div><b>{h.name}</b></div>
            <div className="history-cond">{h.result_count}問（{new Date(h.created_at).toLocaleString('ja-JP')}）</div>
          </div>
        </div>
      ))}
    </div>
  )
}
