// ============================================================
// キャラクター本体（表情はidle/happy/sadの3種、より大げさに）
// アクセサリーは同じviewBox(0 0 100 100)上の正しい部位に重ねて描画する
// ============================================================

// ---- きつね ----
const FOX_BODY = {
  idle: (
    <>
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
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M50 14 L14 40 L31 47 Z" fill="#FF8A3D" />
      <path d="M50 14 L86 40 L69 47 Z" fill="#FF8A3D" />
      <path d="M50 17 L25 39 L32 43 Z" fill="#FFE3C6" />
      <path d="M50 17 L75 39 L68 43 Z" fill="#FFE3C6" />
      <ellipse cx="50" cy="60" rx="33" ry="29" fill="#FF8A3D" />
      <ellipse cx="50" cy="69" rx="17" ry="14" fill="#FFF3E1" />
      <path d="M31 54 Q40 44 49 54" stroke="#3A2E1E" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M51 54 Q60 44 69 54" stroke="#3A2E1E" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M37 64 Q50 82 63 64" stroke="#3A2E1E" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="71" rx="7" ry="4" fill="#B5432A" opacity="0.55" />
      <circle cx="30" cy="63" r="5.5" fill="#FFB3A0" opacity="0.8" />
      <circle cx="70" cy="63" r="5.5" fill="#FFB3A0" opacity="0.8" />
      <path d="M14 30 L18 36 M86 30 L82 36 M50 6 L50 13" stroke="#FFC53D" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M50 26 L24 47 L36 51 Z" fill="#FF8A3D" />
      <path d="M50 26 L76 47 L64 51 Z" fill="#FF8A3D" />
      <ellipse cx="50" cy="63" rx="28" ry="24" fill="#FF8A3D" />
      <ellipse cx="50" cy="71" rx="15" ry="12" fill="#FFF3E1" />
      <path d="M35 60 Q40 55 46 59" stroke="#3A2E1E" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M65 60 Q60 55 54 59" stroke="#3A2E1E" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="39" cy="63" r="3" fill="#3A2E1E" />
      <circle cx="61" cy="63" r="3" fill="#3A2E1E" />
      <path d="M39 68 Q39 75 37 79" stroke="#7EC8F2" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="37" cy="80" rx="2.3" ry="3" fill="#7EC8F2" />
      <path d="M44 76 Q50 71 56 76" stroke="#3A2E1E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  )
}

// ---- ねこ ----
const CAT_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M32 22 L26 46 L42 44 Z" fill="#A9A6BE" />
      <path d="M68 22 L74 46 L58 44 Z" fill="#A9A6BE" />
      <path d="M33 28 L29 43 L40 42 Z" fill="#FFD6E6" />
      <path d="M67 28 L71 43 L60 42 Z" fill="#FFD6E6" />
      <ellipse cx="50" cy="60" rx="29" ry="25" fill="#A9A6BE" />
      <ellipse cx="50" cy="68" rx="16" ry="12" fill="#F4F1EE" />
      <circle cx="40" cy="55" r="4" fill="#3A2E1E" />
      <circle cx="60" cy="55" r="4" fill="#3A2E1E" />
      <path d="M50 61 L47 65 L53 65 Z" fill="#FF9EB5" />
      <path d="M46 67 Q50 70 54 67" stroke="#3A2E1E" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M20 58 L34 60 M20 63 L34 63 M20 68 L34 66" stroke="#8A8698" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M80 58 L66 60 M80 63 L66 63 M80 68 L66 66" stroke="#8A8698" strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M30 16 L22 44 L40 42 Z" fill="#A9A6BE" />
      <path d="M70 16 L78 44 L60 42 Z" fill="#A9A6BE" />
      <path d="M31 23 L25 41 L38 40 Z" fill="#FFD6E6" />
      <path d="M69 23 L75 41 L62 40 Z" fill="#FFD6E6" />
      <ellipse cx="50" cy="60" rx="32" ry="28" fill="#A9A6BE" />
      <ellipse cx="50" cy="69" rx="17" ry="13" fill="#F4F1EE" />
      <path d="M31 54 Q40 44 49 54" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M51 54 Q60 44 69 54" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M50 61 L46 66 L54 66 Z" fill="#FF9EB5" />
      <path d="M38 68 Q50 84 62 68" stroke="#3A2E1E" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="64" r="5.5" fill="#FFB3A0" opacity="0.8" />
      <circle cx="70" cy="64" r="5.5" fill="#FFB3A0" opacity="0.8" />
      <path d="M16 54 L32 59 M16 60 L32 61 M16 66 L32 64" stroke="#8A8698" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M84 54 L68 59 M84 60 L68 61 M84 66 L68 64" stroke="#8A8698" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M14 26 L18 32 M86 26 L82 32" stroke="#FFC53D" strokeWidth="2.3" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M34 28 L30 48 L43 46 Z" fill="#A9A6BE" />
      <path d="M66 28 L70 48 L57 46 Z" fill="#A9A6BE" />
      <ellipse cx="50" cy="63" rx="27" ry="23" fill="#A9A6BE" />
      <ellipse cx="50" cy="71" rx="15" ry="11" fill="#F4F1EE" />
      <path d="M35 60 Q39 56 45 59" stroke="#3A2E1E" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M65 60 Q61 56 55 59" stroke="#3A2E1E" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="63" r="3" fill="#3A2E1E" />
      <circle cx="60" cy="63" r="3" fill="#3A2E1E" />
      <path d="M50 65 L47 69 L53 69 Z" fill="#FF9EB5" />
      <path d="M40 68 Q40 75 38 79" stroke="#7EC8F2" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="80" rx="2.2" ry="2.8" fill="#7EC8F2" />
      <path d="M45 76 Q50 72 55 76" stroke="#3A2E1E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
    </>
  )
}

// ---- いぬ ----
const DOG_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <ellipse cx="27" cy="42" rx="11" ry="18" fill="#C9975B" transform="rotate(-15 27 42)" />
      <ellipse cx="73" cy="42" rx="11" ry="18" fill="#C9975B" transform="rotate(15 73 42)" />
      <ellipse cx="50" cy="62" rx="29" ry="25" fill="#DBA96E" />
      <ellipse cx="50" cy="70" rx="17" ry="13" fill="#FBEEDA" />
      <circle cx="40" cy="57" r="4" fill="#3A2E1E" />
      <circle cx="60" cy="57" r="4" fill="#3A2E1E" />
      <ellipse cx="50" cy="66" rx="5" ry="3.5" fill="#3A2E1E" />
      <path d="M46 70 Q50 74 54 70" stroke="#3A2E1E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <ellipse cx="23" cy="38" rx="12.5" ry="20" fill="#C9975B" transform="rotate(-30 23 38)" />
      <ellipse cx="77" cy="38" rx="12.5" ry="20" fill="#C9975B" transform="rotate(30 77 38)" />
      <ellipse cx="50" cy="61" rx="33" ry="29" fill="#DBA96E" />
      <ellipse cx="50" cy="70" rx="18" ry="14" fill="#FBEEDA" />
      <path d="M30 53 Q40 44 50 53" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M50 53 Q60 44 70 53" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="65" rx="5.5" ry="4" fill="#3A2E1E" />
      <path d="M36 70 Q50 86 64 70" stroke="#3A2E1E" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M50 75 Q50 80 50 76" stroke="#FF98A8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="66" r="5.5" fill="#FFB3A0" opacity="0.8" />
      <circle cx="68" cy="66" r="5.5" fill="#FFB3A0" opacity="0.8" />
      <path d="M12 28 L17 34 M88 28 L83 34" stroke="#FFC53D" strokeWidth="2.3" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <ellipse cx="29" cy="47" rx="10" ry="17" fill="#C9975B" transform="rotate(-4 29 47)" />
      <ellipse cx="71" cy="47" rx="10" ry="17" fill="#C9975B" transform="rotate(4 71 47)" />
      <ellipse cx="50" cy="65" rx="28" ry="24" fill="#DBA96E" />
      <ellipse cx="50" cy="73" rx="16" ry="12" fill="#FBEEDA" />
      <path d="M35 60 Q39 56 44 59" stroke="#3A2E1E" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M65 60 Q61 56 56 59" stroke="#3A2E1E" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="69" rx="4.5" ry="3" fill="#3A2E1E" />
      <path d="M40 68 Q40 75 38 79" stroke="#7EC8F2" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="80" rx="2.2" ry="2.8" fill="#7EC8F2" />
      <path d="M45 76 Q50 72 55 76" stroke="#3A2E1E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
    </>
  )
}

// ---- ドラゴン ----
const DRAGON_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M37 12 L31 32 L45 28 Z" fill="#1A4A32" />
      <path d="M63 12 L69 32 L55 28 Z" fill="#1A4A32" />
      <path d="M16 54 Q2 48 7 63 Q14 61 22 58 Z" fill="#2E7A50" />
      <path d="M84 54 Q98 48 93 63 Q86 61 78 58 Z" fill="#2E7A50" />
      <ellipse cx="50" cy="62" rx="29" ry="25" fill="#245C3E" />
      <path d="M40 44 L44 34 L48 44 Z M52 44 L56 34 L60 44 Z" fill="#1A4A32" />
      <path d="M20 56 L25 59 M80 56 L75 59 M15 66 L21 67 M85 66 L79 67" stroke="#123322" strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="50" cy="72" rx="14" ry="9" fill="#5C8A6E" />
      <ellipse cx="40" cy="56" rx="5" ry="5.5" fill="#D9B84A" />
      <rect x="39" y="53.5" width="2.2" height="6" fill="#1A1A16" />
      <ellipse cx="60" cy="56" rx="5" ry="5.5" fill="#D9B84A" />
      <rect x="58.8" y="53.5" width="2.2" height="6" fill="#1A1A16" />
      <path d="M35 50 Q40 46 45 50 M55 50 Q60 46 65 50" stroke="#123322" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M40 69 L43 76 L46 68 L49 78 L52 68 L55 78 L58 68 L61 76 L64 69" fill="none" stroke="#123322" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M35 4 L28 28 L44 24 Z" fill="#1A4A32" />
      <path d="M65 4 L72 28 L56 24 Z" fill="#1A4A32" />
      <path d="M12 48 Q-6 40 2 60 Q11 57 20 53 Z" fill="#2E7A50" />
      <path d="M88 48 Q106 40 98 60 Q89 57 80 53 Z" fill="#2E7A50" />
      <ellipse cx="50" cy="60" rx="33" ry="29" fill="#245C3E" />
      <path d="M38 40 L43 28 L48 40 Z M52 40 L57 28 L62 40 Z" fill="#1A4A32" />
      <ellipse cx="50" cy="70" rx="16" ry="11" fill="#5C8A6E" />
      <path d="M28 51 Q40 39 50 50 Q60 39 72 51" stroke="#123322" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M30 64 L34 78 L40 64 L44 80 L50 63 L56 80 L60 64 L66 78 L70 64" fill="#7A2020" stroke="#123322" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 20 L12 28 M94 20 L88 28" stroke="#FF6F6F" strokeWidth="2.6" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M39 18 L34 36 L46 32 Z" fill="#1A4A32" />
      <path d="M61 18 L66 36 L54 32 Z" fill="#1A4A32" />
      <path d="M18 58 Q8 53 12 65 Q17 63 23 60 Z" fill="#2E7A50" />
      <path d="M82 58 Q92 53 88 65 Q83 63 77 60 Z" fill="#2E7A50" />
      <ellipse cx="50" cy="64" rx="28" ry="24" fill="#245C3E" />
      <ellipse cx="50" cy="73" rx="14" ry="9" fill="#5C8A6E" />
      <path d="M35 58 Q40 63 45 59" stroke="#123322" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M65 58 Q60 63 55 59" stroke="#1A1A16" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="40" cy="64" rx="3.6" ry="4" fill="#D9B84A" />
      <rect x="39.2" y="62" width="1.6" height="4.5" fill="#1A1A16" />
      <ellipse cx="60" cy="64" rx="3.6" ry="4" fill="#D9B84A" />
      <rect x="59.2" y="62" width="1.6" height="4.5" fill="#1A1A16" />
      <path d="M42 70 L45 76 L50 71 L55 76 L58 70" fill="none" stroke="#1A1A16" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M39 68 Q39 75 37 79" stroke="#7EC8F2" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <ellipse cx="37" cy="80" rx="2.2" ry="2.8" fill="#7EC8F2" />
    </>
  )
}

