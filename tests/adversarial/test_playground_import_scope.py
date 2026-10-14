"""Import scope for the playground demos (scripts/playground_import_scope.py).

Named defect: a demo imports a package its section has not taught yet. S10's demo shows
scikit-learn, which no section teaches; S11's demo shows numpy, which the course introduces in
S14. A demo whose code does not parse is reported as well, because its imports were not checked.
Each test below names the defect it guards; the commit that adds this file records the mutation
that turns each red.
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(Path(__file__).resolve().parent))

import playground_import_scope as scope  # noqa: E402
from playground_truth import playground  # noqa: E402

#: Demos with imports outside the rule, with the modules, measured from the real demos on
#: 2026-10-14 (section = position in COURSE_SECTIONS). Owed, not accepted: owner decision O25
#: replaces each demo, and its entry leaves this map with it.
IMPORT_SCOPE_OWED = {
    "modules-packaging-cli": frozenset({"numpy", "sklearn"}),  # S10
    "oop-domain": frozenset({"numpy"}),  # S11
}
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
            problems = scope.import_scope_problems(sections.index(demo_id) + 1, demo["code"])
        except SyntaxError:
            unparsed.add(demo_id)
            continue
        if problems:
            out_of_scope[demo_id] = frozenset(module for module, _ in problems)
    return out_of_scope, unparsed, no_section


class ImportScopeRule(unittest.TestCase):
    def test_scikit_learn_is_refused_in_every_section(self) -> None:
        # Defect: a demo imports scikit-learn, which no section teaches.
        problems = scope.import_scope_problems(10, "from sklearn.linear_model import LogisticRegression\n")
        self.assertEqual([module for module, _ in problems], ["sklearn"])

    def test_numpy_is_refused_before_s14_and_allowed_from_s14(self) -> None:
        # Defect (boundary): numpy allowed one section early, at S13.
        self.assertEqual(len(scope.import_scope_problems(13, "import numpy as np\n")), 1)
        self.assertEqual(scope.import_scope_problems(14, "import numpy as np\n"), [])

    def test_pandas_is_refused_before_s15_and_allowed_from_s15(self) -> None:
        # Defect (boundary): pandas allowed one section early, at S14.
        self.assertEqual(len(scope.import_scope_problems(14, "import pandas as pd\n")), 1)
        self.assertEqual(scope.import_scope_problems(15, "import pandas as pd\n"), [])

    def test_the_standard_library_is_always_allowed(self) -> None:
        # Defect (false positive): a legitimate stdlib demo in S1 is refused by the check.
        self.assertEqual(scope.import_scope_problems(1, "import json, re\nfrom pathlib import Path\n"), [])

    def test_code_that_does_not_parse_is_an_error_not_a_pass(self) -> None:
        # Defect: an unparseable demo has no imports read, so it passes the check silently.
        with self.assertRaises(SyntaxError):
            scope.import_scope_problems(10, "import sklearn\nprint(('unterminated)\n")


class RealDemos(unittest.TestCase):
    def test_the_s10_demo_fails_naming_sklearn_and_the_section(self) -> None:
        # Defect (the one named in the brief): the current S10 demo ships scikit-learn.
        data = playground()
        problems = scope.import_scope_problems(10, data["demos"]["modules-packaging-cli"]["code"])
        self.assertTrue(
            any(module == "sklearn" and "sklearn" in message and "S10" in message for module, message in problems),
            problems,
        )

    def test_out_of_scope_imports_are_exactly_the_owed_set(self) -> None:
        # Defect: a new out-of-scope import is accepted, or a fixed one stays on the owed list.
        out_of_scope, _, _ = real_findings()
        self.assertEqual(out_of_scope, IMPORT_SCOPE_OWED)

    def test_unparsed_demos_are_exactly_the_owed_set(self) -> None:
        # Defect: a demo that does not parse is counted as clean, hiding its imports.
        _, unparsed, _ = real_findings()
        self.assertEqual(unparsed, NOT_PARSED_OWED)

    def test_every_demo_has_a_section(self) -> None:
        # Defect: a demo keyed by an id that is not a section is checked against no section at all.
        _, _, no_section = real_findings()
        self.assertEqual(no_section, [])


if __name__ == "__main__":
    unittest.main()
