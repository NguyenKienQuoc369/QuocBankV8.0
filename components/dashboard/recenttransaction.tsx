'use client'

import React from 'react'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { formatVND } from '@/lib/utils'

interface Transaction {
  id: string
  amount: number
  description: string | null
  type: string
  createdAt: Date
  fromAccountId: string | null
  toAccountId: string | null
  fromAccount?: {
    accountNumber: string
    userId: string
  } | null
  toAccount?: {
    accountNumber: string
    userId: string
  } | null
}

interface RecentTransactionsProps {
  transactions: Transaction[]
  currentUserId: string
}

export function RecentTransactions({ transactions, currentUserId }: RecentTransactionsProps) {
  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Chưa có giao dịch nào
        </div>
      ) : (
        transactions.map((tx) => {
          const isIncoming = tx.toAccount?.userId === currentUserId
          const isOutgoing = tx.fromAccount?.userId === currentUserId

          return (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isIncoming ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}
                >
                  {isIncoming ? (
                    <ArrowDownLeft className="w-5 h-5 text-green-400" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {tx.description || (isIncoming ? 'Nhận tiền' : 'Chuyển tiền')}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold ${
                    isIncoming ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {isIncoming ? '+' : '-'}{formatVND(tx.amount)}
                </p>
                <p className="text-xs text-gray-500">{tx.type}</p>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
