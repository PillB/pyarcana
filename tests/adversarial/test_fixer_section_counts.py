"""Guard G-12 (design_ruled_final.md section 4.3), count half: no fixer tool types a section count.

A section count is written once, in the numbering epoch, and read through tools/fixer/numbering.py. A
literal equal to the epoch's count (or to the count plus one, the end of `range(1, count + 1)`) anywhere in
tools/fixer, in code or in the text the tools print or send to Codex, is the count coming back as a typed
value. The scan follows the epoch, so after the renumber it catches a typed 55 and not only a typed 52, and
it keeps flagging 52 and 53 as stale copies. The scan reads every token, so an f-string's literal part and a
docstring are checked as text, and a comment is ignored.

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

#: The count the course had when this guard was written. A stale copy of it is still a typed count, so it
#: stays flagged after the epoch moves on.
HISTORICAL_COUNT = 52
#: Text tokens. Under Python 3.12 (PEP 701) an f-string's literal parts are FSTRING_MIDDLE, not STRING,
#: so both are scanned: a count in a Codex brief is as typed as one in code.
TEXT_TOKENS = {tokenize.STRING} | ({tokenize.FSTRING_MIDDLE} if hasattr(tokenize, "FSTRING_MIDDLE") else set())
#: Lines that hold a number equal to a count without being one, by file and exact stripped line. The place-name
#: cap is the test's own constant (tests/adversarial/test_over_localized_language.py PE_CITIES), and it equals
#: 55 by coincidence. An entry that stops matching a real line fails test_every_exemption_is_a_real_line.
NOT_A_COUNT = {
    "build_concept_prompt.py": {
        "PE_CITY_CAP = 55",
        'because "do not overuse place names" is unactionable at 53 of 55.',
    },
}


def count_patterns(count: int) -> tuple[set[str], re.Pattern]:
    """(number tokens, word pattern) that read as a section count when the epoch has `count` sections: the
    count, the exclusive end of `range(1, count + 1)`, and the same two for the historical count. The scanner
    follows the epoch, so after the renumber a typed 55 is caught and not only a typed 52."""
    counts = {count, HISTORICAL_COUNT}
    numbers = {str(n) for c in counts for n in (c, c + 1)}
    return numbers, re.compile(r"\b(?:" + "|".join(sorted(str(c) for c in counts)) + r")\b")


def python_count_literals(source: str, count: int | None = None) -> list[tuple[int, str]]:
    """(line, literal) for every count number token, and for every text token that says a count as a word."""
    numbers, word = count_patterns(numbering.load_epoch(ROOT).count if count is None else count)
    found = []
    for tok in tokenize.generate_tokens(io.StringIO(source).readline):
        if tok.type == tokenize.NUMBER and tok.string in numbers:
            found.append((tok.start[0], tok.string))
        elif tok.type in TEXT_TOKENS:
            for match in word.finditer(tok.string):
                line = tok.start[0] + tok.string.count("\n", 0, match.start())
                found.append((line, match.group(0)))
    return found


def shell_count_literals(source: str, count: int | None = None) -> list[tuple[int, str]]:
    """A shell line is code unless it starts with `#`; a count in code is a count typed."""
    _, word = count_patterns(numbering.load_epoch(ROOT).count if count is None else count)
    return [(n, word.search(line).group(0)) for n, line in enumerate(source.splitlines(), 1)
            if not line.lstrip().startswith("#") and word.search(line)]


def tree_count_literals(folder: Path) -> list[str]:
    hits = []
    for path in sorted(folder.glob("*.py")):
        source = path.read_text(encoding="utf-8")
        lines = source.splitlines()
        exempt = NOT_A_COUNT.get(path.name, set())
        hits += [f"{path.name}:{n}" for n, _ in python_count_literals(source) if lines[n - 1].strip() not in exempt]
    for path in sorted(folder.glob("*.sh")):
        hits += [f"{path.name}:{n}" for n, _ in shell_count_literals(path.read_text(encoding="utf-8"))]
    return hits


class NoSectionCountIsTyped(unittest.TestCase):
    def test_no_fixer_tool_types_the_section_count(self) -> None:
        self.assertEqual(tree_count_literals(FIXER), [],
                         "a fixer tool types a section count; derive it from numbering.load_epoch()")

    def test_every_exemption_is_a_real_line(self) -> None:
        """An exemption that matches nothing is a hole in the guard waiting for a typed count to hide in."""
        for name, lines in NOT_A_COUNT.items():
            present = {line.strip() for line in (FIXER / name).read_text(encoding="utf-8").splitlines()}
            self.assertEqual(sorted(lines - present), [], name)

    def test_the_scanner_follows_the_epoch_count(self) -> None:
        """After the renumber the epoch has 55 sections. A scan pinned to 52 and 53 would let `range(1, 56)`,
        `== 55` and a "55-section" brief through and flag only the 52 that should be gone. Planted counts."""
        for source in ("for i in range(1, 56):\n    pass\n", "if n == 55:\n    pass\n",
                       'x = f"a 55-section course {n}"\n', 'y = "all 55 sections"\n'):
            with self.subTest(source=source):
                self.assertEqual(len(python_count_literals(source, count=55)), 1)
        self.assertEqual(python_count_literals("n = 52\n", count=55), [(1, "52")])      # a stale copy still counts
        self.assertEqual(python_count_literals("n = 54\nm = 51\n", count=55), [])
        self.assertEqual(len(python_count_literals("n = 55\n", count=52)), 0)
        self.assertEqual(shell_count_literals("echo $((n / 55))\n", count=55), [(1, "55")])

    def test_the_scan_uses_the_real_epochs_count_by_default(self) -> None:
        count = numbering.load_epoch(ROOT).count
        self.assertEqual(len(python_count_literals(f"n = {count}\n")), 1)
        self.assertEqual(len(python_count_literals(f"for i in range(1, {count + 1}):\n    pass\n")), 1)

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
