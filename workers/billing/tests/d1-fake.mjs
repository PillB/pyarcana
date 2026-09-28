/**
 * A D1-shaped adapter over Node's built-in SQLite (Node >= 22.13).
 *
 * Ported from the Vocal Studio worker's fake, with four corrections, each
 * pinned by d1-fake.test.mjs:
 * - binding `undefined` throws D1_TYPE_ERROR, as D1 does (the original coerced
 *   it to NULL and so hid bugs production would hit);
 * - BLOBs bind from Uint8Array or ArrayBuffer and read back as number arrays;
 * - `run()` and `batch()` return RETURNING rows in `results`, as D1 does;
 * - `batch()` runs synchronously, so a concurrent request's statement can
 *   never land inside (and roll back with) another request's transaction.
 *
 * UNVERIFIED against live D1 (docs egress-blocked while writing this): the
 * BLOB read shape and the exact error text. Production code must accept any
 * of Array, ArrayBuffer or Uint8Array for a BLOB column.
 *
 * Concurrency model: every statement is atomic, and an `await` between two
 * statements lets other in-flight requests run theirs. That is exactly the
 * interleaving a read-then-write race needs, so `Promise.all` over the fake
 * reproduces lost updates that a real D1 would show.
 */

import { DatabaseSync } from "node:sqlite";

/**
 * Convert one bound value the way D1 does.
 * @param {unknown} value Bound value.
 * @returns {string|number|null|Uint8Array} A value SQLite accepts.
 */
function coerce(value) {
  if (value === undefined) {
    throw new TypeError("D1_TYPE_ERROR: Type 'undefined' not supported for value 'undefined'");
  }
  if (value === null) {
    return null;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }
  return value;
}

/**
 * Turn a node:sqlite row into a plain object with D1-shaped BLOBs.
 * @param {Object} row Row from node:sqlite.
 * @returns {Object} Plain row.
 */
function plainRow(row) {
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    out[key] = value instanceof Uint8Array ? Array.from(value) : value;
  }
  return out;
}

/** One prepared statement, optionally already bound. */
class FakeD1PreparedStatement {
  /**
   * @param {FakeD1Database} owner Database wrapper.
   * @param {string} sql SQL text.
   * @param {unknown[]} params Bound parameters.
   */
  constructor(owner, sql, params) {
    this.owner = owner;
    this.sql = sql;
    this.params = params;
  }

  /**
   * Bind parameters, returning a new statement (D1 statements are immutable).
   * @param {...unknown} values Parameter values in order.
   * @returns {FakeD1PreparedStatement} Bound statement.
   */
  bind(...values) {
    return new FakeD1PreparedStatement(this.owner, this.sql, values);
  }

  /**
   * Execute synchronously and return rows plus the change count.
   * @returns {{rows: Object[], changes: number, lastRowId: number}} Outcome.
   */
  execute() {
    const params = this.params.map(coerce);
    const statement = this.owner.db.prepare(this.sql);
    let rows;
    let changes = 0;
    let lastRowId = 0;
    if (statement.columns().length > 0) {
      rows = statement.all(...params).map(plainRow);
      changes = Number(this.owner.db.prepare("SELECT changes() AS c").get().c);
    } else {
      const info = statement.run(...params);
      rows = [];
      changes = Number(info.changes || 0);
      lastRowId = Number(info.lastInsertRowid || 0);
    }
    this.owner.notify(this.sql, rows);
    return { rows, changes, lastRowId };
  }

  /**
   * D1-shaped result object.
   * @returns {{results: Object[], success: boolean, meta: Object}} Result.
   */
  runSync() {
    const outcome = this.execute();
    return {
      results: outcome.rows,
      success: true,
      meta: { changes: outcome.changes, last_row_id: outcome.lastRowId, rows_read: outcome.rows.length }
    };
  }

  /**
   * First row, or one column of it.
   * @param {string} [column] Column name.
   * @returns {Promise<Object|unknown|null>} Row, value, or null.
   */
  async first(column) {
    const { rows } = this.execute();
    if (!rows.length) {
      return null;
    }
    return column === undefined ? rows[0] : rows[0][column];
  }

  /**
   * All rows.
   * @returns {Promise<{results: Object[], success: boolean, meta: Object}>} D1-shaped result.
   */
  async all() {
    return this.runSync();
  }

  /**
   * Execute a statement; RETURNING rows are included, as in D1.
   * @returns {Promise<{results: Object[], success: boolean, meta: Object}>} D1-shaped result.
   */
  async run() {
    return this.runSync();
  }
}

/** A D1-shaped database backed by an in-memory SQLite file. */
export class FakeD1Database {
  constructor() {
    this.db = new DatabaseSync(":memory:");
    this.db.exec("PRAGMA foreign_keys = ON");
    this.observers = [];
  }

  /**
   * Register a callback for every executed statement (test instrumentation).
   * @param {function(string, Object[]): void} callback Receives SQL and rows.
   * @returns {void}
   */
  observe(callback) {
    this.observers.push(callback);
  }

  /**
   * Tell observers a statement ran.
   * @param {string} sql SQL text.
   * @param {Object[]} rows Rows returned.
   * @returns {void}
   */
  notify(sql, rows) {
    for (const callback of this.observers) {
      callback(sql, rows);
    }
  }

  /**
   * Prepare a statement.
   * @param {string} sql SQL text.
   * @returns {FakeD1PreparedStatement} Statement.
   */
  prepare(sql) {
    return new FakeD1PreparedStatement(this, sql, []);
  }

  /**
   * Run statements as one transaction, synchronously, like D1's batch.
   * @param {FakeD1PreparedStatement[]} statements Prepared statements.
   * @returns {Promise<Object[]>} Per-statement results.
   */
  async batch(statements) {
    this.db.exec("BEGIN");
    try {
      const out = statements.map((statement) => statement.runSync());
      this.db.exec("COMMIT");
      return out;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  /**
   * Execute raw SQL (test setup only; the worker uses prepare/batch).
   * @param {string} sql One or more statements.
   * @returns {Promise<{count: number}>} D1-shaped result.
   */
  async exec(sql) {
    this.db.exec(sql);
    return { count: 0 };
  }
}

/**
 * Build a fresh D1 fake.
 * @returns {FakeD1Database} Empty database.
 */
export function createD1() {
  return new FakeD1Database();
}
