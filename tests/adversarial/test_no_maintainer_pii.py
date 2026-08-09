#!/usr/bin/env python3
"""Red test: no maintainer PII (email addresses) in tracked repository files.

Guards against the LEAK-002 regression (maintainer Gmail in docs/FIREBASE.md
and course-state/firebase_mcp_setup.json).

Run: python3 tests/adversarial/test_no_maintainer_pii.py
Exits 0 on pass, non-zero on fail.
"""
from __future__ import annotations
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent

PII_PATTERNS = [
    re.compile(r'pillescasdies@gmail\.com', re.IGNORECASE),
    re.compile(r'pabloillescas@users\.noreply\.github\.com', re.IGNORECASE),
]

SKIP_DIRS = {'node_modules', '.next', 'out', '.git', 'dist', 'build', 'exemplars_private'}
SKIP_FILES = {'.DS_Store'}
SKIP_PATH_PARTS = {'capstone_validation', 'validation'}


def scan() -> list[tuple[str, int, str]]:
    findings = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if fn in SKIP_FILES:
                continue
            fp = Path(dirpath) / fn
            rel = str(fp.relative_to(ROOT))
            if any(part in SKIP_PATH_PARTS for part in Path(rel).parts):
                continue
            try:
                if fp.stat().st_size > 500_000:
                    continue
                data = fp.read_bytes()
            except Exception:
                continue
            if b'\x00' in data[:1024]:
                continue
            try:
                text = data.decode('utf-8', errors='replace')
            except Exception:
                continue
            for pat in PII_PATTERNS:
                for m in pat.finditer(text):
                    line_no = text[:m.start()].count('\n') + 1
                    line = text.splitlines()[line_no - 1] if line_no <= len(text.splitlines()) else ''
                    if '(redacted' in line.lower():
                        continue
                    findings.append((str(fp.relative_to(ROOT)), line_no, m.group(0)))
    return findings


def main():
    findings = scan()
    if findings:
        print(f"FAIL: test_no_maintainer_pii — {len(findings)} PII occurrence(s) found:")
        for f, ln, match in findings[:10]:
            print(f"  {f}:{ln}: {match}")
        return 1
    print(f"PASS: test_no_maintainer_pii — 0 PII occurrences in tracked files")
    return 0


if __name__ == '__main__':
    sys.exit(main())
