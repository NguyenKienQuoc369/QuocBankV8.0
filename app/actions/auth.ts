// File: app/actions/auth.ts
'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { hashPassword, createToken, setSessionCookie, verifyPassword, clearSessionCookie } from '@/lib/auth'
import { generateAccountNumber, generateCardNumber, generateCVV } from '@/lib/utils'
import { redirect } from 'next/navigation'

// --- 1. CẬP NHẬT VALIDATION SCHEMA ---
const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').trim(),
  username: z.string().min(4, 'Tên đăng nhập tối thiểu 4 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập không được chứa ký tự đặc biệt'),
  // CẬP NHẬT: Mật khẩu tối thiểu 8 ký tự theo yêu cầu
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'), 
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

// --- 2. SỬA LẠI HÀM REGISTER ĐỂ TƯƠNG THÍCH useActionState ---
export async function register(prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    
    // Validate dữ liệu
    const validated = RegisterSchema.safeParse(rawData);
    
    if (!validated.success) {
      return { 
        success: false, 
        error: validated.error.issues[0].message 
      };
    }

    const { username, password, fullName } = validated.data;

    // Kiểm tra tên đăng nhập đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return { success: false, error: 'Tên đăng nhập này đã được sử dụng' };
    }

    const hashedPassword = await hashPassword(password);

    // Tạo User + Tài khoản + Thẻ trong 1 giao dịch (Transaction)
    await prisma.$transaction(async (tx) => {
      // Tạo User
      const user = await tx.user.create({
        data: {
          username,
          password: hashedPassword,
          fullName,
        }
      });

      // Tạo Tài khoản thanh toán (Tặng 50k chào mừng)
      const account = await tx.account.create({
        data: {
          userId: user.id,
          accountNumber: generateAccountNumber(),
          balance: 50000, 
          isLocked: false 
        }
      });

      // Tạo Thẻ ATM ảo
      await tx.card.create({
        data: {
          accountId: account.id,
          cardNumber: generateCardNumber(),
          expiryDate: '12/30',
          cvv: generateCVV(),
          type: 'PLATINUM',
          isLocked: false
        }
      });
    });
    
    return { success: true };

  } catch (error: any) {
    console.error('Register error:', error);
    return { success: false, error: 'Lỗi hệ thống: ' + error.message };
  }
}

// --- 3. SỬA LẠI HÀM LOGIN TƯƠNG TỰ ---
export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { success: false, error: 'Vui lòng nhập đầy đủ thông tin' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await verifyPassword(password, user.password))) {
      return { success: false, error: 'Sai tên đăng nhập hoặc mật khẩu' };
    }

    // Tạo phiên đăng nhập
    const token = await createToken({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
    });
    
    await setSessionCookie(token);
    
    // Không redirect ở đây để Client Component xử lý (tránh lỗi NEXT_REDIRECT)
    return { success: true }; 

  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: 'Đăng nhập thất bại' };
  }
}

// --- LOGOUT ---
export async function logout() {
  await clearSessionCookie();
  redirect('/login');
}