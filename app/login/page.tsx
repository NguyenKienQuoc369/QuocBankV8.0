'use client'

/**
 * =================================================================================================
 * PROJECT: QUOCBANK INTERSTELLAR - IDENTITY CREATION STATION (REGISTER V5.0 - TITAN CLASS)
 * LINE COUNT: ~1200 Lines
 * COMPLEXITY: MAXIMUM
 * STATUS: CLASSIFIED
 * -------------------------------------------------------------------------------------------------
 * ARCHITECTURE OVERVIEW:
 * 1. CORE ENGINE: Next.js Client Component + Server Actions
 * 2. VISUAL LAYER: Canvas Starfield + SVG Procedural Generation + Framer Motion Physics
 * 3. SECURITY LAYER: Real-time Entropy Calculator + Simulated Biometric Handshake
 * 4. DATA LAYER: Local State Management for Multi-step Wizard (5 Stages)
 * =================================================================================================
 */

import React, { useState, useActionState, useEffect, useRef, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  motion, AnimatePresence, useMotionValue, useTransform, useSpring, useAnimation 
} from 'framer-motion'
import { register } from '@/app/actions/auth'

// --- ICON SYSTEM IMPORT (LUCIDE REACT) ---
import { 
  User, Mail, Lock, Loader2, Rocket, 
  CreditCard, ShieldCheck, CheckCircle2, 
  Fingerprint, Scan, AlertTriangle, ArrowRight, 
  Cpu, Globe, ChevronRight, ChevronLeft, Terminal, Check,
  Eye, EyeOff, RefreshCw, Server, Wifi, Activity,
  FileText, UploadCloud, Smartphone, Crosshair, 
  Binary, Key, ShieldAlert, Award, MousePointer2
} from 'lucide-react'

// =============================================================================
// SECTION 1: SYSTEM CONSTANTS & LORE DATA (DỮ LIỆU GIẢ LẬP)
// =============================================================================

const MAX_STEPS = 4 // Identity -> Security -> Avatar/KYC -> Contract

const SERVER_NODES = [
  { id: 'SVR-01', name: 'Alpha Centauri Prime', region: 'Deep Space', latency: '4ms', load: 45 },
  { id: 'SVR-02', name: 'Mars Colony Hub', region: 'Solar System', latency: '12ms', load: 78 },
  { id: 'SVR-03', name: 'Europa Ice Station', region: 'Jupiter', latency: '24ms', load: 32 },
  { id: 'SVR-04', name: 'Titan Mining Rig', region: 'Saturn', latency: '45ms', load: 89 },
  { id: 'SVR-05', name: 'Kepler-186f Outpost', region: 'Outer Rim', latency: '110ms', load: 12 },
]

const TERMS_CONTENT = `
HIẾN PHÁP NGÂN HÀNG ĐA VŨ TRỤ (QUOCBANK INTERSTELLAR CONSTITUTION)
Phiên bản: 2099.4.2

ĐIỀU 1: QUYỀN LỢI & NGHĨA VỤ CÔNG DÂN
1.1. Mọi công dân khi khởi tạo "Khoang Cá Nhân" (Account) tại QuocBank đều được bảo hộ bởi Liên Minh Ngân Hàng Thiên Hà.
1.2. Tài sản số (Credits, Quantum Tokens) được lưu trữ tại Void Dimension (Chiều không gian thứ 4) để đảm bảo an toàn tuyệt đối trước các vụ nổ siêu tân tinh.
1.3. Công dân cam kết không sử dụng tài khoản để tài trợ cho phe Kháng Chiến hoặc mua bán Vũ khí Phản vật chất trái phép.

ĐIỀU 2: GIAO THỨC BẢO MẬT
2.1. QuocBank sử dụng mã hóa lượng tử 4096-bit. Trong trường hợp mất khóa bí mật (Private Key), chúng tôi không thể khôi phục tài sản.
2.2. Việc đăng nhập từ hành tinh lạ (Chưa đăng ký trong Hệ Mặt Trời) sẽ kích hoạt quy trình cách ly tài khoản trong 24 giờ Trái Đất.

ĐIỀU 3: PHÍ & LÃI SUẤT
3.1. Phí duy trì đường truyền Warp: 0.0001% mỗi giao dịch.
3.2. Lãi suất tiết kiệm gửi tại lỗ đen (Blackhole Staking) được tính theo độ giãn nở thời gian thực tại vị trí của người gửi.

(Cuộn xuống cuối để ký xác nhận bằng dấu vân tay điện tử...)
`

