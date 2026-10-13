/**
 * Ad eligibility and adapter choice (DESIGN-v3 §E, decision D-ORCH-06). Pure; the <AdSlot> in C2
 * renders what this returns.
 *
 * Eligibility: 'unknown' (reserve the box, show nothing) | 'none' | 'test' | 'free'.
 * - stage off: nothing at all. Only the course route carries ads (an allowlist, so a new route is
 *   ad-free until someone decides otherwise).
 * - QA test mode or "Previsualizar anuncios": labelled placeholders for anyone, zero requests.
 * - Owner decision 2026-10-01: ads are ON by default for every account (free, gift, tester, admin);
 *   paid subscribers and running trials see none, and an admin can switch any account off. The
 *   live /v1/me answer (`me.ads.show`) decides. Without one on this load (offline, served from the
 *   signed licence) a Pro licence means no ads and everyone else is 'free'.
 * - Staff (admins, testers) never get a real network creative: an invalid click can close the
 *   network account, so a network adapter becomes the labelled test placeholder for them.
 * Adapter for 'free': house promos by default (no network, no cookies). Networks are built but
 * off: EthicalAds only in the desktop right rail; AdSense only after an in-slot opt-in with an
 * 18+ attestation, never in the EEA/UK/CH, never without a geo answer, and never for signed-in
 * users who have not attested 18+ (house only).
 */
import type { CloudConfig, LaunchStage } from '@/lib/cloud/config'
import type { AccessState } from '@/lib/cloud/access'
import type { QaMode } from '@/lib/cloud/qa-mode'
import { CONSENT_REGION } from '@/lib/cloud/consent'

export type AdEligibility = 'unknown' | 'none' | 'test' | 'free'
export type AdAdapter = 'none' | 'reserved' | 'test' | 'house' | 'ethicalads' | 'adsense' | 'adsense_optin'
export type AdPlacement = 'section_end' | 'resources_end' | 'rail' | 'glossary_footer'

/** Routes that may carry an ad slot. Everything else is excluded. */
export const AD_ROUTES: readonly string[] = ['/']

/** Named for review and tests; enforcement is the allowlist above. */
export const AD_EXCLUDED_ROUTES: readonly string[] = [
  '/cuenta', '/admin', '/qa', '/precios', '/suscripcion', '/regalos', '/verify', '/404',
  '/privacy', '/cookies', '/terms', '/data-rights', '/disclaimer', '/acceptable-use',
  '/credential-policy', '/security', '/badge-notice', '/external-resources',
]

export function routePath(pathname: string, basePath = ''): string {
  const stripped = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname
  const trimmed = stripped.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

export function isAdRoute(pathname: string, basePath = ''): boolean {
  return AD_ROUTES.includes(routePath(pathname, basePath))
}

export interface AdEligibilityInput {
  stage: LaunchStage
  pathname: string
  basePath?: string
  qa: QaMode
  access: AccessState
  /** `me.ads.show` from THIS load's live /v1/me; null when there is none (signed out, offline, old worker). */
  liveAds: boolean | null
}

export function adEligibility(i: AdEligibilityInput): AdEligibility {
  if (i.stage === 'off' || !isAdRoute(i.pathname, i.basePath)) return 'none'
  if (i.qa.testMode || i.qa.adPreview) return 'test'
  if (i.access === 'unknown') return 'unknown'
  if (i.liveAds !== null) return i.liveAds ? 'free' : 'none'
  return i.access === 'pro' ? 'none' : 'free'
}

export interface AdapterInput {
  eligibility: AdEligibility
  ads: CloudConfig['ads']
  placement: AdPlacement
  signedIn: boolean
  /** Signed-in users: an 18+ attestation stored on the account. */
  adultAttested: boolean
  geo: { status: 'unknown' | 'ok' | 'failed'; country: string | null }
  /** The in-slot "¿Mostrar anuncios de Google aquí? … Soy mayor de 18 años" answer. */
  adsenseOptIn: 'unset' | 'accepted' | 'declined'
  desktop: boolean
  /** Admin or tester: a network adapter turns into the test placeholder (no invalid clicks). */
  staff: boolean
}

/**
 * EthicalAds runs only in the desktop right rail (its policy: one EthicalAds ad per page, above the
 * fold). Every other placement keeps the house promo; a rail that cannot show the network (narrow
 * screen, no publisher id) stays empty rather than adding a second promo.
 */
function ethicalAdsAdapter(i: AdapterInput): AdAdapter {
  if (i.placement !== 'rail') return 'house'
  return i.ads.ethicaladsPublisher !== '' && i.desktop ? 'ethicalads' : 'none'
}

function adsenseAdapter(i: AdapterInput): AdAdapter {
  const slot = Object.prototype.hasOwnProperty.call(i.ads.adsenseSlots, i.placement) ? i.ads.adsenseSlots[i.placement] : ''
  if (!i.ads.adsenseClient || !slot) return 'house'
  if (i.geo.status !== 'ok' || !i.geo.country || CONSENT_REGION.has(i.geo.country.toUpperCase())) return 'house'
  if (i.signedIn && !i.adultAttested) return 'house'
  if (i.adsenseOptIn === 'accepted') return 'adsense'
  return i.adsenseOptIn === 'unset' ? 'adsense_optin' : 'house'
}

const FIXED: Record<Exclude<AdEligibility, 'free'>, AdAdapter> = { none: 'none', unknown: 'reserved', test: 'test' }
const NETWORK: ReadonlySet<AdAdapter> = new Set(['ethicalads', 'adsense', 'adsense_optin'])

function freeAdapter(i: AdapterInput): AdAdapter {
  if (i.ads.provider === 'ethicalads') return ethicalAdsAdapter(i)
  if (i.ads.provider === 'adsense') return adsenseAdapter(i)
  return 'house'
}

export function chooseAdapter(i: AdapterInput): AdAdapter {
  // The rail exists only for EthicalAds; with any other provider it renders nothing at all.
  if (i.placement === 'rail' && i.ads.provider !== 'ethicalads') return 'none'
  if (i.eligibility !== 'free') return FIXED[i.eligibility]
  const adapter = freeAdapter(i)
  return i.staff && NETWORK.has(adapter) ? 'test' : adapter
}

const HOSTS: Partial<Record<AdAdapter, string[]>> = {
  ethicalads: ['https://media.ethicalads.io', 'https://server.ethicalads.io'],
  adsense: ['https://pagead2.googlesyndication.com', 'https://googleads.g.doubleclick.net', 'https://tpc.googlesyndication.com'],
}

/** Third-party origins an adapter contacts; [] for everything that stays first-party. */
export function networkHosts(adapter: AdAdapter): string[] {
  return HOSTS[adapter] ?? []
}

export function scriptUrl(adapter: AdAdapter, ads: CloudConfig['ads']): string | null {
  if (adapter === 'ethicalads') return 'https://media.ethicalads.io/media/client/ethicalads.min.js'
  if (adapter === 'adsense') return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ads.adsenseClient)}`
  return null
}
