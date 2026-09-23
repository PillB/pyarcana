"""What the concepts prompt calls load-bearing must not require having been taught.

`build_concept_prompt.py` tells codex "a concept marked `load_bearing: true` is presumed
TEACH ... do not downgrade a load-bearing concept to GLOSS to save length". It used to read
that flag straight out of the concept map, where it means something else: D5's
figure-targeting rule, depth L2 or L3 and used in three or more sections.

Depth is earned by being explained. So a concept the course never explains cannot reach L2,
and every never-explained concept - the whole population this prompt exists to fix - arrived
marked false. overfitting drove a subtopic of S33, carried its worked example and was named
in its outcomes, and the round about to be commissioned would have been told it could be
glossed away in a sentence.

**These assert on synthetic concepts on purpose.** The first version of this file pinned
overfitting-in-S33 as its fixture, and the very next round taught overfitting and took S33
from 27 surprising uses to 1 - so the test failed because the campaign succeeded, and a
failing gate restores the section. A test whose fixture is the defect cannot survive the
defect being fixed. The property belongs to the function; the course is what changes.

The live course appears once, as a scan that skips when its population is empty, so it stops
guarding on the day the campaign wins rather than blocking it.
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


def concept(*, depth, uses, examples=(), self_checks=(), defined=True):
    """A concept map entry shaped like the real thing, with only what this flag reads."""
    return {
        "depth": depth,
        "surprising_uses": list(uses),
        "examples": [{"section": s, "location": "x", "kind": "ido.code"} for s in examples],
        "self_checks": [{"section": s, "location": "x", "kind": "selfcheck.explanation"} for s in self_checks],
        "first_definition": {"location": "somewhere.p0"} if defined else None,
        "sections_used": sorted({u["section"] for u in uses}),
    }


def use(section, kind="theory.paragraph", location="x.p0"):
    return {"section": section, "kind": kind, "location": location}


class ConceptPromptWeight(unittest.TestCase):
    def test_never_explained_does_not_mean_glossable(self):
        """The circularity itself: no depth may be a precondition for TEACH.

        This is overfitting-in-S33's shape - L0, demonstrated here, promised in this
        section's outcomes, leaned on repeatedly - written out rather than looked up.
        """
        c = concept(
            depth="L0",
            defined=False,
            uses=[use("S33", "outcome", "advanced-models.outcome[5]")] + [use("S33") for _ in range(7)],
            examples=["S33"],
        )
        row = concept_row("overfitting", c, "S33")
        self.assertTrue(row["load_bearing"], "a word the section demonstrates and promises is not a gloss")
        self.assertTrue(row["never_explained_anywhere"])
        self.assertTrue(row["has_worked_example"])
        self.assertTrue(row["promised_in_this_sections_outcomes"])

    def test_each_signal_carries_on_its_own(self):
        """Any one of demonstrate / grade / promise / lean on is enough."""
        for label, kw in (
            ("worked example here", {"examples": ["S33"]}),
            ("graded here", {"self_checks": ["S33"]}),
            ("promised here", {"uses": [use("S33", "outcome", "advanced-models.outcome[5]")]}),
            ("leaned on here", {"uses": [use("S33") for _ in range(4)]}),
        ):
            with self.subTest(label):
                c = concept(depth="L0", defined=False, uses=kw.pop("uses", [use("S33")]), **kw)
                self.assertTrue(concept_row("x", c, "S33")["load_bearing"], label)

    def test_the_signal_can_still_say_no(self):
        """A flag that is always true is as useless as one that is always false.

        A concept can matter across the course and do no work in one section, and the honest
        answer for that section is GLOSS or DEFER, not a block it has not earned.
        """
        c = concept(depth="L2", uses=[use("S06")], examples=["S13"], self_checks=["S13"])
        row = concept_row("merge", c, "S06")
        self.assertFalse(row["load_bearing"], "S13's example must not make S06 owe a teaching block")
        self.assertFalse(row["has_worked_example"], "the counts must be scoped to this section")
        self.assertFalse(row["tested_in_selfcheck"])

    def test_a_concept_with_no_problem_here_is_not_in_this_sections_prompt(self):
        self.assertIsNone(concept_row("x", concept(depth="L2", uses=[use("S06")]), "S33"))

    def test_the_live_course_agrees(self):
        """The same property against real data, skipped once the population is gone.

        This is the one place the course itself is read. If the campaign ever reaches zero
        never-explained concepts there is nothing left to check, and saying so is better than
        failing the gate on success.
        """
        rows = [
            concept_row(cid, c, u["section"])
            for cid, c in CMAP.items()
            if c["depth"] == "L0"
            for u in c["surprising_uses"]
        ]
        if not rows:
            self.skipTest("no never-explained concept is used anywhere; nothing left to guard")
        self.assertTrue(
            any(r["load_bearing"] for r in rows),
            "every never-explained concept came back glossable; that is the inverted flag again",
        )


if __name__ == "__main__":
    unittest.main()
