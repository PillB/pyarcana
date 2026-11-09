#!/usr/bin/env python3
"""Exam bank audit (prisma/seed.ts QUESTION_BANK, extracted by extract_exam_bank.ts).

Per section: where the keyed answer sits (position balance), how often it is the longest option
(the classic length cue), and how often the item's own explanation supports a *different* option
than the key (word overlap of explanation vs each option; a flag to read by hand, not a verdict).
Haladyna, Downing & Rodriguez (2002) guidelines: balance the key's position; keep options
homogeneous in length; the key must be defensibly the only correct one.

    python3 audit/learner-walkthrough/scripts/exam_key_audit.py /tmp/claude-0/sections > data/exam-key-audit.json
"""
import json
import re
import sys
from collections import Counter
from pathlib import Path

STOP = set('de la el en y a que los las un una por con para del se es al lo o no su sus como más sin'.split())


def words(s: str) -> set[str]:
    return {w for w in re.findall(r'[a-záéíóúñü0-9_]+', s.lower()) if len(w) > 2 and w not in STOP}


def main() -> None:
    d = Path(sys.argv[1])
    out = {}
    for f in sorted(d.glob('S??-*.exam.json')):
        items = json.loads(f.read_text(encoding='utf-8'))
        pos = Counter(q['correctIndex'] for q in items)
        longest = sum(len(q['options'][q['correctIndex']]) == max(map(len, q['options'])) for q in items)
        flagged = []
        for i, q in enumerate(items):
            e = words(q['explanation'])
            scores = [len(e & words(o)) for o in q['options']]
            best = max(range(len(scores)), key=lambda k: scores[k])
            if best != q['correctIndex'] and scores[best] >= 2 and scores[best] >= scores[q['correctIndex']] + 2:
                flagged.append({'item': i, 'keyed': q['options'][q['correctIndex']][:90], 'explanation_supports': q['options'][best][:90]})
        out[f.name[:3]] = {'n': len(items), 'key_position': dict(sorted(pos.items())), 'key_is_longest': longest,
                           'explanation_disagrees_with_key': flagged}
    json.dump(out, sys.stdout, ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
