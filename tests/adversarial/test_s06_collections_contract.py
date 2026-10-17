"""Section 6 regressions: collections identity, assessment integrity, and runtime mappings."""

from __future__ import annotations

import re
import sys
import unittest
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

SECTION = ROOT / "src/lib/course/sections/s06-collections.ts"
PLAYGROUND_DEMOS = ROOT / "src" / "lib" / "course" / "playground-demos.ts"
PDF_REPORT = ROOT / "src/components/course/PdfReport.tsx"


def s06_bank() -> list[dict]:
    return exam_bank.bank_for("collections")


class TestS06CollectionsContract(unittest.TestCase):
    def test_canonical_identity_and_assessment_shape(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        self.assertRegex(source, r'id:\s*"collections"')
        self.assertRegex(source, r'index:\s*6')
        self.assertIn('title: "Colecciones y estructuras de datos"', source)
        self.assertEqual(len(re.findall(r'subtopicId:\s*"S06-T[1-4]-[AB]"', source)), 40)
        self.assertEqual(len(re.findall(r'demoId:\s*"S06-T[1-4]-[AB]-DEMO"', source)), 8)
        self.assertEqual(len(re.findall(r'id:\s*"S06-T[1-4]-[AB]-E[1-3]"', source)), 24)

    def test_we_do_starters_never_false_pass(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        we_do = source[source.index("  weDo: {") : source.index("\n  youDo: {")]
        self.assertNotIn("print('ok', True)", we_do)
        self.assertEqual(we_do.count("starterCode:"), 24)
        self.assertEqual(we_do.count("solutionCode:"), 24)

    def test_authenticated_bank_is_balanced_overall_and_by_attempt(self) -> None:
        bank = s06_bank()
        concepts = [q["concept"] for q in bank]
        positions = [q["correctIndex"] for q in bank]
        self.assertEqual(len(concepts), 24)
        self.assertEqual(len(positions), 24)
        self.assertEqual(Counter(concepts), Counter({
            "list-tuple-slicing": 3,
            "unpacking-aliasing-copy": 3,
            "dicts-membership": 3,
            "sets-dedup": 3,
            "nested-traversal": 3,
            "safe-access-missing": 3,
            "sort-key": 3,
            "structure-choice-determinism": 3,
        }))
        self.assertEqual(Counter(positions), Counter({0: 6, 1: 6, 2: 6, 3: 6}))

        by_attempt: dict[int, list[int]] = defaultdict(list)
        for question_index, position in enumerate(positions):
            by_attempt[question_index % 3].append(position)
        for attempt_positions in by_attempt.values():
            self.assertEqual(
                Counter(attempt_positions),
                Counter({0: 2, 1: 2, 2: 2, 3: 2}),
            )

    def test_authenticated_bank_has_no_curriculum_archaeology(self) -> None:
        text = exam_bank.learner_text(s06_bank()).lower()
        for leaked_term in (
            "v3 retarget",
            "id plataforma numpy conservado",
            "target pedagógico",
        ):
            self.assertNotIn(leaked_term, text)
        self.assertIn("¿qué entrega demuestra mejor", text)

    def test_s06_runtime_and_pdf_mappings_match_collections(self) -> None:
        demos_source = PLAYGROUND_DEMOS.read_text(encoding="utf-8")
        start = demos_source.index("    'collections': {")
        end = demos_source.index("\n    'files-ingestion': {", start)
        mapping = demos_source[start:end]
        self.assertIn("Practica colecciones y conflictos", mapping)
        self.assertIn("def dedup_report", mapping)
        self.assertNotIn("import numpy", mapping)
        self.assertNotIn("np.array", mapping)

        pdf = PDF_REPORT.read_text(encoding="utf-8")
        self.assertIn("collections: '6. Colecciones'", pdf)
        self.assertNotIn("collections: '6. NumPy'", pdf)


if __name__ == "__main__":
    unittest.main()
