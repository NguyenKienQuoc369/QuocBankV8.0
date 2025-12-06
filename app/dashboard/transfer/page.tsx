'use client'

import { useActionState, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Wallet, Zap, CheckCircle } from 'lucide-react';
import { transferMoney } from '@/actions/transaction';
import { FloatingInput } from '@/components/auth/FloatingInput';
import { WarpSpeed } from '@/components/ui/WarpSpeed';

export default function TransferPage() {
  const [state, formAction, isPending] = useActionState(transferMoney, null);
  const { register, handleSubmit, reset } = useForm();
  const [showWarp, setShowWarp] = useState(false);

  // Kích hoạt Warp Speed khi đang gửi
  useEffect(() => {
    let rafId: number | null = null
    if (isPending) {
      rafId = requestAnimationFrame(() => setShowWarp(true))
    } else {
      // Giữ hiệu ứng thêm 1 chút sau khi xong cho mượt
      const timer = setTimeout(() => setShowWarp(false), 1000);
      return () => clearTimeout(timer);
    }
    return () => { if (rafId) cancelAnimationFrame(rafId) }
  }, [isPending]);

  // Reset form khi thành công
  useEffect(() => {
    if (state?.success) reset();
  }, [state?.success, reset]);

  return (
    <div className="max-w-2xl mx-auto py-10 relative">
      
      {/* HIỆU ỨNG VŨ TRỤ */}
      <WarpSpeed active={showWarp} />

      {/* TIÊU ĐỀ */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 mb-4 border border-indigo-500/50 animate-pulse">
          <Zap size={32} />
        </div>
        <h2 className="text-3xl font-bold text-white">Chuyển Năng Lượng</h2>
        <p className="text-gray-400 mt-2">Gửi tín dụng đến bất kỳ đâu trong thiên hà</p>
      </div>

      {/* FORM "KHOANG LÁI" */}
      <div className="glass-cockpit rounded-3xl p-8 md:p-10 relative overflow-hidden">
        
        {/* Nền trang trí */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

        {state?.success ? (
          // MÀN HÌNH THÀNH CÔNG
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <CheckCircle size={80} className="text-[#00ff88] mx-auto mb-6 drop-shadow-[0_0_20px_#00ff88]" />
            <h3 className="text-2xl font-bold text-white mb-2">Giao dịch hoàn tất!</h3>
            <p className="text-gray-300">{state.message}</p>
            <button 
              onClick={() => window.location.reload()} // Reset state đơn giản
              className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              Thực hiện giao dịch mới
            </button>
          </motion.div>
        ) : (
          // FORM NHẬP LIỆU
          <form action={formAction} onSubmit={(evt) => {
              evt.preventDefault();
              handleSubmit((data) => {
                  const formData = new FormData();
                  Object.entries(data).forEach(([key, val]) => formData.append(key, String(val)));
                  formAction(formData);
              })(evt);
          }} className="space-y-6 relative z-10">
            
            <div className="grid gap-6">
              {/* Người nhận */}
              <div className="space-y-2">
                <FloatingInput 
                  label="Tên định danh người nhận (Username)" 
                  icon={User} 
                  {...register('toUsername', { required: true })}
                  className="!bg-black/20"
                />
              </div>

              {/* Số tiền */}
              <div className="space-y-2">
                 <div className="relative group">
                    <FloatingInput 
                      label="Số lượng tín dụng (VND)" 
                      icon={Wallet} 
                      type="number"
                      {...register('amount', { required: true, min: 10000 })}
                      className="!bg-black/20 !text-2xl !font-mono text-[#00ff88]"
                    />
                    {/* Hiệu ứng glow khi focus vào tiền */}
                    <div className="absolute inset-0 rounded-xl bg-[#00ff88]/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none blur-md"></div>
                 </div>
              </div>

              {/* Lời nhắn */}
              <div>
                <textarea 
                  {...register('message')}
                  placeholder="Thông điệp gửi kèm (Tùy chọn)..."
                  className="w-full h-24 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Thông báo lỗi */}
            {state?.message && !state.success && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                ⚠️ {state.message}
              </div>
            )}

            {/* Nút Gửi - NÚT PHÓNG */}
            <button 
              disabled={isPending}
              className={`
                w-full py-5 rounded-2xl font-bold text-lg uppercase tracking-widest transition-all duration-300 relative overflow-hidden group
                ${isPending ? 'bg-gray-800 text-gray-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] hover:scale-[1.02]'}
              `}
            >
              {/* Hiệu ứng hạt năng lượng bên trong nút */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isPending ? 'Đang kích hoạt động cơ...' : <> <Send size={20} /> Phóng đi </>}
              </span>
            </button>

          </form>
        )}
      </div>

      {/* Danh sách người nhận gần đây (Giả lập để nhìn cho đẹp) */}
      <div className="mt-8">
        <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Liên lạc gần đây</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[1,2,3,4,5].map((_, i) => (
             <button key={i} className="flex flex-col items-center gap-2 min-w-[70px] opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center">
                   <User className="text-gray-400" />
                </div>
                <span className="text-xs text-gray-400">User_{i+1}</span>
             </button>
          ))}
        </div>
      </div>
    </div>
  );
}