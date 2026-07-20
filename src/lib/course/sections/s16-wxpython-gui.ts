import type { CourseSection } from '../../types'

export const section16: CourseSection = {
  id: "wxpython-gui",
  index: 16,
  title: "Calidad, limpieza y contratos de datos",
  shortTitle: "Calidad y contratos",
  tagline: "suite de calidad que falla de forma explicable ante schema drift, cuantifica pérdida y nunca arregla silenciosamente un dato",
  estimatedHours: 12,
  level: "Competente",
  phase: 1,
  icon: "Monitor",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "Los equipos de datos en Perú necesitan **quality gates explicables**: null policies, duplicados con evidencia, normalización y cuarentena. Esta sección (id `wxpython-gui` conservado) retematiza a V3 **calidad/limpieza/contratos** e incrementa **CP-N2-A (quality)**.",
  learningOutcomes: [
    { text: "Definir políticas de null por campo" },
    { text: "Limitar imputación y usar indicadores de ausencia" },
    { text: "Distinguir duplicados exactos de conflictos" },
    { text: "Conservar evidencia al resolver claves/cardinalidad" },
    { text: "Normalizar strings/números/fechas/categorías" },
    { text: "Clasificar outliers plausibles vs errores" },
    { text: "Implementar contratos de schema y cross-field" },
    { text: "Cuarentenar fallos con métricas y audit trail" },
  ],
  theory: [
    {
      heading: "De “GUI wxPython” a calidad y contratos de datos (mapa)",
      paragraphs: [
        "En V3, **S16 no es el path de wx.Frame ni sizers**. Aquí construyes el **quality gate de CP-N2-A**: políticas de null, imputación limitada, duplicados, normalización, outliers, contratos y cuarentena con audit trail.",
        "Regla de oro: **nunca “arreglar” silenciosamente**. Toda transformación deja métrica o rastro.",
        "Orden: **T1 Ausencia** → **T2 Duplicados** → **T3 Normalización** → **T4 Contratos**.",
      ],
      callout: {
        type: "info",
        title: "Contenido reubicado conceptualmente",
        content:
          "Material legado de wxPython **no es el camino V3 en S16**. Target: calidad y contratos para CP-N2-A.",
      },
    },
    {
      heading: "nulls y políticas por campo",
      subtopicId: "S16-T1-A",
      paragraphs: [
        "Cada campo tiene política: **required** (null ⇒ cuarentena/falla) u **optional** (null permitido con indicador).",
        "`isna` / `notna` cuantifican ausencia. No imputes un required sin regla explícita.",
        "Documenta la política en un dict `{campo: 'required'|'optional'}`.",
      ],
      code: {
        language: 'python',
        title: "null_policy.py",
        code: `import pandas as pd

policy = {"cliente_id": "required", "email": "optional", "monto": "required"}
df = pd.DataFrame({
    "cliente_id": ["C001", None, "C003"],
    "email": [None, "a@example.com", "b@example.com"],
    "monto": [10.0, 5.0, None],
})
violations = {}
for col, pol in policy.items():
    n = int(df[col].isna().sum())
    if pol == "required" and n:
        violations[col] = n
print("violations", violations)
print("null_rate_email", float(df["email"].isna().mean()))`,
        output: `violations {'cliente_id': 1, 'monto': 1}
null_rate_email 0.3333333333333333`,
      },
      callout: {
        type: "warning",
        title: "Required no se rellena a escondidas",
        content:
          "Null en required → cuarentena o fail, no default mágico.",
      },
    },
    {
      heading: "indicadores y límites de imputación",
      subtopicId: "S16-T1-B",
      paragraphs: [
        "Un **indicador de ausencia** (`monto_was_null`) preserva señal cuando imputas.",
        "Límites: no imputar más del X% de una columna; no imputar llaves; usa mediana/constante documentada.",
        "Si superas el cap, falla el gate.",
      ],
      code: {
        language: 'python',
        title: "impute_cap.py",
        code: `import pandas as pd

df = pd.DataFrame({"monto": [10.0, None, None, 8.0, 12.0]})
cap = 0.4
rate = df["monto"].isna().mean()
print("null_rate", rate)
if rate > cap:
    print("gate", "fail_impute_cap")
else:
    df = df.copy()
    df["monto_was_null"] = df["monto"].isna()
    med = df["monto"].median()
    df["monto"] = df["monto"].fillna(med)
    print(df.to_dict(orient="list"))`,
        output: `null_rate 0.4
{'monto': [10.0, 10.0, 10.0, 8.0, 12.0], 'monto_was_null': [False, True, True, False, False]}`,
      },
      callout: {
        type: "tip",
        title: "Indicador > silencio",
        content:
          "El modelo y el auditor deben saber qué filas fueron imputadas.",
      },
    },
    {
      heading: "duplicados exactos vs conflictos",
      subtopicId: "S16-T2-A",
      paragraphs: [
        "**Exacto**: filas idénticas en todas las columnas relevantes. **Conflicto**: misma clave, valores distintos en atributos.",
        "`duplicated` detecta exactos; groupby por clave + nunique detecta conflictos.",
        "Políticas keep='first'|'last' solo tras clasificar.",
      ],
      code: {
        language: 'python',
        title: "dups.py",
        code: `import pandas as pd

df = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002", "C002"],
    "region": ["Lima", "Lima", "Cusco", "Arequipa"],
    "score": [0.9, 0.9, 0.5, 0.5],
})
exact = df.duplicated(keep=False)
conflict = df.groupby("cliente_id")["region"].transform("nunique") > 1
print("exact_rows", df.loc[exact].to_dict(orient="list"))
print("conflict_ids", df.loc[conflict, "cliente_id"].unique().tolist())`,
        output: `exact_rows {'cliente_id': ['C001', 'C001'], 'region': ['Lima', 'Lima'], 'score': [0.9, 0.9]}
conflict_ids ['C002']`,
      },
      callout: {
        type: "warning",
        title: "No drop_duplicates ciego",
        content:
          "Puedes borrar el único rastro del conflicto. Clasifica primero.",
      },
    },
    {
      heading: "claves, cardinalidad y conservación de evidencia",
      subtopicId: "S16-T2-B",
      paragraphs: [
        "Define la **clave de negocio** y la cardinalidad esperada (1 fila por cliente).",
        "Duplicados de clave van a **cuarentena** con evidencia (todas las versiones), no se borran sin log.",
        "El set limpio contiene una fila resuelta; el audit guarda el resto.",
      ],
      code: {
        language: 'python',
        title: "key_evidence.py",
        code: `import pandas as pd

df = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002"],
    "score": [0.9, 0.4, 0.7],
    "src": ["a", "b", "a"],
})
key = "cliente_id"
dup_mask = df.duplicated(key, keep=False)
quarantine = df.loc[dup_mask].copy()
clean = df.drop_duplicates(key, keep="first")
print("clean", clean.to_dict(orient="list"))
print("quarantine_n", len(quarantine))
print("evidence_cols", quarantine.columns.tolist())`,
        output: `clean {'cliente_id': ['C001', 'C002'], 'score': [0.9, 0.7], 'src': ['a', 'a']}
quarantine_n 2
evidence_cols ['cliente_id', 'score', 'src']`,
      },
      callout: {
        type: "tip",
        title: "Evidencia completa",
        content:
          "La cuarentena debe permitir reconstruir por qué se eligió keep=first u otra regla.",
      },
    },
    {
      heading: "normalización de strings, números, fechas y categorías",
      subtopicId: "S16-T3-A",
      paragraphs: [
        "Strings: strip, casefold/title, espacios dobles. Números: decimal latino, símbolos. Fechas: formatos múltiples. Cats: mapa de sinónimos.",
        "Conserva **raw** en columna lateral si el valor normalizado puede disputarse.",
        "Normalizar ≠ imputar.",
      ],
      code: {
        language: 'python',
        title: "normalize.py",
        code: `import pandas as pd
import re

def norm_money(x):
    if pd.isna(x):
        return None
    s = str(x).strip().replace("S/", "").replace(",", "")
    return float(s)

df = pd.DataFrame({
    "region_raw": [" lima ", "AREQUIPA", "Lima"],
    "monto_raw": ["S/ 10.50", "3,00", "4"],
})
df["region"] = df["region_raw"].str.strip().str.title()
df["monto"] = df["monto_raw"].map(norm_money)
print(df[["region", "monto"]].to_dict(orient="list"))`,
        output: `{'region': ['Lima', 'Arequipa', 'Lima'], 'monto': [10.5, 300.0, 4.0]}`,
      },
      callout: {
        type: "info",
        title: "Raw al lado",
        content:
          "region_raw/monto_raw permiten auditar la normalización.",
      },
    },
    {
      heading: "outliers plausibles vs errores",
      subtopicId: "S16-T3-B",
      paragraphs: [
        "Un outlier **plausible** está lejos estadísticamente pero dentro del dominio (monto alto legítimo). Un **error** viola bounds de negocio (edad 200, lat 999).",
        "IQR/z-score señalan candidatos; **domain bounds** deciden error vs flag.",
        "Flag vs drop: por defecto flag + cuarentena, no drop silencioso.",
      ],
      code: {
        language: 'python',
        title: "outliers.py",
        code: `import pandas as pd
import numpy as np

df = pd.DataFrame({"monto": [10, 12, 11, 13, 5000, -1]})
q1, q3 = df["monto"].quantile(0.25), df["monto"].quantile(0.75)
iqr = q3 - q1
stat = (df["monto"] < q1 - 1.5 * iqr) | (df["monto"] > q3 + 1.5 * iqr)
domain_err = (df["monto"] < 0) | (df["monto"] > 10000)
print("stat_outlier", df.loc[stat, "monto"].tolist())
print("domain_error", df.loc[domain_err, "monto"].tolist())
print("plausible_extreme", df.loc[stat & ~domain_err, "monto"].tolist())`,
        output: `stat_outlier [5000, -1]
domain_error [-1]
plausible_extreme [5000]`,
      },
      callout: {
        type: "warning",
        title: "No drops por IQR solo",
        content:
          "IQR sin dominio borra colas legítimas de negocio.",
      },
    },
    {
      heading: "reglas de schema y cross-field",
      subtopicId: "S16-T4-A",
      paragraphs: [
        "Contrato de **schema**: columnas presentes, dtypes, nullability. **Cross-field**: fecha_fin >= fecha_ini, monto>0 si estado=pagado.",
        "Cada regla devuelve máscara de fallos + código de error.",
        "Ante schema drift (columna faltante/extra), el gate falla con mensaje claro.",
      ],
      code: {
        language: 'python',
        title: "contracts.py",
        code: `import pandas as pd

df = pd.DataFrame({
    "inicio": pd.to_datetime(["2024-01-01", "2024-02-01"]),
    "fin": pd.to_datetime(["2024-01-10", "2024-01-15"]),
    "monto": [10.0, -5.0],
})
expected = {"inicio", "fin", "monto"}
drift = expected - set(df.columns)
cross = df["fin"] < df["inicio"]
neg = df["monto"] < 0
print("drift", list(drift))
print("cross_fail_idx", df.index[cross].tolist())
print("neg_idx", df.index[neg].tolist())`,
        output: `drift []
cross_fail_idx [1]
neg_idx [1]`,
      },
      callout: {
        type: "danger",
        title: "Drift explicable",
        content:
          "Si falta una columna required, el job falla con el nombre de la columna — no con KeyError opaco al final.",
      },
    },
    {
      heading: "métricas, cuarentena y audit trail",
      subtopicId: "S16-T4-B",
      paragraphs: [
        "Métricas: %null, %dup, %fail_schema, filas in/out, filas en cuarentena.",
        "Cuarentena = tabla de filas rechazadas + razón. Audit trail = append-only de eventos.",
        "El gate publica métricas aunque falle.",
      ],
      code: {
        language: 'python',
        title: "quarantine_audit.py",
        code: `import pandas as pd, json

clean = pd.DataFrame({"id": ["C001"], "ok": [True]})
quar = pd.DataFrame({"id": ["C002"], "reason": ["null_required_monto"]})
audit = [
    {"event": "ingest", "n": 2},
    {"event": "quarantine", "n": 1, "reason": "null_required_monto"},
]
metrics = {
    "rows_in": 2,
    "rows_clean": len(clean),
    "rows_quarantine": len(quar),
    "pass": len(quar) == 0,
}
print(json.dumps(metrics, sort_keys=True))
print(audit[-1])`,
        output: `{"pass": false, "rows_clean": 1, "rows_in": 2, "rows_quarantine": 1}
{'event': 'quarantine', 'n': 1, 'reason': 'null_required_monto'}`,
      },
      callout: {
        type: "tip",
        title: "Métricas siempre",
        content:
          "Un fail sin métricas no se puede operar. Emite el reporte aunque el exit code sea != 0.",
      },
    },
  ],
  iDo: {
    intro: "8 demos del quality gate: nulls, imputación, dups, evidencia, normalización, outliers, contratos, audit.",
    steps: [
      {
        demoId: "S16-T1-A-DEMO",
        subtopicId: "S16-T1-A",
        environment: "local-python",
        description: "Aplicar políticas de null por campo y listar violaciones required",
        code: {
          language: 'python',
          title: "demo_null_policy.py",
          code: `import pandas as pd
policy = {"cliente_id": "required", "telefono": "optional", "monto": "required"}
df = pd.DataFrame({
    "cliente_id": ["C001", None, "C003"],
    "telefono": [None, "999", "998"],
    "monto": [1.0, 2.0, None],
})
viol = {c: int(df[c].isna().sum()) for c, p in policy.items() if p == "required" and df[c].isna().any()}
print(viol)
print("optional_nulls", int(df["telefono"].isna().sum()))`,
          output: `{'cliente_id': 1, 'monto': 1}
optional_nulls 1`,
        },
        why: "Required vs optional se traduce en fail/cuarentena vs continuar.",
      },
      {
        demoId: "S16-T1-B-DEMO",
        subtopicId: "S16-T1-B",
        environment: "local-python",
        description: "Imputar mediana solo si null_rate <= cap; marcar indicador",
        code: {
          language: 'python',
          title: "demo_impute.py",
          code: `import pandas as pd
df = pd.DataFrame({"monto": [10.0, None, 12.0, 11.0]})
cap = 0.5
rate = float(df["monto"].isna().mean())
df = df.copy()
df["monto_was_null"] = df["monto"].isna()
if rate <= cap:
    df["monto"] = df["monto"].fillna(df["monto"].median())
    status = "imputed"
else:
    status = "blocked"
print(status, rate, df.to_dict(orient="list"))`,
          output: `imputed 0.25 {'monto': [10.0, 11.0, 12.0, 11.0], 'monto_was_null': [False, True, False, False]}`,
        },
        why: "Cap + indicador evitan imputación masiva silenciosa.",
      },
      {
        demoId: "S16-T2-A-DEMO",
        subtopicId: "S16-T2-A",
        environment: "local-python",
        description: "Detectar duplicados exactos vs conflictos de región por cliente_id",
        code: {
          language: 'python',
          title: "demo_dups.py",
          code: `import pandas as pd
df = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002", "C002", "C003"],
    "region": ["Lima", "Lima", "Cusco", "Arequipa", "Lima"],
    "score": [0.5, 0.5, 0.7, 0.7, 0.9],
})
exact_n = int(df.duplicated(keep=False).sum())
conf = df.groupby("cliente_id").filter(lambda g: g["region"].nunique() > 1)
print("exact_dup_rows", exact_n)
print("conflict_ids", conf["cliente_id"].unique().tolist())`,
          output: `exact_dup_rows 2
conflict_ids ['C002']`,
        },
        why: "Clasificar exacto vs conflicto cambia la acción de limpieza.",
      },
      {
        demoId: "S16-T2-B-DEMO",
        subtopicId: "S16-T2-B",
        environment: "local-python",
        description: "Preservar evidencia en cuarentena al resolver clave duplicada",
        code: {
          language: 'python',
          title: "demo_evidence.py",
          code: `import pandas as pd
df = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002"],
    "score": [0.9, 0.1, 0.5],
    "batch": ["b1", "b2", "b1"],
})
q = df[df.duplicated("cliente_id", keep=False)].copy()
clean = df.drop_duplicates("cliente_id", keep="first")
print("clean_ids", clean["cliente_id"].tolist())
print("quarantine", q.to_dict(orient="list"))`,
          output: `clean_ids ['C001', 'C002']
quarantine {'cliente_id': ['C001', 'C001'], 'score': [0.9, 0.1], 'batch': ['b1', 'b2']}`,
        },
        why: "keep=first solo sobre el set limpio; evidencia completa en cuarentena.",
      },
      {
        demoId: "S16-T3-A-DEMO",
        subtopicId: "S16-T3-A",
        environment: "local-python",
        description: "Normalizar región y montos conservando columnas raw",
        code: {
          language: 'python',
          title: "demo_norm.py",
          code: `import pandas as pd
df = pd.DataFrame({
    "region_raw": [" lima", "AREQUIPA "],
    "monto_raw": ["S/12.5", "3.0"],
})
df["region"] = df["region_raw"].str.strip().str.title()
df["monto"] = (
    df["monto_raw"].str.replace("S/", "", regex=False).str.strip().astype(float)
)
print(df.to_dict(orient="list"))`,
          output: `{'region_raw': [' lima', 'AREQUIPA '], 'monto_raw': ['S/12.5', '3.0'], 'region': ['Lima', 'Arequipa'], 'monto': [12.5, 3.0]}`,
        },
        why: "Raw + normalizado permite disputar transformaciones.",
      },
      {
        demoId: "S16-T3-B-DEMO",
        subtopicId: "S16-T3-B",
        environment: "local-python",
        description: "Clasificar outlier estadístico vs error de dominio en montos",
        code: {
          language: 'python',
          title: "demo_outliers.py",
          code: `import pandas as pd
s = pd.Series([5, 6, 7, 6, 1000, -3])
q1, q3 = s.quantile(0.25), s.quantile(0.75)
iqr = q3 - q1
stat = (s < q1 - 1.5 * iqr) | (s > q3 + 1.5 * iqr)
domain_err = (s < 0) | (s > 1e6)
print("stat", s[stat].tolist())
print("error", s[domain_err].tolist())
print("plausible", s[stat & ~domain_err].tolist())`,
          output: `stat [1000, -3]
error [-3]
plausible [1000]`,
        },
        why: "Dominio manda sobre IQR para etiquetar error.",
      },
      {
        demoId: "S16-T4-A-DEMO",
        subtopicId: "S16-T4-A",
        environment: "local-python",
        description: "Validar schema required y regla cross-field fin>=inicio",
        code: {
          language: 'python',
          title: "demo_schema_rules.py",
          code: `import pandas as pd
df = pd.DataFrame({
    "inicio": pd.to_datetime(["2024-01-01", "2024-05-01"]),
    "fin": pd.to_datetime(["2024-02-01", "2024-04-01"]),
    "monto": [10.0, 20.0],
})
required = ["inicio", "fin", "monto"]
missing = [c for c in required if c not in df.columns]
cross_fail = df.index[df["fin"] < df["inicio"]].tolist()
print("missing", missing, "cross_fail", cross_fail)`,
          output: `missing [] cross_fail [1]`,
        },
        why: "Schema + cross-field forman el contrato del quality gate.",
      },
      {
        demoId: "S16-T4-B-DEMO",
        subtopicId: "S16-T4-B",
        environment: "local-python",
        description: "Cuarentenar fallos con métricas y audit trail append-only",
        code: {
          language: 'python',
          title: "demo_audit.py",
          code: `import json
rows_in = 5
quarantine = [{"id": "C002", "reason": "schema_drift"}, {"id": "C004", "reason": "domain_error"}]
clean_n = rows_in - len(quarantine)
audit = []
audit.append({"event": "start", "rows_in": rows_in})
audit.append({"event": "quarantine", "n": len(quarantine)})
metrics = {"rows_in": rows_in, "rows_clean": clean_n, "rows_quarantine": len(quarantine), "pass": False}
print(json.dumps(metrics, sort_keys=True))
print(len(audit), audit[-1]["event"])`,
          output: `{"pass": false, "rows_clean": 3, "rows_in": 5, "rows_quarantine": 2}
2 quarantine`,
        },
        why: "Métricas + audit permiten operar el gate aunque falle.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios E1/E2/E3 de calidad y contratos. Dos pistas cada uno.",
    steps: [
      {
        id: "S16-T1-A-E1",
        subtopicId: "S16-T1-A",
        kind: "guided",
        instruction:
          "Dado policy required en 'id', cuenta nulls de id e imprime el entero.",
        hint: "isna().sum().",
        hints: [
          "isna().sum().",
          "int(...).",
        ],
        edgeCases: ["contar filas", "fillna antes"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({'id':['C001', None]})
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"id": ["C001", None]})
print(int(df["id"].isna().sum()))`,
          output: `1`,
        },
      },
      {
        id: "S16-T1-A-E2",
        subtopicId: "S16-T1-A",
        kind: "independent",
        instruction:
          "Construye dict de violaciones solo para campos required con nulls.",
        hint: "Itera policy.",
        hints: [
          "Itera policy.",
          "Incluye solo n>0 required.",
        ],
        edgeCases: ["incluir optional", "n=0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
policy={'a':'required','b':'optional'}
df=pd.DataFrame({'a':[1,None],'b':[None,2]})
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
policy = {"a": "required", "b": "optional"}
df = pd.DataFrame({"a": [1, None], "b": [None, 2]})
viol = {c: int(df[c].isna().sum()) for c, p in policy.items() if p == "required" and df[c].isna().any()}
print(viol)`,
          output: `{'a': 1}`,
        },
      },
      {
        id: "S16-T1-A-E3",
        subtopicId: "S16-T1-A",
        kind: "transfer",
        instruction:
          "Imprime 'fail' si hay violaciones required, si no 'pass'.",
        hint: "Usa el dict viol.",
        hints: [
          "Usa el dict viol.",
          "Mensaje corto.",
        ],
        edgeCases: ["siempre pass", "ignorar null"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"id": [None]})
viol = {"id": int(df["id"].isna().sum())} if df["id"].isna().any() else {}
print("fail" if viol else "pass")`,
          output: `fail`,
        },
      },
      {
        id: "S16-T1-B-E1",
        subtopicId: "S16-T1-B",
        kind: "guided",
        instruction:
          "Crea columna was_null booleana antes de fillna(0) sobre monto; imprime was_null list.",
        hint: "was_null = isna.",
        hints: [
          "was_null = isna.",
          "luego fillna.",
        ],
        edgeCases: ["indicador después de fill", "perder señal"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df=pd.DataFrame({'monto':[1.0, None]})
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"monto": [1.0, None]})
df["was_null"] = df["monto"].isna()
df["monto"] = df["monto"].fillna(0.0)
print(df["was_null"].tolist())`,
          output: `[False, True]`,
        },
      },
      {
        id: "S16-T1-B-E2",
        subtopicId: "S16-T1-B",
        kind: "independent",
        instruction:
          "Si null_rate > 0.3 imprime 'blocked', si no 'ok'. Fixture 2 de 4 null.",
        hint: "mean de isna.",
        hints: [
          "mean de isna.",
          "cap 0.3.",
        ],
        edgeCases: ["cap inclusivo confuso", "contar no rate"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
s = pd.Series([1.0, None, None, 2.0])
rate = s.isna().mean()
print("blocked" if rate > 0.3 else "ok")`,
          output: `blocked`,
        },
      },
      {
        id: "S16-T1-B-E3",
        subtopicId: "S16-T1-B",
        kind: "transfer",
        instruction:
          "Imputa mediana y muestra que la mediana de no-null no cambia tras fill de un solo null en [1,2,None].",
        hint: "median skipna.",
        hints: [
          "median skipna.",
          "fillna(median).",
        ],
        edgeCases: ["mean vs median", "fillna 0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
s = pd.Series([1.0, 2.0, None])
med = s.median()
filled = s.fillna(med)
print(float(med), filled.tolist())`,
          output: `1.5 [1.0, 2.0, 1.5]`,
        },
      },
      {
        id: "S16-T2-A-E1",
        subtopicId: "S16-T2-A",
        kind: "guided",
        instruction:
          "Cuenta filas marcadas por duplicated(keep=False) en un DF con una fila exacta repetida.",
        hint: "duplicated(keep=False).sum().",
        hints: [
          "duplicated(keep=False).sum().",
          "Dos filas exactas → 2.",
        ],
        edgeCases: ["keep='first' cuenta 1", "solo subset cols"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"a": [1, 1, 2], "b": [0, 0, 9]})
print(int(df.duplicated(keep=False).sum()))`,
          output: `2`,
        },
      },
      {
        id: "S16-T2-A-E2",
        subtopicId: "S16-T2-A",
        kind: "independent",
        instruction:
          "Detecta cliente_id con más de una región distinta; imprime lista de ids en conflicto.",
        hint: "groupby nunique > 1.",
        hints: [
          "groupby nunique > 1.",
          "unique ids.",
        ],
        edgeCases: ["duplicated exacto solo", "filter mal"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001", "C001", "C002"], "region": ["Lima", "Cusco", "Lima"]})
ids = df.groupby("cliente_id")["region"].nunique()
print(ids[ids > 1].index.tolist())`,
          output: `['C001']`,
        },
      },
      {
        id: "S16-T2-A-E3",
        subtopicId: "S16-T2-A",
        kind: "transfer",
        instruction:
          "Clasifica: si exact dup print 'exact', elif conflicto región print 'conflict', else 'clean' para id C001 en fixture de una fila.",
        hint: "Lógica en orden.",
        hints: [
          "Lógica en orden.",
          "Fixture simple.",
        ],
        edgeCases: ["orden de if", "sin filtrar id"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001"], "region": ["Lima"], "score": [1.0]})
sub = df[df.cliente_id == "C001"]
if sub.duplicated(keep=False).any() and sub.duplicated(keep=False).all():
    print("exact")
elif sub["region"].nunique() > 1:
    print("conflict")
else:
    print("clean")`,
          output: `clean`,
        },
      },
      {
        id: "S16-T2-B-E1",
        subtopicId: "S16-T2-B",
        kind: "guided",
        instruction:
          "Separa quarantine (dup key keep=False) y clean drop_duplicates keep first; imprime lens.",
        hint: "duplicated(key, keep=False).",
        hints: [
          "duplicated(key, keep=False).",
          "drop_duplicates.",
        ],
        edgeCases: ["perder q", "keep last sin documentar"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df=pd.DataFrame({'id':['a','a','b'], 'v':[1,2,3]})
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"id": ["a", "a", "b"], "v": [1, 2, 3]})
q = df[df.duplicated("id", keep=False)]
c = df.drop_duplicates("id", keep="first")
print(len(q), len(c))`,
          output: `2 2`,
        },
      },
      {
        id: "S16-T2-B-E2",
        subtopicId: "S16-T2-B",
        kind: "independent",
        instruction:
          "Asegura que quarantine conserve columna batch de evidencia; imprime columns del q.",
        hint: "copy del mask.",
        hints: [
          "copy del mask.",
          "No dropear cols.",
        ],
        edgeCases: ["solo id", "sin batch"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"id": ["a", "a"], "batch": ["b1", "b2"]})
