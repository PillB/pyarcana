"""Section 7 regressions: text contracts, assessment integrity, and runtime mappings."""

from __future__ import annotations

import re
import unittest
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s07-data-acquisition.ts"
SEED = ROOT / "prisma/seed.ts"
SECTION_VIEW = ROOT / "src/components/course/SectionView.tsx"
PDF_REPORT = ROOT / "src/components/course/PdfReport.tsx"


def s07_seed_block() -> str:
    text = SEED.read_text(encoding="utf-8")
    start = text.index("  'data-acquisition': [")
    end = text.index("\n  // === S14:", start)
    return text[start:end]


class TestS07TextContract(unittest.TestCase):
    def test_canonical_identity_and_instructional_shape(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        self.assertRegex(source, r'id:\s*"data-acquisition"')
        self.assertRegex(source, r"index:\s*7")
        self.assertIn('title: "Texto, Unicode y expresiones regulares"', source)
        self.assertEqual(len(re.findall(r'subtopicId:\s*"S07-T[1-4]-[AB]"', source)), 40)
        self.assertEqual(len(re.findall(r'demoId:\s*"S07-T[1-4]-[AB]-DEMO"', source)), 8)
        self.assertEqual(len(re.findall(r'id:\s*"S07-T[1-4]-[AB]-E[1-3]"', source)), 24)

    def test_authenticated_bank_is_balanced_overall_and_by_attempt(self) -> None:
        block = s07_seed_block()
        concepts = re.findall(r"concept:\s*'([^']+)'", block)
        positions = [int(value) for value in re.findall(r"correctIndex:\s*(\d+)", block)]
        self.assertEqual(len(concepts), 24)
        self.assertEqual(len(positions), 24)
        self.assertEqual(Counter(concepts), Counter({
            "unicode-normalization-casefold": 3,
            "latam-names-particles": 3,
            "string-ops": 3,
            "names-emails-phones": 3,
            "regex-patterns-groups": 3,
            "compile-extract-limits": 3,
            "exact-token-similarity": 3,
            "fp-fn-evidence": 3,
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

    def test_assessment_contract_matches_empty_jaccard_policy(self) -> None:
        block = s07_seed_block()
        self.assertIn(
            "si ambos conjuntos están vacíos, el contrato de esta sección devuelve 1.0",
            block,
        )
        self.assertIn(
            "si solo una está vacía, devuelve 0.0",
            block,
        )
        self.assertNotIn("unión vacía → política 0 o N/A", block)
        self.assertNotIn("¿Cuándo pasar de str methods a regex en S07?", block)
        self.assertNotIn("S07 V3", block)

    def test_stdlib_regex_limit_is_truthful(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        self.assertIn(
            "El módulo `re` de la biblioteca estándar no expone un parámetro de *timeout*.",
            source,
        )
        self.assertIn(
            "mitigación: patrón simple, entrada acotada o str.find/split",
            source,
        )
        self.assertNotIn(
            "mitigación: patrones simples, timeouts, o str.find/split",
            source,
        )

    def test_runtime_and_pdf_mappings_match_text_curriculum(self) -> None:
        section_view = SECTION_VIEW.read_text(encoding="utf-8")
        start = section_view.index("    'data-acquisition': {")
        end = section_view.index("\n    'performance': {", start)
        mapping = section_view[start:end]
        self.assertIn("Practica Unicode, regex y evidencia", mapping)
        self.assertIn("def normalize_email", mapping)
        self.assertIn("def token_jaccard", mapping)
        self.assertNotIn("sqlite3", mapping)
        self.assertNotIn("Practica scraping", mapping)
        self.assertNotIn("Counter", mapping)

        pdf = PDF_REPORT.read_text(encoding="utf-8")
        self.assertIn("\"data-acquisition\": '7. Texto & Unicode'", pdf)
        self.assertNotIn("\"data-acquisition\": '7. Data Acq'", pdf)


if __name__ == "__main__":
    unittest.main()
