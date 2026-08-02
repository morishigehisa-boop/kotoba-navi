import { itemsForCharacter, CHARACTERS, isItemOwned, ownedCountForCharacter, STAGE_THEMES } from '../../lib/gamification'
import RoomBackground from './RoomBackground'

export default function ShopScreen({
  points, ownedItems, equippedItem, activeCharacter, unlockedCharacters,
  unlockedBackgrounds, activeBackground,
  onPurchase, onEquip, onSwitchCharacter, onEquipBackground, onBack
}) {
  const items = itemsForCharacter(activeCharacter)
  const ownedCount = ownedCountForCharacter(ownedItems, activeCharacter)
  const nextUpId = CHARACTERS.find((c) => !unlockedCharacters.includes(c.id))?.id

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
            const isNextUp = !unlocked && c.id === nextUpId
            return (
              <button
                key={c.id}
                className={`char-chip ${active ? 'char-chip-active' : ''} ${!unlocked ? 'char-chip-locked' : ''} ${isNextUp ? 'char-chip-nextup' : ''}`}
                disabled={!unlocked}
                onClick={() => onSwitchCharacter(c.id)}
              >
                <span className={`char-chip-emoji ${isNextUp ? 'char-chip-silhouette' : ''}`}>
                  {unlocked ? c.emoji : isNextUp ? c.emoji : '🔒'}
                </span>
                <span className="char-chip-name">{unlocked ? c.name : isNextUp ? 'つぎは これ！' : '？？？'}</span>
              </button>
            )
          })}
        </div>
        {nextUpId && (
          <div className="hint" style={{ marginTop: 4 }}>
            「{CHARACTERS.find((c) => c.id === activeCharacter)?.name}」のアイテムを あと{items.length - ownedCount}こ 集めると、次のキャラが かいほうされるよ！
          </div>
        )}
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

      <div className="card" style={{ alignItems: 'stretch' }}>
        <div className="label">部屋の背景</div>
        <div className="hint" style={{ marginTop: 20 }}>すごろくマップでステージが かわるたびに、新しい背景をゲットできるよ！</div>
        <div className="room-grid">
          {STAGE_THEMES.map((theme) => {
            const unlocked = unlockedBackgrounds.includes(theme.id)
            const equipped = activeBackground === theme.id
            return (
              <button
                key={theme.id}
                className={`room-option ${equipped ? 'equipped' : ''} ${!unlocked ? 'locked' : ''}`}
                disabled={!unlocked}
                onClick={() => onEquipBackground(equipped ? null : theme.id)}
              >
                {unlocked ? <RoomBackground themeId={theme.id} height={70} /> : <div style={{ height: 70, background: '#EDEAE0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🔒</div>}
                <div className="room-option-name">{unlocked ? theme.name : '？？？'}</div>
              </button>
            )
          })}
        </div>
      </div>

      <button className="restart pick-another" onClick={onBack}>もどる</button>
    </div>
  )
}
