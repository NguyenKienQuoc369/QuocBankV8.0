export type QRResult = {
  success: boolean
  qrCode?: string // data URL
  data?: any
  error?: string
}

export async function generateStaticQRCode(): Promise<QRResult> {
  try {
    const res = await fetch('/api/qr/static', { method: 'POST' })
    if (!res.ok) return { success: false, error: 'Failed' }
    return (await res.json()) as QRResult
  } catch (e: any) {
    return { success: false, error: e?.message }
  }
}

export async function generateDynamicQRCode(amount: number, message?: string): Promise<QRResult> {
  try {
    const res = await fetch('/api/qr/dynamic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, message }),
    })
    if (!res.ok) return { success: false, error: 'Failed' }
    return (await res.json()) as QRResult
  } catch (e: any) {
    return { success: false, error: e?.message }
  }
}
