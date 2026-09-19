"""The exam grading migration is additive and marks every existing attempt as graded before the fix.

20260918230000_exam_grading_integrity adds ExamAttempt.gradingVersion and the ExamAttemptForm
table. Rows that exist when it runs were graded, if at all, by the code that trusted the question
ids the client sent, so they must come out as version 0, with nothing else about them changed.
These build a real SQLite database from the committed migrations, put attempts in it first, and
then apply this one. Dates are INTEGER milliseconds, as Prisma stores DateTime on SQLite.
"""
from __future__ import annotations

import sqlite3
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MIGRATIONS = ROOT / "prisma" / "migrations"
THIS = MIGRATIONS / "20260918230000_exam_grading_integrity" / "migration.sql"

SEP_01 = 1788220800000  # ms since the epoch


def db_before_this() -> sqlite3.Connection:
    db = sqlite3.connect(":memory:", isolation_level=None)
    db.execute("PRAGMA foreign_keys = ON")
    for sql in sorted(MIGRATIONS.glob("*/migration.sql")):
        if sql == THIS:
            break
        db.executescript(sql.read_text(encoding="utf-8"))
    return db


def seed(db: sqlite3.Connection) -> None:
    db.execute("""INSERT INTO "User" ("id","email","updatedAt") VALUES ('u1','a@example.invalid', 0)""")
    db.execute(f"""INSERT INTO "ExamAttempt"
        ("id","userId","sectionId","attemptNumber","answers","score","startedAt","completedAt","timeSpentSec","variantSeed")
        VALUES ('done','u1','setup',1,'[{{"correct":true}}]',100,{SEP_01},{SEP_01},300,'[]'),
               ('open','u1','setup',2,'[]',0,{SEP_01},NULL,0,'[]')""")


class ExamGradingMigration(unittest.TestCase):
    def setUp(self) -> None:
        self.db = db_before_this()
        seed(self.db)
        self.before = self.db.execute('SELECT * FROM "ExamAttempt" ORDER BY "id"').fetchall()
        self.db.executescript(THIS.read_text(encoding="utf-8"))

    def test_runs_after_the_section_id_rename(self) -> None:
        # Sorted order is how prisma migrate and these tests apply migrations; the rename moves
        # ExamAttempt rows, and this must see them where it left them.
        order = sorted(MIGRATIONS.glob("*/migration.sql"))
        rename = MIGRATIONS / "20260918030000_rename_section_ids_batch_a" / "migration.sql"
        self.assertLess(order.index(rename), order.index(THIS))

    def test_existing_attempts_become_version_0_and_keep_every_value(self) -> None:
        after = self.db.execute('SELECT * FROM "ExamAttempt" ORDER BY "id"').fetchall()
        cols = [c[1] for c in self.db.execute('PRAGMA table_info("ExamAttempt")')]
        self.assertEqual(cols[-2:], ["gradingVersion", "exposedItems"])
        self.assertEqual([row[:-2] for row in after], self.before)
        # Every existing attempt was graded by the old code, and none was drawn knowing what it saw.
        self.assertEqual([row[-2:] for row in after], [(0, 0), (0, 0)])

    def test_new_rows_default_to_version_0(self) -> None:
        self.db.execute(f"""INSERT INTO "ExamAttempt"
            ("id","userId","sectionId","attemptNumber","answers","score","startedAt","variantSeed")
            VALUES ('later','u1','setup',3,'[]',0,{SEP_01},'[]')""")
        row = self.db.execute("""SELECT "gradingVersion", "exposedItems" FROM "ExamAttempt" WHERE "id"='later'""").fetchone()
        self.assertEqual(row, (0, 0))

    def test_a_form_belongs_to_one_attempt_and_goes_with_it(self) -> None:
        self.db.execute("""INSERT INTO "ExamAttemptForm" ("attemptId","items") VALUES ('open','[]')""")
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("""INSERT INTO "ExamAttemptForm" ("attemptId","items") VALUES ('open','[]')""")
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("""INSERT INTO "ExamAttemptForm" ("attemptId","items") VALUES ('missing','[]')""")
        self.db.execute("""DELETE FROM "ExamAttempt" WHERE "id"='open'""")
        self.assertEqual(self.db.execute('SELECT COUNT(*) FROM "ExamAttemptForm"').fetchone(), (0,))


if __name__ == "__main__":
    unittest.main()
