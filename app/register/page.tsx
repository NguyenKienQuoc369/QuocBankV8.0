'use client'
export const dynamic = 'force-dynamic'

/**
 * QUOCBANK INTERSTELLAR - RECRUITMENT TERMINAL (REGISTER V3.0)
 * Architecture: Step-based Form + Realtime Validation + Holographic Feedback
 * Security Level: Maximum
 */

import React, { useState, useActionState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { register } from '@/app/actions/auth'
import { 
   User, Mail, Lock, Loader2, Rocket, 
   CreditCard, ShieldCheck, CheckCircle2, 
   Fingerprint, Scan, AlertTriangle, ArrowRight, 
   Cpu, Globe, ChevronRight, ChevronLeft, Terminal, Check, Eye, EyeOff
} from 'lucide-react'

// --- 1. CONFIG & TYPES ---
const initialState = {
  message: '',
  error: '',
  success: false
}

// Các bước đăng ký
const STEPS = [
  { id: 1, title: 'IDENTITY', desc: 'Xác lập danh tính chỉ huy' },
  { id: 2, title: 'SECURITY', desc: 'Thiết lập mã khóa lượng tử' },
  { id: 3, title: 'PROTOCOL', desc: 'Xác nhận điều khoản liên minh' }
]

// --- 2. SUB-COMPONENTS (Thành phần giao diện chi tiết) ---

// 2.1. Nền bụi không gian (Particle System)
const SpaceParticles = () => {
   const [particles, setParticles] = useState<Array<{w:number;h:number;left:string;top:string;duration:number;delay:number}>>([])

   useEffect(() => {
      const list = Array.from({ length: 40 }).map(() => ({
         w: Math.random() * 2 + 1,
         h: Math.random() * 2 + 1,
         left: Math.random() * 100 + '%',
         top: Math.random() * 100 + '%',
         duration: Math.random() * 10 + 10,
         delay: Math.random() * 10
      }))
      const raf = requestAnimationFrame(() => setParticles(list))
      return () => cancelAnimationFrame(raf)
   }, [])

   return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
         {/* Grid nền */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
         {particles.map((p, i) => (
            <motion.div
               key={i}
               className="absolute bg-[#00ff88] rounded-full opacity-20"
               style={{
                  width: p.w,
                  height: p.h,
                  left: p.left,
                  top: p.top
               }}
               animate={{
                  y: [0, -1200], // Bay lên
                  opacity: [0, 0.8, 0]
               }}
               transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: p.delay
               }}
            />
         ))}
      </div>
   )
}

