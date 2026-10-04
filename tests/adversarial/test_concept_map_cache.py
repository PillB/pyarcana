"""The concept map's event cache must go stale when anything the extractor reads changes.

The watch list was written by hand. It missed concept_detector.mts the day the definition rules
moved there, so editing only the rules rebuilt the map from events made under the old ones
(Codex review on #79), and concept_syntax.mts had never been on it. The list is now the
extractor's import graph, read from the files themselves.
"""
from __future__ import annotations

import os
import re
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import concept_map  # noqa: E402


def write(root: Path, rel: str, text: str) -> Path:
    path = root / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    return path


class ExtractorInputs(unittest.TestCase):
    def test_the_real_extractor_s_modules_and_live_sections_are_all_watched(self):
        inputs = concept_map.extractor_inputs()
        for rel in ("scripts/course_event_extractor.mts", "scripts/concept_detector.mts",
                    "scripts/concept_syntax.mts", "src/lib/course/index.ts", "src/lib/glossary/terms.ts"):
            self.assertIn((ROOT / rel).resolve(), inputs, rel)
        index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
        live = re.findall(r"from\s+['\"]\./sections/([^'\"]+)['\"]", index)
        self.assertGreater(len(live), 0)
        missing = [name for name in live
                   if (ROOT / "src/lib/course/sections" / f"{name}.ts").resolve() not in inputs]
        self.assertEqual(missing, [])

    def test_relative_paths_the_src_alias_and_cycles_are_followed_and_packages_are_not(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp).resolve()
            entry = write(root, "scripts/course_event_extractor.mts", "import { a } from './helper.mts'\n")
            helper = write(root, "scripts/helper.mts", "export { b } from '../src/lib/b'\n")
            b = write(root, "src/lib/b.ts", "import c from '@/lib/c'\nimport React from 'react'\n")
            c = write(root, "src/lib/c.ts", "import { b } from './b'\nimport './gone'\n")
            with mock.patch.object(concept_map, "ROOT", root):
                self.assertEqual(concept_map.extractor_inputs(), {entry, helper, b, c})


class CacheInvalidation(unittest.TestCase):
    def test_editing_only_the_detector_makes_the_cache_stale(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp).resolve()
            files = [write(root, "scripts/course_event_extractor.mts", "import { d } from './concept_detector.mts'\n"),
                     write(root, "scripts/concept_detector.mts", "export const d = 1\n")]
            cache = write(root, ".fixer/events.json", "{}")
            moment = 1_700_000_000
            for path in files:
                os.utime(path, (moment, moment))
            os.utime(cache, (moment + 10, moment + 10))
            with mock.patch.object(concept_map, "ROOT", root), mock.patch.object(concept_map, "EVENTS", cache):
                self.assertFalse(concept_map.sources_newer_than_cache())
                os.utime(files[1], (moment + 20, moment + 20))
                self.assertTrue(concept_map.sources_newer_than_cache(),
                                "the detector changed after the cache was written")


if __name__ == "__main__":
    unittest.main()
