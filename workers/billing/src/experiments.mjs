/**
 * The experiment registry and the routes that expose it (DESIGN-v3 §F,
 * decision D-ORCH-07), trimmed from Vocal Studio's events.js presets.
 *
 * - An experiment runs only when its key is listed in the EXPERIMENTS_ENABLED
 *   var (comma list, default empty: nothing runs). Unknown keys are ignored.
 * - GET /v1/experiments is public and carries no id: {key, arms, weights,
 *   surface} per enabled experiment, the shape src/lib/cloud/experiments.ts
 *   parses. Assignment happens in the browser (FNV-1a of `cid:key`); the
 *   control arm is arms[0].
 * - POST /v1/me/experiments/bind {cid} (session): records which account the
 *   measurement id signed in as, so trial starts and payments can be
 *   attributed to the id's arm. The first binding of an id wins, and the
 *   account keeps the FIRST arm it was seen in per experiment (copied from its
 *   ids); the answer lists the account's stored arms.
 * - The id itself is never stored: cid_hash = HMAC(pepper, "cid:" + cid).
 *
 * Plan fields (minPerArm, minDays, primaryMetric) gate the admin results
 * (experiment-results.mjs): no comparison is shown before the plan is met.
 * Sample sizes: stats.sampleSizePerArm(0.05, 0.10) = 432 people per arm to
 * detect a trial-start rate moving from 5 % to 10 % (80 % power, two-sided
 * alpha 0.05). The 400 floor is where results may first be READ, not a
 * promise of that power; the A/A needs fewer because its job is to catch
 * broken assignment (SRM), not to estimate an effect.
 */

import { hmacHex } from "./crypto.mjs";
import { listVar } from "./config.mjs";
import { hitRateLimit } from "./ratelimit.mjs";

/** The measurement id the browser mints: 16 random bytes, lowercase hex. */
export const CID_RE = /^[0-9a-f]{32}$/;

/** Binds allowed per account per hour. */
export const BINDS_PER_HOUR = 30;

/**
 * The registry. Weights are relative integers. primaryMetric "trial_14d":
 * trial starts within 14 days of the first exposure, per exposed id.
 */
export const REGISTRY = Object.freeze([
  Object.freeze({ key: "aa_2026_q4", arms: ["a", "b"], weights: [1, 1], surface: "gate_or_home", minPerArm: 200, minDays: 14, primaryMetric: "trial_14d" }),
  Object.freeze({ key: "pkg_ab_v1", arms: ["a", "b"], weights: [1, 1], surface: "gate", minPerArm: 400, minDays: 14, primaryMetric: "trial_14d" }),
  Object.freeze({ key: "ads_house_v1", arms: ["none", "house"], weights: [1, 1], surface: "ad_slot", minPerArm: 400, minDays: 14, primaryMetric: "trial_14d" })
]);

/**
 * The registry entry for a key, or null.
 * @param {string} key Experiment key.
 * @returns {Object|null} Entry.
 */
export function findExperiment(key) {
  return REGISTRY.find((e) => e.key === key) || null;
}

/**
 * The enabled experiments, in registry order.
 * @param {Object} env Worker env.
 * @returns {Object[]} Entries.
 */
export function enabledExperiments(env) {
  const on = new Set(listVar(env, "EXPERIMENTS_ENABLED"));
  return REGISTRY.filter((e) => on.has(e.key));
}

/**
 * True when `arm` is an arm of an ENABLED experiment `key`.
 * @param {Object} env Worker env.
 * @param {unknown} key Experiment key.
 * @param {unknown} arm Arm.
 * @returns {boolean} Registered.
 */
export function isEnabledArm(env, key, arm) {
  const exp = enabledExperiments(env).find((e) => e.key === key);
  return Boolean(exp) && exp.arms.includes(arm);
}

/**
 * The stored form of a measurement id.
 * @param {Uint8Array} pepper Decoded SERVER_PEPPER.
 * @param {string} cid Measurement id.
 * @returns {Promise<string>} Hex HMAC.
 */
export function cidHash(pepper, cid) {
  return hmacHex(pepper, `cid:${cid}`);
}

/**
 * GET /v1/experiments.
 * @param {{env: Object}} ctx Context.
 * @returns {Object} Result.
 */
export function handleListExperiments(ctx) {
  const experiments = enabledExperiments(ctx.env).map((e) => ({ key: e.key, arms: [...e.arms], weights: [...e.weights], surface: e.surface }));
  return { status: 200, body: { ok: true, experiments } };
}

/**
 * The account's stored arms, as {experiment: arm}.
 * @param {Object} ctx Context.
 * @param {string} accountId Account id.
 * @returns {Promise<Object>} Arms.
 */
async function accountArms(ctx, accountId) {
  const rows = await ctx.db
    .prepare("SELECT experiment, arm FROM experiment_arms WHERE subject = ?1 AND subject_kind = 'account' ORDER BY experiment")
    .bind(accountId)
    .all();
  return Object.fromEntries(rows.results.map((r) => [r.experiment, r.arm]));
}

/**
 * POST /v1/me/experiments/bind {cid}.
 * @param {Object} ctx Context with a session (db + pepper).
 * @returns {Promise<Object>} Result.
 */
export async function handleBindExperiments(ctx) {
  const cid = ctx.body.cid;
  if (typeof cid !== "string" || !CID_RE.test(cid)) {
    return { status: 400, body: { ok: false, reason: "bad_cid" } };
  }
  const hit = await hitRateLimit(ctx, `bind:${ctx.account.id}`, BINDS_PER_HOUR, 3600);
  if (!hit.ok) {
    return { status: 429, body: { ok: false, reason: "rate_limited", retryAfter: hit.retryAfter }, headers: { "retry-after": String(hit.retryAfter) } };
  }
  const hash = await cidHash(ctx.pepper, cid);
  const id = ctx.account.id;
  await ctx.db.batch([
    ctx.db.prepare("INSERT INTO experiment_bindings (cid_hash, account_id, created_at) VALUES (?1, ?2, ?3) ON CONFLICT (cid_hash) DO NOTHING").bind(hash, id, ctx.now),
    ctx.db
      .prepare(
        `INSERT INTO experiment_arms (subject, subject_kind, experiment, arm, first_at)
         SELECT ?2, 'account', experiment, arm, first_at FROM experiment_arms
         WHERE subject = ?1 AND subject_kind = 'cid'
           AND EXISTS (SELECT 1 FROM experiment_bindings WHERE cid_hash = ?1 AND account_id = ?2)
         ORDER BY first_at
         ON CONFLICT (subject, experiment) DO NOTHING`
      )
      .bind(hash, id)
  ]);
  return { status: 200, body: { ok: true, arms: await accountArms(ctx, id) } };
}
