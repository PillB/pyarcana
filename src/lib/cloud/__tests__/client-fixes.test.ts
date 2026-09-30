/**
 * Fix round over the client review findings (2026-09-29). One test (or a small group) per
 * finding, each written to fail at the code the finding was made against. Items that no longer
 * reproduced are pinned here as regressions where a test could catch them coming back.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { t, type Language } from '@/lib/i18n'
import { CLOUD_CONFIG, type CloudConfig } from '@/lib/cloud/config'
import { legalBlocks } from '@/lib/cloud/legal-content'
import { CONSENT_KEY, CONSENT_VERSION, recordConsent } from '@/lib/cloud/consent'
import { consentUpload, sendConsentRecord, CONSENT_SENT_KEY } from '@/lib/cloud/consent-sync'
import { checkoutView, cancelBody, errorMessage } from '@/lib/cloud/billing-ui'
import { parseMe } from '@/lib/cloud/session'
import { surveyOutcomeKey } from '@/lib/cloud/survey-ui'
import { ownerChoiceOpen, priceCtaTarget, radioKeyTarget, storageNoticeKeys, movedCopy } from '@/lib/cloud/ui-state'
import { buildCsp } from '@/lib/cloud/csp'
import { chooseAdapter, type AdapterInput } from '@/lib/cloud/ads'
import { railMediaQuery } from '@/lib/cloud/ad-slot'
import { annualSavingPercentOf, getPlanByCode } from '@/lib/subscription-plans'
import { createMemoryStorage } from '@/lib/cloud/storage'
import type { ApiClient, ApiResult } from '@/lib/cloud/api'

const ROOT = process.cwd()
const LANGS: Language[] = ['es-PE', 'es-ES', 'en']
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8')
const NOW_S = Date.parse('2026-10-01T12:00:00Z') / 1000
const DAY = 86400

// --- 1, 2: every legal link the account surfaces point at exists and lands on the account section

function hrefs(rel: string): string[] {
  return [...read(rel).matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1])
}

test('1: every site-internal link in checkout, sign-in and consent resolves to a page of the static export', () => {
  const files = ['src/components/account/CheckoutConfirmPanel.tsx', 'src/components/account/SignInPanel.tsx', 'src/components/account/ConsentCard.tsx']
  const links = files.flatMap(hrefs)
  assert.ok(links.length >= 5, `only ${links.length} links found`)
  for (const href of links) {
    const route = href.split('#')[0].replace(/^\//, '')
    assert.ok(existsSync(join(ROOT, 'src/app', route, 'page.tsx')), `${href} has no page`)
  }
})

test('2: sign-in and consent links land on the section that describes accounts, and that section covers what they promise', () => {
  const signIn = hrefs('src/components/account/SignInPanel.tsx')
  assert.ok(signIn.includes('/terms#cloud-legal'), signIn.join(' '))
  assert.ok(signIn.includes('/privacy#cloud-legal'), signIn.join(' '))
  assert.ok(hrefs('src/components/account/ConsentCard.tsx').includes('/cookies#cloud-legal'))
  assert.match(read('src/components/account/CloudLegalSection.tsx'), /id="cloud-legal"/)
  for (const page of ['terms', 'privacy', 'cookies']) {
    assert.match(read(`src/app/${page}/page.tsx`), new RegExp(`<CloudLegalSection kind="${page}"`), `${page} mounts the section`)
  }
  // The consent card asks about measurement: the page it links to must explain measurement.
  assert.ok(legalBlocks(CLOUD_CONFIG, 'cookies', 'sync').includes('measurement'))
  for (const lang of LANGS) assert.notEqual(t('legalc.intro', lang), 'legalc.intro', lang)
})

// --- 3: the consent sentence says what "Sí" authorises --------------------------------------------

test('3: the consent text names activity events and the link to the account, and a new text means a new version', () => {
  for (const lang of LANGS) {
    const text = t('consent.text', lang)
    assert.match(text, lang === 'en' ? /complete a section/ : /completas una sección/, `${lang}: activity events`)
    assert.match(text, lang === 'en' ? /account/ : /cuenta/, `${lang}: linked to the account on sign-in`)
  }
  // Pin: the stored choice is only valid for the text it answered (consent.ts CONSENT_VERSION).
  const sha = createHash('sha256').update(t('consent.text', 'es-PE')).digest('hex').slice(0, 12)
  const PINNED: Record<number, string> = { 2: 'cb5a48a20596' }
  assert.equal(CONSENT_VERSION, 2)
  assert.equal(sha, PINNED[CONSENT_VERSION], 'consent.text changed: bump CONSENT_VERSION and pin the new hash')
})

// --- 4: the owner-choice dialog can be put off -----------------------------------------------------

test('4: the owner-choice dialog opens on needs_choice, can be deferred, and reopens on request', () => {
  assert.equal(ownerChoiceOpen('needs_choice', false), true)
  assert.equal(ownerChoiceOpen('needs_choice', true), false, 'deferred: the dialog closes, the choice stays pending')
  assert.equal(ownerChoiceOpen('synced', false), false)
  const src = read('src/components/account/CloudSync.tsx')
  assert.doesNotMatch(src, /AlertDialogAction[^>]*buttonVariants\(\{ variant: 'outline' \}\)/, 'default and outline classes mixed on one button')
  assert.match(src, /onOpenChange=/, 'Esc and the close button can dismiss it')
  for (const lang of LANGS) assert.notEqual(t('sync.choice.later', lang), 'sync.choice.later')
})

// --- 7: "Ver precios" never sends a signed-out visitor to a form without prices -------------------

test('7: price CTAs open the checkout only for a signed-in learner; otherwise the /precios page', () => {
  assert.equal(priceCtaTarget(true), 'checkout')
  assert.equal(priceCtaTarget(false), 'prices-page')
  assert.match(read('src/components/account/UpgradeCard.tsx'), /priceCtaTarget\(/, 'UpgradeCard decides through priceCtaTarget')
  // Review round 3 (finding 11): AdSlot routes every Pro button through houseCtaTarget, which
  // delegates to priceCtaTarget for everything but "Ver la prueba".
  assert.match(read('src/components/account/AdSlot.tsx'), /houseCtaTarget\(/)
  assert.match(read('src/lib/cloud/ui-state.ts'), /if \(cta !== 'trial'\) return priceCtaTarget\(signedIn\)/)
})

// --- 8: the survey reports what happened ------------------------------------------------------------

const fail = (status: number, reason: string): ApiResult<Record<string, unknown>> => ({ ok: false, status, reason, data: null })

test('8: the survey thanks only when the worker stored the answer', () => {
  assert.equal(surveyOutcomeKey({ ok: true, status: 200, data: { ok: true } }), 'survey.thanks')
  assert.equal(surveyOutcomeKey(fail(404, 'not_found')), 'survey.notSaved')
  assert.equal(surveyOutcomeKey(fail(0, 'network')), 'survey.notSaved')
  for (const lang of LANGS) {
    const text = t('survey.notSaved', lang)
    assert.notEqual(text, 'survey.notSaved')
    assert.doesNotMatch(text, /Gracias|Thank/)
  }
})

// --- 11: the cancel dialog states the real end -------------------------------------------------------

test('11: cancelling in the paid period states the date Pro from this subscription ends', () => {
  const paidThrough = NOW_S + 10 * DAY
  const body = cancelBody({ paidThrough }, NOW_S, 'es-PE')
  assert.match(body, /11 de octubre de 2026/)
  assert.doesNotMatch(cancelBody({ paidThrough: NOW_S - DAY }, NOW_S, 'es-PE'), /de 2026/, 'past due: no end date promised')
  assert.match(cancelBody({ paidThrough }, NOW_S, 'en'), /October 11, 2026/)
})

// --- 16: trial CTAs state the credit ------------------------------------------------------------------

test('16: the gate and the soft trial card say remaining trial days are kept as credit', () => {
  for (const key of ['gate.trialNote', 'trialcard.body']) {
    for (const lang of LANGS) assert.match(t(key, lang), lang === 'en' ? /kept/ : /se guardan/, `${lang} ${key}`)
  }
})

// --- 17: the dynamic pricing page computes the saving ---------------------------------------------------

test('17: the annual saving is computed from the prices, rounded down', () => {
  const pro = getPlanByCode('pro')!.pricing
  assert.equal(annualSavingPercentOf(pro.PE.monthly, pro.PE.yearly), 49)
  assert.equal(annualSavingPercentOf(pro.US.monthly, pro.US.yearly), 48)
  assert.equal(annualSavingPercentOf(0, 0), 0)
  assert.doesNotMatch(read('src/components/course/PricingPage.tsx'), /17%/)
})

// --- 18: the consent choice reaches the worker once per account and choice ------------------------------

function fakeApi(answer: () => ApiResult<Record<string, unknown>>) {
  const calls: Array<{ path: string; body: unknown }> = []
  const api = {
    post: async (path: string, body: unknown) => (calls.push({ path, body }), answer()),
  } as unknown as ApiClient
  return { api, calls }
}

test('18: at sign-in the stored consent choice is sent as the record, once, and again after a change', async () => {
  const storage = createMemoryStorage()
  assert.equal(consentUpload(storage, 'acct_1'), null, 'no choice, nothing to send')
  recordConsent(storage, 'granted', Date.parse('2026-09-29T10:00:00Z'))
  const up = consentUpload(storage, 'acct_1')
  assert.deepEqual(up, { kind: 'measurement', value: 'granted', version: CONSENT_VERSION, at: '2026-09-29T10:00:00.000Z' })

  const missing = fakeApi(() => fail(404, 'not_found'))
  assert.equal(await sendConsentRecord(missing.api, storage, 'acct_1'), false)
  assert.equal(storage.getItem(CONSENT_SENT_KEY), null, 'not recorded as sent while the worker has no route')

  const ok = fakeApi(() => ({ ok: true, status: 200, data: { ok: true } }))
  assert.equal(await sendConsentRecord(ok.api, storage, 'acct_1'), true)
  assert.equal(await sendConsentRecord(ok.api, storage, 'acct_1'), false, 'already sent')
  assert.deepEqual(ok.calls.map((c) => c.path), ['/v1/me/consents'])
  recordConsent(storage, 'denied', Date.parse('2026-09-30T10:00:00Z'))
  assert.equal(await sendConsentRecord(ok.api, storage, 'acct_1'), true, 'a withdrawal is sent too')
  assert.equal(await sendConsentRecord(ok.api, storage, 'acct_2'), true, 'another account gets its own record')
  assert.ok(storage.getItem(CONSENT_KEY))
})

// --- 19: dashboard notices agree with the stage and with the sync state ------------------------------------

test('19: with accounts off the storage notice promises no account; signed in it claims sync only when synced', () => {
  const off = storageNoticeKeys({ signedIn: false, isStaticSite: true, stage: 'off', syncStatus: 'idle' })
  assert.ok(!off.includes('storage.accountSync'), off.join(' '))
  assert.ok(storageNoticeKeys({ signedIn: false, isStaticSite: true, stage: 'sync', syncStatus: 'idle' }).includes('storage.accountSync'))
  assert.ok(storageNoticeKeys({ signedIn: false, isStaticSite: false, stage: 'off', syncStatus: 'idle' }).includes('storage.accountSync'), 'dynamic build unchanged')
  assert.deepEqual(storageNoticeKeys({ signedIn: true, isStaticSite: true, stage: 'sync', syncStatus: 'synced' }), ['storage.signedIn.synced'])
  for (const s of ['error', 'offline', 'needs_choice', 'pulling', 'idle'] as const) {
    assert.deepEqual(storageNoticeKeys({ signedIn: true, isStaticSite: true, stage: 'sync', syncStatus: s }), ['storage.signedIn.notYet'], s)
  }
  for (const lang of LANGS) {
    assert.doesNotMatch(t('storage.signedIn.notYet', lang), /se está sincronizando|is syncing/)
    assert.notEqual(t('storage.accountSync', lang), 'storage.accountSync')
  }
})

// --- 20: "escríbenos" always comes with the address ---------------------------------------------------------

test('20: every cloud string that asks the learner to write names the address, and the address is filled', () => {
  const offenders: string[] = []
  for (const lang of LANGS) {
    for (const key of ['account.error.blocked', 'moved.tooLarge', 'legalc.rights.body', 'legalc.accountTerms.body']) {
      const text = t(key, lang)
      if (/scríbenos|write to us/i.test(text) && !text.includes('{email}')) offenders.push(`${lang} ${key}`)
    }
  }
  assert.deepEqual(offenders, [])
  const msg = errorMessage({ key: 'account.error.blocked' }, 'es-PE')
  assert.ok(msg.includes(CLOUD_CONFIG.legal.supportEmail), msg)
})

// --- 22: kept credit is never overstated ---------------------------------------------------------------------

test('22: checkout credit counts whole days left, rounded down', () => {
  const me = parseMe({ account: { id: 'acct_1', email: 'a@b.pe', trialAvailable: false }, access: { isPro: true, source: 'trial', accessEnd: NOW_S + 2 * DAY + DAY / 2, indefinite: false } })!
  const view = checkoutView({ stage: 'paid', rails: { peru: 'mercadopago', international: 'creem' }, market: 'pe', cadence: 'monthly', me, nowS: NOW_S })
  assert.equal(view.creditDays, 2)
  const hours = parseMe({ account: { id: 'acct_1', email: 'a@b.pe', trialAvailable: false }, access: { isPro: true, source: 'gift', accessEnd: NOW_S + 3600, indefinite: false } })!
  assert.equal(checkoutView({ stage: 'paid', rails: { peru: 'mercadopago', international: '' }, market: 'pe', cadence: 'monthly', me: hours, nowS: NOW_S }).creditDays, null, 'less than a day: no "0 días" line')
})

// --- 23e: radio groups move with the arrow keys ------------------------------------------------------------------

test('23: radio-group arrow keys wrap, Home/End jump, other keys do nothing', () => {
  assert.equal(radioKeyTarget('ArrowRight', 0, 5), 1)
  assert.equal(radioKeyTarget('ArrowDown', 4, 5), 0)
  assert.equal(radioKeyTarget('ArrowLeft', 0, 5), 4)
  assert.equal(radioKeyTarget('ArrowUp', 2, 5), 1)
  assert.equal(radioKeyTarget('Home', 3, 5), 0)
  assert.equal(radioKeyTarget('End', 0, 11), 10)
  assert.equal(radioKeyTarget('Enter', 2, 5), null)
  assert.equal(radioKeyTarget('ArrowRight', -1, 5), 0, 'nothing chosen yet: the first')
})

test('23: /cuenta and the locked section keep an outline without gaps; Close is translated', () => {
  assert.match(read('src/components/account/UpgradeCard.tsx'), /<h1 /)
  assert.match(read('src/components/account/AccountPage.tsx'), /HeadingLevel/)
  assert.match(read('src/components/account/AccountDialog.tsx'), /closeLabel=\{tr\('account.dialog.close'\)\}/)
  assert.match(read('src/components/account/TrialSoftCard.tsx'), /<aside aria-labelledby=/)
  for (const lang of LANGS) assert.notEqual(t('account.dialog.close', lang), 'account.dialog.close')
})

// --- 24: the moved banner says only what its state supports ------------------------------------------------------

test('24: the moved banner promises an account only where accounts run, and a carried progress only with a link', () => {
  const on = movedCopy({ link: { ok: true }, accountsThere: true })
  assert.deepEqual(on, ['moved.body.accounts', 'moved.body.carry'])
  assert.deepEqual(movedCopy({ link: { ok: true }, accountsThere: false }), ['moved.body.carry'])
  assert.deepEqual(movedCopy({ link: { ok: false, reason: 'empty' }, accountsThere: false }), ['moved.body.plain'])
  assert.deepEqual(movedCopy({ link: { ok: false, reason: 'too_large' }, accountsThere: true }), ['moved.body.accounts', 'moved.tooLarge'])
  assert.deepEqual(movedCopy({ link: { ok: false, reason: 'unreadable' }, accountsThere: false }), ['moved.body.plain', 'moved.unreadable'])
  for (const key of ['moved.body.accounts', 'moved.body.carry', 'moved.body.plain', 'moved.unreadable']) {
    for (const lang of LANGS) assert.notEqual(t(key, lang), key, `${lang} ${key}`)
  }
})

// --- 25: learner Spanish follows writing_rules A3, A4, D7 -----------------------------------------------------------

function spanishCloudStrings(lang: 'es-PE' | 'es-ES'): Array<[string, string]> {
  const text = read('src/lib/i18n.ts')
  const start = text.indexOf(`'${lang}': {`)
  const end = text.indexOf(lang === 'es-PE' ? `'es-ES': {` : `'en': {`)
  const re = /^\s*'((?:account|billing|consent|ads|survey|gate|trialcard|moved|sync|precios|susc|legalc|cuenta|cloudpage|qasite|qa\.send|qa\.mode|storage)\.[\w.]+)':\s*'(.*)',\s*$/gm
  return [...text.slice(start, end).matchAll(re)].map((m) => [m[1], m[2]])
}

test('25: no unexpanded acronym (GPC, DNT, QA, IGV, RUC), no house or English terms in learner Spanish', () => {
  const offenders: string[] = []
  for (const lang of ['es-PE', 'es-ES'] as const) {
    const strings = spanishCloudStrings(lang)
    assert.ok(strings.length > 300, `${lang}: only ${strings.length} strings collected`)
    for (const [key, text] of strings) {
      if (/\b(GPC|DNT)\b/.test(text)) offenders.push(`${lang} ${key}: GPC/DNT`)
      if (/\bQA\b/.test(text) && !/control de calidad/.test(text)) offenders.push(`${lang} ${key}: QA`)
      if (/\bIGV\b/.test(text) && !/impuesto general a las ventas/i.test(text)) offenders.push(`${lang} ${key}: IGV`)
      if (/\bRUC \{/.test(text) && !/Registro Único de Contribuyentes/.test(text)) offenders.push(`${lang} ${key}: RUC`)
      if (/\b(workspace|tester|merchant of record|checkout)\b/i.test(text)) offenders.push(`${lang} ${key}: English`)
    }
  }
  assert.deepEqual(offenders, [])
})

// --- 26: the regression suites run in the client command ---------------------------------------------------------------

test('26: every client suite, including handoff-import and remote-apply, is listed in the billing runner', () => {
  const runner = read('scripts/run_billing_tests.mjs')
  const dir = join(ROOT, 'src/lib/cloud/__tests__')
  const suites = readdirSync(dir).filter((f) => f.endsWith('.test.ts') && statSync(join(dir, f)).isFile()).map((f) => f.replace(/\.test\.ts$/, ''))
  for (const name of ['handoff-import', 'remote-apply', ...suites]) assert.match(runner, new RegExp(`\\["${name}", \\d+\\]`), name)
})

// --- 27: the signed-in panel loads the sign-in methods ------------------------------------------------------------------

test('27: no component reads the auth-methods store without loading it', () => {
  const dir = join(ROOT, 'src/components/account')
  const offenders = readdirSync(dir)
    .filter((f) => f.endsWith('.tsx'))
    .filter((f) => /\buseAuthMethods\b/.test(read(`src/components/account/${f}`)))
  assert.deepEqual(offenders, [], 'use useLoadedAuthMethods, which fetches /v1/auth/methods on mount')
  assert.match(read('src/components/account/runtime.ts'), /export function useLoadedAuthMethods/)
})

// --- 28: EthicalAds can actually run where it is configured ----------------------------------------------------------------

const ETHICAL: CloudConfig = {
  ...structuredClone(CLOUD_CONFIG),
  launchStage: 'beta',
  ads: { provider: 'ethicalads', adsenseClient: '', adsenseSlots: {}, ethicaladsPublisher: 'pyarcana' },
}

test('28: the CSP lets the EthicalAds decision (a JSONP script from server.ethicalads.io) load', () => {
  const scriptSrc = buildCsp(ETHICAL).split('; ').find((d) => d.startsWith('script-src '))!
  assert.match(scriptSrc, /https:\/\/media\.ethicalads\.io/)
  assert.match(scriptSrc, /https:\/\/server\.ethicalads\.io/)
  assert.doesNotMatch(buildCsp(CLOUD_CONFIG), /ethicalads/, 'shipped config unchanged')
})

test('28: the rail placement is mounted, carries EthicalAds on wide screens only, and nothing else', () => {
  const base: AdapterInput = { eligibility: 'free', ads: ETHICAL.ads, placement: 'rail', signedIn: false, adultAttested: false, geo: { status: 'unknown', country: null }, adsenseOptIn: 'unset', desktop: true }
  assert.equal(chooseAdapter(base), 'ethicalads')
  assert.equal(chooseAdapter({ ...base, desktop: false }), 'none', 'no house promo squeezed into a hidden rail')
  assert.equal(chooseAdapter({ ...base, ads: CLOUD_CONFIG.ads }), 'none', 'house provider: the rail stays empty (one promo per view)')
  assert.equal(chooseAdapter({ ...base, placement: 'section_end' }), 'house')
  assert.match(railMediaQuery(), /^\(min-width: \d+px\)$/)
  assert.match(read('src/app/page.tsx'), /<AdSlot[^>]*placement="rail"/)
  const width = /\d+/.exec(railMediaQuery())![0]
  assert.match(read('src/components/account/AdSlot.tsx'), new RegExp(`min-\\[${width}px\\]:block`), 'the CSS breakpoint and the media query agree')
})
