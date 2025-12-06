'use client'

import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function QuickTransfer() {
  const router = useRouter()
  const [accountNumber, setAccountNumber] = useState('')
  const [amount, setAmount] = useState('')

  const handleQuickTransfer = () => {
    // Redirect to transfer page with pre-filled data
    const params = new URLSearchParams()
    if (accountNumber) params.set('to', accountNumber)
    if (amount) params.set('amount', amount)
    router.push(`/dashboard/transfer?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-2">Số tài khoản</label>
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Nhập số tài khoản"
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Số tiền</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Nhập số tiền"
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      <button
        onClick={handleQuickTransfer}
        disabled={!accountNumber || !amount}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Send className="w-5 h-5" />
        Chuyển ngay
      </button>

      <div className="pt-4 border-t border-white/10">
        <p className="text-sm text-gray-400 mb-3">Người nhận gần đây</p>
        <div className="space-y-2">
          <button className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
            <p className="font-semibold text-white">Nguyễn Văn A</p>
            <p className="text-sm text-gray-400">**** **** 1234</p>
          </button>
          <button className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
            <p className="font-semibold text-white">Trần Thị B</p>
            <p className="text-sm text-gray-400">**** **** 5678</p>
          </button>
        </div>
      </div>
    </div>
  )
}
