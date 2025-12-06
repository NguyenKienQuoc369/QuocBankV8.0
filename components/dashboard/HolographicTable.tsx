'use client'

import React from 'react'

export function HolographicTable({ initialData = [], totalPages = 1 }: { initialData?: any[], totalPages?: number }) {
  return (
    <div className="bg-white/3 rounded-2xl p-4">
      <table className="w-full table-auto text-sm text-left">
        <thead>
          <tr className="text-gray-400">
            <th className="px-3 py-2">Mô tả</th>
            <th className="px-3 py-2">Số tiền</th>
            <th className="px-3 py-2">Ngày</th>
            <th className="px-3 py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {initialData.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-3 py-6 text-center text-gray-400">Không có giao dịch</td>
            </tr>
          ) : (
            initialData.map((tx: any) => (
              <tr key={tx.id} className="border-t border-white/5">
                <td className="px-3 py-3">{tx.description}</td>
                <td className="px-3 py-3">{tx.amount?.toLocaleString?.() || tx.amount} VND</td>
                <td className="px-3 py-3">{new Date(tx.date).toLocaleString()}</td>
                <td className="px-3 py-3">{tx.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="mt-4 text-right text-gray-400">Trang: {totalPages}</div>
    </div>
  )
}
