"""Two processes must not write the shared reports at once.

Every audit writes its report to a fixed path under course-state/, and `gate.py` measures a
round by running those audits and reading what they wrote. A second writer means one process
reads the other's numbers, and the gate restores the section when its numbers look worse - so
this does not produce a confusing log, it destroys work.

It has cost two rounds. LEDGER_NOTES records S44, where a file changed between snapshot and
gate-check and fifteen patches were lost. On 2026-09-24 an analysis agent was told it could
run these scripts "read-only" while a gate measured S24; the gate reported 40 snippet failures
against content that has none - the same audit, same patches, nothing else running, reports
3305 passes and 0 failures - and the round was restored.

Both times the rule was known and written down. So it is enforced here instead: the gate
claims the lock and its own children inherit the token, and anything else refuses loudly.

The test that matters most is the last one. A lock only helps while every writer checks it,
and the failure mode is a new audit being added without the check - which is how this repo
acquired its other drift bugs.
"""
from __future__ import annotations

import os
import re
import shutil
import subprocess
import tempfile
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import report_lock  # noqa: E402


class ReportLock(unittest.TestCase):
    def setUp(self) -> None:
        """Point the module at a private lock file, never the one a gate may be holding.

        The first version of these tests deleted and rewrote the real
        `.fixer/reports.lock` in setUp/tearDown. That is precisely the hazard this module
        exists to prevent: run the suite while a gate is measuring - which the gate itself
        does - and the gate's own children start being refused because the token changed
        underneath them. It produced one spurious `adversarial (py)` failure before the cause
        was found. A test for a lock must not fight over the lock.
        """
        self._dir = tempfile.mkdtemp(prefix="report-lock-test-")
        self._path = Path(self._dir) / "reports.lock"
        self._real, report_lock.LOCK = report_lock.LOCK, self._path
        self.saved_env = os.environ.get(report_lock.ENV)
        os.environ.pop(report_lock.ENV, None)
        os.environ["PYARCANA_REPORT_LOCK_PATH"] = str(self._path)

    def tearDown(self) -> None:
        report_lock.LOCK = self._real
        os.environ.pop("PYARCANA_REPORT_LOCK_PATH", None)
        os.environ.pop(report_lock.ENV, None)
        if self.saved_env is not None:
            os.environ[report_lock.ENV] = self.saved_env
        shutil.rmtree(self._dir, ignore_errors=True)

    def test_the_tests_never_touch_the_real_lock(self):
        """The guard on the guard: this suite runs inside the gate it protects."""
        self.assertNotEqual(report_lock.LOCK, self._real)
        self.assertFalse(self._real.samefile(self._path) if self._real.exists() else False)

    def test_a_free_lock_lets_an_audit_through(self):
        report_lock.refuse_if_busy("probe")  # must not raise

    def test_a_held_lock_refuses_an_outsider(self):
        report_lock.LOCK.parent.mkdir(parents=True, exist_ok=True)
        report_lock.LOCK.write_text("other-run", encoding="utf-8")
        with self.assertRaises(SystemExit) as e:
            report_lock.refuse_if_busy("probe")
        self.assertEqual(e.exception.code, 3, "a refusal must be distinguishable from a real failure")

    def test_the_holder_s_own_children_are_let_through(self):
        """Otherwise the gate deadlocks against the audits it runs itself."""
        report_lock.LOCK.parent.mkdir(parents=True, exist_ok=True)
        report_lock.LOCK.write_text("this-run", encoding="utf-8")
        os.environ[report_lock.ENV] = "this-run"
        report_lock.refuse_if_busy("probe")  # must not raise

    def test_the_context_manager_takes_and_releases(self):
        with report_lock.held_by_this_run("t1"):
            self.assertEqual(report_lock.holder(), "t1")
        self.assertIsNone(report_lock.holder())

    def test_it_never_removes_a_lock_another_run_owns(self):
        report_lock.LOCK.parent.mkdir(parents=True, exist_ok=True)
        report_lock.LOCK.write_text("t1", encoding="utf-8")
        with self.assertRaises(SystemExit):
            with report_lock.held_by_this_run("t2"):
                pass
        self.assertEqual(report_lock.holder(), "t1", "the loser of the race deleted the winner's lock")

    def test_gate_py_holds_the_lock_while_it_measures(self):
        source = (ROOT / "tools/fixer/gate.py").read_text(encoding="utf-8")
        self.assertIn("report_lock.held_by_this_run()", source)

    def test_every_audit_the_gate_reads_checks_the_lock(self):
        """The drift guard: a new audit wired into gate.py must check before it writes.

        Derived from gate.py's own invocations rather than a hand-kept list, because a
        hand-kept list is the thing that rots.
        """
        gate = (ROOT / "tools/fixer/gate.py").read_text(encoding="utf-8")
        invoked = set(re.findall(r'"(scripts/[A-Za-z0-9_]+\.py)"', gate))
        self.assertTrue(invoked, "found no audits in gate.py; this test has stopped checking anything")
        unguarded = []
        for rel in sorted(invoked):
            path = ROOT / rel
            if not path.exists():
                continue
            if "refuse_if_busy" not in path.read_text(encoding="utf-8"):
                unguarded.append(rel)
        self.assertEqual(
            unguarded, [],
            "these write a report the gate reads but never check whether a gate is measuring",
        )

    def test_the_refusal_reaches_a_real_script(self):
        """End to end, because the wiring is what actually failed before."""
        report_lock.LOCK.parent.mkdir(parents=True, exist_ok=True)
        report_lock.LOCK.write_text("someone-else", encoding="utf-8")
        env = {k: v for k, v in os.environ.items() if k != report_lock.ENV}
        proc = subprocess.run(
            [sys.executable, "scripts/prose_quality_audit.py", "S01"],
            cwd=ROOT, capture_output=True, text=True, env=env, timeout=300,
        )
        self.assertEqual(proc.returncode, 3, proc.stdout[-400:] + proc.stderr[-400:])
        self.assertIn("REFUSED", proc.stderr)


if __name__ == "__main__":
    unittest.main()
