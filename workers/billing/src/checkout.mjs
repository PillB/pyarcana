/**
 * POST /v1/checkout {provider, plan, payerEmail?, acceptTerms: true,
 * adultOrAuthorized: true, force?} (DESIGN-v2 §4, §6, §7).
 *
 * Order of checks (each one before any provider call):
 *   429 rate_limited           10 attempts per account per hour, refusals
 *                              included
 *   400 terms_required         both boxes must be exactly `true`
 *   400 bad_provider/bad_plan  mercadopago | creem; pro_monthly | pro_yearly
 *   400 provider_not_configured  keys, webhook secret, product (Creem) and
 *                              the PRICE_* var for the plan must all be set
 *   400 bad_payer_email / payer_email_required (Mercado Pago only: the
 *                              buyer's MP login, default the account's
 *                              PROVEN address; Microsoft-only accounts must
 *                              type one)
 *   409 rail_country_mismatch  advisory, on request.cf.country: Mercado Pago
 *                              only for PE or an unknown country, Creem only
 *                              outside PE; an admin may pass `force`
 *   409 already_subscribed     a renewing subscription, a cancelled one still
 *                              inside paid time, or a pending subscription or
 *                              open checkout younger than an hour
 * Then the open checkouts row is claimed (inserted only if the account has
 * no open checkout younger than an hour, in one statement, so of two
 * concurrent requests one gets 409 already_subscribed and never reaches the
 * provider) and the provider is called; a failure is 502
 * provider_unavailable with the checkout expired. On success the
 * checkout gets its provider_ref and, for Mercado Pago, a PENDING
 * subscription row (never entitling) in the same batch.
 *
 * The price is the PRICE_* var (integer minor units), never a client value.
 */

import { isAdminSession } from "./accounts.mjs";
import { paidThrough } from "./access.mjs";
import { normalizeEmail } from "./address.mjs";
import { auditStatement } from "./audit.mjs";
import { stringVar } from "./config.mjs";
import { randomId } from "./crypto.mjs";
import { loadAccessRows } from "./entitlement.mjs";
import { CHECKOUT_PENDING_SECONDS } from "./me.mjs";
import { priceFor, RAILS } from "./money.mjs";
import { requestCountry } from "./public.mjs";
import { hitRateLimit } from "./ratelimit.mjs";

/** Checkout attempts per account per hour. */
export const CHECKOUTS_PER_HOUR = 10;

const PLANS = new Set(["pro_monthly", "pro_yearly"]);
const RENEWING = new Set(["active", "past_due"]);

/**
 * A 400/409 stop.
 * @param {number} status Status.
 * @param {string} reason Reason.
 * @returns {Object} Result.
 */
function refuse(status, reason) {
  return { status, body: { ok: false, reason } };
}

/**
 * Validate the body's shape: terms, provider, plan.
 * @param {Object} body Body.
 * @returns {{provider: string, plan: string}|{error: Object}} Parsed.
 */
function parseBody(body) {
  if (body.acceptTerms !== true || body.adultOrAuthorized !== true) {
    return { error: refuse(400, "terms_required") };
  }
  if (!Object.prototype.hasOwnProperty.call(RAILS, body.provider)) {
    return { error: refuse(400, "bad_provider") };
  }
  if (!PLANS.has(body.plan)) {
    return { error: refuse(400, "bad_plan") };
  }
  return { provider: body.provider, plan: body.plan };
}

/**
 * The address the provider is given: Mercado Pago's payer_email (the
 * buyer's typed MP login, else the account's proven address), Creem's
 * customer email (the proven address, or none).
 * @param {Object} ctx Context.
 * @param {string} provider Provider.
 * @returns {{email: string|null}|{error: Object}} Email.
 */
function payerEmail(ctx, provider) {
  const typed = ctx.body.payerEmail;
  const proven = Number(ctx.account.email_verified) === 1 ? ctx.account.email_normalized || null : null;
  if (provider !== "mercadopago") {
    return { email: proven };
  }
  if (typed !== undefined && typed !== null && typed !== "") {
    const email = normalizeEmail(typed);
    return email ? { email } : { error: refuse(400, "bad_payer_email") };
  }
  return proven ? { email: proven } : { error: refuse(400, "payer_email_required") };
}

/**
 * The advisory rail/country rule.
 * @param {string} provider Provider.
 * @param {string|null} country Caller's country.
 * @returns {boolean} Fits.
 */
function railFits(provider, country) {
  return provider === "mercadopago" ? country === null || country === "PE" : country !== "PE";
}

/**
 * Whether the account already has, or is getting, a subscription.
 * @param {Object} ctx Context.
 * @returns {Promise<boolean>} Blocked.
 */
async function alreadySubscribed(ctx) {
  const rows = await loadAccessRows(ctx.db, ctx.account);
  const since = ctx.now - CHECKOUT_PENDING_SECONDS;
  const blocking = rows.subscriptions.some((s) => {
    if (RENEWING.has(s.status) || (s.status === "pending" && Number(s.created_at) > since)) {
      return true;
    }
    const end = paidThrough(s.id, rows.charges);
    return end !== null && end > ctx.now;
  });
  if (blocking) {
    return true;
  }
  const open = await ctx.db
    .prepare("SELECT 1 AS hit FROM checkouts WHERE account_id = ?1 AND status = 'open' AND created_at > ?2 LIMIT 1")
    .bind(ctx.account.id, since)
    .first();
  return Boolean(open);
}

/**
 * Everything checked before the checkout row exists.
 * @param {Object} ctx Context.
 * @returns {Promise<{provider: string, plan: string, email: string|null, forced: boolean, country: string|null}|{error: Object}>} Plan.
 */
