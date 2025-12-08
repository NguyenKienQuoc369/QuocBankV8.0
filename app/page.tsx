'use client'

/**
 * -----------------------------------------------------------------------------
 * PROJECT: QUOCBANK INTERSTELLAR
 * FILE: app/page.tsx
 * VERSION: 10.0.0 (MONOLITHIC ULTIMATE EDITION)
 * AUTHOR: GEMINI AI
 * -----------------------------------------------------------------------------
 * * SYSTEM ARCHITECTURE:
 * This is a monolithic component structure designed to ensure maximum stability
 * and zero dependency errors. All specialized sub-components (TechUniverse, 
 * SecurityGrid, DataStreams) are defined locally within this file.
 * * SECTIONS:
 * 1. Imports & Configuration
 * 2. Data Layer (Lore & Mock Data)
 * 3. Animation Vectors (Framer Motion Variants)
 * 4. Local Sub-Components (The Building Blocks)
 * 5. Main Page Layout (The Core)
 */

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect, useState, useMemo } from 'react'
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useInView, 
  useMotionValue, 
  useMotionTemplate,
  AnimatePresence,
  useAnimation
} from 'framer-motion'

// --- 1. EXTERNAL UI LIBRARIES (Các file anh đã có) ---
// Nếu file nào báo đỏ, anh hãy kiểm tra lại folder components/ui
import { CosmicBackground } from '@/components/ui/CosmicBackground'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { TextDecode } from '@/components/ui/TextDecode'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { FloatingElement } from '@/components/ui/FloatingElement'
import { ScrollRocket } from '@/components/ui/ScrollRocket'
import { HoloDashboard } from '@/components/ui/HoloDashboard'
import { HyperText } from '@/components/ui/HyperText'
import { CosmicLogo } from '@/components/ui/CosmicLogo'
import { ClickSpark } from '@/components/ui/ClickSpark'
import { CosmicCursor } from '@/components/ui/CosmicCursor'

// --- 2. ICON SYSTEMS ---
import { 
  ArrowRight, ShieldCheck, Zap, Globe, Rocket, PlayCircle, 
  Cpu, Smartphone, Star, Users, CheckCircle, X, 
  ChevronDown, Terminal, Lock, Activity, Server, 
  Database, Wifi, MousePointer2, CreditCard, Wallet, Coins,
  Radio, Share2, Hexagon, Fingerprint, Command, Scan,
  BarChart3, PieChart, TrendingUp, AlertTriangle, Search
} from 'lucide-react'

// =============================================================================
// SECTION 2: DATA LAYER (DỮ LIỆU GIẢ LẬP CHI TIẾT)
// =============================================================================

const SYSTEM_CONFIG = {
  version: "v8.4.2-alpha",
  server: "ASIA-HK-09",
  status: "OPERATIONAL",
  encryption: "AES-4096-GCM",
  protocol: "ZERO-TRUST"
}

// Dữ liệu công nghệ chi tiết (Cho Tech Universe)
const TECH_MODULES = [
  { 
    id: 'warp', 
    code: 'NET-01',
    name: 'GALAXY CORP', 
    icon: Globe, 
    color: '#00ff88', 
    desc: 'Hạ tầng mạng liên thiên hà.',
    longDesc: 'Sử dụng công nghệ Warp-Gate để bẻ cong không gian, tạo ra các đường hầm dữ liệu tức thời giữa các thiên hà. Loại bỏ hoàn toàn độ trễ vật lý trong giao dịch tài chính.',
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
    color: '#00d4ff', 
    desc: 'Quỹ đầu tư mạo hiểm lượng tử.',
    longDesc: 'AI phân tích đa vũ trụ (Multiverse Analysis) để dự đoán xu hướng thị trường trước khi nó xảy ra. Tự động hóa giao dịch tần suất cao (HFT) với độ chính xác tuyệt đối.',
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
    color: '#a855f7', 
    desc: 'Kho lưu trữ tài sản hố đen.',
    longDesc: 'Công nghệ nén vật chất vào không gian chiều thứ 4 (Void Dimension). Tài sản được bảo vệ bởi chân trời sự kiện nhân tạo, bất khả xâm phạm về mặt vật lý.',
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
    color: '#fbbf24', 
    desc: 'Kết nối vệ tinh siêu tốc.',
    longDesc: 'Mạng lưới 42,000 vệ tinh tầm thấp bao phủ 100% các tuyến đường thương mại. Cung cấp internet lượng tử cho tàu vũ trụ đang di chuyển với tốc độ Warp.',
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
    color: '#f472b6', 
    desc: 'Cổng thanh toán tinh vân.',
    longDesc: 'Giao thức chuyển đổi tiền tệ nguyên tử (Atomic Swap). Hỗ trợ thanh toán bất kỳ loại tiền nào, ở bất kỳ đâu, phí gas gần như bằng không nhờ công nghệ Layer-0.',
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
    color: '#34d399', 
    desc: 'Vi xử lý quỹ đạo.',
    longDesc: 'Chip sinh học tích hợp AI thế hệ 5. Được cấy ghép trực tiếp vào hệ thống thần kinh của phi thuyền để xử lý giao dịch bằng suy nghĩ (Neural Link).',
    specs: [
      { label: 'CORES', val: '1024 Q-Bit', status: 'COOL' },
      { label: 'TEMP', val: '-270°C', status: 'NOMINAL' },
      { label: 'SYNC', val: 'NEURAL', status: 'LINKED' }
    ]
  },
]

