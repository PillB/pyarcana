#!/usr/bin/env python3
from pathlib import Path
import re
root = Path(__file__).resolve().parents[4] if False else Path('/Users/pabloillescas/Projects/PyArcana')
r1 = root/'course-state/curriculum_hardening/audits/pedagogy_exercise/round1'
r2 = root/'course-state/curriculum_hardening/audits/pedagogy_exercise/round2'
secs = list((root/'src/lib/course/sections').glob('s[0-9][0-9]-*.ts'))
# prefer index order
import re as R
idx = (root/'src/lib/course/index.ts').read_text()
files = R.findall(r"from '\./sections/(s\d{2}-[^']+)'", idx)
pre = sum(1 for f in files if 'preamble:' in (root/f'src/lib/course/sections/{f}.ts').read_text(encoding='utf-8', errors='replace'))
print('r1_reviews', len(list(r1.glob('S*_EXERCISE_PEDAGOGY_REPORT.md'))))
print('r1_fixes', len(list(r1.glob('S*_PEDAGOGY_FIXER_REPORT.md'))))
print('r2_reviews', len(list(r2.glob('S*_EXERCISE_PEDAGOGY_REPORT.md'))))
print('r2_fixes', len(list(r2.glob('S*_PEDAGOGY_FIXER_REPORT.md'))))
print('sections_with_preamble', pre)
