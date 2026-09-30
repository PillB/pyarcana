/**
 * POST /v1/checkout (DESIGN-v2 §4, §6, §7).
 *
 * Mercado Pago (PEN): POST /preapproval with status "pending", no plan,
 * external_reference "pyarcana:<acct>:<chk>", X-Idempotency-Key <chk>; the
 * worker stores a checkouts row and a PENDING subscription row (which never
 * entitles) and returns init_point. Creem (USD): POST /v1/checkouts with
 * request_id <chk> and metadata {account_id, checkout_id}; the subscription
 * row is created later, by checkout.completed.
 * Refusals: terms, plan, provider, configuration, an existing or in-flight
 * subscription, the advisory rail/country check (admin `force` only), the
 * 10/h rate limit, and a provider failure (502, checkout expired).
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, count, seedAccount, sql } from "./fixtures.mjs";
import { CREEM_BASE, CREEM_KEY, CREEM_YEARLY, MP_BASE, MP_TOKEN, call, createPaymentsHarness } from "./payments-fake.mjs";

const TERMS = { acceptTerms: true, adultOrAuthorized: true };

/**
 * A signed-in learner and a payments harness.
 * @param {Object} [overrides] Env overrides.
 * @param {Object} [spec] seedAccount spec.
 * @returns {Promise<Object>} {env, fake, who}.
 */
async function learner(overrides, spec) {
  const h = await createPaymentsHarness(overrides);
  const who = await seedAccount(h.env, spec || { email: "ana@example.test" });
  return { ...h, who };
}

/**
 * POST /v1/checkout as the learner.
 * @param {Object} h Harness.
 * @param {Object} body Body.
 * @param {{cf?: Object, token?: string, now?: number, log?: function}} [opts] Options.
 * @returns {Promise<Object>} Result.
 */
function checkout(h, body, opts = {}) {
  return call(h.env, "POST", "/api/v1/checkout", {
    body,
    cookie: opts.token || h.who.token,
    cf: opts.cf === undefined ? { country: "PE" } : opts.cf,
    fake: h.fake,
    now: opts.now,
    log: opts.log
  });
}

/**
 * Seed a subscription row for an account.
 * @param {Object} env Env.
 * @param {string} accountId Account.
 * @param {Object} s {id, status, createdAt?, cancel?}.
 * @returns {Promise<void>} Resolves when inserted.
 */
async function seedSub(env, accountId, s) {
  await sql(
    env,
    `INSERT INTO subscriptions (id, account_id, provider, provider_ref, plan, amount_minor, currency, status, cancel_at_period_end, created_at, updated_at)
     VALUES (?1, ?2, 'mercadopago', ?3, 'pro_monthly', 1990, 'PEN', ?4, ?5, ?6, ?6)`,
    s.id,
    accountId,
    `ref_${s.id}`,
    s.status,
    s.cancel || 0,
    s.createdAt === undefined ? NOW - 90 * 86400 : s.createdAt
  );
}

test("mercadopago: a pending preapproval with the design's exact body; checkout + pending subscription stored; nothing entitles", async () => {
  const h = await learner();
  const res = await checkout(h, { provider: "mercadopago", plan: "pro_monthly", ...TERMS });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const chk = res.body.checkoutId;
  assert.match(chk, /^chk_[A-Za-z0-9_-]{22}$/);
  const [created] = h.fake.calls.filter((c) => c.method === "POST");
  assert.equal(created.url, `${MP_BASE}/preapproval`);
  assert.equal(created.headers.get("authorization"), `Bearer ${MP_TOKEN}`);
  assert.equal(created.headers.get("x-idempotency-key"), chk);
  assert.deepEqual(created.body, {
    reason: "PyArcana Pro mensual",
    external_reference: `pyarcana:${h.who.account.id}:${chk}`,
    payer_email: "ana@example.test",
    auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 19.9, currency_id: "PEN" },
    back_url: `https://app.pyarcana.test/cuenta/?billing=return&checkout=${chk}`,
    status: "pending"
  });
  const preapprovalId = Object.keys(h.fake.mp.preapprovals)[0];
  assert.deepEqual(res.body, {
    ok: true,
    url: h.fake.mp.preapprovals[preapprovalId].init_point,
    checkoutId: chk,
    provider: "mercadopago",
    plan: "pro_monthly",
    amountMinor: 1990,
    currency: "PEN",
    firstChargeNow: true
  });
  const row = await h.env.DB.prepare("SELECT * FROM checkouts WHERE id = ?1").bind(chk).first();
  assert.deepEqual(
    [row.account_id, row.provider, row.plan, row.amount_minor, row.currency, row.provider_ref, row.country, row.status],
    [h.who.account.id, "mercadopago", "pro_monthly", 1990, "PEN", preapprovalId, "PE", "open"]
  );
  const sub = await h.env.DB.prepare("SELECT * FROM subscriptions WHERE checkout_id = ?1").bind(chk).first();
  assert.deepEqual([sub.provider_ref, sub.status, sub.amount_minor, sub.currency, sub.first_active_at], [preapprovalId, "pending", 1990, "PEN", null]);
  const me = await call(h.env, "GET", "/api/v1/me", { cookie: h.who.token });
  assert.equal(me.body.access.isPro, false, "a pending preapproval never entitles");
  assert.equal(me.body.checkoutPending, true);
});

