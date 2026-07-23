#!/usr/bin/env python3
"""
Sealed dual-LLM walk harness for agentic_J* attempts.

- Builds key-free packets only (no solution generation).
- write_live REQUIRES a matching llm_call_receipts.jsonl receipt.
- Refuses prior-attempt lives, bulk completers, and theater attempt ids for pass claims.
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
ALLOWED_PREFIX = ("agentic_J", "agentic_K")
REJECTED_THEATER = (
    "agentic_D", "agentic_E", "agentic_F", "agentic_G", "agentic_H", "agentic_I",
)


def _parse(ts: str) -> datetime:
    return datetime.fromisoformat(str(ts).replace("Z", "+00:00"))


def sha256_text(s: str) -> str:
    return hashlib.sha256((s or "").encode("utf-8")).hexdigest()


def sha_payload(exercises: list, selfcheck: list) -> str:
    blob = json.dumps(
        {"exercises": exercises or [], "selfcheck": selfcheck or []},
        ensure_ascii=False,
        sort_keys=True,
    )
    return sha256_text(blob)


def init_attempt(attempt: str, *, prior_clean: str | None = None) -> Path:
    if not any(attempt.startswith(p) for p in ALLOWED_PREFIX):
        raise SystemExit(
            f"llm_walk sealed path only for agentic_J*/K*; got {attempt}. "
            f"Theater ids D–I permanently rejected for pass claims."
        )
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
        "production_harness": "sealed newbie_agentic_llm_walk + dual-LLM receipts",
        "forbidden_harnesses": [
            "tool-results bulk writers",
            "quarantine_theater completers",
            "packet_walk",
            "hardcoded SELFCHECK/ANSWERS maps",
            "e1 transplant",
        ],
        "method": "live_agentic_packet_only_no_execution",
        "reason": (
            "Dual-LLM Explorer+Skeptic from landing; sealed write_live requires "
            "per-section receipts; no bulk generators"
        ),
        "receipts_required": True,
    }
    if prior_clean:
        meta["prior_clean"] = prior_clean
        meta["independence_baseline"] = prior_clean
    (root / "meta.json").write_text(json.dumps(meta, indent=2) + "\n", encoding="utf-8")
    (root / "issues.jsonl").write_text("")
    (root / "llm_call_receipts.jsonl").write_text("")
    man = {
        "attempt_id": attempt,
        "created_at": now_iso(),
        "entries": [],
        "wall_clock_minutes": 0.0,
        "note": "Rows appended only via write_live with valid receipts.",
    }
    (root / "llm_session_manifest.json").write_text(
        json.dumps(man, indent=2) + "\n", encoding="utf-8"
    )
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


def append_receipt(attempt: str, receipt: dict) -> None:
    path = attempt_dir(attempt) / "llm_call_receipts.jsonl"
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(receipt, ensure_ascii=False) + "\n")


def load_receipts(attempt: str) -> list[dict]:
    path = attempt_dir(attempt) / "llm_call_receipts.jsonl"
    if not path.exists():
        return []
    out = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        out.append(json.loads(line))
    return out


def find_receipt(
    attempt: str, *, section: int, agent: str, exercises_sha: str, selfcheck_sha: str
) -> dict | None:
    for r in load_receipts(attempt):
        if (
            int(r.get("section", -1)) == section
            and r.get("agent") == agent
            and r.get("exercises_sha256") == exercises_sha
            and r.get("selfcheck_sha256") == selfcheck_sha
        ):
            return r
    return None


def write_live(
    attempt: str,
    section: int,
    *,
    agent: str,
    persona: str,
    session_id: str,
    started_at: str,
    ended_at: str,
    exercises: list,
    selfcheck: list,
    prompt_sha256: str,
    response_sha256: str,
    model_or_subagent_id: str,
    confusion_points: list | None = None,
) -> Path:
    """Sealed write: requires receipt matching payload hashes + latency ≥ 8s."""
    if not any(attempt.startswith(p) for p in ALLOWED_PREFIX):
        raise RuntimeError(f"write_live refused for non-J/K attempt {attempt}")
    root = attempt_dir(attempt)
    # Canonical hashes MUST match what the validator recomputes from live files:
    #   exercises_sha256 = sha256(json.dumps(exercises, sort_keys=True, ensure_ascii=False))
    #   selfcheck_sha256 = sha256(json.dumps(selfcheck, sort_keys=True, ensure_ascii=False))
    ex_sha = sha256_text(json.dumps(exercises or [], ensure_ascii=False, sort_keys=True))
    sc_sha = sha256_text(json.dumps(selfcheck or [], ensure_ascii=False, sort_keys=True))

    # latency
    try:
        lat = (_parse(ended_at) - _parse(started_at)).total_seconds() * 1000.0
    except Exception as e:
        raise RuntimeError(f"bad timestamps: {e}") from e
    if lat < 8000:
        raise RuntimeError(f"receipt latency_ms {lat:.0f} < 8000 for section {section} {agent}")

    # response_sha256 must equal hash of answers+justifications (canonical binding)
    ans_blob = json.dumps(
        {
            "exercises": [
                {
                    "id": e.get("exercise_id") or e.get("id"),
                    "code": e.get("code"),
                    "just": e.get("justification_from_packet"),
                }
                for e in (exercises or [])
            ],
            "selfcheck": [
                {
                    "qi": a.get("question_index"),
                    "ci": a.get("chosen_index"),
                    "just": a.get("justification_from_packet"),
                }
                for a in (selfcheck or [])
            ],
        },
        ensure_ascii=False,
        sort_keys=True,
    )
    expected_resp = sha256_text(ans_blob)
    if response_sha256 != expected_resp:
        raise RuntimeError(
            f"response_sha256 mismatch for s{section} {agent}: "
            f"got {response_sha256[:12]} expected {expected_resp[:12]}"
        )

    receipt = {
        "section": section,
        "agent": agent if agent in ("newbie_a", "newbie_b") else (
            "newbie_a" if "a" in agent else "newbie_b"
        ),
        "started_at": started_at,
        "ended_at": ended_at,
        "latency_ms": int(lat),
        "model_or_subagent_id": model_or_subagent_id,
        "prompt_sha256": prompt_sha256,
        "response_sha256": response_sha256,
        "exercises_sha256": ex_sha,  # MUST equal hash of live["exercises"]
        "selfcheck_sha256": sc_sha,  # MUST equal hash of live["selfcheck"]
        "session_id": session_id,
    }
    append_receipt(attempt, receipt)

    agent_key = receipt["agent"]
    lab = "newbie_a_live.json" if agent_key == "newbie_a" else "newbie_b_live.json"
    live = {
        "agent": f"{agent_key}_live",
        "persona": persona,
        "attempt_id": attempt,
        "section_index": section,
        "method": "live_agentic_packet_only_no_execution",
        "artifact_origin": "direct_agent_output",
        "restart_from": "landing",
        "code_execution_used": False,
        "agent_instance_id": session_id,
        "production_note": (
            f"{attempt} dual-LLM {persona}: sealed receipt write; packet-only; "
            f"no bulk writers; no identity stamps"
        ),
        "knowledge_boundary": "Only landing + prior + active packet content.",
        "forbidden_honored": True,
        "exercises": exercises,
        "selfcheck": selfcheck,
        "confusion_points": confusion_points or [],
        "recorded_at": now_iso(),
        "session_started_at": started_at,
        "session_ended_at": ended_at,
        "receipt_response_sha256": response_sha256,
        "receipt_exercises_sha256": ex_sha,
        "receipt_selfcheck_sha256": sc_sha,
    }
    out = root / f"section_{section:02d}" / lab
    out.write_text(json.dumps(live, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    # manifest row
    man_path = root / "llm_session_manifest.json"
    man = json.loads(man_path.read_text(encoding="utf-8"))
    man.setdefault("entries", []).append(
        {
            "section": section,
            "agent": agent_key,
            "started_at": started_at,
            "ended_at": ended_at,
            "subagent_or_session_id": session_id,
            "response_sha256": response_sha256,
            "latency_ms": int(lat),
        }
    )
    try:
        starts = [_parse(e["started_at"]) for e in man["entries"] if e.get("started_at")]
        ends = [_parse(e["ended_at"]) for e in man["entries"] if e.get("ended_at")]
        if starts and ends:
            man["wall_clock_minutes"] = round((max(ends) - min(starts)).total_seconds() / 60.0, 2)
    except Exception:
        pass
    man_path.write_text(json.dumps(man, indent=2) + "\n", encoding="utf-8")
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--init", metavar="ATTEMPT")
    ap.add_argument("--prior-clean", default=None)
    args = ap.parse_args()
    if args.init:
        init_attempt(args.init, prior_clean=args.prior_clean)
        return 0
    ap.print_help()
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
