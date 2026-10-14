"""Guard G-12 (design_ruled_final.md section 4.3, row RT1-B2), the registry half: the fixer's findings are
filed under section numbers, so the registry says which numbering those numbers belong to, and every reader
asks for a section's findings through tools/fixer/numbering.py instead of filtering on the tag.

Why this exists. audit/consolidated/registry.json holds 2,124 findings keyed `S01`..`S52`. Five fixer tools
selected them with `f["section"] == tag`. After a renumber the same tag names another section, and the
brief for new S20 would have carried old S20's findings; Codex would have "fixed" them in the wrong lesson.
The registry carried no epoch, so nothing could tell.

Checked here:
  * a registry with no stamp, with another epoch's stamp, or with a finding under a section the epoch does
    not number is refused, and the refusal names the reason;
  * findings come back keyed by slug, every slug present, filed where the epoch says;
  * the committed registry is stamped, the emitter (tools/audit/report.py) writes the stamp, and the two
    agree on the numbering the audit sources used;
  * each of the five readers, run against a temporary course whose sections have different finding counts,
    reports its own section's findings and not a neighbour's;
  * no fixer tool reads the registry file except numbering.py.

Mutation proofs are in the commit message that adds this file.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))
sys.path.insert(0, str(ROOT / "tests/adversarial"))

import build_concept_prompt  # noqa: E402
import build_prompt  # noqa: E402
import ledger  # noqa: E402
import numbering  # noqa: E402
import progress  # noqa: E402
import record_cycle  # noqa: E402
from numbering import NumberingError  # noqa: E402
from numbering_fixture import (  # noqa: E402
    ROUND_FILED, NumberingFixture, build, cycle, registry, round_tree, run_in, write)


class RegistryIsStampedAndGuarded(NumberingFixture):
    def epoch(self) -> numbering.Epoch:
        return numbering.load_epoch(self.root)

    def test_a_registry_with_no_stamp_is_refused(self) -> None:
        """The state the design names as G-12's 'missing epoch': findings by number, no numbering."""
        build(self.root)
        registry(self.root, {"S01": 1}, stamp=None)
        with self.assertRaisesRegex(NumberingError, "no numbering_epoch"):
            numbering.registry_findings(self.root, self.epoch())

    def test_a_registry_stamped_for_another_epoch_is_refused(self) -> None:
        build(self.root)
        registry(self.root, {"S01": 1}, stamp=2)
        with self.assertRaisesRegex(NumberingError, "epoch 2.*current epoch is 3"):
            numbering.registry_findings(self.root, self.epoch())

    def test_a_finding_under_a_section_the_epoch_does_not_number_is_refused(self) -> None:
        build(self.root)
        registry(self.root, {"S01": 1, "S09": 1})
        with self.assertRaisesRegex(NumberingError, "S09"):
            numbering.registry_findings(self.root, self.epoch())

    def test_a_registry_without_a_list_of_findings_is_refused(self) -> None:
        build(self.root)
        write(self.root, "audit/consolidated/registry.json", json.dumps({"numbering_epoch": 3}))
        with self.assertRaisesRegex(NumberingError, "no list of findings"):
            numbering.registry_findings(self.root, self.epoch())

    def test_a_missing_registry_is_refused(self) -> None:
        build(self.root)
        with self.assertRaisesRegex(NumberingError, "is missing"):
            numbering.registry_findings(self.root, self.epoch())

    def test_findings_come_back_keyed_by_the_slug_their_tag_names(self) -> None:
        build(self.root)
        registry(self.root, {"S01": 1, "S02": 4})
        found = numbering.registry_findings(self.root, self.epoch())
        self.assertEqual(list(found), ["alpha", "beta", "gamma"])
        self.assertEqual({s: len(f) for s, f in found.items()}, {"alpha": 1, "beta": 4, "gamma": 0})
        self.assertEqual({f["section"] for f in found["beta"]}, {"S02"})

    def test_the_epoch_check_reports_an_unstamped_registry(self) -> None:
        """preflight and the epoch guard both run check_epoch; a registry problem must surface there."""
        build(self.root)
        registry(self.root, {"S01": 1}, stamp=None)
        problems = numbering.check_epoch(self.root)
        self.assertTrue(any("no numbering_epoch" in p for p in problems), problems)

    def test_the_epoch_check_passes_a_stamped_registry(self) -> None:
        build(self.root)
        registry(self.root, {"S01": 1, "S03": 2})
        self.assertEqual(numbering.check_epoch(self.root), [])


