'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { HoverProvider } from './HoverContext' // Import Provider

export function MagneticButton({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false) // Thêm state

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { height, width, left, top } = ref.current!.getBoundingClientRect()
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 })
  }

  const handleMouseEnter = () => setIsHovered(true) // Bật

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
    setIsHovered(false) // Tắt
  }

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter} // Thêm sự kiện này
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onClick={onClick}
    >
      {/* Truyền tín hiệu xuống cho HyperText bên trong */}
      <HoverProvider value={isHovered}>
        {children}
      </HoverProvider>
    </motion.button>
  )
}