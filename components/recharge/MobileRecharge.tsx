'use client';

import { useState, useEffect } from 'react';
import { Phone, Smartphone, Zap } from 'lucide-react';
import { rechargeMobile, getMobileProviders } from '@/actions/mobile-recharge';

interface MobileProvider {
  id: string;
  code: string;
  name: string;
  logo: string | null;
  denominations: string;
  serviceFee: number;
}

interface MobileRechargeProps {
  accountId: string;
  balance: number;
}

export function MobileRecharge({ accountId, balance }: MobileRechargeProps) {
  const [providers, setProviders] = useState<MobileProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<MobileProvider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    const result = await getMobileProviders();
    if (result.success && result.data) {
      setProviders(result.data);
    }
  };

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider || !amount) return;

    setLoading(true);
    setMessage(null);

    const result = await rechargeMobile(accountId, selectedProvider.id, phoneNumber, amount);
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: `Nạp tiền thành công! Số dư mới: ${result.balance?.toLocaleString('vi-VN')}đ` });
      setPhoneNumber('');
      setAmount(null);
      setSelectedProvider(null);
    } else {
      setMessage({ type: 'error', text: result.error || 'Có lỗi xảy ra' });
    }
  };

  const getDenominations = (provider: MobileProvider): number[] => {
    try {
      return JSON.parse(provider.denominations);
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-purple-600/20 flex items-center justify-center">
            <Smartphone className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Nạp tiền điện thoại</h2>
            <p className="text-gray-400 mt-1">Nhanh chóng - Tiện lợi - Hoàn tiền 0.5%</p>
          </div>
        </div>
      </div>

      {/* Balance Display */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-sm text-gray-400">Số dư khả dụng</div>
        <div className="text-2xl font-bold text-cyan-400">{balance.toLocaleString('vi-VN')}đ</div>
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

      {/* Provider Selection */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Chọn nhà mạng</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSelectedProvider(provider)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedProvider?.id === provider.id
                  ? 'border-cyan-500 bg-cyan-500/20'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <Phone className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
              <div className="text-sm font-bold text-white">{provider.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recharge Form */}
      {selectedProvider && (
        <form onSubmit={handleRecharge} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              maxLength={10}
              pattern="0[0-9]{9}"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-black/30 border border-cyan-500/30 rounded-xl px-4 py-3 text-white text-lg focus:border-cyan-500 focus:outline-none"
              placeholder="0987654321"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Chọn mệnh giá
            </label>
            <div className="grid grid-cols-3 gap-2">
              {getDenominations(selectedProvider).map((denom) => (
                <button
                  key={denom}
                  type="button"
                  onClick={() => setAmount(denom)}
                  className={`py-3 px-4 rounded-xl font-bold transition-all ${
                    amount === denom
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {(denom / 1000).toFixed(0)}K
                </button>
              ))}
            </div>
          </div>

          {amount && (
            <div className="bg-black/30 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Mệnh giá</span>
                <span className="text-white font-bold">{amount.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Phí dịch vụ</span>
                <span className="text-white font-bold">{selectedProvider.serviceFee.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-sm text-green-400">
                <span>Hoàn tiền (0.5%)</span>
                <span className="font-bold">+{((amount + selectedProvider.serviceFee) * 0.005).toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between">
                <span className="text-white font-bold">Tổng thanh toán</span>
                <span className="text-cyan-400 font-bold text-lg">
                  {(amount + selectedProvider.serviceFee).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !phoneNumber || !amount || phoneNumber.length !== 10}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            {loading ? 'Đang xử lý...' : 'Nạp tiền ngay'}
          </button>
        </form>
      )}
    </div>
  );
}
