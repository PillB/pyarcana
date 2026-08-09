"""Learner-visible text-first regressions for Section 2."""

from __future__ import annotations

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s02-basics.ts"


def _between(text: str, start: str, end: str) -> str:
    start_index = text.index(start)
    end_index = text.index(end, start_index + len(start))
    return text[start_index:end_index]


class TestSection02TextFirstQuality(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SECTION.read_text(encoding="utf-8")

    def test_theory_has_a_bridge_and_active_retrieval_for_every_subtopic(self) -> None:
        theory = _between(self.source, "  theory: [", "  iDo: {")

        self.assertIn("En S01 preparaste el taller", theory)
        self.assertEqual(theory.count("**Puente desde"), 8)
        for anchor in (
            "**Detente y predice:**",
            "**Modelo mental:**",
            "**Prueba de lectura:**",
            "**Predicción antes del `append`:**",
            "**Predice, luego ejecuta:**",
            "**Comprueba la causa:**",
            "**Predicción útil:**",
            "**Cierre de la cadena:**",
        ):
            self.assertIn(anchor, theory)

        subtopics = re.findall(r"subtopicId: '(S02-T[1-4]-[AB])'", theory)
        self.assertEqual(subtopics, [
            "S02-T1-A",
            "S02-T1-B",
            "S02-T2-A",
            "S02-T2-B",
            "S02-T3-A",
            "S02-T3-B",
            "S02-T4-A",
            "S02-T4-B",
        ])

    def test_every_i_do_demo_asks_for_a_prediction_before_execution(self) -> None:
        i_do = _between(self.source, "  iDo: {", "  weDo: {")
        demo_ids = re.findall(r"demoId: '(S02-T[1-4]-[AB]-DEMO)'", i_do)
        self.assertEqual(len(demo_ids), 8)
        self.assertEqual(i_do.count("**Predicción"), 8)
        self.assertIn("predice una línea", i_do)
        self.assertIn("explicar por qué hizo *eso*", i_do)

    def test_every_we_do_exercise_closes_with_reasoning_not_answer_repetition(self) -> None:
        we_do = _between(self.source, "  weDo: {", "  youDo: {")
        exercise_ids = re.findall(r"id: '(S02-T[1-4]-[AB]-E[1-3])'", we_do)
        self.assertEqual(len(exercise_ids), 24)
        self.assertEqual(len(set(exercise_ids)), 24)

        exercise_starts = [
            (match.group(1), match.start())
            for match in re.finditer(r"id: '(S02-T[1-4]-[AB]-E[1-3])'", we_do)
        ]
        reasoning_cues = re.compile(
            r"\b(Si|Explica|explica|pregunta|Predice|predice|Comprueba|"
            r"comprueba|señala|Nombra|nombra|imagina|responde|Recompón)\b"
        )
        for index, (exercise_id, start) in enumerate(exercise_starts):
            end = (
                exercise_starts[index + 1][1]
                if index + 1 < len(exercise_starts)
                else len(we_do)
            )
            block = we_do[start:end]
            match = re.search(r"retrospective:\n\s+'([^']+)'", block)
            self.assertIsNotNone(match, exercise_id)
            assert match is not None
            retrospective = match.group(1)
            self.assertGreaterEqual(len(retrospective.split()), 40, exercise_id)
            self.assertRegex(retrospective, reasoning_cues, exercise_id)

    def test_you_do_stages_planning_execution_evidence_and_transfer(self) -> None:
        you_do = _between(self.source, "  youDo: {", "  selfCheck: {")
        for anchor in (
            "dibuja tres columnas",
            "sigue por ellas un caso feliz",
            "promesas verificables",
            "muestra un input problemático",
            "reconstruye el recorrido sin mirar la solución",
            "porque el test lo pide",
        ):
            self.assertIn(anchor, you_do)

    def test_self_check_explanations_repair_plausible_misconceptions(self) -> None:
        self_check = _between(
            self.source,
            "  selfCheck: {",
            "  topicEvaluations: [",
        )
        explanations = re.findall(r"explanation:\n\s+'([^']+)'", self_check)
        self.assertEqual(len(explanations), 11)
        self.assertTrue(all(len(text.split()) >= 20 for text in explanations))
        for anchor in (
            "`null` y `void`",
            "las comillas son parte de la pista",
            "La velocidad o PEP 8 no decide el tipo",
            "crea otro nombre para la misma lista",
            "`=== null` no es sintaxis",
            "Python lee `-(3**2)`",
            "recibe una aproximación binaria",
            "La apariencia no cambia el tipo",
            "inventar `0` destruye información",
            "`strip` devuelve otro string",
            "reintroduciría la representación",
        ):
            self.assertIn(anchor, self_check)


if __name__ == "__main__":
    unittest.main()
