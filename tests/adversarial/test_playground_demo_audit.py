"""The pinned-output check for the playground demos (scripts/playground_demo_audit.py).

CodePlayground marks a demo passed when the learner's stdout, trimmed, equals its expectedOutput,
trimmed. The content gate applies that rule under the pinned interpreter. Each test below names
the defect it guards; the commit that adds this file records the mutation that turns each red.
"""
from __future__ import annotations

import ast
import contextlib
import inspect
import io
import sys
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(Path(__file__).resolve().parent))

import playground_demo_audit as audit  # noqa: E402
import playground_import_scope as scope  # noqa: E402
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


class ADemoGetsTimeToStartCold(unittest.TestCase):
    def test_the_local_timeout_is_floored_at_30_seconds(self) -> None:
        # Defect: audit_demo() passes no timeout, so a local run uses the lesson audit's 8 s default and
        # a cold-start scikit-learn import (about 10 s) is reported as a failed demo.
        real = audit.runtime.run_python
        asked: list[float] = []

        def spy(code: str, *args, **kwargs):
            default = inspect.signature(real).parameters["timeout"].default
            asked.append(kwargs.get("timeout", args[0] if args else default))
            return real(code, *args, **kwargs)

        with mock.patch.object(audit.runtime, "run_python", spy):
            verdict = audit.audit_demo("synthetic", synthetic("print('hola')", "hola"))
        self.assertEqual(verdict["status"], "pass", verdict)
        self.assertEqual(len(asked), 1)
        self.assertGreaterEqual(asked[0], 30, "a demo must get 30 s or more, whatever the snippet default is")

    def test_a_timeout_is_reported_as_a_timeout_and_not_as_a_mismatch(self) -> None:
        # Defect: a timeout reads like a content failure. The reason and the message say it was a timeout.
        with mock.patch.object(audit, "DEMO_TIMEOUT_SEC", 1):
            verdict = audit.audit_demo("synthetic", synthetic("import time\ntime.sleep(5)\nprint('hola')", "hola"))
        self.assertEqual((verdict["status"], verdict["reason"]), ("fail", "timeout"), verdict)
        self.assertIn("not a mismatch", verdict["stderr"])


class OwedSetIsAnExactRatchet(unittest.TestCase):
    def test_a_new_mismatch_is_a_problem(self) -> None:
        # Defect: the owed list grows silently, because a demo that starts to mismatch is not reported.
        self.assertEqual(len(audit.ownership_problems({"nuevo"}, frozenset())), 1)

    def test_an_owed_demo_that_now_matches_is_a_problem(self) -> None:
        # Defect: a fixed (or deleted) owed id stays on the list, so the set never shrinks.
        self.assertEqual(len(audit.ownership_problems(set(), frozenset({"viejo"}))), 1)


DRIFTED = {"status": "drifted", "drift": [{"package": "pandas", "declared": "3.0.5", "installed": "2.2.0"}]}
CLEAN = {"status": "ok", "drift": []}


def run_main(demos: dict, owed: frozenset, drift: dict = CLEAN) -> tuple[int, str, str, mock.Mock]:
    """main() as CI runs it, with the demos, the owed set and the interpreter probe stood in.
    Returns (exit code, stdout, stderr, the load_demos mock)."""
    out, err = io.StringIO(), io.StringIO()
    with mock.patch.object(audit, "load_demos", return_value=demos) as load, \
            mock.patch.object(audit, "PINNED_OUTPUT_OWED", owed), \
            mock.patch.object(audit.runtime, "probe_version_drift", return_value=drift), \
            contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
        code = audit.main()
    return code, out.getvalue(), err.getvalue(), load


def stdlib_only(demos: dict) -> dict:
    """The real demos this interpreter can run whatever it has installed: those that import only the
    standard library, plus those that do not parse (databases-orm), which fail by their own code."""
    kept = {}
    for demo_id, demo in demos.items():
        try:
            modules = scope.imported_modules(ast.parse(demo["code"]))
        except SyntaxError:
            kept[demo_id] = demo
            continue
        if all(module in sys.stdlib_module_names for module in modules):
            kept[demo_id] = demo
    return kept


class MainDecidesTheExitCodeCIReads(unittest.TestCase):
    """main() is the function `npm run test:python-content` runs. Its exit code is the gate."""

    def test_a_mismatch_that_is_not_owed_exits_1(self) -> None:
        # Defect: main() returns 0 whatever the demos print, so the pinned-output gate is off and
        # every other test in this file stays green (the exit code was never asserted).
        code, out, err, _ = run_main({"zz-nuevo": synthetic("print('hola')", "adios")}, frozenset())
        self.assertEqual(code, 1, (out, err))
        self.assertIn("zz-nuevo", err)
        self.assertIn('"ok": false', out)

    def test_an_owed_mismatch_is_tolerated_and_exits_0(self) -> None:
        # Defect: main() ignores PINNED_OUTPUT_OWED, so a demo the owner has recorded as owed fails
        # the build and the ratchet cannot be adopted.
        code, out, err, _ = run_main({"viejo": synthetic("print('hola')", "adios")}, frozenset({"viejo"}))
        self.assertEqual(code, 0, (out, err))
        self.assertIn('"ok": true', out)

    def test_an_owed_demo_that_now_matches_exits_1(self) -> None:
        # Defect: the owed list is never read back by main(), so a fixed demo stays owed for ever.
        code, _, err, _ = run_main({"viejo": synthetic("print('hola')", "hola")}, frozenset({"viejo"}))
        self.assertEqual(code, 1, err)
        self.assertIn("viejo", err)

    def test_a_drifted_interpreter_is_refused_with_exit_2_before_any_demo_is_read(self) -> None:
        # Defect: the drift refusal is removed, so a pandas that is not the pinned one reports
        # mismatches as content failures (the phantom failures that moving the pin to pandas 3 caused).
        code, out, err, load = run_main({"zz-nuevo": synthetic("print('hola')", "adios")}, frozenset(), DRIFTED)
        self.assertEqual(code, 2, (out, err))
        self.assertIn("pandas 2.2.0 (declared 3.0.5)", err)
        load.assert_not_called()
        self.assertEqual(out, "", "a refused run must not print a verdict")

    def test_the_real_demos_this_interpreter_can_run_exit_0(self) -> None:
        # Defect (the other side): the gate fails the real demos. It runs the real load_demos (the node
        # reader) and the real owed set. Only the stdlib-only slice (and databases-orm, owed) runs here,
        # because the adversarial job has no numpy; the content job runs all of them with the script itself.
        demos = stdlib_only(audit.load_demos())
        self.assertIn("databases-orm", demos, "the slice must hold the owed demo, or the owed set is not exercised")
        self.assertGreater(len(demos), 20)
        out, err = io.StringIO(), io.StringIO()
        with mock.patch.object(audit, "load_demos", return_value=demos), \
                mock.patch.object(audit.runtime, "probe_version_drift", return_value=CLEAN), \
                contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            code = audit.main()
        self.assertEqual(code, 0, (out.getvalue(), err.getvalue()))
        self.assertIn('"ok": true', out.getvalue())


class ContentGateReaderMatchesTheModule(unittest.TestCase):
    def test_the_node_reader_sees_the_same_demos_as_the_typescript_module(self) -> None:
        # Defect: the content gate reads demos that differ from the ones the playground imports,
        # so it checks outputs no learner sees.
        self.assertEqual(audit.load_demos(), playground()["demos"])


if __name__ == "__main__":
    unittest.main()
