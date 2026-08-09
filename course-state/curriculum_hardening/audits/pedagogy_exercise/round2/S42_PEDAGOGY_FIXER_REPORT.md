# S42 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Schemas, seguridad y privacidad de servicios
- **shortTitle:** Schemas y seguridad
- **id:** `graph-rag` (archivo `s42-graph-rag.ts`; contenido = control plane fail-closed — schemas, authz, SSRF/path, secretos, minimización y purga — **no** “Graph RAG”)
- **source:** `src/lib/course/sections/s42-graph-rag.ts`
- **review input:** `round2/S42_EXERCISE_PEDAGOGY_REPORT.md`
- **scope residual:** P2 prose only (metacognición); **0 P0 / 0 P1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-2 unit ledger (severity E1/E2 retros that echo feedback; short iDo retros T1-B-DEMO / T3-B-DEMO).
- Hand-edited **only** `retrospective` strings in `s42-graph-rag.ts` — unit by unit, no bulk replace of pedagogical templates across sections.
- **No** generators, loops, or scripts to manufacture prose.
- **No** code, starter, solution, or output changes.
- Validated with self-check presence (`Pregunta:`) and `tsc --noEmit`.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (unchanged coverage from R1; retros quality tightened)
- [x] We Do has short `title` (unchanged)
- [x] `instruction` is task-only (unchanged)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` clean)

## What changed (Round 2 residual only)

### Pattern applied
Each expanded retrospective keeps **principle + misconception + transfer**, and adds a **self-check** distinct from the unit’s `feedback` (so the solution panel does not re-read the same sentence).

### I Do (2)
| Unit | Change |
|------|--------|
| S42-T1-B-DEMO | Retro expanded: rename/tag huérfano + self-check (¿por qué falta `amount` debe fallar de verdad?) |
| S42-T3-B-DEMO | Retro expanded: conjunción de controles + self-check (deps unpinned → promote?) |

Left as-is (R2 score A / none residual): T1-A, T2-A, T2-B, T3-A, T4-A, T4-B demos.

### We Do E1/E2 (14)
| Unit | Change |
|------|--------|
| S42-T1-A-E1 | Retro: solo `required.issubset` vs extra/status; self-check warning vs REJECT_SCHEMA |
| S42-T1-A-E2 | Retro replace: incompleto ≠ ataque; self-check orden missing vs extras |
| S42-T1-B-E1 | Retro: triple aditivo invertido en starter; self-check tag `push` sin handler |
| S42-T1-B-E2 | Retro replace: VERSION vs MISSING; self-check rename no es MISSING |
| S42-T2-A-E1 | Retro: binding + starter abre caso ajeno; self-check user-a→user-b status |
| S42-T2-A-E2 | Retro replace: DENY vs MISSING:roles; self-check ¿roles faltantes = DENY? |
| S42-T2-B-E1 | Retro: tres puertas + shared-admin; self-check por qué no rol «de confianza» |
| S42-T2-B-E2 | Retro replace: multi-falla invalid; self-check ¿basta una puerta? |
| S42-T3-A-E1 | Retro: size+host+path conjuntos; self-check host metadata con path limpio |
| S42-T3-B-E1 | Retro: un hallazgo bloquea; self-check `rotation_tested` vs wiki |
| S42-T3-B-E2 | Retro replace: ROTATE vs MISSING scan; self-check qué pide ASSESS |
| S42-T4-A-E1 | Retro: tres condiciones de inventario; self-check full_name de más |
| S42-T4-A-E2 | Retro replace: no inventar 30 días; self-check quién firma el techo |
| S42-T4-B-E1 | Retro: purga completa; self-check snapshot.csv vivo |
| S42-T4-B-E2 | Retro replace: email en audit rompe CP-N4-A; self-check reaparición |

### Explicit non-goals (honored)
- No rename of `id: graph-rag` / filename
- No canonical output or assert edits
- No deconstruction of T2-B multi-fail adversarial
- No demo T3-B ↔ E1 five-flag parity force
- No E1–E3 code fade rewrite (documented section pattern)
- Hints E2/E3 left dense (optional P2; Master-tolerant)

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# Defecto didáctico` | **Unchanged** |
| You Do starter / rubric | **Unchanged** |
| `instruction` / `feedback` / `why` / `preamble` | **Unchanged** (R2 scope = retros only) |

## Validation
- Units with expanded/replaced retrospective: **16** (2 iDo + 14 weDo)
- Self-check `Pregunta:` present across E1/E2 expanded retros and prior E3 retros
- `npx tsc --noEmit`: clean (exit 0)
- No generators used

## Residual risks (post R2 fix)
1. **Code fade E1→E3 still regular** (invert predicate → assess → decide): mitigated by scene-specific preambles and self-checks; not rewritten this round.
2. **Hints E2/E3** remain near full-rule (optional polish); acceptable at Master.
3. **Id `graph-rag`** still mismatches content; out of exercise-pedagogy scope.
4. True newbie + Master density: verbal scaffolding is now strong; code remains set/predicate-heavy by design.

## Files touched
1. `src/lib/course/sections/s42-graph-rag.ts` (retrospective fields only)
2. This report: `round2/S42_PEDAGOGY_FIXER_REPORT.md`

Section 42 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
