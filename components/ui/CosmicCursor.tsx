'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CosmicCursor() {
  const [isHovering, setIsHovering] = useState(false)
  
  // Tọa độ chuột
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Tọa độ lò xo (cho vòng tròn đi sau)
  const springConfig = { damping: 25, stiffness: 700 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      // Kiểm tra xem chuột có đang hover vào nút hoặc link không
      const target = e.target as HTMLElement
      const isClickable = 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer')
      
      setIsHovering(!!isClickable)
    }

    window.addEventListener('mousemove', moveCursor)
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [mouseX, mouseY])

  return (
    <>
      {/* CSS Global để ẩn con trỏ mặc định */}
      <style jsx global>{`
        body, a, button, input, textarea {
          cursor: none !important;
        }
      `}</style>

      {/* 1. Điểm sáng trung tâm (Dot) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#00ff88] rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%'
        }}
      />

      {/* 2. Vòng tròn bao quanh (Ring) */}
      <motion.div
        className="fixed top-0 left-0 border border-[#00ff88] rounded-full pointer-events-none z-[9998]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          width: isHovering ? 40 : 20, // To ra khi hover
          height: isHovering ? 40 : 20,
          opacity: isHovering ? 1 : 0.5,
          borderColor: isHovering ? '#00ff88' : 'rgba(0, 255, 136, 0.3)'
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  )
}