# Reporting Requirements — PyArcana Supervisor Dashboard & Exports

**Author:** `product_hardening` agent (Solarized Phase 2)
**Date:** 2026-07-29
**Scope:** The dashboard payload returned by `GET /api/cohorts/[id]/dashboard` and the CSV export returned by `POST /api/cohorts/[id]/export`. These requirements are the contract between the API and the UI; both sides must conform.

---

## 1. Dashboard Payload (`GET /api/cohorts/[id]/dashboard`)

### 1.1 Top-level shape

```jsonc
{
  "cohort": {
    "id": "ck...",
    "name": "Cohorte Backend Python 2026-Q1",
    "description": "...",
    "status": "ACTIVE",
    "maxMembers": 25,
    "ownerId": "ck...",
    "createdAt": "2026-07-29T...",
    "archivedAt": null
  },
  "dataFreshness": {
    "lastActivityAt": "2026-07-29T14:23:00Z",
    "generatedAt": "2026-07-29T14:28:00Z",
    "stalenessMs": 300000,
    "stalenessLabel": "hace 5 minutos",
    "stalenessLevel": "fresh"
  },
  "kpi": {
    "activeMembers7d": 18,
    "activeMembers30d": 22,
    "pendingInvitations": 4,
    "meanCompletionPct": 47.3,
    "medianCompletionPct": 42.0,
    "meanExamScore": 78.1,
    "badgesAwarded": 31,
    "badgesEligible": 12,
    "badgesBlocked": 7
  },
  "members": [ /* per-member drill-down, see §1.2 */ ],
  "pendingInvitationsList": [ /* see §1.3 */ ],
  "recentActivity": [ /* see §1.4 */ ],
  "entitlement": {
    "plan": "PRO",
    "maxCohorts": 1,
    "maxMembersPerCohort": 25,
    "canAddCoSupervisor": false,
    "canAddReporter": true
  }
}
```

### 1.2 Members array

Each entry is a per-learner summary. The fields visible depend on the caller's role per `privacy_visibility_matrix.json`. The server strips fields the caller cannot see.

```jsonc
{
  "userId": "ck...",
  "name": "María",
  "email": "maria@example.com",
  "joinedAt": "2026-07-15T...",
  "lastActivityAt": "2026-07-29T...",
  "sectionsCompleted": 12,
  "completionPct": 23.1,
  "examBestScoreAvg": 82.5,
  "examAttemptsCount": 8,
  "badgesAwardedCount": 2,
  "badgesEligibleCount": 1,
  "badgesBlockedCount": 0,
  "badgeTopBlockingReasons": [],
  "projectSubmissionStatus": { "cp1": "submitted", "cp2": "not_submitted" }
}
```

For `COHORT_REPORTER`, `examBestScoreAvg` is included but `examTimeSpentSec` and `exerciseUsedHintRate` are not (those are engagement proxies that reporters do not need).

### 1.3 Pending invitations list

```jsonc
[
  {
    "invitationId": "ck...",
    "intendedEmail": "john@example.com",
    "intendedEmailMasked": "j***n@example.com",
    "status": "PENDING",
    "expiresAt": "2026-08-05T...",
    "createdAt": "2026-07-29T..."
  }
]
```

The `intendedEmailMasked` field is used in the UI to avoid showing full emails in lists (Stephen Fry redaction for screenshots). The full `intendedEmail` is included for owner/supervisor only; reporters see only the masked version.

### 1.4 Recent activity feed

The last 20 `CohortAuditEvent` rows for the cohort. Each entry is Stephen Fry redacted (no PII from non-actor users).

```jsonc
[
  {
    "auditEventId": "ck...",
    "action": "accept_invitation",
    "actorName": "María",
    "targetType": "invitation",
    "summary": "María aceptó la invitación a la cohorte.",
    "createdAt": "2026-07-29T14:23:00Z"
  }
]
```

### 1.5 Data freshness indicator

The `dataFreshness` block tells the UI how stale the data is:

- `lastActivityAt`: the most recent `Progress.completedAt` or `ExamAttempt.completedAt` across all members.
- `generatedAt`: when the dashboard response was generated (server time).
- `stalenessMs`: `generatedAt - lastActivityAt` in milliseconds.
- `stalenessLabel`: human-readable Spanish label ("hace 5 minutos", "hace 2 horas", "hace 3 días", "sin actividad reciente").
- `stalenessLevel`: one of `fresh` (< 5 min), `stale` (< 1 hour), `very_stale` (< 24 hours), `inactive` (> 24 hours).

The UI renders the staleness as a coloured badge: green (`fresh`), amber (`stale`), red (`very_stale` / `inactive`).

---

## 2. Drill-down (`GET /api/cohorts/[id]/members/[userId]`)

A per-learner drill-down view. Visible to `COHORT_OWNER`, `COHORT_SUPERVISOR`, `COHORT_REPORTER`. The fields visible depend on the caller's role per `privacy_visibility_matrix.json`.

