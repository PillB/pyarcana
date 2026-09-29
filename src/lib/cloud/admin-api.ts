/**
 * Requests and answers of the admin window (/admin) and the QA reporting subsite (/qa)
 * (DESIGN-v3 §H). The worker contract lives in workers/billing/src/grants.mjs, roles.mjs,
 * admin-accounts.mjs and report-triage.mjs; this module builds bodies and paths that the worker
 * accepts and parses what it returns, so the pages only render.
 *
 * - A grant or a tester role lasts a fixed number of days (1..3650) or is indefinite (days: null).
 * - An email never travels in a URL: the worker refuses GET ?email= because request URLs land in
 *   the platform's logs, so lookups, grants and disables carry it in a POST body.
 * - Query values are percent-encoded strictly (also ! ' ( ) * ~), which the API client's path guard
 *   requires; values outside the worker's enums are dropped rather than sent, because one bad
 *   filter makes the worker refuse the whole list.
 * - Only the worker's own id shapes reach a URL path.
 * - Everything the server returns is parsed field by field.
 */
import { isPlainObject } from '@/lib/cloud/storage'
import { SURVEY_KINDS, type SurveyKind } from '@/lib/cloud/surveys'
import { QA_CATEGORIES, QA_SEVERITIES } from '@/lib/qa-session'

export type Target = { email: string } | { accountId: string }
export type Built = { ok: true; body: Record<string, unknown> } | { ok: false; key: string }

export const GRANT_KINDS = ['gift', 'tester'] as const
export type GrantKind = (typeof GRANT_KINDS)[number]
export const GRANT_STATES = ['active', 'upcoming', 'pending_activation', 'used', 'revoked', 'all'] as const
export type GrantState = (typeof GRANT_STATES)[number]
export const ROLE_STATES = ['active', 'expired', 'revoked', 'all'] as const
export type RoleState = (typeof ROLE_STATES)[number]
export const REPORT_STATUSES = ['new', 'triaged', 'in_progress', 'fixed', 'wontfix', 'duplicate'] as const
export const REPORT_SEVERITY_VALUES: readonly string[] = QA_SEVERITIES.map((s) => s.value)
export const REPORT_CATEGORY_VALUES: readonly string[] = QA_CATEGORIES.map((c) => c.value)

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ACCOUNT_ID = /^acct_[A-Za-z0-9_-]{1,64}$/
const REQUEST_ID = /^[A-Za-z0-9_.:-]{8,100}$/
const REPORT_ID = /^rep_[A-Za-z0-9_-]{1,40}$/
const ATTACHMENT_ID = /^att_[A-Za-z0-9_-]{1,40}$/
const EXPERIMENT_KEY = /^[a-z][a-z0-9_]{0,40}$/
const CURSOR = /^[A-Za-z0-9_-]{1,200}$/
const NOTE_MAX = 200
const REASON_MAX = 200
const ADMIN_NOTE_MAX = 2000
const DAYS_MAX = 3650

const fail = (key: string): Built => ({ ok: false, key })

// --- inputs -------------------------------------------------------------------------------------

/** An `acct_` id, or else an email; null for anything else. */
export function parseTarget(text: string): Target | null {
  const value = text.trim()
  if (ACCOUNT_ID.test(value)) return { accountId: value }
  return EMAIL.test(value) ? { email: value } : null
}

/** Whole days 1..3650, null for indefinite, 'invalid' otherwise. */
export function parseDays(daysText: string, indefinite: boolean): number | null | 'invalid' {
  if (indefinite) return null
  const text = daysText.trim()
  if (!/^\d{1,4}$/.test(text)) return 'invalid'
  const days = Number(text)
  return days >= 1 && days <= DAYS_MAX ? days : 'invalid'
}

function requiredReason(reason: string): string | null {
  const text = reason.trim()
  return text !== '' && text.length <= REASON_MAX ? text : null
}

