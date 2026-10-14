"""Owner decision O25: the 12 S03 findings closed against the old s03-data-structures.ts do not count.

audit/fixer/cycles/S03.json closed 12 findings in September 2026, against a file that commit 03474115 (1 Oct)
later replaced (the file grew from 2,511 to 4,330 lines). The owner ruled that nothing is awarded retroactively:
the 12 are marked reopened in the record (not deleted), S03's next round re-checks each against the current
file, and every reader of closed counts leaves them out.

A mark is only as good as its readers. A reader that counts `len(record["findings_closed"])` still counts the
12, so the mark would sit in the record while the ledger and the progress report kept crediting S03. These
tests check three things:
  * the mark is read through numbering.closed_findings / open_findings / reopened_findings, which refuse a
    malformed mark (a finding the record never closed, a mark with no decision behind it);
  * the two readers of closed counts, ledger.py and progress.py, show the reopened findings as open and say so;
  * no other file under tools/ or scripts/ names the closed/open keys, so a new reader has to come through
    numbering (or be added to the list below with the reason it may read the key itself);
and, on the real tree, that the record O25 ruled on carries the mark for exactly the findings it closed.

Mutation proofs are in the commit message that adds this file.
"""
from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))
sys.path.insert(0, str(ROOT / "tests/adversarial"))

import build_prompt  # noqa: E402
import ledger  # noqa: E402
import numbering  # noqa: E402
import progress  # noqa: E402
from numbering import NumberingError  # noqa: E402
from numbering_fixture import ROUND_FILED, NumberingFixture, cycle, round_tree, run_in  # noqa: E402

DECISION = {"decision": "O25", "decided": "2026-10-13", "reason": "closed against a file that was replaced"}
IDS = [f"S02-F{n:02d}" for n in range(1, ROUND_FILED["S02"] + 1)]


def record(**fields) -> dict:
    """A cycle record as numbering.cycle_records returns it: four findings, three closed."""
    return {"findings_total": 4, "findings_closed": IDS[:3], "findings_open": IDS[3:], **fields}


class TheMarkIsReadThroughNumbering(NumberingFixture):
    def test_a_record_with_no_mark_reads_as_written(self) -> None:
        self.assertEqual(numbering.reopened_findings(record()), [])
        self.assertEqual(numbering.closed_findings(record()), IDS[:3])
        self.assertEqual(numbering.open_findings(record()), IDS[3:])

    def test_a_reopened_finding_is_not_closed_and_is_open(self) -> None:
        marked = record(findings_reopened=IDS[:2], reopened_by=DECISION)
        self.assertEqual(numbering.reopened_findings(marked), IDS[:2])
        self.assertEqual(numbering.closed_findings(marked), IDS[2:3])
        self.assertEqual(numbering.open_findings(marked), sorted(IDS[:2] + IDS[3:]))

    def test_closed_plus_open_is_still_every_finding_the_record_knew(self) -> None:
        marked = record(findings_reopened=IDS[:3], reopened_by=DECISION)
        self.assertEqual(numbering.closed_findings(marked), [])
        self.assertEqual(sorted(numbering.open_findings(marked)), IDS)

    def test_the_original_closed_list_is_kept_not_deleted(self) -> None:
        marked = record(findings_reopened=IDS[:3], reopened_by=DECISION)
        numbering.closed_findings(marked)
        self.assertEqual(marked["findings_closed"], IDS[:3])

    def test_a_mark_that_is_not_a_list_of_finding_ids_is_refused(self) -> None:
        for bad in ("S02-F01", [1, 2], None, {"S02-F01": True}):
            with self.subTest(mark=bad), self.assertRaisesRegex(NumberingError, "must list finding ids"):
                numbering.reopened_findings(record(findings_reopened=bad, reopened_by=DECISION))

    def test_a_mark_on_a_finding_the_record_never_closed_is_refused(self) -> None:
        with self.assertRaisesRegex(NumberingError, "S02-F04.*never closed"):
            numbering.reopened_findings(record(findings_reopened=[IDS[3]], reopened_by=DECISION))

    def test_a_mark_with_no_decision_behind_it_is_refused(self) -> None:
        for decision in (None, {}, {"decision": ""}, "O25"):
            with self.subTest(reopened_by=decision), self.assertRaisesRegex(NumberingError, "decision"):
                numbering.reopened_findings(record(findings_reopened=IDS[:1], reopened_by=decision))

    def test_the_loader_refuses_a_malformed_mark_so_no_reader_sees_one(self) -> None:
        round_tree(self.root)
        cycle(self.root, "S02", slug="beta", **record(findings_reopened=[IDS[3]], reopened_by=DECISION))
        with self.assertRaisesRegex(NumberingError, "S02.json.*never closed"):
            numbering.cycle_records(self.root)
        self.assertTrue(any("never closed" in p for p in numbering.check_epoch(self.root)))


