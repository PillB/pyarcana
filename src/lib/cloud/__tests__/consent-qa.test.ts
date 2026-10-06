import test from 'node:test'
import assert from 'node:assert/strict'
import {
  consentRequired,
  consentState,
  canMeasure,
  shouldAskConsent,
  recordConsent,
  readConsent,
  withdrawConsent,
  readPrivacySignals,
  CONSENT_KEY,
  CONSENT_VERSION,
} from '@/lib/cloud/consent'
import { readQaMode, writeQaMode, QA_MODE_KEY } from '@/lib/cloud/qa-mode'
import { createMemoryStorage } from '@/lib/cloud/storage'

const none = { gpc: false, dnt: false }
const NOW = Date.parse('2026-09-28T12:00:00Z')

test('consent mode decides where consent is required; an unknown country counts as requiring it', () => {
  assert.equal(consentRequired('everywhere', 'PE'), true)
  assert.equal(consentRequired('off', 'DE'), false)
  for (const c of ['DE', 'es', 'NO', 'IS', 'LI', 'GB', 'CH']) assert.equal(consentRequired('eea-only', c), true, c)
  for (const c of ['PE', 'US', 'MX']) assert.equal(consentRequired('eea-only', c), false, c)
  assert.equal(consentRequired('eea-only', null), true)
})

test('an explicit choice is always respected, required or not', () => {
  const storage = createMemoryStorage()
  assert.equal(consentState('everywhere', readConsent(storage), 'PE'), 'needed')
  recordConsent(storage, 'denied', NOW)
  assert.equal(consentState('everywhere', readConsent(storage), 'PE'), 'denied')
  assert.equal(consentState('off', readConsent(storage), 'PE'), 'denied')
  recordConsent(storage, 'granted', NOW + 1)
  assert.equal(consentState('everywhere', readConsent(storage), 'PE'), 'granted')
  assert.equal(consentState('eea-only', null, 'PE'), 'not_required')
})

test('the stored record carries its text version and time; a new text version asks again', () => {
  const storage = createMemoryStorage()
  const rec = recordConsent(storage, 'granted', NOW)
  assert.deepEqual(JSON.parse(storage.getItem(CONSENT_KEY)!), { v: 1, value: 'granted', version: CONSENT_VERSION, at: '2026-09-28T12:00:00.000Z' })
  assert.equal(rec.value, 'granted')
  storage.setItem(CONSENT_KEY, JSON.stringify({ v: 1, value: 'granted', version: CONSENT_VERSION - 1, at: 'x' }))
  assert.equal(readConsent(storage), null)
  storage.setItem(CONSENT_KEY, '{"v":1,"value":"maybe","version":1}')
  assert.equal(readConsent(storage), null)
})

test('GPC or DNT means no measurement and no consent prompt, even after a yes', () => {
  const granted = { v: 1 as const, value: 'granted' as const, version: CONSENT_VERSION, at: '' }
  assert.equal(canMeasure('everywhere', granted, none, 'PE'), true)
  assert.equal(canMeasure('everywhere', granted, { gpc: true, dnt: false }, 'PE'), false)
  assert.equal(canMeasure('off', null, { gpc: false, dnt: true }, 'PE'), false)
  assert.equal(canMeasure('off', null, none, 'PE'), true)
  assert.equal(canMeasure('everywhere', null, none, 'PE'), false)
  assert.equal(shouldAskConsent('everywhere', null, none, 'PE'), true)
  assert.equal(shouldAskConsent('everywhere', null, { gpc: true, dnt: false }, 'PE'), false)
  assert.equal(shouldAskConsent('everywhere', granted, none, 'PE'), false)
})

test('withdrawing is one call: it records the no and forgets the measurement id', () => {
  const storage = createMemoryStorage({ 'pyarcana-exp-cid': 'abc', 'python-ds-progress': '{}' })
  recordConsent(storage, 'granted', NOW)
  withdrawConsent(storage, NOW + 5)
  assert.equal(readConsent(storage)!.value, 'denied')
  assert.equal(storage.getItem('pyarcana-exp-cid'), null)
  assert.equal(storage.getItem('python-ds-progress'), '{}')
})

test('privacy signals are read from the browser as sent', () => {
  assert.deepEqual(readPrivacySignals({ globalPrivacyControl: true }), { gpc: true, dnt: false })
  assert.deepEqual(readPrivacySignals({ doNotTrack: '1' }), { gpc: false, dnt: true })
  assert.deepEqual(readPrivacySignals({ doNotTrack: 'yes' }), { gpc: false, dnt: true })
  assert.deepEqual(readPrivacySignals({ doNotTrack: 'unspecified' }), none)
  assert.deepEqual(readPrivacySignals({ globalPrivacyControl: 'true' as unknown as boolean }), none)
  assert.deepEqual(readPrivacySignals(undefined), none)
})

test('QA mode and ad preview are off unless explicitly switched on', () => {
  const storage = createMemoryStorage()
  assert.deepEqual(readQaMode(storage), { testMode: false, adPreview: false })
  assert.deepEqual(readQaMode(null), { testMode: false, adPreview: false })
  writeQaMode(storage, { testMode: true }, NOW)
  assert.deepEqual(readQaMode(storage), { testMode: true, adPreview: false })
  writeQaMode(storage, { adPreview: true }, NOW)
  assert.deepEqual(readQaMode(storage), { testMode: true, adPreview: true })
  writeQaMode(storage, { testMode: false }, NOW)
  assert.deepEqual(readQaMode(storage), { testMode: false, adPreview: true })
  storage.setItem(QA_MODE_KEY, '{"v":1,"testMode":"yes","adPreview":1}')
  assert.deepEqual(readQaMode(storage), { testMode: false, adPreview: false })
})
