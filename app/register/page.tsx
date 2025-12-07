'use client'

import { useState, useActionState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { register } from '@/app/actions/auth' // Import server action gốc
import { CosmicBackground } from '@/components/ui/CosmicBackground' 
import AuthOrb from '@/components/auth/AuthOrb'
import { Rocket, User, Lock, Mail, Loader2, CheckCircle2 } from 'lucide-react'

const initialState = {
  message: '',
  error: '',
  success: false
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, initialState)
  const [isFocused, setIsFocused] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => {
        router.push('/login?success=true')
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [state?.success, router])

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <CosmicBackground />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Main Container - Split Layout */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-6xl min-h-[650px] grid grid-cols-1 lg:grid-cols-5 rounded-3xl overflow-hidden border border-[#00ff88]/20 shadow-[0_0_60px_rgba(0,255,136,0.15)] bg-black/40 backdrop-blur-2xl"
      >
        
        {/* Cột Trái: Artwork (Chiếm 2/5) */}
        <div className="hidden lg:flex lg:col-span-2 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-[#004d29] to-black border-r border-white/5">
          <AuthOrb color="#00ff88" /> 
          
          <div className="relative z-10">
            <Link href="/" className="inline-block mb-8 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 rounded-xl bg-[#00ff88] flex items-center justify-center font-bold text-2xl text-black shadow-[0_0_20px_rgba(0,255,136,0.5)]">Q</div>
            </Link>
            
            <h1 className="text-4xl font-bold leading-tight mb-6">
              Gia Nhập <br />
              <span className="text-[#00ff88]">Phi Hành Đoàn</span>
            </h1>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-[#00ff88] mt-1">
                  <Rocket size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Tài khoản Standard</h3>
                  <p className="text-sm text-gray-400">Tặng ngay 50.000đ khi khởi tạo.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-[#00ff88] mt-1">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Thẻ ảo Platinum</h3>
                  <p className="text-sm text-gray-400">Phát hành tức thì, phí 0đ.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-gray-500 leading-relaxed">
            Bằng việc đăng ký, bạn đồng ý với Điều khoản du hành liên sao và Chính sách bảo mật dữ liệu lượng tử của QuocBank.
          </div>
        </div>

        {/* Cột Phải: Form (Chiếm 3/5) */}
        <div className="lg:col-span-3 flex items-center justify-center p-8 lg:p-12 bg-white/[0.02]">
          
          {state?.success ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="w-24 h-24 rounded-full bg-[#00ff88]/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} className="text-[#00ff88]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Đăng Ký Thành Công!</h2>
              <p className="text-gray-400 mb-6">Hệ thống đang điều hướng bạn đến trạm trung chuyển...</p>
              <Loader2 className="animate-spin mx-auto text-[#00ff88]" size={24} />
            </motion.div>
          ) : (
            <div className="w-full max-w-md space-y-6">
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-bold text-white">Tạo Hồ Sơ Mới</h2>
                <p className="text-gray-400 mt-1">Điền thông tin để kích hoạt khoang cá nhân.</p>
              </div>

              <form action={formAction} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Họ và tên</label>
                  <div className={`group relative flex items-center transition-all duration-300 ${isFocused === 'fullName' ? 'scale-[1.02]' : ''}`}>
                    <div className="absolute left-4 text-gray-400 group-focus-within:text-[#00ff88] transition-colors">
                      <User size={20} />
                    </div>
                    <input 
                      name="fullName" 
                      required
                      onFocus={() => setIsFocused('fullName')}
                      onBlur={() => setIsFocused(null)}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff88] focus:bg-[#00ff88]/5 transition-all"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Tên đăng nhập</label>
                  <div className={`group relative flex items-center transition-all duration-300 ${isFocused === 'username' ? 'scale-[1.02]' : ''}`}>
                    <div className="absolute left-4 text-gray-400 group-focus-within:text-[#00ff88] transition-colors">
                      <Mail size={20} />
                    </div>
                    <input 
                      name="username" 
                      required
                      onFocus={() => setIsFocused('username')}
                      onBlur={() => setIsFocused(null)}
                      placeholder="username123"
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff88] focus:bg-[#00ff88]/5 transition-all"
                    />
                  </div>
                </div>

                {/* Password Groups */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Mật khẩu</label>
                    <div className={`group relative flex items-center transition-all duration-300 ${isFocused === 'password' ? 'scale-[1.02]' : ''}`}>
                      <div className="absolute left-4 text-gray-400 group-focus-within:text-[#00ff88] transition-colors">
                        <Lock size={20} />
                      </div>
                      <input 
                        name="password" 
                        type="password"
                        required
                        onFocus={() => setIsFocused('password')}
                        onBlur={() => setIsFocused(null)}
                        placeholder="••••••••"
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff88] focus:bg-[#00ff88]/5 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Xác nhận</label>
                    <div className={`group relative flex items-center transition-all duration-300 ${isFocused === 'confirmPassword' ? 'scale-[1.02]' : ''}`}>
                      <div className="absolute left-4 text-gray-400 group-focus-within:text-[#00ff88] transition-colors">
                        <Lock size={20} />
                      </div>
                      <input 
                        name="confirmPassword" 
                        type="password"
                        required
                        onFocus={() => setIsFocused('confirmPassword')}
                        onBlur={() => setIsFocused(null)}
                        placeholder="••••••••"
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff88] focus:bg-[#00ff88]/5 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Error Box */}
                {state?.error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {state.error}
                  </motion.div>
                )}

                {/* Submit */}
                <button 
                  disabled={isPending}
                  className="w-full py-4 mt-4 bg-[#00ff88] hover:bg-[#00cc6a] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:shadow-[0_0_30px_rgba(0,255,136,0.6)] transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Đang khởi tạo...
                    </>
                  ) : (
                    <>
                      <Rocket size={20} /> Xác Nhận Khởi Tạo
                    </>
                  )}
                </button>
              </form>

              <div className="pt-6 border-t border-white/10 text-center">
                <p className="text-gray-400 text-sm">
                  Đã có mã định danh?{' '}
                  <Link href="/login" className="text-[#00ff88] font-semibold hover:underline transition-colors">
                    Đăng nhập tại đây
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}