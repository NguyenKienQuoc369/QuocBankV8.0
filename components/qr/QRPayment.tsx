'use client';

import { useState } from 'react';
import { QRGenerator } from './QRGenerator';
import { QRScanner } from './QRScanner';
import { QrCode, ScanLine, ArrowRight } from 'lucide-react';

interface QRPaymentProps {
  accountNumber: string;
  accountName: string;
  currentBalance: number;
  onReceivePayment?: (data: {
    bank: string;
    account: string;
    name: string;
    amount: number;
    message: string;
  }) => void;
}

export function QRPayment({
  accountNumber,
  accountName,
  currentBalance,
  onReceivePayment
}: QRPaymentProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'scan'>('generate');
  const [showScanner, setShowScanner] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleScan = (data: any) => {
    setShowScanner(false);
    if (onReceivePayment) {
      onReceivePayment(data);
    }
  };

  return (
    <div className="w-full">
      {/* Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-3 md:mb-4 shadow-lg">
          <QrCode className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">QR Payment</h2>
        <p className="text-sm md:text-base text-gray-400">Chuyển khoản nhanh chóng với mã QR</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 md:mb-8">
        <button
          onClick={() => setActiveTab('generate')}
          className={`flex-1 py-2 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition-all ${
            activeTab === 'generate'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center justify-center gap-1 md:gap-2">
            <QrCode className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Tạo mã QR</span>
            <span className="sm:hidden">Tạo</span>
          </div>
        </button>
        <button
          onClick={() => {
            setActiveTab('scan');
            setShowScanner(true);
          }}
          className={`flex-1 py-2 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition-all ${
            activeTab === 'scan'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center justify-center gap-1 md:gap-2">
            <ScanLine className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Quét mã QR</span>
            <span className="sm:hidden">Quét</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl md:rounded-3xl border border-cyan-500/30 p-4 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
        {activeTab === 'generate' ? (
          <div className="space-y-4 md:space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2\">
                Số tiền yêu cầu (tùy chọn)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-black/40 border border-cyan-500/30 rounded-lg md:rounded-xl text-white text-base md:text-lg font-mono focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              />
              <p className="text-xs text-gray-500 mt-1\">
                Để trống nếu muốn người chuyển tự nhập số tiền
              </p>
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2\">
                Nội dung chuyển khoản (tùy chọn)
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="VD: Thanh toán hóa đơn..."
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-black/40 border border-cyan-500/30 rounded-lg md:rounded-xl text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              />
            </div>

            <div className="border-t border-white/10 pt-4 md:pt-6\">
              <QRGenerator
                accountNumber={accountNumber}
                accountName={accountName}
                bankName="QuocBank"
                amount={amount ? parseFloat(amount) : undefined}
                message={message}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8 md:py-12\">
            <ScanLine className="w-12 h-12 md:w-16 md:h-16 text-cyan-400 mx-auto mb-3 md:mb-4 animate-pulse\" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2\">Sẵn sàng quét mã QR</h3>
            <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6\">
              Nhấn nút bên dưới để mở camera và quét mã QR
            </p>
            <button
              onClick={() => setShowScanner(true)}
              className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm md:text-base transition-all shadow-lg\"
            >
              <ScanLine className="w-4 h-4 md:w-5 md:h-5\" />
              <span className="hidden sm:inline\">Mở máy quét</span>
              <span className="sm:hidden\">Quét</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5\" />
            </button>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6\">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg md:rounded-xl p-3 md:p-4\">
          <h4 className="text-xs md:text-sm font-semibold text-cyan-400 mb-1 md:mb-2\">💳 Nhận tiền</h4>
          <p className="text-xs text-gray-400\">
            Tạo mã QR với thông tin tài khoản của bạn để người khác có thể quét và chuyển tiền ngay
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-lg md:rounded-xl p-3 md:p-4\">
          <h4 className="text-xs md:text-sm font-semibold text-blue-400 mb-1 md:mb-2\">📱 Chuyển tiền</h4>
          <p className="text-xs text-gray-400\">
            Quét mã QR của người nhận để tự động điền thông tin và thực hiện chuyển khoản nhanh chóng
          </p>
        </div>
      </div>
    </div>
  );
}
