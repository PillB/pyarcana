/**
 * access.mjs: the pure entitlement resolver (DESIGN-v2 §3 as amended by v3).
 *
 * Every case is a table row: the rows the resolver sees, the instant, and the
 * answer an expert would expect. Times are whole days from T0 so a failure
 * message reads as a schedule. Inputs are deep-frozen: the resolver must not
 * mutate what it is given.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { grantSchedule, paidThrough, resolveAccess } from "../src/access.mjs";

const DAY = 86400;
const T0 = 1800000000;
const CFG = Object.freeze({ graceDays: 7 });

/**
 * Epoch seconds for day `d` after T0.
 * @param {number} d Days (fractions allowed).
 * @returns {number} Epoch seconds.
 */
const at = (d) => T0 + Math.round(d * DAY);

/**
 * Freeze an object graph.
 * @param {any} value Value.
 * @returns {any} The same value, frozen.
 */
function deepFreeze(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

/**
 * A grant row.
 * @param {string} id Id.
 * @param {string} kind trial | gift | tester.
 * @param {number|null} days Days (null = indefinite).
 * @param {number} createdDay Day created.
 * @param {number} [revokedDay] Day revoked.
 * @returns {Object} Row.
 */
function grant(id, kind, days, createdDay, revokedDay) {
  return { id, kind, days, created_at: at(createdDay), revoked_at: revokedDay === undefined ? null : at(revokedDay) };
}

/**
 * An approved charge row.
 * @param {string} id Id.
 * @param {string} sub Subscription id.
 * @param {number} fromDay Period start.
 * @param {number} toDay Period end.
 * @param {Object} [patch] Overrides.
 * @returns {Object} Row.
 */
function charge(id, sub, fromDay, toDay, patch) {
  return {
    id,
    subscription_id: sub,
    status: "approved",
    period_start: at(fromDay),
    period_end: at(toDay),
    refunded_at: null,
    charged_back_at: null,
    ...(patch || {})
  };
}

/**
 * A subscription row.
 * @param {string} id Id.
 * @param {string} status Status.
 * @param {number} [cancelAtPeriodEnd] 0 | 1.
 * @returns {Object} Row.
 */
function sub(id, status, cancelAtPeriodEnd = 0) {
  return { id, status, cancel_at_period_end: cancelAtPeriodEnd };
}

/**
 * Rows for the resolver.
 * @param {{signinDay?: number|null, grants?: Object[], subscriptions?: Object[], charges?: Object[]}} spec Spec.
 * @returns {Object} Frozen rows.
 */
function rows(spec) {
  const signin = spec.signinDay === undefined ? 0 : spec.signinDay;
  return deepFreeze({
    account: { first_signin_at: signin === null ? null : at(signin) },
    grants: spec.grants || [],
    subscriptions: spec.subscriptions || [],
    charges: spec.charges || []
  });
}

/**
 * The fields a case asserts, from a resolver answer.
 * @param {Object} access resolveAccess result.
 * @returns {Object} Comparable view.
 */
function view(access) {
  return {
    isPro: access.isPro,
    source: access.source,
    accessEnd: access.accessEnd,
    indefinite: access.indefinite,
    graceUntil: access.graceUntil
  };
}

const pro = (source, endDay, extra) => ({
  isPro: true,
  source,
  accessEnd: endDay === null ? null : at(endDay),
  indefinite: endDay === null,
  graceUntil: null,
  ...(extra || {})
});
const FREE = { isPro: false, source: null, accessEnd: null, indefinite: false, graceUntil: null };

const TRIAL_PLUS_TWO_GIFTS = [grant("g_trial", "trial", 7, 0), grant("g_a", "gift", 30, 1), grant("g_b", "gift", 30, 2)];
const THREE_GIFTS = [grant("g_1", "gift", 30, 0), grant("g_2", "gift", 30, 0.001), grant("g_3", "gift", 30, 0.002)];
const RENEWING = [sub("sub_1", "active")];

/** [name, rows spec, now (day), expected view]. */
const CASES = [
  ["no rows: free", {}, 5, FREE],
  ["stacking: trial + gift + gift run back to back (7 + 30 + 30 days)", { grants: TRIAL_PLUS_TWO_GIFTS }, 3, pro("trial", 67)],
  ["stacking: on day 8 the first gift covers, same end", { grants: TRIAL_PLUS_TWO_GIFTS }, 8, pro("gift", 67)],
  ["stacking: at the very end access stops", { grants: TRIAL_PLUS_TWO_GIFTS }, 67, FREE],
  [
    "revoke in the middle before it started: the third gift re-flows, no gap on day 35",
    { grants: [THREE_GIFTS[0], { ...THREE_GIFTS[1], revoked_at: at(5) }, THREE_GIFTS[2]] },
    35,
    pro("gift", 60)
  ],
  [
    "revoke of the running grant keeps the time it covered; later grants start at the revocation",
    { grants: [{ ...THREE_GIFTS[0], revoked_at: at(10) }, THREE_GIFTS[1], THREE_GIFTS[2]] },
    12,
    pro("gift", 70)
  ],
  [
    "gift to a renewing subscriber waits for paid coverage (and its grace) to end",
    { grants: [grant("g", "gift", 30, 10)], subscriptions: RENEWING, charges: [charge("c1", "sub_1", 0, 30)] },
    10,
    pro("paid", 67)
  ],
  [
    "gift to a subscriber whose renewal lands: the gift moves behind the new period",
    {
      grants: [grant("g", "gift", 30, 10)],
      subscriptions: RENEWING,
      charges: [charge("c1", "sub_1", 0, 30), charge("c2", "sub_1", 30, 60)]
    },
    40,
    pro("paid", 97)
  ],
  [
    "subscribing during a trial keeps the unused trial days as credit after paid coverage",
    { grants: [grant("t", "trial", 7, 0)], subscriptions: [sub("sub_1", "canceled")], charges: [charge("c1", "sub_1", 3, 33)] },
    5,
    pro("paid", 37)
  ],
  [
    "the kept trial credit is what covers after the paid period ends",
    { grants: [grant("t", "trial", 7, 0)], subscriptions: [sub("sub_1", "canceled")], charges: [charge("c1", "sub_1", 3, 33)] },
    34,
    pro("trial", 37)
  ],
  [
    "refund of an old charge keeps the current paid period (plus grace, still renewing)",
    {
      subscriptions: RENEWING,
      charges: [charge("c1", "sub_1", 0, 30, { refunded_at: at(40) }), charge("c2", "sub_1", 30, 60)]
    },
    45,
    pro("paid", 67)
  ],
  [
    "refund of the current charge ends access: no grace on the older interval while the sub still says active",
    {
      subscriptions: RENEWING,
      charges: [charge("c1", "sub_1", 0, 30), charge("c2", "sub_1", 30, 60, { refunded_at: at(35) })]
    },
    36,
    FREE
  ],
  [
    "a chargeback removes that charge's interval",
    { subscriptions: [sub("sub_1", "canceled")], charges: [charge("c1", "sub_1", 0, 30, { charged_back_at: at(3) })] },
    5,
    FREE
  ],
  [
    "charges that are not approved never entitle",
    {
      subscriptions: RENEWING,
      charges: ["pending", "rejected", "in_process", "cancelled"].map((status, i) => charge(`c${i}`, "sub_1", 0, 30, { status }))
    },
    5,
    FREE
  ],
  [
    "grace window: a renewing subscription stays Pro GRACE_DAYS past its paid end",
    { subscriptions: RENEWING, charges: [charge("c1", "sub_1", 0, 30)] },
    31,
    pro("paid", 37, { graceUntil: at(37) })
  ],
  [
    "past_due also renews, so it gets grace",
    { subscriptions: [sub("sub_1", "past_due")], charges: [charge("c1", "sub_1", 0, 30)] },
    36,
    pro("paid", 37, { graceUntil: at(37) })
  ],
  ["grace ends exactly at paid end + 7 days", { subscriptions: RENEWING, charges: [charge("c1", "sub_1", 0, 30)] }, 37, FREE],
  [
    "a second subscription's charge covering now wins over the first one's grace (no grace banner)",
    {
      subscriptions: [sub("sub_1", "active"), sub("sub_2", "active")],
      charges: [charge("c1", "sub_1", 0, 30), charge("c2", "sub_2", 32, 62)]
    },
    33,
    pro("paid", 69)
  ],
  [
    "a canceled subscription gets no grace",
    { subscriptions: [sub("sub_1", "canceled")], charges: [charge("c1", "sub_1", 0, 30)] },
    31,
    FREE
  ],
  [
    "cancel at period end gets no grace either",
    { subscriptions: [sub("sub_1", "active", 1)], charges: [charge("c1", "sub_1", 0, 30)] },
    31,
    FREE
  ],
  ["pending activation: a gift to someone who never signed in yields nothing yet", { signinDay: null, grants: [grant("g", "gift", 30, 0)] }, 5, FREE],
  ["a gift given before the first sign-in starts at the first sign-in", { signinDay: 20, grants: [grant("g", "gift", 30, 0)] }, 21, pro("gift", 50)],
  ["indefinite grant: Pro with no end", { grants: [grant("t", "tester", null, 0)] }, 400, pro("tester", null)],
  [
    "indefinite then revoked: the queued gift re-flows from the revocation",
    { grants: [grant("t", "tester", null, 0, 10), grant("g", "gift", 30, 1)] },
    12,
    pro("gift", 40)
  ],
  [
    "indefinite + paid: paid is the source while it covers now, the run still has no end",
    { grants: [grant("t", "tester", null, 0)], subscriptions: RENEWING, charges: [charge("c1", "sub_1", 5, 35)] },
    10,
    pro("paid", null)
  ],
  [
    "indefinite + paid: before the paid period the tester grant covers",
    { grants: [grant("t", "tester", null, 0)], subscriptions: RENEWING, charges: [charge("c1", "sub_1", 5, 35)] },
    2,
    pro("tester", null)
  ],
  [
    "indefinite + paid: after paid and grace, the tester grant covers again",
    { grants: [grant("t", "tester", null, 0)], subscriptions: RENEWING, charges: [charge("c1", "sub_1", 5, 35)] },
    43,
    pro("tester", null)
  ]
];

for (const [name, spec, nowDay, expected] of CASES) {
  test(`resolveAccess: ${name}`, () => {
    assert.deepEqual(view(resolveAccess(rows(spec), at(nowDay), CFG)), expected);
  });
}

test("upcoming lists future intervals in order, with kinds and ends (indefinite = null)", () => {
  const stacked = resolveAccess(rows({ grants: TRIAL_PLUS_TWO_GIFTS }), at(3), CFG);
  assert.deepEqual(stacked.upcoming, [
    { kind: "gift", start: at(7), end: at(37) },
    { kind: "gift", start: at(37), end: at(67) }
  ]);
  const midTrial = resolveAccess(
    rows({ grants: [grant("t", "trial", 7, 0), grant("x", "tester", null, 1)], subscriptions: [sub("s", "canceled")], charges: [charge("c", "s", 3, 33)] }),
    at(5),
    CFG
  );
  assert.deepEqual(midTrial.upcoming, [
    { kind: "trial", start: at(33), end: at(37) },
    { kind: "tester", start: at(37), end: null }
  ]);
});

test("pending grant days are summed only while the account has never signed in", () => {
  const pending = resolveAccess(rows({ signinDay: null, grants: [grant("a", "gift", 30, 0), grant("b", "gift", 14, 0), grant("r", "gift", 9, 0, 1)] }), at(2), CFG);
  assert.equal(pending.pendingGrantDays, 44, "revoked grants are not pending");
  assert.equal(pending.pendingIndefinite, false);
  const indefinite = resolveAccess(rows({ signinDay: null, grants: [grant("t", "tester", null, 0)] }), at(2), CFG);
  assert.equal(indefinite.pendingIndefinite, true);
  const active = resolveAccess(rows({ grants: [grant("a", "gift", 30, 0)] }), at(2), CFG);
  assert.equal(active.pendingGrantDays, 0);
});

test("grantSchedule states: active, upcoming, used, pending_activation, revoked", () => {
  const spec = rows({
    grants: [grant("used", "trial", 7, 0), grant("active", "gift", 30, 1), grant("next", "gift", 30, 2), grant("gone", "gift", 30, 3, 4)]
  });
  const states = Object.fromEntries(grantSchedule(spec, at(10), CFG).map((g) => [g.id, [g.state, g.start, g.end]]));
  assert.deepEqual(states, {
    used: ["used", at(0), at(7)],
    active: ["active", at(7), at(37)],
    next: ["upcoming", at(37), at(67)],
    gone: ["revoked", null, null]
  });
  const pending = grantSchedule(rows({ signinDay: null, grants: [grant("p", "gift", 30, 0), grant("r", "gift", 30, 0, 1)] }), at(2), CFG);
  assert.deepEqual(
    pending.map((g) => [g.id, g.state, g.start]),
    [
      ["p", "pending_activation", null],
      ["r", "revoked", null]
    ]
  );
});

test("grantSchedule: a revoked grant reports the stretch it actually covered", () => {
  const schedule = grantSchedule(rows({ grants: [grant("t", "tester", null, 0, 10), grant("g", "gift", 30, 1)] }), at(12), CFG);
  assert.deepEqual(
    schedule.map((g) => [g.id, g.state, g.start, g.end]),
    [
      ["t", "revoked", at(0), at(10)],
      ["g", "active", at(10), at(40)]
    ]
  );
});

test("grantSchedule: a grant queued behind an indefinite one is upcoming with no dates", () => {
  const schedule = grantSchedule(rows({ grants: [grant("t", "tester", null, 0), grant("g", "gift", 30, 1)] }), at(5), CFG);
  assert.deepEqual(
    schedule.map((g) => [g.id, g.state, g.start, g.end]),
    [
      ["t", "active", at(0), null],
      ["g", "upcoming", null, null]
    ]
  );
});

test("grantSchedule: a grant split by a paid period reports its first start and last end", () => {
  const schedule = grantSchedule(
    rows({ grants: [grant("t", "trial", 7, 0)], subscriptions: [sub("s", "canceled")], charges: [charge("c", "s", 3, 33)] }),
    at(10),
    CFG
  );
  assert.deepEqual(schedule.map((g) => [g.state, g.start, g.end]), [["active", at(0), at(37)]]);
});

test("paidThrough is the latest end of a subscription's clean approved charges", () => {
  const charges = [
    charge("c1", "s", 0, 30),
    charge("c2", "s", 30, 60, { refunded_at: at(40) }),
    charge("c3", "s", 60, 90, { status: "rejected" }),
    charge("o1", "other", 0, 400)
  ];
  assert.equal(paidThrough("s", charges), at(30));
  assert.equal(paidThrough("none", charges), null);
});

test("the grace length follows cfg.graceDays", () => {
  const spec = rows({ subscriptions: RENEWING, charges: [charge("c1", "sub_1", 0, 30)] });
  assert.equal(resolveAccess(spec, at(31), { graceDays: 0 }).isPro, false);
  assert.equal(resolveAccess(spec, at(31), { graceDays: 2 }).accessEnd, at(32));
});

test("review: a gift revoked inside a gap that ends at later paid time stops AT the revocation (no Pro until the paid run)", () => {
  const spec = {
    grants: [grant("g1", "gift", 30, 0, 5)],
    subscriptions: [sub("sub_1", "canceled")],
    charges: [charge("c1", "sub_1", 10, 40)]
  };
  assert.deepEqual(view(resolveAccess(rows(spec), at(7), CFG)), FREE, "day 7: revoked on day 5, paid starts day 10");
  assert.deepEqual(view(resolveAccess(rows(spec), at(4), CFG)), pro("gift", 5), "day 4: the gift runs up to its revocation");
  const [entry] = grantSchedule(rows(spec), at(7), CFG);
  assert.deepEqual([entry.state, entry.start, entry.end], ["revoked", at(0), at(5)], "the covered stretch ends exactly at revoked_at");
});

test("review: grants created in the same second pack in id order, whatever order the rows arrive in", () => {
  const a = { id: "grant_a", kind: "gift", days: 10, created_at: at(0), revoked_at: null };
  const b = { id: "grant_b", kind: "tester", days: 10, created_at: at(0), revoked_at: null };
  for (const order of [[a, b], [b, a]]) {
    const schedule = grantSchedule(rows({ grants: order }), at(1), CFG);
    const byId = Object.fromEntries(schedule.map((g) => [g.id, [g.start, g.end]]));
    assert.deepEqual(byId, { grant_a: [at(0), at(10)], grant_b: [at(10), at(20)] });
    assert.equal(resolveAccess(rows({ grants: order }), at(1), CFG).source, "gift", "grant_a (id order) covers first");
  }
});

test("review: upcoming never lists a renewing subscription's future grace window", () => {
  const spec = { subscriptions: [sub("sub_1", "active")], charges: [charge("c1", "sub_1", 20, 50)] };
  const access = resolveAccess(rows(spec), at(5), CFG);
  assert.deepEqual(access.upcoming, [{ kind: "paid", start: at(20), end: at(50) }], "the paid period only; its grace (50..57) is not a promise");
});
