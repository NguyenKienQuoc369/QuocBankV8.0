// app/api/cards/issue/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCardNumber, generateCVV } from '@/lib/utils'
import { withApiGuard } from '@/lib/api/guard'

function computeExpiryMMYY(yearsAhead = 5) {
  const now = new Date()
  const exp = new Date(now)
  exp.setFullYear(now.getFullYear() + yearsAhead)
  const mm = String(exp.getMonth() + 1).padStart(2, '0')
  const yy = String(exp.getFullYear()).slice(-2)
  return `${mm}/${yy}`
}

export async function POST(req: Request) {
  return withApiGuard(
    req,
    {
      requireAuth: true,
      actionName: 'cards.issue',
      rateLimit: { keyPrefix: 'api:cards:issue', limit: 20, windowMs: 60_000 },
    },
    async ({ userId }) => {
      const uid = String(userId)

      // Find user's primary account (first account)
      const account = await prisma.account.findFirst({
        where: { userId: uid },
        select: { id: true }
      })

      if (!account) {
        return NextResponse.json({ success: false, message: 'Không tìm thấy tài khoản' }, { status: 400 })
      }

    // Rate limit: max N cards per user per day
    const dailyLimit = Number(process.env.CARD_ISSUE_DAILY_LIMIT ?? '3')
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

      const issuedToday = await prisma.card.count({
        where: {
          account: { userId: uid },
          createdAt: { gte: startOfDay }
        }
      })

      if (issuedToday >= dailyLimit) {
        return NextResponse.json(
          { success: false, message: `Đã vượt giới hạn phát hành thẻ trong ngày (${dailyLimit}/ngày). Vui lòng thử lại vào ngày mai.` },
          { status: 429 }
        )
      }

    // Create a new virtual card
      const card = await prisma.card.create({
        data: {
          accountId: account.id,
          cardNumber: generateCardNumber(),
          expiryDate: computeExpiryMMYY(5),
          cvv: generateCVV(),
          type: 'PLATINUM',
          isLocked: false
        },
        select: {
          id: true,
          cardNumber: true,
          expiryDate: true,
          type: true,
          isLocked: true,
          createdAt: true
        }
      })

      return NextResponse.json({ success: true, message: 'Đã phát hành thẻ ảo mới', data: card }, { status: 200 })
    }
  )
}
