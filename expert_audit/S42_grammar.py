#!/usr/bin/env python3
"""Compute grammar metrics for S42 prose blocks."""
import re, sys, json, statistics
sys.path.insert(0, '/home/z/my-project')
from grammar_metrics import metrics as block_metrics

PROSE = '/home/z/my-project/audits/S42_prose.txt'
OUT = '/home/z/my-project/audits/S42_metrics.json'

raw = open(PROSE, encoding='utf-8').read()
# Split by ###L<line>|<key>### markers
parts = re.split(r'^###L(\d+)\|(\w+)###\s*$', raw, flags=re.MULTILINE)
# parts = ['pre', line1, key1, val1, line2, key2, val2, ...]
all_metrics = []
agg = []
for i in range(1, len(parts), 3):
    line = int(parts[i])
    key = parts[i+1]
    text = parts[i+2].strip()
    if not text:
        continue
    m = block_metrics(text)
    if not m:
        continue
    # paragraph-level anaphora: do 3+ sentences share the same first word?
    first_words = []
    for s in m:
        mm = re.match(r'^(\w+)', s['sentence'])
        if mm: first_words.append(mm.group(1).lower())
    anaphora = False
    if first_words:
        from collections import Counter
        c = Counter(first_words)
        if c.most_common(1)[0][1] >= 3:
            anaphora = True
    all_metrics.append({
        'line': line, 'key': key, 'text': text,
        'paragraph_metrics': {
            'n_sentences': len(m),
            'mean_wps': round(statistics.mean(s['wps'] for s in m),2),
            'mean_FH': round(statistics.mean(s['FH'] for s in m),1),
            'mean_INFLESZ': round(statistics.mean(s['INFLESZ'] for s in m),1),
            'mean_spw': round(statistics.mean(s['spw'] for s in m),2),
            'anaphora': anaphora,
        },
        'sentences': m,
    })
    agg.append({
        'line': line, 'key': key,
        'n_sentences': len(m), 'mean_FH': statistics.mean(s['FH'] for s in m),
        'mean_wps': statistics.mean(s['wps'] for s in m),
        'mean_spw': statistics.mean(s['spw'] for s in m),
    })

# Save full
with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(all_metrics, f, ensure_ascii=False, indent=2)

# Aggregate stats
n_blocks = len(all_metrics)
all_sents = [s for blk in all_metrics for s in blk['sentences']]
n_sents = len(all_sents)
mean_fh = statistics.mean(s['FH'] for s in all_sents) if all_sents else 0
mean_inf = statistics.mean(s['INFLESZ'] for s in all_sents) if all_sents else 0
mean_wps = statistics.mean(s['wps'] for s in all_sents) if all_sents else 0
mean_spw = statistics.mean(s['spw'] for s in all_sents) if all_sents else 0

# Findings
long_sentences = [s for s in all_sents if s['long_flag'] in ('LONG','RUNON')]
runon = [s for s in all_sents if s['long_flag'] == 'RUNON']
missing_term = [s for s in all_sents if s['missing_term']]
missing_inv = [s for s in all_sents if s['missing_inverted']]
unbalanced = [s for s in all_sents if s['unbalanced']]
double_sp = [s for s in all_sents if s['double_space']]
space_before = [s for s in all_sents if s['space_before_punct']]
gerund_pile = [s for s in all_sents if s['gerund_pileup']]
high_comma = [s for s in all_sents if s['high_comma_density']]
repeated = [s for s in all_sents if s['repeated_word']]
anaphora_paragraphs = [blk for blk in all_metrics if blk['paragraph_metrics']['anaphora']]

# Worst (lowest FH) sentences
worst = sorted(all_sents, key=lambda s: s['FH'])[:15]

print(f"Blocks: {n_blocks}")
print(f"Sentences: {n_sents}")
print(f"Mean FH: {mean_fh:.1f}")
print(f"Mean INFLESZ: {mean_inf:.1f}")
print(f"Mean WPS: {mean_wps:.2f}")
print(f"Mean SPW: {mean_spw:.2f}")
print(f"Long (>32w): {len(long_sentences)} | Run-on (>45w): {len(runon)}")
print(f"Missing terminal punct: {len(missing_term)}")
print(f"Missing inverted ¿¡: {len(missing_inv)}")
print(f"Unbalanced delims: {len(unbalanced)}")
print(f"Double space: {len(double_sp)}")
print(f"Space-before-punct: {len(space_before)}")
print(f"Gerund pileup (≥3): {len(gerund_pile)}")
print(f"High comma density (>0.12): {len(high_comma)}")
print(f"Repeated word: {len(repeated)}")
print(f"Paragraphs w/ anaphora: {len(anaphora_paragraphs)}")
print()
print("=== 15 lowest FH sentences ===")
for s in worst:
    print(f"FH={s['FH']:5.1f} INF={s['INFLESZ']:5.1f} W={s['words']:3d} SPW={s['spw']:.2f}  {s['sentence'][:200]}")
print()
print("=== Run-on / very long sentences ===")
for s in runon + [x for x in long_sentences if x not in runon]:
    print(f"FH={s['FH']:5.1f} W={s['words']:3d}  {s['sentence'][:240]}")
print()
print("=== Anaphoric paragraphs ===")
for blk in anaphora_paragraphs:
    print(f"L{blk['line']} key={blk['key']} n={blk['paragraph_metrics']['n_sentences']}: {blk['text'][:160]}")

# Save summary
summary = {
    'n_blocks': n_blocks, 'n_sentences': n_sents,
    'mean_FH': round(mean_fh,1), 'mean_INFLESZ': round(mean_inf,1),
    'mean_WPS': round(mean_wps,2), 'mean_SPW': round(mean_spw,2),
    'long_gt32': len(long_sentences), 'runon_gt45': len(runon),
    'missing_terminal': len(missing_term), 'missing_inverted': len(missing_inv),
    'unbalanced': len(unbalanced), 'double_space': len(double_sp),
    'space_before_punct': len(space_before), 'gerund_pileup': len(gerund_pile),
    'high_comma': len(high_comma), 'repeated_word': len(repeated),
    'anaphora_paragraphs': len(anaphora_paragraphs),
    'worst_sentences': [{'FH': s['FH'], 'words': s['words'], 'sentence': s['sentence']} for s in worst],
}
with open('/home/z/my-project/audits/S42_metrics_summary.json','w',encoding='utf-8') as f:
    json.dump(summary, f, ensure_ascii=False, indent=2)
