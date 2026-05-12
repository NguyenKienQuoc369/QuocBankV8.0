import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { isAdminUsername } from '@/lib/security/admin'
import { prisma } from '@/lib/prisma'
import SecurityAuditPanel from '@/components/security/SecurityAuditPanel'

export default async function SecurityAuditPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  if (!isAdminUsername((session as any).username)) {
    redirect('/dashboard/security')
  }

  const logs = await prisma.securityLog.findMany({
    where: {
      severity: { in: ['HIGH', 'CRITICAL'] },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      createdAt: true,
      userId: true,
      action: true,
      severity: true,
      status: true,
      ipAddress: true,
      requestPath: true,
    },
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-indigo-900/20 to-cyan-900/20 backdrop-blur-xl p-8">
        <h1 className="text-3xl font-bold text-white">Security Audit Log</h1>
        <p className="text-cyan-400 mt-1 font-medium">HIGH/CRITICAL events (polling)</p>
      </div>

      <SecurityAuditPanel initialLogs={logs.map((l: any) => ({ ...l, createdAt: new Date(l.createdAt).toISOString() }))} />
    </div>
  )
}
