"""A class guard for the spacing slip that the fixer-state work produced twice.

The slip: `name =value`, an assignment (or comparison) with a space on one side of the operator and none
on the other. The first review found `order ={` in a file the draft rewrote; the fix removed that one line,
and the second review found four more of the same kind, two of them lines whose only change in the diff was
the broken spacing (`EVENTS =ROOT / ...` where main had `EVENTS = ROOT / ...`). Fixing the instance twice
is the pattern the retrospective rule calls out, so this fixes the class: the tokenizer reads every
operator that assigns or compares and refuses one whose two sides disagree about the space.

It looks at tokens, not text, so a `=` inside a string, a comment or a keyword argument (`f(a=b)`, where
neither side has a space) is not touched. Covered: every tools/fixer/*.py, and the tests written with the
fixer-state work (numbering_fixture.py, test_numbering_*.py, test_fixer_*.py). tools/audit/report.py is
left out on purpose: its aligned one-line style (`rej =collections...`) is older than this work.

Mutation proofs are in the commit message that adds this file.
"""
from __future__ import annotations

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


class NoCheckedFileHasTheSlip(unittest.TestCase):
    def test_the_set_of_files_is_not_empty_and_each_exists(self) -> None:
        files = checked_files()
        self.assertGreater(len(files), 20, "the glob found too few files; this test has stopped checking anything")
        self.assertEqual([f for f in files if not f.exists()], [])

    def test_no_fixer_tool_or_fixer_state_test_has_a_lopsided_operator(self) -> None:
        slips = [f"{path.relative_to(ROOT)}:{line}: {text}" for path in checked_files()
                 for line, text in lopsided_operators(path.read_text(encoding="utf-8"))]
        self.assertEqual(slips, [], "an operator with a space on one side only:\n  " + "\n  ".join(slips))


if __name__ == "__main__":
    unittest.main()