class TheCommittedRegistry(unittest.TestCase):
    def test_it_is_stamped_and_every_finding_is_placed(self) -> None:
        epoch = numbering.load_epoch(ROOT)
        found = numbering.registry_findings(ROOT, epoch)
        committed = json.loads((ROOT / numbering.REGISTRY_FILE).read_text(encoding="utf-8"))
        self.assertEqual(sum(len(v) for v in found.values()), committed["total_findings"])
        self.assertEqual(committed["numbering_epoch"], epoch.label)
        self.assertEqual(list(found), list(epoch.slugs))

    def test_the_emitter_writes_the_stamps_the_committed_file_carries(self) -> None:
        """tools/audit/report.py is what regenerates the registry. If it dropped the stamps, the next
        regeneration would produce the unstamped file the guard refuses. The stamps are the numbering the
        audit sources used, so they equal the committed file's text epoch whatever the course is by then."""
        finding = {"section": "S01", "finding_id": "S01-F01", "severity": "P1", "category": "X", "title": "t",
                   "location": "", "evidence": "", "impact": "", "attack": "", "defense": "", "fix": "",
                   "verdict": "", "provenance": [{"file": "f.json"}], "flagged_critical": False,
                   "source_count": 1}
        with tempfile.TemporaryDirectory() as folder:
            work, out = Path(folder, "work"), Path(folder, "out")
            for name, rows in (("registry", [finding]), ("elements", [{"section": "S01"}]),
                               ("rejects", [{"section": "S01"}]), ("tests", [{"section": "S01"}]),
                               ("validation", {})):
                write(work, f"audits/{name}.json", json.dumps(rows))
            subprocess.run([sys.executable, str(ROOT / "tools/audit/report.py"), str(work), str(out)],
                           check=True, capture_output=True)
            emitted = json.loads((out / "registry.json").read_text(encoding="utf-8"))
        committed = json.loads((ROOT / numbering.REGISTRY_FILE).read_text(encoding="utf-8"))
        self.assertEqual(emitted["numbering_epoch"], committed["text_numbering_epoch"])
        self.assertEqual(emitted["text_numbering_epoch"], committed["text_numbering_epoch"])


