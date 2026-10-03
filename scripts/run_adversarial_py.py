#!/usr/bin/env python3
"""Run the Python test suites so that a test that did not run cannot read as one that passed.

`python3 -m unittest discover` exits 0 when a file collects no tests, when a test skips, and
when a test rewrites a tracked file. On 2026-10-03 all three were hiding real gaps: 17 of 70
adversarial files collected nothing and had never run, 6 tests skipped in every CI run, and
every run rewrote course-state/capstones/CP-N4-C/run_state.json. This runner fails on each,
and refuses to report at all under an interpreter CI does not use.

  python3 scripts/run_adversarial_py.py                          # every suite (npm, CI, gate)
  python3 scripts/run_adversarial_py.py --suite tests/adversarial

Each suite runs in its own process, so test files with the same module name in different
directories cannot shadow each other. A skip or expected failure passes only if
tests/adversarial/skip_allowlist.json names it, says why, and says where the test runs instead.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import unittest
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ALLOWLIST = ROOT / "tests/adversarial/skip_allowlist.json"
SUITES = ("tests/adversarial", "tests")
PATTERN = "test_*.py"
#: CI's interpreter. Under 3.9 the course's 3.12 syntax and pinned outputs read as broken, so
#: a pass or a fail there says nothing about CI.
MIN_PYTHON = (3, 12)


def tree_state() -> dict[str, tuple[int, int]]:
    """Size and mtime of every tracked file and every untracked, unignored one.

    mtime rather than content, so a byte-identical rewrite still shows: a test that rewrites a
    committed artefact with the same bytes is re-baselining it without anyone looking.
    """
    listing = subprocess.run(
        ["git", "ls-files", "-z", "--cached", "--others", "--exclude-standard"],
        cwd=ROOT, capture_output=True, check=True,
    ).stdout.decode("utf-8", "surrogateescape")
    state = {}
    for rel in filter(None, listing.split("\0")):
        try:
            st = os.lstat(ROOT / rel)
            state[rel] = (st.st_size, st.st_mtime_ns)
        except FileNotFoundError:
            state[rel] = (-1, -1)
    return state


def flatten(suite: unittest.TestSuite) -> list[unittest.TestCase]:
    out = []
    for item in suite:
        out.extend(flatten(item) if isinstance(item, unittest.TestSuite) else [item])
    return out


def empty_files(start: Path, tests: list[unittest.TestCase]) -> list[str]:
    """Test files that collected nothing. Discovery collects TestCase classes only, so a
    pytest-style function or a `main()` script imports cleanly, adds no test, and never runs."""
    collected = Counter(t.id().split(".")[0] for t in tests)
    return [p.name for p in sorted(start.glob(PATTERN)) if collected[p.stem] == 0]


def base_id(test: unittest.TestCase) -> str:
    """A skip inside `subTest` is reported on the sub-test; allow it by its parent test."""
    return getattr(test, "test_case", test).id()


def allowed(entries: list[dict], suite: str, kind: str, test_id: str, reason: str) -> bool:
    return any(
        e["suite"] == suite and e["kind"] == kind and e["test"] == test_id
        and e["reason_contains"] in reason
        for e in entries
    )


def unexplained(result: unittest.TestResult, suite: str, entries: list[dict]) -> list[str]:
    """Every skip and expected failure the allowlist does not account for."""
    found = [("skip", base_id(t), reason) for t, reason in result.skipped]
    found += [("expected_failure", base_id(t), "") for t, _ in result.expectedFailures]
    return [f"{kind} {tid}: {reason}" for kind, tid, reason in found
            if not allowed(entries, suite, kind, tid, reason)]


def run_suite(suite: str) -> int:
    start = ROOT / suite
    # `python -m unittest` puts the working directory first on sys.path, and two test files
    # import `scripts` and `tests.adversarial` as packages on the strength of it. Do the same,
    # in place of this script's own directory, so nothing here is importable that is not there.
    sys.path[0] = str(ROOT)
    loaded = unittest.TestLoader().discover(str(start), pattern=PATTERN, top_level_dir=str(start))
    # Counted before running: a suite drops each test (sets it to None) once it has run.
    problems = [f"collects no tests: {suite}/{name}"
                for name in empty_files(start, flatten(loaded))]
    result = unittest.TextTestRunner(verbosity=2).run(loaded)
    entries = json.loads(ALLOWLIST.read_text(encoding="utf-8"))["allowed"]
    problems += unexplained(result, suite, entries)
    for line in problems:
        print(f"FAIL {line}", file=sys.stderr)
    return 0 if result.wasSuccessful() and not problems else 1


def run_all() -> int:
    before = tree_state()
    codes = [subprocess.run([sys.executable, __file__, "--suite", s], cwd=ROOT).returncode
             for s in SUITES]
    after = tree_state()
    written = sorted(p for p in before.keys() | after.keys() if before.get(p) != after.get(p))
    for rel in written:
        print(f"FAIL the run wrote into the tree: {rel}", file=sys.stderr)
    failed = [s for s, code in zip(SUITES, codes) if code]
    print(f"\nsuites failed: {failed or 'none'}; files written into the tree: {len(written)}",
          file=sys.stderr)
    return 1 if failed or written else 0


def main(argv: list[str]) -> int:
    if sys.version_info < MIN_PYTHON:
        print(f"REFUSED: Python {sys.version.split()[0]} is not CI's {MIN_PYTHON[0]}.{MIN_PYTHON[1]};"
              " a result here would not be comparable. Run with python3.12.", file=sys.stderr)
        return 2
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--suite", choices=SUITES, help="run one suite in this process")
    args = parser.parse_args(argv)
    os.chdir(ROOT)
    return run_suite(args.suite) if args.suite else run_all()


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
