// 連続記録の達成でもらえるバッジ（マイルストーン）
// 3日・7日は特別扱い、それ以降は7日ごと（14, 21, 28...）に発生する
export function milestoneForStreak(days) {
  if (days === 3) return { days, label: '3日 れんぞく！', emoji: '🔥' }
  if (days === 7) return { days, label: '1週間 れんぞく！', emoji: '🎉' }
  if (days > 7 && days % 7 === 0) {
    const weeks = days / 7
    const emoji = weeks >= 10 ? '👑' : weeks >= 4 ? '🏆' : '🏅'
    return { days, label: `${days}日 れんぞく！`, emoji }
  }
  return null
}

// ポイント累計でもらえる称号
export const TITLE_THRESHOLDS = [
  { min: 0, title: 'ことわざ見習い' },
  { min: 100, title: 'ことわざ名人' },
  { min: 300, title: 'ことわざ博士' },
  { min: 600, title: 'ことわざ仙人' }
]

export function titleForPoints(points) {
  let current = TITLE_THRESHOLDS[0]
  for (const t of TITLE_THRESHOLDS) {
    if (points >= t.min) current = t
  }
  return current.title
}

// ---- 6. カテゴリー別マスターバッジ ----
export const BADGE_TIERS = [
  { id: 'gold', min: 100, label: 'きん', emoji: '🥇' },
  { id: 'silver', min: 60, label: 'ぎん', emoji: '🥈' },
  { id: 'bronze', min: 30, label: 'どう', emoji: '🥉' }
]
export function tierForRate(rate) {
  return BADGE_TIERS.find((t) => rate >= t.min) || null
}
export function categoryProgress(questions) {
  const byCategory = new Map()
  questions.forEach((q) => {
    if (!byCategory.has(q.category)) byCategory.set(q.category, { total: 0, mastered: 0 })
    const c = byCategory.get(q.category)
    c.total += 1
    if ((q.streak_count || 0) >= 4) c.mastered += 1
  })
  return [...byCategory.entries()].map(([category, c]) => {
    const rate = c.total > 0 ? Math.round((c.mastered / c.total) * 100) : 0
    return { category, total: c.total, mastered: c.mastered, rate, tier: tierForRate(rate) }
  })
}

// ---- 1. 週替わりミッション ----
export const WEEKLY_MISSIONS = [
  { id: 'm1', count: 30, reward: 25 },
  { id: 'm2', count: 60, reward: 50 },
  { id: 'm3', count: 100, reward: 100 }
]
// 月曜始まりの「今週の月曜日」をYYYY-MM-DD形式で返す
export function currentWeekStart(now = new Date()) {
  const d = new Date(now)
  const day = d.getDay() // 0=日,1=月...
  const diff = (day === 0 ? -6 : 1) - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}
// 週が変わっていたら、週次カウントをリセットする値を返す（変わっていなければnull）
export function weeklyResetIfNeeded(progress, now = new Date()) {
  const thisWeek = currentWeekStart(now)
  if (progress.week_start_date === thisWeek) return null
  return { weekly_correct_count: 0, week_start_date: thisWeek, weekly_missions_claimed: [] }
}

// ---- 4. すごろく風マップ ----
// かんぺきになった問題が10問増えるごとに1マス進む。10マスごとにステージ（地図・背景）が切り替わる。
export const SQUARES_PER_STAGE = 10
export const MASTERY_PER_SQUARE = 10

export const STAGE_THEMES = [
  { id: 'coast', name: '海岸', sky: ['#8FD9F0', '#D9F5EC'], ground: '#F2E1B0', accent: '#4FB6E8' },
  { id: 'mountain', name: '山', sky: ['#BFE0EE', '#E8F3F5'], ground: '#8FA876', accent: '#6E7F87' },
  { id: 'grassland', name: '草原', sky: ['#BEE6F5', '#EFFAE0'], ground: '#8FC15A', accent: '#5FA23A' },
  { id: 'monument_valley', name: 'モニュメントバレー', sky: ['#F5C98A', '#FBE3B8'], ground: '#C97A4A', accent: '#A85236' },
  { id: 'desert', name: '砂漠', sky: ['#FBE3A0', '#FFF3D2'], ground: '#E8C177', accent: '#C99A4A' },
  { id: 'countryside', name: '田舎の町', sky: ['#CDEAF7', '#F5F9E8'], ground: '#B8D98A', accent: '#E8946A' },
  { id: 'city', name: '都会の町', sky: ['#B8C6E0', '#E6ECF5'], ground: '#8E97A6', accent: '#5A6478' },
  { id: 'sky', name: '空', sky: ['#7FC4F0', '#DCF0FB'], ground: '#FFFFFF', accent: '#FFFFFF' },
  { id: 'fuji', name: '富士山', sky: ['#F7C6D9', '#FDE7C8'], ground: '#7C93B0', accent: '#FFFFFF' },
  { id: 'swamp', name: '沼地', sky: ['#8FA88C', '#C9D9B0'], ground: '#4E6B4A', accent: '#3A4E36' }
]

