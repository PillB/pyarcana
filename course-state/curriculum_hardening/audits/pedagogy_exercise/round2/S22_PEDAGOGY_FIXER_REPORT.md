# S22 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Email, identidad y aprobación humana
- **id:** `rapidfuzz-entity`
- **index:** 22
- **source:** `src/lib/course/sections/s22-rapidfuzz-entity.ts`
- **round2 review:** `round2/S22_EXERCISE_PEDAGOGY_REPORT.md`
- **counts:** iDo 8, weDo 24, youDo 1 (33 units)

## Method
- Re-read `PEDAGOGY_EXERCISE_SPEC.md` and Round-2 residual ledger.
- Applied **hand-written** residual prose only in Section 22 source.
- **No** generators, bulk templates, or cross-section paste.
- Measurement-only word counts after edits; typecheck clean.
- Canonical solution **outputs** and starter defects left intact.

## Round-2 residuals addressed

### P1 — done
| Residual | Action |
|----------|--------|
| We Do retrospectives under 40w | Expanded priority units (T2-B-E1, T3-B-E1, T4-B-E2, T1-A-E1, T1-B-E1, T2-A-E1/E2, T3-A-E1, T4-A-E1, T4-B-E1, plus remaining under-floor after desacoples) |
| Feedback ↔ retrospective echo | Desacoplados: **T4-A-E1**, **T3-B-E2**, **T1-B-E2**, **T2-A-E3**, **T3-B-E1** — feedback keeps immediate corrective; retro = principle + misconception + self-check/transfer |
| E3 hint spoiling | Softened **T2-B-E3**, **T4-B-E3**, **T4-A-E3** (no full f-string / if-else / list-comprehension dump) |

### P2 — done
| Residual | Action |
|----------|--------|
| Thin iDo retrospectives | Expanded **T4-B-DEMO**, **T4-A-DEMO**, **T3-A-DEMO**, **T3-B-DEMO**, plus **T1-B-DEMO**, **T2-A-DEMO**, **T2-B-DEMO** |
| Feedback floor | **T1-B-E3**, **T2-B-E2** polished to ≥25w corrective spine |
| Optional We Do polish | T1-A-E2, T3-A-E2/E3, T4-A-E2, T1-B-E3, T2-B-E3, T4-A-E3, T4-B-E3 retros brought to floor with self-check |

### Left unchanged (by design)
- **You Do** — already A; no residual
- **S22-T1-A-DEMO**, **S22-T1-A-E3**, **S22-T3-B-E3** — none required beyond optional polish already adequate
- All `solutionCode.output` (incl. `0da400d6c9b3f756`, `0.86 match_no_es_fraude`)
- Starter defects, TRANSITIONS, You Do helpers, filename/id `rapidfuzz-entity`

## Unit change ledger (summary)

### I Do retrospectives expanded (7)
- T1-B-DEMO, T2-A-DEMO, T2-B-DEMO, T3-A-DEMO, T3-B-DEMO, T4-A-DEMO, T4-B-DEMO  
- Pattern: principle + misconception + sticky self-check + We Do bridge  
- T1-A-DEMO: no change (already strong)

### We Do — retrospectives expanded / desacoplados
| Unit | Change |
|------|--------|
| T1-A-E1 | Retro to floor + self-check (subtype vs charset) |
| T1-A-E2 | Optional expand + self-check (Disposition header) |
| T1-B-E1 | Retro floor + “¿escape = sanitizador?” |
| T1-B-E2 | **Desacoplar** retro (no “escapa primero” clone); double-escape self-check |
| T1-B-E3 | Feedback floor (phishing interno / allowlist); retro transfer to You Do |
| T2-A-E1 | Retro floor + who applies filter |
| T2-A-E2 | Retro floor + draft-only mesa action |
| T2-A-E3 | **Desacoplar** (clock gate product, not “comparar al revés” echo) |
| T2-B-E1 | Retro floor (HITL / status vs key) |
| T2-B-E2 | Feedback + retro floor (1s past gate) |
| T2-B-E3 | **Hints softened**; retro slight expand |
| T3-A-E1 | Retro floor (forma vs dominio) |
| T3-A-E2 | Optional expand (external domain on C001) |
| T3-A-E3 | Retro floor + HITL gates; **output preserved** |
| T3-B-E1 | **Desacoplar** (orden de To/CC en audit, not dict.fromkeys clone) |
| T3-B-E2 | **Desacoplar** (mutar role vs solo detectar) |
| T4-A-E1 | **Desacoplar** (TRANSITIONS as source of truth / portfolio audit) |
| T4-A-E2 | Optional expand (fail-closed vs “make test pass”) |
| T4-A-E3 | **Hint 2 softened**; retro slight expand |
| T4-B-E1 | Retro floor (separator + slice contract); **hash output preserved** |
| T4-B-E2 | Retro floor (len(store) self-check) |
| T4-B-E3 | **Hints softened**; retro CP-N2-C close |

### Hints replaced (transfer integrity)
```
T2-B-E3: sequential id from len(store); usable = clock + status draft
T4-A-E3: resolve nxt; append from/to/action/actor; filter approve when printing
T4-B-E3: no second draft; create then retry_hit; do not wipe audit
```

## Acceptance checklist (Round 2 Fixer)

- [x] No missing-field regressions (title / preamble / instruction / retrospective still present on all exercise units)
- [x] Worst P1 retros ≥ ~40 words with principle + misconception + transfer/self-check  
  *(measurement: 0/32 iDo+weDo retros under 40w after fix)*
- [x] Echo pairs rewritten so feedback = immediate corrective; retro = metacognitive close
- [x] T2-B-E3 / T4-B-E3 (and T4-A-E3) hints no longer dump full algorithms
- [x] Outputs and starters intact; Spanish PE; synthetic `@example.pe`; no real PII
- [x] No generators; hand-written residual prose only
- [x] Section source typechecks (`tsc --noEmit` clean)

## Residual risks (post-fix)
- E1 guided hints remain near-complete by design (fade); only E3 was de-spoiled.
- T3-A-E3 ethical label and T4-B-E1 hash remain fixture-fragile — prose-only forever.
- Optional iDo preamble lift toward 80w not done (what-to-watch already clear; non-blocking P2).

## Files touched
1. `src/lib/course/sections/s22-rapidfuzz-entity.ts` — residual pedagogy prose + E3 hints  
2. `course-state/curriculum_hardening/audits/pedagogy_exercise/round2/S22_PEDAGOGY_FIXER_REPORT.md` — this report  

---

Section 22 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
