'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRPayment } from '@/components/qr/QRPayment';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface QRPaymentClientProps {
  accountNumber: string;
  accountName: string;
  currentBalance: number;
}

export function QRPaymentClient({
  accountNumber,
  accountName,
  currentBalance
}: QRPaymentClientProps) {
  const router = useRouter();
  const [scannedData, setScannedData] = useState<any>(null);

  const handleReceivePayment = (data: any) => {
    setScannedData(data);
    
    // Chuyển đến trang transfer với thông tin đã điền sẵn
    const params = new URLSearchParams({
      toUsername: data.account,
      amount: data.amount?.toString() || '',
      message: data.message || ''
    });
    
    router.push(`/dashboard/transfer?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-6 md:py-10 px-4">
      <div className="flex flex-col justify-center min-h-screen max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span>Quay lại Dashboard</span>
          </Link>
        </div>

        {/* Success Message */}
        {scannedData && (
          <div className="mb-6 max-w-xl mx-auto w-full">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 md:p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-green-400 font-semibold mb-1 text-sm md:text-base">Quét QR thành công!</h4>
                <p className="text-gray-300 text-xs md:text-sm">
                  Đang chuyển đến trang chuyển khoản với thông tin đã điền sẵn...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xl">
            <QRPayment
              accountNumber={accountNumber}
              accountName={accountName}
              currentBalance={currentBalance}
              onReceivePayment={handleReceivePayment}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 max-w-xl mx-auto w-full">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 md:p-4">
            <h4 className="text-amber-400 font-semibold mb-2 flex items-center gap-2 text-sm md:text-base">
              <span>⚠️</span>
              Lưu ý quan trọng
            </h4>
            <ul className="text-gray-400 text-xs md:text-sm space-y-1">
              <li>• Mỗi mã QR chỉ nên sử dụng một lần cho mỗi giao dịch</li>
              <li>• Không chia sẻ mã QR chứa số tiền cụ thể với người lạ</li>
              <li>• Luôn kiểm tra thông tin trước khi xác nhận chuyển khoản</li>
              <li>• Mã QR có timestamp để ngăn chặt việc sử dụng lại</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
