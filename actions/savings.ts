export type SavingsTerm =
  | 'FLEXIBLE'
  | 'FIXED_1M'
  | 'FIXED_3M'
  | 'FIXED_6M'
  | 'FIXED_12M'
  | string

export type SavingsStatus = 'ACTIVE' | 'CLOSED' | 'COMPLETED' | string

export interface SavingsAccountInfo {
  id: string
  savingsType: SavingsTerm
  interestRate: number
  startDate: string
  maturityDate: string | null
  daysRemaining: number | null
  status: SavingsStatus
  balance: number
  estimatedInterest: number
  autoRenew?: boolean
}

export type { SavingsAccountInfo as default }
