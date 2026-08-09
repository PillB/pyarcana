# S28 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Pruebas de datos, propiedades e integración
- **id:** `llm-agents` (index 28; archivo histórico `s28-llm-agents.ts` — contenido = QA de datos del motor ER: propiedades, goldens, dobles e integración — no agentes LLM)
- **source:** `src/lib/course/sections/s28-llm-agents.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-1 review:** `S28_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 unit ledger
- Hand-wrote `preamble` / `retrospective` / We Do `title` / stepped `instruction` / stronger `feedback` / expanded `why`
- No generators, no bulk templates, no cross-section copy-paste of prose
- Preserved all solution `code` / `output` strings (no integrity code changes)
- Validated optional schema fields already in `src/lib/types.ts`; `tsc --noEmit` PASS

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
| S28-T1-A-DEMO | preamble (seed+bucle vs literal), expanded why (propiedad desde invariante), retrospective |
| S28-T1-B-DEMO | preamble (oráculo por relación), expanded why (metamórfica ≠ casefold a secas), retrospective |
| S28-T2-A-DEMO | preamble (fail-closed legible), expanded why (lista de errores), retrospective |
| S28-T2-B-DEMO | preamble (drift visible > golden silencioso), expanded why (PR desk PE), retrospective |
| S28-T3-A-DEMO | preamble (sin red ni reloj real), expanded why (inyección de dobles), retrospective |
| S28-T3-B-DEMO | preamble (no mockees lo que pruebas), expanded why (overmock falso positivo), retrospective |
| S28-T4-A-DEMO | preamble (integración real vs print teatral), expanded why (sqlite análogo testcontainers), retrospective |
| S28-T4-B-DEMO | preamble (flake = diseño incorrecto), expanded why (seed+sorted; retry ≠ fix), retrospective |

### We Do (24) — P0
Every unit received hand-written:
1. `title`
2. `preamble` (contexto / meta / éxito / límites)
3. stepped `instruction` (task-only)
4. `retrospective` (principle + misconception + transfer)
5. stronger `feedback` (reasoning anchored to desk ER / gate de merge / revisor de golden)

| Batch | Units |
|-------|-------|
| T1-A | E1 re-seed por muestra, E2 invariante scores [0,1], E3 test_normalize_idempotent seed+N |
| T1-B | E1 Jaccard simétrico, E2 metamórfica upper, E3 simetría all-pairs |
| T2-A | E1 id requerido, E2 score fuera de rango, E3 dirty rows de validate |
| T2-B | E1 detectar drift, E2 blocked sin approved, E3 versión+acción |
| T3-A | E1 fake DB e1, E2 ISO corta FakeClock, E3 retry 5xx/timeout |
| T3-B | E1 casefold bilateral, E2 detector weak, E3 efecto de estado (no calls) |
| T4-A | E1 SELECT COUNT real, E2 C(n,2), E3 reanudación+NFC |
| T4-B | E1 sorted vs golden, E2 fail_job flake_rate, E3 run(seed) determinista |

**P2 polish applied:** feedback on all 24 units enriched with desk ER / CI gate / revisor reasoning (~25–60 words where thin).

### You Do (1) — P1
- Added `retrospective` (defense: invariante+seed / blocked_drift / impacto medible + límite matching≠fraude; defensa 30s propiedades→schema/golden→dobles→sqlite→determinismo)
- `context` / objectives / requirements / rubric / starter left intact (already solid checklist)

## Code / output integrity
- **No** starter/solution code or output strings modified
- Defects in starters left intentional (pedagogical)
- Key oracles spot-checked present: `True`/`False`, `id requerido`, `score`, `drift`, `blocked`, `Ana`, `2026-07-20`, `retry`, `weak`, `1`+`Ana`, `6`, `fail_job`, `idempotent_ok True` / `n_cases 10`

## Residual risks (for Round 2)
1. Section `id: "llm-agents"` / filename `s28-llm-agents.ts` vs content QA de datos ER remains product debt (out of scope; routing legacy)
2. Hints E1 nearly-solution remain acceptable for guided; E3 hints still give formulas (transfer scaffold OK per review)
3. You Do starter is long multi-file skeleton; retrospective anchors defense without new code requirements
4. Round 2 should spot-check E1/E2/E3 fade remains distinct in prose (hand-written transfer cues)
5. Feedback lengths are enriched but not re-audited word-by-word against the 25–60 band for every unit

## Validation
- Field counts: preamble 32 (8 iDo + 24 weDo); retrospective 33 (+ youDo); exercise-level titles 24 weDo
- `npx tsc --noEmit -p .` → exit 0
- Spot assertions: all weDo blocks contain title/preamble/instruction/retrospective/feedback; all iDo contain preamble/retrospective/why; youDo has retrospective

## Anti-aberration
Hand-crafted Peruvian professional Spanish only. No scripts/loops/templates to manufacture educational prose. Measurement scripts used only for field counts and compile.

Section 28 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
