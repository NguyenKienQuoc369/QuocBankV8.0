'use client'

import React from 'react'

export function CardControlStation({ card }: { card: any }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400">**** **** **** {String(card.number).slice(-4)}</div>
          <div className="text-lg font-bold">{card.brand || 'Virtual Card'}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Hạn: {card.expiry || '--/--'}</div>
          <div className="text-xl font-mono">{card.balance ? card.balance.toLocaleString() + ' VND' : ''}</div>
        </div>
      </div>
    </div>
  )
}
