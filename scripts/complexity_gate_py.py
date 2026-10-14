#!/usr/bin/env python3
"""chore(lint): the cyclomatic complexity ceiling, for the Python half of the repository.

`scripts/complexity_gate.mjs` enforces the same ceiling on TypeScript. Both gates use one
policy: ceiling 15, measured per function, enforced as a ratchet, and failing closed.

  * A function new to the codebase must meet the ceiling.
  * A function already over it is baselined by key (path::Qual.name) with its score. Its score
    may fall and may not rise. A function that falls to the ceiling or below leaves the baseline.
    A lambda takes every name the code gives it, as the TypeScript gate's callbacks do: the
    name it is assigned to, the call it is handed to and what that call's result is bound to
    (`<kw key of first = sorted>`), the first string the call is given before it
    (`<kw type of parser.add_argument "--size">`), its row in a list bound to a name
    (`ROWS.<item 1 "role">`), `<returned>`, or `<default of cb>`. A number is the fallback for
    what has no name: only units of one file that share a whole path are numbered, #2, #3, on
    the segment where their paths part. So a number moves only when a unit with that same path
    is added before it; a function added with any other path, anywhere in the file, moves no key.
  * A file the gate cannot parse fails the gate, and the message names path:line.
  * A missing baseline fails the gate. `--init` creates one, and refuses to overwrite one.

Counting follows ESLint 9.39.2's complexity rule where Python has the same control flow, and
NIST SP 500-235 section 4.1 otherwise. Section 4.1 warns that constructs which look alike in two
languages may not share control flow, so the count follows the control flow. It is 1 per
function, plus 1 for each `if`/`elif`, conditional expression, loop, `except` clause, `assert`
and `match` case that is not an irrefutable pattern, plus 1 for each `and`/`or` operator, and 1
for each comprehension clause and each `if` in it, plus 1 for each parameter default, as ESLint
scores an AssignmentPattern (owner ruling 2026-10-12, O21: Python counts like the TypeScript gate).
A default and the expression inside it are scored in the function that owns the parameter, so a
nested def's defaults are the nested def's, not those of the function around it. A nested def or
lambda is scored on its own, except that its decorators run where it is defined, so they count
toward the function that contains it. `assert`, comprehension clauses, `match` guards and the body
of a class defined inside a function are counted although ESLint has no node for them: each is a
decision that runs with the function. Module-level code is not a function and is not scored, as
ESLint does not score the program. tests/adversarial/complexity_parity_corpus.json pins the
counting against radon 6.0.1 and names, with a reason, every place it departs from radon.

  python3 scripts/complexity_gate_py.py              # check, and tighten the baseline if debt fell
  python3 scripts/complexity_gate_py.py --init       # create the baseline (refuses if one exists)
  python3 scripts/complexity_gate_py.py --files a.py b.py   # new code: every function <= 15
  python3 scripts/complexity_gate_py.py --root DIR   # measure another tree (used by the tests)
  python3 scripts/complexity_gate_py.py --scope FILE # read another scope file (used by the tests)
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


def defaults_of(unit: ast.AST) -> list[ast.AST]:
    """The default value of every parameter that has one: positional, positional-only, keyword-only."""
    return [*unit.args.defaults, *(d for d in unit.args.kw_defaults if d is not None)]


def inside(node: ast.AST) -> list[ast.AST]:
    """What runs as part of the function being counted. A nested def or lambda is scored on its
    own, so only its decorators, which run where it is defined, belong to the function around it.
    Its parameter defaults are its own: ESLint scores them in the function that owns the parameter."""
    if isinstance(node, UNITS):
        return list(getattr(node, "decorator_list", []))
    return list(ast.iter_child_nodes(node))


def score_of(unit: ast.AST) -> int:
    """1, plus 1 for each parameter default (ESLint's AssignmentPattern) and whatever its
    expression adds, plus the decision points in the body."""
    defaults = defaults_of(unit)
    body = unit.body if isinstance(unit.body, list) else [unit.body]
    total, stack = 1 + len(defaults), [*defaults, *body]
    while stack:
        node = stack.pop()
        total += point(node)
        stack.extend(inside(node))
    return total


def dotted(expr: ast.AST) -> str:
    """`a`, `a.b`, `a().b`, `a[…]`: an assignment target or callee as written, call arguments and
    subscripts left out."""
    if isinstance(expr, ast.Name):
        return expr.id
    if isinstance(expr, ast.Attribute):
        return f"{dotted(expr.value)}.{expr.attr}"
    if isinstance(expr, ast.Call):
        return f"{dotted(expr.func)}()"
    if isinstance(expr, ast.Subscript):
        return f"{dotted(expr.value)}[…]"
    return "…"


#: A list, tuple, set or dict is a segment of a path when it is bound to a name: `ROWS = [...]`.
CONTAINERS = (ast.List, ast.Tuple, ast.Set, ast.Dict)


def target_text(target: ast.AST) -> str:
    """`x`, `self.x`, `a, b`, `*rest`: an assignment target as written."""
    if isinstance(target, (ast.Tuple, ast.List)):
        return ", ".join(target_text(e) for e in target.elts)
    if isinstance(target, ast.Starred):
        return f"*{target_text(target.value)}"
    return dotted(target)


def title_of(node: ast.AST | None) -> str | None:
    """A title the code spells out: a string, or an f-string with `{…}` for each expression."""
    if isinstance(node, ast.Constant) and isinstance(node.value, str):
        return node.value
    if isinstance(node, ast.JoinedStr):
        return "".join(v.value if isinstance(v, ast.Constant) else "{…}" for v in node.values)
    return None


def titled(items: list, place: int) -> str:
    """` "title"` for the first of `items` before `place` that spells out a title, else ''."""
    title = next((t for t in map(title_of, items[:place]) if t is not None), None)
    return "" if title is None else " " + json.dumps(" ".join(title.split()), ensure_ascii=False)


def bound_name(node: ast.AST, parent: ast.AST | None) -> str | None:
    """What `node` is bound to: an assignment, annotated, augmented or walrus target, or the
    string key of the dict it is a value of."""
    if isinstance(parent, ast.Assign) and parent.value is node and len(parent.targets) == 1:
        return target_text(parent.targets[0])
    if isinstance(parent, (ast.AnnAssign, ast.AugAssign, ast.NamedExpr)) and parent.value is node:
        return target_text(parent.target)
    if isinstance(parent, ast.Dict):
        return next((title_of(k) for k, v in zip(parent.keys, parent.values) if v is node), None)
    return None


def result_name(call: ast.Call, parents: dict) -> str | None:
    """The name a call's result reaches, through `await`, an attribute read, a subscript such as
    `[:10]`, or a further call."""
    node = call
    while True:
        up = parents.get(node)
        reads = (isinstance(up, (ast.Attribute, ast.Subscript)) and up.value is node) or (isinstance(up, ast.Call) and up.func is node)
        if not (isinstance(up, ast.Await) or reads):
            return bound_name(node, up)
        node = up


def call_label(call: ast.Call, place: str, before: int, parents: dict) -> str:
    """`<kw key of first = sorted>`, `<arg 1 of page.on "requestfailed">`: the place, the callee,
    what its result is bound to, and the first title among the positional arguments before it."""
    bound = result_name(call, parents)
    callee = dotted(call.func) if bound is None else f"{bound} = {dotted(call.func)}"
    return f"<{place} of {callee}{titled(call.args, before)}>"


def param_of(args: ast.arguments, default: ast.AST) -> str:
    """The parameter whose default `default` is."""
    positional = [*args.posonlyargs, *args.args]
    pairs = [*zip(positional[len(positional) - len(args.defaults):], args.defaults),
             *zip(args.kwonlyargs, args.kw_defaults)]
    return next((arg.arg for arg, value in pairs if value is default), "…")


def used_in_call(node: ast.Lambda, call: ast.Call, parents: dict) -> str | None:
    if call.func is node:
        bound = result_name(call, parents)
        return None if bound is None else f"<{bound} = (…)()>"
    place = next((i for i, arg in enumerate(call.args) if arg is node), None)
    return None if place is None else call_label(call, f"arg {place}", place, parents)


def used_as_keyword(keyword: ast.keyword, parents: dict) -> str | None:
    call = parents.get(keyword)
    if keyword.arg is None or not isinstance(call, ast.Call):
        return None
    return call_label(call, f"kw {keyword.arg}", len(call.args), parents)


def used_in_items(node: ast.Lambda, items: list) -> str:
    place = next(i for i, item in enumerate(items) if item is node)
    return f"<item {place}{titled(items, place)}>"


def usage_label(node: ast.Lambda, parent: ast.AST | None, parents: dict) -> str | None:
    """How a lambda is used: handed to a call, called at once, held in a list (the row titled
    "role" in `("role", lambda q: ...)`), returned, or a parameter's default."""
    if isinstance(parent, ast.Call):
        return used_in_call(node, parent, parents)
    if isinstance(parent, ast.keyword):
        return used_as_keyword(parent, parents)
    if isinstance(parent, (ast.List, ast.Tuple, ast.Set)):
        return used_in_items(node, parent.elts)
    if isinstance(parent, ast.Return) or (isinstance(parent, ast.Lambda) and parent.body is node):
        return "<returned>"
    return f"<default of {param_of(parent, node)}>" if isinstance(parent, ast.arguments) else None


def lambda_label(node: ast.Lambda, parents: dict) -> str:
    """A lambda has no name, so it takes every name the code gives it: what it is bound to
    (`key = lambda ...` is `key`), else how it is used (`<kw key of first = sorted>`,
    `<kw type of parser.add_argument "--size">`, `ROWS.<item 1 "role">`, `<returned>`). Only a
    lambda that is none of these, such as one in a conditional expression, is `<lambda>`."""
    parent = parents.get(node)
    return bound_name(node, parent) or usage_label(node, parent, parents) or "<lambda>"


def segment_label(node: ast.AST, parents: dict) -> str | None:
    """The name `node` gives a path, or None when it is not a segment: a class or def by its
    name, a lambda by `lambda_label`, a list, tuple, set or dict by the name it is bound to."""
    if isinstance(node, (ast.ClassDef, ast.FunctionDef, ast.AsyncFunctionDef)):
        return node.name
    if isinstance(node, ast.Lambda):
        return lambda_label(node, parents)
    return bound_name(node, parents.get(node)) if isinstance(node, CONTAINERS) else None


class Placed(NamedTuple):
    """A unit, the segments that hold it (outermost first, the unit last) and their labels."""
    node: ast.AST
    chain: tuple
    labels: tuple
    suffix: dict


def number(group: list[Placed], level: int = 0) -> None:
    """Numbers units that share a whole path of labels. Their chains hold the same node at every
    level before `level`. At the first level where they part, the places in source order take #2,
    #3; then the units in each place are numbered the same way, further in."""
    if len(group) < 2:
        return
    while all(p.chain[level] is group[0].chain[level] for p in group):
        level += 1
    places: dict[ast.AST, list[Placed]] = {}
    for p in group:
        places.setdefault(p.chain[level], []).append(p)
    ordered = sorted(places.items(), key=lambda item: (item[0].lineno, item[0].col_offset))
    for i, (_, held) in enumerate(ordered):
        for p in held if i else []:
            p.suffix[level] = f"#{i + 1}"
        number(held, level + 1)


def units(tree: ast.AST) -> list[Unit]:
    """Every def and lambda, keyed by its path of names. Only units that share a whole path are
    numbered, on the segment where their paths part (see `number`), so a number moves only when a
    unit with that same path is added before it; a unit with any other path moves nothing."""
    parents = {child: node for node in ast.walk(tree) for child in ast.iter_child_nodes(node)}
    groups: dict[tuple, list[Placed]] = {}

    def visit(node: ast.AST, chain: tuple, labels: tuple) -> None:
        for child in ast.iter_child_nodes(node):
            label = segment_label(child, parents)
            if label is None:
                visit(child, chain, labels)
                continue
            here, named = (*chain, child), (*labels, label)
            if isinstance(child, UNITS):
                groups.setdefault(named, []).append(Placed(child, here, named, {}))
            visit(child, here, named)

    visit(tree, (), ())
    found = []
    for group in groups.values():
        number(group)
        for p in group:
            qual = ".".join(label + p.suffix.get(i, "") for i, label in enumerate(p.labels))
            found.append(Unit(qual, p.node.lineno, p.node.col_offset, score_of(p.node)))
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
    """Every function's score under its key, path::Qual.name. `units` already numbers units that
    share a path; this only keeps two keys apart whose text happens to match, as `a.b = lambda: 0`
    and a lambda keyed `b` inside a dict bound to `a` do, with #2 in source order."""
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


def python_files(root: Path = ROOT, scope_file: Path = SCOPE_FILE) -> list[Path]:
    """Every .py file under the Python scope roots that no exclusion names."""
    scope = json.loads(scope_file.read_text(encoding="utf-8"))
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


def init(root: Path, scope_file: Path) -> int:
    path = root / BASELINE_NAME
    if path.exists():
        print(f"REFUSED {BASELINE_NAME} exists; delete it first, so the re-baseline shows in the diff")
        return 1
    rows, problems = measure(python_files(root, scope_file), root)
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


def ratchet(root: Path, scope_file: Path) -> int:
    path = root / BASELINE_NAME
    rows, problems = measure(python_files(root, scope_file), root)
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


def option(args: list[str], flag: str) -> str | None:
    """The value after `flag`, None when the flag is absent. A flag with no value is a usage error."""
    if flag not in args:
        return None
    at = args.index(flag) + 1
    if at >= len(args):
        raise SystemExit(f"FAIL {flag} needs a value")
    return args[at]


def main() -> int:
    why = refusal()
    if why:
        print(why, file=sys.stderr)
        return 2
    args = sys.argv[1:]
    if "--files" in args:
        return check_files(args[args.index("--files") + 1:])
    root = Path(option(args, "--root") or ROOT).resolve()
    scope_file = Path(option(args, "--scope") or SCOPE_FILE)
    if "--init" in args:
        return init(root, scope_file)
    return ratchet(root, scope_file)


if __name__ == "__main__":
    raise SystemExit(main())
