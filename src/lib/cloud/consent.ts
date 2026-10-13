/**
 * Consent for measurement and third-party ads (DESIGN-v3 §F, v3-delta EEA consent).
 *
 * - `consent.mode`: 'everywhere' (default until a lawyer says otherwise) | 'eea-only' | 'off'.
 *   Peru: DS 016-2024-JUS asks for prior, express, demonstrable consent; treated as required.
 * - An explicit choice is always respected. GPC or DNT means no measurement and no prompt.
 * - Withdrawal is one call on the same surface (a footer link reopens the card) and also forgets
 *   the measurement id.
 * - Stored under `pyarcana-consent-v1` with the text version and time; a new text version asks again.
 */
import { isPlainObject, readJson, removeKey, writeJson, type KeyValueStorage } from '@/lib/cloud/storage'
import type { ConsentMode } from '@/lib/cloud/config'

export const CONSENT_KEY = 'pyarcana-consent-v1'
/** Bump when the consent sentence changes, so everyone is asked again. */
export const CONSENT_VERSION = 2
export const MEASUREMENT_ID_KEY = 'pyarcana-exp-cid'

export type ConsentValue = 'granted' | 'denied'
export interface ConsentRecord {
  v: 1
  value: ConsentValue
  version: number
  at: string
}
export interface PrivacySignals {
  gpc: boolean
  dnt: boolean
}
export type ConsentState = 'granted' | 'denied' | 'needed' | 'not_required'

/** EU 27 + EEA (IS, LI, NO) + UK + Switzerland. */
export const CONSENT_REGION: ReadonlySet<string> = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT',
  'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
])

export function consentRequired(mode: ConsentMode, country: string | null): boolean {
  if (mode === 'off') return false
  if (mode === 'everywhere' || !country) return true
  return CONSENT_REGION.has(country.toUpperCase())
}

export function readConsent(storage: KeyValueStorage | null): ConsentRecord | null {
  const raw = readJson(storage, CONSENT_KEY)
  if (!isPlainObject(raw) || raw.v !== 1 || raw.version !== CONSENT_VERSION) return null
  if (raw.value !== 'granted' && raw.value !== 'denied') return null
  return { v: 1, value: raw.value, version: CONSENT_VERSION, at: typeof raw.at === 'string' ? raw.at : '' }
}

export function consentState(mode: ConsentMode, record: ConsentRecord | null, country: string | null): ConsentState {
  if (record) return record.value
  return consentRequired(mode, country) ? 'needed' : 'not_required'
}

export function canMeasure(mode: ConsentMode, record: ConsentRecord | null, signals: PrivacySignals, country: string | null): boolean {
  if (signals.gpc || signals.dnt) return false
  const state = consentState(mode, record, country)
  return state === 'granted' || state === 'not_required'
}

export function shouldAskConsent(mode: ConsentMode, record: ConsentRecord | null, signals: PrivacySignals, country: string | null): boolean {
  return !signals.gpc && !signals.dnt && consentState(mode, record, country) === 'needed'
}

export function recordConsent(storage: KeyValueStorage | null, value: ConsentValue, nowMs: number): ConsentRecord {
  const record: ConsentRecord = { v: 1, value, version: CONSENT_VERSION, at: new Date(nowMs).toISOString() }
  writeJson(storage, CONSENT_KEY, record)
  return record
}

export function withdrawConsent(storage: KeyValueStorage | null, nowMs: number): ConsentRecord {
  const record = recordConsent(storage, 'denied', nowMs)
  removeKey(storage, MEASUREMENT_ID_KEY)
  return record
}

export function readPrivacySignals(nav: { globalPrivacyControl?: unknown; doNotTrack?: unknown } | undefined): PrivacySignals {
  return {
    gpc: nav?.globalPrivacyControl === true,
    dnt: nav?.doNotTrack === '1' || nav?.doNotTrack === 'yes',
  }
}
