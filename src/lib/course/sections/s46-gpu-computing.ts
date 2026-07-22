import type { CourseSection } from '../../types'

export const section46: CourseSection = {
  id: "gpu-computing",
  index: 46,
  title: "Ingeniería de datos y orquestación de producción",
  shortTitle: "Data eng producción",
  tagline: "pipeline incremental/backfillable sin duplicar, con lineage y alertas por dato tardío o contrato roto",
  estimatedHours: 18,
  level: "Master",
  phase: 3,
  icon: "Cpu",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto, ingeniería de datos y orquestación de producción conecta decisiones técnicas con evidencia operativa. La práctica entrega tablas incrementales con lineage, freshness y métricas de dato tardío y se promueve solo cuando backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness.",
  learningOutcomes: [
    { text: "Maneja ventanas y watermarks" },
    { text: "Trata late data y exactly-once compuesto" },
    { text: "Modela DAG/assets y deps" },
    { text: "Programa backfills y recupera estado" },
    { text: "Valida contracts y freshness" },
    { text: "Registra lineage y ownership" },
    { text: "Carga incremental por particiones" },
    { text: "Opera SLO e incidentes de datos" },
  ],
  theory: [
    {
      heading: "Ruta de S46: Ingeniería de datos y orquestación de producción",
      paragraphs: [
        "Esta sección parte de S45 y usa únicamente contratos, pruebas y controles ya presentados. El caso `CASO-HYO-046` es sintético y puede ejecutarse sin credenciales ni servicios externos.",
        "Producto incremental: Pipeline production-grade incremental y recuperable. Entrada: eventos con event_time, clave estable, schema y partición. Salida: tablas incrementales con lineage, freshness y métricas de dato tardío.",
        "La secuencia mantiene liberación gradual: teoría con criterio medible, demo local, ejercicio guiado, validación independiente y transferencia con breach/uncertainty.",
      ],
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-B · pipeline incremental y backfillable: backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "ventanas, event time y watermarks",
      subtopicId: "S46-T1-A",
      paragraphs: [
        "Event time describe cuándo ocurrió el evento; ventanas agrupan y watermark declara cuánto esperar antes de considerar tardío.",
        "Contrato operativo. Entrada: eventos con event_time, clave estable, schema y partición. Salida de este subtema: fixtures en hora/desorden/tardío con resultado esperado. Error: contrato roto, watermark excedido o reejecución duplicada detiene el asset afectado. Criterio de éxito: backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness.",
        "Aplicación de `ventanas, event time y watermarks` al caso peruano sintético `CASO-HYO-046`: eventos sintéticos de atención para una entidad ficticia en Huancayo. La evidencia esperada es fixtures en hora/desorden/tardío con resultado esperado. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "windows_event_time_watermarks.py",
        code: `print("watermark", "2026-01-01T09:59:00"); print("n", 2); print("event_time", True)`,
        output: `watermark 2026-01-01T09:59:00
n 2
event_time True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S46-T1-A: fixtures en hora/desorden/tardío con resultado esperado. Si falta, responde `SIDE_OUTPUT_LATE_EVENT`; si no alcanza para decidir, `WAIT_FOR_WATERMARK`.",
      },
    },
    {
      heading: "late data y exactly-once como propiedad compuesta",
      subtopicId: "S46-T1-B",
      paragraphs: [
        "Exactly-once es composición de fuente, checkpoint, sink idempotente y clave; late data necesita política de update, side output o cuarentena.",
        "Contrato operativo. Entrada: eventos con event_time, clave estable, schema y partición. Salida de este subtema: retry y late event no duplican agregado. Error: contrato roto, watermark excedido o reejecución duplicada detiene el asset afectado. Criterio de éxito: backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness.",
        "Aplicación de `late data y exactly-once como propiedad compuesta` al caso peruano sintético `CASO-HYO-046`: eventos sintéticos de atención para una entidad ficticia en Huancayo. La evidencia esperada es retry y late event no duplican agregado. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "late_data_exactly_once.py",
        code: `print(True); print(False); print("exactly_once", "idempotent_sink+dedup")`,
        output: `True
False
exactly_once idempotent_sink+dedup`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S46-T1-B, audita retry y late event no duplican agregado. Un breach activa `REPLAY_IDEMPOTENTLY` y una ausencia activa `CHOOSE_LATE_POLICY`.",
      },
    },
    {
      heading: "DAG/assets y dependency",
      subtopicId: "S46-T2-A",
      paragraphs: [
        "Un DAG expresa precedencia; un asset graph expresa productos y dependencias. Evita dependencias implícitas por nombres o horarios coincidentes.",
        "Contrato operativo. Entrada: eventos con event_time, clave estable, schema y partición. Salida de este subtema: grafo acíclico con inputs/outputs tipados. Error: contrato roto, watermark excedido o reejecución duplicada detiene el asset afectado. Criterio de éxito: backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness.",
        "Aplicación de `DAG/assets y dependency` al caso peruano sintético `CASO-HYO-046`: eventos sintéticos de atención para una entidad ficticia en Huancayo. La evidencia esperada es grafo acíclico con inputs/outputs tipados. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "dag_assets_dependency.py",
        code: `print(sorted(["er","ingest","normalize","report"])); print("deps_er", ["normalize"]); print("asset", "er_clusters")`,
        output: `['er', 'ingest', 'normalize', 'report']
deps_er ['normalize']
asset er_clusters`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "La revisión de S46-T2-A conserva grafo acíclico con inputs/outputs tipados; no conviertas `REJECT_DAG` ni `DECLARE_ASSET_DEPENDENCY` en éxito silencioso.",
      },
    },
    {
      heading: "schedules, backfills y state recovery",
      subtopicId: "S46-T2-B",
      paragraphs: [
        "Schedules disparan, no garantizan; backfill parametriza intervalo y el estado recuperable permite reanudar desde checkpoint consistente.",
        "Contrato operativo. Entrada: eventos con event_time, clave estable, schema y partición. Salida de este subtema: backfill acotado y reanudación ensayada. Error: contrato roto, watermark excedido o reejecución duplicada detiene el asset afectado. Criterio de éxito: backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness.",
        "Aplicación de `schedules, backfills y state recovery` al caso peruano sintético `CASO-HYO-046`: eventos sintéticos de atención para una entidad ficticia en Huancayo. La evidencia esperada es backfill acotado y reanudación ensayada. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "schedules_backfills_state.py",
        code: `print({"cron":"0 * * * *","backfill":True}); print("recover", "from_checkpoint"); print("reentrant", True)`,
        output: `{'cron': '0 * * * *', 'backfill': True}
recover from_checkpoint
reentrant True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato S46-T2-B: demuestra backfill acotado y reanudación ensayada. Falla cerrada con `STOP_OVERLAPPING_BACKFILL` y deriva incertidumbre mediante `RECOVER_CHECKPOINT`.",
      },
    },
    {
      heading: "contracts y freshness",
      subtopicId: "S46-T3-A",
      paragraphs: [
        "Data contracts fijan schema, semántica y owner; freshness compara event/update time con SLO y distingue retraso de ausencia.",
        "Contrato operativo. Entrada: eventos con event_time, clave estable, schema y partición. Salida de este subtema: schema break y stale data alertan. Error: contrato roto, watermark excedido o reejecución duplicada detiene el asset afectado. Criterio de éxito: backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness.",
        "Aplicación de `contracts y freshness` al caso peruano sintético `CASO-HYO-046`: eventos sintéticos de atención para una entidad ficticia en Huancayo. La evidencia esperada es schema break y stale data alertan. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "contracts_freshness.py",
        code: `print(["case_id","status"]); print(60); print("break", "alert")`,
        output: `['case_id', 'status']
60
break alert`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Para S46-T3-A, el artefacto comprobable es schema break y stale data alertan. Sin él corresponde `QUARANTINE_DATASET` o, si faltan datos, `PAGE_DATA_OWNER`.",
      },
    },
    {
      heading: "lineage, observability y ownership",
      subtopicId: "S46-T3-B",
      paragraphs: [
        "Lineage conecta dataset con fuente/código/run; observabilidad combina volumen, calidad y tiempo y enruta al owner correcto.",
        "Contrato operativo. Entrada: eventos con event_time, clave estable, schema y partición. Salida de este subtema: incidente reconstruible por lineage. Error: contrato roto, watermark excedido o reejecución duplicada detiene el asset afectado. Criterio de éxito: backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness.",
        "Aplicación de `lineage, observability y ownership` al caso peruano sintético `CASO-HYO-046`: eventos sintéticos de atención para una entidad ficticia en Huancayo. La evidencia esperada es incidente reconstruible por lineage. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "lineage_obs_ownership.py",
        code: `print({"report":["er","cases"]}); print({"er":"data-platform"}); print("obs", ["lag","rows"])`,
        output: `{'report': ['er', 'cases']}
{'er': 'data-platform'}
obs ['lag', 'rows']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Promoción de S46-T3-B: prueba incidente reconstruible por lineage y registra por separado `OPEN_QUALITY_INCIDENT` (breach) y `TRACE_LINEAGE` (missing).",
      },
    },
    {
      heading: "partitions e incremental loads",
      subtopicId: "S46-T4-A",
      paragraphs: [
        "Particionar por acceso y volumen evita small files; incremental carga solo cambios con clave/watermark estable y merge idempotente.",
        "Contrato operativo. Entrada: eventos con event_time, clave estable, schema y partición. Salida de este subtema: segunda ejecución cambia cero filas. Error: contrato roto, watermark excedido o reejecución duplicada detiene el asset afectado. Criterio de éxito: backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness.",
        "Aplicación de `partitions e incremental loads` al caso peruano sintético `CASO-HYO-046`: eventos sintéticos de atención para una entidad ficticia en Huancayo. La evidencia esperada es segunda ejecución cambia cero filas. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "partitions_incremental.py",
        code: `print([{"ts":3,"id":"b"}]); print("partition", "date"); print("no_dup_rerun", True)`,
        output: `[{'ts': 3, 'id': 'b'}]
partition date
no_dup_rerun True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "El dueño de S46-T4-A acepta solo segunda ejecución cambia cero filas; una violación produce `REBUILD_PARTITION` y un registro incompleto produce `REVIEW_INCREMENTAL_KEY`.",
      },
    },
    {
      heading: "SLO, incidentes y data recovery",
      subtopicId: "S46-T4-B",
      paragraphs: [
        "Un data SLO tiene indicador/objetivo/ventana; incidente protege consumidores, recupera datos y documenta causa y prevención.",
        "Contrato operativo. Entrada: eventos con event_time, clave estable, schema y partición. Salida de este subtema: simulacro cumple RTO y postmortem tiene acciones. Error: contrato roto, watermark excedido o reejecución duplicada detiene el asset afectado. Criterio de éxito: backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness.",
        "Aplicación de `SLO, incidentes y data recovery` al caso peruano sintético `CASO-HYO-046`: eventos sintéticos de atención para una entidad ficticia en Huancayo. La evidencia esperada es simulacro cumple RTO y postmortem tiene acciones. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
      ],
      code: {
        language: 'python',
        title: "slo_incidents_data_recovery.py",
        code: `print({"freshness_min":60,"success_rate":0.99}); print("replay_partition"); print("recovery", "replay")`,
        output: `{'freshness_min': 60, 'success_rate': 0.99}
replay_partition
recovery replay`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre de S46-T4-B: conserva simulacro cumple RTO y postmortem tiene acciones, la evidencia de `DECLARE_DATA_INCIDENT` y la ruta humana `ACTIVATE_RECOVERY_RUNBOOK`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S46 (Ingeniería de datos y orquestación de producción) alineadas a CP-N4-B (pipeline).",
    steps: [
      {
        demoId: "S46-T1-A-DEMO",
        subtopicId: "S46-T1-A",
        environment: "local-python",
        description: "Demo: ventanas, event time y watermarks",
        code: {
          language: 'python',
          title: "demo_windows_event_time_watermarks.py",
          code: `print("window", "5min"); print("wm_lag", "1min"); print("vs_processing_time", True)`,
          output: `window 5min
wm_lag 1min
vs_processing_time True`,
        },
        why: "Hace observable `ventanas, event time y watermarks` con un caso local pequeño y deja como evidencia fixtures en hora/desorden/tardío con resultado esperado; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S46-T1-B-DEMO",
        subtopicId: "S46-T1-B",
        environment: "local-python",
        description: "Demo: late data y exactly-once como propiedad compuesta",
        code: {
          language: 'python',
          title: "demo_late_data_exactly_once.py",
          code: `print("late_policy", "side_output"); print("eo", "composite"); print("dedup_key", "event_id")`,
          output: `late_policy side_output
eo composite
dedup_key event_id`,
        },
        why: "Hace observable `late data y exactly-once como propiedad compuesta` con un caso local pequeño y deja como evidencia retry y late event no duplican agregado; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S46-T2-A-DEMO",
        subtopicId: "S46-T2-A",
        environment: "local-python",
        description: "Demo: DAG/assets y dependency",
        code: {
          language: 'python',
          title: "demo_dag_assets_dependency.py",
          code: `print("nodes", 4); print("edge", "normalize->er"); print("acyclic", True)`,
          output: `nodes 4
edge normalize->er
acyclic True`,
        },
        why: "Hace observable `DAG/assets y dependency` con un caso local pequeño y deja como evidencia grafo acíclico con inputs/outputs tipados; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S46-T2-B-DEMO",
        subtopicId: "S46-T2-B",
        environment: "local-python",
        description: "Demo: schedules, backfills y state recovery",
        code: {
          language: 'python',
          title: "demo_schedules_backfills_state.py",
          code: `print("backfill_ok", True); print("state", "checkpoints"); print("schedule", "hourly")`,
          output: `backfill_ok True
state checkpoints
schedule hourly`,
        },
        why: "Hace observable `schedules, backfills y state recovery` con un caso local pequeño y deja como evidencia backfill acotado y reanudación ensayada; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S46-T3-A-DEMO",
        subtopicId: "S46-T3-A",
        environment: "local-python",
        description: "Demo: contracts y freshness",
        code: {
          language: 'python',
          title: "demo_contracts_freshness.py",
          code: `print("fresh", True); print("schema_fail", "block"); print("sla_min", 60)`,
          output: `fresh True
schema_fail block
sla_min 60`,
        },
        why: "Hace observable `contracts y freshness` con un caso local pequeño y deja como evidencia schema break y stale data alertan; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S46-T3-B-DEMO",
        subtopicId: "S46-T3-B",
        environment: "local-python",
        description: "Demo: lineage, observability y ownership",
        code: {
          language: 'python',
          title: "demo_lineage_obs_ownership.py",
          code: `print("owner", "data-platform"); print("upstream", ["er","cases"]); print("page", True)`,
          output: `owner data-platform
upstream ['er', 'cases']
page True`,
        },
        why: "Hace observable `lineage, observability y ownership` con un caso local pequeño y deja como evidencia incidente reconstruible por lineage; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S46-T4-A-DEMO",
        subtopicId: "S46-T4-A",
        environment: "local-python",
        description: "Demo: partitions e incremental loads",
        code: {
          language: 'python',
          title: "demo_partitions_incremental.py",
          code: `print("merge_key", "id"); print("load", "incremental"); print("full_refresh", "rare")`,
          output: `merge_key id
load incremental
full_refresh rare`,
        },
        why: "Hace observable `partitions e incremental loads` con un caso local pequeño y deja como evidencia segunda ejecución cambia cero filas; el demo modela el contrato, no un servicio externo.",
      },
      {
        demoId: "S46-T4-B-DEMO",
        subtopicId: "S46-T4-B",
        environment: "local-python",
        description: "Demo: SLO, incidentes y data recovery",
        code: {
          language: 'python',
          title: "demo_slo_incidents_data_recovery.py",
          code: `print("slo_breach", False); print("incident", "page_owner"); print("data_recovery", True)`,
          output: `slo_breach False
incident page_owner
data_recovery True`,
        },
        why: "Hace observable `SLO, incidentes y data recovery` con un caso local pequeño y deja como evidencia simulacro cumple RTO y postmortem tiene acciones; el demo modela el contrato, no un servicio externo.",
      },
    ],
  },
  weDo: {
    intro: "S46 · Laboratorio Pipeline production-grade incremental y recuperable: 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed con ocho fixtures peruanos sintéticos distintos.",
    steps: [
      {
        id: "S46-T1-A-E1",
        subtopicId: "S46-T1-A",
        kind: "guided",
        instruction: "S46-T1-A-E1 · Calcula el contrato de `ventanas, event time y watermarks` sobre `CASO-HYO-046-1A`. La entrada es el dict completo del starter; la operación debe demostrar event_time dentro de ventana y lateness permitido. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S46-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `SIDE_OUTPUT_LATE_EVENT` en E2.",
        hint: "Relaciona los campos `event_time`, `window_end`, `watermark`, `allowed_lateness` con la regla explicada en S46-T1-A.",
        hints: [
          "Relaciona los campos `event_time`, `window_end`, `watermark`, `allowed_lateness` con la regla explicada en S46-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva fixtures en hora/desorden/tardío con resultado esperado; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta allowed_lateness", "fixture adverso: event_time dentro de ventana y lateness permitido", "CASO-HYO-046-1A es sintético"],
        tests: "El fixture `CASO-HYO-046-1A` satisface un predicado de dominio real; imprime `S46-T1-A PASS` y el assert booleano pasa.",
        feedback: "S46-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa SIDE_OUTPUT_LATE_EVENT y por qué faltar allowed_lateness exige WAIT_FOR_WATERMARK.",
        starterCode: {
          language: 'python',
          title: "s46-t1-a-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-1A", **{"event_time":110,"window_end":120,"watermark":115,"allowed_lateness":10}}
meets_contract = record["event_time"] > record["window_end"] or record["event_time"] < record["watermark"] - record["allowed_lateness"]
status = "PASS" if meets_contract else "SIDE_OUTPUT_LATE_EVENT"
print("S46-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t1-a-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-1A", **{"event_time":110,"window_end":120,"watermark":115,"allowed_lateness":10}}
meets_contract = record["event_time"] <= record["window_end"] and record["event_time"] >= record["watermark"] - record["allowed_lateness"]
status = "PASS" if meets_contract else "SIDE_OUTPUT_LATE_EVENT"
print("S46-T1-A", status)
assert meets_contract is True` ,
          output: `S46-T1-A PASS` ,
        },
      },
      {
        id: "S46-T1-A-E2",
        subtopicId: "S46-T1-A",
        kind: "independent",
        instruction: "S46-T1-A-E2 · Modela tres rutas de `ventanas, event time y watermarks`: fixture válido, fixture adverso y registro sin `allowed_lateness`. Entrada: dict con case_id, event_time, window_end, watermark, allowed_lateness. Salidas exactas: `PASS`, `SIDE_OUTPUT_LATE_EVENT`, `MISSING:allowed_lateness`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a allowed_lateness debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a allowed_lateness debe ocurrir antes de esa rama.",
          "Después aplica la regla de S46-T1-A: event_time dentro de ventana y lateness permitido. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta allowed_lateness", "fixture adverso: event_time dentro de ventana y lateness permitido", "CASO-HYO-046-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `allowed_lateness` ausente y produce exactamente `PASS SIDE_OUTPUT_LATE_EVENT MISSING:allowed_lateness`.",
        feedback: "S46-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa SIDE_OUTPUT_LATE_EVENT y por qué faltar allowed_lateness exige WAIT_FOR_WATERMARK.",
        starterCode: {
          language: 'python',
          title: "s46-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "event_time", "window_end", "watermark", "allowed_lateness"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["event_time"] > record["window_end"] or record["event_time"] < record["watermark"] - record["allowed_lateness"] else "SIDE_OUTPUT_LATE_EVENT"

valid = {"case_id": "CASO-HYO-046-1A", **{"event_time":110,"window_end":120,"watermark":115,"allowed_lateness":10}}
invalid = {"case_id": "CASO-HYO-046-1A", **{"event_time":80,"window_end":120,"watermark":115,"allowed_lateness":10}}
incomplete = {**valid}
incomplete.pop("allowed_lateness")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "event_time", "window_end", "watermark", "allowed_lateness"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["event_time"] <= record["window_end"] and record["event_time"] >= record["watermark"] - record["allowed_lateness"] else "SIDE_OUTPUT_LATE_EVENT"

valid = {"case_id": "CASO-HYO-046-1A", **{"event_time":110,"window_end":120,"watermark":115,"allowed_lateness":10}}
invalid = {"case_id": "CASO-HYO-046-1A", **{"event_time":80,"window_end":120,"watermark":115,"allowed_lateness":10}}
incomplete = {**valid}
incomplete.pop("allowed_lateness")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS SIDE_OUTPUT_LATE_EVENT MISSING:allowed_lateness` ,
        },
      },
      {
        id: "S46-T1-A-E3",
        subtopicId: "S46-T1-A",
        kind: "transfer",
        instruction: "S46-T1-A-E3 · Simula fallo cerrado para `ventanas, event time y watermarks` con tres fixtures distintos. `CASO-HYO-046-1A` debe continuar, el adverso debe devolver `SIDE_OUTPUT_LATE_EVENT` y la ausencia de `allowed_lateness` debe devolver `WAIT_FOR_WATERMARK`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `WAIT_FOR_WATERMARK` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `WAIT_FOR_WATERMARK` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró event_time dentro de ventana y lateness permitido; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta allowed_lateness", "fixture adverso: event_time dentro de ventana y lateness permitido", "CASO-HYO-046-1A es sintético"],
        tests: "Fixtures `CASO-HYO-046-1A`, adverso y sin `allowed_lateness` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S46-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa SIDE_OUTPUT_LATE_EVENT y por qué faltar allowed_lateness exige WAIT_FOR_WATERMARK.",
        starterCode: {
          language: 'python',
          title: "s46-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "event_time", "window_end", "watermark", "allowed_lateness"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["event_time"] > record["window_end"] or record["event_time"] < record["watermark"] - record["allowed_lateness"] else "SIDE_OUTPUT_LATE_EVENT"

valid = {"case_id": "CASO-HYO-046-1A", **{"event_time":110,"window_end":120,"watermark":115,"allowed_lateness":10}}
invalid = {"case_id": "CASO-HYO-046-1A", **{"event_time":80,"window_end":120,"watermark":115,"allowed_lateness":10}}
uncertain = {**valid}
uncertain.pop("allowed_lateness")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "event_time", "window_end", "watermark", "allowed_lateness"}
    missing = sorted(required - record.keys())
    if missing:
        return "WAIT_FOR_WATERMARK"
    return "CONTINUE" if record["event_time"] <= record["window_end"] and record["event_time"] >= record["watermark"] - record["allowed_lateness"] else "SIDE_OUTPUT_LATE_EVENT"

valid = {"case_id": "CASO-HYO-046-1A", **{"event_time":110,"window_end":120,"watermark":115,"allowed_lateness":10}}
invalid = {"case_id": "CASO-HYO-046-1A", **{"event_time":80,"window_end":120,"watermark":115,"allowed_lateness":10}}
uncertain = {**valid}
uncertain.pop("allowed_lateness")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "SIDE_OUTPUT_LATE_EVENT", "WAIT_FOR_WATERMARK"]` ,
          output: `CONTINUE SIDE_OUTPUT_LATE_EVENT WAIT_FOR_WATERMARK` ,
        },
      },
      {
        id: "S46-T1-B-E1",
        subtopicId: "S46-T1-B",
        kind: "guided",
        instruction: "S46-T1-B-E1 · Compara el contrato de `late data y exactly-once como propiedad compuesta` sobre `CASO-HYO-046-1B`. La entrada es el dict completo del starter; la operación debe demostrar dedup sink, checkpoint y política de dato tardío. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S46-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `REPLAY_IDEMPOTENTLY` en E2.",
        hint: "Relaciona los campos `event_ids`, `sink_ids`, `checkpoint`, `late_policy` con la regla explicada en S46-T1-B.",
        hints: [
          "Relaciona los campos `event_ids`, `sink_ids`, `checkpoint`, `late_policy` con la regla explicada en S46-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva retry y late event no duplican agregado; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta late_policy", "fixture adverso: dedup sink, checkpoint y política de dato tardío", "CASO-HYO-046-1B es sintético"],
        tests: "El fixture `CASO-HYO-046-1B` satisface un predicado de dominio real; imprime `S46-T1-B PASS` y el assert booleano pasa.",
        feedback: "S46-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REPLAY_IDEMPOTENTLY y por qué faltar late_policy exige CHOOSE_LATE_POLICY.",
        starterCode: {
          language: 'python',
          title: "s46-t1-b-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-1B", **{"event_ids":["e1","e1","e2"],"sink_ids":{"e1","e2"},"checkpoint":2,"late_policy":"update"}}
meets_contract = len(record["event_ids"]) == len(record["sink_ids"]) or not record["late_policy"]
status = "PASS" if meets_contract else "REPLAY_IDEMPOTENTLY"
print("S46-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t1-b-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-1B", **{"event_ids":["e1","e1","e2"],"sink_ids":{"e1","e2"},"checkpoint":2,"late_policy":"update"}}
meets_contract = set(record["event_ids"]) == record["sink_ids"] and record["checkpoint"] == 2 and record["late_policy"] in {"update","side-output","quarantine"}
status = "PASS" if meets_contract else "REPLAY_IDEMPOTENTLY"
print("S46-T1-B", status)
assert meets_contract is True` ,
          output: `S46-T1-B PASS` ,
        },
      },
      {
        id: "S46-T1-B-E2",
        subtopicId: "S46-T1-B",
        kind: "independent",
        instruction: "S46-T1-B-E2 · Verifica tres rutas de `late data y exactly-once como propiedad compuesta`: fixture válido, fixture adverso y registro sin `late_policy`. Entrada: dict con case_id, event_ids, sink_ids, checkpoint, late_policy. Salidas exactas: `PASS`, `REPLAY_IDEMPOTENTLY`, `MISSING:late_policy`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a late_policy debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a late_policy debe ocurrir antes de esa rama.",
          "Después aplica la regla de S46-T1-B: dedup sink, checkpoint y política de dato tardío. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta late_policy", "fixture adverso: dedup sink, checkpoint y política de dato tardío", "CASO-HYO-046-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `late_policy` ausente y produce exactamente `PASS REPLAY_IDEMPOTENTLY MISSING:late_policy`.",
        feedback: "S46-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REPLAY_IDEMPOTENTLY y por qué faltar late_policy exige CHOOSE_LATE_POLICY.",
        starterCode: {
          language: 'python',
          title: "s46-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "event_ids", "sink_ids", "checkpoint", "late_policy"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if len(record["event_ids"]) == len(record["sink_ids"]) or not record["late_policy"] else "REPLAY_IDEMPOTENTLY"

valid = {"case_id": "CASO-HYO-046-1B", **{"event_ids":["e1","e1","e2"],"sink_ids":{"e1","e2"},"checkpoint":2,"late_policy":"update"}}
invalid = {"case_id": "CASO-HYO-046-1B", **{"event_ids":["e1","e1","e2"],"sink_ids":{"e1"},"checkpoint":0,"late_policy":""}}
incomplete = {**valid}
incomplete.pop("late_policy")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "event_ids", "sink_ids", "checkpoint", "late_policy"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if set(record["event_ids"]) == record["sink_ids"] and record["checkpoint"] == 2 and record["late_policy"] in {"update","side-output","quarantine"} else "REPLAY_IDEMPOTENTLY"

valid = {"case_id": "CASO-HYO-046-1B", **{"event_ids":["e1","e1","e2"],"sink_ids":{"e1","e2"},"checkpoint":2,"late_policy":"update"}}
invalid = {"case_id": "CASO-HYO-046-1B", **{"event_ids":["e1","e1","e2"],"sink_ids":{"e1"},"checkpoint":0,"late_policy":""}}
incomplete = {**valid}
incomplete.pop("late_policy")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REPLAY_IDEMPOTENTLY MISSING:late_policy` ,
        },
      },
      {
        id: "S46-T1-B-E3",
        subtopicId: "S46-T1-B",
        kind: "transfer",
        instruction: "S46-T1-B-E3 · Extiende fallo cerrado para `late data y exactly-once como propiedad compuesta` con tres fixtures distintos. `CASO-HYO-046-1B` debe continuar, el adverso debe devolver `REPLAY_IDEMPOTENTLY` y la ausencia de `late_policy` debe devolver `CHOOSE_LATE_POLICY`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `CHOOSE_LATE_POLICY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `CHOOSE_LATE_POLICY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró dedup sink, checkpoint y política de dato tardío; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta late_policy", "fixture adverso: dedup sink, checkpoint y política de dato tardío", "CASO-HYO-046-1B es sintético"],
        tests: "Fixtures `CASO-HYO-046-1B`, adverso y sin `late_policy` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S46-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REPLAY_IDEMPOTENTLY y por qué faltar late_policy exige CHOOSE_LATE_POLICY.",
        starterCode: {
          language: 'python',
          title: "s46-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "event_ids", "sink_ids", "checkpoint", "late_policy"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if len(record["event_ids"]) == len(record["sink_ids"]) or not record["late_policy"] else "REPLAY_IDEMPOTENTLY"

valid = {"case_id": "CASO-HYO-046-1B", **{"event_ids":["e1","e1","e2"],"sink_ids":{"e1","e2"},"checkpoint":2,"late_policy":"update"}}
invalid = {"case_id": "CASO-HYO-046-1B", **{"event_ids":["e1","e1","e2"],"sink_ids":{"e1"},"checkpoint":0,"late_policy":""}}
uncertain = {**valid}
uncertain.pop("late_policy")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "event_ids", "sink_ids", "checkpoint", "late_policy"}
    missing = sorted(required - record.keys())
    if missing:
        return "CHOOSE_LATE_POLICY"
    return "CONTINUE" if set(record["event_ids"]) == record["sink_ids"] and record["checkpoint"] == 2 and record["late_policy"] in {"update","side-output","quarantine"} else "REPLAY_IDEMPOTENTLY"

valid = {"case_id": "CASO-HYO-046-1B", **{"event_ids":["e1","e1","e2"],"sink_ids":{"e1","e2"},"checkpoint":2,"late_policy":"update"}}
invalid = {"case_id": "CASO-HYO-046-1B", **{"event_ids":["e1","e1","e2"],"sink_ids":{"e1"},"checkpoint":0,"late_policy":""}}
uncertain = {**valid}
uncertain.pop("late_policy")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REPLAY_IDEMPOTENTLY", "CHOOSE_LATE_POLICY"]` ,
          output: `CONTINUE REPLAY_IDEMPOTENTLY CHOOSE_LATE_POLICY` ,
        },
      },
      {
        id: "S46-T2-A-E1",
        subtopicId: "S46-T2-A",
        kind: "guided",
        instruction: "S46-T2-A-E1 · Filtra el contrato de `DAG/assets y dependency` sobre `CASO-HYO-046-2A`. La entrada es el dict completo del starter; la operación debe demostrar grafo sin self-loop y todos los nodos declarados. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S46-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_DAG` en E2.",
        hint: "Relaciona los campos `nodes`, `edges`, `typed_io` con la regla explicada en S46-T2-A.",
        hints: [
          "Relaciona los campos `nodes`, `edges`, `typed_io` con la regla explicada en S46-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva grafo acíclico con inputs/outputs tipados; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta typed_io", "fixture adverso: grafo sin self-loop y todos los nodos declarados", "CASO-HYO-046-2A es sintético"],
        tests: "El fixture `CASO-HYO-046-2A` satisface un predicado de dominio real; imprime `S46-T2-A PASS` y el assert booleano pasa.",
        feedback: "S46-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_DAG y por qué faltar typed_io exige DECLARE_ASSET_DEPENDENCY.",
        starterCode: {
          language: 'python',
          title: "s46-t2-a-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-2A", **{"nodes":{"raw","clean","report"},"edges":{("raw","clean"),("clean","report")},"typed_io":True}}
meets_contract = not record["typed_io"] or any(a == b for a,b in record["edges"])
status = "PASS" if meets_contract else "REJECT_DAG"
print("S46-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t2-a-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-2A", **{"nodes":{"raw","clean","report"},"edges":{("raw","clean"),("clean","report")},"typed_io":True}}
meets_contract = record["typed_io"] and all(a != b for a,b in record["edges"]) and {x for edge in record["edges"] for x in edge} <= record["nodes"]
status = "PASS" if meets_contract else "REJECT_DAG"
print("S46-T2-A", status)
assert meets_contract is True` ,
          output: `S46-T2-A PASS` ,
        },
      },
      {
        id: "S46-T2-A-E2",
        subtopicId: "S46-T2-A",
        kind: "independent",
        instruction: "S46-T2-A-E2 · Clasifica tres rutas de `DAG/assets y dependency`: fixture válido, fixture adverso y registro sin `typed_io`. Entrada: dict con case_id, nodes, edges, typed_io. Salidas exactas: `PASS`, `REJECT_DAG`, `MISSING:typed_io`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a typed_io debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a typed_io debe ocurrir antes de esa rama.",
          "Después aplica la regla de S46-T2-A: grafo sin self-loop y todos los nodos declarados. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta typed_io", "fixture adverso: grafo sin self-loop y todos los nodos declarados", "CASO-HYO-046-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `typed_io` ausente y produce exactamente `PASS REJECT_DAG MISSING:typed_io`.",
        feedback: "S46-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_DAG y por qué faltar typed_io exige DECLARE_ASSET_DEPENDENCY.",
        starterCode: {
          language: 'python',
          title: "s46-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "nodes", "edges", "typed_io"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["typed_io"] or any(a == b for a,b in record["edges"]) else "REJECT_DAG"

valid = {"case_id": "CASO-HYO-046-2A", **{"nodes":{"raw","clean","report"},"edges":{("raw","clean"),("clean","report")},"typed_io":True}}
invalid = {"case_id": "CASO-HYO-046-2A", **{"nodes":{"raw","clean"},"edges":{("raw","raw"),("clean","report")},"typed_io":False}}
incomplete = {**valid}
incomplete.pop("typed_io")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "nodes", "edges", "typed_io"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["typed_io"] and all(a != b for a,b in record["edges"]) and {x for edge in record["edges"] for x in edge} <= record["nodes"] else "REJECT_DAG"

valid = {"case_id": "CASO-HYO-046-2A", **{"nodes":{"raw","clean","report"},"edges":{("raw","clean"),("clean","report")},"typed_io":True}}
invalid = {"case_id": "CASO-HYO-046-2A", **{"nodes":{"raw","clean"},"edges":{("raw","raw"),("clean","report")},"typed_io":False}}
incomplete = {**valid}
incomplete.pop("typed_io")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_DAG MISSING:typed_io` ,
        },
      },
      {
        id: "S46-T2-A-E3",
        subtopicId: "S46-T2-A",
        kind: "transfer",
        instruction: "S46-T2-A-E3 · Defiende fallo cerrado para `DAG/assets y dependency` con tres fixtures distintos. `CASO-HYO-046-2A` debe continuar, el adverso debe devolver `REJECT_DAG` y la ausencia de `typed_io` debe devolver `DECLARE_ASSET_DEPENDENCY`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `DECLARE_ASSET_DEPENDENCY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `DECLARE_ASSET_DEPENDENCY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró grafo sin self-loop y todos los nodos declarados; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta typed_io", "fixture adverso: grafo sin self-loop y todos los nodos declarados", "CASO-HYO-046-2A es sintético"],
        tests: "Fixtures `CASO-HYO-046-2A`, adverso y sin `typed_io` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S46-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_DAG y por qué faltar typed_io exige DECLARE_ASSET_DEPENDENCY.",
        starterCode: {
          language: 'python',
          title: "s46-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "nodes", "edges", "typed_io"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["typed_io"] or any(a == b for a,b in record["edges"]) else "REJECT_DAG"

valid = {"case_id": "CASO-HYO-046-2A", **{"nodes":{"raw","clean","report"},"edges":{("raw","clean"),("clean","report")},"typed_io":True}}
invalid = {"case_id": "CASO-HYO-046-2A", **{"nodes":{"raw","clean"},"edges":{("raw","raw"),("clean","report")},"typed_io":False}}
uncertain = {**valid}
uncertain.pop("typed_io")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "nodes", "edges", "typed_io"}
    missing = sorted(required - record.keys())
    if missing:
        return "DECLARE_ASSET_DEPENDENCY"
    return "CONTINUE" if record["typed_io"] and all(a != b for a,b in record["edges"]) and {x for edge in record["edges"] for x in edge} <= record["nodes"] else "REJECT_DAG"

