/**
 * audit.mjs: append-only rows with ids and JSON detail; absent fields are NULL.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { writeAudit } from "../src/audit.mjs";
import { NOW, createCtx } from "./fixtures.mjs";

test("an audit row records actor, action, target, JSON detail and time", async () => {
  const ctx = await createCtx();
  await writeAudit(ctx, { action: "grant.create", actorAccountId: "acct_a", targetAccountId: "acct_b", targetId: "grant_1", detail: { days: 30 } });
  const row = await ctx.db.prepare("SELECT actor_account_id, action, target_account_id, target_id, detail, created_at FROM audit_log").first();
  assert.deepEqual(row, {
    actor_account_id: "acct_a",
    action: "grant.create",
    target_account_id: "acct_b",
    target_id: "grant_1",
    detail: '{"days":30}',
    created_at: NOW
  });
});

test("missing optional fields are stored as NULL, never as the string 'undefined'", async () => {
  const ctx = await createCtx();
  await writeAudit(ctx, { action: "webhook.unmatched" });
  const row = await ctx.db.prepare("SELECT actor_account_id, target_account_id, target_id, detail FROM audit_log").first();
  assert.deepEqual(row, { actor_account_id: null, target_account_id: null, target_id: null, detail: null });
});

test("rows are appended, never replaced", async () => {
  const ctx = await createCtx();
  await writeAudit(ctx, { action: "a" });
  await writeAudit(ctx, { action: "a" });
  assert.equal(await ctx.db.prepare("SELECT COUNT(*) AS c FROM audit_log").first("c"), 2);
});
