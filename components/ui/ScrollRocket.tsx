'use client'

import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

export function ScrollRocket() {
  const { scrollYProgress } = useScroll()
  
  // 1. LÀM MƯỢT CHUYỂN ĐỘNG
  // Tăng damping để tên lửa có độ "đầm", không bị giật cục
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // 2. TÍNH TOÁN QUỸ ĐẠO BAY (SLALOM)
  // - Y: Chạy từ đỉnh (5vh) xuống đáy (90vh)
  const yPosition = useTransform(smoothProgress, [0, 1], ['5vh', '95vh'])
  
  // - X: Lượn hình sin qua lại giữa trái và phải màn hình
  // Nhân với Math.PI * 6 để tạo ra 3 vòng lượn (qua trái, qua phải, qua trái...)
  // Biên độ 40vw nghĩa là lượn ra gần sát mép màn hình (40% chiều rộng view)
  const xPosition = useTransform(smoothProgress, (latest) => {
    return Math.sin(latest * Math.PI * 6) * 450 // 450px biên độ
  })

  // 3. TÍNH GÓC NGHIÊNG (BANKING)
  // Khi bay sang trái/phải, tên lửa phải nghiêng mình theo hướng đó
  // Dùng Math.cos (đạo hàm của sin) để tính góc nghiêng chuẩn vật lý
  const rotateZ = useTransform(smoothProgress, (latest) => {
    return Math.cos(latest * Math.PI * 6) * -45 // Nghiêng tối đa 45 độ
  })

  return (
    // Đặt container ở CHÍNH GIỮA màn hình (left-1/2) để làm tâm lượn
    <div className="fixed left-1/2 top-0 bottom-0 z-50 w-0 h-full pointer-events-none hidden md:block">
      
      {/* KHỐI TÊN LỬA (Bay theo toạ độ tính toán) */}
      <motion.div 
        style={{ 
          y: yPosition, 
          x: xPosition,
          rotateZ: rotateZ
        }}
        className="absolute w-24 h-24 -ml-12 -mt-12 flex items-center justify-center will-change-transform"
      >
        
        {/* --- HIỆU ỨNG RUNG LẮC (TURBULENCE) --- */}
        {/* Mô phỏng động cơ đang nổ máy mạnh */}
        <motion.div
           animate={{ x: [-1, 1, -1], y: [1, -1, 1] }}
           transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
           className="relative"
        >
           {/* Hào quang khiên năng lượng (Shield) */}
           <div className="absolute -inset-6 bg-[#00ff88] opacity-10 blur-2xl rounded-full"></div>

           {/* --- ĐỘNG CƠ PHUN LỬA (THRUSTER) --- */}
           {/* Đặt ở đuôi tàu (phía trên vì tàu hướng xuống) */}
           <div className="absolute bottom-[60%] left-1/2 -translate-x-1/2 rotate-180 z-0">
              {/* Lõi lửa trắng cực nóng */}
              <motion.div 
                animate={{ height: [20, 40, 20], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 0.05, repeat: Infinity }}
                className="w-2 bg-white rounded-full blur-[2px] mx-auto shadow-[0_0_15px_white]"
              />
              {/* Lửa xanh bao quanh (Plasma) */}
              <motion.div 
                animate={{ height: [40, 70, 40], width: [10, 14, 10], opacity: [0.6, 0.8, 0.6] }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#00ff88] rounded-full blur-md"
              />
              {/* Tàn lửa bay ra (Particles) */}
              <motion.div
                animate={{ y: [0, -50], opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute top-10 left-1/2 w-1 h-1 bg-white rounded-full"
              />
           </div>

           {/* --- HÌNH ẢNH TÊN LỬA --- */}
           {/* Đảm bảo file public/rocket.png tồn tại */}
           <div className="relative z-10 w-20 h-20 drop-shadow-[0_10px_30px_rgba(0,255,136,0.3)]">
              <Image 
                src="/rocket.png" 
                alt="Spaceship" 
                width={80} 
                height={80} 
                className="object-contain rotate-180" // Xoay đầu hướng xuống
              />
           </div>

           {/* Đèn tín hiệu nhấp nháy trên cánh (Navigation Lights) */}
           <motion.div 
             animate={{ opacity: [0, 1, 0] }}
             transition={{ duration: 1, repeat: Infinity }}
             className="absolute top-4 left-0 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_red]"
           />
           <motion.div 
             animate={{ opacity: [0, 1, 0] }}
             transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
             className="absolute top-4 right-0 w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_green]"
           />

        </motion.div>

      </motion.div>
    </div>
  )
}