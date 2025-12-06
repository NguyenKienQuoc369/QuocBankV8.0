import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// POST /api/transactions/deposit
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
      return NextResponse.json({ success: false, message: 'Số tiền nạp phải > 0' }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({
        where: { userId: userId },
        orderBy: { createdAt: 'asc' }
      })
      if (!account) throw new Error('Không tìm thấy tài khoản')
      if (account.isLocked) throw new Error('Tài khoản đang bị khóa')

      const updated = await tx.account.update({
        where: { id: account.id },
        data: { balance: { increment: amt } }
      })

      const txRecord = await tx.transaction.create({
        data: {
          amount: amt,
          description: description || 'Nạp tiền',
          status: 'SUCCESS',
          type: 'DEPOSIT',
          toAccountId: account.id
        }
      })

      return { account: updated, transaction: txRecord }
    })

    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    console.error('API deposit error:', error)
    return NextResponse.json(
      { success: false, message: error?.message || 'Deposit failed' },
      { status: 400 }
    )
  }
}
