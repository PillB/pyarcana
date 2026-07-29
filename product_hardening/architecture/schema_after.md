# Schema After — Post-Phase-2 Prisma Schema

**Author:** `product_hardening` agent (Solarized Phase 2)
**Date:** 2026-07-29
**Scope:** Snapshot of the Prisma schema after Phase 2 adds the supervisor / cohort / notification / audit / report models. This document is the "after" half of the diff against `schema_before.md`.

---

## Summary of Changes

- **Models added (8):** `SupervisorProfile`, `Cohort`, `CohortMembership`, `CohortInvitation`, `Notification`, `NotificationPreference`, `CohortAuditEvent`, `ReportExport`.
- **Models modified (1):** `User` (added back-relations for `SupervisorProfile`, `Cohort`, `CohortMembership`).
- **Models unchanged (8):** `FeedbackReport`, `Progress`, `QuestionBank`, `ExamAttempt`, `ExerciseAttempt`, `SubscriptionPlan`, `Subscription`, `Payment`.
- **Indexes added (11):** see §3.
- **Datasource / generator:** unchanged (SQLite + `prisma-client-js`).
- **Migration type:** additive (no destructive changes; no column drops; no renames; no type changes). See `migration_plan.md`.

---

## 1. New Models

### 1.1 `SupervisorProfile`

```prisma
model SupervisorProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  status          String   @default("NOT_REQUESTED")
  entitlement     String   @default("PRO")
  useCase         String?
  organization    String?
  anticipatedSize Int      @default(10)
  termsVersion    String   @default("1.0")
  requestedAt     DateTime?
  approvedAt      DateTime?
  approvedBy      String?
  suspendedAt     DateTime?
  suspendReason   String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([status])
}
```

- One row per user (enforced by `userId @unique`).
- `status` is the effective supervisor flag. Values: `NOT_REQUESTED` (default — row created lazily on first request), `PENDING` (request submitted, awaiting admin), `APPROVED` (admin approved; user is supervisor-enabled), `SUSPENDED` (admin suspended; user retains existing cohort memberships but cannot invite or create new cohorts), `REJECTED` (admin rejected the request), `REVOKED` (admin revoked supervisor privileges after the fact).
- `entitlement` mirrors the user's active subscription plan at the time of approval (`PRO` or `TEAM`). The application layer reconciles this with the actual `Subscription` row; if they diverge (e.g. user downgraded), a sweep archives the excess cohorts (see `cohort_state_machine.md`).
- `approvedBy` is the admin's `userId`. Not a foreign key (admins may be deleted in the future; the audit log retains the ID).
- Indexed by `status` for the admin "pending requests" query.

### 1.2 `Cohort`

```prisma
model Cohort {
  id              String   @id @default(cuid())
  ownerId         String
  name            String
  description     String?
  status          String   @default("ACTIVE")
  visibilityJSON  String   @default("{}")
  reportingJSON   String   @default("{}")
  maxMembers      Int      @default(25)
  createdAt       DateTime @default(now())
  archivedAt      DateTime?
  updatedAt       DateTime @updatedAt

  owner           User              @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  memberships     CohortMembership[]
  invitations     CohortInvitation[]
  auditEvents     CohortAuditEvent[]
  reports         ReportExport[]

  @@index([ownerId, status])
}
```

- `ownerId` is a foreign key to `User`. The owner is the `COHORT_OWNER` and the original creator. Ownership transfer is Phase 7+.
- `status` is `ACTIVE` or `ARCHIVED` (see `cohort_state_machine.md`).
- `visibilityJSON` and `reportingJSON` are JSON blobs for per-cohort overrides to the default `privacy_visibility_matrix.json` and `reporting_requirements.md`. Defaults to `"{}"` (no overrides). Phase 6 does not consult these; they are reserved for Phase 7+ per-cohort customisation.
- `maxMembers` is set at creation time, bounded by the owner's entitlement (Pro: 25; Team: 100). Can be lowered by the owner at any time (but not raised above the entitlement).
- Indexed by `(ownerId, status)` for the supervisor "my cohorts" query.

### 1.3 `CohortMembership`

```prisma
model CohortMembership {
  id              String   @id @default(cuid())
  cohortId        String
  userId          String
  scopedRole      String   @default("COHORT_LEARNER")
  status          String   @default("ACTIVE")
  consentVersion  String   @default("1.0")
  invitedBy       String?
  removedBy       String?
  removalReason   String?
  joinedAt        DateTime @default(now())
  leftAt          DateTime?

  cohort          Cohort   @relation(fields: [cohortId], references: [id], onDelete: Cascade)
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([cohortId, userId])
  @@index([userId, status])
  @@index([cohortId, status])
}
```

