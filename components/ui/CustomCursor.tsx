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

      // Determine the real element under the pointer to avoid false positives
      // (some child nodes or SVGs inside buttons may confuse `mouseover` events).
      try {
        const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
        if (el) {
          const tag = el.tagName
          const isControl = !!(
            el.closest('a') ||
            el.closest('button') ||
            tag === 'INPUT' ||
            tag === 'TEXTAREA' ||
            tag === 'SELECT' ||
            el.getAttribute('contenteditable') === 'true'
          )
          setIsInteractive(isControl)
          if (isControl) document.body.classList.add('use-custom-cursor-native')
          else document.body.classList.remove('use-custom-cursor-native')
        } else {
          setIsInteractive(false)
          document.body.classList.remove('use-custom-cursor-native')
        }
      } catch (err) {
        // elementFromPoint can throw in odd circumstances in some browsers; ignore
      }
    }

    const handleEnter = () => setVisible(true)
    const handleLeave = () => {
      setVisible(false)
      setIsInteractive(false)
      document.body.classList.remove('use-custom-cursor-native')
    }

    // enable custom cursor on body
    document.body.classList.add('use-custom-cursor')
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseenter', handleEnter)
    window.addEventListener('mouseleave', handleLeave)

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
        body.use-custom-cursor, body.use-custom-cursor * { cursor: none !important; }
        /* when an interactive control is detected, restore native cursor for that area */
        body.use-custom-cursor.use-custom-cursor-native * { cursor: auto !important; }
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
          <div className="w-6 h-6 rounded-full bg-[#00ff88] shadow-[0_0_18px_rgba(0,255,136,0.45)]" />
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
          <div className="w-14 h-14 rounded-full border-2 border-[#00ff88]/25 backdrop-blur-sm" />
        </div>
      </motion.div>
    </>
  )
}
