import test from 'node:test'
import assert from 'node:assert/strict'
import {
  planStatus,
  canUpgrade,
  checkoutView,
  checkoutBody,
  checkoutRedirect,
  pollCheckout,
  errorMessage,
  formatDate,
  CHECKOUT_BACKOFF_MS,
  cancelBodyKey,
} from '@/lib/cloud/billing-ui'
import { t, type Language } from '@/lib/i18n'
import { parseMe, type MePayload } from '@/lib/cloud/session'
import type { ActionResult } from '@/lib/cloud/account-api'

const NOW_S = Date.parse('2026-10-01T12:00:00Z') / 1000
const DAY = 86400
const me = (access: Record<string, unknown>, extra: Record<string, unknown> = {}): MePayload =>
  parseMe({ account: { id: 'acct_1', email: 'a@b.pe', trialAvailable: true }, access, ...extra })!

// --- plan status --------------------------------------------------------------------------------

test('plan status names the source and the end date, or "indefinite" for an open-ended gift', () => {
  assert.deepEqual(planStatus(me({ isPro: false }), NOW_S), { pro: false, sourceKey: null, endsAt: null, indefinite: false, pendingGrantDays: 0 })
  assert.deepEqual(planStatus(me({ isPro: true, source: 'trial', accessEnd: NOW_S + 3 * DAY }), NOW_S), {
    pro: true, sourceKey: 'account.plan.source.trial', endsAt: NOW_S + 3 * DAY, indefinite: false, pendingGrantDays: 0,
  })
  const tester = planStatus(me({ isPro: true, source: 'tester', accessEnd: null, indefinite: true }), NOW_S)
  assert.equal(tester.sourceKey, 'account.plan.source.tester')
  assert.equal(tester.indefinite, true)
  assert.equal(tester.endsAt, null)
  assert.equal(planStatus(me({ isPro: true, source: 'paid', accessEnd: NOW_S + DAY }), NOW_S).sourceKey, 'account.plan.source.paid')
  assert.equal(planStatus(me({ isPro: false, pendingGrantDays: 30 }), NOW_S).pendingGrantDays, 30)
})

test('upgrade is offered to free, trial and fixed-term gift accounts only', () => {
  assert.equal(canUpgrade(me({ isPro: false })), true)
  assert.equal(canUpgrade(me({ isPro: true, source: 'trial', accessEnd: NOW_S + DAY })), true)
  assert.equal(canUpgrade(me({ isPro: true, source: 'gift', accessEnd: NOW_S + DAY })), true)
  assert.equal(canUpgrade(me({ isPro: true, source: 'paid', accessEnd: NOW_S + DAY })), false)
  assert.equal(canUpgrade(me({ isPro: true, source: 'tester', indefinite: true })), false, 'nothing to buy')
  assert.equal(canUpgrade(me({ isPro: false }, { checkoutPending: true })), false, 'a payment is being confirmed')
  const sub = { id: 's', provider: 'creem', plan: 'pro_monthly', status: 'active' }
  assert.equal(canUpgrade(me({ isPro: false }, { subscriptions: [sub] })), false)
  assert.equal(canUpgrade(me({ isPro: false }, { subscriptions: [{ ...sub, status: 'canceled' }] })), true)
})

// --- checkout confirm panel ----------------------------------------------------------------------

const RAILS = { peru: 'mercadopago' as const, international: 'creem' as const }
const view = (p: Partial<Parameters<typeof checkoutView>[0]> = {}) =>
  checkoutView({ stage: 'paid', rails: RAILS, market: 'pe', cadence: 'monthly', me: me({ isPro: false }), nowS: NOW_S, ...p })

test('pay buttons render only in the paid stage and only on a configured rail', () => {
  assert.equal(view().showPay, true)
  assert.equal(view({ stage: 'beta' }).showPay, false)
  assert.equal(view({ stage: 'sync' }).showPay, false)
  assert.equal(view({ rails: { peru: '', international: 'creem' } }).showPay, false)
  assert.equal(view({ rails: { peru: '', international: 'creem' }, market: 'world' }).showPay, true)
})

