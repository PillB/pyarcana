# ADR-002 — Role and Membership Model

**Status:** Accepted
**Date:** 2026-07-29
**Decision owner:** `product_hardening` agent (Solarized Phase 2)
**Supersedes:** none
**Superseded by:** none
**Review trigger:** any future proposal to (a) move role / membership state into JWT custom claims, (b) introduce a role that is neither global nor cohort-scoped, (c) split `User.role` into multiple columns, or (d) introduce row-level security at the database layer (Postgres RLS, Supabase RLS).

## Context

PyArcana's Phase 0 / Phase 1 schema had a single role dimension: `User.role` with two values (`STUDENT` | `ADMIN`). The JWT callback (`src/lib/auth.ts` lines 57-71) copied `token.role` into the session, and every protected endpoint checked `session.user.role === "ADMIN"`.

Phase 2 introduces the supervisor / cohort system. The supervisor domain has two distinct role dimensions:

1. **Global role** — applies site-wide. `STUDENT` (default), `ADMIN` (provisioned out-of-band), and the `SUPERVISOR_ENABLED` flag (a user attribute, not a role per se, but checked at the same layer).
2. **Cohort-scoped role** — applies only within a single cohort. `COHORT_OWNER`, `COHORT_SUPERVISOR`, `COHORT_REPORTER`, `COHORT_LEARNER`. A user can have different scoped roles in different cohorts simultaneously.

Conflating these two dimensions into `User.role` (e.g. `User.role = "COHORT_OWNER"`) would be wrong: a user is not globally a `COHORT_OWNER`; they are a `COHORT_OWNER` *of cohort X* and a `COHORT_LEARNER` *of cohort Y*.

The decision is: how to model these two dimensions cleanly, where to enforce them, and where to cache them (or not).

## Decision

### 1. Global role stays on `User.role`; the supervisor flag is a separate `SupervisorProfile` row.

- `User.role` remains a `String` with values `STUDENT` | `ADMIN`. The Phase 0 design is preserved.
- The `SUPERVISOR_ENABLED` flag is **not** added to `User.role`. Instead, a separate `SupervisorProfile` row is created when a user requests supervisor privileges. The row's `status` field (`NOT_REQUESTED` | `PENDING` | `APPROVED` | `SUSPENDED` | `REJECTED` | `REVOKED`) is the effective supervisor flag.
- A user is "supervisor-enabled" iff `SupervisorProfile.status === "APPROVED"` for that user. The check is a Prisma lookup at request time, not a JWT claim.

### 2. Cohort-scoped roles live on `CohortMembership.scopedRole`.

- `CohortMembership.scopedRole` is a `String` with values `COHORT_OWNER` | `COHORT_SUPERVISOR` | `COHORT_REPORTER` | `COHORT_LEARNER`.
- The membership row's `status` field (`ACTIVE` | `LEFT` | `REMOVED`) gates whether the scoped role is currently in effect. A `LEFT` or `REMOVED` membership confers no permissions.
- A user's effective permission in a cohort is determined by looking up their `CohortMembership` row for that cohort. The lookup is a Prisma query at request time.

### 3. Role / membership state is **not** stored in JWT custom claims.

- The JWT callback (`src/lib/auth.ts`) continues to copy only `token.id` and `token.role` (the global role) into the session. No cohort memberships, no supervisor flag, no scoped roles.
- Rationale: JWT claims are stale until the token expires (7 days). A user added to a cohort at T+1 minute would not have the membership reflected in their JWT until T+7 days. A user suspended from supervisor privileges at T+1 minute would still appear supervisor-enabled until T+7 days. This staleness is unacceptable for security-sensitive checks.
- The cost of the Prisma lookup is acceptable: `CohortMembership` is indexed by `@@index([userId, status])` and `@@index([cohortId, status])`, so the lookup is O(log n).

### 4. Permission checks are performed by `src/lib/permissions.ts` helpers, not inline in route handlers.

- Helpers: `requireAdmin(session)`, `requireSupervisorEnabled(session)`, `requireCohortRole(session, cohortId, roles)`, `canViewProgress(session, cohortId)`, `canDownloadReport(session, cohortId)`, `canInviteLearner(session, cohortId)`.
- Helpers throw `PermissionDeniedError` (which the route handler catches and converts to a 403 response). Helpers never return booleans; the API is fail-closed.
- Helpers consult the `permission_matrix.json` and `privacy_visibility_matrix.json` documents, which are the single source of truth for what each role can do.

### 5. The `ADMIN` role bypasses cohort-scoped checks.

- An admin can view any cohort, any dashboard, any audit log, any member's data (including raw answers and private feedback). This is the same power the admin has today via the existing `/api/admin/students` route.
- The bypass is implemented as an early-return in `requireCohortRole` and the `can*` helpers: if `session.user.role === "ADMIN"`, the check passes.
- The bypass is **not** a "wildcard cohort role"; it is an explicit special case. Admin actions are still audit-logged.

### 6. Static-site guard.

- All role / membership helpers check `IS_STATIC_SITE` first. If true, they throw `StaticSiteDisabledError` (converted to 404 by the route handler). The static GitHub Pages export has no supervisor context.

## Consequences

