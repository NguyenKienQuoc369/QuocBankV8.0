'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { isAdminUsername } from '@/lib/security/admin'
import { getRequestMeta } from '@/lib/security/request'
import { runWithSecurityContext } from '@/lib/security/context'
import { writeSecurityLog } from '@/lib/security/log'

async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/login')

  const username = (session as any).username
  if (!isAdminUsername(username)) redirect('/dashboard')

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
  const session = await requireAdmin()
  const meta = await getRequestMeta()

  const accountId = z.string().min(1).parse(formData.get('accountId'))
  const locked = z.enum(['true', 'false']).parse(formData.get('locked')) === 'true'

  const ctx = {
    userId: String((session as any).id || ''),
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    fingerprint: meta.fingerprint,
    requestId: meta.requestId,
    requestPath: meta.requestPath || '/dashboard/admin',
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
        metadata: { locked },
      },
      ctx
    ).catch(() => {})
  })

  revalidatePath('/dashboard/admin')
}

export async function resetAccountPinAction(formData: FormData) {
  const session = await requireAdmin()
  const meta = await getRequestMeta()

  const accountId = z.string().min(1).parse(formData.get('accountId'))

  const ctx = {
    userId: String((session as any).id || ''),
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    fingerprint: meta.fingerprint,
    requestId: meta.requestId,
    requestPath: meta.requestPath || '/dashboard/admin',
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
      },
      ctx
    ).catch(() => {})
  })

  revalidatePath('/dashboard/admin')
}

export async function updateAccountLimitsAction(formData: FormData) {
  const session = await requireAdmin()
  const meta = await getRequestMeta()

  const accountId = z.string().min(1).parse(formData.get('accountId'))
  const dailyLimit = toNumberOrUndefined(formData.get('dailyLimit'))
  const monthlyLimit = toNumberOrUndefined(formData.get('monthlyLimit'))

  if (dailyLimit === undefined && monthlyLimit === undefined) {
    revalidatePath('/dashboard/admin')
    return
  }

  if ((dailyLimit !== undefined && dailyLimit < 0) || (monthlyLimit !== undefined && monthlyLimit < 0)) {
    throw new Error('Invalid limits')
  }

  const ctx = {
    userId: String((session as any).id || ''),
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    fingerprint: meta.fingerprint,
    requestId: meta.requestId,
    requestPath: meta.requestPath || '/dashboard/admin',
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
        },
      },
      ctx
    ).catch(() => {})
  })

  revalidatePath('/dashboard/admin')
}
