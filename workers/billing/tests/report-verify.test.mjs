/**
 * Retest checks and the QA supervisor (owner request 2026-11-19: testers retest a report and tag it
 * fixed; an admin or a QA supervisor double-checks and closes it):
 *   POST   /v1/qa/reports/:id/verifications   tester, QA supervisor or admin: the caller's own check
 *   DELETE /v1/qa/reports/:id/verifications   withdraws the caller's own check
 *   PATCH  /v1/qa/reports/:id                 QA supervisor or admin: status and duplicate link only
 *   GET    /v1/qa/reports?awaiting=review     the review queue
 * Each test models the wrong behaviour it guards against: a tester closing a report, a check
 * leaking who wrote it, a supervisor reaching an admin route or the admin note, one tester
 * overwriting another's check, and a report that cannot be swept because a check points at it.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, api, count, createHarness, seedAccount, sql } from "./fixtures.mjs";
import { sweepRetention } from "../src/retention.mjs";
import { VERIFICATIONS_PER_HOUR } from "../src/report-verify.mjs";

const DAY = 86400;

async function people() {
  const { env, ctx } = await createHarness();
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  const ana = await seedAccount(env, { email: "ana.qa@example.test" });
  const ben = await seedAccount(env, { email: "ben.qa@example.test" });
  const sup = await seedAccount(env, { email: "sup.qa@example.test" });
  const learner = await seedAccount(env, { email: "learner@example.test" });
  for (const who of [ana, ben]) {
    await sql(env, "INSERT INTO account_roles (account_id, role, created_at) VALUES (?1, 'tester', ?2)", who.account.id, NOW - 10);
  }
  await sql(env, "INSERT INTO account_roles (account_id, role, created_at) VALUES (?1, 'qa_supervisor', ?2)", sup.account.id, NOW - 10);
  return { env, ctx, admin, ana, ben, sup, learner };
}

function report(patch) {
  return {
    source: "qa_harness",
    category: "functionality",
    cause: "logic-state",
    severity: "high",
    title: "El botón Siguiente no avanza",
    description: "En S07 el botón no hace nada.",
    steps: "1. Abrir S07",
    expected: "Pasa",
    actual: "No pasa",
    improvement: "",
    reporterAlias: "Ana",
    context: { path: "/", hash: "#S07", sectionId: "S07", sectionIndex: 7, viewport: { width: 390, height: 844 }, userAgent: "UA", language: "es", deploymentSha: "abc1234" },
    ...(patch || {})
  };
}

async function fileReport(env, who, patch) {
  const res = await api(env, "POST", "/v1/reports", { cookie: who.token, body: report(patch) });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  return res.body.id;
}

const verify = (env, who, id, body) => api(env, "POST", `/v1/qa/reports/${id}/verifications`, { cookie: who.token, body });
const withdraw = (env, who, id) => api(env, "DELETE", `/v1/qa/reports/${id}/verifications`, { cookie: who.token });
const detail = (env, who, id) => api(env, "GET", `/v1/qa/reports/${id}`, { cookie: who.token });
const review = (env, who, id, body) => api(env, "PATCH", `/v1/qa/reports/${id}`, { cookie: who.token, body });
const statusOf = async (env, id) => (await env.DB.prepare("SELECT status FROM reports WHERE id = ?1").bind(id).first()).status;

test("a tester checks another tester's report; the check shows mine and byReporter but never who", async () => {
  const { env, ana, ben } = await people();
  const id = await fileReport(env, ana);
  const res = await verify(env, ben, id, { result: "reproduced", note: "También en Firefox", deploymentSha: "ABC1234" });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  const asAna = await detail(env, ana, id);
  assert.deepEqual(asAna.body.verifications, [
    { result: "reproduced", note: "También en Firefox", deploymentSha: "abc1234", createdAt: NOW, updatedAt: NOW, mine: false, byReporter: false }
  ]);
  assert.equal((await detail(env, ben, id)).body.verifications[0].mine, true, "the verifier sees it as theirs");
  const text = JSON.stringify(asAna.body);
  assert.ok(!text.includes("@") && !text.includes(ben.account.id), "no verifier email or account id in the tester view");
  // The reporter re-checking their own report is flagged, as it confirms less than another tester.
  await verify(env, ana, id, { result: "fixed" });
  const own = (await detail(env, ben, id)).body.verifications.find((v) => v.result === "fixed");
  assert.equal(own.byReporter, true);
  const list = await api(env, "GET", "/v1/qa/reports", { cookie: ben.token });
  assert.deepEqual(list.body.reports[0].verified, { reproduced: 1, notReproduced: 0, fixed: 1 });
});

test("only QA roles and admins may check; a learner is 403 and nothing is written", async () => {
  const { env, ana, learner, admin, sup } = await people();
  const id = await fileReport(env, ana);
  assert.equal((await verify(env, learner, id, { result: "reproduced" })).status, 403);
  assert.equal((await api(env, "POST", `/v1/qa/reports/${id}/verifications`, { body: { result: "reproduced" } })).status, 401);
  assert.equal(await count(env, "FROM report_verifications"), 0);
  assert.equal((await verify(env, admin, id, { result: "not_reproduced" })).status, 200);
  assert.equal((await verify(env, sup, id, { result: "reproduced" })).status, 200);
  assert.equal(await count(env, "FROM report_verifications"), 2);
});

test("one check per tester per report: checking again replaces it, and nobody can touch another's", async () => {
  const { env, ana, ben } = await people();
  const id = await fileReport(env, ana);
  await verify(env, ben, id, { result: "reproduced", note: "primero" });
  await verify(env, ben, id, { result: "fixed", note: "retest en abc1234" });
  await verify(env, ana, id, { result: "reproduced" });
  const rows = (await env.DB.prepare("SELECT account_id, result, note FROM report_verifications ORDER BY account_id").all()).results;
  assert.equal(rows.length, 2, "a second check by the same tester adds no weight");
  assert.equal(rows.find((r) => r.account_id === ben.account.id).result, "fixed");
  // Withdrawing removes only the caller's own row, and a second withdraw is a no-op.
  const out = await withdraw(env, ben, id);
  assert.deepEqual([out.status, out.body.withdrawn], [200, 1]);
  assert.deepEqual([(await withdraw(env, ben, id)).body.withdrawn], [0]);
  assert.deepEqual((await env.DB.prepare("SELECT account_id FROM report_verifications").all()).results.map((r) => r.account_id), [ana.account.id]);
});

test("malformed checks are refused and write nothing; an unknown report is 404", async () => {
  const { env, ana, ben } = await people();
  const id = await fileReport(env, ana);
  const bad = [
    [{}, "bad_result"],
    [{ result: "resolved" }, "bad_result"],
    [{ result: "fixed", status: "fixed" }, "bad_verification"],
    [{ result: "fixed", note: "x".repeat(1001) }, "bad_note"],
    [{ result: "fixed", note: 5 }, "bad_note"],
    [{ result: "fixed", deploymentSha: "<script>" }, "bad_deployment_sha"]
  ];
  for (const [body, reason] of bad) {
    const r = await verify(env, ben, id, body);
    assert.deepEqual([r.status, r.body.reason], [400, reason], JSON.stringify(body).slice(0, 60));
  }
  assert.equal((await verify(env, ben, "rep_nope", { result: "fixed" })).status, 404);
  assert.equal((await withdraw(env, ben, "rep_nope")).status, 404);
  assert.equal(await count(env, "FROM report_verifications"), 0);
});

test("a tester's fixed tag never closes a report: it waits in the review queue for a supervisor", async () => {
  const { env, ana, ben, sup } = await people();
  const tagged = await fileReport(env, ana);
  const untouched = await fileReport(env, ana, { title: "Otro" });
  await verify(env, ben, tagged, { result: "fixed" });
  assert.equal(await statusOf(env, tagged), "new", "the claim alone changes no status");
  assert.equal((await review(env, ben, tagged, { status: "fixed" })).status, 403, "a tester cannot close it");
  assert.equal(await statusOf(env, tagged), "new");
  const queue = async () => (await api(env, "GET", "/v1/qa/reports?awaiting=review", { cookie: sup.token })).body.reports.map((r) => r.id);
  assert.deepEqual(await queue(), [tagged], "only the report a retest says is fixed");
  const closed = await review(env, sup, tagged, { status: "fixed" });
  assert.deepEqual([closed.status, closed.body.report.status], [200, "fixed"]);
  assert.deepEqual(await queue(), [], "a closed report leaves the queue");
  assert.equal(await statusOf(env, untouched), "new");
  assert.equal((await api(env, "GET", "/v1/qa/reports?awaiting=yes", { cookie: sup.token })).body.reason, "bad_awaiting");
});

test("a QA supervisor changes status only: no admin note, no identity, no admin route; audited with the change", async () => {
  const { env, ana, sup } = await people();
  const id = await fileReport(env, ana);
  await sql(env, "UPDATE reports SET admin_note = 'privado' WHERE id = ?1", id);
  const note = await review(env, sup, id, { status: "fixed", adminNote: "hola" });
  assert.deepEqual([note.status, note.body.reason], [400, "bad_field"]);
  assert.equal(await statusOf(env, id), "new", "a refused change writes nothing");
  assert.equal((await review(env, sup, id, {})).body.reason, "nothing_to_update");
  assert.equal((await review(env, sup, id, { status: "closed" })).body.reason, "bad_status");
  const ok = await review(env, sup, id, { status: "in_progress" });
  assert.equal(ok.status, 200);
  const text = JSON.stringify(ok.body);
  assert.ok(!text.includes("@") && !text.includes("privado") && !("accountId" in ok.body.report), "the supervisor reads the tester view");
  const audit = (await env.DB.prepare("SELECT action, actor_account_id, target_id, detail FROM audit_log WHERE action = 'qa.reports.update'").all()).results;
  assert.equal(audit.length, 1);
  assert.deepEqual([audit[0].actor_account_id, audit[0].target_id, JSON.parse(audit[0].detail)], [sup.account.id, id, { from: "new", status: "in_progress", admin: false }]);
  for (const [method, path] of [["GET", "/v1/admin/reports"], ["PATCH", `/v1/admin/reports/${id}`], ["GET", "/v1/admin/roles"], ["POST", "/v1/admin/roles"], ["GET", "/v1/admin/qa/stats"]]) {
    const r = await api(env, method, path, { cookie: sup.token, body: method === "GET" ? undefined : { status: "fixed" } });
    assert.equal(r.status, 403, `${method} ${path} stays admin only`);
  }
});

test("the duplicate rule holds for a supervisor too", async () => {
  const { env, ana, sup } = await people();
  const a = await fileReport(env, ana);
  const b = await fileReport(env, ana, { title: "Igual" });
  assert.equal((await review(env, sup, b, { status: "duplicate" })).body.reason, "duplicate_of_required");
  assert.equal((await review(env, sup, b, { duplicateOf: b })).body.reason, "bad_duplicate_of");
  const r = await review(env, sup, b, { duplicateOf: a });
  assert.deepEqual([r.body.report.status, r.body.report.duplicateOf], ["duplicate", a]);
});

test("an admin grants and revokes qa_supervisor; a revoked or expired supervisor is refused at once", async () => {
  const { env, admin, ana } = await people();
  const target = await seedAccount(env, { email: "nueva.sup@example.test" });
  const id = await fileReport(env, ana);
  const granted = await api(env, "POST", "/v1/admin/roles", { cookie: admin.token, body: { email: "nueva.sup@example.test", role: "qa_supervisor", days: 30 } });
  assert.equal(granted.status, 201, JSON.stringify(granted.body));
  assert.deepEqual((await api(env, "GET", "/v1/me", { cookie: target.token })).body.account.roles, ["qa_supervisor"]);
  assert.equal((await review(env, target, id, { status: "triaged" })).status, 200);
  assert.equal((await review(env, target, id, { status: "fixed" })).status, 200);
  assert.equal((await env.DB.prepare("SELECT expires_at FROM account_roles WHERE account_id = ?1").bind(target.account.id).first()).expires_at, NOW + 30 * DAY);
  await api(env, "POST", "/v1/admin/roles/revoke", { cookie: admin.token, body: { accountId: target.account.id, role: "qa_supervisor", reason: "fin" } });
  assert.equal((await review(env, target, id, { status: "new" })).status, 403, "revoked");
  // Expiry: a second supervisor whose days ran out a second ago.
  const old = await seedAccount(env, { email: "vieja.sup@example.test" });
  await sql(env, "INSERT INTO account_roles (account_id, role, created_at, expires_at) VALUES (?1, 'qa_supervisor', ?2, ?3)", old.account.id, NOW - 100, NOW - 1);
  assert.equal((await review(env, old, id, { status: "new" })).status, 403, "expired");
  assert.equal(await statusOf(env, id), "fixed", "neither refused change wrote anything");
});

test("retention: an old closed report goes with its checks (the foreign key does not stop the sweep)", async () => {
  const { env, ctx, ana, ben } = await people();
  const id = await fileReport(env, ana);
  await verify(env, ben, id, { result: "fixed" });
  await sql(env, "UPDATE reports SET status = 'fixed', updated_at = ?2 WHERE id = ?1", id, NOW - 400 * DAY);
  const keep = await fileReport(env, ana, { title: "Reciente" });
  await verify(env, ben, keep, { result: "reproduced" });
  const counts = await sweepRetention({ ...ctx, db: env.DB, now: NOW });
  assert.deepEqual([counts.reports, counts.reportVerifications], [1, 1]);
  assert.deepEqual((await env.DB.prepare("SELECT report_id FROM report_verifications").all()).results.map((r) => r.report_id), [keep]);
});

test("erasure deletes the person's own checks and keeps other testers' checks; the export lists them", async () => {
  const { env, ana, ben } = await people();
  const id = await fileReport(env, ana);
  await verify(env, ben, id, { result: "reproduced", note: "nota de Ben" });
  await verify(env, ana, id, { result: "fixed" });
  const exported = await api(env, "GET", "/v1/me/export", { cookie: ben.token });
  assert.deepEqual(exported.body.reportVerifications.map((v) => [v.reportId, v.result, v.note]), [[id, "reproduced", "nota de Ben"]]);
  const res = await api(env, "DELETE", "/v1/me", { cookie: ana.token, body: { confirm: "DELETE" } });
  assert.equal(res.status, 200, JSON.stringify(res.body));
  assert.equal(await count(env, "FROM report_verifications WHERE account_id = ?1", ana.account.id), 0);
  assert.equal(await count(env, "FROM report_verifications WHERE account_id = ?1", ben.account.id), 1);
});

test(`at most ${VERIFICATIONS_PER_HOUR} check writes per tester per hour; the next is 429 and writes nothing`, async () => {
  const { env, ana, ben } = await people();
  const id = await fileReport(env, ana);
  for (let i = 0; i < VERIFICATIONS_PER_HOUR; i += 1) {
    assert.equal((await verify(env, ben, id, { result: i % 2 ? "fixed" : "reproduced" })).status, 200);
  }
  const over = await verify(env, ben, id, { result: "not_reproduced" });
  assert.deepEqual([over.status, over.body.reason], [429, "rate_limited"]);
  assert.equal((await env.DB.prepare("SELECT result FROM report_verifications").first()).result, "fixed", "the refused write changed nothing");
  assert.equal((await verify(env, ana, id, { result: "not_reproduced" })).status, 200, "another tester has their own budget");
});
