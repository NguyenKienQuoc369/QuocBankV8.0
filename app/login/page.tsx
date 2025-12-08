'use client'

/**
 * =================================================================================================
 * PROJECT: QUOCBANK INTERSTELLAR - SECURITY GATEWAY (LOGIN V12.0)
 * CODENAME: "THE SINGULARITY"
 * LINE COUNT: ~1000+
 * COMPLEXITY: EXTREME
 * * SYSTEM MODULES:
 * 1. BIOS_BOOT_LOADER: Simulates hardware initialization.
 * 2. NEURAL_CANVAS: Interactive HTML5 Canvas background.
 * 3. TESSERACT_CORE: 3D CSS Animation Engine.
 * 4. FORM_LOGIC: Multi-factor authentication simulation.
 * 5. THREAT_MONITOR: Real-time attack blocking visualizer.
 * =================================================================================================
 */

import React, { useState, useActionState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform, useAnimation } from 'framer-motion'
import { login } from '@/app/actions/auth' // Server action
import { 
  User, Mail, Lock, Loader2, Rocket, 
  CreditCard, ShieldCheck, CheckCircle2, 
  Fingerprint, Scan, AlertTriangle, ArrowRight, 
  Cpu, Globe, ChevronRight, ChevronLeft, Terminal, Check,
  Eye, EyeOff, Keyboard, RefreshCw, Wifi, Battery, Signal,
  Activity, Server, Database, XCircle, MapPin, Radio, Hexagon
} from 'lucide-react'

// =============================================================================
// SECTION 1: CONFIGURATION & CONSTANTS
// =============================================================================

const initialState = {
  message: '',
  error: '',
  success: false
}

const SYSTEM_LOGS = [
  "BIOS DATE 01/09/2099 14:23:11 VER 2.3.1",
  "CPU: QUANTUM CORE I9-9900K @ 500THz",
  "RAM: 1024 TB DDR9 DETECTED",
  "LOADING KERNEL...",
  "MOUNTING VIRTUAL FILESYSTEM...",
  "INITIALIZING NEURAL NETWORK...",
  "CHECKING BIOMETRIC SENSORS... OK",
  "ESTABLISHING SECURE TUNNEL TO SAT-09...",
  "HANDSHAKE COMPLETED.",
  "BOOT SEQUENCE FINISHED."
]

const THREAT_DATA = [
  { ip: "192.168.0.1", origin: "Mars Colony 4", type: "Brute Force", status: "BLOCKED" },
  { ip: "10.0.4.22", origin: "Asteroid Belt", type: "SQL Injection", status: "BLOCKED" },
  { ip: "172.16.9.1", origin: "Unknown Sector", type: "DDoS", status: "MITIGATED" },
  { ip: "8.8.8.8", origin: "Earth (Old)", type: "Phishing", status: "ISOLATED" },
]

// =============================================================================
// SECTION 2: UTILITY HOOKS
// =============================================================================

// Hook: Typing Effect cho BIOS
const useTypewriter = (text: string, speed = 30) => {
  const [displayedText, setDisplayedText] = useState("")
  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i))
        i++
      } else clearInterval(timer)
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])
  return displayedText
}

// Hook: Mouse Position cho Parallax
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])
  return mousePosition
}

// =============================================================================
// SECTION 3: COMPLEX SUB-COMPONENTS
// =============================================================================

// 3.1. NEURAL CANVAS (Vẽ mạng lưới kết nối bằng HTML5 Canvas)
const NeuralCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { x, y } = useMousePosition()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const particles: { x: number, y: number, vx: number, vy: number, size: number }[] = []
    const particleCount = 60
    const connectionDistance = 150

    // Init particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      
      // Update particles
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        // Bounce off walls
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 255, 136, ${0.5})`
        ctx.fill()

        // Connect to mouse
        const dxMouse = x - p.x
        const dyMouse = y - p.y
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
        if (distMouse < 200) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(0, 255, 136, ${1 - distMouse / 200})`
          ctx.lineWidth = 1
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(x, y)
          ctx.stroke()
        }

        // Connect to other particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDistance) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 255, 136, ${0.2 * (1 - dist / connectionDistance)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [x, y])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />
}

