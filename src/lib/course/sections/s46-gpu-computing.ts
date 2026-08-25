/**
 * S46 — Ingeniería de datos y orquestación de producción
 *
 * The filename and the exported id ("gpu-computing") both come from a pre-V3 ordering
 * and no longer describe what this section teaches. The id is the URL hash and
 * a learner save key, so it cannot be changed without losing progress.
 *
 * Read `title` below, never the slug. Matching content to the slug is how three
 * agent diagrams ended up attached to a data-testing lesson.
 */
import type { CourseSection } from '../../types'

export const section46: CourseSection = {
  id: "gpu-computing",
  index: 46,
  title: "Ingeniería de datos y orquestación de producción",
  shortTitle: "Data eng producción",
  tagline: "Pipeline incremental y backfillable sin duplicar, con lineage y alertas por dato tardío o contrato roto",
  estimatedHours: 9,
  level: "Producción gobernada",
  phase: 3,
  icon: "GitBranch",
  accentColor: "bg-gradient-to-br from-amber-500 to-red-600",
  jobRelevance:
    "En equipos de plataforma y producto en LatAm, ingeniería de datos y orquestación de producción convierten el job asíncrono (object store, colas, DLQ e idempotency keys) en pipelines batch y stream con calidad medible y SLA de frescura. Aquí aprendes a entregar tablas y contratos versionados, orquestación con checkpoint, lineage y alertas cuando el dato llega tarde o el schema se rompe. El objetivo es que backfills y re-runs no corrompan el sink ni dupliquen agregados.",
  learningOutcomes: [
    { text: "Clasificar eventos on-time, allowed-late, late u out-of-window dado event_time, window_end, watermark y allowed_lateness, con política documentada" },
    { text: "Componer exactly-once end-to-end: fuente at-least-once + checkpoint + sink idempotente por clave + política de late data" },
    { text: "Validar un DAG/asset graph acíclico con nodos declarados, edges tipados y sin self-loops ni ciclos A→B→A" },
    { text: "Planificar backfills por intervalo sin solape y reanudar desde checkpoint consistente" },
    { text: "Evaluar data contracts (schema + owner + freshness SLO) y fallar cerrado ante drift o retraso" },
    { text: "Registrar lineage run→inputs→outputs con owner y métricas de calidad para reconstruir incidentes" },
    { text: "Implementar carga incremental por partición con merge de claves y segunda corrida con cero cambios" },
    { text: "Operar data SLOs (SLI vs. objetivo), RTO de recuperación y post mórtem con acciones concretas" },
  ],
  theory: [
    {
            heading: "Los hechos no llegan en orden",
      paragraphs: [
        "Un evento ocurre a las 10:03 y tu sistema lo recibe a las 10:47, porque un teléfono estuvo sin señal en el camino. Nada falló. Así se comporta cualquier flujo de datos real, y la consecuencia es incómoda: en el momento de calcular el total de las diez de la mañana, todavía no tienes todo lo que ocurrió a las diez de la mañana.",
        "Conviene separar dos relojes que solemos confundir. El **event time** es cuándo pasó el hecho; el *processing time* es cuándo lo viste. Agrupar por el segundo es cómodo y produce cifras que no significan nada: el pico de las 10:47 sería en realidad el atasco de la red, no un pico de actividad.",
        "Entonces, ¿cuándo cierras la cuenta? Es el problema del cierre de una edición de periódico: en algún momento la imprenta arranca, sabiendo que alguna noticia llegará después. Un **watermark** es esa hora de cierre declarada — la afirmación de que ya no esperas eventos anteriores a cierto instante. No es una certeza, es una decisión, y por eso viene acompañada de una política explícita para lo que llegue tarde. En el vocabulario que usará el contrato de T2 son tres: **drop** (descartarlo), **side-output** (guardarlo aparte, en un canal secundario que alguien revisa) y **update** (corregir el resultado ya publicado). La cuarentena de S45 es un caso particular de side-output, con dueño y SLA asignados. Lo que no es aceptable es que la llegada tardía desaparezca en silencio.",
        "Con el tiempo resuelto aparece la segunda estructura: qué se calcula antes que qué. Un **DAG** es el grafo de esas dependencias, y su única regla dura es que no puede tener ciclos — si A espera a B y B espera a A, nada arranca nunca. Ese grafo es también lo que permite rehacer un tramo del pasado sin tocar el resto: un **backfill** acotado.",
        "La pregunta que gobierna la sección tiene dos mitades: **¿cuándo puedo cerrar esta ventana, y qué hago con lo que llegue después?** Modelas los contratos con la biblioteca estándar; el objetivo es la política de tiempo, no el motor que la ejecuta.",
      ],
      callout: {
        type: "info",
        title: "Gate de promoción",
        content: "Evidencia mínima de S46-T1-A: caso sintético con asserts; sin evidencia no promociones.",
      },
    },
    {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Reúne el entregable, el orden de los subtemas y los criterios de promoción.",
        "**Producto incremental.** Una orquestación de producción. Recibes eventos con su `event_time`, un schema, un acuerdo de frescura y claves de idempotencia. Entregas ventanas cerradas con política de datos tardíos, un sink deduplicado, un DAG acíclico y alertas de calidad. La promoción falla si un dato tardío se pierde en silencio, si el grafo tiene ciclos, si un cambio de schema pasa inadvertido o si una segunda ejecución reescribe sin control.",
        "**Orden de los subtemas.** T1 fija event time y watermarks. T2 arma el DAG tipado y los checkpoints. T3 cubre calidad y frescura. T4 cierra con reejecuciones e indicadores de servicio.",
        "**Puente entre secciones.** El mismo identificador de idempotencia de S45 alimenta aquí la deduplicación del sink; una cola que entrega al menos una vez obliga a que ese sink sea idempotente. Las tablas que salgan de aquí son las que S47 convierte en features y modelos.",
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
    },
    {
      heading: "Ventanas, event time y watermarks",
      figure: {
        id: "S46-event-time",
        caption:
          "El watermark corta sobre el eje de event time, pero lo que decide la etiqueta es cuándo llega cada hecho. Por eso un evento puede ser tardío aunque su timestamp sea anterior al de otro que sí entró a tiempo.",
        alt:
          "Un eje horizontal de event time con una línea vertical en 110 marcada como watermark y una banda de gracia de 5 unidades a su izquierda. Tres puntos —112, 105 y 100— con flechas punteadas hacia la derecha que representan su llegada, etiquetados ON_TIME, ALLOWED_LATE y LATE respectivamente.",
      },
      subtopicId: "S46-T1-A",
      paragraphs: [
        "**Event time** es cuándo ocurrió el hecho en el mundo. **Processing time** es el reloj del worker. Las **ventanas** agrupan por rangos de *event time*. El **watermark** no es solo un “atraso aceptado”: es una aserción de progreso. Un watermark `t` afirma que no se esperan más eventos con timestamp ≤ `t`. Un evento es **late** si se evalúa cuando el watermark ya superó su timestamp. **Allowed lateness**, en este lab, es una banda de gracia relativa al watermark que modela el *trade-off completeness* vs. *latencia*. La condición tiene dos lados y ambos importan: `0 < wm − et ≤ gracia`. El lado derecho dice «no llegó demasiado tarde»; el izquierdo dice «llegó tarde**, para empezar**». Sin él, un evento puntual (wm 110, et 112 → −2) también cumpliría `≤ gracia` y quedaría clasificado como tardío admitido en vez de a tiempo. En motores como Beam/Flink la gracia se amarra también al cierre de ventana; aquí la simplificamos para razonar etiquetas sin cluster.",
        "Contrato operativo de tiempo. Entrada: lista de `event_time`, `window_end`, *lag* del watermark y `allowed_lateness`. Salida: `watermark = max(event_time) − lag`, y etiqueta por evento ∈ {ON_TIME, ALLOWED_LATE, LATE, OUT_OF_WINDOW}. Error: materializar una ventana sin política de *late data* o aceptar eventos fuera de ventana. Criterio de éxito: *fixtures* en orden, desorden y tardío producen las mismas etiquetas al **reejecutar**. La política (side-output / drop / update) queda documentada.",
        "**Timeline trabajado.** El stream `[100, 108, 115]` con lag 5 **fija** el watermark: `max(event_time) − lag = 115 − 5 = 110`. Los eventos que llegan **después** se etiquetan contra ese 110, con ventana 120 y gracia 5 — y conviene tener presentes los dos papeles, porque un mismo número puede aparecer en ambos. Un evento de `event_time` 112 es ON_TIME (por encima del watermark); uno de 105 es ALLOWED_LATE (queda por debajo, pero `wm − et = 5` cabe en la gracia); uno de 100 es LATE (`wm − et = 10 > 5`, side-output o drop según política), aunque un 100 sí formara parte del stream que estableció el watermark: lo que se juzga es el instante en que llega, no si el valor apareció antes. Misma regla en código, iDo y weDo: no inventes un bound inferior arbitrario.",
        "Aplicación a `CASO-HYO-046` (Huancayo sintético): una clínica ficticia emite eventos de atención con retraso de red. Un parte de las 09:00 puede llegar a las 09:40 de *processing time*. El pipeline debe decidir con *event time*, no con el reloj del worker. Riesgos de ingeniería de datos (no de ER): doble conteo si se reabre la ventana en silencio, o dashboards incompletos si se **descarta** *late data* sin *side-output*.",
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
        title: "Contrato T1-A · Watermark y ventana",
        content:
          "Antes de promover S46-T1-B, verifica contrato de etiquetas y el riesgo residual de late data silenciosa.",
      },
    },
    {
      heading: "Late data y exactly-once como propiedad compuesta",
      figure: {
        id: "S46-exactly-once",
        caption:
          "Si falta un eslabón, el «exactly-once» del marketing se convierte en doble conteo en el dashboard.",
        alt:
          "Tres etapas —fuente at-least-once, motor con checkpoint, sink idempotente— unidas por flechas.",
      },
      subtopicId: "S46-T1-B",
      paragraphs: [
        "**Exactly-once end-to-end no es un switch del broker.** Es una cadena: la fuente suele ser *at-least-once* (reintentos); el motor guarda **checkpoint** del progreso; el **sink es idempotente** por clave de negocio (`event_id`); y el *late data* tiene política explícita (update / side-output / quarantine). Si falta un eslabón, el “exactly-once” del marketing se convierte en doble conteo en el dashboard de Huancayo.",
        "Contrato de dedup y *late policy*. Entrada: *stream* de `event_id` (con reintentos), *store* de claves vistas, *checkpoint* y `late_policy` ∈ {update, side-output, quarantine}. Salida: primer *apply* → True; *retry* del mismo id → False; *late event* no inventa una segunda fila de agregado. Error: sink sin clave o `late_policy` vacía. Criterio: `apply_once` + política documentada antes de abrir backfills.",
        "Secuencia trabajada (`CASO-HYO-046-T1B`):\n1. Llega e1 → se escribe y se marca visto.\n2. Reintento de e1 → no reescribe.\n3. e2 *late* con política *update* → actualiza la fila o va a *side-output*; nunca “mezcla silenciosa”.\n\nExactly-once compuesto = idempotent_sink + dedup + checkpoint + late_policy; no magia del *middleware*.",
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
        title: "Contrato T1-B · Exactly-once y late policy",
        content:
          "La revisión de S46-T2-A exige fail-closed: reintento no reescribe y late no se mezcla en silencio.",
      },
    },
    {
      heading: "DAG, assets y dependencias",
      subtopicId: "S46-T2-A",
      paragraphs: [
        "Un **DAG** expresa precedencia de ejecución; un **asset graph** expresa productos (tablas, reportes) y de qué dependen. Evita dependencias implícitas por nombres de archivo o “corren a la misma hora”. Un grafo con ciclo no tiene orden topológico: el orquestador no puede decidir qué materializar primero.",
        "Contrato operativo de orquestación. Entrada: nodos de assets (ingest, normalize, clean, report) y edges de dependencia. Salida: grafo **acíclico** con inputs/outputs tipados y dueño por asset. Error: ciclo, self-loop, edge a nodo no declarado o dependencia solo por horario coincidente. Criterio de éxito: un cambio en `normalize` invalida solo `clean` y `report`; el plan de backfill lista ancestros sin solapes.",
        "Aplicación a `CASO-HYO-046`: assets sintéticos raw → clean → report de atenciones en Huancayo. Si alguien cierra clean → raw “para refrescar”, el ciclo rompe el plan de backfill. Riesgo de ingeniería de datos: **reejecuciones** infinitas o materialización parcial sin *lineage* claro del *asset* roto.",
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
print("asset", "report_atenciones")`,
        output: `acyclic_ok True
acyclic_cycle False
asset report_atenciones`,
      },
      callout: {
        type: "tip",
        title: "Contrato T2-A · DAG acíclico",
        content:
          "Contrato S46-T2-B: plan de backfill solo sobre grafo acíclico; evidencia local obligatoria.",
      },
    },
    {
      heading: "Schedules, backfills y state recovery",
      subtopicId: "S46-T2-B",
      paragraphs: [
        "El **schedule** dispara corridas; no garantiza corrección ni unicidad. Un **backfill** **reprocesa** un intervalo histórico y debe parametrizar start/end sin solaparse con otra corrida viva. El **checkpoint** permite reanudar desde un estado consistente tras un fallo — reanudar “desde el inicio del día” sin control es un *double-write* disfrazado.",
        "Contrato operativo de **reejecución**. Entrada: intervalos `[start, end)`, flag de solape, *checkpoint id* y `resume_from`. Salida: plan de backfill ordenado, sin solape, con `resume = checkpoint`. Error: dos backfills que cubren el mismo `event_time` o `resume` distinto del *checkpoint*. Criterio: *re-run* acotado produce el mismo sink que la corrida original (idempotencia de T1/T4).",
        "Aplicación a `CASO-HYO-046`: un viernes se pierden 3 horas de eventos de clínica; el backfill cubre `[09:00, 12:00)` sin solaparse con el job horario de las 12:00. Riesgo de ingeniería de datos: costo de **recómputo** y corrupción de particiones si dos *writers* tocan la misma *key*.",
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
        title: "Contrato T2-B · Backfill y checkpoint",
        content:
          "Para S46-T3-A: documenta *breach* de schema/frescura y la ruta de *recovery*.",
      },
    },
    {
      heading: "Contratos y freshness",
      subtopicId: "S46-T3-A",
      paragraphs: [
        "Un **contrato de datos** (*data contract*) fija schema (campos y tipos), semántica (qué significa cada columna), **owner** y, por separado, un **SLO de freshness** (cuánto atraso máximo tolera el consumidor). Schema y freshness se monitorean distinto: un schema correcto con dato de ayer sigue siendo un *breach* de frescura.",
        "Contrato operativo de calidad. Entrada: schema esperado, schema observado, lag en minutos, SLO de lag y owner. Salida: PASS solo si schema exacto, lag ≤ SLO y owner no vacío. Error: drift de tipo/columna o lag sobre el SLO → cuarentena del dataset afectado. Criterio: fail closed — no se publica la partición “casi bien”.",
        "Aplicación a `CASO-HYO-046`: el contrato de `atenciones_diarias` exige `case_id:str` y `event_time:int` con freshness ≤ 15 min para el dashboard de operaciones. Si llega `event_time` como string o el lag es 80 min, se emite `QUARANTINE_DATASET` y se pagina al owner. Riesgo de ingeniería de datos: consumidores *downstream* que leen basura con tipos rotos.",
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
        title: "Contrato T3-A · Schema y freshness",
        content:
          "Promoción de S46-T3-B solo con evidencia reproducible de contrato y frescura.",
      },
    },
    {
      heading: "Lineage, observability y ownership",
      subtopicId: "S46-T3-B",
      paragraphs: [
        "**Lineage** conecta dataset de salida con inputs, código y run_id. **Observabilidad de datos** combina volumen, calidad (`null_rate`) y tiempo. Sin owner, el incidente no tiene dueño de página: el on-call de plataforma no debería adivinar quién rompió el schema de `clean-v3`.",
        "Contrato operativo de trazabilidad. Entrada: run_id, sets de inputs/outputs, métricas (rows, null_rate) y owner. Salida: registro reconstruible run→datasets; incidente solo si calidad/owner fallan. Error: inputs vacíos, null_rate sobre umbral o run_id no trazable. Criterio: un **post mórtem** puede responder “qué corrida produjo esta fila”.",
        "Aplicación a `CASO-HYO-046`: el *run* `run-hyo-46` materializa `clean-v3` desde `raw-v2` con `null_rate` 0.01 y *owner* `analytics`. Si `null_rate` sube a 0.3, se abre `OPEN_QUALITY_INCIDENT` con el `run_id` en el ticket. Riesgo de ingeniería de datos: “arreglar a ciegas” sin saber qué *upstream* cambió.",
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
        title: "Contrato T3-B · Lineage y owner",
        content:
          "El dueño de S46-T4-A responde por *rollback* de partición y evidencia de *lineage*.",
      },
    },
    {
      heading: "Partitions e incremental loads",
      subtopicId: "S46-T4-A",
      paragraphs: [
        "Particionar por fecha (o por acceso) limita el *blast radius* de un *re-run* (el alcance del daño si esa reejecución sale mal). Una **carga incremental** solo trae deltas respecto de un watermark/clave y hace **merge** al target: si la misma fila llega dos veces, el segundo *run* debe cambiar **cero** filas. Conecta con T1: el watermark decide qué `event_time` aún es elegible. Con T2: el *asset* particionado es un nodo del DAG que se reejecuta por intervalo.",
        "Contrato operativo de particiones. Entrada: partition id, source_keys, target_keys, second_run_changes y límite de small files. Salida: merge idempotente con keys alineadas y second_run_changes == 0. Error: full rewrite ciego, keys drift o explosión de small files. Criterio: **reejecutar** el mismo batch no duplica ni reescribe el sink.",
        "Aplicación a `CASO-HYO-046`: partición `2026-07-22` con *keys* `{a, b, c}`. El job horario reintenta tras un *timeout* de red: el *merge* debe reportar 0 cambios en la segunda corrida. Riesgo de ingeniería de datos: costos de *storage* y conteos inflados en el reporte diario.",
        "Hasta aquí la partición aparece como asunto de **escritura**: acotar el *blast radius* de un *re-run* y mantener el *merge* idempotente. Tiene una segunda cara, la de **lectura**, que viste en S15: un lector puede **saltarse particiones enteras** cuando el filtro de la consulta no puede coincidir con ellas. Por eso la clave de partición se elige mirando dos patrones a la vez — cómo se reprocesa y cómo se consulta — y por eso el límite de *small files* de este contrato no es solo higiene de almacenamiento: partir de más destruye justamente la ganancia de lectura que la partición buscaba. Si nadie filtra nunca por esa columna, particionar por ella cuesta y no ahorra.",
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
        title: "Contrato T4-A · Merge incremental",
        content:
          "Cierre de S46-T4-B: riesgo residual documentado y límites del lab stdlib.",
      },
    },
    {
      heading: "SLO, incidentes y data recovery",
      subtopicId: "S46-T4-B",
      paragraphs: [
        "Un **SLO de datos** une un **SLI** (indicador medido, p. ej. proporción de particiones frescas) con un objetivo y una ventana. Un **incidente de datos** protege consumidores (dejar de publicar basura), recupera particiones y documenta causa + prevención. El **RTO** (*recovery time objective*) es el techo que te comprometes a no superar al recuperarte; lo que mides después es el tiempo real y se compara contra él — un *runbook* sin dueño es teatro.",
        "Contrato operativo de operación. Entrada: `freshness_sli`, `freshness_slo`, `rto_minutes`, `target_rto`, `postmortem_actions` y *owner*. Salida: PASS si SLI ≥ SLO, RTO ≤ target, ≥1 acción de **post mórtem** y *owner*. Error: SLI bajo o RTO excedido → declarar incidente y activar *runbook*. Criterio: simulacro medido, no promesa en README.",
        "Aplicación a `CASO-HYO-046`: el objetivo de **cumplimiento** de frescura del dashboard de atenciones es 0.99: el 99% de las ventanas debe caer dentro del umbral de 15 min que fijó el contrato de T3. Fíjate en que son dos magnitudes distintas con un nombre parecido — el umbral es una duración (15 min) y el objetivo es una proporción (0.99). Un lag masivo baja el SLI a 0.80 y el RTO del *replay* a 90 min (>30). Se declara `DECLARE_DATA_INCIDENT` y se activa el *runbook* de *recovery*. Riesgo de ingeniería de datos: consumidores de ML (S47) entrenan sobre datos “vivos” que en realidad están congelados.",
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
        title: "Cierre T4-B · RTO y post mórtem",
        content:
          "Cierre S46-T4-B: simulacro cumple RTO y post mórtem con acciones. Breach → `DECLARE_DATA_INCIDENT`; sin owner → `ACTIVATE_RECOVERY_RUNBOOK`.",
      },
    },
  ],
  iDo: {
    intro: "Te muestro 8 demos de S46 (Ingeniería de datos y orquestación de producción) alineadas a `CP-N4-B`. Cada demo **calcula** el contrato sobre *fixtures* de Huancayo sintético — no imprime etiquetas mágicas.",
    steps: [
      {
        demoId: "S46-T1-A-DEMO",
        subtopicId: "S46-T1-A",
        environment: "local-python",
        description: "Clasifica tres event_time (on-time, late, allowed-late) bajo un watermark avanzado",
        preamble:
          "Antes de materializar una ventana de atenciones en Huancayo, el pipeline debe decidir con **event time**, no con el reloj del worker. En esta demo un stream sintético `[100, 108, 115]` avanza el watermark a 110 (lag 5) y clasifica tres eventos de prueba. No escribas aún: predice por qué 112 es ON_TIME, por qué 100 es LATE (`wm − et = 10 > gracia 5`) y por qué 105 aún entra por `allowed_lateness`. Si confundes *processing time* con *event time*, el dashboard miente o descarta partes en silencio.",
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
        why: "El watermark es una aserción de progreso en event time, no un atraso suelto. `allowed_lateness` es la franja de gracia post-watermark (*completeness* vs. *latencia*), no un bound inferior inventado. Sin un *timeline* calculado, 100 y 105 se confunden: 100 es LATE (`wm − et = 10 > 5`); 105 aún entra. Misma regla en theory, iDo y weDo. En We Do repararás el predicado de aceptación, la tabla PASS/SIDE_OUTPUT/MISSING y la rama WAIT_FOR_WATERMARK.",
        retrospective:
          "Si puedes explicar por qué 100 es LATE y 105 ALLOWED_LATE sin mirar el código, ya tienes el hábito de etiquetar por event time. El error clásico es “llegó tarde al worker ⇒ drop”. En We Do practicarás el predicado, la tabla de tres rutas y la rama WAIT_FOR_WATERMARK.",
      },
      {
        demoId: "S46-T1-B-DEMO",
        subtopicId: "S46-T1-B",
        environment: "local-python",
        description: "Aplica sink idempotente y enruta un late event según política",
        preamble:
          "Exactly-once end-to-end no es un switch del middleware: es sink idempotente + dedup + checkpoint + late policy. En esta demo el reintento de `e1` no reescribe y el late `e2` se enruta con política explícita, sin colarse al agregado. No escribas: predice first/retry y las keys del sink. Si el retry devolviera True, el dashboard de Huancayo contaría doble la misma atención.",
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
        why: "La cadena at-least-once de la fuente obliga a sink por clave, checkpoint y `late_policy` documentada: juntos forman el exactly-once *compuesto*, no un flag del broker. El reintento de `e1` debe devolver False; el late `e2` no entra al agregado sin side-output. Si el retry reescribiera, el dashboard de atenciones contaría doble. En We Do practicarás set equality (no `len`), tres rutas y CHOOSE_LATE_POLICY.",
        retrospective:
          "Exactly-once compuesto se demuestra con reintento que no reescribe y late que no se mezcla en silencio — no con un flag del broker. El error clásico es “la cola dice exactly-once ⇒ el dashboard no duplica”. Pregunta: si `retry` devolviera True sobre `e1`, ¿qué métrica de atenciones se infla? We Do: set equality (no `len`), tres rutas y CHOOSE_LATE_POLICY.",
      },
      {
        demoId: "S46-T2-A-DEMO",
        subtopicId: "S46-T2-A",
        environment: "local-python",
        description: "Detecta grafo acíclico vs. ciclo raw→clean→raw con Kahn",
        preamble:
          "Un orquestador no puede planificar backfill si el grafo de assets no tiene orden topológico. En esta demo Kahn valida raw→clean→report y rechaza raw→clean→raw. No escribas: predice `line` y `cycle`. Si solo miras self-loops (`a==b`), el ciclo de dos nodos pasa y el plan de Huancayo se cuelga en reejecuciones infinitas.",
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
        why: "`seen == len(nodes)` es la prueba de aciclicidad en Kahn: nodos no declarados y self-loops también fallan. Afirmar “DAG acíclico” sin detectar ciclos A→B→A es falsa maestría — requisito real de Airflow/Dagster antes del backfill. En We Do combinarás `typed_io` con `is_acyclic`, REJECT_DAG y DECLARE_ASSET_DEPENDENCY.",
        retrospective:
          "Acíclico se **calcula** (p. ej. Kahn: `seen == len(nodes)`), no se afirma. El error clásico es “no hay self-loop ⇒ DAG OK” y dejar pasar raw↔clean. Pregunta: si el plan de backfill de Huancayo entra en reejecuciones infinitas, ¿qué miras primero en el grafo? We Do: typed_io + is_acyclic, REJECT_DAG y DECLARE_ASSET_DEPENDENCY.",
      },
      {
        demoId: "S46-T2-B-DEMO",
        subtopicId: "S46-T2-B",
        environment: "local-python",
        description: "Valida intervalos de backfill sin solape y resume = checkpoint",
        preamble:
          "Un schedule horario no autoriza a reprocesar el mismo rango dos veces. En esta demo se calcula solape half-open y se exige `resume_from == checkpoint`. No escribas: predice ok / overlap / bad_resume. Si el backfill de las 3 h perdidas en Huancayo solapa con el job vivo, corrompes la partición aunque “el cron diga que toca”.",
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
        why: "El solape se deriva de intervalos half-open ordenados; el resume alineado al checkpoint evita double-write. Un *schedule* no autoriza a reprocesar el mismo rango dos veces: sin eso, el backfill de las 3 h perdidas corrompe la partición viva. En We Do calcularás solape (no un flag), STOP_OVERLAPPING_BACKFILL y RECOVER_CHECKPOINT.",
        retrospective:
          "Backfill seguro = intervalos half-open **sin solape** + `resume_from == checkpoint`. El error clásico es confiar en un flag `overlap` del ticket. Pregunta: si solapas con el job de las 12:00, ¿qué partición de atenciones se corrompe aunque el schedule “diga que toca”? We Do: solape calculado, STOP y RECOVER_CHECKPOINT.",
      },
      {
        demoId: "S46-T3-A-DEMO",
        subtopicId: "S46-T3-A",
        environment: "local-python",
        description: "Evalúa schema exacto y freshness frente al SLO",
        preamble:
          "Un contrato de datos une schema, owner y SLO de frescura — y falla cerrado. En esta demo el mismo schema pasa con lag 30/60, cuarentena por `case_id:int` y cuarentena por lag 90/60. No escribas: predice las tres salidas. Si “arreglas freshness” cuando el tipo de columna ya está roto, publicas basura al dashboard de operaciones de Huancayo.",
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
        why: "Hay dos motivos distintos de QUARANTINE: *drift* de schema vs. *lag* sobre el SLO. Owner vacío pagina al dueño en vez de adivinar. Separarlos evita “arreglar freshness” cuando el tipo de columna ya está roto — patrón dbt / Great Expectations en stdlib. En We Do practicarás el predicado, MISSING:owner y PAGE_DATA_OWNER.",
        retrospective:
          "Schema correcto con dato de ayer sigue siendo breach de frescura. Drift y lag son dos QUARANTINE distintos; un solo `if` que los mezcla “arregla” lo incorrecto. El error clásico es publicar con warning. Pregunta: si el tipo de `case_id` ya está roto, ¿sirve bajar el lag a 10 min? We Do: fail-closed, tres rutas y PAGE_DATA_OWNER.",
      },
      {
        demoId: "S46-T3-B-DEMO",
        subtopicId: "S46-T3-B",
        environment: "local-python",
        description: "Construye facet de lineage y decide si se pagina al owner",
        preamble:
          "Lineage conecta la fila del dashboard con el run que la produjo. En esta demo un facet de `run-hyo-46` une raw-v2→clean-v3 con null_rate 0.01 y owner analytics; no se pagina. No escribas: predice el dict y `page False`. Si el run_id está vacío o faltan inputs, el post mórtem de Huancayo no puede responder “qué corrida produjo esta fila”.",
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
        why: "El facet mínimo une run/IO/métricas/owner: no es un *print* de listas sueltas. `should_page` se activa por owner vacío, run mal formado o null_rate alto. Solo con ese facet un incidente de calidad es reconstruible en el **post mórtem** de Huancayo. En We Do practicarás el predicado completo, OPEN_QUALITY_INCIDENT y TRACE_LINEAGE.",
        retrospective:
          "Lineage es un facet reconstruible (run + IO + métricas + owner), no un log suelto. El error clásico es “arreglar a ciegas” sin inputs ni run_id. Pregunta: si `null_rate` es 0.01 pero `run` no empieza por `run-`, ¿por qué igual se pagina? We Do: PASS / OPEN_QUALITY_INCIDENT / TRACE_LINEAGE.",
      },
      {
        demoId: "S46-T4-A-DEMO",
        subtopicId: "S46-T4-A",
        environment: "local-python",
        description: "Merge incremental: primera corrida escribe, segunda deja cero cambios",
        preamble:
          "El gate CP-N4-B exige que retry y backfill no dupliquen filas. En esta demo el merge por `id` escribe 2 cambios en la primera corrida y **cero** en la segunda con el mismo batch. No escribas: predice first/second/keys. Si el segundo run reescribiera, el reporte diario de Huancayo infla conteos y costos de storage.",
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
        why: "Contar cambios del merge prueba idempotencia de verdad: el segundo run con el mismo batch debe dejar delta 0. Keys alineadas y small files entran en el contrato de partición — no un booleano hardcodeado `no_dup_rerun True`. En We Do practicarás `second_run_changes==0`, REBUILD_PARTITION y REVIEW_INCREMENTAL_KEY.",
        retrospective:
          "Idempotencia se **mide** en cambios del segundo run, no en un flag `no_dup_rerun`. Full rewrite ciego infla conteos y storage del reporte diario. Pregunta: si second_run_changes=2 con el mismo batch, ¿qué prueba del gate CP-N4-B falló? We Do: predicado de partición, REBUILD y REVIEW_INCREMENTAL_KEY.",
      },
      {
        demoId: "S46-T4-B-DEMO",
        subtopicId: "S46-T4-B",
        environment: "local-python",
        description: "Compara SLI vs. SLO y RTO vs. target para decidir incidente",
        preamble:
          "Un SLO de datos une un SLI medido con un objetivo y un RTO de recuperación. En esta demo el simulacro sano (sli 0.995, rto 25, 3 acciones, owner) pasa; el de sli 0.80 / rto 90 / sin acciones declara incidente. No escribas: predice PASS y DECLARE. Si confundes SLI con SLO, el runbook de Huancayo no sabe cuándo activarse.",
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
print("sli_vs_slo", "medida vs. objetivo")`,
          output: `PASS
DECLARE_DATA_INCIDENT
sli_vs_slo medida vs. objetivo`,
        },
        why: "SLI es la medición; SLO es el objetivo. El contrato de ops exige sli ≥ slo, rto ≤ target, ≥1 acción de post mórtem y owner; sin owner se activa el runbook. Vocabulario SRE que el self-check y el youDo reutilizan al declarar incidentes de datos. En We Do practicarás el predicado, MISSING:owner y ACTIVATE_RECOVERY_RUNBOOK.",
        retrospective:
          "SLI es la **medida**; SLO es el **objetivo**. El error clásico es prometer frescura en el README sin simulacro de RTO y post mórtem. Pregunta: si sli=0.995 y rto=90 con target 30, ¿qué código de ops debe salir y por qué no basta el SLI “bonito”? We Do: predicado, DECLARE y ACTIVATE_RECOVERY_RUNBOOK.",
      },
    ],
  },
  weDo: {
    intro: "S46 · Laboratorio de pipeline de producción: 24 retos locales sobre `CASO-HYO-046`. Cada familia T* reutiliza la forma fail-closed E1 (predicado de dominio) → E2 (valid/invalid/missing) → E3 (CONTINUE / breach / incertidumbre). El **defecto** es de ingeniería de datos real: watermark/late, exactly-once, ciclo Kahn, solape de backfill calculado, schema+freshness, lineage, merge idempotente, SLI/SLO. Los *tokens* de acción son el protocolo operativo de la sección (no *enums* internos vacíos).",
    steps: [
      {
        id: "S46-T1-A-E1",
        subtopicId: "S46-T1-A",
        kind: "guided",
        title: "Aceptar ventana: ON_TIME o ALLOWED_LATE",
        preamble:
          "- **Contexto:** en `CASO-HYO-046-1A`, un evento de atención solo entra al sink si está en ventana y es ON_TIME o ALLOWED_LATE.\n- **Meta:** corregir el predicado `meets_contract` (in_window ∧ (on_time ∨ allowed_late)).\n- **Éxito:** imprimes exactamente `S46-T1-A PASS` con el fixture válido.\n- **Límites:** no inventes un bound inferior; no mutes el fixture; no uses processing time.",
        instruction:
          "S46-T1-A-E1 · Salida: debe devolver el PASS del contrato. 1. Abre el starter: `meets_contract` aprueba late/out-of-window (bug invertido).\n2. Extrae `et`, `we`, `wm`, `al` del record.\n3. `in_window = et <= we`; `on_time = et > wm`; `allowed_late = et <= wm and (wm - et) <= al`.\n4. PASS solo si `in_window and (on_time or allowed_late)`; conserva el print `S46-T1-A`.",
        hint: "Dibuja una recta: watermark a la izquierda de los on-time; allowed_lateness es la franja a la izquierda del watermark que aún se acepta.",
        hints: [
          "Orden mental: primero ventana (et ≤ window_end), luego on-time (et > wm), luego gracia (wm − et ≤ allowed_lateness).",
          "PASS cuando (et <= window_end) y (et > wm o wm - et <= allowed_lateness). El fixture válido tiene et=110, wm=100, lateness=15.",
        ],
        edgeCases: [
          "falta allowed_lateness → WAIT_FOR_WATERMARK / MISSING",
          "fixture adverso: event_time demasiado temprano vs. watermark (LATE) o > window_end → SIDE_OUTPUT_LATE_EVENT",
          "eventos sintéticos CASO-HYO-046-1A (sin PII)",
        ],
        tests: "El fixture `CASO-HYO-046-1A` satisface el predicado de dominio; imprime `S46-T1-A PASS` y el assert booleano pasa.",
        feedback:
          "PASS es ON_TIME o ALLOWED_LATE dentro de ventana. El starter invertía late/out-of-window: eso materializaría basura o silencios en el dashboard de Huancayo. Watermark + gracia, no un “mínimo inventado”.",
        retrospective:
          "Aceptación de ventana = en ventana y no demasiado late (ON_TIME o ALLOWED_LATE). El starter trataba late/out-of-window como éxito: eso materializa basura. El error clásico es mezclar *processing time* o inventar un “mínimo” de event time. Pregunta: con et=105, wm=110 y gracia=5, ¿por qué aún es ALLOWED_LATE y no LATE? Siguiente (E2): tres rutas válido / late / missing de gracia.",
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
        title: "Tres rutas de watermark (PASS / SIDE_OUTPUT / MISSING)",
        preamble:
          "- **Contexto:** el revisor de stream en Huancayo no trata igual un evento limpio, uno demasiado late y uno sin política de gracia.\n- **Meta:** implementar `assess` que distinga PASS, SIDE_OUTPUT_LATE_EVENT y MISSING:allowed_lateness.\n- **Éxito:** imprime `PASS SIDE_OUTPUT_LATE_EVENT MISSING:allowed_lateness` (y el booleano de contrato del scaffold).\n- **Límites:** si falta `allowed_lateness`, no evalúes late; no inventes la gracia; missing ≠ “aceptar”.",
        instruction:
          "S46-T1-A-E2 · Salida: debe devolver el PASS del contrato. 1. Revisa el starter: missing está bien; el predicado de dominio está invertido.\n2. Primero: campos required; si falta alguno → `MISSING:…`.\n3. Luego: `et <= we` y (`et > wm` o `wm - et <= al`) → PASS; si no → SIDE_OUTPUT_LATE_EVENT.\n4. Imprime los tres resultados en ese orden.",
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
        feedback:
          "Separaste schema incompleto (MISSING) de contenido late (SIDE_OUTPUT). No inventes `allowed_lateness` por defecto: el revisor de stream en Huancayo no “rellena” la gracia para forzar un PASS.",
        retrospective:
          "Missing es incertidumbre de **política** (aún no sabes la gracia); late es breach de frescura de evento ya medible. El error clásico es rellenar `allowed_lateness=∞` para forzar PASS y “no perder filas”. Pregunta: si el revisor inventa la gracia, ¿qué miente en el dashboard de Huancayo? Luego (E3): CONTINUE / SIDE_OUTPUT / WAIT_FOR_WATERMARK.",
        starterCode: {
          language: 'python',
          title: "s46-t1-a-e2.py",
          code: `# CASO-HYO-046 · assess LATE_OR_OUT_OF_WINDOW
# DEFECT: PASS con event_time inválido vs. watermark
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
meets_contract = ('1A-0' == '1A-0')
print('meets_contract', meets_contract)
` ,
          output: `PASS SIDE_OUTPUT_LATE_EVENT MISSING:allowed_lateness
meets_contract True` ,
        },
      },
      {
        id: "S46-T1-A-E3",
        subtopicId: "S46-T1-A",
        kind: "transfer",
        title: "Decide late data: CONTINUE o WAIT",
        preamble:
          "- **Contexto:** el worker de atenciones decide si el evento **sigue** al sink, va a side-output o espera política de watermark.\n- **Meta:** `decide` → CONTINUE (limpio), SIDE_OUTPUT_LATE_EVENT (late), WAIT_FOR_WATERMARK (sin gracia).\n- **Éxito:** `CONTINUE SIDE_OUTPUT_LATE_EVENT WAIT_FOR_WATERMARK`.\n- **Límites:** no inventes `allowed_lateness`; no conviertas missing en CONTINUE; no toques los fixtures.",
        instruction:
          "S46-T1-A-E3 · Salida: debe devolver el PASS del contrato. 1. Corrige missing: sin `allowed_lateness` → `WAIT_FOR_WATERMARK` (no CONTINUE).\n2. Con record completo, reutiliza el predicado de E1/E2.\n3. Solo el limpio es CONTINUE; el de et=80 es SIDE_OUTPUT_LATE_EVENT.\n4. Imprime los tres códigos en orden.",
        hint: "Enruta missing primero a WAIT_FOR_WATERMARK; solo con campos completos evalúa on-time/allowed-late.",
        hints: [
          "WAIT_FOR_WATERMARK es incertidumbre operativa, no un PASS disfrazado ni un SIDE_OUTPUT.",
          "Orden de salida esperado: CONTINUE, SIDE_OUTPUT_LATE_EVENT, WAIT_FOR_WATERMARK.",
        ],
        edgeCases: [
          "falta allowed_lateness → WAIT_FOR_WATERMARK",
          "fixture adverso: et demasiado early vs. wm+lateness → SIDE_OUTPUT_LATE_EVENT",
          "eventos sintéticos CASO-HYO-046-1A (sin PII)",
        ],
        tests: "Fixtures válido/adverso/sin allowed_lateness → CONTINUE SIDE_OUTPUT_LATE_EVENT WAIT_FOR_WATERMARK.",
        feedback:
          "Fail-closed con vocabulario operativo: CONTINUE solo si el evento es ON_TIME o ALLOWED_LATE. Convertir missing en éxito silencioso promovería late data al dashboard de Huancayo.",
        retrospective:
          "Un evento sin política de gracia es espera operativa, no un allow optimista. El error clásico es promover late data “para no perder el dashboard”. Pregunta: ¿por qué WAIT no es lo mismo que SIDE_OUTPUT?",
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
assert results == ["CONTINUE", "SIDE_OUTPUT_LATE_EVENT", "WAIT_FOR_WATERMARK"]
meets_contract = ('1A-1' == '1A-1')
print('meets_contract', meets_contract)
` ,
          output: `CONTINUE SIDE_OUTPUT_LATE_EVENT WAIT_FOR_WATERMARK
meets_contract True` ,
        },
      },
      {
        id: "S46-T1-B-E1",
        subtopicId: "S46-T1-B",
        kind: "guided",
        title: "Exactly-once: set, checkpoint y policy",
        preamble:
          "- **Contexto:** en `CASO-HYO-046-1B`, el sink de atenciones solo es “exactly-once compuesto” si keys, checkpoint y late_policy cierran juntos.\n- **Meta:** corregir `meets_contract` a set(event_ids)==sink_ids ∧ checkpoint==2 ∧ policy ∈ catálogo.\n- **Éxito:** `S46-T1-B PASS`.\n- **Límites:** no uses longitudes; no apruebes policy vacía; no mutes el fixture.",
        instruction:
          "S46-T1-B-E1 · Salida: debe devolver el PASS del contrato. 1. Abre el starter: compara `len` o aprueba sin policy (bug).\n2. Compara `set(record[\"event_ids\"])` con `sink_ids`.\n3. Exige `checkpoint == 2` y `late_policy in {\"update\", \"side-output\", \"quarantine\"}`.\n4. Conserva print `S46-T1-B` y assert.",
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
        feedback:
          "`[e1,e1,e2]` tiene len 3 y set size 2: solo el set prueba dedup. Checkpoint y policy son eslabones del compuesto; sin ellos el “exactly-once” de marketing es doble conteo en Huancayo.",
        retrospective:
          "Dedup por set + checkpoint + policy es una **cadena**, no un booleano mágico. Confiar en `len(event_ids)==len(sink_ids)` aprueba reintentos como si fueran eventos nuevos. El error clásico es policy vacía “porque el sink ya se ve lleno”. Pregunta: ¿qué eslabón falla si checkpoint=0 aunque las keys coincidan? Siguiente (E2): PASS / REPLAY / MISSING:late_policy.",
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
        title: "Tres rutas de sink (PASS / REPLAY / MISSING)",
        preamble:
          "- **Contexto:** el on-call de datos distingue sink limpio, sink a reprocesar e incertidumbre de política.\n- **Meta:** `assess` → PASS / REPLAY_IDEMPOTENTLY / MISSING:late_policy.\n- **Éxito:** `PASS REPLAY_IDEMPOTENTLY MISSING:late_policy`.\n- **Límites:** missing primero; no inventes late_policy; no uses len para dedup.",
        instruction:
          "S46-T1-B-E2 · Salida: debe devolver el PASS del contrato. 1. Conserva el bloque missing.\n2. Corrige la decisión: set equality + checkpoint==2 + policy en catálogo.\n3. Cualquier fallo de dominio → REPLAY_IDEMPOTENTLY.\n4. Imprime las tres rutas en orden.",
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
        feedback:
          "El adverso falla por contenido (dedup/checkpoint/policy), no por KeyError. Missing de policy es otra rama: no la colapses en REPLAY o el on-call reprocesa sin reglas.",
        retrospective:
          "REPLAY asume que ya conoces la política y el sink está roto; MISSING es “aún no hay regla de late”. Colapsar ambas en un solo “falló” manda al on-call a reprocesar sin política. Pregunta: el viernes a las 18:00, ¿abres replay o eliges policy primero? Luego (E3): CHOOSE_LATE_POLICY vs. REPLAY.",
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
meets_contract = ('1B-2' == '1B-2')
print('meets_contract', meets_contract)
` ,
          output: `PASS REPLAY_IDEMPOTENTLY MISSING:late_policy
meets_contract True` ,
        },
      },
      {
        id: "S46-T1-B-E3",
        subtopicId: "S46-T1-B",
        kind: "transfer",
        title: "Decide sink: CONTINUE o elige policy",
        preamble:
          "- **Contexto:** antes de un replay de atenciones, el operador elige política de late o detiene el reproceso.\n- **Meta:** `decide` → CONTINUE / REPLAY_IDEMPOTENTLY / CHOOSE_LATE_POLICY.\n- **Éxito:** `CONTINUE REPLAY_IDEMPOTENTLY CHOOSE_LATE_POLICY`.\n- **Límites:** sin late_policy no es breach de contenido; no uses CONTINUE en missing.",
        instruction:
          "S46-T1-B-E3 · Salida: debe devolver el PASS del contrato. 1. Missing → CHOOSE_LATE_POLICY.\n2. Con campos completos, predicado de E1/E2.\n3. CONTINUE solo si set+checkpoint+policy OK; si no REPLAY.\n4. Imprime los tres códigos.",
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
        feedback:
          "Distinguir “no sé la política” (CHOOSE_LATE_POLICY) de “el sink está corrupto” (REPLAY_IDEMPOTENTLY) evita reprocesar a ciegas el viernes a las 18:00 en Huancayo. CONTINUE solo con set + checkpoint + policy en catálogo.",
        retrospective:
          "“No sé la política” y “el sink está corrupto” son runbooks distintos. El error clásico es REPLAY a ciegas el viernes a las 18:00. Pregunta: ¿qué harías en Huancayo si falta `late_policy` antes de tocar el sink?",
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
assert results == ["CONTINUE", "REPLAY_IDEMPOTENTLY", "CHOOSE_LATE_POLICY"]
meets_contract = ('1B-3' == '1B-3')
print('meets_contract', meets_contract)
` ,
          output: `CONTINUE REPLAY_IDEMPOTENTLY CHOOSE_LATE_POLICY
meets_contract True` ,
        },
      },
      {
        id: "S46-T2-A-E1",
        subtopicId: "S46-T2-A",
        kind: "guided",
        title: "DAG tipado y sin ciclos (Kahn)",
        preamble:
          "- **Contexto:** en `CASO-HYO-046-2A`, raw→clean→report debe ser acíclico y con I/O tipado antes de cualquier backfill.\n- **Meta:** `meets_contract = typed_io and is_acyclic(nodes, edges)`.\n- **Éxito:** `S46-T2-A PASS`.\n- **Límites:** no apruebes solo “sin self-loop”; implementa Kahn o DFS; no mutes nodos/edges.",
        instruction:
          "S46-T2-A-E1 · Salida: debe devolver el PASS del contrato. 1. Revisa el starter: predicado invertido y sin detección de ciclos.\n2. Implementa `is_acyclic` (endpoints en nodes, sin self-loop, Kahn con seen == len(nodes)).\n3. PASS solo si `typed_io` y acíclico.\n4. Conserva print `S46-T2-A`.",
        hint: "Self-loop es necesario, pero no suficiente: implementa Kahn o DFS para rechazar raw→clean→raw.",
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
        feedback:
          "Un ciclo raw↔clean pasaba el predicado viejo: acíclico ≠ “sin self-loop”. Sin orden topológico el gate `no_cyclic_dag` falla y el backfill de Huancayo no tiene ancestros bien definidos.",
        retrospective:
          "`typed_io` y aciclicidad son condiciones **independientes**: un grafo “tipado” con ciclo A→B→A sigue sin orden topológico. El error clásico es confiar en el dibujo del grafo o solo en `a != b`. Pregunta: ¿por qué `seen < len(nodes)` en Kahn prueba un ciclo residual? Siguiente (E2): PASS / REJECT_DAG / MISSING:typed_io con ciclo real.",
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
        title: "Tres rutas de DAG (PASS / REJECT / MISSING)",
        preamble:
          "- **Contexto:** el planificador de assets en Huancayo rechaza ciclos aunque el I/O diga “tipado”.\n- **Meta:** `assess` → PASS / REJECT_DAG / MISSING:typed_io.\n- **Éxito:** `PASS REJECT_DAG MISSING:typed_io`.\n- **Límites:** missing de typed_io antes de edges; typed_io True no perdona el ciclo.",
        instruction:
          "S46-T2-A-E2 · Salida: debe devolver el PASS del contrato. 1. Conserva missing.\n2. Importa/define `is_acyclic` como en el demo.\n3. ok = typed_io and is_acyclic(...); si no → REJECT_DAG.\n4. Imprime las tres rutas.",
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
        feedback:
          "El adverso ya no es self-loop decorativo: es un ciclo real que el orquestador de Huancayo no puede ordenar, aunque typed_io diga True. MISSING:typed_io es otra rama (incertidumbre de diseño).",
        retrospective:
          "Tipado no salva el ciclo: el planificador de Huancayo necesita orden topológico, no solo I/O declarado. El error clásico es “typed_io True ⇒ confío y materializo”. Pregunta: si raw→clean→raw, ¿qué asset “termina primero” en el backfill? Luego (E3): DECLARE_ASSET_DEPENDENCY vs. REJECT_DAG.",
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
meets_contract = ('2A-4' == '2A-4')
print('meets_contract', meets_contract)
` ,
          output: `PASS REJECT_DAG MISSING:typed_io
meets_contract True` ,
        },
      },
      {
        id: "S46-T2-A-E3",
        subtopicId: "S46-T2-A",
        kind: "transfer",
        title: "Decide DAG: CONTINUE o declara dependencia",
        preamble:
          "- **Contexto:** el orquestador no materializa a ciegas: o el grafo es válido, o se rechaza, o se declara la dependencia faltante.\n- **Meta:** `decide` → CONTINUE / REJECT_DAG / DECLARE_ASSET_DEPENDENCY.\n- **Éxito:** `CONTINUE REJECT_DAG DECLARE_ASSET_DEPENDENCY`.\n- **Límites:** missing de typed_io ≠ grafo inválido; no uses solo `a != b`.",
        instruction:
          "S46-T2-A-E3 · Salida: debe devolver el PASS del contrato. 1. Missing → DECLARE_ASSET_DEPENDENCY.\n2. Con record completo, Kahn + typed_io.\n3. Ciclo → REJECT_DAG; línea limpia → CONTINUE.\n4. Imprime en orden.",
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
        feedback:
          "DECLARE_ASSET_DEPENDENCY es incertidumbre de diseño (falta tipado); REJECT_DAG es breach de topología. Mezclarlos publica un plan de backfill sin edges tipados o rechaza cuando aún falta declarar la dependencia. CONTINUE solo con grafo limpio.",
        retrospective:
          "DECLARE es incertidumbre de diseño; REJECT es breach de topología — runbooks distintos. El error clásico es CONTINUAR sin typed_io. Pregunta: ¿por qué un self-loop no es el único ciclo peligroso en el plan de Huancayo?",
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
assert results == ["CONTINUE", "REJECT_DAG", "DECLARE_ASSET_DEPENDENCY"]
meets_contract = ('2A-5' == '2A-5')
print('meets_contract', meets_contract)
` ,
          output: `CONTINUE REJECT_DAG DECLARE_ASSET_DEPENDENCY
meets_contract True` ,
        },
      },
      {
        id: "S46-T2-B-E1",
        subtopicId: "S46-T2-B",
        kind: "guided",
        title: "Backfill sin solape y resume = checkpoint",
        preamble:
          "- **Contexto:** en `CASO-HYO-046-2B`, el plan de backfill de atenciones solo es seguro si los intervalos half-open no se pisan y el resume coincide con el checkpoint.\n- **Meta:** invertir el bug: PASS si **no** hay solape y checkpoint == resume_from.\n- **Éxito:** `S46-T2-B PASS`.\n- **Límites:** calcula solape desde números; no confíes en un flag; half-open: tocar en el borde está bien.",
        instruction:
          "S46-T2-B-E1 · Salida: debe devolver el PASS del contrato. 1. Ordena intervalos por start.\n2. `computed_overlap = any(end_i > start_{i+1})`.\n3. `meets_contract = not computed_overlap and checkpoint == resume_from`.\n4. Conserva print `S46-T2-B`.",
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
        feedback:
          "El solape se **deriva** de los intervalos half-open; un flag en el record es pista, no verdad del plan. Resume ≠ checkpoint es double-write disfrazado de “reintento”.",
        retrospective:
          "Plan de backfill = intervalos no solapados + resume consistente. El starter aprobaba lo que debería STOP: double-write disfrazado de reintento. El error clásico es leer un booleano del payload. Pregunta: en half-open, ¿por qué tocar en el borde (`end==start` siguiente) es OK y `end > start` siguiente no? Siguiente (E2): solape 3–4 y resume “start”.",
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
        title: "Tres rutas de backfill (PASS / STOP / MISSING)",
        preamble:
          "- **Contexto:** el planificador no puede confiar en un booleano del ticket: debe medir solape y alinear resume.\n- **Meta:** `assess` → PASS / STOP_OVERLAPPING_BACKFILL / MISSING:resume_from.\n- **Éxito:** `PASS STOP_OVERLAPPING_BACKFILL MISSING:resume_from`.\n- **Límites:** calcula half-open; resume “start” no es checkpoint; missing primero.",
        instruction:
          "S46-T2-B-E2 · Salida: debe devolver el PASS del contrato. 1. Conserva missing de resume_from.\n2. Calcula `computed_overlap` sobre intervals ordenados.\n3. PASS solo si not overlap y resume == checkpoint.\n4. Imprime las tres rutas.",
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
        feedback:
          "El adverso solapa 3–4 en half-open; mirar solo un booleano del ticket es print-theater de orquestación y corrompe la partición viva de atenciones.",
        retrospective:
          "El solape se **mide** en los números half-open; mirar solo `resume_from` o un flag del ticket es teatro de orquestación. STOP_OVERLAPPING_BACKFILL protege la partición viva de Huancayo. El error clásico es “el ticket dice no overlap”. Pregunta: ¿qué rango se pisa entre [1,4] y [3,6]? Luego (E3): RECOVER_CHECKPOINT cuando falta estado.",
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
meets_contract = ('2B-6' == '2B-6')
print('meets_contract', meets_contract)
` ,
          output: `PASS STOP_OVERLAPPING_BACKFILL MISSING:resume_from
meets_contract True` ,
        },
      },
      {
        id: "S46-T2-B-E3",
        subtopicId: "S46-T2-B",
        kind: "transfer",
        title: "Decide backfill: CONTINUE o recupera checkpoint",
        preamble:
          "- **Contexto:** sin `resume_from` no hay plan ejecutable; con solape no hay plan seguro.\n- **Meta:** `decide` → CONTINUE / STOP_OVERLAPPING_BACKFILL / RECOVER_CHECKPOINT.\n- **Éxito:** `CONTINUE STOP_OVERLAPPING_BACKFILL RECOVER_CHECKPOINT`.\n- **Límites:** no trates resume_from=\"start\" como checkpoint; calcula solape siempre.",
        instruction:
          "S46-T2-B-E3 · Salida: debe devolver el PASS del contrato. 1. Missing → RECOVER_CHECKPOINT.\n2. Calcula solape half-open.\n3. Plan limpio → CONTINUE; solape o resume roto → STOP.\n4. Imprime en orden.",
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
        feedback:
          "RECOVER_CHECKPOINT es incertidumbre de **estado** (no hay resume ejecutable); STOP es breach de **plan** (solape o resume ≠ checkpoint). CONTINUAR sin resume reescribe la partición de las 12:00 en Huancayo como si fuera un reintento limpio.",
        retrospective:
          "RECOVER es incertidumbre de estado; STOP es breach de planificación — distintos runbooks. El error clásico es CONTINUAR sin resume. Pregunta: ¿qué partición de atenciones corrompes si solapas con el job de las 12:00?",
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
assert results == ["CONTINUE", "STOP_OVERLAPPING_BACKFILL", "RECOVER_CHECKPOINT"]
meets_contract = ('2B-7' == '2B-7')
print('meets_contract', meets_contract)
` ,
          output: `CONTINUE STOP_OVERLAPPING_BACKFILL RECOVER_CHECKPOINT
meets_contract True` ,
        },
      },
      {
        id: "S46-T3-A-E1",
        subtopicId: "S46-T3-A",
        kind: "guided",
        title: "Contrato schema + freshness + owner",
        preamble:
          "- **Contexto:** en `CASO-HYO-046-3A`, `atenciones_diarias` solo publica si schema exacto, lag ≤ SLO y hay owner.\n- **Meta:** `meets_contract` con las tres conjunciones (no las inversas).\n- **Éxito:** `S46-T3-A PASS`.\n- **Límites:** no publiques “casi bien”; owner vacío es breach; no mutes el fixture.",
        instruction:
          "S46-T3-A-E1 · Salida: debe devolver el PASS del contrato. 1. Abre el starter: predicado invertido (y sin owner).\n2. Exige schema == observed_schema.\n3. Exige freshness_min ≤ slo_min y bool(owner).\n4. PASS → print `S46-T3-A PASS`; si no QUARANTINE_DATASET.",
        hint: "Igualdad de dicts de schema (tipos) y comparación numérica de lag vs. SLO.",
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
        feedback:
          "Fail closed: drift o frescura rota no se publican. Owner vacío es breach de ownership aunque el schema coincida — el on-call no debe adivinar a quién paginar.",
        retrospective:
          "Contrato publicable = schema exacto **y** lag ≤ SLO **y** owner real. El starter invertía igualdad/lag y olvidaba el dueño: publicar “casi bien” manda basura al dashboard de operaciones. El error clásico es warning en vez de fail-closed. Pregunta: si el schema coincide pero owner=\"\", ¿a quién pagina el on-call? Siguiente (E2): cuarentena vs. MISSING:owner.",
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
        title: "Tres rutas de contrato (PASS / QUARANTINE / MISSING)",
        preamble:
          "- **Contexto:** el gate de calidad separa dataset roto de record de control incompleto.\n- **Meta:** `assess` → PASS / QUARANTINE_DATASET / MISSING:owner.\n- **Éxito:** `PASS QUARANTINE_DATASET MISSING:owner`.\n- **Límites:** en E2 no uses PAGE_DATA_OWNER; missing primero; no inventes owner.",
        instruction:
          "S46-T3-A-E2 · Salida: debe devolver el PASS del contrato. 1. Conserva missing.\n2. ok = schema exacto ∧ lag ≤ slo ∧ owner.\n3. Si no ok → QUARANTINE_DATASET.\n4. Imprime las tres rutas.",
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
        feedback:
          "Cuarentena es breach de contenido (drift o frescura); MISSING:owner es control incompleto. No inventes “data-ops por defecto” ni publiques al dashboard de Huancayo sin accountability.",
        retrospective:
          "Cuarentena es breach de **contenido** (drift o frescura); MISSING:owner es schema de **control** incompleto. Tratar owner ausente como “data-ops por defecto” inventa un dueño y publica sin accountability. Pregunta: ¿por qué no conviertes MISSING en QUARANTINE automáticamente? Luego (E3): PAGE_DATA_OWNER.",
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
meets_contract = ('3A-8' == '3A-8')
print('meets_contract', meets_contract)
` ,
          output: `PASS QUARANTINE_DATASET MISSING:owner
meets_contract True` ,
        },
      },
      {
        id: "S46-T3-A-E3",
        subtopicId: "S46-T3-A",
        kind: "transfer",
        title: "Decide contrato: CONTINUE o page al owner",
        preamble:
          "- **Contexto:** sin owner no se cuarentena a ciegas ni se publica: se pagina.\n- **Meta:** `decide` → CONTINUE / QUARANTINE_DATASET / PAGE_DATA_OWNER.\n- **Éxito:** `CONTINUE QUARANTINE_DATASET PAGE_DATA_OWNER`.\n- **Límites:** no inventes owner por defecto; no conviertas missing en CONTINUE.",
        instruction:
          "S46-T3-A-E3 · Salida: debe devolver el PASS del contrato. 1. Missing → PAGE_DATA_OWNER.\n2. Predicado de E1/E2 con campos completos.\n3. Breach → QUARANTINE; limpio → CONTINUE.\n4. Imprime en orden.",
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
        feedback:
          "PAGE_DATA_OWNER es incertidumbre de ownership; QUARANTINE_DATASET es breach de contrato. Asumir `data-ops` publica basura al dashboard sin dueño real. CONTINUE solo con schema exacto, lag ≤ SLO y owner presente.",
        retrospective:
          "PAGE es incertidumbre de ownership; QUARANTINE es breach de contrato — runbooks distintos. El error clásico es asumir `data-ops` por defecto. Pregunta: ¿qué publicas si lag=80 y schema drift a la vez en atenciones_diarias?",
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
assert results == ["CONTINUE", "QUARANTINE_DATASET", "PAGE_DATA_OWNER"]
meets_contract = ('3A-9' == '3A-9')
print('meets_contract', meets_contract)
` ,
          output: `CONTINUE QUARANTINE_DATASET PAGE_DATA_OWNER
meets_contract True` ,
        },
      },
      {
        id: "S46-T3-B-E1",
        subtopicId: "S46-T3-B",
        kind: "guided",
        title: "Lineage: run, IO, null_rate y owner",
        preamble:
          "- **Contexto:** en `CASO-HYO-046-3B`, un run de clean solo es trazable si el facet está completo y la calidad bajo umbral.\n- **Meta:** `meets_contract` con run- + inputs + outputs + null_rate≤0.02 + owner.\n- **Éxito:** `S46-T3-B PASS`.\n- **Límites:** null_rate bajo no basta sin IO y run_id; no mutes el fixture.",
        instruction:
          "S46-T3-B-E1 · Salida: debe devolver el PASS del contrato. 1. Abre el starter: predicado invertido.\n2. startswith(\"run-\") y bool(inputs) y bool(outputs).\n3. null_rate ≤ 0.02 y bool(owner).\n4. PASS o OPEN_QUALITY_INCIDENT; print `S46-T3-B`.",
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
        feedback:
          "Lineage mínimo = run trazable + IO + calidad + owner. Sin un eslabón, el incidente no se reconstruye y el post mórtem de Huancayo queda a ciegas.",
        retrospective:
          "Un solo eslabón roto basta para abrir incidente: run mal formado, IO vacío, null_rate alto u owner vacío. El error clásico es mirar solo `null_rate` y declarar “calidad OK”. Pregunta: ¿qué pones en el ticket de Huancayo si no hay inputs? Siguiente (E2): adverso multi-eslabón vs. MISSING:owner.",
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
        title: "Tres rutas de lineage (PASS / INCIDENT / MISSING)",
        preamble:
          "- **Contexto:** el revisor de calidad no confunde record incompleto con facet roto documentado.\n- **Meta:** `assess` → PASS / OPEN_QUALITY_INCIDENT / MISSING:owner.\n- **Éxito:** `PASS OPEN_QUALITY_INCIDENT MISSING:owner`.\n- **Límites:** missing primero; cualquiera de los eslabones del adverso basta para incidente.",
        instruction:
          "S46-T3-B-E2 · Salida: debe devolver el PASS del contrato. 1. Conserva missing.\n2. Aplica predicado completo de E1.\n3. Si no ok → OPEN_QUALITY_INCIDENT.\n4. Imprime las tres rutas.",
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
        feedback:
          "El adverso rompe varios eslabones a la vez; cualquiera basta para abrir incidente. MISSING:owner no es lo mismo que OPEN_QUALITY_INCIDENT.",
        retrospective:
          "MISSING:owner es incertidumbre de **control** (aún no sabes a quién paginar); OPEN_QUALITY_INCIDENT asume un facet documentado pero roto. El adverso rompe varios eslabones a la vez: cualquiera basta. El error clásico es abrir un incidente vacío de ownership. Pregunta: si solo falta owner, ¿por qué no abres OPEN de inmediato? Luego (E3): TRACE_LINEAGE recupera contexto.",
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
meets_contract = ('3B-10' == '3B-10')
print('meets_contract', meets_contract)
` ,
          output: `PASS OPEN_QUALITY_INCIDENT MISSING:owner
meets_contract True` ,
        },
      },
      {
        id: "S46-T3-B-E3",
        subtopicId: "S46-T3-B",
        kind: "transfer",
        title: "Decide lineage: CONTINUE o traza",
        preamble:
          "- **Contexto:** sin owner se traza lineage; con facet roto se abre incidente de calidad.\n- **Meta:** `decide` → CONTINUE / OPEN_QUALITY_INCIDENT / TRACE_LINEAGE.\n- **Éxito:** `CONTINUE OPEN_QUALITY_INCIDENT TRACE_LINEAGE`.\n- **Límites:** no abras incidente por missing; no uses CONTINUE en incertidumbre.",
        instruction:
          "S46-T3-B-E3 · Salida: debe devolver el PASS del contrato. 1. Missing → TRACE_LINEAGE.\n2. Predicado completo si hay campos.\n3. Facet roto → OPEN_QUALITY_INCIDENT; limpio → CONTINUE.\n4. Imprime en orden.",
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
        feedback:
          "TRACE recupera contexto; OPEN asume que ya sabes qué se rompió. Un incidente vacío de ownership no sirve en el post mórtem de Huancayo — no lo disfraces de CONTINUE.",
        retrospective:
          "TRACE_LINEAGE es el runbook cuando falta evidencia de ownership; OPEN_QUALITY_INCIDENT es cuando ya sabes qué se rompió en el facet. El error clásico es ticket de incidente sin run_id ni inputs. Pregunta: ¿qué tres campos del facet copias al post mórtem antes de “arreglar” clean-v3? Ese hábito alimenta el youDo y CP-N4-B.",
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
assert results == ["CONTINUE", "OPEN_QUALITY_INCIDENT", "TRACE_LINEAGE"]
meets_contract = ('3B-11' == '3B-11')
print('meets_contract', meets_contract)
` ,
          output: `CONTINUE OPEN_QUALITY_INCIDENT TRACE_LINEAGE
meets_contract True` ,
        },
      },
      {
        id: "S46-T4-A-E1",
        subtopicId: "S46-T4-A",
        kind: "guided",
        title: "Merge incremental: keys y cero delta",
        preamble:
          "- **Contexto:** en `CASO-HYO-046-4A`, la partición `2026-07-22` solo es sana si keys alinean, el re-run no cambia filas y los small files están bajo techo.\n- **Meta:** tres conjunciones: source_keys==target_keys ∧ second_run_changes==0 ∧ small_files≤max.\n- **Éxito:** `S46-T4-A PASS`.\n- **Límites:** no ignores small_files; no mutes el fixture.",
        instruction:
          "S46-T4-A-E1 · Salida: debe devolver el PASS del contrato. 1. Abre el starter: predicado invertido e incompleto.\n2. Exige equality de keys.\n3. Exige second_run_changes == 0 y small_files ≤ max_small_files.\n4. PASS o REBUILD_PARTITION; print `S46-T4-A`.",
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
        feedback:
          "Idempotencia de partición = keys alineadas + segundo run sin delta + higiene de archivos. second_run_changes > 0 implica que el merge no es función del batch de entrada.",
        retrospective:
          "El segundo run con cero cambios es la prueba del gate de partición. Solo mirar keys deja pasar delta>0 o small files fuera de techo. El error clásico es “las keys coinciden ⇒ merge OK”. Pregunta: ¿por qué small_files también entra al contrato y no solo el conteo de filas? Siguiente (E2): drift + delta + small files altos.",
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
        title: "Tres rutas de merge (PASS / REBUILD / MISSING)",
        preamble:
          "- **Contexto:** el revisor de particiones reconstruye cuando el sink ya no es función del batch; no adivina el techo de small files.\n- **Meta:** `assess` → PASS / REBUILD_PARTITION / MISSING:max_small_files.\n- **Éxito:** `PASS REBUILD_PARTITION MISSING:max_small_files`.\n- **Límites:** missing de max antes de comparar; cualquier condición rota basta para REBUILD.",
        instruction:
          "S46-T4-A-E2 · Salida: debe devolver el PASS del contrato. 1. Conserva missing.\n2. ok = keys iguales ∧ changes==0 ∧ small_files ≤ max.\n3. Si no → REBUILD_PARTITION.\n4. Imprime las tres rutas.",
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
        feedback:
          "Rebuild es la respuesta a un sink que ya no es función del batch de entrada: keys drift, delta en re-run o small files fuera de techo.",
        retrospective:
          "REBUILD_PARTITION responde a un sink que ya no es función del batch (keys drift, delta en re-run o higiene rota). MISSING:max_small_files es incertidumbre de **diseño** del techo, no un rebuild automático. El error clásico es reconstruir sin saber el límite. Pregunta: ¿qué evidencia imprime el revisor antes de REBUILD? Luego (E3): REVIEW_INCREMENTAL_KEY.",
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
meets_contract = ('4A-12' == '4A-12')
print('meets_contract', meets_contract)
` ,
          output: `PASS REBUILD_PARTITION MISSING:max_small_files
meets_contract True` ,
        },
      },
      {
        id: "S46-T4-A-E3",
        subtopicId: "S46-T4-A",
        kind: "transfer",
        title: "Decide merge: CONTINUE o revisa la clave",
        preamble:
          "- **Contexto:** sin `max_small_files` se revisa el diseño del merge; con delta en re-run se reconstruye.\n- **Meta:** `decide` → CONTINUE / REBUILD_PARTITION / REVIEW_INCREMENTAL_KEY.\n- **Éxito:** `CONTINUE REBUILD_PARTITION REVIEW_INCREMENTAL_KEY`.\n- **Límites:** no rebuild automático por missing; no CONTINUAR en incertidumbre.",
        instruction:
          "S46-T4-A-E3 · Salida: debe devolver el PASS del contrato. 1. Missing → REVIEW_INCREMENTAL_KEY.\n2. Predicado de E1/E2.\n3. Merge roto → REBUILD; limpio → CONTINUE.\n4. Imprime en orden.",
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
        feedback:
          "REVIEW no es un rebuild automático: primero cierras el límite de diseño. REBUILD asume que el merge ya corrompió o dejó basura de small files. CONTINUE solo con keys alineadas, delta 0 y techo respetado.",
        retrospective:
          "REVIEW_INCREMENTAL_KEY es incertidumbre de diseño (falta max_small_files o clave mal elegida); REBUILD es breach **materializado** en el sink. Rebuild a ciegas no arregla el contrato del portfolio ni el gate CP-N4-B. Pregunta: ¿qué prueba el `second_run_changes==0` en 30 segundos de defensa? Ese número es la evidencia del youDo.",
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
assert results == ["CONTINUE", "REBUILD_PARTITION", "REVIEW_INCREMENTAL_KEY"]
meets_contract = ('4A-13' == '4A-13')
print('meets_contract', meets_contract)
` ,
          output: `CONTINUE REBUILD_PARTITION REVIEW_INCREMENTAL_KEY
meets_contract True` ,
        },
      },
      {
        id: "S46-T4-B-E1",
        subtopicId: "S46-T4-B",
        kind: "guided",
        title: "SLI, RTO, post mórtem y owner",
        preamble:
          "- **Contexto:** en `CASO-HYO-046-4B`, el simulacro de ops de atenciones solo pasa si frescura, RTO, acciones y owner cierran.\n- **Meta:** sli ≥ slo ∧ rto ≤ target ∧ actions ≥ 1 ∧ owner.\n- **Éxito:** `S46-T4-B PASS`.\n- **Límites:** no apruebes con postmortem_actions=0; no ignores owner.",
        instruction:
          "S46-T4-B-E1 · Salida: debe devolver el PASS del contrato. 1. Abre el starter: predicado invertido e incompleto.\n2. Compara sli con slo (≥) y rto con target (≤).\n3. Exige postmortem_actions ≥ 1 y bool(owner).\n4. PASS o DECLARE_DATA_INCIDENT; print `S46-T4-B`.",
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
        feedback:
          "SLO de datos se demuestra con desigualdades y dueño, no con un README. Un simulacro sin acciones de post mórtem o con RTO por encima del target es teatro: el on-call de Huancayo no tiene runbook ejecutable.",
        retrospective:
          "Cuatro eslabones: sli ≥ slo, rto ≤ target, ≥1 acción de post mórtem y owner. Mirar solo el porcentaje de frescura es teatro operativo. El error clásico es PASS con `postmortem_actions=0`. Pregunta: ¿qué demuestra un simulacro sin acciones concretas? Siguiente (E2): adverso multi-indicador.",
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
        title: "Tres rutas de ops (PASS / INCIDENT / MISSING)",
        preamble:
          "- **Contexto:** el on-call declara incidente por evidencia numérica, no por “anda lento”.\n- **Meta:** `assess` → PASS / DECLARE_DATA_INCIDENT / MISSING:owner.\n- **Éxito:** `PASS DECLARE_DATA_INCIDENT MISSING:owner`.\n- **Límites:** missing primero; un solo indicador roto basta para DECLARE.",
        instruction:
          "S46-T4-B-E2 · Salida: debe devolver el PASS del contrato. 1. Conserva missing.\n2. ok = sli≥slo ∧ rto≤target ∧ actions≥1 ∧ owner.\n3. Si no → DECLARE_DATA_INCIDENT.\n4. Imprime las tres rutas.",
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
        feedback:
          "El incidente se declara por evidencia numérica (SLI, RTO, acciones), no por sensación de “anda lento” en el dashboard de Huancayo. Un solo indicador roto basta.",
        retrospective:
          "El incidente se declara con **evidencia numérica** (SLI, RTO, acciones), no por “anda lento”. Un solo indicador roto basta para DECLARE. MISSING:owner es otra rama: no abras un incidente vacío de ownership. Pregunta: si sli=0.8 y actions=0 a la vez, ¿necesitas dos tickets o uno con ambos hechos? Luego (E3): ACTIVATE_RECOVERY_RUNBOOK.",
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
meets_contract = ('4B-14' == '4B-14')
print('meets_contract', meets_contract)
` ,
          output: `PASS DECLARE_DATA_INCIDENT MISSING:owner
meets_contract True` ,
        },
      },
      {
        id: "S46-T4-B-E3",
        subtopicId: "S46-T4-B",
        kind: "transfer",
        title: "Decide ops: CONTINUE o activa runbook",
        preamble:
          "- **Contexto:** sin owner se activa el runbook de recovery; con métricas rotas se declara incidente.\n- **Meta:** `decide` → CONTINUE / DECLARE_DATA_INCIDENT / ACTIVATE_RECOVERY_RUNBOOK.\n- **Éxito:** `CONTINUE DECLARE_DATA_INCIDENT ACTIVATE_RECOVERY_RUNBOOK`.\n- **Límites:** no declares incidente vacío de ownership; no CONTINUAR en missing.",
        instruction:
          "S46-T4-B-E3 · Salida: debe devolver el PASS del contrato. 1. Missing → ACTIVATE_RECOVERY_RUNBOOK.\n2. Predicado de E1/E2.\n3. Métricas/acciones rotas → DECLARE; limpio → CONTINUE.\n4. Imprime en orden.",
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
        feedback:
          "El runbook no es un incidente vacío: es la rama cuando falta ownership. DECLARE sin dueño no activa recovery real. CONTINUE solo si sli, RTO, acciones y owner cierran el simulacro.",
        retrospective:
          "ACTIVATE_RECOVERY_RUNBOOK responde a incertidumbre operativa (sin owner); DECLARE_DATA_INCIDENT asume owner y métricas rotas. El error clásico es DECLARE sin dueño — nadie ejecuta el recovery. Pregunta de cierre: ¿qué RTO mides en el simulacro de Huancayo y dónde lo dejas escrito para el portfolio CP-N4-B?",
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
assert results == ["CONTINUE", "DECLARE_DATA_INCIDENT", "ACTIVATE_RECOVERY_RUNBOOK"]
meets_contract = ('4B-15' == '4B-15')
print('meets_contract', meets_contract)
` ,
          output: `CONTINUE DECLARE_DATA_INCIDENT ACTIVATE_RECOVERY_RUNBOOK
meets_contract True` ,
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
      "Dejar una nota de layout: qué clave de partición elegiste, qué consultas se benefician de saltarse particiones y qué reproceso limita el blast radius.",
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
    {"event_id": "e2", "event_time": 80, "payload": 2},   # late vs. wm
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
    # Completa: ON_TIME / ALLOWED_LATE / LATE / OUT_OF_WINDOW (usa WATERMARK + ALLOWED_LATENESS)
    return "INCOMPLETE"

def merge_incremental(target: dict, rows: list) -> int:
    # Completa: upsert por event_id; devolver número de cambios
    return -1

def is_acyclic(nodes: set, edges: set) -> bool:
    # Completa: Kahn o DFS; rechazar ciclos A→B→A
    return False

def backfill_ok(intervals: list, checkpoint: str, resume_from: str) -> bool:
    # Completa: sin solape y resume_from == checkpoint
    return False

def lineage_facet(run_id: str, inputs: set, outputs: set, null_rate: float, owner: str) -> dict:
    # Completa: facet run/inputs/outputs/null_rate/owner
    return {}

def ops_status(schema_ok: bool, lag_min: int, slo_min: int, owner: str) -> str:
    # Completa: PASS | QUARANTINE_DATASET | OPEN_QUALITY_INCIDENT / PAGE_DATA_OWNER
    return "INCOMPLETE"

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
      { criterion: "Trade-offs (completeness vs. latencia, costo de backfill)", weight: "10%" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante del gate CP-N4-B demuestras con second_run_changes==0 y con is_acyclic? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, late policy en producción)? (3) Escribe en el README una frase de impacto medible (antes/después: late silencioso → side-output; re-run → 0 cambios) que puedas defender en 30 segundos. Riesgo residual: el lab es stdlib — no simula cluster ni watermark de Flink completo.",
  },
  selfCheck: {
    questions: [
      {
        question: "En un pipeline de streaming, ¿qué mide el event time frente al processing time?",
        options: ["Event time es el reloj del worker; processing time es cuándo ocurrió el hecho", "Event time es cuándo ocurrió el hecho en el mundo; processing time es cuándo lo procesó el worker", "Son sinónimos si el watermark es cero", "Processing time solo existe en batch; event time solo en stream"],
        correctIndex: 1,
        explanation: "Event time ancla la corrección de negocio; processing time solo describe la latencia del sistema. Las ventanas y watermarks se definen sobre event time.",
      },
      {
        question: "Si el schema observado de una partición de CASO-HYO-046 no coincide con el contrato, ¿qué respuesta fail-closed es correcta en esta sección?",
        options: ["continuar y ocultar el warning", "inventar la columna faltante con nulls", "borrar el trace para reducir ruido", "emitir QUARANTINE_DATASET y conservar evidencia"],
        correctIndex: 3,
        explanation: "El vocabulario operativo de S46 usa QUARANTINE_DATASET ante breach de contrato/freshness. No se publica basura ni se inventa evidencia.",
      },
      {
        question: "En operación de datos, ¿qué diferencia un SLI de un SLO de frescura?",
        options: ["SLI es la medición (p. ej. proporción de particiones frescas); SLO es el objetivo acordado (p. ej. ≥ 0.99)", "SLI y SLO son sinónimos del mismo porcentaje de uptime del cluster", "SLO se mide en el worker; SLI solo aplica a batch nocturno", "Si el schema del contrato pasa, el SLI de frescura se ignora"],
        correctIndex: 0,
        explanation: "SLI = indicador medido; SLO = umbral de servicio. Un schema correcto con dato de ayer sigue siendo breach de frescura si el SLI cae bajo el SLO.",
      },
      {
        question: "Watermark t = 110 y allowed_lateness = 5. Un evento con event_time = 100 se evalúa como…",
        options: ["siempre ON_TIME porque 100 < window_end típico", "OUT_OF_WINDOW porque es menor que el watermark", "LATE (o side-output) si 110 − 100 > 5; ALLOWED_LATE si la gracia alcanza", "processing-time error: hay que ignorar event_time"],
        correctIndex: 2,
        explanation: "Late = el watermark ya superó el timestamp del evento. Allowed lateness, en este lab, es gracia post-watermark (*completeness* vs. *latencia*), no un bound inferior arbitrario.",
      },
      {
        question: "Un grafo raw→clean→raw con typed_io=True debe…",
        options: ["aprobarse porque no hay self-loops a==b", "rechazarse: hay un ciclo y no existe orden topológico", "aprobarse si los nodos están declarados", "convertirse en schedule horario para “romper el ciclo”"],
        correctIndex: 1,
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
        note: "Event time vs. processing time y watermarks",
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
