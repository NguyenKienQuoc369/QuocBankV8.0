"use server"

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { generateAccountNumber } from '@/lib/utils'

/**
 * Create a new bank account for the authenticated user.
 * New accounts are created with zero balance. If this is the user's first
 * account, the system will credit 50,000 VND as a welcome bonus.
 */
export async function createAccount() {
  const session = await getSession()
  if (!session?.id) return { error: 'Unauthorized' }
  const userId = (session as any).id as string

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Count existing accounts for this user
      const count = await tx.account.count({ where: { userId } })

      // Create empty account
      const account = await tx.account.create({
        data: {
          userId,
          accountNumber: generateAccountNumber(),
          balance: 0,
          isLocked: false,
        }
      })

      // If this was the first account ever for the user, credit welcome bonus
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

        await tx.account.update({
          where: { id: account.id },
          data: { balance: { increment: WELCOME_AMOUNT } as any }
        })
      }

      return account
    })

    return { success: true, account: result }
  } catch (error: any) {
    console.error('Create account error:', error)
    return { error: error?.message || 'Lỗi hệ thống' }
  }
}
