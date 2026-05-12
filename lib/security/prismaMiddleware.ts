import type { PrismaClient, Prisma } from '@prisma/client'
import { getSecurityContext } from './context'
import { writeSecurityLog } from './log'

const WRITE_ACTIONS = new Set(['create', 'update', 'delete', 'upsert', 'createMany', 'updateMany', 'deleteMany'])

function pickTargetId(params: Prisma.MiddlewareParams): string | undefined {
  const where = (params.args as any)?.where
  if (!where) return undefined
  if (typeof where.id === 'string') return where.id
  if (typeof where.accountNumber === 'string') return where.accountNumber
  if (typeof where.cardNumber === 'string') return where.cardNumber
  return undefined
}

function computeSeverity(params: Prisma.MiddlewareParams): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const model = params.model || ''
  const action = params.action
  const data = (params.args as any)?.data

  // Default baseline
  let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM'

  if (model === 'User' && action === 'update' && (data?.password != null)) severity = 'HIGH'
  if (model === 'Account' && action === 'update') {
    if (data?.pin != null || data?.isLocked != null) severity = 'HIGH'
    if (data?.balance != null || data?.dailyLimit != null || data?.monthlyLimit != null) severity = 'HIGH'
  }
  if (model === 'Transaction' && action === 'create') severity = 'HIGH'
  if (model === 'Card' && action === 'create') severity = 'HIGH'
  if (model === 'PinChangeHistory' && action === 'create') severity = 'HIGH'

  return severity
}

export function attachSecurityPrismaMiddleware(prisma: PrismaClient) {
  prisma.$use(async (params, next) => {
    const ctx = getSecurityContext()

    // Always skip if explicitly disabled or if we are writing SecurityLog.
    if (ctx?.disableAutoLog || String(params.model) === 'SecurityLog') {
      return next(params)
    }

    const shouldLog = params.model && WRITE_ACTIONS.has(params.action)
    if (!shouldLog) {
      return next(params)
    }

    const startedAt = Date.now()
    try {
      const result = await next(params)
      const durationMs = Date.now() - startedAt

      await writeSecurityLog(
        {
          action: `prisma.${params.model}.${params.action}`,
          severity: computeSeverity(params),
          status: 'SUCCESS',
          targetModel: params.model,
          targetId: pickTargetId(params),
          metadata: {
            durationMs,
          },
        },
        ctx
      )

      return result
    } catch (err) {
      const durationMs = Date.now() - startedAt

      // Best-effort: do not leak error details; keep minimal metadata.
      await writeSecurityLog(
        {
          action: `prisma.${params.model}.${params.action}`,
          severity: 'HIGH',
          status: 'FAIL',
          targetModel: params.model,
          targetId: pickTargetId(params),
          metadata: {
            durationMs,
            errorName: err instanceof Error ? err.name : 'Error',
          },
        },
        ctx
      ).catch(() => {})

      throw err
    }
  })
}
