'use server'

import { prisma } from '@/lib/prisma'
import { isAdminUsername } from '@/lib/security/admin'
import { getRequestMeta } from '@/lib/security/request'
import { rateLimit } from '@/lib/security/rateLimit'
import { writeSecurityLog } from '@/lib/security/log'
import { clearSessionCookie, createToken, setSessionCookie, verifyPassword } from '@/lib/auth'
import { redirect } from 'next/navigation'

type AdminLoginState =
  | { ok: true }
  | { ok: false; error: string }

const initialError = 'Sai tên đăng nhập hoặc mật khẩu'

export async function adminLogin(_prevState: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const username = String(formData.get('username') || '').trim()
  const password = String(formData.get('password') || '')

  if (!username || !password) return { ok: false, error: 'Vui lòng nhập đầy đủ thông tin' }

  const meta = await getRequestMeta()
  const ip = meta.ipAddress || 'unknown'

  const rl = rateLimit(`sa:admin_login:${ip}`, 5, 10 * 60_000)
  if (!rl.ok) {
    await writeSecurityLog({
      action: 'admin.auth.rate_limited',
      severity: 'CRITICAL',
      status: 'BLOCK',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      fingerprint: meta.fingerprint,
      requestId: meta.requestId,
      metadata: { username },
    }).catch(() => {})

    return { ok: false, error: 'Too many attempts. Try again later.' }
  }

  if (!isAdminUsername(username)) {
    await writeSecurityLog({
      action: 'admin.auth.not_allowed',
      severity: 'CRITICAL',
      status: 'BLOCK',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      fingerprint: meta.fingerprint,
      requestId: meta.requestId,
      metadata: { username },
    }).catch(() => {})

    return { ok: false, error: initialError }
  }

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user || !(await verifyPassword(password, user.password))) {
    await writeSecurityLog({
      action: 'admin.auth.fail',
      severity: 'CRITICAL',
      status: 'FAIL',
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      fingerprint: meta.fingerprint,
      requestId: meta.requestId,
      metadata: { username },
    }).catch(() => {})

    return { ok: false, error: initialError }
  }

  const token = await createToken({ id: user.id, username: user.username, fullName: user.fullName })
  await setSessionCookie(token)

  await writeSecurityLog({
    action: 'admin.auth.success',
    severity: 'HIGH',
    status: 'SUCCESS',
    userId: user.id,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    fingerprint: meta.fingerprint,
    requestId: meta.requestId,
  }).catch(() => {})

  return { ok: true }
}

export async function adminLogout() {
  await clearSessionCookie()
  redirect('/admin/login')
}
