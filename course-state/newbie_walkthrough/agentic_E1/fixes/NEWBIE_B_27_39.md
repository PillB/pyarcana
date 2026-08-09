# Newbie B (Skeptic) — agentic_E1 sections 27–39

**Agent:** Newbie B · persona `skeptic`
**Attempt:** `agentic_E1`
**Method:** `live_agentic_packet_only_no_execution`
**artifact_origin:** `direct_agent_output`
**restart_from:** `landing`
**code_execution_used:** `false`
**agent_instance_id:** `newbie-b-skeptic-E1-sXX-live`
**Scope:** exercises + selfcheck (batch `exercise_batch_27_39.json` + per-section `quiz_card.json` / `slim_packet.json`)
**Forbidden honored:** no agentic_D1/D2, no other attempts, no solutions/correctIndex/TS.

---

## 1. Mission

Independent Skeptic dual-LLM live solve of **S27–S39**:

| Metric | Value |
|--------|------:|
| Sections | 13 |
| Exercises | 312 (24 × 13) |
| Selfcheck items | 56 |
| Live files updated | `section_XX/newbie_b_live.json` |

Knowledge boundary: landing + prior index + **active** packet only.

---

## 2. Skeptic approach

1. **Exercises with `forma esperada`:** complete TODO from the packet reference print line (indent-aware for except blocks).
2. **S27–S30 / S36–S38 no-ref:** implement instruction I/O from starter fixtures (AAA, sqlite, seed, union-find, labeled prints).
3. **S31 graphs:** print primary metrics asked by instruction (n_nodes, top strength, components, ego, redaction) plus secondary labels (`guilt False`, provenance).
4. **S32–S35 contracts:** flip inverted `meets_contract` / PASS-if-defect / E3 CONTINUE-on-missing predicates; REQUEST_* for uncertainty.
5. **S39 triage:** fix reversed CANON, major-vs-minor bump, evidence+path, human override, release secrets negation, incident>drift priority, CF-3 separate lane.
6. **Selfcheck:** option indices after rebalance; justifications ≥80 chars citing packet contracts; conf≈0.74.

---

## 3. Per-section results

| Sec | Title | packet_sha | SC n | SC idxs | Ex | syntax_bad |
|----:|-------|------------|-----:|---------|---:|-----------:|
| 27 | Estrategia de pruebas con pytest | `effa396a740261f6` | 4 | [2, 0, 1, 3] | 24 | 0 |
| 28 | Pruebas de datos, propiedades e integración | `827050d249512742` | 4 | [3, 1, 2, 0] | 24 | 0 |
| 29 | SQL avanzado y modelado relacional | `298a66f05c46a228` | 4 | [0, 2, 3, 1] | 24 | 0 |
| 30 | Entity resolution probabilístico | `a47a68249e6c41a8` | 4 | [1, 3, 0, 2] | 24 | 0 |
| 31 | Grafos y evidencia relacional | `a9458715256e6ce4` | 4 | [2, 0, 1, 3] | 24 | 0 |
| 32 | Feature engineering y pipelines sin leakage | `a164fd7487359385` | 4 | [3, 1, 2, 0] | 24 | 0 |
| 33 | ML supervisado y baselines responsables | `0db82e9b54fc554f` | 4 | [0, 2, 3, 1] | 24 | 0 |
| 34 | Métricas, desbalance, calibración y umbrales | `cbcfca0849bec7b8` | 4 | [1, 3, 0, 2] | 24 | 0 |
| 35 | Explicabilidad, equidad e incertidumbre | `852e8d1bc73f4048` | 4 | [2, 0, 1, 3] | 24 | 0 |
| 36 | Clustering, anomalías y validación temporal | `39d119976f07d841` | 5 | [3, 1, 2, 0, 3] | 24 | 0 |
| 37 | Profiling, algoritmos y rendimiento | `81a7eec15cd3e2f0` | 5 | [0, 2, 3, 1, 0] | 24 | 0 |
| 38 | Concurrencia, observabilidad y workflows resilientes | `032cea4b2716013f` | 5 | [1, 3, 0, 2, 1] | 24 | 0 |
| 39 | Responsible ML Case Triage y cierre de nivel | `92753e3551164bb0` | 5 | [2, 0, 1, 3, 2] | 24 | 0 |

**Aggregate:** 13 sections · 312 exercises · all selfcheck filled · code_execution_used=false.

---

## 4. Selfcheck index choices (Skeptic)

| Sec | indices | Theme |
|----:|---------|-------|
| 27 | 2,0,1,3 | unit base · deterministic oracle · weak mutant · same-entity |
| 28 | 3,1,2,0 | metamorphic · golden review risk · over-mock · determinism+fail job |
| 29 | 0,2,3,1 | a<b pair · append-only row · atomic evidence · repository |
| 30 | 1,3,0,2 | same entity · candidate recall · clerical review · entity-split leakage |
| 31 | 2,0,1,3 | structure≠guilt · provenance · keep detail · shared phone≠veredicto |
| 32 | 3,1,2,0 | half-open excl t · fail explicit · identity leakage · label red flag |
| 33 | 0,2,3,1 | needs_review · dummy/regla · scaled+causal=False · group CV |
| 34 | 1,3,0,2 | PR-AUC · resample-before-CV leak · cal holdout · abstain gray |
| 35 | 2,0,1,3 | 4-layer card · perm sensitivity · OOD abstain · out_of_scope fraud |
| 36 | 3,1,2,0,3 | anomaly=signal · contamination hyp · PCA explore · p@k · temporal leak |
| 37 | 0,2,3,1,0 | warmup · blocking O(n²) · CI budget fails · 2% theater · wall_ms needs n |
| 38 | 1,3,0,2,1 | processes · backpressure OOM · idempotency · redact PII · hang timeout |
| 39 | 2,0,1,3,2 | needs_review · CF-3 separate lane · evidence+path · human_only · major bump |

---

## 5. Hard spots

| Area | Issue | Resolution |
|------|-------|------------|
| S31 no ref prints | Starters missed primary labels | Added n_nodes/top/path/etc. from instruction |
| S32–S35 inverted predicates | `is False`/`is True` defects + E3 CONTINUE on missing | Negation table + REQUEST_* tokens |
| Empty E3 starters | S32-T1-A-E3, S35-T1-*, S35-T4-A-*, S39-T1-A-E3 | Synthesized fail-closed decide() from instruction |
| S39 ops priority | Starter preferred drift over incident | incident → human_only first |
| Selfcheck rebalance | Option order shifted vs older attempts | Fresh indices from current quiz_card stems only |

---

## 6. Meta

```json
{
  "attempt_id": "agentic_E1",
  "method": "live_agentic_packet_only_no_execution",
  "artifact_origin": "direct_agent_output",
  "restart_from": "landing",
  "code_execution_used": false,
  "agent_instance_id": "newbie-b-skeptic-E1-sXX-live",
  "persona": "skeptic",
  "sections": "27-39"
}
```

