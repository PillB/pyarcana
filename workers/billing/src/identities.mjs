/**
 * The sign-in methods an account holds, and removing one (review round 1;
 * ASVS 2.5 / 3.7).
 *
 *   GET    /v1/me                          account.identities: [{provider, subject (masked), createdAt}]
 *   DELETE /v1/me/identities/:provider     google | microsoft; recent authentication
 *
 * Removing a method:
 *   - needs a session created in the last 10 minutes (401 reauth_required),
 *     like linking one;
 *   - never removes the last way in (409 last_sign_in_method). The ways in
 *     that remain are the other OIDC identities, and the email identity for
 *     the account's CURRENT proven address (an email-code sign-in finds an
 *     account by that address, so an email identity for an old address
 *     leads nowhere);
 *   - deletes the identity and revokes every session it created, so someone
 *     who linked their own account after reading one emailed code is out at
 *     once. If the current session is one of them, this browser is signed
 *     out (cookie cleared, {signedOut: true});
 *   - is audited (identity.unlink) and notified to the proven address.
 * Email identities are not removable here: the address is the account's.
 */

import { maskSubject } from "./accounts.mjs";
import { writeAudit } from "./audit.mjs";
import { notifyMethodChange } from "./email.mjs";
import { clearSessionCookie } from "./http.mjs";
import { buildMePayload } from "./me.mjs";
import { isRecentAuth } from "./sessions.mjs";

/** Providers whose identities an account may remove. */
export const REMOVABLE_PROVIDERS = ["google", "microsoft"];

/**
 * The account's identities as the account owner may see them.
 * @param {Object} db D1 binding.
 * @param {string} accountId Account id.
 * @returns {Promise<Array<{provider: string, subject: string, createdAt: number}>>} Methods.
 */
export async function publicIdentities(db, accountId) {
  const rows = await db
    .prepare("SELECT provider, subject, created_at FROM identities WHERE account_id = ?1 ORDER BY created_at, provider")
    .bind(accountId)
    .all();
  return rows.results.map((row) => ({ provider: row.provider, subject: maskSubject(row.subject), createdAt: Number(row.created_at) }));
}

/**
 * Ways in that remain once `provider` is removed.
 * @param {Object[]} identities The account's identity rows.
 * @param {Object} account Account row.
 * @param {string} provider Provider being removed.
 * @returns {number} Count.
 */
function remainingWaysIn(identities, account, provider) {
  const proven = Number(account.email_verified) === 1 ? account.email_normalized : null;
  return identities.filter((row) => {
    if (row.provider === provider) {
      return false;
    }
    return row.provider === "email" ? Boolean(proven) && row.subject === proven : true;
  }).length;
}

/**
 * Why the method cannot be removed, or null.
 * @param {Object} ctx Context with a session.
 * @param {Object[]} identities The account's identity rows.
 * @param {string} provider Provider.
 * @returns {Object|null} Stop result.
 */
function removalRefusal(ctx, identities, provider) {
  if (!REMOVABLE_PROVIDERS.includes(provider)) {
    return { status: 400, body: { ok: false, reason: "bad_provider" } };
  }
  if (!isRecentAuth(ctx.session, ctx.now)) {
    return { status: 401, body: { ok: false, reason: "reauth_required" } };
  }
  if (!identities.some((row) => row.provider === provider)) {
    return { status: 404, body: { ok: false, reason: "not_found" } };
  }
  if (remainingWaysIn(identities, ctx.account, provider) === 0) {
    return { status: 409, body: { ok: false, reason: "last_sign_in_method" } };
  }
  return null;
}

/**
 * DELETE /v1/me/identities/:provider.
 * @param {Object} ctx Context with a session.
 * @returns {Promise<Object>} Result.
 */
export async function handleUnlinkIdentity(ctx) {
  const provider = ctx.params.provider;
  const rows = await ctx.db.prepare("SELECT provider, subject FROM identities WHERE account_id = ?1").bind(ctx.account.id).all();
  const refusal = removalRefusal(ctx, rows.results, provider);
  if (refusal) {
    return refusal;
  }
  // An account holds at most one identity per OIDC provider, so every live
  // session of this method came from the identity being removed.
  const [, revoked] = await ctx.db.batch([
    ctx.db.prepare("DELETE FROM identities WHERE account_id = ?1 AND provider = ?2").bind(ctx.account.id, provider),
    ctx.db
      .prepare("UPDATE sessions SET revoked_at = ?3 WHERE account_id = ?1 AND method = ?2 AND revoked_at IS NULL")
      .bind(ctx.account.id, provider, ctx.now)
  ]);
  await writeAudit(ctx, {
    action: "identity.unlink",
    actorAccountId: ctx.account.id,
    targetAccountId: ctx.account.id,
    detail: { provider, sessionsRevoked: revoked.meta.changes }
  });
  await notifyMethodChange(ctx, ctx.account, "unlinked", provider);
  const signedOut = ctx.session.method === provider;
  if (signedOut) {
    return { status: 200, body: { ok: true, signedOut: true }, setCookie: clearSessionCookie() };
  }
  return { status: 200, body: await buildMePayload(ctx, ctx.account, ctx.session) };
}
