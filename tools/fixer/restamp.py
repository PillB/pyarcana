#!/usr/bin/env python3
"""Carry the fixer's state across a renumber: one command, and the tree is green again.

The fixer refuses state stamped with another numbering epoch (see numbering.py), because a number read
under the wrong epoch names the wrong section. That refusal is right, and it needs a way through, or the
renumber's epoch commit would leave the tree red until someone hand-edited nine files. This is the way
through. State is keyed by slug and a slug does not move, so each record is carried by its slug: the
number it had is read from the table of the epoch it was stamped with, the slug it names must still be a
section of the new epoch, and the number it has now is looked up there.

    python3 tools/fixer/restamp.py                       # state stamped with an earlier epoch -> current
    python3 tools/fixer/restamp.py advance --roadmap R   # the course was renumbered: write the next
                                                         # epoch from it, then restamp, in one step

What it rewrites, and what it leaves:
  * audit/fixer/cycles/SXX.json: `section`, `numbering_epoch` and `slug` are re-keyed. The file is renamed
    when its section's number moved (git records a rename; no content is removed). A record whose section
    the new course no longer lists is refused, since it would have no place.
  * audit/fixer/redaction_applied.json: stamped. Its slugs do not change.
  * the finding registry (numbering.REGISTRY_FILE): each finding's `section` is re-keyed and `numbering_epoch`
    stamped.
    Finding ids and the text of the findings are not touched; `text_numbering_epoch` keeps saying which
    numbering that text uses, and the briefs tell Codex how to read it.
Everything is planned and checked before anything is written, so a refusal leaves the tree as it was.

Not rewritten, because they are regenerated from the course: course-state/concept_map.json,
course-state/prose_quality_report.json, .fixer/ (gitignored) and the LEDGER (python3 tools/fixer/ledger.py).
Run `python3 tools/fixer/ledger.py` after a restamp, and the gate's reports are rebuilt by the next round.
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numbering  # noqa: E402
from numbering import NumberingError  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]

#: (files to write: path -> text, files to remove, one line per change)
Plan = tuple[dict[Path, str], list[Path], list[str]]


def _prior_table(epoch: numbering.Epoch, found: object, where: str) -> tuple[str, ...]:
    table = epoch.previous_table(found)
    if table is None:
        raise NumberingError(f"{where} is from epoch {found!r}, and the epoch file keeps no table for it, so "
                             f"its numbers cannot be carried to epoch {epoch.label}")
    return table


def _carried_slug(table: tuple[str, ...], number: int, claimed: str | None, epoch: numbering.Epoch,
                  root: Path, where: str) -> str:
    """The slug the old table gives `number`, checked against what the record claims and carried to its
    current id. It must be a section of the new epoch."""
    if not 1 <= number <= len(table):
        raise NumberingError(f"{where} names section {number}, which its epoch ({len(table)} sections) "
                             f"does not number")
    old = numbering.current_slug(table[number - 1], root)
    if claimed is not None and numbering.current_slug(claimed, root) != old:
        raise NumberingError(f"{where}: its epoch numbers section {number} as {table[number - 1]!r}, but the "
                             f"record says {claimed!r}")
    if old not in epoch.slugs:
        raise NumberingError(f"{where} belongs to {old!r}, which epoch {epoch.label} no longer lists: a "
                             f"section may move or be renamed, but its records need a place")
    return old


def _carried_cycle(path: Path, record: dict, epoch: numbering.Epoch, root: Path) -> tuple[str, dict]:
    """(new tag, record) for one cycle file. The record is the very same object when it is already current."""
    stamp = record.get("numbering_epoch")
    if stamp == epoch.label:
        numbering.checked_cycle_slug(path, record, epoch, root)
        return path.stem, record
    if stamp is None:
        raise NumberingError(f"{path.name} has no numbering_epoch: a record must say which epoch its number "
                             f"belongs to before it can be carried")
    if record.get("section") != path.stem:
        raise NumberingError(f"{path.name} is filed as {path.stem} but says it is {record.get('section')!r}")
    claimed = record.get("slug")
    if not isinstance(claimed, str):
        raise NumberingError(f"{path.name} has no slug")
    slug = _carried_slug(_prior_table(epoch, stamp, path.name), numbering.number_of_tag(path.stem), claimed,
                         epoch, root, path.name)
    carried = {**record, "section": numbering.tag_for_slug(slug, epoch), "numbering_epoch": epoch.label,
               "slug": slug}
    if slug != claimed and "slug_at_record" not in record:
        carried["slug_at_record"] = claimed
    return carried["section"], carried


def plan_cycles(root: Path, epoch: numbering.Epoch) -> Plan:
    directory = root / numbering.CYCLES_DIR
    paths = sorted(directory.glob("S*.json"))
    placed: dict[Path, tuple[Path, dict, bool]] = {}      # target file -> (source file, record, changed)
    for path in paths:
        record = json.loads(path.read_text(encoding="utf-8"))
        tag, carried = _carried_cycle(path, record, epoch, root)
        target = directory / f"{tag}.json"
        if target in placed:
            raise NumberingError(f"{placed[target][0].name} and {path.name} would both become {target.name}")
        placed[target] = (path, carried, carried is not record)
    writes = {target: json.dumps(record, indent=1, ensure_ascii=False)
              for target, (_, record, changed) in placed.items() if changed}
    notes = [f"cycle {source.name} -> {target.name} ({record['slug']})" if source != target
             else f"cycle {source.name} stamped {epoch.label}"
             for target, (source, record, changed) in placed.items() if changed]
    return writes, [path for path in paths if path not in placed], notes


def _number_in(table: tuple[str, ...], slug: object, where: str) -> int:
    if slug not in table:
        raise NumberingError(f"{where} names {slug!r}, which its epoch does not number")
    return table.index(slug) + 1


def plan_redaction(root: Path, epoch: numbering.Epoch) -> Plan:
    path = root / numbering.REDACTION_FILE
    if not path.exists():
        return {}, [], []
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("numbering_epoch") == epoch.label:
        numbering.redacted_slugs(root, epoch)
        return {}, [], []
    table = _prior_table(epoch, data.get("numbering_epoch"), path.name)
    if not isinstance(data.get("slugs"), list):
        raise NumberingError(f"{path.name} names no slugs")
    carried = [_carried_slug(table, _number_in(table, slug, path.name), slug, epoch, root, path.name)
               for slug in data["slugs"]]
    text = json.dumps({**data, "numbering_epoch": epoch.label, "slugs": carried}, indent=2,
                      ensure_ascii=False) + "\n"
    return {path: text}, [], [f"redaction list stamped {epoch.label} ({len(carried)} sections)"]


def plan_registry(root: Path, epoch: numbering.Epoch) -> Plan:
    if not (root / numbering.REGISTRY_FILE).exists():
        return {}, [], []
    registry = numbering.read_registry(root)
    stamp = registry.get("numbering_epoch")
    if stamp == epoch.label:
        problems = numbering.registry_problems(registry, epoch)
        if problems:
            raise NumberingError("; ".join(problems))
        return {}, [], []
    table = _prior_table(epoch, stamp, numbering.REGISTRY_FILE)
    if not isinstance(registry.get("findings"), list):
        raise NumberingError(f"{numbering.REGISTRY_FILE} holds no list of findings")
    moved = 0
    for finding in registry["findings"]:
        slug = _carried_slug(table, numbering.number_of_tag(str(finding.get("section"))), None, epoch, root,
                             f"{numbering.REGISTRY_FILE} finding {finding.get('finding_id')!r}")
        tag = numbering.tag_for_slug(slug, epoch)
        moved += tag != finding["section"]
        finding["section"] = tag
    registry.setdefault("text_numbering_epoch", stamp)
    registry["numbering_epoch"] = epoch.label
    count = len(registry["findings"])
    return ({root / numbering.REGISTRY_FILE: json.dumps(registry, indent=1, ensure_ascii=False)}, [],
            [f"registry stamped {epoch.label}: {count} findings re-keyed, {moved} under a new number"])


def plan_state(root: Path, epoch: numbering.Epoch) -> Plan:
    """Every change the state needs under `epoch`, checked, with nothing written."""
    writes: dict[Path, str] = {}
    removes: list[Path] = []
    notes: list[str] = []
    for plan in (plan_cycles(root, epoch), plan_redaction(root, epoch), plan_registry(root, epoch)):
        writes.update(plan[0])
        removes.extend(plan[1])
        notes.extend(plan[2])
    return writes, removes, notes


def apply(writes: dict[Path, str], removes: list[Path]) -> None:
    """Write every file beside its target first, then move them into place, then remove what was vacated.
    A failure while writing leaves the real files as they were."""
    staged: dict[Path, Path] = {}
    try:
        for path, text in writes.items():
            tmp = path.with_name(path.name + ".restamp.tmp")
            tmp.write_text(text, encoding="utf-8")
            staged[path] = tmp
        for path, tmp in staged.items():
            os.replace(tmp, path)
    finally:
        for tmp in staged.values():
            tmp.unlink(missing_ok=True)
    for path in removes:
        path.unlink()


def restamp(root: Path = ROOT) -> list[str]:
    """Carry the state to the epoch file's current epoch. Returns one line per change; none when current."""
    epoch = numbering.load_epoch(root)
    writes, removes, notes = plan_state(root, epoch)
    apply(writes, removes)
    return notes


