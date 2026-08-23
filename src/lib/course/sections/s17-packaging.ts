import type { CourseSection } from '../../types'

export const section17: CourseSection = {
 id: "packaging",
 index: 17,
 title: "Joins, reshape, groupby y cierre analítico",
 shortTitle: "Joins · groupby · cierre",
 tagline: "Portfolio ejecutivo de calidad + EDA: dataset limpio, script reproducible, reconciliación y preguntas de negocio",
 estimatedHours: 18,
 level: "Práctica independiente",
 phase: 1,
 icon: "GitMerge",
 accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
 jobRelevance:
 "En un equipo de analytics de banca, fintech o retail en Perú, el analista que solo «hace merge y groupby» sin documentar cardinalidad (cuántas filas del lado derecho tocan cada clave del izquierdo) entrega números inflados al comité. Aquí aprendes a unir tablas con claves limpias, reshape long/wide con schema estable, agregaciones con contrato (suma vs. media) y reconciliación de totales que un stakeholder no técnico pueda auditar. Entregas un script reproducible, evidencias numéricas y un memo de límites, sin PII real ni claims causales sin evidencia.",
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
  heading: "Unes dos tablas y de pronto hay más filas que antes",
 paragraphs: [
   "No es un error del código: es lo que ocurre cuando la clave por la que unes no es única en uno de los lados. Cada coincidencia múltiple multiplica filas, los totales se inflan y el resultado sigue pareciendo perfectamente normal. Contar las filas antes y después de una unión es el hábito más barato de esta sección y el que más disgustos evita.",
   "Antes de unir hay que saber qué se espera. Si cada cliente tiene muchas transacciones, la relación es de uno a muchos y el resultado debe tener tantas filas como transacciones. Si esperabas uno a uno y sale otra cosa, la sorpresa está en los datos, no en la operación — y es mejor enterarse ahí que en la reunión. También conviene mirar lo que **no** casó: las filas huérfanas suelen ser el hallazgo más interesante del día.",
   "Después viene la forma. Los mismos datos pueden estar **largos** —una fila por cliente y mes— o **anchos**, con un mes por columna. Ninguna es mejor: la larga es cómoda para agregar y la ancha para leer en una tabla. Cambiar de una a otra es rutinario, y lo único que hay que cuidar es que los nombres de columna sigan significando lo mismo después del cambio.",
   "Agrupar es el paso donde aparecen las respuestas de negocio, y también donde se cuela el error más silencioso: agregar sin declarar sobre qué población. «El ticket promedio es 42» no significa nada sin decir de cuántos clientes, en qué periodo y excluyendo qué. Un promedio sin denominador es un número decorativo.",
   "La sección cierra reconciliando: el total agregado debe cuadrar con el detalle, y si no cuadra hay que explicar la diferencia en lugar de ajustarla. La pregunta que la atraviesa es de control: **¿cuántas filas debería tener esto, y por qué tiene otras?** El entregable no es un paquete publicado sino un dataset limpio, un script que se puede volver a correr y un memo con los límites.",
 ],
 callout: {
 type: "info",
 title: "Qué empaquetas aquí",
 content:
 "No publicas un paquete en PyPI: empaquetas un dataset limpio, un script reproducible y un memo de límites para un stakeholder. Joins y groupby son el camino. Si no puedes re-ejecutar el script y recuperar los mismos números, el “paquete” no está listo.",
 },
},
{
 heading: "Contrato de la sección (referencia)",
 optional: true,
 paragraphs: [
   "Bloque de referencia. Orden de los subtemas y entregable.",
   "**Orden de los subtemas.** T1 cubre las uniones: claves, cardinalidad, validación y anti-join. T2 pasa a la forma: concatenar, pasar de largo a ancho y mantener nombres estables. T3 trata la agregación con `groupby`, ventanas y cohortes. T4 cierra con la reconciliación y el memo.",
   "**Entregable.** Un portafolio ejecutivo con regiones ficticias y montos sintéticos: dataset limpio, script reproducible, respuestas de negocio con su evidencia y un memo de límites. Si no puedes volver a ejecutar el script y recuperar los mismos números, el paquete no está terminado.",
   "**Nota de alcance.** Aquí no se publica nada en PyPI; el empaquetado de módulos y la línea de comandos ya se trataron antes.",
 ],
},
{
 heading: "Diccionario rápido de la sección",
 paragraphs: [
 "**Cardinalidad:** cuántas filas del lado derecho (o izquierdo) corresponden a cada clave (1:1, 1:m, m:m). **Fan-out:** explosión de filas por claves duplicadas en un join (típico m:m accidental).",
 "**Anti-join:** filas de un lado sin match (`left_only` / `right_only` con `indicator=True`). **Long/wide:** forma apilada por periodo (long) frente a una columna por periodo (wide).",
 "**Cohorte:** periodo de la primera observación válida de cada entidad (p. ej. mes de primera compra), no la fecha del batch de hoy. **Cutoff / as-of:** solo datos conocidos hasta la fecha *t* (`fecha <= t`).",
 "**Leakage temporal:** usar post-cutoff como si fuera pasado. **Reconciliación:** suma de partes ≈ total de referencia (tolerancia `eps`) o residual documentado en una **tabla puente**.",
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
 "Si `len(out) >> len(left)` en un supuesto 1:1, hay fan-out o clave sucia. Detén el EDA, exporta el anti-join de duplicados y documenta `rows_cli → rows_merge` antes de sumar montos.",
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
      figure: {
        id: "S17-wide-long",
        caption:
          "Wide y long no son dos conjuntos de datos: son dos disposiciones del mismo. Reconocer cuál tienes en la mano es lo que decide si `groupby` te sirve o te estorba.",
        alt:
          "Dos tablas lado a lado con los mismos cuatro valores. A la izquierda, formato wide: una columna por mes. A la derecha, formato long: una fila por combinación de región y mes. Entre ambas, una flecha etiquetada melt en un sentido y pivot en el otro.",
      },
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
 "Caso sintético: regiones Lima (dos filas), Madrid y Cusco con montos → `agg` produce total y n; `transform('mean')` deja la media regional en cada fila. El EDA del portfolio usa agg para tablas y transform para scores relativos sin leakage de fechas (eso es T4-B). **Antes de agregar**, asegúrate de haber documentado la cardinalidad del join: un fan-out no detectado infla la suma y el residual de reconciliación no “cuadra”.",
 ],
 code: {
 language: 'python',
 title: "groupby_agg.py",
 code: `def s17_th_5():
    import pandas as pd

    df = pd.DataFrame({
     "region": ["Lima", "Lima", "Madrid", "Cusco"],
     "monto": [10.0, 20.0, 5.0, 15.0],
    })
    agg = df.groupby("region", as_index=False).agg(monto_sum=("monto", "sum"), n=("monto", "size"))
    df2 = df.copy()
    df2["monto_region_mean"] = df2.groupby("region")["monto"].transform("mean")
    print(agg.to_dict(orient="list"))
    print(df2["monto_region_mean"].tolist())

s17_th_5()`,
 output: `{'region': ['Cusco', 'Lima', 'Madrid'], 'monto_sum': [15.0, 30.0, 5.0], 'n': [1, 2, 1]}
[15.0, 15.0, 5.0, 15.0]`,
 },
 callout: {
 type: "tip",
 title: "transform vs. agg",
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
 "Define cohorte con la primera observación válida (`min` de fecha por cliente), no con la fecha del batch de hoy ni con `max` (última actividad). Documenta el periodo (mes/semana) en el memo.",
 },
 },
 {
 heading: "Denominadores y totales",
 subtopicId: "S17-T4-A",
 paragraphs: [
 "Tras joins y agregaciones, el stakeholder pregunta: “¿cuadra el total?”. Reconciliación ejecutiva: la **suma de partes debe igualar el total** de referencia (o la diferencia queda documentada con tolerancia `abs(diff)<eps`). Los **denominadores** de tasas (pagados/activos, completos/universo) deben ser el mismo filtro que declaras en el texto del hallazgo — no un universo “más cómodo”.",
 "Contrato de **tabla puente**: `total → segmento_A → residual`. Si Lima=60 y total=100, el residual del resto es 40. Nunca uses un denominador de otro corte temporal o geográfico solo porque “sale un número bonito” en el slide. El residual es evidencia, no un error a esconder.",
 "Caso sintético: total consolidado 100 PEN; partes 60/30/10 en tres regiones del fixture; tasa de completitud 150/200=0.75. Las etiquetas de región del fixture (`Lima`, `Madrid`, `Cusco`) son identificadores sintéticos para tener claves distintas y ordenables: no son una desagregación geográfica real y no debes leerlas como tal. El portfolio imprime `diff`, `reconciled` y la tasa con su denominador explícito para el stakeholder no técnico. Si el join de T1 tenía fan-out no documentado, este bloque es el primero que “no cierra”: por eso T1 va antes que T4.",
 ],
 code: {
 language: 'python',
 title: "reconcile.py",
 code: `def s17_th_7():
    import pandas as pd

    total = 100.0
    parts = pd.Series({"Lima": 60.0, "Madrid": 30.0, "Cusco": 10.0})
    print("sum_parts", float(parts.sum()), "ok", abs(parts.sum() - total) < 1e-9)
    # tasa: pagados / clientes del universo declarado
    activos = 200
    pagados = 150
    print("tasa", pagados / activos, "denominador", activos)

s17_th_7()`,
 output: `sum_parts 100.0 ok True
tasa 0.75 denominador 200`,
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
 "Cualquier feature o métrica con fecha > cutoff invalida el análisis before/after. Filtra `fecha <= cutoff`, compara `sum_total - sum_pre` y deja el delta de leakage escrito en el memo — no solo en un comentario del notebook.",
 },
 }
 ],
 iDo: {
 intro: "Yo demuestro (I Do): ocho demos alineadas a T1–T4 sobre el mismo hilo de clientes y transacciones sintéticas. Verás left join con conteo de filas (esto es, comparar len antes y después del merge) y validate + anti-join (un merge que falla si la cardinalidad no cuadra, más la lista de filas sin pareja). También melt/pivot (apilar y desparramar columnas) y schema estable (el contrato de columnas que el dashboard espera). Luego groupby/transform (colapsar a una fila por grupo vs. reinyectar el agregado a cada fila) y cohorte + rolling (etiquetar a cada cliente por su primera fecha y promediar ventanas temporales). Cierras con reconciliación de totales (verificar que las partes sumen el total de referencia) y cutoff anti-leakage (fecha de corte para no mirar el futuro). Lee cada `why` (qué se rompería si lo omitieras) y el output esperado antes de pasar al We Do. No copies a ciegas: el contrato de salida es el checklist del portfolio.",
 steps: [
 {
 demoId: "S17-T1-A-DEMO",
 subtopicId: "S17-T1-A",
 environment: "local-python",
 description: "Elegir left join clientes-tx y validar fan-out 1:m",
 preamble:
 "En el portfolio ejecutivo unes un maestro de clientes sintéticos (Lima, Cusco) con transacciones en PEN. Antes de sumar montos, el analista debe *ver* si el join es 1:1 o 1:m. En esta demo `C001` tiene dos tx y `C002` una: el left join crece de 2 a 3 filas. No escribas aún; predice `rows` y el dict de conteos por `cliente_id`, luego compara con la salida. Si no cuentas filas pre/post, el fan-out se cuela al tablero.",
 code: {
 language: 'python',
 title: "demo_join.py",
 code: `def s17_ido_1():
    import pandas as pd
    cli = pd.DataFrame({"cliente_id": ["C001", "C002"], "region": ["Lima", "Cusco"]})
    tx = pd.DataFrame({"cliente_id": ["C001", "C001", "C002"], "monto": [3.0, 4.0, 5.0]})
    assert cli["cliente_id"].is_unique
    m = cli.merge(tx, on="cliente_id", how="left")
    print("rows", len(cli), "->", len(m), "card", "1:m")
    print(m.groupby("cliente_id").size().to_dict())

s17_ido_1()`,
 output: `rows 2 -> 3 card 1:m
{'C001': 2, 'C002': 1}`,
 },
 why: "El conteo pre/post es el gate de cardinalidad del join: documenta si el contrato es 1:1 o 1:m. Sin él, el fan-out multiplica filas y las sumas de monto se inflan en el tablero ejecutivo. El `assert` de unicidad en el lado 1 del maestro es el contrato *previo* al merge: si el maestro ya trae ids duplicados, el supuesto 1:m queda inválido antes de unir. En We Do corregirás inner vs. left y documentarás fan-out con un dict de filas.",
 retrospective:
 "Si puedes explicar por qué 2 clientes pueden dar 3 filas tras un left join, ya tienes el hábito de cardinalidad. El error clásico es tratar cada fila del merge como un cliente distinto. En We Do T1-A practicarás left, unicidad y el dict `rows_cli → rows_merge`.",
 },
 {
 demoId: "S17-T1-B-DEMO",
 subtopicId: "S17-T1-B",
 environment: "local-python",
 description: "Detectar fan-out con validate y anti-join de clientes sin tx",
 preamble:
 "El KPI (esto es, el indicador clave de desempeño que mide cobertura del maestro) no es “el merge corrió”. En esta demo ves dos herramientas: anti-join con `indicator=True` (lista quién no matcheó) y `validate='one_to_one'` (falla si hay fan-out). Predice la lista `anti` y si `validate_caught_fanout` es True antes de mirar la salida. Sin exportar huérfanos, el dashboard de calidad queda opaco.",
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
 why: "`validate` captura fan-out con `MergeError` específico: es un quality gate, no un crash a silenciar con `except Exception`. El anti-join (`left_only`) alimenta la tabla de evidencia de calidad con clientes sin transacciones. Sin él, el KPI de cobertura del maestro queda opaco y el stakeholder no sabe a quién le faltan datos. Huérfanos y fan-out son problemas distintos: cobertura vs. cardinalidad rota.",
 retrospective:
 "Huérfanos y fan-out no son el mismo ticket: unos son cobertura del maestro, el otro es cardinalidad rota. Si el merge “no truena”, la cobertura aún puede estar mal. Pregunta: ¿qué exportarías a la tabla de evidencia, la lista o solo un bool? We Do: `left_only`, `MergeError` controlado y KPI de conteo.",
 },
 {
 demoId: "S17-T2-A-DEMO",
 subtopicId: "S17-T2-A",
 environment: "local-python",
 description: "Pasar wide↔long con melt y pivot_table",
 preamble:
 "El portfolio a veces necesita series por periodo (long) y a veces una fila por cliente con columnas por mes (wide). En esta demo un wide de dos clientes y dos periodos se apila con `melt` y regresa con `pivot_table(..., aggfunc='sum')`. Observa shapes y la lista de periodos: el total de montos se conserva solo si el aggfunc es suma, no el default (mean).",
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
 why: "Long sirve para multipunto temporal (una fila por cliente-periodo); wide para el tablero tabular (una columna por mes). `aggfunc` explícito es contrato de negocio, no detalle de API: con `sum` se conserva el total de montos; el default (`mean`) lo distorsiona sin error visible. En We Do medirás `len` del melt, columnas post-pivot y concat de lotes diarios.",
 retrospective:
 "Si sabes por qué 2×2 wide da 4 filas long, controlas el contrato de filas del reshape. El error clásico es confiar en el default de `pivot_table` (mean) cuando el total de PEN debe conservarse con sum. We Do: `len` del melt, columnas post-pivot y concat de lotes.",
 },
 {
 demoId: "S17-T2-B-DEMO",
 subtopicId: "S17-T2-B",
 environment: "local-python",
 description: "Estabilizar nombres de columnas post-pivot al schema del portfolio",
 preamble:
 "Tras un pivot, las columnas crudas (`ene`, `feb`) no son el contrato del dashboard. En esta demo se prefijan a `monto_*` y se valida `set(columns) == expected`. Observa la lista final y el booleano True: un rename ad hoc en el notebook no es auditable; el gate de schema sí.",
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
 why: "Un schema estable (`set(columns) == expected`) evita roturas del dashboard y del diff del PR. Los sets ignoran orden: el orden de export se documenta en el memo si el CSV lo exige. El gate falla de forma explicable si falta `monto_feb`; un rename ad hoc en el notebook no es un contrato auditable ni revisable en el PR.",
 retrospective:
 "Schema estable = lo que el stakeholder y el diff del PR pueden auditar. El error clásico es renombrar “a ojo” en el notebook y creer que el dashboard seguirá. We Do: prefijo `monto_`, gate de set y `rename` con dict explícito.",
 },
 {
 demoId: "S17-T3-A-DEMO",
 subtopicId: "S17-T3-A",
 environment: "local-python",
 description: "Agregar montos por región y reinyectar media con transform",
 preamble:
 "El stakeholder pide total de PEN por región y, a la vez, un score por fila (monto vs. media regional). En esta demo `agg` colapsa a una fila por región y `transform('mean')` reinyecta la media al shape original. Observa el resumen y la lista `mean_reg`. Si usas agg donde ibas a usar transform, “te quedas sin filas” en el feature store (esto es, el repositorio de variables por transacción que alimenta los modelos posteriores).",
 code: {
 language: 'python',
 title: "demo_groupby.py",
 code: `def s17_ido_5():
    import pandas as pd
    df = pd.DataFrame({
     "region": ["Lima", "Cusco", "Madrid", "Madrid"],
     "monto": [10.0, 30.0, 5.0, 15.0],
    })
    resumen = df.groupby("region", as_index=False).agg(total=("monto", "sum"), n=("monto", "count"))
    df = df.assign(mean_reg=df.groupby("region")["monto"].transform("mean"))
    print(resumen.to_dict(orient="list"))
    print(df["mean_reg"].tolist())

s17_ido_5()`,
 output: `{'region': ['Cusco', 'Lima', 'Madrid'], 'total': [30.0, 10.0, 20.0], 'n': [1, 1, 2]}
[10.0, 30.0, 10.0, 10.0]`,
 },
 why: "`agg` produce la tabla ejecutiva (una fila por grupo); `transform` reinyecta la media al shape original para scores por fila. Named agg documenta el schema del CSV ejecutivo (`total`, `n`); `as_index=False` facilita merges posteriores. No mezcles sum y mean sin contrato: confundir operadores es el bug clásico de “me quedé sin filas” en un feature store.",
 retrospective:
 "`agg` = tabla ejecutiva; `transform` = feature a nivel fila. Si “te quedaste sin filas”, usaste el operador del resumen donde ibas a scorear transacciones. Pregunta: ¿cuándo necesitas una fila por grupo y cuándo una por tx? We Do: sum vs. mean, `transform('mean')` y named agg con schema `total`/`n`.",
 },
 {
 demoId: "S17-T3-B-DEMO",
 subtopicId: "S17-T3-B",
 environment: "local-python",
 description: "Construir cohorte mensual y media móvil de 2 periodos",
 preamble:
 "Retención y evolución se miden con cohortes y ventanas, no con la fecha del informe de hoy. En esta demo cada cliente recibe el mes de su **primera** tx y la serie diaria de montos lleva media móvil de 2 periodos (con NaN iniciales). Predice dict de cohortes y la lista del rolling antes de mirar la salida. El memo declara no-claims: series bien definidas, no causalidad.",
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
 why: "Cohorte = `min(fecha)` por entidad (primera observación válida), nunca `max` ni la fecha del batch de hoy. Las ventanas rolling exigen series ordenadas por índice temporal; sin `sort_index` el EDA inventa tendencias. El memo declara no-claims: series bien definidas, no causalidad. En S18 añadirás la capa de incertidumbre sobre estos mismos cortes temporales.",
 retrospective:
 "Si sabes por qué C001 y C002 pueden compartir cohorte 2024-01, entiendes “entrada”, no “última actividad”. El error clásico es usar `max` o la fecha del informe de hoy. We Do: window=2 con NaN honesto, min vs. max, y `sort_index` antes de rolling.",
 },
 {
 demoId: "S17-T4-A-DEMO",
 subtopicId: "S17-T4-A",
 environment: "local-python",
 description: "Reconciliar total nacional vs. suma por región",
 preamble:
 "Tras joins y agregaciones, el stakeholder pregunta “¿cuadra el total?”. En esta demo partes Lima/Madrid/Cusco suman 100 y la tasa de completitud usa el denominador declarado (200). Observa `diff`, `reconciled` y la tasa con su `den`: un residual se documenta, no se redondea a ojo ni se esconde en el slide.",
 code: {
 language: 'python',
 title: "demo_totals.py",
 code: `def s17_ido_7():
    import pandas as pd
    parts = pd.DataFrame({"region": ["Lima", "Madrid", "Cusco"], "monto": [50.0, 30.0, 20.0]})
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
 why: "Totales y denominadores anclan el EDA ejecutivo. Imprime numerador, denominador y tasa juntos para que el hallazgo sea auditable. Si `sum(partes) ≠ total`, el residual se documenta en la tabla puente: es evidencia, no un error a redondear a ojo ni a ocultar en el slide. El denominador debe ser el mismo universo del texto del hallazgo.",
 retrospective:
 "Si puedes explicar por qué el denominador debe ser el mismo universo del hallazgo, ya evitas el error clásico del EDA ejecutivo. We Do: eps estricto, tasa bien orientada y residual de la tabla puente.",
 },
 {
 demoId: "S17-T4-B-DEMO",
 subtopicId: "S17-T4-B",
 environment: "local-python",
 description: "Evitar leakage: agregar solo transacciones <= cutoff",
 preamble:
 "Un score de “riesgo a enero” que suma febrero es leakage temporal: mira el futuro. En esta demo cutoff 2024-01-31 deja `safe=10` y el total sin filtro `1009`, con delta 999. Observa los tres prints: el portfolio no basta con filtrar en silencio; el memo lleva el **delta de leakage** explícito.",
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
 why: "As-of = solo lo conocido a la fecha *t* (`fecha <= cutoff`). El delta de leakage (`total − pre`) va al memo del portfolio: sin ese número, el stakeholder no calibra cuánta confianza poner en el total “sin filtrar”. Filtrar en silencio no basta; reportar el delta es transparencia con el comité. En We Do practicarás máscara `<=`, delta y la mini-integración join+cutoff.",
 retrospective:
 "Si puedes explicar por qué 999 no es “ruido” sino contaminación post-cutoff, ya cierras el control as-of. El error clásico es filtrar en silencio y no reportar el delta al memo del portfolio. We Do: máscara `<=`, delta y mini-integración join+cutoff.",
 }
 ],
 },
 weDo: {
 intro: "Lo hacemos juntos (We Do): 24 ejercicios en liberación gradual, E1 (guiado) → E2 (independiente) → E3 (transferencia) por cada subtema T1–T4. Cada starter (el código inicial que recibes) trae un bug intencional a corregir; las pistas y el feedback nombran el error típico (inner vs. left, mean vs. sum, post-cutoff, etc.). Completa T1→T4 en orden: no saltes a agregar sin cardinalidad documentada. El E3 de T4-B es una mini-integración (join + pre-cutoff + delta de leakage) que prepara el You Do del portfolio de calidad + EDA — trátalo como puente, no como drill suelto.",
 steps: [
 {
 id: "S17-T1-A-E1",
 subtopicId: "S17-T1-A",
 kind: "guided",
 title: "Left join que conserva clientes sin tx",
 preamble:
 "- **Contexto:** el maestro de clientes del portfolio no debe desaparecer solo porque aún no hay transacciones.\n- **Meta:** practicar left merge por `cliente_id` y medir el largo del resultado.\n- **Éxito:** una línea con el entero `2` (C001 y C002 se conservan; C002 sin monto).\n- **Límites:** no uses `how='inner'`; no borres filas del maestro; imprime solo `len`, sin texto extra.",
 instruction:
 "1. Abre el starter: el merge es `inner` (bug) y corta a 1 fila.\n2. Cambia a `how='left'` sobre `cli` y `tx`.\n3. Imprime solo `len(...)` del resultado.\n4. Verifica mentalmente: C002 debe seguir contando aunque no tenga tx.",
 hint: "Usa cli.merge(tx, on='cliente_id', how='left') para conservar clientes sin tx.",
 hints: [
 "Usa cli.merge(tx, on='cliente_id', how='left') para conservar clientes sin tx.",
 "Imprime solo len(...) del resultado; el pass esperado es 2.",
 ],
 edgeCases: ["inner pierde C002", "how wrong"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprimiste `1`, usaste inner y perdiste C002. Left join conserva el maestro aunque no haya transacciones; el monto de huérfanos queda en NaN y se documenta aparte (anti-join en T1-B).",
 retrospective:
 "Left = todos los del maestro, con o sin match; inner = solo intersección. El KPI de cobertura del maestro se rompe si empiezas con inner. Pregunta: si C002 no tiene tx, ¿debe aparecer en el merge? Siguiente (E2): medir unicidad de la clave **antes** del merge.",
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
 title: "Medir unicidad del maestro (is_unique)",
 preamble:
 "- **Contexto:** un join “1:1” con ids duplicados en el maestro es un gate de calidad fallido, no un detalle cosmético.\n- **Meta:** reportar si `cliente_id` es único **antes** de limpiar.\n- **Éxito:** imprime exactamente `False` con el fixture de dos filas C001.\n- **Límites:** no uses `drop_duplicates` para “arreglar” antes de medir; no inventes otro booleano.",
 instruction:
 "1. Revisa el starter: imprime `True` a mano (bug).\n2. Mide `cli['cliente_id'].is_unique` sobre la Series real.\n3. Envuelve en `bool(...)` e imprime solo ese valor.\n4. No mutes ni dedupliques el DataFrame.",
 hint: "Mide cli['cliente_id'].is_unique sin limpiar filas antes.",
 hints: [
 "Mide cli['cliente_id'].is_unique sin limpiar filas antes.",
 "Envuelve en bool(...) e imprime solo ese valor; pass: False.",
 ],
 edgeCases: ["nunique confuso", "drop_duplicates silencioso"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprimiste True, no mediste is_unique sobre la Series con duplicados. El gate 1:1 falla cuando la clave del maestro no es única; el stakeholder necesita ver el rojo antes de limpiar.",
 retrospective:
 "Primero mides, luego decides limpiar. Silenciar duplicados con `drop_duplicates` antes del gate oculta el rojo al stakeholder. Pregunta: ¿por qué un booleano inventado (`print(True)`) no es un gate real? Luego (E3) documentarás fan-out del lado m con `rows_cli → rows_merge`.",
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
 title: "Documentar fan-out 1:m (rows pre/post)",
 preamble:
 "- **Contexto:** el memo del portfolio reporta `rows_cli → rows_merge`, no un número suelto que “se ve bien”.\n- **Meta:** hacer inner merge **sin** colapsar el lado m y devolver conteos pre/post.\n- **Éxito:** `{'rows_cli': 1, 'rows_merge': 3}` con un cliente y tres transacciones.\n- **Límites:** no uses `drop_duplicates` en tx antes del merge; no imprimas solo un entero.",
 instruction:
 "1. Lee el DEFECT: `drop_duplicates` en tx deja `rows_merge=1`.\n2. Haz `cli.merge(tx, on='cliente_id', how='inner')` sin deduplicar.\n3. Imprime un dict con `len(cli)` y `len(m)`.\n4. Si `rows_merge` es 1, aún estás ocultando el fan-out.",
 hint: "m = cli.merge(tx, on='cliente_id', how='inner') sin drop_duplicates; imprime dict con len(cli) y len(m).",
 hints: [
 "m = cli.merge(tx, on='cliente_id', how='inner') sin drop_duplicates en tx.",
 "print({'rows_cli': len(cli), 'rows_merge': len(m)}); si rows_merge es 1, aún colapsaste el lado m.",
 ],
 edgeCases: ["how left same here", "cartesian wrong keys", "solo un int sin dict"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprimiste 1 o {'rows_cli': 1, 'rows_merge': 1}, aplicaste drop_duplicates antes del merge y ocultaste el fan-out. El portfolio documenta rows_cli→rows_merge (1→3) para que el comité vea la cardinalidad real.",
 retrospective:
 "El lado m multiplica filas; eso no es bug si el contrato es 1:m, pero **debe** documentarse. Pregunta de cierre: ¿qué suma de montos se infla si creías 1:1? Puente a T1-B: `validate` y anti-join de huérfanos.",
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
 title: "Anti-join: clientes sin transacciones",
 preamble:
 "- **Contexto:** el portfolio exporta huérfanos del maestro (clientes sin tx) a una tabla de evidencia.\n- **Meta:** left merge con `indicator=True` y listar `left_only`.\n- **Éxito:** `['C002']` con el fixture cli={C001,C002}, tx solo C001.\n- **Límites:** no filtres `'both'`; no uses right anti-join en este ejercicio.",
 instruction:
 "1. Abre el starter: filtra `_merge == 'both'` (bug).\n2. Cambia el filtro a `'left_only'`.\n3. Imprime `.tolist()` de `cliente_id` de esas filas.\n4. Comprueba que C001 no aparece en la lista.",
 hint: "merge left con indicator=True; filtra _merge == 'left_only'.",
 hints: [
 "merge left con indicator=True; filtra _merge == 'left_only'.",
 "Imprime .tolist() de cliente_id de esas filas; pass: ['C002'].",
 ],
 edgeCases: ["right_only", "sin indicator"],
 tests: "salida coincide con solution output",
 feedback:
 "Si listaste C001, filtraste `'both'` (matches). `left_only` son clientes del maestro sin transacciones: la evidencia que el dashboard de calidad necesita exportar, no la intersección.",
 retrospective:
 "`left_only` = en el maestro, sin match. `both` = ya matcheó (no es huérfano). El error clásico es listar matches y creer que “no hay huecos” de cobertura. Pregunta: ¿aparecería C001 en el anti-join? Siguiente (E2): forzar fallo temprano con `validate='one_to_one'`.",
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
 title: "Gate validate one_to_one (MergeError)",
 preamble:
 "- **Contexto:** un m:m accidental multiplica filas y sesga sumas de PEN en el comité.\n- **Meta:** intentar merge 1:1 y reportar fallo controlado si hay fan-out.\n- **Éxito:** imprime exactamente la cadena `fail` (sin comillas extra).\n- **Límites:** captura solo `pd.errors.MergeError`; no uses `validate='many_to_many'` ni `except Exception` genérico.",
 instruction:
 "1. Revisa el starter: merge sin validate e imprime `len` (bug).\n2. Envuelve el merge con `validate='one_to_one'`.\n3. En el `except` de `MergeError`, imprime `fail`.\n4. No imprimas el largo del merge “exitoso”.",
 hint: "try/except pd.errors.MergeError alrededor del merge con validate='one_to_one'.",
 hints: [
 "try/except pd.errors.MergeError alrededor del merge con validate='one_to_one'.",
 "En el except imprime exactamente la cadena fail (sin comillas extra).",
 ],
 edgeCases: ["validate many_to_many", "except Exception demasiado amplio"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprimiste 2, el merge corrió sin validate y el fan-out pasó silencioso. El gate debe fallar con MergeError y reportar fail — es calidad, no un crash a esconder.",
 retrospective:
 "Fallar temprano es un quality gate, no un error de programación. Si el contrato real es 1:m, decláralo y no uses `one_to_one`. Luego (E3): el KPI es el *conteo* de huérfanos, no solo la lista.",
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
 title: "KPI de huérfanos (conteo left_only)",
 preamble:
 "- **Contexto:** el tablero de calidad del portfolio muestra un entero de cobertura, no la lista cruda de ids.\n- **Meta:** tras left merge con indicator, contar filas `left_only`.\n- **Éxito:** el entero `2` (3 clientes, tx solo en C001).\n- **Límites:** no cuentes `'both'`; no listes ids; imprime un int.",
 instruction:
 "1. Lee el DEFECT: cuenta `'both'` y sale 1.\n2. Cambia la condición a `'left_only'`.\n3. Convierte el sum a `int` e imprime.\n4. Ese número alimenta el dashboard, no el listado.",
 hint: "Tras indicator, (m['_merge'] == 'left_only').sum() como int.",
 hints: [
 "Tras indicator, (m['_merge'] == 'left_only').sum() como int.",
 "No filtres 'both': eso cuenta matches, no huérfanos.",
 ],
 edgeCases: ["inner count", "right anti"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprimiste 1, contaste 'both' (matches). El KPI de huérfanos del portfolio es left_only = 2; el comité ve el entero de cobertura, no solo la lista.",
 retrospective:
 "Lista = evidencia de filas; conteo = KPI de cobertura en el resumen ejecutivo. Ambos sirven, pero el tablero pide el entero. Pregunta: si `left_only` baja de 2 a 0, ¿qué cambió en el negocio o en el join? Puente a T2: reshape long/wide con schema estable.",
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
 title: "Melt wide→long (contar filas)",
 preamble:
 "- **Contexto:** al pasar un reporte mensual a series, el número de filas debe crecer de forma predecible.\n- **Meta:** aplicar `melt` y medir el largo del long.\n- **Éxito:** entero `4` (2 filas × 2 value_vars).\n- **Límites:** no imprimas `len` del wide; declara `id_vars` y `value_vars`.",
 instruction:
 "1. Abre el starter: imprime `len(df)` sin melt (bug).\n2. Aplica `melt(id_vars='id', value_vars=['a','b'])`.\n3. Imprime solo el `len` del resultado.\n4. Recuerda: 2×2 = 4, no 2.",
 hint: "df.melt(id_vars='id', value_vars=['a','b']) y luego len(...).",
 hints: [
 "df.melt(id_vars='id', value_vars=['a','b']) y luego len(...).",
 "No imprimas len(df) del wide: ese es 2, no 4.",
 ],
 edgeCases: ["stack mal", "sin id_vars"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprimiste 2, mediste el wide. melt multiplica filas por el número de value_vars (2×2=4); si el largo no cuadra, el schema de value_vars está mal.",
 retrospective:
 "El largo del long es un contrato predecible: filas × value_vars. Si no cuadra, el schema de `value_vars` (o el id) está mal — no “pandas falló”. Pregunta: con 3 meses y 10 clientes, ¿cuántas filas long esperas? Siguiente (E2): pivot de regreso con `id` como columna de export.",
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
 title: "Pivot_table y columnas con id",
 preamble:
 "- **Contexto:** el export wide del portfolio necesita la clave de cliente como columna, no solo como index.\n- **Meta:** `pivot_table` con `aggfunc='sum'` y `reset_index`, luego listar columnas.\n- **Éxito:** `['id', 'a', 'b']`.\n- **Límites:** no dejes el index sin promover; no uses mean por defecto.",
 instruction:
 "1. Revisa el starter: lista `w.columns` sin `reset_index` (falta `id`).\n2. Encadena `.reset_index()` tras el pivot_table.\n3. Imprime `columns.tolist()`.\n4. Verifica que `id` sea la primera columna del pass.",
 hint: "pivot_table(..., aggfunc='sum').reset_index() antes de listar columns.",
 hints: [
 "pivot_table(..., aggfunc='sum').reset_index() antes de listar columns.",
 "Sin reset_index, 'id' no aparece en columns y el pass falla.",
 ],
 edgeCases: ["pivot sin agg", "mean default confusion"],
 tests: "salida coincide con solution output",
 feedback:
 "Si listaste solo ['a','b'], faltó reset_index() para promover el index a columna 'id'. Sin esa clave el dashboard no une el wide al maestro.",
 retrospective:
 "Index ≠ columna de export: el dashboard une por clave visible, no por índice oculto. El error clásico es “el pivot ya tiene id” cuando solo está en el index. Luego (E3): apilar lotes diarios y reportar `n_lotes` / `n_filas`.",
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
 title: "Concat de lotes (n_lotes y n_filas)",
 preamble:
 "- **Contexto:** el portfolio une snapshots diarios; el memo debe decir cuántos lotes entraron y cuántas filas salieron.\n- **Meta:** `pd.concat` vertical de dos DataFrames de una fila e imprimir el dict de contrato.\n- **Éxito:** `{'n_lotes': 2, 'n_filas': 2}`.\n- **Límites:** no uses `axis=1` (alinea columnas, no apila casos); no midas solo `len(a)`.",
 instruction:
 "1. Lee el DEFECT: `n_filas` es `len(a)`.\n2. Apila los dos lotes en un solo DataFrame, sin arrastrar los índices originales.\n3. Imprime el dict con `n_lotes=2` y `n_filas=len(out)`.\n4. Si n_filas es 1, aún no apilaste.",
 hint: "pd.concat vertical de las dos tablas; mide el largo del resultado, no solo de a.",
 hints: [
 "pd.concat vertical de las dos tablas; mide el largo del resultado, no solo de a.",
 "El dict del memo lleva dos keys: cuántos lotes entraron y cuántas filas salieron (axis=0, no axis=1).",
 ],
 edgeCases: ["axis=1", "index duplicado confuso", "solo len(a)"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprimiste 1 o n_filas=1, solo mediste la primera tabla. concat axis=0 apila ambos lotes → n_filas 2 con n_lotes 2; el memo del portfolio exige ambos números.",
 retrospective:
 "Concat `axis=0` apila evidencia; `axis=1` ensancha el schema. El contrato de filas es re-ejecutable y auditable en el memo del portfolio. Pregunta: si `n_filas` es 1 con dos lotes, ¿qué olvidaste apilar? Puente a T2-B: nombres estables post-pivot.",
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
 title: "Prefijo monto_ tras pivot",
 preamble:
 "- **Contexto:** el schema del portfolio exige `monto_e`, `monto_f`, no el MultiIndex/nombres crudos del pivot.\n- **Meta:** pivot long→wide y renombrar columnas con prefijo.\n- **Éxito:** `['monto_e', 'monto_f']`.\n- **Límites:** no dejes `['e','f']`; el prefijo es obligatorio.",
 instruction:
 "1. Abre el starter: imprime columnas crudas (bug).\n2. Tras pivot, asigna `w.columns = [f'monto_{c}' for c in w.columns]`.\n3. Imprime `list(w.columns)`.\n4. Comprueba el prefijo en ambas.",
 hint: "Tras pivot, w.columns = [f'monto_{c}' for c in w.columns].",
 hints: [
 "Tras pivot, w.columns = [f'monto_{c}' for c in w.columns].",
 "Imprime list(w.columns); el prefijo monto_ es obligatorio en el schema.",
 ],
 edgeCases: ["dejar multiindex", "espacios"],
 tests: "salida coincide con solution output",
 feedback:
 "Si listaste `['e','f']`, faltó el prefijo `monto_` del schema del dashboard. Sin él, colisiones con otras métricas son fáciles y el export deja de ser legible para el stakeholder.",
 retrospective:
 "Prefijo = contrato legible para el dashboard, no cosmética. El error clásico es dejar nombres crudos del pivot “porque el plot ya se entiende”. Pregunta: ¿qué pasa si otra métrica también se llama `e`? Siguiente (E2): validar `set(columns) == expected`.",
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
 title: "Gate set(columns) == expected",
 preamble:
 "- **Contexto:** el script del portfolio debe fallar de forma explicable si falta una columna de negocio.\n- **Meta:** comparar `set(df.columns)` con el set expected real.\n- **Éxito:** `True` con columns `cliente_id`, `monto_ene`.\n- **Límites:** expected debe listar columnas reales; no uses igualdad de listas ordenadas para este gate.",
 instruction:
 "1. Revisa el starter: expected pide `monto_feb` (bug).\n2. Corrige expected a las columnas reales del DF.\n3. Imprime `set(df.columns) == expected`.\n4. El orden no importa en el set; el orden de export va al memo.",
 hint: "expected debe listar exactamente las columnas reales del DF.",
 hints: [
 "expected debe listar exactamente las columnas reales del DF.",
 "Compara set(df.columns) == expected; no uses listas ordenadas para el gate de set.",
 ],
 edgeCases: ["¿Orden importa en set? No", "list =="],
 tests: "salida coincide con solution output",
 feedback:
 "Si salió False, expected pedía monto_feb y el DF solo tiene monto_ene. El gate de schema compara sets reales; un expected inventado da falsos rojos.",
 retrospective:
 "Expected mal escrito da falsos rojos o verdes. El gate compara la realidad del DF, no el deseo del slide. Luego (E3): `rename` con dict origen→destino documentable.",
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
 title: "Rename explícito a nombre de negocio",
 preamble:
 "- **Contexto:** el diccionario de datos del portfolio llama a la métrica `monto`, no `a`.\n- **Meta:** `rename(columns=...)` e imprimir la lista de columnas.\n- **Éxito:** `['monto']`.\n- **Límites:** no reasignes `.columns` a una lista opaca sin dict origen→destino.",
 instruction:
 "1. Lee el DEFECT: imprime `['a']` sin rename.\n2. Aplica `rename(columns={'a': 'monto'})`.\n3. Imprime `.columns.tolist()`.\n4. El schema del export debe ser el nombre de negocio.",
 hint: "df.rename(columns={'a': 'monto'}).columns.tolist()",
 hints: [
 "df.rename(columns={'a': 'monto'}).columns.tolist()",
 "No reasignes .columns a una lista opaca sin dict de origen→destino.",
 ],
 edgeCases: ["reassign mal", "axis"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprimiste ['a'], no aplicaste rename. El schema del export exige el nombre de negocio 'monto'; el PR puede auditar el dict origen→destino.",
 retrospective:
 "Dict rename es auditable en el PR; reasignar `.columns` a ciegas no deja rastro de origen→destino. El error clásico es “ya se ve bien en el notebook”. Pregunta: ¿qué prefiere el revisor, un dict o una lista opaca? Puente a T3: colapsar o reinyectar montos con groupby.",
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
 title: "Groupby sum de montos por región",
 preamble:
 "- **Contexto:** el tablero ejecutivo pide **total** de PEN por región, no el promedio de filas.\n- **Meta:** `groupby('region')['monto'].sum()` e imprimir dict.\n- **Éxito:** `{'Madrid': 3.0, 'Lima': 3.0}` (orden de keys según sort de pandas).\n- **Límites:** no uses mean; no mutes el DF original.",
 instruction:
 "1. Abre el starter: usa `.mean()` (bug).\n2. Cambia a `.sum()`.\n3. Imprime `.to_dict()`.\n4. Lima con dos filas (1+2) debe sumar 3.0, no 1.5.",
 hint: "groupby('region')['monto'].sum().to_dict() — suma, no media.",
 hints: [
 "groupby('region')['monto'].sum().to_dict() — suma, no media.",
 "La pregunta de negocio es total de PEN por región, no promedio.",
 ],
 edgeCases: ["mean", "as_index confusion"],
 tests: "salida coincide con solution output",
 feedback:
 "Si usaste mean, Lima sale 1.5 no 3.0. El contrato de negocio pidió suma de montos en PEN; mean y sum no son intercambiables en el slide del comité.",
 retrospective:
 "El slide del comité se rompe cuando el código responde “promedio” a la pregunta “total de PEN”. Eso no es un detalle de API: es un error de contrato de negocio. Pregunta: con dos filas Lima 1 y 2, ¿qué imprime sum y qué mean? Siguiente (E2): reinyectar media con `transform` sin colapsar filas.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · groupby sum
# Bug a corregir: mean en vez de sum
import pandas as pd
df = pd.DataFrame({"region": ["Lima", "Lima", "Madrid"], "monto": [1.0, 2.0, 3.0]})
print(df.groupby("region")["monto"].mean().to_dict())`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import pandas as pd
df = pd.DataFrame({"region": ["Lima", "Lima", "Madrid"], "monto": [1.0, 2.0, 3.0]})
print(df.groupby("region")["monto"].sum().to_dict())`,
 output: `{'Lima': 3.0, 'Madrid': 3.0}`,
 },
 },
 {
 id: "S17-T3-A-E2",
 subtopicId: "S17-T3-A",
 kind: "independent",
 title: "Transform mean sin colapsar filas",
 preamble:
 "- **Contexto:** un score por transacción necesita la media regional en *cada* fila, no una tabla de dos regiones.\n- **Meta:** `transform('mean')` e imprimir la lista de tres valores.\n- **Éxito:** `[2.0, 2.0, 2.0]` (Lima media 2, Madrid media 2).\n- **Límites:** no uses agg/sum del groupby (colapsa); no armes un map manual.",
 instruction:
 "1. Revisa el starter: `.sum().tolist()` deja 2 elementos.\n2. Usa `groupby('region')['monto'].transform('mean')`.\n3. Imprime `.tolist()` (debe haber 3 floats).\n4. Si la lista tiene 2 elementos, aún colapsaste.",
 hint: "transform('mean') reinyecta la media al shape original (3 filas).",
 hints: [
 "transform('mean') reinyecta la media al shape original (3 filas).",
 "No uses .sum().tolist() del groupby: colapsa a 2 filas por región.",
 ],
 edgeCases: ["agg colapsa", "map manual"],
 tests: "salida coincide con solution output",
 feedback:
 "Si la lista tiene 2 elementos, usaste agg/sum que colapsa grupos. transform preserva las 3 filas del DF — es el patrón del feature store por fila.",
 retrospective:
 "`transform` preserva el shape; `agg` lo reduce. Si la lista tiene 2 elementos en un DF de 3 filas, colapsaste. Pregunta: ¿para un score por tx usarías agg o transform? Luego (E3): named agg fija el schema del CSV ejecutivo.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · transform mean
# Bug a corregir: sum del groupby colapsa filas
import pandas as pd
df = pd.DataFrame({"region": ["Lima", "Lima", "Madrid"], "monto": [1.0, 3.0, 2.0]})
print(df.groupby("region")["monto"].sum().tolist())`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import pandas as pd
df = pd.DataFrame({"region": ["Lima", "Lima", "Madrid"], "monto": [1.0, 3.0, 2.0]})
print(df.groupby("region")["monto"].transform("mean").tolist())`,
 output: `[2.0, 2.0, 2.0]`,
 },
 },
 {
 id: "S17-T3-A-E3",
 subtopicId: "S17-T3-A",
 kind: "transfer",
 title: "Named agg: schema total y n",
 preamble:
 "- **Contexto:** el CSV del portfolio que ve el stakeholder debe llamarse `total` y `n`, no el genérico `monto`.\n- **Meta:** `groupby(..., as_index=False).agg(total=..., n=...)` y listar columnas.\n- **Éxito:** `['region', 'total', 'n']`.\n- **Límites:** no uses solo `sum().reset_index()`; declara nombres de agregación.",
 instruction:
 "1. Lee el DEFECT: sum simple → `['region','monto']`.\n2. Usa named aggregation con `total` y `n`.\n3. `as_index=False` para que `region` sea columna.\n4. Imprime `columns.tolist()`.",
 hint: "as_index=False + agg con total= y n= nombrados.",
 hints: [
 "as_index=False + agg con total= y n= nombrados.",
 "Un sum().reset_index() solo da ['region','monto'], no el schema total/n.",
 ],
 edgeCases: ["MultiIndex cols", "sin names"],
 tests: "salida coincide con solution output",
 feedback:
 "Si listaste ['region','monto'], usaste sum simple. Named agg con total y n produce el schema del resumen ejecutivo que el stakeholder lee en el CSV.",
 retrospective:
 "Named agg es el contrato de columnas del resumen (`total`, `n`), no un alias cosmético. Sin nombres, el export es ambiguo para el stakeholder. Pregunta: ¿qué rompe un dashboard si la columna se llama solo `monto`? Puente a T3-B: ventanas y cohortes temporales.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · named agg
# Bug a corregir: sum simple no nombra total ni n
import pandas as pd
df = pd.DataFrame({"region": ["Lima", "Madrid"], "monto": [1.0, 2.0]})
out = df.groupby("region")["monto"].sum().reset_index()
print(out.columns.tolist())`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import pandas as pd
df = pd.DataFrame({"region": ["Lima", "Madrid"], "monto": [1.0, 2.0]})
out = df.groupby("region", as_index=False).agg(total=("monto", "sum"), n=("monto", "count"))
print(out.columns.tolist())`,
 output: `['region', 'total', 'n']`,
 },
 },
 {
 id: "S17-T3-B-E1",
 subtopicId: "S17-T3-B",
 kind: "guided",
 title: "Rolling mean con NaN inicial",
 preamble:
 "- **Contexto:** una media móvil de 2 periodos no inventa valor en el primer punto.\n- **Meta:** `rolling(2).mean()` y listar con NaN como `None`.\n- **Éxito:** `[None, 1.5, 2.5]`.\n- **Límites:** no uses window=1; documenta mentalmente que el primer punto no tiene ventana completa.",
 instruction:
 "1. Abre el starter: `rolling(1)` (bug).\n2. Cambia a window=2.\n3. Convierte NaN a `None` al armar la lista.\n4. Imprime la lista completa.",
 hint: "rolling(2).mean(); convierte NaN a None al armar la lista.",
 hints: [
 "rolling(2).mean(); convierte NaN a None al armar la lista.",
 "window=1 nunca produce NaN inicial; el contrato pide window=2.",
 ],
 edgeCases: ["min_periods", "window 3"],
 tests: "salida coincide con solution output",
 feedback:
 "Si salió [1.0, 2.0, 3.0], usaste rolling(1). Con window=2 el primer valor es NaN → None y luego 1.5, 2.5; ocultar el NaN miente al gráfico.",
 retrospective:
 "NaN inicial no es error: es honestidad de la ventana. Ocultarlo con window=1 miente al gráfico del tablero. Pregunta: ¿por qué el primer punto no debe inventar un 1.0? Siguiente (E2): cohorte con min de fecha.",
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
 title: "Cohorte mensual (primera fecha)",
 preamble:
 "- **Contexto:** segmentar retención por “cuándo entró el cliente”, no por su última compra.\n- **Meta:** asignar cohorte YYYY-MM con `min` de fecha por cliente.\n- **Éxito:** `{'C001': '2024-01', 'C002': '2024-02'}`.\n- **Límites:** no uses `max`; no cortes el string de la fecha a mano de forma frágil.",
 instruction:
 "1. Revisa el starter: `transform('max')` (bug).\n2. Cambia a `transform('min')` y `to_period('M')`.\n3. Imprime dict id→cohort de filas únicas por cliente.\n4. C001 con ene y mar debe ser 2024-01.",
 hint: "groupby(cliente_id)[fecha].transform('min').dt.to_period('M').",
 hints: [
 "groupby(cliente_id)[fecha].transform('min').dt.to_period('M').",
 "Usa min, no max: la cohorte es la primera observación válida.",
 ],
 edgeCases: ["usar max", "string slice frágil"],
 tests: "salida coincide con solution output",
 feedback:
 "Si C001 sale `2024-03`, usaste `max` (última actividad). Cohorte = primera fecha válida → `2024-01`. Confundirlos distorsiona retención en el tablero, aunque el código “corra”.",
 retrospective:
 "max = última actividad; min = entrada a la cohorte. Confundirlos distorsiona retención. Luego (E3): ordenar el índice antes de rolling en un feed desordenado.",
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
 title: "Sort_index antes de rolling",
 preamble:
 "- **Contexto:** los feeds llegan desordenados; una ventana sobre el orden de llegada inventa tendencias.\n- **Meta:** ordenar el índice temporal, rolling(2).mean, reportar el último valor.\n- **Éxito:** float `2.5` (tras orden 1→2→3, ventana final (2+3)/2).\n- **Límites:** no hagas rolling sin `sort_index`; no cambies la window.",
 instruction:
 "1. Lee el DEFECT: rolling directo sobre índice desordenado.\n2. `s = s.sort_index()` antes del rolling.\n3. Imprime `float(...iloc[-1])` del mean.\n4. Sin sort, el “último” no es el último día del calendario.",
 hint: "s.sort_index() antes de rolling(2).mean().",
 hints: [
 "s.sort_index() antes de rolling(2).mean().",
 "Tras ordenar el índice por fecha, la ventana de 2 periodos usa los dos últimos días del calendario, no el orden de llegada del feed.",
 ],
 edgeCases: ["sin ordenar", "window wrong"],
 tests: "salida coincide con solution output",
 feedback:
 "Sin sort_index el último punto de la ventana no es el último día del calendario. Ordena siempre antes de rolling; una “subida” por desorden miente al stakeholder.",
 retrospective:
 "Orden temporal es precondición de ventanas, no un detalle opcional. Pregunta: ¿qué le dirías al stakeholder si el gráfico “subió” solo por desorden? Puente a T4: reconciliar totales y denominadores.",
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
 title: "Reconciliar totales con eps 1e-9",
 preamble:
 "- **Contexto:** el gate del portfolio declara si las partes cuadran con el total de referencia.\n- **Meta:** `abs(sum(parts) - total) < 1e-9`.\n- **Éxito:** `True` con parts 10+20+70 y total 100.\n- **Límites:** no uses tolerancia 1.0; no compares con `==` frágil como única estrategia sin eps documentado.",
 instruction:
 "1. Abre el starter: umbral `< 1.0` (bug).\n2. Cambia a `1e-9`.\n3. Imprime el booleano.\n4. Un descuadre de casi un sol no debe pasar el gate.",
 hint: "abs(sum(parts) - total) < 1e-9 (eps estricto del gate).",
 hints: [
 "abs(sum(parts) - total) < 1e-9 (eps estricto del gate).",
 "Tolerancia 1.0 es demasiado laxa para un control de reconciliación.",
 ],
 edgeCases: ["== exact float risk", "wrong total"],
 tests: "salida coincide con solution output",
 feedback:
 "Si usaste < 1.0, el gate es demasiado laxo y pasaría descuadres de casi un sol. Usa eps 1e-9; el número del gate es parte del contrato con el auditor.",
 retrospective:
 "Eps laxo aprueba descuadres que un auditor ve a simple vista. El número del gate es parte del contrato, no un detalle de estilo de código. Pregunta: ¿pasaría un descuadre de 0.5 con umbral 1.0? Siguiente (E2): tasa con denominador correcto.",
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
 title: "Tasa pagados sobre activos",
 preamble:
 "- **Contexto:** la tasa de conversión del hallazgo usa el universo activo como denominador, no el de “éxitos”.\n- **Meta:** imprimir `pagados / activos`.\n- **Éxito:** float `0.25` (10/40).\n- **Límites:** no imprimas 25 ni inviertas el cociente; no uses pagados como denominador.",
 instruction:
 "1. Revisa el starter: `activos / pagados` (bug).\n2. Invierte a `pagados / activos`.\n3. Imprime el float (no porcentaje).\n4. 10 de 40 es 0.25, no 4.0.",
 hint: "tasa = pagados / activos (numerador de éxito sobre universo activo).",
 hints: [
 "tasa = pagados / activos (numerador de éxito sobre universo activo).",
 "Imprime el float 0.25, no un porcentaje 25.",
 ],
 edgeCases: ["denominador pagados", "porcentaje 25"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprimiste 4.0, invertiste el cociente (activos/pagados). El denominador de la tasa es el universo activo; invertir es un error de negocio, no de sintaxis.",
 retrospective:
 "Denominador = universo del texto del hallazgo. Invertir el cociente es un error de negocio, no de sintaxis. Luego (E3): tabla puente total → Lima → residual.",
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
 title: "Tabla puente total–Lima–residual",
 preamble:
 "- **Contexto:** el memo del portfolio documenta total → segmento → residual, no un descuadre oculto.\n- **Meta:** construir el dict de la tabla puente con residual = total − lima.\n- **Éxito:** `{'total': 100.0, 'lima': 60.0, 'residual': 40.0}`.\n- **Límites:** no restes lima−total; no imprimas solo un float suelto.",
 instruction:
 "1. Lee el DEFECT: residual = lima − total (−40).\n2. Calcula residual = total − lima.\n3. Imprime el dict con las tres keys en floats.\n4. El residual es evidencia del resto del país, no un error a esconder.",
 hint: "residual = total - lima; imprime dict con total, lima y residual.",
 hints: [
 "residual = total - lima (no lima - total).",
 "print({'total': total, 'lima': lima, 'residual': residual}) con las tres keys en floats.",
 ],
 edgeCases: ["doble conteo", "signs wrong", "solo residual sin dict"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprimiste -40.0 o residual negativo, restaste al revés (lima−total). La tabla puente documenta total, segmento y residual juntos; no un float suelto en el slide.",
 retrospective:
 "Residual documentado > total “redondeado” en el slide. Pregunta: ¿qué partes faltan si residual es 40? Puente a T4-B: cutoff y delta de leakage.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-017 · residual tabla puente
# Bug a corregir: signo invertido (lima - total) y sin keys de la tabla puente
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
 title: "Filtro as-of fecha <= cutoff",
 preamble:
 "- **Contexto:** el control as-of del portfolio solo usa datos conocidos hasta el cutoff.\n- **Meta:** filtrar montos con `fecha <= cutoff` e imprimir la lista.\n- **Éxito:** `[1.0]` (queda enero; sale febrero).\n- **Límites:** no uses `>`; cuidado con comparar strings de fecha en vez de timestamps.",
 instruction:
 "1. Abre el starter: máscara `fecha > cutoff` (bug).\n2. Invierte a `fecha <= cutoff`.\n3. Imprime `.tolist()` de montos.\n4. El post-periodo (9.0) no debe aparecer.",
 hint: "Máscara tx['fecha'] <= cutoff; imprime montos de esas filas.",
 hints: [
 "Máscara tx['fecha'] <= cutoff; imprime montos de esas filas.",
 "fecha > cutoff selecciona el post-periodo, no el as-of.",
 ],
 edgeCases: ["< vs. <=", "string compare"],
 tests: "salida coincide con solution output",
 feedback:
 "Si viste `[9.0]`, filtraste `fecha > cutoff` (post-periodo). El control as-of usa `fecha <= cutoff`; un signo al revés contamina el before/after y el score “a enero”.",
 retrospective:
 "`<=` vs. `>` es el interruptor del as-of. Un signo al revés contamina el before/after. Siguiente (E2): reportar el delta de leakage, no solo el pre.",
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
 title: "Delta de leakage (total − pre)",
 preamble:
 "- **Contexto:** el memo del portfolio no basta con el total “seguro”; debe cuantificar cuánto del total mira el futuro.\n- **Meta:** `float(sum_total - sum_pre)` con cutoff fin de enero.\n- **Éxito:** `5.0` (la tx de marzo).\n- **Límites:** no imprimas solo pre; no inviertas el delta.",
 instruction:
 "1. Revisa el starter: imprime `pre` (bug).\n2. Calcula total − pre.\n3. Imprime el float del delta.\n4. 5.0 es la contaminación, no el monto “bueno”.",
 hint: "delta = sum(todos los montos) - sum(montos con fecha <= cutoff).",
 hints: [
 "delta = sum(todos los montos) - sum(montos con fecha <= cutoff).",
 "Imprimir solo pre no reporta la contaminación; el memo necesita el delta.",
 ],
 edgeCases: ["delta invertido", "mean"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprimiste 10.0, reportaste solo el pre. El delta de leakage es total−pre (la tx de marzo); sin ese número el stakeholder no calibra el tamaño del problema.",
 retrospective:
 "Delta = transparencia con el stakeholder. Solo pre sin delta oculta el tamaño del problema. Luego (E3): unir join + cutoff en un solo dict de contrato (puente al You Do).",
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
 title: "Mini-integración join + cutoff + delta",
 preamble:
 "- **Contexto:** el portfolio exige cardinalidad, as-of y leakage juntos, no drills sueltos.\n- **Meta:** left merge, `total_pre` con `fecha<=cutoff` y `leakage_delta` en un solo dict.\n- **Éxito:** `{'rows_merge': 3, 'total_pre': 5.0, 'leakage_delta': 10.0}`.\n- **Límites:** no uses max por cliente sin merge; no omitas ninguna de las tres keys; no inviertas el delta.",
 instruction:
 "1. Lee el DEFECT: `groupby(...).max()` sin merge ni filtro.\n2. Left merge cli–tx; `rows_merge = len(m)`.\n3. `total_pre` = suma de montos con fecha <= cutoff; delta = suma total − total_pre.\n4. Imprime un solo dict con las tres keys del contrato.",
 hint: "Une maestro y tx con left merge; el dict debe incluir el largo del merge, no un max suelto por cliente.",
 hints: [
 "Une maestro y tx con left merge; el dict debe incluir el largo del merge, no un max suelto por cliente.",
 "Separa montos pre-cutoff de la suma total; el delta es la diferencia (contaminación), no el pre solo.",
 "Tres keys en un solo print de dict; si solo imprimes un max, aún no integraste.",
 ],
 edgeCases: ["max global sin merge", "olvido del left (pierde C002 si no hay tx)", "delta invertido"],
 tests: "salida coincide con solution output",
 feedback:
 "Si imprimiste solo un max por cliente o un único float, no integraste join+cutoff. El puente al portfolio son rows_merge, total_pre y leakage_delta juntos — evidencia re-ejecutable para el comité.",
 retrospective:
 "Tres números juntos (filas del merge, total pre-cutoff, delta de leakage) = evidencia re-ejecutable para el comité. Si solo entregas un max por cliente, no hay cardinalidad ni as-of. Este E3 es el **ensayo** del You Do: el portfolio añade además huérfanos y `reconciled`, pero la lógica de join + cutoff + delta es la misma.",
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
 title: "Portfolio ejecutivo de calidad + EDA (cierre del nivel)",
 context:
 "Tú lo haces (You Do). Integra clientes/transacciones sintéticas limpias (S15–S16) con joins validados (cardinalidad + anti-join), reshape long/wide con schema estable (el contrato columna→tipo esperado), groupby/agg/transform, reconciliación de totales/denominadores y controles de leakage con cutoff (fecha de corte que separa el pasado del futuro). Entrega un script reproducible (`if __name__`), respuestas de negocio con evidencia numérica y un memo de límites/no-claims (esto es, sin afirmar causalidad sin evidencia) en español profesional. Sin PII real (datos personales identificables reales) ni datos de producción. Criterios de aceptación del dict (mínimo): `rows_merge` (int), `n_huerfanos_left_only` (int), `total_monto` (float, todo el universo de tx del merge), `total_pre_cutoff` (float, solo `fecha <= cutoff`), `leakage_delta` (`total_monto - total_pre_cutoff`), `reconciled` (bool: p. ej. residual de partes vs. total bajo eps). Este entregable es la base tabular; en S18 trabajarás la lectura de incertidumbre (hallazgo vs. hipótesis) sobre estos mismos hallazgos.",
 objectives: [
 "Dataset limpio + script reproducible re-ejecutable por un colega",
 "Joins con filas pre/post, validate o anti-join documentados",
 "Reshape o schema long/wide con columnas expected validadas",
 "Agregados (groupby) alineados a la pregunta de negocio (suma vs. media)",
 "Reconciliación de totales/denominadores con residual o eps",
 "Cutoff anti-leakage con delta explícito en el memo",
 "Memo de límites y no-claims (sin causalidad no soportada)",
 ],
 requirements: [
 "Fixtures sintéticos end-to-end (Lima/Madrid/Cusco, `C00x`, PEN; sin PII real)",
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
 reconciled = True si el residual de partes vs. total de referencia cabe en eps
 (o documenta residual en el memo si usas tabla puente externa).
 """
 # Contrato: implementa la función (no dejes NotImplemented)
 # Sugerencia de pasos: left merge + indicator → anti-join count →
 # sumas con/sin filtro de fecha → delta → bool de reconciliación.
 raise NotImplementedError

if __name__ == "__main__":
 # Fixture sintético de laboratorio (sin PII real)
 clientes = pd.DataFrame({"cliente_id": ["C001", "C002"], "region": ["Lima", "Cusco"]})
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
 "Este cierre del portfolio de calidad + EDA debe poder mostrarse a un stakeholder no técnico: métricas, reconciliación, límites y ausencia de claims causales no soportados. En S18 añadirás la capa de incertidumbre (intervalos, hallazgo vs. hipótesis) sobre estos números — no reescribas los joins; reutiliza el dataset limpio.",
 rubric: [
 { criterion: "Joins con cardinalidad documentada (filas pre/post, validate o anti-join de huérfanos)", weight: "20%" },
 { criterion: "Reshape o schema estable long/wide con columnas expected validadas", weight: "15%" },
 { criterion: "Groupby/agg/transform alineado a la pregunta de negocio (suma vs. media)", weight: "15%" },
 { criterion: "Reconciliación de totales/denominadores con diff o residual documentado", weight: "15%" },
 { criterion: "Control de leakage temporal (cutoff/as-of) con delta explícito", weight: "15%" },
 { criterion: "Privacidad: solo sintéticos, sin PII real ni secretos", weight: "10%" },
 { criterion: "Script reproducible (`if __name__`) + memo de límites/no-claims en español profesional", weight: "10%" }
 ],
 retrospective:
 "Antes de marcar listo: (1) ¿qué invariante demuestras con `rows_merge`, `n_huerfanos_left_only` y `leakage_delta` juntos? (2) ¿qué cambiarías con datos reales vs. sintéticos (PII, cutoff de producción)? (3) Escribe en el memo una frase de impacto medible (antes/después de gates) que puedas defender en 30 segundos sin claims causales. En S18 no reescribas los joins: reutiliza este dataset limpio para hallazgo vs. hipótesis.",
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
 note: "agg vs. transform",
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
