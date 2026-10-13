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

ROOT = Path(__file__).resolve().parents[1]
CEILING = 15
BASELINE = ROOT / "audit/fixer/complexity_baseline_py.json"
SCOPES = ("scripts", "tools")
MATCH_CASE = getattr(ast, "match_case", ())  # absent before Python 3.10
BRANCHES = (ast.If, ast.For, ast.AsyncFor, ast.While, ast.ExceptHandler, ast.IfExp, ast.Assert)


class Scorer(ast.NodeVisitor):
    def __init__(self) -> None:
        self.score = 1

    def generic_visit(self, node: ast.AST) -> None:
        if isinstance(node, BRANCHES):
            self.score += 1
        elif isinstance(node, ast.BoolOp):
            self.score += len(node.values) - 1
        elif isinstance(node, ast.comprehension):
            self.score += 1 + len(node.ifs)
        elif MATCH_CASE and isinstance(node, MATCH_CASE):
            self.score += 1
        for child in ast.iter_child_nodes(node):
            if not isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef, ast.Lambda)):
                self.visit(child)


def function_scores(path: Path) -> list[dict]:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"))
    except (SyntaxError, UnicodeDecodeError):
        return []
    rows = []
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            scorer = Scorer()
            for child in node.body:
                scorer.visit(child)
            rows.append({"file": str(path.relative_to(ROOT)), "function": node.name,
                         "line": node.lineno, "score": scorer.score})
    return rows


def python_files() -> list[Path]:
    return sorted(p for scope in SCOPES for p in (ROOT / scope).rglob("*.py")
                  if "__pycache__" not in p.parts)


def check_files(paths: list[str]) -> int:
    over = [r for a in paths for r in function_scores(Path(a).resolve()) if r["score"] > CEILING]
    for r in over:
        print(f"  OVER {r['score']:3d} {r['file']}:{r['line']} {r['function']}")
    print(f"new code: {len(over)} function(s) above {CEILING}")
    return 1 if over else 0


def ratchet(update: bool) -> int:
    offenders = sorted((r for f in python_files() for r in function_scores(f) if r["score"] > CEILING),
                       key=lambda r: -r["score"])
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
