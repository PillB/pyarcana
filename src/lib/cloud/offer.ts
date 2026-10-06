/**
 * The static-edition price source (DESIGN-v2 §5, DESIGN-v3 §I). Amounts are integer minor units
 * and must equal the worker's PRICE_* vars in workers/billing/wrangler.toml; a test parses that
 * file and compares, so the page never shows a price the checkout does not charge.
 *
 * No EUR display: the international rail bills USD, and a price announced in a currency must be
 * payable in it (Ley 29571 art. 6.2).
 */

export type Market = 'pe' | 'world'
export type Cadence = 'monthly' | 'yearly'
export type Currency = 'PEN' | 'USD'

export interface MarketOffer {
  currency: Currency
  monthly: number
  yearly: number
}

export const OFFER: Readonly<Record<Market, MarketOffer>> = {
  pe: { currency: 'PEN', monthly: 1990, yearly: 11990 },
  world: { currency: 'USD', monthly: 799, yearly: 4900 },
}

const SYMBOL: Record<Currency, string> = { PEN: 'S/', USD: 'US$' }

function groupThousands(major: number): string {
  return String(major).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/** 'S/ 19.90', 'US$ 7.99'. Integer arithmetic only; throws rather than show a wrong price. */
export function formatMinor(amountMinor: number, currency: Currency): string {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) {
    throw new RangeError(`not a price in minor units: ${amountMinor}`)
  }
  const symbol = Object.prototype.hasOwnProperty.call(SYMBOL, currency) ? SYMBOL[currency] : null
  if (!symbol) throw new RangeError(`unsupported currency: ${String(currency)}`)
  const major = Math.floor(amountMinor / 100)
  const cents = String(amountMinor % 100).padStart(2, '0')
  return `${symbol} ${groupThousands(major)}.${cents}`
}

export function priceOf(market: Market, cadence: Cadence): { amountMinor: number; currency: Currency; label: string } {
  const offer = OFFER[market]
  const amountMinor = offer[cadence]
  return { amountMinor, currency: offer.currency, label: formatMinor(amountMinor, offer.currency) }
}

/** Saving of the yearly plan against 12 monthly charges, floored so the claim never overstates. */
export function annualSavingPercent(market: Market): number {
  const { monthly, yearly } = OFFER[market]
  return Math.floor(((12 * monthly - yearly) * 100) / (12 * monthly))
}

export interface MarketHint {
  /** ISO country from the worker's geo lookup, when known. */
  country?: string | null
  timeZone?: string
  language?: string
}

/**
 * Peru only on evidence of Peru: a PE country code, or (without a country) the Lima time zone or
 * an es-PE browser. A known non-PE country wins over the time zone. The checkout panel still lets
 * the buyer switch ("¿No estás en Perú?"), which changes price and rail together.
 */
export function defaultMarket(hint: MarketHint): Market {
  if (hint.country) return hint.country.toUpperCase() === 'PE' ? 'pe' : 'world'
  if (hint.timeZone === 'America/Lima') return 'pe'
  return hint.language?.toLowerCase() === 'es-pe' ? 'pe' : 'world'
}

export function railFor(
  market: Market,
  rails: { peru: 'mercadopago' | ''; international: 'creem' | '' }
): 'mercadopago' | 'creem' | null {
  if (market === 'pe') return rails.peru === 'mercadopago' ? 'mercadopago' : null
  return rails.international === 'creem' ? 'creem' : null
}
