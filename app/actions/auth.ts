// File: app/actions/auth.ts
'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { hashPassword, createToken, setSessionCookie, verifyPassword, clearSessionCookie } from '@/lib/auth'
import { generateAccountNumber, generateCardNumber, generateCVV } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { getRequestMeta } from '@/lib/security/request'
import { runWithSecurityContext } from '@/lib/security/context'
import { writeSecurityLog } from '@/lib/security/log'
import { rateLimit } from '@/lib/security/rateLimit'
import { sendSecurityAlertEmail } from '@/lib/security/alerts'

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

    const meta = await getRequestMeta()

    // Tạo User + Tài khoản + Thẻ trong 1 giao dịch (Transaction)
    await runWithSecurityContext(
      {
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        fingerprint: meta.fingerprint,
        requestId: meta.requestId,
        requestPath: meta.requestPath,
        requestMethod: meta.requestMethod,
      },
      async () => {
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

        await writeSecurityLog({
          action: 'auth.register.success',
          severity: 'MEDIUM',
          status: 'SUCCESS',
          userId: undefined,
          metadata: { username },
        }).catch(() => {})
      }
    );
    
    return { success: true };

  } catch (error: any) {
    console.error('Register error:', error);
    return { success: false, error: 'Lỗi hệ thống' };
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
    const meta = await getRequestMeta()
    const ip = meta.ipAddress || 'unknown'

    const rl = rateLimit(`sa:login:${ip}`, 10, 10 * 60_000)
    if (!rl.ok) {
      await writeSecurityLog({
        action: 'auth.login.rate_limited',
        severity: 'HIGH',
        status: 'BLOCK',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        fingerprint: meta.fingerprint,
        requestId: meta.requestId,
        metadata: { username },
      }).catch(() => {})

      return { success: false, error: 'Too many attempts. Try again later.' }
    }

    const user = await prisma.user.findUnique({ 
      where: { username }
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      await writeSecurityLog({
        action: 'auth.login.fail',
        severity: 'HIGH',
        status: 'FAIL',
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        fingerprint: meta.fingerprint,
        requestId: meta.requestId,
        metadata: { username },
      }).catch(() => {})

      return { success: false, error: 'Sai tên đăng nhập hoặc mật khẩu' };
    }

    // Lấy thông tin tài khoản của user
    const account = await prisma.account.findFirst({
      where: { userId: user.id }
    });

    // Kiểm tra xem user có PIN hay không - sử dụng raw query
    let hasPin = false;
    if (account) {
      const accountWithPin = await prisma.account.findUnique({
        where: { id: account.id }
      }) as any;
      hasPin = !!accountWithPin?.pin;
    }

    if (hasPin && account) {
      await writeSecurityLog({
        action: 'auth.login.pin_required',
        severity: 'MEDIUM',
        status: 'INFO',
        userId: user.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        fingerprint: meta.fingerprint,
        requestId: meta.requestId,
      }).catch(() => {})

      // Nếu có PIN, trả về message cần xác thực PIN
      return { 
        success: false,
        requiresPin: true,
        userId: user.id,
        accountId: account.id,
        message: 'Vui lòng xác thực mã PIN để hoàn tất đăng nhập'
      };
    }

    // New IP detection (compare with previous successful login)
    const previous = await prisma.securityLog.findFirst({
      where: { userId: user.id, action: 'auth.login.success' },
      orderBy: { createdAt: 'desc' },
      select: { ipAddress: true, createdAt: true },
    }).catch(() => null)

    // Nếu không có PIN, tạo phiên đăng nhập ngay
    const token = await createToken({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
    });
    
    await setSessionCookie(token);

    await writeSecurityLog({
      action: 'auth.login.success',
      severity: 'MEDIUM',
      status: 'SUCCESS',
      userId: user.id,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      fingerprint: meta.fingerprint,
      requestId: meta.requestId,
    }).catch(() => {})

    if (previous?.ipAddress && meta.ipAddress && previous.ipAddress !== meta.ipAddress) {
      await writeSecurityLog({
        action: 'auth.login.new_ip',
        severity: 'HIGH',
        status: 'INFO',
        userId: user.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        fingerprint: meta.fingerprint,
        requestId: meta.requestId,
        metadata: { previousIp: previous.ipAddress, previousAt: new Date(previous.createdAt).toISOString() },
      }).catch(() => {})

      await sendSecurityAlertEmail({
        subject: '[QuocBank] New login IP detected',
        html: `<p>New login IP</p><pre>${JSON.stringify({ userId: user.id, username: user.username, ipAddress: meta.ipAddress, previousIp: previous.ipAddress }, null, 2)}</pre>`,
      }).catch(() => {})
    }

    return { success: true }; 

  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: 'Đăng nhập thất bại' };
  }
}

// --- LOGIN WITH PIN ---
export async function loginWithPin(userId: string, accountId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, fullName: true }
    });

    if (!user) {
      return { success: false, error: 'Người dùng không tồn tại' };
    }

    // Tạo phiên đăng nhập
    const token = await createToken({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
    });
    
    await setSessionCookie(token);
    return { success: true };
  } catch (error: any) {
    console.error('Login with PIN error:', error);
    return { success: false, error: 'Không thể hoàn tất đăng nhập' };
  }
}

// --- LOGOUT ---
export async function logout() {
  await clearSessionCookie();
  redirect('/login');
}