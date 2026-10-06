/**
 * The soft content gate (DESIGN-v2 §8.4, DESIGN-v3 §D). Pure: callers pass the section's 1-based
 * `index` (S01 = 1, as in the course data) and its id; nothing here imports '@/lib/course'.
 *
 * Packaging A (control, launch): sections 1..freeSections are free; the rest need Pro.
 * Packaging B (challenger, behind a flag): in 6+ the theory and I-do sub-steps are free too;
 * We-do, You-do, quiz and anything unrecognised need Pro.
 *
 * Grandfathering: on the first load where the gate is active, every section this device has
 * touched is snapshotted under `pyarcana-grandfather-v1` and stays open on this device forever.
 */
import type { LaunchStage, Packaging } from '@/lib/cloud/config'
import { CLOUD_CONFIG, isGatingStage } from '@/lib/cloud/config'
import type { AccessState } from '@/lib/cloud/access'
import { renameSectionId } from '@/lib/section-id-migrations'
import type { SanitizedProgressState } from '@/lib/progress-sanitize'
import { isPlainObject, readJson, writeJson, type KeyValueStorage } from '@/lib/cloud/storage'

export const GRANDFATHER_KEY = 'pyarcana-grandfather-v1'
export const FREE_SUBSTEPS_B: readonly string[] = ['theory', 'ido']

export type GateDecision = 'open' | 'pending' | 'locked'

export interface GateInput {
  packaging: Packaging
  /** 1-based section number (S01 = 1). */
  sectionIndex: number
  /** Active sub-step, or null for the section as a whole. */
  subStep: string | null
  access: AccessState
  grandfathered: boolean
  stage: LaunchStage
  freeSections: number
}

const positiveInt = (n: number) => Number.isInteger(n) && n > 0

/** True when this sub-step is free under packaging B (null = the section shell). */
function freeUnderB(subStep: string | null): boolean {
  return subStep === null || FREE_SUBSTEPS_B.includes(subStep)
}

export function gateDecision(i: GateInput): GateDecision {
  if (!isGatingStage(i.stage)) return 'open'
  if (!positiveInt(i.freeSections) || !positiveInt(i.sectionIndex)) return 'open'
  if (i.sectionIndex <= i.freeSections || i.grandfathered) return 'open'
  if (i.packaging === 'B' && freeUnderB(i.subStep)) return 'open'
  if (i.access === 'pro') return 'open'
  return i.access === 'unknown' ? 'pending' : 'locked'
}

export function isLocked(
  packaging: Packaging,
  sectionIndex: number,
  subStep: string | null,
  access: AccessState,
  grandfathered: boolean,
  stage: LaunchStage,
  freeSections: number = CLOUD_CONFIG.gate.freeSections
): boolean {
  return gateDecision({ packaging, sectionIndex, subStep, access, grandfathered, stage, freeSections }) === 'locked'
}

/** The stage the gate should use: a gating stage waits for gate.since; an unreadable date keeps it off. */
export function stageForGate(stage: LaunchStage, since: string, nowMs: number): LaunchStage {
  if (!isGatingStage(stage) || since === '') return stage
  const start = Date.parse(since)
  return Number.isFinite(start) && nowMs >= start ? stage : 'sync'
}

// --- grandfathering ------------------------------------------------------------------------

export interface GrandfatherSnapshot {
  v: 1
  takenAt: string
  sections: string[]
}

type ProgressIds = Pick<SanitizedProgressState, 'completedSections' | 'completedSubSteps' | 'bookmarks' | 'lastVisited'>

export function progressSectionIds(state: Partial<ProgressIds>): string[] {
  const ids = [
    ...(state.completedSections ?? []),
    ...Object.keys(state.completedSubSteps ?? {}),
    ...(state.bookmarks ?? []),
    ...(state.lastVisited ? [state.lastVisited] : []),
  ]
  return [...new Set(ids)]
}

export function readGrandfather(storage: KeyValueStorage | null): GrandfatherSnapshot | null {
  const raw = readJson(storage, GRANDFATHER_KEY)
  if (!isPlainObject(raw) || raw.v !== 1 || typeof raw.takenAt !== 'string') return null
  const sections = raw.sections
  if (!Array.isArray(sections) || !sections.every((s) => typeof s === 'string')) return null
  return { v: 1, takenAt: raw.takenAt, sections: sections as string[] }
}

/** Idempotent: an existing valid snapshot is returned untouched; otherwise one is taken now. */
export function ensureGrandfatherSnapshot(storage: KeyValueStorage | null, state: Partial<ProgressIds>, nowMs: number): GrandfatherSnapshot {
  const existing = readGrandfather(storage)
  if (existing) return existing
  const snapshot: GrandfatherSnapshot = { v: 1, takenAt: new Date(nowMs).toISOString(), sections: progressSectionIds(state) }
  writeJson(storage, GRANDFATHER_KEY, snapshot)
  return snapshot
}

export function isGrandfathered(snapshot: GrandfatherSnapshot | null, sectionId: string): boolean {
  if (!snapshot) return false
  const target = renameSectionId(sectionId)
  return snapshot.sections.some((id) => renameSectionId(id) === target)
}
