# ADR-001 — Authoritative Data Store

**Status:** Accepted
**Date:** 2026-07-29
**Decision owner:** `product_hardening` agent (Solarized Phase 0; re-affirmed Phase 2)
**Supersedes:** none
**Superseded by:** none
**Review trigger:** any future proposal to make Firestore authoritative, or to introduce a second relational store (Postgres, PlanetScale, Turso) for any subset of PyArcana data.

## Context

PyArcana currently runs two persistence systems side by side:

1. **Prisma over SQLite** (`prisma/schema.prisma`, `DATABASE_URL="file:./db/custom.db"`) — the only system that the application reads from.
2. **Firestore via Firebase Admin** (`src/lib/firebase/admin.ts`, `src/lib/firebase/sync.ts`) — a write-only mirror enabled only when service-account env vars are present; failures are swallowed and never throw.

Three further stores appear in the codebase but are out of scope for this ADR:

3. Browser `localStorage` — the only persistence on the static GitHub Pages export (`src/lib/progress-store.ts`, `src/lib/runtime-mode.ts`).
4. The `LearnerProgress` in-memory object (`src/lib/eligibility/types.ts`) — the input/output of the badge eligibility engine; **no Prisma model persists it today**.
5. The `QuestionBank` JSON blob embedded in `prisma/seed.ts` (~15,500 lines) — the seed source, replaced on every `prisma db seed`.

Phase 0 established (see `phase0_reality_report.md`) that there is no production database, no public dynamic deployment, and no read path from Firestore. Without a single authoritative-store decision, every later phase risks introducing "dual-write drift" — a state where Prisma and Firestore disagree and no one knows which is correct.

Phase 2 (supervisor / cohort system) re-affirms this ADR: the new models (`SupervisorProfile`, `Cohort`, `CohortMembership`, `CohortInvitation`, `Notification`, `NotificationPreference`, `CohortAuditEvent`, `ReportExport`) are all persisted in Prisma. None of them sync to Firestore in Phase 2; a future Phase 3+ proposal to mirror them must re-open this ADR.

## Decision

**Prisma over SQLite (or any future Prisma-supported relational store — Postgres, Turso, MySQL) is the authoritative data store for all PyArcana application state.**

Concretely:

- **Users, progress, exams, exercises, feedback, subscriptions, payments, question bank** — authoritative in Prisma.
- **Supervisor profiles, cohorts, memberships, invitations, notifications, audit events, report exports** — authoritative in Prisma (added in Phase 2). No supervisor state may live only in Firestore.
- **Badge awards** — when introduced, MUST be persisted in a Prisma model (proposed: `BadgeAward`). The eligibility engine remains the *evaluator*; it does not own awarded state.
- **Firestore** — remains an optional, write-only, best-effort mirror. It MUST NOT be the source of truth for any read path. Any future feature that wants to read from Firestore MUST first re-justify this ADR.
- **`localStorage`** — remains the only persistence on the static export and is explicitly **non-authoritative**. Server-verified features (badges, supervisor dashboards, cohort management) MUST NOT rely on `localStorage` state.

## Consequences

### Positive

- A single read path. Every API route, every server component, every migration script reads from Prisma.
- Migrations are atomic and reviewable (`prisma migrate`). No dual-write drift.
- The eligibility engine can be deterministic: given a `LearnerProgress` materialised from Prisma, the same inputs always produce the same awards.
- Supervisor features can join learner data atomically (single SQL query) rather than reconciling two stores.
- The static export continues to function offline; nothing in this ADR changes the static-site contract.

### Negative

