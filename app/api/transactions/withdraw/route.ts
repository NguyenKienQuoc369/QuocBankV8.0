import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { withApiGuard } from '@/lib/api/guard'

const WithdrawBodySchema = z.object({
  amount: z.coerce.number().positive('Số tiền rút phải > 0'),
  description: z.string().max(200).optional(),
})

export async function POST(req: Request) {
  return withApiGuard(
    req,
    {
      requireAuth: true,
      actionName: 'transactions.withdraw',
      rateLimit: { keyPrefix: 'api:tx:withdraw', limit: 10, windowMs: 60_000 },
      bodySchema: WithdrawBodySchema,
      sanitize: { fields: ['description'] },
    },
    async ({ userId, body }) => {
      const uid = String(userId)
      const { amount, description } = body!

      const FEE_RATE = Number(process.env.WITHDRAW_FEE_RATE ?? '0.005')
      const fee = Math.round(amount * FEE_RATE)
      const totalDebit = amount + fee

      try {
        const result = await prisma.$transaction(async (tx) => {
          const account = await tx.account.findFirst({
            where: { userId: uid },
            orderBy: { createdAt: 'asc' },
          })
          if (!account) throw new Error('ACCOUNT_NOT_FOUND')
          if (account.isLocked) throw new Error('ACCOUNT_LOCKED')
          if (account.dailyLimit != null && amount > account.dailyLimit) throw new Error('DAILY_LIMIT')
          if (account.balance < totalDebit) throw new Error('INSUFFICIENT_FUNDS')

          const updated = await tx.account.update({
            where: { id: account.id },
            data: { balance: { decrement: totalDebit } },
            select: { id: true, accountNumber: true, balance: true },
          })

          const txRecord = await tx.transaction.create({
            data: {
              amount,
              description: (description || 'Rút tiền') + ` | Phí đã trừ: ${fee.toLocaleString('vi-VN')} VND`,
              status: 'SUCCESS',
              type: 'WITHDRAW',
              fromAccountId: account.id,
            },
          })

          return { account: updated, transaction: txRecord, fee }
        })

        return NextResponse.json({ success: true, ...result })
      } catch (err) {
        const code = err instanceof Error ? err.message : 'ERROR'
        const message =
          code === 'ACCOUNT_NOT_FOUND'
            ? 'Không tìm thấy tài khoản'
            : code === 'ACCOUNT_LOCKED'
              ? 'Tài khoản đang bị khóa'
              : code === 'DAILY_LIMIT'
                ? 'Vượt hạn mức giao dịch ngày'
                : code === 'INSUFFICIENT_FUNDS'
                  ? 'Số dư không đủ (đã gồm phí)'
                  : 'Rút tiền thất bại'

        return NextResponse.json({ success: false, message }, { status: 400 })
      }
    }
  )
}
