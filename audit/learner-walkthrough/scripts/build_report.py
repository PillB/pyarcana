#!/usr/bin/env python3
"""Assemble audit/learner-walkthrough/REPORT.md from its parts.

  parts/00-status.md          the STATUS line (written last)
  parts/01-method.md          method and persona
  parts/02-summary.md         the 2-minute summary
  (generated)                 3. per section: browser-walk line from data/walk/SXX.json + reading/SXX.md
  parts/04-badges.md          badge table
  parts/05-value.md           value per level; the "**Lx capstones**" blocks from the readings are
                              appended to it
  parts/06-not-covered.md     what was not covered, MUST items

Missing parts are skipped, so the report can be rebuilt after each level.
    python3 audit/learner-walkthrough/scripts/build_report.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEVELS = [(1, 1, 13), (2, 14, 26), (3, 27, 39), (4, 40, 52)]
OFF_TOPIC_OK = {'S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S30', 'S38', 'S42', 'S45', 'S49'}


def part(name: str) -> str:
    p = ROOT / 'parts' / name
    return p.read_text(encoding='utf-8').rstrip() + '\n\n' if p.exists() else ''


def walk_line(sid: str) -> str:
    p = ROOT / 'data' / 'walk' / f'{sid}.json'
    if not p.exists():
        return f'*Browser walk:* not run for {sid}.\n'
    d = json.loads(p.read_text(encoding='utf-8'))
    if d.get('fatal'):
        return f'*Browser walk [O]:* stopped: `{d["fatal"]}`.\n'
    pg = d.get('playground') or {}
    topic = 'on topic' if sid in OFF_TOPIC_OK else '**off topic** (W03)'
    pg_txt = (f'playground «{pg.get("title")}» ({topic}): ran in Pyodide, verdict `{pg.get("verdict")}`'
              + (f'; after a one-string edit `{pg["afterEdit"]["verdict"]}`' if pg.get('afterEdit') else '')
              if pg.get('present') else 'no playground')
    q = d.get('quiz') or {}
    a1, cta = q.get('afterAttempt1') or {}, q.get('afterCta') or {}
    bug = ('completion lost after «Marcar como completada» (W01)' if a1.get('complete') and cta and not cta.get('complete')
           else 'completion kept' if cta else 'n/a')
    ev = [e for e in d.get('events', []) if not e['text'].startswith('HEAD ') and '/api/v1/me/progress' not in e['text']]
    ev_txt = f'{len(ev)} console/page/network errors' + (f' (first: `{ev[0]["kind"]}: {ev[0]["text"][:120]}`)' if ev else '')
    mob = d.get('mobileTheory') or {}
    mob_txt = 'no horizontal scroll at 390 px' if mob.get('scrollWidth', 0) <= mob.get('clientWidth', 0) else f'horizontal scroll at 390 px ({mob.get("scrollWidth")}px)'
    exam = 'exam shown' if q.get('examShown') else 'no exam, self-check only (W02)'
    return (f'*Browser walk [O]:* {pg_txt}. I Do: {d["ido"]["demos"]} demos, output pre-written (W04). '
            f'We Do: {d["wedo"]["exercises"]} exercises, {d["wedo"]["editable"]} editable (W05). '
            f'Autocheck: {q.get("questions", "?")} questions, {exam}; {bug}. {ev_txt}; {mob_txt}. '
            f'Data: `data/walk/{sid}.json`.\n')


def reading(sid: str) -> tuple[str, str]:
    p = ROOT / 'reading' / f'{sid}.md'
    if not p.exists():
        return f'### {sid}\n\n*Persona reading:* not done.\n', ''
    text = p.read_text(encoding='utf-8').strip()
    m = re.search(r'^\*\*L\d capstones\*\*.*', text, flags=re.M | re.S)
    capstones = ''
    if m:
        capstones, text = m.group(0), text[: m.start()].rstrip()
    head, _, body = text.partition('\n')
    return head + '\n\n' + walk_line(sid) + '\n' + body.strip() + '\n', capstones


def cross_cutting() -> str:
    p = ROOT / 'findings' / 'walk.json'
    if not p.exists():
        return ''
    rows = ['### 3.0 Cross-cutting findings (browser walk and source checks)\n']
    for f in json.loads(p.read_text(encoding='utf-8')):
        rows.append(f'**{f["id"]} [{f["severity"]}]** {f["title"]}  \n'
                    f'*Where:* first seen {f["firstSection"]} ({f["tab"]}); QA report `{f["id"]}`.  \n'
                    f'{f["description"]}  \n'
                    f'*Expected:* {f["expected"]}  \n*Observed:* {f["actual"]}  \n'
                    f'*Fix:* {f["improvement"]}\n')
    return '\n'.join(rows) + '\n'


def main() -> None:
    out = [part('00-status.md'), '# PyArcana learner walkthrough: S01–S52 through the QA platform\n\n',
           part('01-method.md'), part('02-summary.md')]
    out.append('## 3. Per section\n\nCross-cutting findings W01–W11 are defined once in §3.0 and referenced by id in each section.\n\n')
    out.append(cross_cutting())
    capstone_blocks = []
    for lvl, lo, hi in LEVELS:
        if not any((ROOT / 'reading' / f'S{i:02d}.md').exists() for i in range(lo, hi + 1)):
            continue
        out.append(f'### Level {lvl} (S{lo:02d}–S{hi:02d})\n\n')
        for i in range(lo, hi + 1):
            sec, caps = reading(f'S{i:02d}')
            out.append(sec.replace('### ', '#### ', 1) + '\n')
            if caps:
                capstone_blocks.append(caps)
    out.append(part('04-badges.md'))
    value = part('05-value.md')
    if capstone_blocks:
        value += '### Capstone checks from the readings\n\n' + '\n\n'.join(capstone_blocks) + '\n\n'
    out.append(value)
    out.append(part('06-not-covered.md'))
    (ROOT / 'REPORT.md').write_text(''.join(out).rstrip() + '\n', encoding='utf-8')
    print(f'REPORT.md: {sum(len(s.split()) for s in out)} words')


if __name__ == '__main__':
    main()