- Firestore's cross-region read potential is unused. If PyArcana later wants a global admin dashboard with sub-second reads from multiple regions, it must either (a) add a Postgres read replica, (b) reintroduce a Firestore read path with a fresh ADR, or (c) accept the latency of cross-region Prisma reads.
- SQLite has a single writer. As the dynamic LMS scales, this becomes the first bottleneck. The decision is to migrate to Postgres (or Turso/libSQL) via Prisma when the bottleneck materialises — not to fork the data layer prematurely.
- Carrying the Firestore mirror code as dormant is a maintenance liability. Phase 3+ must either (a) wire a real consumer (e.g. a read-only admin mirror) or (b) retire the sync helpers with an explicit deletion ADR.

### Neutral

- The eligibility engine's in-memory `LearnerProgress` becomes a **projection** of Prisma state, not a store. A future `BadgeAward` Prisma model + a `materialiseLearnerProgress(userId)` loader is the canonical pattern.

## Compliance checks (must pass before merging any feature that touches persistence)

1. **No new Firestore read paths.** Any PR that adds `firestore.collection(...).get()` or `.onSnapshot()` MUST either be rejected or accompanied by a superseding ADR.
2. **No new authoritative state in `localStorage`.** Any PR that stores awarded badges, supervisor relationships, or cohort memberships in `localStorage` MUST be rejected. (`localStorage` may cache Prisma state for offline display; the cache MUST be revalidated on next server reach.)
3. **No new in-memory-only award state.** Any PR that adds an `AwardedBadge` to `LearnerProgress.awarded_badges` without a corresponding Prisma write MUST be rejected.
4. **Every new Prisma model ships with a migration.** No `db push` in production paths; `prisma migrate dev` for dev, `prisma migrate deploy` for CI/prod. (Phase 2 dev uses `db push` because the schema is additive and the dev DB is ephemeral; production migration is deferred until the dynamic LMS is publicly deployed.)
5. **Firebase sync helpers may be extended only for new Prisma models.** Adding `syncBadgeAward()` to mirror a new `BadgeAward` Prisma model is permitted; adding `syncCohort()` that writes cohort state to Firestore *instead of* Prisma is forbidden.

## Alternatives considered

### A. Firestore as authoritative

Rejected. Firestore's eventual consistency, lack of transactions across documents, and Spark-tier write limits make it a poor fit for the eligibility engine's determinism requirements. The current deny-all client rules also mean a Firestore-authoritative model would require either public client access (security risk) or a server proxy that re-implements every read (which is just Prisma with extra steps).

### B. Dual-authoritative (Prisma + Firestore, last-write-wins)

Rejected. Dual-authoritative stores always drift. The Team-plan promise of "manager progress reports" depends on a single consistent view of each learner's state; a last-write-wins reconciliation would silently lose awards and cohort memberships.

### C. SQLite-only, retire Firestore

Deferred. The Firestore mirror costs ~140 lines of code and one env-var block. Retiring it now would foreclose future cross-region reporting without saving meaningful complexity. Phase 3+ should revisit; if no read path is wired within two phases, retire it.

### D. Postgres from day one

Deferred. SQLite is sufficient for the current (non-existent) production load. Migrating to Postgres via Prisma is a one-day schema-only exercise when the bottleneck appears. No reason to pay the operational cost now.

## References

- `product_hardening/phase0_reality_report.md` — Q1–Q15 ground truth.
- `prisma/schema.prisma` — 9 models (pre-Phase 2) → 17 models (post-Phase 2), SQLite datasource.
- `src/lib/firebase/sync.ts` — dual-write helpers, fail-soft.
- `src/lib/firebase/admin.ts` — Firebase Admin init, auto-enable on env.
- `firestore.rules` — deny-all client access.
- `src/lib/eligibility/types.ts` — `LearnerProgress` in-memory shape (to become a Prisma projection).
- `src/lib/runtime-mode.ts` — static-site gate.
- `prisma/seed.ts` lines 15540–15706 — seed routine; explicitly creates no users.
- `product_hardening/architecture/migration_plan.md` — Phase 2 additive migration plan.
- `product_hardening/architecture/rollback_plan.md` — Phase 2 forward-only rollback plan.
