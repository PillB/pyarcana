/**
 * POST /v1/events: anonymous, allowlisted measurement events (DESIGN-v3 §F),
 * a trimmed port of Vocal Studio's events.js ingest.
 *
 * Body {cid, qa?, events: [{name, experiment?, arm?, surface?, sectionIndex?}]}
 * as src/lib/cloud/experiments.ts sends it: cid is 32 lowercase hex, 1..25
 * events, token fields /^[a-z0-9_]{1,40}$/i, sectionIndex 1..999, no other
 * keys. The body is capped at 16 KB by the router.
 *
 * Order:
 *  1. refusals that are the visitor's choice, not ours to count, or over the free-tier budget
 *     (budgetRefusal) answer 202
 *     and store nothing, so the client never retries them: EVENTS_ENABLED =
 *     "false" (kill switch), Sec-GPC: 1 or DNT: 1, a missing or bot user agent;
 *  2. the caller's network: EVENTS_PER_IP_HOUR requests (HMAC bucket);
 *  3. the batch shape (400 bad_cid | bad_events | bad_qa);
 *  4. the id: EVENTS_PER_CID_HOUR requests (HMAC bucket);
 *  5. one batch: each valid event as a row under cid_hash; each `exposure`
 *     for an ENABLED experiment and a registered arm also records the id's
 *     FIRST arm (intent to treat) and, when the id is already bound to an
 *     account, the account's first arm. Invalid events are dropped and
 *     counted in the answer {ok, accepted, dropped}.
 * The raw id is never stored; the qa flag is kept so results can exclude
 * QA-mode traffic.
 */

import { cidHash, CID_RE, isEnabledArm } from "./experiments.mjs";
import { hitRateLimit } from "./ratelimit.mjs";

/**
 * The free-tier budget's answer for this batch (usage.mjs), before anything is spent: at red no
 * event is stored; at amber only ids starting with 0 or 1 (1 in 8 visitors, whole visitors, so
 * per-arm comparisons stay unbiased) are. A malformed id goes on to its normal 400.
 * @param {Object} ctx Context (ctx.budget from the router).
 * @returns {string|null} 202 reason, or null to continue.
 */
export function budgetRefusal(ctx) {
  if (ctx.budget === "red") {
    return "budget_saver";
  }
  const cid = ctx.body && ctx.body.cid;
  if (ctx.budget === "amber" && typeof cid === "string" && CID_RE.test(cid) && !/^[01]/.test(cid)) {
    return "budget_sampled";
  }
  return null;
}

/** Body cap for POST /v1/events (bytes). */
export const EVENTS_BODY_CAP = 16 * 1024;

/** Events per request. */
export const MAX_EVENTS = 25;

/** Requests per measurement id per hour. */
export const EVENTS_PER_CID_HOUR = 60;

/** Requests per network per hour (a classroom shares one address). */
export const EVENTS_PER_IP_HOUR = 600;

/** The allowlist, identical to the client's EVENT_NAMES. */
export const EVENT_NAMES = Object.freeze([
  "exposure",
  "gate_view",
  "gate_trial_click",
  "trial_card_view",
  "checkout_open",
  "house_ad_view",
  "house_ad_click",
  "ad_optin_shown",
  "ad_optin_accept",
  "section_complete",
  "session_start",
  "signin_nudge_view",
  "signin_nudge_click"
]);

const TOKEN_RE = /^[a-z0-9_]{1,40}$/i;
const EVENT_KEYS = new Set(["name", "experiment", "arm", "surface", "sectionIndex"]);
const BOT_UA_RE = /bot|crawl|spider|slurp|headless|playwright|puppeteer|phantomjs|lighthouse|pagespeed|wget|curl|python-requests|node-fetch|undici/i;

/**
 * Why this request is not counted at all, or "".
 * @param {Request} request Request.
 * @param {Object} env Worker env.
 * @returns {string} Reason.
 */
export function ingestRefusal(request, env) {
  if (String(env.EVENTS_ENABLED || "").trim().toLowerCase() === "false") {
    return "events_disabled";
  }
  if (request.headers.get("sec-gpc") === "1" || request.headers.get("dnt") === "1") {
    return "opted_out";
  }
  const ua = request.headers.get("user-agent") || "";
  return !ua || BOT_UA_RE.test(ua) ? "automated" : "";
}

/**
 * An optional token field.
 * @param {unknown} value Value.
 * @returns {boolean} Valid.
 */
function optionalToken(value) {
  return value === undefined || (typeof value === "string" && TOKEN_RE.test(value));
}

/**
 * True for an event the client could have sent.
 * @param {unknown} e Raw event.
 * @returns {boolean} Valid.
 */
