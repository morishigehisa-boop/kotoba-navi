// 子ども画面の、まん中に出るお知らせ（お祝い・確認）。外側をタップすると onClose
// actions: [{ label, onClick, secondary }]（secondary は紫のボタン）
export default function ModalCard({ emoji, label, hint, actions, onClose }) {
  return (
    <div className="milestone-backdrop" onClick={onClose}>
      <div className="milestone-card" onClick={(e) => e.stopPropagation()}>
        <div className="milestone-emoji">{emoji}</div>
        <div className="milestone-label">{label}</div>
        {hint && <div className="hint">{hint}</div>}
        {actions.map((a) => (
          <button key={a.label} className={`restart ${a.secondary ? 'pick-another' : ''}`} onClick={a.onClick}>{a.label}</button>
        ))}
      </div>
    </div>
  )
}

// 学習の途中でやめるときの確認
export function QuitConfirm({ hint, onCancel, onQuit }) {
  return (
    <ModalCard
      emoji="🤔"
      label="途中でやめますか？"
      hint={hint}
      onClose={onCancel}
      actions={[{ label: '続ける', onClick: onCancel }, { label: 'やめる', onClick: onQuit, secondary: true }]}
    />
  )
}