// ---- ライオン ----
const LION_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      {[...Array(13)].map((_, i) => {
        const a = (i / 13) * Math.PI * 2
        const x = 50 + Math.cos(a) * 32
        const y = 55 + Math.sin(a) * 32
        return <ellipse key={i} cx={x} cy={y} rx="8" ry="4.6" fill="#8C5A1E" transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />
      })}
      <ellipse cx="50" cy="58" rx="26" ry="23" fill="#D9962E" />
      <ellipse cx="50" cy="67" rx="14" ry="11" fill="#F2DBA0" />
      <ellipse cx="39" cy="53" rx="4" ry="4.6" fill="#8C5A1E" />
      <rect x="38.2" y="50.5" width="1.6" height="5" fill="#1A1A16" />
      <ellipse cx="61" cy="53" rx="4" ry="4.6" fill="#8C5A1E" />
      <rect x="60.2" y="50.5" width="1.6" height="5" fill="#1A1A16" />
      <path d="M32 49 Q39 45 46 49 M54 49 Q61 45 68 49" stroke="#5C3A12" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M38 68 L41 73 L45 68 L50 74 L55 68 L59 73 L62 68" fill="none" stroke="#3A2410" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 60 L27 63 M78 60 L73 63" stroke="#8C5A1E" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      {[...Array(15)].map((_, i) => {
        const a = (i / 15) * Math.PI * 2
        const x = 50 + Math.cos(a) * 35
        const y = 54 + Math.sin(a) * 35
        return <ellipse key={i} cx={x} cy={y} rx="9" ry="5" fill="#8C5A1E" transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />
      })}
      <ellipse cx="50" cy="57" rx="28" ry="25" fill="#D9962E" />
      <ellipse cx="50" cy="67" rx="16" ry="12" fill="#F2DBA0" />
      <path d="M30 50 Q40 40 50 50" stroke="#1A1A16" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M50 50 Q60 40 70 50" stroke="#1A1A16" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <ellipse cx="39" cy="55" rx="4.2" ry="5" fill="#8C5A1E" />
      <rect x="38.2" y="52" width="1.7" height="5.4" fill="#1A1A16" />
      <ellipse cx="61" cy="55" rx="4.2" ry="5" fill="#8C5A1E" />
      <rect x="60.2" y="52" width="1.7" height="5.4" fill="#1A1A16" />
      <path d="M32 66 L36 76 L42 66 L46 79 L50 65 L54 79 L58 66 L64 76 L68 66" fill="#7A2020" stroke="#1A1A16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 24 L15 30 M90 24 L85 30" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      {[...Array(12)].map((_, i) => {
        const a = (i / 12) * Math.PI * 2
        const x = 50 + Math.cos(a) * 28
        const y = 58 + Math.sin(a) * 28
        return <ellipse key={i} cx={x} cy={y} rx="7" ry="4" fill="#8C5A1E" transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />
      })}
      <ellipse cx="50" cy="61" rx="24" ry="21" fill="#D9962E" />
      <ellipse cx="50" cy="69" rx="13" ry="10" fill="#F2DBA0" />
      <path d="M35 57 Q40 63 45 58" stroke="#1A1A16" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M65 57 Q60 63 55 58" stroke="#1A1A16" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="40" cy="62" rx="3.2" ry="3.6" fill="#8C5A1E" />
      <rect x="39.2" y="60" width="1.5" height="4" fill="#1A1A16" />
      <ellipse cx="60" cy="62" rx="3.2" ry="3.6" fill="#8C5A1E" />
      <rect x="59.2" y="60" width="1.5" height="4" fill="#1A1A16" />
      <path d="M42 71 L45 76 L50 72 L54 76 L57 71" fill="none" stroke="#1A1A16" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 68 Q40 74 38 78" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="79" rx="2" ry="2.6" fill="#7EC8F2" />
    </>
  )
}

// ---- ブタ ----
const PIG_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <ellipse cx="30" cy="38" rx="8" ry="9" fill="#F2A9C4" />
      <ellipse cx="70" cy="38" rx="8" ry="9" fill="#F2A9C4" />
      <ellipse cx="50" cy="60" rx="29" ry="25" fill="#F2A9C4" />
      <ellipse cx="50" cy="68" rx="16" ry="12" fill="#FFE1EC" />
      <circle cx="40" cy="55" r="4" fill="#3A2E1E" />
      <circle cx="60" cy="55" r="4" fill="#3A2E1E" />
      <ellipse cx="50" cy="68" rx="8" ry="6" fill="#E88AAE" />
      <circle cx="46" cy="68" r="1.4" fill="#B5527A" />
      <circle cx="54" cy="68" r="1.4" fill="#B5527A" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <ellipse cx="28" cy="35" rx="9" ry="10" fill="#F2A9C4" />
      <ellipse cx="72" cy="35" rx="9" ry="10" fill="#F2A9C4" />
      <ellipse cx="50" cy="59" rx="32" ry="28" fill="#F2A9C4" />
      <ellipse cx="50" cy="68" rx="17" ry="13" fill="#FFE1EC" />
      <path d="M31 53 Q40 44 49 53" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M51 53 Q60 44 69 53" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="69" rx="9" ry="6.5" fill="#E88AAE" />
      <circle cx="46" cy="69" r="1.5" fill="#B5527A" />
      <circle cx="54" cy="69" r="1.5" fill="#B5527A" />
      <path d="M38 76 Q50 84 62 76" stroke="#3A2E1E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="64" r="5.5" fill="#FF9EB5" opacity="0.85" />
      <circle cx="70" cy="64" r="5.5" fill="#FF9EB5" opacity="0.85" />
      <path d="M14 28 L18 34 M86 28 L82 34" stroke="#FFC53D" strokeWidth="2.3" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <ellipse cx="32" cy="42" rx="7.5" ry="8.5" fill="#F2A9C4" />
      <ellipse cx="68" cy="42" rx="7.5" ry="8.5" fill="#F2A9C4" />
      <ellipse cx="50" cy="63" rx="27" ry="23" fill="#F2A9C4" />
      <ellipse cx="50" cy="71" rx="15" ry="11" fill="#FFE1EC" />
      <path d="M35 59 Q39 56 44 59" stroke="#3A2E1E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M65 59 Q61 56 56 59" stroke="#3A2E1E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="62" r="2.8" fill="#3A2E1E" />
      <circle cx="60" cy="62" r="2.8" fill="#3A2E1E" />
      <ellipse cx="50" cy="72" rx="7" ry="5" fill="#E88AAE" />
      <circle cx="47" cy="72" r="1.2" fill="#B5527A" /><circle cx="53" cy="72" r="1.2" fill="#B5527A" />
      <path d="M40 67 Q40 73 38 77" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="78" rx="2" ry="2.6" fill="#7EC8F2" />
    </>
  )
}

// ---- チーター ----
const CHEETAH_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M31 24 L26 42 L38 42 Z" fill="#E8C177" />
      <path d="M69 24 L74 42 L62 42 Z" fill="#E8C177" />
      <ellipse cx="50" cy="60" rx="29" ry="25" fill="#E8C177" />
      <ellipse cx="50" cy="68" rx="16" ry="12" fill="#FFF6E4" />
      <path d="M36 51 Q34 58 37 63" stroke="#3A2E1E" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M64 51 Q66 58 63 63" stroke="#3A2E1E" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.7" />
      <circle cx="40" cy="55" r="4" fill="#3A2E1E" />
      <circle cx="60" cy="55" r="4" fill="#3A2E1E" />
      <path d="M46 66 Q50 70 54 66" stroke="#3A2E1E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="46" r="2" fill="#8A6B33" /><circle cx="68" cy="48" r="2" fill="#8A6B33" />
      <circle cx="24" cy="60" r="2" fill="#8A6B33" /><circle cx="76" cy="60" r="2" fill="#8A6B33" />
      <circle cx="33" cy="72" r="2" fill="#8A6B33" /><circle cx="67" cy="72" r="2" fill="#8A6B33" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M29 18 L23 40 L38 39 Z" fill="#E8C177" />
      <path d="M71 18 L77 40 L62 39 Z" fill="#E8C177" />
      <ellipse cx="50" cy="59" rx="32" ry="28" fill="#E8C177" />
      <ellipse cx="50" cy="68" rx="17" ry="13" fill="#FFF6E4" />
      <path d="M34 50 Q32 58 36 64" stroke="#3A2E1E" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M66 50 Q68 58 64 64" stroke="#3A2E1E" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M31 53 Q40 44 49 53" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M51 53 Q60 44 69 53" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M38 68 Q50 84 62 68" stroke="#3A2E1E" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="64" r="5.5" fill="#FFB3A0" opacity="0.75" />
      <circle cx="70" cy="64" r="5.5" fill="#FFB3A0" opacity="0.75" />
      <circle cx="28" cy="46" r="2" fill="#8A6B33" /><circle cx="70" cy="48" r="2" fill="#8A6B33" />
      <circle cx="22" cy="62" r="2" fill="#8A6B33" /><circle cx="78" cy="62" r="2" fill="#8A6B33" />
      <path d="M12 26 L16 32 M88 26 L84 32" stroke="#FFC53D" strokeWidth="2.3" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M33 28 L29 46 L40 45 Z" fill="#E8C177" />
      <path d="M67 28 L71 46 L60 45 Z" fill="#E8C177" />
      <ellipse cx="50" cy="63" rx="27" ry="23" fill="#E8C177" />
      <ellipse cx="50" cy="71" rx="15" ry="11" fill="#FFF6E4" />
      <path d="M37 58 Q40 55 44 58" stroke="#3A2E1E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M63 58 Q60 55 56 58" stroke="#3A2E1E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="62" r="2.8" fill="#3A2E1E" />
      <circle cx="60" cy="62" r="2.8" fill="#3A2E1E" />
      <path d="M40 67 Q40 73 38 77" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="78" rx="2" ry="2.6" fill="#7EC8F2" />
      <path d="M45 74 Q50 71 55 74" stroke="#3A2E1E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  )
}

