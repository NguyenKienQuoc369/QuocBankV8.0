'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { QuickTopup } from '@/components/topup/QuickTopup';

interface QuickTopupClientProps {
  accountId: string;
  currentBalance: number;
}

export function QuickTopupClient({ accountId, currentBalance }: QuickTopupClientProps) {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
      >
        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        <span>Quay lại Dashboard</span>
      </Link>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Nạp Tiền</h1>
        <p className="text-gray-400">Tăng số dư tài khoản của bạn ngay lập tức</p>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl md:rounded-3xl border border-green-500/30 p-6 md:p-8 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
        <QuickTopup 
          accountId={accountId} 
          currentBalance={currentBalance}
        />
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-xl p-4">
          <div className="text-2xl mb-2">⚡</div>
          <h4 className="font-semibold text-green-400 mb-1 text-sm md:text-base">Tức thời</h4>
          <p className="text-xs md:text-sm text-gray-400">
            Số tiền được cộng vào ngay lập tức
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-xl p-4">
          <div className="text-2xl mb-2">🔒</div>
          <h4 className="font-semibold text-green-400 mb-1 text-sm md:text-base">An toàn</h4>
          <p className="text-xs md:text-sm text-gray-400">
            Tất cả giao dịch được bảo mật
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-xl p-4">
          <div className="text-2xl mb-2">💰</div>
          <h4 className="font-semibold text-green-400 mb-1 text-sm md:text-base">Miễn phí</h4>
          <p className="text-xs md:text-sm text-gray-400">
            Không tính phí xử lý
          </p>
        </div>
      </div>
    </div>
  );
}
