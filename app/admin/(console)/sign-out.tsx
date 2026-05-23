'use client'

import { signOut } from 'next-auth/react'

export default function AdminSignOutButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className={className}
    >
      Sign out
    </button>
  )
}
