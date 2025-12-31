'use client';

import { useState } from 'react';
import { Plus, TrendingUp, PiggyBank as PiggyBankIcon, AlertCircle, Check } from 'lucide-react';
import { createSavings, createPiggyBank } from '@/app/actions/savings';
import { formatVND } from '@/lib/utils';

interface SavingsPanelProps {
  currentBalance: number;
}

export function SavingsPanel({ currentBalance }: SavingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'savings' | 'piggy'>('savings');
  const [showSavingsForm, setShowSavingsForm] = useState(false);
  const [showPiggyForm, setShowPiggyForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Savings form
  const [savingsData, setSavingsData] = useState({
    amount: '',
    termInMonths: '12',
    name: 'Sổ tiết kiệm'
  });

  // Piggy form
  const [piggyData, setPiggyData] = useState({
    name: '',
    targetAmount: '',
    icon: 'pig',
    color: 'pink'
  });

  const interestRates: { [key: string]: number } = {
    '1': 5.5,
    '3': 6.2,
    '6': 6.8,
    '12': 7.5
  };

  const piggyIcons = ['pig', 'heart', 'target', 'home', 'plane', 'car'];
  const piggyColors = ['pink', 'blue', 'green', 'purple', 'orange', 'red'];

  const handleCreateSavings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('amount', savingsData.amount);
    formData.append('termInMonths', savingsData.termInMonths);
    formData.append('name', savingsData.name);

    const result = await createSavings({}, formData);
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setSavingsData({ amount: '', termInMonths: '12', name: 'Sổ tiết kiệm' });
      setShowSavingsForm(false);
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const handleCreatePiggy = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await createPiggyBank(
      piggyData.name,
      parseFloat(piggyData.targetAmount),
      piggyData.icon,
      piggyData.color
    );
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setPiggyData({ name: '', targetAmount: '', icon: 'pig', color: 'pink' });
      setShowPiggyForm(false);
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('savings')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
            activeTab === 'savings'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          Sổ Tiết Kiệm
        </button>
        <button
          onClick={() => setActiveTab('piggy')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
            activeTab === 'piggy'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <PiggyBankIcon className="w-5 h-5" />
          Ống Heo
        </button>
      </div>

      {/* Savings Tab */}
      {activeTab === 'savings' && (
        <div className="space-y-4">
          {!showSavingsForm ? (
            <button
              onClick={() => setShowSavingsForm(true)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/10 border border-blue-500/30 hover:border-blue-500/60 text-blue-300 font-semibold transition-all"
            >
              <Plus className="w-5 h-5" />
              Mở Sổ Tiết Kiệm Mới
            </button>
          ) : (
            <form onSubmit={handleCreateSavings} className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/10">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Số tiền</label>
                <input
                  type="number"
                  value={savingsData.amount}
                  onChange={(e) => setSavingsData({ ...savingsData, amount: e.target.value })}
                  placeholder="1,000,000"
                  className="w-full px-4 py-2 bg-black/40 border border-blue-500/30 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Term */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Kỳ hạn</label>
                <select
                  value={savingsData.termInMonths}
                  onChange={(e) => setSavingsData({ ...savingsData, termInMonths: e.target.value })}
                  className="w-full px-4 py-2 bg-black/40 border border-blue-500/30 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="1">1 tháng - 5.5% / năm</option>
                  <option value="3">3 tháng - 6.2% / năm</option>
                  <option value="6">6 tháng - 6.8% / năm</option>
                  <option value="12">12 tháng - 7.5% / năm</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tên sổ tiết kiệm</label>
                <input
                  type="text"
                  value={savingsData.name}
                  onChange={(e) => setSavingsData({ ...savingsData, name: e.target.value })}
                  placeholder="Sổ tiết kiệm"
                  className="w-full px-4 py-2 bg-black/40 border border-blue-500/30 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Interest Preview */}
              {savingsData.amount && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-300">
                    Dự kiến lãi: {Math.round((parseFloat(savingsData.amount) * interestRates[savingsData.termInMonths]) / 100).toLocaleString('vi-VN')} đ
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={loading || !savingsData.amount}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold disabled:opacity-50"
                >
                  {loading ? '...' : 'Mở Sổ'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSavingsForm(false)}
                  className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold"
                >
                  Huỷ
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Piggy Tab */}
      {activeTab === 'piggy' && (
        <div className="space-y-4">
          {!showPiggyForm ? (
            <button
              onClick={() => setShowPiggyForm(true)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-gradient-to-r from-pink-500/20 to-rose-500/10 border border-pink-500/30 hover:border-pink-500/60 text-pink-300 font-semibold transition-all"
            >
              <Plus className="w-5 h-5" />
              Mở Ống Heo Mới
            </button>
          ) : (
            <form onSubmit={handleCreatePiggy} className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/10">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tên ống heo</label>
                <input
                  type="text"
                  value={piggyData.name}
                  onChange={(e) => setPiggyData({ ...piggyData, name: e.target.value })}
                  placeholder="VD: Mua xe, Du lịch..."
                  className="w-full px-4 py-2 bg-black/40 border border-pink-500/30 rounded-lg text-white focus:border-pink-500 focus:outline-none"
                  required
                />
              </div>

              {/* Target */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Mục tiêu tiết kiệm</label>
                <input
                  type="number"
                  value={piggyData.targetAmount}
                  onChange={(e) => setPiggyData({ ...piggyData, targetAmount: e.target.value })}
                  placeholder="10,000,000"
                  className="w-full px-4 py-2 bg-black/40 border border-pink-500/30 rounded-lg text-white focus:border-pink-500 focus:outline-none"
                  required
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Biểu tượng</label>
                <div className="grid grid-cols-6 gap-2">
                  {piggyIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setPiggyData({ ...piggyData, icon })}
                      className={`p-2 rounded-lg border transition-all ${
                        piggyData.icon === icon
                          ? 'bg-pink-500 border-pink-400'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {icon === 'pig' && '🐷'}
                      {icon === 'heart' && '❤️'}
                      {icon === 'target' && '🎯'}
                      {icon === 'home' && '🏠'}
                      {icon === 'plane' && '✈️'}
                      {icon === 'car' && '🚗'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Màu sắc</label>
                <div className="grid grid-cols-6 gap-2">
                  {piggyColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setPiggyData({ ...piggyData, color })}
                      className={`h-8 rounded-lg border-2 transition-all ${
                        piggyData.color === color
                          ? 'border-white'
                          : 'border-transparent'
                      }`}
                      style={{
                        backgroundColor: {
                          pink: '#ec4899',
                          blue: '#3b82f6',
                          green: '#10b981',
                          purple: '#a855f7',
                          orange: '#f97316',
                          red: '#ef4444'
                        }[color as string]
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={loading || !piggyData.name || !piggyData.targetAmount}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold disabled:opacity-50"
                >
                  {loading ? '...' : 'Mở Ống'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPiggyForm(false)}
                  className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold"
                >
                  Huỷ
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
