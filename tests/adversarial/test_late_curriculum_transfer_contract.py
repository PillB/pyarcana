"""Pedagogy regressions found by the independent S14-S39 Fixer review."""
from __future__ import annotations

import re
import unittest
from pathlib import Path

from tests.adversarial.test_active_v3_curriculum_contract import active_sections


class TestLateCurriculumTransferContract(unittest.TestCase):
    def test_s31_s39_restore_guided_independent_transfer_per_subtopic(self):
        sections = active_sections()
        for number in range(31, 40):
            text = sections[number].read_text(encoding="utf-8")
            for topic in range(1, 5):
                for half in "AB":
                    expected = {1: "guided", 2: "independent", 3: "transfer"}
                    for exercise, kind in expected.items():
                        pattern = re.compile(
                            rf'id:\s*"S{number:02d}-T{topic}-{half}-E{exercise}"'
                            rf'.{{0,180}}?kind:\s*"{kind}"',
                            re.DOTALL,
                        )
                        with self.subTest(section=number, topic=topic, half=half, exercise=exercise):
                            self.assertRegex(text, pattern)

    def test_s33_does_not_reveal_reference_solution_format(self):
        text = active_sections()[33].read_text(encoding="utf-8")
        self.assertNotIn("Imprime exactamente las líneas de la solución de referencia", text)
        self.assertNotIn("Tres prints finales", text)

    def test_s39_capstone_has_no_placeholder_or_planned_state(self):
        text = active_sections()[39].read_text(encoding="utf-8")
        self.assertNotRegex(text, re.compile(r"(?i)#\s*placeholders|PLANNED_NOT_PASSED"))


if __name__ == "__main__":
    unittest.main()
