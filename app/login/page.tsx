'use client'

import { useState, useActionState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { login } from '@/app/actions/auth' // Import server action gốc
import { WarpSpeed } from '@/components/ui/warpspeed' // Đảm bảo đúng đường dẫn file bạn đã có
import AuthOrb from '@/components/auth/AuthOrb'
import { LogIn, Key, User, Loader2, ShieldCheck } from 'lucide-react'

const initialState = {
  message: '',
  error: '',
  success: false
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)
  const [isFocused, setIsFocused] = useState<string | null>(null)

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <WarpSpeed active={true} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
      </div>

      {/* Main Container - Split Layout */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl h-[600px] grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(79,70,229,0.3)] bg-black/40 backdrop-blur-xl"
      >
        
        {/* Cột trái: Artwork 3D */}
        <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-indigo-900/40 to-black">
          <AuthOrb color="#4f46e5" /> 
          
          <div className="relative z-10">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center font-bold text-xl shadow-[0_0_15px_#4f46e5]">Q</div>
              <span className="text-2xl font-bold tracking-widest">QUOC<span className="text-indigo-400">BANK</span></span>
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-5xl font-bold leading-tight mb-4"
            >
              Truy Cập <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Trung Tâm Chỉ Huy
              </span>
            </motion.h1>
            <p className="text-gray-400 text-lg max-w-sm">
              Hệ thống tài chính lượng tử an toàn nhất dải ngân hà. Đăng nhập để quản lý tài sản số của bạn.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#00ff88]" />
              <span>Mã hóa lượng tử 256-bit</span>
            </div>
            <div className="w-1 h-1 bg-gray-500 rounded-full" />
            <span>Ver 2.0.4</span>
          </div>
        </div>

        {/* Cột phải: Form Đăng nhập */}
        <div className="flex items-center justify-center p-8 lg:p-12 bg-white/5 relative">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold mb-2 lg:hidden">Đăng Nhập</h2>
              <p className="text-gray-400">Nhập thông tin xác thực phi hành đoàn.</p>
            </div>

            <form action={formAction} className="space-y-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Mã định danh</label>
                <div className={`group relative flex items-center transition-all duration-300 ${isFocused === 'username' ? 'scale-[1.02]' : ''}`}>
                  <div className="absolute left-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors">
                    <User size={20} />
                  </div>
                  <input 
                    name="username" 
                    type="text" 
                    required
                    onFocus={() => setIsFocused('username')}
                    onBlur={() => setIsFocused(null)}
                    placeholder="Tên đăng nhập"
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-indigo-500/10 transition-all shadow-inner"
                  />
                  <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none ${isFocused === 'username' ? 'opacity-100 shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'opacity-0'}`} />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mật mã</label>
                </div>
                <div className={`group relative flex items-center transition-all duration-300 ${isFocused === 'password' ? 'scale-[1.02]' : ''}`}>
                  <div className="absolute left-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors">
                    <Key size={20} />
                  </div>
                  <input 
                    name="password" 
                    type="password" 
                    required
                    onFocus={() => setIsFocused('password')}
                    onBlur={() => setIsFocused(null)}
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-indigo-500/10 transition-all shadow-inner"
                  />
                  <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none ${isFocused === 'password' ? 'opacity-100 shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'opacity-0'}`} />
                </div>
              </div>

              {/* Error Message */}
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

              {/* Submit Button */}
              <button 
                disabled={isPending}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Đang xác thực...
                  </>
                ) : (
                  <>
                    <LogIn size={20} /> Kích Hoạt Kết Nối
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-gray-400 text-sm">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-white font-semibold hover:text-indigo-400 hover:underline transition-colors">
                Đăng ký thành viên mới
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}