// 2.2. Thẻ ID Hologram 3D (Live Preview)
const HologramIDCard = ({ name, username, step }: { name: string, username: string, step: number }) => {
  return (
    <div className="relative w-96 h-56 perspective-1000 group">
      <motion.div
        className="w-full h-full bg-gradient-to-br from-[#0a0a0a] to-[#00331b] backdrop-blur-xl border border-[#00ff88]/40 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_50px_rgba(0,255,136,0.15)]"
        animate={{ rotateY: [0, 3, 0, -3, 0], rotateX: [0, -3, 0, 3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Hiệu ứng quét thẻ */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] animate-[shimmer_4s_infinite]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

        {/* Top Header */}
        <div className="flex justify-between items-start mb-8">
           <div className="flex items-center gap-3">
              <div className="w-12 h-10 bg-yellow-500/10 rounded border border-yellow-500/40 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-yellow-500/20 animate-pulse"></div>
                 <Cpu size={20} className="text-yellow-500 relative z-10" />
              </div>
              <div className="h-8 w-[1px] bg-white/10"></div>
              <div>
                 <div className="text-[8px] text-[#00ff88] font-mono tracking-widest mb-1">ACCESS LEVEL</div>
                 <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <div key={i} className={`w-1.5 h-3 rounded-sm ${i <= step + 2 ? 'bg-[#00ff88]' : 'bg-gray-800'}`} />)}
                 </div>
              </div>
           </div>
           <div className="text-right">
              <div className="text-[10px] text-[#00ff88] font-black tracking-widest">QUOCBANK</div>
              <div className="text-[8px] text-gray-500 font-mono">INTERSTELLAR ALLIANCE</div>
           </div>
        </div>

        {/* User Info */}
        <div className="space-y-4 relative z-10">
           <div>
              <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                 <User size={10} /> COMMANDER NAME
              </div>
              <div className="font-mono text-xl text-white font-bold tracking-wide truncate border-b border-white/10 pb-1">
                 {name || "UNKNOWN_ENTITY"}
              </div>
           </div>

           <div className="flex justify-between items-end">
              <div>
                 <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Terminal size={10} /> CODENAME
                 </div>
                 <div className="font-mono text-sm text-[#00ff88] truncate w-40 bg-[#00ff88]/5 px-2 py-1 rounded">
                    @{username || "awaiting_input..."}
                 </div>
              </div>
              <Fingerprint size={40} className="text-[#00ff88]/30 animate-pulse" strokeWidth={1} />
           </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-[#00ff88] rounded-full shadow-[0_0_10px_#00ff88] animate-ping" />
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#00ff88]/10 to-transparent rounded-bl-full pointer-events-none" />
      </motion.div>
    </div>
  )
}

// 2.3. Cyber Input (Ô nhập liệu có animation)
const CyberInput = ({ icon: Icon, type, name, placeholder, label, value, onChange, onFocus, onBlur, isFocused, error }: any) => {
   const [show, setShow] = useState(false)
   const inputType = type === 'password' ? (show ? 'text' : 'password') : type
   return (
   <div className="space-y-1 group relative">
    <div className="flex justify-between items-end px-1">
       <label className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isFocused ? 'text-[#00ff88]' : 'text-gray-500'}`}>
          {label}
       </label>
       {error && <span className="text-[9px] text-red-500 font-bold animate-pulse">{error}</span>}
    </div>
    
    <div className="relative">
       <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-[#00ff88]' : 'text-gray-600'}`}>
          <Icon size={18} />
       </div>
       <input 
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
             onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                     e.preventDefault()
                     const target = e.target as HTMLElement
                     const form = target.closest('form')
                     if (!form) return
                     const focusables = Array.from(form.querySelectorAll<HTMLInputElement | HTMLButtonElement | HTMLTextAreaElement | HTMLSelectElement>('input:not([type=hidden]):not([disabled]), button:not([disabled]), textarea, select'))
                     const idx = focusables.findIndex(f => f === target)
                     if (idx >= 0 && idx < focusables.length - 1) {
                        const next = focusables[idx + 1] as HTMLElement
                        next.focus()
                        if ((next as HTMLInputElement).select) try { (next as HTMLInputElement).select() } catch {}
                     } else {
                        const submit = focusables.find(f => (f as HTMLButtonElement).getAttribute && (f as HTMLButtonElement).getAttribute('type') === 'submit') as HTMLButtonElement | undefined
                        if (submit) submit.click()
                        else (form as HTMLFormElement).submit()
                     }
                  }
               }}
          className={`w-full bg-black/40 border-2 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none transition-all font-mono text-sm
             ${error 
                ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                : isFocused 
                   ? 'border-[#00ff88]/50 shadow-[0_0_15px_rgba(0,255,136,0.1)] bg-[#00ff88]/5' 
                   : 'border-white/10 hover:border-white/20'
             }
          `}
       />

       {/* eye toggle for password fields */}
       {type === 'password' && (
         <button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-white">
           {show ? <EyeOff size={18} /> : <Eye size={18} />}
         </button>
       )}
       
       {/* Góc vuông trang trí (Reticle Corners) */}
       {isFocused && (
          <>
             <motion.div layoutId="corner-tl" className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00ff88]" />
             <motion.div layoutId="corner-tr" className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00ff88]" />
             <motion.div layoutId="corner-br" className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00ff88]" />
             <motion.div layoutId="corner-bl" className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00ff88]" />
          </>
       )}
    </div>
   </div>
   )
}

