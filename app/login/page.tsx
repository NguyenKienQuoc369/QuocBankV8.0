'use client'

/**
 * =================================================================================================
 * PROJECT: QUOCBANK INTERSTELLAR - CITIZENSHIP PROCESSING UNIT (REGISTER V12.1)
 * STATUS: TYPE-SAFE STABLE
 * COMPLEXITY: EXTREME
 * -------------------------------------------------------------------------------------------------
 * MODULES:
 * 1. CORE ENGINE: React State Machine for Multi-step Wizard.
 * 2. VISUAL LAYER: Canvas Starfield + SVG Procedural Generation.
 * 3. HOLOGRAPHIC PROJECTION: Real-time 3D Card rendering.
 * 4. SECURITY PROTOCOLS: Entropy calculation & Biometric simulation.
 * 5. NETWORK LAYER: Simulated Server Node selection & Latency ping.
 * =================================================================================================
 */

import React, { useState, useActionState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useTransform,
  Variants // <--- IMPORT QUAN TRỌNG ĐỂ FIX LỖI
} from 'framer-motion'
import { register } from '@/app/actions/auth'

// --- ICON SYSTEM (LUCIDE REACT) ---
import { 
  User, Mail, Lock, Loader2, Rocket, 
  CreditCard, ShieldCheck, CheckCircle2, 
  Fingerprint, Scan, AlertTriangle, ArrowRight, 
  Cpu, Globe, ChevronRight, ChevronLeft, Terminal, Check,
  RefreshCw, Server, Wifi, Activity,
  FileText, Smartphone, 
  Key, Radio
} from 'lucide-react'

// =============================================================================
// SECTION 1: SYSTEM DATA & CONFIGURATION
// =============================================================================

const MAX_STEPS = 4 // Identity -> Server -> Security -> Protocol

const initialState = {
  message: '',
  error: '',
  success: false
}

// Dữ liệu máy chủ giả lập (Server Nodes)
const SERVER_NODES = [
  { id: 'HK-01', name: 'ASIA PRIME', region: 'Earth', latency: 4, status: 'OPTIMAL', color: '#00ff88' },
  { id: 'EU-09', name: 'EUROPA HUB', region: 'Jupiter', latency: 450, status: 'STABLE', color: '#3b82f6' },
  { id: 'US-05', name: 'MARS COLONY', region: 'Mars', latency: 120, status: 'BUSY', color: '#ef4444' },
  { id: 'VOID-X', name: 'DEEP VOID', region: 'Unknown', latency: 999, status: 'SECURE', color: '#a855f7' },
]

// Dữ liệu xếp hạng thẻ (Card Tiers)
const CARD_TIERS = [
  { id: 'standard', name: 'STANDARD', color: '#00ff88', minBalance: 0 },
  { id: 'gold', name: 'GOLD', color: '#eab308', minBalance: 5000 },
  { id: 'infinite', name: 'INFINITE', color: '#a855f7', minBalance: 50000 },
]

// Nội dung điều khoản
const LEGAL_TEXT = `
HIẾN PHÁP NGÂN HÀNG LIÊN SAO (INTERSTELLAR BANKING TERMS v9.2)

1. ĐỊNH DANH SỐ
1.1. Bằng việc khởi tạo hồ sơ này, Công dân đồng ý ủy quyền cho QuocBank thu thập và mã hóa dữ liệu sinh trắc học (mống mắt, vân tay, sóng não) để tạo khóa bảo mật Private Key.
1.2. Danh tính số này có giá trị pháp lý trên 98,000 hành tinh thuộc Liên Minh Ngân Hàng.

2. QUYỀN SỞ HỮU TÀI SẢN
2.1. Tài sản được lưu trữ tại Void Dimension (Chiều không gian thứ 4). QuocBank cam kết bảo mật tuyệt đối trước các thảm họa vật lý (Vụ nổ siêu tân tinh, Hố đen nuốt chửng).
2.2. Trong trường hợp Công dân mất khả năng nhận thức hoặc du hành thời gian quá 50 năm, tài sản sẽ tự động chuyển vào quỹ ủy thác lạnh (Cold Trust).

3. PHÍ DỊCH VỤ & GAS
3.1. Phí chuyển khoản trong cùng Hệ Mặt Trời: 0 Credits.
3.2. Phí chuyển khoản liên thiên hà (Warp Transfer): 0.0001% giá trị giao dịch.
3.3. Phí duy trì thẻ Hologram: Miễn phí trọn đời cho công dân hạng Infinite.

4. TRÁCH NHIỆM BẢO MẬT
4.1. Công dân tự chịu trách nhiệm bảo quản mã PIN và thiết bị truy cập.
4.2. QuocBank sử dụng AI Sentinel để giám sát giao dịch 24/7. Mọi hành vi rửa tiền hoặc tài trợ cho Phe Kháng Chiến sẽ bị đóng băng tài khoản tức thì.

5. CAM KẾT KHÔNG GIAN
5.1. Không sử dụng tài khoản để mua bán Vũ khí Phản vật chất trái phép.
5.2. Không thực hiện các giao dịch thao túng thị trường năng lượng tối (Dark Energy).

(Vui lòng cuộn xuống cuối để kích hoạt nút chấp nhận...)
`

