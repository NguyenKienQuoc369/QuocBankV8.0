import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { withApiGuard } from '@/lib/api/guard'
import { writeSecurityLog } from '@/lib/security/log'
import { sendSecurityAlertEmail } from '@/lib/security/alerts'

const TransferBodySchema = z.object({
  fromAccountNumber: z.string().min(6).max(32).regex(/^\d+$/, 'Invalid sender account'),
  toAccountNumber: z.string().min(6).max(32).regex(/^\d+$/, 'Invalid recipient account'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  description: z.string().max(200).optional(),
})

export async function POST(req: Request) {
  return withApiGuard(
    req,
    {
      requireAuth: true,
      actionName: 'transactions.transfer',
      rateLimit: { keyPrefix: 'api:tx:transfer', limit: 10, windowMs: 60_000 },
      bodySchema: TransferBodySchema,
      sanitize: { fields: ['description'] },
    },
    async ({ userId, ipAddress, userAgent, fingerprint, requestId, body }) => {
      const uid = String(userId)
      const { fromAccountNumber, toAccountNumber, amount, description } = body!
      if (fromAccountNumber === toAccountNumber) {
        return NextResponse.json({ success: false, message: 'Không thể tự chuyển vào chính mình' }, { status: 400 })
      }

      const FEE_RATE = Number(process.env.TRANSFER_FEE_RATE ?? '0.005')
      const fee = Math.round(amount * FEE_RATE)
      const totalDebit = amount + fee

      try {
        const result = await prisma.$transaction(async (tx) => {
          const from = await tx.account.findUnique({ where: { accountNumber: fromAccountNumber } })
          const to = await tx.account.findUnique({ where: { accountNumber: toAccountNumber } })

          if (!from || from.userId !== uid) throw new Error('NOT_ALLOWED')
          if (!to) throw new Error('RECIPIENT_NOT_FOUND')
          if (from.isLocked) throw new Error('SENDER_LOCKED')
          if (to.isLocked) throw new Error('RECIPIENT_LOCKED')
          if (from.dailyLimit != null && amount > from.dailyLimit) throw new Error('DAILY_LIMIT')
          if (from.balance < totalDebit) throw new Error('INSUFFICIENT_FUNDS')

          await tx.account.update({ where: { id: from.id }, data: { balance: { decrement: totalDebit } } })
          await tx.account.update({ where: { id: to.id }, data: { balance: { increment: amount } } })

          const txRecord = await tx.transaction.create({
            data: {
              amount,
              description: (description || 'Chuyển khoản') + ` | Phí đã trừ: ${fee.toLocaleString('vi-VN')} VND`,
              status: 'SUCCESS',
              type: 'TRANSFER',
              fromAccountId: from.id,
              toAccountId: to.id,
            },
          })

          return txRecord
        })

        const threshold = Number(process.env.TRANSFER_ALERT_THRESHOLD ?? '100000000')
        if (Number.isFinite(threshold) && amount >= threshold) {
          await writeSecurityLog({
            action: 'transactions.transfer.large',
            severity: 'CRITICAL',
            status: 'INFO',
            userId: uid,
            ipAddress,
            userAgent,
            fingerprint,
            requestId,
            requestPath: new URL(req.url).pathname,
            requestMethod: 'POST',
            metadata: { amount, fee, fromAccountNumber, toAccountNumber },
          }).catch(() => {})

          await sendSecurityAlertEmail({
            subject: '[QuocBank] Large transfer detected',
            html: `<p>Large transfer</p><pre>${JSON.stringify({ userId: uid, ipAddress, amount, fee, fromAccountNumber, toAccountNumber }, null, 2)}</pre>`,
          }).catch(() => {})
        }

        return NextResponse.json({ success: true, fee, transaction: result })
      } catch (err) {
        const code = err instanceof Error ? err.message : 'ERROR'
        const message =
          code === 'NOT_ALLOWED'
            ? 'Tài khoản nguồn không hợp lệ'
            : code === 'RECIPIENT_NOT_FOUND'
              ? 'Không tìm thấy tài khoản người nhận'
              : code === 'SENDER_LOCKED'
                ? 'Tài khoản nguồn đang bị khóa'
                : code === 'RECIPIENT_LOCKED'
                  ? 'Tài khoản người nhận đang bị khóa'
                  : code === 'DAILY_LIMIT'
                    ? 'Vượt hạn mức giao dịch ngày'
                    : code === 'INSUFFICIENT_FUNDS'
                      ? 'Số dư không đủ (đã gồm phí)'
                      : 'Giao dịch thất bại'

        return NextResponse.json({ success: false, message }, { status: 400 })
      }
    }
  )
}
