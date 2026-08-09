#!/usr/bin/env python3
"""
Orchestrate PyArcana dual-newbie curriculum walkthroughs.

- Builds cumulative learner packets (no solutions).
- Runs automated heuristic gap scans per section.
- Grades self-check offline when keys are available (newbies never see keys).
- Logs attempts under course-state/newbie_walkthrough/.

Live dual-LLM newbie agents are coordinated by the orchestrator (main session);
this runner provides infrastructure, grading, and evidence trails.

Usage:
  python3 scripts/newbie_walkthrough_runner.py --init-attempt attempt_001 --reason "baseline"
  python3 scripts/newbie_walkthrough_runner.py --scan-all --attempt attempt_001
  python3 scripts/newbie_walkthrough_runner.py --grade-selfcheck --attempt attempt_001 --section 1
  python3 scripts/newbie_walkthrough_runner.py --record-responses --attempt attempt_001 --section 1 --agent a --file responses.json
  python3 scripts/newbie_walkthrough_runner.py --finalize --attempt attempt_001
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from newbie_packet_builder import (  # noqa: E402
    active_section_files,
    build_packet,
    build_validator_audit,
    extract_string_array,
    extract_string_field,
    parse_section_learner,
)

WALK = ROOT / "course-state/newbie_walkthrough"
SECTIONS_DIR = ROOT / "src/lib/course/sections"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def git_sha() -> str:
    try:
        return (
            subprocess.check_output(
                ["git", "rev-parse", "--short", "HEAD"], cwd=ROOT, text=True
            ).strip()
        )
    except Exception:
        return "unknown"


def attempt_dir(attempt_id: str) -> Path:
    return WALK / attempt_id


def init_attempt(attempt_id: str, reason: str) -> Path:
    d = attempt_dir(attempt_id)
    d.mkdir(parents=True, exist_ok=True)
    (d / "fixes").mkdir(exist_ok=True)
    meta = {
        "attempt_id": attempt_id,
        "started_at": now_iso(),
        "git_sha": git_sha(),
        "reason": reason,
        "preamble": (
            "Dual-newbie walkthrough: agents may only use landing + S01..SN. "
            "Solutions/correctIndex stripped. Restart after any content fix."
        ),
        "brand": "PyArcana",
    }
    (d / "meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    (d / "issues.jsonl").touch()
    WALK.mkdir(parents=True, exist_ok=True)
    log = WALK / "ATTEMPT_LOG.md"
    if not log.exists():
        log.write_text(
            "# PyArcana Newbie Walkthrough — Attempt Log\n\n"
            "| attempt | started | max_section | fails | gaps | fix | restart |\n"
            "|---------|---------|-------------|-------|------|-----|--------|\n",
            encoding="utf-8",
        )
    with log.open("a", encoding="utf-8") as f:
        f.write(
            f"| {attempt_id} | {meta['started_at'][:19]} | - | - | - | {reason} | start |\n"
        )
    return d


def extract_selfcheck_keys(path: Path) -> list[dict]:
    """Server-side only: correctIndex + explanation for grading."""
    text = path.read_text(encoding="utf-8", errors="replace")
    m_sc = re.search(r"\bselfCheck\s*:\s*\{", text)
    if not m_sc:
        return []
    region = text[m_sc.start() :]
    keys = []
    for m in re.finditer(r"\bquestion:\s*", region):
        chunk = region[m.start() : m.start() + 5000]
        q = extract_string_field(chunk, "question")
        if not q:
            continue
        options = extract_string_array(chunk, "options")
        if len(options) < 2:
            continue
        ci_m = re.search(r"correctIndex\s*:\s*(\d+)", chunk)
        correct = int(ci_m.group(1)) if ci_m else None
        expl = extract_string_field(chunk, "explanation")
        keys.append(
            {
                "question": q,
                "options": options,
                "correctIndex": correct,
                "explanation": expl,
            }
        )
        if len(keys) >= 40:
            break
    return keys


def grade_selfcheck_answers(
    keys: list[dict], answers: list[dict]
) -> dict:
    """answers: [{question_index or question, chosen_index or chosen_text}]"""
    results = []
    correct = 0
    for i, key in enumerate(keys):
        ans = None
        for a in answers:
            if a.get("question_index") == i:
                ans = a
                break
            if a.get("question") and a["question"] == key["question"]:
                ans = a
                break
        if ans is None:
            results.append({"i": i, "status": "unanswered"})
            continue
        chosen = ans.get("chosen_index")
        if chosen is None and ans.get("chosen_text") is not None:
            try:
                chosen = key["options"].index(ans["chosen_text"])
            except ValueError:
                chosen = None
        ok = chosen is not None and chosen == key.get("correctIndex")
        if ok:
            correct += 1
        results.append(
            {
                "i": i,
                "status": "correct" if ok else "wrong",
                "chosen": chosen,
                "expected": key.get("correctIndex"),
            }
        )
    total = len(keys)
    return {
        "correct": correct,
        "total": total,
        "score_pct": round(100 * correct / total, 1) if total else 0,
        "results": results,
    }


def scan_all(attempt_id: str) -> dict:
    d = attempt_dir(attempt_id)
    d.mkdir(parents=True, exist_ok=True)
    packets_dir = d / "packets"
    packets_dir.mkdir(exist_ok=True)
    validator_dir = d / "validator_artifacts"
    validator_dir.mkdir(exist_ok=True)
    section_summaries = []
    all_gaps = []
    max_ok = 0

    for idx in range(1, 53):
        pkt = build_packet(idx, attempt_id=attempt_id)
        sec_dir = d / f"section_{idx:02d}"
        sec_dir.mkdir(exist_ok=True)
        (sec_dir / "packet.json").write_text(
            json.dumps(pkt, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        (packets_dir / f"section_{idx:02d}.json").write_text(
            json.dumps(pkt, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        audit = build_validator_audit(idx, attempt_id=attempt_id)
        gaps = audit["heuristic_gaps"]
        (validator_dir / f"section_{idx:02d}.json").write_text(
            json.dumps(audit, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        for g in gaps:
            all_gaps.append(g)
            with (d / "issues.jsonl").open("a", encoding="utf-8") as f:
                f.write(
                    json.dumps(
                        {"ts": now_iso(), "section_index": idx, **g},
                        ensure_ascii=False,
                    )
                    + "\n"
                )
        n_ex = len((pkt["active"].get("weDo") or {}).get("exercises") or [])
        n_sc = len(pkt["active"].get("selfCheck_stems") or [])
        n_theory = len(pkt["active"].get("theory") or [])
        n_ido = len((pkt["active"].get("iDo") or {}).get("steps") or [])
        status = "ok" if not gaps else "gaps"
        if status == "ok":
            max_ok = idx
        section_summaries.append(
            {
                "section_index": idx,
                "id": pkt["active"]["id"],
                "title": pkt["active"]["title"],
                "n_exercises": n_ex,
                "n_selfcheck": n_sc,
                "n_theory": n_theory,
                "n_ido": n_ido,
                "heuristic_gaps": len(gaps),
                "status": status,
                "packet_sha": pkt["packet_sha"],
            }
        )

    report = {
        "attempt_id": attempt_id,
        "scanned_at": now_iso(),
        "sections": section_summaries,
        "total_heuristic_gaps": len(all_gaps),
        "p0_gaps": sum(1 for g in all_gaps if g.get("severity") == "P0"),
        "p1_gaps": sum(1 for g in all_gaps if g.get("severity") == "P1"),
        "max_section_clean": max_ok,
        "gaps_sample": all_gaps[:50],
    }
    (d / "scan_report.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    return report


def offline_selfcheck_integrity(attempt_id: str) -> dict:
    """Validate self-check keys exist and correctIndex in range (server-side)."""
    d = attempt_dir(attempt_id)
    files = active_section_files()
    parsed = [parse_section_learner(p) for p in files]
    parsed.sort(key=lambda s: s.get("index") or 0)
    issues = []
    ok_sections = 0
    for sec_path, sec in zip(
        sorted(files, key=lambda p: parse_section_learner(p).get("index") or 0),
        parsed,
    ):
        keys = extract_selfcheck_keys(sec_path)
        stems = sec.get("selfCheck_stems") or []
        if not keys and not stems:
            issues.append(
                {
                    "section_id": sec["id"],
                    "tag": "EXAM_INVALID",
                    "detail": "No self-check questions",
                    "severity": "P1",
                }
            )
            continue
        bad = False
        for i, k in enumerate(keys):
            ci = k.get("correctIndex")
            opts = k.get("options") or []
            if ci is None or ci < 0 or ci >= len(opts):
                issues.append(
                    {
                        "section_id": sec["id"],
                        "tag": "EXAM_INVALID",
                        "detail": f"Q{i} correctIndex OOR: {ci} opts={len(opts)}",
                        "severity": "P0",
                    }
                )
                bad = True
            # too easy: explanation equals correct option only — ok
            # impossible: empty options
            if any(not (o or "").strip() for o in opts):
                issues.append(
                    {
                        "section_id": sec["id"],
                        "tag": "EXAM_INVALID",
                        "detail": f"Q{i} empty option",
                        "severity": "P0",
                    }
                )
                bad = True
        if not bad:
            ok_sections += 1
        # write keys hash only (not full keys in learner packet)
        sec_dir = d / f"section_{sec['index']:02d}"
        sec_dir.mkdir(exist_ok=True)
        key_meta = {
            "n_questions": len(keys),
            "keys_sha": hashlib.sha256(
                json.dumps(
                    [{"ci": k.get("correctIndex"), "n": len(k.get("options") or [])} for k in keys]
                ).encode()
            ).hexdigest()[:16],
        }
        (sec_dir / "selfcheck_key_meta.json").write_text(
            json.dumps(key_meta, indent=2), encoding="utf-8"
        )

    report = {
        "attempt_id": attempt_id,
        "ok_sections": ok_sections,
        "issue_count": len(issues),
        "p0": sum(1 for i in issues if i.get("severity") == "P0"),
        "p1": sum(1 for i in issues if i.get("severity") == "P1"),
        "issues": issues[:100],
        "checked_at": now_iso(),
    }
    (d / "selfcheck_integrity.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    return report


def record_agent_responses(
    attempt_id: str, section_index: int, agent: str, responses: dict
) -> Path:
    d = attempt_dir(attempt_id) / f"section_{section_index:02d}"
    d.mkdir(parents=True, exist_ok=True)
    agent = agent.lower()
    name = "newbie_a_responses.json" if agent in ("a", "newbie_a", "explorer") else "newbie_b_responses.json"
    path = d / name
    payload = {
        "agent": agent,
        "section_index": section_index,
        "recorded_at": now_iso(),
        "responses": responses,
    }
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    return path


def grade_section_agents(attempt_id: str, section_index: int) -> dict:
    """Grade self-check answers from both newbies; exercise code graded loosely."""
    d = attempt_dir(attempt_id) / f"section_{section_index:02d}"
    files = active_section_files()
    # find file by index
    target = None
    for p in files:
        sec = parse_section_learner(p)
        if sec.get("index") == section_index:
            target = p
            break
    if not target:
        return {"error": f"section {section_index} not found"}
    keys = extract_selfcheck_keys(target)
    grades = {"section_index": section_index, "agents": {}}
    for agent_file, label in (
        ("newbie_a_responses.json", "newbie_a"),
        ("newbie_b_responses.json", "newbie_b"),
    ):
        path = d / agent_file
        if not path.exists():
            grades["agents"][label] = {"status": "missing"}
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        resp = data.get("responses") or data
        sc_answers = resp.get("selfcheck") or resp.get("self_check") or []
        sc_grade = grade_selfcheck_answers(keys, sc_answers)
        exercises = resp.get("exercises") or []
        ex_grades = []
        for ex in exercises:
            # structural: must have answer or code and not admit blocked without gap tag
            blocked = ex.get("blocked_on") or []
            has_answer = bool(ex.get("answer") or ex.get("code"))
            ex_grades.append(
                {
                    "exercise_id": ex.get("exercise_id") or ex.get("id"),
                    "attempted": has_answer,
                    "blocked_on": blocked,
                    "confidence": ex.get("confidence"),
                    "status": "blocked" if blocked and not has_answer else ("answered" if has_answer else "empty"),
                }
            )
        grades["agents"][label] = {
            "selfcheck": sc_grade,
            "exercises": ex_grades,
            "pass_selfcheck": sc_grade["score_pct"] >= 70,
            "all_exercises_attempted": all(
                e["status"] in ("answered", "blocked") for e in ex_grades
            )
            if ex_grades
            else False,
        }
    (d / "grades.json").write_text(
        json.dumps(grades, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    return grades


def log_fix(attempt_id: str, fix_id: str, body: dict) -> Path:
    d = attempt_dir(attempt_id) / "fixes"
    d.mkdir(parents=True, exist_ok=True)
    path = d / f"{fix_id}.md"
    md = [
        f"# {fix_id}",
        "",
        f"- attempt: {attempt_id}",
        f"- at: {now_iso()}",
        f"- tag: {body.get('tag', '')}",
        f"- section: {body.get('section_id', body.get('section_index', ''))}",
        "",
        "## Pre-round research",
        "",
        body.get("research", "(none)"),
        "",
        "## Root cause",
        "",
        body.get("root_cause", ""),
        "",
        "## Files changed",
        "",
        "\n".join(f"- `{f}`" for f in body.get("files", [])),
        "",
        "## Fix",
        "",
        body.get("fix", ""),
        "",
        "## Verification",
        "",
        body.get("verification", ""),
        "",
        "## Retrospection",
        "",
        body.get("retrospection", ""),
        "",
    ]
    path.write_text("\n".join(md), encoding="utf-8")
    return path


def finalize(attempt_id: str) -> dict:
    d = attempt_dir(attempt_id)
    scan = {}
    if (d / "scan_report.json").exists():
        scan = json.loads((d / "scan_report.json").read_text())
    sc = {}
    if (d / "selfcheck_integrity.json").exists():
        sc = json.loads((d / "selfcheck_integrity.json").read_text())
    # collect per-section grades
    agent_pass = {"newbie_a": 0, "newbie_b": 0}
    sections_graded = 0
    for idx in range(1, 53):
        gpath = d / f"section_{idx:02d}" / "grades.json"
        if not gpath.exists():
            continue
        sections_graded += 1
        g = json.loads(gpath.read_text())
        for label in ("newbie_a", "newbie_b"):
            ag = (g.get("agents") or {}).get(label) or {}
            if ag.get("pass_selfcheck"):
                agent_pass[label] += 1

    summary = {
        "attempt_id": attempt_id,
        "finalized_at": now_iso(),
        "git_sha": git_sha(),
        "heuristic_gaps": scan.get("total_heuristic_gaps"),
        "selfcheck_p0": sc.get("p0"),
        "selfcheck_p1": sc.get("p1"),
        "sections_graded": sections_graded,
        "newbie_a_selfcheck_pass_sections": agent_pass["newbie_a"],
        "newbie_b_selfcheck_pass_sections": agent_pass["newbie_b"],
        "clean_52": (
            sections_graded >= 52
            and agent_pass["newbie_a"] >= 52
            and agent_pass["newbie_b"] >= 52
            and (scan.get("p0_gaps") or 0) == 0
            and (sc.get("p0") or 0) == 0
        ),
    }
    (d / "summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    # update master log
    log = WALK / "ATTEMPT_LOG.md"
    with log.open("a", encoding="utf-8") as f:
        f.write(
            f"| {attempt_id} | finalize | {sections_graded} | "
            f"{scan.get('total_heuristic_gaps')} | "
            f"sc_p0={sc.get('p0')} | "
            f"A={agent_pass['newbie_a']} B={agent_pass['newbie_b']} | "
            f"{'COMPLETE' if summary['clean_52'] else 'incomplete'} |\n"
        )
    # global SUMMARY
    (WALK / "SUMMARY.md").write_text(
        "# PyArcana Newbie Walkthrough Summary\n\n"
        f"- Last attempt: **{attempt_id}**\n"
        f"- Finalized: {summary['finalized_at']}\n"
        f"- Git: `{summary['git_sha']}`\n"
        f"- Sections graded: {sections_graded}/52\n"
        f"- Newbie A self-check pass: {agent_pass['newbie_a']}/52\n"
        f"- Newbie B self-check pass: {agent_pass['newbie_b']}/52\n"
        f"- Heuristic gaps: {scan.get('total_heuristic_gaps')}\n"
        f"- Self-check integrity P0/P1: {sc.get('p0')}/{sc.get('p1')}\n"
        f"- Clean 52: **{summary['clean_52']}**\n",
        encoding="utf-8",
    )
    return summary


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--init-attempt", default=None)
    ap.add_argument("--reason", default="scan")
    ap.add_argument("--attempt", default="attempt_001")
    ap.add_argument("--scan-all", action="store_true")
    ap.add_argument("--selfcheck-integrity", action="store_true")
    ap.add_argument("--section", type=int, default=None)
    ap.add_argument("--record-responses", action="store_true")
    ap.add_argument("--agent", default="a")
    ap.add_argument("--file", type=Path, default=None)
    ap.add_argument("--grade-section", action="store_true")
    ap.add_argument("--log-fix", default=None, help="FIX_001")
    ap.add_argument("--fix-json", type=Path, default=None)
    ap.add_argument("--finalize", action="store_true")
    args = ap.parse_args()

    if args.init_attempt:
        p = init_attempt(args.init_attempt, args.reason)
        print(json.dumps({"ok": True, "dir": str(p.relative_to(ROOT))}))
        return 0
    if args.scan_all:
        r = scan_all(args.attempt)
        print(
            json.dumps(
                {
                    "ok": r["p0_gaps"] == 0,
                    "total_heuristic_gaps": r["total_heuristic_gaps"],
                    "p0": r["p0_gaps"],
                    "p1": r["p1_gaps"],
                    "max_clean": r["max_section_clean"],
                },
                indent=2,
            )
        )
        return 0 if r["p0_gaps"] == 0 else 1
    if args.selfcheck_integrity:
        r = offline_selfcheck_integrity(args.attempt)
        print(json.dumps({"ok": r["p0"] == 0, "p0": r["p0"], "p1": r["p1"], "ok_sections": r["ok_sections"]}, indent=2))
        return 0 if r["p0"] == 0 else 1
    if args.record_responses:
        if not args.section or not args.file:
            ap.error("--record-responses needs --section and --file")
        data = json.loads(args.file.read_text(encoding="utf-8"))
        p = record_agent_responses(args.attempt, args.section, args.agent, data)
        print(json.dumps({"ok": True, "path": str(p.relative_to(ROOT))}))
        return 0
    if args.grade_section:
        if not args.section:
            ap.error("--grade-section needs --section")
        r = grade_section_agents(args.attempt, args.section)
        print(json.dumps(r, indent=2, ensure_ascii=False)[:4000])
        return 0
    if args.log_fix:
        body = {}
        if args.fix_json:
            body = json.loads(args.fix_json.read_text(encoding="utf-8"))
        p = log_fix(args.attempt, args.log_fix, body)
        print(json.dumps({"ok": True, "path": str(p.relative_to(ROOT))}))
        return 0
    if args.finalize:
        r = finalize(args.attempt)
        print(json.dumps(r, indent=2))
        return 0 if r.get("clean_52") else 1

    ap.print_help()
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
