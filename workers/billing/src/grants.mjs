/**
 * Admin grants (DESIGN-v2 §4 Admin, amended by DESIGN-v3).
 *
 *   POST /v1/admin/grants        {email | accountId, days: 1..3650 | null, kind?: gift|tester, note?, requestId}
 *   POST /v1/admin/grants/revoke {grantId, reason}
 *   GET  /v1/admin/grants        ?kind=trial|gift|tester &state=active|upcoming|pending_activation|used|revoked|all &limit=
 *
 * A grant stores only `days` (NULL = indefinite) and created_at; its dates
 * are computed on read by access.mjs, so stacking, deferral behind paid
 * time, activation at first sign-in and re-flow after a revoke need no
 * stored start/end. The account is created (unverified, never signed in)
 * when the email is unknown.
 *
 * Target: exactly one of `email` or `accountId` (review round 1). A
 * Microsoft-only account has no proven email (email_normalized NULL, by
 * design), so it can only be targeted by id; granting by its DISPLAY address
 * would create a separate, empty account. When a grant by email does create
 * an account while an unproven account already shows that address, the
 * answer warns `unproven_account_shows_this_email` with those account ids.
 *
 * Idempotency: UNIQUE(issued_by, request_id). A replay of the same body
 * answers 200 with the existing grant (`deduplicated: true`); a replay with a
 * different body is 409 idempotency_mismatch. The create writes its audit
 * row in the same batch as the grant, keyed on the new grant id, so the row
 * exists exactly when this call created the grant. Revokes are audited by
 * the gate after the UPDATE; the grant row itself keeps revoked_at,
 * revoked_by and revoke_reason.
 */

import { grantSchedule } from "./access.mjs";
import { findLiveAccountByEmail, findOrCreateByEmail, getAccount } from "./accounts.mjs";
import { randomId } from "./crypto.mjs";
import { accessConfig, accessSnapshot } from "./entitlement.mjs";
import {
  badRequest,
  daysValue,
  emailValue,
  enumValue,
  INVALID,
  limitValue,
  optionalText,
  parseFields,
  queryObject,
  requestIdValue,
  requiredText
} from "./input.mjs";

/** Kinds an admin may issue (trials come only from POST /v1/me/trial). */
export const ADMIN_GRANT_KINDS = ["gift", "tester"];

const CREATE_FIELDS = [
  ["days", (b) => daysValue(b, "days"), "bad_days"],
  ["kind", (b) => enumValue(b.kind, ADMIN_GRANT_KINDS, "gift"), "bad_kind"],
  ["note", (b) => optionalText(b.note, 200), "bad_note"],
  ["requestId", (b) => requestIdValue(b.requestId), "bad_request_id"]
];

const REVOKE_FIELDS = [
  ["grantId", (b) => requiredText(b.grantId, 100), "bad_grant_id"],
  ["reason", (b) => requiredText(b.reason, 200), "reason_required"]
];

const RENEWING = new Set(["active", "past_due"]);

const NOT_FOUND = { status: 404, body: { ok: false, reason: "not_found" } };

/**
 * True when a body field was sent (null counts as not sent).
 * @param {unknown} value Field value.
 * @returns {boolean} Sent.
 */
function sent(value) {
  return value !== undefined && value !== null;
}

/**
 * The account an admin request targets: exactly one of `email` or `accountId`.
 * @param {Object} body Request body.
 * @returns {{target: {email?: string, accountId?: string}}|{error: Object}} Target or a 400.
 */
export function parseTarget(body) {
  if (sent(body.accountId) === sent(body.email)) {
    return { error: badRequest("bad_target") };
  }
  if (sent(body.accountId)) {
    const id = requiredText(body.accountId, 100);
    return id === INVALID ? { error: badRequest("bad_account_id") } : { target: { accountId: id } };
  }
  const email = emailValue(body.email);
  return email === INVALID ? { error: badRequest("bad_email") } : { target: { email } };
}

