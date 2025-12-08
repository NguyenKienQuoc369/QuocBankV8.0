'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Zap, Database, Wifi, Shield, Cpu, Activity, Network, Lock, Server, BarChart3 } from 'lucide-react'

// --- 1. DỮ LIỆU CÔNG NGHỆ CHI TIẾT ---
const techData = [
  { 
    id: 'warp', 
    name: 'GALAXY CORP', 
    icon: Globe, 
    color: '#00ff88', // Xanh Neon
    desc: 'Hạ tầng mạng liên thiên hà.',
    detail: 'Hệ thống định tuyến lượng tử kết nối 98,000 hành tinh. Đảm bảo độ trễ bằng 0 tuyệt đối thông qua công nghệ Warp-Gate.',
    stats: [
      { label: 'LATENCY', val: '0.00ms' },
      { label: 'UPTIME', val: '100%' },
      { label: 'NODES', val: '5B+' }
    ]
  },
  { 
    id: 'quantum', 
    name: 'QUANTUM VC', 
    icon: Zap, 
    color: '#00d4ff', // Cyan
    desc: 'Quỹ đầu tư mạo hiểm lượng tử.',
    detail: 'Sử dụng AI dự đoán thị trường tương lai để tối ưu hóa lợi nhuận. Tự động tái cân bằng danh mục đầu tư theo mili-giây.',
    stats: [
      { label: 'APY', val: '18.5%' },
      { label: 'AUM', val: '$900B' },
      { label: 'RISK', val: 'LOW' }
    ]
  },
  { 
    id: 'void', 
    name: 'VOID BANK', 
    icon: Database, 
    color: '#a855f7', // Tím
    desc: 'Kho lưu trữ tài sản hố đen.',
    detail: 'Công nghệ nén dữ liệu vật chất, lưu trữ tài sản trong không gian chiều thứ 4 (Void). Bất khả xâm phạm về mặt vật lý.',
    stats: [
      { label: 'SEC', val: 'MAX' },
      { label: 'ENC', val: '512-BIT' },
      { label: 'OFFLINE', val: 'YES' }
    ]
  },
  { 
    id: 'star', 
    name: 'STAR LINK', 
    icon: Wifi, 
    color: '#fbbf24', // Vàng
    desc: 'Kết nối vệ tinh siêu tốc.',
    detail: 'Mạng lưới 40,000 vệ tinh tầm thấp bao phủ toàn bộ các tuyến đường thương mại không gian. Kết nối không bao giờ đứt đoạn.',
    stats: [
      { label: 'SPEED', val: '10Tbps' },
      { label: 'BAND', val: '60GHz' },
      { label: 'SATS', val: '40K' }
    ]
  },
  { 
    id: 'nebula', 
    name: 'NEBULA PAY', 
    icon: Shield, 
    color: '#f472b6', // Hồng
    desc: 'Cổng thanh toán tinh vân.',
    detail: 'Giao thức thanh toán đa chuỗi, tự động chuyển đổi tiền tệ giữa các nền văn minh. Phí giao dịch gần như bằng không.',
    stats: [
      { label: 'TPS', val: '1M+' },
      { label: 'FEE', val: '0.00%' },
      { label: 'TYPE', val: 'DEFI' }
    ]
  },
  { 
    id: 'orbit', 
    name: 'ORBIT TEC', 
    icon: Cpu, 
    color: '#34d399', // Xanh ngọc
    desc: 'Vi xử lý quỹ đạo.',
    detail: 'Chip xử lý sinh học được cấy ghép trực tiếp vào hệ thống thần kinh của phi thuyền, giúp xử lý giao dịch bằng suy nghĩ.',
    stats: [
      { label: 'CORES', val: '1024' },
      { label: 'TEMP', val: '-200C' },
      { label: 'SYNC', val: 'BIO' }
    ]
  },
]

