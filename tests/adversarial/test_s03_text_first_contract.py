"""Text-first regressions for Section 3's learner-visible teaching surfaces."""

from __future__ import annotations

from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s03-data-structures.ts"
SEED = ROOT / "prisma/seed.ts"


def _between(text: str, start: str, end: str) -> str:
    start_index = text.index(start)
    end_index = text.index(end, start_index + len(start))
    return text[start_index:end_index]


def _words(text: str) -> list[str]:
    return re.findall(r"\b[\wÁÉÍÓÚÜÑáéíóúüñ]+\b", text)


class Section03TextFirstContractTests(unittest.TestCase):
    def test_theory_makes_prerequisites_mental_models_and_prediction_visible(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        theory = _between(source, "  theory: [", "  iDo: {")

        required_learner_visible_anchors = (
            "**Puente desde S02.**",
            # CAMP-20260821: the up-front "Diccionario de navegación" term dump was
            # dissolved into glosses at the point of need (protocol §3.6). The
            # anchor now pins the sentence that carries the section's core idea,
            # so the requirement is still enforced — just against teaching prose
            # instead of a dictionary block.
            "un invariante es una promesa que el programa no puede romper",
            "**Antes de continuar, predice:**",
            "plataforma de alquiler de bicicletas de Ámsterdam",
            "**Modelo mental.**",
            "portal de donaciones de Berlín",
            "**Dos capas, dos preguntas.**",
            "centro de soporte de Montreal",
            "**Lee la cadena como una fila de puertas.**",
            "sistema de admisiones de Nairobi",
            "**Modelo mental de embudo.**",
            "aseguradora digital de Singapur",
            "**No confundas desconocido con inválido.**",
            "mesa de ayuda global",
            "**Modelo mental: tabla primero, código después.**",
            "equipo de logística de Copenhague",
            "**Busca el contraejemplo.**",
            "servicio de salud de Toronto",
            "**Tres capas, una misma verdad.**",
        )
        for anchor in required_learner_visible_anchors:
            with self.subTest(anchor=anchor):
                self.assertIn(anchor, theory)

        self.assertEqual(
            set(re.findall(r"subtopicId: '(S03-T[1-4]-[AB])'", theory)),
            {
                f"S03-T{topic}-{strand}"
                for topic in range(1, 5)
                for strand in ("A", "B")
            },
        )

    def test_every_i_do_models_reasoning_and_closes_with_transfer(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        i_do = _between(source, "  iDo: {", "  weDo: {")
        string = r"'((?:\\.|[^'])*)'"

        preambles = re.findall(rf"preamble:\s*{string}", i_do, re.DOTALL)
        whys = re.findall(rf"why:\s*{string}", i_do, re.DOTALL)
        retrospectives = re.findall(
            rf"retrospective:\s*{string}",
            i_do,
            re.DOTALL,
        )

        self.assertEqual(len(preambles), 8)
        self.assertEqual(len(whys), 8)
        self.assertEqual(len(retrospectives), 8)
        self.assertTrue(all(len(_words(text)) >= 50 for text in preambles))
        self.assertTrue(all(len(_words(text)) >= 35 for text in whys))
        self.assertTrue(all(len(_words(text)) >= 40 for text in retrospectives))
        self.assertIn("prueba contrafactual", i_do)
        self.assertIn("Dibuja el embudo de casos", i_do)
        self.assertIn("Tapa una implementación", i_do)
        self.assertIn("qué cambio defectuoso la volvería roja", i_do)

    def test_every_we_do_exercise_has_a_substantive_reflective_close(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        we_do = _between(source, "  weDo: {", "  youDo: {")
        pattern = re.compile(
            r"id: '(S03-T[1-4]-[AB]-E[1-3])'.*?"
            r"retrospective:\s*'((?:\\.|[^'])*)'",
            re.DOTALL,
        )
        retrospectives = dict(pattern.findall(we_do))

        expected_ids = {
            f"S03-T{topic}-{strand}-E{exercise}"
            for topic in range(1, 5)
            for strand in ("A", "B")
            for exercise in range(1, 4)
        }
        self.assertEqual(set(retrospectives), expected_ids)
        for exercise_id, retrospective in retrospectives.items():
            with self.subTest(exercise_id=exercise_id):
                self.assertGreaterEqual(len(_words(retrospective)), 45)
                self.assertTrue(
                    any(
                        cue in retrospective
                        for cue in (
                            "explica",
                            "Explica",
                            "pregunta",
                            "¿",
                            "Describe",
                            "Defiende",
                            "Relaciona",
                            "Compara",
                            "Narra",
                        )
                    )
                )

    def test_you_do_and_self_check_expose_reviewable_reasoning(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        you_do = _between(source, "  youDo: {", "  selfCheck: {")
        self_check = _between(source, "  selfCheck: {", "  resources: {")

        for anchor in (
            "construye el motor en cuatro pasadas",
            "predice qué asserts fallarán",
            "cuenta la historia de una decisión",
            "Haz una revisión en tres voces",
            "Como **autor**",
            "Como **operaciones**",
            "Como **revisor**",
        ):
            self.assertIn(anchor, you_do)

        explanations = re.findall(
            r"explanation:\s*\n?\s*'((?:\\.|[^'])*)'",
            self_check,
            re.DOTALL,
        )
        self.assertEqual(len(explanations), 8)
        self.assertTrue(all(len(_words(text)) >= 22 for text in explanations))
        self.assertIn("describe el comportamiento de `bool`, no la política", self_check)
        self.assertIn("Python no busca la opción “más específica”", self_check)
        self.assertIn("obligan a adivinar la causa", self_check)

    def test_authenticated_bank_remains_specific_balanced_and_non_templated(self) -> None:
        seed = SEED.read_text(encoding="utf-8")
        bank = _between(seed, "  // S03 V3", "  // S04 V3")
        questions = re.findall(
            r"question:\s*(?:\n\s*)?'((?:\\.|[^'])*)'",
            bank,
            re.DOTALL,
        )
        explanations = re.findall(
            r"explanation:\s*(?:\n\s*)?'((?:\\.|[^'])*)'",
            bank,
            re.DOTALL,
        )

        self.assertEqual(len(questions), 24)
        self.assertEqual(len(explanations), 24)
        self.assertEqual(len(set(questions)), 24)
        self.assertEqual(len(set(explanations)), 24)
        self.assertTrue(all(len(_words(text)) >= 7 for text in explanations))
        self.assertNotIn(
            "Aplicar el concepto con evidencia verificable",
            bank,
        )


if __name__ == "__main__":
    unittest.main()
