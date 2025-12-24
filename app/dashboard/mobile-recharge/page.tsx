import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { MobileRecharge } from '@/components/recharge/MobileRecharge';

export default async function MobileRechargePage() {
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
    <div className="container mx-auto max-w-4xl">
      <MobileRecharge accountId={account.id} balance={account.balance} />
    </div>
  );
}
