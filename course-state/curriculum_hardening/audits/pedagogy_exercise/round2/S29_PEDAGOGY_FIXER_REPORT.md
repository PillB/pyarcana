# S29 Pedagogy Fixer Report (Round 2)

## Section
- **title:** SQL avanzado y modelado relacional
- **id:** `mlops` (archivo `s29-mlops.ts`; contenido = almacén relacional ER en SQLite de lab, **no** MLOps de pipelines ML)
- **index:** 29
- **source:** `src/lib/course/sections/s29-mlops.ts`
- **Round-2 report:** `round2/S29_EXERCISE_PEDAGOGY_REPORT.md`
- **scope:** residual **P2 polish only** (no P0/P1; no code/output changes)

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and Round-2 unit ledger.
- Applied hand-written prose fixes unit-by-unit in the assigned section only.
- No generators, bulk templates, loops, or cross-section copy-paste.
- Prefer fewer stronger sentences; preserve starter/solution/output (none required to change).
- Validation: TypeScript check (`tsc --noEmit`) clean; word counts measured only as gates.

## Units touched

### Eco feedback/retrospective (replace retro; principle + misconception *distinto* + self-check)

| Unit | Fields changed | Notes |
|------|----------------|-------|
| S29-T1-A-E2 | retrospective | Motor CHECK vs guard Python; “arreglar” a 1.0; self-check BETWEEN 0 y 1 |
| S29-T1-A-E3 | retrospective, hint, hints | Des-eco PRAGMA; hints aflojados (no línea exacta del PRAGMA) |
| S29-T1-B-E1 | retrospective | COUNT=2 = reconstruir review→match; UPDATE limpio; self-check non_match |
| S29-T1-B-E2 | retrospective | Match sin `record` = opinión; self-check `ingested_at` |
| S29-T1-B-E3 | retrospective | Des-eco primera frase; self-check COUNT(*) vs COUNT(valid_to) intacto |
| S29-T2-A-E1 | retrospective | Cola = sin label; NOT EXISTS vs NOT IN; self-check pair_id NULL |
| S29-T2-B-E2 | retrospective | IS NULL como predicado de ausencia; self-check LEFT JOIN + `= NULL` |
| S29-T3-A-E1 | retrospective | ROLLBACK = pre-BEGIN; “commit para ver”; self-check sin begin |
| S29-T3-B-E2 | retrospective | Dead letter `running`; no delete+insert; self-check por qué |
| S29-T4-B-E3 | retrospective | Hardcode 0 ≠ ejercer SQL; self-check test_store.py |

### Short iDo retrospectives (expand + self-check)

| Unit | Fields changed | Notes |
|------|----------------|-------|
| S29-T1-B-DEMO | retrospective | Append-only vs UPDATE; self-check lista por id; puente We Do |
| S29-T2-A-DEMO | retrospective | Anti-join vs INNER; self-check p1/p2; puente NOT EXISTS/windows |
| S29-T3-A-DEMO | retrospective | Todo o nada; self-check raise *después* de evidence |
| S29-T4-A-DEMO | retrospective | Versionar + plan; self-check MAX(v)=1 sin INDEX en plan |

### Instruction / titles / hints (polish)

| Unit | Fields changed | Notes |
|------|----------------|-------|
| S29-T4-A-E1 | title | → “Última migration con MAX(version)” |
| S29-T4-A-E2 | title, instruction | Title: “Crear índice real idx_pairs_block_key”; paso 4 sin “asserts de solution” |
| S29-T4-A-E3 | title | → “Sin backup no hagas DROP de pairs” |
| S29-T4-B-E1 | title | → “EntityRepo.get: devolver Ana con e1” |
| S29-T2-A-E3 | hints | Window described without pasting full OVER clause |
| S29-T3-A-E3 | hints | Política fail-closed sin regalar el `if not` literal |

## Units intentionally not touched
- **Pass A / residual none required:** T1-A-DEMO, T1-A-E1, T2-A-E2, T2-A-E3 (retro ok), T2-B-DEMO, T2-B-E1, T2-B-E3, T3-A-E2, T3-A-E3 (retro ok), T3-B-DEMO, T3-B-E1, T3-B-E3, T4-A-E3 (retro ok), T4-B-DEMO, T4-B-E1/E2 (title polish only on E1), **youDo**
- **Code/tests/outputs:** none — DEFECT discriminators, starter ≠ solution, and solution outputs preserved (incl. T4-B-E1 uso de get, T4-B-E3 `print(0)`)
- **Most preambles:** left as Round-1 structure pass (bullets contexto/meta/éxito/límites)
- **Section id/filename:** not renamed (`mlops` / `s29-mlops.ts` mismatch is out of scope)

## Code/output changes
**None.** All solution outputs and `# DEFECT:` comments preserved.

## Validation
- [x] Only Section 29 source edited for pedagogy
- [x] No bulk prose generation
- [x] Feedback ≠ retrospective on priority eco units (metacognition + self-check)
- [x] T4-A-E2 instruction no longer mentions “asserts de solution”
- [x] We Do titles T4 expanded toward 4–12 words
- [x] Expanded retros ~46–59 words on priority units (spec 40–80)
- [x] `tsc --noEmit` clean
- [x] Outputs/starter solutions unchanged

## Residual after R2
- Optional length polish on already-usable short retros (T1-B-E3 ~32 w, T4-B-E3 ~31 w, T2-A-E2, T3-A-E2, T4-A-E1) if a future pass wants strict 40-word floor everywhere; not blocking for true-newbie.
- File id `mlops` / filename `s29-mlops.ts` still mismatch content (SQL/almacén ER) — naming follow-up, not exercise pedagogy.
- E3 hints still guide transfer but no longer paste full solution lines on T1-A-E3 / T2-A-E3 / T3-A-E3.

## Summary counts
| Action | Count |
|--------|------:|
| weDo retrospective replaced/expanded | 10 |
| weDo title updated | 4 |
| weDo instruction updated | 1 |
| weDo hints loosened (E3) | 3 |
| iDo retrospective expanded | 4 |
| Code/output edits | 0 |

Section 29 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
