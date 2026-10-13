/**
 * Money and plans (DESIGN-v2 §5): provider decimals become integer minor
 * units or nothing; plan periods are calendar months in UTC; prices come
 * from the PRICE_* vars and must equal the static price module the site
 * shows (src/lib/cloud/offer.ts), read here and never edited.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { addMonths, decimalToMinor, integerMinor, minorToDecimal, planMonths, priceFor } from "../src/money.mjs";

const ROOT = new URL("../../../", import.meta.url);
const TOML = readFileSync(new URL("workers/billing/wrangler.toml", ROOT), "utf8");
const OFFER_TS = readFileSync(new URL("src/lib/cloud/offer.ts", ROOT), "utf8");

/**
 * A [vars] value from wrangler.toml.
 * @param {string} name Var name.
 * @returns {string|null} Value.
 */
function tomlVar(name) {
  const match = new RegExp(`^${name}\\s*=\\s*"([^"]*)"`, "m").exec(TOML);
  return match ? match[1] : null;
}

/**
 * One market's line of OFFER in offer.ts.
 * @param {string} market "pe" | "world".
 * @returns {{currency: string, monthly: number, yearly: number}} Offer.
 */
function offerOf(market) {
  const match = new RegExp(`\\b${market}:\\s*\\{\\s*currency:\\s*'([A-Z]{3})',\\s*monthly:\\s*(\\d+),\\s*yearly:\\s*(\\d+)\\s*\\}`).exec(OFFER_TS);
  assert.ok(match, `offer.ts has an OFFER.${market} line`);
  return { currency: match[1], monthly: Number(match[2]), yearly: Number(match[3]) };
}

test("provider decimals become integer minor units: 19.90, 119.90, 7.99, 49", () => {
  assert.equal(decimalToMinor(19.9), 1990);
  assert.equal(decimalToMinor("119.90"), 11990);
  assert.equal(decimalToMinor(7.99), 799);
  assert.equal(decimalToMinor(49), 4900);
  assert.equal(decimalToMinor(0.1 + 0.2), 30, "float noise rounds to the cent");
});

test("anything that is not a finite, non-negative amount is refused, never guessed", () => {
  for (const bad of [null, undefined, "", "abc", Number.NaN, Infinity, -1, "19,90", {}, [], true, 1e20]) {
    assert.equal(decimalToMinor(bad), null, String(bad));
  }
  assert.equal(integerMinor(799), 799);
  assert.equal(integerMinor("799"), null, "Creem sends numbers; a string is not trusted");
  assert.equal(integerMinor(7.99), null, "cents are integers");
  assert.equal(integerMinor(-5), null);
});

test("minor units go back to the decimal Mercado Pago expects", () => {
  assert.equal(minorToDecimal(1990), 19.9);
  assert.equal(minorToDecimal(11990), 119.9);
  assert.equal(minorToDecimal(799), 7.99);
});

test("plan periods are calendar months in UTC, clamped at month end", () => {
  const jan31 = Date.UTC(2027, 0, 31, 10, 0, 0) / 1000;
  assert.equal(addMonths(jan31, 1), Date.UTC(2027, 1, 28, 10, 0, 0) / 1000, "31 Jan + 1 month = 28 Feb");
  assert.equal(addMonths(Date.UTC(2028, 0, 31) / 1000, 1), Date.UTC(2028, 1, 29) / 1000, "leap year");
  assert.equal(addMonths(Date.UTC(2027, 2, 15, 8) / 1000, 12), Date.UTC(2028, 2, 15, 8) / 1000);
  assert.equal(planMonths("pro_monthly"), 1);
  assert.equal(planMonths("pro_yearly"), 12);
  assert.equal(planMonths("pro_weekly"), null);
});

test("prices come from the PRICE_* vars per rail; a missing or junk price is not configured", () => {
  const env = { PRICE_PE_MONTHLY_MINOR: "1990", PRICE_PE_YEARLY_MINOR: "11990", PRICE_US_MONTHLY_MINOR: "799", PRICE_US_YEARLY_MINOR: "4900" };
  assert.deepEqual(priceFor(env, "mercadopago", "pro_monthly"), { amountMinor: 1990, currency: "PEN" });
  assert.deepEqual(priceFor(env, "mercadopago", "pro_yearly"), { amountMinor: 11990, currency: "PEN" });
  assert.deepEqual(priceFor(env, "creem", "pro_monthly"), { amountMinor: 799, currency: "USD" });
  assert.deepEqual(priceFor(env, "creem", "pro_yearly"), { amountMinor: 4900, currency: "USD" });
  assert.equal(priceFor({ ...env, PRICE_US_YEARLY_MINOR: "49.00" }, "creem", "pro_yearly"), null);
  assert.equal(priceFor({ ...env, PRICE_PE_MONTHLY_MINOR: "0" }, "mercadopago", "pro_monthly"), null);
  assert.equal(priceFor({}, "creem", "pro_monthly"), null);
  assert.equal(priceFor(env, "stripe", "pro_monthly"), null);
  assert.equal(priceFor(env, "creem", "pro_weekly"), null);
});

test("price parity: wrangler.toml PRICE_* equal src/lib/cloud/offer.ts, market by market", () => {
  const pe = offerOf("pe");
  const world = offerOf("world");
  assert.deepEqual([pe.currency, world.currency], ["PEN", "USD"]);
  const toml = {
    PRICE_PE_MONTHLY_MINOR: pe.monthly,
    PRICE_PE_YEARLY_MINOR: pe.yearly,
    PRICE_US_MONTHLY_MINOR: world.monthly,
    PRICE_US_YEARLY_MINOR: world.yearly
  };
  for (const [name, expected] of Object.entries(toml)) {
    assert.equal(Number(tomlVar(name)), expected, `${name} equals offer.ts`);
  }
  const env = Object.fromEntries(Object.keys(toml).map((name) => [name, tomlVar(name)]));
  assert.equal(priceFor(env, "mercadopago", "pro_monthly").amountMinor, pe.monthly);
  assert.equal(priceFor(env, "creem", "pro_yearly").amountMinor, world.yearly);
});
