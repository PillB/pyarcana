/**
 * The admin's experiment views (DESIGN-v3 §F), trimmed from Vocal Studio's
 * events.js results:
 *
 * GET /v1/admin/experiments: every registry entry with its enabled flag, plan
 *   fields, raw exposures per arm (ids' FIRST arm; account copies are never
 *   counted) and a sample-ratio-mismatch check against the weights.
 *
 * GET /v1/admin/experiments/results?key=: the analysed sample.
 *   - Unit: an exposed measurement id (intent to treat: its first arm).
 *   - Exclusions, computed at read time, first match wins: an admin account
 *     (ADMIN_EMAILS, verified address), a tester (role or tester grant, ever),
 *     a gift holder (gift grant, ever), an id that sent QA-mode events. Ids
 *     never bound to an account can only be excluded by the QA flag. Counts
 *     are reported in `excluded`.
 *   - Metrics per id, over the 14 days after its first exposure (window
 *     [first, first + 14 d)): trial_14d (a trial grant created, via the id ->
 *     account binding), paid_14d (an approved charge with no refund or
 *     chargeback), d7_return (any event from the id in [first + 7 d,
 *     first + 14 d)). Rates use only MATURED ids (first exposure at least
 *     14 days ago), so a young cohort never drags a rate down.
 *   - Plan gate: every arm has at least minPerArm matured ids AND the first
 *     exposure is at least minDays old. Before that, arms carry only
 *     `exposed` and no comparison is returned (no peeking).
 *   - Wilson 95 % intervals per rate; Newcombe hybrid-score differences of
 *     every other arm against the control (arms[0]) with a two-proportion
 *     z-test p; SRM chi-square on the analysed sample, flagged at p < 0.001.
 *   - armSwitch: accounts whose bound ids were exposed in more than one arm.
 * Arms carry flat numbers only, the shape src/lib/cloud/admin-api.ts renders.
 */

import { adminEmails } from "./config.mjs";
import { enabledExperiments, findExperiment, REGISTRY } from "./experiments.mjs";
import { compareRates, sampleRatioMismatch, wilson } from "./stats.mjs";

const DAY = 86400;
const WINDOW = 14 * DAY;
const D7 = 7 * DAY;
const KEY_RE = /^[a-z][a-z0-9_]{0,40}$/;

/** Metrics: result field prefix, row flag, comparison name. */
const METRICS = [
  { field: "trial", count: "trialStarts", flag: "trial", name: "trial_14d" },
  { field: "paid", count: "paid", flag: "paid", name: "paid_14d" },
  { field: "d7", count: "d7Return", flag: "d7", name: "d7_return" }
];

const EXCLUSIONS = ["admin", "tester", "gift", "qa"];

/**
 * SRM without the expected counts.
 * @param {number[]} counts Per arm.
 * @param {number[]} weights Per arm.
 * @returns {{chi2: number|null, df: number, p: number|null, flagged: boolean}} SRM.
 */
function srmOf(counts, weights) {
  const { chi2, df, p, flagged } = sampleRatioMismatch(counts, weights);
  return { chi2, df, p, flagged };
}

/**
 * Raw exposures per arm for every experiment.
 * @param {Object} ctx Context.
 * @returns {Promise<Map<string, Object>>} key -> {arm: n}.
 */
async function rawExposures(ctx) {
  const rows = await ctx.db.prepare("SELECT experiment, arm, COUNT(*) AS n FROM experiment_arms WHERE subject_kind = 'cid' GROUP BY experiment, arm").all();
  const out = new Map();
  for (const r of rows.results) {
    out.set(r.experiment, { ...(out.get(r.experiment) || {}), [r.arm]: Number(r.n) });
  }
  return out;
}

