import type { CourseSection } from '../../types'

export const section17: CourseSection = {
  id: "packaging",
  index: 17,
  title: "Joins, reshape, groupby y cierre analítico",
  shortTitle: "Joins · groupby · cierre",
  tagline: "Executive Data Quality & EDA Portfolio con dataset limpio, notebook/script reproducible, reconciliación y preguntas de negocio",
  estimatedHours: 18,
  level: "Competente",
  phase: 1,
  icon: "Package",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "Cerrar un **portfolio de data quality + EDA** exige joins con cardinalidad, reshape, groupby y reconciliación sin leakage temporal. Esta sección (id `packaging` conservado) retematiza a V3 y **cierra CP-N2-A**.",
  learningOutcomes: [
    { text: "Diseñar joins con claves y cardinalidad correctas" },
    { text: "Usar validate y anti-join para detectar fan-out/huérfanos" },
    { text: "Reshapear con concat/melt/pivot" },
    { text: "Mantener nombres estables long/wide" },
    { text: "Agregar con groupby/agg/transform" },
    { text: "Construir ventanas, fechas y cohortes" },
    { text: "Reconciliar denominadores y totales" },
    { text: "Controlar leakage temporal antes/después" },
  ],
  theory: [
    {
      heading: "De “Packaging y CLI” a joins/groupby y cierre CP-N2-A (mapa)",
      paragraphs: [
        "En V3, **S17 no es el path de pyproject.toml ni PyPI**. Aquí **cierras CP-N2-A**: joins con cardinalidad, anti-join, reshape, groupby, ventanas/cohortes, reconciliación de totales y controles de leakage temporal.",
        "Entregable: dataset limpio + script reproducible + respuestas de negocio con evidencia + memo de límites.",
        "Orden: **T1 Joins** → **T2 Forma** → **T3 Agregación** → **T4 Reconciliación**.",
      ],
      callout: {
        type: "info",
        title: "Contenido reubicado conceptualmente",
        content:
          "Material legado de packaging/CLI **no es el camino V3 en S17**. Target: joins/groupby y cierre CP-N2-A.",
      },
    },
    {
      heading: "claves y cardinalidad en joins",
      subtopicId: "S17-T1-A",
      paragraphs: [
        "`merge`/`join` con `how` (inner/left/right/outer). La **cardinalidad** 1:1, 1:m, m:m determina el fan-out de filas.",
        "Claves deben compartir dtype y normalización (string ids).",
        "Antes del merge, cuenta unicidad de la clave en cada lado.",
      ],
      code: {
        language: 'python',
        title: "join_card.py",
        code: `import pandas as pd

cli = pd.DataFrame({"cliente_id": ["C001", "C002"], "region": ["Lima", "Cusco"]})
tx = pd.DataFrame({"cliente_id": ["C001", "C001", "C003"], "monto": [10.0, 5.0, 7.0]})
print("cli_unique", cli["cliente_id"].is_unique)
print("tx_unique", tx["cliente_id"].is_unique)
m = cli.merge(tx, on="cliente_id", how="left")
print(len(cli), len(tx), len(m))
print(m.to_dict(orient="list"))`,
        output: `cli_unique True
tx_unique False
2 3 3
{'cliente_id': ['C001', 'C001', 'C002'], 'region': ['Lima', 'Lima', 'Cusco'], 'monto': [10.0, 5.0, nan]}`,
      },
      callout: {
        type: "tip",
        title: "Cuenta filas pre/post",
        content:
          "Si len(out) >> len(left) en un supposed 1:1, hay fan-out.",
      },
    },
    {
      heading: "validate, duplicación accidental y anti-join",
      subtopicId: "S17-T1-B",
      paragraphs: [
        "`validate='one_to_one'|'one_to_many'|...` hace fallar merges con cardinalidad rota.",
        "`indicator=True` marca left_only/right_only/both. **Anti-join**: filas left_only (huérfanos).",
        "Útil para clientes sin transacciones o transacciones sin cliente maestro.",
      ],
      code: {
        language: 'python',
        title: "validate_anti.py",
        code: `import pandas as pd

cli = pd.DataFrame({"cliente_id": ["C001", "C002"]})
tx = pd.DataFrame({"cliente_id": ["C001", "C003"], "monto": [1.0, 2.0]})
m = cli.merge(tx, on="cliente_id", how="left", indicator=True)
anti = m[m["_merge"] == "left_only"]
print(m["_merge"].tolist())
print("huerfanos", anti["cliente_id"].tolist())
try:
    cli.merge(pd.DataFrame({"cliente_id": ["C001", "C001"]}), on="cliente_id", validate="one_to_one")
except pd.errors.MergeError as e:
    print("validate_fail", True)`,
        output: `['both', 'left_only']
huerfanos ['C002']
validate_fail True`,
      },
      callout: {
        type: "warning",
        title: "m:m accidental",
        content:
          "Duplicados en ambos lados explotan filas. validate lo atrapa temprano.",
      },
    },
    {
      heading: "concat, melt y pivot",
      subtopicId: "S17-T2-A",
      paragraphs: [
        "`concat` apila (axis=0) o alinea columnas (axis=1). `melt` pasa wide→long; `pivot_table` long→wide.",
        "Elige long para series temporales multipunto; wide para reportes tabulares.",
        "Cuidado con índices al concatenar: `ignore_index=True` o keys multiindex.",
      ],
      code: {
        language: 'python',
        title: "melt_pivot.py",
        code: `import pandas as pd

wide = pd.DataFrame({"cliente_id": ["C001", "C002"], "ene": [1, 2], "feb": [3, 4]})
long = wide.melt(id_vars=["cliente_id"], var_name="mes", value_name="monto")
back = long.pivot_table(index="cliente_id", columns="mes", values="monto", aggfunc="sum")
print(long.to_dict(orient="list"))
print(back.reset_index().to_dict(orient="list"))`,
        output: `{'cliente_id': ['C001', 'C002', 'C001', 'C002'], 'mes': ['ene', 'ene', 'feb', 'feb'], 'monto': [1, 2, 3, 4]}
{'cliente_id': ['C001', 'C002'], 'ene': [1, 2], 'feb': [3, 4]}`,
      },
      callout: {
        type: "tip",
        title: "aggfunc explícito",
        content:
          "pivot_table sin aggfunc puede sorprender con mean por defecto en versiones; sé explícito.",
      },
    },
    {
      heading: "long/wide y nombres estables",
      subtopicId: "S17-T2-B",
      paragraphs: [
        "Tras pivot, columnas MultiIndex o nombres sucios (`monto_ene`) deben **aplanarse** a un schema estable.",
        "Contrato de columnas del portfolio: lista ordenada documentada.",
        "Renombra con dict y valida set(columns)==expected.",
      ],
      code: {
        language: 'python',
        title: "stable_names.py",
        code: `import pandas as pd

long = pd.DataFrame({
    "cliente_id": ["C001", "C001"],
    "mes": ["ene", "feb"],
    "monto": [1.0, 2.0],
})
wide = long.pivot(index="cliente_id", columns="mes", values="monto")
wide.columns = [f"monto_{c}" for c in wide.columns]
wide = wide.reset_index()
expected = ["cliente_id", "monto_ene", "monto_feb"]
print(wide.columns.tolist())
print(set(wide.columns) == set(expected))`,
        output: `['cliente_id', 'monto_ene', 'monto_feb']
True`,
      },
      callout: {
        type: "warning",
        title: "Schema estable",
        content:
          "Un rename silencioso rompe el dashboard. Valida expected columns.",
      },
    },
    {
      heading: "groupby / agg / transform",
      subtopicId: "S17-T3-A",
      paragraphs: [
        "`groupby` + `agg` resume (dict de funciones). `transform` reinyecta el agregado al shape original (p. ej. score / mean_region).",
        "named aggregation mejora claridad: `monto_sum=('monto','sum')`.",
        "as_index=False facilita merges posteriores.",
      ],
      code: {
        language: 'python',
        title: "groupby_agg.py",
        code: `import pandas as pd

df = pd.DataFrame({
    "region": ["Lima", "Lima", "Cusco"],
    "monto": [10.0, 20.0, 5.0],
})
agg = df.groupby("region", as_index=False).agg(monto_sum=("monto", "sum"), n=("monto", "size"))
df2 = df.copy()
df2["monto_region_mean"] = df2.groupby("region")["monto"].transform("mean")
print(agg.to_dict(orient="list"))
print(df2["monto_region_mean"].tolist())`,
        output: `{'region': ['Cusco', 'Lima'], 'monto_sum': [5.0, 30.0], 'n': [1, 2]}
[15.0, 15.0, 5.0]`,
      },
      callout: {
        type: "tip",
        title: "transform vs agg",
        content:
          "transform preserva filas; agg colapsa grupos.",
      },
    },
    {
      heading: "ventanas, fechas y cohortes",
      subtopicId: "S17-T3-B",
      paragraphs: [
        "`rolling` ventanas móviles; `resample` en series con DatetimeIndex. **Cohortes**: etiqueta por mes de primera compra.",
        "Ordena por fecha antes de rolling. Documenta ventana (3d, 7d).",
        "Cohortes alimentan retención y preguntas de negocio del portfolio.",
      ],
      code: {
        language: 'python',
        title: "windows_cohorts.py",
        code: `import pandas as pd

df = pd.DataFrame({
    "fecha": pd.to_datetime(["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04"]),
    "monto": [1.0, 2.0, 3.0, 4.0],
}).set_index("fecha")
df["roll3"] = df["monto"].rolling(3).mean()
clientes = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002"],
    "fecha": pd.to_datetime(["2024-01-15", "2024-02-10", "2024-01-20"]),
})
first = clientes.groupby("cliente_id")["fecha"].transform("min")
clientes["cohort"] = first.dt.to_period("M").astype(str)
print(df["roll3"].round(2).tolist())
print(clientes[["cliente_id", "cohort"]].drop_duplicates().to_dict(orient="list"))`,
        output: `[nan, nan, 2.0, 3.0]
{'cliente_id': ['C001', 'C002'], 'cohort': ['2024-01', '2024-01']}`,
      },
      callout: {
        type: "info",
        title: "Primera fecha = cohorte",
        content:
          "Define cohorte con la primera observación válida, no con la fecha del batch de hoy.",
      },
    },
    {
      heading: "denominadores y totales",
      subtopicId: "S17-T4-A",
      paragraphs: [
        "Reconciliación: **suma de partes = total** (o diferencia documentada). Denominadores de tasas deben coincidir con el universo declarado.",
        "Bridge table: total → segmentos → residual.",
        "Tolera redondeo con abs(diff) < eps.",
      ],
      code: {
        language: 'python',
        title: "reconcile.py",
        code: `import pandas as pd

total = 100.0
parts = pd.Series({"Lima": 60.0, "Cusco": 30.0, "Arequipa": 10.0})
print("sum_parts", float(parts.sum()), "ok", abs(parts.sum() - total) < 1e-9)
# tasa: pagados / clientes activos
activos = 50
pagados = 20
print("tasa", pagados / activos, "denominador", activos)`,
        output: `sum_parts 100.0 ok True
tasa 0.4 denominador 50`,
      },
      callout: {
        type: "warning",
        title: "Denominador correcto",
        content:
          "Una tasa con denominador de otro filtro es el error clásico de EDA ejecutivo.",
      },
    },
    {
      heading: "leakage temporal y controles antes/después",
      subtopicId: "S17-T4-B",
      paragraphs: [
        "**Leakage temporal**: usar información posterior al cutoff para features o métricas de un periodo anterior.",
        "Controles: cutoff estricto, as-of join (solo filas con fecha <= t), split before/after.",
        "En el portfolio, declara el cutoff y demuestra que los agregados pre-cutoff no miran el futuro.",
      ],
      code: {
        language: 'python',
        title: "no_leak.py",
        code: `import pandas as pd

tx = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C001"],
    "fecha": pd.to_datetime(["2024-01-01", "2024-01-15", "2024-02-01"]),
    "monto": [10.0, 5.0, 100.0],
})
cutoff = pd.Timestamp("2024-01-31")
pre = tx[tx["fecha"] <= cutoff]
# mal: usar max global incluyendo febrero
leak = float(tx["monto"].sum())
ok = float(pre["monto"].sum())
print("con_leak_total", leak, "pre_cutoff", ok)
print("leakage_delta", leak - ok)`,
        output: `con_leak_total 115.0 pre_cutoff 15.0
leakage_delta 100.0`,
      },
      callout: {
        type: "danger",
        title: "Cutoff estricto",
        content:
          "Cualquier feature con fecha > cutoff invalida el análisis before/after.",
      },
    },
  ],
  iDo: {
    intro: "8 demos de joins, anti-join, reshape, nombres, groupby, cohortes, totales y anti-leakage.",
    steps: [
      {
        demoId: "S17-T1-A-DEMO",
        subtopicId: "S17-T1-A",
        environment: "local-python",
        description: "Elegir left join clientes-tx y validar fan-out 1:m",
        code: {
          language: 'python',
          title: "demo_join.py",
          code: `import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C002"], "region": ["Lima", "Cusco"]})
tx = pd.DataFrame({"cliente_id": ["C001", "C001", "C002"], "monto": [3.0, 4.0, 5.0]})
assert cli["cliente_id"].is_unique
m = cli.merge(tx, on="cliente_id", how="left")
print("rows", len(cli), "->", len(m), "card", "1:m")
print(m.groupby("cliente_id").size().to_dict())`,
          output: `rows 2 -> 3 card 1:m
{'C001': 2, 'C002': 1}`,
        },
        why: "Contar filas pre/post documenta la cardinalidad real del join.",
      },
      {
        demoId: "S17-T1-B-DEMO",
        subtopicId: "S17-T1-B",
        environment: "local-python",
        description: "Detectar fan-out con validate y anti-join de clientes sin tx",
        code: {
          language: 'python',
          title: "demo_anti.py",
          code: `import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C002", "C003"]})
tx = pd.DataFrame({"cliente_id": ["C001", "C001"], "monto": [1.0, 2.0]})
ok = cli.merge(tx.drop_duplicates("cliente_id"), on="cliente_id", how="left", validate="one_to_one")
m = cli.merge(tx, on="cliente_id", how="left", indicator=True)
anti = m.loc[m["_merge"] == "left_only", "cliente_id"].unique().tolist()
print("anti", anti)
try:
    cli.merge(tx, on="cliente_id", validate="one_to_one")
except Exception:
    print("validate_caught_fanout", True)`,
          output: `anti ['C002', 'C003']
validate_caught_fanout True`,
        },
        why: "validate + anti-join cubren fan-out y huérfanos.",
      },
      {
        demoId: "S17-T2-A-DEMO",
        subtopicId: "S17-T2-A",
        environment: "local-python",
        description: "Pasar wide↔long con melt y pivot_table",
        code: {
          language: 'python',
          title: "demo_reshape.py",
          code: `import pandas as pd
wide = pd.DataFrame({"cliente_id": ["C001", "C002"], "m1": [10, 20], "m2": [1, 2]})
long = wide.melt(id_vars="cliente_id", var_name="periodo", value_name="monto")
wide2 = long.pivot_table(index="cliente_id", columns="periodo", values="monto", aggfunc="sum")
print(long.shape, wide2.shape)
print(long["periodo"].tolist())`,
          output: `(4, 3) (2, 2)
['m1', 'm1', 'm2', 'm2']`,
        },
        why: "melt/pivot son el puente a reportes y series.",
      },
      {
        demoId: "S17-T2-B-DEMO",
        subtopicId: "S17-T2-B",
        environment: "local-python",
        description: "Estabilizar nombres de columnas post-pivot al schema del portfolio",
        code: {
          language: 'python',
          title: "demo_names.py",
          code: `import pandas as pd
long = pd.DataFrame({"cliente_id": ["C001", "C001"], "mes": ["ene", "feb"], "monto": [1.0, 2.0]})
w = long.pivot(index="cliente_id", columns="mes", values="monto").reset_index()
w.columns = ["cliente_id" if c == "cliente_id" else f"monto_{c}" for c in w.columns]
expected = {"cliente_id", "monto_ene", "monto_feb"}
print(w.columns.tolist(), set(w.columns) == expected)`,
          output: `['cliente_id', 'monto_ene', 'monto_feb'] True`,
        },
        why: "Schema de columnas estable evita roturas del dashboard.",
      },
      {
        demoId: "S17-T3-A-DEMO",
        subtopicId: "S17-T3-A",
        environment: "local-python",
        description: "Agregar montos por región y reinyectar media con transform",
        code: {
          language: 'python',
          title: "demo_groupby.py",
          code: `import pandas as pd
df = pd.DataFrame({
    "region": ["Lima", "Lima", "Arequipa", "Arequipa"],
    "monto": [10.0, 30.0, 5.0, 15.0],
})
resumen = df.groupby("region", as_index=False).agg(total=("monto", "sum"), n=("monto", "count"))
df = df.assign(mean_reg=df.groupby("region")["monto"].transform("mean"))
print(resumen.to_dict(orient="list"))
print(df["mean_reg"].tolist())`,
          output: `{'region': ['Arequipa', 'Lima'], 'total': [20.0, 40.0], 'n': [2, 2]}
[20.0, 20.0, 10.0, 10.0]`,
        },
        why: "agg para reportes; transform para features a nivel fila.",
      },
      {
        demoId: "S17-T3-B-DEMO",
        subtopicId: "S17-T3-B",
        environment: "local-python",
        description: "Construir cohorte mensual y media móvil de 2 periodos",
        code: {
          language: 'python',
          title: "demo_cohort.py",
          code: `import pandas as pd
tx = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002", "C002"],
    "fecha": pd.to_datetime(["2024-01-05", "2024-02-10", "2024-01-20", "2024-03-01"]),
    "monto": [1.0, 2.0, 3.0, 4.0],
})
tx["cohort"] = tx.groupby("cliente_id")["fecha"].transform("min").dt.to_period("M").astype(str)
daily = tx.groupby("fecha", as_index=True)["monto"].sum().sort_index()
roll = daily.rolling(2).mean()
print(tx[["cliente_id", "cohort"]].drop_duplicates().to_dict(orient="list"))
print([None if pd.isna(x) else round(float(x), 2) for x in roll.tolist()])`,
          output: `{'cliente_id': ['C001', 'C002'], 'cohort': ['2024-01', '2024-01']}
[None, 2.0, 2.5, 3.0]`,
        },
        why: "Cohortes + ventanas responden preguntas de evolución temporal.",
      },
      {
        demoId: "S17-T4-A-DEMO",
        subtopicId: "S17-T4-A",
        environment: "local-python",
        description: "Reconciliar total nacional vs suma por región",
        code: {
          language: 'python',
          title: "demo_totals.py",
          code: `import pandas as pd
parts = pd.DataFrame({"region": ["Lima", "Cusco", "Arequipa"], "monto": [50.0, 30.0, 20.0]})
total_ref = 100.0
diff = float(parts["monto"].sum() - total_ref)
print("diff", diff, "reconciled", abs(diff) < 1e-9)
# denominador de tasa de completitud
n_clientes = 200
n_completos = 150
print("tasa", n_completos / n_clientes, "den", n_clientes)`,
          output: `diff 0.0 reconciled True
tasa 0.75 den 200`,
        },
        why: "Totales y denominadores anclan el EDA ejecutivo.",
      },
      {
        demoId: "S17-T4-B-DEMO",
        subtopicId: "S17-T4-B",
        environment: "local-python",
        description: "Evitar leakage: agregar solo transacciones <= cutoff",
        code: {
          language: 'python',
          title: "demo_leakage.py",
          code: `import pandas as pd
tx = pd.DataFrame({
    "cliente_id": ["C001", "C001"],
    "fecha": pd.to_datetime(["2024-01-10", "2024-03-01"]),
    "monto": [10.0, 999.0],
})
cutoff = pd.Timestamp("2024-01-31")
feat = tx[tx["fecha"] <= cutoff].groupby("cliente_id")["monto"].sum()
leaky = tx.groupby("cliente_id")["monto"].sum()
print("safe", feat.to_dict())
print("leaky", leaky.to_dict())
print("delta", float(leaky["C001"] - feat["C001"]))`,
          output: `safe {'C001': 10.0}
leaky {'C001': 1009.0}
delta 999.0`,
        },
        why: "Cutoff y as-of evitan contaminación before/after.",
      },
    ],
  },
  weDo: {
    intro: "24 ejercicios E1/E2/E3 de joins/groupby y reconciliación. Dos pistas cada uno. Cierre CP-N2-A.",
    steps: [
      {
        id: "S17-T1-A-E1",
        subtopicId: "S17-T1-A",
        kind: "guided",
        instruction:
          "Left merge cli y tx por cliente_id; imprime len del resultado.",
        hint: "merge how='left'.",
        hints: [
          "merge how='left'.",
          "Cuenta filas.",
        ],
        edgeCases: ["inner pierde C002", "how wrong"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
cli=pd.DataFrame({'cliente_id':['C001','C002']})
tx=pd.DataFrame({'cliente_id':['C001'],'monto':[1.0]})
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C002"]})
tx = pd.DataFrame({"cliente_id": ["C001"], "monto": [1.0]})
print(len(cli.merge(tx, on="cliente_id", how="left")))`,
          output: `2`,
        },
      },
      {
        id: "S17-T1-A-E2",
        subtopicId: "S17-T1-A",
        kind: "independent",
        instruction:
          "Imprime si la clave de cli es única (True/False).",
        hint: "is_unique.",
        hints: [
          "is_unique.",
          "Series.cliente_id.",
        ],
        edgeCases: ["nunique confuso", "drop_duplicates silencioso"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
cli=pd.DataFrame({'cliente_id':['C001','C001']})
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C001"]})
print(bool(cli["cliente_id"].is_unique))`,
          output: `False`,
        },
      },
      {
        id: "S17-T1-A-E3",
        subtopicId: "S17-T1-A",
        kind: "transfer",
        instruction:
          "Demuestra fan-out: 1 cliente x 3 tx → len merge == 3 con how=inner.",
        hint: "merge inner.",
        hints: [
          "merge inner.",
          "print len.",
        ],
        edgeCases: ["how left same here", "cartesian wrong keys"],
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
cli = pd.DataFrame({"cliente_id": ["C001"]})
tx = pd.DataFrame({"cliente_id": ["C001"] * 3, "monto": [1.0, 2.0, 3.0]})
print(len(cli.merge(tx, on="cliente_id", how="inner")))`,
          output: `3`,
        },
      },
      {
        id: "S17-T1-B-E1",
        subtopicId: "S17-T1-B",
        kind: "guided",
        instruction:
          "Con indicator=True, lista cliente_id left_only.",
        hint: "merge left indicator.",
        hints: [
          "merge left indicator.",
          "filtra _merge.",
        ],
        edgeCases: ["right_only", "sin indicator"],
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
cli = pd.DataFrame({"cliente_id": ["C001", "C002"]})
tx = pd.DataFrame({"cliente_id": ["C001"], "monto": [1.0]})
m = cli.merge(tx, on="cliente_id", how="left", indicator=True)
print(m.loc[m["_merge"] == "left_only", "cliente_id"].tolist())`,
          output: `['C002']`,
        },
      },
      {
        id: "S17-T1-B-E2",
        subtopicId: "S17-T1-B",
        kind: "independent",
        instruction:
          "validate one_to_one debe fallar con dups a la derecha; imprime 'fail'.",
        hint: "try MergeError o Exception.",
        hints: [
          "try MergeError o Exception.",
          "validate=.",
        ],
        edgeCases: ["validate many_to_many", "no catch"],
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
a = pd.DataFrame({"id": [1]})
b = pd.DataFrame({"id": [1, 1]})
try:
    a.merge(b, on="id", validate="one_to_one")
except Exception:
    print("fail")`,
          output: `fail`,
        },
      },
      {
        id: "S17-T1-B-E3",
        subtopicId: "S17-T1-B",
        kind: "transfer",
        instruction:
          "Cuenta huérfanos (anti-join) entre cli y tx.",
        hint: "left_only count.",
        hints: [
          "left_only count.",
          "nunique o len.",
        ],
        edgeCases: ["inner count", "right anti"],
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
cli = pd.DataFrame({"cliente_id": ["C001", "C002", "C003"]})
tx = pd.DataFrame({"cliente_id": ["C001"]})
m = cli.merge(tx, on="cliente_id", how="left", indicator=True)
print(int((m["_merge"] == "left_only").sum()))`,
          output: `2`,
        },
      },
      {
        id: "S17-T2-A-E1",
        subtopicId: "S17-T2-A",
        kind: "guided",
        instruction:
          "melt id_vars=id value_vars a,b; imprime len long (debe 4 para 2 filas x 2).",
        hint: "melt.",
        hints: [
          "melt.",
          "var_name value_name opcionales.",
        ],
        edgeCases: ["stack mal", "sin id_vars"],
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
df = pd.DataFrame({"id": [1, 2], "a": [10, 20], "b": [3, 4]})
print(len(df.melt(id_vars="id", value_vars=["a", "b"])))`,
          output: `4`,
        },
      },
      {
        id: "S17-T2-A-E2",
        subtopicId: "S17-T2-A",
        kind: "independent",
        instruction:
          "pivot_table index=id columns=k values=v sum; imprime columns list tras reset.",
        hint: "aggfunc sum.",
        hints: [
          "aggfunc sum.",
          "reset_index.",
        ],
        edgeCases: ["pivot sin agg", "mean default confusion"],
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
long = pd.DataFrame({"id": [1, 1], "k": ["a", "b"], "v": [1.0, 2.0]})
w = long.pivot_table(index="id", columns="k", values="v", aggfunc="sum").reset_index()
print(w.columns.tolist())`,
          output: `['id', 'a', 'b']`,
        },
      },
      {
        id: "S17-T2-A-E3",
        subtopicId: "S17-T2-A",
        kind: "transfer",
        instruction:
          "concat de dos DF axis=0 ignore_index; imprime len.",
        hint: "pd.concat(..., ignore_index=True).",
        hints: [
          "pd.concat(..., ignore_index=True).",
          "mismas cols.",
        ],
        edgeCases: ["axis=1", "index duplicado confuso"],
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
a = pd.DataFrame({"x": [1]})
b = pd.DataFrame({"x": [2]})
print(len(pd.concat([a, b], ignore_index=True)))`,
          output: `2`,
        },
      },
      {
        id: "S17-T2-B-E1",
        subtopicId: "S17-T2-B",
        kind: "guided",
        instruction:
          "Aplana columnas MultiIndex nivel0_nivel1 e imprime nombres.",
        hint: "map join o f-string.",
        hints: [
          "map join o f-string.",
          "tras pivot.",
        ],
        edgeCases: ["dejar multiindex", "espacios"],
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
long = pd.DataFrame({"id": [1, 1], "mes": ["e", "f"], "monto": [1.0, 2.0]})
w = long.pivot(index="id", columns="mes", values="monto")
w.columns = [f"monto_{c}" for c in w.columns]
print(list(w.columns))`,
          output: `['monto_e', 'monto_f']`,
        },
      },
      {
        id: "S17-T2-B-E2",
        subtopicId: "S17-T2-B",
        kind: "independent",
        instruction:
          "Valida set(columns)==expected; imprime True/False.",
        hint: "set igualdad.",
        hints: [
          "set igualdad.",
          "expected fijo.",
        ],
        edgeCases: ["orden importa en set? no", "list =="],
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
df = pd.DataFrame(columns=["cliente_id", "monto_ene"])
expected = {"cliente_id", "monto_ene"}
print(set(df.columns) == expected)`,
          output: `True`,
        },
      },
      {
        id: "S17-T2-B-E3",
        subtopicId: "S17-T2-B",
        kind: "transfer",
        instruction:
          "rename columns dict {'a':'monto'}; imprime columns.",
        hint: "rename(columns=...).",
        hints: [
          "rename(columns=...).",
          "inplace False.",
        ],
        edgeCases: ["reassign mal", "axis"],
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
df = pd.DataFrame({"a": [1]})
print(df.rename(columns={"a": "monto"}).columns.tolist())`,
          output: `['monto']`,
        },
      },
      {
        id: "S17-T3-A-E1",
        subtopicId: "S17-T3-A",
        kind: "guided",
        instruction:
          "groupby region sum monto; imprime dict region->sum.",
        hint: "groupby sum.",
        hints: [
          "groupby sum.",
          "to_dict.",
        ],
        edgeCases: ["mean", "as_index confusion"],
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
df = pd.DataFrame({"region": ["Lima", "Lima", "Cusco"], "monto": [1.0, 2.0, 3.0]})
print(df.groupby("region")["monto"].sum().to_dict())`,
          output: `{'Cusco': 3.0, 'Lima': 3.0}`,
        },
      },
      {
        id: "S17-T3-A-E2",
        subtopicId: "S17-T3-A",
        kind: "independent",
        instruction:
          "transform mean de monto por region; imprime lista alineada a filas.",
        hint: "groupby transform.",
        hints: [
          "groupby transform.",
          "mismas filas que df.",
        ],
        edgeCases: ["agg colapsa", "map manual"],
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
df = pd.DataFrame({"region": ["Lima", "Lima", "Cusco"], "monto": [1.0, 3.0, 2.0]})
print(df.groupby("region")["monto"].transform("mean").tolist())`,
          output: `[2.0, 2.0, 2.0]`,
        },
      },
      {
        id: "S17-T3-A-E3",
        subtopicId: "S17-T3-A",
        kind: "transfer",
        instruction:
          "agg con total sum y n count as_index=False; imprime columnas.",
        hint: "named agg.",
        hints: [
          "named agg.",
          "as_index=False.",
        ],
        edgeCases: ["MultiIndex cols", "sin names"],
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
df = pd.DataFrame({"region": ["Lima", "Cusco"], "monto": [1.0, 2.0]})
out = df.groupby("region", as_index=False).agg(total=("monto", "sum"), n=("monto", "count"))
print(out.columns.tolist())`,
          output: `['region', 'total', 'n']`,
        },
      },
      {
        id: "S17-T3-B-E1",
        subtopicId: "S17-T3-B",
        kind: "guided",
        instruction:
          "rolling(2).mean sobre [1,2,3]; imprime lista con primer valor nan como None.",
        hint: "rolling mean.",
        hints: [
          "rolling mean.",
          "tolist y nan check.",
        ],
        edgeCases: ["min_periods", "window 3"],
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
s = pd.Series([1.0, 2.0, 3.0]).rolling(2).mean()
print([None if pd.isna(x) else float(x) for x in s])`,
          output: `[None, 1.5, 2.5]`,
        },
      },
      {
        id: "S17-T3-B-E2",
        subtopicId: "S17-T3-B",
        kind: "independent",
        instruction:
          "Asigna cohort YYYY-MM con min fecha por cliente; imprime dict id->cohort único.",
        hint: "groupby transform min.",
        hints: [
          "groupby transform min.",
          "dt.to_period('M').",
        ],
        edgeCases: ["usar max", "string slice frágil"],
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
    "cliente_id": ["C001", "C001", "C002"],
    "fecha": pd.to_datetime(["2024-01-05", "2024-03-01", "2024-02-10"]),
})
df["cohort"] = df.groupby("cliente_id")["fecha"].transform("min").dt.to_period("M").astype(str)
print(df.drop_duplicates("cliente_id").set_index("cliente_id")["cohort"].to_dict())`,
          output: `{'C001': '2024-01', 'C002': '2024-02'}`,
        },
      },
      {
        id: "S17-T3-B-E3",
        subtopicId: "S17-T3-B",
        kind: "transfer",
        instruction:
          "Ordena por fecha antes de rolling sobre montos diarios y muestra última media window 2.",
        hint: "sort_index.",
        hints: [
          "sort_index.",
          "rolling 2.",
        ],
        edgeCases: ["sin ordenar", "window wrong"],
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
s = pd.Series([3.0, 1.0, 2.0], index=pd.to_datetime(["2024-01-03", "2024-01-01", "2024-01-02"]))
s = s.sort_index()
print(float(s.rolling(2).mean().iloc[-1]))`,
          output: `2.5`,
        },
      },
      {
        id: "S17-T4-A-E1",
        subtopicId: "S17-T4-A",
        kind: "guided",
        instruction:
          "Verifica abs(sum(parts)-total)<1e-9; imprime True.",
        hint: "sum y abs.",
        hints: [
          "sum y abs.",
          "eps 1e-9.",
        ],
        edgeCases: ["== exact float risk", "wrong total"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `parts=[10.0,20.0,70.0]; total=100.0
# TODO
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `parts = [10.0, 20.0, 70.0]
total = 100.0
print(abs(sum(parts) - total) < 1e-9)`,
          output: `True`,
        },
      },
      {
        id: "S17-T4-A-E2",
        subtopicId: "S17-T4-A",
        kind: "independent",
        instruction:
          "Tasa pagados/activos con activos=40 pagados=10; imprime 0.25.",
        hint: "división float.",
        hints: [
          "división float.",
          "print tasa.",
        ],
        edgeCases: ["denominador pagados", "porcentaje 25"],
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
          code: `activos = 40
pagados = 10
print(pagados / activos)`,
          output: `0.25`,
        },
      },
      {
        id: "S17-T4-A-E3",
        subtopicId: "S17-T4-A",
        kind: "transfer",
        instruction:
          "Bridge: total 100, lima 60, resto debe ser 40; imprime residual.",
        hint: "total - lima.",
        hints: [
          "total - lima.",
          "residual.",
        ],
        edgeCases: ["doble conteo", "ratios wrong"],
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
          code: `total = 100.0
lima = 60.0
print(total - lima)`,
          output: `40.0`,
        },
      },
      {
        id: "S17-T4-B-E1",
        subtopicId: "S17-T4-B",
        kind: "guided",
        instruction:
          "Filtra fechas <= cutoff 2024-01-31; imprime montos list.",
        hint: "Timestamp cutoff.",
        hints: [
          "Timestamp cutoff.",
          "máscara <=.",
        ],
        edgeCases: ["< vs <=", "string compare"],
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
tx = pd.DataFrame({"fecha": pd.to_datetime(["2024-01-01", "2024-02-01"]), "monto": [1.0, 9.0]})
cutoff = pd.Timestamp("2024-01-31")
print(tx.loc[tx["fecha"] <= cutoff, "monto"].tolist())`,
          output: `[1.0]`,
        },
      },
      {
        id: "S17-T4-B-E2",
        subtopicId: "S17-T4-B",
        kind: "independent",
        instruction:
          "Compara sum pre-cutoff vs sum total; imprime delta de leakage.",
        hint: "total - pre.",
        hints: [
          "total - pre.",
          "float.",
        ],
        edgeCases: ["delta invertido", "mean"],
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
tx = pd.DataFrame({"fecha": pd.to_datetime(["2024-01-01", "2024-03-01"]), "monto": [10.0, 5.0]})
cutoff = pd.Timestamp("2024-01-31")
pre = tx.loc[tx["fecha"] <= cutoff, "monto"].sum()
print(float(tx["monto"].sum() - pre))`,
          output: `5.0`,
        },
      },
      {
        id: "S17-T4-B-E3",
        subtopicId: "S17-T4-B",
        kind: "transfer",
        instruction:
          "Feature as-of: max monto con fecha<=cutoff por cliente; imprime dict.",
        hint: "filter then groupby max.",
        hints: [
          "filter then groupby max.",
          "un cliente.",
        ],
        edgeCases: ["usar max global", "min fecha"],
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
tx = pd.DataFrame({
    "cliente_id": ["C001", "C001"],
    "fecha": pd.to_datetime(["2024-01-01", "2024-05-01"]),
    "monto": [3.0, 10.0],
})
cutoff = pd.Timestamp("2024-02-01")
feat = tx[tx["fecha"] <= cutoff].groupby("cliente_id")["monto"].max()
print(feat.to_dict())`,
          output: `{'C001': 3.0}`,
        },
      },
    ],
  },
  youDo: {
    title: "Executive Data Quality & EDA Portfolio (cierre CP-N2-A)",
    context:
      "Integra clientes/transacciones sintéticas limpias (S15–S16) con joins validados, reshape, groupby, reconciliación de totales y controles de leakage. Entrega script reproducible, respuestas de negocio con evidencia y memo de límites/no-claims. Sin PII real.",
    objectives: [
      "Dataset limpio + notebook/script reproducible",
      "Reconciliación de totales y denominadores",
      "Preguntas de negocio respondidas con evidencia",
      "Memo de límites y no-claims",
    ],
    requirements: [
      "Fixtures sintéticos end-to-end",
      "Demo reproducible (if __name__ == '__main__')",
      "Documentación en español profesional",
      "Alineación al cierre CP-N2-A",
    ],
    starterCode: `import pandas as pd

def portfolio_summary(clientes: pd.DataFrame, tx: pd.DataFrame, cutoff: str) -> dict:
    """Joins, métricas, reconciliación y agregados pre-cutoff."""
    # TODO
    raise NotImplementedError

if __name__ == "__main__":
    clientes = pd.DataFrame({"cliente_id": ["C001", "C002"], "region": ["Lima", "Cusco"]})
    tx = pd.DataFrame({
        "cliente_id": ["C001", "C001", "C002"],
        "fecha": pd.to_datetime(["2024-01-10", "2024-03-01", "2024-01-20"]),
        "monto": [10.0, 50.0, 5.0],
    })
    print(portfolio_summary(clientes, tx, "2024-01-31"))
`,
    portfolioNote:
      "Este cierre de CP-N2-A debe poder mostrarse a un stakeholder no técnico: métricas, reconciliación, límites y ausencia de claims causales no soportados.",
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
        question: "validate='one_to_one' en merge sirve para:",
        options: ["Fallar si la cardinalidad no es 1:1", "Imputar nulls", "Ordenar el DF", "Crear MultiIndex"],
        correctIndex: 0,
        explanation:
          "validate verifica la cardinalidad del merge.",
      },
      {
        question: "Un anti-join left_only identifica:",
        options: ["Solo matches perfectos", "Duplicados exactos internos", "Filas del left sin match en right", "Schema drift de dtypes"],
        correctIndex: 2,
        explanation:
          "left_only = huérfanos del lado izquierdo.",
      },
      {
        question: "transform en groupby:",
        options: ["Siempre colapsa a una fila por grupo", "Elimina el index", "Solo funciona con MultiIndex", "Reinyecta el agregado al shape original"],
        correctIndex: 3,
        explanation:
          "transform alinea el resultado al índice original.",
      },
      {
        question: "Leakage temporal ocurre cuando:",
        options: ["Usas CSV en vez de Excel", "Incluyes datos posteriores al cutoff en features/métricas del pasado", "Haces melt", "Documentas el denominador"],
        correctIndex: 1,
        explanation:
          "Información del futuro contamina el análisis before/after.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "pandas merge",
        url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html",
        note: "validate, indicator",
      },
      {
        label: "pandas groupby",
        url: "https://pandas.pydata.org/docs/user_guide/groupby.html",
        note: "agg/transform",
      },
    ],
    books: [
      {
        label: "Python for Data Analysis — wrangling",
        note: "joins, reshape, groupby",
      },
    ],
    courses: [
      {
        label: "pandas reshaping",
        url: "https://pandas.pydata.org/docs/user_guide/reshaping.html",
        note: "melt/pivot",
      },
    ],
  },
}
