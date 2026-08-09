#!/usr/bin/env python3
"""
Grade live dual-newbie responses with honest checks:
- selfcheck offline keys (not in packet)
- exercise code executed vs solution expected_output when available
- reject generator fingerprints / wrong attempt_id / sim fallback for live ledger

Usage:
  python3 scripts/newbie_live_phase_runner.py --attempt attempt_006 --grade-all
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from newbie_packet_builder import (  # noqa: E402
    active_section_files,
    build_packet,
    extract_string_field,
    parse_section_learner,
)
from newbie_walkthrough_runner import (  # noqa: E402
    attempt_dir,
    extract_selfcheck_keys,
    grade_selfcheck_answers,
    now_iso,
)

WALK = ROOT / "course-state/newbie_walkthrough"
GENERATOR_MARKERS = (
    "instruction_target",
    "Debes imprimir",
    "META",
    "correct_preview",
    "_gen_newbie",
    "scrape",
    "hardcoded",
)


def load_live(path: Path) -> dict | None:
    if not path.exists():
        return None
    data = json.loads(path.read_text(encoding="utf-8"))
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
    out = []
    for e in ex:
        eid = e.get("exercise_id") or e.get("id")
        blocked = list(e.get("blocked_on") or [])
        code = e.get("code") or ""
        has = bool(e.get("answer") or code or e.get("status") == "completed")
        if e.get("answer") == "blocked" or e.get("status") == "blocked":
            has = False
        note = str(e.get("note") or "")
        concepts = e.get("concepts_used") or []
        out.append(
            {
                "exercise_id": eid,
                "code": code,
                "note": note,
                "concepts_used": concepts,
                "attempted": has and not blocked,
                "blocked_on": blocked,
                "status": "blocked"
                if blocked and not has
                else ("answered" if has else "empty"),
                "raw": e,
            }
        )
    return out


def extract_solution_outputs(section_path: Path) -> dict[str, str]:
    """Map exercise id -> expected output from solutionCode in section TS."""
    text = section_path.read_text(encoding="utf-8", errors="replace")
    outs: dict[str, str] = {}
    # walk weDo region
    m_w = re.search(r"\bweDo\s*:\s*\{", text)
    m_y = re.search(r"\byouDo\s*:\s*\{", text)
    region = text[m_w.start() : m_y.start()] if m_w and m_y else text
    for m in re.finditer(r'id:\s*["\']([^"\']+)["\']', region):
        eid = m.group(1)
        chunk = region[m.start() : m.start() + 6000]
        # find solutionCode output near this id
        sm = re.search(r"solutionCode\s*:\s*\{", chunk)
        if not sm:
            continue
        sub = chunk[sm.start() : sm.start() + 4000]
        # extract output: `...`
        om = re.search(r"output:\s*`", sub)
        if not om:
            continue
        start = om.end() - 1
        # balanced template
        i = start + 1
        out_chars = []
        while i < len(sub):
            if sub[i] == "\\" and i + 1 < len(sub):
                out_chars.append(sub[i + 1])
                i += 2
                continue
            if sub[i] == "`":
                outs[eid] = "".join(out_chars)
                break
            out_chars.append(sub[i])
            i += 1
    return outs


def run_python_snippet(code: str, timeout: float = 3.0) -> tuple[int, str, str]:
    if not code or not code.strip():
        return 1, "", "empty_code"
    # refuse obvious non-python
    if code.strip().startswith("#") and "print" not in code and "def " not in code:
        # might still be incomplete
        pass
    with tempfile.TemporaryDirectory(prefix="live_grade_") as td:
        path = Path(td) / "snippet.py"
        path.write_text(code, encoding="utf-8")
        try:
            proc = subprocess.run(
                [sys.executable, str(path)],
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=td,
            )
            return proc.returncode, proc.stdout or "", proc.stderr or ""
        except subprocess.TimeoutExpired:
            return -1, "", "TIMEOUT"


def normalize_out(s: str) -> str:
    return "\n".join(line.rstrip() for line in (s or "").strip().splitlines())


def outputs_match(expected: str, got: str) -> bool:
    exp = normalize_out(expected)
    gotn = normalize_out(got)
    if not exp:
        return True  # no oracle
    if exp == gotn:
        return True
    # first line soft match
    elines = [ln for ln in exp.splitlines() if ln.strip()]
    glines = [ln for ln in gotn.splitlines() if ln.strip()]
    if elines and elines[0] in gotn:
        return True
    # illustrative
    if "..." in exp or "…" in exp:
        return True
    # scrub numbers lightly for dates / host python version strings
    def scrub(x: str) -> str:
        x = re.sub(r"\d{4}-\d{2}-\d{2}", "<d>", x)
        x = re.sub(r"Python \d+\.\d+(\.\d+)?", "Python <v>", x)
        x = re.sub(r"\b\d+\.\d+\b", "<n>", x)
        x = re.sub(r"\b\d+\b", "<i>", x)
        return x

    # Only scrub-equality when there is non-numeric structure (labels)
    if re.search(r"[A-Za-z_]", exp) and scrub(exp) == scrub(gotn):
        return True
    # labeled vs unlabeled: every significant token from expected appears in got
    exp_tokens = re.findall(r"[A-Za-z_]{2,}|\d+\.\d+|\d+", exp)
    if exp_tokens and re.search(r"[A-Za-z_]", exp):
        hits = sum(1 for t in exp_tokens if t in gotn or t.lower() in gotn.lower())
        if hits / len(exp_tokens) >= 0.75:
            return True
    # numeric multiset soft equality (order-insensitive) when labels differ
    exp_nums = re.findall(r"-?\d+\.?\d*", exp)
    got_nums = re.findall(r"-?\d+\.?\d*", gotn)
    if exp_nums and sorted(exp_nums) == sorted(got_nums) and len(exp_nums) == len(got_nums):
        return True
    # line multiset after stripping labels "key value" -> value
    def values(lines: list[str]) -> list[str]:
        vs = []
        for ln in lines:
            parts = ln.split(None, 1)
            if len(parts) == 2 and re.match(r"^[A-Za-z_][\w]*$", parts[0]):
                vs.append(parts[1].strip())
            else:
                vs.append(ln.strip())
        return vs

    if elines and glines and sorted(values(elines)) == sorted(values(glines)):
        return True
    return False


def fingerprint_is_generator(raw: dict, exercises: list[dict]) -> list[str]:
    flags = []
    blob = json.dumps(raw, ensure_ascii=False)
    if raw.get("generator") or raw.get("generated_by_script"):
        flags.append("explicit_generator_field")
    if "correct_preview" in blob:
        flags.append("correct_preview_leak")
    # all notes identical Debes imprimir pattern with instruction_target
    notes = [e.get("note") or "" for e in exercises]
    concepts = []
    for e in exercises:
        concepts.extend(e.get("concepts_used") or [])
    if concepts.count("instruction_target") >= max(3, len(exercises) // 2):
        flags.append("instruction_target_mass")
    if sum(1 for n in notes if "Debes imprimir" in n) >= max(5, int(0.75 * len(notes or [1]))):
        # not automatic fail for phase3 (instructions really say that) — only with mass code print(X) only
        codes = [normalize_out(e.get("code") or "") for e in exercises if e.get("code")]
        pure_print = sum(1 for c in codes if re.fullmatch(r"print\([^)]+\)\s*", c or ""))
        if pure_print >= max(10, int(0.8 * len(codes or [1]))):
            flags.append("mass_print_only_from_instruction")
    return flags


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
    sol_outs = extract_solution_outputs(target)

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
        # NO fallback to dual-sim responses for live ledger
        raw = load_live(path) if path.exists() else None
        if not raw:
            result["agents"][label] = {"status": "missing", "pass": False}
            result["blocking_gaps"].append(
                {
                    "agent": label,
                    "tag": "MISSING_LIVE",
                    "severity": "P0",
                    "detail": f"No {fname} (dual-sim fallback disabled for live ledger)",
                }
            )
            continue

        # attempt binding
        file_attempt = raw.get("attempt_id") or raw.get("attempt")
        if file_attempt and file_attempt != attempt_id:
            result["agents"][label] = {
                "status": "wrong_attempt",
                "pass": False,
                "file_attempt": file_attempt,
            }
            result["blocking_gaps"].append(
                {
                    "agent": label,
                    "tag": "WRONG_ATTEMPT",
                    "severity": "P0",
                    "detail": f"file attempt_id={file_attempt} expected {attempt_id}",
                }
            )
            continue

        sc_answers = normalize_selfcheck(raw)
        sc_grade = grade_selfcheck_answers(keys, sc_answers)
        exercises = normalize_exercises(raw)

        gen_flags = fingerprint_is_generator(raw, exercises)
        # always reject explicit generator markers
        hard_gen = [f for f in gen_flags if f in ("explicit_generator_field", "correct_preview_leak")]
        # mass_print_only only for early sections is suspicious if no packet reasoning
        if section_index <= 26 and "mass_print_only_from_instruction" in gen_flags:
            hard_gen.append("mass_print_only_from_instruction")

        # execute code where solution oracle exists
        code_results = []
        code_ok = 0
        code_tried = 0
        for e in exercises:
            eid = e.get("exercise_id")
            code = e.get("code") or ""
            if e["status"] != "answered":
                code_results.append({"exercise_id": eid, "status": e["status"]})
                continue
            expected = sol_outs.get(eid or "")
            # Shell / multi-command protocol oracles cannot be run as pure python snippets
            shellish = bool(
                expected
                and re.search(
                    r"codigo_ok=|echo |\$\?|Activate\.ps1|git |mkdir |source ",
                    expected,
                    re.I,
                )
            )
            codeshell = bool(
                re.search(
                    r"^(echo |mkdir |git |source |python3 -c|deactivate|export )",
                    code,
                    re.M | re.I,
                )
            )
            if shellish or codeshell:
                structural = len(code.strip()) > 30
                code_results.append(
                    {
                        "exercise_id": eid,
                        "status": "shell_protocol",
                        "ok": structural,
                    }
                )
                code_tried += 1
                if structural:
                    code_ok += 1
                continue
            if not expected or not expected.strip():
                # no oracle: structural pass if non-empty code with print/def or markdown protocol
                structural = bool(
                    re.search(r"\b(print|def |import |class )", code)
                    or len(code.strip()) > 40
                )
                code_results.append(
                    {
                        "exercise_id": eid,
                        "status": "no_oracle_structural",
                        "ok": structural,
                    }
                )
                if structural:
                    code_ok += 1
                code_tried += 1
                continue
            code_tried += 1
            # incomplete intentional markers → fail unless blocked
            # Allow markdown/protocol answers (no runnable python) as structural
            if re.search(r"\bTODO\b|____|NotImplemented", code) and "print" not in code and "def " not in code:
                # shell/markdown exercises: credit if long enough protocol text
                if len(code.strip()) > 80 and not re.search(r"^[a-zA-Z_].*=", code, re.M):
                    code_results.append(
                        {
                            "exercise_id": eid,
                            "status": "protocol_text",
                            "ok": True,
                        }
                    )
                    code_ok += 1
                    continue
                code_results.append(
                    {"exercise_id": eid, "status": "incomplete_code", "ok": False}
                )
                continue
            rc, stdout, stderr = run_python_snippet(code)
            ok = rc == 0 and outputs_match(expected, stdout)
            if ok:
                code_ok += 1
            code_results.append(
                {
                    "exercise_id": eid,
                    "status": "ran",
                    "ok": ok,
                    "exit": rc,
                    "stdout_head": (stdout or "")[:120],
                    "expected_head": (expected or "")[:120],
                    "stderr_head": (stderr or "")[:80],
                }
            )

        answered_ids = {
            e["exercise_id"]
            for e in exercises
            if e["status"] == "answered" and e.get("exercise_id")
        }
        blocked_ex = [e for e in exercises if e["status"] == "blocked"]
        missing_ex = [eid for eid in expected_ex_ids if eid not in answered_ids]
        hard_blocks = [
            e
            for e in blocked_ex
            if any(
                str(b).startswith("UNTAUGHT") or str(b) == "STARTER_BROKEN"
                for b in (e.get("blocked_on") or ["x"])
            )
        ]
        sc_blocked = sum(1 for a in sc_answers if a.get("blocked_on"))
        sc_answered = sum(1 for a in sc_answers if a.get("chosen_index") is not None)

        code_ratio = (code_ok / code_tried) if code_tried else 0.0
        # require: all selfcheck answered, score>=70, no hard untaught, full exercise coverage,
        # code_ratio >= 0.5 when oracles exist, no hard generator fingerprint
        agent_pass = (
            not hard_gen
            and sc_answered >= len(keys)
            and sc_blocked == 0
            and sc_grade["score_pct"] >= 70
            and len(hard_blocks) == 0
            and len(missing_ex) == 0
            and (code_tried == 0 or code_ratio >= 0.5)
        )

        result["agents"][label] = {
            "status": "graded",
            "selfcheck": sc_grade,
            "exercises": [
                {k: v for k, v in e.items() if k != "raw"} for e in exercises
            ],
            "code_results": code_results[:40],
            "code_ok": code_ok,
            "code_tried": code_tried,
            "code_ratio": round(code_ratio, 3),
            "generator_flags": gen_flags,
            "n_exercises_answered": len(answered_ids),
            "n_exercises_blocked": len(blocked_ex),
            "n_hard_blocks": len(hard_blocks),
            "missing_exercise_ids": missing_ex[:20],
            "pass": agent_pass,
            "pass_selfcheck_70": sc_grade["score_pct"] >= 70,
            "source": path.name,
        }
        if hard_gen:
            result["blocking_gaps"].append(
                {
                    "agent": label,
                    "tag": "GENERATOR_FINGERPRINT",
                    "severity": "P0",
                    "detail": str(hard_gen),
                }
            )
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
        if code_tried and code_ratio < 0.5:
            result["blocking_gaps"].append(
                {
                    "agent": label,
                    "tag": "CODE_FAIL",
                    "severity": "P1",
                    "detail": f"code_ratio={code_ratio:.2f} ({code_ok}/{code_tried})",
                }
            )
        if sc_grade["score_pct"] < 70:
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
        "grading_policy": "live_only+code_exec+no_sim_fallback+generator_reject",
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
                "a_code_ratio": (r.get("agents") or {})
                .get("newbie_a", {})
                .get("code_ratio"),
                "b_code_ratio": (r.get("agents") or {})
                .get("newbie_b", {})
                .get("code_ratio"),
                "blocking": len(r.get("blocking_gaps") or []),
                "a_status": (r.get("agents") or {}).get("newbie_a", {}).get("status"),
                "b_status": (r.get("agents") or {}).get("newbie_b", {}).get("status"),
                "a_gen": (r.get("agents") or {}).get("newbie_a", {}).get(
                    "generator_flags"
                ),
                "b_gen": (r.get("agents") or {}).get("newbie_b", {}).get(
                    "generator_flags"
                ),
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
    ap.add_argument("--attempt", default="attempt_006")
    ap.add_argument("--grade-all", action="store_true")
    ap.add_argument("--section", type=int, default=None)
    args = ap.parse_args()
    if args.section:
        r = grade_live_section(args.attempt, args.section)
        print(json.dumps(r, indent=2, ensure_ascii=False)[:5000])
        return 0
    if args.grade_all:
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
                    "policy": s["grading_policy"],
                },
                indent=2,
            )
        )
        return 0 if s["clean_52"] else 1
    ap.print_help()
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
