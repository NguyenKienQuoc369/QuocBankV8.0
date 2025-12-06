'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    setError('')
    
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push('/dashboard') // Chuyển vào trang chính
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Hiệu ứng nền Neon khác màu */}
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Đăng Nhập</h1>
          <p className="text-gray-400 text-sm">Chào mừng quay trở lại QuocBank</p>
        </div>

        <form action={onSubmit} className="space-y-5">
          <div className="group">
            <label className="text-gray-300 text-sm mb-1 block group-focus-within:text-[#00ff88] transition-colors">Tài khoản</label>
            <input name="username" required 
              className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-[#00ff88] focus:outline-none transition-colors" />
          </div>
          <div className="group">
            <label className="text-gray-300 text-sm mb-1 block group-focus-within:text-[#00ff88] transition-colors">Mật khẩu</label>
            <input type="password" name="password" required 
              className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-[#00ff88] focus:outline-none transition-colors" />
          </div>

          {error && <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>}

          <button disabled={isLoading} 
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] disabled:opacity-50">
            {isLoading ? 'Đang xác thực...' : 'Truy cập Két sắt'}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-400 text-sm">
          Chưa có tài khoản? <Link href="/register" className="text-[#00ff88] hover:underline font-bold">Mở thẻ ngay</Link>
        </p>
      </motion.div>
    </div>
  )
}