import { Search, Bell, User } from 'lucide-react'

export function DashboardHeader() {
  return (
    <header className="h-20 px-6 flex items-center justify-between border-b border-cyan-500/20 bg-black/40 backdrop-blur-xl sticky top-0 z-30 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
      <div className="hidden md:flex items-center bg-black/30 border border-cyan-500/20 rounded-lg px-4 py-2 w-96 focus-within:border-cyan-500/50 focus-within:bg-cyan-500/5 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all">
        <Search size={18} className="text-cyan-400/60 mr-2" />
        <input type="text" placeholder="Scan transactions, features..." className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gray-600 font-mono" />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2.5 rounded-lg bg-black/30 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all border border-cyan-500/10 group">
          <Bell size={20} className="text-cyan-400/60 group-hover:text-cyan-400" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-cyan-500/10">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-white">COMMANDER</p>
            <p className="text-xs text-cyan-400 font-mono tracking-widest">● ONLINE</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-600 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <div className="w-full h-full rounded-lg bg-black flex items-center justify-center">
              <User size={18} className="text-cyan-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
