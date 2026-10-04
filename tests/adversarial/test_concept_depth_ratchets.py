"""What the surprising-use measure cannot see, counted so it cannot grow.

`gate.py`'s `surprising_uses_course_wide` reached 0 on 2026-10-02. On the owner's definition --
a term must be explained *on a surface that teaches* **and** exemplified before it is used --
that zero was the instrument's, not the course's. `audit/fixer/READINESS_AUDIT_2026-10-02.md`
records the measurement; these four ratchets hold the debt that survived checking.

Why ratchets and not gates: 35 concepts cannot be re-exemplified in one round, and a gate that is
red on every round says nothing about the round. Each ratchet is **two-sided**, on the `D10_OWED`
precedent in `test_forward_dependencies.py`: it fails above its constant, listing the offenders,
and it fails below with "lower it to N" so a repair is recorded rather than absorbed.

A fifth ratchet, `SELF_CERTIFYING_DEFINITIONS_OWED`, was retracted on 2026-10-04 -- it counted a
disagreement with a documented decision rather than debt. The long note below the constants records
why, because the mistake is instructive and easy to repeat.

The three failure shapes being counted:

1. **Explained, never exemplified.** The measure checks *explained* and never *exemplified*, so a
   concept with a definition and zero worked examples reads clean. This is the one half of the
   owner's definition that genuinely goes unmeasured.
2. **Never explained at all.** Seven concepts have a glossary entry, a declared section, and no
   definition anywhere -- promises the course does not keep.
3. **Load-bearing without a subtopic (D3).** `if` and `for` are the most load-bearing concepts in
   the course -- 51 and 49 sections -- and both sit at L2, with no subtopic of their own. The
   ledger's own `concepts` column agrees: 0/52.

Plus the figure debt, which the map has always flagged with a warning and never gated.
"""
from __future__ import annotations

import functools
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests/adversarial"))

from concept_map import build_concepts  # noqa: E402
from course_events import fresh_events  # noqa: E402

# RETRACTED 2026-10-04 -- `SELF_CERTIFYING_DEFINITIONS_OWED` is gone, and this note stays so the
# mistake is not repeated.
#
# This file opened with a ratchet counting 44 concepts whose first definition sits on `outcome`,
# `jobRelevance`, `tagline`, `wedo.preamble` or `wedo.instruction`, on the argument that "an outcome
# bullet says you will learn to X; it does not explain X".
#
# That argument was wrong, and scripts/concept_map.py already had the better one. `TEACHING_KINDS`
# there filters definitions BEFORE the first one is chosen, so a surface hierarchy already existed;
# commit fb27fcd8 removed `wedo.hint` and `selfcheck.option` from it for exactly the reason this
# file was invoking. What it keeps, it keeps deliberately and with a worked counterexample:
#   - `outcome` / `tagline` / `jobRelevance`, because D1 names all three in one breath and a gloss
#     written on a preview surface still defines the term. Excluding `outcome` had scored `ruff`
#     never-explained across 39 uses while S01's outcome said "Ruff es un programa que senala
#     algunos errores".
#   - `wedo.preamble` / `wedo.instruction`, because We Do is a teaching phase in gradual release and
#     the preamble IS the guidance. A hint is different: it arrives after the learner is stuck.
#
# And the detector only credits any of those when definesTerm actually fires there -- that is, when
# the text really contains a gloss. Checked against the course: every sampled case does.
#     for                 "`for` --la instruccion que repite un bloque de codigo para cada
#                          elemento de un grupo--"
#     repositorio-repo    "un **repositorio**, una carpeta con historial que Git mantiene"
#     truthiness          "*truthiness* --como Python trata un valor como verdadero o falso--"
#     precision / recall  "precision --de los pares marcados como iguales, que parte si lo era--,
#                          recall --de los pares realmente iguales, que parte encontraste--"
#
# The last of those also refutes the audit's headline example, which said S25 teaches `f1-score` at
# L3 on top of two concepts "whose only explanation is a bullet promising to teach them". The bullet
# defines them, correctly.
#
# The lesson is the one this campaign keeps relearning from the other side: before replacing an
# instrument's rule, read the rule it already has and the comment explaining why. A ratchet that
# counts a disagreement with a documented decision is not debt -- it is a second opinion wearing a
# number. The real gap from that audit survives as UNEXEMPLIFIED_CONCEPTS_OWED: the measure checks
# explained and never exemplified, which IS the owner's definition going unmeasured.

