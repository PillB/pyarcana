/**
 * Bug reports and the QA reporting subsite (DESIGN-v3 "Bug reports and QA
 * reporting").
 *
 *   POST  /v1/reports                                  anonymous or signed in
 *   GET   /v1/me/reports                               the caller's own
 *   GET   /v1/qa/reports[?filters&cursor]              tester or admin, no reporter identity
 *   GET   /v1/qa/reports/:id                           + attachment metadata
 *   GET   /v1/qa/reports/:id/attachments/:aid          the image bytes, sniff-checked
 *   GET   /v1/admin/reports                            admin: + contact and account email
 *   PATCH /v1/admin/reports/:id {status, adminNote, duplicateOf}
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { REPORT_CATEGORIES, REPORT_CAUSES, REPORT_SEVERITIES } from "../src/reports.mjs";
import { NOW, api, count, createHarness, seedAccount, sql } from "./fixtures.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const QA_SESSION = path.resolve(HERE, "../../../src/lib/qa-session.ts");

const PNG = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 73, 72, 68, 82, 1, 2, 3]);
const JPEG = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0, 16, 74, 70, 73, 70, 0, 1]);
const WEBP = Uint8Array.from([...Buffer.from("RIFF"), 12, 0, 0, 0, ...Buffer.from("WEBPVP8 "), 0, 0]);
const GIF = Uint8Array.from(Buffer.from("GIF89a\u0001\u0000\u0001\u0000"));

/**
 * base64 of bytes.
 * @param {Uint8Array} bytes Bytes.
 * @returns {string} base64.
 */
const b64 = (bytes) => Buffer.from(bytes).toString("base64");

/**
 * The `value` strings of one `export const NAME = [...] as const` list.
 * @param {string} source File text.
 * @param {string} name Constant name.
 * @returns {string[]} Values in order.
 */
function tsEnumValues(source, name) {
  const start = source.indexOf(`export const ${name} = [`);
  assert.ok(start >= 0, `${name} not found in qa-session.ts`);
  const body = source.slice(start, source.indexOf("] as const", start));
  return [...body.matchAll(/value:\s*'([^']+)'/g)].map((m) => m[1]);
}

/**
 * A valid report body.
 * @param {Object} [patch] Overrides.
 * @returns {Object} Body.
 */
function report(patch) {
  return {
    source: "qa_harness",
    category: "functionality",
    cause: "logic-state",
    severity: "high",
    title: "El botón Siguiente no avanza",
    description: "En S07 el botón no hace nada.",
    steps: "1. Abrir S07\n2. Pulsar Siguiente",
    expected: "Pasa al paso 2",
    actual: "No pasa nada",
    improvement: "Mostrar un error",
    context: { path: "/", hash: "#S07", sectionId: "S07", sectionIndex: 7, viewport: { width: 390, height: 844 }, userAgent: "UA", language: "es" },
    ...(patch || {})
  };
}

/**
 * POST /v1/reports.
 * @param {Object} env Env.
 * @param {Object} body Body.
 * @param {Object} [extra] api() options.
 * @returns {Promise<Object>} Response.
 */
function submit(env, body, extra) {
  return api(env, "POST", "/v1/reports", { body, ...(extra || {}) });
}

/**
 * A harness with an admin, a tester and a learner.
 * @returns {Promise<Object>} Harness.
 */
async function people() {
  const { env } = await createHarness();
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  const tester = await seedAccount(env, { email: "qa@example.test" });
  await sql(env, "INSERT INTO account_roles (account_id, role, created_at) VALUES (?1, 'tester', ?2)", tester.account.id, NOW - 10);
  const learner = await seedAccount(env, { email: "ana@example.test" });
  return { env, admin, tester, learner };
}

