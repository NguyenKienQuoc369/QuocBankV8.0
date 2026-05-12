import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withApiGuard } from '@/lib/api/guard'

export async function GET(req: Request) {
  return withApiGuard(
    req,
    {
      requireAuth: true,
      actionName: 'accounts.list',
      rateLimit: { keyPrefix: 'api:accounts:list', limit: 60, windowMs: 60_000 },
    },
    async ({ userId }) => {
      const accounts = await prisma.account.findMany({
        where: { userId: String(userId) },
        select: { id: true, accountNumber: true, balance: true },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({ success: true, accounts })
    }
  )
}
