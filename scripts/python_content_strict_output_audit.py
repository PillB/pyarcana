#!/usr/bin/env python3
"""Strict output audit: does every declared `output:` match what the code really prints?

`python_content_runtime_audit.py` answers a different question — does the snippet run — and
its output check is deliberately soft: it reads only the first line, and when that differs
it scrubs every number before calling the outputs "structurally similar". A probe changing
`3 tests OK` to `4 tests OK` passed. So it cannot tell a learner-facing wrong value from a
timestamp. This audit can.

How it keeps the tolerance for honest nondeterminism without the blindness:

* Every line is compared, not the first.
* Each snippet runs **twice**, under `PYTHONHASHSEED=0` and `PYTHONHASHSEED=1`. A line that
  differs between the two runs is *volatile* (set order, timings, addresses, tmp paths) and
  is compared only after scrubbing numbers, addresses and paths. Every other line must match
  exactly. Numbers are never scrubbed from a line the program prints the same way twice.
* An ellipsis (`...` or `…`) in the declared output is the author saying "elided": it matches
  any text, across lines.
* Snippets that exit non-zero, need argv, or are not Python are reported as `not_compared`
  with the reason — never counted as matches.

Must run under `.venv-content` (Python 3.12, pinned packages), like the runtime audit.

Usage:
  .venv-content/bin/python scripts/python_content_strict_output_audit.py [--only s46] [--file X.ts]
      [--json OUT] [--check]
`--check` exits 1 when any declared output mismatches.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import python_content_runtime_audit as rt  # noqa: E402

ROOT = rt.ROOT
DEFAULT_OUT = ROOT / "course-state/python_strict_output_audit.json"
SEEDS = ("0", "1")
ELLIPSIS = re.compile(r"\.\.\.|…")
#: Differences that belong to the host, not the lesson, applied to every line on both sides.
#: Each is narrow on purpose: the patch release of the pinned 3.12, and the file a traceback
#: names (a temp file here, the learner's own file for them). Nothing else is forgiven.
HOST_SPECIFIC = (
    (re.compile(r"\b3\.12\.\d+\b"), "3.12.<patch>"),
    (re.compile(r'File "[^"]+"'), 'File "<file>"'),
)


def run_with_seed(code: str, seed: str) -> dict:
    previous = os.environ.get("PYTHONHASHSEED")
    os.environ["PYTHONHASHSEED"] = seed
    try:
        return rt.run_python(code)
    finally:
        if previous is None:
            os.environ.pop("PYTHONHASHSEED", None)
        else:
            os.environ["PYTHONHASHSEED"] = previous


def scrub_volatile(line: str) -> str:
    line = re.sub(r"0x[0-9a-fA-F]+", "<addr>", line)
    line = re.sub(r"(/private)?/(var/folders|tmp)/\S+", "<path>", line)
    line = re.sub(r"\d{4}-\d{2}-\d{2}[T ][\d:.]+Z?", "<ts>", line)
    return re.sub(r"\d+(\.\d+)?", "<n>", line)


def host_neutral(text: str) -> str:
    for pattern, replacement in HOST_SPECIFIC:
        text = pattern.sub(replacement, text)
    return rt.normalize_out(text)


def lines_of(text: str) -> list[str]:
    return host_neutral(text).splitlines()


def ellipsis_match(expected: str, got: str) -> bool:
    parts = ELLIPSIS.split(host_neutral(expected))
    pattern = ".*?".join(re.escape(p) for p in parts)
    return re.fullmatch(pattern, host_neutral(got), flags=re.DOTALL) is not None


def compare(expected: str, run_a: str, run_b: str) -> dict:
    """Compare a declared output against two runs; volatile = differs between the runs."""
    if ELLIPSIS.search(expected):
        ok = ellipsis_match(expected, run_a)
        return {"verdict": "match_elided" if ok else "mismatch", **({} if ok else _first_diff(expected, run_a))}
    exp, got_a, got_b = lines_of(expected), lines_of(run_a), lines_of(run_b)
    if len(exp) != len(got_a):
        return {"verdict": "mismatch", "why": f"{len(exp)} declared lines, {len(got_a)} printed", **_first_diff(expected, run_a)}
    volatile = 0
    for i, (e, a) in enumerate(zip(exp, got_a)):
        if e == a:
            continue
        b = got_b[i] if i < len(got_b) else None
        if b != a and scrub_volatile(e) == scrub_volatile(a):
            volatile += 1
            continue
        return {"verdict": "mismatch", "line": i + 1, "declared": e[:160], "printed": a[:160]}
    return {"verdict": "match_volatile" if volatile else "match", "volatile_lines": volatile}


def _first_diff(expected: str, got: str) -> dict:
    exp, printed = lines_of(expected), lines_of(got)
    for i in range(max(len(exp), len(printed))):
        e = exp[i] if i < len(exp) else "<end>"
        p = printed[i] if i < len(printed) else "<end>"
        if e != p:
            return {"line": i + 1, "declared": e[:160], "printed": p[:160]}
    return {}


def skip_reason(art: dict) -> str | None:
    if not (art.get("expected_output") or "").strip():
        return "no_declared_output"
    if art["kind"] not in ("demo", "solution"):
        return f"kind:{art['kind']}"
    if all(not ln.strip() or ln.lstrip().startswith("#") for ln in art["code"].splitlines()):
        return "no_executable_code"
    if not rt.looks_python(art["code"], art.get("lang")):
        return f"non_python:{art.get('lang')}"
    if rt.needs_cli_argv(art["code"]):
        return "needs_cli_argv"
    return None


def audit_artifact(art: dict) -> dict:
    row = {"file": art["file"], "artifact_id": art["artifact_id"], "kind": art["kind"]}
    reason = skip_reason(art)
    if reason:
        return {**row, "verdict": "not_compared", "reason": reason}
    run_a, run_b = (run_with_seed(art["code"], s) for s in SEEDS)
    if run_a.get("timeout") or run_a["exit"] != 0:
        return {**row, "verdict": "not_compared", "reason": "timeout" if run_a.get("timeout") else "nonzero_exit"}
    return {**row, **compare(art["expected_output"], run_a["stdout"], run_b["stdout"])}


def target_files(only: str | None, file: str | None) -> list[Path]:
    if file:
        return [Path(file).resolve()]
    return rt.list_section_files(only, None)


def extract(path: Path) -> list[dict]:
    """rt.extract_artifacts names files relative to its ROOT; a probe copy lives elsewhere."""
    original_root = rt.ROOT
    if not path.is_relative_to(original_root):
        rt.ROOT = path.parent
    try:
        return rt.extract_artifacts(path)
    finally:
        rt.ROOT = original_root


def summarise(rows: list[dict]) -> dict:
    counts: dict[str, int] = {}
    for r in rows:
        counts[r["verdict"]] = counts.get(r["verdict"], 0) + 1
    return counts


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--only", default=None, help="substring of a section filename, e.g. s46")
    ap.add_argument("--file", default=None, help="audit this .ts file instead (probes)")
    ap.add_argument("--json", default=str(DEFAULT_OUT))
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    drift = rt.probe_version_drift()
    if drift.get("status") != "ok" or sys.version_info[:2] != (3, 12):
        print("REFUSED: interpreter or packages differ from the pins; run under .venv-content")
        print(json.dumps(drift, indent=2)[:800])
        return 2

    rows = [audit_artifact(a) for p in target_files(args.only, args.file) for a in extract(p)]
    counts = summarise(rows)
    mismatches = [r for r in rows if r["verdict"] == "mismatch"]
    Path(args.json).write_text(json.dumps({"counts": counts, "mismatches": mismatches, "rows": rows}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"strict output audit: {counts}")
    for m in mismatches[:40]:
        print(f"  MISMATCH {m['file']} {m['artifact_id']} line {m.get('line')}: declared {m.get('declared')!r} printed {m.get('printed')!r}")
    return 1 if (args.check and mismatches) else 0


if __name__ == "__main__":
    sys.exit(main())
