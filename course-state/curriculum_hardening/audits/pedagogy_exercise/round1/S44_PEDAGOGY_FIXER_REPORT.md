# S44 Pedagogy Fixer Report (Round 1)

## Section
- **title:** CI/CD y seguridad de la cadena de suministro
- **id:** `multimodal` (index 44; archivo histórico `s44-multimodal.ts`)
- **source:** `src/lib/course/sections/s44-multimodal.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-1 review:** `S44_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 unit ledger
- Hand-wrote `preamble` / `retrospective` / We Do `title` / stepped `instruction` / stronger `feedback` / expanded `why` for every unit
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
| S44-T1-A-DEMO | preamble (certificar antes de SBOM), expanded why (AND barato→caro), retrospective (OR no es gate) |
| S44-T1-B-DEMO | preamble (cache ≠ evidencia), expanded why (digest+retención), retrospective (cache hit ≠ build OK) |
| S44-T2-A-DEMO | preamble (token atacante), expanded why (40 hex / rotar), retrospective (tag flotante) |
| S44-T2-B-DEMO | preamble (binario huérfano), expanded why (len set==1), retrospective (no reutilizar SBOM) |
| S44-T3-A-DEMO | preamble (mismo digest), expanded why (rebuild niega), retrospective (no reconstruir “por seguridad”) |
| S44-T3-B-DEMO | preamble (canary mide RTO), expanded why (dual hold/rollback), retrospective (no ampliar con error alto) |
| S44-T4-A-DEMO | preamble (notes on-call 02:00), expanded why (cuádruple operativo), retrospective (no marketing) |
| S44-T4-B-DEMO | preamble (no continue-on-error), expanded why (block+evidencia), retrospective (re-lanzar silencioso) |

### We Do (24) — P0 + P2 feedback
Every unit received hand-written:
1. `title`
2. `preamble` (contexto / meta / éxito / límites)
3. stepped `instruction` (task-only)
4. `retrospective` (principle + misconception + transfer)
5. stronger `feedback` (razonamiento anclado a Piura / gate codes)

| Batch | Units |
|-------|-------|
| T1-A | E1 AND+matriz, E2 PASS/FAIL_CI_GATE/MISSING, E3 CONTINUE/FAIL/REVIEW_MATRIX |
| T1-B | E1 artifact verificable, E2 DISCARD/MISSING conditions, E3 INSPECT_WORKFLOW_CONDITION |
| T2-A | E1 pin SHA + least privilege, E2 REVOKE/MISSING review, E3 SECURITY_APPROVAL |
| T2-B | E1 un digest, E2 REJECT_ATTESTATION, E3 REBUILD_PROVENANCE |
| T3-A | E1 mismo digest + approval, E2 DENY_PROMOTION, E3 REQUEST_RELEASE_APPROVAL |
| T3-B | E1 canary/RTO, E2 ROLLBACK_RELEASE, E3 PAUSE_CANARY |
| T4-A | E1 branch+notes, E2 BLOCK_UNREVIEWED, E3 COMPLETE_RELEASE_NOTES |
| T4-B | E1 critical+block, E2 STOP_SILENT_FAILURE, E3 ASSIGN_INCIDENT_OWNER |

**P2 polish applied:** all 24 We Do feedback strings replaced the meta-phrase «explica qué campo…» with concrete gate reasoning (0 leftovers of that pattern).

### You Do (1) — P1
- Added `retrospective` (defense: invariante / sintético vs real / impacto 30s gate CP-N4-B)
- Light `context` close (BLOCKED hasta enlazar archivos)
- `portfolioNote` + pregunta de defensa oral (digest testeado == promovido)

## Code / output integrity
- **No** starter/solution code or output strings modified
- Defects in starters left intentional (pedagogical)
- You Do starter still starts evidence flags at False (BLOCKED by design)

## Residual risks (for Round 2)
1. Section `id: "multimodal"` vs content CI/CD remains product debt (out of scope; routing legacy)
2. Homogeneous assess/decide code pattern is intentional; Round 2 should spot-check preamble domain differentiation (matriz vs pin vs canary) remains distinct
3. Audience Master: preambles translate jerga (attestation, RTO) but still assume GHA/SLSA familiarity from theory
4. You Do bootstrap is long; retrospective anchors defense without new code requirements
5. Field length variance: some preambles are bullet lists (spec-allowed); Round 2 may tighten word counts if UI feels dense

## Validation
- Field counts: preamble **32** (8 iDo + 24 weDo); retrospective **33** (+ youDo); We Do exercise titles **24** (plus code `title` strings unchanged)
- Generic feedback leftovers of «explica qué campo…»: **0**
- `npx tsc --noEmit -p .` → exit 0

---

Section 44 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
