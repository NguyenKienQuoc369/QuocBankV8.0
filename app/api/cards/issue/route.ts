// app/api/cards/issue/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { generateCardNumber, generateCVV } from '@/lib/utils'

function computeExpiryMMYY(yearsAhead = 5) {
  const now = new Date()
  const exp = new Date(now)
  exp.setFullYear(now.getFullYear() + yearsAhead)
  const mm = String(exp.getMonth() + 1).padStart(2, '0')
  const yy = String(exp.getFullYear()).slice(-2)
  return `${mm}/${yy}`
}

export async function POST() {
  try {
    const session = await getSession()
    if (!session || !session.id) {
      return NextResponse.json({ success: false, message: 'Chưa đăng nhập' }, { status: 401 })
    }

    // Find user's primary account (first account)
    const account = await prisma.account.findFirst({
      where: { userId: String(session.id) },
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
        account: { userId: String(session.id) },
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
  } catch (error: any) {
    console.error('Issue virtual card error:', error)
    const msg =
      typeof error?.message === 'string'
        ? error.message
        : 'Lỗi máy chủ khi phát hành thẻ'
    return NextResponse.json({ success: false, message: msg }, { status: 500 })
  }
}