// 3.2. BIOS BOOT SCREEN (Màn hình khởi động giả lập)
const BiosBoot = ({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let delay = 0
    SYSTEM_LOGS.forEach((log, i) => {
      delay += Math.random() * 300 + 100
      setTimeout(() => {
        setLines(prev => [...prev, log])
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }, delay)
    })

    setTimeout(onComplete, delay + 800)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-start justify-start p-10 font-mono text-sm md:text-base cursor-none">
      <div ref={scrollRef} className="w-full h-full overflow-hidden text-[#00ff88]">
        <div className="mb-4 text-white font-bold">QUOCBANK QUANTUM BIOS (c) 2077</div>
        {lines.map((line, i) => (
          <div key={i} className="mb-1">{line}</div>
        ))}
        <div className="animate-pulse">_</div>
      </div>
      
      {/* Fake Hardware Stats */}
      <div className="absolute bottom-10 right-10 text-right text-gray-500 text-xs">
         <div>MEMORY TEST: PASSED</div>
         <div>SECURITY MODULE: ACTIVE</div>
         <div>KEYBOARD: DETECTED</div>
      </div>
    </div>
  )
}

// 3.3. TESSERACT CORE (Khối 3D xoay)
const TesseractCore = () => {
  return (
    <div className="w-48 h-48 relative preserve-3d animate-spin-slow-3d">
      <style jsx>{`
        .preserve-3d { transform-style: preserve-3d; }
        .face { position: absolute; width: 100%; height: 100%; border: 2px solid rgba(0, 255, 136, 0.5); background: rgba(0, 255, 136, 0.05); }
        .inner-face { position: absolute; width: 60%; height: 60%; top: 20%; left: 20%; border: 2px solid rgba(0, 212, 255, 0.5); background: rgba(0, 212, 255, 0.1); }
        @keyframes spin3d { from { transform: rotateX(0) rotateY(0) rotateZ(0); } to { transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg); } }
        .animate-spin-slow-3d { animation: spin3d 20s linear infinite; }
      `}</style>
      
      {/* Outer Cube */}
      <div className="face translate-z-24" style={{ transform: 'translateZ(96px)' }} />
      <div className="face -translate-z-24" style={{ transform: 'rotateY(180deg) translateZ(96px)' }} />
      <div className="face rotate-y-90 translate-z-24" style={{ transform: 'rotateY(90deg) translateZ(96px)' }} />
      <div className="face -rotate-y-90 translate-z-24" style={{ transform: 'rotateY(-90deg) translateZ(96px)' }} />
      <div className="face rotate-x-90 translate-z-24" style={{ transform: 'rotateX(90deg) translateZ(96px)' }} />
      <div className="face -rotate-x-90 translate-z-24" style={{ transform: 'rotateX(-90deg) translateZ(96px)' }} />

      {/* Inner Cube */}
      <div className="inner-face translate-z-12" style={{ transform: 'translateZ(48px)' }} />
      <div className="inner-face -translate-z-12" style={{ transform: 'rotateY(180deg) translateZ(48px)' }} />
      <div className="inner-face rotate-y-90 translate-z-12" style={{ transform: 'rotateY(90deg) translateZ(48px)' }} />
      <div className="inner-face -rotate-y-90 translate-z-12" style={{ transform: 'rotateY(-90deg) translateZ(48px)' }} />
      <div className="inner-face rotate-x-90 translate-z-12" style={{ transform: 'rotateX(90deg) translateZ(48px)' }} />
      <div className="inner-face -rotate-x-90 translate-z-12" style={{ transform: 'rotateX(-90deg) translateZ(48px)' }} />
      
      {/* Core Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#00ff88] rounded-full blur-[40px] animate-pulse" />
    </div>
  )
}

// 3.4. THREAT MONITOR (Bảng theo dõi mối đe dọa)
const ThreatMonitor = () => {
  return (
    <div className="bg-black/60 border border-red-900/30 rounded-xl p-4 w-full h-full overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b border-red-900/30 pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-500 animate-pulse" />
          <span className="text-[10px] font-bold text-red-500 tracking-widest">THREAT MONITOR</span>
        </div>
        <div className="text-[9px] text-gray-500 font-mono">LIVE FEED</div>
      </div>
      <div className="flex-1 space-y-2">
        {THREAT_DATA.map((threat, i) => (
          <div key={i} className="flex justify-between items-center text-[10px] bg-red-950/10 p-2 rounded border border-red-900/10">
            <div className="flex flex-col">
              <span className="text-red-300 font-mono">{threat.ip}</span>
              <span className="text-gray-500">{threat.origin}</span>
            </div>
            <div className="text-right">
              <div className="text-red-400 font-bold">{threat.type}</div>
              <div className="text-[#00ff88]">{threat.status}</div>
            </div>
          </div>
        ))}
        {/* Fake Scan Line */}
        <motion.div 
          className="h-[1px] w-full bg-red-500/50 box-shadow-[0_0_10px_red]"
          animate={{ y: [0, 150, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  )
}

// 3.5. VIRTUAL KEYPAD (Bàn phím ảo)
const VirtualKeypad = ({ onInput }: { onInput: (n: string) => void }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '←']
  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      {keys.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onInput(k)}
          className={`p-3 rounded border border-white/10 text-white font-mono text-sm hover:bg-[#00ff88]/20 hover:border-[#00ff88] transition-all active:scale-95
            ${k === 'C' ? 'text-red-400' : ''} ${k === '←' ? 'text-yellow-400' : ''}
          `}
        >
          {k}
        </button>
      ))}
    </div>
  )
}

