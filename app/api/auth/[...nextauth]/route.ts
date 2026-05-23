import NextAuth from 'next-auth'
import { adminAuthOptions } from '@/lib/auth/admin-options'

const handler = NextAuth(adminAuthOptions)

export { handler as GET, handler as POST }
