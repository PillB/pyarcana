# S49 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Agentes, herramientas y context engineering
- **shortTitle:** Agentes y tools
- **id:** `data-contracts` (archivo `s49-data-contracts.ts`; contenido = agentes acotados, tools SRP, context engineering y HITL — no “data contracts” tabulares)
- **source:** `src/lib/course/sections/s49-data-contracts.ts`
- **review input:** `round2/S49_EXERCISE_PEDAGOGY_REPORT.md`
- **scope residual:** P1 desacoplar feedback/retro en 5 E3 de alto eco + P2 expandir retros E1/E2 (self-check) e iDo cortas; **0 P0**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-2 unit ledger (priority: 5 P1 E3, then high-risk E1/E2 T1-A / T2-B / T4-B, then batch E1/E2 + short iDo).
- Hand-edited pedagogical prose in `s49-data-contracts.ts` — unit by unit, no bulk template across sections.
- **No** generators, loops, or scripts to manufacture prose.
- **No** code, starter, solution, output, title, preamble, or instruction changes.
- P1 E3: rewrote **both** `feedback` and `retrospective` so lead sentences differ (feedback = routing rule; retro = principle + misconception + self-check).
- Validated with E3 lead-echo check and `tsc --noEmit`.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (coverage from R1; quality tightened R2)
- [x] We Do has short `title` (unchanged this round)
- [x] `instruction` is task-only (unchanged)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` clean)
- [x] No rubber-stamp: E3 feedback/retro lead sentences are distinct

## What changed (Round 2 residual only)

### Pattern applied
- **P1 E3:** feedback names CONTINUE/breach/uncertainty codes with gate impact; retrospective carries principle + classical error + `Pregunta:` without repeating the feedback lead.
- **P2 E1/E2:** expand or replace short retros to ~40–60 w with one self-check; missing ≠ breach where relevant.
- **iDo:** expand short T1-B / T2-A retros with one self-check.

### P1 (feedback/retro decoupling — high eco)
| Unit | Change |
|------|--------|
| **S49-T2-B-E3** | Feedback: call limpia / DENY política / CLASSIFY antes de retry. Retro: key⇒un effect; dump de secreto / re-write sin store; self-check attempts=2 effects=1 |
| **S49-T3-A-E3** | Feedback: CONTINUE con JIT+checkpoint+provenance; overflow→COMPACT; huérfanos→RETRIEVE. Retro: elegir hechos, no maximizar tokens; self-check cuatro condiciones de `context_ok` |
| **S49-T3-B-E3** | Feedback: CONTINUE solo con críticos+retención+LKG `cp-*`; drop→RESTORE; sin campo→REVIEW. Retro: review humano vs restore automático; self-check prefijo LKG |
| **S49-T4-A-E3** | Feedback: CONTINUE bajo meta/techos; STOP con razón; missing max→ASK_FOR_SCOPE. Retro: inventar techo vs reducir scope; self-check tres contadores |
| **S49-T4-B-E3** | Feedback: CONTINUE sandboxed; breach→SANDBOX; sin evidencia de replay→REQUEST_HUMAN. Retro: recovery sin re-ejecutar effects; puente S50; self-check approval ligada a la acción |

### I Do (2 short retros expanded)
| Unit | Change |
|------|--------|
| S49-T1-B-DEMO | Retro expand: while con factura; self-check scores `[0.4,0.5]` + max_iters=2 → STOP token |
| S49-T2-A-DEMO | Retro expand: SRP auditable; self-check `raw` en schema impide auditar side effect |

Left as-is (R2 score A / none residual): T1-A-DEMO, T2-B-DEMO, T3-A-DEMO, T3-B-DEMO, T4-A-DEMO, T4-B-DEMO.

### We Do E1/E2 (+ light T2-A-E3)
| Unit | Change |
|------|--------|
| S49-T1-A-E1 | Retro: cuatro anclas; starter True cuando conviene KEEP; self-check PASS ≠ anti-IA |
| S49-T1-A-E2 | Retro replace: missing agent_success ≠ path abierto; no inventar 0.8; orden missing vs pred |
| S49-T1-B-E1 | Retro: cota + eval + outputs==plan; self-check por qué outputs==plan |
| S49-T1-B-E2 | Retro replace: no STOP por campo ausente; self-check assess sin evaluator_pass |
| S49-T2-A-E1 | Retro: schema `{case_id}` + typed + no side_effect; self-check responsibilities=1 schema raw |
| S49-T2-A-E2 | Retro: self-check typed_errors ausente → MISSING (no DISABLE) |
| S49-T2-A-E3 | Feedback desacoplado (promote silencioso del registry); retro self-check `{raw}` intacto |
| S49-T2-B-E1 | Retro: cinco puertas; attempts puede ser 2; self-check secret dump |
| S49-T2-B-E2 | Retro replace: no inventar retryable; orden missing vs tool_call_ok |
| S49-T3-A-E1 | Retro: tokens+JIT+checkpoint+provenance; self-check qué falta además de tokens≤max |
| S49-T3-A-E2 | Retro: self-check solo falta provenance → MISSING |
| S49-T3-B-E1 | Retro: puertas budget/no_prod_write; self-check `<=` ⊆ |
| S49-T3-B-E2 | Retro: self-check solo falta LKG → MISSING |
| S49-T4-A-E1 | Retro: meta + tres contadores; self-check goal_met=False |
| S49-T4-A-E2 | Retro: self-check falta max_cost_pen → MISSING |
| S49-T4-B-E1 | Retro: HITL contextual + five gates; self-check replayed=2 con approval |
| S49-T4-B-E2 | Retro: self-check falta replayed_effects → MISSING |

Left as-is (already A with self-check): T1-A-E3, T1-B-E3.

### Explicit non-goals (honored)
- No rename of `id: data-contracts` / filename
- No canonical output or assert edits
- No reopening of starter `# DEFECT` patterns
- No E1–E3 code fade rewrite (documented Master section pattern)
- Hints E2/E3 left dense (optional P2; Master-tolerant)
- youDo frame left as-is (R2 score A)
- Instruction template wording left (optional P2 variety)

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT` | **Unchanged** |
| You Do starter / rubric | **Unchanged** |
| `instruction` / `preamble` / `title` / `why` | **Unchanged** |
| `feedback` | **Changed only** on P1 E3 units + light T2-A-E3 (decouple leads) |
| `retrospective` | **Changed** on all listed units above |

## Validation
- P1 E3 units with decoupled feedback+retro: **5** (T2-B, T3-A, T3-B, T4-A, T4-B)
- Additional units with expanded/replaced retrospective: **19** (2 iDo + 16 weDo E1/E2 + T2-A-E3 feedback)
- Lead-echo check on all 8 E3: **sameLead=false** for every unit
- `npx tsc --noEmit`: clean (exit 0)
- No generators used

## Residual risks (post R2 fix)
1. **Code fade E1→E3 still regular** (invert predicate → assess → decide): mitigated by scene-specific preambles, decoupled E3 closes, and self-checks; not rewritten this round.
2. **Hints E2/E3** remain near full-rule (optional polish); acceptable at Master.
3. **Id `data-contracts`** still mismatches content; out of exercise-pedagogy scope.
4. **Action-code density** (KEEP_DETERMINISTIC_WORKFLOW, etc.): intro + preambles already translate; retros now reinforce missing≠breach without new jargon dumps.
5. **Instruction template** across E2/E3 still stable (optional wording variety not done — low impact vs feedback/retro).
6. True newbie + Master density: verbal scaffolding is now strong; code remains predicate-heavy by design.

## Files touched
1. `src/lib/course/sections/s49-data-contracts.ts` (feedback on 6 E3/E3-adjacent units; retrospectives on 21 units)
2. This report: `round2/S49_PEDAGOGY_FIXER_REPORT.md`

Section 49 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
