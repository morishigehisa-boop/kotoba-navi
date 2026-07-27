import { itemsForCharacter, CHARACTERS, isItemOwned, ownedCountForCharacter } from '../../lib/gamification'

export default function ShopScreen({
  points, ownedItems, equippedItem, activeCharacter, unlockedCharacters,
  onPurchase, onEquip, onSwitchCharacter, onBack
}) {
  const items = itemsForCharacter(activeCharacter)
  const ownedCount = ownedCountForCharacter(ownedItems, activeCharacter)

  return (
    <div>
      <div className="card" style={{ alignItems: 'stretch' }}>
        <div className="label">ショップ</div>
        <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 4 }}>
          <div className="hint" style={{ marginTop: 0 }}>いま持っている ポイント</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--purple)' }}>⭐ {points}</div>
        </div>

        <div className="char-switcher">
          {CHARACTERS.map((c) => {
            const unlocked = unlockedCharacters.includes(c.id)
            const active = activeCharacter === c.id
            return (
              <button
                key={c.id}
                className={`char-chip ${active ? 'char-chip-active' : ''} ${!unlocked ? 'char-chip-locked' : ''}`}
                disabled={!unlocked}
                onClick={() => onSwitchCharacter(c.id)}
              >
                <span className="char-chip-emoji">{unlocked ? c.emoji : '🔒'}</span>
                <span className="char-chip-name">{c.name}</span>
              </button>
            )
          })}
        </div>
        <div className="hint" style={{ marginTop: 8 }}>
          「{CHARACTERS.find((c) => c.id === activeCharacter)?.name}」のアイテム：{ownedCount}/{items.length}こ 集めた
          {ownedCount >= items.length && ' 🎉 コンプリート！'}
        </div>

        {equippedItem && (
          <button className="shop-unequip" onClick={() => onEquip(null)}>
            今の 着せ替えを はずす
          </button>
        )}

        <div className="shop-grid">
          {items.map((item) => {
            const owned = isItemOwned(ownedItems, activeCharacter, item.id)
            const equipped = equippedItem === item.id
            return (
              <div key={item.id} className={`shop-item ${equipped ? 'equipped' : ''}`}>
                <div className="shop-item-emoji">{item.emoji}</div>
                <div className="shop-item-name">{item.name}</div>
                {owned ? (
                  <button
                    className={`shop-btn ${equipped ? 'shop-btn-equipped' : ''}`}
                    onClick={() => onEquip(item.id)}
                    disabled={equipped}
                  >
                    {equipped ? 'そうびちゅう' : 'そうびする'}
                  </button>
                ) : (
                  <button
                    className="shop-btn"
                    disabled={points < item.cost}
                    onClick={() => onPurchase(item)}
                  >
                    ⭐{item.cost} で買う
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <button className="restart pick-another" onClick={onBack}>もどる</button>
    </div>
  )
}
