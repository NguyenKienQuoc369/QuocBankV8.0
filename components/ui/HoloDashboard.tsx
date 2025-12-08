'use client'

import { motion } from 'framer-motion'
import { Activity, Wifi, Shield, Globe, Cpu } from 'lucide-react'

export function HoloDashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="relative w-full max-w-md ml-auto mr-10 hidden lg:block"
    >
      {/* Khung viền Hologram */}
      <div className="absolute -inset-1 bg-gradient-to-b from-[#00ff88]/20 to-transparent rounded-2xl blur-sm"></div>
      
      <div className="relative bg-black/40 backdrop-blur-md border border-[#00ff88]/30 rounded-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></div>
              <span className="text-xs font-mono text-[#00ff88] tracking-widest">SYSTEM_MONITOR</span>
           </div>
           <Wifi size={16} className="text-white/50" />
        </div>

        {/* Nội dung chính */}
        <div className="space-y-6">
           {/* 1. Biểu đồ sóng (Giả lập) */}
           <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                 <span>MARKET_VOLATILITY</span>
                 <span className="text-[#00ff88]">+24.5%</span>
              </div>
              <div className="h-12 flex items-end gap-1">
                 {[40, 70, 30, 80, 50, 90, 60, 40, 70, 50, 80, 60].map((h, i) => (
                    <motion.div 
                       key={i}
                       initial={{ height: '10%' }}
                       animate={{ height: `${h}%` }}
                       transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
                       className="flex-1 bg-[#00ff88]/20 border-t border-[#00ff88] rounded-t-sm"
                    />
                 ))}
              </div>
           </div>

           {/* 2. Grid thông số */}
           <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                 <Shield size={16} className="text-blue-400 mb-2" />
                 <div className="text-xs text-gray-500">FIREWALL</div>
                 <div className="text-sm font-bold text-white">ACTIVE</div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                 <Cpu size={16} className="text-yellow-400 mb-2" />
                 <div className="text-xs text-gray-500">CPU LOAD</div>
                 <div className="text-sm font-bold text-white">12%</div>
              </div>
           </div>

           {/* 3. Bản đồ nhỏ (Visual) */}
           <div className="relative h-32 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center bg-black/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.1),transparent)]"></div>
              {/* Vòng tròn xoay */}
              <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="w-24 h-24 border border-dashed border-white/20 rounded-full"
              />
              <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 className="absolute w-16 h-16 border border-white/10 rounded-full"
              />
              <Globe size={24} className="text-[#00ff88] relative z-10" />
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-gray-500">NODE: EARTH-01</div>
           </div>
        </div>

        {/* Scan line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff88]/5 to-transparent h-4 w-full animate-scan pointer-events-none"></div>
      </div>
    </motion.div>
  )
}