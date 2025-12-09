// app/login/page.tsx
'use client'

import React, { useState, useActionState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion'
import { login } from '@/app/actions/auth'
import { 
  LogIn, Key, User, Loader2, ShieldCheck, 
  Cpu, Zap, Globe, ScanFace, Lock, AlertTriangle, 
  Terminal, Activity, CheckCircle, ChevronLeft
} from 'lucide-react'

// --- 1. CONFIG & UTILS ---
const initialState = {
  message: '',
  error: '',
  success: false
}

// Hàm random số cho hiệu ứng Matrix
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

// --- 2. SUB-COMPONENTS (Thành phần con chi tiết) ---

// 2.1. Nền Sao Băng & Bụi Vũ Trụ (Particle System) - Optimized
const StarField = React.memo(() => {
  const [stars, setStars] = React.useState<Array<{id:number;x:number;y:number;size:number;duration:number;delay:number}>>([])

  React.useEffect(() => {
    const list = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: randomInt(0, 100),
      y: randomInt(0, 100),
      size: Math.random() * 2 + 1,
      duration: randomInt(4, 8),
      delay: randomInt(0, 4)
    }))
    const raf = requestAnimationFrame(() => setStars(list))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full opacity-0"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            willChange: 'opacity, transform'
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "linear"
          }}
        />
      ))}
      {/* Sao băng - giảm tần suất */}
      <motion.div 
        className="absolute top-0 right-0 w-[300px] h-[1px] bg-gradient-to-l from-transparent via-cyan-400 to-transparent opacity-0"
        animate={{ 
          x: [-500, 1000], 
          y: [0, 500], 
          opacity: [0, 0.8, 0] 
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 3, ease: "linear" }}
        style={{ rotate: 45, willChange: 'transform, opacity' }}
      />
    </div>
  )
})

StarField.displayName = 'StarField'

// 2.2. Lõi Lượng Tử (Quantum Core) - Optimized
const QuantumCore = React.memo(() => {
  return (
    <div className="relative w-72 h-72 flex items-center justify-center mx-auto">
      {/* Vòng ngoài cùng */}
      <motion.div
        className="absolute inset-0 border border-indigo-500/30 rounded-full border-dashed"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ willChange: 'transform' }}
      />
      {/* Vòng giữa quay ngược */}
      <motion.div
        className="absolute inset-4 border-2 border-cyan-500/20 rounded-full"
        style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent', willChange: 'transform' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      {/* Vòng trong cùng quay nhanh */}
      <motion.div
        className="absolute inset-10 border-4 border-indigo-400/10 rounded-full"
        style={{ borderLeftColor: '#00ff88', borderRightColor: 'transparent', willChange: 'transform' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      {/* Lõi năng lượng */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-full blur-xl opacity-50"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform, opacity' }}
        />
        <div className="w-20 h-20 bg-black rounded-full border border-white/10 flex items-center justify-center absolute shadow-[0_0_50px_rgba(79,70,229,0.5)]">
           <Zap className="text-cyan-400 w-10 h-10 animate-pulse" />
        </div>
      </div>
      
      {/* Các vệ tinh quay quanh */}
      <motion.div 
        className="absolute w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ willChange: 'transform' }}
      >
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_white]" />
      </motion.div>
    </div>
  )
})

QuantumCore.displayName = 'QuantumCore'

// 2.3. Terminal Khởi động (System Boot Logs) - Optimized
const SystemBootLog = React.memo(() => {
  const [logs, setLogs] = useState<string[]>([])
  const fullLogs = React.useMemo(() => [
    "Khởi tạo giao thức bảo mật...",
    "Kết nối máy chủ vệ tinh V-9...",
    "Đang xác thực chữ ký lượng tử...",
    "Tải module giao diện người dùng...",
    "Trạng thái: SẴN SÀNG."
  ], [])

  useEffect(() => {
    let delay = 0
    const timeouts: NodeJS.Timeout[] = []
    
    fullLogs.forEach((log) => {
      delay += randomInt(400, 600)
      const timeout = setTimeout(() => {
        setLogs(prev => [...prev, `> ${log}`])
      }, delay)
      timeouts.push(timeout)
    })

    return () => timeouts.forEach(clearTimeout)
  }, [fullLogs])

  return (
    <div className="font-mono text-[10px] text-green-500/80 p-4 h-32 overflow-hidden flex flex-col justify-end bg-black/40 rounded-lg border border-green-500/20 shadow-inner">
      {logs.map((log, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {log}
        </motion.div>
      ))}
      <motion.span 
        animate={{ opacity: [0, 1, 0] }} 
        transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
        className="text-green-400"
      >_</motion.span>
    </div>
  )
})

