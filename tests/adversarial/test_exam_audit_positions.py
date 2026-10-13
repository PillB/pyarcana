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
- The audit flags an option whose whole meaning is a pointer to other options ("todas las
  anteriores", "opción A", "A y B") as P0: the option shuffle would make the reference point at the
  wrong text. It does not flag ordinary Spanish ("una alternativa a pandas") or notation ("los grupos
  A y B"), because P0 blocks CI.
"""
from __future__ import annotations

import contextlib
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

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


def run_main(banks: list[dict] | None = None) -> tuple[int, dict]:
    """Run audit.main as CI does and return (exit code, the report it wrote).

    The report goes to a temporary file, never the tracked one. With `banks`, the one reader
    (exam_bank.load_banks) and the self-check parser are replaced, so the report shows exactly what
    main read from the reader and nothing else.
    """
    with tempfile.TemporaryDirectory() as tmp, contextlib.redirect_stdout(io.StringIO()):
        target = Path(tmp) / "report.json"
        with contextlib.ExitStack() as stack:
            if banks is not None:
                stack.enter_context(mock.patch.object(audit.exam_bank, "load_banks", return_value=banks))
                stack.enter_context(mock.patch.object(audit, "parse_selfchecks", return_value=[]))
            code = audit.main(["--out", str(target)])
        return code, json.loads(target.read_text(encoding="utf-8"))


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


def _option_bank(option: str) -> dict:
    """A synthetic bank whose first question carries the given option."""
    return {"slug": "probe", "questions": [
        {"concept": "c", "question": "q", "options": [option, "uno", "dos", "tres"],
         "correctIndex": 0, "explanation": "e"},
    ]}


class OptionsDoNotNameOtherOptions(unittest.TestCase):
    def test_each_reference_form_is_flagged_as_p0(self):
        """Recreates the references a per-attempt shuffle would break: an option whose whole meaning
        is a pointer to other options, exactly or at its start."""
        for option in ("todas las anteriores", "Todas las anteriores son correctas",
                       "Ninguna de las anteriores", "Opción A", "La opción C es la correcta",
                       "la alternativa B", "A y B", "Solo A y B", "Tanto A como B son correctas",
                       "A o B"):
            with self.subTest(option=option):
                issues = audit.position_reference_issues([_option_bank(option)])
                self.assertEqual(len(issues), 1)
                self.assertEqual(issues[0]["severity"], "P0")

    def test_ordinary_spanish_is_not_a_reference(self):
        """Recreates the false positives the review found: the preposition 'a' read as option A, and
        'A y B' read as two options inside a sentence. P0 blocks CI, so a clean bank must not hit it."""
        for option in ("Polars es una alternativa a pandas",
                       "Usar una opción a corto plazo",
                       "Alternativa a pandas para tablas que no caben en memoria",
                       "Opción a corto plazo: aplazar la migración",
                       "Combinar la tabla A y B con merge",
                       # A phrase inside a sentence is content, not a pointer: the scenario in the
                       # stem may label its own choices, and "anteriores" may qualify a noun.
                       "Elegir la opción A del plan (SQLite) porque basta un archivo local",
                       "Probar todas las anteriores versiones del paquete en el CI"):
            with self.subTest(option=option):
                self.assertEqual(audit.position_reference_issues([_option_bank(option)]), [])

    def test_math_notation_is_not_a_reference(self):
        """'A y B' names sets, events or groups in the statistics sections. Only an option that is
        nothing but 'A y B' (with solo, tanto, or 'son correctas') is a pointer. 'A~B y B~C' is the
        false positive found on the tree: it names variables, not options."""
        for option in ("A~B y B~C no digan nada de A~C",
                       "los grupos A y B tienen igual varianza",
                       "A y B son independientes si P(A ∩ B) = P(A)·P(B)",
                       "Los conjuntos A y B no comparten elementos",
                       "Calcular la unión de A o B antes de filtrar"):
            with self.subTest(option=option):
                self.assertEqual(audit.position_reference_issues([_option_bank(option)]), [])

    def test_a_plain_option_is_not_flagged(self):
        self.assertEqual(audit.position_reference_issues([_option_bank("Se ordena de menor a mayor")]), [])

    def test_the_seed_names_no_other_option(self):
        self.assertEqual(audit.position_reference_issues(exam_bank.load_banks()), [])


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
        _, report = run_main()
        self.assertIn("counts", report)
        self.assertEqual(audit.OUT.read_bytes(), before)


class AuditReadsEveryQuestion(unittest.TestCase):
    """These tests run audit.main, the function CI runs, so they cover the path that reads the banks."""

    def test_the_real_tree_is_read_whole_and_has_no_p0(self):
        """Recreates a main that reads part of the tree. The regex reader saw 1248 questions and 416
        concepts; the counts are floors, so a bank can still grow."""
        code, report = run_main()
        self.assertGreaterEqual(report["seed_questions_parsed"], 1248, "the audit lost questions")
        self.assertGreaterEqual(report["unique_concepts"], 416, "the audit lost concepts")
        self.assertEqual(report["p0"], 0)
        self.assertEqual(code, 0)

    def test_main_reports_what_the_one_reader_returns(self):
        """Recreates a main that reads banks some other way, or drops the tail of what the reader
        returns: the last question of the last bank is wrong, and the report must say so."""
        keys = [0] * 6 + [1] * 6 + [2] * 6 + [3] * 6
        first, second = _bank(keys, "first"), _bank(keys, "second")
        second["questions"][-1]["correctIndex"] = 9
        code, report = run_main([first, second])
        self.assertEqual(report["seed_questions_parsed"], 48)
        self.assertEqual([i["reason"] for i in report["issues"] if i["severity"] == "P0"],
                         ["seed_correctIndex_oor"])
        self.assertEqual((report["p0"], report["ok"], code), (1, False, 1))


if __name__ == "__main__":
    unittest.main()
