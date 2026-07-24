import type { CourseSection } from '../../types'

export const section15: CourseSection = {
  id: "stdlib-deep",
  index: 15,
  title: "Pandas: ingesta, selección y tipos",
  shortTitle: "Pandas ingesta",
  tagline: "ingesta tipada de clientes/transacciones con reporte de coerciones y reconciliación de filas/columnas",
  estimatedHours: 18,
  level: "Competente",
  phase: 1,
  icon: "Table2",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "En banca, fintech y retail en Perú, el día a día del analista no es “abrir Excel y confiar”: es **ingerir CSV/Excel de clientes y transacciones** sin inventar datos, declarar dtypes, reportar coerciones, reconciliar filas/columnas y dejar un **manifest** (origen, filas, columnas, hash) que otro equipo pueda auditar. Si el monto llega como `15,50` o el score como `NA`, el pipeline debe contarlo — no rellenarlo en silencio. Aquí construyes esa base de **CP-N2-A** con fixtures sintéticos (Lima/Arequipa/Cusco, ids `C00x`/`T00x`, sin PII real) y con el hábito profesional de **falla explicable** cuando falta una columna del schema.",
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
        "**Diccionario de la sección** (léelo antes de T1; vuelve a él cuando un término te detenga). **Series:** vector con **Index** (etiquetas de negocio, no solo 0..n-1). **DataFrame:** tabla de columnas (Series) alineadas por el mismo Index. **dtype:** tipo de una columna (`string`, `float64`, `datetime64`, `category`…). **Schema:** contrato columna→tipo esperado. **Coerción:** conversión explícita (texto→número, texto→fecha); con `errors='coerce'`, lo inválido pasa a NaN/NaT y **se cuenta** en un reporte. **loc / iloc:** selección por etiqueta vs por posición. **Chained assignment:** asignar en cadena `df[...][...] =` puede no escribir donde crees (**SettingWithCopyWarning**). **Manifest:** registro de filas, columnas, dtypes, memoria y provenance. **Provenance:** de dónde salió el archivo y si cambió entre corridas (origen + hash del artefacto).",
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
        "Un Index **estable** (`cliente_id`) facilita auditoría y, más adelante, unir tablas sin adivinar el orden de las filas. `set_index` / `reset_index` cambian el eje de etiqueta; no pierdas la clave de negocio al exportar. Fail-closed: si el id no es único y el contrato lo exige, reporta duplicados **antes** de un `set_index` ciego. En un retailer peruano sintético, `C001` en Lima y `C002` en Arequipa deben seguir siendo las mismas filas después de filtrar, reindexar o exportar — la etiqueta es la identidad de negocio, no la posición 0 o 1.",
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
        "En datasets latinos declara encoding (`utf-8` o el real del proveedor), separador y **decimal** (`decimal=','` cuando el monto viene como `15,50`). Evita reescribir el archivo a mano con `.replace(',', '.')` salvo un preproceso documentado y acotado: el parámetro `decimal` es el camino idiomático cuando no hay comas de miles que confundan el parseo. `usecols` recorta columnas basura antes de tipar. Excel requiere motor de terceros (`openpyxl`: `pip install openpyxl`). Fail-closed: si falta una columna requerida del schema de ingesta, no continues “con lo que haya”.",
        "Siempre reconcilia **filas leídas vs esperadas** y lista columnas + dtypes **antes** de confiar en un `head()` bonito. Caso sintético de laboratorio: CSV con `NA` en monto → `cliente_id` como `string`, `monto` como `float64`, `fecha` como `datetime64` y un `isna` verdadero en la segunda fila. Si el entorno no tiene `openpyxl`, completa el contrato con CSV + schema JSON y documenta el límite en el README del laboratorio — no finjas un export Excel que no corre.",
      ],
      code: {
        language: 'python',
        title: "read_csv_opts.py",
        code: `def s15_th_2():
    import pandas as pd
    from io import StringIO

    csv = "cliente_id,monto,fecha\nC001,10.5,2024-01-15\nC002,NA,2024-02-01\n"
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
        "**SettingWithCopyWarning** aparece cuando asignas sobre un slice que pandas no garantiza como vista o copia: el resultado es impredecible y **puede no escribir** en el DataFrame padre. Es el bug clásico de pipelines de ingesta en banca y retail: en pantalla el flag “revisar” parece seteado, al exportar el CSV el flag desaparece, y el ticket de calidad regresa. No es un warning cosmético — es una promesa rota de mutación.",
        "Patrón seguro (consenso Real Python / Data School / pandas docs): (1) asigna con **un solo** `.loc[row_mask, col] = valor` sobre el original, o (2) materializa `subset = df.loc[...].copy()` **antes** de mutar el subconjunto. Nunca `df[df.a > 0]['b'] = 1`. Regla mental: **una sola indexación en la asignación**, o **copy explícita** si el subset tiene vida propia (p. ej. se lo pasas a otra función).",
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
        "Los dtypes **string**, **Int64**/**boolean** nullable, **datetime64** y **category** reducen memoria y errores de comparación. El dtype `object` heterogéneo es el default peligroso de un CSV mal tipado: mezcla texto, números y `None` sin avisar; las comparaciones fallan en silencio o explotan tres pasos después en un dashboard. Tipar es **declarar intención**: “esta columna es fecha”, “esta es monto”, “esta es etiqueta de región”.",
        "Convierte con `astype('string')`, `pd.to_numeric(..., errors=...)`, `pd.to_datetime`, `astype('category')`. Con `errors='coerce'`, los inválidos pasan a NaN/NaT — preferible a tumbar todo el lote **si cuentas** los fallos y los reportas. Normaliza texto de región con `str.title()` **antes** de `category` para no duplicar “lima” y “Lima” como dos categorías distintas (el mismo cliente sintético no debería ocupar dos buckets).",
        "Reporta cuántos valores no convirtieron: ese número es **evidencia de calidad**, no un detalle cosmético. Caso sintético: monto `x` y fecha `bad` → un NaN cada uno; región normalizada + `category` para Lima/Arequipa. El conteo de NaN es el embrión del **reporte de coerciones** de T3-B y del manifest de exportación de T4. Sin conteo, `coerce` se convierte en una forma elegante de esconder basura.",
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
        "No “arregles” silenciosamente (no pongas `0` ni la media donde había basura). Emite un reporte `{columna: n_fallos}`. Si falta una columna del schema, **falla explicable** (`KeyError` / mensaje con el nombre), no inventes defaults ocultos. Contar NaN **antes y después** de `to_numeric` aísla las coerciones nuevas de los nulos que ya venían en el CSV: eso es honestidad de métrica.",
        "Este reporte es la entrada natural a los quality gates que verás al endurecer contratos de calidad. Caso sintético: `monto` con `N/A` → `coercion_report={'monto': 1}` y dtypes finales string/float64. En **CP-N2-A**, el reporte viaja **junto** al DataFrame (función que devuelve tupla `(df, report)`), no en un mensaje de chat. El You Do de esta sección te pide exactamente ese contrato para clientes y transacciones.",
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
        "`to_csv` y `to_excel` materializan el dataset analítico. Parquet (pyarrow/fastparquet) preserva tipos de forma nativa; si el motor no está en tu entorno, exporta **CSV + schema JSON** como contrato de tipos — el aprendizaje es el mismo: no pierdas el mapa columna→dtype. El **round-trip** (exportar y releer) es la prueba mínima de que no inventaste columnas ni reordenaste el contrato a ciegas.",
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
        "`index=False` en export evita columnas `Unnamed` al reingestar (salvo Index de negocio documentado). El hash (p. ej. SHA-1 truncado del CSV) detecta si el artefacto cambió entre corridas. Hashea el **payload serializado** (`df.to_csv(index=False).encode()`), no el `repr` del DataFrame: el repr cambia con opciones de display y **no es** el archivo que entregas al siguiente equipo.",
        "Documenta memoria antes/después de castear a `category`/`string` cuando el dataset crece (`memory_usage(deep=True)` para strings `object`; sin `deep=True` subestimas el costo real). Caso sintético listo para portfolio: manifest JSON con `rows`, `columns`, `dtypes`, `memory_bytes`, `source=synthetic_clientes_v1` y un `content_sha1` corto. Ese JSON es evidencia de que tu ingesta es auditable — el cierre natural de la sección antes del You Do de dos tablas.",
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
        "content_sha1": hashlib.sha1(payload).hexdigest()[:12],
    }
    print(json.dumps(manifest, sort_keys=True))

s15_th_8()`,
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
    intro:
      "Recibes tablas sintéticas de un retailer peruano. Observa cómo se modela el Index, se lee el CSV con dtypes, se selecciona con loc/assign, se evita chained assignment, se tipa y se exporta con manifest — ocho demos en el mismo hilo de clientes/transacciones.",
    steps: [
      {
        demoId: "S15-T1-A-DEMO",
        subtopicId: "S15-T1-A",
        environment: "local-python",
        description: "Construir DataFrame de clientes con Index estable y dtypes claros",
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
        why: "Sin Index de negocio estable, alinear clientes y transacciones es adivinar el orden de filas.",
      },
      {
        demoId: "S15-T1-B-DEMO",
        subtopicId: "S15-T1-B",
        environment: "local-python",
        description: "Ingerir CSV sintético con sep, decimal latino, dtype, parse_dates y na_values",
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
        why: "Declarar sep y decimal en el parser evita monedas/fechas como object opaco en CSV latinos.",
      },
      {
        demoId: "S15-T2-A-DEMO",
        subtopicId: "S15-T2-A",
        environment: "local-python",
        description: "Seleccionar filas Lima y asignar columna de riesgo derivada",
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
    out = lima.assign(riesgo=lambda x: (x["score"] < 0.5).map({True: "alto", False: "bajo"}))
    print(out[["cliente_id", "score", "riesgo"]].to_dict(orient="list"))

s15_ido_3()`,
          output: `{'cliente_id': ['C001', 'C003', 'C004'], 'score': [0.9, 0.3, 0.8], 'riesgo': ['bajo', 'alto', 'bajo']}`,
        },
        why: "Un solo loc + assign deja pipelines legibles, testeables y sin SettingWithCopy accidental.",
      },
      {
        demoId: "S15-T2-B-DEMO",
        subtopicId: "S15-T2-B",
        environment: "local-python",
        description: "Evitar chained assignment: flag seguro con loc y subset con copy",
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
        why: "loc sobre el padre + copy en subsets elimina SettingWithCopy y mutaciones fantasmas.",
      },
      {
        demoId: "S15-T3-A-DEMO",
        subtopicId: "S15-T3-A",
        environment: "local-python",
        description: "Coercionar string/category, numeric y fechas con conteo de NaN",
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
        why: "Tipos correctos + conteo de NaN son la base de la ingesta tipada y del reporte de calidad.",
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
        why: "Schema + reporte de fallos es el contrato fail-closed que alimenta quality gates posteriores.",
      },
      {
        demoId: "S15-T4-A-DEMO",
        subtopicId: "S15-T4-A",
        environment: "local-python",
        description: "Exportar a CSV y Excel sin perder columnas críticas; emitir contrato Parquet",
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
        why: "El round-trip de columnas críticas es la prueba mínima de un export reproducible.",
      },
      {
        demoId: "S15-T4-B-DEMO",
        subtopicId: "S15-T4-B",
        environment: "local-python",
        description: "Emitir manifest de filas/columnas, memoria y provenance",
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
        "memory_bytes": int(df.memory_usage(deep=True).sum()),
        "source": "synthetic_tx_v1",
        "sha1_12": hashlib.sha1(blob).hexdigest()[:12],
    }
    print(json.dumps(manifest, sort_keys=True))

s15_ido_8()`,
          output: `{"columns": ["cliente_id", "monto"], "memory_bytes": 335, "rows": 3, "sha1_12": "5f5459a9c1df", "source": "synthetic_tx_v1"}`,
        },
        why: "El manifest reconcilia entrada vs salida y prueba que el artefacto no cambió entre corridas.",
      },
    ],
  },
  weDo: {
    intro:
      "Ahora te toca a ti: **24 ejercicios** en escalera (guiado → independiente → transferencia) sobre el mismo hilo de clientes/transacciones sintéticas. Cada starter trae un **error a corregir** (código roto a propósito) y dos pistas. Lee la instrucción, repara el defecto, verifica la salida esperada. Quédate en Series/DataFrame — sin joins profundos ni validaciones de calidad avanzadas; eso llega después. El objetivo no es copiar la solución: es interiorizar el contrato (parser, loc, coerce, export) que reutilizarás en el You Do.",
    steps: [
      {
        id: "S15-T1-A-E1",
        subtopicId: "S15-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — **Index de negocio.** Con el DataFrame del starter (ids `C001`/`C002`), pon `cliente_id` como index e imprime `index.tolist()`. Salida esperada: `['C001', 'C002']`. No borres los datos del starter. Quédate en Series/DataFrame (sin joins ni validaciones de calidad avanzadas).",
        hint: "set_index('cliente_id').",
        hints: [
          "set_index('cliente_id').",
          "index.tolist().",
        ],
        edgeCases: ["reset_index accidental", "index name None sin set"],
        tests: "print(df.index.tolist()) == ['C001', 'C002'] tras set_index",
        feedback:
          "Si ves nombres de columnas en vez del index, falta set_index('cliente_id') antes de imprimir.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · set_index
# Error a corregir: falta set_index; hoy imprime columns en vez del index
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
        instruction:
          "E2 (independiente) — **Series por etiqueta.** Con la Series del starter (index `C001`/`C002`, name `score`), imprime el valor de `s['C002']` como float. No uses acceso posicional. Salida esperada: `0.9`. Conserva el fixture del starter.",
        hint: "pd.Series(..., index=..., name=...).",
        hints: [
          "Acceso por etiqueta: s['C002'] o s.loc['C002'].",
          "float(...) para un print limpio.",
        ],
        edgeCases: ["iloc vs label", "name incorrecto"],
        tests: "print(float(s['C002'])) == 0.9",
        feedback:
          "iloc[0] lee la primera posición (0.1), no la etiqueta C002. Usa s['C002'].",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · Series label access
# Error a corregir: usa iloc posicional en vez de la etiqueta C002
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
        instruction:
          "E3 (transferencia) — **Alineación de Index (sin joins de tablas).** Dos Series con índices parciales se suman alineando etiquetas: usa `.add(..., fill_value=0)` y `sort_index()`, luego imprime el dict redondeado. No es un join de DataFrames (eso vendrá después): es la misma idea de Index de T1-A. Salida esperada: `{'C001': 1.0, 'C002': 2.5}`.",
        hint: "s1.add(s2, fill_value=0).",
        hints: [
          "s1.add(s2, fill_value=0) evita NaN donde s2 no tiene C001.",
          "sort_index() antes de to_dict().",
        ],
        edgeCases: ["NaN sin fill_value", "no ordenar"],
        tests: "out.round(2).to_dict() == {'C001': 1.0, 'C002': 2.5}",
        feedback:
          "El operador + alinea por index y deja NaN donde falta valor. add(..., fill_value=0) rellena el hueco.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · align add fill_value
# Error a corregir: s1 + s2 deja NaN en C001 (falta fill_value=0)
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
        instruction:
          "E1 (guiado) — **na_values al leer CSV.** Lee el CSV del starter con `StringIO` y declara `na_values=['NA']`. Imprime cuántos NA hay en la columna `b`. Salida esperada: `1`. Sin eso, `NA` queda como string y `isna` devuelve 0.",
        hint: "pd.read_csv(StringIO(...), na_values=...).",
        hints: [
          "pd.read_csv(StringIO(...), na_values=['NA']).",
          "int(df['b'].isna().sum()).",
        ],
        edgeCases: ["na_values no aplicado", "contar filas"],
        tests: "isna().sum() de b == 1 tras na_values=['NA']",
        feedback:
          "Sin na_values, el texto 'NA' no es nulo. Pásalo en na_values y vuelve a contar isna.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · read_csv na_values
# Error a corregir: sin na_values, 'NA' se lee como string y isna da 0
import pandas as pd
from io import StringIO
df = pd.read_csv(StringIO("a,b\n1,2\n3,NA\n"))
print(int(df["b"].isna().sum()))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import StringIO
df = pd.read_csv(StringIO("a,b\n1,2\n3,NA\n"), na_values=["NA"])
print(int(df["b"].isna().sum()))`,
          output: `1`,
        },
      },
      {
        id: "S15-T1-B-E2",
        subtopicId: "S15-T1-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — **parse_dates.** Lee el CSV del starter con `parse_dates=['fecha']` e imprime `str(df['fecha'].dtype)`. Salida esperada: `datetime64[ns]`. Si omites parse_dates, verás un dtype object/string.",
        hint: "parse_dates=['fecha'].",
        hints: [
          "parse_dates=['fecha'] en read_csv.",
          "str(df['fecha'].dtype).",
        ],
        edgeCases: ["dtype object", "formato de fecha inválido"],
        tests: "str(df['fecha'].dtype) == 'datetime64[ns]'",
        feedback:
          "Sin parse_dates la columna queda como texto. Declara parse_dates en read_csv.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · parse_dates
# Error a corregir: sin parse_dates la fecha queda como object/string
import pandas as pd
from io import StringIO
df = pd.read_csv(StringIO("fecha,x\n2024-01-01,1\n"))
print(str(df["fecha"].dtype))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import StringIO
df = pd.read_csv(StringIO("fecha,x\n2024-01-01,1\n"), parse_dates=["fecha"])
print(str(df["fecha"].dtype))`,
          output: `datetime64[ns]`,
        },
      },
      {
        id: "S15-T1-B-E3",
        subtopicId: "S15-T1-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — **CSV latino + usecols.** El fixture usa `;` y decimal coma (`15,50`), más una columna basura `z`. Léelo con `sep=';'`, `decimal=','` y `usecols` solo de `cliente_id` y `monto`. Imprime `monto.tolist()`. Salida esperada: `[15.5]`. No reescribas el texto con `.replace(',', '.')`: declara el contrato en el parser.",
        hint: "sep=';', decimal=',', usecols=[...].",
        hints: [
          "pd.read_csv(..., sep=';', decimal=',', usecols=['cliente_id', 'monto']).",
          "print(df['monto'].tolist()) — el float debe ser 15.5, no texto.",
        ],
        edgeCases: ["sin decimal → texto o mal parseo", "sin usecols entra z", "replace manual frágil"],
        tests: "sep=';' + decimal=',' + usecols → monto.tolist() == [15.5]",
        feedback:
          "Si omites decimal=',', el monto no llega como 15.5. Declara sep, decimal y usecols en read_csv; no uses replace sobre el CSV crudo.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · CSV latino + usecols
# Error a corregir: sin decimal=',' el monto queda como texto '15,50'; falta usecols
import pandas as pd
from io import StringIO
raw = "cliente_id;monto;z\nC001;15,50;9\n"
df = pd.read_csv(StringIO(raw), sep=";")
print(df["monto"].tolist())
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
from io import StringIO
raw = "cliente_id;monto;z\nC001;15,50;9\n"
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
        instruction:
          "E1 (guiado) — **Filtro con loc.** Con el DF del starter (`C001` score 0.4, `C002` score **0.5**), selecciona filas con `score >= 0.5` e imprime la lista de `cliente_id`. Salida esperada: `['C002']`. Cuidado: `>` estricto deja fuera el umbral exacto y devolvería lista vacía.",
        hint: "df.loc[df.score>=0.5, 'cliente_id'].",
        hints: [
          "df.loc[df['score'] >= 0.5, 'cliente_id'].",
          "tolist().",
        ],
        edgeCases: ["iloc posicional incorrecto", "filtro invertido", "score exacto 0.5 excluido por >"],
        tests: "loc score>=0.5 → cliente_id list == ['C002'] (fixture con borde 0.5)",
        feedback:
          "Con score 0.5 en el borde, `>` excluye a C002 y sale []. Usa >= si el umbral es inclusivo.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · boolean loc
# Error a corregir: usa score > 0.5 (estricto); C002 tiene score 0.5 y queda fuera
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
        instruction:
          "E2 (independiente) — **assign.** Crea la columna `doble = score * 2` con `assign` (sin mutar el DF original como paso obligatorio) e imprime la lista de `doble`. Salida esperada: `[2.0, 4.0]`.",
        hint: "df.assign(doble=...).",
        hints: [
          "df.assign(doble=lambda x: x['score'] * 2).",
          "Selecciona la columna doble y tolist().",
        ],
        edgeCases: ["chained assign", "olvidar columna"],
        tests: "assign(doble=score*2)['doble'].tolist() == [2.0, 4.0]",
        feedback:
          "No mutes con *1 in-place. Usa assign(doble=lambda x: x['score'] * 2) y selecciona la columna 'doble'.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · assign
# Error a corregir: multiplica mal (*1) y muta in-place; usa assign(doble=score*2)
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
        instruction:
          "E3 (transferencia) — **iloc posicional.** Dado un DF 2×2 `[[1,2],[3,4]]`, imprime el valor en posición fila 1, columna 0 con `iloc`. Salida esperada: `3`. No uses `loc` (etiquetas).",
        hint: "iloc posición 1,0 → 3.",
        hints: [
          "df.iloc[1, 0].",
          "int(...) para un print limpio.",
        ],
        edgeCases: ["confusión loc/iloc", "1-based"],
        tests: "int(df.iloc[1, 0]) == 3",
        feedback:
          "loc usa etiquetas (aquí 0,0 es 1). iloc usa posiciones: fila 1, col 0 es 3.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · iloc
# Error a corregir: usa loc (etiqueta) en vez de iloc[1, 0]
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
        instruction:
          "E1 (guiado) — **Asignar con loc.** Donde `score < 0.5`, asigna `flag = 'x'` con un solo `loc` sobre el DF original. Imprime la lista de `flag` usando `fillna('')` para los NaN. Salida esperada: `['x', '']`.",
        hint: "df.loc[mask, 'flag'] = 'x'.",
        hints: [
          "df.loc[df['score'] < 0.5, 'flag'] = 'x'.",
          "print(df['flag'].fillna('').tolist()).",
        ],
        edgeCases: ["chained df[df...]['flag']", "sin fillna en print"],
        tests: "flag.fillna('').tolist() == ['x', '']",
        feedback:
          "Asigna con loc sobre el original y normaliza NaN con fillna('') al imprimir.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · loc set flag
# Error a corregir: no asigna la columna flag con loc
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
        instruction:
          "E2 (independiente) — **copy antes de mutar.** Filtra `score > 0.5`, haz `.copy()` del subset, añade `ok=True` e imprime la lista de `ok`. Salida esperada: `[True, True]`. Sin copy corres riesgo de SettingWithCopy.",
        hint: "subset = df.loc[...].copy().",
        hints: [
          "sub = df.loc[df['score'] > 0.5].copy().",
          "sub['ok'] = True; print(sub['ok'].tolist()).",
        ],
        edgeCases: ["sin copy", "filtro wrong"],
        tests: "subset copiado con ok=True → [True, True]",
        feedback:
          "Encadena .copy() tras el loc del filtro; luego muta el subset con seguridad.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · copy before mutate
# Error a corregir: muta un slice sin .copy() (riesgo SettingWithCopy)
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
        instruction:
          "E3 (transferencia) — **Aislamiento de copy.** Demuestra que mutar una **copia** no cambia el original: crea `c = df.copy()`, muta `c`, e imprime los scores del **original**. Salida esperada: `[1.0, 2.0]`.",
        hint: "c = df.copy(); c.iloc[0,0]=99.",
        hints: [
          "c = df.copy() (no c = df).",
          "print(df['score'].tolist()) del original.",
        ],
        edgeCases: ["view accidental", "mutar df no c"],
        tests: "tras mutar la copy, df['score'] sigue [1.0, 2.0]",
        feedback:
          "c = df comparte el mismo objeto. Usa df.copy() para aislar la mutación.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · copy isolation
# Error a corregir: c = df comparte identidad; muta el original
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
        instruction:
          "E1 (guiado) — **category + title.** Normaliza `region` con `str.title()` y castea a `category`. Imprime el nombre del dtype. Salida esperada: `category`.",
        hint: "astype('category').",
        hints: [
          "str.title() primero para unificar lima/Lima.",
          "astype('category'); print(s.dtype.name).",
        ],
        edgeCases: ["object residual", "sin title"],
        tests: "dtype.name == 'category' tras title + astype",
        feedback:
          "Encadena .str.title().astype('category') sobre la Series de región.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · category dtype
# Error a corregir: no aplica title ni category; imprime object
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
        instruction:
          "E2 (independiente) — **to_numeric coerce.** Convierte `['1','a','3']` con `pd.to_numeric(..., errors='coerce')` e imprime la lista (floats/NaN). Salida esperada: `[1.0, nan, 3.0]`.",
        hint: "pd.to_numeric(..., errors='coerce').",
        hints: [
          "errors='coerce' convierte 'a' en NaN.",
          "print(s.tolist()).",
        ],
        edgeCases: ["errors raise", "astype int falla"],
        tests: "to_numeric coerce → [1.0, nan, 3.0]",
        feedback:
          "Sin coerce, el valor 'a' lanza error o se descarta. Usa errors='coerce'.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · to_numeric coerce
# Error a corregir: sin errors='coerce' falla o no produce NaN
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
        instruction:
          "E3 (transferencia) — **to_datetime coerce.** Parsea `['2024-01-01','no-fecha']` con `errors='coerce'` e imprime cuántos NaT hay. Salida esperada: `1`.",
        hint: "isna().sum().",
        hints: [
          "pd.to_datetime(..., errors='coerce').",
          "int(s.isna().sum()) — NaT cuenta como na.",
        ],
        edgeCases: ["errors raise", "contar len"],
        tests: "isna().sum() == 1 tras to_datetime coerce",
        feedback:
          "errors='ignore' no convierte a NaT de forma fiable. Usa coerce y cuenta isna.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · to_datetime coerce
# Error a corregir: errors='ignore' no deja un NaT contable de forma fiable
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
        instruction:
          "E1 (guiado) — **Conteo de coerciones.** Aplica `to_numeric` con coerce a `monto` y reporta cuántos **nuevos** NaN se introdujeron (resta isna después − antes). Salida esperada: `1`.",
        hint: "Compara isna antes/después.",
        hints: [
          "before = df['monto'].isna().sum().",
          "to_numeric(..., errors='coerce'); print delta de isna.",
        ],
        edgeCases: ["no restar before", "astype sin coerce"],
        tests: "delta de isna tras to_numeric == 1",
        feedback:
          "Debes convertir con to_numeric y restar isna anterior del posterior.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · coerce count delta
# Error a corregir: no convierte monto; el delta de NaN queda en 0
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
        instruction:
          "E2 (independiente) — **Schema fail-closed.** El schema exige `monto`, pero el DF solo tiene `cliente_id`. Si falta la columna, lanza `KeyError` y en el except imprime `missing`. Salida esperada: `missing`.",
        hint: "if col not in df.columns.",
        hints: [
          "Recorre schema; si col no está en columns, raise KeyError.",
          "try/except KeyError → print('missing').",
        ],
        edgeCases: ["silenciar falta", "crear columna vacía"],
        tests: "KeyError por columna faltante → print 'missing'",
        feedback:
          "No inventes la columna. Valida el schema y propaga KeyError como 'missing'.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · schema KeyError
# Error a corregir: no valida que 'monto' exista en el DF
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
        instruction:
          "E3 (transferencia) — **dtype string de pandas.** Castea la Series de ids a dtype `string` (no `object`) e imprime `str(dtype)`. Salida esperada: `string`. El default de texto en Series suele ser object; aquí el contrato es el string nullable de pandas.",
        hint: "astype('string').",
        hints: [
          "s.astype('string').",
          "print(str(s.dtype)).",
        ],
        edgeCases: ["object", "category"],
        tests: "str(dtype) == 'string' tras astype('string')",
        feedback:
          "El default de Series de texto es object. Usa astype('string') de pandas.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · string dtype
# Error a corregir: deja object; debe ser dtype string de pandas
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
        instruction:
          "E1 (guiado) — **CSV round-trip sin index.** Exporta el DF a CSV en `StringIO` con `index=False`, relee e imprime `columns.tolist()`. Salida esperada: `['a', 'b']`. Con index=True suele aparecer una columna basura.",
        hint: "to_csv(buf, index=False).",
        hints: [
          "df.to_csv(buf, index=False); buf.seek(0).",
          "pd.read_csv(buf).columns.tolist().",
        ],
        edgeCases: ["index=True crea col extra", "no seek"],
        tests: "round-trip columns == ['a', 'b'] con index=False",
        feedback:
          "to_csv sin index=False escribe el index y al releer aparece Unnamed. Usa index=False y seek(0).",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · to_csv roundtrip
# Error a corregir: to_csv con index por defecto mete columna Unnamed
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
        instruction:
          "E2 (independiente) — **Excel en memoria.** Escribe un DF a `BytesIO` con `to_excel(..., engine='openpyxl')` e imprime `True` si `len(getvalue()) > 0`. Salida esperada: `True`. Requiere `openpyxl` instalado.",
        hint: "engine='openpyxl'.",
        hints: [
          "pd.DataFrame(...).to_excel(bio, index=False, engine='openpyxl').",
          "print(len(bio.getvalue()) > 0).",
        ],
        edgeCases: ["sin engine", "archivo disco obligatorio"],
        tests: "BytesIO con to_excel openpyxl → len(getvalue()) > 0",
        feedback:
          "Un BytesIO vacío no es un export. Llama to_excel con engine='openpyxl' (pip install openpyxl si falta).",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · to_excel bytes
# Error a corregir: BytesIO vacío; falta to_excel con openpyxl
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
        instruction:
          "E3 (transferencia) — **Contrato de dtypes.** Emite un dict `{col: str(dtype)}` para el DF del starter e imprímelo ordenado por clave. Salida esperada: `{'cliente_id': 'object', 'monto': 'float64'}`. Quédate en dtypes del DataFrame (sin joins ni validaciones de calidad avanzadas).",
        hint: "dict comprehension.",
        hints: [
          "contract = {c: str(df[c].dtype) for c in df.columns}.",
          "print(dict(sorted(contract.items()))).",
        ],
        edgeCases: ["dtypes Series print feo", "sin str()"],
        tests: "dict sorted de str(dtype) por columna",
        feedback:
          "No dejes el contract vacío. Construye {col: str(dtype)} y ordénalo al imprimir.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · dtype contract
# Error a corregir: contract vacío; debe mapear col → str(dtype)
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
        instruction:
          "E1 (guiado) — **memory_usage deep.** Calcula `memory_usage(deep=True).sum()` de un DF con strings e imprime si el entero es `> 0`. Salida esperada: `True`. Sin `deep=True` subestimas memoria de object/string.",
        hint: "memory_usage(deep=True).sum().",
        hints: [
          "int(df.memory_usage(deep=True).sum()) > 0.",
          "print el booleano.",
        ],
        edgeCases: ["deep=False en strings", "no sum"],
        tests: "memory_usage(deep=True).sum() > 0 → True",
        feedback:
          "No imprimas un booleano fijo. Calcula int(df.memory_usage(deep=True).sum()) > 0 — deep=True importa para strings.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · memory_usage
# Error a corregir: no calcula memory_usage(deep=True); imprime un booleano fijo
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
        instruction:
          "E2 (independiente) — **Manifest mínimo.** Construye un dict con keys `rows` y `columns` a partir del DF del starter e imprime ambos. Salida esperada: `3 ['a']`.",
        hint: "len(df) y columns.tolist().",
        hints: [
          "manifest = {'rows': len(df), 'columns': df.columns.tolist()}.",
          "print(manifest['rows'], manifest['columns']).",
        ],
        edgeCases: ["shape confuso", "columns Index no list"],
        tests: "manifest rows==3 y columns==['a']",
        feedback:
          "rows = len(df); columns = df.columns.tolist(). No dejes ceros/listas vacías.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · manifest
# Error a corregir: rows y columns del manifest están mal (0 y [])
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
        instruction:
          "E3 (transferencia) — **Hash del artefacto.** Calcula SHA-1 de `df.to_csv(index=False).encode()` e imprime los primeros 8 hex. Salida esperada: `462f48ef`. Hashea el CSV, no el `repr` del DataFrame.",
        hint: "hashlib.sha1(blob).hexdigest()[:8].",
        hints: [
          "blob = df.to_csv(index=False).encode().",
          "hashlib.sha1(blob).hexdigest()[:8].",
        ],
        edgeCases: ["hash del objeto python", "sin encode"],
        tests: "sha1(to_csv index=False)[:8] == '462f48ef'",
        feedback:
          "str(df) no es el artefacto exportado. Serializa con to_csv(index=False) y hashea esos bytes.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# CASO-LIM-015 · sha1 of csv
# Error a corregir: hashea str(df) en vez del CSV serializado
import pandas as pd, hashlib
df = pd.DataFrame({"a": [1]})
print(hashlib.sha1(str(df).encode()).hexdigest()[:8])
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
      "Un retailer peruano sintético te entrega dos CSV en memoria: **clientes** (región, score) y **transacciones** (monto, fecha). Tu trabajo de portfolio es el tramo de **CP-N2-A** que ya practicaste en I Do/We Do: leer con schema, coercionar con reporte, reconciliar filas/columnas y exportar con manifest. Sin PII real. Un score sintético **no** es culpa ni fraude — solo un número de laboratorio. Si falta una columna del schema, falla de forma explicable; no rellenes ceros “para que corra”.",
    objectives: [
      "Ingerir CLIENTES y TRANSACCIONES con dtypes/schema explícitos (string, float64, datetime)",
      "Emitir coercion_report {columna: n_fallos} sin rellenar defaults ocultos",
      "Reconciliar filas/columnas (rows, columns, missing_columns) frente al schema",
      "Exportar con index=False y construir manifest (source, rows, columns, sha1 del CSV)",
    ],
    requirements: [
      "Implementa las cuatro funciones del starter: ingest_clientes, ingest_transacciones, reconcile, export_with_manifest",
      "ingest_*: read_csv desde StringIO + aplicar schema; float con to_numeric(errors='coerce'); fecha con to_datetime o parse_dates",
      "coercion_report: cuenta NaN nuevos tras coerce (al menos score en clientes y monto en transacciones deben reportar fallos del fixture)",
      "reconcile: {rows: int, columns: list, missing_columns: list} — missing_columns vacío si el schema cuadra",
      "export_with_manifest: serializa to_csv(index=False), hashea esos bytes, devuelve dict con source/rows/columns/sha1",
      "if __name__ == '__main__' ejecuta **ambos** hilos (clientes y transacciones) y imprime report/reconcile/manifest",
      "README corto en español: qué falló, por qué no inventaste defaults, dependencias (openpyxl solo si exportas Excel)",
      "Límite honesto: sin joins profundos ni quality gates avanzados — solo ingesta tipada + provenance",
    ],
    starterCode: `import pandas as pd
from io import StringIO
import hashlib
import json

CLIENTES = """cliente_id,region,score
C001,Lima,0.9
C002,Arequipa,0.4
C003,Lima,NA
"""

TRANSACCIONES = """tx_id,cliente_id,monto,fecha
T001,C001,10.5,2024-01-15
T002,C002,N/A,2024-02-01
T003,C001,3.0,2024-02-10
"""

SCHEMA_CLIENTES = {"cliente_id": "string", "region": "string", "score": "float64"}
SCHEMA_TX = {
    "tx_id": "string",
    "cliente_id": "string",
    "monto": "float64",
    "fecha": "datetime64",
}

# Aceptación esperada (orientativa, no hardcodees el print):
# - CLIENTES: 3 filas; score tiene ≥1 coerción (NA → NaN); missing_columns == []
# - TRANSACCIONES: 3 filas; monto tiene ≥1 coerción (N/A); fecha en datetime
# - manifest: keys source, rows, columns, sha1 (o content_sha1); sha1 del to_csv(index=False)


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


if __name__ == "__main__":
    # Hilo clientes (obligatorio): schema → coerciones → reconcile → export/manifest
    df, report = ingest_clientes(CLIENTES)
    print(df.head())
    print("coercion_report", report)
    print("reconcile", reconcile(df, list(SCHEMA_CLIENTES)))
    print("manifest", export_with_manifest(df, "synthetic_clientes_v1"))

    # Hilo transacciones (portfolio CP-N2-A): mismo contrato + fechas
    tx, tx_report = ingest_transacciones(TRANSACCIONES)
    print("tx_head", tx.head())
    print("tx_coercion_report", tx_report)
    print("tx_reconcile", reconcile(tx, list(SCHEMA_TX)))
    print("tx_manifest", export_with_manifest(tx, "synthetic_tx_v1"))
`,
    portfolioNote:
      "Entrega: script reproducible + (opcional) CSV/Excel con index=False + JSON de coercion_report y manifest para **clientes y transacciones**. En el README explica en español profesional qué columnas fallaron, cómo contaste las coerciones y por qué no inventaste defaults. Si exportas Excel, declara `openpyxl`. Este artefacto es la base del dataset de CP-N2-A: un revisor debe poder re-ejecutar `__main__` y ver filas, reportes y hash sin adivinar tu entorno.",
    rubric: [
      { criterion: "Schema tipado + reporte de coerciones y reconciliación de filas/columnas (ambos hilos)", weight: "25%" },
      { criterion: "Correctitud técnica en entorno declarado (pandas; openpyxl solo si usas Excel)", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos / score ≠ culpa", weight: "20%" },
      { criterion: "Casos de borde documentados (NA, N/A, columna faltante, index=False, hash del CSV)", weight: "15%" },
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
          "loc selecciona por etiqueta de Index/columnas; iloc (e iat) usan posición numérica. Si el Index es cliente_id, loc['C002'] no es lo mismo que iloc[1] salvo que el orden lo permita.",
      },
      {
        question: "SettingWithCopyWarning se relaciona con:",
        options: ["Asignación sobre slices que pueden ser view/copy (chained assignment)", "Parquet vs CSV", "Falta de openpyxl", "MultiIndex obligatorio"],
        correctIndex: 0,
        explanation:
          "Asignar en cadena (df[mask]['col'] = ...) puede no escribir en el DataFrame original. Usa un solo loc sobre el padre o .copy() explícito del subset.",
      },
      {
        question: "errors='coerce' en to_numeric:",
        options: ["Borra la columna", "Convierte inválidos a NaN", "Eleva siempre excepción", "Cambia a string"],
        correctIndex: 1,
        explanation:
          "coerce convierte valores no parseables a NaN sin tumbar el lote. Debes contar esos NaN en el reporte de coerciones; no es un permiso para esconder basura.",
      },
      {
        question: "Un manifest de export debería incluir al menos:",
        options: ["Solo el nombre del analista", "Contraseñas de BD", "PII real de clientes", "Filas, columnas y provenance/hash del artefacto"],
        correctIndex: 3,
        explanation:
          "Para reconciliar CP-N2-A necesitas filas, columnas y trazabilidad del archivo (source + hash del payload exportado). Nunca PII real ni secretos en el manifest.",
      },
      {
        question: "En pandas, ¿por qué preferir df.loc[mask, col] = val sobre un subset sin .copy()?",
        options: ["loc es más lento y por eso es más seguro", "copy() está deprecado", "Evita SettingWithCopyWarning y deja la asignación en el DataFrame original", "iloc no existe en pandas 2"],
        correctIndex: 2,
        explanation:
          "Las vistas encadenadas pueden no escribir en el original. loc sobre el DF (o .copy() explícito del subset) hace la mutación intencional y predecible.",
      },
      {
        question: "¿Qué hace parse_dates=['fecha'] en read_csv?",
        options: ["Convierte la columna fecha a datetime en la lectura", "Borra filas con fecha inválida", "Obliga a usar Excel en vez de CSV", "Solo formatea el print de la fecha"],
        correctIndex: 0,
        explanation:
          "parse_dates tipa la columna como datetime en la ingesta; sin eso suele quedar object/string.",
      },
      {
        question: "Si el schema exige la columna 'monto' y el CSV no la trae, ¿qué es lo correcto en esta sección?",
        options: ["Crear monto=0 en silencio", "Fallar de forma explicable (p. ej. KeyError / missing column)", "Rellenar con la media de otras columnas", "Ignorar el schema y seguir"],
        correctIndex: 1,
        explanation:
          "Fail-closed: si falta una columna del contrato, no inventes defaults ocultos.",
      },
      {
        question: "¿Por qué exportar con to_csv(..., index=False) por defecto?",
        options: ["Porque index=False es más rápido siempre", "Porque pandas prohíbe index=True", "Para forzar Parquet", "Para evitar columnas Unnamed al reingestar si el index no es clave de negocio"],
        correctIndex: 3,
        explanation:
          "El index por defecto se escribe como columna extra y al releer aparece como Unnamed, salvo que sea clave de negocio documentada.",
      },
      {
        question: "¿Para qué sirve astype('category') en una columna de región (Lima/Arequipa)?",
        options: ["Convierte texto a fechas automáticamente", "Borra duplicados de región", "Reduce memoria y fija un conjunto de valores conocidos; conviene normalizar con str.title antes", "Es obligatorio antes de to_csv"],
        correctIndex: 2,
        explanation:
          "category es un dtype compacto para labels repetidos. Normaliza mayúsculas/minúsculas antes para no duplicar 'lima' y 'Lima'.",
      },
      {
        question: "Si el Index de negocio es cliente_id, ¿qué conviene al alinear o reexportar?",
        options: ["Mantener un index estable y documentado; no perder la clave al exportar si es eje de negocio", "Borrar el index y usar solo posiciones 0..n-1 siempre", "Usar solo iloc y nunca loc", "Convertir el index a float64"],
        correctIndex: 0,
        explanation:
          "Un Index estable (ids de cliente) alinea tablas y auditoría. Si es clave de negocio, documéntala al exportar; si no, index=False evita basura Unnamed.",
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
        note: "errors coerce",
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
        note: "loc vs copy; evita chained assignment",
      },
      {
        label: "Data School — indexing and selecting",
        url: "https://www.dataschool.io/pandas-essentials/",
        note: "Selección idiomática en pandas",
      },
    ],
  },
}
