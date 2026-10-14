"""The database follows the S01-S13 slug rename, and nothing a learner did is lost or undone.

Review on #63 pointed out that the rename migrated localStorage only: `/api/progress` still
returned rows keyed `oop`, the app now reads `functions-contracts`, and a signed-in learner on a
new browser saw completed work vanish. The first fix was then verified adversarially, which found
it OR-ed a learner's un-tick back into existence, could leave half-applied state on failure, and
never ran at all on a database built with `db:push`. These pin each of those.

They build a real SQLite database from the committed migrations. Dates are INTEGER milliseconds,
because that is how Prisma stores DateTime on SQLite; a text-date fixture let a date-mangling
edit pass while it would null every folded time in production.
"""
from __future__ import annotations

import json
import re
import sqlite3
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MIGRATIONS = ROOT / "prisma" / "migrations"
RENAME = MIGRATIONS / "20260918030000_rename_section_ids_batch_a" / "migration.sql"
RENAME_B = MIGRATIONS / "20261013230000_rename_section_ids_batch_b" / "migration.sql"
TS_MAP = ROOT / "src" / "lib" / "section-id-migrations.ts"

SEP_01, SEP_02, SEP_20 = 1788220800000, 1788307200000, 1789862400000  # ms since the epoch

#: Batch A, frozen. This migration can never change once applied, so its pairs are pinned here
#: rather than compared with the live map, which later batches append to.
BATCH_A = {
    "data-structures": "decisions-rules", "functions-modules": "iteration-summaries",
    "oop": "functions-contracts", "numpy": "collections", "data-acquisition": "text-unicode-regex",
    "pandas": "files-ingestion", "visualization": "exceptions-logging",
    "sklearn": "modules-packaging-cli", "testing": "oop-domain", "performance": "apis-sql-geo",
    "rpa-automation": "evidence-dashboard",
}


#: Batch B (S40, owner decision O25), frozen like batch A.
BATCH_B = {"agentic-architecture": "architecture-ddd-decisions"}


def migrated_db(stop_at: Path = RENAME) -> sqlite3.Connection:
    """A database built from every committed migration that sorts before `stop_at`."""
    db = sqlite3.connect(":memory:", isolation_level=None)
    db.execute("PRAGMA foreign_keys = ON")
    for sql in sorted(MIGRATIONS.glob("*/migration.sql")):
        if sql == stop_at:
            break
        db.executescript(sql.read_text(encoding="utf-8"))
    return db


def seed(db: sqlite3.Connection) -> None:
    ins = db.execute
    ins("""INSERT INTO "User" ("id","email","updatedAt") VALUES ('u1','a@example.invalid', 0),
           ('u2','b@example.invalid', 0)""")
    ins(f"""INSERT INTO "Progress" ("userId","sectionId","subStep","completed","completedAt","bookmarked") VALUES
        -- old slug only: moves
        ('u1','oop','theory',1,{SEP_01},0),
        -- new slug only: untouched
        ('u1','functions-contracts','ido',1,{SEP_20},0),
        -- both, both complete: new row kept, the earlier completion time kept
        ('u1','oop','wedo',1,{SEP_02},0),
        ('u1','functions-contracts','wedo',1,{SEP_20},0),
        -- both: completed before the deploy, un-ticked after it. The un-tick must survive.
        ('u1','oop','youdo',1,{SEP_01},0),
        ('u1','functions-contracts','youdo',0,NULL,0),
        -- both: bookmarked before, bookmark removed after. The removal must survive.
        ('u1','oop','bookmark',0,NULL,1),
        ('u1','functions-contracts','bookmark',0,NULL,0),
        ('u2','numpy','quiz',0,NULL,1)""")
    for n, slug in [(1, 'oop'), (2, 'oop'), (1, 'functions-contracts'), (2, 'functions-contracts')]:
        ins("""INSERT INTO "ExamAttempt" ("id","userId","sectionId","attemptNumber","answers","score","variantSeed")
               VALUES (?, 'u1', ?, ?, '[]', 0.5, '[]')""", (f"e-{slug}-{n}", slug, n))
    ins("""INSERT INTO "QuestionBank" ("id","sectionId","concept","variant","question","options","correctIndex","explanation") VALUES
           ('q1-old','oop','def',1,'?','[]',0,'-'),
           ('q1-new','functions-contracts','def',1,'?','[]',0,'-'),
           ('q2-old','oop','return',1,'?','[]',0,'-')""")
    ins("""INSERT INTO "ExerciseAttempt" ("id","userId","sectionId","exerciseId","correct")
           VALUES ('x1','u1','pandas','S08-T1-A-E1',1)""")


