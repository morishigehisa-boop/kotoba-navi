// 日付の共通ユーティリティ。
// アプリ内の「日付」は、端末のローカル日付の 'YYYY-MM-DD' 文字列で扱う
// （toISOString() は世界標準時になり、日本では朝9時前に前日の日付になってしまうため使わない）。

export const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']
const DAY_MS = 24 * 60 * 60 * 1000

const pad2 = (n) => String(n).padStart(2, '0')

// Date → 'YYYY-MM-DD'（ローカル日付）
export function toISODate(d = new Date()) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

// 'YYYY-MM-DD' → その日の0時（ローカル）。new Date('YYYY-MM-DD') は世界標準時で解釈されるので使わない
export function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDaysISO(iso, n) {
  const d = parseISO(iso)
  d.setDate(d.getDate() + n)
  return toISODate(d)
}

// from から to まで何日か（to が後なら正）
export function daysBetweenISO(fromISO, toISO) {
  return Math.round((parseISO(toISO) - parseISO(fromISO)) / DAY_MS)
}

export function lastDayOfMonth(year, month0) {
  return new Date(year, month0 + 1, 0).getDate()
}

// '2026-10-08' → '10/8（木）'。withWeekday=false なら '10/8'
export function formatMD(iso, withWeekday = true) {
  const d = parseISO(iso)
  const md = `${d.getMonth() + 1}/${d.getDate()}`
  return withWeekday ? `${md}（${WEEKDAY_LABELS[d.getDay()]}）` : md
}

// 月めくりカレンダー用：1日の曜日までを null で埋めた、日にち（1〜末日）の配列
export function monthCells(year, month0) {
  const cells = Array(new Date(year, month0, 1).getDay()).fill(null)
  for (let d = 1; d <= lastDayOfMonth(year, month0); d++) cells.push(d)
  return cells
}

export const isoOf = (year, month0, day) => toISODate(new Date(year, month0, day))

// 月曜始まりの「今週の月曜日」（'YYYY-MM-DD'）
export function weekStartISO(now = new Date()) {
  const d = new Date(now)
  const day = d.getDay() // 0=日,1=月...
  d.setDate(d.getDate() + (day === 0 ? -6 : 1) - day)
  return toISODate(d)
}
