import { STAGE_THEMES } from '../../lib/gamification'

// 画像ファイルは使わず、テーマごとの簡単なシルエットをCSS/SVGで描く（コストゼロ）
function Decor({ themeId }) {
  switch (themeId) {
    case 'coast':
      return (<><path d="M0 70 Q15 65 30 70 T60 70 T100 70 V100 H0 Z" fill="#E8D48A" /><path d="M0 66 Q15 62 30 66 T60 66 T100 66" fill="none" stroke="#4FB6E8" strokeWidth="2" opacity="0.6" /></>)
    case 'mountain':
      return (<><path d="M0 78 L20 45 L35 62 L52 35 L70 60 L85 48 L100 78 Z" fill="#7A8F72" /><path d="M35 40 L40 50 L30 50 Z" fill="#fff" opacity="0.85" /><path d="M52 30 L58 40 L46 40 Z" fill="#fff" opacity="0.85" /></>)
    case 'grassland':
      return (<><path d="M0 80 Q25 68 50 80 T100 80 V100 H0 Z" fill="#7CB84E" /><circle cx="20" cy="55" r="6" fill="#fff" opacity="0.8" /><circle cx="70" cy="48" r="5" fill="#fff" opacity="0.7" /></>)
    case 'monument_valley':
      return (<><rect x="10" y="45" width="14" height="35" fill="#A85236" /><rect x="7" y="40" width="20" height="7" fill="#A85236" /><rect x="55" y="35" width="18" height="45" fill="#C97A4A" /><rect x="51" y="30" width="26" height="7" fill="#C97A4A" /></>)
    case 'desert':
      return (<><path d="M0 82 Q20 70 40 82 T80 82 T100 78 V100 H0 Z" fill="#D9A85C" /><path d="M60 78 Q65 68 70 78" fill="#C99A4A" /></>)
    case 'countryside':
      return (<><rect x="15" y="60" width="18" height="18" fill="#F0DDBB" /><path d="M12 60 L24 48 L36 60 Z" fill="#C9741E" /><rect x="55" y="55" width="20" height="23" fill="#FBEEDA" /><path d="M52 55 L65 42 L78 55 Z" fill="#A85236" /></>)
    case 'city':
      return (<><rect x="10" y="35" width="16" height="45" fill="#8E97A6" /><rect x="30" y="50" width="14" height="30" fill="#7A8494" /><rect x="48" y="25" width="18" height="55" fill="#5A6478" /><rect x="70" y="42" width="15" height="38" fill="#8E97A6" /></>)
    case 'sky':
      return (<><ellipse cx="25" cy="35" rx="16" ry="8" fill="#fff" opacity="0.9" /><ellipse cx="65" cy="25" rx="20" ry="9" fill="#fff" opacity="0.85" /><ellipse cx="80" cy="55" rx="14" ry="7" fill="#fff" opacity="0.8" /></>)
    case 'fuji':
      return (<><path d="M20 80 L50 25 L80 80 Z" fill="#7C93B0" /><path d="M40 45 L50 25 L60 45 Q50 40 40 45 Z" fill="#fff" /></>)
    case 'swamp':
      return (<><path d="M0 85 Q30 78 60 85 T100 85 V100 H0 Z" fill="#3A4E36" /><rect x="20" y="55" width="3" height="30" fill="#2E3D28" /><rect x="70" y="50" width="3" height="35" fill="#2E3D28" /><ellipse cx="21" cy="53" rx="7" ry="3" fill="#4E6B4A" /><ellipse cx="71" cy="48" rx="7" ry="3" fill="#4E6B4A" /></>)
    default:
      return null
  }
}

export default function RoomBackground({ themeId, height = 130 }) {
  const theme = STAGE_THEMES.find((t) => t.id === themeId) || STAGE_THEMES[0]
  return (
    <div
      className="room-bg"
      style={{
        height,
        background: `linear-gradient(180deg, ${theme.sky[0]}, ${theme.sky[1]})`
      }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="room-bg-svg">
        <Decor themeId={theme.id} />
      </svg>
    </div>
  )
}
