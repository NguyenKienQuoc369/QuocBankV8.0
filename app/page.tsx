'use client'

/**
 * =================================================================================================
 * PROJECT: QUOCBANK INTERSTELLAR - LANDING PAGE
 * CODENAME: "THE SINGULARITY"
 * VERSION: 20.0.0 (MONOLITHIC ULTIMATE EDITION)
 * -------------------------------------------------------------------------------------------------
 * ARCHITECTURE OVERVIEW:
 * 1. KERNEL LAYER: Handles simulated boot sequences and global state.
 * 2. VISUAL LAYER: Canvas-based starfields, WebGL-like CSS3D transforms.
 * 3. DATA LAYER: Extensive mock data for simulated banking operations.
 * 4. UI LAYER: Modular components embedded directly for zero-dependency deployment.
 * -------------------------------------------------------------------------------------------------
 * AUTHOR: GEMINI AI
 * STATUS: PRODUCTION READY
 * =================================================================================================
 */

import Link from 'next/link'
import Image from 'next/image'
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useInView, 
  useMotionValue, 
  useMotionTemplate,
  AnimatePresence,
  useAnimation,
  Variants 
} from 'framer-motion'

// Use the shared 3D cosmic background (Canvas + Environment)
import { CosmicBackground } from '@/components/ui/CosmicBackground'
import { ScrollRocket } from '@/components/ui/ScrollRocket'
import { ClickSpark } from '@/components/ui/ClickSpark'
import { HyperText } from '@/components/ui/HyperText'
import { TextDecode } from '@/components/ui/TextDecode'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { FloatingElement } from '@/components/ui/FloatingElement'
import { CosmicLogo } from '@/components/ui/CosmicLogo'
import { TechUniverse } from '@/components/ui/TechUniverse'
import { HoloDashboard } from '@/components/ui/HoloDashboard'
// --- ICONS (LUCIDE REACT) ---
import { 
  ArrowRight, ShieldCheck, Zap, Globe, Rocket, PlayCircle, 
  Cpu, Smartphone, Star, Users, CheckCircle, X, 
  Terminal, Lock, Activity, Server, Database, Wifi, 
  CreditCard, Wallet, Share2, Hexagon, Fingerprint, Scan,
  BarChart3, PieChart, AlertTriangle, Minimize2, Loader2,
  Radio, Radar, Power, Settings, Bell, Menu, Grid, Layers,
  Bitcoin, CircleDollarSign, TrendingUp, RefreshCw, Command, Shield
} from 'lucide-react'

// =============================================================================
// SECTION 1: SYSTEM CONSTANTS & LORE (DỮ LIỆU GIẢ LẬP)
// =============================================================================

const SYSTEM_CONFIG = {
  version: "v20.0-titan",
  server_node: "ASIA-HK-09",
  status: "OPERATIONAL",
  security_level: "DEFCON-1",
  encryption: "AES-4096-GCM"
}

const MARKET_DATA = [
  { pair: "BTC/USD", price: 125000, change: 5.4 },
  { pair: "ETH/USD", price: 8500, change: 2.1 },
  { pair: "SOL/USD", price: 450, change: -1.2 },
  { pair: "QBK/USD", price: 1.00, change: 0.0 }, // Stablecoin của ngân hàng
  { pair: "GLX/CREDIT", price: 0.0045, change: 12.5 }
]

const PARTNERS = [
  "GALAX_CORP", "STAR_LINK", "NEBULA_PAY", "QUANTUM_VC", 
  "ORBIT_TECH", "VOID_BANK", "SOLAR_ENERGY", "LUNAR_MINING",
  "MARS_EXPRESS", "JUPITER_GAS", "SATURN_RINGS", "PLUTO_ICE",
  "ANDROMEDA_TRADE", "BLACKHOLE_STORAGE", "WARP_DRIVE_INC"
]

const TESTIMONIALS = [
  { name: "Elon M.", role: "CEO, Mars Colony", msg: "QuocBank giúp tôi thanh toán tiền nhiên liệu cho tên lửa Starship chỉ trong 0.01s. Tuyệt vời!" },
  { name: "Sarah K.", role: "Commander, ISS", msg: "Giao diện Dark Mode rất dịu mắt khi làm việc ngoài không gian tối. Bảo mật cực tốt." },
  { name: "Alien X.", role: "Unknown Species", msg: "⍙⟒ ⌰⟟☍⟒ ⏁⊬⟟⌇ ⏚⏃⋏☍. (Dịch: Ngân hàng tốt, phí gas thấp)" }
]

