#!/usr/bin/env python3
"""Validate preamble/retrospective coverage across course sections."""
from pathlib import Path
import re, json, sys

root = Path('/Users/pabloillescas/Projects/PyArcana')
index = (root/'src/lib/course/index.ts').read_text()
files = re.findall(r"from '\./sections/(s\d{2}-[^']+)'", index)
rows = []
for f in files:
    nn = re.match(r's(\d{2})', f).group(1)
    t = (root/f'src/lib/course/sections/{f}.ts').read_text(encoding='utf-8', errors='replace')
    # rough unit counts
    ido = len(re.findall(r'demoId:\s*[\'"]', t)) or len(re.findall(r'description:\s*[\'"]', t.split('iDo:')[1].split('weDo:')[0] if 'iDo:' in t and 'weDo:' in t else ''))
    wedo = len(re.findall(r'kind:\s*[\'"](guided|independent|transfer)', t))
    pre = t.count('preamble:')
    retro = t.count('retrospective:')
    titles = len(re.findall(r'^\s{8}title:\s*[\'"]', t, re.M))  # exercise-level title heuristic
    rows.append({
        'section': int(nn), 'file': f, 'preamble': pre, 'retrospective': retro,
        'weDo_kind': wedo, 'ok': pre >= 20 and retro >= 20,
    })
ok = sum(1 for r in rows if r['ok'])
print(json.dumps({'sections_ok_heuristic': ok, 'total': len(rows), 'rows': rows}, indent=2)[:4000])
print('SUMMARY ok', ok, '/', len(rows), 'mean_preamble', sum(r['preamble'] for r in rows)/len(rows))
