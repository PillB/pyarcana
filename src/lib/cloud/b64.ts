/**
 * base64url (RFC 4648 §5, no padding), UTF-8 and SHA-256 helpers shared by the cloud modules.
 *
 * Decoding is strict on purpose: licence tokens, OIDC values and the #import= handoff all arrive
 * from outside, and a lax decoder accepts several spellings of one value (padding, the standard
 * alphabet, non-zero trailing bits), which lets a tampered token compare equal to a genuine one.
 */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
const LOOKUP: Record<string, number> = Object.fromEntries([...ALPHABET].map((c, i) => [c, i]))

export type Bytes = Uint8Array<ArrayBuffer>

export function bytesToB64url(bytes: Uint8Array): string {
  let out = ''
  for (let i = 0; i < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0)
    const chars = Math.min(4, Math.ceil(((bytes.length - i) * 8) / 6))
    for (let c = 0; c < chars; c++) out += ALPHABET[(n >> (18 - 6 * c)) & 63]
  }
  return out
}

/** Decode strict base64url; null for any character, length or trailing-bit irregularity. */
export function b64urlToBytes(text: string): Bytes | null {
  if (typeof text !== 'string' || text.length % 4 === 1) return null
  const values: number[] = []
  for (const ch of text) {
    const v = LOOKUP[ch]
    if (v === undefined) return null
    values.push(v)
  }
  const out = new Uint8Array(Math.floor((values.length * 6) / 8))
  let buffer = 0
  let bits = 0
  let j = 0
  for (const v of values) {
    buffer = (buffer << 6) | v
    bits += 6
    if (bits >= 8) {
      bits -= 8
      out[j++] = (buffer >> bits) & 255
    }
  }
  // Leftover bits must be zero, otherwise two strings decode to the same bytes.
  return (buffer & ((1 << bits) - 1)) === 0 ? out : null
}

export function utf8(text: string): Bytes {
  return new TextEncoder().encode(text) as Bytes
}

export function fromUtf8(bytes: Uint8Array): string {
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
}

export function randomBytes(length: number): Bytes {
  const out = new Uint8Array(length)
  globalThis.crypto.getRandomValues(out)
  return out
}

export function randomB64url(length = 32): string {
  return bytesToB64url(randomBytes(length))
}

/** base64url(SHA-256(UTF-8 bytes of text)). */
export async function sha256B64url(text: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', utf8(text))
  return bytesToB64url(new Uint8Array(digest))
}
