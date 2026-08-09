/**
 * PHASE 1 — Red Tests: Security Invariants
 *
 * These tests verify that the Phase 1 fixes are in place. They check
 * SOURCE CODE patterns (not runtime behavior) so they can run without
 * a database or server.
 *
 * Run: node --import tsx --test tests/adversarial/phase1-security.test.ts
 */

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const REPO_ROOT = join(import.meta.dirname, '..', '..')

function readSrc(rel: string): string {
  return readFileSync(join(REPO_ROOT, rel), 'utf-8')
}

function grepSrc(pattern: string, rel: string): boolean {
  return new RegExp(pattern, 'i').test(readSrc(rel))
}

// ─────────────────────────────────────────────────────────────────────
// 1. db.ts — query logging disabled in production
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: db.ts query logging', () => {
  it('should NOT log queries unconditionally (contradiction #8)', () => {
    const db = readSrc('src/lib/db.ts')
    // The old code had: log: ['query']
    // The new code should have conditional logging
    assert.ok(
      !/log:\s*\['query'\]/.test(db),
      'db.ts still has unconditional query logging — fix: use conditional logConfig'
    )
    assert.ok(
      /production/i.test(db),
      'db.ts should mention production in the logging config'
    )
  })
})

// ─────────────────────────────────────────────────────────────────────
// 2. auth.ts — JWT role refresh (contradiction #16)
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: JWT role refresh', () => {
  it('should re-read role from DB in session callback (contradiction #16)', () => {
    const auth = readSrc('src/lib/auth.ts')
    const sessionCallback = auth.match(/async session\([\s\S]*?\}\s*\}/)
    assert.ok(sessionCallback, 'session callback not found in auth.ts')
    assert.ok(
      /db\.user\.findUnique/.test(sessionCallback[0]),
      'session callback should call db.user.findUnique to re-read role'
    )
  })
})

// ─────────────────────────────────────────────────────────────────────
// 3. schema.prisma — Credential model exists (contradiction #12)
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: Credential normalized to own entity', () => {
  it('should have a Credential model (not just Notification.body)', () => {
    const schema = readSrc('prisma/schema.prisma')
    assert.ok(
      /^model Credential\s/m.test(schema),
      'schema.prisma should have a Credential model'
    )
    assert.ok(
      /model CredentialEvidence/.test(schema),
      'schema.prisma should have CredentialEvidence model'
    )
    assert.ok(
      /model CredentialRevocation/.test(schema),
      'schema.prisma should have CredentialRevocation model'
    )
    // verificationId should be @unique (indexed for exact-match lookup)
    const credModel = schema.match(/model Credential\s+\{[\s\S]*?\}/)
    assert.ok(credModel, 'Credential model block not found')
    assert.ok(
      /verificationId\s+String\s+@unique/.test(credModel[0]),
      'Credential.verificationId should be @unique for exact-match lookup'
    )
  })
})

// ─────────────────────────────────────────────────────────────────────
// 4. schema.prisma — Subscription history (contradiction #13)
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: Subscription history', () => {
  it('should have SubscriptionEvent and SubscriptionPeriod models', () => {
    const schema = readSrc('prisma/schema.prisma')
    assert.ok(
      /model SubscriptionEvent/.test(schema),
      'schema.prisma should have SubscriptionEvent for history'
    )
    assert.ok(
      /model SubscriptionPeriod/.test(schema),
      'schema.prisma should have SubscriptionPeriod for billing periods'
    )
    // SubscriptionEvent should have providerEventId for idempotency
    const eventModel = schema.match(/model SubscriptionEvent\s+\{[\s\S]*?\}/)
    assert.ok(eventModel, 'SubscriptionEvent model not found')
    assert.ok(
      /providerEventId/.test(eventModel[0]),
      'SubscriptionEvent should have providerEventId for idempotency'
    )
  })
})

// ─────────────────────────────────────────────────────────────────────
// 5. schema.prisma — Entitlements
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: Entitlements', () => {
  it('should have an Entitlement model (not just isPro)', () => {
    const schema = readSrc('prisma/schema.prisma')
    assert.ok(
      /model Entitlement/.test(schema),
      'schema.prisma should have an Entitlement model'
    )
    // Should NOT have a boolean isPro field
    assert.ok(
      !/isPro\s+Boolean/.test(schema),
      'schema should not have isPro Boolean — use Entitlement model'
    )
  })
})

// ─────────────────────────────────────────────────────────────────────
// 6. schema.prisma — Outbox for reliable mirror sync
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: Outbox pattern', () => {
  it('should have an OutboxEvent model for reliable mirror sync', () => {
    const schema = readSrc('prisma/schema.prisma')
    assert.ok(
      /model OutboxEvent/.test(schema),
      'schema.prisma should have OutboxEvent for transactional outbox pattern'
    )
    const outboxModel = schema.match(/model OutboxEvent\s+\{[\s\S]*?\}/)
    assert.ok(outboxModel, 'OutboxEvent model not found')
    assert.ok(
      /status\s+String\s+@default\("PENDING"\)/.test(outboxModel[0]),
      'OutboxEvent should have status field with PENDING default'
    )
    assert.ok(
      /attempts\s+Int/.test(outboxModel[0]),
      'OutboxEvent should have attempts counter for retries'
    )
  })
})

