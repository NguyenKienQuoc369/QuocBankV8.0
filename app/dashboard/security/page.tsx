import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Key, Smartphone, Clock, AlertTriangle } from 'lucide-react';

export default async function SecurityPage() {
  const payload = await getSession();
  if (!payload) redirect('/login');

  // Lấy tài khoản và thông tin PIN
  const account = await prisma.account.findFirst({
    where: { userId: payload.id as string },
    select: {
      id: true,
      pin: true,
      isLocked: true,
      dailyLimit: true,
      monthlyLimit: true,
    },
  });

  if (!account) redirect('/dashboard');

  // Lấy lịch sử thay đổi PIN gần nhất
  const recentPinChange = await prisma.pinChangeHistory.findFirst({
    where: { accountId: account.id },
    orderBy: { changedAt: 'desc' },
  });

  const hasPin = !!account.pin;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-indigo-900/20 to-cyan-900/20 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="relative p-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Trung tâm Bảo mật</h1>
              <p className="text-cyan-400 mt-1 font-medium">Quản lý và bảo vệ tài khoản của bạn</p>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-black/30 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${hasPin ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
                <div>
                  <div className="text-xs text-gray-400">Mã PIN</div>
                  <div className={`font-bold ${hasPin ? 'text-green-400' : 'text-yellow-400'}`}>
                    {hasPin ? 'Đã kích hoạt' : 'Chưa thiết lập'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${account.isLocked ? 'bg-red-400' : 'bg-green-400'} animate-pulse`} />
                <div>
                  <div className="text-xs text-gray-400">Trạng thái tài khoản</div>
                  <div className={`font-bold ${account.isLocked ? 'text-red-400' : 'text-green-400'}`}>
                    {account.isLocked ? 'Đã khóa' : 'Hoạt động'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/30 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                <div>
                  <div className="text-xs text-gray-400">Hạn mức ngày</div>
                  <div className="font-bold text-cyan-400">
                    {(account.dailyLimit / 1000000).toFixed(0)}M
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning if no PIN */}
      {!hasPin && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-400">Bảo mật chưa hoàn chỉnh</h3>
              <p className="text-gray-300 mt-1 text-sm">
                Bạn chưa thiết lập mã PIN bảo mật. Thiết lập ngay để bảo vệ tài khoản khỏi truy cập trái phép.
              </p>
              <Link
                href="/dashboard/security/pin"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all"
              >
                <Key className="w-5 h-5" />
                Thiết lập mã PIN ngay
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Security Options Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* PIN Management */}
        <Link
          href="/dashboard/security/pin"
          className="group relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 hover:from-cyan-500/20 hover:to-blue-600/20 p-6 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 flex items-center justify-center transition-all group-hover:scale-110">
                <Key className="w-7 h-7 text-cyan-400" />
              </div>
              <div className="text-cyan-400 text-sm font-mono">CTRL-P</div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Quản lý Mã PIN</h3>
            <p className="text-gray-400 text-sm mb-4">
              {hasPin ? 'Thay đổi mã PIN bảo mật 6 số' : 'Thiết lập mã PIN bảo mật 6 số'}
            </p>

            {recentPinChange && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-4 h-4" />
                <span>
                  Cập nhật lần cuối: {new Date(recentPinChange.changedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            )}

            <div className="mt-4 flex items-center text-cyan-400 text-sm font-medium group-hover:translate-x-2 transition-transform">
              {hasPin ? 'Thay đổi PIN' : 'Thiết lập ngay'}
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* 2FA (Coming Soon) */}
        <div className="group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-600/10 p-6 opacity-60 cursor-not-allowed">
          <div className="absolute top-4 right-4 bg-purple-500/20 text-purple-400 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30">
            Sắp ra mắt
          </div>
          
          <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
            <Smartphone className="w-7 h-7 text-purple-400" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Xác thực 2 yếu tố</h3>
          <p className="text-gray-400 text-sm">
            Tăng cường bảo mật với xác thực đa yếu tố qua SMS hoặc ứng dụng
          </p>
        </div>

        {/* Payment Limits */}
        <Link
          href="/dashboard/settings/limits"
          className="group relative overflow-hidden rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-600/10 hover:from-green-500/20 hover:to-emerald-600/20 p-6 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 flex items-center justify-center transition-all group-hover:scale-110">
                <Lock className="w-7 h-7 text-green-400" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Hạn mức Thanh toán</h3>
            <p className="text-gray-400 text-sm mb-4">
              Thiết lập giới hạn giao dịch hàng ngày và hàng tháng
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Hạn mức ngày:</span>
                <span className="text-green-400 font-bold">
                  {(account.dailyLimit / 1000000).toFixed(0)}M đ
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Hạn mức tháng:</span>
                <span className="text-green-400 font-bold">
                  {(account.monthlyLimit / 1000000).toFixed(0)}M đ
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center text-green-400 text-sm font-medium group-hover:translate-x-2 transition-transform">
              Cấu hình hạn mức
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Session Management (Coming Soon) */}
        <div className="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 p-6 opacity-60 cursor-not-allowed">
          <div className="absolute top-4 right-4 bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30">
            Sắp ra mắt
          </div>
          
          <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
            <Clock className="w-7 h-7 text-blue-400" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Quản lý Phiên</h3>
          <p className="text-gray-400 text-sm">
            Xem và quản lý các thiết bị đã đăng nhập vào tài khoản
          </p>
        </div>
      </div>

      {/* Security Tips */}
      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          Mẹo bảo mật
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-400 font-bold">1</span>
            </div>
            <div>
              <div className="font-medium text-white text-sm">Sử dụng mã PIN mạnh</div>
              <div className="text-gray-400 text-xs mt-1">Tránh dùng số đơn giản như 123456 hoặc 000000</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-400 font-bold">2</span>
            </div>
            <div>
              <div className="font-medium text-white text-sm">Không chia sẻ mã PIN</div>
              <div className="text-gray-400 text-xs mt-1">Giữ bí mật mã PIN với mọi người, kể cả nhân viên ngân hàng</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-400 font-bold">3</span>
            </div>
            <div>
              <div className="font-medium text-white text-sm">Thay đổi định kỳ</div>
              <div className="text-gray-400 text-xs mt-1">Đổi mã PIN thường xuyên để tăng cường bảo mật</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-400 font-bold">4</span>
            </div>
            <div>
              <div className="font-medium text-white text-sm">Thiết lập hạn mức hợp lý</div>
              <div className="text-gray-400 text-xs mt-1">Giới hạn số tiền giao dịch để giảm thiểu rủi ro</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
