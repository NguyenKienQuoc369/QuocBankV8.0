import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { adminAuthOptions } from '@/lib/auth/admin-options'
import { prisma } from '@/lib/prisma'
import AdminSignOutButton from './sign-out'

export default async function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(adminAuthOptions)
  const employeeId = (session as any)?.user?.employeeId as string | undefined
  if (!employeeId) redirect('/admin/login')
  const admin = await prisma.adminUser.findUnique({ where: { employeeId } })
  if (!admin || admin.isLocked) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-black text-white">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/20 via-black to-black" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
      </div>

      <aside className="relative z-10 hidden w-72 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl md:flex">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="text-xs font-semibold tracking-widest text-cyan-300/90">QUOCBANK</div>
          <div className="mt-1 text-lg font-bold">Administration</div>
          <div className="mt-1 text-xs text-gray-400">
            Signed in as <span className="font-mono text-cyan-400 font-bold">{employeeId}</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <Link
            href="/admin"
            className="block rounded-2xl border border-cyan-500/20 bg-cyan-600/10 px-4 py-3 text-sm font-semibold text-cyan-100"
          >
            Admin Console
          </Link>
        </nav>

        <div className="border-t border-white/10 p-4">
          <AdminSignOutButton className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-gray-100 hover:bg-white/10 transition-colors" />
        </div>
      </aside>

      <div className="relative z-10 flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-black/30 px-6 py-4 backdrop-blur-xl">
          <div>
            <div className="text-sm font-semibold text-white">Admin Console</div>
            <div className="text-xs text-gray-400">System operations & security monitoring</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-xs text-gray-300 md:block">
              User: <span className="font-mono text-cyan-400 font-bold">{employeeId}</span>
            </div>
            <AdminSignOutButton className="md:hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-100 hover:bg-white/10 transition-colors" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-8">{children}</main>
      </div>
    </div>
  )
}