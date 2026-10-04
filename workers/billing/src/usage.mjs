/**
 * D1 free-tier meter and budget guard (owner request 2026-10-04: stay under the free limits by
 * saving and syncing less when the day's budget runs low, and show the numbers to the admin).
 *
 * Workers Free + D1 Free (Cloudflare docs, read 2026-10-04): 5,000,000 rows read and 100,000 rows
 * written per day, reset at 00:00 UTC. Every D1 result carries meta.rows_read / rows_written (index
 * rows included), so the meter needs no estimate: meterDb wraps the binding for one request and adds
 * the meta of every statement, batches included, to an in-memory tally kept per isolate (one per
 * D1 binding object, so each test database has its own).
 *
 * The tally reaches the `usage_daily` table (one row per UTC day and source) at most once every
 * FLUSH_SECONDS per isolate, in one batch that also reads the day's totals back. The flush counts
 * its own cost under the source "meter", so the numbers include what the meter costs.
 *
 * Levels from the larger of the two shares of the daily limit:
 *   green  < 60 %  normal;
 *   amber  < 85 %  progress answers carry syncHint (the client pushes and pulls at most once a
 *                  minute) and anonymous events are sampled to the ids starting 0 or 1 (1 in 8);
 *   red   >= 85 %  progress writes answer 503 budget_saver until 00:05 UTC (the browser keeps the
 *                  progress and sends it then) and events are not stored. Sign-in, admin, reports
 *                  and reads keep working.
 *
 * Known limits, stated: a tally that dies with its isolate before a flush is lost, so the meter
 * can undercount by up to FLUSH_SECONDS of one isolate's traffic; the cron (retention) is not
 * metered; the exact figure is Cloudflare's GraphQL d1AnalyticsAdaptiveGroups, which needs an
 * Analytics-Read token and is not wired. USAGE_LEVEL ("amber" | "red") forces a level and
 * USAGE_FLUSH_SECONDS sets the interval, for tests and drills only.
 */

/** Daily D1 Free limits. */
export const FREE_LIMITS = Object.freeze({ rowsRead: 5_000_000, rowsWritten: 100_000 });

/** Share of the daily limit at which each level starts. */
export const AMBER_SHARE = 0.6;
export const RED_SHARE = 0.85;

/** Seconds between two flushes of one isolate's tally (USAGE_FLUSH_SECONDS, 0..3600, overrides). */
export const FLUSH_SECONDS = 300;

/**
 * The flush interval for this deployment.
 * @param {Object} env Worker env.
 * @returns {number} Seconds.
 */
export function flushSeconds(env) {
  const raw = env.USAGE_FLUSH_SECONDS;
  const n = Number(raw);
  return raw !== undefined && raw !== "" && Number.isInteger(n) && n >= 0 && n <= 3600 ? n : FLUSH_SECONDS;
}

/** The client's minimum interval between syncs while the budget is amber or red. */
export const AMBER_SYNC_MS = 60_000;
export const RED_SYNC_MS = 300_000;

/** Days the admin view shows; rows older than KEEP_DAYS are swept by the cron. */
export const HISTORY_DAYS = 14;
export const KEEP_DAYS = 60;

const DAY = 86400;

/**
 * UTC day of an epoch-seconds instant.
 * @param {number} now Epoch seconds.
 * @returns {string} YYYY-MM-DD.
 */
export function utcDay(now) {
  return new Date(now * 1000).toISOString().slice(0, 10);
}

/**
 * Seconds from `now` until 00:05 UTC of the next day (the budget resets at 00:00).
 * @param {number} now Epoch seconds.
 * @returns {number} Seconds.
 */
export function secondsUntilReset(now) {
  return now - (now % DAY) + DAY + 300 - now;
}

/**
 * The level for a day's totals.
 * @param {{rowsRead: number, rowsWritten: number}} totals Totals.
 * @returns {"green"|"amber"|"red"} Level.
 */
export function levelFor(totals) {
  const share = Math.max(totals.rowsRead / FREE_LIMITS.rowsRead, totals.rowsWritten / FREE_LIMITS.rowsWritten);
  if (share >= RED_SHARE) {
    return "red";
  }
  return share >= AMBER_SHARE ? "amber" : "green";
}

/** Per-binding tallies (WeakMap: a fresh test database starts at zero). */
let meters = new WeakMap();

