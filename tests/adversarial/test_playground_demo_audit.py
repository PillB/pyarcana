"""The pinned-output check for the playground demos (scripts/playground_demo_audit.py).

CodePlayground marks a demo passed when the learner's stdout, trimmed, equals its expectedOutput,
trimmed. The content gate applies that rule under the pinned interpreter. Each test below names
the defect it guards; the commit that adds this file records the mutation that turns each red.
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(Path(__file__).resolve().parent))

import playground_demo_audit as audit  # noqa: E402
from playground_truth import playground  # noqa: E402


def synthetic(code: str, expected: str) -> dict:
    return {"code": code, "expectedOutput": expected, "title": "synthetic"}


class SyntheticDemosAgainstTheirOutput(unittest.TestCase):
    def test_wrong_expected_output_is_reported(self) -> None:
        # Defect: a demo whose expectedOutput no longer matches its code passes the gate.
        verdict = audit.audit_demo("synthetic", synthetic("print('hola')", "adios"))
        self.assertEqual(verdict["status"], "fail", verdict)
        self.assertEqual(verdict["reason"], "output_mismatch")

    def test_output_is_compared_trimmed_as_the_playground_compares_it(self) -> None:
        # Defect (the other side): an untrimmed comparison fails a demo the playground passes,
        # because print() ends the line that expectedOutput leaves off.
        verdict = audit.audit_demo("synthetic", synthetic("print('hola')", "hola"))
        self.assertEqual(verdict["status"], "pass", verdict)

    def test_a_demo_that_raises_is_reported_even_when_its_output_matches(self) -> None:
        # Defect: only stdout is compared, so a demo that prints the right text and then fails
        # passes the gate. The playground marks that demo failed.
        verdict = audit.audit_demo("synthetic", synthetic("print('hola')\nraise SystemExit(3)", "hola"))
        self.assertEqual(verdict["status"], "fail", verdict)


class OwedSetIsAnExactRatchet(unittest.TestCase):
    def test_a_new_mismatch_is_a_problem(self) -> None:
        # Defect: the owed list grows silently, because a demo that starts to mismatch is not reported.
        self.assertEqual(len(audit.ownership_problems({"nuevo"}, frozenset())), 1)

    def test_an_owed_demo_that_now_matches_is_a_problem(self) -> None:
        # Defect: a fixed (or deleted) owed id stays on the list, so the set never shrinks.
        self.assertEqual(len(audit.ownership_problems(set(), frozenset({"viejo"}))), 1)


class ContentGateReaderMatchesTheModule(unittest.TestCase):
    def test_the_node_reader_sees_the_same_demos_as_the_typescript_module(self) -> None:
        # Defect: the content gate reads demos that differ from the ones the playground imports,
        # so it checks outputs no learner sees.
        self.assertEqual(audit.load_demos(), playground()["demos"])


if __name__ == "__main__":
    unittest.main()