```jsonc
{
  "user": { "userId": "...", "name": "...", "email": "...", "joinedAt": "..." },
  "sectionProgress": [
    {
      "sectionId": "s01-setup",
      "sectionTitle": "Setup",
      "subSteps": { "theory": true, "ido": true, "wedo": false, "youdo": false, "quiz": false },
      "completionPct": 40.0,
      "lastActivityAt": "2026-07-29T..."
    }
  ],
  "assessmentSummary": [
    {
      "sectionId": "s01-setup",
      "attemptsCount": 2,
      "bestScore": 85.0,
      "lastAttemptAt": "2026-07-29T..."
    }
  ],
  "badgeStatus": {
    "awarded": ["badge_01", "badge_05"],
    "eligiblePendingVerification": ["badge_02"],
    "blocked": [
      { "badgeId": "badge_03", "topBlockingReason": "Falta completar la sección s05" }
    ]
  },
  "projectStatus": {
    "cp1": { "submitted": true, "score": 88.0 },
    "cp2": { "submitted": false, "score": null }
  }
}
```

For `COHORT_REPORTER`, `subSteps` is omitted (only `completionPct` per section is shown) and `assessmentSummary` omits `lastAttemptAt`.

### 2.1 Drill-down privacy boundary

The drill-down **does not** include:

- Raw exam answers (`ExamAttempt.answers` JSON).
- Exercise code (`ExerciseAttempt` raw code, if any future field stores it).
- Exam variant seed (`ExamAttempt.variantSeed` — visible only to ADMIN).
- Private feedback report bodies.
- Payment details.
- Auth data (password hash, last login IP, user agent).
- The learner's membership in other cohorts.

If the caller is `ADMIN`, an additional `adminDetails` block is included with the raw answers, variant seed, and full audit history. The `adminDetails` block is **not** included for any non-ADMIN role.

---

## 3. Aggregate Rollups (Dashboard KPIs)

The dashboard computes the following aggregate KPIs server-side:

| KPI                       | Computation                                                                                       |
|---------------------------|---------------------------------------------------------------------------------------------------|
| `activeMembers7d`         | Count of members with `lastActivityAt > now - 7d`.                                                |
| `activeMembers30d`        | Count of members with `lastActivityAt > now - 30d`.                                               |
| `pendingInvitations`      | Count of `CohortInvitation` rows with `status = "PENDING"` and `cohortId = this cohort`.          |
| `meanCompletionPct`       | Mean of `completionPct` across active members.                                                    |
| `medianCompletionPct`     | Median of `completionPct` across active members.                                                  |
| `meanExamScore`           | Mean of `examBestScoreAvg` across active members who have at least one exam attempt.              |
| `badgesAwarded`           | Sum of `badgesAwardedCount` across active members.                                                |
| `badgesEligible`          | Sum of `badgesEligibleCount` across active members.                                               |
| `badgesBlocked`           | Sum of `badgesBlockedCount` across active members.                                                |

"Active members" = `CohortMembership.status === "ACTIVE"` (excludes `LEFT` / `REMOVED`).

---

## 4. CSV Export (`POST /api/cohorts/[id]/export`)

### 4.1 Synchronous path (cohort ≤ 25 members in Phase 6; threshold may rise in Phase 7+)

The endpoint returns the CSV directly with:

```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="cohort_{cohortId}_progress_{YYYYMMDDHHmmss}.csv"
```

### 4.2 Asynchronous path (Phase 7+; cohort > 25 members)

The endpoint creates a `ReportExport` row (status `PENDING`) and returns 202 with `{ "exportId": "..." }`. A background job generates the CSV, sets `status = "COMPLETED"` and `artifactPath`, and fires a `report_ready` notification. The requester downloads via `GET /api/exports/[id]/download`.

### 4.3 CSV structure

The CSV has a metadata preamble (lines 1-6, prefixed with `#`) followed by the data table.

```
# PyArcana Cohort Progress Report
# Cohort: {cohortName} ({cohortId})
# Generated: 2026-07-29T14:28:00Z
# Requested by: {requesterEmail}
# Filters: {filtersJSON or "none"}
# Row count: 22
UserId,Name,Email,JoinedAt,LastActivityAt,SectionsCompleted,CompletionPct,ExamBestScoreAvg,ExamAttemptsCount,BadgesAwarded,BadgesEligible,BadgesBlocked
ck...,"María","maria@example.com",2026-07-15,2026-07-29,12,23.1,82.5,8,2,1,0
ck...,"John","john@example.com",2026-07-16,2026-07-28,8,15.4,71.0,5,1,0,1
...
```

### 4.4 Formula-injection sanitisation

Before writing any cell value to the CSV:

1. If the cell starts with `=`, `+`, `-`, `@`, tab (`\t`), or carriage return (`\r`), prefix the value with a single quote (`'`).
2. If the cell contains a newline (`\n`) or double-quote (`"`), wrap the cell in double-quotes and escape embedded double-quotes by doubling them (per RFC 4180).
3. Strip null bytes (`\0`) entirely.
4. Strip leading/trailing whitespace.

This is the OWASP-recommended CSV injection defence. The sanitisation is applied unconditionally to every cell, regardless of the source (even trusted internal data).