class EveryReaderLeavesTheReopenedFindingsOut(NumberingFixture):
    def setUp(self) -> None:
        super().setUp()
        round_tree(self.root)

    def ledger_text(self) -> str:
        run_in(self.root, ledger, [], OUT=self.root / "audit/fixer/LEDGER.md")
        return (self.root / "audit/fixer/LEDGER.md").read_text(encoding="utf-8")

    def progress_text(self) -> str:
        return run_in(self.root, progress, [])

    def closed_cycle(self, **fields) -> None:
        cycle(self.root, "S02", slug="beta", patches_rejected=0, unresolved_questions=[],
              **record(findings_closed=IDS, findings_open=[], **fields))

    def test_the_ledger_shows_closed_over_total_and_says_how_many_are_reopened(self) -> None:
        self.closed_cycle(findings_reopened=IDS[:3], reopened_by=DECISION)
        self.assertIn("| **S02** beta | 1/4 (3 reopened) |", self.ledger_text())

    def test_a_section_whose_closures_were_all_reopened_does_not_tick_the_findings_box(self) -> None:
        self.closed_cycle()
        control = self.ledger_text()
        self.assertIn("| **S02** beta | 4/4 |", control)
        self.assertIn("| `findings` | codex round applied, registry findings closed | 1/3 |", control)
        self.closed_cycle(findings_reopened=IDS, reopened_by=DECISION)
        marked = self.ledger_text()
        self.assertIn("| **S02** beta | 0/4 (4 reopened) |", marked)
        self.assertIn("| `findings` | codex round applied, registry findings closed | 0/3 |", marked)

    def test_the_ledger_adds_nothing_to_a_row_that_has_no_mark(self) -> None:
        self.closed_cycle()
        self.assertNotIn("reopened", self.ledger_text())

    def test_progress_counts_the_reopened_findings_as_open(self) -> None:
        self.closed_cycle(findings_reopened=IDS[:3], reopened_by=DECISION)
        text = self.progress_text()
        self.assertIn("findings closed: 1", text)
        self.assertIn("findings reopened: 3", text)
        row = next(line for line in text.splitlines() if line.startswith("S02"))
        self.assertEqual(row.split()[:3], ["S02", "1", "3"])

    def test_the_next_rounds_brief_still_carries_every_finding_including_the_reopened(self) -> None:
        """S03's next round has to re-check the 12. The brief is built from the registry, not from the cycle
        record, so a reopened finding is offered again; a brief that dropped what a record once closed would
        skip exactly the re-check the owner asked for."""
        self.closed_cycle(findings_reopened=IDS, reopened_by=DECISION)
        text = run_in(self.root, build_prompt, ["S02"], CONTRACTS=[], EVENTS=self.root / ".fixer/events.json",
                      FIRST_USE=self.root / "course-state/first_use_all_report.json")
        self.assertIn(f"FINDINGS TO FIX ({len(IDS)})", text)
        for finding in IDS:
            self.assertIn(f'"finding_id": "{finding}"', text)

    def test_progress_without_a_mark_reports_as_before(self) -> None:
        self.closed_cycle()
        text = self.progress_text()
        self.assertIn("findings closed: 4", text)
        self.assertNotIn("reopened", text)


