# S46 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Ingeniería de datos y orquestación de producción
- **shortTitle:** Data eng producción
- **id:** `gpu-computing` (archivo `s46-gpu-computing.ts`; contenido = pipeline de datos de producción — **no** “GPU computing”)
- **source:** `src/lib/course/sections/s46-gpu-computing.ts`
- **review input:** `round2/S46_EXERCISE_PEDAGOGY_REPORT.md`
- **scope residual:** P1 metacognición/eco severo + P2 polish de longitud y de-echo; **0 P0**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-2 unit ledger (9 P1 + P2 polish list).
- Hand-edited `retrospective` and selected `feedback` strings in `s46-gpu-computing.ts` — unit by unit, domain-anchored (watermark ≠ DAG ≠ merge ≠ SLO), no bulk pedagogical templates across sections.
- **No** generators, loops, or scripts to manufacture prose.
- **No** code, starter, solution, or canonical output changes.
- Validated with self-check presence (`Pregunta:`) and `tsc --noEmit`.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (coverage from R1; retros quality tightened)
- [x] We Do has short `title` (unchanged)
- [x] `instruction` is task-only (unchanged)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` clean)

## What changed (Round 2 residual only)

### Pattern applied
Each rewritten retrospective keeps **principle + misconception + transfer**, adds a **self-check** (`Pregunta:`) distinct from the unit’s `feedback`, and anchors a Huancayo / CP-N4-B verb unique to the subtopic. Feedback expanded only where R2 marked eco or sub-floor length.

### P1 — We Do (9) — retro replace / de-echo
| Unit | Change |
|------|--------|
| S46-T2-A-E2 | Retro replace: tipado ≠ orden topológico; self-check raw→clean→raw “¿quién termina primero?”; feedback light + MISSING branch |
| S46-T2-B-E2 | Retro replace: solape **medido** half-open; self-check rango [1,4]∩[3,6] |
| S46-T3-A-E1 | Retro replace: tres conjunciones + impacto “casi bien”; self-check owner vacío |
| S46-T3-A-E2 | Retro replace: contenido vs control; self-check por qué no MISSING→QUARANTINE; feedback de-echo |
| S46-T3-B-E2 | Retro replace (era ~15 w): MISSING control vs OPEN facet; self-check “solo falta owner” |
| S46-T3-B-E3 | Retro replace: TRACE runbook vs OPEN; self-check tres campos al post mortem; feedback keep distinct |
| S46-T4-A-E3 | Retro replace: REVIEW diseño vs REBUILD materializado + evidencia youDo; feedback de-echo |
| S46-T4-B-E2 | Retro replace: evidencia numérica + un ticket multi-hecho; self-check sli+actions |
| S46-T4-B-E3 | Retro replace: ACTIVATE vs DECLARE + RTO en portfolio; feedback de-echo |

### P2 — I Do retros (7)
| Unit | Change |
|------|--------|
| S46-T1-B-DEMO | Expand: flag del broker + self-check retry True infla métrica |
| S46-T2-A-DEMO | Expand: Kahn `seen == len` + self-check reejecuciones infinitas |
| S46-T2-B-DEMO | Expand: half-open + self-check partición 12:00 |
| S46-T3-A-DEMO | Expand: dos QUARANTINE + self-check case_id roto |
| S46-T3-B-DEMO | Expand: facet mínimo + self-check run- prefix |
| S46-T4-A-DEMO | Expand: delta medido + self-check CP-N4-B |
| S46-T4-B-DEMO | Expand: SLI vs SLO + self-check rto 90 con sli bonito |

Left as-is (R2 **A** / none residual): **S46-T1-A-DEMO**, **youDo**.

### P2 — We Do remaining (E1/E2/E3 polish)
| Unit | Change |
|------|--------|
| S46-T1-A-E1 | Retro expand + self-check et=105 ALLOWED_LATE |
| S46-T1-A-E2 | Retro replace: política vs frescura + self-check gracia inventada |
| S46-T1-B-E1 | Retro expand: cadena + self-check checkpoint=0 |
| S46-T1-B-E2 | Retro replace: REPLAY vs MISSING + self-check viernes 18:00 |
| S46-T1-B-E3 | Feedback expand (piso); retro ligera para no eco |
| S46-T2-A-E1 | Retro expand: independientes + self-check Kahn seen |
| S46-T2-A-E3 | Feedback expand; retro self-check Huancayo |
| S46-T2-B-E1 | Retro expand: half-open borde OK |
| S46-T2-B-E3 | Feedback expand estado vs plan |
| S46-T3-A-E3 | Feedback expand CONTINUE conditions |
| S46-T3-B-E1 | Retro expand eslabones + ticket sin inputs |
| S46-T4-A-E1 | Retro expand small_files en contrato |
| S46-T4-A-E2 | Retro replace: diseño del techo vs REBUILD |
| S46-T4-B-E1 | Feedback + retro expand postmortem_actions=0 |

### Explicit non-goals (honored)
- No rename of `id: gpu-computing` / filename (out of exercise-pedagogy scope)
- No canonical output or assert edits; **16 tautologías** `meets_contract = ('x'=='x')` left (optional P2)
- No E1–E3 code fade rewrite (isomorfismo de código deliberado; fade de decisión ya real)
- No youDo scaffold rewrite (retro de defensa ya A)
- Hints E2/E3 left dense (Master-tolerant optional polish)
- Títulos E3 no tocados (3er token opcional)

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT` | **Unchanged** |
| You Do starter / rubric / retrospective | **Unchanged** |
| `instruction` / `why` / `preamble` / titles | **Unchanged** (R2 scope = retros + selective feedback) |

## Validation
- Units with expanded/replaced retrospective: **~30** (7 iDo + ~23 weDo touched; youDo/T1-A-DEMO left)
- Self-check `Pregunta:` count in section file: **30**
- Retrospective fields: **33** (8 iDo + 24 weDo + 1 youDo)
- `npx tsc --noEmit`: clean (exit 0)
- No generators used

## Residual risks (post R2 fix)
1. **Code fade E1→E3 still regular** (invert predicate → assess → decide): mitigated by scene-specific preambles and self-checks; not rewritten this round.
2. **Hints E2/E3** remain near full-rule (optional polish); acceptable at Master.
3. **Id `gpu-computing`** still mismatches content; out of exercise-pedagogy scope.
4. **Tautologías meets_contract** in 16 E2/E3 solutions: low priority print-theater; tokens de salida intactos.
5. **Watermark/gracia lab ≠ Flink completo:** retros no overclaim cluster/Beam.
6. True newbie + Master density: verbal scaffolding is now strong; code remains set/predicate-heavy by design.

## Files touched
1. `src/lib/course/sections/s46-gpu-computing.ts` (`retrospective` + selective `feedback` only)
2. This report: `round2/S46_PEDAGOGY_FIXER_REPORT.md`

Section 46 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
