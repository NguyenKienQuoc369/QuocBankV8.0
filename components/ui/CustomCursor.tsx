'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(true)
  const [isInteractive, setIsInteractive] = useState(false)

  // Smooth the motion with springs
  const springX = useSpring(pos.x, { stiffness: 300, damping: 30 })
  const springY = useSpring(pos.y, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
    }

    const handleEnter = () => setVisible(true)
    const handleLeave = () => setVisible(false)

    const handleOver = (e: Event) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const tag = target.tagName
      const isControl = !!(target.closest('a') || target.closest('button') || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.getAttribute('contenteditable') === 'true')
      setIsInteractive(isControl)
      // toggle body class to let native cursor show on interactive elements
      if (isControl) document.body.classList.add('use-custom-cursor-native')
      else document.body.classList.remove('use-custom-cursor-native')
    }

    document.body.classList.add('use-custom-cursor')
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseenter', handleEnter)
    window.addEventListener('mouseleave', handleLeave)
    window.addEventListener('mouseover', handleOver)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseenter', handleEnter)
      window.removeEventListener('mouseleave', handleLeave)
      window.removeEventListener('mouseover', handleOver)
      document.body.classList.remove('use-custom-cursor')
      document.body.classList.remove('use-custom-cursor-native')
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        /* hide native cursor site-wide while mouse is present */
        body.use-custom-cursor * { cursor: none !important; }
        /* allow native cursor on interactive controls when flagged */
        body.use-custom-cursor.use-custom-cursor-native input,
        body.use-custom-cursor.use-custom-cursor-native textarea,
        body.use-custom-cursor.use-custom-cursor-native button,
        body.use-custom-cursor.use-custom-cursor-native a,
        body.use-custom-cursor.use-custom-cursor-native select {
          cursor: auto !important;
        }
      `}</style>

      <motion.div
        aria-hidden
        style={{ x: springX, y: springY }}
        className="pointer-events-none fixed z-[9999] left-0 top-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: visible && !isInteractive ? 1 : 0, scale: visible ? 1 : 0.6 }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      >
        <div style={{ transform: 'translate(-50%, -50%)' }}>
          <div className="w-3 h-3 rounded-full bg-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.35)]" />
        </div>
      </motion.div>

      {/* subtle trailing ring */}
      <motion.div
        aria-hidden
        style={{ x: springX, y: springY }}
        className="pointer-events-none fixed z-[9998] left-0 top-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 0.8 : 0, scale: visible ? 1 : 0.6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div style={{ transform: 'translate(-50%, -50%)' }}>
          <div className="w-8 h-8 rounded-full border border-[#00ff88]/20 backdrop-blur-sm" />
        </div>
      </motion.div>
    </>
  )
}