test("mercadopago: yearly is 12 months at 119.90, and the payer email the buyer typed is used", async () => {
  const h = await learner();
  const res = await checkout(h, { provider: "mercadopago", plan: "pro_yearly", payerEmail: " Ana.MP@Example.test ", ...TERMS });
  assert.equal(res.status, 200);
  const body = h.fake.calls.find((c) => c.method === "POST").body;
  assert.deepEqual(body.auto_recurring, { frequency: 12, frequency_type: "months", transaction_amount: 119.9, currency_id: "PEN" });
  assert.equal(body.reason, "PyArcana Pro anual");
  assert.equal(body.payer_email, "ana.mp@example.test");
  assert.equal(res.body.amountMinor, 11990);
});

test("mercadopago: a bad payer email, or none on an account with no proven address, is refused before any provider call", async () => {
  const h = await learner();
  assert.deepEqual((await checkout(h, { provider: "mercadopago", plan: "pro_monthly", payerEmail: "not-an-email", ...TERMS })).body, { ok: false, reason: "bad_payer_email" });
  const ms = await learner(undefined, { email: "ms@contoso.test", verified: false, method: "microsoft" });
  const res = await checkout(ms, { provider: "mercadopago", plan: "pro_monthly", ...TERMS });
  assert.deepEqual([res.status, res.body.reason], [400, "payer_email_required"]);
  assert.equal(h.fake.calls.length + ms.fake.calls.length, 0);
});

test("creem: POST /v1/checkouts with product, request_id, customer email and metadata; no subscription row until the webhook", async () => {
  const h = await learner();
  const res = await checkout(h, { provider: "creem", plan: "pro_yearly", ...TERMS }, { cf: { country: "US" } });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const chk = res.body.checkoutId;
  const [created] = h.fake.calls;
  assert.equal(created.url, `${CREEM_BASE}/v1/checkouts`);
  assert.equal(created.headers.get("x-api-key"), CREEM_KEY);
  assert.deepEqual(created.body, {
    product_id: CREEM_YEARLY,
    request_id: chk,
    customer: { email: "ana@example.test" },
    metadata: { account_id: h.who.account.id, checkout_id: chk },
    success_url: `https://app.pyarcana.test/cuenta/?billing=return&checkout=${chk}`
  });
  const creemId = Object.keys(h.fake.creem.checkouts)[0];
  assert.equal(res.body.url, h.fake.creem.checkouts[creemId].checkout_url);
  assert.deepEqual([res.body.amountMinor, res.body.currency], [4900, "USD"]);
  const row = await h.env.DB.prepare("SELECT * FROM checkouts WHERE id = ?1").bind(chk).first();
  assert.deepEqual([row.provider, row.provider_ref, row.country, row.status], ["creem", creemId, "US", "open"]);
  assert.equal(await count(h.env, "FROM subscriptions"), 0);
});

test("creem: an account with no proven address sends no customer email (Creem asks the buyer)", async () => {
  const h = await learner(undefined, { email: "ms@contoso.test", verified: false, method: "microsoft" });
  const res = await checkout(h, { provider: "creem", plan: "pro_monthly", ...TERMS }, { cf: { country: "MX" } });
  assert.equal(res.status, 200);
  assert.equal(h.fake.calls[0].body.customer, undefined);
});

