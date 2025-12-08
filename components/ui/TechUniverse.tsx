'use client'

/**
 * QUOCBANK - QUANTUM TECH UNIVERSE VISUALIZER
 * Version: 3.0 (Ultimate Edition)
 * Complexity: High
 * Description: Hệ thống hiển thị công nghệ lõi với tương tác vật lý giả lập và giao diện HUD Sci-fi.
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { 
  Globe, Zap, Database, Wifi, Shield, Cpu, 
  Activity, Lock, Server, BarChart3, Terminal, 
  Radio, Share2, Hexagon, Fingerprint 
} from 'lucide-react'

// --- 1. DỮ LIỆU CÔNG NGHỆ (DATA LAYER) ---
// Dữ liệu được mở rộng chi tiết để hiển thị trên Dashboard
const techModules = [
  { 
    id: 'warp', 
    code: 'SYS-01',
    name: 'GALAXY CORP', 
    icon: Globe, 
    color: '#00ff88', 
    desc: 'Hạ tầng mạng liên thiên hà.',
    longDesc: 'Sử dụng công nghệ Warp-Gate để bẻ cong không gian, tạo ra các đường hầm dữ liệu tức thời giữa các thiên hà.',
    specs: [
      { label: 'LATENCY', val: '0.00ms', status: 'OPTIMAL' },
      { label: 'NODES', val: '5,240,000', status: 'ACTIVE' },
      { label: 'RANGE', val: 'UNIVERSAL', status: 'MAX' }
    ]
  },
  { 
    id: 'quantum', 
    code: 'SYS-02',
    name: 'QUANTUM VC', 
    icon: Zap, 
    color: '#00d4ff', 
    desc: 'Quỹ đầu tư mạo hiểm lượng tử.',
    longDesc: 'AI phân tích đa vũ trụ để dự đoán xu hướng thị trường trước khi nó xảy ra. Tự động hóa giao dịch tần suất cao.',
    specs: [
      { label: 'APY', val: '18.5%', status: 'STABLE' },
      { label: 'PREDICTION', val: '99.9%', status: 'HIGH' },
      { label: 'VOLUME', val: '500T', status: 'LIQUID' }
    ]
  },
  { 
    id: 'void', 
    code: 'SYS-03',
    name: 'VOID BANK', 
    icon: Database, 
    color: '#a855f7', 
    desc: 'Kho lưu trữ tài sản hố đen.',
    longDesc: 'Công nghệ nén vật chất vào không gian chiều thứ 4. Tài sản được bảo vệ bởi chân trời sự kiện nhân tạo.',
    specs: [
      { label: 'ENCRYPTION', val: 'QUANTUM', status: 'LOCKED' },
      { label: 'INTEGRITY', val: '100%', status: 'VERIFIED' },
      { label: 'BACKUP', val: 'DECENTRALIZED', status: 'OK' }
    ]
  },
  { 
    id: 'star', 
    code: 'SYS-04',
    name: 'STAR LINK', 
    icon: Wifi, 
    color: '#fbbf24', 
    desc: 'Kết nối vệ tinh siêu tốc.',
    longDesc: 'Mạng lưới lưới vệ tinh bao phủ 100% các tuyến đường thương mại. Cung cấp internet lượng tử cho tàu vũ trụ.',
    specs: [
      { label: 'BANDWIDTH', val: '100 PB/s', status: 'FAST' },
      { label: 'COVERAGE', val: '99.999%', status: 'FULL' },
      { label: 'SATELLITES', val: '42,000', status: 'ONLINE' }
    ]
  },
  { 
    id: 'nebula', 
    code: 'SYS-05',
    name: 'NEBULA PAY', 
    icon: Shield, 
    color: '#f472b6', 
    desc: 'Cổng thanh toán tinh vân.',
    longDesc: 'Giao thức chuyển đổi tiền tệ nguyên tử (Atomic Swap). Hỗ trợ thanh toán bất kỳ loại tiền nào, ở bất kỳ đâu.',
    specs: [
      { label: 'TPS', val: '1,000,000', status: 'PEAK' },
      { label: 'FEE', val: '0.0001%', status: 'LOW' },
      { label: 'SECURITY', val: 'AUDITED', status: 'SAFE' }
    ]
  },
  { 
    id: 'orbit', 
    code: 'SYS-06',
    name: 'ORBIT TEC', 
    icon: Cpu, 
    color: '#34d399', 
    desc: 'Vi xử lý quỹ đạo.',
    longDesc: 'Chip sinh học tích hợp AI thế hệ 5. Xử lý các giao dịch phức tạp bằng tốc độ suy nghĩ của người dùng.',
    specs: [
      { label: 'CORES', val: '1024 Q-Bit', status: 'COOL' },
      { label: 'TEMP', val: '-270°C', status: 'NOMINAL' },
      { label: 'SYNC', val: 'NEURAL', status: 'LINKED' }
    ]
  },
]

// --- 2. SUB-COMPONENTS (Các thành phần con phức tạp) ---

// 2.1. Background Grid & Particles (Nền)
const SpaceEnvironment = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
    {/* Grid Lưới */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
    
    {/* Hạt bụi trôi nổi (Static CSS Animation để tối ưu perf) */}
    {[...Array(20)].map((_, i) => (
      <div 
        key={i}
        className="absolute bg-white rounded-full opacity-20 animate-pulse"
        style={{
          width: Math.random() * 2 + 1 + 'px',
          height: Math.random() * 2 + 1 + 'px',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          animationDuration: Math.random() * 3 + 2 + 's'
        }}
      />
    ))}
  </div>
)

