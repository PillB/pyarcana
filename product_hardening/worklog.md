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
