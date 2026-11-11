"""A section's self-check must not be passable by always picking the longest or shortest option.

Batch-1 gate B4 (owner-approved 2026-11-09). The exam banks are already measured for every length
rank by `exam-strategy-simulation.test.ts`; the self-check ("Autocheck") at the end of each section
was measured by nothing. The 2026-11-09 recheck found S07's key was the longest option in 9 of 10
questions, so "always pick the longest" scored 90%.

A strategy reaches the bar when it picks the key in at least 70% of the questions (the course's pass
mark, `PASS_THRESHOLD`). Ties count for the strategy, as in `test_exam_length_cue.is_longest`: a
learner choosing among equally long options is not stopped by the tie. Sections still owed a
rewrite are listed exactly; the list may only shrink.
"""

from __future__ import annotations

import json
import shutil
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PASS_MARK = 0.70
BATCH_1 = [
    "s01-setup", "s02-basics", "s03-decisions-rules", "s04-iteration-summaries",
    "s05-functions-contracts", "s06-collections", "s07-text-unicode-regex", "s08-files-ingestion",
    "s09-exceptions-logging", "s10-modules-packaging-cli", "s11-oop-domain", "s12-apis-sql-geo",
    "s13-evidence-dashboard",
]
#: Self-checks that "always longest" passes today. Exact: remove a section once its distractors are rewritten.
# 2026-11-11, proposal 10 S01: the commit-message self-check got a distractor longer than its key,
# so s01-setup no longer answers to "pick the longest".
LONGEST_OWED = {
    "s04-iteration-summaries", "s07-text-unicode-regex", "s09-exceptions-logging",
    "s12-apis-sql-geo", "s13-evidence-dashboard",
}
SHORTEST_OWED: set[str] = set()


def picks_key(question: dict, choose) -> bool:
    lengths = [len(option) for option in question["options"]]
    return lengths[question["correctIndex"]] == choose(lengths)


def score(questions: list[dict], choose) -> float:
    return sum(picks_key(q, choose) for q in questions) / len(questions)


def passable(by_section: dict[str, list[dict]], choose) -> set[str]:
    return {stem for stem, qs in by_section.items() if qs and score(qs, choose) >= PASS_MARK}


class StrategyCanFail(unittest.TestCase):
    QUESTIONS = [
        {"options": ["a", "bb", "ccc", "the long key"], "correctIndex": 3},
        {"options": ["a", "bb", "ccc", "another long key"], "correctIndex": 3},
        {"options": ["short", "a much longer distractor", "mid size", "key"], "correctIndex": 3},
    ]

    def test_longest_is_measured(self) -> None:
        self.assertAlmostEqual(score(self.QUESTIONS, max), 2 / 3)
        self.assertEqual(passable({"x": self.QUESTIONS[:2]}, max), {"x"})

    def test_shortest_is_measured(self) -> None:
        self.assertEqual(passable({"x": self.QUESTIONS[2:]}, min), {"x"})
        self.assertEqual(passable({"x": self.QUESTIONS[:2]}, min), set())


@unittest.skipUnless(shutil.which("node"), "needs node to read the section modules")
class BatchOneSelfChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        done = subprocess.run(
            ["node", "--import", "tsx", "scripts/selfcheck_export.mts", *BATCH_1],
            cwd=ROOT, capture_output=True, text=True, check=True, timeout=300,
        )
        cls.by_section = json.loads(done.stdout)

    def test_every_section_was_read(self) -> None:
        self.assertEqual(sorted(self.by_section), sorted(BATCH_1))
        self.assertGreaterEqual(sum(len(q) for q in self.by_section.values()), 100)

    def test_always_longest_is_exactly_the_owed(self) -> None:
        self.assertEqual(sorted(passable(self.by_section, max)), sorted(LONGEST_OWED))

    def test_always_shortest_is_exactly_the_owed(self) -> None:
        self.assertEqual(sorted(passable(self.by_section, min)), sorted(SHORTEST_OWED))


if __name__ == "__main__":
    unittest.main()