const PARTNERS = [
  "GALAX_CORP", "STAR_LINK", "NEBULA_PAY", "QUANTUM_VC", 
  "ORBIT_TECH", "VOID_BANK", "SOLAR_ENERGY", "LUNAR_MINING",
  "MARS_EXPRESS", "JUPITER_GAS", "SATURN_RINGS", "PLUTO_ICE"
]

const TESTIMONIALS = [
  { name: "Elon M.", role: "CEO, Mars Colony", msg: "QuocBank giúp tôi thanh toán tiền nhiên liệu cho tên lửa Starship chỉ trong 0.01s. Tuyệt vời!" },
  { name: "Sarah K.", role: "Commander, ISS", msg: "Giao diện Dark Mode rất dịu mắt khi làm việc ngoài không gian tối. Bảo mật cực tốt." },
  { name: "Alien X.", role: "Unknown Species", msg: "⍙⟒ ⌰⟟☍⟒ ⏁⊬⟟⌇ ⏚⏃⋏☍. ⎎⏃⌇⏁ ⏃⋏⎅ ⌇⟒☊⎍⍀⟒." }
]

// =============================================================================
// SECTION 3: ANIMATION VARIANTS (FRAMER MOTION)
// =============================================================================

const VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  },
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, scale: 1, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    }
  },
  glitch: {
    initial: { x: 0 },
    hover: { 
      x: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.4 } 
    }
  }
}

// =============================================================================
// SECTION 4: LOCAL SUB-COMPONENTS (Thành phần con - Tránh lỗi import)
// =============================================================================

// 4.1. Smart Counter (Số nhảy)
function SmartCounter({ value, suffix = "", prefix = "" }: { value: number, suffix?: string, prefix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const springValue = useSpring(0, { bounce: 0, duration: 3000 })
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    if (isInView) springValue.set(value)
  }, [isInView, value, springValue])

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (latest % 1 === 0) setDisplay(Math.floor(latest).toLocaleString('en-US'))
      else setDisplay(latest.toFixed(1))
    })
  }, [springValue])

  return <span ref={ref} className="font-mono tabular-nums tracking-tight">{prefix}{display}{suffix}</span>
}

