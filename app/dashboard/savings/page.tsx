import React from 'react';
import { getMySavings } from '@/actions/savings';
import { SavingsPod } from '@/components/dashboard/SavingsPod';
import { Plus, Database } from 'lucide-react';
import Link from 'next/link';

export default async function SavingsPage() {
  const savingsList = await getMySavings();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <Database className="text-[#00ff88]" size={32} /> 
             Khoang Tích Lũy
           </h2>
           <p className="text-gray-400 mt-1">Nuôi dưỡng nguồn năng lượng tài chính của bạn</p>
        </div>
        
        <Link href="/dashboard/savings/create" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:scale-105 transition-all flex items-center gap-2">
           <Plus size={20} /> Kích hoạt khoang mới
        </Link>
      </div>

      {/* Grid danh sách */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {savingsList.length > 0 ? (
          savingsList.map((savings: any) => (
            <SavingsPod key={savings.id} savings={savings} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center glass-cockpit rounded-3xl border-dashed border-2 border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database size={40} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-300">Chưa có khoang năng lượng nào</h3>
            <p className="text-gray-500 mt-2">Hãy bắt đầu tích lũy để nhận lãi suất ưu đãi</p>
          </div>
        )}
      </div>
    </div>
  );
}