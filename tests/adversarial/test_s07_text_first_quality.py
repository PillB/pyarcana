"""Text-first S07 contract: active learning, repair, transfer, and fleet invariants."""

from __future__ import annotations

import json
import re
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests" / "adversarial"))

from newbie_packet_builder import active_manifest, parse_section_learner  # noqa: E402
from test_over_localized_language import BANNED_SLANG, PE_CITIES  # noqa: E402


SECTION = ROOT / "src/lib/course/sections/s07-data-acquisition.ts"


def quoted_values(block: str, field: str) -> list[str]:
    pattern = rf'{field}:\s*\n\s*"((?:[^"\\]|\\.)*)"'
    return [json.loads(f'"{value}"') for value in re.findall(pattern, block)]


class TestS07TextFirstQuality(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = SECTION.read_text(encoding="utf-8")
        cls.theory = cls.source[cls.source.index("  theory:"):cls.source.index("  iDo:")]
        cls.i_do = cls.source[cls.source.index("  iDo:"):cls.source.index("  weDo:")]
        cls.we_do = cls.source[cls.source.index("  weDo:"):cls.source.index("  youDo:")]
        cls.you_do = cls.source[cls.source.index("  youDo:"):cls.source.index("  selfCheck:")]
        cls.self_check = cls.source[
            cls.source.index("  selfCheck:"):cls.source.index("  resources:")
        ]

    def test_theory_has_decision_map_and_eight_active_boundary_checks(self) -> None:
        self.assertIn("conservar `raw` → normalizar → comparar → reunir evidencia", self.theory)
        self.assertIn("S06 te dejó colecciones", self.theory)
        anchors = (
            "**Predice los code points:**",
            "**Prueba la heurística:**",
            "**Elige la herramienta:**",
            "**Separa normalizar de verificar:**",
            "**Predice el alcance del patrón:**",
            "**Audita el riesgo:**",
            "**Dos pruebas antes del score:**",
            "**Decide con evidencia:**",
        )
        for anchor in anchors:
            with self.subTest(anchor=anchor):
                self.assertEqual(self.theory.count(anchor), 1)
        self.assertIn("**Chequeo de transferencia:**", self.theory)
        self.assertIn("NFC no puede repararlo", self.theory)

    def test_unicode_prediction_uses_code_point_counts_and_prints_sequences(self) -> None:
        self.assertIn("una casilla para `é` compuesta y dos", self.theory)
        self.assertNotIn("dos casillas para `é` compuesta y tres", self.theory)
        self.assertIn('print("NFC é:", code_points(a[-1]))', self.theory)
        self.assertIn('print("NFD é:", code_points(unicodedata.normalize("NFD", a[-1])))', self.theory)
        self.assertIn("NFC é: ['U+00E9']", self.theory)
        self.assertIn("NFD é: ['U+0065', 'U+0301']", self.theory)

    def test_every_i_do_requires_a_concrete_pre_execution_prediction(self) -> None:
        self.assertEqual(self.i_do.count('demoId: "S07-'), 8)
        self.assertEqual(self.i_do.count("**Predicción:**"), 8)
        for preamble in quoted_values(self.i_do, "preamble"):
            with self.subTest(preamble=preamble[:60]):
                self.assertIn("ejecut", preamble.casefold())
                self.assertGreaterEqual(len(preamble.split()), 45)

    def test_all_we_do_retrospectives_explain_cause_and_transfer(self) -> None:
        retrospectives = quoted_values(self.we_do, "retrospective")
        self.assertEqual(len(retrospectives), 24)
        causal_or_repair = re.compile(
            r"\b(porque|causa|confund|error|si |evidencia|explica|defecto|riesgo)\b",
            re.IGNORECASE,
        )
        transfer = re.compile(
            r"\b(transfiere|aplica|reutiliza|prueba|lleva|en otra|a otro)\b",
            re.IGNORECASE,
        )
        for index, retrospective in enumerate(retrospectives, start=1):
            with self.subTest(exercise=index):
                self.assertGreaterEqual(len(retrospective.split()), 40)
                self.assertRegex(retrospective, causal_or_repair)
                self.assertRegex(retrospective, transfer)

    def test_you_do_is_staged_and_requires_auditable_transfer(self) -> None:
        required = (
            "campo | raw | transformación prevista | normalized esperado | decisión/review",
            "Traza a mano un caso feliz y uno ambiguo",
            "implementa por etapas",
            "un caso que termine en `review`",
            "reconstruye la ejecución",
            "un caso internacional",
        )
        for phrase in required:
            with self.subTest(phrase=phrase):
                self.assertIn(phrase, self.you_do)

    def test_you_do_places_review_state_in_the_return_contract(self) -> None:
        self.assertIn(
            "normalize_record → {raw, normalized, transforms, status, review_reasons}",
            self.you_do,
        )
        self.assertIn(
            '"""→ {raw, normalized, transforms, status, review_reasons}."""',
            self.you_do,
        )
        self.assertIn(
            'status es ok o review; review_reasons conserva razones por campo',
            self.you_do,
        )

    def test_public_self_checks_repair_distractors_not_only_name_answer(self) -> None:
        explanations = quoted_values(self.self_check, "explanation")
        self.assertEqual(len(explanations), 10)
        repair_terms = re.compile(
            r"\b(no |tampoco|falla|rechaza|confund|excede|destruye|inventa|distint|frente)\b",
            re.IGNORECASE,
        )
        for index, explanation in enumerate(explanations, start=1):
            with self.subTest(question=index):
                self.assertGreaterEqual(len(explanation.split()), 28)
                self.assertRegex(explanation, repair_terms)

    def test_exact_active_packet_contract_still_resolves_s07_ids(self) -> None:
        expected = [
            f"S07-T{topic}-{lane}-E{exercise}"
            for topic in range(1, 5)
            for lane in ("A", "B")
            for exercise in range(1, 4)
        ]
        manifest = active_manifest(parse_section_learner(SECTION))
        self.assertEqual(manifest["exercise_ids"], expected)
        self.assertEqual(len(set(manifest["exercise_ids"])), 24)

    def test_exact_active_locality_contract_remains_below_fleet_cap(self) -> None:
        for slang in BANNED_SLANG:
            with self.subTest(slang=slang):
                self.assertEqual(re.findall(slang, self.source, flags=re.IGNORECASE), [])
        prose = "\n".join(line for line in self.source.splitlines() if "CASO-" not in line)
        self.assertLessEqual(len(PE_CITIES.findall(prose)), 55)


if __name__ == "__main__":
    unittest.main()
