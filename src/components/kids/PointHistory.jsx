import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const PAGE = 50 // 1回に読む件数（Supabaseの1,000行上限を超えないよう、range で区切る）
const SOURCE_LABEL = { kotoba: 'ことばナビ', sansu: 'さんすう', task: 'やること', bonus: 'ボーナス', mission: 'ミッション', other: 'そのほか' }

const dayOf = (iso) => new Date(iso).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', weekday: 'short' })
const timeOf = (iso) => new Date(iso).toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' })

// ポイントが「いつ・なにで・いくつ」増えた（減った）かの一覧。ひらいたときだけ読み込む
export default function PointHistory() {
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  async function loadMore(from = rows.length) {
    setLoading(true)
    setFailed(false)
    const { data, error } = await supabase
      .from('point_logs')
      .select('id, source, delta, label, created_at')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(from, from + PAGE - 1)
    setLoading(false)
    if (error) { console.error(error); setFailed(true); return }
    setRows((prev) => (from === 0 ? data : [...prev, ...data]))
    setHasMore(data.length === PAGE)
  }

  function toggleOpen() {
    const next = !open
    setOpen(next)
    if (next && rows.length === 0) loadMore(0)
  }

  // 日ごとにまとめる（新しい順のまま）
  const groups = []
  for (const r of rows) {
    const day = dayOf(r.created_at)
    const last = groups[groups.length - 1]
    if (last && last.day === day) last.items.push(r)
    else groups.push({ day, items: [r] })
  }

  return (
    <div className="point-history">
      <button className="point-history-toggle" onClick={toggleOpen} aria-expanded={open}>
        <span>⭐ ポイントのきろく</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="point-history-body">
          {groups.map((g) => (
            <div key={g.day}>
              <div className="point-history-day">
                {g.day}<span>{g.items.reduce((s, r) => s + r.delta, 0) > 0 ? '+' : ''}{g.items.reduce((s, r) => s + r.delta, 0)}pt</span>
              </div>
              {g.items.map((r) => (
                <div key={r.id} className="point-history-row">
                  <span className="point-history-time">{timeOf(r.created_at)}</span>
                  <span className="point-history-label">{r.label || SOURCE_LABEL[r.source] || 'ポイント'}</span>
                  <span className={`point-history-delta ${r.delta < 0 ? 'minus' : ''}`}>{r.delta > 0 ? '+' : ''}{r.delta}</span>
                </div>
              ))}
            </div>
          ))}
          {!loading && !failed && rows.length === 0 && <div className="point-history-empty">まだきろくがないよ</div>}
          {failed && <div className="point-history-empty">読みこめなかったよ。もう一度ひらいてみてね</div>}
          {loading && <div className="point-history-empty">読みこみ中…</div>}
          {!loading && hasMore && rows.length > 0 && (
            <button className="point-history-more" onClick={() => loadMore()}>もっと見る</button>
          )}
        </div>
      )}
    </div>
  )
}
