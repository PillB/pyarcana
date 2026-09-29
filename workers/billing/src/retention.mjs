/**
 * Scheduled work (wrangler.toml [triggers]).
 *
 * Daily (17 9 * * *, 04:17 in Lima) — retention sweep, one batch:
 *   login_codes   deleted 1 day after expiry
 *   sessions      deleted 7 days after expiry
 *   rate_limits   deleted 2 days after their window started
 *   checkouts     `open` for more than 7 days -> `expired`
 *   used_nonces   deleted once their token could no longer verify (exp + skew)
 *   report_attachments  (screenshots may hold personal data, and they are
 *                 the bulk of the database) deleted 90 days after their report
 *                 was closed (fixed, wontfix or duplicate; updated_at), or 180
 *                 days after it was filed, whichever comes first. The report
 *                 text is kept.
 * Never swept: webhook_events (Creem replay protection), trial_claims
 * (anti-abuse, stated on the privacy page), audit_log, billing rows.
 *
 * Hourly (7 * * * *) — provider reconciliation, added with the payment stage;
 * until then the hourly run does nothing.
 */

import { hasDb } from "./public.mjs";
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

/**
 * Delete what the retention policy says, in one batch.
 * @param {{db: Object, now: number}} ctx Context.
 * @returns {Promise<{loginCodes: number, sessions: number, rateLimits: number, checkoutsExpired: number,
 *   usedNonces: number, reportAttachments: number}>} Counts.
 */
export async function sweepRetention(ctx) {
  const [codes, sessions, limits, checkouts, nonces, screenshots] = await ctx.db.batch([
    ctx.db.prepare("DELETE FROM login_codes WHERE expires_at < ?1").bind(ctx.now - DAY),
    ctx.db.prepare("DELETE FROM sessions WHERE expires_at < ?1").bind(ctx.now - 7 * DAY),
    ctx.db.prepare("DELETE FROM rate_limits WHERE window_start < ?1").bind(ctx.now - 2 * DAY),
    ctx.db.prepare("UPDATE checkouts SET status = 'expired' WHERE status = 'open' AND created_at < ?1").bind(ctx.now - 7 * DAY),
    ctx.db.prepare("DELETE FROM used_nonces WHERE expires_at < ?1").bind(ctx.now),
    ctx.db
      .prepare(
        `DELETE FROM report_attachments WHERE report_id IN (SELECT id FROM reports
           WHERE (status IN ('fixed', 'wontfix', 'duplicate') AND updated_at < ?1) OR created_at < ?2)`
      )
      .bind(ctx.now - CLOSED_REPORT_SCREENSHOT_DAYS * DAY, ctx.now - REPORT_SCREENSHOT_MAX_DAYS * DAY)
  ]);
  return {
    loginCodes: codes.meta.changes,
    sessions: sessions.meta.changes,
    rateLimits: limits.meta.changes,
    checkoutsExpired: checkouts.meta.changes,
    usedNonces: nonces.meta.changes,
    reportAttachments: screenshots.meta.changes
  };
}

/**
 * Run the job for a cron expression.
 * @param {Object} env Worker env.
 * @param {{cron: string, now: number, log: function}} opts Cron, clock and logger.
 * @returns {Promise<{ran: string[], skipped?: string}>} What ran.
 */
export async function runScheduled(env, opts) {
  if (!hasDb(env)) {
    opts.log("scheduled skipped: db_not_configured");
    return { ran: [], skipped: "db_not_configured" };
  }
  if (opts.cron !== DAILY_CRON) {
    return { ran: [] };
  }
  await migrate(env.DB);
  const counts = await sweepRetention({ db: env.DB, now: opts.now });
  opts.log(`retention sweep ${JSON.stringify(counts)}`);
  return { ran: ["retention"] };
}