### Positive

- A single source of truth for permission checks (`src/lib/permissions.ts`), consulting a single source of truth for the matrix (`permission_matrix.json`).
- No stale JWT claims; role changes take effect on the next request.
- A user can be a `COHORT_OWNER` of cohort A and a `COHORT_LEARNER` of cohort B without conflict.
- The Phase 0 design (`User.role` with two values) is preserved; existing code that checks `session.user.role === "ADMIN"` continues to work.
- Audit log can reconstruct who had what role at any point in time (the `CohortMembership` row's `scopedRole` and `status` are versioned via `CohortAuditEvent`).

### Negative

- Every protected supervisor endpoint incurs a Prisma lookup for the caller's `CohortMembership`. For high-traffic endpoints (e.g. `GET /api/cohorts/[id]/dashboard` polled every 5 minutes by 50 supervisors), this is 50 × 1 lookup / 5 min = 600 lookups / hour. Acceptable for SQLite in dev; will need a short-TTL cache (e.g. 60 seconds) in production.
- The JWT cannot be used to short-circuit a permission check. Every check requires the Prisma lookup. This is intentional but documented as a performance trade-off.
- The `SupervisorProfile` row is required for the supervisor flag; a missing row means "not supervisor-enabled". The lookup must handle the `null` case (no row found → not enabled).

### Neutral

- The `permission_matrix.json` and `privacy_visibility_matrix.json` are versioned alongside the code. A change to the matrix requires a code review; there is no runtime matrix update path.
- The `consentVersion` field on `CohortMembership` tracks which version of the privacy matrix the learner consented to. A future matrix change bumps the version and triggers a re-consent flow (Phase 7+).

## Compliance checks

1. **No JWT custom claims for role / membership.** Any PR that adds `token.cohortRoles` or `token.supervisorEnabled` to the JWT callback MUST be rejected. (A future ADR could re-open this for performance reasons, but the staleness problem must be solved first — e.g. via a 60-second cache invalidation channel.)
2. **No inline permission checks.** Any PR that adds `if (session.user.role !== "ADMIN")` inline in a route handler (instead of using `requireAdmin(session)`) MUST be rejected — unless the check is for a non-supervisor, non-cohort endpoint that pre-dates Phase 2 (existing admin endpoints are grandfathered; new endpoints must use the helpers).
3. **No new global roles without an ADR.** Any PR that adds a new value to `User.role` MUST be accompanied by a superseding ADR.
4. **No new cohort-scoped roles without updating `permission_matrix.json`.** Any PR that adds a new value to `CohortMembership.scopedRole` MUST also update `permission_matrix.json` and `privacy_visibility_matrix.json` in the same PR.
5. **All permission helpers default-deny.** Any PR that adds a new helper MUST ensure the helper throws on any unrecognised role or missing membership.

## Alternatives considered

### A. Store role / membership in JWT custom claims

Rejected. JWT claims are stale until token expiry (7 days). A user added to a cohort at T+1 minute would not have the membership reflected until T+7 days. A user suspended at T+1 minute would still appear supervisor-enabled until T+7 days. The staleness is unacceptable for security-sensitive checks.

A 60-second short-TTL cache (e.g. Redis or in-memory LRU) would solve the performance problem without sacrificing freshness. This is the recommended Phase 7+ optimisation, but it requires a cache-invalidation channel (e.g. a `permissionCacheInvalidation` Firestore collection or a Postgres NOTIFY channel). For Phase 6, the Prisma lookup is sufficient.

### B. Row-level security at the database layer (Postgres RLS)

Rejected for Phase 2. RLS requires Postgres (SQLite does not support RLS). Phase 2 stays on SQLite. A future Postgres migration (Phase 8+) could introduce RLS as a defence-in-depth layer; the application-layer checks in `src/lib/permissions.ts` would remain the primary enforcement.

### C. Single `User.role` column with values like `COHORT_OWNER`

Rejected. A user can be a `COHORT_OWNER` of cohort A and a `COHORT_LEARNER` of cohort B. A single `User.role` value cannot represent this. The cohort-scoped role must be on the membership row, not on the user row.

### D. A separate `Role` table with many-to-many to `User`

Rejected. Over-normalised for the current scale. The `CohortMembership` table already serves as the join table for cohort-scoped roles; a separate `Role` table would duplicate this. Global roles are simple enough to live on `User.role`.

### E. `User.role` as an array of strings

Rejected. Arrays in SQLite are stored as JSON-encoded strings and require application-layer parsing. The performance and type-safety trade-offs are not worth it for a two-value (Phase 0) or three-value (Phase 2) global role dimension.

## References

- `product_hardening/supervisor/permission_matrix.json` — single source of truth for (role, action) pairs.
- `product_hardening/supervisor/privacy_visibility_matrix.json` — single source of truth for (role, field) pairs.
- `prisma/schema.prisma` — `User.role`, `SupervisorProfile`, `CohortMembership.scopedRole`.
- `src/lib/auth.ts` — JWT callback (preserved as-is in Phase 2).
- `src/lib/permissions.ts` — Phase 2 helper module.
- `product_hardening/phase0_reality_report.md` — Q1 (users), Q7 (admin endpoints).
