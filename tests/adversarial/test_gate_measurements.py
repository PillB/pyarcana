"""A gate whose instrument could not run did not pass.

`gate.py` used to run each audit, ignore its exit status, and read the tracked report straight
afterwards. The reports survive between rounds, so an audit that crashed left last round's JSON
in place and `snapshot`/`check` compared stale values — reporting a pass precisely when the
measurement was missing. These pin `fresh_report` in every direction that matters:

- a crash that leaves the old report untouched fails, even when the exit code looks normal;
- an exit code outside the audit's contract fails, even when a report was written;
- an audit that exits 1 *because it found something*, after writing, still measures;
- a report that is rewritten but not JSON fails.
"""
from __future__ import annotations

import json
import sys
import time
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools" / "fixer"))

import gate  # noqa: E402


class FreshReportTests(unittest.TestCase):
    def setUp(self) -> None:
        self.dir = ROOT / ".fixer" / "test-gate-measurements"
        self.dir.mkdir(parents=True, exist_ok=True)
        self.report = self.dir / "report.json"
        self.report.write_text(json.dumps({"from": "last round"}), encoding="utf-8")
        time.sleep(0.01)  # a rewrite must be distinguishable from the file already there

    def tearDown(self) -> None:
        for p in self.dir.glob("*"):
            p.unlink()
        self.dir.rmdir()

    def run_audit(self, body: str) -> list[str]:
        script = self.dir / "audit.py"
        script.write_text(body, encoding="utf-8")
        return [sys.executable, str(script), str(self.report)]

    def test_a_crash_that_leaves_last_rounds_report_fails(self) -> None:
        cmd = self.run_audit("raise SystemExit(0)\n")  # exits cleanly, writes nothing
        with self.assertRaises(gate.MeasurementFailed) as err:
            gate.fresh_report(cmd, self.report)
        self.assertIn("without rewriting its report", str(err.exception))

    def test_a_traceback_fails_even_though_the_old_report_is_valid_json(self) -> None:
        cmd = self.run_audit("import no_such_module_anywhere\n")
        with self.assertRaises(gate.MeasurementFailed):
            gate.fresh_report(cmd, self.report, ok_codes=(0, 1))

    def test_an_exit_code_outside_the_contract_fails_even_with_a_new_report(self) -> None:
        cmd = self.run_audit(
            "import json, sys\n"
            "open(sys.argv[1], 'w').write(json.dumps({'ok': True}))\n"
            "raise SystemExit(2)\n")
        with self.assertRaises(gate.MeasurementFailed) as err:
            gate.fresh_report(cmd, self.report, ok_codes=(0, 1))
        self.assertIn("exited 2", str(err.exception))

    def test_an_audit_that_found_something_still_measures(self) -> None:
        cmd = self.run_audit(
            "import json, sys\n"
            "open(sys.argv[1], 'w').write(json.dumps({'ok': False, 'issues': 3}))\n"
            "raise SystemExit(1)\n")
        self.assertEqual(gate.fresh_report(cmd, self.report, ok_codes=(0, 1)), {"ok": False, "issues": 3})

    def test_a_clean_run_returns_this_runs_report(self) -> None:
        cmd = self.run_audit(
            "import json, sys\n"
            "open(sys.argv[1], 'w').write(json.dumps({'from': 'this round'}))\n")
        self.assertEqual(gate.fresh_report(cmd, self.report), {"from": "this round"})

    def test_a_rewritten_report_that_is_not_json_fails(self) -> None:
        cmd = self.run_audit("import sys\nopen(sys.argv[1], 'w').write('{truncated')\n")
        with self.assertRaises(gate.MeasurementFailed) as err:
            gate.fresh_report(cmd, self.report)
        self.assertIn("not valid JSON", str(err.exception))


if __name__ == "__main__":
    unittest.main()
