"""Contract: the exam audit reads every bank, and reports every issue it finds.

Each property has a recreation of the defect it closes:

- The audit reads the bank through scripts/exam_bank.py. The regex it used to carry saw only some
  key styles, and it turned an escaped newline inside one question into a plain letter.
- The audit reports every issue. It used to keep 300 and cut the thin-concept list at 50, so a
  large finding could vanish from the report with no sign that it had.
"""
from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import exam_selfcheck_pedagogy_audit as audit  # noqa: E402


class ReportKeepsEveryIssue(unittest.TestCase):
    def test_a_thousand_issues_all_reach_the_report(self):
        """Recreates the truncation: the report kept the first 300 issues and dropped the rest."""
        issues = [{"severity": "P2", "reason": "concept_lt_3_variants", "concept": f"c{i}", "n": 1}
                  for i in range(1000)]
        report = audit.build_report([], issues, 0, "t")
        self.assertEqual(len(report["issues"]), 1000)
        self.assertEqual(report["counts"]["by_reason"], {"concept_lt_3_variants": 1000})
        self.assertEqual(report["counts"]["by_severity"], {"P2": 1000})

    def test_every_thin_concept_is_reported(self):
        """Recreates the other cut: the thin-concept list was truncated at 50."""
        qs = [{"concept": f"c{i}"} for i in range(120)]
        self.assertEqual(len(audit.concept_variant_issues(qs)), 120)

    def test_out_writes_the_named_file_and_not_the_tracked_report(self):
        """Tests must not rewrite the tracked report (course-state), so --out names the file."""
        before = audit.OUT.read_bytes()
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "report.json"
            audit.main(["--out", str(target)])
            report = json.loads(target.read_text(encoding="utf-8"))
        self.assertIn("counts", report)
        self.assertEqual(audit.OUT.read_bytes(), before)


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
