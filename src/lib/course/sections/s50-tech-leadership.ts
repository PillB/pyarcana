import type { CourseSection } from '../../types'

export const section50: CourseSection = {
  id: "tech-leadership",
  index: 50,
  title: "Evals, red teaming y fiabilidad de IA",
  shortTitle: "Evals y red team",
  tagline: "suite repetible compara baseline/candidato y bloquea regresiones P0/P1; incluye tool calls y reanudación",
  estimatedHours: 19,
  level: "Master",
  phase: 3,
  icon: "Users",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, evals, red teaming y fiabilidad de ia conecta decisiones técnicas con evidencia operativa. La práctica entrega resultados por severidad, trayectoria, tool calls y decisión promote/block y se promueve solo cuando evals retenidos y adversariales son repetibles y prueban recuperación, no solo texto final.",
  learningOutcomes: [
    { text: "Arma dataset y rúbrica de tareas" },
    { text: "Evalúa resultado, proceso y recovery" },
    { text: "Combina graders det/humanos/LLM" },
    { text: "Calibra jueces y evita order bias" },
    { text: "Prueba injection, exfil y tool misuse" },
    { text: "Mitiga injection indirecta y poisoning" },
    { text: "Detecta hallucination y abstiene" },
    { text: "Opera latency/cost e incidentes" },
  ],
  theory: [
    {
      heading: "Ruta de S50: Evals, red teaming y fiabilidad de IA",
      paragraphs: [
        "Esta sección parte de S49 y usa únicamente contratos, pruebas y controles ya presentados. El caso `CASO-ICA-050` es sintético y puede ejecutarse sin credenciales ni servicios externos.",
        "Producto incremental: Suite de evals, red team y rollback. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida: resultados por severidad, trayectoria, tool calls y decisión promote/block.",
        "La secuencia mantiene liberación gradual: teoría con criterio medible, demo local, ejercicio guiado, validación independiente y transferencia con breach/uncertainty.",
      ],
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-C · quality gate de IA adversarial: evals retenidos y adversariales son repetibles y prueban recuperación, no solo texto final. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "task dataset y rubric",
      subtopicId: "S50-T1-A",
      paragraphs: [
        "El task dataset representa trabajos y slices, separa train/dev/holdout y una rúbrica ancla 0–3 con ejemplos observables.",
        "Contrato operativo. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida de este subtema: dataset versionado y rúbrica calibrada. Error: regresión P0/P1, injection exitosa, exfiltración o grader sin calibrar bloquea release. Criterio de éxito: evals retenidos y adversariales son repetibles y prueban recuperación, no solo texto final.",
        "Aplicación de `task dataset y rubric` al caso peruano sintético `CASO-ICA-050`: un copiloto sintético de operaciones para una organización ficticia en Ica. La evidencia esperada es dataset versionado y rúbrica calibrada. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "task_dataset_rubric.py",
        code: `print("cite_sla"); print(["cites","correct"]); print("n", 1)`,
        output: `cite_sla
['cites', 'correct']
n 1`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S50-T1-A: dataset versionado y rúbrica calibrada. Si falta, responde `REBUILD_EVAL_DATASET`; si no alcanza para decidir, `CALIBRATE_RUBRIC`.",
      },
    },
    {
      heading: "resultado, proceso, trajectory y recovery",
      subtopicId: "S50-T1-B",
      paragraphs: [
        "Evalúa outcome, proceso, trayectoria y recovery: una respuesta correcta tras una tool prohibida sigue siendo fallo.",
        "Contrato operativo. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida de este subtema: tool calls y reanudación calificadas. Error: regresión P0/P1, injection exitosa, exfiltración o grader sin calibrar bloquea release. Criterio de éxito: evals retenidos y adversariales son repetibles y prueban recuperación, no solo texto final.",
        "Aplicación de `resultado, proceso, trajectory y recovery` al caso peruano sintético `CASO-ICA-050`: un copiloto sintético de operaciones para una organización ficticia en Ica. La evidencia esperada es tool calls y reanudación calificadas. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "outcome_process_trajectory_recovery.py",
        code: `print(3); print(sorted(["outcome","process","recovery","trajectory"])); print("not_only_final_text", True)`,
        output: `3
['outcome', 'process', 'recovery', 'trajectory']
not_only_final_text True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S50-T1-B, audita tool calls y reanudación calificadas. Un breach activa `FAIL_UNSAFE_TRAJECTORY` y una ausencia activa `HUMAN_REVIEW_PROCESS`.",
      },
    },
    {
      heading: "graders deterministas/humanos/LLM",
      subtopicId: "S50-T2-A",
      paragraphs: [
        "Graders deterministas cubren contratos, humanos juzgan matices y LLM judges escalan; ninguno es oráculo sin calibración.",
        "Contrato operativo. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida de este subtema: acuerdo y desacuerdos medidos. Error: regresión P0/P1, injection exitosa, exfiltración o grader sin calibrar bloquea release. Criterio de éxito: evals retenidos y adversariales son repetibles y prueban recuperación, no solo texto final.",
        "Aplicación de `graders deterministas/humanos/LLM` al caso peruano sintético `CASO-ICA-050`: un copiloto sintético de operaciones para una organización ficticia en Ica. La evidencia esperada es acuerdo y desacuerdos medidos. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "graders_det_human_llm.py",
        code: `print(1); print(0); print("mix", ["det","human","llm"])`,
        output: `1
0
mix ['det', 'human', 'llm']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S50-T2-A conserva acuerdo y desacuerdos medidos; no conviertas `RECALIBRATE_GRADERS` ni `ADJUDICATE_DISAGREEMENT` en éxito silencioso.",
      },
    },
    {
      heading: "calibración, order bias y conjunto retenido",
      subtopicId: "S50-T2-B",
      paragraphs: [
        "Calibra contra ejemplos ancla, alterna orden para medir bias y protege holdout para que la optimización no lo memorice.",
        "Contrato operativo. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida de este subtema: order bias bajo umbral y holdout intacto. Error: regresión P0/P1, injection exitosa, exfiltración o grader sin calibrar bloquea release. Criterio de éxito: evals retenidos y adversariales son repetibles y prueban recuperación, no solo texto final.",
        "Aplicación de `calibración, order bias y conjunto retenido` al caso peruano sintético `CASO-ICA-050`: un copiloto sintético de operaciones para una organización ficticia en Ica. La evidencia esperada es order bias bajo umbral y holdout intacto. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "calibration_order_bias_holdout.py",
        code: `print(0.3); print("holdout", True); print("calibrate", "temperature_or_rubric")`,
        output: `0.3
holdout True
calibrate temperature_or_rubric`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S50-T2-B: demuestra order bias bajo umbral y holdout intacto. Falla cerrada con `INVALIDATE_JUDGE` y deriva incertidumbre mediante `SEAL_NEW_HOLDOUT`.",
      },
    },
    {
      heading: "prompt injection, exfiltración y tool misuse",
      subtopicId: "S50-T3-A",
      paragraphs: [
        "Red team intenta injection, exfiltration y tool misuse en argumentos y resultados; éxito significa que el control contiene, no que el prompt «se porta bien».",
        "Contrato operativo. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida de este subtema: ataques críticos bloqueados por policy. Error: regresión P0/P1, injection exitosa, exfiltración o grader sin calibrar bloquea release. Criterio de éxito: evals retenidos y adversariales son repetibles y prueban recuperación, no solo texto final.",
        "Aplicación de `prompt injection, exfiltración y tool misuse` al caso peruano sintético `CASO-ICA-050`: un copiloto sintético de operaciones para una organización ficticia en Ica. La evidencia esperada es ataques críticos bloqueados por policy. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "injection_exfil_tool_misuse.py",
        code: `print(True); print(False); print("tool_misuse", "allowlist")`,
        output: `True
False
tool_misuse allowlist`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S50-T3-A, el artefacto comprobable es ataques críticos bloqueados por policy. Sin él corresponde `BLOCK_SECURITY_P0` o, si faltan datos, `PRESERVE_ATTACK_TRACE`.",
      },
    },
    {
      heading: "indirect injection, data poisoning y least privilege",
      subtopicId: "S50-T3-B",
      paragraphs: [
        "Indirect injection llega en documentos/tools; poisoning altera corpus y least privilege reduce radio aunque el modelo obedezca contenido hostil.",
        "Contrato operativo. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida de este subtema: contenido recuperado no eleva permisos. Error: regresión P0/P1, injection exitosa, exfiltración o grader sin calibrar bloquea release. Criterio de éxito: evals retenidos y adversariales son repetibles y prueban recuperación, no solo texto final.",
        "Aplicación de `indirect injection, data poisoning y least privilege` al caso peruano sintético `CASO-ICA-050`: un copiloto sintético de operaciones para una organización ficticia en Ica. La evidencia esperada es contenido recuperado no eleva permisos. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "indirect_poison_least_priv.py",
        code: `print(True); print(False); print("poison", "source_acl")`,
        output: `True
False
poison source_acl`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S50-T3-B: prueba contenido recuperado no eleva permisos y registra por separado `QUARANTINE_POISONED_CORPUS` (breach) y `REDUCE_TOOL_PRIVILEGE` (missing).",
      },
    },
    {
      heading: "hallucination y abstención",
      subtopicId: "S50-T4-A",
      paragraphs: [
        "Mide unsupported claims y calidad de abstención por slice; ante evidencia insuficiente se cita límite y se deriva, no se inventa.",
        "Contrato operativo. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida de este subtema: hallucination crítica cero en holdout. Error: regresión P0/P1, injection exitosa, exfiltración o grader sin calibrar bloquea release. Criterio de éxito: evals retenidos y adversariales son repetibles y prueban recuperación, no solo texto final.",
        "Aplicación de `hallucination y abstención` al caso peruano sintético `CASO-ICA-050`: un copiloto sintético de operaciones para una organización ficticia en Ica. La evidencia esperada es hallucination crítica cero en holdout. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "hallucination_abstention.py",
        code: `print("answer"); print("abstain"); print("abstain")`,
        output: `answer
abstain
abstain`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S50-T4-A acepta solo hallucination crítica cero en holdout; una violación produce `BLOCK_HALLUCINATION_REGRESSION` y un registro incompleto produce `REVIEW_ABSTENTION_SLICE`.",
      },
    },
    {
      heading: "latency/cost/caching, incident response y rollback",
      subtopicId: "S50-T4-B",
      paragraphs: [
        "Latencia/costo/cache forman SLO; incident response congela versión, preserva traces redactados y rollback restaura baseline conocido.",
        "Contrato operativo. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida de este subtema: rollback dentro de RTO con evidencia. Error: regresión P0/P1, injection exitosa, exfiltración o grader sin calibrar bloquea release. Criterio de éxito: evals retenidos y adversariales son repetibles y prueban recuperación, no solo texto final.",
        "Aplicación de `latency/cost/caching, incident response y rollback` al caso peruano sintético `CASO-ICA-050`: un copiloto sintético de operaciones para una organización ficticia en Ica. La evidencia esperada es rollback dentro de RTO con evidencia. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "latency_cost_cache_incident_rollback.py",
        code: `print({"p95_ms":800,"cost_usd":0.02}); print("incident", "rollback_model"); print("cache", "prompt_prefix")`,
        output: `{'p95_ms': 800, 'cost_usd': 0.02}
incident rollback_model
cache prompt_prefix`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S50-T4-B: conserva rollback dentro de RTO con evidencia, la evidencia de `ROLLBACK_AI_RELEASE` y la ruta humana `ACTIVATE_INCIDENT_RESPONSE`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S50 (Evals, red teaming y fiabilidad de IA) alineadas a CP-N4-C (quality gate).",
    steps: [
      {
        demoId: "S50-T1-A-DEMO",
        subtopicId: "S50-T1-A",
        environment: "local-python",
        description: "Demo: task dataset y rubric",
        code: {
          language: 'python',
          title: "demo_task_dataset_rubric.py",
          code: `print("dataset", "versioned"); print("rubric", True); print("gold", "synthetic")`,
          output: `dataset versioned
rubric True
gold synthetic`,
        },
        why: "Hace observable `task dataset y rubric` con un caso local pequeño y deja como evidencia dataset versionado y rúbrica calibrada; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S50-T1-B-DEMO",
        subtopicId: "S50-T1-B",
        environment: "local-python",
        description: "Demo: resultado, proceso, trajectory y recovery",
        code: {
          language: 'python',
          title: "demo_outcome_process_trajectory_recovery.py",
          code: `print("trajectory", True); print("tool_args_checked", True); print("recovery", True)`,
          output: `trajectory True
tool_args_checked True
recovery True`,
        },
        why: "Hace observable `resultado, proceso, trajectory y recovery` con un caso local pequeño y deja como evidencia tool calls y reanudación calificadas; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S50-T2-A-DEMO",
        subtopicId: "S50-T2-A",
        environment: "local-python",
        description: "Demo: graders deterministas/humanos/LLM",
        code: {
          language: 'python',
          title: "demo_graders_det_human_llm.py",
          code: `print("det_first", True); print("llm_judge", "calibrated"); print("human", "spotcheck")`,
          output: `det_first True
llm_judge calibrated
human spotcheck`,
        },
        why: "Hace observable `graders deterministas/humanos/LLM` con un caso local pequeño y deja como evidencia acuerdo y desacuerdos medidos; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S50-T2-B-DEMO",
        subtopicId: "S50-T2-B",
        environment: "local-python",
        description: "Demo: calibración, order bias y conjunto retenido",
        code: {
          language: 'python',
          title: "demo_calibration_order_bias_holdout.py",
          code: `print("bias", 0.3); print("holdout_set", True); print("shuffle_order", True)`,
          output: `bias 0.3
holdout_set True
shuffle_order True`,
        },
        why: "Hace observable `calibración, order bias y conjunto retenido` con un caso local pequeño y deja como evidencia order bias bajo umbral y holdout intacto; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S50-T3-A-DEMO",
        subtopicId: "S50-T3-A",
        environment: "local-python",
        description: "Demo: prompt injection, exfiltración y tool misuse",
        code: {
          language: 'python',
          title: "demo_injection_exfil_tool_misuse.py",
          code: `print("injection", True); print("exfil", "block"); print("tools", "allowlist")`,
          output: `injection True
exfil block
tools allowlist`,
        },
        why: "Hace observable `prompt injection, exfiltración y tool misuse` con un caso local pequeño y deja como evidencia ataques críticos bloqueados por policy; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S50-T3-B-DEMO",
        subtopicId: "S50-T3-B",
        environment: "local-python",
        description: "Demo: indirect injection, data poisoning y least privilege",
        code: {
          language: 'python',
          title: "demo_indirect_poison_least_priv.py",
          code: `print("indirect", "html_comments"); print("privilege", "min"); print("data_poison", "review")`,
          output: `indirect html_comments
privilege min
data_poison review`,
        },
        why: "Hace observable `indirect injection, data poisoning y least privilege` con un caso local pequeño y deja como evidencia contenido recuperado no eleva permisos; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S50-T4-A-DEMO",
        subtopicId: "S50-T4-A",
        environment: "local-python",
        description: "Demo: hallucination y abstención",
        code: {
          language: 'python',
          title: "demo_hallucination_abstention.py",
          code: `print("hallucination", "unsupported_claim"); print("abstain_policy", True); print("cite_or_quit", True)`,
          output: `hallucination unsupported_claim
abstain_policy True
cite_or_quit True`,
        },
        why: "Hace observable `hallucination y abstención` con un caso local pequeño y deja como evidencia hallucination crítica cero en holdout; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S50-T4-B-DEMO",
        subtopicId: "S50-T4-B",
        environment: "local-python",
        description: "Demo: latency/cost/caching, incident response y rollback",
        code: {
          language: 'python',
          title: "demo_latency_cost_cache_incident_rollback.py",
          code: `print("rollback", True); print("cost_guardrail", True); print("latency_slo", 1000)`,
          output: `rollback True
cost_guardrail True
latency_slo 1000`,
        },
        why: "Hace observable `latency/cost/caching, incident response y rollback` con un caso local pequeño y deja como evidencia rollback dentro de RTO con evidencia; el demo modela el contrato, no un servicio externo.",
      },
    ],
  },
  weDo: {
    intro: "S50 · Laboratorio Suite de evals, red team y rollback: 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed con ocho fixtures peruanos sintéticos distintos.",
    steps: [
      {
        id: "S50-T1-A-E1",
        subtopicId: "S50-T1-A",
        kind: "guided",
        instruction: "S50-T1-A-E1 · Calcula el contrato de `task dataset y rubric` sobre `CASO-ICA-050-1A`. La entrada es el dict completo del starter; la operación debe demostrar slices suman tasks, rúbrica 0–3 y holdout. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S50-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `REBUILD_EVAL_DATASET` en E2.",
        hint: "Relaciona los campos `tasks`, `slices`, `rubric_levels`, `holdout` con la regla explicada en S50-T1-A.",
        hints: [
          "Relaciona los campos `tasks`, `slices`, `rubric_levels`, `holdout` con la regla explicada en S50-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva dataset versionado y rúbrica calibrada; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta holdout", "fixture adverso: slices suman tasks, rúbrica 0–3 y holdout", "CASO-ICA-050-1A es sintético"],
        tests: "El fixture `CASO-ICA-050-1A` satisface un predicado de dominio real; imprime `S50-T1-A PASS` y el assert booleano pasa.",
        feedback: "S50-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REBUILD_EVAL_DATASET y por qué faltar holdout exige CALIBRATE_RUBRIC.",
        starterCode: {
          language: 'python',
          title: "s50-t1-a-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-1A", **{"tasks":40,"slices":{"normal":25,"edge":10,"adversarial":5},"rubric_levels":{0,1,2,3},"holdout":10}}
meets_contract = sum(record["slices"].values()) != record["tasks"] or record["holdout"] == 0
status = "PASS" if meets_contract else "REBUILD_EVAL_DATASET"
print("S50-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t1-a-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-1A", **{"tasks":40,"slices":{"normal":25,"edge":10,"adversarial":5},"rubric_levels":{0,1,2,3},"holdout":10}}
meets_contract = sum(record["slices"].values()) == record["tasks"] and record["rubric_levels"] == {0,1,2,3} and 0 < record["holdout"] < record["tasks"]
status = "PASS" if meets_contract else "REBUILD_EVAL_DATASET"
print("S50-T1-A", status)
assert meets_contract is True` ,
          output: `S50-T1-A PASS` ,
        },
      },
      {
        id: "S50-T1-A-E2",
        subtopicId: "S50-T1-A",
        kind: "independent",
        instruction: "S50-T1-A-E2 · Modela tres rutas de `task dataset y rubric`: fixture válido, fixture adverso y registro sin `holdout`. Entrada: dict con case_id, tasks, slices, rubric_levels, holdout. Salidas exactas: `PASS`, `REBUILD_EVAL_DATASET`, `MISSING:holdout`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a holdout debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a holdout debe ocurrir antes de esa rama.",
          "Después aplica la regla de S50-T1-A: slices suman tasks, rúbrica 0–3 y holdout. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta holdout", "fixture adverso: slices suman tasks, rúbrica 0–3 y holdout", "CASO-ICA-050-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `holdout` ausente y produce exactamente `PASS REBUILD_EVAL_DATASET MISSING:holdout`.",
        feedback: "S50-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REBUILD_EVAL_DATASET y por qué faltar holdout exige CALIBRATE_RUBRIC.",
        starterCode: {
          language: 'python',
          title: "s50-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "tasks", "slices", "rubric_levels", "holdout"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if sum(record["slices"].values()) != record["tasks"] or record["holdout"] == 0 else "REBUILD_EVAL_DATASET"

valid = {"case_id": "CASO-ICA-050-1A", **{"tasks":40,"slices":{"normal":25,"edge":10,"adversarial":5},"rubric_levels":{0,1,2,3},"holdout":10}}
invalid = {"case_id": "CASO-ICA-050-1A", **{"tasks":40,"slices":{"normal":40},"rubric_levels":{1,2},"holdout":0}}
incomplete = {**valid}
incomplete.pop("holdout")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "tasks", "slices", "rubric_levels", "holdout"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if sum(record["slices"].values()) == record["tasks"] and record["rubric_levels"] == {0,1,2,3} and 0 < record["holdout"] < record["tasks"] else "REBUILD_EVAL_DATASET"

valid = {"case_id": "CASO-ICA-050-1A", **{"tasks":40,"slices":{"normal":25,"edge":10,"adversarial":5},"rubric_levels":{0,1,2,3},"holdout":10}}
invalid = {"case_id": "CASO-ICA-050-1A", **{"tasks":40,"slices":{"normal":40},"rubric_levels":{1,2},"holdout":0}}
incomplete = {**valid}
incomplete.pop("holdout")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REBUILD_EVAL_DATASET MISSING:holdout` ,
        },
      },
      {
        id: "S50-T1-A-E3",
        subtopicId: "S50-T1-A",
        kind: "transfer",
        instruction: "S50-T1-A-E3 · Simula fallo cerrado para `task dataset y rubric` con tres fixtures distintos. `CASO-ICA-050-1A` debe continuar, el adverso debe devolver `REBUILD_EVAL_DATASET` y la ausencia de `holdout` debe devolver `CALIBRATE_RUBRIC`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `CALIBRATE_RUBRIC` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `CALIBRATE_RUBRIC` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró slices suman tasks, rúbrica 0–3 y holdout; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta holdout", "fixture adverso: slices suman tasks, rúbrica 0–3 y holdout", "CASO-ICA-050-1A es sintético"],
        tests: "Fixtures `CASO-ICA-050-1A`, adverso y sin `holdout` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S50-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REBUILD_EVAL_DATASET y por qué faltar holdout exige CALIBRATE_RUBRIC.",
        starterCode: {
          language: 'python',
          title: "s50-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "tasks", "slices", "rubric_levels", "holdout"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if sum(record["slices"].values()) != record["tasks"] or record["holdout"] == 0 else "REBUILD_EVAL_DATASET"

valid = {"case_id": "CASO-ICA-050-1A", **{"tasks":40,"slices":{"normal":25,"edge":10,"adversarial":5},"rubric_levels":{0,1,2,3},"holdout":10}}
invalid = {"case_id": "CASO-ICA-050-1A", **{"tasks":40,"slices":{"normal":40},"rubric_levels":{1,2},"holdout":0}}
uncertain = {**valid}
uncertain.pop("holdout")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "tasks", "slices", "rubric_levels", "holdout"}
    missing = sorted(required - record.keys())
    if missing:
        return "CALIBRATE_RUBRIC"
    return "CONTINUE" if sum(record["slices"].values()) == record["tasks"] and record["rubric_levels"] == {0,1,2,3} and 0 < record["holdout"] < record["tasks"] else "REBUILD_EVAL_DATASET"

valid = {"case_id": "CASO-ICA-050-1A", **{"tasks":40,"slices":{"normal":25,"edge":10,"adversarial":5},"rubric_levels":{0,1,2,3},"holdout":10}}
invalid = {"case_id": "CASO-ICA-050-1A", **{"tasks":40,"slices":{"normal":40},"rubric_levels":{1,2},"holdout":0}}
uncertain = {**valid}
uncertain.pop("holdout")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REBUILD_EVAL_DATASET", "CALIBRATE_RUBRIC"]` ,
          output: `CONTINUE REBUILD_EVAL_DATASET CALIBRATE_RUBRIC` ,
        },
      },
      {
        id: "S50-T1-B-E1",
        subtopicId: "S50-T1-B",
        kind: "guided",
        instruction: "S50-T1-B-E1 · Compara el contrato de `resultado, proceso, trajectory y recovery` sobre `CASO-ICA-050-1B`. La entrada es el dict completo del starter; la operación debe demostrar cuatro dimensiones sobre mínimo y ninguna tool prohibida. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S50-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `FAIL_UNSAFE_TRAJECTORY` en E2.",
        hint: "Relaciona los campos `outcome`, `process`, `trajectory`, `recovery`, `forbidden_tool_used`, `min_dimension` con la regla explicada en S50-T1-B.",
        hints: [
          "Relaciona los campos `outcome`, `process`, `trajectory`, `recovery`, `forbidden_tool_used`, `min_dimension` con la regla explicada en S50-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva tool calls y reanudación calificadas; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta min_dimension", "fixture adverso: cuatro dimensiones sobre mínimo y ninguna tool prohibida", "CASO-ICA-050-1B es sintético"],
        tests: "El fixture `CASO-ICA-050-1B` satisface un predicado de dominio real; imprime `S50-T1-B PASS` y el assert booleano pasa.",
        feedback: "S50-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa FAIL_UNSAFE_TRAJECTORY y por qué faltar min_dimension exige HUMAN_REVIEW_PROCESS.",
        starterCode: {
          language: 'python',
          title: "s50-t1-b-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-1B", **{"outcome":3,"process":3,"trajectory":2,"recovery":3,"forbidden_tool_used":False,"min_dimension":2}}
meets_contract = record["outcome"] == 3 and record["forbidden_tool_used"]
status = "PASS" if meets_contract else "FAIL_UNSAFE_TRAJECTORY"
print("S50-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t1-b-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-1B", **{"outcome":3,"process":3,"trajectory":2,"recovery":3,"forbidden_tool_used":False,"min_dimension":2}}
meets_contract = min(record[k] for k in ("outcome","process","trajectory","recovery")) >= record["min_dimension"] and not record["forbidden_tool_used"]
status = "PASS" if meets_contract else "FAIL_UNSAFE_TRAJECTORY"
print("S50-T1-B", status)
assert meets_contract is True` ,
          output: `S50-T1-B PASS` ,
        },
      },
      {
        id: "S50-T1-B-E2",
        subtopicId: "S50-T1-B",
        kind: "independent",
        instruction: "S50-T1-B-E2 · Verifica tres rutas de `resultado, proceso, trajectory y recovery`: fixture válido, fixture adverso y registro sin `min_dimension`. Entrada: dict con case_id, outcome, process, trajectory, recovery, forbidden_tool_used, min_dimension. Salidas exactas: `PASS`, `FAIL_UNSAFE_TRAJECTORY`, `MISSING:min_dimension`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a min_dimension debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a min_dimension debe ocurrir antes de esa rama.",
          "Después aplica la regla de S50-T1-B: cuatro dimensiones sobre mínimo y ninguna tool prohibida. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta min_dimension", "fixture adverso: cuatro dimensiones sobre mínimo y ninguna tool prohibida", "CASO-ICA-050-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `min_dimension` ausente y produce exactamente `PASS FAIL_UNSAFE_TRAJECTORY MISSING:min_dimension`.",
        feedback: "S50-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa FAIL_UNSAFE_TRAJECTORY y por qué faltar min_dimension exige HUMAN_REVIEW_PROCESS.",
        starterCode: {
          language: 'python',
          title: "s50-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "outcome", "process", "trajectory", "recovery", "forbidden_tool_used", "min_dimension"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["outcome"] == 3 and record["forbidden_tool_used"] else "FAIL_UNSAFE_TRAJECTORY"

valid = {"case_id": "CASO-ICA-050-1B", **{"outcome":3,"process":3,"trajectory":2,"recovery":3,"forbidden_tool_used":False,"min_dimension":2}}
invalid = {"case_id": "CASO-ICA-050-1B", **{"outcome":3,"process":1,"trajectory":0,"recovery":1,"forbidden_tool_used":True,"min_dimension":2}}
incomplete = {**valid}
incomplete.pop("min_dimension")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "outcome", "process", "trajectory", "recovery", "forbidden_tool_used", "min_dimension"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if min(record[k] for k in ("outcome","process","trajectory","recovery")) >= record["min_dimension"] and not record["forbidden_tool_used"] else "FAIL_UNSAFE_TRAJECTORY"

valid = {"case_id": "CASO-ICA-050-1B", **{"outcome":3,"process":3,"trajectory":2,"recovery":3,"forbidden_tool_used":False,"min_dimension":2}}
invalid = {"case_id": "CASO-ICA-050-1B", **{"outcome":3,"process":1,"trajectory":0,"recovery":1,"forbidden_tool_used":True,"min_dimension":2}}
incomplete = {**valid}
incomplete.pop("min_dimension")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS FAIL_UNSAFE_TRAJECTORY MISSING:min_dimension` ,
        },
      },
      {
        id: "S50-T1-B-E3",
        subtopicId: "S50-T1-B",
        kind: "transfer",
        instruction: "S50-T1-B-E3 · Extiende fallo cerrado para `resultado, proceso, trajectory y recovery` con tres fixtures distintos. `CASO-ICA-050-1B` debe continuar, el adverso debe devolver `FAIL_UNSAFE_TRAJECTORY` y la ausencia de `min_dimension` debe devolver `HUMAN_REVIEW_PROCESS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `HUMAN_REVIEW_PROCESS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `HUMAN_REVIEW_PROCESS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró cuatro dimensiones sobre mínimo y ninguna tool prohibida; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta min_dimension", "fixture adverso: cuatro dimensiones sobre mínimo y ninguna tool prohibida", "CASO-ICA-050-1B es sintético"],
        tests: "Fixtures `CASO-ICA-050-1B`, adverso y sin `min_dimension` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S50-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa FAIL_UNSAFE_TRAJECTORY y por qué faltar min_dimension exige HUMAN_REVIEW_PROCESS.",
        starterCode: {
          language: 'python',
          title: "s50-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "outcome", "process", "trajectory", "recovery", "forbidden_tool_used", "min_dimension"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["outcome"] == 3 and record["forbidden_tool_used"] else "FAIL_UNSAFE_TRAJECTORY"

valid = {"case_id": "CASO-ICA-050-1B", **{"outcome":3,"process":3,"trajectory":2,"recovery":3,"forbidden_tool_used":False,"min_dimension":2}}
invalid = {"case_id": "CASO-ICA-050-1B", **{"outcome":3,"process":1,"trajectory":0,"recovery":1,"forbidden_tool_used":True,"min_dimension":2}}
uncertain = {**valid}
uncertain.pop("min_dimension")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "outcome", "process", "trajectory", "recovery", "forbidden_tool_used", "min_dimension"}
    missing = sorted(required - record.keys())
    if missing:
        return "HUMAN_REVIEW_PROCESS"
    return "CONTINUE" if min(record[k] for k in ("outcome","process","trajectory","recovery")) >= record["min_dimension"] and not record["forbidden_tool_used"] else "FAIL_UNSAFE_TRAJECTORY"

valid = {"case_id": "CASO-ICA-050-1B", **{"outcome":3,"process":3,"trajectory":2,"recovery":3,"forbidden_tool_used":False,"min_dimension":2}}
invalid = {"case_id": "CASO-ICA-050-1B", **{"outcome":3,"process":1,"trajectory":0,"recovery":1,"forbidden_tool_used":True,"min_dimension":2}}
uncertain = {**valid}
uncertain.pop("min_dimension")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "FAIL_UNSAFE_TRAJECTORY", "HUMAN_REVIEW_PROCESS"]` ,
          output: `CONTINUE FAIL_UNSAFE_TRAJECTORY HUMAN_REVIEW_PROCESS` ,
        },
      },
      {
        id: "S50-T2-A-E1",
        subtopicId: "S50-T2-A",
        kind: "guided",
        instruction: "S50-T2-A-E1 · Filtra el contrato de `graders deterministas/humanos/LLM` sobre `CASO-ICA-050-2A`. La entrada es el dict completo del starter; la operación debe demostrar scores acotados y acuerdo humano-LLM sobre umbral. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S50-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `RECALIBRATE_GRADERS` en E2.",
        hint: "Relaciona los campos `deterministic`, `human`, `llm`, `human_llm_agreement`, `min_agreement` con la regla explicada en S50-T2-A.",
        hints: [
          "Relaciona los campos `deterministic`, `human`, `llm`, `human_llm_agreement`, `min_agreement` con la regla explicada en S50-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva acuerdo y desacuerdos medidos; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta min_agreement", "fixture adverso: scores acotados y acuerdo humano-LLM sobre umbral", "CASO-ICA-050-2A es sintético"],
        tests: "El fixture `CASO-ICA-050-2A` satisface un predicado de dominio real; imprime `S50-T2-A PASS` y el assert booleano pasa.",
        feedback: "S50-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa RECALIBRATE_GRADERS y por qué faltar min_agreement exige ADJUDICATE_DISAGREEMENT.",
        starterCode: {
          language: 'python',
          title: "s50-t2-a-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-2A", **{"deterministic":0.86,"human":0.82,"llm":0.8,"human_llm_agreement":0.78,"min_agreement":0.75}}
meets_contract = record["human_llm_agreement"] < record["min_agreement"]
status = "PASS" if meets_contract else "RECALIBRATE_GRADERS"
print("S50-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t2-a-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-2A", **{"deterministic":0.86,"human":0.82,"llm":0.8,"human_llm_agreement":0.78,"min_agreement":0.75}}
meets_contract = all(0 <= record[k] <= 1 for k in ("deterministic","human","llm")) and record["human_llm_agreement"] >= record["min_agreement"]
status = "PASS" if meets_contract else "RECALIBRATE_GRADERS"
print("S50-T2-A", status)
assert meets_contract is True` ,
          output: `S50-T2-A PASS` ,
        },
      },
      {
        id: "S50-T2-A-E2",
        subtopicId: "S50-T2-A",
        kind: "independent",
        instruction: "S50-T2-A-E2 · Clasifica tres rutas de `graders deterministas/humanos/LLM`: fixture válido, fixture adverso y registro sin `min_agreement`. Entrada: dict con case_id, deterministic, human, llm, human_llm_agreement, min_agreement. Salidas exactas: `PASS`, `RECALIBRATE_GRADERS`, `MISSING:min_agreement`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a min_agreement debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a min_agreement debe ocurrir antes de esa rama.",
          "Después aplica la regla de S50-T2-A: scores acotados y acuerdo humano-LLM sobre umbral. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta min_agreement", "fixture adverso: scores acotados y acuerdo humano-LLM sobre umbral", "CASO-ICA-050-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `min_agreement` ausente y produce exactamente `PASS RECALIBRATE_GRADERS MISSING:min_agreement`.",
        feedback: "S50-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa RECALIBRATE_GRADERS y por qué faltar min_agreement exige ADJUDICATE_DISAGREEMENT.",
        starterCode: {
          language: 'python',
          title: "s50-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "deterministic", "human", "llm", "human_llm_agreement", "min_agreement"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["human_llm_agreement"] < record["min_agreement"] else "RECALIBRATE_GRADERS"

valid = {"case_id": "CASO-ICA-050-2A", **{"deterministic":0.86,"human":0.82,"llm":0.8,"human_llm_agreement":0.78,"min_agreement":0.75}}
invalid = {"case_id": "CASO-ICA-050-2A", **{"deterministic":1.2,"human":0.5,"llm":0.95,"human_llm_agreement":0.3,"min_agreement":0.75}}
incomplete = {**valid}
incomplete.pop("min_agreement")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "deterministic", "human", "llm", "human_llm_agreement", "min_agreement"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if all(0 <= record[k] <= 1 for k in ("deterministic","human","llm")) and record["human_llm_agreement"] >= record["min_agreement"] else "RECALIBRATE_GRADERS"

valid = {"case_id": "CASO-ICA-050-2A", **{"deterministic":0.86,"human":0.82,"llm":0.8,"human_llm_agreement":0.78,"min_agreement":0.75}}
invalid = {"case_id": "CASO-ICA-050-2A", **{"deterministic":1.2,"human":0.5,"llm":0.95,"human_llm_agreement":0.3,"min_agreement":0.75}}
incomplete = {**valid}
incomplete.pop("min_agreement")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS RECALIBRATE_GRADERS MISSING:min_agreement` ,
        },
      },
      {
        id: "S50-T2-A-E3",
        subtopicId: "S50-T2-A",
        kind: "transfer",
        instruction: "S50-T2-A-E3 · Defiende fallo cerrado para `graders deterministas/humanos/LLM` con tres fixtures distintos. `CASO-ICA-050-2A` debe continuar, el adverso debe devolver `RECALIBRATE_GRADERS` y la ausencia de `min_agreement` debe devolver `ADJUDICATE_DISAGREEMENT`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `ADJUDICATE_DISAGREEMENT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ADJUDICATE_DISAGREEMENT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró scores acotados y acuerdo humano-LLM sobre umbral; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta min_agreement", "fixture adverso: scores acotados y acuerdo humano-LLM sobre umbral", "CASO-ICA-050-2A es sintético"],
        tests: "Fixtures `CASO-ICA-050-2A`, adverso y sin `min_agreement` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S50-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa RECALIBRATE_GRADERS y por qué faltar min_agreement exige ADJUDICATE_DISAGREEMENT.",
        starterCode: {
          language: 'python',
          title: "s50-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "deterministic", "human", "llm", "human_llm_agreement", "min_agreement"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["human_llm_agreement"] < record["min_agreement"] else "RECALIBRATE_GRADERS"

valid = {"case_id": "CASO-ICA-050-2A", **{"deterministic":0.86,"human":0.82,"llm":0.8,"human_llm_agreement":0.78,"min_agreement":0.75}}
invalid = {"case_id": "CASO-ICA-050-2A", **{"deterministic":1.2,"human":0.5,"llm":0.95,"human_llm_agreement":0.3,"min_agreement":0.75}}
uncertain = {**valid}
uncertain.pop("min_agreement")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "deterministic", "human", "llm", "human_llm_agreement", "min_agreement"}
    missing = sorted(required - record.keys())
    if missing:
        return "ADJUDICATE_DISAGREEMENT"
    return "CONTINUE" if all(0 <= record[k] <= 1 for k in ("deterministic","human","llm")) and record["human_llm_agreement"] >= record["min_agreement"] else "RECALIBRATE_GRADERS"

valid = {"case_id": "CASO-ICA-050-2A", **{"deterministic":0.86,"human":0.82,"llm":0.8,"human_llm_agreement":0.78,"min_agreement":0.75}}
invalid = {"case_id": "CASO-ICA-050-2A", **{"deterministic":1.2,"human":0.5,"llm":0.95,"human_llm_agreement":0.3,"min_agreement":0.75}}
uncertain = {**valid}
uncertain.pop("min_agreement")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "RECALIBRATE_GRADERS", "ADJUDICATE_DISAGREEMENT"]` ,
          output: `CONTINUE RECALIBRATE_GRADERS ADJUDICATE_DISAGREEMENT` ,
        },
      },
      {
        id: "S50-T2-B-E1",
        subtopicId: "S50-T2-B",
        kind: "guided",
        instruction: "S50-T2-B-E1 · Modela el contrato de `calibración, order bias y conjunto retenido` sobre `CASO-ICA-050-2B`. La entrada es el dict completo del starter; la operación debe demostrar anclas calibradas, order bias bajo y holdout intacto. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S50-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `INVALIDATE_JUDGE` en E2.",
        hint: "Relaciona los campos `anchor_accuracy`, `min_anchor_accuracy`, `order_gap`, `max_order_gap`, `holdout_touched` con la regla explicada en S50-T2-B.",
        hints: [
          "Relaciona los campos `anchor_accuracy`, `min_anchor_accuracy`, `order_gap`, `max_order_gap`, `holdout_touched` con la regla explicada en S50-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva order bias bajo umbral y holdout intacto; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta holdout_touched", "fixture adverso: anclas calibradas, order bias bajo y holdout intacto", "CASO-ICA-050-2B es sintético"],
        tests: "El fixture `CASO-ICA-050-2B` satisface un predicado de dominio real; imprime `S50-T2-B PASS` y el assert booleano pasa.",
        feedback: "S50-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa INVALIDATE_JUDGE y por qué faltar holdout_touched exige SEAL_NEW_HOLDOUT.",
        starterCode: {
          language: 'python',
          title: "s50-t2-b-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-2B", **{"anchor_accuracy":0.92,"min_anchor_accuracy":0.9,"order_gap":0.02,"max_order_gap":0.05,"holdout_touched":False}}
meets_contract = record["order_gap"] > record["max_order_gap"] or record["holdout_touched"]
status = "PASS" if meets_contract else "INVALIDATE_JUDGE"
print("S50-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t2-b-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-2B", **{"anchor_accuracy":0.92,"min_anchor_accuracy":0.9,"order_gap":0.02,"max_order_gap":0.05,"holdout_touched":False}}
meets_contract = record["anchor_accuracy"] >= record["min_anchor_accuracy"] and record["order_gap"] <= record["max_order_gap"] and not record["holdout_touched"]
status = "PASS" if meets_contract else "INVALIDATE_JUDGE"
print("S50-T2-B", status)
assert meets_contract is True` ,
          output: `S50-T2-B PASS` ,
        },
      },
      {
        id: "S50-T2-B-E2",
        subtopicId: "S50-T2-B",
        kind: "independent",
        instruction: "S50-T2-B-E2 · Audita tres rutas de `calibración, order bias y conjunto retenido`: fixture válido, fixture adverso y registro sin `holdout_touched`. Entrada: dict con case_id, anchor_accuracy, min_anchor_accuracy, order_gap, max_order_gap, holdout_touched. Salidas exactas: `PASS`, `INVALIDATE_JUDGE`, `MISSING:holdout_touched`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a holdout_touched debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a holdout_touched debe ocurrir antes de esa rama.",
          "Después aplica la regla de S50-T2-B: anclas calibradas, order bias bajo y holdout intacto. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta holdout_touched", "fixture adverso: anclas calibradas, order bias bajo y holdout intacto", "CASO-ICA-050-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `holdout_touched` ausente y produce exactamente `PASS INVALIDATE_JUDGE MISSING:holdout_touched`.",
        feedback: "S50-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa INVALIDATE_JUDGE y por qué faltar holdout_touched exige SEAL_NEW_HOLDOUT.",
        starterCode: {
          language: 'python',
          title: "s50-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "anchor_accuracy", "min_anchor_accuracy", "order_gap", "max_order_gap", "holdout_touched"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["order_gap"] > record["max_order_gap"] or record["holdout_touched"] else "INVALIDATE_JUDGE"

valid = {"case_id": "CASO-ICA-050-2B", **{"anchor_accuracy":0.92,"min_anchor_accuracy":0.9,"order_gap":0.02,"max_order_gap":0.05,"holdout_touched":False}}
invalid = {"case_id": "CASO-ICA-050-2B", **{"anchor_accuracy":0.6,"min_anchor_accuracy":0.9,"order_gap":0.3,"max_order_gap":0.05,"holdout_touched":True}}
incomplete = {**valid}
incomplete.pop("holdout_touched")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "anchor_accuracy", "min_anchor_accuracy", "order_gap", "max_order_gap", "holdout_touched"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["anchor_accuracy"] >= record["min_anchor_accuracy"] and record["order_gap"] <= record["max_order_gap"] and not record["holdout_touched"] else "INVALIDATE_JUDGE"

valid = {"case_id": "CASO-ICA-050-2B", **{"anchor_accuracy":0.92,"min_anchor_accuracy":0.9,"order_gap":0.02,"max_order_gap":0.05,"holdout_touched":False}}
invalid = {"case_id": "CASO-ICA-050-2B", **{"anchor_accuracy":0.6,"min_anchor_accuracy":0.9,"order_gap":0.3,"max_order_gap":0.05,"holdout_touched":True}}
incomplete = {**valid}
incomplete.pop("holdout_touched")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS INVALIDATE_JUDGE MISSING:holdout_touched` ,
        },
      },
      {
        id: "S50-T2-B-E3",
        subtopicId: "S50-T2-B",
        kind: "transfer",
        instruction: "S50-T2-B-E3 · Recupera fallo cerrado para `calibración, order bias y conjunto retenido` con tres fixtures distintos. `CASO-ICA-050-2B` debe continuar, el adverso debe devolver `INVALIDATE_JUDGE` y la ausencia de `holdout_touched` debe devolver `SEAL_NEW_HOLDOUT`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `SEAL_NEW_HOLDOUT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `SEAL_NEW_HOLDOUT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró anclas calibradas, order bias bajo y holdout intacto; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta holdout_touched", "fixture adverso: anclas calibradas, order bias bajo y holdout intacto", "CASO-ICA-050-2B es sintético"],
        tests: "Fixtures `CASO-ICA-050-2B`, adverso y sin `holdout_touched` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S50-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa INVALIDATE_JUDGE y por qué faltar holdout_touched exige SEAL_NEW_HOLDOUT.",
        starterCode: {
          language: 'python',
          title: "s50-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "anchor_accuracy", "min_anchor_accuracy", "order_gap", "max_order_gap", "holdout_touched"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["order_gap"] > record["max_order_gap"] or record["holdout_touched"] else "INVALIDATE_JUDGE"

valid = {"case_id": "CASO-ICA-050-2B", **{"anchor_accuracy":0.92,"min_anchor_accuracy":0.9,"order_gap":0.02,"max_order_gap":0.05,"holdout_touched":False}}
invalid = {"case_id": "CASO-ICA-050-2B", **{"anchor_accuracy":0.6,"min_anchor_accuracy":0.9,"order_gap":0.3,"max_order_gap":0.05,"holdout_touched":True}}
uncertain = {**valid}
uncertain.pop("holdout_touched")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "anchor_accuracy", "min_anchor_accuracy", "order_gap", "max_order_gap", "holdout_touched"}
    missing = sorted(required - record.keys())
    if missing:
        return "SEAL_NEW_HOLDOUT"
    return "CONTINUE" if record["anchor_accuracy"] >= record["min_anchor_accuracy"] and record["order_gap"] <= record["max_order_gap"] and not record["holdout_touched"] else "INVALIDATE_JUDGE"

valid = {"case_id": "CASO-ICA-050-2B", **{"anchor_accuracy":0.92,"min_anchor_accuracy":0.9,"order_gap":0.02,"max_order_gap":0.05,"holdout_touched":False}}
invalid = {"case_id": "CASO-ICA-050-2B", **{"anchor_accuracy":0.6,"min_anchor_accuracy":0.9,"order_gap":0.3,"max_order_gap":0.05,"holdout_touched":True}}
uncertain = {**valid}
uncertain.pop("holdout_touched")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "INVALIDATE_JUDGE", "SEAL_NEW_HOLDOUT"]` ,
          output: `CONTINUE INVALIDATE_JUDGE SEAL_NEW_HOLDOUT` ,
        },
      },
      {
        id: "S50-T3-A-E1",
        subtopicId: "S50-T3-A",
        kind: "guided",
        instruction: "S50-T3-A-E1 · Verifica el contrato de `prompt injection, exfiltración y tool misuse` sobre `CASO-ICA-050-3A`. La entrada es el dict completo del starter; la operación debe demostrar injection contenida, cero exfil y tool read-only. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S50-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `BLOCK_SECURITY_P0` en E2.",
        hint: "Relaciona los campos `injection_blocked`, `exfiltration_bytes`, `tool_scope`, `tool_args_valid`, `severity` con la regla explicada en S50-T3-A.",
        hints: [
          "Relaciona los campos `injection_blocked`, `exfiltration_bytes`, `tool_scope`, `tool_args_valid`, `severity` con la regla explicada en S50-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva ataques críticos bloqueados por policy; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta severity", "fixture adverso: injection contenida, cero exfil y tool read-only", "CASO-ICA-050-3A es sintético"],
        tests: "El fixture `CASO-ICA-050-3A` satisface un predicado de dominio real; imprime `S50-T3-A PASS` y el assert booleano pasa.",
        feedback: "S50-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_SECURITY_P0 y por qué faltar severity exige PRESERVE_ATTACK_TRACE.",
        starterCode: {
          language: 'python',
          title: "s50-t3-a-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-3A", **{"injection_blocked":True,"exfiltration_bytes":0,"tool_scope":"read-only","tool_args_valid":True,"severity":"P0"}}
meets_contract = not record["injection_blocked"] or record["exfiltration_bytes"] > 0
status = "PASS" if meets_contract else "BLOCK_SECURITY_P0"
print("S50-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t3-a-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-3A", **{"injection_blocked":True,"exfiltration_bytes":0,"tool_scope":"read-only","tool_args_valid":True,"severity":"P0"}}
meets_contract = record["injection_blocked"] and record["exfiltration_bytes"] == 0 and record["tool_scope"] == "read-only" and record["tool_args_valid"] and record["severity"] == "P0"
status = "PASS" if meets_contract else "BLOCK_SECURITY_P0"
print("S50-T3-A", status)
assert meets_contract is True` ,
          output: `S50-T3-A PASS` ,
        },
      },
      {
        id: "S50-T3-A-E2",
        subtopicId: "S50-T3-A",
        kind: "independent",
        instruction: "S50-T3-A-E2 · Decide tres rutas de `prompt injection, exfiltración y tool misuse`: fixture válido, fixture adverso y registro sin `severity`. Entrada: dict con case_id, injection_blocked, exfiltration_bytes, tool_scope, tool_args_valid, severity. Salidas exactas: `PASS`, `BLOCK_SECURITY_P0`, `MISSING:severity`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a severity debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a severity debe ocurrir antes de esa rama.",
          "Después aplica la regla de S50-T3-A: injection contenida, cero exfil y tool read-only. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta severity", "fixture adverso: injection contenida, cero exfil y tool read-only", "CASO-ICA-050-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `severity` ausente y produce exactamente `PASS BLOCK_SECURITY_P0 MISSING:severity`.",
        feedback: "S50-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_SECURITY_P0 y por qué faltar severity exige PRESERVE_ATTACK_TRACE.",
        starterCode: {
          language: 'python',
          title: "s50-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "injection_blocked", "exfiltration_bytes", "tool_scope", "tool_args_valid", "severity"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["injection_blocked"] or record["exfiltration_bytes"] > 0 else "BLOCK_SECURITY_P0"

valid = {"case_id": "CASO-ICA-050-3A", **{"injection_blocked":True,"exfiltration_bytes":0,"tool_scope":"read-only","tool_args_valid":True,"severity":"P0"}}
invalid = {"case_id": "CASO-ICA-050-3A", **{"injection_blocked":False,"exfiltration_bytes":2048,"tool_scope":"admin","tool_args_valid":False,"severity":"P0"}}
incomplete = {**valid}
incomplete.pop("severity")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "injection_blocked", "exfiltration_bytes", "tool_scope", "tool_args_valid", "severity"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["injection_blocked"] and record["exfiltration_bytes"] == 0 and record["tool_scope"] == "read-only" and record["tool_args_valid"] and record["severity"] == "P0" else "BLOCK_SECURITY_P0"

valid = {"case_id": "CASO-ICA-050-3A", **{"injection_blocked":True,"exfiltration_bytes":0,"tool_scope":"read-only","tool_args_valid":True,"severity":"P0"}}
invalid = {"case_id": "CASO-ICA-050-3A", **{"injection_blocked":False,"exfiltration_bytes":2048,"tool_scope":"admin","tool_args_valid":False,"severity":"P0"}}
incomplete = {**valid}
incomplete.pop("severity")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS BLOCK_SECURITY_P0 MISSING:severity` ,
        },
      },
      {
        id: "S50-T3-A-E3",
        subtopicId: "S50-T3-A",
        kind: "transfer",
        instruction: "S50-T3-A-E3 · Contrasta fallo cerrado para `prompt injection, exfiltración y tool misuse` con tres fixtures distintos. `CASO-ICA-050-3A` debe continuar, el adverso debe devolver `BLOCK_SECURITY_P0` y la ausencia de `severity` debe devolver `PRESERVE_ATTACK_TRACE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `PRESERVE_ATTACK_TRACE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `PRESERVE_ATTACK_TRACE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró injection contenida, cero exfil y tool read-only; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta severity", "fixture adverso: injection contenida, cero exfil y tool read-only", "CASO-ICA-050-3A es sintético"],
        tests: "Fixtures `CASO-ICA-050-3A`, adverso y sin `severity` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S50-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_SECURITY_P0 y por qué faltar severity exige PRESERVE_ATTACK_TRACE.",
        starterCode: {
          language: 'python',
          title: "s50-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "injection_blocked", "exfiltration_bytes", "tool_scope", "tool_args_valid", "severity"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["injection_blocked"] or record["exfiltration_bytes"] > 0 else "BLOCK_SECURITY_P0"

valid = {"case_id": "CASO-ICA-050-3A", **{"injection_blocked":True,"exfiltration_bytes":0,"tool_scope":"read-only","tool_args_valid":True,"severity":"P0"}}
invalid = {"case_id": "CASO-ICA-050-3A", **{"injection_blocked":False,"exfiltration_bytes":2048,"tool_scope":"admin","tool_args_valid":False,"severity":"P0"}}
uncertain = {**valid}
uncertain.pop("severity")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "injection_blocked", "exfiltration_bytes", "tool_scope", "tool_args_valid", "severity"}
    missing = sorted(required - record.keys())
    if missing:
        return "PRESERVE_ATTACK_TRACE"
    return "CONTINUE" if record["injection_blocked"] and record["exfiltration_bytes"] == 0 and record["tool_scope"] == "read-only" and record["tool_args_valid"] and record["severity"] == "P0" else "BLOCK_SECURITY_P0"

