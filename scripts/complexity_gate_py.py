#!/usr/bin/env python3
"""chore(lint): the cyclomatic complexity ceiling, for the Python half of the repository.

`scripts/complexity_gate.mjs` enforces the same ceiling on TypeScript. Both gates use one
policy: ceiling 15, measured per function, enforced as a ratchet, and failing closed.

  * A function new to the codebase must meet the ceiling.
  * A function already over it is baselined by key (path::Qual.name) with its score. Its score
    may fall and may not rise. A function that falls to the ceiling or below leaves the baseline.
  * A file the gate cannot parse fails the gate, and the message names path:line.
  * A missing baseline fails the gate. `--init` creates one, and refuses to overwrite one.

Counting follows ESLint 9.39.2's complexity rule where Python has the same control flow, and
NIST SP 500-235 section 4.1 otherwise. Section 4.1 warns that constructs which look alike in two
languages may not share control flow, so the count follows the control flow. It is 1 per
function, plus 1 for each `if`/`elif`, conditional expression, loop, `except` clause, `assert`
and `match` case that is not an irrefutable pattern, plus 1 for each `and`/`or` operator, and 1
for each comprehension clause and each `if` in it. A nested def or lambda is scored on its own,
except that its parameter defaults run where it is defined, so they count toward the function
that contains it. Three departures from ESLint are deliberate, and tests/adversarial/
test_complexity_gate_py.py pins each one. A parameter default is not counted: ESLint counts it,
but a Python default is evaluated once, when the def runs, not on each call. `assert` and
comprehension clauses are counted: ESLint has no node for them, and radon counts them. A default
inside a nested def counts toward its enclosing function, where it runs; ESLint attributes it to
the nested function. Module-level code is not a function and is not scored, as ESLint does not
score the program. tests/adversarial/complexity_parity_corpus.json pins the counting against
radon 6.0.1 and names where it departs from radon.

  python3 scripts/complexity_gate_py.py              # check, and tighten the baseline if debt fell
  python3 scripts/complexity_gate_py.py --init       # create the baseline (refuses if one exists)
  python3 scripts/complexity_gate_py.py --files a.py b.py   # new code: every function <= 15
  python3 scripts/complexity_gate_py.py --root DIR   # measure another tree (used by the tests)
"""
from __future__ import annotations

import ast
import json
import sys
from collections import Counter
from pathlib import Path
from typing import NamedTuple

ROOT = Path(__file__).resolve().parents[1]
CEILING = 15
CI_PYTHON = (3, 12)  # the only interpreter a verdict is reported under (CI runs 3.12)
BASELINE_NAME = "audit/fixer/complexity_baseline_py.json"
SCOPE_FILE = ROOT / "audit/fixer/complexity_scope.json"
CONVENTION = ("per function; counted as ESLint 9.39.2 and NIST SP 500-235 4.1 count it; parity "
              "corpus frozen from radon 6.0.1 (tests/adversarial/complexity_parity_corpus.json)")
UNITS = (ast.FunctionDef, ast.AsyncFunctionDef, ast.Lambda)
NOTHING_MEASURED = ("FAIL the scope measured no python function, so there is nothing to pass; "
                    "check the scope roots in audit/fixer/complexity_scope.json")
#: Each adds one decision point to the function that contains it. `assert` is a conditional
#: raise (`if not cond: raise`), so it counts as the `if` it stands for.
BRANCHES = (ast.If, ast.IfExp, ast.For, ast.AsyncFor, ast.While, ast.ExceptHandler, ast.Assert)


class Unit(NamedTuple):
    """One function, method or lambda, scored on its own."""
    qual: str
    line: int
    col: int
    score: int


class Unparseable(Exception):
    """A file the gate cannot measure. It fails the gate; it is never counted as zero functions."""


def point(node: ast.AST) -> int:
    """Decision points this node adds to the function that contains it, not counting children."""
    if isinstance(node, BRANCHES):
        return 1
    if isinstance(node, ast.BoolOp):
        return len(node.values) - 1
    if isinstance(node, ast.comprehension):
        return 1 + len(node.ifs)
    if isinstance(node, ast.match_case):
        irrefutable = isinstance(node.pattern, ast.MatchAs) and node.pattern.pattern is None
        return (0 if irrefutable else 1) + (node.guard is not None)
    return 0


