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
    """The cache is stale when its inputs are not what built it.

    #78 asserted this with mtime arithmetic: set every source older than the cache, bump the
    detector, watch the verdict flip. That tested the mechanism, and the mechanism was wrong in both
    directions -- a restore or a `touch` of the cache re-blinds it, and a source arriving with an
    OLDER mtime (`cp -p`, `rsync -t`, `tar -xp`, clock skew, an older checkout) is invisible. The
    comparison is now a digest of the inputs' paths and contents, so these assert the property --
    did the inputs change? -- rather than the arithmetic. The import-graph half of the question,
    which is what #78 was really defending, is unchanged and still covered: `concept_detector.mts`
    is reached only because the graph is followed.
    """

    @staticmethod
    def _seed(root: Path) -> list[Path]:
        files = [
            write(root, "scripts/course_event_extractor.mts",
                  "import { d } from './concept_detector.mts'\n"),
            write(root, "scripts/concept_detector.mts", "export const d = 1\n"),
        ]
        write(root, ".fixer/events.json", "{}")
        return files

    def test_editing_only_the_detector_makes_the_cache_stale(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp).resolve()
            files = self._seed(root)
            cache = root / ".fixer/events.json"
            digest = root / ".fixer/events.inputs.sha256"
            with mock.patch.object(concept_map, "ROOT", root), \
                 mock.patch.object(concept_map, "EVENTS", cache), \
                 mock.patch.object(concept_map, "EVENTS_INPUTS", digest):
                digest.write_text(concept_map.inputs_digest() + "\n", encoding="utf-8")
                self.assertFalse(concept_map.sources_newer_than_cache())

                files[1].write_text("export const d = 2\n", encoding="utf-8")
                self.assertTrue(
                    concept_map.sources_newer_than_cache(),
                    "the detector changed after the cache was written",
                )

    def test_an_edit_arriving_with_an_older_mtime_is_still_seen(self) -> None:
        """The case mtime could never catch: `cp -p`, `rsync -t`, or an older checkout.

        EVERY input is backdated, not just the edited one. A first version of this test backdated
        only the file it changed and left the entry module at its current mtime -- so an mtime
        comparison answered "stale" because of the untouched entry, and the test passed against the
        very implementation it was written to rule out. It passed for the wrong reason, which is the
        same defect it exists to catch, one level up.
        """
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp).resolve()
            files = self._seed(root)
            cache = root / ".fixer/events.json"
            digest = root / ".fixer/events.inputs.sha256"
            with mock.patch.object(concept_map, "ROOT", root), \
                 mock.patch.object(concept_map, "EVENTS", cache), \
                 mock.patch.object(concept_map, "EVENTS_INPUTS", digest):
                digest.write_text(concept_map.inputs_digest() + "\n", encoding="utf-8")
                files[1].write_text("export const d = 3\n", encoding="utf-8")
                for path in files:
                    os.utime(path, (0, 0))    # the whole tree arrives older than the cache
                os.utime(cache, (1_700_000_000, 1_700_000_000))
                self.assertTrue(
                    concept_map.sources_newer_than_cache(),
                    "an edit older than the cache is still an edit the cache does not describe",
                )

    def test_touching_the_cache_does_not_make_a_changed_tree_look_current(self) -> None:
        """The exploit: `run_concepts.sh` restores events.json, handing it the newest mtime."""
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp).resolve()
            files = self._seed(root)
            cache = root / ".fixer/events.json"
            digest = root / ".fixer/events.inputs.sha256"
            with mock.patch.object(concept_map, "ROOT", root), \
                 mock.patch.object(concept_map, "EVENTS", cache), \
                 mock.patch.object(concept_map, "EVENTS_INPUTS", digest):
                digest.write_text(concept_map.inputs_digest() + "\n", encoding="utf-8")
                files[1].write_text("export const d = 4\n", encoding="utf-8")
                os.utime(cache, None)             # the restore, giving the cache the newest mtime
                self.assertTrue(
                    concept_map.sources_newer_than_cache(),
                    "touching the cache must not bury a real change",
                )


if __name__ == "__main__":
    unittest.main()
