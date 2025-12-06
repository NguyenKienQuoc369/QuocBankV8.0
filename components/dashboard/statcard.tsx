'use client'

import React from 'react'
import { Wallet, TrendingUp, TrendingDown, Shield } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  trend?: string
  icon: 'wallet' | 'chart' | 'expense' | 'shield'
  color: 'indigo' | 'green' | 'red' | 'purple'
  subValue?: string
}

const iconMap = {
  wallet: Wallet,
  chart: TrendingUp,
  expense: TrendingDown,
  shield: Shield
}

const colorMap = {
  indigo: 'from-indigo-500 to-indigo-600',
  green: 'from-green-500 to-green-600',
  red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600'
}

export function StatCard({ title, value, trend, icon, color, subValue }: StatCardProps) {
  const Icon = iconMap[icon]
  const gradientColor = colorMap[color]

  return (
    <div className="glass-cockpit rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientColor}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-semibold ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
    </div>
  )
}
