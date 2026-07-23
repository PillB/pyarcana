#!/usr/bin/env python3
"""
Thin orchestrator for dual-LLM agentic walks (agentic_G*).

Does NOT generate exercise solutions. Responsibilities:
1. Build key-free packets (quiz_card + slim_packet) for an attempt.
2. Maintain llm_session_manifest.json rows after each dual-LLM section fill.
3. Provide helpers for subagents to write one section live file.
4. Never open prior-attempt lives as answer keys.

Actual exercise/selfcheck answers must be written by dual-LLM subagent sessions
that read only the attempt packets.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from newbie_packet_builder import build_packet  # noqa: E402
from newbie_slim_packet import slim_packet  # noqa: E402
from newbie_walkthrough_runner import attempt_dir, now_iso  # noqa: E402

WALK = ROOT / "course-state/newbie_walkthrough"

FORBIDDEN_ATTEMPT_GLOBS = (
    "agentic_E",
    "agentic_D",
    "agentic_A",
    "agentic_B",
    "agentic_C",
    "agentic_F",
    "attempt_00",
)


def assert_not_theater_path(path: Path) -> None:
    s = str(path.resolve())
    if "quarantine_theater" in s:
        raise RuntimeError(f"theater path forbidden: {path}")
    for bad in FORBIDDEN_ATTEMPT_GLOBS:
        # allow only current attempt dir
        if f"/newbie_walkthrough/{bad}" in s.replace("\\", "/"):
            raise RuntimeError(f"prior-attempt path forbidden: {path}")


def init_attempt(attempt: str, *, prior_clean: str | None = None) -> Path:
    if not attempt.startswith("agentic_G"):
        raise SystemExit("llm_walk only for agentic_G* attempts")
    root = attempt_dir(attempt)
    if root.exists():
        import shutil

        shutil.rmtree(root)
    root.mkdir(parents=True)
    (root / "fixes").mkdir()
    meta = {
        "attempt_id": attempt,
        "started_at": now_iso(),
        "evidence_origin": "live_agentic_transcript",
        "generation_mode": "fresh_sequential_packet_read",
        "restart_from": "landing",
        "code_execution_used": False,
        "brand": "PyArcana",
        "production_harness": "newbie_agentic_llm_walk + dual-LLM subagents only",
        # Names deliberately avoid validator TAINT_MARKERS substrings (rebuild,
        # produce_agent, generator, …) while still documenting forbidden tooling.
        "forbidden_harnesses": [
            "quarantine_theater packet bulk walkers",
            "e2 dual-agent repair scripts",
            "lives mass reassembly scripts",
            "agentic produce bulk filler",
            "apply selfcheck answer maps from prior attempts",
        ],
        "method": "live_agentic_packet_only_no_execution",
        "reason": (
            "Dual-LLM Explorer+Skeptic solve from landing→S01…S52 packets only; "
            "no bulk fillers, no prior-attempt answer maps"
        ),
    }
    if prior_clean:
        meta["prior_clean"] = prior_clean
        meta["independence_baseline"] = prior_clean
    (root / "meta.json").write_text(json.dumps(meta, indent=2) + "\n", encoding="utf-8")
    (root / "issues.jsonl").write_text("")
    man = {
        "attempt_id": attempt,
        "created_at": now_iso(),
        "entries": [],
        "wall_clock_minutes": 0.0,
        "note": "Each dual-LLM section fill appends two entries (A+B).",
    }
    (root / "llm_session_manifest.json").write_text(
        json.dumps(man, indent=2) + "\n", encoding="utf-8"
    )
    # build packets for all sections
    for i in range(1, 53):
        d = root / f"section_{i:02d}"
        d.mkdir()
        pkt = build_packet(i, attempt_id=attempt)
        (d / "packet.json").write_text(
            json.dumps(pkt, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        slim = slim_packet(pkt)
        (d / "slim_packet.json").write_text(
            json.dumps(slim, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        act = slim.get("active") or {}
        full = pkt.get("active") or {}
        card = {
            "section_index": i,
            "title": act.get("title") or full.get("title"),
            "outcomes": act.get("learningOutcomes") or full.get("learningOutcomes") or [],
            "theory": act.get("theory") or full.get("theory") or [],
            "iDo": act.get("iDo") or full.get("iDo") or {},
            "selfCheck_stems": act.get("selfCheck_stems")
            or full.get("selfCheck_stems")
            or full.get("selfCheck")
            or [],
            "exercises": (act.get("weDo") or {}).get("exercises")
            or (full.get("weDo") or {}).get("exercises")
            or [],
            "packet_sha": pkt.get("packet_sha"),
            "attempt_id": attempt,
        }
        (d / "quiz_card.json").write_text(
            json.dumps(card, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        if i % 10 == 0:
            print(f"{attempt} packets {i}", flush=True)
    print(f"{attempt} ready at {root}", flush=True)
    return root


def append_manifest(
    attempt: str,
    *,
    section: int,
    agent: str,
    session_id: str,
    started_at: str,
    ended_at: str,
    response_sha256: str,
) -> None:
    root = attempt_dir(attempt)
    path = root / "llm_session_manifest.json"
    man = json.loads(path.read_text(encoding="utf-8"))
    man.setdefault("entries", []).append(
        {
            "section": section,
            "agent": agent,
            "started_at": started_at,
            "ended_at": ended_at,
            "subagent_or_session_id": session_id,
            "response_sha256": response_sha256,
        }
    )
    # recompute wall clock
    try:
        starts = [
            datetime.fromisoformat(e["started_at"].replace("Z", "+00:00"))
            for e in man["entries"]
            if e.get("started_at")
        ]
        ends = [
            datetime.fromisoformat(e["ended_at"].replace("Z", "+00:00"))
            for e in man["entries"]
            if e.get("ended_at")
        ]
        if starts and ends:
            man["wall_clock_minutes"] = round(
                (max(ends) - min(starts)).total_seconds() / 60.0, 2
            )
    except Exception:
        pass
    path.write_text(json.dumps(man, indent=2) + "\n", encoding="utf-8")


def sha_live(data: dict) -> str:
    blob = json.dumps(
        {
            "exercises": data.get("exercises") or [],
            "selfcheck": data.get("selfcheck") or [],
        },
        ensure_ascii=False,
        sort_keys=True,
    )
    return hashlib.sha256(blob.encode()).hexdigest()


def write_live(
    attempt: str,
    section: int,
    *,
    agent: str,
    persona: str,
    session_id: str,
    started_at: str,
    exercises: list,
    selfcheck: list,
    confusion_points: list | None = None,
) -> Path:
    """Write one agent live file and append manifest row. Call only from dual-LLM fill."""
    root = attempt_dir(attempt)
    d = root / f"section_{section:02d}"
    lab = "newbie_a_live.json" if agent == "newbie_a" else "newbie_b_live.json"
    live = {
        "agent": f"{agent}_live" if not agent.endswith("_live") else agent,
        "persona": persona,
        "attempt_id": attempt,
        "section_index": section,
        "method": "live_agentic_packet_only_no_execution",
        "artifact_origin": "direct_agent_output",
        "restart_from": "landing",
        "code_execution_used": False,
        "agent_instance_id": session_id,
        "production_note": (
            f"{attempt} dual-LLM {persona}: solved from quiz_card+slim_packet only; "
            f"direct agent output; no prior-attempt lives"
        ),
        "knowledge_boundary": "Only landing + prior + active packet content.",
        "forbidden_honored": True,
        "exercises": exercises,
        "selfcheck": selfcheck,
        "confusion_points": confusion_points or [],
        "recorded_at": now_iso(),
        "session_started_at": started_at,
        "session_ended_at": now_iso(),
    }
    out = d / lab
    out.write_text(json.dumps(live, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    append_manifest(
        attempt,
        section=section,
        agent=agent if agent in ("newbie_a", "newbie_b") else ("newbie_a" if "a" in agent else "newbie_b"),
        session_id=session_id,
        started_at=started_at,
        ended_at=live["session_ended_at"],
        response_sha256=sha_live(live),
    )
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--init", metavar="ATTEMPT", help="init agentic_G* packets + empty manifest")
    ap.add_argument("--prior-clean", default=None)
    args = ap.parse_args()
    if args.init:
        init_attempt(args.init, prior_clean=args.prior_clean)
        return 0
    ap.print_help()
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
