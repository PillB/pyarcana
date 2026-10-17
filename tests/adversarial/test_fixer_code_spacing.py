"""A class guard for the formatting slips that the fixer-state work produced, review after review.

Slip one: `name =value`, an assignment (or comparison) with a space on one side of the operator and none
on the other. The first review found `order ={` in a file the draft rewrote; the fix removed that one line,
and the second review found four more of the same kind, two of them lines whose only change in the diff was
the broken spacing (`EVENTS =ROOT / ...` where main had `EVENTS = ROOT / ...`). Fixing the instance twice
is the pattern the retrospective rule calls out, so this fixes the class: the tokenizer reads every
operator that assigns or compares and refuses one whose two sides disagree about the space.

Slip two: a definition with no blank line before it. The third review found a test method written straight
under the previous method's last line in test_numbering_restamp.py (pycodestyle E301), the same family and
one the operator check cannot see. The syntax tree gives the statements of every block, so each `def` and
`class` that follows another statement is checked for the PEP 8 gap: two blank lines at module level, one
anywhere else. The first statement of a block and a definition right after a docstring need none, and a
comment directly above a definition counts as part of it. Too many blank lines (E303) is not judged, and a
run of one-line definitions (`def f(): return x`, which pycodestyle lets sit together) is not exempted:
none of the checked files has one, and this is stricter than pycodestyle only there.

Both look at the code, not at the text, so a `=` inside a string, a comment or a keyword argument
(`f(a=b)`, where neither side has a space) is not touched. Covered: every tools/fixer/*.py, and the tests
written with the fixer-state work (numbering_fixture.py, test_numbering_*.py, test_fixer_*.py).
tools/audit/report.py is left out on purpose: its aligned one-line style (`rej =collections...`) is older
than this work.

Mutation proofs are in the commit messages that add this file and extend it.
"""
from __future__ import annotations

import ast
import io
import tokenize
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

#: The operators whose two sides must agree. Augmented assignment, the walrus, comparisons and `->` too:
#: `x ==y` and `-> int` read as slips in exactly the same way.
OPERATORS = frozenset({"=", "+=", "-=", "*=", "/=", "//=", "%=", "**=", "|=", "&=", "^=", ">>=", "<<=", "@=",
                       ":=", "==", "!=", "<=", ">=", "->"})


def lopsided_operators(source: str) -> list[tuple[int, str]]:
    """(line number, the line) for each listed operator with a space on one side and none on the other.

    An operator at the end or start of a line has no neighbour on that line and is not judged."""
    tokens = list(tokenize.generate_tokens(io.StringIO(source).readline))
    lines = source.splitlines()
    found = []
    for before, op, after in zip(tokens, tokens[1:], tokens[2:]):
        if op.type != tokenize.OP or op.string not in OPERATORS:
            continue
        if before.end[0] != op.start[0] or after.start[0] != op.end[0]:
            continue
        if (op.start[1] > before.end[1]) != (after.start[1] > op.end[1]):
            found.append((op.start[0], lines[op.start[0] - 1].strip()))
    return found


DEFINITIONS = (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)


def statement_blocks(tree: ast.AST):
    """(owner, statements) for every block of statements in the tree: bodies, `else` and `finally` parts."""
    for owner in ast.walk(tree):
        for field in ("body", "orelse", "finalbody"):
            block = getattr(owner, field, None)
            if isinstance(block, list) and block and isinstance(block[0], ast.stmt):
                yield owner, block


def first_line_of(node: ast.FunctionDef | ast.AsyncFunctionDef | ast.ClassDef) -> int:
    """The line a definition starts on: its first decorator, or the `def`/`class` line."""
    return min([node.lineno] + [decorator.lineno for decorator in node.decorator_list])


def blank_run_ending_at(lines: list[str], index: int) -> tuple[int, int]:
    """(how many blank lines end at lines[index], the index of the line above them)."""
    count = 0
    while index >= 0 and not lines[index].strip():
        count, index = count + 1, index - 1
    return count, index


def blank_lines_above(lines: list[str], line_number: int) -> int:
    """Blank lines above a 1-based line: the run directly on top of it, or the run above the comment block
    that sits on top of it, whichever is longer (pycodestyle counts `# Foo` + blank + `def` the same way)."""
    just_above, index = blank_run_ending_at(lines, line_number - 2)
    while index >= 0 and lines[index].lstrip().startswith("#"):
        index -= 1
    above_comments, _ = blank_run_ending_at(lines, index)
    return max(just_above, above_comments)


