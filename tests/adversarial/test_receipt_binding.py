"""Permanent regressions: sealed receipts must bind live exercise bodies.

Also reject synthetic duration staircases (e.g. 15× each of 9.0..15.0s).
"""
from __future__ import annotations

import hashlib
import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from newbie_agentic_validator import attempt_level_gates  # noqa: E402

J1 = ROOT / "course-state/newbie_walkthrough/agentic_J1"


def _ex_sha(exercises: list) -> str:
    return hashlib.sha256(
        json.dumps(exercises or [], ensure_ascii=False, sort_keys=True).encode()
    ).hexdigest()


class ReceiptBinding(unittest.TestCase):
    """Module-level test functions are pytest's convention; this suite runs unittest,
    which collected none of them - they never ran in CI - until they were methods here."""

    def test_j1_receipt_exercises_mismatch(self):
        """Historical J1 claimed sealed receipts but exercises_sha256 unbound."""
        self.assertTrue((J1 / "llm_call_receipts.jsonl").exists(),
                        "J1's receipts are gone; this regression has nothing left to check")
        tags = {i.get("tag") for i in attempt_level_gates("agentic_J1")}
        assert "RECEIPT_EXERCISES_MISMATCH" in tags or "SYNTHETIC_DURATION_STAIRCASE" in tags, tags

    def test_j1_synthetic_duration_staircase(self):
        self.assertTrue((J1 / "section_01" / "newbie_a_live.json").exists(),
                        "J1's lives are gone; this regression has nothing left to check")
        tags = {i.get("tag") for i in attempt_level_gates("agentic_J1")}
        # J1 post-hoc reclock left uniform integer staircase
        assert "SYNTHETIC_DURATION_STAIRCASE" in tags or "RECEIPT_EXERCISES_MISMATCH" in tags, tags

    def _sealed_attempt(self, receipt_exercises_sha) -> set:
        """One learner, one section, one receipt: a sealed attempt in a temporary directory,
        run through the real validator. The two tests below used to compare a hash with itself
        and never called the validator, so neither could fail."""
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        patcher = mock.patch("newbie_agentic_validator.attempt_dir", lambda a: Path(tmp.name) / a)
        patcher.start()
        self.addCleanup(patcher.stop)
        attempt = "agentic_K_synth_receipt"
        section = Path(tmp.name) / attempt / "section_01"
        section.mkdir(parents=True)
        exercises = [{"exercise_id": "S01-T1-A-E2", "code": "print(1)\n",
                      "justification_from_packet": "a" * 50}]
        (section / "newbie_a_live.json").write_text(
            json.dumps({"exercises": exercises, "selfcheck": []}), encoding="utf-8")
        receipt = {"section": 1, "agent": "newbie_a",
                   "exercises_sha256": receipt_exercises_sha(exercises),
                   "selfcheck_sha256": _ex_sha([])}
        (section.parent / "llm_call_receipts.jsonl").write_text(json.dumps(receipt) + "\n",
                                                                 encoding="utf-8")
        return {i.get("tag") for i in attempt_level_gates(attempt)}

    def test_a_receipt_bound_to_the_live_exercises_passes_the_binding(self):
        tags = self._sealed_attempt(_ex_sha)
        self.assertNotIn("RECEIPT_EXERCISES_MISMATCH", tags)
        self.assertNotIn("RECEIPT_MISSING", tags)

    def test_a_receipt_bound_to_the_whole_response_is_caught(self):
        """The J* defect: the receipt hashed the response wrapper, not the exercises list."""
        tags = self._sealed_attempt(lambda ex: _ex_sha({"exercises": ex, "selfcheck": []}))
        self.assertIn("RECEIPT_EXERCISES_MISMATCH", tags)


if __name__ == "__main__":
    unittest.main()
