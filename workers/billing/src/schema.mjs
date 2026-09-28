/**
 * D1 schema as numbered migrations (DESIGN-v2 §2 + DESIGN-v3 roles/reports).
 *
 * `migrate(db)` reads schema_meta.version and applies every pending migration
 * in ONE `db.batch` (one transaction), bumping the version in the same batch.
 * Each pending migration first inserts a `migration:<n>` marker row: two
 * isolates that race on a cold database both try it, the second one's batch
 * fails on that primary key and rolls back whole, and it then re-reads the
 * version and finds the work done. So an `ALTER TABLE` in a later migration
 * can never run twice.
 *
 * Conventions: times are INTEGER epoch seconds, money is INTEGER minor units
 * (enforced by CHECK typeof = 'integer'). Enum CHECKs are used only where the
 * set is fixed by the design; statuses owned by later stages are validated in
 * code, because changing a CHECK in SQLite needs a table rebuild.
 *
 * The src directory stays flat: .gitignore ignores unanchored `db/`.
 */

const INT_MONEY = (column) => `${column} INTEGER NOT NULL CHECK (typeof(${column}) = 'integer')`;

/** Migration 1: every table the design needs, created together. */
const MIGRATION_1 = [
  `CREATE TABLE IF NOT EXISTS schema_meta (
     key TEXT PRIMARY KEY,
     value TEXT NOT NULL
   )`,

  // email_normalized is set only for an address someone proved (email code,
  // Google email_verified) or an admin typed; a Microsoft-only account keeps
  // its claimed address in `email` for display with email_normalized NULL, so
  // an unproven claim can never occupy (pre-hijack) somebody's address.
  `CREATE TABLE IF NOT EXISTS accounts (
     id TEXT PRIMARY KEY,
     email TEXT,
     email_normalized TEXT,
     email_verified INTEGER NOT NULL DEFAULT 0,
     display_name TEXT,
     locale TEXT,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL,
     first_signin_at INTEGER,
     terms_version TEXT,
     age_confirmed_at INTEGER,
     trial_used_at INTEGER,
     disabled_at INTEGER,
     disabled_reason TEXT,
     deleted_at INTEGER,
     email_hmac TEXT
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS ux_accounts_email_live
     ON accounts (email_normalized) WHERE deleted_at IS NULL`,

  `CREATE TABLE IF NOT EXISTS identities (
     provider TEXT NOT NULL CHECK (provider IN ('google', 'microsoft', 'email')),
     subject TEXT NOT NULL,
     account_id TEXT NOT NULL REFERENCES accounts (id),
     email_at_link TEXT,
     created_at INTEGER NOT NULL,
     PRIMARY KEY (provider, subject)
   )`,
  `CREATE INDEX IF NOT EXISTS idx_identities_account ON identities (account_id)`,

  `CREATE TABLE IF NOT EXISTS sessions (
     id TEXT PRIMARY KEY,
     account_id TEXT NOT NULL REFERENCES accounts (id),
     token_hash TEXT NOT NULL UNIQUE,
     method TEXT NOT NULL CHECK (method IN ('google', 'microsoft', 'email')),
     created_at INTEGER NOT NULL,
     renewed_at INTEGER NOT NULL,
     expires_at INTEGER NOT NULL,
     revoked_at INTEGER
   )`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_account ON sessions (account_id)`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions (expires_at)`,

  `CREATE TABLE IF NOT EXISTS login_codes (
     id TEXT PRIMARY KEY,
     email_normalized TEXT NOT NULL,
     code_hmac TEXT NOT NULL,
     created_at INTEGER NOT NULL,
     expires_at INTEGER NOT NULL,
     consumed_at INTEGER,
     attempts INTEGER NOT NULL DEFAULT 0
   )`,
  `CREATE INDEX IF NOT EXISTS idx_login_codes_email ON login_codes (email_normalized, created_at)`,

  // Survives account deletion on purpose (anti-abuse); the privacy page says so.
  `CREATE TABLE IF NOT EXISTS trial_claims (
     key TEXT PRIMARY KEY,
     claimed_at INTEGER NOT NULL
   )`,

  // days NULL = indefinite (DESIGN-v3): runs until revoked.
  `CREATE TABLE IF NOT EXISTS grants (
     id TEXT PRIMARY KEY,
     account_id TEXT NOT NULL REFERENCES accounts (id),
     kind TEXT NOT NULL CHECK (kind IN ('trial', 'gift', 'tester')),
     days INTEGER CHECK (days IS NULL OR (typeof(days) = 'integer' AND days BETWEEN 1 AND 3650)),
     created_at INTEGER NOT NULL,
     note TEXT,
     issued_by TEXT,
     request_id TEXT,
     revoked_at INTEGER,
     revoked_by TEXT,
     revoke_reason TEXT,
     CHECK (kind <> 'trial' OR days IS NOT NULL),
     UNIQUE (issued_by, request_id)
   )`,
  `CREATE INDEX IF NOT EXISTS idx_grants_account ON grants (account_id)`,
  `CREATE INDEX IF NOT EXISTS idx_grants_kind_created ON grants (kind, created_at)`,

  `CREATE TABLE IF NOT EXISTS checkouts (
     id TEXT PRIMARY KEY,
     account_id TEXT NOT NULL REFERENCES accounts (id),
     provider TEXT NOT NULL,
     plan TEXT NOT NULL,
     ${INT_MONEY("amount_minor")},
     currency TEXT NOT NULL,
     provider_ref TEXT,
     country TEXT,
     created_at INTEGER NOT NULL,
     status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'completed', 'expired')),
     UNIQUE (provider, provider_ref)
   )`,
  `CREATE INDEX IF NOT EXISTS idx_checkouts_account ON checkouts (account_id)`,

  `CREATE TABLE IF NOT EXISTS subscriptions (
     id TEXT PRIMARY KEY,
     account_id TEXT NOT NULL REFERENCES accounts (id),
     provider TEXT NOT NULL,
     provider_ref TEXT NOT NULL,
     plan TEXT NOT NULL,
     ${INT_MONEY("amount_minor")},
     currency TEXT NOT NULL,
     status TEXT NOT NULL,
     cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
     first_active_at INTEGER,
     provider_updated_at INTEGER,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL,
     checkout_id TEXT REFERENCES checkouts (id),
     UNIQUE (provider, provider_ref)
   )`,
  `CREATE INDEX IF NOT EXISTS idx_subscriptions_account ON subscriptions (account_id)`,

  `CREATE TABLE IF NOT EXISTS charges (
     id TEXT PRIMARY KEY,
     provider TEXT NOT NULL,
     provider_charge_id TEXT NOT NULL,
     subscription_id TEXT REFERENCES subscriptions (id),
     account_id TEXT REFERENCES accounts (id),
     ${INT_MONEY("amount_minor")},
     currency TEXT NOT NULL,
     status TEXT NOT NULL,
     approved_at INTEGER,
     period_start INTEGER,
     period_end INTEGER,
     refunded_at INTEGER,
     charged_back_at INTEGER,
     flag TEXT,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL,
     UNIQUE (provider, provider_charge_id)
   )`,
  `CREATE INDEX IF NOT EXISTS idx_charges_subscription ON charges (subscription_id)`,
  `CREATE INDEX IF NOT EXISTS idx_charges_account ON charges (account_id)`,

  `CREATE TABLE IF NOT EXISTS subscription_events (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     subscription_id TEXT,
     account_id TEXT,
     provider TEXT NOT NULL,
     kind TEXT NOT NULL,
     detail TEXT,
     created_at INTEGER NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS idx_subscription_events_sub ON subscription_events (subscription_id)`,

  // Kept indefinitely: Creem signatures carry no timestamp (replay window).
  `CREATE TABLE IF NOT EXISTS webhook_events (
     provider TEXT NOT NULL,
     event_id TEXT NOT NULL,
     received_at INTEGER NOT NULL,
     processed_at INTEGER,
     PRIMARY KEY (provider, event_id)
   )`,

  `CREATE TABLE IF NOT EXISTS progress (
     account_id TEXT PRIMARY KEY REFERENCES accounts (id),
     rev INTEGER NOT NULL,
     doc TEXT NOT NULL,
     size_bytes INTEGER NOT NULL,
     updated_at INTEGER NOT NULL
   )`,

  // bucket = HMAC(pepper, name): no email or IP is stored in clear.
  `CREATE TABLE IF NOT EXISTS rate_limits (
     bucket TEXT PRIMARY KEY,
     count INTEGER NOT NULL,
     window_start INTEGER NOT NULL
   )`,

  `CREATE TABLE IF NOT EXISTS audit_log (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     actor_account_id TEXT,
     action TEXT NOT NULL,
     target_account_id TEXT,
     target_id TEXT,
     detail TEXT,
     created_at INTEGER NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS idx_audit_target ON audit_log (target_account_id)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log (created_at)`,

  // Admin is NOT a stored role (ADMIN_EMAILS + fresh Google session).
  `CREATE TABLE IF NOT EXISTS account_roles (
     account_id TEXT NOT NULL REFERENCES accounts (id),
     role TEXT NOT NULL,
     granted_by TEXT,
     created_at INTEGER NOT NULL,
     expires_at INTEGER,
     revoked_at INTEGER,
     revoked_by TEXT,
     revoke_reason TEXT,
     note TEXT,
     PRIMARY KEY (account_id, role, created_at)
   )`,
  `CREATE INDEX IF NOT EXISTS idx_account_roles_role ON account_roles (role)`,

  `CREATE TABLE IF NOT EXISTS reports (
     id TEXT PRIMARY KEY,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL,
     account_id TEXT REFERENCES accounts (id),
     reporter_alias TEXT,
     contact_email TEXT,
     source TEXT NOT NULL,
     category TEXT,
     cause TEXT,
     severity TEXT,
     status TEXT NOT NULL DEFAULT 'new',
     title TEXT NOT NULL,
     description TEXT,
     steps TEXT,
     expected TEXT,
     actual TEXT,
     context TEXT,
     admin_note TEXT,
     duplicate_of TEXT,
     client_issue_id TEXT,
     UNIQUE (account_id, client_issue_id)
   )`,
  `CREATE INDEX IF NOT EXISTS idx_reports_status_created ON reports (status, created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_reports_account ON reports (account_id)`,

  `CREATE TABLE IF NOT EXISTS report_attachments (
     id TEXT PRIMARY KEY,
     report_id TEXT NOT NULL REFERENCES reports (id),
     mime TEXT NOT NULL CHECK (mime IN ('image/png', 'image/jpeg', 'image/webp')),
     bytes BLOB NOT NULL CHECK (length(bytes) <= 1048576),
     created_at INTEGER NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS idx_report_attachments_report ON report_attachments (report_id)`
];

