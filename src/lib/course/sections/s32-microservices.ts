import type { CourseSection } from '../../types'

export const section32: CourseSection = {
  id: "microservices",
  index: 32,
  title: "Feature engineering y pipelines sin leakage",
  shortTitle: "Features sin leakage",
  tagline:
    "tabla de features versionada con train≡serve, sin futuro ni labels de decisión · Ritmo sugerido: ~10–12 h núcleo (T1–T4 + labs E1), 14–16 h con E2/E3 y You Do, 18 h si profundizas skew/versionado hacia S33",
  estimatedHours: 18,
  level: "Competente a experto",
  phase: 2,
  icon: "TableProperties",
  accentColor: "bg-gradient-to-br from-indigo-500 to-violet-800",
  jobRelevance:
    "Features mal hechas **filtran el futuro** y crean modelos que fallan en producción. En esta sección construyes la **tabla de features versionada** del workbench de investigación relacional (CP-N3-B): misma lógica en entrenamiento e inferencia, sin timestamps futuros ni labels de decisión. Features de grafo o contacto compartido **no** son etiqueta de fraude ni de parentesco.",
  learningOutcomes: [
    { text: "Diseñar un feature catalog (numéricas, categóricas y de texto) y validar que las keys del row ⊆ catálogo antes del fit; evidencia: catalog_ok y lista unknown_keys" },
    { text: "Aplicar missing indicators, fill con mediana de train y z-score con μ/σ congelados; demostrar silent_fill=False" },
    { text: "Construir features relacionales (shared_address, degree, min path) sin usar label de decisión como input" },
    { text: "Calcular conteos y frecuencias en ventanas half-open [t−w, t) documentadas en el catálogo" },
    { text: "Componer transformers custom con fit→transform y cadena por tipo de columna (ruta numérica vs categórica)" },
    { text: "Persistir estado fit (mediana, vocab, version) como JSON fs-vN y reutilizarlo en el batch de serve" },
    { text: "Partir por tiempo y entidad con informe de split: n_train, n_test y overlap de entidades = 0" },
    { text: "Ejecutar scan de nombres leaky + alerta de skew train–serve y promover solo con feature_set id válido" },
  ],
  theory: [
    {
      heading: "Tabla de features versionada sin leakage",
      paragraphs: [
        "Imagina un modelo offline con AUC excelente que se derrumba al desplegarse: las features de train usaron el timestamp del outcome o la mediana del set completo. Eso es **leakage** — filtrar al entrenamiento información que no existiría en el momento de la decisión. En un workbench de investigación relacional el daño es doble: métricas optimistas y colas humanas que confían en scores contaminados. Aquí construyes la **tabla de features versionada** del workbench **CP-N3-B** con filas sintéticas por par entidad/caso (`run_id=cpn3b-feat`) en la Red Andina ficticia. El gate es **train ≡ serve**: la misma transformación en entrenamiento e inferencia, sin leakage temporal ni de label.",
        "Historia mínima del fallo (antes de la solución): un notebook cuenta eventos con `ts <= t` e incluye el instante de decisión; el AUC sube; en serve, con la ventana correcta, el score colapsa. Otro fallo: la mediana de amount se calcula sobre train+test y el z-score “conoce” el futuro. Esta sección te da el camino inverso — catálogo, ventana half-open, stats congeladas, split sin overlap y `fs-vN` — para que el baseline de S33 no herede un espejismo.",
        "Producto incremental: **catálogo** + transformers **fit/transform idénticos** en train e inferencia, **sin futuro** ni labels de decisión como feature. Entrada: eventos y grafo sintético (continuación del grafo de evidencia de S31: shared address, degree, path); salida: feature set id `fs-vN` con hash de schema listo para el baseline de S33. Orden: **T1 tipos** → **T2 relacionales/grafo** → **T3 pipelines** → **T4 validación/leakage**. Features de contacto o shared address **no** son etiqueta de fraude ni parentesco: son señales para el modelo o la cola humana, no veredictos.",
      ],
      callout: {
        type: "info",
        title: "Gate features",
        content:
          "Train≡serve, sin leakage temporal ni de label. Solo PII sintético. Si hay timestamps futuros en features, la sección no se considera superada.",
      },
    },
    {
      heading: "Diccionario mínimo de la sección",
      paragraphs: [
        "**Leakage:** usar en el entrenamiento información que no existiría en el momento de la decisión (futuro, label, o identidad vista en test). **Train≡serve:** el código y el estado (mediana, vocabulario, μ/σ) que transforman filas en train son los mismos que en inferencia. Si solo el notebook de train conoce un fill o un vocab, hay skew silencioso.",
        "**Ventana half-open [t−w, t):** cuenta eventos con timestamp ≥ t−w y **estrictamente < t**; no incluye el instante de decisión. **Feature set `fs-vN`:** identificador versionado del catálogo + transformers fit; un cambio de vocab o schema sube N. **Skew train–serve:** divergencia de distribuciones o de lógica entre entrenamiento e inferencia; se monitorea (p. ej. |mean_serve − mean_train| > tol).",
        "**Fail-closed en features:** si falta catálogo, estado fit o ventana documentada, no inventes valores: devuelve `REQUEST_*`. Si detectas futuro, label-as-feature u overlap de entidades, devuelve `REJECT_*`. El vocabulario de gates es entrevista-relevante y se reutiliza en MLOps posteriores.",
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
        "Aplicación a `CASO-LIM-032`: schema numéricas `amount_7d`; categórica `canal`; texto `note` con derivado `note_len`; row keys validadas contra catálogo del run `cpn3b-feat` (sintético, sin PII real). Si aparece `unknown_feat`, el gate es `REJECT_UNKNOWN_FEATURE`.",
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
          "S32-T1-A: catálogo + keys. Incumplimiento → REJECT_UNKNOWN_FEATURE; falta catálogo → REQUEST_CATALOG.",
      },
    },
    {
      heading: "Missing indicators, escalamiento y encoding",
      subtopicId: "S32-T1-B",
      paragraphs: [
        "Un **missing indicator** (1 si el valor era ausente) + fill (mediana/moda de **train**) preserva la **señal de ausencia**. Rellenar en silencio con 0 o con la mediana del set completo es **silent fill** y suele filtrar estadísticas de test. El z-score usa **μ/σ solo de train**, congelados en fit; reestimarlos en serve es leakage o skew.",
        "Contrato: entrada serie con `None`, fill/μ/σ aprendidos en train; salida indicator, serie rellena y z sobre la serie rellena. Error: calcular mediana con filas de test o re-fit en serve. Criterio: **stats congeladas en fit**. Encoding one-hot con columna `unknown` sigue la misma idea: vocab de train, no del batch de serve.",
        "Aplicación a `CASO-LIM-032`: `[1, None, 3]` → indicator + fill mediana 2 → z con μ=0, σ=2 del train fit sobre la serie completa rellena. `silent_fill` debe quedar en False porque el indicator viaja junto al valor.",
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
          "S32-T1-B: indicator + stats de train. Incumplimiento → REJECT_SILENT_FILL; falta mediana → REQUEST_MEDIAN.",
      },
    },
    {
      heading: "Contacto compartido, distancia y features de grafo",
      subtopicId: "S32-T2-A",
      paragraphs: [
        "Features **relacionales** (`shared_address`, degree, min path) resumen evidencia del grafo de S31. **No** conviertas el score de matching ni la centralidad en label de parentesco o fraude: son inputs para el modelo o la cola, no veredictos. Un path ausente se codifica con default alto (p. ej. 99), no con inventar aristas.",
        "Contrato: entrada dos entidades (attrs), vecinos y tabla de paths; salida shared binario, degree y pathlen (default 99 si missing). Error: usar **label de decisión** o post-outcome como feature. Criterio: solo topología y atributos **observados en t**.",
        "Aplicación a `CASO-LIM-032`: `shared_address=1` entre dos direcciones iguales; degree de E1 sobre vecinos sintéticos; min path E1–E9 missing → 99 en grafo Lima–Arequipa ficticio.",
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
          "S32-T2-A: features de grafo. Incumplimiento → REJECT_LABEL_AS_FEATURE; falta feat → REQUEST_GRAPH_FEAT.",
      },
    },
    {
      heading: "Ventanas temporales y frecuencia",
      subtopicId: "S32-T2-B",
      paragraphs: [
        "Ventanas **half-open** `[t−w, t)` cuentan eventos **sin** incluir el instante de decisión `t`. Incluir `ts==t` o **futuro** es **leakage temporal clásico**: el modelo “ve” el outcome o el mismo evento de decisión. Documenta la política en el feature catalog para que train y serve no diverjan.",
        "Contrato: entrada lista `ts`, `t`, `w` (y opcionalmente canal); salida count en ventana y freq por canal. Error: `ts >= t` dentro del count. Criterio: política half-open **documentada** y testeada con un caso que incluya `ts==t`. Compara siempre el conteo **cerrado** (mal) vs **half-open** (bien) en el mismo fixture: si el score offline solo sube con el cerrado, sospecha leakage.",
        "Aplicación a `CASO-LIM-032`: eventos `[1, 2, 3, 5]` con `t=5`, `w=3` → half-open cuenta `2` y `3` (`count=2`); el cerrado mal contaría también `5` (`count=3`). Frecuencia app/web se calcula solo sobre el subconjunto half-open.",
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
          "S32-T2-B: ventana half-open. Incumplimiento → REJECT_FUTURE_TS; falta w → REQUEST_WINDOW.",
      },
    },
    {
      heading: "Transformers custom y cadena fit→transform",
      subtopicId: "S32-T3-A",
      paragraphs: [
        "Un **transformer** tiene `fit` (aprende estado) y `transform` (aplica). Encadenar fill luego scale exige `fitted=True`; **transform antes de fit debe fallar** de forma explícita — no silent default en serve. En sklearn el mismo contrato se formaliza con `Pipeline` (pasos en serie) y `ColumnTransformer` (pasos por columnas); aquí lo modelamos en Python puro para ver el contrato sin magia de librería y sin riesgo de APIs no instaladas en el workbench.",
        "Contrato: entrada serie categórica (o batch multi-columna) y steps; salida moda fit, transform `None→moda`, y error si `not_fitted`. Para columnas heterogéneas, un **router por tipo** (análogo de ColumnTransformer) aplica imputer/scale a numéricas y mode-imputer a categóricas. Un **MiniPipeline** encadena steps con un solo `fit` y un solo `transform` — la idea de sklearn Pipeline en pocas líneas. Criterio: **secuencia determinista train≡serve**.",
        "Aplicación a `CASO-LIM-032`: moda de canal `app`; cadena numérica fill0 luego *2 sobre montos; `not_fitted` levanta error si transform se llama antes de fit. Cuando migres a sklearn en el stack de producción, reutilizas el mismo orden mental: fit solo en train, transform en serve con estado congelado.",
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
          "S32-T3-A: fit→transform + router por columnas. Incumplimiento → REJECT_TRANSFORM_BEFORE_FIT; falta state → REQUEST_FIT_STATE.",
      },
    },
    {
      heading: "Fit, transform y persistencia del estado",
      subtopicId: "S32-T3-B",
      paragraphs: [
        "El **estado** (mediana, vocab, μ/σ) se serializa a JSON y se **reutiliza en serve**. Si el vocab cambia, **version bump** del feature set (`fs-vN`). Aplicar la mediana de train al batch de serve evita **skew silencioso**. En producción, joblib/pickle cumplen el mismo rol; aquí usamos JSON para inspeccionar el contrato a ojo.",
        "Contrato: entrada state dict; salida round-trip JSON y version. Error: servir **sin version**. Criterio: `fs-vN` en artefactos y hash de schema. Un serve sin `version` es `REJECT_UNVERSIONED`.",
        "Aplicación a `CASO-LIM-032`: state `median=2` round-trip; vocab change → `fs-v2`; apply median al serve batch sintético `[None, 4]` → `[2, 4]`. Este artefacto es el contrato de entrada del baseline S33.",
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
          "S32-T3-B: state versionado. Incumplimiento → REJECT_UNVERSIONED; falta JSON → REQUEST_STATE_JSON.",
      },
    },
    {
      heading: "Split por entidad, grupo y tiempo",
      subtopicId: "S32-T4-A",
      paragraphs: [
        "**Split temporal** (`train ts < cutoff`) y **group split por entity** evitan overlap. Si una entidad aparece en train y test, hay **leakage de identidad**: el modelo memoriza la entidad, no el patrón. En investigación relacional esto infla métricas de forma peligrosa.",
        "Contrato: entrada rows con `ts` y `entity`; salida train/test sets y `overlap` count. Error: `overlap > 0` en el gate. Criterio: group sizes reportados en el informe de split (`n_train`, `n_test`, `overlap`).",
        "Aplicación a `CASO-LIM-032`: train `ts < '2026-02-01'`; test el resto; **overlap entidades = 0**. Si e1 aparece en ambos lados, `REJECT_ENTITY_OVERLAP`.",
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
          "S32-T4-A: split temporal/por grupo. Incumplimiento → REJECT_ENTITY_OVERLAP; falta keys → REQUEST_SPLIT_KEYS.",
      },
    },
    {
      heading: "Leakage, skew train–serve y versionado",
      subtopicId: "S32-T4-B",
      paragraphs: [
        "Nombres con `label` o `decision` en features son **red flags** de leakage. Si `serve_mean` se desvía **> tol** de `train_mean`, hay **train–serve skew**. El feature set id `fs-vN` **congela** el contrato promovido hacia S33. Promover con leakage es fallo de gate, no un “warning opcional”.",
        "Contrato: entrada feature names, means, version; salida leak flags, skew alert, fs id. Error: **promover con leakage**. Criterio: scan de nombres + skew check en CI antes del baseline.",
        "Aplicación a `CASO-LIM-032`: flag `label_decision` en el scan; skew si `|serve − train| > 0.5`; id promovido `fs-v2` solo si leaky vacío y skew False.",
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
          "S32-T4-B: scan de leakage + skew + fs-vN. Incumplimiento → REJECT_LEAKAGE; falta id → REQUEST_FEATURE_SET_ID.",
      },
    }
  ],
  iDo: {
    intro: "S32 · Te muestro catálogo, missing/scale, grafo, ventanas, transformers y anti-leakage sobre run_id=cpn3b-feat. Cada demo **calcula** el concepto a partir de datos sintéticos.",
    steps: [
      {
        demoId: "S32-T1-A-DEMO",
        subtopicId: "S32-T1-A",
        environment: "local-python",
        description: "Valida keys del row contra el catálogo y reporta note_len como feature derivada.",
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
        why: "El catálogo es la fuente de verdad de dtypes y evita features desconocidas en serve.",
      },
      {
        demoId: "S32-T1-B-DEMO",
        subtopicId: "S32-T1-B",
        environment: "local-python",
        description: "Missing indicator, fill mediana y z-score sobre la serie rellena con stats de train.",
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
        why: "Indicator + stats de train preservan ausencia y evitan silent fill con datos de test.",
      },
      {
        demoId: "S32-T2-A-DEMO",
        subtopicId: "S32-T2-A",
        environment: "local-python",
        description: "Shared address, degree y path con default 99 cuando falta la arista en el grafo sintético.",
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
        why: "Features de grafo resumen evidencia relacional sin convertir matching en fraude.",
      },
      {
        demoId: "S32-T2-B-DEMO",
        subtopicId: "S32-T2-B",
        environment: "local-python",
        description: "Cuenta eventos en ventana half-open [t-w,t), contrasta con el conteo cerrado (mal) e incluye_t=False.",
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
        why: "La política half-open elimina leakage temporal; el conteo cerrado infla features y métricas offline.",
      },
      {
        demoId: "S32-T3-A-DEMO",
        subtopicId: "S32-T3-A",
        environment: "local-python",
        description: "Fit de moda, transform de None, fallo si no hay fit, y router numérico/categórico (análogo ColumnTransformer).",
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
        why: "fit/transform ordenado + router por tipo es el contrato de un pipeline heterogéneo reutilizable.",
      },
      {
        demoId: "S32-T3-B-DEMO",
        subtopicId: "S32-T3-B",
        environment: "local-python",
        description: "Round-trip JSON del state y apply de mediana versionada al batch de serve.",
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
        why: "Persistir estado versionado evita train–serve skew silencioso en el workbench.",
      },
      {
        demoId: "S32-T4-A-DEMO",
        subtopicId: "S32-T4-A",
        environment: "local-python",
        description: "Time split por cutoff y verificación de overlap de entidades desde filas reales.",
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
        why: "Split por tiempo y grupo es la defensa principal contra leakage de identidad.",
      },
      {
        demoId: "S32-T4-B-DEMO",
        subtopicId: "S32-T4-B",
        environment: "local-python",
        description: "Scan de nombres leaky, alerta de skew y feature_set fs-v2 listo para S33.",
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
        why: "El gate de leakage y versionado cierra el pipeline antes de entrenar el baseline S33.",
      }
    ],
  },
  weDo: {
    intro: "S32 · Laboratorio features sin leakage (CP-N3-B): 24 retos. E1 repara un defecto de cálculo, E2 valida/adverso/missing, E3 fail-closed. Construyes la feature o el gate a partir de datos sintéticos — no solo flags precomputados.",
    steps: [
      {
        id: "S32-T1-A-E1",
        subtopicId: "S32-T1-A",
        kind: "guided",
        instruction: "S32-T1-A-E1 · Sobre `CASO-LIM-032-1A`, calcula si las keys del row están ⊆ catálogo (union de numeric/categorical/text). El starter declara `catalog_ok` al revés: corrige el cálculo de unknown keys. Salida exacta: `S32-T1-A PASS`. En E2 el adverso con feature desconocida debe activar `REJECT_UNKNOWN_FEATURE`.",
        hint: "Une las listas del schema en un set known y compara set(row) ⊆ known.",
        hints: [
          "Une las listas del schema en un set known y compara set(row) ⊆ known.",
          "catalog_ok es True solo si no hay keys desconocidas; no inviertas el booleano final.",
        ],
        edgeCases: ["falta schema", "fixture adverso: row con unknown_feat fuera del catálogo", "CASO-LIM-032-1A es sintético"],
        tests: "Con schema y row del starter, imprime `S32-T1-A PASS` y assert catalog_ok.",
        feedback: "S32-T1-A-E1: sin keys desconocidas el catálogo pasa; una feature inventada en serve exige REJECT_UNKNOWN_FEATURE; sin schema, REQUEST_CATALOG.",
        starterCode: {
          language: 'python',
          title: "s32-t1-a-e1.py",
          code: `# CASO-LIM-032 · feature catalog types
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
        instruction: "S32-T1-A-E2 · Tres rutas: válido (keys ⊆ catálogo), adverso (`unknown_feat`) y sin `schema`. Implementa `assess` calculando unknown keys — no uses un flag prebakeado. Salidas: `PASS`, `REJECT_UNKNOWN_FEATURE`, `MISSING:schema`.",
        hint: "Primero valida keys requeridas; solo si hay schema y row calculas unknown.",
        hints: [
          "Primero valida keys requeridas; solo si hay schema y row calculas unknown.",
          "El adverso falla por contenido (feature fuera del catálogo), no por schema ausente.",
        ],
        edgeCases: ["falta schema", "fixture adverso: unknown_feat no listada en schema", "CASO-LIM-032-1A es sintético"],
        tests: "Produce exactamente `PASS REJECT_UNKNOWN_FEATURE MISSING:schema`.",
        feedback: "S32-T1-A-E2: el cálculo de unknown es la evidencia; el adverso no se resuelve cambiando el case_id.",
        starterCode: {
          language: 'python',
          title: "s32-t1-a-e2.py",
          code: `# CASO-LIM-032 · assess unknown feature
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

valid = {"case_id": "CASO-LIM-032-1A", "schema": {"numeric": ["amount_7d"], "categorical": ["canal"], "text": []}, "row": {"amount_7d": 1.0, "canal": "app"}}
invalid = {"case_id": "CASO-LIM-032-1A", "schema": {"numeric": ["amount_7d"], "categorical": [], "text": []}, "row": {"unknown_feat": 1}}
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

valid = {"case_id": "CASO-LIM-032-1A", "schema": {"numeric": ["amount_7d"], "categorical": ["canal"], "text": []}, "row": {"amount_7d": 1.0, "canal": "app"}}
invalid = {"case_id": "CASO-LIM-032-1A", "schema": {"numeric": ["amount_7d"], "categorical": [], "text": []}, "row": {"unknown_feat": 1}}
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
        instruction: "S32-T1-A-E3 · Fail-closed: válido → `CONTINUE`, adverso → `REJECT_UNKNOWN_FEATURE`, sin schema → `REQUEST_CATALOG`. El starter confunde ausencia con CONTINUE y revierte el predicado de keys.",
        hint: "Ausencia ≠ incumplimiento: enruta a REQUEST_CATALOG antes de mirar el row.",
        hints: [
          "Ausencia ≠ incumplimiento: enruta a REQUEST_CATALOG antes de mirar el row.",
          "CONTINUE solo si known cubre todas las keys del row.",
        ],
        edgeCases: ["falta schema", "fixture adverso: unknown_feat", "CASO-LIM-032-1A es sintético"],
        tests: "Salida: `CONTINUE REJECT_UNKNOWN_FEATURE REQUEST_CATALOG`.",
        feedback: "S32-T1-A-E3: REQUEST_CATALOG protege el fit; REJECT solo cuando el catálogo existe y el row lo viola.",
        starterCode: {
          language: 'python',
          title: "s32-t1-a-e3.py",
          code: `# CASO-LIM-032 · decide REQUEST_CATALOG
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

valid = {"case_id": "CASO-LIM-032-1A", "schema": {"numeric": ["amount_7d"], "categorical": ["canal"], "text": []}, "row": {"amount_7d": 1.0, "canal": "app"}}
invalid = {"case_id": "CASO-LIM-032-1A", "schema": {"numeric": ["amount_7d"], "categorical": [], "text": []}, "row": {"unknown_feat": 1}}
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

valid = {"case_id": "CASO-LIM-032-1A", "schema": {"numeric": ["amount_7d"], "categorical": ["canal"], "text": []}, "row": {"amount_7d": 1.0, "canal": "app"}}
invalid = {"case_id": "CASO-LIM-032-1A", "schema": {"numeric": ["amount_7d"], "categorical": [], "text": []}, "row": {"unknown_feat": 1}}
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
        instruction: "S32-T1-B-E1 · Sobre `[1, None, 3]`, construye indicator, fill con mediana de train (=2) y z-score con μ=0, σ=2 **sobre la serie rellena**. El starter escala constantes ajenas; corrige para que z use `filled`. Salida: `S32-T1-B PASS` si indicator marca el hueco, filled=[1,2,3] y silent_fill es False.",
        hint: "z = (x - mu) / sd para cada x en filled, no sobre una lista hardcodeada.",
        hints: [
          "z = (x - mu) / sd para cada x en filled, no sobre una lista hardcodeada.",
          "silent_fill es False porque el indicator viaja con el valor relleno.",
        ],
        edgeCases: ["falta median", "fixture adverso: silent_fill=True o fill sin indicator", "CASO-LIM-032-1B es sintético"],
        tests: "Imprime `S32-T1-B PASS` cuando filled y z son correctos.",
        feedback: "S32-T1-B-E1: escalar la serie rellena es el patrón de stats solo de train; silent fill sin indicator es REJECT_SILENT_FILL.",
        starterCode: {
          language: 'python',
          title: "s32-t1-b-e1.py",
          code: `# CASO-LIM-032 · silent fill ban + scale
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
        instruction: "S32-T1-B-E2 · `assess` recibe values, median e indicator. Construye fill con la mediana y comprueba que el indicator marque cada `None` (silent_fill=False). Válido: indicator correcto + median. Adverso: indicator todo False con huecos (silent fill). Sin median → `MISSING:median`.",
        hint: "Falta median se detecta antes de construir filled; silent_fill si hay None y indicator no lo marca.",
        hints: [
          "Falta median se detecta antes de construir filled; silent_fill si hay None y indicator no lo marca.",
          "expected_ind = [v is None for v in values]; PASS si indicator == expected_ind y median no es None.",
        ],
        edgeCases: ["falta median", "fixture adverso: silent_fill=True o indicator que oculta None", "CASO-LIM-032-1B es sintético"],
        tests: "Salida: `PASS REJECT_SILENT_FILL MISSING:median`.",
        feedback: "S32-T1-B-E2: la mediana de train es prerequisito; silent fill es incumplimiento de contrato, no un atajo de notebook.",
        starterCode: {
          language: 'python',
          title: "s32-t1-b-e2.py",
          code: `# CASO-LIM-032 · assess silent fill
# DEFECT: PASS cuando el indicator no marca los None
def assess(record: dict) -> str:
    required = {"case_id", "values", "median", "indicator"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    # DEFECT: no verifica indicator vs values
    return "PASS" if record["median"] is not None else "REJECT_SILENT_FILL"

valid = {
    "case_id": "CASO-LIM-032-1B",
    "values": [1, None, 3],
    "median": 2,
    "indicator": [False, True, False],
}
invalid = {
    "case_id": "CASO-LIM-032-1B",
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
    "case_id": "CASO-LIM-032-1B",
    "values": [1, None, 3],
    "median": 2,
    "indicator": [False, True, False],
}
invalid = {
    "case_id": "CASO-LIM-032-1B",
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
        instruction: "S32-T1-B-E3 · Fail-closed sobre `CASO-LIM-032-1B`: válido (median presente, indicator marca los None) → `CONTINUE`; indicator que oculta missing → `REJECT_SILENT_FILL`; sin median → `REQUEST_MEDIAN`. No rellenes con 0 en silencio.",
        hint: "REQUEST_MEDIAN antes de comparar indicator con values.",
        hints: [
          "REQUEST_MEDIAN antes de comparar indicator con values.",
          "CONTINUE solo con median presente e indicator == [v is None for v in values].",
        ],
        edgeCases: ["falta median", "fixture adverso: indicator que oculta None (silent fill)", "CASO-LIM-032-1B es sintético"],
        tests: "Salida: `CONTINUE REJECT_SILENT_FILL REQUEST_MEDIAN`.",
        feedback: "S32-T1-B-E3: sin mediana no hay transform legítimo; pedirla es fail-closed, no rellenar con 0.",
        starterCode: {
          language: 'python',
          title: "s32-t1-b-e3.py",
          code: `# CASO-LIM-032 · decide REQUEST_MEDIAN
# DEFECT: missing→CONTINUE; no valida indicator
def decide(record: dict) -> str:
    required = {"case_id", "values", "median", "indicator"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE"  # DEFECT: siempre CONTINUE

valid = {
    "case_id": "CASO-LIM-032-1B",
    "values": [1, None, 3],
    "median": 2,
    "indicator": [False, True, False],
}
invalid = {
    "case_id": "CASO-LIM-032-1B",
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
    "case_id": "CASO-LIM-032-1B",
    "values": [1, None, 3],
    "median": 2,
    "indicator": [False, True, False],
}
invalid = {
    "case_id": "CASO-LIM-032-1B",
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
        instruction: "S32-T2-A-E1 · Calcula shared (1 si mismas addr), degree (len vecinos de E1) y path (lookup o 99). El starter hardcodea path=99 sin leer `paths` y marca uses_label mal. Pasa si shared=1, degree=2, path=99 y uses_label es False. Salida: `S32-T2-A PASS`.",
        hint: "path = paths.get('E1-E9', 99); no uses_label en el cómputo de features.",
        hints: [
          "path = paths.get('E1-E9', 99); no uses_label en el cómputo de features.",
          "shared = int(a_addr == b_addr); degree = len(neighbors['E1']).",
        ],
        edgeCases: ["falta degree/neighbors", "fixture adverso: uses_label=True (label de decisión como feature)", "CASO-LIM-032-2A es sintético"],
        tests: "Imprime `S32-T2-A PASS` con features calculadas y uses_label False.",
        feedback: "S32-T2-A-E1: shared/degree/path son topología; label de decisión como feature es REJECT_LABEL_AS_FEATURE.",
        starterCode: {
          language: 'python',
          title: "s32-t2-a-e1.py",
          code: `# CASO-LIM-032 · shared/graph features + no label
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
        instruction: "S32-T2-A-E2 · `assess` recibe attrs, neighbors y paths: calcula shared/degree/path y rechaza si `uses_label` es True. Válido: topología limpia; adverso: label de decisión como feature; sin neighbors → `MISSING:neighbors`.",
        hint: "Missing keys primero; luego ban de uses_label; degree = len(neighbors[src]).",
        hints: [
          "Missing keys primero; luego ban de uses_label; degree = len(neighbors[src]).",
          "PASS requiere uses_label False, shared in {0,1} y degree >= 0 calculado.",
        ],
        edgeCases: ["falta neighbors", "fixture adverso: uses_label=True (label de decisión como feature)", "CASO-LIM-032-2A es sintético"],
        tests: "Salida: `PASS REJECT_LABEL_AS_FEATURE MISSING:neighbors`.",
        feedback: "S32-T2-A-E2: el grafo no autoriza parentesco/fraude; solo topología observada en t.",
        starterCode: {
          language: 'python',
          title: "s32-t2-a-e2.py",
          code: `# CASO-LIM-032 · assess graph+label ban
# DEFECT: PASS si uses_label; no calcula degree desde neighbors
def assess(record: dict) -> str:
    required = {"case_id", "a_addr", "b_addr", "neighbors", "paths", "uses_label"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["uses_label"] is True else "REJECT_LABEL_AS_FEATURE"

valid = {
    "case_id": "CASO-LIM-032-2A",
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
    "case_id": "CASO-LIM-032-2A",
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
        instruction: "S32-T2-A-E3 · Fail-closed sobre features de grafo: recalcula shared/degree/path desde attrs y neighbors; topología limpia y uses_label False → `CONTINUE`; label de decisión como feature → `REJECT_LABEL_AS_FEATURE`; sin neighbors → `REQUEST_GRAPH_FEAT`. No inventes degree=0 si falta el grafo.",
        hint: "Sin neighbors → REQUEST_GRAPH_FEAT. Con neighbors, shared = int(a_addr==b_addr) y degree = len(neighbors['E1']).",
        hints: [
          "Sin neighbors → REQUEST_GRAPH_FEAT. Con neighbors, shared = int(a_addr==b_addr) y degree = len(neighbors['E1']).",
          "CONTINUE solo si uses_label es False, shared in {0,1} y degree >= 0 calculado (no prebakeado).",
        ],
        edgeCases: ["falta neighbors", "fixture adverso: uses_label=True", "CASO-LIM-032-2A es sintético"],
        tests: "Salida: `CONTINUE REJECT_LABEL_AS_FEATURE REQUEST_GRAPH_FEAT`.",
        feedback: "S32-T2-A-E3: pedir la feature de grafo es mejor que inventar degree=0 silencioso; el CONTINUE se gana recalculando topología, no leyendo un flag.",
        starterCode: {
          language: 'python',
          title: "s32-t2-a-e3.py",
          code: `# CASO-LIM-032 · decide REJECT_LABEL_AS_FEATURE
# DEFECT: missing→CONTINUE; no recalcula degree; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "a_addr", "b_addr", "neighbors", "paths", "uses_label"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["uses_label"] is True else "REJECT_LABEL_AS_FEATURE"

valid = {
    "case_id": "CASO-LIM-032-2A",
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
    "case_id": "CASO-LIM-032-2A",
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
        instruction: "S32-T2-B-E1 · Con events=[1,2,3,5], t=5, w=3, corrige el conteo de ventana. El starter usa `<= t` (incluye el instante de decisión). Debe quedar count=2 e includes_t=False con half-open `[t-w, t)`. Salida: `S32-T2-B PASS`.",
        hint: "Predicado correcto: t - w <= ts < t (estricto en t).",
        hints: [
          "Predicado correcto: t - w <= ts < t (estricto en t).",
          "includes_t se deriva del conteo half-open, no de un flag inventado.",
        ],
        edgeCases: ["falta w", "fixture adverso: includes_t=True o ts>=t en el conteo", "CASO-LIM-032-2B es sintético"],
        tests: "Imprime `S32-T2-B PASS` con count 2 e includes_t False.",
        feedback: "S32-T2-B-E1: incluir t es leakage temporal clásico; la política half-open es el contrato documentado.",
        starterCode: {
          language: 'python',
          title: "s32-t2-b-e1.py",
          code: `# CASO-LIM-032 · time windows & frequency
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
        instruction: "S32-T2-B-E2 · `assess` calcula count e includes_t desde events/t/w. Válido: half-open correcto. Adverso: flag includes_t True (o conteo cerrado). Sin w → `MISSING:w`.",
        hint: "Si falta w no intentes el conteo.",
        hints: [
          "Si falta w no intentes el conteo.",
          "PASS si count half-open es 2 e includes_t calculado es False (o el flag del record es False y w>0).",
        ],
        edgeCases: ["falta w", "fixture adverso: includes_t=True", "CASO-LIM-032-2B es sintético"],
        tests: "Salida: `PASS REJECT_FUTURE_TS MISSING:w`.",
        feedback: "S32-T2-B-E2: el adverso modela la ventana que filtra t; no es un schema roto.",
        starterCode: {
          language: 'python',
          title: "s32-t2-b-e2.py",
          code: `# CASO-LIM-032 · assess window features
# DEFECT: PASS cuando includes_t es True
def assess(record: dict) -> str:
    required = {"case_id", "events", "t", "w", "includes_t"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["includes_t"] is True else "REJECT_FUTURE_TS"

valid = {"case_id": "CASO-LIM-032-2B", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": False}
invalid = {"case_id": "CASO-LIM-032-2B", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": True}
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

valid = {"case_id": "CASO-LIM-032-2B", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": False}
invalid = {"case_id": "CASO-LIM-032-2B", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": True}
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
        instruction: "S32-T2-B-E3 · Fail-closed temporal: recompute includes_t y count con half-open `[t−w, t)`; si el flag o el cómputo marcan t incluido → `REJECT_FUTURE_TS`; sin w → `REQUEST_WINDOW`; válido → `CONTINUE`. No inventes el ancho de ventana.",
        hint: "Sin w → REQUEST_WINDOW. Con w presente, recalcula includes desde events (no solo el flag).",
        hints: [
          "Sin w → REQUEST_WINDOW. Con w presente, recalcula includes desde events (no solo el flag).",
          "CONTINUE solo si includes_t del record es False, el recompute half-open no incluye t, y w > 0.",
        ],
        edgeCases: ["falta w", "fixture adverso: includes_t=True", "CASO-LIM-032-2B es sintético"],
        tests: "Salida: `CONTINUE REJECT_FUTURE_TS REQUEST_WINDOW`.",
        feedback: "S32-T2-B-E3: sin ancho de ventana no hay feature temporal legítima.",
        starterCode: {
          language: 'python',
          title: "s32-t2-b-e3.py",
          code: `# CASO-LIM-032 · decide REQUEST_WINDOW
# DEFECT: missing→CONTINUE; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "events", "t", "w", "includes_t"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["includes_t"] is True else "REJECT_FUTURE_TS"

valid = {"case_id": "CASO-LIM-032-2B", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": False}
invalid = {"case_id": "CASO-LIM-032-2B", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": True}
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

valid = {"case_id": "CASO-LIM-032-2B", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": False}
invalid = {"case_id": "CASO-LIM-032-2B", "events": [1, 2, 3, 5], "t": 5, "w": 3, "includes_t": True}
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
        instruction: "S32-T3-A-E1 · Completa ModeImputer: fit aprende la moda; transform rellena None. El starter transforma sin comprobar fit y deja mode=None. Tras fit(['app','app','web']), transform([None,'web']) debe ser ['app','web']. Salida: `S32-T3-A PASS`.",
        hint: "En transform, si self.mode is None: raise RuntimeError('not fitted').",
        hints: [
          "En transform, si self.mode is None: raise RuntimeError('not fitted').",
          "fit usa max(set(xs), key=xs.count) para la moda.",
        ],
        edgeCases: ["falta fitted/state", "fixture adverso: transform_before_fit=True", "CASO-LIM-032-3A es sintético"],
        tests: "Imprime `S32-T3-A PASS` cuando el transform post-fit es correcto.",
        feedback: "S32-T3-A-E1: el orden fit→transform es el contrato; transform silencioso sin fit es REJECT_TRANSFORM_BEFORE_FIT.",
        starterCode: {
          language: 'python',
          title: "s32-t3-a-e1.py",
          code: `# CASO-LIM-032 · ModeImputer fit order
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
        instruction: "S32-T3-A-E2 · `assess` recibe `train_xs` y `serve_xs`: haz fit de moda en train y transform en serve. Válido: train con moda aprendible y serve transformable. Adverso: `try_before_fit=True` (intentar transform sin fit). Sin train_xs → `MISSING:train_xs`. No confíes en un flag `fitted` prebakeado.",
        hint: "Missing train_xs primero; si try_before_fit, REJECT sin fittear; si no, fit y comprueba transform no vacío.",
        hints: [
          "Missing train_xs primero; si try_before_fit, REJECT sin fittear; si no, fit y comprueba transform no vacío.",
          "mode = max(set(train_xs), key=train_xs.count); serve rellena None con mode.",
        ],
        edgeCases: ["falta train_xs", "fixture adverso: try_before_fit=True (transform sin fit)", "CASO-LIM-032-3A es sintético"],
        tests: "Salida: `PASS REJECT_TRANSFORM_BEFORE_FIT MISSING:train_xs`.",
        feedback: "S32-T3-A-E2: el state fitted se demuestra con fit real sobre train_xs; un flag no es evidencia.",
        starterCode: {
          language: 'python',
          title: "s32-t3-a-e2.py",
          code: `# CASO-LIM-032 · assess transformer fit from series
# DEFECT: PASS si try_before_fit; no hace fit real
def assess(record: dict) -> str:
    required = {"case_id", "train_xs", "serve_xs", "try_before_fit"}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    # DEFECT: confía en el flag adverso al revés
    return "PASS" if record["try_before_fit"] is True else "REJECT_TRANSFORM_BEFORE_FIT"

valid = {
    "case_id": "CASO-LIM-032-3A",
    "train_xs": ["app", "app", "web"],
    "serve_xs": [None, "web"],
    "try_before_fit": False,
}
invalid = {
    "case_id": "CASO-LIM-032-3A",
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
    "case_id": "CASO-LIM-032-3A",
    "train_xs": ["app", "app", "web"],
    "serve_xs": [None, "web"],
    "try_before_fit": False,
}
invalid = {
    "case_id": "CASO-LIM-032-3A",
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
        instruction: "S32-T3-A-E3 · Fail-closed de transformers: con `train_xs`/`serve_xs`, fit real de moda y transform; ok → `CONTINUE`; `try_before_fit` o train vacío → `REJECT_TRANSFORM_BEFORE_FIT`; sin train_xs → `REQUEST_FIT_STATE`. No inventes mode='app' sin fit.",
        hint: "Sin train_xs → REQUEST_FIT_STATE. Con train, si try_before_fit → REJECT; si no, fit y transform.",
        hints: [
          "Sin train_xs → REQUEST_FIT_STATE. Con train, si try_before_fit → REJECT; si no, fit y transform.",
          "CONTINUE solo si mode aprendido y len(transform(serve_xs)) == len(serve_xs).",
        ],
        edgeCases: ["falta train_xs", "fixture adverso: try_before_fit=True", "CASO-LIM-032-3A es sintético"],
        tests: "Salida: `CONTINUE REJECT_TRANSFORM_BEFORE_FIT REQUEST_FIT_STATE`.",
        feedback: "S32-T3-A-E3: pedir el state de fit evita silent defaults en serve; el CONTINUE se gana fitteando, no leyendo un flag.",
        starterCode: {
          language: 'python',
          title: "s32-t3-a-e3.py",
          code: `# CASO-LIM-032 · decide REQUEST_FIT_STATE
# DEFECT: missing→CONTINUE; no hace fit; pred invertido
def decide(record: dict) -> str:
    required = {"case_id", "train_xs", "serve_xs", "try_before_fit"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["try_before_fit"] is True else "REJECT_TRANSFORM_BEFORE_FIT"

valid = {
    "case_id": "CASO-LIM-032-3A",
    "train_xs": ["app", "app", "web"],
    "serve_xs": [None, "web"],
    "try_before_fit": False,
}
invalid = {
    "case_id": "CASO-LIM-032-3A",
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
    "case_id": "CASO-LIM-032-3A",
    "train_xs": ["app", "app", "web"],
    "serve_xs": [None, "web"],
    "try_before_fit": False,
}
invalid = {
    "case_id": "CASO-LIM-032-3A",
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
        instruction: "S32-T3-B-E1 · Serializa state a JSON, recarga y aplica mediana al batch [None, 4]. El starter omite version o no aplica median. Pasa si version empieza con fs-v y serve=[2, 4]. Salida: `S32-T3-B PASS`.",
        hint: "json.loads(json.dumps(state)); fill None con state['median'].",
        hints: [
          "json.loads(json.dumps(state)); fill None con state['median'].",
          "versioned = str(version).startswith('fs-v').",
        ],
        edgeCases: ["falta version", "fixture adverso: version vacía o versioned=False", "CASO-LIM-032-3B es sintético"],
        tests: "Imprime `S32-T3-B PASS` con serve [2, 4] y version fs-v1.",
        feedback: "S32-T3-B-E1: el round-trip JSON es el contrato de persistencia; servir sin version es REJECT_UNVERSIONED.",
        starterCode: {
          language: 'python',
          title: "s32-t3-b-e1.py",
          code: `# CASO-LIM-032 · fit/transform persistence
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
        instruction: "S32-T3-B-E2 · `assess` hace round-trip JSON del `state`, aplica mediana al `serve_batch` y exige version `fs-v*`. Válido: fs-v1 y batch con None rellenados. Adverso: version vacía. Sin version → `MISSING:version`. No apruebes solo con un flag versioned.",
        hint: "loaded = json.loads(json.dumps(state)); serve = [median if x is None else x for x in batch].",
        hints: [
          "loaded = json.loads(json.dumps(state)); serve = [median if x is None else x for x in batch].",
          "PASS si ver.startswith('fs-v') y serve resultante no tiene None.",
        ],
        edgeCases: ["falta version", "fixture adverso: version '' (no se puede promover state)", "CASO-LIM-032-3B es sintético"],
        tests: "Salida: `PASS REJECT_UNVERSIONED MISSING:version`.",
        feedback: "S32-T3-B-E2: fs-vN es el id que S33 consumirá; el round-trip + apply mediana demuestran train≡serve.",
        starterCode: {
          language: 'python',
          title: "s32-t3-b-e2.py",
          code: `# CASO-LIM-032 · assess fit/transform persist
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
    "case_id": "CASO-LIM-032-3B",
    "state": {"median": 2, "version": "fs-v1"},
    "version": "fs-v1",
    "serve_batch": [None, 4],
}
invalid = {
    "case_id": "CASO-LIM-032-3B",
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
    "case_id": "CASO-LIM-032-3B",
    "state": {"median": 2, "version": "fs-v1"},
    "version": "fs-v1",
    "serve_batch": [None, 4],
}
invalid = {
    "case_id": "CASO-LIM-032-3B",
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
        instruction: "S32-T3-B-E3 · Fail-closed de persistencia: round-trip del state, apply mediana a `serve_batch` y version `fs-v*` → `CONTINUE`; version vacía o serve con None sin apply → `REJECT_UNVERSIONED`; sin version → `REQUEST_STATE_JSON`.",
        hint: "Sin version → REQUEST_STATE_JSON. Con version: JSON round-trip + fill con median.",
        hints: [
          "Sin version → REQUEST_STATE_JSON. Con version: JSON round-trip + fill con median.",
          "CONTINUE solo si ver.startswith('fs-v') y serve resultante == [2, 4] en el fixture.",
        ],
        edgeCases: ["falta version", "fixture adverso: version vacía o state sin median aplicable", "CASO-LIM-032-3B es sintético"],
        tests: "Salida: `CONTINUE REJECT_UNVERSIONED REQUEST_STATE_JSON`.",
        feedback: "S32-T3-B-E3: REQUEST_STATE_JSON es fail-closed cuando falta el artefacto; el CONTINUE se gana aplicando el state, no con un flag versioned.",
        starterCode: {
          language: 'python',
          title: "s32-t3-b-e3.py",
          code: `# CASO-LIM-032 · decide REQUEST_STATE_JSON
# DEFECT: missing→CONTINUE; no aplica median
import json

def decide(record: dict) -> str:
    required = {"case_id", "state", "version", "serve_batch"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if not record["version"] else "REJECT_UNVERSIONED"

valid = {
    "case_id": "CASO-LIM-032-3B",
    "state": {"median": 2, "version": "fs-v1"},
    "version": "fs-v1",
    "serve_batch": [None, 4],
}
invalid = {
    "case_id": "CASO-LIM-032-3B",
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
    "case_id": "CASO-LIM-032-3B",
    "state": {"median": 2, "version": "fs-v1"},
    "version": "fs-v1",
    "serve_batch": [None, 4],
}
invalid = {
    "case_id": "CASO-LIM-032-3B",
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
        instruction: "S32-T4-A-E1 · A partir de filas con ts/entity y cutoff '2026-02-01', calcula n_train, n_test y overlap de entidades. El starter hardcodea tamaños. Pasa si n_train=1, n_test=1, overlap=0. Salida: `S32-T4-A PASS`.",
        hint: "train = ts < cut; overlap = set(entity train) ∩ set(entity test).",
        hints: [
          "train = ts < cut; overlap = set(entity train) ∩ set(entity test).",
          "No devuelvas constantes: deriva tamaños de las listas.",
        ],
        edgeCases: ["falta overlap/keys", "fixture adverso: misma entity en train y test (overlap>0)", "CASO-LIM-032-4A es sintético"],
        tests: "Imprime `S32-T4-A PASS` con overlap 0 calculado.",
        feedback: "S32-T4-A-E1: overlap de entidades infla métricas; el gate exige cero intersección.",
        starterCode: {
          language: 'python',
          title: "s32-t4-a-e1.py",
          code: `# CASO-LIM-032 · entity/group/time split
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
        instruction: "S32-T4-A-E2 · `assess` recibe `rows` y `cut`: calcula n_train, n_test y overlap de entidades (no uses flags precomputados). Válido: e1/e2 sin overlap; adverso: misma entity en ambos lados; sin rows → `MISSING:rows`.",
        hint: "train = [r for r in rows if r['ts'] < cut]; overlap = set(entity train) ∩ set(entity test).",
        hints: [
          "train = [r for r in rows if r['ts'] < cut]; overlap = set(entity train) ∩ set(entity test).",
          "PASS solo si ambos lados no vacíos y len(overlap)==0.",
        ],
        edgeCases: ["falta rows", "fixture adverso: misma entity en train y test (overlap>0)", "CASO-LIM-032-4A es sintético"],
        tests: "Salida: `PASS REJECT_ENTITY_OVERLAP MISSING:rows`.",
        feedback: "S32-T4-A-E2: el overlap se deriva de las filas; reportarlo es parte del informe de split, no un detalle opcional.",
        starterCode: {
          language: 'python',
          title: "s32-t4-a-e2.py",
          code: `# CASO-LIM-032 · assess split isolation from rows
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
    "case_id": "CASO-LIM-032-4A",
    "cut": "2026-02-01",
    "rows": [
        {"ts": "2026-01-10", "entity": "e1"},
        {"ts": "2026-02-10", "entity": "e2"},
    ],
}
invalid = {
    "case_id": "CASO-LIM-032-4A",
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
    "case_id": "CASO-LIM-032-4A",
    "cut": "2026-02-01",
    "rows": [
        {"ts": "2026-01-10", "entity": "e1"},
        {"ts": "2026-02-10", "entity": "e2"},
    ],
}
invalid = {
    "case_id": "CASO-LIM-032-4A",
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
        instruction: "S32-T4-A-E3 · Fail-closed de split: a partir de `rows` y `cut`, calcula n_train, n_test y overlap de entidades. Lados no vacíos y overlap 0 → `CONTINUE`; overlap>0 → `REJECT_ENTITY_OVERLAP`; sin rows → `REQUEST_SPLIT_KEYS`. El informe de split es obligatorio antes del baseline.",
        hint: "Sin rows → REQUEST_SPLIT_KEYS. Con rows: train = ts < cut; overlap = intersección de entity.",
        hints: [
          "Sin rows → REQUEST_SPLIT_KEYS. Con rows: train = ts < cut; overlap = intersección de entity.",
          "CONTINUE solo si len(train)>=1, len(test)>=1 y len(overlap)==0 — no confíes en n_train prebakeado.",
        ],
        edgeCases: ["falta rows", "fixture adverso: misma entity en train y test (overlap>0)", "CASO-LIM-032-4A es sintético"],
        tests: "Salida: `CONTINUE REJECT_ENTITY_OVERLAP REQUEST_SPLIT_KEYS`.",
        feedback: "S32-T4-A-E3: sin filas de split no se puede auditar el leakage de identidad; el overlap se recalcula, no se inventa.",
        starterCode: {
          language: 'python',
          title: "s32-t4-a-e3.py",
          code: `# CASO-LIM-032 · decide REQUEST_SPLIT_KEYS
# DEFECT: missing→CONTINUE; no calcula overlap desde rows
def decide(record: dict) -> str:
    required = {"case_id", "rows", "cut"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    # DEFECT: confía en flags implícitos sin medir intersección
    return "CONTINUE" if record.get("rows") else "REJECT_ENTITY_OVERLAP"

valid = {
    "case_id": "CASO-LIM-032-4A",
    "cut": "2026-02-01",
    "rows": [
        {"ts": "2026-01-10", "entity": "e1"},
        {"ts": "2026-02-10", "entity": "e2"},
    ],
}
invalid = {
    "case_id": "CASO-LIM-032-4A",
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
    "case_id": "CASO-LIM-032-4A",
    "cut": "2026-02-01",
    "rows": [
        {"ts": "2026-01-10", "entity": "e1"},
        {"ts": "2026-02-10", "entity": "e2"},
    ],
}
invalid = {
    "case_id": "CASO-LIM-032-4A",
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
        instruction: "S32-T4-B-E1 · Escanea names con 'label'/'decision', calcula skew |serve_mean-train_mean|>0.5 y valida feature_set fs-v*. El starter invierte el gate. Con names limpios, means iguales y fs-v2 → PASS. Salida: `S32-T4-B PASS`.",
        hint: "leaky = [n for n in names if 'label' in n or 'decision' in n].",
        hints: [
          "leaky = [n for n in names if 'label' in n or 'decision' in n].",
          "meets = not leaky and not skew and feature_set.startswith('fs-v').",
        ],
        edgeCases: ["falta feature_set", "fixture adverso: label_decision en names o skew True", "CASO-LIM-032-4B es sintético"],
        tests: "Imprime `S32-T4-B PASS` con scan limpio y fs-v2.",
        feedback: "S32-T4-B-E1: el scan de nombres + skew cierra el promote antes del baseline S33.",
        starterCode: {
          language: 'python',
          title: "s32-t4-b-e1.py",
          code: `# CASO-LIM-032 · leakage/skew/version gate
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
        instruction: "S32-T4-B-E2 · `assess` escanea `names` (label/decision), calcula skew con means+tol y valida `feature_set`. Válido: names limpios y means cercanos; adverso: label_decision o |serve−train|>tol; sin feature_set → `MISSING:feature_set`.",
        hint: "leaky = [n for n in names if 'label' in n or 'decision' in n]; skew = abs(serve-train) > tol.",
        hints: [
          "leaky = [n for n in names if 'label' in n or 'decision' in n]; skew = abs(serve-train) > tol.",
          "PASS si not leaky and not skew and feature_set.startswith('fs-v').",
        ],
        edgeCases: ["falta feature_set", "fixture adverso: label_decision en names o skew True", "CASO-LIM-032-4B es sintético"],
        tests: "Salida: `PASS REJECT_LEAKAGE MISSING:feature_set`.",
        feedback: "S32-T4-B-E2: label_decision en el catálogo es red flag de leakage, no una feature útil; el skew se mide, no se intuye.",
        starterCode: {
          language: 'python',
          title: "s32-t4-b-e2.py",
          code: `# CASO-LIM-032 · assess leakage & skew from names/means
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
    "case_id": "CASO-LIM-032-4B",
    "names": ["amount_7d", "canal_mode"],
    "train_mean": 0.0,
    "serve_mean": 0.1,
    "tol": 0.5,
    "feature_set": "fs-v2",
}
invalid = {
    "case_id": "CASO-LIM-032-4B",
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
    "case_id": "CASO-LIM-032-4B",
    "names": ["amount_7d", "canal_mode"],
    "train_mean": 0.0,
    "serve_mean": 0.1,
    "tol": 0.5,
    "feature_set": "fs-v2",
}
invalid = {
    "case_id": "CASO-LIM-032-4B",
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
        instruction: "S32-T4-B-E3 · Fail-closed final del pipeline hacia S33: escanea `names`, mide skew con means+tol y valida `feature_set`. Scan limpio + sin skew + fs-v* → `CONTINUE`; leaky o skew → `REJECT_LEAKAGE`; sin feature_set → `REQUEST_FEATURE_SET_ID`.",
        hint: "Sin feature_set → REQUEST_FEATURE_SET_ID. Con id: recalcula leaky y skew; no uses listas prebakeadas.",
        hints: [
          "Sin feature_set → REQUEST_FEATURE_SET_ID. Con id: recalcula leaky y skew; no uses listas prebakeadas.",
          "leaky = [n for n in names if 'label' in n or 'decision' in n]; skew = abs(serve_mean-train_mean) > tol.",
        ],
        edgeCases: ["falta feature_set", "fixture adverso: label_decision en names o |serve−train|>tol", "CASO-LIM-032-4B es sintético"],
        tests: "Salida: `CONTINUE REJECT_LEAKAGE REQUEST_FEATURE_SET_ID`.",
        feedback: "S32-T4-B-E3: el feature_set id es el contrato que S33 debe citar; el promote se gana midiendo scan y skew, no leyendo un booleano previo.",
        starterCode: {
          language: 'python',
          title: "s32-t4-b-e3.py",
          code: `# CASO-LIM-032 · decide REQUEST_FEATURE_SET_ID
# DEFECT: missing→CONTINUE; no escanea names ni mide skew
def decide(record: dict) -> str:
    required = {"case_id", "names", "train_mean", "serve_mean", "tol", "feature_set"}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    # DEFECT: promote ciego
    return "CONTINUE"

valid = {
    "case_id": "CASO-LIM-032-4B",
    "names": ["amount_7d", "canal_mode"],
    "train_mean": 0.0,
    "serve_mean": 0.1,
    "tol": 0.5,
    "feature_set": "fs-v2",
}
invalid = {
    "case_id": "CASO-LIM-032-4B",
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
    "case_id": "CASO-LIM-032-4B",
    "names": ["amount_7d", "canal_mode"],
    "train_mean": 0.0,
    "serve_mean": 0.1,
    "tol": 0.5,
    "feature_set": "fs-v2",
}
invalid = {
    "case_id": "CASO-LIM-032-4B",
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
      "Entrega un mini feature set para CASO-LIM-032 / run_id=cpn3b-feat: catálogo, ventanas half-open, state versionado, split sin overlap y scan de leakage. El artefacto `fs-vN` (JSON con medianas, vocab y schema hash) es el **contrato de entrada del baseline S33**: sin él no se entrena.",
    objectives: [
      "Catalog dtypes y keys validadas (row ⊆ catálogo); reportar unknown_keys",
      "Missing indicator + mediana de train + apply en serve (silent_fill=False)",
      "Graph feats (shared/degree/path default 99) + window half-open [t−w, t) con count documentado",
      "fs-vN, leakage scan, skew check y split con overlap 0 + informe n_train/n_test/overlap",
    ],
    requirements: [
      "Train≡serve: mismo código y state en train e inferencia",
      "Sin future ts ni label/decision como feature",
      "Solo PII sintético; feature_set id fs-vN documentado",
      "Informe de split: n_train, n_test, overlap",
      "Acceptance checks del starter en verde (version, n_events E1, overlap 0, leaky vacío)",
    ],
    starterCode: `# features CP-N3-B — CASO-LIM-032 / run_id=cpn3b-feat
# Entrega: catálogo, state versionado, ventana half-open, split sin overlap, scan de leakage.
# Handoff S33: el baseline debe citar feature_set id (fs-vN) y el informe de split.
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
    """Cuenta eventos con ts en [t-w, t)."""
    raise NotImplementedError("half-open [t-w, t)")


def fit_median(train_amounts):
    """Mediana de train; None si lista vacía. Ordena y toma el centro."""
    raise NotImplementedError("stats solo de train")


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
    rows = [{"ts": e["ts"], "entity": e["entity"]} for e in events]
    tr, te, ov = time_group_split(rows, decision_t)
    leaky = leak_scan(feature_names)
    print("version", state["version"])
    print("n_events_E1", n_e1)
    print("overlap", ov)
    print("leaky", leaky)
    # Acceptance (descomenta asserts cuando implementes):
    # assert n_e1 == 2 and ov == 0 and leaky == [] and state["median_amount"] is not None
`,
    portfolioNote:
      "Feature set fs-vN + anti-leakage checklist + informe de split (n_train, n_test, overlap 0) listos para el baseline S33. Incluye schema hash o lista de columnas congelada.",
    rubric: [
      { criterion: "Train≡serve, sin leakage temporal/de label y feature set versionado", weight: "25%" },
      { criterion: "Correctitud técnica: ventanas half-open, stats de train, split con overlap 0", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (adverso includes_t, unknown feature)", weight: "15%" },
      { criterion: "Código legible y límites claros (REQUEST_* vs REJECT_*)", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "fs-vN + half-open window + zero entity overlap + handoff S33", weight: "bonus" },
    ],
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
