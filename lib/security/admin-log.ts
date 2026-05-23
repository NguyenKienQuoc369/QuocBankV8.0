import { writeSecurityLog, type SecuritySeverity } from '@/lib/security/log'

type AdminSecuritySeverity = SecuritySeverity | 'INFO' | 'WARNING'

type AdminSecurityEvent = {
  employeeId: string
  action: string
  ipAddress?: string
  userAgent?: string
  severity?: AdminSecuritySeverity
  status?: string
  metadata?: Record<string, unknown>
}

export async function logAdminSecurityEvent(event: AdminSecurityEvent) {
  return writeSecurityLog({
    action: event.action,
    severity: (event.severity ?? 'LOW') as any,
    status: event.status,
    ipAddress: event.ipAddress,
    userAgent: event.userAgent,
    metadata: {
      employeeId: event.employeeId,
      ...(event.metadata || {}),
    },
  })
}
