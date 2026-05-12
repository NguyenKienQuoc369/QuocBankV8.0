import { NextResponse } from 'next/server'
import { SecuritySeverity } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { withApiGuard } from '@/lib/api/guard'
import { isAdminUsername } from '@/lib/security/admin'

function bucketHour(d: Date) {
  const dt = new Date(d)
  dt.setMinutes(0, 0, 0)
  return dt.toISOString()
}

export async function GET(req: Request) {
  return withApiGuard(
    req,
    {
      requireAuth: true,
      actionName: 'security.logs.list',
      rateLimit: { keyPrefix: 'api:security:logs', limit: 60, windowMs: 60_000 },
    },
    async ({ session }) => {
      if (!isAdminUsername(session?.username)) {
        return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
      }

      const url = new URL(req.url)
      const severityRaw = url.searchParams.get('severity') || 'HIGH,CRITICAL'
      const allowedSeverities = new Set<string>(Object.values(SecuritySeverity))
      const severities = severityRaw
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter((s): s is SecuritySeverity => allowedSeverities.has(s))
        .slice(0, 4)

      const effectiveSeverities: SecuritySeverity[] =
        severities.length > 0 ? severities : [SecuritySeverity.HIGH, SecuritySeverity.CRITICAL]

      const take = Math.min(200, Math.max(10, Number(url.searchParams.get('take') || '100')))
      const sinceHours = Math.min(168, Math.max(1, Number(url.searchParams.get('sinceHours') || '24')))

      const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000)

      const logs = await prisma.securityLog.findMany({
        where: {
          severity: { in: effectiveSeverities },
          createdAt: { gte: since },
        },
        orderBy: { createdAt: 'desc' },
        take,
        select: {
          id: true,
          createdAt: true,
          userId: true,
          action: true,
          severity: true,
          status: true,
          ipAddress: true,
          location: true,
          userAgent: true,
          requestPath: true,
          requestMethod: true,
        },
      })

      const buckets = new Map<string, number>()
      for (const l of logs) {
        const k = bucketHour(new Date(l.createdAt))
        buckets.set(k, (buckets.get(k) || 0) + 1)
      }

      const series: Array<{ hour: string; count: number }> = []
      for (let i = sinceHours; i >= 0; i--) {
        const d = new Date(Date.now() - i * 60 * 60 * 1000)
        const k = bucketHour(d)
        series.push({ hour: k, count: buckets.get(k) || 0 })
      }

      return NextResponse.json({ success: true, logs, series })
    }
  )
}
