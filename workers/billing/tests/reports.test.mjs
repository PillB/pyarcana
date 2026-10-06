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
  const exact = new Uint8Array(1024 * 1024);
  exact.set(PNG);
  const atLimit = await submit(env, report({ attachments: [{ mime: "image/png", data: b64(exact) }] }), { headers: { "cf-connecting-ip": "198.51.100.200" } });
  assert.equal(atLimit.status, 201, "exactly 1 MiB is accepted");
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

test("a retry of a stored report gets its id back without spending the submission quota", async () => {
  // The quota used to be spent before the duplicate was recognised: an anonymous network's sixth
  // retry of one stored report was a 429, not the original id.
  const { env } = await people();
  const net = { headers: { "cf-connecting-ip": "192.0.2.77" } };
  const body = report({ clientIssueId: "7d3a1c9e-5555-4b6c-8d7e-666677778888" });
  const first = await submit(env, body, net);
  assert.equal(first.status, 201);
  for (let i = 0; i < 8; i += 1) {
    const again = await submit(env, body, net);
    assert.deepEqual([again.status, again.body.id, again.body.deduplicated], [200, first.body.id, true], `retry ${i + 1}`);
  }
  for (let i = 0; i < 4; i += 1) {
    assert.equal((await submit(env, report(), net)).status, 201, `new report ${i + 2} of 5 this hour`);
  }
  assert.deepEqual((await submit(env, report(), net)).body.reason, "rate_limited", "the sixth new report is still refused");
  const bad = await submit(env, report({ clientIssueId: "short" }), { headers: { "cf-connecting-ip": "192.0.2.78" } });
  assert.deepEqual([bad.status, bad.body.reason], [400, "bad_client_issue_id"], "a malformed key is refused as before");
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
  assert.deepEqual((await list("?q=100%25")).reports.map((r) => r.title), ["Dos 100%"]);
  assert.deepEqual((await list("?q=%25")).reports.map((r) => r.title), ["Dos 100%"], "a bare % is a literal percent sign, not a wildcard");
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
  assert.equal(bytes.headers.get("cross-origin-resource-policy"), "same-site", "no other site can embed the screenshot");
  assert.deepEqual(new Uint8Array(await bytes.arrayBuffer()), PNG);
  assert.equal((await api(env, "GET", `/v1/qa/reports/${res.body.id}/attachments/att_nope`, { cookie: tester.token })).status, 404);
  const other = await submit(env, report({ attachments: [{ mime: "image/jpeg", data: b64(JPEG) }] }), { cookie: learner.token });
  const otherAtt = (await api(env, "GET", `/v1/qa/reports/${other.body.id}`, { cookie: tester.token })).body.attachments[0].id;
  assert.equal((await api(env, "GET", `/v1/qa/reports/${res.body.id}/attachments/${otherAtt}`, { cookie: tester.token })).status, 404, "an attachment only under its own report");
  assert.equal((await api(env, "GET", `/v1/qa/reports/rep_nope`, { cookie: tester.token })).status, 404);
  assert.equal((await api(env, "GET", `/v1/qa/reports/${res.body.id}`, { cookie: learner.token })).status, 403);
  await sql(env, "UPDATE report_attachments SET mime = 'image/jpeg' WHERE id = ?1", att.id);
  const tampered = await api(env, "GET", `/v1/qa/reports/${res.body.id}/attachments/${att.id}`, { cookie: tester.token });
  assert.deepEqual([tampered.status, tampered.body.reason], [409, "attachment_mismatch"], "stored bytes that do not match their type are never served");
});

test("admins see contact and account emails, triage with PATCH, and every admin call is audited", async () => {
  const { env, admin, tester, learner } = await people();
  const a = await submit(env, report({ title: "Original", contactEmail: "v@example.test" }));
  const b = await submit(env, report({ title: "Copia" }), { cookie: learner.token, now: NOW + 1 });
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
  assert.equal(await count(env, "FROM audit_log WHERE action = 'admin.reports.list' AND actor_account_id = ?1", admin.account.id), 1);
  assert.equal(await count(env, "FROM audit_log WHERE action = 'admin.reports.list' AND actor_account_id = ?1", tester.account.id), 1, "the refused tester is audited too");
});