// 3.6. CYBER INPUT (Ô nhập liệu xịn sò)
const CyberInput = ({ 
  icon: Icon, type, name, placeholder, label, 
  value, onChange, onFocus, onBlur, isFocused, showToggle, onToggle 
}: any) => (
  <div className="space-y-1 group relative">
    <div className="flex justify-between items-end px-1">
       <label className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isFocused ? 'text-[#00ff88]' : 'text-gray-500'}`}>
          {label}
       </label>
       {isFocused && <span className="text-[9px] text-[#00ff88] font-mono animate-pulse">INPUT ACTIVE</span>}
    </div>
    
    <div className="relative">
       <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-[#00ff88]' : 'text-gray-600'}`}>
          <Icon size={18} />
       </div>
       <input 
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full bg-black/40 border-2 rounded-xl py-4 pl-12 pr-12 text-white placeholder-gray-700 focus:outline-none transition-all font-mono text-sm
             ${isFocused 
                ? 'border-[#00ff88]/50 shadow-[0_0_20px_rgba(0,255,136,0.1)] bg-[#00ff88]/5' 
                : 'border-white/10 hover:border-white/20'
             }
          `}
       />
       
       {showToggle && (
         <button 
            type="button" 
            onClick={onToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
         >
            {type === 'password' ? <Eye size={18} /> : <EyeOff size={18} />}
         </button>
       )}

       {/* Decorative Corners */}
       {isFocused && (
          <>
             <motion.div layoutId="c-tl" className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00ff88]" />
             <motion.div layoutId="c-tr" className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00ff88]" />
             <motion.div layoutId="c-br" className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00ff88]" />
             <motion.div layoutId="c-bl" className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00ff88]" />
          </>
       )}
    </div>
  </div>
)

// =============================================================================
// SECTION 4: MAIN LOGIN COMPONENT
// =============================================================================

export default function LoginPage() {
  // --- STATES ---
  const [state, formAction, isPending] = useActionState(login, initialState)
  const [booted, setBooted] = useState(false) // Trạng thái Boot
  const [formData, setFormData] = useState({ username: '', password: '', pin: '' })
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [useVirtualKeypad, setUseVirtualKeypad] = useState(false)
  const router = useRouter()

  // --- REFS ---
  const containerRef = useRef<HTMLDivElement>(null)

  // --- EFFECTS ---
  
  // Xử lý chuyển hướng khi thành công
  useEffect(() => {
    if (state?.success) {
      router.refresh()
      router.push('/dashboard')
    }
  }, [state?.success, router])

  // Parallax Logic 3D
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-500, 500], [5, -5])
  const rotateY = useTransform(mouseX, [-500, 500], [-5, 5])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  // Keypad Logic
  const handleKeypadInput = (k: string) => {
    if (k === 'C') setFormData(p => ({ ...p, pin: '' }))
    else if (k === '←') setFormData(p => ({ ...p, pin: p.pin.slice(0, -1) }))
    else if (formData.pin.length < 6) setFormData(p => ({ ...p, pin: p.pin + k }))
  }

  // --- RENDER BOOT SCREEN ---
  if (!booted) return <BiosBoot onComplete={() => setBooted(true)} />

  // --- RENDER MAIN INTERFACE ---
  return (
    <div 
      className="min-h-screen w-full bg-black text-white flex items-center justify-center relative overflow-hidden font-sans selection:bg-[#00ff88] selection:text-black perspective-1000"
      onMouseMove={handleMouseMove}
    >
      {/* 1. LAYER BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0b0b0b_0%,#000000_100%)] z-0" />
      <NeuralCanvas />
      
      {/* 2. LAYER DECORATION */}
      <div className="absolute top-10 left-10 flex flex-col gap-2 z-10 pointer-events-none">
         <div className="text-[#00ff88] text-xs font-mono">SECURE CONNECTION: ENCRYPTED</div>
         <div className="flex gap-1">
            <div className="w-10 h-1 bg-[#00ff88] animate-pulse" />
            <div className="w-2 h-1 bg-[#00ff88] opacity-50" />
            <div className="w-2 h-1 bg-[#00ff88] opacity-20" />
         </div>
      </div>

      <div className="absolute bottom-10 right-10 text-right z-10 pointer-events-none hidden md:block">
         <div className="text-gray-500 text-[10px] font-mono">SERVER NODE: ASIA-HK</div>
         <div className="text-gray-500 text-[10px] font-mono">LATENCY: 12ms</div>
      </div>

      {/* 3. MAIN CARD (PARALLAX) */}
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full max-w-7xl h-[800px] bg-black/70 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,255,136,0.1)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 group"
      >
        {/* Glow Effects on Card */}
        <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent opacity-50 pointer-events-none" />
        
        {/* --- CỘT TRÁI: 3D VISUALS (4 phần) --- */}
        <div className="hidden lg:flex lg:col-span-4 bg-[#050505] flex-col relative border-r border-white/5 p-10 justify-between overflow-hidden">
           {/* Background Grid */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
           
           {/* Header */}
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                 <Hexagon size={32} className="text-[#00ff88] animate-spin-slow" />
                 <span className="text-2xl font-bold tracking-[0.2em] text-white">QUOC<span className="text-[#00ff88]">BANK</span></span>
              </div>
              <div className="text-[10px] text-gray-500 font-mono tracking-widest pl-1">QUANTUM SECURITY GATEWAY</div>
           </div>

           {/* Center Piece: Tesseract */}
           <div className="relative z-10 flex justify-center perspective-1000">
              <TesseractCore />
           </div>

           {/* Bottom Widget: Threat Map */}
           <div className="relative z-10 h-40">
              <ThreatMonitor />
           </div>
        </div>

        {/* --- CỘT GIỮA: LOGIN FORM (5 phần) --- */}
        <div className="lg:col-span-5 p-8 lg:p-16 flex flex-col justify-center relative">
           
           {/* Header Form */}
           <div className="mb-10 text-center lg:text-left">
              <div className="inline-block px-3 py-1 rounded bg-[#00ff88]/10 text-[#00ff88] text-[10px] font-bold mb-4 border border-[#00ff88]/20">
                 ACCESS LEVEL: COMMANDER
              </div>
              <h2 className="text-4xl font-black mb-2 text-white tracking-tight">XÁC THỰC</h2>
              <p className="text-gray-400 text-sm">Vui lòng nhập khóa bảo mật để truy cập trung tâm chỉ huy.</p>
           </div>

           {/* Form Area */}
           <form action={formAction} className="space-y-6 relative z-20">
              <CyberInput 
                 icon={User} type="text" name="username" placeholder="MÃ ĐỊNH DANH" label="USERNAME"
                 value={formData.username}
                 onChange={(e: any) => setFormData({...formData, username: e.target.value})}
                 isFocused={focusedField === 'username'}
                 onFocus={() => setFocusedField('username')}
                 onBlur={() => setFocusedField(null)}
              />

              <CyberInput 
                 icon={Lock} type={showPassword ? "text" : "password"} name="password" placeholder="MẬT MÃ LƯỢNG TỬ" label="PASSWORD"
                 value={formData.password}
                 onChange={(e: any) => setFormData({...formData, password: e.target.value})}
                 isFocused={focusedField === 'password'}
                 onFocus={() => setFocusedField('password')}
                 onBlur={() => setFocusedField(null)}
                 showToggle={true}
                 onToggle={() => setShowPassword(!showPassword)}
              />

              {/* Advanced Options */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                 <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                    <div className="w-4 h-4 border border-gray-600 rounded flex items-center justify-center">
                       <input type="checkbox" className="appearance-none" />
                       <div className="w-2 h-2 bg-[#00ff88] rounded-sm opacity-0 check-anim" />
                    </div>
                    Ghi nhớ phiên (24h)
                 </label>
                 <button type="button" className="hover:text-[#00ff88] transition-colors flex items-center gap-1">
                    <HelpCircle size={12} /> Quên mật mã?
                 </button>
              </div>

              {/* Virtual Keypad Toggle */}
              <div>
                 <button 
                    type="button"
                    onClick={() => setUseVirtualKeypad(!useVirtualKeypad)}
                    className={`flex items-center gap-2 text-xs font-bold transition-colors ${useVirtualKeypad ? 'text-[#00ff88]' : 'text-gray-500 hover:text-white'}`}
                 >
                    <Keyboard size={14} /> {useVirtualKeypad ? 'TẮT BÀN PHÍM ẢO' : 'BẬT BÀN PHÍM ẢO'}
                 </button>
                 
                 <AnimatePresence>
                    {useVirtualKeypad && (
                       <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                       >
                          <VirtualKeypad onInput={handleKeypadInput} />
                          <div className="mt-2">
                             <CyberInput 
                                icon={Hash} type="password" name="pin" placeholder="PIN BẢO MẬT (6 SỐ)" label="SECURITY PIN"
                                value={formData.pin}
                                readOnly
                                isFocused={useVirtualKeypad}
                             />
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {/* Error Display */}
              <AnimatePresence>
                 {state?.error && (
                    <motion.div 
                       initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                       className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3"
                    >
                       <AlertTriangle size={16} className="text-red-500" />
                       <span className="text-xs text-red-400 font-mono">{state.error}</span>
                    </motion.div>
                 )}
              </AnimatePresence>

              {/* Submit Button */}
              <button 
                 disabled={isPending || state?.success}
                 className="w-full py-4 mt-4 bg-[#00ff88] hover:bg-[#00cc6a] text-black font-bold rounded-xl shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-50 disabled:shadow-none"
              >
                 <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                 {isPending || state?.success ? (
                    <>
                       {state?.success ? <CheckCircle2 size={20} /> : <Loader2 size={20} className="animate-spin" />}
                       <span>{state?.success ? 'ACCESS GRANTED' : 'VERIFYING CREDENTIALS...'}</span>
                    </>
                 ) : (
                    <>
                       <Scan size={20} /> XÁC THỰC & TRUY CẬP
                    </>
                 )}
              </button>
           </form>

           <div className="mt-8 text-center text-xs text-gray-500">
              Chưa có tài khoản? <Link href="/register" className="text-[#00ff88] font-bold hover:underline">Đăng ký thành viên</Link>
           </div>
        </div>

        {/* --- CỘT PHẢI: SYSTEM STATUS (3 phần) --- */}
        <div className="hidden lg:flex lg:col-span-3 bg-[#0a0a0a] border-l border-white/5 flex-col p-8 relative">
           <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">System Status</div>
           
           <div className="space-y-6">
              {/* Server Status */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                 <div className="flex items-center justify-between mb-2">
                    <Server size={16} className="text-blue-400" />
                    <span className="text-[10px] text-green-500">ONLINE</span>
                 </div>
                 <div className="text-xs text-gray-300 font-bold mb-1">Mainframe HK-09</div>
                 <div className="w-full bg-gray-800 h-1 rounded-full"><div className="w-[98%] h-full bg-blue-500 rounded-full" /></div>
              </div>

              {/* Database Status */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                 <div className="flex items-center justify-between mb-2">
                    <Database size={16} className="text-purple-400" />
                    <span className="text-[10px] text-green-500">SYNCED</span>
                 </div>
                 <div className="text-xs text-gray-300 font-bold mb-1">User Ledger</div>
                 <div className="w-full bg-gray-800 h-1 rounded-full"><div className="w-[100%] h-full bg-purple-500 rounded-full" /></div>
              </div>

              {/* Encryption Status */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                 <div className="flex items-center justify-between mb-2">
                    <ShieldCheck size={16} className="text-[#00ff88]" />
                    <span className="text-[10px] text-green-500">ACTIVE</span>
                 </div>
                 <div className="text-xs text-gray-300 font-bold mb-1">Quantum Encryption</div>
                 <div className="text-[9px] text-gray-500 font-mono">KEY: ***-***-X92</div>
              </div>
           </div>

           {/* AI Assistant Bubble */}
           <div className="mt-auto bg-[#00ff88]/10 border border-[#00ff88]/20 p-4 rounded-xl relative">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-black border border-[#00ff88] rounded-full flex items-center justify-center">
                 <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping" />
              </div>
              <p className="text-[10px] text-[#00ff88] leading-relaxed">
                 "Chào Chỉ huy. Hệ thống phát hiện bạn đang đăng nhập từ một thiết bị mới. Vui lòng sử dụng Bàn phím ảo để tăng cường bảo mật."
              </p>
           </div>
        </div>

      </motion.div>

      {/* Helper Icons definitions for missing imports */}
      {/* (Đã thêm đủ icon vào phần import ở trên để tránh lỗi) */}
    </div>
  )
}

// Icons bổ sung nếu thiếu (tránh lỗi build)
const Hash = ({ size, className }: any) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
)
const HelpCircle = ({ size }: any) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
)