// ---- ロボット ----
const ROBOT_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <rect x="48" y="14" width="4" height="12" fill="#8B95A3" />
      <circle cx="50" cy="12" r="4" fill="#FF6F6F" />
      <rect x="26" y="38" width="10" height="16" rx="3" fill="#B0B7C0" />
      <rect x="64" y="38" width="10" height="16" rx="3" fill="#B0B7C0" />
      <rect x="24" y="34" width="52" height="48" rx="14" fill="#B0B7C0" />
      <rect x="34" y="46" width="32" height="24" rx="6" fill="#3A4552" />
      <rect x="38" y="53" width="6" height="6" fill="#5FD0F2" />
      <rect x="56" y="53" width="6" height="6" fill="#5FD0F2" />
      <rect x="42" y="62" width="16" height="3" fill="#5FD0F2" opacity="0.8" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <rect x="48" y="10" width="4" height="14" fill="#8B95A3" />
      <circle cx="50" cy="8" r="5" fill="#FFC53D" />
      <rect x="22" y="34" width="11" height="18" rx="3" fill="#B0B7C0" transform="rotate(-12 27 43)" />
      <rect x="67" y="34" width="11" height="18" rx="3" fill="#B0B7C0" transform="rotate(12 73 43)" />
      <rect x="20" y="30" width="60" height="54" rx="16" fill="#B0B7C0" />
      <rect x="30" y="43" width="40" height="28" rx="7" fill="#3A4552" />
      <rect x="35" y="51" width="8" height="8" fill="#5FD0F2" />
      <rect x="57" y="51" width="8" height="8" fill="#5FD0F2" />
      <rect x="38" y="63" width="24" height="4" rx="2" fill="#5FD0F2" />
      <path d="M12 24 L17 30 M88 24 L83 30" stroke="#FFC53D" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <rect x="48" y="18" width="4" height="10" fill="#8B95A3" />
      <circle cx="50" cy="16" r="3.5" fill="#7A8494" />
      <rect x="28" y="42" width="9" height="14" rx="3" fill="#B0B7C0" />
      <rect x="63" y="42" width="9" height="14" rx="3" fill="#B0B7C0" />
      <rect x="27" y="38" width="46" height="42" rx="12" fill="#B0B7C0" />
      <rect x="36" y="49" width="28" height="21" rx="5" fill="#3A4552" />
      <rect x="40" y="55" width="5" height="5" fill="#5FD0F2" opacity="0.6" />
      <rect x="55" y="55" width="5" height="5" fill="#5FD0F2" opacity="0.6" />
      <rect x="43" y="63" width="14" height="2.5" fill="#7A8494" />
      <path d="M42 78 L40 84" stroke="#5FD0F2" strokeWidth="2" strokeLinecap="round" />
    </>
  )
}

// ---- アンキロサウルス ----
const ANKY_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="28" ry="6" fill="#00000012" />
      <path d="M22 33 L32 16 L40 35 M60 35 L68 16 L78 33 M38 20 L44 6 L48 21 M52 21 L56 6 L62 20" fill="#3A4A28" />
      <ellipse cx="20" cy="59" rx="5.5" ry="4" fill="#3A4A28" /><ellipse cx="80" cy="59" rx="5.5" ry="4" fill="#3A4A28" />
      <ellipse cx="50" cy="62" rx="32" ry="24" fill="#5A6E3D" />
      <path d="M50 50 Q40 60 44 70 Q50 74 56 70 Q60 60 50 50 Z" fill="#40522A" opacity="0.7" />
      <path d="M20 55 L26 58 M80 55 L74 58 M15 65 L22 66 M85 65 L78 66" stroke="#2E3D22" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="50" cy="70" rx="16" ry="9" fill="#8A9C6A" />
      <path d="M30 53 Q38 48 44 53" stroke="#1A1A16" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M70 53 Q62 48 56 53" stroke="#1A1A16" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="57" rx="3" ry="3.6" fill="#D9C25A" />
      <rect x="37.2" y="55" width="1.5" height="4" fill="#1A1A16" />
      <ellipse cx="62" cy="57" rx="3" ry="3.6" fill="#D9C25A" />
      <rect x="61.2" y="55" width="1.5" height="4" fill="#1A1A16" />
      <path d="M40 70 L43 74 L47 70 L50 75 L53 70 L57 74 L60 70" fill="none" stroke="#1A1A16" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="28" ry="6" fill="#00000012" />
      <path d="M18 29 L30 10 L39 31 M61 31 L70 10 L82 29 M37 14 L44 -2 L49 15 M51 15 L56 -2 L63 14" fill="#3A4A28" />
      <ellipse cx="16" cy="57" rx="6" ry="4.5" fill="#3A4A28" /><ellipse cx="84" cy="57" rx="6" ry="4.5" fill="#3A4A28" />
      <ellipse cx="50" cy="60" rx="35" ry="27" fill="#5A6E3D" />
      <path d="M50 47 Q39 58 44 69 Q50 73 56 69 Q61 58 50 47 Z" fill="#40522A" opacity="0.7" />
      <ellipse cx="50" cy="69" rx="18" ry="11" fill="#8A9C6A" />
      <path d="M28 51 Q39 40 50 51" stroke="#1A1A16" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M50 51 Q61 40 72 51" stroke="#1A1A16" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M35 65 L40 75 L46 64 L50 77 L54 64 L60 75 L65 65" fill="#7A2020" stroke="#1A1A16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 22 L17 29 M88 22 L83 29" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="28" ry="6" fill="#00000012" />
      <path d="M27 34 L36 20 L42 37 M58 37 L64 20 L73 34" fill="#3A4A28" />
      <ellipse cx="25" cy="62" rx="5" ry="3.8" fill="#3A4A28" /><ellipse cx="75" cy="62" rx="5" ry="3.8" fill="#3A4A28" />
      <ellipse cx="50" cy="65" rx="29" ry="22" fill="#5A6E3D" />
      <ellipse cx="50" cy="72" rx="15" ry="9" fill="#8A9C6A" />
      <path d="M33 59 Q38 56 44 59" stroke="#1A1A16" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M67 59 Q62 56 56 59" stroke="#1A1A16" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="62" rx="2.6" ry="3.2" fill="#D9C25A" />
      <rect x="37.2" y="60" width="1.4" height="3.6" fill="#1A1A16" />
      <ellipse cx="62" cy="62" rx="2.6" ry="3.2" fill="#D9C25A" />
      <rect x="61.2" y="60" width="1.4" height="3.6" fill="#1A1A16" />
      <path d="M42 71 L45 75 L50 71 L54 75 L57 71" fill="none" stroke="#1A1A16" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 68 Q40 74 38 78" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="79" rx="2" ry="2.6" fill="#7EC8F2" />
    </>
  )
}

// ---- ティラノザウルス ----
const TREX_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M38 18 L43 6 L47 19 M53 19 L57 6 L62 18" fill="#1C3A22" />
      <ellipse cx="50" cy="60" rx="28" ry="26" fill="#26492E" />
      <path d="M50 46 Q41 55 45 66 Q50 70 55 66 Q59 55 50 46 Z" fill="#1C3A22" opacity="0.6" />
      <path d="M18 58 L23 60 M82 58 L77 60" stroke="#152C1A" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="50" cy="72" rx="14" ry="9" fill="#5C7E63" />
      <ellipse cx="39" cy="53" rx="4.6" ry="5" fill="#E8963C" />
      <rect x="38.1" y="50.5" width="1.9" height="5.5" fill="#1A1A16" />
      <path d="M33 49 Q39 46 45 49" stroke="#1A1A16" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="61" cy="53" rx="4.6" ry="5" fill="#E8963C" />
      <rect x="60.1" y="50.5" width="1.9" height="5.5" fill="#1A1A16" />
      <path d="M55 49 Q61 46 67 49" stroke="#1A1A16" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M36 67 L39 74 L43 66 L47 76 L50 65 L53 76 L57 66 L61 74 L64 67" fill="#7A2020" stroke="#1A1A16" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M36 10 L42 -2 L47 11 M53 11 L58 -2 L64 10" fill="#1C3A22" />
      <ellipse cx="50" cy="59" rx="31" ry="29" fill="#26492E" />
      <path d="M50 42 Q39 53 44 66 Q50 71 56 66 Q61 53 50 42 Z" fill="#1C3A22" opacity="0.6" />
      <ellipse cx="50" cy="70" rx="15" ry="10" fill="#5C7E63" />
      <path d="M28 51 Q39 39 50 50 Q61 39 72 51" stroke="#1A1A16" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M30 65 L34 78 L40 65 L44 80 L50 64 L56 80 L60 65 L66 78 L70 65" fill="#7A2020" stroke="#1A1A16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 20 L14 27 M92 20 L86 27" stroke="#FF6F6F" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M40 22 L44 12 L47 23 M53 23 L56 12 L60 22" fill="#1C3A22" />
      <ellipse cx="50" cy="64" rx="27" ry="23" fill="#26492E" />
      <ellipse cx="50" cy="74" rx="13" ry="8" fill="#5C7E63" />
      <path d="M34 57 Q40 62 46 58" stroke="#1A1A16" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M66 57 Q60 62 54 58" stroke="#1A1A16" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <ellipse cx="40" cy="62" rx="3.4" ry="3.8" fill="#E8963C" />
      <rect x="39.2" y="60" width="1.6" height="4.2" fill="#1A1A16" />
      <ellipse cx="60" cy="62" rx="3.4" ry="3.8" fill="#E8963C" />
      <rect x="59.2" y="60" width="1.6" height="4.2" fill="#1A1A16" />
      <path d="M42 71 L45 77 L49 70 L52 78 L55 70 L58 77 L61 71" fill="none" stroke="#1A1A16" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 67 Q40 73 38 77" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="78" rx="2" ry="2.6" fill="#7EC8F2" />
    </>
  )
}

// ---- ピカさん（オリジナルの電気ネズミ風キャラ）----
const PIKA_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M20 62 L8 56 L14 68 Z" fill="#F5C518" />
      <path d="M80 62 L92 56 L86 68 Z" fill="#F5C518" />
      <path d="M32 24 L26 42 L40 44 Z" fill="#F5C518" />
      <path d="M68 24 L74 42 L60 44 Z" fill="#F5C518" />
      <path d="M33 30 L29 41 L38 42 Z" fill="#3A2E1E" />
      <path d="M67 30 L71 41 L62 42 Z" fill="#3A2E1E" />
      <ellipse cx="50" cy="60" rx="29" ry="25" fill="#F5C518" />
      <ellipse cx="50" cy="68" rx="16" ry="12" fill="#FFF3C4" />
      <circle cx="40" cy="55" r="4" fill="#3A2E1E" />
      <circle cx="60" cy="55" r="4" fill="#3A2E1E" />
      <circle cx="30" cy="63" r="5" fill="#FF6F6F" opacity="0.85" />
      <circle cx="70" cy="63" r="5" fill="#FF6F6F" opacity="0.85" />
      <path d="M46 66 Q50 70 54 66" stroke="#3A2E1E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="63" rx="3" ry="2" fill="#3A2E1E" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M17 58 L4 50 L11 65 Z" fill="#F5C518" />
      <path d="M83 58 L96 50 L89 65 Z" fill="#F5C518" />
      <path d="M30 18 L23 39 L39 41 Z" fill="#F5C518" />
      <path d="M70 18 L77 39 L61 41 Z" fill="#F5C518" />
      <path d="M31 24 L26 38 L37 39 Z" fill="#3A2E1E" />
      <path d="M69 24 L74 38 L63 39 Z" fill="#3A2E1E" />
      <ellipse cx="50" cy="59" rx="32" ry="28" fill="#F5C518" />
      <ellipse cx="50" cy="68" rx="17" ry="13" fill="#FFF3C4" />
      <path d="M31 53 Q40 44 49 53" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M51 53 Q60 44 69 53" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="63" r="6" fill="#FF6F6F" opacity="0.9" />
      <circle cx="70" cy="63" r="6" fill="#FF6F6F" opacity="0.9" />
      <path d="M38 66 Q50 82 62 66" stroke="#3A2E1E" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M12 26 L17 34 M88 26 L83 34" stroke="#FFC53D" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M22 64 L11 60 L16 70 Z" fill="#F5C518" />
      <path d="M78 64 L89 60 L84 70 Z" fill="#F5C518" />
      <path d="M34 30 L29 46 L41 47 Z" fill="#F5C518" />
      <path d="M66 30 L71 46 L59 47 Z" fill="#F5C518" />
      <ellipse cx="50" cy="63" rx="27" ry="23" fill="#F5C518" />
      <ellipse cx="50" cy="71" rx="15" ry="11" fill="#FFF3C4" />
      <path d="M37 58 Q40 55 44 58" stroke="#3A2E1E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M63 58 Q60 55 56 58" stroke="#3A2E1E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="62" r="2.8" fill="#3A2E1E" />
      <circle cx="60" cy="62" r="2.8" fill="#3A2E1E" />
      <circle cx="32" cy="66" r="4" fill="#FF9E9E" opacity="0.7" />
      <circle cx="68" cy="66" r="4" fill="#FF9E9E" opacity="0.7" />
      <path d="M40 68 Q40 74 38 78" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="79" rx="2" ry="2.6" fill="#7EC8F2" />
    </>
  )
}