valid = {"case_id": "CASO-ICA-050-3A", **{"injection_blocked":True,"exfiltration_bytes":0,"tool_scope":"read-only","tool_args_valid":True,"severity":"P0"}}
invalid = {"case_id": "CASO-ICA-050-3A", **{"injection_blocked":False,"exfiltration_bytes":2048,"tool_scope":"admin","tool_args_valid":False,"severity":"P0"}}
uncertain = {**valid}
uncertain.pop("severity")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "BLOCK_SECURITY_P0", "PRESERVE_ATTACK_TRACE"]` ,
          output: `CONTINUE BLOCK_SECURITY_P0 PRESERVE_ATTACK_TRACE` ,
        },
      },
      {
        id: "S50-T3-B-E1",
        subtopicId: "S50-T3-B",
        kind: "guided",
        instruction: "S50-T3-B-E1 · Clasifica el contrato de `indirect injection, data poisoning y least privilege` sobre `CASO-ICA-050-3B`. La entrada es el dict completo del starter; la operación debe demostrar indirect injection como datos, poisoning removido y permiso mínimo. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S50-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `QUARANTINE_POISONED_CORPUS` en E2.",
        hint: "Relaciona los campos `document_instruction_treated_as_data`, `poisoned_chunks_removed`, `tool_permissions`, `requested_permission` con la regla explicada en S50-T3-B.",
        hints: [
          "Relaciona los campos `document_instruction_treated_as_data`, `poisoned_chunks_removed`, `tool_permissions`, `requested_permission` con la regla explicada en S50-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva contenido recuperado no eleva permisos; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta requested_permission", "fixture adverso: indirect injection como datos, poisoning removido y permiso mínimo", "CASO-ICA-050-3B es sintético"],
        tests: "El fixture `CASO-ICA-050-3B` satisface un predicado de dominio real; imprime `S50-T3-B PASS` y el assert booleano pasa.",
        feedback: "S50-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa QUARANTINE_POISONED_CORPUS y por qué faltar requested_permission exige REDUCE_TOOL_PRIVILEGE.",
        starterCode: {
          language: 'python',
          title: "s50-t3-b-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-3B", **{"document_instruction_treated_as_data":True,"poisoned_chunks_removed":3,"tool_permissions":{"read"},"requested_permission":"read"}}
meets_contract = not record["document_instruction_treated_as_data"] or record["requested_permission"] not in record["tool_permissions"]
status = "PASS" if meets_contract else "QUARANTINE_POISONED_CORPUS"
print("S50-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t3-b-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-3B", **{"document_instruction_treated_as_data":True,"poisoned_chunks_removed":3,"tool_permissions":{"read"},"requested_permission":"read"}}
meets_contract = record["document_instruction_treated_as_data"] and record["poisoned_chunks_removed"] >= 1 and record["requested_permission"] in record["tool_permissions"]
status = "PASS" if meets_contract else "QUARANTINE_POISONED_CORPUS"
print("S50-T3-B", status)
assert meets_contract is True` ,
          output: `S50-T3-B PASS` ,
        },
      },
      {
        id: "S50-T3-B-E2",
        subtopicId: "S50-T3-B",
        kind: "independent",
        instruction: "S50-T3-B-E2 · Calcula tres rutas de `indirect injection, data poisoning y least privilege`: fixture válido, fixture adverso y registro sin `requested_permission`. Entrada: dict con case_id, document_instruction_treated_as_data, poisoned_chunks_removed, tool_permissions, requested_permission. Salidas exactas: `PASS`, `QUARANTINE_POISONED_CORPUS`, `MISSING:requested_permission`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a requested_permission debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a requested_permission debe ocurrir antes de esa rama.",
          "Después aplica la regla de S50-T3-B: indirect injection como datos, poisoning removido y permiso mínimo. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta requested_permission", "fixture adverso: indirect injection como datos, poisoning removido y permiso mínimo", "CASO-ICA-050-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `requested_permission` ausente y produce exactamente `PASS QUARANTINE_POISONED_CORPUS MISSING:requested_permission`.",
        feedback: "S50-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa QUARANTINE_POISONED_CORPUS y por qué faltar requested_permission exige REDUCE_TOOL_PRIVILEGE.",
        starterCode: {
          language: 'python',
          title: "s50-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "document_instruction_treated_as_data", "poisoned_chunks_removed", "tool_permissions", "requested_permission"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["document_instruction_treated_as_data"] or record["requested_permission"] not in record["tool_permissions"] else "QUARANTINE_POISONED_CORPUS"

valid = {"case_id": "CASO-ICA-050-3B", **{"document_instruction_treated_as_data":True,"poisoned_chunks_removed":3,"tool_permissions":{"read"},"requested_permission":"read"}}
invalid = {"case_id": "CASO-ICA-050-3B", **{"document_instruction_treated_as_data":False,"poisoned_chunks_removed":0,"tool_permissions":{"read"},"requested_permission":"write"}}
incomplete = {**valid}
incomplete.pop("requested_permission")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "document_instruction_treated_as_data", "poisoned_chunks_removed", "tool_permissions", "requested_permission"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["document_instruction_treated_as_data"] and record["poisoned_chunks_removed"] >= 1 and record["requested_permission"] in record["tool_permissions"] else "QUARANTINE_POISONED_CORPUS"

valid = {"case_id": "CASO-ICA-050-3B", **{"document_instruction_treated_as_data":True,"poisoned_chunks_removed":3,"tool_permissions":{"read"},"requested_permission":"read"}}
invalid = {"case_id": "CASO-ICA-050-3B", **{"document_instruction_treated_as_data":False,"poisoned_chunks_removed":0,"tool_permissions":{"read"},"requested_permission":"write"}}
incomplete = {**valid}
incomplete.pop("requested_permission")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS QUARANTINE_POISONED_CORPUS MISSING:requested_permission` ,
        },
      },
      {
        id: "S50-T3-B-E3",
        subtopicId: "S50-T3-B",
        kind: "transfer",
        instruction: "S50-T3-B-E3 · Instrumenta fallo cerrado para `indirect injection, data poisoning y least privilege` con tres fixtures distintos. `CASO-ICA-050-3B` debe continuar, el adverso debe devolver `QUARANTINE_POISONED_CORPUS` y la ausencia de `requested_permission` debe devolver `REDUCE_TOOL_PRIVILEGE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REDUCE_TOOL_PRIVILEGE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REDUCE_TOOL_PRIVILEGE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró indirect injection como datos, poisoning removido y permiso mínimo; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta requested_permission", "fixture adverso: indirect injection como datos, poisoning removido y permiso mínimo", "CASO-ICA-050-3B es sintético"],
        tests: "Fixtures `CASO-ICA-050-3B`, adverso y sin `requested_permission` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S50-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa QUARANTINE_POISONED_CORPUS y por qué faltar requested_permission exige REDUCE_TOOL_PRIVILEGE.",
        starterCode: {
          language: 'python',
          title: "s50-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "document_instruction_treated_as_data", "poisoned_chunks_removed", "tool_permissions", "requested_permission"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["document_instruction_treated_as_data"] or record["requested_permission"] not in record["tool_permissions"] else "QUARANTINE_POISONED_CORPUS"

valid = {"case_id": "CASO-ICA-050-3B", **{"document_instruction_treated_as_data":True,"poisoned_chunks_removed":3,"tool_permissions":{"read"},"requested_permission":"read"}}
invalid = {"case_id": "CASO-ICA-050-3B", **{"document_instruction_treated_as_data":False,"poisoned_chunks_removed":0,"tool_permissions":{"read"},"requested_permission":"write"}}
uncertain = {**valid}
uncertain.pop("requested_permission")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "document_instruction_treated_as_data", "poisoned_chunks_removed", "tool_permissions", "requested_permission"}
    missing = sorted(required - record.keys())
    if missing:
        return "REDUCE_TOOL_PRIVILEGE"
    return "CONTINUE" if record["document_instruction_treated_as_data"] and record["poisoned_chunks_removed"] >= 1 and record["requested_permission"] in record["tool_permissions"] else "QUARANTINE_POISONED_CORPUS"

valid = {"case_id": "CASO-ICA-050-3B", **{"document_instruction_treated_as_data":True,"poisoned_chunks_removed":3,"tool_permissions":{"read"},"requested_permission":"read"}}
invalid = {"case_id": "CASO-ICA-050-3B", **{"document_instruction_treated_as_data":False,"poisoned_chunks_removed":0,"tool_permissions":{"read"},"requested_permission":"write"}}
uncertain = {**valid}
uncertain.pop("requested_permission")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "QUARANTINE_POISONED_CORPUS", "REDUCE_TOOL_PRIVILEGE"]` ,
          output: `CONTINUE QUARANTINE_POISONED_CORPUS REDUCE_TOOL_PRIVILEGE` ,
        },
      },
      {
        id: "S50-T4-A-E1",
        subtopicId: "S50-T4-A",
        kind: "guided",
        instruction: "S50-T4-A-E1 · Audita el contrato de `hallucination y abstención` sobre `CASO-ICA-050-4A`. La entrada es el dict completo del starter; la operación debe demostrar support rate, cero claim crítica y abstención correcta. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S50-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `BLOCK_HALLUCINATION_REGRESSION` en E2.",
        hint: "Relaciona los campos `supported_claims`, `total_claims`, `min_support_rate`, `unsupported_critical`, `abstained_when_empty` con la regla explicada en S50-T4-A.",
        hints: [
          "Relaciona los campos `supported_claims`, `total_claims`, `min_support_rate`, `unsupported_critical`, `abstained_when_empty` con la regla explicada en S50-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva hallucination crítica cero en holdout; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta abstained_when_empty", "fixture adverso: support rate, cero claim crítica y abstención correcta", "CASO-ICA-050-4A es sintético"],
        tests: "El fixture `CASO-ICA-050-4A` satisface un predicado de dominio real; imprime `S50-T4-A PASS` y el assert booleano pasa.",
        feedback: "S50-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_HALLUCINATION_REGRESSION y por qué faltar abstained_when_empty exige REVIEW_ABSTENTION_SLICE.",
        starterCode: {
          language: 'python',
          title: "s50-t4-a-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-4A", **{"supported_claims":18,"total_claims":20,"min_support_rate":0.9,"unsupported_critical":0,"abstained_when_empty":True}}
meets_contract = record["unsupported_critical"] > 0 or not record["abstained_when_empty"]
status = "PASS" if meets_contract else "BLOCK_HALLUCINATION_REGRESSION"
print("S50-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t4-a-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-4A", **{"supported_claims":18,"total_claims":20,"min_support_rate":0.9,"unsupported_critical":0,"abstained_when_empty":True}}
meets_contract = record["supported_claims"] / record["total_claims"] >= record["min_support_rate"] and record["unsupported_critical"] == 0 and record["abstained_when_empty"]
status = "PASS" if meets_contract else "BLOCK_HALLUCINATION_REGRESSION"
print("S50-T4-A", status)
assert meets_contract is True` ,
          output: `S50-T4-A PASS` ,
        },
      },
      {
        id: "S50-T4-A-E2",
        subtopicId: "S50-T4-A",
        kind: "independent",
        instruction: "S50-T4-A-E2 · Compara tres rutas de `hallucination y abstención`: fixture válido, fixture adverso y registro sin `abstained_when_empty`. Entrada: dict con case_id, supported_claims, total_claims, min_support_rate, unsupported_critical, abstained_when_empty. Salidas exactas: `PASS`, `BLOCK_HALLUCINATION_REGRESSION`, `MISSING:abstained_when_empty`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a abstained_when_empty debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a abstained_when_empty debe ocurrir antes de esa rama.",
          "Después aplica la regla de S50-T4-A: support rate, cero claim crítica y abstención correcta. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta abstained_when_empty", "fixture adverso: support rate, cero claim crítica y abstención correcta", "CASO-ICA-050-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `abstained_when_empty` ausente y produce exactamente `PASS BLOCK_HALLUCINATION_REGRESSION MISSING:abstained_when_empty`.",
        feedback: "S50-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_HALLUCINATION_REGRESSION y por qué faltar abstained_when_empty exige REVIEW_ABSTENTION_SLICE.",
        starterCode: {
          language: 'python',
          title: "s50-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "supported_claims", "total_claims", "min_support_rate", "unsupported_critical", "abstained_when_empty"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["unsupported_critical"] > 0 or not record["abstained_when_empty"] else "BLOCK_HALLUCINATION_REGRESSION"

valid = {"case_id": "CASO-ICA-050-4A", **{"supported_claims":18,"total_claims":20,"min_support_rate":0.9,"unsupported_critical":0,"abstained_when_empty":True}}
invalid = {"case_id": "CASO-ICA-050-4A", **{"supported_claims":10,"total_claims":20,"min_support_rate":0.9,"unsupported_critical":2,"abstained_when_empty":False}}
incomplete = {**valid}
incomplete.pop("abstained_when_empty")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "supported_claims", "total_claims", "min_support_rate", "unsupported_critical", "abstained_when_empty"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["supported_claims"] / record["total_claims"] >= record["min_support_rate"] and record["unsupported_critical"] == 0 and record["abstained_when_empty"] else "BLOCK_HALLUCINATION_REGRESSION"

valid = {"case_id": "CASO-ICA-050-4A", **{"supported_claims":18,"total_claims":20,"min_support_rate":0.9,"unsupported_critical":0,"abstained_when_empty":True}}
invalid = {"case_id": "CASO-ICA-050-4A", **{"supported_claims":10,"total_claims":20,"min_support_rate":0.9,"unsupported_critical":2,"abstained_when_empty":False}}
incomplete = {**valid}
incomplete.pop("abstained_when_empty")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS BLOCK_HALLUCINATION_REGRESSION MISSING:abstained_when_empty` ,
        },
      },
      {
        id: "S50-T4-A-E3",
        subtopicId: "S50-T4-A",
        kind: "transfer",
        instruction: "S50-T4-A-E3 · Aísla fallo cerrado para `hallucination y abstención` con tres fixtures distintos. `CASO-ICA-050-4A` debe continuar, el adverso debe devolver `BLOCK_HALLUCINATION_REGRESSION` y la ausencia de `abstained_when_empty` debe devolver `REVIEW_ABSTENTION_SLICE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_ABSTENTION_SLICE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_ABSTENTION_SLICE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró support rate, cero claim crítica y abstención correcta; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta abstained_when_empty", "fixture adverso: support rate, cero claim crítica y abstención correcta", "CASO-ICA-050-4A es sintético"],
        tests: "Fixtures `CASO-ICA-050-4A`, adverso y sin `abstained_when_empty` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S50-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_HALLUCINATION_REGRESSION y por qué faltar abstained_when_empty exige REVIEW_ABSTENTION_SLICE.",
        starterCode: {
          language: 'python',
          title: "s50-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "supported_claims", "total_claims", "min_support_rate", "unsupported_critical", "abstained_when_empty"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["unsupported_critical"] > 0 or not record["abstained_when_empty"] else "BLOCK_HALLUCINATION_REGRESSION"

valid = {"case_id": "CASO-ICA-050-4A", **{"supported_claims":18,"total_claims":20,"min_support_rate":0.9,"unsupported_critical":0,"abstained_when_empty":True}}
invalid = {"case_id": "CASO-ICA-050-4A", **{"supported_claims":10,"total_claims":20,"min_support_rate":0.9,"unsupported_critical":2,"abstained_when_empty":False}}
uncertain = {**valid}
uncertain.pop("abstained_when_empty")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "supported_claims", "total_claims", "min_support_rate", "unsupported_critical", "abstained_when_empty"}
    missing = sorted(required - record.keys())
    if missing:
        return "REVIEW_ABSTENTION_SLICE"
    return "CONTINUE" if record["supported_claims"] / record["total_claims"] >= record["min_support_rate"] and record["unsupported_critical"] == 0 and record["abstained_when_empty"] else "BLOCK_HALLUCINATION_REGRESSION"

valid = {"case_id": "CASO-ICA-050-4A", **{"supported_claims":18,"total_claims":20,"min_support_rate":0.9,"unsupported_critical":0,"abstained_when_empty":True}}
invalid = {"case_id": "CASO-ICA-050-4A", **{"supported_claims":10,"total_claims":20,"min_support_rate":0.9,"unsupported_critical":2,"abstained_when_empty":False}}
uncertain = {**valid}
uncertain.pop("abstained_when_empty")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "BLOCK_HALLUCINATION_REGRESSION", "REVIEW_ABSTENTION_SLICE"]` ,
          output: `CONTINUE BLOCK_HALLUCINATION_REGRESSION REVIEW_ABSTENTION_SLICE` ,
        },
      },
      {
        id: "S50-T4-B-E1",
        subtopicId: "S50-T4-B",
        kind: "guided",
        instruction: "S50-T4-B-E1 · Decide el contrato de `latency/cost/caching, incident response y rollback` sobre `CASO-ICA-050-4B`. La entrada es el dict completo del starter; la operación debe demostrar latencia/costo/cache dentro de gate y rollback en RTO. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S50-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `ROLLBACK_AI_RELEASE` en E2.",
        hint: "Relaciona los campos `p95_ms`, `slo_ms`, `cost_pen`, `cost_cap_pen`, `cache_acl_safe`, `rollback_minutes`, `rto_minutes` con la regla explicada en S50-T4-B.",
        hints: [
          "Relaciona los campos `p95_ms`, `slo_ms`, `cost_pen`, `cost_cap_pen`, `cache_acl_safe`, `rollback_minutes`, `rto_minutes` con la regla explicada en S50-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva rollback dentro de RTO con evidencia; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta rto_minutes", "fixture adverso: latencia/costo/cache dentro de gate y rollback en RTO", "CASO-ICA-050-4B es sintético"],
        tests: "El fixture `CASO-ICA-050-4B` satisface un predicado de dominio real; imprime `S50-T4-B PASS` y el assert booleano pasa.",
        feedback: "S50-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_AI_RELEASE y por qué faltar rto_minutes exige ACTIVATE_INCIDENT_RESPONSE.",
        starterCode: {
          language: 'python',
          title: "s50-t4-b-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-4B", **{"p95_ms":850,"slo_ms":1000,"cost_pen":0.07,"cost_cap_pen":0.1,"cache_acl_safe":True,"rollback_minutes":8,"rto_minutes":10}}
meets_contract = record["p95_ms"] > record["slo_ms"] or not record["cache_acl_safe"] or record["rollback_minutes"] > record["rto_minutes"]
status = "PASS" if meets_contract else "ROLLBACK_AI_RELEASE"
print("S50-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t4-b-e1.py",
          code: `record = {"case_id": "CASO-ICA-050-4B", **{"p95_ms":850,"slo_ms":1000,"cost_pen":0.07,"cost_cap_pen":0.1,"cache_acl_safe":True,"rollback_minutes":8,"rto_minutes":10}}
meets_contract = record["p95_ms"] <= record["slo_ms"] and record["cost_pen"] <= record["cost_cap_pen"] and record["cache_acl_safe"] and record["rollback_minutes"] <= record["rto_minutes"]
status = "PASS" if meets_contract else "ROLLBACK_AI_RELEASE"
print("S50-T4-B", status)
assert meets_contract is True` ,
          output: `S50-T4-B PASS` ,
        },
      },
      {
        id: "S50-T4-B-E2",
        subtopicId: "S50-T4-B",
        kind: "independent",
        instruction: "S50-T4-B-E2 · Filtra tres rutas de `latency/cost/caching, incident response y rollback`: fixture válido, fixture adverso y registro sin `rto_minutes`. Entrada: dict con case_id, p95_ms, slo_ms, cost_pen, cost_cap_pen, cache_acl_safe, rollback_minutes, rto_minutes. Salidas exactas: `PASS`, `ROLLBACK_AI_RELEASE`, `MISSING:rto_minutes`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a rto_minutes debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a rto_minutes debe ocurrir antes de esa rama.",
          "Después aplica la regla de S50-T4-B: latencia/costo/cache dentro de gate y rollback en RTO. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta rto_minutes", "fixture adverso: latencia/costo/cache dentro de gate y rollback en RTO", "CASO-ICA-050-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `rto_minutes` ausente y produce exactamente `PASS ROLLBACK_AI_RELEASE MISSING:rto_minutes`.",
        feedback: "S50-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_AI_RELEASE y por qué faltar rto_minutes exige ACTIVATE_INCIDENT_RESPONSE.",
        starterCode: {
          language: 'python',
          title: "s50-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "p95_ms", "slo_ms", "cost_pen", "cost_cap_pen", "cache_acl_safe", "rollback_minutes", "rto_minutes"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["p95_ms"] > record["slo_ms"] or not record["cache_acl_safe"] or record["rollback_minutes"] > record["rto_minutes"] else "ROLLBACK_AI_RELEASE"

valid = {"case_id": "CASO-ICA-050-4B", **{"p95_ms":850,"slo_ms":1000,"cost_pen":0.07,"cost_cap_pen":0.1,"cache_acl_safe":True,"rollback_minutes":8,"rto_minutes":10}}
invalid = {"case_id": "CASO-ICA-050-4B", **{"p95_ms":2500,"slo_ms":1000,"cost_pen":0.5,"cost_cap_pen":0.1,"cache_acl_safe":False,"rollback_minutes":60,"rto_minutes":10}}
incomplete = {**valid}
incomplete.pop("rto_minutes")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "p95_ms", "slo_ms", "cost_pen", "cost_cap_pen", "cache_acl_safe", "rollback_minutes", "rto_minutes"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["p95_ms"] <= record["slo_ms"] and record["cost_pen"] <= record["cost_cap_pen"] and record["cache_acl_safe"] and record["rollback_minutes"] <= record["rto_minutes"] else "ROLLBACK_AI_RELEASE"

valid = {"case_id": "CASO-ICA-050-4B", **{"p95_ms":850,"slo_ms":1000,"cost_pen":0.07,"cost_cap_pen":0.1,"cache_acl_safe":True,"rollback_minutes":8,"rto_minutes":10}}
invalid = {"case_id": "CASO-ICA-050-4B", **{"p95_ms":2500,"slo_ms":1000,"cost_pen":0.5,"cost_cap_pen":0.1,"cache_acl_safe":False,"rollback_minutes":60,"rto_minutes":10}}
incomplete = {**valid}
incomplete.pop("rto_minutes")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS ROLLBACK_AI_RELEASE MISSING:rto_minutes` ,
        },
      },
      {
        id: "S50-T4-B-E3",
        subtopicId: "S50-T4-B",
        kind: "transfer",
        instruction: "S50-T4-B-E3 · Demuestra fallo cerrado para `latency/cost/caching, incident response y rollback` con tres fixtures distintos. `CASO-ICA-050-4B` debe continuar, el adverso debe devolver `ROLLBACK_AI_RELEASE` y la ausencia de `rto_minutes` debe devolver `ACTIVATE_INCIDENT_RESPONSE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `ACTIVATE_INCIDENT_RESPONSE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ACTIVATE_INCIDENT_RESPONSE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró latencia/costo/cache dentro de gate y rollback en RTO; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta rto_minutes", "fixture adverso: latencia/costo/cache dentro de gate y rollback en RTO", "CASO-ICA-050-4B es sintético"],
        tests: "Fixtures `CASO-ICA-050-4B`, adverso y sin `rto_minutes` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S50-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_AI_RELEASE y por qué faltar rto_minutes exige ACTIVATE_INCIDENT_RESPONSE.",
        starterCode: {
          language: 'python',
          title: "s50-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "p95_ms", "slo_ms", "cost_pen", "cost_cap_pen", "cache_acl_safe", "rollback_minutes", "rto_minutes"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["p95_ms"] > record["slo_ms"] or not record["cache_acl_safe"] or record["rollback_minutes"] > record["rto_minutes"] else "ROLLBACK_AI_RELEASE"

valid = {"case_id": "CASO-ICA-050-4B", **{"p95_ms":850,"slo_ms":1000,"cost_pen":0.07,"cost_cap_pen":0.1,"cache_acl_safe":True,"rollback_minutes":8,"rto_minutes":10}}
invalid = {"case_id": "CASO-ICA-050-4B", **{"p95_ms":2500,"slo_ms":1000,"cost_pen":0.5,"cost_cap_pen":0.1,"cache_acl_safe":False,"rollback_minutes":60,"rto_minutes":10}}
uncertain = {**valid}
uncertain.pop("rto_minutes")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s50-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "p95_ms", "slo_ms", "cost_pen", "cost_cap_pen", "cache_acl_safe", "rollback_minutes", "rto_minutes"}
    missing = sorted(required - record.keys())
    if missing:
        return "ACTIVATE_INCIDENT_RESPONSE"
    return "CONTINUE" if record["p95_ms"] <= record["slo_ms"] and record["cost_pen"] <= record["cost_cap_pen"] and record["cache_acl_safe"] and record["rollback_minutes"] <= record["rto_minutes"] else "ROLLBACK_AI_RELEASE"

