// 配列まわりの小さな共通関数

// 元の配列は変えずに、順番をランダムに入れかえた新しい配列を返す（フィッシャー–イェーツ法）
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

// 空でない値を、重複なしで（出てきた順に）
export const uniqueValues = (list) => [...new Set(list)].filter(Boolean)

// 選んでいれば外し、選んでいなければ加える（チップの複数選択用）
export const toggleItem = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
