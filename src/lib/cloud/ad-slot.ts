/**
 * The pieces of <AdSlot> that are rules rather than markup (DESIGN-v3 §E; research-ads.md).
 *
 * - AdSense only after an in-slot opt-in WITH an 18+ attestation; a decline is remembered and
 *   falls back to a house ad. Stored per device under `pyarcana-adsense-optin-v1`.
 * - Geo (GET /v1/geo) counts only as a two-letter country; anything else fails closed (house).
 * - House creatives never promise what the stage cannot deliver: no annual-plan promo before
 *   payments open, no trial promo to someone who cannot start one, nothing while there is no Pro.
 *   The pick is stable per section, so the slot never rotates on a sub-step change.
 * - Every placement reserves a fixed box before anything loads (CLS), except a house promo whose
 *   experiment arm is still loading (slotView).
 */
import type { ApiResult } from '@/lib/cloud/api'
import { isGatingStage, type AdProvider, type LaunchStage } from '@/lib/cloud/config'
import type { AdAdapter, AdPlacement } from '@/lib/cloud/ads'
import { fnv1a32 } from '@/lib/cloud/experiments'
import { isPlainObject, readJson, writeJson, type KeyValueStorage } from '@/lib/cloud/storage'

export const ADSENSE_OPTIN_KEY = 'pyarcana-adsense-optin-v1'
export const HOUSE_CREATIVES = ['trial', 'annual', 'noads'] as const
export type HouseCreative = (typeof HOUSE_CREATIVES)[number]

/** Fixed box heights; the house card is written to fit 200 px at a 320 px viewport. */
export const SLOT_HEIGHT_PX: Readonly<Record<AdPlacement, number>> = {
  section_end: 200,
  resources_end: 200,
  rail: 320,
  glossary_footer: 120,
}

export type OptIn = 'unset' | 'accepted' | 'declined'

export function readAdsenseOptIn(storage: KeyValueStorage | null): OptIn {
  const raw = readJson(storage, ADSENSE_OPTIN_KEY)
  if (!isPlainObject(raw) || raw.v !== 1) return 'unset'
  if (raw.value === 'declined') return 'declined'
  return raw.value === 'accepted' && raw.adult === true ? 'accepted' : 'unset'
}

/** false (and nothing stored) for an accept without the attestation. */
export function writeAdsenseOptIn(storage: KeyValueStorage | null, value: 'accepted' | 'declined', adultAttested: boolean, nowMs: number): boolean {
  if (value === 'accepted' && adultAttested !== true) return false
  return writeJson(storage, ADSENSE_OPTIN_KEY, { v: 1, value, adult: adultAttested === true, at: new Date(nowMs).toISOString() })
}

const COUNTRY = /^[A-Z]{2}$/

export function parseGeo(result: ApiResult<Record<string, unknown>>): { status: 'ok' | 'failed'; country: string | null } {
  const raw = result.ok && typeof result.data.country === 'string' ? result.data.country.toUpperCase() : ''
  return COUNTRY.test(raw) ? { status: 'ok', country: raw } : { status: 'failed', country: null }
}

/**
 * The house promo for a section. `hasPro`: a gift or tester holder (owner decision 2026-10-01: they
 * see ads too). A trial promo would be pointless to them, so they get the "a subscription removes
 * ads" promo in any gating stage (and the annual one once paying exists).
 */
export function houseCreative(i: { sectionKey: string; stage: LaunchStage; trialOffered: boolean; hasPro?: boolean }): HouseCreative | null {
  const gating = isGatingStage(i.stage)
  if (i.hasPro) {
    const forPro = HOUSE_CREATIVES.filter((c) => (c === 'noads' && gating) || (c === 'annual' && i.stage === 'paid'))
    return forPro.length ? forPro[fnv1a32(i.sectionKey) % forPro.length] : null
  }
  const candidates = HOUSE_CREATIVES.filter((c) => {
    if (c === 'trial') return gating && i.trialOffered
    if (c === 'annual') return i.stage === 'paid'
    return i.stage === 'paid' || (gating && i.trialOffered)
  })
  if (candidates.length === 0) return null
  return candidates[fnv1a32(i.sectionKey) % candidates.length]
}

/** Experiment ads_house_v1: arm 'none' is the control (no promo slot); no experiment = house. */
export function houseArmShows(arm: string | null): boolean {
  return arm !== 'none'
}

const KEYWORD = /^[a-z0-9]{2,30}$/
const MAX_KEYWORDS = 20

/** data-ea-keywords: pipe-separated, English, at most 20 (EthicalAds MAX_KEYWORDS). */
export function ethicalAdsKeywords(sectionId: string): string {
  const parts = sectionId.split('-').filter((p) => KEYWORD.test(p))
  return ['python', 'data-science', ...parts].slice(0, MAX_KEYWORDS).join('|')
}

/**
 * What a slot renders, or null for no box at all.
 * - A house promo renders only once its creative is decided. While the ads_house_v1 arm loads
 *   (creative undefined), and while access is still unknown with the house provider (chosen
 *   'reserved'), there is NO box: the control arm shows no slot, and a box that appeared and then
 *   collapsed would add a layout shift to control only and bias the CLS guardrail. House promos
 *   load no script, so there is nothing to reserve height for.
 * - A configured network keeps its reserved box while access is unknown: its script and creative
 *   arrive later, and the height must be held before they do (DESIGN-v3 §E).
 */
export function slotView(chosen: AdAdapter, creative: HouseCreative | null | undefined, provider: AdProvider): AdAdapter | null {
  if (chosen === 'none') return null
  if (chosen === 'house') return creative ? 'house' : null
  if (chosen === 'reserved' && provider === 'house') return null
  return chosen
}
/**
 * The desktop right rail (EthicalAds, DESIGN-v3 §E): shown only where it fits beside the course
 * column (max-w-6xl = 1152 px) with its 180 px image unit and gutters, so the EthicalAds client
 * only runs where its ad is actually visible. The same width is the CSS breakpoint in AdSlot.
 */
export const RAIL_MIN_WIDTH_PX = 1600

export function railMediaQuery(): string {
  return `(min-width: ${RAIL_MIN_WIDTH_PX}px)`
}