/**
 * The live account for a parsed target; an unknown email creates one
 * (unverified, never signed in), an unknown or deleted id is 404.
 * @param {Object} ctx Context.
 * @param {{email?: string, accountId?: string}} target Parsed target.
 * @returns {Promise<{account: Object, created: boolean}|{stop: Object}>} Account or 404.
 */
export async function resolveTargetAccount(ctx, target) {
  if (!target.accountId) {
    return findOrCreateByEmail(ctx, target.email);
  }
  const account = await getAccount(ctx.db, target.accountId);
  const live = account && (account.deleted_at === null || account.deleted_at === undefined);
  return live ? { account, created: false } : { stop: NOT_FOUND };
}

/**
 * The account id a target names NOW, without creating anything (null when none).
 * @param {Object} ctx Context.
 * @param {{email?: string, accountId?: string}} target Parsed target.
 * @returns {Promise<string|null>} Account id.
 */
async function currentTargetId(ctx, target) {
  if (target.accountId) {
    return target.accountId;
  }
  const holder = await findLiveAccountByEmail(ctx.db, target.email);
  return holder ? holder.id : null;
}

/**
 * Live accounts WITHOUT a proven email whose display address is this one
 * (e.g. a Microsoft-only account): the admin probably meant one of them.
 * @param {Object} ctx Context.
 * @param {string} email Normalized email.
 * @returns {Promise<string[]>} Account ids (at most 5).
 */
async function unprovenAccountsShowing(ctx, email) {
  const rows = await ctx.db
    .prepare(
      `SELECT id FROM accounts WHERE email_normalized IS NULL AND deleted_at IS NULL AND lower(trim(email)) = ?1
       ORDER BY created_at, id LIMIT 5`
    )
    .bind(email)
    .all();
  return rows.results.map((row) => row.id);
}

/**
 * Admin view of a grant row plus its computed schedule entry.
 * @param {Object} row Grant row (with `account_email`, `issuer_email`).
 * @param {Object|undefined} entry grantSchedule entry.
 * @returns {Object} View.
 */
export function adminGrantView(row, entry) {
  const span = entry || { state: "revoked", start: null, end: null };
  return {
    id: row.id,
    accountId: row.account_id,
    email: row.account_email || null,
    kind: row.kind,
    days: row.days === null ? null : Number(row.days),
    note: row.note || null,
    createdAt: Number(row.created_at),
    issuedBy: row.issuer_email || null,
    requestId: row.request_id || null,
    state: span.state,
    start: span.start,
    end: span.end,
    revokedAt: row.revoked_at === null ? null : Number(row.revoked_at),
    revokeReason: row.revoke_reason || null
  };
}

export const GRANT_WITH_EMAILS = `SELECT g.*, a.email AS account_email, i.email AS issuer_email
  FROM grants g JOIN accounts a ON a.id = g.account_id LEFT JOIN accounts i ON i.id = g.issued_by`;

/**
 * A grant with its account and issuer emails.
 * @param {Object} db D1 binding.
 * @param {string} where SQL condition on `g`.
 * @param {...unknown} values Bound values.
 * @returns {Promise<Object|null>} Row.
 */
function grantRow(db, where, ...values) {
  return db.prepare(`${GRANT_WITH_EMAILS} WHERE ${where}`).bind(...values).first();
}

/**
 * The admin view of one grant, with its schedule computed now.
 * @param {Object} ctx Context.
 * @param {Object} row Grant row with emails.
 * @param {Object} account The grant's account row.
 * @returns {Promise<{view: Object, snapshot: Object}>} View and the account's snapshot.
 */
async function viewWithSchedule(ctx, row, account) {
  const snapshot = await accessSnapshot(ctx, account);
  const entry = snapshot.schedule.find((g) => g.id === row.id);
  return { view: adminGrantView(row, entry), snapshot };
}

/**
 * Warnings the admin should see after a create.
 * @param {Object} account Target account row.
 * @param {boolean} created Whether this call created the account.
 * @param {Object} snapshot accessSnapshot of the account.
 * @returns {string[]} Warnings.
 */