test("review F2: one IPv6 /64 cannot exhaust the 50/day anonymous budget; an honest reporter elsewhere still files", async () => {
  const { env } = await people();
  const day = NOW - (NOW % 86400);
  let accepted = 0;
  for (let hour = 0; hour < 10; hour += 1) {
    for (let i = 0; i < 5; i += 1) {
      const res = await submit(env, report(), { headers: { "cf-connecting-ip": `2001:db8:5:5::${(hour * 5 + i + 1).toString(16)}` }, now: day + hour * 3600 + i });
      accepted += res.status === 201 ? 1 : 0;
    }
  }
  assert.equal(accepted, 5, "5 anonymous reports per network per UTC day");
  const honest = await submit(env, report(), { headers: { "cf-connecting-ip": "198.51.100.23" }, now: day + 11 * 3600 });
  assert.equal(honest.status, 201);
});

/**
 * A PNG of exactly `size` bytes (magic bytes, then filler), as base64.
 * @param {number} size Bytes.
 * @returns {{mime: string, data: string}} Attachment.
 */
function pngOf(size) {
  const bytes = new Uint8Array(size);
  bytes.set(PNG);
  return { mime: "image/png", data: b64(bytes) };
}

/**
 * Stored attachment bytes in total.
 * @param {Object} env Env.
 * @returns {Promise<number>} Bytes.
 */
async function storedBytes(env) {
  return Number(await env.DB.prepare("SELECT COALESCE(SUM(length(bytes)), 0) AS b FROM report_attachments").first("b"));
}

test("review F3: one account's screenshots are capped at 10 MiB a day; past it the report text is still stored", async () => {
  const { env, learner } = await people();
  const three = [pngOf(1000000), pngOf(1000000), pngOf(1000000)];
  for (let i = 0; i < 3; i += 1) {
    const res = await submit(env, report({ attachments: three }), { cookie: learner.token });
    assert.deepEqual([res.status, res.body.attachments], [201, 3], `report ${i + 1}`);
  }
  const over = await submit(env, report({ title: "Cuarto", attachments: three }), { cookie: learner.token });
  assert.deepEqual([over.status, over.body.attachments, over.body.attachmentsDropped, over.body.attachmentsReason], [201, 0, 3, "attachment_budget"]);
  assert.equal(await count(env, "FROM reports WHERE id = ?1", over.body.id), 1, "the text is kept");
  assert.equal(await count(env, "FROM report_attachments WHERE report_id = ?1", over.body.id), 0);
  assert.equal(await storedBytes(env), 9000000);
  const tomorrow = await submit(env, report({ attachments: three }), { cookie: learner.token, now: NOW + 86400 });
  assert.equal(tomorrow.body.attachments, 3, "the budget renews with the UTC day");
});

test("review F3: anonymous screenshots share 20 MiB a day across every network", async () => {
  const { env } = await people();
  const three = [pngOf(1000000), pngOf(1000000), pngOf(1000000)];
  const results = [];
  for (let i = 0; i < 7; i += 1) {
    const res = await submit(env, report({ attachments: three }), { headers: { "cf-connecting-ip": `203.0.113.${i + 1}` } });
    results.push([res.status, res.body.attachments]);
  }
  assert.deepEqual(results, [[201, 3], [201, 3], [201, 3], [201, 3], [201, 3], [201, 3], [201, 0]]);
  assert.equal(await storedBytes(env), 18000000);
});

test("review F3: above the global ceiling (REPORT_ATTACHMENTS_CAP_MB) screenshots are refused as storage_full; text is kept", async () => {
  const { env, learner } = await people();
  env.REPORT_ATTACHMENTS_CAP_MB = "2";
  const mib = pngOf(1024 * 1024);
  assert.equal((await submit(env, report({ attachments: [mib] }), { cookie: learner.token })).body.attachments, 1);
  assert.equal((await submit(env, report({ attachments: [mib] }), { cookie: learner.token })).body.attachments, 1, "exactly at the ceiling");
  const full = await submit(env, report({ title: "Lleno", attachments: [mib, pngOf(64)] }), { cookie: learner.token });
  assert.deepEqual([full.status, full.body.attachments, full.body.attachmentsDropped, full.body.attachmentsReason], [201, 0, 2, "storage_full"]);
  assert.equal(await count(env, "FROM reports WHERE title = 'Lleno'"), 1);
  assert.equal(await storedBytes(env), 2 * 1024 * 1024);
});

