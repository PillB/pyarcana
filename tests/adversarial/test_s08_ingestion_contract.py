"""Section 8 regressions: ingestion pedagogy, runtime mappings, and exam integrity."""

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


SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s08-pandas.ts"
SEED = ROOT / "prisma" / "seed.ts"
SECTION_VIEW = ROOT / "src" / "components" / "course" / "SectionView.tsx"
PDF_REPORT = ROOT / "src" / "components" / "course" / "PdfReport.tsx"


def _between(text: str, start: str, end: str) -> str:
    start_index = text.index(start)
    end_index = text.index(end, start_index + len(start))
    return text[start_index:end_index]


class TestS08IngestionContract(unittest.TestCase):
    def test_newbie_manifest_exposes_canonical_exercise_ids_in_order(self) -> None:
        manifest = active_manifest(parse_section_learner(SECTION))
        expected = [
            f"S08-T{topic}-{part}-E{exercise}"
            for topic in range(1, 5)
            for part in ("A", "B")
            for exercise in range(1, 4)
        ]

        self.assertEqual(manifest["exercise_ids"], expected)
        self.assertEqual(len(set(manifest["exercise_ids"])), 24)

    def test_canonical_identity_and_gradual_release_surface(self) -> None:
        source = SECTION.read_text(encoding="utf-8")

        self.assertIn('id: "pandas"', source)
        self.assertIn('index: 8', source)
        self.assertIn(
            'title: "Archivos, CSV, JSON y contratos de ingesta"',
            source,
        )

        subtopics = set(re.findall(r'S08-T[1-4]-[AB]', source))
        demos = set(re.findall(r'S08-T[1-4]-[AB]-DEMO', source))
        exercises = set(re.findall(r'S08-T[1-4]-[AB]-E[1-3]', source))
        self.assertEqual(len(subtopics), 8)
        self.assertEqual(len(demos), 8)
        self.assertEqual(len(exercises), 24)

        for required_contract in (
            "n_in == n_clean + n_quarantine",
            "UnicodeDecodeError",
            "utf-8-sig",
            "write_atomic",
            "JSONL",
            "reconcile_ok",
        ):
            self.assertIn(required_contract, source)

        learner_text = source.lower()
        self.assertNotIn("en v3", learner_text)
        self.assertNotIn("id plataforma", learner_text)
        self.assertNotIn("groupby de demo", learner_text)
        self.assertNotIn("reprocessar", learner_text)

    def test_public_self_check_covers_all_answer_positions(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        block = _between(source, "  selfCheck: {", "  resources: {")
        positions = [
            int(index)
            for index in re.findall(r"correctIndex:\s*([0-3]),", block)
        ]

        self.assertEqual(len(positions), 11)
        self.assertEqual(set(positions), {0, 1, 2, 3})
        self.assertLessEqual(max(Counter(positions).values()), 3)

    def test_authenticated_bank_is_equivalent_and_position_balanced(self) -> None:
        seed = SEED.read_text(encoding="utf-8")
        block = _between(seed, "  // S08 V3", "\n  visualization: [")
        entries = re.findall(
            r"\{\s+concept: '([^']+)'.*?correctIndex:\s*([0-3]),",
            block,
            re.DOTALL,
        )

        self.assertEqual(len(entries), 24)
        by_concept: dict[str, list[int]] = defaultdict(list)
        for concept, position in entries:
            by_concept[concept].append(int(position))

        self.assertEqual(len(by_concept), 8)
        self.assertTrue(all(len(positions) == 3 for positions in by_concept.values()))
        self.assertTrue(
            all(len(set(positions)) == 3 for positions in by_concept.values()),
            "Cada concepto debe mover la respuesta correcta entre sus tres variantes.",
        )

        positions = [int(position) for _, position in entries]
        self.assertEqual(Counter(positions), Counter({0: 6, 1: 6, 2: 6, 3: 6}))

        by_attempt: dict[int, list[int]] = defaultdict(list)
        for question_index, position in enumerate(positions):
            by_attempt[question_index % 3].append(position)
        for attempt_positions in by_attempt.values():
            self.assertEqual(
                Counter(attempt_positions),
                Counter({0: 2, 1: 2, 2: 2, 3: 2}),
            )

        learner_bank = block[block.index("  pandas: [") :].lower()
        self.assertNotIn("id plataforma pandas", learner_bank)
        self.assertNotIn("s08 v3", learner_bank)
        self.assertNotIn("bad_column_count", learner_bank)
        self.assertIn("col_count", learner_bank)

    def test_runtime_playground_is_on_topic_and_executable(self) -> None:
        section_view = SECTION_VIEW.read_text(encoding="utf-8")
        block = _between(section_view, "    'pandas': {", "    'visualization': {")

        self.assertIn("Practica ingesta con cuarentena y manifest", block)
        self.assertIn('reason": "cast_monto"', block)
        self.assertIn('"reconcile_ok"', block)
        self.assertNotIn("import pandas", block)
        self.assertNotIn("groupby", block)

        match = re.search(
            r"code: `(?P<code>.*?)`,\n\s+expectedOutput: `(?P<output>.*?)`,",
            block,
            re.DOTALL,
        )
        self.assertIsNotNone(match)
        assert match is not None

        executable_code = match.group("code").replace("\\\\n", "\\n")
        completed = subprocess.run(
            [sys.executable, "-c", executable_code],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        )
        self.assertEqual(completed.stdout.rstrip(), match.group("output").rstrip())

    def test_pdf_label_matches_files_and_etl_scope(self) -> None:
        pdf = PDF_REPORT.read_text(encoding="utf-8")
        self.assertIn("pandas: '8. Archivos & ETL'", pdf)
        self.assertNotIn("pandas: '8. Pandas'", pdf)


if __name__ == "__main__":
    unittest.main()
