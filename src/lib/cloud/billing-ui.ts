/**
 * What the account and checkout panels show (DESIGN-v2 §8.8, v3 §I), as pure functions.
 *
 * - Plan status names where Pro comes from (paid, trial, gift, tester) and until when; an
 *   open-ended grant reads "indefinido".
 * - The checkout confirm panel offers ONE rail per market (Peru: PEN through Mercado Pago;
 *   elsewhere: USD through Creem as merchant of record) and pay buttons only in stage 'paid'.
 * - Remaining trial or gift days are kept as credit that starts when the paid period ends
 *   (access.mjs packs grants into uncovered time), so the panel can say so truthfully.
 * - The redirect goes only to the rail's own host, and only when the worker's amount and
 *   currency equal what the panel showed.
 * - The return page re-reads the provider with backoff and never calls a slow webhook a failure.
 */
import type { LaunchStage } from '@/lib/cloud/config'
import type { MePayload } from '@/lib/cloud/session'
import type { ActionResult, UiError } from '@/lib/cloud/account-api'
import { OFFER, formatMinor, railFor, type Cadence, type Currency, type Market } from '@/lib/cloud/offer'
import { fillTemplate } from '@/lib/cloud/ui-state'
import { t, type Language } from '@/lib/i18n'

const DAY = 86400

// --- plan status ---------------------------------------------------------------------------------

export interface PlanStatus {
  pro: boolean
  sourceKey: string | null
  endsAt: number | null
  indefinite: boolean
  pendingGrantDays: number
}

export function planStatus(me: MePayload, nowS: number): PlanStatus {
  const a = me.access
  const pro = a.isPro && (a.indefinite || a.accessEnd === null || a.accessEnd > nowS)
  return {
    pro,
    sourceKey: pro && a.source ? `account.plan.source.${a.source}` : null,
    endsAt: pro && !a.indefinite ? a.accessEnd : null,
    indefinite: pro && a.indefinite,
    pendingGrantDays: a.pendingGrantDays,
  }
}

const RENEWING = new Set(['active', 'past_due', 'pending'])

/** Free, trial and fixed-term gifts can subscribe; paid, open-ended or in-flight accounts cannot. */
export function canUpgrade(me: MePayload): boolean {
  const a = me.access
  if (a.isPro && (a.source === 'paid' || a.indefinite)) return false
  if (me.checkoutPending) return false
  return !me.subscriptions.some((s) => RENEWING.has(s.status))
}

/**
 * The cancel dialog's body, chosen by coverage rather than status. Once the paid period has ended
 * the worker keeps the sub Pro only through grace, which stops the moment the renewal is cancelled
 * (access.mjs). That happens for past_due and also for an 'active' sub whose renewal is still being
 * retried (a Mercado Pago preapproval stays 'authorized'), so only a paidThrough still in the
 * future may be promised "until the end of the period you already paid for".
 */
export function cancelBodyKey(sub: { paidThrough: number | null }, nowS: number): string {
  return sub.paidThrough !== null && sub.paidThrough > nowS ? 'account.subs.cancelBody' : 'account.subs.cancelBodyPastDue'
}

// --- checkout confirm panel -----------------------------------------------------------------------

export interface CheckoutViewInput {
  stage: LaunchStage
  rails: { peru: 'mercadopago' | ''; international: 'creem' | '' }
  market: Market
  cadence: Cadence
  me: MePayload | null
  nowS: number
}

export interface CheckoutView {
  showPay: boolean
  rail: 'mercadopago' | 'creem' | null
  priceLabel: string
  amountMinor: number
  currency: Currency
  needsPayerEmail: boolean
  /** Creem sells as merchant of record; Mercado Pago sells in the owner's name. */
  sellerIsMoR: boolean
  /** Whole days of trial, gift or tester Pro left, kept as credit after the paid period. */
  creditDays: number | null
}

function creditDays(me: MePayload | null, nowS: number): number | null {
  const a = me?.access
  if (!a || !a.isPro || a.indefinite || a.accessEnd === null || a.accessEnd <= nowS) return null
  return a.source === 'paid' || a.source === null ? null : Math.ceil((a.accessEnd - nowS) / DAY)
}

