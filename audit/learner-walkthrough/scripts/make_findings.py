#!/usr/bin/env python3
"""Turn the walkthrough's findings into the QA workspace's report shape (file_qa.mjs input).

Two sources:
  * reading/SXX.md — the persona reading of each section. Each bullet under **Blockers**,
    **Issues** or **Confusions** has the shape
      - [sev] [O/I/G] <finding> — where: `<path>` — evidence: «<quote>» — fix: `<file>`: <change>
  * findings/walk.json — cross-cutting findings observed in the browser walk (written by hand from
    data/walk/*.json, each one citing the walk record it comes from).

Category and cause come from what the finding is about (keywords), so the QA export can be
filtered the way the QA tutorial teaches (Tipo, Causa probable, Severidad). The mapping is coarse
on purpose and stated here, not hidden: a reviewer re-triages in the Revisión tab.

    python3 audit/learner-walkthrough/scripts/make_findings.py S01 S13 > /tmp/findings-L1.json
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = Path('/tmp/claude-0/sections')
SEV = {'blocker': 'blocker', 'high': 'high', 'medium': 'medium', 'low': 'low'}
BULLET = re.compile(r'^- \[(blocker|high|medium|low)\]\s*\[([OIG])\]\s*(.+)$')


def section_ids() -> dict[str, str]:
    out = {}
    for f in SECTIONS.glob('S??-*.json'):
        if f.name.endswith('.exam.json'):
            continue
        out[f.name[:3]] = f.name[4:-5]
    return out


def tab_for(where: str) -> str:
    w = where.lower()
    for key, tab in (('youdo', 'youdo'), ('wedo', 'wedo'), ('ido', 'ido'), ('selfcheck', 'quiz'),
                     ('exam', 'quiz'), ('theory', 'theory'), ('learningoutcomes', 'theory')):
        if key in w:
            return tab
    return 'theory'


def classify(block: str, text: str) -> tuple[str, str]:
    t = text.lower()
    if re.search(r'exam|self-check|selfcheck|rubric|answer key|correctindex|distractor|assess', t):
        return 'assessment-design', 'content-gap'
    if block == 'Confusions':
        if re.search(r'never taught|not taught|before .*taught|untaught|unexplained|unglossed|gloss', t):
            return 'unexplained-term', 'content-gap'
        if re.search(r'cannot be answered|not answerable|can.t answer', t):
            return 'unanswerable-question', 'content-gap'
    if re.search(r'pyodide|browser|windows|powershell', t):
        return 'compatibility', 'browser-device'
    return 'content', 'content-gap'


def parse_reading(sid: str, sec_id: str) -> list[dict]:
    path = ROOT / 'reading' / f'{sid}.md'
    if not path.exists():
        return []
    findings, block, n = [], None, 0
    for line in path.read_text(encoding='utf-8').splitlines():
        head = re.match(r'^\*\*(Blockers|Issues|Confusions)\*\*', line)
        if head:
            block = head.group(1)
            continue
        if line.startswith('**'):
            block = None
            continue
        m = BULLET.match(line.strip()) if block else None
        if not m:
            continue
        sev, label, body = m.groups()
        n += 1
        parts = re.split(r'\s+—\s+(?=where:|evidence:|fix:)', body)
        what = parts[0].strip()
        fields = {p.split(':', 1)[0]: p.split(':', 1)[1].strip() for p in parts[1:] if ':' in p}
        category, cause = classify(block, what)
        title = re.split(r'(?<=[.;:])\s', what, maxsplit=1)[0][:150]
        findings.append({
            'id': f'{sid}-R{n:02d}',
            'sectionId': sec_id,
            'tab': tab_for(fields.get('where', '')),
            'category': category,
            'cause': cause,
            'severity': SEV[sev],
            'title': f'{sid} {title}',
            'description': f'[{label}] {what}\n\nDónde (campo del contenido): {fields.get("where", "—")}',
            'expected': '',
            'actual': f'Evidencia: {fields.get("evidence", "—")}',
            'repro': f'1. Abrir {sid} ({sec_id})\n2. Pestaña {tab_for(fields.get("where", ""))}\n3. Ubicar {fields.get("where", "—")}',
            'improvement': fields.get('fix', ''),
            'source': f'reading/{sid}.md',
            'block': block,
            'label': label,
        })
    return findings


def main() -> None:
    lo, hi = (int(a.strip('S')) for a in (sys.argv[1], sys.argv[2]))
    ids = section_ids()
    out: list[dict] = []
    walk = ROOT / 'findings' / 'walk.json'
    if walk.exists():
        out += [f for f in json.loads(walk.read_text(encoding='utf-8')) if lo <= int(f['firstSection'].strip('S')) <= hi]
    for i in range(lo, hi + 1):
        sid = f'S{i:02d}'
        out += parse_reading(sid, ids[sid])
    json.dump(out, sys.stdout, ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
