# S41 Pedagogy Fixer Report (Round 2)

## Section
- **title:** APIs con FastAPI y contratos HTTP
- **id:** `llm-finetuning`
- **source:** `src/lib/course/sections/s41-llm-finetuning.ts`
- **Round-2 review:** `round2/S41_EXERCISE_PEDAGOGY_REPORT.md`
- **Method:** hand edits only; no generators, bulk templates, or scripts for prose

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (already present; residual polish applied)
- [x] We Do has short `title`
- [x] `instruction` is task-only (not touched; already steps-only)
- [x] Exact outputs preserved (no code/output changes)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Changes applied

### P2 — de-echo weDo retrospectives (priority eco units)

Feedback kept as *why the starter failed + client/OpenAPI/gate impact*. Retrospective rewritten to *principle + distinct misconception or self-check + transfer*:

| Unit | Retro focus after fix |
|------|------------------------|
| **T1-A-E2** | Matriz create (POST+/jobs+201); self-check 201+GET → breach |
| **T1-B-E1** | Key=candado, body=llave; defect `key+len`; self-check replay+len(store) |
| **T1-B-E2** | No inventar version/cursor; self-check `offset:20` ≠ keyset |
| **T2-A-E1** | Dominio sin status/GLOBAL; self-check dos lambdas = DI |
| **T2-A-E2** | Métricas = proxies; self-check TestClient + FastAPI en dominio |
| **T3-A-E2** | Flags de capacidad documentados; self-check PASS con kind=io |
| **T3-B-E2** | Budgets invertidos matan cancel interno; MISSING vs inventar closed |
| **T4-A-E2** | Unit-only no atrapa 200 en create; merge block si seed http falla |
| **T4-B-E1** | Remaining solo en allow; 429 → `retry_after_s`; self-check used=110 |
| **T4-B-E2** | Edge multi-criterio; self-check prefijo `tr-` en trace |

### P2 — short feedback expanded (+1 frase de impacto)

| Unit | Addition |
|------|----------|
| **T1-B-E2** | Cursor keyset + “cliente no debe ver segundo job” |
| **T1-B-E3** | Token de lab explícito; CONTINUE solo predicado E2 |
| **T2-B-E3** | “No merges un 200 con secret para depurar” |
| **T3-A-E2** | Event loop no aguanta score pesado |
| **T3-A-E3** | Incertidumbre durable ≠ CONTINUE |
| **T3-B-E3** | RECALCULATE exige rehacer cascada con evidencia |
| **T4-A-E3** | e2e solo no localiza 200 en create |
| **T4-B-E3** | INSPECT revisa consumer v1 + traza antes de promover |

### P2 — iDo why / retrospective (T1-B → T4-B)

| Demo | Change |
|------|--------|
| **T1-B-DEMO** | Retro + self-check `len(store)==1` |
| **T2-A-DEMO** | Retro + self-check dominio + `Request` |
| **T2-B-DEMO** | Why + “testeable sin red”; retro + self-check FastAPI 422 |
| **T3-A-DEMO** | Retro + self-check status `queued` |
| **T3-B-DEMO** | Retro + close-only-on-ok misconception + self-check trace vs email |
| **T4-A-DEMO** | Retro + self-check 200-en-create → contract |
| **T4-B-DEMO** | Retro + self-check `trace_id` como campo de compat |

### P2 — typo

| Unit | Change |
|------|--------|
| **T2-B-E3** preamble | “redacting/rechaza” → “redacta/rechaza” |

### Not changed (by design)

- **Code / solution outputs:** all canonical PASS lines and assess/decide triples unchanged.
- **youDo:** retrospective already complete (~66 w); `readiness()` asserts untouched.
- **Units scored A with no residual** (T1-A-DEMO, T1-A-E1, T1-A-E3, T2-A-E3, T2-B-E1/E2, T3-A-E1, T3-B-E1, T4-A-E1, etc.): left as-is.
- **File id `llm-finetuning`:** naming debt outside exercise prose (orchestrator scope).
- **E3 instructions ~17 w:** left minimal (transfer-appropriate; optional residual).

## Residual risks (post-fix)

1. Filename/id `llm-finetuning` still mismatches “APIs FastAPI” content — not exercise quality.
2. Lab tokens (`REPLAY_STORED_RESPONSE`, `THIN_THE_HANDLER`, …) remain lab-only; preambles/intro still anchor this.
3. Homogeneous E2/E3 assess/decide skeleton across 8 subtemas: scenes differ; risk of “invert the if” without reading domain remains inherent to the lab pattern.
4. Some weDo retros now meet the 40–80 w intent via principle + self-check; a few optional A-units still sit slightly under floor by design (not re-expanded).

## Delta vs Round-2 review

| R2 residual | Status |
|-------------|--------|
| P2 eco feedback≈retro (T1-B-E1/E2, T3-B-E2, T4-A-E2, T4-B-E1/E2 + neighbors) | **Closed** |
| P2 feedback &lt;25 w (~8 units) | **Closed** |
| P2 iDo why/retro T1-B→T4-B | **Closed** |
| P2 typo T2-B-E3 “redacting” | **Closed** |
| P0/P1 integrity / missing fields | **N/A** (none in R2) |
| Optional E3 instruction length | **Deferred** (transfer purity) |

## Validation

- Manual re-read of edited preambles/feedback/retrospectives against PEDAGOGY_EXERCISE_SPEC §4–6.
- Spot-check: no `redacting` leftover; eco pairs de-echoed; self-checks present on priority units.
- `npx tsc --noEmit` → exit 0.
- No code or output diffs.

---

Section 41 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
