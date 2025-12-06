"use server"

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

const ITEMS_PER_PAGE = 10

export async function getTransactionHistory(page: number = 1, type?: string) {
  const token = (await cookies()).get('session_token')?.value
  if (!token) return { transactions: [], totalPages: 0 }
  
  const payload = await verifyToken(token)
  if (!payload) return { transactions: [], totalPages: 0 }
  
  const userId = String(payload.id)

  const mainAccount = await prisma.account.findFirst({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  })
  
  if (!mainAccount) return { transactions: [], totalPages: 0 }

  let whereCondition: Record<string, unknown> = {
    OR: [
      { fromAccountId: mainAccount.id },
      { toAccountId: mainAccount.id }
    ]
  }

  if (type === 'IN') {
    whereCondition = { 
      AND: [
        { toAccountId: mainAccount.id },
        { type: { not: 'WITHDRAW' } }
      ]
    }
  } else if (type === 'OUT') {
    whereCondition = { fromAccountId: mainAccount.id }
  }

  const totalCount = await prisma.transaction.count({ where: whereCondition })
  const transactions = await prisma.transaction.findMany({
    where: whereCondition,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    include: {
      fromAccount: { include: { user: { select: { fullName: true, username: true } } } },
      toAccount: { include: { user: { select: { fullName: true, username: true } } } }
    }
  })

  const formattedTx = transactions.map(tx => {
    const isIncoming = tx.toAccountId === mainAccount.id
    return {
      id: tx.id,
      description: tx.description,
      amount: tx.amount,
      date: tx.createdAt,
      status: tx.status,
      type: tx.type,
      isIncoming,
      partnerName: isIncoming 
        ? (tx.fromAccount?.user?.fullName || tx.fromAccount?.user?.username || 'Hệ thống')
        : (tx.toAccount?.user?.fullName || tx.toAccount?.user?.username || 'Hệ thống'),
    }
  })

  return {
    transactions: formattedTx,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    currentPage: page
  }
}