/**
 * GET /v1/admin/experiments.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleAdminExperiments(ctx) {
  const on = new Set(enabledExperiments(ctx.env).map((e) => e.key));
  const raw = await rawExposures(ctx);
  const experiments = REGISTRY.map((e) => {
    const seen = raw.get(e.key) || {};
    const exposed = Object.fromEntries(e.arms.map((arm) => [arm, seen[arm] || 0]));
    return {
      key: e.key,
      enabled: on.has(e.key),
      arms: [...e.arms],
      weights: [...e.weights],
      surface: e.surface,
      minPerArm: e.minPerArm,
      minDays: e.minDays,
      primaryMetric: e.primaryMetric,
      exposed,
      srm: srmOf(e.arms.map((arm) => exposed[arm]), e.weights)
    };
  });
  return { status: 200, body: { ok: true, experiments } };
}

/** One row per exposed id, with everything the analysis needs. */
const SUBJECT_ROWS = `SELECT ea.subject AS cid, ea.arm, ea.first_at, b.account_id, a.email_normalized, a.email_verified,
    EXISTS (SELECT 1 FROM events e WHERE e.cid_hash = ea.subject AND e.qa = 1) AS qa,
    EXISTS (SELECT 1 FROM account_roles r WHERE r.account_id = b.account_id AND r.role = 'tester')
      OR EXISTS (SELECT 1 FROM grants g WHERE g.account_id = b.account_id AND g.kind = 'tester') AS tester,
    EXISTS (SELECT 1 FROM grants g WHERE g.account_id = b.account_id AND g.kind = 'gift') AS gift,
    EXISTS (SELECT 1 FROM grants g WHERE g.account_id = b.account_id AND g.kind = 'trial'
      AND g.created_at >= ea.first_at AND g.created_at < ea.first_at + ?2) AS trial,
    EXISTS (SELECT 1 FROM charges c WHERE c.account_id = b.account_id AND c.status = 'approved'
      AND c.refunded_at IS NULL AND c.charged_back_at IS NULL
      AND c.approved_at >= ea.first_at AND c.approved_at < ea.first_at + ?2) AS paid,
    EXISTS (SELECT 1 FROM events e WHERE e.cid_hash = ea.subject
      AND e.received_at >= ea.first_at + ?3 AND e.received_at < ea.first_at + ?2) AS d7
  FROM experiment_arms ea
  LEFT JOIN experiment_bindings b ON b.cid_hash = ea.subject
  LEFT JOIN accounts a ON a.id = b.account_id
  WHERE ea.experiment = ?1 AND ea.subject_kind = 'cid'`;

/**
 * Why an exposed id is excluded, or null.
 * @param {Object} row Subject row.
 * @param {string[]} admins Admin addresses.
 * @returns {string|null} Exclusion.
 */
function exclusionOf(row, admins) {
  const flags = {
    admin: Number(row.email_verified) === 1 && admins.includes(row.email_normalized),
    tester: Number(row.tester) === 1,
    gift: Number(row.gift) === 1,
    qa: Number(row.qa) === 1
  };
  return EXCLUSIONS.find((name) => flags[name]) || null;
}

/**
 * Split rows into the analysed sample and exclusion counts.
 * @param {Object[]} rows Subject rows.
 * @param {Object} env Worker env.
 * @returns {{kept: Object[], excluded: Object}} Sample.
 */
function applyExclusions(rows, env) {
  const admins = adminEmails(env);
  const excluded = Object.fromEntries(EXCLUSIONS.map((name) => [name, 0]));
  const kept = [];
  for (const row of rows) {
    const reason = exclusionOf(row, admins);
    if (reason) {
      excluded[reason] += 1;
    } else {
      kept.push(row);
    }
  }
  return { kept, excluded };
}

/**
 * Per-arm counts over the analysed sample.
 * @param {Object} exp Registry entry.
 * @param {Object[]} kept Sample.
 * @param {number} now Clock.
 * @returns {Object[]} {arm, exposed, matured, trial, paid, d7} per arm.
 */
function armCounts(exp, kept, now) {
  const counts = exp.arms.map((arm) => ({ arm, exposed: 0, matured: 0, trial: 0, paid: 0, d7: 0 }));
  const byArm = new Map(counts.map((c) => [c.arm, c]));
  for (const row of kept) {
    const c = byArm.get(row.arm);
    if (!c) {
      continue;
    }
    c.exposed += 1;
    if (Number(row.first_at) + WINDOW <= now) {
      c.matured += 1;
      METRICS.forEach((m) => {
        c[m.field] += Number(row[m.flag]) === 1 ? 1 : 0;
      });
    }
  }
  return counts;
}

