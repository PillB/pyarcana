/**
 * Satisfaction answers (DESIGN-v3 §G, decision D-ORCH-08).
 *
 * POST /v1/surveys {kind, score?, reasonCode?, text?, sectionIndex?, cid?},
 * anonymous or signed-in, validated exactly as src/lib/cloud/survey-ui.ts
 * builds the body:
 *   section_csat  score 1..5, no reason
 *   nps           score 0..10, no reason
 *   gate_reason   reasonCode from GATE_REASONS, no score
 *   cancel_reason reasonCode from CANCEL_REASONS, no score
 *   text <= 500 characters after trimming, sectionIndex 1..999, cid 32 hex
 *   (stored as cid_hash = HMAC(pepper, "cid:" + cid), never raw).
 * Limits: SURVEYS_PER_IP_HOUR per network, and SURVEYS_PER_ACCOUNT_HOUR per
 * signed-in account whatever its address. Kept 2 years (retention.mjs);
 * exported and deleted with the account (privacy.mjs).
 *
 * GET /v1/admin/surveys?kind= (admin): flat aggregates, the shape
 * src/lib/cloud/admin-api.ts surveyView renders, plus `latest`: the 20
 * newest answers with text (no account, no id):
 *   section_csat  n, mean, meanLow, meanHigh (95 %, normal), score_1..score_5
 *   nps           n, nps, npsLow, npsHigh (from 30 answers), promoters,
 *                 passives, detractors
 *   *_reason      n, reason_<code> for every code
 * Absent values (no answers yet) are left out rather than sent as null.
 */

import { randomId } from "./crypto.mjs";
import { cidHash, CID_RE } from "./experiments.mjs";
import { hitRateLimit } from "./ratelimit.mjs";
import { meanFromSums, npsSummary } from "./stats.mjs";

/** The kinds, as the client's SURVEY_KINDS. */
export const SURVEY_KINDS = Object.freeze(["section_csat", "nps", "gate_reason", "cancel_reason"]);

/** The client's GATE_REASONS and CANCEL_REASONS. */
export const REASONS = Object.freeze({
  gate_reason: Object.freeze(["price", "not_now", "free_enough", "unsure_value", "other"]),
  cancel_reason: Object.freeze(["price", "not_using", "finished", "technical", "other"])
});

/** Answers per network per hour. */
export const SURVEYS_PER_IP_HOUR = 20;

/** Answers per signed-in account per hour. */
export const SURVEYS_PER_ACCOUNT_HOUR = 30;

const TEXT_MAX = 500;
const LATEST = 20;
const SCORE_RANGE = { section_csat: [1, 5], nps: [0, 10] };

/**
 * An integer in [lo, hi].
 * @param {unknown} v Value.
 * @param {number} lo Low.
 * @param {number} hi High.
 * @returns {boolean} In range.
 */
function intIn(v, lo, hi) {
  return Number.isInteger(v) && v >= lo && v <= hi;
}

/**
 * The score rule for a kind.
 * @param {string} kind Kind.
 * @param {unknown} score Score.
 * @returns {boolean} Valid.
 */
function scoreOk(kind, score) {
  const range = SCORE_RANGE[kind];
  return range ? intIn(score, range[0], range[1]) : score === undefined;
}

/**
 * The reason rule for a kind.
 * @param {string} kind Kind.
 * @param {unknown} code Reason code.
 * @returns {boolean} Valid.
 */
function reasonOk(kind, code) {
  const allowed = REASONS[kind];
  return allowed ? allowed.includes(code) : code === undefined;
}

/**
 * The first invalid field's reason, or "".
 * @param {Object} b Body.
 * @returns {string} Reason.
 */
function surveyProblem(b) {
  const checks = [
    ["bad_kind", () => SURVEY_KINDS.includes(b.kind)],
    ["bad_score", () => scoreOk(b.kind, b.score)],
    ["bad_reason", () => reasonOk(b.kind, b.reasonCode)],
    ["bad_text", () => b.text === undefined || (typeof b.text === "string" && b.text.trim().length <= TEXT_MAX)],
    ["bad_section", () => b.sectionIndex === undefined || intIn(b.sectionIndex, 1, 999)],
    ["bad_cid", () => b.cid === undefined || (typeof b.cid === "string" && CID_RE.test(b.cid))]
  ];
  const failed = checks.find(([, ok]) => !ok());
  return failed ? failed[0] : "";
}

/**
 * Spend the caller's limits; a 429 result or null.
 * @param {Object} ctx Context.
 * @returns {Promise<Object|null>} Stop result.
 */
async function surveyLimits(ctx) {
  const buckets = [[`surveys:ip:${ctx.ip}`, SURVEYS_PER_IP_HOUR]];
  if (ctx.account) {
    buckets.push([`surveys:acct:${ctx.account.id}`, SURVEYS_PER_ACCOUNT_HOUR]);
  }
  for (const [name, limit] of buckets) {
    const hit = await hitRateLimit(ctx, name, limit, 3600);
    if (!hit.ok) {
      return { status: 429, body: { ok: false, reason: "rate_limited", retryAfter: hit.retryAfter }, headers: { "retry-after": String(hit.retryAfter) } };
    }
  }
  return null;
}