def _epoch_text(root: Path, epoch: numbering.Epoch) -> str:
    """The epoch file for `epoch`, keeping every key the file already has (its explanations included)."""
    raw = json.loads((root / numbering.EPOCH_FILE).read_text(encoding="utf-8"))
    raw["numbering_epoch"] = epoch.label
    raw["roadmap"] = epoch.roadmap
    raw["previous_epochs"] = {str(label): list(table) for label, table in epoch.previous}
    raw["sections"] = [{"number": n, "slug": slug} for n, slug in enumerate(epoch.slugs, 1)]
    return json.dumps(raw, indent=2, ensure_ascii=False) + "\n"


def next_epoch(root: Path, roadmap: str) -> numbering.Epoch | None:
    """The epoch the course now describes, or None when it is the current one. Refuses what cannot be carried."""
    old = numbering.load_epoch(root)
    order = numbering.course_order(root)
    slugs = tuple(slug for slug, _, _ in order)
    if None in slugs:
        raise NumberingError("a section file in COURSE_SECTIONS has no id the numbering can read")
    if slugs == old.slugs and roadmap == old.roadmap:
        return None
    new = numbering.Epoch(label=len(slugs), roadmap=roadmap, slugs=slugs,
                          previous=old.previous + ((old.label, old.slugs),))
    problems = numbering.course_problems(new, numbering.roadmap_numbers(root, roadmap), order)
    if len(set(slugs)) != len(slugs):
        problems.append("the course lists a section id twice")
    if new.label == old.label:
        problems.append(f"the course still has {old.label} sections but numbers them differently; the epoch "
                        f"label is the section count, so this epoch cannot be told from the last one")
    problems += [f"section {slug!r} of epoch {old.label} is not in the course any more"
                 for slug in old.slugs if numbering.current_slug(slug, root) not in slugs]
    if problems:
        raise NumberingError("cannot advance: " + "; ".join(problems))
    return new


