/**
 * Admin account operations (DESIGN-v2 §4 Admin).
 *
 *   GET  /v1/admin/account?email= | ?id=                 one account, everything about it
 *   POST /v1/admin/accounts/disable {email|accountId, reason}  disable + revoke every session
 *   POST /v1/admin/accounts/enable  {email|accountId, reason}  undo a disable (sessions stay revoked)
 *   POST /v1/admin/accounts/email   {accountId, newEmail, reason} rectification
 *
 * `accountId` is accepted next to `email` because a Microsoft-only account
 * has no proven email to look it up by. Rectification stores the typed
 * address as UNPROVEN (email_verified 0): it cannot make anyone admin, and
 * the person proves it on their next email-code sign-in. Audit details carry
 * ids and flags only, never an address (the gate writes them).
 * Stated: `enable` is an addition to DESIGN-v2 (a disable must be undoable).
 */

import { findLiveAccountByEmail, getAccount, maskSubject } from "./accounts.mjs";
import { accessSnapshot } from "./entitlement.mjs";
import { adminGrantView, GRANT_WITH_EMAILS } from "./grants.mjs";
import { badRequest, emailValue, parseFields, queryObject, requiredText } from "./input.mjs";
import { paidThrough } from "./access.mjs";
import { ROLE_WITH_EMAILS, roleView } from "./roles.mjs";

const REASON = ["reason", (b) => requiredText(b.reason, 200), "reason_required"];
const RENEWING = new Set(["active", "past_due"]);

/**
 * Resolve the account a request targets, by accountId or by email.
 * @param {Object} ctx Context.
 * @param {{accountId?: unknown, email?: unknown, id?: unknown}} source Body or query.
 * @returns {Promise<{account: Object}|{stop: Object}>} Account or a stop result.
 */
async function resolveTarget(ctx, source) {
  const id = source.accountId || source.id;
  if (typeof id === "string" && id) {
    const account = await getAccount(ctx.db, id.slice(0, 100));
    return account ? { account } : { stop: { status: 404, body: { ok: false, reason: "not_found" } } };
  }
  if (source.email === undefined) {
    return { stop: badRequest("bad_target") };
  }
  const email = emailValue(source.email);
  if (typeof email !== "string") {
    return { stop: badRequest("bad_email") };
  }
  const account = await findLiveAccountByEmail(ctx.db, email);
  return account ? { account } : { stop: { status: 404, body: { ok: false, reason: "not_found" } } };
}

/**
 * The account fields an admin sees.
 * @param {Object} a Account row.
 * @returns {Object} View.
 */
function adminAccountView(a) {
  const num = (v) => (v === null || v === undefined ? null : Number(v));
  return {
    id: a.id,
    email: a.email || null,
    emailVerified: Number(a.email_verified) === 1,
    displayName: a.display_name || null,
    createdAt: num(a.created_at),
    firstSigninAt: num(a.first_signin_at),
    termsVersion: a.terms_version || null,
    trialUsedAt: num(a.trial_used_at),
    disabledAt: num(a.disabled_at),
    disabledReason: a.disabled_reason || null,
    deletedAt: num(a.deleted_at)
  };
}

/**
 * Parse a reason, then resolve the target.
 * @param {Object} ctx Context.
 * @returns {Promise<{account: Object, reason: string}|{stop: Object}>} Target or stop.
 */
async function reasonAndTarget(ctx) {
  const parsed = parseFields(ctx.body, [REASON]);
  if (parsed.error) {
    return { stop: parsed.error };
  }
  const target = await resolveTarget(ctx, ctx.body);
  return target.stop ? target : { account: target.account, reason: parsed.values.reason };
}

