"""The fixer gate must honour the runtime audit's skip verdict.

The audit exits 1 both when a snippet fails and when its skip check fails, and gate.py accepts
exit 1 so that it can list failing snippets itself. It then recomputed success from the fail
count and the package pins alone, so a round whose skip check had failed printed PASS
(Codex review on #79). These tests drive gate.snippets_gate with the audit's report stubbed.
"""
from __future__ import annotations

import contextlib
import io
import sys
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))

import gate  # noqa: E402


def audit_report(*, fail: int = 0, pins: str = "ok", skips: str | None = "ok") -> dict:
    """The fields of python_runtime_audit_report.json that snippets_gate reads."""
    report = {"totals": {"fail": fail}, "environment_matches_pins": {"status": pins}, "failures": []}
    if skips is not None:
        report["skips"] = {"status": skips,
                           "problems": [] if skips == "ok" else ["2 snippets skipped as unknown_kind"]}
    return report


class SnippetsGateReadsTheSkipVerdict(unittest.TestCase):
    def verdict(self, report: dict) -> tuple[list[str], str]:
        failed: list[str] = []
        with mock.patch.object(gate, "fresh_report", return_value=report), \
                contextlib.redirect_stdout(io.StringIO()) as out:
            gate.snippets_gate(failed)
        return failed, out.getvalue()

    def test_a_clean_report_passes(self):
        failed, out = self.verdict(audit_report())
        self.assertEqual(failed, [], out)
        self.assertIn("PASS", out)

    def test_a_failed_skip_verdict_fails_the_gate_and_says_why(self):
        failed, out = self.verdict(audit_report(skips="fail"))
        self.assertEqual(failed, ["python-content"], out)
        self.assertIn("2 snippets skipped as unknown_kind", out)

    def test_a_report_without_a_skip_verdict_fails_the_gate(self):
        failed, out = self.verdict(audit_report(skips=None))
        self.assertEqual(failed, ["python-content"], out)

    def test_failing_snippets_still_fail_it(self):
        failed, _ = self.verdict(audit_report(fail=1))
        self.assertEqual(failed, ["python-content"])

    def test_unpinned_packages_still_fail_it(self):
        failed, _ = self.verdict(audit_report(pins="drift"))
        self.assertEqual(failed, ["python-content"])


if __name__ == "__main__":
    unittest.main()
