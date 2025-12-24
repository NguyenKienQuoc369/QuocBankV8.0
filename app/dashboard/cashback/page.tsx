import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { CashbackDashboard } from '@/components/cashback/CashbackDashboard';

export default async function CashbackPage() {
  const payload = await getSession();
  if (!payload) redirect('/login');

  const account = await prisma.account.findFirst({
    where: { userId: payload.id as string },
    select: {
      id: true,
    },
  });

  if (!account) redirect('/dashboard');

  return (
    <div className="container mx-auto max-w-6xl">
      <CashbackDashboard accountId={account.id} />
    </div>
  );
}