### 4.5 CSV column set

The CSV exports the following columns (in order):

| Column                  | Source                                          |
|-------------------------|-------------------------------------------------|
| `UserId`                | `CohortMembership.userId`                       |
| `Name`                  | `User.name` (or email local-part if null)       |
| `Email`                 | `User.email`                                    |
| `JoinedAt`              | `CohortMembership.joinedAt` (ISO-8601)          |
| `LastActivityAt`        | Max of `Progress.completedAt` (ISO-8601)        |
| `SectionsCompleted`     | Count of distinct `Progress.sectionId` where `completed = true` |
| `CompletionPct`         | `SectionsCompleted / COURSE_META.totalSections * 100` (1 decimal) |
| `ExamBestScoreAvg`      | Mean of best score per section (1 decimal)      |
| `ExamAttemptsCount`     | Count of `ExamAttempt` rows                     |
| `BadgesAwarded`         | Count of awarded badges                         |
| `BadgesEligible`        | Count of eligible-pending-verification badges   |
| `BadgesBlocked`         | Count of blocked badges                         |

For `COHORT_REPORTER`, the columns are reduced: `UserId`, `Name`, `Email`, `JoinedAt`, `LastActivityAt`, `SectionsCompleted`, `CompletionPct`, `ExamBestScoreAvg`, `BadgesAwarded`, `BadgesEligible`, `BadgesBlocked`. The `ExamAttemptsCount` column is omitted (engagement proxy not needed by reporters).

### 4.6 Export audit

Every export (sync or async) creates a `CohortAuditEvent` with:

- `action`: `export_report`
- `actorId`: the requester
- `targetType`: `report`
- `targetId`: the `ReportExport.id` (for async) or a synthetic ID for sync
- `afterState`: JSON snapshot of the export metadata (filters, row count, format)
- `reason`: `progress_summary` / `badge_report` / `inactivity_report` (per `reportType`)

The audit event is created **before** the export is generated (so a failed export still has an audit trail). If the export fails (async path), the `ReportExport.status` is set to `FAILED` with `failureReason`, and a follow-up audit event `export_failed` is created.

---

## 5. Performance Requirements

- `GET /api/cohorts/[id]/dashboard` must respond in < 500 ms p95 for cohorts ≤ 25 members.
- `POST /api/cohorts/[id]/export` (sync) must respond in < 2 s p95 for cohorts ≤ 25 members.
- The dashboard query must use indexed lookups (`@@index([cohortId, status])` on `CohortMembership`, `@@index([userId, status])` for member lookups).

If performance is exceeded, the dashboard degrades gracefully (e.g. skip the badge status computation and return `null` for badge counts with a `badgeStatusStale: true` flag).

---

## 6. Edge Cases

1. **Cohort has 0 active members:** Dashboard returns `kpi` with all zeros and an empty `members` array. The UI shows "Esta cohorte no tiene miembros activos."
2. **Cohort has 1 member (the owner):** Dashboard returns the owner's own row in `members`. The owner's own progress is included (the owner may also be a learner in their own cohort — uncommon but valid).
3. **All members have `lastActivityAt = null`:** `dataFreshness.stalenessLevel = "inactive"` and `dataFreshness.lastActivityAt = null`. The UI shows "Sin actividad reciente."
4. **Cohort is archived:** Dashboard returns the same payload but with `cohort.status = "ARCHIVED"` and `cohort.archivedAt` set. The UI shows an "Archivada" badge and disables all write actions.
5. **Member has no exam attempts:** `examBestScoreAvg = null` and the row's `examBestScoreAvg` cell in the CSV is empty (not 0). The dashboard KPI `meanExamScore` excludes this member from the mean.
6. **Member has no progress:** `sectionsCompleted = 0`, `completionPct = 0.0`, `lastActivityAt = null`. The row appears in the CSV with zeros.
7. **Export requested by a reporter:** The CSV column set is reduced (see §4.5). The audit event records the requester's role.
8. **Export requested on an archived cohort:** Allowed. The CSV is generated from the current state (which is read-only since archive). The audit event reason is `progress_summary` (no special handling for archived).
9. **Concurrent export requests by the same user:** The rate limit (30 per hour per user) applies. Beyond that, return 429.
10. **Export with filters (Phase 7+):** The `filtersJSON` is stored on `ReportExport` and echoed in the metadata preamble. Filters include `dateRange`, `sectionId`, `badgeId`. Phase 6 exports have `filtersJSON = "{}"`.

---

## 7. Future Report Types (Phase 7+)

The `ReportExport.reportType` field supports:

- `progress_summary` — the default, described above.
- `badge_report` — per-learner per-badge matrix (awarded / eligible / blocked with reasons).
- `inactivity_report` — list of members with `lastActivityAt > N days`, with last-activity timestamp and a "days inactive" column.
- `assessment_report` — per-learner per-section best score + attempt count (no raw answers).
- `audit_log_export` — the cohort's audit log as CSV (owner/admin only).

Each report type has its own column set, sanitisation rules, and audit event `reason`. Only `progress_summary` is implemented in Phase 6; the others are Phase 7+.
