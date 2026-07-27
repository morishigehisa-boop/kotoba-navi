// 「今日やる問題集」「締切をすぎた問題」の自動抽出ロジック。
// 入力は Supabase から取得した questions / question_sets(+questionIds) の配列。
// 純粋関数として実装し、UIコンポーネントからテストしやすくしている。

export const TODAY_SET_MAX = 50

export const TIER_THRESHOLDS = [
  { maxDays: 7, mode: 'dominate' },  // 残り7日以内：締切が近い順、独占OK
  { maxDays: 14, mode: 'split' },    // 残り14日以内：均等割り
  { maxDays: 30, mode: 'split' }     // 残り30日以内：均等割り（これより先は今日の対象外）
]

const BOX_INTERVAL_DAYS = [0, 2, 4, 7, 14] // ライトナー式：箱ごとの復習間隔（日）

export function boxOf(q) {
  // 定着判定は「連続正解数(streak_count)」を基準にする。
  // 累計正解数(correct_count)だと不正解を挟んでも増え続けてしまうため使わない。
  if (q.last_correct === false || q.last_correct === null) return 0
  return Math.min(q.streak_count, 4)
}

function daysBetween(d1, d2) {
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24))
}

export function isDueToday(q, today) {
  const box = boxOf(q)
  if (!q.last_answered_at) return true
  return daysBetween(new Date(q.last_answered_at), today) >= BOX_INTERVAL_DAYS[box]
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 締切が近い順に「独占OK」で詰める
function dominateFill(sets, slotsAvailable, dueLeftoverBySet) {
  const sorted = [...sets].sort((a, b) => a.remainingDays - b.remainingDays)
  let picked = []
  sorted.forEach((s) => {
    const slotsLeft = slotsAvailable - picked.length
    const taken = s.dueInSet.slice(0, Math.max(0, slotsLeft))
    picked = picked.concat(taken)
    dueLeftoverBySet.set(s.setId, s.dueInSet.length - taken.length)
  })
  sorted.forEach((s) => {
    const slotsLeft = slotsAvailable - picked.length
    if (slotsLeft <= 0) return
    picked = picked.concat(s.paddingPool.slice(0, slotsLeft))
  })
  return picked
}

// 問題集ごとに均等割りで詰める（独占させない）
function equalSplitFill(sets, slotsAvailable, dueLeftoverBySet) {
  if (sets.length === 0) return []
  const baseQuota = Math.floor(slotsAvailable / sets.length)
  let picked = []
  const leftoverPool = []
  sets.forEach((s) => {
    const dueTaken = s.dueInSet.slice(0, baseQuota)
    const remain = baseQuota - dueTaken.length
    const paddingTaken = remain > 0 ? s.paddingPool.slice(0, remain) : []
    picked = picked.concat(dueTaken, paddingTaken)
    dueLeftoverBySet.set(s.setId, s.dueInSet.length - dueTaken.length)
    leftoverPool.push(...s.dueInSet.slice(dueTaken.length), ...s.paddingPool.slice(paddingTaken.length))
  })
  const remainSlots = slotsAvailable - picked.length
  if (remainSlots > 0) {
    const extra = leftoverPool.slice(0, remainSlots)
    picked = picked.concat(extra)
    sets.forEach((s) => {
      const stillLeftoverDue = s.dueInSet.filter((q) => !picked.some((p) => p.id === q.id))
      dueLeftoverBySet.set(s.setId, stillLeftoverDue.length)
    })
  }
  return picked
}

function dedupe(list) {
  const seen = new Set()
  return list.filter((q) => {
    if (seen.has(q.id)) return false
    seen.add(q.id)
    return true
  })
}

/**
 * @param {Array} questions  questionsテーブルの全行（id, last_correct, last_answered_at, streak_count, content, ...）
 * @param {Array} goalSets   [{ id, name, goal_at, questionIds: [...] }]  goal_atが設定されているquestion_setsのみ渡す
 */
export function buildTodaySet(questions, goalSets) {
  const today = new Date()
  const maxTierDays = TIER_THRESHOLDS[TIER_THRESHOLDS.length - 1].maxDays
  const byId = new Map(questions.map((q) => [q.id, q]))

  const allSets = goalSets
    .map((set) => {
      const goal = new Date(set.goal_at)
      const remainingDays = Math.max(1, Math.ceil((goal - today) / (1000 * 60 * 60 * 24)))
      const members = set.questionIds.map((id) => byId.get(id)).filter(Boolean)
      const notMastered = members.filter((q) => boxOf(q) < 4)
      const dueInSet = shuffle(notMastered.filter((q) => isDueToday(q, today)))
      const dueIds = new Set(dueInSet.map((q) => q.id))
      const paddingPool = shuffle(notMastered.filter((q) => !dueIds.has(q.id)))
      return { setId: set.id, goal, remainingDays, dueInSet, paddingPool }
    })
    .filter((s) => s.goal >= today)

  const activeSets = allSets.filter((s) => s.remainingDays <= maxTierDays)
  if (activeSets.length === 0) return { picked: [], totalEligible: 0, leftoverDueTotal: 0 }

  const dueLeftoverBySet = new Map()
  activeSets.forEach((s) => dueLeftoverBySet.set(s.setId, 0))

  let picked = []
  let lowerBound = 0
  TIER_THRESHOLDS.forEach((tier) => {
    const tierSets = activeSets.filter((s) => s.remainingDays > lowerBound && s.remainingDays <= tier.maxDays)
    lowerBound = tier.maxDays
    const slotsAvailable = TODAY_SET_MAX - picked.length
    if (slotsAvailable <= 0 || tierSets.length === 0) return
    const tierPicked =
      tier.mode === 'dominate'
        ? dominateFill(tierSets, slotsAvailable, dueLeftoverBySet)
        : equalSplitFill(tierSets, slotsAvailable, dueLeftoverBySet)
    picked = picked.concat(tierPicked)
  })

  picked = dedupe(picked)
  const totalEligible = activeSets.reduce((sum, s) => sum + s.dueInSet.length + s.paddingPool.length, 0)
  const leftoverDueTotal = [...dueLeftoverBySet.values()].reduce((a, b) => a + b, 0)

  return { picked, totalEligible, leftoverDueTotal }
}

/**
 * 締切が過ぎてしまった問題集から、まだ習得できていない問題を集める（デフォルト問題集）
 */
export function buildOverdueSet(questions, allGoalSets) {
  const today = new Date()
  const byId = new Map(questions.map((q) => [q.id, q]))
  let pool = []
  allGoalSets.forEach((set) => {
    if (!set.goal_at) return
    const goal = new Date(set.goal_at)
    if (goal >= today) return
    const members = set.questionIds.map((id) => byId.get(id)).filter(Boolean)
    pool = pool.concat(members.filter((q) => boxOf(q) < 4))
  })
  pool = dedupe(pool)
  const totalOverdue = pool.length
  const picked = shuffle(pool).slice(0, TODAY_SET_MAX)
  return { picked, totalOverdue }
}
