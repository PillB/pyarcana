/**
 * The authorization stage for routes that need more than a session, and the
 * admin audit trail (DESIGN-v2 §4 Admin, DESIGN-v3 roles).
 *
 * Route flag `access`:
 *   "admin"  120 requests/hour per account (refusals count too), then the
 *            admin rule (accounts.adminDenial): 403 forbidden, or 401
 *            reauth_required for a listed admin without a fresh Google session.
 *   "qa"     an active `tester` role, or the admin rule; same refusals.
 *
 * Every admin request that got past the session stage is audited once:
 * action = the route's `audit` name, actor = the caller, target and extra
 * detail from the handler's `audit` field, plus the HTTP status and reason.
 * A handler that already wrote its audit row inside its own db.batch (so the
 * change and its record land together) returns `audited: true`. Rate-limited
 * requests (429) are not audited: a flood must not grow the log unbounded.
 */

import { activeRoles, adminDenial } from "./accounts.mjs";
import { writeAudit } from "./audit.mjs";
import { hitRateLimit } from "./ratelimit.mjs";

/** Admin requests allowed per account per hour. */
export const ADMIN_PER_HOUR = 120;

const DENIAL_STATUS = { forbidden: 403, reauth_required: 401 };

/**
 * A refusal result.
 * @param {string} reason forbidden | reauth_required.
 * @returns {Object} Result.
 */
function deny(reason) {
  return { status: DENIAL_STATUS[reason], body: { ok: false, reason } };
}

/**
 * Admin gate: rate limit first (so non-admins are bounded too), then the rule.
 * @param {Object} ctx Context with account and session.
 * @returns {Promise<Object|null>} Stop result or null.
 */
async function adminGate(ctx) {
  const hit = await hitRateLimit(ctx, `admin:${ctx.account.id}`, ADMIN_PER_HOUR, 3600);
  if (!hit.ok) {
    ctx.skipAudit = true;
    return {
      status: 429,
      body: { ok: false, reason: "rate_limited", retryAfter: hit.retryAfter },
      headers: { "retry-after": String(hit.retryAfter) }
    };
  }
  const denial = adminDenial(ctx.env, ctx.account, ctx.session, ctx.now);
  ctx.isAdmin = denial === null;
  return denial ? deny(denial) : null;
}

/**
 * QA gate: an active tester, or an admin.
 * @param {Object} ctx Context with account and session.
 * @returns {Promise<Object|null>} Stop result or null.
 */
async function qaGate(ctx) {
  const denial = adminDenial(ctx.env, ctx.account, ctx.session, ctx.now);
  ctx.isAdmin = denial === null;
  if (ctx.isAdmin || (await activeRoles(ctx, ctx.account.id)).includes("tester")) {
    return null;
  }
  return deny(denial);
}

const GATES = { admin: adminGate, qa: qaGate };

/**
 * Router stage: apply the route's access gate, if any.
 * @param {Object} ctx Context.
 * @returns {Promise<Object|null>} Stop result or null.
 */
export async function accessStage(ctx) {
  const gate = ctx.route.access ? GATES[ctx.route.access] : null;
  return gate ? gate(ctx) : null;
}

/**
 * After an admin route answered: write its audit row unless the handler did.
 * @param {Object} ctx Context.
 * @param {Object} result Handler or stage result.
 * @returns {Promise<void>} Resolves when written.
 */
export async function auditAdminRequest(ctx, result) {
  if (ctx.route.access !== "admin" || !ctx.account || ctx.skipAudit || result.audited) {
    return;
  }
  const audit = result.audit || {};
  const detail = { status: result.status, ...(result.body && result.body.ok === false ? { reason: result.body.reason } : {}), ...(audit.detail || {}) };
  await writeAudit(ctx, {
    action: ctx.route.audit,
    actorAccountId: ctx.account.id,
    targetAccountId: audit.targetAccountId || null,
    targetId: audit.targetId || null,
    detail
  });
}
