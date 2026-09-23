"""Teaching a word the course never explained must not read as a regression.

The gate carried two counters over the concept map: `never_explained` (concepts at depth L0)
and `used_before_explained` (concepts explained somewhere but met earlier). Both were gated
with "may not rise", and they count two halves of one population - so explaining an L0
concept moves it out of the first counter and into the second, and the ratchet reads that
move as damage.

S17's concepts round taught `reshape`. Its only remaining uses were its own section's tagline
and jobRelevance, so: never 14 -> 13, used_before_explained 40 -> 41, FAIL, section restored -
on a round that removed 14 surprising uses across the course and took S17 from 31 to 17. Any
concept named in its own section's tagline was structurally impossible to teach.

`used_before_explained` is now reported rather than gated, and the harm it was reaching for is
gated directly: `surprising_uses_course_wide`, every occasion in the whole course where a
learner meets a word before anything explains it. That is stricter than the counter it
replaces - it counts every use, not merely whether a concept has one - and it still may not
rise.

These tests drive gate.py's own verdict function, so they hold the decision the gate makes,
not a restatement of the arithmetic.
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))

import gate  # noqa: E402


def verdicts(before: dict, after: dict) -> dict[str, str]:
    return {k: gate.regression_verdict(k, before[k], after[k]) for k in before}


#: S17's real round, as the gate measured it.
S17_BEFORE = {
    "never_explained": 14,
    "surprising_uses_course_wide": 420,
    "info:used_before_explained": 40,
    "surprising_uses_in_section": 31,
}
S17_AFTER = {
    "never_explained": 13,
    "surprising_uses_course_wide": 406,
    "info:used_before_explained": 41,
    "surprising_uses_in_section": 17,
}


class GateConceptMeasures(unittest.TestCase):
    def test_the_S17_round_is_not_a_regression(self):
        v = verdicts(S17_BEFORE, S17_AFTER)
        self.assertNotIn(
            "worse", v.values(),
            f"the round that removed 14 surprising uses still reads as a regression: {v}",
        )

    def test_used_before_explained_is_reported_not_gated(self):
        """It may rise, because the only way it rises on its own is a concept being taught."""
        self.assertEqual(gate.regression_verdict("info:used_before_explained", 40, 41), "info")

    def test_more_surprising_uses_course_wide_still_fails(self):
        """The replacement has to be able to say no, or nothing was gained."""
        worse = {**S17_AFTER, "surprising_uses_course_wide": 421}
        self.assertEqual(
            verdicts(S17_BEFORE, worse)["surprising_uses_course_wide"], "worse",
            "a round that leaves learners meeting more unexplained words must fail",
        )

    def test_the_new_measure_is_stricter_than_the_one_it_replaces(self):
        """A concept gaining uses moves the gated number; the concept count would not.

        Same concepts affected before and after, one of them used three more times. The old
        counter cannot see this at all.
        """
        before = {**S17_BEFORE, "surprising_uses_course_wide": 420, "info:used_before_explained": 40}
        after = {**S17_BEFORE, "surprising_uses_course_wide": 423, "info:used_before_explained": 40}
        self.assertEqual(verdicts(before, after)["surprising_uses_course_wide"], "worse")
        self.assertEqual(verdicts(before, after)["info:used_before_explained"], "info")

    def test_never_explained_is_still_gated(self):
        """Nothing here loosens the measure that matters most."""
        worse = {**S17_BEFORE, "never_explained": 15}
        self.assertEqual(
            verdicts(S17_BEFORE, worse)["never_explained"], "worse",
            "a round that leaves another word explained nowhere must still fail",
        )

    def test_the_gate_emits_the_keys_these_tests_assert_on(self):
        """Guards the rename: a typo here would silently gate nothing at all."""
        source = (ROOT / "tools/fixer/gate.py").read_text(encoding="utf-8")
        self.assertIn('"surprising_uses_course_wide": surprising_total', source)
        self.assertIn('f"{INFORMATIONAL}used_before_explained": surprising', source)


if __name__ == "__main__":
    unittest.main()
