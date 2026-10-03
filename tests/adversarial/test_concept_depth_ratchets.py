"""What the surprising-use measure cannot see, counted so it cannot grow.

`gate.py`'s `surprising_uses_course_wide` reached 0 on 2026-10-02. On the owner's definition --
a term must be explained *on a surface that teaches* **and** exemplified before it is used --
that zero was the instrument's, not the course's. `audit/fixer/READINESS_AUDIT_2026-10-02.md`
records the measurement; these five ratchets hold the debt it found.

Why ratchets and not gates: 44 concepts cannot be re-taught in one round, and a gate that is red
on every round says nothing about the round. Each ratchet is **two-sided**, on the `D10_OWED`
precedent in `test_forward_dependencies.py`: it fails above its constant, listing the offenders,
and it fails below with "lower it to N" so a repair is recorded rather than absorbed.

The three failure shapes being counted:

1. **Self-certifying definitions.** A concept whose first appearance is a learning-outcome
   bullet, a `jobRelevance` blurb, a section `tagline` or a weDo nudge is credited with defining
   itself -- `first_use` IS `first_definition`, same location, same field -- so the use can never
   precede the definition. An outcome bullet says "you will learn to X"; it does not explain X.
   `precision` and `recall` are the costly case: S25 teaches `f1-score` at L3 with its own
   figure, and F1 is the harmonic mean of two concepts whose only explanation is a bullet
   promising to teach them.
2. **Explained, never exemplified.** The measure checks *explained* and never *exemplified*, so a
   concept with a definition and zero worked examples reads clean.
3. **Load-bearing without a subtopic (D3).** `if` and `for` are the most load-bearing concepts in
   the course -- 51 and 49 sections -- and both sit at L2, with no subtopic of their own. The
   ledger's own `concepts` column agrees: 0/52.
"""
from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONCEPT_MAP = ROOT / "course-state" / "concept_map.json"
GLOSSARY = ROOT / "src" / "lib" / "glossary" / "terms.ts"

# Surfaces that actually teach: prose the learner reads in order to learn, plus the I Do
# narration, which is instruction by construction -- the teacher demonstrating and explaining.
# Everything else is a promise (`outcome`), a marketing blurb (`jobRelevance`), a label
# (`tagline`), a quiz artefact (`selfcheck.*`) or a nudge inside practice (`wedo.*`, `youdo.*`).
# A definition may be REINFORCED on any surface; it may only be FIRST GIVEN on one of these.
TEACHING_SURFACES = frozenset({
    "theory.paragraph", "theory.callout", "theory.heading",
    "ido.intro", "ido.why", "ido.description", "ido.preamble", "ido.retrospective",
})

# Opening values measured at commit c3057a30 (2026-10-02), after `leakage` was added to
# data-leakage's aliases. Lower each as its debt is paid; raise only with a dated reason.
# 2026-10-03, S17: raised 44 -> 45 on purpose. Closing data-leakage's 8 surprising uses required a
# definition at or before its first use, and its first use is `outcome[7]` -- outcomes precede every
# theory block, so no later definition can reach them. The outcome now carries a real appositive
# gloss: «Controlar leakage temporal —el uso de datos posteriores a la fecha de corte— con
# cutoff/as-of». A learner meets the word WITH its meaning instead of without it, which is the trade
# this ratchet cannot see: it counts the surface KIND, not whether a gloss is present. The P0
# surface-hierarchy change will distinguish "an outcome that glosses" from "an outcome that only
# names", and should reclassify this one back down. Until then the honest count is 45.
SELF_CERTIFYING_DEFINITIONS_OWED = 45
NEVER_EXPLAINED_OWED = 7
UNEXEMPLIFIED_CONCEPTS_OWED = 35
FIGURE_SHORT_CONCEPTS_OWED = 103
D3_SUBTOPIC_OWED = 30


def concept_map() -> dict:
    return json.loads(CONCEPT_MAP.read_text(encoding="utf-8"))


def glossary_ids() -> set[str]:
    source = GLOSSARY.read_text(encoding="utf-8")
    return set(re.findall(r"\n    id: '([^']+)'", source))


def _report(label: str, offenders: list[str], owed: int, case: unittest.TestCase) -> None:
    """Two-sided: cannot rise, and cannot fall without the constant following it down."""
    shown = ", ".join(offenders[:14]) + (" ..." if len(offenders) > 14 else "")
    case.assertLessEqual(
        len(offenders), owed,
        f"{label} rose to {len(offenders)}, owed is {owed}:\n  {shown}",
    )
    case.assertEqual(
        len(offenders), owed,
        f"{label} is down to {len(offenders)} -- lower the constant to {len(offenders)} "
        f"so the repair is kept",
    )


class TheMapMustNotBeStale(unittest.TestCase):
    """A ratchet read from a stale artefact is the dead-measure failure mode again.

    `LEDGER_NOTES.md`: "an instrument that could not run must never be indistinguishable from an
    instrument that passed." CI does not regenerate `concept_map.json`, so the cheapest real
    staleness signal is a glossary term the map has never heard of.
    """

    def test_every_glossary_term_appears_in_the_map(self) -> None:
        missing = sorted(glossary_ids() - set(concept_map()))
        self.assertEqual(
            missing, [],
            "concept_map.json predates the glossary -- run "
            "`npx tsx scripts/course_event_extractor.mts && python3 scripts/concept_map.py`. "
            f"Terms the map has never seen: {missing}",
        )


