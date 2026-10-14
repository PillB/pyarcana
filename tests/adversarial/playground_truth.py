"""The playground's Python as the TypeScript modules define it, read by scripts/playground_extractor.mts.

Shared by the playground tests. It needs node_modules (`npx tsx`), so only the adversarial suite
calls it, and that suite installs them. The content gate has none and reads the demos with
scripts/playground_demos_dump.mjs; test_playground_demo_audit.py holds the two equal.
"""
from __future__ import annotations

import json
import subprocess
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


@lru_cache(maxsize=1)
def playground() -> dict:
    """{"prelude": str, "requiredPackages": {import name: package}, "unvendoredStdlib": {import name: package},
    "detected": {demo id: [package, ...] the playground loads for it},
    "sections": [id, ...] in COURSE_SECTIONS order, "demos": {id: demo}}."""
    proc = subprocess.run(
        ["npx", "tsx", "scripts/playground_extractor.mts"],
        cwd=ROOT, capture_output=True, text=True,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"playground_extractor.mts exited {proc.returncode}: {proc.stderr[-1500:]}")
    return json.loads(proc.stdout)
