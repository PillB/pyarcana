"""The campaign's zero, held where CI can see it.

The fixer campaign took surprising uses - a learner meeting a term before anything explains
it - to 0 across all 52 sections on 2026-10-02. Nothing in CI defended that number:
`course-state/concept_map.json` is regenerated only by the fixer gate, the may-not-rise check
lived only in `tools/fixer/gate.py`, and the one test that read the live course,
`test_concept_prompt_weight.test_the_live_course_agrees`, skips once the defects it reads are
gone. A commit that reintroduced a surprise passed CI.

So the map is rebuilt here from a fresh extraction of the course being committed, by the same
function that writes the report, and the total is a ratchet in the shape of D10_OWED in
`test_forward_dependencies.py`: a new surprise fails and names itself, and a fix fails until
the number here is lowered, so the gate never quietly stops protecting what was just fixed.
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests/adversarial"))

from concept_map import build_concepts  # noqa: E402
from course_events import fresh_events  # noqa: E402

# Uses, not concepts: every place a learner meets a term before anything explains it - the
# count gate.py reports as `surprising_uses_course_wide`. A change to what the detector counts
# moves this number on purpose; say so here, dated, in the same commit.
# 2026-10-02: 0. The campaign reached zero at f7eac921; S28 held the last one.
SURPRISING_USES_OWED = 0


def surprising(concepts: dict) -> list[str]:
    """Each surprising use as `SXX location term`, the form a reader can go and look at."""
    return sorted(
        f"{u['section']} {u['location']} {cid}"
        for cid, c in concepts.items()
        for u in c["surprising_uses"]
    )


class SurprisingUsesRatchet(unittest.TestCase):
    def test_the_course_holds_its_count(self) -> None:
        found = surprising(build_concepts(fresh_events()))
        self.assertLessEqual(
            len(found), SURPRISING_USES_OWED,
            f"{len(found)} surprising uses, more than the {SURPRISING_USES_OWED} still owed - "
            "a term is now used before anything explains it:\n" + "\n".join(found),
        )
        self.assertEqual(
            len(found), SURPRISING_USES_OWED,
            f"only {len(found)} surprising uses remain - lower SURPRISING_USES_OWED in this file "
            f"to {len(found)} so the ratchet keeps what was fixed",
        )


def event(section: str, location: str, *, defines: bool = False, visible: bool = True,
          kind: str = "theory.paragraph") -> dict:
    return {"section_id": section, "display_order": 0, "kind": kind, "location": location,
            "learner_visible": visible, "mentions": ["lista"],
            "defines": ["lista"] if defines else []}


def payload(*events: dict) -> dict:
    return {"active_section_ids": ["uno", "dos"],
            "terms": [{"id": "lista", "firstSectionId": "dos"}],
            "events": list(events)}


class TheMeasureStillMeasures(unittest.TestCase):
    """A ratchet at zero passes just as well if the function stopped finding anything."""

    def test_a_use_before_the_definition_is_a_surprise(self) -> None:
        concepts = build_concepts(payload(event("uno", "uno.t.p0"),
                                          event("dos", "dos.t.p0", defines=True)))
        self.assertEqual(surprising(concepts), ["S01 uno.t.p0 lista"])

    def test_a_definition_that_comes_first_is_not(self) -> None:
        concepts = build_concepts(payload(event("uno", "uno.t.p0", defines=True),
                                          event("dos", "dos.t.p0")))
        self.assertEqual(surprising(concepts), [])

    def test_a_use_the_learner_never_sees_is_not(self) -> None:
        concepts = build_concepts(payload(event("uno", "uno.solution", visible=False),
                                          event("dos", "dos.t.p0", defines=True)))
        self.assertEqual(surprising(concepts), [])


if __name__ == "__main__":
    unittest.main()