// ─────────────────────────────────────────────────────────────────────
// 7. schema.prisma — WebhookEvent for idempotency
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: Webhook idempotency', () => {
  it('should have a WebhookEvent model with providerEventId unique', () => {
    const schema = readSrc('prisma/schema.prisma')
    assert.ok(
      /model WebhookEvent/.test(schema),
      'schema.prisma should have WebhookEvent for idempotent webhook processing'
    )
    const webhookModel = schema.match(/model WebhookEvent\s+\{[\s\S]*?\}/)
    assert.ok(webhookModel, 'WebhookEvent model not found')
    assert.ok(
      /providerEventId\s+String\?\s+@unique/.test(webhookModel[0]),
      'WebhookEvent.providerEventId should be @unique for idempotency'
    )
  })
})

// ─────────────────────────────────────────────────────────────────────
// 8. schema.prisma — SelfCheckAttempt
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: Self-check attempts on server', () => {
  it('should have a SelfCheckAttempt model', () => {
    const schema = readSrc('prisma/schema.prisma')
    assert.ok(
      /model SelfCheckAttempt/.test(schema),
      'schema.prisma should have SelfCheckAttempt to store attempts server-side'
    )
  })
})

// ─────────────────────────────────────────────────────────────────────
// 9. schema.prisma — AdminAuditEvent
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: Admin audit trail', () => {
  it('should have an AdminAuditEvent model', () => {
    const schema = readSrc('prisma/schema.prisma')
    assert.ok(
      /model AdminAuditEvent/.test(schema),
      'schema.prisma should have AdminAuditEvent for administrative audit trail'
    )
  })
})

// ─────────────────────────────────────────────────────────────────────
// 10. schema.prisma — Data export and account deletion
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: Privacy (export + deletion)', () => {
  it('should have DataExportRequest and AccountDeletionRequest models', () => {
    const schema = readSrc('prisma/schema.prisma')
    assert.ok(
      /model DataExportRequest/.test(schema),
      'schema.prisma should have DataExportRequest for GDPR/ARCO export'
    )
    assert.ok(
      /model AccountDeletionRequest/.test(schema),
      'schema.prisma should have AccountDeletionRequest for GDPR/ARCO deletion'
    )
  })
})

// ─────────────────────────────────────────────────────────────────────
// 11. Versioned migrations (contradiction #3)
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: Versioned migrations', () => {
  it('should have prisma/migrations/ directory with at least one migration', () => {
    const migrationsDir = join(REPO_ROOT, 'prisma', 'migrations')
    assert.ok(
      existsSync(migrationsDir),
      'prisma/migrations/ directory should exist (contradiction #3: db:push is not a migration)'
    )
    // Should have at least one migration subdirectory
    const entries = readdirSync(migrationsDir).filter((e: string) =>
      existsSync(join(migrationsDir, e, 'migration.sql'))
    )
    assert.ok(
      entries.length >= 1,
      `prisma/migrations/ should have at least one migration, found: ${entries.join(', ')}`
    )
  })
})

// ─────────────────────────────────────────────────────────────────────
// 12. .env.example — no empty NEXTAUTH_SECRET
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: .env.example safety', () => {
  it('should document NEXTAUTH_SECRET as required (not empty)', () => {
    const env = readSrc('.env.example')
    assert.ok(
      /NEXTAUTH_SECRET/.test(env),
      '.env.example should mention NEXTAUTH_SECRET'
    )
    assert.ok(
      /openssl rand|Generar con/i.test(env),
      '.env.example should document how to generate NEXTAUTH_SECRET'
    )
    assert.ok(
      !/NEXTAUTH_SECRET=""/.test(env) || /obligatorio/i.test(env),
      '.env.example should not have bare empty NEXTAUTH_SECRET="" without warning'
    )
  })

  it('should NOT have $(...) commands in env values', () => {
    const env = readSrc('.env.example')
    // Check that no line has a value containing $(
    const lines = env.split('\n')
    for (const line of lines) {
      if (line.includes('=')) {
        const value = line.split('=')[1] || ''
        assert.ok(
          !value.includes('$('),
          `.env.example should not have $(...) in values: ${line}`
        )
      }
    }
  })

  it('should document CREDENTIAL_SIGNING_KEY', () => {
    const env = readSrc('.env.example')
    assert.ok(
      /CREDENTIAL_SIGNING_KEY/.test(env),
      '.env.example should document CREDENTIAL_SIGNING_KEY'
    )
  })

  it('should document FIREBASE_SYNC_ENABLED and FIREBASE_SERVICE_ACCOUNT_JSON', () => {
    const env = readSrc('.env.example')
    assert.ok(
      /FIREBASE_SYNC_ENABLED/.test(env),
      '.env.example should document FIREBASE_SYNC_ENABLED (read by code but was missing)'
    )
    assert.ok(
      /FIREBASE_SERVICE_ACCOUNT_JSON/.test(env),
      '.env.example should document FIREBASE_SERVICE_ACCOUNT_JSON (read by code but was missing)'
    )
  })
})