function validEvent(e) {
  if (!e || typeof e !== "object" || Array.isArray(e) || !Object.keys(e).every((k) => EVENT_KEYS.has(k))) {
    return false;
  }
  const indexOk = e.sectionIndex === undefined || (Number.isInteger(e.sectionIndex) && e.sectionIndex >= 1 && e.sectionIndex <= 999);
  return EVENT_NAMES.includes(e.name) && optionalToken(e.experiment) && optionalToken(e.arm) && optionalToken(e.surface) && indexOk;
}

/**
 * The batch-level shape, or the 400 reason.
 * @param {Object} body Request body.
 * @returns {string} Reason, or "".
 */
function batchProblem(body) {
  if (typeof body.cid !== "string" || !CID_RE.test(body.cid)) {
    return "bad_cid";
  }
  if (!Array.isArray(body.events) || body.events.length === 0 || body.events.length > MAX_EVENTS) {
    return "bad_events";
  }
  return body.qa === undefined || typeof body.qa === "boolean" ? "" : "bad_qa";
}

/**
 * A 429 result.
 * @param {{retryAfter: number}} hit Limiter decision.
 * @returns {Object} Result.
 */
function limited(hit) {
  return { status: 429, body: { ok: false, reason: "rate_limited", retryAfter: hit.retryAfter }, headers: { "retry-after": String(hit.retryAfter) } };
}

/**
 * The statements that store one event.
 * @param {Object} ctx Context.
 * @param {Object} e Valid event.
 * @param {{hash: string, day: string, qa: number}} s Shared values.
 * @returns {Object[]} Statements.
 */
function eventStatements(ctx, e, s) {
  const db = ctx.db;
  const out = [
    db
      .prepare("INSERT INTO events (received_at, day, cid_hash, name, experiment, arm, surface, section_idx, qa) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)")
      .bind(ctx.now, s.day, s.hash, e.name, e.experiment || null, e.arm || null, e.surface || null, e.sectionIndex === undefined ? null : e.sectionIndex, s.qa)
  ];
  if (e.name === "exposure") {
    out.push(
      db
        .prepare("INSERT INTO experiment_arms (subject, subject_kind, experiment, arm, first_at) VALUES (?1, 'cid', ?2, ?3, ?4) ON CONFLICT (subject, experiment) DO NOTHING")
        .bind(s.hash, e.experiment, e.arm, ctx.now),
      db
        .prepare(
          `INSERT INTO experiment_arms (subject, subject_kind, experiment, arm, first_at)
           SELECT account_id, 'account', ?2, ?3, ?4 FROM experiment_bindings WHERE cid_hash = ?1
           ON CONFLICT (subject, experiment) DO NOTHING`
        )
        .bind(s.hash, e.experiment, e.arm, ctx.now)
    );
  }
  return out;
}

/**
 * True for an event worth storing: valid, and an exposure only for an enabled
 * experiment's registered arm.
 * @param {Object} env Worker env.
 * @param {unknown} e Raw event.
 * @returns {boolean} Keep.
 */
function keepEvent(env, e) {
  return validEvent(e) && (e.name !== "exposure" || isEnabledArm(env, e.experiment, e.arm));
}

/**
 * POST /v1/events.
 * @param {Object} ctx Context (db + pepper).
 * @returns {Promise<Object>} Result.
 */
export async function handleEvents(ctx) {
  const refusal = ingestRefusal(ctx.request, ctx.env) || budgetRefusal(ctx);
  if (refusal) {
    return { status: 202, body: { ok: true, accepted: 0, reason: refusal } };
  }
  const ipHit = await hitRateLimit(ctx, `events:ip:${ctx.ip}`, EVENTS_PER_IP_HOUR, 3600);
  if (!ipHit.ok) {
    return limited(ipHit);
  }
  const problem = batchProblem(ctx.body);
  if (problem) {
    return { status: 400, body: { ok: false, reason: problem } };
  }
  const hash = await cidHash(ctx.pepper, ctx.body.cid);
  const cidHit = await hitRateLimit(ctx, `events:cid:${hash}`, EVENTS_PER_CID_HOUR, 3600);
  if (!cidHit.ok) {
    return limited(cidHit);
  }
  const kept = ctx.body.events.filter((e) => keepEvent(ctx.env, e));
  const shared = { hash, day: new Date(ctx.now * 1000).toISOString().slice(0, 10), qa: ctx.body.qa === true ? 1 : 0 };
  const statements = kept.flatMap((e) => eventStatements(ctx, e, shared));
  if (statements.length) {
    await ctx.db.batch(statements);
  }
  return { status: 200, body: { ok: true, accepted: kept.length, dropped: ctx.body.events.length - kept.length } };
}
