/**
 * Retest checks and the QA supervisor (owner request 2026-11-19). The worker contract is
 * workers/billing/src/report-verify.mjs (POST/DELETE /v1/qa/reports/:id/verifications) and
 * report-triage.mjs handleReviewReport (PATCH /v1/qa/reports/:id); gate.mjs decides who passes.
 *
 * - A tester, a QA supervisor or an admin records one check per report: it still happens, it does
 *   not happen for me, or a retest found it fixed. A check never changes the report's status.
 * - A QA supervisor (or an admin) closes or reopens a report: status and duplicate link only, no
 *   admin note and no reporter identity.
 * - Which window a person gets is decided here from /v1/me, but only to avoid showing controls the
 *   worker would refuse: the worker checks every route itself.
 */
import { REPORT_STATUSES, type Built, type VerifiedCounts } from '@/lib/cloud/admin-api'
import type { MePayload } from '@/lib/cloud/session'
import { isPlainObject } from '@/lib/cloud/storage'

/** workers/billing/src/report-verify.mjs VERIFICATION_RESULTS. */
export const VERIFICATION_RESULTS = ['reproduced', 'not_reproduced', 'fixed'] as const
export type VerificationResult = (typeof VERIFICATION_RESULTS)[number]

/** workers/billing/src/report-verify.mjs VERIFICATION_NOTE_MAX. */
export const VERIFICATION_NOTE_MAX = 1000

/** What the reports window offers: everything (admin), closing reports (supervisor), checks (tester). */
export type QaAccess = 'admin' | 'supervisor' | 'tester' | null

export function qaAccess(me: MePayload | null): QaAccess {
  if (!me) return null
  if (me.account.isAdmin) return 'admin'
  if (me.account.roles.includes('qa_supervisor')) return 'supervisor'
  return me.account.roles.includes('tester') ? 'tester' : null
}

/** Whether this person may close or reopen a report (PATCH /v1/qa/reports/:id). */
export function canReview(access: QaAccess): boolean {
  return access === 'admin' || access === 'supervisor'
}

const REPORT_ID = /^rep_[A-Za-z0-9_-]{1,40}$/
const SHA = /^[0-9a-f]{7,64}$/i

function fail(key: string): Built {
  return { ok: false, key }
}

/** POST /v1/qa/reports/:id/verifications and its DELETE; null for an id the worker never issues. */
export function verificationsPath(reportId: string): string | null {
  return REPORT_ID.test(reportId) ? `/v1/qa/reports/${reportId}/verifications` : null
}

/** PATCH /v1/qa/reports/:id (the supervisor's change). */
export function reviewPath(reportId: string): string | null {
  return REPORT_ID.test(reportId) ? `/v1/qa/reports/${reportId}` : null
}

/**
 * The body of a check. The build is the one this page runs (public/deployment.json), so the check
 * says which version was retested; a build that is not a commit id is left out, not sent.
 */
export function verifyRequest(result: string, note: string, deploymentSha: string | null): Built {
  if (!(VERIFICATION_RESULTS as readonly string[]).includes(result)) return fail('qarev.error.result')
  const text = note.trim()
  if (text.length > VERIFICATION_NOTE_MAX) return fail('qarev.error.note')
  const body: Record<string, unknown> = { result }
  if (text) body.note = text
  if (deploymentSha && SHA.test(deploymentSha)) body.deploymentSha = deploymentSha
  return { ok: true, body }
}

/** The supervisor's change, with only what changed; a duplicate names the report it repeats. */
export function reviewRequest(current: { status: string; duplicateOf: string | null }, next: { status: string; duplicateOf: string }): Built {
  if (!(REPORT_STATUSES as readonly string[]).includes(next.status)) return fail('adm.error.status')
  const duplicateOf = next.duplicateOf.trim()
  if (next.status === 'duplicate' && !REPORT_ID.test(duplicateOf)) return fail('adm.error.duplicateOf')
  const body: Record<string, unknown> = {}
  if (next.status !== current.status) body.status = next.status
  if (next.status === 'duplicate' && duplicateOf !== current.duplicateOf) body.duplicateOf = duplicateOf
  return Object.keys(body).length ? { ok: true, body } : fail('adm.error.nothing')
}

export interface Verification {
  result: VerificationResult
  note: string | null
  deploymentSha: string | null
  createdAt: number
  updatedAt: number
  mine: boolean
  byReporter: boolean
}

const time = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? v : 0)

/** The `verifications` list of a report detail or a check's answer; unknown results are dropped. */
export function parseVerifications(data: unknown): Verification[] {
  const list = isPlainObject(data) && Array.isArray(data.verifications) ? data.verifications : []
  return list.filter(isPlainObject).flatMap((v) => {
    if (!(VERIFICATION_RESULTS as readonly string[]).includes(String(v.result))) return []
    return [{
      result: v.result as VerificationResult,
      note: typeof v.note === 'string' ? v.note : null,
      deploymentSha: typeof v.deploymentSha === 'string' && SHA.test(v.deploymentSha) ? v.deploymentSha : null,
      createdAt: time(v.createdAt),
      updatedAt: time(v.updatedAt),
      mine: v.mine === true,
      byReporter: v.byReporter === true,
    }]
  })
}

/** The caller's own check among a report's checks, if any. */
export function myVerification(list: readonly Verification[]): Verification | null {
  return list.find((v) => v.mine) ?? null
}

/** A row's checks in a few words for the list ("2 lo reproducen · 1 dice arreglado"); null when none. */
export function verifiedSummary(c: VerifiedCounts, tr: (key: string, vars?: Record<string, string | number>) => string): string | null {
  const parts = [
    c.reproduced ? tr('qarev.count.reproduced', { n: c.reproduced }) : null,
    c.notReproduced ? tr('qarev.count.not_reproduced', { n: c.notReproduced }) : null,
    c.fixed ? tr('qarev.count.fixed', { n: c.fixed }) : null,
  ].filter((p): p is string => p !== null)
  return parts.length ? parts.join(' · ') : null
}