q = df[df.duplicated("id", keep=False)].copy()
print(q.columns.tolist())`,
          output: `['id', 'batch']`,
        },
      },
      {
        id: "S16-T2-B-E3",
        subtopicId: "S16-T2-B",
        kind: "transfer",
        instruction:
          "Imprime 'card_ok' si nunique(id)==len(df) en un DF sin dups de clave.",
        hint: "cardinalidad 1:1.",
        hints: [
          "cardinalidad 1:1.",
          "Comparar nunique y len.",
        ],
        edgeCases: ["nunique dropna", "comparar con nunique cols"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"id": ["a", "b"], "v": [1, 2]})
print("card_ok" if df["id"].nunique() == len(df) else "card_bad")`,
          output: `card_ok`,
        },
      },
      {
        id: "S16-T3-A-E1",
        subtopicId: "S16-T3-A",
        kind: "guided",
        instruction:
          "strip + title sobre [' lima ','CUSCO']; imprime lista.",
        hint: "str.strip().str.title().",
        hints: [
          "str.strip().str.title().",
          "Series string methods.",
        ],
        edgeCases: ["solo lower", "sin strip"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
s = pd.Series([" lima ", "CUSCO"])
print(s.str.strip().str.title().tolist())`,
          output: `['Lima', 'Cusco']`,
        },
      },
      {
        id: "S16-T3-A-E2",
        subtopicId: "S16-T3-A",
        kind: "independent",
        instruction:
          "Quita prefijo 'S/' y castea float en ['S/1.5','S/2']; imprime suma.",
        hint: "str.replace.",
        hints: [
          "str.replace.",
          "astype float.",
        ],
        edgeCases: ["regex mal", "dejar S/"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
s = pd.Series(["S/1.5", "S/2"])
v = s.str.replace("S/", "", regex=False).astype(float)
print(float(v.sum()))`,
          output: `3.5`,
        },
      },
      {
        id: "S16-T3-A-E3",
        subtopicId: "S16-T3-A",
        kind: "transfer",
        instruction:
          "Conserva raw: crea region desde region_raw y verifica que region_raw sigue igual.",
        hint: "Nueva col no pisa raw.",
        hints: [
          "Nueva col no pisa raw.",
          "print both.",
        ],
        edgeCases: ["overwrite raw", "drop raw"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"region_raw": ["lima"]})
