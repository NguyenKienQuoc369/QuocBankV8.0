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