// ---- ドラさん（オリジナルの丸ロボット猫風キャラ）----
const DORA_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <circle cx="30" cy="34" r="7" fill="#4A90D9" />
      <circle cx="70" cy="34" r="7" fill="#4A90D9" />
      <ellipse cx="50" cy="60" rx="30" ry="27" fill="#4A90D9" />
      <ellipse cx="50" cy="65" rx="20" ry="18" fill="#FFFFFF" />
      <circle cx="40" cy="56" r="4.5" fill="#3A2E1E" />
      <circle cx="60" cy="56" r="4.5" fill="#3A2E1E" />
      <ellipse cx="50" cy="64" rx="3.4" ry="3" fill="#7A7A7A" />
      <path d="M46 68 Q50 71 54 68" stroke="#3A2E1E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <circle cx="27" cy="30" r="8" fill="#4A90D9" />
      <circle cx="73" cy="30" r="8" fill="#4A90D9" />
      <ellipse cx="50" cy="59" rx="33" ry="30" fill="#4A90D9" />
      <ellipse cx="50" cy="65" rx="22" ry="20" fill="#FFFFFF" />
      <path d="M31 53 Q40 44 49 53" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M51 53 Q60 44 69 53" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="63" rx="3.8" ry="3.2" fill="#7A7A7A" />
      <path d="M38 68 Q50 82 62 68" stroke="#3A2E1E" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="66" r="5.5" fill="#FFB3A0" opacity="0.7" />
      <circle cx="70" cy="66" r="5.5" fill="#FFB3A0" opacity="0.7" />
      <path d="M12 24 L17 32 M88 24 L83 32" stroke="#FFC53D" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <circle cx="32" cy="38" r="6.5" fill="#4A90D9" />
      <circle cx="68" cy="38" r="6.5" fill="#4A90D9" />
      <ellipse cx="50" cy="63" rx="27" ry="24" fill="#4A90D9" />
      <ellipse cx="50" cy="68" rx="18" ry="16" fill="#FFFFFF" />
      <path d="M36 59 Q40 56 44 59" stroke="#3A2E1E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M64 59 Q60 56 56 59" stroke="#3A2E1E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="63" r="3" fill="#3A2E1E" />
      <circle cx="60" cy="63" r="3" fill="#3A2E1E" />
      <ellipse cx="50" cy="70" rx="3" ry="2.6" fill="#7A7A7A" />
      <path d="M40 72 Q40 78 38 82" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="83" rx="2" ry="2.6" fill="#7EC8F2" />
    </>
  )
}

// ---- スポンジくん（オリジナルの四角いスポンジ風キャラ）----
const SPONGE_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <rect x="21" y="26" width="58" height="60" rx="16" fill="#F5C542" />
      <ellipse cx="30" cy="40" rx="3" ry="2.4" fill="#D9A82A" opacity="0.7" />
      <ellipse cx="70" cy="44" rx="2.6" ry="2" fill="#D9A82A" opacity="0.7" />
      <ellipse cx="26" cy="64" rx="2.4" ry="3" fill="#D9A82A" opacity="0.7" />
      <ellipse cx="73" cy="66" rx="3" ry="2.2" fill="#D9A82A" opacity="0.7" />
      <ellipse cx="50" cy="32" rx="2.2" ry="2.6" fill="#D9A82A" opacity="0.7" />
      <rect x="30" y="55" width="40" height="24" rx="10" fill="#FFF3C4" />
      <circle cx="40" cy="52" r="4.4" fill="#3A2E1E" />
      <circle cx="60" cy="52" r="4.4" fill="#3A2E1E" />
      <path d="M46 66 Q50 70 54 66" stroke="#3A2E1E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M22 20 L26 26 M78 20 L74 26 M50 18 L50 24" stroke="#4FB6E8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <rect x="17" y="21" width="66" height="66" rx="18" fill="#F5C542" />
      <ellipse cx="28" cy="38" rx="3" ry="2.4" fill="#D9A82A" opacity="0.7" />
      <ellipse cx="72" cy="42" rx="2.6" ry="2" fill="#D9A82A" opacity="0.7" />
      <ellipse cx="24" cy="66" rx="2.4" ry="3" fill="#D9A82A" opacity="0.7" />
      <ellipse cx="75" cy="68" rx="3" ry="2.2" fill="#D9A82A" opacity="0.7" />
      <rect x="27" y="56" width="46" height="27" rx="12" fill="#FFF3C4" />
      <path d="M31 51 Q40 42 49 51" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M51 51 Q60 42 69 51" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M38 66 Q50 82 62 66" stroke="#3A2E1E" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="63" r="5" fill="#FFB3A0" opacity="0.8" />
      <circle cx="70" cy="63" r="5" fill="#FFB3A0" opacity="0.8" />
      <path d="M12 24 L17 30 M88 24 L83 30" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <rect x="24" y="32" width="52" height="54" rx="14" fill="#F5C542" />
      <ellipse cx="32" cy="46" rx="2.6" ry="2" fill="#D9A82A" opacity="0.7" />
      <ellipse cx="68" cy="50" rx="2.4" ry="1.8" fill="#D9A82A" opacity="0.7" />
      <rect x="32" y="58" width="36" height="22" rx="9" fill="#FFF3C4" />
      <path d="M36 55 Q40 52 44 55" stroke="#3A2E1E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M64 55 Q60 52 56 55" stroke="#3A2E1E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="59" r="3" fill="#3A2E1E" />
      <circle cx="60" cy="59" r="3" fill="#3A2E1E" />
      <path d="M40 64 Q40 70 38 74" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="75" rx="2" ry="2.6" fill="#7EC8F2" />
      <path d="M45 71 Q50 68 55 71" stroke="#3A2E1E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  )
}

// ---- くれさん（オリジナルの元気な男の子キャラ）----
const KURE_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M30 30 Q26 14 38 16 Q42 6 50 14 Q58 6 62 16 Q74 14 70 30 Z" fill="#3A2E1E" />
      <ellipse cx="50" cy="58" rx="27" ry="25" fill="#FFDDB0" />
      <ellipse cx="50" cy="66" rx="14" ry="11" fill="#FFEFD6" />
      <circle cx="40" cy="54" r="4.2" fill="#3A2E1E" />
      <circle cx="60" cy="54" r="4.2" fill="#3A2E1E" />
      <circle cx="34" cy="61" r="4" fill="#FFB3A0" opacity="0.7" />
      <circle cx="66" cy="61" r="4" fill="#FFB3A0" opacity="0.7" />
      <path d="M45 65 Q50 69 55 65" stroke="#3A2E1E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <rect x="30" y="80" width="40" height="8" rx="4" fill="#4FB6E8" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M27 27 Q22 9 36 12 Q41 1 50 10 Q59 1 64 12 Q78 9 73 27 Z" fill="#3A2E1E" />
      <ellipse cx="50" cy="58" rx="29" ry="27" fill="#FFDDB0" />
      <ellipse cx="50" cy="66" rx="15" ry="12" fill="#FFEFD6" />
      <path d="M31 51 Q40 43 49 51" stroke="#3A2E1E" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M51 51 Q60 43 69 51" stroke="#3A2E1E" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M38 63 Q50 78 62 63" stroke="#3A2E1E" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="60" r="5" fill="#FFB3A0" opacity="0.85" />
      <circle cx="68" cy="60" r="5" fill="#FFB3A0" opacity="0.85" />
      <rect x="28" y="80" width="44" height="8" rx="4" fill="#4FB6E8" />
      <path d="M12 22 L17 28 M88 22 L83 28" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M32 33 Q29 19 39 21 Q43 12 50 19 Q57 12 61 21 Q71 19 68 33 Z" fill="#3A2E1E" />
      <ellipse cx="50" cy="60" rx="25" ry="23" fill="#FFDDB0" />
      <ellipse cx="50" cy="68" rx="13" ry="10" fill="#FFEFD6" />
      <path d="M35 57 Q39 54 44 57" stroke="#3A2E1E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M65 57 Q61 54 56 57" stroke="#3A2E1E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="60" r="3" fill="#3A2E1E" />
      <circle cx="60" cy="60" r="3" fill="#3A2E1E" />
      <path d="M40 65 Q40 71 38 75" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="76" rx="2" ry="2.6" fill="#7EC8F2" />
      <path d="M45 72 Q50 69 55 72" stroke="#3A2E1E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <rect x="32" y="82" width="36" height="7" rx="3.5" fill="#4FB6E8" />
    </>
  )
}

// ---- こうらくん（オリジナルの赤いカニキャラ）----
const CLUB_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M20 55 Q10 50 14 60 Q18 60 22 58 Z" fill="#D9432E" />
      <path d="M80 55 Q90 50 86 60 Q82 60 78 58 Z" fill="#D9432E" />
      <ellipse cx="50" cy="60" rx="30" ry="25" fill="#E8543A" />
      <ellipse cx="50" cy="68" rx="16" ry="12" fill="#FFD9C4" />
      <circle cx="40" cy="55" r="4.2" fill="#2B1A12" />
      <circle cx="60" cy="55" r="4.2" fill="#2B1A12" />
      <path d="M46 66 Q50 70 54 66" stroke="#2B1A12" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M18 62 L10 58 M82 62 L90 58" stroke="#B5321E" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M16 50 Q4 43 9 56 Q14 56 19 53 Z" fill="#D9432E" />
      <path d="M84 50 Q96 43 91 56 Q86 56 81 53 Z" fill="#D9432E" />
      <ellipse cx="50" cy="59" rx="33" ry="28" fill="#E8543A" />
      <ellipse cx="50" cy="68" rx="17" ry="13" fill="#FFD9C4" />
      <path d="M31 52 Q40 43 49 52" stroke="#2B1A12" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M51 52 Q60 43 69 52" stroke="#2B1A12" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M38 65 Q50 81 62 65" stroke="#2B1A12" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="63" r="5" fill="#FFB3A0" opacity="0.7" />
      <circle cx="70" cy="63" r="5" fill="#FFB3A0" opacity="0.7" />
      <path d="M10 20 L15 27 M90 20 L85 27" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M23 60 Q14 56 17 65 Q20 65 24 63 Z" fill="#D9432E" />
      <path d="M77 60 Q86 56 83 65 Q80 65 76 63 Z" fill="#D9432E" />
      <ellipse cx="50" cy="64" rx="28" ry="23" fill="#E8543A" />
      <ellipse cx="50" cy="72" rx="14" ry="10" fill="#FFD9C4" />
      <path d="M36 58 Q40 55 44 58" stroke="#2B1A12" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M64 58 Q60 55 56 58" stroke="#2B1A12" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="61" r="3" fill="#2B1A12" />
      <circle cx="60" cy="61" r="3" fill="#2B1A12" />
      <path d="M40 67 Q40 73 38 77" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="78" rx="2" ry="2.6" fill="#7EC8F2" />
      <path d="M45 74 Q50 71 55 74" stroke="#2B1A12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  )
}

