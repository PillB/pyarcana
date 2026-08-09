# Phase 0 — Repository Reality Report

**Repository:** `/home/z/my-project/pyarcana_repo` (branch `main`)  
**Live site:** https://pillb.github.io/pyarcana/ (static GitHub Pages export)  
**Report date:** 2026-07-29  
**Author:** `product_hardening` agent (Solarized Phase 0)  
**Spec ref:** §7 — 15 Reality Questions

This report is the ground-truth snapshot against which every later Phase must reconcile. It records **what the code actually does today**, not what marketing copy, the README, or the roadmap claim. Where a claim and the code disagree, the code wins.

---

## Method

Every answer below is backed by a primary source read from the repository (`prisma/schema.prisma`, `src/lib/auth.ts`, `src/lib/firebase/{admin,sync}.ts`, `firestore.rules`, `src/lib/eligibility/`, `src/lib/runtime-mode.ts`, `next.config.ts`, `prisma/seed.ts`, `.github/workflows/deploy.yml`, `scripts/e2e_max/helpers/auth.ts`). Quoted strings, line numbers, and field names are reproduced verbatim so reviewers can re-verify.

The schema file declares **9 Prisma models**: `User`, `FeedbackReport`, `Progress`, `QuestionBank`, `ExamAttempt`, `ExerciseAttempt`, `SubscriptionPlan`, `Subscription`, `Payment`. There is no `BadgeAward`, `Cohort`, `Supervisor`, `Notification`, `Mentorship`, or `Team` model.

---

## The 15 Reality Questions

### Q1 — What system is authoritative for users?

**Answer: Prisma over SQLite (`prisma/schema.prisma` `model User`).**

- `User.role` is a free-form `String` with `@default("STUDENT")`. The schema comment restricts it to two values: `// STUDENT | ADMIN`.
- `User.country` defaults to `"PE"` (ISO 3166-1 alpha-2). There is no `cohortId`, `supervisorId`, `teamId`, or `managerId` field.
- Authentication is NextAuth v4 `CredentialsProvider` (`src/lib/auth.ts`), bcrypt-hashed passwords, JWT session with `maxAge: 7 * 24 * 60 * 60` (7 days). The JWT callback copies `token.id` and `token.role` into the session. There is no OAuth provider, no email verification flag, no MFA field.
- `prisma/seed.ts` explicitly **does not create any users** (see line 15696: `"No users or credentials were created. Provision operators out of band."`). Admins must be provisioned manually against the SQLite file.

### Q2 — What system is authoritative for progress?

**Answer: Dual — Prisma (`Progress`) for the dynamic LMS, browser `localStorage` for the static GitHub Pages export.**

- `src/lib/runtime-mode.ts` line 8: `export const IS_STATIC_SITE = process.env.NEXT_PUBLIC_STATIC_SITE === '1'`.
- `src/lib/progress-store.ts` line 112/129 short-circuits server writes (`if (IS_STATIC_SITE) return`) and line 157 hydrates from server only when `!IS_STATIC_SITE && status === 'authenticated'`.
- `next.config.ts` switches `output: "export"` vs `"standalone"` based on `process.env.NEXT_OUTPUT === "export"`. The `.github/workflows/deploy.yml` builds with `bun run build:static` and uploads `./out` to GitHub Pages — i.e. the public live site is the **static export**, where progress lives only in `localStorage` and is **lost on browser reset / device change**.
- The `Progress` model is keyed by `@@id([userId, sectionId, subStep])` where `subStep ∈ {theory, ido, wedo, youdo, quiz}`. There is no time-series, no `timeSpentSec`, no per-attempt history — only the latest `completed` boolean + `completedAt`.

### Q3 — What system is authoritative for assessments?

**Answer: Prisma `ExamAttempt` (with `QuestionBank` providing item variants) for the dynamic LMS. Static export has no real assessments — only self-check quizzes.**

- `ExamAttempt` schema fields: `attemptNumber Int // 1 | 2 | 3` (max 3 attempts per user/section — 2 retries), `score Float // 0-100`, `answers String // JSON`, `variantSeed String // audit trail`, `timeSpentSec Int`, `completedAt DateTime?`.
- `QuestionBank` provides `variant Int // 1 | 2 | 3` per `(sectionId, concept)` for anti-plagiarism; `@@unique([sectionId, concept, variant])`.
- `ExerciseAttempt` tracks exercise correctness + `usedHint Boolean` per attempt.
- The static export (`NEXT_PUBLIC_STATIC_SITE=1`) cannot grade exams server-side; in that mode the assessment is limited to in-browser self-check items. The live public site therefore shows **no server-verified exam evidence**.

