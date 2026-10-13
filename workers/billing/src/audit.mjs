/**
 * Append-only audit log. `detail` is JSON with ids and reason codes only:
 * never an email, a token, a code or a raw body.
 */

/**
 * Write one audit row.
 * @param {{db: Object, now: number}} ctx Context.
 * @param {{action: string, actorAccountId?: string|null, targetAccountId?: string|null,
 *          targetId?: string|null, detail?: Object}} entry Entry.
 * @returns {Promise<void>} Resolves when written.
 */
export async function writeAudit(ctx, entry) {
  await auditStatement(ctx, entry).run();
}

/**
 * The audit insert as a prepared statement, so a handler can put it in the
 * same db.batch as the change it records (both land, or neither does).
 * @param {{db: Object, now: number}} ctx Context.
 * @param {Object} entry See writeAudit.
 * @returns {Object} Prepared, bound statement.
 */
export function auditStatement(ctx, entry) {
  return ctx.db
    .prepare(
      `INSERT INTO audit_log (actor_account_id, action, target_account_id, target_id, detail, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)`
    )
    .bind(
      entry.actorAccountId || null,
      entry.action,
      entry.targetAccountId || null,
      entry.targetId || null,
      entry.detail ? JSON.stringify(entry.detail) : null,
      ctx.now
    );
}
