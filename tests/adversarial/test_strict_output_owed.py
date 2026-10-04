"""python-strict's owed snippets: pinned to their code, and nothing else forgiven.

S33's XOR demo thresholds a probability that is rounding noise at XOR's symmetric optimum, so
what it prints depends on the BLAS kernel and SIMD path a runner's CPU selects. CI's first run
printed [0, 0, 1, 0] and its second the declared [0, 0, 0, 0]. An exception keyed to the output
("owed until it matches in CI") therefore failed the second run. It is keyed to the code instead:
either verdict is accepted while the code is unchanged, and editing the snippet, which is the fix,
fails until the entry is removed.
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


class OwedSnippets(unittest.TestCase):
    def check(self, rows: list[dict], owed_code_changed: bool = False) -> list[str]:
        live = {a["artifact_id"]: a["code"] for a in strict.extract(ROOT / OWED[0])}
        code = live[OWED[1]] + ("\n# edited" if owed_code_changed else "")
        return strict.check_problems(rows, {OWED: code, OTHER: "print(1)"})

    def test_an_owed_mismatch_passes(self):
        self.assertEqual(self.check([row(OWED, "mismatch")]), [])

    def test_an_owed_match_passes_too_because_the_output_is_noise(self):
        """CI's second run printed the declared output; that must not fail the gate either."""
        self.assertEqual(self.check([row(OWED, "match")]), [])

    def test_editing_the_owed_snippet_fails_until_the_entry_is_removed(self):
        for verdict in ("match", "mismatch"):
            problems = self.check([row(OWED, verdict)], owed_code_changed=True)
            self.assertEqual(len(problems), 1, problems)
            self.assertIn("changed since it was owed", problems[0])

    def test_any_other_mismatch_fails(self):
        problems = self.check([row(OTHER, "mismatch")])
        self.assertEqual(len(problems), 1, problems)
        self.assertIn("is not owed", problems[0])

    def test_a_shard_that_did_not_run_the_snippet_is_not_asked_about_it(self):
        self.assertEqual(self.check([row(OTHER, "match")]), [])

    def test_every_entry_is_pinned_to_the_snippet_as_it_stands(self):
        for (file, artifact), (digest, why) in strict.KNOWN_MISMATCHES.items():
            live = {a["artifact_id"]: a["code"] for a in strict.extract(ROOT / file)}
            self.assertIn(artifact, live, f"{file} has no {artifact}: a typo here owes nothing")
            self.assertEqual(strict.code_digest(live[artifact]), digest,
                             f"{file} {artifact} changed: remove the entry if fixed, else re-measure")
            self.assertTrue(why.strip(), f"{file} {artifact} needs a reason")


if __name__ == "__main__":
    unittest.main()
