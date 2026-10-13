import test from 'node:test'
import assert from 'node:assert/strict'
import {
  signedInFrom,
  staticNoticeKey,
  staticNoticeText,
  movedState,
  consentCardMode,
  sectionGateState,
} from '@/lib/cloud/ui-state'
import { CLOUD_CONFIG, type CloudConfig } from '@/lib/cloud/config'
import { t, type Language } from '@/lib/i18n'
import type { GrandfatherSnapshot } from '@/lib/cloud/gate'

const LANGS: Language[] = ['es-PE', 'es-ES', 'en']
const CANON = 'https://pyarcana.example'

// --- useIsSignedIn ----------------------------------------------------------------------------

test('signed in = a NextAuth user OR a cloud account, and the cloud counts only when the stage is on', () => {
  assert.equal(signedInFrom({ nextAuthUser: { name: 'Ana' }, stage: 'off', cloudAccountId: null }), true)
  assert.equal(signedInFrom({ nextAuthUser: null, stage: 'sync', cloudAccountId: 'acct_1' }), true)
  // A cached cloud account on an origin where accounts do not run (github.io) is not a session.
  assert.equal(signedInFrom({ nextAuthUser: null, stage: 'off', cloudAccountId: 'acct_1' }), false)
  assert.equal(signedInFrom({ nextAuthUser: undefined, stage: 'paid', cloudAccountId: null }), false)
  assert.equal(signedInFrom({ nextAuthUser: null, stage: 'beta', cloudAccountId: '' }), false)
})

// --- static-site notice -----------------------------------------------------------------------

test('the static notice states the truth for the stage this page load runs at', () => {
  assert.equal(staticNoticeKey('off', false), 'notice.static.off')
  assert.equal(staticNoticeKey('off', true), 'notice.static.offFirebase')
  assert.equal(staticNoticeKey('sync', false), 'notice.static.sync')
  assert.equal(staticNoticeKey('beta', false), 'notice.static.gated')
  assert.equal(staticNoticeKey('paid', true), 'notice.static.gated')
})

test('every notice exists in all three languages and drops the false claims of the old text', () => {
  for (const stage of ['off', 'sync', 'beta', 'paid'] as const) {
    for (const firebase of [false, true]) {
      for (const lang of LANGS) {
        const text = staticNoticeText(stage, firebase, lang, 5)
        const key = staticNoticeKey(stage, firebase)
        assert.notEqual(t(key, lang), key, `${key} missing for ${lang}`)
        // The old text called the site read-only and promised sync "when Firebase is configured".
        assert.doesNotMatch(text, /solo lectura|read-only|Firebase|GitHub Pages/i, `${stage}/${lang}`)
        assert.doesNotMatch(text, /\{\w+\}/, `unfilled placeholder in ${stage}/${lang}`)
      }
    }
  }
})

test('the stage-off notice says progress stays in this browser; the gated notice names the free sections', () => {
  assert.match(staticNoticeText('off', false, 'es-PE', 5), /solo en este navegador/)
  assert.match(staticNoticeText('off', false, 'en', 5), /only in this browser/)
  assert.doesNotMatch(staticNoticeText('off', false, 'es-PE', 5), /cuenta y puedes|Pro/)
  assert.match(staticNoticeText('beta', false, 'es-PE', 5), /1 a 5/)
  assert.match(staticNoticeText('beta', false, 'es-PE', 5), /\b6\b/)
  assert.match(staticNoticeText('paid', false, 'en', 5), /1 to 5/)
  assert.match(staticNoticeText('paid', false, 'en', 7), /1 to 7/)
})

// --- moved banner / handoff import --------------------------------------------------------------

const moved = (p: Partial<Parameters<typeof movedState>[0]> = {}) =>
  movedState({ origin: 'https://pillb.github.io', isStaticSite: true, canonicalOrigin: CANON, movedToCanonical: true, hash: '', ...p })

test('the moved banner shows only on a non-canonical static origin once the owner confirms the move', () => {
  assert.equal(moved(), 'banner')
  assert.equal(moved({ movedToCanonical: false }), 'none', 'never point users at a site not confirmed live')
  assert.equal(moved({ canonicalOrigin: '' }), 'none')
  assert.equal(moved({ canonicalOrigin: 'not a url' }), 'none')
  assert.equal(moved({ isStaticSite: false }), 'none', 'the dynamic LMS never shows it')
  assert.equal(moved({ origin: CANON }), 'none')
})

