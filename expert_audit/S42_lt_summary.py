#!/usr/bin/env python3
"""Summarize S42 LanguageTool findings."""
import json, re
from collections import Counter

data = json.load(open('/home/z/my-project/audits/S42_lt.json', encoding='utf-8'))

# Skip errors
matches = [m for m in data if 'error' not in m]

# Count by rule
by_rule = Counter(m['rule_id'] for m in matches)
by_cat = Counter(m['category'] for m in matches)

print(f"Total matches: {len(matches)}")
print(f"By category: {dict(by_cat)}")
print()
print("=== Top 25 rules ===")
for rule, n in by_rule.most_common(25):
    examples = [m for m in matches if m['rule_id']==rule][:3]
    print(f"\n[{n}x] {rule}")
    for ex in examples:
        ctx = (ex.get('context') or '').strip().replace('\n',' ')
        msg = (ex.get('message') or '').strip()
        print(f"   ctx: {ctx[:120]}")
        print(f"   msg: {msg[:120]}")

# Filter: spelling-only rules (TYPOS, OTHER_SPELLING) are mostly false positives
spelling_cats = {'TYPOS','OTHER_SPELLING','CONFUSED_WORDS'}
non_spell = [m for m in matches if m['category'] not in spelling_cats]
print(f"\n\nNon-spelling matches: {len(non_spell)}")
by_rule_ns = Counter(m['rule_id'] for m in non_spell)
print("=== Top 20 non-spelling rules ===")
for rule, n in by_rule_ns.most_common(20):
    examples = [m for m in non_spell if m['rule_id']==rule][:3]
    print(f"\n[{n}x] {rule}")
    for ex in examples:
        ctx = (ex.get('context') or '').strip().replace('\n',' ')
        msg = (ex.get('message') or '').strip()
        print(f"   ctx: {ctx[:120]}")
        print(f"   msg: {msg[:120]}")

# Save summary
summary = {
    'total': len(matches),
    'non_spelling': len(non_spell),
    'by_category': dict(by_cat),
    'top_rules': by_rule.most_common(25),
    'top_non_spell_rules': by_rule_ns.most_common(20),
}
with open('/home/z/my-project/audits/S42_lt_summary.json','w',encoding='utf-8') as f:
    json.dump(summary, f, ensure_ascii=False, indent=2)
