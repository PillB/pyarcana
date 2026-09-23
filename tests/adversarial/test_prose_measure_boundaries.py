"""A run-on the course did not write must not fail a round, and a real one must.

`run_on_sentences` (a sentence over 45 words) is one of only two gated writing measures, and
it was measuring two artifacts of how the text reached it rather than the text.

1. The event extractor stored `t.slice(0, 400) + '…'`. That cut 2,928 of 22,782 events
   mid-word, 660 of them theory paragraphs, in all 52 sections. A cut event ends in an
   ellipsis rather than a full stop, so it ran into the event after it.
2. A section is analysed as all its prose joined by newlines, split only after `.`, `!` or
   `?`. A learning outcome is a complete statement written without a full stop, so 358 events
   - 305 of them outcomes - ran into whatever followed. One section's seven outcomes measured
   as a single 122-word sentence.

Course-wide the two together reported 203 run-ons where there are 95, and 650 long sentences
where there are 479. S34's concepts round was restored over one of the fabricated ones: it
had taken the section from 10 surprising uses to 0, and its only fault was a paragraph longer
than 400 characters.

The measure was also blind in the other direction - S18 has a real run-on past character 400
that nobody could see - so these tests hold both.
"""
from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from prose_quality_audit import analyse, sentences, terminated  # noqa: E402

EVENTS = ROOT / ".fixer/events.json"
#: What the old truncation produced: 400 characters plus one ellipsis.
TRUNCATED_LEN = 401


class ProseMeasureBoundaries(unittest.TestCase):
    def test_a_list_of_outcomes_is_not_one_run_on_sentence(self):
        outcomes = [
            "Calcular matriz de confusion completa y precision y recall cuando la clase "
            "positiva es rara dentro del flujo de revision diaria del equipo",
            "Medir precision@k y recall@k de una cola ordenada y detectar overload frente "
            "a la capacidad diaria de los analistas que la revisan cada manana",
            "Reportar prevalencia junto a precision y recall y rechazar accuracy como "
            "unica metrica bajo desbalance en cualquier informe que salga del equipo",
        ]
        for o in outcomes:
            self.assertLess(len(o.split()), 46, "each outcome must be short enough to prove the point")
        joined = "\n".join(terminated(o) for o in outcomes)
        self.assertEqual(
            analyse(joined)["run_on_sentences"], 0,
            "three short outcomes measured as one long sentence",
        )
        self.assertEqual(len(sentences(joined)), 3)

    def test_the_old_join_is_what_produced_the_phantom(self):
        """Without terminated(), the same three outcomes are one run-on. The bug, pinned."""
        outcomes = [
            "Calcular matriz de confusion completa y precision y recall cuando la clase "
            "positiva es rara dentro del flujo de revision diaria del equipo",
            "Medir precision@k y recall@k de una cola ordenada y detectar overload frente "
            "a la capacidad diaria de los analistas que la revisan cada manana",
            "Reportar prevalencia junto a precision y recall y rechazar accuracy como "
            "unica metrica bajo desbalance en cualquier informe que salga del equipo",
        ]
        self.assertEqual(analyse("\n".join(outcomes))["run_on_sentences"], 1)

    def test_terminated_adds_only_what_is_missing(self):
        self.assertEqual(terminated("Una frase completa."), "Una frase completa.")
        self.assertEqual(terminated("Una pregunta?"), "Una pregunta?")
        self.assertEqual(terminated("Un resultado de aprendizaje"), "Un resultado de aprendizaje.")
        self.assertEqual(terminated("  con espacios  "), "con espacios.")

    def test_a_genuinely_long_sentence_is_still_a_run_on(self):
        """The measure has to keep saying yes, or removing the phantoms gained nothing."""
        long_one = " ".join(["palabra"] * 50) + "."
        self.assertEqual(analyse(long_one)["run_on_sentences"], 1)
        self.assertEqual(analyse(" ".join(["palabra"] * 40) + ".")["run_on_sentences"], 0)

    def test_the_extractor_stores_whole_events(self):
        """Structural, not content: nothing may carry the old cut's exact signature."""
        if not EVENTS.exists():
            self.skipTest("no events cache; gate.py regenerates it on every run")
        payload = json.loads(EVENTS.read_text(encoding="utf-8"))
        cut = [
            e["location"] for e in payload["events"]
            if len(e.get("text") or "") == TRUNCATED_LEN and (e.get("text") or "").endswith("…")
        ]
        self.assertEqual(cut[:5], [], f"{len(cut)} events still cut at {TRUNCATED_LEN} characters")


if __name__ == "__main__":
    unittest.main()
