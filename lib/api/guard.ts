import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { runWithSecurityContext, type SecurityContext } from '@/lib/security/context'
import { writeSecurityLog } from '@/lib/security/log'
import { rateLimit, makeRateLimitKey } from '@/lib/security/rateLimit'
import { looksLikeScriptPayload, sanitizeText } from '@/lib/security/sanitize'
import { sendSecurityAlertEmail } from '@/lib/security/alerts'

export type GuardOptions<TBody> = {
  requireAuth?: boolean
  bodySchema?: z.ZodType<TBody>
  rateLimit?: { limit: number; windowMs: number; keyPrefix: string }
  actionName?: string
  sanitize?: {
    fields?: string[] // best-effort sanitize string fields in parsed body
  }
}

export type GuardContext<TBody> = {
  session: any | null
  userId?: string
  ipAddress?: string
  userAgent?: string
  fingerprint?: string
  requestId?: string
  body?: TBody
}

function getIpFromRequest(req: Request): string | undefined {
  const h = req.headers
  return (
    h.get('x-qb-ip') ||
    h.get('cf-connecting-ip') ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    undefined
  )
}

function getFingerprintFromRequest(req: Request): string | undefined {
  return req.headers.get('x-qb-fp') || undefined
}

function getRequestIdFromRequest(req: Request): string | undefined {
  return req.headers.get('x-qb-request-id') || req.headers.get('x-request-id') || undefined
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status })
}

export function withApiGuard<TBody = unknown>(
  req: Request,
  opts: GuardOptions<TBody>,
  handler: (ctx: GuardContext<TBody>) => Promise<NextResponse>
) {
  return (async () => {
    const session = await getSession()
    const userId = session?.id ? String(session.id) : undefined
    const ipAddress = getIpFromRequest(req)
    const userAgent = req.headers.get('user-agent') || undefined
    const fingerprint = getFingerprintFromRequest(req)
    const requestId = getRequestIdFromRequest(req)

    if (opts.requireAuth && !userId) {
      return errorResponse('Unauthorized', 401)
    }

    if (opts.rateLimit) {
      const key = makeRateLimitKey([opts.rateLimit.keyPrefix, ipAddress || 'unknown', userId])
      const rl = rateLimit(key, opts.rateLimit.limit, opts.rateLimit.windowMs)
      if (!rl.ok) {
        await writeSecurityLog({
          action: opts.actionName || 'rate_limit.block',
          severity: 'HIGH',
          status: 'BLOCK',
          ipAddress,
          userAgent,
          fingerprint,
          requestId,
          requestPath: new URL(req.url).pathname,
          requestMethod: req.method,
          metadata: { keyPrefix: opts.rateLimit.keyPrefix },
        }).catch(() => {})

        await sendSecurityAlertEmail({
          subject: `[QuocBank] Rate limit block: ${opts.actionName || opts.rateLimit.keyPrefix}`,
          html: `<p>Blocked by rate limit.</p><pre>${JSON.stringify({ ipAddress, userId, requestId, path: new URL(req.url).pathname }, null, 2)}</pre>`,
        }).catch(() => {})

        return NextResponse.json(
          { success: false, message: 'Too many requests' },
          {
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
            },
          }
        )
      }
    }

    let body: TBody | undefined = undefined
    if (opts.bodySchema) {
      const json = await req.json().catch(() => null)
      if (json && looksLikeScriptPayload(JSON.stringify(json))) {
        await writeSecurityLog({
          action: opts.actionName || 'input.suspicious',
          severity: 'HIGH',
          status: 'INFO',
          ipAddress,
          userAgent,
          fingerprint,
          requestId,
          requestPath: new URL(req.url).pathname,
          requestMethod: req.method,
          metadata: { hint: 'possible_script_payload' },
        }).catch(() => {})

        await sendSecurityAlertEmail({
          subject: `[QuocBank] Suspicious input detected: ${opts.actionName || 'api'}`,
          html: `<p>Possible script payload detected.</p><pre>${JSON.stringify({ ipAddress, userId, requestId, path: new URL(req.url).pathname }, null, 2)}</pre>`,
        }).catch(() => {})
      }

      const parsed = opts.bodySchema.safeParse(json)
      if (!parsed.success) {
        return errorResponse(parsed.error.issues[0]?.message || 'Invalid request', 400)
      }

      body = parsed.data

      // Best-effort sanitization for known string fields
      if (opts.sanitize?.fields && body && typeof body === 'object') {
        for (const field of opts.sanitize.fields) {
          const v = (body as any)[field]
          if (typeof v === 'string') (body as any)[field] = sanitizeText(v)
        }
      }
    }

    const ctx: SecurityContext = {
      userId,
      ipAddress,
      userAgent,
      fingerprint,
      requestId,
      requestPath: new URL(req.url).pathname,
      requestMethod: req.method,
    }

    return runWithSecurityContext(ctx, async () => {
      try {
        return await handler({ session, userId, ipAddress, userAgent, fingerprint, requestId, body })
      } catch (err) {
        // Mask internal details
        await writeSecurityLog(
          {
            action: opts.actionName || 'api.error',
            severity: 'HIGH',
            status: 'FAIL',
            metadata: { errorName: err instanceof Error ? err.name : 'Error' },
          },
          ctx
        ).catch(() => {})

        return errorResponse('Internal error', 500)
      }
    })
  })()
}