// =============================================================================
// SECTION 2: ANIMATION VARIANTS (ĐÃ THÊM TYPE VARIANTS)
// =============================================================================

const slideVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 50 : -50, opacity: 0 })
}

const cardVariants: Variants = {
  hidden: { rotateX: 90, opacity: 0 },
  visible: { 
    rotateX: 0, opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
  hover: { 
    scale: 1.05,
    rotateY: 5,
    boxShadow: "0 0 50px rgba(0,255,136,0.3)"
  }
}

// =============================================================================
// SECTION 3: SUB-COMPONENTS (THE BUILDING BLOCKS)
// =============================================================================

// 3.1. STARFIELD ENGINE (Nền sao tối ưu hóa)
const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    if (!ctx) return
    
    let w = cvs.width = window.innerWidth
    let h = cvs.height = window.innerHeight
    const stars = Array.from({length: 100}).map(() => ({
      x: Math.random() * w, y: Math.random() * h,
      s: Math.random() * 2, v: Math.random() * 0.5 + 0.1
    }))

    let fid: number
    const loop = () => {
      ctx.clearRect(0,0,w,h)
      ctx.fillStyle = '#ffffff'
      stars.forEach(st => {
        st.y -= st.v
        if(st.y < 0) st.y = h
        ctx.globalAlpha = Math.random() * 0.5 + 0.1
        ctx.beginPath()
        ctx.arc(st.x, st.y, st.s, 0, Math.PI*2)
        ctx.fill()
      })
      fid = requestAnimationFrame(loop)
    }
    loop()
    
    const onResize = () => { w = cvs.width = window.innerWidth; h = cvs.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(fid); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 opacity-30 pointer-events-none" />
}

// 3.2. LIVE HOLOGRAPHIC CARD (Thẻ 3D)
const HologramCard = ({ data, tier }: { data: any, tier: string }) => {
  const selectedTier = CARD_TIERS.find(t => t.id === tier) || CARD_TIERS[0]
  
  return (
    <div className="relative w-full max-w-sm aspect-[1.58/1] perspective-1000 group cursor-pointer">
      <motion.div
        variants={cardVariants}
        initial="hidden" animate="visible" whileHover="hover"
        className="w-full h-full rounded-2xl relative overflow-hidden border border-white/20 shadow-2xl transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(5,5,5,1) 100%)`,
          borderColor: selectedTier.color
        }}
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[size:200%_200%] animate-[shimmer_3s_linear_infinite]" />
        
        {/* Hologram Overlay */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ 
            background: `radial-gradient(circle at 50% 50%, ${selectedTier.color}, transparent 70%)`,
            mixBlendMode: 'screen' 
          }} 
        />

        {/* Card Content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                  <Cpu size={20} style={{ color: selectedTier.color }} />
               </div>
               <div>
                  <div className="text-[10px] font-black tracking-[0.2em] text-white">QUOCBANK</div>
                  <div className="text-[8px] font-mono text-gray-400" style={{ color: selectedTier.color }}>{selectedTier.name} CLASS</div>
               </div>
            </div>
            <Wifi size={24} className="text-white/20 rotate-90" />
          </div>

          {/* Chip & NFC */}
          <div className="flex gap-4 items-center opacity-80">
             <div className="w-12 h-9 rounded bg-gradient-to-br from-yellow-200 to-yellow-600 border border-yellow-400/50 shadow-inner flex items-center justify-center">
                <div className="w-8 h-5 border border-black/20 rounded-sm grid grid-cols-2 gap-[1px]">
                   <div className="border-r border-black/20"></div>
                   <div></div>
                </div>
             </div>
             <Radio size={20} className="text-white/50" />
          </div>

          {/* User Info (LIVE UPDATE) */}
          <div className="space-y-1">
             <div className="text-[8px] text-gray-500 uppercase tracking-widest">Commander Name</div>
             <div className="text-xl font-mono font-bold text-white tracking-widest uppercase drop-shadow-md truncate">
                {data.fullName || "UNKNOWN_USER"}
             </div>
             <div className="flex justify-between items-end">
                <div className="text-xs font-mono text-gray-400 tracking-widest">
                   {data.username ? `@${data.username}` : "•••• •••• •••• 9999"}
                </div>
                <div className="text-[8px] font-bold text-white/50">VALID THRU: 12/99</div>
             </div>
          </div>

        </div>
      </motion.div>
      
      {/* Reflection (Bóng đổ) */}
      <div 
        className="absolute -bottom-4 left-4 right-4 h-4 rounded-full blur-xl opacity-40 transition-colors duration-500"
        style={{ background: selectedTier.color }}
      />
    </div>
  )
}

