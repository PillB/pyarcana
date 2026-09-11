#!/usr/bin/env python3
"""Enforce D2: course material carries no Peruvian national identifier.

The S03 round showed why a standing decision needs a gate rather than a line in a
prompt. D2 was in the prompt; codex still left `DNI 12345678` in place, because
"drop the DNI field" reads as advice about new content, not as a sweep of what is
already written.

A DNI is eight digits. Any eight-digit literal sitting near DNI wording is treated
as one, whether or not the author considered it fictitious - that is the point of
D2: a made-up range can collide with an issued identifier, so the field goes.

Document-type labels ('DNI', 'CE', 'PAS' as category values) are fine and are not
flagged; only identifier-shaped values are.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "src/lib/course/sections"
OUT = ROOT / "course-state/synthetic_identifier_report.json"

# eight consecutive digits not part of a longer number
DNI_SHAPED = re.compile(r"(?<!\d)\d{8}(?!\d)")
# DNI/RUC wording within this many characters counts as identifier context
CONTEXT = 120
ID_WORD = re.compile(r"\b(DNI|RUC|documento\s+de\s+identidad|n[uú]mero\s+de\s+documento)\b", re.I)


def wired_files() -> list[Path]:
    index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
    return [SECTIONS / f"{m.group(1)}.ts"
            for m in re.finditer(r"from '\./sections/([^']+)'", index)]


def main() -> int:
    findings = []
    for path in wired_files():
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        for m in DNI_SHAPED.finditer(text):
            window = text[max(0, m.start() - CONTEXT): m.end() + CONTEXT]
            if not ID_WORD.search(window):
                continue
            line = text.count("\n", 0, m.start()) + 1
            findings.append({
                "file": str(path.relative_to(ROOT)),
                "line": line,
                "value": m.group(0),
                "excerpt": re.sub(r"\s+", " ", window)[:180],
            })

    report = {
        "ok": not findings,
        "decision": "D2 - synthetic records carry no DNI",
        "files_scanned": len(wired_files()),
        "violations": len(findings),
        "findings": findings,
    }
    OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({"ok": report["ok"], "violations": len(findings),
                      "files": sorted({f["file"].split("/")[-1] for f in findings}),
                      "report": str(OUT.relative_to(ROOT))}, indent=2, ensure_ascii=False))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