def inside(node: ast.AST) -> list[ast.AST]:
    """What runs as part of the function being counted. A nested def or lambda runs its
    decorators and default values where it is defined, and its body only when it is called."""
    if isinstance(node, UNITS):
        return [*getattr(node, "decorator_list", []), *node.args.defaults,
                *(d for d in node.args.kw_defaults if d is not None)]
    return list(ast.iter_child_nodes(node))


def score_of(unit: ast.AST) -> int:
    body = unit.body if isinstance(unit.body, list) else [unit.body]
    total, stack = 1, list(body)
    while stack:
        node = stack.pop()
        total += point(node)
        stack.extend(inside(node))
    return total


def qualname(node: ast.AST, prefix: str) -> str:
    name = "<lambda>" if isinstance(node, ast.Lambda) else node.name
    return f"{prefix}.{name}" if prefix else name


def units(tree: ast.AST) -> list[Unit]:
    found: list[Unit] = []

    def visit(node: ast.AST, prefix: str) -> None:
        for child in ast.iter_child_nodes(node):
            if isinstance(child, (ast.ClassDef, *UNITS)):
                qual = qualname(child, prefix)
                if isinstance(child, UNITS):
                    found.append(Unit(qual, child.lineno, child.col_offset, score_of(child)))
                visit(child, qual)
            else:
                visit(child, prefix)

    visit(tree, "")
    return sorted(found, key=lambda u: (u.line, u.col))


def display(path: Path, root: Path = ROOT) -> str:
    """Relative to `root` when the file is inside it, otherwise the path as given."""
    try:
        return path.resolve().relative_to(root.resolve()).as_posix()
    except ValueError:
        return str(path.absolute())


def function_scores(path: Path, root: Path = ROOT) -> list[dict]:
    shown = display(path, root)
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError as err:
        line = path.read_bytes()[: err.start].count(b"\n") + 1
        raise Unparseable(f"{shown}:{line}: not UTF-8 ({err.reason})") from err
    except OSError as err:
        raise Unparseable(f"{shown}:1: cannot read ({err.strerror or err})") from err
    try:
        tree = ast.parse(text, filename=shown)
    except SyntaxError as err:
        raise Unparseable(f"{shown}:{err.lineno or 1}: cannot parse ({err.msg})") from err
    except ValueError as err:
        raise Unparseable(f"{shown}:1: cannot parse ({err})") from err
    return [{"file": shown, "function": u.qual, "line": u.line, "score": u.score} for u in units(tree)]


def measure(paths: list[Path], root: Path = ROOT) -> tuple[list[dict], list[str]]:
    rows: list[dict] = []
    problems: list[str] = []
    for path in paths:
        try:
            rows.extend(function_scores(path, root))
        except Unparseable as err:
            problems.append(str(err))
    return rows, problems


def keyed(rows: list[dict]) -> dict[str, int]:
    """Every function's score under its key, path::Qual.name. A name repeated within one file is
    suffixed #2, #3 in source order, so a key does not move when another function is edited."""
    seen: Counter = Counter()
    out: dict[str, int] = {}
    for row in sorted(rows, key=lambda r: (r["file"], r["line"])):
        base = f"{row['file']}::{row['function']}"
        seen[base] += 1
        out[base if seen[base] == 1 else f"{base}#{seen[base]}"] = row["score"]
    return out


def over_ceiling(scores: dict[str, int]) -> dict[str, int]:
    return {key: score for key, score in sorted(scores.items()) if score > CEILING}


def payload(over: dict[str, int]) -> dict:
    return {"ceiling": CEILING, "convention": CONVENTION, "python": "3.12",
            "over_ceiling": len(over), "worst": max(over.values(), default=0), "offenders": over}


def excluded(rel: str, exclusions: list[dict]) -> bool:
    """True when a repository-relative path is under an exclusion's path (a directory ends in /)."""
    return any(rel == e["path"] or (e["path"].endswith("/") and rel.startswith(e["path"]))
               for e in exclusions)


