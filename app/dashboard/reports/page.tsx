import React from 'react';
import { getTransactionHistory } from '@/actions/history';
import { HolographicTable } from '@/components/dashboard/HolographicTable';
import { FileText, Download } from 'lucide-react';

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> // Next.js 15 type
}) {
  // Await searchParams (Next.js 15 requirement)
  const params = await searchParams;
  const page = typeof params.page === 'string' ? Number(params.page) : 1;
  const type = typeof params.type === 'string' ? params.type : 'ALL';

  const { transactions, totalPages } = await getTransactionHistory(page, type);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <FileText className="text-[#00ff88]" size={32} /> 
             Nhật Ký Giao Dịch
           </h2>
           <p className="text-gray-400 mt-1">Truy xuất toàn bộ lịch sử dòng tiền trong không gian</p>
        </div>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 flex items-center gap-2 transition-all">
           <Download size={16} /> Xuất CSV
        </button>
      </div>

      {/* Main Table */}
      <HolographicTable initialData={transactions} totalPages={totalPages} />
      
    </div>
  );
}