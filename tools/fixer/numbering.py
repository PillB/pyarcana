#!/usr/bin/env python3
"""The fixer's one answer to "which section is number N?", and the checks that make it trustworthy.

A section's number belongs to a numbering epoch, not to the section. The epoch
(audit/fixer/numbering_epoch.json) names the roadmap of record and lists the slugs in number order.
Every fixer tool reads numbers and slugs through this module, so the answer comes from committed
files rather than from a cache.

Fixer state is keyed by slug, and a slug has a number only through the epoch. A record that names
a number and a slug that disagree, a record with no epoch, or a record from another epoch is refused
rather than read. An old slug is carried to its current one by the app's own rename map
(src/lib/section-id-migrations.ts), so a section renamed in place keeps its history.

A renumber is therefore one epoch change plus one restamp, never a hand edit of the state:
`tools/fixer/restamp.py advance` writes the next epoch from the course as the renumber left it,
keeps the old epoch's table in the epoch file's `previous_epochs`, and re-keys the cycle records, the
redaction list and the finding registry to the new numbers. The tree is red between the renumber and
that command, and green after it.

Two files are called an epoch, and they answer different questions.
  * audit/fixer/numbering_epoch.json (this module, the fixer) says which slug each number names now. It
    exists for the life of the course and moves with every renumber, keeping the old tables.
  * audit/safe-agent/renumber_epoch.json (the preservation guards G-11 and G-15; schema renumber_epoch/1)
    says a renumber commit happened: its sha, and the sections that commit added. It does not exist until
    that commit, and its presence arms the guards, so it is a window's switch and not a table.
They are kept apart because the window closes and the table does not, and because folding the sha into
the table would make the guards' dormancy depend on a fixer file. When the window file exists the two
must agree: the sections it says were added are exactly the slugs this epoch has and the epoch before it
did not (renumber_epoch_problems, run by check_epoch). Dormant while the window file is absent.

    python3 tools/fixer/numbering.py     # check the epoch against the roadmap, the course and the state
"""
from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EPOCH_FILE = "audit/fixer/numbering_epoch.json"
COURSE_INDEX = "src/lib/course/index.ts"
SECTIONS_DIR = "src/lib/course/sections"
RENAMES_FILE = "src/lib/section-id-migrations.ts"
CYCLES_DIR = "audit/fixer/cycles"
REDACTION_FILE = "audit/fixer/redaction_applied.json"
REGISTRY_FILE = "audit/consolidated/registry.json"
RENUMBER_EPOCH_FILE = "audit/safe-agent/renumber_epoch.json"

TAG = re.compile(r"[Ss](\d+)")
ROADMAP_HEADING = re.compile(r"^### S(\d+) — ", re.M)
COURSE_ARRAY = re.compile(r"export const COURSE_SECTIONS: CourseSection\[\] = \[(.*?)\n\]", re.S)
IMPORT = re.compile(r"import \{ (section\d+) \} from '\./sections/([^']+)'")
SECTION_ID = re.compile(r"^\s*id:\s*['\"]([^'\"]+)['\"]", re.M)
SECTION_INDEX = re.compile(r"^\s*index:\s*(\d+),", re.M)
RENAMES_BLOCK = re.compile(r"export const SECTION_ID_RENAMES[^=]*=\s*\{(.*?)\n\}", re.S)
RENAME_ROW = re.compile(r"^\s*'?([A-Za-z0-9_-]+)'?\s*:\s*'([A-Za-z0-9_-]+)'\s*,?\s*$", re.M)


class NumberingError(RuntimeError):
    """The numbering cannot be trusted, so nothing keyed by it may be read or written."""


@dataclass(frozen=True)
class Epoch:
    label: int
    roadmap: str
    slugs: tuple[str, ...]
    #: The tables of the epochs this one replaced, oldest first: (label, slugs in number order).
    previous: tuple[tuple[int, tuple[str, ...]], ...] = ()

    @property
    def count(self) -> int:
        return len(self.slugs)

    def previous_table(self, label: object) -> tuple[str, ...] | None:
        """The slugs, in number order, of an earlier epoch this file remembers. None when it does not."""
        return next((table for known, table in self.previous if known == label), None)


