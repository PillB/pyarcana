import type { CourseSection } from '../../types'

export const section32: CourseSection = {
  id: "microservices",
  index: 32,
  title: "Feature engineering y pipelines sin leakage",
  shortTitle: "Features sin leakage",
  tagline:
    "Tabla de features versionada con train≡serve, sin futuro ni labels de decisión. Ritmo sugerido: ~10–12 h de núcleo (T1–T4 + labs E1), 14–16 h con E2/E3 y You Do, 18 h si profundizas skew y versionado hacia S33.",
  estimatedHours: 18,
  level: "Integración avanzada",
  phase: 2,
  icon: "TableProperties",
  accentColor: "bg-gradient-to-br from-indigo-500 to-violet-800",
  jobRelevance:
    "Las features mal hechas filtran el futuro (usan datos que solo existirán después de la decisión) y producen modelos que fallan en producción. Aquí aprendes a construir una tabla de features versionada con la misma lógica en entrenamiento e inferencia, sin timestamps futuros ni labels de decisión. Las features de grafo o contacto compartido son señales para el modelo o la cola humana, no etiquetas de fraude ni de parentesco.",
  learningOutcomes: [
    { text: "Diseñar un feature catalog (numéricas, categóricas y de texto) y validar que las keys del row ⊆ catálogo antes del fit; evidencia: catalog_ok y lista unknown_keys." },
    { text: "Aplicar missing indicators, fill con mediana de train y z-score con μ/σ congelados; demostrar silent_fill=False." },
    { text: "Construir features relacionales (shared_address, degree, min path) sin usar label de decisión como input." },
    { text: "Calcular conteos y frecuencias en ventanas half-open [t−w, t) documentadas en el catálogo." },
    { text: "Componer transformers custom con fit→transform y cadena por tipo de columna (ruta numérica vs. categórica)." },
    { text: "Persistir estado fit (mediana, vocab, version) como JSON fs-vN y reutilizarlo en el batch de serve." },
    { text: "Partir por tiempo y entidad con informe de split: n_train, n_test y overlap de entidades = 0." },
    { text: "Ejecutar scan de nombres leaky + alerta de skew train–serve y promover solo con feature_set id válido." },
  ],
  theory: [
    {
            heading: "El modelo que brilla en el notebook y se derrumba en producción",
      paragraphs: [
        "El AUC era excelente. Se despliega, y el score colapsa. No hubo un error de código ni un cambio de datos: el modelo entrenó con información que, en el momento real de decidir, todavía no existía. Eso es **leakage**, y es el fallo más caro de esta parte del curso porque no lanza ninguna excepción — solo produce una promesa que la realidad no cumple.",
        "Vale la pena ver el mecanismo en concreto, porque enunciado suena obvio y en la práctica no lo es. Un notebook cuenta eventos con `ts <= t`, incluyendo el instante mismo de la decisión; el AUC sube. En producción, con la ventana correcta, ese conteo es otro. Segunda variante, más sutil: la mediana usada para normalizar se calculó sobre todo el dataset, entrenamiento y prueba juntos — así que el conjunto de prueba influyó en cómo se transformó a sí mismo.",
        "De ahí sale la pregunta que hay que hacerle a cada feature, una por una: **¿este valor existiría, con este número, en el instante en que el sistema tiene que decidir?** Si la respuesta necesita un «bueno, en realidad…», la feature no entra.",
        "Hay un segundo tipo de fuga que no tiene que ver con el tiempo sino con la respuesta. Una columna llamada `decision_final` o `label_revisado` describe el resultado que intentas predecir. Entrenar con ella da métricas perfectas y un modelo inútil, porque en el momento de predecir esa columna está vacía.",
        "La consecuencia práctica ordena toda la sección: la transformación que aplicas al entrenar y la que aplicas al servir tienen que ser **la misma pieza de código**, no dos implementaciones que se parecen. Cuando son dos, divergen, y la divergencia se nota como una caída de rendimiento sin causa aparente. Trabajas con eventos y el grafo sintético que viene de S31.",
      ],
      callout: {
        type: "info",
        title: "Gate features",
        content:
          "Train≡serve, sin leakage temporal ni de label. Solo PII sintético (caso Red Andina / workbench CP-N3-B, sin PII real). Si hay timestamps futuros en features, la sección no se considera superada.",
      },
    },
    {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Entregable y criterios de cierre.",
        "**Producto incremental.** Un catálogo de features y transformadores cuyo ajuste y aplicación son idénticos en entrenamiento e inferencia, sin información futura ni etiquetas de decisión usadas como feature. La entrada son los eventos y el grafo sintético que continúa el de S31 — dirección compartida, teléfono compartido, transferencias.",
        "**Criterio de cierre.** Equivalencia entre entrenamiento y servicio, sin fuga temporal ni de etiqueta. Si quedan timestamps futuros en las features, la sección no se considera superada. Solo datos sintéticos.",
      ],
    },
    {
      heading: "Diccionario mínimo de la sección",
      paragraphs: [
        "**Leakage:** usar en el entrenamiento información que no existiría en el momento de la decisión (futuro, label, o identidad vista en test). **Train≡serve:** el código y el estado (mediana, vocabulario, μ/σ) que transforman filas en train son los mismos que en inferencia. Si solo el notebook de train conoce un fill o un vocab, hay skew silencioso.",
        "**Ventana half-open [t−w, t):** cuenta eventos con timestamp ≥ t−w y **estrictamente < t**; no incluye el instante de decisión. **Feature set `fs-vN`:** identificador versionado del catálogo + transformers fit; un cambio de vocab o schema sube N. **Skew train–serve:** divergencia de distribuciones o de lógica entre entrenamiento e inferencia; se monitorea (p. ej. |mean_serve − mean_train| > tol).",
        "**Fail-closed en features:** si falta catálogo, estado fit o ventana documentada, no inventes valores: devuelve `REQUEST_*` (pedir el prerequisito). Si detectas futuro, label-as-feature, silent fill u overlap de entidades, devuelve `REJECT_*` (incumplimiento demostrado). Ausencia ≠ incumplimiento. El vocabulario de gates es entrevista-relevante y se reutiliza en MLOps posteriores.",
      ],
      callout: {
        type: "tip",
        title: "Cómo leer este diccionario",
        content:
          "Vuelve aquí cuando veas train≡serve, half-open, fs-vN o skew. Cada subtema reutiliza estas definiciones con un mini-demo computable.",
      },
    },
    {
      heading: "Features numéricas, categóricas y de texto",
      subtopicId: "S32-T1-A",
      paragraphs: [
        "Diseña con **semántica temporal**: ¿la feature está **disponible en t de decisión**? Numéricas (montos, conteos), categóricas (canal, región) y texto derivado (`note_len`, `token_count`) viven en un **feature catalog** con dtype y missing policy. Una columna inventada solo en serve rompe train≡serve y suele ser síntoma de notebook ad-hoc.",
        "Contrato operativo: entrada schema `type→cols` y row; salida listas por tipo y validación `keys ⊆ catálogo`. Error: feature desconocida en serve o dtype roto. Criterio: **catálogo completo antes de fit**. Las features de texto no son el string crudo: documentas el derivado (longitud, conteo de tokens) como entrada del catálogo.",
        "Aplicación al caso sintético Red Andina: schema numéricas `amount_7d`; categórica `canal`; texto `note` con derivado `note_len`; row keys validadas contra catálogo del run `cpn3b-feat` (sintético, sin PII real). Si aparece `unknown_feat`, el gate es `REJECT_UNKNOWN_FEATURE`.",
      ],
      code: {
        language: 'python',
        title: "catalog.py",
        code: `def catalog_check(schema: dict, row: dict) -> tuple:
    known = set(schema["numeric"] + schema["categorical"] + schema["text"])
    unknown_keys = sorted(k for k in row if k not in known)
    # note_len es feature derivada documentada; no se inventa en serve
    note_len = len(row["note"]) if "note" in row else 0
    catalog_ok = len(unknown_keys) == 0
    return sorted(schema["numeric"]), note_len, catalog_ok, unknown_keys

schema = {"numeric": ["amount_7d"], "categorical": ["canal"], "text": ["note"]}
row = {"amount_7d": 10.0, "canal": "app", "note": "hola mundo"}
nums, note_len, ok, unknown = catalog_check(schema, row)
print(nums)
print("note_len", note_len)
print("catalog_ok", ok, "unknown", unknown)`,
        output: `['amount_7d']
note_len 10
catalog_ok True unknown []`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato local — catálogo y keys. Si el catálogo existe y el row lo viola: `REJECT_UNKNOWN_FEATURE`. Si falta el catálogo: `REQUEST_CATALOG`.",
      },
    },
    {
      heading: "Missing indicators, escalamiento y encoding",
      subtopicId: "S32-T1-B",
      paragraphs: [
        "Un **missing indicator** (1 si el valor era ausente) + fill (mediana/moda de **train**) preserva la **señal de ausencia**. Rellenar en silencio con 0 o con la mediana del set completo es **silent fill** y suele filtrar estadísticas de test. El z-score usa **μ/σ solo de train**, congelados en fit; reestimarlos en serve es leakage o skew.",
        "Contrato: entrada serie con `None`, fill/μ/σ aprendidos en train; salida indicator, serie rellena y z sobre la serie rellena. Error: calcular mediana con filas de test o re-fit en serve. Criterio: **stats congeladas en fit**. Encoding one-hot con columna `unknown` sigue la misma idea: vocab de train, no del batch de serve.",
        "Aplicación al caso sintético Red Andina: `[1, None, 3]` → indicator + fill con la mediana **de train** (2) → z aplicando los μ=0 y σ=2 **congelados en el fit de train**, no recalculados sobre esta serie. Si los recalcularas aquí obtendrías μ=2, y esa diferencia es exactamente la fuga que la sección persigue. `silent_fill` debe quedar en False porque el indicator viaja junto al valor.",
      ],
      code: {
        language: 'python',
        title: "missing_scale.py",
        code: `def missing_and_scale(vals, fill=2.0, mu=0.0, sd=2.0):
    ind = [v is None for v in vals]
    filled = [fill if v is None else float(v) for v in vals]
    # μ/σ provienen del fit en train (congelados); nunca se reestiman en serve/test
    z = [(x - mu) / sd for x in filled]
    return ind, filled, z

ind, filled, z = missing_and_scale([1, None, 3], fill=2.0, mu=0.0, sd=2.0)
print(ind, filled)
print(z)
print("silent_fill", False)`,
        output: `[False, True, False] [1.0, 2.0, 3.0]
[0.5, 1.0, 1.5]
silent_fill False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato local — indicator y stats de train. Si rellenas sin marcar la ausencia: `REJECT_SILENT_FILL`. Si falta la mediana de train: `REQUEST_MEDIAN`.",
      },
    },
    {
      heading: "Contacto compartido, distancia y features de grafo",
      subtopicId: "S32-T2-A",
      paragraphs: [
        "Features **relacionales** (`shared_address`, degree, min path) resumen evidencia del grafo de S31. **No** conviertas el score de matching ni la centralidad en label de parentesco o fraude: son inputs para el modelo o la cola, no veredictos. Un path ausente se codifica con default alto (p. ej. 99), no con inventar aristas. El mini-fixture de vecinos y paths que usas aquí es la misma forma conceptual del grafo de evidencia de S31 (contacto compartido, aristas sintéticas), empaquetado como columnas de feature — no como veredicto.",
        "Contrato: entrada dos entidades (attrs), vecinos y tabla de paths; salida shared binario, degree y pathlen (default 99 si missing). Error: usar **label de decisión** o post-outcome como feature (p. ej. `label_fraud` o `decision_final`). Criterio: solo topología y atributos **observados en t**. Si falta el grafo, pide `REQUEST_GRAPH_FEAT` en lugar de inventar `degree=0`.",
        "Aplicación al caso sintético Red Andina: `shared_address=1` cuando dos entidades comparten `Av1`; degree de E1 = 2 vecinos (`E2`, `E3`); min path E1–E9 ausente en la tabla → 99. En Lima–Arequipa ficticio eso alimenta el score o la cola humana, **nunca** un veredicto de parentesco o fraude.",
      ],
      code: {
        language: 'python',
        title: "graph_feat.py",
        code: `def graph_feats(a: dict, b: dict, neighbors: dict, paths: dict, e="E1", other="E9") -> tuple:
    shared = int(a.get("addr") == b.get("addr"))
    degree = len(neighbors.get(e, []))
    key = e + "-" + other
    path = paths.get(key, 99)
    return shared, degree, path

# mini-fixture alineado al grafo de evidencia S31 (sintético, sin PII real)
shared, degree, path = graph_feats(
    {"addr": "Av1"},
    {"addr": "Av1"},
    {"E1": ["E2", "E3"]},
    {"E1-E2": 1},  # E1-E9 ausente → default 99
)
print("shared", shared)
print("degree", degree)
print("path", path)`,
        output: `shared 1
degree 2
path 99`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato local — features de grafo. Si usas label de decisión como input: `REJECT_LABEL_AS_FEATURE`. Si falta el grafo: `REQUEST_GRAPH_FEAT`.",
      },
    },
    {
      heading: "Ventanas temporales y frecuencia",
      subtopicId: "S32-T2-B",
      paragraphs: [
        "Ventanas **half-open** `[t−w, t)` cuentan eventos **sin** incluir el instante de decisión `t`. Incluir `ts==t` o **futuro** es **leakage temporal clásico**: el modelo “ve” el outcome o el mismo evento de decisión. Documenta la política en el feature catalog para que train y serve no diverjan.",
        "Contrato: entrada lista `ts`, `t`, `w` (y opcionalmente canal); salida count en ventana y freq por canal. Error: `ts >= t` dentro del count. Criterio: política half-open **documentada** y testeada con un caso que incluya `ts==t`. Compara siempre el conteo **cerrado** (mal) vs. **half-open** (bien) en el mismo fixture: si el score offline solo sube con el cerrado, sospecha leakage.",
        "Aplicación al caso sintético Red Andina: eventos `[1, 2, 3, 5]` con `t=5`, `w=3` → half-open cuenta `2` y `3` (`count=2`); el cerrado mal contaría también `5` (`count=3`). Frecuencia app/web se calcula solo sobre el subconjunto half-open.",
      ],
      code: {
        language: 'python',
        title: "window.py",
        code: `def window_count(events, t, w, closed=False):
    if closed:
        return sum(1 for ts in events if t - w <= ts <= t)  # mal: incluye t
    return sum(1 for ts in events if t - w <= ts < t)  # bien: half-open

events, t, w = [1, 2, 3, 5], 5, 3
count = window_count(events, t, w)
bad = window_count(events, t, w, closed=True)
includes_t = any(ts == t for ts in events if t - w <= ts < t)
print("count", count, "closed_bad", bad)
print("includes_t", includes_t)
print("policy", "half_open")`,
        output: `count 2 closed_bad 3
includes_t False
policy half_open`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato local — ventana half-open. Si incluyes el instante t o el futuro: `REJECT_FUTURE_TS`. Si falta el ancho w: `REQUEST_WINDOW`.",
      },
    },
    {
      heading: "Transformers custom y cadena fit→transform",
      subtopicId: "S32-T3-A",
      paragraphs: [
        "Un **transformer** tiene `fit` (aprende estado) y `transform` (aplica). Encadenar fill luego scale exige `fitted=True`; **transform antes de fit debe fallar** de forma explícita — no silent default en serve. En sklearn el mismo contrato se formaliza con `Pipeline` (pasos en serie) y `ColumnTransformer` (pasos por columnas); aquí lo modelamos en Python puro para ver el contrato sin magia de librería y sin riesgo de APIs no instaladas en el workbench.",
        "Contrato: entrada serie categórica (o batch multi-columna) y steps; salida moda fit, transform `None→moda`, y error si `not_fitted`. Para columnas heterogéneas, un **router por tipo** (análogo de ColumnTransformer) aplica imputer/scale a numéricas y mode-imputer a categóricas. Un **MiniPipeline** encadena steps con un solo `fit` y un solo `transform` — la idea de sklearn Pipeline en pocas líneas. Criterio: **secuencia determinista train≡serve**.",
        "Aplicación al caso sintético Red Andina: moda de canal `app`; cadena numérica fill0 luego *2 sobre montos; `not_fitted` levanta error si transform se llama antes de fit. Cuando migres a sklearn en el stack de producción, reutilizas el mismo orden mental: fit solo en train, transform en serve con estado congelado.",
      ],
      code: {
        language: 'python',
        title: "transformer.py",
        code: `class ModeImputer:
    def __init__(self):
        self.mode = None
    def fit(self, xs):
        self.mode = max(set(xs), key=xs.count)
        return self
    def transform(self, xs):
        if self.mode is None:
            raise RuntimeError("not fitted")
        return [self.mode if x is None else x for x in xs]

class MiniPipeline:
    """Analogía de sklearn.Pipeline: fit en orden, transform en orden."""
    def __init__(self, steps):
        self.steps = steps  # lista de (nombre, transformer)
    def fit(self, xs):
        for _, t in self.steps:
            t.fit(xs)
            xs = t.transform(xs)
        return self
    def transform(self, xs):
        for _, t in self.steps:
            xs = t.transform(xs)
        return xs

def column_router(batch, numeric_cols, cat_cols, num_state, cat_imputer):
    out = {}
    for c in numeric_cols:
        fill = num_state["fill"]
        out[c] = [(fill if v is None else v) * num_state["scale"] for v in batch[c]]
    for c in cat_cols:
        out[c] = cat_imputer.transform(batch[c])
    return out

imp = ModeImputer().fit(["app", "app", "web"])
print(imp.transform([None, "web"]))
pipe = MiniPipeline([("impute", ModeImputer())])
print("pipe", pipe.fit(["app", "app", "web"]).transform([None, "web"]))
routed = column_router(
    {"amount": [None, 3], "canal": [None, "web"]},
    ["amount"], ["canal"],
    {"fill": 0, "scale": 2},
    imp,
)
print("amount", routed["amount"], "canal", routed["canal"])
print("fitted", True)`,
        output: `['app', 'web']
pipe ['app', 'web']
amount [0, 6] canal ['app', 'web']
fitted True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato local — fit→transform y router por columnas. Si transformas sin fit: `REJECT_TRANSFORM_BEFORE_FIT`. Si falta el state de fit: `REQUEST_FIT_STATE`.",
      },
    },
    {
      heading: "Fit, transform y persistencia del estado",
      subtopicId: "S32-T3-B",
      paragraphs: [
        "El **estado** (mediana, vocab, μ/σ) se serializa a JSON y se **reutiliza en serve**. Si el vocab o el schema cambian, hay **version bump** del feature set (`fs-v1` → `fs-v2`). Aplicar la mediana de train al batch de serve evita **skew silencioso**: reestimar en inferencia es otra forma de leakage. En producción, joblib o pickle cumplen el mismo rol que este JSON; aquí lo inspeccionas a ojo para ver el contrato sin binarios opacos.",
        "Contrato: entrada state dict con `median` y `version`; salida round-trip JSON idéntico y apply de mediana al batch de serve. Error: servir **sin version** o con version vacía. Criterio: `fs-vN` en artefactos, schema congelado y misma función de apply en train e inferencia. Un serve sin `version` es `REJECT_UNVERSIONED`; sin JSON de state es `REQUEST_STATE_JSON`.",
        "Aplicación al caso sintético Red Andina: state `median=2`, `version=fs-v1` sobrevive al round-trip; al batch de serve `[None, 4]` se aplica → `[2, 4]`. Si mañana el vocab de `canal` crece, subes a `fs-v2` y el baseline S33 debe citar el id nuevo — no reutilizar el viejo en silencio. Este artefacto JSON es el **contrato de entrada** del baseline de S33.",
      ],
      code: {
        language: 'python',
        title: "persist.py",
        code: `import json

def load_state(state: dict) -> dict:
    return json.loads(json.dumps(state))

def apply_median(batch, state):
    m = state["median"]
    return [m if x is None else x for x in batch]

loaded = load_state({"median": 2, "version": "fs-v1"})
print(loaded["median"])
print("version", loaded["version"])
print("serve", apply_median([None, 4], loaded))`,
        output: `2
version fs-v1
serve [2, 4]`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato local — state versionado. Si sirves sin version: `REJECT_UNVERSIONED`. Si falta el JSON de state: `REQUEST_STATE_JSON`.",
      },
    },
    {
      heading: "Split por entidad, grupo y tiempo",
      subtopicId: "S32-T4-A",
      paragraphs: [
        "**Split temporal** (`train ts < cutoff`) y **group split por entity** evitan overlap. Si una entidad aparece en train y test, hay **leakage de identidad**: el modelo memoriza la entidad, no el patrón generalizable. En un workbench de investigación relacional eso infla AUC offline y genera colas que confían en scores irreales.",
        "Contrato: entrada rows con `ts` y `entity`; salida particiones train/test y `overlap` count (cardinalidad de la intersección de entidades). Error: `overlap > 0` en el gate de promote. Criterio: informe de split con `n_train`, `n_test` y `overlap` explícitos — no basta un print de “ok” sin números.",
        "Aplicación al caso sintético Red Andina: cutoff `'2026-02-01'`; e1 solo en train (enero) y e2 solo en test (febrero) → **overlap entidades = 0**. Si e1 aparece en ambos lados, el gate es `REJECT_ENTITY_OVERLAP` y no se entrena el baseline S33 hasta corregir el split.",
      ],
      code: {
        language: 'python',
        title: "split.py",
        code: `def time_group_split(rows, cut):
    train = [r for r in rows if r["ts"] < cut]
    test = [r for r in rows if r["ts"] >= cut]
    overlap = set(r["entity"] for r in train) & set(r["entity"] for r in test)
    return len(train), len(test), len(overlap)

rows = [
    {"ts": "2026-01-10", "entity": "e1"},
    {"ts": "2026-02-10", "entity": "e2"},
]
n_tr, n_te, ov = time_group_split(rows, "2026-02-01")
print("n_train", n_tr, "n_test", n_te)
print("overlap", ov)
print("ok", ov == 0)`,
        output: `n_train 1 n_test 1
overlap 0
ok True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato local — split temporal o por grupo. Si hay overlap de entidades: `REJECT_ENTITY_OVERLAP`. Si faltan filas o keys de split: `REQUEST_SPLIT_KEYS`.",
      },
    },
    {
      heading: "Leakage, skew train–serve y versionado",
      subtopicId: "S32-T4-B",
      paragraphs: [
        "Nombres con `label` o `decision` en el catálogo de features son **red flags** de leakage: el modelo estaría entrenando con la respuesta. Si `serve_mean` se desvía **> tol** de `train_mean` sobre la misma feature, hay **train–serve skew** (lógica o distribución distinta entre notebook e inferencia). El feature set id `fs-vN` **congela** el contrato promovido hacia S33. Promover con leakage o skew es fallo de gate, no un “warning opcional”.",
        "Contrato: entrada lista de nombres, medias train/serve, tolerancia y version; salida lista leaky, booleano skew y fs id. Error: **promover** cuando leaky no está vacío, skew es True o falta el id. Criterio: scan de nombres + medición de skew en CI **antes** del baseline; el id promovido debe empezar por `fs-v`.",
        "Aplicación al caso sintético Red Andina: el scan marca `label_decision`; skew alerta si `|0.8 − 0.0| > 0.5`. Solo con leaky vacío, skew False y `feature_set` tipo `fs-v2` se imprime el promote limpio que S33 puede citar. Si falta el id → `REQUEST_FEATURE_SET_ID`.",
      ],
      code: {
        language: 'python',
        title: "leakage.py",
        code: `def leak_scan(names):
    return [n for n in names if "label" in n or "decision" in n]

def skew_alert(train_mean, serve_mean, tol=0.5):
    return abs(serve_mean - train_mean) > tol

print("leaky", leak_scan(["amount_7d", "label_decision"]))
print("skew", skew_alert(0.0, 0.8))
print("feature_set", "fs-v2")`,
        output: `leaky ['label_decision']
skew True
feature_set fs-v2`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "Contrato local — scan de leakage, skew y fs-vN. Si hay leaky o skew: `REJECT_LEAKAGE`. Si falta el id del feature set: `REQUEST_FEATURE_SET_ID`.",
      },
    }
  ],
  iDo: {
    intro: "S32 · **Yo hago**: te muestro catálogo, missing/scale, grafo (puente S31), ventanas half-open, transformers fit→transform y anti-leakage sobre `run_id=cpn3b-feat`. Cada demo **calcula** el concepto a partir de datos sintéticos — no flags prebakeados. Luego en We Do reparas el mismo kernel; en You Do empaquetas el `fs-vN` para S33.",
    steps: [
      {
        demoId: "S32-T1-A-DEMO",
        subtopicId: "S32-T1-A",
        environment: "local-python",
        description: "Valida keys del row contra el catálogo y reporta note_len como feature derivada.",
        preamble:
          "Antes de fittear un imputer o un z-score, el workbench CP-N3-B exige un **catálogo** de features: sin él, serve inventa columnas y rompe train≡serve. En esta demo un row sintético Red Andina (`amount_7d`, `canal`, `note`) se valida contra schema tipado y se deriva `note_len`. No escribas aún: predice la lista numérica, la longitud de `\"hola\"` y si `catalog_ok` es True; luego contrasta con la salida. Si aparece una key fuera del catálogo, el gate no es “ignorar en silencio”.",
        code: {
          language: 'python',
          title: "cat_demo.py",
          code: `def catalog_check(schema, row):
    known = set(schema["numeric"] + schema["categorical"] + schema["text"])
    unknown = sorted(k for k in row if k not in known)
    note_len = len(row.get("note", ""))
    return sorted(schema["numeric"]), note_len, len(unknown) == 0

schema = {"numeric": ["amount_7d"], "categorical": ["canal"], "text": ["note"]}
row = {"amount_7d": 10.0, "canal": "app", "note": "hola"}
nums, note_len, ok = catalog_check(schema, row)
print(nums)
print("note_len", note_len)
print("catalog_ok", ok)`,
          output: `['amount_7d']
note_len 4
catalog_ok True`,
        },
        why: "El catálogo es la fuente de verdad de dtypes y política de missing. `note_len` se documenta como feature derivada, no se inventa en serve. Keys del row ⊆ catálogo es el contrato local antes de cualquier fit: una feature desconocida en producción es `REJECT_UNKNOWN_FEATURE`, no un warning opcional. Sin catálogo, train y serve divergen en silencio.",
        retrospective:
          "Si puedes explicar por qué una columna “solo en el notebook de serve” rompe train≡serve sin mirar el código, ya tienes el hábito de catálogo primero. El error clásico es confiar en el dict del row. En We Do practicarás unknown keys y `REQUEST_CATALOG`.",
      },
      {
        demoId: "S32-T1-B-DEMO",
        subtopicId: "S32-T1-B",
        environment: "local-python",
        description: "Missing indicator, fill mediana y z-score sobre la serie rellena con stats de train.",
        preamble:
          "Un `None` en montos del caso Red Andina no es “cero barato”: la ausencia es señal. Esta demo marca missing, rellena con mediana de train (2.0) y aplica z-score con μ/σ **congelados** sobre la serie rellena. No escribas: predice `ind`, `filled` y `z` para `[1, None, 3]`; observa que no se reestiman stats en serve. Si rellenas sin indicator, cometes silent fill.",
        code: {
          language: 'python',
          title: "ms_demo.py",
          code: `def missing_and_scale(vals, fill=2.0, mu=0.0, sd=2.0):
    ind = [v is None for v in vals]
    filled = [fill if v is None else float(v) for v in vals]
    z = [(x - mu) / sd for x in filled]
    return ind, filled, z

ind, filled, z = missing_and_scale([1, None, 3])
print(ind)
print(filled)
print(z)`,
          output: `[False, True, False]
[1.0, 2.0, 3.0]
[0.5, 1.0, 1.5]`,
        },
        why: "El indicator preserva la señal de ausencia; fill y μ/σ solo de train bloquean leakage de test. El z se calcula sobre `filled`, no sobre constantes ni sobre stats reestimadas en serve. Rellenar sin indicator es silent fill (`REJECT_SILENT_FILL`): el modelo cree que no faltó nada y la cola de revisión confía en un score mentiroso.",
        retrospective:
          "Indicator + stats de train = contrato de missing/scale: la ausencia es señal, no un cero barato. El error clásico es rellenar en silencio o reestimar μ/σ en serve y creer que el z “se ve bien”. Pregunta: ¿por qué el z se calcula sobre `filled` y no sobre la lista original con `None`? We Do: corregir z y fallar closed sin mediana.",
      },
      {
        demoId: "S32-T2-A-DEMO",
        subtopicId: "S32-T2-A",
        environment: "local-python",
        description: "Shared address, degree y path con default 99 cuando falta la arista en el grafo sintético.",
        preamble:
          "Las features relacionales del grafo de evidencia (S31) resumen topología: dirección compartida, degree, min path. En esta demo, dos entidades con `Av1`, vecinos de E1 y path a E9 **ausente** producen shared=1, degree=2, path=99. No escribas: predice los tres números. Recuerda: shared address **no** es etiqueta de parentesco ni de fraude — es input para el modelo o la cola humana.",
        code: {
          language: 'python',
          title: "g_demo.py",
          code: `def graph_feats(a_addr, b_addr, neighbors, paths, src="E1", dst="E9"):
    shared = int(a_addr == b_addr)
    degree = len(neighbors.get(src, []))
    path = paths.get(src + "-" + dst, 99)
    return shared, degree, path

shared, degree, path = graph_feats(
    "Av1", "Av1",
    {"E1": ["E2", "E3"]},
    {"E1-E2": 1},
)
print("shared", shared)
print("degree", degree)
print("path", path)`,
          output: `shared 1
degree 2
path 99`,
        },
        why: "Solo topología y atributos observados en t entran como feature. Path ausente usa default alto (99), no inventar aristas. Label de decisión como input es `REJECT_LABEL_AS_FEATURE`; sin grafo se pide `REQUEST_GRAPH_FEAT`. Features de contacto (puente S31) resumen evidencia para el score o la cola, nunca un veredicto de parentesco o fraude.",
        retrospective:
          "Path missing → default alto (99), no arista inventada ni degree=0 “por si acaso”. El error clásico es convertir matching o shared address en veredicto de parentesco o fraude. Pregunta: ¿por qué un path ausente no debe codificarse como 0? We Do: shared/degree/path y rechazo de label-as-feature.",
      },
      {
        demoId: "S32-T2-B-DEMO",
        subtopicId: "S32-T2-B",
        environment: "local-python",
        description: "Cuenta eventos en ventana half-open [t-w, t), contrasta con el conteo cerrado (mal) y devuelve `includes_t=False`.",
        preamble:
          "Incluir el instante de decisión `t` en un conteo de eventos es **leakage temporal clásico**: el score offline sube y en serve colapsa. Esta demo contrasta half-open `[t−w, t)` (count=2) con cerrado `<= t` (count=3) sobre eventos `[1,2,3,5]`, t=5, w=3. No escribas: predice count, closed_bad e includes_t. Observa `ok True` solo con la política half-open.",
        code: {
          language: 'python',
          title: "w_demo.py",
          code: `def count_window(events, t, w, closed=False):
    if closed:
        return sum(1 for ts in events if t - w <= ts <= t)
    return sum(1 for ts in events if t - w <= ts < t)

events, t, w = [1, 2, 3, 5], 5, 3
count = count_window(events, t, w)
bad = count_window(events, t, w, closed=True)
includes_t = any(ts == t for ts in events if t - w <= ts < t)
print("count", count, "closed_bad", bad)
print("includes_t", includes_t)
print("ok", count == 2 and includes_t is False and bad == 3)`,
          output: `count 2 closed_bad 3
includes_t False
ok True`,
        },
        why: "Half-open elimina leakage temporal: el modelo no ve el instante de decisión. El cerrado infla features y el AUC offline (la historia del fallo del intro). `includes_t` se deriva del predicado, no de un flag suelto. Sin ancho `w` documentado no hay feature temporal legítima (`REQUEST_WINDOW`).",
        retrospective:
          "Si el score offline solo sube con ventana cerrada, sospecha leakage temporal: en serve el instante t no existe igual. El error clásico es `ts <= t` “por redondeo” o “porque se ve más estable”. Pregunta: con eventos `[1,2,3,5]`, t=5, w=3, ¿por qué half-open da 2 y cerrado 3? We Do: forzar half-open y `REQUEST_WINDOW`.",
      },
      {
        demoId: "S32-T3-A-DEMO",
        subtopicId: "S32-T3-A",
        environment: "local-python",
        description: "Fit de moda, transform de None, fallo si no hay fit, y router numérico/categórico (análogo ColumnTransformer).",
        preamble:
          "Un transformer tiene contrato: **fit** aprende estado, **transform** aplica; transformar sin fit debe fallar ruidoso. Esta demo fitea la moda de canal (`app`), rellena None, muestra `not fitted` si se llama antes, y enruta amount/canal con fill y scale de train. No escribas: predice la salida de transform, el mensaje before_fit y el routed de amount. Es la idea de sklearn Pipeline/ColumnTransformer sin runtime extra.",
        code: {
          language: 'python',
          title: "tf_demo.py",
          code: `class ModeImputer:
    def __init__(self):
        self.mode = None
    def fit(self, xs):
        self.mode = max(set(xs), key=xs.count)
        return self
    def transform(self, xs):
        if self.mode is None:
            raise RuntimeError("not fitted")
        return [self.mode if x is None else x for x in xs]

def column_router(batch, num_cols, cat_cols, num_state, cat_imputer):
    out = {}
    for c in num_cols:
        f, s = num_state["fill"], num_state["scale"]
        out[c] = [(f if v is None else v) * s for v in batch[c]]
    for c in cat_cols:
        out[c] = cat_imputer.transform(batch[c])
    return out

imp = ModeImputer().fit(["app", "app", "web"])
print(imp.transform([None, "web"]))
print("fitted", imp.mode is not None)
try:
    ModeImputer().transform([None])
except RuntimeError as e:
    print("before_fit", str(e))
routed = column_router(
    {"amount": [None, 3], "canal": [None, "web"]},
    ["amount"], ["canal"], {"fill": 0, "scale": 2}, imp,
)
print("routed", routed["amount"], routed["canal"])`,
          output: `['app', 'web']
fitted True
before_fit not fitted
routed [0, 6] ['app', 'web']`,
        },
        why: "fit→transform ordenado es train≡serve: hardcodear fill en transform rompe el state versionable y el audit del notebook. El router por tipo separa numéricas y categóricas (idea de ColumnTransformer). Transform before fit debe fallar ruidoso (`REJECT_TRANSFORM_BEFORE_FIT`), no inventar silent defaults en serve. Puente a We Do: aprender moda real y fallar closed sin train_xs.",
        retrospective:
          "Estado fitted se demuestra con fit real sobre datos de train, no con un flag `fitted=True` prebakeado. El error clásico es silent default en serve (“siempre app”). Pregunta: ¿qué debe ocurrir si llamas `transform` antes de `fit`? We Do: aprender moda y `REQUEST_FIT_STATE`.",
      },
      {
        demoId: "S32-T3-B-DEMO",
        subtopicId: "S32-T3-B",
        environment: "local-python",
        description: "Round-trip JSON del state y apply de mediana versionada al batch de serve.",
        preamble:
          "El estado fit (mediana, vocab, μ/σ) debe **sobrevivir** al notebook: se serializa y se aplica igual en serve. Esta demo hace round-trip JSON de `{median: 2, version: fs-v1}` y rellena `[None, 4]` → `[2, 4]`. No escribas: predice median, version y serve. Si mañana cambia el vocab de `canal`, subes a `fs-v2` — S33 debe citar el id nuevo, no reutilizar el viejo en silencio.",
        code: {
          language: 'python',
          title: "ps_demo.py",
          code: `import json

state = {"median": 2, "version": "fs-v1"}
loaded = json.loads(json.dumps(state))
serve = [loaded["median"] if x is None else x for x in [None, 4]]
print(loaded["median"])
print("version", loaded["version"])
print("serve", serve)`,
          output: `2
version fs-v1
serve [2, 4]`,
        },
        why: "Persistir estado versionado evita skew silencioso entre train e inferencia. Apply de mediana de train es el mismo en ambos lados. Sin version legible no se promueve (`REJECT_UNVERSIONED`); sin JSON de state se pide el artefacto (`REQUEST_STATE_JSON`). `fs-vN` es lo que el baseline S33 citará.",
        retrospective:
          "`fs-vN` es el contrato de entrada del baseline: S33 debe citar el id, no reutilizar un state viejo en silencio. El error clásico es reestimar la mediana en serve o “solo imprimir version” sin apply. Pregunta: si cambia el vocab de `canal`, ¿reutilizas fs-v1 o subes a fs-v2? We Do: round-trip + discipline de version.",
      },
      {
        demoId: "S32-T4-A-DEMO",
        subtopicId: "S32-T4-A",
        environment: "local-python",
        description: "Time split por cutoff y verificación de overlap de entidades desde filas reales.",
        preamble:
          "Si la misma entidad aparece en train y test, el modelo memoriza identidad, no patrón generalizable: **leakage de identidad**. Esta demo parte filas sintéticas por cutoff `2026-02-01` (e1 en enero, e2 en febrero) y mide intersección de entidades. No escribas: predice n_train, n_test, overlap y ok. Observa que overlap 0 es el gate antes del baseline S33.",
        code: {
          language: 'python',
          title: "sp_demo.py",
          code: `rows = [
    {"ts": "2026-01-10", "entity": "e1"},
    {"ts": "2026-02-10", "entity": "e2"},
]
cut = "2026-02-01"
train = [r for r in rows if r["ts"] < cut]
test = [r for r in rows if r["ts"] >= cut]
overlap = set(r["entity"] for r in train) & set(r["entity"] for r in test)
print("n_train", len(train), "n_test", len(test))
print("overlap", len(overlap))
print("ok", len(overlap) == 0)`,
          output: `n_train 1 n_test 1
overlap 0
ok True`,
        },
        why: "Split temporal más aislamiento de entity es la defensa principal contra leakage de identidad. Overlap > 0 → `REJECT_ENTITY_OVERLAP`. El informe debe listar n_train, n_test y overlap explícitos (no un print “ok” vacío). Sin filas de split no hay auditoría (`REQUEST_SPLIT_KEYS`). Random split sobre filas con entidades repetidas infla el AUC y engaña a la cola.",
        retrospective:
          "Overlap de entidades infla métricas offline y engaña a la cola de revisión: el modelo memoriza identidad, no patrón. El error clásico es split aleatorio sobre filas con entidades repetidas o un print “ok” sin n_train/n_test/overlap. Pregunta: si e1 aparece en enero y febrero, ¿qué overlap reportas? We Do: calcular overlap, no hardcodearlo.",
      },
      {
        demoId: "S32-T4-B-DEMO",
        subtopicId: "S32-T4-B",
        environment: "local-python",
        description: "Scan de nombres leaky, alerta de skew y feature_set fs-v2 listo para S33.",
        preamble:
          "Nombres con `label` o `decision` en el catálogo son **red flags**: el modelo entrenaría con la respuesta. Esta demo escanea `['amount_7d', 'label_decision']`, mide skew |0.8−0.0| > 0.5 y muestra `feature_set fs-v2`. No escribas: predice leaky, skew y el id. En promote limpio (hacia S33) leaky vacío, skew False e id `fs-v*` son obligatorios — no “warnings opcionales”.",
        code: {
          language: 'python',
          title: "lk_demo.py",
          code: `def leaky_names(names):
    return [n for n in names if "label" in n or "decision" in n]

def skew_alert(train_mean, serve_mean, tol=0.5):
    return abs(serve_mean - train_mean) > tol

leaky = leaky_names(["amount_7d", "label_decision"])
skew = skew_alert(0.0, 0.8)
print(leaky)
print("skew", skew)
print("feature_set", "fs-v2")`,
          output: `['label_decision']
skew True
feature_set fs-v2`,
        },
        why: "Scan de nombres y skew en CI cierran el promote antes del baseline. Promover con leaky o skew es fallo de gate, no un warning. El id debe empezar por `fs-v`; sin id se pide el prerequisito (`REQUEST_FEATURE_SET_ID`). Esta demo muestra **detección** (leaky y skew True); el lab E1 usa fixture limpio de promote.",
        retrospective:
          "Scan + skew + fs-vN cierran el promote: no son warnings opcionales. El error clásico es colar `label_decision` “solo para el notebook” o promover con skew alto porque el AUC offline se ve bien. Pregunta: ¿esta demo muestra promote limpio o detección de fallos? (detección). We Do: invertir el gate defectuoso y exigir id.",
      }
    ],
  },
  weDo: {
    intro: "S32 · **Hacemos juntos** (E1) → **tú validas** (E2) → **transfieres fail-closed** (E3): 24 retos sobre CP-N3-B. Cada lab **recalcula** catálogo, escala, grafo, ventana, fit/persist o split desde datos sintéticos — no inviertes un booleano precomputado. Si falta un prerequisito, `REQUEST_*`; si hay leakage, `REJECT_*`.",
    steps: [
      {
        id: "S32-T1-A-E1",
        subtopicId: "S32-T1-A",
        kind: "guided",
        title: "Keys del row ⊆ catálogo (catalog_ok)",
        preamble:
          "- **Contexto:** en el feature set sintético Red Andina (`cpn3b-feat`), el fit solo arranca si el row no trae columnas inventadas.\n- **Meta:** calcular unknown keys como “en row y no en known” y dejar `catalog_ok` correcto.\n- **Éxito:** una línea exacta `S32-T1-A PASS`.\n- **Límites:** no inviertas el booleano final; no hardcodees `PASS`; solo PII sintético.",
        instruction:
          "1. Abre el starter: `unknown` usa `k in known` (DEFECT).\n2. Cambia a `k not in known`.\n3. Deja `catalog_ok = len(unknown) == 0` y el status PASS/REJECT.\n4. Imprime `S32-T1-A` y el status.",
        hint: "Une las listas del schema en un set known y compara set(row) ⊆ known.",
        hints: [
          "Une las listas del schema en un set known y compara set(row) ⊆ known.",
          "catalog_ok es True solo si no hay keys desconocidas; no inviertas el booleano final.",
        ],
        edgeCases: ["falta schema", "fixture adverso: row con unknown_feat fuera del catálogo", "Caso sintético Red Andina (sin PII real)"],
        tests: "Con schema y row del starter, imprime `S32-T1-A PASS` y assert catalog_ok.",
        feedback:
          "Sin keys desconocidas el catálogo pasa. El predicado al revés aprueba basura: una feature inventada en serve exige `REJECT_UNKNOWN_FEATURE`, no un fit optimista que engaña a la cola de revisión.",
        retrospective:
          "Unknown = row − catálogo, no al revés: si inviertes el predicado, “pasas” siempre y el fit arranca sobre basura. El error clásico es creer que “cualquier key del schema cuenta” en lugar de “solo las del row deben estar en known”. Pregunta: si el row trae solo `amount_7d` y el schema lista tres columnas, ¿qué sale en `unknown`? Siguiente (E2): tres rutas PASS / REJECT / MISSING.",
        starterCode: {
          language: 'python',
          title: "s32-t1-a-e1.py",
          code: `# E1 — catálogo de features (Red Andina sintético, sin PII real)
# DEFECT: unknown se calcula al revés (any-in-known en vez de not-in-known)
schema = {"numeric": ["amount_7d"], "categorical": ["canal"], "text": []}
row = {"amount_7d": 1.0, "canal": "app"}
known = set(schema["numeric"] + schema["categorical"] + schema["text"])
unknown = [k for k in row if k in known]  # DEFECT
catalog_ok = len(unknown) == 0
status = "PASS" if catalog_ok else "REJECT_UNKNOWN_FEATURE"
print("S32-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t1-a-e1.py",
          code: `schema = {"numeric": ["amount_7d"], "categorical": ["canal"], "text": []}
row = {"amount_7d": 1.0, "canal": "app"}
known = set(schema["numeric"] + schema["categorical"] + schema["text"])
unknown = [k for k in row if k not in known]
catalog_ok = len(unknown) == 0
status = "PASS" if catalog_ok else "REJECT_UNKNOWN_FEATURE"
print("S32-T1-A", status)
assert catalog_ok is True
` ,
          output: `S32-T1-A PASS` ,
        },
      },
      {
        id: "S32-T1-A-E2",
        subtopicId: "S32-T1-A",
        kind: "independent",
        title: "Assess: PASS, unknown y MISSING schema",
        preamble:
          "- **Contexto:** el gate de catálogo no es un booleano suelto: debe distinguir row válido, feature inventada y prerequisito ausente.\n- **Meta:** implementar `assess` calculando unknown keys (sin flag prebakeado).\n- **Éxito:** `PASS REJECT_UNKNOWN_FEATURE MISSING:schema`.\n- **Límites:** primero keys requeridas; no resuelvas el adverso cambiando `case_id`; no inventes schema.",
        instruction:
          "1. Revisa el starter: devuelve PASS cuando hay unknown (DEFECT).\n2. Si faltan keys → `MISSING:…`.\n3. Si hay unknown → `REJECT_UNKNOWN_FEATURE`; si no → `PASS`.\n4. Imprime las tres rutas en una línea.",
        hint: "Primero valida keys requeridas; solo si hay schema y row calculas unknown.",
        hints: [
          "Primero valida keys requeridas; solo si hay schema y row calculas unknown.",
          "El adverso falla por contenido (feature fuera del catálogo), no por schema ausente.",
        ],
        edgeCases: ["falta schema", "fixture adverso: unknown_feat no listada en schema", "Caso sintético Red Andina (sin PII real)"],
        tests: "Produce exactamente `PASS REJECT_UNKNOWN_FEATURE MISSING:schema`.",
        feedback:
          "El cálculo de unknown es la evidencia del gate. El adverso falla por *contenido* (feature fuera del catálogo), no por schema ausente: confundir ambos deja logs inútiles para la cola.",
        retrospective:
          "Tres códigos distintos son tres historias de ops: PASS (contrato sano), REJECT (violación demostrada), MISSING (falta prerequisito). Confundir “feature inventada” con “schema ausente” deja logs que nadie puede triagear en el promote. Pregunta: ¿por qué el adverso con `unknown_feat` no debe devolver `MISSING:schema`? Luego (E3) separas `REQUEST_CATALOG` de `REJECT`.",
        starterCode: {
          language: 'python',
          title: "s32-t1-a-e2.py",
          code: `# E2 — assess unknown feature (Red Andina sintético, sin PII real)
# DEFECT: PASS cuando hay unknown keys
def assess(record: dict) -> str:
    required = {"case_id", "schema", "row"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    schema, row = record["schema"], record["row"]
    known = set(schema["numeric"] + schema["categorical"] + schema["text"])
    unknown = [k for k in row if k not in known]
    # DEFECT: invierte el criterio
    return "PASS" if unknown else "REJECT_UNKNOWN_FEATURE"

valid = {"case_id": "caso-ra-1a", "schema": {"numeric": ["amount_7d"], "categorical": ["canal"], "text": []}, "row": {"amount_7d": 1.0, "canal": "app"}}
invalid = {"case_id": "caso-ra-1a", "schema": {"numeric": ["amount_7d"], "categorical": [], "text": []}, "row": {"unknown_feat": 1}}
incomplete = {**valid}
incomplete.pop("schema")
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "schema", "row"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    schema, row = record["schema"], record["row"]
    known = set(schema["numeric"] + schema["categorical"] + schema["text"])
    unknown = [k for k in row if k not in known]
    return "PASS" if not unknown else "REJECT_UNKNOWN_FEATURE"

valid = {"case_id": "caso-ra-1a", "schema": {"numeric": ["amount_7d"], "categorical": ["canal"], "text": []}, "row": {"amount_7d": 1.0, "canal": "app"}}
invalid = {"case_id": "caso-ra-1a", "schema": {"numeric": ["amount_7d"], "categorical": [], "text": []}, "row": {"unknown_feat": 1}}
incomplete = {**valid}
incomplete.pop("schema")
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
          output: `PASS REJECT_UNKNOWN_FEATURE MISSING:schema` ,
        },
      },
      {
        id: "S32-T1-A-E3",
        subtopicId: "S32-T1-A",
        kind: "transfer",
        title: "Fail-closed: REQUEST_CATALOG frente a REJECT",
        preamble:
          "- **Contexto:** en promote hacia S33, faltar el catálogo no es “seguir igual”: es pedir el prerequisito.\n- **Meta:** enrutar válido → CONTINUE, unknown → REJECT, sin schema → REQUEST_CATALOG.\n- **Éxito:** `CONTINUE REJECT_UNKNOWN_FEATURE REQUEST_CATALOG`.\n- **Límites:** ausencia ≠ incumplimiento; no inventes schema vacío para “pasar”.",
        instruction:
          "1. Lee el DEFECT: missing→CONTINUE y predicado invertido.\n2. Si faltan keys → `REQUEST_CATALOG`.\n3. Con schema: CONTINUE solo si no hay unknown.\n4. Imprime las tres decisiones.",
        hint: "Ausencia ≠ incumplimiento: enruta a REQUEST_CATALOG antes de mirar el row.",
        hints: [
          "Ausencia ≠ incumplimiento: enruta a REQUEST_CATALOG antes de mirar el row.",
          "CONTINUE solo si known cubre todas las keys del row.",
        ],
        edgeCases: ["falta schema", "fixture adverso: unknown_feat", "Caso sintético Red Andina (sin PII real)"],
        tests: "Salida: `CONTINUE REJECT_UNKNOWN_FEATURE REQUEST_CATALOG`.",
        feedback:
          "`REQUEST_CATALOG` protege el fit pidiendo el artefacto. `REJECT` solo cuando el catálogo existe y el row lo viola: continuar ciego deja el baseline S33 sobre columnas inventadas.",
        retrospective:
          "`REQUEST_*` pide artefacto; `REJECT_*` demuestra violación del contrato existente. El error clásico es CONTINUE cuando falta el catálogo o inventar un schema vacío “para pasar”. Pregunta: ¿qué imprimirías si el row trae `unknown_feat` y el schema sí existe? Ese hábito (pedir vs. rechazar) se reutiliza en todo el promote hacia S33.",
        starterCode: {
          language: 'python',
          title: "s32-t1-a-e3.py",
          code: `# E3 — decide REQUEST_CATALOG (Red Andina sintético, sin PII real)
# DEFECT: missing→CONTINUE; predicado de keys invertido
def decide(record: dict) -> str:
    required = {"case_id", "schema", "row"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    schema, row = record["schema"], record["row"]
    known = set(schema["numeric"] + schema["categorical"] + schema["text"])
    unknown = [k for k in row if k not in known]
    return "CONTINUE" if unknown else "REJECT_UNKNOWN_FEATURE"

valid = {"case_id": "caso-ra-1a", "schema": {"numeric": ["amount_7d"], "categorical": ["canal"], "text": []}, "row": {"amount_7d": 1.0, "canal": "app"}}
invalid = {"case_id": "caso-ra-1a", "schema": {"numeric": ["amount_7d"], "categorical": [], "text": []}, "row": {"unknown_feat": 1}}
uncertain = {**valid}
uncertain.pop("schema")
print(*[decide(r) for r in (valid, invalid, uncertain)])
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "schema", "row"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_CATALOG"
    schema, row = record["schema"], record["row"]
    known = set(schema["numeric"] + schema["categorical"] + schema["text"])
    unknown = [k for k in row if k not in known]
    return "CONTINUE" if not unknown else "REJECT_UNKNOWN_FEATURE"

valid = {"case_id": "caso-ra-1a", "schema": {"numeric": ["amount_7d"], "categorical": ["canal"], "text": []}, "row": {"amount_7d": 1.0, "canal": "app"}}
invalid = {"case_id": "caso-ra-1a", "schema": {"numeric": ["amount_7d"], "categorical": [], "text": []}, "row": {"unknown_feat": 1}}
uncertain = {**valid}
uncertain.pop("schema")
results = [decide(r) for r in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_UNKNOWN_FEATURE", "REQUEST_CATALOG"]
` ,
          output: `CONTINUE REJECT_UNKNOWN_FEATURE REQUEST_CATALOG` ,
        },
      },
      {
        id: "S32-T1-B-E1",
        subtopicId: "S32-T1-B",
        kind: "guided",
        title: "Z-score sobre la serie rellena",
        preamble:
          "- **Contexto:** en el pipeline numérico de CP-N3-B, el z-score no puede usar una lista hardcodeada: debe seguir a `filled`.\n- **Meta:** indicator + fill mediana + z con μ=0, σ=2 sobre filled; `silent_fill=False`.\n- **Éxito:** `S32-T1-B PASS`.\n- **Límites:** no escales constantes ajenas; no pongas silent_fill True; stats de train ya dadas.",
        instruction:
          "1. Abre el starter: `z` usa `[2, 4]` (DEFECT).\n2. Cambia a `for x in filled`.\n3. Comprueba ind, filled y z contra los valores esperados.\n4. Imprime `S32-T1-B` y el status.",
        hint: "z = (x - mu) / sd para cada x en filled, no sobre una lista hardcodeada.",
        hints: [
          "z = (x - mu) / sd para cada x en filled, no sobre una lista hardcodeada.",
          "silent_fill es False porque el indicator viaja con el valor relleno.",
        ],
        edgeCases: ["falta median", "fixture adverso: silent_fill=True o fill sin indicator", "Caso sintético Red Andina (sin PII real)"],
        tests: "Imprime `S32-T1-B PASS` cuando filled y z son correctos.",
        feedback:
          "Escalar la serie rellena es el patrón de stats solo de train. Un z “bonito” sobre constantes no se puede servir: silent fill o desalineación es `REJECT_SILENT_FILL` y engaña al score de la cola.",
        retrospective:
          "El z sigue a `filled`, no a un ejemplo de pizarra: si hardcodeas la salida, train≡serve se rompe en el primer batch real. El error clásico es copiar constantes del notebook “porque el assert pasa”. Pregunta: ¿qué se rompe si mañana la mediana de train deja de ser 2.0? Siguiente (E2): validar indicator vs. values.",
        starterCode: {
          language: 'python',
          title: "s32-t1-b-e1.py",
          code: `# E1 — silent fill ban + scale (Red Andina sintético, sin PII real)
# DEFECT: z-score ignora filled y usa constantes [2, 4]
vals = [1, None, 3]
fill, mu, sd = 2.0, 0.0, 2.0
ind = [v is None for v in vals]
filled = [fill if v is None else float(v) for v in vals]
z = [(x - mu) / sd for x in [2, 4]]  # DEFECT
silent_fill = False
meets = ind == [False, True, False] and filled == [1.0, 2.0, 3.0] and z == [0.5, 1.0, 1.5] and silent_fill is False
status = "PASS" if meets else "REJECT_SILENT_FILL"
print("S32-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t1-b-e1.py",
          code: `vals = [1, None, 3]
fill, mu, sd = 2.0, 0.0, 2.0
ind = [v is None for v in vals]
filled = [fill if v is None else float(v) for v in vals]
z = [(x - mu) / sd for x in filled]
silent_fill = False
meets = ind == [False, True, False] and filled == [1.0, 2.0, 3.0] and z == [0.5, 1.0, 1.5] and silent_fill is False
status = "PASS" if meets else "REJECT_SILENT_FILL"
print("S32-T1-B", status)
assert meets is True
` ,
          output: `S32-T1-B PASS` ,
        },
      },
      {
        id: "S32-T1-B-E2",
        subtopicId: "S32-T1-B",
        kind: "independent",
        title: "Assess silent fill y mediana de train",
        preamble:
          "- **Contexto:** un indicator todo False con huecos reales es silent fill: el modelo cree que no faltó nada.\n- **Meta:** PASS si median presente e indicator marca cada None; adverso → REJECT; sin median → MISSING.\n- **Éxito:** `PASS REJECT_SILENT_FILL MISSING:median`.\n- **Límites:** detecta falta de median antes de filled; no “arregles” el indicator del adverso.",
        instruction:
          "1. Starter: PASS solo por median (DEFECT).\n2. Calcula `expected_ind` desde values.\n3. Si indicator ≠ expected → REJECT_SILENT_FILL.\n4. Imprime las tres rutas.",
        hint: "Falta median se detecta antes de construir filled; silent_fill si hay None e indicator no lo marca.",
        hints: [
          "Falta median se detecta antes de construir filled; silent_fill si hay None e indicator no lo marca.",
          "expected_ind = [v is None for v in values]; PASS si indicator == expected_ind y median no es None.",
        ],
        edgeCases: ["falta median", "fixture adverso: silent_fill=True o indicator que oculta None", "Caso sintético Red Andina (sin PII real)"],
        tests: "Salida: `PASS REJECT_SILENT_FILL MISSING:median`.",
        feedback:
          "La mediana de train es prerequisito del transform. Silent fill es incumplimiento de contrato, no un atajo de notebook: el score offline miente a quien revisa el caso.",
        retrospective:
          "Un indicator todo `False` con huecos reales es un mentiroso: el modelo cree que no faltó nada y la cola confía en un score inflado. La mediana de train es prerequisito; silent fill es rechazo de contrato, no un atajo de notebook. Pregunta: si `values` tiene un `None` y el indicator no lo marca, ¿PASS o REJECT y por qué? Luego (E3): `REQUEST_MEDIAN`.",
        starterCode: {
          language: 'python',
          title: "s32-t1-b-e2.py",
          code: `# E2 — assess silent fill (Red Andina sintético, sin PII real)
# DEFECT: PASS cuando el indicator no marca los None
def assess(record: dict) -> str:
    required = {"case_id", "values", "median", "indicator"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    # DEFECT: no verifica indicator vs. values
    return "PASS" if record["median"] is not None else "REJECT_SILENT_FILL"

valid = {
    "case_id": "caso-ra-1b",
    "values": [1, None, 3],
    "median": 2,
    "indicator": [False, True, False],
}
invalid = {
    "case_id": "caso-ra-1b",
    "values": [1, None, 3],
    "median": 2,
    "indicator": [False, False, False],  # oculta el missing
}
incomplete = {k: v for k, v in valid.items() if k != "median"}
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "values", "median", "indicator"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    vals = record["values"]
    expected_ind = [v is None for v in vals]
    silent = record["indicator"] != expected_ind
    ok = record["median"] is not None and silent is False
    return "PASS" if ok else "REJECT_SILENT_FILL"

valid = {
    "case_id": "caso-ra-1b",
    "values": [1, None, 3],
    "median": 2,
    "indicator": [False, True, False],
}
invalid = {
    "case_id": "caso-ra-1b",
    "values": [1, None, 3],
    "median": 2,
    "indicator": [False, False, False],
}
incomplete = {k: v for k, v in valid.items() if k != "median"}
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
          output: `PASS REJECT_SILENT_FILL MISSING:median` ,
        },
      },
      {
        id: "S32-T1-B-E3",
        subtopicId: "S32-T1-B",
        kind: "transfer",
        title: "Fail-closed: REQUEST_MEDIAN sin inventar fill",
        preamble:
          "- **Contexto:** sin mediana de train no hay transform legítimo hacia serve.\n- **Meta:** enrutar válido → CONTINUE, silent fill → REJECT, sin median → REQUEST_MEDIAN.\n- **Éxito:** `CONTINUE REJECT_SILENT_FILL REQUEST_MEDIAN`.\n- **Límites:** no rellenes con 0 en silencio; REQUEST antes de comparar indicator.",
        instruction:
          "1. DEFECT: missing→CONTINUE y siempre CONTINUE.\n2. Sin keys → `REQUEST_MEDIAN`.\n3. Compara indicator con values; CONTINUE solo si ok.\n4. Imprime las tres decisiones.",
        hint: "REQUEST_MEDIAN antes de comparar indicator con values.",
        hints: [
          "REQUEST_MEDIAN antes de comparar indicator con values.",
          "CONTINUE solo con median presente e indicator == [v is None for v in values].",
        ],
        edgeCases: ["falta median", "fixture adverso: indicator que oculta None (silent fill)", "Caso sintético Red Andina (sin PII real)"],
        tests: "Salida: `CONTINUE REJECT_SILENT_FILL REQUEST_MEDIAN`.",
        feedback:
          "Sin mediana no hay transform legítimo hacia serve. Pedirla es fail-closed, no rellenar con 0: silent fill deja al baseline S33 con stats inventadas.",
        retrospective:
          "Pedir la mediana es fail-closed, no inventar fill con 0: sin stats de train no hay transform legítimo hacia serve. El error clásico es silent default “porque el assert local pasaba”. Pregunta: ¿REJECT o REQUEST si falta `median` en el record? Ese matiz (ausencia ≠ silent fill) se reutiliza en el promote.",
        starterCode: {
          language: 'python',
          title: "s32-t1-b-e3.py",
          code: `# E3 — decide REQUEST_MEDIAN (Red Andina sintético, sin PII real)
# DEFECT: missing→CONTINUE; no valida indicator
def decide(record: dict) -> str:
    required = {"case_id", "values", "median", "indicator"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE"  # DEFECT: siempre CONTINUE

valid = {
    "case_id": "caso-ra-1b",
    "values": [1, None, 3],
    "median": 2,
    "indicator": [False, True, False],
}
invalid = {
    "case_id": "caso-ra-1b",
    "values": [1, None, 3],
    "median": 2,
    "indicator": [False, False, False],
}
uncertain = {k: v for k, v in valid.items() if k != "median"}
print(*[decide(r) for r in (valid, invalid, uncertain)])
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "values", "median", "indicator"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_MEDIAN"
    expected = [v is None for v in record["values"]]
    silent = record["indicator"] != expected
    ok = record["median"] is not None and silent is False
    return "CONTINUE" if ok else "REJECT_SILENT_FILL"

valid = {
    "case_id": "caso-ra-1b",
    "values": [1, None, 3],
    "median": 2,
    "indicator": [False, True, False],
}
invalid = {
    "case_id": "caso-ra-1b",
    "values": [1, None, 3],
    "median": 2,
    "indicator": [False, False, False],
}
uncertain = {k: v for k, v in valid.items() if k != "median"}
results = [decide(r) for r in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_SILENT_FILL", "REQUEST_MEDIAN"]
` ,
          output: `CONTINUE REJECT_SILENT_FILL REQUEST_MEDIAN` ,
        },
      },
      {
        id: "S32-T2-A-E1",
        subtopicId: "S32-T2-A",
        kind: "guided",
        title: "Shared, degree y path sin label",
        preamble:
          "- **Contexto:** el mini-grafo sintético Red Andina alimenta features, no veredictos.\n- **Meta:** calcular shared, degree y path (lookup o 99) con `uses_label=False`.\n- **Éxito:** `S32-T2-A PASS`.\n- **Límites:** no uses label de decisión en el cómputo; path = `paths.get('E1-E9', 99)`.",
        instruction:
          "1. DEFECT: path no lee paths; meets exige uses_label True.\n2. `path = paths.get(\"E1-E9\", 99)`.\n3. meets con uses_label **False** y shared/degree/path correctos.\n4. Imprime `S32-T2-A` y el status.",
        hint: "path = paths.get('E1-E9', 99); no uses_label en el cómputo de features.",
        hints: [
          "path = paths.get('E1-E9', 99); no uses_label en el cómputo de features.",
          "shared = int(a_addr == b_addr); degree = len(neighbors['E1']).",
        ],
        edgeCases: ["falta degree/neighbors", "fixture adverso: uses_label=True (label de decisión como feature)", "Caso sintético Red Andina (sin PII real)"],
        tests: "Imprime `S32-T2-A PASS` con features calculadas y uses_label False.",
        feedback:
          "Shared, degree y path son topología observada en t. Exigir `uses_label=True` para “pasar” es entrenar con la respuesta: `REJECT_LABEL_AS_FEATURE` y un score que miente a la cola humana.",
        retrospective:
          "Features de grafo ≠ label: shared, degree y path son topología observada en t, no la respuesta del caso. El error clásico es colar `label_fraud` “porque ayuda al AUC” o exigir `uses_label=True` para “pasar”. Pregunta: si E1-E9 no está en `paths`, ¿qué valor de path es el contrato del lab? Siguiente (E2): assess con ban de uses_label.",
        starterCode: {
          language: 'python',
          title: "s32-t2-a-e1.py",
          code: `# E1 — shared/graph features + no label (Red Andina sintético, sin PII real)
# DEFECT: path no lee paths; uses_label tratado como requerido True
a_addr, b_addr = "Av1", "Av1"
neighbors = {"E1": ["E2", "E3"]}
paths = {"E1-E2": 1}
uses_label = False
shared = int(a_addr == b_addr)
degree = len(neighbors.get("E1", []))
path = 99  # DEFECT: ignora paths y dst
meets = shared == 1 and degree == 2 and path == 99 and uses_label is True  # DEFECT
status = "PASS" if meets else "REJECT_LABEL_AS_FEATURE"
print("S32-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t2-a-e1.py",
          code: `a_addr, b_addr = "Av1", "Av1"
neighbors = {"E1": ["E2", "E3"]}
paths = {"E1-E2": 1}
uses_label = False
shared = int(a_addr == b_addr)
degree = len(neighbors.get("E1", []))
path = paths.get("E1-E9", 99)
meets = shared == 1 and degree == 2 and path == 99 and uses_label is False
status = "PASS" if meets else "REJECT_LABEL_AS_FEATURE"
print("S32-T2-A", status)
assert meets is True
` ,
          output: `S32-T2-A PASS` ,
        },
      },
      {
        id: "S32-T2-A-E2",
        subtopicId: "S32-T2-A",
        kind: "independent",
        title: "Assess grafo y ban de label",
        preamble:
          "- **Contexto:** un record con `uses_label=True` no debe promover features al catálogo de train.\n- **Meta:** PASS con topología limpia; REJECT si hay label; MISSING sin neighbors.\n- **Éxito:** `PASS REJECT_LABEL_AS_FEATURE MISSING:neighbors`.\n- **Límites:** calcula degree desde neighbors; no confíes solo en el flag invertido.",
        instruction:
          "1. DEFECT: PASS si uses_label True.\n2. Missing keys primero.\n3. Calcula shared/degree/path; PASS solo si uses_label False y topología válida.\n4. Imprime las tres rutas.",
        hint: "Missing keys primero; luego ban de uses_label; degree = len(neighbors[src]).",
        hints: [
          "Missing keys primero; luego ban de uses_label; degree = len(neighbors[src]).",
          "PASS requiere uses_label False, shared in {0,1} y degree >= 0 calculado.",
        ],
        edgeCases: ["falta neighbors", "fixture adverso: uses_label=True (label de decisión como feature)", "Caso sintético Red Andina (sin PII real)"],
        tests: "Salida: `PASS REJECT_LABEL_AS_FEATURE MISSING:neighbors`.",
        feedback:
          "El grafo no autoriza parentesco ni fraude: solo topología observada en t. Un label como feature infla el AUC y deja a la cola humana con un veredicto disfrazado de score.",
        retrospective:
          "El grafo resume evidencia para el score o la cola, no emite parentesco ni fraude. Un record con `uses_label=True` no se “arregla” ignorando el flag: se rechaza. Pregunta: ¿por qué falta de `neighbors` es MISSING y no REJECT_LABEL? Luego (E3): `REQUEST_GRAPH_FEAT` sin inventar degree=0.",
        starterCode: {
          language: 'python',
          title: "s32-t2-a-e2.py",
          code: `# E2 — assess graph+label ban (Red Andina sintético, sin PII real)
# DEFECT: PASS si uses_label; no calcula degree desde neighbors
def assess(record: dict) -> str:
    required = {"case_id", "a_addr", "b_addr", "neighbors", "paths", "uses_label"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["uses_label"] is True else "REJECT_LABEL_AS_FEATURE"

valid = {
    "case_id": "caso-ra-2a",
    "a_addr": "Av1", "b_addr": "Av1",
    "neighbors": {"E1": ["E2", "E3"]},
    "paths": {"E1-E2": 1},
    "uses_label": False,
}
invalid = {**valid, "uses_label": True}
incomplete = {k: v for k, v in valid.items() if k != "neighbors"}
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "a_addr", "b_addr", "neighbors", "paths", "uses_label"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    shared = int(record["a_addr"] == record["b_addr"])
    degree = len(record["neighbors"].get("E1", []))
    path = record["paths"].get("E1-E9", 99)
    ok = (
        record["uses_label"] is False
        and shared in (0, 1)
        and degree >= 0
        and path >= 0
    )
    return "PASS" if ok else "REJECT_LABEL_AS_FEATURE"

valid = {
    "case_id": "caso-ra-2a",
    "a_addr": "Av1", "b_addr": "Av1",
    "neighbors": {"E1": ["E2", "E3"]},
    "paths": {"E1-E2": 1},
    "uses_label": False,
}
invalid = {**valid, "uses_label": True}
incomplete = {k: v for k, v in valid.items() if k != "neighbors"}
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
          output: `PASS REJECT_LABEL_AS_FEATURE MISSING:neighbors` ,
        },
      },
      {
        id: "S32-T2-A-E3",
        subtopicId: "S32-T2-A",
        kind: "transfer",
        title: "Fail-closed: REQUEST_GRAPH_FEAT sin inventar 0",
        preamble:
          "- **Contexto:** sin vecinos no hay feature de degree legítima: pedir el grafo es mejor que inventar 0.\n- **Meta:** topología limpia → CONTINUE; label → REJECT; sin neighbors → REQUEST_GRAPH_FEAT.\n- **Éxito:** `CONTINUE REJECT_LABEL_AS_FEATURE REQUEST_GRAPH_FEAT`.\n- **Límites:** no inventes degree=0; recalcula shared/degree/path.",
        instruction:
          "1. DEFECT: missing→CONTINUE; predicado invertido.\n2. Sin neighbors → REQUEST_GRAPH_FEAT.\n3. Con grafo: CONTINUE solo si uses_label False y topología ok.\n4. Imprime las tres decisiones.",
        hint: "Sin neighbors → REQUEST_GRAPH_FEAT. Con neighbors, shared = int(a_addr==b_addr) y degree = len(neighbors['E1']).",
        hints: [
          "Sin neighbors → REQUEST_GRAPH_FEAT. Con neighbors, shared = int(a_addr==b_addr) y degree = len(neighbors['E1']).",
          "CONTINUE solo si uses_label es False, shared in {0,1} y degree >= 0 calculado (no prebakeado).",
        ],
        edgeCases: ["falta neighbors", "fixture adverso: uses_label=True", "Caso sintético Red Andina (sin PII real)"],
        tests: "Salida: `CONTINUE REJECT_LABEL_AS_FEATURE REQUEST_GRAPH_FEAT`.",
        feedback:
          "Pedir la feature de grafo es mejor que inventar degree=0 en silencio. El `CONTINUE` se gana recalculando topología, no leyendo un flag: silent defaults contaminan el baseline S33.",
        retrospective:
          "Pedir la feature de grafo evita silent defaults que contaminan el baseline S33. El error clásico es inventar degree=0 “por si acaso” cuando faltan vecinos. Pregunta: ¿qué código sale si falta `neighbors` y el resto del record está completo? Ese hábito (REQUEST vs. inventar) es entrevista-relevante.",
        starterCode: {
          language: 'python',
          title: "s32-t2-a-e3.py",
          code: `# E3 — decide REJECT_LABEL_AS_FEATURE (Red Andina sintético, sin PII real)
# DEFECT: missing→CONTINUE; no recalcula degree; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "a_addr", "b_addr", "neighbors", "paths", "uses_label"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["uses_label"] is True else "REJECT_LABEL_AS_FEATURE"

valid = {
    "case_id": "caso-ra-2a",
    "a_addr": "Av1", "b_addr": "Av1",
    "neighbors": {"E1": ["E2", "E3"]},
    "paths": {"E1-E2": 1},
    "uses_label": False,
}
invalid = {**valid, "uses_label": True}
uncertain = {k: v for k, v in valid.items() if k != "neighbors"}
print(*[decide(r) for r in (valid, invalid, uncertain)])
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "a_addr", "b_addr", "neighbors", "paths", "uses_label"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_GRAPH_FEAT"
    shared = int(record["a_addr"] == record["b_addr"])
    degree = len(record["neighbors"].get("E1", []))
    path = record["paths"].get("E1-E9", 99)
    ok = (
        record["uses_label"] is False
        and shared in (0, 1)
        and degree >= 0
        and path >= 0
    )
    return "CONTINUE" if ok else "REJECT_LABEL_AS_FEATURE"

valid = {
    "case_id": "caso-ra-2a",
    "a_addr": "Av1", "b_addr": "Av1",
    "neighbors": {"E1": ["E2", "E3"]},
    "paths": {"E1-E2": 1},
    "uses_label": False,
}
invalid = {**valid, "uses_label": True}
uncertain = {k: v for k, v in valid.items() if k != "neighbors"}
results = [decide(r) for r in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_LABEL_AS_FEATURE", "REQUEST_GRAPH_FEAT"]
` ,
          output: `CONTINUE REJECT_LABEL_AS_FEATURE REQUEST_GRAPH_FEAT` ,
        },
      },
      {
        id: "S32-T2-B-E1",
        subtopicId: "S32-T2-B",
        kind: "guided",
        title: "Ventana half-open sin incluir t",
        preamble:
          "- **Contexto:** en features de frecuencia del caso Red Andina, contar el evento en t filtra el futuro al modelo.\n- **Meta:** corregir el predicado a `t−w <= ts < t` (count=2, includes_t=False).\n- **Éxito:** `S32-T2-B PASS`.\n- **Límites:** no uses `<= t`; includes_t se deriva del half-open, no de un booleano inventado.",
        instruction:
          "1. DEFECT: `<= t` en el sum y en includes_t.\n2. Cambia ambos a `ts < t`.\n3. meets: count==2 e includes_t False.\n4. Imprime `S32-T2-B` y el status.",
        hint: "Predicado correcto: t - w <= ts < t (estricto en t).",
        hints: [
          "Predicado correcto: t - w <= ts < t (estricto en t).",
          "includes_t se deriva del conteo half-open, no de un flag inventado.",
        ],
        edgeCases: ["falta w", "fixture adverso: includes_t=True o ts>=t en el conteo", "Caso sintético Red Andina (sin PII real)"],
        tests: "Imprime `S32-T2-B PASS` con count 2 e includes_t False.",
        feedback:
          "Incluir t es leakage temporal. La política half-open es el contrato documentado en el catálogo: train y serve deben usar el mismo predicado o el score offline engaña a la cola.",
        retrospective:
          "Estricto en t protege el momento de decisión: el modelo no debe ver el evento que dispara el score. El error clásico es “cerrado se ve más estable” o redondear con `<= t`. Pregunta: ¿qué count esperas si un evento cae exactamente en t? Siguiente (E2): assess con flag includes_t.",
        starterCode: {
          language: 'python',
          title: "s32-t2-b-e1.py",
          code: `# E1 — time windows y frequency (Red Andina sintético, sin PII real)
# DEFECT: usa <= t (incluye el instante de decisión)
events, t, w = [1, 2, 3, 5], 5, 3
count = sum(1 for ts in events if t - w <= ts <= t)  # DEFECT
includes_t = any(ts == t for ts in events if t - w <= ts <= t)
meets = (count == 2) and (includes_t is False)
status = "PASS" if meets else "REJECT_FUTURE_TS"
print("S32-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t2-b-e1.py",
          code: `events, t, w = [1, 2, 3, 5], 5, 3
count = sum(1 for ts in events if t - w <= ts < t)
includes_t = any(ts == t for ts in events if t - w <= ts < t)
meets = (count == 2) and (includes_t is False)
status = "PASS" if meets else "REJECT_FUTURE_TS"
print("S32-T2-B", status)
assert meets is True
` ,
          output: `S32-T2-B PASS` ,
        },
      },
      {
        id: "S32-T2-B-E2",
        subtopicId: "S32-T2-B",
        kind: "independent",
        title: "Assess ventana y includes_t",
        preamble:
          "- **Contexto:** un fixture con `includes_t=True` modela la ventana que filtra t, no un schema incompleto.\n- **Meta:** PASS half-open limpio; REJECT si se marca t; MISSING sin w.\n- **Éxito:** `PASS REJECT_FUTURE_TS MISSING:w`.\n- **Límites:** si falta w no intentes el conteo; recomputa desde events.",
        instruction:
          "1. DEFECT: PASS cuando includes_t es True.\n2. Missing w → MISSING:w.\n3. Recompute count e includes half-open; PASS solo si flag y cómputo limpios.\n4. Imprime las tres rutas.",
        hint: "Si falta w no intentes el conteo.",
        hints: [
          "Si falta w no intentes el conteo.",
          "PASS si count half-open es 2 e includes_t calculado es False (o el flag del record es False y w>0).",
        ],
        edgeCases: ["falta w", "fixture adverso: includes_t=True", "Caso sintético Red Andina (sin PII real)"],
        tests: "Salida: `PASS REJECT_FUTURE_TS MISSING:w`.",
        feedback:
          "El adverso modela la ventana que filtra t: es leakage de política, no un schema roto. Recomputar desde events evita confiar en un flag prebakeado.",
        retrospective:
          "El adverso con `includes_t=True` modela una **política** que filtra t, no un schema incompleto: es leakage de ventana, no de keys. Recomputar desde `events` evita confiar en un flag prebakeado. Pregunta: si falta `w`, ¿intentas el conteo o devuelves MISSING? Luego (E3): `REQUEST_WINDOW` sin inventar w=7.",
        starterCode: {
          language: 'python',
          title: "s32-t2-b-e2.py",
          code: `# E2 — assess window features (Red Andina sintético, sin PII real)
# DEFECT: PASS cuando includes_t es True
def assess(record: dict) -> str:
    required = {"case_id", "events", "t", "w", "includes_t"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["includes_t"] is True else "REJECT_FUTURE_TS"

valid = {"case_id": "caso-ra-2b", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": False}
invalid = {"case_id": "caso-ra-2b", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": True}
incomplete = {k: v for k, v in valid.items() if k != "w"}
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "events", "t", "w", "includes_t"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    events, t, w = record["events"], record["t"], record["w"]
    count = sum(1 for ts in events if t - w <= ts < t)
    includes = any(ts == t for ts in events if t - w <= ts < t)
    ok = record["includes_t"] is False and includes is False and count == 2 and w > 0
    return "PASS" if ok else "REJECT_FUTURE_TS"

valid = {"case_id": "caso-ra-2b", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": False}
invalid = {"case_id": "caso-ra-2b", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": True}
incomplete = {k: v for k, v in valid.items() if k != "w"}
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
          output: `PASS REJECT_FUTURE_TS MISSING:w` ,
        },
      },
      {
        id: "S32-T2-B-E3",
        subtopicId: "S32-T2-B",
        kind: "transfer",
        title: "Fail-closed: REQUEST_WINDOW sin inventar w",
        preamble:
          "- **Contexto:** sin ancho `w` no hay feature de frecuencia legítima hacia S33.\n- **Meta:** válido → CONTINUE; t incluido → REJECT; sin w → REQUEST_WINDOW.\n- **Éxito:** `CONTINUE REJECT_FUTURE_TS REQUEST_WINDOW`.\n- **Límites:** no inventes w; recalcula includes desde events, no solo el flag.",
        instruction:
          "1. DEFECT: missing→CONTINUE; predicado invertido.\n2. Sin w → REQUEST_WINDOW.\n3. Con w: CONTINUE solo si half-open limpio y flag False.\n4. Imprime las tres decisiones.",
        hint: "Sin w → REQUEST_WINDOW. Con w presente, recalcula includes desde events (no solo el flag).",
        hints: [
          "Sin w → REQUEST_WINDOW. Con w presente, recalcula includes desde events (no solo el flag).",
          "CONTINUE solo si includes_t del record es False, el recompute half-open no incluye t, y w > 0.",
        ],
        edgeCases: ["falta w", "fixture adverso: includes_t=True", "Caso sintético Red Andina (sin PII real)"],
        tests: "Salida: `CONTINUE REJECT_FUTURE_TS REQUEST_WINDOW`.",
        feedback:
          "Sin ancho de ventana no hay feature temporal legítima hacia S33. Inventar w=7 “por costumbre” es silent default: pide el prerequisito, no improvises, o el score offline y serve divergen en silencio.",
        retrospective:
          "Sin ancho de ventana no hay feature de frecuencia legítima hacia S33: pedir `w` es fail-closed, no improvisar 7 “por costumbre”. El error clásico es CONTINUE cuando falta el prerequisito. Pregunta: ¿REJECT o REQUEST si falta `w` y el record trae events y t? Ese matiz (ausencia ≠ incumplimiento) se reutiliza en todo el promote.",
        starterCode: {
          language: 'python',
          title: "s32-t2-b-e3.py",
          code: `# E3 — decide REQUEST_WINDOW (Red Andina sintético, sin PII real)
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "events", "t", "w", "includes_t"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["includes_t"] is True else "REJECT_FUTURE_TS"

valid = {"case_id": "caso-ra-2b", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": False}
invalid = {"case_id": "caso-ra-2b", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": True}
uncertain = {k: v for k, v in valid.items() if k != "w"}
print(*[decide(r) for r in (valid, invalid, uncertain)])
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "events", "t", "w", "includes_t"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_WINDOW"
    events, t, w = record["events"], record["t"], record["w"]
    # recompute half-open; no confiar solo en el flag del fixture
    includes = any(ts == t for ts in events if t - w <= ts < t)
    count = sum(1 for ts in events if t - w <= ts < t)
    ok = (
        record["includes_t"] is False
        and includes is False
        and count >= 0
        and w > 0
        and t is not None
    )
    return "CONTINUE" if ok else "REJECT_FUTURE_TS"

valid = {"case_id": "caso-ra-2b", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": False}
invalid = {"case_id": "caso-ra-2b", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": True}
uncertain = {k: v for k, v in valid.items() if k != "w"}
results = [decide(r) for r in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_FUTURE_TS", "REQUEST_WINDOW"]
` ,
          output: `CONTINUE REJECT_FUTURE_TS REQUEST_WINDOW` ,
        },
      },
      {
        id: "S32-T3-A-E1",
        subtopicId: "S32-T3-A",
        kind: "guided",
        title: "ModeImputer: fit real y transform",
        preamble:
          "- **Contexto:** en el pipeline categórico de canal, la moda debe aprenderse de train, no adivinarse.\n- **Meta:** fit con `max(set, key=count)`; transform rellena None con `self.mode` y falla si no hay fit.\n- **Éxito:** `S32-T3-A PASS` (out `['app','web']`, mode `app`).\n- **Límites:** no hardcodees \"app\" en transform; raise si mode is None.",
        instruction:
          "1. DEFECT: fit deja mode=None; transform hardcodea.\n2. En fit, aprende la moda de xs.\n3. En transform, exige fit y usa self.mode.\n4. Imprime `S32-T3-A` y el status.",
        hint: "En transform, si self.mode is None: raise RuntimeError('not fitted').",
        hints: [
          "En transform, si self.mode is None: raise RuntimeError('not fitted').",
          "fit usa max(set(xs), key=xs.count) para la moda.",
        ],
        edgeCases: ["falta fitted/state", "fixture adverso: transform_before_fit=True", "Caso sintético Red Andina (sin PII real)"],
        tests: "Imprime `S32-T3-A PASS` cuando el transform post-fit es correcto.",
        feedback:
          "El orden fit→transform es el contrato. Un transform “que siempre pone app” no se puede versionar ni servir de forma auditable hacia el baseline S33.",
        retrospective:
          "La moda se aprende en fit y se reutiliza en serve: hardcodear `\"app\"` en transform no se puede versionar ni auditar. El error clásico es “ya sé cuál es la mayoritaria del fixture” y copiarla en el código. Pregunta: si train fuera `[\"web\",\"web\",\"app\"]`, ¿qué mode debería salir? Siguiente (E2): assess try_before_fit.",
        starterCode: {
          language: 'python',
          title: "s32-t3-a-e1.py",
          code: `# E1 — ModeImputer fit order (Red Andina sintético, sin PII real)
# DEFECT: transform no exige fit; mode queda None
class ModeImputer:
    def __init__(self):
        self.mode = None
    def fit(self, xs):
        self.mode = None  # DEFECT: no aprende
        return self
    def transform(self, xs):
        return ["app" if x is None else x for x in xs]  # DEFECT: hardcode sin state

imp = ModeImputer().fit(["app", "app", "web"])
out = imp.transform([None, "web"])
meets = out == ["app", "web"] and imp.mode == "app"
status = "PASS" if meets else "REJECT_TRANSFORM_BEFORE_FIT"
print("S32-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t3-a-e1.py",
          code: `class ModeImputer:
    def __init__(self):
        self.mode = None
    def fit(self, xs):
        self.mode = max(set(xs), key=xs.count)
        return self
    def transform(self, xs):
        if self.mode is None:
            raise RuntimeError("not fitted")
        return [self.mode if x is None else x for x in xs]

imp = ModeImputer().fit(["app", "app", "web"])
out = imp.transform([None, "web"])
meets = out == ["app", "web"] and imp.mode == "app"
status = "PASS" if meets else "REJECT_TRANSFORM_BEFORE_FIT"
print("S32-T3-A", status)
assert meets is True
` ,
          output: `S32-T3-A PASS` ,
        },
      },
      {
        id: "S32-T3-A-E2",
        subtopicId: "S32-T3-A",
        kind: "independent",
        title: "Assess fit real vs. try_before_fit",
        preamble:
          "- **Contexto:** un notebook que “transforma primero” no deja state reproducible para serve.\n- **Meta:** PASS con fit+transform reales; REJECT si try_before_fit; MISSING sin train_xs.\n- **Éxito:** `PASS REJECT_TRANSFORM_BEFORE_FIT MISSING:train_xs`.\n- **Límites:** no confíes en un flag `fitted` prebakeado; mode desde train_xs.",
        instruction:
          "1. DEFECT: PASS si try_before_fit True.\n2. Missing train_xs primero.\n3. Si try_before_fit → REJECT; si no, fit y comprueba transform.\n4. Imprime las tres rutas.",
        hint: "Missing train_xs primero; si try_before_fit, REJECT sin fittear; si no, fit y comprueba transform no vacío.",
        hints: [
          "Missing train_xs primero; si try_before_fit, REJECT sin fittear; si no, fit y comprueba transform no vacío.",
          "mode = max(set(train_xs), key=train_xs.count); serve rellena None con mode.",
        ],
        edgeCases: ["falta train_xs", "fixture adverso: try_before_fit=True (transform sin fit)", "Caso sintético Red Andina (sin PII real)"],
        tests: "Salida: `PASS REJECT_TRANSFORM_BEFORE_FIT MISSING:train_xs`.",
        feedback:
          "El state fitted se demuestra con fit real sobre train_xs. Un flag no es evidencia: sin state serializable no hay train≡serve ni baseline auditable.",
        retrospective:
          "Un flag `try_before_fit` no es evidencia de state: o haces fit real sobre `train_xs` o rechazas el notebook que “transforma primero”. Sin state serializable no hay train≡serve ni baseline auditable. Pregunta: ¿por qué falta de `train_xs` es MISSING y no REJECT_TRANSFORM_BEFORE_FIT? Luego (E3): `REQUEST_FIT_STATE`.",
        starterCode: {
          language: 'python',
          title: "s32-t3-a-e2.py",
          code: `# E2 — assess transformer fit (Red Andina sintético, sin PII real)
# DEFECT: PASS si try_before_fit; no hace fit real
def assess(record: dict) -> str:
    required = {"case_id", "train_xs", "serve_xs", "try_before_fit"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    # DEFECT: confía en el flag adverso al revés
    return "PASS" if record["try_before_fit"] is True else "REJECT_TRANSFORM_BEFORE_FIT"

valid = {
    "case_id": "caso-ra-3a",
    "train_xs": ["app", "app", "web"],
    "serve_xs": [None, "web"],
    "try_before_fit": False,
}
invalid = {
    "case_id": "caso-ra-3a",
    "train_xs": ["app", "app", "web"],
    "serve_xs": [None, "web"],
    "try_before_fit": True,
}
incomplete = {k: v for k, v in valid.items() if k != "train_xs"}
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "train_xs", "serve_xs", "try_before_fit"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    if record["try_before_fit"] is True:
        return "REJECT_TRANSFORM_BEFORE_FIT"
    train_xs = record["train_xs"]
    if not train_xs:
        return "REJECT_TRANSFORM_BEFORE_FIT"
    mode = max(set(train_xs), key=train_xs.count)
    out = [mode if x is None else x for x in record["serve_xs"]]
    ok = mode is not None and len(out) == len(record["serve_xs"])
    return "PASS" if ok else "REJECT_TRANSFORM_BEFORE_FIT"

valid = {
    "case_id": "caso-ra-3a",
    "train_xs": ["app", "app", "web"],
    "serve_xs": [None, "web"],
    "try_before_fit": False,
}
invalid = {
    "case_id": "caso-ra-3a",
    "train_xs": ["app", "app", "web"],
    "serve_xs": [None, "web"],
    "try_before_fit": True,
}
incomplete = {k: v for k, v in valid.items() if k != "train_xs"}
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
          output: `PASS REJECT_TRANSFORM_BEFORE_FIT MISSING:train_xs` ,
        },
      },
      {
        id: "S32-T3-A-E3",
        subtopicId: "S32-T3-A",
        kind: "transfer",
        title: "Fail-closed: REQUEST_FIT_STATE hacia fs-vN",
        preamble:
          "- **Contexto:** sin train_xs no hay state de fit que serializar hacia `fs-vN`.\n- **Meta:** fit real → CONTINUE; try_before_fit → REJECT; sin train → REQUEST_FIT_STATE.\n- **Éxito:** `CONTINUE REJECT_TRANSFORM_BEFORE_FIT REQUEST_FIT_STATE`.\n- **Límites:** no inventes mode='app' sin fit; CONTINUE solo con transform de longitud correcta.",
        instruction:
          "1. DEFECT: missing→CONTINUE; predicado invertido.\n2. Sin train_xs → REQUEST_FIT_STATE.\n3. Con train: REJECT si try_before_fit; si no, fit y CONTINUE si ok.\n4. Imprime las tres decisiones.",
        hint: "Sin train_xs → REQUEST_FIT_STATE. Con train, si try_before_fit → REJECT; si no, fit y transform.",
        hints: [
          "Sin train_xs → REQUEST_FIT_STATE. Con train, si try_before_fit → REJECT; si no, fit y transform.",
          "CONTINUE solo si mode aprendido y len(transform(serve_xs)) == len(serve_xs).",
        ],
        edgeCases: ["falta train_xs", "fixture adverso: try_before_fit=True", "Caso sintético Red Andina (sin PII real)"],
        tests: "Salida: `CONTINUE REJECT_TRANSFORM_BEFORE_FIT REQUEST_FIT_STATE`.",
        feedback:
          "Pedir el state de fit evita silent defaults en serve. El `CONTINUE` se gana fitteando, no leyendo un flag ni inventando la moda “app”.",
        retrospective:
          "Sin `train_xs` no hay state que serializar hacia `fs-vN`: pedir el prerequisito es mejor que inventar mode=`\"app\"`. El error clásico es CONTINUE ciego o un silent default “porque en el demo era app”. Pregunta: ¿qué sale si falta `train_xs`? Ese REQUEST protege el promote a S33.",
        starterCode: {
          language: 'python',
          title: "s32-t3-a-e3.py",
          code: `# E3 — decide REQUEST_FIT_STATE (Red Andina sintético, sin PII real)
# DEFECT: missing→CONTINUE; no hace fit; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "train_xs", "serve_xs", "try_before_fit"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["try_before_fit"] is True else "REJECT_TRANSFORM_BEFORE_FIT"

valid = {
    "case_id": "caso-ra-3a",
    "train_xs": ["app", "app", "web"],
    "serve_xs": [None, "web"],
    "try_before_fit": False,
}
invalid = {
    "case_id": "caso-ra-3a",
    "train_xs": ["app", "app", "web"],
    "serve_xs": [None, "web"],
    "try_before_fit": True,
}
uncertain = {k: v for k, v in valid.items() if k != "train_xs"}
print(*[decide(r) for r in (valid, invalid, uncertain)])
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "train_xs", "serve_xs", "try_before_fit"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_FIT_STATE"
    if record["try_before_fit"] is True or not record["train_xs"]:
        return "REJECT_TRANSFORM_BEFORE_FIT"
    train_xs = record["train_xs"]
    mode = max(set(train_xs), key=train_xs.count)
    out = [mode if x is None else x for x in record["serve_xs"]]
    ok = mode is not None and len(out) == len(record["serve_xs"])
    return "CONTINUE" if ok else "REJECT_TRANSFORM_BEFORE_FIT"

valid = {
    "case_id": "caso-ra-3a",
    "train_xs": ["app", "app", "web"],
    "serve_xs": [None, "web"],
    "try_before_fit": False,
}
invalid = {
    "case_id": "caso-ra-3a",
    "train_xs": ["app", "app", "web"],
    "serve_xs": [None, "web"],
    "try_before_fit": True,
}
uncertain = {k: v for k, v in valid.items() if k != "train_xs"}
results = [decide(r) for r in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_TRANSFORM_BEFORE_FIT", "REQUEST_FIT_STATE"]
` ,
          output: `CONTINUE REJECT_TRANSFORM_BEFORE_FIT REQUEST_FIT_STATE` ,
        },
      },
      {
        id: "S32-T3-B-E1",
        subtopicId: "S32-T3-B",
        kind: "guided",
        title: "JSON state y mediana en serve",
        preamble:
          "- **Contexto:** el batch de serve del caso Red Andina no puede ir con None si el state ya tiene mediana de train.\n- **Meta:** round-trip JSON, apply median, version que empiece por `fs-v`.\n- **Éxito:** `S32-T3-B PASS` (serve `[2, 4]`, fs-v1).\n- **Límites:** no dejes serve = `[None, 4]`; no borres la version.",
        instruction:
          "1. DEFECT: serve no aplica median.\n2. `loaded = json.loads(json.dumps(state))`.\n3. Rellena None con `loaded[\"median\"]`.\n4. Imprime `S32-T3-B` y el status.",
        hint: "json.loads(json.dumps(state)); fill None con state['median'].",
        hints: [
          "json.loads(json.dumps(state)); fill None con state['median'].",
          "versioned = str(version).startswith('fs-v').",
        ],
        edgeCases: ["falta version", "fixture adverso: version vacía o versioned=False", "Caso sintético Red Andina (sin PII real)"],
        tests: "Imprime `S32-T3-B PASS` con serve [2, 4] y version fs-v1.",
        feedback:
          "El round-trip JSON es el contrato de persistencia. Servir sin aplicar mediana o sin version legible es `REJECT_UNVERSIONED`: S33 no puede citar un artefacto fantasma.",
        retrospective:
          "State versionado + apply idéntico = train≡serve: no basta imprimir `fs-v1` si el batch sigue con `None`. El error clásico es “solo chequear que existe version”. Pregunta: ¿qué debe quedar en serve si el batch es `[None, 4]` y median=2? Siguiente (E2): assess con version vacía.",
        starterCode: {
          language: 'python',
          title: "s32-t3-b-e1.py",
          code: `# E1 — fit/transform persistence (Red Andina sintético, sin PII real)
# DEFECT: no aplica median; version ignorada
import json
state = {"median": 2, "version": "fs-v1"}
loaded = json.loads(json.dumps(state))
serve = [None, 4]  # DEFECT: no aplica median
versioned = bool(loaded.get("version"))
meets = serve == [2, 4] and str(loaded["version"]).startswith("fs-v") and versioned
status = "PASS" if meets else "REJECT_UNVERSIONED"
print("S32-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t3-b-e1.py",
          code: `import json
state = {"median": 2, "version": "fs-v1"}
loaded = json.loads(json.dumps(state))
serve = [loaded["median"] if x is None else x for x in [None, 4]]
versioned = str(loaded["version"]).startswith("fs-v")
meets = serve == [2, 4] and versioned
status = "PASS" if meets else "REJECT_UNVERSIONED"
print("S32-T3-B", status)
assert meets is True
` ,
          output: `S32-T3-B PASS` ,
        },
      },
      {
        id: "S32-T3-B-E2",
        subtopicId: "S32-T3-B",
        kind: "independent",
        title: "Assess fs-vN y apply de mediana",
        preamble:
          "- **Contexto:** el id `fs-vN` es lo que el baseline S33 citará; version vacía no se promueve.\n- **Meta:** PASS con state válido y batch sin None; REJECT si version vacía; MISSING sin version.\n- **Éxito:** `PASS REJECT_UNVERSIONED MISSING:version`.\n- **Límites:** no apruebes solo con un flag versioned; apply real de median.",
        instruction:
          "1. DEFECT: PASS sin version válida y sin apply.\n2. Missing version → MISSING:version.\n3. Round-trip + startswith('fs-v') + serve == [2, 4].\n4. Imprime las tres rutas.",
        hint: "loaded = json.loads(json.dumps(state)); serve = [median if x is None else x for x in batch].",
        hints: [
          "loaded = json.loads(json.dumps(state)); serve = [median if x is None else x for x in batch].",
          "PASS si ver.startswith('fs-v') y serve resultante no tiene None.",
        ],
        edgeCases: ["falta version", "fixture adverso: version '' (no se puede promover state)", "Caso sintético Red Andina (sin PII real)"],
        tests: "Salida: `PASS REJECT_UNVERSIONED MISSING:version`.",
        feedback:
          "El id `fs-vN` es el que S33 consumirá. Round-trip y apply demuestran train≡serve; un flag versioned sin apply deja None en producción.",
        retrospective:
          "Round-trip JSON + apply demuestran que el state sobrevive al notebook; el id `fs-v*` es lo que S33 citará. Version vacía no se “arregla” con un flag `versioned=True`. Pregunta: ¿PASS o REJECT si `version=\"\"` aunque la mediana sea 2? Luego (E3): `REQUEST_STATE_JSON`.",
        starterCode: {
          language: 'python',
          title: "s32-t3-b-e2.py",
          code: `# E2 — assess fit/transform persist (Red Andina sintético, sin PII real)
# DEFECT: PASS sin version válida; no aplica median al batch
import json

def assess(record: dict) -> str:
    required = {"case_id", "state", "version", "serve_batch"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    # DEFECT: no round-trip ni apply
    return "PASS" if not record["version"] else "REJECT_UNVERSIONED"

valid = {
    "case_id": "caso-ra-3b",
    "state": {"median": 2, "version": "fs-v1"},
    "version": "fs-v1",
    "serve_batch": [None, 4],
}
invalid = {
    "case_id": "caso-ra-3b",
    "state": {"median": 2, "version": ""},
    "version": "",
    "serve_batch": [None, 4],
}
incomplete = {k: v for k, v in valid.items() if k != "version"}
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t3-b-e2.py",
          code: `import json

def assess(record: dict) -> str:
    required = {"case_id", "state", "version", "serve_batch"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    loaded = json.loads(json.dumps(record["state"]))
    ver = str(record["version"] or loaded.get("version") or "")
    if not ver.startswith("fs-v") or "median" not in loaded:
        return "REJECT_UNVERSIONED"
    m = loaded["median"]
    serve = [m if x is None else x for x in record["serve_batch"]]
    ok = None not in serve and serve == [2, 4]
    return "PASS" if ok else "REJECT_UNVERSIONED"

valid = {
    "case_id": "caso-ra-3b",
    "state": {"median": 2, "version": "fs-v1"},
    "version": "fs-v1",
    "serve_batch": [None, 4],
}
invalid = {
    "case_id": "caso-ra-3b",
    "state": {"median": 2, "version": ""},
    "version": "",
    "serve_batch": [None, 4],
}
incomplete = {k: v for k, v in valid.items() if k != "version"}
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
          output: `PASS REJECT_UNVERSIONED MISSING:version` ,
        },
      },
      {
        id: "S32-T3-B-E3",
        subtopicId: "S32-T3-B",
        kind: "transfer",
        title: "Fail-closed: REQUEST_STATE_JSON sin inventar version",
        preamble:
          "- **Contexto:** sin version en el record no hay artefacto que S33 pueda citar.\n- **Meta:** state+apply ok → CONTINUE; version vacía → REJECT; sin version → REQUEST_STATE_JSON.\n- **Éxito:** `CONTINUE REJECT_UNVERSIONED REQUEST_STATE_JSON`.\n- **Límites:** no inventes version; CONTINUE solo si serve quedó sin None.",
        instruction:
          "1. DEFECT: missing→CONTINUE; no aplica median.\n2. Sin version → REQUEST_STATE_JSON.\n3. Con version: JSON + fill; CONTINUE si ok.\n4. Imprime las tres decisiones.",
        hint: "Sin version → REQUEST_STATE_JSON. Con version: JSON round-trip + fill con median.",
        hints: [
          "Sin version → REQUEST_STATE_JSON. Con version: JSON round-trip + fill con median.",
          "CONTINUE solo si ver.startswith('fs-v') y serve resultante == [2, 4] en el fixture.",
        ],
        edgeCases: ["falta version", "fixture adverso: version vacía o state sin median aplicable", "Caso sintético Red Andina (sin PII real)"],
        tests: "Salida: `CONTINUE REJECT_UNVERSIONED REQUEST_STATE_JSON`.",
        feedback:
          "`REQUEST_STATE_JSON` es fail-closed cuando falta el artefacto. El `CONTINUE` se gana aplicando el state, no con un flag versioned ni promoviendo version vacía.",
        retrospective:
          "Falta de `version` en el record es ausencia de artefacto: se pide JSON de state, no se inventa un id. El error clásico es promover con `version=\"\"` o CONTINUE sin apply. Pregunta: ¿qué sale si `version=\"\"` (string vacío, key presente)? Ese matiz (REJECT_UNVERSIONED vs. REQUEST) es el que cierra el handoff a S33.",
        starterCode: {
          language: 'python',
          title: "s32-t3-b-e3.py",
          code: `# E3 — decide REQUEST_STATE_JSON (Red Andina sintético, sin PII real)
# DEFECT: missing→CONTINUE; no aplica median
import json

def decide(record: dict) -> str:
    required = {"case_id", "state", "version", "serve_batch"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["version"] else "REJECT_UNVERSIONED"

valid = {
    "case_id": "caso-ra-3b",
    "state": {"median": 2, "version": "fs-v1"},
    "version": "fs-v1",
    "serve_batch": [None, 4],
}
invalid = {
    "case_id": "caso-ra-3b",
    "state": {"median": 2, "version": ""},
    "version": "",
    "serve_batch": [None, 4],
}
uncertain = {k: v for k, v in valid.items() if k != "version"}
print(*[decide(r) for r in (valid, invalid, uncertain)])
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t3-b-e3.py",
          code: `import json

def decide(record: dict) -> str:
    required = {"case_id", "state", "version", "serve_batch"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_STATE_JSON"
    loaded = json.loads(json.dumps(record["state"]))
    ver = str(record["version"] or "")
    if not ver.startswith("fs-v") or "median" not in loaded:
        return "REJECT_UNVERSIONED"
    m = loaded["median"]
    serve = [m if x is None else x for x in record["serve_batch"]]
    ok = None not in serve and len(serve) == len(record["serve_batch"])
    return "CONTINUE" if ok else "REJECT_UNVERSIONED"

valid = {
    "case_id": "caso-ra-3b",
    "state": {"median": 2, "version": "fs-v1"},
    "version": "fs-v1",
    "serve_batch": [None, 4],
}
invalid = {
    "case_id": "caso-ra-3b",
    "state": {"median": 2, "version": ""},
    "version": "",
    "serve_batch": [None, 4],
}
uncertain = {k: v for k, v in valid.items() if k != "version"}
results = [decide(r) for r in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_UNVERSIONED", "REQUEST_STATE_JSON"]
` ,
          output: `CONTINUE REJECT_UNVERSIONED REQUEST_STATE_JSON` ,
        },
      },
      {
        id: "S32-T4-A-E1",
        subtopicId: "S32-T4-A",
        kind: "guided",
        title: "Split por tiempo y overlap de entidades",
        preamble:
          "- **Contexto:** el informe de split de CP-N3-B debe derivarse de filas, no de constantes de pizarra.\n- **Meta:** train = ts < cut; overlap = intersección de entity; n_train=1, n_test=1, overlap=0.\n- **Éxito:** `S32-T4-A PASS`.\n- **Límites:** no hardcodees tamaños; deriva de las listas.",
        instruction:
          "1. DEFECT: `n_train, n_test, overlap = 1, 1, 0` fijos.\n2. Filtra train/test por cut.\n3. Calcula len y len(intersección de entity).\n4. Imprime `S32-T4-A` y el status.",
        hint: "train = ts < cut; overlap = set(entity train) ∩ set(entity test).",
        hints: [
          "train = ts < cut; overlap = set(entity train) ∩ set(entity test).",
          "No devuelvas constantes: deriva tamaños de las listas.",
        ],
        edgeCases: ["falta overlap/keys", "fixture adverso: misma entity en train y test (overlap>0)", "Caso sintético Red Andina (sin PII real)"],
        tests: "Imprime `S32-T4-A PASS` con overlap 0 calculado.",
        feedback:
          "El gate exige cero intersección de entidades. Reportar n_train/n_test/overlap es parte del informe auditable antes del baseline, no un detalle opcional: hardcodear `1,1,0` engaña al promote.",
        retrospective:
          "Overlap se mide desde las filas, no se inventa en la pizarra. El error clásico es “ya sé que es cero en este fixture”. Pregunta: si mañana agregas una fila de e1 en febrero, ¿qué debe cambiar en el informe? Siguiente (E2): assess con entity repetida.",
        starterCode: {
          language: 'python',
          title: "s32-t4-a-e1.py",
          code: `# E1 — entity/group/time split (Red Andina sintético, sin PII real)
# DEFECT: tamaños hardcodeados; no calcula overlap
rows = [
    {"ts": "2026-01-10", "entity": "e1"},
    {"ts": "2026-02-10", "entity": "e2"},
]
cut = "2026-02-01"
n_train, n_test, overlap = 1, 1, 0  # DEFECT: no derivado
meets = n_train >= 1 and n_test >= 1 and overlap == 0
status = "PASS" if meets else "REJECT_ENTITY_OVERLAP"
print("S32-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t4-a-e1.py",
          code: `rows = [
    {"ts": "2026-01-10", "entity": "e1"},
    {"ts": "2026-02-10", "entity": "e2"},
]
cut = "2026-02-01"
train = [r for r in rows if r["ts"] < cut]
test = [r for r in rows if r["ts"] >= cut]
overlap = len(set(r["entity"] for r in train) & set(r["entity"] for r in test))
n_train, n_test = len(train), len(test)
meets = n_train >= 1 and n_test >= 1 and overlap == 0
status = "PASS" if meets else "REJECT_ENTITY_OVERLAP"
print("S32-T4-A", status)
assert meets is True
` ,
          output: `S32-T4-A PASS` ,
        },
      },
      {
        id: "S32-T4-A-E2",
        subtopicId: "S32-T4-A",
        kind: "independent",
        title: "Assess isolation de entidades en split",
        preamble:
          "- **Contexto:** e1 en train y test (mismo entity, distinto ts) es el fallo clásico de group leakage.\n- **Meta:** PASS sin overlap; REJECT con intersección; MISSING sin rows.\n- **Éxito:** `PASS REJECT_ENTITY_OVERLAP MISSING:rows`.\n- **Límites:** no uses flags precomputados; intersección real de entity.",
        instruction:
          "1. DEFECT: PASS si train y test no vacíos, sin medir overlap.\n2. Calcula intersección de entity.\n3. PASS solo si lados no vacíos y len(overlap)==0.\n4. Imprime las tres rutas.",
        hint: "train = [r for r in rows if r['ts'] < cut]; overlap = set(entity train) ∩ set(entity test).",
        hints: [
          "train = [r for r in rows if r['ts'] < cut]; overlap = set(entity train) ∩ set(entity test).",
          "PASS solo si ambos lados no vacíos y len(overlap)==0.",
        ],
        edgeCases: ["falta rows", "fixture adverso: misma entity en train y test (overlap>0)", "Caso sintético Red Andina (sin PII real)"],
        tests: "Salida: `PASS REJECT_ENTITY_OVERLAP MISSING:rows`.",
        feedback:
          "El overlap se deriva de las filas. Reportarlo es parte del informe de split: sin números, la cola de revisión no puede auditar leakage de identidad.",
        retrospective:
          "e1 en train y test (mismo entity, distinto ts) es group leakage: PASS solo si lados no vacíos y la intersección de entity es vacía. Confiar en “ambos lados tienen filas” sin medir overlap aprueba el fallo clásico. Pregunta: ¿por qué el invalid con e1/e1 no puede ser PASS aunque n_train y n_test sean ≥1? Luego (E3): `REQUEST_SPLIT_KEYS`.",
        starterCode: {
          language: 'python',
          title: "s32-t4-a-e2.py",
          code: `# E2 — assess split isolation (Red Andina sintético, sin PII real)
# DEFECT: no calcula overlap; PASS con intersección de entidades
def assess(record: dict) -> str:
    required = {"case_id", "rows", "cut"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    rows, cut = record["rows"], record["cut"]
    train = [r for r in rows if r["ts"] < cut]
    test = [r for r in rows if r["ts"] >= cut]
    # DEFECT: ignora intersección real
    return "PASS" if train and test else "REJECT_ENTITY_OVERLAP"

valid = {
    "case_id": "caso-ra-4a",
    "cut": "2026-02-01",
    "rows": [
        {"ts": "2026-01-10", "entity": "e1"},
        {"ts": "2026-02-10", "entity": "e2"},
    ],
}
invalid = {
    "case_id": "caso-ra-4a",
    "cut": "2026-02-01",
    "rows": [
        {"ts": "2026-01-10", "entity": "e1"},
        {"ts": "2026-02-10", "entity": "e1"},
    ],
}
incomplete = {k: v for k, v in valid.items() if k != "rows"}
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "rows", "cut"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    rows, cut = record["rows"], record["cut"]
    train = [r for r in rows if r["ts"] < cut]
    test = [r for r in rows if r["ts"] >= cut]
    overlap = set(r["entity"] for r in train) & set(r["entity"] for r in test)
    ok = len(train) >= 1 and len(test) >= 1 and len(overlap) == 0
    return "PASS" if ok else "REJECT_ENTITY_OVERLAP"

valid = {
    "case_id": "caso-ra-4a",
    "cut": "2026-02-01",
    "rows": [
        {"ts": "2026-01-10", "entity": "e1"},
        {"ts": "2026-02-10", "entity": "e2"},
    ],
}
invalid = {
    "case_id": "caso-ra-4a",
    "cut": "2026-02-01",
    "rows": [
        {"ts": "2026-01-10", "entity": "e1"},
        {"ts": "2026-02-10", "entity": "e1"},
    ],
}
incomplete = {k: v for k, v in valid.items() if k != "rows"}
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
          output: `PASS REJECT_ENTITY_OVERLAP MISSING:rows` ,
        },
      },
      {
        id: "S32-T4-A-E3",
        subtopicId: "S32-T4-A",
        kind: "transfer",
        title: "Fail-closed: REQUEST_SPLIT_KEYS antes del baseline",
        preamble:
          "- **Contexto:** sin filas de split no se puede auditar leakage de identidad antes del baseline.\n- **Meta:** overlap 0 y lados no vacíos → CONTINUE; overlap > 0 → REJECT; sin rows → REQUEST_SPLIT_KEYS.\n- **Éxito:** `CONTINUE REJECT_ENTITY_OVERLAP REQUEST_SPLIT_KEYS`.\n- **Límites:** no confíes en n_train prebakeado; recalcula intersección.",
        instruction:
          "1. DEFECT: missing→CONTINUE; no mide intersección.\n2. Sin rows → REQUEST_SPLIT_KEYS.\n3. Con rows: CONTINUE solo si overlap 0 y lados no vacíos.\n4. Imprime las tres decisiones.",
        hint: "Sin rows → REQUEST_SPLIT_KEYS. Con rows: train = ts < cut; overlap = intersección de entity.",
        hints: [
          "Sin rows → REQUEST_SPLIT_KEYS. Con rows: train = ts < cut; overlap = intersección de entity.",
          "CONTINUE solo si len(train)>=1, len(test)>=1 y len(overlap)==0 — no confíes en n_train prebakeado.",
        ],
        edgeCases: ["falta rows", "fixture adverso: misma entity en train y test (overlap>0)", "Caso sintético Red Andina (sin PII real)"],
        tests: "Salida: `CONTINUE REJECT_ENTITY_OVERLAP REQUEST_SPLIT_KEYS`.",
        feedback:
          "Sin filas de split no se puede auditar el leakage de identidad. El overlap se recalcula, no se inventa: un “ok” sin números no pasa el gate hacia S33.",
        retrospective:
          "El informe de split es obligatorio antes del baseline: sin filas no se audita leakage de identidad. El error clásico es “ok” sin n_train/n_test/overlap o confiar en tamaños prebakeados. Pregunta: ¿qué sale si e1 está en train y test? Ese REJECT protege el AUC que verá S33.",
        starterCode: {
          language: 'python',
          title: "s32-t4-a-e3.py",
          code: `# E3 — decide REQUEST_SPLIT_KEYS (Red Andina sintético, sin PII real)
# DEFECT: missing→CONTINUE; no calcula overlap desde rows
def decide(record: dict) -> str:
    required = {"case_id", "rows", "cut"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    # DEFECT: confía en flags implícitos sin medir intersección
    return "CONTINUE" if record.get("rows") else "REJECT_ENTITY_OVERLAP"

valid = {
    "case_id": "caso-ra-4a",
    "cut": "2026-02-01",
    "rows": [
        {"ts": "2026-01-10", "entity": "e1"},
        {"ts": "2026-02-10", "entity": "e2"},
    ],
}
invalid = {
    "case_id": "caso-ra-4a",
    "cut": "2026-02-01",
    "rows": [
        {"ts": "2026-01-10", "entity": "e1"},
        {"ts": "2026-02-10", "entity": "e1"},
    ],
}
uncertain = {k: v for k, v in valid.items() if k != "rows"}
print(*[decide(r) for r in (valid, invalid, uncertain)])
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "rows", "cut"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_SPLIT_KEYS"
    rows, cut = record["rows"], record["cut"]
    train = [r for r in rows if r["ts"] < cut]
    test = [r for r in rows if r["ts"] >= cut]
    overlap = set(r["entity"] for r in train) & set(r["entity"] for r in test)
    ok = len(train) >= 1 and len(test) >= 1 and len(overlap) == 0
    return "CONTINUE" if ok else "REJECT_ENTITY_OVERLAP"

valid = {
    "case_id": "caso-ra-4a",
    "cut": "2026-02-01",
    "rows": [
        {"ts": "2026-01-10", "entity": "e1"},
        {"ts": "2026-02-10", "entity": "e2"},
    ],
}
invalid = {
    "case_id": "caso-ra-4a",
    "cut": "2026-02-01",
    "rows": [
        {"ts": "2026-01-10", "entity": "e1"},
        {"ts": "2026-02-10", "entity": "e1"},
    ],
}
uncertain = {k: v for k, v in valid.items() if k != "rows"}
results = [decide(r) for r in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_ENTITY_OVERLAP", "REQUEST_SPLIT_KEYS"]
` ,
          output: `CONTINUE REJECT_ENTITY_OVERLAP REQUEST_SPLIT_KEYS` ,
        },
      },
      {
        id: "S32-T4-B-E1",
        subtopicId: "S32-T4-B",
        kind: "guided",
        title: "Gate limpio: scan, skew y fs-vN",
        preamble:
          "- **Contexto:** el promote hacia S33 solo avanza con catálogo limpio, skew bajo tolerancia e id versionado.\n- **Meta:** names sin label/decision, |serve−train| ≤ tol, feature_set `fs-v*`.\n- **Éxito:** `S32-T4-B PASS`.\n- **Límites:** no inviertas el gate; no ignores feature_set.",
        instruction:
          "1. DEFECT: `meets = bool(leaky) or skew`.\n2. Cambia a not leaky and not skew and startswith('fs-v').\n3. Status PASS/REJECT_LEAKAGE.\n4. Imprime `S32-T4-B` y el status.",
        hint: "leaky = [n for n in names if 'label' in n or 'decision' in n].",
        hints: [
          "leaky = [n for n in names if 'label' in n or 'decision' in n].",
          "meets = not leaky and not skew and feature_set.startswith('fs-v').",
        ],
        edgeCases: ["falta feature_set", "fixture adverso: label_decision en names o skew True", "Caso sintético Red Andina (sin PII real)"],
        tests: "Imprime `S32-T4-B PASS` con scan limpio y fs-v2.",
        feedback:
          "El scan de nombres y el skew cierran el promote. Un gate invertido “premia” el leakage y deja el baseline S33 sobre un espejismo de AUC.",
        retrospective:
          "Promote limpio = sin leaky, sin skew, con fs-vN. El error clásico es invertir el booleano del gate y “pasar” cuando hay basura en el catálogo. Pregunta: ¿qué pasa si names trae `label_decision` y skew es False? (REJECT). Siguiente (E2): assess con label_decision.",
        starterCode: {
          language: 'python',
          title: "s32-t4-b-e1.py",
          code: `# E1 — leakage/skew/version gate (Red Andina sintético, sin PII real)
# DEFECT: gate invertido (PASS si hay leak o skew)
names = ["amount_7d", "canal_mode"]
train_mean, serve_mean, tol = 0.0, 0.1, 0.5
feature_set = "fs-v2"
leaky = [n for n in names if "label" in n or "decision" in n]
skew = abs(serve_mean - train_mean) > tol
meets = bool(leaky) or skew  # DEFECT
status = "PASS" if meets else "REJECT_LEAKAGE"
print("S32-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t4-b-e1.py",
          code: `names = ["amount_7d", "canal_mode"]
train_mean, serve_mean, tol = 0.0, 0.1, 0.5
feature_set = "fs-v2"
leaky = [n for n in names if "label" in n or "decision" in n]
skew = abs(serve_mean - train_mean) > tol
meets = (not leaky) and (skew is False) and str(feature_set).startswith("fs-v")
status = "PASS" if meets else "REJECT_LEAKAGE"
print("S32-T4-B", status)
assert meets is True
` ,
          output: `S32-T4-B PASS` ,
        },
      },
      {
        id: "S32-T4-B-E2",
        subtopicId: "S32-T4-B",
        kind: "independent",
        title: "Assess leakage, skew y feature_set",
        preamble:
          "- **Contexto:** `label_decision` en names y |serve−train| > tol son rechazo de promote, no “features útiles”.\n- **Meta:** PASS limpio; REJECT_LEAKAGE en adverso; MISSING sin feature_set.\n- **Éxito:** `PASS REJECT_LEAKAGE MISSING:feature_set`.\n- **Límites:** recalcula leaky y skew; no uses listas prebakeadas de “ya sé que pasa”.",
        instruction:
          "1. DEFECT: PASS si leaky o skew.\n2. Missing feature_set → MISSING:feature_set.\n3. PASS solo si not leaky, not skew y fs-v*.\n4. Imprime las tres rutas.",
        hint: "leaky = [n for n in names if 'label' in n or 'decision' in n]; skew = abs(serve-train) > tol.",
        hints: [
          "leaky = [n for n in names if 'label' in n or 'decision' in n]; skew = abs(serve-train) > tol.",
          "PASS si not leaky and not skew and feature_set.startswith('fs-v').",
        ],
        edgeCases: ["falta feature_set", "fixture adverso: label_decision en names o skew True", "Caso sintético Red Andina (sin PII real)"],
        tests: "Salida: `PASS REJECT_LEAKAGE MISSING:feature_set`.",
        feedback:
          "`label_decision` en el catálogo es red flag de leakage, no una feature útil. El skew se mide con umbral: intuición no sustituye el cálculo antes del promote.",
        retrospective:
          "`label_decision` en names y |serve−train| > tol son rechazo de promote, no “features útiles”. El skew se mide con umbral; la intuición no sustituye el cálculo. Pregunta: en el fixture adverso, ¿falla por leaky, por skew, o por ambos? Luego (E3): `REQUEST_FEATURE_SET_ID`.",
        starterCode: {
          language: 'python',
          title: "s32-t4-b-e2.py",
          code: `# E2 — assess leakage y skew (Red Andina sintético, sin PII real)
# DEFECT: PASS cuando hay leaky o skew
def assess(record: dict) -> str:
    required = {"case_id", "names", "train_mean", "serve_mean", "tol", "feature_set"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    names = record["names"]
    leaky = [n for n in names if "label" in n or "decision" in n]
    skew = abs(record["serve_mean"] - record["train_mean"]) > record["tol"]
    # DEFECT: invierte el gate de promote
    return "PASS" if leaky or skew else "REJECT_LEAKAGE"

valid = {
    "case_id": "caso-ra-4b",
    "names": ["amount_7d", "canal_mode"],
    "train_mean": 0.0,
    "serve_mean": 0.1,
    "tol": 0.5,
    "feature_set": "fs-v2",
}
invalid = {
    "case_id": "caso-ra-4b",
    "names": ["amount_7d", "label_decision"],
    "train_mean": 0.0,
    "serve_mean": 0.8,
    "tol": 0.5,
    "feature_set": "fs-v2",
}
incomplete = {k: v for k, v in valid.items() if k != "feature_set"}
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", "names", "train_mean", "serve_mean", "tol", "feature_set"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    leaky = [n for n in record["names"] if "label" in n or "decision" in n]
    skew = abs(record["serve_mean"] - record["train_mean"]) > record["tol"]
    ok = (not leaky) and (skew is False) and str(record["feature_set"]).startswith("fs-v")
    return "PASS" if ok else "REJECT_LEAKAGE"

valid = {
    "case_id": "caso-ra-4b",
    "names": ["amount_7d", "canal_mode"],
    "train_mean": 0.0,
    "serve_mean": 0.1,
    "tol": 0.5,
    "feature_set": "fs-v2",
}
invalid = {
    "case_id": "caso-ra-4b",
    "names": ["amount_7d", "label_decision"],
    "train_mean": 0.0,
    "serve_mean": 0.8,
    "tol": 0.5,
    "feature_set": "fs-v2",
}
incomplete = {k: v for k, v in valid.items() if k != "feature_set"}
print(*(assess(r) for r in (valid, invalid, incomplete)))
` ,
          output: `PASS REJECT_LEAKAGE MISSING:feature_set` ,
        },
      },
      {
        id: "S32-T4-B-E3",
        subtopicId: "S32-T4-B",
        kind: "transfer",
        title: "Fail-closed: REQUEST_FEATURE_SET_ID hacia S33",
        preamble:
          "- **Contexto:** el feature_set id es el contrato que el baseline S33 debe citar; sin id no se entrena.\n- **Meta:** limpio → CONTINUE; leaky/skew → REJECT; sin feature_set → REQUEST_FEATURE_SET_ID.\n- **Éxito:** `CONTINUE REJECT_LEAKAGE REQUEST_FEATURE_SET_ID`.\n- **Límites:** no promotes ciego; recalcula scan y skew.",
        instruction:
          "1. DEFECT: missing→CONTINUE; always CONTINUE.\n2. Sin feature_set → REQUEST_FEATURE_SET_ID.\n3. Con id: CONTINUE solo si scan limpio, sin skew y fs-v*.\n4. Imprime las tres decisiones.",
        hint: "Sin feature_set → REQUEST_FEATURE_SET_ID. Con id: recalcula leaky y skew; no uses listas prebakeadas.",
        hints: [
          "Sin feature_set → REQUEST_FEATURE_SET_ID. Con id: recalcula leaky y skew; no uses listas prebakeadas.",
          "leaky = [n for n in names if 'label' in n or 'decision' in n]; skew = abs(serve_mean-train_mean) > tol.",
        ],
        edgeCases: ["falta feature_set", "fixture adverso: label_decision en names o |serve−train|>tol", "Caso sintético Red Andina (sin PII real)"],
        tests: "Salida: `CONTINUE REJECT_LEAKAGE REQUEST_FEATURE_SET_ID`.",
        feedback:
          "El feature_set id es el contrato que S33 debe citar. El promote se gana midiendo scan y skew, no con CONTINUE ciego: sin id no se entrena el baseline.",
        retrospective:
          "El promote se gana midiendo scan y skew, no leyendo un booleano previo: el id `fs-v*` es el contrato que S33 citará. El error clásico es CONTINUE ciego o entrenar sin feature_set. Pregunta: ¿qué sale si falta `feature_set` en el record? Ese REQUEST cierra el handoff de la tabla versionada.",
        starterCode: {
          language: 'python',
          title: "s32-t4-b-e3.py",
          code: `# E3 — decide REQUEST_FEATURE_SET_ID (Red Andina sintético, sin PII real)
# DEFECT: missing→CONTINUE; no escanea names ni mide skew
def decide(record: dict) -> str:
    required = {"case_id", "names", "train_mean", "serve_mean", "tol", "feature_set"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    # DEFECT: promote ciego
    return "CONTINUE"

valid = {
    "case_id": "caso-ra-4b",
    "names": ["amount_7d", "canal_mode"],
    "train_mean": 0.0,
    "serve_mean": 0.1,
    "tol": 0.5,
    "feature_set": "fs-v2",
}
invalid = {
    "case_id": "caso-ra-4b",
    "names": ["amount_7d", "label_decision"],
    "train_mean": 0.0,
    "serve_mean": 0.8,
    "tol": 0.5,
    "feature_set": "fs-v2",
}
uncertain = {k: v for k, v in valid.items() if k != "feature_set"}
print(*[decide(r) for r in (valid, invalid, uncertain)])
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", "names", "train_mean", "serve_mean", "tol", "feature_set"}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_FEATURE_SET_ID"
    leaky = [n for n in record["names"] if "label" in n or "decision" in n]
    skew = abs(record["serve_mean"] - record["train_mean"]) > record["tol"]
    ok = (not leaky) and (skew is False) and str(record["feature_set"]).startswith("fs-v")
    return "CONTINUE" if ok else "REJECT_LEAKAGE"

valid = {
    "case_id": "caso-ra-4b",
    "names": ["amount_7d", "canal_mode"],
    "train_mean": 0.0,
    "serve_mean": 0.1,
    "tol": 0.5,
    "feature_set": "fs-v2",
}
invalid = {
    "case_id": "caso-ra-4b",
    "names": ["amount_7d", "label_decision"],
    "train_mean": 0.0,
    "serve_mean": 0.8,
    "tol": 0.5,
    "feature_set": "fs-v2",
}
uncertain = {k: v for k, v in valid.items() if k != "feature_set"}
results = [decide(r) for r in (valid, invalid, uncertain)]
print(*results)
assert results == ["CONTINUE", "REJECT_LEAKAGE", "REQUEST_FEATURE_SET_ID"]
` ,
          output: `CONTINUE REJECT_LEAKAGE REQUEST_FEATURE_SET_ID` ,
        },
      }
    ],
  },
  youDo: {
    title: "Feature table versionada sin leakage (CP-N3-B)",
    context:
      "Entrega un mini feature set para el caso sintético Red Andina (`run_id=cpn3b-feat`, sin PII real): catálogo, ventanas half-open, state versionado, split sin overlap y scan de leakage. El artefacto `fs-vN` (JSON con medianas, vocab y schema hash) es el **contrato de entrada del baseline S33**: sin él no se entrena.",
    objectives: [
      "Catalog dtypes y keys validadas (row ⊆ catálogo); reportar unknown_keys.",
      "Missing indicator + mediana de train + apply en serve (silent_fill=False).",
      "Graph feats (shared/degree/path default 99, puente S31) + ventana half-open [t−w, t) con count documentado.",
      "fs-vN versionado, leakage scan, skew check y split con overlap 0 + informe n_train/n_test/overlap para S33.",
    ],
    requirements: [
      "Train≡serve: mismo código y state en train e inferencia",
      "Sin future ts ni label/decision como feature",
      "Solo PII sintético; feature_set id fs-vN documentado",
      "Informe de split: n_train, n_test, overlap",
      "Acceptance checks del starter en verde (version, n_events E1, overlap 0, leaky vacío)",
    ],
    starterCode: `# features CP-N3-B — caso Red Andina sintético / run_id=cpn3b-feat
# Entrega: catálogo, state versionado, ventana half-open, split sin overlap, scan de leakage.
# Traspaso a S33: el baseline debe citar feature_set id (fs-vN) y el informe de split.
# Contrato JSON esperado (mínimo):
#   {"version": "fs-vN", "median_amount": float, "schema": {...}, "split": {"n_train", "n_test", "overlap"}}
events = [
    {"entity": "E1", "ts": 1, "canal": "app", "amount": 10.0},
    {"entity": "E1", "ts": 2, "canal": "app", "amount": 12.0},
    {"entity": "E2", "ts": 3, "canal": "web", "amount": 8.0},
    {"entity": "E2", "ts": 5, "canal": "app", "amount": 9.0},
]
decision_t = 5
window_w = 3
catalog = {"numeric": ["amount_3t", "n_events_3t"], "categorical": ["canal_mode"], "text": []}
state = {"version": "fs-v1", "median_amount": None}  # fit solo con train (ts < decision_t)
feature_names = ["amount_3t", "n_events_3t", "canal_mode"]  # sin label_*


def window_count(entity_events, t, w):
    """Cuenta eventos con ts en [t-w, t). No incluir ts == t."""
    raise NotImplementedError("half-open [t-w, t)")


def fit_median(train_amounts):
    """Mediana de train; None si lista vacía. Ordena y toma el centro."""
    raise NotImplementedError("stats solo de train")


def graph_feats(a_addr, b_addr, neighbors, paths, src="E1", dst="E9"):
    """shared, degree, path (default 99). No uses labels de decisión."""
    raise NotImplementedError("topologia S31 → features; path missing = 99")


def time_group_split(rows, cut_ts):
    """Devuelve (train, test, overlap_count). Happy path: overlap de entity = 0."""
    raise NotImplementedError("time + entity isolation")


def leak_scan(names):
    """Nombres con 'label' o 'decision'."""
    raise NotImplementedError("flag label/decision")


def skew_alert(train_mean, serve_mean, tol=0.5):
    """True si |serve_mean - train_mean| > tol."""
    raise NotImplementedError("|serve-train| > tol")


if __name__ == "__main__":
    e1 = [e for e in events if e["entity"] == "E1"]
    n_e1 = window_count(e1, decision_t, window_w)  # esperado: 2 (ts 1 y 2)
    train_amts = [e["amount"] for e in events if e["ts"] < decision_t]
    state["median_amount"] = fit_median(train_amts)
    # opcional: shared/degree/path desde mini-grafo (no son labels de fraude)
    # shared, degree, path = graph_feats("Av1", "Av1", {"E1": ["E2"]}, {"E1-E2": 1})
    rows = [{"ts": e["ts"], "entity": e["entity"]} for e in events]
    tr, te, ov = time_group_split(rows, decision_t)
    leaky = leak_scan(feature_names)
    print("version", state["version"])
    print("n_events_E1", n_e1)
    print("overlap", ov)
    print("leaky", leaky)
    # Acceptance (descomenta asserts cuando implementes):
    # assert n_e1 == 2 and ov == 0 and leaky == [] and state["median_amount"] is not None
    # assert str(state["version"]).startswith("fs-v")
`,
    portfolioNote:
      "Feature set fs-vN + anti-leakage checklist + informe de split (n_train, n_test, overlap 0) listos para el baseline S33. Incluye schema hash o lista de columnas congelada.",
    rubric: [
      { criterion: "Train≡serve, sin leakage temporal/de label y feature set versionado", weight: "25%" },
      { criterion: "Correctitud técnica: ventanas half-open, stats de train, split con overlap 0", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (adverso includes_t, unknown feature)", weight: "15%" },
      { criterion: "Código legible y límites claros (REQUEST_* vs. REJECT_*)", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "fs-vN + ventana half-open + zero entity overlap + traspaso a S33", weight: "bonus" },
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con print o assert — ventana half-open, overlap 0, o leaky vacío? (2) ¿qué harías distinto con datos reales vs. sintéticos Red Andina (PII, ventanas legales, labels de decisión)? (3) Escribe en el README una frase de impacto medible (p. ej. “mismo state `fs-vN` en train y serve; overlap entity = 0”) que puedas defender en 30 segundos ante quien entrena el baseline S33.",
  },
  selfCheck: {
    questions: [
      {
        question: "Una ventana half-open [t−w, t) excluye:",
        options: ["Todo el pasado", "Solo categóricas", "El catálogo", "El instante t y el futuro"],
        correctIndex: 3,
        explanation:
          "Half-open evita leakage temporal al no contar el momento de decisión ni timestamps futuros.",
      },
      {
        question: "Transform antes de fit debe:",
        options: ["Rellenar con 0 en silencio", "Fallar de forma explícita", "Usar test stats", "Ignorar missing"],
        correctIndex: 1,
        explanation:
          "El contrato fit→transform exige fallo explícito si no hay estado fitted.",
      },
      {
        question: "Overlap de entidades entre train y test:",
        options: ["Es deseable", "Solo afecta texto", "Es leakage de identidad", "Se ignora en group CV"],
        correctIndex: 2,
        explanation:
          "La misma entidad en ambos lados infla métricas; overlap debe ser 0.",
      },
      {
        question: "Un nombre de feature con 'label' o 'decision':",
        options: ["Es red flag de leakage", "Es inofensivo", "Reemplaza al target", "Solo importa en UI"],
        correctIndex: 0,
        explanation:
          "Features que embeden la decisión o el label contaminan el entrenamiento.",
      },
      {
        question: "Al estandarizar amount, μ y σ deben calcularse…",
        options: ["sobre train+test juntos para más datos", "solo sobre test para validar", "de nuevo en cada fila de serve", "solo sobre train y reutilizarse en serve"],
        correctIndex: 3,
        explanation:
          "Estadísticas de escalado/encoding se aprenden en fit (train) y se congelan; re-fit en test/serve es leakage o skew.",
      },
      {
        question: "Si en serve aparece una key que no está en el feature catalog:",
        options: ["se ignora en silencio", "se rechaza (REJECT_UNKNOWN_FEATURE) o se pide REQUEST_CATALOG", "se agrega al catálogo al vuelo", "solo afecta a features de texto"],
        correctIndex: 1,
        explanation:
          "Train≡serve exige keys ⊆ catálogo; una feature inventada en serve rompe el contrato.",
      },
      {
        question: "Un missing indicator junto al fill con mediana de train sirve para:",
        options: ["ocultar la ausencia al modelo", "reestimar la mediana en cada fila de serve", "preservar la señal de ausencia y evitar silent fill", "reemplazar el z-score"],
        correctIndex: 2,
        explanation:
          "El indicator (1 si era None) viaja con el valor relleno; rellenar sin él es silent fill.",
      },
      {
        question: "Skew train–serve se detecta midiendo, por ejemplo:",
        options: ["|mean_serve − mean_train| > tol sobre la misma feature", "solo el AUC offline", "el número de líneas del notebook", "si el grafo tiene degree > 0"],
        correctIndex: 0,
        explanation:
          "Divergencia de distribuciones o de lógica entre entrenamiento e inferencia; se monitorea con umbral.",
      },
      {
        question: "Si el vocabulario de una categórica crece y cambias el schema del feature set, debes…",
        options: ["reutilizar fs-v1 en silencio para no romper S33", "borrar la version del state para forzar re-fit en serve", "mezclar train y test al recalcular la mediana", "subir el version bump (p. ej. fs-v1 → fs-v2) y citar el nuevo id"],
        correctIndex: 3,
        explanation:
          "Cambio de vocab/schema invalida el contrato congelado: version bump y el baseline S33 debe citar el fs-vN nuevo.",
      },
      {
        question: "Falta el JSON de state fit en serve. La respuesta fail-closed correcta es…",
        options: ["rellenar con 0 y continuar", "REQUEST_STATE_JSON (pedir el artefacto; no inventar defaults)", "REJECT_LEAKAGE inmediato", "promover fs-vN vacío"],
        correctIndex: 1,
        explanation:
          "Ausencia de prerequisito → REQUEST_*; incumplimiento detectado (futuro, label, overlap) → REJECT_*. No silent defaults.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "sklearn Pipeline / compose",
        url: "https://scikit-learn.org/stable/modules/compose.html",
        note: "fit/transform y ColumnTransformer",
      },
      {
        label: "sklearn ColumnTransformer",
        url: "https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html",
        note: "Columnas heterogéneas",
      },
      {
        label: "Feast — feature store concepts",
        url: "https://docs.feast.dev/",
        note: "Train-serve y materialización",
      },
      {
        label: "Google Rules of ML",
        url: "https://developers.google.com/machine-learning/guides/rules-of-ml",
        note: "Training-serving skew y leakage",
      },
      {
        label: "sklearn model persistence",
        url: "https://scikit-learn.org/stable/model_persistence.html",
        note: "Serializar transformers",
      },
      {
        label: "Time-series cross-validation (sklearn)",
        url: "https://scikit-learn.org/stable/modules/cross_validation.html#time-series-split",
        note: "Splits temporales",
      },
      {
        label: "Common ML pitfalls — leakage",
        url: "https://scikit-learn.org/stable/common_pitfalls.html",
        note: "Data leakage patterns",
      },
    ],
    books: [
      { label: "Feature Engineering for Machine Learning", note: "Leakage patterns y encodings" },
      { label: "Designing Machine Learning Systems (Huyen)", note: "Feature stores y skew" },
    ],
    courses: [
      {
        label: "Coursera — ML Engineering for Production (MLOps)",
        url: "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops",
        note: "Feature pipelines y producción",
      },
      {
        label: "deeplearning.ai — data engineering",
        url: "https://www.deeplearning.ai/specializations/data-engineering",
        note: "Pipelines de features",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Contratos y tests",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "Proyectos reproducibles",
      },
    ],
  },
}