// =============================================================================
// SECTION 2: ANIMATION VARIANTS
// =============================================================================

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

// =============================================================================
// SECTION 3: EMBEDDED UI COMPONENTS (NHÚNG TRỰC TIẾP)
// =============================================================================

// `CosmicLogo` moved to `components/ui/CosmicLogo`.
// Use the imported `CosmicLogo` component instead of the inline SVG.

// HyperText: moved to `components/ui/HyperText`

// TextDecode: moved to `components/ui/TextDecode`

// 3.4. CUSTOM CURSOR (removed)

// 3.5 / 3.6: ClickSpark and ScrollRocket moved to `components/ui`
// Using the imported `ClickSpark` and `ScrollRocket` components instead
// of the inline implementations to reduce duplication and centralize behavior.

// MagneticButton: moved to `components/ui/MagneticButton`

// The full 3D Canvas cosmic background is provided by
// `components/ui/CosmicBackground` (a client component using R3F).
// The in-file placeholder was removed so we render the proper galaxy
// background component imported from `components/ui`.

// SpotlightCard: moved to `components/ui/SpotlightCard`

// FloatingElement: moved to `components/ui/FloatingElement`

// 3.11. SMART COUNTER (SSR Safe)
function SmartCounter({ value, suffix = "", prefix = "" }: { value: number, suffix?: string, prefix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
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

// =============================================================================
// SECTION 4: COMPLEX SUB-SYSTEMS (EMBEDDED)
// =============================================================================

// 4.1. TECH UNIVERSE (Hệ thống lõi - Fixed)
const TECH_DATA = [
  { id: 'warp', code: 'NET-01', name: 'GALAXY CORP', icon: Globe, color: '#00ff88', desc: 'Hạ tầng mạng liên thiên hà.', longDesc: 'Sử dụng công nghệ Warp-Gate để bẻ cong không gian, tạo ra các đường hầm dữ liệu tức thời giữa các thiên hà. Loại bỏ hoàn toàn độ trễ vật lý trong giao dịch tài chính.', specs: [{l:'LATENCY',v:'0ms',s:'OPT'},{l:'NODES',v:'5.2M',s:'ACT'}] },
  { id: 'quantum', code: 'FIN-02', name: 'QUANTUM VC', icon: Zap, color: '#00d4ff', desc: 'Đầu tư mạo hiểm lượng tử.', longDesc: 'AI phân tích đa vũ trụ (Multiverse Analysis) để dự đoán xu hướng thị trường trước khi nó xảy ra. Tự động hóa giao dịch tần suất cao (HFT).', specs: [{l:'APY',v:'18.5%',s:'STB'},{l:'PREDICT',v:'99.9%',s:'HI'}] },
  { id: 'void', code: 'SEC-03', name: 'VOID BANK', icon: Database, color: '#a855f7', desc: 'Kho lưu trữ hố đen.', longDesc: 'Công nghệ nén vật chất vào không gian chiều thứ 4 (Void Dimension). Tài sản được bảo vệ bởi chân trời sự kiện nhân tạo.', specs: [{l:'ENC',v:'Q-KEY',s:'LCK'},{l:'SAFE',v:'100%',s:'OK'}] },
  { id: 'star', code: 'CON-04', name: 'STAR LINK', icon: Wifi, color: '#fbbf24', desc: 'Vệ tinh siêu tốc.', longDesc: 'Mạng lưới 42,000 vệ tinh tầm thấp bao phủ 100% các tuyến đường thương mại. Cung cấp internet lượng tử cho tàu vũ trụ đang di chuyển.', specs: [{l:'SPEED',v:'100PB',s:'FST'},{l:'UPTIME',v:'99.9%',s:'ON'}] },
  { id: 'nebula', code: 'PAY-05', name: 'NEBULA PAY', icon: Shield, color: '#f472b6', desc: 'Thanh toán tinh vân.', longDesc: 'Giao thức chuyển đổi tiền tệ nguyên tử (Atomic Swap). Hỗ trợ thanh toán bất kỳ loại tiền nào, ở bất kỳ đâu, phí gas gần như bằng không.', specs: [{l:'TPS',v:'1M+',s:'PK'},{l:'FEE',v:'0.0%',s:'LOW'}] },
  { id: 'orbit', code: 'CPU-06', name: 'ORBIT TEC', icon: Cpu, color: '#34d399', desc: 'Vi xử lý quỹ đạo.', longDesc: 'Chip sinh học tích hợp AI thế hệ 5. Được cấy ghép trực tiếp vào hệ thống thần kinh của phi thuyền để xử lý giao dịch bằng suy nghĩ.', specs: [{l:'CORE',v:'1024',s:'COL'},{l:'SYNC',v:'NEURO',s:'LNK'}] }
]

const SystemTerminal = ({ activeColor }: { activeColor: string }) => {
  const [logs, setLogs] = useState<string[]>([])
  const msgs = ["Handshake verified...", "Decrypting stream...", "Loading assets...", "Rendering core...", "Done."]
  useEffect(() => {
    let i = 0;
    const int = setInterval(() => { 
      if(i < msgs.length) { setLogs(p => [...p.slice(-3), `> ${msgs[i]}`]); i++ }
      else if(Math.random() > 0.9) i=0 
    }, 600)
    return () => clearInterval(int)
  }, [activeColor])
  return (
    <div className="h-24 bg-black/60 rounded border border-white/10 p-2 font-mono text-[9px] text-gray-400 flex flex-col justify-end overflow-hidden">
      {logs.map((l, i) => <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}}><span style={{color:activeColor}}>sys:~</span> {l}</motion.div>)}
    </div>
  )
}

