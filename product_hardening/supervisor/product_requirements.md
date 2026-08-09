# Product Requirements — PyArcana Supervisor / Cohort System

**Author:** `product_hardening` agent (Solarized Phase 2)
**Date:** 2026-07-29
**Status:** Draft for orchestrator approval
**Inputs:** `benchmark_research.md`, `complaint_synthesis.md`, `phase0_reality_report.md`, `architecture/ADR-authoritative-data-store.md`

---

## 1. Classification Scheme

Each requirement is classified into one of five buckets:

- **Essential** — ship in Phase 6; no cohort feature works without it.
- **Strongly supported** — ship in Phase 6 if cost is low; defer to Phase 7+ otherwise.
- **Optional** — explicit non-goal for Phase 6; revisit at Phase 8+ if customer demand emerges.
- **Rejected** — will not build; documented here to prevent re-litigation.
- **Deferred** — build later; tracked in `decision_log.md` for re-opening.

---

## 2. Essential Features (Phase 6)

### 2.1 Supervisor request flow

A learner on the Pro or Team plan may request supervisor privileges. The request is reviewed by an admin; approval flips `SupervisorProfile.status` from `PENDING` to `APPROVED` and adds `SUPERVISOR_ENABLED` to the user's effective roles. Rejection and suspension are also admin-only.

- **Inputs:** use case (free text, ≤500 chars), organisation (free text, ≤200 chars), anticipated cohort size (int, 5-200), entitlement selection (Pro or Team).
- **Outputs:** `SupervisorProfile` row, `Notification` to admins, audit event.
- **Acceptance:** status visible at `GET /api/supervisor/status`; admin actions logged in `CohortAuditEvent` (cohort-scoped) or `Notification` (admin-facing).

### 2.2 Cohort creation

An `APPROVED` supervisor may create a cohort. The supervisor becomes the cohort's `COHORT_OWNER`. Cohort count is bounded by the supervisor's entitlement (Pro: 1; Team: 5).

- **Inputs:** name (≤120 chars), description (≤1000 chars, optional), `maxMembers` (default 25, bounded by entitlement: Pro 25, Team 100).
- **Outputs:** `Cohort` row, `CohortMembership` row (owner), `CohortAuditEvent` (`create_cohort`).

### 2.3 Invitation with consent

A `COHORT_OWNER` or `COHORT_SUPERVISOR` may invite a learner by email. The invitation carries a cryptographic token (32 random bytes, base64url). The token is stored as a SHA-256 hash; the raw token is shown to the supervisor *once* in the API response and never persisted.

- The invitee receives an in-app notification (if they have an account) and a clickable link (if they do not). The link resolves to a consent page that discloses: cohort name, supervisor name, what the supervisor can see (link to `privacy_visibility_matrix.json`), how to leave.
- Acceptance creates a `CohortMembership` row with `scopedRole = "COHORT_LEARNER"` and `consentVersion = "1.0"`.
- Decline marks the invitation `DECLINED`; the supervisor is notified.
- Rate limit: 10 invitations per hour per supervisor. Rate-limit state is in-memory per server instance; documented as a known limitation for serverless cold-starts.
- Expiry: 7 days. Resend supersedes the original (sets `status = "SUPERSEDED"`, generates a new token).

### 2.4 Progress dashboard

The dashboard view (`GET /api/cohorts/[id]/dashboard`) returns:

- Active learners (last 7 / 30 days; based on `Progress.completedAt` and `ExamAttempt.completedAt`).
- Pending invitations (count + list with `expiresAt`).
- Progress summary: mean/median/% complete across all members.
- Badge status: counts of `awarded`, `eligible_pending_verification`, `blocked` per member.
- Recent activity feed: last 20 `CohortAuditEvent` rows for the cohort.
- Data freshness indicator: timestamp of the most recent `Progress.completedAt` across the cohort.

### 2.5 Badge status view

The supervisor sees, per learner: count of awarded badges, count of eligible-pending badges, count of blocked badges (with top blocking reason). The supervisor **does not** see the eligibility engine's full report — only the rolled-up status. Awarding remains a server-side, learner-triggered action; supervisors cannot award or revoke.

### 2.6 Report export (CSV)

The supervisor or reporter may request a CSV export of the dashboard. The export includes:

- Metadata preamble: generation timestamp, requester ID, cohort ID, filters applied, row count.
- One row per learner: name, email, joined-at, last-activity, sections-completed, exam-average, badges-awarded, badges-eligible.
- Formula-injection sanitisation: any cell starting with `=`, `+`, `-`, `@`, tab, or carriage return is prefixed with a single quote (`'`).
- The export is generated synchronously for cohorts ≤ 25 learners; asynchronously (with a `ReportExport` row + `artifactPath`) for larger cohorts.

