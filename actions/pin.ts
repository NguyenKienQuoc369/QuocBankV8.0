'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

/**
 * Thiết lập mã PIN lần đầu
 */
export async function setupPin(accountId: string, pin: string) {
  try {
    // Validate PIN (6 số)
    if (!/^\d{6}$/.test(pin)) {
      return { success: false, error: 'Mã PIN phải là 6 chữ số' };
    }

    // Mã hóa PIN
    const hashedPin = await bcrypt.hash(pin, 10);

    // Cập nhật PIN
    await prisma.account.update({
      where: { id: accountId },
      data: { pin: hashedPin },
    });

    // Lưu lịch sử thay đổi PIN
    await prisma.pinChangeHistory.create({
      data: {
        accountId,
      },
    });

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
    // Validate PIN mới
    if (!/^\d{6}$/.test(newPin)) {
      return { success: false, error: 'Mã PIN mới phải là 6 chữ số' };
    }

    // Lấy tài khoản
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      select: { pin: true },
    });

    if (!account || !account.pin) {
      return { success: false, error: 'Chưa thiết lập mã PIN' };
    }

    // Kiểm tra PIN cũ
    const isValidOldPin = await bcrypt.compare(oldPin, account.pin);
    if (!isValidOldPin) {
      return { success: false, error: 'Mã PIN cũ không đúng' };
    }

    // Mã hóa PIN mới
    const hashedNewPin = await bcrypt.hash(newPin, 10);

    // Cập nhật PIN
    await prisma.account.update({
      where: { id: accountId },
      data: { pin: hashedNewPin },
    });

    // Lưu lịch sử
    await prisma.pinChangeHistory.create({
      data: {
        accountId,
      },
    });

    revalidatePath('/dashboard/security');
    return { success: true };
  } catch (error) {
    console.error('Change PIN error:', error);
    return { success: false, error: 'Không thể thay đổi mã PIN' };
  }
}

/**
 * Xác minh mã PIN
 */
export async function verifyPin(accountId: string, pin: string) {
  try {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
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