class OnlyNumberingReadsTheClosedAndOpenKeys(unittest.TestCase):
    """The class behind the mark being ignored: a reader that names `findings_closed` itself counts what the
    record says, not what stands. The list is every file that may name the keys, and why."""

    ALLOWED = {
        "tools/fixer/numbering.py": "the one reader of a cycle record's closed and open lists",
        "tools/fixer/record_cycle.py": "writes the record, and reads the round's apply report of the same name",
        "tools/fixer/apply_patches.py": "writes the round's apply report, which is not a cycle record",
        "tools/fixer/run_chain.sh": "reads the round's apply report for its commit message",
    }
    KEYS = ("findings_closed", "findings_open")

    def files_naming_the_keys(self) -> list[str]:
        found = []
        for folder in (ROOT / "tools", ROOT / "scripts"):
            for path in sorted(folder.rglob("*")):
                if path.suffix in {".py", ".sh", ".mjs", ".mts", ".js"} and path.is_file() \
                        and not any(part.startswith("quarantine") for part in path.parts) \
                        and any(key in path.read_text(encoding="utf-8", errors="replace") for key in self.KEYS):
                    found.append(str(path.relative_to(ROOT)))
        return found

    def test_no_other_file_names_the_closed_or_open_keys(self) -> None:
        extra = sorted(set(self.files_naming_the_keys()) - set(self.ALLOWED))
        self.assertEqual(extra, [], "read closed and open counts through numbering.closed_findings and "
                                    "numbering.open_findings, or add the file to ALLOWED with the reason")

    def test_every_allowed_file_still_names_them(self) -> None:
        """An entry that no longer matches is a stale excuse; remove it."""
        stale = sorted(set(self.ALLOWED) - set(self.files_naming_the_keys()))
        self.assertEqual(stale, [])


class TheRecordTheOwnerRuledOnCarriesTheMark(unittest.TestCase):
    """Real tree. The record is found by the commit it was written at; when S03's next round replaces it
    with a record from that round, there is nothing left to mark and these pass for the new record."""

    RULED_ON_COMMIT = "86a09ad0cad3c07ca8a92f6540c6c8de8aded348"

    def s03(self) -> dict:
        return json.loads((ROOT / numbering.CYCLES_DIR / "S03.json").read_text(encoding="utf-8"))

    def test_the_twelve_closures_are_reopened_not_deleted_and_name_the_decision(self) -> None:
        s03 = self.s03()
        if s03["commit"] != self.RULED_ON_COMMIT:
            self.assertNotIn("S03-F05", numbering.reopened_findings(s03), "a new round's record reopens nothing")
            return
        self.assertEqual(len(s03["findings_closed"]), 12)
        self.assertEqual(sorted(s03.get("findings_reopened", [])), sorted(s03["findings_closed"]),
                         "the record O25 ruled on must mark every closure it made as reopened")
        self.assertEqual(s03.get("reopened_by", {}).get("decision"), "O25")
        self.assertEqual(numbering.closed_findings(s03), [])
        self.assertEqual(len(numbering.open_findings(s03)), s03["findings_total"])

    def test_the_committed_ledger_credits_s03_with_none_of_them(self) -> None:
        if self.s03()["commit"] != self.RULED_ON_COMMIT:
            return
        text = (ROOT / "audit/fixer/LEDGER.md").read_text(encoding="utf-8")
        self.assertIn("| **S03** decisions-rules | 0/17 (12 reopened) |", text)

    def test_the_decision_is_recorded_where_the_next_round_reads_it(self) -> None:
        text = (ROOT / "audit/fixer/decisions.md").read_text(encoding="utf-8")
        record_d23 = text.split("## D23", 1)[1].split("\n## D", 1)[0]
        for needed in ("O25", "findings_reopened", "numbering.closed_findings"):
            self.assertIn(needed, record_d23)


if __name__ == "__main__":
    unittest.main()