def _slug_list_problem(slugs: object) -> str | None:
    """Why a list cannot be a table of slugs, or None when it can."""
    if not isinstance(slugs, list) or not slugs:
        return "must list slugs"
    if not all(isinstance(s, str) and s for s in slugs) or len(set(slugs)) != len(slugs):
        return "must list unique, non-empty strings"
    return None


def _previous_problems(data: dict) -> list[str]:
    prior = data.get("previous_epochs", {})
    if not isinstance(prior, dict):
        return ["previous_epochs must map an epoch label to its slugs"]
    problems = []
    for key, slugs in prior.items():
        why = _slug_list_problem(slugs)
        if not key.isdigit() or why:
            problems.append(f"previous_epochs[{key!r}] {why or 'needs a numeric label'}")
        elif int(key) != len(slugs):
            problems.append(f"previous_epochs[{key!r}] lists {len(slugs)} slugs; the label must be that count")
        elif int(key) == data.get("numbering_epoch"):
            problems.append(f"previous_epochs lists the current epoch {key}")
    return problems


def epoch_problems(data: object) -> list[str]:
    """Why a parsed epoch file cannot be used. Empty when it can."""
    rows = data.get("sections") if isinstance(data, dict) else None
    if not isinstance(rows, list) or not rows or not all(isinstance(r, dict) for r in rows):
        return ["the epoch lists no sections"]
    problems = []
    if [r.get("number") for r in rows] != list(range(1, len(rows) + 1)):
        problems.append("section numbers must run one to n in order")
    slugs = [r.get("slug") for r in rows]
    if _slug_list_problem(slugs):
        problems.append("slugs must be unique, non-empty strings")
    if data.get("numbering_epoch") != len(rows):
        problems.append(f"numbering_epoch is {data.get('numbering_epoch')!r} but the table lists "
                        f"{len(rows)} sections; the label must be that count")
    if not isinstance(data.get("roadmap"), str):
        problems.append("the epoch names no roadmap of record")
    problems.extend(_previous_problems(data))
    return problems


def load_epoch(root: Path = ROOT) -> Epoch:
    path = root / EPOCH_FILE
    if not path.exists():
        raise NumberingError(f"no numbering epoch recorded at {EPOCH_FILE}: the fixer cannot number sections")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise NumberingError(f"{EPOCH_FILE} is not valid JSON: {e}") from e
    problems = epoch_problems(data)
    if problems:
        raise NumberingError(f"{EPOCH_FILE}: " + "; ".join(problems))
    previous = tuple((int(key), tuple(slugs)) for key, slugs in data.get("previous_epochs", {}).items())
    return Epoch(label=data["numbering_epoch"], roadmap=data["roadmap"],
                 slugs=tuple(r["slug"] for r in data["sections"]), previous=previous)


def tag_of(number: int) -> str:
    return f"S{number:02d}"


def number_of_tag(tag: str) -> int:
    m = TAG.fullmatch(tag.strip())
    if not m:
        raise NumberingError(f"{tag!r} is not a section tag")
    return int(m.group(1))


def slug_for_tag(tag: str, epoch: Epoch) -> str:
    number = number_of_tag(tag)
    if not 1 <= number <= epoch.count:
        raise NumberingError(f"{tag} is outside the {epoch.count}-section epoch {epoch.label}")
    return epoch.slugs[number - 1]


def number_of_slug(slug: str, epoch: Epoch) -> int:
    if slug not in epoch.slugs:
        raise NumberingError(f"{slug!r} is not a section of this epoch")
    return epoch.slugs.index(slug) + 1


def tag_for_slug(slug: str, epoch: Epoch) -> str:
    return tag_of(number_of_slug(slug, epoch))


def resolve(name: str, epoch: Epoch) -> str:
    """A slug or a tag, as the slug. Anything else is refused, never passed through."""
    if TAG.fullmatch(name.strip()):
        return slug_for_tag(name, epoch)
    if name in epoch.slugs:
        return name
    raise NumberingError(f"{name!r} is not a section of this epoch")


def roadmap_numbers(root: Path, roadmap: str) -> list[int]:
    path = root / roadmap
    if not path.exists():
        raise NumberingError(f"the roadmap of record {roadmap} is missing")
    return [int(n) for n in ROADMAP_HEADING.findall(path.read_text(encoding="utf-8"))]


