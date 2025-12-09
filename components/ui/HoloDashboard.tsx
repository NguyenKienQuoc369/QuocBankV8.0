'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Activity, Zap, Server, Globe } from 'lucide-react'
import { useEffect, useState } from 'react'

// Component con: Vòng tròn xoay (Ring)
function HoloRing({ size, rotationDuration, borderClass, reverse = false }: { size: number, rotationDuration: number, borderClass: string, reverse?: boolean }) {
  return (
    <motion.div
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration: rotationDuration, repeat: Infinity, ease: "linear" }}
      className={`absolute rounded-full border border-transparent ${borderClass}`}
      style={{ width: size, height: size }}
    />
  )
}

// Component con: Thẻ thông số vệ tinh (Floating Satellite)
function DataSatellite({ 
  icon: Icon, 
  label, 
  value, 
  angle, 
  distance, 
  color 
}: { 
  icon: any, label: string, value: string, angle: number, distance: number, color: string 
}) {
  // Tính toán vị trí dựa trên góc (Polar coordinates)
  const rad = (angle * Math.PI) / 180
  const x = Math.cos(rad) * distance
  const y = Math.sin(rad) * distance

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="absolute flex items-center gap-3"
      style={{ 
        left: `calc(50% + ${x}px)`, 
        top: `calc(50% + ${y}px)`, 
        transform: 'translate(-50%, -50%)' 
      }}
    >
      {/* Đường nối laser về tâm */}
      <div 
        className="absolute top-1/2 left-1/2 h-[1px] bg-gradient-to-r from-transparent to-white/30 -z-10 origin-left"
        style={{ 
          width: distance - 40, 
          transform: `rotate(${angle + 180}deg)`,
          left: '50%',
          top: '50%'
        }} 
      />

      {/* Icon tròn */}
      <div 
        className="w-10 h-10 rounded-full bg-black/60 border flex items-center justify-center backdrop-blur-sm"
        style={{ 
          borderColor: color,
          boxShadow: `0 0 15px ${color}`
        }}
      >
        <Icon size={18} style={{ color }} />
      </div>

      {/* Text thông số */}
      <div className="flex flex-col">
        <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">{label}</span>
        <span className="text-sm font-bold text-white font-mono">{value}</span>
      </div>
    </motion.div>
  )
}

export function HoloDashboard() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-[500px] h-[500px] flex items-center justify-center pointer-events-none select-none scale-90 lg:scale-100">
      
      {/* 1. LÕI NĂNG LƯỢNG (CENTER CORE) */}
      <div className="relative z-10 w-24 h-24 bg-black/50 rounded-full border border-[#00ff88]/50 flex items-center justify-center shadow-[0_0_50px_rgba(0,255,136,0.3)] backdrop-blur-xl">
        <div className="absolute inset-0 rounded-full border border-[#00ff88] border-dashed opacity-50 animate-spin-slow" />
        <div className="text-center">
           <div className="text-[10px] text-[#00ff88] animate-pulse font-mono">SYS_OK</div>
           <div className="text-2xl font-bold text-white tracking-tighter">98%</div>
        </div>
      </div>

      {/* 2. CÁC VÒNG QUỸ ĐẠO (RINGS) */}
      {/* Vòng 1: Quét Radar */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute w-48 h-48 rounded-full border-t border-r border-[#00ff88]/30"
      />
      
      {/* Vòng 2: Nét đứt (Dash) */}
      <HoloRing size={320} rotationDuration={20} borderClass="border-dashed border-white/10" />
      
      {/* Vòng 3: Nét liền mỏng (Thin) */}
      <HoloRing size={450} rotationDuration={30} borderClass="border-white/5" reverse />

      {/* Vòng 4: Hiệu ứng quét (Scanner Effect) */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#00ff88]/5 to-transparent animate-scan opacity-30 w-full h-full rounded-full" />

      {/* 3. CÁC VỆ TINH DỮ LIỆU (SATELLITES) */}
      {/* Góc tính theo độ (0 = 3h, 90 = 6h...) */}
      
      {/* Góc 1: Security Shield */}
      <DataSatellite 
        icon={ShieldCheck} 
        color="#00ff88" // Xanh lá
        label="FIREWALL" 
        value="SECURE" 
        angle={-45} 
        distance={180} 
      />

      {/* Góc 2: Network Activity */}
      <DataSatellite 
        icon={Activity} 
        color="#3b82f6" // Xanh dương
        label="NETWORK" 
        value="120 TB/s" 
        angle={-150} 
        distance={200} 
      />

      {/* Góc 3: Energy Level */}
      <DataSatellite 
        icon={Zap} 
        color="#eab308" // Vàng
        label="ENERGY" 
        value="STABLE" 
        angle={30} 
        distance={210} 
      />

      {/* Góc 4: Server Status */}
      <DataSatellite 
        icon={Server} 
        color="#a855f7" // Tím
        label="NODES" 
        value="5,240" 
        angle={110} 
        distance={160} 
      />

    </div>
  )
}