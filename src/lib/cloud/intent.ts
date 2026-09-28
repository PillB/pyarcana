/**
 * What the learner was doing when sign-in interrupted it (DESIGN-v2 review, launch sequence):
 * "Probar 7 días" pressed while signed out signs in first and then starts the trial, on the same
 * section. Stored in sessionStorage (this tab only; it survives the Microsoft redirect), single use,
 * and dropped after 30 minutes so an old click never starts a trial by surprise.
 */
import { isPlainObject, readJson, removeKey, writeJson, type KeyValueStorage } from '@/lib/cloud/storage'
import type { MePayload } from '@/lib/cloud/session'

export const INTENT_KEY = 'pyarcana-intent-v1'
export const INTENT_MAX_AGE_MS = 30 * 60 * 1000

export interface Intent {
  kind: 'trial'
  sectionId: string | null
  at: number
}

export function saveIntent(storage: KeyValueStorage | null, intent: Omit<Intent, 'at'>, nowMs: number): void {
  writeJson(storage, INTENT_KEY, { kind: intent.kind, sectionId: intent.sectionId, at: nowMs })
}

export function peekIntent(storage: KeyValueStorage | null, nowMs: number): Intent | null {
  const raw = readJson(storage, INTENT_KEY)
  if (!isPlainObject(raw) || raw.kind !== 'trial' || typeof raw.at !== 'number') return null
  if (nowMs - raw.at > INTENT_MAX_AGE_MS || nowMs < raw.at) return null
  const sectionId = typeof raw.sectionId === 'string' ? raw.sectionId : null
  return { kind: 'trial', sectionId, at: raw.at }
}

export function takeIntent(storage: KeyValueStorage | null, nowMs: number): Intent | null {
  const intent = peekIntent(storage, nowMs)
  removeKey(storage, INTENT_KEY)
  return intent
}

export function shouldResumeTrial(intent: Intent | null, me: MePayload | null): boolean {
  return intent?.kind === 'trial' && me !== null && me.account.trialAvailable && !me.access.isPro
}
