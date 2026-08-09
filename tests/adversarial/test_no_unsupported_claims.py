#!/usr/bin/env python3
"""Red test: no unsupported employment/mastery claims in learner-facing code.

Guards against the PdfReport unsupported claims (audit items 25-27):
- "Ideal para mostrar a empleadores" (employment promise)
- "dominio de Python" (mastery language in a progress certificate)
- Hard-coded "70h+" and "11 Proyectos" (incorrect stats)

Run: python3 tests/adversarial/test_no_unsupported_claims.py
Exits 0 on pass, non-zero on fail.
"""
from __future__ import annotations
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SKIP_DIRS = {'node_modules', '.next', 'out', '.git', 'dist', 'build', 'exemplars_private', 'capstone_validation'}

# Forbidden phrases in learner-facing source (not in audit/validation docs)
FORBIDDEN_PHRASES = [
    "Ideal para mostrar a empleadores",
    "demostrando dominio de Python",
    "70h+ Contenido",
    '"stat-value">11<',  # hard-coded "11 Proyectos"
]


def scan() -> list[tuple[str, int, str]]:
    findings = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if fn.endswith(('.ts', '.tsx', '.md')):
                fp = Path(dirpath) / fn
                rel = str(fp.relative_to(ROOT))
                # skip audit/validation docs (they document the findings)
                if 'capstone_validation' in rel or 'industry_alignment' in rel:
                    continue
                try:
                    text = fp.read_text(encoding='utf-8', errors='replace')
                except Exception:
                    continue
                for phrase in FORBIDDEN_PHRASES:
                    if phrase in text:
                        line_no = text[:text.index(phrase)].count('\n') + 1
                        findings.append((rel, line_no, phrase))
    return findings


def main():
    findings = scan()
    if findings:
        print(f"FAIL: test_no_unsupported_claims — {len(findings)} unsupported claim(s) found:")
        for f, ln, phrase in findings[:10]:
            print(f"  {f}:{ln}: {phrase!r}")
        return 1
    print(f"PASS: test_no_unsupported_claims — 0 unsupported employment/mastery claims")
    return 0


if __name__ == '__main__':
    sys.exit(main())
