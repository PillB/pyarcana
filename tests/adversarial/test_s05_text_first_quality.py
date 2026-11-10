"""Learner-visible text-first regressions for Section 5."""

from __future__ import annotations

from pathlib import Path
import re
import sys
import unittest


ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s05-functions-contracts.ts"
sys.path.insert(0, str(ROOT / "scripts"))

from newbie_packet_builder import parse_section_learner  # noqa: E402


def _between(text: str, start: str, end: str) -> str:
    start_index = text.index(start)
    end_index = text.index(end, start_index + len(start))
    return text[start_index:end_index]


class TestSection05TextFirstQuality(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SECTION.read_text(encoding="utf-8")

    def test_every_theory_subtopic_has_a_bridge_and_active_reasoning_close(self) -> None:
        theory = _between(self.source, "  theory: [", "  iDo: {")

        self.assertIn("En S04 aprendiste a recorrer datos", theory)
        # 2026-11-10, proposal 08 item 6: the eight "**Puente desde …:**" labels went
        # (writing rules 13, 15, 27). Each bridge sentence stays and is pinned, so a
        # subtopic cannot lose its link to the one before.
        self.assertEqual(theory.count("**Puente desde"), 0)
        for bridge in (
            "La primera promesa que harás es sencilla: si entra texto de nombre, debe salir texto normalizado",
            "Ya sabes entregar un resultado; ahora aprenderás a recibir parámetros sin crear estado compartido por accidente.",
            "Los parámetros y los defaults describen qué recibe la función",
            "El docstring narra el contrato; los hints hacen visible su forma",
            "Cada contrato que ya nombraste puede vivir en una pieza que se pruebe y se cambie sin tocar las demás.",
            "Separar responsabilidades permite dejar la transformación en el centro",
            "La pureza evita el estado oculto. El orden LEGB permite localizar cada nombre",
            "Ya sabes dónde vive cada nombre; ahora fijarás qué conducta debe mantenerse",
        ):
            self.assertIn(bridge, theory)
        for anchor in (
            "**Detente y predice:**",
            "**Dibuja la memoria:**",
            "**Audita la promesa:**",
            "**Separa forma y conducta:**",
            "**Prueba de sustitución:**",
            "**Dos preguntas, no una:**",
            "**Traza la búsqueda:**",
            "**Cierra el ciclo:**",
        ):
            self.assertIn(anchor, theory)

        subtopics = re.findall(r'subtopicId: "(S05-T[1-4]-[AB])"', theory)
        self.assertEqual(
            subtopics,
            [
                "S05-T1-A",
                "S05-T1-B",
                "S05-T2-A",
                "S05-T2-B",
                "S05-T3-A",
                "S05-T3-B",
                "S05-T4-A",
                "S05-T4-B",
            ],
        )

    def test_every_i_do_demo_requires_prediction_before_execution(self) -> None:
        i_do = _between(self.source, "  iDo: {", "  weDo: {")
        demo_ids = re.findall(r'demoId: "(S05-T[1-4]-[AB]-DEMO)"', i_do)
        self.assertEqual(len(demo_ids), 8)
        self.assertEqual(i_do.count("**Predicción:**"), 8)
        self.assertIn("explica qué línea hace verdadera la promesa", i_do)
        self.assertIn("el verde no dice «código perfecto»", i_do)

    def test_every_we_do_exercise_closes_with_causal_transfer(self) -> None:
        we_do = _between(self.source, "  weDo: {", "  youDo: {")
        exercise_ids = re.findall(r'id: "(S05-T[1-4]-[AB]-E[1-3])"', we_do)
        self.assertEqual(len(exercise_ids), 24)
        self.assertEqual(len(set(exercise_ids)), 24)

        starts = [
            (match.group(1), match.start())
            for match in re.finditer(r'id: "(S05-T[1-4]-[AB]-E[1-3])"', we_do)
        ]
        causal_cues = re.compile(
            r"\b(Si|Explica|explica|pregunta|Predice|predice|Comprueba|"
            r"comprueba|señala|Señala|nombra|Nombra|imagina|Imagina|"
            r"traza|Traza|relaciona|Recompón|Provoca|provoca)\b"
        )
        for index, (exercise_id, start) in enumerate(starts):
            end = starts[index + 1][1] if index + 1 < len(starts) else len(we_do)
            block = we_do[start:end]
            match = re.search(r'retrospective:\n\s+"([^"]+)"', block)
            self.assertIsNotNone(match, exercise_id)
            assert match is not None
            retrospective = match.group(1)
            self.assertGreaterEqual(len(retrospective.split()), 40, exercise_id)
            self.assertRegex(retrospective, causal_cues, exercise_id)

    def test_you_do_stages_contract_planning_evidence_and_transfer(self) -> None:
        you_do = _between(self.source, "  youDo: {", "  selfCheck: {")
        for anchor in (
            "dibuja una tabla",
            "`efecto permitido`",
            "un registro feliz y un email sin `@`",
            "muestra una decisión y su evidencia",
            "reconstruye el flujo sin mirar el starter",
            "porque el test lo pide",
        ):
            self.assertIn(anchor, you_do)

    def test_self_check_explanations_repair_each_distractor_family(self) -> None:
        self_check = _between(self.source, "  selfCheck: {", "  resources: {")
        explanations = re.findall(r'explanation:\n\s+"([^"]+)"', self_check)
        self.assertEqual(len(explanations), 8)
        self.assertTrue(all(len(text.split()) >= 25 for text in explanations))
        for anchor in (
            "`0` y `False`",
            "Python sí permite defaults",
            "tampoco necesita vivir en una clase",
            "Las otras opciones mezclan",
            "no basta para demostrar",
            "Ninguno ejecuta la política",
            "`raw`, que está antes",
            "Tampoco hace falta una clase",
        ):
            self.assertIn(anchor, self_check)

    def test_expanded_prose_preserves_all_packet_visible_exercise_ids(self) -> None:
        parsed = parse_section_learner(SECTION)
        exercise_ids = [
            exercise["id"] for exercise in parsed["weDo"]["exercises"]
        ]
        expected = [
            f"S05-T{topic}-{half}-E{exercise}"
            for topic in range(1, 5)
            for half in "AB"
            for exercise in range(1, 4)
        ]
        self.assertEqual(exercise_ids, expected)


if __name__ == "__main__":
    unittest.main()
