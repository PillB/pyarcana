import type { CourseSection } from '../../types'

export const section47: CourseSection = {
  id: "opensource",
  index: 47,
  title: "MLOps: experimentos, registro y serving",
  shortTitle: "MLOps serving",
  tagline: "Production Data/ML Platform: experimento→servicio con gates, lineage y rollback; CF-4",
  estimatedHours: 20,
  level: "Master",
  phase: 3,
  icon: "Server",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En un equipo de producto en Lima o Arequipa que prioriza atención con un ranker sintético, **MLOps** es el día a día: registrar el run, comparar el candidato con baseline en el mismo holdout, promover solo con firma y aprobación, y abrir canary al 5% con rollback listo. Se promueve cuando el candidato supera el baseline con datos fijos y el serving respeta el feature contract; si el canary rompe el SLO, se revierte sin borrar evidencia.",
  learningOutcomes: [
    { text: "Registrar un experiment run con params, métricas, seed, artefactos y versión de dataset, y re-ejecutarlo dentro de tolerancia" },
    { text: "Comparar baseline vs candidato solo cuando data, code, env, split y la definición de métrica coinciden" },
    { text: "Promover un modelo a Staging solo con firma compatible, stage correcto y aprobación explícita" },
    { text: "Publicar artefactos con digest, model card completa y compatibilidad de features train/serve" },
    { text: "Garantizar paridad batch/online de features y bloquear serving ante leakage o skew" },
    { text: "Mantener p95 bajo SLO, batch acotado y fallback probado antes de servir tráfico real" },
    { text: "Desplegar shadow/canary con presupuesto de tráfico, hooks de monitoreo y criterio promote/stop" },
    { text: "Ejecutar rollback al last-known-good, retirar versiones y dejar audit_entry sin perder evidencia" },
  ],
  theory: [
    {
      heading: "Ruta de S47: MLOps: experimentos, registro y serving",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Experiment run:** params + metrics + seed + artefactos + dataset version. **Lineage:** data/code/env que produjo el run. **Model registry stage:** None → Staging → Production (con approve). **Model card:** límites, intended use y riesgos. **Feature consistency:** mismas firmas train/serve. **Shadow/canary:** tráfico gradual sin sustituir todo. **Fallback:** modelo o regla previa si p95/errores fallan. **Retirement:** retirar versión con audit, no borrar evidencia.",
        "Esta sección cierra el puente desde lineage de datos (S46) hacia **lineage de modelos y serving**: experiment tracking, model registry, feature store parity y rollout con SLO. Los demos usan **stdlib** al estilo MLflow/registry (sin cluster GPU ni servicios externos). El caso `CASO-TAC-047` (priorización sintética de atención en Tacna) no entrena en GPU ni sube modelos reales.",
        "Producto incremental (una versión del ranker sintético en Tacna recorre toda la sección): **T1** deja un run comparable y un candidato que gana en holdout → **T2** lo registra con firma, card y approve en Staging → **T3** exige paridad batch/online y p95 con fallback → **T4** abre canary al 5% y, si rompe, rollback a last-good con audit. Error de promoción en cualquier tramo: métrica no reproducible, `stage=production` sin approve, leakage train/serve o p95 fuera de SLO sin fallback.",
        "Orden de lectura y lab: T1 runs/métricas → T2 registry/cards → T3 features online/batch → T4 traffic y rollback. Teoría medible, demos con helpers y laboratorio con un defecto de promoción por ejercicio. Stack didáctico: **stdlib** que modela contratos al estilo MLflow/registry sin cluster GPU ni servicios externos obligatorios.",
      ],
      code: {
        language: 'python',
        title: "s47_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-TAC-047",
        "gates": ["repro_metrics", "approve_before_prod", "feature_parity", "rollback_possible"],
        "prod_without_approve_ok": False,
    }

c = section_contract()
print("case", c["case"])
print("gates", ",".join(c["gates"]))
print("prod_without_approve_ok", c["prod_without_approve_ok"])
`,
        output: `case CASO-TAC-047
gates repro_metrics,approve_before_prod,feature_parity,rollback_possible
prod_without_approve_ok False`,
      },
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-B + CF-4 · modelo promovible y reversible: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "S47-T1-A · Tracking y reproducibilidad de experiment runs",
      subtopicId: "S47-T1-A",
      paragraphs: [
        "Tracking registra **parámetros, métricas, seed, artefactos y versión de dataset**. Reproducibilidad no es «el dashboard se ve bien»: es poder **re-ejecutar el run** con el mismo seed y params y obtener la métrica dentro de una tolerancia declarada. Sin seed presente y sin params no vacíos, el número es anécdota, no evidencia de promote.",
        "Contrato de reproducibilidad. Entrada: `seed`, `params`, `metric`, `rerun_metric`, `tolerance`. Salida: `PASS` solo si el seed está presente, hay params y `|metric − rerun| ≤ tolerance`. Error local: delta fuera de tolerancia o params vacíos → `MARK_RUN_NONREPRODUCIBLE`. Si falta `tolerance` → `INVESTIGATE_RANDOMNESS` (incertidumbre, no breach silencioso).",
        "En `CASO-TAC-047-1A` (priorización sintética en Tacna) el run con seed fijo, `depth=4` y f1 0.81 vs rerun 0.805 (tol 0.01) es reproducible. Un run con params vacíos o delta 0.16 se marca no reproducible aunque el score «parezca» alto. Sin PII; el score no prueba fraude ni parentesco.",
      ],
      code: {
        language: 'python',
        title: "tracking_reproducibility.py",
        code: `def reproducible(metric: float, rerun: float, tolerance: float, seed, params: dict) -> bool:
    if seed is None or not params:
        return False
    return abs(metric - rerun) <= tolerance

print("repro", reproducible(0.81, 0.805, 0.01, 42, {"depth": 4}))
print("nonrepro", reproducible(0.81, 0.65, 0.01, 42, {"depth": 4}))
print("missing_seed", reproducible(0.81, 0.805, 0.01, None, {"depth": 4}))`,
        output: `repro True
nonrepro False
missing_seed False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S47-T1-A: seed presente + params no vacíos + rerun dentro de tolerancia. Breach → `MARK_RUN_NONREPRODUCIBLE`; missing → `INVESTIGATE_RANDOMNESS`.",
      },
    },
    {
      heading: "S47-T1-B · Lineage data/code/env y comparación honesta",
      subtopicId: "S47-T1-B",
      paragraphs: [
        "Habiendo fijado el rerun, el siguiente riesgo es **comparar manzanas con naranjas**. Un run solo es comparable si fija tres anclas de lineage: versión de datos, commit de código y entorno bloqueado (lockfile/imagen). Además, la **definición de métrica** y el **split** (holdout, no el train) deben ser idénticos entre baseline y candidato; si no, un F1=0.90 en train no es evidencia de promote.",
        "Contrato de comparación. Entrada: `data`, `code`, `env`, `split`, `metric_definition`, `candidate`, `baseline`. Salida: `PASS` solo si el lineage está completo y `candidate > baseline` bajo la misma métrica/split. Error local: lineage incompleto o candidato que no supera baseline → `INVALIDATE_COMPARISON`. Si falta `baseline` → `RESTORE_LINEAGE`.",
        "En `CASO-TAC-047-1B` (priorización sintética en Tacna) el holdout `holdout-v1` y la métrica `f1-v2` están fijados: el candidato 0.82 supera al baseline 0.78 con lineage `ds-v3` / `git:abc` / `lock:def`. Un run con `code=latest` y `split=train` se invalida aunque el score sea 0.90: no entra a la tabla de comparación honesta ni al registry.",
      ],
      code: {
        language: 'python',
        title: "data_code_env_lineage_compare.py",
        code: `def comparable(run: dict, baseline: float) -> bool:
    lineage = all(run[k] for k in ("data", "code", "env", "split", "metric"))
    versioned = run["code"] != "latest" and run["split"] != "train" and run["metric"] != "unknown"
    return lineage and versioned and run["score"] > baseline

baseline = 0.78
runs = [
    {"id": "r-ok", "data": "ds-v3", "code": "git:abc", "env": "lock", "split": "holdout-v1", "metric": "f1-v2", "score": 0.82},
    {"id": "r-train", "data": "ds-v3", "code": "git:abc", "env": "lock", "split": "train", "metric": "f1-v2", "score": 0.90},
    {"id": "r-latest", "data": "ds-v3", "code": "latest", "env": "lock", "split": "holdout-v1", "metric": "f1-v2", "score": 0.85},
]
for r in runs:
    ok = comparable(r, baseline)
    delta = round(r["score"] - baseline, 2) if ok else None
    print(r["id"], "ok", ok, "delta", delta)`,
        output: `r-ok ok True delta 0.04
r-train ok False delta None
r-latest ok False delta None`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S47-T1-B, audita lineage completo y comparación homogénea. Un breach activa `INVALIDATE_COMPARISON` y una ausencia activa `RESTORE_LINEAGE`.",
      },
    },
    {
      heading: "S47-T2-A · Firmas de I/O, stages del registry y approvals",
      subtopicId: "S47-T2-A",
      paragraphs: [
        "Con un candidato que ya ganó en holdout, el **registry** exige otra capa de gobernanza. Una firma fija nombres y tipos de entrada/salida (el **contrato del servicio**, no un dict inventado por el run); los stages (None → Staging → Production) son estados gobernados, no etiquetas cosméticas. La aprobación es **independiente del digest**: un hash correcto sin `approved=True` no autoriza Production.",
        "Contrato de promoción. Entrada: `input_signature`, `output_signature`, `stage`, `approved` y el contrato de servicio `SERVICE_SIG`. Salida: `PASS` solo si la firma del modelo **coincide** con `SERVICE_SIG`, el stage es `staging` y hay aprobación explícita. Error local: firma rota, stage ilegal o promote a production sin approve → `DENY_MODEL_PROMOTION`. Si falta `approved` → `REQUEST_MODEL_APPROVAL`.",
        "En `CASO-TAC-047-2A` el ranker de priorización en Tacna declara firma `age:int`, `region:str` → `priority:float`, stage `staging` y `approved=True`. Un fixture con firma rota y `stage=production` sin approve se deniega (`DENY_MODEL_PROMOTION`) aunque el digest del artefacto exista: la igualdad es contra el contrato del servicio, no contra «lo que el run diga».",
      ],
      code: {
        language: 'python',
        title: "signatures_stages_approvals.py",
        code: `SERVICE_SIG = {
    "input": {"age": "int", "region": "str"},
    "output": {"priority": "float"},
}

def can_promote(stage: str, approved: bool, inp: dict, out: dict) -> bool:
    sig_ok = inp == SERVICE_SIG["input"] and out == SERVICE_SIG["output"]
    return stage == "staging" and approved and sig_ok

print("ok", can_promote("staging", True, {"age": "int", "region": "str"}, {"priority": "float"}))
print("prod_no_approve", can_promote("production", False, {"age": "int", "region": "str"}, {"priority": "float"}))
print("bad_sig", can_promote("staging", True, {"age": "str"}, {}))`,
        output: `ok True
prod_no_approve False
bad_sig False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S47-T2-A conserva firma compatible y aprobación trazada; no conviertas `DENY_MODEL_PROMOTION` ni `REQUEST_MODEL_APPROVAL` en éxito silencioso.",
      },
    },
    {
      heading: "S47-T2-B · Artefactos, model card y compatibilidad de features",
      subtopicId: "S47-T2-B",
      paragraphs: [
        "El registry no solo guarda un pickle: el artefacto necesita **digest** (p. ej. `sha256:…`), la **misma versión de features** en train y serving, y una **model card** con uso, límites, métricas y riesgos. Sin card, el equipo de producto no sabe cuándo el score no aplica; con skew de features, el modelo «funciona» sobre otra realidad.",
        "Contrato de artefacto. Entrada: `artifact_digest`, `feature_version`, `serving_feature_version`, `card_sections`. Salida: `PASS` solo si el digest es versionado, las features coinciden y la card cubre use/limits/metrics/risks. Error local: digest `latest`, skew o card incompleta → `REJECT_MODEL_ARTIFACT`. Si falta `card_sections` → `COMPLETE_MODEL_CARD`.",
        "En `CASO-TAC-047-2B` (ranker sintético de atención en Tacna) el artefacto `sha256:model` sirve `features-v3` en train y serving con card de cuatro secciones (uso, límites, métricas, riesgos). Un digest `latest` con `features-v2` en serving y card solo de `use` se rechaza: no hay promote ni canary sin artefacto gobernado.",
      ],
      code: {
        language: 'python',
        title: "artifacts_card_compat.py",
        code: `REQUIRED = {"use", "limits", "metrics", "risks"}

def artifact_ok(digest: str, train_fv: str, serve_fv: str, card: set) -> bool:
    return digest.startswith("sha256:") and train_fv == serve_fv and REQUIRED <= card

print("ok", artifact_ok("sha256:model", "features-v3", "features-v3", REQUIRED))
print("skew", artifact_ok("sha256:model", "features-v3", "features-v2", REQUIRED))
print("thin_card", artifact_ok("latest", "features-v3", "features-v3", {"use"}))`,
        output: `ok True
skew False
thin_card False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S47-T2-B: demuestra digest/card/compatibilidad verificados. Falla cerrada con `REJECT_MODEL_ARTIFACT` y deriva incertidumbre mediante `COMPLETE_MODEL_CARD`.",
      },
    },
    {
      heading: "S47-T3-A · Paridad batch/online y feature consistency",
      subtopicId: "S47-T3-A",
      paragraphs: [
        "Habiendo registrado el modelo, el riesgo clásico de production es el **training-serving skew**: el batch de entrenamiento calcula features de un modo y el path online de otro. Batch y online deben compartir transformación o contract tests; el leakage (usar información del futuro o del label) invalida el servicio aunque el F1 de laboratorio sea alto.",
        "Contrato de paridad. Entrada: `batch_features`, `online_features`, `leakage`, `contract_tests`. Salida: `PASS` solo si las firmas/vectores coinciden, no hay leakage y hay al menos tres contract tests. Error local: skew o leakage → `DISABLE_INCONSISTENT_SERVING`. Si falta `contract_tests` → `TRACE_FEATURE_PIPELINE`.",
        "En `CASO-TAC-047-3A` el path batch y el path online de priorización en Tacna emiten el mismo vector `[0.1, 0.4, 0.8]` con `leakage=False` y al menos 3 contract tests. Si online diverge o hay leakage, se deshabilita el serving **antes** del canary. Sin PII; el score de prioridad no es veredicto de conducta ni de parentesco.",
      ],
      code: {
        language: 'python',
        title: "batch_online_feature_consistency.py",
        code: `def feature_parity(batch, online, leakage: bool, tests: int) -> bool:
    return batch == online and not leakage and tests >= 3

print("ok", feature_parity([0.1, 0.4, 0.8], [0.1, 0.4, 0.8], False, 3))
print("skew", feature_parity([0.1, 0.4, 0.8], [0.1, 0.5, 0.8], False, 3))
print("leak", feature_parity([0.1, 0.4, 0.8], [0.1, 0.4, 0.8], True, 0))`,
        output: `ok True
skew False
leak False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S47-T3-A, el artefacto comprobable es paridad de features en fixtures. Sin él corresponde `DISABLE_INCONSISTENT_SERVING` o, si faltan datos, `TRACE_FEATURE_PIPELINE`.",
      },
    },
    {
      heading: "S47-T3-B · Latencia, batching y fallback seguro",
      subtopicId: "S47-T3-B",
      paragraphs: [
        "Con features alineadas, el serving aún puede fallar por **latencia y capacidad**. Se presupuesta p95/p99, se acota el batch size y se exige un fallback **probado** (reglas o modelo previo menos capaz). Un fallback «none» o no ensayado convierte el timeout en caída silenciosa del producto.",
        "Contrato de SLO. Entrada: `p95_ms`, `slo_ms`, `batch_size`, `fallback`, `fallback_tested`. Salida: `PASS` solo si p95 ≤ SLO, batch en rango seguro (1–64) y fallback tipado/probado. Error local: p95 fuera de presupuesto, batch excesivo o fallback ausente → `ACTIVATE_SAFE_FALLBACK`. Si falta `fallback_tested` → `TUNE_BATCH_OR_CAPACITY`.",
        "En `CASO-TAC-047-3B` el ranker de priorización en Tacna reporta p95 120 ms con SLO 180 ms, batch 16 y fallback `rules-v2` ensayado en staging. Un p95 900 ms con batch 512 y fallback `none` activa `ACTIVATE_SAFE_FALLBACK` y bloquea la promoción a tráfico real.",
      ],
      code: {
        language: 'python',
        title: "latency_batching_fallback.py",
        code: `def slo_ok(p95_ms: int, slo_ms: int, batch: int, fallback: str, tested: bool) -> bool:
    return p95_ms <= slo_ms and 1 <= batch <= 64 and fallback.startswith("rules-") and tested

print("ok", slo_ok(120, 180, 16, "rules-v2", True))
print("slow", slo_ok(900, 180, 16, "rules-v2", True))
print("no_fallback", slo_ok(120, 180, 512, "none", False))`,
        output: `ok True
slow False
no_fallback False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S47-T3-B: prueba SLO de latencia y fallback probado y registra por separado `ACTIVATE_SAFE_FALLBACK` (breach) y `TUNE_BATCH_OR_CAPACITY` (missing).",
      },
    },
    {
      heading: "S47-T4-A · Shadow, canary y monitoring hooks",
      subtopicId: "S47-T4-A",
      paragraphs: [
        "El modelo ya sirve con SLO; ahora el tráfico se abre con cuidado. **Shadow** observa sin decidir; **canary** recibe un presupuesto de tráfico (p. ej. ≤ 10%) y los monitoring hooks comparan calidad, drift y errores antes de promover. Un mode `full` al 100% sin hooks no es canary: es un deploy a ciegas.",
        "Contrato de canary. Entrada: `mode`, `traffic_pct`, `quality_delta`, `max_quality_drop`, `error_rate`, `max_error_rate`, `hooks`. Salida: `PASS` solo si mode es shadow/canary, tráfico ≤ 10%, calidad dentro de presupuesto (`quality_delta ≥ −max_quality_drop`) y hooks activos. Error local: over-traffic, calidad caída o hooks off → `STOP_CANARY`. Si falta `hooks` → `COLLECT_MORE_SHADOW_EVIDENCE`.",
        "En `CASO-TAC-047-4A` el equipo abre canary al 5% del tráfico de priorización en Tacna: error 0.4% bajo el techo, `quality_delta` dentro del presupuesto y hooks de calidad/drift activos → puede continuar. Un mode `full` al 100% con caída de calidad −0.2 y hooks apagados se detiene de inmediato (`STOP_CANARY`).",
      ],
      code: {
        language: 'python',
        title: "shadow_canary_monitoring.py",
        code: `def canary_ok(mode: str, traffic_pct: float, quality_delta: float, max_drop: float, error_rate: float, max_err: float, hooks: bool) -> bool:
    quality_ok = quality_delta >= -max_drop
    return (
        mode in {"shadow", "canary"}
        and traffic_pct <= 10
        and quality_ok
        and error_rate <= max_err
        and hooks
    )

print("ok", canary_ok("canary", 5, -0.01, 0.05, 0.004, 0.01, True))
print("over", canary_ok("full", 100, -0.2, 0.05, 0.1, 0.01, False))
print("quality_drop", canary_ok("canary", 5, -0.2, 0.05, 0.004, 0.01, True))`,
        output: `ok True
over False
quality_drop False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S47-T4-A acepta solo canary con criterio promote/stop; una violación produce `STOP_CANARY` y un registro incompleto produce `COLLECT_MORE_SHADOW_EVIDENCE`.",
      },
    },
    {
      heading: "S47-T4-B · Rollback, retirement y audit trail",
      subtopicId: "S47-T4-B",
      paragraphs: [
        "Si el canary falla — o si una versión envejeció — el camino CF-4 exige **rollback al last-known-good** con features compatibles y **retirement** auditado: se bloquea uso nuevo, se conserva evidencia y se registra quién retiró qué. Borrar el trace para «reducir ruido» destruye el gate de auditoría.",
        "Contrato de restauración. Entrada: `current`, `last_good`, `compatible_features`, `rollback_tested`, `retired`, `audit_entry`. Salida: `PASS` solo si hay last-good distinto del current, features compatibles, rollback ensayado, retiro registrado y audit entry. Error local: incompatibilidad o rollback no probado → `ROLLBACK_TO_LAST_GOOD`. Si falta `audit_entry` → `REVIEW_RETIREMENT`.",
        "En `CASO-TAC-047-4B` el equipo de priorización en Tacna restaura de `1.2.0` a `1.1.0` (last-known-good) con features compatibles, rollback ensayado en staging, `1.0.0` retirado y `audit_entry` firmado. Un path con `compatible_features=False`, rollback no probado o retired vacío fuerza `ROLLBACK_TO_LAST_GOOD` y, si falta audit, `REVIEW_RETIREMENT` — nunca se borra el trace para «limpiar» el tablero.",
      ],
      code: {
        language: 'python',
        title: "rollback_retire_audit.py",
        code: `def rollback_safe(current: str, last_good: str, compatible: bool, tested: bool, retired: set, audit: bool) -> bool:
    return current != last_good and compatible and tested and bool(retired) and audit

print("ok", rollback_safe("1.2.0", "1.1.0", True, True, {"1.0.0"}, True))
print("incompat", rollback_safe("1.2.0", "1.1.0", False, True, {"1.0.0"}, True))
print("no_audit", rollback_safe("1.2.0", "1.1.0", True, True, set(), False))`,
        output: `ok True
incompat False
no_audit False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S47-T4-B: conserva restauración y retirement auditados, la evidencia de `ROLLBACK_TO_LAST_GOOD` y la ruta humana `REVIEW_RETIREMENT`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S47 (MLOps: experimentos, registro y serving) alineadas a CP-N4-B + CF-4. Cada demo calcula el predicado del subtema con un caso local pequeño — no imprime literales precomputados.",
    steps: [
      {
        demoId: "S47-T1-A-DEMO",
        subtopicId: "S47-T1-A",
        environment: "local-python",
        description: "Demo: tracking y reproducibilidad — delta dentro de tolerancia",
        code: {
          language: 'python',
          title: "demo_tracking_reproducibility.py",
          code: `def within_tol(metric: float, rerun: float, tol: float) -> bool:
    return abs(metric - rerun) <= tol

run = {"params": {"depth": 4}, "metric": 0.81, "rerun": 0.805, "seed": 42, "tol": 0.01}
ok = bool(run["params"]) and run["seed"] is not None and within_tol(run["metric"], run["rerun"], run["tol"])
print("run_ok", ok)
print("seed", run["seed"])
print("delta", round(abs(run["metric"] - run["rerun"]), 3))`,
          output: `run_ok True
seed 42
delta 0.005`,
        },
        why: "Corrige la idea de que «seed=42» basta: el demo exige seed presente, params no vacíos y |metric−rerun| ≤ tolerancia antes de tratar el run como evidencia.",
      },
      {
        demoId: "S47-T1-B-DEMO",
        subtopicId: "S47-T1-B",
        environment: "local-python",
        description: "Demo: lineage completo y comparación candidato > baseline",
        code: {
          language: 'python',
          title: "demo_data_code_env_lineage_compare.py",
          code: `def comparable(data: str, code: str, env: str, split: str, metric_def: str, candidate: float, baseline: float) -> bool:
    lineage = all([data, code, env, split, metric_def])
    versioned = code != "latest" and split != "train" and metric_def != "unknown"
    return lineage and versioned and candidate > baseline

ok = comparable("ds-v3", "git:abc", "locked", "holdout-v1", "f1-v2", 0.82, 0.78)
bad = comparable("", "latest", "", "train", "unknown", 0.90, 0.78)
print("ok", ok)
print("invalid", bad)
print("delta", round(0.82 - 0.78, 2))`,
          output: `ok True
invalid False
delta 0.04`,
        },
        why: "Muestra por qué un score alto en train con code=latest no valida promote: sin lineage completo la comparación se invalida aunque candidate > baseline en el papel.",
      },
      {
        demoId: "S47-T2-A-DEMO",
        subtopicId: "S47-T2-A",
        environment: "local-python",
        description: "Demo: firma vs SERVICE_SIG + staging + approved",
        code: {
          language: 'python',
          title: "demo_signatures_stages_approvals.py",
          code: `SERVICE_SIG = {"input": {"age": "int", "region": "str"}, "output": {"priority": "float"}}

def can_promote(stage: str, approved: bool, inp: dict, out: dict) -> bool:
    sig_ok = inp == SERVICE_SIG["input"] and out == SERVICE_SIG["output"]
    return stage == "staging" and approved and sig_ok

print("staging_ok", can_promote("staging", True, {"age": "int", "region": "str"}, {"priority": "float"}))
print("prod_no_approve", can_promote("production", False, {"age": "int", "region": "str"}, {"priority": "float"}))
print("bad_sig", can_promote("staging", True, {"age": "str"}, {}))`,
          output: `staging_ok True
prod_no_approve False
bad_sig False`,
        },
        why: "Separa el digest del gate de gobernanza: la firma se compara con el contrato del servicio (SERVICE_SIG); production sin approved o firma rota deniegan promote.",
      },
      {
        demoId: "S47-T2-B-DEMO",
        subtopicId: "S47-T2-B",
        environment: "local-python",
        description: "Demo: digest sha256, features alineadas y card mínima",
        code: {
          language: 'python',
          title: "demo_artifacts_card_compat.py",
          code: `REQUIRED = {"use", "limits", "metrics", "risks"}

def card_ok(digest: str, train: str, serve: str, sections: set) -> bool:
    return digest.startswith("sha256:") and train == serve and REQUIRED <= sections

print("ok", card_ok("sha256:model", "features-v3", "features-v3", REQUIRED))
print("skew", card_ok("sha256:model", "features-v3", "features-v2", REQUIRED))
print("thin", card_ok("latest", "features-v3", "features-v3", {"use"}))`,
          output: `ok True
skew False
thin False`,
        },
        why: "Enseña que digest `latest`, skew train/serve o card incompleta son rechazo de artefacto, no detalles cosméticos.",
      },
      {
        demoId: "S47-T3-A-DEMO",
        subtopicId: "S47-T3-A",
        environment: "local-python",
        description: "Demo: paridad batch/online y anti-leakage",
        code: {
          language: 'python',
          title: "demo_batch_online_feature_consistency.py",
          code: `def parity(batch, online, leakage: bool, tests: int) -> bool:
    return batch == online and not leakage and tests >= 3

print("ok", parity([0.1, 0.4, 0.8], [0.1, 0.4, 0.8], False, 3))
print("skew", parity([0.1, 0.4, 0.8], [0.1, 0.5, 0.8], False, 3))
print("leak", parity([0.1, 0.4, 0.8], [0.1, 0.4, 0.8], True, 0))`,
          output: `ok True
skew False
leak False`,
        },
        why: "Hace visible el training-serving skew: si online diverge o hay leakage, el serving se deshabilita aunque el laboratorio luzca bien.",
      },
      {
        demoId: "S47-T3-B-DEMO",
        subtopicId: "S47-T3-B",
        environment: "local-python",
        description: "Demo: p95 bajo SLO, batch acotado y fallback probado",
        code: {
          language: 'python',
          title: "demo_latency_batching_fallback.py",
          code: `def serving_ready(p95: float, slo: float, batch: int, fallback: str, tested: bool) -> bool:
    return p95 <= slo and 1 <= batch <= 64 and fallback.startswith("rules-") and tested

print("ok", serving_ready(120, 180, 16, "rules-v2", True))
print("slow", serving_ready(900, 180, 16, "rules-v2", True))
print("no_fb", serving_ready(120, 180, 512, "none", False))`,
          output: `ok True
slow False
no_fb False`,
        },
        why: "Conecta latencia, batch y fallback en un solo predicado: sin fallback probado el timeout no tiene salida segura.",
      },
      {
        demoId: "S47-T4-A-DEMO",
        subtopicId: "S47-T4-A",
        environment: "local-python",
        description: "Demo: canary ≤10% con quality_delta, error budget y hooks",
        code: {
          language: 'python',
          title: "demo_shadow_canary_monitoring.py",
          code: `def canary_ok(mode: str, traffic: float, q_delta: float, max_drop: float, err: float, max_err: float, hooks: bool) -> str:
    ok = (
        mode in {"shadow", "canary"}
        and traffic <= 10
        and q_delta >= -max_drop
        and err <= max_err
        and hooks
    )
    return "gates_green" if ok else "stop"

print("ok", canary_ok("canary", 5, -0.01, 0.05, 0.004, 0.01, True))
print("over", canary_ok("full", 100, -0.2, 0.05, 0.1, 0.01, False))
print("quality_drop", canary_ok("canary", 5, -0.2, 0.05, 0.004, 0.01, True))`,
          output: `ok gates_green
over stop
quality_drop stop`,
        },
        why: "Modela presupuesto de tráfico, caída de calidad y hooks: mode full al 100%, quality_delta fuera de presupuesto o hooks apagados detienen el canary aunque el digest sea válido.",
      },
      {
        demoId: "S47-T4-B-DEMO",
        subtopicId: "S47-T4-B",
        environment: "local-python",
        description: "Demo: rollback a last-good con retirement auditado",
        code: {
          language: 'python',
          title: "demo_rollback_retire_audit.py",
          code: `def restore_ok(current: str, last_good: str, compatible: bool, tested: bool, retired: set, audit: bool) -> bool:
    return current != last_good and compatible and tested and bool(retired) and audit

print("ok", restore_ok("1.2.0", "1.1.0", True, True, {"1.0.0"}, True))
print("incompat", restore_ok("1.2.0", "1.1.0", False, False, set(), False))
print("no_audit", restore_ok("1.2.0", "1.1.0", True, True, {"1.0.0"}, False))`,
          output: `ok True
incompat False
no_audit False`,
        },
        why: "Demuestra que rollback y retirement son predicados de seguridad: sin features compatibles ni audit entry no hay cierre CF-4.",
      },
    ],
  },
  weDo: {
    intro: "S47 · Laboratorio Production Data/ML Platform con CF-4: 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed con ocho fixtures peruanos sintéticos distintos.",
    steps: [
      {
        id: "S47-T1-A-E1",
        subtopicId: "S47-T1-A",
        kind: "guided",
        instruction: "S47-T1-A-E1 · Calcula el contrato de `tracking y reproducibilidad` sobre `CASO-TAC-047-1A`. La entrada es el dict completo del starter; la operación debe demostrar rerun dentro de tolerancia con seed/parámetros. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S47-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `MARK_RUN_NONREPRODUCIBLE` en E2.",
        hint: "El starter usa `>` en lugar de `≤`: invierte la dirección del comparador de tolerancia y exige seed presente + params no vacíos.",
        hints: [
          "Relaciona los campos `seed`, `params`, `metric`, `rerun_metric`, `tolerance` con la regla explicada en S47-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva rerun dentro de tolerancia declarada; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta `tolerance` → MISSING / INVESTIGATE_RANDOMNESS", "adverso: params vacíos y/o |metric−rerun| > tolerance (seed nulo también falla) → MARK_RUN_NONREPRODUCIBLE", "CASO-TAC-047-1A es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-1A` satisface un predicado de dominio real; imprime `S47-T1-A PASS` y el assert booleano pasa.",
        feedback: "S47-T1-A-E1: la dirección del comparador es ≤ tolerancia (no >). Di qué delta produce PASS en 0.81 vs 0.805 y por qué seed presente + params no vacíos son parte del contrato.",
        starterCode: {
          language: 'python',
          title: "s47-t1-a-e1.py",
          code: `# CASO-TAC-047 · tracking seed/metric reproducibility
# DEFECT: PASS si |metric-rerun|>tolerance (no-reproducible)
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TAC-047-1A", **{"seed":42,"params":{"depth":4},"metric":0.81,"rerun_metric":0.805,"tolerance":0.01}}
# DEFECT: métrica no reproducible fuera de tolerancia
meets_contract = abs(record["metric"] - record["rerun_metric"]) > record["tolerance"]
status = "PASS" if meets_contract else "MARK_RUN_NONREPRODUCIBLE"
print("S47-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t1-a-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-1A", **{"seed":42,"params":{"depth":4},"metric":0.81,"rerun_metric":0.805,"tolerance":0.01}}
meets_contract = record.get("seed") is not None and bool(record["params"]) and abs(record["metric"] - record["rerun_metric"]) <= record["tolerance"]
status = "PASS" if meets_contract else "MARK_RUN_NONREPRODUCIBLE"
print("S47-T1-A", status)
assert meets_contract is True` ,
          output: `S47-T1-A PASS` ,
        },
      },
      {
        id: "S47-T1-A-E2",
        subtopicId: "S47-T1-A",
        kind: "independent",
        instruction: "S47-T1-A-E2 · Modela tres rutas de `tracking y reproducibilidad`: fixture válido, fixture adverso y registro sin `tolerance`. Entrada: dict con case_id, seed, params, metric, rerun_metric, tolerance. Salidas exactas: `PASS`, `MARK_RUN_NONREPRODUCIBLE`, `MISSING:tolerance`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a tolerance debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a tolerance debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T1-A: rerun dentro de tolerancia con seed/parámetros. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta `tolerance` → MISSING / INVESTIGATE_RANDOMNESS", "adverso: params vacíos y/o |metric−rerun| > tolerance (seed nulo también falla) → MARK_RUN_NONREPRODUCIBLE", "CASO-TAC-047-1A es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `tolerance` ausente y produce exactamente `PASS MARK_RUN_NONREPRODUCIBLE MISSING:tolerance`.",
        feedback: "S47-T1-A-E2: el orden importa — missing primero; luego contenido. ¿Por qué el adverso falla por params vacíos/delta y no por schema?",
        starterCode: {
          language: 'python',
          title: "s47-t1-a-e2.py",
          code: `# CASO-TAC-047 · assess MARK_RUN_NONREPRODUCIBLE
# DEFECT: PASS cuando rerun diverge del seed/params
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "seed", "params", "metric", "rerun_metric", "tolerance"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if abs(record["metric"] - record["rerun_metric"]) > record["tolerance"] else "MARK_RUN_NONREPRODUCIBLE"

valid = {"case_id": "CASO-TAC-047-1A", **{"seed":42,"params":{"depth":4},"metric":0.81,"rerun_metric":0.805,"tolerance":0.01}}
invalid = {"case_id": "CASO-TAC-047-1A", **{"seed":7,"params":{},"metric":0.81,"rerun_metric":0.65,"tolerance":0.01}}
incomplete = {**valid}
incomplete.pop("tolerance")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "seed", "params", "metric", "rerun_metric", "tolerance"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record.get("seed") is not None and bool(record["params"]) and abs(record["metric"] - record["rerun_metric"]) <= record["tolerance"] else "MARK_RUN_NONREPRODUCIBLE"

valid = {"case_id": "CASO-TAC-047-1A", **{"seed":42,"params":{"depth":4},"metric":0.81,"rerun_metric":0.805,"tolerance":0.01}}
invalid = {"case_id": "CASO-TAC-047-1A", **{"seed":7,"params":{},"metric":0.81,"rerun_metric":0.65,"tolerance":0.01}}
incomplete = {**valid}
incomplete.pop("tolerance")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS MARK_RUN_NONREPRODUCIBLE MISSING:tolerance` ,
        },
      },
      {
        id: "S47-T1-A-E3",
        subtopicId: "S47-T1-A",
        kind: "transfer",
        instruction: "S47-T1-A-E3 · Simula fallo cerrado para `tracking y reproducibilidad` con tres fixtures distintos. `CASO-TAC-047-1A` debe continuar, el adverso debe devolver `MARK_RUN_NONREPRODUCIBLE` y la ausencia de `tolerance` debe devolver `INVESTIGATE_RANDOMNESS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `INVESTIGATE_RANDOMNESS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `INVESTIGATE_RANDOMNESS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró rerun dentro de tolerancia con seed/parámetros; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta `tolerance` → MISSING / INVESTIGATE_RANDOMNESS", "adverso: params vacíos y/o |metric−rerun| > tolerance (seed nulo también falla) → MARK_RUN_NONREPRODUCIBLE", "CASO-TAC-047-1A es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-1A`, adverso y sin `tolerance` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T1-A-E3: missing ≠ breach. Justifica CONTINUE vs MARK_RUN_NONREPRODUCIBLE vs INVESTIGATE_RANDOMNESS con un campo cada uno.",
        starterCode: {
          language: 'python',
          title: "s47-t1-a-e3.py",
          code: `# CASO-TAC-047 · decide MARK_RUN_NONREPRODUCIBLE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "seed", "params", "metric", "rerun_metric", "tolerance"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if abs(record["metric"] - record["rerun_metric"]) > record["tolerance"] else "MARK_RUN_NONREPRODUCIBLE"

valid = {"case_id": "CASO-TAC-047-1A", **{"seed":42,"params":{"depth":4},"metric":0.81,"rerun_metric":0.805,"tolerance":0.01}}
invalid = {"case_id": "CASO-TAC-047-1A", **{"seed":7,"params":{},"metric":0.81,"rerun_metric":0.65,"tolerance":0.01}}
uncertain = {**valid}
uncertain.pop("tolerance")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "seed", "params", "metric", "rerun_metric", "tolerance"}
    missing = sorted(required - record.keys())
    if missing:
        return "INVESTIGATE_RANDOMNESS"
    return "CONTINUE" if record.get("seed") is not None and bool(record["params"]) and abs(record["metric"] - record["rerun_metric"]) <= record["tolerance"] else "MARK_RUN_NONREPRODUCIBLE"

valid = {"case_id": "CASO-TAC-047-1A", **{"seed":42,"params":{"depth":4},"metric":0.81,"rerun_metric":0.805,"tolerance":0.01}}
invalid = {"case_id": "CASO-TAC-047-1A", **{"seed":7,"params":{},"metric":0.81,"rerun_metric":0.65,"tolerance":0.01}}
uncertain = {**valid}
uncertain.pop("tolerance")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "MARK_RUN_NONREPRODUCIBLE", "INVESTIGATE_RANDOMNESS"]` ,
          output: `CONTINUE MARK_RUN_NONREPRODUCIBLE INVESTIGATE_RANDOMNESS` ,
        },
      },
      {
        id: "S47-T1-B-E1",
        subtopicId: "S47-T1-B",
        kind: "guided",
        instruction: "S47-T1-B-E1 · Compara el contrato de `data/code/env lineage y comparación` sobre `CASO-TAC-047-1B`. La entrada es el dict completo del starter; la operación debe demostrar data/code/env/split/métrica versionados y candidato mejor. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S47-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `INVALIDATE_COMPARISON` en E2.",
        hint: "El DEFECT niega el data o exige candidate ≤ baseline: invierte a lineage completo + versionado (no latest/train/unknown) + candidate > baseline.",
        hints: [
          "Relaciona los campos `data`, `code`, `env`, `split`, `metric_definition`, `candidate`, `baseline` con la regla explicada en S47-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva lineage completo y comparación homogénea; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta `baseline` → MISSING / RESTORE_LINEAGE", "adverso: data/env vacíos, code=latest, split=train o metric unknown → INVALIDATE_COMPARISON", "CASO-TAC-047-1B es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-1B` satisface un predicado de dominio real; imprime `S47-T1-B PASS` y el assert booleano pasa.",
        feedback: "S47-T1-B-E1: la comparación exige lineage completo y candidate > baseline. ¿Qué campo del adverso (code=latest, split=train) invalida primero?",
        starterCode: {
          language: 'python',
          title: "s47-t1-b-e1.py",
          code: `# CASO-TAC-047 · lineage + candidate vs baseline
# DEFECT: PASS si no data o candidate≤baseline
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TAC-047-1B", **{"data":"ds-v3","code":"git:abc","env":"lock:def","split":"holdout-v1","metric_definition":"f1-v2","candidate":0.82,"baseline":0.78}}
# DEFECT: sin data o candidate no supera baseline
meets_contract = not record["data"] or record["candidate"] <= record["baseline"]
status = "PASS" if meets_contract else "INVALIDATE_COMPARISON"
print("S47-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t1-b-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-1B", **{"data":"ds-v3","code":"git:abc","env":"lock:def","split":"holdout-v1","metric_definition":"f1-v2","candidate":0.82,"baseline":0.78}}
lineage_ok = all(record[k] for k in ("data", "code", "env", "split", "metric_definition"))
versioned = record["code"] != "latest" and record["split"] != "train" and record["metric_definition"] != "unknown"
meets_contract = lineage_ok and versioned and record["candidate"] > record["baseline"]
status = "PASS" if meets_contract else "INVALIDATE_COMPARISON"
print("S47-T1-B", status)
assert meets_contract is True` ,
          output: `S47-T1-B PASS` ,
        },
      },
      {
        id: "S47-T1-B-E2",
        subtopicId: "S47-T1-B",
        kind: "independent",
        instruction: "S47-T1-B-E2 · Verifica tres rutas de `data/code/env lineage y comparación`: fixture válido, fixture adverso y registro sin `baseline`. Entrada: dict con case_id, data, code, env, split, metric_definition, candidate, baseline. Salidas exactas: `PASS`, `INVALIDATE_COMPARISON`, `MISSING:baseline`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a baseline debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a baseline debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T1-B: data/code/env/split/métrica versionados y candidato mejor. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta `baseline` → MISSING / RESTORE_LINEAGE", "adverso: data/env vacíos, code=latest, split=train o metric unknown → INVALIDATE_COMPARISON", "CASO-TAC-047-1B es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `baseline` ausente y produce exactamente `PASS INVALIDATE_COMPARISON MISSING:baseline`.",
        feedback: "S47-T1-B-E2: missing de baseline es RESTORE_LINEAGE, no INVALIDATE. Di por qué un candidate 0.90 con split=train sigue siendo INVALIDATE.",
        starterCode: {
          language: 'python',
          title: "s47-t1-b-e2.py",
          code: `# CASO-TAC-047 · assess INVALIDATE_COMPARISON
# DEFECT: PASS sin lineage o sin mejora vs baseline
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "data", "code", "env", "split", "metric_definition", "candidate", "baseline"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["data"] or record["candidate"] <= record["baseline"] else "INVALIDATE_COMPARISON"

valid = {"case_id": "CASO-TAC-047-1B", **{"data":"ds-v3","code":"git:abc","env":"lock:def","split":"holdout-v1","metric_definition":"f1-v2","candidate":0.82,"baseline":0.78}}
invalid = {"case_id": "CASO-TAC-047-1B", **{"data":"","code":"latest","env":"","split":"train","metric_definition":"unknown","candidate":0.9,"baseline":0.78}}
incomplete = {**valid}
incomplete.pop("baseline")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "data", "code", "env", "split", "metric_definition", "candidate", "baseline"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    lineage_ok = all(record[k] for k in ("data", "code", "env", "split", "metric_definition"))
    versioned = record["code"] != "latest" and record["split"] != "train" and record["metric_definition"] != "unknown"
    return "PASS" if lineage_ok and versioned and record["candidate"] > record["baseline"] else "INVALIDATE_COMPARISON"

valid = {"case_id": "CASO-TAC-047-1B", **{"data":"ds-v3","code":"git:abc","env":"lock:def","split":"holdout-v1","metric_definition":"f1-v2","candidate":0.82,"baseline":0.78}}
invalid = {"case_id": "CASO-TAC-047-1B", **{"data":"","code":"latest","env":"","split":"train","metric_definition":"unknown","candidate":0.9,"baseline":0.78}}
incomplete = {**valid}
incomplete.pop("baseline")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS INVALIDATE_COMPARISON MISSING:baseline` ,
        },
      },
      {
        id: "S47-T1-B-E3",
        subtopicId: "S47-T1-B",
        kind: "transfer",
        instruction: "S47-T1-B-E3 · Extiende fallo cerrado para `data/code/env lineage y comparación` con tres fixtures distintos. `CASO-TAC-047-1B` debe continuar, el adverso debe devolver `INVALIDATE_COMPARISON` y la ausencia de `baseline` debe devolver `RESTORE_LINEAGE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `RESTORE_LINEAGE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RESTORE_LINEAGE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró data/code/env/split/métrica versionados y candidato mejor; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta `baseline` → MISSING / RESTORE_LINEAGE", "adverso: data/env vacíos, code=latest, split=train o metric unknown → INVALIDATE_COMPARISON", "CASO-TAC-047-1B es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-1B`, adverso y sin `baseline` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T1-B-E3: justifica CONTINUE / INVALIDATE_COMPARISON / RESTORE_LINEAGE. Un score alto no salva lineage incompleto.",
        starterCode: {
          language: 'python',
          title: "s47-t1-b-e3.py",
          code: `# CASO-TAC-047 · decide INVALIDATE_COMPARISON
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "data", "code", "env", "split", "metric_definition", "candidate", "baseline"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["data"] or record["candidate"] <= record["baseline"] else "INVALIDATE_COMPARISON"

valid = {"case_id": "CASO-TAC-047-1B", **{"data":"ds-v3","code":"git:abc","env":"lock:def","split":"holdout-v1","metric_definition":"f1-v2","candidate":0.82,"baseline":0.78}}
invalid = {"case_id": "CASO-TAC-047-1B", **{"data":"","code":"latest","env":"","split":"train","metric_definition":"unknown","candidate":0.9,"baseline":0.78}}
uncertain = {**valid}
uncertain.pop("baseline")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "data", "code", "env", "split", "metric_definition", "candidate", "baseline"}
    missing = sorted(required - record.keys())
    if missing:
        return "RESTORE_LINEAGE"
    lineage_ok = all(record[k] for k in ("data", "code", "env", "split", "metric_definition"))
    versioned = record["code"] != "latest" and record["split"] != "train" and record["metric_definition"] != "unknown"
    return "CONTINUE" if lineage_ok and versioned and record["candidate"] > record["baseline"] else "INVALIDATE_COMPARISON"

valid = {"case_id": "CASO-TAC-047-1B", **{"data":"ds-v3","code":"git:abc","env":"lock:def","split":"holdout-v1","metric_definition":"f1-v2","candidate":0.82,"baseline":0.78}}
invalid = {"case_id": "CASO-TAC-047-1B", **{"data":"","code":"latest","env":"","split":"train","metric_definition":"unknown","candidate":0.9,"baseline":0.78}}
uncertain = {**valid}
uncertain.pop("baseline")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "INVALIDATE_COMPARISON", "RESTORE_LINEAGE"]` ,
          output: `CONTINUE INVALIDATE_COMPARISON RESTORE_LINEAGE` ,
        },
      },
      {
        id: "S47-T2-A-E1",
        subtopicId: "S47-T2-A",
        kind: "guided",
        instruction: "S47-T2-A-E1 · Filtra el contrato de `firmas, stages y approvals` sobre `CASO-TAC-047-2A`. La entrada es el dict completo del starter; la operación debe demostrar firma exacta, staging y aprobación. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S47-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `DENY_MODEL_PROMOTION` en E2.",
        hint: "El DEFECT aprueba cuando falta approved o stage=production: exige firma igual al contrato del servicio, stage=staging y approved=True.",
        hints: [
          "Relaciona los campos `input_signature`, `output_signature`, `stage`, `approved` con la regla explicada en S47-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva firma compatible y aprobación trazada; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta `approved` → MISSING / REQUEST_MODEL_APPROVAL", "adverso: production + approved=False + firma rota → DENY_MODEL_PROMOTION", "CASO-TAC-047-2A es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-2A` satisface un predicado de dominio real; imprime `S47-T2-A PASS` y el assert booleano pasa.",
        feedback: "S47-T2-A-E1: stage=staging + approved + firma exacta. ¿Por qué production sin approve es DENY y no PASS?",
        starterCode: {
          language: 'python',
          title: "s47-t2-a-e1.py",
          code: `# CASO-TAC-047 · model stage + approval gate
# DEFECT: PASS si no approved o stage ya production
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TAC-047-2A", **{"input_signature":{"age":"int","region":"str"},"output_signature":{"priority":"float"},"stage":"staging","approved":True}}
# DEFECT: production sin approved o stage incorrecto
meets_contract = not record["approved"] or record["stage"] == "production"
status = "PASS" if meets_contract else "DENY_MODEL_PROMOTION"
print("S47-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t2-a-e1.py",
          code: `SERVICE_SIG = {"input": {"age": "int", "region": "str"}, "output": {"priority": "float"}}
record = {"case_id": "CASO-TAC-047-2A", **{"input_signature":{"age":"int","region":"str"},"output_signature":{"priority":"float"},"stage":"staging","approved":True}}
meets_contract = (
    record["input_signature"] == SERVICE_SIG["input"]
    and record["output_signature"] == SERVICE_SIG["output"]
    and record["stage"] == "staging"
    and record["approved"]
)
status = "PASS" if meets_contract else "DENY_MODEL_PROMOTION"
print("S47-T2-A", status)
assert meets_contract is True` ,
          output: `S47-T2-A PASS` ,
        },
      },
      {
        id: "S47-T2-A-E2",
        subtopicId: "S47-T2-A",
        kind: "independent",
        instruction: "S47-T2-A-E2 · Clasifica tres rutas de `firmas, stages y approvals`: fixture válido, fixture adverso y registro sin `approved`. Entrada: dict con case_id, input_signature, output_signature, stage, approved. Salidas exactas: `PASS`, `DENY_MODEL_PROMOTION`, `MISSING:approved`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a approved debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a approved debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T2-A: firma exacta, staging y aprobación. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta `approved` → MISSING / REQUEST_MODEL_APPROVAL", "adverso: production + approved=False + firma rota → DENY_MODEL_PROMOTION", "CASO-TAC-047-2A es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `approved` ausente y produce exactamente `PASS DENY_MODEL_PROMOTION MISSING:approved`.",
        feedback: "S47-T2-A-E2: missing approved → REQUEST, no DENY. El adverso combina firma rota y production sin approve.",
        starterCode: {
          language: 'python',
          title: "s47-t2-a-e2.py",
          code: `# CASO-TAC-047 · assess DENY_MODEL_PROMOTION
# DEFECT: PASS sin approval o promote ilegal a prod
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "input_signature", "output_signature", "stage", "approved"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["approved"] or record["stage"] == "production" else "DENY_MODEL_PROMOTION"

valid = {"case_id": "CASO-TAC-047-2A", **{"input_signature":{"age":"int","region":"str"},"output_signature":{"priority":"float"},"stage":"staging","approved":True}}
invalid = {"case_id": "CASO-TAC-047-2A", **{"input_signature":{"age":"str"},"output_signature":{},"stage":"production","approved":False}}
incomplete = {**valid}
incomplete.pop("approved")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t2-a-e2.py",
          code: `SERVICE_SIG = {"input": {"age": "int", "region": "str"}, "output": {"priority": "float"}}

def assess(record: dict) -> str:
    required = {"case_id", "input_signature", "output_signature", "stage", "approved"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    sig_ok = record["input_signature"] == SERVICE_SIG["input"] and record["output_signature"] == SERVICE_SIG["output"]
    return "PASS" if sig_ok and record["stage"] == "staging" and record["approved"] else "DENY_MODEL_PROMOTION"

valid = {"case_id": "CASO-TAC-047-2A", **{"input_signature":{"age":"int","region":"str"},"output_signature":{"priority":"float"},"stage":"staging","approved":True}}
invalid = {"case_id": "CASO-TAC-047-2A", **{"input_signature":{"age":"str"},"output_signature":{},"stage":"production","approved":False}}
incomplete = {**valid}
incomplete.pop("approved")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS DENY_MODEL_PROMOTION MISSING:approved` ,
        },
      },
      {
        id: "S47-T2-A-E3",
        subtopicId: "S47-T2-A",
        kind: "transfer",
        instruction: "S47-T2-A-E3 · Defiende fallo cerrado para `firmas, stages y approvals` con tres fixtures distintos. `CASO-TAC-047-2A` debe continuar, el adverso debe devolver `DENY_MODEL_PROMOTION` y la ausencia de `approved` debe devolver `REQUEST_MODEL_APPROVAL`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_MODEL_APPROVAL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_MODEL_APPROVAL` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró firma exacta, staging y aprobación; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta `approved` → MISSING / REQUEST_MODEL_APPROVAL", "adverso: production + approved=False + firma rota → DENY_MODEL_PROMOTION", "CASO-TAC-047-2A es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-2A`, adverso y sin `approved` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T2-A-E3: CONTINUE / DENY_MODEL_PROMOTION / REQUEST_MODEL_APPROVAL. La aprobación es independiente del digest.",
        starterCode: {
          language: 'python',
          title: "s47-t2-a-e3.py",
          code: `# CASO-TAC-047 · decide DENY_MODEL_PROMOTION
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "input_signature", "output_signature", "stage", "approved"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["approved"] or record["stage"] == "production" else "DENY_MODEL_PROMOTION"

valid = {"case_id": "CASO-TAC-047-2A", **{"input_signature":{"age":"int","region":"str"},"output_signature":{"priority":"float"},"stage":"staging","approved":True}}
invalid = {"case_id": "CASO-TAC-047-2A", **{"input_signature":{"age":"str"},"output_signature":{},"stage":"production","approved":False}}
uncertain = {**valid}
uncertain.pop("approved")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t2-a-e3.py",
          code: `SERVICE_SIG = {"input": {"age": "int", "region": "str"}, "output": {"priority": "float"}}

def decide(record: dict) -> str:
    required = {"case_id", "input_signature", "output_signature", "stage", "approved"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_MODEL_APPROVAL"
    sig_ok = record["input_signature"] == SERVICE_SIG["input"] and record["output_signature"] == SERVICE_SIG["output"]
    return "CONTINUE" if sig_ok and record["stage"] == "staging" and record["approved"] else "DENY_MODEL_PROMOTION"

valid = {"case_id": "CASO-TAC-047-2A", **{"input_signature":{"age":"int","region":"str"},"output_signature":{"priority":"float"},"stage":"staging","approved":True}}
invalid = {"case_id": "CASO-TAC-047-2A", **{"input_signature":{"age":"str"},"output_signature":{},"stage":"production","approved":False}}
uncertain = {**valid}
uncertain.pop("approved")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "DENY_MODEL_PROMOTION", "REQUEST_MODEL_APPROVAL"]` ,
          output: `CONTINUE DENY_MODEL_PROMOTION REQUEST_MODEL_APPROVAL` ,
        },
      },
      {
        id: "S47-T2-B-E1",
        subtopicId: "S47-T2-B",
        kind: "guided",
        instruction: "S47-T2-B-E1 · Modela el contrato de `artefactos, model card y compatibilidad` sobre `CASO-TAC-047-2B`. La entrada es el dict completo del starter; la operación debe demostrar digest, compatibilidad de features y card completa. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S47-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_MODEL_ARTIFACT` en E2.",
        hint: "El DEFECT aprueba con skew o card incompleta: exige digest sha256:, train_fv==serve_fv y card ⊇ {use,limits,metrics,risks}.",
        hints: [
          "Relaciona los campos `artifact_digest`, `feature_version`, `serving_feature_version`, `card_sections` con la regla explicada en S47-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva digest/card/compatibilidad verificados; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta `card_sections` → MISSING / COMPLETE_MODEL_CARD", "adverso: digest latest, feature skew o card incompleta → REJECT_MODEL_ARTIFACT", "CASO-TAC-047-2B es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-2B` satisface un predicado de dominio real; imprime `S47-T2-B PASS` y el assert booleano pasa.",
        feedback: "S47-T2-B-E1: digest sha256 + features alineadas + card de 4 secciones. ¿Qué falla primero en el adverso: latest, skew o card thin?",
        starterCode: {
          language: 'python',
          title: "s47-t2-b-e1.py",
          code: `# CASO-TAC-047 · artifact digest + model card
# DEFECT: PASS si feature_version drift o card_sections<4
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TAC-047-2B", **{"artifact_digest":"sha256:model","feature_version":"features-v3","serving_feature_version":"features-v3","card_sections":{"use","limits","metrics","risks"}}}
# DEFECT: feature version skew o card incompleta
meets_contract = record["feature_version"] != record["serving_feature_version"] or len(record["card_sections"]) < 4
status = "PASS" if meets_contract else "REJECT_MODEL_ARTIFACT"
print("S47-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t2-b-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-2B", **{"artifact_digest":"sha256:model","feature_version":"features-v3","serving_feature_version":"features-v3","card_sections":{"use","limits","metrics","risks"}}}
meets_contract = record["artifact_digest"].startswith("sha256:") and record["feature_version"] == record["serving_feature_version"] and {"use","limits","metrics","risks"} <= record["card_sections"]
status = "PASS" if meets_contract else "REJECT_MODEL_ARTIFACT"
print("S47-T2-B", status)
assert meets_contract is True` ,
          output: `S47-T2-B PASS` ,
        },
      },
      {
        id: "S47-T2-B-E2",
        subtopicId: "S47-T2-B",
        kind: "independent",
        instruction: "S47-T2-B-E2 · Audita tres rutas de `artefactos, model card y compatibilidad`: fixture válido, fixture adverso y registro sin `card_sections`. Entrada: dict con case_id, artifact_digest, feature_version, serving_feature_version, card_sections. Salidas exactas: `PASS`, `REJECT_MODEL_ARTIFACT`, `MISSING:card_sections`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a card_sections debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a card_sections debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T2-B: digest, compatibilidad de features y card completa. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta `card_sections` → MISSING / COMPLETE_MODEL_CARD", "adverso: digest latest, feature skew o card incompleta → REJECT_MODEL_ARTIFACT", "CASO-TAC-047-2B es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `card_sections` ausente y produce exactamente `PASS REJECT_MODEL_ARTIFACT MISSING:card_sections`.",
        feedback: "S47-T2-B-E2: missing card_sections → COMPLETE_MODEL_CARD. El adverso rechaza por digest/skew/card, no por schema.",
        starterCode: {
          language: 'python',
          title: "s47-t2-b-e2.py",
          code: `# CASO-TAC-047 · assess REJECT_MODEL_ARTIFACT
# DEFECT: PASS con serving skew o card incompleta
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "artifact_digest", "feature_version", "serving_feature_version", "card_sections"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["feature_version"] != record["serving_feature_version"] or len(record["card_sections"]) < 4 else "REJECT_MODEL_ARTIFACT"

valid = {"case_id": "CASO-TAC-047-2B", **{"artifact_digest":"sha256:model","feature_version":"features-v3","serving_feature_version":"features-v3","card_sections":{"use","limits","metrics","risks"}}}
invalid = {"case_id": "CASO-TAC-047-2B", **{"artifact_digest":"latest","feature_version":"features-v3","serving_feature_version":"features-v2","card_sections":{"use"}}}
incomplete = {**valid}
incomplete.pop("card_sections")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "artifact_digest", "feature_version", "serving_feature_version", "card_sections"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["artifact_digest"].startswith("sha256:") and record["feature_version"] == record["serving_feature_version"] and {"use","limits","metrics","risks"} <= record["card_sections"] else "REJECT_MODEL_ARTIFACT"

valid = {"case_id": "CASO-TAC-047-2B", **{"artifact_digest":"sha256:model","feature_version":"features-v3","serving_feature_version":"features-v3","card_sections":{"use","limits","metrics","risks"}}}
invalid = {"case_id": "CASO-TAC-047-2B", **{"artifact_digest":"latest","feature_version":"features-v3","serving_feature_version":"features-v2","card_sections":{"use"}}}
incomplete = {**valid}
incomplete.pop("card_sections")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_MODEL_ARTIFACT MISSING:card_sections` ,
        },
      },
      {
        id: "S47-T2-B-E3",
        subtopicId: "S47-T2-B",
        kind: "transfer",
        instruction: "S47-T2-B-E3 · Recupera fallo cerrado para `artefactos, model card y compatibilidad` con tres fixtures distintos. `CASO-TAC-047-2B` debe continuar, el adverso debe devolver `REJECT_MODEL_ARTIFACT` y la ausencia de `card_sections` debe devolver `COMPLETE_MODEL_CARD`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `COMPLETE_MODEL_CARD` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `COMPLETE_MODEL_CARD` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró digest, compatibilidad de features y card completa; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta `card_sections` → MISSING / COMPLETE_MODEL_CARD", "adverso: digest latest, feature skew o card incompleta → REJECT_MODEL_ARTIFACT", "CASO-TAC-047-2B es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-2B`, adverso y sin `card_sections` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T2-B-E3: CONTINUE / REJECT_MODEL_ARTIFACT / COMPLETE_MODEL_CARD. Sin card no inventes secciones: deriva a completar.",
        starterCode: {
          language: 'python',
          title: "s47-t2-b-e3.py",
          code: `# CASO-TAC-047 · decide REJECT_MODEL_ARTIFACT
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "artifact_digest", "feature_version", "serving_feature_version", "card_sections"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["feature_version"] != record["serving_feature_version"] or len(record["card_sections"]) < 4 else "REJECT_MODEL_ARTIFACT"

valid = {"case_id": "CASO-TAC-047-2B", **{"artifact_digest":"sha256:model","feature_version":"features-v3","serving_feature_version":"features-v3","card_sections":{"use","limits","metrics","risks"}}}
invalid = {"case_id": "CASO-TAC-047-2B", **{"artifact_digest":"latest","feature_version":"features-v3","serving_feature_version":"features-v2","card_sections":{"use"}}}
uncertain = {**valid}
uncertain.pop("card_sections")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "artifact_digest", "feature_version", "serving_feature_version", "card_sections"}
    missing = sorted(required - record.keys())
    if missing:
        return "COMPLETE_MODEL_CARD"
    return "CONTINUE" if record["artifact_digest"].startswith("sha256:") and record["feature_version"] == record["serving_feature_version"] and {"use","limits","metrics","risks"} <= record["card_sections"] else "REJECT_MODEL_ARTIFACT"

valid = {"case_id": "CASO-TAC-047-2B", **{"artifact_digest":"sha256:model","feature_version":"features-v3","serving_feature_version":"features-v3","card_sections":{"use","limits","metrics","risks"}}}
invalid = {"case_id": "CASO-TAC-047-2B", **{"artifact_digest":"latest","feature_version":"features-v3","serving_feature_version":"features-v2","card_sections":{"use"}}}
uncertain = {**valid}
uncertain.pop("card_sections")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_MODEL_ARTIFACT", "COMPLETE_MODEL_CARD"]` ,
          output: `CONTINUE REJECT_MODEL_ARTIFACT COMPLETE_MODEL_CARD` ,
        },
      },
      {
        id: "S47-T3-A-E1",
        subtopicId: "S47-T3-A",
        kind: "guided",
        instruction: "S47-T3-A-E1 · Verifica el contrato de `batch/online y feature consistency` sobre `CASO-TAC-047-3A`. La entrada es el dict completo del starter; la operación debe demostrar paridad batch/online sin leakage y contract tests. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S47-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `DISABLE_INCONSISTENT_SERVING` en E2.",
        hint: "El DEFECT aprueba skew o leakage: exige batch==online, leakage=False y contract_tests ≥ 3.",
        hints: [
          "Relaciona los campos `batch_features`, `online_features`, `leakage`, `contract_tests` con la regla explicada en S47-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva paridad de features en fixtures; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta `contract_tests` → MISSING / TRACE_FEATURE_PIPELINE", "adverso: online features ≠ batch, leakage=True o contract_tests=0 → DISABLE_INCONSISTENT_SERVING", "CASO-TAC-047-3A es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-3A` satisface un predicado de dominio real; imprime `S47-T3-A PASS` y el assert booleano pasa.",
        feedback: "S47-T3-A-E1: batch==online, leakage=False y ≥3 contract tests. El adverso tiene skew y leakage a la vez.",
        starterCode: {
          language: 'python',
          title: "s47-t3-a-e1.py",
          code: `# CASO-TAC-047 · batch/online feature consistency
# DEFECT: PASS si batch≠online o leakage True
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TAC-047-3A", **{"batch_features":[0.1,0.4,0.8],"online_features":[0.1,0.4,0.8],"leakage":False,"contract_tests":3}}
# DEFECT: train/serve skew o leakage
meets_contract = record["batch_features"] != record["online_features"] or record["leakage"]
status = "PASS" if meets_contract else "DISABLE_INCONSISTENT_SERVING"
print("S47-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t3-a-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-3A", **{"batch_features":[0.1,0.4,0.8],"online_features":[0.1,0.4,0.8],"leakage":False,"contract_tests":3}}
meets_contract = record["batch_features"] == record["online_features"] and not record["leakage"] and record["contract_tests"] >= 3
status = "PASS" if meets_contract else "DISABLE_INCONSISTENT_SERVING"
print("S47-T3-A", status)
assert meets_contract is True` ,
          output: `S47-T3-A PASS` ,
        },
      },
      {
        id: "S47-T3-A-E2",
        subtopicId: "S47-T3-A",
        kind: "independent",
        instruction: "S47-T3-A-E2 · Decide tres rutas de `batch/online y feature consistency`: fixture válido, fixture adverso y registro sin `contract_tests`. Entrada: dict con case_id, batch_features, online_features, leakage, contract_tests. Salidas exactas: `PASS`, `DISABLE_INCONSISTENT_SERVING`, `MISSING:contract_tests`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a contract_tests debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a contract_tests debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T3-A: paridad batch/online sin leakage y contract tests. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta `contract_tests` → MISSING / TRACE_FEATURE_PIPELINE", "adverso: online features ≠ batch, leakage=True o contract_tests=0 → DISABLE_INCONSISTENT_SERVING", "CASO-TAC-047-3A es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `contract_tests` ausente y produce exactamente `PASS DISABLE_INCONSISTENT_SERVING MISSING:contract_tests`.",
        feedback: "S47-T3-A-E2: missing contract_tests → TRACE, no DISABLE. ¿Por qué online distinto del batch es skew aunque el F1 de lab sea alto?",
        starterCode: {
          language: 'python',
          title: "s47-t3-a-e2.py",
          code: `# CASO-TAC-047 · assess DISABLE_INCONSISTENT_SERVING
# DEFECT: PASS con skew o leakage
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "batch_features", "online_features", "leakage", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["batch_features"] != record["online_features"] or record["leakage"] else "DISABLE_INCONSISTENT_SERVING"

valid = {"case_id": "CASO-TAC-047-3A", **{"batch_features":[0.1,0.4,0.8],"online_features":[0.1,0.4,0.8],"leakage":False,"contract_tests":3}}
invalid = {"case_id": "CASO-TAC-047-3A", **{"batch_features":[0.1,0.4,0.8],"online_features":[0.1,0.5,0.8],"leakage":True,"contract_tests":0}}
incomplete = {**valid}
incomplete.pop("contract_tests")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "batch_features", "online_features", "leakage", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["batch_features"] == record["online_features"] and not record["leakage"] and record["contract_tests"] >= 3 else "DISABLE_INCONSISTENT_SERVING"

valid = {"case_id": "CASO-TAC-047-3A", **{"batch_features":[0.1,0.4,0.8],"online_features":[0.1,0.4,0.8],"leakage":False,"contract_tests":3}}
invalid = {"case_id": "CASO-TAC-047-3A", **{"batch_features":[0.1,0.4,0.8],"online_features":[0.1,0.5,0.8],"leakage":True,"contract_tests":0}}
incomplete = {**valid}
incomplete.pop("contract_tests")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS DISABLE_INCONSISTENT_SERVING MISSING:contract_tests` ,
        },
      },
      {
        id: "S47-T3-A-E3",
        subtopicId: "S47-T3-A",
        kind: "transfer",
        instruction: "S47-T3-A-E3 · Contrasta fallo cerrado para `batch/online y feature consistency` con tres fixtures distintos. `CASO-TAC-047-3A` debe continuar, el adverso debe devolver `DISABLE_INCONSISTENT_SERVING` y la ausencia de `contract_tests` debe devolver `TRACE_FEATURE_PIPELINE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `TRACE_FEATURE_PIPELINE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `TRACE_FEATURE_PIPELINE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró paridad batch/online sin leakage y contract tests; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta `contract_tests` → MISSING / TRACE_FEATURE_PIPELINE", "adverso: online features ≠ batch, leakage=True o contract_tests=0 → DISABLE_INCONSISTENT_SERVING", "CASO-TAC-047-3A es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-3A`, adverso y sin `contract_tests` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T3-A-E3: CONTINUE / DISABLE_INCONSISTENT_SERVING / TRACE_FEATURE_PIPELINE. Training-serving skew no se «promueve con fe».",
        starterCode: {
          language: 'python',
          title: "s47-t3-a-e3.py",
          code: `# CASO-TAC-047 · decide DISABLE_INCONSISTENT_SERVING
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "batch_features", "online_features", "leakage", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["batch_features"] != record["online_features"] or record["leakage"] else "DISABLE_INCONSISTENT_SERVING"

valid = {"case_id": "CASO-TAC-047-3A", **{"batch_features":[0.1,0.4,0.8],"online_features":[0.1,0.4,0.8],"leakage":False,"contract_tests":3}}
invalid = {"case_id": "CASO-TAC-047-3A", **{"batch_features":[0.1,0.4,0.8],"online_features":[0.1,0.5,0.8],"leakage":True,"contract_tests":0}}
uncertain = {**valid}
uncertain.pop("contract_tests")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "batch_features", "online_features", "leakage", "contract_tests"}
    missing = sorted(required - record.keys())
    if missing:
        return "TRACE_FEATURE_PIPELINE"
    return "CONTINUE" if record["batch_features"] == record["online_features"] and not record["leakage"] and record["contract_tests"] >= 3 else "DISABLE_INCONSISTENT_SERVING"

valid = {"case_id": "CASO-TAC-047-3A", **{"batch_features":[0.1,0.4,0.8],"online_features":[0.1,0.4,0.8],"leakage":False,"contract_tests":3}}
invalid = {"case_id": "CASO-TAC-047-3A", **{"batch_features":[0.1,0.4,0.8],"online_features":[0.1,0.5,0.8],"leakage":True,"contract_tests":0}}
uncertain = {**valid}
uncertain.pop("contract_tests")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "DISABLE_INCONSISTENT_SERVING", "TRACE_FEATURE_PIPELINE"]` ,
          output: `CONTINUE DISABLE_INCONSISTENT_SERVING TRACE_FEATURE_PIPELINE` ,
        },
      },
      {
        id: "S47-T3-B-E1",
        subtopicId: "S47-T3-B",
        kind: "guided",
        instruction: "S47-T3-B-E1 · Clasifica el contrato de `latency, batching y fallback` sobre `CASO-TAC-047-3B`. La entrada es el dict completo del starter; la operación debe demostrar p95 bajo SLO, batch acotado y fallback probado. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S47-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `ACTIVATE_SAFE_FALLBACK` en E2.",
        hint: "El DEFECT aprueba p95 alto o fallback none: exige p95≤slo, batch 1–64, fallback tipado (p. ej. rules-*) y fallback_tested=True.",
        hints: [
          "Relaciona los campos `p95_ms`, `slo_ms`, `batch_size`, `fallback`, `fallback_tested` con la regla explicada en S47-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva SLO de latencia y fallback probado; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta `fallback_tested` → MISSING / TUNE_BATCH_OR_CAPACITY", "adverso: p95>slo, batch 512, fallback none o untested → ACTIVATE_SAFE_FALLBACK", "CASO-TAC-047-3B es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-3B` satisface un predicado de dominio real; imprime `S47-T3-B PASS` y el assert booleano pasa.",
        feedback: "S47-T3-B-E1: p95≤slo, batch 1–64 y fallback rules-* probado. El adverso viola los tres a la vez.",
        starterCode: {
          language: 'python',
          title: "s47-t3-b-e1.py",
          code: `# CASO-TAC-047 · p95 latency + fallback tested
# DEFECT: PASS si p95>slo o fallback no tested
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TAC-047-3B", **{"p95_ms":120,"slo_ms":180,"batch_size":16,"fallback":"rules-v2","fallback_tested":True}}
# DEFECT: p95 fuera de SLO o fallback no probado
meets_contract = record["p95_ms"] > record["slo_ms"] or not record["fallback_tested"]
status = "PASS" if meets_contract else "ACTIVATE_SAFE_FALLBACK"
print("S47-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t3-b-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-3B", **{"p95_ms":120,"slo_ms":180,"batch_size":16,"fallback":"rules-v2","fallback_tested":True}}
meets_contract = record["p95_ms"] <= record["slo_ms"] and 1 <= record["batch_size"] <= 64 and record["fallback"].startswith("rules-") and record["fallback_tested"]
status = "PASS" if meets_contract else "ACTIVATE_SAFE_FALLBACK"
print("S47-T3-B", status)
assert meets_contract is True` ,
          output: `S47-T3-B PASS` ,
        },
      },
      {
        id: "S47-T3-B-E2",
        subtopicId: "S47-T3-B",
        kind: "independent",
        instruction: "S47-T3-B-E2 · Calcula tres rutas de `latency, batching y fallback`: fixture válido, fixture adverso y registro sin `fallback_tested`. Entrada: dict con case_id, p95_ms, slo_ms, batch_size, fallback, fallback_tested. Salidas exactas: `PASS`, `ACTIVATE_SAFE_FALLBACK`, `MISSING:fallback_tested`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a fallback_tested debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a fallback_tested debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T3-B: p95 bajo SLO, batch acotado y fallback probado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta `fallback_tested` → MISSING / TUNE_BATCH_OR_CAPACITY", "adverso: p95>slo, batch 512, fallback none o untested → ACTIVATE_SAFE_FALLBACK", "CASO-TAC-047-3B es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `fallback_tested` ausente y produce exactamente `PASS ACTIVATE_SAFE_FALLBACK MISSING:fallback_tested`.",
        feedback: "S47-T3-B-E2: missing fallback_tested → TUNE_BATCH_OR_CAPACITY. Sin fallback ensayado el timeout no tiene salida segura.",
        starterCode: {
          language: 'python',
          title: "s47-t3-b-e2.py",
          code: `# CASO-TAC-047 · assess ACTIVATE_SAFE_FALLBACK
# DEFECT: PASS con latencia rota o fallback no ensayado
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "p95_ms", "slo_ms", "batch_size", "fallback", "fallback_tested"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["p95_ms"] > record["slo_ms"] or not record["fallback_tested"] else "ACTIVATE_SAFE_FALLBACK"

valid = {"case_id": "CASO-TAC-047-3B", **{"p95_ms":120,"slo_ms":180,"batch_size":16,"fallback":"rules-v2","fallback_tested":True}}
invalid = {"case_id": "CASO-TAC-047-3B", **{"p95_ms":900,"slo_ms":180,"batch_size":512,"fallback":"none","fallback_tested":False}}
incomplete = {**valid}
incomplete.pop("fallback_tested")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "p95_ms", "slo_ms", "batch_size", "fallback", "fallback_tested"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["p95_ms"] <= record["slo_ms"] and 1 <= record["batch_size"] <= 64 and record["fallback"].startswith("rules-") and record["fallback_tested"] else "ACTIVATE_SAFE_FALLBACK"

valid = {"case_id": "CASO-TAC-047-3B", **{"p95_ms":120,"slo_ms":180,"batch_size":16,"fallback":"rules-v2","fallback_tested":True}}
invalid = {"case_id": "CASO-TAC-047-3B", **{"p95_ms":900,"slo_ms":180,"batch_size":512,"fallback":"none","fallback_tested":False}}
incomplete = {**valid}
incomplete.pop("fallback_tested")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS ACTIVATE_SAFE_FALLBACK MISSING:fallback_tested` ,
        },
      },
      {
        id: "S47-T3-B-E3",
        subtopicId: "S47-T3-B",
        kind: "transfer",
        instruction: "S47-T3-B-E3 · Instrumenta fallo cerrado para `latency, batching y fallback` con tres fixtures distintos. `CASO-TAC-047-3B` debe continuar, el adverso debe devolver `ACTIVATE_SAFE_FALLBACK` y la ausencia de `fallback_tested` debe devolver `TUNE_BATCH_OR_CAPACITY`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `TUNE_BATCH_OR_CAPACITY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `TUNE_BATCH_OR_CAPACITY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró p95 bajo SLO, batch acotado y fallback probado; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta `fallback_tested` → MISSING / TUNE_BATCH_OR_CAPACITY", "adverso: p95>slo, batch 512, fallback none o untested → ACTIVATE_SAFE_FALLBACK", "CASO-TAC-047-3B es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-3B`, adverso y sin `fallback_tested` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T3-B-E3: CONTINUE / ACTIVATE_SAFE_FALLBACK / TUNE_BATCH_OR_CAPACITY. Fallback none nunca es PASS.",
        starterCode: {
          language: 'python',
          title: "s47-t3-b-e3.py",
          code: `# CASO-TAC-047 · decide ACTIVATE_SAFE_FALLBACK
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "p95_ms", "slo_ms", "batch_size", "fallback", "fallback_tested"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["p95_ms"] > record["slo_ms"] or not record["fallback_tested"] else "ACTIVATE_SAFE_FALLBACK"

valid = {"case_id": "CASO-TAC-047-3B", **{"p95_ms":120,"slo_ms":180,"batch_size":16,"fallback":"rules-v2","fallback_tested":True}}
invalid = {"case_id": "CASO-TAC-047-3B", **{"p95_ms":900,"slo_ms":180,"batch_size":512,"fallback":"none","fallback_tested":False}}
uncertain = {**valid}
uncertain.pop("fallback_tested")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "p95_ms", "slo_ms", "batch_size", "fallback", "fallback_tested"}
    missing = sorted(required - record.keys())
    if missing:
        return "TUNE_BATCH_OR_CAPACITY"
    return "CONTINUE" if record["p95_ms"] <= record["slo_ms"] and 1 <= record["batch_size"] <= 64 and record["fallback"].startswith("rules-") and record["fallback_tested"] else "ACTIVATE_SAFE_FALLBACK"

valid = {"case_id": "CASO-TAC-047-3B", **{"p95_ms":120,"slo_ms":180,"batch_size":16,"fallback":"rules-v2","fallback_tested":True}}
invalid = {"case_id": "CASO-TAC-047-3B", **{"p95_ms":900,"slo_ms":180,"batch_size":512,"fallback":"none","fallback_tested":False}}
uncertain = {**valid}
uncertain.pop("fallback_tested")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "ACTIVATE_SAFE_FALLBACK", "TUNE_BATCH_OR_CAPACITY"]` ,
          output: `CONTINUE ACTIVATE_SAFE_FALLBACK TUNE_BATCH_OR_CAPACITY` ,
        },
      },
      {
        id: "S47-T4-A-E1",
        subtopicId: "S47-T4-A",
        kind: "guided",
        instruction: "S47-T4-A-E1 · Audita el contrato de `shadow/canary y monitoring hooks` sobre `CASO-TAC-047-4A`. La entrada es el dict completo del starter; la operación debe demostrar tráfico limitado, quality/error gates y hooks. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S47-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `STOP_CANARY` en E2.",
        hint: "El DEFECT aprueba mode full o over-traffic: exige mode shadow/canary, traffic≤10%, quality_delta ≥ −max_drop, error≤max y hooks=True.",
        hints: [
          "Relaciona los campos `mode`, `traffic_pct`, `quality_delta`, `max_quality_drop`, `error_rate`, `max_error_rate`, `hooks` con la regla explicada en S47-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva canary con criterio promote/stop; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta `hooks` → MISSING / COLLECT_MORE_SHADOW_EVIDENCE", "adverso: mode full, traffic 100%, quality drop o hooks false → STOP_CANARY", "CASO-TAC-047-4A es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-4A` satisface un predicado de dominio real; imprime `S47-T4-A PASS` y el assert booleano pasa.",
        feedback: "S47-T4-A-E1: mode shadow/canary, traffic≤10%, quality y error dentro de presupuesto, hooks on. Mode full al 100% es STOP.",
        starterCode: {
          language: 'python',
          title: "s47-t4-a-e1.py",
          code: `# CASO-TAC-047 · canary traffic + error budget
# DEFECT: PASS si traffic_pct>10 o error_rate>max
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TAC-047-4A", **{"mode":"canary","traffic_pct":5,"quality_delta":0.01,"max_quality_drop":0.02,"error_rate":0.004,"max_error_rate":0.01,"hooks":True}}
# DEFECT: canary sobre tráfico/error permitidos
meets_contract = record["traffic_pct"] > 10 or record["error_rate"] > record["max_error_rate"]
status = "PASS" if meets_contract else "STOP_CANARY"
print("S47-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t4-a-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-4A", **{"mode":"canary","traffic_pct":5,"quality_delta":0.01,"max_quality_drop":0.02,"error_rate":0.004,"max_error_rate":0.01,"hooks":True}}
meets_contract = record["mode"] in {"shadow","canary"} and record["traffic_pct"] <= 10 and record["quality_delta"] >= -record["max_quality_drop"] and record["error_rate"] <= record["max_error_rate"] and record["hooks"]
status = "PASS" if meets_contract else "STOP_CANARY"
print("S47-T4-A", status)
assert meets_contract is True` ,
          output: `S47-T4-A PASS` ,
        },
      },
      {
        id: "S47-T4-A-E2",
        subtopicId: "S47-T4-A",
        kind: "independent",
        instruction: "S47-T4-A-E2 · Compara tres rutas de `shadow/canary y monitoring hooks`: fixture válido, fixture adverso y registro sin `hooks`. Entrada: dict con case_id, mode, traffic_pct, quality_delta, max_quality_drop, error_rate, max_error_rate, hooks. Salidas exactas: `PASS`, `STOP_CANARY`, `MISSING:hooks`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a hooks debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a hooks debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T4-A: tráfico limitado, quality/error gates y hooks. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta `hooks` → MISSING / COLLECT_MORE_SHADOW_EVIDENCE", "adverso: mode full, traffic 100%, quality drop o hooks false → STOP_CANARY", "CASO-TAC-047-4A es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `hooks` ausente y produce exactamente `PASS STOP_CANARY MISSING:hooks`.",
        feedback: "S47-T4-A-E2: missing hooks → COLLECT_MORE_SHADOW_EVIDENCE. El adverso viola mode, traffic, quality y error a la vez.",
        starterCode: {
          language: 'python',
          title: "s47-t4-a-e2.py",
          code: `# CASO-TAC-047 · assess STOP_CANARY
# DEFECT: PASS con canary over-traffic o error alto
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "mode", "traffic_pct", "quality_delta", "max_quality_drop", "error_rate", "max_error_rate", "hooks"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["traffic_pct"] > 10 or record["error_rate"] > record["max_error_rate"] else "STOP_CANARY"

valid = {"case_id": "CASO-TAC-047-4A", **{"mode":"canary","traffic_pct":5,"quality_delta":0.01,"max_quality_drop":0.02,"error_rate":0.004,"max_error_rate":0.01,"hooks":True}}
invalid = {"case_id": "CASO-TAC-047-4A", **{"mode":"full","traffic_pct":100,"quality_delta":-0.2,"max_quality_drop":0.02,"error_rate":0.1,"max_error_rate":0.01,"hooks":False}}
incomplete = {**valid}
incomplete.pop("hooks")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "mode", "traffic_pct", "quality_delta", "max_quality_drop", "error_rate", "max_error_rate", "hooks"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["mode"] in {"shadow","canary"} and record["traffic_pct"] <= 10 and record["quality_delta"] >= -record["max_quality_drop"] and record["error_rate"] <= record["max_error_rate"] and record["hooks"] else "STOP_CANARY"

valid = {"case_id": "CASO-TAC-047-4A", **{"mode":"canary","traffic_pct":5,"quality_delta":0.01,"max_quality_drop":0.02,"error_rate":0.004,"max_error_rate":0.01,"hooks":True}}
invalid = {"case_id": "CASO-TAC-047-4A", **{"mode":"full","traffic_pct":100,"quality_delta":-0.2,"max_quality_drop":0.02,"error_rate":0.1,"max_error_rate":0.01,"hooks":False}}
incomplete = {**valid}
incomplete.pop("hooks")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS STOP_CANARY MISSING:hooks` ,
        },
      },
      {
        id: "S47-T4-A-E3",
        subtopicId: "S47-T4-A",
        kind: "transfer",
        instruction: "S47-T4-A-E3 · Aísla fallo cerrado para `shadow/canary y monitoring hooks` con tres fixtures distintos. `CASO-TAC-047-4A` debe continuar, el adverso debe devolver `STOP_CANARY` y la ausencia de `hooks` debe devolver `COLLECT_MORE_SHADOW_EVIDENCE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `COLLECT_MORE_SHADOW_EVIDENCE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `COLLECT_MORE_SHADOW_EVIDENCE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró tráfico limitado, quality/error gates y hooks; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta `hooks` → MISSING / COLLECT_MORE_SHADOW_EVIDENCE", "adverso: mode full, traffic 100%, quality drop o hooks false → STOP_CANARY", "CASO-TAC-047-4A es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-4A`, adverso y sin `hooks` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T4-A-E3: CONTINUE / STOP_CANARY / COLLECT_MORE_SHADOW_EVIDENCE. Sin hooks no inventes métricas: recolecta evidencia.",
        starterCode: {
          language: 'python',
          title: "s47-t4-a-e3.py",
          code: `# CASO-TAC-047 · decide STOP_CANARY
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "mode", "traffic_pct", "quality_delta", "max_quality_drop", "error_rate", "max_error_rate", "hooks"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["traffic_pct"] > 10 or record["error_rate"] > record["max_error_rate"] else "STOP_CANARY"

valid = {"case_id": "CASO-TAC-047-4A", **{"mode":"canary","traffic_pct":5,"quality_delta":0.01,"max_quality_drop":0.02,"error_rate":0.004,"max_error_rate":0.01,"hooks":True}}
invalid = {"case_id": "CASO-TAC-047-4A", **{"mode":"full","traffic_pct":100,"quality_delta":-0.2,"max_quality_drop":0.02,"error_rate":0.1,"max_error_rate":0.01,"hooks":False}}
uncertain = {**valid}
uncertain.pop("hooks")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "mode", "traffic_pct", "quality_delta", "max_quality_drop", "error_rate", "max_error_rate", "hooks"}
    missing = sorted(required - record.keys())
    if missing:
        return "COLLECT_MORE_SHADOW_EVIDENCE"
    return "CONTINUE" if record["mode"] in {"shadow","canary"} and record["traffic_pct"] <= 10 and record["quality_delta"] >= -record["max_quality_drop"] and record["error_rate"] <= record["max_error_rate"] and record["hooks"] else "STOP_CANARY"

valid = {"case_id": "CASO-TAC-047-4A", **{"mode":"canary","traffic_pct":5,"quality_delta":0.01,"max_quality_drop":0.02,"error_rate":0.004,"max_error_rate":0.01,"hooks":True}}
invalid = {"case_id": "CASO-TAC-047-4A", **{"mode":"full","traffic_pct":100,"quality_delta":-0.2,"max_quality_drop":0.02,"error_rate":0.1,"max_error_rate":0.01,"hooks":False}}
uncertain = {**valid}
uncertain.pop("hooks")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "STOP_CANARY", "COLLECT_MORE_SHADOW_EVIDENCE"]` ,
          output: `CONTINUE STOP_CANARY COLLECT_MORE_SHADOW_EVIDENCE` ,
        },
      },
      {
        id: "S47-T4-B-E1",
        subtopicId: "S47-T4-B",
        kind: "guided",
        instruction: "S47-T4-B-E1 · Decide el contrato de `rollback, retirement y audit` sobre `CASO-TAC-047-4B`. La entrada es el dict completo del starter; la operación debe demostrar last-known-good compatible, rollback y retiro auditado. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S47-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `ROLLBACK_TO_LAST_GOOD` en E2.",
        hint: "El DEFECT ignora last-good o retired: exige current≠last_good, features compatibles, rollback_tested, retired no vacío y audit_entry.",
        hints: [
          "Relaciona los campos `current`, `last_good`, `compatible_features`, `rollback_tested`, `retired`, `audit_entry` con la regla explicada en S47-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva restauración y retirement auditados; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta `audit_entry` → MISSING / REVIEW_RETIREMENT", "adverso: compatible_features false, rollback untested o retired vacío → ROLLBACK_TO_LAST_GOOD", "CASO-TAC-047-4B es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-4B` satisface un predicado de dominio real; imprime `S47-T4-B PASS` y el assert booleano pasa.",
        feedback: "S47-T4-B-E1: current≠last_good, features compatibles, rollback_tested, retired y audit. ¿Qué rompe el adverso primero?",
        starterCode: {
          language: 'python',
          title: "s47-t4-b-e1.py",
          code: `# CASO-TAC-047 · rollback last_good + retirement
# DEFECT: PASS si features incompatibles o rollback no tested
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-TAC-047-4B", **{"current":"1.2.0","last_good":"1.1.0","compatible_features":True,"rollback_tested":True,"retired":{"1.0.0"},"audit_entry":True}}
# DEFECT: features incompatibles o rollback no probado
meets_contract = not record["compatible_features"] or not record["rollback_tested"]
status = "PASS" if meets_contract else "ROLLBACK_TO_LAST_GOOD"
print("S47-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t4-b-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-4B", **{"current":"1.2.0","last_good":"1.1.0","compatible_features":True,"rollback_tested":True,"retired":{"1.0.0"},"audit_entry":True}}
meets_contract = record["current"] != record["last_good"] and record["compatible_features"] and record["rollback_tested"] and "1.0.0" in record["retired"] and record["audit_entry"]
status = "PASS" if meets_contract else "ROLLBACK_TO_LAST_GOOD"
print("S47-T4-B", status)
assert meets_contract is True` ,
          output: `S47-T4-B PASS` ,
        },
      },
      {
        id: "S47-T4-B-E2",
        subtopicId: "S47-T4-B",
        kind: "independent",
        instruction: "S47-T4-B-E2 · Filtra tres rutas de `rollback, retirement y audit`: fixture válido, fixture adverso y registro sin `audit_entry`. Entrada: dict con case_id, current, last_good, compatible_features, rollback_tested, retired, audit_entry. Salidas exactas: `PASS`, `ROLLBACK_TO_LAST_GOOD`, `MISSING:audit_entry`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a audit_entry debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a audit_entry debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T4-B: last-known-good compatible, rollback y retiro auditado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta `audit_entry` → MISSING / REVIEW_RETIREMENT", "adverso: compatible_features false, rollback untested o retired vacío → ROLLBACK_TO_LAST_GOOD", "CASO-TAC-047-4B es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `audit_entry` ausente y produce exactamente `PASS ROLLBACK_TO_LAST_GOOD MISSING:audit_entry`.",
        feedback: "S47-T4-B-E2: missing audit_entry → REVIEW_RETIREMENT. Compatible=False o rollback no tested es breach, no uncertainty.",
        starterCode: {
          language: 'python',
          title: "s47-t4-b-e2.py",
          code: `# CASO-TAC-047 · assess ROLLBACK_TO_LAST_GOOD
# DEFECT: PASS sin compat o sin rollback_tested
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", "current", "last_good", "compatible_features", "rollback_tested", "retired", "audit_entry"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["compatible_features"] or not record["rollback_tested"] else "ROLLBACK_TO_LAST_GOOD"

valid = {"case_id": "CASO-TAC-047-4B", **{"current":"1.2.0","last_good":"1.1.0","compatible_features":True,"rollback_tested":True,"retired":{"1.0.0"},"audit_entry":True}}
invalid = {"case_id": "CASO-TAC-047-4B", **{"current":"1.2.0","last_good":"1.1.0","compatible_features":False,"rollback_tested":False,"retired":set(),"audit_entry":False}}
incomplete = {**valid}
incomplete.pop("audit_entry")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "current", "last_good", "compatible_features", "rollback_tested", "retired", "audit_entry"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["current"] != record["last_good"] and record["compatible_features"] and record["rollback_tested"] and "1.0.0" in record["retired"] and record["audit_entry"] else "ROLLBACK_TO_LAST_GOOD"

valid = {"case_id": "CASO-TAC-047-4B", **{"current":"1.2.0","last_good":"1.1.0","compatible_features":True,"rollback_tested":True,"retired":{"1.0.0"},"audit_entry":True}}
invalid = {"case_id": "CASO-TAC-047-4B", **{"current":"1.2.0","last_good":"1.1.0","compatible_features":False,"rollback_tested":False,"retired":set(),"audit_entry":False}}
incomplete = {**valid}
incomplete.pop("audit_entry")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS ROLLBACK_TO_LAST_GOOD MISSING:audit_entry` ,
        },
      },
      {
        id: "S47-T4-B-E3",
        subtopicId: "S47-T4-B",
        kind: "transfer",
        instruction: "S47-T4-B-E3 · Demuestra fallo cerrado para `rollback, retirement y audit` con tres fixtures distintos. `CASO-TAC-047-4B` debe continuar, el adverso debe devolver `ROLLBACK_TO_LAST_GOOD` y la ausencia de `audit_entry` debe devolver `REVIEW_RETIREMENT`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_RETIREMENT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_RETIREMENT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró last-known-good compatible, rollback y retiro auditado; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta `audit_entry` → MISSING / REVIEW_RETIREMENT", "adverso: compatible_features false, rollback untested o retired vacío → ROLLBACK_TO_LAST_GOOD", "CASO-TAC-047-4B es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-4B`, adverso y sin `audit_entry` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T4-B-E3: CONTINUE / ROLLBACK_TO_LAST_GOOD / REVIEW_RETIREMENT. Borrar el trace no es rollback: es pérdida de evidencia.",
        starterCode: {
          language: 'python',
          title: "s47-t4-b-e3.py",
          code: `# CASO-TAC-047 · decide ROLLBACK_TO_LAST_GOOD
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", "current", "last_good", "compatible_features", "rollback_tested", "retired", "audit_entry"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["compatible_features"] or not record["rollback_tested"] else "ROLLBACK_TO_LAST_GOOD"

valid = {"case_id": "CASO-TAC-047-4B", **{"current":"1.2.0","last_good":"1.1.0","compatible_features":True,"rollback_tested":True,"retired":{"1.0.0"},"audit_entry":True}}
invalid = {"case_id": "CASO-TAC-047-4B", **{"current":"1.2.0","last_good":"1.1.0","compatible_features":False,"rollback_tested":False,"retired":set(),"audit_entry":False}}
uncertain = {**valid}
uncertain.pop("audit_entry")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "current", "last_good", "compatible_features", "rollback_tested", "retired", "audit_entry"}
    missing = sorted(required - record.keys())
    if missing:
        return "REVIEW_RETIREMENT"
    return "CONTINUE" if record["current"] != record["last_good"] and record["compatible_features"] and record["rollback_tested"] and "1.0.0" in record["retired"] and record["audit_entry"] else "ROLLBACK_TO_LAST_GOOD"

valid = {"case_id": "CASO-TAC-047-4B", **{"current":"1.2.0","last_good":"1.1.0","compatible_features":True,"rollback_tested":True,"retired":{"1.0.0"},"audit_entry":True}}
invalid = {"case_id": "CASO-TAC-047-4B", **{"current":"1.2.0","last_good":"1.1.0","compatible_features":False,"rollback_tested":False,"retired":set(),"audit_entry":False}}
uncertain = {**valid}
uncertain.pop("audit_entry")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "ROLLBACK_TO_LAST_GOOD", "REVIEW_RETIREMENT"]` ,
          output: `CONTINUE ROLLBACK_TO_LAST_GOOD REVIEW_RETIREMENT` ,
        },
      },
    ],
  },
  youDo: {
    title: "Proyecto: plataforma MLOps de experimentos, registro y serving (CP-N4-B + CF-4)",
    context: "Production Data/ML Platform con CF-4. Trabaja sobre un modelo sintético de priorización de atención para una organización ficticia en Tacna. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida: run comparable, modelo registrado, deployment canary y decisión auditable. El gate se bloquea si un lineage incompleto, una firma incompatible, una regresión o un fallback ausente impiden la promoción.",
    objectives: [
      "Convertir dataset versionado, commit, entorno fijado, parámetros y firma de features en run comparable, modelo registrado, deployment canary y decisión auditable.",
      "Demostrar el gate: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia.",
      "Probar el fallo: un lineage incompleto, una firma incompatible, una regresión o un fallback ausente impiden la promoción.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-TAC-047`.",
      "Incluye tracking reproducible de baseline/candidato.",
      "Incluye registro con firma, card y approvals.",
      "Incluye paridad batch/online y fallback.",
      "Incluye shadow/canary, monitoring hooks, rollback y retiro.",
      "Automatiza un caso normal, uno de breach (`ROLLBACK_TO_LAST_GOOD` u otro verbo de breach del subtema) y uno incierto (`REVIEW_RETIREMENT` / `INVESTIGATE_*` según evidencia faltante).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-TAC-047"

def log_run(params, metric, rerun, seed, tol):
    ok = seed is not None and bool(params) and abs(metric - rerun) <= tol
    return {"ok": ok, "metric": metric, "seed": seed}

def can_promote(stage, approved, signature_ok):
    return stage == "staging" and approved and signature_ok

def feature_parity(batch_sig, online_sig, leakage=False):
    return batch_sig == online_sig and not leakage

def canary_ok(mode, traffic_pct, error_rate, max_error, hooks):
    return mode in {"shadow", "canary"} and traffic_pct <= 10 and error_rate <= max_error and hooks

def rollback_ready(current, last_good, compatible, tested, retired, audit):
    return current != last_good and compatible and tested and bool(retired) and audit

# Caso normal (Tacna sintético): predicados reales del camino experiment→serve.
normal = {
    "run": log_run({"depth": 4}, 0.81, 0.805, 42, 0.01),
    "promote": can_promote("staging", True, True),
    "parity": feature_parity("features_v3", "features_v3"),
    "canary": canary_ok("canary", 5, 0.004, 0.01, True),
    "rollback": rollback_ready("1.2.0", "1.1.0", True, True, {"1.0.0"}, True),
}

# Breach: canary a 100% sin hooks + rollback incompatible (no inventes PASS).
breach = {
    "canary": canary_ok("full", 100, 0.1, 0.01, False),
    "rollback": rollback_ready("1.2.0", "1.1.0", False, False, set(), False),
}
breach_action = "STOP_CANARY" if not breach["canary"] else "ROLLBACK_TO_LAST_GOOD"

# Incertidumbre: falta audit_entry → no es breach silencioso.
uncertain = {"audit_entry": None}
uncertain_action = "REVIEW_RETIREMENT" if uncertain["audit_entry"] is None else "CONTINUE"

path_ok = all([normal["run"]["ok"], normal["promote"], normal["parity"], normal["canary"], normal["rollback"]])
print(CASE_ID, "normal_ok", path_ok)
print("breach_action", breach_action, "canary_ok", breach["canary"], "rollback_ok", breach["rollback"])
print("uncertain_action", uncertain_action)
# Completa: un segundo breach (p. ej. skew batch/online) y un missing de hooks o approved;
# no marques READY sin que los predicados fallen o pasen de forma explícita.
`,
    portfolioNote: "Evidencia de CP-N4-B + CF-4 · modelo promovible y reversible: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. Parte del scaffold con predicados reales; no pases a READY solo flipando flags sin evidencia.",
    rubric: [
      { criterion: "Correctitud del contrato y gate", weight: "25%" },
      { criterion: "Pruebas normal/breach/uncertain y recuperación", weight: "20%" },
      { criterion: "Seguridad, privacidad y least privilege", weight: "15%" },
      { criterion: "Reproducibilidad, lineage y evidencia", weight: "15%" },
      { criterion: "Operación: SLO, observabilidad y rollback", weight: "15%" },
      { criterion: "Comunicación de trade-offs y límites", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué evidencia permite aprobar tracking y reproducibilidad en CASO-TAC-047?",
        options: ["un print sin assert ni versión", "una captura de pantalla sin fuente", "seed presente, params no vacíos y |metric−rerun| ≤ tolerancia", "datos personales reales para que parezca auténtico"],
        correctIndex: 2,
        explanation: "La teoría exige seed presente, params y rerun dentro de tolerancia; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si el canary rompe el SLO o el rollback es necesario, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["emitir ROLLBACK_TO_LAST_GOOD y conservar evidencia", "continuar y ocultar el warning", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
        correctIndex: 0,
        explanation: "El contrato falla cerrado con ROLLBACK_TO_LAST_GOOD (u otro verbo de breach del subtema); no convierte incertidumbre o breach en éxito.",
      },
      {
        question: "¿Cuál resultado demuestra el gate CP-N4-B + CF-4 (modelo promovible y reversible)?",
        options: ["el archivo S47 existe, aunque no pruebe el gate", "solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia", "el README afirma que funciona", "se usó la herramienta más nueva"],
        correctIndex: 1,
        explanation: "El gate es conductual y medible: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia.",
      },
      {
        question: "¿Qué tratamiento de CASO-TAC-047 respeta el alcance del curso?",
        options: ["reemplazarlo por datos reales sin consentimiento", "subir secretos para facilitar la demo", "inferir fraude o parentesco desde ER", "mantenerlo sintético, mínimo, trazable y sujeto a revisión humana"],
        correctIndex: 3,
        explanation: "Los casos son sintéticos; una señal de prioridad no prueba fraude, parentesco ni riesgo.",
      },
      {
        question: "Un modelo en stage production sin approved=True debe…",
        options: ["servirse igual porque el digest existe", "escalar a 100% de tráfico", "bloquearse hasta aprobación y card mínima", "borrar el baseline para forzar el candidate"],
        correctIndex: 2,
        explanation: "Registry fail-closed: production exige aprobación explícita y artefactos de gobernanza.",
      },
      {
        question: "¿Cuándo se deshabilita el serving por feature consistency?",
        options: ["cuando online diverge del batch o hay leakage sin contract tests", "cuando batch y online emiten el mismo vector y leakage=False", "cuando el F1 de laboratorio es 0.99", "cuando el digest del modelo empieza con sha256:"],
        correctIndex: 0,
        explanation: "Training-serving skew o leakage activan DISABLE_INCONSISTENT_SERVING; un F1 alto en lab no salva features inconsistentes.",
      },
      {
        question: "Un canary con traffic_pct=100 y hooks=False debe…",
        options: ["promoverse porque el modelo ya está en Staging", "detenerse con STOP_CANARY y recolectar más evidencia si faltan hooks", "ignorar el error budget si el digest es correcto", "pasar a Production sin shadow previo"],
        correctIndex: 1,
        explanation: "Canary exige presupuesto de tráfico (p. ej. ≤10%) y hooks activos; over-traffic o hooks off detienen el rollout.",
      },
      {
        question: "¿Qué falta en un artefacto con digest `latest`, features-v3 en train y features-v2 en serving, y card solo con `use`?",
        options: ["nada: basta con que el F1 de laboratorio sea alto", "borrar el baseline para forzar promote", "subir PII real al model card para parecer serio", "digest versionado (sha256), paridad de features y card completa (use/limits/metrics/risks)"],
        correctIndex: 3,
        explanation: "REJECT_MODEL_ARTIFACT / COMPLETE_MODEL_CARD: digest latest, skew train/serve y card incompleta bloquean el artefacto antes del canary.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "MLflow",
        url: "https://mlflow.org/docs/latest/",
        note: "Tracking, registry y serving",
      },
      {
        label: "MLflow Tracking",
        url: "https://mlflow.org/docs/latest/tracking.html",
        note: "Params, metrics, seed y artefactos",
      },
      {
        label: "MLflow Model Registry",
        url: "https://mlflow.org/docs/latest/model-registry.html",
        note: "Stages y approvals",
      },
      {
        label: "KServe",
        url: "https://kserve.github.io/website/latest/",
        note: "Serving, canary y runtimes",
      },
      {
        label: "Feast feature store",
        url: "https://github.com/feast-dev/feast",
        note: "Feature parity train/serve",
      },
      {
        label: "Google Model Cards",
        url: "https://modelcards.withgoogle.com/about",
        note: "Documentación de uso, métricas y límites",
      },
      {
        label: "sklearn model evaluation",
        url: "https://scikit-learn.org/stable/modules/model_evaluation.html",
        note: "Métricas comparables entre runs",
      },
      {
        label: "TFX / ML Metadata (concepts)",
        url: "https://www.tensorflow.org/tfx/guide/mlmd",
        note: "Lineage de artefactos ML",
      },
      {
        label: "Google MLOps whitepaper",
        url: "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning",
        note: "Niveles de MLOps y gates",
      },
      {
        label: "NIST AI RMF",
        url: "https://www.nist.gov/itl/ai-risk-management-framework",
        note: "Gobernanza y human oversight",
      },
    ],
    books: [
      { label: "Building Machine Learning Powered Applications", note: "Serving y feedback loops" },
      { label: "Site Reliability Engineering", note: "SLO, canary y rollback" },
    ],
    courses: [
      { label: "Coursera MLOps courses", url: "https://www.coursera.org/courses?query=mlops", note: "Experiment tracking y deployment" },
      { label: "MIT 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Tests y proyectos reproducibles" },
      { label: "Py4E", url: "https://www.py4e.com", note: "Stdlib-first progressive disclosure" },
      { label: "SRE release engineering", url: "https://sre.google/sre-book/release-engineering/", note: "Canary y rollback conceptual" },
    ],
  },
}
