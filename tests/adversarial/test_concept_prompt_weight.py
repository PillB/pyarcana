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
import re
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



class PlaceNameBudget(unittest.TestCase):
    """The prompt's place-name budget must be the gate's, not a second opinion.

    The budget exists because three concepts rounds were restored over a cap nothing told
    codex about. It is stated as a number because "do not overuse place names" is
    unactionable at 53 of 55. That number is only worth stating while it is the same number
    the gate enforces, so the two copies are compared here rather than trusted.
    """

    def test_the_prompt_and_the_gate_count_the_same_names(self):
        sys.path.insert(0, str(ROOT / "tests/adversarial"))
        import build_concept_prompt as prompt
        import test_over_localized_language as gate

        self.assertEqual(
            prompt.PE_CITIES.pattern,
            gate.PE_CITIES.pattern,
            "the prompt promises headroom against a different list of names than the gate counts",
        )

    def test_the_prompt_quotes_the_cap_the_gate_enforces(self):
        import build_concept_prompt as prompt

        source = (ROOT / "tests/adversarial/test_over_localized_language.py").read_text(encoding="utf-8")
        caps = {int(n) for n in re.findall(r"assertLessEqual\(\s*count,\s*(\d+)", source)}
        self.assertEqual(
            caps,
            {prompt.PE_CITY_CAP},
            f"gate caps {caps}, prompt tells codex {prompt.PE_CITY_CAP}",
        )

    def test_a_saturated_file_is_told_to_add_none(self):
        import build_concept_prompt as prompt

        tmp = ROOT / "course-state/.place_name_budget_probe.ts"
        try:
            tmp.write_text("// " + " ".join(["Lima"] * (prompt.PE_CITY_CAP + 1)), encoding="utf-8")
            self.assertIn("must add NONE", prompt.place_name_budget(tmp))
            tmp.write_text("// sin nombres de ciudad", encoding="utf-8")
            self.assertIn("room for", prompt.place_name_budget(tmp))
        finally:
            tmp.unlink(missing_ok=True)

    def test_fixture_ids_do_not_spend_the_budget(self):
        """The gate ignores `CASO-` lines, so the budget must too, or it under-reports room."""
        import build_concept_prompt as prompt

        tmp = ROOT / "course-state/.place_name_budget_probe.ts"
        try:
            tmp.write_text("\n".join(["// CASO-LIM-017 Lima Lima Lima", "// prosa sin nombres"]), encoding="utf-8")
            self.assertIn(f"holds 0 of a hard cap of {prompt.PE_CITY_CAP}", prompt.place_name_budget(tmp))
        finally:
            tmp.unlink(missing_ok=True)


if __name__ == "__main__":
    unittest.main()


class DefinitionsASectionHolds(unittest.TestCase):
    """A round must be told what it is standing on before it removes it.

    The concepts brief counts how often a concept is used too early GIVEN the definitions that
    exist now. Remove one - often the right call, since a section should not pre-announce what
    another teaches - and every use it was masking becomes a surprise at once, including uses
    the brief never listed. Three rounds hit this: `for` in S04 (268 -> 1126 had it landed),
    `function` in S02 (229 -> 301) and `if` in S02 (208 -> 223). Each patch was correct and
    each had to be held back after the fact.

    So the prompt now states the cost up front, the same way the place-name cap is stated.
    """

    @staticmethod
    def _block(tag: str) -> str:
        import build_concept_prompt as prompt
        ev = json.loads((ROOT / ".fixer/events.json").read_text(encoding="utf-8"))
        return prompt.definitions_this_section_holds(CMAP, tag, ev["active_section_ids"])

    def test_it_names_a_definition_the_section_holds_and_what_it_costs(self):
        if not (ROOT / ".fixer/events.json").exists():
            self.skipTest("no events cache; gate.py regenerates it on every run")
        block = self._block("S02")
        self.assertIn("`function`", block, "S02 holds the course's earliest gloss of function")
        self.assertRegex(block, r"exposing at least \d+ further uses")

    def test_a_section_holding_none_says_so_rather_than_printing_nothing(self):
        if not (ROOT / ".fixer/events.json").exists():
            self.skipTest("no events cache")
        empty = {"x": {"first_definition": {"section": "S99", "location": "a", "kind": "k"},
                       "definitions": [], "uses": [], "surprising_uses": []}}
        import build_concept_prompt as prompt
        ev = json.loads((ROOT / ".fixer/events.json").read_text(encoding="utf-8"))
        block = prompt.definitions_this_section_holds(empty, "S02", ev["active_section_ids"])
        self.assertIn("no concept's earliest definition", block)

    def test_a_definition_with_no_successor_is_reported_as_course_wide(self):
        """The `for` case: one definition in 52 sections, so removing it hides the term entirely."""
        cmap = {"loopy": {
            "first_definition": {"section": "S04", "location": "x.p0", "kind": "theory.paragraph"},
            "definitions": [{"section": "S04", "location": "x.p0"}],
            "uses": [{"section": s, "visible": True} for s in ("S02", "S03", "S04")],
            "surprising_uses": [],
        }}
        import build_concept_prompt as prompt
        block = prompt.definitions_this_section_holds(cmap, "S04", [f"s{i:02d}" for i in range(1, 53)])
        self.assertIn("disappears from the whole course", block)
        self.assertIn("at least 3", block)

    def test_a_sibling_definition_in_the_same_block_is_not_a_successor(self):
        """A patch replaces a block, not a sentence, so both definitions in it go together.

        `return` was defined by BOTH `decisions-rules.theory[3].p3` and
        `decisions-rules.theory[3].figure`. Treating the figure as the next definition made the
        exposure look like nothing, so this block stayed silent - and the round that replaced
        all of `theory[3]` exposed 58 uses and was thrown away.
        """
        cmap = {"return": {
            "first_definition": {"section": "S03", "location": "d.theory[3].p3", "kind": "theory.paragraph"},
            "definitions": [
                {"section": "S03", "location": "d.theory[3].p3"},
                {"section": "S03", "location": "d.theory[3].figure"},
                {"section": "S05", "location": "f.S05-T1-A.p1"},
            ],
            "uses": [{"section": s, "visible": True} for s in ("S02", "S03", "S04", "S05")],
            "surprising_uses": [],
        }}
        import build_concept_prompt as prompt
        block = prompt.definitions_this_section_holds(cmap, "S03", [f"s{i:02d}" for i in range(1, 53)])
        self.assertIn("`return`", block, "the sibling figure hid the real successor in S05")
        self.assertIn("moves to S05", block)
