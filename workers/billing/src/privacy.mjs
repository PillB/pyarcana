/**
 * Data-subject rights (DESIGN-v2 §4; Ley 29733): GET /v1/me/export and
 * DELETE /v1/me {confirm: "DELETE"}.
 *
 * Both need recent authentication: a session created in the last 10 minutes
 * (otherwise 401 reauth_required), because a stolen session must not be able
 * to download or erase an account.
 *
 * Export: the account, identities (provider + masked subject), sessions
 * (without their hashes), roles, grants (with the admin's note: it is data
 * about the person), subscriptions, charges, checkouts, progress, the
 * person's reports with attachment metadata, the audit rows about them
 * (actor shown as self / admin / system), and (stage 2c) their consent
 * records, survey answers and measurement rows: answers and events sent under
 * a measurement id bound to the account count as theirs. Never token_hash,
 * code_hmac, email_hmac, cid_hash, trial-claim keys or rate-limit buckets.
 *
 * Delete:
 *  1. every pending / active / past_due subscription is cancelled through the
 *     provider registry (providers.mjs: Mercado Pago PUT cancelled, Creem
 *     mode "immediate", each confirmed by a re-read), and each confirmed
 *     cancel is stored at once; any failure, or a rail that is not
 *     configured, answers 502 cancel_failed and NOTHING is deleted;
 *  2. then ONE batch: open checkouts expire; identities, sessions, progress,
 *     login codes and roles are deleted; the person's report screenshots are
 *     deleted and their reports anonymized; grant notes are cleared; the
 *     measurement rows of the account and of every id bound to it (events,
 *     arms, bindings), its survey answers (signed-in or under a bound id)
 *     and its consent records are deleted;
 *     account is tombstoned (deleted_at, email/display name/locale NULL,
 *     email_hmac = HMAC(pepper, "tombstone:" + email)); an audit row.
 *  Subscriptions, charges and grants stay as billing records, with no email.
 *  trial_claims stay (anti-abuse; the privacy page says so).
 */

import { maskSubject } from "./accounts.mjs";
import { auditStatement, writeAudit } from "./audit.mjs";
import { hmacHex } from "./crypto.mjs";
import { accessSnapshot, publicGrant } from "./entitlement.mjs";
import { clearSessionCookie } from "./http.mjs";
import { publicSubscriptions } from "./me.mjs";
import { hitRateLimit } from "./ratelimit.mjs";
import { isRecentAuth } from "./sessions.mjs";
import { sessionView } from "./qa-sessions.mjs";

const NON_TERMINAL = ["pending", "active", "past_due"];

/** The measurement ids bound to the account ?1. */
const BOUND_IDS = "(SELECT cid_hash FROM experiment_bindings WHERE account_id = ?1)";

/** Exports allowed per account per hour. */
export const EXPORTS_PER_HOUR = 10;

/**
 * 401 unless the session is recent.
 * @param {Object} ctx Context with a session.
 * @returns {Object|null} Stop result or null.
 */
function requireRecentAuth(ctx) {
  return isRecentAuth(ctx.session, ctx.now) ? null : { status: 401, body: { ok: false, reason: "reauth_required" } };
}

/**
 * Every personal row, read in one batch.
 * @param {Object} ctx Context.
 * @param {string} id Account id.
 * @returns {Promise<Object>} Rows by name.
 */
async function personalRows(ctx, id) {
  const statements = {
    identities: "SELECT provider, subject, email_at_link, created_at FROM identities WHERE account_id = ?1 ORDER BY created_at",
    sessions: "SELECT id, method, created_at, renewed_at, expires_at, revoked_at FROM sessions WHERE account_id = ?1 ORDER BY created_at",
    roles: "SELECT role, created_at, expires_at, revoked_at FROM account_roles WHERE account_id = ?1 ORDER BY created_at",
    grantNotes: "SELECT id, note, revoked_at FROM grants WHERE account_id = ?1",
    checkouts: "SELECT id, provider, plan, amount_minor, currency, country, created_at, status FROM checkouts WHERE account_id = ?1",
    progress: "SELECT rev, doc, updated_at FROM progress WHERE account_id = ?1",
    reports: "SELECT * FROM reports WHERE account_id = ?1 ORDER BY created_at",
    attachments:
      "SELECT id, report_id, mime, length(bytes) AS size, created_at FROM report_attachments WHERE report_id IN (SELECT id FROM reports WHERE account_id = ?1)",
    audit: "SELECT actor_account_id, action, target_id, detail, created_at FROM audit_log WHERE target_account_id = ?1 ORDER BY id",
    consents: "SELECT kind, value, version, client_at, created_at FROM consents WHERE account_id = ?1 ORDER BY id",
    qaSessions: "SELECT * FROM qa_sessions WHERE account_id = ?1 ORDER BY started_at",
    surveys: `SELECT kind, score, reason_code, text, section_idx, created_at FROM survey_responses
      WHERE account_id = ?1 OR cid_hash IN ${BOUND_IDS} ORDER BY created_at, id`,
    arms: "SELECT experiment, arm, first_at FROM experiment_arms WHERE subject = ?1 AND subject_kind = 'account' ORDER BY experiment",
    events: `SELECT name, experiment, arm, surface, section_idx, day, received_at FROM events WHERE cid_hash IN ${BOUND_IDS} ORDER BY id`,
    devices: "SELECT COUNT(*) AS n FROM experiment_bindings WHERE account_id = ?1"
  };
  const names = Object.keys(statements);
  const results = await ctx.db.batch(names.map((name) => ctx.db.prepare(statements[name]).bind(id)));
  return Object.fromEntries(names.map((name, i) => [name, results[i].results]));
}

