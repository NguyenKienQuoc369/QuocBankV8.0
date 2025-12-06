'use client'

import React from 'react'
import { maskCardNumber, formatVND } from '@/lib/utils'

export function CardControlStation({ card }: { card: any }) {
  const last4 = String(card?.cardNumber || '').slice(-4)
  const masked = card?.cardNumber
    ? maskCardNumber(String(card.cardNumber))
    : (last4 ? `**** **** **** ${last4}` : '')

  const balance = card?.account?.balance

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400">{masked}</div>
          <div className="text-lg font-bold">{card?.type || 'Virtual Card'}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Hạn: {card?.expiryDate || '--/--'}</div>
          <div className="text-xl font-mono">{typeof balance === 'number' ? formatVND(balance) : ''}</div>
        </div>
      </div>
    </div>
  )
}
