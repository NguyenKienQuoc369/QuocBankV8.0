'use client'

import React, { useState, useActionState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { register } from '@/app/actions/auth'
// Đã thêm 'Globe' vào dòng import dưới đây
import { 
  User, Mail, Lock, Loader2, Rocket, 
  CreditCard, ShieldCheck, CheckCircle2, 
  Fingerprint, Scan, AlertTriangle, ArrowRight, Cpu, Globe 
} from 'lucide-react'

// --- 1. CONFIG ---
const initialState = {
  message: '',
  error: '',
  success: false
}

// --- 2. SUB-COMPONENTS ---

// 2.1. Nền không gian (Particle)
const SpaceParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-[#00ff88] rounded-full opacity-20"
        style={{
          width: Math.random() * 3 + 1,
          height: Math.random() * 3 + 1,
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%'
        }}
        animate={{
          y: [0, -100],
          opacity: [0, 0.5, 0]
        }}
        transition={{
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 5
        }}
      />
    ))}
  </div>
)

// 2.2. Thẻ ID Hologram 3D (Hiển thị thông tin Live)
const HologramIDCard = ({ name, username }: { name: string, username: string }) => {
  return (
    <div className="relative w-80 h-48 perspective-1000 group">
      <motion.div
        className="w-full h-full bg-gradient-to-br from-black/80 to-[#004d29]/80 backdrop-blur-md border border-[#00ff88]/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(0,255,136,0.2)]"
        animate={{ rotateY: [0, 5, 0, -5, 0], rotateX: [0, -5, 0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Scan line quét qua thẻ */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] animate-[shimmer_3s_infinite]" />
        
        {/* Chip & Logo */}
        <div className="flex justify-between items-start mb-8">
           <div className="w-10 h-8 bg-yellow-500/20 rounded border border-yellow-500/50 flex items-center justify-center">
              <Cpu size={16} className="text-yellow-500/80" />
           </div>
           <div className="text-right">
              <div className="text-[10px] text-[#00ff88] font-mono tracking-widest">QUOCBANK</div>
              <div className="text-[8px] text-gray-500 font-mono">INTERSTELLAR ID</div>
           </div>
        </div>

        {/* Thông tin User */}
        <div className="space-y-1">
           <div className="text-[9px] text-gray-400 uppercase tracking-wider">COMMANDER NAME</div>
           <div className="font-mono text-lg text-white font-bold tracking-wide truncate">
              {name || "UNKNOWN"}
           </div>
        </div>

        <div className="mt-4 flex justify-between items-end">
           <div className="space-y-1">
              <div className="text-[9px] text-gray-400 uppercase tracking-wider">CODENAME</div>
              <div className="font-mono text-sm text-[#00ff88] truncate w-32">
                 @{username || "..."}
              </div>
           </div>
           <Fingerprint size={32} className="text-[#00ff88]/50" />
        </div>

        {/* Góc trang trí */}
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-[#00ff88] rounded-full animate-ping" />
      </motion.div>
    </div>
  )
}

// 2.3. Cyber Input (Ô nhập liệu xịn)
const CyberInput = ({ icon: Icon, type, name, placeholder, label, value, onChange, onFocus, onBlur, isFocused }: any) => (
  <div className="space-y-1 group">
    <div className="flex justify-between items-end px-1">
       <label className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isFocused ? 'text-[#00ff88]' : 'text-gray-500'}`}>
          {label}
       </label>
       {isFocused && <span className="text-[9px] text-[#00ff88] font-mono animate-pulse">EDITING...</span>}
    </div>
    
    <div className="relative">
       <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isFocused ? 'text-[#00ff88]' : 'text-gray-500'}`}>
          <Icon size={18} />
       </div>
       <input 
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          required
          placeholder={placeholder}
          className={`w-full bg-black/40 border-2 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none transition-all font-mono text-sm
             ${isFocused 
                ? 'border-[#00ff88]/50 shadow-[0_0_15px_rgba(0,255,136,0.1)] bg-[#00ff88]/5' 
                : 'border-white/10 hover:border-white/20'
             }
          `}
       />
       {/* Góc vuông trang trí */}
       {isFocused && (
          <>
             <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00ff88]" />
             <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00ff88]" />
          </>
       )}
    </div>
  </div>
)

