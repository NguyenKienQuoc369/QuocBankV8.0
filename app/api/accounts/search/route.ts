import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withApiGuard } from '@/lib/api/guard'
import { sanitizeText, looksLikeScriptPayload } from '@/lib/security/sanitize'

export async function GET(req: Request) {
  return withApiGuard(
    req,
    {
      requireAuth: true,
      actionName: 'accounts.search',
      rateLimit: { keyPrefix: 'api:accounts:search', limit: 60, windowMs: 60_000 },
    },
    async ({ userId, ipAddress, userAgent, fingerprint, requestId }) => {
      const rawQ = new URL(req.url).searchParams.get('q') || ''
      const q = sanitizeText(rawQ, 64)
      if (!q || q.length < 2) {
        return NextResponse.json({ success: true, results: [] })
      }

      if (looksLikeScriptPayload(q)) {
        // Best-effort: do not block, just return empty to avoid enumeration and log event.
        const { writeSecurityLog } = await import('@/lib/security/log')
        await writeSecurityLog({
          action: 'accounts.search.suspicious',
          severity: 'HIGH',
          status: 'INFO',
          userId: userId ? String(userId) : undefined,
          ipAddress,
          userAgent,
          fingerprint,
          requestId,
          requestPath: new URL(req.url).pathname,
          requestMethod: 'GET',
          metadata: { q },
        }).catch(() => {})
        return NextResponse.json({ success: true, results: [] })
      }

      const accounts = await prisma.account.findMany({
        where: {
          OR: [
            { accountNumber: { contains: q, mode: 'insensitive' } as any },
            { user: { fullName: { contains: q, mode: 'insensitive' } as any } },
          ],
        },
        select: {
          id: true,
          accountNumber: true,
          user: { select: { fullName: true } },
        },
        take: 20,
      })

      const results = accounts.map((a) => ({ id: a.id, accountNumber: a.accountNumber, ownerName: a.user.fullName }))
      return NextResponse.json({ success: true, results })
    }
  )
}
