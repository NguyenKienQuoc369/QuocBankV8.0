import { NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/auth'
import { withApiGuard } from '@/lib/api/guard'

export async function POST(req: Request) {
  return withApiGuard(
    req,
    {
      requireAuth: false,
      actionName: 'auth.logout',
      rateLimit: { keyPrefix: 'api:auth:logout', limit: 60, windowMs: 60_000 },
    },
    async () => {
      await clearSessionCookie()
      return NextResponse.json({ success: true })
    }
  )
}
