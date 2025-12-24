'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Cập nhật hạn mức thanh toán tài khoản
 */
export async function updateAccountLimits(
  accountId: string,
  dailyLimit?: number,
  monthlyLimit?: number
) {
  try {
    const updateData: any = {};

    if (dailyLimit !== undefined) {
      if (dailyLimit < 0) {
        return { success: false, error: 'Hạn mức không hợp lệ' };
      }
      updateData.dailyLimit = dailyLimit;
    }

    if (monthlyLimit !== undefined) {
      if (monthlyLimit < 0) {
        return { success: false, error: 'Hạn mức không hợp lệ' };
      }
      updateData.monthlyLimit = monthlyLimit;
    }

    const account = await prisma.account.update({
      where: { id: accountId },
      data: updateData,
    });

    revalidatePath('/dashboard/settings');
    return { success: true, data: account };
  } catch (error) {
    console.error('Update account limits error:', error);
    return { success: false, error: 'Không thể cập nhật hạn mức' };
  }
}

/**
 * Cập nhật hạn mức thẻ
 */
export async function updateCardLimits(
  cardId: string,
  dailyLimit?: number,
  monthlyLimit?: number
) {
  try {
    const updateData: any = {};

    if (dailyLimit !== undefined) {
      if (dailyLimit < 0) {
        return { success: false, error: 'Hạn mức không hợp lệ' };
      }
      updateData.dailyLimit = dailyLimit;
    }

    if (monthlyLimit !== undefined) {
      if (monthlyLimit < 0) {
        return { success: false, error: 'Hạn mức không hợp lệ' };
      }
      updateData.monthlyLimit = monthlyLimit;
    }

    const card = await prisma.card.update({
      where: { id: cardId },
      data: updateData,
    });

    revalidatePath('/dashboard/cards');
    return { success: true, data: card };
  } catch (error) {
    console.error('Update card limits error:', error);
    return { success: false, error: 'Không thể cập nhật hạn mức thẻ' };
  }
}

/**
 * Lấy hạn mức tài khoản
 */
export async function getAccountLimits(accountId: string) {
  try {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      select: {
        dailyLimit: true,
        monthlyLimit: true,
      },
    });

    if (!account) {
      return { success: false, error: 'Tài khoản không tồn tại' };
    }

    return { success: true, data: account };
  } catch (error) {
    console.error('Get account limits error:', error);
    return { success: false, error: 'Không thể lấy hạn mức' };
  }
}

/**
 * Bật/tắt thanh toán NFC (Chạm để thanh toán)
 */
export async function toggleNFC(cardId: string, enabled: boolean) {
  try {
    const card = await prisma.card.update({
      where: { id: cardId },
      data: { nfcEnabled: enabled },
    });

    revalidatePath('/dashboard/cards');
    return { success: true, data: card };
  } catch (error) {
    console.error('Toggle NFC error:', error);
    return { success: false, error: 'Không thể cập nhật cài đặt NFC' };
  }
}

/**
 * Bật/tắt thanh toán qua dải từ
 */
export async function toggleMagneticStripe(cardId: string, enabled: boolean) {
  try {
    const card = await prisma.card.update({
      where: { id: cardId },
      data: { magneticEnabled: enabled },
    });

    revalidatePath('/dashboard/cards');
    return { success: true, data: card };
  } catch (error) {
    console.error('Toggle magnetic stripe error:', error);
    return { success: false, error: 'Không thể cập nhật cài đặt dải từ' };
  }
}

/**
 * Lấy thông tin cài đặt thẻ
 */
export async function getCardSettings(cardId: string) {
  try {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: {
        dailyLimit: true,
        monthlyLimit: true,
        nfcEnabled: true,
        magneticEnabled: true,
        isLocked: true,
      },
    });

    if (!card) {
      return { success: false, error: 'Thẻ không tồn tại' };
    }

    return { success: true, data: card };
  } catch (error) {
    console.error('Get card settings error:', error);
    return { success: false, error: 'Không thể lấy thông tin thẻ' };
  }
}
