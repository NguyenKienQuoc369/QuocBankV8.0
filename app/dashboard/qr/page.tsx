import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { QRPaymentClient } from './QRPaymentClient';

export default async function QRPaymentPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const account = await prisma.account.findFirst({
    where: { userId: session.id as string },
    include: {
      user: {
        select: {
          fullName: true
        }
      }
    }
  });

  if (!account) redirect('/dashboard');

  return (
    <QRPaymentClient
      accountNumber={account.accountNumber}
      accountName={account.user.fullName}
      currentBalance={account.balance}
    />
  );
}
