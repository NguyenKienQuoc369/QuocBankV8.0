'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { adminAuthOptions } from '@/lib/auth/admin-options'
import { getRequestMeta } from '@/lib/security/request'
import { runWithSecurityContext } from '@/lib/security/context'
import { writeSecurityLog } from '@/lib/security/log'

async function requireAdmin() {
  const session = await getServerSession(adminAuthOptions)
  const employeeId = (session as any)?.user?.employeeId as string | undefined
  if (!employeeId) redirect('/admin/login')

  const admin = await prisma.adminUser.findUnique({ where: { employeeId } })
  if (!admin || admin.isLocked) redirect('/admin/login')

  return session
}

function toNumberOrUndefined(value: FormDataEntryValue | null): number | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : undefined
}

export async function setAccountLockAction(formData: FormData) {
  const session = (await requireAdmin()) as any
  const meta = await getRequestMeta()
  const employeeId = session.user?.employeeId as string

  const accountId = z.string().min(1).parse(formData.get('accountId'))
  const locked = z.enum(['true', 'false']).parse(formData.get('locked')) === 'true'

  const ctx = {
    userId: undefined,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    fingerprint: meta.fingerprint,
    requestId: meta.requestId,
    requestPath: meta.requestPath || '/admin',
    requestMethod: meta.requestMethod || 'SERVER_ACTION',
  }

  await runWithSecurityContext(ctx, async () => {
    await prisma.account.update({
      where: { id: accountId },
      data: { isLocked: locked },
    })

    await writeSecurityLog(
      {
        action: locked ? 'admin.account.lock' : 'admin.account.unlock',
        severity: 'HIGH',
        status: 'SUCCESS',
        targetModel: 'Account',
        targetId: accountId,
        metadata: { locked, employeeId },
      },
      ctx
    ).catch(() => {})
  })

  revalidatePath('/admin')
}

export async function resetAccountPinAction(formData: FormData) {
  const session = (await requireAdmin()) as any
  const meta = await getRequestMeta()
  const employeeId = session.user?.employeeId as string

  const accountId = z.string().min(1).parse(formData.get('accountId'))

  const ctx = {
    userId: undefined,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    fingerprint: meta.fingerprint,
    requestId: meta.requestId,
    requestPath: meta.requestPath || '/admin',
    requestMethod: meta.requestMethod || 'SERVER_ACTION',
  }

  await runWithSecurityContext(ctx, async () => {
    await prisma.$transaction([
      prisma.account.update({
        where: { id: accountId },
        data: { pin: null },
      }),
      prisma.pinChangeHistory.create({
        data: {
          accountId,
          ipAddress: ctx.ipAddress,
        },
      }),
    ])

    await writeSecurityLog(
      {
        action: 'admin.account.pin_reset',
        severity: 'HIGH',
        status: 'SUCCESS',
        targetModel: 'Account',
        targetId: accountId,
        metadata: { employeeId },
      },
      ctx
    ).catch(() => {})
  })

  revalidatePath('/admin')
}

export async function updateAccountLimitsAction(formData: FormData) {
  const session = (await requireAdmin()) as any
  const meta = await getRequestMeta()
  const employeeId = session.user?.employeeId as string

  const accountId = z.string().min(1).parse(formData.get('accountId'))
  const dailyLimit = toNumberOrUndefined(formData.get('dailyLimit'))
  const monthlyLimit = toNumberOrUndefined(formData.get('monthlyLimit'))

  if (dailyLimit === undefined && monthlyLimit === undefined) {
    revalidatePath('/admin')
    return
  }

  if ((dailyLimit !== undefined && dailyLimit < 0) || (monthlyLimit !== undefined && monthlyLimit < 0)) {
    throw new Error('Invalid limits')
  }

  const ctx = {
    userId: undefined,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    fingerprint: meta.fingerprint,
    requestId: meta.requestId,
    requestPath: meta.requestPath || '/admin',
    requestMethod: meta.requestMethod || 'SERVER_ACTION',
  }

  await runWithSecurityContext(ctx, async () => {
    await prisma.account.update({
      where: { id: accountId },
      data: {
        ...(dailyLimit !== undefined ? { dailyLimit } : {}),
        ...(monthlyLimit !== undefined ? { monthlyLimit } : {}),
      },
    })

    await writeSecurityLog(
      {
        action: 'admin.account.limits_update',
        severity: 'MEDIUM',
        status: 'SUCCESS',
        targetModel: 'Account',
        targetId: accountId,
        metadata: {
          dailyLimit: dailyLimit ?? null,
          monthlyLimit: monthlyLimit ?? null,
          employeeId,
        },
      },
      ctx
    ).catch(() => {})
  })

  revalidatePath('/admin')
}

export async function deleteUserAction(formData: FormData) {
  const session = (await requireAdmin()) as any
  const meta = await getRequestMeta()
  const employeeId = session.user?.employeeId as string

  const userId = z.string().min(1).parse(formData.get('userId'))
  const confirm = String(formData.get('confirm') || '').trim()

  if (confirm !== 'DELETE') {
    await writeSecurityLog(
      {
        action: 'admin.user.delete_denied',
        severity: 'MEDIUM',
        status: 'FAIL',
        targetModel: 'User',
        targetId: userId,
        metadata: { employeeId, reason: 'confirmation_required' },
      },
      {
        userId: undefined,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        fingerprint: meta.fingerprint,
        requestId: meta.requestId,
        requestPath: meta.requestPath || '/admin',
        requestMethod: meta.requestMethod || 'SERVER_ACTION',
      }
    ).catch(() => {})

    revalidatePath('/admin')
    return
  }

  const ctx = {
    userId: undefined,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    fingerprint: meta.fingerprint,
    requestId: meta.requestId,
    requestPath: meta.requestPath || '/admin',
    requestMethod: meta.requestMethod || 'SERVER_ACTION',
  }

  await runWithSecurityContext(ctx, async () => {
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { id: true },
    })

    const accountIds = accounts.map((a) => a.id)

    await prisma.$transaction([
      ...(accountIds.length
        ? [
            prisma.transaction.deleteMany({
              where: {
                OR: [
                  { fromAccountId: { in: accountIds } },
                  { toAccountId: { in: accountIds } },
                ],
              },
            }),
            prisma.mobileRecharge.deleteMany({ where: { accountId: { in: accountIds } } }),
            prisma.savingsAccount.deleteMany({ where: { accountId: { in: accountIds } } }),
            prisma.pinChangeHistory.deleteMany({ where: { accountId: { in: accountIds } } }),
            prisma.card.deleteMany({ where: { accountId: { in: accountIds } } }),
            prisma.piggyBank.deleteMany({ where: { accountId: { in: accountIds } } }),
            prisma.cashbackHistory.deleteMany({ where: { accountId: { in: accountIds } } }),
            prisma.account.deleteMany({ where: { id: { in: accountIds } } }),
          ]
        : []),
      prisma.user.delete({ where: { id: userId } }),
    ])

    await writeSecurityLog(
      {
        action: 'admin.user.delete',
        severity: 'CRITICAL',
        status: 'SUCCESS',
        targetModel: 'User',
        targetId: userId,
        metadata: { employeeId, accountCount: accountIds.length },
      },
      ctx
    ).catch(() => {})
  })

  revalidatePath('/admin')
}
