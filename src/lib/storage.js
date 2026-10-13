// localStorage の読み書き。プライベートモードなどで使えない環境でも、例外でアプリが止まらないようにする。
// キー名はここにまとめて、重複や書き間違いを防ぐ。
export const STORAGE_KEYS = {
  muted: 'kotoba_navi_muted',
  kotobaSession: 'kotoba_navi_pending_session', // ことばナビ「今日やる問題」の途中経過
  taskBonusDate: 'kotoba_navi_task_bonus_date', // 「今日のやることを全部達成」ボーナスをもらった日
  sansuCounted: 'kotoba_navi_sansu_counted', // すごろくに数えた、さんすうの習得問題ID
  sansuResume: 'kotoba_navi_sansu_resume', // さんすうの「つづきから」
  adminArea: 'kotoba_navi_admin_area',
  adminSubjects: 'kotoba_navi_admin_subjects',
  adminCalRange: 'kotoba_navi_admin_cal_range',
  sansuLastUnit: 'sansu_last_unit',
  sansuLastSource: 'sansu_last_source'
}

export function loadString(key, fallback = null) {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : v
  } catch {
    return fallback
  }
}

export function saveString(key, value) {
  try { localStorage.setItem(key, value) } catch {}
}

export function loadJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function removeItem(key) {
  try { localStorage.removeItem(key) } catch {}
}
