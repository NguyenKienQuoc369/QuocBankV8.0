import { PrismaClient } from '@prisma/client'
import { attachSecurityPrismaMiddleware } from '@/lib/security/prismaMiddleware'

const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClient
	prismaSecurityMiddlewareAttached?: boolean
}

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (!globalForPrisma.prismaSecurityMiddlewareAttached) {
	attachSecurityPrismaMiddleware(prisma)
	globalForPrisma.prismaSecurityMiddlewareAttached = true
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma