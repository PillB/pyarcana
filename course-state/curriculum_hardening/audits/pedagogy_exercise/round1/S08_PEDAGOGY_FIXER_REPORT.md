# S08 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Archivos, CSV, JSON y contratos de ingesta
- **id:** `pandas` (index 8; archivo `s08-pandas.ts` — stdlib ETL, no pandas)
- **source:** `src/lib/course/sections/s08-pandas.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-1 review:** `S08_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 unit ledger
- Hand-wrote `preamble` / `retrospective` / We Do `title` / stepped `instruction` / stronger `feedback` / light `why` expansions
- No generators, no bulk templates, no cross-section copy-paste of prose
- Preserved all solution `code` / `output` strings (no integrity code changes)
- Validated optional schema fields already in `src/lib/types.ts`; `tsc --noEmit` PASS

## Acceptance checklist
- [x] Every non-trivial unit has `preamble` + `retrospective` (youDo: retrospective only; context already frames)
- [x] Every We Do has short `title` (4–12 words)
- [x] `instruction` is task-only steps (E1 names defect; E2 less breadcrumb; E3 transfer surface)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## What was fixed

### I Do (8) — P1
| Unit | Changes |
|------|---------|
| S08-T1-A-DEMO | preamble, expanded why (Path + UTF-8 contrato), retrospective |
| S08-T1-B-DEMO | preamble (consumidor mid-write), description clarified, expanded why, retrospective |
| S08-T2-A-DEMO | preamble (Decimal no float), expanded why, retrospective |
| S08-T2-B-DEMO | preamble (invariante clean/quar), expanded why, retrospective |
| S08-T3-A-DEMO | preamble (array vs JSONL), expanded why, retrospective |
| S08-T3-B-DEMO | preamble (null vs missing + setdefault), expanded why, retrospective |
| S08-T4-A-DEMO | preamble (hash del crudo), expanded why, retrospective |
| S08-T4-B-DEMO | preamble (totales 5/4/1), expanded why, retrospective |

### We Do (24) — P0
Every unit received hand-written:
1. `title`
2. `preamble` (contexto / meta / éxito / límites)
3. stepped `instruction` (task-only)
4. `retrospective` (principle + misconception + transfer)
5. stronger `feedback` (reasoning, 25–60 words where thin)

| Batch | Units |
|-------|-------|
| T1-A | E1 exists, E2 with lines, E3 UnicodeDecodeError |
| T1-B | E1 CRLF, E2 write_atomic, E3 mid-write |
| T2-A | E1 DictReader, E2 writeheader, E3 Decimal reject |
| T2-B | E1 col_count, E2 quarantine.csv, E3 Counter reasons |
| T3-A | E1 loads, E2 ensure_ascii, E3 datetime TypeError |
| T3-B | E1 validate_schema, E2 null vs missing, E3 setdefault vip |
| T4-A | E1 sha256, E2 copy2 backup, E3 provenance dict |
| T4-B | E1 manifest multi-fuente, E2 compensated_bad, E3 fail-closed run |

### You Do (1) — P1
- Added `retrospective` (defense: invariante exit 1 + quarantine, real vs sintético, frase 30s)
- Strengthened `context` with **Éxito de corrida observable** (exit 0 sanas; n_quarantine≥1; exit 1 conteos rotos)
- Left requirements/objectives/starter/rubric intact

## Code / output integrity
- **No** starter/solution code or output strings modified
- Defects in starters left intentional (`# DEFECT: …`)
- Golden digests (`ba7816bf`, `b776a3a3…`) preserved

## Residual risks (for Round 2)
1. Section `id: "pandas"` vs contenido stdlib ETL remains product debt (out of scope)
2. Micro-drills (T2-B-E1 booleano) still short by nature; preamble kept single-goal
3. T4-B-E2/E3 conceptual load (compensated_bad) depends on fixtures — left exact
4. Volume of prose: Round 2 should spot-check E1/E2/E3 are not near-clones
5. youDo context denser with éxito line — still within assembly-recipe role

## Validation
- Field counts: preamble 32 (8 iDo + 24 weDo); retrospective 33 (+ youDo); titles 24 weDo
- `npx tsc --noEmit -p .` → exit 0
- Spot assertions: all weDo blocks contain title/preamble/instruction/retrospective/feedback before starterCode; all iDo contain preamble/retrospective/why; youDo has retrospective + éxito de corrida

## Anti-aberration
Hand-crafted Peruvian professional Spanish only. No scripts/loops/templates to manufacture educational prose. Measurement scripts used only for field counts and compile.

Section 8 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
