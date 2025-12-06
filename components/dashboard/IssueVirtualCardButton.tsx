'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Loader2 } from 'lucide-react'

export default function IssueVirtualCardButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleIssue = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/cards/issue', {
        method: 'POST',
      })
      const data = await res.json()
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Không thể phát hành thẻ')
      }
      // Refresh the server component list
      router.refresh()
    } catch (e: any) {
      // Minimal UX: alert. Could be replaced by a toast system.
      alert(e?.message || 'Lỗi khi phát hành thẻ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleIssue}
      disabled={loading}
      className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-xl border border-indigo-500/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
      aria-disabled={loading}
      aria-busy={loading}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
      {loading ? 'Đang phát hành...' : 'Phát hành thẻ ảo'}
    </button>
  )
}