test('one rail per market: Peru pays PEN through Mercado Pago, everyone else USD through Creem', () => {
  const pe = view()
  assert.equal(pe.rail, 'mercadopago')
  assert.equal(pe.priceLabel, 'S/ 19.90')
  assert.equal(pe.needsPayerEmail, true)
  assert.equal(pe.sellerIsMoR, false)
  const world = view({ market: 'world', cadence: 'yearly' })
  assert.equal(world.rail, 'creem')
  assert.equal(world.priceLabel, 'US$ 49.00')
  assert.equal(world.needsPayerEmail, false)
  assert.equal(world.sellerIsMoR, true)
  assert.equal(view({ cadence: 'yearly' }).priceLabel, 'S/ 119.90')
})

test('remaining trial or gift days are shown as credit kept after paying; paid or open-ended access has none', () => {
  assert.equal(view({ me: me({ isPro: true, source: 'trial', accessEnd: NOW_S + 3 * DAY + 60 }) }).creditDays, 4)
  assert.equal(view({ me: me({ isPro: true, source: 'gift', accessEnd: NOW_S + 10 * DAY }) }).creditDays, 10)
  assert.equal(view({ me: me({ isPro: false }) }).creditDays, null)
  assert.equal(view({ me: me({ isPro: true, source: 'tester', accessEnd: NOW_S + 2 * DAY }) }).creditDays, 2, 'fixed-term tester days pack like a gift')
  assert.equal(view({ me: me({ isPro: true, source: 'paid', accessEnd: NOW_S + 10 * DAY }) }).creditDays, null, 'a paid period is not credit')
  assert.equal(view({ me: me({ isPro: true, source: 'trial', accessEnd: NOW_S - 1 }) }).creditDays, null)
})

test('the checkout body needs both unticked boxes ticked and, on Mercado Pago, a payer email', () => {
  const base = { rail: 'mercadopago' as const, cadence: 'monthly' as const, payerEmail: 'yo@correo.pe', country: 'PE', acceptTerms: true, adultOrAuthorized: true }
  assert.deepEqual(checkoutBody(base), {
    ok: true,
    body: { provider: 'mercadopago', plan: 'pro_monthly', payerEmail: 'yo@correo.pe', country: 'PE', acceptTerms: true, adultOrAuthorized: true },
  })
  assert.deepEqual(checkoutBody({ ...base, acceptTerms: false }), { ok: false, key: 'billing.error.boxes' })
  assert.deepEqual(checkoutBody({ ...base, adultOrAuthorized: false }), { ok: false, key: 'billing.error.boxes' })
  assert.deepEqual(checkoutBody({ ...base, payerEmail: 'no-at-sign' }), { ok: false, key: 'billing.error.payerEmail' })
  const creem = checkoutBody({ ...base, rail: 'creem', cadence: 'yearly', payerEmail: '', country: null })
  assert.deepEqual(creem, { ok: true, body: { provider: 'creem', plan: 'pro_yearly', acceptTerms: true, adultOrAuthorized: true } })
})

test('the redirect happens only to the provider, and only when the worker charges the price shown', () => {
  const expected = { amountMinor: 1990, currency: 'PEN' as const }
  const ok = { url: 'https://www.mercadopago.com.pe/subscriptions/checkout?preapproval_id=1', amountMinor: 1990, currency: 'PEN' }
  assert.deepEqual(checkoutRedirect(ok, expected), { ok: true, url: ok.url })
  assert.deepEqual(checkoutRedirect({ ...ok, url: 'https://checkout.creem.io/ch_1', currency: 'USD', amountMinor: 799 }, { amountMinor: 799, currency: 'USD' }), {
    ok: true, url: 'https://checkout.creem.io/ch_1',
  })
  assert.deepEqual(checkoutRedirect({ ...ok, amountMinor: 2990 }, expected), { ok: false, key: 'billing.error.priceChanged' })
  assert.deepEqual(checkoutRedirect({ ...ok, currency: 'USD' }, expected), { ok: false, key: 'billing.error.priceChanged' })
  for (const url of ['http://www.mercadopago.com.pe/x', 'https://evil.example/mercadopago.com.pe', 'https://mercadopago.com.pe.evil.test/', 'https://evilmercadopago.com.pe/x', 'javascript:alert(1)', 42]) {
    assert.deepEqual(checkoutRedirect({ ...ok, url }, expected), { ok: false, key: 'account.error.unavailable' }, String(url))
  }
})

// --- checkout return ------------------------------------------------------------------------------