export function checkoutView(i: CheckoutViewInput): CheckoutView {
  const offer = OFFER[i.market]
  const amountMinor = offer[i.cadence]
  const rail = railFor(i.market, i.rails)
  return {
    showPay: i.stage === 'paid' && rail !== null,
    rail,
    priceLabel: formatMinor(amountMinor, offer.currency),
    amountMinor,
    currency: offer.currency,
    needsPayerEmail: rail === 'mercadopago',
    sellerIsMoR: rail === 'creem',
    creditDays: creditDays(i.me, i.nowS),
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface CheckoutBodyInput {
  rail: 'mercadopago' | 'creem'
  cadence: Cadence
  payerEmail: string
  country: string | null
  acceptTerms: boolean
  adultOrAuthorized: boolean
}

export function checkoutBody(i: CheckoutBodyInput): { ok: true; body: Record<string, unknown> } | { ok: false; key: string } {
  if (i.acceptTerms !== true || i.adultOrAuthorized !== true) return { ok: false, key: 'billing.error.boxes' }
  const plan = i.cadence === 'yearly' ? 'pro_yearly' : 'pro_monthly'
  const body: Record<string, unknown> = { provider: i.rail, plan }
  if (i.rail === 'mercadopago') {
    const email = i.payerEmail.trim()
    if (!EMAIL.test(email)) return { ok: false, key: 'billing.error.payerEmail' }
    body.payerEmail = email
  }
  if (i.country) body.country = i.country
  return { ok: true, body: { ...body, acceptTerms: true, adultOrAuthorized: true } }
}

const PROVIDER_HOSTS: Record<Currency, string> = { PEN: 'mercadopago.com.pe', USD: 'creem.io' }

function providerUrl(value: unknown, currency: Currency): string | null {
  if (typeof value !== 'string') return null
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return null
  }
  const host = PROVIDER_HOSTS[currency]
  const hostOk = url.hostname === host || url.hostname.endsWith(`.${host}`)
  return url.protocol === 'https:' && hostOk ? value : null
}

/** POST /v1/checkout answer -> where to send the buyer, or why not. */
export function checkoutRedirect(data: Record<string, unknown>, expected: { amountMinor: number; currency: Currency }): { ok: true; url: string } | { ok: false; key: string } {
  if (data.amountMinor !== expected.amountMinor || data.currency !== expected.currency) return { ok: false, key: 'billing.error.priceChanged' }
  const url = providerUrl(data.url, expected.currency)
  return url ? { ok: true, url } : { ok: false, key: 'account.error.unavailable' }
}

// --- checkout return ------------------------------------------------------------------------------

export const CHECKOUT_BACKOFF_MS: readonly number[] = [1500, 3000, 5000, 8000, 13000]

export type PollState = 'confirmed' | 'pending' | 'signed_out'

function confirmed(me: MePayload | null): boolean {
  if (!me) return false
  return (me.access.isPro && me.access.source === 'paid') || me.subscriptions.some((s) => s.status === 'active')
}

/** Wait, re-read (POST /v1/me/subscription/refresh), repeat; 'pending' after the last try. */
export async function pollCheckout(d: { refresh: () => Promise<ActionResult>; sleep: (ms: number) => Promise<void> }): Promise<{ state: PollState; me: MePayload | null }> {
  let last: MePayload | null = null
  for (const ms of CHECKOUT_BACKOFF_MS) {
    await d.sleep(ms)
    const r = await d.refresh()
    if (!r.ok && r.status === 401) return { state: 'signed_out', me: null }
    if (r.ok) last = r.me ?? last
    if (confirmed(last)) return { state: 'confirmed', me: last }
  }
  return { state: 'pending', me: last }
}

// --- text ---------------------------------------------------------------------------------------------

export function errorMessage(e: UiError, lang: Language): string {
  if (e.key === 'account.error.rateLimited' && e.minutes === undefined) return t('account.error.rateLimitedNoTime', lang)
  return fillTemplate(t(e.key, lang), { minutes: e.minutes ?? '' })
}

const LOCALES: Record<Language, string> = { 'es-PE': 'es-PE', 'es-ES': 'es-ES', en: 'en-US' }

export function formatDate(epochSeconds: number, lang: Language): string {
  return new Intl.DateTimeFormat(LOCALES[lang] ?? 'es-PE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(epochSeconds * 1000))
}
