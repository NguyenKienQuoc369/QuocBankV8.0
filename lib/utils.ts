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