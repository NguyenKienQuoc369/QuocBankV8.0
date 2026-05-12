export function isAdminUsername(username: unknown): boolean {
  const u = typeof username === 'string' ? username.trim() : ''
  if (!u) return false

  const raw = process.env.ADMIN_USERNAMES || ''
  const list = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return list.includes(u)
}
