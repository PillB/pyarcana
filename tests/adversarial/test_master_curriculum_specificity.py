#!/usr/bin/env python3
"""Regression gates for the S40-S52 substantive Master curriculum."""
from __future__ import annotations

import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"
MASTER_FILES = sorted(
    path
    for path in SECTIONS.glob("s*.ts")
    if path.name[1:3].isdigit() and 40 <= int(path.name[1:3]) <= 52
)

REJECTED_AUTHORING_LANGUAGE = (
    "Practica con código ejecutable",
    "Demuestra el outcome",
    "Si el assert/print",
    "Cambia únicamente `proof`",
    "Corrige el validador",
    "Endurece el router",
    "Gate local: conserva",
    "cross_encoder_stub",
    "# TODO",
    "Platform id preservado",
    "KEEP_PLATFORM_ID_RETHEME_CONTENT",
    "implementar incremento del blueprint",
)


class TestMasterCurriculumSpecificity(unittest.TestCase):
    def test_exact_master_file_set_and_no_rejected_templates(self):
        self.assertEqual(len(MASTER_FILES), 13)
        for path in MASTER_FILES:
            text = path.read_text(encoding="utf-8")
            with self.subTest(file=path.name):
                for marker in REJECTED_AUTHORING_LANGUAGE:
                    self.assertNotIn(marker, text)

    def test_each_subtopic_has_its_own_fixture_and_domain_predicate(self):
        all_cases: set[str] = set()
        for path in MASTER_FILES:
            number = int(path.name[1:3])
            text = path.read_text(encoding="utf-8")
            cases = set(
                re.findall(r"CASO-[A-Z]{3}-\d{3}-[1-4][AB]", text)
            )
            solution_predicates = set(
                re.findall(
                    r"solutionCode:[\s\S]*?meets_contract = ([^\n]+)",
                    text,
                )
            )
            with self.subTest(section=f"S{number:02d}"):
                self.assertEqual(len(cases), 8, "one fixture id per subtopic")
                self.assertGreaterEqual(
                    len(solution_predicates),
                    8,
                    "each subtopic needs a distinct executable predicate",
                )
            all_cases.update(cases)
        self.assertEqual(len(all_cases), 104)

    def test_gradual_release_contracts_are_present_and_not_copy_demo_tasks(self):
        for path in MASTER_FILES:
            number = int(path.name[1:3])
            text = path.read_text(encoding="utf-8")
            instructions = re.findall(
                r'instruction:\s*"(S\d{2}-T\d-[AB]-E[1-3][^"]+)"',
                text,
            )
            with self.subTest(section=f"S{number:02d}"):
                self.assertEqual(len(instructions), 24)
                self.assertEqual(len(set(instructions)), 24)
                self.assertEqual(sum("-E1" in item for item in instructions), 8)
                self.assertEqual(sum("-E2" in item for item in instructions), 8)
                self.assertEqual(sum("-E3" in item for item in instructions), 8)
                self.assertTrue(
                    all(
                        "Salida" in item
                        or "salidas" in item
                        or "debe devolver" in item
                        for item in instructions
                    )
                )

    def test_theory_gates_and_official_resources_are_section_specific(self):
        intros: set[str] = set()
        callouts: set[str] = set()
        for path in MASTER_FILES:
            text = path.read_text(encoding="utf-8")
            intro = re.search(r'weDo:\s*\{\s*intro:\s*"([^"]+)"', text)
            self.assertIsNotNone(intro, path.name)
            intros.add(intro.group(1))
            section_callouts = re.findall(
                r'content:\s*"((?:Evidencia mínima de|Antes de promover|La revisión de|Contrato S\d|Para S\d|Promoción de|El dueño de|Cierre de)[^"]+)"',
                text,
            )
            with self.subTest(file=path.name):
                self.assertEqual(len(section_callouts), 8)
                self.assertIn("https://", text)
                self.assertNotEqual(text.count('label: "Python docs"'), 1)
            callouts.update(section_callouts)
        self.assertEqual(len(intros), 13)
        self.assertEqual(len(callouts), 104)


if __name__ == "__main__":
    unittest.main()