// ---- ブロックにんげん（オリジナルのブロック調キャラ）----
const BLOCKMAN_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <rect x="26" y="20" width="48" height="42" rx="4" fill="#D9A66A" />
      <rect x="26" y="20" width="48" height="14" rx="4" fill="#6B4A2A" />
      <rect x="28" y="62" width="44" height="24" rx="3" fill="#7A5CC9" />
      <rect x="37" y="38" width="7" height="7" fill="#2B2A27" />
      <rect x="56" y="38" width="7" height="7" fill="#2B2A27" />
      <rect x="40" y="50" width="20" height="4" fill="#8C5A2A" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <rect x="22" y="15" width="56" height="48" rx="5" fill="#D9A66A" />
      <rect x="22" y="15" width="56" height="16" rx="5" fill="#6B4A2A" />
      <rect x="24" y="63" width="52" height="26" rx="3" fill="#7A5CC9" />
      <rect x="34" y="36" width="9" height="9" fill="#2B2A27" />
      <rect x="57" y="36" width="9" height="9" fill="#2B2A27" />
      <rect x="38" y="50" width="24" height="6" fill="#8C5A2A" />
      <circle cx="30" cy="48" r="4.5" fill="#FFB3A0" opacity="0.8" />
      <circle cx="70" cy="48" r="4.5" fill="#FFB3A0" opacity="0.8" />
      <path d="M12 20 L17 26 M88 20 L83 26" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <rect x="29" y="24" width="42" height="38" rx="4" fill="#D9A66A" />
      <rect x="29" y="24" width="42" height="12" rx="4" fill="#6B4A2A" />
      <rect x="31" y="62" width="38" height="20" rx="3" fill="#7A5CC9" />
      <rect x="38" y="42" width="6" height="6" fill="#2B2A27" />
      <rect x="56" y="42" width="6" height="6" fill="#2B2A27" />
      <path d="M36 38 Q40 35 44 38" stroke="#2B2A27" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M56 38 Q60 35 64 38" stroke="#2B2A27" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M40 52 Q50 49 60 52" stroke="#8C5A2A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M42 58 Q42 63 40 66" stroke="#7EC8F2" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="40" cy="67" rx="1.8" ry="2.3" fill="#7EC8F2" />
    </>
  )
}

// ---- クリーピー（オリジナルの緑ブロック生物）----
const CREEPY_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <rect x="24" y="18" width="52" height="66" rx="6" fill="#5FBF6A" />
      <rect x="30" y="34" width="8" height="8" fill="#2E7D3A" opacity="0.5" />
      <rect x="60" y="30" width="7" height="10" fill="#2E7D3A" opacity="0.5" />
      <rect x="34" y="60" width="9" height="9" fill="#2E7D3A" opacity="0.5" />
      <rect x="58" y="62" width="8" height="8" fill="#2E7D3A" opacity="0.5" />
      <circle cx="40" cy="46" r="5" fill="#213B2C" />
      <circle cx="60" cy="46" r="5" fill="#213B2C" />
      <circle cx="41.5" cy="44.5" r="1.5" fill="#fff" opacity="0.7" />
      <circle cx="61.5" cy="44.5" r="1.5" fill="#fff" opacity="0.7" />
      <path d="M42 58 Q50 64 58 58" stroke="#213B2C" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <rect x="18" y="12" width="64" height="72" rx="8" fill="#5FBF6A" />
      <rect x="26" y="30" width="9" height="9" fill="#2E7D3A" opacity="0.5" />
      <rect x="64" y="26" width="8" height="11" fill="#2E7D3A" opacity="0.5" />
      <path d="M31 42 Q40 34 49 42" stroke="#213B2C" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M51 42 Q60 34 69 42" stroke="#213B2C" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M38 55 Q50 70 62 55" stroke="#213B2C" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="53" r="5" fill="#FFB3A0" opacity="0.8" />
      <circle cx="70" cy="53" r="5" fill="#FFB3A0" opacity="0.8" />
      <path d="M10 16 L15 22 M90 16 L85 22" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <rect x="28" y="24" width="44" height="58" rx="5" fill="#5FBF6A" />
      <rect x="33" y="40" width="7" height="7" fill="#2E7D3A" opacity="0.5" />
      <path d="M35 50 Q39 47 44 50" stroke="#213B2C" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M56 50 Q61 47 65 50" stroke="#213B2C" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="54" r="3.6" fill="#213B2C" />
      <circle cx="60" cy="54" r="3.6" fill="#213B2C" />
      <path d="M40 61 Q40 67 38 71" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="72" rx="2" ry="2.6" fill="#7EC8F2" />
      <path d="M44 66 Q50 62 56 66" stroke="#213B2C" strokeWidth="2.3" fill="none" strokeLinecap="round" />
    </>
  )
}

// ---- てつのきょじん（オリジナルの鉄巨人キャラ）----
const IRON_GIANT_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="28" ry="5" fill="#00000012" />
      <rect x="18" y="42" width="16" height="30" rx="4" fill="#9CA3AB" />
      <rect x="66" y="42" width="16" height="30" rx="4" fill="#9CA3AB" />
      <rect x="28" y="26" width="44" height="52" rx="6" fill="#B4BAC1" />
      <rect x="40" y="66" width="20" height="5" fill="#5A6ACF" />
      <rect x="37" y="42" width="8" height="8" fill="#2B2A27" />
      <rect x="55" y="42" width="8" height="8" fill="#2B2A27" />
      <rect x="42" y="56" width="16" height="4" fill="#7A8087" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="28" ry="5" fill="#00000012" />
      <rect x="12" y="36" width="17" height="34" rx="4" fill="#9CA3AB" transform="rotate(-15 20 53)" />
      <rect x="71" y="36" width="17" height="34" rx="4" fill="#9CA3AB" transform="rotate(15 80 53)" />
      <rect x="24" y="20" width="52" height="58" rx="7" fill="#B4BAC1" />
      <rect x="38" y="68" width="24" height="6" fill="#5A6ACF" />
      <path d="M31 40 Q40 32 49 40" stroke="#2B2A27" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M51 40 Q60 32 69 40" stroke="#2B2A27" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M40 54 Q50 62 60 54" stroke="#7A8087" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M10 22 L15 28 M90 22 L85 28" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="28" ry="5" fill="#00000012" />
      <rect x="22" y="48" width="14" height="26" rx="4" fill="#9CA3AB" />
      <rect x="64" y="48" width="14" height="26" rx="4" fill="#9CA3AB" />
      <rect x="31" y="32" width="38" height="46" rx="5" fill="#B4BAC1" />
      <rect x="42" y="68" width="16" height="4" fill="#5A6ACF" />
      <path d="M38 46 Q41 43 46 46" stroke="#2B2A27" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M54 46 Q59 43 62 46" stroke="#2B2A27" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <rect x="38" y="49" width="6" height="6" fill="#2B2A27" />
      <rect x="56" y="49" width="6" height="6" fill="#2B2A27" />
      <path d="M40 64 Q40 69 38 72" stroke="#7EC8F2" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="73" rx="1.8" ry="2.3" fill="#7EC8F2" />
    </>
  )
}

// ---- やみにんげん（オリジナルの闇色キャラ）----
const DARK_MAN_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="24" ry="5" fill="#00000012" />
      <rect x="32" y="16" width="36" height="70" rx="8" fill="#2E2A4A" />
      <rect x="36" y="38" width="9" height="4" fill="#4FE8D0" />
      <rect x="55" y="38" width="9" height="4" fill="#4FE8D0" />
      <path d="M42 56 Q50 60 58 56" stroke="#4FE8D0" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="24" ry="5" fill="#00000012" />
      <rect x="27" y="10" width="46" height="76" rx="10" fill="#3A3560" />
      <rect x="33" y="34" width="12" height="5" fill="#4FE8D0" />
      <rect x="55" y="34" width="12" height="5" fill="#4FE8D0" />
      <path d="M38 54 Q50 66 62 54" stroke="#4FE8D0" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M10 16 L15 22 M90 16 L85 22" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="24" ry="5" fill="#00000012" />
      <rect x="35" y="22" width="30" height="60" rx="7" fill="#2E2A4A" />
      <rect x="39" y="42" width="7" height="3.5" fill="#4FE8D0" opacity="0.7" />
      <rect x="54" y="42" width="7" height="3.5" fill="#4FE8D0" opacity="0.7" />
      <path d="M44 56 Q50 53 56 56" stroke="#4FE8D0" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M40 64 Q40 69 38 72" stroke="#7EC8F2" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="73" rx="1.8" ry="2.3" fill="#7EC8F2" />
    </>
  )
}

// ---- くろりゅう（オリジナルの黒竜キャラ）----
const BLACKDRAGON_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M38 14 L34 30 L44 27 Z" fill="#1A1830" />
      <path d="M62 14 L66 30 L56 27 Z" fill="#1A1830" />
      <path d="M16 54 Q4 48 9 62 Q15 60 21 58 Z" fill="#3A2E5C" />
      <path d="M84 54 Q96 48 91 62 Q85 60 79 58 Z" fill="#3A2E5C" />
      <ellipse cx="50" cy="62" rx="29" ry="25" fill="#2A2245" />
      <ellipse cx="50" cy="72" rx="14" ry="9" fill="#5C4E8A" />
      <ellipse cx="40" cy="56" rx="4.6" ry="5" fill="#D94848" />
      <rect x="39.1" y="53.5" width="1.9" height="5.5" fill="#0D0B18" />
      <ellipse cx="60" cy="56" rx="4.6" ry="5" fill="#D94848" />
      <rect x="59.1" y="53.5" width="1.9" height="5.5" fill="#0D0B18" />
      <path d="M40 69 L43 74 L47 68 L50 76 L53 68 L57 74 L60 69" fill="none" stroke="#0D0B18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M36 8 L30 26 L42 23 Z" fill="#1A1830" />
      <path d="M64 8 L70 26 L58 23 Z" fill="#1A1830" />
      <path d="M12 48 Q-4 42 3 58 Q11 55 19 51 Z" fill="#3A2E5C" />
      <path d="M88 48 Q104 42 97 58 Q89 55 81 51 Z" fill="#3A2E5C" />
      <ellipse cx="50" cy="60" rx="32" ry="28" fill="#2A2245" />
      <ellipse cx="50" cy="70" rx="15" ry="10" fill="#5C4E8A" />
      <path d="M30 52 Q40 41 50 51 Q60 41 70 52" stroke="#0D0B18" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M32 64 L36 76 L42 64 L46 78 L50 63 L54 78 L58 64 L64 76 L68 64" fill="#7A2020" stroke="#0D0B18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 20 L13 27 M92 20 L87 27" stroke="#B76CE8" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M40 20 L36 33 L44 30 Z" fill="#1A1830" />
      <path d="M60 20 L64 33 L56 30 Z" fill="#1A1830" />
      <path d="M20 58 Q10 54 13 64 Q18 62 23 60 Z" fill="#3A2E5C" />
      <path d="M80 58 Q90 54 87 64 Q82 62 77 60 Z" fill="#3A2E5C" />
      <ellipse cx="50" cy="64" rx="28" ry="24" fill="#2A2245" />
      <ellipse cx="50" cy="73" rx="13" ry="8" fill="#5C4E8A" />
      <path d="M37 59 Q40 56 45 59" stroke="#0D0B18" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M63 59 Q60 56 55 59" stroke="#0D0B18" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="40" cy="63" rx="3.4" ry="3.8" fill="#D94848" />
      <rect x="39.2" y="61" width="1.6" height="4.2" fill="#0D0B18" />
      <ellipse cx="60" cy="63" rx="3.4" ry="3.8" fill="#D94848" />
      <rect x="59.2" y="61" width="1.6" height="4.2" fill="#0D0B18" />
      <path d="M40 68 Q40 74 38 78" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="79" rx="2" ry="2.6" fill="#7EC8F2" />
    </>
  )
}

