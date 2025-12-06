'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

// Schema tạo sổ
const CreateSavingsSchema = z.object({
  amount: z.coerce.number().min(1000000, 'Tối thiểu 1.000.000đ để mở khoang năng lượng'),
  termInMonths: z.coerce.number().min(1, 'Kỳ hạn không hợp lệ'),
  name: z.string().min(3, 'Tên khoang không hợp lệ')
})

// 1. Lấy danh sách sổ tiết kiệm
export async function getMySavings() {
  const token = (await cookies()).get('session_token')?.value
  if (!token) return []
  const payload = await verifyToken(token)
  if (!payload) return []

  // Get all accounts for this user, then get their savings accounts
  const userAccounts = await prisma.account.findMany({
    where: { userId: payload.id as string },
    include: {
      savings: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  // Flatten all savings accounts from all user accounts
  return userAccounts.flatMap(account => account.savings)
}

// 2. Mở sổ mới (Nạp năng lượng)
export async function createSavings(prevState: any, formData: FormData) {
  try {
    const token = (await cookies()).get('session_token')?.value
    if (!token) return { success: false, message: 'Mất kết nối' }
    const payload = await verifyToken(token)
    
    // Validate
    const rawData = Object.fromEntries(formData.entries())
    const validated = CreateSavingsSchema.safeParse(rawData)
    
    if (!validated.success) return { success: false, message: validated.error.issues[0].message }
    
    const { amount, termInMonths, name } = validated.data
    
    // Lãi suất giả định (Vũ trụ thì lãi cao chút cho sướng)
    const interestRate = termInMonths === 1 ? 5.5 : termInMonths === 6 ? 6.8 : 7.5

    // TRANSACTION
    await prisma.$transaction(async (tx) => {
      // A. Trừ tiền tài khoản chính - Get first account for this user
      const mainAccount = await tx.account.findFirst({
        where: { userId: payload?.id as string }
      })
      
      if (!mainAccount || mainAccount.balance < amount) {
        throw new Error('Năng lượng khả dụng không đủ để nạp vào khoang!')
      }

      await tx.account.update({
        where: { id: mainAccount.id },
        data: { balance: { decrement: amount } }
      })

      // B. Tạo sổ tiết kiệm
      // Tính ngày đáo hạn
      const maturityDate = new Date()
      maturityDate.setMonth(maturityDate.getMonth() + termInMonths)

      await tx.savingsAccount.create({
        data: {
          accountId: mainAccount.id,
          amount: amount,
          term: termInMonths,
          interestRate: interestRate,
          maturityDate: maturityDate,
          isActive: true
        }
      })

      // C. Ghi log giao dịch
      await tx.transaction.create({
        data: {
          amount,
          description: `Kích hoạt khoang năng lượng: ${name}`,
          status: 'SUCCESS',
          type: 'SAVINGS_DEPOSIT',
          fromAccountId: mainAccount.id,
        }
      })
    })

    revalidatePath('/dashboard/savings')
    return { success: true, message: 'Khoang năng lượng đã được kích hoạt thành công!' }

  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Lỗi hệ thống' }
  }
}