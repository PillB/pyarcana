"""Contract: every exam-bank manifest names the section it was written for, by the id the course uses now.

course-state/sNN_phase5_exam_bank.json records how a section's exam bank was written: its
section_id, the seed key it was written for, and the concepts of its families. Manifests that
still carry the id a section had before a rename read as a bank for a different section. Each
manifest is checked against the section file the course index imports and against the seed bank
under that id: section_id and summary.seed_key must equal the current id, and the families'
concepts must equal the bank's concepts.
"""
from __future__ import annotations

import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

#: Manifests whose section_id or seed key was a pre-rename id, found on 2026-10-13: twelve, s03-s13
#: and s40 (data-structures, functions-modules, oop, numpy, data-acquisition, pandas, visualization,
#: sklearn, testing, performance, rpa-automation, agentic-architecture). Their concepts already
#: matched their banks. Fixed mechanically in this PR: section_id and summary.seed_key only.
STALE_MANIFESTS_OWED: frozenset[str] = frozenset()


def manifest_path(number: int) -> Path:
    return ROOT / "course-state" / f"s{number:02d}_phase5_exam_bank.json"


def current_section_ids() -> dict[int, str]:
    """The id of each section the course index imports, from its section file."""
    index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
    ids: dict[int, str] = {}
    for number, filename in re.findall(r"import \{ section(\d\d) \} from '\./sections/([^']+)'", index):
        text = (ROOT / "src/lib/course/sections" / f"{filename}.ts").read_text(encoding="utf-8")
        match = re.search(r"^\s*id:\s*['\"]([^'\"]+)['\"]", text, re.MULTILINE)
        assert match, f"no id in {filename}"
        ids[int(number)] = match.group(1)
    return ids


class ManifestsNameTheCurrentSection(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.ids = current_section_ids()
        cls.banks = {bank["slug"]: bank for bank in exam_bank.load_banks()}

    def test_every_section_has_a_manifest_and_a_bank(self):
        self.assertEqual(sorted(self.ids), list(range(1, 53)), "the course index lost sections")
        missing = [manifest_path(n).name for n in self.ids if not manifest_path(n).exists()]
        self.assertEqual(missing, [])
        no_bank = {n: cid for n, cid in self.ids.items() if cid not in self.banks}
        self.assertEqual(no_bank, {}, "a section's id has no seed bank under it")

    def test_each_manifest_names_the_current_section_id_and_seed_key(self):
        stale = set()
        for number, cid in self.ids.items():
            manifest = json.loads(manifest_path(number).read_text(encoding="utf-8"))
            if manifest.get("section_id") != cid or (manifest.get("summary") or {}).get("seed_key") != cid:
                stale.add(manifest_path(number).name)
        new = sorted(stale - STALE_MANIFESTS_OWED)
        gone = sorted(STALE_MANIFESTS_OWED - stale)
        self.assertEqual(new, [], "manifests name a pre-rename section id")
        self.assertEqual(gone, [], "no longer stale: remove from STALE_MANIFESTS_OWED")

    def test_each_manifest_lists_the_concepts_of_its_bank(self):
        for number, cid in self.ids.items():
            manifest = json.loads(manifest_path(number).read_text(encoding="utf-8"))
            families = {family["concept"] for family in manifest.get("families", [])}
            bank = {q["concept"] for q in self.banks[cid]["questions"]}
            with self.subTest(manifest=manifest_path(number).name):
                self.assertEqual(families, bank)


if __name__ == "__main__":
    unittest.main()
