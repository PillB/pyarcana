"""Section 6 regressions: collections identity, assessment integrity, and runtime mappings."""

from __future__ import annotations

import re
import unittest
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s06-numpy.ts"
SEED = ROOT / "prisma/seed.ts"
SECTION_VIEW = ROOT / "src/components/course/SectionView.tsx"
PDF_REPORT = ROOT / "src/components/course/PdfReport.tsx"


def s06_seed_block() -> str:
    text = SEED.read_text(encoding="utf-8")
    start = text.index("  numpy: [")
    end = text.index("\n  // S08 V3", start)
    return text[start:end]


class TestS06CollectionsContract(unittest.TestCase):
    def test_canonical_identity_and_assessment_shape(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        self.assertRegex(source, r'id:\s*"numpy"')
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
        block = s06_seed_block()
        concepts = re.findall(r"concept:\s*'([^']+)'", block)
        positions = [int(value) for value in re.findall(r"correctIndex:\s*(\d+)", block)]
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
        block = s06_seed_block().lower()
        for leaked_term in (
            "v3 retarget",
            "id plataforma numpy conservado",
            "target pedagógico",
        ):
            self.assertNotIn(leaked_term, block)
        self.assertIn("¿qué entrega demuestra mejor", block)

    def test_s06_runtime_and_pdf_mappings_match_collections(self) -> None:
        section_view = SECTION_VIEW.read_text(encoding="utf-8")
        start = section_view.index("    'numpy': {")
        end = section_view.index("\n    'pandas': {", start)
        mapping = section_view[start:end]
        self.assertIn("Practica colecciones y conflictos", mapping)
        self.assertIn("def dedup_report", mapping)
        self.assertNotIn("import numpy", mapping)
        self.assertNotIn("np.array", mapping)

        pdf = PDF_REPORT.read_text(encoding="utf-8")
        self.assertIn("numpy: '6. Colecciones'", pdf)
        self.assertNotIn("numpy: '6. NumPy'", pdf)


if __name__ == "__main__":
    unittest.main()
