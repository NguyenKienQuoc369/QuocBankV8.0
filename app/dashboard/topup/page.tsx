import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { DepositLocations } from '@/components/topup/DepositLocations';

export default async function TopUpPage() {
  const payload = await getSession();
  if (!payload) redirect('/login');

  const account = await prisma.account.findFirst({
    where: { userId: payload.id as string },
    select: {
      id: true,
      balance: true,
    },
  });

  if (!account) redirect('/dashboard');

  return (
    <div className="container mx-auto max-w-6xl">
      <DepositLocations accountId={account.id} balance={account.balance} />
    </div>
  );
}
