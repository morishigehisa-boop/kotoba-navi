import { useEffect, useRef, useState } from 'react'
import { BODIES } from './characterBodies'
import { ITEM_FRAGMENTS } from './characterItems'

// キャラクターの絵（本体：characterBodies.jsx／着せ替え：characterItems.jsx）。タップすると反応する
const POKES = ['poke-shake', 'poke-hop', 'poke-spin'] // さわったときのリアクション（順番に切りかわる）

export default function Character({ character = 'fox', state, accessory }) {
  const [poke, setPoke] = useState({ n: 0, cls: '' })
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  // タップで、ふるえる・はねる・くるっと回る。いっしゅん笑顔になる
  function handlePoke() {
    const n = poke.n + 1
    setPoke({ n, cls: POKES[n % POKES.length] })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setPoke((p) => ({ ...p, cls: '' })), 700)
  }

  const shown = poke.cls && state !== 'sad' ? 'happy' : state
  const cls = `${shown === 'happy' ? 'fox happy' : shown === 'sad' ? 'fox sad' : 'fox'} ${poke.cls}`.trim()
  const body = (BODIES[character] || BODIES.fox)[shown] || (BODIES[character] || BODIES.fox).idle
  const frag = accessory ? ITEM_FRAGMENTS[accessory] : null

  return (
    <div className={cls} key={poke.cls ? poke.n : 'base'} onClick={handlePoke} role="button" aria-label="キャラクターをさわる">
      <svg viewBox="0 0 100 100">
        {frag?.back}
        {body}
        {frag?.front}
      </svg>
    </div>
  )
}
