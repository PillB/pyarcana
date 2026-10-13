/**
 * Ads per account (owner decision 2026-10-01).
 *
 *   ads are ON by default for every account, gift and tester holders and admins included;
 *   paid subscribers and running trials see none (Pro's ad-free benefit, previewed by the trial);
 *   an admin switches ads off, or back to that default, for one account or a batch.
 *
 *   me payload                  ads: {show, reason: "default"|"paid"|"trial"|"disabled"}
 *   POST /v1/admin/ads          {accountIds: string[1..100], adsDisabled: boolean, reason}
 *   GET  /v1/admin/ads          ?filter=all|disabled|gift|tester|free|paid|trial&limit=1..100&cursor=
 *
 * The switch is stored on the account (`ads_disabled`, migration 7), so it outlives a grant or a
 * subscription: an account switched off stays ad-free after its gift ends. The batch writes every
 * change in one db.batch; the request's single audit row lists the changed account ids and the
 * admin's reason with email-shaped text redacted (the gate writes it). Ids, not addresses, select
 * the accounts, because the admin list already shows them and a Microsoft-only account has no
 * proven address.
 */

import { auditableReason } from "./admin-accounts.mjs";
import { accessSnapshot } from "./entitlement.mjs";
import { badRequest, enumValue, INVALID, limitValue, parseFields, requiredText } from "./input.mjs";

const MAX_BATCH = 100;
const FILTERS = ["all", "disabled", "gift", "tester", "free", "paid", "trial"];
/** Accounts read per list request at most, so a sparse filter cannot run a request unbounded. */
const SCAN_CAP = 500;
const ID_RE = /^[A-Za-z0-9_-]{1,100}$/;

/**
 * Whether an account sees ads, and why.
 * @param {{isPro: boolean, source: string|null}} access Resolved access.
 * @param {Object} account Account row.
 * @returns {{show: boolean, reason: string}} Policy.
 */
export function adsPolicy(access, account) {
  if (Number(account.ads_disabled) === 1) {
    return { show: false, reason: "disabled" };
  }
  if (access.isPro && (access.source === "paid" || access.source === "trial")) {
    return { show: false, reason: access.source };
  }
  return { show: true, reason: "default" };
}

/**
 * accountIds: 1..100 strings; duplicates are folded.
 * @param {Object} body Request body.
 * @returns {string[]|symbol} Ids or INVALID.
 */
function accountIdsValue(body) {
  const ids = body.accountIds;
  if (!Array.isArray(ids) || ids.length < 1 || ids.length > MAX_BATCH || !ids.every((id) => typeof id === "string" && ID_RE.test(id))) {
    return INVALID;
  }
  return [...new Set(ids)];
}

const SET_FIELDS = [
  ["accountIds", accountIdsValue, "bad_account_ids"],
  ["adsDisabled", (b) => (typeof b.adsDisabled === "boolean" ? b.adsDisabled : INVALID), "bad_ads_disabled"],
  ["reason", (b) => requiredText(b.reason, 200), "reason_required"]
];

/**
 * POST /v1/admin/ads.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleSetAds(ctx) {
  const parsed = parseFields(ctx.body, SET_FIELDS);
  if (parsed.error) {
    return parsed.error;
  }
  const { accountIds, adsDisabled, reason } = parsed.values;
  const flag = adsDisabled ? 1 : 0;
  const live = await ctx.db
    .prepare(`SELECT id FROM accounts WHERE deleted_at IS NULL AND id IN (SELECT value FROM json_each(?1))`)
    .bind(JSON.stringify(accountIds))
    .all();
  const found = new Set(live.results.map((r) => r.id));
  const targets = accountIds.filter((id) => found.has(id));
  const results = targets.length
    ? await ctx.db.batch(
        targets.map((id) =>
          ctx.db.prepare("UPDATE accounts SET ads_disabled = ?2, updated_at = ?3 WHERE id = ?1 AND ads_disabled <> ?2").bind(id, flag, ctx.now)
        )
      )
    : [];
  const updated = targets.map((id, i) => ({ accountId: id, adsDisabled, changed: results[i].meta.changes === 1 }));
  const changedIds = updated.filter((u) => u.changed).map((u) => u.accountId);
  const notFound = accountIds.filter((id) => !found.has(id));
  return {
    status: 200,
    body: { ok: true, updated, notFound },
    audit: { detail: { adsDisabled, changed: changedIds.length, notFound: notFound.length, accountIds: changedIds, adminReason: auditableReason(reason) } }
  };
}

/**
 * Parse `cursor` ("<created_at>.<id>").
 * @param {string|null} raw Raw cursor.
 * @returns {{at: number, id: string}|null|symbol} Cursor, null, or INVALID.
 */
function cursorValue(raw) {
  if (raw === null || raw === "") {
    return null;
  }
  const match = /^(\d{1,12})\.([A-Za-z0-9_-]{1,100})$/.exec(raw);
  return match ? { at: Number(match[1]), id: match[2] } : INVALID;
}

/**
 * Whether a listed account matches the filter.
 * @param {string} filter Filter.
 * @param {Object} row Listed row.
 * @returns {boolean} Match.
 */
function matches(filter, row) {
  if (filter === "all" || filter === "disabled") {
    return true;
  }
  return filter === "free" ? row.source === null : row.source === filter;
}

/**
 * One listed account.
 * @param {Object} ctx Context.
 * @param {Object} account Account row.
 * @returns {Promise<Object>} Row.
 */
async function listRow(ctx, account) {
  const { access } = await accessSnapshot(ctx, account);
  const policy = adsPolicy(access, account);
  return {
    accountId: account.id,
    email: account.email || null,
    displayName: account.display_name || null,
    source: access.isPro ? access.source : null,
    adsDisabled: Number(account.ads_disabled) === 1,
    showsAds: policy.show,
    reason: policy.reason
  };
}

/**
 * GET /v1/admin/ads.
 * @param {Object} ctx Admin context.
 * @returns {Promise<Object>} Result.
 */
export async function handleListAds(ctx) {
  const filter = enumValue(ctx.url.searchParams.get("filter"), FILTERS, "all");
  if (filter === INVALID) {
    return badRequest("bad_filter");
  }
  const limit = limitValue(ctx.url, 50, MAX_BATCH);
  const cursor = cursorValue(ctx.url.searchParams.get("cursor"));
  if (limit === INVALID || cursor === INVALID) {
    return badRequest(limit === INVALID ? "bad_limit" : "bad_cursor");
  }
  const after = cursor || { at: -1, id: "" };
  const onlyDisabled = filter === "disabled" ? "AND ads_disabled = 1" : "";
  const page = await ctx.db
    .prepare(
      `SELECT * FROM accounts WHERE deleted_at IS NULL ${onlyDisabled}
         AND (created_at > ?1 OR (created_at = ?1 AND id > ?2))
       ORDER BY created_at, id LIMIT ?3`
    )
    .bind(after.at, after.id, SCAN_CAP)
    .all();
  const accounts = [];
  let last = null;
  for (const account of page.results) {
    last = account;
    const row = await listRow(ctx, account);
    if (matches(filter, row)) {
      accounts.push(row);
    }
    if (accounts.length === limit) {
      break;
    }
  }
  // More may follow when the loop stopped before the page's end, or the page hit the scan cap.
  const more = last !== null && (last !== page.results[page.results.length - 1] || page.results.length === SCAN_CAP);
  return { status: 200, body: { ok: true, filter, accounts, nextCursor: more ? `${Number(last.created_at)}.${last.id}` : null } };
}
