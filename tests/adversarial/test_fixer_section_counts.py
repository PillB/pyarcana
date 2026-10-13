"""Guard G-12 (design_ruled_final.md section 4.3), count half: no fixer tool types a section count.

A section count is written once, in the numbering epoch, and read through tools/fixer/numbering.py. A
literal 52 (or the 53 of `range(1, 53)`) anywhere in tools/fixer, in code or in the text the tools print
or send to Codex, is the count coming back as a typed value. The scan reads every token, so an
f-string's literal part and a docstring are checked as text, and a comment is ignored.

Also checked: apply_patches.py's section probe checks the epoch's count rather than a fixed one, and
apply_patches resolves numbers through the epoch and refuses one the epoch does not hold.

Mutation proofs (recorded in the commit messages): `range(1, 53)` restored in progress.py fails
test_no_fixer_tool_types_the_section_count; `!== 52` restored in apply_patches.sections_probe_source fails
test_apply_patches_probe_checks_the_epoch_count.
"""
from __future__ import annotations

import io
import re
import sys
import tokenize
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FIXER = ROOT / "tools/fixer"
sys.path.insert(0, str(FIXER))

import apply_patches  # noqa: E402
import numbering  # noqa: E402

#: A section count, or the exclusive end of `range(1, count + 1)`: the two forms a count takes in code.
COUNT_LITERALS = {"52", "53"}
WORD_52 = re.compile(r"\b52\b")
#: Text tokens. Under Python 3.12 (PEP 701) an f-string's literal parts are FSTRING_MIDDLE, not STRING,
#: so both are scanned: a count in a Codex brief is as typed as one in code.
TEXT_TOKENS = {tokenize.STRING} | ({tokenize.FSTRING_MIDDLE} if hasattr(tokenize, "FSTRING_MIDDLE") else set())


def python_count_literals(source: str) -> list[tuple[int, str]]:
    """(line, where) for every count number token, and for every text token that says 52 as a word."""
    found = []
    for tok in tokenize.generate_tokens(io.StringIO(source).readline):
        if tok.type == tokenize.NUMBER and tok.string in COUNT_LITERALS:
            found.append((tok.start[0], tok.string))
        elif tok.type in TEXT_TOKENS:
            for match in WORD_52.finditer(tok.string):
                line = tok.start[0] + tok.string.count("\n", 0, match.start())
                found.append((line, "52"))
    return found


def shell_count_literals(source: str) -> list[tuple[int, str]]:
    """A shell line is code unless it starts with `#`; a count in code is a count typed."""
    return [(n, "52") for n, line in enumerate(source.splitlines(), 1)
            if not line.lstrip().startswith("#") and WORD_52.search(line)]


def tree_count_literals(folder: Path) -> list[str]:
    hits = []
    for path in sorted(folder.glob("*.py")):
        hits += [f"{path.name}:{n}" for n, _ in python_count_literals(path.read_text(encoding="utf-8"))]
    for path in sorted(folder.glob("*.sh")):
        hits += [f"{path.name}:{n}" for n, _ in shell_count_literals(path.read_text(encoding="utf-8"))]
    return hits


class NoSectionCountIsTyped(unittest.TestCase):
    def test_no_fixer_tool_types_the_section_count(self) -> None:
        self.assertEqual(tree_count_literals(FIXER), [],
                         "a fixer tool types a section count; derive it from numbering.load_epoch()")

    def test_the_scanner_flags_each_form_a_count_takes(self) -> None:
        """The control: a scan that finds nothing in the real tree proves nothing unless it finds a planted
        count. These are the forms the old progress.py, ledger.py, preflight.py and build_prompt.py used."""
        self.assertEqual(python_count_literals("for i in range(1, 53):\n    pass\n"), [(1, "53")])
        self.assertEqual(python_count_literals("n = 52\n"), [(1, "52")])
        self.assertEqual([n for n, _ in python_count_literals('x = f"{done}/52"\n')], [1])
        self.assertEqual([n for n, _ in python_count_literals('p = """a 52-section course\n"""\n')], [1])
        self.assertEqual([n for n, _ in python_count_literals('x = f"a 52-section course {n}"\n')], [1])
        self.assertEqual([n for n, _ in python_count_literals('x = f"""a\nb {n} of 52\n"""\n')], [2])

    def test_the_scanner_reports_the_line_a_count_is_on(self) -> None:
        self.assertEqual([n for n, _ in python_count_literals('a = 1\nb = f"""x {a}\nall 52 here {a}"""\n')], [3])

    def test_the_scanner_ignores_the_roadmap_name_numbers_and_comments(self) -> None:
        self.assertEqual(python_count_literals('ROADMAP = "learning_roadmap_52_V3.md"\n'), [])
        self.assertEqual(python_count_literals("x = 520 + 0x34\n"), [])
        self.assertEqual(python_count_literals("# the ledger read 8/52 before\n"), [])
        self.assertEqual(shell_count_literals("# 8/52 in the old column\n"), [])
        self.assertEqual(shell_count_literals("echo ok\n"), [])


class ApplyPatchesDerivesTheCount(unittest.TestCase):
    def test_apply_patches_probe_checks_the_epoch_count(self) -> None:
        """The probe that proves the sections still load compares against the count it is given, so it
        cannot pass with a stale count. Asked with a different count it must check that one."""
        count = numbering.load_epoch(ROOT).count
        self.assertIn(f"!== {count}", apply_patches.sections_probe_source(count))
        probe = apply_patches.sections_probe_source(7)
        self.assertIn("!== 7", probe)
        self.assertNotIn("!== 52", probe)

    def test_apply_patches_resolves_numbers_through_the_epoch(self) -> None:
        epoch = numbering.load_epoch(ROOT)
        self.assertEqual(apply_patches.resolve_slug("S01"), epoch.slugs[0])
        with self.assertRaises(SystemExit):
            apply_patches.resolve_slug(f"S{epoch.count + 1:02d}")


if __name__ == "__main__":
    unittest.main()
