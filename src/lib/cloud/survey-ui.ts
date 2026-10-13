/**
 * Satisfaction prompts: what may be sent and what triggers a prompt (DESIGN-v3 §G). The caps
 * (QA mode, 1 per session, 1 per 7 days, CSAT 1 in 3, NPS from day 14) live in surveys.ts.
 */
import type { ApiResult } from '@/lib/cloud/api'
import type { SurveyKind } from '@/lib/cloud/surveys'

export const GATE_REASONS = ['price', 'not_now', 'free_enough', 'unsure_value', 'other'] as const
export const CANCEL_REASONS = ['price', 'not_using', 'finished', 'technical', 'other'] as const
const TEXT_MAX = 500
const CID = /^[0-9a-f]{32}$/

export interface SurveyAnswer {
  score?: number
  reasonCode?: string
  text?: string
  sectionIndex?: number
  cid?: string | null
}

const intIn = (v: unknown, lo: number, hi: number): v is number => Number.isInteger(v) && (v as number) >= lo && (v as number) <= hi

function scoreOk(kind: SurveyKind, score: unknown): boolean {
  if (kind === 'section_csat') return intIn(score, 1, 5)
  if (kind === 'nps') return intIn(score, 0, 10)
  return score === undefined
}

function reasonOk(kind: SurveyKind, code: unknown): boolean {
  if (kind === 'gate_reason') return (GATE_REASONS as readonly unknown[]).includes(code)
  if (kind === 'cancel_reason') return (CANCEL_REASONS as readonly unknown[]).includes(code)
  return code === undefined
}

/** POST /v1/surveys body, or null when the answer is not one the worker should store. */
export function buildSurveyBody(kind: SurveyKind, a: SurveyAnswer): Record<string, unknown> | null {
  if (!scoreOk(kind, a.score) || !reasonOk(kind, a.reasonCode)) return null
  const body: Record<string, unknown> = { kind }
  if (a.score !== undefined) body.score = a.score
  if (a.reasonCode !== undefined) body.reasonCode = a.reasonCode
  const text = typeof a.text === 'string' ? a.text.trim() : ''
  if (text) body.text = text.slice(0, TEXT_MAX)
  if (intIn(a.sectionIndex, 1, 999)) body.sectionIndex = a.sectionIndex
  if (typeof a.cid === 'string' && CID.test(a.cid)) body.cid = a.cid
  return body
}

/**
 * The section the learner just completed on THIS device, or null: nothing was added, or the change
 * is a sync pull / 409 merge / archive restore / #import= handoff (remote = isApplyingRemote()).
 * Counting those would emit section_complete and open a CSAT prompt about work done elsewhere.
 */
export function localCompletion(prev: readonly string[], next: readonly string[], remote: boolean): string | null {
  if (remote) return null
  return next.find((id) => !prev.includes(id)) ?? null
}

export type SurveyTriggerInput =
  | { kind: 'completed'; prev: readonly string[]; next: readonly string[]; remote: boolean }
  | { kind: 'gate_dismissed'; sectionIndex: number }

export function surveyTrigger(i: SurveyTriggerInput): { kind: SurveyKind; sectionId?: string; sectionIndex?: number } | null {
  if (i.kind === 'gate_dismissed') return { kind: 'gate_reason', sectionIndex: i.sectionIndex }
  const added = localCompletion(i.prev, i.next, i.remote)
  return added ? { kind: 'section_csat', sectionId: added } : null
}
/**
 * What the survey card says after "Enviar": thanks only when the worker stored the answer. A
 * missing route (404), a refusal or no network says nothing was saved, so no learner is thanked
 * for feedback nobody will read.
 */
export function surveyOutcomeKey(result: ApiResult<unknown>): 'survey.thanks' | 'survey.notSaved' {
  return result.ok ? 'survey.thanks' : 'survey.notSaved'
}
