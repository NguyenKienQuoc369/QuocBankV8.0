import { NextResponse, type NextRequest } from 'next/server'

function getIp(req: NextRequest): string | undefined {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    undefined
  )
}

function isIpAllowed(ip: string | undefined): boolean {
  if (!ip) return false
  const raw = process.env.ALLOWED_INTERNAL_IPS || ''
  const list = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  if (list.length === 0) {
    return process.env.NODE_ENV !== 'production'
  }

  return list.includes(ip) || ip === '127.0.0.1' || ip === '::1'
}

function isVietnamRequest(req: NextRequest): boolean {
  const country = (req as any).geo?.country || req.headers.get('x-vercel-ip-country')
  if (!country) return true
  return country === 'VN'
}

async function sha256Base64Url(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const bytes = new Uint8Array(digest)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  const b64 = btoa(binary)
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function buildCsp(): string {
  // Baseline CSP that is compatible with Next.js while still blocking common exfil paths.
  // You can tighten further via env vars without code changes.
  const connectSrc = process.env.CSP_CONNECT_SRC || "'self'"
  const imgSrc = process.env.CSP_IMG_SRC || "'self' data: blob:"
  const frameSrc = process.env.CSP_FRAME_SRC || "'none'"
  const styleSrc = process.env.CSP_STYLE_SRC || "'self' 'unsafe-inline'"
  const scriptSrc = process.env.CSP_SCRIPT_SRC || "'self' 'unsafe-inline' 'unsafe-eval'"
  const turnstileSrc = 'https://challenges.cloudflare.com'
  const finalScriptSrc = scriptSrc.includes(turnstileSrc) ? scriptSrc : `${scriptSrc} ${turnstileSrc}`
  const finalFrameSrc = frameSrc.includes(turnstileSrc) ? frameSrc : `${frameSrc} ${turnstileSrc}`

  return [
    "default-src 'self'",
    `connect-src ${connectSrc}`,
    `img-src ${imgSrc}`,
    `frame-src ${finalFrameSrc}`,
    `style-src ${styleSrc}`,
    `script-src ${finalScriptSrc}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ')
}

export async function middleware(req: NextRequest) {
  const ip = getIp(req)
  const ua = req.headers.get('user-agent') || ''
  const al = req.headers.get('accept-language') || ''
  const ch = req.headers.get('sec-ch-ua') || ''
  const fpSource = [ua, al, ch].join('|')
  const fp = await sha256Base64Url(fpSource)

  const requestId = crypto.randomUUID()
  const pathname = req.nextUrl.pathname

  const isAdminRoute = pathname.startsWith('/admin')
  if (isAdminRoute) {
    if (!isIpAllowed(ip) || !isVietnamRequest(req)) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  const fpCookieName = process.env.NODE_ENV === 'production' ? '__Host-qb_df' : 'qb_df'
  const existingFp = req.cookies.get(fpCookieName)?.value || req.cookies.get('__Host-qb_df')?.value || req.cookies.get('qb_df')?.value
  const sessionCookie = req.cookies.get('session')?.value

  const isApi = pathname.startsWith('/api/')
  const isSensitive = pathname.startsWith('/dashboard') || isApi

  // If device fingerprint changes while a session exists, force re-auth.
  if (isSensitive && sessionCookie && existingFp && existingFp !== fp) {
    if (isApi) {
      const res = NextResponse.json({ success: false, message: 'Session expired' }, { status: 401 })
      res.cookies.delete('session')
      return res
    }

    const url = req.nextUrl.clone()
    url.pathname = '/login'
    const res = NextResponse.redirect(url)
    res.cookies.delete('session')
    return res
  }

  const requestHeaders = new Headers(req.headers)
  if (ip) requestHeaders.set('x-qb-ip', ip)
  requestHeaders.set('x-qb-request-id', requestId)
  requestHeaders.set('x-qb-path', pathname)
  requestHeaders.set('x-qb-method', req.method)
  requestHeaders.set('x-qb-fp', existingFp || fp)

  const res = NextResponse.next({ request: { headers: requestHeaders } })

  // Set fingerprint cookie if missing
  if (!existingFp) {
    res.cookies.set(fpCookieName, fp, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
  }

  // Security headers
  res.headers.set('Content-Security-Policy', buildCsp())
  res.headers.set('Referrer-Policy', 'no-referrer')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  res.headers.set('Cross-Origin-Resource-Policy', 'same-origin')

  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
