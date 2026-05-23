import { prisma } from '@/lib/prisma'
import SecurityAuditPanel from '@/components/security/SecurityAuditPanel'
import { resetAccountPinAction, setAccountLockAction, updateAccountLimitsAction } from './actions'

export default async function AdminConsolePage() {
  const [users, accounts, transactions, logs] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        username: true,
        fullName: true,
        createdAt: true,
      },
    }),
    prisma.account.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        accountNumber: true,
        balance: true,
        isLocked: true,
        pin: true,
        dailyLimit: true,
        monthlyLimit: true,
        createdAt: true,
        user: { select: { id: true, username: true } },
      },
    }),
    prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        type: true,
        status: true,
        amount: true,
        createdAt: true,
        fromAccount: { select: { accountNumber: true, user: { select: { username: true } } } },
        toAccount: { select: { accountNumber: true, user: { select: { username: true } } } },
      },
    }),
    prisma.securityLog.findMany({
      where: { severity: { in: ['HIGH', 'CRITICAL'] as any } },
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
    }),
  ])

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-20">
      <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-8">
        <h1 className="text-3xl font-bold text-white">Operations Console</h1>
        <p className="mt-1 font-medium text-gray-300">User management, account controls, security monitoring</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-6">
        <h2 className="mb-4 text-lg font-bold text-white">Users (50 newest)</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="py-2 pr-4">Username</th>
                <th className="py-2 pr-4">Full name</th>
                <th className="py-2 pr-4">User ID</th>
                <th className="py-2 pr-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-white/5 text-gray-200">
                  <td className="py-2 pr-4 font-mono text-xs">{u.username}</td>
                  <td className="py-2 pr-4">{u.fullName}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{u.id}</td>
                  <td className="whitespace-nowrap py-2 pr-4">{new Date(u.createdAt).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-6">
        <h2 className="mb-4 text-lg font-bold text-white">Accounts (50 newest)</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="py-2 pr-4">Account</th>
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">Balance</th>
                <th className="py-2 pr-4">Locked</th>
                <th className="py-2 pr-4">PIN</th>
                <th className="py-2 pr-4">Limits</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="align-top border-t border-white/5 text-gray-200">
                  <td className="whitespace-nowrap py-2 pr-4 font-mono text-xs">{a.accountNumber}</td>
                  <td className="whitespace-nowrap py-2 pr-4 font-mono text-xs">{a.user?.username}</td>
                  <td className="whitespace-nowrap py-2 pr-4">{a.balance.toLocaleString('vi-VN')}</td>
                  <td className="whitespace-nowrap py-2 pr-4">
                    <span className={a.isLocked ? 'font-bold text-red-400' : 'font-bold text-green-400'}>
                      {a.isLocked ? 'LOCKED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-2 pr-4">{a.pin ? 'SET' : 'NONE'}</td>
                  <td className="py-2 pr-4">
                    <form action={updateAccountLimitsAction} className="flex min-w-[220px] flex-col gap-2">
                      <input type="hidden" name="accountId" value={a.id} />
                      <label className="text-xs text-gray-400">
                        Daily limit
                        <input
                          name="dailyLimit"
                          defaultValue={String(a.dailyLimit)}
                          inputMode="numeric"
                          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-gray-100"
                        />
                      </label>
                      <label className="text-xs text-gray-400">
                        Monthly limit
                        <input
                          name="monthlyLimit"
                          defaultValue={String(a.monthlyLimit)}
                          inputMode="numeric"
                          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-gray-100"
                        />
                      </label>
                      <button className="rounded-xl border border-cyan-500/30 bg-cyan-600/20 px-3 py-2 text-sm font-bold text-cyan-200 hover:bg-cyan-600/30">
                        Update limits
                      </button>
                    </form>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex min-w-[180px] flex-col gap-2">
                      <form action={setAccountLockAction}>
                        <input type="hidden" name="accountId" value={a.id} />
                        <input type="hidden" name="locked" value={a.isLocked ? 'false' : 'true'} />
                        <button
                          className={
                            a.isLocked
                              ? 'w-full rounded-xl border border-green-500/30 bg-green-600/20 px-3 py-2 text-sm font-bold text-green-200 hover:bg-green-600/30'
                              : 'w-full rounded-xl border border-red-500/30 bg-red-600/20 px-3 py-2 text-sm font-bold text-red-200 hover:bg-red-600/30'
                          }
                        >
                          {a.isLocked ? 'Unlock account' : 'Lock account'}
                        </button>
                      </form>

                      <form action={resetAccountPinAction}>
                        <input type="hidden" name="accountId" value={a.id} />
                        <button className="w-full rounded-xl border border-orange-500/30 bg-orange-600/20 px-3 py-2 text-sm font-bold text-orange-200 hover:bg-orange-600/30">
                          Reset PIN
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-6">
        <h2 className="mb-4 text-lg font-bold text-white">Transactions (50 newest)</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">From</th>
                <th className="py-2 pr-4">To</th>
                <th className="py-2 pr-4">Tx ID</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-t border-white/5 text-gray-200">
                  <td className="whitespace-nowrap py-2 pr-4">{new Date(t.createdAt).toLocaleString('vi-VN')}</td>
                  <td className="whitespace-nowrap py-2 pr-4 font-mono text-xs">{t.type}</td>
                  <td className="whitespace-nowrap py-2 pr-4 font-mono text-xs">{t.status}</td>
                  <td className="whitespace-nowrap py-2 pr-4">{t.amount.toLocaleString('vi-VN')}</td>
                  <td className="whitespace-nowrap py-2 pr-4 font-mono text-xs">{t.fromAccount?.accountNumber || '-'}</td>
                  <td className="whitespace-nowrap py-2 pr-4 font-mono text-xs">{t.toAccount?.accountNumber || '-'}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{t.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-6">
        <h2 className="mb-4 text-lg font-bold text-white">Security (HIGH/CRITICAL)</h2>
        <SecurityAuditPanel
          initialLogs={logs.map((l) => ({
            ...l,
            createdAt: new Date(l.createdAt as any).toISOString(),
          })) as any}
        />
      </div>
    </div>
  )
}
