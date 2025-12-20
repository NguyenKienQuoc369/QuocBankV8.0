'use client'

import React from 'react'
import { TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'

interface Savings {
  id: string
  name: string
  balance: number
  targetAmount: number
  interestRate: number
  createdAt: string
}

export function SavingsPod({ savings }: { savings: Savings }) {
  const progress = (savings.balance / savings.targetAmount) * 100

  return (
    <Link href={`/dashboard/savings/${savings.id}`}>
      <div className="group cursor-pointer">
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.2)] overflow-hidden h-full">
          
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-indigo-500/10 transition-all duration-500" />

          <div className="relative z-10 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg truncate">{savings.name}</h3>
              <div className="p-2 rounded-lg bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
                <TrendingUp size={18} className="text-indigo-400" />
              </div>
            </div>

            {/* Balance */}
            <div>
              <div className="text-sm text-gray-400 mb-1">Số dư</div>
              <div className="text-2xl font-bold text-white">
                {(savings.balance / 1000000).toFixed(1)}M
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">Tiến độ</span>
                <span className="text-xs text-indigo-400 font-mono">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            {/* Interest Rate */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Zap size={14} className="text-yellow-400" />
                Lãi suất
              </span>
              <span className="text-sm font-bold text-yellow-400">{savings.interestRate}%/năm</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
