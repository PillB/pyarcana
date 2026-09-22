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

    def test_capstone_starter_has_no_entrypoint_before_s10(self) -> None:
        """D9: the entrypoint idiom waits for the section where a learner imports a module.

        This test used to pin the opposite. Q4 (2026-09-15) moved the `def main() -> None:`
        convention here from a removed S01 demo; D9 (2026-09-17) then ruled that neither
        `main()` nor the `__name__` guard may appear or be mentioned before S10, which teaches
        modules and is the first place anything imports the learner's own file. D9 is the later
        ruling and it says the gates are repointed, not weakened: absence where the idiom is not
        taught, presence where it is. So the same convention is still pinned - one section-pair
        apart, and in the direction the owner chose.
        """
        lesson = SECTION.read_text(encoding="utf-8")
        block = _between(
            lesson,
            "title: \"Client Intake & Data Quality Script (cierre CP-N1-A)\",",
            "portfolioNote:",
        )

        self.assertNotIn("def main(", block)
        self.assertNotIn("__main__", block)

        teaches = (
            SECTION.parent / "s10-modules-packaging-cli.ts"
        ).read_text(encoding="utf-8")
        self.assertIn('if __name__ == "__main__":', teaches)

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
