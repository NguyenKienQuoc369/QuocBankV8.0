import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withApiGuard } from '@/lib/api/guard'
import { sanitizeText } from '@/lib/security/sanitize'

export async function GET(req: Request) {
  return withApiGuard(
    req,
    {
      requireAuth: true,
      actionName: 'transactions.list',
      rateLimit: { keyPrefix: 'api:tx:list', limit: 120, windowMs: 60_000 },
    },
    async ({ userId }) => {
      const uid = String(userId)
      const url = new URL(req.url)
      const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
      const pageSize = Math.min(100, Math.max(5, Number(url.searchParams.get('pageSize') || '20')))
      const type = sanitizeText(url.searchParams.get('type') || undefined, 24) || undefined
      const q = sanitizeText(url.searchParams.get('q') || undefined, 64) || undefined
      const startDate = url.searchParams.get('startDate')
      const endDate = url.searchParams.get('endDate')

      const whereClauses: Record<string, unknown> = {
        OR: [{ fromAccount: { userId: uid } }, { toAccount: { userId: uid } }],
      }

      if (type) whereClauses.type = type

      if (startDate || endDate) {
        const dateFilter: { gte?: Date; lte?: Date } = {}
        if (startDate) dateFilter.gte = new Date(startDate)
        if (endDate) dateFilter.lte = new Date(endDate)
        whereClauses.createdAt = dateFilter
      }

      if (q) {
        whereClauses.AND = [
          {
            OR: [
              { fromAccount: { accountNumber: { contains: q } } },
              { toAccount: { accountNumber: { contains: q } } },
            ],
          },
        ]
      }

      const skip = (page - 1) * pageSize

      const [total, transactions] = await Promise.all([
        prisma.transaction.count({ where: whereClauses }),
        prisma.transaction.findMany({
          where: whereClauses,
          include: {
            fromAccount: { select: { accountNumber: true } },
            toAccount: { select: { accountNumber: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
        }),
      ])

      return NextResponse.json({ success: true, transactions, total, page, pageSize })
    }
  )
}