test('the canonical origin imports only an #import= fragment, and only once the move is confirmed', () => {
  assert.equal(moved({ origin: CANON, hash: '#import=abc' }), 'import')
  assert.equal(moved({ origin: CANON, hash: '#import=abc', movedToCanonical: false }), 'none')
  assert.equal(moved({ origin: CANON, hash: '#S05' }), 'none')
  assert.equal(moved({ origin: 'https://pillb.github.io', hash: '#import=abc' }), 'banner', 'the old origin never imports')
})

// --- consent card ------------------------------------------------------------------------------

const NO_SIGNALS = { gpc: false, dnt: false }
const consent = (p: Partial<Parameters<typeof consentCardMode>[0]> = {}) =>
  consentCardMode({ stage: 'sync', mode: 'everywhere', record: null, signals: NO_SIGNALS, country: null, measurementWanted: true, reopened: false, ...p })

test('the consent card asks only when something needs consent and no choice is recorded', () => {
  assert.equal(consent(), 'ask')
  assert.equal(consent({ measurementWanted: false }), 'hidden', 'no banner for nothing')
  assert.equal(consent({ record: { v: 1, value: 'denied', version: 1, at: '' } }), 'hidden')
  assert.equal(consent({ record: { v: 1, value: 'granted', version: 1, at: '' } }), 'hidden')
  assert.equal(consent({ signals: { gpc: true, dnt: false } }), 'hidden', 'GPC is an answer')
  assert.equal(consent({ mode: 'eea-only', country: 'PE' }), 'hidden')
  assert.equal(consent({ mode: 'eea-only', country: 'ES' }), 'ask')
  assert.equal(consent({ stage: 'off' }), 'hidden')
})

test('the footer link reopens the card to change the choice, on the same surface', () => {
  const granted = { v: 1 as const, value: 'granted' as const, version: 1, at: '' }
  assert.equal(consent({ reopened: true, record: granted }), 'manage')
  assert.equal(consent({ reopened: true, measurementWanted: false }), 'manage')
  assert.equal(consent({ reopened: true, stage: 'off' }), 'hidden')
})

// --- section gate as the UI applies it -----------------------------------------------------------

const snap = (sections: string[]): GrandfatherSnapshot => ({ v: 1, takenAt: '2026-01-01T00:00:00.000Z', sections })
function gate(p: Partial<Parameters<typeof sectionGateState>[0]> & { cfgPatch?: Partial<CloudConfig['gate']> } = {}) {
  const { cfgPatch, ...rest } = p
  const cfg: CloudConfig = { ...CLOUD_CONFIG, gate: { ...CLOUD_CONFIG.gate, ...cfgPatch } }
  return sectionGateState({ cfg, stage: 'beta', access: 'free', sectionIndex: 6, sectionId: 'functions', snapshot: snap([]), nowMs: Date.parse('2026-10-01'), ...rest })
}

test('the section gate: S01-S05 open, S06+ locked for free, pending while access is unknown', () => {
  assert.equal(gate({ sectionIndex: 5 }), 'open')
  assert.equal(gate(), 'locked')
  assert.equal(gate({ access: 'pro' }), 'open')
  assert.equal(gate({ access: 'unknown' }), 'pending')
  assert.equal(gate({ access: 'unknown', sectionIndex: 2 }), 'open')
  assert.equal(gate({ stage: 'sync' }), 'open')
  assert.equal(gate({ stage: 'off' }), 'open')
})

test('the gate waits for the grandfather snapshot and honours it', () => {
  assert.equal(gate({ snapshot: null }), 'pending', 'no snapshot yet: never flash the upsell at a grandfathered learner')
  assert.equal(gate({ snapshot: null, access: 'pro' }), 'open')
  assert.equal(gate({ snapshot: snap(['functions']) }), 'open')
  assert.equal(gate({ snapshot: null, stage: 'sync' }), 'open', 'no gate, nothing to wait for')
})

test('gate.since in the future keeps every section open', () => {
  assert.equal(gate({ cfgPatch: { since: '2027-01-01' } }), 'open')
  assert.equal(gate({ cfgPatch: { since: '2026-09-01' } }), 'locked')
})

test('packaging B has no UI yet, so the page applies A (whole section) rather than opening practice for free', () => {
  assert.equal(gate({ cfgPatch: { packaging: 'B' } }), 'locked')
  assert.equal(gate({ cfgPatch: { packaging: 'B' }, sectionIndex: 4 }), 'open')
})