/**
 * The plan status.
 * @param {Object} exp Registry entry.
 * @param {Object[]} counts armCounts output.
 * @param {Object[]} kept Sample.
 * @param {number} now Clock.
 * @returns {Object} Plan.
 */
function planStatus(exp, counts, kept, now) {
  const first = kept.reduce((min, r) => Math.min(min, Number(r.first_at)), Infinity);
  const days = Number.isFinite(first) ? Math.floor((now - first) / DAY) : 0;
  const reasons = [];
  if (counts.some((c) => c.matured < exp.minPerArm)) {
    reasons.push("min_per_arm");
  }
  if (days < exp.minDays) {
    reasons.push("min_days");
  }
  const matured = Object.fromEntries(counts.map((c) => [c.arm, c.matured]));
  return { met: reasons.length === 0, minPerArm: exp.minPerArm, minDays: exp.minDays, days, matured, reasons };
}

/**
 * The full per-arm view once the plan is met: flat numbers only.
 * @param {Object} c armCounts entry.
 * @returns {Object} Arm.
 */
function armView(c) {
  const out = { arm: c.arm, exposed: c.exposed, matured: c.matured };
  for (const m of METRICS) {
    const w = wilson(c[m.field], c.matured);
    out[m.count] = c[m.field];
    Object.assign(out, flatRate(m.field, w));
  }
  return out;
}

/**
 * {<f>Rate, <f>Low, <f>High}, leaving out nulls.
 * @param {string} field Prefix.
 * @param {{rate: number|null, lo: number|null, hi: number|null}} w Wilson.
 * @returns {Object} Cells.
 */
function flatRate(field, w) {
  if (w.rate === null) {
    return {};
  }
  return { [`${field}Rate`]: w.rate, [`${field}Low`]: w.lo, [`${field}High`]: w.hi };
}

/**
 * Differences of every treatment arm against the control, per metric.
 * @param {Object[]} counts armCounts output (control first).
 * @returns {Object[]} Comparisons.
 */
function comparisons(counts) {
  const [control, ...treatments] = counts;
  return treatments.flatMap((t) =>
    METRICS.map((m) => {
      const d = compareRates(control[m.field], control.matured, t[m.field], t.matured);
      return { arm: t.arm, metric: m.name, diff: d.diff, lo: d.lo, hi: d.hi, p: d.p };
    })
  );
}

/**
 * Accounts whose bound ids were exposed in more than one arm.
 * @param {Object[]} kept Sample.
 * @returns {{accounts: number, switched: number, rate: number|null}} Arm switch.
 */
function armSwitch(kept) {
  const arms = new Map();
  for (const row of kept) {
    if (row.account_id) {
      arms.set(row.account_id, (arms.get(row.account_id) || new Set()).add(row.arm));
    }
  }
  const switched = [...arms.values()].filter((set) => set.size > 1).length;
  return { accounts: arms.size, switched, rate: arms.size ? switched / arms.size : null };
}

/**
 * GET /v1/admin/experiments/results?key=.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleExperimentResults(ctx) {
  const key = ctx.url.searchParams.get("key") || "";
  if (!KEY_RE.test(key)) {
    return { status: 400, body: { ok: false, reason: "bad_key" } };
  }
  const exp = findExperiment(key);
  if (!exp) {
    return { status: 404, body: { ok: false, reason: "unknown_experiment" } };
  }
  const rows = await ctx.db.prepare(SUBJECT_ROWS).bind(key, WINDOW, D7).all();
  const { kept, excluded } = applyExclusions(rows.results, ctx.env);
  const counts = armCounts(exp, kept, ctx.now);
  const plan = planStatus(exp, counts, kept, ctx.now);
  const body = {
    ok: true,
    key,
    primaryMetric: exp.primaryMetric,
    weights: [...exp.weights],
    plan,
    srm: srmOf(counts.map((c) => c.exposed), exp.weights),
    arms: plan.met ? counts.map(armView) : counts.map((c) => ({ arm: c.arm, exposed: c.exposed })),
    armSwitch: armSwitch(kept),
    excluded
  };
  if (plan.met) {
    body.comparisons = comparisons(counts);
  }
  return { status: 200, body, audit: { targetId: key } };
}
