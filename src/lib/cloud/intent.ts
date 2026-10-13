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

export type TrialIntentOutcome = 'none' | 'start' | 'unavailable'

/**
 * Take the pending trial intent and decide what happens now. A page that is navigating away (the
 * Microsoft callback on /cuenta, right before location.replace(returnTo)) must leave it: the unload
 * would abort the POST, and the return page would find nothing to resume. 'unavailable': the
 * learner was promised a trial at sign-in and this account cannot have one, so the page says so
 * instead of dropping it silently. Already Pro: nothing to start and nothing to explain.
 */
export function trialIntentOutcome(storage: KeyValueStorage | null, me: MePayload | null, nowMs: number, leaving: boolean): TrialIntentOutcome {
  if (leaving) return 'none'
  const intent = takeIntent(storage, nowMs)
  if (intent?.kind !== 'trial' || me === null || me.access.isPro) return 'none'
  return me.account.trialAvailable ? 'start' : 'unavailable'
}

export function claimTrialIntent(storage: KeyValueStorage | null, me: MePayload | null, nowMs: number, leaving: boolean): boolean {
  return trialIntentOutcome(storage, me, nowMs, leaving) === 'start'
}
