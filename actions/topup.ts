'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Nạp tiền vào tài khoản (từ điểm nạp tiền)
 */
export async function topupAccount(
  accountId: string,
  amount: number,
  locationCode?: string
) {
  try {
    if (amount <= 0) {
      return { success: false, error: 'Số tiền không hợp lệ' };
    }

    // Lấy tài khoản
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return { success: false, error: 'Tài khoản không tồn tại' };
    }

    if (account.isLocked) {
      return { success: false, error: 'Tài khoản đang bị khóa' };
    }

    // Cập nhật số dư
    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: account.balance + amount,
      },
    });

    // Tạo giao dịch
    await prisma.transaction.create({
      data: {
        amount,
        description: `Nạp tiền vào tài khoản${locationCode ? ` tại ${locationCode}` : ''}`,
        status: 'SUCCESS',
        type: 'DEPOSIT',
        toAccountId: accountId,
      },
    });

    revalidatePath('/dashboard');
    return {
      success: true,
      balance: updatedAccount.balance,
    };
  } catch (error) {
    console.error('Topup error:', error);
    return { success: false, error: 'Không thể nạp tiền' };
  }
}

/**
 * Lấy danh sách địa điểm nạp tiền (Hành tinh)
 */
export async function getDepositLocations() {
  try {
    const locations = await prisma.depositLocation.findMany({
      where: { isActive: true },
      orderBy: { planetName: 'asc' },
    });

    return { success: true, data: locations };
  } catch (error) {
    console.error('Get locations error:', error);
    return { success: false, error: 'Không thể lấy danh sách địa điểm' };
  }
}

/**
 * Tạo địa điểm nạp tiền mới (Admin)
 */
export async function createDepositLocation(data: {
  planetName: string;
  planetCode: string;
  description?: string;
  color: string;
  icon: string;
  depositPoints?: number;
}) {
  try {
    const location = await prisma.depositLocation.create({
      data: {
        planetName: data.planetName,
        planetCode: data.planetCode,
        description: data.description,
        color: data.color,
        icon: data.icon,
        depositPoints: data.depositPoints || 5,
      },
    });

    revalidatePath('/dashboard/topup');
    return { success: true, data: location };
  } catch (error) {
    console.error('Create location error:', error);
    return { success: false, error: 'Không thể tạo địa điểm' };
  }
}