// ---- マリさん（オリジナルのヒゲ配管工キャラ）----
const MARI_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <path d="M28 32 Q28 16 50 15 Q72 16 72 32 Z" fill="#7A63BD" />
      <ellipse cx="50" cy="26" rx="9" ry="4" fill="#FFC53D" />
      <ellipse cx="50" cy="46" rx="24" ry="22" fill="#FFDDB0" />
      <circle cx="40" cy="44" r="4" fill="#3A2E1E" />
      <circle cx="60" cy="44" r="4" fill="#3A2E1E" />
      <path d="M32 54 Q40 60 50 55 Q60 60 68 54 Q60 52 50 54 Q40 52 32 54 Z" fill="#3A2E1E" />
      <rect x="30" y="66" width="40" height="20" rx="4" fill="#F5C542" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <path d="M24 30 Q24 12 50 11 Q76 12 76 30 Z" fill="#7A63BD" />
      <ellipse cx="50" cy="23" rx="10" ry="4.5" fill="#FFC53D" />
      <ellipse cx="50" cy="45" rx="27" ry="25" fill="#FFDDB0" />
      <path d="M31 39 Q40 31 49 39" stroke="#3A2E1E" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M51 39 Q60 31 69 39" stroke="#3A2E1E" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M28 56 Q40 64 50 58 Q60 64 72 56 Q60 54 50 56 Q40 54 28 56 Z" fill="#3A2E1E" />
      <rect x="27" y="68" width="46" height="22" rx="5" fill="#F5C542" />
      <circle cx="30" cy="52" r="4.5" fill="#FFB3A0" opacity="0.8" />
      <circle cx="70" cy="52" r="4.5" fill="#FFB3A0" opacity="0.8" />
      <path d="M12 18 L17 24 M88 18 L83 24" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <path d="M31 36 Q31 22 50 21 Q69 22 69 36 Z" fill="#7A63BD" />
      <ellipse cx="50" cy="29" rx="8" ry="3.6" fill="#FFC53D" />
      <ellipse cx="50" cy="50" rx="22" ry="20" fill="#FFDDB0" />
      <path d="M36 46 Q39 43 44 46" stroke="#3A2E1E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M56 46 Q61 43 64 46" stroke="#3A2E1E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="49" r="3" fill="#3A2E1E" />
      <circle cx="60" cy="49" r="3" fill="#3A2E1E" />
      <path d="M35 58 Q42 62 50 59 Q58 62 65 58 Q58 56 50 58 Q42 56 35 58 Z" fill="#3A2E1E" />
      <rect x="33" y="70" width="34" height="17" rx="4" fill="#F5C542" />
      <path d="M40 68 Q40 74 38 78" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="79" rx="2" ry="2.6" fill="#7EC8F2" />
    </>
  )
}

// ---- こうらおう（オリジナルのこうらを持つ竜のボス）----
const KOURAO_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="27" ry="5" fill="#00000012" />
      <path d="M32 20 L36 8 L42 20 M58 20 L64 8 L68 20" fill="#5C7A2E" />
      <ellipse cx="50" cy="58" rx="31" ry="26" fill="#7C9E3E" />
      <path d="M50 40 L34 62 L50 76 L66 62 Z" fill="#3E5A20" stroke="#2A3E14" strokeWidth="1.4" />
      <path d="M50 48 L42 60 L50 68 L58 60 Z" fill="#5C7A2E" />
      <ellipse cx="50" cy="66" rx="15" ry="10" fill="#E8DDA8" />
      <circle cx="40" cy="55" r="4.4" fill="#D94848" />
      <circle cx="60" cy="55" r="4.4" fill="#D94848" />
      <path d="M40 70 L44 76 L48 68 L52 78 L56 68 L60 76 L64 70" fill="none" stroke="#2A3E14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="27" ry="5" fill="#00000012" />
      <path d="M30 14 L35 0 L42 14 M58 14 L65 0 L70 14" fill="#5C7A2E" />
      <ellipse cx="50" cy="56" rx="34" ry="29" fill="#7C9E3E" />
      <path d="M50 36 L32 60 L50 76 L68 60 Z" fill="#3E5A20" stroke="#2A3E14" strokeWidth="1.4" />
      <ellipse cx="50" cy="65" rx="17" ry="11" fill="#E8DDA8" />
      <path d="M31 49 Q40 40 49 49" stroke="#2A3E14" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M51 49 Q60 40 69 49" stroke="#2A3E14" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M36 62 L40 76 L46 62 L50 79 L54 62 L60 76 L64 62" fill="#7A2020" stroke="#2A3E14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 16 L15 23 M90 16 L85 23" stroke="#FF9E45" strokeWidth="2.6" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="27" ry="5" fill="#00000012" />
      <path d="M34 26 L38 16 L43 26 M57 26 L62 16 L66 26" fill="#5C7A2E" />
      <ellipse cx="50" cy="62" rx="28" ry="23" fill="#7C9E3E" />
      <path d="M50 46 L37 64 L50 76 L63 64 Z" fill="#3E5A20" stroke="#2A3E14" strokeWidth="1.3" />
      <ellipse cx="50" cy="70" rx="14" ry="9" fill="#E8DDA8" />
      <path d="M37 58 Q40 55 44 58" stroke="#2A3E14" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M63 58 Q60 55 56 58" stroke="#2A3E14" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="61" r="3.4" fill="#D94848" />
      <circle cx="60" cy="61" r="3.4" fill="#D94848" />
      <path d="M40 67 Q40 73 38 77" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="78" rx="2" ry="2.6" fill="#7EC8F2" />
      <path d="M44 74 Q50 71 56 74" stroke="#2A3E14" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  )
}

// ---- ゴリさん（オリジナルのゴリラキャラ）----
const GORI_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="27" ry="5" fill="#00000012" />
      <ellipse cx="24" cy="52" rx="9" ry="12" fill="#5C4A3A" />
      <ellipse cx="76" cy="52" rx="9" ry="12" fill="#5C4A3A" />
      <ellipse cx="50" cy="56" rx="30" ry="26" fill="#7A6252" />
      <ellipse cx="50" cy="66" rx="18" ry="14" fill="#D9C4A8" />
      <circle cx="40" cy="52" r="4" fill="#2B1A12" />
      <circle cx="60" cy="52" r="4" fill="#2B1A12" />
      <ellipse cx="50" cy="66" rx="7" ry="5" fill="#B79A7A" />
      <path d="M46 72 Q50 75 54 72" stroke="#2B1A12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="27" ry="5" fill="#00000012" />
      <ellipse cx="20" cy="50" rx="10" ry="13" fill="#5C4A3A" />
      <ellipse cx="80" cy="50" rx="10" ry="13" fill="#5C4A3A" />
      <ellipse cx="50" cy="55" rx="33" ry="29" fill="#7A6252" />
      <ellipse cx="50" cy="66" rx="19" ry="15" fill="#D9C4A8" />
      <path d="M31 48 Q40 39 49 48" stroke="#2B1A12" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M51 48 Q60 39 69 48" stroke="#2B1A12" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="66" rx="8" ry="5.5" fill="#B79A7A" />
      <path d="M38 74 Q50 84 62 74" stroke="#2B1A12" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M10 20 L15 27 M90 20 L85 27" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="27" ry="5" fill="#00000012" />
      <ellipse cx="27" cy="55" rx="8" ry="11" fill="#5C4A3A" />
      <ellipse cx="73" cy="55" rx="8" ry="11" fill="#5C4A3A" />
      <ellipse cx="50" cy="60" rx="27" ry="23" fill="#7A6252" />
      <ellipse cx="50" cy="69" rx="16" ry="12" fill="#D9C4A8" />
      <path d="M36 56 Q40 53 44 56" stroke="#2B1A12" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M64 56 Q60 53 56 56" stroke="#2B1A12" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="59" r="3" fill="#2B1A12" />
      <circle cx="60" cy="59" r="3" fill="#2B1A12" />
      <ellipse cx="50" cy="70" rx="6" ry="4.2" fill="#B79A7A" />
      <path d="M40 74 Q40 80 38 84" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="85" rx="2" ry="2.6" fill="#7EC8F2" />
    </>
  )
}

// ---- あかぼう（オリジナルの丸っこい赤い植物頭キャラ）----
const AKABOU_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="24" ry="5" fill="#00000012" />
      <rect x="48.5" y="14" width="3" height="14" fill="#4CB27A" />
      <ellipse cx="50" cy="13" rx="8" ry="5" fill="#5FCB92" />
      <ellipse cx="50" cy="58" rx="26" ry="24" fill="#E85A4A" />
      <ellipse cx="50" cy="66" rx="14" ry="11" fill="#FFCFC4" />
      <circle cx="40" cy="55" r="5" fill="#2B1A12" />
      <circle cx="60" cy="55" r="5" fill="#2B1A12" />
      <circle cx="41.5" cy="53.5" r="1.6" fill="#fff" opacity="0.8" />
      <circle cx="61.5" cy="53.5" r="1.6" fill="#fff" opacity="0.8" />
      <path d="M45 68 Q50 71 55 68" stroke="#2B1A12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="24" ry="5" fill="#00000012" />
      <rect x="48.5" y="8" width="3" height="16" fill="#4CB27A" />
      <ellipse cx="50" cy="7" rx="9" ry="5.5" fill="#5FCB92" />
      <ellipse cx="50" cy="57" rx="30" ry="27" fill="#E85A4A" />
      <ellipse cx="50" cy="67" rx="16" ry="13" fill="#FFCFC4" />
      <path d="M31 51 Q40 42 49 51" stroke="#2B1A12" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M51 51 Q60 42 69 51" stroke="#2B1A12" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M38 65 Q50 80 62 65" stroke="#2B1A12" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="63" r="5" fill="#FFB3A0" opacity="0.7" />
      <circle cx="70" cy="63" r="5" fill="#FFB3A0" opacity="0.7" />
      <path d="M12 20 L17 27 M88 20 L83 27" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="24" ry="5" fill="#00000012" />
      <rect x="48.5" y="20" width="3" height="12" fill="#4CB27A" />
      <ellipse cx="50" cy="19" rx="7" ry="4.5" fill="#5FCB92" />
      <ellipse cx="50" cy="62" rx="23" ry="21" fill="#E85A4A" />
      <ellipse cx="50" cy="70" rx="13" ry="10" fill="#FFCFC4" />
      <circle cx="40" cy="60" r="3.6" fill="#2B1A12" />
      <circle cx="60" cy="60" r="3.6" fill="#2B1A12" />
      <path d="M40 66 Q40 72 38 76" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="77" rx="2" ry="2.6" fill="#7EC8F2" />
      <path d="M45 73 Q50 70 55 73" stroke="#2B1A12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  )
}

