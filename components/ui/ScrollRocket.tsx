'use client'

import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'

export function ScrollRocket() {
  const { scrollYProgress } = useScroll()
  
  // Làm mượt chuyển động: tăng mass để tên lửa có độ trễ vật lý (nặng hơn)
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Tính toán vị trí bay (từ 5% đến 90% màn hình)
  const yRange = useTransform(scaleY, [0, 1], ['5vh', '90vh'])
  
  // Tính toán độ mờ của vệt khói (dài ra khi lướt xuống)
  const trailOpacity = useTransform(scaleY, [0, 0.1], [0, 1])

  return (
    <div className="fixed right-6 top-0 bottom-0 z-50 w-12 flex flex-col justify-center items-center pointer-events-none hidden md:flex">
      
      {/* 1. THANH RAY DẪN ĐƯỜNG (Mờ) */}
      <div className="absolute top-0 bottom-0 w-[1px] bg-white/5" />

      {/* 2. VỆT KHÓI NĂNG LƯỢNG (PLASMA TRAIL) */}
      {/* Chạy từ đỉnh màn hình nối vào đuôi tên lửa */}
      <motion.div 
        style={{ height: yRange, opacity: trailOpacity }}
        className="absolute top-0 w-[2px] bg-gradient-to-b from-transparent via-[#00ff88]/50 to-[#00ff88] shadow-[0_0_15px_#00ff88]"
      />

      {/* 3. KHỐI TÊN LỬA (Bay theo Y) */}
      <motion.div 
        style={{ top: yRange }}
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
      >
        {/* Container rung lắc nhẹ mô phỏng động cơ nổ */}
        <motion.div
           animate={{ x: [-1, 1, -1], y: [1, -1, 1] }}
           transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
           className="relative"
        >
           {/* Hào quang bảo vệ (Shield Glow) */}
           <div className="absolute -inset-4 bg-[#00ff88] opacity-20 blur-xl rounded-full animate-pulse"></div>

           {/* HÌNH ẢNH TÊN LỬA */}
           {/* Lưu ý: Bạn cần file public/rocket.png */}
           <div className="relative w-12 h-12 drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
              <Image 
                src="/rocket.png" 
                alt="Spaceship" 
                width={48} 
                height={48} 
                className="object-contain rotate-180" // Xoay 180 độ nếu ảnh gốc hướng lên
              />
           </div>

           {/* HIỆU ỨNG LỬA ĐỘNG CƠ (Engine Thruster) */}
           {/* Gồm nhiều lớp lửa xếp chồng lên nhau */}
           <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
              {/* Lõi lửa trắng */}
              <motion.div 
                animate={{ height: [10, 20, 10], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="w-1 bg-white rounded-full blur-[1px] mx-auto"
              />
              {/* Lửa xanh bao quanh */}
              <motion.div 
                animate={{ height: [20, 35, 20], width: [6, 8, 6], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 0.15, repeat: Infinity }}
                className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#00ff88] rounded-full blur-sm"
              />
              {/* Khói mờ bay xa */}
              <motion.div 
                animate={{ height: [30, 50, 30], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 0.2, repeat: Infinity }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-4 bg-[#00ff88] rounded-full blur-md"
              />
           </div>

        </motion.div>
      </motion.div>
    </div>
  )
}