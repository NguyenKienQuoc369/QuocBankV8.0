import React from 'react';
import { getMySavings, getPiggyBanks } from '@/app/actions/savings';
import { SavingsPod } from '@/components/dashboard/SavingsPod';
import { SavingsPanel } from '@/components/savings/SavingsPanel';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Plus, Database, PiggyBank } from 'lucide-react';
import Link from 'next/link';

export default async function SavingsPage() {
  const payload = await getSession();
  if (!payload) redirect('/login');

  const account = await prisma.account.findFirst({
    where: { userId: payload.id as string },
    select: { id: true, balance: true }
  });

  if (!account) redirect('/dashboard');

  const savingsList = await getMySavings();
  const piggyBanks = await getPiggyBanks();

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <Database className="text-cyan-400" size={32} /> 
             Tiết Kiệm & Ống Heo
           </h2>
           <p className="text-gray-400 mt-1">Quản lý các khoảng tiết kiệm và mục tiêu tài chính của bạn</p>
        </div>
      </div>

      {/* Savings Panel */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl md:rounded-3xl border border-cyan-500/30 p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
        <SavingsPanel currentBalance={account.balance} />
      </div>

      {/* Savings Accounts */}
      {savingsList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Sổ Tiết Kiệm Của Bạn</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savingsList.map((savings: any) => (
              <SavingsPod key={savings.id} savings={savings} />
            ))}
          </div>
        </div>
      )}

      {/* Piggy Banks */}
      {piggyBanks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-6 h-6 text-pink-400" />
            <h3 className="text-xl font-bold text-white">Ống Heo Tiết Kiệm</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {piggyBanks.map((piggy: any) => (
              <div key={piggy.id} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-pink-500/30 p-4 hover:border-pink-500/60 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-white">{piggy.name}</h4>
                    <p className="text-sm text-gray-400">Mục tiêu: {piggy.targetAmount.toLocaleString('vi-VN')} đ</p>
                  </div>
                  <span className="text-2xl">{piggy.icon === 'pig' ? '🐷' : piggy.icon === 'heart' ? '❤️' : piggy.icon === 'target' ? '🎯' : piggy.icon === 'home' ? '🏠' : piggy.icon === 'plane' ? '✈️' : '🚗'}</span>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                    style={{ width: `${(piggy.currentAmount / piggy.targetAmount) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400">
                  Đã tiết kiệm: {piggy.currentAmount.toLocaleString('vi-VN')} / {piggy.targetAmount.toLocaleString('vi-VN')} đ
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {savingsList.length === 0 && piggyBanks.length === 0 && (
        <div className="py-20 text-center bg-white/5 rounded-3xl border-dashed border-2 border-white/10">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database size={40} className="text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-300">Chưa có sổ tiết kiệm nào</h3>
          <p className="text-gray-500 mt-2">Hãy bắt đầu mở sổ tiết kiệm hoặc ống heo để quản lý tài chính</p>
        </div>
      )}
    </div>
  );
}
// Import TrendingUp icon
import { TrendingUp } from 'lucide-react';
