'use client'

import { motion, useScroll, useSpring, useTransform, useMotionValue, useAnimationFrame } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

export function ScrollRocket() {
  const { scrollYProgress } = useScroll()
  const ref = useRef<HTMLDivElement>(null)
  
  // 1. Y-AXIS MOVEMENT (Bay dọc)
  // Làm mượt chuyển động, thêm độ trễ vật lý (mass cao hơn)
  const smoothY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  })
  // Map từ 0-1 sang vị trí trên màn hình (ví dụ: từ 10vh đến 85vh)
  const yPosition = useTransform(smoothY, [0, 1], ['10vh', '85vh'])

  // 2. X-AXIS DRIFT (Bay lượn ngang)
  // Tạo hiệu ứng lượn sóng hình sin nhẹ sang trái phải khi bay xuống
  const xDrift = useTransform(smoothY, (latest) => {
    // latest là giá trị từ 0 đến 1. Nhân với Math.PI * 4 để tạo ra 2 chu kỳ sóng đầy đủ.
    // Biên độ lượn là +/- 25px.
    return Math.sin(latest * Math.PI * 4) * 25
  })
  
  // Góc nghiêng nhẹ theo hướng bay ngang cho chân thực
  const rotateDrift = useTransform(xDrift, [-25, 25], [-10, 10])

  return (
    <div ref={ref} className="fixed right-12 top-0 bottom-0 z-50 w-24 flex flex-col justify-center items-center pointer-events-none hidden md:flex">
      
      {/* CONTAINER CHÍNH CỦA TÊN LỬA (Di chuyển theo Y và X) */}
      <motion.div 
        style={{ 
          top: yPosition, 
          x: xDrift,
          rotateZ: rotateDrift
        }}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        
        {/* --- PHẦN ĐUÔI KHÓI (CONTRAIL) --- */}
        {/* Nằm phía sau tên lửa (z-index thấp hơn trong stack context) */}
        <div className="absolute bottom-[50%] left-1/2 -translate-x-1/2 w-full flex flex-col items-center">
           {/* Lớp khói 1: Dài nhất, mờ nhất */}
           <motion.div 
             style={{ height: useTransform(smoothY, [0, 1], ['100px', '300px']) }}
             className="w-10 bg-gradient-to-t from-[#00ff88]/0 via-[#00ff88]/20 to-[#00ff88]/40 blur-xl rounded-full origin-bottom -mb-10"
           />
           {/* Lớp khói 2: Ngắn hơn, đậm hơn */}
           <motion.div 
             style={{ height: useTransform(smoothY, [0, 1], ['50px', '150px']) }}
             className="absolute bottom-0 w-6 bg-gradient-to-t from-[#00ff88]/0 via-[#00ff88]/40 to-[#00ff88]/70 blur-lg rounded-full origin-bottom -mb-6"
           />
           {/* Lớp khói 3: Lõi năng lượng sát đuôi */}
           <div className="absolute bottom-0 w-2 h-20 bg-gradient-to-t from-transparent to-white/80 blur-md -mb-2"></div>
        </div>


        {/* --- PHẦN ĐỘNG CƠ PHUN LỬA (THRUSTER) --- */}
        {/* Đã sửa hướng: Đặt ở phía trên (visual tail) và phun ngược lên */}
        <div className="absolute bottom-[80%] left-1/2 -translate-x-1/2 rotate-180 z-10">
           {/* Lõi lửa trắng */}
           <motion.div 
             animate={{ height: [15, 25, 15], opacity: [0.9, 1, 0.9] }}
             transition={{ duration: 0.1, repeat: Infinity }}
             className="w-1.5 bg-white rounded-full blur-[1px] mx-auto shadow-[0_0_10px_white]"
           />
           {/* Lửa xanh bao quanh */}
           <motion.div 
             animate={{ height: [25, 40, 25], width: [8, 12, 8], opacity: [0.6, 0.9, 0.6] }}
             transition={{ duration: 0.15, repeat: Infinity }}
             className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#00ff88] rounded-full blur-sm"
           />
        </div>


        {/* --- PHẦN THÂN TÊN LỬA (RUNG LẮC) --- */}
        <motion.div
           // Hiệu ứng rung lắc khi động cơ hoạt động
           animate={{ x: [-1.5, 1.5, -1.5], y: [0.5, -0.5, 0.5] }}
           transition={{ duration: 0.15, repeat: Infinity, ease: "linear" }}
           className="relative z-20"
        >
           {/* Hào quang bảo vệ (Shield Glow) */}
           <div className="absolute -inset-2 bg-[#00ff88] opacity-30 blur-xl rounded-full animate-pulse"></div>

           {/* HÌNH ẢNH TÊN LỬA PNG */}
           {/* Đảm bảo bạn có file public/rocket.png */}
           <div className="relative w-16 h-16 drop-shadow-[0_5px_15px_rgba(0,255,136,0.4)]">
              <Image 
                src="/rocket.png" 
                alt="Spaceship" 
                width={64} 
                height={64} 
                className="object-contain rotate-180" // Xoay 180 độ để đầu hướng xuống
              />
           </div>
        </motion.div>

      </motion.div>
    </div>
  )
}