// 2.4. Thanh đo độ mạnh mật khẩu (Password Strength Meter)
const PasswordStrength = ({ password }: { password: string }) => {
   if (!password) return null;
   
   let strength = 0;
   if (password.length > 7) strength++;
   if (password.match(/[A-Z]/)) strength++;
   if (password.match(/[0-9]/)) strength++;
   if (password.match(/[^A-Za-z0-9]/)) strength++;

   const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-[#00ff88]'];
   const texts = ['YẾU', 'TRUNG BÌNH', 'KHÁ', 'MẠNH'];

   return (
      <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/5">
         <div className="flex justify-between text-[9px] text-gray-400 mb-1 font-mono uppercase">
            <span>Bảo mật</span>
            <span className={strength > 2 ? 'text-[#00ff88]' : 'text-gray-400'}>{texts[Math.min(strength, 3)]}</span>
         </div>
         <div className="flex gap-1 h-1.5">
            {[0, 1, 2, 3].map((i) => (
               <div 
                  key={i} 
                  className={`flex-1 rounded-full transition-all duration-500 ${i < strength ? colors[Math.min(strength - 1, 3)] : 'bg-gray-800'}`} 
               />
            ))}
         </div>
      </div>
   )
}

// 2.5. Checkbox Điều khoản (Cyber Checkbox)
const CyberCheckbox = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
   <div 
      onClick={() => onChange(!checked)}
      className={`group relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer select-none
         ${checked ? 'border-[#00ff88]/50 bg-[#00ff88]/5' : 'border-white/10 hover:border-white/30 bg-black/40'}
      `}
   >
      <div className={`w-5 h-5 mt-0.5 rounded border flex items-center justify-center transition-all shrink-0
         ${checked ? 'bg-[#00ff88] border-[#00ff88]' : 'border-gray-500 group-hover:border-white'}
      `}>
         {checked && <Check size={14} className="text-black" />}
      </div>
      <div className="text-sm text-gray-300">
         Tôi xác nhận đã đọc và đồng ý tuân thủ <span className="text-[#00ff88] underline underline-offset-4 font-bold">Hiến Pháp Ngân Hàng Đa Vũ Trụ</span>. Tôi hiểu rằng mọi gian lận lượng tử sẽ bị xử lý theo luật liên bang thiên hà.
      </div>
      
      {/* Glow effect */}
      {checked && <div className="absolute inset-0 shadow-[0_0_30px_rgba(0,255,136,0.1)] rounded-xl pointer-events-none" />}
   </div>
)

