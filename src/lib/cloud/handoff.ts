/**
 * Moving progress from an old origin (pillb.github.io/pyarcana) to the canonical origin
 * (DESIGN-v2 §8.7, v3 §A). localStorage belongs to one origin, so without this every learner
 * would arrive at the new address with 0/52.
 *
 * Old origin: the "PyArcana se mudó" banner opens `<canonical>/#import=<base64url(envelope)>`.
 * The fragment never reaches any server. Canonical origin: the fragment is decoded, size-checked
 * (<= 64 KiB), sanitized and migrated, MERGED into local progress (never a replace), and removed
 * from the address bar with history.replaceState.
 */
import { parsePersistedEnvelope, serializeProgressEnvelope } from '@/lib/progress-sanitize'
import { b64urlToBytes, bytesToB64url, fromUtf8, utf8 } from '@/lib/cloud/b64'
import { normalizeOrigin } from '@/lib/cloud/config'
import { cleanIncomingState, unionInto, type ChangeLog, type ProgressState, type UnionResult } from '@/lib/cloud/progress-merge'

export const IMPORT_PREFIX = '#import='
export const HANDOFF_MAX_BYTES = 64 * 1024
const MAX_ENCODED = Math.ceil((HANDOFF_MAX_BYTES * 4) / 3)

export type EncodeResult = { ok: true; payload: string } | { ok: false; reason: 'empty' | 'unreadable' | 'too_large' }

/** base64url of the stored envelope, re-serialized from its sanitized state. */
export function encodeHandoff(rawEnvelope: string | null): EncodeResult {
  const parsed = parsePersistedEnvelope(rawEnvelope)
  if (!parsed.ok) return { ok: false, reason: 'unreadable' }
  if (parsed.reason === 'empty') return { ok: false, reason: 'empty' }
  const bytes = utf8(serializeProgressEnvelope(parsed.state, parsed.version))
  if (bytes.length > HANDOFF_MAX_BYTES) return { ok: false, reason: 'too_large' }
  return { ok: true, payload: bytesToB64url(bytes) }
}

export type BuildResult = { ok: true; url: string } | { ok: false; reason: 'no_canonical' | 'empty' | 'unreadable' | 'too_large' }

export function buildHandoffUrl(canonicalOrigin: string, rawEnvelope: string | null): BuildResult {
  const origin = normalizeOrigin(canonicalOrigin)
  if (!origin) return { ok: false, reason: 'no_canonical' }
  const encoded = encodeHandoff(rawEnvelope)
  if (!encoded.ok) return encoded
  return { ok: true, url: `${origin}/${IMPORT_PREFIX}${encoded.payload}` }
}

export type DecodeResult =
  | { ok: true; state: Partial<ProgressState> }
  | { ok: false; reason: 'none' | 'too_large' | 'malformed' | 'empty' }

export function decodeHandoff(hash: string): DecodeResult {
  if (!hash.startsWith(IMPORT_PREFIX)) return { ok: false, reason: 'none' }
  const payload = hash.slice(IMPORT_PREFIX.length)
  if (payload.length > MAX_ENCODED) return { ok: false, reason: 'too_large' }
  const bytes = b64urlToBytes(payload)
  if (!bytes) return { ok: false, reason: 'malformed' }
  const parsed = parsePersistedEnvelope(fromUtf8(bytes))
  if (!parsed.ok) return { ok: false, reason: 'malformed' }
  if (parsed.reason === 'empty') return { ok: false, reason: 'empty' }
  return { ok: true, state: cleanIncomingState(parsed.state, parsed.version) }
}

/** Union only: what this origin has stays; what the old origin had is added and recorded. */
export function applyHandoff(local: ProgressState, localChanges: ChangeLog, incoming: Partial<ProgressState>, nowMs: number): UnionResult {
  return unionInto(local, localChanges, incoming, nowMs)
}

/** The address to put back with history.replaceState: same path and query, no fragment. */
export function stripImportFragment(href: string): string {
  const url = new URL(href)
  return url.pathname + url.search
}