SystemBootLog.displayName = 'SystemBootLog'

// 2.4. Cyber Input (Ô nhập liệu tương lai)
const CyberInput = ({ icon: Icon, type, name, placeholder, onFocus, onBlur, isFocused }: any) => {
  return (
    <div className="relative group">
      {/* Label hiệu ứng */}
      <motion.label 
        animate={{ 
          color: isFocused ? '#00d4ff' : '#9ca3af',
          y: isFocused ? -2 : 0
        }}
        className="text-xs font-bold uppercase tracking-widest ml-1 mb-1 block transition-colors"
      >
        {name === 'username' ? 'MÃ ĐỊNH DANH' : 'KHÓA TRUY CẬP'}
      </motion.label>

      <div className="relative">
        {/* Icon bên trái */}
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-cyan-400' : 'text-gray-500'}`}>
          <Icon size={18} />
        </div>

        {/* Input chính */}
        <input 
          name={name} 
          type={type} 
          required
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full bg-black/60 border-2 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none transition-all duration-300 font-mono text-sm
            ${isFocused ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'border-white/10 hover:border-white/20'}
          `}
        />

        {/* Thanh trạng thái bên phải */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-[2px]">
           <div className={`w-1 h-1 rounded-full ${isFocused ? 'bg-green-500' : 'bg-gray-700'}`} />
           <div className={`w-1 h-1 rounded-full ${isFocused ? 'bg-green-500' : 'bg-gray-700'}`} />
           <div className={`w-1 h-1 rounded-full ${isFocused ? 'bg-green-500' : 'bg-gray-700'}`} />
        </div>

        {/* Đường kẻ quét (Scan line) khi focus */}
        <AnimatePresence>
          {isFocused && (
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              exit={{ width: '0%', opacity: 0 }}
              className="absolute bottom-0 left-0 h-[2px] bg-cyan-400 shadow-[0_0_10px_#00d4ff]"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// --- 3. MAIN PAGE COMPONENT ---

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isBooting, setIsBooting] = useState(true) // State khởi động
  const router = useRouter()

  // Parallax Effect Logic - Optimized với throttle
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-500, 500], [3, -3]) // Giảm độ nghiêng
  const rotateY = useTransform(mouseX, [-500, 500], [-3, 3])

  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  // Kết thúc quá trình boot sau 2 giây
  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  // Xử lý login thành công
  useEffect(() => {
    if (state?.success) {
      router.refresh()
      router.push('/dashboard') 
    }
  }, [state?.success, router])

  return (
    <div 
      className="min-h-screen w-full bg-black text-white flex items-center justify-center relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black perspective-1000"
      onMouseMove={handleMouseMove}
    >
      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black z-0" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay z-0" />
      <StarField />

      {/* --- MAIN CARD (PARALLAX CONTAINER) --- */}
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", willChange: 'transform' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl h-[700px] bg-black/60 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_0_100px_rgba(79,70,229,0.2)] overflow-hidden flex flex-col lg:flex-row group"
      >
        {/* Glow effect chạy quanh viền */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
           <div className="absolute bottom-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
        </div>

        {/* ================= CỘT TRÁI: VISUAL ARTWORK ================= */}
        <div className="hidden lg:flex w-5/12 bg-white/5 relative flex-col p-12 border-r border-white/5 overflow-hidden">
          {/* Background Grid bên trái */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          {/* Logo & Brand */}
          <div className="relative z-10 flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center font-bold text-white shadow-lg">Q</div>
              <span className="text-2xl font-bold tracking-[0.2em]">QUOC<span className="text-cyan-400">BANK</span></span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-mono">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> SYSTEM SECURE
            </div>
          </div>

          {/* Center Visual (Quantum Core) */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-8">
             <div className="flex items-center justify-center w-full">
               <QuantumCore />
             </div>
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1 }}
               className="mt-8 text-center text-gray-400 text-sm max-w-xs leading-relaxed px-4"
             >
               Cổng kết nối đến mạng lưới tài chính đa chiều. Vui lòng xác thực danh tính để truy cập khoang điều khiển.
             </motion.p>
          </div>

          {/* System Terminal (Bottom Left) */}
          <div className="relative z-10 flex-shrink-0">
             <SystemBootLog />
          </div>
        </div>

        {/* ================= CỘT PHẢI: LOGIN FORM ================= */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative">
          
          {/* Hình nền mờ logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
             <Globe size={400} />
          </div>

          {/* Form Container */}
          <div className="w-full max-w-md relative z-10">
            
            {/* Header Form */}
            <div className="mb-10 text-center lg:text-left">
              <div className="mb-6">
                <Link href="/" className="inline-flex items-center gap-3 text-white/50 hover:text-white transition-colors mb-2">
                  <div className="p-1 rounded-full border border-white/10 transition-colors">
                    <ChevronLeft size={16} />
                  </div>
                  <span className="text-xs font-mono">QUAY LẠI TRANG CHỦ</span>
                </Link>
              </div>
              <h2 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                CHÀO MỪNG TRỞ LẠI
              </h2>
              <p className="text-gray-400">Nhập thông tin xác thực để mở khóa hệ thống.</p>
            </div>

            {isBooting ? (
              // Màn hình chờ Booting giả lập (Loading ban đầu)
              <div className="h-[300px] flex flex-col items-center justify-center space-y-4">
                 <Loader2 size={48} className="text-cyan-400 animate-spin" />
                 <div className="text-xs font-mono text-cyan-400 animate-pulse">LOADING SECURITY MODULES...</div>
                 <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }} 
                      className="h-full bg-cyan-400" 
                    />
                 </div>
              </div>
            ) : (
              // Form chính thức
              <form action={formAction} className="space-y-6">
                
                <CyberInput 
                  name="username" 
                  type="text" 
                  placeholder="Commander ID" 
                  icon={User}
                  isFocused={focusedField === 'username'}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                />

                <CyberInput 
                  name="password" 
                  type="password" 
                  placeholder="••••••••••••" 
                  icon={Key}
                  isFocused={focusedField === 'password'}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />

                <div className="flex justify-between items-center text-xs text-gray-500">
                   <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                      <input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-cyan-500 focus:ring-0" />
                      Ghi nhớ phiên đăng nhập
                   </label>
                   <a href="#" className="hover:text-cyan-400 transition-colors">Quên mật mã?</a>
                </div>

                {/* Error Message Area */}
                <AnimatePresence>
                  {state?.error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 overflow-hidden"
                    >
                      <AlertTriangle size={18} className="text-red-500 shrink-0" />
                      <span className="text-sm text-red-400">{state.error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button (Nút Kích Hoạt) */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isPending || state?.success}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 relative overflow-hidden group transition-all duration-300
                    ${isPending || state?.success 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                      : 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-white/10'
                    }
                  `}
                >
                  {/* Hiệu ứng quét sáng qua nút */}
                  {!isPending && !state?.success && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  )}

                  {isPending || state?.success ? (
                    <>
                      {state?.success ? <CheckCircle className="text-green-500" /> : <ScanFace className="animate-pulse" />}
                      <span className="font-mono">{state?.success ? 'ACCESS GRANTED' : 'VERIFYING BIOMETRICS...'}</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={20} /> TRUY CẬP HỆ THỐNG
                    </>
                  )}
                </motion.button>

                {/* Footer Link */}
                <div className="text-center pt-4">
                   <p className="text-gray-500 text-sm">
                      Chưa có mã định danh?{' '}
                      <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline decoration-cyan-500/50 underline-offset-4 transition-all">
                         Đăng ký thành viên mới
                      </Link>
                   </p>
                </div>

              </form>
            )}
          </div>
        </div>
      </motion.div>

      {/* Decorative Corner Elements (HUD UI) */}
      <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-white/20 rounded-tl-3xl pointer-events-none hidden lg:block"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-white/20 rounded-br-3xl pointer-events-none hidden lg:block"></div>
      
      <div className="absolute bottom-8 left-8 text-[10px] font-mono text-gray-600 hidden lg:block">
         <div>SECURE SERVER: NODE_ALPHA_01</div>
         <div>ENCRYPTION: AES-256-GCM</div>
      </div>

    </div>
  )
}