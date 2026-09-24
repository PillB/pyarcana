"""Restoring a failed round has to restore everything the round changed.

`gate.py check` regenerates every derived report as it measures. When it fails,
`run_concepts.sh` restores the section file - and, before this guard, nothing else. The
reports were left describing content that had just been rolled back.

That is not a cosmetic inconsistency. The reports are what anyone reads to find out WHY the
round failed, so the first move after a failure - copy a report as the "before" snapshot,
apply the patches, compare - silently compares the post-patch state with itself and measures
a delta of zero. It happened three times in one day, and each time the wrong conclusion was
one step away: twice the diff came back empty, once it pointed at the wrong metric entirely.

The list of reports lives in the runner and the writes live in gate.py, so the real failure
mode now is the two drifting apart - which is how the list came to be missing
`python_runtime_audit_report.json` within minutes of being written. This test compares them
instead of trusting either.
"""
from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RUNNERS = ["tools/fixer/run_concepts.sh"]
GATE = ROOT / "tools/fixer/gate.py"

#: Reports gate.py names but that are scoped to one tag under .fixer/, so a stale copy cannot
#: be mistaken for a course-wide baseline.
TAG_SCOPED = re.compile(r"\.fixer/")


def reports_gate_rewrites() -> set[str]:
    """Every course-state report gate.py hands to fresh_report()."""
    source = GATE.read_text(encoding="utf-8")
    return {
        m for m in re.findall(r'ROOT / "(course-state/[A-Za-z0-9_]+\.json)"', source)
        if not TAG_SCOPED.search(m)
    }


def reports_a_runner_restores(runner: str) -> set[str]:
    source = (ROOT / runner).read_text(encoding="utf-8")
    block = re.search(r"REPORTS=\((.*?)\n\)", source, re.S)
    if not block:
        return set()
    return set(re.findall(r'"([^"]+)"', block.group(1)))


class RoundRestoreIsComplete(unittest.TestCase):
    def test_the_runner_restores_every_report_the_gate_rewrites(self):
        rewritten = reports_gate_rewrites()
        self.assertTrue(rewritten, "found no reports in gate.py; this test has stopped checking anything")
        for runner in RUNNERS:
            with self.subTest(runner=runner):
                restored = reports_a_runner_restores(runner)
                missing = sorted(rewritten - restored)
                self.assertEqual(
                    missing, [],
                    f"{runner} restores the section but leaves these describing rolled-back content",
                )

    def test_the_events_cache_is_restored_too(self):
        """Every report is derived from it, so a stale cache reproduces the whole problem."""
        for runner in RUNNERS:
            with self.subTest(runner=runner):
                self.assertIn(".fixer/events.json", reports_a_runner_restores(runner))

    def test_the_runner_restores_on_the_failure_path_not_only_snapshots(self):
        """Saving copies is useless if the failure branch does not put them back."""
        for runner in RUNNERS:
            source = (ROOT / runner).read_text(encoding="utf-8")
            fail_branch = source[source.index("failed its gates"):]
            with self.subTest(runner=runner):
                self.assertIn("REPORTS[@]", fail_branch,
                              f"{runner} saves the reports but never restores them on failure")

    def test_the_section_file_is_still_restored(self):
        """The guard must not have displaced what the restore was already doing."""
        for runner in RUNNERS:
            source = (ROOT / runner).read_text(encoding="utf-8")
            fail_branch = source[source.index("failed its gates"):]
            with self.subTest(runner=runner):
                self.assertIn("pre-concepts.ts", fail_branch)


if __name__ == "__main__":
    unittest.main()
