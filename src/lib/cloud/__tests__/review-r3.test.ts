/**
 * Client review, fixer round 3 (findings against the round-2 client). One test per finding the
 * fixer accepted; each names the finding it pins. Rendered markup comes from renderToStaticMarkup
 * (effects do not run); focus behaviour is checked in a real browser (scratchpad evidence).
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SessionProvider } from 'next-auth/react'
import { CLOUD_CONFIG, type CloudConfig } from '@/lib/cloud/config'
import { legalBlocks } from '@/lib/cloud/legal-content'
import { pricingView, sellerView } from '@/lib/cloud/pricing-view'
import { houseCtaTarget, consentCardMode } from '@/lib/cloud/ui-state'
import { trialIntentOutcome, saveIntent } from '@/lib/cloud/intent'
import { canPrompt } from '@/lib/cloud/surveys'
import { categoryLabel, severityLabel, REPORT_CATEGORY_VALUES, REPORT_SEVERITY_VALUES } from '@/lib/cloud/admin-api'
import { createMemoryStorage } from '@/lib/cloud/storage'
import { parseMe } from '@/lib/cloud/session'
import { t } from '@/lib/i18n'
import { ARCHIVE_PREFIX } from '@/lib/cloud/progress-sync'
import { DESTRUCTIVE_ACTION_CLASS, DESTRUCTIVE_HOVER_CLASS, bottomReserve } from '@/components/account/a11y'
import { CloudLegalContent, storageDisclosure } from '@/components/account/CloudLegalSection'
import { SubscriptionContent } from '@/components/account/SuscripcionPage'
import { PricingContent } from '@/components/account/PreciosPage'
import { ReportBrowser } from '@/components/account/ReportBrowser'
import { StatusNote } from '@/components/account/Alerts'
import { PhaseNote } from '@/components/account/AccountPage'
import { classColour, over, ratio, tokenColour, type Theme } from './contrast'

const render = (el: ReturnType<typeof h>) => renderToStaticMarkup(h(SessionProvider, { session: null, children: el }))
const THEMES: Theme[] = ['light', 'dark']
const ON: CloudConfig = { ...structuredClone(CLOUD_CONFIG), launchStage: 'beta' }

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) return f === '__tests__' ? [] : sourceFiles(p)
    return /\.(ts|tsx)$/.test(f) ? [p] : []
  })
}

// --- finding 2/7 (D-USER-05): a blocked tenant is explained and the other ways in are offered -----

test('D-USER-05: /cuenta explains a blocked work or school tenant and offers the email code, without blaming the learner', () => {
  const html = render(h(PhaseNote, { phase: { kind: 'ms_failed', detailKey: 'X', offerOtherWays: true }, tr: (k: string) => k }))
  assert.match(html, /role="alert"/)
  assert.match(html, /<button[^>]*>cuenta\.ms\.otherWays<\/button>/)
  const plain = render(h(PhaseNote, { phase: { kind: 'ms_failed', detailKey: 'X', offerOtherWays: false }, tr: (k: string) => k }))
  assert.doesNotMatch(plain, /cuenta\.ms\.otherWays/)
  const es = t('cuenta.ms.tenantBlocked', 'es-PE')
  assert.match(es, /organización/)
  assert.match(es, /código por correo/)
  assert.doesNotMatch(es, /Cancelaste/)
  assert.match(t('account.signin.microsoftHint', 'es-PE'), /si tu organización lo permite/)
})

// --- finding 6: every address the legal pages name is on the owner's pre-launch mailbox list -----

test('6: every @pyarcana.dev address in the site is a mailbox or alias the owner must create before launch', () => {
  const used = new Set<string>()
  for (const f of sourceFiles('src')) for (const m of readFileSync(f, 'utf8').matchAll(/\b([a-z][a-z.-]*)@pyarcana\.dev\b/g)) used.add(m[1])
  assert.ok(used.has('privacy') && used.has('security') && used.has('soporte'), [...used].join(','))
  const setup = readFileSync('docs/HOSTINGER_SETUP.md', 'utf8')
  const checklist = setup.split('\n').filter((l) => l.startsWith('- [ ]')).join('\n')
  for (const local of used) assert.match(checklist, new RegExp(`\`${local}@`), `${local}@pyarcana.dev is not on the pre-launch checklist`)
})

// --- finding 8: privacy and cookies say what exists ------------------------------------------------

test('8: the privacy section covers surveys, and retention names events (180 days) and survey answers (2 years)', () => {
  assert.ok(legalBlocks(ON, 'privacy', 'beta').includes('surveys'))
  for (const lang of ['es-PE', 'es-ES', 'en'] as const) {
    const retention = t('legalc.retention.body', lang)
    assert.match(retention, /180/, lang)
    assert.match(retention, lang === 'en' ? /2 years/ : /2 años/, lang)
    assert.match(t('legalc.surveys.body', lang), lang === 'en' ? /2 years/ : /2 años/, lang)
  }
  const html = render(h(CloudLegalContent, { kind: 'privacy', cfg: ON, stage: 'beta' }))
  assert.ok(html.includes(t('legalc.surveys.h', 'es-PE')))
})

test('8: the browser-storage list names every key the account code writes, grouped, ads only with AdSense', () => {
  const exported = new Set<string>()
  for (const f of [...sourceFiles('src/lib/cloud'), ...sourceFiles('src/components/account')]) {
    for (const m of readFileSync(f, 'utf8').matchAll(/export const [A-Z_]*KEY = '([^']+)'/g)) exported.add(m[1])
  }
  exported.add(ARCHIVE_PREFIX)
  assert.ok(exported.size >= 15, `${exported.size} keys found`)
  const listed = (cfg: CloudConfig) => storageDisclosure(cfg).flatMap((g) => g.items.map((i) => i.key))
  const adsense: CloudConfig = { ...ON, ads: { ...ON.ads, provider: 'adsense', adsenseClient: 'ca-pub-1' } }
  const all = new Set(listed(adsense))
  const missing = [...exported].filter((k) => ![...all].some((l) => l === k || l.startsWith(k)))
  assert.deepEqual(missing, [], 'keys written but not disclosed')
  assert.ok(!listed(ON).some((k) => k.includes('adsense')), 'the AdSense opt-in is listed only when AdSense can load')
  const groups = storageDisclosure(adsense).map((g) => g.group)
  assert.deepEqual(groups, ['necessary', 'preferences', 'measurement', 'ads'])
  const html = render(h(CloudLegalContent, { kind: 'cookies', cfg: adsense, stage: 'beta' }))
  for (const k of all) assert.ok(html.includes(k), k)
})

// --- finding 9: the delete confirm is readable in both themes, at rest and on hover ------------------

test('9: "Eliminar mi cuenta" confirm meets 4.5:1 in both themes, at rest and on hover', () => {
  const white = [1, 1, 1, 1] as Parameters<typeof ratio>[0] // text-white
  const onSurface = (spec: string, theme: Theme) => ratio(white, over(tokenColour(spec, theme), tokenColour('background', theme)))
  for (const theme of THEMES) {
    const rest = classColour(DESTRUCTIVE_ACTION_CLASS, 'bg', theme)!
    assert.ok(onSurface(rest, theme) >= 4.5, `${theme} rest ${rest} ${onSurface(rest, theme).toFixed(2)}`)
  }
  const hoverLight = /(?:^|\s)hover:bg-([a-z-]+(?:\/\d+)?)(?:\s|$)/.exec(DESTRUCTIVE_ACTION_CLASS)?.[1]
  const hoverDark = /(?:^|\s)dark:hover:bg-([a-z-]+(?:\/\d+)?)(?:\s|$)/.exec(DESTRUCTIVE_ACTION_CLASS)?.[1]
  assert.ok(hoverLight && hoverDark, DESTRUCTIVE_ACTION_CLASS)
  assert.ok(onSurface(hoverLight, 'light') >= 4.5, `light hover ${hoverLight} ${onSurface(hoverLight, 'light').toFixed(2)}`)
  assert.ok(onSurface(hoverDark, 'dark') >= 4.5, `dark hover ${hoverDark} ${onSurface(hoverDark, 'dark').toFixed(2)}`)
  assert.ok(ratio(white, tokenColour('destructive', 'dark')) < 4.5, 'the finding reproduces with plain bg-destructive in dark')
  const src = readFileSync('src/components/account/AccountSections.tsx', 'utf8')
  assert.doesNotMatch(src, /bg-destructive text-white/)
  assert.match(src, /<AlertDialogAction\s+className=\{DESTRUCTIVE_ACTION_CLASS\}/)
  assert.match(src, /<Button variant="destructive" size="sm" className=\{DESTRUCTIVE_HOVER_CLASS\}>/)
  assert.ok(DESTRUCTIVE_ACTION_CLASS.includes(DESTRUCTIVE_HOVER_CLASS))
})

// --- finding 10: a promised trial that does not start says why --------------------------------------

test('10: the trial intent resolves to start, unavailable (said out loud) or nothing', () => {
  const now = Date.parse('2026-09-30T12:00:00Z')
  const me = (trialAvailable: boolean, isPro = false) =>
    parseMe({ account: { id: 'acct_1', email: 'a@b.pe', trialAvailable }, access: { isPro, source: null, accessEnd: null, indefinite: false } })
  const fresh = () => {
    const s = createMemoryStorage()
    saveIntent(s, { kind: 'trial', sectionId: null }, now)
    return s
  }
  assert.equal(trialIntentOutcome(fresh(), me(true), now + 1, false), 'start')
  assert.equal(trialIntentOutcome(fresh(), me(false), now + 1, false), 'unavailable')
  assert.equal(trialIntentOutcome(fresh(), me(false, true), now + 1, false), 'none', 'already Pro: nothing to explain')
  assert.equal(trialIntentOutcome(createMemoryStorage(), me(false), now + 1, false), 'none', 'no intent, no message')
  const leaving = fresh()
  assert.equal(trialIntentOutcome(leaving, me(true), now + 1, true), 'none')
  assert.equal(trialIntentOutcome(leaving, me(true), now + 2, false), 'start', 'kept for the return page')
  assert.match(t('account.trial.notStarted', 'es-PE'), /prueba/)
})

// --- finding 11: "Conocer Pro" and "Sin anuncios con Pro" lead to Pro, not to a bare sign-in ---------

test('11: house-ad and no-ads links go to the prices (signed out) or checkout (signed in); the trial one keeps the intent', () => {
  assert.equal(houseCtaTarget('noads', false), 'prices-page')
  assert.equal(houseCtaTarget('noads', true), 'checkout')
  assert.equal(houseCtaTarget('annual', false), 'prices-page')
  assert.equal(houseCtaTarget('trial', false), 'signin-trial')
  assert.equal(houseCtaTarget('trial', true), 'account')
  assert.equal(houseCtaTarget('no-ads-link', false), 'prices-page')
  const src = readFileSync('src/components/account/AdSlot.tsx', 'utf8')
  assert.doesNotMatch(src, /onNoAds=\{\(\) => show\('main'\)\}/)
})

// --- finding 12: Creem and the past_due exception ------------------------------------------------------

test('12: without the Creem rail, /suscripcion and /precios do not name Creem; the cancel terms carry the past_due exception', () => {
  const noCreem: CloudConfig = { ...ON, rails: { peru: 'mercadopago', international: '' } }
  assert.equal(sellerView(noCreem).international, null)
  assert.equal(sellerView({ ...ON, rails: { peru: '', international: 'creem' } }).international, 'creem')
  const susc = render(h(SubscriptionContent, { stage: 'beta', cfg: noCreem, trialDays: 7 }))
  assert.doesNotMatch(susc, /Creem/)
  const withCreem = render(h(SubscriptionContent, { stage: 'beta', cfg: { ...ON, rails: { peru: '', international: 'creem' } }, trialDays: 7 }))
  assert.match(withCreem, /Creem/)
  const view = pricingView('beta', noCreem)
  assert.deepEqual(view.rows.map((r) => [r.market, r.railReady]), [['pe', true], ['world', false]])
  const precios = render(h(PricingContent, { view, trialDays: 7, onSubscribe: () => {} }))
  assert.doesNotMatch(precios, /Creem/)
  assert.ok(precios.includes(t('precios.rowNotYet', 'es-PE')))
  for (const lang of ['es-PE', 'es-ES', 'en'] as const) {
    assert.match(t('susc.cancel.body', lang), lang === 'en' ? /last payment/ : /último pago/, lang)
  }
})

// --- finding 13: report filters and rows in Spanish ----------------------------------------------------

test('13: report filters and rows show the Spanish labels, not the stored codes', () => {
  assert.equal(severityLabel('blocker'), 'Bloqueante')
  assert.equal(categoryLabel('unexplained-term'), 'Término no explicado')
  assert.equal(severityLabel('made-up'), 'made-up', 'an unknown code is shown as it is')
  const html = render(h(ReportBrowser, { scope: 'qa', renderDetail: () => null }))
  for (const v of [...REPORT_SEVERITY_VALUES, ...REPORT_CATEGORY_VALUES]) assert.doesNotMatch(html, new RegExp(`>${v}</option>`), v)
  assert.doesNotMatch(html, />in_progress<\/option>/)
  assert.match(html, />Bloqueante<\/option>/)
  const detail = readFileSync('src/components/account/ReportDetail.tsx', 'utf8')
  assert.doesNotMatch(detail, /\{report\.severity \?\? '—'\} · \{report\.category\}/)
})

// --- finding 14: the status note is a live region before it has text --------------------------------

test('14: StatusNote keeps its role=status container mounted while empty, so the later text is announced', () => {
  assert.match(render(h(StatusNote, { text: null })), /role="status"/)
  assert.match(render(h(StatusNote, { text: 'Listo' })), /role="status"[^>]*>.*Listo/)
  const form = readFileSync('src/components/account/EmailCodeForm.tsx', 'utf8')
  assert.match(form, /<InputOTP[^>]*autoFocus/)
  const plan = readFileSync('src/components/account/PlanSections.tsx', 'utf8')
  assert.match(plan, /<StatusNote[^>]*focusOnShow/)
})

// --- finding 15: fixed cards leave room for the focus and can be put off --------------------------------

test('15: the consent card can be put off without answering; no survey opens over it; the page reserves room below', () => {
  const base = { stage: 'sync' as const, mode: 'everywhere' as const, record: null, signals: { gpc: false, dnt: false }, country: null, measurementWanted: true, reopened: false }
  assert.equal(consentCardMode(base), 'ask')
  assert.equal(consentCardMode({ ...base, deferred: true }), 'hidden', '"Ahora no" hides it for this visit; the choice stays pending')
  assert.equal(consentCardMode({ ...base, deferred: true, reopened: true }), 'manage', 'the footer link still opens it')
  const input = { cap: { lastAt: null, byKind: {} }, sessionShown: false, nowMs: 0, qaMode: false, random: () => 0, firstVisitAt: null }
  assert.equal(canPrompt('gate_reason', input), true)
  assert.equal(canPrompt('gate_reason', { ...input, overlayOpen: true }), false)
  assert.equal(bottomReserve([]), '')
  assert.equal(bottomReserve([120, 200]), '216px', 'the tallest card plus its 16 px offset')
  assert.ok(t('consent.later', 'es-PE').length > 0)
})

test('email codes off (owner decision 2026-10-01, beta on Workers Free): no Microsoft message sends anyone to an email code', async () => {
  const { withoutEmailCode } = await import('@/lib/cloud/ms-callback')
  const tr = (k: string) => k
  const off = render(h(PhaseNote, { phase: { kind: 'ms_failed', detailKey: 'cuenta.ms.tenantBlocked', offerOtherWays: true }, tr, emailOn: false }))
  assert.match(off, /cuenta\.ms\.tenantBlockedNoEmail/)
  assert.match(off, /<button[^>]*>cuenta\.ms\.otherWaysNoEmail<\/button>/)
  const on = render(h(PhaseNote, { phase: { kind: 'ms_failed', detailKey: 'cuenta.ms.tenantBlocked', offerOtherWays: true }, tr, emailOn: true }))
  assert.match(on, /cuenta\.ms\.tenantBlocked(?!NoEmail)/)
  assert.equal(withoutEmailCode('account.error.linkRequiresEmailCode', false), 'account.error.linkRequiresEmailCodeNoEmail')
  assert.equal(withoutEmailCode('account.error.linkRequiresEmailCode', true), 'account.error.linkRequiresEmailCode')
  assert.equal(withoutEmailCode('cuenta.ms.cancelled', false), 'cuenta.ms.cancelled')
  for (const lang of ['es-PE', 'es-ES', 'en'] as const) {
    for (const k of ['cuenta.ms.tenantBlockedNoEmail', 'cuenta.ms.otherWaysNoEmail', 'account.error.linkRequiresEmailCodeNoEmail']) {
      const text = t(k, lang)
      assert.notEqual(text, k, `${k} exists in ${lang}`)
      assert.doesNotMatch(text, /código por correo|email code/i, `${k} in ${lang} does not mention the email code`)
    }
  }
})
