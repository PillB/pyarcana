#!/usr/bin/env python3
"""A prerequisite badge is not taught after the badge that needs it (C12c).

scripts/badge_readiness_audit.py compares the last section each badge requires. A prerequisite
whose last section is later than the badge's last section is an inversion: the learner would
earn the prerequisite after the material the badge says they hold. The rule was inline in the
audit; it is now prerequisite_inversions(), which a test can call without the course events.

Owed, not failing: five inversions exist today (VP-0 in audit/fixer/renumber_g0/SYNTHESIS.md found
four of the five real). Owner decision O25 (2026-10-13) holds them as an exact ratchet, together with
the meaning mismatches of test_badge_meaning_mismatch.py: the five are owed, none may be added, one
fixed lowers the pinned number in the same change, and the Phase 1 re-key pays them down. `--check`
is read-only: it writes nothing, never reads the event stream, and exits 0 only when the count equals
the owed number.

PINNED NOW: 5 inversions. (test_the_header_states_the_pin fails when these words and INVERSIONS_OWED
disagree, so a re-pin cannot leave this header stale.)

Boundary: equal last sections are not an inversion, one section later is.
"""
from __future__ import annotations

import contextlib
import io
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import badge_readiness_audit as audit  # noqa: E402

INVERSIONS_OWED = 5


def badge(badge_id: str, sections: list[str], prerequisites: list[str] | None = None) -> dict:
    return {"badge_id": badge_id, "required_sections": sections, "prerequisite_badges": prerequisites or []}


def stamp(path: Path) -> tuple[bool, int, int]:
    """Whether the file exists, and its size and mtime, so a rewrite of the same bytes still shows."""
    if not path.exists():
        return (False, 0, 0)
    info = path.stat()
    return (True, info.st_size, info.st_mtime_ns)


class PrerequisiteInversions(unittest.TestCase):
    def test_the_header_states_the_pin(self) -> None:
        """The header is what the owner reads to learn what is owed. It must say what the constant says."""
        self.assertIn(f"PINNED NOW: {INVERSIONS_OWED} inversions.", " ".join((__doc__ or "").split()))

    def test_the_live_catalog_has_exactly_the_owed_inversions(self) -> None:
        catalog = json.loads(audit.CATALOG.read_text(encoding="utf-8"))
        self.assertEqual(len(audit.prerequisite_inversions(catalog["badges"])), INVERSIONS_OWED)

    def test_check_passes_at_the_owed_count_and_fails_when_it_moves_either_way(self) -> None:
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(audit.main(["--check", "--owed", str(INVERSIONS_OWED)]), 0)
            self.assertEqual(audit.main(["--check", "--owed", str(INVERSIONS_OWED - 1)]), 1)
            self.assertEqual(audit.main(["--check", "--owed", str(INVERSIONS_OWED + 1)]), 1)

    def test_check_writes_nothing_and_never_reads_the_events(self) -> None:
        before = stamp(audit.OUT)
        original = audit.load_events

        def refuse() -> dict:
            raise AssertionError("--check must not read the course event stream")

        audit.load_events = refuse
        try:
            with contextlib.redirect_stdout(io.StringIO()):
                audit.main(["--check", "--owed", str(INVERSIONS_OWED)])
        finally:
            audit.load_events = original
        self.assertEqual(stamp(audit.OUT), before, "the shared readiness report must be untouched")

    def test_a_prerequisite_taught_in_a_later_section_is_one_inversion(self) -> None:
        badges = [badge("needs_early", ["S03"], ["pre"]), badge("pre", ["S05"])]
        found = audit.prerequisite_inversions(badges)
        self.assertEqual([f["badge"] for f in found], ["needs_early"])
        self.assertEqual(found[0]["code"], "PREREQUISITE_TAUGHT_LATER")
        self.assertIn("S05", found[0]["detail"])

    def test_one_section_later_is_an_inversion(self) -> None:
        badges = [badge("needs", ["S05"], ["pre"]), badge("pre", ["S06"])]
        self.assertEqual(len(audit.prerequisite_inversions(badges)), 1)

    def test_equal_last_sections_are_not_an_inversion(self) -> None:
        badges = [badge("needs", ["S05"], ["pre"]), badge("pre", ["S02", "S05"])]
        self.assertEqual(audit.prerequisite_inversions(badges), [])

    def test_a_prerequisite_missing_from_the_catalog_is_skipped_not_counted(self) -> None:
        badges = [badge("needs", ["S03"], ["ghost"])]
        self.assertEqual(audit.prerequisite_inversions(badges), [])


if __name__ == "__main__":
    unittest.main()
