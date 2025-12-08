'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Spark {
  id: number
  x: number
  y: number
  particles: { angle: number; speed: number; color: string; size: number }[]
}

export const ClickSpark = () => {
  const [sparks, setSparks] = useState<Spark[]>([])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Tạo ra 8-12 hạt ngẫu nhiên cho mỗi cú click
      const particleCount = 12
      const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
        angle: (360 / particleCount) * i + (Math.random() * 20 - 10), // Góc bay (có lệch chút cho tự nhiên)
        speed: Math.random() * 80 + 40, // Tốc độ bay
        color: Math.random() > 0.5 ? '#00ff88' : '#00d4ff', // Random màu Xanh lá hoặc Cyan
        size: Math.random() * 3 + 1 // Kích thước hạt
      }))

      const newSpark = { 
        id: Date.now(), 
        x: e.clientX, 
        y: e.clientY,
        particles: newParticles
      }
      
      setSparks((prev) => [...prev, newSpark])

      // Dọn dẹp sau 800ms
      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== newSpark.id))
      }, 800)
    }

    window.addEventListener('mousedown', handleClick) // Dùng mousedown cho nhạy hơn click
    return () => window.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {sparks.map((spark) => (
          <div 
            key={spark.id}
            className="absolute top-0 left-0 w-0 h-0"
            style={{ transform: `translate(${spark.x}px, ${spark.y}px)` }}
          >
            {/* 1. Lõi nổ flash (Chớp sáng trắng) */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-[2px]"
            />

            {/* 2. Vòng xung kích (Shockwave Ring) */}
            <motion.div
              initial={{ scale: 0, opacity: 0.8, borderWidth: 4 }}
              animate={{ scale: 2.5, opacity: 0, borderWidth: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-[#00ff88]"
            />

            {/* 3. Các hạt bắn ra (Particles) */}
            {spark.particles.map((p, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ 
                  x: Math.cos((p.angle * Math.PI) / 180) * p.speed, 
                  y: Math.sin((p.angle * Math.PI) / 180) * p.speed, 
                  opacity: 0,
                  scale: 0
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute rounded-full shadow-[0_0_6px_currentColor]"
                style={{ 
                  backgroundColor: p.color,
                  width: p.size,
                  height: p.size,
                  color: p.color // Dùng cho shadow
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}