"""Import scope for the playground demos.

A demo may import only the Python 3.12 standard library, plus numpy from S14 and pandas from S15,
and only the part of the standard library that runs in the browser: Pyodide 0.26.2 leaves out
sqlite3, lzma, ssl and a few others, so a demo may import one only if the playground loads it.
Section numbers are positions in COURSE_SECTIONS (S10 is the tenth). A demo that imports a package
the course has not yet taught puts the learner ahead of the lesson: S10 shows scikit-learn, which
no section teaches, and S11 shows numpy three sections before numpy is taught.

Pure: no I/O. tests/adversarial/test_playground_import_scope.py feeds it the real demos.
"""
from __future__ import annotations

import ast
import sys
from collections.abc import Collection

#: First section in which each non-standard-library package may be imported by a demo.
NUMERIC_FROM = {"numpy": 14, "pandas": 15}


def imported_modules(tree: ast.AST) -> set[str]:
    """Top-level package of every import in the tree; relative imports are reported as '.'."""
    names: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            names.update(alias.name.split(".")[0] for alias in node.names)
        elif isinstance(node, ast.ImportFrom):
            names.add("." if node.level else (node.module or "").split(".")[0])
    return names


def import_scope_problems(
    section_number: int, code: str, *, loaded: Collection[str], unvendored: Collection[str],
) -> list[tuple[str, str]]:
    """(module, message) for each import this demo may not make in its section. Raises SyntaxError
    when the code does not parse: the caller must say so, because nothing was checked.

    `loaded` is every import name the playground loads before the code runs (REQUIRED_PACKAGES in
    src/lib/pyodide.ts) and `unvendored` every standard-library module Pyodide does not include
    (PYODIDE_UNVENDORED_STDLIB). Both are required: a caller that cannot name them must not get a
    verdict, because `import sqlite3` is standard library in CPython and fails in the browser."""
    problems = []
    for module in sorted(imported_modules(ast.parse(code))):
        if module in unvendored and module not in loaded:
            problems.append((
                module,
                f"S{section_number:02d} imports {module}, a standard-library module that Pyodide does not "
                f"include and the playground does not load, so the import fails in the browser "
                f"(add it to REQUIRED_PACKAGES in src/lib/pyodide.ts or stop importing it)",
            ))
            continue
        if module in sys.stdlib_module_names:
            continue
        first = NUMERIC_FROM.get(module)
        if first is not None and section_number >= first:
            continue
        where = f"from S{first}" if first is not None else "in no section"
        problems.append((
            module,
            f"S{section_number:02d} imports {module}; a demo may import the standard library, "
            f"numpy from S14 and pandas from S15, so {module} is out of scope ({where})",
        ))
    return problems
