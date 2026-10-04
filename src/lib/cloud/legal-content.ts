/**
 * Which config-driven paragraphs the legal pages add for accounts, ads and billing
 * (DESIGN-v2 §8.12, v3 §E). CloudLegalSection.tsx renders the blocks this returns; the words live
 * in i18n (legalc.*). Pure, so every "only when" is tested:
 *
 * - Nothing while accounts do not run here (stage off): the pages stay as they are today.
 * - Privacy covers the satisfaction surveys (what is kept, the link to the account, 2-year
 *   retention), since they are stored whether or not measurement was accepted.
 * - The ads paragraph only when an ad NETWORK is enabled (provider adsense/ethicalads AND its id).
 *   House ads are first-party promos: no request to anyone else, no cookie.
 * - The existing "sin cookies de terceros" statements are shown only while they are true
 *   (thirdPartyCookieClaimHolds): no network and no Google sign-in button, whose iframe and
 *   script come from accounts.google.com. Decided from the build's config, so the prerendered
 *   page and the hydrated page say the same thing.
 * - Processors are named only when the config uses them; the controller only when the owner has
 *   filled legal.sellerName.
 */
import { isGatingStage, type CloudConfig, type LaunchStage } from '@/lib/cloud/config'

export type LegalKind = 'privacy' | 'cookies' | 'data-rights' | 'terms'
export type LegalBlock =
  | 'controller'
  | 'accountData'
  | 'processors'
  | 'retention'
  | 'storageKeys'
  | 'measurement'
  | 'surveys'
  | 'ads'
  | 'googleSignIn'
  | 'session'
  | 'rights'
  | 'arcoDeadlines'
  | 'exportDelete'
  | 'trialClaim'
  | 'reports'
  | 'accountTerms'
  | 'subscription'

export type AdNetwork = 'adsense' | 'ethicalads'

/** The ad network that can load, or null (house ads and unconfigured networks load nothing). */
export function adNetwork(cfg: CloudConfig): AdNetwork | null {
  if (cfg.ads.provider === 'adsense' && cfg.ads.adsenseClient !== '') return 'adsense'
  if (cfg.ads.provider === 'ethicalads' && cfg.ads.ethicaladsPublisher !== '') return 'ethicalads'
  return null
}

/** True while no third party can set a cookie through this site under this build's config. */
export function thirdPartyCookieClaimHolds(cfg: CloudConfig): boolean {
  if (cfg.launchStage === 'off') return true
  return adNetwork(cfg) === null && cfg.googleClientId === ''
}

/**
 * True while no ad network can load through this site under this build's config, so "no
 * compartimos tu información con terceros para publicidad" stays true. Google sign-in does not
 * make it false (it is not advertising); thirdPartyCookieClaimHolds covers cookies.
 */
export function adSharingClaimHolds(cfg: CloudConfig): boolean {
  return cfg.launchStage === 'off' || adNetwork(cfg) === null
}

function withAds(blocks: LegalBlock[], cfg: CloudConfig): LegalBlock[] {
  return adNetwork(cfg) ? [...blocks, 'ads'] : blocks
}

function blocksFor(cfg: CloudConfig, kind: LegalKind, stage: LaunchStage): LegalBlock[] {
  switch (kind) {
    case 'privacy':
      return withAds(['controller', 'accountData', 'processors', 'retention', 'storageKeys', 'measurement', 'surveys', 'reports', 'rights', 'arcoDeadlines', 'trialClaim'], cfg)
    case 'cookies':
      // 'measurement': the consent card's "Más información" lands here, so this page explains it.
      return withAds(cfg.googleClientId ? ['session', 'storageKeys', 'measurement', 'googleSignIn'] : ['session', 'storageKeys', 'measurement'], cfg)
    case 'data-rights':
      return ['rights', 'arcoDeadlines', 'exportDelete', 'trialClaim']
    case 'terms':
      return isGatingStage(stage) ? ['accountTerms', 'subscription'] : ['accountTerms']
  }
}

export function legalBlocks(cfg: CloudConfig, kind: LegalKind, stage: LaunchStage): LegalBlock[] {
  return stage === 'off' ? [] : blocksFor(cfg, kind, stage)
}

export interface Processor {
  /** i18n suffix: legalc.proc.<key> */
  key: string
  /** Where it processes (ISO country); '' when this build cannot know it (email provider) or it is not verified. */
  country: string
}

/** Who processes account data for the owner, in the order a reader meets them. */
export function processors(cfg: CloudConfig): Processor[] {
  const list: Processor[] = [{ key: 'cloudflare', country: 'US' }]
  if (cfg.emailSignIn) list.push({ key: 'email', country: '' })
  // Our mailboxes (privacy@, security@, soporte@): whoever writes to us reaches Hostinger.
  list.push({ key: 'hostinger', country: '' })
  if (cfg.googleClientId) list.push({ key: 'google', country: 'US' })
  if (cfg.microsoftClientId) list.push({ key: 'microsoft', country: 'US' })
  if (cfg.rails.peru === 'mercadopago') list.push({ key: 'mercadopago', country: 'PE' })
  if (cfg.rails.international === 'creem') list.push({ key: 'creem', country: '' })
  const network = adNetwork(cfg)
  if (network) list.push({ key: network, country: 'US' })
  return list
}

export interface Controller {
  name: string
  ruc: string | null
  address: string | null
  email: string | null
}

const filled = (v: string): string | null => (v.trim() === '' ? null : v.trim())

/** The data controller from legal.*, or null until the owner fills sellerName. */
export function controllerOf(cfg: CloudConfig): Controller | null {
  const name = filled(cfg.legal.sellerName)
  if (!name) return null
  return { name, ruc: filled(cfg.legal.ruc), address: filled(cfg.legal.address), email: filled(cfg.legal.supportEmail) }
}
