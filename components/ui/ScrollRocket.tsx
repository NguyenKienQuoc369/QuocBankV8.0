'use client'

import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

export function ScrollRocket() {
  const { scrollYProgress, scrollY } = useScroll()
  const [direction, setDirection] = useState(180) // 180 = Xuống, 0 = Lên
  
  // 1. LÀM MƯỢT CHUYỂN ĐỘNG
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // 2. XÁC ĐỊNH HƯỚNG ĐỂ XOAY ĐẦU
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() || 0
    const diff = latest - prev
    if (Math.abs(diff) > 1) { 
       // Nếu đang cuộn xuống -> Xoay 180 (Mũi xuống)
       // Nếu đang cuộn lên -> Xoay 0 (Mũi lên)
       setDirection(diff > 0 ? 180 : 0)
    }
  })

  // 3. TÍNH TOÁN VỊ TRÍ TRÊN THANH CUỘN
  // Chạy từ 2% (đỉnh) đến 90% (đáy) chiều cao màn hình
  const yPosition = useTransform(smoothProgress, [0, 1], ['2%', '90%'])

  return (
    <div className="fixed right-8 top-0 bottom-0 z-50 w-12 hidden md:flex flex-col justify-center pointer-events-none">
      
      {/* --- THANH RAY (TRACK) --- */}
      <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-[1px] bg-white/10 rounded-full"></div>

      {/* --- VỆT TIẾN ĐỘ (PROGRESS FILL) --- */}
      {/* Một tia sáng chạy từ đỉnh xuống tới vị trí tên lửa */}
      <motion.div 
        style={{ height: yPosition }}
        className="absolute top-8 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-[#00ff88]/50 to-[#00ff88] shadow-[0_0_10px_#00ff88]"
      />

      {/* --- TÊN LỬA (INDICATOR) --- */}
      <motion.div 
        style={{ top: yPosition }}
        className="absolute left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center will-change-transform"
      >
        <motion.div
           animate={{ rotate: direction }}
           transition={{ type: "spring", stiffness: 120, damping: 20 }}
           className="relative w-full h-full flex items-center justify-center"
        >
           {/* Rung lắc nhẹ cho sinh động */}
           <motion.div
              animate={{ y: [1, -1, 1] }}
              transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
              className="relative"
           >
              {/* Động cơ phun lửa (Luôn nằm ở đuôi tàu) */}
              <div className="absolute top-[75%] left-1/2 -translate-x-1/2 z-0">
                 <motion.div 
                   animate={{ height: [10, 20, 10], opacity: [0.8, 1, 0.8] }}
                   transition={{ duration: 0.1, repeat: Infinity }}
                   className="w-1 bg-white rounded-full blur-[1px] mx-auto"
                 />
                 <motion.div 
                   animate={{ height: [20, 35, 20], width: [6, 10, 6], opacity: [0.5, 0.8, 0.5] }}
                   transition={{ duration: 0.15, repeat: Infinity }}
                   className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#00ff88] rounded-full blur-sm"
                 />
              </div>

              {/* Hình ảnh tên lửa */}
              <div className="relative z-10 w-8 h-8 drop-shadow-[0_0_15px_rgba(0,255,136,0.6)]">
                 <Image 
                   src="/rocket.png" 
                   alt="Scroll Rocket" 
                   width={32} 
                   height={32} 
                   className="object-contain" 
                 />
              </div>
           </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}