### Q4 — What system is authoritative for subscriptions?

**Answer: Prisma `Subscription` + `SubscriptionPlan` + `Payment`. No payment provider is wired into the public deployment; the Team plan's "Reportes de progreso para managers" is a marketing bullet, not implemented functionality.**

- `SubscriptionPlan` is seeded with three tiers (`free`, `pro`, `team`) in `prisma/seed.ts` lines 15590–15662.
- `Subscription` is one-per-user (`userId String @unique`), with `provider` enum string `STRIPE | MERCADOPAGO | LEMON_SQUEEZY | MANUAL` and `status ACTIVE | PAST_DUE | CANCELED | EXPIRED | TRIALING`.
- `Payment` records each charge with `providerPaymentId`, `status PENDING | SUCCEEDED | FAILED | REFUNDED`, `failureReason`.
- The Team plan's `featuresJSON` includes the literal string `"Reportes de progreso para managers"` (line 15654) — this is a forward-looking sales claim with no corresponding route, model, or component. It must be treated as **vapor** until a supervisor feature is built.

### Q5 — What system is authoritative for badges?

**Answer: The TypeScript eligibility engine at `src/lib/eligibility/` is the *evaluator*; there is **no persisted badge-award store yet**.**

- `src/lib/eligibility/badge_catalog.json` declares 31 badges across 4 families (`progress_achievement` ×5, `applied_skill` ×16, `cross_section_capability` ×5, `capstone_credential` ×5).
- `src/lib/eligibility/engine.ts` (707 lines) implements `evaluate(badge_id, progress, options)` and `awardIdempotent(...)`. The "award" mutates the in-memory `LearnerProgress.awarded_badges` array (see `types.ts` lines 125–138).
- **No Prisma model persists `AwardedBadge`.** A `grep -rE "awarded_badges|EligibilityState|BadgeAward" src/` returns matches only inside `engine.ts` and `types.ts` — never in an API route, never in a Prisma query. A server restart or a static-page refresh wipes any awarded badge.
- The badge catalog is shipped to the static export as JSON, but the static site has no UI surface to display awarded badges to a learner (Q14 below). The badges are **evaluable in principle, invisible in practice**.

### Q6 — Is Firebase currently authoritative, mirrored, dormant, or partially used?

**Answer: Optional server-side mirror. Failures never throw; Prisma remains the source of truth.**

- `src/lib/firebase/admin.ts` line 12: *"Firebase Admin (Spark / free-tier Firestore) for server-side dual-write."*
- `src/lib/firebase/sync.ts` line 2: *"Dual-write helpers: mirror server mutations to Firestore (Firebase Spark). Failures are logged and never throw — Prisma remains source of truth for the app."*
- `upsertDoc()` (sync.ts lines 39–59) wraps every Firestore write in `try/catch` and returns `false` on failure. The caller never inspects the return value — there is **no read path** from Firestore, only writes.
- `isFirebaseSyncEnabled()` (admin.ts lines 55–60) auto-enables when `FIREBASE_SERVICE_ACCOUNT_JSON` or the three env vars are present; otherwise it no-ops. In the absence of those env vars (the default for both the static export and any unprovisioned dynamic deployment), Firebase is **effectively dormant**.
- There is no Firestore read in the codebase. The mirror is write-only.

### Q7 — Which server endpoints use Firebase Admin?

**Answer: The dual-write helpers in `src/lib/firebase/sync.ts` are invoked from server routes that mutate user, progress, exam-attempt, exercise-attempt, and feedback-report state. There is no isolated "Firebase route"; the calls are inline in the dynamic LMS API.**

- Public surface of `sync.ts`: `syncUser`, `syncProgress`, `syncExamAttempt`, `syncExerciseAttempt`, `syncFeedbackReport`.
- Each helper delegates to `upsertDoc(collection, id, data)`, which is the only Firebase Admin entry point. `getFirestoreDb()` (`admin.ts` lines 94–105) is the singleton accessor.
- The static export never imports these helpers — they live behind `if (!IS_STATIC_SITE)` gates in the API routes.

