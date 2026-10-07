/**
 * Satisfaction prompts: when a prompt may appear (DESIGN-v3 §G). Pure caps; the copy lives in i18n.
 *
 * - None in QA mode, and none while the consent card is open (two fixed cards would cover the page).
 * - Global cap on unsolicited prompts: 1 per session and 1 per 7 days (`pyarcana-survey-cap-v1`).
 * - section_csat: sampled 1 in 3. nps: from day 14 after the first visit, then every 90 days at most.
 *   gate_reason: once per device.
 * - cancel_reason is an optional field inside a cancel flow the learner started: never capped, never
 *   blocking, and it does not consume the cap.
 */
import { isPlainObject, readJson, writeJson, type KeyValueStorage } from '@/lib/cloud/storage'

export const SURVEY_CAP_KEY = 'pyarcana-survey-cap-v1'
export const SURVEY_KINDS = ['section_csat', 'nps', 'gate_reason', 'cancel_reason'] as const
export type SurveyKind = (typeof SURVEY_KINDS)[number]

const DAY = 86400000
const GLOBAL_GAP = 7 * DAY
const NPS_AFTER_FIRST_VISIT = 14 * DAY
const NPS_GAP = 90 * DAY
const CSAT_SAMPLE = 1 / 3

export interface SurveyCap {
  lastAt: number | null
  byKind: Partial<Record<SurveyKind, number>>
}

const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

export function readSurveyCap(storage: KeyValueStorage | null): SurveyCap {
  const raw = readJson(storage, SURVEY_CAP_KEY)
  if (!isPlainObject(raw)) return { lastAt: null, byKind: {} }
  const byKind: SurveyCap['byKind'] = {}
  const kinds = isPlainObject(raw.byKind) ? raw.byKind : {}
  for (const kind of SURVEY_KINDS) if (finite(kinds[kind])) byKind[kind] = kinds[kind] as number
  return { lastAt: finite(raw.lastAt) ? raw.lastAt : null, byKind }
}

export interface PromptInput {
  cap: SurveyCap
  sessionShown: boolean
  nowMs: number
  qaMode: boolean
  random: () => number
  firstVisitAt: number | null
  /** Another fixed bottom card (the consent card) is open: no prompt over it. */
  overlayOpen?: boolean
}

function kindAllows(kind: SurveyKind, i: PromptInput): boolean {
  if (kind === 'section_csat') return i.random() <= CSAT_SAMPLE
  if (kind === 'gate_reason') return i.cap.byKind.gate_reason === undefined
  const lastNps = i.cap.byKind.nps
  const oldEnough = i.firstVisitAt !== null && i.nowMs - i.firstVisitAt >= NPS_AFTER_FIRST_VISIT
  return oldEnough && (lastNps === undefined || i.nowMs - lastNps >= NPS_GAP)
}

export function canPrompt(kind: SurveyKind, i: PromptInput): boolean {
  if (i.qaMode) return false
  if (kind === 'cancel_reason') return true
  if (i.sessionShown || i.overlayOpen === true) return false
  if (i.cap.lastAt !== null && i.nowMs - i.cap.lastAt < GLOBAL_GAP) return false
  return kindAllows(kind, i)
}

export function recordPrompt(storage: KeyValueStorage | null, kind: SurveyKind, nowMs: number): SurveyCap {
  const cap = readSurveyCap(storage)
  if (kind === 'cancel_reason') return cap
  const next: SurveyCap = { lastAt: nowMs, byKind: { ...cap.byKind, [kind]: nowMs } }
  writeJson(storage, SURVEY_CAP_KEY, next)
  return next
}
