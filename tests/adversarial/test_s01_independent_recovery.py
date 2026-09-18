from __future__ import annotations

import sys
from collections import Counter, defaultdict
from pathlib import Path
import re
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from scripts.newbie_packet_builder import active_manifest, parse_section_learner


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
        exercise_ids = [
            f"{subtopic}-E{exercise}"
            for subtopic in subtopics
            for exercise in range(1, 4)
        ]

        for subtopic in subtopics:
            self.assertIn(f"demoId: '{subtopic}-DEMO'", lesson)
            self.assertGreaterEqual(lesson.count(f"subtopicId: '{subtopic}'"), 5)
            for exercise in range(1, 4):
                self.assertIn(f"id: '{subtopic}-E{exercise}'", lesson)

        self.assertEqual(len(re.findall(r"demoId: 'S01-T[1-4]-[AB]-DEMO'", lesson)), 8)
        self.assertEqual(
            re.findall(r"id: '(S01-T[1-4]-[AB]-E[1-3])'", lesson),
            exercise_ids,
        )
        manifest = active_manifest(parse_section_learner(SECTION))
        self.assertEqual(manifest["exercise_ids"], exercise_ids)

    def test_first_use_definitions_are_inline_and_git_initializes_main(self) -> None:
        lesson = SECTION.read_text(encoding="utf-8")

        self.assertIn(
            "entorno virtual (`venv`) es un directorio aislado, asociado a un intérprete Python",
            lesson,
        )
        self.assertIn("**Git** es el sistema que conserva el historial de cambios", lesson)
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
            [sys.executable, "-c", match.group("code")],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        )
        self.assertEqual(run.stdout.rstrip(), match.group("output").rstrip())
        # D9: the S01 playground is the learner's first editable script, so it runs top to
        # bottom. It used to demonstrate the entrypoint guard, which needs `def`, `if` and
        # `__name__` — none of them taught in S01, and the section's own callout said a script
        # needs neither.
        for forbidden in ("def main(", "__main__"):
            self.assertNotIn(forbidden, match.group("code"))
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
        self.assertEqual(positions, [0, 2, 3, 1, 0, 2, 3, 1])
        for term in ("entorno virtual", "código de salida", "commit", "Ruff"):
            self.assertIn(term, block)

    def test_ruff_exercise_starts_dirty_and_ends_clean(self) -> None:
        """The F401 contract, which is what this exercise is actually for.

        This used to pin the blank lines around `def main():`, demonstrating ruff's E-rules.
        D9 removed the entrypoint from S01 entirely — a beginner cannot read `def`, `if` and
        `import __name__` in the first section — so there is no function left to space. What
        the exercise has always been about survives and is now pinned directly: the starter
        carries imports it never uses, ruff reports them, and the fix leaves a script that
        still prints both lines.
        """
        lesson = SECTION.read_text(encoding="utf-8")
        block = _between(lesson, "id: 'S01-T4-A-E2'", "id: 'S01-T4-A-E3'")
        starter = _between(block, "starterCode: {", "solutionCode: {")
        solution = _between(block, "solutionCode: {", "output: `hola")

        self.assertIn("import sys", starter, "the starter must carry the unused import F401 reports")
        self.assertIn("import os", starter)
        self.assertNotIn("import sys", solution, "the fix removes the unused imports")
        self.assertNotIn("import os", solution)
        self.assertIn("from datetime import datetime", solution, "the used import stays")
        for line in ('print("hola")', "print(datetime.now().date())"):
            self.assertIn(line, starter)
            self.assertIn(line, solution)
        for forbidden in ("def main(", "__main__"):
            self.assertNotIn(forbidden, starter, "D9: no entrypoint idiom in S01")
            self.assertNotIn(forbidden, solution, "D9: no entrypoint idiom in S01")


if __name__ == "__main__":
    unittest.main()
