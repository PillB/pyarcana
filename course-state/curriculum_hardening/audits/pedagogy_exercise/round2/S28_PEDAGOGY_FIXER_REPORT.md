# S28 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Pruebas de datos, propiedades e integración
- **id:** `llm-agents` (archivo `s28-llm-agents.ts`; contenido = QA de datos del motor ER)
- **index:** 28
- **source:** `src/lib/course/sections/s28-llm-agents.ts`
- **Round-2 report:** `round2/S28_EXERCISE_PEDAGOGY_REPORT.md`
- **scope:** residual **P2 polish only** (no P0/P1; no code/output changes)

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and Round-2 unit ledger.
- Applied hand-written prose fixes unit-by-unit in the assigned section only.
- No generators, bulk templates, loops, or cross-section copy-paste.
- Prefer fewer stronger sentences; preserve starter/solution/output (none required to change).
- Validation: TypeScript check (`tsc --noEmit`) OK; typo `confudir` removed; high-echo feedback↔retro jaccard reduced on priority units.

## Units touched

### Eco feedback/retrospective (replace retro; light feedback where noted)

| Unit | Fields changed | Notes |
|------|----------------|-------|
| S28-T1-A-E2 | retrospective | Dominio medido vs `True` de teatro; self-check revisor 1.2; puente E3 |
| S28-T1-A-E3 | retrospective | Property-based = invariante+gen+assert; self-check seed/input/expected |
| S28-T1-B-E1 | title, feedback, retrospective | Title a 6 palabras; feedback + desk; retro dirigido vs Jaccard canónico |
| S28-T1-B-E3 | feedback, retrospective | All-pairs vs `pairs[0]`; polaridad invertida; casefold `('x','Y')` |
| S28-T2-A-E1 | retrospective | Dict vacío no “casi válido”; `id=""` vs clave ausente |
| S28-T2-A-E2 | retrospective | 0/1 válidos; etiqueta `score` vs booleano; puente dirty rows |
| S28-T2-A-E3 | retrospective | Volumen ≠ calidad; self-check lista de errores / fail-closed |
| S28-T2-B-E1 | retrospective | Diff visible primero; hardcode `ok`; expected vs actual en CI |
| S28-T2-B-E3 | retrospective | Versión+acción real; changelog de PR; flujo reconcile You Do |
| S28-T3-A-E3 | retrospective | **Prioridad alta (j≈0.86→~0.37):** política con fake sin sleep; 503/timeout |
| S28-T3-B-E3 | retrospective | Oráculo = store no calls; cuándo mock HTTP vs fake estado |
| S28-T4-A-E2 | retrospective | C(n,2) vs `n*n`; self-check n=4 → 16 engaña |
| S28-T4-A-E3 | retrospective | **Eco alto:** resume+NFC juntos en tagline; portfolio integration |
| S28-T4-B-E1 | retrospective | Orden set inestable; golden keys JSON; puente flake_rate |
| S28-T4-B-E3 | retrospective | Re-seed *dentro* de `run`; tres controles README You Do |

### Short iDo why/retrospective (expand + typo)

| Unit | Fields changed | Notes |
|------|----------------|-------|
| S28-T1-B-DEMO | retrospective | Typo **confudir→confundir**; self-check nombre de test Jaccard |
| S28-T2-A-DEMO | retrospective | Lista legible > False mudo; etiquetas fila sucia |
| S28-T2-B-DEMO | why, retrospective | why + diff legible; quién firma golden |
| S28-T3-A-DEMO | why, retrospective | Oráculo ISO; no wall clock; por qué isoformat > str(d) |
| S28-T3-B-DEMO | retrospective | Overmock True mágico; flag `overmock_false_pos` |
| S28-T4-A-DEMO | why, retrospective | Join real vs booleano; por qué `id_a < id_b` |
| S28-T4-B-DEMO | retrospective | Flake = diseño; tres controles seed/reloj/sort |

### Short weDo retrospective (<25 w → principle + misconception + transfer + self-check)

| Unit | Fields changed | Notes |
|------|----------------|-------|
| S28-T4-A-E1 | retrospective | SQL COUNT real; close prematuro `:memory:`; momento de contar |

## Units intentionally not touched
- **Pass A / residual none required:** T1-A-DEMO, T1-A-E1, T1-B-E2, T2-B-E2, T3-A-E1, T3-A-E2, T3-B-E1, T3-B-E2, T4-B-E2, **youDo**
- **Code/tests/outputs:** none (integrity traps already correct; starter ≠ solution preserved)
- **Most preambles / instructions:** left as Round-1 structure pass (task-only steps OK under floor)
- **Hints E3:** not de-spoiled (acceptable transfer andamiaje)

## Code/output changes
**None.** All solution outputs and `# DEFECT:` discriminators preserved.

## Validation
- [x] Only Section 28 source edited for pedagogy
- [x] No bulk prose generation
- [x] Feedback ≠ retrospective on previously eco units (metacognition + self-check where expanded)
- [x] Typo `confudir` eliminated
- [x] `tsc --noEmit` clean
- [x] Outputs/starter solutions unchanged
- [x] Spot-check high-echo jaccard post-fix: T3-A-E3 ~0.37, T4-A-E3 ~0.43, T2-A-E3 ~0.22, T3-B-E3 ~0.25, T1-B-E3 ~0.12 (all well below pre-fix extremes)

## Residual after R2
- Optional length polish on already-usable weDo retros (T1-A-E1, T1-B-E2, T3-A-E1/E2, T3-B-E1/E2, T2-B-E2, T4-B-E2) if a future pass wants strict 40-word floor everywhere; not blocking for true-newbie.
- File id `llm-agents` / filename `s28-llm-agents.ts` still mismatch content (QA ER, not LLM agents) — naming follow-up, not exercise pedagogy.
- E3 hints remain slightly formulaic (acceptable transfer tier).

## Summary counts
| Action | Count |
|--------|------:|
| weDo retrospective replaced/expanded | 16 |
| weDo feedback expanded | 2 |
| weDo title updated | 1 |
| iDo retrospective expanded | 7 |
| iDo why expanded | 3 |
| Code/output edits | 0 |

Section 28 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
