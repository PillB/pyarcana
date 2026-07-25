# S35 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Explicabilidad, equidad e incertidumbre
- **id:** `system-design` (index 35; archivo histórico `s35-system-design.ts` — contenido = ficha de caso CP-N3-C, no “system design” genérico)
- **source:** `src/lib/course/sections/s35-system-design.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-1 review:** `S35_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 unit ledger
- Hand-wrote `preamble` / `retrospective` / We Do `title` / stepped `instruction` / stronger `feedback` / expanded `why`
- No generators, no bulk templates, no cross-section copy-paste of prose
- Preserved all solution `code` / `output` strings (no integrity code changes)
- Validated optional schema fields; `tsc --noEmit` PASS

## Acceptance checklist
- [x] Every non-trivial unit has `preamble` + `retrospective` (youDo: retrospective only; context already frames)
- [x] Every We Do has short `title` (4–12 words)
- [x] `instruction` is task-only steps (E1 names defect; E2 less breadcrumb; E3 transfer surface)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## What was fixed

### I Do (8) — P1
| Unit | Changes |
|------|---------|
| S35-T1-A-DEMO | preamble (ranking ≠ veredicto de fraude), expanded why (argmax + same metric + means_fraud), retrospective |
| S35-T1-B-DEMO | preamble (aditivo local ≠ SHAP/causa legal), expanded why (v×w + 4 capas), retrospective |
| S35-T2-A-DEMO | preamble (precision alta con n=8 no es paridad), expanded why (low_n + min_n política lab), retrospective |
| S35-T2-B-DEMO | preamble (proxy ≠ label de fraude), expanded why (gap → tag high → review), retrospective |
| S35-T3-A-DEMO | preamble (punto sin ancho engaña; toy ≠ conformal), expanded why (coverage_claim=False), retrospective |
| S35-T3-B-DEMO | preamble (OOD univariante; abstain no auto_fraud), expanded why (reason=ood), retrospective |
| S35-T4-A-DEMO | preamble (card = scope de producto), expanded why (queue_rank + contestability), retrospective |
| S35-T4-B-DEMO | preamble (override sin by no es gobernanza), expanded why (min + portfolio ts/reason), retrospective |

### We Do (24) — P0
Every unit received hand-written:
1. `title`
2. `preamble` (contexto / meta / éxito / límites)
3. stepped `instruction` (task-only)
4. `retrospective` (principle + misconception + transfer)
5. stronger `feedback` (reasoning anclado a ficha CP-N3-C / cola Red Andina / portfolio)

| Batch | Units |
|-------|-------|
| T1-A | E1 ranking max no min, E2 tri-ruta ética, E3 REQUEST_METRIC_DROP (fail-closed drops) |
| T1-B | E1 contrib + causal=False, E2 gate capas, E3 build_ficha transfer |
| T2-A | E1 slice_flag, E2 REJECT_LOW_N_CLAIM, E3 build_slice_report transfer |
| T2-B | E1 high + no auto_label, E2 gate action, E3 build_proxy_audit transfer |
| T3-A | E1 banda p±q, E2 REJECT_POINT_ONLY, E3 REQUEST_INTERVAL (fail-closed q) |
| T3-B | E1 OOD→abstain, E2 REJECT_AUTO_LABEL, E3 build_uncertainty transfer |
| T4-A | E1 card_ok scope, E2 REJECT_SCOPE_BREACH, E3 build_card transfer |
| T4-B | E1 by no vacío, E2 REJECT_SILENT_OVERRIDE, E3 REQUEST_AUDIT_FIELDS (fail-closed by) |

**Fade differentiation:** E3 with real transfer (T1-B, T2-A, T2-B, T3-B, T4-A) preambles stress *ensamblar producto*; E3 fail-closed (T1-A drops, T3-A q, T4-B by) preambles stress REQUEST vs REJECT with distinct evidence.

**P2 polish applied:** feedback on all 24 units anchored to ficha/cola/override (~25–60 words); weDo.intro notes preamble → tarea → retrospective.

### You Do (1) — P1
- Added `retrospective` (defensa: portfolio_ready invariante; caso adverso en nota; frase impacto medible; “explicar no es acusar”)
- `context` / objectives / requirements / rubric / starter left intact (already solid)

## Code / output integrity
- **No** starter/solution code or output strings modified
- Defects in starters left intentional (pedagogical)
- Key oracles spot-checked present: `S35-T*-* PASS`, tríos PASS/REJECT/MISSING, tríos CONTINUE/REJECT/REQUEST, demos `shared_phone 0.1`, `sum 1.0`, `low_n`, `['district_code']`, `0.5 0.7`, `abstain`, `card True`, `audit_min True`

## Residual risks (for Round 2)
1. Section `id: "system-design"` / filename `s35-system-design.ts` vs content “ficha de caso CP-N3-C” remains product debt (out of scope; naming legacy)
2. Cognitive load of 24 We Do: fade E1→E2→E3 is real; Round 2 should confirm preambles stay differentiated (not clones), especially T1-A-E3 / T3-A-E3 / T4-B-E3
3. You Do slice/proxy live in portfolioNote, not code asserts — intentional; retrospective pushes documentation, not new tests
4. S35 assumes S34 workbench vocabulary; preambles give one-hook scene without re-teaching all theory
5. Feedback lengths enriched but not re-audited word-by-word against the 25–60 band for every unit

## Validation
- Field counts: preamble **32** (8 iDo + 24 weDo); retrospective **33** (+ youDo); exercise-level titles **24** weDo
- `npx tsc --noEmit -p tsconfig.json` → exit 0
- Spot assertions: all weDo blocks contain title/preamble/instruction/retrospective/feedback; all iDo contain preamble/retrospective/why; youDo has retrospective; zero remaining dense `instruction: "S35-…` essay patterns

---

Section 35 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
