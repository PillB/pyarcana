"""A patch that never reached the learner must leave a record, whichever way it failed.

S39's spanish round offered 44 patches. Twelve were refused outright; the other 32 applied and
were then reverted wholesale when the file stopped typechecking. `record_rejections.py` read
only `rejections`, so those 32 disappeared with no trace while the runner reported "S39 passed
every gate" - the gate had compared an unchanged file against itself. Separately, the dedup
guard keyed on the `## TAG stage` header alone, so a stale one-item entry swallowed the 12 real
rejections from the re-run.
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "tools" / "fixer" / "record_rejections.py"


def _run(apply_report: dict, oq_text: str, tag: str = "S39", stage: str = "spanish"):
    """Run record_rejections against a throwaway OPEN_QUESTIONS.md, return (stdout, file text)."""
    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        (td / "audit" / "fixer").mkdir(parents=True)
        oq = td / "audit" / "fixer" / "OPEN_QUESTIONS.md"
        oq.write_text(oq_text, encoding="utf-8")
        report = td / f"{tag}s.apply.json"
        report.write_text(json.dumps(apply_report), encoding="utf-8")

        # The script resolves paths from its own location, so run a copy rooted in the temp dir.
        tools = td / "tools" / "fixer"
        tools.mkdir(parents=True)
        (tools / "record_rejections.py").write_text(SCRIPT.read_text(encoding="utf-8"), encoding="utf-8")

        proc = subprocess.run(
            [sys.executable, str(tools / "record_rejections.py"), tag, str(report), stage],
            capture_output=True, text=True, check=True,
        )
        return proc.stdout.strip(), oq.read_text(encoding="utf-8")


class RecordRejectionsTests(unittest.TestCase):
    def test_rolled_back_patches_are_recorded_not_dropped(self) -> None:
        count, text = _run(
            {
                "applied": 0,
                "rejected": 1,
                "rolled_back": True,
                "typecheck_error": 's39.ts:1544:27: Expected "}" but found "secrets_in_repo"',
                "rejections": [
                    {"finding_ids": ["S39-ES-016"], "field_path": "theory[1]", "reason": "anchor not found"}
                ],
                "rolled_back_patches": [
                    {"finding_ids": ["S39-ES-031"], "field_path": "weDo[E1].retrospective",
                     "reason": "typecheck failed after apply; whole batch rolled back"},
                    {"finding_ids": ["S39-ES-030"], "field_path": "weDo[E1].hint",
                     "reason": "typecheck failed after apply; whole batch rolled back"},
                ],
            },
            "# Open questions\n",
        )
        self.assertEqual(count, "3", "all three unresolved patches counted, not just the refused one")
        self.assertIn("S39-ES-031", text, "a rolled-back patch must be recorded")
        self.assertIn("S39-ES-030", text)
        self.assertIn("S39-ES-016", text, "an outright rejection is still recorded")
        self.assertIn("rolled back", text, "the reason distinguishes rollback from refusal")
        self.assertIn("secrets_in_repo", text, "the typecheck error is preserved for diagnosis")

    def test_a_different_rejection_set_is_not_swallowed_by_a_stale_entry(self) -> None:
        stale = (
            "# Open questions\n\n## S39 spanish — 1 patch(es) not applied\n"
            "<!-- S39 spanish deadbeef1234 -->\n\n- **S39-OLD** at `x` — anchor not found\n"
        )
        count, text = _run(
            {
                "applied": 0, "rejected": 2, "rejections": [
                    {"finding_ids": ["S39-ES-019"], "field_path": "a", "reason": "anchor not found"},
                    {"finding_ids": ["S39-ES-020"], "field_path": "b", "reason": "anchor not found"},
                ],
            },
            stale,
        )
        self.assertEqual(count, "2")
        self.assertIn("S39-ES-019", text, "the re-run's real rejections must be appended")
        self.assertIn("S39-OLD", text, "the earlier entry is left in place, not rewritten")

    def test_an_identical_rerun_does_not_duplicate(self) -> None:
        report = {
            "applied": 0, "rejected": 1, "rejections": [
                {"finding_ids": ["S27-ES-001"], "field_path": "tagline", "reason": "anchor not found"}
            ],
        }
        _, once = _run(report, "# Open questions\n", tag="S27")
        count, twice = _run(report, once, tag="S27")
        self.assertEqual(count, "1")
        self.assertEqual(
            twice.count("S27-ES-001"), 1,
            "re-recording the same result must not append a second identical block",
        )


if __name__ == "__main__":
    unittest.main()
