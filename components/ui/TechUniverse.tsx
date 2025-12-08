'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Zap, Database, Wifi, Shield, Cpu, Activity, Lock, Server } from 'lucide-react'

// DATA: Thông tin chi tiết cho từng công nghệ
const technologies = [
  { 
    id: 'galaxy', 
    name: 'GALAXY CORP', 
    icon: Globe, 
    color: '#00ff88', 
    desc: 'Hạ tầng mạng liên thiên hà.',
    stats: ['Latency: 0.00ms', 'Coverage: 100%', 'Nodes: 5B+']
  },
  { 
    id: 'quantum', 
    name: 'QUANTUM VC', 
    icon: Zap, 
    color: '#00d4ff', 
    desc: 'Quỹ đầu tư mạo hiểm lượng tử.',
    stats: ['APY: 12.5%', 'Assets: $500B', 'Risk: Low']
  },
  { 
    id: 'void', 
    name: 'VOID BANK', 
    icon: Database, 
    color: '#a855f7', 
    desc: 'Kho lưu trữ tài sản hố đen.',
    stats: ['Security: Max', 'Encryption: 512-bit', 'Offline: Yes']
  },
  { 
    id: 'star', 
    name: 'STAR LINK', 
    icon: Wifi, 
    color: '#fbbf24', 
    desc: 'Kết nối vệ tinh siêu tốc độ.',
    stats: ['Speed: 10Tbps', 'Uptime: 99.99%', 'Satellites: 40k']
  },
  { 
    id: 'nebula', 
    name: 'NEBULA PAY', 
    icon: Shield, 
    color: '#f472b6', 
    desc: 'Cổng thanh toán liên sao.',
    stats: ['Tx/s: 1M+', 'Fee: 0.0001%', 'Global: Yes']
  },
  { 
    id: 'orbit', 
    name: 'ORBIT TEC', 
    icon: Cpu, 
    color: '#34d399', 
    desc: 'Vi xử lý quỹ đạo thông minh.',
    stats: ['Cores: 1024', 'AI: Gen-5', 'Cooling: Liquid']
  },
]

export function TechUniverse() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div className="relative w-full h-[800px] flex items-center justify-center overflow-hidden bg-black/40 backdrop-blur-sm rounded-3xl border border-white/5">
      
      {/* 1. BACKGROUND GRID (Lưới không gian) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none" />

      {/* 2. LÕI NĂNG LƯỢNG TRUNG TÂM (CORE REACTOR) */}
      <div className="relative z-10 w-48 h-48 flex items-center justify-center">
         {/* Vòng xoay năng lượng bên ngoài */}
         <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity }}
            className="absolute inset-0 rounded-full border border-dashed border-[#00ff88]/30"
         />
         <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, ease: "linear", repeat: Infinity }}
            className="absolute inset-4 rounded-full border-2 border-transparent border-t-[#00ff88] border-b-[#00ff88] opacity-50"
         />
         
         {/* Khối cầu năng lượng chính */}
         <div className="w-32 h-32 rounded-full bg-black border-4 border-[#00ff88] shadow-[0_0_80px_rgba(0,255,136,0.6)] flex flex-col items-center justify-center relative z-20 animate-pulse-slow">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay rounded-full"></div>
            <Activity size={40} className="text-[#00ff88] mb-2" />
            <div className="text-white font-black text-xl tracking-tighter">CORE</div>
            <div className="text-[10px] text-[#00ff88] font-mono animate-pulse">SYSTEM_ONLINE</div>
         </div>
      </div>

      {/* 3. VÒNG QUỸ ĐẠO CÁC CÔNG NGHỆ */}
      <div className="absolute inset-0 flex items-center justify-center">
         <motion.div
            className="relative w-[600px] h-[600px]"
            animate={{ rotate: isPaused ? 0 : 360 }} // Dừng xoay khi hover
            transition={{ duration: 60, ease: "linear", repeat: Infinity }}
            style={{ transformOrigin: 'center center' }}
         >
            {technologies.map((tech, i) => {
               const angle = (360 / technologies.length) * i
               return (
                  <TechSatellite 
                     key={tech.id} 
                     tech={tech} 
                     angle={angle} 
                     setHoveredId={setHoveredId}
                     setIsPaused={setIsPaused}
                     isHovered={hoveredId === tech.id}
                  />
               )
            })}
         </motion.div>
      </div>

      {/* 4. ĐƯỜNG LASER KẾT NỐI (Khi Hover) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
         {hoveredId && technologies.map((tech, i) => {
            if (tech.id !== hoveredId) return null;
            // Vì container cha xoay, nên việc tính toán tọa độ chính xác cho đường line SVG tĩnh là rất phức tạp.
            // Ở đây ta dùng một hiệu ứng giả lập: Một tia sáng từ tâm bắn ra mọi hướng
            return (
               <defs key="defs">
                  <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                     <stop offset="0%" stopColor={tech.color} stopOpacity="0.5" />
                     <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>
               </defs>
            )
         })}
         {/* Hiệu ứng nền toả sáng từ tâm khi hover */}
         {hoveredId && (
            <circle cx="50%" cy="50%" r="300" fill="url(#grad1)" className="animate-pulse" />
         )}
      </svg>

    </div>
  )
}

