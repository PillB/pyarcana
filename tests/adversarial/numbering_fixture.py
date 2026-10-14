"""A small repository for the numbering tests: three sections, so no test types the real section count.

Shared by test_numbering_epoch.py, test_numbering_registry.py and test_numbering_restamp.py. It is not a
test file (the runner collects `test_*.py` only), and every helper writes into a temporary root the caller
owns, so nothing here touches the real tree.
"""
from __future__ import annotations

import contextlib
import io
import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))

import numbering  # noqa: E402


def run_in(root: Path, module, argv: list[str], **patched) -> str:
    """Run a fixer tool's main() against a temporary tree, as the shell wrappers run it, and return stdout."""
    out = io.StringIO()
    with contextlib.ExitStack() as stack:
        for name, value in {"ROOT": root, **patched}.items():
            stack.enter_context(mock.patch.object(module, name, value))
        stack.enter_context(mock.patch.object(sys, "argv", ["tool", *argv]))
        stack.enter_context(contextlib.redirect_stdout(out))
        module.main()
    return out.getvalue()


def roadmap_of_record_problems(root: Path) -> list[str]:
    """Why the roadmap the epoch file names cannot be the roadmap of record. Empty when it can.

    The name comes from the epoch file and from nowhere else. `restamp.py advance` moves it (in place, or to
    a new file with --roadmap), so a check that typed the file's name would turn the tree red the day the
    epoch flipped; the real tree and a flipped fixture both run this one function."""
    epoch = numbering.load_epoch(root)
    if not (root / epoch.roadmap).is_file():
        return [f"the roadmap of record {epoch.roadmap} is not a file"]
    headings = numbering.roadmap_numbers(root, epoch.roadmap)
    if headings != list(range(1, epoch.count + 1)):
        return [f"{epoch.roadmap} has headings {headings}; the epoch numbers sections 1 to {epoch.count}"]
    return []


def write(root: Path, rel: str, text: str) -> None:
    path = root / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def build(root: Path, slugs=("alpha", "beta", "gamma"), label=None, roadmap_numbers=None,
          course_order=None, index_fields=None, renames=None, epoch_slugs=None, previous=None) -> None:
    """A repository with one section file per slug, imported by index.ts in `course_order`.

    Defaults are a consistent three-section course: epoch label 3, roadmap S1..S3, course order
    equal to the epoch, and each section's `index` equal to its position. `epoch_slugs` writes an
    epoch table that differs from the course (the state of a tree between a renumber and the restamp),
    and `previous` is the epoch file's `previous_epochs`, {label: [slugs]}."""
    table = list(epoch_slugs) if epoch_slugs is not None else list(slugs)
    epoch = {"numbering_epoch": len(table) if label is None else label, "roadmap": "roadmap.md",
             "sections": [{"number": i, "slug": s} for i, s in enumerate(table, 1)]}
    if previous:
        epoch["previous_epochs"] = {str(k): list(v) for k, v in previous.items()}
    write(root, "audit/fixer/numbering_epoch.json", json.dumps(epoch))
    numbers = roadmap_numbers if roadmap_numbers is not None else range(1, len(slugs) + 1)
    write(root, "roadmap.md", "".join(f"### S{n} — Titulo {n}\n" for n in numbers))
    for i, slug in enumerate(slugs, 1):
        index_value = (index_fields or {}).get(slug, i)
        write(root, f"src/lib/course/sections/s{i:02d}-{slug}.ts",
              "export const section%d: CourseSection = {\n  id: '%s',\n  index: %s,\n  title: 'x',\n}\n"
              % (i, slug, index_value))
    order = course_order if course_order is not None else list(slugs)
    imports = "".join(
        f"import {{ section{slugs.index(s) + 1} }} from './sections/s{slugs.index(s) + 1:02d}-{s}'\n"
        for s in order)
    body = "".join(f"  section{slugs.index(s) + 1},\n" for s in order)
    write(root, "src/lib/course/index.ts",
          imports + "export const COURSE_SECTIONS: CourseSection[] = [\n" + body + "]\n")
    pairs = renames or {}
    rows = "".join(f"  '{old}': '{new}',\n" for old, new in pairs.items())
    write(root, "src/lib/section-id-migrations.ts",
          "export const SECTION_ID_RENAMES: Readonly<Record<string, string>> = {\n" + rows + "}\n")


