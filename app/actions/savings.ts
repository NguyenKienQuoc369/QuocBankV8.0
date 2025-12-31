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

// 3. Rút sổ tiết kiệm (trước hạn hoặc đáo hạn)
export async function withdrawSavings(savingsId: string) {
  try {
    const token = (await cookies()).get('session_token')?.value
    if (!token) return { success: false, message: 'Mất kết nối' }
    const payload = await verifyToken(token)
    if (!payload?.id) return { success: false, message: 'Không xác thực được' }

    const savings = await prisma.savingsAccount.findUnique({
      where: { id: savingsId },
      include: { account: true }
    })

    if (!savings) {
      return { success: false, message: 'Sổ tiết kiệm không tồn tại' }
    }

    if (savings.account.userId !== payload.id) {
      return { success: false, message: 'Không có quyền rút sổ này' }
    }

    if (!savings.isActive) {
      return { success: false, message: 'Sổ tiết kiệm đã được rút rồi' }
    }

    // Tính tiền lãi
    const now = new Date()
    const isMatured = savings.maturityDate && now >= savings.maturityDate
    
    let interestAmount = 0
    if (isMatured) {
      // Lãi đầy đủ
      interestAmount = (savings.amount * savings.interestRate) / 100
    } else {
      // Rút trước hạn: tính lãi từng tháng (giảm 50%)
      const monthsElapsed = savings.maturityDate
        ? Math.floor(
            (now.getTime() - savings.createdAt.getTime()) /
              (1000 * 60 * 60 * 24 * 30)
          )
        : 0
      interestAmount = ((savings.amount * savings.interestRate * monthsElapsed) / (12 * 100)) * 0.5
    }

    const totalAmount = savings.amount + interestAmount

    await prisma.$transaction(async (tx) => {
      // Thêm tiền vào tài khoản chính
      await tx.account.update({
        where: { id: savings.accountId },
        data: {
          balance: { increment: totalAmount }
        }
      })

      // Đánh dấu sổ tiết kiệm đã rút
      await tx.savingsAccount.update({
        where: { id: savingsId },
        data: { isActive: false }
      })

      // Tạo giao dịch
      await tx.transaction.create({
        data: {
          amount: totalAmount,
          description: `Rút sổ tiết kiệm (Gốc: ${savings.amount.toLocaleString('vi-VN')} đ, Lãi: ${Math.round(interestAmount).toLocaleString('vi-VN')} đ${
            isMatured ? ', Đáo hạn' : ', Rút trước hạn'
          })`,
          status: 'SUCCESS',
          type: 'WITHDRAW',
          toAccountId: savings.accountId
        }
      })
    })

    revalidatePath('/dashboard/savings')
    return {
      success: true,
      message: `Rút sổ tiết kiệm thành công! Nhận ${totalAmount.toLocaleString('vi-VN')} đ`
    }
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Lỗi hệ thống' }
  }
}

// 4. Mở tài khoản ống heo
export async function createPiggyBank(name: string, targetAmount: number, icon: string = 'pig', color: string = 'pink') {
  try {
    const token = (await cookies()).get('session_token')?.value
    if (!token) return { success: false, message: 'Mất kết nối' }
    const payload = await verifyToken(token)
    if (!payload?.id) return { success: false, message: 'Không xác thực được' }

    if (!name || name.trim().length === 0) {
      return { success: false, message: 'Vui lòng nhập tên hũ' }
    }

    if (targetAmount <= 0) {
      return { success: false, message: 'Mục tiêu tiết kiệm phải lớn hơn 0' }
    }

    // Get first account for this user
    const account = await prisma.account.findFirst({
      where: { userId: payload.id as string }
    })

    if (!account) {
      return { success: false, message: 'Tài khoản không tồn tại' }
    }

    const piggy = await prisma.piggyBank.create({
      data: {
        accountId: account.id,
        name: name.trim(),
        targetAmount,
        icon,
        color
      }
    })

    revalidatePath('/dashboard/savings')
    return {
      success: true,
      message: `Mở ống heo "${name}" thành công!`
    }
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Lỗi hệ thống' }
  }
}

