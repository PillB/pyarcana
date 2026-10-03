"""When the applier may fix a replacement's quoting, and when it must not.

`apply_patches.py` is a literal string substitution into TypeScript. LEDGER_NOTES records S39,
where an unescaped `"secrets_in_repo"` closed a string early and cost the batch; the rollback was
fixed then, the escaping was not, and it recurred on S03 with esbuild reporting
`Expected "]" but found "accept"` — naming neither the patch nor the cause.

So the applier now escapes the delimiter the anchor proves encloses it. The first version of that
repair was too eager and corrupted content: a whole-exercise anchor contains both a double-quoted
`title:` and a backtick `code:` template, so it has `\\"` AND bare `"`. Escaping the bare ones
rewrote the Python inside the template as `nombres_raw = \\"   \\"`, a SyntaxError. The typecheck
passed — it is valid TypeScript and broken Python — and only the snippet gate caught it.

The rule that survives both: repair only when the anchor proves it sits ENTIRELY inside one
literal of that delimiter, every occurrence escaped and none bare. These are the two real cases.

These tests used to exercise `would_repair`, a copy of the guard written in this file: one of its
three delimiters, a True/False instead of the repaired text, tied to the applier by one pinned
source line. They now call `matched_escaping` itself and check what it returns - per delimiter,
on the two real cases, on a real mixed-quote patch, and on every escaped string in the course.
"""
from __future__ import annotations

import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))

from apply_patches import matched_escaping  # noqa: E402

FIXTURE = ROOT / "tests/fixtures/patches/s02_mixed_quote_patch.json"
SECTIONS = ROOT / "src/lib/course/sections"
#: A double-quoted TypeScript string literal, its escapes included.
LITERAL = re.compile(r'"((?:\\.|[^"\\\n])*)"')


class PatchEscapingRepair(unittest.TestCase):
    def test_a_replacement_for_one_quoted_field_is_repaired(self):
        """The S03 case: the anchor is wholly inside a `"..."` field and escapes every quote."""
        anchor = 'Primero usamos strings cortos (\\"accept\\" / \\"review\\") para observar.'
        repl = 'Usarás etiquetas cortas como `"accept"`, `"review"` y `"reject"`.'
        self.assertEqual(
            matched_escaping(anchor, repl),
            ('Usarás etiquetas cortas como `\\"accept\\"`, `\\"review\\"` y `\\"reject\\"`.', 6),
        )

    def test_each_delimiter_is_repaired_on_its_own_evidence(self):
        """The copy these tests used to run knew only `"`; the applier also guards `'` and `` ` ``."""
        for delim in ('"', "'", "`"):
            with self.subTest(delim=delim):
                esc = "\\" + delim
                repl = f"usa {delim}x{delim} y {delim}y{delim} aquí"
                self.assertEqual(matched_escaping(f"usa {esc}x{esc} aquí", repl),
                                 (repl.replace(delim, esc), 4))

    def test_a_whole_object_anchor_is_left_alone(self):
        """The S02 case: mixed contexts, so no single delimiter encloses the span."""
        anchor = (
            "{\n  title: 'x',\n  hint: \\\"cuida los espacios\\\",\n"
            "  code: `nombres_raw = \"   \"\nprint(nombres_raw)`,\n}"
        )
        repl = "{\n  title: 'y',\n  code: `edad_raw = \"21\"\nprint(edad_raw)`,\n}"
        self.assertEqual(
            matched_escaping(anchor, repl), (repl, 0),
            "escaping here rewrites the Python inside the template into a SyntaxError",
        )

    def test_a_replacement_that_already_escapes_is_left_alone(self):
        """A mix in the REPLACEMENT means the author had intent; guessing at it corrupts."""
        anchor = 'dice \\"hola\\" al entrar.'
        repl = 'dice \\"hola\\" y "adiós" al salir.'
        self.assertEqual(matched_escaping(anchor, repl), (repl, 0))

    def test_a_real_mixed_quote_patch_is_left_alone(self):
        """A real codex patch with the hazardous shape, committed as a fixture.

        This replaces a replay of `.fixer/S02k.result.json`: gitignored, so it skipped in CI, and
        where the file did exist it held no mixed-quote anchor at all, so it passed vacuously.
        """
        patch = json.loads(FIXTURE.read_text(encoding="utf-8"))
        anchor = patch["anchor"]
        self.assertIn('\\"', anchor, "the fixture lost the escaped quote that makes it this case")
        self.assertRegex(anchor, r'(?<!\\)"', "the fixture lost the bare quote that makes it this case")
        self.assertEqual(matched_escaping(anchor, patch["replacement"]), (patch["replacement"], 0))


class EveryEscapedLiteralInTheCourse(unittest.TestCase):
    """The rule on real data: every double-quoted string in the live sections that holds `\\"`."""

    @classmethod
    def setUpClass(cls):
        cls.literals = [
            m for p in sorted(SECTIONS.glob("s*.ts"))
            for m in LITERAL.finditer(p.read_text(encoding="utf-8"))
            if '\\"' in m.group(1)
        ]

    def test_there_is_something_to_check(self):
        self.assertGreater(len(self.literals), 0,
                           "no escaped quote left in any section; the tests below would check nothing")

    def test_inside_one_literal_the_repair_restores_the_source(self):
        """A replacement that drops the escapes gets exactly the course's own escaping back."""
        for m in self.literals:
            inner = m.group(1)
            with self.subTest(inner[:60]):
                self.assertEqual(matched_escaping(inner, inner.replace('\\"', '"')),
                                 (inner, inner.count('\\"')))

    def test_a_span_holding_its_own_delimiters_is_never_repaired(self):
        """With the literal's bare quotes in the anchor, no delimiter is proven - leave it."""
        for m in self.literals:
            span = m.group(0)
            with self.subTest(span[:60]):
                repaired, _ = matched_escaping(span, span.replace('\\"', '"'))
                self.assertNotIn('\\"', repaired)


if __name__ == "__main__":
    unittest.main()
