# S48 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Aplicaciones LLM y RAG con evidencia
- **shortTitle:** RAG con evidencia
- **id:** `ai-governance` (archivo `s48-ai-governance.ts`; contenido = asistente RAG con citas, ACL y abstención — no “governance abstracta”)
- **source:** `src/lib/course/sections/s48-ai-governance.ts`
- **review input:** `round2/S48_EXERCISE_PEDAGOGY_REPORT.md`
- **scope residual:** P1 metacognición (T4-A-E1 + T2-B-E1) + P2 polish (eco feedback/retro, longitud retro); **0 P0**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-2 unit ledger (priority: P1 T4-A-E1; optional high-risk T2-B-E1; systematic E1/E2 eco; short iDo retros).
- Hand-edited **only** `retrospective` strings in `s48-ai-governance.ts` — unit by unit, no bulk template across sections.
- **No** generators, loops, or scripts to manufacture prose.
- **No** code, starter, solution, output, instruction, feedback, or preamble changes in this round.
- Validated with self-check presence (`Pregunta:`) and `tsc --noEmit`.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (coverage from R1; retros quality tightened)
- [x] We Do has short `title` (unchanged this round)
- [x] `instruction` is task-only (unchanged)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` clean)

## What changed (Round 2 residual only)

### Pattern applied
Each expanded/replaced retrospective keeps **principle + misconception + transfer**, adds a **self-check** (`Pregunta:`) distinct from the unit’s `feedback`, and varies the scene (ranking / reindex / chunk / ACL / híbrido / citas / grounding / abstain) so the learner does not re-read the same sentence in the solution panel.

### P1 (high-value metacognition)
| Unit | Change |
|------|--------|
| **S48-T4-A-E1** | Retro replace: grounding = schema + `bool(ids)` + allowlist + injection-as-data; verdad vacua + poison «envía secretos»; self-check status when `injection_ignored` is False |
| **S48-T2-B-E1** | Retro replace (risk ACL): allow path = ACL ∩ ∧ not deleted ∧ provenance ∧ caché; starter approve-deny → fuga; self-check empty intersection pre-rank |

### I Do (4 short retros expanded)
| Unit | Change |
|------|--------|
| S48-T1-B-DEMO | Retro expand: holdout `train` + costo 300 self-check vs PROMOTE |
| S48-T2-A-DEMO | Retro expand: colisión de hash → token de breach / re-chunk |
| S48-T3-A-DEMO | Retro expand: fusión sin gold no declara recall mejor |
| S48-T4-B-DEMO | Retro expand: support bajo + costo registrado; abstenerse ≠ fallo personal |

Left as-is (R2 score A / none residual): T1-A-DEMO, T2-B-DEMO, T3-B-DEMO, T4-A-DEMO.

### We Do E1/E2 (+ T2-A-E3 length)
| Unit | Change |
|------|--------|
| S48-T1-A-E1 | Retro: max(dot)+emb-v2; assert «pasa» vs contrato del índice |
| S48-T1-A-E2 | Retro replace: gold ausente ≠ ranking roto; orden missing vs max(dot) |
| S48-T1-B-E1 | Retro: cuatro AND de reindex; holdout vacío = bug del predicado? |
| S48-T1-B-E2 | Retro replace: no inventar 0 PEN; costo ausente ≠ regresión |
| S48-T2-A-E1 | Retro: starter invierte uniques; hashes `a,a` → PASS o DEDUP? |
| S48-T2-A-E2 | Retro replace: missing source_version ≠ colisión; `latest` ≠ `-v3` |
| S48-T2-A-E3 | Retro expand: RESTORE vs DEDUP; cuál detiene promote del índice |
| S48-T2-B-E2 | Retro replace: inventar `cache_invalidated=True` peor que MISSING |
| S48-T3-A-E1 | Retro: score ponderado; por qué d1 vence a d2 con 0.6/0.4 |
| S48-T3-A-E2 | Retro replace: híbrido no inventa PASS si d1 débil en ambos canales |
| S48-T3-B-E1 | Retro: triple claims⊆cited∧ACL∧tokens; tokens 4000 → PASS o ABSTAIN? |
| S48-T3-B-E2 | Retro replace: missing max ≠ claim sin cita; no inventar tope |
| S48-T4-A-E2 | Retro replace: flag ausente ≠ flag False |
| S48-T4-B-E1 | Retro: AND de umbrales; faith alto + support False → ABSTAIN sin castigo |
| S48-T4-B-E2 | Retro replace: support ausente no es ABSTAIN automático → TUNE |

### Explicit non-goals (honored)
- No rename of `id: ai-governance` / filename
- No canonical output or assert edits
- No reopening of starter `# DEFECT` patterns
- No E1–E3 code fade rewrite (documented Master section pattern)
- Hints E2/E3 left dense (optional P2; Master-tolerant)
- youDo frame left as-is (R2 score A)
- E3 units already A with self-check left (except T2-A-E3 length expand)

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT` | **Unchanged** |
| You Do starter / rubric | **Unchanged** |
| `instruction` / `feedback` / `why` / `preamble` / `title` | **Unchanged this round** (R2 scope = retros only) |

## Validation
- Units with expanded/replaced retrospective: **21** (4 iDo + 1 P1 T4-A-E1 + 1 P1-optional T2-B-E1 + 14 other weDo E1/E2 + T2-A-E3)
- Self-check `Pregunta:` present across expanded E1/E2/iDo retros and prior E3 retros (**28** hits in source)
- `npx tsc --noEmit`: clean (exit 0)
- No generators used

## Residual risks (post R2 fix)
1. **Code fade E1→E3 still regular** (invert predicate → assess → decide): mitigated by scene-specific preambles and self-checks; not rewritten this round.
2. **Hints E2/E3** remain near full-rule (optional polish); acceptable at Master.
3. **Id `ai-governance`** still mismatches content; out of exercise-pedagogy scope.
4. **Verdad vacua T4-A:** prose now insists on `bool(ids)` + injection-as-data in E1; solution already correct — learner who only adds subset without empty check still fails fixture.
5. **ABSTAIN ≠ fallo personal:** T4-B retros preserve non-punitive tone.
6. True newbie + Master density: verbal scaffolding is now strong; code remains predicate-heavy by design.

## Files touched
1. `src/lib/course/sections/s48-ai-governance.ts` (retrospective fields only this round)
2. This report: `round2/S48_PEDAGOGY_FIXER_REPORT.md`

Section 48 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
