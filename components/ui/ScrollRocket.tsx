'use client'

import { motion, useScroll, useSpring, useTransform, useMotionValue, useMotionValueEvent } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState } from 'react'

export function ScrollRocket() {
  const { scrollYProgress, scrollY } = useScroll()
  const ref = useRef<HTMLDivElement>(null)
  
  // 1. CHUYỂN ĐỘNG MƯỢT (Smooth Physics)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // 2. TỰ ĐỘNG QUAY ĐẦU (Direction Detection)
  // Mặc định hướng xuống (180 độ)
  const rotateValue = useMotionValue(180) 
  
  // Lắng nghe sự kiện cuộn để xác định hướng
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() || 0
    const diff = latest - prev
    
    // Nếu đang cuộn xuống (diff > 0) -> Xoay 180 (Cắm đầu xuống)
    // Nếu đang cuộn lên (diff < 0) -> Xoay 0 (Ngóc đầu lên)
    if (diff > 0) {
      rotateValue.set(180) 
    } else if (diff < 0) {
      rotateValue.set(0)
    }
  })

  // Làm mượt cú quay đầu (xoay từ từ chứ không giật cái rụp)
  const smoothRotate = useSpring(rotateValue, { stiffness: 200, damping: 20 })

  // 3. QUỸ ĐẠO BAY (SLALOM)
  // Y: Chạy từ đỉnh (5vh) xuống đáy (95vh)
  const yPosition = useTransform(smoothProgress, [0, 1], ['5vh', '95vh'])
  
  // X: Lượn hình sin
  const xPosition = useTransform(smoothProgress, (latest) => {
    return Math.sin(latest * Math.PI * 6) * 450
  })

  // Góc nghiêng (Banking) khi cua
  const bankingRotation = useTransform(smoothProgress, (latest) => {
    return Math.cos(latest * Math.PI * 6) * -45
  })

  return (
    <div ref={ref} className="fixed left-1/2 top-0 bottom-0 z-50 w-0 h-full pointer-events-none hidden md:block">
      
      {/* CONTAINER DI CHUYỂN VỊ TRÍ (X, Y) */}
      <motion.div 
        style={{ 
          y: yPosition, 
          x: xPosition,
        }}
        className="absolute w-24 h-24 -ml-12 -mt-12 flex items-center justify-center will-change-transform"
      >
        
        {/* CONTAINER XOAY HƯỚNG (Banking + U-Turn) */}
        {/* Kết hợp góc nghiêng khi cua (banking) và góc quay đầu (smoothRotate) */}
        <motion.div
           style={{ 
             rotateZ: bankingRotation, 
             rotate: smoothRotate 
           }}
           className="relative w-full h-full flex items-center justify-center"
        >
           {/* --- HIỆU ỨNG RUNG LẮC ĐỘNG CƠ (Vibration) --- */}
           <motion.div
              animate={{ x: [-1, 1, -1], y: [1, -1, 1] }}
              transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
              className="relative"
           >
              {/* Khiên năng lượng */}
              <div className="absolute -inset-6 bg-[#00ff88] opacity-10 blur-2xl rounded-full"></div>

              {/* --- ĐỘNG CƠ PHUN LỬA (THRUSTER) --- */}
              {/* Luôn nằm ở đuôi tàu (phía dưới của ảnh gốc) */}
              <div className="absolute top-[80%] left-1/2 -translate-x-1/2 z-0">
                 {/* Lửa trắng tâm */}
                 <motion.div 
                   animate={{ height: [20, 40, 20], opacity: [0.9, 1, 0.9] }}
                   transition={{ duration: 0.05, repeat: Infinity }}
                   className="w-2 bg-white rounded-full blur-[2px] mx-auto shadow-[0_0_15px_white]"
                 />
                 {/* Lửa xanh bao quanh */}
                 <motion.div 
                   animate={{ height: [40, 70, 40], width: [10, 14, 10], opacity: [0.6, 0.8, 0.6] }}
                   transition={{ duration: 0.1, repeat: Infinity }}
                   className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#00ff88] rounded-full blur-md"
                 />
                 {/* Tàn lửa (Particles) */}
                 <motion.div
                   animate={{ y: [0, 50], opacity: [1, 0] }}
                   transition={{ duration: 0.5, repeat: Infinity, ease: "easeOut" }}
                   className="absolute top-10 left-1/2 w-1 h-1 bg-white rounded-full"
                 />
              </div>

              {/* --- HÌNH ẢNH TÊN LỬA --- */}
              {/* Mặc định ảnh rocket.png hướng lên trên (0 độ) */}
              <div className="relative z-10 w-20 h-20 drop-shadow-[0_10px_30px_rgba(0,255,136,0.3)]">
                 <Image 
                   src="/rocket.png" 
                   alt="Spaceship" 
                   width={80} 
                   height={80} 
                   className="object-contain" // Không xoay ở đây nữa, để framer xoay
                 />
              </div>

           </motion.div>
        </motion.div>

      </motion.div>
    </div>
  )
}