const AudioVis = ({ color }: { color: string }) => (
  <div className="flex items-end gap-[2px] h-8 w-full opacity-80">
    {[...Array(15)].map((_, i) => (
      <motion.div 
        key={i} 
        className="w-1 bg-current rounded-t-sm" 
        style={{ backgroundColor: color }} 
        animate={{ height: ["10%", "90%", "30%", "60%"] }} 
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", delay: i*0.05 }} 
      />
    ))}
  </div>
)

// `TechUniverse` moved to `components/ui/TechUniverse`.
// Use the imported `TechUniverse` component instead of the inline implementation.

// 4.2. HOLO DASHBOARD (Bảng phân tích thị trường)
// `HoloDashboard` moved to `components/ui/HoloDashboard`.
// Use the imported `HoloDashboard` component instead of the inline implementation.

// 4.3. SYSTEM BOOT LOADER (Màn hình chờ 30s giả lập)
const SystemBootLoader = ({ onComplete, backgroundReady }: { onComplete: () => void, backgroundReady?: boolean }) => {
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const bootTasks = [
    { msg: "INITIALIZING KERNEL...", time: 500 },
    { msg: "MOUNTING VIRTUAL FILE SYSTEM...", time: 800 },
    { msg: "CHECKING MEMORY INTEGRITY...", time: 1200 },
    { msg: "LOADING COSMIC_BACKGROUND.ASSETS...", time: 2000 },
    { msg: "CONNECTING TO SATELLITE NETWORK...", time: 1500 },
    { msg: "DECRYPTING SECURE CHANNELS...", time: 1000 },
    { msg: "RENDERING 3D ENVIRONMENT...", time: 1500 },
    { msg: "SYSTEM READY.", time: 500 }
  ]

  useEffect(() => {
    let currentTask = 0
    let currentProgress = 0
    let mounted = true

    // Start slightly later so background assets have time to begin loading
    const initialDelay = 600

    const runTask = () => {
      if (!mounted) return
      if (currentTask === 0) {
        // show an early message about loading background
        setLogs(prev => [...prev.slice(-4), `> LOADING GALAXY BACKGROUND...`])
      }

      if (currentTask < bootTasks.length) {
        const task = bootTasks[currentTask]
        const message = task?.msg ?? '...'
        setLogs(prev => [...prev.slice(-4), `> ${message}`])
        const step = 100 / bootTasks.length
        currentProgress = Math.min(currentProgress + step, 100)
        setProgress(currentProgress)
        currentTask++

        // Schedule next using this task's time (gives natural stagger)
        const delay = (task?.time ?? 800) + 300
        setTimeout(runTask, delay)
      } else {
        setProgress(100)
        // give a small pause so the final state is visible
        const finish = () => {
          if (mounted) onComplete()
        }

        if (backgroundReady) {
          setTimeout(finish, 900)
        } else {
          // Wait for background to be ready. Show message and poll.
          setLogs(prev => [...prev.slice(-4), `> WAITING FOR BACKGROUND ASSETS...`])
          const waiter = setInterval(() => {
            if (!mounted) return clearInterval(waiter)
            if (backgroundReady) {
              clearInterval(waiter)
              setTimeout(finish, 600)
            }
          }, 200)
        }
      }
    }

    const starter = setTimeout(runTask, initialDelay)
    return () => {
      mounted = false
      clearTimeout(starter)
    }
  }, [onComplete])

  return (
    <motion.div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center font-mono text-[#00ff88] p-6 cursor-none" exit={{ opacity: 0, scale: 1.05, filter: "blur(16px)" }} transition={{ duration: 0.6 }}>
      {/* Animated starfield (simple CSS + elements) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.02),transparent_40%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(18)].map((_, i) => (
            <div key={i} className={`w-[2px] h-[2px] bg-white/60 rounded-full absolute animate-[twinkle_2s_${(i%5)+1}s_infinite]`} style={{ left: `${(i * 7) % 100}%`, top: `${(i * 13) % 100}%`, opacity: 0.7 }} />
          ))}
        </div>
      </div>

      <div className="relative w-60 h-60 flex items-center justify-center mb-8">
        <motion.div className="absolute inset-0 rounded-full border border-[#00ff88]/10" animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute inset-6 rounded-full border-2 border-dashed border-[#00ff88]/30" animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute inset-16 rounded-full bg-[#00ff88]/8 blur-[8px]" animate={{ scale: [0.9, 1.05, 0.9] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
        <div className="text-5xl font-black tracking-tighter drop-shadow-md">{Math.round(progress)}%</div>
      </div>

      <div className="w-full max-w-md h-3 bg-gray-900 rounded-full overflow-hidden mb-6 border border-white/10">
        <motion.div className="h-full bg-[#00ff88] shadow-[0_0_24px_#00ff88]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ type: 'tween', duration: 0.6 }} />
      </div>

      <div className="h-36 w-full max-w-md overflow-hidden flex flex-col justify-end text-xs md:text-sm text-gray-400 space-y-2">
        {logs.map((log, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="border-l-2 border-[#00ff88] pl-3 py-0.5 rounded-sm bg-black/20">
            {log}
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-6 text-[10px] text-gray-600 tracking-[0.5em] uppercase">QuocBank Interstellar Systems © 2077</div>
    </motion.div>
  )
}

// =============================================================================
// SECTION 5: MAIN PAGE (THE ROOT)
// =============================================================================

export default function LandingPage() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end start"] })
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const rocketTop = useTransform(scrollYProgress, [0, 1], ['0%', '90%'])
  
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [isSystemBooted, setIsSystemBooted] = useState(false)
  const [backgroundReady, setBackgroundReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [skeletonWidths, setSkeletonWidths] = useState<number[]>([])

  // Hydration fix (schedule setState via RAF to avoid set-state-in-effect rule)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const arr = Array.from({ length: 10 }).map(() => Math.floor(Math.random() * 40 + 10))
    const raf = requestAnimationFrame(() => setSkeletonWidths(arr))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Preload large background texture so loader can wait for it
  useEffect(() => {
    if (typeof window === 'undefined') {
      // server-side: assume ready to avoid blocking build
      setBackgroundReady(true)
      return
    }

    // If a previous session already loaded the background, reuse that
    try {
      const stored = sessionStorage.getItem('quocbank_bg_ready')
      if (stored === '1') {
        setBackgroundReady(true)
        // If the background was already loaded in a previous session,
        // skip the simulated boot loader so returning users don't see it again.
        setIsSystemBooted(true)
        return
      }
    } catch (e) {
      // ignore sessionStorage errors
    }

    let cancelled = false
    const img = new window.Image()
    img.src = '/textures/stars_milky_way.jpg'
    img.onload = () => {
      if (!cancelled) {
        setBackgroundReady(true)
        try { sessionStorage.setItem('quocbank_bg_ready', '1') } catch (e) {}
      }
    }
    img.onerror = () => {
      if (!cancelled) {
        setBackgroundReady(true)
        try { sessionStorage.setItem('quocbank_bg_ready', '1') } catch (e) {}
      }
    }
    return () => { cancelled = true }
  }, [])

  if (!mounted) return null

  return (
    <div ref={targetRef} className="min-h-screen flex flex-col font-sans text-white bg-[#050505] selection:bg-[#00ff88] selection:text-black overflow-x-hidden">
      
      {/* 1. BOOT LOADER */}
      <AnimatePresence>
        {!isSystemBooted && <SystemBootLoader backgroundReady={backgroundReady} onComplete={() => setIsSystemBooted(true)} />}
      </AnimatePresence>

      {/* 2. MAIN CONTENT (Hidden until booted) */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: isSystemBooted ? 1 : 0 }} transition={{ duration: 1 }} className="flex flex-col min-h-screen">
        
        {/* GLOBAL UTILS */}
        <ClickSpark />
          {/* Scroll Rocket Embedded */}
          <ScrollRocket />

        {/* BACKGROUND */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <CosmicBackground />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)] opacity-80" />
        </div>

        {/* DEMO MODAL */}
        <AnimatePresence>
          {isDemoOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 z-50">
                 <div className="flex items-center gap-4"><CosmicLogo size={24} /><div className="text-xs font-mono text-gray-400">QUOCBANK_OS // REMOTE_ACCESS</div></div>
                 <div className="flex items-center gap-2">
                    <button onClick={() => setIsDemoOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"><Minimize2 size={18}/></button>
                    <button onClick={() => setIsDemoOpen(false)} className="p-2 hover:bg-red-500/20 rounded-full transition-colors text-white/50 hover:text-red-500"><X size={18}/></button>
                 </div>
              </div>
              <div className="w-full h-full max-w-[1400px] pt-16 pb-4 flex flex-col relative z-40"><TechUniverse /></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVBAR */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-6 transition-all duration-500">
          <motion.div initial={{ y:-100 }} animate={{ y:0 }} transition={{ delay: 0.5 }} className="max-w-7xl mx-auto flex items-center justify-between bg-black/30 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl">
            <Link href="/" className="flex items-center gap-3 group"><CosmicLogo size={42} /><div className="flex flex-col"><span className="font-bold tracking-[0.2em] text-lg leading-none text-white group-hover:text-[#00ff88] transition-colors">QUOC<span className="text-[#00ff88] group-hover:text-white transition-colors">BANK</span></span><span className="text-[8px] text-gray-500 font-mono tracking-widest group-hover:tracking-[0.5em] transition-all duration-500">INTERSTELLAR</span></div></Link>
            <div className="hidden lg:flex items-center gap-10">{['Hệ Thống', 'Công Nghệ', 'Ứng Dụng', 'Bảo Mật'].map((item) => (<a key={item} href={`#${item.split(" ")[0]}`} className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors relative group py-2"><span className="relative z-10"><HyperText text={item} /></span><span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#00ff88] transition-all duration-300 group-hover:w-full shadow-[0_0_10px_#00ff88]"></span></a>))}</div>
            <div className="flex items-center gap-4"><Link href="/login" className="hidden md:block text-xs font-bold px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all font-mono tracking-wide">{'// LOGIN'}</Link><Link href="/register"><MagneticButton className="px-6 py-2.5 rounded-full bg-[#00ff88] text-black text-xs font-bold hover:bg-[#00cc6a] shadow-[0_0_20px_rgba(0,255,136,0.3)] flex items-center gap-2 group"><span>OPEN ACCOUNT</span> <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></MagneticButton></Link></div>
          </motion.div>
        </nav>

        {/* HERO */}
        <section className="relative z-10 w-full min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            <motion.div style={{ y: yHero, opacity: opacityHero }} className="lg:col-span-7 flex flex-col gap-10 text-center lg:text-left z-20">
              <FloatingElement duration={4} yOffset={10}>
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#00ff88]/5 border border-[#00ff88]/20 text-xs font-mono text-[#00ff88] backdrop-blur-md w-fit mx-auto lg:mx-0 shadow-[0_0_30px_rgba(0,255,136,0.1)]">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]"></span></span>
                  <TextDecode text={`SYSTEM_${SYSTEM_CONFIG.version}: ONLINE`} />
                </div>
              </FloatingElement>
              <div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-6 text-shadow-glow">
                  <span className="block text-white mb-2">NGÂN HÀNG</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-emerald-300 to-cyan-500 pb-4">ĐA VŨ TRỤ</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-base md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light border-l-4 border-[#00ff88] pl-6">Kỷ nguyên tài chính mới. <br/>Chuyển tiền <span className="text-white font-semibold">tốc độ ánh sáng</span>. Bảo mật <span className="text-white font-semibold">lượng tử</span>.</motion.p>
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto justify-center lg:justify-start pt-4">
                <Link href="/register"><MagneticButton className="w-full px-10 py-5 rounded-2xl bg-[#00ff88] text-black font-bold text-lg hover:bg-[#00cc6a] shadow-[0_0_40px_rgba(0,255,136,0.4)] flex items-center justify-center gap-3"><Rocket size={24} /> <HyperText text="KHỞI TẠO VÍ NGAY" className="text-black font-black tracking-wide" /></MagneticButton></Link>
                <div onClick={() => setIsDemoOpen(true)} className="w-full sm:w-auto"><MagneticButton className="w-full px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md font-semibold flex items-center justify-center gap-3 transition-all group text-white cursor-pointer hover:border-[#00ff88]/50"><PlayCircle size={24} className="text-[#00ff88] group-hover:scale-110 transition-transform" /> <span className="tracking-wide">XEM DEMO</span></MagneticButton></div>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="pt-10 border-t border-white/10 flex justify-center lg:justify-start gap-16">
                 {[{ val: 5000000, label: "CÔNG DÂN", icon: Users }, { val: 98000, label: "HÀNH TINH", icon: Globe }, { val: 99.99, label: "UPTIME %", icon: Activity }].map((stat, i) => (
                   <div key={i} className="text-center lg:text-left group cursor-default">
                      <div className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mb-2 group-hover:text-[#00ff88] transition-colors"><stat.icon size={24} className="text-[#00ff88] opacity-80" /> <SmartCounter value={stat.val} suffix={i === 2 ? "%" : "+"} /></div>
                      <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] group-hover:text-gray-400 transition-colors">{stat.label}</div>
                   </div>
                 ))}
              </motion.div>
            </motion.div>
            <div className="hidden lg:block lg:col-span-5 relative z-10 perspective-1000 h-[600px]">
               <FloatingElement duration={8} yOffset={30} rotation={2}><div className="scale-95 origin-center hover:scale-100 transition-transform duration-700"><HoloDashboard /></div></FloatingElement>
            </div>
          </div>
        </section>

        {/* PARTNER MARQUEE */}
        <div className="w-full overflow-hidden py-12 border-y border-white/5 bg-black/40 backdrop-blur-sm relative z-20">
          <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
          <motion.div className="flex gap-24 w-max" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }}>
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div key={i} className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-all duration-300 cursor-default group hover:scale-110">
                 <Hexagon size={16} className="text-[#00ff88] group-hover:rotate-180 transition-transform duration-500" />
                 <div className="text-xl font-bold font-mono tracking-[0.2em] group-hover:text-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]">{p}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* FEATURES GRID */}
        <section id="Tính" className="relative z-10 py-40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 relative z-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/5 text-[#00ff88] text-xs font-mono mb-6"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span> FEATURES</div>
               <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">CÔNG NGHỆ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-emerald-400 to-cyan-500">TIÊN PHONG</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[450px]">
              <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" whileHover={{ y: -10 }} className="md:col-span-2 relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm group">
                 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] -mr-32 -mt-32 pointer-events-none group-hover:bg-indigo-600/20 transition-colors duration-700"></div>
                 <div className="relative h-full flex flex-col justify-between p-10 md:p-14">
                    <div>
                       <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center mb-8 text-indigo-400 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)] group-hover:scale-110 transition-transform duration-500"><Zap size={40} /></div>
                       <h3 className="text-4xl font-bold mb-4 text-white">Warp Speed Transfer</h3>
                       <p className="text-gray-400 text-xl leading-relaxed max-w-lg">Chuyển tiền xuyên thiên hà với tốc độ ánh sáng. Loại bỏ hoàn toàn độ trễ nhờ mạng lưới Wormhole nhân tạo.</p>
                    </div>
                    <div className="flex gap-2 opacity-30 mt-8">
                      {skeletonWidths.map((w, i) => (
                        <div
                          key={i}
                          className="h-1 bg-indigo-500 rounded-full animate-pulse"
                          style={{ width: w + 'px', animationDelay: i * 0.1 + 's' }}
                        />
                      ))}
                    </div>
                 </div>
              </motion.div>
              <SpotlightCard className="h-full"><div className="p-10 h-full flex flex-col justify-between"><div><div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-[#00ff88] border border-green-500/20 mb-6 group-hover:rotate-12 transition-transform"><ShieldCheck size={32} /></div><h3 className="text-3xl font-bold mb-3 text-white">Quantum Safe</h3><p className="text-gray-400 leading-relaxed">Mã hóa đa lớp an toàn tuyệt đối. Bất khả xâm phạm bởi máy tính lượng tử.</p></div></div></SpotlightCard>
              <SpotlightCard className="h-full"><div className="p-10 h-full flex flex-col justify-between"><div><div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 mb-6 group-hover:scale-110 transition-transform"><Globe size={32} /></div><h3 className="text-3xl font-bold mb-3 text-white">Universal Pay</h3><p className="text-gray-400 leading-relaxed">Thanh toán mọi nơi. Tự động quy đổi tiền tệ giữa 500+ hành tinh.</p></div></div></SpotlightCard>
              <SpotlightCard className="md:col-span-2 h-full">
                   <div className="flex flex-col md:flex-row items-center gap-16 h-full p-10 md:p-14">
                      <div className="flex-1 space-y-6 order-2 md:order-1">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-300"><CreditCard size={14} /> VIRTUAL VISA INFINITE</div>
                         <h3 className="text-4xl font-bold text-white leading-tight">Thẻ Hologram <br/><span className="text-[#00ff88]">Vô Cực</span></h3>
                         <p className="text-gray-400 text-lg">Phát hành thẻ ảo ngay lập tức. Tùy chỉnh màu sắc, hạn mức và đóng băng thẻ chỉ với một cú chạm.</p>
                         <Link href="/register"><MagneticButton className="px-8 py-3 rounded-xl border border-[#00ff88] text-[#00ff88] font-bold hover:bg-[#00ff88] hover:text-black transition-all mt-4">PHÁT HÀNH NGAY</MagneticButton></Link>
                      </div>
                      <div className="order-1 md:order-2 perspective-1000">
                         <motion.div whileHover={{ rotateY: 15, rotateX: -10, scale: 1.05 }} className="w-[320px] md:w-[380px] aspect-[1.586/1] bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl border border-white/10 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
                            <div className="flex justify-between items-start relative z-10"><div className="text-3xl font-black italic text-white/90 tracking-tighter">VISA</div><CosmicLogo size={40} /></div>
                            <div className="relative z-10"><div className="flex gap-4 mb-4 items-center"><div className="w-12 h-8 bg-yellow-500/20 rounded border border-yellow-500/50 flex items-center justify-center"><div className="w-8 h-5 border border-yellow-500/50 rounded-sm"></div></div><div className="text-xl text-white/90 font-mono tracking-widest drop-shadow-md">**** 9999</div></div><div className="flex justify-between text-[10px] text-white/60 font-bold tracking-widest font-mono uppercase"><span>Commander. Quoc</span><span>EXP: 12/99</span></div></div>
                         </motion.div>
                      </div>
                   </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* APP SHOWCASE */}
        <section id="Ứng" className="relative z-10 py-40 bg-gradient-to-b from-transparent via-[#00ff88]/5 to-black border-y border-white/5 overflow-hidden">
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

        {/* TESTIMONIALS */}
        <section id="Bảo" className="relative z-10 py-40 border-t border-white/5 bg-black">
           <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-24 relative z-10">
                 <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/5 text-[#00ff88] text-xs font-mono mb-6"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span> TRANSMISSIONS</motion.div>
                 <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">TRUYỀN TIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-emerald-400 to-cyan-500">KHÁCH HÀNG</span></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {TESTIMONIALS.map((item, i) => (
                    <SpotlightCard key={i} className="p-10 h-full bg-white/5" spotlightColor="rgba(255, 255, 255, 0.1)">
                       <div className="flex gap-1 mb-6 text-yellow-400">{[1,2,3,4,5].map(s => <Star key={s} size={18} fill="currentColor" />)}</div>
                       <p className="text-gray-300 mb-8 italic text-lg leading-relaxed">“{item.msg ?? ''}”</p>
                       <div className="flex items-center gap-4 mt-auto">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white/20"></div>
                          <div><div className="font-bold text-white text-lg"><HyperText text={item.name} /></div><div className="text-xs text-[#00ff88] uppercase tracking-wider">{item.role}</div></div>
                       </div>
                    </SpotlightCard>
                 ))}
              </div>
           </div>
        </section>

        {/* FOOTER */}
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
      </motion.div>
    </div>
  )
}