'use client'

import { useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createSavings } from '@/actions/savings';
import { FloatingInput } from '@/components/auth/FloatingInput';
import { Database, Wallet, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateSavingsPage() {
  const [state, formAction, isPending] = useActionState(createSavings, null);
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => router.push('/dashboard/savings'), 1500);
    }
  }, [state?.success, router]);

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Link href="/dashboard/savings" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={20} /> Quay lại khoang chứa
      </Link>

      <div className="glass-cockpit rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -mt-10 -mr-10"></div>

        <div className="relative z-10 mb-8">
          <h2 className="text-2xl font-bold text-white">Kích hoạt khoang mới</h2>
          <p className="text-gray-400">Chọn số lượng năng lượng muốn đóng băng để sinh lời</p>
        </div>

        {state?.success ? (
          <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
            <h3 className="text-xl font-bold text-green-400 mb-2">✅ Thành công!</h3>
            <p className="text-gray-300">{state.message}</p>
          </div>
        ) : (
          <form action={formAction} onSubmit={(evt) => {
              evt.preventDefault();
              handleSubmit((data) => {
                  const formData = new FormData();
                  Object.entries(data).forEach(([key, val]) => formData.append(key, String(val)));
                  formAction(formData);
              })(evt);
          }} className="space-y-6">
            
            <FloatingInput 
              label="Tên khoang ghi nhớ (Ví dụ: Mua tàu vũ trụ)" 
              icon={Database} 
              {...register('name', {required: true})}
              className="!bg-black/20"
            />

            <FloatingInput 
              label="Số tiền nạp (VND)" 
              icon={Wallet} 
              type="number"
              {...register('amount', {required: true, min: 1000000})}
              className="!bg-black/20 text-[#00ff88] font-mono text-xl"
            />

            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1 flex items-center gap-2"><Clock size={14}/> Kỳ hạn gửi</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: '1 Tháng', val: 1, rate: '5.5%' },
                  { label: '6 Tháng', val: 6, rate: '6.8%' },
                  { label: '12 Tháng', val: 12, rate: '7.5%' },
                ].map((opt) => (
                  <label key={opt.val} className="cursor-pointer">
                    <input type="radio" value={opt.val} {...register('termInMonths', {required: true})} className="peer sr-only" />
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 peer-checked:bg-indigo-600/20 peer-checked:border-indigo-500 peer-checked:shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all text-center group hover:bg-white/10">
                      <div className="font-bold text-white mb-1">{opt.label}</div>
                      <div className="text-xs text-[#00ff88] font-mono">{opt.rate}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {state?.message && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">{state.message}</p>}

            <button disabled={isPending} className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-white hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:scale-[1.02] transition-all relative overflow-hidden">
               {isPending ? 'Đang khởi tạo...' : 'Xác nhận kích hoạt'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}