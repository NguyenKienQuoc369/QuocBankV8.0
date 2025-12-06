'use client'
import { Home, CreditCard, Repeat, PieChart, Settings, LogOut, Shield } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/actions/auth'

const menuItems = [
  { icon: Home, label: 'Trung tâm chỉ huy', href: '/dashboard' },
  { icon: CreditCard, label: 'Quản lý thẻ', href: '/dashboard/cards' },
  { icon: Repeat, label: 'Chuyển khoản', href: '/dashboard/transfer' },
  { icon: PieChart, label: 'Báo cáo tài chính', href: '/dashboard/reports' },
  { icon: Shield, label: 'Bảo mật', href: '/dashboard/security' },
  { icon: Settings, label: 'Cấu hình hệ thống', href: '/dashboard/settings' },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center gap-3 px-4 mb-10 mt-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00ff88] to-blue-600 flex items-center justify-center font-bold text-black text-xl shadow-[0_0_20px_rgba(0,255,136,0.4)]">Q</div>
        <span className="text-xl font-bold tracking-wider text-white">QUOC<span className="text-[#00ff88]">BANK</span></span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-indigo-600/20 text-[#00ff88] border border-indigo-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88]" />}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10">
        <button onClick={() => logout()} className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
          <LogOut size={20} />
          <span>Ngắt kết nối</span>
        </button>
      </div>
    </div>
  )
}

export default DashboardSidebar
