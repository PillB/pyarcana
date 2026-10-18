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


def _carries(node: ast.AST, tainted: set[str]) -> bool:
    """The expression holds the rules text: the read itself, or a name it reached."""
    return any(_reads_rules(n) or (isinstance(n, ast.Name) and n.id in tainted) for n in ast.walk(node))


def _is_stdout(node: ast.AST) -> bool:
    return (isinstance(node, ast.Attribute) and node.attr == "stdout"
            and isinstance(node.value, ast.Name) and node.value.id == "sys")


def _writes_stdout(call: ast.Call) -> bool:
    """`print(...)` to stdout (no `file=`, or `file=sys.stdout`), or `sys.stdout.write(...)`.
    The run_*.sh scripts redirect only a builder's stdout into .fixer/<TAG>.prompt.txt, so that
    is the brief; stderr is a diagnostic Codex never sees."""
    if isinstance(call.func, ast.Name) and call.func.id == "print":
        return all(k.arg != "file" or _is_stdout(k.value) for k in call.keywords)
    return isinstance(call.func, ast.Attribute) and call.func.attr == "write" and _is_stdout(call.func.value)


def injects(source: str) -> bool:
    """The text of writing_rules.md reaches what the builder writes to stdout. The read is
    followed through assignments and `append`/`extend`/`insert` into the names it reaches, and
    one of them, or the read itself, must be an argument of a stdout write. Reading the file,
    passing it to an unrelated call, or printing it to stderr does not count (Codex review on
    #109: the first detector accepted any f-string and any call)."""
    tree = ast.parse(source)
    tainted: set[str] = set()
    grew = True
    while grew:
        grew = False
        for n in ast.walk(tree):
            targets: list[ast.AST] = []
            if isinstance(n, ast.Assign) and _carries(n.value, tainted):
                targets = list(n.targets)
            elif isinstance(n, (ast.AugAssign, ast.AnnAssign)) and n.value is not None and _carries(n.value, tainted):
                targets = [n.target]
            elif (isinstance(n, ast.Call) and isinstance(n.func, ast.Attribute)
                  and n.func.attr in ("append", "extend", "insert") and any(_carries(a, tainted) for a in n.args)):
                targets = [n.func.value]
            for name in (x.id for t in targets for x in ast.walk(t) if isinstance(x, ast.Name)):
                if name not in tainted:
                    tainted.add(name)
                    grew = True
    return any(isinstance(n, ast.Call) and _writes_stdout(n) and any(_carries(a, tainted) for a in n.args)
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

    def test_the_detector_counts_only_what_reaches_stdout(self) -> None:
        read = '(ROOT / "audit/fixer/writing_rules.md").read_text(encoding="utf-8")'
        reaches = {
            # build_prompt.py's shape: the read sits in a list that is joined and written.
            "list, joined, sys.stdout.write": f'p = [block("W", {read} + "x")]\nsys.stdout.write("".join(p))\n',
            # the other builders' shape: bound to a name an f-string interpolates, printed.
            "name in an f-string, print": f'rules = {read}\nprint(f"""a {{rules}} b""")\n',
            "appended, then printed": f'parts = []\nparts.append({read})\nprint("".join(parts))\n',
            "print with file=sys.stdout": f'rules = {read}\nprint(rules, file=sys.stdout)\n',
        }
        never = {
            "read, never used": f'rules = {read}\nprint("no rules here")\n',
            # Codex review on #109: both of these passed the first detector.
            "rules only in a stderr diagnostic": f'rules = {read}\nprint(f"{{rules}}", file=sys.stderr)\nprint("brief")\n',
            "rules passed to an unrelated call": f'n = len({read})\nprint("brief")\n',
            "another file, printed": 'notes = (ROOT / "audit/fixer/LEDGER_NOTES.md").read_text()\nprint(f"{notes}")\n',
        }
        for label, src in reaches.items():
            with self.subTest(reaches=label):
                self.assertTrue(injects(src))
        for label, src in never.items():
            with self.subTest(never=label):
                self.assertFalse(injects(src))

    def test_every_builder_injects_the_rules(self) -> None:
        builders = sorted((ROOT / "tools/fixer").glob("build_*.py"))
        self.assertGreaterEqual(len(builders), 5, "the builders moved; this test no longer sees them")
        missing = [b.name for b in builders if not injects(b.read_text(encoding="utf-8"))]
        self.assertEqual(missing, [], "these builders brief Codex without the writing rules")


if __name__ == "__main__":
    unittest.main()
