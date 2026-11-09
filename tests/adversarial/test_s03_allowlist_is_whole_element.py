"""S03 allowlists check whole elements, never fragments of a delimited string.

S03-T1-A's theory defines `REGIONES_PERMITIDAS` as a `set` and explains that `in` then compares
whole elements, so `"R-N"` and `""` are not regions. Until batch-1 fix 01 (Nov 2026) the I Do demo,
the T3-A paragraph and We Do S03-T1-A-E2 stored the catalogue as `"R-NORTE|R-SUR|R-CENTRO"`, where
`in` matches substrings: `"" in "R-NORTE|R-SUR|R-CENTRO"` is True. A learner copying that pattern
accepts empty and truncated codes as allowed.

The detector parses every Python block in the section with `ast`. It flags an `in` / `not in` whose
right-hand side is a string literal containing `|`, or a name that the same block assigns such a
literal. The negative controls run it on the defective pattern to prove it can fail.
"""

from __future__ import annotations

import ast
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s03-decisions-rules.ts"

# Python blocks are template literals after `code: `; none of them contains a backtick.
BLOCK = re.compile(r"code:\s*`([^`]*)`")


def python_blocks(source: str) -> list[str]:
    blocks = []
    for raw in BLOCK.findall(source):
        text = raw.replace("\\\\", "\\")
        try:
            ast.parse(text)
        except SyntaxError:
            continue  # shell or other non-Python code
        blocks.append(text)
    return blocks


def _is_delimited_str(node: ast.AST) -> bool:
    return isinstance(node, ast.Constant) and isinstance(node.value, str) and "|" in node.value


def fragment_membership(code: str) -> list[str]:
    """Each `in` test of this block whose catalogue is a `|`-delimited string."""
    tree = ast.parse(code)
    delimited_names = {
        target.id
        for node in ast.walk(tree)
        if isinstance(node, ast.Assign) and _is_delimited_str(node.value)
        for target in node.targets
        if isinstance(target, ast.Name)
    }
    hits = []
    for node in ast.walk(tree):
        if not isinstance(node, ast.Compare):
            continue
        for op, right in zip(node.ops, node.comparators):
            if not isinstance(op, (ast.In, ast.NotIn)):
                continue
            if _is_delimited_str(right) or (isinstance(right, ast.Name) and right.id in delimited_names):
                hits.append(ast.unparse(node))
    return hits


class DetectorCanFail(unittest.TestCase):
    def test_flags_a_named_delimited_catalogue(self) -> None:
        bad = 'regiones = "R-NORTE|R-SUR"\nprint("R-N" in regiones)\n'
        self.assertEqual(fragment_membership(bad), ["'R-N' in regiones"])

    def test_flags_an_inline_delimited_literal_and_not_in(self) -> None:
        bad = 'x = "DNI"\nprint(x not in "DNI|CE|PAS")\n'
        self.assertEqual(len(fragment_membership(bad)), 1)

    def test_accepts_a_set_and_a_plain_substring_question(self) -> None:
        good = 'R = {"R-NORTE", "R-SUR"}\nprint("R-N" in R)\nprint("@" in "ana@ejemplo.pe")\n'
        self.assertEqual(fragment_membership(good), [])


class S03AllowlistsAreWholeElement(unittest.TestCase):
    def test_the_section_has_python_blocks_to_check(self) -> None:
        # A parser that silently found nothing would make the next test pass vacuously.
        self.assertGreaterEqual(len(python_blocks(SECTION.read_text(encoding="utf-8"))), 30)

    def test_no_membership_test_runs_against_a_delimited_string(self) -> None:
        offenders = []
        for code in python_blocks(SECTION.read_text(encoding="utf-8")):
            offenders += fragment_membership(code)
        self.assertEqual(offenders, [], "S03 checks membership against a '|'-delimited string")

    def test_prose_does_not_recommend_a_delimited_catalogue(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        self.assertNotIn('guardar el texto `REGIONES_PERMITIDAS = "R-NORTE|R-SUR|R-CENTRO"`', source)
        self.assertNotIn("un texto puede reunir varios códigos separados por `|`", source)


if __name__ == "__main__":
    unittest.main()
