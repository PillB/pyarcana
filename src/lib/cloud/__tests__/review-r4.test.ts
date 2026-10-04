/**
 * Client review, fixer round 4 (review round 2 against the round-3 client). One block per finding
 * the fixer accepted; each names the finding it pins. Rendered markup comes from
 * renderToStaticMarkup (effects do not run), so what a test sees is the first paint.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SessionProvider } from 'next-auth/react'
import { CLOUD_CONFIG } from '@/lib/cloud/config'
import { LEGACY_CSP, buildCsp, metaCsp } from '@/lib/cloud/csp'
import { parseMe, type MePayload } from '@/lib/cloud/session'
import { linkState, unlinkProvider, uiError } from '@/lib/cloud/account-api'
import { ProgressSync, PULL_THROTTLE_MS, type ProgressStoreAdapter, type SyncStatus } from '@/lib/cloud/progress-sync'
import type { ProgressState } from '@/lib/cloud/progress-merge'
import { createMemoryStorage } from '@/lib/cloud/storage'
import type { ApiClient, ApiResult } from '@/lib/cloud/api'
import { mergeSectionOptions, parseReport, sectionLabel } from '@/lib/cloud/admin-api'
import { checkoutTaxKey, checkoutView } from '@/lib/cloud/billing-ui'
import { t } from '@/lib/i18n'
import { LinkSection } from '@/components/account/AccountSections'
import { ReportBrowser } from '@/components/account/ReportBrowser'
import { ContextList } from '@/components/account/ReportDetail'
import { CheckoutConfirmPanel, NoRailCheckout } from '@/components/account/CheckoutConfirmPanel'
import { CspMeta } from '@/components/CspMeta'

const render = (el: ReturnType<typeof h>) => renderToStaticMarkup(h(SessionProvider, { session: null, children: el }))
const LANGS = ['es-PE', 'es-ES', 'en'] as const
const tr = (k: string, vars?: Record<string, string | number>) => `${k}${vars ? JSON.stringify(vars) : ''}`

function me(account: Record<string, unknown>): MePayload {
  const parsed = parseMe({ account: { id: 'acct_1', email: 'ana@example.pe', emailVerified: true, ...account }, access: {} })
  assert.ok(parsed)
  return parsed
}

// --- finding 1: the link panel offers only providers the account does not already hold ------------

test('F1: parseMe keeps the account identities the worker sends (provider only, known providers, no duplicates)', () => {
  const m = me({
    signInMethod: 'email',
    identities: [
      { provider: 'google', subject: 'goo…123', createdAt: 1 },
      { provider: 'email', subject: 'ana…pe', createdAt: 2 },
      { provider: 'google', subject: 'dup', createdAt: 3 },
      { provider: 'evil', subject: 'x', createdAt: 4 },
      'junk',
    ],
  })
  assert.deepEqual(m.account.identities, ['google', 'email'])
  assert.deepEqual(me({}).account.identities, [], 'a cached payload from before this field parses to an empty list')
})

test('F1: an account created with Google that signed in by email today is not offered Google again', () => {
  const methods = { google: true, microsoft: true }
  const s = linkState(me({ signInMethod: 'email', identities: [{ provider: 'google' }, { provider: 'email' }] }).account, methods)
  assert.deepEqual(s.linked, ['google', 'email'])
  assert.deepEqual(s.offer, ['microsoft'])
  const after = linkState(me({ signInMethod: 'email', identities: [{ provider: 'google' }, { provider: 'email' }, { provider: 'microsoft' }] }).account, methods)
  assert.deepEqual(after.offer, [], 'after a Microsoft link the payload lists it and the button goes')
  const cached = linkState(me({ signInMethod: 'google' }).account, methods)
  assert.deepEqual(cached.linked, ['google'], 'without identities the session method is the one known way in')
  assert.deepEqual(cached.offer, ['microsoft'])
  assert.deepEqual(linkState(me({ signInMethod: 'email' }).account, { google: false, microsoft: false }).offer, [])
})

test('F1: only a Google or Microsoft identity with another way in left is offered for removal', () => {
  const both = linkState(me({ signInMethod: 'email', identities: [{ provider: 'google' }, { provider: 'email' }] }).account, { google: true, microsoft: true })
  assert.deepEqual(both.removable, ['google'])
  const only = linkState(me({ signInMethod: 'google', identities: [{ provider: 'google' }] }).account, { google: true, microsoft: true })
  assert.deepEqual(only.removable, [], 'the last way in is never offered')
})

test('F1: provider_already_linked, admin_identity_mismatch and last_sign_in_method get their own words, in all three dictionaries', () => {
  const r = (reason: string) => uiError({ ok: false, status: 409, reason, data: null }).key
  assert.equal(r('provider_already_linked'), 'account.error.providerLinked')
  assert.equal(r('admin_identity_mismatch'), 'account.error.adminAddress')
  assert.equal(r('last_sign_in_method'), 'account.error.lastMethod')
  for (const key of ['account.error.providerLinked', 'account.error.adminAddress', 'account.error.lastMethod', 'account.link.linked', 'account.unlink.button', 'account.unlink.title', 'account.unlink.body', 'account.unlink.confirm', 'account.unlink.done']) {
    for (const lang of LANGS) assert.notEqual(t(key, lang), key, `${key} in ${lang}`)
  }
  for (const lang of ['es-PE', 'es-ES'] as const) {
    for (const key of ['account.error.providerLinked', 'account.error.adminAddress', 'account.error.lastMethod']) {
      assert.doesNotMatch(t(key, lang), /Vuelve a intentarlo/, `${key} ${lang} does not send the learner into a retry loop`)
    }
  }
})

test('F1: removing a method calls DELETE /v1/me/identities/:provider and reports a signed-out answer', async () => {
  const calls: string[] = []
  const answer: ApiResult<Record<string, unknown>> = { ok: true, status: 200, data: { ok: true, signedOut: true } }
  const api = { del: async (path: string) => (calls.push(`DELETE ${path}`), answer) } as unknown as ApiClient
  const r = await unlinkProvider(api, 'google')
  assert.deepEqual(calls, ['DELETE /v1/me/identities/google'])
  assert.ok(r.ok && r.data.signedOut === true)
})

test('F1: the panel lists every linked method and offers to remove the removable ones (first paint)', () => {
  const html = render(h(LinkSection, { me: me({ signInMethod: 'email', identities: [{ provider: 'google' }, { provider: 'email' }] }) }))
  assert.match(html, /Google y código por correo/, 'both linked methods are named')
  assert.match(html, /Quitar Google/)
  assert.doesNotMatch(html, /Quitar código/)
})

// --- finding 2: "Decidir después" survives a pull while the owner choice is pending --------------

const blank = (p: Partial<ProgressState> = {}): ProgressState => ({ completedSections: [], completedSubSteps: {}, quizScores: {}, lastVisited: null, bookmarks: [], startDate: null, isHydratedFromServer: false, ...p })
function fakeStore(s: ProgressState): ProgressStoreAdapter {
  let st = s
  const ls = new Set<(n: ProgressState, p: ProgressState) => void>()
  return { getState: () => st, setState: (p) => { const prev = st; st = { ...st, ...p }; ls.forEach((l) => l(st, prev)) }, subscribe: (l) => { ls.add(l); return () => ls.delete(l) } }
}

test('F2: a visibility pull while the owner choice is pending changes no status and fetches nothing', async () => {
  let gets = 0
  const api = {
    get: async () => (gets++, { ok: true, status: 200, data: { ok: true, rev: 3, doc: null } }),
    put: async () => ({ ok: true, status: 200, data: { ok: true, rev: 4 } }),
  } as unknown as ApiClient
  let owner: string | null = 'acc_old'
  let clock = Date.now()
  const sync = new ProgressSync({ api, storage: createMemoryStorage(), store: fakeStore(blank({ completedSections: ['intro'] })), owner: { get: () => owner, set: (a) => { owner = a } }, now: () => clock, scheduler: { setTimeout: () => 0, clearTimeout: () => {} } })
  const seen: SyncStatus[] = []
  sync.onStatus((s) => seen.push(s))
  assert.equal(await sync.start('acc_new'), 'needs_choice')
  seen.length = 0
  assert.equal(await sync.pull(), 'needs_choice')
  assert.deepEqual(seen, [], 'no transient pulling status, so the runtime keeps choiceDeferred')
  assert.equal(gets, 1, 'the pending remote copy is kept; the choice decides what happens to it')
  assert.equal(await sync.resolveOwnerChoice('merge'), 'synced')
  // Pulls are throttled since 4 Oct 2026 (progress-sync-efficiency); past the window the gate is gone.
  clock += PULL_THROTTLE_MS + 1
  assert.equal(await sync.pull(), 'synced', 'once answered, a pull works again')
  assert.equal(gets, 2)
})

// --- finding 3: the section filter offers what the detail shows ----------------------------------

const row = (id: string, context: Record<string, unknown>) => parseReport({ id, title: 'T', status: 'new', category: 'bug', context })!

test('F3: a report names its section as "S07 · title", and the filter offers exactly those labels with the sectionId as value', () => {
  const a = row('rep_a', { sectionId: 'pandas', sectionIndex: 7, sectionTitle: 'Pandas' })
  const b = row('rep_b', { sectionId: 'setup', sectionIndex: 1 })
  const c = row('rep_c', { sectionId: 'pandas', sectionIndex: 7, sectionTitle: 'Pandas' })
  const d = row('rep_d', {})
  assert.equal(sectionLabel(a.context), 'S07 · Pandas')
  assert.equal(sectionLabel(b.context), 'S01 · setup')
  assert.equal(sectionLabel(d.context), null)
  const first = mergeSectionOptions([], [a, d])
  assert.deepEqual(mergeSectionOptions(first, [b, c]), [
    { id: 'setup', label: 'S01 · setup', index: 1 },
    { id: 'pandas', label: 'S07 · Pandas', index: 7 },
  ], 'sorted by section, one entry per id, kept across pages')
  const html = render(h(ContextList, { report: a, tr }))
  assert.match(html, /S07 · Pandas/, 'the detail shows the same words the filter offers')
})

test('F3: the section filter is a select, not free text the worker cannot match', () => {
  const html = render(h(ReportBrowser, { scope: 'qa', renderDetail: () => null }))
  assert.match(html, /<select[^>]*id="qa-section"/)
  assert.doesNotMatch(html, /<input[^>]*id="qa-section"/)
})

// --- finding 5: the GitHub Pages CSP is an enforced http-equiv meta ------------------------------

test('F5: the CSP ships as <meta http-equiv>, which browsers enforce, with the legacy policy by default', () => {
  const html = renderToStaticMarkup(h(CspMeta))
  // frame-ancestors is dropped from the meta copy only: browsers ignore it there and log a console
  // error on every page (seen in Chromium). The header copy (_headers) keeps it.
  const metaPolicy = LEGACY_CSP.replace("; frame-ancestors 'none'", '')
  assert.notEqual(metaPolicy, LEGACY_CSP)
  assert.equal(metaCsp(CLOUD_CONFIG), metaPolicy)
  assert.equal(html, `<meta http-equiv="Content-Security-Policy" content="${metaPolicy.replace(/'/g, '&#x27;')}"/>`)
  assert.match(buildCsp(CLOUD_CONFIG), /frame-ancestors 'none'/, 'the header policy still forbids framing')
  const layout = readFileSync('src/app/layout.tsx', 'utf8')
  assert.doesNotMatch(layout, /"Content-Security-Policy":/, 'metadata.other renders name=, which browsers ignore')
  assert.match(layout, /<head>\s*<CspMeta \/>/, 'first in <head>, before the inline guard script')
})

// --- finding 6: no sale is described on a market without a payment rail ------------------------

const view = (market: 'pe' | 'world', rails: { peru: 'mercadopago' | ''; international: 'creem' | '' }) =>
  checkoutView({ stage: 'paid', rails, market, cadence: 'monthly', me: null, nowS: 0 })

test('F6: the tax line names Creem only when the Creem rail sells', () => {
  assert.equal(checkoutTaxKey(view('world', { peru: '', international: 'creem' })), 'billing.tax.world')
  assert.equal(checkoutTaxKey(view('world', { peru: 'mercadopago', international: '' })), 'billing.tax.worldPending')
  assert.equal(checkoutTaxKey(view('pe', { peru: '', international: 'creem' })), 'billing.tax.pe')
})

test('F6: without a rail the panel shows the price and "not available", no seller, no charge today, no legal boxes', () => {
  for (const [market, rails] of [['world', { peru: 'mercadopago', international: '' }], ['pe', { peru: '', international: 'creem' }]] as const) {
    const html = render(h(NoRailCheckout, { view: view(market, rails), cadence: 'monthly', market, onMarket: () => {}, tr }))
    assert.match(html, /billing\.railMissing/)
    assert.match(html, /billing\.price\.monthly/)
    for (const absent of ['billing.chargedToday', 'billing.seller', 'billing.box', 'billing.tax.world"', 'checkbox']) assert.ok(!html.includes(absent), `${market}: ${absent}`)
  }
  // The whole panel with the shipped config (no rail at all) renders the same short form.
  const panel = render(h(CheckoutConfirmPanel, { me: me({}) }))
  assert.match(panel, /El pago para esta región todavía no está disponible/)
  assert.doesNotMatch(panel, /Creem|role="checkbox"|El primer cobro/)
  assert.equal(CLOUD_CONFIG.rails.peru, '', 'shipped config has no rail')
})