def snapshot(db: sqlite3.Connection) -> list:
    return [db.execute(f'SELECT * FROM "{t}" ORDER BY 1,2,3').fetchall()
            for t in ("Progress", "ExamAttempt", "QuestionBank", "ExerciseAttempt")]


class SectionIdDbMigrationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.db = migrated_db()
        seed(self.db)
        self.sql = RENAME.read_text(encoding="utf-8")
        self.db.executescript(self.sql)

    def rows(self, sql: str) -> list[tuple]:
        return self.db.execute(sql).fetchall()

    def test_no_row_is_left_under_an_old_slug_except_a_twinned_question(self) -> None:
        old = "(" + ",".join(f"'{k}'" for k in BATCH_A) + ")"
        for table in ("Progress", "ExamAttempt", "ExerciseAttempt"):
            self.assertEqual(self.rows(f'SELECT COUNT(*) FROM "{table}" WHERE "sectionId" IN {old}'), [(0,)], table)
        self.assertEqual(self.rows(f'SELECT "id" FROM "QuestionBank" WHERE "sectionId" IN {old}'), [("q1-old",)])

    def test_the_newer_row_wins_so_nothing_the_learner_undid_comes_back(self) -> None:
        got = self.rows("""SELECT "userId","sectionId","subStep","completed","completedAt","bookmarked"
                           FROM "Progress" ORDER BY 1,2,3""")
        self.assertEqual(got, [
            ("u1", "functions-contracts", "bookmark", 0, None, 0),   # removal survives
            ("u1", "functions-contracts", "ido", 1, SEP_20, 0),
            ("u1", "functions-contracts", "theory", 1, SEP_01, 0),
            ("u1", "functions-contracts", "wedo", 1, SEP_02, 0),     # earlier completion kept
            ("u1", "functions-contracts", "youdo", 0, None, 0),      # un-tick survives
            ("u2", "collections", "quiz", 0, None, 1),
        ])

    def test_completion_times_stay_integers(self) -> None:
        self.assertEqual(self.rows("""SELECT DISTINCT typeof("completedAt") FROM "Progress"
                                      WHERE "completedAt" IS NOT NULL"""), [("integer",)])

    def test_exam_attempts_keep_their_order_and_stay_unique(self) -> None:
        got = self.rows("""SELECT "id","attemptNumber" FROM "ExamAttempt"
                           WHERE "userId"='u1' AND "sectionId"='functions-contracts' ORDER BY 2""")
        self.assertEqual(got, [("e-oop-1", 1), ("e-oop-2", 2),
                               ("e-functions-contracts-1", 3), ("e-functions-contracts-2", 4)])

    def test_a_question_referenced_by_past_attempts_is_never_deleted(self) -> None:
        self.assertEqual({r[0] for r in self.rows('SELECT "id" FROM "QuestionBank"')},
                         {"q1-old", "q1-new", "q2-old"})
        self.assertEqual(self.rows("""SELECT "sectionId" FROM "QuestionBank" WHERE "id"='q2-old'"""),
                         [("functions-contracts",)])

    def test_a_second_run_changes_nothing(self) -> None:
        # db:push re-runs the rename every time it is called, so it has to be a no-op the second time.
        before = snapshot(self.db)
        self.db.executescript(self.sql)
        self.assertEqual(snapshot(self.db), before)

    def test_the_helper_table_is_gone(self) -> None:
        self.assertEqual(self.rows("""SELECT name FROM sqlite_master WHERE name='_SectionIdRename'"""), [])
        self.assertEqual(self.rows("""SELECT name FROM sqlite_temp_master WHERE name='_SectionIdRename'"""), [])


