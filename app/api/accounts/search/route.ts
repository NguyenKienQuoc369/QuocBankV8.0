import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await getSession()
  if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const q = new URL(req.url).searchParams.get('q') || ''

  try {
    const accounts = await prisma.account.findMany({
      where: {
        OR: [
          { accountNumber: { contains: q } },
          { user: { fullName: { contains: q } } },
        ],
      },
      select: {
        id: true,
        accountNumber: true,
        balance: true,
        user: { select: { fullName: true } },
      },
      take: 20,
    })

    const results = accounts.map((a) => ({ id: a.id, accountNumber: a.accountNumber, balance: a.balance, ownerName: a.user.fullName }))
    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    console.error('API accounts search error:', error)
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 })
  }
}