export function TechUniverse() {
  const [activeTech, setActiveTech] = useState<typeof techData[0] | null>(null)

  return (
    <div className="relative w-full h-[600px] lg:h-[700px] flex items-center justify-center">
      
      {/* 1. BACKGROUND GRID (Lưới không gian) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)] pointer-events-none" />

      {/* 2. LÕI TRUNG TÂM (CORE REACTOR) */}
      <div className="absolute z-10 flex flex-col items-center justify-center">
         {/* Các vòng xoay năng lượng */}
         <div className="relative w-40 h-40 flex items-center justify-center">
            {[1, 2, 3].map((i) => (
               <motion.div
                  key={i}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 15 + i * 5, ease: "linear", repeat: Infinity }}
                  className="absolute rounded-full border border-[#00ff88]/20"
                  style={{ inset: -i * 25, borderStyle: i === 2 ? 'dashed' : 'solid' }}
               />
            ))}
            
            {/* Khối cầu chính */}
            <div className="w-32 h-32 rounded-full bg-black border-2 border-[#00ff88] shadow-[0_0_60px_rgba(0,255,136,0.4)] flex flex-col items-center justify-center z-20 animate-pulse-slow relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
               <Network size={40} className="text-[#00ff88] mb-1 group-hover:scale-110 transition-transform" />
               <div className="text-white font-black text-xl tracking-tighter">CORE</div>
               <div className="text-[9px] text-[#00ff88] font-mono animate-pulse">SYSTEM_ONLINE</div>
            </div>
         </div>
      </div>

      {/* 3. CÁC VỆ TINH CÔNG NGHỆ (Orbit Nodes) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
         {techData.map((tech, i) => {
            // Tính toán vị trí cố định trên vòng tròn (để người dùng dễ click)
            const angle = (i * 360) / techData.length;
            const radius = 320; // Bán kính
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            const isActive = activeTech?.id === tech.id;

            return (
               <div 
                  key={tech.id}
                  className="absolute top-1/2 left-1/2 pointer-events-auto"
                  style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}
               >
                  {/* ĐƯỜNG KẾT NỐI VÀO TÂM (Laser Line) */}
                  <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: isActive ? radius - 40 : 0 }} // Chỉ hiện khi Active
                     className="absolute top-1/2 left-1/2 h-[2px] origin-left z-0 pointer-events-none"
                     style={{ 
                        backgroundColor: tech.color,
                        transform: `rotate(${angle + 180}deg)`, // Quay ngược về tâm
                        boxShadow: `0 0 15px ${tech.color}`
                     }}
                  />

                  {/* NODE CÔNG NGHỆ (Nút bấm) */}
                  <motion.div
                     whileHover={{ scale: 1.1 }}
                     onMouseEnter={() => setActiveTech(tech)} // Hover là hiện luôn
                     className={`relative z-20 w-20 h-20 rounded-2xl bg-black/90 border-2 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 group
                        ${isActive ? 'scale-110 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : 'border-white/20 hover:border-white/50'}
                     `}
                     style={{ 
                        borderColor: isActive ? tech.color : undefined,
                        boxShadow: isActive ? `0 0 30px ${tech.color}` : 'none'
                     }}
                  >
                     <tech.icon size={28} style={{ color: tech.color }} />
                     <div className="text-[9px] font-bold text-white mt-2 tracking-widest bg-white/10 px-2 py-0.5 rounded">
                        {tech.name.split(' ')[0]}
                     </div>

                     {/* Vòng Target Lock xoay quanh khi Active */}
                     {isActive && (
                        <motion.div
                           className="absolute inset-[-15px] rounded-full border border-dashed"
                           style={{ borderColor: tech.color }}
                           animate={{ rotate: 360 }}
                           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                     )}
                  </motion.div>
               </div>
            )
         })}
      </div>

      {/* 4. BẢNG THÔNG TIN HOLOGRAM (HIỆN RA KHI CÓ ACTIVE TECH) */}
      <AnimatePresence mode='wait'>
         {activeTech && (
            <motion.div
               key={activeTech.id}
               initial={{ opacity: 0, x: 20, scale: 0.95 }}
               animate={{ opacity: 1, x: 0, scale: 1 }}
               exit={{ opacity: 0, x: 20, scale: 0.95 }}
               transition={{ duration: 0.3, ease: "easeOut" }}
               className="absolute right-4 bottom-4 md:right-10 md:top-1/2 md:-translate-y-1/2 w-80 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl z-50 overflow-hidden"
               style={{ borderLeft: `4px solid ${activeTech.color}` }}
            >
               {/* Background Noise */}
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
               
               {/* Scan Line Animation */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-scan" />

               {/* Header */}
               <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                     <activeTech.icon size={24} style={{ color: activeTech.color }} />
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-white tracking-wider">{activeTech.name}</h3>
                     <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> SYSTEM OPERATIONAL
                     </div>
                  </div>
               </div>

               {/* Description */}
               <p className="text-sm text-gray-300 mb-6 leading-relaxed border-l-2 border-white/10 pl-3">
                  {activeTech.detail}
               </p>

               {/* Stats Grid - RẤT DỄ ĐỌC */}
               <div className="grid grid-cols-1 gap-2 mb-4">
                  {activeTech.stats.map((stat, idx) => (
                     <div key={idx} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-[10px] text-gray-500 font-bold tracking-wider">{stat.label}</span>
                        <span className="text-sm font-mono font-bold" style={{ color: activeTech.color }}>{stat.val}</span>
                     </div>
                  ))}
               </div>

               {/* Audio Visualizer Footer */}
               <div className="flex items-end justify-between h-6 mt-4 border-t border-white/10 pt-2 opacity-50">
                  <div className="text-[9px] text-gray-500 font-mono">LIVE DATA FEED</div>
                  <div className="flex gap-0.5 h-full items-end">
                     {[1,2,3,4,5,6,7,8].map(i => (
                        <motion.div 
                           key={i} 
                           className="w-1 bg-white"
                           animate={{ height: ['20%', '100%', '40%'] }}
                           transition={{ duration: 0.4, repeat: Infinity, repeatType: 'reverse', delay: i * 0.05 }}
                           style={{ backgroundColor: activeTech.color }}
                        />
                     ))}
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  )
}