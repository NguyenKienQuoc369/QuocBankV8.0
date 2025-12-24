'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Lấy số dư hoàn tiền (cashback)
 */
export async function getCashbackBalance(accountId: string) {
  try {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      select: { cashbackBalance: true },
    });

    if (!account) {
      return { success: false, error: 'Tài khoản không tồn tại' };
    }

    return { success: true, balance: account.cashbackBalance };
  } catch (error) {
    console.error('Get cashback balance error:', error);
    return { success: false, error: 'Không thể lấy số dư hoàn tiền' };
  }
}

/**
 * Lấy lịch sử hoàn tiền
 */
export async function getCashbackHistory(accountId: string) {
  try {
    const history = await prisma.cashbackHistory.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return { success: true, data: history };
  } catch (error) {
    console.error('Get cashback history error:', error);
    return { success: false, error: 'Không thể lấy lịch sử hoàn tiền' };
  }
}

/**
 * Rút tiền hoàn trả (khi đạt 100,000đ)
 */
export async function redeemCashback(accountId: string) {
  try {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return { success: false, error: 'Tài khoản không tồn tại' };
    }

    if (account.isLocked) {
      return { success: false, error: 'Tài khoản đang bị khóa' };
    }

    // Kiểm tra số dư hoàn tiền
    if (account.cashbackBalance < 100000) {
      return {
        success: false,
        error: `Số dư hoàn tiền chưa đủ 100,000đ. Hiện tại: ${account.cashbackBalance.toLocaleString('vi-VN')}đ`,
      };
    }

    const cashbackAmount = account.cashbackBalance;

    // Chuyển tiền hoàn trả vào tài khoản chính
    const [updatedAccount] = await prisma.$transaction([
      prisma.account.update({
        where: { id: accountId },
        data: {
          balance: account.balance + cashbackAmount,
          cashbackBalance: 0,
        },
      }),
      // Cập nhật tất cả cashback pending thành redeemed
      prisma.cashbackHistory.updateMany({
        where: {
          accountId,
          status: 'PENDING',
        },
        data: {
          status: 'REDEEMED',
        },
      }),
    ]);

    // Tạo giao dịch
    await prisma.transaction.create({
      data: {
        amount: cashbackAmount,
        description: `Rút tiền hoàn trả - Cashback ${cashbackAmount.toLocaleString('vi-VN')}đ`,
        status: 'SUCCESS',
        type: 'DEPOSIT',
        toAccountId: accountId,
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/cashback');
    return {
      success: true,
      amount: cashbackAmount,
      newBalance: updatedAccount.balance,
    };
  } catch (error) {
    console.error('Redeem cashback error:', error);
    return { success: false, error: 'Không thể rút tiền hoàn trả' };
  }
}

/**
 * Thêm cashback khi thanh toán dịch vụ (0.5%)
 */
export async function addCashback(
  accountId: string,
  transactionAmount: number,
  source: string = 'BILL_PAYMENT'
) {
  try {
    const cashbackAmount = transactionAmount * 0.005; // 0.5%

    // Cộng vào cashback balance
    await prisma.account.update({
      where: { id: accountId },
      data: {
        cashbackBalance: {
          increment: cashbackAmount,
        },
      },
    });

    // Tạo bản ghi lịch sử
    await prisma.cashbackHistory.create({
      data: {
        accountId,
        amount: cashbackAmount,
        source,
        status: 'PENDING',
      },
    });

    return { success: true, cashbackAmount };
  } catch (error) {
    console.error('Add cashback error:', error);
    return { success: false, error: 'Không thể thêm hoàn tiền' };
  }
}

/**
 * Lấy tổng cashback đã nhận
 */
export async function getTotalCashbackEarned(accountId: string) {
  try {
    const result = await prisma.cashbackHistory.aggregate({
      where: { accountId },
      _sum: {
        amount: true,
      },
    });

    return {
      success: true,
      total: result._sum.amount || 0,
    };
  } catch (error) {
    console.error('Get total cashback error:', error);
    return { success: false, error: 'Không thể tính tổng hoàn tiền' };
  }
}
