'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, Upload, Zap, X } from 'lucide-react';

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Giả lập quét thành công sau 3 giây
  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanResult("QUOCBANK_TRANSFER|U_12345|500000|Thanh toan tien cafe");
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
       <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            <Scan className="text-[#00ff88]" /> Máy Quét Lượng Tử
          </h2>
          <p className="text-gray-400">Đưa mã QR vào khung ngắm để thực hiện giao dịch nhanh</p>
       </div>

       <div className="relative glass-cockpit rounded-[2rem] overflow-hidden aspect-square max-w-md mx-auto border border-white/10 bg-black/40">
          
          {/* CAMERA FEED (Giả lập) */}
          {!scanResult ? (
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-600 text-sm animate-pulse">Đang tìm kiếm tín hiệu...</div>
                
                {/* Grid nền */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

                {/* Khung ngắm (Scanning Frame) */}
                <div className="absolute w-64 h-64 border-2 border-[#00ff88]/50 rounded-lg">
                   <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#00ff88] -mt-1 -ml-1"></div>
                   <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#00ff88] -mt-1 -mr-1"></div>
                   <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#00ff88] -mb-1 -ml-1"></div>
                   <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#00ff88] -mb-1 -mr-1"></div>
                   
                   {/* Laser Scan Line */}
                   <motion.div 
                     animate={{ top: ['0%', '100%', '0%'] }}
                     transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                     className="absolute left-0 w-full h-1 bg-[#00ff88] shadow-[0_0_20px_#00ff88]"
                   />
                </div>
             </div>
          ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                   <Zap size={32} className="text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Đã nhận diện mục tiêu!</h3>
                <div className="bg-white/10 p-4 rounded-xl font-mono text-sm text-[#00ff88] break-all mb-6">
                   {scanResult}
                </div>
                <div className="flex gap-4">
                   <button onClick={() => setScanResult(null)} className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 text-white">Hủy bỏ</button>
                   <button className="px-6 py-2 rounded-full bg-[#00ff88] text-black font-bold hover:shadow-[0_0_15px_#00ff88]">Thanh toán ngay</button>
                </div>
             </div>
          )}
       </div>

       {/* Controls */}
       <div className="flex justify-center gap-6 mt-8">
          <button onClick={handleSimulateScan} className="flex flex-col items-center gap-2 group">
             <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#00ff88]/20 group-hover:text-[#00ff88] transition-all">
                <Scan size={24} />
             </div>
             <span className="text-xs text-gray-400">Giả lập quét</span>
          </button>
          
          <button className="flex flex-col items-center gap-2 group">
             <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                <Upload size={24} />
             </div>
             <span className="text-xs text-gray-400">Tải ảnh lên</span>
          </button>
       </div>
    </div>
  );
}
