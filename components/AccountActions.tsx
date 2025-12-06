"use client"

import React, { useEffect, useState } from 'react'

export function AccountActions() {
  const [loading, setLoading] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [fromAccount, setFromAccount] = useState('')
  const [toAccount, setToAccount] = useState('')
  const [amountStr, setAmountStr] = useState('')
  const [note, setNote] = useState('')
  const [accounts, setAccounts] = useState<Array<{id: string; accountNumber: string; balance: number}>>([])
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{id: string; accountNumber: string; balance: number; ownerName: string}>>([])
  const [searching, setSearching] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loadingTx, setLoadingTx] = useState(false)

  // pagination & filters
  const [txPage, setTxPage] = useState(1)
  const [txPageSize, setTxPageSize] = useState(8)
  const [txTotal, setTxTotal] = useState(0)
  const [filterType, setFilterType] = useState<string | undefined>(undefined)
  const [filterStartDate, setFilterStartDate] = useState<string | undefined>(undefined)
  const [filterEndDate, setFilterEndDate] = useState<string | undefined>(undefined)

  // UX states
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  async function handleCreateAccount() {
    setLoading(true)
    try {
      const res = await fetch('/api/accounts/create', { method: 'POST' })
      const data = await res.json()
      if (data.error) alert('Lỗi: ' + data.error)
      else alert('Tạo tài khoản thành công: ' + data.account.accountNumber)
    } catch (e: any) {
      alert('Lỗi hệ thống: ' + e?.message)
    } finally { setLoading(false) }
  }

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      // reload to reflect logged-out state
      window.location.href = '/login'
    } catch (e: any) {
      alert('Logout failed')
    } finally { setLoading(false) }
  }

  function openTransferModal() {
    setFromAccount('')
    setToAccount('')
    setAmountStr('')
    setNote('')
    // fetch user's accounts for the from-account dropdown
    setShowTransfer(true)
    fetchAccounts()
  }

  async function fetchAccounts() {
    setLoadingAccounts(true)
    try {
      const res = await fetch('/api/accounts/list')
      const data = await res.json()
      if (data?.success && Array.isArray(data.accounts)) {
        setAccounts(data.accounts)
        if (data.accounts.length > 0) setFromAccount(data.accounts[0].accountNumber)
      } else if (data?.error) {
        alert('Không thể load tài khoản: ' + data.error)
      }
    } catch (e: any) {
      alert('Lỗi khi lấy danh sách tài khoản: ' + e?.message)
    } finally { setLoadingAccounts(false) }
  }

  async function searchAccounts(q: string) {
    if (!q || q.trim().length === 0) { setSearchResults([]); return }
    setSearching(true)
    try {
      const res = await fetch('/api/accounts/search?q=' + encodeURIComponent(q))
      const data = await res.json()
      if (data?.success && Array.isArray(data.results)) setSearchResults(data.results)
      else if (data?.error) alert('Lỗi tìm kiếm: ' + data.error)
    } catch (e: any) {
      console.error(e)
    } finally { setSearching(false) }
  }

  async function fetchTransactions() {
    setLoadingTx(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(txPage))
      params.set('pageSize', String(txPageSize))
      if (filterType) params.set('type', filterType)
      if (filterStartDate) params.set('startDate', filterStartDate)
      if (filterEndDate) params.set('endDate', filterEndDate)

      const res = await fetch('/api/transactions/list?' + params.toString())
      const data = await res.json()
      if (data?.success && Array.isArray(data.transactions)) {
        setTransactions(data.transactions)
        setTxTotal(data.total || 0)
      }
    } catch (e: any) {
      console.error('fetchTransactions', e)
    } finally { setLoadingTx(false) }
  }

  async function handleSubmitTransfer(e?: React.FormEvent) {
    e?.preventDefault()
    const amount = Number(amountStr.replace(/[^0-9.-]+/g, ''))
    setErrorMessage(null)
    if (!fromAccount || !toAccount) return setErrorMessage('Vui lòng nhập đủ tài khoản nguồn và đích')
    if (!amount || amount <= 0) return setErrorMessage('Số tiền không hợp lệ')

    // open confirm dialog instead of immediate send
    setConfirmOpen(true)
  }

  async function performTransfer() {
    setErrorMessage(null)
    setConfirmOpen(false)
    setLoading(true)
    try {
      const res = await fetch('/api/transactions/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromAccountNumber: fromAccount, toAccountNumber: toAccount, amount: Number(amountStr.replace(/[^0-9.-]+/g, '')), description: note })
      })
      const data = await res.json()
      if (data.error) {
        setErrorMessage('Chuyển khoản thất bại: ' + data.error)
      } else {
        setToast('Chuyển khoản thành công')
        // refresh accounts and transactions
        fetchAccounts()
        setTxPage(1)
        fetchTransactions()
        setShowTransfer(false)
        // hide toast after a while
        setTimeout(() => setToast(null), 4000)
      }
    } catch (e: any) {
      setErrorMessage('Lỗi kết nối: ' + e?.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleCreateAccount} disabled={loading} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">
        Tạo tài khoản
      </button>
      <button onClick={openTransferModal} disabled={loading} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">
        Chuyển tiền
      </button>
      <button onClick={handleLogout} disabled={loading} className="px-3 py-1 rounded bg-red-600/20 hover:bg-red-600/30">
        Đăng xuất
      </button>

      {showTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTransfer(false)} />
          <form onSubmit={handleSubmitTransfer} className="relative bg-gray-900 rounded-lg p-6 w-[420px] mx-4">
            <h3 className="text-lg font-bold mb-4">Chuyển tiền</h3>
            <div className="space-y-3">
              <label className="text-sm text-gray-300">Tài khoản nguồn</label>
              {loadingAccounts ? (
                <div className="text-sm text-gray-400">Đang tải tài khoản...</div>
              ) : (
                <select value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} className="w-full p-2 bg-white/5 rounded">
                  <option value="">-- Chọn tài khoản nguồn --</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.accountNumber}>{a.accountNumber} — {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(a.balance)}</option>
                  ))}
                </select>
              )}

              <label className="text-sm text-gray-300">Tài khoản nhận</label>
              <input value={toAccount} onChange={(e) => setToAccount(e.target.value)} className="w-full p-2 bg-white/5 rounded" placeholder="VD: 0123456789" />
              <div className="mt-2">
                <div className="flex gap-2">
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 p-2 bg-white/5 rounded" placeholder="Tìm theo số tài khoản hoặc tên" />
                  <button type="button" onClick={() => searchAccounts(searchQuery)} className="px-3 py-1 rounded bg-white/10">Tìm</button>
                </div>
                {searching && <div className="text-sm text-gray-400 mt-2">Đang tìm...</div>}
                {searchResults.length > 0 && (
                  <div className="mt-2 max-h-40 overflow-auto bg-white/3 p-2 rounded">
                    {searchResults.map((r) => (
                      <div key={r.id} className="p-2 hover:bg-white/5 rounded cursor-pointer" onClick={() => { setToAccount(r.accountNumber); setSearchResults([]) }}>
                        <div className="font-mono">{r.accountNumber}</div>
                        <div className="text-sm text-gray-400">{r.ownerName} • {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(r.balance)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="text-sm text-gray-300">Số tiền (VND)</label>
              <input value={amountStr} onChange={(e) => setAmountStr(e.target.value)} className="w-full p-2 bg-white/5 rounded" placeholder="50000" />

              <label className="text-sm text-gray-300">Ghi chú (tuỳ chọn)</label>
              <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full p-2 bg-white/5 rounded" placeholder="Lý do chuyển" />
            </div>

            {errorMessage && <div className="mb-2 text-sm text-yellow-400">{errorMessage}</div>}
            <div className="mt-4 flex justify-between gap-2 items-center">
              <div className="flex items-center gap-2">
                <select value={txPageSize} onChange={(e) => { setTxPageSize(Number(e.target.value)); setTxPage(1); }} className="p-1 bg-white/5 rounded text-sm">
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                </select>
                <select value={filterType || ''} onChange={(e) => { setFilterType(e.target.value || undefined); setTxPage(1); }} className="p-1 bg-white/5 rounded text-sm">
                  <option value="">Tất cả loại</option>
                  <option value="TRANSFER">Chuyển khoản</option>
                  <option value="DEPOSIT">Nạp tiền</option>
                  <option value="WITHDRAW">Rút tiền</option>
                </select>
                <input type="date" value={filterStartDate || ''} onChange={(e) => { setFilterStartDate(e.target.value || undefined); setTxPage(1); }} className="p-1 bg-white/5 rounded text-sm" />
                <input type="date" value={filterEndDate || ''} onChange={(e) => { setFilterEndDate(e.target.value || undefined); setTxPage(1); }} className="p-1 bg-white/5 rounded text-sm" />
              </div>
              <div>
                <button type="button" onClick={() => setShowTransfer(false)} className="px-3 py-1 rounded bg-white/10">Huỷ</button>
                <button type="submit" disabled={loading} className="px-3 py-1 rounded bg-quoc-neon text-quoc-black font-semibold">Gửi</button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Giao dịch gần đây</h4>
              {loadingTx ? (
                <div className="text-sm text-gray-400">Đang tải...</div>
              ) : (
                <div className="space-y-2 max-h-[260px] overflow-auto">
                  {transactions.length === 0 && <div className="text-sm text-gray-400">Chưa có giao dịch</div>}
                  {transactions.map((t) => (
                    <div key={t.id} className="text-sm p-2 bg-white/2 rounded">
                      <div className="flex justify-between">
                        <div className="font-mono">{t.type}</div>
                        <div className="font-semibold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(t.amount)}</div>
                      </div>
                      <div className="text-xs text-gray-400">{t.fromAccount?.accountNumber || '—'} → {t.toAccount?.accountNumber || '—'}</div>
                      <div className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleString('vi-VN')}</div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-400">Tổng: {txTotal}</div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => { if (txPage > 1) { setTxPage((p) => p - 1); setTimeout(fetchTransactions, 0); } }} className="px-2 py-1 bg-white/5 rounded">Prev</button>
                      <div className="text-sm">{txPage}</div>
                      <button type="button" onClick={() => { if (txPage * txPageSize < txTotal) { setTxPage((p) => p + 1); setTimeout(fetchTransactions, 0); } }} className="px-2 py-1 bg-white/5 rounded">Next</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Confirm dialog */}
          {confirmOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmOpen(false)} />
              <div className="relative bg-gray-800 p-6 rounded-lg w-[420px]">
                <h4 className="font-bold mb-2">Xác nhận chuyển khoản</h4>
                <p className="text-sm">Từ: <span className="font-mono">{fromAccount}</span></p>
                <p className="text-sm">Đến: <span className="font-mono">{toAccount}</span></p>
                <p className="text-sm">Số tiền: <span className="font-semibold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(amountStr.replace(/[^0-9.-]+/g, '')))}</span></p>
                {note && <p className="text-sm">Ghi chú: {note}</p>}
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setConfirmOpen(false)} className="px-3 py-1 rounded bg-white/10">Huỷ</button>
                  <button onClick={performTransfer} className="px-3 py-1 rounded bg-quoc-neon text-quoc-black font-semibold">Xác nhận</button>
                </div>
              </div>
            </div>
          )}

          {/* Toast */}
          {toast && (
            <div className="fixed top-6 right-6 z-70 bg-green-600 text-white px-4 py-2 rounded">{toast}</div>
          )}
        </div>
      )}
    </div>
  )
}
