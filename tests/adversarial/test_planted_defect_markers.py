"""The planted-defect audit has to recognise how the course actually declares a defect.

The first version matched a literal tuple — "DEFECT", "(bug)", "bug)" — which caught the loudest
spelling and missed the rest. The sections write "DEFECT:", "defect;", "Bug intencional" and
"# Bug a corregir", so whole groups of exercises were never run and the audit reported them clean:
silence that looks exactly like success, which is the failure mode this audit exists to remove.
"""
from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def load():
    spec = importlib.util.spec_from_file_location(
        "planted_defect_audit", ROOT / "scripts/planted_defect_audit.py"
    )
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


class PlantedDefectMarkerTests(unittest.TestCase):
    def setUp(self) -> None:
        self.declares_defect = load().declares_defect

    def test_every_spelling_the_sections_use_is_recognised(self) -> None:
        for text in (
            'instruction: "1. El starter invierte las formulas — ese es el DEFECT."',
            'code: `# DEFECT: default=str oculta TypeError`',
            'preamble: "El starter solo mira la cerca superior (DEFECT de hábito)."',
            'code: `# Bug intencional; la salida no coincide`',
            'code: `# Bug a corregir: el contador arranca en 1`',
            'instruction: "2. Cámbialo a `>=` (bug)."',
            'code: `# Error: invierte train/test`',
        ):
            with self.subTest(text=text):
                self.assertTrue(self.declares_defect(text))

    def test_an_exercise_that_declares_nothing_is_not_swept_in(self) -> None:
        for text in (
            'preamble: "Calcula la mediana de la columna."',
            'code: `logger.debug("traza")`',          # debug is not bug
            'instruction: "Depura el resultado con prints."',
        ):
            with self.subTest(text=text):
                self.assertFalse(self.declares_defect(text))


if __name__ == "__main__":
    unittest.main()
