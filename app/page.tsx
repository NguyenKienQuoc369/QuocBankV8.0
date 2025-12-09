'use client'

/**
 * =================================================================================================
 * PROJECT: QUOCBANK INTERSTELLAR - MAIN LANDING PAGE
 * VERSION: 15.0.0 (BOOT LOADER EDITION)
 * STATUS: HEAVY LOAD OPTIMIZED
 * -------------------------------------------------------------------------------------------------
 * NEW FEATURE: SYSTEM BOOT LOADER
 * Description: A cinematic loading screen that masks heavy asset rendering (CosmicBackground).
 * It simulates a complex system initialization sequence to keep users engaged during load time.
 * =================================================================================================
 */

import Link from 'next/link'
import Image from 'next/image'
import React, { useRef, useEffect, useState, useMemo } from 'react'
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

// --- EXTERNAL IMPORTS ---
import { HoloDashboard } from '@/components/ui/HoloDashboard'
import { CosmicLogo } from '@/components/ui/CosmicLogo'

// --- ICONS ---
import { 
  ArrowRight, ShieldCheck, Zap, Globe, Rocket, PlayCircle, 
  Cpu, Smartphone, Star, Users, CheckCircle, X, 
  Terminal, Lock, Activity, Server, Database, Wifi, 
  MousePointer2, CreditCard, Wallet, Coins, Radio, 
  Share2, Hexagon, Fingerprint, Command, Scan,
  BarChart3, PieChart, TrendingUp, AlertTriangle, Search,
  Maximize2, Minimize2, Grid, Layers, Box, Loader2, Power, Shield
} from 'lucide-react'

// =============================================================================
// SECTION 2: DATA & CONSTANTS
// =============================================================================

const SYSTEM_CONFIG = {
  version: "v15.0-titan",
  server: "ASIA-HK-09",
  status: "OPERATIONAL",
  encryption: "AES-4096-GCM"
}

const PARTNERS = [
  "GALAX_CORP", "STAR_LINK", "NEBULA_PAY", "QUANTUM_VC", 
  "ORBIT_TECH", "VOID_BANK", "SOLAR_ENERGY", "LUNAR_MINING",
  "MARS_EXPRESS", "JUPITER_GAS", "SATURN_RINGS", "PLUTO_ICE"
]

const TESTIMONIALS = [
  { name: "Elon M.", role: "CEO, Mars Colony", msg: "QuocBank giúp tôi thanh toán tiền nhiên liệu cho tên lửa Starship chỉ trong 0.01s. Tuyệt vời!" },
  { name: "Sarah K.", role: "Commander, ISS", msg: "Giao diện Dark Mode rất dịu mắt khi làm việc ngoài không gian tối. Bảo mật cực tốt." },
  { name: "Alien X.", role: "Unknown Species", msg: "⍙⟒ ⌰⟟☍⟒ ⏁⊬⟟⌇ ⏚⏃⋏☍. (Ngân hàng tốt)" }
]

// =============================================================================
// SECTION 3: ANIMATION VARIANTS
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
// SECTION 4: LOCAL UI COMPONENTS
// =============================================================================

// 4.1. SYSTEM BOOT LOADER (NEW FEATURE - CÂU GIỜ LOAD TRANG)
// Danh sách công việc giả lập để "câu giờ" - moved outside component to avoid dependency issues
const BOOT_TASKS = [
  { msg: "INITIALIZING KERNEL...", time: 500 },
  { msg: "MOUNTING VIRTUAL FILE SYSTEM...", time: 800 },
  { msg: "CHECKING MEMORY INTEGRITY...", time: 1200 },
  { msg: "LOADING COSMIC_BACKGROUND.ASSETS...", time: 2000 },
  { msg: "CONNECTING TO SATELLITE NETWORK...", time: 1500 },
  { msg: "DECRYPTING SECURE CHANNELS...", time: 1000 },
  { msg: "RENDERING 3D ENVIRONMENT...", time: 1500 },
  { msg: "SYSTEM READY.", time: 500 }
]

const SystemBootLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    let currentTask = 0
    let currentProgress = 0
    
    const interval = setInterval(() => {
      // Logic chạy tiến trình
      if (currentTask < BOOT_TASKS.length) {
        setLogs(prev => [...prev.slice(-4), `> ${BOOT_TASKS[currentTask].msg}`])
        
        // Tăng thanh progress bar giả lập
        const step = 100 / BOOT_TASKS.length
        currentProgress = Math.min(currentProgress + step, 100)
        setProgress(currentProgress)
        
        currentTask++
      } else {
        // Hoàn tất
        clearInterval(interval)
        setProgress(100)
        setTimeout(onComplete, 800)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <motion.div 
      className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center font-mono text-[#00ff88] p-10 cursor-none"
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.8 }}
    >
      {/* Central Loader Graphic */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-12">
         <motion.div 
            className="absolute inset-0 border-4 border-[#00ff88]/20 rounded-full border-t-[#00ff88]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
         />
         <motion.div 
            className="absolute inset-4 border-2 border-dashed border-[#00ff88]/40 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
         />
         <div className="text-4xl font-black tracking-tighter animate-pulse">
            {Math.round(progress)}%
         </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md h-2 bg-gray-900 rounded-full overflow-hidden mb-6 border border-white/10">
         <motion.div 
            className="h-full bg-[#00ff88] shadow-[0_0_20px_#00ff88]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
         />
      </div>

      {/* Terminal Logs */}
      <div className="h-32 w-full max-w-md overflow-hidden flex flex-col justify-end text-xs md:text-sm text-gray-400 space-y-1">
         {logs.map((log, i) => (
            <motion.div 
               key={i} 
               initial={{ opacity: 0, x: -10 }} 
               animate={{ opacity: 1, x: 0 }}
               className="border-l-2 border-[#00ff88] pl-2"
            >
               {log}
            </motion.div>
         ))}
      </div>

      <div className="absolute bottom-10 text-[10px] text-gray-600 tracking-[0.5em] uppercase">
         QuocBank Interstellar Systems © 2077
      </div>
    </motion.div>
  )
}

// 4.2. HYPER TEXT
const HyperText = ({ text, className = "" }: { text: string, className?: string }) => {
  const [displayText, setDisplayText] = useState(text)
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const animate = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split("").map((letter, index) => {
        if(index < iteration) return text[index];
        return letters[Math.floor(Math.random() * 26)]
      }).join(""))
      if(iteration >= text.length) clearInterval(interval);
      iteration += 1/3;
    }, 30);
  }
  return <span className={`cursor-default ${className}`} onMouseEnter={animate}>{displayText}</span>
}

// 4.3. TEXT DECODE
const TextDecode = ({ text, className="" }: { text: string, className?: string }) => {
  const [display, setDisplay] = useState("")
  useEffect(() => {
    let i = 0; const timer = setInterval(() => { if (i < text.length) { setDisplay(prev => prev + text.charAt(i)); i++ } else clearInterval(timer) }, 50)
    return () => clearInterval(timer)
  }, [text])
  return <span className={`font-mono ${className}`}>{display}</span>
}