valid = {"case_id": "CASO-ICA-050-4B", **{"p95_ms":850,"slo_ms":1000,"cost_pen":0.07,"cost_cap_pen":0.1,"cache_acl_safe":True,"rollback_minutes":8,"rto_minutes":10}}
invalid = {"case_id": "CASO-ICA-050-4B", **{"p95_ms":2500,"slo_ms":1000,"cost_pen":0.5,"cost_cap_pen":0.1,"cache_acl_safe":False,"rollback_minutes":60,"rto_minutes":10}}
uncertain = {**valid}
uncertain.pop("rto_minutes")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "ROLLBACK_AI_RELEASE", "ACTIVATE_INCIDENT_RESPONSE"]` ,
          output: `CONTINUE ROLLBACK_AI_RELEASE ACTIVATE_INCIDENT_RESPONSE` ,
        },
      },
    ],
  },
  youDo: {
    title: "Evals, red teaming y fiabilidad de IA",
    context: "Suite de evals, red team y rollback. Trabaja sobre un copiloto sintético de operaciones para una organización ficticia en Ica. Entrada: dataset de tareas versionado, rúbrica, baseline y candidato. Salida: resultados por severidad, trayectoria, tool calls y decisión promote/block. El gate se bloquea ante: regresión P0/P1, injection exitosa, exfiltración o grader sin calibrar bloquea release.",
    objectives: [
      "Convertir dataset de tareas versionado, rúbrica, baseline y candidato en resultados por severidad, trayectoria, tool calls y decisión promote/block.",
      "Demostrar el gate: evals retenidos y adversariales son repetibles y prueban recuperación, no solo texto final.",
      "Probar el fallo: regresión P0/P1, injection exitosa, exfiltración o grader sin calibrar bloquea release.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-ICA-050`.",
      "Incluye task dataset y rúbrica 0–3.",
      "Incluye graders deterministas/humanos/LLM calibrados.",
      "Incluye casos injection/exfil/tool misuse/poisoning.",
      "Incluye comparación baseline-candidato con SLO, costo y rollback.",
      "Automatiza un caso normal, uno de breach (`BLOCK_CANDIDATE`) y uno incierto (`HUMAN_ADJUDICATION`).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-ICA-050"
