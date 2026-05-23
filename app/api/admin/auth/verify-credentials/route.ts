import { NextResponse } from 'next/server'
import { checkAdminPassword } from '@/lib/security/admin-auth'
import { verifyTurnstile } from '@/lib/security/turnstile'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const employeeId = String(body?.employeeId || '').trim()
  const password = String(body?.password || '')
  const turnstileToken = body?.turnstileToken as string | undefined

  if (!employeeId || !password) {
    return NextResponse.json({ ok: false, error: 'Missing credentials' }, { status: 400 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined
  const ua = req.headers.get('user-agent') || undefined

  const captcha = await verifyTurnstile(turnstileToken, ip)
  if (!captcha.success) {
    return NextResponse.json({ ok: false, error: 'Captcha failed' }, { status: 400 })
  }

  const result = await checkAdminPassword({ employeeId, password, ipAddress: ip, userAgent: ua })
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
