/**
 * Entitlement: the pure function `resolveAccess(rows, now, cfg)`
 * (DESIGN-v2 §3, amended by DESIGN-v3). No D1, no clock, no mutation.
 *
 * 1. Paid intervals. Every approved charge that was neither refunded nor
 *    charged back covers [period_start, period_end). (The payment stage
 *    computes those bounds when it records the charge.)
 * 2. Grace. A renewing subscription (active or past_due, not cancelling at
 *    period end) extends the end of its LATEST charge by GRACE_DAYS, and only
 *    when that latest charge is itself clean: a refunded current charge must
 *    end access, not fall back to the previous period plus grace.
 * 3. Grants pack into uncovered time. Grants sorted by (created_at, id) each
 *    consume `days` of time that paid coverage (including grace) does not
 *    cover, starting at max(cursor, created_at, first_signin_at). A grant
 *    with days NULL is indefinite: it consumes every uncovered second to +∞.
 *    Until the first sign-in every grant is pending activation.
 *    Revocation (stated interpretation): a revoked grant keeps the stretch it
 *    already covered (up to revoked_at) and releases the rest, so later grants
 *    re-flow from the revocation instant. Treating a revoked grant as if it
 *    had never existed would instead back-date the later grants into time
 *    that has already passed, and revoking a long-running indefinite tester
 *    grant would silently burn every gift queued behind it.
 * 4. Result: {isPro, source, accessEnd, indefinite, graceUntil,
 *    pendingGrantDays, pendingIndefinite, upcoming}. accessEnd is the end of
 *    the merged run containing now (null when that run never ends, or when
 *    not Pro). Grants never overlap paid time or each other, so at most one
 *    grant covers now; a paid charge outranks its own subscription's grace.
 */

const DAY = 86400;
const INF = Number.POSITIVE_INFINITY;
const RENEWING = new Set(["active", "past_due"]);

/**
 * True when a value is set (not null/undefined).
 * @param {unknown} value Value.
 * @returns {boolean} Set.
 */
function isSet(value) {
  return value !== null && value !== undefined;
}

/**
 * True for an approved charge with no refund and no chargeback.
 * @param {Object} charge Charge row.
 * @returns {boolean} Entitling.
 */
export function isEntitlingCharge(charge) {
  return charge.status === "approved" && !isSet(charge.refunded_at) && !isSet(charge.charged_back_at);
}

/**
 * The interval a clean charge covers, or null when it has no usable bounds.
 * @param {Object} charge Charge row.
 * @returns {{start: number, end: number, kind: string, grace: boolean}|null} Interval.
 */
function chargeInterval(charge) {
  const start = Number(charge.period_start);
  const end = Number(charge.period_end);
  if (!isEntitlingCharge(charge) || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return null;
  }
  return { start, end, kind: "paid", grace: false };
}

/**
 * The approved charge of a subscription with the latest period end,
 * refunded or not.
 * @param {string} subscriptionId Subscription id.
 * @param {Object[]} charges Charge rows.
 * @returns {Object|null} Charge row.
 */
function latestApprovedCharge(subscriptionId, charges) {
  let latest = null;
  for (const charge of charges) {
    if (charge.subscription_id === subscriptionId && charge.status === "approved") {
      if (!latest || Number(charge.period_end) > Number(latest.period_end)) {
        latest = charge;
      }
    }
  }
  return latest;
}

/**
 * The grace interval a subscription earns, or null.
 * @param {Object} subscription Subscription row.
 * @param {Object[]} charges Charge rows.
 * @param {number} graceSeconds Grace length.
 * @returns {Object|null} Interval.
 */
function graceInterval(subscription, charges, graceSeconds) {
  if (graceSeconds <= 0 || !RENEWING.has(subscription.status) || Number(subscription.cancel_at_period_end) === 1) {
    return null;
  }
  const latest = latestApprovedCharge(subscription.id, charges);
  const covered = latest ? chargeInterval(latest) : null;
  return covered ? { start: covered.end, end: covered.end + graceSeconds, kind: "paid", grace: true } : null;
}

/**
 * Paid and grace intervals.
 * @param {Object} rows Resolver rows.
 * @param {Object} cfg `{graceDays}`.
 * @returns {Object[]} Intervals (unmerged).
 */
function paidIntervals(rows, cfg) {
  const charges = rows.charges || [];
  const graceSeconds = Math.max(0, Number(cfg && cfg.graceDays) || 0) * DAY;
  const paid = charges.map(chargeInterval).filter(Boolean);
  const grace = (rows.subscriptions || []).map((s) => graceInterval(s, charges, graceSeconds)).filter(Boolean);
  return paid.concat(grace);
}

