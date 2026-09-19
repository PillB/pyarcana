-- Exam grading integrity (red-team finding exam-submit-grades-client-chosen-questions).
--
-- Additive only: one column with a default and one new table. No row is rewritten or removed.
--
-- gradingVersion records how exam/submit graded a row. Every row that exists when this runs was
-- graded, if at all, by the code that trusted the question ids the client sent, so it takes 0 and
-- carries no weight as evidence. Rows graded over the drawn questions are written with 1.
-- ALTER TABLE ... ADD COLUMN instead of Prisma's table rebuild: the resulting schema is the same,
-- and no attempt row is copied.
ALTER TABLE "ExamAttempt" ADD COLUMN "gradingVersion" INTEGER NOT NULL DEFAULT 0;

-- The questions each attempt showed, with their key, captured by exam/start.
CREATE TABLE "ExamAttemptForm" (
    "attemptId" TEXT NOT NULL PRIMARY KEY,
    "items" TEXT NOT NULL,
    CONSTRAINT "ExamAttemptForm_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ExamAttempt" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
