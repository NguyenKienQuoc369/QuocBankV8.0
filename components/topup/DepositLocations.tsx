'use client';

import { useState, useEffect } from 'react';
import { Globe, MapPin, Zap, Sparkles } from 'lucide-react';
import { getDepositLocations, topupAccount } from '@/actions/topup';

interface DepositLocation {
  id: string;
  planetName: string;
  planetCode: string;
  description: string | null;
  color: string;
  icon: string;
  depositPoints: number;
  isActive: boolean;
}

interface DepositLocationsProps {
  accountId: string;
  balance: number;
}

export function DepositLocations({ accountId, balance }: DepositLocationsProps) {
  const [locations, setLocations] = useState<DepositLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<DepositLocation | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    const result = await getDepositLocations();
    if (result.success && result.data) {
      setLocations(result.data);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setMessage({ type: 'error', text: 'Số tiền không hợp lệ' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await topupAccount(accountId, depositAmount, selectedLocation.planetCode);
    setLoading(false);

    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: `Nạp tiền thành công từ ${selectedLocation.planetName}! Số dư mới: ${result.balance?.toLocaleString('vi-VN')}đ` 
      });
      setAmount('');
      setSelectedLocation(null);
    } else {
      setMessage({ type: 'error', text: result.error || 'Có lỗi xảy ra' });
    }
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      planet: Globe,
      sparkles: Sparkles,
      zap: Zap,
      globe: Globe,
      home: MapPin,
      rocket: Zap,
      circle: Globe,
      waves: Globe,
    };
    return icons[iconName] || Globe;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-indigo-500/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-indigo-600/20 flex items-center justify-center">
            <Globe className="w-7 h-7 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Địa điểm nạp tiền</h2>
            <p className="text-gray-400 mt-1">Chọn hành tinh để nạp năng lượng vào tài khoản</p>
          </div>
        </div>
      </div>

      {/* Balance Display */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="text-sm text-gray-400">Số dư hiện tại</div>
        <div className="text-2xl font-bold text-cyan-400">{balance.toLocaleString('vi-VN')}đ</div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-xl animate-in fade-in slide-in-from-top-2 ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Planet Grid */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          Chọn hành tinh nạp tiền
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {locations.map((location) => {
            const Icon = getIcon(location.icon);
            return (
              <button
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                className={`group relative p-6 rounded-2xl border-2 transition-all overflow-hidden ${
                  selectedLocation?.id === location.id
                    ? 'border-cyan-500 bg-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
                style={{
                  background: selectedLocation?.id === location.id 
                    ? `linear-gradient(135deg, ${location.color}20 0%, transparent 100%)`
                    : undefined
                }}
              >
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at center, ${location.color} 0%, transparent 70%)`
                  }}
                />
                
                <div className="relative z-10">
                  <div 
                    className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${location.color}30`,
                      boxShadow: `0 0 20px ${location.color}40`
                    }}
                  >
                    <Icon 
                      className="w-8 h-8" 
                      style={{ color: location.color }}
                    />
                  </div>
                  <div className="text-sm font-bold text-white text-center mb-1">
                    {location.planetName}
                  </div>
                  <div className="text-xs text-gray-400 text-center mb-2">
                    {location.description}
                  </div>
                  <div className="text-xs text-cyan-400 text-center font-bold">
                    {location.depositPoints} điểm nạp
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deposit Form */}
      {selectedLocation && (
        <form onSubmit={handleDeposit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/30">
            <div className="flex items-center gap-3 mb-2">
              {(() => {
                const Icon = getIcon(selectedLocation.icon);
                return <Icon className="w-6 h-6" style={{ color: selectedLocation.color }} />;
              })()}
              <div>
                <div className="font-bold text-white">{selectedLocation.planetName}</div>
                <div className="text-xs text-gray-400">{selectedLocation.description}</div>
              </div>
            </div>
            <div className="text-xs text-cyan-400">
              Có {selectedLocation.depositPoints} điểm nạp tiền khả dụng
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Số tiền muốn nạp
            </label>
            <input
              type="number"
              min="1000"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black/30 border border-cyan-500/30 rounded-xl px-4 py-3 text-white text-lg focus:border-cyan-500 focus:outline-none"
              placeholder="Nhập số tiền (tối thiểu 1,000đ)"
              required
            />
          </div>

          {amount && parseFloat(amount) >= 1000 && (
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex justify-between">
                <span className="text-white font-bold">Số tiền nạp</span>
                <span className="text-cyan-400 font-bold text-lg">
                  +{parseFloat(amount).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !amount || parseFloat(amount) < 1000}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <Zap className="w-5 h-5" />
            {loading ? 'Đang xử lý...' : 'Nạp năng lượng ngay'}
          </button>
        </form>
      )}

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Thông tin hữu ích
        </h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>• Mỗi hành tinh có số lượng điểm nạp tiền khác nhau</li>
          <li>• Giao dịch nạp tiền được xử lý tức thời</li>
          <li>• Không giới hạn số lần nạp tiền trong ngày</li>
          <li>• Lịch sử giao dịch được lưu trữ đầy đủ</li>
        </ul>
      </div>
    </div>
  );
}
