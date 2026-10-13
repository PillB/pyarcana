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
    reg = json.loads((ROOT / "audit/consolidated/registry.json").read_text(encoding="utf-8"))
    findings = reg["findings"]
    per_section: dict[str, list] = {}
    for f in findings:
        per_section.setdefault(f["section"], []).append(f)

    # Records in course order, each read through its slug; a record that cannot be placed refuses the read.
    records = numbering.cycle_records(ROOT, epoch)
    done = [records[slug] for slug in epoch.slugs if slug in records]
    total_closed = sum(len(d["findings_closed"]) for d in done)
    questions = sum(len(d["unresolved_questions"]) for d in done)

    remaining = sum(len(v) for k, v in per_section.items()
                    if k not in {d["section"] for d in done})

    print(f"sections fixed : {len(done)}/{epoch.count}")
    print(f"findings closed: {total_closed}")
    print(f"findings left  : ~{remaining} across {epoch.count - len(done)} untouched sections")
    print(f"questions open : {questions}")
    print()
    print(f"{'sec':5s} {'closed':>7s} {'open':>5s} {'rej':>4s} {'Qs':>3s}")
    for d in done:
        print(f"{d['section']:5s} {len(d['findings_closed']):7d} "
              f"{len(d['findings_open']):5d} {d['patches_rejected']:4d} "
              f"{len(d['unresolved_questions']):3d}")

    fu = ROOT / "course-state/first_use_all_report.json"
    if fu.exists():
        r = json.loads(fu.read_text(encoding="utf-8"))
        print(f"\nvocabulary gaps course-wide: {sum(r['issue_counts'].values())} "
              f"({r['issue_counts']})")

    # where the remaining work is heaviest
    left = sorted(((len(v), k) for k, v in per_section.items()
                   if k not in {d["section"] for d in done}), reverse=True)[:8]
    if left:
        print("\nheaviest sections still untouched:")
        print("  " + ", ".join(f"{k} ({n})" for n, k in left))


if __name__ == "__main__":
    main()
