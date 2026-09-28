/**
 * Stored roles (DESIGN-v3 Roles). The only role is `tester`: it opens the QA
 * reporting subsite beyond the tester's own reports. Admin is NEVER a stored
 * role (it stays ADMIN_EMAILS plus a fresh Google session).
 *
 *   POST /v1/admin/roles        {email, role, days: 1..3650 | null, note?}
 *   POST /v1/admin/roles/revoke {accountId, role, reason}
 *   GET  /v1/admin/roles        ?role=tester&state=active|expired|revoked|all&limit=
 *
 * Granting again adds a row (PK account_id, role, created_at); a role is
 * active while any row is neither revoked nor expired, so extending a tester
 * is one more grant. Revoke ends every live row of that role at once.
 * Audited by the gate after each request.
 */

import { findOrCreateByEmail, getAccount } from "./accounts.mjs";
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
  requiredText
} from "./input.mjs";

/** Roles an admin may store. */
export const ROLES = ["tester"];

const DAY = 86400;

const GRANT_FIELDS = [
  ["email", (b) => emailValue(b.email), "bad_email"],
  ["role", (b) => enumValue(b.role, ROLES), "bad_role"],
  ["days", (b) => daysValue(b, "days"), "bad_days"],
  ["note", (b) => optionalText(b.note, 200), "bad_note"]
];

const REVOKE_FIELDS = [
  ["accountId", (b) => requiredText(b.accountId, 100), "bad_account_id"],
  ["role", (b) => enumValue(b.role, ROLES), "bad_role"],
  ["reason", (b) => requiredText(b.reason, 200), "reason_required"]
];

const LIST_FIELDS = [
  ["role", (q) => enumValue(q.role, ROLES, "tester"), "bad_role"],
  ["state", (q) => enumValue(q.state, ["active", "expired", "revoked", "all"], "all"), "bad_state"]
];

const ROLE_WITH_EMAILS = `SELECT r.*, a.email AS account_email, g.email AS granter_email
  FROM account_roles r JOIN accounts a ON a.id = r.account_id LEFT JOIN accounts g ON g.id = r.granted_by`;

const STATE_SQL = {
  active: "r.revoked_at IS NULL AND (r.expires_at IS NULL OR r.expires_at > ?2)",
  expired: "r.revoked_at IS NULL AND r.expires_at IS NOT NULL AND r.expires_at <= ?2",
  revoked: "r.revoked_at IS NOT NULL",
  all: "?2 IS NOT NULL"
};

/**
 * The state of a role row at `now`.
 * @param {Object} row Role row.
 * @param {number} now Clock.
 * @returns {"active"|"expired"|"revoked"} State.
 */
function roleState(row, now) {
  if (row.revoked_at !== null) {
    return "revoked";
  }
  return row.expires_at !== null && Number(row.expires_at) <= now ? "expired" : "active";
}

/**
 * Admin view of a role row.
 * @param {Object} row Row with emails.
 * @param {number} now Clock.
 * @returns {Object} View.
 */
function roleView(row, now) {
  return {
    accountId: row.account_id,
    email: row.account_email || null,
    role: row.role,
    createdAt: Number(row.created_at),
    expiresAt: row.expires_at === null ? null : Number(row.expires_at),
    revokedAt: row.revoked_at === null ? null : Number(row.revoked_at),
    revokeReason: row.revoke_reason || null,
    note: row.note || null,
    grantedBy: row.granter_email || null,
    state: roleState(row, now)
  };
}

/**
 * POST /v1/admin/roles.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleGrantRole(ctx) {
  const parsed = parseFields(ctx.body, GRANT_FIELDS);
  if (parsed.error) {
    return parsed.error;
  }
  const { email, role, days, note } = parsed.values;
  const target = await findOrCreateByEmail(ctx, email);
  const expiresAt = days === null ? null : ctx.now + days * DAY;
  await ctx.db
    .prepare(
      `INSERT INTO account_roles (account_id, role, granted_by, created_at, expires_at, note)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6) ON CONFLICT DO NOTHING`
    )
    .bind(target.account.id, role, ctx.account.id, ctx.now, expiresAt, note)
    .run();
  const row = await ctx.db
    .prepare(`${ROLE_WITH_EMAILS} WHERE r.account_id = ?1 AND r.role = ?2 AND r.created_at = ?3`)
    .bind(target.account.id, role, ctx.now)
    .first();
  return {
    status: 201,
    body: { ok: true, role: roleView(row, ctx.now), warnings: target.created ? ["account_created"] : [] },
    audit: { targetAccountId: target.account.id, detail: { role, days } }
  };
}

/**
 * POST /v1/admin/roles/revoke. Idempotent.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleRevokeRole(ctx) {
  const parsed = parseFields(ctx.body, REVOKE_FIELDS);
  if (parsed.error) {
    return parsed.error;
  }
  const { accountId, role, reason } = parsed.values;
  if (!(await getAccount(ctx.db, accountId))) {
    return { status: 404, body: { ok: false, reason: "not_found" } };
  }
  const update = await ctx.db
    .prepare(
      `UPDATE account_roles SET revoked_at = ?3, revoked_by = ?4, revoke_reason = ?5
       WHERE account_id = ?1 AND role = ?2 AND revoked_at IS NULL`
    )
    .bind(accountId, role, ctx.now, ctx.account.id, reason)
    .run();
  const revoked = update.meta.changes;
  return {
    status: 200,
    body: { ok: true, revoked, alreadyRevoked: revoked === 0 },
    audit: { targetAccountId: accountId, detail: { role, revoked } }
  };
}

/**
 * GET /v1/admin/roles.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleListRoles(ctx) {
  const parsed = parseFields(queryObject(ctx.url), LIST_FIELDS);
  if (parsed.error) {
    return parsed.error;
  }
  const limit = limitValue(ctx.url, 100, 500);
  if (limit === INVALID) {
    return badRequest("bad_limit");
  }
  const { role, state } = parsed.values;
  const rows = await ctx.db
    .prepare(`${ROLE_WITH_EMAILS} WHERE r.role = ?1 AND ${STATE_SQL[state]} ORDER BY r.created_at DESC LIMIT ?3`)
    .bind(role, ctx.now, limit)
    .all();
  const roles = rows.results.map((row) => roleView(row, ctx.now));
  return { status: 200, body: { ok: true, roles }, audit: { detail: { role, state, count: roles.length } } };
}