test("review F3: a re-sent issue spends no screenshot budget", async () => {
  const { env, learner } = await people();
  const body = report({ clientIssueId: "qa-issue-resend-01", attachments: [pngOf(1000000), pngOf(1000000), pngOf(1000000)] });
  assert.equal((await submit(env, body, { cookie: learner.token })).status, 201);
  for (let i = 0; i < 5; i += 1) {
    assert.equal((await submit(env, body, { cookie: learner.token })).body.deduplicated, true);
  }
  for (let i = 0; i < 2; i += 1) {
    assert.equal((await submit(env, report({ attachments: [pngOf(1000000), pngOf(1000000), pngOf(1000000)] }), { cookie: learner.token })).body.attachments, 3, `fresh report ${i + 1}`);
  }
});

/**
 * Insert a report row straight into D1.
 * @param {Object} env Env.
 * @param {string} id Report id.
 * @param {number} createdAt Clock.
 * @returns {Promise<Object>} Result.
 */
function rawReport(env, id, createdAt) {
  return sql(env, "INSERT INTO reports (id, created_at, updated_at, source, status, title) VALUES (?1, ?2, ?2, 'feedback', 'new', ?1)", id, createdAt);
}

test("review: reports filed in the same second page without repeats or gaps (the id tie-break)", async () => {
  const { env, tester } = await people();
  const ids = ["rep_a", "rep_b", "rep_c", "rep_d", "rep_e"];
  for (const id of ids) {
    await rawReport(env, id, NOW);
  }
  const seen = [];
  let cursor = "";
  for (let page = 0; page < 5; page += 1) {
    const res = await api(env, "GET", `/v1/qa/reports?limit=2${cursor ? `&cursor=${cursor}` : ""}`, { cookie: tester.token });
    seen.push(...res.body.reports.map((r) => r.id));
    if (!res.body.nextCursor) {
      break;
    }
    cursor = res.body.nextCursor;
  }
  assert.deepEqual(seen, [...ids].reverse(), "each report exactly once, newest id first within the second");
});

test("review: a page holds at most 100 reports whatever limit is asked (larger limits are clamped)", async () => {
  const { env, tester } = await people();
  for (let i = 0; i < 101; i += 1) {
    await rawReport(env, `rep_${String(i).padStart(3, "0")}`, NOW - i);
  }
  const res = await api(env, "GET", "/v1/qa/reports?limit=5000", { cookie: tester.token });
  assert.equal(res.body.reports.length, 100);
  assert.ok(res.body.nextCursor, "the 101st is on the next page");
  assert.deepEqual((await api(env, "GET", "/v1/qa/reports?limit=0", { cookie: tester.token })).body.reason, "bad_limit");
});

test("review: a status-only PATCH keeps the admin's triage note", async () => {
  const { env, admin, learner } = await people();
  const res = await submit(env, report(), { cookie: learner.token });
  const patch = (body) => api(env, "PATCH", `/v1/admin/reports/${res.body.id}`, { cookie: admin.token, body });
  assert.equal((await patch({ status: "triaged", adminNote: "reproducido en Safari" })).status, 200);
  const fixed = await patch({ status: "fixed" });
  assert.deepEqual([fixed.status, fixed.body.report.status, fixed.body.report.adminNote], [200, "fixed", "reproducido en Safari"]);
  const cleared = await patch({ adminNote: null });
  assert.deepEqual([cleared.body.report.status, cleared.body.report.adminNote], ["fixed", null], "an explicit null clears it");
});

test("review: the step, alias and context caps hold, and a RIFF file that is not WebP is refused", async () => {
  const { env } = await people();
  const ip = (n) => ({ headers: { "cf-connecting-ip": `198.18.0.${n}` } });
  const steps = await submit(env, report({ steps: "x".repeat(5001) }), ip(1));
  assert.deepEqual([steps.status, steps.body.reason], [400, "bad_steps"]);
  assert.equal((await submit(env, report({ steps: "x".repeat(5000) }), ip(2))).status, 201);
  const alias = await submit(env, report({ reporterAlias: "a".repeat(81) }), ip(3));
  assert.deepEqual([alias.status, alias.body.reason], [400, "bad_alias"]);
  const wave = Uint8Array.from([...Buffer.from("RIFF"), 36, 0, 0, 0, ...Buffer.from("WAVEfmt "), 0, 0]);
  const riff = await submit(env, report({ attachments: [{ mime: "image/webp", data: b64(wave) }] }), ip(4));
  assert.deepEqual([riff.status, riff.body.reason], [400, "bad_attachment"], "a WAV (RIFF....WAVE) is not served as image/webp");
  assert.equal((await submit(env, report({ attachments: [{ mime: "image/webp", data: b64(WEBP) }] }), ip(5))).status, 201);
  const long = await submit(env, report({ context: { path: `/${"p".repeat(400)}`, userAgent: "U".repeat(1000), sectionId: "S".repeat(50) } }), ip(6));
  const stored = JSON.parse(await env.DB.prepare("SELECT context FROM reports WHERE id = ?1").bind(long.body.id).first("context"));
  assert.deepEqual([stored.path.length, stored.userAgent.length, stored.sectionId.length], [300, 400, 40], "context text is truncated to its caps");
});

