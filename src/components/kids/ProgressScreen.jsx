import { boxOf } from '../../lib/today'
import { categoryProgress } from '../../lib/gamification'

const BOX_META = [
  { box: 0, label: 'まだ これから', color: '#EFE3CB', textColor: '#8A7B62' },
  { box: 1, label: '1かい せいかい', color: '#FFD9A0', textColor: '#B5670E' },
  { box: 2, label: '2れんぞく せいかい', color: '#FFB86B', textColor: '#A85200' },
  { box: 3, label: '3れんぞく せいかい', color: '#FF9A45', textColor: '#8C3E00' },
  { box: 4, label: '🌟 かんぺき！', color: '#FF8A3D', textColor: '#7A3300' }
]

export default function ProgressScreen({ questions, onBack }) {
  const total = questions.length
  const counts = BOX_META.map((m) => questions.filter((q) => boxOf(q) === m.box).length)
  const masteredCount = counts[4]
  const masteredRate = total > 0 ? Math.round((masteredCount / total) * 100) : 0
  const categories = categoryProgress(questions)

  return (
    <div>
      <div className="card" style={{ alignItems: 'stretch' }}>
        <div className="label">がんばりグラフ</div>
        <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 6 }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--fox-dark)' }}>{masteredRate}%</div>
          <div className="hint" style={{ marginTop: 0 }}>ぜんぶで {total}問中 {masteredCount}問が かんぺき！</div>
        </div>

        <div style={{ marginTop: 18 }}>
          {BOX_META.map((m, i) => {
            const count = counts[i]
            const pct = total > 0 ? Math.round((count / total) * 100) : 0
            return (
              <div key={m.box} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 4 }}>
                  <span>{m.label}</span>
                  <span>{count}問</span>
                </div>
                <div style={{ height: 18, background: '#F3EEDF', borderRadius: 10, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.max(pct, count > 0 ? 4 : 0)}%`,
                      background: m.color,
                      borderRadius: 10,
                      transition: 'width .5s ease'
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card" style={{ alignItems: 'stretch' }}>
        <div className="label">バッジ</div>
        <div className="hint" style={{ marginTop: 20 }}>カテゴリーごとに 30%でどう、60%でぎん、100%できん！</div>
        <div className="badge-row">
          {categories.map((c) => (
            <div className="category-badge" key={c.category}>
              <div className="medal">{c.tier ? c.tier.emoji : '⬜'}</div>
              <div className="cat-name">{c.category}</div>
              <div className="cat-rate">{c.rate}%</div>
            </div>
          ))}
        </div>
      </div>

      <button className="restart pick-another" onClick={onBack}>もどる</button>
    </div>
  )
}
