import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAccountNumber() {
  // Tạo số TK bắt đầu bằng 9, dài 10 số
  return '9' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')
}

export function generateCardNumber() {
  // Tạo thẻ Visa ảo (4532...)
  return '4532' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')
}

export function generateCVV() {
  return Math.floor(Math.random() * 900 + 100).toString()
}

export function maskCardNumber(cardNumber: string) {
  // Normalize: remove non-digits
  const digits = cardNumber.replace(/\D/g, '')
  // Split into groups of 4
  const groups = digits.match(/.{1,4}/g) || []
  if (groups.length === 0) return ''
  // Mask all but the last group
  return groups
    .map((g, i) => (i < groups.length - 1 && groups.length > 1 ? '••••' : g))
    .join(' ')
}

export function formatVND(amount: number) {
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount)
  } catch (e) {
    return amount.toString()
  }
}

export function formatRelativeTime(dateInput: string | Date) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.34524, 'week'],
    [12, 'month'],
    [Number.POSITIVE_INFINITY, 'year'],
  ]

  let duration = seconds
  for (let i = 0; i < intervals.length; i++) {
    const [divisor, unit] = intervals[i]
    if (Math.abs(duration) < divisor) {
      const rtf = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' })
      return rtf.format(-Math.round(duration), unit)
    }
    duration = Math.round(duration / divisor)
  }

  return date.toLocaleString('vi-VN')
}

export function formatDate(dateInput: string | Date) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  try {
    return date.toLocaleDateString('vi-VN')
  } catch (e) {
    return ''
  }
}