// ---- きいぼう（オリジナルの丸っこい黄色植物頭キャラ）----
const KIIBOU_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="24" ry="5" fill="#00000012" />
      <rect x="48.5" y="14" width="3" height="12" fill="#4CB27A" />
      <ellipse cx="46" cy="12" rx="5" ry="6" fill="#F5C542" transform="rotate(-20 46 12)" />
      <ellipse cx="54" cy="12" rx="5" ry="6" fill="#F5C542" transform="rotate(20 54 12)" />
      <ellipse cx="50" cy="58" rx="26" ry="24" fill="#F5C542" />
      <ellipse cx="50" cy="66" rx="14" ry="11" fill="#FFF3C4" />
      <circle cx="40" cy="55" r="5" fill="#2B1A12" />
      <circle cx="60" cy="55" r="5" fill="#2B1A12" />
      <circle cx="41.5" cy="53.5" r="1.6" fill="#fff" opacity="0.8" />
      <circle cx="61.5" cy="53.5" r="1.6" fill="#fff" opacity="0.8" />
      <path d="M45 68 Q50 71 55 68" stroke="#2B1A12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="24" ry="5" fill="#00000012" />
      <rect x="48.5" y="8" width="3" height="14" fill="#4CB27A" />
      <ellipse cx="44" cy="7" rx="6" ry="7" fill="#F5C542" transform="rotate(-24 44 7)" />
      <ellipse cx="56" cy="7" rx="6" ry="7" fill="#F5C542" transform="rotate(24 56 7)" />
      <ellipse cx="50" cy="57" rx="30" ry="27" fill="#F5C542" />
      <ellipse cx="50" cy="67" rx="16" ry="13" fill="#FFF3C4" />
      <path d="M31 51 Q40 42 49 51" stroke="#2B1A12" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M51 51 Q60 42 69 51" stroke="#2B1A12" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M38 65 Q50 80 62 65" stroke="#2B1A12" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="63" r="5" fill="#FFB3A0" opacity="0.7" />
      <circle cx="70" cy="63" r="5" fill="#FFB3A0" opacity="0.7" />
      <path d="M12 20 L17 27 M88 20 L83 27" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="24" ry="5" fill="#00000012" />
      <rect x="48.5" y="20" width="3" height="10" fill="#4CB27A" />
      <ellipse cx="47" cy="19" rx="4.2" ry="5" fill="#F5C542" transform="rotate(-18 47 19)" />
      <ellipse cx="53" cy="19" rx="4.2" ry="5" fill="#F5C542" transform="rotate(18 53 19)" />
      <ellipse cx="50" cy="62" rx="23" ry="21" fill="#F5C542" />
      <ellipse cx="50" cy="70" rx="13" ry="10" fill="#FFF3C4" />
      <circle cx="40" cy="60" r="3.6" fill="#2B1A12" />
      <circle cx="60" cy="60" r="3.6" fill="#2B1A12" />
      <path d="M40 66 Q40 72 38 76" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="77" rx="2" ry="2.6" fill="#7EC8F2" />
      <path d="M45 73 Q50 70 55 73" stroke="#2B1A12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  )
}

// ---- ふわりん（オリジナルの浮遊する小さな精霊キャラ）----
const FUWARIN_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="90" rx="14" ry="3" fill="#00000010" />
      <circle cx="50" cy="55" r="6" fill="none" stroke="#C9B8F5" strokeWidth="1.5" opacity="0.5" />
      <ellipse cx="50" cy="55" rx="24" ry="22" fill="#E8DDFF" />
      <ellipse cx="50" cy="62" rx="13" ry="10" fill="#FBF8FF" />
      <circle cx="40" cy="52" r="4" fill="#7A63BD" />
      <circle cx="60" cy="52" r="4" fill="#7A63BD" />
      <path d="M46 63 Q50 66 54 63" stroke="#7A63BD" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M25 40 L28 43 M75 40 L72 43 M50 24 L50 28" stroke="#FFC53D" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="90" rx="16" ry="3" fill="#00000010" />
      <circle cx="50" cy="52" r="9" fill="none" stroke="#C9B8F5" strokeWidth="1.6" opacity="0.55" />
      <ellipse cx="50" cy="52" rx="28" ry="26" fill="#E8DDFF" />
      <ellipse cx="50" cy="61" rx="15" ry="12" fill="#FBF8FF" />
      <path d="M31 46 Q40 38 49 46" stroke="#7A63BD" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M51 46 Q60 38 69 46" stroke="#7A63BD" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M40 60 Q50 72 60 60" stroke="#7A63BD" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="58" r="4.5" fill="#FFB3A0" opacity="0.6" />
      <circle cx="68" cy="58" r="4.5" fill="#FFB3A0" opacity="0.6" />
      <path d="M18 26 L22 30 M82 26 L78 30 M50 14 L50 19" stroke="#FFC53D" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="90" rx="12" ry="2.6" fill="#00000010" />
      <circle cx="50" cy="58" r="5" fill="none" stroke="#C9B8F5" strokeWidth="1.4" opacity="0.4" />
      <ellipse cx="50" cy="58" rx="21" ry="19" fill="#E8DDFF" />
      <ellipse cx="50" cy="64" rx="12" ry="9" fill="#FBF8FF" />
      <path d="M37 55 Q40 52 44 55" stroke="#7A63BD" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M63 55 Q60 52 56 55" stroke="#7A63BD" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="58" r="2.8" fill="#7A63BD" />
      <circle cx="60" cy="58" r="2.8" fill="#7A63BD" />
      <path d="M40 64 Q40 69 38 72" stroke="#7EC8F2" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="73" rx="1.8" ry="2.3" fill="#7EC8F2" />
    </>
  )
}

// ---- ぱんぱん（オリジナルの丸パンヒーローキャラ）----
const PANPAN_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="27" ry="5" fill="#00000012" />
      <ellipse cx="50" cy="58" rx="30" ry="26" fill="#E8B96A" />
      <path d="M28 42 Q50 34 72 42" stroke="#C9945A" strokeWidth="2" fill="none" opacity="0.6" />
      <ellipse cx="50" cy="66" rx="16" ry="13" fill="#FFF3E1" />
      <circle cx="40" cy="55" r="4.4" fill="#3A2E1E" />
      <circle cx="60" cy="55" r="4.4" fill="#3A2E1E" />
      <path d="M46 68 Q50 71 54 68" stroke="#3A2E1E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="27" ry="5" fill="#00000012" />
      <ellipse cx="50" cy="57" rx="33" ry="29" fill="#E8B96A" />
      <path d="M24 38 Q50 28 76 38" stroke="#C9945A" strokeWidth="2.2" fill="none" opacity="0.6" />
      <ellipse cx="50" cy="66" rx="18" ry="14" fill="#FFF3E1" />
      <path d="M31 51 Q40 42 49 51" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M51 51 Q60 42 69 51" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M38 65 Q50 80 62 65" stroke="#3A2E1E" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="63" r="5.5" fill="#FFB3A0" opacity="0.85" />
      <circle cx="70" cy="63" r="5.5" fill="#FFB3A0" opacity="0.85" />
      <path d="M12 22 L17 28 M88 22 L83 28" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="27" ry="5" fill="#00000012" />
      <ellipse cx="50" cy="62" rx="27" ry="23" fill="#E8B96A" />
      <path d="M32 48 Q50 42 68 48" stroke="#C9945A" strokeWidth="1.8" fill="none" opacity="0.6" />
      <ellipse cx="50" cy="70" rx="14" ry="11" fill="#FFF3E1" />
      <path d="M36 58 Q40 55 44 58" stroke="#3A2E1E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M64 58 Q60 55 56 58" stroke="#3A2E1E" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="61" r="3" fill="#3A2E1E" />
      <circle cx="60" cy="61" r="3" fill="#3A2E1E" />
      <path d="M40 67 Q40 73 38 77" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="78" rx="2" ry="2.6" fill="#7EC8F2" />
      <path d="M45 74 Q50 71 55 74" stroke="#3A2E1E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  )
}

// ---- ばいきん（オリジナルの紫黒ばい菌風キャラ）----
const BAIKIN_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <ellipse cx="50" cy="58" rx="28" ry="25" fill="#2E1A38" />
      <circle cx="30" cy="40" r="3" fill="#4A2E5C" opacity="0.7" />
      <circle cx="68" cy="46" r="2.4" fill="#4A2E5C" opacity="0.7" />
      <circle cx="62" cy="72" r="2.6" fill="#4A2E5C" opacity="0.7" />
      <ellipse cx="50" cy="66" rx="15" ry="11" fill="#5C3A6E" />
      <circle cx="40" cy="55" r="4.4" fill="#D94848" />
      <circle cx="60" cy="55" r="4.4" fill="#D94848" />
      <path d="M42 68 L46 71 L50 68 L54 71 L58 68" fill="none" stroke="#1A0E22" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <ellipse cx="50" cy="57" rx="31" ry="28" fill="#2E1A38" />
      <circle cx="27" cy="37" r="3.4" fill="#4A2E5C" opacity="0.7" />
      <circle cx="72" cy="44" r="2.8" fill="#4A2E5C" opacity="0.7" />
      <circle cx="66" cy="75" r="3" fill="#4A2E5C" opacity="0.7" />
      <ellipse cx="50" cy="66" rx="17" ry="13" fill="#5C3A6E" />
      <path d="M31 51 Q40 42 49 51" stroke="#1A0E22" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M51 51 Q60 42 69 51" stroke="#1A0E22" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M36 66 L41 72 L46 65 L50 74 L54 65 L59 72 L64 66" fill="#7A2020" stroke="#1A0E22" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="34" cy="55" r="4" fill="#D94848" />
      <circle cx="66" cy="55" r="4" fill="#D94848" />
      <path d="M10 20 L15 27 M90 20 L85 27" stroke="#B76CE8" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <ellipse cx="50" cy="62" rx="26" ry="22" fill="#2E1A38" />
      <ellipse cx="50" cy="70" rx="13" ry="9" fill="#5C3A6E" />
      <path d="M36 58 Q40 55 44 58" stroke="#1A0E22" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M64 58 Q60 55 56 58" stroke="#1A0E22" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="61" r="3.4" fill="#D94848" />
      <circle cx="60" cy="61" r="3.4" fill="#D94848" />
      <path d="M40 67 Q40 73 38 77" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="78" rx="2" ry="2.6" fill="#7EC8F2" />
      <path d="M44 73 L48 76 L52 73 L56 76" fill="none" stroke="#1A0E22" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
}

