'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { Camera, X, CheckCircle2, AlertTriangle } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: {
    bank: string;
    account: string;
    name: string;
    amount: number;
    message: string;
  }) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const qrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    setScanning(true);
    setError('');

    try {
      const qrCode = new Html5Qrcode('qr-reader');
      qrCodeRef.current = qrCode;

      await qrCode.start(
        { facingMode: 'environment' }, // Camera sau
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanError
      );
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError('Không thể khởi động camera. Vui lòng kiểm tra quyền truy cập camera.');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    try {
      if (qrCodeRef.current) {
        await qrCodeRef.current.stop();
        qrCodeRef.current.clear();
      }
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  const onScanSuccess = (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText);
      
      // Validate data structure
      if (!data.bank || !data.account || !data.name) {
        setError('Mã QR không hợp lệ hoặc đã hết hạn');
        return;
      }

      setSuccess(true);
      setScanning(false);
      
      // Stop scanner
      stopScanner();

      // Delay to show success animation
      setTimeout(() => {
        onScan(data);
      }, 1000);
    } catch (err) {
      console.error('Error parsing QR data:', err);
      setError('Không thể đọc mã QR. Vui lòng thử lại.');
    }
  };

  const onScanError = (errorMessage: string) => {
    // Ignore common scanning errors
    if (!errorMessage.includes('NotFoundException')) {
      console.warn('Scan error:', errorMessage);
    }
  };

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-cyan-500/30 max-w-lg w-full shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-cyan-500/30">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Quét mã QR</h3>
                <p className="text-cyan-400 text-sm mt-0.5">Đưa camera vào mã QR để quét</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scanner Area */}
        <div className="p-6 space-y-6">
          {/* QR Reader Container */}
          <div className="relative">
            <div
              id="qr-reader"
              className="rounded-xl overflow-hidden border-2 border-cyan-500/30"
            />
            
            {/* Scanning Overlay */}
            {scanning && !success && !error && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-4 border-cyan-500 rounded-xl animate-pulse" />
              </div>
            )}

            {/* Success Overlay */}
            {success && (
              <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-2 animate-bounce" />
                  <p className="text-green-400 font-bold">Quét thành công!</p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-400 text-sm">{error}</p>
                <button
                  onClick={() => {
                    setError('');
                    startScanner();
                  }}
                  className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-black/20 border border-white/10 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-white mb-2">Hướng dẫn:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Đưa camera vào mã QR cần quét</li>
              <li>• Giữ camera ổn định và đảm bảo ánh sáng đủ</li>
              <li>• Mã QR phải nằm trong khung quét</li>
              <li>• Hệ thống sẽ tự động nhận diện và xử lý</li>
            </ul>
          </div>

          {/* Cancel Button */}
          <button
            onClick={handleClose}
            className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all"
          >
            Hủy
          </button>

          {/* Security Note */}
          <div className="text-center text-xs text-gray-500">
            🔒 Mã QR được quét và xác thực an toàn
          </div>
        </div>
      </div>
    </div>
  );
}