valid = {"case_id": "CASO-HYO-046-2A", **{"nodes":{"raw","clean","report"},"edges":{("raw","clean"),("clean","report")},"typed_io":True}}
invalid = {"case_id": "CASO-HYO-046-2A", **{"nodes":{"raw","clean"},"edges":{("raw","raw"),("clean","report")},"typed_io":False}}
uncertain = {**valid}
uncertain.pop("typed_io")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_DAG", "DECLARE_ASSET_DEPENDENCY"]` ,
          output: `CONTINUE REJECT_DAG DECLARE_ASSET_DEPENDENCY` ,
        },
      },
      {
        id: "S46-T2-B-E1",
        subtopicId: "S46-T2-B",
        kind: "guided",
        instruction: "S46-T2-B-E1 · Modela el contrato de `schedules, backfills y state recovery` sobre `CASO-HYO-046-2B`. La entrada es el dict completo del starter; la operación debe demostrar intervalos sin solape y reanudación desde checkpoint. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S46-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `STOP_OVERLAPPING_BACKFILL` en E2.",
        hint: "Relaciona los campos `intervals`, `overlap`, `checkpoint`, `resume_from` con la regla explicada en S46-T2-B.",
        hints: [
          "Relaciona los campos `intervals`, `overlap`, `checkpoint`, `resume_from` con la regla explicada en S46-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva backfill acotado y reanudación ensayada; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta resume_from", "fixture adverso: intervalos sin solape y reanudación desde checkpoint", "CASO-HYO-046-2B es sintético"],
        tests: "El fixture `CASO-HYO-046-2B` satisface un predicado de dominio real; imprime `S46-T2-B PASS` y el assert booleano pasa.",
        feedback: "S46-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa STOP_OVERLAPPING_BACKFILL y por qué faltar resume_from exige RECOVER_CHECKPOINT.",
        starterCode: {
          language: 'python',
          title: "s46-t2-b-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-2B", **{"intervals":[[1,3],[4,6]],"overlap":False,"checkpoint":"2026-07-01","resume_from":"2026-07-01"}}
meets_contract = record["overlap"] or record["checkpoint"] != record["resume_from"]
status = "PASS" if meets_contract else "STOP_OVERLAPPING_BACKFILL"
print("S46-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t2-b-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-2B", **{"intervals":[[1,3],[4,6]],"overlap":False,"checkpoint":"2026-07-01","resume_from":"2026-07-01"}}
meets_contract = not record["overlap"] and record["checkpoint"] == record["resume_from"] and record["intervals"][0][1] < record["intervals"][1][0]
status = "PASS" if meets_contract else "STOP_OVERLAPPING_BACKFILL"
print("S46-T2-B", status)
assert meets_contract is True` ,
          output: `S46-T2-B PASS` ,
        },
      },
      {
        id: "S46-T2-B-E2",
        subtopicId: "S46-T2-B",
        kind: "independent",
        instruction: "S46-T2-B-E2 · Audita tres rutas de `schedules, backfills y state recovery`: fixture válido, fixture adverso y registro sin `resume_from`. Entrada: dict con case_id, intervals, overlap, checkpoint, resume_from. Salidas exactas: `PASS`, `STOP_OVERLAPPING_BACKFILL`, `MISSING:resume_from`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a resume_from debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a resume_from debe ocurrir antes de esa rama.",
          "Después aplica la regla de S46-T2-B: intervalos sin solape y reanudación desde checkpoint. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta resume_from", "fixture adverso: intervalos sin solape y reanudación desde checkpoint", "CASO-HYO-046-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `resume_from` ausente y produce exactamente `PASS STOP_OVERLAPPING_BACKFILL MISSING:resume_from`.",
        feedback: "S46-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa STOP_OVERLAPPING_BACKFILL y por qué faltar resume_from exige RECOVER_CHECKPOINT.",
        starterCode: {
          language: 'python',
          title: "s46-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "intervals", "overlap", "checkpoint", "resume_from"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["overlap"] or record["checkpoint"] != record["resume_from"] else "STOP_OVERLAPPING_BACKFILL"

valid = {"case_id": "CASO-HYO-046-2B", **{"intervals":[[1,3],[4,6]],"overlap":False,"checkpoint":"2026-07-01","resume_from":"2026-07-01"}}
invalid = {"case_id": "CASO-HYO-046-2B", **{"intervals":[[1,4],[3,6]],"overlap":True,"checkpoint":"2026-07-01","resume_from":"start"}}
incomplete = {**valid}
incomplete.pop("resume_from")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "intervals", "overlap", "checkpoint", "resume_from"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["overlap"] and record["checkpoint"] == record["resume_from"] and record["intervals"][0][1] < record["intervals"][1][0] else "STOP_OVERLAPPING_BACKFILL"

valid = {"case_id": "CASO-HYO-046-2B", **{"intervals":[[1,3],[4,6]],"overlap":False,"checkpoint":"2026-07-01","resume_from":"2026-07-01"}}
invalid = {"case_id": "CASO-HYO-046-2B", **{"intervals":[[1,4],[3,6]],"overlap":True,"checkpoint":"2026-07-01","resume_from":"start"}}
incomplete = {**valid}
incomplete.pop("resume_from")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS STOP_OVERLAPPING_BACKFILL MISSING:resume_from` ,
        },
      },
      {
        id: "S46-T2-B-E3",
        subtopicId: "S46-T2-B",
        kind: "transfer",
        instruction: "S46-T2-B-E3 · Recupera fallo cerrado para `schedules, backfills y state recovery` con tres fixtures distintos. `CASO-HYO-046-2B` debe continuar, el adverso debe devolver `STOP_OVERLAPPING_BACKFILL` y la ausencia de `resume_from` debe devolver `RECOVER_CHECKPOINT`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `RECOVER_CHECKPOINT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `RECOVER_CHECKPOINT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró intervalos sin solape y reanudación desde checkpoint; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta resume_from", "fixture adverso: intervalos sin solape y reanudación desde checkpoint", "CASO-HYO-046-2B es sintético"],
        tests: "Fixtures `CASO-HYO-046-2B`, adverso y sin `resume_from` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S46-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa STOP_OVERLAPPING_BACKFILL y por qué faltar resume_from exige RECOVER_CHECKPOINT.",
        starterCode: {
          language: 'python',
          title: "s46-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "intervals", "overlap", "checkpoint", "resume_from"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["overlap"] or record["checkpoint"] != record["resume_from"] else "STOP_OVERLAPPING_BACKFILL"

valid = {"case_id": "CASO-HYO-046-2B", **{"intervals":[[1,3],[4,6]],"overlap":False,"checkpoint":"2026-07-01","resume_from":"2026-07-01"}}
invalid = {"case_id": "CASO-HYO-046-2B", **{"intervals":[[1,4],[3,6]],"overlap":True,"checkpoint":"2026-07-01","resume_from":"start"}}
uncertain = {**valid}
uncertain.pop("resume_from")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "intervals", "overlap", "checkpoint", "resume_from"}
    missing = sorted(required - record.keys())
    if missing:
        return "RECOVER_CHECKPOINT"
    return "CONTINUE" if not record["overlap"] and record["checkpoint"] == record["resume_from"] and record["intervals"][0][1] < record["intervals"][1][0] else "STOP_OVERLAPPING_BACKFILL"

