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
    case 'jungle':
      return (<><path d="M0 90 Q30 80 60 90 T100 90 V100 H0 Z" fill="#2E5C24" /><path d="M10 60 Q6 40 16 30 Q20 45 14 60 Z" fill="#4E8A3E" /><path d="M85 55 Q92 35 82 24 Q78 42 84 55 Z" fill="#4E8A3E" /><path d="M45 65 Q40 45 50 32 Q56 50 52 65 Z" fill="#5FA84E" /></>)
    case 'pond':
      return (<><ellipse cx="50" cy="82" rx="46" ry="14" fill="#5FB0C4" /><ellipse cx="50" cy="82" rx="46" ry="14" fill="none" stroke="#3A8A9E" strokeWidth="1.5" opacity="0.5" /><ellipse cx="30" cy="60" rx="8" ry="4" fill="#4E8A3E" /><ellipse cx="72" cy="66" rx="7" ry="3.5" fill="#4E8A3E" /><circle cx="55" cy="76" r="3" fill="#FBEEDA" /></>)
    case 'park':
      return (<><path d="M0 82 Q30 74 60 82 T100 82 V100 H0 Z" fill="#7CB84E" /><ellipse cx="24" cy="55" rx="12" ry="14" fill="#5FA23A" /><rect x="22.5" y="66" width="3" height="14" fill="#8A6D2A" /><rect x="12" y="68" width="16" height="3" fill="#8A5A2A" /><rect x="10" y="68" width="4" height="10" fill="#8A5A2A" /><rect x="26" y="68" width="4" height="10" fill="#8A5A2A" /></>)
    case 'space':
      return (<><circle cx="20" cy="25" r="1.4" fill="#fff" opacity="0.9" /><circle cx="40" cy="15" r="1" fill="#fff" opacity="0.7" /><circle cx="70" cy="20" r="1.6" fill="#fff" opacity="0.9" /><circle cx="85" cy="40" r="1" fill="#fff" opacity="0.7" /><circle cx="15" cy="55" r="1.2" fill="#fff" opacity="0.8" /><circle cx="60" cy="60" r="14" fill="#8A5CD9" /><ellipse cx="60" cy="60" rx="22" ry="5" fill="none" stroke="#B76CE8" strokeWidth="1.5" opacity="0.7" transform="rotate(-20 60 60)" /></>)
    case 'moon':
      return (<><circle cx="50" cy="55" r="26" fill="#D8D4E0" /><circle cx="40" cy="46" r="4" fill="#B8B4C4" opacity="0.7" /><circle cx="58" cy="60" r="6" fill="#B8B4C4" opacity="0.7" /><circle cx="62" cy="42" r="3" fill="#B8B4C4" opacity="0.7" /><circle cx="15" cy="20" r="1.2" fill="#fff" opacity="0.8" /><circle cx="85" cy="25" r="1" fill="#fff" opacity="0.7" /></>)
    case 'sun':
      return (<><circle cx="50" cy="55" r="22" fill="#FFC542" />{[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (<line key={deg} x1={50 + 26 * Math.cos((deg * Math.PI) / 180)} y1={55 + 26 * Math.sin((deg * Math.PI) / 180)} x2={50 + 34 * Math.cos((deg * Math.PI) / 180)} y2={55 + 34 * Math.sin((deg * Math.PI) / 180)} stroke="#FF9E45" strokeWidth="3" strokeLinecap="round" />))}</>)
    case 'star':
      return (<><circle cx="20" cy="25" r="1.4" fill="#fff" opacity="0.8" /><circle cx="75" cy="18" r="1" fill="#fff" opacity="0.7" /><circle cx="85" cy="50" r="1.2" fill="#fff" opacity="0.8" /><path d="M50 30 L56 46 L73 46 L59 56 L64 73 L50 62 L36 73 L41 56 L27 46 L44 46 Z" fill="#FFE9A0" stroke="#FFC542" strokeWidth="1" /></>)
    default:
      return null
  }
}

export default function RoomBackground({ themeId, height = 130, children }) {
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
      {children}
    </div>
  )
}