// 3.3. AI ASSISTANT (Chatbot hướng dẫn)
const AssistantBot = ({ step, error }: { step: number, error: string }) => {
  const messages = [
    "Xin chào! Tôi là AI dẫn đường. Hãy bắt đầu bằng việc thiết lập danh tính.",
    "Tuyệt vời. Bây giờ hãy chọn máy chủ gần vị trí của bạn nhất để tối ưu tốc độ Warp.",
    "Bảo mật là ưu tiên số 1. Hãy thiết lập một mật mã lượng tử phức tạp.",
    "Bước cuối cùng: Vui lòng đọc kỹ Hiến pháp ngân hàng và xác nhận vân tay."
  ]

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className="absolute bottom-8 right-8 z-50 hidden lg:flex items-end gap-4"
    >
      <div className="bg-black/80 backdrop-blur-md border border-[#00ff88]/30 p-4 rounded-t-2xl rounded-bl-2xl max-w-xs shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
         <div className="text-[10px] text-[#00ff88] font-bold mb-1 flex items-center gap-2">
            <Activity size={12} className="animate-pulse" /> SYSTEM AI
         </div>
         <p className="text-xs text-gray-300 leading-relaxed">
            {error ? `CẢNH BÁO: ${error}. Vui lòng kiểm tra lại dữ liệu nhập.` : messages[step-1]}
         </p>
      </div>
      <div className="w-12 h-12 rounded-full bg-[#00ff88]/10 border border-[#00ff88] flex items-center justify-center relative">
         <div className="w-8 h-8 bg-[#00ff88] rounded-full animate-ping absolute opacity-20"></div>
         <Scan size={24} className="text-[#00ff88]" />
      </div>
    </motion.div>
  )
}

