export type TransferFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | string

export type TransferStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | string

export interface ScheduledTransferInfo {
  id: string
  frequency: TransferFrequency
  runCount: number
  status: TransferStatus
  amount: number
  toAccountName: string
  toAccountNumber: string
  message?: string
  startDate: string
  endDate?: string | null
  nextRunDate: string
  lastRunAt?: string | null
}

export type { ScheduledTransferInfo as default }
