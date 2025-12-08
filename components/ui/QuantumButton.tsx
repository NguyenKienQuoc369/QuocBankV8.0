'use client'

import React, { useRef, useState } from 'react'
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion'

// 1. SỬA LỖI TẠI ĐÂY: Kế thừa HTMLMotionProps thay vì ButtonHTMLAttributes
interface QuantumButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
}

export function QuantumButton({ children, className = "", onClick, variant = 'primary', ...props }: QuantumButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; angle: number; speed: number }[]>([])

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return // Thêm check null an toàn
    const { clientX, clientY } = e
    const { height, width, left, top } = buttonRef.current.getBoundingClientRect()
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      angle: (Math.PI * 2 * i) / 12,
      speed: Math.random() * 50 + 20
    }))

    setParticles((prev) => [...prev, ...newParticles])

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id < Date.now()))
    }, 600)

    if (onClick) onClick(e)
  }

  const baseStyles = "relative px-8 py-4 rounded-xl font-bold text-lg overflow-hidden transition-all group"
  const variantStyles = variant === 'primary' 
    ? "bg-[#00ff88] text-black shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:shadow-[0_0_50px_rgba(0,255,136,0.6)]"
    : "bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-md"

  return (
    <motion.button
      ref={buttonRef}
      className={`${baseStyles} ${variantStyles} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={{ x: position.x, y: position.y }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9, x: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      {...props} // Bây giờ props đã tương thích hoàn toàn
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform ease-in-out duration-700" />

      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
            animate={{ 
              x: p.x + Math.cos(p.angle) * p.speed, 
              y: p.y + Math.sin(p.angle) * p.speed, 
              opacity: 0,
              scale: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full bg-white pointer-events-none z-50 shadow-[0_0_10px_white]"
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {particles.length > 0 && (
           <motion.span
             initial={{ 
               left: particles[0]?.x || '50%', 
               top: particles[0]?.y || '50%', 
               width: 0, 
               height: 0, 
               opacity: 0.8,
               borderWidth: 10
             }}
             animate={{ 
               width: 300, 
               height: 300, 
               opacity: 0,
               left: (particles[0]?.x || 0) - 150,
               top: (particles[0]?.y || 0) - 150,
               borderWidth: 0
             }}
             transition={{ duration: 0.4 }}
             className="absolute rounded-full border-white bg-transparent pointer-events-none z-40"
           />
        )}
      </AnimatePresence>

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}