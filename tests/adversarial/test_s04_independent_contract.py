from __future__ import annotations

import sys
from collections import Counter, defaultdict
from pathlib import Path
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[2]
SEED = ROOT / "prisma" / "seed.ts"
SECTION_VIEW = ROOT / "src" / "components" / "course" / "SectionView.tsx"
PDF_REPORT = ROOT / "src" / "components" / "course" / "PdfReport.tsx"
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s04-iteration-summaries.ts"


def _between(text: str, start: str, end: str) -> str:
    start_index = text.index(start)
    end_index = text.index(end, start_index)
    return text[start_index:end_index]


class Section04IndependentContractTests(unittest.TestCase):
    def test_canonical_identity_and_pdf_label_match_iteration_scope(self) -> None:
        lesson = SECTION.read_text(encoding="utf-8")
        pdf = PDF_REPORT.read_text(encoding="utf-8")

        self.assertIn('id: "iteration-summaries"', lesson)
        self.assertIn('index: 4', lesson)
        self.assertIn('title: "Iteración y resúmenes transaccionales"', lesson)
        self.assertIn('"iteration-summaries": \'4. Iteración\'', pdf)
        self.assertNotIn('"iteration-summaries": \'4. Functions\'', pdf)

    def test_playground_is_section_owned_and_output_is_executable(self) -> None:
        source = SECTION_VIEW.read_text(encoding="utf-8")
        block = _between(source, "    'iteration-summaries': {", "    'functions-contracts': {")

        self.assertIn("Practica un resumen por lotes", block)
        self.assertIn("tasa_lote_vacio", block)
        self.assertNotRegex(
            block.lower(),
            r"\b(?:decorator|decorators|fibonacci|functools|timing)\b",
        )

        match = re.search(
            r"code: `(?P<code>.*?)`,\n\s+expectedOutput: `(?P<output>.*?)`,",
            block,
            re.DOTALL,
        )
        self.assertIsNotNone(match)
        assert match is not None

        run = subprocess.run(
            [sys.executable, "-c", match.group("code")],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        )
        self.assertEqual(run.stdout.rstrip(), match.group("output").rstrip())

    def test_authenticated_bank_has_three_variants_per_concept(self) -> None:
        seed = SEED.read_text(encoding="utf-8")
        bank = _between(
            seed,
            "  // S04 V3 — Iteración y resúmenes",
            "  // S05 V3 — Funciones, contratos y descomposición",
        )
        entries = re.findall(
            r"\{\s+concept: '([^']+)'.*?correctIndex: ([0-3]),",
            bank,
            re.DOTALL,
        )

        self.assertEqual(len(entries), 24)
        by_concept: dict[str, list[int]] = defaultdict(list)
        for concept, index in entries:
            by_concept[concept].append(int(index))

        self.assertEqual(len(by_concept), 8)
        self.assertTrue(all(len(indices) == 3 for indices in by_concept.values()))
        self.assertTrue(
            all(len(set(indices)) == 3 for indices in by_concept.values()),
            "Las tres variantes de cada concepto deben mover la respuesta correcta.",
        )

    def test_authenticated_bank_positions_are_balanced(self) -> None:
        seed = SEED.read_text(encoding="utf-8")
        bank = _between(
            seed,
            "  // S04 V3 — Iteración y resúmenes",
            "  // S05 V3 — Funciones, contratos y descomposición",
        )
        positions = [
            int(index)
            for index in re.findall(r"correctIndex: ([0-3]),", bank)
        ]

        self.assertEqual(Counter(positions), Counter({0: 6, 1: 6, 2: 6, 3: 6}))

    def test_capstone_starter_preserves_the_typed_entrypoint(self) -> None:
        """Guards the typed-entrypoint convention audit/fixer/OPEN_QUESTIONS.md Q4 moved here.

        S01-F06 removed a check_arg.py demo that taught `def main() -> None:` before
        indentation, `def` or type annotations were introduced - S04 is the first section
        where a learner can actually read this. The convention still lives here in the
        Client Intake & Data Quality Script capstone; this pins it in place of the test
        that used to pin the removed S01 demo.
        """
        lesson = SECTION.read_text(encoding="utf-8")
        block = _between(
            lesson,
            "title: \"Client Intake & Data Quality Script (cierre CP-N1-A)\",",
            "portfolioNote:",
        )

        self.assertIn("def main() -> None:", block)
        self.assertNotIn("def main():", block)
        self.assertIn('if __name__ == "__main__":', block)
        self.assertIn("Demo reproducible con if __name__ == '__main__'", block)

    def test_public_self_check_retains_eight_valid_questions(self) -> None:
        lesson = SECTION.read_text(encoding="utf-8")
        block = _between(lesson, "  selfCheck: {", "  resources: {")
        positions = [
            int(index)
            for index in re.findall(r"correctIndex: ([0-3]),", block)
        ]

        self.assertEqual(len(positions), 8)
        self.assertEqual(Counter(positions), Counter({0: 2, 1: 2, 2: 2, 3: 2}))


if __name__ == "__main__":
    unittest.main()
