import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { QuickTopupClient } from './QuickTopupClient';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-6 md:py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <QuickTopupClient accountId={account.id} currentBalance={account.balance} />
      </div>
    </div>
  );
}