/*
 * Review round 2: report TEXT had no byte budget, no ceiling and no retention,
 * so one free account could write ~77 MB a day into D1. The policy numbers
 * below are written out here on purpose (an oracle independent of the code):
 * raising a budget in reports.mjs must fail these tests.
 */
const ROW_OVERHEAD = 256;
const ACCOUNT_TEXT_PER_DAY = 512 * 1024;
const ANON_TEXT_PER_NETWORK_DAY = 64 * 1024;
const ANON_TEXT_PER_DAY = 1024 * 1024;
const TEXT_COLUMNS = ["title", "description", "steps", "expected", "actual", "improvement", "reporter_alias", "contact_email", "context", "client_issue_id"];

/**
 * The bytes a stored report holds, measured by SQLite itself (UTF-8 BLOB
 * lengths of its text columns) plus the fixed row overhead.
 * @param {Object} env Env.
 * @param {string} id Report id.
 * @returns {Promise<number>} Bytes.
 */
async function sqliteTextBytes(env, id) {
  const sum = TEXT_COLUMNS.map((c) => `COALESCE(length(CAST(${c} AS BLOB)), 0)`).join(" + ");
  return ROW_OVERHEAD + Number(await env.DB.prepare(`SELECT ${sum} AS b FROM reports WHERE id = ?1`).bind(id).first("b"));
}

/**
 * A report with every text field at its character cap in 3-byte UTF-8.
 * @param {Object} [patch] Overrides.
 * @returns {Object} Body.
 */
function heavyReport(patch) {
  const cjk = (n) => "中".repeat(n);
  return report({ title: cjk(200), description: cjk(5000), steps: cjk(5000), expected: cjk(2000), actual: cjk(2000), improvement: cjk(2000), reporterAlias: cjk(80), ...(patch || {}) });
}

test("review r2: a stored report's text_bytes is the UTF-8 size SQLite holds for its text, plus the row overhead", async () => {
  const { env } = await people();
  const res = await submit(env, heavyReport({ contactEmail: "v@example.test", clientIssueId: "qa-issue-bytes-0001" }), { headers: { "cf-connecting-ip": "203.0.113.77" } });
  assert.equal(res.status, 201);
  const stored = Number(await env.DB.prepare("SELECT text_bytes FROM reports WHERE id = ?1").bind(res.body.id).first("text_bytes"));
  const measured = await sqliteTextBytes(env, res.body.id);
  assert.ok(measured > 3 * 16000, "3-byte characters are counted as 3 bytes, not 1 UTF-16 unit");
  assert.equal(stored, measured);
});

test("review r2: one account's report text is capped per UTC day (429 rate_limited, budget report_text); a refused spend costs nothing", async () => {
  const { env, learner, tester } = await people();
  const first = await submit(env, heavyReport(), { cookie: learner.token });
  assert.equal(first.status, 201);
  const size = await sqliteTextBytes(env, first.body.id);
  const fits = Math.floor(ACCOUNT_TEXT_PER_DAY / size);
  const statuses = [first.status];
  let refused = null;
  for (let i = 1; i <= fits; i += 1) {
    const res = await submit(env, heavyReport(), { cookie: learner.token, now: NOW + i });
    statuses.push(res.status);
    refused = res.status === 201 ? refused : res;
  }
  assert.deepEqual(statuses, [...Array(fits).fill(201), 429], `${fits} heavy reports fit in the account's daily text budget`);
  assert.deepEqual([refused.body.reason, refused.body.budget], ["rate_limited", "report_text"]);
  assert.ok(Number(refused.headers.get("retry-after")) > 0);
  const stored = await env.DB.prepare("SELECT SUM(text_bytes) AS b, COUNT(*) AS c FROM reports WHERE account_id = ?1").bind(learner.account.id).first();
  assert.deepEqual([Number(stored.c), Number(stored.b) <= ACCOUNT_TEXT_PER_DAY], [fits, true]);
  assert.equal((await submit(env, report(), { cookie: learner.token, now: NOW + 100 })).status, 201, "the refused heavy report spent nothing; a small one still fits");
  assert.equal((await submit(env, heavyReport(), { cookie: tester.token, now: NOW + 100 })).status, 201, "another account has its own budget");
  assert.equal((await submit(env, heavyReport(), { cookie: learner.token, now: NOW + 86400 })).status, 201, "the budget renews with the UTC day");
});

