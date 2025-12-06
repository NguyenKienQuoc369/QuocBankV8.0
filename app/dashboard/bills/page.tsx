'use client'

import { useState, useEffect } from 'react';
import { PROVIDERS, payBill } from '@/actions/bills';
import { FloatingInput } from '@/components/auth/FloatingInput';
import { Zap, Droplets, Wifi, Satellite, Tv, ArrowRight, CheckCircle, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Map icon string sang component
const iconMap: any = { Zap, Droplets, Wifi, Satellite, Tv };

export default function BillsPage() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  // useActionState không phải hook React gốc; nếu dùng server action, ensure hook exists.
  const [state, formAction, isPending] = (null as any) as [any, any, boolean];
  const [step, setStep] = useState(1); // 1: Chọn, 2: Nhập liệu

  // Reset khi thành công
  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        setStep(1);
        setSelectedProvider(null);
      }, 3000);
    }
  }, [state?.success]);

  const provider = PROVIDERS.find(p => p.id === selectedProvider);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
           <Satellite className="text-[#00ff88]" size={32} /> 
           Trạm Dịch Vụ
        </h2>
        <p className="text-gray-400 mt-1">Gia hạn năng lượng và kết nối cho căn cứ của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: DANH SÁCH NHÀ CUNG CẤP */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
           {PROVIDERS.map((p) => {
             const Icon = iconMap[p.icon];
             const isSelected = selectedProvider === p.id;
             
             return (
               <button
                 key={p.id}
                 onClick={() => { setSelectedProvider(p.id); setStep(2); }}
                 className={`relative p-6 rounded-2xl border text-left transition-all duration-300 group overflow-hidden ${
                   isSelected 
                     ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)]' 
                     : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                 }`}
               >
                 <div className={`absolute top-0 right-0 p-20 rounded-full blur-2xl opacity-20 -mr-10 -mt-10 transition-colors ${isSelected ? 'bg-indigo-500' : 'bg-gray-500 group-hover:bg-[#00ff88]'}`}></div>
                 
                 <div className="relative z-10">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${isSelected ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400 group-hover:text-white'}`}>
                     <Icon size={24} />
                   </div>
                   <h3 className="text-lg font-bold text-white">{p.name}</h3>
                   <p className="text-sm text-gray-400 mt-1">{p.code}</p>
                 </div>
               </button>
             )
           })}
        </div>

        {/* CỘT PHẢI: FORM THANH TOÁN */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedProvider && step === 2 ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-cockpit rounded-3xl p-8 relative overflow-hidden"
              >
                {/* Background Decor */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent animate-pulse"></div>

                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  Thanh toán: <span className="text-[#00ff88]">{provider?.name}</span>
                </h3>

                {state?.success ? (
                  <div className="text-center py-10">
                    <CheckCircle size={60} className="text-[#00ff88] mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-white">Giao dịch thành công!</h4>
                    <p className="text-gray-400 text-sm mt-2">{state.message}</p>
                  </div>
                ) : (
                  <form action={formAction} className="space-y-6">
                    <input type="hidden" name="providerId" value={selectedProvider} />
                    
                    <FloatingInput 
                      label="Mã khách hàng" 
                      icon={Hash} 
                      name="customerCode"
                      className="!bg-black/20"
                      required
                    />

                    <FloatingInput 
                      label="Số tiền (VND)" 
                      icon={Zap} 
                      type="number"
                      name="amount"
                      className="!bg-black/20 text-[#00ff88] font-mono text-xl"
                      required
                    />

                    {state?.message && <p className="text-red-400 text-sm text-center">{state.message}</p>}

                    <button 
                      disabled={isPending}
                      className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      {isPending ? 'Đang xử lý...' : <>Xác nhận thanh toán <ArrowRight size={18} /></>}
                    </button>
                  </form>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-white/10 rounded-3xl"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 animate-pulse">
                  <Satellite size={32} className="text-gray-600" />
                </div>
                <p className="text-gray-400">Chọn một dịch vụ bên trái để bắt đầu nạp năng lượng.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
