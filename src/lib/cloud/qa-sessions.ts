/**
 * Sending a QA session summary (worker POST /v1/qa/sessions, tester or admin only). The worker
 * upserts by session and never lowers a total, so resending the running summary is safe; this only
 * decides WHEN to send, to keep the request count small: at most every SEND_EVERY_MS while the
 * numbers changed, and once on page hide (keepalive).
 */
import type { ApiClient, ApiResult } from '@/lib/cloud/api'
import type { MePayload } from '@/lib/cloud/session'
import type { QaSessionSummary } from '@/lib/qa-session-stats'

export const QA_SESSIONS_PATH = '/v1/qa/sessions'
export const SEND_EVERY_MS = 5 * 60_000

/** Only signed-in testers and admins send; everyone else keeps the session local. */
export function canSendQaSession(me: MePayload | null): boolean {
  return !!me && (me.account.isAdmin || me.account.roles.includes('tester'))
}

/** Whether to send now: something changed since the last send, and the interval passed (or forced). */
export function shouldSendQaSession(summary: QaSessionSummary, last: { at: number; json: string } | null, now: number, force: boolean): boolean {
  if (summary.activeSeconds === 0 && summary.issuesCreated === 0) return false
  const json = JSON.stringify(summary)
  if (last && last.json === json) return false
  return force || !last || now - last.at >= SEND_EVERY_MS
}

export function sendQaSession(api: ApiClient, summary: QaSessionSummary, keepalive = false): Promise<ApiResult<unknown>> {
  return api.post(QA_SESSIONS_PATH, summary, { keepalive })
}
