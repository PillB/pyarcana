"""Contract: the exam audit reads every bank, and reports every issue it finds.

Three properties, each with a recreation of the defect it closes:

- The audit reads the bank through scripts/exam_bank.py. The regex it used to carry saw only some
  key styles, and it turned an escaped newline inside one question into a plain letter.
- The audit reports every issue. It used to keep 300 and cut the thin-concept list at 50, so a
  large finding could vanish from the report with no sign that it had.
- The audit checks answer positions. A bank whose key sits in one slot is a bank a learner can
  pass by always choosing that slot (Haladyna, Downing & Rodriguez 2002: "vary the location of the
  right answer"; Attali & Bar-Hillel 2003 on key-position bias).

Exam options are shuffled per attempt since #91, so a stored position does not reach a learner in
an exam. The position check still guards the self-check banks and any static use of a bank, so the
owed set below is a record of what the stored banks look like, not a learner-facing defect.
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import exam_selfcheck_pedagogy_audit as audit  # noqa: E402


class AuditReadsEveryQuestion(unittest.TestCase):
    def test_the_audit_sees_every_bank_and_question(self):
        """The regex reader's count (1248 questions, 416 concepts) must not shrink."""
        questions = audit.seed_questions()
        self.assertGreaterEqual(len(questions), 1248, "the audit lost questions")
        self.assertGreaterEqual(len({q["concept"] for q in questions}), 416, "the audit lost concepts")

    def test_an_escaped_newline_is_read_as_a_newline(self):
        """Recreates the defect: the regex read `\\n` inside one question as the letter `n`."""
        hits = [q for q in audit.seed_questions()
                if q["concept"] == "commit-message" and "git diff" in q["question"]]
        self.assertTrue(hits, "the commit-message question is missing")
        self.assertIn("\n", hits[0]["question"])


if __name__ == "__main__":
    unittest.main()
