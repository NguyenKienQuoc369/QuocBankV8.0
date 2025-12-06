'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { register } from '@/app/actions/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    setError('')
    
    const result = await register(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      // Chuyển qua trang login khi thành công
      router.push('/login?success=true')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Hiệu ứng nền Neon */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[100px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">QUOC<span className="text-[#00ff88]">BANK</span></h1>
          <p className="text-gray-400 text-sm">Khởi tạo tài khoản ngân hàng số</p>
        </div>

        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Họ và tên</label>
            <input name="fullName" required placeholder="Ví dụ: Nguyễn Văn A" 
              className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-[#00ff88] focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Tên đăng nhập</label>
            <input name="username" required placeholder="username" 
              className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-[#00ff88] focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Mật khẩu</label>
            <input type="password" name="password" required placeholder="••••••••" 
              className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-[#00ff88] focus:outline-none transition-colors" />
          </div>

          {error && <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>}

          <button disabled={isLoading} 
            className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-lg hover:bg-[#00cc6a] transition-all disabled:opacity-50">
            {isLoading ? 'Đang xử lý...' : 'Mở Tài Khoản Ngay'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          Đã có tài khoản? <Link href="/login" className="text-[#00ff88] hover:underline">Đăng nhập</Link>
        </p>
      </motion.div>
    </div>
  )
}