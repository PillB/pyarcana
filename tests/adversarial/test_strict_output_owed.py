"""python-strict's owed mismatches: each one named, held both ways in CI, and nothing else forgiven.

CI's Linux printed [0, 0, 1, 0] for S33's XOR demo where the lesson declares [0, 0, 0, 0]: the
linear model ends at p = 0.5 within floating-point noise, so thresholding it is decided by the
platform. The gate is right and the fix belongs to the content; until then the mismatch is owed.
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import python_content_strict_output_audit as strict  # noqa: E402

OWED = next(iter(strict.KNOWN_MISMATCHES))
OTHER = ("src/lib/course/sections/s01-setup.ts", "code-block-1")


def row(key: tuple[str, str], verdict: str) -> dict:
    return {"file": key[0], "artifact_id": key[1], "kind": "demo", "verdict": verdict}


class OwedMismatches(unittest.TestCase):
    def test_an_owed_mismatch_passes(self):
        self.assertEqual(strict.check_problems([row(OWED, "mismatch")], in_ci=True), [])

    def test_any_other_mismatch_fails(self):
        problems = strict.check_problems([row(OTHER, "mismatch")], in_ci=False)
        self.assertEqual(len(problems), 1, problems)
        self.assertIn("is not owed", problems[0])

    def test_an_owed_snippet_that_matches_in_ci_must_be_removed(self):
        problems = strict.check_problems([row(OWED, "match")], in_ci=True)
        self.assertEqual(len(problems), 1, problems)
        self.assertIn("remove it from KNOWN_MISMATCHES", problems[0])

    def test_outside_ci_an_owed_snippet_may_match(self):
        """macOS prints the declared [0, 0, 0, 0]; only CI's environment is held to the entry."""
        self.assertEqual(strict.check_problems([row(OWED, "match")], in_ci=False), [])

    def test_a_shard_that_did_not_run_the_snippet_is_not_asked_about_it(self):
        self.assertEqual(strict.check_problems([row(OTHER, "match")], in_ci=True), [])

    def test_every_owed_entry_names_a_snippet_that_exists_and_says_why(self):
        for (file, artifact), why in strict.KNOWN_MISMATCHES.items():
            ids = {a["artifact_id"] for a in strict.extract(ROOT / file)}
            self.assertIn(artifact, ids, f"{file} has no {artifact}: a typo here owes nothing")
            self.assertTrue(why.strip(), f"{file} {artifact} needs a reason")


if __name__ == "__main__":
    unittest.main()
