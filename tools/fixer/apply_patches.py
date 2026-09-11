#!/usr/bin/env python3
"""Apply codex's anchor/replacement patches to a section file, or refuse to.

Every patch must name an anchor that appears exactly once in the current file.
A patch whose anchor is missing or ambiguous is rejected and its findings stay
open - silently applying it to the wrong place is the one outcome worth avoiding.
After patching, the file must still import cleanly or the whole batch is rolled back.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def resolve_slug(name: str) -> str:
    """Accept either the slug ('setup') or the curriculum tag ('S01')."""
    m = re.fullmatch(r"[Ss](\d{1,2})", name.strip())
    if not m:
        return name
    events = ROOT / ".fixer/events.json"
    if events.exists():
        ids = json.loads(events.read_text(encoding="utf-8"))["active_section_ids"]
        n = int(m.group(1))
        if 1 <= n <= len(ids):
            return ids[n - 1]
    return name


def section_file(slug: str) -> Path:
    index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
    for m in re.finditer(r"from '\./sections/([^']+)'", index):
        p = ROOT / f"src/lib/course/sections/{m.group(1)}.ts"
        if p.exists() and re.search(rf"\bid:\s*'{re.escape(slug)}'", p.read_text(encoding="utf-8")):
            return p
    raise SystemExit(f"no section file for slug {slug!r}")


def typechecks() -> tuple[bool, str]:
    probe = ROOT / ".fixer/_verify.mts"
    probe.parent.mkdir(parents=True, exist_ok=True)
    probe.write_text(
        "import { COURSE_SECTIONS } from '../src/lib/course/index'\n"
        "if (COURSE_SECTIONS.length !== 52) throw new Error('section count changed')\n"
        "process.stdout.write('ok')\n",
        encoding="utf-8",
    )
    r = subprocess.run(["npx", "tsx", str(probe.relative_to(ROOT))],
                       cwd=ROOT, capture_output=True, text=True)
    return r.returncode == 0, (r.stderr or r.stdout)[-1500:]


def main() -> int:
    result_path = Path(sys.argv[1])
    apply = "--apply" in sys.argv
    data = json.loads(result_path.read_text(encoding="utf-8"))
    slug = resolve_slug(data["section_id"])
    path = section_file(slug)
    original = path.read_text(encoding="utf-8")

    text = original
    applied, rejected = [], []
    for i, p in enumerate(data.get("patches", [])):
        anchor, repl = p["anchor"], p["replacement"]
        n = text.count(anchor)
        if n == 0:
            rejected.append({**{k: p[k] for k in ("finding_ids", "field_path")},
                             "reason": "anchor not found", "anchor_head": anchor[:120]})
            continue
        if n > 1:
            rejected.append({**{k: p[k] for k in ("finding_ids", "field_path")},
                             "reason": f"anchor matches {n} places", "anchor_head": anchor[:120]})
            continue
        if anchor == repl:
            rejected.append({**{k: p[k] for k in ("finding_ids", "field_path")},
                             "reason": "replacement identical to anchor"})
            continue
        text = text.replace(anchor, repl, 1)
        applied.append({"finding_ids": p["finding_ids"], "field_path": p["field_path"],
                        "delta_chars": len(repl) - len(anchor)})

    report = {
        "section": slug,
        "file": str(path.relative_to(ROOT)),
        "patches_offered": len(data.get("patches", [])),
        "applied": len(applied),
        "rejected": len(rejected),
        "rejections": rejected,
        "findings_closed": sorted({f for a in applied for f in a["finding_ids"]}),
        "findings_still_open": sorted({f for r in rejected for f in r.get("finding_ids", [])}),
        "unresolved_questions": data.get("unresolved_questions", []),
        "dry_run": not apply,
    }

    if apply and applied:
        path.write_text(text, encoding="utf-8")
        ok, err = typechecks()
        report["typecheck_ok"] = ok
        if not ok:
            path.write_text(original, encoding="utf-8")
            report["rolled_back"] = True
            report["typecheck_error"] = err
            print(json.dumps(report, indent=2, ensure_ascii=False))
            return 1

    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
