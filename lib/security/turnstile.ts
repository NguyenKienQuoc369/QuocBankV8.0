type TurnstileResult = {
  success: boolean
  error?: string
}

export async function verifyTurnstile(token: string | null | undefined, ip?: string | null) : Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    if (process.env.NODE_ENV !== 'production') return { success: true }
    return { success: false, error: 'Turnstile secret not configured' }
  }

  if (!token) return { success: false, error: 'Missing Turnstile token' }

  const form = new URLSearchParams()
  form.set('secret', secret)
  form.set('response', token)
  if (ip) form.set('remoteip', ip)

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  })

  const data = (await res.json()) as { success: boolean }
  return { success: !!data?.success }
}
