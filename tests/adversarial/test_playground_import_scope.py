"""Import scope for the playground demos (scripts/playground_import_scope.py).

Named defect: a demo imports a package its section has not taught yet. S10's demo shows
scikit-learn, which no section teaches; S11's demo shows numpy, which the course introduces in
S14. A demo whose code does not parse is reported as well, because its imports were not checked.
Each test below names the defect it guards; the commit that adds this file records the mutation
that turns each red.
"""
from __future__ import annotations

import ast
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(Path(__file__).resolve().parent))

import playground_import_scope as scope  # noqa: E402
from playground_truth import playground  # noqa: E402


def problems_for(section_number: int, code: str, *, loaded=None, unvendored=None) -> list[tuple[str, str]]:
    """import_scope_problems with the playground's real map, unless a test substitutes one."""
    data = playground()
    return scope.import_scope_problems(
        section_number, code,
        loaded=data["requiredPackages"] if loaded is None else loaded,
        unvendored=data["unvendoredStdlib"] if unvendored is None else unvendored,
    )

#: Demos with imports outside the rule, with the modules (section = position in COURSE_SECTIONS).
#: Owed, not accepted: owner decision O25 replaces each demo, and its entry leaves this map with it.
#: Measured 2026-10-14: S10 imported numpy and sklearn, S11 numpy. O25's first phase replaced both
#: (S10 to S13), so nothing is owed.
IMPORT_SCOPE_OWED: dict[str, frozenset[str]] = {}
#: Demos that do not parse, so their imports cannot be read. databases-orm's own code is a
#: SyntaxError on its line 31 (an unterminated string literal).
NOT_PARSED_OWED = frozenset({"databases-orm"})


def real_findings() -> tuple[dict[str, frozenset[str]], set[str], list[str]]:
    """Out-of-scope modules per demo, demos that do not parse, and demo ids with no section."""
    data = playground()
    sections = data["sections"]
    out_of_scope: dict[str, frozenset[str]] = {}
    unparsed: set[str] = set()
    no_section = [demo_id for demo_id in data["demos"] if demo_id not in sections]
    for demo_id, demo in data["demos"].items():
        if demo_id in no_section:
            continue
        try:
            problems = problems_for(sections.index(demo_id) + 1, demo["code"])
        except SyntaxError:
            unparsed.add(demo_id)
            continue
        if problems:
            out_of_scope[demo_id] = frozenset(module for module, _ in problems)
    return out_of_scope, unparsed, no_section


class ImportScopeRule(unittest.TestCase):
    def test_scikit_learn_is_refused_in_every_section(self) -> None:
        # Defect: a demo imports scikit-learn, which no section teaches.
        problems = problems_for(10, "from sklearn.linear_model import LogisticRegression\n")
        self.assertEqual([module for module, _ in problems], ["sklearn"])

    def test_numpy_is_refused_before_s14_and_allowed_from_s14(self) -> None:
        # Defect (boundary): numpy allowed one section early, at S13.
        self.assertEqual(len(problems_for(13, "import numpy as np\n")), 1)
        self.assertEqual(problems_for(14, "import numpy as np\n"), [])

    def test_pandas_is_refused_before_s15_and_allowed_from_s15(self) -> None:
        # Defect (boundary): pandas allowed one section early, at S14.
        self.assertEqual(len(problems_for(14, "import pandas as pd\n")), 1)
        self.assertEqual(problems_for(15, "import pandas as pd\n"), [])

    def test_the_standard_library_is_always_allowed(self) -> None:
        # Defect (false positive): a legitimate stdlib demo in S1 is refused by the check.
        self.assertEqual(problems_for(1, "import json, re\nfrom pathlib import Path\n"), [])

    def test_code_that_does_not_parse_is_an_error_not_a_pass(self) -> None:
        # Defect: an unparseable demo has no imports read, so it passes the check silently.
        with self.assertRaises(SyntaxError):
            problems_for(10, "import sklearn\nprint(('unterminated)\n")


