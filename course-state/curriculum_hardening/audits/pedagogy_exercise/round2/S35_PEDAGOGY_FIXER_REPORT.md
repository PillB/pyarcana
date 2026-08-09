# S35 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Explicabilidad, equidad e incertidumbre
- **id:** `system-design` (contenido CP-N3-C ficha de caso; no “system design” genérico)
- **source:** `src/lib/course/sections/s35-system-design.ts`
- **Round-2 review:** `round2/S35_EXERCISE_PEDAGOGY_REPORT.md`
- **Method:** hand edits only; no generators, bulk templates, or scripts for prose

## Acceptance checklist

- [x] Every unit keeps `preamble` + `retrospective` (coverage already complete post R1)
- [x] We Do has short `title` (untouched)
- [x] `instruction` task-only; T4-B-E1 paso mental removido
- [x] Exact outputs preserved (no code/output/DEFECT changes)
- [x] Spanish PE; no real PII; Red Andina / CASO-LIM-035 intact
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Changes applied

### P0
None. Round-2 confirmed field coverage and canonical outputs closed after Round 1.

### P1 — five guided E1 retrospectives (metacognición fina)

| Unit | Retro after fix |
|------|-----------------|
| **S35-T1-B-E1** | Cálculo value×weight + `causal=False`; misconception “solo flip boolean y dejar contrib en cero”; self-check hardcode vs `shared_phone==0.9` / suma ≈1.0 |
| **S35-T2-A-E1** | Flag desde **n vs min_n**; precision alta no “mejora” low_n; self-check n=100 / precision 0.6 = muestra usable, no “buena equity” |
| **S35-T3-A-E1** | Banda se **calcula** (p±q); `level=toy` honesto; misconception lo=hi=p; self-check hi=0.7 con p=0.6, q=0.1 |
| **S35-T3-B-E1** | Detector OK ≠ política OK; action fail-closed `abstain`; self-check qué capa mientes con label en OOD |
| **S35-T4-A-E1** | `out_of_scope` = fraud_label fuera; misconception predicado invertido; self-check contestability además del set de keys |

### P2 — iDo why (bajo piso) + retrospectives cortas

| Unit | Field(s) | Focus after fix |
|------|----------|-----------------|
| **T1-B-DEMO** | retro | Self-check “causó el riesgo” con contrib 0.9 |
| **T2-A-DEMO** | retro | Self-check AQP n=8 / precision 0.9 — qué afirmar / qué no |
| **T2-B-DEMO** | why + retro | why: daño diferencial ≠ culpa individual; retro: high+review con `means_fraud=False` |
| **T3-A-DEMO** | why + retro | why: no afirmar cobertura con `level=toy`; retro: qué decir al analista con q=0.1 |
| **T3-B-DEMO** | retro | Self-check auto_fraud miente aunque score “seguro” |
| **T4-A-DEMO** | why + retro | why: use=queue_rank único; retro: qué pierde el caso sin contestability |
| **T4-B-DEMO** | why + retro | why: by vacío = sin gobernanza; retro: audit_min vs ts de portfolio |

### P2 — weDo feedback/retro de-echo + instruction

Feedback left as operational anchor (ficha/cola/Red Andina). Retrospective rewritten to principle + distinct misconception + self-check + transfer (no clone of feedback first line):

| Unit | Change |
|------|--------|
| **T1-A-E1** | Retro: ranking global ≠ culpa; self-check amount_7d drop 0.2 |
| **T1-A-E2** | Retro: MISSING drops ≠ flag malo; self-check no inventar MISSING |
| **T1-B-E3** | Retro: montar 4 capas **antes** del gate; self-check REQUEST sin inventar evidence |
| **T2-B-E1** | Retro: listar high ≠ mitigar; self-check filtrar `"med"` |
| **T2-B-E3** | Retro: error CONTINUE sin high_risk / means_fraud=True; self-check REQUEST_PROXY_AUDIT |
| **T3-A-E2** | Retro: q==0 contenido vs faltar q schema; self-check hardcode q en adverso |
| **T3-B-E3** | Retro: `reason=ood` es capa; self-check REQUEST sin inventar z=0 |
| **T4-A-E2** | Retro: faltar out_of_scope es schema; self-check out_of_scope=[] |
| **T4-A-E3** | Retro: build vs validate; self-check no inventar fraud_label con prohibited=[] |
| **T4-B-E1** | Instruction: 3 pasos (assert con by=analyst_7); retro: bool(by) vs `"by" in event` |
| **T4-B-E2** | Retro: MISSING:by vs by=""; self-check por qué la cola no los trata igual |

### Not changed (by design)

- **Code / starter / solution outputs / `# DEFECT:` comments:** all canonical fixtures and asserts intact.
- **youDo:** already A (defensa + fill_* rotos); no residual.
- **Units already A with no residual:** T1-A-DEMO, T1-A-E3, T2-A-E2/E3, T3-A-E3, T3-B-E2, T4-B-E3.
- **Preambles / titles / E1→E3 fade surfaces:** left intact (already differentiated; fail-closed drops/q/by not re-cloned).
- **Hints E1:** left guided (acceptable per R2).

## Residual risks (post-fix)

1. **Prosa vs. código:** no se tocó lógica de solución; outputs canónicos intactos.
2. **Carga cognitiva S35:** preambles no re-enseñan theory; retros añaden self-check sin ensayos.
3. **Fail-closed E3 (T1-A / T3-A / T4-B):** códigos REQUEST distintos preservados; prosa de retro no unifica drops/q/by.
4. **You Do slice/proxy en nota:** sin asserts inventados; portfolioNote + retrospective de defensa intactos.
5. **Longitudes:** retros P1 y demos ahora con principle + misconception + self-check (~40–80 w target); bullets de preamble sin tocar.

## Delta vs Round-2 review

| R2 residual | Status |
|-------------|--------|
| P0 | N/A (ninguno) |
| P1 five E1 retros | **Closed** |
| P2 eco feedback≈retro (lista) | **Closed** |
| P2 iDo retros cortas (7 DEMOs) | **Closed** |
| P2 iDo why bajo piso (T2-B, T3-A, T4-A, T4-B) | **Closed** |
| P2 T4-B-E1 instruction paso mental | **Closed** |
| Hints E1 optional | Left (guided OK) |
| Optional residuals “none required” | Left |

Section 35 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
