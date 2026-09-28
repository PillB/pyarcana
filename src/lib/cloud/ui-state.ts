/**
 * Small pure decisions the account, gate and notice components render from (Stage C2).
 * Kept out of the components so each rule has a test and no component grows a branch it
 * cannot justify; nothing here imports '@/lib/course'.
 */
import { isGatingStage, normalizeOrigin, type CloudConfig, type ConsentMode, type LaunchStage } from '@/lib/cloud/config'
import type { AccessState } from '@/lib/cloud/access'
import { shouldAskConsent, type ConsentRecord, type PrivacySignals } from '@/lib/cloud/consent'
import { gateDecision, isGrandfathered, stageForGate, type GateDecision, type GrandfatherSnapshot } from '@/lib/cloud/gate'
import { IMPORT_PREFIX } from '@/lib/cloud/handoff'
import { t, type Language } from '@/lib/i18n'

// --- useIsSignedIn ----------------------------------------------------------------------------

/**
 * NextAuth (dynamic LMS) or the cloud account. A cached cloud account counts only where accounts
 * run (stage on); on github.io the stage is off and a stale cache is not a session.
 */
export function signedInFrom(i: { nextAuthUser: unknown; stage: LaunchStage; cloudAccountId: string | null }): boolean {
  if (i.nextAuthUser) return true
  return i.stage !== 'off' && typeof i.cloudAccountId === 'string' && i.cloudAccountId !== ''
}

// --- static-site notice -----------------------------------------------------------------------

export type StaticNoticeKey = 'notice.static.off' | 'notice.static.offFirebase' | 'notice.static.sync' | 'notice.static.gated'

/** Which truth the "Edición pública" notice tells. Firebase accounts exist only in stage off builds that configure it. */
export function staticNoticeKey(stage: LaunchStage, firebaseConfigured: boolean): StaticNoticeKey {
  if (isGatingStage(stage)) return 'notice.static.gated'
  if (stage === 'sync') return 'notice.static.sync'
  return firebaseConfigured ? 'notice.static.offFirebase' : 'notice.static.off'
}

/** Replace {name} placeholders; unknown names are left visible so a test catches them. */
export function fillTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, name: string) => (name in vars ? String(vars[name]) : whole))
}

export function staticNoticeText(stage: LaunchStage, firebaseConfigured: boolean, lang: Language, freeSections: number): string {
  return fillTemplate(t(staticNoticeKey(stage, firebaseConfigured), lang), { n: freeSections, next: freeSections + 1 })
}

// --- moved banner / handoff import --------------------------------------------------------------

export interface MovedInput {
  origin: string | null
  isStaticSite: boolean
  canonicalOrigin: string
  movedToCanonical: boolean
  hash: string
}

/** 'banner' on an old origin, 'import' on the canonical origin carrying #import=, else 'none'. */
export function movedState(i: MovedInput): 'none' | 'banner' | 'import' {
  const canonical = normalizeOrigin(i.canonicalOrigin)
  if (!i.isStaticSite || !i.movedToCanonical || !canonical || !i.origin) return 'none'
  if (i.origin !== canonical) return 'banner'
  return i.hash.startsWith(IMPORT_PREFIX) ? 'import' : 'none'
}

// --- consent card ------------------------------------------------------------------------------

export interface ConsentCardInput {
  stage: LaunchStage
  mode: ConsentMode
  record: ConsentRecord | null
  signals: PrivacySignals
  country: string | null
  /** Something on this site would measure (an enabled experiment). No card for nothing. */
  measurementWanted: boolean
  /** The learner opened it from the footer link to change the answer. */
  reopened: boolean
}

export function consentCardMode(i: ConsentCardInput): 'hidden' | 'ask' | 'manage' {
  if (i.stage === 'off') return 'hidden'
  if (i.reopened) return 'manage'
  return i.measurementWanted && shouldAskConsent(i.mode, i.record, i.signals, i.country) ? 'ask' : 'hidden'
}

// --- section gate as the page applies it ---------------------------------------------------------

export interface SectionGateInput {
  cfg: CloudConfig
  stage: LaunchStage
  access: AccessState
  /** 1-based section number (S01 = 1). */
  sectionIndex: number
  sectionId: string
  /** null until the first-load snapshot has been read or taken. */
  snapshot: GrandfatherSnapshot | null
  nowMs: number
}

/**
 * Packaging A over the whole section. B's lock-one-tab UI is not built (DESIGN-v3 §D allows leaving
 * it undone), so B falls back to A: more locked, never practice given away by a missing screen.
 * Without the grandfather snapshot the answer is 'pending' wherever a lock is possible.
 */
export function sectionGateState(i: SectionGateInput): GateDecision {
  const stage = stageForGate(i.stage, i.cfg.gate.since, i.nowMs)
  const base = { packaging: 'A' as const, sectionIndex: i.sectionIndex, subStep: null, access: i.access, stage, freeSections: i.cfg.gate.freeSections }
  const decision = gateDecision({ ...base, grandfathered: isGrandfathered(i.snapshot, i.sectionId) })
  if (decision === 'locked' && i.snapshot === null) return 'pending'
  return decision
}