/**
 * POST /v1/surveys.
 * @param {Object} ctx Context (db + pepper; account when signed in).
 * @returns {Promise<Object>} Result.
 */
export async function handleSubmitSurvey(ctx) {
  const stop = await surveyLimits(ctx);
  if (stop) {
    return stop;
  }
  const b = ctx.body;
  const problem = surveyProblem(b);
  if (problem) {
    return { status: 400, body: { ok: false, reason: problem } };
  }
  const id = randomId("srv");
  const text = typeof b.text === "string" ? b.text.trim() || null : null;
  const hash = b.cid === undefined ? null : await cidHash(ctx.pepper, b.cid);
  await ctx.db
    .prepare("INSERT INTO survey_responses (id, created_at, account_id, cid_hash, kind, score, reason_code, text, section_idx) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)")
    .bind(id, ctx.now, ctx.account ? ctx.account.id : null, hash, b.kind, b.score === undefined ? null : b.score, b.reasonCode || null, text, b.sectionIndex === undefined ? null : b.sectionIndex)
    .run();
  return { status: 200, body: { ok: true, id } };
}

/**
 * CSAT aggregates from (score, n) groups.
 * @param {Object[]} groups Rows.
 * @returns {Object} Cells.
 */
function csatCells(groups) {
  const cells = {};
  let n = 0;
  let sum = 0;
  let sumSq = 0;
  for (let s = 1; s <= 5; s += 1) {
    const k = groups.filter((g) => g.score === s).reduce((t, g) => t + g.n, 0);
    cells[`score_${s}`] = k;
    n += k;
    sum += k * s;
    sumSq += k * s * s;
  }
  const m = meanFromSums(n, sum, sumSq);
  return { n, mean: m.mean, meanLow: m.lo, meanHigh: m.hi, ...cells };
}

/**
 * NPS aggregates.
 * @param {Object[]} groups Rows.
 * @returns {Object} Cells.
 */
function npsCells(groups) {
  const tally = (lo, hi) => groups.filter((g) => g.score >= lo && g.score <= hi).reduce((t, g) => t + g.n, 0);
  const promoters = tally(9, 10);
  const passives = tally(7, 8);
  const detractors = tally(0, 6);
  const s = npsSummary(promoters, passives, detractors);
  return { n: s.n, nps: s.nps, npsLow: s.lo, npsHigh: s.hi, promoters, passives, detractors };
}

/**
 * Reason counts.
 * @param {string} kind Kind.
 * @param {Object[]} groups Rows.
 * @returns {Object} Cells.
 */
function reasonCells(kind, groups) {
  const cells = { n: groups.reduce((t, g) => t + g.n, 0) };
  for (const code of REASONS[kind]) {
    cells[`reason_${code}`] = groups.filter((g) => g.reason_code === code).reduce((t, g) => t + g.n, 0);
  }
  return cells;
}

/**
 * The aggregate cells for a kind, nulls left out.
 * @param {string} kind Kind.
 * @param {Object[]} groups Rows.
 * @returns {Object} Cells.
 */
function aggregate(kind, groups) {
  const builders = { section_csat: csatCells, nps: npsCells };
  const cells = builders[kind] ? builders[kind](groups) : reasonCells(kind, groups);
  return Object.fromEntries(Object.entries(cells).filter(([, v]) => v !== null));
}

/**
 * GET /v1/admin/surveys?kind=.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleAdminSurveys(ctx) {
  const kind = ctx.url.searchParams.get("kind");
  if (!SURVEY_KINDS.includes(kind)) {
    return { status: 400, body: { ok: false, reason: "bad_kind" } };
  }
  const [groups, latest] = await ctx.db.batch([
    ctx.db.prepare("SELECT score, reason_code, COUNT(*) AS n FROM survey_responses WHERE kind = ?1 GROUP BY score, reason_code").bind(kind),
    ctx.db
      .prepare("SELECT created_at, score, reason_code, text, section_idx FROM survey_responses WHERE kind = ?1 AND text IS NOT NULL ORDER BY created_at DESC, id DESC LIMIT ?2")
      .bind(kind, LATEST)
  ]);
  const rows = groups.results.map((g) => ({ score: g.score === null ? null : Number(g.score), reason_code: g.reason_code, n: Number(g.n) }));
  const texts = latest.results.map((r) => ({ createdAt: r.created_at, score: r.score, reasonCode: r.reason_code, sectionIndex: r.section_idx, text: r.text }));
  return { status: 200, body: { ok: true, kind, ...aggregate(kind, rows), latest: texts }, audit: { targetId: kind } };
}