/**
 * Who did an audited action, as the person should see it.
 * @param {string|null} actor Actor account id.
 * @param {string} self The person's account id.
 * @returns {"self"|"admin"|"system"} Actor kind.
 */
function actorKind(actor, self) {
  if (!actor) {
    return "system";
  }
  return actor === self ? "self" : "admin";
}

/**
 * The export's account section.
 * @param {Object} a Account row.
 * @returns {Object} Account.
 */
function exportAccount(a) {
  return {
    id: a.id,
    email: a.email,
    emailVerified: Number(a.email_verified) === 1,
    displayName: a.display_name,
    locale: a.locale,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
    firstSigninAt: a.first_signin_at,
    termsVersion: a.terms_version,
    ageConfirmedAt: a.age_confirmed_at,
    trialUsedAt: a.trial_used_at,
    disabledAt: a.disabled_at
  };
}

/**
 * The person's reports with their attachment metadata.
 * @param {Object[]} reports Report rows.
 * @param {Object[]} attachments Attachment metadata rows.
 * @returns {Object[]} Reports.
 */
function exportReports(reports, attachments) {
  return reports.map((r) => ({
    id: r.id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    source: r.source,
    category: r.category,
    cause: r.cause,
    severity: r.severity,
    status: r.status,
    title: r.title,
    description: r.description,
    steps: r.steps,
    expected: r.expected,
    actual: r.actual,
    improvement: r.improvement,
    reporterAlias: r.reporter_alias,
    context: r.context ? JSON.parse(r.context) : {},
    attachments: attachments.filter((a) => a.report_id === r.id).map((a) => ({ id: a.id, mime: a.mime, size: a.size, createdAt: a.created_at }))
  }));
}

/**
 * Billing sections of the export.
 * @param {Object} rows Access rows.
 * @returns {{subscriptions: Object[], charges: Object[]}} Billing.
 */
function exportBilling(rows) {
  const extra = new Map(rows.subscriptions.map((s) => [s.id, s]));
  return {
    subscriptions: publicSubscriptions(rows).map((s) => ({
      ...s,
      providerRef: extra.get(s.id).provider_ref,
      createdAt: extra.get(s.id).created_at,
      firstActiveAt: extra.get(s.id).first_active_at
    })),
    charges: rows.charges.map((c) => ({
      id: c.id,
      provider: c.provider,
      subscriptionId: c.subscription_id,
      amountMinor: Number(c.amount_minor),
      currency: c.currency,
      status: c.status,
      approvedAt: c.approved_at,
      periodStart: c.period_start,
      periodEnd: c.period_end,
      refundedAt: c.refunded_at,
      chargedBackAt: c.charged_back_at
    }))
  };
}

/**
 * The export's consent, survey and measurement sections.
 * @param {Object} p personalRows output.
 * @returns {{consents: Object[], surveys: Object[], measurement: Object}} Sections.
 */
function exportMeasurement(p) {
  return {
    consents: p.consents.map((c) => ({ kind: c.kind, value: c.value, version: c.version, at: c.client_at, createdAt: c.created_at })),
    surveys: p.surveys.map((s) => ({ kind: s.kind, score: s.score, reasonCode: s.reason_code, text: s.text, sectionIndex: s.section_idx, createdAt: s.created_at })),
    measurement: {
      devices: Number(p.devices[0].n),
      arms: p.arms.map((a) => ({ experiment: a.experiment, arm: a.arm, firstAt: a.first_at })),
      events: p.events.map((e) => ({ name: e.name, experiment: e.experiment, arm: e.arm, surface: e.surface, sectionIndex: e.section_idx, day: e.day, receivedAt: e.received_at }))
    }
  };
}

