import { pickRandom } from '../../lib/utils'

// 答えたときのマスコットのせりふと、次の問題へ進むまでの間（ことばナビ・さんすうナビ共通）
export const NEXT_QUESTION_DELAY_MS = 700
const HAPPY_LINES = ['やったね！', 'その調子！', 'さすが！', 'よくできました！']
export const happyMascot = () => ({ state: 'happy', text: pickRandom(HAPPY_LINES) })
export const SAD_MASCOT = { state: 'sad', text: 'だいじょうぶ、次で覚えよう' }
