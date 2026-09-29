/**
 * Sending QA-harness issues to the team (DESIGN-v3 §H). Pure except for the injected ApiClient and
 * image codec, so every rule is unit-tested; QaCloud.tsx only renders the outcome.
 *
 * - Never automatic: the tester presses "Enviar al equipo" (one issue) or "Enviar todas las no
 *   enviadas". The local copy stays; a sent issue gains `remoteId` and `sentAt` (extra keys the
 *   harness validator already tolerates).
 * - POST /v1/reports with `clientIssueId = issue.id`, so a resend is idempotent on the worker
 *   (UNIQUE(account_id, client_issue_id)); an id the worker would refuse is not sent at all.
 * - The worker REFUSES text over its limits (input.mjs optionalText), so the client clips to them
 *   and reports that it did; the local copy keeps the full text.
 * - The screenshot is always re-encoded through a canvas before it leaves the browser: at most
 *   1600 px on the longer side, JPEG from quality 0.8 down, at most 1 MiB. Re-encoding writes only
 *   pixels, so EXIF (camera, GPS, device) never reaches the server. If it cannot fit, the report
 *   goes without it and the tester is told.
 * - A contact email only for anonymous senders (a signed-in account is its own contact).
 */
import type { ApiClient, ApiResult } from '@/lib/cloud/api'
import { uiError, type UiError } from '@/lib/cloud/account-api'
import { isPlainObject } from '@/lib/cloud/storage'
import type { QAIssue } from '@/lib/qa-session'

/** The worker's maximum lengths (workers/billing/src/reports.mjs REPORT_FIELDS). */
export const REPORT_LIMITS = {
  title: 200,
  description: 5000,
  steps: 5000,
  expected: 2000,
  actual: 2000,
  improvement: 2000,
  reporterAlias: 80,
} as const

/** The worker's clientIssueId rule (input.mjs REQUEST_ID_RE). */
const CLIENT_ISSUE_ID = /^[A-Za-z0-9_.:-]{8,100}$/
const REMOTE_ID = /^rep_[A-Za-z0-9_-]{1,40}$/
const ISO_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const SCREENSHOT_MAX_SIDE = 1600
export const SCREENSHOT_MAX_BYTES = 1024 * 1024
export const JPEG_QUALITIES: readonly number[] = [0.8, 0.7, 0.6, 0.5]
export const SCREENSHOT_SCALES: readonly number[] = [1, 0.75, 0.5, 0.35]

export interface Attachment {
  mime: 'image/jpeg'
  data: string
}

export interface ReportOptions {
  tester: string
  contactEmail: string
  signedIn: boolean
  attachment: Attachment | null
}

export interface SentMark {
  remoteId: string
  sentAt: string
}

// --- body ------------------------------------------------------------------------------------------

/** Trim, then cut at `max` UTF-16 units without leaving half of a surrogate pair. */
export function clipText(value: string, max: number): string {
  const text = value.trim()
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return /[\uD800-\uDBFF]$/.test(cut) ? cut.slice(0, -1).trimEnd() : cut.trimEnd()
}

type TextField = keyof typeof REPORT_LIMITS
const TEXT_SOURCES: ReadonlyArray<[TextField, (i: QAIssue, o: ReportOptions) => string]> = [
  ['title', (i) => i.title],
  ['description', (i) => i.description],
  ['steps', (i) => i.reproductionSteps],
  ['expected', (i) => i.expected],
  ['actual', (i) => i.actual],
  ['improvement', (i) => i.improvement],
  ['reporterAlias', (_i, o) => o.tester],
]

function contactOf(o: ReportOptions): { ok: true; email: string | null } | { ok: false } {
  const email = o.contactEmail.trim()
  if (o.signedIn || email === '') return { ok: true, email: null }
  return EMAIL.test(email) ? { ok: true, email } : { ok: false }
}

