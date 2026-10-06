"""The owner's live decisions have to reach the round that must honour them.

The owner answers questions no instrument can settle - which money types a section accepts,
where a capstone is gated, which of two contradicting sections moves. Those answers arrive in
chat, and a decision that lives only in a chat message is not one a later round will honour.
LEDGER_NOTES already records the general version of this failure: D2 was stated in the S03
prompt as a standing rule and S03 still shipped a DNI, because stating a rule is not the same
as giving the round something that acts on it.

So `audit/fixer/OWNER_DECISIONS.md` is injected whole into every prompt that builds a round,
beside `decisions.md`. These tests hold that wiring, and the shape that makes the file
maintainable: every decision carries a scope and the condition that retires it, because the
owner asked for a document "you look at in each round until no extant decision is relevant" -
a decision with no expiry condition cannot be retired, and a file of dead decisions stops
being read.
"""
from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOC = ROOT / "audit/fixer/OWNER_DECISIONS.md"
#: Every builder that assembles a round's brief for codex.
BUILDERS = ["tools/fixer/build_concept_prompt.py", "tools/fixer/build_prompt.py"]


def decisions(text: str) -> list[str]:
    """Each live `### O<n> — ...` block, up to the next heading of the same or higher level."""
    parts = re.split(r"\n(?=### )", text.split("\n## Archive")[0])
    return [p for p in parts if p.startswith("### ")]


def recorded(text: str) -> list[str]:
    """Every `### O<n>` heading in the file, live or archived."""
    return re.findall(r"^### O\d+\b.*$", text, re.M)


class OwnerDecisionsReachTheRound(unittest.TestCase):
    def test_the_document_exists_and_holds_decisions(self):
        """Live or archived. Retiring every decision is what the file is for, so an empty live
        list is success; it used to fail this test. A file with no decision anywhere is not."""
        self.assertTrue(DOC.exists(), "the owner's decisions have nowhere to live")
        self.assertTrue(recorded(DOC.read_text(encoding="utf-8")),
                        "no `### O<n>` entry, live or archived; the file has stopped being the record")

    def test_retiring_every_decision_is_not_a_broken_record(self):
        archived = ("# Owner decisions, live\n\n## Archive\n\n### O1 — retired 2026-10-03\n"
                    "**Scope:** x.\n**Retire when:** y.\n")
        self.assertEqual(decisions(archived), [], "an archived decision is not live")
        self.assertTrue(recorded(archived))
        self.assertFalse(recorded("# Owner decisions, live\n\n## Archive\n\n*(empty)*\n"))

    def test_every_builder_injects_it(self):
        for rel in BUILDERS:
            with self.subTest(builder=rel):
                source = (ROOT / rel).read_text(encoding="utf-8")
                self.assertIn("audit/fixer/OWNER_DECISIONS.md", source,
                              "this builder sends codex a brief that cannot see the owner's decisions")

    def test_it_is_injected_beside_the_standing_decisions_not_instead_of_them(self):
        """They are different things: decisions.md never expires, this one does."""
        for rel in BUILDERS:
            with self.subTest(builder=rel):
                source = (ROOT / rel).read_text(encoding="utf-8")
                self.assertIn("audit/fixer/decisions.md", source)

    def test_every_decision_states_its_scope_and_what_retires_it(self):
        missing = []
        for block in decisions(DOC.read_text(encoding="utf-8")):
            head = block.splitlines()[0]
            if "**Scope:**" not in block:
                missing.append(f"{head}: no Scope")
            if "**Retire when:**" not in block:
                missing.append(f"{head}: no Retire when")
        self.assertEqual(missing, [], "a decision with no expiry condition can never be retired")

    def test_the_readiness_procedure_points_at_it(self):
        proc = (ROOT / "audit/fixer/LESSON_READINESS.md").read_text(encoding="utf-8")
        self.assertIn("OWNER_DECISIONS.md", proc,
                      "the procedure a round follows must send the reader here")


if __name__ == "__main__":
    unittest.main()