// 2.2. Terminal Logs (Nhật ký hệ thống giả lập)
const SystemTerminal = ({ activeColor }: { activeColor: string }) => {
  const [logs, setLogs] = useState<string[]>([])
  const messages = ["Initializing connection...", "Handshake secure...", "Loading module data...", "Decrypting stream...", "Render complete."]

  useEffect(() => {
    setLogs([])
    let i = 0
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLogs(prev => [...prev, `> ${messages[i]}`])
        i++
      } else clearInterval(interval)
    }, 400)
    return () => clearInterval(interval)
  }, [activeColor])

  return (
    <div className="h-24 bg-black/50 rounded border border-white/10 p-2 font-mono text-[9px] text-gray-400 overflow-hidden flex flex-col justify-end">
      {logs.map((log, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <span style={{ color: activeColor }}>root@quocbank:~$</span> {log}
        </motion.div>
      ))}
    </div>
  )
}

// 2.3. Audio Visualizer (Sóng âm)
const AudioVisualizer = ({ color }: { color: string }) => (
  <div className="flex items-end gap-[2px] h-8 w-full opacity-80">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="w-1 bg-current rounded-t-sm"
        style={{ backgroundColor: color }}
        animate={{ height: ["10%", "90%", "30%", "60%"] }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          repeatType: "reverse", 
          delay: i * 0.05,
          ease: "easeInOut" 
        }}
      />
    ))}
  </div>
)

// --- 3. MAIN COMPONENT: TECH UNIVERSE ---

