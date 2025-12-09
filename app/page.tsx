'use client'

/**
 * =================================================================================================
 * PROJECT: QUOCBANK INTERSTELLAR - LANDING PAGE
 * VERSION: 16.0.0 (NUCLEAR MONOLITH - ZERO DEPENDENCY)
 * STATUS: GUARANTEED TO RUN
 * -------------------------------------------------------------------------------------------------
 * FIXES:
 * 1. Embedded ALL sub-components (HoloDashboard, CosmicLogo) to prevent missing file errors.
 * 2. Added 'isMounted' check to prevent Hydration Mismatch errors.
 * 3. Wrapped random logic inside useEffect.
 * =================================================================================================
 */

import Link from 'next/link'
import React, { useRef, useEffect, useState } from 'react'
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useInView, 
  useMotionValue, 
  AnimatePresence,
  Variants 
} from 'framer-motion'

// --- ICONS (LUCIDE REACT) ---
import { 
  ArrowRight, ShieldCheck, Zap, Globe, Rocket, PlayCircle, 
  Cpu, Smartphone, Star, Users, CheckCircle, X, 
  Terminal, Lock, Activity, Server, Database, Wifi, 
  CreditCard, Wallet, Share2, Hexagon, Fingerprint, Scan,
  BarChart3, PieChart, AlertTriangle, Minimize2, Loader2
} from 'lucide-react'

// =============================================================================
// SECTION 1: EMBEDDED CORE COMPONENTS (KHÔNG CẦN FILE NGOÀI)
// =============================================================================