class ConceptDepthRatchets(unittest.TestCase):
    def test_first_definitions_sit_on_a_surface_that_teaches(self) -> None:
        offenders = sorted(
            f"{cid} ({c['first_definition']['kind']} @ {c['first_definition']['section']})"
            for cid, c in concept_map().items()
            if (c.get("first_definition") or {}).get("kind")
            and c["first_definition"]["kind"] not in TEACHING_SURFACES
        )
        _report("SELF_CERTIFYING_DEFINITIONS", offenders, SELF_CERTIFYING_DEFINITIONS_OWED, self)

    def test_no_more_concepts_are_never_explained(self) -> None:
        offenders = sorted(
            cid for cid, c in concept_map().items() if not c.get("first_definition")
        )
        _report("NEVER_EXPLAINED", offenders, NEVER_EXPLAINED_OWED, self)

    def test_explained_concepts_are_also_exemplified(self) -> None:
        offenders = sorted(
            cid for cid, c in concept_map().items()
            if c.get("first_definition") and not (c.get("examples") or [])
        )
        _report("UNEXEMPLIFIED_CONCEPTS", offenders, UNEXEMPLIFIED_CONCEPTS_OWED, self)

    def test_concepts_carry_the_figures_they_are_owed(self) -> None:
        offenders = sorted(
            f"{cid} ({c['figure_count']}/{c['figure_target']})"
            for cid, c in concept_map().items() if (c.get("figure_gap") or 0) > 0
        )
        _report("FIGURE_SHORT_CONCEPTS", offenders, FIGURE_SHORT_CONCEPTS_OWED, self)

    def test_load_bearing_concepts_earn_their_own_subtopic(self) -> None:
        """D3: a load-bearing concept needs a subsection, not a gloss."""
        offenders = sorted(
            f"{cid} ({c['depth']}, {len(c['sections_used'])} secs)"
            for cid, c in concept_map().items()
            if c.get("load_bearing") and c.get("depth") != "L3"
        )
        _report("D3_SUBTOPIC", offenders, D3_SUBTOPIC_OWED, self)


class TheRatchetsMeasureSomethingReal(unittest.TestCase):
    """Falsification: each ratchet must be able to move, and must name its offenders.

    A ratchet whose population is empty, or whose rule accepts everything, is a green check over
    an unverified claim. These assertions fail if any of the five becomes vacuous.
    """

    def test_the_teaching_surface_split_is_not_degenerate(self) -> None:
        kinds = {
            (c.get("first_definition") or {}).get("kind")
            for c in concept_map().values()
        } - {None}
        self.assertTrue(
            kinds & TEACHING_SURFACES,
            "no concept is defined on a teaching surface -- the split is inverted",
        )
        self.assertTrue(
            kinds - TEACHING_SURFACES,
            "every surface counts as teaching -- delete this ratchet, it cannot fail",
        )

    def test_the_known_worked_cases_are_still_the_cases(self) -> None:
        """The two findings that motivated this file, pinned so a silent reversal is caught."""
        cmap = concept_map()
        for cid in ("precision", "recall"):
            self.assertEqual(
                cmap[cid]["first_definition"]["kind"], "outcome",
                f"{cid} no longer self-certifies from an outcome bullet -- if it was fixed, "
                f"lower SELF_CERTIFYING_DEFINITIONS_OWED and drop it from this pin",
            )
        for cid in ("if", "for"):
            self.assertNotEqual(
                cmap[cid]["depth"], "L3",
                f"{cid} now has its own subtopic -- lower D3_SUBTOPIC_OWED and drop this pin",
            )

    def test_data_leakage_stays_visible(self) -> None:
        """Regression pin for commit c3057a30.

        The glossary declared data-leakage as 'Data leakage' / 'fuga de datos'; the course writes
        the word bare, 215 times across 8 sections. The map recorded 5 uses in 4 sections with 0
        examples and 0 exercises while S32 -- titled "Feature engineering y pipelines sin
        leakage" -- taught all five leakage modes across the whole flywheel. If an alias edit ever
        narrows this again, fail here rather than in a content round six sections later.

        Assert BEHAVIOUR, never the alias string. An earlier version of this test re-parsed
        terms.ts with a naive quote regex to confirm the bare alias was present. An apostrophe
        inside a code comment broke that parse and failed the test for a reason that had nothing
        to do with the course. The assertions below already fail if the alias is removed, and they
        fail through the extractor's own output rather than through a copy of its logic.
        """
        c = concept_map()["data-leakage"]
        for section in ("S17", "S32"):
            self.assertIn(section, c["sections_used"])
        self.assertGreaterEqual(len(c["examples"]), 5)
        self.assertGreaterEqual(len(c["exercises"]), 9)


if __name__ == "__main__":
    unittest.main()
