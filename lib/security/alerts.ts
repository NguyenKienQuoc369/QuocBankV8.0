import { Resend } from 'resend'

function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

export async function sendSecurityAlertEmail(opts: {
  subject: string
  html: string
  to?: string
}) {
  const resend = getResendClient()
  const to = opts.to || process.env.SECURITY_ALERT_EMAIL_TO
  const from = process.env.SECURITY_ALERT_EMAIL_FROM

  if (!resend || !to || !from) return { ok: false as const, skipped: true as const }

  await resend.emails.send({
    from,
    to,
    subject: opts.subject,
    html: opts.html,
  })

  return { ok: true as const }
}
