"""Permanent regression: phrase-bank + SC_KEYS bulk theater must fail forensics.

Drives shipped `attempt_level_gates` — K1/K2 bulk generators are not dual-LLM.
"""
from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from newbie_agentic_validator import attempt_level_gates  # noqa: E402


class PhraseBankAndScKeysGates(unittest.TestCase):
    """Module-level test functions are pytest's convention; this suite runs unittest,
    which collected none of them - they never ran in CI - until they were methods here."""

    def test_theater_phrase_bank_fixture_exists(self):
        p = ROOT / "tests/fixtures/theater_phrase_bank.json"
        assert p.exists()
        data = json.loads(p.read_text(encoding="utf-8"))
        assert "releer con desconfianza" in " ".join(data.get("markers") or [])

    def test_theater_sc_maps_fixtures_exist(self):
        d = ROOT / "tests/fixtures/theater_sc_maps"
        assert d.exists()
        maps = list(d.glob("*.json"))
        assert len(maps) >= 3, maps

    def test_agentic_k2_fails_phrase_bank_gate_if_present(self):
        root = ROOT / "course-state/newbie_walkthrough/agentic_K2"
        self.assertTrue(root.exists(), f"{root} is gone; this regression has nothing left to check")
        tags = {i.get("tag") for i in attempt_level_gates("agentic_K2")}
        assert "PHRASE_BANK_JUSTIFICATION" in tags, tags
        # Must NOT be empty gates — receipt bind alone is insufficient for bulk theater
        assert tags, "K2 bulk theater must fail at least one attempt_level_gate"

    def test_agentic_k1_fails_reseal_or_sc_keys_if_present(self):
        root = ROOT / "course-state/newbie_walkthrough/agentic_K1"
        self.assertTrue(root.exists(), f"{root} is gone; this regression has nothing left to check")
        tags = {i.get("tag") for i in attempt_level_gates("agentic_K1")}
        assert tags & {
            "ADMITTED_BULK_OR_RESEAL",
            "SC_KEYS_MAP_LINEAGE",
            "PHRASE_BANK_JUSTIFICATION",
        }, tags
        assert tags, "K1 reseal/SC_KEYS theater must fail attempt_level_gates"

    def test_agentic_l1_l2_pass_forensic_gates_if_present(self):
        """Honest L* path must not trip phrase-bank / reseal / opening-mass theater."""
        for att in ("agentic_L1", "agentic_L2"):
            root = ROOT / "course-state/newbie_walkthrough" / att
            self.assertTrue(root.exists(), f"{root} is gone; this regression has nothing left to check")
            tags = {i.get("tag") for i in attempt_level_gates(att)}
            ban = {
                "PHRASE_BANK_JUSTIFICATION",
                "ADMITTED_BULK_OR_RESEAL",
                "STRUCTURAL_OPENING_MASS",
                "RECEIPT_EXERCISES_MISMATCH",
                "SYNTHETIC_DURATION_STAIRCASE",
            }
            assert not (tags & ban), f"{att} failed theater gates: {tags}"

    def test_quarantined_k2_generator_has_sc_correct_map(self):
        """Regression: known bulk generator file must remain quarantined with SC_CORRECT."""
        p = (
            ROOT
            / "scripts/quarantine_theater/tool_results_bulk/k2_newbie_b_s01_s13.py"
        )
        self.assertTrue(p.exists(), f"{p} is gone; this regression has nothing left to check")
        text = p.read_text(encoding="utf-8")
        assert "SC_CORRECT" in text
        assert "Sigo dudando de atajos" in text or "releer con desconfianza" in text

    def test_phrase_bank_gate_on_synthetic_corpus(self):
        """Synthetic lives with phrase-bank justifications must trip PHRASE_BANK.

        Built in a temporary directory, with the validator's `attempt_dir` pointed at it. It
        used to be built inside the tracked course-state/newbie_walkthrough/ and removed after
        the call, so a gate that raised left a synthetic attempt in the tree.
        """
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        patcher = mock.patch("newbie_agentic_validator.attempt_dir", lambda a: Path(tmp.name) / a)
        patcher.start()
        self.addCleanup(patcher.stop)
        attempt = "agentic_L_synth_phrase_test"
        root = Path(tmp.name) / attempt
        root.mkdir(parents=True)
        (root / "meta.json").write_text(
            json.dumps(
                {
                    "attempt_id": attempt,
                    "method": "live_agentic_packet_only_no_execution",
                    "code_execution_used": False,
                }
            )
            + "\n",
            encoding="utf-8",
        )
        (root / "llm_call_receipts.jsonl").write_text("")
        (root / "llm_session_manifest.json").write_text(
            json.dumps({"entries": [], "wall_clock_minutes": 40}) + "\n"
        )
        phrase = (
            "Sigo dudando de atajos; releer con desconfianza el material y "
            "vocabulario del paquete sin inventar APIs."
        )
        for s in range(1, 53):
            d = root / f"section_{s:02d}"
            d.mkdir()
            for lab, agent in (
                ("newbie_a_live.json", "newbie_a_live"),
                ("newbie_b_live.json", "newbie_b_live"),
            ):
                live = {
                    "agent": agent,
                    "persona": "explorer" if "a" in lab else "skeptic",
                    "attempt_id": attempt,
                    "section_index": s,
                    "method": "live_agentic_packet_only_no_execution",
                    "artifact_origin": "direct_agent_output",
                    "restart_from": "landing",
                    "code_execution_used": False,
                    "agent_instance_id": f"synth-{agent}-s{s:02d}",
                    "exercises": [
                        {
                            "exercise_id": f"S{s:02d}-T1-A-E1",
                            "code": "print(1)\n",
                            "justification_from_packet": phrase,
                        }
                    ]
                    * 5,
                    "selfcheck": [
                        {
                            "question_index": i,
                            "chosen_index": 0,
                            "justification_from_packet": phrase,
                        }
                        for i in range(4)
                    ],
                    "session_started_at": "2026-07-23T10:00:00+00:00",
                    "session_ended_at": "2026-07-23T10:00:25+00:00",
                }
                (d / lab).write_text(json.dumps(live) + "\n", encoding="utf-8")
        tags = {i.get("tag") for i in attempt_level_gates(attempt)}
        assert "PHRASE_BANK_JUSTIFICATION" in tags, tags


if __name__ == "__main__":
    unittest.main()
