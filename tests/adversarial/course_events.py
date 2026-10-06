"""The course as it is being committed, extracted fresh, for the tests that read it.

`.fixer/events.json` is a cache the fixer gate writes. It is gitignored, so on a fresh
checkout - CI - it does not exist, and a test that reads it either skips forever or, locally,
checks whatever the last gate run left behind. Four tests did exactly that, and never ran in
CI. Extracting here means a test checks the sections in this tree, the way
`concept-definition-detector.test.mjs` already does.

An extraction that cannot run is an error, never a skip: a test that could not look must not
read as one that looked and found nothing.
"""
from __future__ import annotations

import functools
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


@functools.cache
def _extractor_output() -> str:
    proc = subprocess.run(
        ["npx", "tsx", "scripts/course_event_extractor.mts"],
        cwd=ROOT, capture_output=True, text=True, timeout=300,
    )
    if proc.returncode != 0:
        raise RuntimeError(
            f"course_event_extractor.mts exited {proc.returncode}: {proc.stderr[-800:]}"
        )
    return proc.stdout


def fresh_events() -> dict:
    """The extractor's payload for this tree. Extracted once per process, parsed per call,
    so a test that mutates what it gets cannot change what the next test sees."""
    return json.loads(_extractor_output())
