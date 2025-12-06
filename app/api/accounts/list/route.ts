import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session as any).id as string

  try {
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: { id: true, accountNumber: true, balance: true }
    })
    return NextResponse.json({ success: true, accounts })
  } catch (error: any) {
    console.error('API accounts list error:', error)
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 })
  }
}
