"""Contract: the exam audit reads every bank, and reports every issue it finds.

Each property has a recreation of the defect it closes:

- The audit reads the bank through scripts/exam_bank.py. The regex it used to carry saw only some
  key styles, and it turned an escaped newline inside one question into a plain letter.
- The audit reports every issue. It used to keep 300 and cut the thin-concept list at 50, so a
  large finding could vanish from the report with no sign that it had.
- The audit checks key positions per bank with a chi-square test (Haladyna, Downing & Rodriguez
  2002: "vary the location of the right answer"; Attali & Bar-Hillel 2003 on key-position bias).
  Exam options are shuffled per attempt since #91, so a stored position does not reach a learner
  in an exam. The check still guards self-check banks and any static use, so its owed set is a
  record of the stored banks, not a learner-facing defect.
"""
from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402
import exam_selfcheck_pedagogy_audit as audit  # noqa: E402

#: The banks whose stored key positions fail the chi-square check (P1), measured on the tree on
#: 2026-10-13. A record of the stored banks, not a learner-facing defect (see key_position_issues).
#: Lower this as banks are re-keyed; it may not grow without a new decision.
KEY_POSITION_IMBALANCED_BANKS_OWED = frozenset({
    "advanced-models", "ai-apis-advanced", "ai-governance", "apis-sql-geo", "async-concurrency",
    "career-strategy", "computer-vision", "cv-ai-integration", "data-engineering", "databases-orm",
    "dbt-bigquery", "evidence-dashboard", "fastapi", "gpu-computing", "graph-rag", "iac",
    "integrator-final", "integrator-phase1", "integrator-phase2", "llm-agents", "llm-finetuning",
    "llmops", "microservices", "mlops", "multimodal", "opensource", "packaging",
    "performance-extreme", "rag", "rapidfuzz-entity", "rpa-advanced", "security", "security-infra",
    "stdlib-deep", "streamlit-dashboards", "tech-leadership", "wxpython-gui",
})


def _bank(keys: list[int], slug: str = "probe") -> dict:
    """A synthetic bank with the given key positions; the options are placeholders."""
    return {"slug": slug, "questions": [
        {"concept": f"c{i}", "question": "q", "options": ["a", "b", "c", "d"], "correctIndex": k,
         "explanation": "e"}
        for i, k in enumerate(keys)
    ]}


class KeyPositionIsChecked(unittest.TestCase):
    def test_an_all_b_bank_is_flagged_with_its_counts_and_statistic(self):
        """Recreates the all-B bank: 24 keys at B (index 1), expected 6 each: chi-square 72."""
        issues = audit.key_position_issues([_bank([1] * 24, "all-b")])
        self.assertEqual(len(issues), 1)
        self.assertEqual(issues[0]["severity"], "P1")
        self.assertEqual(issues[0]["counts"], {1: 24})
        self.assertEqual(issues[0]["chi_square"], 72.0)

    def test_balanced_banks_pass(self):
        """6/6/6/6 and 5/6/8/5 both fall under the critical value of 16.27 (statistics 0 and 1)."""
        even = [0] * 6 + [1] * 6 + [2] * 6 + [3] * 6
        uneven = [0] * 5 + [1] * 6 + [2] * 8 + [3] * 5
        self.assertEqual(audit.key_position_issues([_bank(even), _bank(uneven)]), [])

    def test_a_lopsided_bank_is_flagged(self):
        """18/6/0/0 has statistic 36, over the critical value."""
        issues = audit.key_position_issues([_bank([0] * 18 + [1] * 6)])
        self.assertEqual(len(issues), 1)
        self.assertEqual(issues[0]["chi_square"], 36.0)


class RealTreeKeyPositions(unittest.TestCase):
    def test_the_flagged_banks_are_exactly_the_owed_set(self):
        flagged = {issue["bank"] for issue in audit.key_position_issues(exam_bank.load_banks())}
        self.assertEqual(sorted(flagged - KEY_POSITION_IMBALANCED_BANKS_OWED), [],
                         "new banks fail the key-position check")
        self.assertEqual(sorted(KEY_POSITION_IMBALANCED_BANKS_OWED - flagged), [],
                         "no longer flagged: remove from KEY_POSITION_IMBALANCED_BANKS_OWED")


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
