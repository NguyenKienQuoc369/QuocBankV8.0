'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { getRequestMeta } from '@/lib/security/request';
import { runWithSecurityContext } from '@/lib/security/context';

/**
 * Thiết lập mã PIN lần đầu
 */
export async function setupPin(accountId: string, pin: string) {
  try {
    const session = await getSession();
    if (!session?.id) return { success: false, error: 'Unauthorized' };
    const userId = String(session.id);
    const meta = await getRequestMeta();

    // Validate PIN (6 số)
    if (!/^\d{6}$/.test(pin)) {
      return { success: false, error: 'Mã PIN phải là 6 chữ số' };
    }

    // Mã hóa PIN
    const hashedPin = await bcrypt.hash(pin, 10);

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
        const account = await prisma.account.findFirst({
          where: { id: accountId, userId },
          select: { id: true },
        });

        if (!account) throw new Error('NOT_ALLOWED');

        await prisma.account.update({
          where: { id: accountId },
          data: { pin: hashedPin },
        });

        await prisma.pinChangeHistory.create({
          data: {
            accountId,
            ipAddress: meta.ipAddress,
          },
        });
      }
    );

    revalidatePath('/dashboard/security');
    return { success: true };
  } catch (error) {
    console.error('Setup PIN error:', error);
    return { success: false, error: 'Không thể thiết lập mã PIN' };
  }
}

/**
 * Thay đổi mã PIN
 */
export async function changePin(
  accountId: string,
  oldPin: string,
  newPin: string
) {
  try {
    const session = await getSession();
    if (!session?.id) return { success: false, error: 'Unauthorized' };
    const userId = String(session.id);
    const meta = await getRequestMeta();

    // Validate PIN mới
    if (!/^\d{6}$/.test(newPin)) {
      return { success: false, error: 'Mã PIN mới phải là 6 chữ số' };
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
        const account = await prisma.account.findFirst({
          where: { id: accountId, userId },
          select: { pin: true },
        });

        if (!account) throw new Error('NOT_ALLOWED');
        if (!account.pin) throw new Error('NO_PIN');

        const isValidOldPin = await bcrypt.compare(oldPin, account.pin);
        if (!isValidOldPin) {
          throw new Error('BAD_OLD_PIN');
        }

        const hashedNewPin = await bcrypt.hash(newPin, 10);

        await prisma.account.update({
          where: { id: accountId },
          data: { pin: hashedNewPin },
        });

        await prisma.pinChangeHistory.create({
          data: {
            accountId,
            ipAddress: meta.ipAddress,
          },
        });
      }
    );

    revalidatePath('/dashboard/security');
    return { success: true };
  } catch (error) {
    console.error('Change PIN error:', error);
    const code = error instanceof Error ? error.message : 'ERROR';
    if (code === 'NO_PIN') return { success: false, error: 'Chưa thiết lập mã PIN' };
    if (code === 'BAD_OLD_PIN') return { success: false, error: 'Mã PIN cũ không đúng' };
    if (code === 'NOT_ALLOWED') return { success: false, error: 'Không có quyền' };
    return { success: false, error: 'Không thể thay đổi mã PIN' };
  }
}

/**
 * Xác minh mã PIN
 */

export async function verifyPin(accountId: string, pin: string) {
  try {
    const session = await getSession();
    if (!session?.id) return { success: false, error: 'Unauthorized' };
    const userId = String(session.id);
    const account = await prisma.account.findFirst({
      where: { id: accountId, userId },
      select: { pin: true },
    });

    if (!account || !account.pin) {
      return { success: false, error: 'Chưa thiết lập mã PIN' };
    }

    const isValid = await bcrypt.compare(pin, account.pin);
    return { success: isValid, error: isValid ? null : 'Mã PIN không đúng' };
  } catch (error) {
    console.error('Verify PIN error:', error);
    return { success: false, error: 'Không thể xác minh mã PIN' };
  }
}

/**
 * Lấy lịch sử thay đổi PIN
 */
export async function getPinHistory(accountId: string) {
  try {
    const session = await getSession();
    if (!session?.id) return { success: false, error: 'Unauthorized' };
    const userId = String(session.id);

    const owned = await prisma.account.findFirst({ where: { id: accountId, userId }, select: { id: true } });
    if (!owned) return { success: false, error: 'Không có quyền' };

    const history = await prisma.pinChangeHistory.findMany({
      where: { accountId },
      orderBy: { changedAt: 'desc' },
      take: 10,
    });

    return { success: true, data: history };
  } catch (error) {
    console.error('Get PIN history error:', error);
    return { success: false, error: 'Không thể lấy lịch sử' };
  }
}