REQUIRED = ['task_dataset_y_rubrica_03', 'graders_deterministas_humanos_llm_calibrados', 'casos_injection_exfil_tool_misuse_poisoning', 'comparacion_baseline_candidato_con_slo_costo_y_rollback']
evidence = {
    "task_dataset_y_rubrica_03": False,
    "graders_deterministas_humanos_llm_calibrados": False,
    "casos_injection_exfil_tool_misuse_poisoning": False,
    "comparacion_baseline_candidato_con_slo_costo_y_rollback": False
}

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-C · quality gate de IA adversarial: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto, no cambiando asserts.",
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
        question: "¿Qué evidencia permite aprobar `task dataset y rubric` en CASO-ICA-050?",
        options: ["un print sin assert ni versión", "dataset versionado y rúbrica calibrada", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico"],
        correctIndex: 1,
        explanation: "La teoría exige dataset versionado y rúbrica calibrada; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si ocurre la condición de error de S50, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["continuar y ocultar el warning", "inventar evidencia faltante", "borrar el trace para reducir ruido", "emitir BLOCK_CANDIDATE y conservar evidencia"],
        correctIndex: 3,
        explanation: "El contrato falla cerrado con BLOCK_CANDIDATE; no convierte incertidumbre o breach en éxito.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-C · quality gate de IA adversarial`?",
        options: ["evals retenidos y adversariales son repetibles y prueban recuperación, no solo texto final", "el archivo S50 existe, aunque no pruebe el gate", "el README afirma que funciona", "se usó la herramienta más nueva"],
        correctIndex: 0,
        explanation: "El gate es conductual y medible: evals retenidos y adversariales son repetibles y prueban recuperación, no solo texto final.",
      },
      {
        question: "¿Qué tratamiento de `CASO-ICA-050` respeta el alcance del curso?",
        options: ["reemplazarlo por datos reales sin consentimiento", "subir secretos para facilitar la demo", "mantenerlo sintético, mínimo, trazable y sujeto a revisión humana", "inferir fraude o parentesco desde ER"],
        correctIndex: 2,
        explanation: "Los casos son sintéticos; ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "OpenAI Evals design guide",
        url: "https://platform.openai.com/docs/guides/evals-design",
        note: "Datasets, graders y comparación",
      },
      {
        label: "OWASP Top 10 for LLM Applications",
        url: "https://genai.owasp.org/llm-top-10/",
        note: "Amenazas de aplicaciones LLM",
      },
      {
        label: "NIST AI RMF Generative AI Profile",
        url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence",
        note: "Riesgos y controles GenAI",
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
