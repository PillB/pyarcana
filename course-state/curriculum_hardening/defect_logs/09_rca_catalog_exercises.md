# DEFECT: interaction catalog exercises undercount

## Symptom
`npm run test:e2e-max:catalog` → `ok: false`, exercises **1080** vs expected **≥1200** (1248 = 52×24).
`course_complete_gate` still reported 1248 (different counter).

## Root cause
`scripts/export_interaction_catalog.mjs` parsed weDo with:
```
/weDo:\s*\{([\s\S]*?)\n  youDo\s*:/
```
requiring **exactly two spaces** before `youDo`.

Sections S16–S21 and S36 use **single-space** indentation for top-level keys (` youDo: {`).
Regex failed → `weDoBody` empty → **0 exercises** for 7 sections → 7×24 = 168 missing → 1248−168 = **1080**.

## Why course_complete still passed
`course_complete_gate.py` counts exercises differently (structure/solution fields), not this fragile regex.

## Fix
Relax boundary to `\n[ \t]*youDo\s*:` so 1- or 2-space indent works.

## Integration / side effects
- **Positive:** e2e catalog gate green; exercise shards will actually target S16–S21/S36 weDo starters.
- **Risk:** if a nested `youDo` string appeared inside weDo body, non-greedy match could end early — inspected sections use `youDo` only as sibling key.
- **No change** to curriculum section TS content (intentional `NotImplementedError` / DEFECT starters remain pedagogical defects).

## Validation
Re-run catalog export; assert totals.exercises === 1248 and ok === true.
