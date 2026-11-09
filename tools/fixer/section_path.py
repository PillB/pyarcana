#!/usr/bin/env python3
"""Print "<slug> <file>" for a curriculum tag like S04. Shell-friendly.

The slug comes from the numbering epoch and the file from the course's own imports, so a tag the epoch
does not number is refused rather than indexed into a list.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numbering  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
tag = sys.argv[1]
try:
    slug = numbering.slug_for_tag(tag, numbering.load_epoch(ROOT))
    rel = numbering.section_rel(slug, ROOT)
except numbering.NumberingError as e:
    raise SystemExit(f"no file for {tag}: {e}") from e
print(slug, rel)
