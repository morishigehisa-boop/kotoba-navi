// ============================================================
// アクセサリー（同じ座標系に正しい部位で重ねる。front=前面 / back=体より奥）
// ============================================================
export const ITEM_FRAGMENTS = {
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
  )},

  // ---- ピカさん専用 ----
  energy_ball: { front: (
    <g transform="translate(80,74)">
      <circle r="9" fill="#F4F1EE" stroke="#2B2A27" strokeWidth="1.4" />
      <path d="M-9 0 L9 0" stroke="#2B2A27" strokeWidth="1.4" />
      <path d="M-9 0 A9 9 0 0 1 9 0" fill="#D94848" stroke="#2B2A27" strokeWidth="1.4" />
      <circle r="2.6" fill="#F4F1EE" stroke="#2B2A27" strokeWidth="1.2" />
    </g>
  )},

  // ---- ドラさん専用 ----
  dorayaki: { front: (
    <g transform="translate(80,76)">
      <ellipse cx="0" cy="-3" rx="11" ry="6" fill="#E8B94A" stroke="#B5860B" strokeWidth="1" />
      <ellipse cx="0" cy="3" rx="11" ry="6" fill="#E8B94A" stroke="#B5860B" strokeWidth="1" />
      <ellipse cx="0" cy="0" rx="11" ry="3" fill="#8A5A2A" />
    </g>
  )},
  taketombo: { front: (
    <g transform="translate(50,26)">
      <rect x="-1.5" y="0" width="3" height="14" fill="#8A6D2A" />
      <ellipse cx="0" cy="-2" rx="16" ry="3.2" fill="#4CB27A" stroke="#2E8956" strokeWidth="1" />
    </g>
  )},
  mystery_door: { back: (
    <g>
      <rect x="30" y="30" width="40" height="58" rx="4" fill="#FF9EB5" stroke="#D9648A" strokeWidth="1.5" />
      <circle cx="62" cy="60" r="2.4" fill="#D9648A" />
    </g>
  )},
  pouch: { front: (
    <path d="M36 62 Q50 56 64 62 L61 82 Q50 88 39 82 Z" fill="#4A90D9" opacity="0.9" stroke="#2E5F94" strokeWidth="1" />
  )},
  big_light: { front: (
    <g transform="translate(78,72) rotate(-20)">
      <rect x="-4" y="0" width="8" height="18" rx="2" fill="#F5C518" stroke="#B5860B" strokeWidth="1" />
      <path d="M-5 0 L0 -9 L5 0 Z" fill="#FFF3C4" stroke="#B5860B" strokeWidth="1" />
      <path d="M-9 -10 L-13 -14 M9 -10 L13 -14 M0 -13 L0 -18" stroke="#FFC53D" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  )},
  small_tunnel: { front: (
    <g transform="translate(78,74)">
      <ellipse rx="11" ry="13" fill="#2B2A27" />
      <ellipse rx="7" ry="9" fill="#4A4A46" />
      <ellipse rx="3.5" ry="4.5" fill="#171715" />
    </g>
  )},

  // ---- スポンジくん専用 ----
  burger: { front: (
    <g transform="translate(80,76)">
      <path d="M-10 -6 Q0 -13 10 -6 Z" fill="#D9A05C" />
      <rect x="-10" y="-6" width="20" height="3" fill="#6B9E4A" />
      <rect x="-10" y="-3" width="20" height="4" fill="#8C5A2A" />
      <rect x="-10" y="1" width="20" height="3" fill="#D94848" />
      <path d="M-10 4 Q0 9 10 4 Z" fill="#E8B96A" />
    </g>
  )},
  juice: { front: (
    <g transform="translate(80,76)">
      <path d="M-6 -10 L6 -10 L5 10 L-5 10 Z" fill="#FFC53D" stroke="#B5860B" strokeWidth="1" />
      <rect x="-6" y="-13" width="12" height="4" fill="#4CB27A" />
      <rect x="-1.5" y="-18" width="3" height="6" fill="#4CB27A" />
      <path d="M-4 -6 L4 -6 M-4 -2 L4 -2 M-4 2 L4 2" stroke="#FFF3C4" strokeWidth="1.2" opacity="0.7" />
    </g>
  )},
  shrimp: { front: (
    <g transform="translate(80,76) rotate(-10)">
      <path d="M-10 4 Q-4 -8 8 -4 Q12 -2 8 2 Q2 -2 -2 4 Q-4 8 -10 4 Z" fill="#FF9E7A" stroke="#D9724A" strokeWidth="1" />
      <path d="M6 -6 L10 -10 M8 -3 L13 -5" stroke="#D9724A" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  )},
  crab: { front: (
    <g transform="translate(80,76)">
      <ellipse rx="10" ry="7" fill="#E8654A" stroke="#C9432A" strokeWidth="1" />
      <path d="M-9 -3 L-15 -8 M9 -3 L15 -8" stroke="#C9432A" strokeWidth="2" strokeLinecap="round" />
      <circle cx="-15" cy="-9" r="2.5" fill="#E8654A" stroke="#C9432A" strokeWidth="1" />
      <circle cx="15" cy="-9" r="2.5" fill="#E8654A" stroke="#C9432A" strokeWidth="1" />
      <path d="M-6 4 L-8 8 M0 5 L0 9 M6 4 L8 8" stroke="#C9432A" strokeWidth="1.3" strokeLinecap="round" />
    </g>
  )},
  bubble: { front: (
    <g>
      <circle cx="72" cy="34" r="6" fill="#DCF3FB" opacity="0.8" stroke="#7EC8F2" strokeWidth="1" />
      <circle cx="80" cy="46" r="4" fill="#DCF3FB" opacity="0.8" stroke="#7EC8F2" strokeWidth="1" />
      <circle cx="26" cy="30" r="4.5" fill="#DCF3FB" opacity="0.8" stroke="#7EC8F2" strokeWidth="1" />
    </g>
  )},
  chef_hat: { front: (
    <g>
      <rect x="38" y="24" width="24" height="12" rx="2" fill="#FFFFFF" stroke="#E4E0D3" strokeWidth="1" />
      <path d="M36 24 Q36 10 44 14 Q46 6 50 14 Q54 6 56 14 Q64 10 64 24 Z" fill="#FFFFFF" stroke="#E4E0D3" strokeWidth="1" />
    </g>
  )},

  // ---- くれさん専用 ----
  cap: { front: (
    <g>
      <path d="M34 38 Q50 24 66 38 L64 44 L36 44 Z" fill="#4FB6E8" stroke="#2E7FA6" strokeWidth="1" />
      <ellipse cx="50" cy="44" rx="20" ry="4" fill="#2E7FA6" />
    </g>
  )},
  crayon: { front: (
    <g transform="translate(80,74) rotate(20)">
      <rect x="-3" y="-14" width="6" height="20" rx="1" fill="#FF6F6F" />
      <path d="M-3 -14 L0 -20 L3 -14 Z" fill="#D94848" />
      <rect x="-3" y="2" width="6" height="4" fill="#F4F1EE" />
    </g>
  )},
  soccer_ball: { front: (
    <g transform="translate(80,76)">
      <circle r="8" fill="#F4F1EE" stroke="#2B2A27" strokeWidth="1" />
      <path d="M0 -8 L3 -2 L-3 -2 Z M-6 3 L0 -2 L3 3 L0 6 Z" fill="#2B2A27" />
    </g>
  )},
  backpack: { front: (
    <g>
      <rect x="36" y="60" width="28" height="26" rx="8" fill="#4CB27A" stroke="#2E8956" strokeWidth="1" />
      <rect x="42" y="64" width="16" height="8" rx="3" fill="#2E8956" />
      <path d="M40 60 Q40 52 50 52 Q60 52 60 60" fill="none" stroke="#2E8956" strokeWidth="2.5" />
    </g>
  )},
  toy_robot: { front: (
    <g transform="translate(80,72)">
      <rect x="-8" y="-4" width="16" height="14" rx="2" fill="#B0B7C0" stroke="#7A8494" strokeWidth="1" />
      <circle cx="-4" cy="2" r="1.6" fill="#5FD0F2" />
      <circle cx="4" cy="2" r="1.6" fill="#5FD0F2" />
      <rect x="-6" y="-9" width="12" height="6" rx="2" fill="#B0B7C0" stroke="#7A8494" strokeWidth="1" />
      <rect x="-1" y="-13" width="2" height="4" fill="#7A8494" />
    </g>
  )},

  // ---- こうらくん専用 ----
  pearl: { front: (
    <g transform="translate(80,76)">
      <circle r="7" fill="#F4F1EE" stroke="#D8D2C0" strokeWidth="1" />
      <circle cx="-2.5" cy="-2.5" r="2" fill="#FFFFFF" opacity="0.8" />
    </g>
  )},
  anchor: { front: (
    <g transform="translate(80,74)">
      <circle cy="-10" r="2.6" fill="none" stroke="#7A8494" strokeWidth="2" />
      <rect x="-1.3" y="-7" width="2.6" height="16" fill="#7A8494" />
      <path d="M-7 6 Q0 13 7 6" fill="none" stroke="#7A8494" strokeWidth="2.4" />
      <rect x="-6" y="-1" width="12" height="2.4" fill="#7A8494" />
    </g>
  )},
  treasure_chest: { front: (
    <g transform="translate(80,76)">
      <rect x="-10" y="-4" width="20" height="12" rx="1" fill="#8A5A2A" stroke="#5C3A1A" strokeWidth="1" />
      <path d="M-10 -4 Q0 -12 10 -4 Z" fill="#B5793E" stroke="#5C3A1A" strokeWidth="1" />
      <circle cy="-1" r="1.6" fill="#FFC53D" />
    </g>
  )},
  captain_hat: { front: (
    <g>
      <path d="M32 36 Q50 26 68 36 L66 42 L34 42 Z" fill="#2B4A6B" stroke="#1A2E42" strokeWidth="1" />
      <circle cx="50" cy="33" r="3" fill="#FFC53D" />
      <rect x="34" y="42" width="32" height="3" fill="#1A2E42" />
    </g>
  )},
  ship_wheel: { front: (
    <g transform="translate(80,76)">
      <circle r="9" fill="none" stroke="#8A5A2A" strokeWidth="2.5" />
      <circle r="3" fill="#8A5A2A" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line key={deg} x1="0" y1="0" x2={9 * Math.cos((deg * Math.PI) / 180)} y2={9 * Math.sin((deg * Math.PI) / 180)} stroke="#8A5A2A" strokeWidth="2" transform={`rotate(${deg})`} />
      ))}
    </g>
  )},
  coin: { front: (
    <g transform="translate(80,76)">
      <circle r="7" fill="#FFC53D" stroke="#B5860B" strokeWidth="1.2" />
      <text x="0" y="3" textAnchor="middle" fontSize="8" fill="#B5860B" fontWeight="800">¥</text>
    </g>
  )},
  telescope: { front: (
    <g transform="translate(78,72) rotate(-25)">
      <rect x="-2" y="-4" width="16" height="6" rx="1" fill="#B5860B" />
      <rect x="12" y="-5.5" width="6" height="9" rx="1" fill="#8A6D2A" />
    </g>
  )},

  // ---- ブロックにんげん・クリーピー専用 ----
  pickaxe: { front: (
    <g transform="translate(80,72) rotate(-30)">
      <rect x="-1.6" y="-4" width="3.2" height="20" fill="#8A6D2A" />
      <path d="M-10 -6 Q0 -14 10 -6 Q4 -2 0 -3 Q-4 -2 -10 -6 Z" fill="#8B95A3" stroke="#5A6270" strokeWidth="1" />
    </g>
  )},
  apple: { front: (
    <g transform="translate(80,76)">
      <circle r="7" fill="#D94848" />
      <rect x="-1" y="-10" width="2" height="4" fill="#5E7842" />
      <path d="M-3 -5 Q0 -8 3 -5" stroke="#FFB3A0" strokeWidth="1.4" fill="none" opacity="0.6" />
    </g>
  )},
  torch: { front: (
    <g transform="translate(80,72)">
      <rect x="-2" y="-2" width="4" height="18" fill="#8A6D2A" />
      <path d="M-5 -4 Q0 -14 5 -4 Q2 -8 0 -6 Q-2 -8 -5 -4 Z" fill="#FF9E45" />
      <path d="M-3 -5 Q0 -10 3 -5" fill="#FFC53D" />
    </g>
  )},
  bomb_badge: { front: (
    <g transform="translate(80,72)">
      <circle r="7" fill="#2B2A27" />
      <rect x="-1.3" y="-11" width="2.6" height="5" fill="#5A5A5A" />
      <path d="M0 -11 Q3 -14 5 -11" stroke="#FF9E45" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M-2 -1 L2 3 M2 -1 L-2 3" stroke="#FFC53D" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  )},

  // ---- マリさん・こうらおう・ゴリさん専用 ----
  green_mushroom: { front: (
    <g transform="translate(80,74)">
      <path d="M-9 0 Q-9 -10 0 -10 Q9 -10 9 0 Z" fill="#4CB27A" />
      <circle cx="-3" cy="-6" r="2" fill="#fff" />
      <circle cx="4" cy="-4" r="1.6" fill="#fff" />
      <rect x="-5" y="0" width="10" height="8" rx="2" fill="#FFF3E1" />
    </g>
  )},
  red_mushroom: { front: (
    <g transform="translate(80,74)">
      <path d="M-9 0 Q-9 -10 0 -10 Q9 -10 9 0 Z" fill="#D94848" />
      <circle cx="-3" cy="-6" r="2" fill="#fff" />
      <circle cx="4" cy="-4" r="1.6" fill="#fff" />
      <rect x="-5" y="0" width="10" height="8" rx="2" fill="#FFF3E1" />
    </g>
  )},
  shell: { front: (
    <g transform="translate(80,76)">
      <path d="M-9 4 Q-9 -8 0 -8 Q9 -8 9 4 Z" fill="#4CB27A" stroke="#2E8956" strokeWidth="1" />
      <path d="M-6 2 L0 -4 L6 2 M-9 4 L9 4" stroke="#2E8956" strokeWidth="1" fill="none" />
    </g>
  )},
  banana: { front: (
    <g transform="translate(80,76) rotate(-15)">
      <path d="M-8 4 Q-4 -8 8 -6 Q4 -2 2 2 Q-2 4 -8 4 Z" fill="#FFD93D" stroke="#D9A82A" strokeWidth="1" />
    </g>
  )},
  pipe: { front: (
    <g transform="translate(80,74)">
      <rect x="-8" y="-4" width="16" height="18" rx="1" fill="#4CB27A" stroke="#2E8956" strokeWidth="1" />
      <rect x="-10" y="-8" width="20" height="6" rx="1" fill="#5FCB92" stroke="#2E8956" strokeWidth="1" />
    </g>
  )},
  axe: { front: (
    <g transform="translate(80,72) rotate(-20)">
      <rect x="-1.6" y="-4" width="3.2" height="20" fill="#8A6D2A" />
      <path d="M-8 -8 Q0 -14 8 -8 Q4 -4 0 -5 Q-4 -4 -8 -8 Z" fill="#8B95A3" stroke="#5A6270" strokeWidth="1" />
    </g>
  )},
  castle: { front: (
    <g>
      <rect x="34" y="30" width="32" height="16" fill="#D8D2C0" stroke="#8A8678" strokeWidth="1" />
      <rect x="34" y="24" width="6" height="8" fill="#D8D2C0" stroke="#8A8678" strokeWidth="1" />
      <rect x="46" y="20" width="8" height="12" fill="#D8D2C0" stroke="#8A8678" strokeWidth="1" />
      <rect x="60" y="24" width="6" height="8" fill="#D8D2C0" stroke="#8A8678" strokeWidth="1" />
      <rect x="44" y="38" width="12" height="8" fill="#5A4A3A" />
    </g>
  )},
  barrel: { front: (
    <g transform="translate(80,74)">
      <rect x="-8" y="-10" width="16" height="20" rx="4" fill="#B5793E" stroke="#5C3A1A" strokeWidth="1" />
      <rect x="-8" y="-5" width="16" height="2.5" fill="#5C3A1A" />
      <rect x="-8" y="3" width="16" height="2.5" fill="#5C3A1A" />
    </g>
  )},

  // ---- あかぼう・きいぼう・ふわりん専用 ----
  bud: { front: (
    <g transform="translate(80,74)">
      <path d="M-5 6 Q-8 -6 0 -10 Q8 -6 5 6 Z" fill="#E85A4A" stroke="#B5321E" strokeWidth="1" />
      <path d="M0 6 L0 12" stroke="#4CB27A" strokeWidth="2" />
    </g>
  )},
  seed: { front: (
    <g transform="translate(80,76) rotate(20)">
      <ellipse rx="5" ry="8" fill="#8A6D2A" stroke="#5C4A1A" strokeWidth="1" />
      <path d="M0 -8 L0 -12" stroke="#4CB27A" strokeWidth="1.6" />
    </g>
  )},
  onion: { front: (
    <g transform="translate(80,76)">
      <ellipse cy="2" rx="9" ry="8" fill="#F0E4D0" stroke="#C9B896" strokeWidth="1" />
      <path d="M-2 -6 L0 -13 L2 -6" fill="#4CB27A" />
      <path d="M-4 -4 Q0 0 4 -4 M-5 2 Q0 5 5 2" stroke="#C9B896" strokeWidth="1" fill="none" />
    </g>
  )},
  big_ears: { front: (
    <g>
      <ellipse cx="26" cy="46" rx="7" ry="12" fill="#F5C542" stroke="#C9822E" strokeWidth="1" transform="rotate(-15 26 46)" />
      <ellipse cx="74" cy="46" rx="7" ry="12" fill="#F5C542" stroke="#C9822E" strokeWidth="1" transform="rotate(15 74 46)" />
    </g>
  )},
  star_fragment: { front: (
    <g transform="translate(80,72)">
      <path d="M0 -8 L2.4 -2.4 L8 -2 L3.6 1.6 L5 7 L0 3.8 L-5 7 L-3.6 1.6 L-8 -2 L-2.4 -2.4 Z" fill="#C9B8F5" stroke="#7A63BD" strokeWidth="0.8" />
    </g>
  )},
  lantern: { front: (
    <g transform="translate(80,72)">
      <rect x="-1.3" y="-13" width="2.6" height="4" fill="#8A6D2A" />
      <ellipse rx="7" ry="9" fill="#FFC53D" stroke="#B5860B" strokeWidth="1" />
      <rect x="-6" y="8" width="12" height="2.4" fill="#8A6D2A" />
    </g>
  )},

  // ---- ぱんぱん・ばいきん専用 ----
  jam: { front: (
    <g transform="translate(80,76)">
      <rect x="-6" y="-8" width="12" height="14" rx="2" fill="#F4F1EE" stroke="#8A8678" strokeWidth="1" />
      <rect x="-6" y="-8" width="12" height="8" fill="#D94848" />
      <rect x="-2" y="-11" width="4" height="3" fill="#8A8678" />
    </g>
  )},
  butter: { front: (
    <g transform="translate(80,76)">
      <rect x="-8" y="-5" width="16" height="10" rx="1" fill="#FFE9A0" stroke="#D9A82A" strokeWidth="1" />
    </g>
  )},
  honey: { front: (
    <g transform="translate(80,76)">
      <path d="M-6 -8 Q-8 0 -6 8 Q0 11 6 8 Q8 0 6 -8 Q0 -11 -6 -8 Z" fill="#F5C542" stroke="#B5860B" strokeWidth="1" />
      <rect x="-2" y="-13" width="4" height="5" fill="#8A6D2A" />
    </g>
  )},
  spear: { front: (
    <g transform="translate(80,70) rotate(-20)">
      <rect x="-1.4" y="-4" width="2.8" height="22" fill="#8A6D2A" />
      <path d="M0 -14 L-4 -4 L4 -4 Z" fill="#B0B7C0" stroke="#7A8494" strokeWidth="1" />
    </g>
  )},
  poison_bottle: { front: (
    <g transform="translate(80,76)">
      <rect x="-5" y="-6" width="10" height="14" rx="2" fill="#B76CE8" opacity="0.85" stroke="#7A2E9E" strokeWidth="1" />
      <rect x="-2" y="-10" width="4" height="4" fill="#7A8494" />
      <circle cx="-1.5" cy="0" r="1.3" fill="#2E1A38" />
      <circle cx="1.5" cy="3" r="1" fill="#2E1A38" />
    </g>
  )},

  // ---- ゆきだるマン専用 ----
  sled: { front: (
    <g transform="translate(80,78)">
      <path d="M-10 4 Q-10 -2 -6 -2 L8 -2 L8 4 Z" fill="#D94848" stroke="#8A2E2E" strokeWidth="1" />
      <path d="M-10 4 Q-12 8 -8 8 M8 4 Q10 8 6 8" stroke="#8A6D2A" strokeWidth="1.6" fill="none" />
    </g>
  )},
  snowflake: { front: (
    <g transform="translate(80,72)">
      <path d="M0 -8 L0 8 M-7 -4 L7 4 M-7 4 L7 -4" stroke="#7EC8F2" strokeWidth="2" strokeLinecap="round" />
    </g>
  )},
  mittens: { front: (
    <g transform="translate(80,76)">
      <ellipse rx="7" ry="8" fill="#D94848" stroke="#8A2E2E" strokeWidth="1" />
      <ellipse cx="-6" cy="2" rx="3" ry="4" fill="#D94848" stroke="#8A2E2E" strokeWidth="1" />
    </g>
  )},
  tophat: { front: (
    <g>
      <rect x="38" y="16" width="24" height="18" fill="#2B2A27" />
      <rect x="32" y="32" width="36" height="4" fill="#2B2A27" />
      <rect x="38" y="27" width="24" height="3" fill="#D94848" />
    </g>
  )},

  // ---- かぼちゃおに専用 ----
  broom: { front: (
    <g transform="translate(80,70) rotate(-15)">
      <rect x="-1.4" y="-10" width="2.8" height="20" fill="#8A6D2A" />
      <path d="M-6 10 L-8 20 M-2 10 L-3 20 M2 10 L3 20 M6 10 L8 20 M-6 10 L6 10 Z" stroke="#D9A85C" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  )},
  bat: { front: (
    <g transform="translate(80,72)">
      <ellipse rx="4" ry="5" fill="#2E2A4A" />
      <path d="M-4 -2 Q-14 -6 -12 4 Q-8 2 -4 3 Z" fill="#2E2A4A" />
      <path d="M4 -2 Q14 -6 12 4 Q8 2 4 3 Z" fill="#2E2A4A" />
      <path d="M-3 -3 L-1 -6 M3 -3 L1 -6" stroke="#2E2A4A" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  )},
  candy: { front: (
    <g transform="translate(80,76) rotate(10)">
      <circle r="6" fill="#B76CE8" stroke="#7A2E9E" strokeWidth="1" />
      <path d="M-6 0 L-11 -3 M-6 0 L-11 3 M6 0 L11 -3 M6 0 L11 3" stroke="#7A2E9E" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  )},

  // ---- らくがきくん専用 ----
  eraser: { front: (
    <g transform="translate(80,76)">
      <rect x="-8" y="-5" width="16" height="10" rx="2" fill="#F4F1EE" stroke="#2B2A27" strokeWidth="1.5" />
      <rect x="-8" y="-5" width="16" height="4" fill="#FF9E7A" />
    </g>
  )},
  ruler: { front: (
    <g transform="translate(80,74) rotate(-15)">
      <rect x="-14" y="-3" width="28" height="6" fill="#FFF3C4" stroke="#2B2A27" strokeWidth="1.2" />
      <path d="M-10 -3 L-10 0 M-4 -3 L-4 0 M2 -3 L2 0 M8 -3 L8 0" stroke="#2B2A27" strokeWidth="1" />
    </g>
  )},
  glue: { front: (
    <g transform="translate(80,76)">
      <rect x="-5" y="-8" width="10" height="16" rx="2" fill="#F4F1EE" stroke="#2B2A27" strokeWidth="1.3" />
      <rect x="-3" y="-11" width="6" height="3" fill="#D94848" />
    </g>
  )},

  // ---- カミナリ坊専用 ----
  drum: { front: (
    <g transform="translate(80,76)">
      <rect x="-8" y="-6" width="16" height="12" rx="1" fill="#D94848" stroke="#8A2E2E" strokeWidth="1" />
      <ellipse cx="0" cy="-6" rx="8" ry="2.4" fill="#F4F1EE" stroke="#8A2E2E" strokeWidth="1" />
    </g>
  )},
  cloud: { front: (
    <g transform="translate(80,74)">
      <ellipse rx="10" ry="6" fill="#F4F8FF" stroke="#B8C6E0" strokeWidth="1" />
      <circle cx="-5" cy="-2" r="5" fill="#F4F8FF" stroke="#B8C6E0" strokeWidth="1" />
      <circle cx="5" cy="-3" r="6" fill="#F4F8FF" stroke="#B8C6E0" strokeWidth="1" />
    </g>
  )},

  // ---- にんじゃ丸専用 ----
  shuriken: { front: (
    <g transform="translate(80,74)">
      <path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" fill="#7A8494" stroke="#3A3F47" strokeWidth="1" />
    </g>
  )},
  caltrop: { front: (
    <g transform="translate(80,76)">
      <path d="M0 -6 L2 2 L-2 2 Z M-6 3 L2 -1 L2 3 Z M6 3 L-2 -1 L-2 3 Z" fill="#3A3F47" />
    </g>
  )},
  scroll: { front: (
    <g transform="translate(80,74) rotate(-10)">
      <rect x="-2" y="-10" width="4" height="20" fill="#D9A85C" />
      <rect x="-8" y="-8" width="16" height="16" fill="#F0E4D0" stroke="#B5860B" strokeWidth="1" />
    </g>
  )}
}
