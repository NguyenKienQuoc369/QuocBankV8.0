import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { generateAccountNumber } from '@/lib/utils'

export async function POST() {
  const session = await getSession()
  if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.id as string

  try {
    const result = await prisma.$transaction(async (tx) => {
      const count = await tx.account.count({ where: { userId } })

      const account = await tx.account.create({
        data: {
          userId,
          accountNumber: generateAccountNumber(),
          balance: 0,
        }
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
          }
        })

        await tx.account.update({ where: { id: account.id }, data: { balance: { increment: WELCOME_AMOUNT } as any } })
      }

      return account
    })

    return NextResponse.json({ success: true, account: result })
  } catch (error: unknown) {
    console.error('API create account error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}
