"""Contract: every brief Codex gets carries the writing rules, the owner's structure among them.

The owner's standing structure for lesson prose (say a new idea two ways, recall what it rests
on, never staccato) lived in no repository file until 2026-10-17. So no round was ever asked for
it, and S12-T3-B went through fifteen drafts before one met it (LEDGER_NOTES, "Correct and
clipped is not taught"). It is now writing rules B7 and D13. A rule reaches Codex only because a
builder in tools/fixer/ puts audit/fixer/writing_rules.md into the brief; nothing checked that
any builder does, so a builder that dropped it would fail silently and the rule would go unread
again.

The builders are found by glob, not listed: a new builder that leaves the rules out fails here.
"""
from __future__ import annotations

import ast
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RULES = ROOT / "audit/fixer/writing_rules.md"


def _reads_rules(node: ast.AST) -> bool:
    """`<...writing_rules.md...>.read_text(...)`, however the path is spelled."""
    return (isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute)
            and node.func.attr == "read_text"
            and any(isinstance(c, ast.Constant) and isinstance(c.value, str)
                    and c.value.endswith("writing_rules.md") for c in ast.walk(node.func.value)))


def injects(source: str) -> bool:
    """The builder puts the text of writing_rules.md into what it emits: either the read is an
    argument of a call (`block("...", rules_text.read_text())`), or it is bound to a name that an
    f-string interpolates. Reading the file and never using it does not count."""
    tree = ast.parse(source)
    for node in ast.walk(tree):
        if isinstance(node, ast.Call) and any(_reads_rules(a) or any(_reads_rules(x) for x in ast.walk(a))
                                               for a in node.args):
            return True
    names = {t.id for n in ast.walk(tree) if isinstance(n, ast.Assign) and _reads_rules(n.value)
             for t in n.targets if isinstance(t, ast.Name)}
    return any(isinstance(n, ast.FormattedValue) and isinstance(n.value, ast.Name) and n.value.id in names
               for n in ast.walk(tree))


class WritingRulesReachTheRound(unittest.TestCase):
    def test_the_owner_structure_is_a_rule(self) -> None:
        """B7 and D13 exist and say what the owner asked for, so deleting either fails here."""
        text = RULES.read_text(encoding="utf-8")
        b7 = re.search(r"^- \*\*B7 — .*?(?=^- \*\*|^## )", text, re.M | re.S)
        d13 = re.search(r"^- \*\*D13 — .*?(?=^- \*\*|^## )", text, re.M | re.S)
        self.assertIsNotNone(b7, "rule B7 (say a new idea two ways, recall what it rests on) is gone")
        self.assertIsNotNone(d13, "rule D13 (no staccato) is gone")
        self.assertIn("es decir", b7.group(0))
        self.assertIn("first use in", b7.group(0))
        self.assertIn("staccato", d13.group(0))

    def test_the_detector_tells_an_injecting_builder_from_one_that_only_reads(self) -> None:
        inline = 'p = block("W", (ROOT / "audit/fixer/writing_rules.md").read_text(encoding="utf-8") + "x")\n'
        fstring = 'rules = (ROOT / "audit/fixer/writing_rules.md").read_text()\nout = f"""{rules}"""\n'
        unused = 'rules = (ROOT / "audit/fixer/writing_rules.md").read_text()\nout = "no rules here"\n'
        other = 'notes = (ROOT / "audit/fixer/LEDGER_NOTES.md").read_text()\nout = f"{notes}"\n'
        self.assertTrue(injects(inline))
        self.assertTrue(injects(fstring))
        self.assertFalse(injects(unused))
        self.assertFalse(injects(other))

    def test_every_builder_injects_the_rules(self) -> None:
        builders = sorted((ROOT / "tools/fixer").glob("build_*.py"))
        self.assertGreaterEqual(len(builders), 5, "the builders moved; this test no longer sees them")
        missing = [b.name for b in builders if not injects(b.read_text(encoding="utf-8"))]
        self.assertEqual(missing, [], "these builders brief Codex without the writing rules")


if __name__ == "__main__":
    unittest.main()
