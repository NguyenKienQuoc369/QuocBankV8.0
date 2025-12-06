import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// verifyToken có thể không chạy trên Edge runtime; nếu cần, chỉ kiểm tra cookie tồn tại
// import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value
  const { pathname } = request.nextUrl

  // Nếu đang ở trang Dashboard mà không có token -> chuyển về Login
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Nếu đã đăng nhập mà cố vào trang Login/Register -> chuyển về Dashboard
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
