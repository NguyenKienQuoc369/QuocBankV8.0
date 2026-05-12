import DOMPurify from 'isomorphic-dompurify'

// Use this only when you truly need to render HTML. Prefer plain-text fields.
export function sanitizeHtml(dirty: string) {
  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
  })
}
