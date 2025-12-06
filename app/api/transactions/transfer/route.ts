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

    if (!fromAccountNumber || !toAccountNumber || !amount) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
      const from = await tx.account.findUnique({ where: { accountNumber: fromAccountNumber } })
      const to = await tx.account.findUnique({ where: { accountNumber: toAccountNumber } })

      if (!from) throw new Error('Sender account not found')
      if (!to) throw new Error('Recipient account not found')
      if (from.userId !== userId) throw new Error('Sender account does not belong to you')
      if (from.isLocked) throw new Error('Sender account is locked')
      if (to.isLocked) throw new Error('Recipient account is locked')
      if (from.balance < amount) throw new Error('Insufficient funds')

      await tx.account.update({ where: { id: from.id }, data: { balance: { decrement: amount } } })
      await tx.account.update({ where: { id: to.id }, data: { balance: { increment: amount } } })

      const txRecord = await tx.transaction.create({
        data: {
          amount,
          description: description || 'Chuyển khoản',
          status: 'SUCCESS',
          type: 'TRANSFER',
          fromAccountId: from.id,
          toAccountId: to.id,
        }
      })

      return txRecord
    })

    return NextResponse.json({ success: true, transaction: result })
  } catch (error: any) {
    console.error('API transfer error:', error)
    return NextResponse.json({ error: error?.message || 'Transfer failed' }, { status: 400 })
  }
}
