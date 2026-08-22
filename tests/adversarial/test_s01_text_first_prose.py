"""Text-first regressions for Section 1 learner-visible pedagogy."""

from __future__ import annotations

from pathlib import Path
import re
import sys
import unittest

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from scripts.newbie_packet_builder import active_manifest, parse_section_learner


ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s01-setup.ts"


def _between(text: str, start: str, end: str) -> str:
    start_index = text.index(start)
    end_index = text.index(end, start_index + len(start))
    return text[start_index:end_index]


class Section01TextFirstProseTests(unittest.TestCase):
    def test_theory_opens_with_causal_models_and_international_context(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        theory = _between(source, "  theory: [", "\n  iDo: {")

        for phrase in (
            "una colega en Nairobi, otra en Berlín",
            "una partitura no produce música sin intérprete",
            "¿en qué habitación estoy?",
            "Una receta puede ser la misma",
            "una lista de ingredientes",
            "Un cirujano no ensaya",
            "En una imprenta",
            "qué no debo subir",
            # CAMP-20260820-02: terminal connectors taught before the demos need them.
            "pica la cebolla",
        ):
            self.assertIn(phrase, source)

        # CAMP-20260821: 14 -> 15. The intro's dev metadata (pacing, gate
        # criteria, the section_contract() listing) moved into a folded
        # `optional: true` reference block, which adds one heading. The count is
        # still pinned exactly; only the expected structure changed.
        self.assertEqual(theory.count("      heading:"), 15)
        self.assertNotIn("En el 90% de los casos", theory)
        self.assertNotIn("3-5 GB", theory)
        self.assertNotIn("bancos y fintech en Perú", theory)
        self.assertNotIn("causa #1", theory)

    def test_every_ido_invites_prediction_and_closes_the_learning_loop(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        ido = _between(source, "  iDo: {", "\n  weDo: {")
        preambles = re.findall(
            r"\n\s+preamble:\n\s+'([^']*(?:''[^']*)*)',",
            ido,
        )
        retrospectives = re.findall(
            r"\n\s+retrospective:\n\s+'([^']*(?:''[^']*)*)',",
            ido,
        )

        self.assertEqual(len(preambles), 8)
        self.assertEqual(len(retrospectives), 8)
        self.assertTrue(all("predi" in preamble.lower() for preamble in preambles))
        self.assertEqual(len(set(retrospectives)), 8)
        self.assertIn("En We Do", ido)

    def test_all_practices_have_distinct_metacognitive_retrospectives(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        we_do = _between(source, "  weDo: {", "\n  youDo: {")
        retrospectives = re.findall(
            r"\n\s+retrospective:\n\s+'([^']*(?:''[^']*)*)',",
            we_do,
        )

        self.assertEqual(len(retrospectives), 24)
        self.assertEqual(len(set(retrospectives)), 24)
        for phrase in (
            "Reconstruye la secuencia",
            "Prueba mentalmente tres entradas",
            "Explica el diagnóstico como un árbol",
            "Lee tu PR desde la silla del revisor",
            "No declares «está ignorado»",
            "evidencia binaria",
        ):
            self.assertIn(phrase, we_do)
        self.assertNotIn("El 80 % de tickets", we_do)

    def test_you_do_and_self_check_preserve_transfer_and_correctness(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        you_do = _between(source, "  youDo: {", "\n  selfCheck: {")
        self_check = _between(source, "  selfCheck: {", "\n  topicEvaluations: [")

        self.assertIn("organización internacional", you_do)
        self.assertIn("pista de aterrizaje", you_do)
        self.assertIn("no pudieras ayudar", you_do)
        self.assertNotIn("smoke en <10 min", you_do)
        self.assertEqual(self_check.count("        explanation:"), 8)
        self.assertIn("dos proyectos pueden usar versiones distintas", self_check)
        self.assertIn("Un push rechazado pide diagnosticar", self_check)

    def test_text_rewrite_does_not_break_the_learner_packet_contract(self) -> None:
        manifest = active_manifest(parse_section_learner(SECTION))
        expected = [
            f"S01-T{topic}-{part}-E{exercise}"
            for topic in range(1, 5)
            for part in ("A", "B")
            for exercise in range(1, 4)
        ]
        self.assertEqual(manifest["exercise_ids"], expected)
        self.assertEqual(len(set(manifest["exercise_ids"])), 24)


if __name__ == "__main__":
    unittest.main()
