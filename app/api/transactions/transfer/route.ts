import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session as any).id as string

  try {
    const body = await req.json()
    const { fromAccountNumber, toAccountNumber, amount, description } = body

    if (!fromAccountNumber || !toAccountNumber || amount == null) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    }
    if (fromAccountNumber === toAccountNumber) {
      return NextResponse.json({ error: 'Cannot transfer to the same account' }, { status: 400 })
    }
    const amt = Number(amount)
    if (!Number.isFinite(amt) || amt <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 })
    }

    const FEE_RATE = Number(process.env.TRANSFER_FEE_RATE ?? '0.005')
    const fee = Number((amt * FEE_RATE).toFixed(0)) // round to VND integer
    const totalDebit = amt + fee

    const result = await prisma.$transaction(async (tx) => {
      const from = await tx.account.findUnique({ where: { accountNumber: fromAccountNumber } })
      const to = await tx.account.findUnique({ where: { accountNumber: toAccountNumber } })

      if (!from) throw new Error('Sender account not found')
      if (!to) throw new Error('Recipient account not found')
      if (from.userId !== userId) throw new Error('Sender account does not belong to you')
      if (from.isLocked) throw new Error('Sender account is locked')
      if (to.isLocked) throw new Error('Recipient account is locked')
      if (from.balance < totalDebit) throw new Error('Insufficient funds (including fee)')

      // Apply balances: sender pays amount + fee, recipient receives amount
      await tx.account.update({ where: { id: from.id }, data: { balance: { decrement: totalDebit } } })
      await tx.account.update({ where: { id: to.id }, data: { balance: { increment: amt } } })

      const txRecord = await tx.transaction.create({
        data: {
          amount: amt,
          description: (description || 'Chuyển khoản') + ` | Phí đã trừ: ${fee.toLocaleString()} VND`,
          status: 'SUCCESS',
          type: 'TRANSFER',
          fromAccountId: from.id,
          toAccountId: to.id,
        }
      })

      return txRecord
    })

    return NextResponse.json({ success: true, fee, transaction: result })
  } catch (error: any) {
    console.error('API transfer error:', error)
    return NextResponse.json({ error: error?.message || 'Transfer failed' }, { status: 400 })
  }
}
