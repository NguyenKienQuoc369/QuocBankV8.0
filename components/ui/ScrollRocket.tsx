'use client'

import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState } from 'react'

export function ScrollRocket() {
  const { scrollYProgress, scrollY } = useScroll()
  const [isFlying, setIsFlying] = useState(false)
  
  // 1. PHÁT HIỆN TRẠNG THÁI BAY
  // Nếu cuộn quá 50px thì coi như đã cất cánh
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsFlying(latest > 50)
  })

  // 2. VẬT LÝ CHUYỂN ĐỘNG
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Tự động quay đầu (U-Turn)
  const rotateValue = useSpring(180, { stiffness: 200, damping: 20 })
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() || 0
    const diff = latest - prev
    if (Math.abs(diff) > 5) { // Chỉ xoay khi cuộn đủ mạnh để tránh rung
       rotateValue.set(diff > 0 ? 180 : 0)
    }
  })

  // 3. QUỸ ĐẠO BAY
  // Y: Xuất phát từ 10vh (gọn gàng ở trên)
  const yPosition = useTransform(smoothProgress, [0, 1], ['10vh', '95vh'])
  
  // X: Lượn sóng (Chỉ lượn khi đã bay được một đoạn - nhân với smoothProgress để tại 0 nó là 0)
  const xPosition = useTransform(smoothProgress, (latest) => {
    // Nếu chưa bay (gần 0) thì X = 0 để nằm giữa
    const amplitude = latest < 0.05 ? 0 : 450
    return Math.sin(latest * Math.PI * 6) * amplitude
  })

  // Góc nghiêng: Chỉ nghiêng khi đang bay
  const bankingRotation = useTransform(smoothProgress, (latest) => {
    if (latest < 0.05) return 0 // Lúc đỗ thì thẳng băng
    return Math.cos(latest * Math.PI * 6) * -45
  })

  return (
    <div className="fixed left-1/2 top-0 bottom-0 z-50 w-0 h-full pointer-events-none hidden md:block">
      
      <motion.div 
        style={{ y: yPosition, x: xPosition }}
        className="absolute w-24 h-24 -ml-12 -mt-12 flex items-center justify-center will-change-transform"
      >
        <motion.div
           style={{ rotateZ: bankingRotation, rotate: rotateValue }}
           className="relative w-full h-full flex items-center justify-center"
        >
           {/* Rung lắc (Chỉ rung khi đang bay) */}
           <motion.div
              animate={isFlying ? { x: [-1, 1, -1], y: [1, -1, 1] } : { x: 0, y: 0 }}
              transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
              className="relative"
           >
              {/* Khiên năng lượng (Chỉ hiện khi bay) */}
              <motion.div 
                animate={{ opacity: isFlying ? 0.3 : 0, scale: isFlying ? 1 : 0.8 }}
                className="absolute -inset-6 bg-[#00ff88] blur-2xl rounded-full transition-all duration-700"
              />

              {/* --- ĐỘNG CƠ PHUN LỬA (THRUSTER) --- */}
              {/* Ẩn đi khi chưa bay (Opacity 0) */}
              <motion.div 
                animate={{ opacity: isFlying ? 1 : 0, scale: isFlying ? 1 : 0 }}
                transition={{ duration: 0.3 }} // Hiệu ứng bật lửa từ từ
                className="absolute top-[75%] left-1/2 -translate-x-1/2 z-0"
              >
                 <motion.div 
                   animate={{ height: [20, 40, 20], opacity: [0.9, 1, 0.9] }}
                   transition={{ duration: 0.05, repeat: Infinity }}
                   className="w-2 bg-white rounded-full blur-[2px] mx-auto shadow-[0_0_15px_white]"
                 />
                 <motion.div 
                   animate={{ height: [40, 70, 40], width: [10, 14, 10], opacity: [0.6, 0.8, 0.6] }}
                   transition={{ duration: 0.1, repeat: Infinity }}
                   className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#00ff88] rounded-full blur-md"
                 />
              </motion.div>

              {/* --- HÌNH ẢNH TÊN LỬA --- */}
              <div className="relative z-10 w-20 h-20 drop-shadow-[0_10px_30px_rgba(0,255,136,0.3)]">
                 <Image 
                   src="/rocket.png" 
                   alt="Spaceship" 
                   width={80} 
                   height={80} 
                   className="object-contain" 
                 />
              </div>

              {/* Đèn báo trạng thái (Đỏ = Đỗ, Xanh = Bay) */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full shadow-[0_0_5px_currentColor] transition-colors duration-500 ${isFlying ? 'bg-green-400' : 'bg-red-500 animate-pulse'}`}></div>

           </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}