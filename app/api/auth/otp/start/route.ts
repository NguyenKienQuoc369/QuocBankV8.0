import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword } from '@/lib/auth'
import { sendUserOTP } from '@/lib/mail'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const username = String(body?.username || '').trim()
    const password = String(body?.password || '')
    const email = String(body?.email || '').trim()
    const phone = String(body?.phone || '').trim()
    const fullName = String(body?.fullName || '').trim()

    if (!username || !password || !email || !phone) {
      return NextResponse.json({ ok: false, error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { username } })

    if (existing) {
      const ok = await verifyPassword(password, existing.password)
      if (!ok) {
        return NextResponse.json({ ok: false, error: 'Sai mật khẩu' }, { status: 401 })
      }

      await prisma.user.update({
        where: { id: existing.id },
        data: { email, phone, fullName: fullName || existing.fullName } as any,
      })
    } else {
      const hashed = await hashPassword(password)
      await prisma.user.create({
        data: {
          username,
          password: hashed,
          email,
          phone,
          fullName: fullName || username,
        } as any,
      })
    }

    const otpCode = String(Math.floor(100000 + Math.random() * 900000))
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000)

    await prisma.user.update({
      where: { username },
      data: { otpSecret: otpCode, otpExpires } as any,
    })

    await sendUserOTP(email, otpCode, fullName || username)

    return NextResponse.json({ ok: true, requiresOtp: true, email })
  } catch (error) {
    console.error('OTP start error:', error)
    return NextResponse.json({ ok: false, error: 'Không thể gửi OTP' }, { status: 500 })
  }
}
