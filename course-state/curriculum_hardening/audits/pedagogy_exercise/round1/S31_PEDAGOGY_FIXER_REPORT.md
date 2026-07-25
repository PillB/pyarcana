# S31 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Grafos y evidencia relacional
- **id:** `streaming-data` (index 31; archivo histórico `s31-streaming-data.ts` — contenido = grafo de evidencia relacional CP-N3-B, no streaming de datos)
- **source:** `src/lib/course/sections/s31-streaming-data.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-1 review:** `S31_EXERCISE_PEDAGOGY_REPORT.md`

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
| S31-T1-A-DEMO | preamble (schema mínimo owns/shared_phone/transfer), expanded why (dirección/peso/unidades), retrospective (peso ≠ veredicto) |
| S31-T1-B-DEMO | preamble (multiaristas + latest sin borrar detalle), expanded why (provenance/auditoría), retrospective |
| S31-T2-A-DEMO | preamble (tablas→grafo; shared phone ≠ parentesco), expanded why (nodo contacto), retrospective |
| S31-T2-B-DEMO | preamble (agregado + records), expanded why (ambas capas), retrospective |
| S31-T3-A-DEMO | preamble (path reproducible + hop limit), expanded why (sorted vecinos), retrospective |
| S31-T3-B-DEMO | preamble (estructura no culpa), expanded why (disclaimer), retrospective |
| S31-T4-A-DEMO | preamble (seed + ego-k), expanded why (subgrafo de caso), retrospective |
| S31-T4-B-DEMO | preamble (PII = incidente), expanded why (redact + records), retrospective |

### We Do (24) — P0
Every unit received hand-written:
1. `title`
2. `preamble` (contexto / meta / éxito / límites)
3. stepped `instruction` (task-only)
4. `retrospective` (principle + misconception + transfer)
5. stronger `feedback` (reasoning anchored to desk de investigación / revisor / gate ético)

| Batch | Units |
|-------|-------|
| T1-A | E1 modelo owns+shared_phone, E2 out-strength, E3 directed/undirected+etypes |
| T1-B | E1 multi-count por par, E2 ventana temporal, E3 gate provenance |
| T2-A | E1 owns ordenadas, E2 shared contact not_parentesco, E3 unión nodos |
| T2-B | E1 colapso canónico post-ER, E2 agregar con records, E3 invariante sum(n)==detail |
| T3-A | E1 grado no dirigido, E2 componentes, E3 BFS path A→D |
| T3-B | E1 deg/(n−1)+guilt False, E2 hub INF-/PER-, E3 high-degree+etypes |
| T4-A | E1 ego k=1/2, E2 invariantes self/w/prov, E3 build idempotente dirigido |
| T4-B | E1 redact email, E2 evidence por hop, E3 render vs summarize |

**P2 polish applied:** feedback on all 24 units replaced generic *«Compara tu salida con la solución.»* with unit-specific reasoning (~25–60 words).

### You Do (1) — P1
- Added `retrospective` (defense: invariante+test / PII sintético vs real / impacto medible 30s; grafo explica, no sentencia)
- `context` / objectives / requirements / rubric / starter left intact (already solid CP-N3-B frame)

## Code / output integrity
- **No** starter/solution code or output strings modified
- Defects in starters left intentional (empty edges, `ok` always False, ego returns seed only, decide always render, self-loop, etc.)
- Key oracles left intact: `n_nodes 3`/`n_directed 1`, `top B`/`5.0`, `pair E1 E2`, `all_ok False`, `not_parentesco`, `canonical_edges [('E1','E2')]`, `guilt False`, `INF-PAY`, `only_transfer False`, `has_D_k2 False`, `no_self False`, `idempotent True`, `an***@example.pe`, `n5000 summarize`

## Residual risks (for Round 2)
1. Section `id: "streaming-data"` / filename `s31-streaming-data.ts` vs content grafos CP-N3-B remains product debt (out of scope; routing legacy)
2. Hints E1 nearly-solution remain acceptable for guided; E3 hints still give formulas (transfer scaffold OK per review)
3. You Do starter is long multi-function skeleton; retrospective anchors defense without new code requirements
4. Round 2 should spot-check E1/E2/E3 fade remains distinct in prose (hand-written transfer cues)
5. Feedback lengths are enriched but not re-audited word-by-word against the 25–60 band for every unit
6. Ethics gate (path ≠ fraude/parentesco; centralidad ≠ culpa) is preserved in all new prose — Round 2 should re-confirm no regression

## Validation
- Field counts: preamble 32 (8 iDo + 24 weDo); retrospective 33 (+ youDo); exercise-level titles 24 weDo
- Generic feedback leftover: 0
- `npx tsc --noEmit -p .` → exit 0
- Spot assertions: all weDo blocks contain title/preamble/instruction/retrospective/feedback; all iDo contain preamble/retrospective/why; youDo has retrospective

## Anti-aberration
Hand-crafted Peruvian professional Spanish only. No scripts/loops/templates to manufacture educational prose. Measurement scripts used only for field counts and compile.

Section 31 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
