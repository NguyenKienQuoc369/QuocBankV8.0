import { prisma } from '@/lib/prisma'
import { runWithAutoLogDisabled, type SecurityContext } from './context'
import { Prisma, type SecuritySeverity as PrismaSecuritySeverity } from '@prisma/client'

export type SecuritySeverity = PrismaSecuritySeverity

export type SecurityLogInput = {
  userId?: string
  action: string
  severity?: SecuritySeverity
  status?: string
  ipAddress?: string
  location?: string
  userAgent?: string
  fingerprint?: string
  requestPath?: string
  requestMethod?: string
  requestId?: string
  targetModel?: string
  targetId?: string
  metadata?: Prisma.InputJsonValue
}

export async function writeSecurityLog(event: SecurityLogInput, ctx?: SecurityContext) {
  const merged: SecurityLogInput = {
    ...event,
    userId: event.userId ?? ctx?.userId,
    ipAddress: event.ipAddress ?? ctx?.ipAddress,
    location: event.location ?? ctx?.location,
    userAgent: event.userAgent ?? ctx?.userAgent,
    fingerprint: event.fingerprint ?? ctx?.fingerprint,
    requestPath: event.requestPath ?? ctx?.requestPath,
    requestMethod: event.requestMethod ?? ctx?.requestMethod,
    requestId: event.requestId ?? ctx?.requestId,
  }

  // Avoid recursion with Prisma auto-logging.
  return runWithAutoLogDisabled(async () => {
    return prisma.securityLog.create({
      data: {
        userId: merged.userId,
        action: merged.action,
        severity: (merged.severity ?? 'LOW') as any,
        status: merged.status,
        ipAddress: merged.ipAddress,
        location: merged.location,
        userAgent: merged.userAgent,
        fingerprint: merged.fingerprint,
        requestPath: merged.requestPath,
        requestMethod: merged.requestMethod,
        requestId: merged.requestId,
        targetModel: merged.targetModel,
        targetId: merged.targetId,
        metadata: merged.metadata,
      },
    })
  })
}