export function stageInfo(masteryEventTotal) {
  const boardPosition = Math.floor(masteryEventTotal / MASTERY_PER_SQUARE)
  const stageIndex = Math.floor(boardPosition / SQUARES_PER_STAGE) % STAGE_THEMES.length
  const squareInStage = boardPosition % SQUARES_PER_STAGE
  const towardNextSquare = masteryEventTotal % MASTERY_PER_SQUARE
  return {
    boardPosition,
    stageIndex,
    squareInStage,
    theme: STAGE_THEMES[stageIndex],
    towardNextSquare
  }
}

// キャラクター（この順番でアンロックされていく）
export const CHARACTERS = [
  { id: 'fox', name: 'きつね', emoji: '🦊' },
  { id: 'cat', name: 'ねこ', emoji: '🐱' },
  { id: 'dog', name: 'いぬ', emoji: '🐶' },
  { id: 'lion', name: 'ライオン', emoji: '🦁' },
  { id: 'pig', name: 'ブタ', emoji: '🐷' },
  { id: 'cheetah', name: 'チーター', emoji: '🐆' },
  { id: 'robot', name: 'ロボット', emoji: '🤖' },
  { id: 'ankylosaurus', name: 'アンキロサウルス', emoji: '🦕' },
  { id: 'trex', name: 'ティラノザウルス', emoji: '🦖' },
  { id: 'dragon', name: 'ドラゴン', emoji: '🐉' },
  { id: 'pika', name: 'ピカさん', emoji: '⚡' },
  { id: 'dora', name: 'ドラさん', emoji: '🔵' },
  { id: 'sponge', name: 'スポンジくん', emoji: '🧽' }
]

