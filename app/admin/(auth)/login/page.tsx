import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { adminAuthOptions } from '@/lib/auth/admin-options'
import AdminLoginForm from './ui'

export default async function AdminLoginPage() {
  const session = await getServerSession(adminAuthOptions)
  const employeeId = (session as any)?.user?.employeeId as string | undefined
  if (employeeId) redirect('/admin')

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden items-center justify-center overflow-hidden border-r border-white/10 bg-[#0b0f16] p-12 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-black to-black" />
          <div className="absolute inset-0 bg-[url('/textures/dots.svg')] opacity-20" />
          <div className="relative z-10 max-w-md space-y-6">
            <div className="text-xs font-semibold tracking-[0.3em] text-cyan-300">QUOCBANK</div>
            <h1 className="text-3xl font-bold text-white">QuocBank Internal Backoffice</h1>
            <p className="text-sm text-gray-300">
              Secure administrative access for internal operations, risk monitoring, and incident response.
            </p>

            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-5 text-sm text-orange-200">
              UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED. All activities are monitored and logged. Violators will be prosecuted.
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-300">
              IT Helpdesk: kienquocn64@gmail.com
              <div className="mt-1 text-cyan-300">it-sec@quocbank.com</div>
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-black to-black" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30" />

          <div className="relative z-10 w-full max-w-md">
            <div className="rounded-3xl border border-cyan-500/20 bg-black/40 p-8 shadow-[0_0_60px_rgba(34,211,238,0.12)] backdrop-blur-xl">
              <div className="mb-6">
                <div className="text-xs font-semibold tracking-widest text-cyan-300/90">ADMIN ACCESS</div>
                <h2 className="mt-2 text-2xl font-bold text-white">Authenticate</h2>
                <p className="mt-1 text-sm text-gray-400">Two-factor authentication required.</p>
              </div>

              <AdminLoginForm />

              <div className="mt-6 border-t border-white/10 pt-4 text-xs text-gray-500">
                No self-service password resets. Contact IT Security for access recovery.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}