function grantWarnings(account, created, snapshot) {
  const renewing = snapshot.rows.subscriptions.some((s) => RENEWING.has(s.status) && Number(s.cancel_at_period_end) !== 1);
  const checks = [
    ["account_created", created],
    ["pending_activation", account.first_signin_at === null],
    ["deferred_by_subscription", renewing || snapshot.access.source === "paid"],
    ["account_disabled", account.disabled_at !== null]
  ];
  return checks.filter(([, hit]) => hit).map(([name]) => name);
}

/**
 * True when a stored grant matches a (re)submitted create body.
 * @param {Object} row Stored grant.
 * @param {Object} input Parsed body.
 * @param {string|null} accountId Account id the submitted email resolves to.
 * @returns {boolean} Same request.
 */
function sameRequest(row, input, accountId) {
  const days = row.days === null ? null : Number(row.days);
  return row.account_id === accountId && row.kind === input.kind && days === input.days && (row.note || null) === input.note;
}

/**
 * The batch that inserts the grant and, only if it was inserted, its audit row.
 * @param {Object} ctx Context.
 * @param {Object} input Parsed body.
 * @param {string} grantId New grant id.
 * @param {{accountId: string, created: boolean}} target Target account.
 * @returns {Object[]} Statements.
 */
function createBatch(ctx, input, grantId, target) {
  const detail = JSON.stringify({ status: 201, kind: input.kind, days: input.days, accountCreated: target.created });
  return [
    ctx.db
      .prepare(
        `INSERT INTO grants (id, account_id, kind, days, created_at, note, issued_by, request_id)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8) ON CONFLICT (issued_by, request_id) DO NOTHING`
      )
      .bind(grantId, target.accountId, input.kind, input.days, ctx.now, input.note, ctx.account.id, input.requestId),
    ctx.db
      .prepare(
        `INSERT INTO audit_log (actor_account_id, action, target_account_id, target_id, detail, created_at)
         SELECT ?1, 'admin.grants.create', account_id, id, ?2, ?3 FROM grants WHERE id = ?4`
      )
      .bind(ctx.account.id, detail, ctx.now, grantId)
  ];
}

/**
 * The answer for a replayed requestId. `targetId` is the live account that
 * holds the submitted email now (null when none): a replay aimed at another
 * address is a mismatch, and nothing is created for it.
 * @param {Object} ctx Context.
 * @param {Object} stored Stored grant row (with emails).
 * @param {Object} input Parsed body.
 * @param {string|null} targetId Account id for the submitted email.
 * @returns {Promise<Object>} Result.
 */
async function replayResult(ctx, stored, input, targetId) {
  const audit = { targetAccountId: stored.account_id, targetId: stored.id, detail: { deduplicated: true } };
  if (!sameRequest(stored, input, targetId)) {
    return { status: 409, body: { ok: false, reason: "idempotency_mismatch", grantId: stored.id }, audit };
  }
  const account = await accountRow(ctx, stored.account_id);
  const { view, snapshot } = await viewWithSchedule(ctx, stored, account);
  const body = { ok: true, deduplicated: true, account: accountSummary(account), grant: view, warnings: grantWarnings(account, false, snapshot) };
  return { status: 200, body, audit };
}

/**
 * The account fields an admin response carries.
 * @param {Object} account Account row.
 * @returns {{id: string, email: string|null, firstSigninAt: number|null}} Summary.
 */
function accountSummary(account) {
  return { id: account.id, email: account.email || null, firstSigninAt: account.first_signin_at === null ? null : Number(account.first_signin_at) };
}

/**
 * The live account row for an existing grant's account.
 * @param {Object} ctx Context.
 * @param {string} accountId Account id.
 * @returns {Promise<Object>} Row.
 */
function accountRow(ctx, accountId) {
  return ctx.db.prepare("SELECT * FROM accounts WHERE id = ?1").bind(accountId).first();
}

