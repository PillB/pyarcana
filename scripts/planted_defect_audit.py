#!/usr/bin/env python3
"""Does the planted defect in an exercise actually change what the learner sees?

Most We Do exercises hand the learner a starter that is deliberately wrong -- "el starter
solo mira el upper fence (DEFECT de hábito)", "DEFECT: formulas invertidas" -- and a success
criterion that is the solution's printed output. That only teaches when running the broken
starter produces something DIFFERENT. When it does not, the learner runs the starter, sees the
expected output, matches it against the "Éxito" line and submits, having practised precisely
the habit the exercise names.

Two were found by hand while writing teaching blocks for the concepts they drill:

  S16-T3-B-E2  upper-fence-only mask on [1.0, 2.0, 3.0, 100.0]: the lower fence is -36.5, so
               no value can fall below it and the broken mask prints the solution's [100.0].
  S13-T1-B-E1  inverted precision/recall denominators on tp=8, fp=2, fn=2: both metrics are
               0.8, so swapping the denominators prints the same two numbers.

Neither is visible to any other gate. The snippets audit runs the SOLUTION and compares it
with the declared output; nothing ever runs the starter and asks whether it differs.

This walks every exercise whose own text declares a defect, runs the starter and the solution
under the pinned interpreter, and reports the ones whose stdout is identical.

    python3 scripts/planted_defect_audit.py [--section S16] [--out course-state/...]

Exercises that need input, hang, or fail to run are reported separately, not counted as
offenders: a starter that raises is visibly broken, which is the point.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "src/lib/course/sections"
VENV_PY = ROOT / ".venv-content/bin/python"
TIMEOUT_S = 25

#: The words the course uses to tell the learner the starter is wrong on purpose.
#:
#: Case-insensitive and word-bounded on purpose. A literal tuple of "DEFECT", "(bug)" and "bug)"
#: matched the loudest spelling and missed the rest: the sections write "DEFECT:", "defect;",
#: "Bug intencional" and "# Bug a corregir", so 18 S14 exercises alone were never checked and the
#: audit reported them as clean. `\b` keeps "debug" out.
DEFECT_MARKER_RE = re.compile(r"\b(?:defect(?:o|os)?|bugs?)\b|\bError:", re.IGNORECASE)


def declares_defect(block: str) -> bool:
    """Does this exercise tell the learner its starter is wrong on purpose?"""
    return bool(DEFECT_MARKER_RE.search(block))


def active_section_files() -> list[Path]:
    index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
    stems = re.findall(r"from '\./sections/([^']+)'", index)
    return [SECTIONS / f"{stem}.ts" for stem in stems]


def code_of(block: str, field: str) -> str | None:
    """The first `code` template literal after `field: {`, unescaped.

    Indentation varies between sections, so this does not try to find the closing brace of
    the object: it takes the next `code:` backtick literal, which is the one that belongs to
    this field.
    """
    start = block.find(f"{field}: {{")
    if start < 0:
        return None
    c = re.search(r"code:\s*`(.*?)`,?\n", block[start:], re.S)
    if not c:
        return None
    return c.group(1).replace("\\`", "`").replace("\\${", "${").replace("\\\\", "\\")


def exercises(path: Path) -> list[dict]:
    src = path.read_text(encoding="utf-8")
    out = []
    ids = list(re.finditer(r'id: "(S\d\d-T\d-[AB]-E\d)"', src))
    for i, m in enumerate(ids):
        end = ids[i + 1].start() if i + 1 < len(ids) else len(src)
        block = src[m.start() : end]
        starter = code_of(block, "starterCode")
        solution = code_of(block, "solutionCode")
        if not starter or not solution:
            continue
        if not declares_defect(block):
            continue
        out.append({"id": m.group(1), "file": path.name, "starter": starter, "solution": solution})
    return out


def contains_all_lines(starter_out: str, solution_out: str) -> bool:
    """Would the learner see the expected answer without fixing anything?

    Not string equality: a starter often prints an extra diagnostic line, and the success
    criterion the exercise states is the SOLUTION's lines ("Éxito: `[100.0]`"). So the defect
    is invisible when every line the solution prints already appears, in order, in what the
    broken starter prints -- S13-T1-B-E1 printed both correct metrics plus an `ok True` line,
    and exact comparison called that a difference.
    """
    want = [l for l in solution_out.splitlines() if l.strip()]
    if not want:
        return False
    have = [l for l in starter_out.splitlines() if l.strip()]
    i = 0
    for line in have:
        if i < len(want) and line == want[i]:
            i += 1
    return i == len(want)


def run(code: str, workdir: Path) -> tuple[int, str]:
    """Run one snippet in its own directory.

    The probe file used to be a single shared `.fixer/_defect_probe.py`. Two audits running at
    once — one per section, which is how the fan-out is meant to work — then wrote and unlinked
    the same path, so a process could execute another section's snippet or fail because its own
    probe had just been deleted, and both reports were wrong while looking clean.
    """
    tmp = workdir / "probe.py"
    tmp.write_text(code, encoding="utf-8")
    try:
        p = subprocess.run(
            [str(VENV_PY), str(tmp)],
            capture_output=True,
            text=True,
            timeout=TIMEOUT_S,
            cwd=workdir,
            stdin=subprocess.DEVNULL,
        )
        return p.returncode, p.stdout
    except subprocess.TimeoutExpired:
        return -1, ""
    finally:
        tmp.unlink(missing_ok=True)



def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--section", help="restrict to one section, e.g. S16")
    ap.add_argument("--out", default="course-state/planted_defect_report.json")
    args = ap.parse_args()

    (ROOT / ".fixer").mkdir(parents=True, exist_ok=True)
    if not VENV_PY.exists():
        print(f"missing {VENV_PY}: the audit needs the pinned content interpreter", file=sys.stderr)
        return 2

    rows = []
    for path in active_section_files():
        for ex in exercises(path):
            if args.section and not ex["id"].startswith(args.section + "-"):
                continue
            rows.append(ex)

    invisible, unrunnable, ok = [], [], 0
    # One temporary directory per invocation, removed at the end: snippets write files of their
    # own, and two concurrent audits must not share a working directory either.
    workdir = Path(tempfile.mkdtemp(prefix="planted-defect-", dir=ROOT / ".fixer"))
    for ex in rows:
        rc_s, out_s = run(ex["starter"], workdir)
        rc_v, out_v = run(ex["solution"], workdir)
        if rc_v != 0 or rc_s == -1:
            unrunnable.append({"id": ex["id"], "file": ex["file"], "starter_rc": rc_s, "solution_rc": rc_v})
            continue
        if rc_s == 0 and contains_all_lines(out_s, out_v):
            invisible.append(
                {
                    "id": ex["id"],
                    "file": ex["file"],
                    "solution_output": out_v.strip()[:400],
                    "starter_output": out_s.strip()[:400],
                }
            )
        else:
            ok += 1

    report = {
        "ok": not invisible,
        "checked": len(rows),
        "defect_visible": ok,
        "defect_invisible": invisible,
        "not_runnable": unrunnable,
    }
    shutil.rmtree(workdir, ignore_errors=True)
    out_path = ROOT / args.out
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(
        f"checked {len(rows)} exercises with a declared defect: "
        f"{ok} visible, {len(invisible)} invisible, {len(unrunnable)} not runnable"
    )
    for row in invisible:
        print(f"  INVISIBLE {row['id']} ({row['file']})")
    return 1 if invisible else 0


if __name__ == "__main__":
    raise SystemExit(main())