/**
 * POST /v1/admin/accounts/disable.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleDisableAccount(ctx) {
  const target = await reasonAndTarget(ctx);
  if (target.stop) {
    return target.stop;
  }
  const id = target.account.id;
  if (id === ctx.account.id) {
    return { status: 409, body: { ok: false, reason: "cannot_disable_self" }, audit: { targetAccountId: id } };
  }
  const [update, sessions] = await ctx.db.batch([
    ctx.db
      .prepare("UPDATE accounts SET disabled_at = ?2, disabled_reason = ?3, updated_at = ?2 WHERE id = ?1 AND disabled_at IS NULL")
      .bind(id, ctx.now, target.reason),
    ctx.db.prepare("UPDATE sessions SET revoked_at = ?2 WHERE account_id = ?1 AND revoked_at IS NULL").bind(id, ctx.now)
  ]);
  const alreadyDisabled = update.meta.changes !== 1;
  const sessionsRevoked = sessions.meta.changes;
  return {
    status: 200,
    body: { ok: true, account: adminAccountView(await getAccount(ctx.db, id)), alreadyDisabled, sessionsRevoked },
    audit: { targetAccountId: id, detail: { alreadyDisabled, sessionsRevoked } }
  };
}

/**
 * POST /v1/admin/accounts/enable.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleEnableAccount(ctx) {
  const target = await reasonAndTarget(ctx);
  if (target.stop) {
    return target.stop;
  }
  const id = target.account.id;
  const update = await ctx.db
    .prepare("UPDATE accounts SET disabled_at = NULL, disabled_reason = NULL, updated_at = ?2 WHERE id = ?1 AND disabled_at IS NOT NULL")
    .bind(id, ctx.now)
    .run();
  const wasDisabled = update.meta.changes === 1;
  return {
    status: 200,
    body: { ok: true, account: adminAccountView(await getAccount(ctx.db, id)), wasDisabled },
    audit: { targetAccountId: id, detail: { wasDisabled } }
  };
}

const EMAIL_FIELDS = [
  ["accountId", (b) => requiredText(b.accountId, 100), "bad_account_id"],
  ["newEmail", (b) => emailValue(b.newEmail), "bad_email"],
  REASON
];

/**
 * Store the rectified address; a lost race on the unique index is a 409.
 * @param {Object} ctx Context.
 * @param {string} id Account id.
 * @param {string} email New normalized email.
 * @returns {Promise<boolean>} Stored (false when the address was taken meanwhile).
 */
async function storeEmail(ctx, id, email) {
  try {
    await ctx.db
      .prepare("UPDATE accounts SET email = ?2, email_normalized = ?2, email_verified = 0, updated_at = ?3 WHERE id = ?1")
      .bind(id, email, ctx.now)
      .run();
    return true;
  } catch (error) {
    if (/unique/i.test(String(error && error.message))) {
      return false;
    }
    throw error;
  }
}

/**
 * POST /v1/admin/accounts/email.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleRectifyEmail(ctx) {
  const parsed = parseFields(ctx.body, EMAIL_FIELDS);
  if (parsed.error) {
    return parsed.error;
  }
  const { accountId, newEmail } = parsed.values;
  const account = await getAccount(ctx.db, accountId);
  if (!account || account.deleted_at !== null) {
    return { status: 404, body: { ok: false, reason: "not_found" } };
  }
  const audit = { targetAccountId: account.id };
  if (account.email_normalized === newEmail) {
    return { status: 200, body: { ok: true, unchanged: true, account: adminAccountView(account) }, audit: { ...audit, detail: { unchanged: true } } };
  }
  const holder = await findLiveAccountByEmail(ctx.db, newEmail);
  if ((holder && holder.id !== account.id) || !(await storeEmail(ctx, account.id, newEmail))) {
    return { status: 409, body: { ok: false, reason: "email_in_use" }, audit };
  }
  const fresh = await getAccount(ctx.db, account.id);
  return { status: 200, body: { ok: true, unchanged: false, account: adminAccountView(fresh) }, audit: { ...audit, detail: { emailVerifiedReset: true } } };
}

/**
 * Admin view of a subscription.
 * @param {Object} s Subscription row.
 * @param {Object[]} charges Charge rows.
 * @returns {Object} View.
 */
