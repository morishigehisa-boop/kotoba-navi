const ITEMS = [
  { key: 'home', icon: '🏠', label: 'ホーム' },
  { key: 'kotoba', icon: '📚', label: 'ことば' },
  { key: 'sansu', icon: '🔢', label: 'さんすう' },
  { key: 'record', icon: '📊', label: 'きろく' },
  { key: 'shop', icon: '🛍️', label: 'ショップ' }
]

// どの画面でも同じ位置に出る、共通のメニュー（学習中は非表示）
export default function BottomNav({ active, onSelect }) {
  return (
    <nav className="bottom-nav" aria-label="メニュー">
      {ITEMS.map((item) => (
        <button
          key={item.key}
          className={`nav-item ${active === item.key ? 'active' : ''}`}
          aria-current={active === item.key ? 'page' : undefined}
          onClick={() => onSelect(item.key)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
