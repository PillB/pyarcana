/**
 * Scheduled work (wrangler.toml [triggers]).
 *
 * Daily (17 9 * * *, 04:17 in Lima) — retention sweep, one batch:
 *   login_codes   deleted 1 day after expiry
 *   sessions      (the sign-in records: method and times; no IP is stored) deleted
 *                 2 years after expiry (SIGNIN_RECORD_DAYS)
 *   rate_limits   deleted 2 days after their window started
 *   checkouts     `open` for more than 7 days -> `expired`
 *   used_nonces   deleted once their token could no longer verify (exp + skew)
 *   report_attachments  (screenshots may hold personal data, and they are
 *                 the bulk of the database) deleted 90 days after their report
 *                 was closed (fixed, wontfix or duplicate; updated_at), or 180
 *                 days after it was filed, whichever comes first.
 *   reports       (the text, context and alias) deleted 1 year after the
 *                 report was closed, or 2 years after it was filed, whichever
 *                 comes first (owner decision 2026-10-04)
 *   audit_log     deleted 2 years after it was written (AUDIT_DAYS)
 *   qa_sessions   deleted 1 year after the session's last activity (QA_SESSION_DAYS)
 * Daily, after it — measurement sweep (DESIGN-v3 §F/§G), one batch:
 *   events, experiment_arms, experiment_bindings  deleted 180 days after
 *                 they were received / first seen / bound
 *   survey_responses  deleted 2 years (730 days) after they were given
 *   consents are kept while the account lives (deleted with it).
 * Never swept: webhook_events (Creem replay protection), trial_claims
 * (anti-abuse, stated on the privacy page), billing rows. No payment runs yet,
 * so none exist; their rule must be set before payments open (README).
 * Accounts are not deleted for inactivity: the privacy page says they MAY be
 * after 2 years without a sign-in, at the owner's discretion.
 *
 * Hourly (7 * * * *) — provider reconciliation of RECENT rows (open
 * checkouts and pending subscriptions younger than 7 days); the daily run
 * reconciles every live subscription after the sweep (reconcile.mjs).
 */

import { pepperBytes } from "./crypto.mjs";
import { DEFAULT_PROVIDERS } from "./providers.mjs";
import { hasDb } from "./public.mjs";
import { KEEP_DAYS, utcDay } from "./usage.mjs";
import { reconcile } from "./reconcile.mjs";
import { migrate } from "./schema.mjs";

/** The daily retention cron. */
export const DAILY_CRON = "17 9 * * *";

/** The hourly reconciliation cron. */
export const HOURLY_CRON = "7 * * * *";

const DAY = 86400;

/** Screenshots of a closed report are kept this many days after it closed. */
export const CLOSED_REPORT_SCREENSHOT_DAYS = 90;

/** No screenshot is kept longer than this many days after its report was filed. */
export const REPORT_SCREENSHOT_MAX_DAYS = 180;

/** A closed report (its text) is kept this many days after it closed. */
export const CLOSED_REPORT_DAYS = 365;

/** No report is kept longer than this many days after it was filed. */
export const REPORT_MAX_DAYS = 730;

/** Sign-in records (sessions) are kept this many days after they expired. */
export const SIGNIN_RECORD_DAYS = 730;

/** Audit rows are kept this many days. */
export const AUDIT_DAYS = 730;

/** QA session summaries are kept this many days after their last activity. */
export const QA_SESSION_DAYS = 365;

const CLOSED = "status IN ('fixed', 'wontfix', 'duplicate')";

/**
 * Delete what the retention policy says, in one batch.
 * @param {{db: Object, now: number}} ctx Context.
 * @returns {Promise<{loginCodes: number, sessions: number, rateLimits: number, checkoutsExpired: number,
 *   usedNonces: number, reportAttachments: number, usageDays: number, reports: number, auditRows: number,
 *   qaSessions: number}>} Counts.
 */
