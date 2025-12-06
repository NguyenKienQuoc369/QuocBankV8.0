import { Search, Bell, User } from 'lucide-react'

export function DashboardHeader() {
  return (
    <header className="h-20 px-6 flex items-center justify-between border-b border-white/5 bg-black/10 backdrop-blur-sm sticky top-0 z-30">
      <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-96 focus-within:border-indigo-500/50 focus-within:bg-white/10 transition-all">
        <Search size={18} className="text-gray-400 mr-2" />
        <input type="text" placeholder="Tìm kiếm giao dịch, tính năng..." className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gray-500" />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
          <Bell size={20} className="text-gray-300 group-hover:text-white" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-white">Thuyền trưởng</p>
            <p className="text-xs text-[#00ff88]">Online</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-[1px]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