test("refusals: terms, plan, provider and configuration are checked before any provider call", async () => {
  const h = await learner();
  const cases = [
    [{ provider: "mercadopago", plan: "pro_monthly" }, 400, "terms_required"],
    [{ provider: "mercadopago", plan: "pro_monthly", acceptTerms: true, adultOrAuthorized: "yes" }, 400, "terms_required"],
    [{ provider: "mercadopago", plan: "pro_weekly", ...TERMS }, 400, "bad_plan"],
    [{ provider: "stripe", plan: "pro_monthly", ...TERMS }, 400, "bad_provider"]
  ];
  for (const [body, status, reason] of cases) {
    const res = await checkout(h, body);
    assert.deepEqual([res.status, res.body.reason], [status, reason], JSON.stringify(body));
  }
  const configs = [
    [{ MP_ACCESS_TOKEN: undefined }, "mercadopago"],
    [{ MP_WEBHOOK_SECRET: undefined }, "mercadopago"],
    [{ PRICE_PE_MONTHLY_MINOR: "19.90" }, "mercadopago"],
    [{ CREEM_PRODUCT_PRO_MONTHLY: "" }, "creem"],
    [{ CREEM_WEBHOOK_SECRET: undefined }, "creem"],
    [{ PRICE_US_MONTHLY_MINOR: undefined }, "creem"]
  ];
  for (const [overrides, provider] of configs) {
    const c = await learner(overrides);
    const res = await checkout(c, { provider, plan: "pro_monthly", ...TERMS }, { cf: { country: provider === "creem" ? "US" : "PE" } });
    assert.deepEqual([res.status, res.body.reason], [400, "provider_not_configured"], JSON.stringify(overrides));
    assert.equal(c.fake.calls.length, 0);
  }
  assert.equal(h.fake.calls.length, 0);
  assert.equal(await count(h.env, "FROM checkouts"), 0);
});

test("rail/country (advisory): Mercado Pago only for PE or an unknown country, Creem only outside PE", async () => {
  const cases = [
    ["mercadopago", { country: "US" }, 409],
    ["mercadopago", { country: "XX" }, 200],
    ["mercadopago", {}, 200],
    ["creem", { country: "PE" }, 409],
    ["creem", { country: "DE" }, 200]
  ];
  for (const [provider, cf, status] of cases) {
    const h = await learner();
    const res = await checkout(h, { provider, plan: "pro_monthly", ...TERMS }, { cf });
    assert.equal(res.status, status, `${provider} ${JSON.stringify(cf)}`);
    if (status === 409) {
      assert.equal(res.body.reason, "rail_country_mismatch");
      assert.equal(h.fake.calls.length, 0);
    }
  }
});

test("rail/country: `force` overrides the check for an admin session only", async () => {
  const h = await learner(undefined, { email: "ana@example.test" });
  const res = await checkout(h, { provider: "creem", plan: "pro_monthly", force: true, ...TERMS }, { cf: { country: "PE" } });
  assert.deepEqual([res.status, res.body.reason], [409, "rail_country_mismatch"], "a learner's force is ignored");
  const admin = await learner(undefined, { email: "owner@gmail.com", method: "google" });
  const ok = await checkout(admin, { provider: "creem", plan: "pro_monthly", force: true, ...TERMS }, { cf: { country: "PE" } });
  assert.equal(ok.status, 200);
  assert.equal(await count(admin.env, "FROM audit_log WHERE action = 'checkout.rail_forced'"), 1);
});

