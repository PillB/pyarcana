# S38 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Concurrencia, observabilidad y workflows resilientes
- **id:** `performance-extreme` (index 38)
- **source:** `src/lib/course/sections/s38-performance-extreme.ts`
- **counts:** iDo 8, weDo 24, youDo 1
- **Round-1 review:** `S38_EXERCISE_PEDAGOGY_REPORT.md`

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 unit ledger
- Hand-wrote `preamble` / `retrospective` / We Do `title` / stepped `instruction` / stronger `feedback` / expanded `why`
- No generators, no bulk templates, no cross-section copy-paste of prose
- Preserved all solution outputs (no integrity fixes required)
- Validated optional schema fields already in `src/lib/types.ts`; `tsc --noEmit` PASS

## Acceptance checklist
- [x] Every non-trivial unit has `preamble` + `retrospective` (youDo: retrospective only; context already frames)
- [x] Every We Do has short `title` (4–12 words)
- [x] `instruction` is task-only steps (E1 names defect; E2 less breadcrumb; E3 transfer surface)
- [x] Outputs preserved (no code/output changes)
- [x] Spanish PE; no real PII; fixtures CASO-LIM-038 / c-synth-1
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## What was fixed

### I Do (8) — P1
| Unit | Changes |
|------|---------|
| S38-T1-A-DEMO | preamble (bound medido vs moda); expanded why (wall/cpu/GIL); retrospective (async en CPU) |
| S38-T1-B-DEMO | preamble (IPC + PII); expanded why (json bytes + compact); retrospective |
| S38-T2-A-DEMO | preamble (maxsize política); expanded why (put_nowait/Full, bucket estático); retrospective |
| S38-T2-B-DEMO | preamble (sin timeout → hang); expanded why (finally + on_fail); retrospective |
| S38-T3-A-DEMO | preamble (o11y + corr); expanded why (tres pilares, pii_raw); retrospective |
| S38-T3-B-DEMO | preamble (SLO + error budget); expanded why (SLI vs acción); retrospective |
| S38-T4-A-DEMO | preamble (crash/resume); expanded why (last_done vs resume_from); retrospective |
| S38-T4-B-DEMO | preamble (retry vs DLQ); expanded why (backoff + runbook); retrospective |

### We Do (24) — P0
Every unit received hand-written:
1. `title`
2. `preamble` (contexto / meta / éxito / límites)
3. stepped `instruction` (task-only)
4. `retrospective` (principle + misconception + transfer)
5. stronger `feedback` (razonamiento anclado a c-synth-1 / gate CP-N3-C)

| Batch | Units |
|-------|-------|
| T1-A | E1 processes en CPU, E2 async en I/O, E3 measure_first |
| T1-B | E1 JSON IPC, E2 GIL limited, E3 compact_payload |
| T2-A | E1 token bucket rate=2, E2 maxsize=50, E3 ban_risk |
| T2-B | E1 timeout/on_fail, E2 finally close, E3 open_runbook |
| T3-A | E1 corr en scored, E2 tres pilares, E3 pii_raw + email |
| T3-B | E1 redact teléfono, E2 multi-SLI, E3 error budget freeze |
| T4-A | E1 estados + failed, E2 idem_key:ver, E3 resume NEXT |
| T4-B | E1 backoff 0.8, E2 poison→DLQ, E3 runbook restart_worker |

**Diferenciación consciente:**
- T1-A E1/E2: preambles anclan features densas vs normalización red (no clones simétricos en prosa)
- T3-A-E3 vs T3-B-E1: email + pii_raw vs teléfono con máscara distinta
- T2-A: bucket didáctico estático nombrado en preamble (sin refill por ventana)

### You Do (1) — P1
- Added `retrospective` de defensa (invariante apply_once + resume; real vs sintético; frase de impacto 30s ante CP-N3-C / S39)
- `context` / objectives / requirements / rubric / starter left intact

## Code / output integrity
- **No** starter/solution code or output strings changed
- Spot-checked oracles: `processes`/`bound cpu`, `bytes 31`, `ban_risk True`, `open_runbook`, `0.8`, `c-synth-1:features:v3`, runbook `restart_worker`

## Residual risks (for Round 2)
1. Playground sin pools reales: contratos modelados sin Thread/ProcessPoolExecutor en browser — intencional; You Do pide ensayo local
2. Token bucket estático: preambles aclaran didáctico; prod rellena por ventana
3. Hints E1 casi-solución permanecen aceptables para guided; E3 hints aún dan fórmulas
4. Feedback enriquecido; no re-auditoría palabra-a-palabra del band 25–60 en cada unidad
5. You Do denso: retrospective ancla defensa oral sin nuevos requisitos de código

## Validation
- Field counts: preamble **32** (8 iDo + 24 weDo); retrospective **33** (+ youDo); exercise-level titles **24** weDo
- `npx tsc --noEmit -p .` → exit 0
- Completeness script: all weDo have title/preamble/instruction/retrospective/feedback; all iDo have preamble/retrospective/why; youDo has retrospective

---

Section 38 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