/**
 * Migration 2: the QA harness's "improvement" field (what the tester
 * suggests), which DESIGN-v3's reports table left out; without it a sent
 * issue would lose part of what the tester wrote.
 */
const MIGRATION_2 = ["ALTER TABLE reports ADD COLUMN improvement TEXT"];

/** Every migration, in order. Append only; never edit a shipped one. */
export const MIGRATIONS = [
  { version: 1, statements: MIGRATION_1 },
  { version: 2, statements: MIGRATION_2 }
];

/** The version a fully migrated database reports. */
export const SCHEMA_VERSION = MIGRATIONS[MIGRATIONS.length - 1].version;

const META_TABLE = "CREATE TABLE IF NOT EXISTS schema_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)";

/**
 * The schema version stored in the database (0 before any migration).
 * @param {Object} db D1 binding.
 * @returns {Promise<number>} Version.
 */
export async function currentVersion(db) {
  try {
    const value = await db.prepare("SELECT value FROM schema_meta WHERE key = 'version'").first("value");
    return Number(value) || 0;
  } catch (error) {
    if (/no such table/i.test(String(error && error.message))) {
      return 0;
    }
    throw error;
  }
}

/**
 * Build the one batch that applies the pending migrations.
 * @param {Object} db D1 binding.
 * @param {Object[]} pending Migrations to apply.
 * @param {number} target Version after the batch.
 * @returns {Object[]} Prepared statements.
 */
