import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateAccountNumber } from '@/lib/utils'
import { withApiGuard } from '@/lib/api/guard'

export async function POST(req: Request) {
  return withApiGuard(
    req,
    {
      requireAuth: true,
      actionName: 'accounts.create',
      rateLimit: { keyPrefix: 'api:accounts:create', limit: 10, windowMs: 60_000 },
    },
    async ({ userId }) => {
      const uid = String(userId)

      const result = await prisma.$transaction(async (tx) => {
        const count = await tx.account.count({ where: { userId: uid } })

        const account = await tx.account.create({
          data: {
            userId: uid,
            accountNumber: generateAccountNumber(),
            balance: 0,
          },
          select: { id: true, accountNumber: true, balance: true, createdAt: true },
        })

        if (count === 0) {
          const WELCOME_AMOUNT = 50000
          await tx.transaction.create({
            data: {
              amount: WELCOME_AMOUNT,
              description: 'Tiền thưởng chào mừng',
              status: 'SUCCESS',
              type: 'DEPOSIT',
              toAccountId: account.id,
            },
          })

          await tx.account.update({
            where: { id: account.id },
            data: { balance: { increment: WELCOME_AMOUNT } },
          })
        }

        return account
      })

      return NextResponse.json({ success: true, account: result })
    }
  )
}
