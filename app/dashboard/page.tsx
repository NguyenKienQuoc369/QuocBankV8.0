import React from 'react';
import { getDashboardData } from '@/actions/dashboard';
import { formatVND } from '@/lib/utils';
import { Scene } from '@/components/3d/Scene';
import { DashboardScene } from '@/components/3d/DashboardScene';

// Import các Widget "Vũ trụ" (Sẽ tạo ở bước 3)
import { StatCard } from '@/components/dashboard/statcard';
import { RevenueChart } from '@/components/dashboard/revenuechart';
import { RecentTransactions } from '@/components/dashboard/recenttransaction';
import { QuickTransfer } from '@/components/dashboard/quicktransfer';
import { CreditCard3D } from '@/components/dashboard/creditcard3d';

export default async function DashboardPage() {
  const data = await getDashboardData();
  
  if ('error' in data) return <div className="p-10 text-red-400">Error: {data.error}</div>;
  const { user, account, transactions } = data;

  return (
    <div className="space-y-6 pb-20">
      
      {/* SECTION 1: CÁC CHỈ SỐ QUAN TRỌNG (STATS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Tổng tài sản thực" 
          value={formatVND(account.balance)} 
          trend="+12.5%" 
          icon="wallet" 
          color="indigo"
        />
        <StatCard 
          title="Thu nhập tháng" 
          value={formatVND(15000000)} 
          trend="+8.2%" 
          icon="chart" 
          color="green"
        />
        <StatCard 
          title="Chi tiêu tháng" 
          value={formatVND(4200000)} 
          trend="-2.4%" 
          icon="expense" 
          color="red"
        />
        <StatCard 
          title="Điểm tín dụng" 
          value="850" 
          subValue="Hạng Diamond"
          icon="shield" 
          color="purple"
        />
      </div>

      {/* SECTION 2: BIỂU ĐỒ & THẺ (MAIN VISUAL) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[450px]">
        {/* Biểu đồ dòng tiền (Chiếm 2 phần) */}
        <div className="lg:col-span-2 glass-cockpit rounded-3xl p-6 flex flex-col">
          <h3 className="text-lg font-bold mb-4 text-indigo-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"/>
            Phân tích dòng tiền (Real-time)
          </h3>
          <div className="flex-1 w-full h-full min-h-0">
            <RevenueChart />
          </div>
        </div>

        {/* Thẻ 3D & Scene (Chiếm 1 phần) */}
        <div className="glass-cockpit rounded-3xl relative overflow-hidden group">
           <div className="absolute inset-0 z-0 opacity-60">
             <Scene>
                <DashboardScene balance={account.balance} userName={user.username} />
             </Scene>
           </div>
           <div className="relative z-10 p-6 flex flex-col h-full justify-between pointer-events-none">
              <div>
                <h3 className="text-lg font-bold text-white">Thẻ ảo Platinum</h3>
                <p className="text-sm text-gray-400">**** **** **** {account.card?.cardNumber.slice(-4) || '0000'}</p>
              </div>
              <div className="pointer-events-auto transform group-hover:scale-105 transition-transform duration-500">
                <CreditCard3D 
                  cardNumber={account.card?.cardNumber || ''} 
                  holder={user.name || user.username} 
                  expiry={account.card?.expiryDate || ''}
                />
              </div>
           </div>
        </div>
      </div>

      {/* SECTION 3: GIAO DỊCH & CHUYỂN TIỀN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Danh sách giao dịch */}
        <div className="lg:col-span-2 glass-cockpit rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Lịch sử hoạt động</h3>
            <button className="text-xs text-indigo-400 hover:text-white transition-colors border border-indigo-500/30 px-3 py-1 rounded-full">Xuất báo cáo</button>
          </div>
          <RecentTransactions transactions={transactions} currentUserId={account.userId} />
        </div>

        {/* Chuyển tiền nhanh */}
        <div className="glass-cockpit rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Chuyển tốc độ ánh sáng</h3>
          <QuickTransfer />
        </div>
      </div>

    </div>
  );
}