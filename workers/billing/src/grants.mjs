/**
 * Admin grants (DESIGN-v2 §4 Admin, amended by DESIGN-v3).
 *
 *   POST /v1/admin/grants        {email, days: 1..3650 | null, kind?: gift|tester, note?, requestId}
 *   POST /v1/admin/grants/revoke {grantId, reason}
 *   GET  /v1/admin/grants        ?kind=trial|gift|tester &state=active|upcoming|pending_activation|used|revoked|all &limit=
 *
 * A grant stores only `days` (NULL = indefinite) and created_at; its dates
 * are computed on read by access.mjs, so stacking, deferral behind paid
 * time, activation at first sign-in and re-flow after a revoke need no
 * stored start/end. The account is created (unverified, never signed in)
 * when the email is unknown.
 *
 * Idempotency: UNIQUE(issued_by, request_id). A replay of the same body
 * answers 200 with the existing grant (`deduplicated: true`); a replay with a
 * different body is 409 idempotency_mismatch. The create writes its audit
 * row in the same batch as the grant, keyed on the new grant id, so the row
 * exists exactly when this call created the grant. Revokes are audited by
 * the gate after the UPDATE; the grant row itself keeps revoked_at,
 * revoked_by and revoke_reason.
 */

import { findOrCreateByEmail } from "./accounts.mjs";
import { randomId } from "./crypto.mjs";
import { accessSnapshot } from "./entitlement.mjs";
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
import { listScheduledGrants } from "./grant-list.mjs";

/** Kinds an admin may issue (trials come only from POST /v1/me/trial). */
export const ADMIN_GRANT_KINDS = ["gift", "tester"];

const CREATE_FIELDS = [
  ["email", (b) => emailValue(b.email), "bad_email"],
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

const GRANT_WITH_EMAILS = `SELECT g.*, a.email AS account_email, i.email AS issuer_email
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
 * @param {string} accountId Target account id.
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
 * The answer for a replayed requestId.
 * @param {Object} ctx Context.
 * @param {Object} stored Stored grant row (with emails).
 * @param {Object} input Parsed body.
 * @param {Object} account Target account.
 * @returns {Promise<Object>} Result.
 */
async function replayResult(ctx, stored, input, account) {
  const audit = { targetAccountId: stored.account_id, targetId: stored.id, detail: { deduplicated: true } };
  if (!sameRequest(stored, input, account.id)) {
    return { status: 409, body: { ok: false, reason: "idempotency_mismatch", grantId: stored.id }, audit };
  }
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
  const parsed = parseFields(ctx.body, CREATE_FIELDS);
  if (parsed.error) {
    return parsed.error;
  }
  const input = parsed.values;
  const earlier = await grantRow(ctx.db, "g.issued_by = ?1 AND g.request_id = ?2", ctx.account.id, input.requestId);
  if (earlier) {
    return replayResult(ctx, earlier, input, await findOrCreateByEmail(ctx, input.email).then((t) => t.account));
  }
  const target = await findOrCreateByEmail(ctx, input.email);
  const grantId = randomId("grant");
  await ctx.db.batch(createBatch(ctx, input, grantId, { accountId: target.account.id, created: target.created }));
  const stored = await grantRow(ctx.db, "g.issued_by = ?1 AND g.request_id = ?2", ctx.account.id, input.requestId);
  if (stored.id !== grantId) {
    return replayResult(ctx, stored, input, target.account);
  }
  const { view, snapshot } = await viewWithSchedule(ctx, stored, target.account);
  const body = { ok: true, deduplicated: false, account: accountSummary(target.account), grant: view, warnings: grantWarnings(target.account, target.created, snapshot) };
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
