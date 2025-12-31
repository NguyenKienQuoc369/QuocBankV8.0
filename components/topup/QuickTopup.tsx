'use client';

import { useState } from 'react';
import { Wallet, Check, AlertCircle } from 'lucide-react';
import { topupAccount } from '@/actions/topup';
import { formatVND } from '@/lib/utils';

interface QuickTopupProps {
  accountId: string;
  currentBalance: number;
  onSuccess?: (newBalance: number) => void;
}

export function QuickTopup({ accountId, currentBalance, onSuccess }: QuickTopupProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);

  const presetAmounts = [50000, 100000, 500000, 1000000];

  const handleQuickTopup = async (quickAmount: number) => {
    setLoading(true);
    setMessage(null);

    const result = await topupAccount(accountId, quickAmount);
    setLoading(false);

    if (result.success && result.balance) {
      setMessage({ 
        type: 'success', 
        text: `Nạp tiền thành công! Số dư mới: ${formatVND(result.balance)}` 
      });
      setAmount('');
      if (onSuccess) onSuccess(result.balance);
      setTimeout(() => {
        setMessage(null);
        setShowForm(false);
      }, 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Có lỗi xảy ra' });
    }
  };

  const handleCustomTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const topupAmount = parseFloat(amount);
    if (isNaN(topupAmount) || topupAmount <= 0) {
      setMessage({ type: 'error', text: 'Vui lòng nhập số tiền hợp lệ' });
      return;
    }

    if (topupAmount < 10000) {
      setMessage({ type: 'error', text: 'Số tiền tối thiểu là 10,000 VND' });
      return;
    }

    await handleQuickTopup(topupAmount);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
          <Wallet className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Nạp tiền nhanh</h3>
          <p className="text-sm text-gray-400">Số dư hiện tại: {formatVND(currentBalance)}</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${
          message.type === 'success'
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          {message.type === 'success' ? (
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          )}
          <p className={message.type === 'success' ? 'text-green-300' : 'text-red-300'}>
            {message.text}
          </p>
        </div>
      )}

      {!showForm ? (
        <>
          {/* Preset Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {presetAmounts.map((presetAmount) => (
              <button
                key={presetAmount}
                onClick={() => handleQuickTopup(presetAmount)}
                disabled={loading}
                className="p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 hover:border-green-500/60 text-white font-semibold text-sm md:text-base transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : formatVND(presetAmount)}
              </button>
            ))}
          </div>

          {/* Custom Amount Button */}
          <button
            onClick={() => setShowForm(true)}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all"
          >
            Nhập số tiền tuỳ chỉnh
          </button>
        </>
      ) : (
        <>
          {/* Custom Form */}
          <form onSubmit={handleCustomTopup} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Nhập số tiền (VND)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Nhập số tiền..."
                  className="w-full px-4 py-3 bg-black/40 border border-green-500/30 rounded-lg text-white text-lg font-mono focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  disabled={loading}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-mono">
                  VND
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tối thiểu: 10,000 VND • Không có giới hạn tối đa
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                disabled={loading || !amount}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Nạp tiền'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setAmount('');
                  setMessage(null);
                }}
                disabled={loading}
                className="flex-1 py-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold transition-all"
              >
                Huỷ
              </button>
            </div>
          </form>
        </>
      )}

      {/* Info */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
        <p className="text-xs text-amber-300">
          ℹ️ Nạp tiền sẽ được ghi nhận vào tài khoản của bạn ngay lập tức. Không có phí xử lý.
        </p>
      </div>
    </div>
  );
}
