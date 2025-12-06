'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { hashPassword, createToken, setSessionCookie, verifyPassword, clearSessionCookie } from '@/lib/auth'
import { generateAccountNumber, generateCardNumber, generateCVV } from '@/lib/utils'
import { redirect } from 'next/navigation'

// --- VALIDATION SCHEMAS (Luật lệ dữ liệu) ---
const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').trim(),
  username: z.string().min(4, 'Tên đăng nhập tối thiểu 4 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập không được chứa ký tự đặc biệt'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

// --- REGISTER ACTION ---
export async function register(prevStateOrFormData?: FormData | unknown, formData?: FormData) {
  try {
    const fd: FormData | undefined = (formData instanceof FormData)
      ? formData
      : (prevStateOrFormData instanceof FormData ? prevStateOrFormData : undefined)

    const rawData = Object.fromEntries((fd || new FormData()).entries());
    
    // 1. Validate dữ liệu đầu vào
    const validated = RegisterSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
        message: 'Dữ liệu không hợp lệ',
        error: 'Dữ liệu không hợp lệ'
      };
    }

    const { username, password, fullName } = validated.data;

    // 2. Kiểm tra trùng lặp
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return { success: false, message: 'Tên đăng nhập này đã tồn tại', error: 'Tên đăng nhập này đã tồn tại' };
    }

    const hashedPassword = await hashPassword(password);

    // 3. Thực thi Giao dịch (Transaction)
    await prisma.$transaction(async (tx) => {
      // A. Tạo User
      const user = await tx.user.create({
        data: { username, password: hashedPassword, fullName }
      });

      // B. Tạo Tài khoản
      const account = await tx.account.create({
        data: {
          userId: user.id,
          accountNumber: generateAccountNumber(),
          balance: 0,
          isLocked: false,
          // isDefault removed: not present in Prisma schema
        }
      });

      // C. Tạo Thẻ
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

      // D. Thưởng chào mừng 50k
      const WELCOME_AMOUNT = 50000;
      await tx.transaction.create({
        data: {
          amount: WELCOME_AMOUNT,
          description: 'Thưởng chào mừng thành viên mới',
          status: 'SUCCESS', // Enum Prisma của anh có thể là COMPLETED hoặc SUCCESS, hãy check lại schema
          type: 'DEPOSIT',
          toAccountId: account.id,
        }
      });

      // E. Cộng tiền vào tài khoản
      await tx.account.update({
        where: { id: account.id },
        data: { balance: { increment: WELCOME_AMOUNT } }
      });
    });
    
    return { success: true, message: 'Đăng ký thành công! Đã cộng 50.000đ.' };

  } catch (error) {
    console.error('Register error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message: 'Lỗi hệ thống: ' + message, error: message };
  }
}

// --- LOGIN ACTION ---
export async function login(prevStateOrFormData?: FormData | unknown, formData?: FormData) {
  // Support two call styles:
  //  - useActionState(login, null) => called with (prevState, formData)
  //  - direct call login(formData) => called with (formData)
  const fd: FormData | undefined = (formData instanceof FormData)
    ? formData
    : (prevStateOrFormData instanceof FormData ? prevStateOrFormData : undefined)

  const username = fd?.get('username') as string | undefined;
  const password = fd?.get('password') as string | undefined;

  if (!username || !password) return { success: false, message: 'Vui lòng nhập đầy đủ thông tin', error: 'Vui lòng nhập đầy đủ thông tin' };

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await verifyPassword(password, user.password))) {
      return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu', error: 'Sai tên đăng nhập hoặc mật khẩu' };
    }

    // Tạo Session
    const token = await createToken({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
    });
    
    await setSessionCookie(token);
    
    // Xóa cache để Dashboard cập nhật data mới nhất
    revalidatePath('/dashboard'); 
    
    return { success: true, message: 'Đăng nhập thành công' };

  } catch (error) {
    console.error('Login error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message: 'Lỗi đăng nhập hệ thống', error: message };
  }
}

// --- LOGOUT ACTION ---
export async function logout() {
  await clearSessionCookie();
  redirect('/login');
}