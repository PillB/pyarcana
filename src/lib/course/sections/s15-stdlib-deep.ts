import type { CourseSection } from '../../types'

export const section15: CourseSection = {
  id: "stdlib-deep",
  index: 15,
  title: "Pandas: ingesta, selección y tipos",
  shortTitle: "Pandas ingesta",
  tagline: "ingesta tipada de clientes/transacciones con reporte de coerciones y reconciliación de filas/columnas",
  estimatedHours: 18,
  level: "Práctica independiente",
  phase: 1,
  icon: "Table2",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "En banca, fintech y retail en Perú, el día a día del analista no es «abrir Excel y confiar»: es ingerir CSV y Excel de clientes y transacciones sin inventar datos. Aquí aprendes a declarar dtypes (el tipo declarado de cada columna: texto, número, fecha), reportar coerciones fallidas, reconciliar filas y columnas y dejar un manifest (origen, filas, columnas, hash) que otro equipo pueda auditar. Si un monto llega como 15,50 o el score como un token inválido, tu pipeline debe contarlo, no rellenarlo en silencio.",
  learningOutcomes: [
    { text: "Modelar Series y DataFrame con Index de negocio estable (ids de cliente) y dtypes explícitos" },
    { text: "Leer CSV/Excel con parser controlado (dtype, parse_dates, na_values, sep, decimal) y reconciliar filas" },
    { text: "Seleccionar filas/columnas con loc/iloc y crear columnas derivadas con assign de forma idiomática" },
    { text: "Evitar chained assignment (SettingWithCopy) usando loc sobre el original o .copy() explícito" },
    { text: "Tipar strings, tipos nullable, fechas y categorías; contar NaN/NaT tras conversión" },
    { text: "Aplicar schema de columnas con coerción explícita y emitir reporte {columna: n_fallos}" },
    { text: "Exportar a CSV/Excel (y contrato de dtypes estilo Parquet) con index=False y round-trip de columnas" },
    { text: "Emitir manifest de export (filas, columnas, memoria, source, hash) para provenance en CP-N2-A" },
  ],
  theory: [
    {
      heading: "Mapa de la sección: de NumPy a tablas tipadas",
      paragraphs: [
        "**Diccionario de la sección** (léelo antes de T1; vuelve a él cuando un término te detenga). **Series:** vector con **Index** (etiquetas de negocio, no solo 0..n-1). **DataFrame:** tabla de columnas (Series) alineadas por el mismo Index. **dtype:** tipo de una columna (`string`, `float64`, `datetime64`, `category`…). **Schema:** contrato columna→tipo esperado. **Coerción:** conversión explícita (texto→número, texto→fecha); con `errors='coerce'`, lo inválido pasa a NaN/NaT y **se cuenta** en un reporte. Distingue **nulos del parser** (tokens ya reconocidos al leer) de **fallos de conversión** (texto basura que solo se vuelve NaN tras `to_numeric`/`to_datetime`). **loc / iloc:** selección por etiqueta vs. por posición. **Chained assignment:** asignar en cadena `df[...][...] =` no actualiza el padre de forma fiable. **Manifest:** registro de filas, columnas, dtypes, memoria y provenance. **Provenance:** de dónde salió el archivo y si cambió entre corridas (origen + hash del artefacto).",
        "En la sección de NumPy aprendiste a calcular en **vectores homogéneos**. Aquí el objeto de trabajo cambia: **tablas con columnas de tipos distintos** que llegan como CSV/Excel de un retailer o un banco sintético. El hilo de laboratorio es **clientes y transacciones** (Lima/Arequipa/Cusco, montos en PEN, ids `C00x`/`T00x`). Sin PII real. Si falta una columna del schema o el dtype no cuadra, **falla explicable** — no inventes defaults. Los quality gates profundos y los joins de tablas quedan para más adelante; aquí te enfocas en **ingesta honesta**: leer, tipar, reportar y exportar de forma reproducible.",
        "Orden pedagógico: **T1 Modelo/lectura** (Series/DataFrame + parser) → **T2 Selección** (loc/iloc/assign + copias seguras) → **T3 Tipos** (nullable, coerce, schema) → **T4 Exportación** (CSV/Excel, contrato de dtypes, manifest). En cada subtema: teoría → demo I Do → tres prácticas We Do (guiada, independiente, transferencia). Ritmo sugerido (~18 h): sesiones 1–2 en T1; 3–4 en T2; 5–6 en T3; 7–8 en T4 + You Do + self-check. Criterio de cierre: filas reconciliadas, reporte de coerciones y manifest con provenance. Nunca PII real ni trates un score sintético como culpa, fraude o decisión automática sobre una persona.",
      ],
      callout: {
        type: "info",
        title: "Contrato de esta sección",
        content:
          "Stack: pandas + lo ya visto en el curso (paths, StringIO, dicts, funciones). Reporta coerciones; no “arregles” en silencio. Exporta con `index=False` salvo que el index sea clave de negocio documentada. Para Excel necesitas `openpyxl`; si no está, entrega CSV + schema JSON y documenta el límite.",
      },
    },
    {
      heading: "Series, DataFrame e Index",
      subtopicId: "S15-T1-A",
      paragraphs: [
        "Una **Series** es un vector con **Index** (etiquetas); un **DataFrame** es una tabla de columnas — cada columna es una Series alineada por el mismo Index. Esa idea es el puente desde NumPy: ya no tienes un solo dtype por array, sino **columnas heterogéneas** unidas por un eje de etiqueta. Si sumas dos Series con índices distintos, pandas **alinea por etiqueta**: el resultado tiene la unión de índices y pone NaN donde falta valor. El Index no es decoración: es el eje de negocio que decide qué filas se combinan.",
        "Un Index **estable** (`cliente_id`) facilita auditoría y, más adelante, unir tablas sin adivinar el orden de las filas. `set_index` / `reset_index` cambian el eje de etiqueta; no pierdas la clave de negocio al exportar. **Fail-closed** (fallar de forma segura): si el id no es único y el contrato lo exige, reporta duplicados **antes** de un `set_index` ciego. En un retailer peruano sintético, `C001` en Lima y `C002` en Arequipa deben seguir siendo las mismas filas después de filtrar, reindexar o exportar — la etiqueta es la identidad de negocio, no la posición 0 o 1.",
        "MultiIndex (por ejemplo región × mes) se menciona solo como etiquetas jerárquicas; las agregaciones multi-eje llegan cuando trabajes uniones y groupby. Caso de laboratorio: Series de scores indexada por `C001`/`C002` y un DataFrame con `region` (texto) + `score` (float64). Antes de las APIs de selección, interioriza esta regla: **etiqueta ≠ posición**. Si el index es `cliente_id`, `loc['C002']` y `iloc[1]` solo coinciden si el orden de filas lo permite — no lo asumas.",
      ],
      code: {
        language: 'python',
        title: "series_df.py",
        code: `def s15_th_1():
    import pandas as pd

    s = pd.Series([0.9, 0.4], index=["C001", "C002"], name="score")
    df = pd.DataFrame({
        "cliente_id": ["C001", "C002", "C003"],
        "region": ["Lima", "Arequipa", "Lima"],
        "score": [0.9, 0.4, 0.7],
    }).set_index("cliente_id")
    print(s.loc["C001"])
    print(df.index.tolist())
    print(df.dtypes.to_dict())

s15_th_1()`,
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
      heading: "Lectura CSV/Excel y opciones del parser",
      subtopicId: "S15-T1-B",
      paragraphs: [
        "`read_csv` y `read_excel` aceptan `dtype`, `parse_dates`, `na_values`, `usecols`, `sep` y `decimal`. Controlar el parser evita columnas `object` silenciosas y fechas como string que rompen filtros temporales. Cada parámetro es un **contrato de archivo**: si el CSV real usa `;` y coma decimal, el código debe declararlo — no “adivinar” después mirando el `head()`. Un extracto de retail en Lima con montos `15,50` leído como si el decimal fuera punto se vuelve basura numérica o se queda en texto: el bug no es “pandas raro”, es el contrato de parser no declarado.",
        "En datasets latinos declara encoding (`utf-8` o el real del proveedor), separador y **decimal** (`decimal=','` cuando el monto viene como `15,50`). Evita reescribir el archivo a mano con `.replace(',', '.')` salvo un preproceso documentado y acotado: el parámetro `decimal` es el camino idiomático cuando no hay comas de miles que confundan el parseo. `usecols` recorta columnas basura antes de tipar. Cuidado con `na_values`: tokens como `NA` o `N/A` **ya son nulos por defecto** en `read_csv`; `na_values` sirve para marcadores **propios del proveedor** (`SIN_DATO`, `ND`, `-999`). Excel requiere motor de terceros (`openpyxl`: `pip install openpyxl`). Fail-closed: si falta una columna requerida del schema de ingesta, no continúes “con lo que haya”.",
        "Siempre reconcilia **filas leídas vs. esperadas** y lista columnas + dtypes **antes** de confiar en un `head()` bonito. Caso sintético de laboratorio: CSV con `SIN_DATO` en monto → declara `na_values=['SIN_DATO']` (o cuenta la conversión con `to_numeric`), `cliente_id` como `string`, `monto` como `float64` y `fecha` como `datetime64`. Si el entorno no tiene `openpyxl`, completa el contrato con CSV + schema JSON y documenta el límite en el README del laboratorio — no finjas un export Excel que no corre.",
      ],
      code: {
        language: 'python',
        title: "read_csv_opts.py",
        code: `def s15_th_2():
    import pandas as pd
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
    print(len(df))

s15_th_2()`,
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
      heading: "loc, iloc, filtros y assign",
      subtopicId: "S15-T2-A",
      paragraphs: [
        "**loc** selecciona por **etiqueta** (nombre de fila/columna); **iloc** por **posición** (0, 1, 2…). Los filtros booleanos viven dentro de `loc`: `df.loc[df['score'] < 0.5, ['cliente_id', 'score']]`. Evita el encadenamiento `df[cols][rows]` o `df[df.a > 0]['b']`: es frágil y prepara el terreno del SettingWithCopy. La diferencia etiqueta/posición es la fuente clásica de off-by-one cuando el Index ya no es `0..n-1` sino `cliente_id`.",
        "`assign` devuelve un **nuevo** DataFrame con columnas derivadas y encaja en un pipeline legible (`df.loc[...].assign(...)`). Menos mutación accidental, más fácil de testear. En producción muchos equipos prefieren máscaras explícitas sobre `query` porque depuran mejor, tipan mejor en IDEs y no mezclan lógica de negocio dentro de un string frágil. Usa `query` solo si tu equipo ya lo estandarizó y lo prueba.",
        "Caso sintético de laboratorio: filtrar `score < 0.5` deja a `C002`; `assign(score_pct=...)` produce porcentajes `[90, 30, 60]`; `iloc[0, 0]` lee la celda en la esquina superior izquierda por posición. Regla de intención: si solo lees, no copies; si vas a **mutar** un subset, decide en voz alta si mutas el padre con `loc` o un `.copy()` con vida propia. Esa decisión es el puente al siguiente subtema (chained assignment).",
      ],
      code: {
        language: 'python',
        title: "loc_assign.py",
        code: `def s15_th_3():
    import pandas as pd

    df = pd.DataFrame({
        "cliente_id": ["C001", "C002", "C003"],
        "score": [0.9, 0.3, 0.6],
        "region": ["Lima", "Lima", "Cusco"],
    })
    sub = df.loc[df["score"] < 0.5, ["cliente_id", "score"]]
    out = df.assign(score_pct=lambda x: x["score"] * 100)
    print(sub.to_dict(orient="list"))
    print(out["score_pct"].tolist())
    print(df.iloc[0, 0])

s15_th_3()`,
        output: `{'cliente_id': ['C002'], 'score': [0.3]}
[90.0, 30.0, 60.0]
C001`,
      },
      callout: {
        type: "tip",
        title: "loc para etiquetas",
        content:
          "Evita `df[cols][rows]` encadenado: un solo `loc` (o `iloc` si es posición). Así reduces SettingWithCopy y dejas la intención legible en una línea.",
      },
    },
    {
      heading: "Chained assignment y semántica de copias",
      subtopicId: "S15-T2-B",
      paragraphs: [
        "La asignación en cadena (`df[mask]['col'] = valor`) es un error de intención: no actualiza el DataFrame padre de forma fiable. En pandas moderno (con **Copy-on-Write** —esto es, escritura sobre copia automática— por defecto desde 2.x/3.x) el comportamiento es más determinista — la cadena **no** escribe en el padre — pero el patrón sigue prohibido en código profesional. Es el bug clásico de pipelines de ingesta en banca y retail: en pantalla el flag “revisar” parece seteado, al exportar el CSV el flag desaparece, y el ticket de calidad regresa.",
        "Patrón seguro (consenso Real Python / Data School / pandas docs): (1) asigna con **un solo** `.loc[row_mask, col] = valor` sobre el original, o (2) materializa `subset = df.loc[...].copy()` **antes** de mutar el subconjunto. Nunca `df[df.a > 0]['b'] = 1`. Regla mental: **una sola indexación en la asignación**, o **copy explícita** si el subset tiene vida propia (p. ej. se lo pasas a otra función). Con Copy-on-Write, `.copy()` declara independencia del objeto, no solo “silencia un warning”.",
        "En pipelines, prefiere métodos que devuelven objeto nuevo (`assign`, `where`) y documenta cuándo copias. Caso sintético: con `loc` marcas scores bajos como `flag='bajo'`; el subset copiado recibe `revisado=True` sin corromper el padre. Para demostrar aislamiento, muta la copia e imprime el original: si el original cambió, tenías un alias (`c = df`), no un `copy()`. Ese test mental es parte del hábito profesional.",
      ],
      code: {
        language: 'python',
        title: "no_chain.py",
        code: `def s15_th_4():
    import pandas as pd

    df = pd.DataFrame({"score": [0.1, 0.9, 0.4]})
    # seguro: loc sobre el original
    df.loc[df["score"] < 0.5, "flag"] = "bajo"
    # seguro: copy explícita para trabajar un subset
    bajo = df.loc[df["score"] < 0.5].copy()
    bajo["revisado"] = True
    print(df[["score", "flag"]].to_dict(orient="list"))
    print(bajo["revisado"].tolist())

s15_th_4()`,
        output: `{'score': [0.1, 0.9, 0.4], 'flag': ['bajo', nan, 'bajo']}
[True, True]`,
      },
      callout: {
        type: "danger",
        title: "Chained assignment",
        content:
          "Nunca hagas `df[df.a>0]['b'] = 1`. Ese patrón es el origen típico de SettingWithCopyWarning. Usa un solo `loc` sobre el original o `.copy()` explícita del subset antes de mutar.",
      },
    },
    {
      heading: "Strings, nullable, fechas y categorías",
      subtopicId: "S15-T3-A",
      paragraphs: [
        "Los dtypes **string**, **Int64**/**boolean** nullable, **datetime64** y **category** controlan memoria y errores de comparación. El dtype `object` heterogéneo es el default peligroso de un CSV mal tipado: mezcla texto, números y `None` sin avisar. Tipar es **declarar intención**: “esta columna es fecha”, “esta es monto”, “esta es etiqueta de región”. `int64` clásico **no admite nulos**; si un contador llega con huecos, usa `Int64` (nullable) con `pd.NA`, no fuerces ceros. `category` ahorra memoria solo con **cardinalidad baja o acotada** (regiones, estados); no castees ids casi únicos “por costumbre”.",
        "Convierte con `astype('string')`, `pd.to_numeric(..., errors=...)`, `pd.to_datetime`, `astype('category')`. Con `errors='coerce'`, los inválidos pasan a NaN/NaT — preferible a tumbar todo el lote **si cuentas** los fallos y los reportas. Normaliza texto de región con `str.title()` **antes** de `category` para no duplicar “lima” y “Lima” como dos categorías distintas (el mismo cliente sintético no debería ocupar dos etiquetas).",
        "Reporta cuántos valores no convirtieron: ese número es **evidencia de calidad**, no un detalle cosmético. Caso sintético: monto `x` y fecha `bad` → un NaN cada uno (fallo de **conversión**, no nulo del parser); región normalizada + `category` para Lima/Arequipa. El conteo de NaN nuevos es el embrión del **reporte de coerciones** de T3-B y del manifest de exportación de T4. Sin conteo, `errors='coerce'` se convierte en una forma elegante de esconder basura.",
      ],
      code: {
        language: 'python',
        title: "types.py",
        code: `def s15_th_5():
    import pandas as pd

    df = pd.DataFrame({
        "region": ["Lima", "arequipa", "Lima"],
        "monto": ["10", "x", "3.5"],
        "fecha": ["2024-01-01", "2024-02-01", "bad"],
    })
    df["region"] = df["region"].str.title().astype("category")
    df["monto_num"] = pd.to_numeric(df["monto"], errors="coerce")
    df["fecha_dt"] = pd.to_datetime(df["fecha"], errors="coerce")
    print(df.dtypes.astype(str).to_dict())
    print("monto_na", int(df["monto_num"].isna().sum()), "fecha_na", int(df["fecha_dt"].isna().sum()))

s15_th_5()`,
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
      heading: "Coerción explícita y schema",
      subtopicId: "S15-T3-B",
      paragraphs: [
        "Un **schema** (dict columna→tipo) declara el contrato de ingesta: `cliente_id: string`, `monto: float64`, `fecha: datetime64`. `astype` / `to_numeric` / `to_datetime` aplican la coerción; los fallos se **listan**, no se esconden. El schema es el acuerdo entre el dueño del dato y el pipeline: si el archivo cambia de forma, el schema te avisa en la primera fila de código — no tres dashboards después.",
        "No “arregles” silenciosamente (no pongas `0` ni la media donde había basura). Emite un reporte `{columna: n_fallos}`. Si falta una columna del schema, **falla explicable** (`KeyError` / mensaje con el nombre), no inventes defaults ocultos. Contar NaN **antes y después** de `to_numeric` aísla las **coerciones nuevas** de los nulos que ya venían del parser: eso es honestidad de métrica. Si el CSV trae solo tokens por defecto (`NA`, `N/A`), el delta de `to_numeric` puede ser **0** — el nulo ya estaba. Para practicar el delta, usa basura no reconocida (`x`, `SIN_DATO`) o declara `na_values` solo para marcadores del proveedor.",
        "Este reporte es la entrada natural a los quality gates que verás al endurecer contratos de calidad. Caso sintético: `monto` con `xx` (texto inválido) → `coercion_report={'monto': 1}` y dtypes finales string/float64. En **CP-N2-A**, el reporte viaja **junto** al DataFrame (función que devuelve tupla `(df, report)`), no en un mensaje de chat. El You Do de esta sección te pide exactamente ese contrato para clientes y transacciones.",
      ],
      code: {
        language: 'python',
        title: "schema_coerce.py",
        code: `def s15_th_6():
    import pandas as pd

    schema = {"cliente_id": "string", "monto": "float64"}
    raw = pd.DataFrame({"cliente_id": ["C001", "C002"], "monto": ["10.5", "N/A"]})
    report = {}
    df = raw.copy()
    df["cliente_id"] = df["cliente_id"].astype("string")
    before_na = df["monto"].isna().sum()
    df["monto"] = pd.to_numeric(df["monto"], errors="coerce")
    report["monto"] = int(df["monto"].isna().sum() - before_na)
    print(df.dtypes.astype(str).to_dict())
    print("coercion_report", report)

s15_th_6()`,
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
      heading: "CSV, Excel y contrato Parquet",
      subtopicId: "S15-T4-A",
      paragraphs: [
        "`to_csv` y `to_excel` materializan el dataset analítico. Parquet (`pyarrow`/`fastparquet`, los motores que leen y escriben Parquet) preserva tipos de forma nativa; si el motor no está en tu entorno, exporta **CSV + schema JSON** como contrato de tipos — el aprendizaje es el mismo: no pierdas el mapa columna→dtype. El **round-trip** (exportar y releer) es la prueba mínima de que no inventaste columnas ni reordenaste el contrato a ciegas.",
        "Usa `index=False` salvo que el Index sea **clave de negocio documentada**. Si dejas el index por defecto, al reingestar suele aparecer una columna `Unnamed: 0` que contamina el schema. Round-trip: lee de nuevo y compara columnas críticas (`cliente_id`, `monto`, `region`). Para Excel en memoria usa `BytesIO` + `engine=\"openpyxl\"` — sin esa dependencia el export a Excel no arranca; no es un fallo de tu lógica de negocio, es un prerequisito de entorno.",
        "Caso sintético: export CSV en `StringIO` → columnas idénticas al releer; Excel en `BytesIO` con bytes no vacíos; dict `parquet_contract` con dtypes por columna aunque no haya pyarrow instalado. Si falta `openpyxl`, el ejercicio de Excel fallará: instálalo (`pip install openpyxl`) o documenta CSV + schema JSON como entrega alternativa en el portfolio. La honestidad de dependencias es parte de la calidad profesional.",
      ],
      code: {
        language: 'python',
        title: "export.py",
        code: `def s15_th_7():
    import pandas as pd
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
    print("parquet_contract", schema)

s15_th_7()`,
        output: `['cliente_id', 'monto', 'region']
excel_bytes True
parquet_contract {'cliente_id': 'object', 'monto': 'float64', 'region': 'object'}`,
      },
      callout: {
        type: "warning",
        title: "Dependencia Excel (openpyxl)",
        content:
          "Para `to_excel`/`read_excel` necesitas `openpyxl` en el entorno (`pip install openpyxl`). Si no está, completa el contrato con CSV + schema JSON y documenta el límite. Parquet/pyarrow es opcional: el dict de dtypes cubre el aprendizaje de export tipado.",
      },
    },
    {
      heading: "Índices, formatos, provenance y memoria",
      subtopicId: "S15-T4-B",
      paragraphs: [
        "Un **manifest** registra filas, columnas, dtypes, `memory_usage` y provenance (`source`, hash del artefacto). Sin eso no hay reconciliación de ingesta en **CP-N2-A**: no sabes si el CSV de “esta mañana” es el mismo que el de ayer, ni cuántas filas salieron del pipeline, ni si alguien reordenó columnas a mano. El manifest es la contraparte del reporte de coerciones: uno habla de **tipos y fallos**, el otro de **artefacto y origen**.",
        "`index=False` en export evita columnas `Unnamed` al reingestar (salvo Index de negocio documentado). El hash (p. ej. SHA-256 truncado del CSV — una huella digital criptográfica del archivo) detecta si el artefacto cambió entre corridas. Hashea el **mismo payload** que entregas (`df.to_csv(index=False).encode()`), no el `repr` del DataFrame (la representación textual que pandas imprime en pantalla): el repr cambia con opciones de display y **no es** el archivo que pasa al siguiente equipo.",
        "Documenta memoria antes/después de castear a `category`/`string` cuando el dataset crece (`memory_usage(deep=True)` para strings `object`; sin `deep=True` subestimas el costo real). Caso sintético listo para portfolio: manifest JSON con `rows`, `columns`, `dtypes`, `memory_bytes`, `source=synthetic_clientes_v1` y un `content_sha256` corto. Ese JSON es evidencia de que tu ingesta es auditable — el cierre natural de la sección antes del You Do de dos tablas.",
      ],
      code: {
        language: 'python',
        title: "manifest.py",
        code: `def s15_th_8():
    import pandas as pd
    import hashlib, json

    df = pd.DataFrame({"cliente_id": ["C001", "C002"], "monto": [1.0, 2.0]})
    payload = df.to_csv(index=False).encode()
    manifest = {
        "rows": len(df),
        "columns": df.columns.tolist(),
        "dtypes": {c: str(t) for c, t in df.dtypes.items()},
        "memory_bytes": int(df.memory_usage(deep=True).sum()),
        "source": "synthetic_clientes_v1",
        "content_sha256": hashlib.sha256(payload).hexdigest()[:12],
    }
    print(json.dumps(manifest, sort_keys=True))

s15_th_8()`,
        output: `{"columns": ["cliente_id", "monto"], "content_sha256": "dff001519894", "dtypes": {"cliente_id": "object", "monto": "float64"}, "memory_bytes": 266, "rows": 2, "source": "synthetic_clientes_v1"}`,
      },
      callout: {
        type: "tip",
        title: "Provenance mínima",
        content:
          "source + filas + hash del artefacto bastan para reconciliar ingesta en CP-N2-A.",
      },
    },
    {
      heading: "Por qué el formato columnar cambia el trabajo que hace la máquina",
      subtopicId: "S15-T4-B",
      paragraphs: [
        "Ya sabes exportar a Parquet conservando el mapa columna→dtype. Falta la razón por la que ese formato existe, y es una razón física antes que una preferencia. Un CSV guarda los datos **por filas**: primero el registro completo de C001, después el completo de C002. Parquet los guarda **por columnas**: primero todos los `cliente_id`, luego todos los `monto`, luego todas las `region`. Con dos columnas y dos filas la diferencia no se nota. Con cuarenta columnas y millones de filas, esa decisión de acomodo determina cuánto tiene que leer la máquina cuando preguntas por tres de ellas.",
        "Supón que tu consulta solo necesita `monto`. En un archivo por filas, llegar a ese campo obliga a recorrer cada registro entero: los otros treinta y nueve valores de cada fila se leen igual, aunque los descartes enseguida. En un archivo por columnas, `monto` está contiguo y el lector toma ese bloque y ninguno más. A esa capacidad —empujar la selección de columnas hasta la capa que lee el archivo, en lugar de leer todo y filtrar después— se le llama **projection pushdown** (*empuje de la proyección*). No es una opción que actives: es la consecuencia de cómo quedaron acomodados los bytes.",
        "Los formatos columnares además parten la tabla en bloques de filas llamados **row groups** (*grupos de filas*) y guardan, por cada bloque y cada columna, un resumen mínimo: el valor menor y el mayor. Si preguntas por `monto > 19` y un bloque declara que su máximo es 13, el lector puede **saltarse el bloque completo** sin abrirlo. Eso es **filter pushdown** con **pruning** (*poda*) de bloques. La demostración de abajo lo reproduce a mano con listas de Python, para que la mecánica quede a la vista: 36 valores leídos con organización por filas, 12 leyendo solo la columna pedida, y 4 cuando las estadísticas por bloque permiten descartar dos de los tres grupos.",
        "Dos límites honestos, porque esto no es magia. El primero: la poda depende de que los datos estén **ordenados o agrupados de forma útil**. Si cada bloque contiene montos de todo el rango, ningún mínimo ni máximo descarta nada y el pruning no ahorra una sola lectura — por eso la partición de un dataset se decide pensando en cómo se va a consultar, no por costumbre. El segundo: partir de más produce **muchos archivos diminutos**, y el costo de abrir cada uno termina comiéndose la ganancia. Conviene además no confundir dos capas: **Parquet** es cómo quedan los datos *en el archivo*, mientras que **Arrow** es cómo quedan *en memoria* una vez leídos; motores como DuckDB o Polars usan ambas y ofrecen un `EXPLAIN` (o `.explain()`) que muestra qué columnas y qué bloques terminó leyendo el plan. Ninguno hace falta aquí y ninguno se instala en este curso. Lo que viaja contigo es el modelo mental: el formato no solo preserva tipos, también decide cuánto tiene que leer la máquina para responderte.",
      ],
      code: {
        language: 'python',
        title: "layout_columnar.py",
        code: `def s15_th_columnar():
    filas = [{"id": i, "region": ["Lima", "Madrid"][i % 2], "monto": 10 + i}
             for i in range(12)]

    # (1) Organización por filas: cada registro guardado junto
    por_filas = [tuple(f.values()) for f in filas]
    leidos_filas = sum(len(r) for r in por_filas)   # tocar la fila = tocar sus 3 campos

    # (2) Organización por columnas, partida en row groups de 4 filas
    def grupo(rows):
        return {
            "monto": [r["monto"] for r in rows],
            "region": [r["region"] for r in rows],
            "stats": {"monto_min": min(r["monto"] for r in rows),
                      "monto_max": max(r["monto"] for r in rows)},
        }

    grupos = [grupo(filas[i:i + 4]) for i in range(0, 12, 4)]
    leidos_columna = sum(len(g["monto"]) for g in grupos)          # projection pushdown

    vistos = [g for g in grupos if g["stats"]["monto_max"] > 19]   # row-group pruning
    leidos_podados = sum(len(g["monto"]) for g in vistos)

    print("valores_leidos_por_filas", leidos_filas)
    print("valores_leidos_por_columnas", leidos_columna)
    print("grupos_totales", len(grupos))
    print("grupos_tras_podar", len(vistos))
    print("valores_leidos_con_poda", leidos_podados)
    print("stats_por_grupo", [g["stats"] for g in grupos])

s15_th_columnar()`,
        output: `valores_leidos_por_filas 36
valores_leidos_por_columnas 12
grupos_totales 3
grupos_tras_podar 1
valores_leidos_con_poda 4
stats_por_grupo [{'monto_min': 10, 'monto_max': 13}, {'monto_min': 14, 'monto_max': 17}, {'monto_min': 18, 'monto_max': 21}]`,
      },
      callout: {
        type: "info",
        title: "Formato y consulta se eligen juntos",
        content:
          "Elegir Parquet no acelera nada por sí solo. Acelera cuando la consulta pide pocas columnas y cuando la partición permite descartar bloques enteros. Anota en el manifest por qué elegiste esa partición.",
      },
    },
  ],
  iDo: {
    intro:
      "Yo demuestro (I Do): 8 demos sobre el mismo hilo de clientes y transacciones sintéticas. Cubren los frentes del tablero — modelar el Index; leer el CSV con `dtypes`; seleccionar con `loc`/`assign`; evitar *chained assignment*; tipar columnas; exportar con manifest. Observa el patrón: declarar intención (esto es, decirle a pandas qué tipo esperas en cada columna). Luego seleccionar por etiqueta (no por posición), reportar coerciones (conversiones forzadas con conteo de fallos) y exportar con manifest (registro de filas, columnas, dtypes y hash del artefacto). Datos sintéticos Lima/Arequipa/Cusco; solo pandas.",
    steps: [
      {
        demoId: "S15-T1-A-DEMO",
        subtopicId: "S15-T1-A",
        environment: "local-python",
        description: "Construir DataFrame de clientes con Index estable y dtypes claros",
        preamble:
          "Antes de unir clientes y transacciones, el analista necesita un **Index de negocio estable**, no solo filas en orden 0, 1, 2. En esta demo un DataFrame sintético (C001/C002/C003, Lima/Arequipa/Cusco) pone `cliente_id` como index y tipa `score` a float64. No escribas aún: predice el nombre del index, la lista de ids y el par región/score de `C002`, luego compara con la salida. Si confundes etiqueta con posición, el pipeline de calidad miente cuando reordenas filas.",
        code: {
          language: 'python',
          title: "demo_df_index.py",
          code: `def s15_ido_1():
    import pandas as pd

    df = pd.DataFrame({
        "cliente_id": ["C001", "C002", "C003"],
        "region": ["Lima", "Arequipa", "Cusco"],
        "score": [0.91, 0.42, 0.77],
    })
    df = df.set_index("cliente_id")
    df["score"] = df["score"].astype("float64")
    print(df.index.name, df.index.tolist())
    print(df.loc["C002", "region"], float(df.loc["C002", "score"]))

s15_ido_1()`,
          output: `cliente_id ['C001', 'C002', 'C003']
Arequipa 0.42`,
        },
        why:
          "`set_index('cliente_id')` fija la identidad de negocio: `loc['C002']` lee por etiqueta, no por el orden en que llegó el CSV. Sin ese eje, alinear clientes y transacciones es adivinar filas. Tipar `score` a float64 declara intención numérica. En We Do T1-A practicarás set_index, acceso por etiqueta y alineación de Series con el mismo Index.",
        retrospective:
          "Si puedes explicar por qué `loc['C002']` no es lo mismo que «la segunda fila» sin mirar el código, ya tienes el hábito de Index de negocio. El error clásico es exportar y perder la clave. En We Do T1-A practicarás set_index, Series por etiqueta y suma alineada.",
      },
      {
        demoId: "S15-T1-B-DEMO",
        subtopicId: "S15-T1-B",
        environment: "local-python",
        description: "Ingerir CSV sintético con sep, decimal latino, dtype, parse_dates y na_values",
        preamble:
          "En retail y banca de LatAm el CSV a menudo llega con `;` y montos `15,50`. Si lees como si el decimal fuera punto, el monto se vuelve basura o texto. En esta demo un extracto sintético declara `sep`, `decimal`, `dtype` de `cliente_id`, `parse_dates` y `na_values` para celdas vacías. No escribas aún: predice filas, cuántos nulos en `monto` y el dtype de `fecha`, luego compara con la salida.",
        code: {
          language: 'python',
          title: "demo_read_csv.py",
          code: `def s15_ido_2():
    import pandas as pd
    from io import StringIO

    # Separador ; y decimal latino (coma) — contrato típico LatAm
    raw = """cliente_id;monto;fecha
C001;15,50;2024-03-01
C002;;2024-03-02
C003;20,0;2024-03-03
"""
    df = pd.read_csv(
        StringIO(raw),
        sep=";",
        decimal=",",
        dtype={"cliente_id": "string"},
        parse_dates=["fecha"],
        na_values=["", "NA"],
    )
    print(len(df), df["monto"].isna().sum())
    print(str(df["fecha"].dtype))
    print(df["cliente_id"].tolist())

s15_ido_2()`,
          output: `3 1
datetime64[ns]
['C001', 'C002', 'C003']`,
        },
        why:
          "Cada parámetro de `read_csv` es un **contrato de archivo** (esto es, una declaración explícita de cómo leer el CSV). `sep` y `decimal=','` son idiomáticos frente a un `.replace` manual frágil. Sin `parse_dates` las fechas rompen filtros temporales; `dtype` y `na_values` evitan columnas `object` opacas. En We Do T1-B practicarás na_values del proveedor, fechas y CSV latino con usecols.",
        retrospective:
          "Si puedes explicar por qué `15,50` sin `decimal=','` no es 15.5, ya internalizaste el contrato del parser. El error clásico es «arreglar» el archivo a mano y perder trazabilidad. We Do T1-B practica na_values, parse_dates y usecols.",
      },
      {
        demoId: "S15-T2-A-DEMO",
        subtopicId: "S15-T2-A",
        environment: "local-python",
        description: "Seleccionar filas Lima y asignar columna de prioridad de revisión (etiqueta neutra de laboratorio)",
        preamble:
          "Tras ingerir, el analista filtra un subconjunto y deriva una etiqueta de **laboratorio** (prioridad de revisión), no un veredicto sobre personas. En esta demo se copian filas de Lima, se asigna `prioridad_revision` si `score < 0.5`, y se imprime el dict de ids/scores/prioridad. Observa el orden: `loc` del filtro → `copy` → `assign`. Predice quién queda en «si» antes de mirar la salida. El score sintético no es culpa ni fraude.",
        code: {
          language: 'python',
          title: "demo_loc.py",
          code: `def s15_ido_3():
    import pandas as pd

    df = pd.DataFrame({
        "cliente_id": ["C001", "C002", "C003", "C004"],
        "region": ["Lima", "Arequipa", "Lima", "Lima"],
        "score": [0.9, 0.4, 0.3, 0.8],
    })
    lima = df.loc[df["region"] == "Lima"].copy()
    # umbral de demo: no es culpa, fraude ni decisión real sobre personas
    out = lima.assign(
        prioridad_revision=lambda x: (x["score"] < 0.5).map({True: "si", False: "no"})
    )
    print(out[["cliente_id", "score", "prioridad_revision"]].to_dict(orient="list"))

s15_ido_3()`,
          output: `{'cliente_id': ['C001', 'C003', 'C004'], 'score': [0.9, 0.3, 0.8], 'prioridad_revision': ['no', 'si', 'no']}`,
        },
        why:
          "Un solo `loc` + `assign` deja pipelines legibles y testeables; evita el encadenamiento `df[cols][rows]`. La etiqueta es de laboratorio: el score sintético no es culpa, fraude ni riesgo calibrado. En We Do T2-A practicarás umbral inclusivo, columnas derivadas y posición con `iloc`.",
        retrospective:
          "Si puedes decir por qué `C003` es «si» y `C001`/`C004` son «no» sin reejecutar, ya lees máscaras booleanas. El error clásico es filtrar con `df[df.region==...][cols]` encadenado y luego pelear con SettingWithCopy. Pregunta: ¿la etiqueta `prioridad_revision` es un veredicto sobre personas o un flag de laboratorio? We Do T2-A: umbral inclusivo, `assign` e `iloc`.",
      },
      {
        demoId: "S15-T2-B-DEMO",
        subtopicId: "S15-T2-B",
        environment: "local-python",
        description: "Evitar chained assignment: flag seguro con loc y subset con copy",
        preamble:
          "En pipelines de ingesta, el bug clásico es asignar en cadena (`df[mask]['col'] = ...`): en pantalla el flag parece seteado y al exportar desaparece. En esta demo se marca `estado='revisar'` con un solo `loc` sobre el original, se materializa un subset con `.copy()`, se añade `owner` y se imprimen ambos. Observa que el padre no tiene `owner` y el subset sí. No escribas aún; sigue el flujo seguro.",
        code: {
          language: 'python',
          title: "demo_copy.py",
          code: `def s15_ido_4():
    import pandas as pd

    df = pd.DataFrame({"id": ["C001", "C002", "C003"], "score": [0.2, 0.9, 0.4]})
    df.loc[df["score"] < 0.5, "estado"] = "revisar"
    subset = df.loc[df["estado"] == "revisar"].copy()
    subset["owner"] = "dq_team"
    print(df.to_dict(orient="list"))
    print(subset[["id", "owner"]].to_dict(orient="list"))

s15_ido_4()`,
          output: `{'id': ['C001', 'C002', 'C003'], 'score': [0.2, 0.9, 0.4], 'estado': ['revisar', nan, 'revisar']}
{'id': ['C001', 'C003'], 'owner': ['dq_team', 'dq_team']}`,
        },
        why:
          "Un solo `loc` sobre el padre actualiza de forma fiable; `.copy()` declara independencia del subset. El chained assignment nunca es el contrato profesional: con Copy-on-Write el comportamiento es más determinista, no más «mágico». En We Do T2-B practicarás loc, copy y aislamiento de mutación.",
        retrospective:
          "Si puedes explicar por qué `C002` no tiene `estado` y por qué mutar el subset no inventa `owner` en el padre, ya separaste mutación del original vs. trabajo en copia. We Do T2-B practica loc, copy y aislamiento.",
      },
      {
        demoId: "S15-T3-A-DEMO",
        subtopicId: "S15-T3-A",
        environment: "local-python",
        description: "Coercionar string/category, numeric y fechas con conteo de NaN",
        preamble:
          "Tipar es declarar intención: región como categoría, monto como número, alta como fecha. En esta demo se normaliza `region` con `str.title()` antes de `category`, se coerciona monto y alta con `errors='coerce'`, y se **cuentan** los NaN. Observa un fallo en monto (`?`) y uno en fecha (`2024-13-01`). Predice `na_monto` y `na_alta` antes de mirar la salida. Sin conteo, la coerción es una forma elegante de esconder basura.",
        code: {
          language: 'python',
          title: "demo_types.py",
          code: `def s15_ido_5():
    import pandas as pd

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
    print(df["monto"].tolist())

s15_ido_5()`,
          output: `category
na_monto 1 na_alta 1
[10.5, nan, 3.0]`,
        },
        why:
          "`str.title()` evita categorías duplicadas lima/Lima; `errors='coerce'` prefiere NaN contable a tumbar el lote; el conteo de NaN es evidencia de calidad, no un detalle cosmético. En We Do T3-A practicarás category, to_numeric y to_datetime por separado.",
        retrospective:
          "Si puedes decir por qué hay 1 NaN en monto y 1 en alta sin reejecutar, ya separas fallo de conversión de «dato bueno». Coerce **sin** conteo es basura elegante: el número de NaN es evidencia, no ruido. Pregunta: ¿`?` y `2024-13-01` son nulos del parser o fallos de conversión? We Do T3-A: category, `to_numeric` y `to_datetime` por separado.",
      },
      {
        demoId: "S15-T3-B-DEMO",
        subtopicId: "S15-T3-B",
        environment: "local-python",
        description: "Aplicar schema y listar coerciones fallidas por columna",
        preamble:
          "El schema es el acuerdo entre el dueño del dato y el pipeline: columna → tipo. En esta demo una función aplica string/float/datetime, **falla en voz alta** si falta una columna, y emite `report` con fallos nuevos de coerción (`monto: 1`, `fecha: 1`). Sigue el bucle por el schema y predice dtypes y reporte antes de mirar la salida. En CP-N2-A este par `(df, report)` viaja junto al DataFrame, no en un mensaje de chat.",
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
        elif typ == "datetime64":
            before = out[col].isna().sum()
            out[col] = pd.to_datetime(out[col], errors="coerce")
            report[col] = int(out[col].isna().sum() - before)
        else:
            raise TypeError(f"unsupported schema type: {typ}")
    return out, report

raw = pd.DataFrame({
    "cliente_id": ["C001", "C002"],
    "monto": ["1.5", "xx"],
    "fecha": ["2024-01-15", "bad"],
})
schema = {"cliente_id": "string", "monto": "float64", "fecha": "datetime64"}
df, rep = apply_schema(raw, schema)
print(df.dtypes.astype(str).to_dict())
print(rep)`,
          output: `{'cliente_id': 'string', 'monto': 'float64', 'fecha': 'datetime64[ns]'}
{'cliente_id': 0, 'monto': 1, 'fecha': 1}`,
        },
        why:
          "El delta de `isna` aísla coerciones **nuevas** de nulos del parser; tipos no soportados → TypeError; columna faltante → KeyError. Schema + reporte es el contrato fail-closed de CP-N2-A. En We Do T3-B practicarás delta, fail-closed y dtype string; el You Do une dos tablas con el mismo patrón.",
        retrospective:
          "Si puedes explicar por qué `cliente_id` reporta 0 y `monto` reporta 1, ya separas «ya era nulo» de «la conversión lo volvió nulo». Fail-closed (columna faltante) no se negocia con defaults. Pregunta: ¿dónde viaja el `report` en CP-N2-A — junto al DF o en un chat? We Do T3-B: delta, KeyError y dtype `string`.",
      },
      {
        demoId: "S15-T4-A-DEMO",
        subtopicId: "S15-T4-A",
        environment: "local-python",
        description: "Exportar a CSV y Excel sin perder columnas críticas; emitir contrato Parquet",
        preamble:
          "Exportar es materializar el dataset analítico sin inventar columnas. En esta demo se escribe CSV con `index=False`, se relee y se **assert** de columnas críticas; se escribe Excel en `BytesIO` con `openpyxl`; se emite un dict de dtypes (contrato estilo Parquet sin motor). Observa `rows`, `excel_ok` y `contract`. Predice si el round-trip conserva `cliente_id`/`monto`/`region`. Sin `openpyxl` el tramo Excel no arranca: es dependencia de entorno, no fallo de lógica.",
        code: {
          language: 'python',
          title: "demo_export.py",
          code: `def s15_ido_7():
    import pandas as pd
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
    print("contract", contract)

s15_ido_7()`,
          output: `rows 2 excel_ok True
contract {'cliente_id': 'object', 'monto': 'float64', 'region': 'object'}`,
        },
        why:
          "`index=False` evita `Unnamed: 0` al reingestar; el assert de columnas es la prueba mínima de export; el dict de dtypes documenta el contrato aunque no haya motor Parquet. En We Do T4-A practicarás CSV, Excel y contrato de dtypes por separado.",
        retrospective:
          "Si puedes explicar por qué el assert de columnas va **después** del re-read, ya tienes el hábito de round-trip. El error clásico es confiar en el DF en memoria y descubrir `Unnamed: 0` al reingestar. Pregunta: ¿qué prueba el `excel_ok` además del CSV? We Do T4-A: CSV sin index, Excel en memoria y contrato de dtypes.",
      },
      {
        demoId: "S15-T4-B-DEMO",
        subtopicId: "S15-T4-B",
        environment: "local-python",
        description: "Emitir manifest de filas/columnas, memoria y provenance",
        preamble:
          "Sin manifest no hay reconciliación de ingesta: no sabes si el CSV de «esta mañana» es el de ayer. En esta demo se serializa con `to_csv(index=False)`, se hashea el **mismo** blob, y se emite un JSON con filas, columnas, dtypes, memoria, `source` y `content_sha256` corto. Observa `sort_keys=True` en el dump. Predice `rows=3` y que el hash no es el del `repr` del DataFrame. Ese JSON es evidencia auditable para CP-N2-A.",
        code: {
          language: 'python',
          title: "demo_manifest.py",
          code: `def s15_ido_8():
    import pandas as pd, hashlib, json

    df = pd.DataFrame({"cliente_id": ["C001", "C002", "C003"], "monto": [1.0, 2.0, 3.0]})
    blob = df.to_csv(index=False).encode()
    manifest = {
        "rows": int(len(df)),
        "columns": df.columns.tolist(),
        "dtypes": {c: str(t) for c, t in df.dtypes.items()},
        "memory_bytes": int(df.memory_usage(deep=True).sum()),
        "source": "synthetic_tx_v1",
        "content_sha256": hashlib.sha256(blob).hexdigest()[:12],
    }
    print(json.dumps(manifest, sort_keys=True))

s15_ido_8()`,
          output: `{"columns": ["cliente_id", "monto"], "content_sha256": "15375056672a", "dtypes": {"cliente_id": "object", "monto": "float64"}, "memory_bytes": 335, "rows": 3, "source": "synthetic_tx_v1"}`,
        },
        why:
          "Hashear el payload exportado (no `str(df)`) hace el hash estable entre corridas; `memory_usage(deep=True)` no subestima strings; `source` es provenance mínima. El manifest reconcilia filas de entrada y de salida. En We Do T4-B practicarás memoria, manifest mínimo y hash truncado.",
        retrospective:
          "Si puedes explicar por qué el hash debe salir del CSV y no del display, ya tienes provenance profesional. El error clásico es hashear `str(df)` o el index por defecto y obtener un «mismo dataset, hash distinto». Pregunta de auto-chequeo: con el fixture de la demo, ¿`rows` es 3 y el hash es del payload con `index=False`? We Do T4-B: memoria deep, manifest mínimo y hash truncado.",
      },
    ],
  },
  weDo: {
    intro:
      "Lo hacemos juntos (We Do): 24 micro-ejercicios (E1 guiado → E2 independiente → E3 transferencia) en los 8 subtemas. Cada **starter** (el código inicial que recibes) trae un **DEFECT** deliberado — un defecto intencional que debes corregir. Corrígelo hasta igualar la salida esperada. Quédate en Series/DataFrame (los dos objetos básicos de pandas: un vector con etiquetas y una tabla de columnas alineadas por el mismo Index). Sin joins profundos ni quality gates avanzados; eso llega después. El objetivo no es copiar la solución: es interiorizar el contrato (parser controlado, `loc`, `errors='coerce'`, export con manifest) que reutilizarás en el You Do.",
    steps: [
      {
        id: "S15-T1-A-E1",
        subtopicId: "S15-T1-A",
        kind: "guided",
        title: "Index de negocio con set_index",
        preamble:
          "- **Contexto:** en el lote de clientes del retailer sintético, la identidad es `cliente_id`, no la posición de la fila.\n- **Meta:** poner `cliente_id` como index e imprimir la lista de etiquetas.\n- **Éxito:** con el fixture del starter, `print(df.index.tolist())` muestra `['C001', 'C002']`.\n- **Límites:** no borres los datos del starter; no uses joins ni validaciones de calidad avanzadas.",
        instruction:
          "1. Abre el starter: imprime `columns` (DEFECT: falta `set_index`).\n2. Aplica `set_index('cliente_id')` al DataFrame.\n3. Imprime solo `df.index.tolist()` (sin texto extra).\n4. Verifica que la salida sea `['C001', 'C002']`.",
        hint: "set_index('cliente_id').",
        hints: [
          "set_index('cliente_id').",
          "index.tolist().",
        ],
        edgeCases: ["reset_index accidental", "index name None sin set"],
        tests: "print(df.index.tolist()) == ['C001', 'C002'] tras set_index",
        feedback:
          "Si ves nombres de columnas (`cliente_id`, `score`) en vez del index, el DataFrame aún no tiene eje de negocio: falta `set_index` antes de imprimir. Columnas e index son ejes distintos.",
        retrospective:
          "El index estable es el puente a alinear tablas y auditar filas. No confundas «lista de columnas» con «lista de ids». Pregunta: si mañana reordenas el CSV, ¿tus etiquetas `C001`/`C002` siguen siendo las mismas? Siguiente (E2): leer un score por etiqueta, no por posición.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: falta set_index; hoy imprime columns en vez del index
import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001", "C002"], "score": [0.5, 0.8]})
print(df.columns.tolist())
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
        title: "Series por etiqueta, no por posición",
        preamble:
          "- **Contexto:** el score de un cliente se busca por id de negocio (`C002`), no por «el que quedó primero en el CSV».\n- **Meta:** leer el valor de la serie por etiqueta y publicarlo como float limpio.\n- **Éxito:** imprime `0.9` (valor de `C002`); no `0.1` (primera posición).\n- **Límites:** no uses `iloc`; conserva el fixture del starter.",
        instruction:
          "1. Revisa el starter: usa `s.iloc[0]` (DEFECT posicional).\n2. Accede por etiqueta: `s['C002']` o `s.loc['C002']`.\n3. Envuelve en `float(...)` e imprime solo ese número.\n4. No reordenes ni reconstruyas la serie.",
        hint: "Acceso por etiqueta, no por posición.",
        hints: [
          "Acceso por etiqueta: s['C002'] o s.loc['C002'].",
          "float(...) para un print limpio.",
        ],
        edgeCases: ["iloc en vez de etiqueta", "name incorrecto"],
        tests: "print(float(s['C002'])) == 0.9",
        feedback:
          "`iloc[0]` lee la primera **posición** (0.1), no la etiqueta `C002`. Usa `s['C002']` o `s.loc['C002']` y `float(...)` para un print limpio. Si reordenas la serie, `iloc[0]` cambia y la etiqueta no.",
        retrospective:
          "Etiqueta ≠ posición: si reordenas filas, `iloc[0]` cambia y `C002` no. Ese hábito evita off-by-one en pipelines con Index de negocio. Luego (E3) la alineación de dos Series pone a prueba el mismo eje.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: usa iloc posicional en vez de la etiqueta C002
import pandas as pd
s = pd.Series([0.1, 0.9], index=["C001", "C002"], name="score")
print(float(s.iloc[0]))
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
        title: "Alinear Series con add y fill_value",
        preamble:
          "- **Contexto:** dos extractos parciales de score se suman por **etiqueta** de cliente; no es un join de DataFrames (eso llega después).\n- **Meta:** sumar alineando índices y rellenar huecos con 0.\n- **Éxito:** tras `sort_index()`, el dict redondeado es `{'C001': 1.0, 'C002': 2.5}`.\n- **Límites:** no uses merge/join de tablas; no inventes filas a mano.",
        instruction:
          "1. Lee el DEFECT: `s1 + s2` deja NaN en `C001`.\n2. Suma alineando por Index y rellenando huecos con 0 (método de Series, no `merge`).\n3. Ordena con `sort_index()` y redondea a 2 decimales.\n4. Imprime el dict (sin texto extra); verifica `{'C001': 1.0, 'C002': 2.5}`.",
        hint: "Suma alineando índices; rellena huecos.",
        hints: [
          "Preferí `.add` con relleno de huecos sobre el operador +.",
          "sort_index() antes de to_dict().",
        ],
        edgeCases: ["NaN sin fill_value", "no ordenar"],
        tests: "out.round(2).to_dict() == {'C001': 1.0, 'C002': 2.5}",
        feedback:
          "El operador `+` alinea por index y deja NaN donde falta valor. `add(..., fill_value=0)` rellena el hueco cuando el negocio dice «cero si no aparece».",
        retrospective:
          "La alineación por Index es el mismo principio que unir tablas por clave, pero en Series. El error clásico es aceptar NaN «porque el operador + lo hizo». Pregunta de cierre: ¿qué valor debería tener un cliente que solo aparece en una de las dos Series si el negocio dice «cero si falta»? Puente a T1-B: leer el CSV ya con dtypes.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: s1 + s2 deja NaN en C001 (falta fill_value=0)
import pandas as pd
s1 = pd.Series([1.0, 2.0], index=["C001", "C002"])
s2 = pd.Series([0.5], index=["C002"])
out = (s1 + s2).sort_index()
print(out.round(2).to_dict())
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
        title: "na_values del proveedor al leer CSV",
        preamble:
          "- **Contexto:** el proveedor marca montos faltantes con `SIN_DATO`, un token **propio** que no es nulo por defecto en `read_csv`.\n- **Meta:** declarar ese marcador al leer e informar cuántos nulos hay en `b`.\n- **Éxito:** imprime `1` (un nulo en la columna `b`).\n- **Límites:** no reescribas el CSV a mano; no uses el default de `NA` como atajo de este ejercicio.",
        instruction:
          "1. Abre el starter: lee sin `na_values` y `isna` da 0.\n2. Pasa `na_values=['SIN_DATO']` a `read_csv`.\n3. Imprime `int(df['b'].isna().sum())`.\n4. Verifica salida `1`.",
        hint: "Declara el marcador del proveedor en el parser.",
        hints: [
          "pd.read_csv(StringIO(...), na_values=['SIN_DATO']).",
          "int(df['b'].isna().sum()).",
        ],
        edgeCases: ["na_values no aplicado", "usar NA por defecto (no enseña na_values)"],
        tests: "isna().sum() de b == 1 tras na_values=['SIN_DATO']",
        feedback:
          "Sin `na_values`, `'SIN_DATO'` es texto y `isna` no lo ve. Decláralo en el parser y vuelve a contar. No confíes en `NA` del default para practicar este contrato.",
        retrospective:
          "Distingue nulos del parser (tokens por defecto) de marcadores del proveedor. Si `isna` da 0 con basura visible, el contrato del parser está incompleto — no el «CSV mágico». Pregunta: ¿`SIN_DATO` es lo mismo que `NA` del default de pandas? Siguiente (E2): tipar fechas en la lectura.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: sin na_values, 'SIN_DATO' se lee como string y isna da 0
import pandas as pd
from io import StringIO
df = pd.read_csv(StringIO("a,b\\n1,2\\n3,SIN_DATO\\n"))
print(int(df["b"].isna().sum()))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import StringIO
df = pd.read_csv(StringIO("a,b\\n1,2\\n3,SIN_DATO\\n"), na_values=["SIN_DATO"])
print(int(df["b"].isna().sum()))`,
          output: `1`,
        },
      },
      {
        id: "S15-T1-B-E2",
        subtopicId: "S15-T1-B",
        kind: "independent",
        title: "parse_dates al ingerir la fecha",
        preamble:
          "- **Contexto:** si `fecha` queda como texto, los filtros temporales y el orden cronológico fallan en silencio o con errores confusos.\n- **Meta:** tipar la columna en la lectura con `parse_dates`.\n- **Éxito:** imprimes `True`, porque el dtype pertenece a la familia `datetime64` (la resolución concreta —`[ns]`, `[us]`— depende de la versión de pandas y no es lo que estás comprobando).\n- **Límites:** no conviertas después con un bucle manual; declara el contrato en `read_csv`.",
        instruction:
          "1. Revisa el starter: lee sin `parse_dates`, así que la fecha queda como texto.\n2. Añade `parse_dates=['fecha']`.\n3. Comprueba la **familia** del dtype, no su texto exacto: `str(df['fecha'].dtype).startswith('datetime64')`.\n4. Confirma que imprime `True`.",
        hint: "Declara la columna de fecha en la lectura.",
        hints: [
          "parse_dates en read_csv con la columna de fecha.",
          "str(df['fecha'].dtype).",
        ],
        edgeCases: ["dtype object", "formato de fecha inválido"],
        tests: "str(df['fecha'].dtype).startswith('datetime64')",
        feedback:
          "Sin `parse_dates` la columna queda como texto: un `head()` bonito miente. Declara el contrato en `read_csv` para que el dtype sea `datetime64` desde la ingesta y los filtros temporales no fallen en silencio. Fíjate en cómo está escrita la comprobación: compara la **familia** del dtype, no la cadena completa. pandas cambió la resolución por defecto de `datetime64[ns]` a `datetime64[us]` en la versión 3, y cualquier test atado al texto exacto se rompió sin que el código del alumno tuviera nada de malo. Un contrato debe afirmar lo que te importa —«esto es una fecha, no texto»— y nada más.",
        retrospective:
          "Tipar en la ingesta es más barato que «arreglar» después. El error clásico es confiar en un `head()` bonito con strings de fecha. Luego (E3) el CSV latino combina sep, decimal y usecols.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: sin parse_dates la fecha queda como object/string
import pandas as pd
from io import StringIO
df = pd.read_csv(StringIO("fecha,x\\n2024-01-01,1\\n"))
print(str(df["fecha"].dtype))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import StringIO
df = pd.read_csv(StringIO("fecha,x\\n2024-01-01,1\\n"), parse_dates=["fecha"])
print(str(df["fecha"].dtype).startswith("datetime64"))`,
          output: `True`,
        },
      },
      {
        id: "S15-T1-B-E3",
        subtopicId: "S15-T1-B",
        kind: "transfer",
        title: "CSV latino con decimal y usecols",
        preamble:
          "- **Contexto:** un extracto de retail llega con `;`, monto `15,50` y una columna basura `z` que no pertenece al schema de laboratorio.\n- **Meta:** declarar sep, decimal y columnas útiles en el parser.\n- **Éxito:** `monto.tolist()` es `[15.5]` (float, no texto).\n- **Límites:** no uses `.replace(',', '.')` sobre el CSV crudo; no dejes entrar `z`.",
        instruction:
          "1. Lee el DEFECT: solo `sep=';'` — el monto queda como texto.\n2. Añade `decimal=','` y `usecols=['cliente_id', 'monto']`.\n3. Imprime `df['monto'].tolist()`.\n4. Verifica `[15.5]`.",
        hint: "Contrato de parser: separador, decimal y columnas útiles.",
        hints: [
          "Además del sep, declara decimal y usecols de las columnas del schema.",
          "print(df['monto'].tolist()) — el float debe ser 15.5, no texto.",
        ],
        edgeCases: ["sin decimal → texto o mal parseo", "sin usecols entra z", "replace manual frágil"],
        tests: "sep=';' + decimal=',' + usecols → monto.tolist() == [15.5]",
        feedback:
          "Si omites `decimal=','`, el monto no llega como 15.5. Declara sep, decimal y usecols en `read_csv`; no uses replace sobre el CSV crudo.",
        retrospective:
          "El contrato del archivo se declara en parámetros, no en parches de string. Pregunta de cierre: ¿qué pasa si omites `usecols` y tipas después? Puente a T2-A: ya con tabla limpia, seleccionar filas con `loc`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: sin decimal=',' el monto queda como texto '15,50'; falta usecols
import pandas as pd
from io import StringIO
raw = "cliente_id;monto;z\\nC001;15,50;9\\n"
df = pd.read_csv(StringIO(raw), sep=";")
print(df["monto"].tolist())
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import StringIO
raw = "cliente_id;monto;z\\nC001;15,50;9\\n"
df = pd.read_csv(
    StringIO(raw),
    sep=";",
    decimal=",",
    usecols=["cliente_id", "monto"],
)
print(df["monto"].tolist())`,
          output: `[15.5]`,
        },
      },
      {
        id: "S15-T2-A-E1",
        subtopicId: "S15-T2-A",
        kind: "guided",
        title: "Filtro inclusivo con loc y umbral",
        preamble:
          "- **Contexto:** un gate de laboratorio marca clientes con score en o por encima del umbral 0.5.\n- **Meta:** seleccionar con `loc` y un comparador **inclusivo**.\n- **Éxito:** lista de `cliente_id` = `['C002']` (score exacto 0.5 no se cae).\n- **Límites:** no uses solo `iloc` posicional; no mutes el DF.",
        instruction:
          "1. Abre el starter: usa `score > 0.5` y sale `[]`.\n2. Cambia a `>= 0.5` dentro de `loc`.\n3. Selecciona la columna `cliente_id` y `tolist()`.\n4. Imprime solo esa lista.",
        hint: "loc con umbral inclusivo sobre score.",
        hints: [
          "df.loc[df['score'] >= 0.5, 'cliente_id'].",
          "tolist().",
        ],
        edgeCases: ["iloc posicional incorrecto", "filtro invertido", "score exacto 0.5 excluido por >"],
        tests: "loc score>=0.5 → cliente_id list == ['C002'] (fixture con borde 0.5)",
        feedback:
          "Con score 0.5 en el borde, `>` excluye a C002 y devuelve lista vacía. Si el umbral del negocio es inclusivo, usa `>=`. El bug no es «pandas raro»: es el comparador.",
        retrospective:
          "Umbral inclusivo vs. estricto es un error de negocio disfrazado de off-by-one. Pregunta: si el gate dice «score al menos 0.5», ¿qué comparador usas? Siguiente (E2): derivar columnas con `assign` sin mutar a ciegas.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: usa score > 0.5 (estricto); C002 tiene score 0.5 y queda fuera
import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001", "C002"], "score": [0.4, 0.5]})
print(df.loc[df["score"] > 0.5, "cliente_id"].tolist())
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001", "C002"], "score": [0.4, 0.5]})
print(df.loc[df["score"] >= 0.5, "cliente_id"].tolist())`,
          output: `['C002']`,
        },
      },
      {
        id: "S15-T2-A-E2",
        subtopicId: "S15-T2-A",
        kind: "independent",
        title: "Columna derivada con assign",
        preamble:
          "- **Contexto:** en un pipeline legible, las columnas derivadas se construyen sin ensuciar el DF original como paso obligatorio.\n- **Meta:** crear `doble = score * 2` con `assign` e imprimir la lista.\n- **Éxito:** `[2.0, 4.0]`.\n- **Límites:** no dejes el factor `*1`; prefiere `assign` sobre mutación opaca.",
        instruction:
          "1. Revisa el starter: multiplica por 1 e in-place.\n2. Usa `df.assign(doble=lambda x: x['score'] * 2)`.\n3. Selecciona `['doble']` y `tolist()`.\n4. Imprime solo esa lista.",
        hint: "Construye la columna derivada y devuelve un DF nuevo.",
        hints: [
          "Preferí assign con la fórmula score * 2.",
          "Selecciona la columna doble y tolist().",
        ],
        edgeCases: ["chained assign", "olvidar columna"],
        tests: "assign(doble=score*2)['doble'].tolist() == [2.0, 4.0]",
        feedback:
          "No mutes con `*1` in-place. Usa `assign` con la fórmula correcta (`score * 2`) y selecciona la columna `doble` para el print.",
        retrospective:
          "`assign` devuelve un objeto nuevo y hace la intención visible en una línea. El error clásico es mutar in-place con la fórmula incorrecta y no notar el factor. Luego (E3): posición pura con `iloc`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: multiplica mal (*1) y muta in-place; usa assign(doble=score*2)
import pandas as pd
df = pd.DataFrame({"score": [1.0, 2.0]})
df["doble"] = df["score"] * 1
print(df["doble"].tolist())
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
        title: "Celda por posición con iloc",
        preamble:
          "- **Contexto:** a veces el contrato es **posición** (fila 1, columna 0 de una grilla), no etiqueta de cliente.\n- **Meta:** leer con `iloc` la celda inferior izquierda del DF 2×2.\n- **Éxito:** imprime `3`.\n- **Límites:** no uses `loc` (etiquetas); índices base 0, no 1-based.",
        instruction:
          "1. Lee el DEFECT: `loc[0, 0]` devuelve 1 (etiqueta, no «abajo-izquierda»).\n2. Lee por **posición** la celda inferior izquierda del DF 2×2 (base 0).\n3. Envuelve en `int(...)` e imprime solo ese número.\n4. No reindexes el DataFrame; verifica `3`.",
        hint: "Posición, no etiqueta.",
        hints: [
          "Acceso por posición: fila 1, columna 0.",
          "int(...) para un print limpio.",
        ],
        edgeCases: ["confusión loc/iloc", "1-based"],
        tests: "int(df.iloc[1, 0]) == 3",
        feedback:
          "`loc` usa etiquetas (aquí 0,0 es 1). `iloc` usa posiciones: fila 1, col 0 es 3. Base 0, no 1-based.",
        retrospective:
          "`loc` = etiqueta; `iloc` = posición. Confundirlos es el off-by-one clásico cuando el Index ya no es 0..n-1. Pregunta: si el index fuera `cliente_id`, ¿`iloc[1]` seguiría siendo «el segundo cliente»? Puente a T2-B: mutar con seguridad.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: usa loc (etiqueta) en vez de iloc[1, 0]
import pandas as pd
df = pd.DataFrame([[1, 2], [3, 4]])
print(int(df.loc[0, 0]))
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
        title: "Asignar flag con un solo loc",
        preamble:
          "- **Contexto:** el pipeline debe marcar scores bajos en el **DataFrame original**, no en un fantasma de vista.\n- **Meta:** donde `score < 0.5`, asignar `flag = 'x'` con un solo `loc`.\n- **Éxito:** `flag.fillna('').tolist()` es `['x', '']`.\n- **Límites:** no uses `df[df...]['flag'] = ...` en cadena; normaliza NaN solo al imprimir.",
        instruction:
          "1. Abre el starter: no existe `flag` (imprime vacíos).\n2. Asigna con `df.loc[df['score'] < 0.5, 'flag'] = 'x'`.\n3. Imprime `df['flag'].fillna('').tolist()`.\n4. Verifica `['x', '']`.",
        hint: "Una sola indexación en la asignación.",
        hints: [
          "df.loc[df['score'] < 0.5, 'flag'] = 'x'.",
          "print(df['flag'].fillna('').tolist()).",
        ],
        edgeCases: ["chained df[df...]['flag']", "sin fillna en print"],
        tests: "flag.fillna('').tolist() == ['x', '']",
        feedback:
          "Asigna con `loc` sobre el original: una sola indexación en la asignación. Luego normaliza NaN con `fillna('')` solo para el print limpio, no para «inventar» datos de negocio.",
        retrospective:
          "Un solo `loc` es el patrón seguro de mutación del padre. El error clásico es la cadena que no escribe y el ticket de calidad que regresa al exportar. Pregunta: ¿`fillna('')` inventa un valor de negocio o solo limpia el print? Siguiente (E2): copiar el subset antes de mutarlo.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: no asigna la columna flag con loc
import pandas as pd
df = pd.DataFrame({"score": [0.2, 0.9]})
print(df.get("flag", pd.Series([""]*2)).tolist())
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
        title: "copy antes de mutar el subset",
        preamble:
          "- **Contexto:** a veces el subset viaja a otra función (revisión DQ) y necesita columnas propias sin tocar el padre.\n- **Meta:** filtrar, materializar con `.copy()`, añadir `ok=True` e imprimir.\n- **Éxito:** lista de `ok` = `[True, True]`.\n- **Límites:** no mutes el slice sin `.copy()`; conserva el filtro `score > 0.5`.",
        instruction:
          "1. Revisa el starter: `sub = df.loc[...]` sin `.copy()`.\n2. Encadena `.copy()` tras el `loc`.\n3. Asigna `sub['ok'] = True`.\n4. Imprime `sub['ok'].tolist()`.",
        hint: "Materializa el subset antes de mutarlo.",
        hints: [
          "Encadena .copy() tras el filtro por score.",
          "Asigna ok=True en el subset e imprime la lista.",
        ],
        edgeCases: ["sin copy", "filtro wrong"],
        tests: "subset copiado con ok=True → [True, True]",
        feedback:
          "El starter hace `sub = df.loc[...]` y muta: es un slice sin independencia. Encadena `.copy()` tras el `loc` del filtro y **después** asigna `ok=True`. El print debe salir de ese subset materializado.",
        retrospective:
          "`.copy()` declara que el subset tiene vida propia (p. ej. viaja a una función de DQ). Sin eso, el warning o la mutación fantasma regresan en producción. Pregunta: si solo lees el subset, ¿necesitas `copy`? Siguiente (E3): mutar la copia y demostrar que el original no cambió.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: muta un slice sin .copy() (riesgo SettingWithCopy)
import pandas as pd
df = pd.DataFrame({"score": [0.2, 0.9, 0.7]})
sub = df.loc[df["score"] > 0.5]
sub["ok"] = True
print(sub.get("ok", pd.Series([])).tolist())
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
        title: "Aislar mutación con df.copy",
        preamble:
          "- **Contexto:** en un code review te piden probar que mutar un «working set» no corrompe el dataset exportable.\n- **Meta:** crear una copia real, mutarla, e imprimir los scores del **original**.\n- **Éxito:** `[1.0, 2.0]` (el original intacto).\n- **Límites:** no uses `c = df` (alias); imprime el original, no la copia.",
        instruction:
          "1. Lee el DEFECT: `c = df` comparte identidad.\n2. Cambia a `c = df.copy()`.\n3. Muta `c` (p. ej. `iloc[0, 0] = 99.0`).\n4. Imprime `df['score'].tolist()` del original.",
        hint: "Copia real, no alias.",
        hints: [
          "c = df.copy() (no c = df).",
          "print(df['score'].tolist()) del original.",
        ],
        edgeCases: ["view accidental", "mutar df no c"],
        tests: "tras mutar la copy, df['score'] sigue [1.0, 2.0]",
        feedback:
          "`c = df` no copia: es el mismo objeto. Tras `c.iloc[0,0] = 99`, el original también cambia. Usa `df.copy()`, muta solo `c`, e imprime `df['score']` — debe seguir `[1.0, 2.0]`.",
        retrospective:
          "Alias (`c = df`) no es copia. Si el original cambió, no tenías aislamiento. Pregunta de cierre: ¿qué imprimirías para demostrar que la copia sí cambió? Puente a T3-A: tipar columnas sin esconder basura.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: c = df comparte identidad; muta el original
import pandas as pd
df = pd.DataFrame({"score": [1.0, 2.0]})
c = df
c.iloc[0, 0] = 99.0
print(df["score"].tolist())
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
        title: "Región normalizada a category",
        preamble:
          "- **Contexto:** «lima» y «Lima» no deben ser dos categorías distintas en un reporte de regiones.\n- **Meta:** normalizar con `str.title()` y castear a `category`.\n- **Éxito:** `dtype.name` imprime `category`.\n- **Límites:** no dejes `object`; title **antes** del astype.",
        instruction:
          "1. Abre el starter: imprime el dtype crudo (`object`).\n2. Encadena `.str.title().astype('category')` sobre la serie.\n3. Imprime `s.dtype.name`.\n4. Verifica `category`.",
        hint: "Normaliza texto y luego castea a category.",
        hints: [
          "str.title() primero para unificar mayúsculas y minúsculas de región.",
          "astype('category'); print(s.dtype.name).",
        ],
        edgeCases: ["object residual", "sin title"],
        tests: "dtype.name == 'category' tras title + astype",
        feedback:
          "Sin `title`, las mayúsculas inconsistentes duplican categorías. Sin `astype('category')`, el dtype sigue siendo object. Encadena ambos en ese orden.",
        retrospective:
          "Normalizar texto **antes** de `category` evita dos categorías para el mismo valor de negocio (`lima`/`Lima`). El error clásico es castear a category y «limpiar mayúsculas después», cuando ya fijaste etiquetas duplicadas. Pregunta: ¿cuántas categorías distintas tendrías con el fixture del starter si omites `title`? Siguiente (E2): montos basura a NaN contable.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: no aplica title ni category; imprime object
import pandas as pd
df = pd.DataFrame({"region": ["lima", "Lima"]})
s = df["region"]
print(s.dtype.name)
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
        title: "to_numeric con errors='coerce'",
        preamble:
          "- **Contexto:** un monto inválido (`'a'`) no debe tumbar todo el lote si el contrato permite NaN contable.\n- **Meta:** convertir con `errors='coerce'` e imprimir la lista.\n- **Éxito:** `[1.0, nan, 3.0]`.\n- **Límites:** no uses `errors='raise'` ni conviertas a int a la fuerza.",
        instruction:
          "1. Revisa el starter: sin `errors='coerce'` falla o no produce NaN.\n2. Llama `pd.to_numeric(..., errors='coerce')`.\n3. Imprime `s.tolist()`.\n4. Confirma el NaN en la posición del `'a'`.",
        hint: "Conversión numérica que tolera basura contable.",
        hints: [
          "errors='coerce' convierte inválidos en NaN.",
          "print(s.tolist()).",
        ],
        edgeCases: ["errors raise", "astype int falla"],
        tests: "to_numeric coerce → [1.0, nan, 3.0]",
        feedback:
          "Sin `errors='coerce'`, el valor `'a'` lanza error o se descarta. Usa `errors='coerce'` para dejar un NaN visible en esa posición.",
        retrospective:
          "La coerción sin conteo es ocultar basura; el NaN visible en la lista es el embrión del `coercion_report`. Pregunta: ¿cuántos NaN nuevos hay aquí y en qué posición? Siguiente (E3): el mismo principio en fechas con NaT.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: sin errors='coerce' falla o no produce NaN
import pandas as pd
try:
    s = pd.to_numeric(pd.Series(["1", "a", "3"]))
    print(s.tolist())
except Exception as e:
    print(type(e).__name__)
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
        title: "Fechas inválidas a NaT contable",
        preamble:
          "- **Contexto:** una fecha basura (`no-fecha`) debe volverse NaT y contarse, no quedarse como string opaco.\n- **Meta:** parsear con `errors='coerce'` e imprimir cuántos NaT hay.\n- **Éxito:** imprime `1`.\n- **Límites:** no uses `errors='ignore'`; cuenta con `isna`, no con `len` del series entero.",
        instruction:
          "1. Lee el DEFECT: `errors='ignore'` no deja NaT contable de forma fiable.\n2. Cambia a `errors='coerce'`.\n3. Imprime `int(s.isna().sum())`.\n4. Verifica `1`.",
        hint: "Parse de fechas con basura contable.",
        hints: [
          "Prefiere `errors='coerce'` sobre `errors='ignore'` al parsear fechas basura.",
          "int(s.isna().sum()) — NaT cuenta como na.",
        ],
        edgeCases: ["errors raise", "contar len"],
        tests: "isna().sum() == 1 tras to_datetime coerce",
        feedback:
          "`errors='ignore'` no deja un NaT contable de forma fiable: la basura puede seguir como string opaco. Usa `errors='coerce'`, cuenta con `isna` (NaT es nulo) e imprime el entero — aquí debe ser `1`.",
        retrospective:
          "NaT contable es el gemelo del NaN numérico en el reporte de calidad. Pregunta: ¿por qué `ignore` es peligroso en un pipeline auditado? Puente a T3-B: schema + reporte `{columna: n_fallos}`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: errors='ignore' no deja un NaT contable de forma fiable
import pandas as pd
s = pd.to_datetime(pd.Series(["2024-01-01", "no-fecha"]), errors="ignore")
print(int(pd.isna(s).sum() if hasattr(s, '__iter__') else 0))
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
        title: "Contar coerciones nuevas en monto",
        preamble:
          "- **Contexto:** el reporte de calidad necesita **cuántos** valores se volvieron NaN por la conversión, no solo «hay nulos».\n- **Meta:** aplicar `to_numeric` con `errors='coerce'` y reportar el delta isna.\n- **Éxito:** imprime `1` (el `'x'`).\n- **Límites:** resta isna después − antes; no rellenes con 0.",
        instruction:
          "1. Abre el starter: guarda `before` pero no convierte.\n2. Asigna `df['monto'] = pd.to_numeric(..., errors='coerce')`.\n3. Imprime `int(df['monto'].isna().sum() - before)`.\n4. Verifica `1`.",
        hint: "Convierte y compara isna antes/después.",
        hints: [
          "before = df['monto'].isna().sum().",
          "to_numeric(..., errors='coerce'); print delta de isna.",
        ],
        edgeCases: ["no restar before", "astype sin coerce"],
        tests: "delta de isna tras to_numeric == 1",
        feedback:
          "Sin `to_numeric`, el delta es 0 aunque haya basura en texto. Convierte, luego resta isna anterior del posterior: ese entero es la entrada del `coercion_report`.",
        retrospective:
          "El delta es honestidad de métrica: nulos del parser ≠ fallos de conversión. Pregunta: si `before` ya tuviera un nulo y conviertes un `'x'`, ¿el delta sería 1 o 2? Siguiente (E2): si falta la columna del schema, no inventes defaults.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: no convierte monto; el delta de NaN queda en 0
import pandas as pd
df = pd.DataFrame({"monto": ["1", "x"]})
before = df["monto"].isna().sum()
print(int(df["monto"].isna().sum() - before))
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
        title: "Schema fail-closed si falta columna",
        preamble:
          "- **Contexto:** el schema exige `monto`, pero el extracto solo trae `cliente_id`. Inventar la columna con ceros es una mentira de pipeline.\n- **Meta:** validar columnas del schema y, si falta, fallar de forma explicable.\n- **Éxito:** imprime `missing` (capturando KeyError).\n- **Límites:** no crees `monto` vacío ni imprimas `ok`.",
        instruction:
          "1. Revisa el starter: imprime `ok` sin validar.\n2. Recorre las claves del schema; si la columna no está, `raise KeyError`.\n3. En `except KeyError`, imprime `missing`.\n4. No inventes la columna.",
        hint: "Valida presencia de columnas del schema.",
        hints: [
          "Recorre schema; si col no está en columns, raise KeyError.",
          "try/except KeyError → print('missing').",
        ],
        edgeCases: ["silenciar falta", "crear columna vacía"],
        tests: "KeyError por columna faltante → print 'missing'",
        feedback:
          "No inventes la columna. Valida el schema y propaga KeyError como `missing`. Rellenar ceros «para que corra» miente al dashboard.",
        retrospective:
          "Fail-closed = el contrato habla antes que el dashboard. El error clásico es «rellenar para que pase el test». Luego (E3): tipar ids a dtype `string` de pandas (no object).",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: no valida que 'monto' exista en el DF
import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001"]})
schema = {"monto": "float64"}
print("ok")
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
        title: "Ids como dtype string de pandas",
        preamble:
          "- **Contexto:** el schema de CP-N2-A declara `cliente_id: string`; el default de Series de texto suele ser `object`.\n- **Meta:** castear a dtype `string` de pandas e imprimir `str(dtype)`.\n- **Éxito:** imprime `string`.\n- **Límites:** no dejes `object`; no uses `category` para ids casi únicos.",
        instruction:
          "1. Lee el DEFECT: imprime el dtype por defecto (`object`).\n2. Aplica `astype('string')`.\n3. Imprime `str(s.dtype)`.\n4. Verifica `string`.",
        hint: "Dtype string nullable de pandas, no object.",
        hints: [
          "Castea la serie al dtype string de pandas.",
          "print(str(s.dtype)).",
        ],
        edgeCases: ["object", "category"],
        tests: "str(dtype) == 'string' tras astype('string')",
        feedback:
          "El default de Series de texto es object. Usa `astype('string')` de pandas para el contrato tipado del schema.",
        retrospective:
          "`string` nullable es el contrato tipado; `object` es el default opaco. Pregunta: ¿por qué no castear ids únicos a category «por costumbre»? Puente a T4-A: exportar sin perder el mapa de columnas.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: deja object; debe ser dtype string de pandas
import pandas as pd
s = pd.Series(["C001"])
print(str(s.dtype))
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
        title: "CSV round-trip sin columna Unnamed",
        preamble:
          "- **Contexto:** al reingestar un CSV exportado con index por defecto suele aparecer una columna basura (`Unnamed: 0`).\n- **Meta:** exportar con `index=False`, releer e imprimir columnas.\n- **Éxito:** `['a', 'b']`.\n- **Límites:** no omitas `seek(0)`; no uses index=True «por costumbre».",
        instruction:
          "1. Abre el starter: `to_csv(buf)` sin `index=False`.\n2. Pasa `index=False`.\n3. `seek(0)`, `read_csv`, imprime `columns.tolist()`.\n4. Verifica `['a', 'b']`.",
        hint: "Exporta sin index y reposiciona el buffer.",
        hints: [
          "df.to_csv(buf, index=False); buf.seek(0).",
          "pd.read_csv(buf).columns.tolist().",
        ],
        edgeCases: ["index=True crea col extra", "no seek"],
        tests: "round-trip columns == ['a', 'b'] con index=False",
        feedback:
          "Sin `index=False`, el index se escribe y al releer contamina el schema. Usa `index=False` y `seek(0)` para reposicionar el buffer en memoria.",
        retrospective:
          "Round-trip de columnas es la prueba mínima de export: escribes, reposicionas el buffer, relees y comparas el schema. El error clásico es `index=True` por costumbre y un `Unnamed: 0` que rompe el contrato al reingestar. Pregunta: ¿por qué `seek(0)` es parte del test y no un detalle de IO? Siguiente (E2): Excel en memoria con openpyxl.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: to_csv con index por defecto mete columna Unnamed
import pandas as pd
from io import StringIO
df = pd.DataFrame({"a": [1], "b": [2]})
buf = StringIO()
df.to_csv(buf)
buf.seek(0)
print(pd.read_csv(buf).columns.tolist())
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
        title: "Excel en memoria con openpyxl",
        preamble:
          "- **Contexto:** a veces el entregable del stakeholder es Excel; el test de humo es «hay bytes en el buffer».\n- **Meta:** escribir un DF a `BytesIO` con `to_excel` e `engine='openpyxl'`.\n- **Éxito:** imprime `True` (`len(getvalue()) > 0`).\n- **Límites:** requiere `openpyxl` instalado; no escribas a disco obligatorio.",
        instruction:
          "1. Revisa el starter: imprime sobre buffer vacío.\n2. Llama `to_excel(bio, index=False, engine='openpyxl')` con un DF mínimo.\n3. Imprime `len(bio.getvalue()) > 0`.\n4. Si falta openpyxl, instálalo o documenta el límite (no finjas éxito).",
        hint: "to_excel en BytesIO con motor de terceros.",
        hints: [
          "Escribe un DF mínimo a BytesIO con engine openpyxl.",
          "print(len(bio.getvalue()) > 0).",
        ],
        edgeCases: ["sin engine", "archivo disco obligatorio"],
        tests: "BytesIO con to_excel openpyxl → len(getvalue()) > 0",
        feedback:
          "El starter imprime sobre un buffer vacío. Escribe un DF mínimo con `to_excel(..., index=False, engine='openpyxl')` y vuelve a medir `len(bio.getvalue()) > 0`. Si falta el motor, instálalo (`pip install openpyxl`) o documenta el límite — no hardcodees `True`.",
        retrospective:
          "La honestidad de dependencias es parte de la calidad: un «export Excel» sin `openpyxl` es teatro. Pregunta: ¿qué entregarías si el entorno no tiene el motor (CSV + schema JSON)? Siguiente (E3): contrato de dtypes sin motor Parquet.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: BytesIO vacío; falta to_excel con openpyxl
import pandas as pd
from io import BytesIO
bio = BytesIO()
print(len(bio.getvalue()) > 0)
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
        title: "Contrato de dtypes por columna",
        preamble:
          "- **Contexto:** si el entorno no tiene motor Parquet, un dict columna→dtype es el contrato de tipos que acompaña al CSV.\n- **Meta:** construir `{col: str(dtype)}` e imprimirlo ordenado por clave.\n- **Éxito:** `{'cliente_id': 'object', 'monto': 'float64'}`.\n- **Límites:** no dejes el dict vacío; usa `str(dtype)`, no el objeto dtype crudo sin convertir.",
        instruction:
          "1. Lee el DEFECT: `contract = {}`.\n2. Llena con comprehension sobre `df.columns`.\n3. Imprime `dict(sorted(contract.items()))`.\n4. Verifica el mapa del fixture.",
        hint: "Mapa columna → dtype legible.",
        hints: [
          "Recorre df.columns y convierte cada dtype a str.",
          "print(dict(sorted(contract.items()))).",
        ],
        edgeCases: ["dtypes Series print feo", "sin str()"],
        tests: "dict sorted de str(dtype) por columna",
        feedback:
          "Un `contract = {}` no documenta el schema. Llena `{col: str(df[col].dtype) for col in df.columns}` y ordena al imprimir (`dict(sorted(...))`) para un assert estable entre corridas.",
        retrospective:
          "El contrato de dtypes es la mitad del manifest (la otra es provenance/hash). Pregunta: ¿por qué ordenar al imprimir ayuda al assert? Puente a T4-B: filas, memoria y hash del artefacto.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: contract vacío; debe mapear col → str(dtype)
import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001"], "monto": [1.0]})
contract = {}
print(dict(sorted(contract.items())))
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
        title: "Memoria real con deep True",
        preamble:
          "- **Contexto:** al castear a `category`/`string` en datasets grandes, necesitas medir memoria **real** de object/string.\n- **Meta:** calcular `memory_usage(deep=True).sum()` y decir si es `> 0`.\n- **Éxito:** imprime `True`.\n- **Límites:** no imprimas un booleano fijo; `deep=True` importa para strings.",
        instruction:
          "1. Abre el starter: imprime `False` sin medir.\n2. Calcula `int(df.memory_usage(deep=True).sum()) > 0`.\n3. Imprime ese booleano.\n4. Verifica `True` con el fixture de strings.",
        hint: "Mide memoria profunda del DataFrame.",
        hints: [
          "int(df.memory_usage(deep=True).sum()) > 0.",
          "print el booleano.",
        ],
        edgeCases: ["deep=False en strings", "no sum"],
        tests: "memory_usage(deep=True).sum() > 0 → True",
        feedback:
          "Un booleano hardcodeado no es una medición. `deep=True` cuenta el contenido de object/string; sin él subestimas el costo real de columnas de texto.",
        retrospective:
          "Medir antes/después de castear es el hábito de optimización honesta. El error clásico es imprimir un booleano fijo o usar `deep=False` y subestimar strings. Pregunta: ¿por qué este fixture de regiones necesita `deep=True`? Siguiente (E2): armar el manifest mínimo de filas y columnas.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: no calcula memory_usage(deep=True); imprime un booleano fijo
import pandas as pd
df = pd.DataFrame({"a": ["Lima", "Cusco"]})
# Sin deep=True subestimas strings; aquí ni siquiera se mide
print(False)
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
        title: "Manifest mínimo de filas y columnas",
        preamble:
          "- **Contexto:** el primer chequeo de reconciliación es «¿cuántas filas salieron y con qué columnas?».\n- **Meta:** construir un dict `rows`/`columns` desde el DF e imprimir ambos.\n- **Éxito:** `3 ['a']`.\n- **Límites:** no dejes ceros/listas vacías; `columns` debe ser lista, no Index crudo sin convertir.",
        instruction:
          "1. Revisa el starter: `rows=0`, `columns=[]`.\n2. Asigna `len(df)` y `df.columns.tolist()`.\n3. Imprime `manifest['rows']` y `manifest['columns']`.\n4. Verifica `3 ['a']`.",
        hint: "Filas y columnas desde el DF real.",
        hints: [
          "rows = len(df); columns = df.columns.tolist().",
          "print(manifest['rows'], manifest['columns']).",
        ],
        edgeCases: ["shape confuso", "columns Index no list"],
        tests: "manifest rows==3 y columns==['a']",
        feedback:
          "El starter deja `rows=0` y `columns=[]`: eso no reconcilia nada. Toma hechos del DF real (`len(df)`, `df.columns.tolist()`) y publícalos en el manifest. Un Index de columnas no es lo mismo que una lista serializable.",
        retrospective:
          "Filas y columnas son el esqueleto del manifest; hash y `source` completan la provenance. El error clásico es hardcodear ceros «porque el print pasa» y mentir en la reconciliación de ingesta. Pregunta: si el DF crece a 300 filas, ¿qué debe cambiar en el print? Siguiente (E3): hashear el artefacto exportado.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: rows y columns del manifest están mal (0 y [])
import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3]})
manifest = {"rows": 0, "columns": []}
print(manifest["rows"], manifest["columns"])
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
        title: "Hash del CSV exportado",
        preamble:
          "- **Contexto:** el hash del artefacto detecta si el archivo cambió entre corridas; hashear el `repr` del DataFrame no sirve (el display cambia con opciones).\n- **Meta:** hashear los bytes de `to_csv(index=False)` e imprimir los primeros 8 hex.\n- **Éxito:** `309b0e45`.\n- **Límites:** no hashees `str(df)`; codifica a bytes con `.encode()`.",
        instruction:
          "1. Lee el DEFECT: se hashea `str(df)`, no el artefacto.\n2. Serializa el DF a CSV **sin** index y codifica a bytes.\n3. Calcula SHA-256 de ese blob e imprime los primeros 8 hex.\n4. Verifica `309b0e45` (mismo fixture; no cambies el DF).",
        hint: "Hashea el payload CSV, no el display.",
        hints: [
          "Serializa con to_csv(index=False) y encode a bytes.",
          "SHA-256 del blob; imprime los primeros 8 hex.",
        ],
        edgeCases: ["hash del objeto python", "sin encode"],
        tests: "sha256(to_csv index=False)[:8] == '309b0e45'",
        feedback:
          "`str(df)` no es el artefacto exportado. Serializa con `to_csv(index=False)` y hashea esos bytes (SHA-256). El hash canónico de este fixture es `309b0e45`.",
        retrospective:
          "Provenance = source + filas + hash del **mismo** payload que entregas. Pregunta de cierre: ¿por qué `index=False` también importa para el hash? Puente al You Do: dos tablas, reportes y manifests auditable.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Error a corregir: hashea str(df) en vez del CSV serializado
import pandas as pd, hashlib
df = pd.DataFrame({"a": [1]})
print(hashlib.sha256(str(df).encode()).hexdigest()[:8])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd, hashlib
df = pd.DataFrame({"a": [1]})
blob = df.to_csv(index=False).encode()
print(hashlib.sha256(blob).hexdigest()[:8])`,
          output: `309b0e45`,
        },
      },
    ],
  },
  youDo: {
    title: "Ingesta tipada clientes/transacciones con reconciliación",
    context:
      "Tú lo haces (You Do). Eres analista de data quality en un retailer peruano sintético. Te entregan dos CSV en memoria: **clientes** (región, score) y **transacciones** (monto, fecha). Tu trabajo de portfolio es el tramo de **CP-N2-A** (la etapa A del capstone *Executive Data Quality & EDA* del nivel Competente) que ya practicaste en I Do/We Do. Lees con schema (el contrato columna→tipo esperado), coercionar con reporte (esto es, convertir forzadamente texto a número/fecha y contar los fallos) y reconciliar filas/columnas. Exportas con manifest (registro de filas, columnas, dtypes y hash del artefacto). Sin PII real (datos personales identificables reales). Un score sintético **no** es culpa ni fraude — solo un número de laboratorio. Si falta una columna del schema, falla de forma explicable (lanza un error claro); no rellenes ceros “para que corra”.",
    objectives: [
      "Ingerir CLIENTES y TRANSACCIONES con dtypes/schema explícitos (string, float64, datetime)",
      "Emitir coercion_report {columna: n_fallos} sin rellenar defaults ocultos",
      "Reconciliar filas/columnas (rows, columns, missing_columns) frente al schema",
      "Exportar con index=False y construir manifest (source, rows, columns, sha1 del CSV)",
    ],
    requirements: [
      "Implementa las cuatro funciones del starter: ingest_clientes, ingest_transacciones, reconcile, export_with_manifest",
      "ingest_*: read_csv desde StringIO + aplicar schema; float con to_numeric(errors='coerce'); fecha con to_datetime o parse_dates",
      "coercion_report: cuenta NaN **nuevos** tras to_numeric/to_datetime (delta isna). El fixture usa `SIN_DATO` (no es nulo por defecto del parser) para que score y monto reporten al menos 1 fallo de conversión cada uno",
      "reconcile: {rows: int, columns: list, missing_columns: list} — missing_columns vacío si el schema cuadra",
      "export_with_manifest: serializa to_csv(index=False), hashea esos mismos bytes (SHA-256 preferible), devuelve dict con source/rows/columns/dtypes opcional y sha256 (o content_sha256 / sha1 legacy)",
      "Suite de asserts en _run_tests() que demuestre correctitud de ambos hilos (no solo prints)",
      "main() + if __name__ == '__main__' reproducible: primero _run_tests(), luego imprime report/reconcile/manifest de clientes y transacciones",
      "README corto en español: qué falló, por qué no inventaste defaults, dependencias (openpyxl solo si exportas Excel)",
      "Límite honesto: sin joins profundos ni quality gates avanzados — solo ingesta tipada + provenance",
    ],
    starterCode: `"""ingest_cp_n2a.py — incremento CP-N2-A (S15)
Ingesta tipada de clientes y transacciones sintéticas (Perú).
Implementa las cuatro funciones y haz pasar _run_tests().
Solo pandas + stdlib. Sin PII real.
"""

from __future__ import annotations

import hashlib
import json
from io import StringIO

import pandas as pd

CLIENTES = """cliente_id,region,score
C001,Lima,0.9
C002,Arequipa,0.4
C003,Lima,SIN_DATO
"""

TRANSACCIONES = """tx_id,cliente_id,monto,fecha
T001,C001,10.5,2024-01-15
T002,C002,SIN_DATO,2024-02-01
T003,C001,3.0,2024-02-10
"""

SCHEMA_CLIENTES = {"cliente_id": "string", "region": "string", "score": "float64"}
SCHEMA_TX = {
    "tx_id": "string",
    "cliente_id": "string",
    "monto": "float64",
    "fecha": "datetime64",
}


def ingest_clientes(text: str) -> tuple[pd.DataFrame, dict]:
    """Lee CSV, aplica SCHEMA_CLIENTES, devuelve (df, coercion_report).

    Fail-closed: KeyError si falta columna del schema.
    """
    raise NotImplementedError


def ingest_transacciones(text: str) -> tuple[pd.DataFrame, dict]:
    """Lee CSV de TX (parse_dates o to_datetime en fecha), aplica SCHEMA_TX.

    Devuelve (df, coercion_report) con fallos de monto (y fecha si aplica).
    """
    raise NotImplementedError


def reconcile(df: pd.DataFrame, expected_cols: list[str]) -> dict:
    """Devuelve {rows, columns, missing_columns}."""
    raise NotImplementedError


def export_with_manifest(df: pd.DataFrame, source: str) -> dict:
    """CSV index=False + manifest con rows/columns/sha1/source.

    Hashea el payload de to_csv, no el repr del DataFrame.
    """
    raise NotImplementedError


def _run_tests() -> None:
    """Aceptación orientativa: no hardcodees prints; demuestra el contrato."""
    df, report = ingest_clientes(CLIENTES)
    assert len(df) == 3
    assert report.get("score", 0) >= 1
    rec = reconcile(df, list(SCHEMA_CLIENTES))
    assert rec["rows"] == 3
    assert rec["missing_columns"] == []
    man = export_with_manifest(df, "synthetic_clientes_v1")
    assert man["rows"] == 3
    assert man.get("source") == "synthetic_clientes_v1"
    assert any(k in man for k in ("sha256", "content_sha256", "sha1", "content_sha1"))
    sha = man.get("sha256") or man.get("content_sha256") or man.get("sha1") or man.get("content_sha1")
    assert isinstance(sha, str) and len(sha) >= 8

    # Fail-closed: columna del schema ausente
    try:
        bad_csv = "cliente_id,region" + chr(10) + "C001,Lima" + chr(10)
        ingest_clientes(bad_csv)
        raise AssertionError("debía fallar por score ausente")
    except KeyError:
        pass

    tx, tx_report = ingest_transacciones(TRANSACCIONES)
    assert len(tx) == 3
    assert tx_report.get("monto", 0) >= 1
    assert "datetime" in str(tx["fecha"].dtype)
    tx_rec = reconcile(tx, list(SCHEMA_TX))
    assert tx_rec["rows"] == 3
    assert tx_rec["missing_columns"] == []
    tx_man = export_with_manifest(tx, "synthetic_tx_v1")
    assert tx_man["rows"] == 3
    assert any(k in tx_man for k in ("sha256", "content_sha256", "sha1", "content_sha1"))

    print("tests OK")


def main() -> None:
    _run_tests()
    df, report = ingest_clientes(CLIENTES)
    print(df.head())
    print("coercion_report", report)
    print("reconcile", reconcile(df, list(SCHEMA_CLIENTES)))
    print("manifest", export_with_manifest(df, "synthetic_clientes_v1"))

    tx, tx_report = ingest_transacciones(TRANSACCIONES)
    print("tx_head", tx.head())
    print("tx_coercion_report", tx_report)
    print("tx_reconcile", reconcile(tx, list(SCHEMA_TX)))
    print("tx_manifest", export_with_manifest(tx, "synthetic_tx_v1"))


if __name__ == "__main__":
    main()
`,
    portfolioNote:
      "Entrega: script reproducible que pase `_run_tests()` (la suite de asserts que demuestra correctitud) + (opcional) CSV/Excel con `index=False` (no escribir el index como columna extra) + JSON de `coercion_report` (el reporte `{columna: n_fallos}`) y manifest para **clientes y transacciones**. En el README explica en español profesional qué columnas fallaron, cómo contaste las coerciones y por qué no inventaste defaults. Prepara 30 segundos para defender el delta de coerción (antes/después `isna`) ante un revisor. Si exportas Excel, declara `openpyxl` (la librería que pandas necesita para escribir `.xlsx`). Este artefacto es la base del dataset de CP-N2-A. Un revisor debe poder re-ejecutar `python ingest_cp_n2a.py` y ver `tests OK`, filas, reportes y hash sin adivinar tu entorno.",
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con `_run_tests()` (filas, `report['score'|'monto'] >= 1`, KeyError si falta columna, hash del CSV)? (2) ¿qué harías distinto con datos reales vs. sintéticos (PII, encoding del proveedor, openpyxl)? (3) Escribe en el README una frase de impacto medible (antes: CSV opaco / después: schema + coercion_report + manifest) que puedas defender en 30 segundos. Recuerda: un score sintético no es culpa ni decisión sobre personas.",
    rubric: [
      { criterion: "Schema tipado + reporte de coerciones y reconciliación de filas/columnas (ambos hilos)", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado (pandas; openpyxl solo si usas Excel)", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / score ≠ culpa", weight: "20%" },
      { criterion: "Pruebas (_run_tests) y casos de borde (SIN_DATO, columna faltante, index=False, hash del CSV)", weight: "15%" },
      { criterion: "Código legible y límites claros (sin joins profundos ni quality gate avanzado)", weight: "10%" },
      { criterion: "Documentación en español profesional + manifest con provenance/hash", weight: "10%" },
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "¿Qué método de selección usa etiquetas de index/columnas?",
        options: ["iloc", "iat solo posicional forzado", "loc", "values"],
        correctIndex: 2,
        explanation:
          "Loc selecciona por etiqueta (esto es, por el nombre del Index o de la columna); iloc (e iat) usan posición numérica (0, 1, 2…). Si el Index es `cliente_id`, `loc['C002']` no es lo mismo que `iloc[1]` salvo que el orden lo permita.",
      },
      {
        question: "SettingWithCopyWarning se relaciona con:",
        options: ["Asignación en cadena que no actualiza el DataFrame padre de forma fiable (chained assignment)", "Parquet vs. CSV", "Falta de openpyxl", "MultiIndex obligatorio"],
        correctIndex: 0,
        explanation:
          "Asignar en cadena (`df[mask]['col'] = ...`) no actualiza el DataFrame original de forma fiable (en pandas moderno con Copy-on-Write —esto es, escritura sobre copia automática— la cadena no escribe en el padre). Usa un solo `loc` sobre el padre o `.copy()` explícito del subset.",
      },
      {
        question: "errors='coerce' en to_numeric:",
        options: ["Borra la columna", "Convierte inválidos a NaN", "Eleva siempre excepción", "Cambia a string"],
        correctIndex: 1,
        explanation:
          "`errors='coerce'` convierte valores no parseables a NaN (un nulo numérico) sin tumbar el lote. Debes contar esos NaN en el reporte de coerciones (el dict `{columna: n_fallos}`); no es un permiso para esconder basura.",
      },
      {
        question: "Un manifest de export debería incluir al menos:",
        options: ["Solo el nombre del analista", "Contraseñas de BD", "PII real de clientes", "Filas, columnas y provenance/hash del artefacto"],
        correctIndex: 3,
        explanation:
          "Para reconciliar CP-N2-A necesitas filas, columnas y trazabilidad del archivo (source + hash del payload exportado, esto es, la huella digital del archivo que entrega el pipeline). Nunca PII real (datos personales identificables reales) ni secretos en el manifest.",
      },
      {
        question: "En pandas, ¿por qué preferir df.loc[mask, col] = val sobre un subset sin .copy()?",
        options: ["loc es más lento y por eso es más seguro", "copy() está deprecado", "Evita SettingWithCopyWarning y deja la asignación en el DataFrame original", "iloc no existe en pandas 2"],
        correctIndex: 2,
        explanation:
          "La asignación en cadena no es el contrato profesional. `loc` sobre el DF (o `.copy()` explícito del subset) hace la mutación intencional y predecible, alineada con Copy-on-Write (escritura sobre copia automática).",
      },
      {
        question: "¿Qué hace parse_dates=['fecha'] en read_csv?",
        options: ["Convierte la columna fecha a datetime en la lectura", "Borra filas con fecha inválida", "Obliga a usar Excel en vez de CSV", "Solo formatea el print de la fecha"],
        correctIndex: 0,
        explanation:
          "Parse_dates tipa la columna como `datetime` (un tipo de fecha con el que pandas filtra y ordena temporalmente) en la ingesta; sin eso suele quedar `object`/`string` (texto opaco).",
      },
      {
        question: "Si el schema exige la columna 'monto' y el CSV no la trae, ¿qué es lo correcto en esta sección?",
        options: ["Crear monto=0 en silencio", "Fallar de forma explicable (p. ej. KeyError / missing column)", "Rellenar con la media de otras columnas", "Ignorar el schema y seguir"],
        correctIndex: 1,
        explanation:
          "Fail-closed (fallar de forma segura): si falta una columna del contrato, no inventes defaults ocultos.",
      },
      {
        question: "¿Por qué exportar con to_csv(..., index=False) por defecto?",
        options: ["Porque index=False es más rápido siempre", "Porque pandas prohíbe index=True", "Para forzar Parquet", "Para evitar columnas Unnamed al reingestar si el index no es clave de negocio"],
        correctIndex: 3,
        explanation:
          "El index por defecto se escribe como columna extra y al releer aparece como `Unnamed` (una columna sin nombre que contamina el schema), salvo que sea clave de negocio documentada.",
      },
      {
        question: "¿Para qué sirve astype('category') en una columna de región (Lima/Arequipa)?",
        options: ["Convierte texto a fechas automáticamente", "Borra duplicados de región", "Reduce memoria y fija un conjunto de valores conocidos; conviene normalizar con str.title antes", "Es obligatorio antes de to_csv"],
        correctIndex: 2,
        explanation:
          "`category` es un dtype compacto para labels de cardinalidad baja o acotada (esto es, pocos valores únicos como regiones o estados). Normaliza mayúsculas/minúsculas antes para no duplicar 'lima' y 'Lima'; mide memoria si la cardinalidad (la cantidad de valores únicos) crece.",
      },
      {
        question: "Si el Index de negocio es cliente_id, ¿qué conviene al alinear o reexportar?",
        options: ["Mantener un index estable y documentado; no perder la clave al exportar si es eje de negocio", "Borrar el index y usar solo posiciones 0..n-1 siempre", "Usar solo iloc y nunca loc", "Convertir el index a float64"],
        correctIndex: 0,
        explanation:
          "Un Index estable (ids de cliente, esto es, el eje de etiquetas que identifica filas por negocio) alinea tablas y auditoría. Si es clave de negocio, documéntala al exportar; si no, `index=False` evita basura `Unnamed`.",
      },
      {
        question: "Una consulta necesita solo la columna `monto` de una tabla de 40 columnas. ¿Por qué un archivo columnar puede leer mucho menos que un CSV equivalente?",
        options: ["Porque Parquet siempre comprime más que un CSV", "Porque los valores de cada columna están guardados contiguos, así que el lector toma ese bloque y no toca los otros 39", "Porque Parquet guarda las filas ya ordenadas por la columna que consultes", "Porque el CSV gasta la mayor parte del tiempo convirtiendo texto a número"],
        correctIndex: 1,
        explanation:
          "El ahorro viene del acomodo físico: por columnas, `monto` es un bloque contiguo y el resto ni se lee (projection pushdown). La compresión ayuda, pero no es el mecanismo, y Parquet no ordena por la columna que consultes — el orden lo decides tú al escribir.",
      },
      {
        question: "Decides particionar un dataset por `cliente_id`, que tiene 50 000 valores distintos. ¿Qué es lo más probable que ocurra?",
        options: ["Las consultas filtradas por fecha se vuelven más rápidas", "El pruning por estadísticas deja de funcionar porque los bloques ya no guardan mínimo y máximo", "Cada partición queda más grande, así que se lee menos en total", "Aparecen decenas de miles de archivos diminutos y el costo de abrirlos se come la ganancia de la poda"],
        correctIndex: 3,
        explanation:
          "Particionar por una columna de cardinalidad altísima produce un archivo por valor. El descubrimiento y la apertura de cada uno cuesta más que el escaneo que evitaste. Los bloques siguen guardando sus estadísticas; el problema es el tamaño, no la ausencia de metadatos. La clave de partición se elige por el patrón de consulta y de reproceso, no por costumbre.",
      },
    ],
  },
  resources: {
    docs: [
      {
        label: "pandas read_csv",
        url: "https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html",
        note: "dtype, parse_dates, na_values, decimal",
      },
      {
        label: "pandas indexing",
        url: "https://pandas.pydata.org/docs/user_guide/indexing.html",
        note: "loc/iloc, SettingWithCopy",
      },
      {
        label: "pandas dtypes / nullable",
        url: "https://pandas.pydata.org/docs/user_guide/basics.html#basics-dtypes",
        note: "string, Int64, category",
      },
      {
        label: "pandas to_datetime",
        url: "https://pandas.pydata.org/docs/reference/api/pandas.to_datetime.html",
        note: "errors='coerce'",
      },
      {
        label: "pandas to_numeric",
        url: "https://pandas.pydata.org/docs/reference/api/pandas.to_numeric.html",
        note: "coerción de montos",
      },
      {
        label: "pandas IO tools",
        url: "https://pandas.pydata.org/docs/user_guide/io.html",
        note: "CSV Excel export",
      },
      {
        label: "Apache Parquet",
        url: "https://parquet.apache.org/docs/",
        note: "contrato columnar opcional",
      },
    ],
    books: [
      {
        label: "Python for Data Analysis (Wes McKinney) — pandas",
        note: "Ingesta, tipos y export",
      },
      {
        label: "Effective Pandas (Matt Harrison) — selecciones",
        note: "assign, dtypes, métodos en cadena",
      },
    ],
    courses: [
      {
        label: "pandas getting started",
        url: "https://pandas.pydata.org/docs/getting_started/index.html",
        note: "Oficial",
      },
      {
        label: "Coursera — Python for Everybody",
        url: "https://www.coursera.org/specializations/python",
        note: "Fundamentos de archivos/datos",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Estructuras y archivos",
      },
      {
        label: "PyArcana live",
        url: "https://pillb.github.io/pyarcana/",
        note: "Sección en vivo: Pandas ingesta",
      },
      {
        label: "Real Python — pandas read_csv",
        url: "https://realpython.com/pandas-read-write-files/",
        note: "Lectura y escritura práctica",
      },
      {
        label: "Real Python — SettingWithCopyWarning",
        url: "https://realpython.com/pandas-settingwithcopywarning/",
        note: "loc vs. copy; evita chained assignment",
      },
      {
        label: "Data School — indexing and selecting",
        url: "https://www.dataschool.io/pandas-essentials/",
        note: "Selección idiomática en pandas",
      },
    ],
  },
}
