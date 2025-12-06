import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import SettingsClient from './SettingsClient'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const session = await getSession()
  if (!session) redirect('/auth/login')

  const sessionId = String((session as any).id)

  const user = await prisma.user.findUnique({
    where: { id: sessionId },
    select: {
      id: true,
      fullName: true,
      username: true,
      accounts: {
        select: {
          id: true,
          accountNumber: true,
          balance: true,
          isLocked: true
        }
      }
    }
  })

  if (!user) redirect('/auth/login')

  return <SettingsClient user={user} />
}
