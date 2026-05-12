"use server"

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { generateAccountNumber } from '@/lib/utils'
import { getRequestMeta } from '@/lib/security/request'
import { runWithSecurityContext } from '@/lib/security/context'

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
    const meta = await getRequestMeta()
    const result = await runWithSecurityContext(
      {
        userId,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        fingerprint: meta.fingerprint,
        requestId: meta.requestId,
        requestPath: meta.requestPath,
        requestMethod: meta.requestMethod,
      },
      async () => {
        return prisma.$transaction(async (tx) => {
          const count = await tx.account.count({ where: { userId } })

          const account = await tx.account.create({
            data: {
              userId,
              accountNumber: generateAccountNumber(),
              balance: 0,
              isLocked: false,
            },
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
              },
            })

            await tx.account.update({
              where: { id: account.id },
              data: { balance: { increment: WELCOME_AMOUNT } },
            })
          }

          return account
        })
      }
    )

    return { success: true, account: result }
  } catch (error) {
    console.error('Create account error:', error)
    return { error: 'Lỗi hệ thống' }
  }
}
