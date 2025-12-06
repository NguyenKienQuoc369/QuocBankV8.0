"use server"

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

type TransferParams = {
  fromAccountNumber: string
  toAccountNumber: string
  amount: number
  description?: string
}

export async function transferFunds({ fromAccountNumber, toAccountNumber, amount, description }: TransferParams) {
  const session = await getSession()
  if (!session?.id) return { error: 'Unauthorized' }
  const userId = (session as any).id as string

  if (fromAccountNumber === toAccountNumber) return { error: 'Cannot transfer to same account' }
  if (amount <= 0) return { error: 'Invalid amount' }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Load accounts inside the transaction
      const from = await tx.account.findUnique({ where: { accountNumber: fromAccountNumber } })
      const to = await tx.account.findUnique({ where: { accountNumber: toAccountNumber } })

      if (!from) throw new Error('Sender account not found')
      if (!to) throw new Error('Recipient account not found')
      if (from.userId !== userId) throw new Error('Sender account does not belong to you')
      if (from.isLocked) throw new Error('Sender account is locked')
      if (to.isLocked) throw new Error('Recipient account is locked')

      if (from.balance < amount) throw new Error('Insufficient funds')

      // Update balances
      await tx.account.update({ where: { id: from.id }, data: { balance: { decrement: amount } as any } })
      await tx.account.update({ where: { id: to.id }, data: { balance: { increment: amount } as any } })

      // Create transaction record
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

    return { success: true, transaction: result }
  } catch (error: any) {
    console.error('Transfer error:', error)
    return { error: error?.message || 'Transfer failed' }
  }
}
