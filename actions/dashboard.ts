'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function getDashboardData() {
  const session = await getSession()
  if (!session?.id) return { error: 'Unauthorized' }
  const userId = String(session.id)

  try {
    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        fullName: true,
      }
    })

    if (!user) return { error: 'User not found' }

    // Get first account with card
    const account = await prisma.account.findFirst({
      where: { userId },
      include: {
        cards: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!account) {
      return { error: 'No account found. Please create an account first.' }
    }

    // Get recent transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { fromAccountId: account.id },
          { toAccountId: account.id }
        ]
      },
      include: {
        fromAccount: {
          select: { accountNumber: true, userId: true }
        },
        toAccount: {
          select: { accountNumber: true, userId: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return {
      user: {
        ...user,
        name: user.fullName
      },
      account: {
        ...account,
        userId: account.userId,
        card: account.cards[0] || null
      },
      transactions
    }
  } catch (error) {
    console.error('Get dashboard data error:', error)
    return { error: 'Failed to load dashboard data' }
  }
}
