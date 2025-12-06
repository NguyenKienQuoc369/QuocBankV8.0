'use client'
import { useEffect, useState } from 'react'

export function WarpSpeed({ active }: { active?: boolean }) {
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    if (!active) return
    const raf = requestAnimationFrame(() => setPulse(true))
    const t = setTimeout(() => setPulse(false), 800)
    return () => { cancelAnimationFrame(raf); clearTimeout(t) }
  }, [active])

  if (!active) return null
  return (
    <div aria-hidden className={`absolute inset-0 pointer-events-none z-0 ${pulse ? 'animate-wiggle' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/2 to-transparent opacity-5" />
    </div>
  )
}

export default WarpSpeed