// 3.4. SERVER MAP VISUALIZER (Chọn Server)
const ServerMap = ({ selected, onSelect }: any) => {
  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
       
       <div className="flex justify-between items-center mb-6">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
             <Globe size={14} className="text-blue-500" /> SERVER NODE SELECTION
          </div>
          <div className="flex gap-1">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[9px] text-green-500 font-mono">LIVE PING</span>
          </div>
       </div>

       <div className="space-y-3">
          {SERVER_NODES.map((node) => {
             const isSelected = selected === node.id
             return (
                <button
                   key={node.id}
                   type="button"
                   onClick={() => onSelect(node.id)}
                   className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 relative overflow-hidden
                      ${isSelected 
                         ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                         : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                      }
                   `}
                >
                   {isSelected && <motion.div layoutId="activeServer" className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                   
                   <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${isSelected ? 'bg-blue-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                         {node.id.split('-')[0]}
                      </div>
                      <div className="text-left">
                         <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>{node.name}</div>
                         <div className="text-[10px] text-gray-600">{node.region}</div>
                      </div>
                   </div>

                   <div className="text-right">
                      <div className={`text-xs font-mono ${node.latency < 50 ? 'text-[#00ff88]' : 'text-yellow-500'}`}>
                         {node.latency}ms
                      </div>
                      <div className="text-[8px] text-gray-600">PING</div>
                   </div>
                </button>
             )
          })}
       </div>
    </div>
  )
}

// 3.5. CYBER INPUT (Ô nhập liệu xịn sò)
const CyberInput = ({ 
  icon: Icon, type, name, placeholder, label, 
  value, onChange, onFocus, onBlur, isFocused, error 
}: any) => (
  <div className="space-y-1.5 group relative">
    <div className="flex justify-between items-end px-1">
       <label className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${isFocused ? 'text-[#00ff88]' : 'text-gray-500'}`}>
          {label}
       </label>
       {error && <span className="text-[9px] text-red-500 font-bold flex items-center gap-1"><AlertTriangle size={10} /> {error}</span>}
    </div>
    
    <div className="relative">
       <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-[#00ff88]' : 'text-gray-600'}`}>
          <Icon size={18} />
       </div>
       <input 
          name={name} type={type} value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} placeholder={placeholder}
          className={`w-full bg-[#0a0a0a] border-2 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none transition-all duration-300 font-mono text-sm shadow-inner
             ${error ? 'border-red-500/50' : isFocused ? 'border-[#00ff88]/50 shadow-[0_0_20px_rgba(0,255,136,0.1)] bg-[#00ff88]/5' : 'border-white/10 hover:border-white/20'}
          `}
       />
       
       {isFocused && (
          <>
             <motion.div layoutId="ctl" className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00ff88]" />
             <motion.div layoutId="ctr" className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00ff88]" />
             <motion.div layoutId="cbr" className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00ff88]" />
             <motion.div layoutId="cbl" className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00ff88]" />
          </>
       )}
    </div>
  </div>
)

// 3.6. PASSWORD ENTROPY (Đo độ mạnh mật khẩu)
const PasswordEntropy = ({ password }: { password: string }) => {
   let score = 0;
   if (password.length > 8) score += 25;
   if (/[A-Z]/.test(password)) score += 25;
   if (/[0-9]/.test(password)) score += 25;
   if (/[^A-Za-z0-9]/.test(password)) score += 25;
   
   const width = `${score}%`;
   const color = score < 50 ? 'bg-red-500' : score < 75 ? 'bg-yellow-500' : 'bg-[#00ff88]';
   const label = score < 50 ? 'WEAK' : score < 75 ? 'MEDIUM' : 'STRONG';

   return (
      <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/5">
         <div className="flex justify-between text-[9px] text-gray-400 mb-1 font-mono uppercase">
            <span>ENTROPY ANALYZER</span>
            <span className={color.replace('bg-', 'text-')}>{label}</span>
         </div>
         <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div className={`h-full ${color}`} initial={{ width: 0 }} animate={{ width }} transition={{ duration: 0.5 }} />
         </div>
      </div>
   )
}

// 3.7. LEGAL TERMINAL (Khung điều khoản cuộn)
const LegalTerminal = ({ onAgree, agreed }: any) => {
   const scrollRef = useRef<HTMLDivElement>(null)
   const [canSign, setCanSign] = useState(false)

   const handleScroll = () => {
      if(!scrollRef.current) return
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      if(scrollTop + clientHeight >= scrollHeight - 20) setCanSign(true)
   }

   return (
      <div className="space-y-4">
         <div className="bg-black/60 rounded-xl border border-white/10 p-4 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-2">
               <div className="flex items-center gap-2 text-xs font-bold text-gray-400"><FileText size={14} /> TERMS_OS_V9.2</div>
               {!canSign && <span className="text-[9px] text-yellow-500 font-mono animate-pulse">SCROLL_REQUIRED</span>}
            </div>
            <div ref={scrollRef} onScroll={handleScroll} className="h-48 overflow-y-auto custom-scrollbar text-[10px] text-gray-400 font-mono leading-relaxed whitespace-pre-wrap p-2 bg-black/20 rounded">
               {LEGAL_TEXT}
            </div>
         </div>
         <button 
            type="button"
            onClick={() => canSign && onAgree(!agreed)}
            disabled={!canSign}
            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 group
               ${!canSign ? 'border-white/5 bg-white/5 text-gray-600 cursor-not-allowed' : agreed ? 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]' : 'border-white/20 hover:border-white/40 text-gray-300'}
            `}
         >
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreed ? 'bg-[#00ff88] border-[#00ff88]' : 'border-current'}`}>
               {agreed && <Check size={14} className="text-black" />}
            </div>
            <span className="text-sm font-bold">XÁC NHẬN VÂN TAY SỐ</span>
         </button>
      </div>
   )
}

