'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HyperText } from './HyperText'
import { Globe, Zap, Database, Wifi, Shield, Cpu } from 'lucide-react'

// Danh sách 6 công nghệ của anh
const technologies = [
  { id: 'galaxy', name: 'GALAXY_CORP', icon: Globe, color: '#00ff88', angle: 0, desc: 'Hạ tầng mạng liên thiên hà' },
  { id: 'quantum', name: 'QUANTUM_VC', icon: Zap, color: '#00d4ff', angle: 60, desc: 'Quỹ đầu tư mạo hiểm lượng tử' },
  { id: 'void', name: 'VOID_BANK', icon: Database, color: '#a855f7', angle: 120, desc: 'Lưu trữ tài sản hố đen' },
  { id: 'star', name: 'STAR_LINK', icon: Wifi, color: '#fbbf24', angle: 180, desc: 'Kết nối vệ tinh siêu tốc' },
  { id: 'nebula', name: 'NEBULA_PAY', icon: Shield, color: '#f472b6', angle: 240, desc: 'Cổng thanh toán tinh vân' },
  { id: 'orbit', name: 'ORBIT_TEC', icon: Cpu, color: '#34d399', angle: 300, desc: 'Vi xử lý quỹ đạo' },
]

export function TechUniverse() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      
      {/* 1. LÕI TRUNG TÂM (CORE) */}
      <div className="absolute z-10 w-32 h-32 bg-black rounded-full flex items-center justify-center border-4 border-[#00ff88] shadow-[0_0_100px_rgba(0,255,136,0.5)] animate-pulse">
         <div className="text-center">
            <div className="text-3xl font-black text-white">CORE</div>
            <div className="text-[10px] text-[#00ff88] tracking-widest">SYSTEM</div>
         </div>
         {/* Vòng xoay quanh lõi */}
         <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity }}
            className="absolute inset-[-10px] rounded-full border-t-2 border-[#00ff88]/50 border-transparent"
         />
      </div>

      {/* 2. HỆ THỐNG VỆ TINH (Quay tròn) */}
      <motion.div 
         animate={{ rotate: 360 }}
         transition={{ duration: 40, ease: "linear", repeat: Infinity }}
         className="absolute w-[600px] h-[600px] rounded-full border border-white/10"
      >
         {technologies.map((tech) => {
            // Tính vị trí trên vòng tròn (CSS transform)
            const rotation = `rotate(${tech.angle}deg) translate(300px) rotate(-${tech.angle}deg)`
            
            return (
               <div 
                  key={tech.id}
                  className="absolute top-1/2 left-1/2 -ml-10 -mt-10 w-20 h-20 flex items-center justify-center"
                  style={{ transform: `rotate(${tech.angle}deg) translate(300px)` }} // Đẩy ra xa tâm 300px
               >
                  {/* Container con xoay ngược lại để Icon luôn đứng thẳng */}
                  <motion.div 
                     animate={{ rotate: -360 }}
                     transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                     className="relative w-full h-full group"
                     onMouseEnter={() => setHoveredTech(tech.id)}
                     onMouseLeave={() => setHoveredTech(null)}
                  >
                     <div 
                        className="w-20 h-20 rounded-2xl bg-black/80 border-2 flex flex-col items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-125 hover:border-transparent"
                        style={{ 
                           borderColor: hoveredTech === tech.id ? tech.color : 'rgba(255,255,255,0.2)',
                           boxShadow: hoveredTech === tech.id ? `0 0 30px ${tech.color}` : 'none'
                        }}
                     >
                        <tech.icon size={28} style={{ color: tech.color }} className="mb-1" />
                        <span className="text-[8px] font-bold text-white tracking-widest">{tech.name.split('_')[0]}</span>
                     </div>

                     {/* Tooltip hiển thị khi hover */}
                     <AnimatePresence>
                        {hoveredTech === tech.id && (
                           <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 bg-black/90 border border-white/20 p-3 rounded-lg text-center z-50 pointer-events-none"
                           >
                              <div style={{ color: tech.color }} className="font-bold text-xs mb-1">{tech.name}</div>
                              <div className="text-gray-400 text-[10px]">{tech.desc}</div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </motion.div>
               </div>
            )
         })}
      </motion.div>
    </div>
  )
}