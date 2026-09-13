#!/usr/bin/env python3
"""Prompt for a redaction pass: fix the writing without undoing the facts.

The repair rounds improved accuracy and, in places, damaged the prose - trading a
sentence that carried the teaching point for an accurate but nominalised one. This
pass is the other direction, and it is explicitly forbidden from reverting the facts.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def section_file(slug: str) -> Path:
    index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
    for m in re.finditer(r"from '\./sections/([^']+)'", index):
        p = ROOT / f"src/lib/course/sections/{m.group(1)}.ts"
        if p.exists() and re.search(rf"""\bid:\s*['"]{re.escape(slug)}['"]""", p.read_text(encoding="utf-8")):
            return p
    raise SystemExit(f"no section file for slug {slug!r}")


def main() -> None:
    tag = sys.argv[1]
    num = int(tag.lstrip("Ss"))
    payload = json.loads((ROOT / ".fixer/events.json").read_text(encoding="utf-8"))
    slug = payload["active_section_ids"][num - 1]
    path = section_file(slug)

    metrics = json.loads((ROOT / "course-state/prose_quality_report.json").read_text(encoding="utf-8"))
    m = metrics.get(tag, {})
    rules = (ROOT / "audit/fixer/writing_rules.md").read_text(encoding="utf-8")

    diff = subprocess.run(
        ["git", "diff", "535bd4d7..HEAD", "--", str(path.relative_to(ROOT))],
        cwd=ROOT, capture_output=True, text=True).stdout[:60000]

    print(f"""You are improving the Spanish prose of PyArcana section {tag} ("{slug}").

Read the current text here: {path.relative_to(ROOT)}
Do NOT modify it or any other file; you have read-only access. Return JSON matching
the schema: byte-exact `anchor` from that file appearing EXACTLY ONCE, plus the
`replacement`.

THIS IS A REDACTION PASS, NOT A CONTENT PASS.

An earlier round fixed this section's facts and, in places, made the writing worse:
it traded sentences that carried the teaching point for accurate but bureaucratic
ones, and added parenthetical and em-dash glosses until sentences ran long.

The clearest example, in S01's Mars Climate Orbiter paragraph. This sentence was
removed:

  "Nadie mintió y nadie se equivocó al calcular; simplemente, cada lado dio por
   supuesto algo que el otro no compartía."

That sentence *was* the lesson: the failure came from an unshared assumption, not
from incompetence. What replaced it reads like an incident report: "La investigación
de NASA también señaló fallas contribuyentes de verificación, comunicación e
ingeniería de sistemas". Accurate, and it teaches nothing.

WHAT YOU MUST NOT DO:
- Do not revert any factual correction. The units failure really was an English-unit
  file against a metric contract; a virtual environment really is tied to its
  interpreter; declared outputs must keep matching what the code prints.
- Do not remove a definition of a term at its first use. Those are required.
- Do not change code, output, identifiers, headings or exercise ids.
- Do not shorten by deleting teaching. Cut bureaucracy, not substance.

WHAT TO FIX, in order:
1. Restore the rhetorical beat where a repair flattened it. Short declarative
   sentences that name the human failure beat nominalised summaries.
2. Break long sentences. Where a gloss made a sentence run past ~32 words, split it,
   or move the gloss into its own short sentence.
3. Replace nominalisations with verbs: "la validación produce el rechazo" becomes
   "el validador rechaza".
4. Where several em-dash or parenthetical glosses stack in one sentence, keep the
   one the reader needs there and relocate the rest.

MEASURED NOW FOR THIS SECTION (targets in the rules below):
{json.dumps(m, ensure_ascii=False, indent=1)}

===== DISTILLED WRITING RULES (binding) =====
{rules}

===== WHAT THE REPAIR ROUND CHANGED (diff vs the pre-campaign commit) =====
{diff}
""")


if __name__ == "__main__":
    main()
