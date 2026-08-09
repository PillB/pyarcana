# S47 Grammar & Readability Metrics

- Prose records: 211
- Sentences: 304
- Total words: 3902
- Mean WPS: 12.84 | Mean SPW: 1.672
- Mean Fernández-Huerta: 91.6
- Mean INFLESZ: 87.9
- Findings: {'missing_terminal': 24, 'run_on': 1, 'high_comma_density': 19}
- Severity: {'M': 24, 'H': 1, 'L': 19}
- Composite score: 7.03/10

## Worst 15 sentences by Fernández-Huerta (hardest to read)
- FH=7.8 | W=4 | findings=—
  > Reproducibilidad, lineage y evidencia
- FH=23.8 | W=3 | findings=—
  > Site Reliability Engineering
- FH=24.8 | W=2 | findings=—
  > Contratos verificables
- FH=43.8 | W=3 | findings=—
  > Stdlib-first progressive disclosure
- FH=44.3 | W=9 | findings=—
  > ¿Qué evidencia permite aprobar tracking y reproducibilidad en CASO-TAC-047?
- FH=45.4 | W=7 | findings=—
  > Contrato S47-T2-B: demuestra digest/card/compatibilidad verificados.
- FH=45.7 | W=5 | findings=—
  > Seguridad, privacidad y least privilege
- FH=45.7 | W=5 | findings=—
  > Operación: SLO, observabilidad y rollback
- FH=52.8 | W=4 | findings=—
  > Experiment tracking y deployment
- FH=53.3 | W=31 | findings=—
  > S47-T1-A-E3 · Simula fallo cerrado para `tracking y reproducibilidad` con tres fixtures distintos. `CASO-TAC-047-1A` debe continuar, el adverso debe devolver `MARK_RUN_NONREPRODUCIBLE` y la ausencia de `tolerance` debe devolver `INVESTIGATE
- FH=54.0 | W=7 | findings=['missing_terminal']
  > S47-T1-A · Tracking y reproducibilidad de experiment runs
- FH=54.0 | W=7 | findings=—
  > Salidas exactas: `PASS`, `INVALIDATE_COMPARISON`, `MISSING:baseline`.
- FH=54.0 | W=7 | findings=—
  > S47-T1-B-E3: justifica CONTINUE / INVALIDATE_COMPARISON / RESTORE_LINEAGE.
- FH=57.7 | W=5 | findings=—
  > Building Machine Learning Powered Applications
- FH=58.6 | W=10 | findings=—
  > Registry fail-closed: production exige aprobación explícita y artefactos de gobernanza.

## Longest 15 sentences (by word count)
- W=48 | FH=66.6 | findings=['run_on']
  > En un equipo de producto en Lima o Arequipa que prioriza atención con un ranker sintético, **MLOps** es el día a día: registrar el run, comparar el candidato con baseline en el mismo holdout, promover solo con firma y aprobación, y abrir ca
- W=35 | FH=61.4 | findings=—
  > S47-T2-B-E3 · Recupera fallo cerrado para `artefactos, model card y compatibilidad` con tres fixtures distintos. `CASO-TAC-047-2B` debe continuar, el adverso debe devolver `REJECT_MODEL_ARTIFACT` y la ausencia de `card_sections` debe devolv
- W=35 | FH=63.1 | findings=—
  > S47-T3-A-E3 · Contrasta fallo cerrado para `batch/online y feature consistency` con tres fixtures distintos. `CASO-TAC-047-3A` debe continuar, el adverso debe devolver `DISABLE_INCONSISTENT_SERVING` y la ausencia de `contract_tests` debe de
- W=35 | FH=68.3 | findings=—
  > S47-T3-B-E3 · Instrumenta fallo cerrado para `latency, batching y fallback` con tres fixtures distintos. `CASO-TAC-047-3B` debe continuar, el adverso debe devolver `ACTIVATE_SAFE_FALLBACK` y la ausencia de `fallback_tested` debe devolver `T
- W=34 | FH=69.8 | findings=—
  > S47-T4-A-E3 · Aísla fallo cerrado para `shadow/canary y monitoring hooks` con tres fixtures distintos. `CASO-TAC-047-4A` debe continuar, el adverso debe devolver `STOP_CANARY` y la ausencia de `hooks` debe devolver `COLLECT_MORE_SHADOW_EVID
- W=34 | FH=68.0 | findings=—
  > S47-T4-B-E3 · Demuestra fallo cerrado para `rollback, retirement y audit` con tres fixtures distintos. `CASO-TAC-047-4B` debe continuar, el adverso debe devolver `ROLLBACK_TO_LAST_GOOD` y la ausencia de `audit_entry` debe devolver `REVIEW_R
