/**
 * The consent record the worker keeps (DESIGN-v3 §F): "On sign-in it is sent to the worker
 * (consents table: account_id, kind, value, version, at) as the record."
 *
 * - What is sent is the choice stored in this browser (consent.ts), unchanged: kind 'measurement',
 *   value granted|denied, the text version it answered, and when.
 * - Sent once per (account, choice): a marker remembers the last record the worker accepted for
 *   each account, so a later withdrawal or a second account is sent again and a reload is not.
 * - Only a 2xx counts. A worker without the route (404) or offline leaves nothing marked, so the
 *   record goes on the next signed-in load. Contract: decisions.md D-CLIENT-CONSENT.
 */
import type { ApiClient } from '@/lib/cloud/api'
import { readConsent } from '@/lib/cloud/consent'
import { isPlainObject, readJson, writeJson, type KeyValueStorage } from '@/lib/cloud/storage'

export const CONSENT_SENT_KEY = 'pyarcana-consent-sent-v1'
export const CONSENT_PATH = '/v1/me/consents'

export interface ConsentUpload {
  kind: 'measurement'
  value: 'granted' | 'denied'
  version: number
  at: string
}

function sentMarker(storage: KeyValueStorage | null): Record<string, unknown> {
  const raw = readJson(storage, CONSENT_SENT_KEY)
  return isPlainObject(raw) ? raw : {}
}

const fingerprint = (u: ConsentUpload) => `${u.value}|${u.version}|${u.at}`

/** The record to send for this account, or null (no choice stored, or this one already sent). */
export function consentUpload(storage: KeyValueStorage | null, accountId: string): ConsentUpload | null {
  const record = readConsent(storage)
  if (!record) return null
  const upload: ConsentUpload = { kind: 'measurement', value: record.value, version: record.version, at: record.at }
  return sentMarker(storage)[accountId] === fingerprint(upload) ? null : upload
}

/** POST the record; true only when the worker stored it (and it is now marked as sent). */
export async function sendConsentRecord(api: Pick<ApiClient, 'post'>, storage: KeyValueStorage | null, accountId: string): Promise<boolean> {
  const upload = consentUpload(storage, accountId)
  if (!upload) return false
  const r = await api.post(CONSENT_PATH, upload)
  if (!r.ok) return false
  writeJson(storage, CONSENT_SENT_KEY, { ...sentMarker(storage), [accountId]: fingerprint(upload) })
  return true
}
