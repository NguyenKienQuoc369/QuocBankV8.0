'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Tạo hũ tiết kiệm / Heo đất
 */
export async function createPiggyBank(
  accountId: string,
  name: string,
  targetAmount: number,
  icon: string = 'pig',
  color: string = 'pink'
) {
  try {
    if (targetAmount < 10000) {
      return { success: false, error: 'Mục tiêu tối thiểu là 10,000đ' };
    }

    const piggyBank = await prisma.piggyBank.create({
      data: {
        accountId,
        name,
        targetAmount,
        icon,
        color,
      },
    });

    revalidatePath('/dashboard/savings');
    return { success: true, data: piggyBank };
  } catch (error) {
    console.error('Create piggy bank error:', error);
    return { success: false, error: 'Không thể tạo hũ tiết kiệm' };
  }
}

/**
 * Nạp tiền vào hũ
 */
export async function depositToPiggyBank(
  accountId: string,
  piggyBankId: string,
  amount: number
) {
  try {
    if (amount <= 0) {
      return { success: false, error: 'Số tiền không hợp lệ' };
    }

    // Lấy tài khoản và hũ
    const [account, piggyBank] = await Promise.all([
      prisma.account.findUnique({ where: { id: accountId } }),
      prisma.piggyBank.findUnique({ where: { id: piggyBankId } }),
    ]);

    if (!account) {
      return { success: false, error: 'Tài khoản không tồn tại' };
    }

    if (!piggyBank || !piggyBank.isActive) {
      return { success: false, error: 'Hũ tiết kiệm không tồn tại hoặc đã đóng' };
    }

    if (account.balance < amount) {
      return { success: false, error: 'Số dư không đủ' };
    }

    // Trừ tiền từ tài khoản và cộng vào hũ
    const [updatedAccount, updatedPiggyBank] = await prisma.$transaction([
      prisma.account.update({
        where: { id: accountId },
        data: { balance: account.balance - amount },
      }),
      prisma.piggyBank.update({
        where: { id: piggyBankId },
        data: { currentAmount: piggyBank.currentAmount + amount },
      }),
    ]);

    // Tạo giao dịch
    await prisma.transaction.create({
      data: {
        amount,
        description: `Nạp tiền vào hũ "${piggyBank.name}"`,
        status: 'SUCCESS',
        type: 'WITHDRAW',
        fromAccountId: accountId,
      },
    });

    revalidatePath('/dashboard/savings');
    return {
      success: true,
      balance: updatedAccount.balance,
      piggyBank: updatedPiggyBank,
    };
  } catch (error) {
    console.error('Deposit to piggy bank error:', error);
    return { success: false, error: 'Không thể nạp tiền vào hũ' };
  }
}

/**
 * Rút tiền từ hũ
 */
export async function withdrawFromPiggyBank(
  accountId: string,
  piggyBankId: string,
  amount: number
) {
  try {
    if (amount <= 0) {
      return { success: false, error: 'Số tiền không hợp lệ' };
    }

    // Lấy tài khoản và hũ
    const [account, piggyBank] = await Promise.all([
      prisma.account.findUnique({ where: { id: accountId } }),
      prisma.piggyBank.findUnique({ where: { id: piggyBankId } }),
    ]);

    if (!account) {
      return { success: false, error: 'Tài khoản không tồn tại' };
    }

    if (!piggyBank || !piggyBank.isActive) {
      return { success: false, error: 'Hũ tiết kiệm không tồn tại hoặc đã đóng' };
    }

    if (piggyBank.currentAmount < amount) {
      return { success: false, error: 'Số tiền trong hũ không đủ' };
    }

    // Cộng tiền vào tài khoản và trừ từ hũ
    const [updatedAccount, updatedPiggyBank] = await prisma.$transaction([
      prisma.account.update({
        where: { id: accountId },
        data: { balance: account.balance + amount },
      }),
      prisma.piggyBank.update({
        where: { id: piggyBankId },
        data: { currentAmount: piggyBank.currentAmount - amount },
      }),
    ]);

    // Tạo giao dịch
    await prisma.transaction.create({
      data: {
        amount,
        description: `Rút tiền từ hũ "${piggyBank.name}"`,
        status: 'SUCCESS',
        type: 'DEPOSIT',
        toAccountId: accountId,
      },
    });

    revalidatePath('/dashboard/savings');
    return {
      success: true,
      balance: updatedAccount.balance,
      piggyBank: updatedPiggyBank,
    };
  } catch (error) {
    console.error('Withdraw from piggy bank error:', error);
    return { success: false, error: 'Không thể rút tiền từ hũ' };
  }
}

/**
 * Đập hũ (rút toàn bộ và đóng hũ)
 */
export async function breakPiggyBank(accountId: string, piggyBankId: string) {
  try {
    const [account, piggyBank] = await Promise.all([
      prisma.account.findUnique({ where: { id: accountId } }),
      prisma.piggyBank.findUnique({ where: { id: piggyBankId } }),
    ]);

    if (!account) {
      return { success: false, error: 'Tài khoản không tồn tại' };
    }

    if (!piggyBank || !piggyBank.isActive) {
      return { success: false, error: 'Hũ tiết kiệm không tồn tại hoặc đã đóng' };
    }

    const amount = piggyBank.currentAmount;

    // Cộng tiền vào tài khoản và đóng hũ
    const [updatedAccount] = await prisma.$transaction([
      prisma.account.update({
        where: { id: accountId },
        data: { balance: account.balance + amount },
      }),
      prisma.piggyBank.update({
        where: { id: piggyBankId },
        data: { isActive: false },
      }),
    ]);

    // Tạo giao dịch
    await prisma.transaction.create({
      data: {
        amount,
        description: `Đập hũ "${piggyBank.name}" - Hoàn thành mục tiêu`,
        status: 'SUCCESS',
        type: 'DEPOSIT',
        toAccountId: accountId,
      },
    });

    revalidatePath('/dashboard/savings');
    return {
      success: true,
      balance: updatedAccount.balance,
      amount,
    };
  } catch (error) {
    console.error('Break piggy bank error:', error);
    return { success: false, error: 'Không thể đập hũ' };
  }
}

/**
 * Lấy danh sách hũ tiết kiệm
 */
export async function getPiggyBanks(accountId: string) {
  try {
    const piggyBanks = await prisma.piggyBank.findMany({
      where: { accountId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: piggyBanks };
  } catch (error) {
    console.error('Get piggy banks error:', error);
    return { success: false, error: 'Không thể lấy danh sách hũ' };
  }
}
