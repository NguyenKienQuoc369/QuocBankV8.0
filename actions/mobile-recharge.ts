'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Nạp tiền điện thoại
 */
export async function rechargeMobile(
  accountId: string,
  providerId: string,
  phoneNumber: string,
  amount: number
) {
  try {
    // Validate số điện thoại (10 số, bắt đầu bằng 0)
    if (!/^0\d{9}$/.test(phoneNumber)) {
      return { success: false, error: 'Số điện thoại không hợp lệ' };
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

    // Lấy thông tin nhà cung cấp
    const provider = await prisma.mobileProvider.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      return { success: false, error: 'Nhà cung cấp không tồn tại' };
    }

    const totalAmount = amount + provider.serviceFee;

    // Kiểm tra số dư
    if (account.balance < totalAmount) {
      return { success: false, error: 'Số dư không đủ' };
    }

    // Trừ tiền và tạo giao dịch
    const [updatedAccount, recharge] = await prisma.$transaction([
      prisma.account.update({
        where: { id: accountId },
        data: {
          balance: account.balance - totalAmount,
        },
      }),
      prisma.mobileRecharge.create({
        data: {
          accountId,
          providerId,
          phoneNumber,
          amount,
          status: 'SUCCESS',
        },
      }),
    ]);

    // Tính cashback 0.5%
    const cashbackAmount = totalAmount * 0.005;
    await prisma.account.update({
      where: { id: accountId },
      data: {
        cashbackBalance: account.cashbackBalance + cashbackAmount,
      },
    });

    await prisma.cashbackHistory.create({
      data: {
        accountId,
        amount: cashbackAmount,
        source: 'MOBILE_RECHARGE',
        status: 'PENDING',
      },
    });

    revalidatePath('/dashboard');
    return {
      success: true,
      balance: updatedAccount.balance,
      recharge,
    };
  } catch (error) {
    console.error('Mobile recharge error:', error);
    return { success: false, error: 'Không thể nạp tiền điện thoại' };
  }
}

/**
 * Lấy danh sách nhà cung cấp
 */
export async function getMobileProviders() {
  try {
    const providers = await prisma.mobileProvider.findMany({
      orderBy: { name: 'asc' },
    });

    return { success: true, data: providers };
  } catch (error) {
    console.error('Get providers error:', error);
    return { success: false, error: 'Không thể lấy danh sách nhà cung cấp' };
  }
}

/**
 * Lấy lịch sử nạp tiền điện thoại
 */
export async function getMobileRechargeHistory(accountId: string) {
  try {
    const history = await prisma.mobileRecharge.findMany({
      where: { accountId },
      include: {
        provider: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return { success: true, data: history };
  } catch (error) {
    console.error('Get recharge history error:', error);
    return { success: false, error: 'Không thể lấy lịch sử' };
  }
}

/**
 * Tạo nhà cung cấp mới (Admin)
 */
export async function createMobileProvider(data: {
  code: string;
  name: string;
  logo?: string;
  denominations: number[];
  serviceFee?: number;
}) {
  try {
    const provider = await prisma.mobileProvider.create({
      data: {
        code: data.code,
        name: data.name,
        logo: data.logo,
        denominations: JSON.stringify(data.denominations),
        serviceFee: data.serviceFee || 0,
      },
    });

    revalidatePath('/dashboard/mobile-recharge');
    return { success: true, data: provider };
  } catch (error) {
    console.error('Create provider error:', error);
    return { success: false, error: 'Không thể tạo nhà cung cấp' };
  }
}
