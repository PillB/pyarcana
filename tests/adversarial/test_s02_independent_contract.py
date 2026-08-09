"""Independent Section 2 curriculum and assessment regressions."""

from __future__ import annotations

import sys
from collections import Counter, defaultdict
from pathlib import Path
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from newbie_packet_builder import active_manifest, parse_section_learner  # noqa: E402


SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s02-basics.ts"
SEED = ROOT / "prisma" / "seed.ts"
SECTION_VIEW = ROOT / "src" / "components" / "course" / "SectionView.tsx"
PDF_REPORT = ROOT / "src" / "components" / "course" / "PdfReport.tsx"


def _between(text: str, start: str, end: str) -> str:
    start_index = text.index(start)
    end_index = text.index(end, start_index + len(start))
    return text[start_index:end_index]


class TestSection02IndependentContract(unittest.TestCase):
    def test_canonical_identity_and_full_gradual_release_graph(self) -> None:
        source = SECTION.read_text(encoding="utf-8")

        self.assertIn("id: 'basics'", source)
        self.assertIn("index: 2", source)
        self.assertIn("title: 'Valores, tipos, operadores e I/O'", source)
        self.assertIn("shortTitle: 'Valores y tipos'", source)

        subtopics = set(re.findall(r"subtopicId: 'S02-T[1-4]-[AB]'", source))
        demos = set(re.findall(r"demoId: 'S02-T[1-4]-[AB]-DEMO'", source))
        exercises = set(re.findall(r"id: 'S02-T[1-4]-[AB]-E[1-3]'", source))
        topic_evaluations = set(re.findall(r"id: 'S02-T[1-4]-TE'", source))

        self.assertEqual(len(subtopics), 8)
        self.assertEqual(len(demos), 8)
        self.assertEqual(len(exercises), 24)
        self.assertEqual(len(topic_evaluations), 4)
        self.assertIn('def safe_int(campo: str, valor: str)', source)
        self.assertIn('def parse_client(', source)
        self.assertIn('raise NotImplementedError', source)
        self.assertIn('assert r["errors"] == []', source)

    def test_all_published_python_examples_match_their_output(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        pairs = re.findall(
            r"^\s+code: `([^`]*)`,\n\s+output: `([^`]*)`,",
            source,
            re.MULTILINE,
        )
        self.assertEqual(len(pairs), 41)

        for index, (code, expected_output) in enumerate(pairs):
            with self.subTest(example=index):
                result = subprocess.run(
                    [sys.executable, "-c", code],
                    cwd=ROOT,
                    check=False,
                    capture_output=True,
                    text=True,
                    timeout=10,
                )
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual(result.stdout.rstrip(), expected_output.rstrip())

    def test_playground_executes_the_s02_raw_clean_contract(self) -> None:
        source = SECTION_VIEW.read_text(encoding="utf-8")
        block = _between(source, "    'basics': {", "    'data-structures': {")

        self.assertIn("Practica el contrato raw/clean", block)
        self.assertIn('def safe_int(campo, valor):', block)
        self.assertIn('"raw": raw', block)
        self.assertIn('"clean": None', block)
        self.assertNotIn("lista comprehension", block.lower())
        self.assertNotIn("Cuadrados", block)

        match = re.search(
            r"code: `(?P<code>.*?)`,\n\s+expectedOutput: `(?P<output>.*?)`,",
            block,
            re.DOTALL,
        )
        self.assertIsNotNone(match)
        assert match is not None
        result = subprocess.run(
            [sys.executable, "-c", match.group("code")],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
            timeout=10,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.rstrip(), match.group("output").rstrip())

    def test_newbie_packet_parser_sees_24_unique_exercise_ids(self) -> None:
        manifest = active_manifest(parse_section_learner(SECTION))
        exercise_ids = manifest["exercise_ids"]

        self.assertEqual(len(exercise_ids), 24)
        self.assertEqual(len(set(exercise_ids)), 24)
        self.assertEqual(
            exercise_ids,
            [
                f"S02-T{topic}-{side}-E{exercise}"
                for topic in range(1, 5)
                for side in ("A", "B")
                for exercise in range(1, 4)
            ],
        )

    def test_pdf_label_matches_the_visible_spanish_identity(self) -> None:
        pdf = PDF_REPORT.read_text(encoding="utf-8")
        self.assertIn("basics: '2. Valores y tipos'", pdf)
        self.assertNotIn("basics: '2. Basics'", pdf)

    def test_authenticated_bank_is_balanced_by_concept_and_attempt(self) -> None:
        seed = SEED.read_text(encoding="utf-8")
        bank = _between(seed, "  basics: [", "  // S03 V3")
        entries = [
            (concept, int(index))
            for concept, index in re.findall(
                r"\{\s+concept: '([^']+)'.*?correctIndex: ([0-3]),",
                bank,
                re.DOTALL,
            )
        ]

        self.assertEqual(len(entries), 24)
        by_concept: dict[str, list[int]] = defaultdict(list)
        by_attempt: dict[int, list[int]] = defaultdict(list)
        for question_index, (concept, position) in enumerate(entries):
            by_concept[concept].append(position)
            by_attempt[question_index % 3].append(position)

        self.assertEqual(len(by_concept), 8)
        self.assertTrue(all(len(positions) == 3 for positions in by_concept.values()))
        self.assertTrue(
            all(len(set(positions)) == 3 for positions in by_concept.values()),
            "Las variantes de un concepto deben mover la respuesta correcta.",
        )
        self.assertEqual(
            Counter(position for _, position in entries),
            Counter({0: 6, 1: 6, 2: 6, 3: 6}),
        )
        for positions in by_attempt.values():
            self.assertEqual(
                Counter(positions),
                Counter({0: 2, 1: 2, 2: 2, 3: 2}),
            )

    def test_public_self_check_covers_the_complete_section(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        block = _between(source, "  selfCheck: {", "  topicEvaluations: [")
        positions = [
            int(index)
            for index in re.findall(r"correctIndex: ([0-3]),", block)
        ]

        self.assertEqual(len(positions), 11)
        distribution = Counter(positions)
        self.assertLessEqual(max(distribution.values()) - min(distribution.values()), 1)
        for required_contract in (
            "-3**2",
            'Decimal("0.1")',
            "input()",
            "edad_raw",
            "raw conserva los espacios",
        ):
            self.assertIn(required_contract, block)


if __name__ == "__main__":
    unittest.main()