// --- 3. MAIN COMPONENT ---

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, initialState)
  const router = useRouter()
  
  // State quản lý Steps
  const [currentStep, setCurrentStep] = useState(1)
  
  // State quản lý Form Data
  const [formData, setFormData] = useState({ 
     fullName: '', 
     username: '', 
     password: '', 
     confirmPassword: '',
     agreed: false
  })
  
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Xử lý chuyển hướng khi thành công
  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => {
        router.push('/login?success=true')
      }, 3000)
      return () => clearTimeout(t)
    }
  }, [state?.success, router])

  // Parallax Effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateY = useTransform(mouseX, [-500, 500], [3, -3])
  const rotateX = useTransform(mouseY, [-500, 500], [-3, 3])
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  // Logic chuyển bước (Validation cơ bản)
  const handleNextStep = () => {
     const newErrors: Record<string, string> = {}
     
     if (currentStep === 1) {
        if (!formData.fullName) newErrors.fullName = "Không được để trống"
        if (!formData.username) newErrors.username = "Thiếu mã định danh"
     } else if (currentStep === 2) {
        if (formData.password.length < 6) newErrors.password = "Tối thiểu 6 ký tự"
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mật mã không khớp"
     }

     if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
     }
     
     setErrors({})
     setCurrentStep(prev => prev + 1)
  }

  const handlePrevStep = () => setCurrentStep(prev => prev - 1)

  return (
    <div 
      className="min-h-screen w-full bg-black text-white flex items-center justify-center relative overflow-hidden font-sans selection:bg-[#00ff88] selection:text-black perspective-1000"
      onMouseMove={handleMouseMove}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#004d29_0%,black_70%)] opacity-40 z-0" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay z-0" />
      <SpaceParticles />

      {/* Main Card */}
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-7xl min-h-[750px] bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-[0_0_80px_rgba(0,255,136,0.1)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 group"
      >
        
        {/* --- CỘT TRÁI: FORM WIZARD (Chiếm 5 phần) --- */}
        <div className="lg:col-span-5 p-8 lg:p-14 flex flex-col relative border-r border-white/5">
           
           {/* Header */}
           <div className="mb-10">
              <Link href="/" className="inline-flex items-center gap-3 text-white/50 hover:text-white transition-colors mb-6 group/back">
                 <div className="p-1 rounded-full border border-white/10 group-hover/back:border-[#00ff88] transition-colors">
                    <ChevronLeft size={16} />
                 </div>
                 <span className="text-xs font-mono">QUAY LẠI TRẠM CHỈ HUY</span>
              </Link>
              <h1 className="text-4xl font-black mb-2 tracking-tight">KÍCH HOẠT HỒ SƠ</h1>
              <p className="text-gray-400 text-sm">Hoàn tất 3 bước xác thực để gia nhập hạm đội.</p>
           </div>

           {/* Step Indicator */}
           <div className="flex gap-2 mb-10">
              {STEPS.map((s) => (
                 <div key={s.id} className="flex-1">
                    <div className={`h-1 rounded-full mb-2 transition-all duration-500 ${s.id <= currentStep ? 'bg-[#00ff88]' : 'bg-gray-800'}`} />
                    <div className={`text-[10px] font-bold tracking-wider uppercase ${s.id === currentStep ? 'text-white' : 'text-gray-600'}`}>
                       {s.title}
                    </div>
                 </div>
              ))}
           </div>

           {/* Form Container */}
           <div className="flex-1 relative">
              <AnimatePresence mode='wait'>
                 {state?.success ? (
                    // SUCCESS STATE
                    <motion.div 
                       key="success"
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6"
                    >
                       <div className="w-24 h-24 rounded-full bg-[#00ff88]/20 flex items-center justify-center border-2 border-[#00ff88] shadow-[0_0_40px_#00ff88]">
                          <CheckCircle2 size={48} className="text-[#00ff88]" />
                       </div>
                       <div>
                          <h2 className="text-2xl font-bold text-white mb-2">DANH TÍNH ĐÃ XÁC LẬP</h2>
                          <p className="text-gray-400 text-sm">Đang khởi tạo ví lượng tử và điều hướng...</p>
                       </div>
                       <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3 }} 
                             className="h-full bg-[#00ff88]" 
                          />
                       </div>
                    </motion.div>
                 ) : (
                    // FORM STEPS
                    <form action={formAction} className="h-full flex flex-col">
                       {/* STEP 1: IDENTITY */}
                       {currentStep === 1 && (
                          <motion.div 
                             key="step1"
                             initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                             className="space-y-6"
                          >
                             <CyberInput 
                                icon={User} label="HỌ VÀ TÊN" name="fullName" placeholder="NGUYEN VAN A"
                                value={formData.fullName}
                                onChange={(e: any) => setFormData({...formData, fullName: e.target.value})}
                                isFocused={focusedField === 'fullName'}
                                onFocus={() => setFocusedField('fullName')}
                                onBlur={() => setFocusedField(null)}
                                error={errors.fullName}
                             />
                             <CyberInput 
                                icon={Mail} label="MÃ ĐỊNH DANH (USERNAME)" name="username" placeholder="commander_01"
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
                       {currentStep === 2 && (
                          <motion.div 
                             key="step2"
                             initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                             className="space-y-6"
                          >
                             <CyberInput 
                                type="password" icon={Lock} label="MẬT MÃ" name="password" placeholder="••••••••"
                                value={formData.password}
                                onChange={(e: any) => setFormData({...formData, password: e.target.value})}
                                isFocused={focusedField === 'password'}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                error={errors.password}
                             />
                             <PasswordStrength password={formData.password} />
                             
                             <CyberInput 
                                type="password" icon={Lock} label="XÁC NHẬN MẬT MÃ" name="confirmPassword" placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e: any) => setFormData({...formData, confirmPassword: e.target.value})}
                                isFocused={focusedField === 'confirmPassword'}
                                onFocus={() => setFocusedField('confirmPassword')}
                                onBlur={() => setFocusedField(null)}
                                error={errors.confirmPassword}
                             />
                          </motion.div>
                       )}

                       {/* STEP 3: PROTOCOL (TERMS) */}
                       {currentStep === 3 && (
                          <motion.div 
                             key="step3"
                             initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                             className="space-y-6"
                          >
                             <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                                <div className="flex items-center gap-3 text-white">
                                   <ShieldCheck size={20} className="text-[#00ff88]" />
                                   <span className="font-bold text-sm">XÁC THỰC BẢO MẬT</span>
                                </div>
                                <div className="text-xs text-gray-400 leading-relaxed">
                                   Tài khoản của bạn sẽ được bảo vệ bởi công nghệ mã hóa lượng tử 256-bit. Vui lòng xác nhận để kích hoạt Protocol Zero-Trust.
                                </div>
                             </div>

                             {/* CUSTOM CHECKBOX */}
                             <CyberCheckbox 
                                checked={formData.agreed} 
                                onChange={(val) => setFormData({...formData, agreed: val})} 
                             />
                             
                             {state?.error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
                                   <AlertTriangle size={14} /> {state.error}
                                </div>
                             )}

                             {/* Hidden inputs to submit all data */}
                             <input type="hidden" name="fullName" value={formData.fullName} />
                             <input type="hidden" name="username" value={formData.username} />
                             <input type="hidden" name="password" value={formData.password} />
                          </motion.div>
                       )}

                       {/* NAVIGATION BUTTONS */}
                       <div className="mt-auto pt-8 flex gap-4">
                          {currentStep > 1 && (
                             <button 
                                type="button" onClick={handlePrevStep}
                                className="px-6 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 font-bold transition-all"
                             >
                                QUAY LẠI
                             </button>
                          )}
                          
                          {currentStep < 3 ? (
                             <button 
                                type="button" onClick={handleNextStep}
                                className="flex-1 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group"
                             >
                                TIẾP TỤC <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                             </button>
                          ) : (
                             <button 
                                type="submit"
                                disabled={isPending || !formData.agreed}
                                className="flex-1 py-4 bg-[#00ff88] text-black font-bold rounded-xl hover:bg-[#00cc6a] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,255,136,0.3)] disabled:opacity-50 disabled:shadow-none group relative overflow-hidden"
                             >
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
        </div>

        {/* --- CỘT PHẢI: VISUALIZATION (Chiếm 7 phần) --- */}
        <div className="hidden lg:flex lg:col-span-7 bg-[#050505] flex-col justify-center items-center relative overflow-hidden p-12">
           
           {/* Grid nền */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
           
           {/* Center Visual */}
           <div className="relative z-10 flex flex-col items-center">
              
              {/* Tiêu đề Visual thay đổi theo bước */}
              <motion.div 
                 key={currentStep}
                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                 className="text-center mb-12"
              >
                 <div className="text-[#00ff88] text-5xl mb-4 flex justify-center">
                    {currentStep === 1 && <Scan size={64} strokeWidth={1} />}
                    {currentStep === 2 && <Lock size={64} strokeWidth={1} />}
                    {currentStep === 3 && <ShieldCheck size={64} strokeWidth={1} />}
                 </div>
                 <h3 className="text-2xl font-bold text-white tracking-widest uppercase">{STEPS[currentStep-1].title} MODULE</h3>
                 <p className="text-gray-500 font-mono text-sm mt-2">{STEPS[currentStep-1].desc}</p>
              </motion.div>

              {/* THẺ HOLOGRAM 3D (Luôn hiển thị để preview) */}
              <HologramIDCard 
                 name={formData.fullName.toUpperCase()} 
                 username={formData.username} 
                 step={currentStep}
              />

              {/* Decorative Tech Specs */}
              <div className="mt-16 grid grid-cols-2 gap-12 text-center opacity-50">
                 <div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">ENCRYPTION</div>
                    <div className="text-[#00ff88] font-mono text-xl">AES-256</div>
                 </div>
                 <div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">SERVER NODE</div>
                    <div className="text-[#00ff88] font-mono text-xl">ASIA-HK</div>
                 </div>
              </div>
           </div>

           {/* Animated Rings */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-dashed border-white/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
        </div>

      </motion.div>
    </div>
  )
}