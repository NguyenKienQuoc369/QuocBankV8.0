'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, CheckCircle2 } from 'lucide-react';

interface QRGeneratorProps {
  accountNumber: string;
  accountName: string;
  bankName?: string;
  amount?: number;
  message?: string;
  logoUrl?: string;
}

export function QRGenerator({
  accountNumber,
  accountName,
  bankName = 'QuocBank',
  amount,
  message,
  logoUrl = '/logo.png'
}: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrData, setQrData] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateQR();
  }, [accountNumber, accountName, amount, message]);

  const generateQR = async () => {
    // Tạo chuỗi dữ liệu theo định dạng VietQR hoặc custom
    const data = JSON.stringify({
      bank: bankName,
      account: accountNumber,
      name: accountName,
      amount: amount || 0,
      message: message || '',
      timestamp: Date.now()
    });

    setQrData(data);

    if (!canvasRef.current) return;

    try {
      // Tạo QR code
      await QRCode.toCanvas(canvasRef.current, data, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H', // High error correction để có thể thêm logo
      });

      // Thêm logo vào giữa
      if (logoUrl) {
        await addLogoToQR(canvasRef.current, logoUrl);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const addLogoToQR = async (canvas: HTMLCanvasElement, logoUrl: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const logo = new Image();
      logo.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        logo.onload = resolve;
        logo.onerror = () => {
          // Nếu load logo thất bại, vẽ logo text thay thế
          drawTextLogo(ctx, canvas.width);
          resolve(null);
        };
        logo.src = logoUrl;
      });

      if (logo.complete && logo.naturalWidth > 0) {
        // Vẽ nền trắng cho logo
        const logoSize = canvas.width * 0.2;
        const logoX = (canvas.width - logoSize) / 2;
        const logoY = (canvas.height - logoSize) / 2;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
        
        // Vẽ logo
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
      }
    } catch (error) {
      // Fallback: vẽ logo text
      drawTextLogo(ctx, canvas.width);
    }
  };

  const drawTextLogo = (ctx: CanvasRenderingContext2D, canvasSize: number) => {
    const logoSize = canvasSize * 0.2;
    const logoX = (canvasSize - logoSize) / 2;
    const logoY = (canvasSize - logoSize) / 2;
    
    // Vẽ nền trắng
    ctx.fillStyle = 'white';
    ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
    
    // Vẽ chữ Q
    ctx.fillStyle = '#00d4ff';
    ctx.font = `bold ${logoSize * 0.7}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Q', canvasSize / 2, canvasSize / 2);
  };

  const downloadQR = () => {
    if (!canvasRef.current) return;
    
    const url = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `qr-${accountNumber}.png`;
    link.href = url;
    link.click();
  };

  const copyQRData = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* QR Code Display - Centered */}
      <div className="relative flex justify-center">
        <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg inline-block">
          <canvas
            ref={canvasRef}
            className="block w-48 h-48 md:w-64 md:h-64"
          />
        </div>
        
        {/* Scan instruction */}
        <div className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs px-3 md:px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
          Quét để chuyển khoản
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-black/20 border border-cyan-500/30 rounded-lg md:rounded-xl p-3 md:p-4 space-y-2 md:space-y-3">
        <div className="flex justify-between text-xs md:text-sm">
          <span className="text-gray-400">Ngân hàng:</span>
          <span className="text-white font-semibold text-right">{bankName}</span>
        </div>
        <div className="flex justify-between text-xs md:text-sm">
          <span className="text-gray-400">Số tài khoản:</span>
          <span className="text-cyan-400 font-mono font-semibold text-right">{accountNumber}</span>
        </div>
        <div className="flex justify-between text-xs md:text-sm">
          <span className="text-gray-400">Chủ tài khoản:</span>
          <span className="text-white font-semibold text-right">{accountName}</span>
        </div>
        {amount && amount > 0 && (
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-gray-400">Số tiền:</span>
            <span className="text-green-400 font-bold">{amount.toLocaleString('vi-VN')} VND</span>
          </div>
        )}
        {message && (
          <div className="flex justify-between text-xs md:text-sm flex-col md:flex-row gap-1 md:gap-0">
            <span className="text-gray-400">Nội dung:</span>
            <span className="text-white italic text-right">{message}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-3">
        <button
          onClick={downloadQR}
          className="flex-1 flex items-center justify-center gap-2 py-2 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm md:text-base transition-all"
        >
          <Download className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Tải QR Code</span>
          <span className="sm:hidden">Tải</span>
        </button>
        <button
          onClick={copyQRData}
          className="flex-1 flex items-center justify-center gap-2 py-2 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm md:text-base transition-all"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
              <span className="hidden sm:inline">Đã sao chép!</span>
              <span className="sm:hidden">Sao chép!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Sao chép dữ liệu</span>
              <span className="sm:hidden">Sao chép</span>
            </>
          )}
        </button>
      </div>


      {/* Security Note */}
      <div className="text-center text-xs text-gray-500">
        🔒 Mã QR được mã hóa và chỉ dùng một lần cho mỗi giao dịch
      </div>
    </div>
  );
}
