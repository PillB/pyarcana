# S39 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Responsible ML Case Triage y cierre de nivel
- **id:** `integrator-phase2`
- **source:** `src/lib/course/sections/s39-integrator-phase2.ts`
- **Round-2 review:** `round2/S39_EXERCISE_PEDAGOGY_REPORT.md`
- **Method:** hand edits only; no generators, bulk templates, or scripts for prose

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (already present; residual polish applied)
- [x] We Do has short `title`
- [x] `instruction` is task-only (not rewritten; already steps-only)
- [x] Exact outputs preserved (no code/output changes)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Changes applied

### P0 / P1
None required by Round-2 review. Field coverage, E1→E2→E3 fade, and canonical outputs already solid.

### P2 — iDo retrospectives expanded (self-check + transfer)

| Unit | Retro focus after fix |
|------|------------------------|
| **T1-B-DEMO** | Owner + semver = evolución; self-check bump si `graph_schema` elimina nodo |
| **T2-A-DEMO** | Packet ≠ score suelto; self-check capacity 3 con dos `queue_now` |
| **T2-B-DEMO** | HITL auditado; self-check `human=None` con score 0.9 |
| **T3-A-DEMO** | Release firmable; self-check `secrets_in_repo=True` con resto verde |
| **T3-B-DEMO** | Incident vs drift; self-check solo-drift → `abstain_more` no rollback ciego |
| **T4-A-DEMO** | Expediente ≠ cierre de nivel; self-check revisor CF-3 ante auto-PASS |
| **T4-B-DEMO** | Cards + valor + blameless; self-check `blameless=False` en `postmortem_ready` |

**T1-A-DEMO** left as-is (already A; no residual).

### P2 — weDo retros: de-echo + length + self-check

Feedback kept as *why the bug/policy failed*. Retrospective rewritten or expanded to *principle + distinct misconception + self-check + transfer*:

| Unit | Change |
|------|--------|
| **T1-A-E1** | Frontera orden + `needs_review` + `auto_fraud False`; self-check ER después del grafo |
| **T1-A-E2** | Tres tokens = tres tickets; no clonar «señales distintas» del feedback; self-check no inventar `fraud_certainty` |
| **T1-A-E3** | Self-check missing stages ≠ claim de familia |
| **T1-B-E1** | Breaking → major + owner; self-check quién recibe semver en on-call |
| **T1-B-E2** | Staffing vs semver (no eco «chequeos independientes»); self-check owner vacío + major |
| **T1-B-E3** | Liberar entero o escalar (no clonar «conjunto / off-by-one»); self-check CF-3 mira owners |
| **T2-A-E1** | Cuatro piezas mínimas; self-check score 0.99 con `evidence=[]` |
| **T2-A-E2** | Missing vs incomplete + self-check empty vs omitido |
| **T2-A-E3** | Self-check no inventar `in_distribution` para capas |
| **T2-B-E1** | Precedencia humana expandida (~13 w → full); self-check override sin cambiar final |
| **T2-B-E2** | Apelación ≠ reopen mágico; self-check mismo revisor no basta |
| **T3-A-E1** | `not secrets` en el `all`; self-check AUC no limpia secreto |
| **T3-A-E2** | Missing pide control / secrets rechaza violación; self-check RBAC vs API key |
| **T3-B-E1** | Orden de `if`s = política; self-check throughput en human_only |
| **T3-B-E2** | Tabla runbook (no eco «drift reduce / incident corta»); self-check ambos True |
| **T3-B-E3** | Rollback versionado vs inventar id; self-check REQUEST sin prev |
| **T4-A-E1** | String exacto del producto; self-check `auto_fraud_ok` no basta |
| **T4-A-E3** | Demo OOD + self-check `ood_abstain` vs alias vago |
| **T4-B-E1** | Paquete model/data/system; self-check card `ops` no compensa system |
| **T4-B-E2** | Valor = cola (override_rate, tiempo); self-check solo `auc=0.91` |

### Not changed (by design)

- **Code / starter / solution outputs:** all canonical fixtures, asserts, and fail-closed tokens intact (`CASO-LIM-039`).
- **youDo:** already A (§8.3 defensa); no preamble field; retrospective left alone.
- **Units already A / no residual required:** T1-A-DEMO, T3-A-E3, T4-A-E2, T4-B-E3, T2-B-E3 (optional only).
- **Instruction / preamble / titles / feedback:** not bulk-rewritten; feedback remains bug-local.
- **Fade E1→E2→E3:** surfaces already distinct; expansions do not clone prompts.
- **T3-B-E1/E2 code solape:** out of scope for prose fix (R2 residual risk).

## Residual risks (post-fix)

1. **Densidad N3:** S39 integra S27–S38; preambles mitigan, pero saltar theory sigue siendo un riesgo de diseño de cierre de nivel.
2. **Longitud formal vs anti-bloat:** retros ahora con principle + misconception + self-check + bridge; no se inflaron preambles a ensayos.
3. **T2-B-E3 leakage_care:** rama en solution no ejercitada en prints; edgeCases ya la documentan; outputs no tocados.
4. **Outputs canónicos:** sin execute-and-diff — no se alteró código.

## Delta vs Round-2 review

| R2 residual | Status |
|-------------|--------|
| P0/P1 | N/A (ninguno) |
| P2 retros E1 muy cortas (T2-B-E1, T3-A-E1/E2, T3-B-E1, T4-A-E1, T4-B-E1) | **Closed** |
| P2 eco feedback≈retro (T1-A-E2, T1-B-E2/E3, T2-B-E2, T3-B-E2/E3, T4-B-E2) | **Closed** |
| P2 iDo retros cortas (7 DEMOs) | **Closed** |
| P2 opcional self-check E3 (T1-A, T2-A, T4-A) | **Closed** |
| Code/output changes | **None** (as directed) |

## Anti-aberration attestation

- Hand-written replacements only on `retrospective` strings in `s39-integrator-phase2.ts`.
- No generators, loops, templates, or bulk search-replace of pedagogical content across sections.
- Spec length targets respected in spirit (stronger sentences, self-check, no filler essays).

---

Section 39 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