test("the worker's category/cause/severity enums equal QA_CATEGORIES/QA_CAUSES/QA_SEVERITIES in src/lib/qa-session.ts", () => {
  const source = readFileSync(QA_SESSION, "utf8");
  assert.deepEqual([...REPORT_CATEGORIES], tsEnumValues(source, "QA_CATEGORIES"));
  assert.deepEqual([...REPORT_CAUSES], tsEnumValues(source, "QA_CAUSES"));
  assert.deepEqual([...REPORT_SEVERITIES], tsEnumValues(source, "QA_SEVERITIES"));
});

test("an anonymous report with a contact email, context and a PNG is stored whole", async () => {
  const { env } = await people();
  const res = await submit(env, report({
    contactEmail: "Visitante@Example.test",
    reporterAlias: "Visitante",
    context: { ...report().context, secret: "dropped", sectionIndex: "7", elementHint: "button.next" },
    attachments: [{ mime: "image/png", data: `data:image/png;base64,${b64(PNG)}` }]
  }));
  assert.equal(res.status, 201);
  assert.match(res.body.id, /^rep_/);
  assert.deepEqual([res.body.attachments, res.body.deduplicated], [1, false]);
  const row = await env.DB.prepare("SELECT * FROM reports WHERE id = ?1").bind(res.body.id).first();
  assert.deepEqual(
    [row.account_id, row.contact_email, row.reporter_alias, row.status, row.category, row.cause, row.severity, row.improvement],
    [null, "visitante@example.test", "Visitante", "new", "functionality", "logic-state", "high", "Mostrar un error"]
  );
  const context = JSON.parse(row.context);
  assert.equal(context.secret, undefined, "unknown context keys are dropped");
  assert.equal(context.sectionIndex, undefined, "wrongly typed context values are dropped");
  assert.deepEqual([context.sectionId, context.elementHint, context.viewport], ["S07", "button.next", { width: 390, height: 844 }]);
  const att = await env.DB.prepare("SELECT mime, length(bytes) AS size FROM report_attachments WHERE report_id = ?1").bind(res.body.id).first();
  assert.deepEqual(att, { mime: "image/png", size: PNG.length });
});

test("a signed-in report belongs to the account, ignores a contact email, and shows in /v1/me/reports only for its owner", async () => {
  const { env, learner, tester } = await people();
  const res = await submit(env, report({ contactEmail: "x@example.test", attachments: [{ mime: "image/jpeg", data: b64(JPEG) }, { mime: "image/webp", data: b64(WEBP) }] }), { cookie: learner.token });
  assert.equal(res.status, 201);
  const row = await env.DB.prepare("SELECT account_id, contact_email FROM reports WHERE id = ?1").bind(res.body.id).first();
  assert.deepEqual(row, { account_id: learner.account.id, contact_email: null });
  const mine = await api(env, "GET", "/v1/me/reports", { cookie: learner.token });
  assert.deepEqual(mine.body.reports.map((r) => [r.id, r.status, r.title]), [[res.body.id, "new", "El botón Siguiente no avanza"]]);
  assert.deepEqual((await api(env, "GET", "/v1/me/reports", { cookie: tester.token })).body.reports, []);
  assert.equal((await api(env, "GET", "/v1/me/reports", {})).status, 401);
});

