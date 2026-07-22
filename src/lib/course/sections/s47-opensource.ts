import type { CourseSection } from '../../types'

export const section47: CourseSection = {
  id: "opensource",
  index: 47,
  title: "MLOps: experimentos, registro y serving",
  shortTitle: "MLOps serving",
  tagline: "Production Data/ML Platform: experimento→servicio con gates, lineage y rollback; CF-4",
  estimatedHours: 19,
  level: "Master",
  phase: 3,
  icon: "Github",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, mlops: experimentos, registro y serving conecta decisiones técnicas con evidencia operativa. La práctica entrega run comparable, modelo registrado, deployment canary y decisión auditable y se promueve solo cuando solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia.",
  learningOutcomes: [
    { text: "Trackea experimentos reproducibles" },
    { text: "Compara runs con lineage completo" },
    { text: "Registra con stages y approvals" },
    { text: "Publica artefactos y compatibilidad" },
    { text: "Sirve batch/online con features consistentes" },
    { text: "Controla latency, batching y fallback" },
    { text: "Despliega shadow/canary con monitoring" },
    { text: "Revierte, retira y audita modelos" },
  ],
  theory: [
    {
      heading: "Ruta de S47: MLOps: experimentos, registro y serving",
      paragraphs: [
        "Esta sección parte de S46 y usa únicamente contratos, pruebas y controles ya presentados. El caso `CASO-TAC-047` es sintético y puede ejecutarse sin credenciales ni servicios externos.",
        "Producto incremental: Production Data/ML Platform con CF-4. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida: run comparable, modelo registrado, deployment canary y decisión auditable.",
        "La secuencia mantiene liberación gradual: teoría con criterio medible, demo local, ejercicio guiado, validación independiente y transferencia con breach/uncertainty.",
      ],
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-B + CF-4 · modelo promovible y reversible: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "tracking y reproducibilidad",
      subtopicId: "S47-T1-A",
      paragraphs: [
        "Tracking registra parámetros, métricas, seed y artefactos; reproducibilidad requiere reejecutar el baseline, no solo ver una corrida antigua.",
        "Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: rerun dentro de tolerancia declarada. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de éxito: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia.",
        "Aplicación de `tracking y reproducibilidad` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es rerun dentro de tolerancia declarada. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "tracking_reproducibility.py",
        code: `print("r1"); print({"f1":0.81}); print("repro", 42)`,
        output: `r1
{'f1': 0.81}
repro 42`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S47-T1-A: rerun dentro de tolerancia declarada. Si falta, responde `MARK_RUN_NONREPRODUCIBLE`; si no alcanza para decidir, `INVESTIGATE_RANDOMNESS`.",
      },
    },
    {
      heading: "data/code/env lineage y comparación",
      subtopicId: "S47-T1-B",
      paragraphs: [
        "Cada run enlaza versión de data, código y entorno; comparar exige misma partición/metric definition y reportar incertidumbre.",
        "Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: lineage completo y comparación homogénea. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de éxito: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia.",
        "Aplicación de `data/code/env lineage y comparación` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es lineage completo y comparación homogénea. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "data_code_env_lineage_compare.py",
        code: `print({"data":"ds-v3","code":"git:abc","env":"locked"}); print("compare", ["f1","latency"]); print("diff", True)`,
        output: `{'data': 'ds-v3', 'code': 'git:abc', 'env': 'locked'}
compare ['f1', 'latency']
diff True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S47-T1-B, audita lineage completo y comparación homogénea. Un breach activa `INVALIDATE_COMPARISON` y una ausencia activa `RESTORE_LINEAGE`.",
      },
    },
    {
      heading: "firmas, stages y approvals",
      subtopicId: "S47-T2-A",
      paragraphs: [
        "Una firma fija nombres/tipos/rangos de entrada y salida; stages son estados gobernados y approval requiere evidencia independiente.",
        "Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: firma compatible y aprobación trazada. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de éxito: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia.",
        "Aplicación de `firmas, stages y approvals` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es firma compatible y aprobación trazada. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "signatures_stages_approvals.py",
        code: `print({"stage":"Staging","approvals":["ml-lead"]}); print("signature", "required"); print("prod_gate", True)`,
        output: `{'stage': 'Staging', 'approvals': ['ml-lead']}
signature required
prod_gate True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S47-T2-A conserva firma compatible y aprobación trazada; no conviertas `DENY_MODEL_PROMOTION` ni `REQUEST_MODEL_APPROVAL` en éxito silencioso.",
      },
    },
    {
      heading: "artefactos, model card y compatibilidad",
      subtopicId: "S47-T2-B",
      paragraphs: [
        "Artefactos llevan digest y dependencia; model card explica uso, límites, métricas y riesgos, incluida incompatibilidad de features.",
        "Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: digest/card/compatibilidad verificados. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de éxito: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia.",
        "Aplicación de `artefactos, model card y compatibilidad` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es digest/card/compatibilidad verificados. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "artifacts_card_compat.py",
        code: `print({"model":"er-ranker","version":"1.2.0"}); print("artifact", "model.pkl"); print("card_required", True)`,
        output: `{'model': 'er-ranker', 'version': '1.2.0'}
artifact model.pkl
card_required True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S47-T2-B: demuestra digest/card/compatibilidad verificados. Falla cerrada con `REJECT_MODEL_ARTIFACT` y deriva incertidumbre mediante `COMPLETE_MODEL_CARD`.",
      },
    },
    {
      heading: "batch/online y feature consistency",
      subtopicId: "S47-T3-A",
      paragraphs: [
        "Batch y online deben compartir transformación o contract tests para evitar training-serving skew y feature leakage.",
        "Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: paridad de features en fixtures. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de éxito: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia.",
        "Aplicación de `batch/online y feature consistency` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es paridad de features en fixtures. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "batch_online_feature_consistency.py",
        code: `print("consistent", True); print("modes", ["batch","online"]); print("skew_risk", "watch")`,
        output: `consistent True
modes ['batch', 'online']
skew_risk watch`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S47-T3-A, el artefacto comprobable es paridad de features en fixtures. Sin él corresponde `DISABLE_INCONSISTENT_SERVING` o, si faltan datos, `TRACE_FEATURE_PIPELINE`.",
      },
    },
    {
      heading: "latency, batching y fallback",
      subtopicId: "S47-T3-B",
      paragraphs: [
        "Presupuesta p95/p99, batching y capacidad; fallback debe ser seguro, medible y menos capaz, nunca una versión silenciosamente riesgosa.",
        "Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: SLO de latencia y fallback probado. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de éxito: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia.",
        "Aplicación de `latency, batching y fallback` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es SLO de latencia y fallback probado. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "latency_batching_fallback.py",
        code: `print({"p95_ms":50,"fallback":"rules"}); print("on_timeout", "rules"); print("batching", True)`,
        output: `{'p95_ms': 50, 'fallback': 'rules'}
on_timeout rules
batching True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S47-T3-B: prueba SLO de latencia y fallback probado y registra por separado `ACTIVATE_SAFE_FALLBACK` (breach) y `TUNE_BATCH_OR_CAPACITY` (missing).",
      },
    },
    {
      heading: "shadow/canary y monitoring hooks",
      subtopicId: "S47-T4-A",
      paragraphs: [
        "Shadow observa sin decidir; canary recibe tráfico limitado y monitoring hooks comparan calidad, drift, errores y negocio antes de promover.",
        "Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: canary con criterio promote/stop. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de éxito: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia.",
        "Aplicación de `shadow/canary y monitoring hooks` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es canary con criterio promote/stop. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "shadow_canary_monitoring.py",
        code: `print("shadow"); print(["f1","latency","drift"]); print("canary_next", True)`,
        output: `shadow
['f1', 'latency', 'drift']
canary_next True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S47-T4-A acepta solo canary con criterio promote/stop; una violación produce `STOP_CANARY` y un registro incompleto produce `COLLECT_MORE_SHADOW_EVIDENCE`.",
      },
    },
    {
      heading: "rollback, retirement y audit",
      subtopicId: "S47-T4-B",
      paragraphs: [
        "Rollback conserva modelo/config/features compatibles; retiro bloquea uso nuevo, mantiene audit y define fecha de eliminación.",
        "Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: restauración y retirement auditados. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de éxito: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia.",
        "Aplicación de `rollback, retirement y audit` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es restauración y retirement auditados. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "rollback_retire_audit.py",
        code: `print({"action":"rollback","to":"1.1.0"}); print("decisions_kept", True); print("cf4", "deployable_path")`,
        output: `{'action': 'rollback', 'to': '1.1.0'}
decisions_kept True
cf4 deployable_path`,
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
    intro: "Te muestro 8 demos de S47 (MLOps: experimentos, registro y serving) alineadas a CP-N4-B (cierre) + CF-4.",
    steps: [
      {
        demoId: "S47-T1-A-DEMO",
        subtopicId: "S47-T1-A",
        environment: "local-python",
        description: "Demo: tracking y reproducibilidad",
        code: {
          language: 'python',
          title: "demo_tracking_reproducibility.py",
          code: `print("tracking", "mlflow_like"); print("params", True); print("seed", 42)`,
          output: `tracking mlflow_like
params True
seed 42`,
        },
        why: "Hace observable `tracking y reproducibilidad` con un caso local pequeño y deja como evidencia rerun dentro de tolerancia declarada; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S47-T1-B-DEMO",
        subtopicId: "S47-T1-B",
        environment: "local-python",
        description: "Demo: data/code/env lineage y comparación",
        code: {
          language: 'python',
          title: "demo_data_code_env_lineage_compare.py",
          code: `print("data", "ds-v3"); print("code", "git:abc"); print("env", "locked")`,
          output: `data ds-v3
code git:abc
env locked`,
        },
        why: "Hace observable `data/code/env lineage y comparación` con un caso local pequeño y deja como evidencia lineage completo y comparación homogénea; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S47-T2-A-DEMO",
        subtopicId: "S47-T2-A",
        environment: "local-python",
        description: "Demo: firmas, stages y approvals",
        code: {
          language: 'python',
          title: "demo_signatures_stages_approvals.py",
          code: `print("stage", "Staging"); print("approve", True); print("signature", True)`,
          output: `stage Staging
approve True
signature True`,
        },
        why: "Hace observable `firmas, stages y approvals` con un caso local pequeño y deja como evidencia firma compatible y aprobación trazada; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S47-T2-B-DEMO",
        subtopicId: "S47-T2-B",
        environment: "local-python",
        description: "Demo: artefactos, model card y compatibilidad",
        code: {
          language: 'python',
          title: "demo_artifacts_card_compat.py",
          code: `print("compat", "features_v3"); print("version", "1.2.0"); print("artifact_hash", True)`,
          output: `compat features_v3
version 1.2.0
artifact_hash True`,
        },
        why: "Hace observable `artefactos, model card y compatibilidad` con un caso local pequeño y deja como evidencia digest/card/compatibilidad verificados; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S47-T3-A-DEMO",
        subtopicId: "S47-T3-A",
        environment: "local-python",
        description: "Demo: batch/online y feature consistency",
        code: {
          language: 'python',
          title: "demo_batch_online_feature_consistency.py",
          code: `print("batch", True); print("online", True); print("same_codepath", True)`,
          output: `batch True
online True
same_codepath True`,
        },
        why: "Hace observable `batch/online y feature consistency` con un caso local pequeño y deja como evidencia paridad de features en fixtures; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S47-T3-B-DEMO",
        subtopicId: "S47-T3-B",
        environment: "local-python",
        description: "Demo: latency, batching y fallback",
        code: {
          language: 'python',
          title: "demo_latency_batching_fallback.py",
          code: `print("latency_ok", True); print("fallback", "rules"); print("batch", 32)`,
          output: `latency_ok True
fallback rules
batch 32`,
        },
        why: "Hace observable `latency, batching y fallback` con un caso local pequeño y deja como evidencia SLO de latencia y fallback probado; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S47-T4-A-DEMO",
        subtopicId: "S47-T4-A",
        environment: "local-python",
        description: "Demo: shadow/canary y monitoring hooks",
        code: {
          language: 'python',
          title: "demo_shadow_canary_monitoring.py",
          code: `print("shadow", True); print("hooks", True); print("promote_if", "gates_green")`,
          output: `shadow True
hooks True
promote_if gates_green`,
        },
        why: "Hace observable `shadow/canary y monitoring hooks` con un caso local pequeño y deja como evidencia canary con criterio promote/stop; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S47-T4-B-DEMO",
        subtopicId: "S47-T4-B",
        environment: "local-python",
        description: "Demo: rollback, retirement y audit",
        code: {
          language: 'python',
          title: "demo_rollback_retire_audit.py",
          code: `print("rollback", "1.1.0"); print("retire", "1.0.0"); print("audit", True)`,
          output: `rollback 1.1.0
retire 1.0.0
audit True`,
        },
        why: "Hace observable `rollback, retirement y audit` con un caso local pequeño y deja como evidencia restauración y retirement auditados; el demo modela el contrato, no un servicio externo.",
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
        hint: "Relaciona los campos `seed`, `params`, `metric`, `rerun_metric`, `tolerance` con la regla explicada en S47-T1-A.",
        hints: [
          "Relaciona los campos `seed`, `params`, `metric`, `rerun_metric`, `tolerance` con la regla explicada en S47-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva rerun dentro de tolerancia declarada; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta tolerance", "fixture adverso: rerun dentro de tolerancia con seed/parámetros", "CASO-TAC-047-1A es sintético"],
        tests: "El fixture `CASO-TAC-047-1A` satisface un predicado de dominio real; imprime `S47-T1-A PASS` y el assert booleano pasa.",
        feedback: "S47-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa MARK_RUN_NONREPRODUCIBLE y por qué faltar tolerance exige INVESTIGATE_RANDOMNESS.",
        starterCode: {
          language: 'python',
          title: "s47-t1-a-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-1A", **{"seed":42,"params":{"depth":4},"metric":0.81,"rerun_metric":0.805,"tolerance":0.01}}
meets_contract = abs(record["metric"] - record["rerun_metric"]) > record["tolerance"]
status = "PASS" if meets_contract else "MARK_RUN_NONREPRODUCIBLE"
print("S47-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t1-a-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-1A", **{"seed":42,"params":{"depth":4},"metric":0.81,"rerun_metric":0.805,"tolerance":0.01}}
meets_contract = abs(record["metric"] - record["rerun_metric"]) <= record["tolerance"] and record["seed"] == 42 and bool(record["params"])
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
        edgeCases: ["falta tolerance", "fixture adverso: rerun dentro de tolerancia con seed/parámetros", "CASO-TAC-047-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `tolerance` ausente y produce exactamente `PASS MARK_RUN_NONREPRODUCIBLE MISSING:tolerance`.",
        feedback: "S47-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa MARK_RUN_NONREPRODUCIBLE y por qué faltar tolerance exige INVESTIGATE_RANDOMNESS.",
        starterCode: {
          language: 'python',
          title: "s47-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
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
    return "PASS" if abs(record["metric"] - record["rerun_metric"]) <= record["tolerance"] and record["seed"] == 42 and bool(record["params"]) else "MARK_RUN_NONREPRODUCIBLE"

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
        edgeCases: ["falta tolerance", "fixture adverso: rerun dentro de tolerancia con seed/parámetros", "CASO-TAC-047-1A es sintético"],
        tests: "Fixtures `CASO-TAC-047-1A`, adverso y sin `tolerance` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa MARK_RUN_NONREPRODUCIBLE y por qué faltar tolerance exige INVESTIGATE_RANDOMNESS.",
        starterCode: {
          language: 'python',
          title: "s47-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
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
    return "CONTINUE" if abs(record["metric"] - record["rerun_metric"]) <= record["tolerance"] and record["seed"] == 42 and bool(record["params"]) else "MARK_RUN_NONREPRODUCIBLE"

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
        hint: "Relaciona los campos `data`, `code`, `env`, `split`, `metric_definition`, `candidate`, `baseline` con la regla explicada en S47-T1-B.",
        hints: [
          "Relaciona los campos `data`, `code`, `env`, `split`, `metric_definition`, `candidate`, `baseline` con la regla explicada en S47-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva lineage completo y comparación homogénea; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta baseline", "fixture adverso: data/code/env/split/métrica versionados y candidato mejor", "CASO-TAC-047-1B es sintético"],
        tests: "El fixture `CASO-TAC-047-1B` satisface un predicado de dominio real; imprime `S47-T1-B PASS` y el assert booleano pasa.",
        feedback: "S47-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa INVALIDATE_COMPARISON y por qué faltar baseline exige RESTORE_LINEAGE.",
        starterCode: {
          language: 'python',
          title: "s47-t1-b-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-1B", **{"data":"ds-v3","code":"git:abc","env":"lock:def","split":"holdout-v1","metric_definition":"f1-v2","candidate":0.82,"baseline":0.78}}
meets_contract = not record["data"] or record["candidate"] <= record["baseline"]
status = "PASS" if meets_contract else "INVALIDATE_COMPARISON"
print("S47-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t1-b-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-1B", **{"data":"ds-v3","code":"git:abc","env":"lock:def","split":"holdout-v1","metric_definition":"f1-v2","candidate":0.82,"baseline":0.78}}
meets_contract = all(record[k] for k in ("data","code","env","split","metric_definition")) and record["candidate"] > record["baseline"]
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
        edgeCases: ["falta baseline", "fixture adverso: data/code/env/split/métrica versionados y candidato mejor", "CASO-TAC-047-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `baseline` ausente y produce exactamente `PASS INVALIDATE_COMPARISON MISSING:baseline`.",
        feedback: "S47-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa INVALIDATE_COMPARISON y por qué faltar baseline exige RESTORE_LINEAGE.",
        starterCode: {
          language: 'python',
          title: "s47-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
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
    return "PASS" if all(record[k] for k in ("data","code","env","split","metric_definition")) and record["candidate"] > record["baseline"] else "INVALIDATE_COMPARISON"

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
        edgeCases: ["falta baseline", "fixture adverso: data/code/env/split/métrica versionados y candidato mejor", "CASO-TAC-047-1B es sintético"],
        tests: "Fixtures `CASO-TAC-047-1B`, adverso y sin `baseline` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa INVALIDATE_COMPARISON y por qué faltar baseline exige RESTORE_LINEAGE.",
        starterCode: {
          language: 'python',
          title: "s47-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
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
    return "CONTINUE" if all(record[k] for k in ("data","code","env","split","metric_definition")) and record["candidate"] > record["baseline"] else "INVALIDATE_COMPARISON"

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
        hint: "Relaciona los campos `input_signature`, `output_signature`, `stage`, `approved` con la regla explicada en S47-T2-A.",
        hints: [
          "Relaciona los campos `input_signature`, `output_signature`, `stage`, `approved` con la regla explicada en S47-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva firma compatible y aprobación trazada; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta approved", "fixture adverso: firma exacta, staging y aprobación", "CASO-TAC-047-2A es sintético"],
        tests: "El fixture `CASO-TAC-047-2A` satisface un predicado de dominio real; imprime `S47-T2-A PASS` y el assert booleano pasa.",
        feedback: "S47-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa DENY_MODEL_PROMOTION y por qué faltar approved exige REQUEST_MODEL_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s47-t2-a-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-2A", **{"input_signature":{"age":"int","region":"str"},"output_signature":{"priority":"float"},"stage":"staging","approved":True}}
meets_contract = not record["approved"] or record["stage"] == "production"
status = "PASS" if meets_contract else "DENY_MODEL_PROMOTION"
print("S47-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s47-t2-a-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-2A", **{"input_signature":{"age":"int","region":"str"},"output_signature":{"priority":"float"},"stage":"staging","approved":True}}
meets_contract = record["input_signature"] == {"age":"int","region":"str"} and record["output_signature"] == {"priority":"float"} and record["stage"] == "staging" and record["approved"]
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
        edgeCases: ["falta approved", "fixture adverso: firma exacta, staging y aprobación", "CASO-TAC-047-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `approved` ausente y produce exactamente `PASS DENY_MODEL_PROMOTION MISSING:approved`.",
        feedback: "S47-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa DENY_MODEL_PROMOTION y por qué faltar approved exige REQUEST_MODEL_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s47-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
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
          code: `def assess(record: dict) -> str:
    required = {"case_id", "input_signature", "output_signature", "stage", "approved"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["input_signature"] == {"age":"int","region":"str"} and record["output_signature"] == {"priority":"float"} and record["stage"] == "staging" and record["approved"] else "DENY_MODEL_PROMOTION"

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
        edgeCases: ["falta approved", "fixture adverso: firma exacta, staging y aprobación", "CASO-TAC-047-2A es sintético"],
        tests: "Fixtures `CASO-TAC-047-2A`, adverso y sin `approved` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa DENY_MODEL_PROMOTION y por qué faltar approved exige REQUEST_MODEL_APPROVAL.",
        starterCode: {
          language: 'python',
          title: "s47-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
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
          code: `def decide(record: dict) -> str:
    required = {"case_id", "input_signature", "output_signature", "stage", "approved"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_MODEL_APPROVAL"
    return "CONTINUE" if record["input_signature"] == {"age":"int","region":"str"} and record["output_signature"] == {"priority":"float"} and record["stage"] == "staging" and record["approved"] else "DENY_MODEL_PROMOTION"

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
        hint: "Relaciona los campos `artifact_digest`, `feature_version`, `serving_feature_version`, `card_sections` con la regla explicada en S47-T2-B.",
        hints: [
          "Relaciona los campos `artifact_digest`, `feature_version`, `serving_feature_version`, `card_sections` con la regla explicada en S47-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva digest/card/compatibilidad verificados; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta card_sections", "fixture adverso: digest, compatibilidad de features y card completa", "CASO-TAC-047-2B es sintético"],
        tests: "El fixture `CASO-TAC-047-2B` satisface un predicado de dominio real; imprime `S47-T2-B PASS` y el assert booleano pasa.",
        feedback: "S47-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_MODEL_ARTIFACT y por qué faltar card_sections exige COMPLETE_MODEL_CARD.",
        starterCode: {
          language: 'python',
          title: "s47-t2-b-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-2B", **{"artifact_digest":"sha256:model","feature_version":"features-v3","serving_feature_version":"features-v3","card_sections":{"use","limits","metrics","risks"}}}
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
        edgeCases: ["falta card_sections", "fixture adverso: digest, compatibilidad de features y card completa", "CASO-TAC-047-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `card_sections` ausente y produce exactamente `PASS REJECT_MODEL_ARTIFACT MISSING:card_sections`.",
        feedback: "S47-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_MODEL_ARTIFACT y por qué faltar card_sections exige COMPLETE_MODEL_CARD.",
        starterCode: {
          language: 'python',
          title: "s47-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
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
        edgeCases: ["falta card_sections", "fixture adverso: digest, compatibilidad de features y card completa", "CASO-TAC-047-2B es sintético"],
        tests: "Fixtures `CASO-TAC-047-2B`, adverso y sin `card_sections` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_MODEL_ARTIFACT y por qué faltar card_sections exige COMPLETE_MODEL_CARD.",
        starterCode: {
          language: 'python',
          title: "s47-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
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
        hint: "Relaciona los campos `batch_features`, `online_features`, `leakage`, `contract_tests` con la regla explicada en S47-T3-A.",
        hints: [
          "Relaciona los campos `batch_features`, `online_features`, `leakage`, `contract_tests` con la regla explicada en S47-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva paridad de features en fixtures; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta contract_tests", "fixture adverso: paridad batch/online sin leakage y contract tests", "CASO-TAC-047-3A es sintético"],
        tests: "El fixture `CASO-TAC-047-3A` satisface un predicado de dominio real; imprime `S47-T3-A PASS` y el assert booleano pasa.",
        feedback: "S47-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa DISABLE_INCONSISTENT_SERVING y por qué faltar contract_tests exige TRACE_FEATURE_PIPELINE.",
        starterCode: {
          language: 'python',
          title: "s47-t3-a-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-3A", **{"batch_features":[0.1,0.4,0.8],"online_features":[0.1,0.4,0.8],"leakage":False,"contract_tests":3}}
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
        edgeCases: ["falta contract_tests", "fixture adverso: paridad batch/online sin leakage y contract tests", "CASO-TAC-047-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `contract_tests` ausente y produce exactamente `PASS DISABLE_INCONSISTENT_SERVING MISSING:contract_tests`.",
        feedback: "S47-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa DISABLE_INCONSISTENT_SERVING y por qué faltar contract_tests exige TRACE_FEATURE_PIPELINE.",
        starterCode: {
          language: 'python',
          title: "s47-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
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
        edgeCases: ["falta contract_tests", "fixture adverso: paridad batch/online sin leakage y contract tests", "CASO-TAC-047-3A es sintético"],
        tests: "Fixtures `CASO-TAC-047-3A`, adverso y sin `contract_tests` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa DISABLE_INCONSISTENT_SERVING y por qué faltar contract_tests exige TRACE_FEATURE_PIPELINE.",
        starterCode: {
          language: 'python',
          title: "s47-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
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
        hint: "Relaciona los campos `p95_ms`, `slo_ms`, `batch_size`, `fallback`, `fallback_tested` con la regla explicada en S47-T3-B.",
        hints: [
          "Relaciona los campos `p95_ms`, `slo_ms`, `batch_size`, `fallback`, `fallback_tested` con la regla explicada en S47-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva SLO de latencia y fallback probado; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta fallback_tested", "fixture adverso: p95 bajo SLO, batch acotado y fallback probado", "CASO-TAC-047-3B es sintético"],
        tests: "El fixture `CASO-TAC-047-3B` satisface un predicado de dominio real; imprime `S47-T3-B PASS` y el assert booleano pasa.",
        feedback: "S47-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa ACTIVATE_SAFE_FALLBACK y por qué faltar fallback_tested exige TUNE_BATCH_OR_CAPACITY.",
        starterCode: {
          language: 'python',
          title: "s47-t3-b-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-3B", **{"p95_ms":120,"slo_ms":180,"batch_size":16,"fallback":"rules-v2","fallback_tested":True}}
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
        edgeCases: ["falta fallback_tested", "fixture adverso: p95 bajo SLO, batch acotado y fallback probado", "CASO-TAC-047-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `fallback_tested` ausente y produce exactamente `PASS ACTIVATE_SAFE_FALLBACK MISSING:fallback_tested`.",
        feedback: "S47-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa ACTIVATE_SAFE_FALLBACK y por qué faltar fallback_tested exige TUNE_BATCH_OR_CAPACITY.",
        starterCode: {
          language: 'python',
          title: "s47-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
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
        edgeCases: ["falta fallback_tested", "fixture adverso: p95 bajo SLO, batch acotado y fallback probado", "CASO-TAC-047-3B es sintético"],
        tests: "Fixtures `CASO-TAC-047-3B`, adverso y sin `fallback_tested` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa ACTIVATE_SAFE_FALLBACK y por qué faltar fallback_tested exige TUNE_BATCH_OR_CAPACITY.",
        starterCode: {
          language: 'python',
          title: "s47-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
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
        hint: "Relaciona los campos `mode`, `traffic_pct`, `quality_delta`, `max_quality_drop`, `error_rate`, `max_error_rate`, `hooks` con la regla explicada en S47-T4-A.",
        hints: [
          "Relaciona los campos `mode`, `traffic_pct`, `quality_delta`, `max_quality_drop`, `error_rate`, `max_error_rate`, `hooks` con la regla explicada en S47-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva canary con criterio promote/stop; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta hooks", "fixture adverso: tráfico limitado, quality/error gates y hooks", "CASO-TAC-047-4A es sintético"],
        tests: "El fixture `CASO-TAC-047-4A` satisface un predicado de dominio real; imprime `S47-T4-A PASS` y el assert booleano pasa.",
        feedback: "S47-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa STOP_CANARY y por qué faltar hooks exige COLLECT_MORE_SHADOW_EVIDENCE.",
        starterCode: {
          language: 'python',
          title: "s47-t4-a-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-4A", **{"mode":"canary","traffic_pct":5,"quality_delta":0.01,"max_quality_drop":0.02,"error_rate":0.004,"max_error_rate":0.01,"hooks":True}}
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
        edgeCases: ["falta hooks", "fixture adverso: tráfico limitado, quality/error gates y hooks", "CASO-TAC-047-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `hooks` ausente y produce exactamente `PASS STOP_CANARY MISSING:hooks`.",
        feedback: "S47-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa STOP_CANARY y por qué faltar hooks exige COLLECT_MORE_SHADOW_EVIDENCE.",
        starterCode: {
          language: 'python',
          title: "s47-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
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
        edgeCases: ["falta hooks", "fixture adverso: tráfico limitado, quality/error gates y hooks", "CASO-TAC-047-4A es sintético"],
        tests: "Fixtures `CASO-TAC-047-4A`, adverso y sin `hooks` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa STOP_CANARY y por qué faltar hooks exige COLLECT_MORE_SHADOW_EVIDENCE.",
        starterCode: {
          language: 'python',
          title: "s47-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
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
        hint: "Relaciona los campos `current`, `last_good`, `compatible_features`, `rollback_tested`, `retired`, `audit_entry` con la regla explicada en S47-T4-B.",
        hints: [
          "Relaciona los campos `current`, `last_good`, `compatible_features`, `rollback_tested`, `retired`, `audit_entry` con la regla explicada en S47-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva restauración y retirement auditados; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta audit_entry", "fixture adverso: last-known-good compatible, rollback y retiro auditado", "CASO-TAC-047-4B es sintético"],
        tests: "El fixture `CASO-TAC-047-4B` satisface un predicado de dominio real; imprime `S47-T4-B PASS` y el assert booleano pasa.",
        feedback: "S47-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_TO_LAST_GOOD y por qué faltar audit_entry exige REVIEW_RETIREMENT.",
        starterCode: {
          language: 'python',
          title: "s47-t4-b-e1.py",
          code: `record = {"case_id": "CASO-TAC-047-4B", **{"current":"1.2.0","last_good":"1.1.0","compatible_features":True,"rollback_tested":True,"retired":{"1.0.0"},"audit_entry":True}}
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
        edgeCases: ["falta audit_entry", "fixture adverso: last-known-good compatible, rollback y retiro auditado", "CASO-TAC-047-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `audit_entry` ausente y produce exactamente `PASS ROLLBACK_TO_LAST_GOOD MISSING:audit_entry`.",
        feedback: "S47-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_TO_LAST_GOOD y por qué faltar audit_entry exige REVIEW_RETIREMENT.",
        starterCode: {
          language: 'python',
          title: "s47-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
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
        edgeCases: ["falta audit_entry", "fixture adverso: last-known-good compatible, rollback y retiro auditado", "CASO-TAC-047-4B es sintético"],
        tests: "Fixtures `CASO-TAC-047-4B`, adverso y sin `audit_entry` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S47-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_TO_LAST_GOOD y por qué faltar audit_entry exige REVIEW_RETIREMENT.",
        starterCode: {
          language: 'python',
          title: "s47-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
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
    title: "[FINAL] MLOps: experimentos, registro y serving (CP-N4-B (cierre) + CF-4)",
    context: "Production Data/ML Platform con CF-4. Trabaja sobre un modelo sintético de priorización de atención para una organización ficticia en Tacna. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida: run comparable, modelo registrado, deployment canary y decisión auditable. El gate se bloquea ante: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción.",
    objectives: [
      "Convertir dataset versionado, commit, entorno fijado, parámetros y firma de features en run comparable, modelo registrado, deployment canary y decisión auditable.",
      "Demostrar el gate: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia.",
      "Probar el fallo: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-TAC-047`.",
      "Incluye tracking reproducible de baseline/candidato.",
      "Incluye registro con firma, card y approvals.",
      "Incluye paridad batch/online y fallback.",
      "Incluye shadow/canary, monitoring hooks, rollback y retiro.",
      "Automatiza un caso normal, uno de breach (`ROLLBACK_MODEL`) y uno incierto (`HOLD_STAGE`).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-TAC-047"
REQUIRED = ['tracking_reproducible_de_baseline_candidato', 'registro_con_firma_card_y_approvals', 'paridad_batch_online_y_fallback', 'shadow_canary_monitoring_hooks_rollback_y_retiro']
evidence = {
    "tracking_reproducible_de_baseline_candidato": False,
    "registro_con_firma_card_y_approvals": False,
    "paridad_batch_online_y_fallback": False,
    "shadow_canary_monitoring_hooks_rollback_y_retiro": False
}

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-B + CF-4 · modelo promovible y reversible: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto, no cambiando asserts.",
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
        question: "¿Qué evidencia permite aprobar `tracking y reproducibilidad` en CASO-TAC-047?",
        options: ["un print sin assert ni versión", "una captura de pantalla sin fuente", "rerun dentro de tolerancia declarada", "datos personales reales para que parezca auténtico"],
        correctIndex: 2,
        explanation: "La teoría exige rerun dentro de tolerancia declarada; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si ocurre la condición de error de S47, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["emitir ROLLBACK_MODEL y conservar evidencia", "continuar y ocultar el warning", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
        correctIndex: 0,
        explanation: "El contrato falla cerrado con ROLLBACK_MODEL; no convierte incertidumbre o breach en éxito.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-B + CF-4 · modelo promovible y reversible`?",
        options: ["el archivo S47 existe, aunque no pruebe el gate", "solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia", "el README afirma que funciona", "se usó la herramienta más nueva"],
        correctIndex: 1,
        explanation: "El gate es conductual y medible: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia.",
      },
      {
        question: "¿Qué tratamiento de `CASO-TAC-047` respeta el alcance del curso?",
        options: ["reemplazarlo por datos reales sin consentimiento", "subir secretos para facilitar la demo", "inferir fraude o parentesco desde ER", "mantenerlo sintético, mínimo, trazable y sujeto a revisión humana"],
        correctIndex: 3,
        explanation: "Los casos son sintéticos; ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.",
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
        label: "KServe",
        url: "https://kserve.github.io/website/latest/",
        note: "Serving, canary y runtimes",
      },
      {
        label: "Google Model Cards",
        url: "https://modelcards.withgoogle.com/about",
        note: "Documentación de uso, métricas y límites",
      },
    ],
    books: [
      { label: "Designing Data-Intensive Applications", note: "Consulta selectiva: contratos, consistencia, operación y trade-offs; no reemplaza las instrucciones de la sección." },
      { label: "Site Reliability Engineering", note: "Consulta selectiva: SLO, incidentes, capacidad y cambio seguro." },
    ],
    courses: [
      { label: "MIT OpenCourseWare — 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Referencia de práctica incremental y contratos verificables." },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Referencia de problem sets, tests y proyecto final reproducible." },
    ],
  },
}