/**
 * Assemble the export document.
 * @param {Object} ctx Context.
 * @param {Object} snapshot accessSnapshot.
 * @param {Object} p personalRows output.
 * @returns {Object} Export.
 */
function buildExport(ctx, snapshot, p) {
  const id = ctx.account.id;
  const notes = new Map(p.grantNotes.map((g) => [g.id, g]));
  const progress = p.progress[0];
  return {
    ok: true,
    exportedAt: ctx.now,
    account: exportAccount(ctx.account),
    identities: p.identities.map((i) => ({ provider: i.provider, subject: maskSubject(i.subject), emailAtLink: i.email_at_link, createdAt: i.created_at })),
    sessions: p.sessions.map((s) => ({ method: s.method, createdAt: s.created_at, renewedAt: s.renewed_at, expiresAt: s.expires_at, revokedAt: s.revoked_at, current: s.id === ctx.session.id })),
    roles: p.roles.map((r) => ({ role: r.role, createdAt: r.created_at, expiresAt: r.expires_at, revokedAt: r.revoked_at })),
    access: snapshot.access,
    grants: snapshot.schedule.map((g) => ({ ...publicGrant(g), note: notes.get(g.id).note, revokedAt: notes.get(g.id).revoked_at })),
    ...exportBilling(snapshot.rows),
    checkouts: p.checkouts.map((c) => ({ id: c.id, provider: c.provider, plan: c.plan, amountMinor: Number(c.amount_minor), currency: c.currency, country: c.country, createdAt: c.created_at, status: c.status })),
    progress: progress ? { rev: progress.rev, doc: JSON.parse(progress.doc), updatedAt: progress.updated_at } : null,
    reports: exportReports(p.reports, p.attachments),
    qaSessions: p.qaSessions.map(sessionView),
    audit: p.audit.map((a) => ({ action: a.action, actor: actorKind(a.actor_account_id, id), targetId: a.target_id, detail: a.detail ? JSON.parse(a.detail) : null, createdAt: a.created_at })),
    ...exportMeasurement(p)
  };
}

/**
 * GET /v1/me/export.
 * @param {Object} ctx Context with a session.
 * @returns {Promise<Object>} Result.
 */
export async function handleExport(ctx) {
  const stale = requireRecentAuth(ctx);
  if (stale) {
    return stale;
  }
  const hit = await hitRateLimit(ctx, `export:${ctx.account.id}`, EXPORTS_PER_HOUR, 3600);
  if (!hit.ok) {
    return { status: 429, body: { ok: false, reason: "rate_limited", retryAfter: hit.retryAfter } };
  }
  const snapshot = await accessSnapshot(ctx, ctx.account);
  const rows = await personalRows(ctx, ctx.account.id);
  return { status: 200, body: buildExport(ctx, snapshot, rows) };
}

/**
 * Ask one provider to cancel one subscription; a throw counts as a failure.
 * @param {Object} ctx Context (with `providers`).
 * @param {Object} sub Subscription row.
 * @returns {Promise<{ok: boolean, status?: string}>} Outcome.
 */
async function cancelAtProvider(ctx, sub) {
  const adapter = ctx.providers[sub.provider];
  if (!adapter || typeof adapter.cancel !== "function") {
    return { ok: false };
  }
  try {
    const result = await adapter.cancel(ctx, sub);
    return result && result.ok ? { ok: true, status: result.status || "canceled" } : { ok: false };
  } catch {
    return { ok: false };
  }
}

/**
 * Store a confirmed cancel and its event, together.
 * @param {Object} ctx Context.
 * @param {Object} sub Subscription row.
 * @param {string} status Confirmed status.
 * @returns {Promise<void>} Resolves when stored.
 */
async function recordCancel(ctx, sub, status) {
  await ctx.db.batch([
    ctx.db.prepare("UPDATE subscriptions SET status = ?2, cancel_at_period_end = 1, updated_at = ?3 WHERE id = ?1").bind(sub.id, status, ctx.now),
    ctx.db
      .prepare("INSERT INTO subscription_events (subscription_id, account_id, provider, kind, detail, created_at) VALUES (?1, ?2, ?3, 'cancel.account_deletion', ?4, ?5)")
      .bind(sub.id, sub.account_id, sub.provider, JSON.stringify({ status }), ctx.now)
  ]);
}

/**
 * Cancel every non-terminal subscription, stopping at the first failure.
 * @param {Object} ctx Context.
 * @returns {Promise<{ok: true, cancelled: number}|{ok: false, subscription: Object}>} Outcome.
 */
