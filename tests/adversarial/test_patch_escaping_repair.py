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
"""
from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def would_repair(anchor: str, repl: str, delim: str = '"') -> bool:
    """The guard as apply_patches.py implements it, kept in step by the last test here."""
    esc = "\\" + delim
    if esc not in anchor or esc in repl:
        return False
    if re.search(r"(?<!\\)" + re.escape(delim), anchor):
        return False
    return bool(re.findall(r"(?<!\\)" + re.escape(delim), repl))


class PatchEscapingRepair(unittest.TestCase):
    def test_a_replacement_for_one_quoted_field_is_repaired(self):
        """The S03 case: the anchor is wholly inside a `"..."` field and escapes every quote."""
        anchor = 'Primero usamos strings cortos (\\"accept\\" / \\"review\\") para observar.'
        repl = 'Usarás etiquetas cortas como `"accept"`, `"review"` y `"reject"`.'
        self.assertTrue(would_repair(anchor, repl))

    def test_a_whole_object_anchor_is_left_alone(self):
        """The S02 case: mixed contexts, so no single delimiter encloses the span."""
        anchor = (
            "{\n  title: 'x',\n  hint: \\\"cuida los espacios\\\",\n"
            "  code: `nombres_raw = \"   \"\nprint(nombres_raw)`,\n}"
        )
        repl = "{\n  title: 'y',\n  code: `edad_raw = \"21\"\nprint(edad_raw)`,\n}"
        self.assertFalse(
            would_repair(anchor, repl),
            "escaping here rewrites the Python inside the template into a SyntaxError",
        )

    def test_a_replacement_that_already_escapes_is_left_alone(self):
        """A mix in the REPLACEMENT means the author had intent; guessing at it corrupts."""
        anchor = 'dice \\"hola\\" al entrar.'
        repl = 'dice \\"hola\\" y "adiós" al salir.'
        self.assertFalse(would_repair(anchor, repl))

    def test_the_real_s02_corruption_is_caught_by_the_rule(self):
        """Replays the actual patch that broke, if its result file is still present."""
        result = ROOT / ".fixer/S02k.result.json"
        if not result.exists():
            self.skipTest("no S02 round artefacts in this checkout")
        for p in json.loads(result.read_text(encoding="utf-8"))["patches"]:
            with self.subTest(p.get("field_path")):
                self.assertFalse(
                    would_repair(p["anchor"], p["replacement"]),
                    "a whole-object patch must never have its quotes rewritten",
                )

    def test_apply_patches_still_implements_this_guard(self):
        source = (ROOT / "tools/fixer/apply_patches.py").read_text(encoding="utf-8")
        self.assertIn("if re.search(r'(?<!\\\\)' + re.escape(delim), anchor):", source)


if __name__ == "__main__":
    unittest.main()
