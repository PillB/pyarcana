# S35 DONE — Explicabilidad, equidad e incertidumbre

**File:** `src/lib/course/sections/s35-system-design.ts`  
**Order in reverse walk:** first (35 → 34 → 33 → 32)  
**Research:** `S35_RESEARCH.md`

## Before (stub)

| Metric | Value |
|--------|------:|
| kb | 34.2 |
| n_para | 27 |
| avg_para | 75.0 |
| min_para | 36 |
| n_instr | 24 |
| avg_instr | 24.7 |
| min_instr | 17 |
| avg_starter (weDo) | 7 |
| todo_starters | 24 |
| residual score | 3 (stub) |

## After (gold target)

| Metric | Value |
|--------|------:|
| kb | 88.5 |
| n_heads | 9 |
| n_para | 27 |
| avg_para | 311.5 |
| min_para | 201 |
| short_paras (&lt;180) | 0 |
| n_instr | 24 |
| avg_instr | 393.9 |
| min_instr | 372 |
| short_instr (&lt;150) | 0 |
| weDo starters | 24 (enriched, 0 TODO) |
| solutions | 24 honest, runtime-verified |
| selfCheck | 4 (preserved) |
| subtopicIds | S35-T1-A…T4-B (preserved) |
| index / id | 35 / `system-design` (preserved) |

## Validation

- `check_section_structure.py` — ok (8 subtopics, 8 demos, 24 exercises)
- `python_content_runtime_audit.py --only s35-system-design` — 64/64 pass
- Progressive disclosure: pure Python; no S36+ APIs
- Domain: CASO-LIM-035, ficha 4 capas, fail-closed OOD/audit

## Pedagogy notes

- Theory: why + operational contract + Peru synthetic application per heading
- weDo E1/E2/E3: PASS / breach+missing / CONTINUE+breach+REQUEST
- Breach codes: REJECT_CAUSAL_CLAIM, REJECT_LOW_N_CLAIM, REJECT_PROXY_FEATURE, REJECT_POINT_ONLY, REJECT_AUTO_LABEL, REJECT_SCOPE_BREACH, REJECT_SILENT_OVERRIDE