def is_docstring(node: ast.stmt) -> bool:
    return isinstance(node, ast.Expr) and isinstance(node.value, ast.Constant) and isinstance(node.value.value, str)


def unseparated_definitions(source: str) -> list[tuple[int, str]]:
    """(line number, the line) for each def or class that follows another statement without the PEP 8 gap.

    Two blank lines at module level, one in any other block. The first statement of a block has nothing
    above it to be separated from, and below a docstring pycodestyle asks for no gap in a class or function."""
    lines = source.splitlines()
    found = []
    for owner, block in statement_blocks(ast.parse(source)):
        wanted = 2 if isinstance(owner, ast.Module) else 1
        for before, node in zip(block, block[1:]):
            if not isinstance(node, DEFINITIONS):
                continue
            if wanted == 1 and before is block[0] and is_docstring(before):
                continue
            start = first_line_of(node)
            if blank_lines_above(lines, start) < wanted:
                found.append((start, lines[start - 1].strip()))
    return sorted(found)


def checked_files() -> list[Path]:
    fixer = sorted((ROOT / "tools/fixer").glob("*.py"))
    tests = sorted((ROOT / "tests/adversarial").glob("test_numbering_*.py"))
    tests += sorted((ROOT / "tests/adversarial").glob("test_fixer_*.py"))
    return fixer + [ROOT / "tests/adversarial/numbering_fixture.py"] + tests


class TheScannerSeesTheSlip(unittest.TestCase):
    """The scanner has to be able to fail: each line below is a slip that was, or could have been, written."""

    def test_a_space_before_and_none_after_is_a_slip(self) -> None:
        for line in ('EVENTS =ROOT / ".fixer/events.json"', 'tags ={tag_of(n) for n in range(1, 4)}',
                     'rules =(ROOT / "a").read_text()', "text_note =numbering.text_epoch_note(ROOT, epoch)"):
            with self.subTest(line=line):
                self.assertEqual(len(lopsided_operators(line + "\n")), 1)

    def test_none_before_and_a_space_after_is_a_slip(self) -> None:
        self.assertEqual(len(lopsided_operators("order= {}\n")), 1)

    def test_augmented_assignment_comparison_walrus_and_arrow_count_too(self) -> None:
        for line in ("total +=1", "ok = a ==b", "ok = a !=b", "ok = a <=b", "if (n :=1): pass", "def f() ->int: pass"):
            with self.subTest(line=line):
                self.assertEqual(len(lopsided_operators(line + "\n")), 1, line)

    def test_a_slip_is_reported_with_its_line_number(self) -> None:
        self.assertEqual(lopsided_operators("a = 1\nb =2\nc = 3\n"), [(2, "b =2")])


class TheScannerSeesAGluedDefinition(unittest.TestCase):
    """Each source below is a slip that was, or could have been, written: a definition with too few blank
    lines above it. The first is the shape the third review found in test_numbering_restamp.py."""

    def test_a_method_written_straight_under_the_previous_method(self) -> None:
        source = ("class Cases:\n    def first(self) -> None:\n        self.assertFalse(any(self.notes()))\n"
                  "    def second(self) -> None:\n        pass\n")
        self.assertEqual(unseparated_definitions(source), [(4, "def second(self) -> None:")])

    def test_a_decorated_method_is_reported_at_its_decorator(self) -> None:
        source = ("class Cases:\n    x = 1\n    @staticmethod\n    def second() -> None:\n        pass\n")
        self.assertEqual(unseparated_definitions(source), [(3, "@staticmethod")])

    def test_a_module_level_function_needs_two_blank_lines_not_one(self) -> None:
        source = "import os\n\n\ndef first() -> None:\n    pass\n\ndef second() -> None:\n    pass\n"
        self.assertEqual(unseparated_definitions(source), [(7, "def second() -> None:")])

    def test_a_comment_does_not_stand_in_for_the_blank_line(self) -> None:
        source = "class Cases:\n    x = 1\n    # the second case\n    def second(self) -> None:\n        pass\n"
        self.assertEqual(unseparated_definitions(source), [(4, "def second(self) -> None:")])

    def test_a_definition_in_an_else_or_a_finally_part_is_a_block_like_any_other(self) -> None:
        in_else = "if True:\n    pass\nelse:\n    x = 1\n    def f() -> None:\n        pass\n"
        in_finally = "try:\n    pass\nfinally:\n    x = 1\n    def g() -> None:\n        pass\n"
        self.assertEqual(unseparated_definitions(in_else), [(5, "def f() -> None:")])
        self.assertEqual(unseparated_definitions(in_finally), [(5, "def g() -> None:")])

    def test_an_async_method_and_a_nested_function_count_too(self) -> None:
        source = ("class Cases:\n    value = 1\n    async def run(self) -> None:\n        pass\n\n"
                  "    def outer(self) -> None:\n        x = 1\n        def inner() -> None:\n            pass\n")
        self.assertEqual([line for line, _ in unseparated_definitions(source)], [3, 8])


