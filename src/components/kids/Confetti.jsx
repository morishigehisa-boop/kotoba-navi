import { useMemo, useEffect } from 'react'

const COLORS = ['#FF8A3D', '#FFC53D', '#4FB6E8', '#9B7FE0', '#4CB27A', '#FF6F6F']

export default function Confetti({ active, onDone }) {
  const pieces = useMemo(() => {
    if (!active) return []
    return Array.from({ length: 46 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.25,
      duration: 1.1 + Math.random() * 0.7,
      color: COLORS[i % COLORS.length],
      rotate: Math.floor(Math.random() * 360),
      drift: Math.round((Math.random() - 0.5) * 80),
      size: 6 + Math.random() * 6
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  useEffect(() => {
    if (!active) return
    const t = setTimeout(() => onDone && onDone(), 1900)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  if (!active) return null

  return (
    <div className="confetti-layer">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
            '--drift': `${p.drift}px`
          }}
        />
      ))}
    </div>
  )
}
