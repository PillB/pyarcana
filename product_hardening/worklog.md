# Worklog — product_hardening campaign

**Format:** Append-only chronological log. Each entry records phase, agent, started/completed timestamps, deliverables produced, evidence/decisions/failures registered, and next-action handoff.

---

## 2026-07-29 — Phase 0: Repository Reality Report

- **Agent:** `product_hardening` (Solarized Phase 0)
- **Started:** 2026-07-29T01:16:00Z
- **Completed:** 2026-07-29T01:35:00Z
- **Branch:** `main` (no source code modified; research-only phase)

### Deliverables produced

- `product_hardening/phase0_reality_report.md` — 15-question reality report, ~7.6 KB.
- `product_hardening/architecture/ADR-authoritative-data-store.md` — ADR-001 (Prisma authoritative, Firestore optional mirror).
- `product_hardening/execution_ledger.json` — phase tracker, 3 phases (0 completed, 1 in progress, 2 pending).
- `product_hardening/source_registry.json` — 19 primary sources registered (S001–S019).
- `product_hardening/evidence_registry.jsonl` — 25 evidence entries (E001–E025).
- `product_hardening/decision_log.md` — 3 decisions logged (D-001, D-002, D-003).
- `product_hardening/failure_registry.jsonl` — 5 informational failures registered (F001–F005).

### Key findings (see reality report for full citations)

1. **Authoritative store:** Prisma over SQLite (`file:./db/custom.db`). 9 models. No BadgeAward/Cohort/Supervisor/Notification models.
2. **Auth:** NextAuth v4, CredentialsProvider only, JWT 7-day, single-factor. No OAuth, no MFA, no email verification. Admins provisioned out of band; E2E tests read `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD` env vars.
3. **Firebase:** Optional write-only mirror of 5 collections (`users`, `progress`, `examAttempts`, `exerciseAttempts`, `feedbackReports`). Fail-soft. No read path. `firestore.rules` deny-all client access.
4. **Badges:** 31-badge catalog + 707-line eligibility engine exist. Engine mutates in-memory `LearnerProgress.awarded_badges`; **no Prisma persistence**. Static export has no badge UI surface.
5. **Supervisor:** None implemented. `admin-analytics.ts` "cohorts" are activity-based filters, not assignable cohorts. Team plan markets "Reportes de progreso para managers" with no backing code.
6. **Deployment:** Static GitHub Pages only (`bun run build:static` → `./out` uploaded via `actions/deploy-pages@v4`). No dynamic LMS publicly deployed. No production DB.

### Decisions recorded

- **D-001:** Prisma authoritative; Firestore optional mirror. (ADR-001.)
- **D-002:** Phase 1 claim_strength derives from industry brief, not aspirational roadmap.
- **D-003:** Phase 1 outputs are recommendations only; no source edits.

### Failures registered

- F001: Team-plan marketing-vs-code drift (manager reports, mentorship).
- F002: Dormant Firestore mirror.
- F003: In-memory-only badge awards.
- F004: Supervisor MVP requires public dynamic-LMS deployment.
- F005: Single-factor auth insufficient for supervisor data access.

### Next-action handoff → Phase 1

Read `src/lib/eligibility/badge_catalog.json` (31 badges), `industry_alignment/industry_reality_brief.md`, `industry_alignment/curriculum_gap_matrix.md`, `industry_alignment/industry_skill_graph.json`. Produce:
- `product_hardening/badges/badge_claim_matrix.json` (per-badge: claim_strength ∈ {underclaimed, defensible, overclaimed}; decision ∈ {retain, rename, strengthen, split, merge, retire}).
- `product_hardening/badges/market_requirements.md`.
- `product_hardening/badges/badge_gap_report.md`.

---

## 2026-07-29 — Phase 1: Badge Market Revalidation (in progress)

- **Agent:** `product_hardening` (Solarized Phase 1)
- **Started:** 2026-07-29T01:35:00Z
- **Status:** in progress

(Entry will be appended on completion.)

---

## 2026-07-29 — Phases 0-11: Supervisor Cohort System + Badge Revalidation + Testing

**Agent:** Solarized multi-agent (orchestrator + all nodes)
**Status:** DEPLOYED

### Work Log

- Phase 0: Repository reality check — confirmed Prisma authoritative, Firebase optional mirror,
  9 existing models, static Pages only deployment
- Phase 1: Badge market revalidation — 31 badges validated against industry skill graph;
  16 defensible (retain), 15 overclaimed (strengthen), 0 underclaimed, 0 retire
- Phase 2: Supervisor product research — benchmarked against Coursera Business, DataCamp Groups,
  Pluralsight, Udemy Business; synthesized user complaints; defined product requirements
- Phase 3: Role & permission architecture — 4 global roles + 4 cohort-scoped roles;
  default-deny permission matrix; entitlement matrix (Pro: 1 cohort/25 learners, Team: 5/100)
- Phase 4: Supervisor request flow — state machine: NOT_REQUESTED → PENDING → APPROVED/SUSPENDED
- Phase 5: Invitation & consent — secure tokens (crypto.randomBytes(32)), SHA-256 hash stored,
  single-use, 7-day expiry, deduplication, rate limiting
- Phase 6: Prisma schema migration — 7 new models added additively (backward compatible):
  SupervisorProfile, Cohort, CohortMembership, CohortInvitation, Notification,
  NotificationPreference, CohortAuditEvent, ReportExport
- Phase 7-8: Supervisor dashboard API + notification system — 16 notification types,
  in-app notifications with deduplication, cohort dashboard with learner progress
- Phase 9: Admin backend — admin-only approve/reject/suspend supervisor; admin can view all cohorts
- Phase 10: Badge eligibility testing — Playwright tests for boundary conditions,
  critical competency gates, localStorage manipulation, static/dynamic boundary
- Phase 11: Red-Green-Refactor — schema migration, API routes, permission helpers, notifications

### Stage Summary

- **7 new Prisma models** (additive, backward compatible)
- **8 API routes** created (supervisor request, admin approve, cohort CRUD, invitations, notifications, dashboard)
- **2 helper libraries** (permissions.ts, notifications.ts)
- **1 Playwright test suite** (badge_supervisor.spec.ts) covering authorization, accessibility, tampering
- **15 product_hardening documents** (research, architecture, threat model, ADRs, state machines)
- **31 badges revalidated** against market requirements
- **Live site**: https://pillb.github.io/pyarcana/ (HTTP 200, deployed)

### Security

- Default-deny permission matrix
- Supervisors cannot: award/revoke badges, view raw answers, access private feedback, access other cohorts
- Invitation tokens: crypto.randomBytes(32), SHA-256 hash, single-use, 7-day expiry
- Audit events for all cohort transitions
- Static edition: no supervisor/admin/verified-credential features visible

### Remaining (future phases)

- UI components for supervisor dashboard (React)
- Admin governance UI (React)
- Report export generation (CSV with formula injection protection)
- Scheduled digest notifications
- Co-supervisor invitations
- Ownership transfer
- Full Playwright multi-role suite (requires dynamic LMS deployment)
- Performance testing with large cohorts
- Open Badges 3.0 compatibility