class TheScannerLeavesCorrectCodeAlone(unittest.TestCase):
    def test_spaced_and_unspaced_pairs_are_fine(self) -> None:
        source = ("x = 1\nx += 1\nok = a == b\nflag = a<=b\ndef f(a, b=1, *, c: int = 2) -> int:\n"
                  "    return g(a, key=b, flag=c)\nv = lambda a=1: a\n")
        self.assertEqual(lopsided_operators(source), [])

    def test_an_equals_sign_inside_a_string_or_a_comment_is_not_an_operator(self) -> None:
        source = 'text = "a =b and c= d"  # x =y\nother = f"{value=} and {value = }"\n'
        self.assertEqual(lopsided_operators(source), [])

    def test_a_continued_line_is_not_judged_across_the_break(self) -> None:
        source = "total = (first\n         == second)\nname = \\\n    value\n"
        self.assertEqual(lopsided_operators(source), [])


class TheScannerLeavesSeparatedDefinitionsAlone(unittest.TestCase):
    def test_the_first_statement_of_a_block_and_a_definition_under_a_docstring_need_no_gap(self) -> None:
        source = ('class Cases:\n    def first(self) -> None:\n        """Why."""\n\n    def second(self) -> None:\n'
                  '        def inner() -> None:\n            pass\n\n\nclass Other:\n    """Why."""\n'
                  '    def only(self) -> None:\n        pass\n')
        self.assertEqual(unseparated_definitions(source), [])

    def test_a_comment_above_a_definition_belongs_to_it_with_or_without_a_blank_line_after_the_comment(self) -> None:
        on_top = "class Cases:\n    x = 1\n\n    # the second case\n    def second(self) -> None:\n        pass\n"
        banner = "import os\n\n\n# Foo\n# Bar\n\ndef second() -> None:\n    pass\n"      # pycodestyle's own "Okay"
        for source in (on_top, banner):
            with self.subTest(source=source):
                self.assertEqual(unseparated_definitions(source), [])

    def test_a_properly_separated_decorated_method_is_not_a_slip(self) -> None:
        source = "class Cases:\n    x = 1\n\n    @staticmethod\n    def second() -> None:\n        pass\n"
        self.assertEqual(unseparated_definitions(source), [])

    def test_two_blank_lines_at_module_level_and_more_blank_lines_than_asked_are_not_judged(self) -> None:
        source = "import os\n\n\ndef first() -> None:\n    pass\n\n\n\n\nclass Second:\n    x = 1\n\n\n\n    def m(self) -> None:\n        pass\n"
        self.assertEqual(unseparated_definitions(source), [])


class NoCheckedFileHasTheSlip(unittest.TestCase):
    def test_the_set_of_files_is_not_empty_and_each_exists(self) -> None:
        files = checked_files()
        self.assertGreater(len(files), 20, "the glob found too few files; this test has stopped checking anything")
        self.assertEqual([f for f in files if not f.exists()], [])

    def test_no_fixer_tool_or_fixer_state_test_has_a_lopsided_operator(self) -> None:
        slips = [f"{path.relative_to(ROOT)}:{line}: {text}" for path in checked_files()
                 for line, text in lopsided_operators(path.read_text(encoding="utf-8"))]
        self.assertEqual(slips, [], "an operator with a space on one side only:\n  " + "\n  ".join(slips))

    def test_no_fixer_tool_or_fixer_state_test_has_a_definition_glued_to_the_line_above(self) -> None:
        slips = [f"{path.relative_to(ROOT)}:{line}: {text}" for path in checked_files()
                 for line, text in unseparated_definitions(path.read_text(encoding="utf-8"))]
        self.assertEqual(slips, [], "a def or class without its blank line(s) above:\n  " + "\n  ".join(slips))


if __name__ == "__main__":
    unittest.main()