df["region"] = df["region_raw"].str.title()
print(df["region_raw"].tolist(), df["region"].tolist())`,
          output: `['lima'] ['Lima']`,
        },
      },
      {
        id: "S16-T3-B-E1",
        subtopicId: "S16-T3-B",
        kind: "guided",
        instruction:
          "Marca domain_error si monto < 0; imprime lista booleana.",
        hint: "s < 0.",
        hints: [
          "s < 0.",
          "tolist.",
        ],
        edgeCases: ["usar abs", "IQR only"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
s = pd.Series([1.0, -2.0, 3.0])
print((s < 0).tolist())`,
          output: `[False, True, False]`,
        },
      },
      {
        id: "S16-T3-B-E2",
        subtopicId: "S16-T3-B",
        kind: "independent",
        instruction:
          "Dado [1,2,3,100], usa IQR 1.5 y lista valores stat-outlier.",
        hint: "quantile 0.25/0.75.",
        hints: [
          "quantile 0.25/0.75.",
          "fence q1-1.5iqr.",
        ],
        edgeCases: ["std z confuso", "dropear sin listar"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
s = pd.Series([1.0, 2.0, 3.0, 100.0])
q1, q3 = s.quantile(0.25), s.quantile(0.75)
iqr = q3 - q1
mask = (s < q1 - 1.5 * iqr) | (s > q3 + 1.5 * iqr)
print(s[mask].tolist())`,
          output: `[100.0]`,
        },
      },
      {
        id: "S16-T3-B-E3",
        subtopicId: "S16-T3-B",
        kind: "transfer",
        instruction:
          "Etiqueta 'error' si domain, 'flag' si solo stat, 'ok' else para valor -1 en [1,2,-1].",
        hint: "Prioriza error.",
        hints: [
          "Prioriza error.",
          "Una fila simple.",
        ],
        edgeCases: ["flag en error", "drop"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
s = pd.Series([1.0, 2.0, -1.0])
val = s.iloc[2]
label = "error" if val < 0 else "ok"
print(label)`,
          output: `error`,
        },
      },
      {
        id: "S16-T4-A-E1",
        subtopicId: "S16-T4-A",
        kind: "guided",
        instruction:
          "Lista columnas required faltantes respecto a ['id','monto'] en DF solo con id.",
        hint: "list comprehension.",
        hints: [
          "list comprehension.",
          "not in columns.",
        ],
        edgeCases: ["extra cols como fail", "set silent"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"id": [1]})
