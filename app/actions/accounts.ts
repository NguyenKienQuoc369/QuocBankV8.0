"use server"

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { generateAccountNumber } from '@/lib/utils'

/**
 * Get all accounts for the authenticated user
 */
export async function getMyAccounts() {
  const session = await getSession()
  if (!session?.id) return []
  const userId = String(session.id)

  try {
    const accounts = await prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    return accounts
  } catch (error) {
    console.error('Get accounts error:', error)
    return []
  }
}

/**
 * Get total balance across all accounts for the authenticated user
 */
export async function getTotalBalance() {
  const session = await getSession()
  if (!session?.id) return 0
  const userId = String(session.id)

  try {
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { balance: true }
    })
    return accounts.reduce((sum, acc) => sum + acc.balance, 0)
  } catch (error) {
    console.error('Get total balance error:', error)
    return 0
  }
}

/**
 * Get user info with account details
 */
export async function getUserDashboardData() {
  const session = await getSession()
  if (!session?.id) return null
  const userId = String(session.id)

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          include: {
            cards: true,
            savings: true
          }
        }
      }
    })
    return user
  } catch (error) {
    console.error('Get user dashboard data error:', error)
    return null
  }
}

/**
 * Create a new bank account for the authenticated user.
 * New accounts are created with zero balance. If this is the user's first
 * account, the system will credit 50,000 VND as a welcome bonus.
 */
export async function createAccount() {
  const session = await getSession()
  if (!session?.id) return { error: 'Unauthorized' }
  const userId = String(session.id)

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
  } catch (error) {
    console.error('Create account error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return { error: message || 'Lỗi hệ thống' }
  }
}