async function precheck(ctx) {
  const parsed = parseBody(ctx.body);
  if (parsed.error) {
    return parsed;
  }
  const adapter = ctx.providers[parsed.provider];
  const origin = stringVar(ctx.env, "CANONICAL_ORIGIN");
  if (!adapter || typeof adapter.startCheckout !== "function" || !adapter.configured(ctx.env, parsed.plan) || !origin) {
    return { error: refuse(400, "provider_not_configured") };
  }
  const payer = payerEmail(ctx, parsed.provider);
  if (payer.error) {
    return payer;
  }
  const country = requestCountry(ctx.request);
  const fits = railFits(parsed.provider, country);
  const forced = !fits && ctx.body.force === true && isAdminSession(ctx.env, ctx.account, ctx.session, ctx.now);
  if (!fits && !forced) {
    return { error: refuse(409, "rail_country_mismatch") };
  }
  if (await alreadySubscribed(ctx)) {
    return { error: refuse(409, "already_subscribed") };
  }
  return { ...parsed, email: payer.email, forced, country };
}

/**
 * The page the provider returns the buyer to.
 * @param {Object} env Env.
 * @param {string} checkoutId Checkout id.
 * @returns {string} URL.
 */
function returnUrl(env, checkoutId) {
  return `${stringVar(env, "CANONICAL_ORIGIN")}${stringVar(env, "SITE_PATH")}/cuenta/?billing=return&checkout=${checkoutId}`;
}

/**
 * Statements that record a started checkout.
 * @param {Object} ctx Context.
 * @param {Object} p Precheck plan with price and id.
 * @param {{providerRef: string}} started Provider answer.
 * @returns {Object[]} Statements.
 */
function startedStatements(ctx, p, started) {
  const out = [ctx.db.prepare("UPDATE checkouts SET provider_ref = ?2 WHERE id = ?1").bind(p.id, started.providerRef)];
  if (ctx.providers[p.provider].pendingSubscription) {
    const subId = randomId("sub");
    out.push(
      ctx.db
        .prepare(
          `INSERT INTO subscriptions (id, account_id, provider, provider_ref, plan, amount_minor, currency, status, created_at, updated_at, checkout_id)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'pending', ?8, ?8, ?9)`
        )
        .bind(subId, ctx.account.id, p.provider, started.providerRef, p.plan, p.price.amountMinor, p.price.currency, ctx.now, p.id),
      ctx.db
        .prepare("INSERT INTO subscription_events (subscription_id, account_id, provider, kind, detail, created_at) VALUES (?1, ?2, ?3, 'status', ?4, ?5)")
        .bind(subId, ctx.account.id, p.provider, JSON.stringify({ from: null, to: "pending", source: "checkout" }), ctx.now)
    );
  }
  if (p.forced) {
    out.push(auditStatement(ctx, { action: "checkout.rail_forced", actorAccountId: ctx.account.id, targetAccountId: ctx.account.id, targetId: p.id, detail: { provider: p.provider, country: p.country } }));
  }
  return out;
}

/**
 * POST /v1/checkout.
 * @param {Object} ctx Context with a session (db + pepper configured).
 * @returns {Promise<Object>} Result.
 */
export async function handleCheckout(ctx) {
  const hit = await hitRateLimit(ctx, `checkout:${ctx.account.id}`, CHECKOUTS_PER_HOUR, 3600);
  if (!hit.ok) {
    return { status: 429, body: { ok: false, reason: "rate_limited", retryAfter: hit.retryAfter } };
  }
  const pre = await precheck(ctx);
  if (pre.error) {
    return pre.error;
  }
  const p = { ...pre, id: randomId("chk"), price: priceFor(ctx.env, pre.provider, pre.plan) };
  // The claim: precheck's read cannot stop a concurrent request that passed it too, so the open
  // checkout is inserted only if none younger than an hour exists, in one statement. Whoever
  // inserts nothing never reaches the provider.
  const claimed = await ctx.db
    .prepare(
      `INSERT INTO checkouts (id, account_id, provider, plan, amount_minor, currency, country, created_at, status)
       SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'open'
       WHERE NOT EXISTS (SELECT 1 FROM checkouts WHERE account_id = ?2 AND status = 'open' AND created_at > ?9)`
    )
    .bind(p.id, ctx.account.id, p.provider, p.plan, p.price.amountMinor, p.price.currency, p.country, ctx.now, ctx.now - CHECKOUT_PENDING_SECONDS)
    .run();
  if (claimed.meta.changes !== 1) {
    return refuse(409, "already_subscribed");
  }
  const args = { checkoutId: p.id, accountId: ctx.account.id, plan: p.plan, amountMinor: p.price.amountMinor, currency: p.price.currency, payerEmail: p.email, customerEmail: p.email, backUrl: returnUrl(ctx.env, p.id) };
  const started = await ctx.providers[p.provider].startCheckout(ctx, args);
  if (!started.ok) {
    ctx.log(`checkout failed provider=${p.provider} status=${started.status || 0}`);
    await ctx.db.prepare("UPDATE checkouts SET status = 'expired' WHERE id = ?1").bind(p.id).run();
    return refuse(502, "provider_unavailable");
  }
  await ctx.db.batch(startedStatements(ctx, p, started));
  return {
    status: 200,
    body: { ok: true, url: started.url, checkoutId: p.id, provider: p.provider, plan: p.plan, amountMinor: p.price.amountMinor, currency: p.price.currency, firstChargeNow: true }
  };
}
