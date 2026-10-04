"""An English phrase its own sentence translates is a gloss, not a leak.

`avoidable_english_per_1000` is gated as a regression, and a failed gate restores the section,
so a false positive here does not merely mislead - it destroys a round.

S09's concepts round taught what `NaN` stands for, the prescribed way:

    `NaN` (*not a number*, «no es un número»)

`not` is on the English function-word list, so the measure rose 1.2 -> 1.3 and the round was
restored. That round had taken the course from 400 surprising uses to 367 and S09 itself from
12 to 3 - thrown away for explaining an initialism. The audit's own docstring says it is
"built for precision, not recall" and that "a finding it raises must be real"; by the
campaign's rules both alternatives are worse than the gloss, since dropping the expansion
leaves the acronym arbitrary and dropping the translation leaves real unexplained English.

The exemption is deliberately the narrowest thing that works: the span must be italic AND be
followed immediately by a Spanish gloss in guillemets. Across all 52 sections it removes
exactly one count of 361. These tests hold that narrowness, because an exemption that quietly
widened would hide the leakage this measure exists to find.
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests/adversarial"))

from code_switching_audit import FUNCTION, clean  # noqa: E402
from course_events import fresh_events  # noqa: E402


def english_left(text: str) -> set[str]:
    """The English function words still visible to the measure after stripping."""
    import re
    return {w.lower() for w in re.findall(r"[A-Za-z]+", clean(text))} & FUNCTION


class CodeSwitchingGloss(unittest.TestCase):
    def test_an_acronym_expansion_with_a_spanish_gloss_is_not_a_leak(self):
        text = ("Puede venir como texto vacío, `N/A`, `None` o `NaN` "
                "(*not a number*, «no es un número»); ninguna equivale a cero.")
        self.assertEqual(english_left(text), set(), "the glossed expansion still counts as English")

    def test_english_without_a_translation_beside_it_still_counts(self):
        """The measure has to keep finding leaks, or exempting the gloss cost us the gate."""
        text = "El set de matching colapsa relabels when the payload is not present."
        self.assertIn("not", english_left(text))
        self.assertTrue({"when", "the"} & english_left(text))

    def test_ordinary_italic_emphasis_is_not_exempt(self):
        """Italics alone must not launder English; the guillemet gloss is what earns it."""
        text = "El resultado es *not available* en el informe final."
        self.assertIn("not", english_left(text))

    def test_the_gloss_must_follow_the_span(self):
        """A guillemet quote elsewhere in the sentence does not exempt an earlier span."""
        text = "El campo *should be empty* y más tarde el informe dice «listo»."
        self.assertIn("should", english_left(text))

    def test_the_exemption_does_not_swallow_the_rest_of_the_sentence(self):
        text = "`NaN` (*not a number*, «no es un número») and the rest is still English."
        left = english_left(text)
        self.assertNotIn("not", left, "the expansion itself is glossed")
        self.assertIn("and", left, "text after the gloss must still be measured")
        self.assertIn("the", left)

    def test_the_exemption_is_one_count_in_the_whole_course(self):
        """Narrowness, measured. If this grows, the exemption stopped being surgical.

        Counted on a fresh extraction, with the gloss rule and without it. This used to assert
        instead that the committed report still held over 300 English function words: a
        different property, read from a file CI never regenerates, and bound to fail the day
        the Spanish rounds succeed. That the measure counts English at all is held by the
        synthetic cases above. 2026-10-03: 356 without the rule, 355 with it.
        """
        import code_switching_audit as audit
        texts = [e["text"] for e in fresh_events()["events"]
                 if e["kind"] in audit.PROSE and e["learner_visible"]]

        def counted() -> int:
            return sum(1 for t in texts for w in audit.tokens(t) if w.lower() in audit.FUNCTION)

        with_rule = counted()
        with mock.patch.object(audit, "STRIP", [rx for rx in audit.STRIP if rx is not audit.GLOSS]):
            without_rule = counted()
        self.assertLessEqual(without_rule - with_rule, 1,
                             f"the gloss exemption now hides {without_rule - with_rule} English words")


if __name__ == "__main__":
    unittest.main()
