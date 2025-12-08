'use client'

/**
 * QUOCBANK INTERSTELLAR - SYSTEM DIAGNOSTICS MODULE
 * Version: 4.0 (Ultimate HUD Edition)
 * Description: Hệ thống hiển thị thông tin công nghệ lõi phong cách Cyberpunk/Sci-fi Dashboard.
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, Zap, Database, Wifi, Shield, Cpu, 
  Activity, Lock, Server, BarChart3, Terminal, 
  Radio, Share2, Hexagon, Fingerprint, Search, Command
} from 'lucide-react'

// --- 1. DỮ LIỆU CÔNG NGHỆ (DATA LAYER) ---
const techModules = [
  { 
    id: 'warp', 
    code: 'NET-01',
    name: 'GALAXY CORP', 
    icon: Globe, 
    color: '#00ff88', // Neon Green
    desc: 'Hạ tầng mạng liên thiên hà.',
    longDesc: 'Sử dụng công nghệ Warp-Gate để bẻ cong không gian, tạo ra các đường hầm dữ liệu tức thời giữa các thiên hà. Loại bỏ hoàn toàn độ trễ vật lý.',
    specs: [
      { label: 'LATENCY', val: '0.00ms', status: 'OPTIMAL' },
      { label: 'NODES', val: '5,240,000', status: 'ACTIVE' },
      { label: 'COVERAGE', val: 'UNIVERSAL', status: 'MAX' }
    ]
  },
  { 
    id: 'quantum', 
    code: 'FIN-02',
    name: 'QUANTUM VC', 
    icon: Zap, 
    color: '#00d4ff', // Cyan
    desc: 'Quỹ đầu tư mạo hiểm lượng tử.',
    longDesc: 'AI phân tích đa vũ trụ (Multiverse Analysis) để dự đoán xu hướng thị trường trước khi nó xảy ra. Tự động hóa giao dịch tần suất cao (HFT).',
    specs: [
      { label: 'APY', val: '18.5%', status: 'STABLE' },
      { label: 'PREDICTION', val: '99.9%', status: 'HIGH' },
      { label: 'LIQUIDITY', val: '500T', status: 'FLOW' }
    ]
  },
  { 
    id: 'void', 
    code: 'SEC-03',
    name: 'VOID BANK', 
    icon: Database, 
    color: '#a855f7', // Purple
    desc: 'Kho lưu trữ tài sản hố đen.',
    longDesc: 'Công nghệ nén vật chất vào không gian chiều thứ 4. Tài sản được bảo vệ bởi chân trời sự kiện nhân tạo, bất khả xâm phạm về mặt vật lý.',
    specs: [
      { label: 'ENCRYPTION', val: 'QUANTUM', status: 'LOCKED' },
      { label: 'INTEGRITY', val: '100%', status: 'VERIFIED' },
      { label: 'BACKUP', val: 'DISTRIBUTED', status: 'OK' }
    ]
  },
  { 
    id: 'star', 
    code: 'CON-04',
    name: 'STAR LINK', 
    icon: Wifi, 
    color: '#fbbf24', // Amber
    desc: 'Kết nối vệ tinh siêu tốc.',
    longDesc: 'Mạng lưới 42,000 vệ tinh tầm thấp bao phủ 100% các tuyến đường thương mại. Cung cấp internet lượng tử cho tàu vũ trụ đang di chuyển.',
    specs: [
      { label: 'BANDWIDTH', val: '100 PB/s', status: 'FAST' },
      { label: 'UPTIME', val: '99.999%', status: 'FULL' },
      { label: 'SATELLITES', val: '42,000', status: 'ONLINE' }
    ]
  },
  { 
    id: 'nebula', 
    code: 'PAY-05',
    name: 'NEBULA PAY', 
    icon: Shield, 
    color: '#f472b6', // Pink
    desc: 'Cổng thanh toán tinh vân.',
    longDesc: 'Giao thức chuyển đổi tiền tệ nguyên tử (Atomic Swap). Hỗ trợ thanh toán bất kỳ loại tiền nào, ở bất kỳ đâu, phí gas gần như bằng không.',
    specs: [
      { label: 'TPS', val: '1,000,000', status: 'PEAK' },
      { label: 'FEE', val: '0.0001%', status: 'LOW' },
      { label: 'SECURITY', val: 'AUDITED', status: 'SAFE' }
    ]
  },
  { 
    id: 'orbit', 
    code: 'CPU-06',
    name: 'ORBIT TEC', 
    icon: Cpu, 
    color: '#34d399', // Emerald
    desc: 'Vi xử lý quỹ đạo.',
    longDesc: 'Chip sinh học tích hợp AI thế hệ 5. Được cấy ghép trực tiếp vào hệ thống thần kinh của phi thuyền để xử lý giao dịch bằng suy nghĩ.',
    specs: [
      { label: 'CORES', val: '1024 Q-Bit', status: 'COOL' },
      { label: 'TEMP', val: '-270°C', status: 'NOMINAL' },
      { label: 'SYNC', val: 'NEURAL', status: 'LINKED' }
    ]
  },
]

// --- 2. SUB-COMPONENTS (Các module con) ---

// 2.1. Nền không gian & Bụi (Static Particles)
const SpaceBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0">
    {/* Lưới tọa độ */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
    
    {/* Các đốm sáng trang trí */}
    <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full animate-ping" />
    <div className="absolute bottom-20 right-20 w-1 h-1 bg-[#00ff88]/40 rounded-full animate-pulse" />
    <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-blue-500/40 rounded-full" />
  </div>
)

