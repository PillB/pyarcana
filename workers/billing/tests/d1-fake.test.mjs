/**
 * The D1 fake is the ground every storage test stands on, so its own
 * semantics are pinned here: if the fake were more forgiving than D1, a test
 * could pass on a bug production would hit.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { createD1 } from "./d1-fake.mjs";

test("binding undefined is refused, as D1 refuses it", async () => {
  const db = createD1();
  await db.exec("CREATE TABLE t (a TEXT)");
  await assert.rejects(
    () => db.prepare("INSERT INTO t (a) VALUES (?1)").bind(undefined).run(),
    /D1_TYPE_ERROR/
  );
});

test("booleans bind as integers", async () => {
  const db = createD1();
  await db.exec("CREATE TABLE t (a INTEGER)");
  await db.prepare("INSERT INTO t (a) VALUES (?1)").bind(true).run();
  assert.equal(await db.prepare("SELECT a FROM t").first("a"), 1);
});

test("BLOBs bind from Uint8Array or ArrayBuffer and read back as number arrays", async () => {
  const db = createD1();
  await db.exec("CREATE TABLE t (id TEXT, b BLOB)");
  await db.prepare("INSERT INTO t VALUES ('u', ?1)").bind(new Uint8Array([1, 2, 3])).run();
  await db.prepare("INSERT INTO t VALUES ('a', ?1)").bind(new Uint8Array([4, 5]).buffer).run();
  const rows = (await db.prepare("SELECT id, b, length(b) AS n FROM t ORDER BY id").all()).results;
  assert.deepEqual(rows, [
    { id: "a", b: [4, 5], n: 2 },
    { id: "u", b: [1, 2, 3], n: 3 }
  ]);
});

test("UPDATE ... RETURNING yields every changed row through all(), run() and batch()", async () => {
  const db = createD1();
  await db.exec("CREATE TABLE t (id TEXT PRIMARY KEY, n INTEGER)");
  await db.exec("INSERT INTO t VALUES ('a', 0), ('b', 0), ('c', 9)");
  const viaAll = await db.prepare("UPDATE t SET n = n + 1 WHERE n < 5 RETURNING id, n").all();
  assert.deepEqual(viaAll.results.map((r) => r.id).sort(), ["a", "b"]);
  assert.equal(viaAll.meta.changes, 2);
  const viaRun = await db.prepare("UPDATE t SET n = n + 1 WHERE id = 'a' RETURNING n").run();
  assert.deepEqual(viaRun.results, [{ n: 2 }]);
  assert.equal(viaRun.meta.changes, 1);
  const [batched] = await db.batch([db.prepare("UPDATE t SET n = 0 WHERE id = 'c' RETURNING id")]);
  assert.deepEqual(batched.results, [{ id: "c" }]);
});

test("a batch is one transaction: a failing statement rolls back the earlier ones", async () => {
  const db = createD1();
  await db.exec("CREATE TABLE t (id TEXT PRIMARY KEY)");
  await assert.rejects(() =>
    db.batch([
      db.prepare("INSERT INTO t VALUES ('x')"),
      db.prepare("INSERT INTO t VALUES ('x')")
    ])
  );
  assert.equal(await db.prepare("SELECT COUNT(*) AS c FROM t").first("c"), 0);
});

test("a batch cannot be interleaved by another request's statement", async () => {
  // D1 runs a batch as one unit. If the fake awaited between batch statements,
  // a concurrent statement would run inside (and roll back with) the batch.
  const db = createD1();
  await db.exec("CREATE TABLE t (id TEXT PRIMARY KEY)");
  const failing = db
    .batch([db.prepare("INSERT INTO t VALUES ('a')"), db.prepare("INSERT INTO t VALUES ('a')")])
    .catch(() => "rolled back");
  const other = db.prepare("INSERT INTO t VALUES ('b')").run();
  assert.equal(await failing, "rolled back");
  await other;
  const ids = (await db.prepare("SELECT id FROM t ORDER BY id").all()).results.map((r) => r.id);
  assert.deepEqual(ids, ["b"]);
});

test("statements yield like network round trips, so a read-then-write race loses updates", async () => {
  // Each request does async work first (as the worker's HMAC does), then a
  // SELECT and a dependent UPDATE. On D1 each statement is a round trip, so
  // other requests' statements land in between and increments are lost. The
  // fake must reproduce that, or race tests would pass on racy code.
  const db = createD1();
  await db.exec("CREATE TABLE c (id TEXT PRIMARY KEY, n INTEGER)");
  await db.exec("INSERT INTO c VALUES ('x', 0)");
  const racy = async () => {
    await crypto.subtle.digest("SHA-256", new Uint8Array(8));
    const n = await db.prepare("SELECT n FROM c WHERE id = 'x'").first("n");
    await db.prepare("UPDATE c SET n = ?1 WHERE id = 'x'").bind(n + 1).run();
  };
  await Promise.all(Array.from({ length: 20 }, racy));
  const n = await db.prepare("SELECT n FROM c WHERE id = 'x'").first("n");
  assert.ok(n < 20, `expected lost updates under interleaving, got n=${n}`);
});

test("an atomic increment never loses updates under the same interleaving", async () => {
  const db = createD1();
  await db.exec("CREATE TABLE c (id TEXT PRIMARY KEY, n INTEGER)");
  await db.exec("INSERT INTO c VALUES ('x', 0)");
  const atomic = async () => {
    await crypto.subtle.digest("SHA-256", new Uint8Array(8));
    await db.prepare("UPDATE c SET n = n + 1 WHERE id = 'x'").run();
  };
  await Promise.all(Array.from({ length: 20 }, atomic));
  assert.equal(await db.prepare("SELECT n FROM c WHERE id = 'x'").first("n"), 20);
});

test("foreign keys are enforced, as in D1", async () => {
  const db = createD1();
  await db.exec("CREATE TABLE p (id TEXT PRIMARY KEY)");
  await db.exec("CREATE TABLE c (id TEXT PRIMARY KEY, p TEXT REFERENCES p(id))");
  await assert.rejects(() => db.prepare("INSERT INTO c VALUES ('1', 'missing')").run(), /FOREIGN KEY/);
});

test("first() returns null for no row and a column value when asked", async () => {
  const db = createD1();
  await db.exec("CREATE TABLE t (id TEXT, v TEXT)");
  assert.equal(await db.prepare("SELECT * FROM t").first(), null);
  await db.exec("INSERT INTO t VALUES ('1', 'x')");
  assert.equal(await db.prepare("SELECT v FROM t").first("v"), "x");
});

test("an observer sees every executed statement with its rows", async () => {
  const db = createD1();
  const seen = [];
  db.observe((sql, rows) => seen.push({ sql, rows: rows.length }));
  await db.exec("CREATE TABLE t (id TEXT)");
  await db.prepare("INSERT INTO t VALUES ('1') RETURNING id").run();
  await db.prepare("SELECT id FROM t").all();
  assert.deepEqual(
    seen.map((s) => s.rows),
    [1, 1]
  );
});
