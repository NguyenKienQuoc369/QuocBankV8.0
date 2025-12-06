export type NotificationInfo = {
  id: string
  title: string
  message?: string
  type: string
  isRead: boolean
  createdAt: string
}

export async function getNotifications(limit = 10): Promise<NotificationInfo[]> {
  try {
    const res = await fetch(`/api/notifications?limit=${limit}`, { cache: 'no-store' })
    if (!res.ok) return []
    return (await res.json()) as NotificationInfo[]
  } catch (e) {
    return []
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const res = await fetch('/api/notifications/unread-count', { cache: 'no-store' })
    if (!res.ok) return 0
    const data = await res.json()
    return data?.count ?? 0
  } catch (e) {
    return 0
  }
}

export async function markAsRead(id: string): Promise<boolean> {
  try {
    const res = await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    return res.ok
  } catch (e) {
    return false
  }
}

export async function markAllAsRead(): Promise<boolean> {
  try {
    const res = await fetch('/api/notifications/mark-all-read', { method: 'POST' })
    return res.ok
  } catch (e) {
    return false
  }
}