valid = {"case_id": "CASO-HYO-046-2B", **{"intervals":[[1,3],[4,6]],"overlap":False,"checkpoint":"2026-07-01","resume_from":"2026-07-01"}}
invalid = {"case_id": "CASO-HYO-046-2B", **{"intervals":[[1,4],[3,6]],"overlap":True,"checkpoint":"2026-07-01","resume_from":"start"}}
uncertain = {**valid}
uncertain.pop("resume_from")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "STOP_OVERLAPPING_BACKFILL", "RECOVER_CHECKPOINT"]` ,
          output: `CONTINUE STOP_OVERLAPPING_BACKFILL RECOVER_CHECKPOINT` ,
        },
      },
      {
        id: "S46-T3-A-E1",
        subtopicId: "S46-T3-A",
        kind: "guided",
        instruction: "S46-T3-A-E1 · Verifica el contrato de `contracts y freshness` sobre `CASO-HYO-046-3A`. La entrada es el dict completo del starter; la operación debe demostrar schema exacto, freshness bajo SLO y owner. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S46-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `QUARANTINE_DATASET` en E2.",
        hint: "Relaciona los campos `schema`, `observed_schema`, `freshness_min`, `slo_min`, `owner` con la regla explicada en S46-T3-A.",
        hints: [
          "Relaciona los campos `schema`, `observed_schema`, `freshness_min`, `slo_min`, `owner` con la regla explicada en S46-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva schema break y stale data alertan; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta owner", "fixture adverso: schema exacto, freshness bajo SLO y owner", "CASO-HYO-046-3A es sintético"],
        tests: "El fixture `CASO-HYO-046-3A` satisface un predicado de dominio real; imprime `S46-T3-A PASS` y el assert booleano pasa.",
        feedback: "S46-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa QUARANTINE_DATASET y por qué faltar owner exige PAGE_DATA_OWNER.",
        starterCode: {
          language: 'python',
          title: "s46-t3-a-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-3A", **{"schema":{"case_id":"str","event_time":"int"},"observed_schema":{"case_id":"str","event_time":"int"},"freshness_min":8,"slo_min":15,"owner":"data-ops"}}
meets_contract = record["schema"] != record["observed_schema"] or record["freshness_min"] > record["slo_min"]
status = "PASS" if meets_contract else "QUARANTINE_DATASET"
print("S46-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t3-a-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-3A", **{"schema":{"case_id":"str","event_time":"int"},"observed_schema":{"case_id":"str","event_time":"int"},"freshness_min":8,"slo_min":15,"owner":"data-ops"}}
meets_contract = record["schema"] == record["observed_schema"] and record["freshness_min"] <= record["slo_min"] and bool(record["owner"])
status = "PASS" if meets_contract else "QUARANTINE_DATASET"
print("S46-T3-A", status)
assert meets_contract is True` ,
          output: `S46-T3-A PASS` ,
        },
      },
      {
        id: "S46-T3-A-E2",
        subtopicId: "S46-T3-A",
        kind: "independent",
        instruction: "S46-T3-A-E2 · Decide tres rutas de `contracts y freshness`: fixture válido, fixture adverso y registro sin `owner`. Entrada: dict con case_id, schema, observed_schema, freshness_min, slo_min, owner. Salidas exactas: `PASS`, `QUARANTINE_DATASET`, `MISSING:owner`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
          "Después aplica la regla de S46-T3-A: schema exacto, freshness bajo SLO y owner. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta owner", "fixture adverso: schema exacto, freshness bajo SLO y owner", "CASO-HYO-046-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `owner` ausente y produce exactamente `PASS QUARANTINE_DATASET MISSING:owner`.",
        feedback: "S46-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa QUARANTINE_DATASET y por qué faltar owner exige PAGE_DATA_OWNER.",
        starterCode: {
          language: 'python',
          title: "s46-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "schema", "observed_schema", "freshness_min", "slo_min", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["schema"] != record["observed_schema"] or record["freshness_min"] > record["slo_min"] else "QUARANTINE_DATASET"

valid = {"case_id": "CASO-HYO-046-3A", **{"schema":{"case_id":"str","event_time":"int"},"observed_schema":{"case_id":"str","event_time":"int"},"freshness_min":8,"slo_min":15,"owner":"data-ops"}}
invalid = {"case_id": "CASO-HYO-046-3A", **{"schema":{"case_id":"str","event_time":"int"},"observed_schema":{"case_id":"int"},"freshness_min":80,"slo_min":15,"owner":""}}
incomplete = {**valid}
incomplete.pop("owner")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "schema", "observed_schema", "freshness_min", "slo_min", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["schema"] == record["observed_schema"] and record["freshness_min"] <= record["slo_min"] and bool(record["owner"]) else "QUARANTINE_DATASET"

valid = {"case_id": "CASO-HYO-046-3A", **{"schema":{"case_id":"str","event_time":"int"},"observed_schema":{"case_id":"str","event_time":"int"},"freshness_min":8,"slo_min":15,"owner":"data-ops"}}
invalid = {"case_id": "CASO-HYO-046-3A", **{"schema":{"case_id":"str","event_time":"int"},"observed_schema":{"case_id":"int"},"freshness_min":80,"slo_min":15,"owner":""}}
incomplete = {**valid}
incomplete.pop("owner")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS QUARANTINE_DATASET MISSING:owner` ,
        },
      },
      {
        id: "S46-T3-A-E3",
        subtopicId: "S46-T3-A",
        kind: "transfer",
        instruction: "S46-T3-A-E3 · Contrasta fallo cerrado para `contracts y freshness` con tres fixtures distintos. `CASO-HYO-046-3A` debe continuar, el adverso debe devolver `QUARANTINE_DATASET` y la ausencia de `owner` debe devolver `PAGE_DATA_OWNER`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `PAGE_DATA_OWNER` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `PAGE_DATA_OWNER` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró schema exacto, freshness bajo SLO y owner; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta owner", "fixture adverso: schema exacto, freshness bajo SLO y owner", "CASO-HYO-046-3A es sintético"],
        tests: "Fixtures `CASO-HYO-046-3A`, adverso y sin `owner` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S46-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa QUARANTINE_DATASET y por qué faltar owner exige PAGE_DATA_OWNER.",
        starterCode: {
          language: 'python',
          title: "s46-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "schema", "observed_schema", "freshness_min", "slo_min", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["schema"] != record["observed_schema"] or record["freshness_min"] > record["slo_min"] else "QUARANTINE_DATASET"

valid = {"case_id": "CASO-HYO-046-3A", **{"schema":{"case_id":"str","event_time":"int"},"observed_schema":{"case_id":"str","event_time":"int"},"freshness_min":8,"slo_min":15,"owner":"data-ops"}}
invalid = {"case_id": "CASO-HYO-046-3A", **{"schema":{"case_id":"str","event_time":"int"},"observed_schema":{"case_id":"int"},"freshness_min":80,"slo_min":15,"owner":""}}
uncertain = {**valid}
uncertain.pop("owner")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "schema", "observed_schema", "freshness_min", "slo_min", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "PAGE_DATA_OWNER"
    return "CONTINUE" if record["schema"] == record["observed_schema"] and record["freshness_min"] <= record["slo_min"] and bool(record["owner"]) else "QUARANTINE_DATASET"

valid = {"case_id": "CASO-HYO-046-3A", **{"schema":{"case_id":"str","event_time":"int"},"observed_schema":{"case_id":"str","event_time":"int"},"freshness_min":8,"slo_min":15,"owner":"data-ops"}}
invalid = {"case_id": "CASO-HYO-046-3A", **{"schema":{"case_id":"str","event_time":"int"},"observed_schema":{"case_id":"int"},"freshness_min":80,"slo_min":15,"owner":""}}
uncertain = {**valid}
uncertain.pop("owner")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "QUARANTINE_DATASET", "PAGE_DATA_OWNER"]` ,
          output: `CONTINUE QUARANTINE_DATASET PAGE_DATA_OWNER` ,
        },
      },
      {
        id: "S46-T3-B-E1",
        subtopicId: "S46-T3-B",
        kind: "guided",
        instruction: "S46-T3-B-E1 · Clasifica el contrato de `lineage, observability y ownership` sobre `CASO-HYO-046-3B`. La entrada es el dict completo del starter; la operación debe demostrar run conecta inputs/outputs/métricas/owner. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S46-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `OPEN_QUALITY_INCIDENT` en E2.",
        hint: "Relaciona los campos `run_id`, `inputs`, `outputs`, `metrics`, `owner` con la regla explicada en S46-T3-B.",
        hints: [
          "Relaciona los campos `run_id`, `inputs`, `outputs`, `metrics`, `owner` con la regla explicada en S46-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva incidente reconstruible por lineage; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta owner", "fixture adverso: run conecta inputs/outputs/métricas/owner", "CASO-HYO-046-3B es sintético"],
        tests: "El fixture `CASO-HYO-046-3B` satisface un predicado de dominio real; imprime `S46-T3-B PASS` y el assert booleano pasa.",
        feedback: "S46-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa OPEN_QUALITY_INCIDENT y por qué faltar owner exige TRACE_LINEAGE.",
        starterCode: {
          language: 'python',
          title: "s46-t3-b-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-3B", **{"run_id":"run-hyo-46","inputs":{"raw-v2"},"outputs":{"clean-v3"},"metrics":{"rows":120,"null_rate":0.01},"owner":"analytics"}}
meets_contract = not record["inputs"] or record["metrics"]["null_rate"] > 0.02
status = "PASS" if meets_contract else "OPEN_QUALITY_INCIDENT"
print("S46-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t3-b-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-3B", **{"run_id":"run-hyo-46","inputs":{"raw-v2"},"outputs":{"clean-v3"},"metrics":{"rows":120,"null_rate":0.01},"owner":"analytics"}}
meets_contract = record["run_id"].startswith("run-") and bool(record["inputs"]) and bool(record["outputs"]) and record["metrics"]["null_rate"] <= 0.02 and bool(record["owner"])
status = "PASS" if meets_contract else "OPEN_QUALITY_INCIDENT"
print("S46-T3-B", status)
assert meets_contract is True` ,
          output: `S46-T3-B PASS` ,
        },
      },
      {
        id: "S46-T3-B-E2",
        subtopicId: "S46-T3-B",
        kind: "independent",
        instruction: "S46-T3-B-E2 · Calcula tres rutas de `lineage, observability y ownership`: fixture válido, fixture adverso y registro sin `owner`. Entrada: dict con case_id, run_id, inputs, outputs, metrics, owner. Salidas exactas: `PASS`, `OPEN_QUALITY_INCIDENT`, `MISSING:owner`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
          "Después aplica la regla de S46-T3-B: run conecta inputs/outputs/métricas/owner. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta owner", "fixture adverso: run conecta inputs/outputs/métricas/owner", "CASO-HYO-046-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `owner` ausente y produce exactamente `PASS OPEN_QUALITY_INCIDENT MISSING:owner`.",
        feedback: "S46-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa OPEN_QUALITY_INCIDENT y por qué faltar owner exige TRACE_LINEAGE.",
        starterCode: {
          language: 'python',
          title: "s46-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "run_id", "inputs", "outputs", "metrics", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["inputs"] or record["metrics"]["null_rate"] > 0.02 else "OPEN_QUALITY_INCIDENT"

valid = {"case_id": "CASO-HYO-046-3B", **{"run_id":"run-hyo-46","inputs":{"raw-v2"},"outputs":{"clean-v3"},"metrics":{"rows":120,"null_rate":0.01},"owner":"analytics"}}
invalid = {"case_id": "CASO-HYO-046-3B", **{"run_id":"","inputs":set(),"outputs":{"clean-v3"},"metrics":{"rows":120,"null_rate":0.3},"owner":""}}
incomplete = {**valid}
incomplete.pop("owner")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "run_id", "inputs", "outputs", "metrics", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["run_id"].startswith("run-") and bool(record["inputs"]) and bool(record["outputs"]) and record["metrics"]["null_rate"] <= 0.02 and bool(record["owner"]) else "OPEN_QUALITY_INCIDENT"

valid = {"case_id": "CASO-HYO-046-3B", **{"run_id":"run-hyo-46","inputs":{"raw-v2"},"outputs":{"clean-v3"},"metrics":{"rows":120,"null_rate":0.01},"owner":"analytics"}}
invalid = {"case_id": "CASO-HYO-046-3B", **{"run_id":"","inputs":set(),"outputs":{"clean-v3"},"metrics":{"rows":120,"null_rate":0.3},"owner":""}}
incomplete = {**valid}
incomplete.pop("owner")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS OPEN_QUALITY_INCIDENT MISSING:owner` ,
        },
      },
      {
        id: "S46-T3-B-E3",
        subtopicId: "S46-T3-B",
        kind: "transfer",
        instruction: "S46-T3-B-E3 · Instrumenta fallo cerrado para `lineage, observability y ownership` con tres fixtures distintos. `CASO-HYO-046-3B` debe continuar, el adverso debe devolver `OPEN_QUALITY_INCIDENT` y la ausencia de `owner` debe devolver `TRACE_LINEAGE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `TRACE_LINEAGE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `TRACE_LINEAGE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró run conecta inputs/outputs/métricas/owner; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta owner", "fixture adverso: run conecta inputs/outputs/métricas/owner", "CASO-HYO-046-3B es sintético"],
        tests: "Fixtures `CASO-HYO-046-3B`, adverso y sin `owner` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S46-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa OPEN_QUALITY_INCIDENT y por qué faltar owner exige TRACE_LINEAGE.",
        starterCode: {
          language: 'python',
          title: "s46-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "run_id", "inputs", "outputs", "metrics", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["inputs"] or record["metrics"]["null_rate"] > 0.02 else "OPEN_QUALITY_INCIDENT"

valid = {"case_id": "CASO-HYO-046-3B", **{"run_id":"run-hyo-46","inputs":{"raw-v2"},"outputs":{"clean-v3"},"metrics":{"rows":120,"null_rate":0.01},"owner":"analytics"}}
invalid = {"case_id": "CASO-HYO-046-3B", **{"run_id":"","inputs":set(),"outputs":{"clean-v3"},"metrics":{"rows":120,"null_rate":0.3},"owner":""}}
uncertain = {**valid}
uncertain.pop("owner")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "run_id", "inputs", "outputs", "metrics", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "TRACE_LINEAGE"
    return "CONTINUE" if record["run_id"].startswith("run-") and bool(record["inputs"]) and bool(record["outputs"]) and record["metrics"]["null_rate"] <= 0.02 and bool(record["owner"]) else "OPEN_QUALITY_INCIDENT"

valid = {"case_id": "CASO-HYO-046-3B", **{"run_id":"run-hyo-46","inputs":{"raw-v2"},"outputs":{"clean-v3"},"metrics":{"rows":120,"null_rate":0.01},"owner":"analytics"}}
invalid = {"case_id": "CASO-HYO-046-3B", **{"run_id":"","inputs":set(),"outputs":{"clean-v3"},"metrics":{"rows":120,"null_rate":0.3},"owner":""}}
uncertain = {**valid}
uncertain.pop("owner")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "OPEN_QUALITY_INCIDENT", "TRACE_LINEAGE"]` ,
          output: `CONTINUE OPEN_QUALITY_INCIDENT TRACE_LINEAGE` ,
        },
      },
      {
        id: "S46-T4-A-E1",
        subtopicId: "S46-T4-A",
        kind: "guided",
        instruction: "S46-T4-A-E1 · Audita el contrato de `partitions e incremental loads` sobre `CASO-HYO-046-4A`. La entrada es el dict completo del starter; la operación debe demostrar merge idempotente y small files bajo límite. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S46-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `REBUILD_PARTITION` en E2.",
        hint: "Relaciona los campos `partition`, `source_keys`, `target_keys`, `second_run_changes`, `small_files`, `max_small_files` con la regla explicada en S46-T4-A.",
        hints: [
          "Relaciona los campos `partition`, `source_keys`, `target_keys`, `second_run_changes`, `small_files`, `max_small_files` con la regla explicada en S46-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva segunda ejecución cambia cero filas; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta max_small_files", "fixture adverso: merge idempotente y small files bajo límite", "CASO-HYO-046-4A es sintético"],
        tests: "El fixture `CASO-HYO-046-4A` satisface un predicado de dominio real; imprime `S46-T4-A PASS` y el assert booleano pasa.",
        feedback: "S46-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REBUILD_PARTITION y por qué faltar max_small_files exige REVIEW_INCREMENTAL_KEY.",
        starterCode: {
          language: 'python',
          title: "s46-t4-a-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-4A", **{"partition":"2026-07-22","source_keys":{"a","b","c"},"target_keys":{"a","b","c"},"second_run_changes":0,"small_files":2,"max_small_files":5}}
meets_contract = record["source_keys"] != record["target_keys"] or record["second_run_changes"] > 0
status = "PASS" if meets_contract else "REBUILD_PARTITION"
print("S46-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t4-a-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-4A", **{"partition":"2026-07-22","source_keys":{"a","b","c"},"target_keys":{"a","b","c"},"second_run_changes":0,"small_files":2,"max_small_files":5}}
meets_contract = record["source_keys"] == record["target_keys"] and record["second_run_changes"] == 0 and record["small_files"] <= record["max_small_files"]
status = "PASS" if meets_contract else "REBUILD_PARTITION"
print("S46-T4-A", status)
assert meets_contract is True` ,
          output: `S46-T4-A PASS` ,
        },
      },
      {
        id: "S46-T4-A-E2",
        subtopicId: "S46-T4-A",
        kind: "independent",
        instruction: "S46-T4-A-E2 · Compara tres rutas de `partitions e incremental loads`: fixture válido, fixture adverso y registro sin `max_small_files`. Entrada: dict con case_id, partition, source_keys, target_keys, second_run_changes, small_files, max_small_files. Salidas exactas: `PASS`, `REBUILD_PARTITION`, `MISSING:max_small_files`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a max_small_files debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a max_small_files debe ocurrir antes de esa rama.",
          "Después aplica la regla de S46-T4-A: merge idempotente y small files bajo límite. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta max_small_files", "fixture adverso: merge idempotente y small files bajo límite", "CASO-HYO-046-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `max_small_files` ausente y produce exactamente `PASS REBUILD_PARTITION MISSING:max_small_files`.",
        feedback: "S46-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REBUILD_PARTITION y por qué faltar max_small_files exige REVIEW_INCREMENTAL_KEY.",
        starterCode: {
          language: 'python',
          title: "s46-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "partition", "source_keys", "target_keys", "second_run_changes", "small_files", "max_small_files"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["source_keys"] != record["target_keys"] or record["second_run_changes"] > 0 else "REBUILD_PARTITION"

valid = {"case_id": "CASO-HYO-046-4A", **{"partition":"2026-07-22","source_keys":{"a","b","c"},"target_keys":{"a","b","c"},"second_run_changes":0,"small_files":2,"max_small_files":5}}
invalid = {"case_id": "CASO-HYO-046-4A", **{"partition":"all","source_keys":{"a","b","c"},"target_keys":{"a","a"},"second_run_changes":3,"small_files":30,"max_small_files":5}}
incomplete = {**valid}
incomplete.pop("max_small_files")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "partition", "source_keys", "target_keys", "second_run_changes", "small_files", "max_small_files"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["source_keys"] == record["target_keys"] and record["second_run_changes"] == 0 and record["small_files"] <= record["max_small_files"] else "REBUILD_PARTITION"

valid = {"case_id": "CASO-HYO-046-4A", **{"partition":"2026-07-22","source_keys":{"a","b","c"},"target_keys":{"a","b","c"},"second_run_changes":0,"small_files":2,"max_small_files":5}}
invalid = {"case_id": "CASO-HYO-046-4A", **{"partition":"all","source_keys":{"a","b","c"},"target_keys":{"a","a"},"second_run_changes":3,"small_files":30,"max_small_files":5}}
incomplete = {**valid}
incomplete.pop("max_small_files")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REBUILD_PARTITION MISSING:max_small_files` ,
        },
      },
      {
        id: "S46-T4-A-E3",
        subtopicId: "S46-T4-A",
        kind: "transfer",
        instruction: "S46-T4-A-E3 · Aísla fallo cerrado para `partitions e incremental loads` con tres fixtures distintos. `CASO-HYO-046-4A` debe continuar, el adverso debe devolver `REBUILD_PARTITION` y la ausencia de `max_small_files` debe devolver `REVIEW_INCREMENTAL_KEY`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REVIEW_INCREMENTAL_KEY` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REVIEW_INCREMENTAL_KEY` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró merge idempotente y small files bajo límite; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta max_small_files", "fixture adverso: merge idempotente y small files bajo límite", "CASO-HYO-046-4A es sintético"],
        tests: "Fixtures `CASO-HYO-046-4A`, adverso y sin `max_small_files` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S46-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REBUILD_PARTITION y por qué faltar max_small_files exige REVIEW_INCREMENTAL_KEY.",
        starterCode: {
          language: 'python',
          title: "s46-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "partition", "source_keys", "target_keys", "second_run_changes", "small_files", "max_small_files"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["source_keys"] != record["target_keys"] or record["second_run_changes"] > 0 else "REBUILD_PARTITION"

valid = {"case_id": "CASO-HYO-046-4A", **{"partition":"2026-07-22","source_keys":{"a","b","c"},"target_keys":{"a","b","c"},"second_run_changes":0,"small_files":2,"max_small_files":5}}
invalid = {"case_id": "CASO-HYO-046-4A", **{"partition":"all","source_keys":{"a","b","c"},"target_keys":{"a","a"},"second_run_changes":3,"small_files":30,"max_small_files":5}}
uncertain = {**valid}
uncertain.pop("max_small_files")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "partition", "source_keys", "target_keys", "second_run_changes", "small_files", "max_small_files"}
    missing = sorted(required - record.keys())
    if missing:
        return "REVIEW_INCREMENTAL_KEY"
    return "CONTINUE" if record["source_keys"] == record["target_keys"] and record["second_run_changes"] == 0 and record["small_files"] <= record["max_small_files"] else "REBUILD_PARTITION"

valid = {"case_id": "CASO-HYO-046-4A", **{"partition":"2026-07-22","source_keys":{"a","b","c"},"target_keys":{"a","b","c"},"second_run_changes":0,"small_files":2,"max_small_files":5}}
invalid = {"case_id": "CASO-HYO-046-4A", **{"partition":"all","source_keys":{"a","b","c"},"target_keys":{"a","a"},"second_run_changes":3,"small_files":30,"max_small_files":5}}
uncertain = {**valid}
uncertain.pop("max_small_files")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REBUILD_PARTITION", "REVIEW_INCREMENTAL_KEY"]` ,
          output: `CONTINUE REBUILD_PARTITION REVIEW_INCREMENTAL_KEY` ,
        },
      },
      {
        id: "S46-T4-B-E1",
        subtopicId: "S46-T4-B",
        kind: "guided",
        instruction: "S46-T4-B-E1 · Decide el contrato de `SLO, incidentes y data recovery` sobre `CASO-HYO-046-4B`. La entrada es el dict completo del starter; la operación debe demostrar SLI/SLO, RTO, owner y acciones de postmortem. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S46-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `DECLARE_DATA_INCIDENT` en E2.",
        hint: "Relaciona los campos `freshness_sli`, `freshness_slo`, `rto_minutes`, `target_rto_minutes`, `postmortem_actions`, `owner` con la regla explicada en S46-T4-B.",
        hints: [
          "Relaciona los campos `freshness_sli`, `freshness_slo`, `rto_minutes`, `target_rto_minutes`, `postmortem_actions`, `owner` con la regla explicada en S46-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva simulacro cumple RTO y postmortem tiene acciones; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta owner", "fixture adverso: SLI/SLO, RTO, owner y acciones de postmortem", "CASO-HYO-046-4B es sintético"],
        tests: "El fixture `CASO-HYO-046-4B` satisface un predicado de dominio real; imprime `S46-T4-B PASS` y el assert booleano pasa.",
        feedback: "S46-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa DECLARE_DATA_INCIDENT y por qué faltar owner exige ACTIVATE_RECOVERY_RUNBOOK.",
        starterCode: {
          language: 'python',
          title: "s46-t4-b-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-4B", **{"freshness_sli":0.995,"freshness_slo":0.99,"rto_minutes":25,"target_rto_minutes":30,"postmortem_actions":3,"owner":"data-oncall"}}
meets_contract = record["freshness_sli"] < record["freshness_slo"] or record["rto_minutes"] > record["target_rto_minutes"]
status = "PASS" if meets_contract else "DECLARE_DATA_INCIDENT"
print("S46-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t4-b-e1.py",
          code: `record = {"case_id": "CASO-HYO-046-4B", **{"freshness_sli":0.995,"freshness_slo":0.99,"rto_minutes":25,"target_rto_minutes":30,"postmortem_actions":3,"owner":"data-oncall"}}
meets_contract = record["freshness_sli"] >= record["freshness_slo"] and record["rto_minutes"] <= record["target_rto_minutes"] and record["postmortem_actions"] >= 1 and bool(record["owner"])
status = "PASS" if meets_contract else "DECLARE_DATA_INCIDENT"
print("S46-T4-B", status)
assert meets_contract is True` ,
          output: `S46-T4-B PASS` ,
        },
      },
      {
        id: "S46-T4-B-E2",
        subtopicId: "S46-T4-B",
        kind: "independent",
        instruction: "S46-T4-B-E2 · Filtra tres rutas de `SLO, incidentes y data recovery`: fixture válido, fixture adverso y registro sin `owner`. Entrada: dict con case_id, freshness_sli, freshness_slo, rto_minutes, target_rto_minutes, postmortem_actions, owner. Salidas exactas: `PASS`, `DECLARE_DATA_INCIDENT`, `MISSING:owner`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a owner debe ocurrir antes de esa rama.",
          "Después aplica la regla de S46-T4-B: SLI/SLO, RTO, owner y acciones de postmortem. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta owner", "fixture adverso: SLI/SLO, RTO, owner y acciones de postmortem", "CASO-HYO-046-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `owner` ausente y produce exactamente `PASS DECLARE_DATA_INCIDENT MISSING:owner`.",
        feedback: "S46-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa DECLARE_DATA_INCIDENT y por qué faltar owner exige ACTIVATE_RECOVERY_RUNBOOK.",
        starterCode: {
          language: 'python',
          title: "s46-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "freshness_sli", "freshness_slo", "rto_minutes", "target_rto_minutes", "postmortem_actions", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["freshness_sli"] < record["freshness_slo"] or record["rto_minutes"] > record["target_rto_minutes"] else "DECLARE_DATA_INCIDENT"

valid = {"case_id": "CASO-HYO-046-4B", **{"freshness_sli":0.995,"freshness_slo":0.99,"rto_minutes":25,"target_rto_minutes":30,"postmortem_actions":3,"owner":"data-oncall"}}
invalid = {"case_id": "CASO-HYO-046-4B", **{"freshness_sli":0.8,"freshness_slo":0.99,"rto_minutes":90,"target_rto_minutes":30,"postmortem_actions":0,"owner":""}}
incomplete = {**valid}
incomplete.pop("owner")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "freshness_sli", "freshness_slo", "rto_minutes", "target_rto_minutes", "postmortem_actions", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["freshness_sli"] >= record["freshness_slo"] and record["rto_minutes"] <= record["target_rto_minutes"] and record["postmortem_actions"] >= 1 and bool(record["owner"]) else "DECLARE_DATA_INCIDENT"

valid = {"case_id": "CASO-HYO-046-4B", **{"freshness_sli":0.995,"freshness_slo":0.99,"rto_minutes":25,"target_rto_minutes":30,"postmortem_actions":3,"owner":"data-oncall"}}
invalid = {"case_id": "CASO-HYO-046-4B", **{"freshness_sli":0.8,"freshness_slo":0.99,"rto_minutes":90,"target_rto_minutes":30,"postmortem_actions":0,"owner":""}}
incomplete = {**valid}
incomplete.pop("owner")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS DECLARE_DATA_INCIDENT MISSING:owner` ,
        },
      },
      {
        id: "S46-T4-B-E3",
        subtopicId: "S46-T4-B",
        kind: "transfer",
        instruction: "S46-T4-B-E3 · Demuestra fallo cerrado para `SLO, incidentes y data recovery` con tres fixtures distintos. `CASO-HYO-046-4B` debe continuar, el adverso debe devolver `DECLARE_DATA_INCIDENT` y la ausencia de `owner` debe devolver `ACTIVATE_RECOVERY_RUNBOOK`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `ACTIVATE_RECOVERY_RUNBOOK` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `ACTIVATE_RECOVERY_RUNBOOK` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró SLI/SLO, RTO, owner y acciones de postmortem; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta owner", "fixture adverso: SLI/SLO, RTO, owner y acciones de postmortem", "CASO-HYO-046-4B es sintético"],
        tests: "Fixtures `CASO-HYO-046-4B`, adverso y sin `owner` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S46-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa DECLARE_DATA_INCIDENT y por qué faltar owner exige ACTIVATE_RECOVERY_RUNBOOK.",
        starterCode: {
          language: 'python',
          title: "s46-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "freshness_sli", "freshness_slo", "rto_minutes", "target_rto_minutes", "postmortem_actions", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["freshness_sli"] < record["freshness_slo"] or record["rto_minutes"] > record["target_rto_minutes"] else "DECLARE_DATA_INCIDENT"

valid = {"case_id": "CASO-HYO-046-4B", **{"freshness_sli":0.995,"freshness_slo":0.99,"rto_minutes":25,"target_rto_minutes":30,"postmortem_actions":3,"owner":"data-oncall"}}
invalid = {"case_id": "CASO-HYO-046-4B", **{"freshness_sli":0.8,"freshness_slo":0.99,"rto_minutes":90,"target_rto_minutes":30,"postmortem_actions":0,"owner":""}}
uncertain = {**valid}
uncertain.pop("owner")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "freshness_sli", "freshness_slo", "rto_minutes", "target_rto_minutes", "postmortem_actions", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "ACTIVATE_RECOVERY_RUNBOOK"
    return "CONTINUE" if record["freshness_sli"] >= record["freshness_slo"] and record["rto_minutes"] <= record["target_rto_minutes"] and record["postmortem_actions"] >= 1 and bool(record["owner"]) else "DECLARE_DATA_INCIDENT"

valid = {"case_id": "CASO-HYO-046-4B", **{"freshness_sli":0.995,"freshness_slo":0.99,"rto_minutes":25,"target_rto_minutes":30,"postmortem_actions":3,"owner":"data-oncall"}}
invalid = {"case_id": "CASO-HYO-046-4B", **{"freshness_sli":0.8,"freshness_slo":0.99,"rto_minutes":90,"target_rto_minutes":30,"postmortem_actions":0,"owner":""}}
uncertain = {**valid}
uncertain.pop("owner")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "DECLARE_DATA_INCIDENT", "ACTIVATE_RECOVERY_RUNBOOK"]` ,
          output: `CONTINUE DECLARE_DATA_INCIDENT ACTIVATE_RECOVERY_RUNBOOK` ,
        },
      },
    ],
  },
  youDo: {
    title: "Ingeniería de datos y orquestación de producción",
    context: "Pipeline production-grade incremental y recuperable. Trabaja sobre eventos sintéticos de atención para una entidad ficticia en Huancayo. Entrada: eventos con event_time, clave estable, schema y partición. Salida: tablas incrementales con lineage, freshness y métricas de dato tardío. El gate se bloquea ante: contrato roto, watermark excedido o reejecución duplicada detiene el asset afectado.",
    objectives: [
      "Convertir eventos con event_time, clave estable, schema y partición en tablas incrementales con lineage, freshness y métricas de dato tardío.",
      "Demostrar el gate: backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness.",
      "Probar el fallo: contrato roto, watermark excedido o reejecución duplicada detiene el asset afectado.",
      "Entregar evidencia reproducible, redactada, sin PII real, secretos ni servicios externos obligatorios.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos identificados por `CASO-HYO-046`.",
      "Incluye política event-time/watermark/late data.",
      "Incluye DAG o asset graph con backfill.",
      "Incluye contratos, lineage, freshness y ownership.",
      "Incluye prueba de idempotencia y runbook de recuperación.",
      "Automatiza un caso normal, uno de breach (`QUARANTINE_PARTITION`) y uno incierto (`OPEN_DATA_INCIDENT`).",
      "Incluye comandos locales reproducibles, dependencias fijadas y salida esperada.",
      "Registra riesgo residual, responsable, criterio de rollback y limitaciones conocidas.",
    ],
    starterCode: `CASE_ID = "CASO-HYO-046"
REQUIRED = ['politica_event_time_watermark_late_data', 'dag_o_asset_graph_con_backfill', 'contratos_lineage_freshness_y_ownership', 'prueba_de_idempotencia_y_runbook_de_recuperacion']
evidence = {
    "politica_event_time_watermark_late_data": False,
    "dag_o_asset_graph_con_backfill": False,
    "contratos_lineage_freshness_y_ownership": False,
    "prueba_de_idempotencia_y_runbook_de_recuperacion": False
}

def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
    missing = [name for name in REQUIRED if bundle.get(name) is not True]
    return ("READY", []) if not missing else ("BLOCKED", missing)

status, missing = readiness(evidence)
print(CASE_ID, status)
print("missing", ",".join(missing))
assert status in {"READY", "BLOCKED"}
`,
    portfolioNote: "Evidencia de CP-N4-B · pipeline incremental y backfillable: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto, no cambiando asserts.",
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
        question: "¿Qué evidencia permite aprobar `ventanas, event time y watermarks` en CASO-HYO-046?",
        options: ["un print sin assert ni versión", "fixtures en hora/desorden/tardío con resultado esperado", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico"],
        correctIndex: 1,
        explanation: "La teoría exige fixtures en hora/desorden/tardío con resultado esperado; evidencia decorativa o PII no satisface el contrato.",
      },
      {
        question: "Si ocurre la condición de error de S46, ¿qué respuesta preserva seguridad y auditabilidad?",
        options: ["continuar y ocultar el warning", "inventar evidencia faltante", "borrar el trace para reducir ruido", "emitir QUARANTINE_PARTITION y conservar evidencia"],
        correctIndex: 3,
        explanation: "El contrato falla cerrado con QUARANTINE_PARTITION; no convierte incertidumbre o breach en éxito.",
      },
      {
        question: "¿Cuál resultado demuestra el gate `CP-N4-B · pipeline incremental y backfillable`?",
        options: ["backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness", "el archivo S46 existe, aunque no pruebe el gate", "el README afirma que funciona", "se usó la herramienta más nueva"],
        correctIndex: 0,
        explanation: "El gate es conductual y medible: backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness.",
      },
      {
        question: "¿Qué tratamiento de `CASO-HYO-046` respeta el alcance del curso?",
        options: ["reemplazarlo por datos reales sin consentimiento", "subir secretos para facilitar la demo", "mantenerlo sintético, mínimo, trazable y sujeto a revisión humana", "inferir fraude o parentesco desde ER"],
        correctIndex: 2,
        explanation: "Los casos son sintéticos; ER solo propone correspondencia de entidad y no prueba fraude, parentesco ni riesgo.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "Apache Beam Programming Guide",
        url: "https://beam.apache.org/documentation/programming-guide/",
        note: "Event time, windows y watermarks",
      },
      {
        label: "Apache Airflow",
        url: "https://airflow.apache.org/docs/",
        note: "DAGs, scheduling y backfills",
      },
      {
        label: "OpenLineage",
        url: "https://openlineage.io/docs/",
        note: "Modelo de lineage de jobs/datasets/runs",
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
