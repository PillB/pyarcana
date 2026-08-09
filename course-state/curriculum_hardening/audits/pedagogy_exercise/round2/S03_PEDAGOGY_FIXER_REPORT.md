# S03 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Decisiones y reglas de validación
- **id:** `data-structures`
- **index:** 3
- **source:** `src/lib/course/sections/s03-data-structures.ts`
- **counts:** iDo 8, weDo 24, youDo 1 (unchanged)
- **basis:** `round2/S03_EXERCISE_PEDAGOGY_REPORT.md` residual P1/P2 only

## Method
- Hand-edited residual units only in Section 3 source.
- No generators, bulk templates, or cross-section paste of pedagogical prose.
- Did **not** reopen pass+ I Do demos or You Do body/rubric/starter policy.
- Solution **outputs** preserved; T3-B-E2 starter loop expanded only (learner-facing defect state).
- Typecheck: `tsc --noEmit` OK. Local Python is 3.9 (no `match`); solution output string re-checked against file contract.

## Acceptance checklist

- [x] Every non-trivial unit already had `preamble` + `retrospective` (R1 complete; R2 polish only)
- [x] We Do units already had short `title`
- [x] `instruction` remains task-only; T3-B-E2 no longer points at “la solución”
- [x] Exact solution outputs preserved
- [x] Professional Peruvian Spanish; no real PII
- [x] No generators used
- [x] Section source typechecks

## Changes by unit

### P1 — S03-T3-B-E2
| Field | Change |
|-------|--------|
| `instruction` | Step 3 lists five codes explicitly; removed “de la solución”. Steps 1–2 name cases with OR / `_`. |
| `starterCode` | Loop expanded to `OK`, `MISSING`, `OUT_OF_RANGE`, `FOO`, `NEEDS_REVIEW`; print shape `c → status` (aligned with solution fixture). Defective `case _ → accept` kept. |
| `feedback` | Corrective path: MISSING/FOO → accept means permissive `_`; default is **review**. |
| `solutionCode.output` | **Unchanged** |

### P2 — Spanish agreement
| Unit | Change |
|------|--------|
| S03-T3-A-E1 `retrospective` | “operaciones aún **puede**” → “**pueden** capturar” |
| S03-T4-B-E1 `preamble` | “operaciones de intake no puede” → “**el equipo de** operaciones de intake **no puede**” (subject–verb agree) |

### P2 — Feedback (non-clone, corrective reasoning)
| Unit | Feedback intent |
|------|-----------------|
| S03-T1-A-E2 | Case-sensitivity / literal `in` vs `==` |
| S03-T1-A-E3 | Crossed `is`/`==` on starter lines + note content |
| S03-T1-B-E1 | Still printing `is not None`; `[0]` vs `range(0)` |
| S03-T2-A-E2 | `good` copied second `if` from `bad` |
| S03-T2-A-E3 | High threshold not first; re-test 0/-3 |
| S03-T3-A-E1 | Hard-reject DEFECT; absence/unknown → review |
| S03-T3-A-E2 | `m <= 0` still rejects zero |
| S03-T3-B-E2 | Permissive `_` / missing OR patterns |
| S03-T3-B-E3 | Missing None guard; match misuse on ranges |
| S03-T4-A-E1 | Crash on `"x"` / empty examples |
| S03-T4-A-E2 | Any-missing → reject without review band |
| S03-T4-A-E3 | Minors still reject under fixed policy |
| S03-T4-B-E1 | Still “Error”/“inválido”; template field+problem+action |
| S03-T4-B-E2 | Prints without expected/assert |
| S03-T4-B-E3 | Still `e > 18`; do not edit expected |

### P2 — Retrospective de-dupe
| Unit | Change |
|------|--------|
| S03-T2-A-E1 | New retrospective: first true branch wins; classic dual-`if` pitfall; self-check 49→reject (no longer clones feedback opener) |

### Optional polish (capacity)
| Unit | Change |
|------|--------|
| S03-T2-B-E1 `instruction` | Four explicit steps (remove truthiness; guard order; dicts; `repr` loop) |
| S03-T4-B-E2 `hint` / `hints[0]` | Frontiers 80 and 50 required in voice (aligned with preamble/solution; no longer “opcional”) |

## Explicit non-changes
- All 8 I Do demos (preamble/why/retrospective/code/output)
- You Do context, objectives, requirements, rubric, retrospective, intentional starter DEFECTs
- Units already scored pass with no residual (e.g. T1-A-E1, T1-B-E2, T1-B-E3, T2-B-E3, T3-A-E3, T3-B-E1)
- Solution `output` strings on every unit

## Validation notes
- **T3-B-E2 starter:** five-code loop is deliberate so success is self-evident without peeking at solution; runtime of completed solution unchanged.
- **Feedback length:** rewritten strings target ~25–60 words (spec band); short prior slogans replaced with if-then corrective paths.
- **Feedback ≠ retrospective:** edited pairs open on different roles (immediate wrong-output signal vs metacognitive close).
- Local shell Python 3.9 cannot execute `match`; contract verified by static string compare of solution `output` field.

## Residual risks (post-fix)
1. Open-ended free text remains (T4-B-E1 messages, T3-B-E3 justification, T4-A-E2 `invariant_text`) — intentional rubric-style.
2. `match` still needs Pyodide/runtime 3.10+; preamble already states it.
3. You Do starter still fails `_run_tests` by design.
4. Section id `data-structures` vs title “Decisiones…” — out of campaign scope.

## Summary counts

| Item | Count |
|------|------:|
| Units touched | 18 |
| P1 units | 1 |
| P2 feedback rewrites | 15 |
| Spanish fixes | 2 |
| Retrospective rewrite | 1 |
| Optional instruction/hint | 2 |
| Solution outputs changed | 0 |

---

Section 3 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
