# S06 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Colecciones y estructuras de datos
- **id:** `numpy` (index 6; archivo `s06-numpy.ts`)
- **source:** `src/lib/course/sections/s06-numpy.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-2 review:** `S06_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-2 residual ledger
- Applied **hand-written** residual fixes only where R2 scored P1/P2
- No generators, no bulk templates, no wholesale rewrite of A-scored units
- Code/output changed **only** for T3-B-E2 (justified integrity); all other units prose-only
- Validated T3-B-E2 starter vs solution by execute-and-diff

## Acceptance checklist
- [x] P1 integrity: T3-B-E2 wrong vs right now distinguishable
- [x] P1 metacognition: T4-A-E1 retrospective expanded
- [x] P2 polish applied for listed units (instruction/feedback/retro/preamble)
- [x] A-scored units left alone (no re-campaign)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## What was fixed

### P1

| Unit | Severity | Changes |
|------|----------|---------|
| **S06-T3-B-E2** | P1 integrity | Added fixture row `C004` with `email: ''` to starter **and** solution. Updated éxito, instruction step 4, `tests`, `edgeCases`, solution `output`. Wrong `if not c.get('email')` now prints `C004: missing`; correct policy prints `C004: present`. |
| **S06-T4-A-E1** | P1 thin close | Replaced one-line retrospective with principle + misconception (id vs monto) + transfer to multi-key E2. |

### P2 polish

| Unit | Changes |
|------|---------|
| S06-T1-A-E2 | Feedback distinguishes alias-of-list vs `tuple` + `+` extension (less echo of retro) |
| S06-T1-A-E3 | Instruction step 4: AttributeError only; no claim about editing exception message |
| S06-T1-B-DEMO | Preamble opening: “el riesgo es **confundir nombre con copia**” (pitfall named, not imperative mishap) |
| S06-T1-B-E2 | Instruction step 4 = print order task, not “compare with solution” |
| S06-T2-A-E1 | Retrospective rewritten (pares ≠ índice; classic `d[1]` error); no longer clones feedback opener |
| S06-T2-A-E3 | Instruction drops copy+update spoiler; step 4 verifies `retry: 1`; copy+update only in hints; éxito cleaned |
| S06-T3-A-E1 | Context bullet ties to CP-N1-B summary counts |
| S06-T4-A-DEMO | Retrospective: both principles (`sorted` vs `.sort`, multi-key) + We Do bridge |
| S06-T4-B-E2 | Retrospective deduped vs feedback; self-check on omitting `sort_keys` |

### Left alone (as directed)
- All R2 **A** units without residual
- **youDo** optional identical-payload row in `main` — not required; README/policy already covers idéntico≠conflicto
- Optional T1-A-DEMO slice-exclusive sentence — skipped (B, not on P1 list)

## Code / output integrity

### T3-B-E2 (only code change)
**Expected solution output:**
```
C001: present
C002: missing
C003: missing
C004: present
```

**Execute proof:**
| id | starter (`not c.get`) | solution (`not in` / `is None`) |
|----|----------------------|----------------------------------|
| C001 | present | present |
| C002 | missing | missing |
| C003 | missing | missing |
| C004 | **missing** | **present** |

Wrong condition fails visible success; right condition passes.

### All other units
- Solution `code` / `output` preserved
- Starter defects left intentional

## Residual risks (post-fix)
1. Section `id: "numpy"` vs title “Colecciones” remains product debt (out of exercise-pedagogy scope).
2. T4-A-DEMO still carries dual lesson (multi-sort + sort→None); acceptable with sequenced preamble.
3. youDo still has no live identical-duplicate row in fixture (policy taught in T2-B-E3 + text); optional only.
4. Full browser/Pyodide suite not re-run; only T3-B-E2 outputs re-executed locally.

## Validation
- Hand re-read of each edited unit in source after apply
- T3-B-E2 execute-and-diff: starter ≠ solution on C004
- `npx tsc --noEmit -p .` → exit 0
- Field completeness unchanged (already complete from Round 1): preamble 32 / retrospective 33 / weDo titles 24

## Anti-aberration
- Every residual paragraph hand-written with pedagogical purpose
- No scripts/loops/templates to manufacture prose
- Prefer fewer stronger sentences; no essay bloat
- No rubber-stamp of Round-1 text; residuals target R2 diagnosis only

Section 6 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
