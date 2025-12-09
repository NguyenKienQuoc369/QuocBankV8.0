import React from 'react';
export const dynamic = 'force-dynamic'
import { getDashboardData } from '@/actions/dashboard';
import { formatVND } from '@/lib/utils';
import { ArrowUpRight, CreditCard, TrendingUp, Wallet, Send } from 'lucide-react';
import DashboardGlobe from '@/components/dashboard/DashboardGlobe';
import Link from 'next/link';

export default async function DashboardPage() {
  const data = await getDashboardData();
  
  if ('error' in data) return <div className="p-10 text-red-400">Error: {data.error}</div>;
  const { user, account, transactions } = data;

  // Calculate some stats
  const recentIncome = transactions
    .filter((t: any) => t.toAccountId === account.id)
    .slice(0, 5)
    .reduce((sum: number, t: any) => sum + t.amount, 0);
  
  const recentExpense = transactions
    .filter((t: any) => t.fromAccountId === account.id)
    .slice(0, 5)
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Welcome Section */}
      <div className="glass-cockpit rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Xin chào, {user.fullName}! 👋
        </h1>
        <p className="text-gray-400">Chào mừng trở lại với QuocBank</p>
      </div>

      {/* 3D Globe */}
      <div className="glass-cockpit rounded-3xl p-4">
        <DashboardGlobe balance={account.balance} userName={user.fullName} />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-cockpit rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-2">Số dư khả dụng</h3>
          <p className="text-2xl font-bold text-white">{formatVND(account.balance)}</p>
        </div>

        <div className="glass-cockpit rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-green-400">+{formatVND(recentIncome)}</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-2">Thu nhập gần đây</h3>
          <p className="text-2xl font-bold text-white">
            {transactions.filter((t: any) => t.toAccountId === account.id).length} giao dịch
          </p>
        </div>

        <div className="glass-cockpit rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600">
              <Send className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-red-400">-{formatVND(recentExpense)}</span>
          </div>
          <h3 className="text-gray-400 text-sm mb-2">Chi tiêu gần đây</h3>
          <p className="text-2xl font-bold text-white">
            {transactions.filter((t: any) => t.fromAccountId === account.id).length} giao dịch
          </p>
        </div>

        <div className="glass-cockpit rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-2">Thẻ đang dùng</h3>
          <p className="text-2xl font-bold text-white">
            {account.card ? '1 thẻ' : 'Chưa có thẻ'}
          </p>
          {account.card && (
            <p className="text-sm text-gray-500 mt-1">**** {account.card.cardNumber.slice(-4)}</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/transfer" className="glass-cockpit rounded-2xl p-6 hover:scale-105 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 group-hover:scale-110 transition-transform">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Chuyển tiền</h3>
              <p className="text-sm text-gray-400">Gửi tiền nhanh chóng</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/card" className="glass-cockpit rounded-2xl p-6 hover:scale-105 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Quản lý thẻ</h3>
              <p className="text-sm text-gray-400">Xem và điều khiển thẻ</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/bills" className="glass-cockpit rounded-2xl p-6 hover:scale-105 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Thanh toán</h3>
              <p className="text-sm text-gray-400">Hóa đơn & dịch vụ</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="glass-cockpit rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Giao dịch gần đây</h3>
          <Link href="/dashboard/reports" className="text-sm text-indigo-400 hover:text-white transition-colors flex items-center gap-1">
            Xem tất cả <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {transactions.slice(0, 5).map((tx: any) => {
            const isIncoming = tx.toAccountId === account.id;
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isIncoming ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {isIncoming ? '↓' : '↑'}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {tx.description || (isIncoming ? 'Nhận tiền' : 'Chuyển tiền')}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${isIncoming ? 'text-green-400' : 'text-red-400'}`}>
                    {isIncoming ? '+' : '-'}{formatVND(tx.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{tx.type}</p>
                </div>
              </div>
            );
          })}
          
          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Chưa có giao dịch nào
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
