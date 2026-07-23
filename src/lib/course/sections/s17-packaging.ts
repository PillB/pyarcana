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
    "Cerrar un **portfolio de data quality + EDA** en banca, fintech o retail en Perú exige joins con cardinalidad documentada, reshape long/wide estable, groupby con contratos de agregación y reconciliación de totales sin leakage temporal. Esta sección (id `packaging` conservado) retematiza a V3 y **cierra CP-N2-A** con evidencias reproducibles y memo de límites — sin PII real ni claims causales no soportados.",
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
        "En V3, **S17 no es el path de pyproject.toml ni PyPI**. El id de plataforma `packaging` se conserva, pero el camino del estudiante es el **cierre de CP-N2-A**: unir tablas sintéticas de clientes y transacciones, reshapes long/wide, agregaciones con groupby y un memo de reconciliación sin leakage temporal.",
        "El hilo conductor es un **portfolio ejecutivo de data quality + EDA** con regiones ficticias (Lima, Cusco, Arequipa), `cliente_id` tipo `C00x` y montos en PEN sintéticos. Entregable: dataset limpio + script reproducible + respuestas de negocio con evidencia + memo de límites y no-claims. Nunca PII real.",
        "Orden pedagógico: **T1 Joins** (claves, cardinalidad, validate, anti-join) → **T2 Forma** (concat, melt, pivot, nombres estables) → **T3 Agregación** (groupby/agg/transform, ventanas y cohortes) → **T4 Reconciliación** (totales, denominadores, cutoff anti-leakage). Solo APIs de pandas ya vistas en S15–S16 más merge/groupby de esta sección.",
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
        "`merge`/`join` combina tablas por clave con `how` ∈ {inner, left, right, outer}. La **cardinalidad** esperada (1:1, 1:m, m:1, m:m) determina si el número de filas se mantiene, crece (fan-out) o produce cartesianos accidentales. En un maestro de clientes 1:1 la clave debe ser única; en transacciones 1:m es normal que un `cliente_id` se repita.",
        "Contrato operativo: **antes del merge** verifica dtype alineado (ambos `str` tras normalización S16), unicidad de la clave en el lado 1 (`Series.is_unique` o `nunique()==len`) y cuenta filas pre/post. Si `len(out) >> len(left)` en un supuesto 1:1, hay fan-out o clave sucia — no sigas al EDA.",
        "Caso sintético Perú: `cli` (C001 Lima, C002 Cusco) left-merge con `tx` (dos filas C001, ninguna C003). Salida esperada: C001 se duplica por monto; C002 queda con NaN en columnas de tx. Documenta `rows_cli → rows_merge` en el portfolio.",
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
        "El parámetro `validate='one_to_one'|'one_to_many'|...` hace que pandas **falle temprano** con `MergeError` si la cardinalidad real no coincide con el contrato. Es un quality gate de join, no un nice-to-have: un m:m accidental multiplica filas y sesga sumas de montos.",
        "`indicator=True` agrega la columna `_merge` con valores `left_only` / `right_only` / `both`. El **anti-join** clásico filtra `left_only` (clientes sin transacciones) o, al revés, `right_only` (tx huérfanas sin maestro). Cuenta huérfanos y expórtalos a una tabla de evidencia.",
        "Caso sintético: cli={C001,C002}, tx={C001,C003}. Left anti-join → C002; right-only → C003. Si intentas `validate='one_to_one'` con C001 duplicado en tx, debes capturar el error e imprimir un fallo controlado — no silenciar con except vacío.",
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
        "`concat` apila filas (`axis=0`) o alinea columnas (`axis=1`). `melt` lleva **wide→long** (ideal para series por mes); `pivot` / `pivot_table` hacen **long→wide** para reportes tabulares. Elige long cuando el análisis es multipunto en el tiempo; wide cuando el stakeholder pide una fila por cliente y columnas por periodo.",
        "Contrato: declara `id_vars` / `value_vars` o `index`+`columns`+`values`, y en `pivot_table` fija **`aggfunc` explícito** (p. ej. `sum`) para no depender del default. Tras concat, usa `ignore_index=True` o `keys=` si necesitas trazabilidad del origen.",
        "Fixture sintético: wide con columnas `ene`/`feb` por `cliente_id` → melt a (`cliente_id`,`mes`,`monto`) → pivot_table de regreso. Verifica `len(long)==n_clientes*n_meses` y que la suma de montos se conserve bajo aggfunc sum.",
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
        "Tras un pivot, las columnas pueden ser MultiIndex o nombres crudos (`ene`, `feb`). El portfolio exige un **schema estable**: p. ej. `cliente_id`, `monto_ene`, `monto_feb`. Aplanar con f-strings o `map` y **validar** `set(df.columns)==expected` (el orden se documenta aparte si importa al export).",
        "Contrato de nombres: lista ordenada en el memo del CP-N2-A; cualquier rename silencioso rompe el dashboard o el diff del PR. Prefiere `rename(columns={...})` con dict explícito sobre mutaciones ad hoc de `.columns`.",
        "Caso: long (`cliente_id`,`mes`,`monto`) → pivot → prefijo `monto_`. Imprime columnas y un booleano de igualdad de sets. Si falta `monto_feb`, el gate de schema del portfolio debe fallar de forma explicable (concepto S16), no más adelante en el plot.",
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
        "`groupby` + `agg` **colapsa** grupos a una fila por clave (resúmenes ejecutivos). `transform` **reinyecta** el agregado al shape original (features a nivel fila: monto / media_región). Named aggregation (`total=('monto','sum')`) documenta el contrato de columnas de salida.",
        "Contrato: `as_index=False` facilita merges posteriores; no mezcles sin documentar si el index del groupby es la clave. Evita aplicar `mean` cuando la pregunta de negocio pide **suma de PEN** o conteos de clientes.",
        "Caso sintético: regiones Lima/Cusco con montos → `agg` produce total y n; `transform('mean')` deja la media regional en cada fila. El EDA del portfolio usa agg para tablas y transform para scores relativos sin leakage de fechas (eso es T4-B).",
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
        "`rolling` construye **ventanas móviles** sobre series ordenadas; `resample` requiere DatetimeIndex. Una **cohorte** etiqueta a cada cliente por el periodo de su primera observación válida (p. ej. mes de primera compra), no por la fecha del batch de hoy.",
        "Contrato: **ordena por fecha** antes de rolling; documenta tamaño de ventana (2 periodos, 7d) y el tratamiento de NaN iniciales. Cohorte = `groupby(cliente_id)[fecha].transform('min').dt.to_period('M')` (o equivalente estable).",
        "Caso: tx en ene–mar 2024; C001 cohorte 2024-01; media móvil de montos diarios con window=2. Estas series alimentan preguntas de retención del portfolio ejecutivo sin afirmar causalidad — el memo declara no-claims explícitos.",
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
        "Reconciliación ejecutiva: la **suma de partes debe igualar el total** de referencia (o la diferencia queda documentada con tolerancia `abs(diff)<eps`). Los **denominadores** de tasas (pagados/activos, completos/universo) deben ser el mismo filtro que declaras en el texto del hallazgo.",
        "Contrato bridge: `total → segmento_A → residual`. Si Lima=60 y total=100, el residual del resto es 40. Nunca uses un denominador de otro corte temporal o geográfico solo porque “sale un número bonito” en el slide.",
        "Caso sintético: total nacional 100 PEN; partes Lima/Cusco/Arequipa; tasa de completitud 150/200=0.75. El portfolio imprime `diff`, `reconciled` y la tasa con su denominador explícito para el stakeholder no técnico.",
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
        "**Leakage temporal** es usar información con fecha posterior al **cutoff** para features o métricas de un periodo “antes”. Invalida comparaciones before/after y cualquier score de “riesgo a enero” que mira febrero.",
        "Controles: cutoff estricto (`fecha <= t`), agregados solo sobre el subconjunto pre-cutoff, y comparación explícita `sum_total - sum_pre` como **delta de leakage** en el memo. As-of = “solo lo conocido a la fecha t”.",
        "Caso: C001 con tx 10 PEN en ene y 999 en mar; cutoff 2024-01-31 → feature segura 10, leaky 1009, delta de leakage 999. El cierre CP-N2-A debe demostrar al menos un control as-of de este tipo en el script reproducible.",
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
          "E1 (guiado) — Concepto: left join clientes–transacciones. Fixture `FIX-S17-T1A-E1`: cli={C001,C002}, tx={C001:1.0}. Haz `merge` por `cliente_id` con `how='left'` e imprime `len` del resultado. Pass: una línea con `2` (C002 se conserva aunque sin tx).",
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
          "E2 (independiente) — Concepto: unicidad de clave 1:1. Fixture `FIX-S17-T1A-E2`: cli con `cliente_id` duplicado C001,C001. Imprime `bool(cli['cliente_id'].is_unique)`. Pass exacto: `False`. No uses drop_duplicates para “arreglar” antes de medir.",
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
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C001"]})
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(bool(cli["cliente_id"].is_unique))
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
          "E3 (transferencia) — Concepto: fan-out 1:m. Fixture: 1 cliente C001 y 3 filas de tx con el mismo id. `inner` merge por `cliente_id`; imprime la longitud. Pass: `3`. Demuestra que el lado m multiplica filas aunque el left tenga una sola clave.",
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
cli = pd.DataFrame({"cliente_id": ["C001"]})
tx = pd.DataFrame({"cliente_id": ["C001"] * 3, "monto": [1.0, 2.0, 3.0]})
# TODO: inner merge y print(len(...)) → debe ser 3
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
          "E1 (guiado) — Concepto: anti-join con `indicator=True`. Fixture cli={C001,C002}, tx solo C001. Left merge + filtra `_merge=='left_only'`; imprime lista de `cliente_id`. Pass: `['C002']` (huérfano sin transacciones).",
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
cli = pd.DataFrame({"cliente_id": ["C001", "C002"]})
tx = pd.DataFrame({"cliente_id": ["C001"], "monto": [1.0]})
# TODO: left merge indicator=True; print lista left_only
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
          "E2 (independiente) — Concepto: `validate='one_to_one'` como gate. Fixture a={id:1}, b={id:1,1}. Intenta merge one_to_one; ante excepción imprime exactamente `fail`. Pass: `fail`. No uses validate many_to_many para silenciar el error.",
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
a = pd.DataFrame({"id": [1]})
b = pd.DataFrame({"id": [1, 1]})
# TODO: validate one_to_one; on Exception print("fail")
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
          "E3 (transferencia) — Concepto: conteo de huérfanos (anti-join). Fixture cli 3 ids, tx solo C001. Cuenta filas `left_only` tras left merge con indicator. Pass entero: `2`. Reporta el conteo, no la lista, para el dashboard de calidad.",
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
cli = pd.DataFrame({"cliente_id": ["C001", "C002", "C003"]})
tx = pd.DataFrame({"cliente_id": ["C001"]})
# TODO: cuenta left_only (anti-join) → int 2
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
          "E1 (guiado) — Concepto: melt wide→long. Fixture 2 filas × columnas a,b (`id` 1..2). `melt(id_vars='id', value_vars=['a','b'])` e imprime `len`. Pass: `4`. Contrato: n_long = n_filas * n_value_vars.",
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
df = pd.DataFrame({"id": [1, 2], "a": [10, 20], "b": [3, 4]})
# TODO: melt id_vars=id value_vars a,b; print(len) → 4
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
          "E2 (independiente) — Concepto: pivot_table long→wide. Fixture long id=1, k∈{a,b}, v={1.0,2.0}. `pivot_table` con `aggfunc='sum'`, `reset_index()`, imprime `columns.tolist()`. Pass: `['id', 'a', 'b']`.",
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
long = pd.DataFrame({"id": [1, 1], "k": ["a", "b"], "v": [1.0, 2.0]})
# TODO: pivot_table sum + reset_index; print columns.tolist()
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
          "E3 (transferencia) — Concepto: concat vertical. Fixture dos DF de una fila cada uno (columna x). `pd.concat(..., ignore_index=True)` e imprime `len`. Pass: `2`. No uses axis=1 (eso alinea columnas, no apila casos).",
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
a = pd.DataFrame({"x": [1]})
b = pd.DataFrame({"x": [2]})
# TODO: concat axis=0 ignore_index; print(len) → 2
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
          "E1 (guiado) — Concepto: nombres estables post-pivot. Fixture long id/mes/monto con meses e,f. Pivot y renombra a `monto_{mes}`; imprime `list(columns)`. Pass: `['monto_e', 'monto_f']`. Schema del portfolio, no MultiIndex crudo.",
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
long = pd.DataFrame({"id": [1, 1], "mes": ["e", "f"], "monto": [1.0, 2.0]})
# TODO: pivot y renombra monto_{mes}; print list(columns)
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
          "E2 (independiente) — Concepto: validación de schema de columnas. DF con columns cliente_id, monto_ene; expected={cliente_id, monto_ene}. Imprime `set(columns)==expected`. Pass: `True`. Sets ignoran orden; documenta orden en el memo si exportas CSV.",
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
df = pd.DataFrame(columns=["cliente_id", "monto_ene"])
expected = {"cliente_id", "monto_ene"}
# TODO: print set(df.columns) == expected
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
          "E3 (transferencia) — Concepto: rename explícito. Fixture DF columna `a`. `rename(columns={'a':'monto'})` e imprime columns list. Pass: `['monto']`. Prefiere dict rename sobre reasignar `.columns` a ciegas.",
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
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
import pandas as pd
df = pd.DataFrame({"a": [1]})
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(df.rename(columns={"a": "monto"}).columns.tolist())
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
          "E1 (guiado) — Concepto: groupby + sum. Fixture region Lima×2 y Cusco×1 con montos 1,2,3. Imprime `groupby('region')['monto'].sum().to_dict()`. Pass: `{'Cusco': 3.0, 'Lima': 3.0}` (orden de keys puede seguir sort de pandas).",
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
df = pd.DataFrame({"region": ["Lima", "Lima", "Cusco"], "monto": [1.0, 2.0, 3.0]})
# TODO: groupby region sum monto → to_dict(); print
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
          "E2 (independiente) — Concepto: transform mean al shape original. Fixture Lima 1.0/3.0 y Cusco 2.0. Imprime lista de `groupby('region')['monto'].transform('mean')`. Pass: `[2.0, 2.0, 2.0]`. No uses agg (colapsa filas).",
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
df = pd.DataFrame({"region": ["Lima", "Lima", "Cusco"], "monto": [1.0, 3.0, 2.0]})
# TODO: transform mean; print lista alineada a filas
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
          "E3 (transferencia) — Concepto: named agg + as_index=False. Fixture region Lima/Cusco. `agg(total=('monto','sum'), n=('monto','count'))` e imprime columns.tolist(). Pass: `['region', 'total', 'n']`.",
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
df = pd.DataFrame({"region": ["Lima", "Cusco"], "monto": [1.0, 2.0]})
# TODO: named agg total/n as_index=False; print columns
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
          "E1 (guiado) — Concepto: rolling mean. Serie [1,2,3], window=2. Imprime lista con el primer NaN como `None` y el resto float. Pass: `[None, 1.5, 2.5]`. Documenta que el primer punto no tiene ventana completa.",
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
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
import pandas as pd
s = pd.Series([1.0, 2.0, 3.0]).rolling(2).mean()
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print([None if pd.isna(x) else float(x) for x in s])
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
          "E2 (independiente) — Concepto: cohorte mensual por primera fecha. Fixture C001 (ene y mar), C002 (feb). Asigna cohort YYYY-MM con min fecha; imprime dict id→cohort (únicos). Pass: `{'C001': '2024-01', 'C002': '2024-02'}`.",
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
df = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002"],
    "fecha": pd.to_datetime(["2024-01-05", "2024-03-01", "2024-02-10"]),
})
# TODO: cohort YYYY-MM por min fecha; dict id→cohort
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
          "E3 (transferencia) — Concepto: orden temporal antes de rolling. Serie desordenada por fecha con valores 3,1,2; ordena índice, rolling(2).mean(), imprime último valor float. Pass: `2.5`. Sin sort el resultado es incorrecto para el EDA.",
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
s = pd.Series([3.0, 1.0, 2.0], index=pd.to_datetime(["2024-01-03", "2024-01-01", "2024-01-02"]))
# TODO: sort_index + rolling(2).mean(); print último float
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
          "E1 (guiado) — Concepto: reconciliación de totales. parts=[10,20,70], total=100. Imprime `abs(sum(parts)-total)<1e-9`. Pass: `True`. Usa tolerancia eps, no igualdad frágil si hubiera floats ruidosos.",
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
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
parts = [10.0, 20.0, 70.0]
total = 100.0
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(abs(sum(parts) - total) < 1e-9)
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
          "E2 (independiente) — Concepto: tasa con denominador correcto. activos=40, pagados=10. Imprime pagados/activos. Pass: `0.25`. No imprimas 25 ni uses pagados como denominador.",
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
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
activos = 40
pagados = 10
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(pagados / activos)
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
          "E3 (transferencia) — Concepto: bridge residual. total=100, lima=60; imprime residual del resto (total-lima). Pass: `40.0`. Es el primer paso de una bridge table nacional→Lima→resto.",
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
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
total = 100.0
lima = 60.0
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(total - lima)
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
          "E1 (guiado) — Concepto: filtro pre-cutoff. Fixture fechas 2024-01-01 y 2024-02-01 con montos 1.0 y 9.0; cutoff 2024-01-31. Imprime lista de montos con fecha<=cutoff. Pass: `[1.0]`.",
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
tx = pd.DataFrame({"fecha": pd.to_datetime(["2024-01-01", "2024-02-01"]), "monto": [1.0, 9.0]})
cutoff = pd.Timestamp("2024-01-31")
# TODO: print montos con fecha <= cutoff
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
          "E2 (independiente) — Concepto: delta de leakage. Fixture montos 10 (ene) y 5 (mar); cutoff fin de enero. Imprime float(sum_total - sum_pre). Pass: `5.0`. Ese delta es la contaminación si usas el total global.",
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
tx = pd.DataFrame({"fecha": pd.to_datetime(["2024-01-01", "2024-03-01"]), "monto": [10.0, 5.0]})
cutoff = pd.Timestamp("2024-01-31")
# TODO: print delta leakage = sum_total - sum_pre
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
          "E3 (transferencia) — Concepto: feature as-of max. C001 con montos 3 (ene) y 10 (may); cutoff 2024-02-01. max monto con fecha<=cutoff por cliente; imprime dict. Pass: `{'C001': 3.0}`. Prohibido max global post-cutoff.",
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
tx = pd.DataFrame({
    "cliente_id": ["C001", "C001"],
    "fecha": pd.to_datetime(["2024-01-01", "2024-05-01"]),
    "monto": [3.0, 10.0],
})
cutoff = pd.Timestamp("2024-02-01")
# TODO: max monto as-of cutoff por cliente → dict
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
      "Integra clientes/transacciones sintéticas limpias (S15–S16) con joins validados (cardinalidad + anti-join), reshape long/wide con schema estable, groupby/agg/transform, reconciliación de totales/denominadores y controles de leakage con cutoff. Entrega script reproducible (`if __name__`), respuestas de negocio con evidencia numérica y memo de límites/no-claims en ES-PE. Sin PII real ni datos de producción.",
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
          "validate es un gate de cardinalidad: lanza MergeError si el join no es 1:1, evitando fan-out silencioso que infla sumas de montos.",
      },
      {
        question: "Un anti-join left_only identifica:",
        options: ["Solo matches perfectos", "Duplicados exactos internos", "Filas del left sin match en right", "Schema drift de dtypes"],
        correctIndex: 2,
        explanation:
          "Con indicator=True, left_only marca filas del left sin contraparte en right (p. ej. clientes sin transacciones).",
      },
      {
        question: "transform en groupby:",
        options: ["Siempre colapsa a una fila por grupo", "Elimina el index", "Solo funciona con MultiIndex", "Reinyecta el agregado al shape original"],
        correctIndex: 3,
        explanation:
          "transform devuelve una serie alineada al índice original; agg colapsa a una fila por grupo. Úsalos según el contrato (feature fila vs resumen).",
      },
      {
        question: "Leakage temporal ocurre cuando:",
        options: ["Usas CSV en vez de Excel", "Incluyes datos posteriores al cutoff en features/métricas del pasado", "Haces melt", "Documentas el denominador"],
        correctIndex: 1,
        explanation:
          "Cualquier agregado o feature con fecha > cutoff contamina el análisis before/after; filtra as-of y reporta el delta de leakage.",
      },
      {
        question: "En un portfolio ejecutivo, si suma(partes) ≠ total de referencia debes:",
        options: ["Documentar diff con tolerancia eps o corregir el corte", "Ignorar la diferencia si es <10%", "Borrar la región más grande", "Cambiar a inner join siempre"],
        correctIndex: 0,
        explanation:
          "La reconciliación exige igualdad bajo eps o una bridge table con residual documentado; no se oculta el descuadre.",
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