function withNote(body: Record<string, unknown>, note: string): Built {
  const text = note.trim()
  if (text.length > NOTE_MAX) return fail('adm.error.note')
  return { ok: true, body: text === '' ? body : { ...body, note: text } }
}

export interface GrantForm {
  target: string
  daysText: string
  indefinite: boolean
  kind: GrantKind
  note: string
}

/** POST /v1/admin/grants. The request id makes a double click (or a retry) a single grant. */
export function grantRequest(form: GrantForm, requestId: string): Built {
  const target = parseTarget(form.target)
  if (!target) return fail('adm.error.target')
  const days = parseDays(form.daysText, form.indefinite)
  if (days === 'invalid') return fail('adm.error.days')
  if (!(GRANT_KINDS as readonly string[]).includes(form.kind)) return fail('adm.error.kind')
  if (!REQUEST_ID.test(requestId)) return fail('adm.error.retry')
  const built = withNote({ ...target, days, kind: form.kind }, form.note)
  return built.ok ? { ok: true, body: { ...built.body, requestId } } : built
}

/** POST /v1/admin/grants/revoke. */
export function revokeGrantRequest(grantId: string, reason: string): Built {
  const text = requiredReason(reason)
  return text ? { ok: true, body: { grantId, reason: text } } : fail('adm.error.reason')
}

/** POST /v1/admin/roles (the only stored role is tester). */
export function roleRequest(form: Omit<GrantForm, 'kind'>): Built {
  const target = parseTarget(form.target)
  if (!target) return fail('adm.error.target')
  const days = parseDays(form.daysText, form.indefinite)
  if (days === 'invalid') return fail('adm.error.days')
  return withNote({ ...target, role: 'tester', days }, form.note)
}

/** POST /v1/admin/roles/revoke. */
export function roleRevokeRequest(accountId: string, reason: string): Built {
  const text = requiredReason(reason)
  return text ? { ok: true, body: { accountId, role: 'tester', reason: text } } : fail('adm.error.reason')
}

/** POST /v1/admin/account/lookup (a body, so the address stays out of URLs and logs). */
export function lookupRequest(targetText: string): Built {
  const target = parseTarget(targetText)
  return target ? { ok: true, body: { ...target } } : fail('adm.error.target')
}

/** POST /v1/admin/accounts/disable and /enable. */
export function accountActionRequest(targetText: string, reason: string): Built {
  const target = parseTarget(targetText)
  if (!target) return fail('adm.error.target')
  const text = requiredReason(reason)
  return text ? { ok: true, body: { ...target, reason: text } } : fail('adm.error.reason')
}

/** POST /v1/admin/accounts/email (rectification; the worker stores it as unproven). */
export function rectifyRequest(accountId: string, newEmail: string, reason: string): Built {
  const email = newEmail.trim()
  if (!EMAIL.test(email)) return fail('adm.error.email')
  const text = requiredReason(reason)
  return text ? { ok: true, body: { accountId, newEmail: email, reason: text } } : fail('adm.error.reason')
}

// --- paths ----------------------------------------------------------------------------------------

function strictEncode(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*~]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
}

/** '?a=1&b=2' from the non-empty values, in order; '' when there are none. */
export function encodeQuery(params: Record<string, string | number | null | undefined>): string {
  const parts = Object.entries(params)
    .filter((entry): entry is [string, string | number] => entry[1] !== null && entry[1] !== undefined && entry[1] !== '')
    .map(([key, value]) => `${strictEncode(key)}=${strictEncode(String(value))}`)
  return parts.length ? `?${parts.join('&')}` : ''
}

const oneOf = (value: string | undefined, allowed: readonly string[]): string | null => (value !== undefined && allowed.includes(value) ? value : null)

