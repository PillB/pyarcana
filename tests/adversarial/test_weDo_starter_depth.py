"""Gold bar: weDo starterCode nested code bodies must not be empty # TODO shells."""
from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src/lib/course/sections"
INDEX = ROOT / "src/lib/course/index.ts"


def active_section_files() -> list[Path]:
    text = INDEX.read_text(encoding="utf-8")
    names = re.findall(r"from ['\"]\./sections/([^'\"]+)['\"]", text)
    return [SECTIONS / f"{n}.ts" for n in names]


def nested_starters(text: str) -> list[str]:
    return re.findall(r"starterCode:\s*\{[\s\S]*?code:\s*`([\s\S]*?)`", text)


class TestWeDoStarterDepth(unittest.TestCase):
    def test_late_and_mid_sections_have_rich_starters(self):
        # Flagged band S25,S27-S31 plus a sample of expanded stubs
        want = {25, 27, 28, 29, 30, 31, 16, 23, 24, 26, 36, 39}
        for path in active_section_files():
            t = path.read_text(encoding="utf-8")
            m = re.search(r"\bindex:\s*(\d+)", t)
            if not m:
                continue
            idx = int(m.group(1))
            if idx not in want:
                continue
            codes = nested_starters(t)
            self.assertGreaterEqual(len(codes), 20, msg=f"S{idx:02d} few starters in {path.name}")
            empty = [c for c in codes if len(c.strip()) < 80]
            self.assertEqual(
                empty,
                [],
                msg=f"S{idx:02d} has {len(empty)} empty starters (<80 chars) e.g. {empty[:1]!r}",
            )
            avg = sum(len(c.strip()) for c in codes) / len(codes)
            self.assertGreaterEqual(avg, 120, msg=f"S{idx:02d} avg starter {avg}")


if __name__ == "__main__":
    unittest.main()