- W=33 | FH=65.9 | findings=—
  > S47-T1-B-E3 · Extiende fallo cerrado para `data/code/env lineage y comparación` con tres fixtures distintos. `CASO-TAC-047-1B` debe continuar, el adverso debe devolver `INVALIDATE_COMPARISON` y la ausencia de `baseline` debe devolver `RESTO
- W=33 | FH=69.5 | findings=—
  > S47-T2-A-E3 · Defiende fallo cerrado para `firmas, stages y approvals` con tres fixtures distintos. `CASO-TAC-047-2A` debe continuar, el adverso debe devolver `DENY_MODEL_PROMOTION` y la ausencia de `approved` debe devolver `REQUEST_MODEL_A
- W=31 | FH=53.3 | findings=—
  > S47-T1-A-E3 · Simula fallo cerrado para `tracking y reproducibilidad` con tres fixtures distintos. `CASO-TAC-047-1A` debe continuar, el adverso debe devolver `MARK_RUN_NONREPRODUCIBLE` y la ausencia de `tolerance` debe devolver `INVESTIGATE
- W=29 | FH=86.2 | findings=—
  > Se promueve cuando el candidato supera el baseline con datos fijos y el serving respeta el feature contract; si el canary rompe el SLO, se revierte sin borrar evidencia.
- W=29 | FH=86.2 | findings=—
  > Modela presupuesto de tráfico, caída de calidad y hooks: mode full al 100%, quality_delta fuera de presupuesto o hooks apagados detienen el canary aunque el digest sea válido.
- W=27 | FH=99.3 | findings=—
  > Corrige la idea de que «seed=42» basta: el demo exige seed presente, params no vacíos y |metric−rerun| ≤ tolerancia antes de tratar el run como evidencia.
- W=27 | FH=88.2 | findings=—
  > Muestra por qué un score alto en train con code=latest no valida promote: sin lineage completo la comparación se invalida aunque candidate > baseline en el papel.
- W=26 | FH=90.3 | findings=—
  > Separa el digest del gate de gobernanza: la firma se compara con el contrato del servicio (SERVICE_SIG); production sin approved o firma rota deniegan promote.
- W=25 | FH=85.3 | findings=—
  > El dueño de S47-T4-A acepta solo canary con criterio promote/stop; una violación produce `STOP_CANARY` y un registro incompleto produce `COLLECT_MORE_SHADOW_EVIDENCE`.

## High-severity sentences (H findings)
- findings=['run_on']
  > En un equipo de producto en Lima o Arequipa que prioriza atención con un ranker sintético, **MLOps** es el día a día: registrar el run, comparar el candidato con baseline en el mismo holdout, promover solo con firma y aprobación, y abrir canary al 5% con rollback listo.

## Per-record findings

### tagline @line 8
- FH=94.6 W=12 findings=['missing_terminal']
  > Production Data/ML Platform: experimento→servicio con gates, lineage y rollback; CF-4

### jobRelevance @line 15
- FH=66.6 W=48 findings=['run_on']
  > En un equipo de producto en Lima o Arequipa que prioriza atención con un ranker sintético, **MLOps** es el día a día: registrar el run, comparar el candidato con baseline en el mismo holdout, promover solo con firma y aprobación, y abrir ca

### text @line 17
- FH=75.1 W=18 findings=['missing_terminal', 'high_comma_density']
  > Registrar un experiment run con params, métricas, seed, artefactos y versión de dataset, y re-ejecutarlo dentro de tolerancia

### text @line 18
- FH=93.0 W=16 findings=['missing_terminal', 'high_comma_density']
  > Comparar baseline vs candidato solo cuando data, code, env, split y la definición de métrica coinciden

### text @line 19
- FH=85.4 W=14 findings=['missing_terminal']
  > Promover un modelo a Staging solo con firma compatible, stage correcto y aprobación explícita

### text @line 20
- FH=73.6 W=13 findings=['missing_terminal']
  > Publicar artefactos con digest, model card completa y compatibilidad de features train/serve

### text @line 21
- FH=87.4 W=13 findings=['missing_terminal']
  > Garantizar paridad batch/online de features y bloquear serving ante leakage o skew

### text @line 22
- FH=98.3 W=14 findings=['missing_terminal']
  > Mantener p95 bajo SLO, batch acotado y fallback probado antes de servir tráfico real

### text @line 23
- FH=85.4 W=14 findings=['missing_terminal']
  > Desplegar shadow/canary con presupuesto de tráfico, hooks de monitoreo y criterio promote/stop

### text @line 24
- FH=69.0 W=13 findings=['missing_terminal']
  > Ejecutar rollback al last-known-good, retirar versiones y dejar audit_entry sin perder evidencia

### heading @line 28
- FH=101.2 W=8 findings=['missing_terminal']
  > Ruta de S47: MLOps: experimentos, registro y serving

### heading @line 61
- FH=54.0 W=7 findings=['missing_terminal']
  > S47-T1-A · Tracking y reproducibilidad de experiment runs

### heading @line 91
- FH=108.7 W=8 findings=['missing_terminal']
  > S47-T1-B · Lineage data/code/env y comparación honesta

### heading @line 128
- FH=124.6 W=10 findings=['missing_terminal']
  > S47-T2-A · Firmas de I/O, stages del registry y approvals

### heading @line 162
- FH=71.2 W=8 findings=['missing_terminal']
  > S47-T2-B · Artefactos, model card y compatibilidad de features

### heading @line 192
- FH=88.3 W=7 findings=['missing_terminal']
  > S47-T3-A · Paridad batch/online y feature consistency

### content @line 216
- FH=87.4 W=13 findings=['high_comma_density']
  > Sin él corresponde `DISABLE_INCONSISTENT_SERVING` o, si faltan datos, `TRACE_FEATURE_PIPELINE`.

### heading @line 220
- FH=100.7 W=6 findings=['missing_terminal']
  > S47-T3-B · Latencia, batching y fallback seguro

### heading @line 248
- FH=90.7 W=6 findings=['missing_terminal']
  > S47-T4-A · Shadow, canary y monitoring hooks

### heading @line 283
- FH=90.7 W=6 findings=['missing_terminal']
  > S47-T4-B · Rollback, retirement y audit trail

### description @line 318
- FH=71.2 W=8 findings=['missing_terminal']
  > Demo: tracking y reproducibilidad — delta dentro de tolerancia

### description @line 387
- FH=101.2 W=8 findings=['missing_terminal']
  > Demo: digest sha256, features alineadas y card mínima

### description @line 429
- FH=111.0 W=9 findings=['missing_terminal']
  > Demo: p95 bajo SLO, batch acotado y fallback probado

### description @line 449
- FH=112.6 W=10 findings=['missing_terminal']
  > Demo: canary ≤10% con quality_delta, error budget y hooks

### description @line 476
- FH=79.7 W=7 findings=['missing_terminal']
  > Demo: rollback a last-good con retirement auditado

### instruction @line 538
- FH=108.3 W=11 findings=['high_comma_density']
  > Entrada: dict con case_id, seed, params, metric, rerun_metric, tolerance.

### instruction @line 685
- FH=96.7 W=13 findings=['high_comma_density']
  > Entrada: dict con case_id, data, code, env, split, metric_definition, candidate, baseline.

### instruction @line 840
- FH=86.5 W=11 findings=['high_comma_density']
  > Entrada: dict con case_id, input_signature, output_signature, stage, approved.

### hint @line 955
- FH=108.3 W=21 findings=['high_comma_density']
  > El DEFECT aprueba con skew o card incompleta: exige digest sha256:, train_fv==serve_fv y card ⊇ {use,limits,metrics,risks}.

### instruction @line 991
- FH=102.6 W=14 findings=['high_comma_density']
  > Entrada: dict con case_id, artifact_digest, feature_version, serving_feature_version, card_sections.

### instruction @line 1136
- FH=104.6 W=12 findings=['high_comma_density']
  > Entrada: dict con case_id, batch_features, online_features, leakage, contract_tests.

### instruction @line 1281
- FH=115.4 W=14 findings=['high_comma_density']
  > Entrada: dict con case_id, p95_ms, slo_ms, batch_size, fallback, fallback_tested.

### feedback @line 1397
- FH=98.3 W=14 findings=['high_comma_density']
  > S47-T4-A-E1: mode shadow/canary, traffic≤10%, quality y error dentro de presupuesto, hooks on.

### instruction @line 1426
- FH=108.5 W=19 findings=['high_comma_density']
  > Entrada: dict con case_id, mode, traffic_pct, quality_delta, max_quality_drop, error_rate, max_error_rate, hooks.

### feedback @line 1434
- FH=113.8 W=11 findings=['high_comma_density']
  > El adverso viola mode, traffic, quality y error a la vez.

### feedback @line 1542
- FH=86.5 W=11 findings=['high_comma_density']
  > S47-T4-B-E1: current≠last_good, features compatibles, rollback_tested, retired y audit.

### instruction @line 1571
- FH=91.5 W=15 findings=['high_comma_density']
  > Entrada: dict con case_id, current, last_good, compatible_features, rollback_tested, retired, audit_entry.
- FH=106.6 W=10 findings=['high_comma_density']
  > Salidas exactas: `PASS`, `ROLLBACK_TO_LAST_GOOD`, `MISSING:audit_entry`.

### title @line 1678
- FH=94.6 W=10 findings=['missing_terminal']
  > Proyecto: plataforma MLOps de experimentos, registro y serving (CP-N4-B + CF-4)

### context @line 1679
- FH=75.6 W=11 findings=['high_comma_density']
  > Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features.
- FH=64.6 W=10 findings=['high_comma_density']
  > Salida: run comparable, modelo registrado, deployment canary y decisión auditable.

### portfolioNote @line 1741
- FH=75.1 W=18 findings=['high_comma_density']
  > Evidencia de CP-N4-B + CF-4 · modelo promovible y reversible: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual.