import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { withApiGuard } from '@/lib/api/guard'

const DepositBodySchema = z.object({
  amount: z.coerce.number().positive('Số tiền nạp phải > 0'),
  description: z.string().max(200).optional(),
})

// POST /api/transactions/deposit
export async function POST(req: Request) {
  return withApiGuard(
    req,
    {
      requireAuth: true,
      actionName: 'transactions.deposit',
      rateLimit: { keyPrefix: 'api:tx:deposit', limit: 20, windowMs: 60_000 },
      bodySchema: DepositBodySchema,
      sanitize: { fields: ['description'] },
    },
    async ({ userId, body }) => {
      const uid = String(userId)
      const { amount, description } = body!

      try {
        const result = await prisma.$transaction(async (tx) => {
          const account = await tx.account.findFirst({
            where: { userId: uid },
            orderBy: { createdAt: 'asc' },
          })
          if (!account) throw new Error('ACCOUNT_NOT_FOUND')
          if (account.isLocked) throw new Error('ACCOUNT_LOCKED')

          const updated = await tx.account.update({
            where: { id: account.id },
            data: { balance: { increment: amount } },
            select: { id: true, accountNumber: true, balance: true },
          })

          const txRecord = await tx.transaction.create({
            data: {
              amount,
              description: description || 'Nạp tiền',
              status: 'SUCCESS',
              type: 'DEPOSIT',
              toAccountId: account.id,
            },
          })

          return { account: updated, transaction: txRecord }
        })

        return NextResponse.json({ success: true, ...result })
      } catch (err) {
        const code = err instanceof Error ? err.message : 'ERROR'
        const message =
          code === 'ACCOUNT_NOT_FOUND'
            ? 'Không tìm thấy tài khoản'
            : code === 'ACCOUNT_LOCKED'
              ? 'Tài khoản đang bị khóa'
              : 'Nạp tiền thất bại'
        return NextResponse.json({ success: false, message }, { status: 400 })
      }
    }
  )
}
