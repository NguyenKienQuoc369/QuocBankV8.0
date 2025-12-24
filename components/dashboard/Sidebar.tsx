'use client'
import { Home, CreditCard, Repeat, PieChart, Settings, LogOut, Shield } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/actions/auth'
import { CosmicLogo } from '@/components/ui/CosmicLogo'

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
    <div className="flex flex-col h-full p-4 border-r border-cyan-500/10">
      <div className="flex items-center gap-3 px-4 mb-10 mt-2">
        <CosmicLogo size={40} />
        <div>
          <span className="text-lg font-bold tracking-[0.2em] block">QUOC<span className="text-cyan-400">BANK</span></span>
          <span className="text-[8px] text-gray-600 font-mono tracking-widest block">HUD CONTROL</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative text-left overflow-hidden
              ${isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />}
              <Icon size={18} className={`transition-transform duration-300 ${isActive ? 'text-cyan-400' : 'group-hover:scale-110'}`} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />}
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
