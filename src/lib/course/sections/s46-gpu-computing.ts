import type { CourseSection } from '../../types'

export const section46: CourseSection = {
  id: "gpu-computing",
  index: 46,
  title: "Ingeniería de datos y orquestación de producción",
  shortTitle: "Data eng producción",
  tagline: "pipeline incremental/backfillable sin duplicar, con lineage y alertas por dato tardío o contrato roto",
  estimatedHours: 20,
  level: "Master",
  phase: 3,
  icon: "GitBranch",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto en LATAM, **ingeniería de datos y orquestación de producción** convierte el job asíncrono de la sección anterior (object store, colas, DLQ e idempotency keys) en pipelines batch/stream con calidad medible y SLAs de frescura. Entregas típicas: tablas y contratos versionados, orquestación con checkpoint, lineage y alertas cuando el dato llega tarde o el schema se rompe. Se promociona solo cuando backfills y re-runs no corrompen el sink ni duplican agregados. La siguiente sección (MLOps) consumirá estas tablas versionadas y el lineage como fuente confiable de features y runs.",
  learningOutcomes: [
    { text: "Clasificar eventos on-time, allowed-late, late u out-of-window dado event_time, window_end, watermark y allowed_lateness, con política documentada" },
    { text: "Componer exactly-once end-to-end: fuente at-least-once + checkpoint + sink idempotente por clave + política de late data" },
    { text: "Validar un DAG/asset graph acíclico con nodos declarados, edges tipados y sin self-loops ni ciclos A→B→A" },
    { text: "Planificar backfills por intervalo sin solape y reanudar desde checkpoint consistente" },
    { text: "Evaluar data contracts (schema + owner + freshness SLO) y fallar cerrado ante drift o retraso" },
    { text: "Registrar lineage run→inputs→outputs con owner y métricas de calidad para reconstruir incidentes" },
    { text: "Implementar carga incremental por partición con merge de claves y segunda corrida con cero cambios" },
    { text: "Operar data SLOs (SLI vs objetivo), RTO de recuperación y postmortem con acciones concretas" },
  ],
  theory: [
    {
      heading: "Ruta de S46: Ingeniería de datos y orquestación de producción",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1). **Event time:** cuándo ocurrió el hecho (no el processing time del worker). **Watermark:** aserción de progreso en event time — watermark t declara que no se esperan más eventos con timestamp ≤ t. **Late data:** llega después de que el watermark superó su timestamp (política: drop / side-output / update / quarantine). **Exactly-once (compuesto):** end-to-end con sinks idempotentes + checkpoints, no un flag mágico del broker. **DAG/asset:** grafo de dependencias sin ciclos. **Backfill:** re-run acotado de rangos históricos. **Data contract:** schema + freshness + ownership. **Lineage:** de qué run/tabla salió cada fila. **Incremental load:** particiones/keys sin full rewrite ciego.",
        "Puente S45 → S46 → S47. En S45 modelaste un **job asíncrono** con artifact store, status, retry, DLQ e idempotency keys. Aquí ese job se vuelve **pipeline de datos de producción**: el mismo event_id/idempotency key alimenta dedup del sink; la cola at-least-once obliga a sinks idempotentes; el object store aloja particiones y artefactos de lineage. En S47 (MLOps) esas tablas versionadas, el lineage y la freshness serán la base de features, experiment tracking y serving — un pipeline sin contratos no es un buen dataset de entrenamiento.",
        "Producto incremental: orquestación de producción. Entrada: eventos con event_time, schema, SLAs de frescura y keys de idempotencia. Salida: ventanas cerradas con política de late data, sink deduplicado, DAG acíclico y alertas de calidad. Error de promoción: late data silencioso, edges cíclicos, schema drift no detectado o segundo run que reescribe sin control.",
        "Orden: T1 event-time/watermarks → T2 DAG tipado y checkpoint → T3 calidad/freshness → T4 re-runs y SLI/SLO. El watermark y la late policy de T1 habilitan el merge incremental de T4 (solo filas ON_TIME/ALLOWED_LATE entran al sink); el DAG acíclico de T2 ordena qué asset se backfillea; los contratos de T3 deciden cuándo cuarentenar. Stack didáctico: **stdlib** (dicts, listas) para modelar contratos al estilo Airflow/dbt/streaming **sin cluster**. El foco es corrección de datos y operación del pipeline, no kernels de hardware. Caso `CASO-HYO-046` (Huancayo sintético): eventos de atención de una entidad ficticia; sin PII real ni servicios externos.",
      ],
      code: {
        language: 'python',
        title: "s46_map_contract.py",
        code: `def section_contract():
    return {
        "case": "CASO-HYO-046",
        "gates": [
            "idempotent_backfill",
            "freshness_slo",
            "lineage_recorded",
            "no_cyclic_dag",
        ],
        "silent_late_data_ok": False,
        "require_late_policy": True,
    }

c = section_contract()
print("case", c["case"])
print("require_late_policy", c["require_late_policy"])
print("silent_late_data_ok", c["silent_late_data_ok"])
`,
        output: `case CASO-HYO-046
require_late_policy True
silent_late_data_ok False`,
      },
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "CP-N4-B · pipeline incremental y backfillable: backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness. Si falta evidencia, no se promociona.",
      },
    },
    {
      heading: "Ventanas, event time y watermarks",
      subtopicId: "S46-T1-A",
      paragraphs: [
        "**Event time** es cuándo ocurrió el hecho en el mundo; **processing time** es el reloj del worker. Las **ventanas** agrupan por rangos de event time. El **watermark** no es solo un “atraso aceptado”: es una aserción de progreso — watermark t afirma que no se esperan más eventos con timestamp ≤ t. Un evento es **late** si se evalúa cuando el watermark ya superó su timestamp; **allowed lateness** es gracia post-watermark (completeness vs latencia).",
        "Contrato operativo de tiempo. Entrada: lista de event_time, window_end, lag del watermark y allowed_lateness. Salida: watermark = max(event_time) − lag, y etiqueta por evento ∈ {ON_TIME, ALLOWED_LATE, LATE, OUT_OF_WINDOW}. Error: materializar una ventana sin política de late data o aceptar eventos fuera de ventana. Criterio de éxito: fixtures en orden, desorden y tardío producen las mismas etiquetas al re-ejecutar; la política (side-output / drop / update) queda documentada.",
        "Aplicación a `CASO-HYO-046` (Huancayo sintético): una clínica ficticia emite eventos de atención con retraso de red. Un parte de las 09:00 puede llegar a las 09:40 de processing time; el pipeline debe decidir con event time, no con el reloj del worker. Riesgos de DE (no de ER): doble conteo si se reabre la ventana en silencio, o dashboards incompletos si se dropea late data sin side-output.",
      ],
      code: {
        language: 'python',
        title: "windows_event_time_watermarks.py",
        code: `def advance_watermark(event_times: list[int], lag: int) -> int:
    """Watermark ≈ max(event_time) - lag: aserción de progreso en event time."""
    return max(event_times) - lag

def classify(event_time: int, window_end: int, watermark: int, allowed_lateness: int) -> str:
    if event_time > window_end:
        return "OUT_OF_WINDOW"
    if event_time > watermark:
        return "ON_TIME"
    if watermark - event_time <= allowed_lateness:
        return "ALLOWED_LATE"
    return "LATE"

times = [100, 108, 115]
wm = advance_watermark(times, lag=5)  # 110
# 112 on-time; 100 too late (wm-et=10>5); 105 within grace
labels = [
    classify(t, window_end=120, watermark=wm, allowed_lateness=5)
    for t in (112, 100, 105)
]
print("watermark", wm)
print("labels", labels)`,
        output: `watermark 110
labels ['ON_TIME', 'LATE', 'ALLOWED_LATE']`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Evidencia mínima de S46-T1-A: timeline con ≥3 event_time (en hora / desorden / tardío) y etiquetas esperadas. Breach → `SIDE_OUTPUT_LATE_EVENT`; evidencia incompleta → `WAIT_FOR_WATERMARK`.",
      },
    },
    {
      heading: "Late data y exactly-once como propiedad compuesta",
      subtopicId: "S46-T1-B",
      paragraphs: [
        "**Exactly-once end-to-end no es un switch del broker.** Es una cadena: la fuente suele ser at-least-once (reintentos), el motor guarda **checkpoint** del progreso, el **sink es idempotente** por clave de negocio (`event_id`), y el late data tiene política explícita (update / side-output / quarantine). Si falta un eslabón, el “exactly-once” del marketing se convierte en doble conteo en el dashboard de Huancayo.",
        "Contrato de dedup y late policy. Entrada: stream de `event_id` (con reintentos), store de claves vistas, checkpoint y `late_policy` ∈ {update, side-output, quarantine}. Salida: primer apply → True; retry del mismo id → False; late event no inventa una segunda fila de agregado. Error: sink sin clave o late_policy vacía. Criterio: `apply_once` + política documentada antes de abrir backfills.",
        "Secuencia trabajada (CASO-HYO-046-T1B): (1) llega e1 → se escribe y se marca visto; (2) reintento de e1 → no reescribe; (3) e2 late con política update → actualiza la fila o va a side-output, nunca “mezcla silenciosa”. Exactly-once compuesto = idempotent_sink + dedup + checkpoint + late_policy, no magia del middleware.",
      ],
      code: {
        language: 'python',
        title: "late_data_exactly_once.py",
        code: `def apply_once(seen: set, event_id: str) -> bool:
    if event_id in seen:
        return False
    seen.add(event_id)
    return True

def handle_late(policy: str, event_id: str) -> str:
    if policy not in {"update", "side-output", "quarantine"}:
        return "CHOOSE_LATE_POLICY"
    return policy + ":" + event_id

seen = set()
print(apply_once(seen, "e1"))
print(apply_once(seen, "e1"))
print(handle_late("side-output", "e2"))
print("exactly_once", "idempotent_sink+dedup+checkpoint")`,
        output: `True
False
side-output:e2
exactly_once idempotent_sink+dedup+checkpoint`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Antes de promover S46-T1-B, audita que retry y late event no duplican el agregado. Breach → `REPLAY_IDEMPOTENTLY`; sin política → `CHOOSE_LATE_POLICY`.",
      },
    },
    {
      heading: "DAG, assets y dependencias",
      subtopicId: "S46-T2-A",
      paragraphs: [
        "Un **DAG** expresa precedencia de ejecución; un **asset graph** expresa productos (tablas, reportes) y de qué dependen. Evita dependencias implícitas por nombres de archivo o “corren a la misma hora”. Un grafo con ciclo no tiene orden topológico: el orquestador no puede decidir qué materializar primero.",
        "Contrato operativo de orquestación. Entrada: nodos de assets (ingest, normalize, er, report) y edges de dependencia. Salida: grafo **acíclico** con inputs/outputs tipados y dueño por asset. Error: ciclo, self-loop, edge a nodo no declarado o dependencia solo por horario coincidente. Criterio de éxito: un cambio en `normalize` invalida solo `er` y `report`; el plan de backfill lista ancestros sin solapes.",
        "Aplicación a `CASO-HYO-046`: assets sintéticos raw → clean → report de atenciones en Huancayo. Si alguien cierra clean → raw “para refrescar”, el ciclo rompe el plan de backfill. Riesgo DE: re-ejecuciones infinitas o materialización parcial sin lineage claro del asset roto.",
      ],
      code: {
        language: 'python',
        title: "dag_assets_dependency.py",
        code: `from collections import defaultdict, deque

def is_acyclic(nodes: set, edges: set) -> bool:
    if any(a not in nodes or b not in nodes for a, b in edges):
        return False
    if any(a == b for a, b in edges):
        return False
    adj = defaultdict(list)
    indeg = {n: 0 for n in nodes}
    for a, b in edges:
        adj[a].append(b)
        indeg[b] += 1
    q = deque([n for n in nodes if indeg[n] == 0])
    seen = 0
    while q:
        u = q.popleft()
        seen += 1
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return seen == len(nodes)

nodes = {"raw", "clean", "report"}
ok_edges = {("raw", "clean"), ("clean", "report")}
cycle = {("raw", "clean"), ("clean", "raw")}
print("acyclic_ok", is_acyclic(nodes, ok_edges))
print("acyclic_cycle", is_acyclic(nodes, cycle))
print("asset", "er_clusters")`,
        output: `acyclic_ok True
acyclic_cycle False
asset er_clusters`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S46-T2-A exige grafo acíclico con I/O tipado. Ciclo o nodo no declarado → `REJECT_DAG`; sin declaración de dependencia → `DECLARE_ASSET_DEPENDENCY`.",
      },
    },
    {
      heading: "Schedules, backfills y state recovery",
      subtopicId: "S46-T2-B",
      paragraphs: [
        "El **schedule** dispara corridas; no garantiza corrección ni unicidad. Un **backfill** re-procesa un intervalo histórico y debe parametrizar start/end sin solaparse con otra corrida viva. El **checkpoint** permite reanudar desde un estado consistente tras un fallo — reanudar “desde el inicio del día” sin control es un double-write disfrazado.",
        "Contrato operativo de re-ejecución. Entrada: intervalos [start, end), flag de solape, checkpoint id y `resume_from`. Salida: plan de backfill ordenado, sin solape, con resume = checkpoint. Error: dos backfills que cubren el mismo event_time o resume distinto del checkpoint. Criterio: re-run acotado produce el mismo sink que la corrida original (idempotencia de T1/T4).",
        "Aplicación a `CASO-HYO-046`: un viernes se pierden 3 horas de eventos de clínica; el backfill cubre [09:00, 12:00) sin solaparse con el job horario de las 12:00. Riesgo DE: costo de re-cómputo y corrupción de particiones si dos writers tocan la misma key.",
      ],
      code: {
        language: 'python',
        title: "schedules_backfills_state.py",
        code: `def backfill_plan(intervals: list, checkpoint: str, resume_from: str) -> dict:
    ordered = sorted(intervals, key=lambda x: x[0])
    overlap = any(
        ordered[i][1] > ordered[i + 1][0] for i in range(len(ordered) - 1)
    )
    return {
        "intervals": ordered,
        "overlap": overlap,
        "resume_ok": checkpoint == resume_from and not overlap,
    }

plan = backfill_plan([[1, 3], [4, 6]], "2026-07-01", "2026-07-01")
print(plan)
print("recover", "from_checkpoint")`,
        output: `{'intervals': [[1, 3], [4, 6]], 'overlap': False, 'resume_ok': True}
recover from_checkpoint`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S46-T2-B: backfill acotado y reanudación ensayada. Solape → `STOP_OVERLAPPING_BACKFILL`; sin resume → `RECOVER_CHECKPOINT`.",
      },
    },
    {
      heading: "Contratos y freshness",
      subtopicId: "S46-T3-A",
      paragraphs: [
        "Un **data contract** fija schema (campos y tipos), semántica (qué significa cada columna), **owner** y, por separado, un **SLO de freshness** (cuánto atraso máximo tolera el consumidor). Schema y freshness se monitorean distinto: un schema correcto con dato de ayer sigue siendo un breach de frescura.",
        "Contrato operativo de calidad. Entrada: schema esperado, schema observado, lag en minutos, SLO de lag y owner. Salida: PASS solo si schema exacto, lag ≤ SLO y owner no vacío. Error: drift de tipo/columna o lag sobre el SLO → cuarentena del dataset afectado. Criterio: fail closed — no se publica la partición “casi bien”.",
        "Aplicación a `CASO-HYO-046`: el contrato de `atenciones_diarias` exige `case_id:str` y `event_time:int` con freshness ≤ 15 min para el dashboard de operaciones. Si llega `event_time` como string o el lag es 80 min, se emite `QUARANTINE_DATASET` y se pagina al owner. Riesgo DE: consumidores downstream que leen basura con tipos rotos.",
      ],
      code: {
        language: 'python',
        title: "contracts_freshness.py",
        code: `def check_contract(schema: dict, observed: dict, lag_min: int, slo_min: int, owner: str) -> str:
    if not owner:
        return "PAGE_DATA_OWNER"
    if schema != observed or lag_min > slo_min:
        return "QUARANTINE_DATASET"
    return "PASS"

print(check_contract(
    {"case_id": "str", "event_time": "int"},
    {"case_id": "str", "event_time": "int"},
    lag_min=8, slo_min=15, owner="data-ops",
))
print(check_contract(
    {"case_id": "str", "event_time": "int"},
    {"case_id": "int"},
    lag_min=80, slo_min=15, owner="data-ops",
))`,
        output: `PASS
QUARANTINE_DATASET`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S46-T3-A: schema break o stale data alertan. Breach → `QUARANTINE_DATASET`; sin owner → `PAGE_DATA_OWNER`.",
      },
    },
    {
      heading: "Lineage, observability y ownership",
      subtopicId: "S46-T3-B",
      paragraphs: [
        "**Lineage** conecta dataset de salida con inputs, código y run_id. **Observabilidad de datos** combina volumen, calidad (null_rate) y tiempo. Sin owner, el incidente no tiene dueño de página: el on-call de plataforma no debería adivinar quién rompió el schema de `clean-v3`.",
        "Contrato operativo de trazabilidad. Entrada: run_id, sets de inputs/outputs, métricas (rows, null_rate) y owner. Salida: registro reconstruible run→datasets; incidente solo si calidad/owner fallan. Error: inputs vacíos, null_rate sobre umbral o run_id no trazable. Criterio: un postmortem puede responder “qué corrida produjo esta fila”.",
        "Aplicación a `CASO-HYO-046`: el run `run-hyo-46` materializa `clean-v3` desde `raw-v2` con null_rate 0.01 y owner analytics. Si null_rate sube a 0.3, se abre `OPEN_QUALITY_INCIDENT` con el run_id en el ticket. Riesgo DE: “arreglar a ciegas” sin saber qué upstream cambió.",
      ],
      code: {
        language: 'python',
        title: "lineage_obs_ownership.py",
        code: `def lineage_ok(run_id: str, inputs: set, outputs: set, null_rate: float, owner: str) -> bool:
    return (
        run_id.startswith("run-")
        and bool(inputs)
        and bool(outputs)
        and null_rate <= 0.02
        and bool(owner)
    )

print(lineage_ok("run-hyo-46", {"raw-v2"}, {"clean-v3"}, 0.01, "analytics"))
print(lineage_ok("", set(), {"clean-v3"}, 0.3, ""))
print("facet", "job/dataset/run")`,
        output: `True
False
facet job/dataset/run`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S46-T3-B: incidente reconstruible por lineage. Breach → `OPEN_QUALITY_INCIDENT`; sin rastro → `TRACE_LINEAGE`.",
      },
    },
    {
      heading: "Partitions e incremental loads",
      subtopicId: "S46-T4-A",
      paragraphs: [
        "Particionar por fecha (o por acceso) limita el blast radius de un re-run. Una **carga incremental** solo trae deltas respecto de un watermark/clave y hace **merge** al target: si la misma fila llega dos veces, el segundo run debe cambiar **cero** filas. Conecta con T1: el watermark decide qué event_time aún es elegible; con T2: el asset particionado es un nodo del DAG que se re-ejecuta por intervalo.",
        "Contrato operativo de particiones. Entrada: partition id, source_keys, target_keys, second_run_changes y límite de small files. Salida: merge idempotente con keys alineadas y second_run_changes == 0. Error: full rewrite ciego, keys drift o explosión de small files. Criterio: re-ejecutar el mismo batch no duplica ni reescribe el sink.",
        "Aplicación a `CASO-HYO-046`: partición `2026-07-22` con keys {a,b,c}. El job horario reintenta tras un timeout de red: el merge debe reportar 0 cambios en la segunda corrida. Riesgo DE: costos de storage y conteos inflados en el reporte diario.",
      ],
      code: {
        language: 'python',
        title: "partitions_incremental.py",
        code: `def merge_incremental(target: dict, rows: list, key: str) -> tuple:
    changes = 0
    for row in rows:
        k = row[key]
        if target.get(k) != row:
            target[k] = row
            changes += 1
    return target, changes

sink = {}
batch = [{"id": "a", "v": 1}, {"id": "b", "v": 2}]
sink, c1 = merge_incremental(sink, batch, "id")
sink, c2 = merge_incremental(sink, batch, "id")
print("first_changes", c1)
print("second_changes", c2)
print("no_dup_rerun", c2 == 0)`,
        output: `first_changes 2
second_changes 0
no_dup_rerun True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S46-T4-A acepta solo segunda ejecución con cero cambios. Violación → `REBUILD_PARTITION`; clave incompleta → `REVIEW_INCREMENTAL_KEY`.",
      },
    },
    {
      heading: "SLO, incidentes y data recovery",
      subtopicId: "S46-T4-B",
      paragraphs: [
        "Un **data SLO** une un **SLI** (indicador medido, p. ej. proporción de particiones frescas) con un objetivo y una ventana. Un **incidente de datos** protege consumidores (dejar de publicar basura), recupera particiones y documenta causa + prevención. El **RTO** mide cuánto tarda la recuperación — un runbook sin dueño es teatro.",
        "Contrato operativo de operación. Entrada: freshness_sli, freshness_slo, rto_minutes, target_rto, postmortem_actions y owner. Salida: PASS si SLI ≥ SLO, RTO ≤ target, ≥1 acción de postmortem y owner. Error: SLI bajo o RTO excedido → declarar incidente y activar runbook. Criterio: simulacro medido, no promesa en README.",
        "Aplicación a `CASO-HYO-046`: el SLO de frescura del dashboard de atenciones es 0.99; un lag masivo baja el SLI a 0.80 y el RTO del replay a 90 min (>30). Se declara `DECLARE_DATA_INCIDENT` y se activa el runbook de recovery. Riesgo DE: consumidores de ML (S47) entrenan sobre datos “vivos” que en realidad están congelados.",
      ],
      code: {
        language: 'python',
        title: "slo_incidents_data_recovery.py",
        code: `def data_ops_status(sli: float, slo: float, rto: int, target_rto: int, actions: int, owner: str) -> str:
    if not owner:
        return "ACTIVATE_RECOVERY_RUNBOOK"
    ok = sli >= slo and rto <= target_rto and actions >= 1
    return "PASS" if ok else "DECLARE_DATA_INCIDENT"

print(data_ops_status(0.995, 0.99, 25, 30, 3, "data-oncall"))
print(data_ops_status(0.8, 0.99, 90, 30, 0, "data-oncall"))
print("recovery", "replay_partition")`,
        output: `PASS
DECLARE_DATA_INCIDENT
recovery replay_partition`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Cierre S46-T4-B: simulacro cumple RTO y postmortem con acciones. Breach → `DECLARE_DATA_INCIDENT`; sin owner → `ACTIVATE_RECOVERY_RUNBOOK`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S46 (Ingeniería de datos y orquestación de producción) alineadas a CP-N4-B. Cada demo **calcula** el contrato sobre fixtures de Huancayo sintético — no imprime etiquetas mágicas.",
    steps: [
      {
        demoId: "S46-T1-A-DEMO",
        subtopicId: "S46-T1-A",
        environment: "local-python",
        description: "Clasifica tres event_time (on-time, late, allowed-late) bajo un watermark avanzado",
        code: {
          language: 'python',
          title: "demo_windows_event_time_watermarks.py",
          code: `def advance_watermark(event_times, lag):
    return max(event_times) - lag

def classify(et, window_end, wm, allowed_lateness):
    if et > window_end:
        return "OUT_OF_WINDOW"
    if et > wm:
        return "ON_TIME"
    if wm - et <= allowed_lateness:
        return "ALLOWED_LATE"
    return "LATE"

# Atención sintética Huancayo: max visto 115, lag 5 → wm 110
stream = [100, 108, 115]
wm = advance_watermark(stream, lag=5)
for et in (112, 100, 105):
    print(et, classify(et, 120, wm, 5))
print("watermark", wm)`,
          output: `112 ON_TIME
100 LATE
105 ALLOWED_LATE
watermark 110`,
        },
        why: "Sin un timeline calculado, el watermark es solo vocabulario. Este demo muestra por qué 100 es LATE (wm−et=10 > gracia 5) y 105 aún entra por allowed_lateness — el trade-off completeness vs latencia de Flink/Beam en miniatura, base del gate CP-N4-B.",
      },
      {
        demoId: "S46-T1-B-DEMO",
        subtopicId: "S46-T1-B",
        environment: "local-python",
        description: "Aplica sink idempotente y enruta un late event según política",
        code: {
          language: 'python',
          title: "demo_late_data_exactly_once.py",
          code: `def apply_once(seen, event_id):
    if event_id in seen:
        return False
    seen.add(event_id)
    return True

seen = set()
print("first", apply_once(seen, "e1"))
print("retry", apply_once(seen, "e1"))
late_policy = "side-output"
print("late", late_policy, "e2")
print("sink_keys", sorted(seen))`,
          output: `first True
retry False
late side-output e2
sink_keys ['e1']`,
        },
        why: "Exactly-once compuesto se demuestra con reintento que no reescribe y late event que no se cuela al agregado sin política. Si el retry devolviera True, el dashboard de atenciones contaría doble el mismo evento.",
      },
      {
        demoId: "S46-T2-A-DEMO",
        subtopicId: "S46-T2-A",
        environment: "local-python",
        description: "Detecta grafo acíclico vs ciclo raw→clean→raw con Kahn",
        code: {
          language: 'python',
          title: "demo_dag_assets_dependency.py",
          code: `from collections import defaultdict, deque

def is_acyclic(nodes, edges):
    adj, indeg = defaultdict(list), {n: 0 for n in nodes}
    for a, b in edges:
        if a not in nodes or b not in nodes or a == b:
            return False
        adj[a].append(b)
        indeg[b] += 1
    q = deque([n for n in nodes if indeg[n] == 0])
    seen = 0
    while q:
        u = q.popleft()
        seen += 1
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return seen == len(nodes)

nodes = {"raw", "clean", "report"}
print("line", is_acyclic(nodes, {("raw", "clean"), ("clean", "report")}))
print("cycle", is_acyclic(nodes, {("raw", "clean"), ("clean", "raw")}))`,
          output: `line True
cycle False`,
        },
        why: "Afirmar “DAG acíclico” sin detectar ciclos A→B→A es falsa maestría. Kahn cuenta nodos alcanzables desde indegree 0; si sobran nodos, hay ciclo — requisito real de Airflow/Dagster antes del backfill.",
      },
      {
        demoId: "S46-T2-B-DEMO",
        subtopicId: "S46-T2-B",
        environment: "local-python",
        description: "Valida intervalos de backfill sin solape y resume = checkpoint",
        code: {
          language: 'python',
          title: "demo_schedules_backfills_state.py",
          code: `def backfill_ok(intervals, checkpoint, resume_from):
    ordered = sorted(intervals, key=lambda x: x[0])
    no_overlap = all(
        ordered[i][1] <= ordered[i + 1][0] for i in range(len(ordered) - 1)
    )
    return no_overlap and checkpoint == resume_from

print("ok", backfill_ok([[1, 3], [4, 6]], "cp-1", "cp-1"))
print("overlap", backfill_ok([[1, 4], [3, 6]], "cp-1", "cp-1"))
print("bad_resume", backfill_ok([[1, 3], [4, 6]], "cp-1", "start"))`,
          output: `ok True
overlap False
bad_resume False`,
        },
        why: "Un schedule horario no autoriza a re-procesar el mismo rango dos veces. El demo calcula solape y alinea resume con checkpoint — sin eso, el backfill de las 3 h perdidas corrompe la partición viva.",
      },
      {
        demoId: "S46-T3-A-DEMO",
        subtopicId: "S46-T3-A",
        environment: "local-python",
        description: "Evalúa schema exacto y freshness frente al SLO",
        code: {
          language: 'python',
          title: "demo_contracts_freshness.py",
          code: `def evaluate(schema, observed, lag_min, slo_min, owner):
    if not owner:
        return "PAGE_DATA_OWNER"
    if schema != observed:
        return "QUARANTINE_DATASET"
    if lag_min > slo_min:
        return "QUARANTINE_DATASET"
    return "PASS"

schema = {"case_id": "str", "event_time": "int"}
print(evaluate(schema, schema, 30, 60, "data-ops"))
print(evaluate(schema, {"case_id": "int"}, 30, 60, "data-ops"))
print(evaluate(schema, schema, 90, 60, "data-ops"))`,
          output: `PASS
QUARANTINE_DATASET
QUARANTINE_DATASET`,
        },
        why: "El contrato falla cerrado por dos motivos distintos (drift de schema vs lag). Separarlos evita “arreglar freshness” cuando el tipo de columna ya está roto — patrón dbt/Great Expectations en stdlib.",
      },
      {
        demoId: "S46-T3-B-DEMO",
        subtopicId: "S46-T3-B",
        environment: "local-python",
        description: "Construye facet de lineage y decide si se pagina al owner",
        code: {
          language: 'python',
          title: "demo_lineage_obs_ownership.py",
          code: `def build_facet(run_id, inputs, outputs, metrics, owner):
    return {
        "run": run_id,
        "inputs": sorted(inputs),
        "outputs": sorted(outputs),
        "null_rate": metrics["null_rate"],
        "owner": owner,
    }

def should_page(facet, max_null=0.02):
    if not facet["owner"] or not facet["run"].startswith("run-"):
        return True
    return facet["null_rate"] > max_null

f = build_facet("run-hyo-46", {"raw-v2"}, {"clean-v3"}, {"null_rate": 0.01}, "analytics")
print(f)
print("page", should_page(f))`,
          output: `{'run': 'run-hyo-46', 'inputs': ['raw-v2'], 'outputs': ['clean-v3'], 'null_rate': 0.01, 'owner': 'analytics'}
page False`,
        },
        why: "Lineage no es un print de listas sueltas: es un facet run/inputs/outputs/métricas/owner. Solo con eso un incidente de calidad es reconstruible en el postmortem de Huancayo.",
      },
      {
        demoId: "S46-T4-A-DEMO",
        subtopicId: "S46-T4-A",
        environment: "local-python",
        description: "Merge incremental: primera corrida escribe, segunda deja cero cambios",
        code: {
          language: 'python',
          title: "demo_partitions_incremental.py",
          code: `def merge_incremental(target, rows, key):
    changes = 0
    for row in rows:
        k = row[key]
        if target.get(k) != row:
            target[k] = dict(row)
            changes += 1
    return changes

sink = {}
batch = [{"id": "a", "v": 1}, {"id": "b", "v": 2}]
print("first", merge_incremental(sink, batch, "id"))
print("second", merge_incremental(sink, batch, "id"))
print("keys", sorted(sink))`,
          output: `first 2
second 0
keys ['a', 'b']`,
        },
        why: "El gate CP-N4-B exige que retry y backfill no dupliquen. Contar cambios del merge prueba idempotencia de verdad — no un booleano hardcodeado `no_dup_rerun True`.",
      },
      {
        demoId: "S46-T4-B-DEMO",
        subtopicId: "S46-T4-B",
        environment: "local-python",
        description: "Compara SLI vs SLO y RTO vs target para decidir incidente",
        code: {
          language: 'python',
          title: "demo_slo_incidents_data_recovery.py",
          code: `def ops_decision(sli, slo, rto, target_rto, actions, owner):
    if not owner:
        return "ACTIVATE_RECOVERY_RUNBOOK"
    if sli < slo or rto > target_rto or actions < 1:
        return "DECLARE_DATA_INCIDENT"
    return "PASS"

print(ops_decision(0.995, 0.99, 25, 30, 3, "data-oncall"))
print(ops_decision(0.80, 0.99, 90, 30, 0, "data-oncall"))
print("sli_vs_slo", "medida vs objetivo")`,
          output: `PASS
DECLARE_DATA_INCIDENT
sli_vs_slo medida vs objetivo`,
        },
        why: "SLI es la medición; SLO es el objetivo. El demo obliga a comparar ambos y el RTO — vocabulario SRE que el self-check y el youDo reutilizan al declarar incidentes de datos.",
      },
    ],
  },
  weDo: {
    intro: "S46 · Laboratorio de pipeline production-grade: 24 retos locales sobre CASO-HYO-046. Cada familia T* reutiliza la forma fail-closed E1 (predicado de dominio) → E2 (valid/invalid/missing) → E3 (CONTINUE / breach / incertidumbre), pero el **defecto** es de DE real: watermark/late, exactly-once, ciclo Kahn, solape de backfill calculado, schema+freshness, lineage, merge idempotente, SLI/SLO. Tokens de acción son el protocolo operativo de la sección (no enums internos vacíos).",
    steps: [
      {
        id: "S46-T1-A-E1",
        subtopicId: "S46-T1-A",
        kind: "guided",
        instruction: "S46-T1-A-E1 · Sobre `CASO-HYO-046-1A`, implementa el predicado de aceptación de ventana: ON_TIME o ALLOWED_LATE. Regla: si event_time > window_end → rechazo; si event_time > watermark → ON_TIME (PASS); si watermark − event_time ≤ allowed_lateness → ALLOWED_LATE (PASS); si no → LATE. El starter acepta lo contrario. Salida exacta: `S46-T1-A PASS`.",
        hint: "Dibuja una recta: watermark a la izquierda de los on-time; allowed_lateness es la franja a la izquierda del watermark que aún se acepta.",
        hints: [
          "Orden mental: primero ventana (et ≤ window_end), luego on-time (et > wm), luego gracia (wm − et ≤ allowed_lateness).",
          "PASS cuando (et <= window_end) y (et > wm o wm - et <= allowed_lateness). El fixture válido tiene et=110, wm=100, lateness=15.",
        ],
        edgeCases: [
          "falta allowed_lateness → WAIT_FOR_WATERMARK / MISSING",
          "fixture adverso: event_time demasiado temprano vs watermark (LATE) o > window_end → SIDE_OUTPUT_LATE_EVENT",
          "eventos sintéticos CASO-HYO-046-1A (sin PII)",
        ],
        tests: "El fixture `CASO-HYO-046-1A` satisface el predicado de dominio; imprime `S46-T1-A PASS` y el assert booleano pasa.",
        feedback: "E1 guiado: el defecto invertía late/out-of-window como éxito. La regla alineada a Flink es watermark-as-progress + gracia, no un bound inferior inventado.",
        starterCode: {
          language: 'python',
          title: "s46-t1-a-e1.py",
          code: `# CASO-HYO-046 · event time windows + watermark
# DEFECT: PASS si event fuera de ventana o demasiado late
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {
    "case_id": "CASO-HYO-046-1A",
    "event_time": 110,
    "window_end": 120,
    "watermark": 100,
    "allowed_lateness": 15,
}
# DEFECT: late/out-of-window marcados como contrato OK
meets_contract = (
    record["event_time"] > record["window_end"]
    or record["event_time"] < record["watermark"] - record["allowed_lateness"]
)
status = "PASS" if meets_contract else "SIDE_OUTPUT_LATE_EVENT"
print("S46-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t1-a-e1.py",
          code: `record = {
    "case_id": "CASO-HYO-046-1A",
    "event_time": 110,
    "window_end": 120,
    "watermark": 100,
    "allowed_lateness": 15,
}
et, we, wm, al = (
    record["event_time"],
    record["window_end"],
    record["watermark"],
    record["allowed_lateness"],
)
in_window = et <= we
on_time = et > wm
allowed_late = et <= wm and (wm - et) <= al
meets_contract = in_window and (on_time or allowed_late)
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
        instruction: "S46-T1-A-E2 · Tres rutas: válido (PASS), late (SIDE_OUTPUT_LATE_EVENT), sin `allowed_lateness` (MISSING:allowed_lateness). Entrada: case_id, event_time, window_end, watermark, allowed_lateness. Corrige el assess defectuoso; no rellenes campos faltantes.",
        hint: "Calcula `missing` antes de leer allowed_lateness; un KeyError no es un token de incertidumbre.",
        hints: [
          "Si falta un campo requerido, devuelve MISSING:… sin evaluar el predicado de late.",
          "Válido: et=110, wm=100, al=15. Adverso: et=80 (wm−et=20 > 15) → SIDE_OUTPUT_LATE_EVENT.",
        ],
        edgeCases: [
          "falta allowed_lateness → MISSING:allowed_lateness",
          "fixture adverso: et=80 con wm=100 y al=15 (demasiado late) → SIDE_OUTPUT_LATE_EVENT",
          "eventos sintéticos CASO-HYO-046-1A (sin PII)",
        ],
        tests: "Produce exactamente `PASS SIDE_OUTPUT_LATE_EVENT MISSING:allowed_lateness`.",
        feedback: "E2 independiente: separaste schema incompleto (MISSING) de contenido late (SIDE_OUTPUT). No inventes allowed_lateness por defecto: WAIT/MISSING es la rama correcta.",
        starterCode: {
          language: 'python',
          title: "s46-t1-a-e2.py",
          code: `# CASO-HYO-046 · assess LATE_OR_OUT_OF_WINDOW
# DEFECT: PASS con event_time inválido vs watermark
def assess(record: dict) -> str:
    required = {"case_id", "event_time", "window_end", "watermark", "allowed_lateness"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return (
        "PASS"
        if record["event_time"] > record["window_end"]
        or record["event_time"] < record["watermark"] - record["allowed_lateness"]
        else "SIDE_OUTPUT_LATE_EVENT"
    )

valid = {"case_id": "CASO-HYO-046-1A", "event_time": 110, "window_end": 120, "watermark": 100, "allowed_lateness": 15}
invalid = {"case_id": "CASO-HYO-046-1A", "event_time": 80, "window_end": 120, "watermark": 100, "allowed_lateness": 15}
incomplete = {**valid}
incomplete.pop("allowed_lateness")
print(* (assess(valid), assess(invalid), assess(incomplete)))
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
    et, we, wm, al = (
        record["event_time"],
        record["window_end"],
        record["watermark"],
        record["allowed_lateness"],
    )
    ok = et <= we and (et > wm or (wm - et) <= al)
    return "PASS" if ok else "SIDE_OUTPUT_LATE_EVENT"

valid = {"case_id": "CASO-HYO-046-1A", "event_time": 110, "window_end": 120, "watermark": 100, "allowed_lateness": 15}
invalid = {"case_id": "CASO-HYO-046-1A", "event_time": 80, "window_end": 120, "watermark": 100, "allowed_lateness": 15}
incomplete = {**valid}
incomplete.pop("allowed_lateness")
print(* (assess(valid), assess(invalid), assess(incomplete)))
` ,
          output: `PASS SIDE_OUTPUT_LATE_EVENT MISSING:allowed_lateness` ,
        },
      },
      {
        id: "S46-T1-A-E3",
        subtopicId: "S46-T1-A",
        kind: "transfer",
        instruction: "S46-T1-A-E3 · Transfer: decide rutas operativas CONTINUE / SIDE_OUTPUT_LATE_EVENT / WAIT_FOR_WATERMARK sobre los mismos tres fixtures. Ausencia ≠ breach: falta `allowed_lateness` → WAIT_FOR_WATERMARK. El starter devuelve CONTINUE en missing y tiene el predicado invertido.",
        hint: "Enruta missing primero a WAIT_FOR_WATERMARK; solo con campos completos evalúa on-time/allowed-late.",
        hints: [
          "WAIT_FOR_WATERMARK es incertidumbre operativa, no un PASS disfrazado ni un SIDE_OUTPUT.",
          "Orden de salida esperado: CONTINUE, SIDE_OUTPUT_LATE_EVENT, WAIT_FOR_WATERMARK.",
        ],
        edgeCases: [
          "falta allowed_lateness → WAIT_FOR_WATERMARK",
          "fixture adverso: et demasiado early vs wm+lateness → SIDE_OUTPUT_LATE_EVENT",
          "eventos sintéticos CASO-HYO-046-1A (sin PII)",
        ],
        tests: "Fixtures válido/adverso/sin allowed_lateness → CONTINUE SIDE_OUTPUT_LATE_EVENT WAIT_FOR_WATERMARK.",
        feedback: "E3 transfer: fail-closed con vocabulario operativo. CONTINUE solo cuando el evento es ON_TIME o ALLOWED_LATE; no conviertas incertidumbre en éxito silencioso.",
        starterCode: {
          language: 'python',
          title: "s46-t1-a-e3.py",
          code: `# CASO-HYO-046 · decide LATE_OR_OUT_OF_WINDOW
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "event_time", "window_end", "watermark", "allowed_lateness"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return (
        "CONTINUE"
        if record["event_time"] > record["window_end"]
        or record["event_time"] < record["watermark"] - record["allowed_lateness"]
        else "SIDE_OUTPUT_LATE_EVENT"
    )

valid = {"case_id": "CASO-HYO-046-1A", "event_time": 110, "window_end": 120, "watermark": 100, "allowed_lateness": 15}
invalid = {"case_id": "CASO-HYO-046-1A", "event_time": 80, "window_end": 120, "watermark": 100, "allowed_lateness": 15}
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
    et, we, wm, al = (
        record["event_time"],
        record["window_end"],
        record["watermark"],
        record["allowed_lateness"],
    )
    ok = et <= we and (et > wm or (wm - et) <= al)
    return "CONTINUE" if ok else "SIDE_OUTPUT_LATE_EVENT"

valid = {"case_id": "CASO-HYO-046-1A", "event_time": 110, "window_end": 120, "watermark": 100, "allowed_lateness": 15}
invalid = {"case_id": "CASO-HYO-046-1A", "event_time": 80, "window_end": 120, "watermark": 100, "allowed_lateness": 15}
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
        instruction: "S46-T1-B-E1 · Exactly-once compuesto sobre `CASO-HYO-046-1B`: set(event_ids)==sink_ids, checkpoint==2 y late_policy ∈ {update, side-output, quarantine}. El starter aprueba si longitudes coinciden o falta policy. Salida: `S46-T1-B PASS`.",
        hint: "Compara conjuntos, no longitudes: [e1,e1,e2] tiene len 3 pero set size 2.",
        hints: [
          "checkpoint y late_policy son eslabones del compuesto exactly-once, no decoración del record.",
          "late_policy vacía o checkpoint≠2 deben fallar aunque las keys parezcan bien.",
        ],
        edgeCases: [
          "falta late_policy → CHOOSE_LATE_POLICY / MISSING",
          "fixture adverso: sink incompleto, checkpoint 0 o policy vacía → REPLAY_IDEMPOTENTLY",
          "eventos sintéticos CASO-HYO-046-1B (sin PII)",
        ],
        tests: "Imprime `S46-T1-B PASS` y assert True.",
        feedback: "E1: dedup por set, no por len. Exactly-once compuesto exige sink, checkpoint y policy a la vez.",
        starterCode: {
          language: 'python',
          title: "s46-t1-b-e1.py",
          code: `# CASO-HYO-046 · exactly-once sink + late policy
# DEFECT: PASS si |events|==|sink| o sin late_policy
record = {
    "case_id": "CASO-HYO-046-1B",
    "event_ids": ["e1", "e1", "e2"],
    "sink_ids": {"e1", "e2"},
    "checkpoint": 2,
    "late_policy": "update",
}
meets_contract = len(record["event_ids"]) == len(record["sink_ids"]) or not record["late_policy"]
status = "PASS" if meets_contract else "REPLAY_IDEMPOTENTLY"
print("S46-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t1-b-e1.py",
          code: `record = {
    "case_id": "CASO-HYO-046-1B",
    "event_ids": ["e1", "e1", "e2"],
    "sink_ids": {"e1", "e2"},
    "checkpoint": 2,
    "late_policy": "update",
}
meets_contract = (
    set(record["event_ids"]) == record["sink_ids"]
    and record["checkpoint"] == 2
    and record["late_policy"] in {"update", "side-output", "quarantine"}
)
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
        instruction: "S46-T1-B-E2 · Tres rutas: PASS / REPLAY_IDEMPOTENTLY / MISSING:late_policy. Conserva validación de campos; corrige solo la decisión de dominio.",
        hint: "Missing primero; luego set(event_ids)==sink_ids y policy en el catálogo permitido.",
        hints: [
          "PASS solo si set equality AND checkpoint==2 AND policy ∈ {update, side-output, quarantine}.",
          "El adverso tiene sink {e1}, checkpoint 0 y policy vacía.",
        ],
        edgeCases: [
          "falta late_policy → MISSING:late_policy",
          "fixture adverso: sink incompleto o policy inválida → REPLAY_IDEMPOTENTLY",
          "eventos sintéticos CASO-HYO-046-1B (sin PII)",
        ],
        tests: "Salida exacta: `PASS REPLAY_IDEMPOTENTLY MISSING:late_policy`.",
        feedback: "E2: el adverso falla por contenido (dedup/checkpoint/policy), no por KeyError. Missing es otra rama.",
        starterCode: {
          language: 'python',
          title: "s46-t1-b-e2.py",
          code: `# CASO-HYO-046 · assess REPLAY_IDEMPOTENTLY
def assess(record: dict) -> str:
    required = {"case_id", "event_ids", "sink_ids", "checkpoint", "late_policy"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return (
        "PASS"
        if len(record["event_ids"]) == len(record["sink_ids"]) or not record["late_policy"]
        else "REPLAY_IDEMPOTENTLY"
    )

valid = {"case_id": "CASO-HYO-046-1B", "event_ids": ["e1", "e1", "e2"], "sink_ids": {"e1", "e2"}, "checkpoint": 2, "late_policy": "update"}
invalid = {"case_id": "CASO-HYO-046-1B", "event_ids": ["e1", "e1", "e2"], "sink_ids": {"e1"}, "checkpoint": 0, "late_policy": ""}
incomplete = {**valid}
incomplete.pop("late_policy")
print(* (assess(valid), assess(invalid), assess(incomplete)))
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
    ok = (
        set(record["event_ids"]) == record["sink_ids"]
        and record["checkpoint"] == 2
        and record["late_policy"] in {"update", "side-output", "quarantine"}
    )
    return "PASS" if ok else "REPLAY_IDEMPOTENTLY"

valid = {"case_id": "CASO-HYO-046-1B", "event_ids": ["e1", "e1", "e2"], "sink_ids": {"e1", "e2"}, "checkpoint": 2, "late_policy": "update"}
invalid = {"case_id": "CASO-HYO-046-1B", "event_ids": ["e1", "e1", "e2"], "sink_ids": {"e1"}, "checkpoint": 0, "late_policy": ""}
incomplete = {**valid}
incomplete.pop("late_policy")
print(* (assess(valid), assess(invalid), assess(incomplete)))
` ,
          output: `PASS REPLAY_IDEMPOTENTLY MISSING:late_policy` ,
        },
      },
      {
        id: "S46-T1-B-E3",
        subtopicId: "S46-T1-B",
        kind: "transfer",
        instruction: "S46-T1-B-E3 · CONTINUE / REPLAY_IDEMPOTENTLY / CHOOSE_LATE_POLICY. Sin late_policy no es breach de contenido: elige política antes de reprocesar.",
        hint: "Missing → CHOOSE_LATE_POLICY; no uses CONTINUE ni REPLAY para campos ausentes.",
        hints: [
          "Tres salidas distintas: CONTINUE / REPLAY_IDEMPOTENTLY / CHOOSE_LATE_POLICY — no colapses incertidumbre en breach.",
          "CONTINUE solo con set equality, checkpoint 2 y policy válida.",
        ],
        edgeCases: [
          "falta late_policy → CHOOSE_LATE_POLICY",
          "fixture adverso: dedup o checkpoint roto → REPLAY_IDEMPOTENTLY",
          "eventos sintéticos CASO-HYO-046-1B (sin PII)",
        ],
        tests: "CONTINUE REPLAY_IDEMPOTENTLY CHOOSE_LATE_POLICY.",
        feedback: "E3: distinguir “no sé la política” de “el sink está corrupto” evita re-procesar a ciegas.",
        starterCode: {
          language: 'python',
          title: "s46-t1-b-e3.py",
          code: `# CASO-HYO-046 · decide REPLAY_IDEMPOTENTLY
def decide(record: dict) -> str:
    required = {"case_id", "event_ids", "sink_ids", "checkpoint", "late_policy"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return (
        "CONTINUE"
        if len(record["event_ids"]) == len(record["sink_ids"]) or not record["late_policy"]
        else "REPLAY_IDEMPOTENTLY"
    )

valid = {"case_id": "CASO-HYO-046-1B", "event_ids": ["e1", "e1", "e2"], "sink_ids": {"e1", "e2"}, "checkpoint": 2, "late_policy": "update"}
invalid = {"case_id": "CASO-HYO-046-1B", "event_ids": ["e1", "e1", "e2"], "sink_ids": {"e1"}, "checkpoint": 0, "late_policy": ""}
uncertain = {**valid}
uncertain.pop("late_policy")
print(* [decide(item) for item in (valid, invalid, uncertain)])
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
    ok = (
        set(record["event_ids"]) == record["sink_ids"]
        and record["checkpoint"] == 2
        and record["late_policy"] in {"update", "side-output", "quarantine"}
    )
    return "CONTINUE" if ok else "REPLAY_IDEMPOTENTLY"

valid = {"case_id": "CASO-HYO-046-1B", "event_ids": ["e1", "e1", "e2"], "sink_ids": {"e1", "e2"}, "checkpoint": 2, "late_policy": "update"}
invalid = {"case_id": "CASO-HYO-046-1B", "event_ids": ["e1", "e1", "e2"], "sink_ids": {"e1"}, "checkpoint": 0, "late_policy": ""}
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
        instruction: "S46-T2-A-E1 · Valida DAG de `CASO-HYO-046-2A`: typed_io True, sin self-loops, todos los endpoints de edges ∈ nodes, y **sin ciclos** (orden topológico completo). El starter aprueba lo inverso. Salida: `S46-T2-A PASS`.",
        hint: "Self-loop es necesario pero no suficiente: implementa Kahn o DFS para rechazar raw→clean→raw.",
        hints: [
          "Cuenta nodos procesados por Kahn: si seen < len(nodes), hay ciclo residual.",
          "Válido: raw→clean→report. El assert debe ser True con typed_io.",
        ],
        edgeCases: [
          "falta typed_io → DECLARE_ASSET_DEPENDENCY / MISSING",
          "fixture adverso: ciclo raw↔clean o self-loop / nodo no declarado → REJECT_DAG",
          "eventos sintéticos CASO-HYO-046-2A (sin PII)",
        ],
        tests: "Imprime `S46-T2-A PASS` con grafo acíclico real.",
        feedback: "E1: acíclico ≠ “sin self-loop”. Un ciclo de 2 nodos pasaba el predicado viejo y rompía el gate no_cyclic_dag.",
        starterCode: {
          language: 'python',
          title: "s46-t2-a-e1.py",
          code: `# CASO-HYO-046 · DAG typed edges + acyclic
# DEFECT: PASS si not typed_io o self-edge
from collections import defaultdict, deque

record = {
    "case_id": "CASO-HYO-046-2A",
    "nodes": {"raw", "clean", "report"},
    "edges": {("raw", "clean"), ("clean", "report")},
    "typed_io": True,
}
# DEFECT: no verifica ciclos reales
meets_contract = (not record["typed_io"]) or any(a == b for a, b in record["edges"])
status = "PASS" if meets_contract else "REJECT_DAG"
print("S46-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t2-a-e1.py",
          code: `from collections import defaultdict, deque

def is_acyclic(nodes: set, edges: set) -> bool:
    if any(a not in nodes or b not in nodes for a, b in edges):
        return False
    if any(a == b for a, b in edges):
        return False
    adj = defaultdict(list)
    indeg = {n: 0 for n in nodes}
    for a, b in edges:
        adj[a].append(b)
        indeg[b] += 1
    q = deque([n for n in nodes if indeg[n] == 0])
    seen = 0
    while q:
        u = q.popleft()
        seen += 1
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return seen == len(nodes)

record = {
    "case_id": "CASO-HYO-046-2A",
    "nodes": {"raw", "clean", "report"},
    "edges": {("raw", "clean"), ("clean", "report")},
    "typed_io": True,
}
meets_contract = record["typed_io"] and is_acyclic(record["nodes"], record["edges"])
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
        instruction: "S46-T2-A-E2 · PASS / REJECT_DAG / MISSING:typed_io. El adverso es un **ciclo** raw→clean→raw con typed_io True (no solo self-loop).",
        hint: "Reutiliza is_acyclic; el ciclo de 2 nodos debe devolver REJECT_DAG aunque typed_io sea True.",
        hints: [
          "typed_io True no salva un ciclo: acíclico y tipado son condiciones independientes.",
          "Missing de typed_io antes de evaluar edges.",
        ],
        edgeCases: [
          "falta typed_io → MISSING:typed_io",
          "fixture adverso: ciclo raw→clean→raw → REJECT_DAG",
          "eventos sintéticos CASO-HYO-046-2A (sin PII)",
        ],
        tests: "`PASS REJECT_DAG MISSING:typed_io`.",
        feedback: "E2: el adverso ya no es self-loop decorativo; es un ciclo real que el orquestador no puede ordenar.",
        starterCode: {
          language: 'python',
          title: "s46-t2-a-e2.py",
          code: `# CASO-HYO-046 · assess REJECT_DAG
def assess(record: dict) -> str:
    required = {"case_id", "nodes", "edges", "typed_io"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return (
        "PASS"
        if (not record["typed_io"]) or any(a == b for a, b in record["edges"])
        else "REJECT_DAG"
    )

valid = {"case_id": "CASO-HYO-046-2A", "nodes": {"raw", "clean", "report"}, "edges": {("raw", "clean"), ("clean", "report")}, "typed_io": True}
invalid = {"case_id": "CASO-HYO-046-2A", "nodes": {"raw", "clean", "report"}, "edges": {("raw", "clean"), ("clean", "raw")}, "typed_io": True}
incomplete = {**valid}
incomplete.pop("typed_io")
print(* (assess(valid), assess(invalid), assess(incomplete)))
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t2-a-e2.py",
          code: `from collections import defaultdict, deque

def is_acyclic(nodes: set, edges: set) -> bool:
    if any(a not in nodes or b not in nodes for a, b in edges):
        return False
    if any(a == b for a, b in edges):
        return False
    adj = defaultdict(list)
    indeg = {n: 0 for n in nodes}
    for a, b in edges:
        adj[a].append(b)
        indeg[b] += 1
    q = deque([n for n in nodes if indeg[n] == 0])
    seen = 0
    while q:
        u = q.popleft()
        seen += 1
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return seen == len(nodes)

def assess(record: dict) -> str:
    required = {"case_id", "nodes", "edges", "typed_io"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ok = record["typed_io"] and is_acyclic(record["nodes"], record["edges"])
    return "PASS" if ok else "REJECT_DAG"

valid = {"case_id": "CASO-HYO-046-2A", "nodes": {"raw", "clean", "report"}, "edges": {("raw", "clean"), ("clean", "report")}, "typed_io": True}
invalid = {"case_id": "CASO-HYO-046-2A", "nodes": {"raw", "clean", "report"}, "edges": {("raw", "clean"), ("clean", "raw")}, "typed_io": True}
incomplete = {**valid}
incomplete.pop("typed_io")
print(* (assess(valid), assess(invalid), assess(incomplete)))
` ,
          output: `PASS REJECT_DAG MISSING:typed_io` ,
        },
      },
      {
        id: "S46-T2-A-E3",
        subtopicId: "S46-T2-A",
        kind: "transfer",
        instruction: "S46-T2-A-E3 · CONTINUE / REJECT_DAG / DECLARE_ASSET_DEPENDENCY. Sin typed_io declara dependencia; no continúes a ciegas.",
        hint: "Missing → DECLARE_ASSET_DEPENDENCY; ciclo → REJECT_DAG; línea acíclica tipada → CONTINUE.",
        hints: [
          "No conviertas DECLARE en REJECT: missing de typed_io ≠ grafo inválido.",
          "Copia is_acyclic del demo T2-A; no uses solo `a != b`.",
        ],
        edgeCases: [
          "falta typed_io → DECLARE_ASSET_DEPENDENCY",
          "fixture adverso: ciclo A→B→A → REJECT_DAG",
          "eventos sintéticos CASO-HYO-046-2A (sin PII)",
        ],
        tests: "CONTINUE REJECT_DAG DECLARE_ASSET_DEPENDENCY.",
        feedback: "E3: DECLARE_ASSET_DEPENDENCY es incertidumbre de diseño; REJECT_DAG es breach de topología. No los mezcles.",
        starterCode: {
          language: 'python',
          title: "s46-t2-a-e3.py",
          code: `# CASO-HYO-046 · decide REJECT_DAG
def decide(record: dict) -> str:
    required = {"case_id", "nodes", "edges", "typed_io"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return (
        "CONTINUE"
        if (not record["typed_io"]) or any(a == b for a, b in record["edges"])
        else "REJECT_DAG"
    )

valid = {"case_id": "CASO-HYO-046-2A", "nodes": {"raw", "clean", "report"}, "edges": {("raw", "clean"), ("clean", "report")}, "typed_io": True}
invalid = {"case_id": "CASO-HYO-046-2A", "nodes": {"raw", "clean", "report"}, "edges": {("raw", "clean"), ("clean", "raw")}, "typed_io": True}
uncertain = {**valid}
uncertain.pop("typed_io")
print(* [decide(item) for item in (valid, invalid, uncertain)])
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t2-a-e3.py",
          code: `from collections import defaultdict, deque

def is_acyclic(nodes: set, edges: set) -> bool:
    if any(a not in nodes or b not in nodes for a, b in edges):
        return False
    if any(a == b for a, b in edges):
        return False
    adj = defaultdict(list)
    indeg = {n: 0 for n in nodes}
    for a, b in edges:
        adj[a].append(b)
        indeg[b] += 1
    q = deque([n for n in nodes if indeg[n] == 0])
    seen = 0
    while q:
        u = q.popleft()
        seen += 1
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return seen == len(nodes)

def decide(record: dict) -> str:
    required = {"case_id", "nodes", "edges", "typed_io"}
    missing = sorted(required - record.keys())
    if missing:
        return "DECLARE_ASSET_DEPENDENCY"
    ok = record["typed_io"] and is_acyclic(record["nodes"], record["edges"])
    return "CONTINUE" if ok else "REJECT_DAG"

valid = {"case_id": "CASO-HYO-046-2A", "nodes": {"raw", "clean", "report"}, "edges": {("raw", "clean"), ("clean", "report")}, "typed_io": True}
invalid = {"case_id": "CASO-HYO-046-2A", "nodes": {"raw", "clean", "report"}, "edges": {("raw", "clean"), ("clean", "raw")}, "typed_io": True}
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
        instruction: "S46-T2-B-E1 · Backfill de `CASO-HYO-046-2B`: intervalos half-open [start, end) sin solape (end_i ≤ start_{i+1}) y checkpoint == resume_from. **Calcula** el solape desde los números; no confíes en un flag. Starter invierte la regla. Salida: `S46-T2-B PASS`.",
        hint: "Ordena por start; hay solape si algún fin es > inicio del siguiente (half-open: tocar en el borde está bien).",
        hints: [
          "computed_overlap = any(ordered[i][1] > ordered[i+1][0] …). PASS solo si not computed_overlap y resume == checkpoint.",
          "resume_from debe ser idéntico al checkpoint (mismo string).",
        ],
        edgeCases: [
          "falta resume_from → RECOVER_CHECKPOINT / MISSING",
          "fixture adverso: intervals solapados o resume≠checkpoint → STOP_OVERLAPPING_BACKFILL",
          "eventos sintéticos CASO-HYO-046-2B (sin PII)",
        ],
        tests: "`S46-T2-B PASS` con intervalos [1,3) y [4,6).",
        feedback: "E1: el solape se **deriva** de los intervalos half-open; un flag `overlap` en el record es solo una pista, no la verdad del plan.",
        starterCode: {
          language: 'python',
          title: "s46-t2-b-e1.py",
          code: `# CASO-HYO-046 · backfill non-overlap + resume
# DEFECT: confía en flag overlap invertido y no calcula solape
record = {
    "case_id": "CASO-HYO-046-2B",
    "intervals": [[1, 3], [4, 6]],
    "checkpoint": "2026-07-01",
    "resume_from": "2026-07-01",
}
# DEFECT: aprueba si hay solape o resume roto
ordered = sorted(record["intervals"], key=lambda x: x[0])
computed_overlap = any(
    ordered[i][1] > ordered[i + 1][0] for i in range(len(ordered) - 1)
)
meets_contract = computed_overlap or record["checkpoint"] != record["resume_from"]
status = "PASS" if meets_contract else "STOP_OVERLAPPING_BACKFILL"
print("S46-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t2-b-e1.py",
          code: `record = {
    "case_id": "CASO-HYO-046-2B",
    "intervals": [[1, 3], [4, 6]],
    "checkpoint": "2026-07-01",
    "resume_from": "2026-07-01",
}
ordered = sorted(record["intervals"], key=lambda x: x[0])
computed_overlap = any(
    ordered[i][1] > ordered[i + 1][0] for i in range(len(ordered) - 1)
)
meets_contract = (
    not computed_overlap
    and record["checkpoint"] == record["resume_from"]
)
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
        instruction: "S46-T2-B-E2 · PASS / STOP_OVERLAPPING_BACKFILL / MISSING:resume_from. Adverso: intervals [[1,4],[3,6]] (solape en 3–4) y resume_from=\"start\". Calcula solape half-open; no uses un flag `overlap`.",
        hint: "Missing de resume_from antes de comparar con checkpoint; el solape se calcula sobre intervals ordenados.",
        hints: [
          "resume_from 'start' no es un checkpoint real: debe igualar el id de checkpoint del run.",
          "PASS: not computed_overlap AND resume_from == checkpoint.",
        ],
        edgeCases: [
          "falta resume_from → MISSING:resume_from",
          "fixture adverso: solape real de intervalos → STOP_OVERLAPPING_BACKFILL",
          "eventos sintéticos CASO-HYO-046-2B (sin PII)",
        ],
        tests: "`PASS STOP_OVERLAPPING_BACKFILL MISSING:resume_from`.",
        feedback: "E2: el adverso solapa 3–4 en half-open; mirar solo un booleano del record es print-theater de orquestación.",
        starterCode: {
          language: 'python',
          title: "s46-t2-b-e2.py",
          code: `# CASO-HYO-046 · assess STOP_OVERLAPPING_BACKFILL
# DEFECT: no calcula solape; confía en comparación invertida de resume
def assess(record: dict) -> str:
    required = {"case_id", "intervals", "checkpoint", "resume_from"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return (
        "PASS"
        if record["checkpoint"] != record["resume_from"]
        else "STOP_OVERLAPPING_BACKFILL"
    )

valid = {"case_id": "CASO-HYO-046-2B", "intervals": [[1, 3], [4, 6]], "checkpoint": "2026-07-01", "resume_from": "2026-07-01"}
invalid = {"case_id": "CASO-HYO-046-2B", "intervals": [[1, 4], [3, 6]], "checkpoint": "2026-07-01", "resume_from": "start"}
incomplete = {**valid}
incomplete.pop("resume_from")
print(* (assess(valid), assess(invalid), assess(incomplete)))
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "intervals", "checkpoint", "resume_from"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    ordered = sorted(record["intervals"], key=lambda x: x[0])
    computed_overlap = any(
        ordered[i][1] > ordered[i + 1][0] for i in range(len(ordered) - 1)
    )
    ok = (not computed_overlap) and record["checkpoint"] == record["resume_from"]
    return "PASS" if ok else "STOP_OVERLAPPING_BACKFILL"

valid = {"case_id": "CASO-HYO-046-2B", "intervals": [[1, 3], [4, 6]], "checkpoint": "2026-07-01", "resume_from": "2026-07-01"}
invalid = {"case_id": "CASO-HYO-046-2B", "intervals": [[1, 4], [3, 6]], "checkpoint": "2026-07-01", "resume_from": "start"}
incomplete = {**valid}
incomplete.pop("resume_from")
print(* (assess(valid), assess(invalid), assess(incomplete)))
` ,
          output: `PASS STOP_OVERLAPPING_BACKFILL MISSING:resume_from` ,
        },
      },
      {
        id: "S46-T2-B-E3",
        subtopicId: "S46-T2-B",
        kind: "transfer",
        instruction: "S46-T2-B-E3 · CONTINUE / STOP_OVERLAPPING_BACKFILL / RECOVER_CHECKPOINT. Sin resume_from recupera estado; no continúes. Calcula solape half-open desde intervals.",
        hint: "Missing → RECOVER_CHECKPOINT; solape o resume roto → STOP; plan limpio → CONTINUE.",
        hints: [
          "RECOVER_CHECKPOINT cuando falta resume; STOP_OVERLAPPING_BACKFILL cuando computed_overlap o resume ≠ checkpoint.",
          "No trates resume_from=\"start\" como checkpoint válido.",
        ],
        edgeCases: [
          "falta resume_from → RECOVER_CHECKPOINT",
          "fixture adverso: backfills solapados → STOP_OVERLAPPING_BACKFILL",
          "eventos sintéticos CASO-HYO-046-2B (sin PII)",
        ],
        tests: "CONTINUE STOP_OVERLAPPING_BACKFILL RECOVER_CHECKPOINT.",
        feedback: "E3: RECOVER_CHECKPOINT es incertidumbre de estado; STOP es breach de planificación calculada. Distintos runbooks.",
        starterCode: {
          language: 'python',
          title: "s46-t2-b-e3.py",
          code: `# CASO-HYO-046 · decide STOP_OVERLAPPING_BACKFILL
# DEFECT: missing→CONTINUE; no calcula solape
def decide(record: dict) -> str:
    required = {"case_id", "intervals", "checkpoint", "resume_from"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return (
        "CONTINUE"
        if record["checkpoint"] != record["resume_from"]
        else "STOP_OVERLAPPING_BACKFILL"
    )

valid = {"case_id": "CASO-HYO-046-2B", "intervals": [[1, 3], [4, 6]], "checkpoint": "2026-07-01", "resume_from": "2026-07-01"}
invalid = {"case_id": "CASO-HYO-046-2B", "intervals": [[1, 4], [3, 6]], "checkpoint": "2026-07-01", "resume_from": "start"}
uncertain = {**valid}
uncertain.pop("resume_from")
print(* [decide(item) for item in (valid, invalid, uncertain)])
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "intervals", "checkpoint", "resume_from"}
    missing = sorted(required - record.keys())
    if missing:
        return "RECOVER_CHECKPOINT"
    ordered = sorted(record["intervals"], key=lambda x: x[0])
    computed_overlap = any(
        ordered[i][1] > ordered[i + 1][0] for i in range(len(ordered) - 1)
    )
    ok = (not computed_overlap) and record["checkpoint"] == record["resume_from"]
    return "CONTINUE" if ok else "STOP_OVERLAPPING_BACKFILL"

valid = {"case_id": "CASO-HYO-046-2B", "intervals": [[1, 3], [4, 6]], "checkpoint": "2026-07-01", "resume_from": "2026-07-01"}
invalid = {"case_id": "CASO-HYO-046-2B", "intervals": [[1, 4], [3, 6]], "checkpoint": "2026-07-01", "resume_from": "start"}
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
        instruction: "S46-T3-A-E1 · Contract+freshness en `CASO-HYO-046-3A`: schema==observed_schema, freshness_min≤slo_min y owner no vacío. Starter invierte. Salida: `S46-T3-A PASS`.",
        hint: "Igualdad de dicts de schema (tipos) y comparación numérica de lag vs SLO.",
        hints: [
          "PASS exige schema exacto (dict igual) AND lag_min ≤ slo_min AND owner no vacío.",
          "owner vacío es breach aunque el schema coincida.",
        ],
        edgeCases: [
          "falta owner → PAGE_DATA_OWNER / MISSING",
          "fixture adverso: schema drift o lag>slo → QUARANTINE_DATASET",
          "eventos sintéticos CASO-HYO-046-3A (sin PII)",
        ],
        tests: "`S46-T3-A PASS`.",
        feedback: "E1: fail closed de contrato — drift o frescura rota no se publican.",
        starterCode: {
          language: 'python',
          title: "s46-t3-a-e1.py",
          code: `# CASO-HYO-046 · schema contract + freshness SLO
record = {
    "case_id": "CASO-HYO-046-3A",
    "schema": {"case_id": "str", "event_time": "int"},
    "observed_schema": {"case_id": "str", "event_time": "int"},
    "freshness_min": 8,
    "slo_min": 15,
    "owner": "data-ops",
}
meets_contract = record["schema"] != record["observed_schema"] or record["freshness_min"] > record["slo_min"]
status = "PASS" if meets_contract else "QUARANTINE_DATASET"
print("S46-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t3-a-e1.py",
          code: `record = {
    "case_id": "CASO-HYO-046-3A",
    "schema": {"case_id": "str", "event_time": "int"},
    "observed_schema": {"case_id": "str", "event_time": "int"},
    "freshness_min": 8,
    "slo_min": 15,
    "owner": "data-ops",
}
meets_contract = (
    record["schema"] == record["observed_schema"]
    and record["freshness_min"] <= record["slo_min"]
    and bool(record["owner"])
)
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
        instruction: "S46-T3-A-E2 · PASS / QUARANTINE_DATASET / MISSING:owner. Adverso: observed_schema con case_id:int y lag 80.",
        hint: "Missing de owner antes de leer schema; no uses PAGE_DATA_OWNER aquí (E2 usa MISSING:owner).",
        hints: [
          "Adverso típico: case_id tipado como int y lag 80 con slo 15 → QUARANTINE_DATASET.",
          "QUARANTINE_DATASET si drift o lag>slo o owner vacío en el adverso.",
        ],
        edgeCases: [
          "falta owner → MISSING:owner",
          "fixture adverso: schema drift y/o lag>slo → QUARANTINE_DATASET",
          "eventos sintéticos CASO-HYO-046-3A (sin PII)",
        ],
        tests: "`PASS QUARANTINE_DATASET MISSING:owner`.",
        feedback: "E2: cuarentena es breach de contenido; MISSING es schema incompleto del record de control.",
        starterCode: {
          language: 'python',
          title: "s46-t3-a-e2.py",
          code: `# CASO-HYO-046 · assess QUARANTINE_DATASET
def assess(record: dict) -> str:
    required = {"case_id", "schema", "observed_schema", "freshness_min", "slo_min", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return (
        "PASS"
        if record["schema"] != record["observed_schema"] or record["freshness_min"] > record["slo_min"]
        else "QUARANTINE_DATASET"
    )

valid = {"case_id": "CASO-HYO-046-3A", "schema": {"case_id": "str", "event_time": "int"}, "observed_schema": {"case_id": "str", "event_time": "int"}, "freshness_min": 8, "slo_min": 15, "owner": "data-ops"}
invalid = {"case_id": "CASO-HYO-046-3A", "schema": {"case_id": "str", "event_time": "int"}, "observed_schema": {"case_id": "int"}, "freshness_min": 80, "slo_min": 15, "owner": ""}
incomplete = {**valid}
incomplete.pop("owner")
print(* (assess(valid), assess(invalid), assess(incomplete)))
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
    ok = (
        record["schema"] == record["observed_schema"]
        and record["freshness_min"] <= record["slo_min"]
        and bool(record["owner"])
    )
    return "PASS" if ok else "QUARANTINE_DATASET"

valid = {"case_id": "CASO-HYO-046-3A", "schema": {"case_id": "str", "event_time": "int"}, "observed_schema": {"case_id": "str", "event_time": "int"}, "freshness_min": 8, "slo_min": 15, "owner": "data-ops"}
invalid = {"case_id": "CASO-HYO-046-3A", "schema": {"case_id": "str", "event_time": "int"}, "observed_schema": {"case_id": "int"}, "freshness_min": 80, "slo_min": 15, "owner": ""}
incomplete = {**valid}
incomplete.pop("owner")
print(* (assess(valid), assess(invalid), assess(incomplete)))
` ,
          output: `PASS QUARANTINE_DATASET MISSING:owner` ,
        },
      },
      {
        id: "S46-T3-A-E3",
        subtopicId: "S46-T3-A",
        kind: "transfer",
        instruction: "S46-T3-A-E3 · CONTINUE / QUARANTINE_DATASET / PAGE_DATA_OWNER. Sin owner se pagina; no se asume data-ops por defecto.",
        hint: "Missing → PAGE_DATA_OWNER; breach de schema/lag → QUARANTINE_DATASET.",
        hints: [
          "PAGE_DATA_OWNER es la rama de incertidumbre; no inventes owner por defecto (p. ej. data-ops).",
          "CONTINUE solo con schema exacto, lag bajo SLO y owner presente.",
        ],
        edgeCases: [
          "falta owner → PAGE_DATA_OWNER",
          "fixture adverso: drift o stale → QUARANTINE_DATASET",
          "eventos sintéticos CASO-HYO-046-3A (sin PII)",
        ],
        tests: "CONTINUE QUARANTINE_DATASET PAGE_DATA_OWNER.",
        feedback: "E3: PAGE_DATA_OWNER es incertidumbre de ownership; QUARANTINE es breach de contrato. Runbooks distintos.",
        starterCode: {
          language: 'python',
          title: "s46-t3-a-e3.py",
          code: `# CASO-HYO-046 · decide QUARANTINE_DATASET
def decide(record: dict) -> str:
    required = {"case_id", "schema", "observed_schema", "freshness_min", "slo_min", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return (
        "CONTINUE"
        if record["schema"] != record["observed_schema"] or record["freshness_min"] > record["slo_min"]
        else "QUARANTINE_DATASET"
    )

valid = {"case_id": "CASO-HYO-046-3A", "schema": {"case_id": "str", "event_time": "int"}, "observed_schema": {"case_id": "str", "event_time": "int"}, "freshness_min": 8, "slo_min": 15, "owner": "data-ops"}
invalid = {"case_id": "CASO-HYO-046-3A", "schema": {"case_id": "str", "event_time": "int"}, "observed_schema": {"case_id": "int"}, "freshness_min": 80, "slo_min": 15, "owner": ""}
uncertain = {**valid}
uncertain.pop("owner")
print(* [decide(item) for item in (valid, invalid, uncertain)])
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
    ok = (
        record["schema"] == record["observed_schema"]
        and record["freshness_min"] <= record["slo_min"]
        and bool(record["owner"])
    )
    return "CONTINUE" if ok else "QUARANTINE_DATASET"

valid = {"case_id": "CASO-HYO-046-3A", "schema": {"case_id": "str", "event_time": "int"}, "observed_schema": {"case_id": "str", "event_time": "int"}, "freshness_min": 8, "slo_min": 15, "owner": "data-ops"}
invalid = {"case_id": "CASO-HYO-046-3A", "schema": {"case_id": "str", "event_time": "int"}, "observed_schema": {"case_id": "int"}, "freshness_min": 80, "slo_min": 15, "owner": ""}
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
        instruction: "S46-T3-B-E1 · Lineage en `CASO-HYO-046-3B`: run_id empieza con \"run-\", inputs y outputs no vacíos, null_rate≤0.02 y owner. Starter invierte. Salida: `S46-T3-B PASS`.",
        hint: "startswith(\"run-\") + bool(inputs) + bool(outputs) + umbral de null_rate + owner.",
        hints: [
          "null_rate ≤ 0.02 no basta sin inputs, outputs y run_id trazable (prefijo run-).",
          "Un run_id vacío o inputs=set() es breach aunque null_rate sea bajo.",
        ],
        edgeCases: [
          "falta owner → TRACE_LINEAGE / MISSING",
          "fixture adverso: sin inputs, null_rate alto o run_id vacío → OPEN_QUALITY_INCIDENT",
          "eventos sintéticos CASO-HYO-046-3B (sin PII)",
        ],
        tests: "`S46-T3-B PASS`.",
        feedback: "E1: lineage mínimo = run trazable + IO + calidad + owner. Sin uno, el incidente no se reconstruye.",
        starterCode: {
          language: 'python',
          title: "s46-t3-b-e1.py",
          code: `# CASO-HYO-046 · lineage inputs + null_rate
record = {
    "case_id": "CASO-HYO-046-3B",
    "run_id": "run-hyo-46",
    "inputs": {"raw-v2"},
    "outputs": {"clean-v3"},
    "metrics": {"rows": 120, "null_rate": 0.01},
    "owner": "analytics",
}
meets_contract = (not record["inputs"]) or record["metrics"]["null_rate"] > 0.02
status = "PASS" if meets_contract else "OPEN_QUALITY_INCIDENT"
print("S46-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t3-b-e1.py",
          code: `record = {
    "case_id": "CASO-HYO-046-3B",
    "run_id": "run-hyo-46",
    "inputs": {"raw-v2"},
    "outputs": {"clean-v3"},
    "metrics": {"rows": 120, "null_rate": 0.01},
    "owner": "analytics",
}
meets_contract = (
    record["run_id"].startswith("run-")
    and bool(record["inputs"])
    and bool(record["outputs"])
    and record["metrics"]["null_rate"] <= 0.02
    and bool(record["owner"])
)
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
        instruction: "S46-T3-B-E2 · PASS / OPEN_QUALITY_INCIDENT / MISSING:owner. Adverso: run_id \"\", inputs vacíos, null_rate 0.3.",
        hint: "Missing primero; luego el predicado completo de lineage.",
        hints: [
          "MISSING:owner ≠ OPEN_QUALITY_INCIDENT: separa schema incompleto de facet roto.",
          "OPEN_QUALITY_INCIDENT cuando falta cualquier eslabón del facet.",
        ],
        edgeCases: [
          "falta owner → MISSING:owner",
          "fixture adverso: facet incompleto o null_rate alto → OPEN_QUALITY_INCIDENT",
          "eventos sintéticos CASO-HYO-046-3B (sin PII)",
        ],
        tests: "`PASS OPEN_QUALITY_INCIDENT MISSING:owner`.",
        feedback: "E2: el adverso rompe varios eslabones a la vez; cualquiera basta para abrir incidente.",
        starterCode: {
          language: 'python',
          title: "s46-t3-b-e2.py",
          code: `# CASO-HYO-046 · assess OPEN_QUALITY_INCIDENT
def assess(record: dict) -> str:
    required = {"case_id", "run_id", "inputs", "outputs", "metrics", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return (
        "PASS"
        if (not record["inputs"]) or record["metrics"]["null_rate"] > 0.02
        else "OPEN_QUALITY_INCIDENT"
    )

valid = {"case_id": "CASO-HYO-046-3B", "run_id": "run-hyo-46", "inputs": {"raw-v2"}, "outputs": {"clean-v3"}, "metrics": {"rows": 120, "null_rate": 0.01}, "owner": "analytics"}
invalid = {"case_id": "CASO-HYO-046-3B", "run_id": "", "inputs": set(), "outputs": {"clean-v3"}, "metrics": {"rows": 120, "null_rate": 0.3}, "owner": ""}
incomplete = {**valid}
incomplete.pop("owner")
print(* (assess(valid), assess(invalid), assess(incomplete)))
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
    ok = (
        record["run_id"].startswith("run-")
        and bool(record["inputs"])
        and bool(record["outputs"])
        and record["metrics"]["null_rate"] <= 0.02
        and bool(record["owner"])
    )
    return "PASS" if ok else "OPEN_QUALITY_INCIDENT"

valid = {"case_id": "CASO-HYO-046-3B", "run_id": "run-hyo-46", "inputs": {"raw-v2"}, "outputs": {"clean-v3"}, "metrics": {"rows": 120, "null_rate": 0.01}, "owner": "analytics"}
invalid = {"case_id": "CASO-HYO-046-3B", "run_id": "", "inputs": set(), "outputs": {"clean-v3"}, "metrics": {"rows": 120, "null_rate": 0.3}, "owner": ""}
incomplete = {**valid}
incomplete.pop("owner")
print(* (assess(valid), assess(invalid), assess(incomplete)))
` ,
          output: `PASS OPEN_QUALITY_INCIDENT MISSING:owner` ,
        },
      },
      {
        id: "S46-T3-B-E3",
        subtopicId: "S46-T3-B",
        kind: "transfer",
        instruction: "S46-T3-B-E3 · CONTINUE / OPEN_QUALITY_INCIDENT / TRACE_LINEAGE. Sin owner se traza lineage; no abras incidente de calidad por campo ausente.",
        hint: "Missing → TRACE_LINEAGE; facet roto → OPEN_QUALITY_INCIDENT.",
        hints: [
          "TRACE_LINEAGE recupera contexto; OPEN_QUALITY_INCIDENT asume que ya conoces el facet roto.",
          "CONTINUE solo con run-/IO/null_rate/owner completos.",
        ],
        edgeCases: [
          "falta owner → TRACE_LINEAGE",
          "fixture adverso: calidad o run no trazable → OPEN_QUALITY_INCIDENT",
          "eventos sintéticos CASO-HYO-046-3B (sin PII)",
        ],
        tests: "CONTINUE OPEN_QUALITY_INCIDENT TRACE_LINEAGE.",
        feedback: "E3: TRACE_LINEAGE recupera contexto; OPEN_QUALITY_INCIDENT asume que ya sabes qué se rompió.",
        starterCode: {
          language: 'python',
          title: "s46-t3-b-e3.py",
          code: `# CASO-HYO-046 · decide OPEN_QUALITY_INCIDENT
def decide(record: dict) -> str:
    required = {"case_id", "run_id", "inputs", "outputs", "metrics", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return (
        "CONTINUE"
        if (not record["inputs"]) or record["metrics"]["null_rate"] > 0.02
        else "OPEN_QUALITY_INCIDENT"
    )

valid = {"case_id": "CASO-HYO-046-3B", "run_id": "run-hyo-46", "inputs": {"raw-v2"}, "outputs": {"clean-v3"}, "metrics": {"rows": 120, "null_rate": 0.01}, "owner": "analytics"}
invalid = {"case_id": "CASO-HYO-046-3B", "run_id": "", "inputs": set(), "outputs": {"clean-v3"}, "metrics": {"rows": 120, "null_rate": 0.3}, "owner": ""}
uncertain = {**valid}
uncertain.pop("owner")
print(* [decide(item) for item in (valid, invalid, uncertain)])
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
    ok = (
        record["run_id"].startswith("run-")
        and bool(record["inputs"])
        and bool(record["outputs"])
        and record["metrics"]["null_rate"] <= 0.02
        and bool(record["owner"])
    )
    return "CONTINUE" if ok else "OPEN_QUALITY_INCIDENT"

valid = {"case_id": "CASO-HYO-046-3B", "run_id": "run-hyo-46", "inputs": {"raw-v2"}, "outputs": {"clean-v3"}, "metrics": {"rows": 120, "null_rate": 0.01}, "owner": "analytics"}
invalid = {"case_id": "CASO-HYO-046-3B", "run_id": "", "inputs": set(), "outputs": {"clean-v3"}, "metrics": {"rows": 120, "null_rate": 0.3}, "owner": ""}
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
        instruction: "S46-T4-A-E1 · Incremental en `CASO-HYO-046-4A`: source_keys==target_keys, second_run_changes==0 y small_files≤max_small_files. Starter invierte. Salida: `S46-T4-A PASS`.",
        hint: "Tres conjunciones: keys iguales, cero cambios en re-run y small files bajo techo.",
        hints: [
          "source_keys == target_keys AND second_run_changes == 0 AND small_files ≤ max_small_files.",
          "second_run_changes > 0 implica que el merge no es idempotente.",
        ],
        edgeCases: [
          "falta max_small_files → REVIEW_INCREMENTAL_KEY / MISSING",
          "fixture adverso: keys drift, re-run con cambios o small_files alto → REBUILD_PARTITION",
          "eventos sintéticos CASO-HYO-046-4A (sin PII)",
        ],
        tests: "`S46-T4-A PASS`.",
        feedback: "E1: idempotencia de partición = keys alineadas + segundo run sin delta + higiene de archivos.",
        starterCode: {
          language: 'python',
          title: "s46-t4-a-e1.py",
          code: `# CASO-HYO-046 · partition incremental idempotent
record = {
    "case_id": "CASO-HYO-046-4A",
    "partition": "2026-07-22",
    "source_keys": {"a", "b", "c"},
    "target_keys": {"a", "b", "c"},
    "second_run_changes": 0,
    "small_files": 2,
    "max_small_files": 5,
}
meets_contract = record["source_keys"] != record["target_keys"] or record["second_run_changes"] > 0
status = "PASS" if meets_contract else "REBUILD_PARTITION"
print("S46-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t4-a-e1.py",
          code: `record = {
    "case_id": "CASO-HYO-046-4A",
    "partition": "2026-07-22",
    "source_keys": {"a", "b", "c"},
    "target_keys": {"a", "b", "c"},
    "second_run_changes": 0,
    "small_files": 2,
    "max_small_files": 5,
}
meets_contract = (
    record["source_keys"] == record["target_keys"]
    and record["second_run_changes"] == 0
    and record["small_files"] <= record["max_small_files"]
)
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
        instruction: "S46-T4-A-E2 · PASS / REBUILD_PARTITION / MISSING:max_small_files. Adverso: keys drift, second_run_changes=3, small_files=30.",
        hint: "Missing de max_small_files antes de comparar small_files.",
        hints: [
          "Keys drift o second_run_changes > 0 o small_files alto → REBUILD_PARTITION.",
          "REBUILD_PARTITION si cualquier condición de merge/higiene falla.",
        ],
        edgeCases: [
          "falta max_small_files → MISSING:max_small_files",
          "fixture adverso: merge no idempotente o small files → REBUILD_PARTITION",
          "eventos sintéticos CASO-HYO-046-4A (sin PII)",
        ],
        tests: "`PASS REBUILD_PARTITION MISSING:max_small_files`.",
        feedback: "E2: rebuild es la respuesta a un sink que ya no es función del batch de entrada.",
        starterCode: {
          language: 'python',
          title: "s46-t4-a-e2.py",
          code: `# CASO-HYO-046 · assess REBUILD_PARTITION
def assess(record: dict) -> str:
    required = {"case_id", "partition", "source_keys", "target_keys", "second_run_changes", "small_files", "max_small_files"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return (
        "PASS"
        if record["source_keys"] != record["target_keys"] or record["second_run_changes"] > 0
        else "REBUILD_PARTITION"
    )

valid = {"case_id": "CASO-HYO-046-4A", "partition": "2026-07-22", "source_keys": {"a", "b", "c"}, "target_keys": {"a", "b", "c"}, "second_run_changes": 0, "small_files": 2, "max_small_files": 5}
invalid = {"case_id": "CASO-HYO-046-4A", "partition": "all", "source_keys": {"a", "b", "c"}, "target_keys": {"a"}, "second_run_changes": 3, "small_files": 30, "max_small_files": 5}
incomplete = {**valid}
incomplete.pop("max_small_files")
print(* (assess(valid), assess(invalid), assess(incomplete)))
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
    ok = (
        record["source_keys"] == record["target_keys"]
        and record["second_run_changes"] == 0
        and record["small_files"] <= record["max_small_files"]
    )
    return "PASS" if ok else "REBUILD_PARTITION"

valid = {"case_id": "CASO-HYO-046-4A", "partition": "2026-07-22", "source_keys": {"a", "b", "c"}, "target_keys": {"a", "b", "c"}, "second_run_changes": 0, "small_files": 2, "max_small_files": 5}
invalid = {"case_id": "CASO-HYO-046-4A", "partition": "all", "source_keys": {"a", "b", "c"}, "target_keys": {"a"}, "second_run_changes": 3, "small_files": 30, "max_small_files": 5}
incomplete = {**valid}
incomplete.pop("max_small_files")
print(* (assess(valid), assess(invalid), assess(incomplete)))
` ,
          output: `PASS REBUILD_PARTITION MISSING:max_small_files` ,
        },
      },
      {
        id: "S46-T4-A-E3",
        subtopicId: "S46-T4-A",
        kind: "transfer",
        instruction: "S46-T4-A-E3 · CONTINUE / REBUILD_PARTITION / REVIEW_INCREMENTAL_KEY. Sin max_small_files se revisa la clave/límite; no rebuild automático.",
        hint: "Missing → REVIEW_INCREMENTAL_KEY; merge roto → REBUILD_PARTITION.",
        hints: [
          "REVIEW_INCREMENTAL_KEY es missing de diseño de clave; REBUILD es merge/higiene rota.",
          "CONTINUE solo con keys iguales, second_run_changes 0 y small_files bajo techo.",
        ],
        edgeCases: [
          "falta max_small_files → REVIEW_INCREMENTAL_KEY",
          "fixture adverso: re-run con delta → REBUILD_PARTITION",
          "eventos sintéticos CASO-HYO-046-4A (sin PII)",
        ],
        tests: "CONTINUE REBUILD_PARTITION REVIEW_INCREMENTAL_KEY.",
        feedback: "E3: REVIEW_INCREMENTAL_KEY es incertidumbre de diseño del merge; REBUILD es breach ya materializado.",
        starterCode: {
          language: 'python',
          title: "s46-t4-a-e3.py",
          code: `# CASO-HYO-046 · decide REBUILD_PARTITION
def decide(record: dict) -> str:
    required = {"case_id", "partition", "source_keys", "target_keys", "second_run_changes", "small_files", "max_small_files"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return (
        "CONTINUE"
        if record["source_keys"] != record["target_keys"] or record["second_run_changes"] > 0
        else "REBUILD_PARTITION"
    )

valid = {"case_id": "CASO-HYO-046-4A", "partition": "2026-07-22", "source_keys": {"a", "b", "c"}, "target_keys": {"a", "b", "c"}, "second_run_changes": 0, "small_files": 2, "max_small_files": 5}
invalid = {"case_id": "CASO-HYO-046-4A", "partition": "all", "source_keys": {"a", "b", "c"}, "target_keys": {"a"}, "second_run_changes": 3, "small_files": 30, "max_small_files": 5}
uncertain = {**valid}
uncertain.pop("max_small_files")
print(* [decide(item) for item in (valid, invalid, uncertain)])
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
    ok = (
        record["source_keys"] == record["target_keys"]
        and record["second_run_changes"] == 0
        and record["small_files"] <= record["max_small_files"]
    )
    return "CONTINUE" if ok else "REBUILD_PARTITION"

valid = {"case_id": "CASO-HYO-046-4A", "partition": "2026-07-22", "source_keys": {"a", "b", "c"}, "target_keys": {"a", "b", "c"}, "second_run_changes": 0, "small_files": 2, "max_small_files": 5}
invalid = {"case_id": "CASO-HYO-046-4A", "partition": "all", "source_keys": {"a", "b", "c"}, "target_keys": {"a"}, "second_run_changes": 3, "small_files": 30, "max_small_files": 5}
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
        instruction: "S46-T4-B-E1 · Ops en `CASO-HYO-046-4B`: freshness_sli≥freshness_slo, rto≤target_rto, postmortem_actions≥1 y owner. Starter invierte. Salida: `S46-T4-B PASS`.",
        hint: "SLI es la medida (≥ objetivo); RTO es tiempo de recuperación (≤ target).",
        hints: [
          "PASS si sli ≥ slo AND rto ≤ target_rto AND postmortem_actions ≥ 1 AND owner no vacío.",
          "postmortem_actions=0 o owner vacío fallan el simulacro.",
        ],
        edgeCases: [
          "falta owner → ACTIVATE_RECOVERY_RUNBOOK / MISSING",
          "fixture adverso: SLI bajo, RTO alto o sin acciones → DECLARE_DATA_INCIDENT",
          "eventos sintéticos CASO-HYO-046-4B (sin PII)",
        ],
        tests: "`S46-T4-B PASS`.",
        feedback: "E1: SLO de datos se demuestra con desigualdad SLI/SLO + RTO + dueño + acciones — no con un README.",
        starterCode: {
          language: 'python',
          title: "s46-t4-b-e1.py",
          code: `# CASO-HYO-046 · freshness SLI/SLO + RTO
record = {
    "case_id": "CASO-HYO-046-4B",
    "freshness_sli": 0.995,
    "freshness_slo": 0.99,
    "rto_minutes": 25,
    "target_rto_minutes": 30,
    "postmortem_actions": 3,
    "owner": "data-oncall",
}
meets_contract = record["freshness_sli"] < record["freshness_slo"] or record["rto_minutes"] > record["target_rto_minutes"]
status = "PASS" if meets_contract else "DECLARE_DATA_INCIDENT"
print("S46-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s46-t4-b-e1.py",
          code: `record = {
    "case_id": "CASO-HYO-046-4B",
    "freshness_sli": 0.995,
    "freshness_slo": 0.99,
    "rto_minutes": 25,
    "target_rto_minutes": 30,
    "postmortem_actions": 3,
    "owner": "data-oncall",
}
meets_contract = (
    record["freshness_sli"] >= record["freshness_slo"]
    and record["rto_minutes"] <= record["target_rto_minutes"]
    and record["postmortem_actions"] >= 1
    and bool(record["owner"])
)
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
        instruction: "S46-T4-B-E2 · PASS / DECLARE_DATA_INCIDENT / MISSING:owner. Adverso: sli=0.8, rto=90, actions=0.",
        hint: "Missing de owner antes de comparar SLI; el adverso falla por varios indicadores a la vez.",
        hints: [
          "Un solo indicador roto basta para DECLARE_DATA_INCIDENT (no esperes que fallen todos).",
          "DECLARE_DATA_INCIDENT si sli<slo o rto>target o actions<1 o owner vacío.",
        ],
        edgeCases: [
          "falta owner → MISSING:owner",
          "fixture adverso: SLI/RTO/acciones rotas → DECLARE_DATA_INCIDENT",
          "eventos sintéticos CASO-HYO-046-4B (sin PII)",
        ],
        tests: "`PASS DECLARE_DATA_INCIDENT MISSING:owner`.",
        feedback: "E2: el incidente se declara por evidencia numérica, no por sensación de “anda lento”.",
        starterCode: {
          language: 'python',
          title: "s46-t4-b-e2.py",
          code: `# CASO-HYO-046 · assess DECLARE_DATA_INCIDENT
def assess(record: dict) -> str:
    required = {"case_id", "freshness_sli", "freshness_slo", "rto_minutes", "target_rto_minutes", "postmortem_actions", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return (
        "PASS"
        if record["freshness_sli"] < record["freshness_slo"] or record["rto_minutes"] > record["target_rto_minutes"]
        else "DECLARE_DATA_INCIDENT"
    )

valid = {"case_id": "CASO-HYO-046-4B", "freshness_sli": 0.995, "freshness_slo": 0.99, "rto_minutes": 25, "target_rto_minutes": 30, "postmortem_actions": 3, "owner": "data-oncall"}
invalid = {"case_id": "CASO-HYO-046-4B", "freshness_sli": 0.8, "freshness_slo": 0.99, "rto_minutes": 90, "target_rto_minutes": 30, "postmortem_actions": 0, "owner": ""}
incomplete = {**valid}
incomplete.pop("owner")
print(* (assess(valid), assess(invalid), assess(incomplete)))
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
    ok = (
        record["freshness_sli"] >= record["freshness_slo"]
        and record["rto_minutes"] <= record["target_rto_minutes"]
        and record["postmortem_actions"] >= 1
        and bool(record["owner"])
    )
    return "PASS" if ok else "DECLARE_DATA_INCIDENT"

valid = {"case_id": "CASO-HYO-046-4B", "freshness_sli": 0.995, "freshness_slo": 0.99, "rto_minutes": 25, "target_rto_minutes": 30, "postmortem_actions": 3, "owner": "data-oncall"}
invalid = {"case_id": "CASO-HYO-046-4B", "freshness_sli": 0.8, "freshness_slo": 0.99, "rto_minutes": 90, "target_rto_minutes": 30, "postmortem_actions": 0, "owner": ""}
incomplete = {**valid}
incomplete.pop("owner")
print(* (assess(valid), assess(invalid), assess(incomplete)))
` ,
          output: `PASS DECLARE_DATA_INCIDENT MISSING:owner` ,
        },
      },
      {
        id: "S46-T4-B-E3",
        subtopicId: "S46-T4-B",
        kind: "transfer",
        instruction: "S46-T4-B-E3 · CONTINUE / DECLARE_DATA_INCIDENT / ACTIVATE_RECOVERY_RUNBOOK. Sin owner se activa runbook; no declares incidente vacío de ownership.",
        hint: "Missing → ACTIVATE_RECOVERY_RUNBOOK; métricas rotas → DECLARE_DATA_INCIDENT.",
        hints: [
          "ACTIVATE_RECOVERY_RUNBOOK solo por missing de owner; SLI/RTO bajos son DECLARE_DATA_INCIDENT.",
          "CONTINUE solo si SLI, RTO, acciones y owner cumplen el simulacro.",
        ],
        edgeCases: [
          "falta owner → ACTIVATE_RECOVERY_RUNBOOK",
          "fixture adverso: SLI/RTO fallidos → DECLARE_DATA_INCIDENT",
          "eventos sintéticos CASO-HYO-046-4B (sin PII)",
        ],
        tests: "CONTINUE DECLARE_DATA_INCIDENT ACTIVATE_RECOVERY_RUNBOOK.",
        feedback: "E3: el runbook es la respuesta a incertidumbre operativa; el incidente asume que ya hay owner y métricas.",
        starterCode: {
          language: 'python',
          title: "s46-t4-b-e3.py",
          code: `# CASO-HYO-046 · decide DECLARE_DATA_INCIDENT
def decide(record: dict) -> str:
    required = {"case_id", "freshness_sli", "freshness_slo", "rto_minutes", "target_rto_minutes", "postmortem_actions", "owner"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return (
        "CONTINUE"
        if record["freshness_sli"] < record["freshness_slo"] or record["rto_minutes"] > record["target_rto_minutes"]
        else "DECLARE_DATA_INCIDENT"
    )

valid = {"case_id": "CASO-HYO-046-4B", "freshness_sli": 0.995, "freshness_slo": 0.99, "rto_minutes": 25, "target_rto_minutes": 30, "postmortem_actions": 3, "owner": "data-oncall"}
invalid = {"case_id": "CASO-HYO-046-4B", "freshness_sli": 0.8, "freshness_slo": 0.99, "rto_minutes": 90, "target_rto_minutes": 30, "postmortem_actions": 0, "owner": ""}
uncertain = {**valid}
uncertain.pop("owner")
print(* [decide(item) for item in (valid, invalid, uncertain)])
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
    ok = (
        record["freshness_sli"] >= record["freshness_slo"]
        and record["rto_minutes"] <= record["target_rto_minutes"]
        and record["postmortem_actions"] >= 1
        and bool(record["owner"])
    )
    return "CONTINUE" if ok else "DECLARE_DATA_INCIDENT"

valid = {"case_id": "CASO-HYO-046-4B", "freshness_sli": 0.995, "freshness_slo": 0.99, "rto_minutes": 25, "target_rto_minutes": 30, "postmortem_actions": 3, "owner": "data-oncall"}
invalid = {"case_id": "CASO-HYO-046-4B", "freshness_sli": 0.8, "freshness_slo": 0.99, "rto_minutes": 90, "target_rto_minutes": 30, "postmortem_actions": 0, "owner": ""}
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
    title: "Pipeline incremental Huancayo (CASO-HYO-046)",
    context: "Construye un mini-pipeline de producción sobre eventos sintéticos de atención en Huancayo. Entrada: lista de eventos con event_id, event_time y payload. Debes clasificar late data, upsertar una partición sin duplicar reintentos, registrar lineage y emitir tokens fail-closed. No uses servicios externos ni PII real. Vocabulario de acción alineado a weDo: breach → `QUARANTINE_DATASET`; incertidumbre de ownership/calidad → `OPEN_QUALITY_INCIDENT`.",
    objectives: [
      "Clasificar cada evento como ON_TIME / ALLOWED_LATE / LATE / OUT_OF_WINDOW con watermark y allowed_lateness.",
      "Upsertar partición por event_id demostrando second_run_changes == 0 en reintento del mismo batch.",
      "Validar un DAG acíclico de assets y un plan de backfill sin solape.",
      "Emitir PASS / QUARANTINE_DATASET / OPEN_QUALITY_INCIDENT según contrato, freshness y owner.",
      "Registrar lineage run→inputs→outputs y un runbook de recovery con RTO medido.",
    ],
    requirements: [
      "Usa exclusivamente fixtures sintéticos `CASO-HYO-046`.",
      "Implementa `classify_event`, `merge_incremental`, `is_acyclic`, `backfill_ok`, `lineage_facet` y `ops_status` (o equivalentes claros).",
      "Caso normal: batch limpio → estado OK y second_run_changes 0.",
      "Caso breach: schema drift o late sin política → `QUARANTINE_DATASET` (no silenciar).",
      "Caso incierto: falta owner o lineage → `OPEN_QUALITY_INCIDENT` o `PAGE_DATA_OWNER` según tu diseño documentado.",
      "Incluye print de evidencia: labels de eventos, changes del merge, acyclic bool, status final.",
      "Documenta en comentarios: riesgo residual, responsable, criterio de rollback y límites (stdlib only).",
    ],
    starterCode: `CASE_ID = "CASO-HYO-046"
EVENTS = [
    {"event_id": "e1", "event_time": 100, "payload": 1},
    {"event_id": "e1", "event_time": 100, "payload": 1},  # reintento
    {"event_id": "e2", "event_time": 80, "payload": 2},   # late vs wm
    {"event_id": "e3", "event_time": 115, "payload": 3},
]
WINDOW_END = 120
WATERMARK = 100
ALLOWED_LATENESS = 15
NODES = {"raw", "clean", "report"}
EDGES = {("raw", "clean"), ("clean", "report")}
BACKFILL_INTERVALS = [[9, 12], [12, 15]]  # sin solape
CHECKPOINT = "cp-hyo-46"
RESUME_FROM = "cp-hyo-46"

def classify_event(et: int) -> str:
    # TODO: ON_TIME / ALLOWED_LATE / LATE / OUT_OF_WINDOW (usa WATERMARK + ALLOWED_LATENESS)
    return "TODO"

def merge_incremental(target: dict, rows: list) -> int:
    # TODO: upsert por event_id; devolver número de cambios
    return -1

def is_acyclic(nodes: set, edges: set) -> bool:
    # TODO: Kahn o DFS; rechazar ciclos A→B→A
    return False

def backfill_ok(intervals: list, checkpoint: str, resume_from: str) -> bool:
    # TODO: sin solape y resume_from == checkpoint
    return False

def lineage_facet(run_id: str, inputs: set, outputs: set, null_rate: float, owner: str) -> dict:
    # TODO: facet run/inputs/outputs/null_rate/owner
    return {}

def ops_status(schema_ok: bool, lag_min: int, slo_min: int, owner: str) -> str:
    # TODO: PASS | QUARANTINE_DATASET | OPEN_QUALITY_INCIDENT / PAGE_DATA_OWNER
    return "TODO"

sink = {}
labels = [classify_event(e["event_time"]) for e in EVENTS]
# Solo ON_TIME / ALLOWED_LATE entran al merge; LATE/OUT_OF_WINDOW → side-output (no silent accept)
accepted = [
    e for e, lab in zip(EVENTS, labels)
    if lab in {"ON_TIME", "ALLOWED_LATE"}
]
batch = [{"event_id": e["event_id"], "payload": e["payload"]} for e in accepted]
# Dedup de reintentos: un event_id solo una vez en el batch de merge
seen_ids: set = set()
unique_batch = []
for row in batch:
    if row["event_id"] in seen_ids:
        continue
    seen_ids.add(row["event_id"])
    unique_batch.append(row)
c1 = merge_incremental(sink, unique_batch)
c2 = merge_incremental(sink, unique_batch)  # re-run del mismo batch → 0 cambios
facet = lineage_facet("run-hyo-46", {"raw-v2"}, {"clean-v3"}, 0.01, "analytics")
print(CASE_ID)
print("labels", labels)
print("accepted_ids", [r["event_id"] for r in unique_batch])
print("changes", c1, c2)
print("acyclic", is_acyclic(NODES, EDGES))
print("backfill", backfill_ok(BACKFILL_INTERVALS, CHECKPOINT, RESUME_FROM))
print("lineage", facet)
print("ops", ops_status(True, 8, 15, "data-ops"))
print("ops_breach", ops_status(False, 80, 15, "data-ops"))
print("ops_uncertain", ops_status(True, 8, 15, ""))
`,
    portfolioNote: "Evidencia de CP-N4-B: baseline de eventos, decisión por etiqueta, merge idempotente, DAG acíclico, tokens de breach/incertidumbre, rollback y riesgo residual. No conviertas el scaffold en checklist de booleans: las funciones deben calcular.",
    rubric: [
      { criterion: "Correctitud de event-time/watermark y late policy", weight: "25%" },
      { criterion: "Merge idempotente y prueba second-run cero cambios", weight: "20%" },
      { criterion: "DAG acíclico + backfill/recovery razonados", weight: "15%" },
      { criterion: "Contratos, lineage, freshness y tokens fail-closed", weight: "20%" },
      { criterion: "Reproducibilidad stdlib y evidencia legible", weight: "10%" },
      { criterion: "Trade-offs (completeness vs latencia, costo de backfill)", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "En un pipeline de streaming, ¿qué mide el event time frente al processing time?",
        options: [
          "Event time es el reloj del worker; processing time es cuándo ocurrió el hecho",
          "Event time es cuándo ocurrió el hecho en el mundo; processing time es cuándo lo procesó el worker",
          "Son sinónimos si el watermark es cero",
          "Processing time solo existe en batch; event time solo en stream",
        ],
        correctIndex: 1,
        explanation: "Event time ancla la corrección de negocio; processing time solo describe la latencia del sistema. Las ventanas y watermarks se definen sobre event time.",
      },
      {
        question: "Si el schema observado de una partición de CASO-HYO-046 no coincide con el contrato, ¿qué respuesta fail-closed es correcta en esta sección?",
        options: [
          "continuar y ocultar el warning",
          "inventar la columna faltante con nulls",
          "borrar el trace para reducir ruido",
          "emitir QUARANTINE_DATASET y conservar evidencia",
        ],
        correctIndex: 3,
        explanation: "El vocabulario operativo de S46 usa QUARANTINE_DATASET ante breach de contrato/freshness. No se publica basura ni se inventa evidencia.",
      },
      {
        question: "En operación de datos, ¿qué diferencia un SLI de un SLO de frescura?",
        options: [
          "SLI y SLO son sinónimos del mismo porcentaje de uptime del cluster",
          "SLI es la medición (p. ej. proporción de particiones frescas); SLO es el objetivo acordado (p. ej. ≥ 0.99)",
          "SLO se mide en el worker; SLI solo aplica a batch nocturno",
          "Si el schema del contrato pasa, el SLI de frescura se ignora",
        ],
        correctIndex: 1,
        explanation: "SLI = indicador medido; SLO = umbral de servicio. Un schema correcto con dato de ayer sigue siendo breach de frescura si el SLI cae bajo el SLO.",
      },
      {
        question: "Watermark t = 110 y allowed_lateness = 5. Un evento con event_time = 100 se evalúa como…",
        options: [
          "siempre ON_TIME porque 100 < window_end típico",
          "LATE (o side-output) si 110 − 100 > 5; ALLOWED_LATE si la gracia alcanza",
          "OUT_OF_WINDOW porque es menor que el watermark",
          "processing-time error: hay que ignorar event_time",
        ],
        correctIndex: 1,
        explanation: "Late = el watermark ya superó el timestamp del evento. Allowed lateness es gracia post-watermark (completeness vs latencia), no un bound inferior arbitrario.",
      },
      {
        question: "Un grafo raw→clean→raw con typed_io=True debe…",
        options: [
          "aprobarse porque no hay self-loops a==b",
          "aprobarse si los nodos están declarados",
          "rechazarse: hay un ciclo y no existe orden topológico",
          "convertirse en schedule horario para “romper el ciclo”",
        ],
        correctIndex: 2,
        explanation: "Acíclico requiere detección de ciclos (p. ej. Kahn). Self-loop no es el único fallo: A→B→A también invalida el DAG.",
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
        label: "Flink — Event Time concepts",
        url: "https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time/",
        note: "Event time vs processing time y watermarks",
      },
      {
        label: "Apache Airflow",
        url: "https://airflow.apache.org/docs/",
        note: "DAGs, scheduling y backfills",
      },
      {
        label: "Dagster software-defined assets",
        url: "https://docs.dagster.io/concepts/assets/software-defined-assets",
        note: "Assets y dependencias tipadas",
      },
      {
        label: "OpenLineage",
        url: "https://openlineage.io/docs/",
        note: "Modelo de lineage de jobs/datasets/runs",
      },
      {
        label: "dbt docs — incremental models",
        url: "https://docs.getdbt.com/docs/build/incremental-models",
        note: "Cargas incrementales y merge keys",
      },
      {
        label: "Great Expectations",
        url: "https://docs.greatexpectations.io/",
        note: "Data contracts y validaciones",
      },
      {
        label: "SRE workbook — monitoring",
        url: "https://sre.google/workbook/monitoring/",
        note: "SLO de freshness y alertas",
      },
      {
        label: "Prefect docs",
        url: "https://docs.prefect.io/",
        note: "Workflow orchestration alternativa",
      },
      {
        label: "Spark Structured Streaming",
        url: "https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html",
        note: "Stream processing conceptual",
      },
    ],
    books: [
      { label: "Designing Data-Intensive Applications", note: "Streams, ventanas y storage" },
      { label: "Fundamentals of Data Engineering", note: "Pipelines, ownership y SLO de datos" },
    ],
    courses: [
      { label: "deeplearning.ai Data Engineering Specialization", url: "https://www.deeplearning.ai/specializations/data-engineering", note: "Pipelines y contratos" },
      { label: "Stanford CS246 Mining Massive Data Sets", url: "http://web.stanford.edu/class/cs246/", note: "Large-scale data processing" },
      { label: "Coursera Data Engineering", url: "https://www.coursera.org/courses?query=data%20engineering", note: "DE MOOCs" },
      { label: "MIT 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables" },
      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Tests y proyectos reproducibles" },
      { label: "Py4E", url: "https://www.py4e.com", note: "Stdlib-first progressive disclosure" },
    ],
  },
}
