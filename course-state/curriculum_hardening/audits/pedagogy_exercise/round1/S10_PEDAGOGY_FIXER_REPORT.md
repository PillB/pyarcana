# S10 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Módulos, packaging y CLI profesional
- **id:** `sklearn` (index 10; archivo histórico `s10-sklearn.ts` — contenido packaging/CLI de `familiarity_core`)
- **source:** `src/lib/course/sections/s10-sklearn.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-1 review:** `S10_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 unit ledger
- Hand-wrote `preamble` / `retrospective` / We Do `title` / stepped `instruction` / stronger `feedback` / light `why` / `description` expansions
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
| S10-T1-A-DEMO | preamble, expanded why (guard/__main__), retrospective; description clarified |
| S10-T1-B-DEMO | preamble (fachada 4 símbolos), expanded why (SemVer/_), retrospective |
| S10-T2-A-DEMO | preamble (CP-N1-B layout), expanded why (src vs cwd), retrospective |
| S10-T2-B-DEMO | preamble (major/minor/patch mental check), expanded why + CHANGELOG, retrospective |
| S10-T3-A-DEMO | preamble (subparsers + exit 2), expanded why (main→int), retrospective |
| S10-T3-B-DEMO | preamble (pipe/`jq`), expanded why (stderr redirect), retrospective |
| S10-T4-A-DEMO | preamble (flags>env>default), expanded why (orden canónico + None), retrospective |
| S10-T4-B-DEMO | preamble (validate contextual), expanded why (fail-closed), retrospective |

### We Do (24) — P0
Every unit received hand-written:
1. `title`
2. `preamble` (contexto / meta / éxito / límites)
3. stepped `instruction` (task-only)
4. `retrospective` (principle + misconception + transfer)
5. stronger `feedback` (reasoning, ~25–60 words where thin)

| Batch | Units |
|-------|-------|
| T1-A | E1 API `clean`/`__all__`, E2 util anti-ciclo, E3 import style por kind |
| T1-B | E1 public vs private, E2 fachada normalize/compare, E3 breaking + major |
| T2-A | E1 metadata pyproject, E2 layout src list, E3 diagnose ModuleNotFound |
| T2-B | E1 SemVer classify+bump, E2 runtime vs dev deps, E3 policy hacia S11 |
| T3-A | E1 subcomando report (steps guiados), E2 exit codes 0/1/2, E3 help alineada |
| T3-B | E1 stdout vs stderr, E2 stdin `-` vs path, E3 JSON limpio vs BAD |
| T4-A | E1 traza de precedencia, E2 merge multi-clave, E3 flag vs env con razón |
| T4-B | E1 gitignore secrets vs `.env.example`, E2 validate_config, E3 harden defaults |

**P2 polish applied:** feedback on high-stakes units (T1-A-E1, T2-B-E1, T3-A-E2, T3-B-E3, T4-A-E1, T4-B-E1) expanded with reasoning; E1 argparse instruction now step-by-step (no longer relies only on hints).

### You Do (1) — P1
- Added `retrospective` (defense: invariant / PII-secretos / impacto 30s gate CP-N1-B/C)
- Light `context` close for defensa de 30s
- Objective added: demostrar exit 2 con argv inválido y exit 0 con normalize sintético

## Code / output integrity
- **No** starter/solution code or output strings modified
- Defects in starters left intentional (pedagogical)
- Optional P2 harness alignments (starter case names vs solution) left for Round 2 if verification compares against solution output

## Residual risks (for Round 2)
1. Section `id: "sklearn"` vs content packaging remains product debt (out of scope; routing legacy)
2. Several exercises simulate packaging/layout without a real filesystem — prose frames them as contratos/listas; You Do materializes the package
3. lower vs casefold inconsistency between T1-B-E1 and other units remains (no re-exec/diff forced)
4. You Do bootstrap is long; retrospective anchors defense without new code requirements
5. Round 2 should spot-check E1/E2/E3 fade is still distinct in prose (hand-written transfer cues)

## Validation
- Field counts: preamble 32 (8 iDo + 24 weDo); retrospective 33 (+ youDo); titles 24 weDo (exercise-level)
- `npx tsc --noEmit -p .` → exit 0
- Spot assertions: all weDo blocks contain title/preamble/instruction/retrospective/feedback; all iDo contain preamble/retrospective/why

## Anti-aberration
Hand-crafted Peruvian professional Spanish only. No scripts/loops/templates to manufacture educational prose. Measurement scripts used only for field counts and compile.

Section 10 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
