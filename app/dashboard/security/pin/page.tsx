import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { PinManagement } from '@/components/security/PinManagement';

export default async function PinPage() {
  const payload = await getSession();
  if (!payload) redirect('/login');

  // Lấy tài khoản chính
  const account = await prisma.account.findFirst({
    where: { userId: payload.id as string },
    select: {
      id: true,
      pin: true,
    },
  });

  if (!account) redirect('/dashboard');

  return (
    <div className="container mx-auto max-w-4xl">
      <PinManagement accountId={account.id} hasPin={!!account.pin} />
    </div>
  );
}