// --- 3. MAIN COMPONENT ---

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, initialState)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  
  // State lưu giá trị input để hiển thị lên Hologram Card
  const [formData, setFormData] = useState({ fullName: '', username: '' })
  
  const router = useRouter()

  // Xử lý khi đăng ký thành công
  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => {
        router.push('/login?success=true')
      }, 2500)
      return () => clearTimeout(t)
    }
  }, [state?.success, router])

  // Parallax Logic
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateY = useTransform(mouseX, [-500, 500], [2, -2]) // Nghiêng nhẹ ngược chiều
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    mouseX.set(x)
    mouseY.set(y)
  }

  return (
    <div 
      className="min-h-screen w-full bg-black text-white flex items-center justify-center relative overflow-hidden font-sans selection:bg-[#00ff88] selection:text-black"
      onMouseMove={handleMouseMove}
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#004d29]/30 via-black to-black z-0" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay z-0" />
      <SpaceParticles />

      {/* MAIN CONTAINER */}
      <motion.div 
        style={{ rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-6xl min-h-[700px] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
      >
        
        {/* --- CỘT TRÁI: FORM ĐĂNG KÝ (MAIN INPUT) --- */}
        <div className="p-8 lg:p-16 flex flex-col justify-center relative border-b lg:border-b-0 lg:border-r border-white/10">
           
           {/* Thành công View */}
           <AnimatePresence mode='wait'>
             {state?.success ? (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0 }}
                 className="flex flex-col items-center text-center space-y-6"
               >
                 <div className="w-24 h-24 rounded-full bg-[#00ff88]/20 flex items-center justify-center border-2 border-[#00ff88]">
                    <CheckCircle2 size={48} className="text-[#00ff88]" />
                 </div>
                 <div>
                    <h2 className="text-3xl font-bold text-white mb-2">HỒ SƠ ĐÃ DUYỆT</h2>
                    <p className="text-gray-400">Đang khởi tạo ví lượng tử...</p>
                 </div>
                 <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden mt-4">
                    <motion.div 
                       initial={{ width: 0 }} 
                       animate={{ width: "100%" }} 
                       transition={{ duration: 2 }} 
                       className="h-full bg-[#00ff88]" 
                    />
                 </div>
               </motion.div>
             ) : (
               // Form View
               <motion.div
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="w-full max-w-md mx-auto"
               >
                 <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/10 text-[#00ff88] text-[10px] font-mono mb-4">
                       <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
                       NEW RECRUIT
                    </div>
                    <h1 className="text-4xl font-bold mb-2">ĐĂNG KÝ</h1>
                    <p className="text-gray-400">Thiết lập danh tính số của bạn trên mạng lưới liên ngân hà.</p>
                 </div>

                 <form action={formAction} className="space-y-6">
                    <CyberInput 
                       icon={User} label="HỌ VÀ TÊN" name="fullName" placeholder="NGUYEN VAN A"
                       value={formData.fullName}
                       onChange={(e: any) => setFormData({...formData, fullName: e.target.value})}
                       isFocused={focusedField === 'fullName'}
                       onFocus={() => setFocusedField('fullName')}
                       onBlur={() => setFocusedField(null)}
                    />
                    
                    <CyberInput 
                       icon={Mail} label="MÃ ĐỊNH DANH (USERNAME)" name="username" placeholder="commander_01"
                       value={formData.username}
                       onChange={(e: any) => setFormData({...formData, username: e.target.value})}
                       isFocused={focusedField === 'username'}
                       onFocus={() => setFocusedField('username')}
                       onBlur={() => setFocusedField(null)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <CyberInput 
                          type="password" icon={Lock} label="MẬT MÃ" name="password" placeholder="••••••••"
                          isFocused={focusedField === 'password'}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                       />
                       <CyberInput 
                          type="password" icon={Lock} label="XÁC NHẬN" name="confirmPassword" placeholder="••••••••"
                          isFocused={focusedField === 'confirmPassword'}
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => setFocusedField(null)}
                       />
                    </div>

                    {/* Error Box */}
                    <AnimatePresence>
                       {state?.error && (
                          <motion.div 
                             initial={{ opacity: 0, height: 0 }} 
                             animate={{ opacity: 1, height: 'auto' }}
                             exit={{ opacity: 0, height: 0 }}
                             className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2"
                          >
                             <AlertTriangle size={14} /> {state.error}
                          </motion.div>
                       )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <div className="pt-4 flex flex-col gap-4">
                       <button 
                          disabled={isPending}
                          className="w-full py-4 bg-[#00ff88] hover:bg-[#00cc6a] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden"
                       >
                          <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                          {isPending ? <Loader2 className="animate-spin" /> : <Rocket size={20} />}
                          <span>{isPending ? 'ĐANG KHỞI TẠO...' : 'XÁC NHẬN GIA NHẬP'}</span>
                       </button>
                       
                       <div className="text-center text-xs text-gray-500">
                          Đã có tài khoản? <Link href="/login" className="text-[#00ff88] hover:underline">Đăng nhập</Link>
                       </div>
                    </div>
                 </form>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* --- CỘT PHẢI: VISUALIZATION (HOLOGRAM PREVIEW) --- */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-[#050505] relative overflow-hidden p-12">
           
           {/* Background Grid */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
           
           {/* Center Hologram */}
           <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="text-center space-y-2">
                 <div className="text-xs font-bold text-gray-500 tracking-[0.3em] uppercase">Identity Preview</div>
                 <div className="text-[#00ff88] text-4xl font-mono animate-pulse">
                    <Scan size={48} strokeWidth={1} />
                 </div>
              </div>

              {/* THẺ HOLOGRAM XOAY 3D */}
              <HologramIDCard 
                 name={formData.fullName.toUpperCase()} 
                 username={formData.username} 
              />

              {/* Features List */}
              <div className="w-full max-w-xs space-y-3 mt-8">
                 {[
                    { icon: ShieldCheck, text: "Bảo mật sinh trắc học cấp 5" },
                    { icon: CreditCard, text: "Thẻ Visa Infinite ảo tích hợp" },
                    { icon: Globe, text: "Quyền công dân Đa Vũ Trụ" }
                 ].map((item, i) => (
                    <motion.div 
                       key={i} 
                       initial={{ x: 50, opacity: 0 }}
                       animate={{ x: 0, opacity: 1 }}
                       transition={{ delay: 0.5 + i * 0.2 }}
                       className="flex items-center gap-3 text-xs text-gray-400 border-b border-white/5 pb-2"
                    >
                       <item.icon size={14} className="text-[#00ff88]" /> {item.text}
                    </motion.div>
                 ))}
              </div>
           </div>

           {/* Decorative UI */}
           <div className="absolute bottom-8 right-8 text-[10px] text-gray-600 font-mono text-right">
              <div>SECURE_CHANNEL: ENCRYPTED</div>
              <div>NODE: ALPHA_CENTAURI_09</div>
           </div>
        </div>

      </motion.div>
    </div>
  )
}