// ─────────────────────────────────────────────────────────────────────
// 13. ADRs exist
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: ADRs documented', () => {
  it('should have docs/implementation/ADRS.md with 6 ADRs', () => {
    const adrs = readSrc('docs/implementation/ADRS.md')
    for (const n of [1, 2, 3, 4, 5, 6]) {
      assert.ok(
        new RegExp(`## ADR ${n}:`).test(adrs),
        `ADRS.md should contain ADR ${n}`
      )
    }
    // ADR 5 should mention HMAC is NOT public-key verification
    const adr5 = adrs.match(/## ADR 5:[\s\S]*?(?=## ADR|$)/)
    assert.ok(adr5, 'ADR 5 not found')
    assert.ok(
      /exclusiva en servidor|exclusivamente servidor/i.test(adr5[0]),
      'ADR 5 should state HMAC verification is server-only'
    )
  })
})

// ─────────────────────────────────────────────────────────────────────
// 14. Truth audit exists
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: Truth audit documented', () => {
  it('should have docs/implementation/TRUTH_AUDIT.md', () => {
    assert.ok(
      existsSync(join(REPO_ROOT, 'docs', 'implementation', 'TRUTH_AUDIT.md')),
      'TRUTH_AUDIT.md should exist'
    )
  })

  it('should have docs/implementation/CONFUSION-AND-PITFALL-REGISTER.md', () => {
    assert.ok(
      existsSync(join(REPO_ROOT, 'docs', 'implementation', 'CONFUSION-AND-PITFALL-REGISTER.md')),
      'CONFUSION-AND-PITFALL-REGISTER.md should exist'
    )
  })

  it('should have docs/implementation/ENVIRONMENT-MATRIX.md', () => {
    assert.ok(
      existsSync(join(REPO_ROOT, 'docs', 'implementation', 'ENVIRONMENT-MATRIX.md')),
      'ENVIRONMENT-MATRIX.md should exist'
    )
  })
})

// ─────────────────────────────────────────────────────────────────────
// 15. Backup script exists
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: Backup script', () => {
  it('should have scripts/backup-sqlite.sh', () => {
    assert.ok(
      existsSync(join(REPO_ROOT, 'scripts', 'backup-sqlite.sh')),
      'scripts/backup-sqlite.sh should exist'
    )
    const script = readSrc('scripts/backup-sqlite.sh')
    assert.ok(
      /integrity_check/.test(script),
      'backup script should run integrity_check'
    )
    assert.ok(
      /sha256/.test(script),
      'backup script should compute SHA-256 checksum'
    )
    assert.ok(
      /\.backup|VACUUM INTO/.test(script),
      'backup script should use sqlite3 .backup or VACUUM INTO (not cp)'
    )
  })
})

// ─────────────────────────────────────────────────────────────────────
// 16. CREDENTIAL_SIGNING_KEY fail-fast in production
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: Signing key fail-fast', () => {
  it('should throw in production when CREDENTIAL_SIGNING_KEY is unset', () => {
    const issue = readSrc('src/app/api/credentials/issue/route.ts')
    const verify = readSrc('src/app/api/credentials/verify/route.ts')
    for (const [file, src] of [['issue', issue], ['verify', verify]]) {
      assert.ok(
        /NODE_ENV.*production/i.test(src) && /throw/.test(src),
        `${file}/route.ts should throw when CREDENTIAL_SIGNING_KEY is unset in production`
      )
    }
  })
})

// ─────────────────────────────────────────────────────────────────────
// 17. verify route uses timingSafeEqual and exact-match
// ─────────────────────────────────────────────────────────────────────
describe('Phase 1: Verify route hardening', () => {
  it('should use timingSafeEqual for signature comparison', () => {
    const verify = readSrc('src/app/api/credentials/verify/route.ts')
    assert.ok(
      /timingSafeEqual/.test(verify),
      'verify/route.ts should use crypto.timingSafeEqual (not ===)'
    )
  })

  it('should validate verificationId format with regex', () => {
    const verify = readSrc('src/app/api/credentials/verify/route.ts')
    assert.ok(
      /verify_\[a-f0-9\]\{16\}/.test(verify),
      'verify/route.ts should validate verificationId format with regex'
    )
  })
})
