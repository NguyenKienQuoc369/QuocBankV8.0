import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('⏳ Đang khởi tạo tài khoản Admin...')

  const employeeId = 'ADMIN-001'
  const rawPassword = 'QuocBank@2026' // Mật khẩu gốc chưa mã hóa

  // 1. Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(rawPassword, 10)

  // 2. Tạo tài khoản dựa trên khung Database HIỆN TẠI của anh
  const admin = await prisma.adminUser.upsert({
    where: { employeeId },
    update: {
      // Để trống, nếu có tài khoản rồi thì không ghi đè
    },
    create: {
      employeeId,
      passwordHash: hashedPassword,
      otpSecret: 'dummy-secret-code', // Cấu trúc cũ bắt buộc có cái này nên mình điền tạm 1 chuỗi
      // Đã gỡ bỏ 'role' để TypeScript không khóc nữa
    },
  })

  console.log('✅ KHỞI TẠO THÀNH CÔNG!')
  console.log('-----------------------------------')
  console.log(`👤 Employee ID : ${admin.employeeId}`)
  console.log(`🔑 Password    : ${rawPassword}`)
  console.log('-----------------------------------')
  console.log('Bây giờ anh có thể ra trình duyệt http://localhost:3000/admin/login để test nhé!')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })