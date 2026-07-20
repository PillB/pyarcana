import type { CourseSection } from '../../types'

export const section15: CourseSection = {
  id: "stdlib-deep",
  index: 15,
  title: "Pandas: ingesta, selección y tipos",
  shortTitle: "Pandas ingesta",
  tagline: "ingesta tipada de clientes/transacciones con reporte de coerciones y reconciliación de filas/columnas",
  estimatedHours: 12,
  level: "Competente",
  phase: 1,
  icon: "Settings",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "La **ingesta tipada con Pandas** es el día a día de analistas en banca y retail en Perú: CSV/Excel de clientes y transacciones, dtypes controlados y export reproducible. Esta sección (id `stdlib-deep` conservado) retematiza a V3 e incrementa **CP-N2-A (dataset)** con fixtures sintéticos.",
  learningOutcomes: [
    { text: "Modelar Series/DataFrame con Index estable" },
    { text: "Leer CSV/Excel con parser y dtypes controlados" },
    { text: "Seleccionar con loc/iloc y assign de forma idiomática" },
    { text: "Evitar chained assignment y controlar copias" },
    { text: "Tipar strings, nullable, fechas y categorías" },
    { text: "Aplicar coerción explícita con schema y reporte" },
    { text: "Exportar a CSV/Excel (y contrato Parquet) de forma reproducible" },
    { text: "Documentar índices, provenance y uso de memoria" },
  ],
  theory: [
    {
      heading: "De “stdlib profunda” a Pandas ingesta (mapa de la sección)",
      paragraphs: [
        "En V3, **S15 no es el path principal de contextlib, functools, descriptors ni typing avanzado**. Ese material se reubica. Aquí construyes el **dataset de CP-N2-A**: Series/DataFrame, lectura tipada, selección, tipos nullable, coerción con schema y export con provenance.",
        "Hilo: **clientes y transacciones sintéticas** (Lima/Arequipa, montos en PEN, ids C00x/T00x). Sin PII real.",
        "Orden: **T1 Modelo/lectura** → **T2 Selección** → **T3 Tipos** → **T4 Exportación**.",
      ],
      callout: {
        type: "info",
        title: "Contenido reubicado conceptualmente",
        content:
          "Material legado de stdlib avanzada **no es el camino V3 en S15**. Target: Pandas ingesta tipada para CP-N2-A.",
      },
    },
    {
      heading: "Series/DataFrame/index",
      subtopicId: "S15-T1-A",
      paragraphs: [
        "Una **Series** es un vector con **Index**; un **DataFrame** es una tabla de columnas (Series alineadas por Index).",
        "Un Index **estable** (ids de negocio) facilita joins y auditoría. `reset_index` / `set_index` cambian el eje de etiqueta.",
        "MultiIndex se introduce como etiquetas jerárquicas (región, mes); se profundiza en S17.",
      ],
      code: {
        language: 'python',
        title: "series_df.py",
        code: `import pandas as pd

s = pd.Series([0.9, 0.4], index=["C001", "C002"], name="score")
df = pd.DataFrame({
    "cliente_id": ["C001", "C002", "C003"],
    "region": ["Lima", "Arequipa", "Lima"],
    "score": [0.9, 0.4, 0.7],
}).set_index("cliente_id")
print(s.loc["C001"])
print(df.index.tolist())
print(df.dtypes.to_dict())`,
        output: `0.9
['C001', 'C002', 'C003']
{'region': dtype('O'), 'score': dtype('float64')}`,
      },
      callout: {
        type: "tip",
        title: "Index de negocio",
        content:
          "Prefiere ids estables (cliente_id) como index cuando el pipeline reindexa o alinea tablas.",
      },
    },
    {
      heading: "lectura CSV/Excel y opciones de parser",
      subtopicId: "S15-T1-B",
      paragraphs: [
        "`read_csv` y `read_excel` aceptan `dtype`, `parse_dates`, `na_values`, `usecols`. Controlar el parser evita object-dtypes silenciosos.",
        "Separe decimal (`,` vs `.`) y encoding (`utf-8`) en datasets latinos. Excel requiere motor (`openpyxl`).",
        "Siempre reconcilia **filas leídas vs esperadas** y lista columnas.",
      ],
      code: {
        language: 'python',
        title: "read_csv_opts.py",
        code: `import pandas as pd
from io import StringIO

csv = "cliente_id,monto,fecha\\nC001,10.5,2024-01-15\\nC002,NA,2024-02-01\\n"
df = pd.read_csv(
    StringIO(csv),
    dtype={"cliente_id": "string"},
    parse_dates=["fecha"],
    na_values=["NA", ""],
)
print(df.dtypes.astype(str).to_dict())
print(df["monto"].isna().tolist())
print(len(df))`,
        output: `{'cliente_id': 'string', 'monto': 'float64', 'fecha': 'datetime64[ns]'}
[False, True]
2`,
      },
      callout: {
        type: "warning",
        title: "dtype sin parse_dates",
        content:
          "Fechas como string rompen filtros temporales. Declara parse_dates o convierte con to_datetime.",
      },
    },
    {
      heading: "loc/iloc, filtros y assign",
      subtopicId: "S15-T2-A",
      paragraphs: [
        "**loc** etiqueta; **iloc** posición. Filtros booleanos: `df.loc[df.score < 0.5, cols]`.",
        "`assign` devuelve un DF con columnas nuevas sin romper el pipeline funcional.",
        "`query` es legible para filtros simples; para producción muchos equipos prefieren máscaras explícitas.",
      ],
      code: {
        language: 'python',
        title: "loc_assign.py",
        code: `import pandas as pd

df = pd.DataFrame({
    "cliente_id": ["C001", "C002", "C003"],
    "score": [0.9, 0.3, 0.6],
    "region": ["Lima", "Lima", "Cusco"],
})
sub = df.loc[df["score"] < 0.5, ["cliente_id", "score"]]
out = df.assign(score_pct=lambda x: x["score"] * 100)
print(sub.to_dict(orient="list"))
print(out["score_pct"].tolist())
print(df.iloc[0, 0])`,
        output: `{'cliente_id': ['C002'], 'score': [0.3]}
[90.0, 30.0, 60.0]
C001`,
      },
      callout: {
        type: "tip",
        title: "loc para etiquetas",
        content:
          "Evita df[cols][rows] encadenado: usa un solo loc.",
      },
    },
    {
      heading: "chained assignment y copy semantics",
      subtopicId: "S15-T2-B",
      paragraphs: [
        "**SettingWithCopyWarning** aparece al asignar sobre un slice que puede ser view o copy. El resultado es impredecible.",
        "Patrón seguro: `df = df.copy()` tras filtrar, o asignar con `.loc[row_mask, col] = valor` sobre el DF padre.",
        "En pipelines, prefiere métodos que devuelven nuevo objeto (`assign`, `where`) y documenta copias.",
      ],
      code: {
        language: 'python',
        title: "no_chain.py",
        code: `import pandas as pd

df = pd.DataFrame({"score": [0.1, 0.9, 0.4]})
# seguro: loc sobre el original
df.loc[df["score"] < 0.5, "flag"] = "bajo"
# seguro: copy explícita para trabajar un subset
bajo = df.loc[df["score"] < 0.5].copy()
bajo["revisado"] = True
print(df[["score", "flag"]].to_dict(orient="list"))
print(bajo["revisado"].tolist())`,
        output: `{'score': [0.1, 0.9, 0.4], 'flag': ['bajo', nan, 'bajo']}
[True, True]`,
      },
      callout: {
        type: "danger",
        title: "Chained assignment",
        content:
          "Nunca hagas df[df.a>0]['b'] = 1. Usa loc o copy explícita.",
      },
    },
    {
      heading: "strings, nullable, fechas y categorías",
      subtopicId: "S15-T3-A",
      paragraphs: [
        "dtypes **string**, **Int64**/**boolean** nullable, **datetime64** y **category** reducen memoria y errores.",
        "Convierte con `astype('string')`, `pd.to_numeric(..., errors=)`, `pd.to_datetime`, `astype('category')`.",
        "Reporta cuántos valores no convirtieron (NaN introducidos).",
      ],
      code: {
        language: 'python',
        title: "types.py",
        code: `import pandas as pd

df = pd.DataFrame({
    "region": ["Lima", "arequipa", "Lima"],
    "monto": ["10", "x", "3.5"],
    "fecha": ["2024-01-01", "2024-02-01", "bad"],
})
df["region"] = df["region"].str.title().astype("category")
df["monto_num"] = pd.to_numeric(df["monto"], errors="coerce")
df["fecha_dt"] = pd.to_datetime(df["fecha"], errors="coerce")
print(df.dtypes.astype(str).to_dict())
print("monto_na", int(df["monto_num"].isna().sum()), "fecha_na", int(df["fecha_dt"].isna().sum()))`,
        output: `{'region': 'category', 'monto': 'object', 'fecha': 'object', 'monto_num': 'float64', 'fecha_dt': 'datetime64[ns]'}
monto_na 1 fecha_na 1`,
      },
      callout: {
        type: "tip",
        title: "errors='coerce'",
        content:
          "Coercionar a NaN es preferible a fallar todo el lote si documentas el conteo de fallos.",
      },
    },
    {
      heading: "coerción explícita y schema",
      subtopicId: "S15-T3-B",
      paragraphs: [
        "Un **schema dict** declara tipos objetivo por columna. `astype` / `to_numeric` aplican coerción; los fallos se listan.",
        "No “arregles” silenciosamente: emite un reporte `{columna: n_fallos}`.",
        "Este reporte alimenta el quality gate de S16.",
      ],
      code: {
        language: 'python',
        title: "schema_coerce.py",
        code: `import pandas as pd

schema = {"cliente_id": "string", "monto": "float64"}
raw = pd.DataFrame({"cliente_id": ["C001", "C002"], "monto": ["10.5", "N/A"]})
report = {}
df = raw.copy()
df["cliente_id"] = df["cliente_id"].astype("string")
before_na = df["monto"].isna().sum()
df["monto"] = pd.to_numeric(df["monto"], errors="coerce")
report["monto"] = int(df["monto"].isna().sum() - before_na)
print(df.dtypes.astype(str).to_dict())
print("coercion_report", report)`,
        output: `{'cliente_id': 'string', 'monto': 'float64'}
coercion_report {'monto': 1}`,
      },
      callout: {
        type: "warning",
        title: "Schema es contrato",
        content:
          "Si falta una columna del schema, falla explicable — no inventes defaults ocultos.",
      },
    },
    {
      heading: "CSV / Excel y contrato Parquet",
      subtopicId: "S15-T4-A",
      paragraphs: [
        "`to_csv`, `to_excel` exportan tablas. Parquet (pyarrow/fastparquet) preserva tipos; si el motor no está, exporta CSV + **schema JSON** como contrato.",
        "Usa `index=False` salvo que el index sea clave de negocio documentada.",
        "Verifica columnas críticas post-export con round-trip.",
      ],
      code: {
        language: 'python',
        title: "export.py",
        code: `import pandas as pd
from io import StringIO, BytesIO

df = pd.DataFrame({"cliente_id": ["C001"], "monto": [10.5], "region": ["Lima"]})
buf = StringIO()
df.to_csv(buf, index=False)
buf.seek(0)
back = pd.read_csv(buf)
print(back.columns.tolist())
# Excel en memoria
bio = BytesIO()
df.to_excel(bio, index=False, engine="openpyxl")
print("excel_bytes", len(bio.getvalue()) > 0)
# Contrato parquet (schema) sin motor
schema = {c: str(df[c].dtype) for c in df.columns}
print("parquet_contract", schema)`,
        output: `['cliente_id', 'monto', 'region']
excel_bytes True
parquet_contract {'cliente_id': 'object', 'monto': 'float64', 'region': 'object'}`,
      },
      callout: {
        type: "info",
        title: "Parquet opcional",
        content:
          "En este entorno puede no haber pyarrow: el contrato de tipos + CSV/Excel cubre el aprendizaje de export reproducible.",
      },
    },
    {
      heading: "índices, formatos, provenance y memoria",
      subtopicId: "S15-T4-B",
      paragraphs: [
        "Un **manifest** registra filas, columnas, dtypes, `memory_usage` y provenance (fuente, timestamp, hash simple).",
        "`index=False` en export evita columnas `Unnamed` al reingestar.",
        "Documenta el uso de memoria antes/después de castear a category/string.",
      ],
      code: {
        language: 'python',
        title: "manifest.py",
        code: `import pandas as pd
import hashlib, json

df = pd.DataFrame({"cliente_id": ["C001", "C002"], "monto": [1.0, 2.0]})
payload = df.to_csv(index=False).encode()
manifest = {
    "rows": len(df),
    "columns": df.columns.tolist(),
    "dtypes": {c: str(t) for c, t in df.dtypes.items()},
    "memory_bytes": int(df.memory_usage(deep=True).sum()),
    "source": "synthetic_clientes_v1",
    "content_sha1": hashlib.sha1(payload).hexdigest()[:12],
}
print(json.dumps(manifest, sort_keys=True))`,
        output: `{"columns": ["cliente_id", "monto"], "content_sha1": "28a4b0f9b48e", "dtypes": {"cliente_id": "object", "monto": "float64"}, "memory_bytes": 266, "rows": 2, "source": "synthetic_clientes_v1"}`,
      },
      callout: {
        type: "tip",
        title: "Provenance mínima",
        content:
          "source + filas + hash del artefacto bastan para reconciliar ingesta en CP-N2-A.",
      },
    },
  ],
  iDo: {
    intro: "8 demos de modelo, lectura, loc/assign, copias, tipos, schema, export y manifest.",
    steps: [
      {
        demoId: "S15-T1-A-DEMO",
        subtopicId: "S15-T1-A",
        environment: "local-python",
        description: "Construir DataFrame de clientes con Index estable y dtypes claros",
        code: {
          language: 'python',
          title: "demo_df_index.py",
          code: `import pandas as pd

df = pd.DataFrame({
    "cliente_id": ["C001", "C002", "C003"],
    "region": ["Lima", "Arequipa", "Cusco"],
    "score": [0.91, 0.42, 0.77],
})
df = df.set_index("cliente_id")
df["score"] = df["score"].astype("float64")
print(df.index.name, df.index.tolist())
print(df.loc["C002", "region"], float(df.loc["C002", "score"]))`,
          output: `cliente_id ['C001', 'C002', 'C003']
Arequipa 0.42`,
        },
        why: "Index de negocio alinea tablas de clientes y transacciones.",
      },
      {
        demoId: "S15-T1-B-DEMO",
        subtopicId: "S15-T1-B",
        environment: "local-python",
        description: "Ingerir CSV sintético con dtype, parse_dates y na_values",
        code: {
          language: 'python',
          title: "demo_read_csv.py",
          code: `import pandas as pd
from io import StringIO

raw = """cliente_id;monto;fecha
C001;15,50;2024-03-01
C002;;2024-03-02
C003;20.0;2024-03-03
"""
# normalizamos decimal latino a punto para el parser
text = raw.replace(",", ".")
df = pd.read_csv(
    StringIO(text),
    sep=";",
    dtype={"cliente_id": "string"},
    parse_dates=["fecha"],
    na_values=["", "NA"],
)
print(len(df), df["monto"].isna().sum())
print(str(df["fecha"].dtype))
print(df["cliente_id"].tolist())`,
          output: `3 1
datetime64[ns]
['C001', 'C002', 'C003']`,
        },
        why: "Parser explícito evita monedas/fechas como object opaco.",
      },
      {
        demoId: "S15-T2-A-DEMO",
        subtopicId: "S15-T2-A",
        environment: "local-python",
        description: "Seleccionar filas Lima y asignar columna de riesgo derivada",
        code: {
          language: 'python',
          title: "demo_loc.py",
          code: `import pandas as pd

df = pd.DataFrame({
    "cliente_id": ["C001", "C002", "C003", "C004"],
    "region": ["Lima", "Arequipa", "Lima", "Lima"],
    "score": [0.9, 0.4, 0.3, 0.8],
})
lima = df.loc[df["region"] == "Lima"].copy()
out = lima.assign(riesgo=lambda x: (x["score"] < 0.5).map({True: "alto", False: "bajo"}))
print(out[["cliente_id", "score", "riesgo"]].to_dict(orient="list"))`,
          output: `{'cliente_id': ['C001', 'C003', 'C004'], 'score': [0.9, 0.3, 0.8], 'riesgo': ['bajo', 'alto', 'bajo']}`,
        },
        why: "loc + assign mantienen pipelines legibles y testeables.",
      },
      {
        demoId: "S15-T2-B-DEMO",
        subtopicId: "S15-T2-B",
        environment: "local-python",
        description: "Evitar chained assignment: flag seguro con loc y subset con copy",
        code: {
          language: 'python',
          title: "demo_copy.py",
          code: `import pandas as pd

df = pd.DataFrame({"id": ["C001", "C002", "C003"], "score": [0.2, 0.9, 0.4]})
df.loc[df["score"] < 0.5, "estado"] = "revisar"
subset = df.loc[df["estado"] == "revisar"].copy()
subset["owner"] = "dq_team"
print(df.to_dict(orient="list"))
print(subset[["id", "owner"]].to_dict(orient="list"))`,
          output: `{'id': ['C001', 'C002', 'C003'], 'score': [0.2, 0.9, 0.4], 'estado': ['revisar', nan, 'revisar']}
{'id': ['C001', 'C003'], 'owner': ['dq_team', 'dq_team']}`,
        },
        why: "loc sobre el padre + copy en subsets elimina SettingWithCopy.",
      },
      {
        demoId: "S15-T3-A-DEMO",
        subtopicId: "S15-T3-A",
        environment: "local-python",
        description: "Coaccionar string/category, numeric y fechas con conteo de NaN",
        code: {
          language: 'python',
          title: "demo_types.py",
          code: `import pandas as pd

df = pd.DataFrame({
    "region": ["lima", "AREQUIPA", "Lima"],
    "monto": ["10.5", "?", "3"],
    "alta": ["2024-01-10", "2024-13-01", "2024-02-01"],
})
df["region"] = df["region"].str.title().astype("category")
df["monto"] = pd.to_numeric(df["monto"], errors="coerce")
df["alta"] = pd.to_datetime(df["alta"], errors="coerce")
print(df["region"].dtype)
print("na_monto", int(df["monto"].isna().sum()), "na_alta", int(df["alta"].isna().sum()))
print(df["monto"].tolist())`,
          output: `category
na_monto 1 na_alta 1
[10.5, nan, 3.0]`,
        },
        why: "Tipos correctos + reporte de NaN son la base de la ingesta tipada.",
      },
      {
        demoId: "S15-T3-B-DEMO",
        subtopicId: "S15-T3-B",
        environment: "local-python",
        description: "Aplicar schema y listar coerciones fallidas por columna",
        code: {
          language: 'python',
          title: "demo_schema.py",
          code: `import pandas as pd

def apply_schema(df, schema):
    out = df.copy()
    report = {}
    for col, typ in schema.items():
        if col not in out.columns:
            raise KeyError(f"missing column {col}")
        if typ == "float64":
            before = out[col].isna().sum()
            out[col] = pd.to_numeric(out[col], errors="coerce")
            report[col] = int(out[col].isna().sum() - before)
        elif typ == "string":
            out[col] = out[col].astype("string")
            report[col] = 0
    return out, report

raw = pd.DataFrame({"cliente_id": ["C001", "C002"], "monto": ["1.5", "xx"]})
df, rep = apply_schema(raw, {"cliente_id": "string", "monto": "float64"})
print(df.dtypes.astype(str).to_dict())
print(rep)`,
          output: `{'cliente_id': 'string', 'monto': 'float64'}
{'cliente_id': 0, 'monto': 1}`,
        },
        why: "Schema + reporte de fallos alimenta el quality gate (S16).",
      },
      {
        demoId: "S15-T4-A-DEMO",
        subtopicId: "S15-T4-A",
        environment: "local-python",
        description: "Exportar a CSV y Excel sin perder columnas críticas; emitir contrato Parquet",
        code: {
          language: 'python',
          title: "demo_export.py",
          code: `import pandas as pd
from io import StringIO, BytesIO

df = pd.DataFrame({
    "cliente_id": ["C001", "C002"],
    "monto": [10.5, 3.0],
    "region": ["Lima", "Cusco"],
})
csv_buf = StringIO()
df.to_csv(csv_buf, index=False)
csv_buf.seek(0)
rt = pd.read_csv(csv_buf)
assert list(rt.columns) == ["cliente_id", "monto", "region"]
xbuf = BytesIO()
df.to_excel(xbuf, index=False, engine="openpyxl")
contract = {c: str(df[c].dtype) for c in df.columns}
print("rows", len(rt), "excel_ok", len(xbuf.getvalue()) > 100)
print("contract", contract)`,
          output: `rows 2 excel_ok True
contract {'cliente_id': 'object', 'monto': 'float64', 'region': 'object'}`,
        },
        why: "Round-trip de columnas críticas valida el export reproducible.",
      },
      {
        demoId: "S15-T4-B-DEMO",
        subtopicId: "S15-T4-B",
        environment: "local-python",
        description: "Emitir manifest de filas/columnas, memoria y provenance",
        code: {
          language: 'python',
          title: "demo_manifest.py",
          code: `import pandas as pd, hashlib, json

df = pd.DataFrame({"cliente_id": ["C001", "C002", "C003"], "monto": [1.0, 2.0, 3.0]})
blob = df.to_csv(index=False).encode()
manifest = {
    "rows": int(len(df)),
    "columns": df.columns.tolist(),
    "memory_bytes": int(df.memory_usage(deep=True).sum()),
    "source": "synthetic_tx_v1",
    "sha1_12": hashlib.sha1(blob).hexdigest()[:12],
}
print(json.dumps(manifest, sort_keys=True))`,
          output: `{"columns": ["cliente_id", "monto"], "memory_bytes": 335, "rows": 3, "sha1_12": "5f5459a9c1df", "source": "synthetic_tx_v1"}`,
        },
        why: "El manifest reconcilia entrada vs salida en CP-N2-A.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios guiados/independientes/transfer sobre Pandas ingesta. Dos pistas cada uno.",
    steps: [
      {
        id: "S15-T1-A-E1",
        subtopicId: "S15-T1-A",
        kind: "guided",
        instruction:
          "Crea un DataFrame con columnas cliente_id y score (2 filas) y pon cliente_id como index; imprime index.tolist().",
        hint: "set_index('cliente_id').",
        hints: [
          "set_index('cliente_id').",
          "index.tolist().",
        ],
        edgeCases: ["reset_index accidental", "index name None sin set"],
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
df = pd.DataFrame({"cliente_id": ["C001", "C002"], "score": [0.5, 0.8]})
df = df.set_index("cliente_id")
print(df.index.tolist())`,
          output: `['C001', 'C002']`,
        },
      },
      {
        id: "S15-T1-A-E2",
        subtopicId: "S15-T1-A",
        kind: "independent",
        instruction:
          "Crea una Series de scores con index C001,C002 name='score' e imprime s['C002'].",
        hint: "pd.Series(..., index=..., name=...).",
        hints: [
          "pd.Series(..., index=..., name=...).",
          "Acceso por etiqueta.",
        ],
        edgeCases: ["iloc vs label", "name incorrecto"],
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
s = pd.Series([0.1, 0.9], index=["C001", "C002"], name="score")
print(float(s["C002"]))`,
          output: `0.9`,
        },
      },
      {
        id: "S15-T1-A-E3",
        subtopicId: "S15-T1-A",
        kind: "transfer",
        instruction:
          "Alinea dos Series por index (unión) sumando scores; imprime el resultado ordenado por index.",
        hint: "s1.add(s2, fill_value=0).",
        hints: [
          "s1.add(s2, fill_value=0).",
          "sort_index.",
        ],
        edgeCases: ["NaN sin fill_value", "no ordenar"],
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
s1 = pd.Series([1.0, 2.0], index=["C001", "C002"])
s2 = pd.Series([0.5], index=["C002"])
out = s1.add(s2, fill_value=0).sort_index()
print(out.round(2).to_dict())`,
          output: `{'C001': 1.0, 'C002': 2.5}`,
        },
      },
      {
        id: "S15-T1-B-E1",
        subtopicId: "S15-T1-B",
        kind: "guided",
        instruction:
          "Lee un CSV en StringIO con columnas a,b y na_values=['NA']; imprime cuántos NA hay en b.",
        hint: "pd.read_csv(StringIO(...), na_values=...).",
        hints: [
          "pd.read_csv(StringIO(...), na_values=...).",
          "isna().sum().",
        ],
        edgeCases: ["na_values no aplicado", "contar filas"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import StringIO
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import StringIO
df = pd.read_csv(StringIO("a,b\\n1,2\\n3,NA\\n"), na_values=["NA"])
print(int(df["b"].isna().sum()))`,
          output: `1`,
        },
      },
      {
        id: "S15-T1-B-E2",
        subtopicId: "S15-T1-B",
        kind: "independent",
        instruction:
          "Lee CSV con parse_dates=['fecha'] e imprime el dtype de fecha como string.",
        hint: "parse_dates=['fecha'].",
        hints: [
          "parse_dates=['fecha'].",
          "str(df['fecha'].dtype).",
        ],
        edgeCases: ["dtype object", "formato de fecha inválido"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import StringIO
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import StringIO
df = pd.read_csv(StringIO("fecha,x\\n2024-01-01,1\\n"), parse_dates=["fecha"])
print(str(df["fecha"].dtype))`,
          output: `datetime64[ns]`,
        },
      },
      {
        id: "S15-T1-B-E3",
        subtopicId: "S15-T1-B",
        kind: "transfer",
        instruction:
          "Lee solo usecols cliente_id,monto desde CSV e imprime columns.tolist().",
        hint: "usecols=[...].",
        hints: [
          "usecols=[...].",
          "Verifica que no entre 'z'.",
        ],
        edgeCases: ["sin usecols", "orden de columnas"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import StringIO
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import StringIO
df = pd.read_csv(StringIO("cliente_id,monto,z\\nC001,1,9\\n"), usecols=["cliente_id", "monto"])
print(df.columns.tolist())`,
          output: `['cliente_id', 'monto']`,
        },
      },
      {
        id: "S15-T2-A-E1",
        subtopicId: "S15-T2-A",
        kind: "guided",
        instruction:
          "Con df de scores, usa loc para filas score>=0.5 e imprime cliente_id list.",
        hint: "df.loc[df.score>=0.5, 'cliente_id'].",
        hints: [
          "df.loc[df.score>=0.5, 'cliente_id'].",
          "tolist().",
        ],
        edgeCases: ["iloc posicional incorrecto", "filtro invertido"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({'cliente_id':['C001','C002'], 'score':[0.4,0.9]})
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001", "C002"], "score": [0.4, 0.9]})
print(df.loc[df["score"] >= 0.5, "cliente_id"].tolist())`,
          output: `['C002']`,
        },
      },
      {
        id: "S15-T2-A-E2",
        subtopicId: "S15-T2-A",
        kind: "independent",
        instruction:
          "Usa assign para crear col doble=score*2 e imprime la lista.",
        hint: "df.assign(doble=...).",
        hints: [
          "df.assign(doble=...).",
          "No mutar in-place obligatorio.",
        ],
        edgeCases: ["chained assign", "olvidar columna"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({'score':[1.0, 2.0]})
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"score": [1.0, 2.0]})
print(df.assign(doble=lambda x: x["score"] * 2)["doble"].tolist())`,
          output: `[2.0, 4.0]`,
        },
      },
      {
        id: "S15-T2-A-E3",
        subtopicId: "S15-T2-A",
        kind: "transfer",
        instruction:
          "Imprime el valor iloc[1, 0] de un DF 2x2 de enteros [[1,2],[3,4]].",
        hint: "iloc posición 1,0 → 3.",
        hints: [
          "iloc posición 1,0 → 3.",
          "No uses loc.",
        ],
        edgeCases: ["confusión loc/iloc", "1-based"],
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
df = pd.DataFrame([[1, 2], [3, 4]])
print(int(df.iloc[1, 0]))`,
          output: `3`,
        },
      },
      {
        id: "S15-T2-B-E1",
        subtopicId: "S15-T2-B",
        kind: "guided",
        instruction:
          "Asigna con loc la columna flag='x' donde score<0.5; imprime flag list (con NaN como None en to_dict cuidado: usa fillna).",
        hint: "df.loc[mask, 'flag'] = 'x'.",
        hints: [
          "df.loc[mask, 'flag'] = 'x'.",
          "Imprime lista con fillna('').",
        ],
        edgeCases: ["chained df[df...]['flag']", "sin fillna en print"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({'score':[0.2, 0.9]})
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"score": [0.2, 0.9]})
df.loc[df["score"] < 0.5, "flag"] = "x"
print(df["flag"].fillna("").tolist())`,
          output: `['x', '']`,
        },
      },
      {
        id: "S15-T2-B-E2",
        subtopicId: "S15-T2-B",
        kind: "independent",
        instruction:
          "Filtra score>0.5, haz copy, añade col ok=True; imprime ok list del subset.",
        hint: "subset = df.loc[...].copy().",
        hints: [
          "subset = df.loc[...].copy().",
          "subset['ok']=True.",
        ],
        edgeCases: ["sin copy", "filtro wrong"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({'score':[0.2, 0.9, 0.7]})
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"score": [0.2, 0.9, 0.7]})
sub = df.loc[df["score"] > 0.5].copy()
sub["ok"] = True
print(sub["ok"].tolist())`,
          output: `[True, True]`,
        },
      },
      {
        id: "S15-T2-B-E3",
        subtopicId: "S15-T2-B",
        kind: "transfer",
        instruction:
          "Demuestra que modificar un copy no cambia el DF original: imprime score original tras mutar la copia.",
        hint: "c = df.copy(); c.iloc[0,0]=99.",
        hints: [
          "c = df.copy(); c.iloc[0,0]=99.",
          "print df original.",
        ],
        edgeCases: ["view accidental", "mutar df no c"],
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
df = pd.DataFrame({"score": [1.0, 2.0]})
c = df.copy()
c.iloc[0, 0] = 99.0
print(df["score"].tolist())`,
          output: `[1.0, 2.0]`,
        },
      },
      {
        id: "S15-T3-A-E1",
        subtopicId: "S15-T3-A",
        kind: "guided",
        instruction:
          "Convierte columna region a category tras str.title(); imprime dtype name.",
        hint: "astype('category').",
        hints: [
          "astype('category').",
          "str.title primero.",
        ],
        edgeCases: ["object residual", "sin title"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({'region':['lima','Lima']})
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"region": ["lima", "Lima"]})
s = df["region"].str.title().astype("category")
print(s.dtype.name)`,
          output: `category`,
        },
      },
      {
        id: "S15-T3-A-E2",
        subtopicId: "S15-T3-A",
        kind: "independent",
        instruction:
          "to_numeric con errors=coerce sobre ['1','a','3']; imprime lista de floats/NaN (usa where isna).",
        hint: "pd.to_numeric(..., errors='coerce').",
        hints: [
          "pd.to_numeric(..., errors='coerce').",
          "tolist() con nan.",
        ],
        edgeCases: ["errors raise", "astype int falla"],
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
s = pd.to_numeric(pd.Series(["1", "a", "3"]), errors="coerce")
print(s.tolist())`,
          output: `[1.0, nan, 3.0]`,
        },
      },
      {
        id: "S15-T3-A-E3",
        subtopicId: "S15-T3-A",
        kind: "transfer",
        instruction:
          "to_datetime errors=coerce; cuenta NaT en ['2024-01-01','no-fecha'].",
        hint: "isna().sum().",
        hints: [
          "isna().sum().",
          "NaT cuenta como na.",
        ],
        edgeCases: ["errors raise", "contar len"],
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
s = pd.to_datetime(pd.Series(["2024-01-01", "no-fecha"]), errors="coerce")
print(int(s.isna().sum()))`,
          output: `1`,
        },
      },
      {
        id: "S15-T3-B-E1",
        subtopicId: "S15-T3-B",
        kind: "guided",
        instruction:
          "Aplica to_numeric a monto y reporta cuántos nuevos NaN se introdujeron (1 en el fixture).",
        hint: "Compara isna antes/después.",
        hints: [
          "Compara isna antes/después.",
          "errors=coerce.",
        ],
        edgeCases: ["no restar before", "astype sin coerce"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({'monto':['1','x']})
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"monto": ["1", "x"]})
before = df["monto"].isna().sum()
df["monto"] = pd.to_numeric(df["monto"], errors="coerce")
print(int(df["monto"].isna().sum() - before))`,
          output: `1`,
        },
      },
      {
        id: "S15-T3-B-E2",
        subtopicId: "S15-T3-B",
        kind: "independent",
        instruction:
          "Si falta columna 'monto' en schema, lanza KeyError e imprime 'missing'.",
        hint: "if col not in df.columns.",
        hints: [
          "if col not in df.columns.",
          "try/except KeyError.",
        ],
        edgeCases: ["silenciar falta", "crear columna vacía"],
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
df = pd.DataFrame({"cliente_id": ["C001"]})
schema = {"monto": "float64"}
try:
    for col in schema:
        if col not in df.columns:
            raise KeyError(col)
except KeyError:
    print("missing")`,
          output: `missing`,
        },
      },
      {
        id: "S15-T3-B-E3",
        subtopicId: "S15-T3-B",
        kind: "transfer",
        instruction:
          "Castea cliente_id a string dtype e imprime str(dtype).",
        hint: "astype('string').",
        hints: [
          "astype('string').",
          "dtype string de pandas.",
        ],
        edgeCases: ["object", "category"],
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
s = pd.Series(["C001"]).astype("string")
print(str(s.dtype))`,
          output: `string`,
        },
      },
      {
        id: "S15-T4-A-E1",
        subtopicId: "S15-T4-A",
        kind: "guided",
        instruction:
          "Exporta DF a CSV en StringIO sin index y relee; imprime columns.",
        hint: "to_csv(buf, index=False).",
        hints: [
          "to_csv(buf, index=False).",
          "read_csv.",
        ],
        edgeCases: ["index=True crea col extra", "no seek"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import StringIO
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import StringIO
df = pd.DataFrame({"a": [1], "b": [2]})
buf = StringIO()
df.to_csv(buf, index=False)
buf.seek(0)
print(pd.read_csv(buf).columns.tolist())`,
          output: `['a', 'b']`,
        },
      },
      {
        id: "S15-T4-A-E2",
        subtopicId: "S15-T4-A",
        kind: "independent",
        instruction:
          "to_excel a BytesIO con openpyxl; imprime True si bytes > 0.",
        hint: "engine='openpyxl'.",
        hints: [
          "engine='openpyxl'.",
          "getvalue().",
        ],
        edgeCases: ["sin engine", "archivo disco obligatorio"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import BytesIO
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import BytesIO
bio = BytesIO()
pd.DataFrame({"a": [1]}).to_excel(bio, index=False, engine="openpyxl")
print(len(bio.getvalue()) > 0)`,
          output: `True`,
        },
      },
      {
        id: "S15-T4-A-E3",
        subtopicId: "S15-T4-A",
        kind: "transfer",
        instruction:
          "Emite dict contrato {col: str(dtype)} para un DF de dos columnas e imprímelo ordenado por clave.",
        hint: "dict comprehension.",
        hints: [
          "dict comprehension.",
          "sorted items o print dict estable.",
        ],
        edgeCases: ["dtypes Series print feo", "sin str()"],
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
df = pd.DataFrame({"cliente_id": ["C001"], "monto": [1.0]})
contract = {c: str(df[c].dtype) for c in df.columns}
print(dict(sorted(contract.items())))`,
          output: `{'cliente_id': 'object', 'monto': 'float64'}`,
        },
      },
      {
        id: "S15-T4-B-E1",
        subtopicId: "S15-T4-B",
        kind: "guided",
        instruction:
          "Calcula memory_usage deep sum de un DF simple e imprime int > 0.",
        hint: "memory_usage(deep=True).sum().",
        hints: [
          "memory_usage(deep=True).sum().",
          "int(...).",
        ],
        edgeCases: ["deep=False en strings", "no sum"],
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
df = pd.DataFrame({"a": ["Lima", "Cusco"]})
print(int(df.memory_usage(deep=True).sum()) > 0)`,
          output: `True`,
        },
      },
      {
        id: "S15-T4-B-E2",
        subtopicId: "S15-T4-B",
        kind: "independent",
        instruction:
          "Construye manifest con keys rows y columns; imprime rows.",
        hint: "len(df) y columns.tolist().",
        hints: [
          "len(df) y columns.tolist().",
          "dict.",
        ],
        edgeCases: ["shape confuso", "columns Index no list"],
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
df = pd.DataFrame({"a": [1, 2, 3]})
manifest = {"rows": len(df), "columns": df.columns.tolist()}
print(manifest["rows"], manifest["columns"])`,
          output: `3 ['a']`,
        },
      },
      {
        id: "S15-T4-B-E3",
        subtopicId: "S15-T4-B",
        kind: "transfer",
        instruction:
          "sha1 de to_csv index=False; imprime primeros 8 hex.",
        hint: "hashlib.sha1(blob).hexdigest()[:8].",
        hints: [
          "hashlib.sha1(blob).hexdigest()[:8].",
          "encode utf-8.",
        ],
        edgeCases: ["hash del objeto python", "sin encode"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd, hashlib
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd, hashlib
df = pd.DataFrame({"a": [1]})
blob = df.to_csv(index=False).encode()
print(hashlib.sha1(blob).hexdigest()[:8])`,
          output: `462f48ef`,
        },
      },
    ],
  },
  youDo: {
    title: "Ingesta tipada clientes/transacciones con reconciliación",
    context:
      "Recibes CSV sintéticos de clientes y transacciones de un retailer peruano. Debes ingerir con schema, reportar coerciones, reconciliar filas/columnas y exportar dataset analítico + manifest. Sin PII real.",
    objectives: [
      "Ingerir datasets sintéticos de clientes y transacciones",
      "Aplicar schema tipado y reportar coerciones",
      "Reconciliar filas/columnas entrada vs salida",
      "Exportar dataset analítico + manifest",
    ],
    requirements: [
      "Fixtures sintéticos en memoria o CSV local",
      "Demo reproducible (if __name__ == '__main__')",
      "Documentación en español profesional",
      "Alineación a CP-N2-A (dataset)",
    ],
    starterCode: `import pandas as pd
from io import StringIO

CLIENTES = """cliente_id,region,score
C001,Lima,0.9
C002,Arequipa,0.4
C003,Lima,NA
"""

def ingest_clientes(text: str) -> tuple[pd.DataFrame, dict]:
    # TODO: read_csv + schema + report
    raise NotImplementedError

if __name__ == "__main__":
    df, report = ingest_clientes(CLIENTES)
    print(df.head(), report)
`,
    portfolioNote:
      "Entrega el manifest JSON y el reporte de coerciones junto al CSV/Excel exportado.",
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
        question: "¿Qué método de selección usa etiquetas de index/columnas?",
        options: [
          "iloc",
          "loc",
          "iat solo posicional forzado",
          "values",
        ],
        correctIndex: 1,
        explanation:
          "loc selecciona por etiqueta; iloc por posición.",
      },
      {
        question: "SettingWithCopyWarning se relaciona con:",
        options: [
          "Parquet vs CSV",
          "Asignación sobre slices que pueden ser view/copy (chained assignment)",
          "Falta de openpyxl",
          "MultiIndex obligatorio",
        ],
        correctIndex: 1,
        explanation:
          "El chained assignment puede no escribir donde crees.",
      },
      {
        question: "errors='coerce' en to_numeric:",
        options: [
          "Borra la columna",
          "Convierte inválidos a NaN",
          "Eleva siempre excepción",
          "Cambia a string",
        ],
        correctIndex: 1,
        explanation:
          "coerce produce NaN en valores no parseables.",
      },
      {
        question: "Un manifest de export debería incluir al menos:",
        options: [
          "Solo el nombre del analista",
          "Filas, columnas y provenance/hash del artefacto",
          "Contraseñas de BD",
          "PII real de clientes",
        ],
        correctIndex: 1,
        explanation:
          "Reconciliación requiere filas/columnas y trazabilidad del archivo.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "pandas read_csv",
        url: "https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html",
        note: "Parser options",
      },
      {
        label: "pandas indexing",
        url: "https://pandas.pydata.org/docs/user_guide/indexing.html",
        note: "loc/iloc",
      },
    ],
    books: [
      {
        label: "Python for Data Analysis — pandas",
        note: "Ingesta y tipos",
      },
    ],
    courses: [
      {
        label: "pandas docs getting started",
        url: "https://pandas.pydata.org/docs/getting_started/index.html",
        note: "Oficial",
      },
    ],
  },
}
