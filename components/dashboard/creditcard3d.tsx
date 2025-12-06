'use client'

import React from 'react'
import { CreditCard } from 'lucide-react'

interface CreditCard3DProps {
  cardNumber: string
  holder: string
  expiry: string
}

export function CreditCard3D({ cardNumber, holder, expiry }: CreditCard3DProps) {
  const formatCardNumber = (num: string) => {
    if (!num) return '**** **** **** ****'
    return num.replace(/(\d{4})/g, '$1 ').trim()
  }

  return (
    <div className="relative w-full h-48 perspective-1000">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl transform hover:scale-105 transition-transform duration-500">
        {/* Card shine effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-50" />
        
        {/* Card content */}
        <div className="relative h-full p-6 flex flex-col justify-between text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <CreditCard className="w-8 h-8" />
              <span className="font-bold text-sm">QuocBank</span>
            </div>
            <div className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              PLATINUM
            </div>
          </div>

          <div>
            <p className="text-xl font-mono tracking-wider mb-4">
              {formatCardNumber(cardNumber)}
            </p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-70 mb-1">Card Holder</p>
                <p className="font-semibold text-sm">{holder || 'CARD HOLDER'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-70 mb-1">Expires</p>
                <p className="font-semibold text-sm">{expiry || 'MM/YY'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chip */}
        <div className="absolute top-20 left-6 w-12 h-10 rounded bg-gradient-to-br from-yellow-200 to-yellow-400 opacity-80" />
      </div>
    </div>
  )
}