export function reportBody(issue: QAIssue, o: ReportOptions): { ok: true; body: Record<string, unknown>; clipped: boolean } | { ok: false; key: string } {
  if (!CLIENT_ISSUE_ID.test(issue.id)) return { ok: false, key: 'qa.send.error.badId' }
  const contact = contactOf(o)
  if (!contact.ok) return { ok: false, key: 'qa.send.error.contactEmail' }
  const body: Record<string, unknown> = { source: 'qa_harness', category: issue.category, cause: issue.cause, severity: issue.severity }
  let clipped = false
  for (const [field, read] of TEXT_SOURCES) {
    const raw = read(issue, o)
    body[field] = clipText(raw, REPORT_LIMITS[field])
    clipped = clipped || (body[field] as string).length < raw.trim().length
  }
  if (body.title === '') return { ok: false, key: 'qa.send.error.invalid' }
  body.clientIssueId = issue.id
  body.context = issue.context
  if (contact.email) body.contactEmail = contact.email
  if (o.attachment) body.attachments = [o.attachment]
  return { ok: true, body, clipped }
}

// --- sent marks ------------------------------------------------------------------------------------

/** The server id and send time of an issue, when both are well-formed; otherwise not sent. */
export function sentMark(issue: unknown): SentMark | null {
  if (!isPlainObject(issue)) return null
  const { remoteId, sentAt } = issue
  if (typeof remoteId !== 'string' || !REMOTE_ID.test(remoteId)) return null
  return typeof sentAt === 'string' && ISO_TIME.test(sentAt) ? { remoteId, sentAt } : null
}

export function markSent(issue: QAIssue, remoteId: string, sentAt: string): QAIssue {
  return { ...issue, remoteId, sentAt }
}

export function unsentIssues<T extends QAIssue>(issues: T[]): T[] {
  return issues.filter((i) => sentMark(i) === null)
}

// --- screenshots -------------------------------------------------------------------------------------

export function fitWithin(width: number, height: number, max: number): { width: number; height: number } {
  const scale = Math.min(1, max / Math.max(width, height))
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) }
}

/** Decoded size of a base64 data URL, or null when it is not one. */
export function dataUrlBytes(dataUrl: string): number | null {
  const m = /^data:[^;,]+;base64,([A-Za-z0-9+/]*={0,2})$/.exec(dataUrl)
  if (!m) return null
  const b64 = m[1]
  const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0
  return (b64.length / 4) * 3 - padding
}

/** Loads an image and encodes it as JPEG at a size; the browser one draws through a canvas. */
export interface ImageCodec {
  load(dataUrl: string): Promise<{ width: number; height: number }>
  encodeJpeg(width: number, height: number, quality: number): Promise<string>
}

function fits(data: string): boolean {
  const bytes = data.startsWith('data:image/jpeg;base64,') ? dataUrlBytes(data) : null
  return bytes !== null && bytes <= SCREENSHOT_MAX_BYTES
}

/** Re-encode (always), shrinking quality and then size until it fits; null when it cannot. */
export async function prepareScreenshot(dataUrl: string, codec: ImageCodec): Promise<Attachment | null> {
  try {
    const original = await codec.load(dataUrl)
    const base = fitWithin(original.width, original.height, SCREENSHOT_MAX_SIDE)
    for (const scale of SCREENSHOT_SCALES) {
      const size = fitWithin(base.width, base.height, Math.round(Math.max(base.width, base.height) * scale))
      for (const quality of JPEG_QUALITIES) {
        const data = await codec.encodeJpeg(size.width, size.height, quality)
        if (fits(data)) return { mime: 'image/jpeg', data }
      }
    }
  } catch {
    // An image the canvas cannot read (tainted, corrupt): the report goes without it.
  }
  return null
}

// --- sending -----------------------------------------------------------------------------------------

export type SendOutcome =
  | { ok: true; remoteId: string; deduplicated: boolean; attachmentsDropped: number; clipped: boolean }
  | { ok: false; key: string; minutes?: number; stop: boolean }

const SEND_KEYS: Record<string, string> = {
  attachment_too_large: 'qa.send.error.tooLarge',
  payload_too_large: 'qa.send.error.tooLarge',
  too_many_attachments: 'qa.send.error.tooLarge',
}