// 着せ替えショップのアイテム（キャラクターごとにテーマが違う専用アイテム）
export const SHOP_ITEMS_BY_CHARACTER = {
  fox: [
    { id: 'hat_leaf', name: 'はっぱの ぼうし', cost: 50, emoji: '🍃' },
    { id: 'bowtie', name: 'ちょうネクタイ', cost: 60, emoji: '🎀' },
    { id: 'scarf_red', name: 'あかい マフラー', cost: 80, emoji: '🧣' },
    { id: 'flower', name: 'はなかんむり', cost: 90, emoji: '🌸' },
    { id: 'star_badge', name: 'きらきらバッジ', cost: 100, emoji: '⭐' },
    { id: 'glasses', name: 'サングラス', cost: 120, emoji: '🕶️' },
    { id: 'bell', name: 'すずの くびわ', cost: 130, emoji: '🔔' },
    { id: 'cape', name: 'ヒーローマント', cost: 150, emoji: '🦸' },
    { id: 'wings', name: 'はねかざり', cost: 200, emoji: '🪽' },
    { id: 'crown', name: 'きんの かんむり', cost: 300, emoji: '👑' }
  ],
  cat: [
    { id: 'yarn', name: 'けいとだま', cost: 50, emoji: '🧶' },
    { id: 'ribbon', name: 'リボン', cost: 60, emoji: '🎀' },
    { id: 'fish', name: 'さかなグッズ', cost: 80, emoji: '🐟' },
    { id: 'milk', name: 'ミルクエプロン', cost: 90, emoji: '🥛' },
    { id: 'bell', name: 'すずの くびわ', cost: 100, emoji: '🔔' },
    { id: 'glasses', name: 'サングラス', cost: 120, emoji: '🕶️' },
    { id: 'straw_hat', name: 'むぎわらぼうし', cost: 130, emoji: '👒' },
    { id: 'top_hat', name: 'シルクハット', cost: 150, emoji: '🎩' },
    { id: 'jewel_collar', name: 'ほうせきの くびわ', cost: 200, emoji: '💍' },
    { id: 'crown', name: 'きんの かんむり', cost: 300, emoji: '👑' }
  ],
  dog: [
    { id: 'bone', name: 'ほね', cost: 50, emoji: '🦴' },
    { id: 'ball', name: 'テニスボール', cost: 60, emoji: '🎾' },
    { id: 'scarf', name: 'マフラー', cost: 80, emoji: '🧣' },
    { id: 'paw_print', name: 'あしあとバンダナ', cost: 90, emoji: '🐾' },
    { id: 'bell', name: 'すずの くびわ', cost: 100, emoji: '🔔' },
    { id: 'glasses', name: 'サングラス', cost: 120, emoji: '🕶️' },
    { id: 'grad_cap', name: 'がくしぼう', cost: 130, emoji: '🎓' },
    { id: 'vest', name: 'おしごとベスト', cost: 150, emoji: '🦺' },
    { id: 'medal', name: 'きんメダル', cost: 200, emoji: '🏅' },
    { id: 'crown', name: 'きんの かんむり', cost: 300, emoji: '👑' }
  ],
  dragon: [
    { id: 'gem', name: 'きらきらいし', cost: 50, emoji: '💎' },
    { id: 'flame', name: 'ほのおのたてがみ', cost: 60, emoji: '🔥' },
    { id: 'sword', name: 'けん', cost: 80, emoji: '⚔️' },
    { id: 'shield', name: 'たて', cost: 90, emoji: '🛡️' },
    { id: 'ring', name: 'まほうのゆびわ', cost: 100, emoji: '💍' },
    { id: 'glasses', name: 'サングラス', cost: 120, emoji: '🕶️' },
    { id: 'lightning', name: 'いなずまマーク', cost: 130, emoji: '⚡' },
    { id: 'trophy', name: 'トロフィー', cost: 150, emoji: '🏆' },
    { id: 'star_gem', name: 'ほしの たま', cost: 200, emoji: '🌟' },
    { id: 'crown', name: 'おうの かんむり', cost: 300, emoji: '👑' }
  ],
  lion: [
    { id: 'mane_bow', name: 'たてがみリボン', cost: 50, emoji: '🎗️' },
    { id: 'bandana', name: 'バンダナ', cost: 60, emoji: '🧣' },
    { id: 'cape_royal', name: 'おうさまマント', cost: 80, emoji: '🧥' },
    { id: 'paw_gem', name: 'つめかざり', cost: 90, emoji: '💎' },
    { id: 'bell', name: 'すずの くびわ', cost: 100, emoji: '🔔' },
    { id: 'glasses', name: 'サングラス', cost: 120, emoji: '🕶️' },
    { id: 'scepter', name: 'おうじゃのつえ', cost: 130, emoji: '🪄' },
    { id: 'medal', name: 'きんメダル', cost: 150, emoji: '🏅' },
    { id: 'sun_crown', name: 'たいようのかんむり', cost: 200, emoji: '☀️' },
    { id: 'crown', name: 'きんの かんむり', cost: 300, emoji: '👑' }
  ],
  pig: [
    { id: 'flower_crown', name: 'はなかんむり', cost: 50, emoji: '🌼' },
    { id: 'bandana', name: 'バンダナ', cost: 60, emoji: '🧣' },
    { id: 'apron', name: 'エプロン', cost: 80, emoji: '🥕' },
    { id: 'mud_badge', name: 'どろんこバッジ', cost: 90, emoji: '🟤' },
    { id: 'bell', name: 'すずの くびわ', cost: 100, emoji: '🔔' },
    { id: 'glasses', name: 'サングラス', cost: 120, emoji: '🕶️' },
    { id: 'bowtie', name: 'ちょうネクタイ', cost: 130, emoji: '🎀' },
    { id: 'basket', name: 'かご', cost: 150, emoji: '🧺' },
    { id: 'straw_hat', name: 'むぎわらぼうし', cost: 200, emoji: '👒' },
    { id: 'crown', name: 'きんの かんむり', cost: 300, emoji: '👑' }
  ],
  cheetah: [
    { id: 'headband', name: 'はちまき', cost: 50, emoji: '🔶' },
    { id: 'scarf_speed', name: 'マフラー', cost: 60, emoji: '🧣' },
    { id: 'race_medal', name: 'レースメダル', cost: 80, emoji: '🏅' },
    { id: 'cape_wind', name: 'かぜのマント', cost: 90, emoji: '🧥' },
    { id: 'bell', name: 'すずの くびわ', cost: 100, emoji: '🔔' },
    { id: 'glasses', name: 'サングラス', cost: 120, emoji: '🕶️' },
    { id: 'trophy', name: 'トロフィー', cost: 130, emoji: '🏆' },
    { id: 'lightning_badge', name: 'いなずまバッジ', cost: 150, emoji: '⚡' },
    { id: 'flag', name: 'ゴールフラッグ', cost: 200, emoji: '🏁' },
    { id: 'crown', name: 'きんの かんむり', cost: 300, emoji: '👑' }
  ],
  robot: [
    { id: 'propeller_hat', name: 'プロペラぼうし', cost: 50, emoji: '🎩' },
    { id: 'bandana', name: 'バンダナ', cost: 60, emoji: '🧣' },
    { id: 'battery_badge', name: 'バッテリーバッジ', cost: 80, emoji: '🔋' },
    { id: 'wrench', name: 'レンチ', cost: 90, emoji: '🔧' },
    { id: 'bell', name: 'すずの くびわ', cost: 100, emoji: '🔔' },
    { id: 'glasses', name: 'サングラス', cost: 120, emoji: '🕶️' },
    { id: 'cape', name: 'マント', cost: 130, emoji: '🦸' },
    { id: 'gear_badge', name: 'ギアバッジ', cost: 150, emoji: '⚙️' },
    { id: 'antenna_dish', name: 'アンテナ', cost: 200, emoji: '📡' },
    { id: 'crown', name: 'きんの かんむり', cost: 300, emoji: '👑' }
  ],
  ankylosaurus: [
    { id: 'flower_crown', name: 'はなかんむり', cost: 50, emoji: '🌼' },
    { id: 'bandana', name: 'バンダナ', cost: 60, emoji: '🧣' },
    { id: 'shield_badge', name: 'たてバッジ', cost: 80, emoji: '🛡️' },
    { id: 'rock', name: 'いし', cost: 90, emoji: '🪨' },
    { id: 'bell', name: 'すずの くびわ', cost: 100, emoji: '🔔' },
    { id: 'glasses', name: 'サングラス', cost: 120, emoji: '🕶️' },
    { id: 'armor_badge', name: 'よろいバッジ', cost: 130, emoji: '🔰' },
    { id: 'cape', name: 'マント', cost: 150, emoji: '🦸' },
    { id: 'spike_crown', name: 'とげかんむり', cost: 200, emoji: '⛰️' },
    { id: 'crown', name: 'きんの かんむり', cost: 300, emoji: '👑' }
  ],
  trex: [
    { id: 'bandana', name: 'バンダナ', cost: 50, emoji: '🧣' },
    { id: 'tooth_necklace', name: 'きばのくびかざり', cost: 60, emoji: '🦷' },
    { id: 'medal', name: 'きんメダル', cost: 80, emoji: '🏅' },
    { id: 'claw_gem', name: 'つめかざり', cost: 90, emoji: '💎' },
    { id: 'bell', name: 'すずの くびわ', cost: 100, emoji: '🔔' },
    { id: 'glasses', name: 'サングラス', cost: 120, emoji: '🕶️' },
    { id: 'cape', name: 'マント', cost: 130, emoji: '🦸' },
    { id: 'spike_crest', name: 'とさかスパイク', cost: 150, emoji: '🔺' },
    { id: 'meteor_badge', name: 'いんせきバッジ', cost: 200, emoji: '🌠' },
    { id: 'crown', name: 'きんの かんむり', cost: 300, emoji: '👑' }
  ],
  pika: [
    { id: 'energy_ball', name: 'エナジーボール', cost: 50, emoji: '🔴' },
    { id: 'lightning_badge', name: 'いなずまバッジ', cost: 60, emoji: '⚡' },
    { id: 'scarf_red', name: 'あかい マフラー', cost: 80, emoji: '🧣' },
    { id: 'star_badge', name: 'きらきらバッジ', cost: 90, emoji: '⭐' },
    { id: 'bell', name: 'すずの くびわ', cost: 100, emoji: '🔔' },
    { id: 'glasses', name: 'サングラス', cost: 120, emoji: '🕶️' },
    { id: 'cape', name: 'マント', cost: 130, emoji: '🦸' },
    { id: 'medal', name: 'きんメダル', cost: 150, emoji: '🏅' },
    { id: 'sun_crown', name: 'たいようのかんむり', cost: 200, emoji: '☀️' },
    { id: 'crown', name: 'きんの かんむり', cost: 300, emoji: '👑' }
  ],
  dora: [
    { id: 'dorayaki', name: 'どらやき', cost: 50, emoji: '🥮' },
    { id: 'bell', name: 'すず', cost: 60, emoji: '🔔' },
    { id: 'taketombo', name: 'たけとんぼ', cost: 80, emoji: '🎋' },
    { id: 'mystery_door', name: 'ふしぎな とびら', cost: 90, emoji: '🚪' },
    { id: 'pouch', name: 'ふしぎな ポケット', cost: 100, emoji: '🎒' },
    { id: 'glasses', name: 'サングラス', cost: 120, emoji: '🕶️' },
    { id: 'big_light', name: '大きくなるライト', cost: 130, emoji: '🔦' },
    { id: 'small_tunnel', name: '小さくなるトンネル', cost: 150, emoji: '🕳️' },
    { id: 'medal', name: 'きんメダル', cost: 200, emoji: '🏅' },
    { id: 'crown', name: 'きんの かんむり', cost: 300, emoji: '👑' }
  ],
  sponge: [
    { id: 'burger', name: 'バーガー', cost: 50, emoji: '🍔' },
    { id: 'juice', name: 'ジュース', cost: 60, emoji: '🧃' },
    { id: 'fish', name: 'さかな', cost: 80, emoji: '🐟' },
    { id: 'shrimp', name: 'えび', cost: 90, emoji: '🦐' },
    { id: 'bell', name: 'すずの くびわ', cost: 100, emoji: '🔔' },
    { id: 'glasses', name: 'サングラス', cost: 120, emoji: '🕶️' },
    { id: 'crab', name: 'かにさん', cost: 130, emoji: '🦀' },
    { id: 'bubble', name: 'あわあわ', cost: 150, emoji: '🫧' },
    { id: 'chef_hat', name: 'コックぼうし', cost: 200, emoji: '🧑‍🍳' },
    { id: 'crown', name: 'きんの かんむり', cost: 300, emoji: '👑' }
  ]
}

