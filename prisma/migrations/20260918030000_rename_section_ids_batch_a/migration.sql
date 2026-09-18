-- Section id rename, batch A (S01-S13): carry every server-side row to the new slugs.
--
-- The slugs came from a pre-V3 curriculum and were renamed to describe what each section
-- teaches (src/lib/section-id-migrations.ts, SECTION_ID_RENAMES). localStorage is migrated on
-- the client; this does the same for the database, so a signed-in learner on a new browser does
-- not see completed work under keys the app no longer reads, and continuing does not create a
-- second, parallel set of rows under the new keys.
--
-- Two tables need more than an UPDATE, because a learner who used the app on both sides of the
-- deploy can already hold rows under the old and the new slug:
--   Progress     PRIMARY KEY (userId, sectionId, subStep) - the newer, new-slug row wins.
--   ExamAttempt  UNIQUE (userId, sectionId, attemptNumber) - number the new-slug attempts after
--                the old ones, which happened first.
-- QuestionBank is seed content and ExamAttempt.variantSeed holds question ids that exam/submit
-- looks up, so no question row is deleted: an old row moves to the new slug unless the reseed
-- already created its twin, in which case it stays where it is - no longer drawn into new exams,
-- still resolvable for the attempts that used it.
--
-- How it reaches a database. `prisma migrate deploy` applies it once, from the migration history.
-- A database created with `db:push` has no history, so `db:push` also runs every
-- rename_section_ids_* file through `prisma db execute` (scripts/apply_section_id_renames.mjs).
-- That is why this script must stay idempotent: a second run finds nothing under an old slug and
-- changes nothing. It runs as one IMMEDIATE transaction with a TEMP helper table, so a failure
-- partway - a UNIQUE clash with a write that landed mid-run, a busy database - leaves every table
-- as it was and the script can simply be run again.
--
-- Deliberately not migrated:
--   - the Firestore mirror (src/lib/firebase/sync.ts). The app never reads it; its progress
--     documents keep their old-slug ids until the learner's next write re-syncs them.
--   - a PDF report generated from a tab opened before the deploy: that bundle's SECTION_NAMES
--     uses the old slugs, so its per-section table shows S03-S13 empty. Reloading fixes it.
--
-- NEVER edit this file once it has been applied: `migrate deploy` would skip the change silently
-- and `migrate dev` would demand a reset. Later rename batches get their own
-- rename_section_ids_* migration, and a test checks that the union of all of them equals
-- SECTION_ID_RENAMES.

BEGIN IMMEDIATE;

CREATE TEMP TABLE "_SectionIdRename" ("old" TEXT NOT NULL PRIMARY KEY, "new" TEXT NOT NULL);
INSERT INTO "_SectionIdRename" ("old", "new") VALUES
  ('data-structures', 'decisions-rules'),
  ('functions-modules', 'iteration-summaries'),
  ('oop', 'functions-contracts'),
  ('numpy', 'collections'),
  ('data-acquisition', 'text-unicode-regex'),
  ('pandas', 'files-ingestion'),
  ('visualization', 'exceptions-logging'),
  ('sklearn', 'modules-packaging-cli'),
  ('testing', 'oop-domain'),
  ('performance', 'apis-sql-geo'),
  ('rpa-automation', 'evidence-dashboard');

-- Progress ------------------------------------------------------------------------------------
-- 1. Where a learner already has the new-slug row, that row wins: it was written after the
--    rename, so it holds their latest choice. OR-ing the old row in brought back a step they
--    had un-ticked or a bookmark they had removed. The one thing taken from the old row is the
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

-- 3. Everything left under an old slug moves.
UPDATE "Progress"
SET "sectionId" = (SELECT "new" FROM "_SectionIdRename" WHERE "old" = "Progress"."sectionId")
WHERE "sectionId" IN (SELECT "old" FROM "_SectionIdRename");

-- ExamAttempt ---------------------------------------------------------------------------------
-- Where a learner has attempts under both slugs, number the new-slug ones after the old ones.
-- SQLite checks UNIQUE row by row, so shifting 1,2 by +1 in place would collide on the way;
-- going through negative numbers first cannot collide with any existing (positive) number.
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