def python_files(root: Path = ROOT) -> list[Path]:
    """Every .py file under the Python scope roots that no exclusion names."""
    scope = json.loads(SCOPE_FILE.read_text(encoding="utf-8"))
    py = scope["python"]
    found = [p for r in py["roots"] if (root / r).is_dir() for p in (root / r).rglob("*")
             if p.suffix in py["suffixes"] and "__pycache__" not in p.parts
             and not excluded(p.relative_to(root).as_posix(), scope["GATE_EXCLUSIONS"])]
    return sorted(found)


def report_problems(problems: list[str]) -> None:
    for line in problems:
        print(f"  UNPARSEABLE {line}")


def check_files(paths: list[str]) -> int:
    if not paths:
        print("FAIL --files needs at least one path; with none, nothing is measured", file=sys.stderr)
        return 2
    rows, problems = measure([Path(a) for a in paths])
    over = [r for r in rows if r["score"] > CEILING]
    report_problems(problems)
    for r in over:
        print(f"  OVER {r['score']:3d} {r['file']}:{r['line']} {r['function']}")
    print(f"new code: {len(over)} function(s) above {CEILING}")
    return 1 if over or problems else 0


def write_baseline(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=1) + "\n", encoding="utf-8")


def init(root: Path) -> int:
    path = root / BASELINE_NAME
    if path.exists():
        print(f"REFUSED {BASELINE_NAME} exists; delete it first, so the re-baseline shows in the diff")
        return 1
    rows, problems = measure(python_files(root), root)
    if problems:
        report_problems(problems)
        return 1
    if not rows:
        print(NOTHING_MEASURED)
        return 1
    fresh = payload(over_ceiling(keyed(rows)))
    write_baseline(path, fresh)
    print(f"baseline written: {fresh['over_ceiling']} over {CEILING}, worst {fresh['worst']}")
    return 0


def ratchet(root: Path) -> int:
    path = root / BASELINE_NAME
    rows, problems = measure(python_files(root), root)
    if problems:
        report_problems(problems)
        return 1
    if not rows:
        print(NOTHING_MEASURED)
        return 1
    if not path.exists():
        print(f"FAIL no baseline at {BASELINE_NAME}; create it with --init and commit it")
        return 1
    over = over_ceiling(keyed(rows))
    recorded = json.loads(path.read_text(encoding="utf-8"))["offenders"]
    failures = []
    for key, score in over.items():
        if key not in recorded:
            failures.append(f"  NEW OVER {score:3d} {key}")
        elif score > recorded[key]:
            failures.append(f"  GREW {recorded[key]:3d} -> {score:3d} {key}")
    if failures:
        print("FAIL python complexity grew. Split the function, or reduce it before adding to it:")
        print("\n".join(failures))
        return 1
    fresh = payload(over)
    if fresh != json.loads(path.read_text(encoding="utf-8")):
        write_baseline(path, fresh)
        print("debt fell; baseline tightened. Commit the tightened baseline.")
    print(f"python complexity: {len(over)} over {CEILING}, worst {fresh['worst']}; "
          f"baseline recorded {len(recorded)}")
    return 0


def refusal() -> str | None:
    """Why this interpreter may not give a verdict, or None. 3.9 and 3.13 parse and print
    differently from CI's 3.12, so a verdict from either would not be comparable."""
    if tuple(sys.version_info[:2]) == CI_PYTHON:
        return None
    found = ".".join(str(part) for part in sys.version_info[:3])
    return (f"REFUSED: Python {found} is not CI's {CI_PYTHON[0]}.{CI_PYTHON[1]}; "
            "a result here would not be comparable. Run with python3.12.")


def main() -> int:
    why = refusal()
    if why:
        print(why, file=sys.stderr)
        return 2
    args = sys.argv[1:]
    if "--files" in args:
        return check_files(args[args.index("--files") + 1:])
    root = Path(args[args.index("--root") + 1]).resolve() if "--root" in args else ROOT
    if "--init" in args:
        return init(root)
    return ratchet(root)


if __name__ == "__main__":
    raise SystemExit(main())