required = ["id", "monto"]
print([c for c in required if c not in df.columns])`,
          output: `['monto']`,
        },
      },
      {
        id: "S16-T4-A-E2",
        subtopicId: "S16-T4-A",
        kind: "independent",
        instruction:
          "Encuentra índices donde fin < inicio.",
        hint: "máscara datetime.",
        hints: [
          "máscara datetime.",
          "index[mask].tolist().",
        ],
        edgeCases: ["string compare", "sin parse dates"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({
    "inicio": pd.to_datetime(["2024-01-01", "2024-06-01"]),
    "fin": pd.to_datetime(["2024-02-01", "2024-05-01"]),
})
print(df.index[df["fin"] < df["inicio"]].tolist())`,
          output: `[1]`,
        },
      },
      {
        id: "S16-T4-A-E3",
        subtopicId: "S16-T4-A",
        kind: "transfer",
        instruction:
          "Si missing cols: print 'drift'; else print 'schema_ok'.",
        hint: "Usa lista missing.",
        hints: [
          "Usa lista missing.",
          "Mensajes fijos.",
        ],
        edgeCases: ["siempre ok", "KeyError sin mensaje"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"id": [1]})
missing = [c for c in ["id", "monto"] if c not in df.columns]
print("drift" if missing else "schema_ok")`,
          output: `drift`,
        },
      },
      {
        id: "S16-T4-B-E1",
        subtopicId: "S16-T4-B",
        kind: "guided",
        instruction:
          "Dado rows_in=10 y quarantine_n=3, imprime rows_clean.",
        hint: "resta simple.",
        hints: [
          "resta simple.",
          "int.",
        ],
        edgeCases: ["porcentaje", "no restar"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
rows_in=10
q=3
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows_in = 10
q = 3
print(rows_in - q)`,
          output: `7`,
        },
      },
      {
        id: "S16-T4-B-E2",
        subtopicId: "S16-T4-B",
        kind: "independent",
        instruction:
          "Append evento quarantine a audit list e imprime len(audit).",
        hint: "audit.append.",
        hints: [
          "audit.append.",
          "lista previa con start.",
        ],
        edgeCases: ["overwrite", "dict mutación rara"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `audit=[{'event':'start'}]
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `audit = [{"event": "start"}]
audit.append({"event": "quarantine", "n": 2})
print(len(audit))`,
          output: `2`,
        },
      },
      {
        id: "S16-T4-B-E3",
        subtopicId: "S16-T4-B",
        kind: "transfer",
        instruction:
          "metrics pass=False si quarantine>0; imprime pass boolean para n_q=1.",
        hint: "pass = n_q==0.",
        hints: [
          "pass = n_q==0.",
          "json opcional.",
        ],
        edgeCases: ["pass True con q", "omitir métrica"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `n_q = 1
metrics = {"pass": n_q == 0, "rows_quarantine": n_q}
print(metrics["pass"])`,
          output: `False`,
        },
      },
    ],
  },
  youDo: {
    title: "Quality gate explicable ante schema drift",
    context:
      "Implementa una suite de checks sobre un dataset sintético de clientes/transacciones: null policies, duplicados con evidencia, normalización, outliers, contratos cross-field, cuarentena y audit trail. Nunca arregles silenciosamente un dato.",
    objectives: [
      "Suite de checks que falla explicablemente ante drift",
      "Cuantificar pérdida de filas/campos",
      "Nunca arreglar silenciosamente un dato",
      "Cuarentena + audit trail sintético",
    ],
    requirements: [
      "Fixtures sintéticos",
      "Demo reproducible",
      "Documentación en español profesional",
      "Alineación a CP-N2-A (quality)",
    ],
    starterCode: `import pandas as pd

def run_quality_gate(df: pd.DataFrame, schema: dict) -> dict:
    """Retorna metrics + quarantine. No muta df sin audit."""
    # TODO
    raise NotImplementedError

if __name__ == "__main__":
    df = pd.DataFrame({"cliente_id": ["C001", None], "monto": [10.0, -1.0]})
    print(run_quality_gate(df, {"cliente_id": "required", "monto": "required"}))
`,
    portfolioNote:
      "El gate debe emitir métricas incluso cuando pass=False.",
    rubric: [
      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
      { criterion: "Código legible y límites claros", weight: "10%" },
      { criterion: "Documentación en español profesional", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "Un campo required con null debe:",
        options: [
          "Rellenarse siempre con 0",
          "Generar violación/cuarentena o fail del gate",
          "Ignorarse",
          "Convertirse en category",
        ],
        correctIndex: 1,
        explanation:
          "Required no se imputa en silencio.",
      },
      {
        question: "Conflicto de duplicados significa:",
        options: [
          "Misma clave con atributos distintos",
          "Siempre filas idénticas",
          "Solo NaNs",
          "Schema drift de columnas",
        ],
        correctIndex: 0,
        explanation:
          "Conflicto = misma key, valores distintos.",
      },
      {
        question: "La cuarentena debe:",
        options: [
          "Borrar evidencia",
          "Conservar filas rechazadas con razón",
          "Enviarse a producción sin marca",
          "Imputar siempre",
        ],
        correctIndex: 1,
        explanation:
          "Evidencia + razón habilitan auditoría.",
      },
      {
        question: "Ante schema drift (columna required faltante):",
        options: [
          "Continuar con defaults ocultos",
          "Fallar de forma explicable con el nombre de la columna",
          "Inventar la columna con random",
          "Silenciar logs",
        ],
        correctIndex: 1,
        explanation:
          "Fail explicable es el estándar del gate V3.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "pandas missing data",
        url: "https://pandas.pydata.org/docs/user_guide/missing_data.html",
        note: "NA handling",
      },
      {
        label: "Great Expectations (concepts)",
        url: "https://greatexpectations.io/docs/",
        note: "Inspiración de contratos",
      },
    ],
    books: [
      {
        label: "Data Quality / analytics eng. practices",
        note: "Contratos y métricas operativas",
      },
    ],
    courses: [
      {
        label: "pandas user guide",
        url: "https://pandas.pydata.org/docs/user_guide/index.html",
        note: "Limpieza",
      },
    ],
  },
}
