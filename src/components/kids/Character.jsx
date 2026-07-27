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
      <path d="M39 16 L34 32 L46 29 Z" fill="#265E42" />
      <path d="M61 16 L66 32 L54 29 Z" fill="#265E42" />
      <path d="M18 55 Q6 50 10 62 Q16 60 22 58 Z" fill="#3E8E64" />
      <path d="M82 55 Q94 50 90 62 Q84 60 78 58 Z" fill="#3E8E64" />
      <ellipse cx="50" cy="62" rx="29" ry="25" fill="#357A56" />
      <path d="M40 44 L44 36 L48 44 Z M52 44 L56 36 L60 44 Z" fill="#265E42" />
      <ellipse cx="50" cy="72" rx="15" ry="10" fill="#7A9E86" />
      <ellipse cx="40" cy="56" rx="5" ry="5.5" fill="#D9B84A" />
      <rect x="39" y="53.5" width="2.2" height="6" fill="#1A1A16" />
      <ellipse cx="60" cy="56" rx="5" ry="5.5" fill="#D9B84A" />
      <rect x="58.8" y="53.5" width="2.2" height="6" fill="#1A1A16" />
      <path d="M36 51 Q40 48 44 51 M56 51 Q60 48 64 51" stroke="#1A1A16" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M42 70 L44 76 L47 70 L50 77 L53 70 L56 76 L58 70" fill="none" stroke="#1A1A16" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M37 10 L31 29 L44 26 Z" fill="#265E42" />
      <path d="M63 10 L69 29 L56 26 Z" fill="#265E42" />
      <path d="M14 50 Q-2 44 5 60 Q13 57 21 54 Z" fill="#3E8E64" />
      <path d="M86 50 Q102 44 95 60 Q87 57 79 54 Z" fill="#3E8E64" />
      <ellipse cx="50" cy="60" rx="33" ry="29" fill="#357A56" />
      <path d="M38 40 L43 30 L48 40 Z M52 40 L57 30 L62 40 Z" fill="#265E42" />
      <ellipse cx="50" cy="70" rx="16" ry="11" fill="#7A9E86" />
      <path d="M28 51 Q40 39 50 50 Q60 39 72 51" stroke="#1A1A16" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M32 66 L36 76 L42 66 L46 78 L50 65 L54 78 L58 66 L64 76 L68 66" fill="#7A2020" stroke="#1A1A16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 22 L13 30 M92 22 L87 30" stroke="#FF6F6F" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M40 22 L36 35 L46 32 Z" fill="#265E42" />
      <path d="M60 22 L64 35 L54 32 Z" fill="#265E42" />
      <path d="M20 58 Q10 54 13 64 Q18 62 23 60 Z" fill="#3E8E64" />
      <path d="M80 58 Q90 54 87 64 Q82 62 77 60 Z" fill="#3E8E64" />
      <ellipse cx="50" cy="64" rx="28" ry="24" fill="#357A56" />
      <ellipse cx="50" cy="73" rx="14" ry="9" fill="#7A9E86" />
      <path d="M35 58 Q40 63 45 59" stroke="#1A1A16" strokeWidth="2.4" fill="none" strokeLinecap="round" />
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
      {[...Array(10)].map((_, i) => {
        const a = (i / 10) * Math.PI * 2
        const x = 50 + Math.cos(a) * 30
        const y = 55 + Math.sin(a) * 30
        return <ellipse key={i} cx={x} cy={y} rx="7" ry="4" fill="#C9822E" transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />
      })}
      <ellipse cx="50" cy="58" rx="26" ry="23" fill="#E8A94A" />
      <ellipse cx="50" cy="66" rx="15" ry="12" fill="#FFF3D9" />
      <circle cx="40" cy="54" r="4" fill="#3A2E1E" />
      <circle cx="60" cy="54" r="4" fill="#3A2E1E" />
      <ellipse cx="50" cy="61" rx="3.4" ry="2.4" fill="#3A2E1E" />
      <path d="M46 65 Q50 69 54 65" stroke="#3A2E1E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      {[...Array(12)].map((_, i) => {
        const a = (i / 12) * Math.PI * 2
        const x = 50 + Math.cos(a) * 33
        const y = 54 + Math.sin(a) * 33
        return <ellipse key={i} cx={x} cy={y} rx="8" ry="4.5" fill="#C9822E" transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />
      })}
      <ellipse cx="50" cy="57" rx="28" ry="25" fill="#E8A94A" />
      <ellipse cx="50" cy="66" rx="16" ry="13" fill="#FFF3D9" />
      <path d="M31 51 Q40 41 49 51" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M51 51 Q60 41 69 51" stroke="#3A2E1E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="60" rx="3.6" ry="2.6" fill="#3A2E1E" />
      <path d="M38 64 Q50 79 62 64" stroke="#3A2E1E" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="31" cy="61" r="5" fill="#FFB3A0" opacity="0.75" />
      <circle cx="69" cy="61" r="5" fill="#FFB3A0" opacity="0.75" />
      <path d="M16 30 L20 36 M84 30 L80 36" stroke="#FFC53D" strokeWidth="2.3" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      {[...Array(10)].map((_, i) => {
        const a = (i / 10) * Math.PI * 2
        const x = 50 + Math.cos(a) * 27
        const y = 58 + Math.sin(a) * 27
        return <ellipse key={i} cx={x} cy={y} rx="6" ry="3.5" fill="#C9822E" transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`} />
      })}
      <ellipse cx="50" cy="61" rx="24" ry="21" fill="#E8A94A" />
      <ellipse cx="50" cy="68" rx="14" ry="11" fill="#FFF3D9" />
      <path d="M36 58 Q40 55 44 58" stroke="#3A2E1E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M64 58 Q60 55 56 58" stroke="#3A2E1E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="61" r="2.8" fill="#3A2E1E" />
      <circle cx="60" cy="61" r="2.8" fill="#3A2E1E" />
      <path d="M40 66 Q40 72 38 76" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="77" rx="2" ry="2.6" fill="#7EC8F2" />
      <path d="M45 73 Q50 70 55 73" stroke="#3A2E1E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
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
      <path d="M26 34 L34 22 L40 36 M60 36 L66 22 L74 34 M42 22 L46 12 L50 22 M50 22 L54 12 L58 22" fill="#4A5C33" />
      <ellipse cx="24" cy="60" rx="4.5" ry="3.5" fill="#4A5C33" /><ellipse cx="76" cy="60" rx="4.5" ry="3.5" fill="#4A5C33" />
      <ellipse cx="50" cy="62" rx="32" ry="24" fill="#6B8049" />
      <path d="M50 50 Q40 60 44 70 Q50 74 56 70 Q60 60 50 50 Z" fill="#556B39" opacity="0.6" />
      <ellipse cx="50" cy="70" rx="17" ry="10" fill="#9CAE7A" />
      <path d="M32 55 Q38 51 43 55" stroke="#213B2C" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M68 55 Q62 51 57 55" stroke="#213B2C" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="38" cy="58" r="3.2" fill="#1A1A16" />
      <circle cx="62" cy="58" r="3.2" fill="#1A1A16" />
      <path d="M44 70 L56 70" stroke="#1A1A16" strokeWidth="2.3" fill="none" strokeLinecap="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="28" ry="6" fill="#00000012" />
      <path d="M22 30 L32 16 L39 32 M61 32 L68 16 L78 30 M40 16 L45 5 L50 16 M50 16 L55 5 L60 16" fill="#4A5C33" />
      <ellipse cx="20" cy="58" rx="5" ry="4" fill="#4A5C33" /><ellipse cx="80" cy="58" rx="5" ry="4" fill="#4A5C33" />
      <ellipse cx="50" cy="60" rx="35" ry="27" fill="#6B8049" />
      <path d="M50 47 Q39 58 44 69 Q50 73 56 69 Q61 58 50 47 Z" fill="#556B39" opacity="0.6" />
      <ellipse cx="50" cy="69" rx="18" ry="11" fill="#9CAE7A" />
      <path d="M28 51 Q39 40 50 51" stroke="#1A1A16" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M50 51 Q61 40 72 51" stroke="#1A1A16" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M38 66 L42 74 L48 65 L52 76 L56 65 L62 74 L66 66" fill="none" stroke="#1A1A16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 24 L18 30 M86 24 L82 30" stroke="#FFC53D" strokeWidth="2.3" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="28" ry="6" fill="#00000012" />
      <path d="M29 36 L36 26 L41 38 M59 38 L64 26 L71 36" fill="#4A5C33" />
      <ellipse cx="27" cy="63" rx="4" ry="3.2" fill="#4A5C33" /><ellipse cx="73" cy="63" rx="4" ry="3.2" fill="#4A5C33" />
      <ellipse cx="50" cy="65" rx="29" ry="22" fill="#6B8049" />
      <ellipse cx="50" cy="72" rx="15" ry="9" fill="#9CAE7A" />
      <path d="M35 60 Q39 57 44 60" stroke="#1A1A16" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M65 60 Q61 57 56 60" stroke="#1A1A16" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <circle cx="39" cy="63" r="2.6" fill="#1A1A16" />
      <circle cx="61" cy="63" r="2.6" fill="#1A1A16" />
      <path d="M40 68 Q40 74 38 78" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="79" rx="2" ry="2.6" fill="#7EC8F2" />
      <path d="M45 74 L55 74" stroke="#1A1A16" strokeWidth="2.1" fill="none" strokeLinecap="round" />
    </>
  )
}

// ---- ティラノザウルス ----
const TREX_BODY = {
  idle: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M40 20 L44 10 L48 20 M52 20 L56 10 L60 20" fill="#234A2C" />
      <ellipse cx="50" cy="60" rx="28" ry="26" fill="#2F5A3B" />
      <path d="M50 46 Q41 55 45 66 Q50 70 55 66 Q59 55 50 46 Z" fill="#234A2C" opacity="0.55" />
      <ellipse cx="50" cy="72" rx="14" ry="9" fill="#6E9576" />
      <ellipse cx="39" cy="53" rx="4.6" ry="5" fill="#E8963C" />
      <rect x="38.1" y="50.5" width="1.9" height="5.5" fill="#1A1A16" />
      <path d="M33 49 Q39 46 45 49" stroke="#1A1A16" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="61" cy="53" rx="4.6" ry="5" fill="#E8963C" />
      <rect x="60.1" y="50.5" width="1.9" height="5.5" fill="#1A1A16" />
      <path d="M55 49 Q61 46 67 49" stroke="#1A1A16" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M38 66 L41 72 L45 66 L48 74 L52 66 L55 74 L59 66 L62 72" fill="none" stroke="#1A1A16" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  happy: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M38 12 L43 2 L48 12 M52 12 L57 2 L62 12" fill="#234A2C" />
      <ellipse cx="50" cy="59" rx="31" ry="29" fill="#2F5A3B" />
      <path d="M50 42 Q39 53 44 66 Q50 71 56 66 Q61 53 50 42 Z" fill="#234A2C" opacity="0.55" />
      <ellipse cx="50" cy="70" rx="15" ry="10" fill="#6E9576" />
      <path d="M28 51 Q39 39 50 50 Q61 39 72 51" stroke="#1A1A16" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M32 65 L36 76 L42 65 L46 79 L50 64 L54 79 L58 65 L64 76 L68 65" fill="#7A2020" stroke="#1A1A16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 22 L15 28 M90 22 L85 28" stroke="#FF6F6F" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  sad: (
    <>
      <ellipse cx="50" cy="85" rx="26" ry="6" fill="#00000012" />
      <path d="M42 24 L45 15 L48 24 M52 24 L55 15 L58 24" fill="#234A2C" />
      <ellipse cx="50" cy="64" rx="27" ry="23" fill="#2F5A3B" />
      <ellipse cx="50" cy="74" rx="13" ry="8" fill="#6E9576" />
      <path d="M34 57 Q40 62 46 58" stroke="#1A1A16" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M66 57 Q60 62 54 58" stroke="#1A1A16" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <ellipse cx="40" cy="62" rx="3.4" ry="3.8" fill="#E8963C" />
      <rect x="39.2" y="60" width="1.6" height="4.2" fill="#1A1A16" />
      <ellipse cx="60" cy="62" rx="3.4" ry="3.8" fill="#E8963C" />
      <rect x="59.2" y="60" width="1.6" height="4.2" fill="#1A1A16" />
      <path d="M43 71 L46 76 L50 72 L54 76 L57 71" fill="none" stroke="#1A1A16" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 67 Q40 73 38 77" stroke="#7EC8F2" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="78" rx="2" ry="2.6" fill="#7EC8F2" />
    </>
  )
}

const BODIES = {
  fox: FOX_BODY, cat: CAT_BODY, dog: DOG_BODY, dragon: DRAGON_BODY,
  lion: LION_BODY, pig: PIG_BODY, cheetah: CHEETAH_BODY, robot: ROBOT_BODY,
  ankylosaurus: ANKY_BODY, trex: TREX_BODY
}

// ============================================================
// アクセサリー（同じ座標系に正しい部位で重ねる。front=前面 / back=体より奥）
// ============================================================
const ITEM_FRAGMENTS = {
  // ---- 共通（きつね/ねこ/いぬ/ドラゴン すべてで使う）----
  glasses: { front: (
    <g>
      <ellipse cx="40" cy="56" rx="8" ry="6" fill="#2B2A27" opacity="0.88" />
      <ellipse cx="60" cy="56" rx="8" ry="6" fill="#2B2A27" opacity="0.88" />
      <path d="M48 56 L52 56" stroke="#2B2A27" strokeWidth="2.5" />
      <path d="M32 54 L26 51 M68 54 L74 51" stroke="#2B2A27" strokeWidth="2" strokeLinecap="round" />
    </g>
  )},
  bell: { front: (
    <g>
      <path d="M34 78 Q50 88 66 78" stroke="#D94848" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="86" r="5" fill="#FFC53D" stroke="#B5860B" strokeWidth="1" />
      <circle cx="50" cy="87.5" r="1.3" fill="#B5860B" />
    </g>
  )},
  crown: { front: (
    <g>
      <path d="M32 36 L36 24 L44 33 L50 21 L56 33 L64 24 L68 36 Z" fill="#FFC53D" stroke="#B5860B" strokeWidth="1.2" />
      <circle cx="50" cy="29" r="2.4" fill="#D94848" />
      <circle cx="40" cy="32" r="1.8" fill="#4FB6E8" />
      <circle cx="60" cy="32" r="1.8" fill="#4FB6E8" />
    </g>
  )},

  // ---- きつね専用 ----
  hat_leaf: { front: (
    <path d="M50 24 Q40 30 44 40 Q50 44 56 40 Q60 30 50 24 Z" fill="#4CB27A" stroke="#2E8956" strokeWidth="1" />
  )},
  bowtie: { front: (
    <g>
      <path d="M50 80 L38 74 L38 86 Z" fill="#FF6F6F" />
      <path d="M50 80 L62 74 L62 86 Z" fill="#FF6F6F" />
      <circle cx="50" cy="80" r="3" fill="#D94848" />
    </g>
  )},
  scarf_red: { front: (
    <g>
      <path d="M28 74 Q50 90 72 74 L72 80 Q50 96 28 80 Z" fill="#D94848" />
      <path d="M46 88 L44 98 L52 96 L50 88 Z" fill="#D94848" />
    </g>
  )},
  flower: { front: (
    <g transform="translate(66,32)">
      <circle cx="0" cy="-6" r="4" fill="#FF9EB5" /><circle cx="5" cy="-2" r="4" fill="#FF9EB5" />
      <circle cx="3" cy="4" r="4" fill="#FF9EB5" /><circle cx="-3" cy="4" r="4" fill="#FF9EB5" />
      <circle cx="-5" cy="-2" r="4" fill="#FF9EB5" /><circle cx="0" cy="0" r="3" fill="#FFC53D" />
    </g>
  )},
  star_badge: { front: (
    <path d="M50 63 L52.5 69 L59 69 L53.8 73 L55.8 79 L50 75.3 L44.2 79 L46.2 73 L41 69 L47.5 69 Z" fill="#FFC53D" stroke="#B5860B" strokeWidth="0.8" />
  )},
  cape: { back: (
    <path d="M28 46 Q20 80 34 92 Q50 84 66 92 Q80 80 72 46 Q50 58 28 46 Z" fill="#D94848" opacity="0.92" />
  )},
  wings: { back: (
    <g opacity="0.9">
      <path d="M22 55 Q4 50 8 66 Q16 68 26 62 Z" fill="#F4F1EE" stroke="#D8D2C0" strokeWidth="1" />
      <path d="M78 55 Q96 50 92 66 Q84 68 74 62 Z" fill="#F4F1EE" stroke="#D8D2C0" strokeWidth="1" />
    </g>
  )},

  // ---- ねこ専用 ----
  yarn: { front: (
    <g transform="translate(80,76)">
      <circle r="9" fill="#9B7FE0" />
      <path d="M-6 -3 Q0 0 6 -3 M-6 3 Q0 0 6 3 M-6 0 L6 0" stroke="#7A63BD" strokeWidth="1" fill="none" />
    </g>
  )},
  ribbon: { front: (
    <g>
      <path d="M50 79 L39 73 L39 85 Z" fill="#FF9EB5" />
      <path d="M50 79 L61 73 L61 85 Z" fill="#FF9EB5" />
      <circle cx="50" cy="79" r="3" fill="#D9648A" />
    </g>
  )},
  fish: { front: (
    <g transform="translate(80,76) rotate(-15)">
      <ellipse cx="0" cy="0" rx="10" ry="5" fill="#7EC8F2" />
      <path d="M9 0 L16 -5 L16 5 Z" fill="#7EC8F2" />
      <circle cx="-5" cy="-1" r="1.2" fill="#213B2C" />
    </g>
  )},
  milk: { front: (
    <g>
      <path d="M36 64 Q50 74 64 64 L61 82 Q50 88 39 82 Z" fill="#FFFFFF" opacity="0.92" stroke="#E4E0D3" strokeWidth="1" />
      <circle cx="50" cy="74" r="4" fill="#7EC8F2" opacity="0.6" />
    </g>
  )},
  straw_hat: { front: (
    <g>
      <ellipse cx="50" cy="36" rx="26" ry="6" fill="#E8C77D" stroke="#C9A85C" strokeWidth="1" />
      <path d="M38 22 Q50 16 62 22 L60 36 L40 36 Z" fill="#F0D796" stroke="#C9A85C" strokeWidth="1" />
      <path d="M39 30 L61 30" stroke="#D94848" strokeWidth="2.5" />
    </g>
  )},
  top_hat: { front: (
    <g>
      <ellipse cx="50" cy="35" rx="18" ry="4.5" fill="#2B2A27" />
      <rect x="40" y="14" width="20" height="21" rx="2" fill="#2B2A27" />
      <rect x="40" y="27" width="20" height="4" fill="#D94848" />
    </g>
  )},
  jewel_collar: { front: (
    <g>
      <path d="M30 76 Q50 90 70 76" stroke="#FFC53D" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M46 84 L50 91 L54 84 Z" fill="#4FB6E8" stroke="#2E7FA6" strokeWidth="0.8" />
    </g>
  )},

  // ---- いぬ専用 ----
  bone: { front: (
    <g transform="translate(80,78) rotate(20)">
      <rect x="-10" y="-3" width="20" height="6" rx="3" fill="#F4F1EE" stroke="#D8D2C0" strokeWidth="1" />
      <circle cx="-10" cy="-3" r="3" fill="#F4F1EE" stroke="#D8D2C0" strokeWidth="1" />
      <circle cx="-10" cy="3" r="3" fill="#F4F1EE" stroke="#D8D2C0" strokeWidth="1" />
      <circle cx="10" cy="-3" r="3" fill="#F4F1EE" stroke="#D8D2C0" strokeWidth="1" />
      <circle cx="10" cy="3" r="3" fill="#F4F1EE" stroke="#D8D2C0" strokeWidth="1" />
    </g>
  )},
  ball: { front: (
    <g transform="translate(80,77)">
      <circle r="8" fill="#C7E85A" stroke="#9CB53F" strokeWidth="1" />
      <path d="M-6 -4 Q0 0 -6 4 M6 -4 Q0 0 6 4" stroke="#9CB53F" strokeWidth="1" fill="none" />
    </g>
  )},
  scarf: { front: (
    <g>
      <path d="M28 74 Q50 90 72 74 L72 80 Q50 96 28 80 Z" fill="#4FB6E8" />
      <path d="M46 88 L44 98 L52 96 L50 88 Z" fill="#4FB6E8" />
    </g>
  )},
  paw_print: { front: (
    <g>
      <path d="M30 76 Q50 92 70 76 L67 84 Q50 96 33 84 Z" fill="#E8A24A" />
      <circle cx="50" cy="82" r="3.5" fill="#FBEEDA" />
      <circle cx="43" cy="79" r="2" fill="#FBEEDA" /><circle cx="57" cy="79" r="2" fill="#FBEEDA" />
    </g>
  )},
  grad_cap: { front: (
    <g>
      <rect x="34" y="30" width="32" height="5" fill="#2B2A27" />
      <path d="M20 32 L50 22 L80 32 L50 40 Z" fill="#2B2A27" />
      <path d="M74 33 L78 33 L78 44 L74 42 Z" fill="#2B2A27" />
      <circle cx="76" cy="45" r="2" fill="#FFC53D" />
    </g>
  )},
  vest: { front: (
    <g>
      <path d="M36 60 L36 84 Q50 90 64 84 L64 60 L56 66 L50 60 L44 66 Z" fill="#FF9A45" opacity="0.92" stroke="#C9741E" strokeWidth="1" />
      <circle cx="50" cy="76" r="1.6" fill="#C9741E" />
    </g>
  )},
  medal: { front: (
    <g>
      <path d="M43 60 L50 78 L57 60" stroke="#4FB6E8" strokeWidth="4" fill="none" />
      <circle cx="50" cy="83" r="7" fill="#FFC53D" stroke="#B5860B" strokeWidth="1.2" />
      <path d="M50 79 L51.5 82.5 L55 82.5 L52.2 84.7 L53.3 88 L50 86 L46.7 88 L47.8 84.7 L45 82.5 L48.5 82.5 Z" fill="#B5860B" />
    </g>
  )},

  // ---- ドラゴン専用 ----
  gem: { front: (
    <path d="M50 64 L58 70 L54 80 L46 80 L42 70 Z" fill="#4FB6E8" stroke="#2E7FA6" strokeWidth="1" />
  )},
  flame: { front: (
    <g>
      <path d="M44 22 Q40 30 45 34 Q42 26 48 20 Q50 28 54 22 Q58 30 52 36 Q60 30 56 20 Q50 12 44 22 Z" fill="#FF6F6F" />
    </g>
  )},
  sword: { front: (
    <g transform="translate(78,68) rotate(20)">
      <rect x="-2" y="-20" width="4" height="24" fill="#C7C2B4" />
      <rect x="-7" y="3" width="14" height="4" fill="#B5860B" />
      <rect x="-2.5" y="6" width="5" height="8" fill="#8A6D2A" />
    </g>
  )},
  shield: { front: (
    <g transform="translate(20,70)">
      <path d="M0 -12 L10 -8 L10 4 Q10 12 0 16 Q-10 12 -10 4 L-10 -8 Z" fill="#4FB6E8" stroke="#2E7FA6" strokeWidth="1.2" />
      <path d="M0 -6 L0 10 M-5 0 L5 0" stroke="#FFF" strokeWidth="1.5" />
    </g>
  )},
  ring: { front: (
    <g transform="translate(78,80)">
      <circle r="6" fill="none" stroke="#FFC53D" strokeWidth="2.5" />
      <path d="M0 -6 L-3 -11 L3 -11 Z" fill="#D94848" />
    </g>
  )},
  lightning: { front: (
    <path d="M53 60 L44 72 L49 72 L46 82 L58 68 L52 68 Z" fill="#FFC53D" stroke="#B5860B" strokeWidth="0.8" />
  )},
  trophy: { front: (
    <g transform="translate(20,72)">
      <path d="M-7 -10 L7 -10 L6 -2 Q6 4 0 4 Q-6 4 -6 -2 Z" fill="#FFC53D" stroke="#B5860B" strokeWidth="1" />
      <path d="M-7 -9 Q-13 -9 -12 -3 Q-10 0 -6 -1" fill="none" stroke="#B5860B" strokeWidth="1.3" />
      <path d="M7 -9 Q13 -9 12 -3 Q10 0 6 -1" fill="none" stroke="#B5860B" strokeWidth="1.3" />
      <rect x="-2.5" y="4" width="5" height="5" fill="#B5860B" />
      <rect x="-6" y="9" width="12" height="3" fill="#8A6D2A" />
    </g>
  )},
  star_gem: { front: (
    <path d="M50 62 L53 70 L61 70 L54.5 75 L57 83 L50 78 L43 83 L45.5 75 L39 70 L47 70 Z" fill="#9B7FE0" stroke="#7A63BD" strokeWidth="0.8" />
  )},

  // ---- ライオン専用 ----
  mane_bow: { front: (
    <g><path d="M50 30 L40 24 L40 36 Z" fill="#D94848" /><path d="M50 30 L60 24 L60 36 Z" fill="#D94848" /><circle cx="50" cy="30" r="2.8" fill="#B03A3A" /></g>
  )},
  bandana: { front: (
    <path d="M28 74 Q50 90 72 74 L72 80 Q50 96 28 80 Z" fill="#4FB6E8" />
  )},
  cape_royal: { back: (
    <path d="M26 44 Q18 78 32 90 Q50 82 68 90 Q82 78 74 44 Q50 56 26 44 Z" fill="#9B7FE0" opacity="0.92" />
  )},
  paw_gem: { front: (
    <path d="M50 65 L58 71 L54 81 L46 81 L42 71 Z" fill="#9B7FE0" stroke="#7A63BD" strokeWidth="1" />
  )},
  scepter: { front: (
    <g transform="translate(80,72) rotate(15)">
      <rect x="-1.5" y="-4" width="3" height="26" fill="#B5860B" />
      <circle cy="-8" r="5" fill="#FFC53D" stroke="#B5860B" strokeWidth="1" />
    </g>
  )},
  sun_crown: { front: (
    <g>
      {[...Array(8)].map((_, i) => {
        const a = (i / 8) * Math.PI * 2
        return <path key={i} d={`M50 32 L${50 + Math.cos(a) * 14} ${32 + Math.sin(a) * 14}`} stroke="#FFC53D" strokeWidth="2.5" strokeLinecap="round" />
      })}
      <circle cx="50" cy="32" r="9" fill="#FFC53D" stroke="#B5860B" strokeWidth="1" />
    </g>
  )},

  // ---- ブタ専用 ----
  flower_crown: { front: (
    <g>
      {[...Array(5)].map((_, i) => {
        const x = 30 + i * 10
        return <circle key={i} cx={x} cy={i % 2 === 0 ? 32 : 28} r="4.5" fill="#FF9EB5" />
      })}
    </g>
  )},
  apron: { front: (
    <path d="M38 60 L62 60 L60 84 Q50 89 40 84 Z" fill="#7EC8F2" opacity="0.9" stroke="#4FB6E8" strokeWidth="1" />
  )},
  mud_badge: { front: (
    <ellipse cx="58" cy="70" rx="7" ry="5" fill="#8A6D4A" opacity="0.85" />
  )},
  basket: { front: (
    <g transform="translate(80,76)">
      <path d="M-8 -2 L8 -2 L6 6 L-6 6 Z" fill="#C9975B" />
      <path d="M-6 -2 Q0 -10 6 -2" fill="none" stroke="#8A6D4A" strokeWidth="1.5" />
    </g>
  )},

  // ---- チーター専用 ----
  headband: { front: (
    <path d="M25 46 Q50 38 75 46 L75 51 Q50 44 25 51 Z" fill="#D94848" />
  )},
  scarf_speed: { front: (
    <path d="M28 74 Q50 90 72 74 L72 80 Q50 96 28 80 Z" fill="#FFC53D" />
  )},
  race_medal: { front: (
    <g>
      <path d="M43 60 L50 78 L57 60" stroke="#4FB6E8" strokeWidth="4" fill="none" />
      <circle cx="50" cy="83" r="7" fill="#C7C2B4" stroke="#8A8678" strokeWidth="1.2" />
    </g>
  )},
  cape_wind: { back: (
    <path d="M28 46 Q20 78 34 90 Q50 82 66 90 Q80 78 72 46 Q50 58 28 46 Z" fill="#5FD0F2" opacity="0.85" />
  )},
  lightning_badge: { front: (
    <path d="M53 60 L44 72 L49 72 L46 82 L58 68 L52 68 Z" fill="#FFC53D" stroke="#B5860B" strokeWidth="0.8" />
  )},
  flag: { front: (
    <g transform="translate(80,64)">
      <rect x="0" y="0" width="2" height="24" fill="#8A8678" />
      <path d="M2 0 L18 4 L2 8 Z" fill="#F4F1EE" stroke="#2B2A27" strokeWidth="0.7" />
    </g>
  )},

  // ---- ロボット専用 ----
  propeller_hat: { front: (
    <g>
      <path d="M36 24 Q50 16 64 24 L62 34 L38 34 Z" fill="#D94848" />
      <rect x="48" y="12" width="4" height="12" fill="#8A8678" />
      <ellipse cx="50" cy="10" rx="10" ry="2.5" fill="#4FB6E8" />
    </g>
  )},
  battery_badge: { front: (
    <g><rect x="42" y="62" width="16" height="10" rx="1.5" fill="#4CB27A" /><rect x="47" y="60" width="6" height="3" fill="#4CB27A" /></g>
  )},
  wrench: { front: (
    <g transform="translate(80,74) rotate(30)">
      <rect x="-2" y="-14" width="4" height="22" fill="#8B95A3" />
      <circle cx="0" cy="-14" r="5" fill="none" stroke="#8B95A3" strokeWidth="3" />
    </g>
  )},
  gear_badge: { front: (
    <g transform="translate(50,70)">
      <circle r="7" fill="#B0B7C0" stroke="#7A8494" strokeWidth="1" />
      {[...Array(6)].map((_, i) => {
        const a = (i / 6) * Math.PI * 2
        return <rect key={i} x={-1.3} y={-9.5} width="2.6" height="4" fill="#7A8494" transform={`rotate(${(a * 180) / Math.PI})`} />
      })}
    </g>
  )},
  antenna_dish: { front: (
    <g transform="translate(78,30)">
      <path d="M-8 4 Q0 -8 8 4 Z" fill="#B0B7C0" stroke="#7A8494" strokeWidth="1" />
      <circle r="1.6" fill="#5FD0F2" />
    </g>
  )},

  // ---- アンキロサウルス専用 ----
  shield_badge: { front: (
    <path d="M50 62 L60 66 L60 76 Q60 84 50 88 Q40 84 40 76 L40 66 Z" fill="#4FB6E8" stroke="#2E7FA6" strokeWidth="1.2" />
  )},
  rock: { front: (
    <path d="M72 70 L80 68 L86 74 L82 80 L74 80 Z" fill="#9C9A93" stroke="#7A776E" strokeWidth="1" />
  )},
  armor_badge: { front: (
    <g><path d="M38 62 L50 58 L62 62 L62 72 L50 76 L38 72 Z" fill="#7C9459" stroke="#5E7842" strokeWidth="1" /></g>
  )},
  spike_crown: { front: (
    <g fill="#8A9C6E">
      <path d="M36 36 L40 24 L44 36 Z" /><path d="M46 34 L50 20 L54 34 Z" /><path d="M56 36 L60 24 L64 36 Z" />
    </g>
  )},

  // ---- ティラノザウルス専用 ----
  tooth_necklace: { front: (
    <g>
      <path d="M32 76 Q50 88 68 76" stroke="#8A6D2A" strokeWidth="2.5" fill="none" />
      <path d="M42 82 L44 90 L46 82 Z M50 84 L52 92 L54 84 Z M58 82 L60 90 L62 82 Z" fill="#F4F1EE" />
    </g>
  )},
  claw_gem: { front: (
    <path d="M50 64 L57 74 L50 84 L43 74 Z" fill="#4CB27A" stroke="#2E8956" strokeWidth="1" />
  )},
  spike_crest: { front: (
    <g fill="#3D7249">
      <path d="M38 34 L42 22 L46 34 Z" /><path d="M46 32 L50 18 L54 32 Z" /><path d="M54 34 L58 22 L62 34 Z" />
    </g>
  )},
  meteor_badge: { front: (
    <g transform="translate(50,68)">
      <circle r="6" fill="#D94848" />
      <path d="M4 -4 L12 -12 M6 0 L15 -3 M4 4 L10 8" stroke="#FFC53D" strokeWidth="2" strokeLinecap="round" />
    </g>
  )}
}

export default function Character({ character = 'fox', state, accessory }) {
  const cls = state === 'happy' ? 'fox happy' : state === 'sad' ? 'fox sad' : 'fox'
  const body = (BODIES[character] || BODIES.fox)[state] || (BODIES[character] || BODIES.fox).idle
  const frag = accessory ? ITEM_FRAGMENTS[accessory] : null

  return (
    <div className={cls}>
      <svg viewBox="0 0 100 100">
        {frag?.back}
        {body}
        {frag?.front}
      </svg>
    </div>
  )
}