export function grantsPath(q: { kind: GrantKind | 'trial' | ''; state: GrantState; limit?: number }): string {
  const kind = oneOf(q.kind, ['trial', ...GRANT_KINDS])
  return `/v1/admin/grants${encodeQuery({ kind, state: oneOf(q.state, GRANT_STATES) ?? 'all', limit: q.limit ?? 100 })}`
}

export function rolesPath(state: RoleState): string {
  return `/v1/admin/roles${encodeQuery({ role: 'tester', state: oneOf(state, ROLE_STATES) ?? 'all' })}`
}

export interface ReportFilters {
  status?: string
  severity?: string
  category?: string
  section?: string
  q?: string
}

/** GET /v1/qa/reports (tester or admin) or /v1/admin/reports (admin: identities and notes). */
export function reportsPath(scope: 'qa' | 'admin', f: ReportFilters, cursor: string | null, limit = 50): string {
  const query = encodeQuery({
    status: oneOf(f.status, REPORT_STATUSES),
    severity: oneOf(f.severity, REPORT_SEVERITY_VALUES),
    category: oneOf(f.category, REPORT_CATEGORY_VALUES),
    section: f.section?.trim().slice(0, 40),
    q: f.q?.trim().slice(0, 100),
    cursor: cursor && CURSOR.test(cursor) ? cursor : null,
    limit,
  })
  return `/v1/${scope}/reports${query}`
}

export function reportPath(id: string): string | null {
  return REPORT_ID.test(id) ? `/v1/qa/reports/${id}` : null
}

export function attachmentPath(reportId: string, attachmentId: string): string | null {
  return REPORT_ID.test(reportId) && ATTACHMENT_ID.test(attachmentId) ? `/v1/qa/reports/${reportId}/attachments/${attachmentId}` : null
}

export function adminReportPath(id: string): string | null {
  return REPORT_ID.test(id) ? `/v1/admin/reports/${id}` : null
}

export function experimentResultsPath(key: string): string | null {
  return EXPERIMENT_KEY.test(key) ? `/v1/admin/experiments/results${encodeQuery({ key })}` : null
}

export function surveysPath(kind: SurveyKind): string | null {
  return (SURVEY_KINDS as readonly string[]).includes(kind) ? `/v1/admin/surveys${encodeQuery({ kind })}` : null
}

// --- report triage ---------------------------------------------------------------------------------

export interface TriageState {
  status: string
  adminNote: string | null
  duplicateOf: string | null
}

/** PATCH /v1/admin/reports/:id with only what changed; a duplicate names the report it repeats. */
export function reportPatch(current: TriageState, next: { status: string; adminNote: string; duplicateOf: string }): Built {
  if (!(REPORT_STATUSES as readonly string[]).includes(next.status)) return fail('adm.error.status')
  const duplicateOf = next.duplicateOf.trim()
  if (next.status === 'duplicate' && !REPORT_ID.test(duplicateOf)) return fail('adm.error.duplicateOf')
  const note = next.adminNote.trim()
  if (note.length > ADMIN_NOTE_MAX) return fail('adm.error.note')
  const body: Record<string, unknown> = {}
  if (next.status !== current.status) body.status = next.status
  if (next.status === 'duplicate' && duplicateOf !== current.duplicateOf) body.duplicateOf = duplicateOf
  if (note !== '' && note !== (current.adminNote ?? '')) body.adminNote = note
  return Object.keys(body).length ? { ok: true, body } : fail('adm.error.nothing')
}

// --- answers ----------------------------------------------------------------------------------------

const str = (v: unknown): string | null => (typeof v === 'string' ? v : null)
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null)
const rows = (data: unknown, key: string): Record<string, unknown>[] => {
  const list = isPlainObject(data) ? data[key] : null
  return Array.isArray(list) ? list.filter(isPlainObject) : []
}

export interface AdminGrant {
  id: string
  accountId: string
  email: string | null
  kind: string
  days: number | null
  note: string | null
  createdAt: number
  issuedBy: string | null
  state: string
  start: number | null
  end: number | null
  revokedAt: number | null
  revokeReason: string | null
}

