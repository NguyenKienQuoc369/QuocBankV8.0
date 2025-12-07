// components/ui/ClickSpark.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Spark {
  id: number
  x: number
  y: number
}

export const ClickSpark = () => {
  const [sparks, setSparks] = useState<Spark[]>([])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newSpark = { id: Date.now(), x: e.clientX, y: e.clientY }
      
      // Thêm spark mới
      setSparks((prev) => [...prev, newSpark])

      // Tự động xóa sau 1s để tránh tràn bộ nhớ
      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== newSpark.id))
      }, 1000)
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.div
            key={spark.id}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ 
              left: spark.x, 
              top: spark.y,
              translateX: '-50%',
              translateY: '-50%'
            }}
            className="absolute w-20 h-20"
          >
            {/* Vòng tròn xung kích (Shockwave) */}
            <span className="absolute inset-0 rounded-full border-2 border-[#00ff88] opacity-80 animate-ping" />
            
            {/* Lõi năng lượng (Core) */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-md opacity-50" />
            
            {/* Các tia sáng nhỏ bắn ra (Spikes) */}
            <motion.div 
              initial={{ rotate: 0, scale: 0.5 }}
              animate={{ rotate: 90, scale: 1.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
               <div className="w-full h-[1px] bg-white/80 absolute rotate-0" />
               <div className="w-full h-[1px] bg-white/80 absolute rotate-45" />
               <div className="w-full h-[1px] bg-white/80 absolute rotate-90" />
               <div className="w-full h-[1px] bg-white/80 absolute rotate-135" />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}