class AllOrNothingTests(unittest.TestCase):
    def test_a_failure_partway_leaves_every_table_as_it_was_and_a_retry_works(self) -> None:
        """A write landing mid-run, or a busy database, used to leave the data half-migrated."""
        db = migrated_db()
        seed(db)
        before = snapshot(db)
        sql = RENAME.read_text(encoding="utf-8")
        broken = sql.replace("COMMIT;", 'INSERT INTO "NoSuchTable" VALUES (1);\nCOMMIT;')
        with self.assertRaises(sqlite3.OperationalError):
            db.executescript(broken)
        db.execute("ROLLBACK")
        self.assertEqual(snapshot(db), before, "a failed run must not leave partial changes")
        db.executescript(sql)  # the helper table is TEMP and rolled back, so a retry starts clean
        self.assertEqual(db.execute("""SELECT COUNT(*) FROM "Progress" WHERE "sectionId"='oop'""").fetchone(), (0,))


OLD_40, NEW_40 = "agentic-architecture", "architecture-ddd-decisions"

#: Every table that names a section, and the column that does.
SECTION_TABLES = ("Progress", "ExamAttempt", "QuestionBank", "ExerciseAttempt",
                  "SelfCheckAttempt", "ContentVersion", "FeedbackReport", "AnalyticsEvent")


def seed_s40(db: sqlite3.Connection) -> None:
    """A learner who used S40 under both slugs, and one row in every table that names a section."""
    ins = db.execute
    ins("""INSERT INTO "User" ("id","email","updatedAt") VALUES ('u1','a@example.invalid', 0),
           ('u2','b@example.invalid', 0)""")
    ins(f"""INSERT INTO "Progress" ("userId","sectionId","subStep","completed","completedAt","bookmarked") VALUES
        -- old slug only: moves
        ('u1','{OLD_40}','theory',1,{SEP_01},0),
        -- new slug only: untouched
        ('u1','{NEW_40}','ido',1,{SEP_20},0),
        -- both, both complete: the earlier completion time is kept
        ('u1','{OLD_40}','wedo',1,{SEP_02},0),
        ('u1','{NEW_40}','wedo',1,{SEP_20},0),
        -- both: completed before the deploy, un-ticked after it. The un-tick must survive.
        ('u1','{OLD_40}','youdo',1,{SEP_01},0),
        ('u1','{NEW_40}','youdo',0,NULL,0),
        -- another section: never touched
        ('u1','security','theory',1,{SEP_01},0),
        ('u2','{OLD_40}','quiz',0,NULL,1)""")
    for aid, user, slug, n in [("e-old-1", "u1", OLD_40, 1), ("e-old-2", "u1", OLD_40, 2),
                               ("e-new-1", "u1", NEW_40, 1), ("e-u2-old-1", "u2", OLD_40, 1)]:
        ins("""INSERT INTO "ExamAttempt" ("id","userId","sectionId","attemptNumber","answers","score","variantSeed")
               VALUES (?, ?, ?, ?, '[]', 0.5, '[]')""", (aid, user, slug, n))
    ins("""INSERT INTO "ExamAttemptForm" ("attemptId","items") VALUES ('e-old-1','[]')""")
    ins(f"""INSERT INTO "QuestionBank" ("id","sectionId","concept","variant","question","options","correctIndex","explanation") VALUES
           ('q-old-twin','{OLD_40}','adr',1,'?','[]',0,'-'),
           ('q-new-twin','{NEW_40}','adr',1,'?','[]',0,'-'),
           ('q-old-only','{OLD_40}','ddd',1,'?','[]',0,'-')""")
    ins(f"""INSERT INTO "ExerciseAttempt" ("id","userId","sectionId","exerciseId","correct")
           VALUES ('x1','u1','{OLD_40}','S40-T1-A-E1',1)""")
    ins(f"""INSERT INTO "SelfCheckAttempt" ("id","userId","sectionId","questionIndex","selectedIndex","correctIndex","isCorrect")
           VALUES ('s1','u1','{OLD_40}',0,1,1,1)""")
    ins(f"""INSERT INTO "ContentVersion" ("id","sectionId","version","contentHash") VALUES ('c1','{OLD_40}','1','h')""")
    ins(f"""INSERT INTO "FeedbackReport" ("id","type","title","body","sectionId","updatedAt")
           VALUES ('f1','BUG','t','b','{OLD_40}',0)""")
    ins(f"""INSERT INTO "AnalyticsEvent" ("id","eventName","eventCategory","sectionId")
           VALUES ('a1','view','nav','{OLD_40}')""")