### Q8 — Which data is written to Firestore?

**Answer: Five collections — `users`, `progress`, `examAttempts`, `exerciseAttempts`, `feedbackReports` — all mirrored from Prisma writes.**

- Declared in `src/lib/firebase/sync.ts` lines 8–14 (`COLLECTIONS`).
- Each document carries `_syncedAt` and `_source: "pyarcana-api"` audit fields (sync.ts line 50–51).
- `syncUser()` deliberately omits `passwordHash` (sync.ts line 61 comment: *"Public profile only — never write passwordHash to Firestore."*).
- Subscription, Payment, QuestionBank, and (the not-yet-existing) BadgeAward are **not** mirrored. If a supervisor feature is added later, the mirror will need a deliberate extension.

### Q9 — Can browser clients access Firestore?

**Answer: No. `firestore.rules` denies all client access.**

- The entire `firestore.rules` file (8 lines):
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if false;
      }
    }
  }
  ```
- Combined with Q6 (no read path on the server either), Firestore currently functions as a **write-only audit log** that nothing reads back. The deny-all client rule is the correct posture given that posture.

### Q10 — What is the current production database?

**Answer: SQLite via `file:./db/custom.db` (dev/local only). No production database is deployed.**

- `prisma/schema.prisma` lines 8–11:
  ```
  datasource db {
    provider = "sqlite"
    url      = env("DATABASE_URL")
  }
  ```
- `.env.example` line 2: `DATABASE_URL="file:./db/custom.db"`.
- The `.github/workflows/deploy.yml` workflow builds the static export only; it does **not** provision any database, run any Prisma migration, or deploy a Node host. The dynamic LMS therefore has no production DB.

### Q11 — Which deployment is actually live?

**Answer: Only the static GitHub Pages export at https://pillb.github.io/pyarcana/.**

- `.github/workflows/deploy.yml` job `deploy` uses `actions/deploy-pages@v4` and publishes the `./out` artifact produced by `bun run build:static` with `NEXT_PUBLIC_BASE_PATH: /pyarcana`.
- The workflow triggers on push to `main` (the YAML rendering in this report shows `branches: ain]` — a markdown-rendering artefact of the literal `branches: [main]`).
- No Vercel/Netlify/Fly/Render deployment is configured. `vercel.json` exists but is unused by the GitHub Pages pipeline.

### Q12 — Is the dynamic LMS publicly deployed?

**Answer: No.**

- The dynamic LMS (Next.js + Prisma + NextAuth + Firebase Admin) requires a Node host with `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and (optionally) Firebase Admin credentials. None of these are provisioned in any workflow.
- Local development is the only mode in which the dynamic LMS runs today. The Team-plan promise of "manager progress reports" presupposes a dynamic deployment that does not yet exist publicly.

### Q13 — Which administrator credentials are available?

**Answer: None are committed. Admins are provisioned out of band against the local SQLite file; E2E tests rely on `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` env vars.**

- `prisma/seed.ts` line 15696: `"No users or credentials were created. Provision operators out of band."`
- `scripts/e2e_max/helpers/auth.ts` reads:
  ```ts
  export const E2E_ADMIN = {
    email: process.env.E2E_ADMIN_EMAIL || '',
    password: process.env.E2E_ADMIN_PASSWORD || '',
  }
  ```
  These env vars must be populated by the operator before running E2E tests; there is no fallback and no seeded admin.
- `src/lib/auth.ts` line 79: `secret: process.env.NEXTAUTH_SECRET` with the comment *"There is deliberately no fallback. Deployments must provide a unique, high-entropy secret through their environment."*
- A constant-velocity bcrypt compare against `DUMMY_PASSWORD_HASH` is used so that unknown-user and wrong-password take the same time (auth.ts lines 6–8, 28–34) — this is a timing-attack mitigation, not a credential.

### Q14 — Are badge and supervisor features visible in the static export?

**Answer: No supervisor features exist anywhere. Badge eligibility engine exists in code but there is no badge-award UI surface in the static export.**