test("review r2: anonymous report text is capped at 64 KiB per network and 1 MiB for all networks per UTC day", async () => {
  const { env } = await people();
  const net = (n) => ({ headers: { "cf-connecting-ip": `198.51.100.${n}` } });
  const a1 = await submit(env, heavyReport({ contactEmail: "v@example.test" }), net(1));
  assert.equal(a1.status, 201);
  const size = await sqliteTextBytes(env, a1.body.id);
  assert.ok(size <= ANON_TEXT_PER_NETWORK_DAY && 2 * size > ANON_TEXT_PER_NETWORK_DAY, "one heavy report per network fits");
  const a2 = await submit(env, heavyReport({ contactEmail: "v@example.test" }), net(1));
  assert.deepEqual([a2.status, a2.body.reason, a2.body.budget], [429, "rate_limited", "report_text"]);
  const fits = Math.floor(ANON_TEXT_PER_DAY / size);
  let accepted = 1;
  for (let n = 2; n <= fits + 3; n += 1) {
    const res = await submit(env, heavyReport({ contactEmail: "v@example.test" }), net(n));
    accepted += res.status === 201 ? 1 : 0;
    assert.ok(res.status === 201 || (res.status === 429 && res.body.budget === "report_text"), `network ${n}: ${res.status}`);
  }
  assert.equal(accepted, fits, "all anonymous reports together stop at the daily text budget");
  const total = Number(await env.DB.prepare("SELECT SUM(text_bytes) AS b FROM reports WHERE account_id IS NULL").first("b"));
  assert.ok(total <= ANON_TEXT_PER_DAY, `${total} bytes of anonymous text today`);
  assert.equal((await submit(env, report(), net(99))).status, 201, "a small honest report from a fresh network still fits the remainder");
});

test("review r2: the global ceiling REPORT_TEXT_CAP_MB is checked inside the report INSERT; past it 507 report_storage_full stores nothing", async () => {
  const { env, learner } = await people();
  const first = await submit(env, report({ clientIssueId: "qa-issue-cap-0001" }), { cookie: learner.token });
  assert.equal(first.status, 201);
  const size = await sqliteTextBytes(env, first.body.id);
  env.REPORT_TEXT_CAP_MB = "1";
  const cap = 1024 * 1024;
  await sql(env, "INSERT INTO reports (id, created_at, updated_at, source, status, title, text_bytes) VALUES ('rep_bulk', ?1, ?1, 'feedback', 'new', 'b', ?2)", NOW - 5, cap - 2 * size);
  const atCeiling = await submit(env, report({ clientIssueId: "qa-issue-cap-0002" }), { cookie: learner.token });
  assert.equal(atCeiling.status, 201, "exactly at the ceiling is accepted");
  const full = await submit(env, report({ clientIssueId: "qa-issue-cap-0003", attachments: [pngOf(64)] }), { cookie: learner.token });
  assert.deepEqual([full.status, full.body.ok, full.body.reason], [507, false, "report_storage_full"]);
  assert.equal(await count(env, "FROM reports"), 3, "nothing new stored");
  assert.equal(await count(env, "FROM report_attachments"), 0, "nor its screenshot");
  const resent = await submit(env, report({ clientIssueId: "qa-issue-cap-0001" }), { cookie: learner.token });
  assert.deepEqual([resent.status, resent.body.id, resent.body.deduplicated], [200, first.body.id, true], "a stored issue re-sent while full is still recognised");
  assert.equal(Number(await env.DB.prepare("SELECT SUM(text_bytes) AS b FROM reports").first("b")), cap);
});
