"""Independent Section 3 regressions for curriculum, runtime, and assessment integrity."""

from __future__ import annotations

from collections import Counter, defaultdict
from pathlib import Path
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s03-data-structures.ts"
SEED = ROOT / "prisma/seed.ts"
SECTION_VIEW = ROOT / "src/components/course/SectionView.tsx"
PDF_REPORT = ROOT / "src/components/course/PdfReport.tsx"


def _between(text: str, start: str, end: str) -> str:
    start_index = text.index(start)
    end_index = text.index(end, start_index + len(start))
    return text[start_index:end_index]


class Section03IndependentContractTests(unittest.TestCase):
    def test_complete_gradual_release_surface_is_preserved(self) -> None:
        source = SECTION.read_text(encoding="utf-8")

        self.assertIn("id: 'data-structures'", source)
        self.assertIn("index: 3", source)
        self.assertIn("title: 'Decisiones y reglas de validación'", source)
        self.assertEqual(
            len(re.findall(r"subtopicId: 'S03-T[1-4]-[AB]'", source)),
            40,
        )
        self.assertEqual(
            len(re.findall(r"demoId: 'S03-T[1-4]-[AB]-DEMO'", source)),
            8,
        )
        self.assertEqual(
            len(re.findall(r"id: 'S03-T[1-4]-[AB]-E[1-3]'", source)),
            24,
        )

    def test_all_embedded_reference_programs_match_their_output(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        blocks = re.findall(
            r"(?:code|solutionCode):\s*\{\s*"
            r"language:\s*'python',\s*"
            r"title:\s*'[^']+',\s*"
            r"code:\s*`(?P<code>.*?)`,\s*"
            r"output:\s*`(?P<output>.*?)`,?\s*\}",
            source,
            re.DOTALL,
        )
        self.assertEqual(len(blocks), 41)

        for index, (code, expected) in enumerate(blocks, start=1):
            with self.subTest(block=index):
                run = subprocess.run(
                    ["python3", "-c", code],
                    cwd=ROOT,
                    check=True,
                    capture_output=True,
                    text=True,
                )
                self.assertEqual(run.stdout.rstrip(), expected.rstrip())

    def test_playground_and_pdf_match_the_rules_scope(self) -> None:
        section_view = SECTION_VIEW.read_text(encoding="utf-8")
        playground = _between(
            section_view,
            "    'data-structures': {",
            "    'functions-modules': {",
        )
        self.assertIn("Practica decisiones y reglas", playground)
        self.assertIn("def validate_monto", playground)
        self.assertIn("def validate_region", playground)
        self.assertIn('"monto": 0', playground)
        self.assertNotIn("Promedio de notas", playground)

        match = re.search(
            r"code: `(?P<code>.*?)`,\n\s+expectedOutput: `(?P<output>.*?)`,",
            playground,
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

        pdf = PDF_REPORT.read_text(encoding="utf-8")
        self.assertIn('"data-structures": \'3. Reglas\'', pdf)
        self.assertNotIn('"data-structures": \'3. Data Struct\'', pdf)

    def test_authenticated_bank_is_balanced_by_concept_and_attempt(self) -> None:
        seed = SEED.read_text(encoding="utf-8")
        bank = _between(seed, "  // S03 V3", "  // S04 V3")
        entries = re.findall(
            r"\{\s+concept: '([^']+)'.*?correctIndex:\s*([0-3]),",
            bank,
            re.DOTALL,
        )
        self.assertEqual(len(entries), 24)

        by_concept: dict[str, list[int]] = defaultdict(list)
        positions: list[int] = []
        for concept, raw_position in entries:
            position = int(raw_position)
            by_concept[concept].append(position)
            positions.append(position)

        self.assertEqual(len(by_concept), 8)
        self.assertTrue(all(len(values) == 3 for values in by_concept.values()))
        self.assertTrue(all(len(set(values)) == 3 for values in by_concept.values()))
        self.assertEqual(Counter(positions), Counter({0: 6, 1: 6, 2: 6, 3: 6}))

        for attempt in range(3):
            self.assertEqual(
                Counter(positions[attempt::3]),
                Counter({0: 2, 1: 2, 2: 2, 3: 2}),
            )

    def test_public_self_check_is_balanced_and_covers_late_rules(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        self_check = _between(source, "  selfCheck: {", "  resources: {")
        positions = [
            int(value)
            for value in re.findall(r"correctIndex:\s*([0-3]),", self_check)
        ]

        self.assertEqual(len(positions), 8)
        self.assertEqual(Counter(positions), Counter({0: 2, 1: 2, 2: 2, 3: 2}))
        self.assertIn("comparar None con < lanza TypeError", self_check)
        self.assertIn("mensajes de validación es accionable", self_check)

    def test_you_do_oracle_covers_schema_normal_boundary_and_error_paths(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        you_do = _between(source, "  youDo: {", "  selfCheck: {")

        self.assertNotIn("NotImplementedError", you_do)
        self.assertIn(
            'assert set(result) == {"status", "code", "message"}',
            you_do,
        )
        self.assertIn('{"edad": "25", "region": None, "monto_ingreso": "100"}', you_do)
        self.assertIn('{"edad": 18, "region": "Piura", "monto_ingreso": 50000}', you_do)
        self.assertIn('{"edad": 121, "region": "Cusco", "monto_ingreso": 50001}', you_do)
        for code in (
            "MISSING",
            "BAD_TYPE",
            "OUT_OF_RANGE",
            "NOT_IN_ALLOWLIST",
            "NEEDS_REVIEW",
            "OK",
        ):
            self.assertIn(code, you_do)


if __name__ == "__main__":
    unittest.main()