// COMPONENT CON: VỆ TINH CÔNG NGHỆ
function TechSatellite({ tech, angle, setHoveredId, setIsPaused, isHovered }: any) {
   return (
      <div
         className="absolute top-1/2 left-1/2 -ml-10 -mt-10 w-20 h-20"
         style={{ transform: `rotate(${angle}deg) translate(300px)` }} // Đẩy ra xa tâm 300px
      >
         {/* Container con xoay ngược chiều để Icon luôn đứng thẳng */}
         <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, ease: "linear", repeat: Infinity }}
            style={{ width: '100%', height: '100%' }}
         >
            <motion.div
               className="relative group cursor-pointer"
               whileHover={{ scale: 1.2 }}
               onMouseEnter={() => { setHoveredId(tech.id); setIsPaused(true) }}
               onMouseLeave={() => { setHoveredId(null); setIsPaused(false) }}
            >
               {/* Vòng tròn Icon */}
               <div 
                  className={`w-20 h-20 rounded-full border-2 bg-black/80 flex items-center justify-center backdrop-blur-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-20 relative
                     ${isHovered ? 'border-transparent' : 'border-white/20'}
                  `}
                  style={{ 
                     boxShadow: isHovered ? `0 0 40px ${tech.color}` : 'none',
                     borderColor: isHovered ? tech.color : undefined
                  }}
               >
                  <tech.icon size={32} style={{ color: isHovered ? '#fff' : tech.color }} className="transition-colors" />
               </div>

               {/* Bảng thông tin chi tiết (HOLOGRAM CARD) - Hiện ra khi hover */}
               <AnimatePresence>
                  {isHovered && (
                     <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute top-24 left-1/2 -translate-x-1/2 w-64 bg-black/95 border border-white/20 rounded-xl p-4 z-50 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
                        style={{ borderTopColor: tech.color, borderTopWidth: 3 }}
                     >
                        {/* Header của Card */}
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                           <tech.icon size={16} style={{ color: tech.color }} />
                           <span className="font-bold text-white text-sm tracking-wider">{tech.name}</span>
                        </div>
                        
                        {/* Mô tả */}
                        <p className="text-gray-400 text-xs mb-3">{tech.desc}</p>
                        
                        {/* Thông số kỹ thuật (Stats) */}
                        <div className="space-y-1">
                           {tech.stats.map((stat: string, idx: number) => (
                              <div key={idx} className="flex items-center justify-between text-[10px] bg-white/5 px-2 py-1 rounded">
                                 <span className="text-gray-500">{stat.split(':')[0]}</span>
                                 <span className="text-white font-mono">{stat.split(':')[1]}</span>
                              </div>
                           ))}
                        </div>

                        {/* Scan Line Effect */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/5 to-transparent h-1 w-full animate-scan" />
                     </motion.div>
                  )}
               </AnimatePresence>

            </motion.div>
         </motion.div>
      </div>
   )
}