test("invalid reports are refused with a reason and store nothing", async () => {
  const { env } = await people();
  const big = new Uint8Array(1024 * 1024 + 1);
  big.set(PNG);
  const cases = [
    [report({ title: "" }), 400, "bad_title"],
    [report({ title: "x".repeat(201) }), 400, "bad_title"],
    [report({ source: "email" }), 400, "bad_source"],
    [report({ category: "bug" }), 400, "bad_category"],
    [report({ cause: "gremlins" }), 400, "bad_cause"],
    [report({ severity: "critical" }), 400, "bad_severity"],
    [report({ description: "x".repeat(5001) }), 400, "bad_description"],
    [report({ contactEmail: "nope" }), 400, "bad_email"],
    [report({ clientIssueId: "short" }), 400, "bad_client_issue_id"],
    [report({ attachments: "nope" }), 400, "bad_attachments"],
    [report({ attachments: Array(4).fill({ mime: "image/png", data: b64(PNG) }) }), 400, "too_many_attachments"],
    [report({ attachments: [{ mime: "image/png", data: "%%%not base64%%%" }] }), 400, "bad_attachment"],
    [report({ attachments: [{ mime: "image/png", data: b64(JPEG) }] }), 400, "bad_attachment"],
    [report({ attachments: [{ mime: "image/gif", data: b64(GIF) }] }), 400, "bad_attachment"],
    [report({ attachments: [{ mime: "image/png", data: `data:image/jpeg;base64,${b64(PNG)}` }] }), 400, "bad_attachment"],
    [report({ attachments: [{ mime: "image/png", data: b64(big) }] }), 413, "attachment_too_large"]
  ];
  for (const [body, status, reason] of cases) {
    const res = await submit(env, body, { headers: { "cf-connecting-ip": `198.51.100.${cases.findIndex((c) => c[0] === body)}` } });
    assert.deepEqual([reason, res.status, res.body.reason], [reason, status, reason]);
  }
  assert.equal(await count(env, "FROM reports"), 0);
  assert.equal(await count(env, "FROM report_attachments"), 0);
});

test("a re-sent issue (same clientIssueId) is stored once, even when sent five times at once", async () => {
  const { env, learner } = await people();
  const body = report({ clientIssueId: "0b8f5c2e-1111-4a2b-9c3d-222233334444", attachments: [{ mime: "image/png", data: b64(PNG) }] });
  const results = await Promise.all(Array.from({ length: 5 }, () => submit(env, body, { cookie: learner.token })));
  assert.deepEqual(results.map((r) => r.status).sort(), [200, 200, 200, 200, 201]);
  assert.equal(new Set(results.map((r) => r.body.id)).size, 1);
  assert.equal(await count(env, "FROM reports"), 1);
  assert.equal(await count(env, "FROM report_attachments"), 1, "a duplicate never adds attachments");
  const anonymous = await submit(env, body, { headers: { "cf-connecting-ip": "203.0.113.9" } });
  const anonymousAgain = await submit(env, body, { headers: { "cf-connecting-ip": "203.0.113.9" } });
  assert.deepEqual([anonymous.status, anonymousAgain.status, anonymousAgain.body.id], [201, 200, anonymous.body.id]);
  assert.equal(await count(env, "FROM reports"), 2, "the anonymous copy is its own report");
});

test("rate limits: anonymous 5/h per IP and 50/day overall; signed-in 60/h", async () => {
  const { env, learner } = await people();
  const ip = (n) => ({ headers: { "cf-connecting-ip": `192.0.2.${n}` } });
  for (let i = 0; i < 5; i += 1) {
    assert.equal((await submit(env, report(), ip(1))).status, 201);
  }
  const sixth = await submit(env, report(), ip(1));
  assert.deepEqual([sixth.status, sixth.body.reason], [429, "rate_limited"]);
  for (let n = 2; n <= 10; n += 1) {
    for (let i = 0; i < 5; i += 1) {
      assert.equal((await submit(env, report(), ip(n))).status, 201, `ip ${n} report ${i}`);
    }
  }
  const overDaily = await submit(env, report(), ip(11));
  assert.deepEqual([overDaily.status, overDaily.body.reason], [429, "rate_limited"], "the 51st anonymous report of the day");
  for (let i = 0; i < 60; i += 1) {
    assert.equal((await submit(env, report(), { cookie: learner.token })).status, 201);
  }
  assert.equal((await submit(env, report(), { cookie: learner.token })).status, 429);
});

