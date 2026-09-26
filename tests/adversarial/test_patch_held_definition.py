"""A patch may not delete the course's earliest definition of a concept the brief listed as held.

The concepts brief tells codex which definitions its section holds for the whole course and how
many uses each would expose. On 2026-09-26 it said S02's theory[4] was the only definition of
`unpacking` anywhere, and codex deleted theory[4] anyway ("se enseñan más adelante"). The gate
caught it - never_explained 11 -> 12 - and failed the round, taking ten good patches with it.

`apply_patches.py` now refuses that one patch. These tests pin the refusal and, just as much,
what it must NOT refuse, because a guard that blocks rewording would cost more than it saves.
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools" / "fixer"))

import apply_patches  # noqa: E402

# The real sentence and names from the S02 incident, as events.json and terms.ts carry them.
UNPACKING = {
    "concept": "unpacking",
    "text": ("En `(True, 19, None)`, la primera posición indica que la conversión funcionó. "
             "La línea `ok, edad, error = resultado` reparte las tres posiciones, de izquierda a "
             "derecha, entre tres nombres. Esta acción se llama **desempaquetar una tupla**."),
    "names": ["Desempaquetado", "desempaquetado", "desempaquetar", "desempaqueta", "unpacking"],
}
# The same paragraph as it sits in the TypeScript source: inside a single-quoted string.
SOURCE_PARAGRAPH = "        '" + UNPACKING["text"] + "',\n"


class DeletesHeldDefinition(unittest.TestCase):
    def test_the_s02_deletion_is_refused(self):
        lost = apply_patches.deletes_held_definition(SOURCE_PARAGRAPH, "", [UNPACKING])
        self.assertEqual(lost, ["unpacking"])

    def test_a_reword_that_keeps_the_term_passes(self):
        reworded = "        'Repartir los valores entre varios nombres se llama **desempaquetar**.',\n"
        self.assertEqual(apply_patches.deletes_held_definition(SOURCE_PARAGRAPH, reworded, [UNPACKING]), [])

    def test_a_patch_that_never_touches_the_sentence_passes(self):
        """Deleting the first sentence alone leaves the defining one in the file."""
        first = "En `(True, 19, None)`, la primera posición indica que la conversión funcionó."
        self.assertEqual(apply_patches.deletes_held_definition(first, "", [UNPACKING]), [])

    def test_ts_escaping_does_not_hide_the_sentence(self):
        held = {**UNPACKING, "text": "Esto se llama **desempaquetar**, y no 'copiar'."}
        escaped = "'Esto se llama **desempaquetar**, y no \\'copiar\\'.'"
        self.assertEqual(apply_patches.deletes_held_definition(escaped, "", [held]), ["unpacking"])

    def test_a_concept_with_no_known_names_is_never_refused(self):
        """Without names the guard cannot tell a reword from a deletion, so it stays out."""
        held = {**UNPACKING, "names": []}
        self.assertEqual(apply_patches.deletes_held_definition(SOURCE_PARAGRAPH, "", [held]), [])

    def test_word_boundaries_hold(self):
        """`for` must not survive in the replacement just because it contains `formato`."""
        held = {"concept": "for", "text": "Un bucle `for` repite un bloque.", "names": ["for"]}
        anchor = "'Un bucle `for` repite un bloque.'"
        self.assertEqual(apply_patches.deletes_held_definition(anchor, "'Cambia el formato.'", [held]), ["for"])


class TheApplierRefusesEndToEnd(unittest.TestCase):
    """Through the real script, dry-run, on the live S02 file - so the wiring is what is tested.

    The anchor is S02's `shortTitle` line, which test_s02_independent_contract pins, and the
    "held definition" is a probe on that line: this tests the plumbing, not S02's content.
    """

    ANCHOR = "  shortTitle: 'Valores y tipos',"

    def _run(self, with_sidecar: bool) -> dict:
        with tempfile.TemporaryDirectory() as d:
            result = Path(d) / "S02k.result.json"
            result.write_text(json.dumps({
                "section_id": "basics",
                "patches": [{"anchor": self.ANCHOR, "replacement": "  shortTitle: 'Tipos',",
                             "finding_ids": ["PROBE"], "field_path": "shortTitle"}],
            }), encoding="utf-8")
            if with_sidecar:
                (Path(d) / "S02k.held_definitions.json").write_text(json.dumps([{
                    "concept": "probe", "text": "shortTitle: 'Valores y tipos',",
                    "names": ["Valores y tipos"],
                }]), encoding="utf-8")
            proc = subprocess.run([sys.executable, "tools/fixer/apply_patches.py", str(result)],
                                  cwd=ROOT, capture_output=True, text=True, timeout=120)
            self.assertEqual(proc.returncode, 0, proc.stderr[-600:])
            return json.loads(proc.stdout)

    def test_the_sidecar_makes_the_applier_refuse(self):
        report = self._run(with_sidecar=True)
        self.assertEqual((report["applied"], report["rejected"]), (0, 1))
        self.assertIn("`probe`", report["rejections"][0]["reason"])
        self.assertIn("PROBE", report["findings_still_open"])

    def test_without_the_sidecar_the_same_patch_lands(self):
        """The counterfactual: the refusal above comes from the guard, not from the anchor."""
        report = self._run(with_sidecar=False)
        self.assertEqual((report["applied"], report["rejected"]), (1, 0))

    def test_the_prompt_builder_writes_the_sidecar_the_applier_reads(self):
        builder = (ROOT / "tools/fixer/build_concept_prompt.py").read_text(encoding="utf-8")
        self.assertIn('f".fixer/{tag}k.held_definitions.json"', builder)
        self.assertIn("write_held_definitions(cmap, tag, payload)", builder)
        # And the runner's `rm -f .fixer/${TAG}k.*` is what keeps a stale one from guarding.
        runner = (ROOT / "tools/fixer/run_concepts.sh").read_text(encoding="utf-8")
        self.assertIn('rm -f .fixer/${TAG}k.*', runner)


if __name__ == "__main__":
    unittest.main()