// 2.2. Terminal Logs (Màn hình code chạy)
const SystemTerminal = ({ activeColor }: { activeColor: string }) => {
  const [logs, setLogs] = useState<string[]>([])
  // Danh sách lệnh giả lập
  const messages = [
    "Establishing secure handshake...", 
    "Verifying biometric signature...", 
    "Decrypting data stream...", 
    "Loading interface modules...", 
    "System check: PASSED.",
    "Rendering holographic projection..."
  ]

  useEffect(() => {
    setLogs([])
    let i = 0
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLogs(prev => [...prev.slice(-4), `> ${messages[i]}`]) // Chỉ giữ 5 dòng cuối
        i++
      } else {
        // Reset ngẫu nhiên để terminal chạy mãi
        if (Math.random() > 0.8) i = 0 
      }
    }, 400)
    return () => clearInterval(interval)
  }, [activeColor])

  return (
    <div className="h-32 bg-black/60 rounded border border-white/10 p-3 font-mono text-[10px] text-gray-400 overflow-hidden flex flex-col justify-end relative shadow-inner">
      <div className="absolute top-0 left-0 right-0 h-4 bg-white/5 border-b border-white/5 flex items-center px-2">
         <span className="text-[8px] text-gray-600">TERMINAL.EXE</span>
      </div>
      <div className="pt-4 space-y-1">
        {logs.map((log, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>
            <span style={{ color: activeColor }}>root@sys:~</span> {log}
          </motion.div>
        ))}
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-1.5 h-3 bg-[#00ff88] align-middle ml-1"/>
      </div>
    </div>
  )
}