// 3.8. SUCCESS SCREEN (Màn hình thành công)
const SuccessScreen = () => (
   <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center h-full space-y-8"
   >
      <div className="relative">
         <div className="absolute inset-0 bg-[#00ff88] blur-[50px] opacity-20 rounded-full"></div>
         <div className="w-32 h-32 rounded-full bg-black border-4 border-[#00ff88] flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(0,255,136,0.3)]">
            <CheckCircle2 size={64} className="text-[#00ff88]" />
         </div>
      </div>
      <div>
         <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">HỒ SƠ ĐÃ DUYỆT</h2>
         <p className="text-gray-400 font-mono">ID: QB-8829-XJ • NODE: HK-01</p>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-sm w-full">
         <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>INITIATING WALLET...</span>
            <span className="text-[#00ff88]">100%</span>
         </div>
         <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, ease: "easeInOut" }} className="h-full bg-[#00ff88]" />
         </div>
      </div>
   </motion.div>
)

// 3.9. AVATAR GENERATOR (Tạo Avatar SVG)
const AvatarGenerator = ({ seed }: { seed: string }) => {
  return (
    <div className="w-32 h-32 rounded-full border-4 border-white/10 bg-black flex items-center justify-center relative overflow-hidden group">
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
       <motion.div className="w-full h-full relative" animate={{ rotate: 360 }} transition={{ duration: 20, ease: "linear", repeat: Infinity }}>
          <svg viewBox="0 0 100 100" className="w-full h-full p-4">
             <path d="M50 5 L95 25 L95 75 L50 95 L5 75 L5 25 Z" fill="none" stroke="#00ff88" strokeWidth="2" className="animate-pulse" />
             <circle cx="50" cy="50" r="20" fill="#00d4ff" opacity="0.8" />
             <path d="M50 0 V100 M0 50 H100" stroke="white" strokeWidth="0.5" opacity="0.3" />
          </svg>
       </motion.div>
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-4 w-full animate-scan pointer-events-none" />
    </div>
  )
}

