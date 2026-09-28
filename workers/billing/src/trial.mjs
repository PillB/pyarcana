/**
 * POST /v1/me/trial {} -> the me payload (DESIGN-v2 §4 + v3).
 *
 * Opt-in, no card, TRIAL_DAYS (default 7). Refusals are 409:
 *   trial_used          the account flag is set, or any claim key (account,
 *                       proven canonical email, OIDC subject) is taken
 *   trial_not_available the account has a subscription that was ever active
 *
 * The flag, every claim insert and the grant are ONE db.batch. Claim inserts
 * are plain INSERTs on a primary key, so when two requests race, the second
 * batch fails on a claim and rolls back whole: at most one trial grant can
 * ever exist per claim key, whatever the timing (20 concurrent calls -> one
 * grant, tests/trial.test.mjs). The pre-check is only the fast, friendly path.
 * Stated gap: a subscription activating in the same instant as the trial is
 * not re-checked inside the batch.
 */

import { getAccount } from "./accounts.mjs";
import { auditStatement } from "./audit.mjs";
import { trialDays } from "./config.mjs";
import { randomId } from "./crypto.mjs";
import { loadAccessRows } from "./entitlement.mjs";
import { buildMePayload } from "./me.mjs";
import { anyClaimed, trialBlockReason, trialClaimKeys } from "./trial-claims.mjs";

/**
 * A 409 with a reason.
 * @param {string} reason Reason code.
 * @returns {Object} Result.
 */
function conflict(reason) {
  return { status: 409, body: { ok: false, reason } };
}

/**
 * The one batch that claims the trial and grants it.
 * @param {Object} ctx Context.
 * @param {string[]} keys Claim keys.
 * @param {string} grantId New grant id.
 * @returns {Object[]} Prepared statements.
 */
function trialBatch(ctx, keys, grantId) {
  const db = ctx.db;
  const accountId = ctx.account.id;
  const days = trialDays(ctx.env);
  return [
    db.prepare("UPDATE accounts SET trial_used_at = ?2, updated_at = ?2 WHERE id = ?1").bind(accountId, ctx.now),
    ...keys.map((key) => db.prepare("INSERT INTO trial_claims (key, claimed_at) VALUES (?1, ?2)").bind(key, ctx.now)),
    db
      .prepare("INSERT INTO grants (id, account_id, kind, days, created_at) VALUES (?1, ?2, 'trial', ?3, ?4)")
      .bind(grantId, accountId, days, ctx.now),
    auditStatement(ctx, { action: "trial.start", actorAccountId: accountId, targetAccountId: accountId, targetId: grantId, detail: { days } })
  ];
}

/**
 * POST /v1/me/trial.
 * @param {Object} ctx Context with a session (db + pepper configured).
 * @returns {Promise<Object>} Result.
 */
export async function handleStartTrial(ctx) {
  const rows = await loadAccessRows(ctx.db, ctx.account);
  const keys = await trialClaimKeys(ctx, ctx.account);
  const blocked = await trialBlockReason(ctx, ctx.account, rows, keys);
  if (blocked) {
    return conflict(blocked);
  }
  try {
    await ctx.db.batch(trialBatch(ctx, keys, randomId("grant")));
  } catch (error) {
    if (await anyClaimed(ctx.db, keys)) {
      return conflict("trial_used");
    }
    throw error;
  }
  const fresh = await getAccount(ctx.db, ctx.account.id);
  return { status: 200, body: await buildMePayload(ctx, fresh, ctx.session) };
}
