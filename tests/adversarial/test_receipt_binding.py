"""Permanent regressions: sealed receipts must bind live exercise bodies.

Also reject synthetic duration staircases (e.g. 15× each of 9.0..15.0s).
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from newbie_agentic_validator import attempt_level_gates  # noqa: E402


def _ex_sha(exercises: list) -> str:
    return hashlib.sha256(
        json.dumps(exercises or [], ensure_ascii=False, sort_keys=True).encode()
    ).hexdigest()


def test_j1_receipt_exercises_mismatch_if_present():
    """Historical J1 claimed sealed receipts but exercises_sha256 unbound."""
    root = ROOT / "course-state/newbie_walkthrough/agentic_J1"
    if not root.exists() or not (root / "llm_call_receipts.jsonl").exists():
        return
    tags = {i.get("tag") for i in attempt_level_gates("agentic_J1")}
    assert "RECEIPT_EXERCISES_MISMATCH" in tags or "SYNTHETIC_DURATION_STAIRCASE" in tags, tags


def test_j1_synthetic_duration_staircase_if_present():
    root = ROOT / "course-state/newbie_walkthrough/agentic_J1"
    if not (root / "section_01" / "newbie_a_live.json").exists():
        return
    tags = {i.get("tag") for i in attempt_level_gates("agentic_J1")}
    # J1 post-hoc reclock left uniform integer staircase
    assert "SYNTHETIC_DURATION_STAIRCASE" in tags or "RECEIPT_EXERCISES_MISMATCH" in tags, tags


def test_write_live_binds_exercises_sha_to_live_list():
    """Unit: exercises_sha256 of write_live equals hash(live['exercises'])."""
    from newbie_agentic_llm_walk import sha256_text

    exercises = [
        {
            "exercise_id": "S01-T1-A-E2",
            "code": "import sys\ndef main():\n    print(sys.version)\n",
            "justification_from_packet": "Packet teaches sys.version and main entrypoint.",
            "confidence": 0.81,
            "blocked_on": [],
            "answer": "completed_from_packet",
        }
    ]
    ex_sha = sha256_text(json.dumps(exercises, ensure_ascii=False, sort_keys=True))
    # Same recomputation the validator uses
    live_sha = _ex_sha(exercises)
    assert ex_sha == live_sha


def test_receipt_binding_helper_matches_validator():
    """Validator recomputes pure exercises list hash, not ans_blob wrapper."""
    exercises = [{"exercise_id": "X", "code": "print(1)", "justification_from_packet": "a" * 50}]
    wrapped = {
        "exercises": exercises,
        "selfcheck": [],
    }
    pure = hashlib.sha256(
        json.dumps(exercises, ensure_ascii=False, sort_keys=True).encode()
    ).hexdigest()
    wrapped_sha = hashlib.sha256(
        json.dumps(wrapped, ensure_ascii=False, sort_keys=True).encode()
    ).hexdigest()
    assert pure != wrapped_sha  # why J* mismatched when receipt used full payload
