'use server'

import { prisma } from '@/lib/prisma' // Đảm bảo anh đã có file lib/prisma.ts (nếu chưa có bảo em)
import { hashPassword, createToken, setSessionCookie, verifyPassword, clearSessionCookie } from '@/lib/auth' // File lib/auth.ts cũ của anh
import { generateAccountNumber, generateCardNumber, generateCVV } from '@/lib/utils'
import { redirect } from 'next/navigation'

// --- ĐĂNG KÝ ---
export async function register(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  if (!username || !password || !fullName) {
    return { error: 'Vui lòng điền đầy đủ thông tin' }
  }

  try {
    // 1. Kiểm tra user tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return { error: 'Tên đăng nhập này đã có người dùng' }
    }

    const hashedPassword = await hashPassword(password)

    // 2. Tạo User + Tài khoản + Thẻ trong 1 giao dịch (Transaction)
    await prisma.$transaction(async (tx) => {
      // Tạo User
      const user = await tx.user.create({
        data: {
          username,
          passwordHash: hashedPassword, // Lưu ý: Schema lúc nãy em đặt là passwordHash
          fullName,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=00ff88&color=000`,
        }
      })

      // Tạo Tài khoản thanh toán (Tặng 50k chào mừng)
      const account = await tx.account.create({
        data: {
          userId: user.id,
          accountNumber: generateAccountNumber(), // Hàm này trong utils
          balance: 50000, 
          type: 'PAYMENT',
          status: 'ACTIVE'
        }
      })

      // Tạo Thẻ ATM ảo
      await tx.card.create({
        data: {
          accountId: account.id,
          cardNumber: generateCardNumber(), // Hàm này trong utils
          expiryDate: '12/30',
          cvv: generateCVV(),
          type: 'DEBIT',
          status: 'ACTIVE'
        }
      })
    })
    
    return { success: true }
  } catch (error: any) {
    console.error('Register error:', error)
    return { error: 'Lỗi hệ thống: ' + error.message }
  }
}

// --- ĐĂNG NHẬP ---
export async function login(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) return { error: 'Thiếu thông tin đăng nhập' }

  try {
    const user = await prisma.user.findUnique({ where: { username } })

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return { error: 'Sai tên đăng nhập hoặc mật khẩu' }
    }

    // Tạo phiên đăng nhập
    const token = await createToken({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl
    })
    
    await setSessionCookie(token)
    return { success: true }
  } catch (error) {
    return { error: 'Lỗi đăng nhập' }
  }
}

// --- ĐĂNG XUẤT ---
export async function logout() {
  await clearSessionCookie()
  redirect('/login')
}