"""Permanent regression: phrase-bank + SC_KEYS bulk theater must fail forensics.

Drives shipped `attempt_level_gates` — K1/K2 bulk generators are not dual-LLM.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from newbie_agentic_validator import attempt_level_gates  # noqa: E402


def test_theater_phrase_bank_fixture_exists():
    p = ROOT / "tests/fixtures/theater_phrase_bank.json"
    assert p.exists()
    data = json.loads(p.read_text(encoding="utf-8"))
    assert "releer con desconfianza" in " ".join(data.get("markers") or [])


def test_theater_sc_maps_fixtures_exist():
    d = ROOT / "tests/fixtures/theater_sc_maps"
    assert d.exists()
    maps = list(d.glob("*.json"))
    assert len(maps) >= 3, maps


def test_agentic_k2_fails_phrase_bank_gate_if_present():
    root = ROOT / "course-state/newbie_walkthrough/agentic_K2"
    if not root.exists():
        return
    tags = {i.get("tag") for i in attempt_level_gates("agentic_K2")}
    assert "PHRASE_BANK_JUSTIFICATION" in tags, tags


def test_agentic_k1_fails_reseal_or_sc_keys_if_present():
    root = ROOT / "course-state/newbie_walkthrough/agentic_K1"
    if not root.exists():
        return
    tags = {i.get("tag") for i in attempt_level_gates("agentic_K1")}
    assert tags & {
        "ADMITTED_BULK_OR_RESEAL",
        "SC_KEYS_MAP_LINEAGE",
        "PHRASE_BANK_JUSTIFICATION",
    }, tags


def test_phrase_bank_gate_on_synthetic_corpus(tmp_path, monkeypatch):
    """Synthetic lives with phrase-bank justifications must trip PHRASE_BANK."""
    walk = ROOT / "course-state/newbie_walkthrough"
    attempt = "agentic_L_synth_phrase_test"
    root = walk / attempt
    if root.exists():
        import shutil

        shutil.rmtree(root)
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
    # cleanup
    import shutil

    shutil.rmtree(root)
    assert "PHRASE_BANK_JUSTIFICATION" in tags, tags