/**
 * Merge intervals into disjoint, sorted runs (touching intervals join).
 * @param {Array<{start: number, end: number}>} intervals Intervals.
 * @returns {Array<{start: number, end: number}>} Runs.
 */
export function mergeIntervals(intervals) {
  const sorted = intervals.map((i) => ({ start: i.start, end: i.end })).sort((a, b) => a.start - b.start);
  const runs = [];
  for (const interval of sorted) {
    const last = runs[runs.length - 1];
    if (last && interval.start <= last.end) {
      last.end = Math.max(last.end, interval.end);
    } else {
      runs.push(interval);
    }
  }
  return runs;
}

/**
 * Take up to `remaining` seconds of the free gap [from, to).
 * @param {Object[]} pieces Output pieces (appended to).
 * @param {number} from Gap start.
 * @param {number} to Gap end.
 * @param {number} remaining Seconds still to consume.
 * @returns {number} Seconds consumed.
 */
function takeGap(pieces, from, to, remaining) {
  const take = Math.min(remaining, to - from);
  if (take > 0) {
    pieces.push({ start: from, end: from + take });
    return take;
  }
  return 0;
}

/**
 * Consume `seconds` of time not covered by `coverage`, from `start`, never
 * past `limit`.
 * @param {Array<{start: number, end: number}>} coverage Merged paid runs.
 * @param {number} start Earliest start.
 * @param {number} seconds Seconds to consume (Infinity = indefinite).
 * @param {number} limit Hard stop (revocation), or Infinity.
 * @returns {Array<{start: number, end: number}>} Pieces.
 */
export function packInto(coverage, start, seconds, limit) {
  const pieces = [];
  let cursor = start;
  let remaining = seconds;
  for (const run of coverage) {
    if (remaining <= 0 || cursor >= limit) {
      return pieces;
    }
    if (run.end <= cursor) {
      continue;
    }
    if (run.start > cursor) {
      remaining -= takeGap(pieces, cursor, Math.min(run.start, limit), remaining);
    }
    cursor = remaining > 0 ? Math.max(cursor, run.end) : cursor;
  }
  if (remaining > 0 && cursor < limit) {
    takeGap(pieces, cursor, limit, remaining);
  }
  return pieces;
}

/**
 * Grants in packing order: (created_at, id).
 * @param {Object[]} grants Grant rows.
 * @returns {Object[]} Sorted copy.
 */
function packingOrder(grants) {
  return [...(grants || [])].sort((a, b) => Number(a.created_at) - Number(b.created_at) || String(a.id).localeCompare(String(b.id)));
}

/**
 * The state of a scheduled grant at `now`.
 * @param {Object} grant Grant row.
 * @param {{start: number|null, end: number|null}} span First start and last end (null = open).
 * @param {number} now Clock.
 * @returns {string} State.
 */
function grantState(grant, span, now) {
  if (isSet(grant.revoked_at)) {
    return "revoked";
  }
  if (span.start === null || now < span.start) {
    return "upcoming";
  }
  return span.end !== null && span.end <= now ? "used" : "active";
}

/**
 * First start and last end of a grant's pieces (Infinity -> null).
 * @param {Object[]} pieces Pieces.
 * @returns {{start: number|null, end: number|null}} Span.
 */
function spanOf(pieces) {
  if (!pieces.length) {
    return { start: null, end: null };
  }
  const end = pieces[pieces.length - 1].end;
  return { start: pieces[0].start, end: end === INF ? null : end };
}

/**
 * A grant row that was never activated.
 * @param {Object} grant Grant row.
 * @returns {Object} Scheduled grant.
 */
function unactivated(grant) {
  return {
    id: grant.id,
    kind: grant.kind,
    days: isSet(grant.days) ? Number(grant.days) : null,
    state: isSet(grant.revoked_at) ? "revoked" : "pending_activation",
    start: null,
    end: null,
    pieces: []
  };
}

/**
 * Pack every grant and report each one's pieces, span and state.
 * @param {Object} rows Resolver rows.
 * @param {number} now Clock.
 * @param {Object} cfg `{graceDays}`.
 * @param {Array<{start: number, end: number}>} [coverage] Precomputed paid runs.
 * @returns {Object[]} One entry per grant, in packing order.
 */