export function itemsForCharacter(characterId) {
  const baseItems = SHOP_ITEMS_BY_CHARACTER[characterId] || []
  const index = CHARACTERS.findIndex((c) => c.id === characterId)
  // キャラが後になるほど値段が上がる（きつね=1.0倍、ドラゴン=1.0+9*0.25=3.25倍）
  const multiplier = 1 + Math.max(0, index) * 0.25
  return baseItems.map((item) => ({
    ...item,
    cost: Math.round((item.cost * multiplier) / 10) * 10
  }))
}

export function ownedKey(characterId, itemId) {
  return `${characterId}:${itemId}`
}
export function isItemOwned(ownedItems, characterId, itemId) {
  return ownedItems.includes(ownedKey(characterId, itemId))
}
export function ownedCountForCharacter(ownedItems, characterId) {
  const items = itemsForCharacter(characterId)
  return items.filter((it) => isItemOwned(ownedItems, characterId, it.id)).length
}
export function isCharacterComplete(ownedItems, characterId) {
  const items = itemsForCharacter(characterId)
  return ownedCountForCharacter(ownedItems, characterId) >= items.length
}
// まだアンロックされていない中で、次にアンロックされるキャラクター
export function nextLockedCharacter(unlockedCharacters) {
  return CHARACTERS.find((c) => !unlockedCharacters.includes(c.id)) || null
}

