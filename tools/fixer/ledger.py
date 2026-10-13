#!/usr/bin/env python3
"""Generate audit/fixer/LEDGER.md: every section, every step, derived not remembered.

A hand-kept checklist drifts from the repository within a day. Every box below is
computed from an artifact that already exists - a cycle file, a gate report, the
section source - so the ledger cannot claim a step is done when it is not.

  python3 tools/fixer/ledger.py            # rewrite the ledger
  python3 tools/fixer/ledger.py --check    # exit 1 if it is stale
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numbering  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "audit/fixer/LEDGER.md"

STEPS = [
    ("findings", "codex round applied, registry findings closed"),
    ("redaction", "grammar and redaction pass applied"),
    ("concepts", "load-bearing concepts have their own subtopic (D3)"),
    ("figures", "at least two figures carrying real teaching (D4)"),
    ("vocab", "no term used before it is defined"),
    ("ids", "no identifier-shaped synthetic value (D2)"),
    ("runtime", "every snippet executes under .venv-content"),
]


def load(path: Path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def main() -> int:
    epoch = numbering.load_epoch(ROOT)
    events = load(ROOT / ".fixer/events.json", {})
    # The event cache is gitignored and can be stale: re-extract when its course order is not the epoch's.
    if events.get("active_section_ids") != list(epoch.slugs):
        proc = subprocess.run(["npx", "tsx", "scripts/course_event_extractor.mts"],
                              cwd=ROOT, capture_output=True, text=True)
        (ROOT / ".fixer").mkdir(exist_ok=True)
        (ROOT / ".fixer/events.json").write_text(proc.stdout, encoding="utf-8")
        events = json.loads(proc.stdout)
        if events.get("active_section_ids") != list(epoch.slugs):
            raise SystemExit("the course's section order disagrees with the numbering epoch; "
                             "run tools/fixer/numbering.py to see where")

    registry = numbering.registry_findings(ROOT, epoch)
    first_use = load(ROOT / "course-state/first_use_all_report.json", {"issues": []})
    ids_rep = load(ROOT / "course-state/synthetic_identifier_report.json", {"findings": []})
    prose = load(ROOT / "course-state/prose_quality_report.json", {})
    runtime = load(ROOT / "course-state/python_runtime_audit_report.json", {})

    # per-section evidence
    figures, concepts = {}, {}
    for e in events.get("events", []):
        s = e["section_id"]
        if e["kind"] == "theory.figure":
            figures[s] = figures.get(s, 0) + 1
        if e["kind"] == "theory.heading":
            concepts.setdefault(s, []).append(e["text"])

    vocab_bad, ids_bad = set(), set()
    for i in first_use.get("issues", []):
        loc = (i.get("location") or "").split(".", 1)[0]
        if i["code"] in {"USE_BEFORE_DEFINITION", "DEFINITION_AFTER_REQUIREMENT",
                         "NO_VISIBLE_DEFINITION"}:
            vocab_bad.add(loc)
    section_slug = numbering.section_files(ROOT)     # read once: each lookup used to re-read every section file
    for f in ids_rep.get("findings", []):
        slug = section_slug.get(f.get("file", ""))
        if slug:
            ids_bad.add(slug)

    runtime_clean = runtime.get("ok") is True
    redaction_applied = numbering.redacted_slugs(ROOT, epoch)
    cycles = numbering.cycle_records(ROOT, epoch)

    rows, done_counts = [], {k: 0 for k, _ in STEPS}

    for number, slug in enumerate(epoch.slugs, 1):
        tag = numbering.tag_of(number)
        cycle = cycles.get(slug)
        total = len({f["finding_id"] for f in registry[slug] if f["finding_id"]})
        closed = len(cycle["findings_closed"]) if cycle else 0
        # 2026-10-03: was `(ROOT / f".fixer/{tag}r.result.json").exists()`. `.fixer/` is gitignored,
        # so this column read 8/52 in the worktree holding those artefacts and 0/52 in CI, and
        # `--check` could never pass there. A ledger whose number depends on untracked state is the
        # dead-measure shape wearing the campaign's own badge. The evidence is committed now.
        redacted = slug in redaction_applied
        p = prose.get(tag, {})

        state = {
            "findings": bool(cycle) and closed >= total and total > 0,
            "redaction": redacted and p.get("run_on_sentences", 99) <= 12,
            "concepts": False,   # judged per section; no automatic proxy yet
            "figures": figures.get(slug, 0) >= 2,
            "vocab": slug not in vocab_bad,
            "ids": slug not in ids_bad,
            "runtime": runtime_clean,
        }
        for k, v in state.items():
            done_counts[k] += bool(v)
        rows.append((tag, slug, total, closed, figures.get(slug, 0), p, state))

    def box(v):
        return "[x]" if v else "[ ]"

    L = ["# Fixer ledger", "",
         "Every box is computed from an artifact, never hand-ticked. Regenerate with",
         "`python3 tools/fixer/ledger.py`; `--check` fails if it is stale.", "",
         "| step | meaning | done |", "|---|---|---:|"]
    for k, meaning in STEPS:
        L.append(f"| `{k}` | {meaning} | {done_counts[k]}/{epoch.count} |")
    L += ["", "## Sections", "",
          "| sec | findings | figs | run-ons | " + " | ".join(k for k, _ in STEPS) + " |",
          "|---|---|---:|---:|" + "---|" * len(STEPS)]
    for tag, slug, total, closed, figs, p, state in rows:
        L.append(
            f"| **{tag}** {slug} | {closed}/{total} | {figs} | "
            f"{p.get('run_on_sentences', '-')} | "
            + " | ".join(box(state[k]) for k, _ in STEPS) + " |")

    L += ["", "## The round, per section", "",
          "Run in this order. A step that cannot be finished is recorded in",
          "`audit/fixer/OPEN_QUESTIONS.md` rather than skipped silently.", ""]
    for n, (k, meaning) in enumerate(STEPS, 1):
        L.append(f"{n}. **{k}** — {meaning}")
    L += ["",
          "Commands: `tools/fixer/run_round.sh SXX --apply`, then",
          "`tools/fixer/build_redaction_prompt.py SXX` for the prose pass.",
          "", "`concepts` has no automatic proxy: a load-bearing concept needing its own",
          "subtopic (D3) is a judgement, so that column is ticked by a human reading the",
          "section, not by this script."]

    # Hand-maintained observations live in their own file so the computed table above
    # stays machine-true, but they are part of the ledger every round reads.
    notes = ROOT / "audit/fixer/LEDGER_NOTES.md"
    if notes.exists():
        L += ["", "---", "", notes.read_text(encoding="utf-8").rstrip()]
    text = "\n".join(L) + "\n"
    if "--check" in sys.argv:
        current = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
        if current != text:
            print("LEDGER.md is stale; run python3 tools/fixer/ledger.py")
            return 1
        print("ledger current")
        return 0
    OUT.write_text(text, encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)}")
    for k, _ in STEPS:
        print(f"  {k:10s} {done_counts[k]:2d}/{epoch.count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
