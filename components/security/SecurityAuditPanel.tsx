'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

type LogRow = {
  id: string
  createdAt: string
  userId?: string | null
  action: string
  severity: string
  status?: string | null
  ipAddress?: string | null
  requestPath?: string | null
}

export default function SecurityAuditPanel({ initialLogs }: { initialLogs: LogRow[] }) {
  const [logs, setLogs] = useState<LogRow[]>(initialLogs)
  const [series, setSeries] = useState<Array<{ hour: string; count: number }>>([])

  useEffect(() => {
    let alive = true
    async function tick() {
      const res = await fetch('/api/security/logs?take=100&sinceHours=24', {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
        cache: 'no-store',
      })
      if (!res.ok) return
      const json = await res.json()
      if (!alive || !json?.success) return
      setLogs(
        (json.logs as any[]).map((l) => ({
          ...l,
          createdAt: new Date(l.createdAt).toISOString(),
        }))
      )
      setSeries(json.series || [])
    }

    tick()
    const id = setInterval(tick, 10_000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  const chartData = useMemo(() => {
    return series.map((p) => ({
      hour: new Date(p.hour).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      count: p.count,
    }))
  }, [series])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Tần suất sự kiện (24h)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="qbGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(34,211,238)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="rgb(34,211,238)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: 'rgba(2,6,23,0.9)', border: '1px solid rgba(255,255,255,0.12)' }} />
              <Area type="monotone" dataKey="count" stroke="rgb(34,211,238)" fill="url(#qbGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Log (mới nhất)</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Severity</th>
                <th className="py-2 pr-4">Action</th>
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">IP</th>
                <th className="py-2 pr-4">Path</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-t border-white/5 text-gray-200">
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {new Date(l.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    <span
                      className={
                        l.severity === 'CRITICAL'
                          ? 'text-red-400 font-bold'
                          : l.severity === 'HIGH'
                            ? 'text-orange-300 font-bold'
                            : 'text-gray-300'
                      }
                    >
                      {l.severity}
                    </span>
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs">{l.action}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{l.userId || '-'}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{l.ipAddress || '-'}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{l.requestPath || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
