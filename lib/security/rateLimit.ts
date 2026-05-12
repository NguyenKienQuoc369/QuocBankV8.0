type Bucket = { count: number; resetAt: number }

const globalForRateLimit = globalThis as unknown as {
  __qbRateLimit?: Map<string, Bucket>
}

const store = globalForRateLimit.__qbRateLimit || new Map<string, Bucket>()
if (!globalForRateLimit.__qbRateLimit) globalForRateLimit.__qbRateLimit = store

export type RateLimitResult = {
  ok: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { ok: true, remaining: limit - 1, resetAt }
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count += 1
  store.set(key, entry)
  return { ok: true, remaining: Math.max(0, limit - entry.count), resetAt: entry.resetAt }
}

export function makeRateLimitKey(parts: Array<string | undefined | null>): string {
  return parts.filter(Boolean).join(':')
}