test("the QA list shows every report without reporter identity, filters, and pages with a cursor", async () => {
  const { env, tester, learner } = await people();
  const ids = [];
  const specs = [
    { severity: "blocker", category: "content", context: { sectionId: "S01" }, title: "Uno" },
    { severity: "low", category: "ui-ux", context: { sectionId: "S02" }, title: "Dos 100%" },
    { severity: "blocker", category: "content", context: { sectionId: "S02" }, title: "Tres" },
    { severity: "medium", category: "accessibility", context: { sectionId: "S03" }, title: "Cuatro" },
    { severity: "blocker", category: "ui-ux", context: { sectionId: "S01" }, title: "Cinco" }
  ];
  for (const [i, spec] of specs.entries()) {
    const res = await submit(env, report({ ...spec, contactEmail: "c@example.test" }), { now: NOW + i, headers: { "cf-connecting-ip": `192.0.2.${i}` } });
    ids.push(res.body.id);
  }
  await submit(env, report({ title: "De Ana" }), { cookie: learner.token, now: NOW + 10 });
  const list = async (q) => (await api(env, "GET", `/v1/qa/reports${q}`, { cookie: tester.token, now: NOW + 20 })).body;
  const all = await list("");
  assert.equal(all.reports.length, 6);
  assert.ok(all.reports.every((r) => !("contactEmail" in r) && !("accountId" in r) && !("accountEmail" in r) && !("adminNote" in r)));
  assert.ok(!JSON.stringify(all).includes("@"), "no email anywhere in the tester view");
  assert.deepEqual((await list("?severity=blocker")).reports.map((r) => r.title), ["Cinco", "Tres", "Uno"]);
  assert.deepEqual((await list("?category=content&section=S02")).reports.map((r) => r.title), ["Tres"]);
  assert.deepEqual((await list("?q=100%25")).reports.map((r) => r.title), ["Dos 100%"], "LIKE wildcards in q are literal");
  const seen = [];
  let cursor = "";
  for (let page = 0; page < 5 && cursor !== null; page += 1) {
    const body = await list(`?limit=2${cursor ? `&cursor=${cursor}` : ""}`);
    seen.push(...body.reports.map((r) => r.id));
    cursor = body.nextCursor;
  }
  assert.equal(cursor, null, "pages end");
  assert.equal(seen.length, 6);
  assert.equal(new Set(seen).size, 6, "no report twice, none lost");
  const bad = await api(env, "GET", "/v1/qa/reports?cursor=%%%", { cookie: tester.token });
  assert.deepEqual([bad.status, bad.body.reason], [400, "bad_cursor"]);
  const badStatus = await api(env, "GET", "/v1/qa/reports?status=open", { cookie: tester.token });
  assert.deepEqual([badStatus.status, badStatus.body.reason], [400, "bad_status"]);
  assert.equal((await api(env, "GET", "/v1/qa/reports", { cookie: learner.token })).status, 403);
});

test("QA detail lists attachments, and the bytes are served sniff-checked with safe headers", async () => {
  const { env, tester, learner } = await people();
  const res = await submit(env, report({ attachments: [{ mime: "image/png", data: b64(PNG) }] }), { cookie: learner.token });
  const detail = await api(env, "GET", `/v1/qa/reports/${res.body.id}`, { cookie: tester.token });
  assert.equal(detail.status, 200);
  assert.equal(detail.body.report.title, "El botón Siguiente no avanza");
  assert.equal(detail.body.report.mine, false);
  const [att] = detail.body.attachments;
  assert.deepEqual([att.mime, att.size], ["image/png", PNG.length]);
  const { handleRequest } = await import("../src/index.mjs");
  const request = new Request(`https://api.pyarcana.test/v1/qa/reports/${res.body.id}/attachments/${att.id}`, {
    headers: { Origin: "https://app.pyarcana.test", Cookie: `__Host-pa_session=${tester.token}` }
  });
  const bytes = await handleRequest(request, env, { now: NOW, log: () => {} });
  assert.equal(bytes.status, 200);
  assert.equal(bytes.headers.get("content-type"), "image/png");
  assert.equal(bytes.headers.get("x-content-type-options"), "nosniff");
  assert.match(bytes.headers.get("content-disposition"), /^inline/);
  assert.match(bytes.headers.get("content-security-policy"), /sandbox/);
  assert.equal(bytes.headers.get("cache-control"), "private, no-store");
  assert.deepEqual(new Uint8Array(await bytes.arrayBuffer()), PNG);
  assert.equal((await api(env, "GET", `/v1/qa/reports/${res.body.id}/attachments/att_nope`, { cookie: tester.token })).status, 404);
  assert.equal((await api(env, "GET", `/v1/qa/reports/rep_nope`, { cookie: tester.token })).status, 404);
  assert.equal((await api(env, "GET", `/v1/qa/reports/${res.body.id}`, { cookie: learner.token })).status, 403);
  await sql(env, "UPDATE report_attachments SET mime = 'image/jpeg' WHERE id = ?1", att.id);
  const tampered = await api(env, "GET", `/v1/qa/reports/${res.body.id}/attachments/${att.id}`, { cookie: tester.token });
  assert.deepEqual([tampered.status, tampered.body.reason], [409, "attachment_mismatch"], "stored bytes that do not match their type are never served");
});

