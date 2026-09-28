/**
 * schema.mjs: numbered migrations applied in ONE batch guarded by
 * schema_meta.version, memoised per isolate, safe under a cross-isolate race.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { MIGRATIONS, SCHEMA_VERSION, applyMigrations, currentVersion, migrate, resetSchemaMemo } from "../src/schema.mjs";
import { createD1 } from "./d1-fake.mjs";

const EXPECTED_TABLES = [
  "account_roles",
  "accounts",
  "audit_log",
  "charges",
  "checkouts",
  "grants",
  "identities",
  "login_codes",
  "progress",
  "rate_limits",
  "report_attachments",
  "reports",
  "schema_meta",
  "sessions",
  "subscription_events",
  "subscriptions",
  "trial_claims",
  "webhook_events"
];

/**
 * Table names in the database, excluding SQLite internals.
 * @param {Object} db D1 fake.
 * @returns {Promise<string[]>} Sorted names.
 */
async function tables(db) {
  const rows = await db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
    .all();
  return rows.results.map((r) => r.name);
}

/**
 * Column names of one table.
 * @param {Object} db D1 fake.
 * @param {string} table Table name.
 * @returns {Promise<Map<string, Object>>} Column info by name.
 */
async function columns(db, table) {
  const rows = (await db.prepare(`PRAGMA table_info(${table})`).all()).results;
  return new Map(rows.map((r) => [r.name, r]));
}

/**
 * A migrated database.
 * @returns {Promise<Object>} D1 fake.
 */
async function migrated() {
  resetSchemaMemo();
  const db = createD1();
  await migrate(db);
  return db;
}

test("migration 1 creates every table in DESIGN-v2 §2 plus the v3 tables", async () => {
  const db = await migrated();
  assert.deepEqual(await tables(db), EXPECTED_TABLES);
  assert.equal(await currentVersion(db), SCHEMA_VERSION);
  assert.equal(SCHEMA_VERSION, MIGRATIONS.at(-1).version);
});

test("a fresh database reports version 0", async () => {
  assert.equal(await currentVersion(createD1()), 0);
});

test("running migrate twice is a no-op that keeps data", async () => {
  const db = await migrated();
  await db.exec("INSERT INTO rate_limits (bucket, count, window_start) VALUES ('b', 3, 0)");
  resetSchemaMemo();
  const executed = [];
  db.observe((sql) => executed.push(sql));
  await migrate(db);
  assert.equal(executed.length, 1, `only the version read ran: ${executed.join(" | ")}`);
  assert.equal(await db.prepare("SELECT count FROM rate_limits WHERE bucket = 'b'").first("count"), 3);
});

test("migrate is memoised per isolate: a warm call touches the database zero times", async () => {
  const db = await migrated();
  const executed = [];
  db.observe((sql) => executed.push(sql));
  await migrate(db);
  await migrate(db);
  assert.equal(executed.length, 0);
});

test("two isolates migrating at once both succeed and the schema lands once", async () => {
  const db = createD1();
  const results = await Promise.all([applyMigrations(db), applyMigrations(db)]);
  assert.equal(results.length, 2);
  assert.equal(await currentVersion(db), SCHEMA_VERSION);
  assert.deepEqual(await tables(db), EXPECTED_TABLES);
  const markers = await db.prepare("SELECT COUNT(*) AS c FROM schema_meta WHERE key LIKE 'migration:%'").first("c");
  assert.equal(markers, MIGRATIONS.length);
});

test("a failing migration rolls back the whole batch and leaves the version unchanged", async () => {
  const db = createD1();
  const broken = [
    { version: 1, statements: ["CREATE TABLE IF NOT EXISTS schema_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)", "CREATE TABLE good (id TEXT)"] },
    { version: 2, statements: ["CREATE TABL broken (id TEXT)"] }
  ];
  await assert.rejects(() => applyMigrations(db, broken));
  assert.equal(await currentVersion(db), 0);
  assert.ok(!(await tables(db)).includes("good"), "the earlier migration in the same batch was rolled back");
});

test("a later migration applies only its own statements", async () => {
  const db = createD1();
  const v1 = [{ version: 1, statements: ["CREATE TABLE IF NOT EXISTS schema_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)", "CREATE TABLE one (id TEXT)"] }];
  await applyMigrations(db, v1);
  const executed = [];
  db.observe((sql) => executed.push(sql));
  await applyMigrations(db, [...v1, { version: 2, statements: ["ALTER TABLE one ADD COLUMN extra TEXT"] }]);
  assert.equal(await currentVersion(db), 2);
  assert.ok(!executed.some((sql) => sql.includes("CREATE TABLE one")), "v1 did not run again");
  assert.ok((await columns(db, "one")).has("extra"));
});

test("a deleted account's email can be reused; two live accounts cannot share one", async () => {
  const db = await migrated();
  const insert = (id) =>
    db
      .prepare("INSERT INTO accounts (id, email, email_normalized, created_at, updated_at) VALUES (?1, 'a@x.test', 'a@x.test', 1, 1)")
      .bind(id)
      .run();
  await insert("acct_1");
  await assert.rejects(() => insert("acct_2"), /UNIQUE/);
  await db.exec("UPDATE accounts SET deleted_at = 5, email = NULL WHERE id = 'acct_1'");
  await insert("acct_2");
  await assert.rejects(() => insert("acct_3"), /UNIQUE/);
});

