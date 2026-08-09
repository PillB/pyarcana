# S06 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Colecciones y estructuras de datos
- **id:** `numpy` (index 6; archivo `s06-numpy.ts`)
- **source:** `src/lib/course/sections/s06-numpy.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-1 review:** `S06_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 unit ledger
- Hand-wrote `preamble` / `retrospective` / We Do `title` / tightened `instruction` / stronger `feedback` / light `why` expansions
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
| S06-T1-A-DEMO | preamble, expanded why, retrospective; description lightly clarified |
| S06-T1-B-DEMO | preamble, expanded why (shallow vs deep), retrospective |
| S06-T2-A-DEMO | preamble, expanded why, retrospective |
| S06-T2-B-DEMO | preamble (idéntico vs conflicto), expanded why, retrospective |
| S06-T3-A-DEMO | preamble (store en RAM / CP-N1-B), expanded why, retrospective |
| S06-T3-B-DEMO | preamble (missing vs empty), expanded why, retrospective |
| S06-T4-A-DEMO | preamble (secuencia multi-sort + sort→None), expanded why, retrospective |
| S06-T4-B-DEMO | preamble (reproducibilidad), expanded why, retrospective |

### We Do (24) — P0
Every unit received hand-written:
1. `title`
2. `preamble` (contexto / meta / éxito / límites)
3. stepped `instruction` (task-only)
4. `retrospective` (principle + misconception + transfer)
5. stronger `feedback` (reasoning, 25–60 words where thin)

| Batch | Units |
|-------|-------|
| T1-A | E1 ventanas, E2 tuple contrato, E3 AttributeError append |
| T1-B | E1 unpack, E2 alias/copy, E3 shallow tags / deepcopy |
| T2-A | E1 dict(pares), E2 get vs KeyError, E3 merge sin mutar |
| T2-B | E1 sorted set emails, E2 &/^, E3 dedup_report (política CP-N1-B) |
| T3-A | E1 len contacts, E2 flatten client_id, E3 isinstance list shape |
| T3-B | E1 get_nested, E2 missing vs present, E3 falsy ≠ missing |
| T4-A | E1 sort monto, E2 multi-key (lambda only in hints), E3 sort→None |
| T4-B | E1 choose struct, E2 JSON determinista, E3 membership cost |

**P2 polish applied:** T4-A-E2 instruction no longer pastes the full lambda in the body (lambda remains in `hint`/`hints`).

### You Do (1) — P1
- Added `retrospective` (defense prompts: invariant, real vs synthetic PII, 30s portfolio line, shallow vs deep)
- Strengthened `context` with **éxito de corrida** (`python memory_model.py` …)
- Aligned `objectives` / `requirements` with política idéntico ≠ conflicto (T2-B-E3)

## Code / output integrity
- **No** starter/solution code or output strings modified
- Defects in starters left intentional (pedagogical)

## Residual risks (for Round 2)
1. T3-B-E2 still states `''` = present without a fixture row with empty string (optional live check)
2. Section `id: "numpy"` vs content “colecciones” remains product debt (out of scope)
3. Volume of prose: Round 2 should spot-check E1/E2/E3 are not near-clones (hand-written distinct transfer cues)

## Validation
- Field counts: preamble 32 (8 iDo + 24 weDo); retrospective 33 (+ youDo); titles 24 weDo
- `npx tsc --noEmit -p .` → exit 0
- Spot assertions: all weDo blocks contain title/preamble/instruction/retrospective/feedback; all iDo contain preamble/retrospective/why

## Anti-aberration
Hand-crafted Peruvian professional Spanish only. No scripts/loops/templates to manufacture educational prose. Measurement scripts used only for field counts and compile.

Section 6 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