// =============================================================================
// SECTION 2: UTILITY FUNCTIONS (CÔNG CỤ TÍNH TOÁN)
// =============================================================================

// Tính độ mạnh mật khẩu (Entropy Score)
const calculateEntropy = (password: string) => {
  let score = 0
  if (!password) return { score: 0, label: 'TRỐNG', color: 'bg-gray-800' }
  
  if (password.length > 8) score += 20
  if (password.length > 12) score += 20
  if (/[A-Z]/.test(password)) score += 15
  if (/[a-z]/.test(password)) score += 15
  if (/[0-9]/.test(password)) score += 15
  if (/[^A-Za-z0-9]/.test(password)) score += 15

  if (score < 40) return { score, label: 'YẾU', color: 'bg-red-500' }
  if (score < 70) return { score, label: 'TRUNG BÌNH', color: 'bg-yellow-500' }
  if (score < 90) return { score, label: 'MẠNH', color: 'bg-blue-500' }
  return { score, label: 'SIÊU CẤP', color: 'bg-[#00ff88]' }
}

// Tạo mã màu Hex ngẫu nhiên cho Avatar
const generateColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

// =============================================================================
// SECTION 3: SUB-COMPONENTS (MODULES)
// =============================================================================

// 3.1. STARFIELD CANVAS (Nền sao tối ưu hiệu năng - Fix Flickering)
const StarFieldCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    
    const stars = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.5,
      speed: Math.random() * 0.5 + 0.1
    }))

    let frameId: number
    const animate = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#ffffff'
      
      stars.forEach(s => {
        s.y -= s.speed
        if (s.y < 0) s.y = h
        ctx.globalAlpha = Math.random() * 0.5 + 0.3
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()
      })
      
      frameId = requestAnimationFrame(animate)
    }
    
    animate()
    
    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />
}

// 3.2. CYBER INPUT (Ô nhập liệu chống chớp)
const CyberInput = ({ 
  icon: Icon, type, name, placeholder, label, 
  value, onChange, onFocus, onBlur, isFocused, error 
}: any) => {
  return (
    <div className="space-y-1.5 group relative transform-gpu">
      <div className="flex justify-between items-end px-1">
         <label className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${isFocused ? 'text-[#00ff88]' : 'text-gray-500'}`}>
            {label}
         </label>
         {error && (
            <motion.div 
               initial={{ opacity: 0, x: 10 }} 
               animate={{ opacity: 1, x: 0 }} 
               className="text-[9px] text-red-500 font-bold flex items-center gap-1"
            >
               <AlertTriangle size={10} /> {error}
            </motion.div>
         )}
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
            className={`w-full bg-[#0a0a0a] border-2 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none transition-all duration-300 font-mono text-sm shadow-inner
               ${error 
                  ? 'border-red-500/50 focus:border-red-500' 
                  : isFocused 
                     ? 'border-[#00ff88]/50 shadow-[0_0_15px_rgba(0,255,136,0.1)]' 
                     : 'border-white/10 hover:border-white/20'
               }
            `}
         />
         
         {/* Decorative Corners - Chỉ hiện khi Focus để giảm tải */}
         <AnimatePresence>
            {isFocused && (
               <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-0 rounded-xl"
               >
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00ff88]" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00ff88]" />
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  )
}

// 3.3. PASSWORD ANALYZER (Phân tích mật khẩu)
const PasswordAnalyzer = ({ password }: { password: string }) => {
  const { score, label, color } = calculateEntropy(password)
  const width = `${Math.min(score, 100)}%`

  return (
    <div className="mt-3 p-3 bg-white/[0.03] rounded-lg border border-white/5 space-y-2">
       <div className="flex justify-between text-[9px] font-mono text-gray-400">
          <span>ENTROPY_SCORE: {score}/100</span>
          <span className={`${color.replace('bg-', 'text-')} font-bold`}>{label}</span>
       </div>
       
       {/* Progress Bar */}
       <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
             className={`h-full ${color}`}
             initial={{ width: 0 }}
             animate={{ width }}
             transition={{ type: "spring", stiffness: 50 }}
          />
       </div>

       {/* Security Checks */}
       <div className="grid grid-cols-2 gap-1 mt-1">
          {[
             { check: password.length >= 8, text: "8+ Ký tự" },
             { check: /[A-Z]/.test(password), text: "Chữ hoa" },
             { check: /[0-9]/.test(password), text: "Số" },
             { check: /[^A-Za-z0-9]/.test(password), text: "Ký tự đặc biệt" }
          ].map((item, i) => (
             <div key={i} className={`flex items-center gap-1 text-[9px] ${item.check ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className={`w-1 h-1 rounded-full ${item.check ? 'bg-[#00ff88]' : 'bg-gray-700'}`} />
                {item.text}
             </div>
          ))}
       </div>
    </div>
  )
}