async function cancelLiveSubscriptions(ctx) {
  const placeholders = NON_TERMINAL.map((_, i) => `?${i + 2}`).join(", ");
  const live = await ctx.db
    .prepare(`SELECT * FROM subscriptions WHERE account_id = ?1 AND status IN (${placeholders}) ORDER BY created_at`)
    .bind(ctx.account.id, ...NON_TERMINAL)
    .all();
  let cancelled = 0;
  for (const sub of live.results) {
    const outcome = await cancelAtProvider(ctx, sub);
    if (!outcome.ok) {
      return { ok: false, subscription: sub };
    }
    await recordCancel(ctx, sub, outcome.status);
    cancelled += 1;
  }
  return { ok: true, cancelled };
}

/**
 * The erasure batch.
 * @param {Object} ctx Context.
 * @param {string|null} emailHmac Tombstone HMAC.
 * @param {number} cancelled Subscriptions cancelled first.
 * @returns {Object[]} Statements.
 */
function erasureBatch(ctx, emailHmac, cancelled) {
  const db = ctx.db;
  const id = ctx.account.id;
  const own = "(SELECT id FROM reports WHERE account_id = ?1)";
  return [
    db.prepare("UPDATE checkouts SET status = 'expired' WHERE account_id = ?1 AND status = 'open'").bind(id),
    db.prepare("DELETE FROM identities WHERE account_id = ?1").bind(id),
    db.prepare("DELETE FROM sessions WHERE account_id = ?1").bind(id),
    db.prepare("DELETE FROM progress WHERE account_id = ?1").bind(id),
    db.prepare("DELETE FROM account_roles WHERE account_id = ?1").bind(id),
    db.prepare("DELETE FROM login_codes WHERE email_normalized = ?1").bind(ctx.account.email_normalized || ""),
    db.prepare(`DELETE FROM report_attachments WHERE report_id IN ${own}`).bind(id),
    db.prepare("UPDATE reports SET account_id = NULL, reporter_alias = NULL, contact_email = NULL, client_issue_id = NULL WHERE account_id = ?1").bind(id),
    db.prepare("UPDATE grants SET note = NULL WHERE account_id = ?1").bind(id),
    // Measurement and surveys: rows under the bound ids first, then the bindings.
    db.prepare(`DELETE FROM events WHERE cid_hash IN ${BOUND_IDS}`).bind(id),
    db.prepare(`DELETE FROM survey_responses WHERE account_id = ?1 OR cid_hash IN ${BOUND_IDS}`).bind(id),
    db.prepare(`DELETE FROM experiment_arms WHERE subject = ?1 OR subject IN ${BOUND_IDS}`).bind(id),
    db.prepare("DELETE FROM experiment_bindings WHERE account_id = ?1").bind(id),
    db.prepare("DELETE FROM consents WHERE account_id = ?1").bind(id),
    db.prepare("DELETE FROM qa_sessions WHERE account_id = ?1").bind(id),
    db
      .prepare(
        `UPDATE accounts SET deleted_at = ?2, email = NULL, email_normalized = NULL, display_name = NULL, locale = NULL,
           email_hmac = ?3, updated_at = ?2 WHERE id = ?1`
      )
      .bind(id, ctx.now, emailHmac),
    auditStatement(ctx, { action: "account.delete", actorAccountId: id, targetAccountId: id, detail: { subscriptionsCancelled: cancelled } })
  ];
}

/**
 * DELETE /v1/me {confirm: "DELETE"}.
 * @param {Object} ctx Context with a session (db + pepper configured).
 * @returns {Promise<Object>} Result.
 */
export async function handleDeleteAccount(ctx) {
  const stale = requireRecentAuth(ctx);
  if (stale) {
    return stale;
  }
  if (ctx.body.confirm !== "DELETE") {
    return { status: 400, body: { ok: false, reason: "confirm_required" } };
  }
  const cancel = await cancelLiveSubscriptions(ctx);
  if (!cancel.ok) {
    const sub = cancel.subscription;
    await writeAudit(ctx, { action: "account.delete_failed", actorAccountId: ctx.account.id, targetAccountId: ctx.account.id, targetId: sub.id, detail: { provider: sub.provider } });
    return { status: 502, body: { ok: false, reason: "cancel_failed" } };
  }
  const email = ctx.account.email_normalized;
  const emailHmac = email ? await hmacHex(ctx.pepper, `tombstone:${email}`) : null;
  await ctx.db.batch(erasureBatch(ctx, emailHmac, cancel.cancelled));
  return { status: 200, body: { ok: true, deleted: true }, setCookie: clearSessionCookie() };
}
