#!/usr/bin/env python3
"""The one verifier every fixer runner calls.

Each runner used to carry its own idea of "the gates", and they drifted. The Codex
review of PR #61 found that run_concepts.sh printed "PASSED all gates" after running
three of them - no snippet execution, no identifier gate - and checking the rest
showed run_redaction.sh ran no correctness gate at all. One verifier, called by all,
so "passed" means the same thing everywhere.

    gate.py snapshot SXX     # before a round: record what the section looks like now
    gate.py check SXX        # after: run every gate and compare against the snapshot

Absolute gates must pass outright. Regression gates compare against the snapshot,
because the course is not yet clean and "no worse than before this round" is the
honest bar for one section at a time.
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONTENT_PY = ROOT / ".venv-content/bin/python"


def sh(cmd: list[str], timeout: int = 1800) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=timeout)


#: Measures reported for context but never failed on. Prefix marks them in the snapshot.
INFORMATIONAL = "info:"


def strict_mismatches(tag: str) -> int | None:
    """Declared outputs in this section that differ from what the code prints, every line.

    The runtime audit below cannot see a wrong value; this can. None = could not run.
    """
    out = ROOT / f".fixer/{tag}.strict-output.json"
    r = sh([str(CONTENT_PY), "scripts/python_content_strict_output_audit.py",
            "--only", f"s{int(tag[1:]):02d}-", "--json", str(out)], 1200)
    if r.returncode != 0 or not out.exists():
        return None
    return json.loads(out.read_text(encoding="utf-8"))["counts"].get("mismatch", 0)


def measure(tag: str) -> dict:
    """What a round may not make worse, for this section and the course."""
    ev = sh(["npx", "tsx", "scripts/course_event_extractor.mts"])
    (ROOT / ".fixer").mkdir(exist_ok=True)
    (ROOT / ".fixer/events.json").write_text(ev.stdout, encoding="utf-8")

    sh(["python3", "scripts/concept_map.py"])
    cmap = json.loads((ROOT / "course-state/concept_map.json").read_text(encoding="utf-8"))
    never = sum(1 for c in cmap.values() if c["depth"] == "L0")
    surprising = sum(1 for c in cmap.values() if c["depth"] != "L0" and c["surprising_uses"])
    here = sum(1 for c in cmap.values() for u in c["surprising_uses"] if u["section"] == tag)

    sh(["python3", "scripts/prose_quality_audit.py", tag])
    prose = json.loads((ROOT / "course-state/prose_quality_report.json").read_text(encoding="utf-8")).get(tag, {})

    sh(["python3", "scripts/code_switching_audit.py", tag])
    cs = json.loads((ROOT / "course-state/code_switching_report.json").read_text(encoding="utf-8")).get(tag, {})

    sh(["python3", "scripts/first_use_all_audit.py"])
    fu = json.loads((ROOT / "course-state/first_use_all_report.json").read_text(encoding="utf-8"))

    # D2 is scoped to this section and measured as a regression. Course-wide it was an
    # absolute gate, which stayed red on every round because S03, S07 and S09 carry known
    # debt - so it said nothing about the section actually being changed.
    sh(["python3", "scripts/synthetic_identifier_audit.py"])
    ids = json.loads((ROOT / "course-state/synthetic_identifier_report.json").read_text(encoding="utf-8"))
    num = int(tag[1:])
    ids_here = sum(1 for f in ids.get("findings", []) if f"/s{num:02d}-" in f["file"])

    return {
        "identifier_values_in_section": ids_here,
        "never_explained": never,
        "used_before_explained": surprising,
        "surprising_uses_in_section": here,
        "run_on_sentences": prose.get("run_on_sentences"),
        # Writing rule B5 as it is written: a noun doing a verb's job. The raw -ción/-miento
        # count stays visible below but does not gate - it rejected correct translations.
        "b5_nominal_constructions_per_100_sentences": prose.get("b5_per_100_sentences"),
        # The gated measure is a ratio over the whole section, so a sentence-count shift can
        # move it without a word changing. The raw count says which happened.
        INFORMATIONAL + "b5_nominal_constructions": prose.get("b5_nominal_constructions"),
        "strict_output_mismatches_in_section": strict_mismatches(tag),
        "avoidable_english_per_1000": cs.get("avoidable_english_per_1000"),
        "first_use_issues": sum(fu.get("issue_counts", {}).values()),
        INFORMATIONAL + "nominalisations_per_100w": prose.get("nominalisations_per_100w"),
    }


def absolute_gate(name: str, cmd: list[str], failed: list[str], timeout: int = 1800) -> None:
    r = sh(cmd, timeout)
    ok = r.returncode == 0
    print(f"  {'PASS' if ok else 'FAIL'} {name}")
    if not ok:
        failed.append(name)
        tail = (r.stdout + r.stderr).strip().splitlines()[-12:]
        print("       " + "\n       ".join(tail))


def snippets_gate(failed: list[str]) -> None:
    sh([str(CONTENT_PY), "scripts/python_content_runtime_audit.py", "--workers", "4"], 2400)
    try:
        rep = json.loads((ROOT / "course-state/python_runtime_audit_report.json").read_text(encoding="utf-8"))
        env = rep.get("environment_matches_pins")
        env = env.get("status") if isinstance(env, dict) else env
        ok = rep["totals"]["fail"] == 0 and env == "ok"
        # Honest label. The runtime audit compares only the FIRST output line, then
        # scrubs every integer before calling outputs "structurally similar" - so a
        # wrong number passes. This proves snippets run and their first line has the
        # right shape; values are checked by strict_output_mismatches_in_section.
        print(f"  {'PASS' if ok else 'FAIL'} snippets run; first output line shape matches "
              f"(fail={rep['totals']['fail']}, pins={env}) [values checked by the strict measure]")
        if not ok:
            failed.append("python-content")
            for f in rep.get("failures", [])[:8]:
                print(f"       [{f['severity']}] {f['section_id']} {f['artifact_id']} -> {f['reason']}")
    except Exception as e:  # a gate that could not run did not pass
        print(f"  FAIL lesson snippets: report unreadable ({e})")
        failed.append("python-content")


def regression_verdict(key: str, b, a) -> str:
    """'info', 'broken', 'unmeasurable', 'worse' or 'ok'. Lower is better for every measure."""
    if key.startswith(INFORMATIONAL):
        return "info"
    if a is None and b is not None:
        return "broken"  # measurable before the round, not after: the instrument broke
    if b is None or a is None:
        return "unmeasurable"
    return "worse" if a > b + (0.05 if isinstance(b, float) else 0) else "ok"


def applied_ratio(tag: str) -> str:
    """How much of the round actually reached the file, for printing next to a failure.

    S28's b5 measure moved while 23 of its 34 patches were refused for stale anchors, and the
    patches that would explain the move were among the refused. Without this line a reader
    cannot tell "codex wrote worse Spanish" from "almost nothing was applied and the number
    drifted", and the two need opposite responses.
    """
    for suffix in ("s", "r", "k", ""):
        p = ROOT / f".fixer/{tag}{suffix}.apply.json"
        if not p.exists():
            continue
        try:
            r = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            return ""
        offered = r.get("patches_offered") or 0
        if not offered:
            return ""
        back = len(r.get("rolled_back_patches") or [])
        note = f", {back} rolled back" if back else ""
        return (f"       of {offered} patches offered: {r.get('applied', 0)} applied, "
                f"{r.get('rejected', 0)} refused{note} ({p.name})")
    return ""


def regression_gate(before: dict, after: dict, failed: list[str], tag: str = "") -> None:
    ratio_note = applied_ratio(tag) if tag else ""
    shown = False
    for key in before:
        b, a = before.get(key), after.get(key)
        verdict = regression_verdict(key, b, a)
        if verdict == "info":
            print(f"  info {key[len(INFORMATIONAL):]}: {b} -> {a} (reported, not gated)")
        elif verdict == "broken":
            print(f"  FAIL {key}: measurable before ({b}), not after")
        elif verdict == "unmeasurable":
            print(f"  ---- {key}: not measurable ({b} -> {a})")
        else:
            print(f"  {'FAIL' if verdict == 'worse' else 'PASS'} no regression in {key}: {b} -> {a}")
        if verdict in ("broken", "worse"):
            failed.append(key)
            if ratio_note and not shown:
                print(ratio_note)
                shown = True


def check(tag: str) -> int:
    before_path = ROOT / f".fixer/{tag}.gate-before.json"
    if not before_path.exists():
        print(f"  FAIL no snapshot for {tag}; run `gate.py snapshot {tag}` before the round")
        return 1
    before = json.loads(before_path.read_text(encoding="utf-8"))
    failed: list[str] = []
    absolute_gate("test:v3", ["npm", "run", "test:v3"], failed)
    absolute_gate("adversarial (node)", ["npm", "run", "test:adversarial:node"], failed)
    absolute_gate("adversarial (py)", ["npm", "run", "test:adversarial:py"], failed)
    snippets_gate(failed)
    after = measure(tag)
    regression_gate(before, after, failed, tag)
    (ROOT / f".fixer/{tag}.gate-after.json").write_text(
        json.dumps({"before": before, "after": after, "failed": failed}, indent=1), encoding="utf-8")
    if failed:
        print(f"  => {tag} FAILED: {', '.join(failed)}")
        return 1
    print(f"  => {tag} passed every gate")
    return 0


def main() -> int:
    mode, tag = sys.argv[1], sys.argv[2]
    if mode == "snapshot":
        m = measure(tag)
        (ROOT / f".fixer/{tag}.gate-before.json").write_text(json.dumps(m, indent=1), encoding="utf-8")
        print(f"  snapshot {tag}: {m}")
        return 0
    if mode == "check":
        return check(tag)
    raise SystemExit("usage: gate.py snapshot|check SXX")


if __name__ == "__main__":
    raise SystemExit(main())
