'use server'

import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/auth'
import { generateAccountNumber, generateCardNumber, generateCVV } from '@/lib/utils'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function register(formData: FormData) {
  const fullName = formData.get('fullName') as string
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!fullName || !username || !password) return { error: "Thiếu thông tin" }

  // 1. Check user tồn tại
  const exist = await prisma.user.findUnique({ where: { username } })
  if (exist) return { error: "Tên đăng nhập đã tồn tại" }

  // 2. Hash mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. Tạo User + Account + Card
  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName,
          username,
          passwordHash: hashedPassword,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=00ff88&color=000`
        }
      })

      const account = await tx.account.create({
        data: {
          userId: user.id,
          accountNumber: generateAccountNumber(),
          balance: 50000 // Tặng 50k
        }
      })

      await tx.card.create({
        data: {
          accountId: account.id,
          cardNumber: generateCardNumber(),
          expiryDate: '12/30',
          cvv: generateCVV()
        }
      })
    })
  } catch (err) {
    return { error: "Lỗi hệ thống khi tạo tài khoản" }
  }

  return { success: true }
}

export async function login(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) return { error: "Tài khoản không tồn tại" }

  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) return { error: "Sai mật khẩu" }

  // Tạo Session
  const session = await encrypt({ id: user.id, name: user.fullName, username: user.username })
  
  cookies().set('session', session, { httpOnly: true, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
  
  return { success: true }
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) })
  redirect('/login')
}