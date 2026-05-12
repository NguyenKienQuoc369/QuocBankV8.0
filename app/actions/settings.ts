'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getSession, hashPassword, verifyPassword } from '@/lib/auth'
import { z } from 'zod'
import { getRequestMeta } from '@/lib/security/request'
import { runWithSecurityContext } from '@/lib/security/context'

const ProfileSchema = z.object({
  fullName: z.string().min(2, 'Tên quá ngắn'),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'Mật khẩu mới phải > 6 ký tự').optional(),
})

export async function updateProfile(prevStateOrFormData?: FormData | unknown, formData?: FormData) {
  try {
    const payload = await getSession()
    if (!payload?.id) return { success: false, message: 'Unauthorized' }

    const meta = await getRequestMeta()
    
    const fd: FormData | undefined = (formData instanceof FormData)
      ? formData
      : (prevStateOrFormData instanceof FormData ? prevStateOrFormData : undefined)

    const rawData = Object.fromEntries((fd || new FormData()).entries())
    const validated = ProfileSchema.safeParse(rawData)
    
    if (!validated.success) return { success: false, message: 'Dữ liệu không hợp lệ' }

    const { fullName, currentPassword, newPassword } = validated.data
    const userId = String(payload.id)

    // 1. Cập nhật tên
    const updateData: Record<string, unknown> = { fullName }

    // 2. Nếu có đổi pass
    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) return { success: false, message: 'User không tồn tại' }

      const isValid = await verifyPassword(currentPassword, user.password)
      if (!isValid) return { success: false, message: 'Mật mã hiện tại không đúng' }

      updateData.password = await hashPassword(newPassword)
    }

    await runWithSecurityContext(
      {
        userId,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        fingerprint: meta.fingerprint,
        requestId: meta.requestId,
        requestPath: meta.requestPath,
        requestMethod: meta.requestMethod,
      },
      async () => {
        await prisma.user.update({
          where: { id: userId },
          data: updateData,
        })
      }
    )

    revalidatePath('/dashboard/settings')
    return { success: true, message: 'Đã cập nhật cấu hình hệ thống!' }

  } catch (error) {
    console.error('Update profile error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, message: message || 'Lỗi máy chủ' }
  }
}