### 2.7 In-app notifications

The `Notification` model persists per-user notifications. Each notification has a `type` (drawn from `notification_matrix.md`), `title`, `body` (Stephen Fry redacted — no PII from other users), `actionRoute`, `isRead`, `isDismissed`, `deduplicationKey`.

Endpoints: list, mark-as-read, mark-all-as-read, dismiss, get/update preferences.

### 2.8 Leave cohort

A `COHORT_LEARNER` may leave a cohort at any time. The membership row's `status` becomes `LEFT` with `leftAt = now()`. The supervisor is notified. The learner's progress data is **not** deleted — only the membership link. Re-joining requires a new invitation.

### 2.9 Audit log

Every cohort-scoped action creates a `CohortAuditEvent`. The cohort owner can view their cohort's audit log via `GET /api/cohorts/[id]/audit` (planned Phase 7+). Admins can view all cohorts' audit logs via the existing admin console. The audit log is append-only; no `UPDATE` or `DELETE` is permitted on `CohortAuditEvent` rows.

---

## 3. Strongly Supported Features (Phase 6 if cheap, else Phase 7+)

### 3.1 Co-supervisor

A `COHORT_OWNER` may promote a `COHORT_LEARNER` to `COHORT_SUPERVISOR`. The promotion is logged in the audit log. Demotion reverses the role. Co-supervisors cannot invite or remove learners (only the owner can); they can view progress, view assessment summaries, view badge eligibility, download badges and reports, and send nudges.

### 3.2 Scheduled digests

The `NotificationPreference.digestFrequency` field (NONE/DAILY/WEEKLY/MONTHLY) controls whether the user receives a digest email. Digests are computed by a cron-style background job (Phase 7+; for Phase 6 the field is stored but no job runs). The default is `WEEKLY`.

### 3.3 Learner drill-down

The supervisor can click a learner in the dashboard to see a drill-down view: per-section completion, assessment summaries (best score per section, not raw answers), badge eligibility per badge, project status (submitted/not, score). The drill-down does **not** show: raw exam answers, exercise code, private feedback reports, payment details, auth data.

### 3.4 Data freshness indicator

The dashboard shows "Última actualización: hace N minutos" based on the most recent `Progress.completedAt` across the cohort. If `now - lastActivity > 5 min`, the indicator turns amber; if `> 1 hour`, red. No real-time WebSocket push in Phase 6.

### 3.5 Notification preferences

`GET /api/notifications/preferences` and `PATCH /api/notifications/preferences` expose the per-user `NotificationPreference` row. Defaults: email enabled, in-app enabled, weekly digest, quiet hours 22:00-07:00 local.

---

## 4. Optional Features (Phase 8+ if demand emerges)

### 4.1 XLSX export

The `xlsx` library is already a dependency. An XLSX export would add a second tab with charts. Demand is unclear; CSV covers 80 % of use cases.

### 4.2 PDF export

A server-rendered PDF report (using `pdf-lib` or `puppeteer`) would mirror Pluralsight's "team report". Cost is high (puppeteer is 300 MB), demand is low.

### 4.3 Team branding

Custom cohort logo, custom cohort colour, custom cohort subdomain. Demand is enterprise-tier; PyArcana's target market (LATAM SMBs) is unlikely to need it.

### 4.4 Advanced analytics

Skill-gap analysis (Pluralsight-style), cohort-vs-cohort benchmarking, predictive at-risk-learner ML. All deferred — the data is too sparse for ML in 2026, and the skill-gap taxonomy is not yet defined.

---

## 5. Rejected Features

### 5.1 Supervisor can award / revoke badges

**Rejected.** Badge awarding is a server-side, learner-triggered action gated by the eligibility engine. Allowing supervisors to award or revoke would (a) break the eligibility engine's determinism contract, (b) create an attack surface for favouritism, (c) make badges non-portable across cohorts (a learner leaving a cohort would lose their badges). The supervisor may **view** badge status but not alter it.

### 5.2 Supervisor can view raw answers

**Rejected.** Raw exam answers, exercise code, and self-check responses are private to the learner. Supervisors see **summaries**: best score per section, count of attempts, completion status. This is the boundary that all four benchmarked vendors also enforce, and it is non-negotiable for PyArcana.

### 5.3 Supervisor can access other cohorts