export function grantSchedule(rows, now, cfg, coverage) {
  const runs = coverage || mergeIntervals(paidIntervals(rows, cfg));
  const activation = rows.account && isSet(rows.account.first_signin_at) ? Number(rows.account.first_signin_at) : null;
  let cursor = -INF;
  return packingOrder(rows.grants).map((grant) => {
    if (activation === null) {
      return unactivated(grant);
    }
    const start = Math.max(cursor, Number(grant.created_at), activation);
    const seconds = isSet(grant.days) ? Number(grant.days) * DAY : INF;
    const limit = isSet(grant.revoked_at) ? Number(grant.revoked_at) : INF;
    const pieces = start === INF ? [] : packInto(runs, start, seconds, limit);
    cursor = pieces.length ? pieces[pieces.length - 1].end : cursor;
    const span = spanOf(pieces);
    return { id: grant.id, kind: grant.kind, days: isSet(grant.days) ? Number(grant.days) : null, state: grantState(grant, span, now), ...span, pieces };
  });
}

/**
 * The interval covering `now`: a charge beats grace; grants never overlap paid.
 * @param {Object[]} intervals All intervals.
 * @param {number} now Clock.
 * @returns {Object|null} Covering interval.
 */
function coveringInterval(intervals, now) {
  const covering = intervals.filter((i) => i.start <= now && now < i.end);
  return covering.find((i) => i.kind === "paid" && !i.grace) || covering[0] || null;
}

/**
 * Days (and whether any indefinite grant) waiting for the first sign-in.
 * @param {Object[]} schedule grantSchedule output.
 * @returns {{pendingGrantDays: number, pendingIndefinite: boolean}} Pending.
 */
function pendingOf(schedule) {
  const pending = schedule.filter((g) => g.state === "pending_activation");
  return {
    pendingGrantDays: pending.reduce((sum, g) => sum + (g.days === null ? 0 : g.days), 0),
    pendingIndefinite: pending.some((g) => g.days === null)
  };
}

/**
 * Future intervals (grace excluded), in order.
 * @param {Object[]} intervals All intervals.
 * @param {number} now Clock.
 * @returns {Array<{kind: string, start: number, end: number|null}>} Upcoming.
 */
function upcomingOf(intervals, now) {
  return intervals
    .filter((i) => i.start > now && !i.grace)
    .sort((a, b) => a.start - b.start)
    .map((i) => ({ kind: i.kind, start: i.start, end: i.end === INF ? null : i.end }));
}

/**
 * Resolve an account's access at `now`.
 * @param {{account: Object, grants: Object[], subscriptions: Object[], charges: Object[]}} rows Rows.
 * @param {number} now Epoch seconds.
 * @param {{graceDays: number}} cfg Config.
 * @returns {{isPro: boolean, source: string|null, accessEnd: number|null, indefinite: boolean,
 *            graceUntil: number|null, pendingGrantDays: number, pendingIndefinite: boolean,
 *            upcoming: Object[]}} Access.
 */
export function resolveAccess(rows, now, cfg) {
  const paid = paidIntervals(rows, cfg);
  const coverage = mergeIntervals(paid);
  const schedule = grantSchedule(rows, now, cfg, coverage);
  const granted = schedule.flatMap((g) => g.pieces.map((p) => ({ ...p, kind: g.kind, grace: false })));
  const intervals = paid.concat(granted);
  const base = { ...pendingOf(schedule), upcoming: upcomingOf(intervals, now) };
  const covering = coveringInterval(intervals, now);
  if (!covering) {
    return { isPro: false, source: null, accessEnd: null, indefinite: false, graceUntil: null, ...base };
  }
  const run = mergeIntervals(intervals).find((r) => r.start <= now && now < r.end);
  return {
    isPro: true,
    source: covering.kind,
    accessEnd: run.end === INF ? null : run.end,
    indefinite: run.end === INF,
    graceUntil: covering.grace ? covering.end : null,
    ...base
  };
}

/**
 * The latest period end of a subscription's clean approved charges.
 * @param {string} subscriptionId Subscription id.
 * @param {Object[]} charges Charge rows.
 * @returns {number|null} Epoch seconds, or null when nothing was paid.
 */
export function paidThrough(subscriptionId, charges) {
  let end = null;
  for (const charge of charges || []) {
    const interval = charge.subscription_id === subscriptionId ? chargeInterval(charge) : null;
    if (interval && (end === null || interval.end > end)) {
      end = interval.end;
    }
  }
  return end;
}