function parseGrant(g: Record<string, unknown>): AdminGrant | null {
  if (typeof g.id !== 'string' || typeof g.accountId !== 'string') return null
  return {
    id: g.id,
    accountId: g.accountId,
    email: str(g.email),
    kind: str(g.kind) ?? '',
    days: num(g.days),
    note: str(g.note),
    createdAt: num(g.createdAt) ?? 0,
    issuedBy: str(g.issuedBy),
    state: str(g.state) ?? '',
    start: num(g.start),
    end: num(g.end),
    revokedAt: num(g.revokedAt),
    revokeReason: str(g.revokeReason),
  }
}

export function parseGrantList(data: unknown): { grants: AdminGrant[]; partial: boolean } {
  const grants = rows(data, 'grants').map(parseGrant).filter((g): g is AdminGrant => g !== null)
  return { grants, partial: isPlainObject(data) && data.partial === true }
}

export type GrantWindow = { kind: 'dates' | 'indefinite' | 'pending' | 'revoked'; start: number | null; end: number | null }

/** The dates the worker computed: pending until first sign-in; open-ended when indefinite. */
export function grantWindow(g: AdminGrant): GrantWindow {
  if (g.state === 'revoked') return { kind: 'revoked', start: g.start, end: g.revokedAt }
  if (g.state === 'pending_activation' || g.start === null) return { kind: 'pending', start: null, end: null }
  if (g.days === null || g.end === null) return { kind: 'indefinite', start: g.start, end: null }
  return { kind: 'dates', start: g.start, end: g.end }
}

export interface AdminRole {
  accountId: string
  email: string | null
  role: string
  createdAt: number
  expiresAt: number | null
  revokedAt: number | null
  note: string | null
  grantedBy: string | null
  state: string
}

export function parseRoleList(data: unknown): AdminRole[] {
  return rows(data, 'roles')
    .filter((r) => typeof r.accountId === 'string' && typeof r.state === 'string')
    .map((r) => ({
      accountId: r.accountId as string,
      email: str(r.email),
      role: str(r.role) ?? '',
      createdAt: num(r.createdAt) ?? 0,
      expiresAt: num(r.expiresAt),
      revokedAt: num(r.revokedAt),
      note: str(r.note),
      grantedBy: str(r.grantedBy),
      state: r.state as string,
    }))
}

export interface ReportContext {
  path: string | null
  hash: string | null
  sectionId: string | null
  sectionIndex: number | null
  subStep: string | null
  viewport: string | null
  userAgent: string | null
  language: string | null
  deploymentSha: string | null
  elementHint: string | null
}

export interface ReportRow {
  id: string
  createdAt: number
  updatedAt: number
  source: string
  category: string
  cause: string | null
  severity: string | null
  status: string
  title: string
  description: string | null
  steps: string | null
  expected: string | null
  actual: string | null
  improvement: string | null
  context: ReportContext
  reporterAlias: string | null
  duplicateOf: string | null
  attachmentCount: number
  mine: boolean
  /** Admin view only. */
  accountEmail: string | null
  contactEmail: string | null
  adminNote: string | null
}

function viewportText(v: unknown): string | null {
  if (!isPlainObject(v)) return null
  const w = num(v.width)
  const h = num(v.height)
  return w !== null && h !== null ? `${w}×${h}` : null
}

function parseContext(raw: unknown): ReportContext {
  const c = isPlainObject(raw) ? raw : {}
  return {
    path: str(c.path),
    hash: str(c.hash),
    sectionId: str(c.sectionId),
    sectionIndex: num(c.sectionIndex),
    subStep: str(c.subStep),
    viewport: viewportText(c.viewport),
    userAgent: str(c.userAgent),
    language: str(c.language),
    deploymentSha: str(c.deploymentSha),
    elementHint: str(c.elementHint),
  }
}

