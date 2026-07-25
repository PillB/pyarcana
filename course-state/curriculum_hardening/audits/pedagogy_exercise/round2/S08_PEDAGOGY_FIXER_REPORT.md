# S08 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Archivos, CSV, JSON y contratos de ingesta
- **id:** `pandas` (index 8; archivo `s08-pandas.ts` — stdlib ETL, no pandas)
- **source:** `src/lib/course/sections/s08-pandas.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-2 review:** `S08_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-2 residual ledger
- Applied **hand-written** residual fixes only where R2 scored P1/P2
- No generators, no bulk templates, no wholesale rewrite of A-scored units
- Code/output changed only for integrity alignment (T4-B-E2 starter shape + fixtures; T1-B-E2 call-site; T4-A-E3 print shape)
- Validated T4-B-E2 starter vs solution by execute-and-diff; T1-B-E2 call alignment checked

## Acceptance checklist
- [x] P1 integrity: T4-B-E2 return shape + learner-visible fixtures
- [x] P2 thin retrospectives expanded (T1-A-E1, T1-B-E1, T2-B-E1, T3-B-E1)
- [x] P2 polish: T1-A-E2, T1-B-E2, T2-A-E2, T2-B-E3, T4-A-E3, T4-B-E3
- [x] A-scored units left alone (no re-campaign)
- [x] Solution outputs preserved (`True\nFalse`, `ok\n`, digests, etc.)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## What was fixed

### P1

| Unit | Severity | Changes |
|------|----------|---------|
| **S08-T4-B-E2** | P1 integrity | Starter now returns a single `True` (not 4-tuple) and includes both `good` / `compensated_bad` fixtures with two prints. Preamble publishes fixtures under **Fixtures** + éxito/límites clarify bool contract. Instruction names return shape + fixture reuse. Hints less “paste only” on totals. Retrospective: misconception (suma global) + transfer to E3. Solution code/output **unchanged** (`True` / `False`). |

### P2 polish

| Unit | Changes |
|------|---------|
| **S08-T1-A-E1** | Retrospective: Path ≠ archivo + classic cwd/IDE error + E2 bridge |
| **S08-T1-A-E2** | Instruction step 1: `with p.open(...)` (pathlib habit of the section) |
| **S08-T1-B-E1** | Retrospective full expand: misconception (normalizar crudo) + self-check on `b'\n' in win` |
| **S08-T1-B-E2** | Starter call `'FULL'` → `'ok\n'` + `end=''` on print so only defect is non-atomic write; solution output preserved |
| **S08-T2-A-E2** | Step 4 is a task (header from DictWriter); `newline=''` note demoted to hint |
| **S08-T2-B-E1** | Retrospective: zip silence + classic truncate + E2 bridge |
| **S08-T2-B-E3** | Instruction less spoon-fed (goal + ordered reasons); Counter API kept in hints |
| **S08-T3-B-E1** | Retrospective: misconception of opaque True/False without missing list |
| **S08-T4-A-E3** | Starter `print(sorted(prov.items()))` → `print(prov)` so shape matches success dict |
| **S08-T4-B-E3** | First hint soft (list broken names); listcomp demoted to second hint |

### Left alone (as directed)
- All R2 **A** units without residual (demos, most We Do, youDo)
- Golden digests (`abc`, `id\nC1\n` sha256) untouched
- youDo context density not re-essayed

## Code / output integrity

### T4-B-E2 (primary code change)
**Expected solution output (preserved):**
```
True
False
```

**Execute proof:**

| Fixture | starter (`return True`) | solution (per-source + totals) |
|---------|-------------------------|--------------------------------|
| good | True | True |
| compensated_bad | **True** (wrong) | **False** |
| compensated aggregate | 10 = 10 | per-source both False |

Wrong always-True fails visible success on second print; right condition prints `True` then `False`. Fixtures now live in preamble **and** starter.

### T1-B-E2
- Starter call text only: `write_atomic(p, 'ok\n')` with `end=''`
- Solution output still `ok\n`

### T4-A-E3
- Starter print shape only (`print(prov)`); incomplete dict still the defect
- Solution output (full sha256 + bytes 6) preserved

### All other units
- Solution `code` / `output` preserved
- Starter `# DEFECT:` comments kept intentional

## Residual risks (post-fix)
1. Section `id: "pandas"` vs stdlib ETL content remains product debt (out of exercise-pedagogy scope).
2. T4-B-E2 compensated_bad still needs careful reading; fixtures make success testable without simplifying the two-source lie.
3. Golden digests must not be rewritten in later polish.
4. Full browser/Pyodide suite not re-run; only integrity units re-executed locally.
5. E1 micro-drills remain short by design; retros now carry misconception + bridge without essay bloat.

## Validation
- Hand re-read of each edited unit in source after apply
- T4-B-E2 execute-and-diff: starter `True\nTrue` vs solution `True\nFalse`
- T1-B-E2 starter call produces content `ok\n`
- `npx tsc --noEmit -p .` → exit 0
- Field completeness unchanged (already complete from Round 1)

## Anti-aberration
- Every residual paragraph hand-written with pedagogical purpose
- No scripts/loops/templates to manufacture prose
- Prefer fewer stronger sentences; no essay bloat
- No rubber-stamp of Round-1 text; residuals target R2 diagnosis only

Section 8 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
