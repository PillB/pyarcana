export const MAX_REGISTRATION_BODY_BYTES = 8_192
export const REGISTRATION_WINDOW_MS = 15 * 60 * 1_000
export const REGISTRATION_MAX_ATTEMPTS = 5
export const REGISTRATION_MAX_BUCKETS = 5_000

type RateEntry = {
  count: number
  resetAt: number
}

/**
 * A small, bounded limiter for a single Node process. A shared store or edge
 * gateway is still required when the LMS runs on more than one instance.
 */
export class BoundedRateLimiter {
  private readonly entries = new Map<string, RateEntry>()

  constructor(
    private readonly maxAttempts: number,
    private readonly windowMs: number,
    private readonly maxBuckets: number
  ) {}

  allow(key: string, now = Date.now()): boolean {
    this.prune(now)
    const existing = this.entries.get(key)

    if (existing) {
      if (existing.count >= this.maxAttempts) return false
      existing.count += 1
      return true
    }

    // Fail closed for unseen keys when the bounded map is full. This prevents
    // spoofed high-cardinality headers from turning the limiter into a leak.
    if (this.entries.size >= this.maxBuckets) return false

    this.entries.set(key, { count: 1, resetAt: now + this.windowMs })
    return true
  }

  get size(): number {
    return this.entries.size
  }

  private prune(now: number): void {
    for (const [key, entry] of this.entries) {
      if (entry.resetAt <= now) this.entries.delete(key)
    }
  }
}

export const registrationLimiter = new BoundedRateLimiter(
  REGISTRATION_MAX_ATTEMPTS,
  REGISTRATION_WINDOW_MS,
  REGISTRATION_MAX_BUCKETS
)

export class RegistrationRequestError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message)
    this.name = 'RegistrationRequestError'
  }
}

export function clientRateKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = request.headers.get('x-real-ip')?.trim()
  const candidate = forwarded || realIp || 'unknown'

  // Header values are untrusted. Keep a stable, bounded key and discard control
  // characters rather than reflecting the raw value into memory or logs.
  const safe = candidate.replace(/[^0-9a-fA-F:.]/g, '').slice(0, 64)
  return safe || 'unknown'
}

export async function readBoundedJson(request: Request): Promise<unknown> {
  const contentType = request.headers.get('content-type')?.toLowerCase() || ''
  if (!contentType.startsWith('application/json')) {
    throw new RegistrationRequestError('Content-Type debe ser application/json', 415)
  }

  const declaredLength = request.headers.get('content-length')
  if (declaredLength) {
    const parsedLength = Number(declaredLength)
    if (!Number.isFinite(parsedLength) || parsedLength < 0) {
      throw new RegistrationRequestError('Content-Length inválido', 400)
    }
    if (parsedLength > MAX_REGISTRATION_BODY_BYTES) {
      throw new RegistrationRequestError('Solicitud demasiado grande', 413)
    }
  }

  const reader = request.body?.getReader()
  const decoder = new TextDecoder()
  let byteLength = 0
  let raw = ''

  if (reader) {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      byteLength += value.byteLength
      if (byteLength > MAX_REGISTRATION_BODY_BYTES) {
        await reader.cancel()
        throw new RegistrationRequestError('Solicitud demasiado grande', 413)
      }
      raw += decoder.decode(value, { stream: true })
    }
    raw += decoder.decode()
  }

  try {
    return JSON.parse(raw)
  } catch {
    throw new RegistrationRequestError('JSON inválido', 400)
  }
}
