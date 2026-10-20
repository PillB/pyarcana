#!/usr/bin/env python3
"""Regression gates for the S40-S52 substantive Master curriculum."""
from __future__ import annotations

import re
import tempfile
import unittest
from pathlib import Path

from tests.adversarial.test_active_v3_curriculum_contract import section_ids


ROOT = Path(__file__).resolve().parents[2]

# Slugs, not a range of file-name numbers (design G-4). A renumber renames these files, so a
# scan by file name keeps the old range and quietly stops covering the master tier.
MASTER_SLUGS = (
    "architecture-ddd-decisions",
    "llm-finetuning",
    "graph-rag",
    "llmops",
    "multimodal",
    "iac",
    "gpu-computing",
    "opensource",
    "ai-governance",
    "data-contracts",
    "tech-leadership",
    "integrator-final",
    "career-strategy",
)


def files_for_slugs(slugs, root: Path = ROOT) -> list[Path]:
    """The lesson file each slug is bound to, sorted by path."""
    ids = section_ids(root)
    return sorted(ids[slug][1] for slug in slugs)


MASTER_FILES = files_for_slugs(MASTER_SLUGS)

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


class MasterSetFollowsSlugs(unittest.TestCase):
    def test_every_master_slug_is_bound_on_the_real_tree(self):
        self.assertEqual(len(MASTER_FILES), len(MASTER_SLUGS))
        for path in MASTER_FILES:
            self.assertTrue(path.is_file(), path)

    def test_a_master_lesson_renumbered_past_52_is_still_found(self):
        """Recreation: career-strategy renumbered to 55 with its file is still in the set.

        The old scan kept file names 40..52, so the final lesson at 55 would drop out of every
        master check without any test failing.
        """
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "src/lib/course/sections").mkdir(parents=True)
            (root / "src/lib/course/index.ts").write_text(
                "import { section55 } from './sections/s55-career-strategy'\n", encoding="utf-8"
            )
            (root / "src/lib/course/sections/s55-career-strategy.ts").write_text(
                "export const s = {\n  id: 'career-strategy',\n}\n", encoding="utf-8"
            )
            found = files_for_slugs(("career-strategy",), root)
            self.assertEqual(found, [root / "src/lib/course/sections/s55-career-strategy.ts"])


if __name__ == "__main__":
    unittest.main()
