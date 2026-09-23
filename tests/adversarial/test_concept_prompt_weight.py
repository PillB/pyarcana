"""What the concepts prompt calls load-bearing must not require having been taught.

`build_concept_prompt.py` tells codex "a concept marked `load_bearing: true` is presumed
TEACH ... do not downgrade a load-bearing concept to GLOSS to save length". It used to read
that flag straight out of the concept map, where it means something else: D5's
figure-targeting rule, depth L2 or L3 and used in three or more sections.

Depth is earned by being explained. So a concept the course never explains cannot reach L2,
and every never-explained concept - the whole population this prompt exists to fix - arrived
marked false. overfitting drives a subtopic of S33, carries its worked example and is named
in its outcomes, and the round that was about to be commissioned would have been told it
could be glossed away in a sentence.

These tests hold the property, not the arithmetic: the signal must be readable off what the
section does with the word, and it must be able to say no.
"""
from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))

from build_concept_prompt import concept_row  # noqa: E402

CMAP = json.loads((ROOT / "course-state/concept_map.json").read_text(encoding="utf-8"))


def row(cid: str, tag: str) -> dict | None:
    return concept_row(cid, CMAP[cid], tag)


class ConceptPromptWeight(unittest.TestCase):
    def test_a_concept_can_be_load_bearing_without_ever_having_been_explained(self):
        """The circularity itself. No depth may be a precondition for TEACH."""
        never_explained = [
            (cid, u["section"])
            for cid, c in CMAP.items()
            if c["depth"] == "L0"
            for u in c["surprising_uses"]
        ]
        self.assertTrue(never_explained, "the fixture is gone: no L0 concept has a surprising use")
        weighted = [(cid, tag) for cid, tag in never_explained if row(cid, tag)["load_bearing"]]
        self.assertTrue(
            weighted,
            "every never-explained concept came back glossable; that is the inverted flag again",
        )

    def test_overfitting_in_S33_is_load_bearing(self):
        """The case that exposed it: S33 demonstrates it, promises it and leans on it."""
        r = row("overfitting", "S33")
        self.assertIsNotNone(r, "overfitting must still be an S33 problem for this to guard")
        self.assertTrue(r["load_bearing"])
        self.assertTrue(r["has_worked_example"])
        self.assertTrue(r["promised_in_this_sections_outcomes"])
        self.assertGreater(r["times_used_here"], 4)

    def test_the_signal_can_still_say_no(self):
        """A flag that is always true is as useless as one that is always false.

        A concept can matter across the course and do no work in one section - `merge` is
        used in S06 without an example, a self-check, an outcome or repetition there - and
        the honest answer for that section is GLOSS or DEFER, not a block it has not earned.
        """
        rows = [
            row(cid, u["section"])
            for cid, c in CMAP.items()
            for u in c["surprising_uses"]
        ]
        rows = [r for r in rows if r]
        glossable = [r for r in rows if not r["load_bearing"]]
        self.assertTrue(glossable, "nothing came back glossable; the flag no longer discriminates")
        for r in glossable:
            self.assertFalse(r["has_worked_example"])
            self.assertFalse(r["tested_in_selfcheck"])
            self.assertFalse(r["promised_in_this_sections_outcomes"])

    def test_a_section_that_only_mentions_a_concept_in_passing_does_not_teach_it(self):
        synthetic = {
            "depth": "L2",
            "surprising_uses": [{"section": "S06", "location": "x.p0", "kind": "theory.paragraph"}],
            "examples": [{"section": "S13", "location": "y", "kind": "ido.code"}],
            "self_checks": [{"section": "S13", "location": "z", "kind": "selfcheck.explanation"}],
            "first_definition": {"location": "somewhere.p0"},
            "sections_used": ["S06", "S13"],
        }
        r = concept_row("merge", synthetic, "S06")
        self.assertFalse(r["load_bearing"], "S13's example must not make S06 owe a teaching block")
        self.assertFalse(r["has_worked_example"])


if __name__ == "__main__":
    unittest.main()