// 3.4. SERVER SELECTOR (Chọn máy chủ)
const ServerSelector = ({ selected, onSelect }: any) => {
  return (
    <div className="space-y-3">
       <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block px-1">
          CHỌN NODE KHỞI TẠO
       </label>
       <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
          {SERVER_NODES.map((node) => (
             <button
                key={node.id}
                type="button"
                onClick={() => onSelect(node.id)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left group
                   ${selected === node.id 
                      ? 'bg-[#00ff88]/10 border-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.1)]' 
                      : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/5'
                   }
                `}
             >
                <div className="flex items-center gap-3">
                   <div className={`p-1.5 rounded-lg ${selected === node.id ? 'bg-[#00ff88] text-black' : 'bg-white/10 text-gray-400'}`}>
                      <Server size={14} />
                   </div>
                   <div>
                      <div className={`text-xs font-bold ${selected === node.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{node.name}</div>
                      <div className="text-[9px] text-gray-600 font-mono">{node.region}</div>
                   </div>
                </div>
                <div className="text-right">
                   <div className={`text-[10px] font-mono ${parseInt(node.latency) < 20 ? 'text-[#00ff88]' : 'text-yellow-500'}`}>
                      {node.latency}
                   </div>
                   <div className="text-[8px] text-gray-600">PING</div>
                </div>
             </button>
          ))}
       </div>
    </div>
  )
}

// 3.5. AVATAR GENERATOR (Tạo Avatar SVG)
const AvatarGenerator = ({ seed }: { seed: string }) => {
  // Tạo hình dạng dựa trên tên
  const color1 = generateColor(seed + 'A')
  const color2 = generateColor(seed + 'B')
  const rotation = seed.length * 15

  return (
    <div className="w-32 h-32 rounded-full border-4 border-white/10 bg-black flex items-center justify-center relative overflow-hidden group">
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
       
       <motion.div 
          className="w-full h-full relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
       >
          <svg viewBox="0 0 100 100" className="w-full h-full p-4">
             <defs>
                <linearGradient id={`grad-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" stopColor={color1} />
                   <stop offset="100%" stopColor={color2} />
                </linearGradient>
             </defs>
             
             <path 
                d="M50 5 L95 25 L95 75 L50 95 L5 75 L5 25 Z" 
                fill="none" 
                stroke={`url(#grad-${seed})`} 
                strokeWidth="2" 
                className="animate-pulse"
             />
             <circle cx="50" cy="50" r="20" fill={`url(#grad-${seed})`} opacity="0.8" />
             <path d="M50 0 V100 M0 50 H100" stroke={`url(#grad-${seed})`} strokeWidth="0.5" opacity="0.3" />
          </svg>
       </motion.div>

       {/* Scan line */}
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-4 w-full animate-scan pointer-events-none" />
    </div>
  )
}

// 3.6. LEGAL TERMINAL (Hợp đồng cuộn)
const LegalTerminal = ({ onAgree, agreed }: { onAgree: (v: boolean) => void, agreed: boolean }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canSign, setCanSign] = useState(false)

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    // Cho phép ký nếu cuộn xuống gần cuối
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setCanSign(true)
    }
  }

  return (
    <div className="space-y-4">
       <div className="bg-black/60 rounded-xl border border-white/10 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-2">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <FileText size={14} /> TERMS_OF_SERVICE.DOC
             </div>
             {!canSign && <span className="text-[9px] text-yellow-500 font-mono animate-pulse">SCROLL TO READ</span>}
          </div>
          
          <div 
             ref={scrollRef}
             onScroll={handleScroll}
             className="h-40 overflow-y-auto custom-scrollbar text-[10px] text-gray-400 font-mono leading-relaxed whitespace-pre-wrap"
          >
             {TERMS_CONTENT}
          </div>
       </div>

       <button 
          type="button"
          onClick={() => canSign && onAgree(!agreed)}
          disabled={!canSign}
          className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 group
             ${!canSign 
                ? 'border-white/5 bg-white/5 text-gray-600 cursor-not-allowed' 
                : agreed 
                   ? 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]' 
                   : 'border-white/20 hover:border-white/40 text-gray-300'
             }
          `}
       >
          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreed ? 'bg-[#00ff88] border-[#00ff88]' : 'border-current'}`}>
             {agreed && <Check size={14} className="text-black" />}
          </div>
          <span className="text-sm font-bold">TÔI ĐỒNG Ý GIA NHẬP</span>
       </button>
    </div>
  )
}