export function TechUniverse() {
  const [activeId, setActiveId] = useState<string>(techModules[0].id)
  const activeTech = techModules.find(t => t.id === activeId) || techModules[0]
  
  // Ref để tính toán vị trí vẽ line (nếu cần)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="relative w-full h-[700px] lg:h-[800px] bg-black/80 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
      
      {/* Nền không gian */}
      <SpaceEnvironment />

      {/* --- CỘT TRÁI: HỆ THỐNG ĐIỀU KHIỂN (NAVIGATOR) --- */}
      <div className="w-full lg:w-1/3 border-r border-white/10 bg-white/5 relative z-10 flex flex-col">
        
        {/* Header Cột Trái */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-[#00ff88] animate-pulse" />
            <span className="text-xs font-bold text-white tracking-widest">SYSTEM DIAGNOSTICS</span>
          </div>
          <div className="text-[10px] text-gray-500 font-mono">
            V.2.0.45 // SECURE CONNECTION ESTABLISHED
          </div>
        </div>

        {/* Danh sách Modules */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {techModules.map((tech) => {
            const isActive = activeId === tech.id
            return (
              <motion.button
                key={tech.id}
                onClick={() => setActiveId(tech.id)}
                whileHover={{ x: 5 }}
                className={`w-full group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left overflow-hidden
                  ${isActive ? 'bg-white/10 border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]' : 'bg-transparent border-transparent hover:bg-white/5'}
                `}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1" 
                    style={{ backgroundColor: tech.color }} 
                  />
                )}

                {/* Icon Box */}
                <div 
                  className={`p-3 rounded-lg transition-colors ${isActive ? 'bg-black' : 'bg-white/5 group-hover:bg-white/10'}`}
                  style={{ color: isActive ? tech.color : '#6b7280' }}
                >
                  <tech.icon size={20} />
                </div>

                {/* Text Info */}
                <div>
                  <div className={`font-bold text-sm tracking-wide ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                    {tech.name}
                  </div>
                  <div className="text-[9px] text-gray-600 font-mono group-hover:text-[#00ff88] transition-colors">
                    STATUS: ONLINE
                  </div>
                </div>

                {/* Mũi tên active */}
                {isActive && (
                  <div className="ml-auto opacity-50">
                    <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: tech.color }} />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Footer Cột Trái */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
            <span>CPU LOAD: 12%</span>
            <span>MEM: 4.2TB</span>
          </div>
          <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-[#00ff88] w-[12%] animate-pulse" />
          </div>
        </div>
      </div>

      {/* --- CỘT PHẢI: MÀN HÌNH HIỂN THỊ CHI TIẾT (MAIN SCREEN) --- */}
      <div className="flex-1 relative z-10 flex flex-col">
        
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTech.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="flex-1 p-6 lg:p-10 flex flex-col h-full"
          >
            {/* 1. Header Chi tiết */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded bg-white/10 text-[10px] font-mono text-white border border-white/10">
                    MODULE: {activeTech.code}
                  </span>
                  <span className="px-2 py-1 rounded bg-[#00ff88]/10 text-[10px] font-mono text-[#00ff88] border border-[#00ff88]/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" /> OPERATIONAL
                  </span>
                </div>
                <h2 
                  className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500"
                  style={{ textShadow: `0 0 30px ${activeTech.color}40` }}
                >
                  {activeTech.name}
                </h2>
              </div>
              
              {/* Icon Lớn xoay xoay trang trí */}
              <div className="relative hidden md:block">
                <div className="absolute inset-0 blur-2xl opacity-40" style={{ backgroundColor: activeTech.color }}></div>
                <activeTech.icon size={64} style={{ color: activeTech.color }} className="relative z-10" />
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-20px] border border-dashed rounded-full opacity-30"
                  style={{ borderColor: activeTech.color }}
                />
              </div>
            </div>

            {/* 2. Nội dung mô tả & Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 flex-1">
              {/* Mô tả (2 phần) */}
              <div className="md:col-span-2 space-y-6">
                <div className="text-lg text-gray-300 font-light leading-relaxed border-l-4 pl-4" style={{ borderColor: activeTech.color }}>
                  {activeTech.longDesc}
                </div>
                
                {/* Bảng thông số kỹ thuật (GRID STATS) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeTech.specs.map((spec, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="text-[10px] text-gray-500 font-bold mb-1 flex justify-between">
                        {spec.label}
                        <span className="text-[#00ff88] opacity-0 group-hover:opacity-100 transition-opacity">{spec.status}</span>
                      </div>
                      <div className="text-xl font-mono font-bold text-white tracking-tight">
                        {spec.val}
                      </div>
                      <div className="w-full h-[2px] bg-gray-800 mt-2 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: "100%" }} 
                          transition={{ delay: 0.5 + idx * 0.1, duration: 1 }}
                          className="h-full"
                          style={{ backgroundColor: activeTech.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cột phải: Terminal & Visualizer (1 phần) */}
              <div className="flex flex-col gap-4">
                <div className="bg-black/40 rounded-xl border border-white/10 p-4 flex-1 flex flex-col justify-between">
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-[10px] text-gray-500 font-bold">SIGNAL STRENGTH</span>
                    <Wifi size={12} className="text-gray-500" />
                  </div>
                  <AudioVisualizer color={activeTech.color} />
                </div>
                <SystemTerminal activeColor={activeTech.color} />
              </div>
            </div>

            {/* 3. Footer Action */}
            <div className="mt-auto border-t border-white/10 pt-6 flex justify-between items-center">
              <div className="flex gap-4">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white border border-white/5 hover:border-white/20">
                  <Share2 size={18} />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white border border-white/5 hover:border-white/20">
                  <Fingerprint size={18} />
                </button>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20">
                <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
                <span className="text-xs font-bold text-[#00ff88] tracking-wider">LIVE DATA FEED</span>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

        {/* Scan line effect đè lên toàn bộ màn hình phải */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,255,136,0.02)_50%,transparent_100%)] bg-[size:100%_4px] opacity-20" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#00ff88]/5 to-transparent h-[10%] w-full animate-scan" />
      </div>

    </div>
  )
}