// 4.5. CLICK SPARK
const ClickSpark = () => {
  const [sparks, setSparks] = useState<{id: number, x: number, y: number}[]>([])
  useEffect(() => {
    const click = (e: MouseEvent) => { const s = { id: Date.now(), x: e.clientX, y: e.clientY }; setSparks(p => [...p, s]); setTimeout(() => setSparks(p => p.filter(x => x.id !== s.id)), 800) }
    window.addEventListener('mousedown', click); return () => window.removeEventListener('mousedown', click)
  }, [])
  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      <AnimatePresence>
        {sparks.map(s => (
          <motion.div key={s.id} initial={{ scale:0, opacity:1 }} animate={{ scale:2, opacity:0 }} exit={{ opacity:0 }} transition={{ duration: 0.5 }} className="absolute w-20 h-20 border-2 border-[#00ff88] rounded-full" style={{ left: s.x, top: s.y, x: '-50%', y: '-50%' }} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// 4.6. SCROLL ROCKET
const ScrollRocket = () => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '90%'])
  return (
    <div className="fixed right-2 top-0 bottom-0 w-1 bg-white/5 z-[90]">
      <motion.div style={{ top: y }} className="absolute -left-[5px] text-[#00ff88]">
        <Rocket size={14} className="rotate-[-45deg]" />
        <div className="w-[1px] h-20 bg-gradient-to-t from-[#00ff88] to-transparent mx-auto mt-[-5px]" />
      </motion.div>
    </div>
  )
}

// 4.7. MAGNETIC BUTTON
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const MagneticButton = ({ children, className = "", onClick }: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const move = (e: React.MouseEvent) => { 
    if (!ref.current) return;
    const { clientX, clientY } = e; 
    const { left, top, width, height } = ref.current.getBoundingClientRect(); 
    setPos({ x: (clientX - (left + width/2)) * 0.3, y: (clientY - (top + height/2)) * 0.3 }) 
  }
  return (
    <motion.button ref={ref} onMouseMove={move} onMouseLeave={() => setPos({x:0, y:0})} onClick={onClick} animate={{ x: pos.x, y: pos.y }} transition={{ type: "spring", stiffness: 150, damping: 15 }} className={className}>
      {children}
    </motion.button>
  )
}

// 4.8. COSMIC BACKGROUND
const CosmicBackground = () => (
  <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
    <div className="absolute w-96 h-96 bg-orange-500 rounded-full blur-[100px] opacity-20" />
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute w-[600px] h-[600px] border border-white/5 rounded-full"><div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_blue]" /></motion.div>
    <motion.div animate={{ rotate: -360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }} className="absolute w-[900px] h-[900px] border border-white/5 rounded-full border-dashed"><div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 bg-red-500 rounded-full shadow-[0_0_20px_red]" /></motion.div>
  </div>
)

// 4.9. SPOTLIGHT CARD
interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

const SpotlightCard = ({ children, className="", spotlightColor="rgba(255,255,255,0.1)" }: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement>(null); 
  const [pos, setPos] = useState({ x: 0, y: 0 }); 
  const [op, setOp] = useState(0)
  const move = (e: React.MouseEvent<HTMLDivElement>) => { 
    if(!divRef.current) return; 
    const r = divRef.current.getBoundingClientRect(); 
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top }) 
  }
  return (
    <div ref={divRef} onMouseMove={move} onMouseEnter={() => setOp(1)} onMouseLeave={() => setOp(0)} className={`relative rounded-3xl border border-white/10 bg-black/50 overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300" style={{ opacity: op, background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 40%)` }} />
      <div className="relative h-full">{children}</div>
    </div>
  )
}

// 4.10. FLOATING ELEMENT
interface FloatingElementProps {
  children: React.ReactNode;
  duration?: number;
  yOffset?: number;
  rotation?: number;
}

const FloatingElement = ({ children, duration = 3, yOffset = 10, rotation = 0 }: FloatingElementProps) => (
  <motion.div 
    animate={{ 
      y: [0, -yOffset, 0],
      rotate: rotation ? [0, rotation, 0] : 0
    }} 
    transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
)

// 4.11. SMART COUNTER
function SmartCounter({ value, suffix = "", prefix = "" }: { value: number, suffix?: string, prefix?: string }) {
  const ref = useRef(null); const isInView = useInView(ref, { once: true, margin: "-100px" }); const spring = useSpring(0, { bounce: 0, duration: 3000 }); const [disp, setDisp] = useState("0")
  useEffect(() => { if (isInView) spring.set(value) }, [isInView, value, spring])
  useEffect(() => { spring.on("change", (l) => { setDisp(l % 1 === 0 ? Math.floor(l).toLocaleString('en-US') : l.toFixed(1)) }) }, [spring])
  return <span ref={ref} className="font-mono tabular-nums tracking-tight">{prefix}{disp}{suffix}</span>
}

