import { loadString, saveString, STORAGE_KEYS } from './storage'

// Web Audio APIで効果音をその場で生成する（音声ファイル不要 = ランニングコストゼロ）
let actx = null

// 音のオン/オフ設定（端末に保存して次回起動時も引き継ぐ）
let muted = loadString(STORAGE_KEYS.muted) === '1'

export function isMuted() {
  return muted
}
export function setMuted(value) {
  muted = value
  saveString(STORAGE_KEYS.muted, value ? '1' : '0')
}

// iPhoneは、画面を切りかえたり しばらく放置したりすると AudioContext が止まる／閉じることがある。
// そのままだと音を鳴らす処理で例外になり、「できた！」の後の処理（次の問題へ）まで止まってしまうので、
// ここで復帰・作り直しをして、それでも失敗したら音だけあきらめる（アプリの動きは止めない）
function ac() {
  if (!actx || actx.state === 'closed') actx = new (window.AudioContext || window.webkitAudioContext)()
  if (actx.state !== 'running') actx.resume?.().catch(() => {})
  return actx
}
function tone(freq, start, dur, type, gain) {
  if (muted) return
  try {
    const c = ac()
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = type || 'sine'
    o.frequency.value = freq
    g.gain.value = 0
    o.connect(g)
    g.connect(c.destination)
    const t0 = c.currentTime + start
    g.gain.linearRampToValueAtTime(gain || 0.18, t0 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
    o.start(t0)
    o.stop(t0 + dur + 0.02)
  } catch (e) {
    console.warn('sound failed', e)
  }
}
export function playCorrect() {
  tone(523, 0, 0.16, 'triangle')
  tone(659, 0.1, 0.16, 'triangle')
  tone(880, 0.2, 0.28, 'triangle')
}
export function playWrong() {
  tone(220, 0, 0.22, 'sine', 0.15)
  tone(180, 0.14, 0.28, 'sine', 0.15)
}

// 今日やることが全て終わった時／問題集がすべてかんぺきになった時 用の、派手なファンファーレ
export function playFanfareBig() {
  const notes = [523, 659, 784, 1047, 1319] // C5 E5 G5 C6 E6
  notes.forEach((f, i) => tone(f, i * 0.09, 0.35, 'triangle', 0.22))
  tone(1568, 0.5, 0.5, 'triangle', 0.16) // G6 きらめき
  tone(2093, 0.56, 0.42, 'sine', 0.13) // C7 きらめき
  tone(392, 0.02, 0.6, 'sine', 0.1) // 低音の支え
}

// ホームのやること完了用（ことばナビの正解音とは別）：ベルのような「ちりん♪」
export function playTaskDone() {
  tone(988, 0, 0.12, 'sine', 0.2) // B5
  tone(1319, 0.09, 0.3, 'sine', 0.18) // E6
  tone(2637, 0.09, 0.2, 'sine', 0.05) // きらめき
}
// ホームの今日の分をぜんぶ終えたとき用：上がっていく鐘のようなアルペジオ
export function playTaskAllDone() {
  const notes = [784, 988, 1175, 1568, 1976] // G5 B5 D6 G6 B6
  notes.forEach((f, i) => { tone(f, i * 0.11, 0.4, 'sine', 0.2); tone(f * 2, i * 0.11, 0.2, 'sine', 0.04) })
  tone(2349, 0.6, 0.6, 'sine', 0.12) // D7
  tone(392, 0, 0.8, 'triangle', 0.08)
}

// 新しいキャラクター解放
export function playCharacterUnlock() {
  const notes = [659, 784, 988, 1175] // E5 G5 B5 D6
  notes.forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.2))
  tone(1568, 0.42, 0.4, 'triangle', 0.15)
}

// アイテムをゲットした時（軽いコイン音）
export function playItemGet() {
  tone(880, 0, 0.1, 'triangle', 0.18)
  tone(1175, 0.07, 0.16, 'triangle', 0.16)
}

// 称号アップ
export function playLevelUp() {
  const notes = [523, 587, 659, 698, 784, 880]
  notes.forEach((f, i) => tone(f, i * 0.06, 0.2, 'triangle', 0.18))
  tone(1047, 0.4, 0.4, 'triangle', 0.16)
}

// カテゴリーバッジ獲得（銅・銀・金 共通）
export function playBadgeGet() {
  tone(659, 0, 0.16, 'triangle', 0.18)
  tone(880, 0.1, 0.16, 'triangle', 0.18)
  tone(1047, 0.2, 0.3, 'triangle', 0.18)
}

// 苦手だった問題を克服（少し力強い、勝ち上がる感じ）
export function playComeback() {
  tone(330, 0, 0.14, 'sawtooth', 0.09)
  tone(392, 0.1, 0.14, 'sawtooth', 0.09)
  tone(659, 0.24, 0.3, 'triangle', 0.2)
  tone(880, 0.32, 0.32, 'triangle', 0.18)
}