- **Supervisor:** A repository-wide `grep -rE "role.*SUPERVISOR|role.*MENTOR|cohort|Cohort" src/ prisma/` finds:
  - `src/lib/admin-analytics.ts` lines 326–355 — `cohorts` is a **computed analytics filter** (e.g. `active_7d`, `at_risk`, `phase1`), not a user-assignable cohort with managers.
  - Several hits inside `src/lib/course/sections/s17-packaging.ts` — these are pandas-cohort concepts in curriculum content, not product features.
  - The Team plan's `featuresJSON` includes `"Reportes de progreso para managers"` and `"Mentoría 1:1 mensual (30 min)"` — these are **marketing bullets** with no corresponding route or model.
  - `User.role` accepts only `STUDENT | ADMIN`. There is no `SUPERVISOR`, `MENTOR`, or `MANAGER` role.
- **Badges:** The catalog JSON ships to the static export, and the eligibility engine can run client-side on a `LearnerProgress` object. But:
  - There is no Prisma `BadgeAward` model, so no awards persist on the server.
  - There is no static-site badge gallery or "your badges" component wired to the catalog. The static site currently surfaces progress as section checkmarks and self-check scores, not as awarded badges.

### Q15 — Which legacy fixtures are required for migration tests?

**Answer: The four persisted entity types a learner can already have on a dynamic deployment — `User`, `Progress`, `ExamAttempt`, `Subscription` (plus `ExerciseAttempt`, `Payment`, `FeedbackReport`, `QuestionBank` for completeness).**

- A badge-award migration must not invalidate existing `Progress` rows (keyed by `userId × sectionId × subStep`).
- A supervisor/cohort migration must not invalidate existing `User` rows or force a role change for current `STUDENT` users.
- A subscription-state migration must preserve `Subscription.status`, `currentPeriodEnd`, and `provider`/`providerSubId` for active subscribers.
- `ExamAttempt.attemptNumber` uniqueness (`@@unique([userId, sectionId, attemptNumber])`) must survive any schema evolution; badge floors cite `section_exam_pct ≥ 85` against this table.
- The `QuestionBank` is reseeded by `prisma/seed.ts` (`prisma.questionBank.deleteMany({})` at line 15544). Migration tests must not depend on questionBank identity beyond `(sectionId, concept, variant)`; they should treat the question bank as replaceable.

---

## Cross-cutting findings (not asked, but unavoidable)

1. **The Team plan is sold on features the code does not implement.** `"Reportes de progreso para managers"` and `"Mentoría 1:1 mensual"` are surfaced in the seeded plan featuresJSON but have no backing route, model, or scheduled job. This is the single biggest product-hardening gap and the primary motivator for Phase 2 supervisor research.
2. **Firebase is a write-only mirror with no consumer.** Either retire it explicitly (decision record) or wire a read path (e.g. an admin dashboard that joins Prisma + Firestore for cross-region reporting). Carrying it as dormant code is a maintenance liability.
3. **The eligibility engine produces awards that nothing persists.** Until a `BadgeAward` Prisma model and an issuing API route exist, the 31-badge catalog is a specification, not a product feature.
4. **The static/dynamic split is sharp.** Any supervisor or cohort feature that requires server-side state (which it will) is **unshippable on the public site until the dynamic LMS is publicly deployed**. Phase 2 product requirements must call out this deployment prerequisite.
5. **No MFA, no email verification, no OAuth.** Supervisor features that gate access to learner data will need stronger auth than the current single-factor credentials provider.

---

## Acceptance criteria for this report

- [x] All 15 questions answered with primary-source citations.
- [x] Every "no" answer is backed by a `grep`/read of the relevant file.
- [x] Every "yes" answer cites the file and line where the feature is implemented.
- [x] Distinguish between **marketing copy** (e.g. Team plan feature bullet) and **implemented behaviour** (code path). Where the two disagree, the code wins and the marketing copy is flagged.
- [x] No source code is modified. This is a read-only Phase 0.

---

## Next phases (preview)

- **Phase 1** revalidates the 31-badge catalog against `industry_reality_brief.md` and `curriculum_gap_matrix.md` and produces a claim matrix (retain / rename / strengthen / split / merge / retire) per badge.
- **Phase 2** researches supervisor/cohort features in competitor LMS platforms (Coursera, Udemy Business, Pluralsight, DataCamp, Codecademy) and produces a product-requirements document scoped to what PyArcana can honestly ship given Q10–Q12 above.
- **Phase 3+** (out of scope for this run) will design the schema, API, and UI for the supervisor/cohort feature, plus the `BadgeAward` persistence model.
