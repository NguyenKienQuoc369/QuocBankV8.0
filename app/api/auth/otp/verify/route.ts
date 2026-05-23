import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createToken, setSessionCookie } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const username = String(body?.username || '').trim()
    const otpCode = String(body?.otpCode || '').trim()

    if (!username || !otpCode) {
      return NextResponse.json({ ok: false, error: 'Thiếu thông tin xác thực' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user || !user.otpSecret || !user.otpExpires) {
      return NextResponse.json({ ok: false, error: 'OTP không hợp lệ' }, { status: 400 })
    }

    if (user.otpSecret !== otpCode || user.otpExpires.getTime() < Date.now()) {
      return NextResponse.json({ ok: false, error: 'OTP sai hoặc đã hết hạn' }, { status: 401 })
    }

    const token = await createToken({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
    })

    await setSessionCookie(token)

    await prisma.user.update({
      where: { id: user.id },
      data: { otpSecret: null, otpExpires: null },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('OTP verify error:', error)
    return NextResponse.json({ ok: false, error: 'Xác thực thất bại' }, { status: 500 })
  }
}