// 2.3. Audio Visualizer (Sóng âm nhạc)
const AudioVisualizer = ({ color }: { color: string }) => (
  <div className="flex items-end gap-[3px] h-12 w-full opacity-80">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="w-1.5 bg-current rounded-t-sm"
        style={{ backgroundColor: color }}
        animate={{ height: ["10%", "90%", "30%", "60%", "20%"] }}
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

// 2.4. Radar Scan (Quét radar)
const RadarScan = ({ color }: { color: string }) => (
   <div className="relative w-24 h-24 rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.8)_100%)]"></div>
      <div className="absolute w-full h-[1px] bg-white/20 top-1/2"></div>
      <div className="absolute h-full w-[1px] bg-white/20 left-1/2"></div>
      {/* Kim quét */}
      <motion.div 
         animate={{ rotate: 360 }}
         transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
         className="absolute w-1/2 h-1/2 top-0 left-0 origin-bottom-right bg-gradient-to-t from-transparent to-current opacity-30"
         style={{ color: color }}
      />
      {/* Điểm mục tiêu */}
      <motion.div 
         animate={{ opacity: [0, 1, 0] }}
         transition={{ duration: 2, repeat: Infinity }}
         className="absolute top-6 left-6 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]"
      />
   </div>
)

// --- 3. COMPONENT CHÍNH ---

export function TechUniverse() {
  const [activeId, setActiveId] = useState<string>(techModules[0].id)
  const activeTech = techModules.find(t => t.id === activeId) || techModules[0]

  return (
    <div className="relative w-full h-[800px] bg-[#050505] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row text-white font-sans selection:bg-[#00ff88] selection:text-black">
      
      <SpaceBackground />

      {/* --- CỘT TRÁI: DANH SÁCH MODULE (SIDEBAR) --- */}
      <div className="w-full lg:w-1/3 border-r border-white/10 bg-white/[0.02] backdrop-blur-sm relative z-10 flex flex-col">
        
        {/* Header Sidebar */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
             <div className="flex items-center gap-2 mb-1">
               <Activity size={14} className="text-[#00ff88] animate-pulse" />
               <span className="text-xs font-bold tracking-[0.2em] text-white">SYSTEM DIAGNOSTICS</span>
             </div>
             <div className="text-[10px] text-gray-600 font-mono">V.2.3.45 // SECURE CONNECTION ESTABLISHED</div>
          </div>
        </div>

        {/* Danh sách nút bấm */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {techModules.map((tech) => {
            const isActive = activeId === tech.id
            return (
              <button
                key={tech.id}
                onClick={() => setActiveId(tech.id)}
                className={`w-full group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left overflow-hidden outline-none
                  ${isActive ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'}
                `}
              >
                {/* Thanh sáng bên trái khi active */}
                {isActive && (
                  <motion.div 
                    layoutId="activeBar"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-current shadow-[0_0_10px_currentColor]"
                    style={{ color: tech.color }} 
                  />
                )}

                {/* Icon Box */}
                <div 
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-black text-white' : 'bg-white/5 text-gray-500 group-hover:text-white'}`}
                >
                  <tech.icon size={18} />
                </div>

                {/* Text Info */}
                <div className="flex-1">
                  <div className={`font-bold text-sm tracking-wider transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                    {tech.name}
                  </div>
                  <div className="text-[9px] text-gray-600 font-mono group-hover:text-[#00ff88] transition-colors">
                    STATUS: ONLINE
                  </div>
                </div>

                {/* Đèn trạng thái nhỏ */}
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#00ff88] animate-pulse shadow-[0_0_5px_#00ff88]' : 'bg-gray-800'}`} />
              </button>
            )
          })}
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-white/10 bg-black/30">
          <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono mb-2">
            <span>CPU LOAD: 12%</span>
            <span>MEM: 4.2TB</span>
          </div>
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
               animate={{ width: ["10%", "30%", "15%", "40%"] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="h-full bg-[#00ff88]" 
            />
          </div>
        </div>
      </div>

      {/* --- CỘT PHẢI: MÀN HÌNH CHI TIẾT (MAIN HUD) --- */}
      <div className="flex-1 relative z-10 flex flex-col p-8 lg:p-12 overflow-hidden">
        
        {/* Nền lưới quét (Scanline) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-10 pointer-events-none" />
        
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTech.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="flex-1 flex flex-col h-full"
          >
            {/* 1. Header Lớn */}
            <div className="flex justify-between items-start mb-10">
               <div>
                  <motion.h2 
                     className="text-5xl lg:text-7xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500"
                     initial={{ x: -20, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ delay: 0.1 }}
                  >
                     {activeTech.name}
                  </motion.h2>
                  <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "100px" }}
                     className="h-1 mb-6"
                     style={{ backgroundColor: activeTech.color }}
                  />
                  <p className="text-gray-400 text-lg max-w-xl leading-relaxed font-light border-l-2 border-white/10 pl-4">
                     {activeTech.longDesc}
                  </p>
               </div>

               {/* Radar trang trí góc phải */}
               <div className="hidden lg:block opacity-50">
                  <RadarScan color={activeTech.color} />
               </div>
            </div>

            {/* 2. Grid Thông số (Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
               {activeTech.specs.map((spec, i) => (
                  <motion.div 
                     key={i}
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: 0.3 + i * 0.1 }}
                     className="bg-white/5 border border-white/10 p-4 rounded-2xl relative overflow-hidden group"
                  >
                     <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-50 transition-opacity">
                        <Hexagon size={40} strokeWidth={1} />
                     </div>
                     <div className="text-[10px] text-gray-500 font-bold mb-1 tracking-wider">{spec.label}</div>
                     <div className="text-2xl font-mono font-bold text-white">{spec.val}</div>
                     <div className="text-[9px] text-[#00ff88] mt-2 font-mono flex items-center gap-1">
                        <CheckCircle size={10} /> {spec.status}
                     </div>
                  </motion.div>
               ))}
            </div>

            {/* 3. Footer HUD (Terminal & Visualizer) */}
            <div className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
               
               {/* Terminal bên trái */}
               <div className="relative">
                  <div className="absolute -top-3 left-0 bg-[#050505] px-2 text-[9px] text-gray-500 uppercase tracking-widest">
                     System Logs
                  </div>
                  <SystemTerminal activeColor={activeTech.color} />
               </div>

               {/* Visualizer bên phải */}
               <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col justify-end h-32 relative">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">SIGNAL STRENGTH</span>
                     <Wifi size={12} className="text-gray-500" />
                  </div>
                  <AudioVisualizer color={activeTech.color} />
                  
                  {/* Nút hành động giả */}
                  <div className="absolute top-4 right-4 flex gap-2">
                     <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                     <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                     <div className="w-2 h-2 rounded-full bg-green-500" style={{ backgroundColor: activeTech.color }}></div>
                  </div>
               </div>

            </div>

            {/* Nút Live Data Feed */}
            <div className="absolute bottom-6 right-6 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
                <span className="text-[10px] font-bold text-[#00ff88] tracking-widest">LIVE DATA FEED</span>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  )
}