import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await getSession()
  if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session as any).id as string

  try {
    const url = new URL(req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const pageSize = Math.min(100, Math.max(5, Number(url.searchParams.get('pageSize') || '20')))
    const type = url.searchParams.get('type') || undefined
    const q = url.searchParams.get('q') || undefined
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    const whereClauses: Record<string, unknown> = {
      OR: [
        { fromAccount: { userId } },
        { toAccount: { userId } },
      ],
    }

    if (type) whereClauses.type = type

    if (startDate || endDate) {
      const dateFilter: { gte?: Date; lte?: Date } = {}
      if (startDate) dateFilter.gte = new Date(startDate)
      if (endDate) dateFilter.lte = new Date(endDate)
      whereClauses.createdAt = dateFilter
    }

    if (q) {
      // Search for transactions where either account number contains q
      whereClauses.AND = [
        {
          OR: [
            { fromAccount: { accountNumber: { contains: q } } },
            { toAccount: { accountNumber: { contains: q } } },
          ],
        },
      ]
    }

    const skip = (page - 1) * pageSize

    const [total, transactions] = await Promise.all([
      prisma.transaction.count({ where: whereClauses }),
      prisma.transaction.findMany({
        where: whereClauses,
        include: {
          fromAccount: { select: { accountNumber: true } },
          toAccount: { select: { accountNumber: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ])

    return NextResponse.json({ success: true, transactions, total, page, pageSize })
  } catch (error: unknown) {
    console.error('API transactions list error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Server error' }, { status: 500 })
  }
}