**Rejected.** Cohort scoping is strict. A supervisor in cohort A cannot view cohort B's members, dashboard, or audit log — even if they share a learner. The only role that can see across cohorts is `ADMIN`. This is the same boundary that all four benchmarked vendors enforce.

### 5.4 Supervisor can edit a learner's progress

**Rejected.** Progress is a learner-owned, server-verified artefact. A supervisor cannot mark a section complete, cannot reset an exam attempt, cannot edit a learner's progress. The supervisor's only lever is a "nudge" — an in-app notification to the learner.

---

## 6. Deferred Features

### 6.1 SCIM provisioning

Udemy Business's SCIM flow bypasses the invitation flow entirely. PyArcana does not have an enterprise SSO/SCIM customer; defer until an enterprise deal materialises.

### 6.2 Mobile push

Udemy Business is the only benchmarked vendor with manager-grade mobile push. PyArcana is responsive-web-only for Phase 6; mobile push is deferred.

### 6.3 Calendar integration

"Schedule a nudge for Tuesday at 9 a.m." style calendar integration. Defer; the in-app notification + weekly digest covers the same need.

### 6.4 Multi-language supervisor UI

The supervisor UI ships in Spanish (PyArcana's primary market). English localisation is deferred until an English-market customer emerges.

### 6.5 Public cohort directory

A "join this cohort" public directory (à la Coursera Specialisations). Rejected for Phase 6 (privacy concern: cohorts are invite-only); deferred indefinitely unless a clear opt-in flow is designed.

---

## 7. Non-Functional Requirements

### 7.1 Performance

- Dashboard GET must respond in < 500 ms p95 for cohorts ≤ 25 learners.
- CSV export must respond in < 2 s p95 for cohorts ≤ 25 learners.
- Notification list GET must respond in < 200 ms p95 (indexed by `[recipientId, isRead, createdAt]`).

### 7.2 Security

- All endpoints validate `getServerSession(authOptions)`; default deny.
- Invitation tokens are 32 random bytes (`crypto.randomBytes(32)`) base64url-encoded; stored as SHA-256 hash.
- Rate limit: 10 invitations per hour per supervisor (in-memory token bucket).
- Stephen Fry redaction: no PII from user A appears in user B's notification body. Use first-name-only or redacted handles.
- Static-site guard: all supervisor endpoints return 404 when `IS_STATIC_SITE` is true; the UI does not render supervisor surfaces.

### 7.3 Privacy

- `privacy_visibility_matrix.json` is the single source of truth for what each role can see.
- Learner email is visible to supervisors; learner password hash, billing address, IP, and auth data are never visible.
- The supervisor view is a strict subset of the learner's own self-view.

### 7.4 Auditability

- Every cohort-scoped mutation creates a `CohortAuditEvent`.
- The audit log is append-only.
- Audit events include `requestId` for distributed tracing.

### 7.5 Availability

- The supervisor system inherits the dynamic LMS's availability. The static GitHub Pages export does not include supervisor features.
- A Prisma outage takes the supervisor system down (no degraded mode). Acceptable for Phase 6; revisit if a high-availability customer emerges.

---

## 8. Out of Scope for Phase 6

- Email delivery (notifications are in-app only; email digest is a stub for Phase 6).
- Slack/Teams integration.
- White-label cohort theming.
- Cohort-to-cohort learner transfer (learner must leave + be re-invited).
- Bulk invitation via CSV upload (single-invitation only for Phase 6; CSV upload is Phase 7+).
- Real-time WebSocket push (dashboard polls every 5 minutes).
- Per-exercise time tracking (privacy boundary; not built).

---

## 9. Acceptance Criteria for Phase 6

1. A Pro-tier learner can submit a supervisor request; an admin can approve it; the learner can create 1 cohort with ≤ 25 members.
2. A Team-tier learner (after supervisor approval) can create 5 cohorts with ≤ 100 members each; can add co-supervisors.
3. An invitation flow works end-to-end: supervisor invites → learner sees notification → learner accepts → cohort membership row created → supervisor sees learner in dashboard.
4. A supervisor can download a CSV export; the export has a metadata preamble and is formula-injection-safe.
5. A learner can leave a cohort; the supervisor is notified; the membership row is marked `LEFT`.
6. All supervisor endpoints return 404 when `IS_STATIC_SITE` is true.
7. All cohort-scoped mutations appear in `CohortAuditEvent`.
8. `npx prisma generate` succeeds; `npx tsc --noEmit` succeeds; `npx eslint src/lib/permissions.ts src/lib/notifications.ts` succeeds.