test('the return page re-reads the provider with backoff 1.5, 3, 5, 8, 13 s and stops when confirmed', async () => {
  assert.deepEqual(CHECKOUT_BACKOFF_MS, [1500, 3000, 5000, 8000, 13000])
  const slept: number[] = []
  const answers: ActionResult[] = [
    { ok: true, me: me({ isPro: false }, { checkoutPending: true }), data: {} },
    { ok: true, me: me({ isPro: true, source: 'paid', accessEnd: NOW_S + 30 * DAY }), data: {} },
  ]
  let calls = 0
  const r = await pollCheckout({ refresh: async () => answers[calls++], sleep: async (ms) => void slept.push(ms) })
  assert.equal(r.state, 'confirmed')
  assert.deepEqual(slept, [1500, 3000])
  assert.equal(calls, 2)
})

test('after the last try the page says it is still confirming (never "failed"), and a sign-out stops it', async () => {
  const slept: number[] = []
  const pending: ActionResult = { ok: true, me: me({ isPro: false }, { checkoutPending: true }), data: {} }
  const r = await pollCheckout({ refresh: async () => pending, sleep: async (ms) => void slept.push(ms) })
  assert.equal(r.state, 'pending')
  assert.deepEqual(slept, CHECKOUT_BACKOFF_MS)
  const out = await pollCheckout({ refresh: async () => ({ ok: false, error: { key: 'x' }, status: 401, reason: 'no_session' }), sleep: async () => {} })
  assert.equal(out.state, 'signed_out')
})

// --- message formatting -------------------------------------------------------------------------

test('messages fill the wait time, and a rate limit without one says "a few minutes"', () => {
  assert.equal(errorMessage({ key: 'account.error.rateLimited', minutes: 3 }, 'es-PE'), 'Hubo demasiados intentos. Vuelve a intentarlo en 3 min.')
  assert.match(errorMessage({ key: 'account.error.rateLimited' }, 'es-PE'), /unos minutos/)
  assert.match(errorMessage({ key: 'account.error.rateLimited' }, 'en'), /a few minutes/)
  assert.doesNotMatch(errorMessage({ key: 'account.error.rateLimited' }, 'en'), /\{minutes\}/)
})

test('dates are written in the interface language', () => {
  const ts = Date.parse('2026-10-15T15:00:00Z') / 1000
  assert.match(formatDate(ts, 'es-PE'), /15.*octubre.*2026/)
  assert.match(formatDate(ts, 'en'), /October 15, 2026|15 October 2026/)
})

// --- cancel dialog body -------------------------------------------------------------------------

const sub = (status: string, paidThrough: number | null) => ({ id: 's1', provider: 'creem', plan: 'pro_monthly', status, cancelAtPeriodEnd: false, paidThrough, manageUrl: null })

test('the cancel dialog promises Pro to the end of the period only while a paid period still covers now', () => {
  // access.mjs grants grace only to a renewing sub that is not cancelling, so cancelling a
  // sub whose paid period has ended (past_due, or an MP preapproval still 'authorized' while
  // it retries, which maps to 'active') ends the only coverage it has left.
  assert.equal(cancelBodyKey(sub('active', NOW_S + 10 * DAY), NOW_S), 'account.subs.cancelBody')
  assert.equal(cancelBodyKey(sub('active', NOW_S - 3 * DAY), NOW_S), 'account.subs.cancelBodyPastDue')
  assert.equal(cancelBodyKey(sub('active', NOW_S), NOW_S), 'account.subs.cancelBodyPastDue')
  assert.equal(cancelBodyKey(sub('active', null), NOW_S), 'account.subs.cancelBodyPastDue')
  assert.equal(cancelBodyKey(sub('past_due', NOW_S - 3 * DAY), NOW_S), 'account.subs.cancelBodyPastDue')
  const langs: Language[] = ['es-PE', 'es-ES', 'en']
  for (const lang of langs) {
    const body = t('account.subs.cancelBodyPastDue', lang)
    assert.notEqual(body, 'account.subs.cancelBodyPastDue', `${lang} text missing`)
    assert.notEqual(body, t('account.subs.cancelBody', lang))
    assert.doesNotMatch(body, /hasta el final|until the end/i)
  }
  assert.match(t('account.subs.cancelBodyPastDue', 'es-PE'), /termina al cancelar/)
})
