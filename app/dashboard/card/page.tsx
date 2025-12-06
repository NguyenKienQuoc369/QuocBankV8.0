import React from 'react';
import { getMyCards } from '@/actions/card';
import { CardControlStation } from '@/components/dashboard/CardControlStation'; // Import cái mới tạo
import { CreditCard } from 'lucide-react';
import IssueVirtualCardButton from '@/components/dashboard/IssueVirtualCardButton';

export default async function CardsPage() {
  const cards = await getMyCards();

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <CreditCard className="text-[#00ff88]" size={32} /> 
             Kho Thẻ Tín Dụng
           </h2>
           <p className="text-gray-400 mt-1">Quản lý các công cụ thanh toán liên ngân hà</p>
        </div>
        <IssueVirtualCardButton />
      </div>

      {/* Danh sách thẻ */}
      <div className="grid grid-cols-1 gap-12">
        {cards.length > 0 ? (
          cards.map((card) => (
            <CardControlStation key={card.id} card={card} />
          ))
        ) : (
          <div className="p-10 text-center glass-cockpit rounded-3xl text-gray-400">
            Hiện chưa có thẻ nào được kích hoạt.
          </div>
        )}
      </div>
    </div>
  );
}