export async function sweepRetention(ctx) {
  const [codes, sessions, limits, checkouts, nonces, screenshots, usage, reports, audit, qaSessions] = await ctx.db.batch([
    ctx.db.prepare("DELETE FROM login_codes WHERE expires_at < ?1").bind(ctx.now - DAY),
    ctx.db.prepare("DELETE FROM sessions WHERE expires_at < ?1").bind(ctx.now - SIGNIN_RECORD_DAYS * DAY),
    ctx.db.prepare("DELETE FROM rate_limits WHERE window_start < ?1").bind(ctx.now - 2 * DAY),
    ctx.db.prepare("UPDATE checkouts SET status = 'expired' WHERE status = 'open' AND created_at < ?1").bind(ctx.now - 7 * DAY),
    ctx.db.prepare("DELETE FROM used_nonces WHERE expires_at < ?1").bind(ctx.now),
    ctx.db
      .prepare(
        `DELETE FROM report_attachments WHERE report_id IN (SELECT id FROM reports
           WHERE (${CLOSED} AND updated_at < ?1) OR created_at < ?2)`
      )
      .bind(ctx.now - CLOSED_REPORT_SCREENSHOT_DAYS * DAY, ctx.now - REPORT_SCREENSHOT_MAX_DAYS * DAY),
    ctx.db.prepare("DELETE FROM usage_daily WHERE day < ?1").bind(utcDay(ctx.now - KEEP_DAYS * DAY)),
    // After the screenshots above: a report this old has none left (its window is shorter).
    ctx.db
      .prepare(`DELETE FROM reports WHERE (${CLOSED} AND updated_at < ?1) OR created_at < ?2`)
      .bind(ctx.now - CLOSED_REPORT_DAYS * DAY, ctx.now - REPORT_MAX_DAYS * DAY),
    ctx.db.prepare("DELETE FROM audit_log WHERE created_at < ?1").bind(ctx.now - AUDIT_DAYS * DAY),
    ctx.db.prepare("DELETE FROM qa_sessions WHERE last_active_at < ?1").bind(ctx.now - QA_SESSION_DAYS * DAY)
  ]);
  return {
    loginCodes: codes.meta.changes,
    sessions: sessions.meta.changes,
    rateLimits: limits.meta.changes,
    checkoutsExpired: checkouts.meta.changes,
    usedNonces: nonces.meta.changes,
    reportAttachments: screenshots.meta.changes,
    usageDays: usage.meta.changes,
    reports: reports.meta.changes,
    auditRows: audit.meta.changes,
    qaSessions: qaSessions.meta.changes
  };
}

/** Measurement rows (events, arms, bindings) are kept this many days. */
export const MEASUREMENT_DAYS = 180;

/** Survey answers are kept this many days (2 years). */
export const SURVEY_DAYS = 730;

/**
 * Delete measurement and survey rows past their retention, in one batch.
 * @param {{db: Object, now: number}} ctx Context.
 * @returns {Promise<{events: number, arms: number, bindings: number, surveys: number}>} Counts.
 */
export async function sweepMeasurement(ctx) {
  const cutoff = ctx.now - MEASUREMENT_DAYS * DAY;
  const [events, arms, bindings, surveys] = await ctx.db.batch([
    ctx.db.prepare("DELETE FROM events WHERE received_at < ?1").bind(cutoff),
    ctx.db.prepare("DELETE FROM experiment_arms WHERE first_at < ?1").bind(cutoff),
    ctx.db.prepare("DELETE FROM experiment_bindings WHERE created_at < ?1").bind(cutoff),
    ctx.db.prepare("DELETE FROM survey_responses WHERE created_at < ?1").bind(ctx.now - SURVEY_DAYS * DAY)
  ]);
  return { events: events.meta.changes, arms: arms.meta.changes, bindings: bindings.meta.changes, surveys: surveys.meta.changes };
}

/**
 * Run the job for a cron expression.
 * @param {Object} env Worker env.
 * @param {{cron: string, now: number, log: function, fetchImpl?: function, providers?: Object, limit?: number}} opts
 *   Cron, clock, logger, and the injectables reconciliation uses.
 * @returns {Promise<{ran: string[], skipped?: string, reconciled?: Object}>} What ran.
 */
export async function runScheduled(env, opts) {
  if (!hasDb(env)) {
    opts.log("scheduled skipped: db_not_configured");
    return { ran: [], skipped: "db_not_configured" };
  }
  if (opts.cron !== DAILY_CRON && opts.cron !== HOURLY_CRON) {
    return { ran: [] };
  }
  await migrate(env.DB);
  const ran = [];
  if (opts.cron === DAILY_CRON) {
    const counts = await sweepRetention({ db: env.DB, now: opts.now });
    opts.log(`retention sweep ${JSON.stringify(counts)}`);
    opts.log(`measurement sweep ${JSON.stringify(await sweepMeasurement({ db: env.DB, now: opts.now }))}`);
    ran.push("retention");
  }
  const ctx = { env, db: env.DB, now: opts.now, log: opts.log, fetchImpl: opts.fetchImpl, pepper: pepperBytes(env), providers: opts.providers || DEFAULT_PROVIDERS };
  const reconciled = await reconcile(ctx, { scope: opts.cron === DAILY_CRON ? "all" : "recent", limit: opts.limit });
  ran.push("reconcile");
  return { ran, reconciled };
}