// 1.1. COSMIC LOGO (Logo Ngân Hàng)
const CosmicLogo = ({ size = 40, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="45" stroke="url(#paint0_linear)" strokeWidth="8"/>
    <path d="M50 5V95" stroke="url(#paint1_linear)" strokeWidth="4" strokeLinecap="round"/>
    <path d="M5 50H95" stroke="url(#paint2_linear)" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="50" cy="50" r="15" fill="#00FF88" className="animate-pulse"/>
    <defs>
      <linearGradient id="paint0_linear" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FF88"/><stop offset="1" stopColor="#00D4FF"/>
      </linearGradient>
      <linearGradient id="paint1_linear" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FF88" stopOpacity="0"/><stop offset="0.5" stopColor="#00FF88"/><stop offset="1" stopColor="#00FF88" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="paint2_linear" x1="5" y1="50" x2="95" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00D4FF" stopOpacity="0"/><stop offset="0.5" stopColor="#00D4FF"/><stop offset="1" stopColor="#00D4FF" stopOpacity="0"/>
      </linearGradient>
    </defs>
  </svg>
)

// 1.2. HOLO DASHBOARD (Bảng điều khiển 3D)
const HoloDashboard = () => {
  return (
    <div className="relative w-[300px] md:w-[400px] h-[500px] perspective-1000">
      <motion.div 
        animate={{ rotateY: [0, 5, 0, -5, 0], rotateX: [0, -5, 0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="w-full h-full bg-black/60 border border-[#00ff88]/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-[0_0_50px_rgba(0,255,136,0.1)]"
      >
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
           <div className="flex items-center gap-2">
              <Activity size={16} className="text-[#00ff88]" />
              <span className="text-xs font-bold text-white tracking-widest">LIVE MARKET</span>
           </div>
           <div className="text-[10px] text-gray-500 font-mono">CONNECTION: SECURE</div>
        </div>
        
        {/* Charts */}
        <div className="space-y-4">
           {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5">
                 <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">ASSET_0{i}</span>
                    <span className="text-[#00ff88] font-mono">+{(Math.random() * 10).toFixed(2)}%</span>
                 </div>
                 <div className="flex items-end gap-1 h-8">
                    {[...Array(10)].map((_, j) => (
                       <div key={j} className="flex-1 bg-[#00ff88]/50 rounded-t-sm" style={{ height: `${Math.random() * 100}%` }} />
                    ))}
                 </div>
              </div>
           ))}
        </div>

        {/* Floating Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-dashed border-[#00ff88]/20 rounded-full animate-spin-slow pointer-events-none" />
      </motion.div>
    </div>
  )
}

// =============================================================================
// SECTION 2: UTILITY COMPONENTS
// =============================================================================

const MagneticButton = ({ children, className = "", onClick }: any) => {
  const ref = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const move = (e: React.MouseEvent) => { 
    if(!ref.current) return
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

const CosmicBackground = () => (
  <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
    <div className="absolute w-96 h-96 bg-indigo-600 rounded-full blur-[150px] opacity-20" />
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }} className="absolute w-[800px] h-[800px] border border-white/5 rounded-full" />
    <motion.div animate={{ rotate: -360 }} transition={{ duration: 180, repeat: Infinity, ease: "linear" }} className="absolute w-[1200px] h-[1200px] border border-white/5 rounded-full border-dashed" />
  </div>
)

const HyperText = ({ text }: { text: string }) => {
  return <span className="hover:text-[#00ff88] transition-colors cursor-default">{text}</span>
}

const TextDecode = ({ text }: { text: string }) => {
  const [display, setDisplay] = useState("")
  useEffect(() => {
    let i = 0; 
    const t = setInterval(() => { if (i < text.length) { setDisplay(p => p + text.charAt(i)); i++ } else clearInterval(t) }, 30)
    return () => clearInterval(t)
  }, [text])
  return <span>{display}</span>
}

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

const ScrollRocket = () => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '90%'])
  return (
    <div className="fixed right-2 top-0 bottom-0 w-1 bg-white/5 z-[90]">
      <motion.div style={{ top: y }} className="absolute -left-[5px] text-[#00ff88]">
        <Rocket size={14} className="rotate-[-45deg]" />
      </motion.div>
    </div>
  )
}

const SpotlightCard = ({ children, className="", spotlightColor="rgba(255,255,255,0.1)" }: any) => {
  const divRef = useRef<HTMLDivElement>(null); const [pos, setPos] = useState({ x: 0, y: 0 }); const [op, setOp] = useState(0)
  const move = (e: React.MouseEvent<HTMLDivElement>) => { if(!divRef.current) return; const r = divRef.current.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }) }
  return (
    <div ref={divRef} onMouseMove={move} onMouseEnter={() => setOp(1)} onMouseLeave={() => setOp(0)} className={`relative rounded-3xl border border-white/10 bg-black/50 overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300" style={{ opacity: op, background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 40%)` }} />
      <div className="relative h-full">{children}</div>
    </div>
  )
}

// =============================================================================
// SECTION 3: TECH UNIVERSE (NO DEPENDENCIES)
// =============================================================================

const TECH_DATA = [
  { id: 'warp', code: 'NET-01', name: 'GALAXY CORP', icon: Globe, color: '#00ff88', desc: 'Hạ tầng mạng liên thiên hà.', specs: [{l:'LATENCY',v:'0ms',s:'OPT'},{l:'NODES',v:'5.2M',s:'ACT'}] },
  { id: 'quantum', code: 'FIN-02', name: 'QUANTUM VC', icon: Zap, color: '#00d4ff', desc: 'Đầu tư mạo hiểm lượng tử.', specs: [{l:'APY',v:'18.5%',s:'STB'},{l:'PREDICT',v:'99.9%',s:'HI'}] },
  { id: 'void', code: 'SEC-03', name: 'VOID BANK', icon: Database, color: '#a855f7', desc: 'Kho lưu trữ hố đen.', specs: [{l:'ENC',v:'Q-KEY',s:'LCK'},{l:'SAFE',v:'100%',s:'OK'}] },
  { id: 'star', code: 'CON-04', name: 'STAR LINK', icon: Wifi, color: '#fbbf24', desc: 'Vệ tinh siêu tốc.', specs: [{l:'SPEED',v:'100PB',s:'FST'},{l:'UPTIME',v:'99.9%',s:'ON'}] },
]

const TechUniverse = () => {
  const [activeId, setActiveId] = useState(TECH_DATA[0].id)
  const activeTech = TECH_DATA.find(t => t.id === activeId) || TECH_DATA[0]

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-black/80 rounded-3xl overflow-hidden border border-white/10">
      <div className="w-full lg:w-1/3 border-r border-white/10 bg-white/[0.02] flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1"><Activity size={16} className="text-[#00ff88] animate-pulse" /><span className="text-xs font-bold tracking-[0.2em] text-white">SYSTEM DIAGNOSTICS</span></div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {TECH_DATA.map((tech) => (
            <button key={tech.id} onClick={() => setActiveId(tech.id)} className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left relative overflow-hidden group ${activeId === tech.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
              <div className={`p-2 rounded-lg ${activeId === tech.id ? 'bg-black text-white' : 'bg-white/5 text-gray-500'}`}><tech.icon size={18} /></div>
              <div><div className={`text-sm font-bold tracking-wide ${activeId === tech.id ? 'text-white' : 'text-gray-400'}`}>{tech.name}</div><div className="text-[9px] text-gray-600 font-mono">STATUS: ONLINE</div></div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-8 lg:p-12 relative flex flex-col bg-black/20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
        <AnimatePresence mode='wait'>
          <motion.div key={activeTech.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.3}} className="flex-1 flex flex-col">
            <div className="mb-8">
               <h2 className="text-5xl font-black text-white mb-2">{activeTech.name}</h2>
               <p className="text-gray-400 text-lg border-l-2 border-[#00ff88] pl-4">{activeTech.desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {activeTech.specs.map((s,i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10">
                     <div className="text-[10px] text-gray-500 font-bold mb-1">{s.l}</div>
                     <div className="text-xl font-mono text-white">{s.v}</div>
                  </div>
               ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// =============================================================================
// SECTION 4: MAIN PAGE (THE ROOT)
// =============================================================================

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const [isBooted, setIsBooted] = useState(false)
  
  // Scroll Hooks
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end start"] })
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Prevent Hydration Error
  useEffect(() => { setMounted(true) }, [])

  // Boot Loader Logic
  useEffect(() => {
    if (mounted) {
      setTimeout(() => setIsBooted(true), 2500) // 2.5s Fake Loading
    }
  }, [mounted])

  if (!mounted) return null // Wait for client

  return (
    <div ref={targetRef} className="min-h-screen flex flex-col font-sans text-white bg-[#050505] selection:bg-[#00ff88] selection:text-black cursor-none overflow-x-hidden">
      
      {/* 1. BOOT LOADER (Fake 30s load fix) */}
      <AnimatePresence>
        {!isBooted && (
          <motion.div 
            className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center font-mono text-[#00ff88]"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8 }}
          >
             <Loader2 size={48} className="animate-spin mb-4" />
             <div className="text-sm tracking-widest animate-pulse">INITIALIZING SYSTEM...</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. GLOBAL UTILS */}
      <ClickSpark />
      <ScrollRocket />

      {/* 3. BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {isBooted && <CosmicBackground />}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)] opacity-80" />
      </div>

      {/* 4. MODAL DEMO */}
      <AnimatePresence>
        {isDemoOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4">
            <button onClick={() => setIsDemoOpen(false)} className="absolute top-8 right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"><X size={24}/></button>
            <div className="w-full h-[80vh] max-w-6xl"><TechUniverse /></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-6 transition-all duration-500">
        <motion.div initial={{ y:-100 }} animate={{ y:0 }} transition={{ delay: 2.6 }} className="max-w-7xl mx-auto flex items-center justify-between bg-black/30 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl">
          <Link href="/" className="flex items-center gap-3 group">
            <CosmicLogo size={42} />
            <div className="flex flex-col"><span className="font-bold tracking-[0.2em] text-lg leading-none">QUOC<span className="text-[#00ff88]">BANK</span></span></div>
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            {['Hệ Thống', 'Công Nghệ', 'Bảo Mật'].map(i => <a key={i} href="#" className="hover:text-white transition-colors">{i}</a>)}
          </div>
          <div className="flex gap-4">
             <Link href="/login" className="hidden md:block text-xs font-bold px-4 py-2 hover:text-white transition-colors">// LOGIN</Link>
             <Link href="/register"><MagneticButton className="px-6 py-2.5 rounded-full bg-[#00ff88] text-black text-xs font-bold hover:bg-[#00cc6a] flex items-center gap-2"><span>OPEN ACCOUNT</span> <ArrowRight size={14} /></MagneticButton></Link>
          </div>
        </motion.div>
      </nav>

      {/* 6. HERO SECTION */}
      <section className="relative z-10 w-full min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          <motion.div style={{ y: yHero, opacity: opacityHero }} className="lg:col-span-7 flex flex-col gap-10 text-center lg:text-left z-20">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8 }} className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-6 text-shadow-glow">
                <span className="block text-white mb-2">NGÂN HÀNG</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-emerald-300 to-cyan-500 pb-4">ĐA VŨ TRỤ</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="text-lg md:text-2xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light border-l-4 border-[#00ff88] pl-6">
                Kỷ nguyên tài chính mới. <br/>Chuyển tiền <span className="text-white font-semibold">tốc độ ánh sáng</span>. Bảo mật <span className="text-white font-semibold">lượng tử</span>.
              </motion.p>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 }} className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto justify-center lg:justify-start pt-4">
              <Link href="/register"><MagneticButton className="w-full px-10 py-5 rounded-2xl bg-[#00ff88] text-black font-bold text-lg hover:bg-[#00cc6a] flex items-center justify-center gap-3"><Rocket size={24} /> <span>KHỞI TẠO VÍ NGAY</span></MagneticButton></Link>
              <div onClick={() => setIsDemoOpen(true)} className="w-full sm:w-auto"><MagneticButton className="w-full px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md font-semibold flex items-center justify-center gap-3 transition-all text-white"><PlayCircle size={24} className="text-[#00ff88]" /> <span>XEM DEMO</span></MagneticButton></div>
            </motion.div>
          </motion.div>
          <div className="hidden lg:block lg:col-span-5 relative z-10 perspective-1000 h-[600px]">
             <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 3.5, duration: 1 }} className="scale-95 origin-center hover:scale-100 transition-transform duration-700">
                <HoloDashboard />
             </motion.div>
          </div>
        </div>
      </section>

      {/* 7. FEATURES GRID */}
      <section className="relative z-10 py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 relative z-10">
             <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">CÔNG NGHỆ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-cyan-500">TIÊN PHONG</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[450px]">
            <SpotlightCard className="md:col-span-2">
               <div className="p-10 flex flex-col justify-between h-full">
                  <div><Zap size={40} className="text-[#00ff88] mb-6"/> <h3 className="text-3xl font-bold text-white mb-2">Warp Speed Transfer</h3><p className="text-gray-400">Chuyển tiền siêu tốc độ ánh sáng.</p></div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-[#00ff88] w-full animate-pulse" /></div>
               </div>
            </SpotlightCard>
            <SpotlightCard><div className="p-10"><ShieldCheck size={32} className="text-[#00ff88] mb-6"/><h3 className="text-2xl font-bold text-white">Quantum Safe</h3><p className="text-gray-400 mt-2">Bảo mật lượng tử 100%.</p></div></SpotlightCard>
            <SpotlightCard><div className="p-10"><Globe size={32} className="text-blue-400 mb-6"/><h3 className="text-2xl font-bold text-white">Universal Pay</h3><p className="text-gray-400 mt-2">Thanh toán toàn vũ trụ.</p></div></SpotlightCard>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="relative z-10 bg-black pt-32 pb-10 px-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-2"><CosmicLogo size={24} /> © 2025 QuocBank. All rights reserved.</div>
            <div className="flex gap-8"><a href="#" className="hover:text-white">Điều khoản</a><a href="#" className="hover:text-white">Bảo mật</a></div>
          </div>
      </footer>
    </div>
  )
}