def cycle(root: Path, tag: str, **fields) -> None:
    record = {"section": tag, "numbering_epoch": fields.pop("numbering_epoch", 3),
              "slug": fields.pop("slug", None), **fields}
    write(root, f"audit/fixer/cycles/{tag}.json", json.dumps(record, indent=1, ensure_ascii=False))


def redaction(root: Path, slugs: list[str], stamp: int = 3) -> None:
    write(root, "audit/fixer/redaction_applied.json",
          json.dumps({"numbering_epoch": stamp, "slugs": slugs}, indent=2) + "\n")


def registry(root: Path, filed: dict[str, int], stamp: int | None = 3, text_stamp: int | None = None,
             **extra) -> list[dict]:
    """A registry with `filed[tag]` findings under each tag, ids `<tag>-F01`.. and a text that cites the tag.

    `stamp` None leaves the file unstamped, the state the guard must refuse."""
    findings = [{"section": tag, "finding_id": f"{tag}-F{n:02d}", "severity": "P1",
                 "category": "TERM_UNDEFINED", "title": f"finding {n} of {tag}", "evidence": f"see {tag}"}
                for tag, count in filed.items() for n in range(1, count + 1)]
    data: dict = {"generated": "test", "source": "test"}
    if stamp is not None:
        data["numbering_epoch"] = stamp
        data["text_numbering_epoch"] = stamp if text_stamp is None else text_stamp
    data.update(extra)
    data["total_findings"] = len(findings)
    data["findings"] = findings
    write(root, "audit/consolidated/registry.json", json.dumps(data, indent=1, ensure_ascii=False))
    return findings


class NumberingFixture(unittest.TestCase):
    def setUp(self) -> None:
        self.root = Path(tempfile.mkdtemp(prefix="pyarcana-numbering-"))
        self.addCleanup(shutil.rmtree, self.root, True)


#: Findings filed per tag in a round tree. The counts differ, so a tool that reads the wrong section's
#: findings reports a number that is visibly not its own.
ROUND_FILED = {"S01": 1, "S02": 4, "S03": 2}


def round_tree(root: Path, slugs=("alpha", "beta", "gamma"), filed: dict[str, int] | None = None) -> None:
    """Everything a fixer round reads, for a three-section course: the epoch, the course, a stamped
    registry, the event cache, the reports, and the standing documents. One concept is used in each
    section, and the prose report gives each section a different run-on count."""
    build(root, slugs)
    registry(root, ROUND_FILED if filed is None else filed, stamp=len(slugs))
    write(root, ".fixer/events.json",
          json.dumps({"active_section_ids": list(slugs), "events": [], "terms": []}))
    write(root, "course-state/first_use_all_report.json", json.dumps({"issues": [], "issue_counts": {}}))
    write(root, "course-state/prose_quality_report.json",
          json.dumps({f"S{i:02d}": {"run_on_sentences": 10 * i + 1} for i in range(1, len(slugs) + 1)}))
    write(root, "course-state/concept_map.json", json.dumps({
        f"concept-{i}": {"depth": "L0", "first_definition": None, "sections_used": [f"S{i:02d}"],
                         "surprising_uses": [{"section": f"S{i:02d}", "location": f"{slugs[i - 1]}.theory[0]",
                                              "kind": "prose"}],
                         "examples": [], "self_checks": [], "definitions": [], "uses": []}
        for i in range(1, len(slugs) + 1)}))
    for rel in ("audit/fixer/LEDGER_NOTES.md", "audit/fixer/writing_rules.md", "audit/fixer/decisions.md",
                "audit/fixer/OWNER_DECISIONS.md", "audit/fixer/wiki/README.md"):
        write(root, rel, f"# {rel}\n")