def advance(root: Path = ROOT, roadmap: str | None = None) -> list[str]:
    """After a renumber: write the next epoch from the course as it now is, and restamp the state to it.

    The new epoch keeps the old table in `previous_epochs`, which is what lets the state be carried.
    Planned and checked first, so a refusal changes nothing."""
    old = numbering.load_epoch(root)
    new = next_epoch(root, roadmap or old.roadmap)
    if new is None:
        return ["the epoch already matches the course; nothing to advance"]
    writes, removes, notes = plan_state(root, new)
    writes[root / numbering.EPOCH_FILE] = _epoch_text(root, new)
    apply(writes, removes)
    return [f"epoch {old.label} -> {new.label}, roadmap {new.roadmap}"] + notes


def _arguments(argv: list[str]) -> tuple[bool, str | None]:
    """(advance?, roadmap) from the command line. Anything else is a usage error."""
    advancing = argv[:1] == ["advance"]
    rest = argv[1:] if advancing else argv
    if rest == []:
        return advancing, None
    if advancing and len(rest) == 2 and rest[0] == "--roadmap":
        return True, rest[1]
    raise NumberingError("usage: restamp.py            |  restamp.py advance [--roadmap PATH]")


def main(argv: list[str]) -> int:
    try:
        advancing, roadmap = _arguments(argv)
        notes = advance(ROOT, roadmap) if advancing else restamp(ROOT)
    except NumberingError as e:
        print(f"restamp: refused; nothing was changed. {e}")
        return 1
    for note in notes or ["nothing to restamp: the state is stamped with the current epoch"]:
        print(f"  {note}")
    problems = numbering.check_epoch(ROOT)
    for problem in problems:
        print(f"  FAIL {problem}")
    print("numbering: " + ("still refused" if problems else "ok"))
    return 1 if problems else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
