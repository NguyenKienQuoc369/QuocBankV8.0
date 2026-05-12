const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g

export function sanitizeText(input: unknown, maxLen = 500): string {
  const s = String(input ?? '')
  // Plain-text policy: strip control chars and angle brackets to avoid HTML injection.
  const cleaned = s.replace(CONTROL_CHARS, '').replace(/[<>]/g, '').trim()
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) : cleaned
}

export function looksLikeScriptPayload(input: unknown): boolean {
  const s = String(input ?? '').toLowerCase()
  return (
    s.includes('<script') ||
    s.includes('javascript:') ||
    s.includes('onerror=') ||
    s.includes('onload=') ||
    s.includes('document.cookie') ||
    s.includes('window.location')
  )
}
