/**
 * Shared sign-in completion, the terms gate, and logout.
 *
 * Every sign-in method ends in `completeSignIn`: it refuses disabled or
 * deleted accounts, records first_signin_at / terms_version /
 * age_confirmed_at, replaces any session this browser already held, creates
 * the new session and sets the cookie.
 */

import { accountBlockReason, getAccount, recordSignin } from "./accounts.mjs";
import { termsVersion } from "./config.mjs";
import { clearSessionCookie, sessionCookie } from "./http.mjs";
import { buildMePayload } from "./me.mjs";
import { createSession, revokeAllSessions, revokeSession } from "./sessions.mjs";

/**
 * Sign-in requires `ageConfirmed === true` and the current terms version.
 * @param {Object} ctx Context with `body`.
 * @returns {Object|null} Stop result, or null when accepted.
 */
export function checkTerms(ctx) {
  const expected = termsVersion(ctx.env);
  if (!expected) {
    return { status: 503, body: { ok: false, reason: "terms_not_configured" } };
  }
  if (ctx.body.ageConfirmed !== true || ctx.body.termsVersion !== expected) {
    return { status: 400, body: { ok: false, reason: "terms_required", termsVersion: expected } };
  }
  return null;
}

/**
 * Finish a sign-in for a resolved account.
 * @param {Object} ctx Context.
 * @param {Object} account Account row.
 * @param {"google"|"microsoft"|"email"} method Sign-in method.
 * @param {{emailVerified: boolean, subject: string}} proof What this sign-in proved about the email, and
 *   the identity subject (of `method`) that signed in, recorded on the session.
 * @returns {Promise<Object>} Result with the me payload and the session cookie.
 */
export async function completeSignIn(ctx, account, method, proof) {
  const blocked = accountBlockReason(account);
  if (blocked) {
    return { status: 403, body: { ok: false, reason: blocked } };
  }
  await recordSignin(ctx, account.id, { termsVersion: termsVersion(ctx.env), emailVerified: proof.emailVerified });
  if (ctx.session) {
    await revokeSession(ctx, ctx.session.id);
  }
  const { token, session, maxAge } = await createSession(ctx, account.id, method, proof.subject);
  const fresh = await getAccount(ctx.db, account.id);
  return { status: 200, body: await buildMePayload(ctx, fresh, session), setCookie: sessionCookie(token, maxAge) };
}

/**
 * POST /v1/auth/logout {everywhere?}: revoke this session (or all of the
 * account's) and clear the cookie. Idempotent without a session.
 * @param {Object} ctx Context (optional session).
 * @returns {Promise<Object>} Result.
 */
export async function handleLogout(ctx) {
  if (ctx.session && ctx.body.everywhere === true) {
    await revokeAllSessions(ctx, ctx.account.id);
  } else if (ctx.session) {
    await revokeSession(ctx, ctx.session.id);
  }
  return { status: 200, body: { ok: true }, setCookie: clearSessionCookie() };
}
