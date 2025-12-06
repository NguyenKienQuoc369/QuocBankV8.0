import React from 'react'
import Link from 'next/link'

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="glass-cockpit rounded-3xl p-8">
        <h1 className="text-2xl font-bold text-white">Bảo mật tài khoản</h1>
        <p className="text-gray-400 mt-2">Quản lý mật khẩu, xác thực hai yếu tố và trạng thái thiết bị.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-cockpit rounded-2xl p-6">
          <h3 className="font-bold text-white">Xác thực hai yếu tố (2FA)</h3>
          <p className="text-sm text-gray-400 mt-2">Chưa bật 2FA — bảo vệ tài khoản bằng xác thực đa yếu tố.</p>
          <div className="mt-4">
            <Link href="/dashboard/settings" className="inline-block px-4 py-2 bg-indigo-600 rounded-lg text-white">Cấu hình bảo mật</Link>
          </div>
        </div>

        <div className="glass-cockpit rounded-2xl p-6">
          <h3 className="font-bold text-white">Thiết bị đã đăng nhập</h3>
          <p className="text-sm text-gray-400 mt-2">Không có thiết bị đáng ngờ.</p>
        </div>
      </div>
    </div>
  )
}
