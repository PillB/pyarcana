/**
 * Feedback API guards: sanitize + in-memory rate limit (pure, injectable clock).
 */

export const FEEDBACK_TYPES = ['BUG', 'IDEA', 'RECOMMENDATION', 'OTHER'] as const
export type FeedbackType = (typeof FEEDBACK_TYPES)[number]

export const FEEDBACK_WINDOW_MS = 15 * 60 * 1000
export const FEEDBACK_MAX_REQ = 8

export function sanitizeFeedbackText(s: string): string {
  if (typeof s !== 'string') return ''
  // Strip C0 control chars except tab/newline handled by replace set
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim()
}

export type RateLimitStore = Map<string, { count: number; resetAt: number }>

/**
 * Sliding fixed-window rate limiter.
 * Returns true if allowed, false if over limit.
 */
export function checkRateLimit(
  key: string,
  store: RateLimitStore,
  opts: {
    now?: number
    windowMs?: number
    maxReq?: number
  } = {}
): boolean {
  if (!key || typeof key !== 'string') return false
  const now = opts.now ?? Date.now()
  const windowMs = opts.windowMs ?? FEEDBACK_WINDOW_MS
  const maxReq = opts.maxReq ?? FEEDBACK_MAX_REQ
  if (!Number.isFinite(windowMs) || windowMs <= 0) return false
  if (!Number.isFinite(maxReq) || maxReq < 1) return false

  const entry = store.get(key)
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= maxReq) return false
  entry.count++
  return true
}

/** Normalize client IP from x-forwarded-for (first hop). */
export function clientIpFromForwarded(header: string | null | undefined): string {
  if (!header || typeof header !== 'string') return 'unknown'
  const first = header.split(',')[0]?.trim()
  if (!first) return 'unknown'
  // Bound length to avoid store key exhaustion
  return first.slice(0, 128)
}

export function isValidFeedbackType(t: unknown): t is FeedbackType {
  return typeof t === 'string' && (FEEDBACK_TYPES as readonly string[]).includes(t)
}