test("already_subscribed: a renewing, a still-paid cancelled, a young pending or a young open checkout blocks a new one", async () => {
  const blocked = [
    async (h) => seedSub(h.env, h.who.account.id, { id: "sub_a", status: "active" }),
    async (h) => seedSub(h.env, h.who.account.id, { id: "sub_p", status: "past_due" }),
    async (h) => {
      await seedSub(h.env, h.who.account.id, { id: "sub_c", status: "canceled" });
      await sql(
        h.env,
        `INSERT INTO charges (id, provider, provider_charge_id, subscription_id, account_id, amount_minor, currency, status, approved_at, period_start, period_end, created_at, updated_at)
         VALUES ('c1', 'mercadopago', 'p1', 'sub_c', ?1, 1990, 'PEN', 'approved', ?2, ?2, ?3, ?2, ?2)`,
        h.who.account.id,
        NOW - 86400,
        NOW + 20 * 86400
      );
    },
    async (h) => seedSub(h.env, h.who.account.id, { id: "sub_n", status: "pending", createdAt: NOW - 1800 }),
    async (h) => sql(h.env, "INSERT INTO checkouts (id, account_id, provider, plan, amount_minor, currency, created_at, status) VALUES ('chk_x', ?1, 'creem', 'pro_monthly', 799, 'USD', ?2, 'open')", h.who.account.id, NOW - 600)
  ];
  for (const seed of blocked) {
    const h = await learner();
    await seed(h);
    const res = await checkout(h, { provider: "mercadopago", plan: "pro_monthly", ...TERMS });
    assert.deepEqual([res.status, res.body.reason], [409, "already_subscribed"]);
    assert.equal(h.fake.calls.length, 0);
  }
});

test("not blocked: an old pending, an old open checkout, or a cancelled subscription whose paid time is over", async () => {
  const h = await learner();
  await seedSub(h.env, h.who.account.id, { id: "sub_old", status: "pending", createdAt: NOW - 7200 });
  await seedSub(h.env, h.who.account.id, { id: "sub_done", status: "canceled" });
  await sql(h.env, "INSERT INTO checkouts (id, account_id, provider, plan, amount_minor, currency, created_at, status) VALUES ('chk_old', ?1, 'creem', 'pro_monthly', 799, 'USD', ?2, 'open')", h.who.account.id, NOW - 4000);
  const res = await checkout(h, { provider: "mercadopago", plan: "pro_monthly", ...TERMS });
  assert.equal(res.status, 200, JSON.stringify(res.body));
});

test("a provider failure answers 502 provider_unavailable, expires the checkout, stores no subscription and logs no secret", async () => {
  for (const how of [500, "throw"]) {
    const h = await learner();
    h.fake.fail("POST /preapproval", how);
    const lines = [];
    const res = await checkout(h, { provider: "mercadopago", plan: "pro_monthly", ...TERMS }, { log: (l) => lines.push(l) });
    assert.deepEqual([res.status, res.body.reason], [502, "provider_unavailable"]);
    assert.deepEqual(
      (await h.env.DB.prepare("SELECT status, provider_ref FROM checkouts").all()).results,
      [{ status: "expired", provider_ref: null }]
    );
    assert.equal(await count(h.env, "FROM subscriptions"), 0);
    const text = lines.join("\n");
    for (const secret of [MP_TOKEN, "ana@example.test"]) {
      assert.ok(!text.includes(secret), `log hides ${secret}`);
    }
    assert.ok(/mercadopago/.test(text), "the failure is logged by provider");
  }
});

test("a provider answer without a checkout URL is a failure too (fail closed)", async () => {
  const h = await learner();
  h.fake.fail("POST /v1/checkouts", 200);
  const res = await checkout(h, { provider: "creem", plan: "pro_monthly", ...TERMS }, { cf: { country: "US" } });
  assert.deepEqual([res.status, res.body.reason], [502, "provider_unavailable"]);
});

test("rate limit: 10 checkout attempts per account per hour, refusals included; the 11th is 429", async () => {
  const h = await learner();
  const statuses = [];
  for (let i = 0; i < 11; i += 1) {
    statuses.push((await checkout(h, { provider: "mercadopago", plan: "pro_monthly", ...TERMS })).status);
  }
  assert.deepEqual(statuses, [200, 409, 409, 409, 409, 409, 409, 409, 409, 409, 429]);
});

test("a session is required, and the route is CSRF-protected like every account route", async () => {
  const h = await learner();
  const anon = await call(h.env, "POST", "/api/v1/checkout", { body: { provider: "creem", plan: "pro_monthly", ...TERMS }, fake: h.fake });
  assert.equal(anon.status, 401);
  const forged = await call(h.env, "POST", "/api/v1/checkout", {
    body: { provider: "creem", plan: "pro_monthly", ...TERMS },
    cookie: h.who.token,
    fake: h.fake,
    webhook: true
  });
  assert.deepEqual([forged.status, forged.body.reason], [403, "bad_origin"]);
  assert.equal(h.fake.calls.length, 0);
});
