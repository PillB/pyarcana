#!/usr/bin/env python3
"""Repair broken filename/code-span references caused by redaction glosses.
Removes gloss parentheticals inside filenames and backtick code spans.
Idempotent. Stdlib only."""
from __future__ import annotations
import re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
PKG = ROOT / "course-state" / "capstones"
GLOSS = r'\s*\(esto es,[^)]*?\)'
def repair_file(path):
    try: txt=path.read_text(encoding="utf-8")
    except: return 0
    original=txt; repairs=0
    # 1. gloss immediately before a file extension
    txt,n=re.subn(r'([A-Za-z0-9_\-/]+)'+GLOSS+r'(\.(?:py|md|ts|tsx|json|js|jsonl|csv|txt|mjs)\b)',r'\1\2',txt); repairs+=n; txt=txt
    # 2. glosses inside backtick code spans
    def clean(m):
        nonlocal repairs
        inner=m.group(1); new,c=re.subn(GLOSS,'',inner); repairs+=c; return '`'+new+'`'
    txt=re.sub(r'`([^`]*)`',clean,txt)
    # 3. path-like tokens ending in .ext
    txt,n=re.subn(r'([\w/\-]+)'+GLOSS+r'(\.(?:py|md|ts|tsx|json|js|jsonl|csv|txt)\b)',r'\1\2',txt); repairs+=n; txt=txt
    if txt!=original: path.write_text(txt,encoding="utf-8")
    return repairs
def main():
    targets=[]
    for d in sorted(PKG.iterdir()):
        if not d.is_dir() or not d.name.startswith("CP-"): continue
        for p in d.rglob("*.md"): targets.append(p)
    total=0; pf={}
    for t in targets:
        n=repair_file(t)
        if n: pf[str(t.relative_to(ROOT))]=n; total+=n
    print(f"Repair pass: {total} broken filename/code-span refs fixed across {len(pf)} files.")
    return 0
if __name__=="__main__": sys.exit(main())
