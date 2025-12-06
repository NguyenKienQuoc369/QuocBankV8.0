'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

const TransferSchema = z.object({
  amount: z.coerce.number().min(10000, 'Số tiền tối thiểu 10.000đ'),
  toUsername: z.string().min(3, 'Tên người nhận không hợp lệ'),
  message: z.string().optional(),
})

export async function transferMoney(prevStateOrFormData?: FormData | unknown, formData?: FormData) {
  try {
    const token = (await cookies()).get('session_token')?.value
    if (!token) return { success: false, message: 'Mất kết nối với máy chủ!' }
    
    const payload = await verifyToken(token)
    if (!payload) return { success: false, message: 'Phiên đăng nhập hết hạn!' }
    const senderId = String(payload.id)

    const fd: FormData | undefined = (formData instanceof FormData)
      ? formData
      : (prevStateOrFormData instanceof FormData ? prevStateOrFormData : undefined)

    const rawData = Object.fromEntries((fd || new FormData()).entries())
    const validated = TransferSchema.safeParse(rawData)
    
    if (!validated.success) {
      return { success: false, message: validated.error.issues[0].message }
    }

    const { amount, toUsername, message } = validated.data

    await prisma.$transaction(async (tx) => {
      const senderAccount = await tx.account.findFirst({ where: { userId: senderId }, orderBy: { createdAt: 'asc' } })

      if (!senderAccount) throw new Error('Không tìm thấy tài khoản nguồn')
      if (senderAccount.balance < amount) throw new Error('Năng lượng (Số dư) không đủ để thực hiện cú nhảy này!')

      const receiverUser = await tx.user.findUnique({ where: { username: toUsername } })
      if (!receiverUser) throw new Error('Không tìm thấy tọa độ người nhận (Username sai)')
      if (receiverUser.id === senderId) throw new Error('Không thể tự chuyển năng lượng cho chính mình')

      const receiverAccount = await tx.account.findFirst({ where: { userId: receiverUser.id }, orderBy: { createdAt: 'asc' } })
      if (!receiverAccount) throw new Error('Người nhận chưa có tài khoản')

      await tx.account.update({ where: { id: senderAccount.id }, data: { balance: { decrement: amount } } })
      await tx.account.update({ where: { id: receiverAccount.id }, data: { balance: { increment: amount } } })

      await tx.transaction.create({
        data: {
          amount,
          description: message || 'Chuyển khoản liên ngân hà',
          status: 'SUCCESS',
          type: 'TRANSFER',
          fromAccountId: senderAccount.id,
          toAccountId: receiverAccount.id,
        }
      })
    })

    revalidatePath('/dashboard')
    return { success: true, message: 'Giao dịch thành công! Năng lượng đã được chuyển đi.' }

  } catch (error) {
    console.error('Transfer Error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, message: message || 'Lỗi hệ thống' }
  }
}
