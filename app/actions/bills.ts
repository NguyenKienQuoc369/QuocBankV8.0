'use server'

import { prisma } from '@/lib/prisma'
import { PROVIDERS } from '@/lib/providers'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'



const PayBillSchema = z.object({
  providerId: z.string(),
  customerCode: z.string().min(5, 'Mã khách hàng không hợp lệ'),
  amount: z.coerce.number().min(10000, 'Số tiền thanh toán tối thiểu 10.000đ')
})

export async function payBill(prevStateOrFormData?: FormData | unknown, formData?: FormData) {
  try {
    const token = (await cookies()).get('session_token')?.value
    if (!token) return { success: false, message: 'Mất kết nối' }
    const payload = await verifyToken(token)

    const fd: FormData | undefined = (formData instanceof FormData)
      ? formData
      : (prevStateOrFormData instanceof FormData ? prevStateOrFormData : undefined)

    const rawData = Object.fromEntries((fd || new FormData()).entries())
    const validated = PayBillSchema.safeParse(rawData)
    
    if (!validated.success) return { success: false, message: 'Dữ liệu không hợp lệ' }
    
    const { providerId, customerCode, amount } = validated.data
    const provider = PROVIDERS.find(p => p.id === providerId)

    await prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({
        where: { userId: String(payload?.id) },
        orderBy: { createdAt: 'asc' }
      })

      if (!account || account.balance < amount) {
        throw new Error('Năng lượng không đủ để thanh toán dịch vụ này!')
      }

      await tx.account.update({ where: { id: account.id }, data: { balance: { decrement: amount } } })

      const transaction = await tx.transaction.create({
        data: {
          amount,
          description: `Thanh toán: ${provider?.name} - Mã KH: ${customerCode}`,
          status: 'SUCCESS',
          type: 'BILL_PAYMENT',
          fromAccountId: account.id,
        }
      })

      // Thêm cashback 0.5%
      const cashbackAmount = amount * 0.005
      await tx.account.update({
        where: { id: account.id },
        data: { cashbackBalance: { increment: cashbackAmount } }
      })

      await tx.cashbackHistory.create({
        data: {
          accountId: account.id,
          transactionId: transaction.id,
          amount: cashbackAmount,
          source: 'BILL_PAYMENT',
          status: 'PENDING',
        }
      })
    })

    revalidatePath('/dashboard')
    return { success: true, message: 'Dịch vụ đã được gia hạn thành công!' }

  } catch (error) {
    console.error('Pay bill error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, message: message || 'Lỗi hệ thống' }
  }
}
