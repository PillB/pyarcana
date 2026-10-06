/**
 * QA session summaries (owner request 2026-10-05): how long a tester worked, on which sections, and
 * how many issues they wrote and sent, so the admin can see coverage and effort.
 *
 *   POST /v1/qa/sessions  (tester or admin)  {sessionId, alias?, startedAt, lastActiveAt,
 *        activeSeconds, sections: {sectionId: seconds}, issuesCreated, issuesSent,
 *        deploymentSha?, browser}
 *
 * One row per (account, session), upserted: the browser resends the running totals, and a stale
 * copy can never lower them (MAX on every counter). Strict shape, as reports: unknown keys refuse.
 * Anonymous QA stays in the tester's browser; only signed-in testers and admins send. Kept 1 year
 * after the session's last activity (retention.mjs), deleted with the account, and part of the
 * account export (privacy.mjs).
 */

import { badRequest, enumValue, INVALID, optionalText } from "./input.mjs";
import { hitRateLimit } from "./ratelimit.mjs";

/** Upserts per account per hour (the browser sends at most every few minutes). */
export const QA_SESSION_WRITES_PER_HOUR = 120;
/** Request body cap, bytes. */
export const QA_SESSION_BODY_CAP = 8 * 1024;
/** Sections one summary may list. */
export const QA_SESSION_MAX_SECTIONS = 60;
/** A session older than this is refused (days). */
export const QA_SESSION_MAX_AGE_DAYS = 30;
export const QA_BROWSERS = Object.freeze(["chromium", "firefox", "safari", "other"]);

const SESSION_ID = /^qs_[A-Za-z0-9_-]{16,40}$/;
const SECTION_ID = /^[a-z0-9][a-z0-9_-]{0,39}$/;
const SHA = /^[0-9a-f]{7,64}$/i;
const KEYS = new Set(["sessionId", "alias", "startedAt", "lastActiveAt", "activeSeconds", "sections", "issuesCreated", "issuesSent", "deploymentSha", "browser"]);
const WEEK = 7 * 86400;

/**
 * A whole number in [min, max], else INVALID.
 * @param {unknown} v Value.
 * @param {number} min Minimum.
 * @param {number} max Maximum.
 * @returns {number|symbol} Number or INVALID.
 */
function wholeNumber(v, min, max) {
  return Number.isInteger(v) && v >= min && v <= max ? v : INVALID;
}

/**
 * The sections map: known-shaped ids, whole seconds, at most QA_SESSION_MAX_SECTIONS.
 * @param {unknown} v Value.
 * @param {number} active Session active seconds (no section can exceed it).
 * @returns {Object|symbol} Map or INVALID.
 */
function sectionsValue(v, active) {
  if (!v || typeof v !== "object" || Array.isArray(v)) {
    return INVALID;
  }
  const entries = Object.entries(v);
  if (entries.length > QA_SESSION_MAX_SECTIONS) {
    return INVALID;
  }
  const out = {};
  for (const [id, seconds] of entries) {
    if (!SECTION_ID.test(id) || wholeNumber(seconds, 0, active) === INVALID) {
      return INVALID;
    }
    out[id] = seconds;
  }
  return out;
}

/**
 * The time fields: started before last activity, not in the future, not too old.
 * @param {Object} b Body.
 * @param {number} now Epoch seconds.
 * @returns {Object|null} Times or null when invalid.
 */
function timesValue(b, now) {
  const startedAt = wholeNumber(b.startedAt, now - QA_SESSION_MAX_AGE_DAYS * 86400, now + 300);
  const lastActiveAt = wholeNumber(b.lastActiveAt, 0, now + 300);
  const activeSeconds = wholeNumber(b.activeSeconds, 0, WEEK);
  if (startedAt === INVALID || lastActiveAt === INVALID || activeSeconds === INVALID || lastActiveAt < startedAt) {
    return null;
  }
  return { startedAt, lastActiveAt: Math.min(lastActiveAt, now), activeSeconds: Math.min(activeSeconds, lastActiveAt - startedAt + 60) };
}

