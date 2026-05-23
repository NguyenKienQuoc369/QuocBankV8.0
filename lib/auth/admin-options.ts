import type { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { checkAdminPassword } from '@/lib/security/admin-auth'
import { verifyTurnstile } from '@/lib/security/turnstile'
import { logAdminSecurityEvent } from '@/lib/security/admin-log'
import * as otplib from 'otplib'

export const adminAuthOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      id: 'admin-credentials',
      name: 'Admin Credentials',
      credentials: {
        employeeId: { label: 'Employee ID', type: 'text' },
        password: { label: 'Password', type: 'password' },
        otp: { label: 'OTP', type: 'text' },
        turnstileToken: { label: 'Turnstile', type: 'text' },
      },
      async authorize(credentials: Record<string, string> | undefined, req: { headers?: Record<string, string | string[]> }) {
        const employeeId = String(credentials?.employeeId || '').trim()
        const password = String(credentials?.password || '')
        const otp = String(credentials?.otp || '')
        const turnstileToken = String(credentials?.turnstileToken || '')

        if (!employeeId || !password || !otp) return null

        const ip = req?.headers?.['x-forwarded-for']?.toString().split(',')[0]?.trim()
        const ua = req?.headers?.['user-agent']?.toString()

        const captcha = await verifyTurnstile(turnstileToken, ip)
        if (!captcha.success) return null

        const pwdCheck = await checkAdminPassword({ employeeId, password, ipAddress: ip, userAgent: ua })
        if (!pwdCheck.ok) return null

        const admin = await prisma.adminUser.findUnique({ where: { employeeId } })
        if (!admin || admin.isLocked) return null

        const otpOk = otplib.verify({ token: otp, secret: admin.otpSecret, window: 1 } as any)
        if (!otpOk) {
          await logAdminSecurityEvent({
            employeeId,
            action: 'ADMIN_LOGIN_FAILED_2FA',
            severity: 'HIGH',
            status: 'FAIL',
            ipAddress: ip,
            userAgent: ua,
          }).catch(() => {})
          return null
        }

        await logAdminSecurityEvent({
          employeeId,
          action: 'ADMIN_LOGIN_SUCCESS',
          severity: 'INFO',
          status: 'SUCCESS',
          ipAddress: ip,
          userAgent: ua,
        }).catch(() => {})

        return { id: admin.id, name: employeeId, email: null, employeeId }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60,
    updateAge: 0,
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      const now = Date.now()
      const lastActivity = typeof (token as any).lastActivity === 'number' ? (token as any).lastActivity : undefined

      if (lastActivity && now - lastActivity > 15 * 60 * 1000) {
        return { ...token, idleExpired: true } as any
      }

      if (user) {
        ;(token as any).employeeId = (user as any).employeeId
      }

      ;(token as any).lastActivity = now
      return token as any
    },
    async session({ session, token }) {
      if ((token as any).idleExpired) return null as any
      return {
        ...session,
        user: {
          ...session.user,
          employeeId: (token as any).employeeId,
        },
      } as any
    },
  },
}
