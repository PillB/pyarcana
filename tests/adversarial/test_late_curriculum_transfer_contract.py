"""Pedagogy regressions found by the independent S14-S39 Fixer review."""
from __future__ import annotations

import re
import tempfile
import unittest
from pathlib import Path

from tests.adversarial.test_active_v3_curriculum_contract import section_ids

# Slugs, not numbers (design G-4): a renumber moves these sections' numbers and their exercise
# ids together, so a number-keyed test would check whichever lesson took the old number.
TRANSFER_SLUGS = (
    "streaming-data",
    "microservices",
    "advanced-models",
    "cv-ai-integration",
    "system-design",
    "ai-apis-advanced",
    "dbt-bigquery",
    "performance-extreme",
    "integrator-phase2",
)
ADVANCED_MODELS = "advanced-models"
INTEGRATOR_PHASE2 = "integrator-phase2"
KIND_BY_EXERCISE = {1: "guided", 2: "independent", 3: "transfer"}


def transfer_gaps(text: str, number: int) -> list[str]:
    """Each exercise whose `kind:` is not the rung the section must show, named by its id."""
    gaps = []
    for topic in range(1, 5):
        for half in "AB":
            for exercise, kind in KIND_BY_EXERCISE.items():
                pattern = re.compile(
                    rf'id:\s*"S{number:02d}-T{topic}-{half}-E{exercise}"'
                    rf'.{{0,180}}?kind:\s*"{kind}"',
                    re.DOTALL,
                )
                if not pattern.search(text):
                    gaps.append(f"S{number:02d}-T{topic}-{half}-E{exercise} is not kind {kind!r}")
    return gaps


def _course_entry(number: int, topic: int, half: str, exercise: int, kind: str) -> str:
    # Padding keeps each exercise further than the 180-character window from the next one.
    return f'id: "S{number:02d}-T{topic}-{half}-E{exercise}",\n  kind: "{kind}",\n' + "x" * 200 + "\n"


class TestLateCurriculumTransferContract(unittest.TestCase):
    def test_transfer_sections_restore_guided_independent_transfer_per_subtopic(self):
        ids = section_ids()
        for slug in TRANSFER_SLUGS:
            number, path = ids[slug]
            with self.subTest(section=slug, number=number):
                text = path.read_text(encoding="utf-8")
                self.assertEqual(transfer_gaps(text, number), [])

    def test_a_demoted_exercise_is_named_on_its_own_section(self):
        """Recreation: one exercise kind wrong in an otherwise complete section is reported."""
        entries = []
        for topic in range(1, 5):
            for half in "AB":
                for exercise, kind in KIND_BY_EXERCISE.items():
                    if (topic, half, exercise) == (1, "A", 3):
                        kind = "guided"
                    entries.append(_course_entry(33, topic, half, exercise, kind))
        self.assertEqual(transfer_gaps("".join(entries), 33), ["S33-T1-A-E3 is not kind 'transfer'"])

    def test_a_slug_follows_its_binding_not_the_number_it_used_to_have(self):
        """Recreation of the wrong-section pass: after a renumber the slug is found at its new number."""
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "src/lib/course/sections").mkdir(parents=True)
            (root / "src/lib/course/index.ts").write_text(
                "import { section33 } from './sections/s31-streaming-data'\n", encoding="utf-8"
            )
            (root / "src/lib/course/sections/s31-streaming-data.ts").write_text(
                "export const s = {\n  id: 'streaming-data',\n}\n", encoding="utf-8"
            )
            self.assertEqual(section_ids(root)["streaming-data"][0], 33)

    def test_advanced_models_does_not_reveal_reference_solution_format(self):
        text = section_ids()[ADVANCED_MODELS][1].read_text(encoding="utf-8")
        self.assertNotIn("Imprime exactamente las líneas de la solución de referencia", text)
        self.assertNotIn("Tres prints finales", text)

    def test_integrator_phase2_capstone_has_no_placeholder_or_planned_state(self):
        text = section_ids()[INTEGRATOR_PHASE2][1].read_text(encoding="utf-8")
        self.assertNotRegex(text, re.compile(r"(?i)#\s*placeholders|PLANNED_NOT_PASSED"))


if __name__ == "__main__":
    unittest.main()
