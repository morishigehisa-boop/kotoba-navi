const FOX_IDLE = (
  <svg viewBox="0 0 100 100">
    <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
    <path d="M50 20 L20 45 L35 50 Z" fill="#FF8A3D" />
    <path d="M50 20 L80 45 L65 50 Z" fill="#FF8A3D" />
    <path d="M50 22 L30 44 L36 47 Z" fill="#FFE3C6" />
    <path d="M50 22 L70 44 L64 47 Z" fill="#FFE3C6" />
    <ellipse cx="50" cy="60" rx="30" ry="26" fill="#FF8A3D" />
    <ellipse cx="50" cy="68" rx="16" ry="13" fill="#FFF3E1" />
    <circle cx="40" cy="55" r="4" fill="#3A2E1E" />
    <circle cx="60" cy="55" r="4" fill="#3A2E1E" />
    <path d="M46 66 Q50 70 54 66" stroke="#3A2E1E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <ellipse cx="50" cy="63" rx="3" ry="2" fill="#3A2E1E" />
  </svg>
)

const FOX_HAPPY = (
  <svg viewBox="0 0 100 100">
    <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
    <path d="M50 18 L18 42 L33 48 Z" fill="#FF8A3D" />
    <path d="M50 18 L82 42 L67 48 Z" fill="#FF8A3D" />
    <path d="M50 20 L28 41 L34 44 Z" fill="#FFE3C6" />
    <path d="M50 20 L72 41 L66 44 Z" fill="#FFE3C6" />
    <ellipse cx="50" cy="60" rx="31" ry="27" fill="#FF8A3D" />
    <ellipse cx="50" cy="68" rx="16" ry="13" fill="#FFF3E1" />
    <path d="M34 53 Q40 47 46 53" stroke="#3A2E1E" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M54 53 Q60 47 66 53" stroke="#3A2E1E" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M42 65 Q50 76 58 65" stroke="#3A2E1E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="34" cy="63" r="4" fill="#FFB3A0" opacity="0.7" />
    <circle cx="66" cy="63" r="4" fill="#FFB3A0" opacity="0.7" />
  </svg>
)

const FOX_SAD = (
  <svg viewBox="0 0 100 100">
    <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
    <path d="M50 24 L22 46 L35 50 Z" fill="#FF8A3D" />
    <path d="M50 24 L78 46 L65 50 Z" fill="#FF8A3D" />
    <ellipse cx="50" cy="62" rx="29" ry="25" fill="#FF8A3D" />
    <ellipse cx="50" cy="70" rx="15" ry="12" fill="#FFF3E1" />
    <path d="M37 58 Q40 55 44 58" stroke="#3A2E1E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M56 58 Q60 55 63 58" stroke="#3A2E1E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M45 72 Q50 68 55 72" stroke="#3A2E1E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
)

export default function Fox({ state, accessory }) {
  const cls = state === 'happy' ? 'fox happy' : state === 'sad' ? 'fox sad' : 'fox'
  const svg = state === 'happy' ? FOX_HAPPY : state === 'sad' ? FOX_SAD : FOX_IDLE
  return (
    <div className={cls}>
      {svg}
      {accessory && <span className="fox-accessory">{accessory}</span>}
    </div>
  )
}