def _read(root: Path, rel: str) -> str:
    try:
        return (root / rel).read_text(encoding="utf-8")
    except FileNotFoundError as e:
        raise NumberingError(f"{rel} is listed by the course but is missing") from e


def course_order(root: Path = ROOT) -> list[tuple[str, int | None, str]]:
    """(slug, index field, file) for each COURSE_SECTIONS entry, in the order the course lists them."""
    index = _read(root, COURSE_INDEX)
    block = COURSE_ARRAY.search(index)
    if not block:
        raise NumberingError(f"cannot read COURSE_SECTIONS in {COURSE_INDEX}")
    imports = {name: f"{SECTIONS_DIR}/{stem}.ts" for name, stem in IMPORT.findall(index)}
    rows = []
    for name in re.findall(r"\b(section\d+)\b", block.group(1)):
        if name not in imports:
            raise NumberingError(f"COURSE_SECTIONS names {name}, which {COURSE_INDEX} does not import")
        text = _read(root, imports[name])
        ident, number = SECTION_ID.search(text), SECTION_INDEX.search(text)
        rows.append((ident.group(1) if ident else None, int(number.group(1)) if number else None,
                     imports[name]))
    return rows


def section_files(root: Path = ROOT) -> dict[str, str]:
    """Active section file (repository-relative) -> slug. Files the course does not import are absent."""
    return {rel: slug for slug, _, rel in course_order(root) if slug}


def slug_for_section_file(rel: str, root: Path = ROOT) -> str | None:
    """The slug of an active section file, or None for a file the course does not import."""
    return section_files(root).get(rel)


def section_rel(slug: str, root: Path = ROOT) -> str:
    for path, owner in section_files(root).items():
        if owner == slug:
            return path
    raise NumberingError(f"{slug!r} has no active section file")


def renames(root: Path = ROOT) -> dict[str, str]:
    """The app's rename map, old slug -> current slug, read from the file the app itself uses."""
    block = RENAMES_BLOCK.search(_read(root, RENAMES_FILE))
    if not block:
        raise NumberingError(f"cannot read SECTION_ID_RENAMES in {RENAMES_FILE}")
    return dict(RENAME_ROW.findall(block.group(1)))


def current_slug(slug: str, root: Path = ROOT) -> str:
    """The slug a stored slug stands for today. One step only: the map never chains."""
    return renames(root).get(slug, slug)


RESTAMP_COMMAND = "python3 tools/fixer/restamp.py"


def stale_stamp(where: str, found: object, epoch: Epoch) -> str:
    """The refusal for state stamped with another epoch, and what to do about it."""
    if epoch.previous_table(found) is not None:
        way = f"run `{RESTAMP_COMMAND}` to carry it to the current numbering"
    else:
        way = (f"the epoch file keeps no table for epoch {found!r}, so its numbers cannot be carried "
               f"over; `{RESTAMP_COMMAND} advance` writes that table when the epoch moves")
    return f"{where} is from epoch {found!r}, but the current epoch is {epoch.label}; {way}"


def checked_cycle_slug(path: Path, record: dict, epoch: Epoch, root: Path) -> str:
    """The slug a cycle record stands for under `epoch`, or why it cannot be placed."""
    tag, where = path.stem, path.name
    if record.get("section") != tag:
        raise NumberingError(f"{where} is filed as {tag} but says it is {record.get('section')!r}")
    if "numbering_epoch" not in record:
        raise NumberingError(f"{where} has no numbering_epoch: a record must say which epoch its number belongs to")
    if record["numbering_epoch"] != epoch.label:
        raise NumberingError(stale_stamp(where, record["numbering_epoch"], epoch))
    expected, slug = slug_for_tag(tag, epoch), record.get("slug")
    if not isinstance(slug, str):
        raise NumberingError(f"{where} has no slug")
    written = record.get("slug_at_record")
    if written is not None and current_slug(written, root) != slug:
        raise NumberingError(f"{where} was written as {written!r}, which the rename map does not carry to {slug!r}")
    if slug != expected:
        raise NumberingError(f"{where}: slug and number mismatch: {tag} is {expected!r} in epoch {epoch.label}, "
                             f"the record says {slug!r}")
    return slug


