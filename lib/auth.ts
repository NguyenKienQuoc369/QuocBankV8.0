// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// Lấy secret key từ biến môi trường
const secretKey = process.env.JWT_SECRET || 'quocbank-secret-key'
const key = new TextEncoder().encode(secretKey)

// 1. Mã hóa mật khẩu
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

// 2. Kiểm tra mật khẩu
export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}

// 3. Tạo Token/Session
export async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

// Giữ alias encrypt để tương thích
export const encrypt = createToken

// 4. Giải mã Token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
    return payload
  } catch (error) {
    return null
  }
}

// Giữ alias decrypt để tương thích
export const decrypt = verifyToken

// 5. Lưu Cookie (CÓ SỬA ĐỔI: Thêm await cookies())
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies() // <--- THÊM AWAIT Ở ĐÂY
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 ngày
    path: '/',
  })
}

// 6. Xóa Cookie (CÓ SỬA ĐỔI: Thêm await cookies())
export async function clearSessionCookie() {
  const cookieStore = await cookies() // <--- THÊM AWAIT Ở ĐÂY
  cookieStore.delete('session')
}

// 7. Lấy thông tin session (CÓ SỬA ĐỔI: Thêm await cookies())
export async function getSession() {
  const cookieStore = await cookies() // <--- THÊM AWAIT Ở ĐÂY
  const token = cookieStore.get('session')?.value
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload) return null

  // Security: ensure the user still exists in the database.
  // This prevents a valid JWT from granting access after the user record
  // has been removed or disabled.
  try {
    const userId = (payload as any).id
    if (!userId) return null
    const user = await prisma.user.findUnique({ where: { id: String(userId) } })
    if (!user) return null
  } catch (err) {
    // If DB check fails for any reason, treat as no session to be safe
    return null
  }

  return payload
}