def snapshot_s40(db: sqlite3.Connection) -> list:
    return [sorted(db.execute(f'SELECT * FROM "{t}"').fetchall(), key=repr) for t in SECTION_TABLES + ("ExamAttemptForm",)]


class BatchBDbMigrationTests(unittest.TestCase):
    """Batch B moves S40 from its pre-V3 slug to its own, in every table, and loses nothing a learner did."""

    def setUp(self) -> None:
        # Everything that sorts before batch B has run: batch A and the exam-grading migration.
        self.db = migrated_db(RENAME_B)
        seed_s40(self.db)
        self.sql = RENAME_B.read_text(encoding="utf-8")
        self.db.executescript(self.sql)

    def rows(self, sql: str) -> list[tuple]:
        return self.db.execute(sql).fetchall()

    def test_no_row_is_left_under_the_old_slug_except_a_twinned_question(self) -> None:
        for table in SECTION_TABLES:
            if table == "QuestionBank":
                continue
            self.assertEqual(self.rows(f"""SELECT COUNT(*) FROM "{table}" WHERE "sectionId" = '{OLD_40}'"""), [(0,)], table)
        self.assertEqual(self.rows(f"""SELECT "id" FROM "QuestionBank" WHERE "sectionId" = '{OLD_40}'"""), [("q-old-twin",)])

    def test_every_table_that_names_a_section_carried_its_row_to_the_new_slug(self) -> None:
        expected = {"Progress": 5, "ExamAttempt": 4, "QuestionBank": 2, "ExerciseAttempt": 1,
                    "SelfCheckAttempt": 1, "ContentVersion": 1, "FeedbackReport": 1, "AnalyticsEvent": 1}
        got = {t: self.rows(f"""SELECT COUNT(*) FROM "{t}" WHERE "sectionId" = '{NEW_40}'""")[0][0] for t in SECTION_TABLES}
        self.assertEqual(got, expected)

    def test_the_newer_row_wins_so_nothing_the_learner_undid_comes_back(self) -> None:
        got = self.rows("""SELECT "userId","sectionId","subStep","completed","completedAt","bookmarked"
                           FROM "Progress" ORDER BY 1,2,3""")
        self.assertEqual(got, [
            ("u1", NEW_40, "ido", 1, SEP_20, 0),
            ("u1", NEW_40, "theory", 1, SEP_01, 0),
            ("u1", NEW_40, "wedo", 1, SEP_02, 0),       # earlier completion kept
            ("u1", NEW_40, "youdo", 0, None, 0),        # un-tick survives
            ("u1", "security", "theory", 1, SEP_01, 0), # another section is not touched
            ("u2", NEW_40, "quiz", 0, None, 1),
        ])

    def test_exam_attempts_keep_their_order_and_stay_unique(self) -> None:
        got = self.rows(f"""SELECT "id","attemptNumber" FROM "ExamAttempt"
                            WHERE "userId"='u1' AND "sectionId"='{NEW_40}' ORDER BY 2""")
        self.assertEqual(got, [("e-old-1", 1), ("e-old-2", 2), ("e-new-1", 3)])
        self.assertEqual(self.rows("""SELECT "attemptNumber" FROM "ExamAttempt" WHERE "id"='e-u2-old-1'"""), [(1,)])

    def test_a_saved_exam_form_still_belongs_to_its_attempt(self) -> None:
        self.assertEqual(self.rows("""SELECT "attemptId" FROM "ExamAttemptForm" """), [("e-old-1",)])
        self.assertEqual(self.rows("PRAGMA foreign_key_check"), [])

    def test_a_question_referenced_by_past_attempts_is_never_deleted(self) -> None:
        self.assertEqual({r[0] for r in self.rows('SELECT "id" FROM "QuestionBank"')},
                         {"q-old-twin", "q-new-twin", "q-old-only"})
        self.assertEqual(self.rows("""SELECT "sectionId" FROM "QuestionBank" WHERE "id"='q-old-only'"""), [(NEW_40,)])

    def test_a_second_run_changes_nothing(self) -> None:
        before = snapshot_s40(self.db)
        self.db.executescript(self.sql)
        self.assertEqual(snapshot_s40(self.db), before)

    def test_the_helper_table_is_gone(self) -> None:
        self.assertEqual(self.rows("""SELECT name FROM sqlite_master WHERE name='_SectionIdRename'"""), [])
        self.assertEqual(self.rows("""SELECT name FROM sqlite_temp_master WHERE name='_SectionIdRename'"""), [])


