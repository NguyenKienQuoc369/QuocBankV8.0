'use client'

import { motion } from 'framer-motion'

export function CosmicLogo({ className = "", size = 40 }: { className?: string, size?: number }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      
      {/* 1. Outer Glow (Hào quang tỏa ra) */}
      <div className="absolute inset-0 bg-[#00ff88] rounded-full blur-xl opacity-20 animate-pulse"></div>

      {/* 2. Orbit Ring 1 (Vòng xoay chậm - Tạo nét chính của chữ Q) */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border-[2px] border-transparent border-t-[#00ff88] border-r-[#00ff88]/50"
      />

      {/* 3. Orbit Ring 2 (Vòng xoay nhanh ngược chiều - Tạo độ phức tạp) */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-1 rounded-full border-[1px] border-transparent border-b-cyan-400/80 border-l-cyan-400/30"
      />

      {/* 4. The Core (Lõi hành tinh/Coin) */}
      <div className="relative w-[60%] h-[60%] bg-gradient-to-br from-white via-[#00ff88] to-black rounded-full flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-10 overflow-hidden">
         {/* Ánh sáng quét qua lõi (Shine Effect) */}
         <motion.div 
            animate={{ x: ['-150%', '150%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute w-full h-full bg-white/40 blur-md -skew-x-12"
         />
         {/* Chữ Q chìm bên trong */}
         <span className="text-black font-black text-[60%] leading-none mt-[10%] ml-[5%]">Q</span>
      </div>

      {/* 5. The Tail (Cái đuôi của chữ Q - Cách điệu bằng một vệ tinh nhỏ) */}
      <motion.div 
         className="absolute w-full h-full"
         animate={{ rotate: 360 }}
         transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
         <div className="absolute bottom-0 right-[15%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
      </motion.div>

    </div>
  )
}