/**
 * Validate the body.
 * @param {Object} b Body.
 * @param {number} now Epoch seconds.
 * @returns {Object|{error: Object}} Parsed or error.
 */
export function parseQaSession(b, now) {
  if (!b || typeof b !== "object" || Object.keys(b).some((k) => !KEYS.has(k))) {
    return { error: badRequest("bad_session") };
  }
  const times = typeof b.sessionId === "string" && SESSION_ID.test(b.sessionId) ? timesValue(b, now) : null;
  const sections = times ? sectionsValue(b.sections, times.activeSeconds) : INVALID;
  const issuesCreated = wholeNumber(b.issuesCreated, 0, 10_000);
  const issuesSent = wholeNumber(b.issuesSent, 0, 10_000);
  const alias = optionalText(b.alias, 80);
  const browser = enumValue(b.browser, QA_BROWSERS);
  const sha = b.deploymentSha === undefined || b.deploymentSha === null ? null : typeof b.deploymentSha === "string" && SHA.test(b.deploymentSha) ? b.deploymentSha : INVALID;
  if ([sections, issuesCreated, issuesSent, alias, browser, sha].includes(INVALID) || !times) {
    return { error: badRequest("bad_session") };
  }
  return { sessionId: b.sessionId, alias, ...times, sections, issuesCreated, issuesSent: Math.min(issuesSent, issuesCreated), deploymentSha: sha, browser };
}

/**
 * POST /v1/qa/sessions.
 * @param {Object} ctx Tester or admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleQaSession(ctx) {
  const hit = await hitRateLimit(ctx, `qa-session:${ctx.account.id}`, QA_SESSION_WRITES_PER_HOUR, 3600);
  if (!hit.ok) {
    return { status: 429, body: { ok: false, reason: "rate_limited", retryAfter: hit.retryAfter }, headers: { "retry-after": String(hit.retryAfter) } };
  }
  const s = parseQaSession(ctx.body, ctx.now);
  if (s.error) {
    return s.error;
  }
  await ctx.db
    .prepare(
      `INSERT INTO qa_sessions (account_id, session_id, alias, started_at, last_active_at, active_seconds, sections,
         issues_created, issues_sent, deployment_sha, browser, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)
       ON CONFLICT (account_id, session_id) DO UPDATE SET
         alias = COALESCE(excluded.alias, qa_sessions.alias),
         last_active_at = MAX(qa_sessions.last_active_at, excluded.last_active_at),
         active_seconds = MAX(qa_sessions.active_seconds, excluded.active_seconds),
         sections = CASE WHEN excluded.active_seconds >= qa_sessions.active_seconds THEN excluded.sections ELSE qa_sessions.sections END,
         issues_created = MAX(qa_sessions.issues_created, excluded.issues_created),
         issues_sent = MAX(qa_sessions.issues_sent, excluded.issues_sent),
         deployment_sha = COALESCE(excluded.deployment_sha, qa_sessions.deployment_sha),
         updated_at = excluded.updated_at`
    )
    .bind(ctx.account.id, s.sessionId, s.alias, s.startedAt, s.lastActiveAt, s.activeSeconds, JSON.stringify(s.sections), s.issuesCreated, s.issuesSent, s.deploymentSha, s.browser, ctx.now)
    .run();
  return { status: 200, body: { ok: true } };
}

/**
 * Session rows as the API shows them.
 * @param {Object} r Row.
 * @returns {Object} View.
 */
export function sessionView(r) {
  return {
    sessionId: r.session_id,
    alias: r.alias,
    startedAt: r.started_at,
    lastActiveAt: r.last_active_at,
    activeSeconds: Number(r.active_seconds),
    sections: r.sections ? JSON.parse(r.sections) : {},
    issuesCreated: Number(r.issues_created),
    issuesSent: Number(r.issues_sent),
    deploymentSha: r.deployment_sha,
    browser: r.browser
  };
}