// 4.2. Partner Marquee (Dải Logo chạy)
function PartnerMarquee() {
  return (
    <div className="w-full overflow-hidden py-12 border-y border-white/5 bg-black/40 backdrop-blur-sm relative z-20">
      <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
      <motion.div 
        className="flex gap-24 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
      >
        {[...PARTNERS, ...PARTNERS].map((p, i) => (
          <div key={i} className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-all duration-300 cursor-default group hover:scale-110">
             <Hexagon size={16} className="text-[#00ff88] group-hover:rotate-180 transition-transform duration-500" />
             <div className="text-xl font-bold font-mono tracking-[0.2em] group-hover:text-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                {p}
             </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// 4.3. System Terminal (Nhật ký hệ thống giả lập - Dùng cho TechUniverse)
const SystemTerminal = ({ activeColor }: { activeColor: string }) => {
  const [logs, setLogs] = useState<string[]>([])
  const messages = ["Connecting secure node...", "Handshake verified...", "Decrypting stream...", "Render complete."]

  useEffect(() => {
    setLogs([])
    let i = 0
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLogs(prev => [...prev.slice(-3), `> ${messages[i]}`])
        i++
      } else if (Math.random() > 0.8) i = 0 
    }, 500)
    return () => clearInterval(interval)
  }, [activeColor])

  return (
    <div className="h-28 bg-black/60 rounded border border-white/10 p-3 font-mono text-[9px] text-gray-400 overflow-hidden flex flex-col justify-end shadow-inner relative">
      <div className="absolute top-0 left-0 w-full h-4 bg-white/5 border-b border-white/5 flex items-center px-2">
         <Terminal size={10} className="mr-2" /> SYS_LOG.LOG
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

// 4.4. Audio Visualizer (Sóng âm)
const AudioVisualizer = ({ color }: { color: string }) => (
  <div className="flex items-end gap-[3px] h-12 w-full opacity-80">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="w-1.5 bg-current rounded-t-sm"
        style={{ backgroundColor: color }}
        animate={{ height: ["10%", "90%", "30%", "60%", "20%"] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", delay: i * 0.05, ease: "easeInOut" }}
      />
    ))}
  </div>
)

// 4.5. Radar Scan Component
const RadarScan = ({ color }: { color: string }) => (
   <div className="relative w-20 h-20 rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.8)_100%)]"></div>
      <div className="absolute w-full h-[1px] bg-white/20 top-1/2"></div>
      <div className="absolute h-full w-[1px] bg-white/20 left-1/2"></div>
      <motion.div 
         animate={{ rotate: 360 }}
         transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
         className="absolute w-1/2 h-1/2 top-0 left-0 origin-bottom-right bg-gradient-to-t from-transparent to-current opacity-30"
         style={{ color: color }}
      />
      <motion.div 
         animate={{ opacity: [0, 1, 0] }}
         transition={{ duration: 2, repeat: Infinity }}
         className="absolute top-6 left-6 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]"
      />
   </div>
)

// 4.6. TECH UNIVERSE COMPONENT (Phiên bản Internal để tránh lỗi import)
// Đây là trái tim của hệ thống Demo
function InternalTechUniverse() {
  const [activeId, setActiveId] = useState<string>(TECH_MODULES[0].id)
  const activeTech = TECH_MODULES.find(t => t.id === activeId) || TECH_MODULES[0]

  return (
    <div className="relative w-full h-[750px] bg-[#050505] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row text-white font-sans">
      
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      </div>

      {/* SIDEBAR (Danh sách) */}
      <div className="w-full lg:w-1/3 border-r border-white/10 bg-white/[0.02] backdrop-blur-sm relative z-10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-[#00ff88] animate-pulse" />
            <span className="text-xs font-bold tracking-[0.2em] text-white">SYSTEM DIAGNOSTICS</span>
          </div>
          <div className="text-[10px] text-gray-600 font-mono">STATUS: CONNECTED // {SYSTEM_CONFIG.server}</div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {TECH_MODULES.map((tech) => {
            const isActive = activeId === tech.id
            return (
              <button
                key={tech.id}
                onClick={() => setActiveId(tech.id)}
                className={`w-full group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left outline-none
                  ${isActive ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'}
                `}
              >
                {isActive && (
                  <motion.div layoutId="activeBar" className="absolute left-0 top-0 bottom-0 w-1 bg-current shadow-[0_0_10px_currentColor]" style={{ color: tech.color }} />
                )}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-black text-white' : 'bg-white/5 text-gray-500 group-hover:text-white'}`}>
                  <tech.icon size={18} />
                </div>
                <div className="flex-1">
                  <div className={`font-bold text-sm tracking-wider transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{tech.name}</div>
                  <div className="text-[9px] text-gray-600 font-mono group-hover:text-[#00ff88] transition-colors">STATUS: ONLINE</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* MAIN SCREEN (Hiển thị chi tiết) */}
      <div className="flex-1 relative z-10 flex flex-col p-8 lg:p-12 overflow-hidden bg-black/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-10 pointer-events-none" />
        
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTech.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="flex-1 flex flex-col h-full"
          >
            {/* Header Tech */}
            <div className="flex justify-between items-start mb-8">
               <div>
                  <motion.h2 
                     className="text-5xl lg:text-7xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500"
                     initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                  >
                     {activeTech.name}
                  </motion.h2>
                  <motion.div initial={{ width: 0 }} animate={{ width: "100px" }} className="h-1 mb-6" style={{ backgroundColor: activeTech.color }} />
                  <p className="text-gray-400 text-lg max-w-xl leading-relaxed font-light border-l-2 border-white/10 pl-4">
                     {activeTech.longDesc}
                  </p>
               </div>
               <div className="hidden lg:block opacity-50"><RadarScan color={activeTech.color} /></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               {activeTech.specs.map((spec, i) => (
                  <motion.div 
                     key={i}
                     initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: 0.3 + i * 0.1 }}
                     className="bg-white/5 border border-white/10 p-4 rounded-2xl relative overflow-hidden group"
                  >
                     <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-50"><Hexagon size={30} strokeWidth={1} /></div>
                     <div className="text-[10px] text-gray-500 font-bold mb-1 tracking-wider">{spec.label}</div>
                     <div className="text-2xl font-mono font-bold text-white">{spec.val}</div>
                     <div className="text-[9px] text-[#00ff88] mt-2 font-mono flex items-center gap-1"><CheckCircle size={10} /> {spec.status}</div>
                  </motion.div>
               ))}
            </div>

            {/* Footer Tech */}
            <div className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
               <div className="relative">
                  <SystemTerminal activeColor={activeTech.color} />
               </div>
               <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col justify-end h-28 relative">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">SIGNAL STRENGTH</span>
                     <Wifi size={12} className="text-gray-500" />
                  </div>
                  <AudioVisualizer color={activeTech.color} />
               </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// 4.7. Feature Card Component (Bento Grid Item)
function FeatureCard({ title, desc, icon: Icon, color, className = "", delay = 0, size = "normal" }: any) {
  return (
    <motion.div 
      variants={FADE_UP_VARIANT}
      whileHover={{ y: -5 }}
      className={`relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
         <Icon size={size === "large" ? 200 : 100} color={color} strokeWidth={0.5} />
      </div>
      
      <div className="relative h-full flex flex-col justify-between p-8 md:p-10">
         <div>
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ color: color }}>
               <Icon size={28} />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-white leading-tight"><HyperText text={title} /></h3>
            <p className="text-gray-400 text-lg leading-relaxed">{desc}</p>
         </div>
         
         <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
            <span className="text-xs font-mono text-gray-500 group-hover:text-white transition-colors">EXPLORE_MODULE</span>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-all">
               <ArrowRight size={14} />
            </div>
         </div>
      </div>
    </motion.div>
  )
}

// =============================================================================
// SECTION 5: MAIN LANDING PAGE COMPONENT (THE CORE)
// =============================================================================

export default function LandingPage() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end start"] })
  
  // Parallax Logic
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  
  // Modal State
  const [isDemoOpen, setIsDemoOpen] = useState(false)

  // Loading Fake Effect
  const [loading, setLoading] = useState(true)
  useEffect(() => { setTimeout(() => setLoading(false), 800) }, [])

  return (
    <div 
      ref={targetRef} 
      className="min-h-screen flex flex-col font-sans text-white bg-[#050505] selection:bg-[#00ff88] selection:text-black cursor-none overflow-x-hidden"
    >
      
      {/* --- GLOBAL EFFECTS --- */}
      <CosmicCursor />
      <ClickSpark />
      <ScrollRocket />

      {/* --- LAYER 1: DEEP SPACE BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CosmicBackground />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)] opacity-80" />
      </div>

      {/* --- LAYER 2: TECH DEMO MODAL (PORTAL) --- */}
      <AnimatePresence>
        {isDemoOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>
            <button 
              onClick={() => setIsDemoOpen(false)} 
              className="absolute top-8 right-8 group z-50 flex items-center gap-3 px-5 py-3 rounded-full border border-white/10 bg-black hover:border-[#00ff88]/50 transition-all hover:bg-white/5"
            >
              <span className="text-xs font-mono text-gray-400 group-hover:text-[#00ff88] tracking-widest">CLOSE_TERMINAL</span>
              <X size={18} className="text-white" />
            </button>
            <div className="w-full h-full max-w-[1400px] flex flex-col items-center justify-center">
                {/* Embed Internal Tech Universe here */}
                <InternalTechUniverse />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LAYER 3: MAIN CONTENT --- */}
      
      {/* 3.1 NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-6 transition-all duration-500">
        <motion.div 
          initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto flex items-center justify-between bg-black/30 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl"
        >
          <Link href="/" className="flex items-center gap-3 group">
            <CosmicLogo size={42} />
            <div className="flex flex-col">
               <span className="font-bold tracking-[0.25em] text-lg leading-none text-white group-hover:text-[#00ff88] transition-colors">QUOC<span className="text-[#00ff88] group-hover:text-white transition-colors">BANK</span></span>
               <span className="text-[8px] text-gray-500 font-mono tracking-widest group-hover:tracking-[0.5em] transition-all duration-500">INTERSTELLAR</span>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-10">
            {['Hệ Thống', 'Tính năng', 'Ứng Dụng', 'Bảo Mật'].map((item) => (
              <a key={item} href={`#${item.split(" ")[0]}`} className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors relative group py-2">
                <span className="relative z-10"><HyperText text={item} /></span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#00ff88] transition-all duration-300 group-hover:w-full shadow-[0_0_10px_#00ff88]"></span>
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <Link href="/login" className="hidden md:block text-xs font-bold px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all font-mono tracking-wide">
               // LOGIN
             </Link>
             <Link href="/register">
                <MagneticButton className="px-6 py-2.5 rounded-full bg-[#00ff88] text-black text-xs font-bold hover:bg-[#00cc6a] shadow-[0_0_20px_rgba(0,255,136,0.3)] flex items-center gap-2 group">
                   <span>OPEN ACCOUNT</span> <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
             </Link>
          </div>
        </motion.div>
      </nav>

      {/* 3.2 HERO SECTION */}
      <section className="relative z-10 w-full min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          <motion.div style={{ y: yHero, opacity: opacityHero }} className="lg:col-span-7 flex flex-col gap-10 text-center lg:text-left z-20">
            <FloatingElement duration={4} yOffset={10}>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#00ff88]/5 border border-[#00ff88]/20 text-xs font-mono text-[#00ff88] backdrop-blur-md w-fit mx-auto lg:mx-0 shadow-[0_0_30px_rgba(0,255,136,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]"></span>
                </span>
                <TextDecode text={`SYSTEM_${SYSTEM_CONFIG.version}: ONLINE`} />
              </div>
            </FloatingElement>

            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-6 text-shadow-glow"
              >
                <span className="block text-white mb-2">NGÂN HÀNG</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-emerald-300 to-cyan-500 pb-4">ĐA VŨ TRỤ</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-lg md:text-2xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light border-l-4 border-[#00ff88] pl-6"
              >
                Kỷ nguyên tài chính mới. <br/>Chuyển tiền <span className="text-white font-semibold">tốc độ ánh sáng</span>. Bảo mật <span className="text-white font-semibold">lượng tử</span>.
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto justify-center lg:justify-start pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                 <MagneticButton className="w-full px-10 py-5 rounded-2xl bg-[#00ff88] text-black font-bold text-lg hover:bg-[#00cc6a] shadow-[0_0_40px_rgba(0,255,136,0.4)] flex items-center justify-center gap-3">
                    <Rocket size={24} /> <HyperText text="KHỞI TẠO VÍ NGAY" className="text-black font-black tracking-wide" />
                 </MagneticButton>
              </Link>
              <div onClick={() => setIsDemoOpen(true)} className="w-full sm:w-auto">
                <MagneticButton className="w-full px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md font-semibold flex items-center justify-center gap-3 transition-all group text-white cursor-pointer hover:border-[#00ff88]/50">
                  <PlayCircle size={24} className="text-[#00ff88] group-hover:scale-110 transition-transform" /> 
                  <span className="tracking-wide">XEM DEMO</span>
                </MagneticButton>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="pt-10 border-t border-white/10 flex justify-center lg:justify-start gap-16">
               {[{ val: 5000000, label: "CÔNG DÂN", icon: Users }, { val: 98000, label: "HÀNH TINH", icon: Globe }, { val: 99.99, label: "UPTIME %", icon: Activity }].map((stat, i) => (
                 <div key={i} className="text-center lg:text-left group cursor-default">
                    <div className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mb-2 group-hover:text-[#00ff88] transition-colors">
                       <stat.icon size={24} className="text-[#00ff88] opacity-80" /> <SmartCounter value={stat.val} suffix={i === 2 ? "%" : "+"} />
                    </div>
                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] group-hover:text-gray-400 transition-colors">{stat.label}</div>
                 </div>
               ))}
            </motion.div>
          </motion.div>

          <div className="hidden lg:block lg:col-span-5 relative z-10 perspective-1000 h-[600px]">
             <FloatingElement duration={8} yOffset={30} rotation={2}>
                <div className="scale-95 origin-center hover:scale-100 transition-transform duration-700">
                   <HoloDashboard />
                </div>
             </FloatingElement>
          </div>
        </div>
      </section>

      {/* 3.3 PARTNERS MARQUEE */}
      <PartnerMarquee />

      {/* 3.4 SYSTEM ACCESS (Mới) */}
      <section id="HệThống" className="relative z-10 py-40 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-black via-[#00ff88]/5 to-black pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
               <div className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 text-gray-400 text-xs font-mono mb-6">INFRASTRUCTURE LEVEL 5</div>
               <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white">HỆ THỐNG <span className="text-[#00ff88]">LÕI</span></h2>
               <p className="text-gray-400 max-w-2xl mx-auto text-lg">Khám phá kiến trúc công nghệ vận hành nền kinh tế liên sao. Bấm nút bên dưới để truy cập máy chủ.</p>
            </div>
            <div className="flex justify-center">
               <div onClick={() => setIsDemoOpen(true)} className="group relative cursor-pointer">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-60 h-20 bg-[#00ff88] blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative w-64 h-64 border border-white/10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center group-hover:border-[#00ff88]/50 transition-colors duration-500">
                     <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_10s_linear_infinite]"></div>
                     <div className="absolute inset-4 rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]"></div>
                     <div className="text-center">
                        <Cpu size={48} className="mx-auto mb-4 text-[#00ff88] group-hover:scale-125 transition-transform duration-300" />
                        <div className="text-xs font-bold tracking-widest text-white group-hover:text-[#00ff88]">ACCESS CORE</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3.5 FEATURES BENTO GRID */}
      <section id="Tính" className="relative z-10 py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 relative z-10">
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/5 text-[#00ff88] text-xs font-mono mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span> FEATURES
             </motion.div>
             <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">CÔNG NGHỆ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-emerald-400 to-cyan-500">TIÊN PHONG</span></h2>
          </div>
          
          <motion.div variants={STAGGER_CONTAINER} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[450px]">
            <FeatureCard title="Warp Speed" desc="Chuyển tiền xuyên thiên hà với tốc độ ánh sáng. Loại bỏ hoàn toàn độ trễ nhờ mạng lưới Wormhole nhân tạo." icon={Zap} color="#4f46e5" className="md:col-span-2" size="large" />
            <FeatureCard title="Quantum Safe" desc="Mã hóa đa lớp an toàn tuyệt đối. Bất khả xâm phạm bởi máy tính lượng tử." icon={ShieldCheck} color="#00ff88" />
            <FeatureCard title="Universal Pay" desc="Thanh toán mọi nơi. Tự động quy đổi tiền tệ giữa 500+ hành tinh." icon={Globe} color="#06b6d4" />
            
            {/* Virtual Card Feature */}
            <motion.div variants={FADE_UP_VARIANT} whileHover={{ y: -10 }} className="md:col-span-2">
               <SpotlightCard className="h-full bg-black/40" spotlightColor="rgba(255, 255, 255, 0.1)">
                 <div className="flex flex-col md:flex-row items-center gap-16 h-full p-10 md:p-14">
                    <div className="flex-1 space-y-6 order-2 md:order-1">
                       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-300"><CreditCard size={14} /> VIRTUAL VISA INFINITE</div>
                       <h3 className="text-4xl font-bold text-white leading-tight">Thẻ Hologram <br/><span className="text-[#00ff88]">Vô Cực</span></h3>
                       <p className="text-gray-400 text-lg">Phát hành thẻ ảo ngay lập tức. Tùy chỉnh màu sắc, hạn mức và đóng băng thẻ chỉ với một cú chạm.</p>
                       <Link href="/register">
                          <MagneticButton className="px-8 py-3 rounded-xl border border-[#00ff88] text-[#00ff88] font-bold hover:bg-[#00ff88] hover:text-black transition-all mt-4">PHÁT HÀNH NGAY</MagneticButton>
                       </Link>
                    </div>
                    <div className="order-1 md:order-2 perspective-1000">
                       <motion.div whileHover={{ rotateY: 15, rotateX: -10, scale: 1.05 }} className="w-[320px] md:w-[380px] aspect-[1.586/1] bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl border border-white/10 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
                          <div className="flex justify-between items-start relative z-10"><div className="text-3xl font-black italic text-white/90 tracking-tighter">VISA</div><CosmicLogo size={40} /></div>
                          <div className="relative z-10">
                             <div className="flex gap-4 mb-4 items-center"><div className="w-12 h-8 bg-yellow-500/20 rounded border border-yellow-500/50 flex items-center justify-center"><div className="w-8 h-5 border border-yellow-500/50 rounded-sm"></div></div><div className="text-xl text-white/90 font-mono tracking-widest drop-shadow-md">**** 9999</div></div>
                             <div className="flex justify-between text-[10px] text-white/60 font-bold tracking-widest font-mono uppercase"><span>Commander. Quoc</span><span>EXP: 12/99</span></div>
                          </div>
                       </motion.div>
                    </div>
                 </div>
               </SpotlightCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3.6 APP SHOWCASE */}
      <section id="Ứng" className="relative z-10 py-40 bg-gradient-to-b from-transparent via-[#00ff88]/5 to-black border-y border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#00ff88]/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
           <motion.div initial={{ opacity: 0, x: -50, rotateY: -20 }} whileInView={{ opacity: 1, x: 0, rotateY: 0 }} transition={{ duration: 1 }} viewport={{ once: true }} className="relative mx-auto perspective-1000 group">
              <div className="w-[340px] h-[680px] border-[10px] border-[#1a1a1a] rounded-[3.5rem] bg-black overflow-hidden relative shadow-[0_50px_100px_rgba(0,0,0,0.8)] z-10 ring-1 ring-white/10 group-hover:shadow-[0_50px_120px_rgba(0,255,136,0.15)] transition-shadow duration-500">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1a1a1a] rounded-b-xl z-50"></div>
                 <div className="w-full h-full bg-gray-900 p-6 flex flex-col relative">
                    <div className="absolute inset-0 bg-[url('/textures/stars_milky_way.jpg')] opacity-30 bg-cover"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                    <div className="flex justify-between items-center mt-10 mb-8 relative z-10">
                        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00ff88] to-blue-500 p-[2px]"><div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs">QN</div></div><div><div className="text-[10px] text-gray-400 uppercase tracking-wider">COMMANDER</div><div className="font-bold text-white text-sm">Quoc Nguyen</div></div></div>
                        <div className="p-2 bg-white/5 rounded-full border border-white/5"><Lock size={16} className="text-[#00ff88]"/></div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20"><CosmicLogo size={60} /></div>
                        <div className="text-gray-400 text-xs mb-2 uppercase tracking-widest">Total Liquidity</div>
                        <div className="text-[#00ff88] text-4xl font-mono font-bold mb-6 tracking-tighter shadow-green-500/50 drop-shadow-sm">9,850,000 ₫</div>
                        <div className="flex gap-3"><button className="flex-1 py-3 bg-[#00ff88] text-black rounded-xl font-bold text-xs uppercase tracking-wide hover:bg-[#00cc6a]">Transfer</button><button className="flex-1 py-3 bg-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-wide hover:bg-white/20">Deposit</button></div>
                    </div>
                    <div className="flex-1 space-y-3 relative z-10 overflow-hidden">
                       <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Logs</div>
                       {[{ name: "NETFLIX", price: "-250,000", icon: PlayCircle, color: "text-red-500" }, { name: "SALARY", price: "+50M", icon: Wallet, color: "text-[#00ff88]" }, { name: "SPACEX", price: "-1.2M", icon: Rocket, color: "text-blue-500" }].map((t, i) => (
                          <div key={i} className="h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center px-4 gap-4 hover:bg-white/10 transition-colors cursor-pointer"><div className={`w-10 h-10 rounded-full bg-black/50 flex items-center justify-center ${t.color}`}><t.icon size={18}/></div><div className="flex-1"><div className="text-sm font-bold text-white">{t.name}</div><div className="text-[10px] text-gray-500">10:23 AM</div></div><div className={`font-mono font-bold text-sm ${t.name === 'SALARY' ? 'text-[#00ff88]' : 'text-white'}`}>{t.price}</div></div>
                       ))}
                    </div>
                 </div>
              </div>
           </motion.div>
           <div className="space-y-10">
              <div>
                 <div className="text-[#00ff88] font-mono tracking-widest text-xs mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse"></span> MOBILE EXPERIENCE V2.0</div>
                 <h2 className="text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">Ngân hàng trong <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-blue-500">Túi Áo Phi Hành Gia</span></h2>
                 <p className="text-gray-400 text-lg leading-relaxed border-l-4 border-white/10 pl-6">Kiểm soát tài chính của bạn từ bất kỳ đâu trong vũ trụ. Giao diện được tối ưu hóa cho môi trường không trọng lực, độ trễ bằng không.</p>
              </div>
              <div className="grid grid-cols-1 gap-6">
                 {[{ title: "Mống mắt (Iris Scan)", desc: "Đăng nhập bảo mật chuẩn quân đội." }, { title: "Chế độ Deep Space", desc: "Giao diện tối bảo vệ mắt trong không gian." }, { title: "Ví lạnh tích hợp", desc: "Lưu trữ tài sản Crypto an toàn tuyệt đối." }].map((feat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                       <div className="p-3 rounded-lg bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20"><CheckCircle size={20}/></div>
                       <div><h4 className="text-white font-bold text-lg">{feat.title}</h4><p className="text-gray-500 text-sm mt-1">{feat.desc}</p></div>
                    </motion.div>
                 ))}
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                 <MagneticButton className="px-8 py-4 gap-3 flex items-center h-auto rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white"><Smartphone size={24}/> <div className="text-left"><div className="text-[10px] text-gray-400 uppercase">Download on the</div><div className="font-bold text-lg leading-none">App Store</div></div></MagneticButton>
                 <MagneticButton className="px-8 py-4 gap-3 flex items-center h-auto rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white"><PlayCircle size={24}/> <div className="text-left"><div className="text-[10px] text-gray-400 uppercase">Get it on</div><div className="font-bold text-lg leading-none">Google Play</div></div></MagneticButton>
              </div>
           </div>
        </div>
      </section>

      {/* 3.7 TESTIMONIALS */}
      <section id="Bảo" className="relative z-10 py-40 border-t border-white/5 bg-black">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 relative z-10">
               <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/5 text-[#00ff88] text-xs font-mono mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span> TRANSMISSIONS
               </motion.div>
               <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">TRUYỀN TIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-emerald-400 to-cyan-500">KHÁCH HÀNG</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {TESTIMONIALS.map((item, i) => (
                  <SpotlightCard key={i} className="p-10 h-full bg-white/5" spotlightColor="rgba(255, 255, 255, 0.1)">
                     <div className="flex gap-1 mb-6 text-yellow-400">{[1,2,3,4,5].map(s => <Star key={s} size={18} fill="currentColor" />)}</div>
                     <p className="text-gray-300 mb-8 italic text-lg leading-relaxed">"{item.msg}"</p>
                     <div className="flex items-center gap-4 mt-auto">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white/20"></div>
                        <div><div className="font-bold text-white text-lg"><HyperText text={item.name} /></div><div className="text-xs text-[#00ff88] uppercase tracking-wider">{item.role}</div></div>
                     </div>
                  </SpotlightCard>
               ))}
            </div>
         </div>
      </section>

      {/* 3.8 MEGA FOOTER */}
      <footer className="relative z-10 bg-black pt-32 pb-10 px-6 border-t border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,136,0.05),transparent_50%)] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                <div className="md:col-span-1">
                   <Link href="/" className="flex items-center gap-3 mb-6"><CosmicLogo size={40} /><span className="font-bold text-xl">QUOC<span className="text-[#00ff88]">BANK</span></span></Link>
                   <p className="text-gray-500 text-sm leading-relaxed mb-6">Hệ thống ngân hàng đầu tiên được cấp phép hoạt động liên hành tinh. Kết nối tài chính của bạn với tương lai.</p>
                   <div className="flex gap-4">{['Twitter', 'Facebook', 'Discord'].map(s => (<div key={s} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#00ff88] hover:text-black transition-all cursor-pointer"><Share2 size={18} /></div>))}</div>
                </div>
                <div><h4 className="text-white font-bold mb-6">Sản Phẩm</h4><ul className="space-y-4 text-sm text-gray-500"><li><a href="#" className="hover:text-[#00ff88] transition-colors">Tài khoản Standard</a></li><li><a href="#" className="hover:text-[#00ff88] transition-colors">Thẻ tín dụng Black</a></li><li><a href="#" className="hover:text-[#00ff88] transition-colors">Khoản vay không trọng lực</a></li><li><a href="#" className="hover:text-[#00ff88] transition-colors">Đầu tư Crypto</a></li></ul></div>
                <div><h4 className="text-white font-bold mb-6">Công Ty</h4><ul className="space-y-4 text-sm text-gray-500"><li><a href="#" className="hover:text-[#00ff88] transition-colors">Về chúng tôi</a></li><li><a href="#" className="hover:text-[#00ff88] transition-colors">Tuyển dụng phi hành đoàn</a></li><li><a href="#" className="hover:text-[#00ff88] transition-colors">Tin tức vũ trụ</a></li><li><a href="#" className="hover:text-[#00ff88] transition-colors">Liên hệ</a></li></ul></div>
                <div><h4 className="text-white font-bold mb-6">Newsletter</h4><p className="text-gray-500 text-sm mb-4">Nhận thông tin thị trường mới nhất.</p><div className="flex gap-2"><input type="email" placeholder="email@space.com" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#00ff88] outline-none flex-1" /><button className="bg-[#00ff88] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#00cc6a]"><ArrowRight size={18}/></button></div></div>
             </div>
             <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-600">
               <div className="flex items-center gap-2"><CosmicLogo size={24} /> © 2025 QuocBank. All rights reserved.</div>
               <div className="flex gap-8"><a href="#" className="hover:text-[#00ff88] transition-colors">Điều khoản</a><a href="#" className="hover:text-[#00ff88] transition-colors">Bảo mật</a><a href="#" className="hover:text-[#00ff88] transition-colors">Cookie</a></div>
             </div>
          </div>
      </footer>
    </div>
  )
}