// 3.7. HOLOGRAM ID CARD (Live Preview - Fix Texture)
// Sử dụng CSS Gradient thay vì ảnh nặng để tránh flickering
const HologramIDCard = ({ data, step }: any) => {
  return (
    <div className="relative w-full max-w-sm aspect-[1.6/1] perspective-1000 group">
      <motion.div
        className="w-full h-full bg-[#0a0a0a] rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl"
        style={{
           background: `
              linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(0,0,0,0.9) 100%),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 20px)
           `
        }}
        animate={{ rotateY: [0, 2, 0, -2, 0], rotateX: [0, -2, 0, 2, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Holographic Sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-150%] animate-[shimmer_5s_infinite]" />

        <div className="p-6 h-full flex flex-col justify-between relative z-10">
           {/* Header */}
           <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00ff88] to-emerald-800 p-[1px]">
                    <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
                       <Cpu size={20} className="text-[#00ff88]" />
                    </div>
                 </div>
                 <div>
                    <div className="text-[10px] text-[#00ff88] font-black tracking-widest">QUOCBANK</div>
                    <div className="text-[8px] text-gray-500 font-mono">UNIVERSAL ACCESS</div>
                 </div>
              </div>
              <Fingerprint size={32} className="text-white/20" />
           </div>

           {/* User Details */}
           <div className="space-y-4">
              <div className="flex gap-4 items-center">
                 {/* Mini Avatar Preview */}
                 <div className="w-16 h-16 rounded-full border border-white/20 bg-black overflow-hidden flex items-center justify-center">
                    {data.username ? (
                       <div className="w-full h-full scale-150"><AvatarGenerator seed={data.username} /></div>
                    ) : (
                       <User size={24} className="text-gray-700" />
                    )}
                 </div>
                 <div>
                    <div className="text-[8px] text-gray-500 uppercase tracking-wider mb-1">COMMANDER</div>
                    <div className="text-lg font-bold text-white tracking-wide truncate max-w-[180px]">
                       {data.fullName || "UNKNOWN"}
                    </div>
                    <div className="text-xs text-[#00ff88] font-mono">
                       @{data.username || "..."}
                    </div>
                 </div>
              </div>
           </div>

           {/* Footer Stats */}
           <div className="flex justify-between items-end border-t border-white/10 pt-3">
              <div>
                 <div className="text-[8px] text-gray-500">SERVER NODE</div>
                 <div className="text-[10px] font-mono text-white">{SERVER_NODES.find(n => n.id === data.server)?.name || "AUTO"}</div>
              </div>
              <div>
                 <div className="text-[8px] text-gray-500 text-right">SECURITY LEVEL</div>
                 <div className="flex gap-1 justify-end">
                    {[1,2,3,4].map(i => (
                       <div key={i} className={`w-1.5 h-3 rounded-sm ${i <= step ? 'bg-[#00ff88]' : 'bg-gray-800'}`} />
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  )
}

// =============================================================================
// SECTION 4: MAIN PAGE LOGIC (THE BRAIN)
// =============================================================================

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, initialState)
  const router = useRouter()
  
  // --- STATES ---
  const [step, setStep] = useState(1) // 1: Identity, 2: Security, 3: KYC, 4: Contract
  const [formData, setFormData] = useState({
     fullName: '',
     username: '',
     email: '',
     password: '',
     confirmPassword: '',
     server: SERVER_NODES[0].id,
     agreed: false
  })
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Xử lý chuyển hướng
  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => router.push('/login?success=true'), 3000)
      return () => clearTimeout(t)
    }
  }, [state?.success, router])

  // --- HANDLERS ---
  const handleNext = () => {
     // Validate từng bước
     const newErrors: Record<string, string> = {}
     
     if (step === 1) {
        if (!formData.fullName) newErrors.fullName = "Tên chỉ huy là bắt buộc"
        if (!formData.username) newErrors.username = "Mã định danh thiếu"
        if (!formData.email) newErrors.email = "Email liên lạc thiếu"
     }
     
     if (step === 2) {
        if (formData.password.length < 8) newErrors.password = "Mật mã quá yếu (cần 8+ ký tự)"
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mật mã xác nhận không khớp"
     }

     if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
     }
     
     setErrors({})
     if (step < MAX_STEPS) setStep(prev => prev + 1)
  }

  const handlePrev = () => setStep(prev => prev - 1)

  // Animation Variants
  const slideVariants = {
     enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
     center: { x: 0, opacity: 1 },
     exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 })
  }

  return (
    <div className="min-h-screen w-full bg-[#020202] text-white flex items-center justify-center relative overflow-hidden font-sans selection:bg-[#00ff88] selection:text-black">
      
      {/* 1. LAYER 0: BACKGROUND ENGINE */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00331b] via-[#050505] to-black z-0" />
      <StarFieldCanvas />
      
      {/* 2. LAYER 1: MAIN INTERFACE */}
      <div className="relative z-10 w-full max-w-7xl h-auto min-h-[800px] flex flex-col lg:flex-row rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
         
         {/* === LEFT COLUMN: VISUALIZER (40%) === */}
         <div className="lg:w-5/12 bg-[#050505] border-r border-white/5 relative flex flex-col p-10 justify-between overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
            
            {/* Top Brand */}
            <div className="relative z-10">
               <Link href="/" className="inline-flex items-center gap-3 text-white mb-2 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded bg-[#00ff88] flex items-center justify-center text-black font-bold">Q</div>
                  <span className="font-bold tracking-widest">QUOCBANK</span>
               </Link>
               <div className="text-[10px] text-gray-500 font-mono">RECRUITMENT TERMINAL v9.0</div>
            </div>

            {/* Center: Live Hologram Preview */}
            <div className="relative z-10 flex flex-col items-center">
               <div className="mb-8 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-gray-400 mb-4">
                     <Activity size={12} className="text-[#00ff88] animate-pulse" /> LIVE PREVIEW
                  </div>
                  <HologramIDCard data={formData} step={step} />
               </div>

               {/* Step Progress Visual */}
               <div className="w-full max-w-xs space-y-4">
                  {['IDENTITY', 'SECURITY', 'AVATAR_KYC', 'PROTOCOL'].map((label, i) => (
                     <div key={i} className={`flex items-center gap-3 text-xs transition-colors duration-500 ${i + 1 <= step ? 'text-[#00ff88]' : 'text-gray-700'}`}>
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${i + 1 <= step ? 'border-[#00ff88] bg-[#00ff88]/10' : 'border-gray-800'}`}>
                           {i + 1 < step ? <Check size={12} /> : <span className="text-[9px]">{i+1}</span>}
                        </div>
                        <div className="font-bold tracking-widest">{label}</div>
                        {i + 1 === step && <motion.div layoutId="activeStep" className="w-1.5 h-1.5 bg-[#00ff88] rounded-full ml-auto animate-pulse" />}
                     </div>
                  ))}
               </div>
            </div>

            {/* Bottom Status */}
            <div className="relative z-10 text-[9px] text-gray-600 font-mono flex justify-between">
               <span>SECURE_LINK: ESTABLISHED</span>
               <span>ENC: AES-4096</span>
            </div>
         </div>

         {/* === RIGHT COLUMN: INTERACTIVE FORM (60%) === */}
         <div className="lg:w-7/12 p-8 lg:p-16 relative flex flex-col">
            
            {/* Header */}
            <div className="mb-10">
               <h1 className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tighter">
                  KHỞI TẠO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-emerald-500">HỒ SƠ</span>
               </h1>
               <p className="text-gray-400 text-sm max-w-md">Hoàn tất các bước xác thực để nhận quyền truy cập vào mạng lưới tài chính ngân hà.</p>
            </div>

            {/* MAIN FORM WIZARD */}
            <div className="flex-1 relative">
               <form action={formAction} className="h-full flex flex-col justify-between">
                  <div className="min-h-[350px]">
                     <AnimatePresence mode="wait" custom={1}>
                        
                        {/* STEP 1: IDENTITY */}
                        {step === 1 && (
                           <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                              <CyberInput 
                                 icon={User} label="HỌ VÀ TÊN CHỈ HUY" name="fullName" placeholder="NGUYEN VAN A"
                                 value={formData.fullName}
                                 onChange={(e: any) => setFormData({...formData, fullName: e.target.value})}
                                 isFocused={focusedField === 'fullName'}
                                 onFocus={() => setFocusedField('fullName')}
                                 onBlur={() => setFocusedField(null)}
                                 error={errors.fullName}
                              />
                              <CyberInput 
                                 icon={Mail} label="EMAIL LIÊN LẠC" name="email" type="email" placeholder="commander@space.com"
                                 value={formData.email}
                                 onChange={(e: any) => setFormData({...formData, email: e.target.value})}
                                 isFocused={focusedField === 'email'}
                                 onFocus={() => setFocusedField('email')}
                                 onBlur={() => setFocusedField(null)}
                                 error={errors.email}
                              />
                              <CyberInput 
                                 icon={Terminal} label="MÃ ĐỊNH DANH (USERNAME)" name="username" placeholder="commander_01"
                                 value={formData.username}
                                 onChange={(e: any) => setFormData({...formData, username: e.target.value})}
                                 isFocused={focusedField === 'username'}
                                 onFocus={() => setFocusedField('username')}
                                 onBlur={() => setFocusedField(null)}
                                 error={errors.username}
                              />
                           </motion.div>
                        )}

                        {/* STEP 2: SECURITY */}
                        {step === 2 && (
                           <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                              <div>
                                 <CyberInput 
                                    icon={Key} label="MẬT MÃ LƯỢNG TỬ" name="password" type="password" placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e: any) => setFormData({...formData, password: e.target.value})}
                                    isFocused={focusedField === 'password'}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    error={errors.password}
                                 />
                                 <PasswordAnalyzer password={formData.password} />
                              </div>
                              <CyberInput 
                                 icon={ShieldCheck} label="XÁC NHẬN MẬT MÃ" name="confirmPassword" type="password" placeholder="••••••••"
                                 value={formData.confirmPassword}
                                 onChange={(e: any) => setFormData({...formData, confirmPassword: e.target.value})}
                                 isFocused={focusedField === 'confirmPassword'}
                                 onFocus={() => setFocusedField('confirmPassword')}
                                 onBlur={() => setFocusedField(null)}
                                 error={errors.confirmPassword}
                              />
                           </motion.div>
                        )}

                        {/* STEP 3: AVATAR & SERVER */}
                        {step === 3 && (
                           <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                              <div className="flex gap-8 items-center bg-white/5 p-6 rounded-2xl border border-white/10">
                                 <AvatarGenerator seed={formData.username || 'default'} />
                                 <div className="flex-1 space-y-2">
                                    <h3 className="font-bold text-white">AVATAR ĐƯỢC TẠO TỰ ĐỘNG</h3>
                                    <p className="text-xs text-gray-400">Hệ thống đã phân tích mã gen số của bạn và tạo ra hình đại diện duy nhất này.</p>
                                    <button type="button" className="text-xs text-[#00ff88] flex items-center gap-1 hover:underline">
                                       <RefreshCw size={12} /> Tái tạo lại
                                    </button>
                                 </div>
                              </div>
                              
                              <ServerSelector 
                                 selected={formData.server} 
                                 onSelect={(id: string) => setFormData({...formData, server: id})} 
                              />
                           </motion.div>
                        )}

                        {/* STEP 4: CONTRACT & SUBMIT */}
                        {step === 4 && (
                           <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
                              {state?.success ? (
                                 <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <motion.div 
                                       initial={{ scale: 0 }} animate={{ scale: 1 }} 
                                       className="w-20 h-20 bg-[#00ff88]/20 rounded-full flex items-center justify-center mb-4 text-[#00ff88]"
                                    >
                                       <CheckCircle2 size={40} />
                                    </motion.div>
                                    <h2 className="text-2xl font-bold text-white mb-1">CHÀO MỪNG CHỈ HUY!</h2>
                                    <p className="text-gray-400 text-sm">Khoang cá nhân của bạn đang được khởi tạo...</p>
                                 </div>
                              ) : (
                                 <>
                                    <LegalTerminal agreed={formData.agreed} onAgree={(v) => setFormData({...formData, agreed: v})} />
                                    
                                    {/* Hidden Inputs for Form Submission */}
                                    <input type="hidden" name="fullName" value={formData.fullName} />
                                    <input type="hidden" name="email" value={formData.email} />
                                    <input type="hidden" name="username" value={formData.username} />
                                    <input type="hidden" name="password" value={formData.password} />
                                    
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg flex gap-3 items-start">
                                       <AlertTriangle size={16} className="text-yellow-500 mt-0.5" />
                                       <p className="text-[10px] text-yellow-200/80 leading-relaxed">
                                          CẢNH BÁO: Sau khi xác nhận, danh tính sinh trắc học của bạn sẽ được ghi vĩnh viễn vào Blockchain Ngân Hà. Hành động này không thể đảo ngược.
                                       </p>
                                    </div>
                                 </>
                              )}
                           </motion.div>
                        )}

                     </AnimatePresence>
                  </div>

                  {/* NAVIGATION CONTROLS */}
                  <div className="pt-8 border-t border-white/10 flex gap-4 mt-auto">
                     {step > 1 && !state?.success && (
                        <button 
                           type="button" 
                           onClick={handlePrev}
                           className="px-6 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 font-bold transition-all text-sm"
                        >
                           QUAY LẠI
                        </button>
                     )}
                     
                     {step < MAX_STEPS ? (
                        <button 
                           type="button" 
                           onClick={handleNext}
                           className="flex-1 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group text-sm"
                        >
                           TIẾP TỤC <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                        </button>
                     ) : (
                        !state?.success && (
                           <button 
                              type="submit"
                              disabled={isPending || !formData.agreed}
                              className="flex-1 py-4 bg-[#00ff88] text-black font-bold rounded-xl hover:bg-[#00cc6a] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,255,136,0.3)] disabled:opacity-50 disabled:shadow-none group relative overflow-hidden text-sm"
                           >
                              <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                              {isPending ? <Loader2 className="animate-spin" /> : <Rocket size={20} />}
                              <span>KHỞI TẠO TÀI KHOẢN</span>
                           </button>
                        )
                     )}
                  </div>
               </form>
            </div>
         </div>

      </div>
    </div>
  )
}