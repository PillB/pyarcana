#!/usr/bin/env python3
"""Print "<slug> <file>" for a curriculum tag like S04. Shell-friendly."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
tag = sys.argv[1]
slug = json.loads((ROOT / ".fixer/events.json").read_text(encoding="utf-8"))["active_section_ids"][int(tag[1:]) - 1]
index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
for m in re.finditer(r"from '\./sections/([^']+)'", index):
    f = ROOT / f"src/lib/course/sections/{m.group(1)}.ts"
    if f.exists() and re.search(r"\bid:\s*['\"]" + re.escape(slug) + r"['\"]", f.read_text(encoding="utf-8")):
        print(slug, f.relative_to(ROOT))
        break
else:
    raise SystemExit(f"no file for {tag}")