def cycle_records(root: Path = ROOT, epoch: Epoch | None = None) -> dict[str, dict]:
    """Every cycle record, keyed by its slug. Any record that cannot be placed refuses the whole read."""
    epoch = epoch or load_epoch(root)
    records: dict[str, dict] = {}
    for path in sorted((root / CYCLES_DIR).glob("S*.json")):
        record = json.loads(path.read_text(encoding="utf-8"))
        records[checked_cycle_slug(path, record, epoch, root)] = record
    return records


def redacted_slugs(root: Path = ROOT, epoch: Epoch | None = None) -> set[str]:
    """The sections whose redaction round is recorded. No list yet means none are recorded."""
    epoch = epoch or load_epoch(root)
    path = root / REDACTION_FILE
    if not path.exists():
        return set()
    data = json.loads(path.read_text(encoding="utf-8"))
    if "numbering_epoch" not in data:
        raise NumberingError(f"{REDACTION_FILE} has no numbering_epoch: the slugs say which sections, "
                             f"and the epoch says which numbering they were checked against")
    if data["numbering_epoch"] != epoch.label:
        raise NumberingError(stale_stamp(REDACTION_FILE, data["numbering_epoch"], epoch))
    if not isinstance(data.get("slugs"), list):
        raise NumberingError(f"{REDACTION_FILE} names no slugs")
    slugs = set(data["slugs"])
    unknown = sorted(slugs - set(epoch.slugs))
    if unknown:
        raise NumberingError(f"{REDACTION_FILE} names {unknown}, which the epoch does not number")
    return slugs


def read_registry(root: Path = ROOT) -> dict:
    """The registry as parsed, for the code that checks or restamps it. Readers want registry_findings."""
    path = root / REGISTRY_FILE
    if not path.exists():
        raise NumberingError(f"{REGISTRY_FILE} is missing: there are no findings to number")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise NumberingError(f"{REGISTRY_FILE} is not valid JSON: {e}") from e
    return data


def registry_problems(registry: object, epoch: Epoch) -> list[str]:
    """Why a parsed registry cannot be read under this epoch. Empty when it can.

    A finding names its section by number, so the file as a whole must say which numbering those
    numbers belong to, and it must be the current one. An unstamped registry would be read as current
    and brief Codex with another section's findings the day a renumber moves the sections."""
    findings = registry.get("findings") if isinstance(registry, dict) else None
    if not isinstance(findings, list) or not all(isinstance(f, dict) for f in findings):
        return [f"{REGISTRY_FILE} holds no list of findings"]
    stamp = registry.get("numbering_epoch")
    if stamp is None:
        return [f"{REGISTRY_FILE} has no numbering_epoch: its findings name sections by number, and a "
                f"number means nothing without the numbering it was written under"]
    if stamp != epoch.label:
        return [stale_stamp(REGISTRY_FILE, stamp, epoch)]
    tags ={tag_of(n) for n in range(1, epoch.count + 1)}
    stray = sorted({str(f.get("section")) for f in findings} - tags)
    if stray:
        return [f"{REGISTRY_FILE} files findings under {stray[:5]}, which the epoch does not number"]
    return []


def registry_findings(root: Path = ROOT, epoch: Epoch | None = None) -> dict[str, list[dict]]:
    """The registry's findings keyed by slug, every slug of the epoch present, in epoch order.

    The one place the registry is read. A tool that wants a section's findings asks for its slug here
    rather than filtering `f["section"] == tag`, which is right only while the tag still names the same
    section."""
    epoch = epoch or load_epoch(root)
    registry = read_registry(root)
    problems = registry_problems(registry, epoch)
    if problems:
        raise NumberingError("; ".join(problems))
    by_slug: dict[str, list[dict]] = {slug: [] for slug in epoch.slugs}
    for finding in registry["findings"]:
        by_slug[epoch.slugs[number_of_tag(finding["section"]) - 1]].append(finding)
    return by_slug