// 4.12. PARTNER MARQUEE
function PartnerMarquee() {
  return (
    <div className="w-full overflow-hidden py-12 border-y border-white/5 bg-black/40 backdrop-blur-sm relative z-20">
      <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
      <motion.div className="flex gap-24 w-max" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }}>
        {[...PARTNERS, ...PARTNERS].map((p, i) => (
          <div key={i} className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-all duration-300 cursor-default group hover:scale-110">
             <Hexagon size={16} className="text-[#00ff88] group-hover:rotate-180 transition-transform duration-500" />
             <div className="text-xl font-bold font-mono tracking-[0.2em] group-hover:text-white">{p}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// =============================================================================
// SECTION 5: TECH UNIVERSE SYSTEM (MODULE NO. 5)
// =============================================================================

const TECH_DATA = [
  { id: 'warp', code: 'NET-01', name: 'GALAXY CORP', icon: Globe, color: '#00ff88', desc: 'Hạ tầng mạng liên thiên hà.', longDesc: 'Sử dụng công nghệ Warp-Gate để bẻ cong không gian, tạo ra các đường hầm dữ liệu tức thời.', specs: [{l:'LATENCY',v:'0ms',s:'OPT'},{l:'NODES',v:'5.2M',s:'ACT'}] },
  { id: 'quantum', code: 'FIN-02', name: 'QUANTUM VC', icon: Zap, color: '#00d4ff', desc: 'Đầu tư mạo hiểm lượng tử.', longDesc: 'AI phân tích đa vũ trụ dự đoán xu hướng thị trường trước khi nó xảy ra.', specs: [{l:'APY',v:'18.5%',s:'STB'},{l:'PREDICT',v:'99.9%',s:'HI'}] },
  { id: 'void', code: 'SEC-03', name: 'VOID BANK', icon: Database, color: '#a855f7', desc: 'Kho lưu trữ hố đen.', longDesc: 'Nén vật chất vào không gian chiều thứ 4. Bất khả xâm phạm.', specs: [{l:'ENC',v:'Q-KEY',s:'LCK'},{l:'SAFE',v:'100%',s:'OK'}] },
  { id: 'star', code: 'CON-04', name: 'STAR LINK', icon: Wifi, color: '#fbbf24', desc: 'Vệ tinh siêu tốc.', longDesc: 'Mạng lưới 42,000 vệ tinh tầm thấp bao phủ toàn bộ tuyến đường thương mại.', specs: [{l:'SPEED',v:'100PB',s:'FST'},{l:'UPTIME',v:'99.9%',s:'ON'}] },
  { id: 'nebula', code: 'PAY-05', name: 'NEBULA PAY', icon: Shield, color: '#f472b6', desc: 'Thanh toán tinh vân.', longDesc: 'Chuyển đổi tiền tệ nguyên tử. Phí giao dịch bằng không.', specs: [{l:'TPS',v:'1M+',s:'PK'},{l:'FEE',v:'0.0%',s:'LOW'}] },
  { id: 'orbit', code: 'CPU-06', name: 'ORBIT TEC', icon: Cpu, color: '#34d399', desc: 'Vi xử lý quỹ đạo.', longDesc: 'Chip sinh học cấy ghép thần kinh. Giao dịch bằng suy nghĩ.', specs: [{l:'CORE',v:'1024',s:'COL'},{l:'SYNC',v:'NEURO',s:'LNK'}] }
]

const SystemTerminal = ({ activeColor }: { activeColor: string }) => {
  const [logs, setLogs] = useState<string[]>([]); const msgs = ["Handshake...", "Verifying...", "Decrypting...", "Loading...", "Done."]
  useEffect(() => { let i = 0; const int = setInterval(() => { if(i < msgs.length) { setLogs(p => [...p.slice(-3), `> ${msgs[i]}`]); i++ } else if(Math.random()>0.9) i=0 }, 400); return () => clearInterval(int) }, [activeColor])
  return (
    <div className="h-24 bg-black/60 rounded border border-white/10 p-2 font-mono text-[9px] text-gray-400 flex flex-col justify-end">
      {logs.map((l, i) => <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}}><span style={{color:activeColor}}>sys:~</span> {l}</motion.div>)}
    </div>
  )
}

const AudioVis = ({ color }: { color: string }) => (
  <div className="flex items-end gap-[2px] h-8 w-full opacity-80">
    {[...Array(15)].map((_, i) => <motion.div key={i} className="w-1 bg-current rounded-t-sm" style={{ backgroundColor: color }} animate={{ height: ["10%", "90%", "30%", "60%"] }} transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", delay: i*0.05 }} />)}
  </div>
)

const TechUniverse = () => {
  const [activeId, setActiveId] = useState(TECH_DATA[0].id)
  const activeTech = TECH_DATA.find(t => t.id === activeId) || TECH_DATA[0]

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-black/80 rounded-3xl overflow-hidden border border-white/10">
      {/* Sidebar */}
      <div className="w-full lg:w-1/3 border-r border-white/10 bg-white/[0.02] flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1"><Activity size={16} className="text-[#00ff88] animate-pulse" /><span className="text-xs font-bold tracking-[0.2em] text-white">SYSTEM DIAGNOSTICS</span></div>
          <div className="text-[10px] text-gray-500 font-mono">V.12.0 // CONNECTED</div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {TECH_DATA.map((tech) => (
            <button key={tech.id} onClick={() => setActiveId(tech.id)} className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left relative overflow-hidden group ${activeId === tech.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
              {activeId === tech.id && <motion.div layoutId="activeTechBar" className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: tech.color }} />}
              <div className={`p-2 rounded-lg transition-colors ${activeId === tech.id ? 'bg-black text-white' : 'bg-white/5 text-gray-500 group-hover:text-white'}`}><tech.icon size={18} /></div>
              <div><div className={`text-sm font-bold tracking-wide ${activeId === tech.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{tech.name}</div><div className="text-[9px] text-gray-600 font-mono group-hover:text-[#00ff88]">STATUS: ONLINE</div></div>
            </button>
          ))}
        </div>
      </div>
      {/* Main Screen */}
      <div className="flex-1 relative p-8 lg:p-12 flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-10 pointer-events-none" />
        <AnimatePresence mode='wait'>
          <motion.div key={activeTech.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2"><span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono text-white border border-white/10">ID: {activeTech.code}</span><span className="px-2 py-0.5 rounded bg-[#00ff88]/10 text-[9px] font-mono text-[#00ff88] border border-[#00ff88]/20 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[#00ff88] animate-pulse"/> OPERATIONAL</span></div>
                <h2 className="text-4xl lg:text-6xl font-black mb-4 tracking-tighter text-white">{activeTech.name}</h2>
                <motion.div initial={{ width: 0 }} animate={{ width: 100 }} className="h-1 mb-6" style={{ backgroundColor: activeTech.color }} />
                <p className="text-gray-400 text-lg font-light leading-relaxed border-l-2 border-white/10 pl-4 max-w-xl">{activeTech.longDesc}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {activeTech.specs.map((spec, i) => (
                <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 + i*0.1 }} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="text-[10px] text-gray-500 font-bold mb-1">{spec.l}</div><div className="text-xl font-mono font-bold text-white">{spec.v}</div><div className="text-[9px] text-[#00ff88] mt-1 font-mono">{spec.s}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto grid grid-cols-2 gap-6 h-32">
               <SystemTerminal activeColor={activeTech.color} />
               <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col justify-end"><div className="flex justify-between items-center mb-2"><span className="text-[9px] text-gray-500 font-bold">SIGNAL</span><Wifi size={12} className="text-gray-500" /></div><AudioVis color={activeTech.color} /></div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// =============================================================================
// SECTION 6: MAIN PAGE (ROOT)
// =============================================================================

export default function LandingPage() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end start"] })
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [isSystemBooted, setIsSystemBooted] = useState(false) // State cho Boot Loader

  return (
    <>
      {/* 1. SYSTEM BOOT LOADER (Masks the 30s load time) */}
      <AnimatePresence>
        {!isSystemBooted && (
          <SystemBootLoader onComplete={() => setIsSystemBooted(true)} />
        )}
      </AnimatePresence>

      {/* 2. MAIN CONTENT (Hidden until booted to prevent flickering) */}
      <motion.div 
        ref={targetRef} 
        initial={{ opacity: 0 }}
        animate={{ opacity: isSystemBooted ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="min-h-screen flex flex-col font-sans text-white bg-[#050505] selection:bg-[#00ff88] selection:text-black overflow-x-hidden"
      >
        
        {/* GLOBAL UTILS */}

        <ClickSpark />
        <ScrollRocket />

        {/* BACKGROUND */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* CosmicBackground chỉ được render khi đã boot để tối ưu */}
          {isSystemBooted && <CosmicBackground />}
          
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)] opacity-80" />
        </div>

        {/* DEMO MODAL */}
        <AnimatePresence>
          {isDemoOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>
              <button 
                onClick={() => setIsDemoOpen(false)} 
                aria-label="Close demo terminal"
                className="absolute top-8 right-8 group z-50 flex items-center gap-3 px-5 py-3 rounded-full border border-white/10 bg-black hover:border-[#00ff88]/50 transition-all"
              >
                <span className="text-xs font-mono text-gray-400 group-hover:text-[#00ff88] tracking-widest">CLOSE_TERMINAL</span>
                <X size={18} className="text-white" />
              </button>
              <div className="w-full h-full max-w-[1400px] flex flex-col items-center justify-center">
                  <TechUniverse />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVBAR */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-6 transition-all duration-500">
          <div className="max-w-7xl mx-auto flex items-center justify-between bg-black/30 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl">
            <Link href="/" className="flex items-center gap-3 group">
              <CosmicLogo size={42} />
              <div className="flex flex-col"><span className="font-bold tracking-[0.25em] text-lg leading-none text-white group-hover:text-[#00ff88] transition-colors">QUOC<span className="text-[#00ff88] group-hover:text-white transition-colors">BANK</span></span><span className="text-[8px] text-gray-500 font-mono tracking-widest group-hover:tracking-[0.5em] transition-all duration-500">INTERSTELLAR</span></div>
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
              <Link href="/login" className="hidden md:block text-xs font-bold px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all font-mono tracking-wide">// LOGIN</Link>
              <Link href="/register"><MagneticButton className="px-6 py-2.5 rounded-full bg-[#00ff88] text-black text-xs font-bold hover:bg-[#00cc6a] shadow-[0_0_20px_rgba(0,255,136,0.3)] flex items-center gap-2 group"><span>OPEN ACCOUNT</span> <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></MagneticButton></Link>
            </div>
          </div>
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
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-6 text-shadow-glow">
                  <span className="block text-white mb-2">NGÂN HÀNG</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-emerald-300 to-cyan-500 pb-4">ĐA VŨ TRỤ</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-lg md:text-2xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light border-l-4 border-[#00ff88] pl-6">Kỷ nguyên tài chính mới. <br/>Chuyển tiền <span className="text-white font-semibold">tốc độ ánh sáng</span>. Bảo mật <span className="text-white font-semibold">lượng tử</span>.</motion.p>
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto justify-center lg:justify-start pt-4">
                <Link href="/register"><MagneticButton className="w-full px-10 py-5 rounded-2xl bg-[#00ff88] text-black font-bold text-lg hover:bg-[#00cc6a] shadow-[0_0_40px_rgba(0,255,136,0.4)] flex items-center justify-center gap-3"><Rocket size={24} /> <HyperText text="KHỞI TẠO VÍ NGAY" className="text-black font-black tracking-wide" /></MagneticButton></Link>
                <div onClick={() => setIsDemoOpen(true)} className="w-full sm:w-auto">
                  <MagneticButton className="w-full px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md font-semibold flex items-center justify-center gap-3 transition-all group text-white cursor-pointer hover:border-[#00ff88]/50">
                    <PlayCircle size={24} className="text-[#00ff88] group-hover:scale-110 transition-transform" aria-hidden="true" /> 
                    <span className="tracking-wide">XEM DEMO</span>
                  </MagneticButton>
                </div>
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

        <PartnerMarquee />

        {/* SYSTEM ACCESS SECTION */}
        <section id="HệThống" className="relative z-10 py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#00ff88]/5 to-black pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 text-gray-400 text-xs font-mono mb-6">INFRASTRUCTURE LEVEL 5</div>
                <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white">HỆ THỐNG <span className="text-[#00ff88]">LÕI</span></h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">Khám phá kiến trúc công nghệ vận hành nền kinh tế liên sao.</p>
              </div>
              <div className="flex justify-center">
                <button 
                  onClick={() => setIsDemoOpen(true)} 
                  aria-label="Access system core demo"
                  className="group relative cursor-pointer bg-transparent border-0"
                >
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-60 h-20 bg-[#00ff88] blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="relative w-64 h-64 border border-white/10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center group-hover:border-[#00ff88]/50 transition-colors duration-500">
                      <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_10s_linear_infinite]"></div>
                      <div className="absolute inset-4 rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]"></div>
                      <div className="text-center"><Cpu size={48} className="mx-auto mb-4 text-[#00ff88] group-hover:scale-125 transition-transform duration-300" aria-hidden="true" /><div className="text-xs font-bold tracking-widest text-white group-hover:text-[#00ff88]">ACCESS CORE</div></div>
                    </div>
                </button>
              </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="Tính" className="relative z-10 py-40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/5 text-[#00ff88] text-xs font-mono mb-6"><span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span> FEATURES</div>
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">CÔNG NGHỆ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-emerald-400 to-cyan-500">TIÊN PHONG</span></h2>
            </div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[450px]">
              <motion.div variants={fadeUpVariant} whileHover={{ y: -10 }} className="md:col-span-2 relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm group">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] -mr-32 -mt-32 pointer-events-none group-hover:bg-indigo-600/20 transition-colors duration-700"></div>
                <div className="relative h-full flex flex-col justify-between p-10 md:p-14">
                    <div>
                      <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center mb-8 text-indigo-400 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)] group-hover:scale-110 transition-transform duration-500"><Zap size={40} /></div>
                      <h3 className="text-4xl font-bold mb-4 text-white">Warp Speed Transfer</h3>
                      <p className="text-gray-400 text-xl leading-relaxed max-w-lg">Chuyển tiền xuyên thiên hà với tốc độ ánh sáng. Loại bỏ hoàn toàn độ trễ.</p>
                    </div>
                    <div className="flex gap-2 opacity-30 mt-8">{[...Array(10)].map((_, i) => <div key={i} className="h-1 bg-indigo-500 rounded-full animate-pulse" style={{ width: Math.random() * 40 + 10 + 'px', animationDelay: i * 0.1 + 's' }} />)}</div>
                </div>
              </motion.div>
              <motion.div variants={fadeUpVariant} whileHover={{ y: -10 }} className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm group"><div className="p-10 h-full flex flex-col justify-between"><div><div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-[#00ff88] border border-green-500/20 mb-6 group-hover:rotate-12 transition-transform"><ShieldCheck size={32} /></div><h3 className="text-3xl font-bold mb-3 text-white">Quantum Safe</h3><p className="text-gray-400 leading-relaxed">Mã hóa đa lớp an toàn tuyệt đối. Bất khả xâm phạm.</p></div></div></motion.div>
              <motion.div variants={fadeUpVariant} whileHover={{ y: -10 }} className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm group"><div className="p-10 h-full flex flex-col justify-between"><div><div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 mb-6 group-hover:scale-110 transition-transform"><Globe size={32} /></div><h3 className="text-3xl font-bold mb-3 text-white">Universal Pay</h3><p className="text-gray-400 leading-relaxed">Thanh toán mọi nơi. Tự động quy đổi tiền tệ giữa 500+ hành tinh.</p></div></div></motion.div>
              <motion.div variants={fadeUpVariant} whileHover={{ y: -10 }} className="md:col-span-2 relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm group">
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
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* APP SHOWCASE */}
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

        {/* FOOTER */}
        <footer className="relative z-10 bg-black pt-32 pb-10 px-6 border-t border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,136,0.05),transparent_50%)] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                <div className="md:col-span-1">
                    <Link href="/" className="flex items-center gap-3 mb-6"><CosmicLogo size={40} /><span className="font-bold text-xl">QUOC<span className="text-[#00ff88]">BANK</span></span></Link>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">Hệ thống ngân hàng đầu tiên được cấp phép hoạt động liên hành tinh. Kết nối tài chính của bạn với tương lai.</p>
                    <div className="flex gap-4">
                      {['Twitter', 'Facebook', 'Discord'].map(s => (
                        <button 
                          key={s} 
                          aria-label={`Visit our ${s} page`}
                          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#00ff88] hover:text-black transition-all cursor-pointer"
                        >
                          <Share2 size={18} aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                </div>
                <div><h4 className="text-white font-bold mb-6">Sản Phẩm</h4><ul className="space-y-4 text-sm text-gray-500"><li><a href="#" className="hover:text-[#00ff88] transition-colors">Tài khoản Standard</a></li><li><a href="#" className="hover:text-[#00ff88] transition-colors">Thẻ tín dụng Black</a></li><li><a href="#" className="hover:text-[#00ff88] transition-colors">Khoản vay không trọng lực</a></li><li><a href="#" className="hover:text-[#00ff88] transition-colors">Đầu tư Crypto</a></li></ul></div>
                <div><h4 className="text-white font-bold mb-6">Công Ty</h4><ul className="space-y-4 text-sm text-gray-500"><li><a href="#" className="hover:text-[#00ff88] transition-colors">Về chúng tôi</a></li><li><a href="#" className="hover:text-[#00ff88] transition-colors">Tuyển dụng phi hành đoàn</a></li><li><a href="#" className="hover:text-[#00ff88] transition-colors">Tin tức vũ trụ</a></li><li><a href="#" className="hover:text-[#00ff88] transition-colors">Liên hệ</a></li></ul></div>
                <div>
                  <h4 className="text-white font-bold mb-6">Newsletter</h4>
                  <p className="text-gray-500 text-sm mb-4">Nhận thông tin thị trường mới nhất.</p>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="email@space.com" 
                      aria-label="Email address for newsletter"
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#00ff88] outline-none flex-1" 
                    />
                    <button 
                      aria-label="Subscribe to newsletter"
                      className="bg-[#00ff88] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#00cc6a]"
                    >
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-600">
                <div className="flex items-center gap-2"><CosmicLogo size={24} /> © 2025 QuocBank. All rights reserved.</div>
                <div className="flex gap-8"><a href="#" className="hover:text-[#00ff88] transition-colors">Điều khoản</a><a href="#" className="hover:text-[#00ff88] transition-colors">Bảo mật</a><a href="#" className="hover:text-[#00ff88] transition-colors">Cookie</a></div>
              </div>
          </div>
        </footer>
      </motion.div>
    </>
  )
}