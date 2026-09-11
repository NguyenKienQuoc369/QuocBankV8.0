/**
 * ADQ Security Copilot - Data Masking Layer (SecOps)
 *
 * BẮT BUỘC chạy qua lớp này trước khi đưa bất kỳ dữ liệu nào vào prompt LLM.
 * Copilot chỉ cần biết "có lộ secret", KHÔNG cần biết giá trị thật.
 */

const REDACTED = '[REDACTED]'

// Các pattern secret phổ biến (AWS, JWT, private key, connection string, ...)
const SECRET_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  // AWS Access Key ID: AKIA..., ASIA...
  { name: 'AWS_ACCESS_KEY', regex: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/g },
  // AWS Secret (40 chars base64-ish) khi đi kèm từ khóa
  {
    name: 'AWS_SECRET',
    regex: /(aws_secret_access_key|AWS_SECRET_ACCESS_KEY)\s*[:=]\s*["']?[A-Za-z0-9/+=]{40}["']?/gi,
  },
  // Generic API key / token / secret assignments
  {
    name: 'GENERIC_SECRET',
    regex:
      /\b(api[_-]?key|api[_-]?secret|secret[_-]?key|access[_-]?token|auth[_-]?token|private[_-]?key|client[_-]?secret|password|passwd|pwd)\b\s*[:=]\s*["']?[^\s"']{6,}["']?/gi,
  },
  // JWT token (3 đoạn base64url)
  { name: 'JWT', regex: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g },
  // PEM private key block
  {
    name: 'PEM_KEY',
    regex: /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/g,
  },
  // Connection string có credential: postgres://user:pass@host, mongodb://..., mysql://...
  {
    name: 'CONN_STRING',
    regex: /\b(postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis|amqp):\/\/[^\s:@/]+:[^\s@/]+@/gi,
  },
  // Bearer token
  { name: 'BEARER', regex: /\bBearer\s+[A-Za-z0-9._~+/=-]{16,}\b/gi },
  // Google API key: AIza...
  { name: 'GOOGLE_API_KEY', regex: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  // Slack token: xox...
  { name: 'SLACK_TOKEN', regex: /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/g },
  // GitHub token: ghp_, gho_, github_pat_
  { name: 'GITHUB_TOKEN', regex: /\b(ghp|gho|ghu|ghs|ghr)_[0-9A-Za-z]{20,}\b|\bgithub_pat_[0-9A-Za-z_]{20,}\b/g },
  // Số thẻ (13-19 số liên tiếp hoặc nhóm 4)
  { name: 'CARD_NUMBER', regex: /\b(?:\d[ -]*?){13,19}\b/g },
  // CVV đi kèm từ khóa
  { name: 'CVV', regex: /\bcvv\b\s*[:=]\s*["']?\d{3,4}["']?/gi },
]

// Email / phone (PII)
const PII_PATTERNS: Array<{ name: string; regex: RegExp; replace: string }> = [
  { name: 'EMAIL', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, replace: '[EMAIL]' },
  { name: 'PHONE_VN', regex: /\b(?:\+?84|0)(3|5|7|8|9)\d{8}\b/g, replace: '[PHONE]' },
]

export interface MaskResult {
  masked: string
  redactionCount: number
  redactionTypes: string[]
}

/**
 * Che giấu secret + PII trong một chuỗi bất kỳ.
 */
export function maskSensitiveText(input: string): MaskResult {
  let masked = input
  let count = 0
  const types = new Set<string>()

  for (const { name, regex } of SECRET_PATTERNS) {
    masked = masked.replace(regex, (match) => {
      count++
      types.add(name)
      // Giữ lại tên biến nếu là dạng KEY=value để AI hiểu ngữ cảnh
      const kv = match.match(/^([^:=\s]+)\s*[:=]/)
      return kv ? `${kv[1]}=${REDACTED}` : REDACTED
    })
  }

  for (const { name, regex, replace } of PII_PATTERNS) {
    masked = masked.replace(regex, () => {
      count++
      types.add(name)
      return replace
    })
  }

  return { masked, redactionCount: count, redactionTypes: [...types] }
}

/**
 * Deep-mask một object JSON bất kỳ (dùng cho log/scan result trước khi gửi LLM).
 */
export function maskSensitiveDeep<T>(value: T): T {
  if (value === null || value === undefined) return value
  if (typeof value === 'string') return maskSensitiveText(value).masked as unknown as T
  if (Array.isArray(value)) return value.map((v) => maskSensitiveDeep(v)) as unknown as T
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      // Nếu tên field đã nhạy cảm thì che luôn giá trị
      if (/secret|password|token|apikey|api_key|cvv|pin|otp/i.test(k) && typeof v === 'string') {
        out[k] = REDACTED
      } else {
        out[k] = maskSensitiveDeep(v)
      }
    }
    return out as T
  }
  return value
}