def text_epoch_note(root: Path = ROOT, epoch: Epoch | None = None) -> str:
    """What a brief must tell Codex when the findings' own text counts sections the old way.

    A finding's title, evidence and fix cite sections and findings by number ("S28", "S28-F04"), and
    restamping re-keys only where a finding is filed. The text stays as the auditors wrote it, under
    `text_numbering_epoch`. Empty when that is the current numbering."""
    epoch = epoch or load_epoch(root)
    written = read_registry(root).get("text_numbering_epoch", epoch.label)
    if written == epoch.label:
        return ""
    table = epoch.previous_table(written)
    if table is None:
        raise NumberingError(f"the findings' text counts sections as epoch {written!r}, which the epoch file "
                             f"keeps no table for, so their section numbers cannot be read")
    moves = []
    for old, slug in enumerate(table, 1):
        new = number_of_slug(current_slug(slug, root), epoch)
        if new != old:
            moves.append(f"S{old:02d} is now S{new:02d}")
    return (f"The findings below were written when the course had {len(table)} sections. A section number or "
            f"finding id inside their text (S28, S28-F04) counts sections that way; the findings themselves "
            f"are filed under today's numbers. "
            + (f"Where a section has moved, read the old number as the new one: {', '.join(moves)}. "
               f"Every number not listed is unchanged." if moves else "No section has moved since."))


def course_problems(epoch: Epoch, headings: list[int], order: list[tuple[str, int | None, str]]) -> list[str]:
    """How the roadmap's headings and the course's own order and `index` fields disagree with an epoch."""
    problems = []
    if headings != list(range(1, epoch.count + 1)):
        problems.append(f"roadmap {epoch.roadmap} headings are {headings}; the epoch has sections 1 to {epoch.count}")
    slugs = [slug for slug, _, _ in order]
    if slugs != list(epoch.slugs):
        problems.append(f"course order {slugs} does not match the epoch's {list(epoch.slugs)}")
    for position, (slug, number, rel) in enumerate(order, 1):
        if number != position:
            problems.append(f"{rel} is section {slug} with index {number}, but the course lists it at position {position}")
    return problems


def renumber_epoch_problems(root: Path, epoch: Epoch) -> list[str]:
    """Where the renumber window's epoch file and this epoch tell different stories. Empty while the
    window file does not exist (it is written by the renumber commit), and when they agree."""
    path = root / RENUMBER_EPOCH_FILE
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        return [f"{RENUMBER_EPOCH_FILE} is not valid JSON: {e}"]
    rows = data.get("new_slugs") if isinstance(data, dict) else None
    if not isinstance(rows, list) or not all(isinstance(r, dict) for r in rows):
        return [f"{RENUMBER_EPOCH_FILE} lists no new_slugs"]
    if not epoch.previous:
        return [f"{RENUMBER_EPOCH_FILE} records a renumber, but {EPOCH_FILE} keeps no table of the numbering "
                f"before it; `{RESTAMP_COMMAND} advance` writes that table"]
    earlier = set(max(epoch.previous)[1])
    added = {(slug, number) for number, slug in enumerate(epoch.slugs, 1) if slug not in earlier}
    declared = {(row.get("slug"), row.get("index")) for row in rows}
    if declared != added:
        return [f"{RENUMBER_EPOCH_FILE} says the renumber added {sorted(declared, key=str)}, but {EPOCH_FILE} "
                f"added {sorted(added)} (slug, number) since epoch {max(epoch.previous)[0]}"]
    return []


def check_epoch(root: Path = ROOT) -> list[str]:
    """Every way the epoch, the roadmap, the course and the fixer state disagree. Empty when they agree."""
    try:
        epoch = load_epoch(root)
        headings = roadmap_numbers(root, epoch.roadmap)
        order = course_order(root)
        cycle_records(root, epoch)
        redacted_slugs(root, epoch)
        if (root / REGISTRY_FILE).exists():
            registry_findings(root, epoch)
    except (NumberingError, json.JSONDecodeError) as e:
        return [str(e)]
    return course_problems(epoch, headings, order) + renumber_epoch_problems(root, epoch)


def main() -> int:
    problems = check_epoch(ROOT)
    for problem in problems:
        print(f"  FAIL {problem}")
    if problems:
        print("numbering: refused; the fixer cannot number sections until the epoch, the roadmap, the course "
              "and the state agree")
        print(f"after a renumber has changed the course and the roadmap, `{RESTAMP_COMMAND} advance "
              f"--roadmap <the new roadmap>` moves the epoch and the state together")
        return 1
    epoch = load_epoch(ROOT)
    print(f"numbering: {epoch.count} sections in epoch {epoch.label}, from {epoch.roadmap}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