# Opening values measured at commit c3057a30 (2026-10-02), after `leakage` was added to
# data-leakage's aliases. Lower each as its debt is paid; raise only with a dated reason.
NEVER_EXPLAINED_OWED = 7
UNEXEMPLIFIED_CONCEPTS_OWED = 35
# The DEFICIT in figures, summed, not the number of concepts short of one. 103 concepts
# are short; they owe 274 figures between them. Counting concepts hid a lost figure.
FIGURES_OWED = 274
D3_SUBTOPIC_OWED = 30


@functools.cache
def concepts() -> dict:
    """The map for the course being committed, built by the function that writes the report.

    2026-10-04, from Codex's review of PR #80 (P1): this used to read
    `course-state/concept_map.json`. Nothing in the adversarial-unit job regenerates that report,
    so every ratchet below scored whatever the last local fixer run had left. The staleness guard
    it shipped with compared GLOSSARY IDS, which cannot see the thing that matters -- remove a
    definition, an example, a heading or a figure without touching the id set and the report is
    wrong while the guard reports it fine. That is the dead-measure shape these ratchets exist to
    catch, inside the ratchets.

    `build_concepts` was extracted in #76 for exactly this, and `fresh_events` treats an
    extraction that cannot run as an error rather than a skip. Cached per process, so the
    extractor runs once for the whole file.
    """
    return build_concepts(fresh_events())


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


class ConceptDepthRatchets(unittest.TestCase):
    def test_no_more_concepts_are_never_explained(self) -> None:
        offenders = sorted(
            cid for cid, c in concepts().items() if not c.get("first_definition")
        )
        _report("NEVER_EXPLAINED", offenders, NEVER_EXPLAINED_OWED, self)

    def test_explained_concepts_are_also_exemplified(self) -> None:
        offenders = sorted(
            cid for cid, c in concepts().items()
            if c.get("first_definition") and not (c.get("examples") or [])
        )
        _report("UNEXEMPLIFIED_CONCEPTS", offenders, UNEXEMPLIFIED_CONCEPTS_OWED, self)

    def test_concepts_carry_the_figures_they_are_owed(self) -> None:
        """The deficit, not the number of offenders.

        2026-10-04, from Codex's review of PR #80 (P2): this counted concepts with any gap. A
        concept already at 1/5 that loses its last figure stays exactly one offender, so the
        advertised debt could rise while the count still passed. Summing `figure_gap` makes a lost
        figure fail. The message still names the worst offenders, because a number nobody can act
        on is not much better than no number.
        """
        c_all = concepts()
        short = {cid: c for cid, c in c_all.items() if (c.get("figure_gap") or 0) > 0}
        owed = sum(c["figure_gap"] for c in short.values())
        worst = sorted(short.items(), key=lambda kv: -kv[1]["figure_gap"])
        named = ", ".join(f"{cid} ({c['figure_count']}/{c['figure_target']})"
                          for cid, c in worst[:12])
        self.assertLessEqual(
            owed, FIGURES_OWED,
            f"figure debt rose to {owed} across {len(short)} concepts, owed is {FIGURES_OWED}."
            f" Worst: {named}",
        )
        self.assertEqual(
            owed, FIGURES_OWED,
            f"figure debt is down to {owed} -- lower FIGURES_OWED to {owed} so the repair is kept",
        )

    def test_load_bearing_concepts_earn_their_own_subtopic(self) -> None:
        """D3: a load-bearing concept needs a subsection, not a gloss."""
        offenders = sorted(
            f"{cid} ({c['depth']}, {len(c['sections_used'])} secs)"
            for cid, c in concepts().items()
            if c.get("load_bearing") and c.get("depth") != "L3"
        )
        _report("D3_SUBTOPIC", offenders, D3_SUBTOPIC_OWED, self)


class TheRatchetsMeasureSomethingReal(unittest.TestCase):
    """Falsification: each ratchet must be able to move, and must name its offenders.

    A ratchet whose population is empty, or whose rule accepts everything, is a green check over
    an unverified claim. These assertions fail if any of the five becomes vacuous.
    """

    def test_the_known_worked_cases_are_still_the_cases(self) -> None:
        """The two findings that motivated this file, pinned so a silent reversal is caught."""
        cmap = concepts()
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
        c = concepts()["data-leakage"]
        for section in ("S17", "S32"):
            self.assertIn(section, c["sections_used"])
        self.assertGreaterEqual(len(c["examples"]), 5)
        self.assertGreaterEqual(len(c["exercises"]), 9)


if __name__ == "__main__":
    unittest.main()