// ---- ゆきだるマン（オリジナルの雪だるまキャラ）----
const YUKIDARUMA_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <circle cx="50" cy="70" r="22" fill="#F4F8FF" stroke="#D4E4F0" strokeWidth="1.5" />
      <circle cx="50" cy="38" r="16" fill="#F4F8FF" stroke="#D4E4F0" strokeWidth="1.5" />
      <circle cx="43" cy="35" r="2.6" fill="#2B2A27" />
      <circle cx="57" cy="35" r="2.6" fill="#2B2A27" />
      <path d="M50 39 L58 42 L50 44 Z" fill="#FF9E45" />
      <circle cx="50" cy="60" r="2" fill="#2B2A27" />
      <circle cx="50" cy="68" r="2" fill="#2B2A27" />
      <circle cx="50" cy="76" r="2" fill="#2B2A27" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <circle cx="50" cy="68" r="25" fill="#F4F8FF" stroke="#D4E4F0" strokeWidth="1.5" />
      <circle cx="50" cy="32" r="18" fill="#F4F8FF" stroke="#D4E4F0" strokeWidth="1.5" />
      <path d="M34 30 Q39 23 44 30" stroke="#2B2A27" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M56 30 Q61 23 66 30" stroke="#2B2A27" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M50 33 L60 37 L50 40 Z" fill="#FF9E45" />
      <path d="M42 45 Q50 52 58 45" stroke="#2B2A27" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="58" r="2.2" fill="#2B2A27" />
      <circle cx="50" cy="66" r="2.2" fill="#2B2A27" />
      <circle cx="50" cy="74" r="2.2" fill="#2B2A27" />
      <path d="M12 20 L17 27 M88 20 L83 27" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <circle cx="50" cy="72" r="20" fill="#F4F8FF" stroke="#D4E4F0" strokeWidth="1.5" />
      <circle cx="50" cy="44" r="14" fill="#F4F8FF" stroke="#D4E4F0" strokeWidth="1.5" />
      <path d="M40 42 Q43 39 47 42" stroke="#2B2A27" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M53 42 Q57 39 60 42" stroke="#2B2A27" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M50 46 L57 49 L50 51 Z" fill="#FF9E45" />
      <path d="M40 75 Q40 81 38 85" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="86" rx="2" ry="2.6" fill="#7EC8F2" />
    </>
  )
}

// ---- かぼちゃおに（オリジナルのかぼちゃキャラ）----
const KABOCHA_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <rect x="47" y="10" width="6" height="8" fill="#5C7A2E" />
      <ellipse cx="50" cy="58" rx="30" ry="26" fill="#FF9E45" />
      <path d="M26 40 Q30 58 26 76 M74 40 Q70 58 74 76 M50 32 Q54 58 50 84" stroke="#D97A2E" strokeWidth="1.6" fill="none" opacity="0.6" />
      <path d="M33 52 L40 58 L33 62 Z" fill="#2B1A12" />
      <path d="M67 52 L60 58 L67 62 Z" fill="#2B1A12" />
      <path d="M40 70 L44 76 L48 68 L52 78 L56 68 L60 76 L64 70" fill="#2B1A12" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <rect x="47" y="6" width="6" height="8" fill="#5C7A2E" />
      <ellipse cx="50" cy="57" rx="33" ry="29" fill="#FF9E45" />
      <path d="M24 38 Q29 57 24 76 M76 38 Q71 57 76 76 M50 30 Q55 57 50 84" stroke="#D97A2E" strokeWidth="1.6" fill="none" opacity="0.6" />
      <path d="M28 48 L38 56 L28 62 Z" fill="#2B1A12" />
      <path d="M72 48 L62 56 L72 62 Z" fill="#2B1A12" />
      <path d="M34 66 L40 74 L46 64 L50 78 L54 64 L60 74 L66 66" fill="#2B1A12" />
      <path d="M10 18 L15 25 M90 18 L85 25" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <rect x="47" y="16" width="6" height="7" fill="#5C7A2E" />
      <ellipse cx="50" cy="62" rx="27" ry="23" fill="#FF9E45" />
      <path d="M28 46 Q32 62 28 78 M72 46 Q68 62 72 78" stroke="#D97A2E" strokeWidth="1.4" fill="none" opacity="0.6" />
      <path d="M37 56 Q40 53 44 56" stroke="#2B1A12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M63 56 Q60 53 56 56" stroke="#2B1A12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M42 73 Q50 70 58 73" stroke="#2B1A12" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M40 68 Q40 74 38 78" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="79" rx="2" ry="2.6" fill="#7EC8F2" />
    </>
  )
}

// ---- らくがきくん（オリジナルの線画タッチキャラ）----
const RAKUGAKI_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000010" />
      <circle cx="50" cy="58" r="26" fill="#FFFDF5" stroke="#2B2A27" strokeWidth="2.5" />
      <path d="M38 52 L44 56" stroke="#2B2A27" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M62 52 L56 56" stroke="#2B2A27" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M44 68 Q50 72 56 68" stroke="#2B2A27" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="34" cy="63" r="4" fill="#FF9E7A" opacity="0.6" />
      <circle cx="66" cy="63" r="4" fill="#FF9E7A" opacity="0.6" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000010" />
      <circle cx="50" cy="56" r="29" fill="#FFFDF5" stroke="#2B2A27" strokeWidth="2.8" />
      <path d="M32 48 Q40 40 48 48" stroke="#2B2A27" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M52 48 Q60 40 68 48" stroke="#2B2A27" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M38 62 Q50 76 62 62" stroke="#2B2A27" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="60" r="5" fill="#FF9E7A" opacity="0.7" />
      <circle cx="70" cy="60" r="5" fill="#FF9E7A" opacity="0.7" />
      <path d="M10 18 L15 25 M90 18 L85 25" stroke="#4CB27A" strokeWidth="2.6" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000010" />
      <circle cx="50" cy="60" r="23" fill="#FFFDF5" stroke="#2B2A27" strokeWidth="2.4" />
      <path d="M37 55 Q40 52 44 55" stroke="#2B2A27" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M63 55 Q60 52 56 55" stroke="#2B2A27" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M44 71 Q50 67 56 71" stroke="#2B2A27" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M40 66 Q40 72 38 76" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="77" rx="2" ry="2.6" fill="#7EC8F2" />
    </>
  )
}

// ---- カミナリ坊（オリジナルの元気な雷キャラ）----
const KAMINARI_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <path d="M18 44 Q30 34 44 40 Q50 32 56 40 Q70 34 82 44 Q76 52 50 50 Q24 52 18 44 Z" fill="#B8C6E0" />
      <ellipse cx="50" cy="60" rx="24" ry="21" fill="#7A63BD" />
      <ellipse cx="50" cy="66" rx="13" ry="10" fill="#E8DDFF" />
      <circle cx="40" cy="56" r="4" fill="#2B1A12" />
      <circle cx="60" cy="56" r="4" fill="#2B1A12" />
      <path d="M46 68 Q50 71 54 68" stroke="#2B1A12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M52 76 L48 84 L52 84 L48 92" stroke="#FFC53D" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <path d="M14 40 Q28 28 44 36 Q50 26 56 36 Q72 28 86 40 Q78 50 50 47 Q22 50 14 40 Z" fill="#B8C6E0" />
      <ellipse cx="50" cy="58" rx="27" ry="24" fill="#7A63BD" />
      <ellipse cx="50" cy="65" rx="15" ry="12" fill="#E8DDFF" />
      <path d="M31 51 Q40 42 49 51" stroke="#2B1A12" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M51 51 Q60 42 69 51" stroke="#2B1A12" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M38 64 Q50 78 62 64" stroke="#2B1A12" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="62" r="4.5" fill="#FFB3A0" opacity="0.7" />
      <circle cx="68" cy="62" r="4.5" fill="#FFB3A0" opacity="0.7" />
      <path d="M10 16 L15 23 M90 16 L85 23" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <path d="M24 48 Q34 40 46 45 Q50 39 54 45 Q66 40 76 48 Q71 54 50 52 Q29 54 24 48 Z" fill="#B8C6E0" />
      <ellipse cx="50" cy="64" rx="21" ry="18" fill="#7A63BD" />
      <ellipse cx="50" cy="69" rx="11" ry="9" fill="#E8DDFF" />
      <path d="M37 60 Q40 57 44 60" stroke="#2B1A12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M63 60 Q60 57 56 60" stroke="#2B1A12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="63" r="3" fill="#2B1A12" />
      <circle cx="60" cy="63" r="3" fill="#2B1A12" />
      <path d="M40 70 Q40 76 38 80" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="81" rx="2" ry="2.6" fill="#7EC8F2" />
    </>
  )
}

// ---- にんじゃ丸（オリジナルの忍者キャラ）----
const NINJA_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <ellipse cx="50" cy="58" rx="26" ry="24" fill="#2E3A4A" />
      <rect x="24" y="48" width="52" height="10" fill="#1A222E" />
      <path d="M76 50 L86 46 M76 56 L86 58" stroke="#1A222E" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="50" cy="62" rx="15" ry="11" fill="#FFDDB0" />
      <circle cx="40" cy="58" r="4" fill="#2B1A12" />
      <circle cx="60" cy="58" r="4" fill="#2B1A12" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <ellipse cx="50" cy="56" rx="29" ry="27" fill="#2E3A4A" />
      <rect x="20" y="45" width="60" height="11" fill="#1A222E" />
      <path d="M80 46 L92 41 M80 54 L92 57" stroke="#1A222E" strokeWidth="2.8" strokeLinecap="round" />
      <ellipse cx="50" cy="62" rx="17" ry="13" fill="#FFDDB0" />
      <path d="M31 55 Q40 47 49 55" stroke="#2B1A12" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M51 55 Q60 47 69 55" stroke="#2B1A12" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M38 68 Q50 78 62 68" stroke="#2B1A12" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M10 20 L15 27 M90 20 L85 27" stroke="#FFC53D" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="88" rx="26" ry="5" fill="#00000012" />
      <ellipse cx="50" cy="62" rx="23" ry="21" fill="#2E3A4A" />
      <rect x="29" y="53" width="42" height="9" fill="#1A222E" />
      <ellipse cx="50" cy="67" rx="13" ry="9" fill="#FFDDB0" />
      <path d="M37 63 Q40 60 44 63" stroke="#2B1A12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M63 63 Q60 60 56 63" stroke="#2B1A12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="66" r="2.8" fill="#2B1A12" />
      <circle cx="60" cy="66" r="2.8" fill="#2B1A12" />
      <path d="M40 71 Q40 77 38 81" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="82" rx="2" ry="2.6" fill="#7EC8F2" />
    </>
  )
}

export const BODIES = {
  fox: FOX_BODY, cat: CAT_BODY, dog: DOG_BODY, dragon: DRAGON_BODY,
  lion: LION_BODY, pig: PIG_BODY, cheetah: CHEETAH_BODY, robot: ROBOT_BODY,
  ankylosaurus: ANKY_BODY, trex: TREX_BODY,
  pika: PIKA_BODY, dora: DORA_BODY,
  sponge: SPONGE_BODY, kure: KURE_BODY, club: CLUB_BODY,
  blockman: BLOCKMAN_BODY, creepy: CREEPY_BODY, iron_giant: IRON_GIANT_BODY,
  dark_man: DARK_MAN_BODY, blackdragon: BLACKDRAGON_BODY,
  mari: MARI_BODY, kourao: KOURAO_BODY, gori: GORI_BODY,
  akabou: AKABOU_BODY, kiibou: KIIBOU_BODY, fuwarin: FUWARIN_BODY,
  panpan: PANPAN_BODY, baikin: BAIKIN_BODY,
  yukidaruma: YUKIDARUMA_BODY, kabocha: KABOCHA_BODY, rakugaki: RAKUGAKI_BODY,
  kaminari: KAMINARI_BODY, ninja: NINJA_BODY
}
