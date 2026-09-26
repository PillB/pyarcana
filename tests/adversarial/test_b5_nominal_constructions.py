"""Writing rule B5, as decision D7 defines it — and the cases that falsify it.

D7 (2026-09-15) ruled that the gate must stop failing rounds on `nominalisations_per_100w`,
the raw density of -ción/-miento/-idad words, because that proxy punished the very fix the
Spanish pass exists to make: translating an English noun into a Spanish noun (*release* →
*lanzamiento*) is not what B5 forbids. It named three shapes to count instead — a
nominalisation as the actor, a light verb carrying the action, and nominalisations stacked
with *de* — and excluded names the course owns.

**The gate then read a key nothing ever wrote.** `gate.py` asked for
`prose.get("b5_per_100_sentences")`; `prose_quality_audit.py` emitted
`nominalisations_per_100w` and nothing else. `git log -S"b5_per_100_sentences"` returns exactly
one commit: the one that added the consuming line. So the value was `None` in all nineteen
snapshots, the verdict was "unmeasurable", it was never appended to the failures, and **D7 was
never once enforced** in the ten days it had been decided.

Implementing it turned up two defects in the decision's own specification, both found by
running D7's four worked examples against the code rather than by reading it:

1. D7 lists the suffixes "-ción, -miento, -idad, -anza, -encia". Its own cited S28 regression
   is *"regresiones del emparejamiento"*, and `regresiones` ends in **-siones**. The decision as
   written could not catch the case it was written for. `-sión/-siones` is the same nominalising
   family after a sibilant stem, so it is in.
2. The chain pattern required whitespace after *de*, and Spanish contracts *de + el* to *del* —
   which is how both D7's S28 example and the false positive D7 admits to are written.

So these are D7's examples, kept executable. A regex over Spanish is only trustworthy while its
counterexamples are checked with it, and this one was wrong in both directions on first writing.
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from prose_quality_audit import analyse, b5_constructions, glossary_names  # noqa: E402


class B5NominalConstructions(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.names = glossary_names()

    def hits(self, text: str) -> list[str]:
        return b5_constructions(text, self.names)

    # --- the three shapes D7 names -------------------------------------------------------
    def test_a_nominalisation_acting_where_a_verb_should(self):
        self.assertTrue(self.hits("La validación del registro produce el rechazo."))

    def test_a_light_verb_carrying_the_action(self):
        self.assertTrue(self.hits("Debes realizar la comprobación antes de enviar."))
        self.assertTrue(self.hits("El equipo lleva a cabo la revisión cada lunes."))

    def test_nominalisations_stacked_with_de(self):
        self.assertTrue(self.hits("Documenta la ejecución de la validación en el log."))

    def test_the_contracted_del_counts_too(self):
        """D7's own S28 regression is written with `del`, and `-siones`."""
        self.assertEqual(
            self.hits("Drift visible evita regresiones del emparejamiento."),
            ["regresiones del emparejamiento"],
        )

    # --- what B5 must NOT punish, which is why D7 exists ---------------------------------
    def test_the_compliant_rewrite_is_clean(self):
        """D7's own before/after: the fix must score zero, or the measure inverts its purpose."""
        self.assertEqual(self.hits("El validador rechaza el registro."), [])

    def test_translating_an_english_noun_is_not_a_b5_defect(self):
        """The exact thing the old proxy penalised: release -> lanzamiento, checks -> comprobaciones."""
        self.assertEqual(self.hits("Publicamos el lanzamiento con sus comprobaciones."), [])

    def test_a_name_the_course_owns_is_not_a_nominal_chain(self):
        self.assertEqual(self.hits("Aplica validación cruzada por entidad en cada fold."), [])

    def test_a_term_the_section_introduces_in_bold_is_exempt(self):
        self.assertEqual(self.hits("Las **cercas de Tukey** son dos límites calculados."), [])

    # --- the known cost, asserted rather than hoped away --------------------------------
    def test_the_false_positive_d7_admits_to_still_fires(self):
        """D7: "it has false positives ('la versión del lanzamiento' counts as a chain)".

        Pinned deliberately. It is tolerable only because the measure is gated as a REGRESSION,
        so a false positive present before and after costs nothing. If someone later makes this
        case pass, they have changed that bargain and should say so.
        """
        self.assertTrue(self.hits("Revisa la versión del lanzamiento antes del deploy."))

    # --- the wiring that was broken for ten days ----------------------------------------
    def test_the_audit_emits_the_keys_the_gate_reads(self):
        m = analyse("La validación del registro produce el rechazo. Otra frase corta.", self.names)
        self.assertIn("b5_per_100_sentences", m)
        self.assertIn("b5_nominal_constructions", m)
        self.assertGreater(m["b5_nominal_constructions"], 0)

    def test_gate_py_reads_exactly_those_keys(self):
        source = (ROOT / "tools/fixer/gate.py").read_text(encoding="utf-8")
        self.assertIn('prose.get("b5_per_100_sentences")', source)
        self.assertIn('prose.get("b5_nominal_constructions")', source)

    def test_the_suffix_density_is_still_reported(self):
        """D7 keeps it visible as info, so a sharp rise is still seen by a reader."""
        m = analyse("La configuración de la actualización produce complejidad.", self.names)
        self.assertIn("nominalisations_per_100w", m)


if __name__ == "__main__":
    unittest.main()
