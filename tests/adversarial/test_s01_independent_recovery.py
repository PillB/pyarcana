from __future__ import annotations

from collections import Counter, defaultdict
from pathlib import Path
import re
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[2]
INDEX = ROOT / "src" / "lib" / "course" / "index.ts"
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s01-setup.ts"
SEED = ROOT / "prisma" / "seed.ts"
SECTION_VIEW = ROOT / "src" / "components" / "course" / "SectionView.tsx"
PDF_REPORT = ROOT / "src" / "components" / "course" / "PdfReport.tsx"


def _between(text: str, start: str, end: str) -> str:
    start_index = text.index(start)
    end_index = text.index(end, start_index)
    return text[start_index:end_index]


class Section01IndependentRecoveryTests(unittest.TestCase):
    def test_canonical_identity_and_section_owned_mappings(self) -> None:
        index = INDEX.read_text(encoding="utf-8")
        lesson = SECTION.read_text(encoding="utf-8")
        pdf = PDF_REPORT.read_text(encoding="utf-8")

        self.assertIn("import { section01 } from './sections/s01-setup'", index)
        self.assertIn("id: 'setup'", lesson)
        self.assertIn("index: 1", lesson)
        self.assertIn("title: 'Entorno reproducible y trabajo seguro'", lesson)
        self.assertIn("setup: '1. Entorno'", pdf)
        self.assertNotIn("setup: '1. Setup'", pdf)

    def test_all_eight_subtopics_have_model_and_three_practices(self) -> None:
        lesson = SECTION.read_text(encoding="utf-8")
        subtopics = [f"S01-T{topic}-{part}" for topic in range(1, 5) for part in "AB"]

        for subtopic in subtopics:
            self.assertIn(f"demoId: '{subtopic}-DEMO'", lesson)
            self.assertGreaterEqual(lesson.count(f"subtopicId: '{subtopic}'"), 5)
            for exercise in range(1, 4):
                self.assertIn(f"id: '{subtopic}-E{exercise}'", lesson)

        self.assertEqual(len(re.findall(r"demoId: 'S01-T[1-4]-[AB]-DEMO'", lesson)), 8)
        self.assertEqual(len(re.findall(r"id: 'S01-T[1-4]-[AB]-E[1-3]'", lesson)), 24)

    def test_first_use_definitions_are_inline_and_git_initializes_main(self) -> None:
        lesson = SECTION.read_text(encoding="utf-8")

        self.assertIn(
            "**entorno virtual** (una carpeta aislada con el Python y los paquetes del proyecto)",
            lesson,
        )
        self.assertIn("**Git** (el sistema que conserva el historial de cambios)", lesson)
        self.assertGreaterEqual(lesson.count("git init -b main"), 3)
        self.assertNotIn("git push -u origin feat/hello-env\n# Abre el PR", lesson)

    def test_git_guided_path_runs_on_an_unconfigured_default_branch(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            workdir = Path(directory)
            commands = [
                ["git", "init", "-b", "main"],
                ["git", "config", "--local", "user.name", "PyArcana Test"],
                ["git", "config", "--local", "user.email", "pyarcana@example.invalid"],
            ]
            for command in commands:
                subprocess.run(command, cwd=workdir, check=True, capture_output=True, text=True)

            (workdir / "README.md").write_text("# lab\n", encoding="utf-8")
            subprocess.run(["git", "add", "README.md"], cwd=workdir, check=True)
            subprocess.run(
                ["git", "commit", "-m", "docs: agregar README de practica"],
                cwd=workdir,
                check=True,
                capture_output=True,
                text=True,
            )
            branch = subprocess.run(
                ["git", "branch", "--show-current"],
                cwd=workdir,
                check=True,
                capture_output=True,
                text=True,
            )
            self.assertEqual(branch.stdout.strip(), "main")

    def test_playground_executes_the_section_one_entrypoint_contract(self) -> None:
        source = SECTION_VIEW.read_text(encoding="utf-8")
        block = _between(source, "    'setup': {", "    'basics': {")
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
        self.assertIn("if __name__ == \"__main__\":", match.group("code"))
        self.assertNotIn("edad_meses", block)

    def test_authenticated_bank_is_balanced_across_attempts_and_concepts(self) -> None:
        seed = SEED.read_text(encoding="utf-8")
        bank = _between(seed, "  setup: [", "  basics: [")
        entries = re.findall(
            r"\{\s+concept: '([^']+)'.*?correctIndex:\s*([0-3]),",
            bank,
            re.DOTALL,
        )

        self.assertEqual(len(entries), 24)
        positions = [int(index) for _, index in entries]
        self.assertEqual(Counter(positions), Counter({0: 6, 1: 6, 2: 6, 3: 6}))

        by_concept: dict[str, list[int]] = defaultdict(list)
        for concept, position in entries:
            by_concept[concept].append(int(position))
        self.assertEqual(len(by_concept), 8)
        self.assertTrue(all(len(values) == 3 for values in by_concept.values()))
        self.assertTrue(all(len(set(values)) == 3 for values in by_concept.values()))

        for attempt in range(3):
            attempt_positions = positions[attempt::3]
            self.assertEqual(
                Counter(attempt_positions),
                Counter({0: 2, 1: 2, 2: 2, 3: 2}),
            )

    def test_public_self_check_is_balanced_and_covers_all_four_topics(self) -> None:
        lesson = SECTION.read_text(encoding="utf-8")
        block = _between(lesson, "  selfCheck: {", "  topicEvaluations: [")
        positions = [int(value) for value in re.findall(r"correctIndex:\s*([0-3]),", block)]

        self.assertEqual(len(positions), 8)
        self.assertEqual(Counter(positions), Counter({0: 2, 1: 2, 2: 2, 3: 2}))
        for term in ("entorno virtual", "código de salida", "commit", "Ruff"):
            self.assertIn(term, block)

    def test_ruff_solution_has_module_level_spacing_for_e_rules(self) -> None:
        lesson = SECTION.read_text(encoding="utf-8")
        block = _between(lesson, "id: 'S01-T4-A-E2'", "id: 'S01-T4-A-E3'")
        solution = _between(block, "solutionCode: {", "output: `hola")

        self.assertIn("from datetime import datetime\n\n\ndef main():", solution)
        self.assertIn('print(datetime.now().date())\n\n\nif __name__ == "__main__":', solution)


if __name__ == "__main__":
    unittest.main()
