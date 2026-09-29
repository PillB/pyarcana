/**
 * Public configuration for PyArcana accounts, access, ads and measurement on the static site.
 *
 * Everything here is PUBLIC: it ships in the browser bundle. Secrets live only in the worker
 * (`wrangler secret put`). The owner edits this object to launch; the shipped defaults keep the
 * site exactly as it is today (stage 'off': no account UI, no gate, no ads, no requests).
 *
 * DESIGN-v2 §8.1 extended by DESIGN-v3 (one origin, apiBaseUrl '/api', Microsoft, licence keys,
 * packaging, ads, consent, experiments).
 */
import { getPlanByCode } from '@/lib/subscription-plans'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'

export type LaunchStage = 'off' | 'sync' | 'beta' | 'paid'
export const LAUNCH_STAGES: readonly LaunchStage[] = ['off', 'sync', 'beta', 'paid']
export type Packaging = 'A' | 'B'
export type AdProvider = 'house' | 'ethicalads' | 'adsense'
export type ConsentMode = 'everywhere' | 'eea-only' | 'off'

/** An ES256 public key the worker signs licence tokens with (GET /v1/jwks publishes it). */
export interface LicencePublicKey {
  kty: 'EC'
  crv: 'P-256'
  x: string
  y: string
  kid: string
  alg?: 'ES256'
  use?: 'sig'
}

export interface LegalIdentity {
  sellerName: string
  ruc: string
  address: string
  complaintsBookUrl: string
  supportEmail: string
}

export interface CloudConfig {
  launchStage: LaunchStage
  /** https://pyarcana.dev (DESIGN-v3 §K) — accounts run only here (DESIGN-v3 §A). */
  canonicalOrigin: string
  /**
   * The owner confirms the canonical site is live (DESIGN-v3 §K). Until then no origin shows the
   * "PyArcana se mudó" banner and the canonical origin accepts no #import= handoff.
   */
  movedToCanonical: boolean
  /** Same-origin worker route in production; http://localhost:8787 in local dev. */
  apiBaseUrl: string
  googleClientId: string
  microsoftClientId: string
  /**
   * The version of the Terms the sign-in panel links to. It must equal the worker's TERMS_VERSION;
   * the worker refuses a sign-in with any other value (400 terms_required).
   */
  termsVersion: string
  /** 'common' admits personal plus work/school accounts; 'consumers' personal only. */
  microsoftAuthority: string
  licence: { publicKeys: LicencePublicKey[] }
  gate: {
    /** Sections 1..freeSections are free. A non-positive or non-integer value turns the gate off. */
    freeSections: number
    /** ISO date the gate starts; '' = as soon as the stage is beta or paid. */
    since: string
    /**
     * 'A' (launch control): the whole section. 'B' is implemented in the pure gate (gate.ts) but its
     * UI -- a lock over one tab panel -- is NOT built, so the page applies A when B is set.
     */
    packaging: Packaging
  }
  rails: { peru: 'mercadopago' | ''; international: 'creem' | '' }
  legal: LegalIdentity
  providerPortals: { mercadopago: string; creem: string }
  ads: {
    provider: AdProvider
    adsenseClient: string
    /** placement -> AdSense slot id */
    adsenseSlots: Record<string, string>
    ethicaladsPublisher: string
  }
  consent: { mode: ConsentMode }
  experiments: { allowAutomation: boolean }
}

const FREE_PLAN_SECTIONS = getPlanByCode('free')?.maxSections

export const CLOUD_CONFIG: CloudConfig = {
  launchStage: 'off',
  // DESIGN-v3 §K/§L prefill. Inert while launchStage is 'off' (effectiveStage) and movedToCanonical
  // is false (no banner, no #import=), so github.io stays exactly as it is.
  canonicalOrigin: 'https://pyarcana.dev',
  movedToCanonical: false,
  apiBaseUrl: '/api',
  googleClientId: '',
  microsoftClientId: '',
  termsVersion: '',
  microsoftAuthority: 'common',
  licence: { publicKeys: [] },
  gate: { freeSections: FREE_PLAN_SECTIONS ?? 0, since: '', packaging: 'A' },
  rails: { peru: '', international: '' },
  legal: { sellerName: '', ruc: '', address: '', complaintsBookUrl: '', supportEmail: 'soporte@pyarcana.dev' },
  providerPortals: { mercadopago: 'https://www.mercadopago.com.pe/subscriptions', creem: '' },
  ads: { provider: 'house', adsenseClient: '', adsenseSlots: {}, ethicaladsPublisher: '' },
  consent: { mode: 'everywhere' },
  experiments: { allowAutomation: false },
}

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1'])

/**
 * The bare origin of a configured URL, or null. https only, except http on localhost for the
 * local E2E; no credentials, path, query or fragment, so a mistyped value fails closed.
 */
export function normalizeOrigin(value: string): string | null {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return null
  }
  const schemeOk = url.protocol === 'https:' || (url.protocol === 'http:' && LOCAL_HOSTS.has(url.hostname))
  const bare = url.pathname === '/' && !url.search && !url.hash && !url.username && !url.password
  return schemeOk && bare ? url.origin : null
}

function filled(value: string): boolean {
  return typeof value === 'string' && value.trim() !== ''
}

/** Paid needs a rail to charge through and a complete seller identity (DESIGN-v2 §8.1, v3-delta). */
export function paidReady(cfg: CloudConfig): boolean {
  const rail = cfg.rails.peru === 'mercadopago' || cfg.rails.international === 'creem'
  return rail && Object.values(cfg.legal).every(filled)
}

export interface StageEnv {
  origin: string | null
  isStaticSite: boolean
}

/**
 * The stage this page load actually runs at.
 * - off unless: a known stage, the static build, an API base, and origin === canonical origin
 *   (so github.io, previews and the dynamic LMS never show accounts);
 * - paid degrades to beta without a rail and every legal field.
 */
export function effectiveStage(cfg: CloudConfig, env: StageEnv): LaunchStage {
  if (!LAUNCH_STAGES.includes(cfg.launchStage) || cfg.launchStage === 'off') return 'off'
  if (!env.isStaticSite || !filled(cfg.apiBaseUrl)) return 'off'
  const canonical = normalizeOrigin(cfg.canonicalOrigin)
  if (!canonical || env.origin !== canonical) return 'off'
  if (cfg.launchStage === 'paid' && !paidReady(cfg)) return 'beta'
  return cfg.launchStage
}

/** The stage for this browser page; 'off' while rendering on the server. */
export function currentStage(cfg: CloudConfig = CLOUD_CONFIG): LaunchStage {
  if (typeof window === 'undefined') return 'off'
  return effectiveStage(cfg, { origin: window.location.origin, isStaticSite: IS_STATIC_SITE })
}

export function isGatingStage(stage: LaunchStage): boolean {
  return stage === 'beta' || stage === 'paid'
}
