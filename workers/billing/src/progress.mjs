/**
 * Progress sync storage (DESIGN-v2 §4):
 *
 *   GET /v1/me/progress              -> {ok, rev, doc|null, updatedAt|null}
 *   PUT /v1/me/progress {doc, baseRev} -> {ok, rev, updatedAt}
 *                                       | 409 {reason: conflict, server: {rev, doc, updatedAt}}
 *
 * The document is the client's opaque JSON object (at most 256 KiB, measured
 * as the UTF-8 bytes of its compact serialization); merging is the client's
 * job. Conflicts are decided by revision, never by clock: the write itself is
 * the compare-and-swap (`INSERT ... ON CONFLICT DO NOTHING` for baseRev 0,
 * `UPDATE ... WHERE rev = baseRev` otherwise), so two requests that raced
 * cannot both win, and a concurrent first insert is a 409 with the winner's
 * copy instead of a primary-key 500 (the reference worker read first, then
 * inserted). Writes are limited to 600 per hour per account; reads are not.
 */

import { hitRateLimit } from "./ratelimit.mjs";

/** Largest stored document, in bytes. */
export const PROGRESS_MAX_BYTES = 256 * 1024;

/** Route body cap: the document plus its envelope. */
export const PROGRESS_BODY_CAP = PROGRESS_MAX_BYTES + 8 * 1024;

/** Writes allowed per account per hour. */
export const PROGRESS_WRITES_PER_HOUR = 600;

/**
 * The stored progress, or the empty state.
 * @param {Object} db D1 binding.
 * @param {string} accountId Account id.
 * @returns {Promise<{rev: number, doc: Object|null, updatedAt: number|null}>} Stored copy.
 */
async function readProgress(db, accountId) {
  const row = await db.prepare("SELECT rev, doc, updated_at FROM progress WHERE account_id = ?1").bind(accountId).first();
  if (!row) {
    return { rev: 0, doc: null, updatedAt: null };
  }
  let doc = null;
  try {
    doc = JSON.parse(row.doc);
  } catch {
    doc = null;
  }
  return { rev: Number(row.rev), doc, updatedAt: Number(row.updated_at) };
}

/**
 * GET /v1/me/progress.
 * @param {Object} ctx Context with a session.
 * @returns {Promise<Object>} Result.
 */
export async function handleGetProgress(ctx) {
  return { status: 200, body: { ok: true, ...(await readProgress(ctx.db, ctx.account.id)) } };
}

/**
 * Validate the PUT body.
 * @param {Object} body Request body.
 * @returns {{text: string, size: number, baseRev: number}|{stop: Object}} Parsed or stop.
 */
function parsePut(body) {
  const doc = body.doc;
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) {
    return { stop: { status: 400, body: { ok: false, reason: "bad_doc" } } };
  }
  if (!Number.isInteger(body.baseRev) || body.baseRev < 0) {
    return { stop: { status: 400, body: { ok: false, reason: "bad_base_rev" } } };
  }
  const text = JSON.stringify(doc);
  const size = new TextEncoder().encode(text).byteLength;
  if (size > PROGRESS_MAX_BYTES) {
    return { stop: { status: 413, body: { ok: false, reason: "doc_too_large", maxBytes: PROGRESS_MAX_BYTES } } };
  }
  return { text, size, baseRev: body.baseRev };
}

/**
 * The compare-and-swap write.
 * @param {Object} ctx Context.
 * @param {{text: string, size: number, baseRev: number}} put Parsed body.
 * @returns {Promise<boolean>} Whether this write won.
 */
async function casWrite(ctx, put) {
  const accountId = ctx.account.id;
  const statement =
    put.baseRev === 0
      ? ctx.db
          .prepare(
            `INSERT INTO progress (account_id, rev, doc, size_bytes, updated_at) VALUES (?1, 1, ?2, ?3, ?4)
             ON CONFLICT (account_id) DO NOTHING`
          )
          .bind(accountId, put.text, put.size, ctx.now)
      : ctx.db
          .prepare("UPDATE progress SET rev = rev + 1, doc = ?2, size_bytes = ?3, updated_at = ?4 WHERE account_id = ?1 AND rev = ?5")
          .bind(accountId, put.text, put.size, ctx.now, put.baseRev);
  const result = await statement.run();
  return result.meta.changes === 1;
}

/**
 * PUT /v1/me/progress.
 * @param {Object} ctx Context with a session.
 * @returns {Promise<Object>} Result.
 */
export async function handlePutProgress(ctx) {
  const hit = await hitRateLimit(ctx, `progress:${ctx.account.id}`, PROGRESS_WRITES_PER_HOUR, 3600);
  if (!hit.ok) {
    return { status: 429, body: { ok: false, reason: "rate_limited", retryAfter: hit.retryAfter }, headers: { "retry-after": String(hit.retryAfter) } };
  }
  const put = parsePut(ctx.body);
  if (put.stop) {
    return put.stop;
  }
  if (await casWrite(ctx, put)) {
    return { status: 200, body: { ok: true, rev: put.baseRev + 1, updatedAt: ctx.now } };
  }
  return { status: 409, body: { ok: false, reason: "conflict", server: await readProgress(ctx.db, ctx.account.id) } };
}
