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

    def test_hour_estimates_are_derived_from_content_not_allocated(self):
        hours: dict[int, int] = {}
        for number, path in sorted(self.sections.items()):
            match = re.search(r"\bestimatedHours:\s*(\d+)", path.read_text(encoding="utf-8"))
            self.assertIsNotNone(match, path.name)
            hours[number] = int(match.group(1))

        # This used to assert exactly 1040: 960 curricular hours allocated as
        # 240 per level across four levels, plus 80 for CP-FINAL. That number
        # came from the V3 roadmap, not from the sections -- which is why 50 of
        # the 52 claimed 18 or 19 hours regardless of content, and why S04
        # (1,407 words of teaching prose) claimed the same as S01 (4,946).
        #
        # scripts/calibrate_section_duration.py prices each section from what it
        # contains, using Brysbaert (2019) for reading rate and stated per-unit
        # assumptions for demos, exercises and the You Do build. It puts the
        # course at roughly 490 hours. The gap is robust: even assuming 20
        # minutes per exercise -- generous for a beginner -- the total reaches
        # only 733, still under the old claim.
        #
        # The assertion now guards the shape rather than a planned figure: the
        # estimates must stay inside the band the model supports, so neither a
        # silent re-inflation nor an unreviewed edit passes unnoticed.
        total = sum(hours.values())
        self.assertGreaterEqual(total, 380, "estimates dropped below the model's low bound")
        self.assertLessEqual(total, 760, "estimates exceed what the content supports")

        # Sections are uniform by design -- 24 exercises and 8 demos each -- so
        # a wild per-section outlier means a hand edit, not a content change.
        # S52 is the exception: it carries CP-FINAL.
        for number, h in hours.items():
            if number == 52:
                continue
            self.assertLessEqual(h, 20, f"S{number:02d} claims {h}h, far above its peers")
        # The four levels used to be forced to 240/240/240/320. That symmetry
        # was the allocation showing through: the levels are equal in section
        # count, so equal hours followed by construction rather than by
        # measurement. What must hold now is that the roadmap agrees with the
        # sections -- if they disagree, one of them was edited by hand.
        index_text = INDEX.read_text(encoding="utf-8")
        per_level = [sum(hours[n] for n in range(s, s + 13)) for s in (1, 14, 27, 40)]
        phase_hours = [int(v) for v in re.findall(r"\bhours:\s*(\d+)", index_text)]
        self.assertEqual(phase_hours, per_level, "roadmap phases disagree with the sections")
        self.assertRegex(index_text, rf"\btotalHours:\s*{total}\b")


if __name__ == "__main__":
    unittest.main()
