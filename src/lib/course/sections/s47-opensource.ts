/**
 * S47 — MLOps: experimentos, registro y serving
 *
 * The filename and the exported id ("opensource") both come from a pre-V3 ordering
 * and no longer describe what this section teaches. The id is the URL hash and
 * a learner save key, so it cannot be changed without losing progress.
 *
 * Read `title` below, never the slug. Matching content to the slug is how three
 * agent diagrams ended up attached to a data-testing lesson.
 */
import type { CourseSection } from '../../types'

export const section47: CourseSection = {
  id: "opensource",
  index: 47,
  title: "MLOps: experimentos, registro y serving",
  shortTitle: "MLOps serving",
  tagline: "Production Data/ML Platform: del experimento al servicio con gates, lineage y rollback (CF-4)",
  estimatedHours: 9,
  level: "Producción gobernada",
  phase: 3,
  icon: "Server",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En un equipo de producto en Lima o Arequipa que prioriza atención con un ranker (un modelo que ordena casos por prioridad), MLOps (la ingeniería de llevar modelos a producción) es el día a día. Aquí aprendes el ciclo completo: registrar cada run, comparar el candidato con el baseline en el mismo holdout (datos no vistos en entrenamiento), promover solo con firma y aprobación, y abrir canary al 5% con rollback listo. Si el canary rompe el SLO (objetivo medible de calidad de servicio), se revierte sin borrar evidencia.",
  learningOutcomes: [
    { text: "Registrar un experiment run con params, métricas, seed, artefactos y versión de dataset, y re-ejecutarlo dentro de tolerancia." },
    { text: "Comparar baseline vs. candidato solo cuando data, code, env, split y la definición de métrica coinciden." },
    { text: "Promover un modelo solo con firma compatible, entorno/alias gobernado y aprobación explícita (no solo un digest válido)." },
    { text: "Publicar artefactos con digest, model card completa y compatibilidad de features train/serve." },
    { text: "Garantizar paridad batch/online de features y bloquear serving ante leakage o skew." },
    { text: "Mantener p95 bajo SLO, batch acotado y fallback probado antes de servir tráfico real." },
    { text: "Desplegar shadow/canary con presupuesto de tráfico, hooks de monitoreo y criterio promote/stop." },
    { text: "Ejecutar rollback al last-known-good, retirar versiones y dejar audit_entry sin perder evidencia." },
  ],
  theory: [
    {
            heading: "Un modelo que nadie puede reproducir tampoco se puede defender",
      paragraphs: [
        "Entrenaste algo que funciona. Seis semanas después la métrica cae y alguien pregunta qué cambió: ¿los datos, el código, una versión de librería, la semilla? Si la respuesta honesta es «no sé», el modelo no es un activo — es una anécdota que por ahora funciona.",
        "Un **run** de experimento es el equivalente de un cuaderno de laboratorio: qué parámetros usaste, sobre qué versión del dataset, con qué semilla, y qué métricas salieron. Anotarlo no es burocracia; es lo único que permite comparar dos intentos y decir cuál ganó por mérito y cuál por azar de la partición.",
        "Cuando un candidato gana, hace falta un lugar donde viva con nombre y estado. Un **registry** de modelos es ese archivo: cada versión con su firma —qué entradas espera y qué devuelve—, su ficha de uso y sus límites, y un estado que dice si está en pruebas o sirviendo tráfico. Sin firma, el día que alguien cambie el orden de dos columnas nadie se entera hasta que las predicciones se tuercen.",
        "El error más caro de esta etapa es silencioso: el modelo se entrena con features calculadas de una forma y sirve con features calculadas de otra. Se llama **train/serve skew** y no lanza ninguna excepción — solo produce predicciones peores de lo que prometió el holdout. Por eso se exige paridad explícita entre el cálculo por lotes y el cálculo en línea.",
        "La pregunta que atraviesa la sección es de reversibilidad: **si esto sale mal a las tres de la tarde, ¿puedo volver a la versión anterior sin perder la evidencia de lo que pasó?** De ahí salen el despliegue gradual y el rollback a la última versión buena. Los demos usan la biblioteca estándar sobre `CASO-TAC-047`, una priorización sintética de atenciones en Tacna: sin cluster de GPU ni servicios externos.",
      ],
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-B + CF-4 · modelo promovible y reversible: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Reúne el entregable, el orden de los subtemas y los criterios de promoción.",
        "**Producto incremental.** Una versión del ranker sintético recorre la sección entera: T1 deja un run comparable y un candidato que gana en holdout; T2 lo registra con firma, ficha y aprobación en Staging; T3 exige paridad entre lotes y línea, con latencia medida y plan de respaldo; T4 abre un despliegue gradual al 5% y, si algo rompe, vuelve a la última versión buena conservando la evidencia.",
        "**Orden de los subtemas.** T1 runs y métricas. T2 registry y fichas. T3 features en línea y por lotes. T4 tráfico y rollback.",
        "**Gate.** CP-N4-B y CF-4: solo promueven los controles aprobados, y una versión previa debe poder restaurarse sin perder evidencia.",
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
    },
    {
      heading: "S47-T1-A · Tracking y reproducibilidad de experiment runs",
      figure: {
        id: "S47-registry-promotion",
        caption:
          "Sin una versión anterior nombrada no hay rollback: solo hay un modelo en producción y ninguna salida.",
        alt:
          "Cuatro guardas que deciden si un candidato puede promoverse.",
      },
      subtopicId: "S47-T1-A",
      paragraphs: [
        "Tracking registra **parámetros, métricas, seed, artefactos y versión de dataset**. Reproducibilidad no es «el dashboard se ve bien»: es poder **re-ejecutar el run** con el mismo seed y params y obtener la métrica dentro de una tolerancia declarada. Sin seed presente y sin params no vacíos, el número es anécdota, no evidencia de promote.",
        "Contrato de reproducibilidad. Entrada: `seed`, `params`, `metric`, `rerun_metric`, `tolerance`. Salida: `PASS` solo si el seed está presente, hay params y `|metric − rerun| ≤ tolerance`. Error local: delta fuera de tolerancia o params vacíos → `MARK_RUN_NONREPRODUCIBLE`. Si falta `tolerance` → `INVESTIGATE_RANDOMNESS` (incertidumbre, no breach silencioso).",
        "En `CASO-TAC-047-1A` (priorización sintética en Tacna) el run con seed fijo, `depth=4` y f1 0.81 vs. rerun 0.805 (tol 0.01) es reproducible. Un run con params vacíos o delta 0.16 se marca no reproducible aunque el score «parezca» alto. Sin PII; el score no prueba fraude ni parentesco.",
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
      figure: {
        id: "S47-model-lineage",
        caption:
          "Sin datos, código y entorno anotados, un experimento no se puede volver a correr.",
        alt:
          "Flujo de un experimento al registro y al serving, con datos, codigo y entorno acompanando cada paso.",
      },
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
      figure: {
        id: "S47-shadow-vs-canary",
        caption:
          "Shadow responde a «¿se cae?»; canary a «¿empeora la calidad para alguien real?». No se saltan.",
        alt:
          "Tres barras con el porcentaje de tráfico que ve la salida en shadow, canary y despliegue completo.",
      },
      subtopicId: "S47-T2-A",
      paragraphs: [
        "Con un candidato que ya ganó en holdout, el **registry** exige otra capa de gobernanza. Una firma fija nombres y tipos de entrada/salida (el **contrato del servicio**, no un dict inventado por el run). En la práctica moderna de MLflow se prefieren **alias** (`champion`/`challenger`) y tags de validación por versión; en este lab modelamos el mismo gate con un entorno gobernado (`staging` antes de `production`). La aprobación es **independiente del digest**: un hash correcto sin `approved=True` no autoriza el entorno de producción.",
        "Contrato de promoción. Entrada: `input_signature`, `output_signature`, `stage`, `approved` y el contrato de servicio `SERVICE_SIG`. Salida: `PASS` solo si la firma del modelo **coincide** con `SERVICE_SIG`, el stage es `staging` y hay aprobación explícita. Error local: firma rota, stage ilegal o promote a production sin approve → `DENY_MODEL_PROMOTION`. Si falta `approved` → `REQUEST_MODEL_APPROVAL`.",
        "En `CASO-TAC-047-2A` el ranker de priorización en Tacna declara firma `age:int`, `region:str` → `priority:float`, stage `staging` y `approved=True` (equivalente didáctico a un alias de pre-producción con tag de aprobación). Un fixture con firma rota y `stage=production` sin approve se deniega (`DENY_MODEL_PROMOTION`) aunque el digest del artefacto exista: la igualdad es contra el contrato del servicio, no contra «lo que el run diga».",
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
          "Contrato S47-T2-B: demuestra digest, card y compatibilidad verificadas. Falla cerrada con `REJECT_MODEL_ARTIFACT` y deriva incertidumbre mediante `COMPLETE_MODEL_CARD`.",
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
      figure: {
        id: "S47-canary-budget",
        caption:
          "Un canary se detiene si falla cualquiera de sus cuatro presupuestos, no solo el de error.",
        alt:
          "Barras comparadas de los cuatro presupuestos que vigila un canary: error, latencia, costo y saturacion.",
      },
      subtopicId: "S47-T4-A",
      paragraphs: [
        "El modelo ya sirve con SLO; ahora el tráfico se abre con cuidado. **Shadow** observa sin decidir; **canary** recibe un presupuesto de tráfico (p. ej. ≤ 10%) y los monitoring hooks comparan calidad, drift y errores antes de promover. Un mode `full` al 100% sin hooks no es canary: es un deploy a ciegas.",
        "Contrato de canary. Entrada: `mode`, `traffic_pct`, `quality_delta`, `max_quality_drop`, `error_rate`, `max_error_rate`, `hooks`. Salida: `PASS` solo si mode es shadow/canary, tráfico ≤ 10%, calidad dentro de presupuesto (`quality_delta ≥ −max_quality_drop`), **errores bajo el techo** (`error_rate ≤ max_error_rate`) y hooks activos. Error local: over-traffic, calidad caída o hooks off → `STOP_CANARY`. Si falta `hooks` → `COLLECT_MORE_SHADOW_EVIDENCE`.",
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
        "En `CASO-TAC-047-4B` el equipo de priorización en Tacna restaura de `1.2.0` a `1.1.0` (last-known-good) con features compatibles, rollback ensayado en staging, `1.0.0` retirado y `audit_entry` firmado. Un path con `compatible_features=False` o rollback no probado fuerza `ROLLBACK_TO_LAST_GOOD`. Un `retired` vacío o un `audit_entry` ausente no son eso: no hay nada roto en el artefacto al que vuelves, falta la constancia de quién retiró qué, así que la ruta es `REVIEW_RETIREMENT` — nunca se borra el trace para «limpiar» el tablero.",
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
        preamble:
          "Antes de comparar un candidato con el baseline en el ranker de Tacna, el run debe ser **re-ejecutable**. En esta demo un experiment sintético (`depth=4`, metric 0.81, rerun 0.805, tol 0.01) exige seed presente, params no vacíos y delta dentro de tolerancia. No escribas aún: predice `run_ok`, el `seed` y el `delta` antes de mirar la salida. Si crees que «semilla fija» basta sin params ni rerun, el dashboard miente y el promote se basa en anécdota.",
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
        why: "`within_tol` modela el contrato de re-ejecución: el delta 0.005 ≤ 0.01 es evidencia, no magia del dashboard. `bool(params)` y `seed is not None` cierran el caso de run vacío o sin ancla aleatoria. Orden: tracking reproducible antes de lineage comparable. En We Do repararás el comparador invertido (`>` vs. `≤`), la tabla PASS/MARK/MISSING y decide CONTINUE/MARK/INVESTIGATE.",
        retrospective:
          "Si puedes explicar por qué un F1 alto sin seed o con params vacíos no es promote, ya tienes el hábito de evidencia de run. El error clásico es confiar en un score de una sola corrida. En We Do practicarás el predicado, las tres rutas y la rama de incertidumbre cuando falta `tolerance`.",
      },
      {
        demoId: "S47-T1-B-DEMO",
        subtopicId: "S47-T1-B",
        environment: "local-python",
        description: "Demo: lineage completo y comparación candidato > baseline",
        preamble:
          "Habiendo fijado el rerun, el riesgo es **comparar manzanas con naranjas**. En esta demo un candidato 0.82 en holdout-v1 con lineage `ds-v3` / `git:abc` / `locked` supera al baseline 0.78; un run con split=train o code=latest se invalida aunque el score sea 0.90. No escribas: predice `ok`, `invalid` y el `delta` 0.04. Si promueves por score sin anclas de data/code/env/split/métrica, el registry recibe basura comparable solo en el papel.",
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
        why: "`lineage` exige campos no vacíos; `versioned` bloquea `latest`, `train` y `unknown`; solo entonces `candidate > baseline` cuenta. Un score alto en train no es evidencia de promote: la comparación se invalida aunque el número «gane» en el papel. En We Do corregirás el predicado invertido, assess INVALIDATE/MISSING y decide RESTORE_LINEAGE.",
        retrospective:
          "Comparación honesta = mismas anclas + holdout + métrica definida. Un F1 0.90 en train no gana al baseline: la comparación se invalida. Pregunta: si `code=latest` y el score es 0.85, ¿qué falta para que el delta cuente en el registry? We Do: predicado, tres rutas y rama RESTORE_LINEAGE.",
      },
      {
        demoId: "S47-T2-A-DEMO",
        subtopicId: "S47-T2-A",
        environment: "local-python",
        description: "Demo: firma vs. SERVICE_SIG + staging + approved",
        preamble:
          "Con un candidato que ya ganó en holdout, el **registry** exige otra capa. En esta demo la firma `age:int`, `region:str` → `priority:float` solo promueve en `staging` con `approved=True`. Un fixture en production sin approve o con firma rota se deniega. No escribas: predice `staging_ok`, `prod_no_approve` y `bad_sig`. Si confundes digest válido con permiso de promote, el entorno de producción se abre sin gobernanza.",
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
        why: "La igualdad es contra `SERVICE_SIG` (contrato del servicio), no contra «lo que el run diga». `approved` es independiente del hash: un digest correcto sin aprobación no autoriza production. En lab `staging` modela el gate pre-producción (alias/tag en MLflow moderno). En We Do repararás el predicado, assess DENY/MISSING y REQUEST_MODEL_APPROVAL.",
        retrospective:
          "Promote = firma exacta al servicio + stage gobernado + aprobación explícita. Un digest válido no es permiso. Pregunta: si el JSON ya dice `stage=production` sin `approved`, ¿qué imprime `prod_no_approve` y por qué? We Do: predicado, tres rutas y REQUEST_MODEL_APPROVAL.",
      },
      {
        demoId: "S47-T2-B-DEMO",
        subtopicId: "S47-T2-B",
        environment: "local-python",
        description: "Demo: digest sha256, features alineadas y card mínima",
        preamble:
          "El registry no solo guarda un pickle: el artefacto del ranker de Tacna necesita **digest versionado**, **misma feature version** en train y serving, y **model card** con uso, límites, métricas y riesgos. Observa `ok`, `skew` y `thin`: latest, skew o card solo con `use` son rechazo. No escribas aún. Si publicas sin card, producto no sabe cuándo el score no aplica.",
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
        why: "`startswith(\"sha256:\")` modela digest real; la igualdad train/serve evita skew silencioso; `REQUIRED <= sections` exige card mínima (use/limits/metrics/risks). Thin card y `latest` no son cosméticos: bloquean el artefacto antes del canary. El revisor de registry no promociona un pickle sin card. En We Do practicarás predicado, REJECT/MISSING y COMPLETE_MODEL_CARD.",
        retrospective:
          "Artefacto gobernado = digest + paridad de features + card completa. Promote con `latest` es el error clásico del registry. Pregunta: si la card solo tiene `use`, ¿qué sección falta para que producto sepa cuándo el score no aplica? We Do: tres capas hasta COMPLETE_MODEL_CARD.",
      },
      {
        demoId: "S47-T3-A-DEMO",
        subtopicId: "S47-T3-A",
        environment: "local-python",
        description: "Demo: paridad batch/online y anti-leakage",
        preamble:
          "Habiendo registrado el modelo, el riesgo clásico de production es el **training-serving skew**. En esta demo batch y online emiten `[0.1, 0.4, 0.8]` con leakage=False y 3 contract tests; si online diverge o hay leakage, el predicado falla. No escribas: predice `ok`, `skew` y `leak`. Si sirves con features distintas, el F1 de laboratorio no describe el tráfico de Tacna.",
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
        why: "La igualdad de vectores modela paridad batch/online; `not leakage` bloquea información del futuro o del label; `tests >= 3` exige contract tests mínimos antes del canary. Un F1 alto en lab no salva features inconsistentes. En We Do repararás predicado, DISABLE/MISSING y TRACE_FEATURE_PIPELINE.",
        retrospective:
          "Paridad + anti-leakage + contract tests = permiso de servir. «Online es casi igual» no es paridad: un float distinto en el vector es skew real. Pregunta: con vectores idénticos pero `leakage=True`, ¿por qué el predicado sigue en False? We Do: DISABLE / TRACE_FEATURE_PIPELINE.",
      },
      {
        demoId: "S47-T3-B-DEMO",
        subtopicId: "S47-T3-B",
        environment: "local-python",
        description: "Demo: p95 bajo SLO, batch acotado y fallback probado",
        preamble:
          "Con features alineadas, el serving aún puede fallar por **latencia y capacidad**. En esta demo p95 120 ms con SLO 180, batch 16 y `rules-v2` ensayado pasa; p95 900 o batch 512 con fallback `none` falla. No escribas: predice `ok`, `slow` y `no_fb`. Si no hay fallback probado, el timeout del ranker de Tacna se convierte en caída silenciosa del producto.",
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
        why: "p95≤slo es presupuesto de experiencia del ranker; batch acotado (1–64) evita sobrecarga; `fallback.startswith(\"rules-\")` y `tested` exigen salida tipada y ensayada. Sin fallback el timeout no tiene salida segura y el producto de Tacna cae en silencio. En We Do practicarás predicado, ACTIVATE/MISSING y TUNE_BATCH_OR_CAPACITY.",
        retrospective:
          "SLO + batch + fallback ensayado = permiso de tráfico real. «Luego medimos p95» es el error clásico del serving. Pregunta: con p95 120 y fallback `none`, ¿por qué `no_fb` es False aunque la latencia esté bien? We Do: tres capas hasta TUNE.",
      },
      {
        demoId: "S47-T4-A-DEMO",
        subtopicId: "S47-T4-A",
        environment: "local-python",
        description: "Demo: canary ≤10% con quality_delta, error budget y hooks",
        preamble:
          "El modelo ya sirve con SLO; ahora el tráfico se abre con cuidado. En esta demo canary al 5% con error 0.4%, quality dentro de presupuesto y hooks activos devuelve `gates_green`; mode `full` al 100% o quality drop fuerte devuelve `stop`. No escribas: predice las tres salidas. Si abres al 100% sin hooks, no es canary: es deploy a ciegas del ranker de Tacna.",
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
        why: "mode ∈ {shadow, canary}, traffic≤10, quality_delta ≥ −max_drop, error≤max y hooks unen presupuesto y observabilidad. `full` no es modo válido de canary: es deploy a ciegas del ranker. Sin hooks no hay criterio promote/stop. En We Do repararás predicado, STOP/MISSING y COLLECT_MORE_SHADOW_EVIDENCE.",
        retrospective:
          "Canary = presupuesto de tráfico + calidad + errores + hooks. Full rollout «porque el digest es bueno» no es canary. Pregunta: con canary 5% y quality_delta −0.2 bajo max_drop 0.05, ¿por qué `quality_drop` es stop? We Do: tres capas hasta COLLECT.",
      },
      {
        demoId: "S47-T4-B-DEMO",
        subtopicId: "S47-T4-B",
        environment: "local-python",
        description: "Demo: rollback a last-good con retirement auditado",
        preamble:
          "Si el canary falla — o una versión envejeció — CF-4 exige **rollback al last-known-good** con features compatibles y **retirement** auditado. En esta demo `1.2.0` → `1.1.0` con retired `1.0.0` y audit pasa; incompat o sin audit falla. No escribas: predice `ok`, `incompat` y `no_audit`. Borrar el trace para «limpiar el tablero» destruye el gate de auditoría del ranker de Tacna.",
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
        why: "current≠last_good, compatible, tested, retired no vacío y audit son predicados de seguridad del cierre CF-4; no son checklist cosmético. Sin features compatibles ni audit entry no hay restauración defendible ante el revisor. En We Do practicarás predicado, ROLLBACK/MISSING y REVIEW_RETIREMENT.",
        retrospective:
          "Rollback sin audit no cierra CF-4: «ya volvimos a la versión anterior» sin evidencia es anécdota. Borrar el trace para limpiar el tablero destruye el gate. Pregunta: con features incompatibles, ¿por qué `incompat` es False aunque exista last_good? We Do: ROLLBACK / REVIEW_RETIREMENT.",
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
        title: "Rerun dentro de tolerancia con seed",
        preamble:
          "- **Contexto:** en `CASO-TAC-047-1A`, el equipo de priorización en Tacna solo acepta un run si el rerun cae dentro de tolerancia con seed y params.\n- **Meta:** corregir `meets_contract` (seed presente + params no vacíos + `|metric−rerun| ≤ tol`).\n- **Éxito:** imprimes exactamente `S47-T1-A PASS` con el fixture válido.\n- **Límites:** no inventes métricas; no borres el assert; no toques los datos del fixture.",
        instruction:
          "S47-T1-A-E1 · Salida: debe devolver el PASS del contrato. 1. Abre el starter: `meets_contract` usa `>` (bug: aprueba lo no reproducible).\n2. Exige `record.get(\"seed\") is not None` y `bool(record[\"params\"])`.\n3. Cambia a `abs(metric - rerun_metric) <= tolerance`.\n4. Conserva el print `S47-T1-A` y el status PASS/MARK_RUN_NONREPRODUCIBLE.",
        hint: "El starter usa `>` en lugar de `≤`: invierte la dirección del comparador de tolerancia y exige seed presente + params no vacíos.",
        hints: [
          "Relaciona los campos `seed`, `params`, `metric`, `rerun_metric`, `tolerance` con la regla explicada en S47-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva rerun dentro de tolerancia declarada; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["Falta `tolerance` → MISSING / INVESTIGATE_RANDOMNESS", "Adverso: params vacíos y/o |metric−rerun| > tolerance (seed nulo también falla) → MARK_RUN_NONREPRODUCIBLE", "CASO-TAC-047-1A es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-1A` satisface un predicado de dominio real; imprime `S47-T1-A PASS` y el assert booleano pasa.",
        feedback:
          "PASS exige las tres anclas a la vez: seed, params y delta ≤ tol. Un delta 0.005 con tol 0.01 es reproducible; invertir el comparador marca PASS justo cuando el run es basura. El revisor de experiments lo exige antes del registry.",
        retrospective:
          "Reproducibilidad = re-ejecución controlada, no un score bonito. El starter marca PASS justo cuando el delta **supera** la tol. El error clásico es solo mirar el número grande. Pregunta: con delta 0.005 y tol 0.01, ¿por qué `>` es exactamente el anti-predicado del promote? Siguiente (E2): tres rutas válido / adverso / missing `tolerance`.",
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
        title: "Tres rutas de tracking (PASS / MARK / MISSING)",
        preamble:
          "- **Contexto:** el revisor de experiments en Tacna no trata igual un run limpio, uno divergente y uno sin tolerancia declarada.\n- **Meta:** implementar `assess` que distinga PASS, MARK_RUN_NONREPRODUCIBLE y MISSING:tolerance.\n- **Éxito:** imprime `PASS MARK_RUN_NONREPRODUCIBLE MISSING:tolerance` en ese orden.\n- **Límites:** si falta `tolerance`, no evalúes el delta; no inventes el campo; missing ≠ «marcar no reproducible».",
        instruction:
          "S47-T1-A-E2 · Salida: debe devolver el PASS del contrato. 1. Revisa el starter: con campos presentes devuelve PASS si el delta es *mayor* que tol (bug: invertido).\n2. Primero: calcula `missing` de required; si hay → `MISSING:…`.\n3. Luego: seed + params + delta ≤ tol → PASS; si no → MARK_RUN_NONREPRODUCIBLE.\n4. Imprime los tres resultados con `print(*results)`.",
        hint: "Primero se calcula `missing`; ningún acceso a tolerance debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a tolerance debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T1-A: rerun dentro de tolerancia con seed/parámetros. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta `tolerance` → MISSING / INVESTIGATE_RANDOMNESS", "Adverso: params vacíos y/o |metric−rerun| > tolerance (seed nulo también falla) → MARK_RUN_NONREPRODUCIBLE", "CASO-TAC-047-1A es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `tolerance` ausente y produce exactamente `PASS MARK_RUN_NONREPRODUCIBLE MISSING:tolerance`.",
        feedback:
          "El orden importa: missing primero; luego contenido. Params vacíos o delta alto son breach de métrica; falta de tolerancia es incertidumbre de protocolo, no lo mismo para el revisor de promote.",
        retrospective:
          "Missing es incertidumbre de protocolo; params vacíos o delta alto son breach de métrica. El error clásico es tratar «falta tolerancia» como fallo de score. Pregunta: si el revisor ve `MISSING:tolerance`, ¿pide un rerun o un MARK? Luego (E3): CONTINUE / MARK / INVESTIGATE_RANDOMNESS.",
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
        title: "Decide tracking: CONTINUE o INVESTIGATE",
        preamble:
          "- **Contexto:** en producción del ranker de Tacna, un run incompleto no «sigue con warning»: o continúa con evidencia o se investiga.\n- **Meta:** `decide` → CONTINUE (reproducible), MARK_RUN_NONREPRODUCIBLE (adverso), INVESTIGATE_RANDOMNESS (sin tolerance).\n- **Éxito:** `CONTINUE MARK_RUN_NONREPRODUCIBLE INVESTIGATE_RANDOMNESS`.\n- **Límites:** no inventes `tolerance`; no conviertas missing en CONTINUE; no toques los fixtures.",
        instruction:
          "S47-T1-A-E3 · Salida: debe devolver el PASS del contrato. 1. Corrige missing: sin `tolerance` → `INVESTIGATE_RANDOMNESS` (no CONTINUE).\n2. Con record completo, reutiliza el predicado de E1/E2 (seed + params + delta ≤ tol).\n3. Solo el limpio es CONTINUE; el de params vacíos/delta alto es MARK_RUN_NONREPRODUCIBLE.\n4. Imprime los tres códigos en orden.",
        hint: "Una ausencia no equivale a breach: enrútala a `INVESTIGATE_RANDOMNESS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `INVESTIGATE_RANDOMNESS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró rerun dentro de tolerancia con seed/parámetros; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["Falta `tolerance` → MISSING / INVESTIGATE_RANDOMNESS", "Adverso: params vacíos y/o |metric−rerun| > tolerance (seed nulo también falla) → MARK_RUN_NONREPRODUCIBLE", "CASO-TAC-047-1A es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-1A`, adverso y sin `tolerance` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "Missing ≠ breach. CONTINUE exige seed+params+delta≤tol; MARK es contenido adverso; INVESTIGATE es incertidumbre de protocolo. No promociones con «falta tolerancia, igual se ve estable».",
        retrospective:
          "Un campo ausente es investigación, no un allow optimista. El error clásico es promover con «falta tolerancia, igual se ve estable». Pregunta: ¿por qué MARK no es lo mismo que INVESTIGATE?",
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
        title: "Lineage completo y candidato > baseline",
        preamble:
          "- **Contexto:** en `CASO-TAC-047-1B`, el ranker de Tacna solo entra a la tabla de comparación si data/code/env/split/métrica están versionados y el candidato gana en holdout.\n- **Meta:** completar `meets_contract` (lineage + no latest/train/unknown + candidate > baseline).\n- **Éxito:** `S47-T1-B PASS`.\n- **Límites:** no cambies scores del fixture; no aceptes `code=latest` «por conveniencia».",
        instruction:
          "S47-T1-B-E1 · Salida: debe devolver el PASS del contrato. 1. Abre el starter: `not record[\"data\"] or candidate <= baseline` (bug: aprueba lo inválido).\n2. Calcula `lineage_ok` con `all(...)` sobre data/code/env/split/metric_definition.\n3. Añade `versioned` (code ≠ latest, split ≠ train, metric ≠ unknown).\n4. Exige `candidate > baseline` y conserva print/status.",
        hint: "El DEFECT niega el data o exige candidate ≤ baseline: invierte a lineage completo + versionado (no latest/train/unknown) + candidate > baseline.",
        hints: [
          "Relaciona los campos `data`, `code`, `env`, `split`, `metric_definition`, `candidate`, `baseline` con la regla explicada en S47-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva lineage completo y comparación homogénea; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["Falta `baseline` → MISSING / RESTORE_LINEAGE", "Adverso: data/env vacíos, code=latest, split=train o metric unknown → INVALIDATE_COMPARISON", "CASO-TAC-047-1B es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-1B` satisface un predicado de dominio real; imprime `S47-T1-B PASS` y el assert booleano pasa.",
        feedback:
          "Un candidate 0.90 con split=train se invalida aunque «gane» al baseline: no hay comparación homogénea. El holdout y la definición de métrica son parte del contrato, no adornos del revisor de promote.",
        retrospective:
          "Lineage completo es el ticket de entrada a la tabla; `candidate > baseline` solo cuenta después. El starter invierte y «aprueba» lo no comparable. Pregunta: con candidate 0.90 y split=train, ¿PASS o INVALIDATE aunque gane al 0.78? Siguiente: PASS / INVALIDATE / MISSING:baseline.",
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
        title: "Tres rutas de comparación (PASS / INVALIDATE / MISSING)",
        preamble:
          "- **Contexto:** el gate de comparación en Tacna separa run limpio, run no comparable y registro sin baseline.\n- **Meta:** `assess` → PASS, INVALIDATE_COMPARISON, MISSING:baseline.\n- **Éxito:** `PASS INVALIDATE_COMPARISON MISSING:baseline`.\n- **Límites:** sin baseline no evalúes candidate; no rellenes lineage vacío.",
        instruction:
          "S47-T1-B-E2 · Salida: debe devolver el PASS del contrato. 1. Starter: PASS si falta data o candidate ≤ baseline (bug: aprueba lo no comparable).\n2. Primero: calcula `missing` de required; si hay → `MISSING:…` (sin tocar baseline).\n3. Luego: `lineage_ok` + `versioned` + `candidate > baseline` → PASS; si no → INVALIDATE_COMPARISON.\n4. Imprime `PASS INVALIDATE_COMPARISON MISSING:baseline` con `print(*results)`.",
        hint: "Primero se calcula `missing`; ningún acceso a baseline debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a baseline debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T1-B: data, code, env, split y métrica versionados, y candidato mejor. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta `baseline` → MISSING / RESTORE_LINEAGE", "Adverso: data/env vacíos, code=latest, split=train o metric unknown → INVALIDATE_COMPARISON", "CASO-TAC-047-1B es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `baseline` ausente y produce exactamente `PASS INVALIDATE_COMPARISON MISSING:baseline`.",
        feedback:
          "Missing de baseline es incertidumbre (luego RESTORE); un candidate 0.90 con split=train sigue siendo INVALIDATE por contenido. El revisor no confunde «sin baseline» con «trampa de score».",
        retrospective:
          "Missing de baseline es incertidumbre (luego RESTORE), no trampa de score. Un 0.90 con train sigue siendo INVALIDATE por contenido. Pregunta: ¿por qué no rellenar `baseline` inventado para forzar PASS? Luego (E3): CONTINUE / INVALIDATE / RESTORE_LINEAGE.",
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
        title: "Decide comparación: CONTINUE o RESTORE",
        preamble:
          "- **Contexto:** sin baseline o con lineage roto, el promote del ranker no «sigue con fe».\n- **Meta:** `decide` → CONTINUE / INVALIDATE_COMPARISON / RESTORE_LINEAGE.\n- **Éxito:** esa tripleta exacta.\n- **Límites:** no inventes baseline; no conviertas uncertainty en CONTINUE.",
        instruction:
          "S47-T1-B-E3 · Salida: debe devolver el PASS del contrato. 1. Missing → RESTORE_LINEAGE (no CONTINUE).\n2. Completo: reutiliza predicado de E1/E2.\n3. Adverso (latest/train/unknown) → INVALIDATE_COMPARISON.\n4. Imprime en orden valid/invalid/uncertain.",
        hint: "Una ausencia no equivale a breach: enrútala a `RESTORE_LINEAGE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RESTORE_LINEAGE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró data, code, env, split y métrica versionados, y candidato mejor; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["Falta `baseline` → MISSING / RESTORE_LINEAGE", "Adverso: data/env vacíos, code=latest, split=train o metric unknown → INVALIDATE_COMPARISON", "CASO-TAC-047-1B es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-1B`, adverso y sin `baseline` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE exige lineage versionado y candidate > baseline; INVALIDATE es contenido no comparable; RESTORE es baseline ausente. Un score alto no salva lineage incompleto ante el revisor de promote.",
        retrospective:
          "Restaurar lineage es trabajo de evidencia, no castigo por score bajo. El error clásico es invalidar un run incompleto como si fuera trampa. Pregunta: ¿qué ancla falta más a menudo en tu equipo — data, code o env?",
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
        title: "Firma, staging y approved=True",
        preamble:
          "- **Contexto:** en `CASO-TAC-047-2A`, el ranker de Tacna solo entra a staging con firma exacta al servicio y aprobación explícita.\n- **Meta:** `meets_contract` con SERVICE_SIG + stage=staging + approved.\n- **Éxito:** `S47-T2-A PASS`.\n- **Límites:** no saltes a production; no aflojes la firma «por demo».",
        instruction:
          "S47-T2-A-E1 · Salida: debe devolver el PASS del contrato. 1. Starter: `not approved or stage == \"production\"` (bug: aprueba promote ilegal).\n2. Compara `input_signature` y `output_signature` con `SERVICE_SIG` del servicio.\n3. Exige `stage == \"staging\"` y `approved` truthy a la vez.\n4. Conserva el print `S47-T2-A` y el status PASS o DENY_MODEL_PROMOTION.",
        hint: "El DEFECT aprueba cuando falta approved o stage=production: exige firma igual al contrato del servicio, stage=staging y approved=True.",
        hints: [
          "Relaciona los campos `input_signature`, `output_signature`, `stage`, `approved` con la regla explicada en S47-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva firma compatible y aprobación trazada; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["Falta `approved` → MISSING / REQUEST_MODEL_APPROVAL", "Adverso: production + approved=False + firma rota → DENY_MODEL_PROMOTION", "CASO-TAC-047-2A es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-2A` satisface un predicado de dominio real; imprime `S47-T2-A PASS` y el assert booleano pasa.",
        feedback:
          "Production sin approve es DENY, no «casi listo». La firma rota (age:str, output vacío) también deniega aunque el stage sea staging: el registry no confunde digest con gobernanza.",
        retrospective:
          "Aprobación y firma son gates distintos del digest. El starter da luz verde justo cuando production no está aprobada. Pregunta: con firma `age:str` y stage staging, ¿PASS o DENY aunque approved=True? Siguiente (E2): PASS / DENY / MISSING:approved.",
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
        title: "Tres rutas de promote (PASS / DENY / MISSING)",
        preamble:
          "- **Contexto:** el revisor del registry en Tacna separa promote limpio, promote ilegal y registro sin flag de aprobación.\n- **Meta:** `assess` → PASS, DENY_MODEL_PROMOTION, MISSING:approved.\n- **Éxito:** esa tripleta exacta.\n- **Límites:** sin approved no evalúes stage; no rellenes el booleano.",
        instruction:
          "S47-T2-A-E2 · Salida: debe devolver el PASS del contrato. 1. Starter invierte PASS/DENY cuando el record está completo.\n2. Primero `missing` de required; sin `approved` → `MISSING:approved` (no evalúes stage).\n3. Luego `sig_ok` + staging + approved → PASS; si no → DENY_MODEL_PROMOTION.\n4. Imprime la tripleta con `print(*results)`.",
        hint: "Primero se calcula `missing`; ningún acceso a approved debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a approved debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T2-A: firma exacta, staging y aprobación. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta `approved` → MISSING / REQUEST_MODEL_APPROVAL", "Adverso: production + approved=False + firma rota → DENY_MODEL_PROMOTION", "CASO-TAC-047-2A es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `approved` ausente y produce exactamente `PASS DENY_MODEL_PROMOTION MISSING:approved`.",
        feedback:
          "Missing approved es REQUEST en E3, no DENY. El adverso combina firma y stage ilegal: breach de contenido. El revisor del registry no inventa el flag de aprobación.",
        retrospective:
          "Missing approved es REQUEST en E3, no DENY. El adverso combina firma rota y production: breach de contenido. Pregunta: ¿por qué no inventar `approved=True` para «desbloquear» el lab? Luego (E3): CONTINUE / DENY / REQUEST.",
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
        title: "Decide promote: CONTINUE o REQUEST",
        preamble:
          "- **Contexto:** en el camino CF-4, falta de aprobación es trabajo humano, no luz verde silenciosa.\n- **Meta:** CONTINUE / DENY_MODEL_PROMOTION / REQUEST_MODEL_APPROVAL.\n- **Éxito:** tripleta exacta.\n- **Límites:** no inventes approved; no sirvas production «mientras piden el OK».",
        instruction:
          "S47-T2-A-E3 · Salida: debe devolver el PASS del contrato. 1. Missing → REQUEST_MODEL_APPROVAL.\n2. Completo: predicado de E1/E2.\n3. Adverso → DENY_MODEL_PROMOTION.\n4. Imprime en orden.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_MODEL_APPROVAL` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_MODEL_APPROVAL` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró firma exacta, staging y aprobación; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["Falta `approved` → MISSING / REQUEST_MODEL_APPROVAL", "Adverso: production + approved=False + firma rota → DENY_MODEL_PROMOTION", "CASO-TAC-047-2A es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-2A`, adverso y sin `approved` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE exige firma + staging + approved; DENY es promote ilegal; REQUEST es incertidumbre humana. La aprobación es independiente del digest: el artefacto existe no basta para production.",
        retrospective:
          "La aprobación es independiente del digest. El error clásico es «el artefacto existe, listo». Pregunta: ¿qué pedirías en la card de aprobación antes de tocar production?",
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
        title: "Digest, features alineadas y card completa",
        preamble:
          "- **Contexto:** en `CASO-TAC-047-2B`, el artefacto del ranker solo pasa si hay sha256, features-v3 en train y serve, y card de cuatro secciones.\n- **Meta:** corregir `meets_contract` (digest + igualdad features + card ⊇ REQUIRED).\n- **Éxito:** `S47-T2-B PASS`.\n- **Límites:** no uses `latest`; no recortes la card a «use».",
        instruction:
          "S47-T2-B-E1 · Salida: debe devolver el PASS del contrato. 1. Starter: PASS si hay skew o card corta (bug).\n2. Exige `artifact_digest.startswith(\"sha256:\")`.\n3. `feature_version == serving_feature_version`.\n4. card ⊇ {use, limits, metrics, risks} y print PASS/REJECT.",
        hint: "El DEFECT aprueba con skew o card incompleta: exige digest sha256:, train_fv==serve_fv y card ⊇ {use,limits,metrics,risks}.",
        hints: [
          "Relaciona los campos `artifact_digest`, `feature_version`, `serving_feature_version`, `card_sections` con la regla explicada en S47-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva digest, card y compatibilidad verificadas; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["Falta `card_sections` → MISSING / COMPLETE_MODEL_CARD", "Adverso: digest latest, feature skew o card incompleta → REJECT_MODEL_ARTIFACT", "CASO-TAC-047-2B es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-2B` satisface un predicado de dominio real; imprime `S47-T2-B PASS` y el assert booleano pasa.",
        feedback:
          "En el adverso fallan latest, skew y card thin a la vez; cualquiera basta para REJECT. Contar `len < 4` es un proxy; el contrato real es el conjunto de secciones. Sin card, producto no defiende límites del score.",
        retrospective:
          "Card incompleta es riesgo de producto, no de formato markdown. El starter aprueba justo cuando hay skew o secciones de menos. Pregunta: con digest sha256 y features alineadas pero card solo `{use}`, ¿PASS o REJECT? Siguiente: PASS / REJECT / MISSING:card_sections.",
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
        title: "Tres rutas de artefacto (PASS / REJECT / MISSING)",
        preamble:
          "- **Contexto:** el gate de artefactos en Tacna distingue card completa, artefacto basura y ausencia de secciones.\n- **Meta:** PASS / REJECT_MODEL_ARTIFACT / MISSING:card_sections.\n- **Éxito:** tripleta exacta.\n- **Límites:** sin card_sections no evalúes digest; no inventes secciones.",
        instruction:
          "S47-T2-B-E2 · Salida: debe devolver el PASS del contrato. 1. Starter: con campos presentes devuelve PASS si hay skew o `len(card) < 4` (bug: aprueba basura).\n2. Primero calcula `missing`; si falta `card_sections` → `MISSING:card_sections` sin mirar digest.\n3. Luego exige `startswith(\"sha256:\")`, train==serve y card ⊇ {use, limits, metrics, risks}.\n4. Imprime `PASS REJECT_MODEL_ARTIFACT MISSING:card_sections` con `print(*results)`.",
        hint: "Primero se calcula `missing`; ningún acceso a card_sections debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a card_sections debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T2-B: digest, compatibilidad de features y card completa. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta `card_sections` → MISSING / COMPLETE_MODEL_CARD", "Adverso: digest latest, feature skew o card incompleta → REJECT_MODEL_ARTIFACT", "CASO-TAC-047-2B es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `card_sections` ausente y produce exactamente `PASS REJECT_MODEL_ARTIFACT MISSING:card_sections`.",
        feedback:
          "Missing card es COMPLETE en E3; skew/latest es REJECT de contenido. No rellenes la card con placeholders ante el revisor de artefactos del registry.",
        retrospective:
          "Missing card es COMPLETE en E3; skew o digest `latest` es REJECT de contenido. Rellenar secciones inventadas no es gobernanza del registry. Pregunta: en el invalid, ¿basta una de latest/skew/thin para REJECT aunque las otras estuvieran bien? Luego: CONTINUE / REJECT / COMPLETE.",
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
        title: "Decide artefacto: CONTINUE o COMPLETE",
        preamble:
          "- **Contexto:** sin card no se inventan límites: se deriva a completar evidencia.\n- **Meta:** CONTINUE / REJECT_MODEL_ARTIFACT / COMPLETE_MODEL_CARD.\n- **Éxito:** tripleta exacta.\n- **Límites:** no inventes secciones; no promote con latest.",
        instruction:
          "S47-T2-B-E3 · Salida: debe devolver el PASS del contrato. 1. Missing → COMPLETE_MODEL_CARD.\n2. Completo: predicado de E1/E2.\n3. Adverso → REJECT_MODEL_ARTIFACT.\n4. Imprime en orden.",
        hint: "Una ausencia no equivale a breach: enrútala a `COMPLETE_MODEL_CARD` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `COMPLETE_MODEL_CARD` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró digest, compatibilidad de features y card completa; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["Falta `card_sections` → MISSING / COMPLETE_MODEL_CARD", "Adverso: digest latest, feature skew o card incompleta → REJECT_MODEL_ARTIFACT", "CASO-TAC-047-2B es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-2B`, adverso y sin `card_sections` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE exige digest sha256, features alineadas y card de 4 secciones; REJECT es basura de artefacto; COMPLETE es trabajo de gobernanza. Sin card no inventes secciones.",
        retrospective:
          "Completar card es trabajo de gobernanza, no un «warning de markdown». El error clásico es copiar un README de una línea. Pregunta: ¿qué sección de la card fallaría primero en tu ranker sintético?",
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
        title: "Paridad batch/online sin leakage",
        preamble:
          "- **Contexto:** en `CASO-TAC-047-3A`, el path batch y online del ranker de Tacna deben emitir el mismo vector sin leakage y con ≥3 contract tests.\n- **Meta:** `meets_contract` = batch==online y not leakage y tests≥3.\n- **Éxito:** `S47-T3-A PASS`.\n- **Límites:** no «promuevas con fe»; no bajes el umbral de tests.",
        instruction:
          "S47-T3-A-E1 · Salida: debe devolver el PASS del contrato. 1. Starter: PASS si batch≠online o leakage (bug: aprueba skew).\n2. Invierte a igualdad de features batch/online.\n3. Añade `not leakage` y `contract_tests >= 3`.\n4. Conserva print PASS/DISABLE_INCONSISTENT_SERVING.",
        hint: "El DEFECT aprueba skew o leakage: exige batch==online, leakage=False y contract_tests ≥ 3.",
        hints: [
          "Relaciona los campos `batch_features`, `online_features`, `leakage`, `contract_tests` con la regla explicada en S47-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva paridad de features en fixtures; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["Falta `contract_tests` → MISSING / TRACE_FEATURE_PIPELINE", "Adverso: online features ≠ batch, leakage=True o contract_tests=0 → DISABLE_INCONSISTENT_SERVING", "CASO-TAC-047-3A es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-3A` satisface un predicado de dominio real; imprime `S47-T3-A PASS` y el assert booleano pasa.",
        feedback:
          "El adverso combina skew y leakage: el serving se deshabilita aunque el laboratorio luzca bien. Online distinto del batch es skew real, no «ruido de float» ante el revisor de features.",
        retrospective:
          "Training-serving skew se corta **antes** del canary. El starter da PASS cuando batch≠online o hay leakage. Pregunta: con vectores iguales, leakage=False y `contract_tests=2`, ¿PASS o DISABLE aunque el F1 de lab sea alto? Siguiente (E2): PASS / DISABLE / MISSING:contract_tests.",
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
        title: "Tres rutas de features (PASS / DISABLE / MISSING)",
        preamble:
          "- **Contexto:** el gate de features en Tacna separa paridad limpia, skew/leakage y ausencia de contract tests.\n- **Meta:** PASS / DISABLE_INCONSISTENT_SERVING / MISSING:contract_tests.\n- **Éxito:** tripleta exacta.\n- **Límites:** sin contract_tests no evalúes paridad; no inventes tests.",
        instruction:
          "S47-T3-A-E2 · Salida: debe devolver el PASS del contrato. 1. Starter: PASS si batch≠online o leakage (bug: aprueba skew).\n2. Primero `missing` de required; sin `contract_tests` → `MISSING:contract_tests` sin mirar paridad.\n3. Luego batch==online y not leakage y tests≥3 → PASS; si no → DISABLE_INCONSISTENT_SERVING.\n4. Imprime `PASS DISABLE_INCONSISTENT_SERVING MISSING:contract_tests`.",
        hint: "Primero se calcula `missing`; ningún acceso a contract_tests debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a contract_tests debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T3-A: paridad batch/online sin leakage y contract tests. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta `contract_tests` → MISSING / TRACE_FEATURE_PIPELINE", "Adverso: online features ≠ batch, leakage=True o contract_tests=0 → DISABLE_INCONSISTENT_SERVING", "CASO-TAC-047-3A es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `contract_tests` ausente y produce exactamente `PASS DISABLE_INCONSISTENT_SERVING MISSING:contract_tests`.",
        feedback:
          "Missing tests es TRACE en E3; skew es DISABLE de contenido. Un F1 alto no salva online divergente: el gate de features falla cerrado antes del canary.",
        retrospective:
          "Missing tests es TRACE en E3; skew o leakage es DISABLE de contenido. Un F1 de lab no salva online divergente. Pregunta: ¿por qué no inventar `contract_tests=3` para forzar PASS? Luego (E3): CONTINUE / DISABLE / TRACE.",
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
        title: "Decide features: CONTINUE o TRACE",
        preamble:
          "- **Contexto:** sin contract tests no se sirve «a ciegas»: se traza el pipeline.\n- **Meta:** CONTINUE / DISABLE_INCONSISTENT_SERVING / TRACE_FEATURE_PIPELINE.\n- **Éxito:** tripleta exacta.\n- **Límites:** no inventes tests; no ignores leakage.",
        instruction:
          "S47-T3-A-E3 · Salida: debe devolver el PASS del contrato. 1. Missing → TRACE_FEATURE_PIPELINE.\n2. Completo: predicado de E1/E2.\n3. Adverso → DISABLE_INCONSISTENT_SERVING.\n4. Imprime en orden.",
        hint: "Una ausencia no equivale a breach: enrútala a `TRACE_FEATURE_PIPELINE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `TRACE_FEATURE_PIPELINE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró paridad batch/online sin leakage y contract tests; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["Falta `contract_tests` → MISSING / TRACE_FEATURE_PIPELINE", "Adverso: online features ≠ batch, leakage=True o contract_tests=0 → DISABLE_INCONSISTENT_SERVING", "CASO-TAC-047-3A es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-3A`, adverso y sin `contract_tests` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE exige paridad + anti-leakage + tests≥3; DISABLE corta serving inconsistente; TRACE es pipeline sin evidencia. Training-serving skew no se «promueve con fe».",
        retrospective:
          "Training-serving skew no se «promueve con fe». El error clásico es seguir sirviendo mientras «revisan el drift». Pregunta: ¿qué contract test escribirías primero para el vector de prioridad?",
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
        title: "p95 bajo SLO y fallback probado",
        preamble:
          "- **Contexto:** en `CASO-TAC-047-3B`, el ranker de Tacna solo sirve si p95≤SLO, batch 1–64 y fallback rules-* ensayado.\n- **Meta:** corregir `meets_contract` con esos cuatro chequeos.\n- **Éxito:** `S47-T3-B PASS`.\n- **Límites:** no aceptes fallback `none`; no subas batch «para ir más rápido».",
        instruction:
          "S47-T3-B-E1 · Salida: debe devolver el PASS del contrato. 1. Starter: PASS si p95>slo o not tested (bug).\n2. Invierte a p95 ≤ slo.\n3. Añade `1 <= batch_size <= 64` y `fallback.startswith(\"rules-\")` y tested.\n4. Conserva print PASS/ACTIVATE_SAFE_FALLBACK.",
        hint: "El DEFECT aprueba p95 alto o fallback none: exige p95≤slo, batch 1–64, fallback tipado (p. ej. rules-*) y fallback_tested=True.",
        hints: [
          "Relaciona los campos `p95_ms`, `slo_ms`, `batch_size`, `fallback`, `fallback_tested` con la regla explicada en S47-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva SLO de latencia y fallback probado; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["Falta `fallback_tested` → MISSING / TUNE_BATCH_OR_CAPACITY", "Adverso: p95>slo, batch 512, fallback none o untested → ACTIVATE_SAFE_FALLBACK", "CASO-TAC-047-3B es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-3B` satisface un predicado de dominio real; imprime `S47-T3-B PASS` y el assert booleano pasa.",
        feedback:
          "El adverso viola latencia, batch y fallback a la vez: ACTIVATE_SAFE_FALLBACK, no «intentar otra vez». Fallback none nunca es PASS ante el revisor de SLO.",
        retrospective:
          "Fallback no ensayado es deuda operativa, no un TODO del README. El starter aprueba justo cuando el serving no está listo. Pregunta: con p95 OK, batch 16 y fallback `rules-v2` pero `tested=False`, ¿PASS o ACTIVATE? Siguiente: PASS / ACTIVATE / MISSING:fallback_tested.",
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
        title: "Tres rutas de SLO (PASS / ACTIVATE / MISSING)",
        preamble:
          "- **Contexto:** el gate de latencia en Tacna separa serving listo, breach de SLO/fallback y ausencia de evidencia de prueba de fallback.\n- **Meta:** PASS / ACTIVATE_SAFE_FALLBACK / MISSING:fallback_tested.\n- **Éxito:** tripleta exacta.\n- **Límites:** sin fallback_tested no evalúes p95; no inventes el booleano.",
        instruction:
          "S47-T3-B-E2 · Salida: debe devolver el PASS del contrato. 1. Starter invierte PASS/ACTIVATE con campos presentes.\n2. Primero `missing`; sin `fallback_tested` → `MISSING:fallback_tested` (no evalúes p95).\n3. Luego p95≤slo, batch 1–64, fallback `rules-*` y tested → PASS; si no → ACTIVATE_SAFE_FALLBACK.\n4. Imprime la tripleta canónica.",
        hint: "Primero se calcula `missing`; ningún acceso a fallback_tested debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a fallback_tested debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T3-B: p95 bajo SLO, batch acotado y fallback probado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta `fallback_tested` → MISSING / TUNE_BATCH_OR_CAPACITY", "Adverso: p95>slo, batch 512, fallback none o untested → ACTIVATE_SAFE_FALLBACK", "CASO-TAC-047-3B es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `fallback_tested` ausente y produce exactamente `PASS ACTIVATE_SAFE_FALLBACK MISSING:fallback_tested`.",
        feedback:
          "Missing tested es TUNE en E3; p95 900 con batch 512 es ACTIVATE de contenido. Sin fallback ensayado el timeout no tiene salida segura para el producto de Tacna.",
        retrospective:
          "Missing tested es TUNE en E3; p95 900 con batch 512 es ACTIVATE de contenido. Pregunta: ¿por qué «falta evidencia de prueba» no es lo mismo que «activar fallback ya»? Luego (E3): CONTINUE / ACTIVATE / TUNE.",
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
        title: "Decide SLO: CONTINUE o TUNE",
        preamble:
          "- **Contexto:** sin evidencia de prueba de fallback se tunear capacidad, no se abre tráfico.\n- **Meta:** CONTINUE / ACTIVATE_SAFE_FALLBACK / TUNE_BATCH_OR_CAPACITY.\n- **Éxito:** tripleta exacta.\n- **Límites:** no inventes tested; no ignores batch 512.",
        instruction:
          "S47-T3-B-E3 · Salida: debe devolver el PASS del contrato. 1. Missing → TUNE_BATCH_OR_CAPACITY.\n2. Completo: predicado de E1/E2.\n3. Adverso → ACTIVATE_SAFE_FALLBACK.\n4. Imprime en orden.",
        hint: "Una ausencia no equivale a breach: enrútala a `TUNE_BATCH_OR_CAPACITY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `TUNE_BATCH_OR_CAPACITY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró p95 bajo SLO, batch acotado y fallback probado; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["Falta `fallback_tested` → MISSING / TUNE_BATCH_OR_CAPACITY", "Adverso: p95>slo, batch 512, fallback none o untested → ACTIVATE_SAFE_FALLBACK", "CASO-TAC-047-3B es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-3B`, adverso y sin `fallback_tested` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE exige p95≤SLO, batch acotado y fallback rules-* ensayado; ACTIVATE es breach de latencia/capacidad; TUNE es incertidumbre de prueba. Fallback none nunca es PASS.",
        retrospective:
          "Fallback none nunca es PASS. El error clásico es «subimos batch y ya». Pregunta: ¿qué p95 y batch declararías en el README del canary de Tacna?",
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
        title: "Canary ≤10% con hooks activos",
        preamble:
          "- **Contexto:** en `CASO-TAC-047-4A`, el equipo abre canary al 5% del tráfico de priorización en Tacna solo si mode, quality, error y hooks están en presupuesto.\n- **Meta:** `meets_contract` con shadow/canary, traffic≤10, quality y error OK, hooks True.\n- **Éxito:** `S47-T4-A PASS`.\n- **Límites:** no uses mode full; no apagues hooks «para ir más rápido».",
        instruction:
          "S47-T4-A-E1 · Salida: debe devolver el PASS del contrato. 1. Starter: PASS si traffic>10 o error>max (bug).\n2. Exige mode in {shadow, canary}.\n3. traffic≤10, quality_delta ≥ −max_quality_drop, error≤max, hooks.\n4. Conserva print PASS/STOP_CANARY.",
        hint: "El DEFECT aprueba mode full u over-traffic: exige mode shadow/canary, traffic≤10%, quality_delta ≥ −max_drop, error≤max y hooks=True.",
        hints: [
          "Relaciona los campos `mode`, `traffic_pct`, `quality_delta`, `max_quality_drop`, `error_rate`, `max_error_rate`, `hooks` con la regla explicada en S47-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva canary con criterio promote/stop; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["Falta `hooks` → MISSING / COLLECT_MORE_SHADOW_EVIDENCE", "Adverso: mode full, traffic 100%, quality drop o hooks false → STOP_CANARY", "CASO-TAC-047-4A es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-4A` satisface un predicado de dominio real; imprime `S47-T4-A PASS` y el assert booleano pasa.",
        feedback:
          "Mode full al 100% es STOP aunque el digest sea válido. Hooks apagados también detienen: sin señales no hay criterio promote/stop para el revisor de rollout.",
        retrospective:
          "Canary sin hooks es teatro de despliegue. El starter aprueba justo cuando hay over-traffic o error alto y además omite mode/quality/hooks. Pregunta: con traffic 5% y hooks=False, ¿PASS o STOP aunque el error esté bajo? Siguiente: PASS / STOP / MISSING:hooks.",
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
        title: "Tres rutas de canary (PASS / STOP / MISSING)",
        preamble:
          "- **Contexto:** el gate de tráfico en Tacna separa canary sano, over-traffic y ausencia de hooks.\n- **Meta:** PASS / STOP_CANARY / MISSING:hooks.\n- **Éxito:** tripleta exacta.\n- **Límites:** sin hooks no evalúes traffic; no inventes métricas.",
        instruction:
          "S47-T4-A-E2 · Salida: debe devolver el PASS del contrato. 1. Starter: PASS si traffic>10 o error>max (bug: invierte y omite mode/quality/hooks).\n2. Primero `missing`; sin `hooks` → `MISSING:hooks`.\n3. Luego mode in {shadow, canary}, traffic≤10, quality_delta ≥ −max_drop, error≤max y hooks → PASS; si no → STOP_CANARY.\n4. Imprime `PASS STOP_CANARY MISSING:hooks`.",
        hint: "Primero se calcula `missing`; ningún acceso a hooks debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a hooks debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T4-A: tráfico limitado, quality/error gates y hooks. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta `hooks` → MISSING / COLLECT_MORE_SHADOW_EVIDENCE", "Adverso: mode full, traffic 100%, quality drop o hooks false → STOP_CANARY", "CASO-TAC-047-4A es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `hooks` ausente y produce exactamente `PASS STOP_CANARY MISSING:hooks`.",
        feedback:
          "Missing hooks es COLLECT en E3; mode full es STOP de contenido. No inventes quality_delta: el revisor de canary exige evidencia de paneles, no chat.",
        retrospective:
          "Missing hooks es COLLECT en E3; mode `full` al 100% es STOP de contenido. Inventar `quality_delta` en el chat no es panel de monitoreo. Pregunta: en el invalid, ¿basta hooks=False para STOP aunque bajaras traffic a 5%? Luego: CONTINUE / STOP / COLLECT.",
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
        title: "Decide canary: CONTINUE o COLLECT",
        preamble:
          "- **Contexto:** sin hooks se recolecta más evidencia de shadow, no se inventan paneles.\n- **Meta:** CONTINUE / STOP_CANARY / COLLECT_MORE_SHADOW_EVIDENCE.\n- **Éxito:** tripleta exacta.\n- **Límites:** no inventes hooks; no abras al 100%.",
        instruction:
          "S47-T4-A-E3 · Salida: debe devolver el PASS del contrato. 1. Missing → COLLECT_MORE_SHADOW_EVIDENCE.\n2. Completo: predicado de E1/E2.\n3. Adverso → STOP_CANARY.\n4. Imprime en orden.",
        hint: "Una ausencia no equivale a breach: enrútala a `COLLECT_MORE_SHADOW_EVIDENCE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `COLLECT_MORE_SHADOW_EVIDENCE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró tráfico limitado, quality/error gates y hooks; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["Falta `hooks` → MISSING / COLLECT_MORE_SHADOW_EVIDENCE", "Adverso: mode full, traffic 100%, quality drop o hooks false → STOP_CANARY", "CASO-TAC-047-4A es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-4A`, adverso y sin `hooks` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE exige mode shadow/canary, traffic≤10, quality/error en presupuesto y hooks; STOP corta over-traffic o quality drop; COLLECT es incertidumbre de observabilidad. Sin hooks no inventes métricas.",
        retrospective:
          "Sin hooks no inventes métricas: recolecta. El error clásico es «ya medimos a mano en el chat». Pregunta: ¿qué hook de drift o calidad pedirías antes del promote?",
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
        title: "Rollback a last-good con audit",
        preamble:
          "- **Contexto:** en `CASO-TAC-047-4B`, el equipo restaura de `1.2.0` a `1.1.0` solo si hay features compatibles, rollback ensayado, retiro de `1.0.0` y audit entry.\n- **Meta:** `meets_contract` con current≠last_good, compatible, tested, retired y audit.\n- **Éxito:** `S47-T4-B PASS`.\n- **Límites:** no borres el trace; no marques PASS sin retired.",
        instruction:
          "S47-T4-B-E1 · Salida: debe devolver el PASS del contrato. 1. Starter: PASS si not compatible o not tested (bug).\n2. Exige current ≠ last_good.\n3. Añade compatible, rollback_tested, `\"1.0.0\" in retired`, audit_entry.\n4. Conserva print PASS/ROLLBACK_TO_LAST_GOOD.",
        hint: "El DEFECT ignora last-good o retired: exige current≠last_good, features compatibles, rollback_tested, retired no vacío y audit_entry.",
        hints: [
          "Relaciona los campos `current`, `last_good`, `compatible_features`, `rollback_tested`, `retired`, `audit_entry` con la regla explicada en S47-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva restauración y retirement auditados; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["Falta `audit_entry` → MISSING / REVIEW_RETIREMENT", "Adverso: compatible_features false, rollback untested o retired vacío → ROLLBACK_TO_LAST_GOOD", "CASO-TAC-047-4B es sintético (sin PII)"],
        tests: "El fixture `CASO-TAC-047-4B` satisface un predicado de dominio real; imprime `S47-T4-B PASS` y el assert booleano pasa.",
        feedback:
          "El adverso rompe compat, tested, retired y audit a la vez. Cualquiera basta para no dar PASS; el verbo de breach en el flujo es ROLLBACK_TO_LAST_GOOD. Exige retiro explícito de `1.0.0`.",
        retrospective:
          "Retirement auditado es parte del rollback, no un extra de cleanup. El starter aprueba cuando compatible o tested fallan. Pregunta: con todo OK salvo `retired` vacío, ¿PASS o ROLLBACK_TO_LAST_GOOD? Siguiente (E2): PASS / ROLLBACK / MISSING:audit_entry.",
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
        title: "Tres rutas de rollback (PASS / ROLLBACK / MISSING)",
        preamble:
          "- **Contexto:** el gate de restauración en Tacna separa path seguro, breach de compat/tested y ausencia de audit.\n- **Meta:** PASS / ROLLBACK_TO_LAST_GOOD / MISSING:audit_entry.\n- **Éxito:** tripleta exacta.\n- **Límites:** sin audit_entry no evalúes compatible; no inventes el flag.",
        instruction:
          "S47-T4-B-E2 · Salida: debe devolver el PASS del contrato. 1. Starter invierte PASS/ROLLBACK con campos presentes (bug: aprueba lo no restaurable).\n2. Primero `missing`; sin `audit_entry` → `MISSING:audit_entry` (no evalúes compatible).\n3. Luego current≠last_good, compatible, tested, `\"1.0.0\" in retired` y audit → PASS; si no → ROLLBACK_TO_LAST_GOOD.\n4. Imprime la tripleta canónica con `print(*results)`.",
        hint: "Primero se calcula `missing`; ningún acceso a audit_entry debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a audit_entry debe ocurrir antes de esa rama.",
          "Después aplica la regla de S47-T4-B: last-known-good compatible, rollback y retiro auditado. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["Falta `audit_entry` → MISSING / REVIEW_RETIREMENT", "Adverso: compatible_features false, rollback untested o retired vacío → ROLLBACK_TO_LAST_GOOD", "CASO-TAC-047-4B es sintético (sin PII)"],
        tests: "La tabla cubre válido/adverso/campo `audit_entry` ausente y produce exactamente `PASS ROLLBACK_TO_LAST_GOOD MISSING:audit_entry`.",
        feedback:
          "Missing audit es REVIEW en E3; compatible=False es ROLLBACK de contenido. Compatible=False o untested no es uncertainty: es breach que el revisor de CF-4 no confunde con «falta evidencia».",
        retrospective:
          "Missing audit es REVIEW en E3; compatible=False o untested es ROLLBACK de contenido — no uncertainty. Pregunta: ¿por qué untested no se «arregla» inventando `rollback_tested=True` en el lab? Luego decides CONTINUE / ROLLBACK / REVIEW.",
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
        title: "Decide rollback: CONTINUE o REVIEW",
        preamble:
          "- **Contexto:** sin audit entry el retiro se revisa con humanos; no se borra el trace ni se da CONTINUE.\n- **Meta:** CONTINUE / ROLLBACK_TO_LAST_GOOD / REVIEW_RETIREMENT.\n- **Éxito:** tripleta exacta.\n- **Límites:** no inventes audit; no limpies el tablero borrando evidencia.",
        instruction:
          "S47-T4-B-E3 · Salida: debe devolver el PASS del contrato. 1. Missing → REVIEW_RETIREMENT.\n2. Completo: predicado de E1/E2.\n3. Adverso → ROLLBACK_TO_LAST_GOOD.\n4. Imprime en orden.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_RETIREMENT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_RETIREMENT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró last-known-good compatible, rollback y retiro auditado; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["Falta `audit_entry` → MISSING / REVIEW_RETIREMENT", "Adverso: compatible_features false, rollback untested o retired vacío → ROLLBACK_TO_LAST_GOOD", "CASO-TAC-047-4B es sintético (sin PII)"],
        tests: "Fixtures `CASO-TAC-047-4B`, adverso y sin `audit_entry` prueban continue/breach/uncertainty en ese orden.",
        feedback:
          "CONTINUE exige last-good distinto, features compatibles, rollback ensayado, retired y audit; ROLLBACK es breach de restauración; REVIEW es incertidumbre de retiro. Borrar el trace no es rollback: es pérdida de evidencia CF-4.",
        retrospective:
          "Borrar el trace no es rollback: es pérdida de evidencia. El error clásico es «ya restauramos, borramos el ruido». Pregunta de cierre CF-4: ¿qué campo del audit defenderías en 30 segundos ante un revisor?",
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
residual_risk = "canary_budget y skew residual; retiro 1.0.0 auditado; sin PII"
print(CASE_ID, "normal_ok", path_ok)
print("breach_action", breach_action, "canary_ok", breach["canary"], "rollback_ok", breach["rollback"])
print("uncertain_action", uncertain_action)
print("residual_risk", residual_risk)
# Completa: un segundo breach (p. ej. skew batch/online) y un missing de hooks o approved;
# no marques READY sin que los predicados fallen o pasen de forma explícita.
`,
    portfolioNote: "Evidencia de CP-N4-B + CF-4 · modelo promovible y reversible: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. Parte del scaffold con predicados reales; no pases a READY solo flipando flags sin evidencia. Checklist READY: missing ≠ breach (p. ej. REVIEW_RETIREMENT sin inventar audit) y rollback sin borrar evidencia.",
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante de CF-4 demuestras con un caso normal, un breach (`STOP_CANARY` / `ROLLBACK_TO_LAST_GOOD`) y un incierto (`REVIEW_RETIREMENT`)? (2) ¿qué harías distinto con datos reales vs. sintéticos de Tacna (PII, secretos, servicios externos)? (3) Escribe en el README una frase de impacto medible (antes/después del gate de promote) que puedas defender en 30 segundos sin flipar flags a mano.",
    rubric: [
      { criterion: "Corrección técnica del contrato y del gate.", weight: "25%" },
      { criterion: "Pruebas normal/breach/uncertain y recuperación.", weight: "20%" },
      { criterion: "Seguridad, privacidad y least privilege.", weight: "15%" },
      { criterion: "Reproducibilidad, lineage y evidencia.", weight: "15%" },
      { criterion: "Operación: SLO, observabilidad y rollback.", weight: "15%" },
      { criterion: "Comunicación de trade-offs y límites.", weight: "10%" },
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
        question: "Un modelo en entorno production (o alias de producción) sin approved=True debe…",
        options: ["servirse igual porque el digest existe", "escalar a 100% de tráfico", "bloquearse hasta aprobación y card mínima", "borrar el baseline para forzar el candidate"],
        correctIndex: 2,
        explanation: "Registry fail-closed: el entorno o alias de producción exige aprobación explícita y artefactos de gobernanza; el digest solo no basta.",
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
        note: "Versiones, alias y tags (stages clásicos solo como referencia didáctica)",
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
      { label: "MIT 6.100 L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Tests y proyectos reproducibles" },
      { label: "Py4E", url: "https://www.py4e.com", note: "Stdlib-first progressive disclosure" },
      { label: "SRE release engineering", url: "https://sre.google/sre-book/release-engineering/", note: "Canary y rollback conceptual" },
    ],
  },
}