class BatchBAllOrNothingTests(unittest.TestCase):
    def test_a_failure_partway_leaves_every_table_as_it_was_and_a_retry_works(self) -> None:
        db = migrated_db(RENAME_B)
        seed_s40(db)
        before = snapshot_s40(db)
        sql = RENAME_B.read_text(encoding="utf-8")
        broken = sql.replace("COMMIT;", 'INSERT INTO "NoSuchTable" VALUES (1);\nCOMMIT;')
        with self.assertRaises(sqlite3.OperationalError):
            db.executescript(broken)
        db.execute("ROLLBACK")
        self.assertEqual(snapshot_s40(db), before, "a failed run must not leave partial changes")
        db.executescript(sql)
        self.assertEqual(db.execute(f"""SELECT COUNT(*) FROM "Progress" WHERE "sectionId"='{OLD_40}'""").fetchone(), (0,))


class RenameTablesAgreeTests(unittest.TestCase):
    def _client_map(self) -> dict[str, str]:
        body = re.search(r"SECTION_ID_RENAMES[^=]*=\s*\{([\s\S]*?)\n\}", TS_MAP.read_text(encoding="utf-8")).group(1)
        return dict(re.findall(r"['\"]?([\w-]+)['\"]?\s*:\s*['\"]([\w-]+)['\"]", body))

    def _pairs(self, sql: Path) -> dict[str, str]:
        return dict(re.findall(r"\('([\w-]+)',\s*'([\w-]+)'\)", sql.read_text(encoding="utf-8")))

    def test_batch_a_is_frozen(self) -> None:
        self.assertEqual(self._pairs(RENAME), BATCH_A, "an applied migration must never change")

    def test_batch_b_is_frozen_and_is_the_s40_pair(self) -> None:
        self.assertEqual(self._pairs(RENAME_B), BATCH_B, "an applied migration must never change")
        self.assertEqual(self._client_map().get("agentic-architecture"), "architecture-ddd-decisions")

    def test_no_slug_is_renamed_twice(self) -> None:
        """A single-pass lookup can never rename twice only if no new slug is also an old one."""
        client = self._client_map()
        self.assertFalse(set(client.values()) & set(client), "a new slug is also an old slug")
        self.assertFalse(set(BATCH_A) & set(BATCH_B))

    def test_batch_b_runs_after_batch_a_and_the_exam_grading_migration(self) -> None:
        order = sorted(MIGRATIONS.glob("*/migration.sql"))
        self.assertLess(order.index(RENAME), order.index(RENAME_B))
        self.assertLess(order.index(MIGRATIONS / "20260918230000_exam_grading_integrity" / "migration.sql"),
                        order.index(RENAME_B))

    def test_every_rename_the_client_makes_has_a_database_migration(self) -> None:
        union: dict[str, str] = {}
        for sql in sorted(MIGRATIONS.glob("*_rename_section_ids_*/migration.sql")):
            union.update(self._pairs(sql))
        self.assertEqual(union, self._client_map())


class DbPushRunsTheRenameTests(unittest.TestCase):
    def test_db_push_applies_every_rename_migration(self) -> None:
        """`db push` never runs migration files; the documented setup would otherwise skip the rename."""
        scripts = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))["scripts"]
        self.assertIn("apply_section_id_renames.mjs", scripts["db:push"])
        runner = (ROOT / "scripts" / "apply_section_id_renames.mjs").read_text(encoding="utf-8")
        self.assertIn("_rename_section_ids_", runner)
        self.assertIn("prisma', 'db', 'execute'", runner)


if __name__ == "__main__":
    unittest.main()
