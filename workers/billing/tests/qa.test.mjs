/**
 * QA sessions and the admin's QA view (owner request 2026-10-05):
 *   POST /v1/qa/sessions           tester or admin: an idempotent, never-decreasing session summary
 *   GET  /v1/admin/qa/stats        admin: reports and sessions, counted
 *   GET  /v1/admin/qa/export       admin: CSV (formula-safe) or the QA workspace's JSON package
 * plus retention (1 year after last activity), erasure with the account, and the account export.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { NOW, API_BASE, APP_ORIGIN, api, createHarness, seedAccount, sql } from "./fixtures.mjs";
import { sweepRetention, QA_SESSION_DAYS } from "../src/retention.mjs";
import { csvCell, EXPORT_MAX_CHARS, EXPORT_MAX_REPORTS } from "../src/qa-admin.mjs";

const DAY = 86400;
// PNG signature plus the IHDR chunk header: the worker sniffs both (report-input.mjs).
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 73, 72, 68, 82, 1, 2, 3];

async function people() {
  const { env, ctx } = await createHarness();
  const admin = await seedAccount(env, { email: "owner@gmail.com", method: "google" });
  const tester = await seedAccount(env, { email: "qa@example.test" });
  await sql(env, "INSERT INTO account_roles (account_id, role, created_at) VALUES (?1, 'tester', ?2)", tester.account.id, NOW - 10);
  const learner = await seedAccount(env, { email: "ana@example.test" });
  return { env, ctx, admin, tester, learner };
}

function session(patch) {
  return {
    sessionId: "qs_AAAAAAAAAAAAAAAAAAAA",
    alias: "Lucía",
    startedAt: NOW - 3600,
    lastActiveAt: NOW - 60,
    activeSeconds: 1800,
    sections: { setup: 900, "python-basics": 600 },
    issuesCreated: 3,
    issuesSent: 2,
    deploymentSha: "abc1234",
    browser: "safari",
    ...(patch || {})
  };
}

const postSession = (env, who, body) => api(env, "POST", "/v1/qa/sessions", { cookie: who.token, body });

async function raw(env, path, token) {
  const { handleRequest } = await import("../src/index.mjs");
  const res = await handleRequest(new Request(`${API_BASE}${path}`, { headers: { Origin: APP_ORIGIN, Cookie: `__Host-pa_session=${token}` } }), env, { now: NOW, log: () => {} });
  const bytes = new Uint8Array(await res.arrayBuffer());
  // Response.text() would drop a leading BOM; decode keeping it, so the test can see it.
  return { status: res.status, headers: res.headers, text: new TextDecoder('utf-8', { ignoreBOM: true }).decode(bytes) };
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
    reporterAlias: "Lucía",
    context: { path: "/", hash: "#S07", sectionId: "S07", sectionIndex: 7, viewport: { width: 390, height: 844 }, userAgent: "UA", language: "es", deploymentSha: "abc1234" },
    ...(patch || {})
  };
}

test("a tester's session summary is stored once and only ever grows; a stale copy cannot lower it", async () => {
  const { env, tester } = await people();
  assert.equal((await postSession(env, tester, session())).status, 200);
  assert.equal((await postSession(env, tester, session({ activeSeconds: 2400, lastActiveAt: NOW, issuesCreated: 4, sections: { setup: 1200, "python-basics": 900 } }))).status, 200);
  assert.equal((await postSession(env, tester, session({ activeSeconds: 100, issuesCreated: 1, sections: { setup: 100 } }))).status, 200, "a stale tab");
  const rows = (await env.DB.prepare("SELECT * FROM qa_sessions").all()).results;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].active_seconds, 2400);
  assert.equal(rows[0].issues_created, 4);
  assert.deepEqual(JSON.parse(rows[0].sections), { setup: 1200, "python-basics": 900 }, "the sections of the larger total win");
});

test("only testers and admins send sessions; anything malformed is refused", async () => {
  const { env, learner, admin, tester } = await people();
  assert.equal((await postSession(env, learner, session())).status, 403);
  assert.equal((await postSession(env, admin, session())).status, 200);
  const bad = [
    { extra: 1 },
    { sessionId: "nope" },
    { startedAt: NOW - 31 * DAY, lastActiveAt: NOW - 31 * DAY + 10, activeSeconds: 5, sections: {} },
    { startedAt: NOW + 3600 },
    { lastActiveAt: NOW - 7200 },
    { sections: { setup: 99999 } },
    { sections: { "Bad Id!": 10 } },
    { sections: Object.fromEntries(Array.from({ length: 61 }, (_, i) => [`s${i}`, 1])) },
    { browser: "netscape" },
    { deploymentSha: "<script>" },
    { issuesCreated: -1 }
  ];
  for (const patch of bad) {
    const r = await postSession(env, tester, session(patch));
    assert.deepEqual([r.status, r.body.reason], [400, "bad_session"], JSON.stringify(patch).slice(0, 60));
  }
});

test("admin stats: reports by dimension, sessions with seconds per section and per tester; testers cannot read them", async () => {
  const { env, admin, tester } = await people();
  await api(env, "POST", "/v1/reports", { cookie: tester.token, body: report() });
  await api(env, "POST", "/v1/reports", { cookie: tester.token, body: report({ severity: "low", context: { ...report().context, sectionId: "S09" } }) });
  await postSession(env, tester, session());
  await postSession(env, admin, session({ sessionId: "qs_BBBBBBBBBBBBBBBBBBBB", alias: null, sections: { setup: 300 }, activeSeconds: 300, browser: "chromium" }));
  assert.equal((await api(env, "GET", "/v1/admin/qa/stats", { cookie: tester.token })).status, 403);
  const r = await api(env, "GET", "/v1/admin/qa/stats", { cookie: admin.token });
  assert.equal(r.status, 200);
  assert.equal(r.body.reports.total, 2);
  assert.deepEqual(r.body.reports.severity, [{ key: "high", count: 1 }, { key: "low", count: 1 }]);
  assert.deepEqual(r.body.reports.section.map((s) => s.key).sort(), ["S07", "S09"]);
  assert.deepEqual(r.body.reports.tester, [{ key: "Lucía", count: 2 }]);
  assert.deepEqual(r.body.reports.build, [{ key: "abc1234", count: 2 }]);
  assert.equal(r.body.sessions.count, 2);
  assert.equal(r.body.sessions.testers, 2);
  assert.equal(r.body.sessions.activeSeconds, 2100);
  assert.deepEqual(r.body.sessions.sections, [{ key: "setup", seconds: 1200 }, { key: "python-basics", seconds: 600 }]);
  assert.equal(r.body.sessions.perTester[0].email, "qa@example.test");
  assert.equal((await api(env, "GET", "/v1/admin/qa/stats?from=2027-02-01&to=2027-01-01", { cookie: admin.token })).body.reason, "bad_range");
  assert.equal((await api(env, "GET", "/v1/admin/qa/stats?from=2025-01-01&to=2027-01-15", { cookie: admin.token })).body.reason, "bad_range", "over 366 days");
});

test("CSV export: a download, every cell quoted and formula triggers disarmed, accents kept", async () => {
  const { env, admin, tester } = await people();
  await api(env, "POST", "/v1/reports", { cookie: tester.token, body: report({ title: '=HYPERLINK("http://evil","x")', description: 'dice "hola", y sigue\nen otra línea', reporterAlias: "@root" }) });
  const r = await raw(env, "/v1/admin/qa/export?format=csv", admin.token);
  assert.equal(r.status, 200);
  assert.match(r.headers.get("content-disposition"), /^attachment; filename="pyarcana-qa-\d{4}-\d\d-\d\d\.csv"$/);
  assert.match(r.headers.get("content-type"), /^text\/csv/);
  assert.equal(r.headers.get("access-control-expose-headers"), "content-disposition, x-pyarcana-partial", "fetch can read the name and the flag");
  assert.equal(r.headers.get("access-control-allow-origin"), APP_ORIGIN);
  assert.equal(r.headers.get("x-content-type-options"), "nosniff");
  assert.ok(r.text.startsWith("﻿\"id\",\"created_at\""), "BOM and header");
  assert.ok(r.text.includes('"\'=HYPERLINK(""http://evil"",""x"")"'), "formula disarmed, quotes doubled");
  assert.ok(r.text.includes('"\'@root"'));
  assert.ok(r.text.includes('"dice ""hola"", y sigue\nen otra línea"'));
  assert.equal((await raw(env, "/v1/admin/qa/export?format=csv", tester.token)).status, 403);
  assert.equal((await raw(env, "/v1/admin/qa/export?format=xml", admin.token)).status, 400);
  for (const [v, want] of [["=1", "\"'=1\""], ["+1", "\"'+1\""], ["-1", "\"'-1\""], ["\t1", "\"'\t1\""], ["1", '"1"'], [null, '""']]) assert.equal(csvCell(v), want);
});

test("JSON export: the QA workspace's own package, with the screenshot and the sessions", async () => {
  const { env, admin, tester } = await people();
  const png = new Uint8Array(64);
  png.set(PNG);
  const sent = await api(env, "POST", "/v1/reports", { cookie: tester.token, body: report({ clientIssueId: "6f1c2b9e-3a4d-4e5f-8a6b-7c8d9e0f1a2b", attachments: [{ mime: "image/png", data: Buffer.from(png).toString("base64") }] }) });
  assert.deepEqual([sent.status, sent.body.attachments], [201, 1], JSON.stringify(sent.body));
  await postSession(env, tester, session());
  await sql(env, "UPDATE reports SET status = 'fixed'");
  const r = await raw(env, "/v1/admin/qa/export?format=json", admin.token);
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("x-pyarcana-partial"), "0");
  const pkg = JSON.parse(r.text);
  assert.equal(pkg.schemaVersion, "pyarcana.qa.v1");
  assert.equal(pkg.issueCount, 1);
  const issue = pkg.issues[0];
  assert.equal(issue.id, "6f1c2b9e-3a4d-4e5f-8a6b-7c8d9e0f1a2b", "the tester's own id, so re-importing merges instead of duplicating");
  assert.equal(issue.status, "resolved");
  assert.equal(issue.reproductionSteps, "1. Abrir S07");
  assert.equal(issue.context.sectionIndex, 7);
  assert.match(issue.remoteId, /^rep_/);
  assert.deepEqual([...Buffer.from(issue.screenshotDataUrl.split(",")[1], "base64")], [...png], "the screenshot round-trips byte for byte");
  assert.equal(pkg.sessions.length, 1);
  assert.equal(pkg.sessions[0].activeSeconds, 1800);
  assert.ok(EXPORT_MAX_REPORTS >= 100);
});

test("JSON export always fits the QA workspace's importer: screenshots past the room are left out and flagged", async () => {
  const { env, admin, tester } = await people();
  const sent = await api(env, "POST", "/v1/reports", { cookie: tester.token, body: report() });
  assert.equal(sent.status, 201);
  // 16 reports, each with a 1 MB screenshot: about 22 million characters of base64, past the room.
  await sql(env, "CREATE TABLE tmp_r AS SELECT * FROM reports");
  const cols = (await env.DB.prepare("SELECT name FROM pragma_table_info('reports')").all()).results.map((r) => r.name);
  const rest = cols.filter((c) => c !== "id" && c !== "client_issue_id");
  for (let i = 0; i < 15; i++) {
    await sql(env, `INSERT INTO reports (id, client_issue_id, ${rest.join(", ")}) SELECT ?1, NULL, ${rest.join(", ")} FROM tmp_r`, `rep_clone${String(i).padStart(2, "0")}`);
  }
  const big = new Uint8Array(1024 * 1024);
  big.set(PNG);
  const ids = (await env.DB.prepare("SELECT id FROM reports").all()).results.map((r) => r.id);
  for (const [i, id] of ids.entries()) {
    await sql(env, "INSERT INTO report_attachments (id, report_id, mime, bytes, created_at) VALUES (?1, ?2, 'image/png', ?3, ?4)", `att_${i}`, id, big, NOW);
  }
  const r = await raw(env, "/v1/admin/qa/export?format=json", admin.token);
  assert.equal(r.status, 200);
  // src/lib/qa-session.ts MAX_PACKAGE_CHARACTERS: the importer refuses a longer file.
  assert.ok(r.text.length <= 16 * 1024 * 1024, `${r.text.length} characters`);
  assert.ok(r.text.length <= EXPORT_MAX_CHARS);
  assert.equal(r.headers.get("x-pyarcana-partial"), "1");
  const pkg = JSON.parse(r.text);
  assert.equal(pkg.issueCount, 16, "every report's text still fits");
  const withShot = pkg.issues.filter((x) => x.screenshotDataUrl).length;
  assert.ok(withShot >= 10 && withShot < 16, `${withShot} screenshots`);
  assert.equal(pkg.partial, true);
  assert.equal(pkg.tester, "", "importing does not rename the importer");
});

test("sessions: swept 1 year after last activity, deleted with the account, included in the account export", async () => {
  const { env, ctx, tester } = await people();
  await postSession(env, tester, session());
  await sql(env, "INSERT INTO qa_sessions (account_id, session_id, started_at, last_active_at, browser, updated_at) VALUES (?1, 'qs_old', ?2, ?3, 'other', ?3)", tester.account.id, NOW - 400 * DAY, NOW - QA_SESSION_DAYS * DAY - 1);
  const counts = await sweepRetention(ctx);
  assert.equal(counts.qaSessions, 1);
  assert.equal(await env.DB.prepare("SELECT COUNT(*) AS c FROM qa_sessions").first("c"), 1);
  const exported = await api(env, "GET", "/v1/me/export", { cookie: tester.token });
  assert.equal(exported.body.qaSessions.length, 1);
  assert.equal(exported.body.qaSessions[0].alias, "Lucía");
  const del = await api(env, "DELETE", "/v1/me", { cookie: tester.token, body: { confirm: "DELETE" } });
  assert.equal(del.status, 200, JSON.stringify(del.body));
  assert.equal(await env.DB.prepare("SELECT COUNT(*) AS c FROM qa_sessions").first("c"), 0);
});
