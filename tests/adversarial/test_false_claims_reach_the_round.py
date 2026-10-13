"""Contract: every brief Codex gets says which statements are already known to be false.

The false claims in audit/fixer/known_false_claims.json came back, or survived, because each
round was briefed on prose and never told the claim was false - the S18 bootstrap line was
polished twice and kept. Stating a rule is not the same as giving the round something that acts
on it (LEDGER_NOTES, D2), so the block is injected by code, and tools/fixer/apply_patches.py also
refuses a patch that adds a hit.

The builders are found by glob, not listed: a new builder that leaves the block out fails here.
"""
from __future__ import annotations

import ast
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))

import false_claims  # noqa: E402


def injects(source: str) -> bool:
    """The builder imports brief_block from false_claims and calls it."""
    tree = ast.parse(source)
    imported = any(isinstance(n, ast.ImportFrom) and n.module == "false_claims"
                   and any(a.name == "brief_block" for a in n.names) for n in ast.walk(tree))
    names = {a.asname or a.name for n in ast.walk(tree) if isinstance(n, ast.ImportFrom)
             and n.module == "false_claims" for a in n.names if a.name == "brief_block"}
    called = any(isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id in names
                 for n in ast.walk(tree))
    return imported and called


class FalseClaimsReachTheRound(unittest.TestCase):
    def test_the_block_carries_every_entry_its_original_and_its_correct_form(self) -> None:
        block = false_claims.brief_block()
        entries = json.loads(false_claims.REGISTRY.read_text(encoding="utf-8"))["entries"]
        self.assertGreaterEqual(len(entries), 9)
        self.assertTrue(block.startswith(false_claims.HEADING))
        for e in entries:
            with self.subTest(entry=e["id"]):
                self.assertIn(e["id"], block)
                self.assertIn(e["examples"]["positive"][0], block)
                self.assertIn(e["correct_statement"], block)
                self.assertIn(e["citation"]["url"], block)

    def test_the_detector_tells_an_injecting_builder_from_one_that_only_mentions_it(self) -> None:
        good = "from false_claims import brief_block as b\nprint(f'{b()}')\n"
        unused = "from false_claims import brief_block\nprint('# see false_claims.brief_block')\n"
        absent = "print('a brief')\n"
        self.assertTrue(injects(good))
        self.assertFalse(injects(unused))
        self.assertFalse(injects(absent))

    def test_every_builder_injects_it(self) -> None:
        builders = sorted((ROOT / "tools/fixer").glob("build_*.py"))
        self.assertGreaterEqual(len(builders), 5, "the builders moved; this test no longer sees them")
        missing = [b.name for b in builders if not injects(b.read_text(encoding="utf-8"))]
        self.assertEqual(missing, [], "these builders brief Codex without the known false statements")


if __name__ == "__main__":
    unittest.main()
