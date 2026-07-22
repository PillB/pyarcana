#!/usr/bin/env python3
"""Hard gate for the 52 lesson files that the public course actually imports."""
from __future__ import annotations

import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
INDEX = ROOT / "src/lib/course/index.ts"
ROADMAP = ROOT / "learning_roadmap_52_V3.md"


def active_sections() -> dict[int, Path]:
    text = INDEX.read_text(encoding="utf-8")
    imports = re.findall(
        r"import\s+\{\s*section(\d{2})\s*\}\s+from\s+['\"]\./sections/([^'\"]+)['\"]",
        text,
    )
    return {int(number): ROOT / "src/lib/course/sections" / f"{stem}.ts" for number, stem in imports}


def roadmap_titles() -> dict[int, str]:
    text = ROADMAP.read_text(encoding="utf-8")
    return {
        int(number): title.strip()
        for number, title in re.findall(r"^### S(\d+) — (.+)$", text, re.MULTILINE)
    }


class TestActiveV3CurriculumContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.sections = active_sections()
        cls.titles = roadmap_titles()

    def test_active_index_is_exactly_s01_through_s52(self):
        self.assertEqual(sorted(self.sections), list(range(1, 53)))
        self.assertEqual(len(set(self.sections.values())), 52)
        for path in self.sections.values():
            self.assertTrue(path.is_file(), path)

    def test_authoritative_roadmap_has_exactly_52_titles(self):
        self.assertEqual(sorted(self.titles), list(range(1, 53)))

    def test_each_active_section_matches_title_and_quantified_structure(self):
        for number, path in sorted(self.sections.items()):
            text = path.read_text(encoding="utf-8")
            prefix = f"S{number:02d}"
            title_match = re.search(r"^\s*title:\s*(['\"])(.*?)\1\s*,", text, re.MULTILINE)
            with self.subTest(section=prefix, field="title"):
                self.assertIsNotNone(title_match, path.name)
                self.assertEqual(title_match.group(2), self.titles[number])

            subtopics = set(re.findall(r"subtopicId:\s*['\"](S\d{2}-T\d-[AB])", text))
            demos = set(re.findall(r"demoId:\s*['\"](S\d{2}-T\d-[AB]-DEMO)", text))
            exercises = set(re.findall(r"\bid:\s*['\"](S\d{2}-T\d-[AB]-E[1-3])", text))
            with self.subTest(section=prefix, field="structure"):
                self.assertEqual(len(subtopics), 8, path.name)
                self.assertEqual(len(demos), 8, path.name)
                self.assertEqual(len(exercises), 24, path.name)
                self.assertTrue(all(item.startswith(prefix) for item in subtopics))
                self.assertTrue(all(item.startswith(prefix) for item in demos))
                self.assertTrue(all(item.startswith(prefix) for item in exercises))

    def test_no_placeholder_or_stub_markers_in_active_lessons(self):
        banned = re.compile(
            r"(?i)(?:\bcoming soon\b|\bpor implementar\b|\blorem ipsum\b|"
            r"\bjohn doe\b|\bplaceholder content\b|\bcontenido pendiente\b|"
            r"\b(?:mock|cross_encoder|implementation)_stub\b)"
        )
        for number, path in sorted(self.sections.items()):
            with self.subTest(section=f"S{number:02d}"):
                self.assertEqual(banned.findall(path.read_text(encoding="utf-8")), [], path.name)

    def test_v3_hour_plan_is_consistent_with_1040_hour_roadmap(self):
        hours: dict[int, int] = {}
        for number, path in sorted(self.sections.items()):
            match = re.search(r"\bestimatedHours:\s*(\d+)", path.read_text(encoding="utf-8"))
            self.assertIsNotNone(match, path.name)
            hours[number] = int(match.group(1))

        # V3: 960 curricular hours (240 per 13-section level), plus the
        # 80-hour CP-FINAL hardening/presentation allocation in S52.
        self.assertEqual(sum(hours.values()), 1040)
        self.assertEqual(
            [sum(hours[number] for number in range(start, start + 13)) for start in (1, 14, 27)],
            [240, 240, 240],
        )
        self.assertEqual(sum(hours[number] for number in range(40, 53)), 320)

        index_text = INDEX.read_text(encoding="utf-8")
        self.assertRegex(index_text, r"\btotalHours:\s*1040\b")
        phase_hours = [int(value) for value in re.findall(r"\bhours:\s*(\d+)", index_text)]
        self.assertEqual(phase_hours, [240, 240, 240, 320])


if __name__ == "__main__":
    unittest.main()
