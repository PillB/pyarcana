#!/usr/bin/env python3
"""Extract learner-facing Spanish prose from S39 source for grammar analysis.
Handles paragraphs arrays and double-quoted string lists.
"""
import re, sys

SRC = '/home/z/my-project/pyarcana_repo/src/lib/course/sections/s39-integrator-phase2.ts'
raw = open(SRC, 'r', encoding='utf-8').read()

PROSE_KEYS = {
    'title','shortTitle','tagline','jobRelevance','text','heading','paragraphs',
    'intro','description','why','instruction','hint','hints','edgeCases','tests',
    'feedback','context','objectives','requirements','portfolioNote','criterion',
    'question','options','explanation','content','label','note'
}

def strip_template(s):
    s = re.sub(r'\$\{[^}]*\}', '', s)
    return s

items = []  # (key, value)

# 1) Multi-line backtick strings: key: `...`
for m in re.finditer(r'(\w+)\s*:\s*`([^`]*?)`', raw, flags=re.DOTALL):
    k = m.group(1); v = m.group(2)
    if k in PROSE_KEYS:
        items.append((k, strip_template(v)))

# 2) Double-quoted single-line strings: key: "..."
for m in re.finditer(r'(\w+)\s*:\s*"((?:[^"\\]|\\.)*)"', raw):
    k = m.group(1); v = m.group(2)
    if k in PROSE_KEYS:
        try:
            v2 = v.encode().decode('unicode_escape') if '\\n' in v else v
        except Exception:
            v2 = v
        items.append((k, v2))

# 3) paragraphs: [ "str", "str", ... ] arrays
# Capture paragraphs: array of double-quoted strings OR backtick strings
def find_arrays(key):
    out = []
    for m in re.finditer(rf'{key}\s*:\s*\[', raw):
        start = m.end()
        # Find matching closing bracket, respecting quotes
        depth = 1
        i = start
        in_str = None
        while i < len(raw) and depth > 0:
            c = raw[i]
            if in_str:
                if c == '\\':
                    i += 2; continue
                if c == in_str:
                    in_str = None
            else:
                if c in ('"', "'", '`'):
                    in_str = c
                elif c == '[':
                    depth += 1
                elif c == ']':
                    depth -= 1
            i += 1
        body = raw[start:i-1]
        # Extract strings from body (double-quoted, backtick-quoted)
        for sm in re.finditer(r'"((?:[^"\\]|\\.)*)"', body):
            try:
                v = sm.group(1)
                v2 = v.encode().decode('unicode_escape') if '\\n' in v else v
                out.append((key, v2))
            except Exception:
                pass
        for sm in re.finditer(r'`([^`]*?)`', body, flags=re.DOTALL):
            out.append((key, strip_template(sm.group(1))))
    return out

for k in ('paragraphs', 'hints', 'edgeCases', 'objectives', 'requirements', 'options'):
    items.extend(find_arrays(k))

# Now write prose blocks
SPANISH_RE = re.compile(r'[áéíóúñ¿¡]', re.IGNORECASE)
FUNC_RE = re.compile(r'\b(de|que|en|para|con|por|es|son|del|los|las|una|uno)\b', re.IGNORECASE)

out_path = '/home/z/my-project/audits/S39_prose.txt'
seen = set()
idx = 0
with open(out_path, 'w', encoding='utf-8') as f:
    for k, v in items:
        if not v or not v.strip():
            continue
        # Skip pure code
        if 'def ' in v or 'import ' in v or 'class ' in v or 'print(' in v:
            continue
        # Skip very short non-prose
        if len(v.strip()) < 12:
            continue
        # Need Spanish signal
        if not SPANISH_RE.search(v) and not FUNC_RE.search(v):
            continue
        key = (k, v)
        if key in seen: continue
        seen.add(key)
        idx += 1
        f.write(f"###S39-{idx}-{k}###\n{v.strip()}\n\n")

print(f"Wrote {idx} prose blocks to {out_path}", file=sys.stderr)
