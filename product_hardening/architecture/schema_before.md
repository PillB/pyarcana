# Schema Before — Pre-Phase-2 Prisma Schema

**Author:** `product_hardening` agent (Solarized Phase 2)
**Date:** 2026-07-29
**Scope:** Snapshot of the Prisma schema as it exists on `main` immediately before Phase 2 changes. This document is the "before" half of the diff against `schema_after.md`.

---

## Datasource

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

- Provider: SQLite.
- `DATABASE_URL`: defaults to `file:./db/custom.db` (per `.env.example`).
- Generator: `prisma-client-js` (the standard Prisma client).

---

## Models (9 total)

### 1. `User`

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String?
  passwordHash String? // null for OAuth-only users
  role         String   @default("STUDENT") // STUDENT | ADMIN
  country      String   @default("PE") // ISO 3166-1 alpha-2 country code
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  progress             Progress[]
  examAttempts         ExamAttempt[]
  exerciseAttempts     ExerciseAttempt[]
  subscription         Subscription?
  payments             Payment[]
  feedbackReports      FeedbackReport[]
}
```

- Global role dimension: `STUDENT` | `ADMIN` (free-form `String`; no DB-level enum).
- One subscription per user (`Subscription?` — the relation is unique on `Subscription.userId`).
- No cohort, supervisor, or notification relations.

### 2. `FeedbackReport`

```prisma
model FeedbackReport {
  id         String   @id @default(cuid())
  type       String // BUG | IDEA | RECOMMENDATION | OTHER
  status     String   @default("NEW") // NEW | REVIEWING | PLANNED | DONE | WONTFIX | DUPLICATE
  title      String
  body       String
  sectionId  String?
  pagePath   String?
  userAgent  String?
  email      String?
  userId     String?
  adminNote  String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([status, createdAt])
  @@index([type, createdAt])
  @@index([userId])
}
```

### 3. `Progress`

```prisma
model Progress {
  userId      String
  sectionId   String
  subStep     String // theory|ido|wedo|youdo|quiz
  completed   Boolean  @default(false)
  completedAt DateTime?
  bookmarked  Boolean  @default(false)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([userId, sectionId, subStep])
  @@index([userId, sectionId])
}
```

- Composite primary key `(userId, sectionId, subStep)` — one row per learner per sub-step per section.
- No time-series; only the latest `completed` boolean + `completedAt`.
- This is the table the supervisor dashboard queries to compute `lastActivityAt` and `sectionsCompleted`.

### 4. `QuestionBank`

```prisma
model QuestionBank {
  id           String   @id @default(cuid())
  sectionId    String
  concept      String // e.g. "list-comprehension"
  variant      Int // 1 | 2 | 3
  question     String
  options      String // JSON array of strings
  correctIndex Int
  explanation  String
  createdAt    DateTime @default(now())

  @@unique([sectionId, concept, variant])
  @@index([sectionId, concept])
}
```

- Seeded once by `prisma/seed.ts` (~15,500 lines, ~3,000 questions across 52 sections × ~20 concepts × 3 variants).
- Not directly relevant to the supervisor system, but the supervisor's `assessment_summary` aggregates `ExamAttempt` rows that reference these questions.

### 5. `ExamAttempt`

```prisma
model ExamAttempt {
  id            String    @id @default(cuid())
  userId        String
  sectionId     String
  attemptNumber Int // 1 | 2 | 3
  answers       String // JSON: [{concept, variant, selectedIndex, correct}]
  score         Float // 0-100
  startedAt     DateTime  @default(now())
  completedAt   DateTime?
  timeSpentSec  Int       @default(0)
  variantSeed   String // JSON: [{concept, variant}] audit trail

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, sectionId, attemptNumber])
  @@index([userId, sectionId])
}
```

- Max 3 attempts per (user, section); enforced by `@@unique([userId, sectionId, attemptNumber])` + the application layer.
- `answers` is JSON-encoded; the supervisor never sees this field (it is raw answers — denied per `privacy_visibility_matrix.json`).
- `variantSeed` is the anti-plagiarism audit trail; visible only to ADMIN.

### 6. `ExerciseAttempt`

```prisma
model ExerciseAttempt {
  id          String   @id @default(cuid())
  userId      String
  sectionId   String
  exerciseId  String
  usedHint    Boolean  @default(false)
  correct     Boolean  @default(false)
  attemptedAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, sectionId, exerciseId])
}
```

- One row per attempt (not unique-constrained; a learner can attempt an exercise unlimited times).
- `usedHint` and `correct` are the only fields the supervisor sees (as aggregates: `exerciseUsedHintRate`, `exerciseCorrectRate`).

### 7. `SubscriptionPlan`

```prisma
model SubscriptionPlan {
  id              String   @id @default(cuid())
  code            String   @unique // "free" | "pro" | "team"
  name            String
  description     String
  pricingJSON     String
  featuresJSON    String
  maxSections     Int      @default(-1) // -1 = unlimited
  hasExams        Boolean  @default(true)
  hasPlayground   Boolean  @default(true)
  hasCertificate  Boolean  @default(false)
  hasMentorship   Boolean  @default(false)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  subscriptions Subscription[]
}
```

- Seeded with three plans: `free`, `pro`, `team` (see `prisma/seed.ts` lines 15590-15662).
- The `team` plan's `featuresJSON` includes the literal string `"Reportes de progreso para managers"` — a forward-looking sales claim that Phase 2 makes good on.

### 8. `Subscription`

```prisma
model Subscription {
  id              String   @id @default(cuid())
  userId          String   @unique
  planId          String
  status          String   @default("ACTIVE")
  billingCycle    String   @default("MONTHLY")
  currency        String   @default("PEN")
  amount          Float
  provider        String   @default("MANUAL")
  providerSubId   String?
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  cancelAtPeriodEnd  Boolean  @default(false)
  trialEnd           DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  plan SubscriptionPlan @relation(fields: [planId], references: [id])
  payments Payment[]

  @@index([status])
  @@index([provider])
}
```

- One active subscription per user (`userId @unique`).
- The supervisor entitlement check (`SupervisorProfile.entitlement`) is **separate** from this — the supervisor entitlement reflects what the user requested, which should match their active subscription but is not enforced to match at the DB level (the application layer reconciles them).

### 9. `Payment`

```prisma
model Payment {
  id              String   @id @default(cuid())
  userId          String
  subscriptionId  String?
  amount          Float
  currency        String   @default("PEN")
  provider        String
  providerPaymentId String?
  status          String   @default("PENDING")
  failureReason   String?
  createdAt       DateTime @default(now())

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  subscription Subscription? @relation(fields: [subscriptionId], references: [id])

  @@index([userId, status])
  @@index([provider, status])
}
```

- Never exposed to supervisors (per `privacy_visibility_matrix.json`). ADMIN-only.

---

## What Does Not Exist (Pre-Phase 2)

The following models / concepts do **not** exist in the pre-Phase-2 schema:

- `SupervisorProfile` — no supervisor state whatsoever.
- `Cohort` — no cohort / team / group concept.
- `CohortMembership` — no learner-to-cohort link.
- `CohortInvitation` — no invitation flow.
- `Notification` — no in-app notification system.
- `NotificationPreference` — no per-user notification settings.
- `CohortAuditEvent` — no cohort-scoped audit log.
- `ReportExport` — no report-generation tracking.
- `BadgeAward` — no persisted badge awards (the eligibility engine is in-memory only; flagged for Phase 3+).

The `team` plan's `"Reportes de progreso para managers"` marketing bullet is therefore **vapor** in the pre-Phase-2 schema: no model, no route, no component implements it.

---

## Indexes (Pre-Phase 2)

The pre-Phase-2 schema has 13 explicit indexes:

- `FeedbackReport`: `@@index([status, createdAt])`, `@@index([type, createdAt])`, `@@index([userId])`.
- `Progress`: `@@index([userId, sectionId])` (+ composite PK).
- `QuestionBank`: `@@index([sectionId, concept])` (+ unique constraint).
- `ExamAttempt`: `@@index([userId, sectionId])` (+ unique constraint).
- `ExerciseAttempt`: `@@index([userId, sectionId, exerciseId])`.
- `Subscription`: `@@index([status])`, `@@index([provider])` (+ unique `userId`).
- `Payment`: `@@index([userId, status])`, `@@index([provider, status])`.

Phase 2 adds 11 more indexes (see `schema_after.md`).

---

## Known Limitations (Pre-Phase 2)

1. **No persisted badge awards.** The eligibility engine (`src/lib/eligibility/engine.ts`) computes awards in-memory; a server restart wipes them. The supervisor dashboard's `badgeStatus` rollup is computed on-the-fly by re-running the eligibility engine per learner — expensive but correct.
2. **No notification system.** Every user-facing event (badge earned, subscription expiring, etc.) requires polling or email; no in-app notification centre.
3. **No audit trail.** Admin actions on students are not logged; a removed learner's data is gone without a trace.
4. **No cohort concept.** The Team plan's marketing bullet is unfulfilled.

Phase 2 addresses items 2, 3, and 4 (notifications, cohort audit trail, cohort concept). Item 1 (persisted badge awards) is deferred to Phase 3+.