/**
 * The tally for a D1 binding.
 * @param {Object} db Raw D1 binding.
 * @returns {{pending: Map, day: string|null, totals: Object, flushedAt: number}} Tally.
 */
function meterOf(db) {
  let meter = meters.get(db);
  if (!meter) {
    meter = { pending: new Map(), day: null, totals: { rowsRead: 0, rowsWritten: 0 }, flushedAt: -Infinity };
    meters.set(db, meter);
  }
  return meter;
}

/**
 * Forget every tally (tests simulate a fresh isolate with this).
 * @returns {void}
 */
export function resetUsageMeters() {
  meters = new WeakMap();
}

/**
 * Add one result's meta to the tally.
 * @param {Object} meter Tally.
 * @param {string} key "day|source".
 * @param {Object} result D1 result.
 * @returns {void}
 */
function add(meter, key, result) {
  const meta = (result && result.meta) || {};
  const read = Number(meta.rows_read) || 0;
  const written = Number(meta.rows_written) || 0;
  if (!read && !written) {
    return;
  }
  const entry = meter.pending.get(key) || { rowsRead: 0, rowsWritten: 0 };
  entry.rowsRead += read;
  entry.rowsWritten += written;
  meter.pending.set(key, entry);
}

/**
 * `first()` through `all()`, so its meta is seen; same answer as D1's first().
 * @param {Object} result D1 all() result.
 * @param {string} [column] Column name.
 * @returns {unknown} Row, value, or null.
 */
function firstOf(result, column) {
  const row = result.results && result.results.length ? result.results[0] : null;
  if (!row || column === undefined) {
    return row;
  }
  if (!(column in row)) {
    throw new Error(`D1_COLUMN_NOTFOUND: Column not found (${column})`);
  }
  return row[column];
}

/**
 * Wrap one prepared statement.
 * @param {Object} inner Raw statement.
 * @param {function(Object): void} record Adds a result's meta.
 * @returns {Object} Statement with the same API.
 */
function wrapStatement(inner, record) {
  const seen = (result) => (record(result), result);
  return {
    inner,
    bind: (...values) => wrapStatement(inner.bind(...values), record),
    first: async (column) => firstOf(seen(await inner.all()), column),
    all: async () => seen(await inner.all()),
    run: async () => seen(await inner.run()),
    raw: (...args) => inner.raw(...args)
  };
}

/**
 * A D1 binding that tallies rows read and written for `source`.
 * @param {Object} db Raw D1 binding.
 * @param {string} source Who is spending (route), e.g. "PUT /v1/me/progress".
 * @param {number} now Epoch seconds.
 * @returns {Object} Binding with prepare / batch / exec.
 */
export function meterDb(db, source, now) {
  const meter = meterOf(db);
  const key = `${utcDay(now)}|${source}`;
  const record = (result) => add(meter, key, result);
  return {
    prepare: (sql) => wrapStatement(db.prepare(sql), record),
    batch: async (statements) => {
      const results = await db.batch(statements.map((s) => s.inner || s));
      results.forEach(record);
      return results;
    },
    exec: (sql) => db.exec(sql)
  };
}

/**
 * Write the pending tally and read the day's totals back, in one batch, if FLUSH_SECONDS passed
 * (or the day changed). Errors are logged, never thrown: metering must not break a request.
 * @param {{env: Object, now: number, log: function}} ctx Request context.
 * @returns {Promise<void>} Resolves when done.
 */
export async function flushUsage(ctx) {
  const db = ctx.env.DB;
  const meter = meterOf(db);
  const day = utcDay(ctx.now);
  if (meter.day === day && ctx.now - meter.flushedAt < flushSeconds(ctx.env)) {
    return;
  }
  const entries = [...meter.pending.entries()];
  meter.pending = new Map();
  meter.flushedAt = ctx.now;
  try {
    const results = await db.batch([...entries.map(([key, n]) => upsert(db, key, n, ctx.now)), totalsQuery(db, day)]);
    const rows = results[results.length - 1].results || [];
    meter.day = day;
    meter.totals = rows.reduce((t, r) => ({ rowsRead: t.rowsRead + Number(r.rows_read), rowsWritten: t.rowsWritten + Number(r.rows_written) }), {
      rowsRead: 0,
      rowsWritten: 0
    });
    results.forEach((result) => add(meter, `${day}|meter`, result));
  } catch (error) {
    entries.forEach(([key, n]) => meter.pending.set(key, n));
    ctx.log(`usage flush failed: ${error && error.message ? error.message : "unknown"}`);
  }
}

/**
 * Upsert one source's delta.
 * @param {Object} db Raw D1 binding.
 * @param {string} key "day|source".
 * @param {{rowsRead: number, rowsWritten: number}} n Delta.
 * @param {number} now Epoch seconds.
 * @returns {Object} Statement.
 */
function upsert(db, key, n, now) {
  const [day, source] = key.split("|");
  return db
    .prepare(
      `INSERT INTO usage_daily (day, source, rows_read, rows_written, updated_at) VALUES (?1, ?2, ?3, ?4, ?5)
       ON CONFLICT (day, source) DO UPDATE SET rows_read = rows_read + excluded.rows_read,
         rows_written = rows_written + excluded.rows_written, updated_at = excluded.updated_at`
    )
    .bind(day, source, n.rowsRead, n.rowsWritten, now);
}

/**
 * The day's per-source rows.
 * @param {Object} db Raw D1 binding.
 * @param {string} day YYYY-MM-DD.
 * @returns {Object} Statement.
 */
function totalsQuery(db, day) {
  return db.prepare("SELECT source, rows_read, rows_written FROM usage_daily WHERE day = ?1").bind(day);
}

/**
 * Today's budget level: the stored totals plus this isolate's unflushed tally (or USAGE_LEVEL).
 * @param {{env: Object, now: number}} ctx Request context.
 * @returns {"green"|"amber"|"red"} Level.
 */
export function budgetLevel(ctx) {
  const forced = ctx.env.USAGE_LEVEL;
  if (forced === "amber" || forced === "red") {
    return forced;
  }
  const meter = meterOf(ctx.env.DB);
  const day = utcDay(ctx.now);
  const totals = meter.day === day ? { ...meter.totals } : { rowsRead: 0, rowsWritten: 0 };
  for (const [key, n] of meter.pending) {
    if (key.startsWith(`${day}|`)) {
      totals.rowsRead += n.rowsRead;
      totals.rowsWritten += n.rowsWritten;
    }
  }
  return levelFor(totals);
}

/**
 * The client's sync hint for a level, or null when green.
 * @param {"green"|"amber"|"red"} level Level.
 * @returns {{minIntervalMs: number, level: string}|null} Hint.
 */
export function syncHint(level) {
  if (level === "green") {
    return null;
  }
  return { minIntervalMs: level === "red" ? RED_SYNC_MS : AMBER_SYNC_MS, level };
}

/**
 * GET /v1/admin/usage: today's level and totals by source, and the last HISTORY_DAYS days.
 * @param {Object} ctx Admin request context.
 * @returns {Promise<Object>} Result.
 */
export async function handleAdminUsage(ctx) {
  await flushUsage(ctx);
  const today = utcDay(ctx.now);
  const since = utcDay(ctx.now - (HISTORY_DAYS - 1) * DAY);
  const [byDay, bySource] = await ctx.db.batch([
    ctx.db
      .prepare("SELECT day, SUM(rows_read) AS rows_read, SUM(rows_written) AS rows_written FROM usage_daily WHERE day >= ?1 GROUP BY day ORDER BY day DESC")
      .bind(since),
    ctx.db.prepare("SELECT source, rows_read, rows_written FROM usage_daily WHERE day = ?1 ORDER BY rows_written DESC, rows_read DESC").bind(today)
  ]);
  const days = (byDay.results || []).map((r) => ({ day: r.day, rowsRead: Number(r.rows_read), rowsWritten: Number(r.rows_written) }));
  const totals = days.find((d) => d.day === today) || { day: today, rowsRead: 0, rowsWritten: 0 };
  return {
    status: 200,
    body: {
      ok: true,
      level: budgetLevel(ctx),
      limits: FREE_LIMITS,
      thresholds: { amber: AMBER_SHARE, red: RED_SHARE },
      flushSeconds: flushSeconds(ctx.env),
      today: totals,
      sources: (bySource.results || []).map((r) => ({ source: r.source, rowsRead: Number(r.rows_read), rowsWritten: Number(r.rows_written) })),
      days
    }
  };
}