function adminSubscriptionView(s, charges) {
  return {
    id: s.id,
    provider: s.provider,
    providerRef: s.provider_ref,
    plan: s.plan,
    amountMinor: Number(s.amount_minor),
    currency: s.currency,
    status: s.status,
    cancelAtPeriodEnd: Number(s.cancel_at_period_end) === 1,
    firstActiveAt: s.first_active_at === null ? null : Number(s.first_active_at),
    createdAt: Number(s.created_at),
    paidThrough: paidThrough(s.id, charges)
  };
}

/**
 * Admin view of a charge.
 * @param {Object} c Charge row.
 * @returns {Object} View.
 */
function adminChargeView(c) {
  return {
    id: c.id,
    provider: c.provider,
    subscriptionId: c.subscription_id,
    amountMinor: Number(c.amount_minor),
    currency: c.currency,
    status: c.status,
    approvedAt: c.approved_at,
    periodStart: c.period_start,
    periodEnd: c.period_end,
    refundedAt: c.refunded_at,
    chargedBackAt: c.charged_back_at,
    flag: c.flag || null
  };
}

/**
 * Identities, roles, grants with emails, and the last 50 audit rows.
 * @param {Object} ctx Context.
 * @param {string} id Account id.
 * @returns {Promise<Object[][]>} [identities, roles, grants, audit] rows.
 */
async function accountDetailRows(ctx, id) {
  const results = await ctx.db.batch([
    ctx.db.prepare("SELECT provider, subject, created_at FROM identities WHERE account_id = ?1 ORDER BY created_at").bind(id),
    ctx.db.prepare(`${ROLE_WITH_EMAILS} WHERE r.account_id = ?1 ORDER BY r.created_at DESC`).bind(id),
    ctx.db.prepare(`${GRANT_WITH_EMAILS} WHERE g.account_id = ?1 ORDER BY g.created_at, g.id`).bind(id),
    ctx.db.prepare("SELECT * FROM audit_log WHERE target_account_id = ?1 ORDER BY id DESC LIMIT 50").bind(id)
  ]);
  return results.map((r) => r.results);
}

/**
 * Admin view of an audit row.
 * @param {Object} row Audit row.
 * @returns {Object} View.
 */
function auditView(row) {
  return {
    id: row.id,
    action: row.action,
    actorAccountId: row.actor_account_id,
    targetAccountId: row.target_account_id,
    targetId: row.target_id,
    detail: row.detail ? JSON.parse(row.detail) : null,
    createdAt: row.created_at
  };
}

/**
 * GET /v1/admin/account?email= | ?id=.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleGetAccount(ctx) {
  const target = await resolveTarget(ctx, queryObject(ctx.url));
  if (target.stop) {
    return target.stop;
  }
  const account = target.account;
  const snapshot = await accessSnapshot(ctx, account);
  const [identities, roles, grants, audit] = await accountDetailRows(ctx, account.id);
  const entries = new Map(snapshot.schedule.map((e) => [e.id, e]));
  const subscriptions = snapshot.rows.subscriptions;
  const renewing = subscriptions.filter((s) => RENEWING.has(s.status) && Number(s.cancel_at_period_end) !== 1);
  const body = {
    ok: true,
    account: adminAccountView(account),
    access: snapshot.access,
    grants: grants.map((row) => adminGrantView(row, entries.get(row.id))),
    roles: roles.map((row) => roleView(row, ctx.now)),
    identities: identities.map((i) => ({ provider: i.provider, subject: maskSubject(i.subject), createdAt: i.created_at })),
    subscriptions: subscriptions.map((s) => adminSubscriptionView(s, snapshot.rows.charges)),
    charges: snapshot.rows.charges.map(adminChargeView),
    flags: { doubleSubscription: renewing.length > 1 },
    audit: audit.map(auditView)
  };
  return { status: 200, body, audit: { targetAccountId: account.id } };
}