export function parseReport(r: Record<string, unknown>): ReportRow | null {
  if (typeof r.id !== 'string' || !REPORT_ID.test(r.id) || typeof r.title !== 'string') return null
  return {
    id: r.id,
    createdAt: num(r.createdAt) ?? 0,
    updatedAt: num(r.updatedAt) ?? 0,
    source: str(r.source) ?? '',
    category: str(r.category) ?? '',
    cause: str(r.cause),
    severity: str(r.severity),
    status: str(r.status) ?? '',
    title: r.title,
    description: str(r.description),
    steps: str(r.steps),
    expected: str(r.expected),
    actual: str(r.actual),
    improvement: str(r.improvement),
    context: parseContext(r.context),
    reporterAlias: str(r.reporterAlias),
    duplicateOf: str(r.duplicateOf),
    attachmentCount: num(r.attachmentCount) ?? 0,
    mine: r.mine === true,
    accountEmail: str(r.accountEmail),
    contactEmail: str(r.contactEmail),
    adminNote: str(r.adminNote),
  }
}

export function parseReportList(data: unknown): { reports: ReportRow[]; nextCursor: string | null } {
  const reports = rows(data, 'reports').map(parseReport).filter((r): r is ReportRow => r !== null)
  const cursor = isPlainObject(data) ? data.nextCursor : null
  return { reports, nextCursor: typeof cursor === 'string' && CURSOR.test(cursor) ? cursor : null }
}

export interface ReportAttachment {
  id: string
  mime: string
  size: number
}

/** GET /v1/qa/reports/:id -> the report and its attachment metadata (images only). */
export function parseReportDetail(data: unknown): { report: ReportRow; attachments: ReportAttachment[] } | null {
  const raw = isPlainObject(data) && isPlainObject(data.report) ? parseReport(data.report) : null
  if (!raw) return null
  const attachments = rows(data, 'attachments')
    .filter((a) => typeof a.id === 'string' && ATTACHMENT_ID.test(a.id) && /^image\/(png|jpeg|webp)$/.test(String(a.mime)))
    .map((a) => ({ id: a.id as string, mime: a.mime as string, size: num(a.size) ?? 0 }))
  return { report: raw, attachments }
}

// --- experiments and satisfaction ----------------------------------------------------------------
// The worker routes (GET /v1/admin/experiments/results, /v1/admin/surveys) are specified in
// DESIGN-v3 §F/§G but not built yet; the fields read here are the design's. Only flat numbers are
// shown, and before the experiment's plan is met only exposure counts (no peeking at a comparison).
const flatNumbers = (o: Record<string, unknown>, keep: (key: string) => boolean): Array<[string, number]> =>
  Object.entries(o).filter((e): e is [string, number] => keep(e[0]) && num(e[1]) !== null)

export interface ExperimentView {
  planMet: boolean
  srmFlagged: boolean
  arms: Array<{ arm: string; cells: Array<[string, number]> }>
}

export function experimentView(data: unknown): ExperimentView {
  const d = isPlainObject(data) ? data : {}
  const planMet = isPlainObject(d.plan) && d.plan.met === true
  const srmFlagged = isPlainObject(d.srm) && d.srm.flagged === true
  const arms = rows(d, 'arms')
    .filter((a) => typeof a.arm === 'string')
    .map((a) => ({ arm: a.arm as string, cells: flatNumbers(a, (k) => planMet || k === 'exposed') }))
  return { planMet, srmFlagged, arms }
}

const SURVEY_TEXT_MAX = 500

export function surveyView(data: unknown): { stats: Array<[string, number]>; texts: string[] } {
  const d = isPlainObject(data) ? data : {}
  const texts = rows(d, 'latest')
    .map((t) => t.text)
    .filter((t): t is string => typeof t === 'string')
    .map((t) => t.slice(0, SURVEY_TEXT_MAX))
  return { stats: flatNumbers(d, () => true), texts }
}
