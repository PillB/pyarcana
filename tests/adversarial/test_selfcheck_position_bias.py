"""Regression: self-check keys must not leak through a single answer position."""
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


class TestSelfcheckPositionBias(unittest.TestCase):
    def test_s01_s52_follow_section_varying_balanced_position_contract(self):
        result = subprocess.run(
            [
                "node",
                str(ROOT / "scripts/rebalance_selfcheck_positions.mjs"),
                "--from",
                "1",
                "--to",
                "52",
            ],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