function failure(result: Exclude<ApiResult<unknown>, { ok: true }>): SendOutcome {
  const stop = result.status === 0 || result.status === 429 || result.status >= 500
  const known = SEND_KEYS[result.reason] ?? (result.status === 413 ? 'qa.send.error.tooLarge' : null)
  if (known) return { ok: false, key: known, minutes: undefined, stop }
  if (result.status === 400) return { ok: false, key: 'qa.send.error.invalid', minutes: undefined, stop }
  const e = uiError(result)
  return { ok: false, key: e.key, minutes: e.minutes, stop }
}

export async function sendIssue(api: ApiClient, issue: QAIssue, o: ReportOptions): Promise<SendOutcome> {
  const built = reportBody(issue, o)
  if (!built.ok) return { ok: false, key: built.key, stop: false }
  const r = await api.post('/v1/reports', built.body)
  if (!r.ok) return failure(r)
  const id = r.data.id
  if (typeof id !== 'string' || !REMOTE_ID.test(id)) return { ok: false, key: 'account.error.unavailable', minutes: undefined, stop: true }
  const dropped = typeof r.data.attachmentsDropped === 'number' ? r.data.attachmentsDropped : 0
  return { ok: true, remoteId: id, deduplicated: r.data.deduplicated === true, attachmentsDropped: dropped, clipped: built.clipped }
}

export interface SendAllDeps {
  now: () => string
  /** The re-encoded screenshot of an issue, or null. */
  prepare: (issue: QAIssue) => Promise<Attachment | null>
  /** Persist the issue with its sent mark (saveQaIssue). */
  save: (issue: QAIssue) => Promise<void>
}

export interface SendAllResult {
  sent: number
  failed: number
  remaining: number
  error?: UiError
}

function toError(outcome: Exclude<SendOutcome, { ok: true }>): UiError {
  return outcome.minutes === undefined ? { key: outcome.key } : { key: outcome.key, minutes: outcome.minutes }
}

/** Send one issue and persist its sent mark; the error to report, if any, and whether to stop. */
export async function sendAndMark(api: ApiClient, issue: QAIssue, o: Omit<ReportOptions, 'attachment'>, d: SendAllDeps): Promise<{ sent: boolean; error?: UiError; stop: boolean; outcome: SendOutcome }> {
  const attachment = issue.screenshotDataUrl ? await d.prepare(issue) : null
  const outcome = await sendIssue(api, issue, { ...o, attachment })
  if (!outcome.ok) return { sent: false, error: toError(outcome), stop: outcome.stop, outcome }
  try {
    await d.save(markSent(issue, outcome.remoteId, d.now()))
    return { sent: true, stop: false, outcome }
  } catch {
    return { sent: true, error: { key: 'qa.send.error.markNotSaved' }, stop: false, outcome }
  }
}

/** Every issue not yet sent, one at a time; stops at the first failure that would repeat. */
export async function sendUnsent(api: ApiClient, issues: QAIssue[], o: Omit<ReportOptions, 'attachment'>, d: SendAllDeps): Promise<SendAllResult> {
  const queue = unsentIssues(issues)
  const result: SendAllResult = { sent: 0, failed: 0, remaining: 0 }
  for (let i = 0; i < queue.length; i++) {
    const step = await sendAndMark(api, queue[i], o, d)
    result.sent += step.sent ? 1 : 0
    result.failed += step.sent ? 0 : 1
    if (step.error) result.error = step.error
    if (step.stop) {
      result.remaining = queue.length - i - 1
      break
    }
  }
  return result
}

/** Where the deployed commit is published (public/deployment.json), under the site base path. */
export function deploymentJsonUrl(basePath: string): string {
  return `${basePath}/deployment.json`
}

/** Window event that asks the QA harness to open (the /qa page's "Abrir el workspace"). */
export const QA_OPEN_EVENT = 'pyarcana:qa-open'
