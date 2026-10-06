/**
 * Money and plans (DESIGN-v2 §5).
 *
 * - Money is INTEGER minor units everywhere in the worker and in D1.
 *   Mercado Pago speaks decimals (19.9); they are converted with
 *   Math.round(x * 100) and refused unless the result is a safe integer.
 *   Creem speaks integer cents already, and anything else is refused.
 * - Plans: pro_monthly (1 calendar month) and pro_yearly (12). A period is
 *   computed in UTC calendar months, clamped at month end (31 Jan + 1 month
 *   = 28/29 Feb), never as a fixed number of days.
 * - Prices come from the PRICE_* vars, one pair per rail: Mercado Pago bills
 *   PEN (PRICE_PE_*), Creem bills USD (PRICE_US_*). A missing or junk var is
 *   "not configured", never a default: the worker must not charge a price
 *   the site does not show (tests/money.test.mjs checks offer.ts parity).
 */

/** Plan -> calendar months per period. */
export const PLAN_MONTHS = Object.freeze({ pro_monthly: 1, pro_yearly: 12 });

/** Rail -> the currency it bills and its PRICE_* market prefix. */
export const RAILS = Object.freeze({
  mercadopago: Object.freeze({ currency: "PEN", market: "PE" }),
  creem: Object.freeze({ currency: "USD", market: "US" })
});

const MAX_MINOR = 1e11;

/**
 * A provider decimal amount as integer minor units, or null.
 * @param {unknown} value Number or numeric string (e.g. 19.9, "119.90").
 * @returns {number|null} Minor units.
 */
export function decimalToMinor(value) {
  if (typeof value !== "number" && typeof value !== "string") {
    return null;
  }
  const text = String(value).trim();
  if (!/^\d+(\.\d+)?(e[+-]?\d+)?$/i.test(text)) {
    return null;
  }
  const minor = Math.round(Number(text) * 100);
  return Number.isSafeInteger(minor) && minor >= 0 && minor < MAX_MINOR ? minor : null;
}

/**
 * An amount that is already integer minor units (Creem), or null.
 * @param {unknown} value Number.
 * @returns {number|null} Minor units.
 */
export function integerMinor(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value < MAX_MINOR ? value : null;
}

/**
 * Minor units as the decimal Mercado Pago expects (1990 -> 19.9).
 * @param {number} minor Minor units.
 * @returns {number} Decimal.
 */
export function minorToDecimal(minor) {
  return Number((minor / 100).toFixed(2));
}

/**
 * Months per period of a plan, or null for an unknown plan.
 * @param {string} plan Plan id.
 * @returns {number|null} Months.
 */
export function planMonths(plan) {
  return Object.prototype.hasOwnProperty.call(PLAN_MONTHS, plan) ? PLAN_MONTHS[plan] : null;
}

/**
 * Add calendar months in UTC, clamping the day to the target month's end.
 * @param {number} epochSeconds Start.
 * @param {number} months Months to add.
 * @returns {number} Epoch seconds.
 */
export function addMonths(epochSeconds, months) {
  const date = new Date(epochSeconds * 1000);
  const day = date.getUTCDate();
  const target = new Date(date.getTime());
  target.setUTCDate(1);
  target.setUTCMonth(target.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return Math.floor(target.getTime() / 1000);
}

/**
 * The price a rail charges for a plan, from the PRICE_* vars.
 * @param {Object} env Worker env.
 * @param {string} provider "mercadopago" | "creem".
 * @param {string} plan Plan id.
 * @returns {{amountMinor: number, currency: string}|null} Price, or null when not configured.
 */
export function priceFor(env, provider, plan) {
  const rail = Object.prototype.hasOwnProperty.call(RAILS, provider) ? RAILS[provider] : null;
  if (!rail || planMonths(plan) === null) {
    return null;
  }
  const cadence = plan === "pro_yearly" ? "YEARLY" : "MONTHLY";
  const raw = env ? env[`PRICE_${rail.market}_${cadence}_MINOR`] : undefined;
  const text = typeof raw === "number" ? String(raw) : String(raw || "").trim();
  const amountMinor = /^[1-9]\d{0,10}$/.test(text) ? Number(text) : null;
  return amountMinor === null ? null : { amountMinor, currency: rail.currency };
}
