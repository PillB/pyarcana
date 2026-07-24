import type { CourseSection } from '../../types'

export const section32: CourseSection = {
  id: "microservices",
  index: 32,
  title: "Feature engineering y pipelines sin leakage",
  shortTitle: "Features sin leakage",
  tagline: "tabla de features versionada cuya construcción en train e inferencia es idéntica y no usa información futura o de decisión",
  estimatedHours: 18,
  level: "Competente a experto",
  phase: 2,
  icon: "TableProperties",
  accentColor: "bg-gradient-to-br from-indigo-500 to-violet-800",
  jobRelevance:
    "Features mal hechas **filtran el futuro** y crean modelos que fallan en producción. Id `microservices` conservado; V3 **Feature engineering y pipelines sin leakage** para el workbench CP-N3-B. Features de grafo/contacto no son etiqueta de fraude.",
  learningOutcomes: [
    { text: "Diseñar features numéricas/categóricas/texto" },
    { text: "Aplicar missing indicators, scale y encoding" },
    { text: "Crear features relacionales y de grafo" },
    { text: "Calcular ventanas y frecuencias sin leakage" },
    { text: "Componer transformers reutilizables" },
    { text: "Persistir fit y reutilizar en inferencia" },
    { text: "Partir por entidad/grupo/tiempo" },
    { text: "Detectar leakage y versionar features" }
  ],
  theory: [
    {
      heading: "De microservicios legado a features sin leakage",
      paragraphs: [
        "En V3, **S32 no es Docker/K8s**: construyes la **tabla de features versionada** del workbench **CP-N3-B** con filas sintéticas por par entidad/caso (`run_id=cpn3b-feat`) en Red Andina ficticia. El gate es **train ≡ serve** sin leakage temporal ni de label.",
        "Producto incremental: **catálogo** + transformers **fit/transform idénticos** en train e inferencia, **sin futuro** ni labels de decisión como feature. Entrada: eventos y grafo sintético; salida: feature set id `fs-vN` con hash de schema.",
        "Orden: **T1 tipos** → **T2 relacionales/grafo** → **T3 pipelines** → **T4 validación/leakage**. Id legacy `microservices` se conserva. Features de contacto/shared address **no** son etiqueta de fraude ni parentesco."
      ],
      callout: {
        type: "info",
        title: "Gate features",
        content:
          "Train≡serve, sin leakage temporal ni de label. PII sintético only. Sin section_passed si hay future ts.",
      },
    },
    {
      heading: "numéricas/categóricas/texto",
      subtopicId: "S32-T1-A",
      paragraphs: [
        "Diseña con **semántica temporal**: ¿la feature está **disponible en t de decisión**? Numéricas (montos, conteos), categóricas (canal, región) y texto (`note_len`, `token_count`) viven en un **feature catalog** con dtype y missing policy — no columnas inventadas en serve.",
        "Contrato: entrada schema `type→cols` y row; salida listas por tipo y validación `keys ⊆ catálogo`. Error: feature desconocida en serve o dtype roto. Criterio: **catalog completo antes de fit**.",
        "Aplicación a `CASO-LIM-032`: schema numéricas `amount_7d`; texto `note_len`/`token_count`; row keys validadas contra catálogo del run `cpn3b-feat` (sintético, sin PII real)."
      ],
      code: {
        language: 'python',
        title: "catalog.py",
        code: `def catalog_ok(schema: dict, row: dict) -> tuple:
    known = set(schema["numeric"] + schema["categorical"] + schema["text"])
    unknown = any(k not in known for k in row)
    return sorted(schema["numeric"]), len(row["note"]), unknown

schema = {"numeric": ["amount_7d"], "categorical": ["canal"], "text": ["note"]}
row = {"amount_7d": 10.0, "canal": "app", "note": "hola mundo"}
nums, note_len, unknown = catalog_ok(schema, row)
print(nums)
print("note_len", note_len)
print("unknown", unknown)`,
        output: `['amount_7d']
note_len 10
unknown False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S32-T1-A: catalog + keys. Breach → REJECT_UNKNOWN_FEATURE; falta catalog → REQUEST_CATALOG.",
      },
    },
    {
      heading: "missing indicators, escalamiento y encoding",
      subtopicId: "S32-T1-B",
      paragraphs: [
        "**Missing indicator** + fill (mediana/moda) preserva la **señal de ausencia**. One-hot con columna `unknown` y z-score con **μ/σ solo de train** evitan silent fill y **leakage de estadísticas de test**.",
        "Contrato: entrada serie con `None`, vocab de canal, μ/σ de train; salida indicator, one-hot, z. Error: calcular mediana con filas de test o re-fit en serve. Criterio: **stats congeladas en fit**.",
        "Aplicación a `CASO-LIM-032`: `[1,None,3]` → indicator + mediana 2; canal `unknown` → col; z con μ=0 σ=2 del train fit."
      ],
      code: {
        language: 'python',
        title: "missing_scale.py",
        code: `def missing_and_scale(vals, fill=2, mu=0, sd=2):
    ind = [v is None for v in vals]
    filled = [fill if v is None else v for v in vals]
    z = [(x - mu) / sd for x in [2, 4]]
    return ind, filled, z

ind, filled, z = missing_and_scale([1, None, 3])
print(ind, filled)
print(z)
print("silent_fill", False)`,
        output: `[False, True, False] [1, 2, 3]
[1.0, 2.0]
silent_fill False`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S32-T1-B: indicator+stats train. Breach → REJECT_SILENT_FILL; falta mediana → REQUEST_MEDIAN.",
      },
    },
    {
      heading: "shared contact/address, distance y graph features",
      subtopicId: "S32-T2-A",
      paragraphs: [
        "Features **relacionales** (`shared_address`, degree, min path) resumen evidencia del grafo de S31. **No** conviertas el score de matching ni la centralidad en label de parentesco o fraude — son inputs para el modelo/cola, no veredictos.",
        "Contrato: entrada dos entidades, vecinos, path dict; salida shared binario, degree, pathlen (default 99 si missing). Error: usar **label de decisión** o post-outcome como feature. Criterio: solo topología y atributos **observados en t**.",
        "Aplicación a `CASO-LIM-032`: `shared_address=1`; degree de E1; min path missing → 99 en grafo sintético Lima–Arequipa."
      ],
      code: {
        language: 'python',
        title: "graph_feat.py",
        code: `def graph_feats(a: dict, b: dict, neighbors: dict, e="E1") -> tuple:
    shared = int(a.get("addr") == b.get("addr"))
    degree = len(neighbors.get(e, []))
    path = {"E1-E9": 99}.get("E1-E9", 99)
    return shared, degree, path

shared, degree, path = graph_feats({"addr": "Av1"}, {"addr": "Av1"}, {"E1": ["E2", "E3"]})
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
          "S32-T2-A: graph feats. Breach → REJECT_LABEL_AS_FEATURE; falta feat → REQUEST_GRAPH_FEAT.",
      },
    },
    {
      heading: "ventanas y frecuencia",
      subtopicId: "S32-T2-B",
      paragraphs: [
        "Ventanas **half-open** `[t−w, t)` cuentan eventos **sin** incluir el instante de decisión `t`. Incluir `ts==t` o **futuro** es **leakage temporal clásico** — el modelo “ve” el outcome o el mismo evento de decisión.",
        "Contrato: entrada lista `ts`, `t`, `w`, canal; salida count en ventana y freq por canal. Error: `ts>=t` dentro del count. Criterio: política half-open **documentada** en el feature catalog.",
        "Aplicación a `CASO-LIM-032`: eventos en `[t−3,t)`; frecuencia app/web; **excluye** `ts==t` del conteo de features del caso sintético."
      ],
      code: {
        language: 'python',
        title: "window.py",
        code: `def window_count(events, t, w):
    return sum(1 for ts in events if t - w <= ts < t)

print("count", window_count([1, 2, 3, 5], 5, 3))
print("includes_t", False)
print("policy", "half_open")`,
        output: `count 2
includes_t False
policy half_open`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S32-T2-B: half-open. Breach → REJECT_FUTURE_TS; falta w → REQUEST_WINDOW.",
      },
    },
    {
      heading: "ColumnTransformer y custom transformers",
      subtopicId: "S32-T3-A",
      paragraphs: [
        "Un **transformer** tiene `fit` (aprende estado) y `transform` (aplica). Encadenar fill luego scale exige `fitted=True`; **transform antes de fit debe fallar** de forma explícita — no silent default en serve.",
        "Contrato: entrada serie categórica y pipeline steps; salida moda fit, transform `None→moda`, flag `not_fitted`. Error: transform silencioso sin fit. Criterio: **secuencia determinista train≡serve**.",
        "Aplicación a `CASO-LIM-032`: moda de canal; pipeline fill0 luego *2; `not_fitted` levanta flag en el lab."
      ],
      code: {
        language: 'python',
        title: "transformer.py",
        code: `def s32_th_5():
    class ModeImputer:
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
    print(imp.transform([None, "web"]))
    print("fitted", True)

s32_th_5()
`,
        output: `['app', 'web']
fitted True`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S32-T3-A: fit→transform. Breach → REJECT_TRANSFORM_BEFORE_FIT; falta state → REQUEST_FIT_STATE.",
      },
    },
    {
      heading: "fit/transform y persistencia",
      subtopicId: "S32-T3-B",
      paragraphs: [
        "El **estado** (mediana, vocab) se serializa a JSON y se **reutiliza en serve**. Si el vocab cambia, **version bump** del feature set (`fs-vN`). Aplicar mediana de train al batch de serve evita **skew silencioso**.",
        "Contrato: entrada state dict; salida round-trip JSON y version. Error: servir **sin version**. Criterio: `fs-vN` en artefactos y hash de schema.",
        "Aplicación a `CASO-LIM-032`: state `median=2` round-trip; vocab change → `v2`; apply median al serve batch sintético."
      ],
      code: {
        language: 'python',
        title: "persist.py",
        code: `import json

def load_state(state: dict) -> dict:
    return json.loads(json.dumps(state))

loaded = load_state({"median": 2, "version": "fs-v1"})
print(loaded["median"])
print("version", loaded["version"])
print("serve", [loaded["median"] if x is None else x for x in [None, 4]])`,
        output: `2
version fs-v1
serve [2, 4]`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S32-T3-B: state versionado. Breach → REJECT_UNVERSIONED; falta json → REQUEST_STATE_JSON.",
      },
    },
    {
      heading: "split por entidad/grupo/tiempo",
      subtopicId: "S32-T4-A",
      paragraphs: [
        "**Split temporal** (`train ts < cutoff`) y **group split por entity** evitan overlap. Si una entidad aparece en train y test, hay **leakage de identidad** (el modelo memoriza la entidad, no el patrón).",
        "Contrato: entrada rows con `ts` y `entity`; salida train/test sets y `overlap` count. Error: `overlap>0` en el gate. Criterio: group sizes reportados en el informe de split.",
        "Aplicación a `CASO-LIM-032`: train `ts<'2026-02-01'`; group sizes; **overlap entidades = 0**."
      ],
      code: {
        language: 'python',
        title: "split.py",
        code: `def time_split(rows, cut):
    train = [r for r in rows if r["ts"] < cut]
    test = [r for r in rows if r["ts"] >= cut]
    overlap = set(r["entity"] for r in train) & set(r["entity"] for r in test)
    return len(train), len(test), len(overlap)

rows = [
    {"ts": "2026-01-10", "entity": "e1"},
    {"ts": "2026-02-10", "entity": "e2"},
]
n_tr, n_te, ov = time_split(rows, "2026-02-01")
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
          "S32-T4-A: time/group split. Breach → REJECT_ENTITY_OVERLAP; falta keys → REQUEST_SPLIT_KEYS.",
      },
    },
    {
      heading: "leakage, train–serve skew y versionado",
      subtopicId: "S32-T4-B",
      paragraphs: [
        "Nombres con `label` o `decision` en features son **red flags** de leakage. Si `serve_mean` se desvía **>tol** de `train_mean`, hay **train–serve skew**. El feature set id `fs-vN` **congela** el contrato promovido.",
        "Contrato: entrada feature names, means, version; salida leak flags, skew alert, fs id. Error: **promover con leakage**. Criterio: scan de nombres + skew check en CI.",
        "Aplicación a `CASO-LIM-032`: flag `label_decision`; skew si `|serve−train|>0.5`; id `fs-v2`."
      ],
      code: {
        language: 'python',
        title: "leakage.py",
        code: `def leak_scan(names):
    return [n for n in names if "label" in n or "decision" in n]

def skew(train_mean, serve_mean, tol=0.5):
    return abs(serve_mean - train_mean) > tol

print("leaky", leak_scan(["amount_7d", "label_decision"]))
print("skew", skew(0.0, 0.8))
print("feature_set", "fs-v2")`,
        output: `leaky ['label_decision']
skew True
feature_set fs-v2`,
      },
      callout: {
        type: "tip",
        title: "Contrato local",
        content:
          "S32-T4-B: leakage scan + skew + fs-vN. Breach → REJECT_LEAKAGE; falta id → REQUEST_FEATURE_SET_ID.",
      },
    }
  ],
  iDo: {
    intro: "S32 · Te muestro catálogo, missing/scale, grafo, ventanas, transformers y anti-leakage sobre run_id=cpn3b-feat.",
    steps: [
      {
        demoId: "S32-T1-A-DEMO",
        subtopicId: "S32-T1-A",
        environment: "local-python",
        description: "Lista features numéricas del schema y valida keys del row contra catálogo.",
        code: {
          language: 'python',
          title: "cat_demo.py",
          code: `def numeric_keys(schema):
    return sorted(schema.get("numeric", []))

print(numeric_keys({"numeric": ["amount_7d"]}))
print("unknown", False)
print("ok", True)`,
          output: `['amount_7d']
unknown False
ok True`,
        },
        why: "El catálogo es la fuente de verdad de dtypes y evita features desconocidas en serve.",
      },
      {
        demoId: "S32-T1-B-DEMO",
        subtopicId: "S32-T1-B",
        environment: "local-python",
        description: "Missing indicator, fill mediana y z-score con estadísticas de train.",
        code: {
          language: 'python',
          title: "ms_demo.py",
          code: `def indicators(vals):
    return [v is None for v in vals]

def zscore(xs, mu=0, sd=2):
    return [(x - mu) / sd for x in xs]

print(indicators([1, None, 3]))
print(zscore([2, 4]))
print("ok", True)`,
          output: `[False, True, False]
[1.0, 2.0]
ok True`,
        },
        why: "Indicator + stats de train preservan ausencia y evitan silent fill con datos de test.",
      },
      {
        demoId: "S32-T2-A-DEMO",
        subtopicId: "S32-T2-A",
        environment: "local-python",
        description: "Shared address, degree y path default 99 sobre grafo sintético de entidades.",
        code: {
          language: 'python',
          title: "g_demo.py",
          code: `def shared_addr(a, b):
    return int(a == b)

print("shared", shared_addr("Av1", "Av1"))
print("degree", 2)
print("ok", True)`,
          output: `shared 1
degree 2
ok True`,
        },
        why: "Features de grafo resumen evidencia relacional sin convertir matching en fraude.",
      },
      {
        demoId: "S32-T2-B-DEMO",
        subtopicId: "S32-T2-B",
        environment: "local-python",
        description: "Cuenta eventos en ventana half-open [t-w,t) excluyendo el instante t.",
        code: {
          language: 'python',
          title: "w_demo.py",
          code: `def count_window(events, t, w):
    return sum(1 for ts in events if t - w <= ts < t)

print("count", count_window([1, 2, 3, 5], 5, 3))
print("includes_t", False)
print("ok", True)`,
          output: `count 2
includes_t False
ok True`,
        },
        why: "La política half-open elimina leakage temporal al construir frecuencias de canal.",
      },
      {
        demoId: "S32-T3-A-DEMO",
        subtopicId: "S32-T3-A",
        environment: "local-python",
        description: "Fit de moda y transform de None; falla explícita si not fitted.",
        code: {
          language: 'python',
          title: "tf_demo.py",
          code: `def mode_fill(xs, mode="app"):
    return [mode if x is None else x for x in xs]

print(mode_fill([None, "web"]))
print("fitted", True)
print("ok", True)`,
          output: `['app', 'web']
fitted True
ok True`,
        },
        why: "fit/transform ordenado es el contrato mínimo de un transformer reutilizable.",
      },
      {
        demoId: "S32-T3-B-DEMO",
        subtopicId: "S32-T3-B",
        environment: "local-python",
        description: "Round-trip JSON del state median y version fs-v1 aplicada en serve.",
        code: {
          language: 'python',
          title: "ps_demo.py",
          code: `def state_median(state):
    return state["median"], state["version"]

m, v = state_median({"median": 2, "version": "fs-v1"})
print(m)
print("version", v)
print("ok", True)`,
          output: `2
version fs-v1
ok True`,
        },
        why: "Persistir estado versionado evita train-serve skew silencioso en producción del workbench.",
      },
      {
        demoId: "S32-T4-A-DEMO",
        subtopicId: "S32-T4-A",
        environment: "local-python",
        description: "Time split por cutoff y verificación de overlap de entidades cero.",
        code: {
          language: 'python',
          title: "sp_demo.py",
          code: `def split_sizes(n_train, n_test, overlap):
    return n_train, n_test, overlap

a, b, o = split_sizes(1, 1, 0)
print("n_train", a, "n_test", b)
print("overlap", o)
print("ok", o == 0)`,
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
        description: "Scan de nombres leaky, alerta de skew y feature_set fs-v2.",
        code: {
          language: 'python',
          title: "lk_demo.py",
          code: `def leaky_names(names):
    return [n for n in names if "label" in n or "decision" in n]

print(leaky_names(["amount_7d", "label_decision"]))
print("skew", True)
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
    intro: "S32 · Laboratorio features sin leakage (CP-N3-B): 24 retos. E1 repara predicado, E2 valid/adverso/missing, E3 fail-closed con CASO-LIM-032.",
    steps: [
      {
        id: "S32-T1-A-E1",
        subtopicId: "S32-T1-A",
        kind: "guided",
        instruction: "S32-T1-A-E1 · Calcula el contrato de `numéricas/categóricas/texto` sobre `CASO-LIM-032-1A`. La entrada es el dict completo del starter; la operación debe demostrar row keys ⊆ catalog con catalog_ok. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S32-T1-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_UNKNOWN_FEATURE` en E2.",
        hint: "Relaciona los campos `schema, row, catalog_ok` con la regla explicada en S32-T1-A.",
        hints: [
          "Relaciona los campos `schema, row, catalog_ok` con la regla explicada en S32-T1-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva row keys ⊆ catalog con catalog_ok; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta schema", "fixture adverso: row keys ⊆ catalog con catalog_ok", "CASO-LIM-032-1A es sintético"],
        tests: "El fixture `CASO-LIM-032-1A` satisface un predicado de dominio real; imprime `S32-T1-A PASS` y el assert booleano pasa.",
        feedback: "S32-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNKNOWN_FEATURE y por qué faltar schema exige REQUEST_CATALOG.",
        starterCode: {
          language: 'python',
          title: "s32-t1-a-e1.py",
          code: `# CASO-LIM-032 · feature catalog types
# DEFECT: catalog_ok invertido (False→PASS)
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-032-1A", **{'schema': {'numeric': ['amount_7d'], 'categorical': ['canal']}, 'row': {'amount_7d': 1.0, 'canal': 'app'}, 'catalog_ok': True}}
meets_contract = record["catalog_ok"] is False
status = "PASS" if meets_contract else "REJECT_UNKNOWN_FEATURE"
print("S32-T1-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t1-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-032-1A", **{'schema': {'numeric': ['amount_7d'], 'categorical': ['canal']}, 'row': {'amount_7d': 1.0, 'canal': 'app'}, 'catalog_ok': True}}
meets_contract = record["catalog_ok"] is True and set(record["row"]) <= set(sum(record["schema"].values(), []))
status = "PASS" if meets_contract else "REJECT_UNKNOWN_FEATURE"
print("S32-T1-A", status)
assert meets_contract is True
` ,
          output: `S32-T1-A PASS` ,
        },
      },
      {
        id: "S32-T1-A-E2",
        subtopicId: "S32-T1-A",
        kind: "independent",
        instruction: "S32-T1-A-E2 · Modela tres rutas de `numéricas/categóricas/texto`: fixture válido, fixture adverso y registro sin `schema`. Entrada: dict con case_id, schema, row, catalog_ok. Salidas exactas: `PASS`, `REJECT_UNKNOWN_FEATURE`, `MISSING:schema`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a schema debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a schema debe ocurrir antes de esa rama.",
          "Después aplica la regla de S32-T1-A: row keys ⊆ catalog con catalog_ok. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta schema", "fixture adverso: row keys ⊆ catalog con catalog_ok", "CASO-LIM-032-1A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `schema` ausente y produce exactamente `PASS REJECT_UNKNOWN_FEATURE MISSING:schema`.",
        feedback: "S32-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNKNOWN_FEATURE y por qué faltar schema exige REQUEST_CATALOG.",
        starterCode: {
          language: 'python',
          title: "s32-t1-a-e2.py",
          code: `# CASO-LIM-032 · assess unknown feature
# DEFECT: PASS cuando catalog_ok es False
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'schema', 'row', 'catalog_ok'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["catalog_ok"] is False else "REJECT_UNKNOWN_FEATURE"

valid = {"case_id": "CASO-LIM-032-1A", **{'schema': {'numeric': ['amount_7d'], 'categorical': ['canal']}, 'row': {'amount_7d': 1.0, 'canal': 'app'}, 'catalog_ok': True}}
invalid = {"case_id": "CASO-LIM-032-1A", **{'schema': {'numeric': ['amount_7d']}, 'row': {'unknown_feat': 1}, 'catalog_ok': False}}
incomplete = {**valid}
incomplete.pop("schema")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t1-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'schema', 'row', 'catalog_ok'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["catalog_ok"] is True and set(record["row"]) <= set(sum(record["schema"].values(), [])) else "REJECT_UNKNOWN_FEATURE"

valid = {"case_id": "CASO-LIM-032-1A", **{'schema': {'numeric': ['amount_7d'], 'categorical': ['canal']}, 'row': {'amount_7d': 1.0, 'canal': 'app'}, 'catalog_ok': True}}
invalid = {"case_id": "CASO-LIM-032-1A", **{'schema': {'numeric': ['amount_7d']}, 'row': {'unknown_feat': 1}, 'catalog_ok': False}}
incomplete = {**valid}
incomplete.pop("schema")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_UNKNOWN_FEATURE MISSING:schema` ,
        },
      },
      {
        id: "S32-T1-A-E3",
        subtopicId: "S32-T1-A",
        kind: "transfer",
        instruction: "S32-T1-A-E3 · Contrasta fallo cerrado para `numéricas/categóricas/texto` con tres fixtures distintos. `CASO-LIM-032-1A` debe continuar, el adverso debe devolver `REJECT_UNKNOWN_FEATURE` y la ausencia de `schema` debe devolver `REQUEST_CATALOG`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_CATALOG` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_CATALOG` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró row keys ⊆ catalog con catalog_ok; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta schema", "fixture adverso: row keys ⊆ catalog con catalog_ok", "CASO-LIM-032-1A es sintético"],
        tests: "Fixtures `CASO-LIM-032-1A`, adverso y sin `schema` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S32-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNKNOWN_FEATURE y por qué faltar schema exige REQUEST_CATALOG.",
        starterCode: {
          language: 'python',
          title: "s32-t1-a-e3.py",
          code: `# CASO-LIM-032 · decide REQUEST_CATALOG
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'schema', 'row', 'catalog_ok'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["catalog_ok"] is False else "REJECT_UNKNOWN_FEATURE"

valid = {"case_id": "CASO-LIM-032-1A", **{'schema': {'numeric': ['amount_7d'], 'categorical': ['canal']}, 'row': {'amount_7d': 1.0, 'canal': 'app'}, 'catalog_ok': True}}
invalid = {"case_id": "CASO-LIM-032-1A", **{'schema': {'numeric': ['amount_7d']}, 'row': {'unknown_feat': 1}, 'catalog_ok': False}}
uncertain = {**valid}
uncertain.pop("schema")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t1-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'schema', 'row', 'catalog_ok'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_CATALOG"
    return "CONTINUE" if record["catalog_ok"] is True and set(record["row"]) <= set(sum(record["schema"].values(), [])) else "REJECT_UNKNOWN_FEATURE"

valid = {"case_id": "CASO-LIM-032-1A", **{'schema': {'numeric': ['amount_7d'], 'categorical': ['canal']}, 'row': {'amount_7d': 1.0, 'canal': 'app'}, 'catalog_ok': True}}
invalid = {"case_id": "CASO-LIM-032-1A", **{'schema': {'numeric': ['amount_7d']}, 'row': {'unknown_feat': 1}, 'catalog_ok': False}}
uncertain = {**valid}
uncertain.pop("schema")
results = [decide(item) for item in (valid, invalid, uncertain)]
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
        instruction: "S32-T1-B-E1 · Calcula el contrato de `missing indicators, escalamiento y encoding` sobre `CASO-LIM-032-1B`. La entrada es el dict completo del starter; la operación debe demostrar mediana de train con silent_fill=False. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S32-T1-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_SILENT_FILL` en E2.",
        hint: "Relaciona los campos `values, median, silent_fill` con la regla explicada en S32-T1-B.",
        hints: [
          "Relaciona los campos `values, median, silent_fill` con la regla explicada en S32-T1-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva mediana de train con silent_fill=False; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta median", "fixture adverso: mediana de train con silent_fill=False", "CASO-LIM-032-1B es sintético"],
        tests: "El fixture `CASO-LIM-032-1B` satisface un predicado de dominio real; imprime `S32-T1-B PASS` y el assert booleano pasa.",
        feedback: "S32-T1-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_SILENT_FILL y por qué faltar median exige REQUEST_MEDIAN.",
        starterCode: {
          language: 'python',
          title: "s32-t1-b-e1.py",
          code: `# CASO-LIM-032 · silent fill ban
# DEFECT: PASS si silent_fill True (invertido)
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-032-1B", **{'values': [1, None, 3], 'median': 2, 'silent_fill': False}}
meets_contract = record["silent_fill"] is True
status = "PASS" if meets_contract else "REJECT_SILENT_FILL"
print("S32-T1-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t1-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-032-1B", **{'values': [1, None, 3], 'median': 2, 'silent_fill': False}}
meets_contract = record["silent_fill"] is False and record["median"] is not None
status = "PASS" if meets_contract else "REJECT_SILENT_FILL"
print("S32-T1-B", status)
assert meets_contract is True
` ,
          output: `S32-T1-B PASS` ,
        },
      },
      {
        id: "S32-T1-B-E2",
        subtopicId: "S32-T1-B",
        kind: "independent",
        instruction: "S32-T1-B-E2 · Modela tres rutas de `missing indicators, escalamiento y encoding`: fixture válido, fixture adverso y registro sin `median`. Entrada: dict con case_id, values, median, silent_fill. Salidas exactas: `PASS`, `REJECT_SILENT_FILL`, `MISSING:median`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a median debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a median debe ocurrir antes de esa rama.",
          "Después aplica la regla de S32-T1-B: mediana de train con silent_fill=False. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta median", "fixture adverso: mediana de train con silent_fill=False", "CASO-LIM-032-1B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `median` ausente y produce exactamente `PASS REJECT_SILENT_FILL MISSING:median`.",
        feedback: "S32-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_SILENT_FILL y por qué faltar median exige REQUEST_MEDIAN.",
        starterCode: {
          language: 'python',
          title: "s32-t1-b-e2.py",
          code: `# CASO-LIM-032 · assess silent fill
# DEFECT: PASS con silent_fill
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'values', 'median', 'silent_fill'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["silent_fill"] is True else "REJECT_SILENT_FILL"

valid = {"case_id": "CASO-LIM-032-1B", **{'values': [1, None, 3], 'median': 2, 'silent_fill': False}}
invalid = {"case_id": "CASO-LIM-032-1B", **{'values': [1, None, 3], 'median': None, 'silent_fill': True}}
incomplete = {**valid}
incomplete.pop("median")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t1-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'values', 'median', 'silent_fill'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["silent_fill"] is False and record["median"] is not None else "REJECT_SILENT_FILL"

valid = {"case_id": "CASO-LIM-032-1B", **{'values': [1, None, 3], 'median': 2, 'silent_fill': False}}
invalid = {"case_id": "CASO-LIM-032-1B", **{'values': [1, None, 3], 'median': None, 'silent_fill': True}}
incomplete = {**valid}
incomplete.pop("median")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_SILENT_FILL MISSING:median` ,
        },
      },
      {
        id: "S32-T1-B-E3",
        subtopicId: "S32-T1-B",
        kind: "transfer",
        instruction: "S32-T1-B-E3 · Contrasta fallo cerrado para `missing indicators, escalamiento y encoding` con tres fixtures distintos. `CASO-LIM-032-1B` debe continuar, el adverso debe devolver `REJECT_SILENT_FILL` y la ausencia de `median` debe devolver `REQUEST_MEDIAN`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_MEDIAN` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_MEDIAN` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró mediana de train con silent_fill=False; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta median", "fixture adverso: mediana de train con silent_fill=False", "CASO-LIM-032-1B es sintético"],
        tests: "Fixtures `CASO-LIM-032-1B`, adverso y sin `median` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S32-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_SILENT_FILL y por qué faltar median exige REQUEST_MEDIAN.",
        starterCode: {
          language: 'python',
          title: "s32-t1-b-e3.py",
          code: `# CASO-LIM-032 · decide REQUEST_MEDIAN
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'values', 'median', 'silent_fill'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["silent_fill"] is True else "REJECT_SILENT_FILL"

valid = {"case_id": "CASO-LIM-032-1B", **{'values': [1, None, 3], 'median': 2, 'silent_fill': False}}
invalid = {"case_id": "CASO-LIM-032-1B", **{'values': [1, None, 3], 'median': None, 'silent_fill': True}}
uncertain = {**valid}
uncertain.pop("median")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t1-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'values', 'median', 'silent_fill'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_MEDIAN"
    return "CONTINUE" if record["silent_fill"] is False and record["median"] is not None else "REJECT_SILENT_FILL"

valid = {"case_id": "CASO-LIM-032-1B", **{'values': [1, None, 3], 'median': 2, 'silent_fill': False}}
invalid = {"case_id": "CASO-LIM-032-1B", **{'values': [1, None, 3], 'median': None, 'silent_fill': True}}
uncertain = {**valid}
uncertain.pop("median")
results = [decide(item) for item in (valid, invalid, uncertain)]
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
        instruction: "S32-T2-A-E1 · Calcula el contrato de `shared contact/address, distance y graph features` sobre `CASO-LIM-032-2A`. La entrada es el dict completo del starter; la operación debe demostrar graph feats sin usar label de decisión. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S32-T2-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_LABEL_AS_FEATURE` en E2.",
        hint: "Relaciona los campos `shared, degree, uses_label` con la regla explicada en S32-T2-A.",
        hints: [
          "Relaciona los campos `shared, degree, uses_label` con la regla explicada en S32-T2-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva graph feats sin usar label de decisión; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta degree", "fixture adverso: graph feats sin usar label de decisión", "CASO-LIM-032-2A es sintético"],
        tests: "El fixture `CASO-LIM-032-2A` satisface un predicado de dominio real; imprime `S32-T2-A PASS` y el assert booleano pasa.",
        feedback: "S32-T2-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_LABEL_AS_FEATURE y por qué faltar degree exige REQUEST_GRAPH_FEAT.",
        starterCode: {
          language: 'python',
          title: "s32-t2-a-e1.py",
          code: `# CASO-LIM-032 · shared/graph features + no label
# DEFECT: gate shared/degree/uses_label invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-032-2A", **{'shared': 1, 'degree': 2, 'uses_label': False}}
meets_contract = record["uses_label"] is True
status = "PASS" if meets_contract else "REJECT_LABEL_AS_FEATURE"
print("S32-T2-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t2-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-032-2A", **{'shared': 1, 'degree': 2, 'uses_label': False}}
meets_contract = record["uses_label"] is False and record["degree"] >= 0 and record["shared"] in (0, 1)
status = "PASS" if meets_contract else "REJECT_LABEL_AS_FEATURE"
print("S32-T2-A", status)
assert meets_contract is True
` ,
          output: `S32-T2-A PASS` ,
        },
      },
      {
        id: "S32-T2-A-E2",
        subtopicId: "S32-T2-A",
        kind: "independent",
        instruction: "S32-T2-A-E2 · Modela tres rutas de `shared contact/address, distance y graph features`: fixture válido, fixture adverso y registro sin `degree`. Entrada: dict con case_id, shared, degree, uses_label. Salidas exactas: `PASS`, `REJECT_LABEL_AS_FEATURE`, `MISSING:degree`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a degree debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a degree debe ocurrir antes de esa rama.",
          "Después aplica la regla de S32-T2-A: graph feats sin usar label de decisión. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta degree", "fixture adverso: graph feats sin usar label de decisión", "CASO-LIM-032-2A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `degree` ausente y produce exactamente `PASS REJECT_LABEL_AS_FEATURE MISSING:degree`.",
        feedback: "S32-T2-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_LABEL_AS_FEATURE y por qué faltar degree exige REQUEST_GRAPH_FEAT.",
        starterCode: {
          language: 'python',
          title: "s32-t2-a-e2.py",
          code: `# CASO-LIM-032 · assess graph+label ban
# DEFECT: PASS si uses_label o feats inválidas
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'shared', 'degree', 'uses_label'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["uses_label"] is True else "REJECT_LABEL_AS_FEATURE"

valid = {"case_id": "CASO-LIM-032-2A", **{'shared': 1, 'degree': 2, 'uses_label': False}}
invalid = {"case_id": "CASO-LIM-032-2A", **{'shared': 1, 'degree': 2, 'uses_label': True}}
incomplete = {**valid}
incomplete.pop("degree")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t2-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'shared', 'degree', 'uses_label'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["uses_label"] is False and record["degree"] >= 0 and record["shared"] in (0, 1) else "REJECT_LABEL_AS_FEATURE"

valid = {"case_id": "CASO-LIM-032-2A", **{'shared': 1, 'degree': 2, 'uses_label': False}}
invalid = {"case_id": "CASO-LIM-032-2A", **{'shared': 1, 'degree': 2, 'uses_label': True}}
incomplete = {**valid}
incomplete.pop("degree")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_LABEL_AS_FEATURE MISSING:degree` ,
        },
      },
      {
        id: "S32-T2-A-E3",
        subtopicId: "S32-T2-A",
        kind: "transfer",
        instruction: "S32-T2-A-E3 · Contrasta fallo cerrado para `shared contact/address, distance y graph features` con tres fixtures distintos. `CASO-LIM-032-2A` debe continuar, el adverso debe devolver `REJECT_LABEL_AS_FEATURE` y la ausencia de `degree` debe devolver `REQUEST_GRAPH_FEAT`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_GRAPH_FEAT` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_GRAPH_FEAT` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró graph feats sin usar label de decisión; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta degree", "fixture adverso: graph feats sin usar label de decisión", "CASO-LIM-032-2A es sintético"],
        tests: "Fixtures `CASO-LIM-032-2A`, adverso y sin `degree` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S32-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_LABEL_AS_FEATURE y por qué faltar degree exige REQUEST_GRAPH_FEAT.",
        starterCode: {
          language: 'python',
          title: "s32-t2-a-e3.py",
          code: `# CASO-LIM-032 · decide REJECT_LABEL_AS_FEATURE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'shared', 'degree', 'uses_label'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["uses_label"] is True else "REJECT_LABEL_AS_FEATURE"

valid = {"case_id": "CASO-LIM-032-2A", **{'shared': 1, 'degree': 2, 'uses_label': False}}
invalid = {"case_id": "CASO-LIM-032-2A", **{'shared': 1, 'degree': 2, 'uses_label': True}}
uncertain = {**valid}
uncertain.pop("degree")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t2-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'shared', 'degree', 'uses_label'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_GRAPH_FEAT"
    return "CONTINUE" if record["uses_label"] is False and record["degree"] >= 0 and record["shared"] in (0, 1) else "REJECT_LABEL_AS_FEATURE"

valid = {"case_id": "CASO-LIM-032-2A", **{'shared': 1, 'degree': 2, 'uses_label': False}}
invalid = {"case_id": "CASO-LIM-032-2A", **{'shared': 1, 'degree': 2, 'uses_label': True}}
uncertain = {**valid}
uncertain.pop("degree")
results = [decide(item) for item in (valid, invalid, uncertain)]
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
        instruction: "S32-T2-B-E1 · Calcula el contrato de `ventanas y frecuencia` sobre `CASO-LIM-032-2B`. La entrada es el dict completo del starter; la operación debe demostrar ventana half-open sin incluir t. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S32-T2-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_FUTURE_TS` en E2.",
        hint: "Relaciona los campos `events, t, w, includes_t` con la regla explicada en S32-T2-B.",
        hints: [
          "Relaciona los campos `events, t, w, includes_t` con la regla explicada en S32-T2-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva ventana half-open sin incluir t; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta w", "fixture adverso: ventana half-open sin incluir t", "CASO-LIM-032-2B es sintético"],
        tests: "El fixture `CASO-LIM-032-2B` satisface un predicado de dominio real; imprime `S32-T2-B PASS` y el assert booleano pasa.",
        feedback: "S32-T2-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_FUTURE_TS y por qué faltar w exige REQUEST_WINDOW.",
        starterCode: {
          language: 'python',
          title: "s32-t2-b-e1.py",
          code: `# CASO-LIM-032 · time windows & frequency
# DEFECT: ventana includes_t / freq invertida
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-032-2B", **{'events': [1, 2, 3, 5], 't': 5, 'w': 3, 'includes_t': False}}
meets_contract = record["includes_t"] is True
status = "PASS" if meets_contract else "REJECT_FUTURE_TS"
print("S32-T2-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t2-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-032-2B", **{'events': [1, 2, 3, 5], 't': 5, 'w': 3, 'includes_t': False}}
meets_contract = record["includes_t"] is False and record["w"] > 0 and record["t"] is not None
status = "PASS" if meets_contract else "REJECT_FUTURE_TS"
print("S32-T2-B", status)
assert meets_contract is True
` ,
          output: `S32-T2-B PASS` ,
        },
      },
      {
        id: "S32-T2-B-E2",
        subtopicId: "S32-T2-B",
        kind: "independent",
        instruction: "S32-T2-B-E2 · Modela tres rutas de `ventanas y frecuencia`: fixture válido, fixture adverso y registro sin `w`. Entrada: dict con case_id, events, t, w, includes_t. Salidas exactas: `PASS`, `REJECT_FUTURE_TS`, `MISSING:w`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a w debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a w debe ocurrir antes de esa rama.",
          "Después aplica la regla de S32-T2-B: ventana half-open sin incluir t. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta w", "fixture adverso: ventana half-open sin incluir t", "CASO-LIM-032-2B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `w` ausente y produce exactamente `PASS REJECT_FUTURE_TS MISSING:w`.",
        feedback: "S32-T2-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_FUTURE_TS y por qué faltar w exige REQUEST_WINDOW.",
        starterCode: {
          language: 'python',
          title: "s32-t2-b-e2.py",
          code: `# CASO-LIM-032 · assess window features
# DEFECT: PASS con includes_t o ventana rota
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'events', 't', 'w', 'includes_t'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["includes_t"] is True else "REJECT_FUTURE_TS"

valid = {"case_id": "CASO-LIM-032-2B", **{'events': [1, 2, 3, 5], 't': 5, 'w': 3, 'includes_t': False}}
invalid = {"case_id": "CASO-LIM-032-2B", **{'events': [1, 2, 3, 5], 't': 5, 'w': 3, 'includes_t': True}}
incomplete = {**valid}
incomplete.pop("w")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t2-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'events', 't', 'w', 'includes_t'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["includes_t"] is False and record["w"] > 0 and record["t"] is not None else "REJECT_FUTURE_TS"

valid = {"case_id": "CASO-LIM-032-2B", **{'events': [1, 2, 3, 5], 't': 5, 'w': 3, 'includes_t': False}}
invalid = {"case_id": "CASO-LIM-032-2B", **{'events': [1, 2, 3, 5], 't': 5, 'w': 3, 'includes_t': True}}
incomplete = {**valid}
incomplete.pop("w")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_FUTURE_TS MISSING:w` ,
        },
      },
      {
        id: "S32-T2-B-E3",
        subtopicId: "S32-T2-B",
        kind: "transfer",
        instruction: "S32-T2-B-E3 · Contrasta fallo cerrado para `ventanas y frecuencia` con tres fixtures distintos. `CASO-LIM-032-2B` debe continuar, el adverso debe devolver `REJECT_FUTURE_TS` y la ausencia de `w` debe devolver `REQUEST_WINDOW`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_WINDOW` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_WINDOW` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró ventana half-open sin incluir t; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta w", "fixture adverso: ventana half-open sin incluir t", "CASO-LIM-032-2B es sintético"],
        tests: "Fixtures `CASO-LIM-032-2B`, adverso y sin `w` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S32-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_FUTURE_TS y por qué faltar w exige REQUEST_WINDOW.",
        starterCode: {
          language: 'python',
          title: "s32-t2-b-e3.py",
          code: `# CASO-LIM-032 · decide REQUEST_WINDOW_SPEC
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'events', 't', 'w', 'includes_t'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["includes_t"] is True else "REJECT_FUTURE_TS"

valid = {"case_id": "CASO-LIM-032-2B", **{'events': [1, 2, 3, 5], 't': 5, 'w': 3, 'includes_t': False}}
invalid = {"case_id": "CASO-LIM-032-2B", **{'events': [1, 2, 3, 5], 't': 5, 'w': 3, 'includes_t': True}}
uncertain = {**valid}
uncertain.pop("w")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t2-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'events', 't', 'w', 'includes_t'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_WINDOW"
    return "CONTINUE" if record["includes_t"] is False and record["w"] > 0 and record["t"] is not None else "REJECT_FUTURE_TS"

valid = {"case_id": "CASO-LIM-032-2B", **{'events': [1, 2, 3, 5], 't': 5, 'w': 3, 'includes_t': False}}
invalid = {"case_id": "CASO-LIM-032-2B", **{'events': [1, 2, 3, 5], 't': 5, 'w': 3, 'includes_t': True}}
uncertain = {**valid}
uncertain.pop("w")
results = [decide(item) for item in (valid, invalid, uncertain)]
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
        instruction: "S32-T3-A-E1 · Calcula el contrato de `ColumnTransformer y custom transformers` sobre `CASO-LIM-032-3A`. La entrada es el dict completo del starter; la operación debe demostrar transformer fitted con mode y sin transform prematuro. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S32-T3-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_TRANSFORM_BEFORE_FIT` en E2.",
        hint: "Relaciona los campos `fitted, mode, transform_before_fit` con la regla explicada en S32-T3-A.",
        hints: [
          "Relaciona los campos `fitted, mode, transform_before_fit` con la regla explicada en S32-T3-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva transformer fitted con mode y sin transform prematuro; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta fitted", "fixture adverso: transformer fitted con mode y sin transform prematuro", "CASO-LIM-032-3A es sintético"],
        tests: "El fixture `CASO-LIM-032-3A` satisface un predicado de dominio real; imprime `S32-T3-A PASS` y el assert booleano pasa.",
        feedback: "S32-T3-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_TRANSFORM_BEFORE_FIT y por qué faltar fitted exige REQUEST_FIT_STATE.",
        starterCode: {
          language: 'python',
          title: "s32-t3-a-e1.py",
          code: `# CASO-LIM-032 · ColumnTransformer fit order
# DEFECT: fitted/transform_before_fit invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-032-3A", **{'fitted': True, 'mode': 'app', 'transform_before_fit': False}}
meets_contract = record["transform_before_fit"] is True
status = "PASS" if meets_contract else "REJECT_TRANSFORM_BEFORE_FIT"
print("S32-T3-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t3-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-032-3A", **{'fitted': True, 'mode': 'app', 'transform_before_fit': False}}
meets_contract = record["fitted"] is True and record["transform_before_fit"] is False and record["mode"] is not None
status = "PASS" if meets_contract else "REJECT_TRANSFORM_BEFORE_FIT"
print("S32-T3-A", status)
assert meets_contract is True
` ,
          output: `S32-T3-A PASS` ,
        },
      },
      {
        id: "S32-T3-A-E2",
        subtopicId: "S32-T3-A",
        kind: "independent",
        instruction: "S32-T3-A-E2 · Modela tres rutas de `ColumnTransformer y custom transformers`: fixture válido, fixture adverso y registro sin `fitted`. Entrada: dict con case_id, fitted, mode, transform_before_fit. Salidas exactas: `PASS`, `REJECT_TRANSFORM_BEFORE_FIT`, `MISSING:fitted`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a fitted debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a fitted debe ocurrir antes de esa rama.",
          "Después aplica la regla de S32-T3-A: transformer fitted con mode y sin transform prematuro. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta fitted", "fixture adverso: transformer fitted con mode y sin transform prematuro", "CASO-LIM-032-3A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `fitted` ausente y produce exactamente `PASS REJECT_TRANSFORM_BEFORE_FIT MISSING:fitted`.",
        feedback: "S32-T3-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_TRANSFORM_BEFORE_FIT y por qué faltar fitted exige REQUEST_FIT_STATE.",
        starterCode: {
          language: 'python',
          title: "s32-t3-a-e2.py",
          code: `# CASO-LIM-032 · assess transformer fit
# DEFECT: PASS si transform_before_fit o unfitted
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'fitted', 'mode', 'transform_before_fit'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["transform_before_fit"] is True else "REJECT_TRANSFORM_BEFORE_FIT"

valid = {"case_id": "CASO-LIM-032-3A", **{'fitted': True, 'mode': 'app', 'transform_before_fit': False}}
invalid = {"case_id": "CASO-LIM-032-3A", **{'fitted': False, 'mode': None, 'transform_before_fit': True}}
incomplete = {**valid}
incomplete.pop("fitted")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t3-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'fitted', 'mode', 'transform_before_fit'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["fitted"] is True and record["transform_before_fit"] is False and record["mode"] is not None else "REJECT_TRANSFORM_BEFORE_FIT"

valid = {"case_id": "CASO-LIM-032-3A", **{'fitted': True, 'mode': 'app', 'transform_before_fit': False}}
invalid = {"case_id": "CASO-LIM-032-3A", **{'fitted': False, 'mode': None, 'transform_before_fit': True}}
incomplete = {**valid}
incomplete.pop("fitted")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_TRANSFORM_BEFORE_FIT MISSING:fitted` ,
        },
      },
      {
        id: "S32-T3-A-E3",
        subtopicId: "S32-T3-A",
        kind: "transfer",
        instruction: "S32-T3-A-E3 · Contrasta fallo cerrado para `ColumnTransformer y custom transformers` con tres fixtures distintos. `CASO-LIM-032-3A` debe continuar, el adverso debe devolver `REJECT_TRANSFORM_BEFORE_FIT` y la ausencia de `fitted` debe devolver `REQUEST_FIT_STATE`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_FIT_STATE` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_FIT_STATE` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró transformer fitted con mode y sin transform prematuro; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta fitted", "fixture adverso: transformer fitted con mode y sin transform prematuro", "CASO-LIM-032-3A es sintético"],
        tests: "Fixtures `CASO-LIM-032-3A`, adverso y sin `fitted` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S32-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_TRANSFORM_BEFORE_FIT y por qué faltar fitted exige REQUEST_FIT_STATE.",
        starterCode: {
          language: 'python',
          title: "s32-t3-a-e3.py",
          code: `# CASO-LIM-032 · decide REQUEST_FIT_ORDER
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'fitted', 'mode', 'transform_before_fit'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["transform_before_fit"] is True else "REJECT_TRANSFORM_BEFORE_FIT"

valid = {"case_id": "CASO-LIM-032-3A", **{'fitted': True, 'mode': 'app', 'transform_before_fit': False}}
invalid = {"case_id": "CASO-LIM-032-3A", **{'fitted': False, 'mode': None, 'transform_before_fit': True}}
uncertain = {**valid}
uncertain.pop("fitted")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t3-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'fitted', 'mode', 'transform_before_fit'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_FIT_STATE"
    return "CONTINUE" if record["fitted"] is True and record["transform_before_fit"] is False and record["mode"] is not None else "REJECT_TRANSFORM_BEFORE_FIT"

valid = {"case_id": "CASO-LIM-032-3A", **{'fitted': True, 'mode': 'app', 'transform_before_fit': False}}
invalid = {"case_id": "CASO-LIM-032-3A", **{'fitted': False, 'mode': None, 'transform_before_fit': True}}
uncertain = {**valid}
uncertain.pop("fitted")
results = [decide(item) for item in (valid, invalid, uncertain)]
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
        instruction: "S32-T3-B-E1 · Calcula el contrato de `fit/transform y persistencia` sobre `CASO-LIM-032-3B`. La entrada es el dict completo del starter; la operación debe demostrar state JSON con version fs-vN. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S32-T3-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_UNVERSIONED` en E2.",
        hint: "Relaciona los campos `state, version, versioned` con la regla explicada en S32-T3-B.",
        hints: [
          "Relaciona los campos `state, version, versioned` con la regla explicada en S32-T3-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva state JSON con version fs-vN; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta version", "fixture adverso: state JSON con version fs-vN", "CASO-LIM-032-3B es sintético"],
        tests: "El fixture `CASO-LIM-032-3B` satisface un predicado de dominio real; imprime `S32-T3-B PASS` y el assert booleano pasa.",
        feedback: "S32-T3-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNVERSIONED y por qué faltar version exige REQUEST_STATE_JSON.",
        starterCode: {
          language: 'python',
          title: "s32-t3-b-e1.py",
          code: `# CASO-LIM-032 · fit/transform persistence
# DEFECT: state/version versioned invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-032-3B", **{'state': {'median': 2}, 'version': 'fs-v1', 'versioned': True}}
meets_contract = record["versioned"] is False or not record["version"]
status = "PASS" if meets_contract else "REJECT_UNVERSIONED"
print("S32-T3-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t3-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-032-3B", **{'state': {'median': 2}, 'version': 'fs-v1', 'versioned': True}}
meets_contract = record["versioned"] is True and str(record["version"]).startswith("fs-v")
status = "PASS" if meets_contract else "REJECT_UNVERSIONED"
print("S32-T3-B", status)
assert meets_contract is True
` ,
          output: `S32-T3-B PASS` ,
        },
      },
      {
        id: "S32-T3-B-E2",
        subtopicId: "S32-T3-B",
        kind: "independent",
        instruction: "S32-T3-B-E2 · Modela tres rutas de `fit/transform y persistencia`: fixture válido, fixture adverso y registro sin `version`. Entrada: dict con case_id, state, version, versioned. Salidas exactas: `PASS`, `REJECT_UNVERSIONED`, `MISSING:version`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a version debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a version debe ocurrir antes de esa rama.",
          "Después aplica la regla de S32-T3-B: state JSON con version fs-vN. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta version", "fixture adverso: state JSON con version fs-vN", "CASO-LIM-032-3B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `version` ausente y produce exactamente `PASS REJECT_UNVERSIONED MISSING:version`.",
        feedback: "S32-T3-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNVERSIONED y por qué faltar version exige REQUEST_STATE_JSON.",
        starterCode: {
          language: 'python',
          title: "s32-t3-b-e2.py",
          code: `# CASO-LIM-032 · assess fit/transform persist
# DEFECT: PASS sin artifact persistido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'state', 'version', 'versioned'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["versioned"] is False or not record["version"] else "REJECT_UNVERSIONED"

valid = {"case_id": "CASO-LIM-032-3B", **{'state': {'median': 2}, 'version': 'fs-v1', 'versioned': True}}
invalid = {"case_id": "CASO-LIM-032-3B", **{'state': {'median': 2}, 'version': '', 'versioned': False}}
incomplete = {**valid}
incomplete.pop("version")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t3-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'state', 'version', 'versioned'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["versioned"] is True and str(record["version"]).startswith("fs-v") else "REJECT_UNVERSIONED"

valid = {"case_id": "CASO-LIM-032-3B", **{'state': {'median': 2}, 'version': 'fs-v1', 'versioned': True}}
invalid = {"case_id": "CASO-LIM-032-3B", **{'state': {'median': 2}, 'version': '', 'versioned': False}}
incomplete = {**valid}
incomplete.pop("version")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_UNVERSIONED MISSING:version` ,
        },
      },
      {
        id: "S32-T3-B-E3",
        subtopicId: "S32-T3-B",
        kind: "transfer",
        instruction: "S32-T3-B-E3 · Contrasta fallo cerrado para `fit/transform y persistencia` con tres fixtures distintos. `CASO-LIM-032-3B` debe continuar, el adverso debe devolver `REJECT_UNVERSIONED` y la ausencia de `version` debe devolver `REQUEST_STATE_JSON`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_STATE_JSON` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_STATE_JSON` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró state JSON con version fs-vN; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta version", "fixture adverso: state JSON con version fs-vN", "CASO-LIM-032-3B es sintético"],
        tests: "Fixtures `CASO-LIM-032-3B`, adverso y sin `version` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S32-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_UNVERSIONED y por qué faltar version exige REQUEST_STATE_JSON.",
        starterCode: {
          language: 'python',
          title: "s32-t3-b-e3.py",
          code: `# CASO-LIM-032 · decide REQUEST_TRANSFORM_ART
# DEFECT: missing→CONTINUE
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'state', 'version', 'versioned'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["versioned"] is False or not record["version"] else "REJECT_UNVERSIONED"

valid = {"case_id": "CASO-LIM-032-3B", **{'state': {'median': 2}, 'version': 'fs-v1', 'versioned': True}}
invalid = {"case_id": "CASO-LIM-032-3B", **{'state': {'median': 2}, 'version': '', 'versioned': False}}
uncertain = {**valid}
uncertain.pop("version")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t3-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'state', 'version', 'versioned'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_STATE_JSON"
    return "CONTINUE" if record["versioned"] is True and str(record["version"]).startswith("fs-v") else "REJECT_UNVERSIONED"

valid = {"case_id": "CASO-LIM-032-3B", **{'state': {'median': 2}, 'version': 'fs-v1', 'versioned': True}}
invalid = {"case_id": "CASO-LIM-032-3B", **{'state': {'median': 2}, 'version': '', 'versioned': False}}
uncertain = {**valid}
uncertain.pop("version")
results = [decide(item) for item in (valid, invalid, uncertain)]
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
        instruction: "S32-T4-A-E1 · Calcula el contrato de `split por entidad/grupo/tiempo` sobre `CASO-LIM-032-4A`. La entrada es el dict completo del starter; la operación debe demostrar split con overlap 0 y ambos lados no vacíos. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S32-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_ENTITY_OVERLAP` en E2.",
        hint: "Relaciona los campos `n_train, n_test, overlap` con la regla explicada en S32-T4-A.",
        hints: [
          "Relaciona los campos `n_train, n_test, overlap` con la regla explicada en S32-T4-A.",
          "El predicado correcto debe ser verdadero porque el fixture conserva split con overlap 0 y ambos lados no vacíos; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta overlap", "fixture adverso: split con overlap 0 y ambos lados no vacíos", "CASO-LIM-032-4A es sintético"],
        tests: "El fixture `CASO-LIM-032-4A` satisface un predicado de dominio real; imprime `S32-T4-A PASS` y el assert booleano pasa.",
        feedback: "S32-T4-A-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_ENTITY_OVERLAP y por qué faltar overlap exige REQUEST_SPLIT_KEYS.",
        starterCode: {
          language: 'python',
          title: "s32-t4-a-e1.py",
          code: `# CASO-LIM-032 · entity/group/time split
# DEFECT: overlap train/test invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-032-4A", **{'n_train': 1, 'n_test': 1, 'overlap': 0}}
meets_contract = record["overlap"] > 0
status = "PASS" if meets_contract else "REJECT_ENTITY_OVERLAP"
print("S32-T4-A", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t4-a-e1.py",
          code: `record = {"case_id": "CASO-LIM-032-4A", **{'n_train': 1, 'n_test': 1, 'overlap': 0}}
meets_contract = record["overlap"] == 0 and record["n_train"] >= 1 and record["n_test"] >= 1
status = "PASS" if meets_contract else "REJECT_ENTITY_OVERLAP"
print("S32-T4-A", status)
assert meets_contract is True
` ,
          output: `S32-T4-A PASS` ,
        },
      },
      {
        id: "S32-T4-A-E2",
        subtopicId: "S32-T4-A",
        kind: "independent",
        instruction: "S32-T4-A-E2 · Modela tres rutas de `split por entidad/grupo/tiempo`: fixture válido, fixture adverso y registro sin `overlap`. Entrada: dict con case_id, n_train, n_test, overlap. Salidas exactas: `PASS`, `REJECT_ENTITY_OVERLAP`, `MISSING:overlap`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a overlap debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a overlap debe ocurrir antes de esa rama.",
          "Después aplica la regla de S32-T4-A: split con overlap 0 y ambos lados no vacíos. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta overlap", "fixture adverso: split con overlap 0 y ambos lados no vacíos", "CASO-LIM-032-4A es sintético"],
        tests: "La tabla cubre válido/adverso/campo `overlap` ausente y produce exactamente `PASS REJECT_ENTITY_OVERLAP MISSING:overlap`.",
        feedback: "S32-T4-A-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_ENTITY_OVERLAP y por qué faltar overlap exige REQUEST_SPLIT_KEYS.",
        starterCode: {
          language: 'python',
          title: "s32-t4-a-e2.py",
          code: `# CASO-LIM-032 · assess split isolation
# DEFECT: PASS con overlap>0 o n_train/test=0
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'n_train', 'n_test', 'overlap'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["overlap"] > 0 else "REJECT_ENTITY_OVERLAP"

valid = {"case_id": "CASO-LIM-032-4A", **{'n_train': 1, 'n_test': 1, 'overlap': 0}}
invalid = {"case_id": "CASO-LIM-032-4A", **{'n_train': 2, 'n_test': 2, 'overlap': 1}}
incomplete = {**valid}
incomplete.pop("overlap")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t4-a-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'n_train', 'n_test', 'overlap'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if record["overlap"] == 0 and record["n_train"] >= 1 and record["n_test"] >= 1 else "REJECT_ENTITY_OVERLAP"

valid = {"case_id": "CASO-LIM-032-4A", **{'n_train': 1, 'n_test': 1, 'overlap': 0}}
invalid = {"case_id": "CASO-LIM-032-4A", **{'n_train': 2, 'n_test': 2, 'overlap': 1}}
incomplete = {**valid}
incomplete.pop("overlap")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_ENTITY_OVERLAP MISSING:overlap` ,
        },
      },
      {
        id: "S32-T4-A-E3",
        subtopicId: "S32-T4-A",
        kind: "transfer",
        instruction: "S32-T4-A-E3 · Contrasta fallo cerrado para `split por entidad/grupo/tiempo` con tres fixtures distintos. `CASO-LIM-032-4A` debe continuar, el adverso debe devolver `REJECT_ENTITY_OVERLAP` y la ausencia de `overlap` debe devolver `REQUEST_SPLIT_KEYS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_SPLIT_KEYS` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_SPLIT_KEYS` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró split con overlap 0 y ambos lados no vacíos; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta overlap", "fixture adverso: split con overlap 0 y ambos lados no vacíos", "CASO-LIM-032-4A es sintético"],
        tests: "Fixtures `CASO-LIM-032-4A`, adverso y sin `overlap` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S32-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_ENTITY_OVERLAP y por qué faltar overlap exige REQUEST_SPLIT_KEYS.",
        starterCode: {
          language: 'python',
          title: "s32-t4-a-e3.py",
          code: `# CASO-LIM-032 · decide REQUEST_SPLIT_FIX
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'n_train', 'n_test', 'overlap'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if record["overlap"] > 0 else "REJECT_ENTITY_OVERLAP"

valid = {"case_id": "CASO-LIM-032-4A", **{'n_train': 1, 'n_test': 1, 'overlap': 0}}
invalid = {"case_id": "CASO-LIM-032-4A", **{'n_train': 2, 'n_test': 2, 'overlap': 1}}
uncertain = {**valid}
uncertain.pop("overlap")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t4-a-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'n_train', 'n_test', 'overlap'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_SPLIT_KEYS"
    return "CONTINUE" if record["overlap"] == 0 and record["n_train"] >= 1 and record["n_test"] >= 1 else "REJECT_ENTITY_OVERLAP"

valid = {"case_id": "CASO-LIM-032-4A", **{'n_train': 1, 'n_test': 1, 'overlap': 0}}
invalid = {"case_id": "CASO-LIM-032-4A", **{'n_train': 2, 'n_test': 2, 'overlap': 1}}
uncertain = {**valid}
uncertain.pop("overlap")
results = [decide(item) for item in (valid, invalid, uncertain)]
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
        instruction: "S32-T4-B-E1 · Calcula el contrato de `leakage, train–serve skew y versionado` sobre `CASO-LIM-032-4B`. La entrada es el dict completo del starter; la operación debe demostrar sin leaky names, sin skew y con feature_set id. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S32-T4-B PASS`; la misma operación sobre el fixture adverso debe activar `REJECT_LEAKAGE` en E2.",
        hint: "Relaciona los campos `leaky, skew, feature_set` con la regla explicada en S32-T4-B.",
        hints: [
          "Relaciona los campos `leaky, skew, feature_set` con la regla explicada en S32-T4-B.",
          "El predicado correcto debe ser verdadero porque el fixture conserva sin leaky names, sin skew y con feature_set id; revisa dirección de comparación, conjuntos y negaciones.",
        ],
        edgeCases: ["falta feature_set", "fixture adverso: sin leaky names, sin skew y con feature_set id", "CASO-LIM-032-4B es sintético"],
        tests: "El fixture `CASO-LIM-032-4B` satisface un predicado de dominio real; imprime `S32-T4-B PASS` y el assert booleano pasa.",
        feedback: "S32-T4-B-E1: explica qué campo cambió la decisión, por qué el adverso activa REJECT_LEAKAGE y por qué faltar feature_set exige REQUEST_FEATURE_SET_ID.",
        starterCode: {
          language: 'python',
          title: "s32-t4-b-e1.py",
          code: `# CASO-LIM-032 · leakage/skew/version gate
# DEFECT: leaky/skew/feature_set invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
record = {"case_id": "CASO-LIM-032-4B", **{'leaky': [], 'skew': False, 'feature_set': 'fs-v2'}}
meets_contract = bool(record["leaky"]) or record["skew"] is True
status = "PASS" if meets_contract else "REJECT_LEAKAGE"
print("S32-T4-B", status)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t4-b-e1.py",
          code: `record = {"case_id": "CASO-LIM-032-4B", **{'leaky': [], 'skew': False, 'feature_set': 'fs-v2'}}
meets_contract = not record["leaky"] and record["skew"] is False and str(record["feature_set"]).startswith("fs-v")
status = "PASS" if meets_contract else "REJECT_LEAKAGE"
print("S32-T4-B", status)
assert meets_contract is True
` ,
          output: `S32-T4-B PASS` ,
        },
      },
      {
        id: "S32-T4-B-E2",
        subtopicId: "S32-T4-B",
        kind: "independent",
        instruction: "S32-T4-B-E2 · Modela tres rutas de `leakage, train–serve skew y versionado`: fixture válido, fixture adverso y registro sin `feature_set`. Entrada: dict con case_id, leaky, skew, feature_set. Salidas exactas: `PASS`, `REJECT_LEAKAGE`, `MISSING:feature_set`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.",
        hint: "Primero se calcula `missing`; ningún acceso a feature_set debe ocurrir antes de esa rama.",
        hints: [
          "Primero se calcula `missing`; ningún acceso a feature_set debe ocurrir antes de esa rama.",
          "Después aplica la regla de S32-T4-B: sin leaky names, sin skew y con feature_set id. El fixture adverso debe fallar por contenido, no por schema.",
        ],
        edgeCases: ["falta feature_set", "fixture adverso: sin leaky names, sin skew y con feature_set id", "CASO-LIM-032-4B es sintético"],
        tests: "La tabla cubre válido/adverso/campo `feature_set` ausente y produce exactamente `PASS REJECT_LEAKAGE MISSING:feature_set`.",
        feedback: "S32-T4-B-E2: explica qué campo cambió la decisión, por qué el adverso activa REJECT_LEAKAGE y por qué faltar feature_set exige REQUEST_FEATURE_SET_ID.",
        starterCode: {
          language: 'python',
          title: "s32-t4-b-e2.py",
          code: `# CASO-LIM-032 · assess leakage & skew
# DEFECT: PASS con leaky o skew True
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def assess(record: dict) -> str:
    required = {"case_id", 'leaky', 'skew', 'feature_set'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if bool(record["leaky"]) or record["skew"] is True else "REJECT_LEAKAGE"

valid = {"case_id": "CASO-LIM-032-4B", **{'leaky': [], 'skew': False, 'feature_set': 'fs-v2'}}
invalid = {"case_id": "CASO-LIM-032-4B", **{'leaky': ['label_decision'], 'skew': True, 'feature_set': 'fs-v2'}}
incomplete = {**valid}
incomplete.pop("feature_set")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t4-b-e2.py",
          code: `def assess(record: dict) -> str:
    required = {"case_id", 'leaky', 'skew', 'feature_set'}
    missing = sorted(required - record.keys())
    if missing:
        return "MISSING:" + ",".join(missing)
    return "PASS" if not record["leaky"] and record["skew"] is False and str(record["feature_set"]).startswith("fs-v") else "REJECT_LEAKAGE"

valid = {"case_id": "CASO-LIM-032-4B", **{'leaky': [], 'skew': False, 'feature_set': 'fs-v2'}}
invalid = {"case_id": "CASO-LIM-032-4B", **{'leaky': ['label_decision'], 'skew': True, 'feature_set': 'fs-v2'}}
incomplete = {**valid}
incomplete.pop("feature_set")
results = (assess(valid), assess(invalid), assess(incomplete))
print(*results)
` ,
          output: `PASS REJECT_LEAKAGE MISSING:feature_set` ,
        },
      },
      {
        id: "S32-T4-B-E3",
        subtopicId: "S32-T4-B",
        kind: "transfer",
        instruction: "S32-T4-B-E3 · Contrasta fallo cerrado para `leakage, train–serve skew y versionado` con tres fixtures distintos. `CASO-LIM-032-4B` debe continuar, el adverso debe devolver `REJECT_LEAKAGE` y la ausencia de `feature_set` debe devolver `REQUEST_FEATURE_SET_ID`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.",
        hint: "Una ausencia no equivale a breach: enrútala a `REQUEST_FEATURE_SET_ID` antes de evaluar el contenido.",
        hints: [
          "Una ausencia no equivale a breach: enrútala a `REQUEST_FEATURE_SET_ID` antes de evaluar el contenido.",
          "Para datos completos reutiliza la regla que demostró sin leaky names, sin skew y con feature_set id; solo ese caso devuelve `CONTINUE`.",
        ],
        edgeCases: ["falta feature_set", "fixture adverso: sin leaky names, sin skew y con feature_set id", "CASO-LIM-032-4B es sintético"],
        tests: "Fixtures `CASO-LIM-032-4B`, adverso y sin `feature_set` prueban continue/breach/uncertainty en ese orden.",
        feedback: "S32-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa REJECT_LEAKAGE y por qué faltar feature_set exige REQUEST_FEATURE_SET_ID.",
        starterCode: {
          language: 'python',
          title: "s32-t4-b-e3.py",
          code: `# CASO-LIM-032 · decide HOLD_ON_LEAKAGE
# DEFECT: missing→CONTINUE; pred invertido
# Contrato: corrige el DEFECT; salida alineada a solutionCode
def decide(record: dict) -> str:
    required = {"case_id", 'leaky', 'skew', 'feature_set'}
    missing = sorted(required - record.keys())
    if missing:
        return "CONTINUE"
    return "CONTINUE" if bool(record["leaky"]) or record["skew"] is True else "REJECT_LEAKAGE"

valid = {"case_id": "CASO-LIM-032-4B", **{'leaky': [], 'skew': False, 'feature_set': 'fs-v2'}}
invalid = {"case_id": "CASO-LIM-032-4B", **{'leaky': ['label_decision'], 'skew': True, 'feature_set': 'fs-v2'}}
uncertain = {**valid}
uncertain.pop("feature_set")
results = [decide(item) for item in (valid, invalid, uncertain)]
print(*results)
` ,
        },
        solutionCode: {
          language: 'python',
          title: "s32-t4-b-e3.py",
          code: `def decide(record: dict) -> str:
    required = {"case_id", 'leaky', 'skew', 'feature_set'}
    missing = sorted(required - record.keys())
    if missing:
        return "REQUEST_FEATURE_SET_ID"
    return "CONTINUE" if not record["leaky"] and record["skew"] is False and str(record["feature_set"]).startswith("fs-v") else "REJECT_LEAKAGE"

valid = {"case_id": "CASO-LIM-032-4B", **{'leaky': [], 'skew': False, 'feature_set': 'fs-v2'}}
invalid = {"case_id": "CASO-LIM-032-4B", **{'leaky': ['label_decision'], 'skew': True, 'feature_set': 'fs-v2'}}
uncertain = {**valid}
uncertain.pop("feature_set")
results = [decide(item) for item in (valid, invalid, uncertain)]
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
      "Construye catálogo, window half-open, transformer fit state y split sin overlap para CASO-LIM-032 / cpn3b-feat.",
    objectives: [
      "Catalog dtypes y keys validadas",
      "Missing indicator + stats de train",
      "Graph + window half-open",
      "fs-vN, leakage scan y split limpio",
    ],
    requirements: [
      "Train≡serve state",
      "Sin future ts ni label features",
      "es-PE sintético; feature_set id",
    ],
    starterCode: `# features CP-N3-B — CASO-LIM-032
catalog = {"numeric": [], "categorical": [], "text": []}
state = {"version": "fs-v1"}
# Contrato de theory/iDo documentado (sin stubs)
if __name__ == "__main__":
    print(state["version"])
`,
    portfolioNote:
      "Feature set fs-vN + anti-leakage checklist.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / sin inferencia de fraude", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
      { criterion: "fs-vN + half-open window + zero entity overlap", weight: "bonus" },
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
        question: "Una feature que usa label_decision del futuro en train es…",
        options: ["buena ingeniería de features", "obligatoria para el grafo", "irrelevante si hay z-score", "leakage: debe rechazarse en el scan de nombres/contrato"],
        correctIndex: 3,
        explanation:
          "Anti-leakage: features no pueden incorporar la decisión/etiqueta futura.",
      }
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
