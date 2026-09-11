import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword } from '@/lib/auth'
import { sendUserOTP } from '@/lib/mail'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const mode = String(body?.mode || 'login').trim()
    const username = String(body?.username || '').trim()
    const password = String(body?.password || '')
    const email = String(body?.email || '').trim()
    const phone = String(body?.phone || '').trim()
    const fullName = String(body?.fullName || '').trim()

    if (!username || !password) {
      return NextResponse.json({ ok: false, error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
    }

    if (mode !== 'login' && mode !== 'register') {
      return NextResponse.json({ ok: false, error: 'Yêu cầu không hợp lệ' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { username } })
    let userId: string
    let targetEmail = email

    if (mode === 'login') {
      if (!existing) {
        return NextResponse.json({ ok: false, error: 'Tài khoản không tồn tại' }, { status: 404 })
      }

      const ok = await verifyPassword(password, existing.password)
      if (!ok) {
        return NextResponse.json({ ok: false, error: 'Sai mật khẩu' }, { status: 401 })
      }

      userId = existing.id
      targetEmail = existing.email

      if (!targetEmail) {
        return NextResponse.json({ ok: false, error: 'Tài khoản chưa có email' }, { status: 400 })
      }

      if (email && email !== existing.email) {
        return NextResponse.json({ ok: false, error: 'Email không khớp tài khoản' }, { status: 400 })
      }
    } else {
      if (!email || !phone) {
        return NextResponse.json({ ok: false, error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
      }

      if (existing) {
        return NextResponse.json({ ok: false, error: 'Tài khoản đã tồn tại' }, { status: 409 })
      }

      const hashed = await hashPassword(password)
      const created = await prisma.user.create({
        data: {
          username,
          password: hashed,
          email,
          phone,
          fullName: fullName || username,
        } as any,
      })

      userId = created.id
      targetEmail = created.email
    }

    const otpCode = String(Math.floor(100000 + Math.random() * 900000))
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000)

    await prisma.user.update({
      where: { id: userId },
      data: { otpSecret: otpCode, otpExpires } as any,
    })

    await sendUserOTP(targetEmail, otpCode, fullName || username)

    return NextResponse.json({ ok: true, requiresOtp: true, email: targetEmail })
  } catch (error) {
    console.error('OTP start error:', error)
    return NextResponse.json({ ok: false, error: 'Không thể gửi OTP' }, { status: 500 })
  }
}