/**
 * POST /v1/admin/grants.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleCreateGrant(ctx) {
  const aimed = parseTarget(ctx.body);
  const parsed = aimed.error ? aimed : parseFields(ctx.body, CREATE_FIELDS);
  if (parsed.error) {
    return parsed.error;
  }
  const input = { ...parsed.values, ...aimed.target };
  const earlier = await grantRow(ctx.db, "g.issued_by = ?1 AND g.request_id = ?2", ctx.account.id, input.requestId);
  if (earlier) {
    return replayResult(ctx, earlier, input, await currentTargetId(ctx, aimed.target));
  }
  const target = await resolveTargetAccount(ctx, aimed.target);
  if (target.stop) {
    return target.stop;
  }
  const grantId = randomId("grant");
  await ctx.db.batch(createBatch(ctx, input, grantId, { accountId: target.account.id, created: target.created }));
  const stored = await grantRow(ctx.db, "g.issued_by = ?1 AND g.request_id = ?2", ctx.account.id, input.requestId);
  if (stored.id !== grantId) {
    return replayResult(ctx, stored, input, target.account.id);
  }
  const { view, snapshot } = await viewWithSchedule(ctx, stored, target.account);
  const body = { ok: true, deduplicated: false, account: accountSummary(target.account), grant: view, warnings: grantWarnings(target.account, target.created, snapshot) };
  const unproven = target.created ? await unprovenAccountsShowing(ctx, input.email) : [];
  if (unproven.length) {
    body.warnings.push("unproven_account_shows_this_email");
    body.unprovenAccountIds = unproven;
  }
  return { status: 201, body, audited: true };
}

/**
 * POST /v1/admin/grants/revoke. Idempotent: a second revoke keeps the first
 * revocation's time, actor and reason.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleRevokeGrant(ctx) {
  const parsed = parseFields(ctx.body, REVOKE_FIELDS);
  if (parsed.error) {
    return parsed.error;
  }
  const { grantId, reason } = parsed.values;
  const update = await ctx.db
    .prepare("UPDATE grants SET revoked_at = ?2, revoked_by = ?3, revoke_reason = ?4 WHERE id = ?1 AND revoked_at IS NULL")
    .bind(grantId, ctx.now, ctx.account.id, reason)
    .run();
  const row = await grantRow(ctx.db, "g.id = ?1", grantId);
  if (!row) {
    return { status: 404, body: { ok: false, reason: "not_found" } };
  }
  const alreadyRevoked = update.meta.changes !== 1;
  const { view } = await viewWithSchedule(ctx, row, await accountRow(ctx, row.account_id));
  return {
    status: 200,
    body: { ok: true, alreadyRevoked, grant: view },
    audit: { targetAccountId: row.account_id, targetId: row.id, detail: { alreadyRevoked } }
  };
}

const LIST_STATES = ["active", "upcoming", "pending_activation", "used", "revoked", "all"];

const LIST_FIELDS = [
  ["kind", (q) => enumValue(q.kind, ["trial", "gift", "tester"], null), "bad_kind"],
  ["state", (q) => enumValue(q.state, LIST_STATES, "all"), "bad_state"]
];

const ACTIVATED = "g.revoked_at IS NULL AND a.first_signin_at IS NOT NULL";

/** SQL prefilter per state; `exact` states need no post-filter. */
const STATE_SQL = {
  all: { sql: "1 = 1", exact: true },
  revoked: { sql: "g.revoked_at IS NOT NULL", exact: true },
  pending_activation: { sql: "g.revoked_at IS NULL AND a.first_signin_at IS NULL", exact: true },
  active: { sql: ACTIVATED, exact: false },
  upcoming: { sql: ACTIVATED, exact: false },
  used: { sql: ACTIVATED, exact: false }
};

/** Rows scanned when the state has to be computed (active/upcoming/used). */
export const COMPUTED_STATE_SCAN = 500;

/**
 * The five statements of the list batch: the candidate grants with emails,
 * then every row resolveAccess needs for the candidates' accounts.
 * @param {string} stateSql State prefilter.
 * @returns {string[]} SQL texts (each binds ?1 kind|null, ?2 scan).
 */
