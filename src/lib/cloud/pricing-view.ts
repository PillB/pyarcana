/**
 * What /precios and /suscripcion show (DESIGN-v2 §8.9, v3 §D and §I), as pure functions.
 *
 * - Prices come from offer.ts only (pinned to wrangler.toml), so the page never shows a price the
 *   checkout does not charge. Two rows: Peru in PEN (IGV included, Mercado Pago) and the rest of
 *   the world in USD (Creem sells as merchant of record). No EUR, no Team plan.
 * - Nothing is offered in stages off and sync (sync has accounts and no prices).
 * - A pay button exists only in 'paid' and only for a market whose rail is configured; otherwise
 *   the page says payments open soon.
 * - The seller for Peru is the owner's legal identity; the complaints-book link must be https.
 */
import { isGatingStage, type CloudConfig, type LaunchStage } from '@/lib/cloud/config'
import { annualSavingPercent, OFFER, formatMinor, railFor, type Currency, type Market } from '@/lib/cloud/offer'
import { safeHttpsUrl } from '@/lib/cloud/session'

export interface PriceRow {
  market: Market
  currency: Currency
  monthly: string
  yearly: string
  savingPct: number
  payRail: 'mercadopago' | 'creem' | null
}

export interface PricingView {
  available: boolean
  payOpen: boolean
  rows: PriceRow[]
  freeSections: number
  proFrom: number
}

const MARKETS: readonly Market[] = ['pe', 'world']

export function pricingView(stage: LaunchStage, cfg: CloudConfig): PricingView {
  const rows = MARKETS.map((market): PriceRow => {
    const offer = OFFER[market]
    return {
      market,
      currency: offer.currency,
      monthly: formatMinor(offer.monthly, offer.currency),
      yearly: formatMinor(offer.yearly, offer.currency),
      savingPct: annualSavingPercent(market),
      payRail: stage === 'paid' ? railFor(market, cfg.rails) : null,
    }
  })
  const freeSections = cfg.gate.freeSections
  return {
    available: isGatingStage(stage),
    payOpen: rows.some((r) => r.payRail !== null),
    rows,
    freeSections,
    proFrom: freeSections + 1,
  }
}

export interface OwnerIdentity {
  name: string
  ruc: string
  address: string
  email: string
  complaintsBookUrl: string | null
}

/** Who sells: the owner (Peru, when every legal field is filled) and Creem (international). */
export function sellerView(cfg: CloudConfig): { owner: OwnerIdentity | null; international: 'creem' } {
  const l = cfg.legal
  const complete = [l.sellerName, l.ruc, l.address, l.supportEmail].every((v) => v.trim() !== '')
  const owner = complete
    ? { name: l.sellerName.trim(), ruc: l.ruc.trim(), address: l.address.trim(), email: l.supportEmail.trim(), complaintsBookUrl: safeHttpsUrl(l.complaintsBookUrl) }
    : null
  return { owner, international: 'creem' }
}
