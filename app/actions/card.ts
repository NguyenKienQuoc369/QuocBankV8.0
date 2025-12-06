'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

// 1. Lấy danh sách thẻ của User
export async function getMyCards() {
  const token = (await cookies()).get('session_token')?.value
  if (!token) return []
  
  const payload = await verifyToken(token)
  if (!payload) return []

  return await prisma.card.findMany({
    where: { 
      account: { userId: payload.id as string } 
    },
    include: { account: true }
  })
}

// 2. Hành động: Khóa / Mở khóa thẻ (Toggle Freeze)
export async function toggleCardLock(cardId: string, currentStatus: boolean) {
  try {
    const token = (await cookies()).get('session_token')?.value
    if (!token) return { success: false, message: 'Mất kết nối' }
    const payload = await verifyToken(token)
    
    // Kiểm tra quyền sở hữu thẻ (Security Check)
    const card = await prisma.card.findFirst({
      where: { 
        id: cardId,
        account: { userId: payload?.id as string }
      }
    })

    if (!card) return { success: false, message: 'Thẻ không tồn tại hoặc không chính chủ' }

    // Cập nhật trạng thái
    await prisma.card.update({
      where: { id: cardId },
      data: { isLocked: !currentStatus }
    })

    revalidatePath('/dashboard/cards')
    return { 
      success: true, 
      message: currentStatus ? 'Đã gỡ bỏ lá chắn, thẻ hoạt động!' : 'Đã kích hoạt lá chắn bảo vệ (Khóa thẻ)!' 
    }

  } catch (error) {
    return { success: false, message: 'Lỗi hệ thống máy chủ' }
  }
}
