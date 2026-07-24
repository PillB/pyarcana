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
 icon: "GitMerge",
 accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
 jobRelevance:
 "En un equipo de analytics de banca, fintech o retail en Perú (p. ej. un tablero de clientes y transacciones en Lima, Cusco o Arequipa), el analista que solo “hace merge y groupby” sin documentar **cardinalidad**, sin **anti-join** de huérfanos y sin **cutoff** anti-leakage es el que entrega números inflados al comité. Cerrar un **portfolio de data quality + EDA** exige unir tablas con claves limpias, reshape long/wide con schema estable, agregaciones con contrato (suma vs media) y reconciliación de totales que un stakeholder no técnico pueda auditar. Aquí cierras ese portfolio del nivel: script reproducible, evidencias numéricas, memo de límites y **sin PII real ni claims causales** no soportados.",
 learningOutcomes: [
 { text: "Diseñar joins (merge) con claves alineadas y cardinalidad 1:1 / 1:m documentada (filas pre/post)" },
 { text: "Usar validate y anti-join (indicator) para detectar fan-out y filas huérfanas" },
 { text: "Reshapear tablas con concat, melt y pivot_table con aggfunc explícito" },
 { text: "Mantener nombres de columnas estables en long/wide y validar el set expected" },
 { text: "Agregar con groupby/agg (resúmenes) y transform (features a nivel fila)" },
 { text: "Construir ventanas rolling, fechas ordenadas y cohortes por primera observación" },
 { text: "Reconciliar denominadores y totales (diff, residual, tolerancia eps)" },
 { text: "Controlar leakage temporal con cutoff/as-of y reportar el delta de leakage" }
 ],
 theory: [
 {
 heading: "Mapa de la sección: joins → forma → agregación → reconciliación",
 paragraphs: [
 "En esta sección **cierras el portfolio de calidad + EDA**: unes tablas sintéticas de clientes y transacciones, reshapes long/wide, agregas con groupby y redactas un memo de reconciliación **sin leakage temporal**. El empaquetado de módulos/CLI ya se trabajó en la sección de módulos y CLI; aquí el “paquete” es la evidencia analítica reproducible que un stakeholder puede re-ejecutar.",
 "El hilo conductor es un **portfolio ejecutivo** con regiones ficticias (Lima, Cusco, Arequipa), `cliente_id` tipo `C00x` y montos en PEN sintéticos. Entregable: dataset limpio + script reproducible + respuestas de negocio con evidencia + memo de límites y no-claims. Nunca PII real ni datos de producción. Cada bloque de teoría termina en un demo (I Do) y tres ejercicios (We Do); el You Do integra todo en un solo script.",
 "Orden pedagógico (gradual release): **T1 Joins** (claves, cardinalidad, validate, anti-join) → **T2 Forma** (concat, melt, pivot, nombres estables) → **T3 Agregación** (groupby/agg/transform, ventanas y cohortes) → **T4 Reconciliación** (totales, denominadores, cutoff anti-leakage). Solo APIs de pandas ya vistas en S15–S16 más merge/groupby de esta sección. **Ritmo sugerido (~18 h):** ~4 h T1, ~4 h T2, ~5 h T3, ~3 h T4 + We Do de integración, ~2 h You Do/memo. **Después, S18** abre la lectura de incertidumbre (hallazgo vs hipótesis, intervalos): aquí dejas las tablas y los gates listos para esa capa.",
 ],
 callout: {
 type: "info",
 title: "Qué empaquetas aquí",
 content:
 "No publicas un paquete en PyPI: empaquetas un **dataset limpio, un script reproducible y un memo de límites** para un stakeholder. Joins y groupby son el camino. Si no puedes re-ejecutar el script y recuperar los mismos números, el “paquete” no está listo.",
 },
 },
 {
 heading: "Diccionario rápido de la sección",
 paragraphs: [
 "**Cardinalidad:** cuántas filas del lado derecho (o izquierdo) corresponden a cada clave (1:1, 1:m, m:m). **Fan-out:** explosión de filas por claves duplicadas en un join (típico m:m accidental). **Anti-join:** filas de un lado sin match (`left_only` / `right_only` con `indicator=True`). **Long/wide:** forma apilada por periodo (long) versus una columna por periodo (wide).",
 "**Cohorte:** periodo de la primera observación válida de cada entidad (p. ej. mes de primera compra), no la fecha del batch de hoy. **Cutoff / as-of:** solo datos conocidos hasta la fecha *t* (`fecha <= t`). **Leakage temporal:** usar post-cutoff como si fuera pasado. **Reconciliación:** suma de partes ≈ total de referencia (tolerancia `eps`) o residual documentado en una tabla puente (**bridge**).",
 "Úsalo como glosario de trabajo: cada demo y ejercicio de esta sección nombra al menos uno de estos términos. Si un término aparece en el memo del portfolio, debe poder mapearse a una línea de código o a un número impreso — no a una frase suelta del slide.",
 ],
 callout: {
 type: "tip",
 title: "Antes de merge, alinea dtypes (puente S16)",
 content:
 "Tras S16, normaliza `cliente_id` a str en ambos lados y verifica unicidad en el lado 1. Un join str↔int produce huérfanos falsos; un maestro con ids duplicados invalida el supuesto 1:1 antes del merge.",
 },
 },
 {
 heading: "Claves y cardinalidad en joins",
 subtopicId: "S17-T1-A",
 paragraphs: [
 "`merge`/`join` combina tablas por clave con `how` ∈ {inner, left, right, outer}. La **cardinalidad** esperada (1:1, 1:m, m:1, m:m) determina si el número de filas se mantiene, crece (fan-out) o produce cartesianos accidentales. En un maestro de clientes 1:1 la clave debe ser única; en transacciones 1:m es normal que un `cliente_id` se repita.",
 "Contrato operativo: **antes del merge** verifica dtype alineado (ambos `str` tras normalización S16), unicidad de la clave en el lado 1 (`Series.is_unique` o `nunique()==len`) y cuenta filas pre/post. Si `len(out) >> len(left)` en un supuesto 1:1, hay fan-out o clave sucia — no sigas al EDA.",
 "Caso sintético Perú: `cli` (C001 Lima, C002 Cusco) left-merge con `tx` (dos filas C001 y una C003 huérfana de maestro). Salida esperada: C001 se duplica por monto; C002 queda con NaN en columnas de tx; C003 no entra al left-merge. Documenta `rows_cli → rows_merge` en el portfolio.",
 ],
 code: {
 language: 'python',
 title: "join_card.py",
 code: `def s17_th_1():
    import pandas as pd

    cli = pd.DataFrame({"cliente_id": ["C001", "C002"], "region": ["Lima", "Cusco"]})
    tx = pd.DataFrame({"cliente_id": ["C001", "C001", "C003"], "monto": [10.0, 5.0, 7.0]})
    print("cli_unique", cli["cliente_id"].is_unique)
    print("tx_unique", tx["cliente_id"].is_unique)
    m = cli.merge(tx, on="cliente_id", how="left")
    print(len(cli), len(tx), len(m))
    print(m.to_dict(orient="list"))

s17_th_1()`,
 output: `cli_unique True
tx_unique False
2 3 3
{'cliente_id': ['C001', 'C001', 'C002'], 'region': ['Lima', 'Lima', 'Cusco'], 'monto': [10.0, 5.0, nan]}`,
 },
 callout: {
 type: "tip",
 title: "Cuenta filas pre/post",
 content:
 "Si `len(out) >> len(left)` en un supuesto 1:1, hay fan-out o clave sucia: detén el EDA, exporta el anti-join de duplicados y documenta `rows_cli → rows_merge` antes de sumar montos.",
 },
 },
 {
 heading: "Validate, duplicación accidental y anti-join",
 subtopicId: "S17-T1-B",
 paragraphs: [
 "El parámetro `validate='one_to_one'|'one_to_many'|...` hace que pandas **falle temprano** con `MergeError` si la cardinalidad real no coincide con el contrato. Es un quality gate de join, no un lujo opcional: un m:m accidental multiplica filas y sesga sumas de montos.",
 "`indicator=True` agrega la columna `_merge` con valores `left_only` / `right_only` / `both`. El **anti-join** clásico filtra `left_only` (clientes sin transacciones) o, al revés, `right_only` (tx huérfanas sin maestro). Cuenta huérfanos y expórtalos a una tabla de evidencia.",
 "Caso sintético: cli={C001,C002}, tx={C001,C003}. Left anti-join → C002; right-only → C003. Si intentas `validate='one_to_one'` con C001 duplicado en tx, debes capturar el error e imprimir un fallo controlado — no silenciar con except vacío.",
 ],
 code: {
 language: 'python',
 title: "validate_anti.py",
 code: `def s17_th_2():
    import pandas as pd

    cli = pd.DataFrame({"cliente_id": ["C001", "C002"]})
    tx = pd.DataFrame({"cliente_id": ["C001", "C003"], "monto": [1.0, 2.0]})
    m = cli.merge(tx, on="cliente_id", how="left", indicator=True)
    anti = m[m["_merge"] == "left_only"]
    print(m["_merge"].tolist())
    print("huerfanos", anti["cliente_id"].tolist())
    try:
     cli.merge(pd.DataFrame({"cliente_id": ["C001", "C001"]}), on="cliente_id", validate="one_to_one")
    except pd.errors.MergeError as e:
     print("validate_fail", True)

s17_th_2()`,
 output: `['both', 'left_only']
huerfanos ['C002']
validate_fail True`,
 },
 callout: {
 type: "warning",
 title: "m:m accidental",
 content:
 "Duplicados en ambos lados explotan filas y sesgan sumas de PEN. Usa `validate` para fallar temprano; si el contrato es 1:m, declara ese supuesto y no uses `one_to_one`.",
 },
 },
 {
 heading: "Concat, melt y pivot",
 subtopicId: "S17-T2-A",
 paragraphs: [
 "`concat` apila filas (`axis=0`) o alinea columnas (`axis=1`). `melt` lleva **wide→long** (ideal para series por mes); `pivot` / `pivot_table` hacen **long→wide** para reportes tabulares. Elige long cuando el análisis es multipunto en el tiempo; wide cuando el stakeholder pide una fila por cliente y columnas por periodo.",
 "Contrato: declara `id_vars` / `value_vars` o `index`+`columns`+`values`, y en `pivot_table` fija **`aggfunc` explícito** (p. ej. `sum`) para no depender del default. Tras concat, usa `ignore_index=True` o `keys=` si necesitas trazabilidad del origen.",
 "Fixture sintético: wide con columnas `ene`/`feb` por `cliente_id` → melt a (`cliente_id`,`mes`,`monto`) → pivot_table de regreso. Verifica `len(long)==n_clientes*n_meses` y que la suma de montos se conserve bajo aggfunc sum.",
 ],
 code: {
 language: 'python',
 title: "melt_pivot.py",
 code: `def s17_th_3():
    import pandas as pd

    wide = pd.DataFrame({"cliente_id": ["C001", "C002"], "ene": [1, 2], "feb": [3, 4]})
    long = wide.melt(id_vars=["cliente_id"], var_name="mes", value_name="monto")
    back = long.pivot_table(index="cliente_id", columns="mes", values="monto", aggfunc="sum")
    print(long.to_dict(orient="list"))
    print(back.reset_index().to_dict(orient="list"))

s17_th_3()`,
 output: `{'cliente_id': ['C001', 'C002', 'C001', 'C002'], 'mes': ['ene', 'ene', 'feb', 'feb'], 'monto': [1, 2, 3, 4]}
{'cliente_id': ['C001', 'C002'], 'ene': [1, 2], 'feb': [3, 4]}`,
 },
 callout: {
 type: "tip",
 title: "aggfunc explícito",
 content:
 "En `pivot_table` declara siempre `aggfunc` (p. ej. `sum` para montos). Depender del default (a menudo mean) cambia el total de negocio sin que el código “falle”.",
 },
 },
 {
 heading: "Long/wide y nombres estables",
 subtopicId: "S17-T2-B",
 paragraphs: [
 "Tras un pivot, las columnas pueden ser MultiIndex o nombres crudos (`ene`, `feb`). El portfolio exige un **schema estable**: p. ej. `cliente_id`, `monto_ene`, `monto_feb`. Aplanar con f-strings o `map` y **validar** `set(df.columns)==expected` (el orden se documenta aparte si importa al export).",
 "Contrato de nombres: lista ordenada en el memo del portfolio; cualquier rename silencioso rompe el dashboard o el diff del PR. Prefiere `rename(columns={...})` con dict explícito sobre mutaciones ad hoc de `.columns`.",
 "Caso: long (`cliente_id`,`mes`,`monto`) → pivot → prefijo `monto_`. Imprime columnas y un booleano de igualdad de sets. Si falta `monto_feb`, el gate de schema del portfolio debe fallar de forma explicable (concepto S16), no más adelante en el plot.",
 ],
 code: {
 language: 'python',
 title: "stable_names.py",
 code: `def s17_th_4():
    import pandas as pd

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
    print(set(wide.columns) == set(expected))

s17_th_4()`,
 output: `['cliente_id', 'monto_ene', 'monto_feb']
True`,
 },
 callout: {
 type: "warning",
 title: "Schema estable",
 content:
 "Un rename silencioso rompe el dashboard y el diff del PR. Valida `set(df.columns) == expected` en el script; documenta el orden de columnas en el memo si el export lo exige.",
 },
 },
 {
 heading: "Groupby / agg / transform",
 subtopicId: "S17-T3-A",
 paragraphs: [
 "Con la forma long/wide ya estable, pasamos a **colapsar o reinyectar** números. `groupby` + `agg` **colapsa** grupos a una fila por clave (resúmenes ejecutivos). `transform` **reinyecta** el agregado al shape original (features a nivel fila: monto / media_región). Named aggregation (`total=('monto','sum')`) documenta el contrato de columnas de salida.",
 "Contrato: `as_index=False` facilita merges posteriores; no mezcles sin documentar si el index del groupby es la clave. Evita aplicar `mean` cuando la pregunta de negocio pide **suma de PEN** o conteos de clientes — el error más común en tableros es “promedio” cuando el stakeholder pidió “total”.",
 "Caso sintético: regiones Sucursal-Norte/Cusco con montos → `agg` produce total y n; `transform('mean')` deja la media regional en cada fila. El EDA del portfolio usa agg para tablas y transform para scores relativos sin leakage de fechas (eso es T4-B). **Antes de agregar**, asegúrate de haber documentado la cardinalidad del join: un fan-out no detectado infla la suma y el residual de reconciliación no “cuadra”.",
 ],
 code: {
 language: 'python',
 title: "groupby_agg.py",
 code: `def s17_th_5():
    import pandas as pd

    df = pd.DataFrame({
     "region": ["Sucursal-Sur", "Sucursal-Centro", "Oficina-Este"],
     "monto": [10.0, 20.0, 5.0],
    })
    agg = df.groupby("region", as_index=False).agg(monto_sum=("monto", "sum"), n=("monto", "size"))
    df2 = df.copy()
    df2["monto_region_mean"] = df2.groupby("region")["monto"].transform("mean")
    print(agg.to_dict(orient="list"))
    print(df2["monto_region_mean"].tolist())

s17_th_5()`,
 output: `{'region': ['Oficina-Oeste', 'Cliente-A'], 'monto_sum': [5.0, 30.0], 'n': [1, 2]}
[15.0, 15.0, 5.0]`,
 },
 callout: {
 type: "tip",
 title: "transform vs agg",
 content:
 "`transform` preserva el número de filas (feature por fila); `agg` colapsa a una fila por grupo (tabla ejecutiva). Si tu salida tiene menos filas de las que esperabas para un score por transacción, probablemente usaste agg donde ibas a usar transform.",
 },
 },
 {
 heading: "Ventanas, fechas y cohortes",
 subtopicId: "S17-T3-B",
 paragraphs: [
 "`rolling` construye **ventanas móviles** sobre series ordenadas; `resample` requiere DatetimeIndex. Una **cohorte** etiqueta a cada cliente por el periodo de su primera observación válida (p. ej. mes de primera compra), no por la fecha del batch de hoy.",
 "Contrato: **ordena por fecha** antes de rolling; documenta tamaño de ventana (2 periodos, 7d) y el tratamiento de NaN iniciales. Cohorte = `groupby(cliente_id)[fecha].transform('min').dt.to_period('M')` (o equivalente estable).",
 "Caso: tx en ene–mar 2024; C001 cohorte 2024-01; media móvil de montos diarios con window=2. Estas series alimentan preguntas de retención del portfolio ejecutivo sin afirmar causalidad — el memo declara no-claims explícitos. En S18 profundizarás la lectura de incertidumbre; aquí el contrato es series ordenadas y cohortes bien definidas.",
 ],
 code: {
 language: 'python',
 title: "windows_cohorts.py",
 code: `def s17_th_6():
    import pandas as pd

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
    print(clientes[["cliente_id", "cohort"]].drop_duplicates().to_dict(orient="list"))

s17_th_6()`,
 output: `[nan, nan, 2.0, 3.0]
{'cliente_id': ['C001', 'C002'], 'cohort': ['2024-01', '2024-01']}`,
 },
 callout: {
 type: "info",
 title: "Primera fecha = cohorte",
 content:
 "Define cohorte con la **primera** observación válida (`min` de fecha por cliente), no con la fecha del batch de hoy ni con `max` (última actividad). Documenta el periodo (mes/semana) en el memo.",
 },
 },
 {
 heading: "Denominadores y totales",
 subtopicId: "S17-T4-A",
 paragraphs: [
 "Tras joins y agregaciones, el stakeholder pregunta: “¿cuadra el total?”. Reconciliación ejecutiva: la **suma de partes debe igualar el total** de referencia (o la diferencia queda documentada con tolerancia `abs(diff)<eps`). Los **denominadores** de tasas (pagados/activos, completos/universo) deben ser el mismo filtro que declaras en el texto del hallazgo — no un universo “más cómodo”.",
 "Contrato puente (**bridge table**): `total → segmento_A → residual`. Si Cliente-B=60 y total=100, el residual del resto es 40. Nunca uses un denominador de otro corte temporal o geográfico solo porque “sale un número bonito” en el slide. El residual es evidencia, no un error a esconder.",
 "Caso sintético: total nacional 100 PEN; partes Sucursal-Norte/Sucursal-Sur/Arequipa; tasa de completitud 150/200=0.75. El portfolio imprime `diff`, `reconciled` y la tasa con su denominador explícito para el stakeholder no técnico. Si el join de T1 tenía fan-out no documentado, este bloque es el primero que “no cierra”: por eso T1 va antes que T4.",
 ],
 code: {
 language: 'python',
 title: "reconcile.py",
 code: `def s17_th_7():
    import pandas as pd

    total = 100.0
    parts = pd.Series({"Sucursal-Centro": 60.0, "Oficina-Este": 30.0, "Arequipa": 10.0})
    print("sum_parts", float(parts.sum()), "ok", abs(parts.sum() - total) < 1e-9)
    # tasa: pagados / clientes activos
    activos = 50
    pagados = 20
    print("tasa", pagados / activos, "denominador", activos)

s17_th_7()`,
 output: `sum_parts 100.0 ok True
tasa 0.4 denominador 50`,
 },
 callout: {
 type: "warning",
 title: "Denominador correcto",
 content:
 "Una tasa con denominador de otro filtro (otro mes, otra región, otro universo de clientes) es el error clásico de EDA ejecutivo. Imprime siempre `numerador`, `denominador` y `tasa` juntos.",
 },
 },
 {
 heading: "Leakage temporal y controles antes/después",
 subtopicId: "S17-T4-B",
 paragraphs: [
 "**Leakage temporal** es usar información con fecha posterior al **cutoff** para features o métricas de un periodo “antes”. Invalida comparaciones before/after y cualquier score de “riesgo a enero” que mira febrero.",
 "Controles: cutoff estricto (`fecha <= t`), agregados solo sobre el subconjunto pre-cutoff, y comparación explícita `sum_total - sum_pre` como **delta de leakage** en el memo. As-of = “solo lo conocido a la fecha t”.",
 "Caso (mismo fixture del código): C001 con montos 10 y 5 en enero y 100 en febrero; cutoff 2024-01-31 → total con leakage 115, pre-cutoff 15, delta de leakage 100. El cierre del portfolio debe demostrar al menos un control as-of de este tipo en el script reproducible.",
 ],
 code: {
 language: 'python',
 title: "no_leak.py",
 code: `def s17_th_8():
    import pandas as pd

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
    print("leakage_delta", leak - ok)

s17_th_8()`,
 output: `con_leak_total 115.0 pre_cutoff 15.0
leakage_delta 100.0`,
 },
 callout: {
 type: "danger",
 title: "Cutoff estricto",
 content:
 "Cualquier feature o métrica con fecha > cutoff invalida el análisis before/after. Filtra `fecha <= cutoff`, compara `sum_total - sum_pre` y deja el **delta de leakage** escrito en el memo — no solo en un comentario del notebook.",
 },
 }
 ],
 iDo: {
 intro: "Ocho demos (I Do) alineados a T1–T4: left join con conteo de filas, validate + anti-join, melt/pivot, schema estable, groupby/transform, cohorte + rolling, reconciliación de totales y cutoff anti-leakage. Lee cada `why` (qué se rompería si lo omitieras) y el output esperado antes de pasar al We Do. No copies a ciegas: el contrato de salida es el checklist del portfolio.",
 steps: [
 {
 demoId: "S17-T1-A-DEMO",
 subtopicId: "S17-T1-A",
 environment: "local-python",
 description: "Elegir left join clientes-tx y validar fan-out 1:m",
 code: {
 language: 'python',
 title: "demo_join.py",
 code: `def s17_ido_1():
    import pandas as pd
    cli = pd.DataFrame({"cliente_id": ["C001", "C002"], "region": ["Oficina-Oeste", "Cliente-A"]})
    tx = pd.DataFrame({"cliente_id": ["C001", "C001", "C002"], "monto": [3.0, 4.0, 5.0]})
    assert cli["cliente_id"].is_unique
    m = cli.merge(tx, on="cliente_id", how="left")
    print("rows", len(cli), "->", len(m), "card", "1:m")
    print(m.groupby("cliente_id").size().to_dict())

s17_ido_1()`,
 output: `rows 2 -> 3 card 1:m
{'C001': 2, 'C002': 1}`,
 },
 why: "Contar filas pre/post documenta la cardinalidad real del join. Sin ese conteo, el fan-out 1:m pasa desapercibido y las sumas de monto se inflan en el tablero ejecutivo.",
 },
 {
 demoId: "S17-T1-B-DEMO",
 subtopicId: "S17-T1-B",
 environment: "local-python",
 description: "Detectar fan-out con validate y anti-join de clientes sin tx",
 code: {
 language: 'python',
 title: "demo_anti.py",
 code: `def s17_ido_2():
    import pandas as pd
    cli = pd.DataFrame({"cliente_id": ["C001", "C002", "C003"]})
    tx = pd.DataFrame({"cliente_id": ["C001", "C001"], "monto": [1.0, 2.0]})
    ok = cli.merge(tx.drop_duplicates("cliente_id"), on="cliente_id", how="left", validate="one_to_one")
    m = cli.merge(tx, on="cliente_id", how="left", indicator=True)
    anti = m.loc[m["_merge"] == "left_only", "cliente_id"].unique().tolist()
    print("anti", anti)
    try:
     cli.merge(tx, on="cliente_id", validate="one_to_one")
    except pd.errors.MergeError:
     print("validate_caught_fanout", True)

s17_ido_2()`,
 output: `anti ['C002', 'C003']
validate_caught_fanout True`,
 },
 why: "validate captura fan-out con `MergeError` específico (no un except genérico). El anti-join lista huérfanos para la tabla de evidencia de calidad; sin él, el KPI de cobertura de maestro queda opaco.",
 },
 {
 demoId: "S17-T2-A-DEMO",
 subtopicId: "S17-T2-A",
 environment: "local-python",
 description: "Pasar wide↔long con melt y pivot_table",
 code: {
 language: 'python',
 title: "demo_reshape.py",
 code: `def s17_ido_3():
    import pandas as pd
    wide = pd.DataFrame({"cliente_id": ["C001", "C002"], "m1": [10, 20], "m2": [1, 2]})
    long = wide.melt(id_vars="cliente_id", var_name="periodo", value_name="monto")
    wide2 = long.pivot_table(index="cliente_id", columns="periodo", values="monto", aggfunc="sum")
    print(long.shape, wide2.shape)
    print(long["periodo"].tolist())

s17_ido_3()`,
 output: `(4, 3) (2, 2)
['m1', 'm1', 'm2', 'm2']`,
 },
 why: "melt/pivot son el puente entre series temporales (long) y reportes tabulares (wide). Con `aggfunc='sum'` se conserva el total de montos; el default (mean) lo distorsiona sin error visible.",
 },
 {
 demoId: "S17-T2-B-DEMO",
 subtopicId: "S17-T2-B",
 environment: "local-python",
 description: "Estabilizar nombres de columnas post-pivot al schema del portfolio",
 code: {
 language: 'python',
 title: "demo_names.py",
 code: `def s17_ido_4():
    import pandas as pd
    long = pd.DataFrame({"cliente_id": ["C001", "C001"], "mes": ["ene", "feb"], "monto": [1.0, 2.0]})
    w = long.pivot(index="cliente_id", columns="mes", values="monto").reset_index()
    w.columns = ["cliente_id" if c == "cliente_id" else f"monto_{c}" for c in w.columns]
    expected = {"cliente_id", "monto_ene", "monto_feb"}
    print(w.columns.tolist(), set(w.columns) == expected)

s17_ido_4()`,
 output: `['cliente_id', 'monto_ene', 'monto_feb'] True`,
 },
 why: "Un schema de columnas estable (`set(columns) == expected`) evita roturas del dashboard y del diff del PR. Un rename ad hoc en el notebook no es un contrato auditable.",
 },
 {
 demoId: "S17-T3-A-DEMO",
 subtopicId: "S17-T3-A",
 environment: "local-python",
 description: "Agregar montos por región y reinyectar media con transform",
 code: {
 language: 'python',
 title: "demo_groupby.py",
 code: `def s17_ido_5():
    import pandas as pd
    df = pd.DataFrame({
     "region": ["Cliente-B", "Sucursal-Norte", "Arequipa", "Arequipa"],
     "monto": [10.0, 30.0, 5.0, 15.0],
    })
    resumen = df.groupby("region", as_index=False).agg(total=("monto", "sum"), n=("monto", "count"))
    df = df.assign(mean_reg=df.groupby("region")["monto"].transform("mean"))
    print(resumen.to_dict(orient="list"))
    print(df["mean_reg"].tolist())

s17_ido_5()`,
 output: `{'region': ['Sucursal-Sur', 'Sucursal-Centro'], 'total': [20.0, 40.0], 'n': [2, 2]}
[20.0, 20.0, 10.0, 10.0]`,
 },
 why: "`agg` produce la tabla ejecutiva (una fila por grupo); `transform` reinyecta la media/total al shape original para scores por fila. Confundirlos es el bug clásico de “me quedé sin filas” en un feature store.",
 },
 {
 demoId: "S17-T3-B-DEMO",
 subtopicId: "S17-T3-B",
 environment: "local-python",
 description: "Construir cohorte mensual y media móvil de 2 periodos",
 code: {
 language: 'python',
 title: "demo_cohort.py",
 code: `def s17_ido_6():
    import pandas as pd
    tx = pd.DataFrame({
     "cliente_id": ["C001", "C001", "C002", "C002"],
     "fecha": pd.to_datetime(["2024-01-05", "2024-02-10", "2024-01-20", "2024-03-01"]),
     "monto": [1.0, 2.0, 3.0, 4.0],
    })
    tx["cohort"] = tx.groupby("cliente_id")["fecha"].transform("min").dt.to_period("M").astype(str)
    daily = tx.groupby("fecha", as_index=True)["monto"].sum().sort_index()
    roll = daily.rolling(2).mean()
    print(tx[["cliente_id", "cohort"]].drop_duplicates().to_dict(orient="list"))
    print([None if pd.isna(x) else round(float(x), 2) for x in roll.tolist()])

s17_ido_6()`,
 output: `{'cliente_id': ['C001', 'C002'], 'cohort': ['2024-01', '2024-01']}
[None, 2.0, 2.5, 3.0]`,
 },
 why: "Cohortes con `min(fecha)` y ventanas sobre series **ordenadas** responden evolución temporal. Usar la fecha del batch o `max` como cohorte miente sobre cuándo entró el cliente; el memo declara no-claims, no causalidad.",
 },
 {
 demoId: "S17-T4-A-DEMO",
 subtopicId: "S17-T4-A",
 environment: "local-python",
 description: "Reconciliar total nacional vs suma por región",
 code: {
 language: 'python',
 title: "demo_totals.py",
 code: `def s17_ido_7():
    import pandas as pd
    parts = pd.DataFrame({"region": ["Oficina-Este", "Oficina-Oeste", "Cliente-A"], "monto": [50.0, 30.0, 20.0]})
    total_ref = 100.0
    diff = float(parts["monto"].sum() - total_ref)
    print("diff", diff, "reconciled", abs(diff) < 1e-9)
    # denominador de tasa de completitud
    n_clientes = 200
    n_completos = 150
    print("tasa", n_completos / n_clientes, "den", n_clientes)

s17_ido_7()`,
 output: `diff 0.0 reconciled True
tasa 0.75 den 200`,
 },
 why: "Totales y denominadores anclan el EDA ejecutivo. Si `sum(partes) ≠ total`, el residual se documenta en la bridge — no se oculta en el slide ni se “redondea” a ojo.",
 },
 {
 demoId: "S17-T4-B-DEMO",
 subtopicId: "S17-T4-B",
 environment: "local-python",
 description: "Evitar leakage: agregar solo transacciones <= cutoff",
 code: {
 language: 'python',
 title: "demo_leakage.py",
 code: `def s17_ido_8():
    import pandas as pd
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
    print("delta", float(leaky["C001"] - feat["C001"]))

s17_ido_8()`,
 output: `safe {'C001': 10.0}
leaky {'C001': 1009.0}
delta 999.0`,
 },
 why: "Cutoff y as-of evitan contaminación before/after. El delta de leakage (`total − pre`) va al memo del portfolio: sin ese número, el stakeholder no sabe cuánto del total “mira el futuro”.",
 }
 ],
 },
 weDo: {
 intro: "24 ejercicios en liberación gradual: E1 (guiado) → E2 (independiente) → E3 (transferencia) por cada subtema T1–T4. Cada starter trae un **bug intencional** a corregir; las pistas y el feedback nombran el error típico (inner vs left, mean vs sum, post-cutoff, etc.). Completa T1→T4 en orden: no saltes a agregar sin cardinalidad documentada. El **E3 de T4-B** es una mini-integración (join + pre-cutoff + delta de leakage) que prepara el You Do del portfolio de calidad + EDA — trátarlo como puente, no como drill suelto.",
 steps: [
 {
 id: "S17-T1-A-E1",
 subtopicId: "S17-T1-A",
 kind: "guided",
 instruction:
 "E1 (guiado) — Concepto: left join clientes–transacciones. Fixture `FIX-S17-T1A-E1`: cli={C001,C002}, tx={C001:1.0}. Haz `merge` por `cliente_id` con `how='left'` e imprime `len` del resultado. Pass: una línea con `2` (C002 se conserva aunque sin tx).",
 hint: "Usa cli.merge(tx, on='cliente_id', how='left') para conservar clientes sin tx.",
 hints: [
 "Usa cli.merge(tx, on='cliente_id', how='left') para conservar clientes sin tx.",
 "Imprime solo len(...) del resultado; el pass esperado es 2.",
 ],
 edgeCases: ["inner pierde C002", "how wrong"],
 tests: "salida coincide con solution output",
 feedback: "Si imprimiste 1, usaste inner y perdiste C002. Left join conserva el maestro de clientes aunque no tengan transacciones.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · left merge length
# Bug a corregir: inner merge acorta filas (pierde clientes sin tx)
import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C002"]})
tx = pd.DataFrame({"cliente_id": ["C001"], "monto": [1.0]})
print(len(cli.merge(tx, on="cliente_id", how="inner")))`,
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
 hint: "Mide cli['cliente_id'].is_unique sin limpiar filas antes.",
 hints: [
 "Mide cli['cliente_id'].is_unique sin limpiar filas antes.",
 "Envuelve en bool(...) e imprime solo ese valor; pass: False.",
 ],
 edgeCases: ["nunique confuso", "drop_duplicates silencioso"],
 tests: "salida coincide con solution output",
 feedback: "Si imprimiste True, no mediste is_unique sobre la Series con duplicados. El gate 1:1 falla cuando la clave del maestro no es única.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · unique keys
# Bug a corregir: se imprime True sin medir is_unique
import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C001"]})
print(True)`,
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
 "E3 (transferencia) — Concepto: documentar fan-out 1:m como en el portfolio. Un cliente C001 tiene 3 transacciones; el maestro tiene una sola fila. Haz `inner` merge por `cliente_id` **sin** drop_duplicates en tx e imprime el dict `{'rows_cli': int, 'rows_merge': int}` (conteos pre/post). Pass: `{'rows_cli': 1, 'rows_merge': 3}`. Transfer: el lado m multiplica filas; el memo del portfolio reporta `rows_cli → rows_merge`, no un solo número suelto.",
 hint: "m = cli.merge(tx, on='cliente_id', how='inner') sin drop_duplicates; imprime dict con len(cli) y len(m).",
 hints: [
 "m = cli.merge(tx, on='cliente_id', how='inner') sin drop_duplicates en tx.",
 "print({'rows_cli': len(cli), 'rows_merge': len(m)}); si rows_merge es 1, aún colapsaste el lado m.",
 ],
 edgeCases: ["how left same here", "cartesian wrong keys", "solo un int sin dict"],
 tests: "salida coincide con solution output",
 feedback: "Si imprimiste 1 o {'rows_cli': 1, 'rows_merge': 1}, aplicaste drop_duplicates antes del merge y ocultaste el fan-out. El portfolio documenta rows_cli→rows_merge (1→3).",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · fanout inner pre/post
# Bug a corregir: drop_duplicates antes del merge oculta el fan-out (solo 1 fila)
import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001"]})
tx = pd.DataFrame({"cliente_id": ["C001"] * 3, "monto": [1.0, 2.0, 3.0]})
m = cli.merge(tx.drop_duplicates("cliente_id"), on="cliente_id", how="inner")
print({"rows_cli": len(cli), "rows_merge": len(m)})`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001"]})
tx = pd.DataFrame({"cliente_id": ["C001"] * 3, "monto": [1.0, 2.0, 3.0]})
m = cli.merge(tx, on="cliente_id", how="inner")
print({"rows_cli": len(cli), "rows_merge": len(m)})`,
 output: `{'rows_cli': 1, 'rows_merge': 3}`,
 },
 },
 {
 id: "S17-T1-B-E1",
 subtopicId: "S17-T1-B",
 kind: "guided",
 instruction:
 "E1 (guiado) — Concepto: anti-join con `indicator=True`. Fixture cli={C001,C002}, tx solo C001. Left merge + filtra `_merge=='left_only'`; imprime lista de `cliente_id`. Pass: `['C002']` (huérfano sin transacciones).",
 hint: "merge left con indicator=True; filtra _merge == 'left_only'.",
 hints: [
 "merge left con indicator=True; filtra _merge == 'left_only'.",
 "Imprime .tolist() de cliente_id de esas filas; pass: ['C002'].",
 ],
 edgeCases: ["right_only", "sin indicator"],
 tests: "salida coincide con solution output",
 feedback: "Si listaste C001, filtraste 'both' (matches). left_only son los clientes del maestro sin transacciones.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · left_only orphans
# Bug a corregir: se filtra 'both' en vez de 'left_only'
import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C002"]})
tx = pd.DataFrame({"cliente_id": ["C001"], "monto": [1.0]})
m = cli.merge(tx, on="cliente_id", how="left", indicator=True)
print(m.loc[m["_merge"] == "both", "cliente_id"].tolist())`,
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
 "E2 (independiente) — Concepto: `validate='one_to_one'` como gate. Fixture a={id:1}, b={id:1,1}. Intenta merge one_to_one; captura `pd.errors.MergeError` e imprime exactamente `fail`. Pass: `fail`. No uses validate many_to_many ni `except Exception` genérico para silenciar el error.",
 hint: "try/except pd.errors.MergeError alrededor del merge con validate='one_to_one'.",
 hints: [
 "try/except pd.errors.MergeError alrededor del merge con validate='one_to_one'.",
 "En el except imprime exactamente la cadena fail (sin comillas extra).",
 ],
 edgeCases: ["validate many_to_many", "except Exception demasiado amplio"],
 tests: "salida coincide con solution output",
 feedback: "Si imprimiste 2, el merge corrió sin validate y el fan-out pasó silencioso. El gate debe fallar con MergeError y reportar fail.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · validate one_to_one
# Bug a corregir: merge sin validate silencia el fan-out
import pandas as pd
a = pd.DataFrame({"id": [1]})
b = pd.DataFrame({"id": [1, 1]})
print(len(a.merge(b, on="id")))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import pandas as pd
a = pd.DataFrame({"id": [1]})
b = pd.DataFrame({"id": [1, 1]})
try:
 a.merge(b, on="id", validate="one_to_one")
except pd.errors.MergeError:
 print("fail")`,
 output: `fail`,
 },
 },
 {
 id: "S17-T1-B-E3",
 subtopicId: "S17-T1-B",
 kind: "transfer",
 instruction:
 "E3 (transferencia) — Concepto: KPI de calidad = conteo de huérfanos. Fixture: 3 clientes, tx solo en C001. Tras left merge con indicator, cuenta filas `left_only` (no la lista de ids). Pass entero: `2`. Ese número alimenta el dashboard de calidad del portfolio, no el listado crudo.",
 hint: "Tras indicator, (m['_merge'] == 'left_only').sum() como int.",
 hints: [
 "Tras indicator, (m['_merge'] == 'left_only').sum() como int.",
 "No filtres 'both': eso cuenta matches, no huérfanos.",
 ],
 edgeCases: ["inner count", "right anti"],
 tests: "salida coincide con solution output",
 feedback: "Si imprimiste 1, contaste 'both' (matches). El KPI de huérfanos del portfolio es left_only = 2.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · count left_only
# Bug a corregir: se cuenta 'both' en vez de 'left_only'
import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C002", "C003"]})
tx = pd.DataFrame({"cliente_id": ["C001"]})
m = cli.merge(tx, on="cliente_id", how="left", indicator=True)
print(int((m["_merge"] == "both").sum()))`,
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
 hint: "df.melt(id_vars='id', value_vars=['a','b']) y luego len(...).",
 hints: [
 "df.melt(id_vars='id', value_vars=['a','b']) y luego len(...).",
 "No imprimas len(df) del wide: ese es 2, no 4.",
 ],
 edgeCases: ["stack mal", "sin id_vars"],
 tests: "salida coincide con solution output",
 feedback: "Si imprimiste 2, mediste el wide. melt multiplica filas por el número de value_vars (2×2=4).",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · melt length
# Bug a corregir: se imprime len del wide sin melt
import pandas as pd
df = pd.DataFrame({"id": [1, 2], "a": [10, 20], "b": [3, 4]})
print(len(df))`,
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
 hint: "pivot_table(..., aggfunc='sum').reset_index() antes de listar columns.",
 hints: [
 "pivot_table(..., aggfunc='sum').reset_index() antes de listar columns.",
 "Sin reset_index, 'id' no aparece en columns y el pass falla.",
 ],
 edgeCases: ["pivot sin agg", "mean default confusion"],
 tests: "salida coincide con solution output",
 feedback: "Si listaste solo ['a','b'], faltó reset_index() para promover el index a columna 'id'.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · pivot columns
# Bug a corregir: sin reset_index las columnas no incluyen id
import pandas as pd
long = pd.DataFrame({"id": [1, 1], "k": ["a", "b"], "v": [1.0, 2.0]})
w = long.pivot_table(index="id", columns="k", values="v", aggfunc="sum")
print(list(w.columns))`,
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
 "E3 (transferencia) — Concepto: apilar lotes y reportar el contrato de filas. Tienes dos DataFrames de una fila (`a` y `b`, columna x) = dos cargas diarias. Usa `pd.concat([a, b], ignore_index=True)` e imprime `{'n_lotes': 2, 'n_filas': int}`. Pass: `{'n_lotes': 2, 'n_filas': 2}`. Transfer: en el portfolio, concat vertical une snapshots; documenta cuántos lotes entraron y cuántas filas salieron (axis=1 no apila casos).",
 hint: "out = pd.concat([a, b], ignore_index=True); print({'n_lotes': 2, 'n_filas': len(out)}).",
 hints: [
 "out = pd.concat([a, b], ignore_index=True); n_filas = len(out).",
 "No uses axis=1: eso alinea columnas, no apila filas de lotes.",
 ],
 edgeCases: ["axis=1", "index duplicado confuso", "solo len(a)"],
 tests: "salida coincide con solution output",
 feedback: "Si imprimiste 1 o n_filas=1, solo mediste la primera tabla. concat axis=0 apila ambos lotes → n_filas 2 con n_lotes 2.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · concat lotes
# Bug a corregir: solo se mide la primera tabla (n_filas incompleto)
import pandas as pd
a = pd.DataFrame({"x": [1]})
b = pd.DataFrame({"x": [2]})
print({"n_lotes": 2, "n_filas": len(a)})`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import pandas as pd
a = pd.DataFrame({"x": [1]})
b = pd.DataFrame({"x": [2]})
out = pd.concat([a, b], ignore_index=True)
print({"n_lotes": 2, "n_filas": len(out)})`,
 output: `{'n_lotes': 2, 'n_filas': 2}`,
 },
 },
 {
 id: "S17-T2-B-E1",
 subtopicId: "S17-T2-B",
 kind: "guided",
 instruction:
 "E1 (guiado) — Concepto: nombres estables post-pivot. Fixture long id/mes/monto con meses e,f. Pivot y renombra a `monto_{mes}`; imprime `list(columns)`. Pass: `['monto_e', 'monto_f']`. Schema del portfolio, no MultiIndex crudo.",
 hint: "Tras pivot, w.columns = [f'monto_{c}' for c in w.columns].",
 hints: [
 "Tras pivot, w.columns = [f'monto_{c}' for c in w.columns].",
 "Imprime list(w.columns); el prefijo monto_ es obligatorio en el schema.",
 ],
 edgeCases: ["dejar multiindex", "espacios"],
 tests: "salida coincide con solution output",
 feedback: "Si listaste ['e','f'], faltó el prefijo monto_ del schema del dashboard.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · pivot rename columns
# Bug a corregir: columnas sin prefijo monto_
import pandas as pd
long = pd.DataFrame({"id": [1, 1], "mes": ["e", "f"], "monto": [1.0, 2.0]})
w = long.pivot(index="id", columns="mes", values="monto")
print(list(w.columns))`,
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
 hint: "expected debe listar exactamente las columnas reales del DF.",
 hints: [
 "expected debe listar exactamente las columnas reales del DF.",
 "Compara set(df.columns) == expected; no uses listas ordenadas para el gate de set.",
 ],
 edgeCases: ["orden importa en set? no", "list =="],
 tests: "salida coincide con solution output",
 feedback: "Si salió False, expected pedía monto_feb y el DF solo tiene monto_ene. El gate de schema compara sets reales.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · expected columns
# Bug a corregir: expected pide monto_feb que no existe
import pandas as pd
df = pd.DataFrame(columns=["cliente_id", "monto_ene"])
expected = {"cliente_id", "monto_feb"}
print(set(df.columns) == expected)`,
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
 "E3 (transferencia) — Concepto: rename explícito en un export. Fixture DF con columna `a` que en el diccionario de datos se llama `monto`. Aplica `rename(columns={'a':'monto'})` e imprime columns list. Pass: `['monto']`. Transfer: en el portfolio, dict rename documentable > reasignar `.columns` a ciegas.",
 hint: "df.rename(columns={'a': 'monto'}).columns.tolist()",
 hints: [
 "df.rename(columns={'a': 'monto'}).columns.tolist()",
 "No reasignes .columns a una lista opaca sin dict de origen→destino.",
 ],
 edgeCases: ["reassign mal", "axis"],
 tests: "salida coincide con solution output",
 feedback: "Si imprimiste ['a'], no aplicaste rename. El schema del export exige el nombre de negocio 'monto'.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · rename
# Bug a corregir: se exporta el nombre crudo 'a'
import pandas as pd
df = pd.DataFrame({"a": [1]})
print(df.columns.tolist())`,
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
 "E1 (guiado) — Concepto: groupby + sum. Fixture region Cliente-B×2 y Sucursal-Norte×1 con montos 1,2,3. Imprime `groupby('region')['monto'].sum().to_dict()`. Pass: `{'Sucursal-Sur': 3.0, 'Sucursal-Centro': 3.0}` (orden de keys puede seguir sort de pandas).",
 hint: "groupby('region')['monto'].sum().to_dict() — suma, no media.",
 hints: [
 "groupby('region')['monto'].sum().to_dict() — suma, no media.",
 "La pregunta de negocio es total de PEN por región, no promedio.",
 ],
 edgeCases: ["mean", "as_index confusion"],
 tests: "salida coincide con solution output",
 feedback: "Si usaste mean, Oficina-Este sale 1.5 no 3.0. El contrato de negocio pidió suma de montos en PEN.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · groupby sum
# Bug a corregir: mean en vez de sum
import pandas as pd
df = pd.DataFrame({"region": ["Oficina-Oeste", "Cliente-A", "Cliente-B"], "monto": [1.0, 2.0, 3.0]})
print(df.groupby("region")["monto"].mean().to_dict())`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import pandas as pd
df = pd.DataFrame({"region": ["Sucursal-Norte", "Sucursal-Sur", "Sucursal-Centro"], "monto": [1.0, 2.0, 3.0]})
print(df.groupby("region")["monto"].sum().to_dict())`,
 output: `{'Oficina-Este': 3.0, 'Oficina-Oeste': 3.0}`,
 },
 },
 {
 id: "S17-T3-A-E2",
 subtopicId: "S17-T3-A",
 kind: "independent",
 instruction:
 "E2 (independiente) — Concepto: transform mean al shape original. Fixture Cliente-A 1.0/3.0 y Cliente-B 2.0. Imprime lista de `groupby('region')['monto'].transform('mean')`. Pass: `[2.0, 2.0, 2.0]`. No uses agg (colapsa filas).",
 hint: "transform('mean') reinyecta la media al shape original (3 filas).",
 hints: [
 "transform('mean') reinyecta la media al shape original (3 filas).",
 "No uses .sum().tolist() del groupby: colapsa a 2 filas por región.",
 ],
 edgeCases: ["agg colapsa", "map manual"],
 tests: "salida coincide con solution output",
 feedback: "Si la lista tiene 2 elementos, usaste agg/sum que colapsa grupos. transform preserva las 3 filas del DF.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · transform mean
# Bug a corregir: sum del groupby colapsa filas
import pandas as pd
df = pd.DataFrame({"region": ["Sucursal-Norte", "Sucursal-Sur", "Sucursal-Centro"], "monto": [1.0, 3.0, 2.0]})
print(df.groupby("region")["monto"].sum().tolist())`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import pandas as pd
df = pd.DataFrame({"region": ["Oficina-Este", "Oficina-Oeste", "Cliente-A"], "monto": [1.0, 3.0, 2.0]})
print(df.groupby("region")["monto"].transform("mean").tolist())`,
 output: `[2.0, 2.0, 2.0]`,
 },
 },
 {
 id: "S17-T3-A-E3",
 subtopicId: "S17-T3-A",
 kind: "transfer",
 instruction:
 "E3 (transferencia) — Concepto: contrato de columnas del resumen ejecutivo. Fixture region Cliente-B/Sucursal-Norte. Construye `groupby(..., as_index=False).agg(total=('monto','sum'), n=('monto','count'))` e imprime columns.tolist(). Pass: `['region', 'total', 'n']`. Transfer: named agg fija el schema que el stakeholder verá en el CSV del portfolio.",
 hint: "as_index=False + agg con total= y n= nombrados.",
 hints: [
 "as_index=False + agg con total= y n= nombrados.",
 "Un sum().reset_index() solo da ['region','monto'], no el schema total/n.",
 ],
 edgeCases: ["MultiIndex cols", "sin names"],
 tests: "salida coincide con solution output",
 feedback: "Si listaste ['region','monto'], usaste sum simple. Named agg con total y n produce el schema del resumen ejecutivo.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · named agg
# Bug a corregir: sum simple no nombra total ni n
import pandas as pd
df = pd.DataFrame({"region": ["Sucursal-Sur", "Sucursal-Centro"], "monto": [1.0, 2.0]})
out = df.groupby("region")["monto"].sum().reset_index()
print(out.columns.tolist())`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import pandas as pd
df = pd.DataFrame({"region": ["Oficina-Este", "Oficina-Oeste"], "monto": [1.0, 2.0]})
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
 hint: "rolling(2).mean(); convierte NaN a None al armar la lista.",
 hints: [
 "rolling(2).mean(); convierte NaN a None al armar la lista.",
 "window=1 nunca produce NaN inicial; el contrato pide window=2.",
 ],
 edgeCases: ["min_periods", "window 3"],
 tests: "salida coincide con solution output",
 feedback: "Si salió [1.0, 2.0, 3.0], usaste rolling(1). Con window=2 el primer valor es NaN → None y luego 1.5, 2.5.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · rolling mean
# Bug a corregir: rolling(1) no genera NaN inicial
import pandas as pd
s = pd.Series([1.0, 2.0, 3.0]).rolling(1).mean()
print([None if pd.isna(x) else float(x) for x in s])`,
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
 hint: "groupby(cliente_id)[fecha].transform('min').dt.to_period('M').",
 hints: [
 "groupby(cliente_id)[fecha].transform('min').dt.to_period('M').",
 "Usa min, no max: la cohorte es la primera observación válida.",
 ],
 edgeCases: ["usar max", "string slice frágil"],
 tests: "salida coincide con solution output",
 feedback: "Si C001 sale 2024-03, usaste max (última actividad). Cohorte = primera fecha válida → 2024-01.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · cohort month
# Bug a corregir: transform('max') usa última fecha, no la primera
import pandas as pd
df = pd.DataFrame({
 "cliente_id": ["C001", "C001", "C002"],
 "fecha": pd.to_datetime(["2024-01-05", "2024-03-01", "2024-02-10"]),
})
df["cohort"] = df.groupby("cliente_id")["fecha"].transform("max").dt.to_period("M").astype(str)
print(df.drop_duplicates("cliente_id").set_index("cliente_id")["cohort"].to_dict())`,
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
 "E3 (transferencia) — Concepto: orden temporal antes de rolling en un feed desordenado. Serie con valores 3,1,2 indexados en fechas desordenadas; ordena el índice, rolling(2).mean(), imprime el último valor float. Pass: `2.5`. Transfer: sin sort, el EDA reporta una “tendencia” falsa al stakeholder.",
 hint: "s.sort_index() antes de rolling(2).mean().",
 hints: [
 "s.sort_index() antes de rolling(2).mean().",
 "El último valor tras ordenar 1→2→3 con window=2 es (2+3)/2 = 2.5.",
 ],
 edgeCases: ["sin ordenar", "window wrong"],
 tests: "salida coincide con solution output",
 feedback: "Sin sort_index el último punto de la ventana no es el último día del calendario. Ordena siempre antes de rolling.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · sort then rolling
# Bug a corregir: rolling sobre índice desordenado
import pandas as pd
s = pd.Series([3.0, 1.0, 2.0], index=pd.to_datetime(["2024-01-03", "2024-01-01", "2024-01-02"]))
print(float(s.rolling(2).mean().iloc[-1]))`,
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
 hint: "abs(sum(parts) - total) < 1e-9 (eps estricto del gate).",
 hints: [
 "abs(sum(parts) - total) < 1e-9 (eps estricto del gate).",
 "Tolerancia 1.0 es demasiado laxa para un control de reconciliación.",
 ],
 edgeCases: ["== exact float risk", "wrong total"],
 tests: "salida coincide con solution output",
 feedback: "Si usaste < 1.0, el gate es demasiado laxo y pasaría descuadres de casi un sol. Usa eps 1e-9.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · reconciliation
# Bug a corregir: tolerancia 1.0 es demasiado laxa
parts = [10.0, 20.0, 70.0]
total = 100.0
print(abs(sum(parts) - total) < 1.0)`,
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
 hint: "tasa = pagados / activos (numerador de éxito sobre universo activo).",
 hints: [
 "tasa = pagados / activos (numerador de éxito sobre universo activo).",
 "Imprime el float 0.25, no un porcentaje 25.",
 ],
 edgeCases: ["denominador pagados", "porcentaje 25"],
 tests: "salida coincide con solution output",
 feedback: "Si imprimiste 4.0, invertiste el cociente (activos/pagados). El denominador de la tasa es el universo activo.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · conversion rate
# Bug a corregir: cociente invertido (activos/pagados)
activos = 40
pagados = 10
print(activos / pagados)`,
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
 "E3 (transferencia) — Concepto: tabla puente (bridge) nacional→Cliente-A con residual documentado. total=100, lima=60; imprime el dict `{'total': 100.0, 'lima': 60.0, 'residual': float}` con residual = total−lima. Pass: `{'total': 100.0, 'lima': 60.0, 'residual': 40.0}`. Transfer: en el memo del portfolio la bridge es total → segmento_A → residual, no un descuadre oculto ni un solo float suelto.",
 hint: "residual = total - lima; imprime dict con total, lima y residual.",
 hints: [
 "residual = total - lima (no lima - total).",
 "print({'total': total, 'lima': lima, 'residual': residual}) con floats 100.0/60.0/40.0.",
 ],
 edgeCases: ["doble conteo", "signs wrong", "solo residual sin dict"],
 tests: "salida coincide con solution output",
 feedback: "Si imprimiste -40.0 o residual negativo, restaste al revés (lima−total). La bridge documenta total, segmento y residual juntos (40.0).",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · residual bridge
# Bug a corregir: signo invertido (lima - total) y sin keys de bridge
total = 100.0
lima = 60.0
print({"total": total, "lima": lima, "residual": lima - total})`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `total = 100.0
lima = 60.0
print({"total": total, "lima": lima, "residual": total - lima})`,
 output: `{'total': 100.0, 'lima': 60.0, 'residual': 40.0}`,
 },
 },
 {
 id: "S17-T4-B-E1",
 subtopicId: "S17-T4-B",
 kind: "guided",
 instruction:
 "E1 (guiado) — Concepto: filtro pre-cutoff. Fixture fechas 2024-01-01 y 2024-02-01 con montos 1.0 y 9.0; cutoff 2024-01-31. Imprime lista de montos con fecha<=cutoff. Pass: `[1.0]`.",
 hint: "Máscara tx['fecha'] <= cutoff; imprime montos de esas filas.",
 hints: [
 "Máscara tx['fecha'] <= cutoff; imprime montos de esas filas.",
 "fecha > cutoff selecciona el post-periodo (9.0), no el as-of.",
 ],
 edgeCases: ["< vs <=", "string compare"],
 tests: "salida coincide con solution output",
 feedback: "Si viste [9.0], filtraste fecha > cutoff (post-periodo). El control as-of usa fecha <= cutoff.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · cutoff filter
# Bug a corregir: máscara fecha > cutoff (post-periodo)
import pandas as pd
tx = pd.DataFrame({"fecha": pd.to_datetime(["2024-01-01", "2024-02-01"]), "monto": [1.0, 9.0]})
cutoff = pd.Timestamp("2024-01-31")
print(tx.loc[tx["fecha"] > cutoff, "monto"].tolist())`,
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
 hint: "delta = sum(todos los montos) - sum(montos con fecha <= cutoff).",
 hints: [
 "delta = sum(todos los montos) - sum(montos con fecha <= cutoff).",
 "Imprimir solo pre no reporta la contaminación; el memo necesita el delta.",
 ],
 edgeCases: ["delta invertido", "mean"],
 tests: "salida coincide con solution output",
 feedback: "Si imprimiste 10.0, reportaste solo el pre. El delta de leakage es total−pre = 5.0 (la tx de marzo).",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · post-cutoff sum
# Bug a corregir: se imprime solo pre, no el delta de leakage
import pandas as pd
tx = pd.DataFrame({"fecha": pd.to_datetime(["2024-01-01", "2024-03-01"]), "monto": [10.0, 5.0]})
cutoff = pd.Timestamp("2024-01-31")
pre = tx.loc[tx["fecha"] <= cutoff, "monto"].sum()
print(float(pre))`,
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
 "E3 (transferencia / mini-integración) — Une join + agregación + cutoff en un solo contrato (puente al You Do). Fixture: cli={C001,C002}; tx con C001: 3.0 (2024-01-01) y 10.0 (2024-05-01), C002: 2.0 (2024-01-15); cutoff 2024-02-01. Haz left merge, calcula `total_pre` (suma de montos con fecha<=cutoff sobre el merge) y `leakage_delta` = suma total de montos del merge − total_pre. Imprime exactamente el dict `{'rows_merge': int, 'total_pre': float, 'leakage_delta': float}`. Pass: `{'rows_merge': 3, 'total_pre': 5.0, 'leakage_delta': 10.0}`. Transfer: el portfolio exige estos tres números juntos, no un max suelto.",
 hint: "left merge → filtra fecha<=cutoff para total_pre; leakage_delta = sum(monto merge) - total_pre.",
 hints: [
 "m = cli.merge(tx, on='cliente_id', how='left'); rows_merge = len(m).",
 "total_pre = m.loc[m['fecha'] <= cutoff, 'monto'].sum(); delta = m['monto'].sum() - total_pre.",
 "Imprime un solo dict con las tres keys; no un max por cliente suelto.",
 ],
 edgeCases: ["max global sin merge", "olvido del left (pierde C002 si no hay tx)", "delta invertido"],
 tests: "salida coincide con solution output",
 feedback: "Si imprimiste solo un max por cliente o un único float, no integraste join+cutoff. El puente al portfolio son rows_merge, total_pre y leakage_delta juntos (3, 5.0, 10.0).",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · mini-integración join+cutoff
# Bug a corregir: max global sin merge ni filtro as-of (no hay rows_merge ni delta)
import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C002"]})
tx = pd.DataFrame({
 "cliente_id": ["C001", "C001", "C002"],
 "fecha": pd.to_datetime(["2024-01-01", "2024-05-01", "2024-01-15"]),
 "monto": [3.0, 10.0, 2.0],
})
cutoff = pd.Timestamp("2024-02-01")
feat = tx.groupby("cliente_id")["monto"].max()
print(feat.to_dict())`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import pandas as pd
cli = pd.DataFrame({"cliente_id": ["C001", "C002"]})
tx = pd.DataFrame({
 "cliente_id": ["C001", "C001", "C002"],
 "fecha": pd.to_datetime(["2024-01-01", "2024-05-01", "2024-01-15"]),
 "monto": [3.0, 10.0, 2.0],
})
cutoff = pd.Timestamp("2024-02-01")
m = cli.merge(tx, on="cliente_id", how="left")
total_pre = float(m.loc[m["fecha"] <= cutoff, "monto"].sum())
leakage_delta = float(m["monto"].sum() - total_pre)
print({"rows_merge": len(m), "total_pre": total_pre, "leakage_delta": leakage_delta})`,
 output: `{'rows_merge': 3, 'total_pre': 5.0, 'leakage_delta': 10.0}`,
 },
 },
 ],
 },
 youDo: {
 title: "Executive Data Quality & EDA Portfolio (cierre de calidad + EDA)",
 context:
 "Integra clientes/transacciones sintéticas limpias (S15–S16) con joins validados (cardinalidad + anti-join), reshape long/wide con schema estable, groupby/agg/transform, reconciliación de totales/denominadores y controles de leakage con cutoff. Entrega un script reproducible (`if __name__`), respuestas de negocio con evidencia numérica y un memo de límites/no-claims en español profesional. Sin PII real ni datos de producción. **Criterios de aceptación del dict** (mínimo): `rows_merge` (int), `n_huerfanos_left_only` (int), `total_monto` (float, todo el universo de tx del merge), `total_pre_cutoff` (float, solo `fecha <= cutoff`), `leakage_delta` (`total_monto - total_pre_cutoff`), `reconciled` (bool: p. ej. residual de partes vs total bajo eps). Este entregable es la base tabular; en **S18** trabajarás la lectura de incertidumbre (hallazgo vs hipótesis) sobre estos mismos hallazgos.",
 objectives: [
 "Dataset limpio + script reproducible re-ejecutable por un colega",
 "Joins con filas pre/post, validate o anti-join documentados",
 "Reshape o schema long/wide con columnas expected validadas",
 "Agregados (groupby) alineados a la pregunta de negocio (suma vs media)",
 "Reconciliación de totales/denominadores con residual o eps",
 "Cutoff anti-leakage con delta explícito en el memo",
 "Memo de límites y no-claims (sin causalidad no soportada)",
 ],
 requirements: [
 "Fixtures sintéticos end-to-end (Cliente-B/Sucursal-Norte/Sucursal-Sur, `C00x`, PEN; sin PII real)",
 "Joins con filas pre/post documentadas y anti-join o validate en el script o en el memo",
 "Al menos un reshape o validación de schema estable (set de columnas)",
 "Demo reproducible (`if __name__ == '__main__'`) que imprima `portfolio_summary`",
 "Dict `portfolio_summary` con las keys del docstring (contrato mínimo)",
 "Memo en español profesional: límites del dataset, no-claims, y delta de leakage",
 ],
 starterCode: `import pandas as pd

def portfolio_summary(clientes: pd.DataFrame, tx: pd.DataFrame, cutoff: str) -> dict:
 """Devuelve dict con al menos:
 rows_merge, n_huerfanos_left_only, total_monto, total_pre_cutoff,
 leakage_delta, reconciled (bool).

 Contrato de métricas 'pre': solo filas con fecha <= cutoff (as-of).
 total_monto = suma de montos del merge completo (puede incluir post-cutoff).
 leakage_delta = total_monto - total_pre_cutoff.
 reconciled = True si el residual de partes vs total de referencia cabe en eps
 (o documenta residual en el memo si usas bridge externa).
 """
 # Contrato: implementa la función (no dejes NotImplemented)
 # Sugerencia de pasos: left merge + indicator → anti-join count →
 # sumas con/sin filtro de fecha → delta → bool de reconciliación.
 raise NotImplementedError

if __name__ == "__main__":
 # Fixture sintético de laboratorio (sin PII real)
 clientes = pd.DataFrame({"cliente_id": ["C001", "C002"], "region": ["Sucursal-Centro", "Oficina-Este"]})
 tx = pd.DataFrame({
 "cliente_id": ["C001", "C001", "C002"],
 "fecha": pd.to_datetime(["2024-01-10", "2024-03-01", "2024-01-20"]),
 "monto": [10.0, 50.0, 5.0],
 })
 print(portfolio_summary(clientes, tx, "2024-01-31"))
 # Esperado conceptual (ajusta si amplías fixtures):
 # rows_merge=3, n_huerfanos depende de matches, total_pre usa ene, leakage_delta > 0
`,
 portfolioNote:
 "Este cierre del portfolio de calidad + EDA debe poder mostrarse a un stakeholder no técnico: métricas, reconciliación, límites y ausencia de claims causales no soportados. En S18 añadirás la capa de incertidumbre (intervalos, hallazgo vs hipótesis) sobre estos números — no reescribas los joins; reutiliza el dataset limpio.",
 rubric: [
 { criterion: "Joins con cardinalidad documentada (filas pre/post, validate o anti-join de huérfanos)", weight: "20%" },
 { criterion: "Reshape o schema estable long/wide con columnas expected validadas", weight: "15%" },
 { criterion: "Groupby/agg/transform alineado a la pregunta de negocio (suma vs media)", weight: "15%" },
 { criterion: "Reconciliación de totales/denominadores con diff o residual documentado", weight: "15%" },
 { criterion: "Control de leakage temporal (cutoff/as-of) con delta explícito", weight: "15%" },
 { criterion: "Privacidad: solo sintéticos, sin PII real ni secretos", weight: "10%" },
 { criterion: "Script reproducible (`if __name__`) + memo de límites/no-claims en español profesional", weight: "10%" }
 ],
 },
 selfCheck: {
 questions: [
 {
 question: "validate='one_to_one' en merge sirve para:",
 options: ["Fallar si la cardinalidad no es 1:1", "Imputar nulls", "Ordenar el DF", "Crear MultiIndex"],
 correctIndex: 0,
 explanation:
 "validate es un gate de cardinalidad: lanza MergeError si el join no es 1:1, evitando fan-out silencioso que infla sumas de montos. No imputa ni reordena.",
 },
 {
 question: "Un anti-join left_only identifica:",
 options: ["Solo matches perfectos", "Duplicados exactos internos", "Filas del left sin match en right", "Schema drift de dtypes"],
 correctIndex: 2,
 explanation:
 "Con indicator=True, left_only marca filas del left sin contraparte en right (p. ej. clientes del maestro sin transacciones). both = match; right_only = tx huérfanas.",
 },
 {
 question: "Tras un pivot a wide para un dashboard, el portfolio debería:",
 options: ["Dejar MultiIndex sin documentar", "Renombrar columnas solo en el slide de PowerPoint", "Usar mean por defecto en pivot_table sin declararlo", "Validar set de columnas esperado (p. ej. monto_ene, monto_feb)"],
 correctIndex: 3,
 explanation:
 "Un schema estable (set de columnas expected) evita roturas del dashboard; aggfunc y nombres se documentan en el memo, no solo en el slide.",
 },
 {
 question: "Una cohorte de cliente se define típicamente como:",
 options: ["La fecha del batch o del informe de hoy", "El periodo de la primera observación válida (p. ej. mes de primera compra)", "La última fecha de actividad (max) por cliente", "El promedio de todas las fechas de transacción"],
 correctIndex: 1,
 explanation:
 "Cohorte = primera observación válida (min de fecha por entidad). Usar la fecha del batch o max distorsiona retención y segmentación temporal.",
 },
 {
 question: "Leakage temporal ocurre cuando:",
 options: ["Incluyes datos posteriores al cutoff en features/métricas del pasado", "Usas CSV en vez de Excel", "Haces melt", "Documentas el denominador"],
 correctIndex: 0,
 explanation:
 "Cualquier agregado o feature con fecha > cutoff contamina el análisis before/after; filtra as-of (`fecha <= cutoff`) y reporta el delta de leakage en el memo.",
 }
 ],
 },
 resources: {
 docs: [
 {
 label: "pandas merge",
 url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html",
 note: "how, validate, indicator",
 },
 {
 label: "pandas user guide — Merge, join, concatenate",
 url: "https://pandas.pydata.org/docs/user_guide/merging.html",
 note: "how, validate, indicator, anti-patrones de fan-out",
 },
 {
 label: "pandas groupby",
 url: "https://pandas.pydata.org/docs/user_guide/groupby.html",
 note: "agg/transform named aggregation",
 },
 {
 label: "pandas reshaping",
 url: "https://pandas.pydata.org/docs/user_guide/reshaping.html",
 note: "melt/pivot/concat",
 },
 {
 label: "pandas window / rolling",
 url: "https://pandas.pydata.org/docs/user_guide/window.html",
 note: "rolling windows ordenadas",
 },
 {
 label: "pandas timeseries",
 url: "https://pandas.pydata.org/docs/user_guide/timeseries.html",
 note: "cohortes y fechas",
 },
 {
 label: "pandas MergeError",
 url: "https://pandas.pydata.org/docs/reference/api/pandas.errors.MergeError.html",
 note: "validate fail temprano",
 },
 ],
 books: [
 {
 label: "Python for Data Analysis — wrangling",
 note: "joins, reshape, groupby",
 },
 {
 label: "Effective Pandas — aggregation patterns",
 note: "agg vs transform",
 },
 ],
 courses: [
 {
 label: "Kaggle — Pandas (merge, groupby, reshape)",
 url: "https://www.kaggle.com/learn/pandas",
 note: "práctica guiada de merge/groupby alineada a esta sección",
 },
 {
 label: "pandas user guide (merging + groupby)",
 url: "https://pandas.pydata.org/docs/user_guide/merging.html",
 note: "lectura primaria oficial de joins y concatenación",
 },
 {
 label: "Real Python — Combining Data in pandas",
 url: "https://realpython.com/pandas-merge-join-and-concat/",
 note: "merge/join/concat con ejemplos claros",
 },
 {
 label: "PyArcana live",
 url: "https://pillb.github.io/pyarcana/",
 note: "curso en vivo — sección Joins · groupby · cierre",
 },
 {
 label: "deeplearning.ai — Data Engineering (concepts)",
 url: "https://www.deeplearning.ai/specializations/data-engineering",
 note: "pipelines y calidad; adaptar a pandas local",
 },
 {
 label: "Awesome Python Learning",
 url: "https://github.com/skupriienko/Awesome-Python-Learning",
 note: "mapa de recursos",
 },
 ],
 },
}
