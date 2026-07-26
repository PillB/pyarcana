"""Section 9 regressions for observability pedagogy and assessment integrity."""

from __future__ import annotations

from collections import Counter, defaultdict
from pathlib import Path
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s09-visualization.ts"
SECTION_VIEW = ROOT / "src/components/course/SectionView.tsx"
PDF_REPORT = ROOT / "src/components/course/PdfReport.tsx"
SEED = ROOT / "prisma/seed.ts"


def _between(text: str, start: str, end: str) -> str:
    start_index = text.index(start)
    end_index = text.index(end, start_index + len(start))
    return text[start_index:end_index]


class TestS09ObservabilityContract(unittest.TestCase):
    def test_canonical_surface_retains_complete_gradual_release(self) -> None:
        source = SECTION.read_text(encoding="utf-8")

        self.assertIn('id: "visualization"', source)
        self.assertIn("index: 9", source)
        self.assertIn(
            'title: "Excepciones, debugging y logging seguro"',
            source,
        )
        self.assertEqual(
            len(set(re.findall(r'subtopicId: "S09-T[1-4]-[AB]"', source))),
            8,
        )
        self.assertEqual(
            len(set(re.findall(r'demoId: "S09-T[1-4]-[AB]-DEMO"', source))),
            8,
        )
        self.assertEqual(
            len(set(re.findall(r'id: "S09-T[1-4]-[AB]-E[1-3]"', source))),
            24,
        )

    def test_starters_do_not_claim_success_while_still_incorrect(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        we_do = _between(source, "  weDo: {", "\n  youDo: {")

        self.assertEqual(we_do.count("starterCode:"), 24)
        self.assertEqual(we_do.count("solutionCode:"), 24)
        self.assertNotRegex(we_do, r"""print\((?:'|")ok(?:'|"), True\)""")

    def test_playground_is_observability_owned_and_executable(self) -> None:
        source = SECTION_VIEW.read_text(encoding="utf-8")
        block = _between(source, "    'visualization': {", "    'sklearn': {")

        self.assertIn("Practica un lote observable y sin PII", block)
        self.assertIn("def process_batch", block)
        self.assertIn("correlation_id=%s", block)
        self.assertIn("assert len(records) == len(ok) + len(quarantined)", block)
        self.assertNotIn("matplotlib", block.lower())
        self.assertNotIn("ventas_2024", block)

        match = re.search(
            r"code: `(?P<code>.*?)`,\n\s+expectedOutput: `(?P<output>.*?)`,",
            block,
            re.DOTALL,
        )
        self.assertIsNotNone(match)
        assert match is not None

        run = subprocess.run(
            ["python3", "-c", match.group("code")],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        )
        self.assertEqual(run.stdout.rstrip(), match.group("output").rstrip())
        self.assertNotIn("ana@ejemplo.pe", run.stdout)

    def test_pdf_label_matches_exceptions_scope(self) -> None:
        pdf = PDF_REPORT.read_text(encoding="utf-8")
        self.assertIn("visualization: '9. Excepciones'", pdf)
        self.assertNotIn("visualization: '9. Viz'", pdf)

    def test_authenticated_bank_balances_positions_and_attempts(self) -> None:
        seed = SEED.read_text(encoding="utf-8")
        bank = _between(seed, "  visualization: [", "\n  sklearn: [")
        entries = re.findall(
            r"concept: '([^']+)'.*?correctIndex: ([0-3]),",
            bank,
            re.DOTALL,
        )

        self.assertEqual(len(entries), 24)
        self.assertEqual(
            Counter(int(index) for _, index in entries),
            Counter({0: 6, 1: 6, 2: 6, 3: 6}),
        )

        by_concept: dict[str, list[int]] = defaultdict(list)
        for concept, index in entries:
            by_concept[concept].append(int(index))
        self.assertEqual(len(by_concept), 8)
        self.assertTrue(
            all(
                len(indices) == 3 and len(set(indices)) == 3
                for indices in by_concept.values()
            )
        )

        for attempt in range(3):
            positions = [int(index) for _, index in entries[attempt::3]]
            self.assertEqual(
                Counter(positions),
                Counter({0: 2, 1: 2, 2: 2, 3: 2}),
            )

    def test_public_self_check_remains_balanced(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        self_check = _between(source, "  selfCheck: {", "\n  resources: {")
        positions = [
            int(value)
            for value in re.findall(r"correctIndex: ([0-3]),", self_check)
        ]

        self.assertEqual(len(positions), 11)
        self.assertEqual(Counter(positions), Counter({0: 3, 1: 2, 2: 3, 3: 3}))


if __name__ == "__main__":
    unittest.main()
