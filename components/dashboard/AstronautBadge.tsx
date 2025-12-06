'use client'

import React from 'react'

export function AstronautBadge({ user }: { user: any }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/6 text-white">
      <div className="font-bold text-lg">{user?.name}</div>
      <div className="text-sm text-gray-400">{user?.username}</div>
      <div className="text-xs text-gray-500 mt-2">Role: {user?.role}</div>
    </div>
  )
}
