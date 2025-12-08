'use client'

import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Rocket } from 'lucide-react'

export function ScrollRocket() {
  const { scrollYProgress } = useScroll()
  
  // Làm mượt chuyển động của tên lửa
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Tính toán vị trí Y của tên lửa (chạy từ 5% đến 90% chiều cao màn hình)
  const yRange = useTransform(scaleY, [0, 1], ['5vh', '90vh'])

  return (
    <div className="fixed right-4 top-0 bottom-0 z-50 w-1 flex flex-col justify-center items-center pointer-events-none hidden md:flex">
      {/* Thanh ray mờ */}
      <div className="absolute top-[5vh] bottom-[10vh] w-[2px] bg-white/10 rounded-full" />

      {/* Vệt khói năng lượng (chạy theo tên lửa) */}
      <motion.div 
        style={{ scaleY, transformOrigin: "top" }}
        className="absolute top-[5vh] bottom-[10vh] w-[2px] bg-gradient-to-b from-transparent via-[#00ff88] to-[#00ff88] rounded-full shadow-[0_0_10px_#00ff88]"
      />

      {/* Tên lửa */}
      <motion.div 
        style={{ top: yRange }}
        className="absolute -right-2 transform translate-x-1/2"
      >
        <div className="relative">
           {/* Hào quang động cơ */}
           <div className="absolute inset-0 bg-[#00ff88] blur-md opacity-50 rounded-full animate-pulse"></div>
           
           <div className="relative w-8 h-8 bg-black border border-[#00ff88] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.4)]">
              {/* Xoay tên lửa hướng xuống 135 độ cho hợp lý */}
              <Rocket size={16} className="text-[#00ff88] rotate-135" />
           </div>
        </div>
      </motion.div>
    </div>
  )
}