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

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
import report_lock  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
CONTENT_PY = ROOT / ".venv-content/bin/python"


def sh(cmd: list[str], timeout: int = 1800) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=timeout)


#: Measures reported for context but never failed on. Prefix marks them in the snapshot.
INFORMATIONAL = "info:"


class MeasurementFailed(RuntimeError):
    """An instrument that could not run measured nothing, and a gate built on it did not pass."""


def fresh_report(cmd: list[str], report: Path, ok_codes: tuple[int, ...] = (0,),
                 timeout: int = 1800) -> dict:
    """Run an audit and return the report it wrote on *this* run.

    The reports are tracked files that survive between rounds. Reading one after an unchecked
    run meant a crashed audit left last round's JSON in place and `snapshot` or `check` compared
    stale values - reporting a pass exactly when the instrument could not run. An audit that
    exits with findings (first_use_all and synthetic_identifier return 1 after writing) is
    fine; one that exits otherwise, or leaves its report untouched, fails the measurement.
    """
    before = report.stat().st_mtime_ns if report.exists() else None
    r = sh(cmd, timeout)
    rewritten = report.exists() and report.stat().st_mtime_ns != before
    if r.returncode not in ok_codes or not rewritten:
        why = (f"exited {r.returncode}" if r.returncode not in ok_codes
               else "finished without rewriting its report")
        tail = " | ".join((r.stdout + r.stderr).strip().splitlines()[-4:])
        raise MeasurementFailed(
            f"{' '.join(cmd)} {why}, so {report.relative_to(ROOT)} would be stale. {tail}".strip())
    try:
        return json.loads(report.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise MeasurementFailed(f"{report.relative_to(ROOT)} is not valid JSON after "
                                f"{' '.join(cmd)}: {e}") from e


def strict_mismatches(tag: str) -> int | None:
    """Declared outputs in this section that differ from what the code prints, every line.

    The runtime audit below cannot see a wrong value; this can. None = could not run.
    """
    out = ROOT / f".fixer/{tag}.strict-output.json"
    # A report left by a previous round would otherwise satisfy `out.exists()` below.
    out.unlink(missing_ok=True)
    r = sh([str(CONTENT_PY), "scripts/python_content_strict_output_audit.py",
            "--only", f"s{int(tag[1:]):02d}-", "--json", str(out)], 1200)
    if r.returncode != 0 or not out.exists():
        return None
    return json.loads(out.read_text(encoding="utf-8"))["counts"].get("mismatch", 0)


def measure(tag: str) -> dict:
    """What a round may not make worse, for this section and the course."""
    ev = sh(["npx", "tsx", "scripts/course_event_extractor.mts"])
    # Written only if the extractor succeeded and produced JSON: an empty or partial stdout
    # written here became the input to every measure below.
    if ev.returncode != 0:
        raise MeasurementFailed(f"course_event_extractor.mts exited {ev.returncode}: "
                                + " | ".join(ev.stderr.strip().splitlines()[-4:]))
    try:
        json.loads(ev.stdout)
    except json.JSONDecodeError as e:
        raise MeasurementFailed(f"course_event_extractor.mts printed invalid JSON: {e}") from e
    (ROOT / ".fixer").mkdir(exist_ok=True)
    (ROOT / ".fixer/events.json").write_text(ev.stdout, encoding="utf-8")

    cmap = fresh_report(["python3", "scripts/concept_map.py"], ROOT / "course-state/concept_map.json")
    never = sum(1 for c in cmap.values() if c["depth"] == "L0")
    # Concepts explained somewhere but used before that. Reported, not gated: it and `never`
    # count two halves of one population, so teaching a never-explained concept moves it from
    # the first to the second and reads as a regression on a round that improved the course.
    # S17's concepts round taught `reshape`, whose only remaining uses were its own section's
    # tagline and jobRelevance: never 14 -> 13, this 40 -> 41, and a round that removed 14
    # surprising uses course-wide was restored. Any concept its own tagline names was
    # structurally impossible to teach.
    surprising = sum(1 for c in cmap.values() if c["depth"] != "L0" and c["surprising_uses"])
    # What that pair was reaching for, counted as the harm rather than as buckets: how many
    # times in the whole course a learner meets a word before anything explains it. It is
    # stricter than the concept count it replaces - every use counts, not just the first -
    # and it still may not rise. 420 -> 406 on the round described above.
    surprising_total = sum(len(c["surprising_uses"]) for c in cmap.values())
    here = sum(1 for c in cmap.values() for u in c["surprising_uses"] if u["section"] == tag)

    prose = fresh_report(["python3", "scripts/prose_quality_audit.py", tag],
                         ROOT / "course-state/prose_quality_report.json").get(tag, {})

    cs = fresh_report(["python3", "scripts/code_switching_audit.py", tag],
                      ROOT / "course-state/code_switching_report.json").get(tag, {})

    # first_use_all and synthetic_identifier exit 1 when they find something, after writing.
    fu = fresh_report(["python3", "scripts/first_use_all_audit.py"],
                      ROOT / "course-state/first_use_all_report.json", ok_codes=(0, 1))

    # D2 is scoped to this section and measured as a regression. Course-wide it was an
    # absolute gate, which stayed red on every round because S03, S07 and S09 carry known
    # debt - so it said nothing about the section actually being changed.
    ids = fresh_report(["python3", "scripts/synthetic_identifier_audit.py"],
                       ROOT / "course-state/synthetic_identifier_report.json", ok_codes=(0, 1))
    num = int(tag[1:])
    ids_here = sum(1 for f in ids.get("findings", []) if f"/s{num:02d}-" in f["file"])

    return {
        "identifier_values_in_section": ids_here,
        "never_explained": never,
        "surprising_uses_course_wide": surprising_total,
        f"{INFORMATIONAL}used_before_explained": surprising,
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
    report = ROOT / "course-state/python_runtime_audit_report.json"
    try:
        # A stale report from the last round said nothing about this one, however green.
        rep = fresh_report([str(CONTENT_PY), "scripts/python_content_runtime_audit.py", "--workers", "4"],
                           report, ok_codes=(0, 1), timeout=2400)
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
    try:
        after = measure(tag)
    except MeasurementFailed as e:
        print(f"  FAIL measurement: {e}")
        print(f"  => {tag} FAILED: the regression measures could not run, so nothing was compared")
        return 1
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
    # Everything below writes and then reads the shared reports under course-state/, so it
    # runs as the only writer. Holding the lock here rather than inside each audit keeps the
    # audits this gate launches from refusing themselves: they inherit the token.
    with report_lock.held_by_this_run():
        return _run(mode, tag)


def _run(mode: str, tag: str) -> int:
    if mode == "snapshot":
        try:
            m = measure(tag)
        except MeasurementFailed as e:
            # A snapshot of stale numbers would make the round's `check` compare against them.
            print(f"  FAIL snapshot {tag}: {e}")
            return 1
        (ROOT / f".fixer/{tag}.gate-before.json").write_text(json.dumps(m, indent=1), encoding="utf-8")
        print(f"  snapshot {tag}: {m}")
        return 0
    if mode == "check":
        return check(tag)
    raise SystemExit("usage: gate.py snapshot|check SXX")


if __name__ == "__main__":
    raise SystemExit(main())
