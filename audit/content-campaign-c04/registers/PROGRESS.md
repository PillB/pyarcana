# C04 progress

| Stage | Failures | P0 | Skips | Gate honest? |
|---|--:|--:|--:|---|
| 0 · baseline (as previously reported) | 26 | 4 | 361 | **no** — deps hidden, extraction unfaithful |
| 1 · dependency visibility restored | 36 | 6 | 70 | partly |
| 1 · faithful TS escape decoding | 38 | 8 | 70 | **yes** |
| 2 · syntax defects repaired (21 escapes, 2 files) | 30 | 4 | 70 | yes |
| 2 · S41 orphan contract lines repaired | 26 | 0 | 70 | yes |
| 2 · DEFECT marker taught to the gate | **11** | **0** | 70 | yes |

## Root causes fixed (not symptoms)
1. `run_python` used `-I`, hiding user site-packages → 291 snippets skipped, never executed.
2. `extract_balanced_template` dropped backslashes → the audit executed a *different program* than the one shipped. Now byte-identical to TypeScript across all 3360 code strings.
3. `EXPECTED_FAIL_MARKERS` did not know `DEFECT`, this course's own marker for a deliberately broken starter (1594 uses across 43 files).
4. `test_s03_independent_contract` had no Python-3.10 guard for `match` content.

## Still open
- 9 × `output_mismatch` (s17 packaging 3, s19 databases-orm 4, s20 rag 2)
- 2 × starter raising `PermissionError` with no marker (s20 rag, s23 computer-vision)
- S19 coherence defect — see FINDING-S19 below.

## FINDING-S19 — a claim that contradicts the section's own data
S19's fixture is Lima 28.0 (n=40), Bogota 22.5 (n=32), Madrid 24.0 (n=28).
The prose asserts **"Madrid lidera el ticket mediano"** seven times, and one
paragraph reads `row {region:'Lima', median:28} -> tooltip 'Madrid: 28 PEN'`.
Lima leads, not Madrid. The code is right; the prose and four declared outputs
are wrong. Isolated to S19 (54 `Madrid` occurrences; no other section affected).
Repairing this is an editorial change to the section's running example.