test("accounts without a verified email (NULL email_normalized) never collide", async () => {
  const db = await migrated();
  for (const id of ["acct_m1", "acct_m2"]) {
    await db
      .prepare("INSERT INTO accounts (id, email, created_at, updated_at) VALUES (?1, 'same@x.test', 1, 1)")
      .bind(id)
      .run();
  }
  assert.equal(await db.prepare("SELECT COUNT(*) AS c FROM accounts").first("c"), 2);
});

test("grants allow indefinite (NULL) days and refuse out-of-range days or unknown kinds", async () => {
  const db = await migrated();
  await db.exec("INSERT INTO accounts (id, email, email_normalized, created_at, updated_at) VALUES ('acct_g', 'g@x.test', 'g@x.test', 1, 1)");
  const grant = (id, kind, days) =>
    db
      .prepare("INSERT INTO grants (id, account_id, kind, days, created_at) VALUES (?1, 'acct_g', ?2, ?3, 1)")
      .bind(id, kind, days)
      .run();
  await grant("grant_1", "gift", null);
  await grant("grant_2", "tester", 3650);
  await grant("grant_3", "trial", 7);
  await assert.rejects(() => grant("grant_4", "gift", 0), /CHECK/);
  await assert.rejects(() => grant("grant_5", "gift", 3651), /CHECK/);
  await assert.rejects(() => grant("grant_6", "bogus", 7), /CHECK/);
  await assert.rejects(() => grant("grant_7", "trial", null), /CHECK/);
});

test("money columns accept only integer minor units", async () => {
  const db = await migrated();
  await db.exec("INSERT INTO accounts (id, email, email_normalized, created_at, updated_at) VALUES ('acct_c', 'c@x.test', 'c@x.test', 1, 1)");
  const checkout = (id, amount) =>
    db
      .prepare("INSERT INTO checkouts (id, account_id, provider, plan, amount_minor, currency, created_at) VALUES (?1, 'acct_c', 'mercadopago', 'pro_monthly', ?2, 'PEN', 1)")
      .bind(id, amount)
      .run();
  await checkout("chk_1", 1990);
  await assert.rejects(() => checkout("chk_2", 19.9), /CHECK/);
  await assert.rejects(() => checkout("chk_3", "19.90"), /CHECK/);
  // INTEGER affinity turns well-formed integer text into an integer before
  // the CHECK runs, so what is stored is still integer minor units.
  await checkout("chk_4", "1990");
  assert.equal(await db.prepare("SELECT typeof(amount_minor) AS t FROM checkouts WHERE id = 'chk_4'").first("t"), "integer");
});

test("sessions record the sign-in method and renewal time", async () => {
  const db = await migrated();
  const cols = await columns(db, "sessions");
  for (const name of ["id", "account_id", "token_hash", "method", "created_at", "renewed_at", "expires_at", "revoked_at"]) {
    assert.ok(cols.has(name), name);
  }
  await db.exec("INSERT INTO accounts (id, email, email_normalized, created_at, updated_at) VALUES ('acct_s', 's@x.test', 's@x.test', 1, 1)");
  await assert.rejects(
    () =>
      db
        .prepare("INSERT INTO sessions (id, account_id, token_hash, method, created_at, renewed_at, expires_at) VALUES ('s1', 'acct_s', 'h', 'password', 1, 1, 2)")
        .run(),
    /CHECK/
  );
});

test("report attachments hold at most 1 MiB of an allowed image type", async () => {
  const db = await migrated();
  await db.exec("INSERT INTO reports (id, created_at, updated_at, source, status, title) VALUES ('rep_1', 1, 1, 'qa_harness', 'new', 't')");
  const attach = (id, mime, size) =>
    db
      .prepare("INSERT INTO report_attachments (id, report_id, mime, bytes, created_at) VALUES (?1, 'rep_1', ?2, ?3, 1)")
      .bind(id, mime, new Uint8Array(size))
      .run();
  await attach("att_1", "image/png", 1024);
  await assert.rejects(() => attach("att_2", "image/svg+xml", 10), /CHECK/);
  await assert.rejects(() => attach("att_3", "image/png", 1048577), /CHECK/);
});

test("reports are idempotent per (account_id, client_issue_id)", async () => {
  const db = await migrated();
  await db.exec("INSERT INTO accounts (id, email, email_normalized, created_at, updated_at) VALUES ('acct_r', 'r@x.test', 'r@x.test', 1, 1)");
  const report = (id) =>
    db
      .prepare("INSERT INTO reports (id, created_at, updated_at, account_id, source, status, title, client_issue_id) VALUES (?1, 1, 1, 'acct_r', 'qa_harness', 'new', 't', 'issue-1')")
      .bind(id)
      .run();
  await report("rep_a");
  await assert.rejects(() => report("rep_b"), /UNIQUE/);
});

test("migration 2 adds reports.improvement, and a version-1 database upgrades in place keeping its rows", async () => {
  resetSchemaMemo();
  const db = createD1();
  await applyMigrations(db, MIGRATIONS.slice(0, 1));
  assert.equal(await currentVersion(db), 1);
  await db.exec("INSERT INTO reports (id, created_at, updated_at, source, status, title) VALUES ('rep_old', 1, 1, 'feedback', 'new', 'kept')");
  assert.equal((await columns(db, "reports")).has("improvement"), false);
  resetSchemaMemo();
  await migrate(db);
  assert.equal(await currentVersion(db), 2);
  assert.equal((await columns(db, "reports")).has("improvement"), true);
  assert.equal(await db.prepare("SELECT title FROM reports WHERE id = 'rep_old'").first("title"), "kept");
  resetSchemaMemo();
  await migrate(db);
  assert.equal(await currentVersion(db), 2, "running again is a no-op");
});
