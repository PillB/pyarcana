#!/usr/bin/env python3
"""Property/contract tests: active curriculum cannot shrink or lose IDs."""
from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
INDEX = ROOT / "src/lib/course/index.ts"
SECTIONS = ROOT / "src/lib/course/sections"


def active_imports() -> list[tuple[int, str, Path]]:
    text = INDEX.read_text(encoding="utf-8")
    rows = re.findall(
        r"import\s+\{\s*section(\d{2})\s*\}\s+from\s+['\"]\./sections/([^'\"]+)['\"]",
        text,
    )
    return [(int(n), stem, SECTIONS / f"{stem}.ts") for n, stem in rows]


def section_id(path: Path) -> str | None:
    m = re.search(r"\bid:\s*['\"]([^'\"]+)['\"]", path.read_text(encoding="utf-8"))
    return m.group(1) if m else None


def exercise_ids(path: Path) -> set[str]:
    return set(re.findall(r"\bid:\s*['\"](S\d{2}-T\d-[AB]-E[1-3])['\"]", path.read_text(encoding="utf-8")))


class TestCurriculumPreservation(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.active = active_imports()

    def test_active_section_count_is_exactly_52(self) -> None:
        self.assertEqual(len(self.active), 52)

    def test_active_section_ids_are_unique(self) -> None:
        ids = [section_id(path) for _, _, path in self.active]
        self.assertTrue(all(ids))
        self.assertEqual(len(ids), len(set(ids)), f"duplicate section ids: {ids}")

    def test_active_section_numbers_are_s01_through_s52(self) -> None:
        nums = sorted(n for n, _, _ in self.active)
        self.assertEqual(nums, list(range(1, 53)))

    def test_each_active_section_retains_24_exercise_ids(self) -> None:
        for number, stem, path in self.active:
            with self.subTest(section=f"S{number:02d}", stem=stem):
                ids = exercise_ids(path)
                self.assertEqual(len(ids), 24, path.name)
                prefix = f"S{number:02d}"
                self.assertTrue(all(i.startswith(prefix) for i in ids))

    def test_exercise_ids_globally_unique_across_active_curriculum(self) -> None:
        all_ids: list[str] = []
        for _, _, path in self.active:
            all_ids.extend(exercise_ids(path))
        self.assertEqual(len(all_ids), len(set(all_ids)))
        self.assertEqual(len(all_ids), 52 * 24)

    def test_inactive_preserved_section_files_still_exist(self) -> None:
        """Legacy/alternate section files must not be deleted (INACTIVE_PRESERVED)."""
        # Known historical alternate files present at baseline.
        legacy = [
            "s07-pandas.ts",
            "s08-visualization.ts",
            "s09-sklearn.ts",
            "s10-testing.ts",
            "s11-advanced-topics.ts",
        ]
        for name in legacy:
            path = SECTIONS / name
            with self.subTest(name=name):
                self.assertTrue(path.is_file(), f"missing INACTIVE_PRESERVED file: {name}")


if __name__ == "__main__":
    unittest.main()
