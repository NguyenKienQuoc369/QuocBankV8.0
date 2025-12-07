// app/dashboard/layout.tsx
import { CosmicBackground } from '@/components/ui/CosmicBackground' // 1. Sửa import đúng tên
import { DashboardSidebar } from '@/components/dashboard/Sidebar'
import { DashboardHeader } from '@/components/dashboard/Header'
import { HaloAI } from '@/components/ai/HaloAI' // Lưu ý: check lại folder là 'AI' hay 'ai' tùy file thực tế

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <CosmicBackground /> {/* 2. Sửa tên component sử dụng ở đây */}
      </div>

      <div className="relative z-20 hidden md:block w-72 h-full border-r border-white/10 bg-black/20 backdrop-blur-xl">
        <DashboardSidebar />
      </div>

      <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide relative">
          {children}
          <HaloAI />
        </main>
      </div>
    </div>
  )
}