'use client';

import { useState, useEffect } from 'react';
import { Gift, TrendingUp, Coins, ArrowRight, Sparkles } from 'lucide-react';
import { getCashbackBalance, getCashbackHistory, redeemCashback, getTotalCashbackEarned } from '@/actions/cashback';

interface CashbackHistoryItem {
  id: string;
  amount: number;
  source: string;
  status: string;
  createdAt: Date;
}

interface CashbackDashboardProps {
  accountId: string;
}

export function CashbackDashboard({ accountId }: CashbackDashboardProps) {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<CashbackHistoryItem[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [balanceResult, historyResult, totalResult] = await Promise.all([
      getCashbackBalance(accountId),
      getCashbackHistory(accountId),
      getTotalCashbackEarned(accountId),
    ]);

    if (balanceResult.success) {
      setBalance(balanceResult.balance || 0);
    }

    if (historyResult.success && historyResult.data) {
      setHistory(historyResult.data);
    }

    if (totalResult.success) {
      setTotalEarned(totalResult.total || 0);
    }
  };

  const handleRedeem = async () => {
    if (balance < 100000) {
      setMessage({ type: 'error', text: 'Cần tối thiểu 100,000đ để rút tiền hoàn trả' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await redeemCashback(accountId);
    setLoading(false);

    if (result.success) {
      setMessage({
        type: 'success',
        text: `Rút ${result.amount?.toLocaleString('vi-VN')}đ thành công! Số dư mới: ${result.newBalance?.toLocaleString('vi-VN')}đ`,
      });
      loadData();
    } else {
      setMessage({ type: 'error', text: result.error || 'Có lỗi xảy ra' });
    }
  };

  const getSourceLabel = (source: string) => {
    const labels: { [key: string]: string } = {
      BILL_PAYMENT: 'Thanh toán hóa đơn',
      TRANSFER: 'Chuyển tiền',
      MOBILE_RECHARGE: 'Nạp điện thoại',
      CARD_TOPUP: 'Nạp thẻ',
    };
    return labels[source] || source;
  };

  const progress = Math.min((balance / 100000) * 100, 100);
  const canRedeem = balance >= 100000;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-6 border border-green-500/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-green-600/20 flex items-center justify-center">
            <Gift className="w-7 h-7 text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Hoàn tiền Cashback</h2>
            <p className="text-gray-400 mt-1">Nhận 0.5% hoàn tiền mọi giao dịch</p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-xl ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Current Balance */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Số dư hoàn tiền</div>
            <Coins className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400 mb-4">
            {balance.toLocaleString('vi-VN')}đ
          </div>
          
          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Tiến trình rút tiền</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {canRedeem ? '✓ Đủ điều kiện rút tiền' : `Còn ${(100000 - balance).toLocaleString('vi-VN')}đ nữa`}
            </div>
          </div>

          <button
            onClick={handleRedeem}
            disabled={loading || !canRedeem}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            {loading ? 'Đang xử lý...' : canRedeem ? 'Rút tiền ngay' : 'Chưa đủ điều kiện'}
          </button>
        </div>

        {/* Total Earned */}
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Tổng đã nhận</div>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {totalEarned.toLocaleString('vi-VN')}đ
          </div>
          <div className="text-sm text-gray-400">
            {history.length} giao dịch hoàn tiền
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          Cách hoạt động
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-cyan-400">1</span>
            </div>
            <div className="font-bold text-white mb-1">Giao dịch</div>
            <div className="text-sm text-gray-400">Thanh toán dịch vụ hoặc chuyển tiền</div>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-green-400">2</span>
            </div>
            <div className="font-bold text-white mb-1">Nhận 0.5%</div>
            <div className="text-sm text-gray-400">Tự động tích lũy hoàn tiền</div>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-yellow-400">3</span>
            </div>
            <div className="font-bold text-white mb-1">Rút tiền</div>
            <div className="text-sm text-gray-400">Khi đạt 100,000đ</div>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Lịch sử hoàn tiền</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Gift className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có lịch sử hoàn tiền</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/10"
              >
                <div>
                  <div className="font-bold text-white">{getSourceLabel(item.source)}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">+{item.amount.toLocaleString('vi-VN')}đ</div>
                  <div
                    className={`text-xs ${
                      item.status === 'REDEEMED' ? 'text-gray-500' : 'text-yellow-400'
                    }`}
                  >
                    {item.status === 'REDEEMED' ? 'Đã rút' : 'Chờ rút'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
