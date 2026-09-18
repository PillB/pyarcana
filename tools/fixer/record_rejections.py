#!/usr/bin/env python3
"""Write every rejected patch down, and tell the runner how many there were.

apply_patches.py rejects a patch whose anchor is missing, stale or ambiguous - on
purpose, since applying a rewrite to the wrong paragraph is worse than skipping it -
and exits 0 so the rest of the batch can land. The Codex review of PR #61 caught what
followed: runners printed the count and announced success, so an unresolved concept
vanished with nothing recorded. S04's first concept round did exactly that.

    record_rejections.py SXX .fixer/SXXk.apply.json concepts

Appends to audit/fixer/OPEN_QUESTIONS.md and prints the rejection count on stdout, so a
runner can say "passed with N unresolved" instead of "passed every gate".
"""
from __future__ import annotations

import hashlib
import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def main() -> int:
    tag, apply_path, stage = sys.argv[1], Path(sys.argv[2]), sys.argv[3]
    report = json.loads(apply_path.read_text(encoding="utf-8"))
    # A patch that was applied and then reverted by the typecheck rollback never reached the
    # learner either, so it belongs here exactly as much as one the applier refused outright.
    # Reading only `rejections` is how S39's 32 rolled-back patches vanished without a trace.
    rejections = (report.get("rejections") or []) + (report.get("rolled_back_patches") or [])
    if not rejections:
        print(0)
        return 0

    # Dedup on the content of this result, not on the tag+stage header: a re-run whose
    # rejection set genuinely differs must be recorded, and an earlier entry must not swallow
    # it. S39's rerun lost its 12 real rejections to a stale one-item entry this way.
    digest = hashlib.sha256(
        json.dumps(
            [[r.get("finding_ids"), r.get("field_path"), r.get("reason")] for r in rejections],
            sort_keys=True, ensure_ascii=False,
        ).encode("utf-8")
    ).hexdigest()[:12]

    oq_path = ROOT / "audit/fixer/OPEN_QUESTIONS.md"
    if f"<!-- {tag} {stage} {digest} -->" in oq_path.read_text(encoding="utf-8"):
        print(len(rejections))
        return 0

    rolled = len(report.get("rolled_back_patches") or [])
    why = (
        "Codex proposed these and the applier refused them, so the defects they targeted are"
        if not rolled else
        f"Codex proposed these; {rolled} applied cleanly but the whole batch was rolled back "
        "when the file stopped typechecking, so the defects they targeted are"
    )
    lines = [
        "",
        f"## {tag} {stage} — {len(rejections)} patch(es) not applied",
        f"*Recorded {date.today().isoformat()} by `record_rejections.py` from `{apply_path.name}`.*",
        f"<!-- {tag} {stage} {digest} -->",
        "",
        why,
        "still open. Re-run the stage for this section, or fix by hand.",
        "",
    ]
    if report.get("typecheck_error"):
        lines += [f"Typecheck error: `{report['typecheck_error'].strip().splitlines()[0][:160]}`", ""]
    for r in rejections:
        ids = ", ".join(r.get("finding_ids") or []) or "(no finding id)"
        where = r.get("field_path") or "?"
        lines.append(f"- **{ids}** at `{where}` — {r.get('reason', 'rejected')}")
        if r.get("anchor_head"):
            lines.append(f"  - anchor began: `{r['anchor_head'][:90]}`")
    with (ROOT / "audit/fixer/OPEN_QUESTIONS.md").open("a", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")
    print(len(rejections))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
