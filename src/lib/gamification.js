import { toISODate, daysBetweenISO, weekStartISO, addDaysISO } from './dates'
import { isMastered } from './today'
import { SHOP_ITEMS_BY_CHARACTER } from './shopItems'

// ---- ポイントのルール（子ども画面のあちこちで使うので、ここにまとめる） ----
export const POINTS = {
  correct: 10, // ことばナビ・さんすうの正解1問
  review: 5, // ことばナビの復習で正解
  finishBonus: 20, // 問題を最後までやったボーナス
  taskAllDone: 200 // 今日のやることを全部達成（1日1回）
}

// 連続記録の達成でもらえるバッジ（マイルストーン）
// 3日・7日は特別扱い、それ以降は7日ごと（14, 21, 28...）に発生する
function milestoneForStreak(days) {
  if (days === 3) return { days, label: '3日連続！', emoji: '🔥' }
  if (days === 7) return { days, label: '1週間連続！', emoji: '🎉' }
  if (days > 7 && days % 7 === 0) {
    const weeks = days / 7
    const emoji = weeks >= 10 ? '👑' : weeks >= 4 ? '🏆' : '🏅'
    return { days, label: `${days}日連続！`, emoji }
  }
  return null
}

// ポイント累計でもらえる称号
const TITLE_THRESHOLDS = [
  { min: 0, title: '勉強見習い' },
  { min: 100, title: '勉強名人' },
  { min: 300, title: '勉強博士' },
  { min: 600, title: '勉強仙人' }
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
  { id: 'gold', min: 100, label: '金', emoji: '🥇' },
  { id: 'silver', min: 60, label: '銀', emoji: '🥈' },
  { id: 'bronze', min: 30, label: '銅', emoji: '🥉' }
]
function tierForRate(rate) {
  return BADGE_TIERS.find((t) => rate >= t.min) || null
}
export function categoryProgress(questions) {
  const byCategory = new Map()
  questions.forEach((q) => {
    if (!byCategory.has(q.category)) byCategory.set(q.category, { total: 0, mastered: 0 })
    const c = byCategory.get(q.category)
    c.total += 1
    if (isMastered(q)) c.mastered += 1
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
// 週が変わっていたら、週次カウントをリセットする値を返す（変わっていなければnull）
export function weeklyResetIfNeeded(progress, now = new Date()) {
  const thisWeek = weekStartISO(now)
  // 以前は世界標準時で保存していたため、朝9時前だと前日（日曜）の日付が入っていることがある。同じ週として扱う
  if (progress.week_start_date === thisWeek || progress.week_start_date === addDaysISO(thisWeek, -1)) return null
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
  { id: 'swamp', name: '沼地', sky: ['#8FA88C', '#C9D9B0'], ground: '#4E6B4A', accent: '#3A4E36' },
  { id: 'jungle', name: 'ジャングル', sky: ['#B8E0A0', '#E4F5D0'], ground: '#4E8A3E', accent: '#2E5C24' },
  { id: 'pond', name: '池', sky: ['#C6E8D8', '#EAF7EE'], ground: '#5FB0C4', accent: '#3A8A9E' },
  { id: 'park', name: '公園', sky: ['#BEE6F5', '#F5FAE0'], ground: '#7CB84E', accent: '#E8946A' },
  { id: 'space', name: '宇宙', sky: ['#1A1440', '#3A2A6B'], ground: '#0D0A24', accent: '#B76CE8' },
  { id: 'moon', name: '月', sky: ['#1A1830', '#3A3560'], ground: '#B8B4C4', accent: '#8A85A0' },
  { id: 'sun', name: '太陽', sky: ['#FFC542', '#FFE9A0'], ground: '#FF9E45', accent: '#D96A1E' },
  { id: 'star', name: '星', sky: ['#0D0A2E', '#2A2258'], ground: '#1A1440', accent: '#FFE9A0' }
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
  { id: 'sponge', name: 'スポンジくん', emoji: '🧽' },
  { id: 'kure', name: 'くれさん', emoji: '👦' },
  { id: 'club', name: 'こうらくん', emoji: '🦀' },
  { id: 'blockman', name: 'ブロックにんげん', emoji: '🧱' },
  { id: 'creepy', name: 'クリーピー', emoji: '🟩' },
  { id: 'iron_giant', name: 'てつのきょじん', emoji: '🤖' },
  { id: 'dark_man', name: 'やみにんげん', emoji: '🌑' },
  { id: 'blackdragon', name: 'くろりゅう', emoji: '🐲' },
  { id: 'mari', name: 'マリさん', emoji: '🥸' },
  { id: 'kourao', name: 'こうらおう', emoji: '🐢' },
  { id: 'gori', name: 'ゴリさん', emoji: '🦍' },
  { id: 'akabou', name: 'あかぼう', emoji: '🌱' },
  { id: 'kiibou', name: 'きいぼう', emoji: '🌼' },
  { id: 'fuwarin', name: 'ふわりん', emoji: '💫' },
  { id: 'panpan', name: 'ぱんぱん', emoji: '🍞' },
  { id: 'baikin', name: 'ばいきん', emoji: '🟣' },
  { id: 'yukidaruma', name: 'ゆきだるマン', emoji: '⛄' },
  { id: 'kabocha', name: 'かぼちゃおに', emoji: '🎃' },
  { id: 'rakugaki', name: 'らくがきくん', emoji: '🖍️' },
  { id: 'kaminari', name: 'カミナリ坊', emoji: '⚡' },
  { id: 'ninja', name: 'にんじゃ丸', emoji: '🥷' }
]

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

// 所持アイテムは「キャラID:アイテムID」の形で保存している（同じアイテムIDでもキャラごとに別物）
export const ownedKey = (characterId, itemId) => `${characterId}:${itemId}`
export const isItemOwned = (ownedItems, characterId, itemId) => ownedItems.includes(ownedKey(characterId, itemId))
export const ownedCountForCharacter = (ownedItems, characterId) =>
  itemsForCharacter(characterId).filter((it) => isItemOwned(ownedItems, characterId, it.id)).length
export const isCharacterComplete = (ownedItems, characterId) =>
  ownedCountForCharacter(ownedItems, characterId) >= itemsForCharacter(characterId).length
// まだアンロックされていない中で、次にアンロックされるキャラクター
export const nextLockedCharacter = (unlockedCharacters) => CHARACTERS.find((c) => !unlockedCharacters.includes(c.id)) || null
export const characterById = (id) => CHARACTERS.find((c) => c.id === id) || CHARACTERS[0]

/**
 * 今日の活動を記録した際のstreak更新を計算する。
 * 「1問でもやれば継続」の考え方で、セッション完了ではなく最初の回答タイミングで呼ぶ想定。
 * 1日空いてもストリークフリーズ(freeze_tokens)があれば継続できる。
 */
export function computeStreakUpdate(progress, now = new Date()) {
  const todayStr = toISODate(now)
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
    const diff = daysBetweenISO(progress.last_activity_date, todayStr)
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