function toDateStr(d) {
  return d.toISOString().slice(0, 10)
}
function daysBetweenDates(a, b) {
  return Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24))
}

/**
 * 今日の活動を記録した際のstreak更新を計算する。
 * 「1問でもやれば継続」の考え方で、セッション完了ではなく最初の回答タイミングで呼ぶ想定。
 * 1日空いてもストリークフリーズ(freeze_tokens)があれば継続できる。
 */
export function computeStreakUpdate(progress, now = new Date()) {
  const todayStr = toDateStr(now)
  if (progress.last_activity_date === todayStr) {
    // 今日はすでに記録済み（同じ日に何度呼んでも増えない）
    return { changed: false, streak_count: progress.streak_count, freeze_tokens: progress.freeze_tokens, last_activity_date: todayStr, usedFreeze: false, newMilestone: null }
  }

  let nextStreak
  let usedFreeze = false
  let freezeTokens = progress.freeze_tokens

  if (!progress.last_activity_date) {
    nextStreak = 1
  } else {
    const diff = daysBetweenDates(progress.last_activity_date, todayStr)
    if (diff === 1) {
      nextStreak = progress.streak_count + 1
    } else {
      const missedDays = diff - 1
      if (missedDays > 0 && freezeTokens >= missedDays) {
        freezeTokens -= missedDays
        usedFreeze = true
        nextStreak = progress.streak_count + 1
      } else {
        nextStreak = 1
      }
    }
  }

  // マイルストーン達成で、フリーズトークンを1つ付与する
  const newMilestone = milestoneForStreak(nextStreak)
  if (newMilestone) freezeTokens += 1

  return {
    changed: true,
    streak_count: nextStreak,
    freeze_tokens: freezeTokens,
    last_activity_date: todayStr,
    usedFreeze,
    newMilestone
  }
}
