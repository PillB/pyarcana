#!/usr/bin/env python3
"""Assemble the codex prompt for one section's fixer round.

Codex writes the Spanish content. It never edits the repo: it reads the section
file so its anchors are byte-exact, and returns anchor/replacement pairs that
apply_patches.py validates and applies.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REGISTRY = ROOT / "audit/consolidated/registry.json"
EVENTS = ROOT / ".fixer/events.json"
FIRST_USE = ROOT / "course-state/first_use_all_report.json"
CONTRACTS = [
    ROOT / "ReviewerFixer/Solarized Website Content Comprehension Auditor & Rewriter.md",
    ROOT / "ReviewerFixer/PYARCANA — MODO REVISOR ESCÉPTICO Y ANTI-COMPLACENCIA.md",
    ROOT / "ReviewerFixer/_GRAMMAR_SUBPLAN.md",
]


def section_file(slug: str) -> Path:
    index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
    for m in re.finditer(r"from '\./sections/([^']+)'", index):
        p = ROOT / f"src/lib/course/sections/{m.group(1)}.ts"
        if p.exists() and re.search(rf"\bid:\s*'{re.escape(slug)}'", p.read_text(encoding="utf-8")):
            return p
    raise SystemExit(f"no section file for slug {slug!r}")


def main() -> None:
    tag = sys.argv[1]                      # e.g. S01
    num = int(tag.lstrip("Ss"))
    payload = json.loads(EVENTS.read_text(encoding="utf-8"))
    slug = payload["active_section_ids"][num - 1]
    path = section_file(slug)

    findings = [f for f in json.loads(REGISTRY.read_text(encoding="utf-8"))["findings"]
                if f["section"] == tag]
    order = {"P0": 0, "P1": 1, "P2": 2, "UNSPEC": 3}
    findings.sort(key=lambda f: order.get(f["severity"], 9))

    # Vocabulary the learner has actually met before this section, and the gaps here.
    seen_before = sorted({
        t for e in payload["events"]
        if e["learner_visible"] and payload["active_section_ids"].index(e["section_id"]) < num - 1
        for t in e["defines"]
    })
    gaps = [i for i in json.loads(FIRST_USE.read_text(encoding="utf-8"))["issues"]
            if (i.get("location") or "").split(".", 1)[0] == slug]

    def block(title: str, body: str) -> str:
        return f"\n\n===== {title} =====\n{body}"

    prompt = [
        f"""You are writing course content for PyArcana, a 52-section Python curriculum in
Peruvian Spanish. You are fixing section {tag} ("{slug}").

Read this file for the exact current text: {path.relative_to(ROOT)}
Do NOT modify it, or any other file. You have read-only access on purpose.

Return JSON matching the provided schema. For each fix, return an `anchor`: a
substring copied BYTE-EXACTLY from that file, including its TypeScript escaping
(\\' for apostrophes, \\n inside string literals). The anchor must appear EXACTLY
ONCE in the file, so include enough surrounding text to be unique. `replacement`
is the new text in the same escaping. I apply the patches; if an anchor is not
unique or not found, that patch is rejected and the finding stays open.

Rules that are not negotiable:
- Write Spanish first. Keep literal identifiers, API fields and code in code formatting.
- Never introduce a term the learner has not met without defining it in place, at
  first use, in the same sentence or the one after.
- Preserve every fact that is correct today. You are repairing defects, not rewriting
  the section's voice or deleting material that works.
- Do not add claims the section cannot support (no invented benchmarks, versions or
  guarantees).
- If a fix would need a decision you cannot make from the evidence, do NOT guess:
  leave that finding unpatched and raise it in `unresolved_questions`.""",

        block(f"FINDINGS TO FIX ({len(findings)})", json.dumps([
            {k: f.get(k) for k in
             ("finding_id", "severity", "category", "title", "location",
              "evidence", "impact", "fix", "attack", "defense")}
            for f in findings], ensure_ascii=False, indent=1)),

        block("VOCABULARY GAPS THE GATE FOUND IN THIS SECTION", json.dumps(gaps, ensure_ascii=False, indent=1)),

        block("TERMS ALREADY DEFINED IN EARLIER SECTIONS (safe to use)",
              ", ".join(seen_before) or "(none - this is the first section)"),

        block("WRITING CONTRACTS (binding)",
              "\n\n".join(f"--- {c.name} ---\n{c.read_text(encoding='utf-8')}"
                          for c in CONTRACTS if c.exists())),
    ]
    sys.stdout.write("".join(prompt))


if __name__ == "__main__":
    main()
