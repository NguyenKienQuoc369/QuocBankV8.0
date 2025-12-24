// app/dashboard/layout.tsx
import { DashboardSidebar } from '@/components/dashboard/Sidebar'
import { DashboardHeader } from '@/components/dashboard/Header'
import { HaloAI } from '@/components/ai/HaloAI'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      {/* Background Layer - Cyberpunk HUD Style */}
      <div className="fixed inset-0 z-0">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black" />
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] opacity-10" />
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay" />
      </div>

      <div className="relative z-20 hidden md:block w-72 h-full border-r border-cyan-500/20 bg-black/60 backdrop-blur-xl">
        <DashboardSidebar />
      </div>

      <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-hide relative">
          {children}
          <HaloAI />
        </main>
      </div>
    </div>
  )
}