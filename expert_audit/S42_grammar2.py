#!/usr/bin/env python3
"""Recompute S42 metrics focusing on real prose sentences (>=6 words)."""
import re, sys, json, statistics

# Re-load full metrics
data = json.load(open('/home/z/my-project/audits/S42_metrics.json', encoding='utf-8'))

real_sents = []
heading_like = []
for blk in data:
    for s in blk['sentences']:
        w = s['words']
        if w < 6:
            heading_like.append(s)
        else:
            real_sents.append(s)

n_real = len(real_sents)
mean_fh = statistics.mean(s['FH'] for s in real_sents)
mean_inf = statistics.mean(s['INFLESZ'] for s in real_sents)
mean_wps = statistics.mean(s['wps'] for s in real_sents)
mean_spw = statistics.mean(s['spw'] for s in real_sents)

# distribution
band = {'muy_facil':0,'facil':0,'normal':0,'dificil':0,'muy_dificil':0}
for s in real_sents:
    f = s['FH']
    if f >= 80: band['muy_facil']+=1
    elif f >= 60: band['facil']+=1
    elif f >= 50: band['normal']+=1
    elif f >= 30: band['dificil']+=1
    else: band['muy_dificil']+=1

# Findings
long_sentences = [s for s in real_sents if s['long_flag'] in ('LONG','RUNON')]
runon = [s for s in real_sents if s['long_flag'] == 'RUNON']
missing_term = [s for s in real_sents if s['missing_term']]
missing_inv = [s for s in real_sents if s['missing_inverted']]
unbalanced = [s for s in real_sents if s['unbalanced']]
double_sp = [s for s in real_sents if s['double_space']]
space_before = [s for s in real_sents if s['space_before_punct']]
gerund_pile = [s for s in real_sents if s['gerund_pileup']]
high_comma = [s for s in real_sents if s['high_comma_density']]
repeated = [s for s in real_sents if s['repeated_word']]

# Worst (lowest FH) sentences, real prose only
worst = sorted(real_sents, key=lambda s: s['FH'])[:20]

print(f"Real sentences (>=6 words): {n_real}")
print(f"Mean FH: {mean_fh:.1f}")
print(f"Mean INFLESZ: {mean_inf:.1f}")
print(f"Mean WPS: {mean_wps:.2f}")
print(f"Mean SPW: {mean_spw:.2f}")
print(f"Bands: {band}")
print()
print(f"Long (>32w): {len(long_sentences)} | Run-on (>45w): {len(runon)}")
print(f"Missing terminal punct (real prose): {len(missing_term)}")
print(f"Missing inverted ¿¡: {len(missing_inv)}")
print(f"Unbalanced delims: {len(unbalanced)}")
print(f"Double space: {len(double_sp)}")
print(f"Space-before-punct: {len(space_before)}")
print(f"Gerund pileup: {len(gerund_pile)}")
print(f"High comma density: {len(high_comma)}")
print(f"Repeated word: {len(repeated)}")
print()
print("=== 20 lowest FH real-prose sentences ===")
for s in worst:
    print(f"FH={s['FH']:5.1f} INF={s['INFLESZ']:5.1f} W={s['words']:3d} SPW={s['spw']:.2f}  {s['sentence'][:240]}")
print()
print("=== Long / run-on sentences ===")
for s in runon + [x for x in long_sentences if x not in runon]:
    print(f"FH={s['FH']:5.1f} W={s['words']:3d}  {s['sentence'][:280]}")
print()
print("=== Missing terminal punct (real prose) ===")
for s in missing_term[:30]:
    print(f"W={s['words']:3d}  {s['sentence'][:200]}")
print()
print("=== Missing inverted marks ===")
for s in missing_inv[:10]:
    print(f"W={s['words']:3d}  {s['sentence'][:200]}")
print()
print("=== High comma density ===")
for s in sorted(high_comma, key=lambda x:-x['commas'])[:20]:
    print(f"commas={s['commas']} W={s['words']:3d}  {s['sentence'][:200]}")
