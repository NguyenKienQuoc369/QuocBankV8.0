import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }
    const userId = String((session as any).id)

    const body: any = await req.json().catch(() => ({} as any))
    const amountRaw = body?.amount
    const description: string | undefined = body?.description
    const amt = Number(amountRaw)

    if (!Number.isFinite(amt) || amt <= 0) {
      return NextResponse.json({ success: false, message: 'Số tiền rút phải > 0' }, { status: 400 })
    }

    const FEE_RATE = Number(process.env.WITHDRAW_FEE_RATE ?? '0.005')
    const fee = Math.round(amt * FEE_RATE)
    const totalDebit = amt + fee

    const result = await prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({
        where: { userId: userId },
        orderBy: { createdAt: 'asc' }
      })
      if (!account) throw new Error('Không tìm thấy tài khoản')
      if (account.isLocked) throw new Error('Tài khoản đang bị khóa')
      if (account.balance < totalDebit) throw new Error('Số dư không đủ (bao gồm cả phí)')

      const updated = await tx.account.update({
        where: { id: account.id },
        data: { balance: { decrement: totalDebit } }
      })

      const txRecord = await tx.transaction.create({
        data: {
          amount: amt,
          description: (description || 'Rút tiền') + ` | Phí đã trừ: ${fee.toLocaleString('vi-VN')} VND`,
          status: 'SUCCESS',
          type: 'WITHDRAW',
          fromAccountId: account.id
        }
      })

      return { account: updated, transaction: txRecord, fee }
    })

    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    console.error('API withdraw error:', error)
    return NextResponse.json(
      { success: false, message: error?.message || 'Withdraw failed' },
      { status: 400 }
    )
  }
}