class UnvendoredStandardLibrary(unittest.TestCase):
    """Pyodide 0.26.2 does not include sqlite3, lzma and ssl; `import sqlite3` raises
    ModuleNotFoundError in the browser unless CodePlayground loads the package first. CPython has
    them, so a check that asks only `module in sys.stdlib_module_names` passes a demo the learner
    cannot run (review of the playground infrastructure PR, minor finding)."""

    def real_map_without(self, module: str) -> set[str]:
        return set(playground()["requiredPackages"]) - {module}

    def test_sqlite3_is_refused_when_the_playground_does_not_load_it(self) -> None:
        # Defect: a demo imports sqlite3 and the map does not load it. Names the module.
        found = problems_for(29, "import sqlite3\n", loaded=self.real_map_without("sqlite3"))
        self.assertEqual([module for module, _ in found], ["sqlite3"])
        self.assertIn("does not load", found[0][1])

    def test_lzma_and_ssl_are_refused_when_the_playground_does_not_load_them(self) -> None:
        # Defect (the other two of the three): the check knows sqlite3 only.
        for module in ("lzma", "ssl"):
            found = problems_for(29, f"import {module}\n", loaded=self.real_map_without(module))
            self.assertEqual([m for m, _ in found], [module], module)

    def test_an_unvendored_module_the_playground_loads_is_allowed(self) -> None:
        # Defect (false positive): every unvendored module is refused, even the ones CodePlayground
        # loads, so the demos that rely on sqlite3 could never be written.
        for module in ("sqlite3", "lzma", "ssl"):
            self.assertEqual(problems_for(29, f"import {module}\n"), [], module)

    def test_an_unvendored_module_nobody_loads_is_refused_with_the_real_map(self) -> None:
        # Defect: the guard trusts `sys.stdlib_module_names` for modules the map never loads
        # (`test`, `pydoc_data`), which Pyodide 0.26.2 leaves out and the playground does not load.
        for module in ("test", "pydoc_data"):
            found = problems_for(29, f"import {module}\n")
            self.assertEqual([m for m, _ in found], [module], module)

    def test_modules_that_run_without_loading_anything_are_not_refused(self) -> None:
        # Defect (false positive): hashlib and decimal are measured to import on a bare Pyodide
        # 0.26.2 (only their private _hashlib and _pydecimal are separate), and the course uses them.
        self.assertEqual(problems_for(29, "import hashlib\nimport decimal\n"), [])


class RealDemos(unittest.TestCase):
    def test_the_replaced_s10_to_s13_demos_import_only_the_standard_library(self) -> None:
        # Defect: one of the four demos O25's first phase wrote (S10 to S13) goes back to a package its
        # section has not taught; S10 used to ship scikit-learn and S11 numpy. Names the demo and module.
        data = playground()
        for demo_id in ("modules-packaging-cli", "oop-domain", "apis-sql-geo", "evidence-dashboard"):
            number = data["sections"].index(demo_id) + 1
            self.assertIn(number, (10, 11, 12, 13), demo_id)
            outside = [
                module
                for module in scope.imported_modules(ast.parse(data["demos"][demo_id]["code"]))
                if module not in sys.stdlib_module_names
            ]
            self.assertEqual(outside, [], f"S{number} {demo_id} imports a package outside the standard library")

    def test_out_of_scope_imports_are_exactly_the_owed_set(self) -> None:
        # Defect: a new out-of-scope import is accepted, or a fixed one stays on the owed list.
        out_of_scope, _, _ = real_findings()
        self.assertEqual(out_of_scope, IMPORT_SCOPE_OWED)

    def test_unparsed_demos_are_exactly_the_owed_set(self) -> None:
        # Defect: a demo that does not parse is counted as clean, hiding its imports.
        _, unparsed, _ = real_findings()
        self.assertEqual(unparsed, NOT_PARSED_OWED)

    def test_the_browser_loads_every_package_the_guard_lets_a_demo_import(self) -> None:
        # Defect: the guard reads imports with an AST, but CodePlayground loads packages from a text
        # scan of the code. A demo can pass the guard and still import a module the browser never
        # loaded (S07's `import csv, hashlib, io, json` missed hashlib, the second name on the line).
        data = playground()
        missed: dict[str, list[str]] = {}
        for demo_id, demo in data["demos"].items():
            try:
                modules = scope.imported_modules(ast.parse(demo["code"]))
            except SyntaxError:
                continue
            needed = {data["requiredPackages"][m] for m in modules if m in data["requiredPackages"]}
            absent = sorted(needed - set(data["detected"][demo_id]))
            if absent:
                missed[demo_id] = absent
        self.assertEqual(missed, {})

    def test_every_demo_has_a_section(self) -> None:
        # Defect: a demo keyed by an id that is not a section is checked against no section at all.
        _, _, no_section = real_findings()
        self.assertEqual(no_section, [])


if __name__ == "__main__":
    unittest.main()
