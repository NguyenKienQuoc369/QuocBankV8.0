import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'
import { rateLimit, makeRateLimitKey } from '@/lib/security/rateLimit'
import { logAdminSecurityEvent } from '@/lib/security/admin-log'

export type AdminCredentialCheck = {
  ok: boolean
  error?: string
  adminId?: string
}

export async function checkAdminPassword(params: {
  employeeId: string
  password: string
  ipAddress?: string
  userAgent?: string
}) : Promise<AdminCredentialCheck> {
  const { employeeId, password, ipAddress, userAgent } = params
  const key = makeRateLimitKey(['admin-login', employeeId, ipAddress])
  const rl = rateLimit(key, 10, 10 * 60_000)
  if (!rl.ok) {
    await logAdminSecurityEvent({
      employeeId,
      action: 'ADMIN_LOGIN_FAILED_CREDENTIALS',
      severity: 'HIGH',
      status: 'BLOCK',
      ipAddress,
      userAgent,
      metadata: { reason: 'rate_limited' },
    }).catch(() => {})

    return { ok: false, error: 'Too many attempts. Try again later.' }
  }

  const admin = await prisma.adminUser.findUnique({ where: { employeeId } })

  if (!admin) {
    await logAdminSecurityEvent({
      employeeId,
      action: 'ADMIN_LOGIN_FAILED_CREDENTIALS',
      severity: 'WARNING',
      status: 'FAIL',
      ipAddress,
      userAgent,
    }).catch(() => {})

    return { ok: false, error: 'Invalid credentials' }
  }

  if (admin.isLocked) {
    await logAdminSecurityEvent({
      employeeId,
      action: 'ADMIN_ACCOUNT_LOCKED',
      severity: 'CRITICAL',
      status: 'BLOCK',
      ipAddress,
      userAgent,
    }).catch(() => {})

    return { ok: false, error: 'Account locked. Contact IT Helpdesk.' }
  }

  const ok = await verifyPassword(password, admin.passwordHash)
  if (!ok) {
    const failedAttempts = admin.failedAttempts + 1
    const willLock = failedAttempts >= 3

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        failedAttempts,
        lastFailedAt: new Date(),
        isLocked: willLock ? true : admin.isLocked,
      },
    })

    await logAdminSecurityEvent({
      employeeId,
      action: willLock ? 'ADMIN_ACCOUNT_LOCKED' : 'ADMIN_LOGIN_FAILED_CREDENTIALS',
      severity: willLock ? 'CRITICAL' : 'WARNING',
      status: 'FAIL',
      ipAddress,
      userAgent,
      metadata: { failedAttempts },
    }).catch(() => {})

    await new Promise((r) => setTimeout(r, 800 + failedAttempts * 300))

    return { ok: false, error: willLock ? 'Account locked. Contact IT Helpdesk.' : 'Invalid credentials' }
  }

  if (admin.failedAttempts > 0) {
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { failedAttempts: 0 },
    })
  }

  return { ok: true, adminId: admin.id }
}