// 5. Lấy danh sách ống heo
export async function getPiggyBanks() {
  try {
    const token = (await cookies()).get('session_token')?.value
    if (!token) return []
    const payload = await verifyToken(token)
    if (!payload?.id) return []

    const userAccounts = await prisma.account.findMany({
      where: { userId: payload.id as string },
      include: {
        piggyBanks: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    return userAccounts.flatMap(account => account.piggyBanks)
  } catch {
    return []
  }
}

// 6. Thêm tiền vào ống heo
export async function addToPiggyBank(piggyBankId: string, amount: number) {
  try {
    const token = (await cookies()).get('session_token')?.value
    if (!token) return { success: false, message: 'Mất kết nối' }
    const payload = await verifyToken(token)
    if (!payload?.id) return { success: false, message: 'Không xác thực được' }

    if (amount <= 0) {
      return { success: false, message: 'Số tiền không hợp lệ' }
    }

    const piggy = await prisma.piggyBank.findUnique({
      where: { id: piggyBankId },
      include: { account: true }
    })

    if (!piggy) {
      return { success: false, message: 'Hũ tiết kiệm không tồn tại' }
    }

    if (piggy.account.userId !== payload.id) {
      return { success: false, message: 'Không có quyền thao tác hũ này' }
    }

    if (piggy.account.balance < amount) {
      return { success: false, message: 'Số dư không đủ' }
    }

    await prisma.$transaction(async (tx) => {
      // Cập nhật hũ tiết kiệm
      await tx.piggyBank.update({
        where: { id: piggyBankId },
        data: {
          currentAmount: { increment: amount }
        }
      })

      // Trừ tiền từ tài khoản chính
      await tx.account.update({
        where: { id: piggy.accountId },
        data: {
          balance: { decrement: amount }
        }
      })

      // Tạo giao dịch
      await tx.transaction.create({
        data: {
          amount,
          description: `Tiết kiệm vào hũ "${piggy.name}"`,
          status: 'SUCCESS',
          type: 'TRANSFER',
          fromAccountId: piggy.accountId
        }
      })
    })

    revalidatePath('/dashboard/savings')
    return {
      success: true,
      message: `Thêm ${amount.toLocaleString('vi-VN')} đ vào hũ "${piggy.name}"!`
    }
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Lỗi hệ thống' }
  }
}

// 7. Rút tiền từ ống heo
export async function withdrawFromPiggyBank(piggyBankId: string, amount?: number) {
  try {
    const token = (await cookies()).get('session_token')?.value
    if (!token) return { success: false, message: 'Mất kết nối' }
    const payload = await verifyToken(token)
    if (!payload?.id) return { success: false, message: 'Không xác thực được' }

    const piggy = await prisma.piggyBank.findUnique({
      where: { id: piggyBankId },
      include: { account: true }
    })

    if (!piggy) {
      return { success: false, message: 'Hũ tiết kiệm không tồn tại' }
    }

    if (piggy.account.userId !== payload.id) {
      return { success: false, message: 'Không có quyền thao tác hũ này' }
    }

    // Rút toàn bộ nếu không chỉ định số tiền
    const withdrawAmount = amount || piggy.currentAmount

    if (withdrawAmount <= 0 || withdrawAmount > piggy.currentAmount) {
      return { success: false, message: 'Số tiền rút không hợp lệ' }
    }

    await prisma.$transaction(async (tx) => {
      // Cập nhật hũ tiết kiệm
      await tx.piggyBank.update({
        where: { id: piggyBankId },
        data: {
          currentAmount: { decrement: withdrawAmount },
          isActive: piggy.currentAmount - withdrawAmount > 0
        }
      })

      // Thêm tiền vào tài khoản chính
      await tx.account.update({
        where: { id: piggy.accountId },
        data: {
          balance: { increment: withdrawAmount }
        }
      })

      // Tạo giao dịch
      await tx.transaction.create({
        data: {
          amount: withdrawAmount,
          description: `Rút từ hũ "${piggy.name}"`,
          status: 'SUCCESS',
          type: 'WITHDRAW',
          toAccountId: piggy.accountId
        }
      })
    })

    revalidatePath('/dashboard/savings')
    return {
      success: true,
      message: `Rút ${withdrawAmount.toLocaleString('vi-VN')} đ từ hũ "${piggy.name}"!`
    }
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Lỗi hệ thống' }
  }
}
