# S29 Pedagogy Fixer Report (Round 1)

## Section
- **title:** SQL avanzado y modelado relacional
- **shortTitle:** SQL almacén ER
- **id:** `mlops` (archivo `s29-mlops.ts`; contenido = almacén relacional del ER en SQLite de lab — **no** MLOps de pipelines ML)
- **index:** 29
- **source:** `src/lib/course/sections/s29-mlops.ts`
- **review input:** `round1/S29_EXERCISE_PEDAGOGY_REPORT.md`
- **date:** 2026-07-25

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the full Round-1 unit ledger for S29
- Hand-applied optional schema fields only in the assigned section source
- No generators, bulk templates, or cross-section copy-paste of pedagogical prose
- Preserved all starter `# DEFECT:` bugs, solution code, and exact demo/exercise outputs
- Prose in Peruvian professional Spanish; fixture **CASO-LIM-029** / `run_id=cpn3a-sql`; *match ≠ fraude* ni parentesco

## Acceptance checklist

| Criterion | Status |
|-----------|--------|
| Every non-trivial unit has `preamble` + `retrospective` | **PASS** — 8 iDo + 24 weDo; You Do retrospective only (context already frames project) |
| We Do has short `title` | **PASS** — 24/24 |
| `instruction` is task-only | **PASS** — goal/success/constraints moved into preamble bullets |
| Exact outputs preserved | **PASS** — no execute-and-diff needed; oráculos intactos |
| Spanish PE; no real PII | **PASS** — sintético `@example.pe` / ids `ent-00N`; política match ≠ fraude en youDo retrospective |
| No generators used | **PASS** |
| Section source compiles | **PASS** — `npx tsc --noEmit` exit 0 |

## Counts applied

| Kind | Units | Fields added |
|------|-------|----------------|
| iDo | 8 | `preamble` + `retrospective` each; `why` expanded to ~40–90 words |
| weDo | 24 | `title` + `preamble` + task-step `instruction` + `retrospective`; feedback polish on T1-A-E1 (identidad del almacén) |
| youDo | 1 | `retrospective` only; light `portfolioNote` viñeta on invariante medible (P2 opcional del review) |

**Totals in source after fix:** `preamble` × 32 · `retrospective` × 33 · weDo `title` × 24

## Unit ledger (fix)

### iDo (P1 — all 8)
| Unit | Changes |
|------|---------|
| S29-T1-A-DEMO | preamble (PRAGMA + CHECK + A&lt;B) + why ampliado + retrospective (DDL no basta) |
| S29-T1-B-DEMO | preamble append-only / no UPDATE + why + retrospective |
| S29-T2-A-DEMO | preamble cola = anti-join + why + retrospective (no INNER) |
| S29-T2-B-DEMO | preamble COUNT/NULL/cardinalidad + why + retrospective |
| S29-T3-A-DEMO | preamble atomicidad decisión+evidencia + why + retrospective |
| S29-T3-B-DEMO | preamble upsert ≠ borrar decisions + why + retrospective |
| S29-T4-A-DEMO | preamble migration + plan + why + retrospective |
| S29-T4-B-DEMO | preamble repo.pending() encapsulado + why + retrospective |

### weDo guided E1 (P0)
| Unit | Title |
|------|-------|
| S29-T1-A-E1 | PRIMARY KEY en entities (sin duplicar e1) |
| S29-T1-B-E1 | Append-only: review y match sin UPDATE |
| S29-T2-A-E1 | Anti-join: pares sin decisión |
| S29-T2-B-E1 | Cardinalidad C(n,2) con a.id &lt; b.id |
| S29-T3-A-E1 | ROLLBACK deja la tabla en 0 |
| S29-T3-B-E1 | Upsert ON CONFLICT: name final B |
| S29-T4-A-E1 | schema_migrations: MAX(version) |
| S29-T4-B-E1 | EntityRepo.get('e1') devuelve Ana |

### weDo independent E2 (P0)
| Unit | Title |
|------|-------|
| S29-T1-A-E2 | CHECK score 0..1 y bad_score |
| S29-T1-B-E2 | Provenance mínima source y record |
| S29-T2-A-E2 | Top-1 global con ROW_NUMBER DESC |
| S29-T2-B-E2 | NULL en SQL: = NULL vs IS NULL |
| S29-T3-A-E2 | Atomicidad: decisión y evidencia o nada |
| S29-T3-B-E2 | Job er_block: running a pending |
| S29-T4-A-E2 | Índice idx_pairs_block_key real |
| S29-T4-B-E2 | Tres conexiones con PRAGMA y close |

### weDo transfer E3 (P0)
| Unit | Title |
|------|-------|
| S29-T1-A-E3 | FK real con PRAGMA foreign_keys |
| S29-T1-B-E3 | Ventana abierta con valid_to IS NULL |
| S29-T2-A-E3 | Top-1 por bloque con PARTITION BY |
| S29-T2-B-E3 | EXPLAIN: SCAN sin índice en block_key |
| S29-T3-A-E3 | Abort si evidence_ok es False |
| S29-T3-B-E3 | Orden canónico A&lt;B rechaza el espejo |
| S29-T4-A-E3 | no_drop_without_backup en pairs |
| S29-T4-B-E3 | pending_count real con NOT EXISTS |

### youDo (P1)
| Unit | Changes |
|------|---------|
| Almacén de verdad ER | `retrospective` de defensa: invariante en `:memory:`, lab vs almacén corporativo, frase de impacto 30 s, match ≠ fraude; `portfolioNote` con viñeta de invariante medible |

## Fade E1→E2→E3 (prosa)
Preambles differentiate scaffold intentionally:
- **E1:** nombra el DEFECT del starter y pasos casi-completos (PK, UPDATE→INSERT, INNER JOIN, join sin filtro, COMMIT, reinsert sin ON CONFLICT, MIN(v), get e2)
- **E2:** meta + éxito + límites; menos migas de API (CHECK IntegrityError, provenance dict, ROW_NUMBER DESC, IS NULL, atomicidad, job pending, CREATE INDEX, 3 conexiones)
- **E3:** superficie nueva (PRAGMA FK, valid_to, PARTITION BY, EXPLAIN SCAN, evidence_ok, CHECK A&lt;B, no_drop, print(pending_count)) con el mismo principio del subtema

## Code / output integrity
- **No** solution code rewrites
- **No** output string changes
- **No** starter `# DEFECT:` removals
- T4-B-E1: preamble explicit that skill is *using* the repo with the inserted id (method already correct)
- T4-B-E3: anti-join left intact; defect remains `print(0)` vs `print(pending_count)`

## Notes out of prose scope (residual)
- Filename/id `mlops` still does not match content (SQL/almacén ER). Documented for maintainers; not changed in this pass (would be a rename/refactor outside exercise pedagogy).

## Residual risks for Round 2
1. **Prose volume:** preambles target 80–150 words (bullets); Round 2 may trim if UI feels heavy.
2. **Filename mismatch** `mlops` remains a discoverability risk for reviewers/search.
3. **T2-B-E3 / T4-A-E2:** plan text varies slightly by SQLite version — oracles already use substring checks; leave code as-is unless Round 2 execute-and-diff finds drift.
4. **Feedback polish:** only T1-A-E1 feedback was lightly enriched; remaining feedback already named bug + warehouse contract — optional further audit impact phrases in R2.

## Validation commands
- Field counts: preamble=32, retrospective=33, weDo titles=24; python completeness check missing=[]
- `npx tsc --noEmit` → exit 0

Section 29 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