function listStatements(stateSql) {
  const cand = `WITH cand AS (SELECT g.id, g.account_id FROM grants g JOIN accounts a ON a.id = g.account_id
      WHERE (?1 IS NULL OR g.kind = ?1) AND ${stateSql} ORDER BY g.created_at DESC, g.id DESC LIMIT ?2)`;
  const accounts = "(SELECT account_id FROM cand)";
  return [
    `${cand} ${GRANT_WITH_EMAILS} WHERE g.id IN (SELECT id FROM cand) ORDER BY g.created_at DESC, g.id DESC`,
    `${cand} SELECT * FROM accounts WHERE id IN ${accounts}`,
    `${cand} SELECT * FROM grants WHERE account_id IN ${accounts}`,
    `${cand} SELECT * FROM subscriptions WHERE account_id IN ${accounts}`,
    `${cand} SELECT * FROM charges WHERE account_id IN ${accounts}
       OR subscription_id IN (SELECT id FROM subscriptions WHERE account_id IN ${accounts})`
  ];
}

/**
 * Group rows by a key.
 * @param {Object[]} rows Rows.
 * @param {function(Object): string} keyOf Key function.
 * @returns {Map<string, Object[]>} Groups.
 */
function groupBy(rows, keyOf) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyOf(row);
    groups.set(key, (groups.get(key) || []).concat(row));
  }
  return groups;
}

/**
 * Schedule every grant of every listed account.
 * @param {Object} ctx Context.
 * @param {Object[][]} tables [accounts, grants, subscriptions, charges] rows.
 * @returns {Map<string, Object>} Grant id -> schedule entry.
 */
function scheduleAll(ctx, [accounts, grants, subscriptions, charges]) {
  const subAccount = new Map(subscriptions.map((s) => [s.id, s.account_id]));
  const byAccount = {
    grants: groupBy(grants, (g) => g.account_id),
    subscriptions: groupBy(subscriptions, (s) => s.account_id),
    charges: groupBy(charges, (c) => c.account_id || subAccount.get(c.subscription_id))
  };
  const entries = new Map();
  for (const account of accounts) {
    const rows = {
      account,
      grants: byAccount.grants.get(account.id) || [],
      subscriptions: byAccount.subscriptions.get(account.id) || [],
      charges: byAccount.charges.get(account.id) || []
    };
    grantSchedule(rows, ctx.now, accessConfig(ctx.env)).forEach((entry) => entries.set(entry.id, entry));
  }
  return entries;
}

/**
 * Newest grants matching a kind and state, with computed states, in one batch.
 * @param {Object} ctx Context.
 * @param {{kind: string|null, state: string, limit: number}} query Query.
 * @returns {Promise<{grants: Object[], partial: boolean}>} Views; `partial` when the computed-state scan hit its cap.
 */
async function listScheduledGrants(ctx, query) {
  const plan = STATE_SQL[query.state];
  const scan = plan.exact ? query.limit : COMPUTED_STATE_SCAN;
  const results = await ctx.db.batch(listStatements(plan.sql).map((sqlText) => ctx.db.prepare(sqlText).bind(query.kind, scan)));
  const [listed, ...tables] = results.map((r) => r.results);
  const entries = scheduleAll(ctx, tables);
  const views = listed.map((row) => adminGrantView(row, entries.get(row.id)));
  const matching = plan.exact ? views : views.filter((view) => view.state === query.state);
  return { grants: matching.slice(0, query.limit), partial: !plan.exact && listed.length === scan };
}

/**
 * GET /v1/admin/grants.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleListGrants(ctx) {
  const parsed = parseFields(queryObject(ctx.url), LIST_FIELDS);
  if (parsed.error) {
    return parsed.error;
  }
  const limit = limitValue(ctx.url, 50, 200);
  if (limit === INVALID) {
    return badRequest("bad_limit");
  }
  const listed = await listScheduledGrants(ctx, { ...parsed.values, limit });
  return {
    status: 200,
    body: { ok: true, grants: listed.grants, partial: listed.partial },
    audit: { detail: { kind: parsed.values.kind, state: parsed.values.state, count: listed.grants.length } }
  };
}
