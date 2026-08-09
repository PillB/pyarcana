# S50 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Evals, red teaming y fiabilidad de IA
- **id:** `tech-leadership`
- **source:** `src/lib/course/sections/s50-tech-leadership.ts`
- **index:** 50
- **counts:** iDo 8, weDo 24, youDo 1

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and `round2/S50_EXERCISE_PEDAGOGY_REPORT.md`.
- Applied residual P2 prose fixes **by hand** only in Section 50.
- No generators, loops, templates, bulk search-replace of pedagogical prose, or cross-section paste.
- Code/outputs/asserts untouched.
- Scope: expand/replace short or feedback-echoing `retrospective` fields with principle + misconception + self-check + transfer cue.

## Fixes applied

### iDo demos (7 of 8)
| Unit | Change |
|------|--------|
| S50-T1-A-DEMO | Unchanged (Round-2 **A**; already in range with self-check) |
| S50-T1-B-DEMO | Expanded retro: outcome 3 + `export_csv` = P0; self-check “usuario contento” |
| S50-T2-A-DEMO | Expanded: ensemble ≠ oráculo; coincidencias/n; self-check adjudicación |
| S50-T2-B-DEMO | Expanded: AND de anclas+gap+holdout; self-check gap 0.02 + holdout tocado |
| S50-T3-A-DEMO | Expanded: injection ≠ exfil; self-check texto limpio + `sk-live` en salida |
| S50-T3-B-DEMO | Expanded: corpus = datos; self-check retrieval vs política de permisos |
| S50-T4-A-DEMO | Expanded: abstain válido; self-check support 0.1 / thr 0.5 |
| S50-T4-B-DEMO | Expanded: multi-eje + restart hope; self-check p95 800 + rollback 60 |

### weDo E1/E2 (16) + short E3 (2)
| Unit | Change |
|------|--------|
| S50-T1-A-E1 | Retro: basura comparable + self-check coverage 39/40 PASS |
| S50-T1-A-E2 | Retro: schema vs contenido; no rellenar holdout a mano; orden missing/slices |
| S50-T1-A-E3 | Unchanged (**A**) |
| S50-T1-B-E1 | Retro: gate S49 + self-check process=1 |
| S50-T1-B-E2 | Retro: outcome 3 no absuelve forbidden_tool |
| S50-T1-B-E3 | Unchanged (**A**) |
| S50-T2-A-E1 | Retro: coincidencias/n; self-check disagree_idx [2] |
| S50-T2-A-E2 | Retro: no clip 1.2→1.0; RECALIBRATE vs MISSING |
| S50-T2-A-E3 | Unchanged (**A**) |
| S50-T2-B-E1 | Retro: \|AB−BA\| not sum; self-check gap 0.02 + holdout_touched |
| S50-T2-B-E2 | Retro: anclas 0.92 no salvan holdout tocado |
| S50-T2-B-E3 | Expanded: SEAL ≠ INVALIDATE; puente youDo |
| S50-T3-A-E1 | Retro: no unificar security_ok |
| S50-T3-A-E2 | Retro: injection libre + task_pass alto → qué token gana |
| S50-T3-A-E3 | Unchanged (**A**) |
| S50-T3-B-E1 | Retro: write_denied con grant admin |
| S50-T3-B-E2 | Retro: missing requested ≠ asumir read |
| S50-T3-B-E3 | Expanded (prioridad R2): REDUCE vs QUARANTINE; no CONTINUE con fe |
| S50-T4-A-E1 | Retro: umbral `>=` en 0.5 exacto |
| S50-T4-A-E2 | Retro: unsupported_critical=2 no se promedia |
| S50-T4-A-E3 | Unchanged (**A**) |
| S50-T4-B-E1 | Retro: snapshot 850/…/60/10 → ROLLBACK |
| S50-T4-B-E2 | Retro: missing RTO ≠ p95 2500 |
| S50-T4-B-E3 | Unchanged (**A**) |
| youDo | Unchanged (**A**) |

### Not changed (by design)
- **Code / starter / solution / output / asserts** — none
- **Titles, preambles, instructions, feedback, hints** — already pass Round-2 structure; optional E2 skeleton polish deferred (retros address eco)
- **Cosmetic code notes** (anchor_3 “al SLA”, ALLOWED `search_sla`) — optional; not applied
- **E3 units already A** — left intact to avoid re-templating strong transfer prose
- **Hints spoiler reduction** — optional Master-tier; skipped

## Acceptance checklist
- [x] Every non-trivial unit has `preamble` + `retrospective` (fields present from R1; retros tightened in R2)
- [x] We Do has short `title`
- [x] `instruction` is task-only
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source is valid TypeScript object (string-only field edits)

## Residual risks (post-fix)
1. E2/E3 **instruction** skeletons still share a structural mold (missing first → predicate → print). Pedagogically correct; only prose variation would require more surgical instruction rewrites if a future review flags clone feel aloud.
2. Hints E2/E3 still almost state the full rule (Master density OK).
3. Demo vs We Do cosmetic mismatches (anchor text, ALLOWED set, T4-B simplified ops) remain documented; not pedagogy blockers.
4. Internal id `tech-leadership` vs title “evals/red team” unchanged (out of campaign scope).
5. Domain vocabulary (holdout, order bias, trajectory) stays dense for pure-Python newbies — intentional for Master phase.

## Summary
- **25 retrospectives** hand-expanded/replaced (7 iDo + 16 weDo E1/E2 + 2 weDo E3).
- **0 code/output** changes.
- Round-2 P2 residual (eco feedback/retro, short metacognition, missing self-check) addressed unit-by-unit without bulk paste.

---

Section 50 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
