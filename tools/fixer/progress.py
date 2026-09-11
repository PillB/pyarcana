#!/usr/bin/env python3
"""Campaign progress: what is fixed, what is left, and what is waiting on a human."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CYCLES = ROOT / "audit/fixer/cycles"


def main() -> None:
    reg = json.loads((ROOT / "audit/consolidated/registry.json").read_text(encoding="utf-8"))
    findings = reg["findings"]
    per_section: dict[str, list] = {}
    for f in findings:
        per_section.setdefault(f["section"], []).append(f)

    done, questions, total_closed = [], 0, 0
    for i in range(1, 53):
        tag = f"S{i:02d}"
        c = CYCLES / f"{tag}.json"
        if not c.exists():
            continue
        d = json.loads(c.read_text(encoding="utf-8"))
        done.append(d)
        total_closed += len(d["findings_closed"])
        questions += len(d["unresolved_questions"])

    remaining = sum(len(v) for k, v in per_section.items()
                    if k not in {d["section"] for d in done})

    print(f"sections fixed : {len(done)}/52")
    print(f"findings closed: {total_closed}")
    print(f"findings left  : ~{remaining} across {52 - len(done)} untouched sections")
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