- One row per (cohort, user) pair (enforced by `@@unique([cohortId, userId])`).
- `scopedRole` is the cohort-scoped role (see `ADR-role-and-membership-model.md`).
- `status` is `ACTIVE` (member is in the cohort), `LEFT` (member left voluntarily), or `REMOVED` (member was removed by owner/admin). `LEFT` and `REMOVED` memberships confer no permissions but retain audit history. Re-joining after `LEFT` requires a new invitation (the existing row is updated, not duplicated — but the application layer may choose to create a new row to preserve history; Phase 6 reuses the existing row).
- `consentVersion` is the version of `privacy_visibility_matrix.json` the learner consented to at acceptance. Phase 6 ships with `"1.0"`; a future matrix change bumps this and triggers a re-consent flow (Phase 7+).
- `invitedBy` is the `userId` of the inviting supervisor (or `null` for the cohort owner's auto-created membership at cohort creation).
- Indexed by `(userId, status)` for "my cohorts" query and `(cohortId, status)` for "cohort members" query.

### 1.4 `CohortInvitation`

```prisma
model CohortInvitation {
  id              String   @id @default(cuid())
  cohortId        String
  invitedBy       String
  intendedUserId  String?
  intendedEmail   String?
  tokenHash       String   @unique
  status          String   @default("PENDING")
  expiresAt       DateTime
  acceptedAt      DateTime?
  declinedAt      DateTime?
  cancelledAt     DateTime?
  deduplicationKey String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  cohort          Cohort   @relation(fields: [cohortId], references: [id], onDelete: Cascade)

  @@index([cohortId, status])
  @@index([intendedEmail])
  @@index([intendedUserId])
}
```

- One row per invitation.
- `tokenHash` is the SHA-256 hash of the raw invitation token (32 random bytes, base64url-encoded). The raw token is shown to the supervisor exactly once in the API response and never persisted.
- `status` is `PENDING`, `ACCEPTED`, `DECLINED`, `CANCELLED`, `EXPIRED`, or `SUPERSEDED` (see `invitation_state_machine.md`).
- `intendedUserId` is set if the invitee has an account at invitation time. `intendedEmail` is always set (the supervisor invites by email). Both are indexed for the invitee's "my invitations" query.
- `deduplicationKey` = `cohortId + ":" + intendedEmail` (or `cohortId + ":user:" + intendedUserId`). Used to prevent duplicate pending invitations (see `invitation_state_machine.md` §Deduplication).
- Indexed by `(cohortId, status)` for the supervisor "pending invitations" query, by `intendedEmail` for the invitee "my invitations" query (when email is the only key), and by `intendedUserId` for the invitee "my invitations" query (when the user is logged in).

### 1.5 `Notification`

```prisma
model Notification {
  id              String   @id @default(cuid())
  recipientId     String
  type            String
  title           String
  body            String
  actionRoute     String?
  isRead          Boolean  @default(false)
  isDismissed     Boolean  @default(false)
  readAt          DateTime?
  dismissedAt     DateTime?
  deduplicationKey String?
  expiresAt       DateTime?
  createdAt       DateTime @default(now())

  @@index([recipientId, isRead, createdAt])
  @@index([recipientId, type, createdAt])
}
```

- One row per notification. No foreign key to `User` (the user may be deleted in the future; the notification retains the `recipientId`).
- `type` is one of the 22 types in `notification_matrix.md`.
- `body` is Stephen Fry redacted (no PII from other users).
- `actionRoute` is a relative URL (e.g. `/invitations`) for the notification centre to link to.
- `deduplicationKey` prevents duplicate notifications for the same logical event (see `notification_matrix.md`).
- `expiresAt` is set to 90 days after `createdAt` for non-critical notifications; `null` for critical notifications.
- Indexed by `(recipientId, isRead, createdAt)` for the "unread notifications" query (the most common query) and `(recipientId, type, createdAt)` for per-type filtering.

### 1.6 `NotificationPreference`

```prisma
model NotificationPreference {
  userId          String   @id
  emailEnabled    Boolean  @default(true)
  inAppEnabled    Boolean  @default(true)
  digestFrequency String   @default("WEEKLY")
  quietHoursStart Int      @default(22)
  quietHoursEnd   Int      @default(7)
  locale          String   @default("es")

  @@index([userId])
}
```

- One row per user (enforced by `userId @id`).
- `digestFrequency` is `NONE`, `DAILY`, `WEEKLY`, or `MONTHLY`. Phase 6 stores the value but does not run a digest job; the digest is computed on-demand at `GET /api/notifications` if `digestFrequency !== "NONE"` (lazy digest).
- `quietHoursStart` and `quietHoursEnd` are 24-hour integers. Phase 6 stores them but they apply only to the email channel (Phase 7+). In-app notifications are immediate.
- `locale` is the user's preferred locale for notification bodies. Phase 6 ships Spanish (`"es"`) only; English localisation is Phase 7+.

### 1.7 `CohortAuditEvent`

```prisma
model CohortAuditEvent {
  id              String   @id @default(cuid())
  cohortId        String
  actorId         String
  action          String
  targetType      String?
  targetId        String?
  beforeState     String?
  afterState      String?
  reason          String?
  requestId       String?
  createdAt       DateTime @default(now())

  cohort          Cohort   @relation(fields: [cohortId], references: [id], onDelete: Cascade)

  @@index([cohortId, createdAt])
  @@index([actorId, createdAt])
}
```

- Append-only. No `UPDATE` or `DELETE` permitted (enforced by application layer; SQLite does not support row-level permissions).
- `actorId` is the `userId` of the actor (or `"system"` for automated actions like the subscription-downgrade sweep).
- `action` is a string like `create_cohort`, `invite_learner`, `accept_invitation`, `archive_cohort`, `export_report`, etc. (see `user_flows.md` for the full list).
- `targetType` and `targetId` identify the action's target (e.g. `("invitation", "ck...")` for an invitation action).
- `beforeState` and `afterState` are JSON snapshots of the target row (excluding large blobs like `visibilityJSON` which are hashed instead). Both are nullable (e.g. `create_cohort` has `beforeState = null`).
- `reason` is a free-text reason (e.g. `SUBSCRIPTION_DOWNGRADE_TEAM_TO_PRO`, `OWNER_INITIATED`).
- `requestId` is the request's trace ID (from the `x-request-id` header or generated server-side). Used for distributed tracing.
- Indexed by `(cohortId, createdAt)` for the cohort audit log and `(actorId, createdAt)` for the actor audit log.

### 1.8 `ReportExport`

```prisma
model ReportExport {
  id              String   @id @default(cuid())
  requesterId     String
  cohortId        String
  reportType      String
  filtersJSON     String   @default("{}")
  status          String   @default("PENDING")
  artifactPath    String?
  rowCount        Int      @default(0)
  expiresAt       DateTime?
  failureReason   String?
  createdAt       DateTime @default(now())
  completedAt     DateTime?

  cohort          Cohort   @relation(fields: [cohortId], references: [id], onDelete: Cascade)

  @@index([cohortId, status])
  @@index([requesterId, createdAt])
}
```

- One row per report export request.
- `reportType` is `progress_summary` (Phase 6), `badge_report` / `inactivity_report` / `assessment_report` / `audit_log_export` (Phase 7+).
- `status` is `PENDING`, `COMPLETED`, `FAILED`, or `EXPIRED`. Phase 6 uses the synchronous path (`COMPLETED` immediately); the `PENDING` and `FAILED` states are reserved for Phase 7+ async path.
- `artifactPath` is the path to the generated file (Phase 7+). Phase 6 returns the CSV directly in the HTTP response, so `artifactPath` is null.
- `expiresAt` is set to 7 days after `createdAt` (Phase 7+; the file is deleted from disk after expiry). Phase 6 sets this to null (no artefact to expire).
- Indexed by `(cohortId, status)` for the cohort's export history and `(requesterId, createdAt)` for the requester's export history.

---

## 2. Modified Models

### 2.1 `User`

Added back-relations for the new models:

```prisma
model User {
  // ... existing fields unchanged ...

  // Phase 2 additions:
  supervisorProfile   SupervisorProfile?
  ownedCohorts        Cohort[]
  cohortMemberships   CohortMembership[]
}
```

- `supervisorProfile` is `?` (optional) because a `SupervisorProfile` row is created lazily on first supervisor request. Most users will not have one.
- `ownedCohorts` is the inverse of `Cohort.ownerId`. A user can own multiple cohorts (up to their entitlement limit).
- `cohortMemberships` is the inverse of `CohortMembership.userId`. A user can be a member of multiple cohorts (with different scoped roles).

No existing fields are changed; no existing indexes are removed; no existing relations are altered.

---

## 3. Indexes Added

| Model                  | Index                                    | Purpose                                              |
|------------------------|------------------------------------------|------------------------------------------------------|
| `SupervisorProfile`    | `@@index([status])`                      | Admin "pending requests" query                       |
| `Cohort`               | `@@index([ownerId, status])`             | Supervisor "my active cohorts" query                 |
| `CohortMembership`     | `@@unique([cohortId, userId])`           | One membership per (cohort, user)                    |
| `CohortMembership`     | `@@index([userId, status])`              | Learner "my active cohorts" query                    |
| `CohortMembership`     | `@@index([cohortId, status])`            | Cohort "active members" query                        |
| `CohortInvitation`     | `@@index([cohortId, status])`            | Cohort "pending invitations" query                   |
| `CohortInvitation`     | `@@index([intendedEmail])`               | Invitee "my invitations" query (by email)            |
| `CohortInvitation`     | `@@index([intendedUserId])`              | Invitee "my invitations" query (by user ID)          |
| `Notification`         | `@@index([recipientId, isRead, createdAt])` | "Unread notifications" query (most common)        |
| `Notification`         | `@@index([recipientId, type, createdAt])`   | Per-type filtering                                 |
| `CohortAuditEvent`     | `@@index([cohortId, createdAt])`         | Cohort audit log query                               |
| `CohortAuditEvent`     | `@@index([actorId, createdAt])`          | Actor audit log query                                |
| `ReportExport`         | `@@index([cohortId, status])`            | Cohort export history query                          |
| `ReportExport`         | `@@index([requesterId, createdAt])`      | Requester export history query                       |
| `NotificationPreference`| `@@index([userId])`                     | User preferences lookup (userId is `@id` so this is technically redundant in SQLite, but explicit for documentation) |

Total: 14 indexes added (one is `@unique` on `NotificationPreference.userId` and one is `@@unique` on `CohortMembership`).

---

## 4. What Still Does Not Exist (Post-Phase 2)

These are deferred to Phase 3+:

- `BadgeAward` — persisted badge awards. The eligibility engine remains in-memory; the supervisor dashboard's `badgeStatus` rollup is computed on-the-fly by re-running the engine per learner.
- `MentorshipSession` — the Team plan's "Mentoría 1:1 mensual" feature.
- `EmailDeliveryLog` — log of emails sent (for digest tracking).
- `CohortBranding` — per-cohort logo / colour / subdomain.
- `ScheduledDigestJob` — a cron-style table for digest jobs.
- `SlackIntegration` / `TeamsIntegration` — enterprise chat integrations.
- `SCIMProvisioningLog` — SCIM audit trail.

Each of these will require its own ADR before introduction.

---

## 5. Type-Safety Notes

- All `String` fields that represent enumerations (`SupervisorProfile.status`, `Cohort.status`, `CohortMembership.scopedRole`, `CohortMembership.status`, `CohortInvitation.status`, `Notification.type`, `NotificationPreference.digestFrequency`, `CohortAuditEvent.action`, `ReportExport.status`, `ReportExport.reportType`) are free-form `String` columns. SQLite does not support native enums; Prisma 6 supports enums only on Postgres/MySQL.
- The application layer enforces the enum values via TypeScript union types in `src/lib/permissions.ts` and the API route handlers. A future Postgres migration would convert these to native enums.
- The `*JSON` fields (`Cohort.visibilityJSON`, `Cohort.reportingJSON`, `ReportExport.filtersJSON`) are stored as `String` and parsed with `JSON.parse()` at the application layer. A future Postgres migration would convert these to `Json` columns.

---

## 6. Forward Compatibility

The schema is designed to be forward-compatible with the Phase 3+ additions:

- `Cohort.visibilityJSON` and `reportingJSON` allow per-cohort overrides without schema changes.
- `Notification.type` is a free-form string, so new notification types can be added without a migration.
- `CohortAuditEvent.action` is a free-form string, so new actions can be logged without a migration.
- `ReportExport.reportType` is a free-form string, so new report types can be added without a migration.
- `CohortMembership.consentVersion` allows the privacy matrix to evolve without losing audit history.

The schema is **not** forward-compatible with: (a) splitting `User.role` into multiple columns (would require a migration), (b) adding row-level security at the DB layer (would require Postgres), (c) converting the `*JSON` fields to native JSON columns (would require Postgres or a SQLite extension).
