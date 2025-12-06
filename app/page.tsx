// app/page.tsx
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function HomePage() {
  // Kiểm tra xem người dùng đã đăng nhập chưa
  const session = await getSession()

  if (session) {
    // Nếu rồi -> vào Dashboard
    redirect('/dashboard')
  } else {
    // Nếu chưa -> về trang Login
    redirect('/login')
  }
}