function buildBatch(db, pending, target) {
  const statements = [db.prepare(META_TABLE)];
  for (const migration of pending) {
    statements.push(
      db
        .prepare("INSERT INTO schema_meta (key, value) VALUES (?1, CAST(strftime('%s', 'now') AS TEXT))")
        .bind(`migration:${migration.version}`)
    );
    for (const sql of migration.statements) {
      statements.push(db.prepare(sql));
    }
  }
  statements.push(
    db
      .prepare("INSERT INTO schema_meta (key, value) VALUES ('version', ?1) ON CONFLICT (key) DO UPDATE SET value = excluded.value")
      .bind(String(target))
  );
  return statements;
}

/**
 * Apply every pending migration in one batch (no memo).
 * @param {Object} db D1 binding.
 * @param {Object[]} [migrations] Migration list (tests pass their own).
 * @returns {Promise<{from: number, to: number}>} Versions.
 */
export async function applyMigrations(db, migrations = MIGRATIONS) {
  const target = migrations[migrations.length - 1].version;
  const from = await currentVersion(db);
  const pending = migrations.filter((m) => m.version > from);
  if (!pending.length) {
    return { from, to: from };
  }
  try {
    await db.batch(buildBatch(db, pending, target));
  } catch (error) {
    // Another isolate may have won the race; its batch did the work.
    if ((await currentVersion(db)) >= target) {
      return { from, to: target };
    }
    throw error;
  }
  return { from, to: target };
}

/** Isolate-local memo: one in-flight or finished migration per binding. */
let memo = new WeakMap();

/**
 * Make sure the schema is current. Cheap after the first call per isolate.
 * @param {Object} db D1 binding.
 * @returns {Promise<void>} Resolves when the schema is current.
 */
export async function migrate(db) {
  let pending = memo.get(db);
  if (!pending) {
    pending = applyMigrations(db);
    memo.set(db, pending);
    pending.catch(() => memo.delete(db));
  }
  await pending;
}

/**
 * Forget the memo (tests simulate a fresh isolate with this).
 * @returns {void}
 */
export function resetSchemaMemo() {
  memo = new WeakMap();
}
