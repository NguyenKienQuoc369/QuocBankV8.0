import { AsyncLocalStorage } from 'node:async_hooks'

export type SecurityContext = {
  userId?: string
  ipAddress?: string
  userAgent?: string
  fingerprint?: string
  location?: string
  requestPath?: string
  requestMethod?: string
  requestId?: string
  disableAutoLog?: boolean
}

const storage = new AsyncLocalStorage<SecurityContext>()

export function runWithSecurityContext<T>(ctx: SecurityContext, fn: () => T): T {
  return storage.run(ctx, fn)
}

export function getSecurityContext(): SecurityContext | undefined {
  return storage.getStore()
}

export function runWithAutoLogDisabled<T>(fn: () => T): T {
  const current = storage.getStore() || {}
  return storage.run({ ...current, disableAutoLog: true }, fn)
}
