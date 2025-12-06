'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

// Mock danh sách nhà cung cấp (Vì mình chưa seed DB)
export const PROVIDERS = [
  { id: 'evn', name: 'Năng Lượng Lõi (Điện lực)', code: 'EVN', category: 'ELECTRIC', icon: 'Zap' },
  { id: 'wtr', name: 'Hệ Thống Thủy Canh (Nước)', code: 'WATER_CO', category: 'WATER', icon: 'Droplets' },
  { id: 'vtl', name: 'Vệ Tinh Viettel (Internet)', code: 'VIETTEL', category: 'INTERNET', icon: 'Wifi' },
  { id: 'fpt', name: 'Vệ Tinh FPT (Internet)', code: 'FPT', category: 'INTERNET', icon: 'Satellite' },
]

const PayBillSchema = z.object({
  providerId: z.string(),
  customerCode: z.string().min(5, 'Mã khách hàng không hợp lệ'),
  amount: z.coerce.number().min(10000, 'Số tiền thanh toán tối thiểu 10.000đ')
})

export async function payBill(prevState: any, formData: FormData) {
  try {
    const token = (await cookies()).get('session_token')?.value
    if (!token) return { success: false, message: 'Mất kết nối' }
    const payload = await verifyToken(token)

    const rawData = Object.fromEntries(formData.entries())
    const validated = PayBillSchema.safeParse(rawData)
    
    if (!validated.success) return { success: false, message: 'Dữ liệu không hợp lệ' }
    
    const { providerId, customerCode, amount } = validated.data
    const provider = PROVIDERS.find(p => p.id === providerId)

    // TRANSACTION
    await prisma.$transaction(async (tx) => {
      // 1. Check số dư
      const account = await tx.account.findFirst({
        where: { userId: payload?.id as string, isDefault: true }
      })

      if (!account || account.balance < amount) {
        throw new Error('Năng lượng không đủ để thanh toán dịch vụ này!')
      }

      // 2. Trừ tiền
      await tx.account.update({
        where: { id: account.id },
        data: { balance: { decrement: amount } }
      })

      // 3. Ghi log
      await tx.transaction.create({
        data: {
          amount,
          description: `Thanh toán: ${provider?.name} - Mã KH: ${customerCode}`,
          status: 'SUCCESS',
          type: 'BILL_PAYMENT', // Nhớ update enum TransactionType trong schema nếu chưa có
          fromAccountId: account.id,
        }
      })
    })

    revalidatePath('/dashboard')
    return { success: true, message: 'Dịch vụ đã được gia hạn thành công!' }

  } catch (error: any) {
    return { success: false, message: error.message || 'Lỗi hệ thống' }
  }
}