class EachReaderGetsItsOwnSectionsFindings(NumberingFixture):
    """Run the real reader against a course whose three sections have 1, 4 and 2 findings. A reader that
    selects the wrong section reports a count that is not its own. The counts are ROUND_FILED."""

    def setUp(self) -> None:
        super().setUp()
        round_tree(self.root)

    def test_build_prompt_briefs_codex_with_the_sections_findings(self) -> None:
        for tag, expected in (("S01", 1), ("S02", 4), ("S03", 2)):
            with self.subTest(tag=tag):
                text = run_in(self.root, build_prompt, [tag], CONTRACTS=[],
                              EVENTS=self.root / ".fixer/events.json",
                              FIRST_USE=self.root / "course-state/first_use_all_report.json")
                self.assertIn(f"FINDINGS TO FIX ({expected})", text)
                ids = set(re.findall(rf'"finding_id": "({tag}-F\d+)"', text))
                self.assertEqual(len(ids), expected)

    def test_a_brief_is_refused_when_the_registry_is_keyed_to_another_numbering(self) -> None:
        """The defect itself: the registry still files findings under the numbers of an earlier epoch. The
        old reader filtered on the tag and briefed Codex with whatever sat under it; now it refuses."""
        registry(self.root, ROUND_FILED, stamp=2)
        with self.assertRaisesRegex(NumberingError, "epoch 2"):
            run_in(self.root, build_prompt, ["S02"], CONTRACTS=[],
                   EVENTS=self.root / ".fixer/events.json",
                   FIRST_USE=self.root / "course-state/first_use_all_report.json")

    def test_both_briefs_tell_codex_how_to_read_old_numbers_inside_the_findings(self) -> None:
        """Restamping re-keys where a finding is filed, not what its text says. Once the text counts sections
        the old way, each brief that carries the text says how to read it; until then it adds nothing."""
        for brief, argv, extra in (
                (build_prompt, ["S02"], {"CONTRACTS": [], "EVENTS": self.root / ".fixer/events.json",
                                         "FIRST_USE": self.root / "course-state/first_use_all_report.json"}),
                (build_concept_prompt, ["S02"], {})):
            with self.subTest(brief=brief.__name__):
                self.assertNotIn("S01 is now", run_in(self.root, brief, argv, **extra))
        build(self.root, previous={2: ["beta", "alpha"]})
        registry(self.root, ROUND_FILED, stamp=3, text_stamp=2)
        for brief, argv, extra in (
                (build_prompt, ["S02"], {"CONTRACTS": [], "EVENTS": self.root / ".fixer/events.json",
                                         "FIRST_USE": self.root / "course-state/first_use_all_report.json"}),
                (build_concept_prompt, ["S02"], {})):
            with self.subTest(brief=brief.__name__, text_epoch=2):
                text = run_in(self.root, brief, argv, **extra)
                self.assertIn("written when the course had 2 sections", text)
                self.assertIn("S01 is now S02", text)

    def test_build_concept_prompt_lists_only_the_sections_vocabulary_findings(self) -> None:
        text = run_in(self.root, build_concept_prompt, ["S02"])
        self.assertEqual(set(re.findall(r'"finding_id": "(S\d+-F\d+)"', text)),
                         {f"S02-F{n:02d}" for n in range(1, ROUND_FILED["S02"] + 1)})

    def test_record_cycle_counts_the_sections_findings_as_its_total(self) -> None:
        write(self.root, ".fixer/S02.result.json", json.dumps({"unresolved_questions": [], "patches": []}))
        write(self.root, ".fixer/S02.apply.json", json.dumps(
            {"findings_closed": ["S02-F01"], "applied": 1, "rejected": 0, "patches_offered": 1}))
        run_in(self.root, record_cycle, ["S02"], CYCLES=self.root / "audit/fixer/cycles")
        record = json.loads((self.root / "audit/fixer/cycles/S02.json").read_text(encoding="utf-8"))
        self.assertEqual(record["findings_total"], ROUND_FILED["S02"])
        self.assertEqual(record["findings_open"], ["S02-F02", "S02-F03", "S02-F04"])
        self.assertEqual(record["slug"], "beta")

    def test_the_ledger_row_is_closed_over_the_sections_own_total(self) -> None:
        cycle(self.root, "S02", slug="beta", findings_closed=["S02-F01"])
        run_in(self.root, ledger, [], OUT=self.root / "audit/fixer/LEDGER.md")
        text = (self.root / "audit/fixer/LEDGER.md").read_text(encoding="utf-8")
        self.assertIn("| **S02** beta | 1/4 |", text)
        self.assertIn("| **S03** gamma | 0/2 |", text)

    def test_progress_counts_what_is_left_in_the_untouched_sections(self) -> None:
        cycle(self.root, "S02", slug="beta", findings_closed=["S02-F01"], findings_open=[], patches_rejected=0,
              unresolved_questions=[])
        text = run_in(self.root, progress, [])
        self.assertIn("findings left  : ~3 across 2 untouched sections", text)


class OnlyNumberingReadsTheRegistry(unittest.TestCase):
    def test_no_fixer_tool_or_script_opens_the_registry_but_numbering(self) -> None:
        """The class guard. Five readers selected by tag because each opened the file itself; the way to
        keep a sixth from doing it is that none of them can name the file. Mutation: a direct read in
        progress.py makes this fail, naming progress.py."""
        needle = "consolidated/registry.json"
        owner = ROOT / "tools/fixer/numbering.py"
        hits = []
        for folder in (ROOT / "tools/fixer", ROOT / "scripts"):
            for path in sorted(folder.rglob("*")):
                if path.suffix in {".py", ".sh", ".mjs", ".mts"} and path.is_file() and path != owner \
                        and needle in path.read_text(encoding="utf-8", errors="replace"):
                    hits.append(str(path.relative_to(ROOT)))
        self.assertEqual(hits, [], "read the registry through numbering.registry_findings()")

    def test_numbering_names_the_file_once_for_everyone(self) -> None:
        self.assertEqual(numbering.REGISTRY_FILE, "audit/consolidated/registry.json")


if __name__ == "__main__":
    unittest.main()
