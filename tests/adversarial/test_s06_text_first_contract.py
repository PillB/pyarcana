"""Text-first coverage and explanation-depth contract for Section 6."""

from __future__ import annotations

import re
import sys
import unittest
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s06-numpy.ts"
SEED = ROOT / "prisma/seed.ts"
sys.path.insert(0, str(ROOT / "scripts"))

from newbie_packet_builder import active_manifest, parse_section_learner  # noqa: E402


def quoted_fields(source: str, field: str) -> list[str]:
    pattern = rf"{re.escape(field)}:\s*(?:\n\s*)?\"((?:\\.|[^\"\\])*)\""
    return [
        value.replace("\\n", "\n").replace('\\"', '"').replace("\\\\", "\\")
        for value in re.findall(pattern, source)
    ]


def word_count(value: str) -> int:
    return len(re.findall(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]+", value))


def s06_seed_block() -> str:
    source = SEED.read_text(encoding="utf-8")
    start = source.index("  numpy: [")
    end = source.index("\n  // S08 V3", start)
    return source[start:end]


class TestS06TextFirstContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SECTION.read_text(encoding="utf-8")
        cls.i_do = cls.source[
            cls.source.index("  iDo: {") : cls.source.index("\n  weDo: {")
        ]
        cls.we_do = cls.source[
            cls.source.index("  weDo: {") : cls.source.index("\n  youDo: {")
        ]
        cls.you_do = cls.source[
            cls.source.index("  youDo: {") : cls.source.index("\n  selfCheck: {")
        ]
        cls.self_check = cls.source[
            cls.source.index("  selfCheck: {") : cls.source.index("\n  resources: {")
        ]

    def test_theory_has_nine_distinct_mental_model_surfaces(self) -> None:
        self.assertEqual(self.source.count("      heading:"), 9)
        for anchor in (
            "centro internacional de ayuda",
            "fila de vagones",
            "etiquetas de equipaje",
            "catálogo de una biblioteca",
            "lista de invitados",
            "árbol pequeño",
            "formulario internacional",
            "tablero de salidas",
            "contrato canónico",
        ):
            with self.subTest(anchor=anchor):
                self.assertIn(anchor, self.source)

        job = quoted_fields(self.source[: self.source.index("  learningOutcomes:")], "jobRelevance")
        self.assertEqual(len(job), 1)
        self.assertGreaterEqual(word_count(job[0]), 65)
        self.assertNotIn("**", job[0])

        theory = self.source[
            self.source.index("  theory: [") : self.source.index("\n  iDo: {")
        ]
        for content in quoted_fields(theory, "content"):
            self.assertNotIn("**", content)

    def test_all_eight_i_do_demos_model_causal_reasoning(self) -> None:
        self.assertEqual(self.i_do.count("demoId:"), 8)
        preambles = quoted_fields(self.i_do, "preamble")
        whys = quoted_fields(self.i_do, "why")
        retrospectives = quoted_fields(self.i_do, "retrospective")
        self.assertEqual((len(preambles), len(whys), len(retrospectives)), (8, 8, 8))

        for index, value in enumerate(preambles):
            with self.subTest(surface="preamble", index=index):
                self.assertGreaterEqual(word_count(value), 45)
                self.assertRegex(value.lower(), r"predic|antes de ejecutar|dibuja")
        for index, value in enumerate(whys):
            with self.subTest(surface="why", index=index):
                self.assertGreaterEqual(word_count(value), 45)
                self.assertRegex(
                    value.lower(),
                    r"porque|así|de modo|si |separa|transforma|para |refleja|fija|conserva",
                )
        for index, value in enumerate(retrospectives):
            with self.subTest(surface="retrospective", index=index):
                self.assertGreaterEqual(word_count(value), 45)
                self.assertRegex(value, r"¿|Explica|Compara|Comprueba|Defiende|Señala|Cambia")

    def test_all_twenty_four_we_do_reflections_require_transfer(self) -> None:
        self.assertEqual(self.we_do.count("starterCode:"), 24)
        self.assertEqual(self.we_do.count("solutionCode:"), 24)
        retrospectives = quoted_fields(self.we_do, "retrospective")
        self.assertEqual(len(retrospectives), 24)
        self.assertEqual(len(set(retrospectives)), 24)

        transfer_cue = re.compile(
            r"¿|explica|predice|imagina|compara|defiende|verifica|demuestra|"
            r"añade|dibuja|separa|comprueba|cuenta|completa|escribe|quita|"
            r"elige|recorre|formula"
        )
        for index, value in enumerate(retrospectives):
            with self.subTest(index=index):
                self.assertGreaterEqual(word_count(value), 45)
                self.assertRegex(value.lower(), transfer_cue)

    def test_you_do_and_self_check_make_reasoning_reviewable(self) -> None:
        for anchor in (
            "Trabaja en cuatro pasadas",
            "duplicado idéntico, conflicto, ruta ausente",
            "decisión de diseño",
            "Como autor",
            "Como operador",
            "Como revisor",
        ):
            self.assertIn(anchor, self.you_do)

        explanations = quoted_fields(self.self_check, "explanation")
        self.assertEqual(len(explanations), 9)
        self.assertEqual(len(set(explanations)), 9)
        for index, value in enumerate(explanations):
            with self.subTest(index=index):
                self.assertGreaterEqual(word_count(value), 30)
                self.assertRegex(
                    value.lower(),
                    r"confunde|error|no |porque|por eso|mientras|para |"
                    r"conserva|produce|a costa",
                )

    def test_authenticated_bank_remains_specific_and_balanced(self) -> None:
        block = s06_seed_block()
        concepts = re.findall(r"concept:\s*'([^']+)'", block)
        positions = [int(value) for value in re.findall(r"correctIndex:\s*(\d+)", block)]
        questions = re.findall(
            r"question:\s*(?:\n\s*)?'((?:\\.|[^'\\])*)'", block
        )
        explanations = re.findall(
            r"explanation:\s*(?:\n\s*)?'((?:\\.|[^'\\])*)'", block
        )

        self.assertEqual(len(concepts), 24)
        self.assertEqual(len(questions), 24)
        self.assertEqual(len(set(questions)), 24)
        self.assertEqual(len(explanations), 24)
        self.assertEqual(len(set(explanations)), 24)
        self.assertEqual(Counter(concepts), Counter({concept: 3 for concept in set(concepts)}))
        self.assertEqual(Counter(positions), Counter({0: 6, 1: 6, 2: 6, 3: 6}))

        by_attempt: dict[int, list[int]] = defaultdict(list)
        for index, position in enumerate(positions):
            by_attempt[index % 3].append(position)
        for attempt in by_attempt.values():
            self.assertEqual(Counter(attempt), Counter({0: 2, 1: 2, 2: 2, 3: 2}))

        for explanation in explanations:
            self.assertGreaterEqual(word_count(explanation), 10)
            self.assertNotRegex(
                explanation.lower(),
                r"respuesta correcta|porque sí|según el contenido",
            )

    def test_packet_ids_and_localization_remain_within_fleet_contracts(self) -> None:
        manifest = active_manifest(parse_section_learner(SECTION))
        expected = [
            f"S06-T{topic}-{side}-E{exercise}"
            for topic in range(1, 5)
            for side in ("A", "B")
            for exercise in range(1, 4)
        ]
        self.assertEqual(manifest["exercise_ids"], expected)

        pe_cities = re.compile(
            r"\b(Lima|Cusco|Cuzco|Arequipa|Piura|Tacna|Ayacucho|"
            r"Trujillo|Chiclayo|Iquitos|Huancayo)\b"
        )
        prose = "\n".join(
            line for line in self.source.splitlines() if "CASO-" not in line
        )
        self.assertLessEqual(len(pe_cities.findall(prose)), 55)


if __name__ == "__main__":
    unittest.main()
