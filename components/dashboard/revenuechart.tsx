'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const mockData = [
  { month: 'T1', income: 15000000, expense: 4200000 },
  { month: 'T2', income: 18000000, expense: 5100000 },
  { month: 'T3', income: 16500000, expense: 4800000 },
  { month: 'T4', income: 19000000, expense: 5500000 },
  { month: 'T5', income: 17500000, expense: 4900000 },
  { month: 'T6', income: 20000000, expense: 6000000 },
]

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={mockData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="month" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#fff' }}
        />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#00ff88"
          strokeWidth={2}
          dot={{ fill: '#00ff88', r: 4 }}
          name="Thu nhập"
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#ff4444"
          strokeWidth={2}
          dot={{ fill: '#ff4444', r: 4 }}
          name="Chi tiêu"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
