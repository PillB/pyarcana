"""Contract: a bank written from one template is detected, and the real tree holds only the banks it is owed.

The S12 and S13 banks (apis-sql-geo, evidence-dashboard) were 48 items of one template: a stem
label such as [S12/A], the same options with the section's slug in the key, and one explanation per
concept. A learner can pass by recognising the template, without the concept (A5, owner decision
O20). Four signals detect it, and a bank with two or more is a stand-in. Each signal is recreated
alone, and together in the template, and the real tree is held to an exact owed set.
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402
import exam_selfcheck_pedagogy_audit as audit  # noqa: E402

#: The banks the detector flags on the tree, measured 2026-10-13. Both are to be rewritten
#: (codex brief in the plan, A5); a bank leaves this set when its rewrite passes the detector.
#: 2026-10-14: empty - plan PR 9 replaced both stand-in banks with real ones.
STAND_IN_BANKS_OWED: frozenset[str] = frozenset()


def template_bank(slug: str = "probe-template") -> dict:
    """The S12/S13 template, reproduced: 8 concepts, 3 variants each. Every stem carries a template
    label, every concept shares one set of options with its slug in the key, and every concept
    shares one explanation."""
    questions = []
    for c in range(8):
        concept = f"concepto-{c}-demo"
        for letter in "ABC":
            questions.append({
                "concept": concept,
                "question": f"[S12/{letter}] Sobre «{concept}», ¿cuál es la práctica correcta?",
                "options": [
                    "Ignorar el concepto y pasar a producción sin evidencia",
                    f"Aplicar {concept} con evidencia verificable y límites explícitos",
                    "Usar el concepto para inferir fraude automáticamente",
                    "Sustituir pruebas por capturas no reproducibles",
                ],
                "correctIndex": 1,
                "explanation": f"La clave de {concept} es aplicarlo con trazabilidad y sin sobreclaim.",
            })
    return {"slug": slug, "questions": questions}


#: Stem shapes that differ in wording and not in the «term»: masking the term leaves one sentence each.
TERM_STEM_SHAPES = (
    "Sobre «{term}», ¿cuál es la práctica correcta?",
    "En el caso de «{term}», ¿qué hace el proceso?",
    "Respecto de «{term}», ¿qué conviene hacer primero?",
)


def written_bank(slug: str = "probe-written", label: bool = False, shared_options: bool = False,
                 slug_keys: bool = False, shared_explanations: bool = False,
                 term_stem_shapes: int = 0) -> dict:
    """24 items written one at a time, with a stem, options and an explanation of their own. The
    flags turn one signal on at a time, so each test changes exactly the thing it recreates.
    `term_stem_shapes` replaces the stems by that many sentences with no template label, which
    differ only inside the «term»."""
    fixed = ["Uno correcto", "Otro distractor", "Un tercer distractor", "El cuarto distractor"]
    questions = []
    for i in range(24):
        concept = f"tema-{i // 3}-practica"
        stem = f"Caso {i}: un archivo de ventas llega con la columna {i} vacía. ¿Qué hace el proceso?"
        if term_stem_shapes:
            stem = TERM_STEM_SHAPES[i % term_stem_shapes].format(term=f"columna {i}")
        if label:
            stem = f"[S01/{'ABC'[i % 3]}] " + stem
        options = list(fixed) if shared_options else [
            f"Detener la carga y registrar la fila {i} en cuarentena",
            f"Rellenar la columna {i} con ceros sin avisar",
            f"Descartar el archivo completo y reintentar sin cambios ({i})",
            f"Cargar la fila {i} tal cual para revisarla después",
        ]
        key_index = i % 4
        if slug_keys:
            options[key_index] = f"Aplicar {concept} con datos del caso {i}"
        explanation = (f"Explicación compartida de {concept}." if shared_explanations
                       else f"En el caso {i}, la fila queda en cuarentena con su motivo para revisión humana.")
        questions.append({"concept": concept, "question": stem, "options": options,
                          "correctIndex": key_index, "explanation": explanation})
    return {"slug": slug, "questions": questions}


class TemplateIsDetected(unittest.TestCase):
    def test_the_template_shows_all_four_signals_and_is_flagged(self):
        """Recreates the S12/S13 template: templated stems, under half distinct options, the slug in
        every key, and one explanation per concept."""
        signals = audit.stand_in_signals(template_bank())
        self.assertEqual(signals, {
            "templated_stems": True,
            "few_distinct_options": True,
            "slug_in_key": True,
            "explanations_per_concept": True,
        })
        self.assertTrue(audit.is_stand_in(template_bank()))

    def test_a_realistic_written_bank_is_clean(self):
        signals = audit.stand_in_signals(written_bank())
        self.assertEqual(sum(signals.values()), 0, signals)
        self.assertFalse(audit.is_stand_in(written_bank()))


class EachSignalAlone(unittest.TestCase):
    """Each signal fires on its own and does not flag the bank: one signal is not a stand-in."""

    def _alone(self, bank: dict, name: str) -> None:
        signals = audit.stand_in_signals(bank)
        self.assertTrue(signals[name], f"{name} should fire: {signals}")
        self.assertEqual(sum(signals.values()), 1, f"only {name} should fire: {signals}")
        self.assertFalse(audit.is_stand_in(bank))

    def test_templated_stems_alone(self):
        self._alone(written_bank(label=True), "templated_stems")

    def test_templated_stems_by_masked_term_alone(self):
        """The second branch of the signal: no template label, but the stems are one or two
        sentences once the «term» is masked. Recreates a template with the label left out."""
        self._alone(written_bank(term_stem_shapes=1), "templated_stems")
        self._alone(written_bank(term_stem_shapes=2), "templated_stems")

    def test_three_stem_shapes_are_not_templated(self):
        """The limit is two distinct stems once masked: three shapes read as written."""
        signals = audit.stand_in_signals(written_bank(term_stem_shapes=3))
        self.assertFalse(signals["templated_stems"], signals)
        self.assertEqual(sum(signals.values()), 0, signals)

    def test_few_distinct_options_alone(self):
        self._alone(written_bank(shared_options=True), "few_distinct_options")

    def test_slug_in_key_alone(self):
        self._alone(written_bank(slug_keys=True), "slug_in_key")

    def test_explanations_per_concept_alone(self):
        self._alone(written_bank(shared_explanations=True), "explanations_per_concept")

    def test_two_signals_flag_the_bank(self):
        """The threshold is two: shared options and one explanation per concept together flag."""
        bank = written_bank(shared_options=True, shared_explanations=True)
        self.assertEqual(sum(audit.stand_in_signals(bank).values()), 2)
        self.assertTrue(audit.is_stand_in(bank))


class RealTreeStandIns(unittest.TestCase):
    def test_the_flagged_banks_are_exactly_the_owed_set(self):
        flagged = {bank["slug"] for bank in exam_bank.load_banks() if audit.is_stand_in(bank)}
        self.assertEqual(sorted(flagged - STAND_IN_BANKS_OWED), [], "new stand-in banks on the tree")
        self.assertEqual(sorted(STAND_IN_BANKS_OWED - flagged), [],
                         "no longer flagged: remove from STAND_IN_BANKS_OWED")


if __name__ == "__main__":
    unittest.main()