test("admins see contact and account emails, triage with PATCH, and every admin call is audited", async () => {
  const { env, admin, tester, learner } = await people();
  const a = await submit(env, report({ title: "Original", contactEmail: "v@example.test" }));
  const b = await submit(env, report({ title: "Copia" }), { cookie: learner.token });
  const list = await api(env, "GET", "/v1/admin/reports", { cookie: admin.token });
  assert.deepEqual(
    list.body.reports.map((r) => [r.title, r.contactEmail, r.accountEmail]),
    [
      ["Copia", null, "ana@example.test"],
      ["Original", "v@example.test", null]
    ]
  );
  const patch = (id, body, who = admin) => api(env, "PATCH", `/v1/admin/reports/${id}`, { cookie: who.token, body, now: NOW + 30 });
  const triaged = await patch(a.body.id, { status: "triaged", adminNote: "reproducido" });
  assert.deepEqual([triaged.status, triaged.body.report.status, triaged.body.report.adminNote, triaged.body.report.updatedAt], [200, "triaged", "reproducido", NOW + 30]);
  const dup = await patch(b.body.id, { duplicateOf: a.body.id });
  assert.deepEqual([dup.body.report.status, dup.body.report.duplicateOf], ["duplicate", a.body.id]);
  const reopened = await patch(b.body.id, { status: "new" });
  assert.deepEqual([reopened.body.report.status, reopened.body.report.duplicateOf], ["new", null], "leaving duplicate clears duplicateOf");
  const cases = [
    [a.body.id, { duplicateOf: a.body.id }, 400, "bad_duplicate_of"],
    [a.body.id, { duplicateOf: "rep_nope" }, 400, "bad_duplicate_of"],
    [a.body.id, { status: "duplicate" }, 400, "duplicate_of_required"],
    [a.body.id, { status: "done" }, 400, "bad_status"],
    [a.body.id, { adminNote: "x".repeat(2001) }, 400, "bad_note"],
    [a.body.id, {}, 400, "nothing_to_update"],
    ["rep_nope", { status: "fixed" }, 404, "not_found"]
  ];
  for (const [id, body, status, reason] of cases) {
    const res = await patch(id, body);
    assert.deepEqual([JSON.stringify(body), res.status, res.body.reason], [JSON.stringify(body), status, reason]);
  }
  assert.equal((await patch(a.body.id, { status: "fixed" }, tester)).status, 403, "testers cannot triage");
  assert.equal((await api(env, "GET", "/v1/admin/reports", { cookie: tester.token })).status, 403);
  const updates = (await env.DB.prepare("SELECT target_id FROM audit_log WHERE action = 'admin.reports.update' AND actor_account_id = ?1 ORDER BY id").bind(admin.account.id).all()).results;
  assert.equal(updates.length, 3 + cases.length);
  assert.equal(updates[0].target_id, a.body.id);
  assert.equal(await count(env, "FROM audit_log WHERE action = 'admin.reports.list'"), 1);
});
