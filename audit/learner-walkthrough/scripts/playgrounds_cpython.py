#!/usr/bin/env python3
"""Run every Theory playground ("Pruébalo tú mismo", InteractivePlaygroundDemo in
src/components/course/SectionView.tsx) under CPython and compare stdout with its expectedOutput,
exactly as CodePlayground.tsx does (strip, string equality).

scripts/python_content_runtime_audit.py covers src/lib/course/sections/ only, so these 52 snippets,
the only code a learner can run in the browser, are outside the content audit. Running them under
CPython separates "the snippet is wrong" from "the browser runtime (Pyodide 0.26.2) is wrong";
the browser verdicts come from data/walk/SXX.json.

    .venv-content/bin/python audit/learner-walkthrough/scripts/playgrounds_cpython.py > data/playgrounds-cpython.json
"""
import json
import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
src = (REPO / 'src/components/course/SectionView.tsx').read_text(encoding='utf-8')
start = src.index('function InteractivePlaygroundDemo')
block = src[start:src.index('const demo = demos[sectionId]', start)]
entries = re.split(r"\n    '?([a-z0-9-]+)'?: \{\n", block)[1:]


def js_template(s: str) -> str:
    # The demos are JS template literals: \\ → \, \` → `, \$ → $ (no ${} interpolation is used).
    return s.replace('\\`', '`').replace('\\$', '$').replace('\\\\', '\\')


out = {}
for key, body in zip(entries[0::2], entries[1::2]):
    code = re.search(r"code: `(.*?)(?<!\\)`,", body, re.S)
    exp = re.search(r"expectedOutput: `(.*?)(?<!\\)`,", body, re.S)
    title = re.search(r"title: '([^']*)'", body)
    if not code:
        continue
    py = js_template(code.group(1))
    try:
        r = subprocess.run([sys.executable, '-c', py], capture_output=True, text=True, timeout=60, cwd='/tmp')
        stdout, err, rc = r.stdout, r.stderr.strip().splitlines()[-1:] , r.returncode
    except subprocess.TimeoutExpired:
        stdout, err, rc = '', ['timeout'], -1
    expected = js_template(exp.group(1)) if exp else None
    out[key] = {
        'title': title.group(1) if title else None,
        'returncode': rc,
        'error': err[0] if rc else None,
        'has_expected': expected is not None,
        'matches_expected': (stdout.strip() == expected.strip()) if expected is not None else None,
    }
json.dump(out, sys.stdout, ensure_ascii=False, indent=1)
