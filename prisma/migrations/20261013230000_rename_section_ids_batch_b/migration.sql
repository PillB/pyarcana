-- Section id rename, batch B (S40): carry every server-side row from `agentic-architecture` to
-- `architecture-ddd-decisions`.
--
-- Section 40's slug came from the same pre-V3 curriculum as batch A's, and its file and `id` were
-- renamed to `architecture-ddd-decisions` to match its title ("Arquitectura, DDD y decisiones
-- técnicas"). Batch A covered S01-S13 only, so the old slug never reached
-- src/lib/section-id-migrations.ts (SECTION_ID_RENAMES): a database that stored S40 under it kept
-- those rows under a key the app no longer reads. The question bank was one of them: before
-- prisma/seed.ts was corrected, section 40's questions were seeded under `agentic-architecture`,
-- while the exam page asks for `architecture-ddd-decisions` (industry_alignment DIV-001). The owner
-- decided to map it (OWNER_DECISIONS.md, O25) so old progress and old links keep working.
--
-- It is the same script as batch A with one pair, and it follows batch A's rules, which are worth
-- repeating because they are the reason it is shaped this way:
--   Progress     PRIMARY KEY (userId, sectionId, subStep) - where a learner holds both slugs, the
--                newer, new-slug row wins, so a step they un-ticked after the deploy stays un-ticked.
--   ExamAttempt  UNIQUE (userId, sectionId, attemptNumber) - the new-slug attempts are numbered after
--                the old ones, which happened first.
--   QuestionBank is seed content and ExamAttempt.variantSeed holds question ids that exam/submit looks
--                up (an attempt with no saved form is graded against the bank), so no question row is
--                deleted: an old row moves to the new slug unless the reseed already created its
--                twin, in which case it stays where it is - no longer drawn into new exams, still
--                resolvable for the attempts that used it.
--
-- How it reaches a database. `prisma migrate deploy` applies it once, from the migration history.
-- A database created with `db:push` has no history, so `db:push` also runs every
-- rename_section_ids_* file through `prisma db execute` (scripts/apply_section_id_renames.mjs),
-- in name order: batch A, then this one. It must stay idempotent: a second run finds nothing under the
-- old slug and changes nothing. It runs as one IMMEDIATE transaction with a TEMP helper table, so a
-- failure partway leaves every table as it was and the script can simply be run again.
--
-- Deliberately not migrated, as in batch A: the Firestore mirror (src/lib/firebase/sync.ts), and a PDF
-- report generated from a tab opened before the deploy.
--
-- NEVER edit this file once it has been applied: `migrate deploy` would skip the change silently
-- and `migrate dev` would demand a reset. Later rename batches get their own
-- rename_section_ids_* migration, and a test checks that the union of all of them equals
-- SECTION_ID_RENAMES.

BEGIN IMMEDIATE;

CREATE TEMP TABLE "_SectionIdRename" ("old" TEXT NOT NULL PRIMARY KEY, "new" TEXT NOT NULL);
INSERT INTO "_SectionIdRename" ("old", "new") VALUES
  ('agentic-architecture', 'architecture-ddd-decisions');

-- Progress ------------------------------------------------------------------------------------
-- 1. Where a learner already has the new-slug row, that row wins: it was written after the
--    rename, so it holds their latest choice. The one thing taken from the old row is the
--    completion time, and only when both sides are complete: the step was first done earlier.
UPDATE "Progress" SET
  "completedAt" = (
    SELECT MIN(COALESCE("Progress"."completedAt", o."completedAt"),
               COALESCE(o."completedAt", "Progress"."completedAt"))
    FROM "Progress" o JOIN "_SectionIdRename" r ON o."sectionId" = r."old"
    WHERE r."new" = "Progress"."sectionId" AND o."userId" = "Progress"."userId"
      AND o."subStep" = "Progress"."subStep" AND o."completed")
WHERE "sectionId" IN (SELECT "new" FROM "_SectionIdRename")
  AND "completed"
  AND EXISTS (
    SELECT 1 FROM "Progress" o JOIN "_SectionIdRename" r ON o."sectionId" = r."old"
    WHERE r."new" = "Progress"."sectionId" AND o."userId" = "Progress"."userId"
      AND o."subStep" = "Progress"."subStep" AND o."completed");

-- 2. The folded old rows are now redundant.
DELETE FROM "Progress"
WHERE "sectionId" IN (SELECT "old" FROM "_SectionIdRename")
  AND EXISTS (
    SELECT 1 FROM "Progress" n JOIN "_SectionIdRename" r ON n."sectionId" = r."new"
    WHERE r."old" = "Progress"."sectionId" AND n."userId" = "Progress"."userId"
      AND n."subStep" = "Progress"."subStep");

-- 3. Everything left under the old slug moves.
UPDATE "Progress"
SET "sectionId" = (SELECT "new" FROM "_SectionIdRename" WHERE "old" = "Progress"."sectionId")
WHERE "sectionId" IN (SELECT "old" FROM "_SectionIdRename");

-- ExamAttempt ---------------------------------------------------------------------------------
-- Where a learner has attempts under both slugs, number the new-slug ones after the old ones.
-- SQLite checks UNIQUE row by row, so shifting in place would collide on the way; going through
-- negative numbers first cannot collide with any existing (positive) number.
UPDATE "ExamAttempt" SET "attemptNumber" = -("attemptNumber" + (
    SELECT MAX(o."attemptNumber") FROM "ExamAttempt" o JOIN "_SectionIdRename" r ON o."sectionId" = r."old"
    WHERE r."new" = "ExamAttempt"."sectionId" AND o."userId" = "ExamAttempt"."userId"))
WHERE "sectionId" IN (SELECT "new" FROM "_SectionIdRename")
  AND EXISTS (
    SELECT 1 FROM "ExamAttempt" o JOIN "_SectionIdRename" r ON o."sectionId" = r."old"
    WHERE r."new" = "ExamAttempt"."sectionId" AND o."userId" = "ExamAttempt"."userId");
UPDATE "ExamAttempt" SET "attemptNumber" = -"attemptNumber" WHERE "attemptNumber" < 0;
UPDATE "ExamAttempt"
SET "sectionId" = (SELECT "new" FROM "_SectionIdRename" WHERE "old" = "ExamAttempt"."sectionId")
WHERE "sectionId" IN (SELECT "old" FROM "_SectionIdRename");

-- QuestionBank --------------------------------------------------------------------------------
UPDATE "QuestionBank"
SET "sectionId" = (SELECT "new" FROM "_SectionIdRename" WHERE "old" = "QuestionBank"."sectionId")
WHERE "sectionId" IN (SELECT "old" FROM "_SectionIdRename")
  AND NOT EXISTS (
    SELECT 1 FROM "QuestionBank" n JOIN "_SectionIdRename" r ON n."sectionId" = r."new"
    WHERE r."old" = "QuestionBank"."sectionId" AND n."concept" = "QuestionBank"."concept"
      AND n."variant" = "QuestionBank"."variant");

-- Tables with no uniqueness over sectionId ----------------------------------------------------
UPDATE "ExerciseAttempt"
SET "sectionId" = (SELECT "new" FROM "_SectionIdRename" WHERE "old" = "ExerciseAttempt"."sectionId")
WHERE "sectionId" IN (SELECT "old" FROM "_SectionIdRename");

UPDATE "SelfCheckAttempt"
SET "sectionId" = (SELECT "new" FROM "_SectionIdRename" WHERE "old" = "SelfCheckAttempt"."sectionId")
WHERE "sectionId" IN (SELECT "old" FROM "_SectionIdRename");

UPDATE "ContentVersion"
SET "sectionId" = (SELECT "new" FROM "_SectionIdRename" WHERE "old" = "ContentVersion"."sectionId")
WHERE "sectionId" IN (SELECT "old" FROM "_SectionIdRename");

UPDATE "FeedbackReport"
SET "sectionId" = (SELECT "new" FROM "_SectionIdRename" WHERE "old" = "FeedbackReport"."sectionId")
WHERE "sectionId" IN (SELECT "old" FROM "_SectionIdRename");

UPDATE "AnalyticsEvent"
SET "sectionId" = (SELECT "new" FROM "_SectionIdRename" WHERE "old" = "AnalyticsEvent"."sectionId")
WHERE "sectionId" IN (SELECT "old" FROM "_SectionIdRename");

DROP TABLE "_SectionIdRename";

COMMIT;
