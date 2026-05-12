import { headers, cookies } from 'next/headers'

export async function getRequestMeta() {
  const h = await headers()
  const c = await cookies()

  const ipAddress =
    h.get('x-qb-ip') ||
    h.get('cf-connecting-ip') ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    undefined

  const userAgent = h.get('user-agent') || undefined
  const fingerprint = c.get('__Host-qb_df')?.value || c.get('qb_df')?.value || undefined
  const requestId = h.get('x-qb-request-id') || h.get('x-request-id') || undefined
  const requestPath = h.get('x-qb-path') || undefined
  const requestMethod = h.get('x-qb-method') || undefined

  return { ipAddress, userAgent, fingerprint, requestId, requestPath, requestMethod }
}
