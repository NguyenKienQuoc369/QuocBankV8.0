import React from 'react';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface AuthGuardProps {
	children: React.ReactNode;
}

export async function AuthGuard({ children }: AuthGuardProps) {
	const cookieStore = await cookies();
	const token = cookieStore.get('session')?.value;

	if (!token) {
		redirect('/login');
		return null;
	}

	const payload = await verifyToken(token);

	if (!payload) {
		redirect('/login');
		return null;
	}

	return <>{children}</>;
}