// =============================================================================
// SECTION 4: MAIN PAGE LOGIC (CONTROLLER)
// =============================================================================

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, initialState)
  const router = useRouter()
  
  // --- STATES ---
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0) // Animation direction
  const [formData, setFormData] = useState({
     fullName: '', username: '', email: '',
     server: 'HK-01',
     password: '', confirmPassword: '',
     agreed: false
  })
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Success Effect
  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => router.push('/login?success=true'), 3000)
      return () => clearTimeout(t)
    }
  }, [state?.success, router])

  // Validation Logic
  const validateStep = (currentStep: number) => {
     const newErrors: Record<string, string> = {}
     let isValid = true

     if (currentStep === 1) {
        if (!formData.fullName) newErrors.fullName = "Thiếu tên chỉ huy"
        if (!formData.username) newErrors.username = "Thiếu mã định danh"
        if (!formData.email) newErrors.email = "Thiếu email liên lạc"
     }
     if (currentStep === 2) {
        // Step 2 is Server Selection (Always valid default)
     }
     if (currentStep === 3) {
        if (formData.password.length < 8) newErrors.password = "Mật mã quá yếu"
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mật mã không khớp"
     }

     if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        isValid = false
     } else {
        setErrors({})
     }
     return isValid
  }

  const handleNext = () => {
     if (validateStep(step)) {
        setDirection(1)
        setStep(p => p + 1)
     }
  }

  const handlePrev = () => {
     setDirection(-1)
     setStep(p => p - 1)
  }

  // --- RENDER ---
  return (
    <div className="min-h-screen w-full bg-[#020202] text-white flex items-center justify-center relative overflow-hidden font-sans selection:bg-[#00ff88] selection:text-black">
      
      {/* 1. LAYER BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00331b]/20 via-[#050505] to-black z-0" />
      <StarField />
      
      {/* 2. LAYER AI ASSISTANT */}
      <AssistantBot step={step} error={Object.values(errors)[0] || ''} />

      {/* 3. MAIN INTERFACE CARD */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-7xl min-h-[800px] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-[0_0_120px_rgba(0,255,136,0.1)] overflow-hidden grid grid-cols-1 lg:grid-cols-12"
      >
        
        {/* --- LEFT COLUMN: VISUALIZER (5/12) --- */}
        <div className="lg:col-span-5 bg-[#080808] border-r border-white/5 relative flex flex-col p-10 justify-between overflow-hidden">
           {/* Grid & Noise */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
           
           {/* Header */}
           <div className="relative z-10">
              <Link href="/" className="inline-flex items-center gap-3 mb-4 group cursor-pointer">
                 <div className="w-10 h-10 rounded-xl bg-[#00ff88] flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(0,255,136,0.4)] group-hover:scale-110 transition-transform">Q</div>
                 <div>
                    <div className="font-bold tracking-widest text-lg group-hover:text-[#00ff88] transition-colors">QUOCBANK</div>
                    <div className="text-[9px] text-gray-500 font-mono">FEDERATION PORTAL</div>
                 </div>
              </Link>
           </div>

           {/* CENTER PIECE: HOLOGRAM CARD */}
           <div className="relative z-10 flex flex-col items-center justify-center flex-1">
              <div className="mb-8 relative">
                 <div className="absolute -inset-10 bg-[#00ff88]/5 blur-3xl rounded-full animate-pulse"></div>
                 <HologramCard data={formData} tier="infinite" />
              </div>
              
              {/* Progress Steps */}
              <div className="w-full max-w-xs space-y-4">
                 {['IDENTITY', 'SERVER_NODE', 'SECURITY', 'PROTOCOL'].map((label, i) => (
                    <div key={i} className={`flex items-center gap-4 text-xs transition-all duration-500 ${i + 1 <= step ? 'text-white opacity-100' : 'text-gray-600 opacity-50'}`}>
                       <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${i + 1 <= step ? 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]' : 'border-gray-800 bg-gray-900'}`}>
                          {i + 1 < step ? <Check size={14} /> : <span className="font-mono">{i+1}</span>}
                       </div>
                       <div className="font-bold tracking-widest text-[10px]">{label}</div>
                       {i + 1 === step && <motion.div layoutId="activeStepDot" className="w-1.5 h-1.5 bg-[#00ff88] rounded-full ml-auto animate-pulse" />}
                    </div>
                 ))}
              </div>
           </div>

           {/* Footer Left */}
           <div className="relative z-10 pt-6 border-t border-white/5 flex justify-between text-[9px] text-gray-600 font-mono">
              <span>SECURE_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              <span>ENC: QUANTUM-256</span>
           </div>
        </div>

        {/* --- RIGHT COLUMN: FORM WIZARD (7/12) --- */}
        <div className="lg:col-span-7 p-8 lg:p-16 relative flex flex-col">
           
           {/* Top Nav */}
           <div className="flex justify-between items-center mb-10">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
                 STEP {step} / {MAX_STEPS}
              </div>
              <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                 <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
           </div>

           {/* SUCCESS SCREEN OVERRIDE */}
           <AnimatePresence mode="wait">
              {state?.success ? (
                 <motion.div key="success" initial={{opacity:0}} animate={{opacity:1}} className="flex-1 flex flex-col items-center justify-center">
                    <SuccessScreen />
                 </motion.div>
              ) : (
                 <form action={formAction} className="flex-1 flex flex-col justify-between">
                    <div className="min-h-[400px]">
                       <AnimatePresence custom={direction} mode="wait">
                          
                          {/* STEP 1: IDENTITY */}
                          {step === 1 && (
                             <motion.div key="step1" variants={slideVariants} custom={direction} initial="enter" animate="center" exit="exit" className="space-y-8">
                                <div>
                                   <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">DANH TÍNH</h2>
                                   <p className="text-gray-400">Thiết lập hồ sơ chỉ huy trưởng.</p>
                                </div>
                                <div className="space-y-5">
                                   <CyberInput icon={User} label="HỌ VÀ TÊN" name="fullName" placeholder="NGUYEN VAN A" value={formData.fullName} onChange={(e:any)=>setFormData({...formData, fullName: e.target.value})} isFocused={focusedField==='fullName'} onFocus={()=>setFocusedField('fullName')} onBlur={()=>setFocusedField(null)} error={errors.fullName} />
                                   <CyberInput icon={Mail} label="EMAIL" name="email" type="email" placeholder="commander@space.com" value={formData.email} onChange={(e:any)=>setFormData({...formData, email: e.target.value})} isFocused={focusedField==='email'} onFocus={()=>setFocusedField('email')} onBlur={()=>setFocusedField(null)} error={errors.email} />
                                   <CyberInput icon={Terminal} label="MÃ ĐỊNH DANH (USERNAME)" name="username" placeholder="commander_01" value={formData.username} onChange={(e:any)=>setFormData({...formData, username: e.target.value})} isFocused={focusedField==='username'} onFocus={()=>setFocusedField('username')} onBlur={()=>setFocusedField(null)} error={errors.username} />
                                </div>
                             </motion.div>
                          )}

                          {/* STEP 2: SERVER NODE */}
                          {step === 2 && (
                             <motion.div key="step2" variants={slideVariants} custom={direction} initial="enter" animate="center" exit="exit" className="space-y-8">
                                <div>
                                   <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">MÁY CHỦ</h2>
                                   <p className="text-gray-400">Chọn điểm kết nối vật lý gần bạn nhất.</p>
                                </div>
                                <ServerMap selected={formData.server} onSelect={(id:string)=>setFormData({...formData, server: id})} />
                             </motion.div>
                          )}

                          {/* STEP 3: SECURITY */}
                          {step === 3 && (
                             <motion.div key="step3" variants={slideVariants} custom={direction} initial="enter" animate="center" exit="exit" className="space-y-8">
                                <div>
                                   <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">BẢO MẬT</h2>
                                   <p className="text-gray-400">Thiết lập khóa lượng tử cá nhân.</p>
                                </div>
                                <div className="space-y-6">
                                   <div>
                                      <CyberInput type="password" icon={Key} label="MẬT MÃ" name="password" placeholder="••••••••" value={formData.password} onChange={(e:any)=>setFormData({...formData, password: e.target.value})} isFocused={focusedField==='password'} onFocus={()=>setFocusedField('password')} onBlur={()=>setFocusedField(null)} error={errors.password} />
                                      <PasswordEntropy password={formData.password} />
                                   </div>
                                   <CyberInput type="password" icon={ShieldCheck} label="XÁC NHẬN" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={(e:any)=>setFormData({...formData, confirmPassword: e.target.value})} isFocused={focusedField==='confirmPassword'} onFocus={()=>setFocusedField('confirmPassword')} onBlur={()=>setFocusedField(null)} error={errors.confirmPassword} />
                                </div>
                             </motion.div>
                          )}

                          {/* STEP 4: PROTOCOL */}
                          {step === 4 && (
                             <motion.div key="step4" variants={slideVariants} custom={direction} initial="enter" animate="center" exit="exit" className="space-y-8">
                                <div>
                                   <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">HIẾN PHÁP</h2>
                                   <p className="text-gray-400">Xác nhận tuân thủ luật pháp liên bang.</p>
                                </div>
                                <LegalTerminal agreed={formData.agreed} onAgree={(v: boolean)=>setFormData({...formData, agreed: v})} />
                                
                                {/* Hidden inputs for submission */}
                                <input type="hidden" name="fullName" value={formData.fullName} />
                                <input type="hidden" name="email" value={formData.email} />
                                <input type="hidden" name="username" value={formData.username} />
                                <input type="hidden" name="password" value={formData.password} />
                             </motion.div>
                          )}

                       </AnimatePresence>
                    </div>

                    {/* CONTROL BAR */}
                    <div className="pt-8 border-t border-white/10 flex gap-4 mt-auto">
                       {step > 1 && (
                          <button type="button" onClick={handlePrev} className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 font-bold transition-all text-sm flex items-center gap-2">
                             <ChevronLeft size={16} /> QUAY LẠI
                          </button>
                       )}
                       
                       {step < MAX_STEPS ? (
                          <button type="button" onClick={handleNext} className="flex-1 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group text-sm shadow-lg shadow-white/10">
                             TIẾP TỤC <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                          </button>
                       ) : (
                          <button type="submit" disabled={isPending || !formData.agreed} className="flex-1 py-4 bg-[#00ff88] text-black font-bold rounded-xl hover:bg-[#00cc6a] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,255,136,0.4)] disabled:opacity-50 disabled:shadow-none group relative overflow-hidden text-sm">
                             <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                             {isPending ? <Loader2 className="animate-spin" /> : <Rocket size={20} />}
                             <span>KHỞI TẠO TÀI KHOẢN</span>
                          </button>
                       )}
                    </div>
                 </form>
              )}
           </AnimatePresence>
        </div>

      </motion.div>
    </div>
  )
}