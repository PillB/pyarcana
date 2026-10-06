"""Regression: self-check keys must not leak through a single answer position."""
import json
import re
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
#: The live sections, counted from the imports that make them live - not from the checker.
LIVE = len(re.findall(r"from\s+['\"]\./sections/[^'\"]+['\"]",
                      (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")))


class TestSelfcheckPositionBias(unittest.TestCase):
    def test_s01_s52_follow_section_varying_balanced_position_contract(self):
        result = subprocess.run(
            [
                "node",
                str(ROOT / "scripts/rebalance_selfcheck_positions.mjs"),
                "--from",
                "1",
                "--to",
                str(LIVE),
            ],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        # The checker skips a section it cannot parse and still exits 0, so the exit code alone
        # passes the day it reads nothing. It must have checked every live section.
        report = json.loads(result.stdout)
        self.assertGreater(LIVE, 0)
        self.assertEqual(report["sections"], LIVE,
                         f"the checker examined {report['sections']} of {LIVE} live sections")
        self.assertEqual(report["failures"], [])


if __name__ == "__main__":
    unittest.main()
