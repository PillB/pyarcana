#!/usr/bin/env python3
"""chore(lint): the cyclomatic complexity ceiling, for the Python half of the repository.

`scripts/complexity_gate.mjs` enforces the ceiling on TypeScript under `src/`. The audit
scripts and the fixer harness are Python, and nothing measured them — so the tooling that
decides whether a lesson is correct was the one code path with no ceiling.

Same policy as the TypeScript gate: ceiling 15, enforced as a ratchet. The count of functions
above it and the worst score may fall and may not rise; new code meets the ceiling.

McCabe complexity is counted from the AST with the standard library, the way `mccabe` (the
flake8 plugin) counts it: 1 + one per decision point — `if`/`elif`, loops, `except`, `with`
is not a branch, each extra operand of `and`/`or`, conditional expressions, comprehension
`if` clauses and loops, `match` cases, `assert`. Nested functions are scored on their own.

  python3 scripts/complexity_gate_py.py            # check against the baseline
  python3 scripts/complexity_gate_py.py --update   # re-baseline after reducing debt
  python3 scripts/complexity_gate_py.py --files a.py b.py   # new code: every function <= 15
"""
from __future__ import annotations

import ast
import json
import sys
from pathlib import Path
from typing import NamedTuple

ROOT = Path(__file__).resolve().parents[1]
CEILING = 15
BASELINE = ROOT / "audit/fixer/complexity_baseline_py.json"
SCOPES = ("scripts", "tools")
UNITS = (ast.FunctionDef, ast.AsyncFunctionDef, ast.Lambda)
#: Each adds one decision point to the function that contains it. `assert` is a conditional
#: raise (`if not cond: raise`), so it counts as the `if` it stands for.
BRANCHES = (ast.If, ast.IfExp, ast.For, ast.AsyncFor, ast.While, ast.ExceptHandler, ast.Assert)


class Unit(NamedTuple):
    """One function, method or lambda, scored on its own."""
    qual: str
    line: int
    col: int
    score: int


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


def display(path: Path) -> str:
    """Repo-relative when the file is inside ROOT, otherwise the path as given."""
    try:
        return str(path.resolve().relative_to(ROOT))
    except ValueError:
        return str(path.absolute())


class Unparseable(Exception):
    """A file the gate cannot measure. It fails the gate; it is never counted as zero functions."""


def function_scores(path: Path) -> list[dict]:
    shown = display(path)
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError as err:
        line = path.read_bytes()[: err.start].count(b"\n") + 1
        raise Unparseable(f"{shown}:{line}: not UTF-8 ({err.reason})") from err
    try:
        tree = ast.parse(text, filename=shown)
    except SyntaxError as err:
        raise Unparseable(f"{shown}:{err.lineno or 1}: cannot parse ({err.msg})") from err
    except ValueError as err:
        raise Unparseable(f"{shown}:1: cannot parse ({err})") from err
    return [{"file": shown, "function": u.qual, "line": u.line, "score": u.score} for u in units(tree)]


def measure(paths: list[Path]) -> tuple[list[dict], list[str]]:
    rows: list[dict] = []
    problems: list[str] = []
    for path in paths:
        try:
            rows.extend(function_scores(path))
        except Unparseable as err:
            problems.append(str(err))
    return rows, problems


def python_files() -> list[Path]:
    return sorted(p for scope in SCOPES for p in (ROOT / scope).rglob("*.py")
                  if "__pycache__" not in p.parts)


def check_files(paths: list[str]) -> int:
    rows, problems = measure([Path(a) for a in paths])
    over = [r for r in rows if r["score"] > CEILING]
    for line in problems:
        print(f"  UNPARSEABLE {line}")
    for r in over:
        print(f"  OVER {r['score']:3d} {r['file']}:{r['line']} {r['function']}")
    print(f"new code: {len(over)} function(s) above {CEILING}")
    return 1 if over or problems else 0


def ratchet(update: bool) -> int:
    rows, problems = measure(python_files())
    if problems:
        for line in problems:
            print(f"  UNPARSEABLE {line}")
        return 1
    offenders = sorted((r for r in rows if r["score"] > CEILING), key=lambda r: -r["score"])
    now = {"ceiling": CEILING, "over_ceiling": len(offenders), "worst": offenders[0]["score"] if offenders else 0}
    if update or not BASELINE.exists():
        BASELINE.write_text(json.dumps({**now, "offenders": offenders}, indent=1), encoding="utf-8")
        print(f"baseline written: {now}")
        return 0
    base = json.loads(BASELINE.read_text(encoding="utf-8"))
    print(f"python complexity: {now} (baseline over={base['over_ceiling']}, worst={base['worst']})")
    known = {(o["file"], o["function"]) for o in base.get("offenders", [])}
    for r in (r for r in offenders if (r["file"], r["function"]) not in known):
        print(f"  NEW OVER {r['score']:3d} {r['file']}:{r['line']} {r['function']}")
    return 1 if now["over_ceiling"] > base["over_ceiling"] or now["worst"] > base["worst"] else 0


def main() -> int:
    args = sys.argv[1:]
    if "--files" in args:
        return check_files(args[args.index("--files") + 1:])
    return ratchet("--update" in args)


if __name__ == "__main__":
    raise SystemExit(main())
