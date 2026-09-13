#!/usr/bin/env python3
"""Feed a round's unresolved self-critiques back to codex.

Asking for a critique and then ignoring it is worse than not asking: it produces a
record that looks like review and changed nothing. This turns every
`addressed_in_this_replacement: false` into the next round's work.

Exits 2 when there is nothing unresolved, so a caller can skip the pass.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def section_file(slug: str) -> Path:
    index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
    for m in re.finditer(r"from '\./sections/([^']+)'", index):
        p = ROOT / f"src/lib/course/sections/{m.group(1)}.ts"
        if p.exists() and re.search(rf"""\bid:\s*['"]{re.escape(slug)}['"]""",
                                    p.read_text(encoding="utf-8")):
            return p
    raise SystemExit(f"no section file for slug {slug!r}")


def main() -> int:
    tag = sys.argv[1]
    # Critique the latest text, not the first draft: a follow-up supersedes the round
    # that produced it. The original result stays on disk for the cycle ledger.
    candidates = [ROOT / f".fixer/{tag}c2.result.json",
                  ROOT / f".fixer/{tag}c1.result.json",
                  ROOT / f".fixer/{tag}.result.json"]
    result = next((c for c in candidates if c.exists()), None)
    if result is None:
        print(f"{tag}: no result to critique", file=sys.stderr)
        return 2
    data = json.loads(result.read_text(encoding="utf-8"))

    open_items = []
    for p in data.get("patches", []):
        c = p.get("self_critique") or {}
        if c.get("addressed_in_this_replacement") is False or (c.get("residual_concern") or "").strip():
            open_items.append({
                "field_path": p.get("field_path"),
                "finding_ids": p.get("finding_ids"),
                "text_now": p.get("replacement", "")[:1200],
                "what_could_confuse": c.get("what_could_confuse", ""),
                "what_is_missing": c.get("what_is_missing", ""),
                "residual_concern": c.get("residual_concern", ""),
            })

    if not open_items:
        print(f"{tag}: no unresolved critiques", file=sys.stderr)
        return 2

    num = int(tag.lstrip("Ss").rstrip("rbc") or 0)
    payload = json.loads((ROOT / ".fixer/events.json").read_text(encoding="utf-8"))
    slug = payload["active_section_ids"][num - 1]
    path = section_file(slug)
    rules = (ROOT / "audit/fixer/writing_rules.md").read_text(encoding="utf-8")

    print(f"""You wrote these passages for PyArcana section {tag} ("{slug}") and, reviewing your
own work, said each still has something wrong. Fix what you named.

Read the current text here: {path.relative_to(ROOT)}
Do NOT modify it or any other file. Return JSON matching the schema: a byte-exact
`anchor` from that file appearing EXACTLY ONCE, and the improved `replacement`.

These are your own words about your own passages, not someone else's complaints:

{json.dumps(open_items, ensure_ascii=False, indent=1)}

For each one:

- Resolve the confusion and supply what you said was missing. If that needs another
  sentence, write it; length is not the constraint, a learner failing is.
- Do not reopen anything that was already right. Repair the defect, not the paragraph.
- Do not undo a definition, a factual correction, or a code/output pairing.
- Critique the new text again before returning it, and answer `self_critique` about
  THIS version. If a concern genuinely cannot be fixed here - it needs a decision you
  do not have - set `addressed_in_this_replacement` false, say why in
  `residual_concern`, and raise it in `unresolved_questions` so a human sees it.
  Do not let it circle a third time silently.

===== DISTILLED WRITING RULES (binding) =====
{rules}
""")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
