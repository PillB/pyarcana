"""Text-first regressions for Section 4's complete learner journey."""

from __future__ import annotations

from pathlib import Path
import re
import unittest

from scripts.newbie_packet_builder import active_manifest, parse_section_learner
from tests.adversarial.test_over_localized_language import PE_CITIES


ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s04-functions-modules.ts"


def _between(text: str, start: str, end: str) -> str:
    start_index = text.index(start)
    end_index = text.index(end, start_index + len(start))
    return text[start_index:end_index]


def _words(text: str) -> list[str]:
    return re.findall(r"\b[\wÁÉÍÓÚÜÑáéíóúüñ]+\b", text)


class Section04TextFirstProseTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SECTION.read_text(encoding="utf-8")

    def test_theory_uses_decision_first_mental_models_across_all_topics(self) -> None:
        theory = _between(self.source, "  theory: [", "  iDo: {")

        for anchor in (
            "Imagina una cinta transportadora",
            "el índice es equipaje innecesario",
            "Dos problemas parecen iguales y no lo son",
            "¿qué debe cambiar para que esto termine?",
            "clasifica el hecho",
            "Un resumen fiable responde tres preguntas distintas",
            "una frase compacta para una idea compacta",
            "convierte el bucle en una película",
            "Dos programas pueden imprimir el mismo resumen",
        ):
            with self.subTest(anchor=anchor):
                self.assertIn(anchor, theory)

        self.assertEqual(
            set(re.findall(r'subtopicId: "(S04-T[1-4]-[AB])"', theory)),
            {
                f"S04-T{topic}-{strand}"
                for topic in range(1, 5)
                for strand in ("A", "B")
            },
        )

    def test_every_i_do_requests_prediction_and_closes_with_transfer(self) -> None:
        i_do = _between(self.source, "  iDo: {", "  weDo: {")
        preambles = re.findall(
            r'preamble:\s*\n?\s*"((?:\\.|[^"])*)"',
            i_do,
            re.DOTALL,
        )
        retrospectives = re.findall(
            r'retrospective:\s*\n?\s*"((?:\\.|[^"])*)"',
            i_do,
            re.DOTALL,
        )

        self.assertEqual(len(preambles), 8)
        self.assertEqual(len(retrospectives), 8)
        self.assertTrue(
            all(
                any(cue in text.lower() for cue in ("predic", "traza", "clasifica"))
                for text in preambles
            )
        )
        self.assertTrue(all(len(_words(text)) >= 30 for text in retrospectives))
        self.assertEqual(len(set(retrospectives)), 8)
        self.assertIn("cada `output` es un oráculo ejecutable", i_do)

    def test_all_24_we_do_exercises_end_with_explanation_and_transfer(self) -> None:
        we_do = _between(self.source, "  weDo: {", "  youDo: {")
        exercise_starts = [
            (match.group(1), match.start())
            for match in re.finditer(
                r'id: "(S04-T[1-4]-[AB]-E[1-3])"',
                we_do,
            )
        ]

        expected_ids = {
            f"S04-T{topic}-{strand}-E{exercise}"
            for topic in range(1, 5)
            for strand in ("A", "B")
            for exercise in range(1, 4)
        }
        self.assertEqual({exercise_id for exercise_id, _ in exercise_starts}, expected_ids)

        reasoning_cues = re.compile(
            r"\b(Explica|explica|Compara|compara|Predice|predice|"
            r"Describe|describe|Demuestra|demuestra|Formula|formula|"
            r"Distingue|distingue|Comprueba|comprueba|Nombra|nombra|"
            r"Piensa|piensa|Escribe|escribe|Señala|señala|Cambia|cambia|"
            r"Lee|lee|Contrasta|contrasta)\b"
        )
        for index, (exercise_id, start) in enumerate(exercise_starts):
            end = (
                exercise_starts[index + 1][1]
                if index + 1 < len(exercise_starts)
                else len(we_do)
            )
            block = we_do[start:end]
            match = re.search(
                r'retrospective:\s*\n?\s*"((?:\\.|[^"])*)"',
                block,
                re.DOTALL,
            )
            self.assertIsNotNone(match, exercise_id)
            assert match is not None
            retrospective = match.group(1)
            self.assertGreaterEqual(len(_words(retrospective)), 30, exercise_id)
            self.assertRegex(retrospective, reasoning_cues, exercise_id)

    def test_you_do_and_self_check_require_reviewable_reasoning(self) -> None:
        you_do = _between(self.source, "  youDo: {", "  selfCheck: {")
        self_check = _between(self.source, "  selfCheck: {", "  resources: {")

        for anchor in (
            "una promesa verificable",
            "escribe los invariantes",
            "cuenta la historia de un lote pequeño",
            "Haz una defensa de cierre",
            "100,000 filas",
        ):
            self.assertIn(anchor, you_do)

        explanations = re.findall(
            r'explanation:\s*\n?\s*"((?:\\.|[^"])*)"',
            self_check,
            re.DOTALL,
        )
        self.assertEqual(len(explanations), 8)
        self.assertTrue(all(len(_words(text)) >= 25 for text in explanations))
        self.assertEqual(len(set(explanations)), 8)

    def test_manifest_still_exposes_every_canonical_practice_id(self) -> None:
        section = parse_section_learner(SECTION)
        manifest = active_manifest(section)
        ids = manifest["exercise_ids"]

        self.assertEqual(len(ids), 24)
        self.assertEqual(len(set(ids)), 24)
        self.assertEqual(
            set(ids),
            {
                f"S04-T{topic}-{strand}-E{exercise}"
                for topic in range(1, 5)
                for strand in ("A", "B")
                for exercise in range(1, 4)
            },
        )

    def test_locality_flavor_stays_below_the_active_density_cap(self) -> None:
        prose_lines = [
            line
            for line in self.source.splitlines()
            if "CASO-" not in line
        ]
        locality_count = len(PE_CITIES.findall("\n".join(prose_lines)))

        self.assertLessEqual(
            locality_count,
            55,
            f"S04 has {locality_count} PE city tokens in prose (cap 55)",
        )
        self.assertIn("Quito", self.source)
        self.assertIn("Bogotá", self.source)
        self.assertIn("Madrid", self.source)


if __name__ == "__main__":
    unittest.main()
