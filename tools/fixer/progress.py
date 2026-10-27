#!/usr/bin/env python3
"""Campaign progress: what is fixed, what is left, and what is waiting on a human."""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numbering  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]


def main() -> None:
    epoch = numbering.load_epoch(ROOT)
    # Findings by slug, through the registry's epoch stamp; tags below are only the display of those slugs.
    by_slug = numbering.registry_findings(ROOT, epoch)
    per_section = {numbering.tag_for_slug(slug, epoch): found for slug, found in by_slug.items()}

    # Records in course order, each read through its slug; a record that cannot be placed refuses the read.
    records = numbering.cycle_records(ROOT, epoch)
    done = [records[slug] for slug in epoch.slugs if slug in records]
    # Through numbering, not the record's own closed list: a closure the owner reopened does not count (O25).
    total_closed = sum(len(numbering.closed_findings(d)) for d in done)
    total_reopened = sum(len(numbering.reopened_findings(d)) for d in done)
    questions = sum(len(d["unresolved_questions"]) for d in done)

    remaining = sum(len(found) for slug, found in by_slug.items() if slug not in records)

    print(f"sections fixed : {len(done)}/{epoch.count}")
    print(f"findings closed: {total_closed}")
    if total_reopened:
        print(f"findings reopened: {total_reopened} (closed once; the owner ruled they do not count, so they are open)")
    print(f"findings left  : ~{remaining} across {epoch.count - len(done)} untouched sections")
    print(f"questions open : {questions}")
    _print_table(done)

    fu = ROOT / "course-state/first_use_all_report.json"
    if fu.exists():
        r = json.loads(fu.read_text(encoding="utf-8"))
        print(f"\nvocabulary gaps course-wide: {sum(r['issue_counts'].values())} "
              f"({r['issue_counts']})")

    _print_heaviest(per_section, {d["section"] for d in done})


def _print_table(done: list[dict]) -> None:
    print()
    print(f"{'sec':5s} {'closed':>7s} {'open':>5s} {'rej':>4s} {'Qs':>3s}")
    for d in done:
        print(f"{d['section']:5s} {len(numbering.closed_findings(d)):7d} "
              f"{len(numbering.open_findings(d)):5d} {d['patches_rejected']:4d} "
              f"{len(d['unresolved_questions']):3d}")


def _print_heaviest(per_section: dict[str, list], done_tags: set[str]) -> None:
    """Where the remaining work is heaviest: the untouched sections with the most findings."""
    left = sorted(((len(v), k) for k, v in per_section.items() if k not in done_tags), reverse=True)[:8]
    if left:
        print("\nheaviest sections still untouched:")
        print("  " + ", ".join(f"{k} ({n})" for n, k in left))


if __name__ == "__main__":
    main()
