#!/usr/bin/env python3
"""Compute Spanish readability + heuristic grammar metrics per sentence/paragraph for S39."""
import re, json, statistics, sys
sys.path.insert(0, '/home/z/my-project')
from grammar_metrics import metrics as compute_metrics

raw = open('/home/z/my-project/audits/S39_prose.txt','r',encoding='utf-8').read()
blocks = re.split(r'^###(\S+)###\s*$', raw, flags=re.MULTILINE)
all_metrics=[]
for i in range(1, len(blocks), 2):
    key = blocks[i].strip()
    text = blocks[i+1].strip()
    m = compute_metrics(text)
    if not m: continue
    # paragraph-level anaphora
    anaphora = False
    if len(m) >= 3:
        first_words = []
        for s in m:
            mm = re.match(r'^(\w+)', s['sentence'])
            if mm:
                first_words.append(mm.group(1).lower())
        if first_words:
            from collections import Counter
            c = Counter(first_words)
            if c.most_common(1)[0][1] >= 3:
                anaphora = True
    all_metrics.append({'key':key,'paragraph':text,'sentences':m,'anaphora':anaphora})

out_path = '/home/z/my-project/audits/S39_metrics.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(all_metrics, f, ensure_ascii=False, indent=2)

# Summary stats
all_sents = []
for b in all_metrics:
    all_sents.extend(b['sentences'])
total = len(all_sents)
total_blocks = len(all_metrics)
wps_vals = [s['wps'] for s in all_sents]
fh_vals = [s['FH'] for s in all_sents]
spw_vals = [s['spw'] for s in all_sents]
long_count = sum(1 for s in all_sents if s['long_flag']=='LONG')
runon_count = sum(1 for s in all_sents if s['long_flag']=='RUNON')
missing_term = sum(1 for s in all_sents if s['missing_term'])
missing_inv = sum(1 for s in all_sents if s['missing_inverted'])
unbal = sum(1 for s in all_sents if s['unbalanced'])
double_sp = sum(1 for s in all_sents if s['double_space'])
space_before = sum(1 for s in all_sents if s['space_before_punct'])
gerunds = sum(1 for s in all_sents if s['gerund_pileup'])
high_comma = sum(1 for s in all_sents if s['high_comma_density'])
repeated = sum(1 for s in all_sents if s['repeated_word'])
anaphora_blocks = sum(1 for b in all_metrics if b['anaphora'])

print(f"Total prose blocks: {total_blocks}", file=sys.stderr)
print(f"Total sentences: {total}", file=sys.stderr)
print(f"Avg WPS: {statistics.mean(wps_vals):.2f} (max {max(wps_vals)})", file=sys.stderr)
print(f"Avg FH: {statistics.mean(fh_vals):.2f} (min {min(fh_vals):.1f}, max {max(fh_vals):.1f})", file=sys.stderr)
print(f"Avg SPW: {statistics.mean(spw_vals):.2f}", file=sys.stderr)
print(f"LONG (>32w): {long_count} | RUNON (>45w): {runon_count}", file=sys.stderr)
print(f"Missing terminal punct: {missing_term} | Missing inverted marks: {missing_inv}", file=sys.stderr)
print(f"Unbalanced delimiters: {unbal} | Double space: {double_sp} | Space-before-punct: {space_before}", file=sys.stderr)
print(f"Gerund pileup: {gerunds} | High comma density: {high_comma} | Repeated word: {repeated}", file=sys.stderr)
print(f"Anaphoric monotony blocks: {anaphora_blocks}", file=sys.stderr)

# Worst sentences
worst = sorted(all_sents, key=lambda s: s['wps'], reverse=True)[:15]
print("\n=== TOP 15 LONGEST SENTENCES ===", file=sys.stderr)
for s in worst:
    print(f"[{s['wps']}w FH={s['FH']}] {s['sentence'][:200]}", file=sys.stderr)

# Lowest FH (hardest)
hardest = sorted(all_sents, key=lambda s: s['FH'])[:15]
print("\n=== TOP 15 HARDEST (lowest FH) ===", file=sys.stderr)
for s in hardest:
    print(f"[{s['wps']}w FH={s['FH']}] {s['sentence'][:200]}", file=sys.stderr)

print(f"\nWrote metrics to {out_path}", file=sys.stderr)
