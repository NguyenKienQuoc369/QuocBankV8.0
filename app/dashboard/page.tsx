import React from 'react';

import { Scene } from '@/components/3d/Scene';
import { DashboardScene } from '@/components/3d/DashboardScene';
import { CardHologram } from '@/components/3d/CardHologram';

import { NotificationBell } from '@/components/NotificationBell';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { SavingsCard } from '@/components/SavingsCard';
import { ScheduledTransferCard } from '@/components/ScheduledTransferCard';

const MOCK_DATA = {
    user: { name: "Nguyễn Kiến Quốc", balance: 500000000 },
    card: { number: "9876543210987654", holder: "NGUYEN KIEN QUOC", expiry: "12/28" },
    savings: {
        id: "1",
        savingsType: "FIXED_12M",
        interestRate: 6.8,
        balance: 100000000,
        estimatedInterest: 6800000,
        startDate: new Date(),
        maturityDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        daysRemaining: 365,
        status: "ACTIVE",
        autoRenew: true
    },
    transfer: {
        id: "1",
        frequency: "MONTHLY",
        runCount: 5,
        status: "ACTIVE",
        amount: 5000000,
        toAccountName: "Mẹ yêu",
        toAccountNumber: "123456789",
        message: "Gửi mẹ tiền sinh hoạt",
        startDate: new Date(),
        nextRunDate: new Date(),
        lastRunAt: new Date()
    }
};

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 pb-24">
            {/* --- Header: Logo & Thông báo --- */}
            <header className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00b8ff] bg-clip-text text-transparent">
                        QuocBank
                    </h1>
                    <p className="text-gray-400 text-sm">Welcome back!</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <NotificationBell />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center shadow-lg">
                        👤
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-8">
                
                {/* --- Phần 1: Visual Chính (3D Balance & Thẻ) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cột Trái: 3D Scene hiển thị số dư */}
                    <div className="lg:col-span-2 h-[450px] rounded-3xl bg-gray-900/40 border border-white/5 overflow-hidden relative shadow-2xl backdrop-blur-sm">
                        <div className="absolute top-6 left-6 z-10">
                            <h2 className="text-xl font-semibold text-gray-200">Tổng tài sản</h2>
                            <p className="text-[#00ff88] text-sm font-mono mt-1">LIVE UPDATE</p>
                        </div>
                        {/* Nhúng Scene vào đây */}
                        <Scene>
                            <DashboardScene 
                                balance={MOCK_DATA.user.balance} 
                                userName={MOCK_DATA.user.name} 
                            />
                        </Scene>
                    </div>

                    {/* Cột Phải: Thẻ 3D Hologram */}
                    <div className="h-[450px] rounded-3xl bg-gray-900/40 border border-white/5 overflow-hidden relative shadow-2xl backdrop-blur-sm flex flex-col">
                        <div className="absolute top-6 left-6 z-10">
                            <h2 className="text-xl font-semibold text-gray-200">Thẻ Tín Dụng</h2>
                        </div>
                        <Scene>
                            <CardHologram 
                                cardNumber={MOCK_DATA.card.number} 
                                holderName={MOCK_DATA.card.holder} 
                                expiryDate={MOCK_DATA.card.expiry} 
                            />
                        </Scene>
                    </div>
                </div>

                {/* --- Phần 2: Các tính năng chức năng --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    
                    {/* Ô 1: QR Code */}
                    <div className="p-6 rounded-3xl bg-gray-900/30 border border-white/10 hover:border-[#00ff88]/30 transition-all">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                            <span className="text-2xl">📱</span> QR Thanh toán
                        </h2>
                        <QRCodeDisplay />
                    </div>

                    {/* Ô 2: Sổ tiết kiệm */}
                    <div className="space-y-4">
                         <h2 className="text-xl font-bold mb-2 flex items-center gap-2 px-2">
                            <span className="text-2xl">💰</span> Sổ tiết kiệm
                        </h2>
                        {/* Ép kiểu any tạm thời để tránh lỗi TypeScript nếu interface chưa khớp */}
                        <SavingsCard savings={MOCK_DATA.savings as any} />
                    </div>

                     {/* Ô 3: Chuyển khoản định kỳ */}
                     <div className="space-y-4">
                         <h2 className="text-xl font-bold mb-2 flex items-center gap-2 px-2">
                            <span className="text-2xl">⏰</span> Lịch chuyển tiền
                        </h2>
                        <ScheduledTransferCard transfer={MOCK_DATA.transfer as any} />
                    </div>
                </div>
            </main>
        </div>
    );
}