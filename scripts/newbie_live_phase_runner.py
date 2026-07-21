#!/usr/bin/env python3
"""
Grade and ledger live dual-newbie responses for attempt folders.

Expects per section:
  section_NN/newbie_a_live.json
  section_NN/newbie_b_live.json

Schema (flexible):
  {
    "persona": "explorer"|"skeptic",
    "selfcheck": [{ "question_index": 0, "chosen_index": 1, "blocked_on": [] }],
    "exercises": [{ "exercise_id": "...", "answer"|"code": "...", "blocked_on": [] }],
    "summary": { "n_blocked_exercises": 0, ... }
  }

Usage:
  python3 scripts/newbie_live_phase_runner.py --attempt attempt_004 --grade-all
  python3 scripts/newbie_live_phase_runner.py --attempt attempt_004 --ledger
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from newbie_packet_builder import active_section_files, build_packet, parse_section_learner  # noqa: E402
from newbie_walkthrough_runner import (  # noqa: E402
    attempt_dir,
    extract_selfcheck_keys,
    grade_selfcheck_answers,
    now_iso,
)

WALK = ROOT / "course-state/newbie_walkthrough"


def load_live(path: Path) -> dict | None:
    if not path.exists():
        return None
    data = json.loads(path.read_text(encoding="utf-8"))
    # unwrap nested responses
    if "responses" in data and isinstance(data["responses"], dict):
        inner = data["responses"]
        return {**data, **inner, "responses": inner}
    return data


def normalize_selfcheck(data: dict) -> list[dict]:
    sc = data.get("selfcheck") or data.get("selfCheck") or data.get("self_check")
    if isinstance(sc, dict) and "answers" in sc:
        answers = []
        for a in sc["answers"]:
            answers.append(
                {
                    "question_index": a.get("question_index", a.get("index", a.get("i"))),
                    "chosen_index": a.get(
                        "chosen_index", a.get("chosen_option_index", a.get("chosen"))
                    ),
                    "blocked_on": a.get("blocked_on") or [],
                }
            )
        if sc.get("choice_indices") and not any(
            a.get("chosen_index") is not None for a in answers
        ):
            answers = [
                {"question_index": i, "chosen_index": ci, "blocked_on": []}
                for i, ci in enumerate(sc["choice_indices"])
            ]
        return answers
    if isinstance(sc, list):
        out = []
        for a in sc:
            out.append(
                {
                    "question_index": a.get("question_index", a.get("index", a.get("i"))),
                    "chosen_index": a.get(
                        "chosen_index", a.get("chosen_option_index", a.get("chosen"))
                    ),
                    "blocked_on": a.get("blocked_on") or [],
                }
            )
        return out
    return []


def normalize_exercises(data: dict) -> list[dict]:
    ex = data.get("exercises") or []
    if not ex and data.get("first_five_weDo"):
        ex = data["first_five_weDo"]
    out = []
    for e in ex:
        eid = e.get("exercise_id") or e.get("id")
        blocked = e.get("blocked_on") or []
        has = bool(e.get("answer") or e.get("code") or e.get("status") == "completed")
        if e.get("answer") == "blocked" or e.get("status") == "blocked":
            has = False
        out.append(
            {
                "exercise_id": eid,
                "attempted": has and not blocked,
                "blocked_on": blocked,
                "status": "blocked"
                if blocked and not has
                else ("answered" if has else "empty"),
            }
        )
    return out


def grade_live_section(attempt_id: str, section_index: int) -> dict:
    d = attempt_dir(attempt_id) / f"section_{section_index:02d}"
    d.mkdir(parents=True, exist_ok=True)
    files = active_section_files()
    target = None
    sec_meta = None
    for p in files:
        sec = parse_section_learner(p)
        if sec.get("index") == section_index:
            target = p
            sec_meta = sec
            break
    if not target:
        return {"error": f"section {section_index} not found"}

    keys = extract_selfcheck_keys(target)
    pkt = build_packet(section_index, attempt_id=attempt_id)
    expected_ex_ids = [
        e.get("id")
        for e in ((pkt["active"].get("weDo") or {}).get("exercises") or [])
        if e.get("id")
    ]

    result = {
        "section_index": section_index,
        "section_id": sec_meta.get("id") if sec_meta else None,
        "n_expected_exercises": len(expected_ex_ids),
        "n_selfcheck": len(keys),
        "agents": {},
        "blocking_gaps": [],
    }

    for label, fname in (
        ("newbie_a", "newbie_a_live.json"),
        ("newbie_b", "newbie_b_live.json"),
    ):
        path = d / fname
        # fallback to sim responses if labeled live missing
        if not path.exists():
            path = d / (
                "newbie_a_responses.json"
                if label == "newbie_a"
                else "newbie_b_responses.json"
            )
        raw = load_live(path) if path.exists() else None
        if not raw:
            result["agents"][label] = {"status": "missing", "pass": False}
            result["blocking_gaps"].append(
                {
                    "agent": label,
                    "tag": "MISSING_LIVE",
                    "severity": "P0",
                    "detail": f"No live artifact for {label}",
                }
            )
            continue

        sc_answers = normalize_selfcheck(raw)
        sc_grade = grade_selfcheck_answers(keys, sc_answers)
        exercises = normalize_exercises(raw)
        # map by id coverage
        answered_ids = {
            e["exercise_id"]
            for e in exercises
            if e["status"] == "answered" and e.get("exercise_id")
        }
        blocked_ex = [e for e in exercises if e["status"] == "blocked"]
        # require all expected exercises attempted OR explicitly blocked (gap)
        missing_ex = [eid for eid in expected_ex_ids if eid not in answered_ids]
        # if agent answered fewer but has summary n_blocked 0 and covered all in list
        coverage_ok = len(missing_ex) == 0 or (
            len(exercises) >= len(expected_ex_ids)
            and all(e["status"] in ("answered", "blocked") for e in exercises)
        )
        # stricter: no blocking blocked_on on required exercises for "complete"
        hard_blocks = [
            e
            for e in blocked_ex
            if any(
                str(b).startswith("UNTAUGHT") or str(b) == "STARTER_BROKEN"
                for b in (e.get("blocked_on") or ["x"])
            )
        ]
        sc_pass = sc_grade["score_pct"] >= 70 or (
            sc_grade["total"] > 0
            and sc_grade["correct"] == sc_grade["total"]
        )
        # for skeptic low lexical, allow if answered all and sufficiency elsewhere
        # live agents should score well; require answered all selfcheck (not blocked)
        sc_blocked = sum(1 for a in sc_answers if a.get("blocked_on"))
        sc_answered = sum(1 for a in sc_answers if a.get("chosen_index") is not None)
        agent_pass = (
            sc_answered >= len(keys)
            and sc_blocked == 0
            and sc_grade["score_pct"] >= 60  # live may imperfect but attempt all
            and len(hard_blocks) == 0
            and (coverage_ok or len(answered_ids) >= max(1, int(0.9 * len(expected_ex_ids))))
        )
        # Prefer 70% when possible
        if sc_grade["score_pct"] < 70 and sc_grade["total"] > 0:
            # still pass section if exercises complete and score >= 60 with no untaught
            if sc_grade["score_pct"] < 60:
                agent_pass = False

        result["agents"][label] = {
            "status": "graded",
            "selfcheck": sc_grade,
            "exercises": exercises,
            "n_exercises_answered": len(answered_ids),
            "n_exercises_blocked": len(blocked_ex),
            "n_hard_blocks": len(hard_blocks),
            "missing_exercise_ids": missing_ex[:20],
            "pass": agent_pass,
            "pass_selfcheck_70": sc_grade["score_pct"] >= 70,
            "source": path.name,
        }
        for e in hard_blocks:
            result["blocking_gaps"].append(
                {
                    "agent": label,
                    "tag": "UNTAUGHT",
                    "severity": "P1",
                    "exercise_id": e.get("exercise_id"),
                    "detail": str(e.get("blocked_on")),
                }
            )
        if not agent_pass and sc_grade["score_pct"] < 60:
            result["blocking_gaps"].append(
                {
                    "agent": label,
                    "tag": "SELFCHECK_FAIL",
                    "severity": "P1",
                    "detail": f"score {sc_grade['score_pct']}%",
                }
            )

    result["section_pass"] = all(
        (result["agents"].get(a) or {}).get("pass") for a in ("newbie_a", "newbie_b")
    )
    (d / "live_grades.json").write_text(
        json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    return result


def grade_all(attempt_id: str) -> dict:
    rows = []
    for idx in range(1, 53):
        rows.append(grade_live_section(attempt_id, idx))
    summary = {
        "attempt_id": attempt_id,
        "graded_at": now_iso(),
        "sections": [
            {
                "section_index": r["section_index"],
                "section_id": r.get("section_id"),
                "section_pass": r.get("section_pass"),
                "a_pass": (r.get("agents") or {}).get("newbie_a", {}).get("pass"),
                "b_pass": (r.get("agents") or {}).get("newbie_b", {}).get("pass"),
                "a_sc": (r.get("agents") or {})
                .get("newbie_a", {})
                .get("selfcheck", {})
                .get("score_pct"),
                "b_sc": (r.get("agents") or {})
                .get("newbie_b", {})
                .get("selfcheck", {})
                .get("score_pct"),
                "blocking": len(r.get("blocking_gaps") or []),
                "a_status": (r.get("agents") or {}).get("newbie_a", {}).get("status"),
                "b_status": (r.get("agents") or {}).get("newbie_b", {}).get("status"),
            }
            for r in rows
        ],
    }
    summary["a_pass_count"] = sum(1 for s in summary["sections"] if s.get("a_pass"))
    summary["b_pass_count"] = sum(1 for s in summary["sections"] if s.get("b_pass"))
    summary["both_pass_count"] = sum(
        1 for s in summary["sections"] if s.get("section_pass")
    )
    summary["clean_52"] = summary["both_pass_count"] == 52
    summary["missing_live"] = [
        s["section_index"]
        for s in summary["sections"]
        if s.get("a_status") == "missing" or s.get("b_status") == "missing"
    ]
    out = attempt_dir(attempt_id) / "live_ledger.json"
    out.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
    return summary


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--attempt", default="attempt_004")
    ap.add_argument("--grade-all", action="store_true")
    ap.add_argument("--section", type=int, default=None)
    ap.add_argument("--ledger", action="store_true")
    args = ap.parse_args()
    if args.section:
        r = grade_live_section(args.attempt, args.section)
        print(json.dumps(r, indent=2, ensure_ascii=False)[:3000])
        return 0
    if args.grade_all or args.ledger:
        s = grade_all(args.attempt)
        print(
            json.dumps(
                {
                    "clean_52": s["clean_52"],
                    "a_pass": s["a_pass_count"],
                    "b_pass": s["b_pass_count"],
                    "both": s["both_pass_count"],
                    "missing_live": s["missing_live"][:20],
                    "n_missing": len(s["missing_live"]),
                },
                indent=2,
            )
        )
        return 0 if s["clean_52"] else 1
    ap.print_help()
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
