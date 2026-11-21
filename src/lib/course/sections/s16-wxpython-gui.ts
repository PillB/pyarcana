/**
 * S16 — Calidad, limpieza y contratos de datos
 *
 * The filename and the exported id ("wxpython-gui") both come from a pre-V3 ordering
 * and no longer describe what this section teaches. The id is the URL hash and
 * a learner save key, so it cannot be changed without losing progress.
 *
 * Read `title` below, never the slug. Matching content to the slug is how three
 * agent diagrams ended up attached to a data-testing lesson.
 */
import type { CourseSection } from '../../types'

export const section16: CourseSection = {
  id: "wxpython-gui",
  index: 16,
  title: "Calidad, limpieza y contratos de datos",
  shortTitle: "Calidad y contratos",
  tagline: "Suite de calidad que falla de forma explicable ante schema drift, cuantifica pérdida y nunca arregla silenciosamente un dato",
  estimatedHours: 9,
  level: "Práctica independiente",
  phase: 1,
  icon: "ShieldCheck",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "Los equipos de datos en banca, fintech y retail en Perú necesitan quality gates (puertas de control de calidad) explicables. Estas puertas aplican políticas de nulos por campo, conservan la columna raw (valor original), contrastan outliers (valores lejos del resto de su columna) con el dominio y dejan evidencia en cuarentena. Aquí aprendes a construir un gate fail-closed (que falla de forma segura: si el contrato se rompe, el job no aprueba en silencio). Trabajas sin PII real y sin arreglos silenciosos, dejando un conjunto limpio y métricas listas para el siguiente paso.",
  learningOutcomes: [
    { text: "Definir políticas de null required/optional y listar violaciones con conteo verificable (`isna` + mapa de campos)" },
    { text: "Limitar imputación con cap, indicadores de ausencia (`was_null`) y bloqueo si el rate supera el umbral" },
    { text: "Distinguir duplicados exactos de conflictos de atributo y clasificar antes de borrar" },
    { text: "Resolver claves con cardinalidad 1:1 documentada y conservar evidencia completa en cuarentena" },
    { text: "Normalizar strings, montos con locale PEN documentado, fechas multi-formato y categorías con mapa, sin borrar el raw" },
    { text: "Clasificar outliers (valores lejos del resto) como error de dominio, flag estadístico por IQR (ancho de la mitad central) o valor ok, con prioridad del dominio" },
    { text: "Implementar contratos de schema, schema drift y reglas cross-field con códigos legibles en cuarentena" },
    { text: "Publicar métricas (rows_in/clean/quarantine/pass), cuarentena y audit trail append-only (solo se agregan eventos) aunque pass=False" }
  ],
  theory: [
    {
            heading: "El lunes que alguien rellena los nulos con cero",
            figure: {
              id: "S16-null-policy",
              caption:
                "Rellenar con cero un importe ausente inventa un dato. Cero solo es correcto cuando el contrato lo define, como en un contador de reclamos que la fuente deja vacío si no hubo ninguno.",
              alt:
                "Árbol de decisión para un campo nulo. Si la política es required, la fila va a cuarentena y el run no aprueba. Si es optional y la tasa de nulos supera el cap, el estado es blocked y no se rellena. Si es optional y la tasa no supera el cap, se imputa y se marca was_null.",
            },
      paragraphs: [
        "El job venía fallando y la solución fue rápida: `monto.fillna(0)`. Ahora corre. Dos semanas después, en la reunión de gerencia, el ticket promedio aparece más bajo de lo que nadie esperaba. Nadie sabe por qué: los montos que faltaban ahora valen cero y arrastran el promedio hacia abajo. El código no falló ni una sola vez.",
        "Esa es la diferencia entre un dato ausente y un dato conocido. `NaN` significa «no sé»; cero significa «sé que es cero». Sustituir el primero por el segundo no repara nada: convierte una incertidumbre visible en una cifra falsa e invisible. La primera decisión de esta sección es distinguir qué columnas pueden faltar y cuáles, si faltan, obligan a detener el proceso.",
        "De ahí sale la regla que ordena todo lo demás: **nunca arreglar en silencio**. Toda transformación deja un rastro — una métrica, un indicador, o una fila apartada en cuarentena. Si rellenas, se registra cuántas filas rellenaste; si descartas, se registra cuántas y por qué. Un pipeline que limpia sin dejar cuenta de lo que limpió no es reproducible: es una opinión ejecutada.",
        "Lo mismo vale para los duplicados, que casi nunca son idénticos. Dos filas del mismo cliente con la dirección escrita distinto no son un duplicado exacto sino un conflicto, y resolverlo requiere una regla explícita sobre cuál gana. Y para los valores extremos: un monto cien veces mayor que el resto puede ser un error de captura o el cliente más grande. Marcarlo como sospechoso es honesto; borrarlo porque estorba al gráfico no lo es.",
        "Cuando el contrato se rompe, el trabajo se detiene y publica sus métricas en lugar de aprobar a medias — eso es **fail-closed**. La pregunta que atraviesa la sección es la que conviene hacerse antes de cada transformación: **¿puedo explicar esto con una métrica o una fila en cuarentena?** Si no, no se aplica.",
      ],
      callout: {
        type: "info",
        title: "Regla de oro del gate",
        content:
          "Si no puedes explicar la transformación con una métrica o una fila en cuarentena, no la apliques. El conjunto limpio de esta sección alimenta el portfolio y los joins de S17.",
      },
     },
     {
      heading: "Contrato de la sección (referencia)",
      optional: true,
      paragraphs: [
        "Bloque de referencia. Orden de los subtemas y criterio de cierre.",
        "**Orden de los subtemas.** T1 trata la ausencia: campos requeridos y opcionales, indicadores y el límite de cuánto se puede imputar. T2 pasa a los duplicados: exactos frente a conflictivos, y la evidencia de la clave. T3 cubre la normalización de textos, números, fechas y categorías, más los valores extremos. T4 cierra con los contratos y el quality gate.",
        "**Criterio de cierre.** El conjunto limpio que sale de aquí alimenta el portafolio y las uniones de S17, así que debe poder re-ejecutarse y dar los mismos números.",
      ],
     },
     {
      heading: "Nulls y políticas por campo",
      figure: {
        id: "S16-quarantine-reasons",
        caption:
          "Sin el motivo, la cuarentena es un montón de filas que nadie sabe cómo reparar.",
        alt:
          "Dos tablas: la entrada con filas incompletas y la cuarentena con cada fila y su motivo.",
      },
      subtopicId: "S16-T1-A",
      paragraphs: [
        "Cada campo del contrato tiene política **required** u **optional**. En un required, un null manda la fila a cuarentena con la razón `null_required`, y el run termina con `pass=False`. En un optional, el null está permitido, idealmente con indicador de ausencia. Mezclar ambas sin documentar es la causa clásica de “defaults mágicos” que envenenan la lectura posterior de los datos en S17.",
        "Contrato operativo: documenta un dict `{campo: 'required'|'optional'}`, mide con `isna`/`notna`, y arma un mapa `violations` solo para required con n>0. No imputes un required “para que pase el job”: eso oculta rotura de fuente y contamina el trabajo posterior con esos datos.",
        "Caso sintético Perú: `cliente_id` y `monto` son required; `email` es optional. Las filas con id o monto nulo entran a `violations` y después a la cuarentena. La tasa de null de email se reporta como métrica, pero por sí sola no deja el run en `pass=False`. Imprime `violations` y el `null_rate` de los opcionales en el reporte del run.",
      ],
      code: {
        language: 'python',
        title: "null_policy.py",
        code: `def s16_th_1():
    import pandas as pd

    policy = {
        "cliente_id": "required",
        "email": "optional",
        "monto": "required",
        "descuento": "optional",
    }
    df = pd.DataFrame({
        "cliente_id": ["C001", None, "C003"],
        "email": [None, "a@example.com", "b@example.com"],
        "monto": [10.0, 5.0, None],
        "descuento": [None, 2.0, 3.0],
    })
    violations = {}
    for col, pol in policy.items():
        n = int(df[col].isna().sum())
        if pol == "required" and n:
            violations[col] = n
    print("violations", violations)
    print("null_rate_email", float(df["email"].isna().mean()))

s16_th_1()`,
        output: `violations {'cliente_id': 1, 'monto': 1}
null_rate_email 0.3333333333333333`,
      },
      callout: {
        type: "warning",
        title: "Required no se rellena a escondidas",
        content:
          "Null en required → la fila va a cuarentena y el run no aprueba. Nunca un default mágico.",
      },
    },
    {
      heading: "Indicadores y límites de imputación",
      subtopicId: "S16-T1-B",
      paragraphs: [
        "Un **indicador de ausencia** (`descuento_was_null`) preserva señal cuando imputas un optional: el modelo, el auditor y el stakeholder de riesgo ven qué filas fueron tocadas. Imputar sin indicador borra evidencia y crea falsos ceros indistinguibles de ceros reales de negocio.",
        "Límites del gate: no imputar más del **cap** (p. ej. 30–40% null en la columna), no imputar llaves de negocio (`cliente_id`), y documentar la regla (mediana, constante de dominio). Se usa la mediana y no la media porque un solo valor extremo mueve la media y casi no mueve la mediana. Con `[10, 12, 5000]`, la media es 1674 y la mediana 12. Si `null_rate > cap`, el estado es `blocked` y el gate **no** rellena. El cap es inclusivo: con `null_rate` igual al cap, sí se permite imputar.",
        "Caso: `descuento` —optional en el contrato— con 2/5 null y cap=0.4. El rate es igual al cap, así que se permite `fillna(mediana)` + columna `was_null`. Con `monto`, que el mismo contrato declara required, la respuesta sería otra: cuarentena, no relleno, por mucho que el rate quepa bajo el cap. El cap decide *cuánto* nulo tolera un optional; nunca convierte un required en imputable. Si el rate supera el cap, no hay fill silencioso. La mediana se calcula solo sobre no-nulos **pre**-imputación; post-fill no se recalcula para “maquillar” el reporte.",
      ],
      code: {
        language: 'python',
        title: "impute_cap.py",
        code: `def s16_th_2():
    import pandas as pd

    # descuento es optional en el contrato de arriba; por eso puede imputarse.
    df = pd.DataFrame({"descuento": [10.0, None, None, 8.0, 12.0]})
    cap = 0.4
    rate = df["descuento"].isna().mean()
    print("null_rate", rate)
    if rate > cap:
        print("status", "blocked")
    else:
        df = df.copy()
        df["descuento_was_null"] = df["descuento"].isna()
        med = df["descuento"].median()
        df["descuento"] = df["descuento"].fillna(med)
        print(df.to_dict(orient="list"))

s16_th_2()`,
        output: `null_rate 0.4
{'descuento': [10.0, 10.0, 10.0, 8.0, 12.0], 'descuento_was_null': [False, True, True, False, False]}`,
      },
      callout: {
        type: "tip",
        title: "Indicador > silencio",
        content:
          "El modelo y el auditor deben saber qué filas fueron imputadas.",
      },
    },
    {
      heading: "Contar valores distintos por clave",
      figure: {
        id: "S16-groupby-nunique",
        caption:
          "`groupby` reúne las filas por clave y `nunique` deja un conteo de regiones por clave.",
        alt:
          "Dos tablas unidas por una flecha. En la tabla izquierda, C001 aparece en dos filas con regiones diferentes y C002 en una. La flecha dice groupby más nunique. La tabla derecha muestra C001 con 2 regiones distintas y C002 con 1.",
      },
      paragraphs: [
        "Un **maestro de clientes** es la tabla que conserva una fila oficial por cliente. Aquí la clave es `cliente_id`, y el maestro debe guardar una sola región por clave. La pregunta «¿cuántas regiones distintas tiene cada clave?» no se responde fila por fila: primero hay que reunir las filas de la misma clave.",
        "`groupby` reúne las filas que comparten el valor de una clave. Aquí se escribe `df.groupby(\"cliente_id\")`; luego `[\"region\"]` elige la columna que se revisará dentro de cada grupo y `.nunique()` cuenta sus valores distintos.",
        "La Series resultante se llama `regiones` y contiene un valor por clave: el índice guarda `C001` y `C002`, con conteos 2 y 1, respectivamente. Como la clave queda en el índice, `regiones[regiones > 1].index` recupera las claves en conflicto. Antes de este conteo, T1 debe resolver las filas cuyo `cliente_id` es nulo: `groupby` las omite y su clave no aparece en `regiones`.",
        "`groupby` permite otras operaciones, pero aquí basta este patrón: un cliente tiene dos regiones; T2-A añade el caso de filas que se repiten de forma idéntica. S17 volverá a esa familia.",
        "Antes de ejecutar, predice qué conteo tendrá C001 si agregas una tercera fila para esa clave con Cusco y luego compruébalo. Después vuelve al fixture original, sustituye Puno por la región de la primera fila, vuelve a ejecutar y explica por qué C001 deja de aparecer en la lista de conflictos.",
      ],
      code: {
        language: 'python',
        title: "groupby_nunique.py",
        code: `def s16_th_3a():
    import pandas as pd

    df = pd.DataFrame({
        "cliente_id": ["C001", "C001", "C002"],
        "region": ["Lima", "Puno", "Cusco"],
    })
    regiones = df.groupby("cliente_id")["region"].nunique()
    print(regiones.to_dict())
    print("conflict_ids", regiones[regiones > 1].index.tolist())

s16_th_3a()`,
        output: `{'C001': 2, 'C002': 1}
conflict_ids ['C001']`,
      },
      callout: {
        type: "tip",
        title: "Cuenta por clave",
        content:
          "Más de un valor distinto para la misma clave señala un conflicto que debes revisar.",
      },
    },
    {
      heading: "Duplicados exactos vs. conflictos",
      subtopicId: "S16-T2-A",
      paragraphs: [
        "**Duplicado exacto**: mismas columnas relevantes idénticas. **Conflicto**: misma clave de negocio con atributos distintos (p. ej. dos regiones para un `cliente_id`). Tratarlos igual con `drop_duplicates` ciego puede borrar el único rastro del conflicto y dejar un maestro mentiroso.",
        "Contrato: usa `duplicated(keep=False)` para los exactos. Por defecto, `duplicated()` usa `keep='first'` y marca solo las copias que siguen a la primera. Con `keep=False` marca todas las filas del grupo, que es lo que la cuarentena necesita ver. Para los conflictos, cuenta los valores distintos de cada atributo por clave y conserva las claves cuyo conteo sea mayor que 1, como en `regiones[regiones > 1].index`. Ese conteo está indexado por `cliente_id`: nombra clientes, no filas; para recuperar las filas de una clave, compara la columna con ese id, como en `df[df.cliente_id == \"C001\"]`.",
        "Si el contrato también exige que la dirección coincida, repite el conteo para ese atributo. Como `regiones > 1` y `direcciones > 1` salen del mismo DataFrame, comparten el índice y es seguro combinarlas con `|`. Si solo revisas la región, dos filas de la misma clave que difieren únicamente en la dirección pasan como si no hubiera conflicto. Por eso la regla de clasificación mira la fila entera: una clave repetida cuyas filas no son copias exactas es un conflicto, y el conteo por atributo dice qué columna discrepa. Clasifica primero. En un exacto, `keep='first'` deja una copia en el conjunto limpio y las demás van a cuarentena como `dup_exact`. Un conflicto va entero a cuarentena como `dup_conflict`, porque elegir una versión es una decisión que alguien documenta aparte.",
        "Caso sintético: C001 repetido exacto (Lima, score 0.9); C002 con Cusco vs. Puno. Salida esperada: `exact_rows` para C001 y `conflict_ids` para C002. El portfolio de calidad de CP-N2-A debe listar ambos tipos por separado en el memo.",
      ],
      code: {
        language: 'python',
        title: "dups.py",
        code: `def s16_th_3():
    import pandas as pd

    df = pd.DataFrame({
        "cliente_id": ["C001", "C001", "C002", "C002"],
        "region": ["Lima", "Lima", "Cusco", "Puno"],
        "score": [0.9, 0.9, 0.5, 0.5],
    })
    exact = df.duplicated(keep=False)
    regiones = df.groupby("cliente_id")["region"].nunique()
    print("exact_rows", df.loc[exact].to_dict(orient="list"))
    print("conflict_ids", regiones[regiones > 1].index.tolist())

s16_th_3()`,
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
      heading: "Claves, cardinalidad y conservación de evidencia",
      subtopicId: "S16-T2-B",
      paragraphs: [
        "Define la **clave de negocio** y la cardinalidad esperada (típicamente 1 fila por cliente). Los duplicados de clave van a **cuarentena con evidencia completa** (todas las versiones y columnas de origen/batch), no se eliminan sin log append-only (solo se agregan eventos).",
        "Contrato: cada fila de entrada queda en un solo conjunto, así que se cumple `rows_in == rows_clean + rows_quarantine`. Las copias exactas sobrantes van a cuarentena como `dup_exact`. Las filas cuya clave se repite con valores distintos van todas a cuarentena como `dup_conflict`, sin perder columnas. `clean` guarda el resto y alimenta los joins de S17. Si una persona decide después qué versión gana, esa fila pasa al conjunto limpio con un evento `promote` en el audit trail, y la decisión queda registrada.",
        "Caso: C001 llega con scores 0.9 y 0.4 desde las fuentes a y b, y C003 llega dos veces idéntico. Las dos filas de C001 van a cuarentena con sus columnas de origen; de C003 queda una copia en `clean` y la otra va a cuarentena. `drop_duplicates(key, keep='first')` habría dejado 0.9 en el conjunto limpio sin que nadie decidiera que 0.9 es el valor correcto. Sin esa evidencia, el gate no es auditable ante un stakeholder de riesgo o cumplimiento.",
      ],
      code: {
        language: 'python',
        title: "key_evidence.py",
        code: `def s16_th_4():
    import pandas as pd

    df = pd.DataFrame({
        "cliente_id": ["C001", "C001", "C002", "C003", "C003"],
        "score": [0.9, 0.4, 0.7, 0.5, 0.5],
        "src": ["a", "b", "a", "a", "a"],
    })
    key = "cliente_id"
    extra = df.duplicated(keep="first")  # copias exactas sobrantes
    unicas = df.loc[~extra]
    conflicto = unicas.duplicated(key, keep=False)  # misma clave, valores distintos
    quarantine = pd.concat([
        df.loc[extra].assign(reason="dup_exact"),
        unicas.loc[conflicto].assign(reason="dup_conflict"),
    ])
    clean = unicas.loc[~conflicto]
    print("clean", clean[key].tolist())
    print("quarantine", quarantine[[key, "src", "reason"]].to_dict(orient="list"))
    print("evidence_cols", quarantine.columns.tolist())
    print("rows_in", len(df), "=", len(clean), "+", len(quarantine))

s16_th_4()`,
        output: `clean ['C002', 'C003']
quarantine {'cliente_id': ['C003', 'C001', 'C001'], 'src': ['a', 'a', 'b'], 'reason': ['dup_exact', 'dup_conflict', 'dup_conflict']}
evidence_cols ['cliente_id', 'score', 'src', 'reason']
rows_in 5 = 2 + 3`,
      },
      callout: {
        type: "tip",
        title: "Evidencia completa",
        content:
          "Cada fila queda en clean o en cuarentena, nunca en las dos. La cuarentena guarda todas las versiones para que una persona elija con evidencia.",
      },
    },
    {
      heading: "Normalización de strings, números, fechas y categorías",
      subtopicId: "S16-T3-A",
      paragraphs: [
        "Normalización: strings (`strip`, colapso de espacios, `title`/`casefold`), números con **locale documentado** (no adivines), fechas con formato documentado y categorías con mapa de sinónimos (`LIM`→`Lima`). `title()` pone mayúscula a cada palabra: «madre de dios» queda «Madre De Dios». Para nombres de varias palabras, el canónico sale del mapa de sinónimos. **Normalizar ≠ imputar**: no inventes valores, solo canonicidad.",
        "Contrato de montos PEN sintéticos, en cuatro reglas. (1) Quita el prefijo `S/` y los espacios. (2) Si hay **coma y punto**, el separador que aparece al final es el decimal y el otro marca miles. Así, `S/ 1,250.50`, como lo imprime un comprobante peruano, da `1250.5`, y `1.250,5` también. (3) Si hay **un solo separador seguido de tres dígitos**, como `1,250`, el valor es ambiguo: puede ser mil doscientos cincuenta o uno coma veinticinco. No se adivina: la función lanza `ValueError` y la fila va a cuarentena. (4) En otro caso, el único separador es el decimal: `3,00` da `3.0` y `10.50` da `10.5`. Conserva el **raw** en una columna lateral (`region_raw`, `monto_raw`) cuando el valor canónico pueda disputarse. Valida los dtypes después de normalizar y **antes** del join de S17.",
        "Caso sintético Perú: regiones con espacios y códigos (`LIM`, `PUN`) y montos `S/ 10.50`, `3,00`, `S/ 1,250.50` y `1.250,5`. Las fechas llegan en tres formatos: `01/03/2024`, `2024-03-15` y `15-03-2024`. Salida: regiones canónicas, floats correctos y fechas ISO, con el raw intacto para auditoría. El contrato fija un formato por separador: con `/` es día/mes/año. Por eso `03/15/2024`, escrito con el mes primero, no se reinterpreta: queda `NaT` (Not a Time, el nulo de las fechas) y se revisa. Con días hasta 12, `03/04/2024` sí parsearía como 3 de abril sin ningún error. Por eso el formato es parte del contrato de cada fuente, no una lista de intentos. Nunca subas padrones reales ni PII al repo del curso.",
      ],
      code: {
        language: 'python',
        title: "normalize.py",
        code: `def s16_th_5():
    import pandas as pd
    import re

    def norm_money(x):
        if pd.isna(x):
            return None
        s = str(x).replace("S/", "").replace(" ", "")
        if "," in s and "." in s:
            # regla 2: el separador que aparece al final es el decimal
            miles = "." if s.rfind(",") > s.rfind(".") else ","
            s = s.replace(miles, "")
        elif re.fullmatch(r"\\d{1,3}[.,]\\d{3}", s):
            # regla 3: un separador y tres dígitos es ambiguo; no se adivina
            raise ValueError("monto ambiguo: " + str(x))
        return float(s.replace(",", "."))

    cat_map = {"LIM": "Lima", "PUN": "Puno", "CUZ": "Cusco"}

    def parse_fecha(x):
        # Un formato por separador, documentado en el contrato de la fuente.
        for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"):
            try:
                return pd.to_datetime(x, format=fmt)
            except (ValueError, TypeError):
                continue
        return pd.NaT

    df = pd.DataFrame({
        "region_raw": [" lima ", "LIM", "PUN", "cusco "],
        "monto_raw": ["S/ 10.50", "3,00", "S/ 1,250.50", "1.250,5"],
        "fecha_raw": ["01/03/2024", "2024-03-15", "15-03-2024", "03/15/2024"],
    })
    stripped = df["region_raw"].str.strip()
    df["region"] = [cat_map.get(x.upper(), x.title()) for x in stripped]
    df["monto"] = df["monto_raw"].map(norm_money)
    df["fecha"] = df["fecha_raw"].map(parse_fecha)
    print(df[["region", "monto"]].to_dict(orient="list"))
    print("fechas", df["fecha"].dt.strftime("%Y-%m-%d").fillna("NaT").tolist())
    try:
        norm_money("1,250")
    except ValueError as e:
        print("cuarentena", e)

s16_th_5()`,
        output: `{'region': ['Lima', 'Lima', 'Puno', 'Cusco'], 'monto': [10.5, 3.0, 1250.5, 1250.5]}
fechas ['2024-03-01', '2024-03-15', '2024-03-15', 'NaT']
cuarentena monto ambiguo: 1,250`,
      },
      callout: {
        type: "info",
        title: "Raw al lado",
        content:
          "region_raw/monto_raw permiten auditar la normalización. Documenta si la coma es decimal o miles.",
      },
    },
    {
      heading: "Cuartiles, IQR y cercas de Tukey",
      figure: {
        id: "S16-iqr-fences",
        caption:
          "Las dos cercas señalan outliers estadísticos; la regla de dominio decide si son errores o flags.",
        alt:
          "Recta numérica con los valores -1, 10, 11, 12, 13 y 5000; El eje se corta para que 5000 quepa en la recta, y el punto lleva la etiqueta 5000. Una banda va de Q1 igual a 10.25 hasta Q3 igual a 12.75 y representa la mitad central, cuyo IQR es 2.5. Las cercas están en 6.5 y 16.5. El valor -1 queda fuera por la cerca inferior y 5000 queda fuera por la cerca superior.",
      },
      paragraphs: [
        "El gate necesita una forma basada en los datos para señalar qué valores están lejos del resto, aparte de los límites que dicta el negocio. Un **outlier** o **valor atípico** es un valor alejado de la mayoría de su propia columna, según la dispersión de esa columna.",
        "Ordena mentalmente los seis montos `[-1, 10, 11, 12, 13, 5000]` antes de buscar sus **cuartiles**, los puntos que la dividen en cuatro partes. Q1 deja aproximadamente una cuarta parte de los valores por debajo; la mediana deja la mitad; Q3 deja tres cuartas partes. pandas ubica Q1 en la posición `(6 - 1) * 0.25 = 1.25`, un cuarto del camino de 10 a 11, y obtiene 10.25. Para Q3 usa la posición 3.75, tres cuartos del camino de 12 a 13, y obtiene 12.75.",
        "El **rango intercuartílico (IQR)** es `q3 - q1`: mide el ancho de la mitad central de los valores. Las **cercas de Tukey** son dos límites calculados a partir de los cuartiles, uno inferior y otro superior. Separan el grueso de los valores de la columna de los que quedan lejos. Usan 1.5 como multiplicador convencional: la inferior está en `q1 - 1.5 * iqr` y la superior en `q3 + 1.5 * iqr`. Todo valor por debajo de la cerca inferior o por encima de la superior es un outlier estadístico, candidato para que la regla de dominio lo resuelva como error o flag.",
        "Aquí `q1` es 10.25, la mediana es 11.5, `q3` es 12.75 y `iqr` es 2.5. Como los cortes caen entre observaciones, 10 queda justo fuera de la banda por ser menor que 10.25 y 13 queda fuera por ser mayor que 12.75. La banda contiene dos de los seis valores: «mitad central» nombra la proporción a la que apuntan los cuartiles, que con seis observaciones es aproximada.",
        "Las cercas quedan en 6.5 y 16.5, por eso -1 y 5000 son outliers estadísticos. La media sube hasta 840.83 por el 5000, pero los cuartiles se obtienen de posiciones de la columna ordenada y las cercas se calculan a partir de ellos. Si reemplazas el mayor valor, 5000, por 9000, esas seis posiciones no cambian: las cercas siguen en 6.5 y 16.5, mientras la media sube a 1507.5. La regla no depende de la media ni exige una campana; cuántos valores marca depende de la forma de la columna y del factor convencional 1.5.",
        "Antes de volver a ejecutar, predice qué valor de la lista literal `[20, 22, 21, 23, 24, 2]` quedará fuera y por cuál de las dos cercas. Después usa esa lista para construir la Series `s` y ejecuta el código para comprobar tu respuesta.",
      ],
      code: {
        language: 'python',
        title: "iqr_fences.py",
        code: `def s16_th_6a():
    import pandas as pd

    s = pd.Series([10, 12, 11, 13, 5000, -1])
    q1 = s.quantile(0.25)
    q3 = s.quantile(0.75)
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    fuera = s[(s < lower) | (s > upper)]
    print("q1", q1, "q3", q3, "iqr", iqr)
    print("cercas", lower, upper)
    print("fuera", fuera.tolist())
    print("media", round(s.mean(), 2))

    s_9000 = pd.Series([10, 12, 11, 13, 9000, -1])
    q1_9000 = s_9000.quantile(0.25)
    q3_9000 = s_9000.quantile(0.75)
    iqr_9000 = q3_9000 - q1_9000
    print("cercas con 9000", q1_9000 - 1.5 * iqr_9000, q3_9000 + 1.5 * iqr_9000)
    print("media con 9000", round(s_9000.mean(), 2))

s16_th_6a()`,
        output: `q1 10.25 q3 12.75 iqr 2.5
cercas 6.5 16.5
fuera [5000, -1]
media 840.83
cercas con 9000 6.5 16.5
media con 9000 1507.5`,
      },
      callout: {
        type: "warning",
        title: "Dos cercas, no una",
        content:
          "Compara cada valor con la cerca inferior y la superior. Mirar una sola deja sin marcar todo el extremo opuesto.",
      },
    },
    {
      heading: "Outliers plausibles vs. errores",
      subtopicId: "S16-T3-B",
      paragraphs: [
        "Las cercas marcan **outliers estadísticos**, valores alejados del resto de su columna. Cada uno es candidato para la regla de dominio. Un monto alto legítimo puede quedar como flag plausible. Un valor que viola los **límites de dominio** (monto < 0, lat 999, edad 200) es un error.",
        "Contrato: mantén las máscaras `stat_outlier` y `domain_error` por separado. Un `domain_error` va a cuarentena. Un outlier estadístico dentro del dominio se queda en el conjunto limpio con un flag (`monto_flag=True`), para que el análisis lo incluya o lo excluya a propósito. Nunca se borra una fila solo por IQR. Documenta los límites de dominio en el memo del gate (p. ej. monto ∈ [0, 10000] PEN sintéticos del fixture de clase).",
        "Caso: serie con 5000 (cola plausible) y -1 (error). `stat` marca ambos; `domain` solo -1; `plausible_extreme` = 5000. La lectura posterior de los montos en S17 no debe perder la cola legítima por un 1.5·IQR ciego sin revisión explícita de dominio.",
      ],
      code: {
        language: 'python',
        title: "outliers.py",
        code: `def s16_th_6():
    import pandas as pd

    df = pd.DataFrame({"monto": [10, 12, 11, 13, 5000, -1]})
    q1, q3 = df["monto"].quantile(0.25), df["monto"].quantile(0.75)
    iqr = q3 - q1
    stat = (df["monto"] < q1 - 1.5 * iqr) | (df["monto"] > q3 + 1.5 * iqr)
    domain_err = (df["monto"] < 0) | (df["monto"] > 10000)
    print("stat_outlier", df.loc[stat, "monto"].tolist())
    print("domain_error", df.loc[domain_err, "monto"].tolist())
    print("plausible_extreme", df.loc[stat & ~domain_err, "monto"].tolist())

s16_th_6()`,
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
      heading: "Reglas de schema y cross-field",
      subtopicId: "S16-T4-A",
      paragraphs: [
        "Contrato de **schema**: columnas presentes, dtypes esperados y nullability por campo. **Cross-field**: p. ej. `fin >= inicio`, `monto > 0` si estado=pagado. Cada regla devuelve máscara de fallos + código de error legible para cuarentena.",
        "Ante **schema drift** (desviación de esquema: columna required faltante o renombrada), el gate falla con el **nombre** de la columna — no con un `KeyError` sin mensaje claro al final del pipeline. Es el mismo espíritu fail-closed: el drift se hace visible al operador. El drift no es un problema de una fila sino del lote entero. El gate se detiene antes de revisar filas, retiene todo el lote en cuarentena con la razón `schema_drift` y publica `pass=False` con las columnas faltantes. Las columnas extra pueden emitir `warn` o fallar, según la política documentada en el runbook del job.",
        "Caso: el contrato espera `inicio`, `fin` y `monto`. `check` devuelve una lista de fallos, cada uno con su índice y su código (`cross_field` para `fin < inicio`, `domain_error` para un monto negativo). La segunda llamada quita `monto`, y `check` responde `schema_drift` antes de revisar una sola fila. Este bloque es el puente al join validado y al portfolio de S17.",
      ],
      code: {
        language: 'python',
        title: "contracts.py",
        code: `def s16_th_7():
    import pandas as pd

    def check(df):
        expected = ["inicio", "fin", "monto"]
        drift = [c for c in expected if c not in df.columns]
        if drift:
            return {"schema_drift": drift}
        fallos = [{"idx": i, "reason": "cross_field"}
                  for i in df.index[df["fin"] < df["inicio"]].tolist()]
        fallos += [{"idx": i, "reason": "domain_error"}
                   for i in df.index[df["monto"] < 0].tolist()]
        return {"fallos": fallos}

    df = pd.DataFrame({
        "inicio": pd.to_datetime(["2024-01-01", "2024-02-01"]),
        "fin": pd.to_datetime(["2024-01-10", "2024-01-15"]),
        "monto": [10.0, -5.0],
    })
    print(check(df))
    print(check(df.drop(columns="monto")))

s16_th_7()`,
        output: `{'fallos': [{'idx': 1, 'reason': 'cross_field'}, {'idx': 1, 'reason': 'domain_error'}]}
{'schema_drift': ['monto']}`,
      },
      callout: {
        type: "danger",
        title: "Drift explicable",
        content:
          "Si falta una columna required, el job falla con el nombre de la columna — no con un KeyError sin mensaje claro al final.",
      },
    },
    {
      heading: "Métricas, cuarentena y audit trail",
      subtopicId: "S16-T4-B",
      paragraphs: [
        "Métricas operables del run: `rows_in`, `rows_clean`, `rows_quarantine` y el booleano `pass`. Como cada fila queda en un solo conjunto, `rows_in == rows_clean + rows_quarantine`, y `pass` es `True` solo si `rows_quarantine == 0`. Una tasa es un conteo dividido por `rows_in`, por ejemplo `rows_quarantine / rows_in`. Un fallo **sin métricas** no se puede operar en un job nocturno ni explicar a negocio, riesgo o auditoría interna.",
        "La cuarentena es una tabla de filas rechazadas con la razón codificada. Las razones son códigos fijos en toda la sección: `null_required`, `dup_exact`, `dup_conflict`, `domain_error`, `cross_field` y `schema_drift`. El **audit trail** es una lista append-only de eventos: `ingest` al recibir el lote, `quarantine` al apartar filas y `promote` al publicar filas en el conjunto limpio. Solo se agregan eventos; nunca se modifican ni se borran. El gate publica el reporte aunque `pass=False` (exit code ≠ 0 acompañado de un JSON de métricas).",
        "Caso: 2 filas de entrada, 1 limpia, 1 en cuarentena por `null_required` en `monto`; el audit trail registra un evento `quarantine`. El campo `metrics.pass` es `false`. S17 solo debe consumir el conjunto `clean`, y el memo debe declarar cuántas filas quedaron fuera del universo analítico.",
      ],
      code: {
        language: 'python',
        title: "quarantine_audit.py",
        code: `def s16_th_8():
    import pandas as pd, json

    clean = pd.DataFrame({"id": ["C001"], "ok": [True]})
    quar = pd.DataFrame({"id": ["C002"], "reason": ["null_required"], "field": ["monto"]})
    audit = [
        {"event": "ingest", "n": 2},
        {"event": "quarantine", "n": 1, "reason": "null_required"}
    ]
    metrics = {
        "rows_in": len(clean) + len(quar),
        "rows_clean": len(clean),
        "rows_quarantine": len(quar),
        "pass": len(quar) == 0,
    }
    print(json.dumps(metrics, sort_keys=True))
    print(audit[-1])

s16_th_8()`,
        output: `{"pass": false, "rows_clean": 1, "rows_in": 2, "rows_quarantine": 1}
{'event': 'quarantine', 'n': 1, 'reason': 'null_required'}`,
      },
      callout: {
        type: "tip",
        title: "Métricas siempre",
        content:
          "Un fallo sin métricas no se puede operar. Emite el reporte aunque el exit code sea distinto de cero.",
      },
    }
  ],
  iDo: {
    intro: "Yo demuestro (I Do): ocho demos sobre un mismo hilo. Un batch sintético de clientes PE recorre null policy, imputación con cap, duplicados y conflictos. Sigue con evidencia, normalización PEN, outliers y contratos schema/cross-field. Cierra con métricas y audit. Observa el patrón fail-closed (fallar de forma segura) en cada paso.",
    steps: [
      {
        demoId: "S16-T1-A-DEMO",
        subtopicId: "S16-T1-A",
        environment: "local-python",
        description: "Aplicar políticas de null por campo y listar violaciones required",
        preamble:
          "El lunes un batch de clientes sintéticos llega con `cliente_id` y `monto` null en filas distintas. Antes de “arreglar”, el quality gate de CP-N2-A debe **listar violaciones required** y solo **reportar** nulls en campos optional. En esta demo un `policy` marca required vs. optional; no escribas aún: predice el dict de violaciones y el conteo de nulls de `telefono`, luego compara con la salida. Observa que el optional no entra al mapa de fail.",
        code: {
          language: 'python',
          title: "demo_null_policy.py",
          code: `def s16_ido_1():
    import pandas as pd
    policy = {"cliente_id": "required", "telefono": "optional", "monto": "required"}
    df = pd.DataFrame({
        "cliente_id": ["C001", None, "C003"],
        "telefono": [None, "999", "998"],
        "monto": [1.0, 2.0, None],
    })
    viol = {c: int(df[c].isna().sum()) for c, p in policy.items() if p == "required" and df[c].isna().any()}
    print(viol)
    print("optional_nulls", int(df["telefono"].isna().sum()))

s16_ido_1()`,
          output: `{'cliente_id': 1, 'monto': 1}
optional_nulls 1`,
        },
        why: "Required se traduce en cuarentena de la fila y en un run que no aprueba: un null en llave de negocio o monto no se rellena “para que pase el job”. Optional se mide como métrica (`optional_nulls`) sin tumbar el gate por sí solo. El mapa se arma con `isna` filtrando la policy: así evitas el fillna mágico de ids. En We Do practicarás conteo, mapa y decisión pass/fail con el defecto típico de usar `notna`.",
        retrospective:
          "Un null en `cliente_id` manda la fila a cuarentena y deja el run en `pass=False`; uno en `telefono` solo se reporta. Si puedes explicar por qué, ya tienes la política por campo. El error clásico es rellenar required “para que pase el job”. En We Do practicarás conteo, mapa y decisión pass/fail.",
      },
      {
        demoId: "S16-T1-B-DEMO",
        subtopicId: "S16-T1-B",
        environment: "local-python",
        description: "Imputar mediana solo si null_rate <= cap; marcar indicador",
        preamble:
          "Cambia el contrato para esta demo: aquí `monto` es **optional**, no el required del caso anterior. Vale la pena decirlo en voz alta: el nombre del campo no cambia, pero la política sí. Es justo el «mezclar ambas sin documentar» contra el que te previene esta sección. Con `monto` optional y nulls, el gate puede imputar **solo si** el `null_rate` no supera el cap, y debe dejar un indicador de qué filas se tocaron. En esta demo `cap=0.5` y un null de cuatro filas: sigue el `status`, el rate y el dict final. Predice si verás `imputed` o `blocked` y en qué posición `monto_was_null` es True.",
        code: {
          language: 'python',
          title: "demo_impute.py",
          code: `def s16_ido_2():
    import pandas as pd
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
    print(status, rate, df.to_dict(orient="list"))

s16_ido_2()`,
          output: `imputed 0.25 {'monto': [10.0, 11.0, 12.0, 11.0], 'monto_was_null': [False, True, False, False]}`,
        },
        why: "El cap evita imputación masiva que envenena los KPI (indicadores clave de negocio, como el ticket promedio): si el rate supera el umbral, el status es `blocked`, no un fill silencioso. El indicador `monto_was_null` se crea **antes** del fill para que auditor y modelo sepan qué filas se tocaron. La mediana se calcula sobre no-nulos pre-fill; no se recalcula después para maquillar el reporte. En We Do el defecto clásico es invertirlo: fillna y luego isna.",
        retrospective:
          "Imputar sin indicador borra la diferencia entre cero real y cero inventado. Si el rate supera el cap, el status es `blocked`, no un fill silencioso. Pregunta de auto-chequeo: ¿en qué fila del demo `monto_was_null` es True y por qué se marca *antes* del fill? En We Do practicarás el orden del indicador y el umbral.",
      },
      {
        demoId: "S16-T2-A-DEMO",
        subtopicId: "S16-T2-A",
        environment: "local-python",
        description: "Detectar duplicados exactos vs. conflictos de región por cliente_id",
        preamble:
          "En un maestro de clientes, C001 se repite idéntico y C002 aparece con Cusco y Puno. Si haces `drop_duplicates` ciego, puedes borrar el único rastro del conflicto. En esta demo no escribas: cuenta mentalmente filas exactas y lista de ids en conflicto, luego compara con la salida. Observa que la acción de limpieza **depende** de la clase.",
        code: {
          language: 'python',
          title: "demo_dups.py",
          code: `def s16_ido_3():
    import pandas as pd
    df = pd.DataFrame({
        "cliente_id": ["C001", "C001", "C002", "C002", "C003"],
        "region": ["Lima", "Lima", "Cusco", "Puno", "Lima"],
        "score": [0.5, 0.5, 0.7, 0.7, 0.9],
    })
    exact_n = int(df.duplicated(keep=False).sum())
    regiones = df.groupby("cliente_id")["region"].nunique()
    print("exact_dup_rows", exact_n)
    print("conflict_ids", regiones[regiones > 1].index.tolist())

s16_ido_3()`,
          output: `exact_dup_rows 2
conflict_ids ['C002']`,
        },
        why: "Duplicado exacto y conflicto de atributo no se tratan igual: el exacto puede colapsarse tras log; el conflicto exige evidencia y regla explícita, no `keep='first'` silencioso. `duplicated(keep=False)` **marca todas las filas** del grupo exacto; `nunique` sobre un atributo detecta claves con versiones distintas. Clasificar antes de borrar evita un maestro mentiroso. En We Do practicarás cada máscara y la etiqueta conjunta.",
        retrospective:
          "Clasificar antes de borrar es la regla de oro de T2. Exacto ≠ conflicto: el segundo no se “arregla” con keep first silencioso. Pregunta: si solo hicieras `drop_duplicates`, ¿qué evidencia de C002 perderías? En We Do practicarás cada máscara y luego la etiqueta conjunta.",
      },
      {
        demoId: "S16-T2-B-DEMO",
        subtopicId: "S16-T2-B",
        environment: "local-python",
        description: "Preservar evidencia en cuarentena al resolver clave duplicada",
        preamble:
          "C001 llega dos veces con scores distintos y batches `b1`/`b2`. Es un conflicto, así que las **dos** filas van a cuarentena con sus columnas, y ninguna queda en el conjunto limpio hasta que alguien decida. En esta demo predice `clean_ids`, el contenido de `quarantine` y la suma de la última línea antes de mirar la salida. Observa que ninguna fila desaparece y que ninguna está en los dos conjuntos.",
        code: {
          language: 'python',
          title: "demo_evidence.py",
          code: `def s16_ido_4():
    import pandas as pd
    df = pd.DataFrame({
        "cliente_id": ["C001", "C001", "C002"],
        "score": [0.9, 0.1, 0.5],
        "batch": ["b1", "b2", "b1"],
    })
    # Este lote no trae copias exactas: toda clave repetida es un conflicto.
    conflicto = df.duplicated("cliente_id", keep=False)
    q = df[conflicto].assign(reason="dup_conflict")
    clean = df[~conflicto]
    print("clean_ids", clean["cliente_id"].tolist())
    print("quarantine", q.to_dict(orient="list"))
    print("rows_in", len(df), "=", len(clean), "+", len(q))

s16_ido_4()`,
          output: `clean_ids ['C002']
quarantine {'cliente_id': ['C001', 'C001'], 'score': [0.9, 0.1], 'batch': ['b1', 'b2'], 'reason': ['dup_conflict', 'dup_conflict']}
rows_in 3 = 1 + 2`,
        },
        why: "El clean alimenta los joins de S17; la quarantine es evidencia completa (todas las versiones y columnas de origen). Si C001 se quedara en clean con `keep='first'`, la fila estaría en los dos conjuntos y `rows_in` ya no cuadraría con la suma. Además, nadie habría decidido que 0.9 es el score correcto. Sin columnas de batch, el gate no es auditable ante riesgo o cumplimiento. En We Do armarás split, columnas y chequeo de cardinalidad 1:1.",
        retrospective:
          "Un conflicto va entero a cuarentena; `keep='first'` solo es seguro con copias exactas. Sin quarantine con columnas de origen, el gate no es auditable ante riesgo o cumplimiento. Pregunta: ¿por qué `quarantine` guarda *ambas* filas de C001 y no solo una? En We Do armarás conteos (`len`), columnas de evidencia y chequeo de cardinalidad 1:1.",
      },
      {
        demoId: "S16-T3-A-DEMO",
        subtopicId: "S16-T3-A",
        environment: "local-python",
        description: "Normalizar región y montos conservando columnas raw",
        preamble:
          "Los montos llegan como `S/12.5`, `3,00` y `S/ 1,250.50`; las regiones con espacios y mayúsculas. La normalización del gate hace canónicos **sin** pisar el raw, y el locale PEN está documentado: el último separador es el decimal, y una coma sola también lo es. En esta demo predice las cuatro columnas del dict final: raw vs. canónico, y fíjate en el monto de la tercera fila. No escribas aún; sigue el `map` de montos y el `str.title` de región.",
        code: {
          language: 'python',
          title: "demo_norm.py",
          code: `def s16_ido_5():
    import pandas as pd

    def norm_money(x):
        s = str(x).replace("S/", "").replace(" ", "")
        if "," in s and "." in s:
            miles = "." if s.rfind(",") > s.rfind(".") else ","
            s = s.replace(miles, "")
        return float(s.replace(",", "."))

    df = pd.DataFrame({
        "region_raw": [" lima", "PUNO ", "cusco"],
        "monto_raw": ["S/12.5", "3,00", "S/ 1,250.50"],
    })
    df["region"] = df["region_raw"].str.strip().str.title()
    df["monto"] = df["monto_raw"].map(norm_money)
    print(df.to_dict(orient="list"))

s16_ido_5()`,
          output: `{'region_raw': [' lima', 'PUNO ', 'cusco'], 'monto_raw': ['S/12.5', '3,00', 'S/ 1,250.50'], 'region': ['Lima', 'Puno', 'Cusco'], 'monto': [12.5, 3.0, 1250.5]}`,
        },
        why: "Normalizar no es imputar: no inventas valores, solo canonicidad. Conservar raw al lado permite disputar el transform ante auditoría. El contrato de coma/punto evita convertir `3,00` en 300 y `S/ 1,250.50` en 1.2505, dos errores que envenenan el ticket promedio. `strip` + `title` unifican regiones PE antes de mapas de sinónimos. En We Do practicarás cada pieza: strings, locale PEN y no-overwrite del raw.",
        retrospective:
          "Si el raw y el canónico viven juntos, el transform es auditable. El error clásico es pisar la columna original o borrar comas a ciegas (`3,00` → 300). Pregunta: ¿qué KPI de ticket se infla si tratas la coma como miles? En We Do practicarás strip/title, locale PEN y no-overwrite del raw.",
      },
      {
        demoId: "S16-T3-B-DEMO",
        subtopicId: "S16-T3-B",
        environment: "local-python",
        description: "Clasificar outlier estadístico vs. error de dominio en montos",
        preamble:
          "Una serie de montos trae `1000` (cola estadística) y `-3` (fuera de dominio de negocio). El gate **no** borra por IQR solo: primero marca error de dominio y luego flag estadístico. En esta demo predice `stat`, `error` y `plausible` antes de mirar la salida. Observa que dominio manda sobre la etiqueta final.",
        code: {
          language: 'python',
          title: "demo_outliers.py",
          code: `def s16_ido_6():
    import pandas as pd
    s = pd.Series([5, 6, 7, 6, 1000, -3])
    q1, q3 = s.quantile(0.25), s.quantile(0.75)
    iqr = q3 - q1
    stat = (s < q1 - 1.5 * iqr) | (s > q3 + 1.5 * iqr)
    domain_err = (s < 0) | (s > 10000)
    print("stat", s[stat].tolist())
    print("error", s[domain_err].tolist())
    print("plausible", s[stat & ~domain_err].tolist())

s16_ido_6()`,
          output: `stat [1000, -3]
error [-3]
plausible [1000]`,
        },
        why: "IQR propone outliers estadísticos; los límites de dominio deciden qué es error de negocio. Un monto negativo no es “outlier curioso”: es domain_error. Borrar por IQR a ciegas elimina colas legítimas (p. ej. un ticket alto pero válido). La capa `plausible` aísla lo raro-pero-dentro-de-dominio para flag, no drop. En We Do practicarás máscaras y etiquetas error/flag/ok.",
        retrospective:
          "Si puedes explicar por qué 1000 es `flag` y -3 es `error`, ya separas estadística de regla de negocio. El error clásico es borrar todo lo “raro” por IQR. Pregunta: ¿quién manda si un valor es a la vez outlier estadístico y domain_error? En We Do practicarás cada capa (domain → IQR → etiquetas).",
      },
      {
        demoId: "S16-T4-A-DEMO",
        subtopicId: "S16-T4-A",
        environment: "local-python",
        description: "Validar schema required y regla cross-field fin>=inicio",
        preamble:
          "El contrato del batch exige columnas `inicio`, `fin` y `monto`, y la regla de negocio `fin >= inicio`. En esta demo el schema está completo pero la segunda fila viola el orden temporal. Predice `missing`, los índices de `cross_field` y el valor de `pass` antes de mirar la salida. Observa que el fallo se publica como un código (`cross_field`), un índice y `pass False`, no como un crash opaco.",
        code: {
          language: 'python',
          title: "demo_schema_rules.py",
          code: `def s16_ido_7():
    import pandas as pd
    df = pd.DataFrame({
        "inicio": pd.to_datetime(["2024-01-01", "2024-05-01"]),
        "fin": pd.to_datetime(["2024-02-01", "2024-04-01"]),
        "monto": [10.0, 20.0],
    })
    required = ["inicio", "fin", "monto"]
    missing = [c for c in required if c not in df.columns]
    cross_fail = df.index[df["fin"] < df["inicio"]].tolist()
    print("missing", missing, "cross_field", cross_fail)
    print("pass", not missing and not cross_fail)

s16_ido_7()`,
          output: `missing [] cross_field [1]
pass False`,
        },
        why: "Schema drift (columnas required faltantes) y reglas cross-field (p. ej. vigencia temporal) son capas del mismo contrato: presencia no basta si los campos se contradicen. El gate debe fallar con códigos e índices legibles, no con un KeyError a mitad del pipeline. Así el operador del job reacciona sin adivinar. En We Do practicarás missing, máscara temporal y el flag `drift`/`schema_ok`.",
        retrospective:
          "Un gate sin reglas cross-field aprueba filas internamente inconsistentes. Schema ok no basta: el tiempo de vigencia también es contrato. Pregunta: en la demo, ¿por qué `missing` es `[]` y aun así el gate debe reportar un fallo? En We Do practicarás missing, máscara temporal y el flag `drift`/`schema_ok`.",
      },
      {
        demoId: "S16-T4-B-DEMO",
        subtopicId: "S16-T4-B",
        environment: "local-python",
        description: "Cuarentenar fallos con métricas y audit trail append-only",
        preamble:
          "El batch entra con 5 filas y 2 van a cuarentena por `null_required` y `domain_error`. El gate **publica** métricas con `pass: false` y un audit trail de al menos `ingest` + `quarantine`. En esta demo predice `rows_clean` y el último evento del audit antes de mirar la salida. Observa que el fallo no oculta números.",
        code: {
          language: 'python',
          title: "demo_audit.py",
          code: `def s16_ido_8():
    import json
    rows_in = 5
    quarantine = [{"id": "C002", "reason": "null_required"}, {"id": "C004", "reason": "domain_error"}]
    clean_n = rows_in - len(quarantine)
    audit = []
    audit.append({"event": "ingest", "rows_in": rows_in})
    audit.append({"event": "quarantine", "n": len(quarantine)})
    metrics = {"rows_in": rows_in, "rows_clean": clean_n, "rows_quarantine": len(quarantine), "pass": len(quarantine) == 0}
    print(json.dumps(metrics, sort_keys=True))
    print(len(audit), audit[-1]["event"])

s16_ido_8()`,
          output: `{"pass": false, "rows_clean": 3, "rows_in": 5, "rows_quarantine": 2}
2 quarantine`,
        },
        why: "Operar un fallo exige métricas derivadas del conteo real y razones codificadas, no solo un exit code opaco. El audit append-only (ingest → quarantine) permite reconstruir el run sin reescribir historia. `pass: false` con JSON publicado es el producto del fail-closed: el operador ve cuántas filas entraron, cuántas quedaron limpias y cuántas cayeron. En We Do armarás el bloque metrics, el append y el booleano `pass`.",
        retrospective:
          "Un gate que solo “explota” sin JSON no es operable. Métricas + audit son el producto del fail-closed: el operador ve filas in/clean/quarantine aunque el exit code sea ≠ 0. Pregunta: ¿qué evento debe quedar *antes* de `quarantine` en el audit? En We Do construirás el bloque metrics, el append y el booleano `pass`.",
      }
    ],
  },
  weDo: {
    intro: "Lo hacemos juntos (We Do): 24 ejercicios (E1 guiado → E2 independiente → E3 transferencia) por subtema del gate. Cada starter (el código inicial que recibes) trae un error de lógica a corregir y dos pistas conceptuales. No imprimas éxito a ciegas: el oráculo es la métrica o etiqueta correcta.",
    steps: [
      {
        id: "S16-T1-A-E1",
        subtopicId: "S16-T1-A",
        kind: "guided",
        title: "Contar nulls required y etiquetar violates",
        preamble: "- **Contexto:** en el gate de CP-N2-A, un `id` required con null no se “maquilla”: se cuenta y se etiqueta.\n- **Meta:** practicar `isna().sum()` y la etiqueta `violates`/`ok` dentro de `revisar(df)`.\n- **Éxito:** `1 violates` para el primer lote y `0 ok` para el segundo, que no trae nulls.\n- **Límites:** no imputes antes de contar; no uses `notna` para ausencias.",
        instruction: "1. Abre el starter: `revisar` cuenta con `notna` y siempre devuelve `ok` (DEFECT).\n2. Cambia el conteo a `isna().sum()` sobre `id`.\n3. Devuelve `violates` si `n > 0`; si no, `ok`.\n4. Ejecuta: los dos lotes deben dar etiquetas distintas.",
        hint: "n = isna().sum(); etiqueta violates si n>0. notna cuenta valores presentes, no ausencias.",
        hints: ["Primero n = int(df['id'].isna().sum()) — isna, no notna.", "return n, ('violates' if n > 0 else 'ok')"],
        edgeCases: ["contar filas", "fillna antes", "usar notna para ausencias"],
        tests: "lote con un id nulo → '1 violates'; lote sin nulls → '0 ok'",
        feedback: "`notna` cuenta presentes; `isna` cuenta ausencias. Required con null ⇒ `violates`, no `ok`. Si los dos lotes dan la misma etiqueta, la etiqueta no depende del conteo. Contar mal invierte la señal del gate y aprueba filas rotas ante el auditor del run.",
        retrospective: "El primer paso del gate es **medir** ausencia required, no rellenar. El error clásico es confiar en `notna` o en fillna antes del conteo. Pregunta: con el fixture, ¿por qué `n` debe ser 1 y no 2? Siguiente (E2): armar el mapa solo con campos required.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · nulls en required + etiqueta de violación
# Pista: cuenta con isna (no notna) y etiqueta violates si n > 0
import pandas as pd

def revisar(df):
    n = int(df["id"].notna().sum())
    return n, "ok"

print(*revisar(pd.DataFrame({"id": ["C001", None, "C003"]})))
print(*revisar(pd.DataFrame({"id": ["C001", "C002"]})))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def revisar(df):
    n = int(df["id"].isna().sum())
    return n, "violates" if n > 0 else "ok"

print(*revisar(pd.DataFrame({"id": ["C001", None, "C003"]})))
print(*revisar(pd.DataFrame({"id": ["C001", "C002"]})))`,
          output: `1 violates
0 ok`,
        },
      },
      {
        id: "S16-T1-A-E2",
        subtopicId: "S16-T1-A",
        kind: "independent",
        title: "Mapa de violaciones solo required",
        preamble: "- **Contexto:** el reporte del run debe listar **solo** campos required con null; los optional van a métricas aparte.\n- **Meta:** construir el dict de `violaciones(df)` filtrando la `policy`.\n- **Éxito:** `{'a': 1}` para el primer lote y `{}` para el segundo, donde `a` no tiene nulls.\n- **Límites:** no incluyas n=0 ni campos optional aunque tengan nulls.",
        instruction: "1. Ejecuta el starter y compara con la meta: el mapa nombra un campo que no debería (DEFECT).\n2. Decide qué política entra al mapa y corrige el filtro de la comprensión.\n3. El valor del dict es el conteo entero de nulls; un campo sin nulls no entra.\n4. Imprime los dos mapas.",
        hint: "Itera policy e incluye solo required con n>0.",
        hints: ["Itera policy e incluye solo p == 'required'.", "Excluye opcionales aunque tengan nulls."],
        edgeCases: ["incluir optional", "n=0"],
        tests: "lote con null en a → {'a': 1}; lote sin null en a → {}",
        feedback: "Si el mapa incluye `b` (optional), filtraste mal la policy. Si el segundo lote no da `{}`, entró un campo sin nulls. Solo required con n>0 entra a violaciones; mezclar optional diluye el fail ante el auditor.",
        retrospective: "El mapa de violaciones es el contrato legible del gate: solo required con n>0. Mezclar optional diluye el fail y confunde al auditor. Pregunta: ¿por qué `b` no entra al dict aunque tenga null? Luego (E3) conviertes el mapa en decisión `pass`/`fail`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · mapa de violaciones required
import pandas as pd
policy = {"a": "required", "b": "optional"}

def violaciones(df):
    return {c: int(df[c].isna().sum()) for c, p in policy.items() if p == "optional" and df[c].isna().any()}

print(violaciones(pd.DataFrame({"a": [1, None], "b": [None, 2]})))
print(violaciones(pd.DataFrame({"a": [1, 3], "b": [None, 2]})))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
policy = {"a": "required", "b": "optional"}

def violaciones(df):
    return {c: int(df[c].isna().sum()) for c, p in policy.items() if p == "required" and df[c].isna().any()}

print(violaciones(pd.DataFrame({"a": [1, None], "b": [None, 2]})))
print(violaciones(pd.DataFrame({"a": [1, 3], "b": [None, 2]})))`,
          output: `{'a': 1}
{}`,
        },
      },
      {
        id: "S16-T1-A-E3",
        subtopicId: "S16-T1-A",
        kind: "transfer",
        title: "Gate pass/fail desde violaciones required",
        preamble: "- **Contexto:** el job no debe imprimir `pass` si el contrato required se rompe; eso es el anti-patrón del gate silencioso.\n- **Meta:** decidir `fail` o `pass` en `gate(df)` a partir de violaciones reales de `id`.\n- **Éxito:** `fail` para el lote con id nulo y `pass` para el lote completo.\n- **Límites:** no rellenes nulls para forzar pass; no dejes `viol` vacío a ciegas.",
        instruction: "1. El starter devuelve `pass` porque `viol` queda vacío sin medir.\n2. Llena `viol` desde `isna` del campo required.\n3. Devuelve `fail` si hay violaciones; si no, `pass`.\n4. Una sola palabra por lote.",
        hint: "Construye viol desde isna de id; imprime fail si viol no vacío.",
        hints: ["n = int(df['id'].isna().sum()); viol = {'id': n} if n else {}.", "return 'fail' if viol else 'pass'."],
        edgeCases: ["siempre pass", "ignorar null"],
        tests: "lote con id nulo → 'fail'; lote sin nulls → 'pass'",
        feedback: "Si imprimiste `pass` con id nulo, el gate no es fail-closed: llena `viol` desde `isna` antes de decidir. Si los dos lotes dan `fail`, el gate falla sin medir. Un pass ciego es mentira operativa.",
        retrospective: "Fail-closed = el gate publica el fallo en lugar de maquillar datos. Si `viol` no se llena, el pass es mentira operativa. Pregunta: si el segundo lote también diera `fail`, ¿qué error tendría tu gate? Cierra T1-A: conteo → mapa → decisión. En T1-B practicarás imputar solo lo permitido.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · gate pass/fail por required
# Pista: no imprimas pass a ciegas; llena viol desde isna
import pandas as pd

def gate(df):
    viol = {}
    return "pass" if not viol else "fail"

print(gate(pd.DataFrame({"id": [None]})))
print(gate(pd.DataFrame({"id": ["C001"]})))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def gate(df):
    n = int(df["id"].isna().sum())
    viol = {"id": n} if n else {}
    return "fail" if viol else "pass"

print(gate(pd.DataFrame({"id": [None]})))
print(gate(pd.DataFrame({"id": ["C001"]})))`,
          output: `fail
pass`,
        },
      },
      {
        id: "S16-T1-B-E1",
        subtopicId: "S16-T1-B",
        kind: "guided",
        title: "Marcar was_null antes de imputar",
        preamble: "- **Contexto:** `descuento` es optional y se puede imputar, pero el auditor del gate debe ver qué filas se tocaron; si rellenas primero, `isna()` ya no ve nulls.\n- **Meta:** crear `was_null` **antes** de `fillna` dentro de `marcar(valores)`.\n- **Éxito:** `[False, True]` y `[True, False, True]`, alineados a las filas de cada lote.\n- **Límites:** no crees el indicador después del fill; no uses abs ni drop.",
        instruction: "1. El starter hace `fillna` y luego `isna` (DEFECT).\n2. Asigna `was_null = descuento.isna()` primero.\n3. Luego rellena con la mediana de los no-nulos.\n4. Devuelve solo `was_null.tolist()`.",
        hint: "Marca was_null = isna() ANTES del fillna.",
        hints: ["df['was_null'] = df['descuento'].isna() antes de rellenar.", "Luego fillna(df['descuento'].median()) y devuelve was_null.tolist()."],
        edgeCases: ["indicador después de fill", "perder señal"],
        tests: "[1.0, None] → [False, True]; [None, 2.0, None] → [True, False, True]",
        feedback: "Si `was_null` es todo False, creaste el indicador después del fillna. Marca `isna()` primero; luego rellena. El orden es parte del contrato de evidencia. El relleno es la mediana porque `descuento` es optional: un `monto` required no se imputa, va a cuarentena.",
        retrospective: "El orden es parte del contrato de evidencia: medir ausencia → transformar → publicar. Si el indicador queda todo False, no es un “bug de pandas”: es evidencia inventada. Pregunta: ¿por qué el auditor necesita `was_null` además del monto ya rellenado? Siguiente (E2): el cap decide si se permite imputar.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · indicador was_null antes de imputar
# Pista: si fillna va primero, isna() ya no ve nulls
import pandas as pd

def marcar(valores):
    df = pd.DataFrame({"descuento": valores})
    df["descuento"] = df["descuento"].fillna(df["descuento"].median())
    df["was_null"] = df["descuento"].isna()
    return df["was_null"].tolist()

print(marcar([1.0, None]))
print(marcar([None, 2.0, None]))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def marcar(valores):
    df = pd.DataFrame({"descuento": valores})
    df["was_null"] = df["descuento"].isna()
    df["descuento"] = df["descuento"].fillna(df["descuento"].median())
    return df["was_null"].tolist()

print(marcar([1.0, None]))
print(marcar([None, 2.0, None]))`,
          output: `[False, True]
[True, False, True]`,
        },
      },
      {
        id: "S16-T1-B-E2",
        subtopicId: "S16-T1-B",
        kind: "independent",
        title: "Bloquear imputación si null_rate supera cap",
        preamble: "- **Contexto:** si la mitad de los descuentos vienen vacíos, imputar “para que el KPI no falle” envenena el ticket promedio.\n- **Meta:** comparar `null_rate` con el cap 0.25 y decidir `blocked`/`ok` en `estado(s)`. El cap es inclusivo.\n- **Éxito:** `blocked` con rate 0.5 y `ok` con rate 0.25, igual al cap.\n- **Límites:** no imputes si está bloqueado; no inviertas la comparación del umbral.",
        instruction: "1. Calcula `rate = isna().mean()` sobre la serie de cada lote.\n2. El starter bloquea cuando rate es bajo (DEFECT).\n3. Corrige: `blocked` si `rate > cap`; con rate igual al cap, `ok`.\n4. Imprime solo la etiqueta de cada lote.",
        hint: "rate = isna().mean(); bloquea si rate > cap.",
        hints: ["rate = s.isna().mean().", "return 'blocked' if rate > cap else 'ok' — con > y no con >=."],
        edgeCases: ["cap inclusivo confuso", "contar no rate"],
        tests: "rate 0.5 → 'blocked'; rate 0.25, igual al cap → 'ok'",
        feedback: "Si el primer lote dio `ok`, invertiste el umbral: con rate 0.5 > 0.25 el gate bloquea la imputación. Si el segundo dio `blocked`, usaste `>=`: con rate igual al cap el contrato permite imputar. Rate alto no se “arregla” rellenando en silencio.",
        retrospective: "El cap es un freno de negocio, no un detalle de pandas. Rate alto ⇒ no rellenar en silencio. Pregunta: con rate=0.25 y cap 0.25, ¿qué etiqueta imprime el gate y por qué? Luego (E3) practicarás mediana estable cuando sí se permite imputar.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · cap de null_rate
# Pista: el umbral bloquea cuando rate es ALTO; con rate igual al cap se permite imputar
import pandas as pd
cap = 0.25

def estado(s):
    rate = s.isna().mean()
    return "blocked" if rate < cap else "ok"

print(estado(pd.Series([1.0, None, None, 2.0])))
print(estado(pd.Series([1.0, None, 2.0, 3.0])))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
cap = 0.25

def estado(s):
    rate = s.isna().mean()
    return "blocked" if rate > cap else "ok"

print(estado(pd.Series([1.0, None, None, 2.0])))
print(estado(pd.Series([1.0, None, 2.0, 3.0])))`,
          output: `blocked
ok`,
        },
      },
      {
        id: "S16-T1-B-E3",
        subtopicId: "S16-T1-B",
        kind: "transfer",
        title: "Imputar mediana de no-nulos (no cero)",
        preamble: "- **Contexto:** con cap respetado, el relleno permitido de un `descuento` optional no es `0` (un cero de negocio falso).\n- **Meta:** calcular la mediana skipna y `fillna` con ese valor dentro de `rellenar(s)`.\n- **Éxito:** `2.0 [1.0, 2.0, 9.0, 2.0]` y `20.0 [20.0, 10.0, 20.0, 90.0]`.\n- **Límites:** no rellenes con 0 ni con la media: en estos lotes un valor alto aleja la media de la mediana.",
        instruction: "1. El starter fija `med = 0.0` y `fillna(0.0)` (DEFECT).\n2. Calcula `med = s.median()` (ignora NaN).\n3. Rellena con `med`.\n4. Devuelve `float(med)` y la lista final de cada lote.",
        hint: "med = s.median() (skipna por defecto); fillna(med).",
        hints: ["median() ignora NaN por defecto.", "return float(med), s.fillna(med).tolist()."],
        edgeCases: ["mean vs. median", "fillna 0"],
        tests: "[1.0, 2.0, 9.0, None] → 2.0; [None, 10.0, 20.0, 90.0] → 20.0 (la media daría 4.0 y 40.0)",
        feedback: "`fillna(0)` inventa un cero de negocio y sesga KPIs. Si obtuviste 4.0 y 40.0, usaste la media: el valor alto de cada lote la arrastra hacia arriba. Usa `median()` de no-nulos (skipna) y rellena con esa mediana pre-fill; no recalcules la mediana después del fill para maquillar el reporte.",
        retrospective: "Mediana pre-fill es la regla documentada del gate cuando el cap lo permite. Rellenar con 0 inventa volumen y sesga KPIs. Cierra T1-B: indicador → cap → relleno justificado. En T2-A clasificarás filas, no solo celdas.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · imputación por mediana
# Pista: no uses 0 ni la media; calcula la mediana de los no-nulos
import pandas as pd

def rellenar(s):
    med = 0.0
    return float(med), s.fillna(0.0).tolist()

print(*rellenar(pd.Series([1.0, 2.0, 9.0, None])))
print(*rellenar(pd.Series([None, 10.0, 20.0, 90.0])))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def rellenar(s):
    med = s.median()
    return float(med), s.fillna(med).tolist()

print(*rellenar(pd.Series([1.0, 2.0, 9.0, None])))
print(*rellenar(pd.Series([None, 10.0, 20.0, 90.0])))`,
          output: `2.0 [1.0, 2.0, 9.0, 2.0]
20.0 [20.0, 10.0, 20.0, 90.0]`,
        },
      },
      {
        id: "S16-T2-A-E1",
        subtopicId: "S16-T2-A",
        kind: "guided",
        title: "Contar filas de duplicado exacto (keep=False)",
        preamble: "- **Contexto:** para cuarentena o log, necesitas **todas** las copias del grupo exacto, no solo “la segunda”.\n- **Meta:** contar filas con `duplicated(keep=False)` en `filas_exactas(df)`.\n- **Éxito:** `2` para el primer lote y `3` para el segundo, que trae tres copias.\n- **Límites:** no uses `drop` aún; no dejes el default de `keep`.",
        instruction: "1. El starter usa `duplicated()` sin `keep=False` (DEFECT).\n2. Marca todas las copias del grupo exacto.\n3. Suma la máscara y devuelve el entero.\n4. No modifiques el DataFrame.",
        hint: "duplicated(keep=False) marca TODAS las copias, no solo la segunda.",
        hints: ["duplicated(keep=False).sum() cuenta todas las filas del grupo duplicado.", "El default es keep='first': no marca la primera aparición, así que cuenta una fila menos por grupo."],
        edgeCases: ["keep='first' cuenta 1", "solo subset cols"],
        tests: "dos copias → 2; tres copias → 3 (el default daría 1 y 2)",
        feedback: "Si contaste 1 y 2, usaste el default de `duplicated`, que es `keep='first'` y no marca la primera aparición. `keep=False` marca todas las copias del grupo; el default sirve para elegir qué copia sobra, no para inventariar la cuarentena.",
        retrospective: "`keep=False` es la máscara de **evidencia** del grupo; el default de `duplicated` sirve para drop, no para inventariar cuarentena. Contar 1 cuando hay 2 filas idénticas subestima el rastro. Pregunta: ¿cuántas filas debe ver el auditor del grupo exacto? Siguiente (E2): conflictos multi-región.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · filas exactas duplicadas
# Pista: keep=False incluye todas las copias; el default no
import pandas as pd

def filas_exactas(df):
    return int(df.duplicated().sum())

print(filas_exactas(pd.DataFrame({"a": [1, 1, 2], "b": [0, 0, 9]})))
print(filas_exactas(pd.DataFrame({"a": [1, 1, 1, 2], "b": [0, 0, 0, 5]})))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def filas_exactas(df):
    return int(df.duplicated(keep=False).sum())

print(filas_exactas(pd.DataFrame({"a": [1, 1, 2], "b": [0, 0, 9]})))
print(filas_exactas(pd.DataFrame({"a": [1, 1, 1, 2], "b": [0, 0, 0, 5]})))`,
          output: `2
3`,
        },
      },
      {
        id: "S16-T2-A-E2",
        subtopicId: "S16-T2-A",
        kind: "independent",
        title: "Listar cliente_id con conflicto de región",
        preamble: "- **Contexto:** misma clave con regiones distintas no es “duplicado exacto”; es conflicto que envenena el maestro.\n- **Meta:** en `conflictos(df)`, crear `regiones`, el conteo de regiones distintas por `cliente_id`, y devolver las claves cuyo conteo sea mayor que 1.\n- **Éxito:** `['C001']` para el primer lote y `['C005']` para el segundo.\n- **Límites:** no uses solo `duplicated` de filas completas; no inviertas el umbral de nunique.",
        instruction: "1. Agrupa por `cliente_id` y guarda en `regiones` el nunique de `region`.\n2. Ejecuta el starter: devuelve claves que no tienen conflicto (DEFECT).\n3. Corrige el filtro y devuelve el índice como lista.\n4. Sin drop ni fill.",
        hint: "`regiones` guarda el conteo de `region` por `cliente_id`; filtra valores mayores que 1.",
        hints: ["regiones = df.groupby('cliente_id')['region'].nunique()", "print(regiones[regiones > 1].index.tolist())"],
        edgeCases: ["duplicated exacto solo", "filter mal"],
        tests: "primer lote → ['C001']; segundo lote → ['C005']",
        feedback: "Si obtuviste `['C002']` y `['C004']`, filtraste `nunique == 1`: esas son las claves limpias. En `regiones`, los valores son conteos y las claves están en el índice; conflicto es un conteo mayor que 1.",
        retrospective: "Conflicto = misma clave, atributos distintos. Listar limpios no es listar problemas del maestro. Pregunta: ¿por qué C002 no debe aparecer en la lista de conflicto del primer lote? Luego (E3) etiquetas exact / conflict / clean por clave.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · conflictos multi-región
import pandas as pd

def conflictos(df):
    regiones = df.groupby("cliente_id")["region"].nunique()
    return regiones[regiones == 1].index.tolist()

print(conflictos(pd.DataFrame({"cliente_id": ["C001", "C001", "C002"], "region": ["Lima", "Cusco", "Lima"]})))
print(conflictos(pd.DataFrame({"cliente_id": ["C004", "C005", "C005"], "region": ["Ica", "Puno", "Ica"]})))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def conflictos(df):
    regiones = df.groupby("cliente_id")["region"].nunique()
    return regiones[regiones > 1].index.tolist()

print(conflictos(pd.DataFrame({"cliente_id": ["C001", "C001", "C002"], "region": ["Lima", "Cusco", "Lima"]})))
print(conflictos(pd.DataFrame({"cliente_id": ["C004", "C005", "C005"], "region": ["Ica", "Puno", "Ica"]})))`,
          output: `['C001']
['C005']`,
        },
      },
      {
        id: "S16-T2-A-E3",
        subtopicId: "S16-T2-A",
        kind: "transfer",
        title: "Clasificar exact, conflict o clean",
        preamble: "- **Contexto:** el runbook del gate elige acción **después** de clasificar; devolver `clean` sin mirar es el anti-patrón.\n- **Meta:** para cada clave del fixture, `clasificar(key)` devuelve `exact`, `conflict` o `clean`.\n- **Éxito:** `['conflict', 'exact', 'conflict', 'clean', 'conflict']`.\n- **Límites:** clasifica antes de borrar; no asumas clean; mira la fila entera, no solo la región.",
        instruction: "1. Filtra las filas de la clave.\n2. Si hay una sola fila → `clean`.\n3. Si todas las filas son copias de una sola versión → `exact`. C005 trae dos copias de Lima y dos de Cusco: son dos versiones.\n4. Si la clave se repite y alguna fila difiere en cualquier columna → `conflict`. C003 difiere solo en `score`.",
        hint: "Una fila → clean; copias exactas → exact; clave repetida con cualquier diferencia → conflict.",
        hints: ["sub = df[df.cliente_id == key]; si len(sub) == 1, devuelve clean.", "Si len(sub.drop_duplicates()) == 1, hay una sola versión y devuelves exact; si no, conflict, aunque la región coincida."],
        edgeCases: ["orden de if", "sin filtrar id", "mirar solo la región", "dos versiones, cada una repetida"],
        tests: "C001 → conflict (región), C002 → exact, C003 → conflict (solo score), C004 → clean, C005 → conflict (dos versiones, cada una repetida)",
        feedback: "C003 tiene la misma región y otro score: es conflicto, porque una clave repetida que no es copia exacta no puede ir al conjunto limpio. Si mirabas solo la región, la clasificaste como `clean`. C002 es `exact`: sus dos filas son idénticas. Si C005 te dio `exact`, preguntaste si cada fila tiene una copia. La pregunta correcta es cuántas versiones distintas hay. Clasifica antes de borrar; no asumas clean a ciegas.",
        retrospective: "El orden clasificar→actuar evita borrar el rastro del conflicto. Una clave repetida con cualquier diferencia nunca es `clean`. Pregunta: si `score` es idéntico pero `region` difiere, ¿es exact o conflict? Cierra T2-A. En T2-B partirás clean vs. quarantine con evidencia.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · exact vs. conflict vs. clean
# Pista: clasifica mirando las filas de cada clave; no devuelvas clean a ciegas
import pandas as pd
df = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002", "C002", "C003", "C003", "C004", "C005", "C005", "C005", "C005"],
    "region": ["Lima", "Cusco", "Ica", "Ica", "Puno", "Puno", "Ica", "Lima", "Lima", "Cusco", "Cusco"],
    "score": [1.0, 1.0, 0.5, 0.5, 0.5, 0.8, 0.7, 0.6, 0.6, 0.6, 0.6],
})

def clasificar(key):
    return "clean"

print([clasificar(k) for k in ["C001", "C002", "C003", "C004", "C005"]])`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({
    "cliente_id": ["C001", "C001", "C002", "C002", "C003", "C003", "C004", "C005", "C005", "C005", "C005"],
    "region": ["Lima", "Cusco", "Ica", "Ica", "Puno", "Puno", "Ica", "Lima", "Lima", "Cusco", "Cusco"],
    "score": [1.0, 1.0, 0.5, 0.5, 0.5, 0.8, 0.7, 0.6, 0.6, 0.6, 0.6],
})

def clasificar(key):
    sub = df[df.cliente_id == key]
    if len(sub) == 1:
        return "clean"
    if len(sub.drop_duplicates()) == 1:
        return "exact"
    return "conflict"

print([clasificar(k) for k in ["C001", "C002", "C003", "C004", "C005"]])`,
          output: `['conflict', 'exact', 'conflict', 'clean', 'conflict']`,
        },
      },
      {
        id: "S16-T2-B-E1",
        subtopicId: "S16-T2-B",
        kind: "guided",
        title: "Separar quarantine y clean por clave",
        preamble: "- **Contexto:** una clave repetida con valores distintos es un conflicto: todas sus filas van a cuarentena y el resto queda en clean. Cada fila queda en un solo conjunto.\n- **Meta:** en `separar(df)`, devolver `len(q)`, `len(c)` y si la partición cuadra con `len(df)`.\n- **Éxito:** `2 1 True` para el primer lote y `3 2 True` para el segundo.\n- **Límites:** ninguna fila en los dos conjuntos; no armes clean con `drop_duplicates`. Estos lotes no traen copias exactas.",
        instruction: "1. El starter devuelve `0` para la cuarentena y arma clean con `keep=\"last\"` (DEFECT).\n2. Arma la máscara `duplicated(\"id\", keep=False)`.\n3. `q` son las filas de la máscara y `c` las demás (`~máscara`).\n4. Devuelve `len(q)`, `len(c)` y `len(q) + len(c) == len(df)`.",
        hint: "Una sola máscara: q = df[mask]; c = df[~mask].",
        hints: ["mask = df.duplicated('id', keep=False) marca todas las filas de una clave repetida.", "q = df[mask]; c = df[~mask]; la suma de los dos largos es len(df)."],
        edgeCases: ["perder q", "una fila en los dos conjuntos", "keep last sin documentar"],
        tests: "[a, a, b] → 2 1 True; [a, b, b, b, c] → 3 2 True",
        feedback: "Si clean tiene 2 filas en el primer lote, la armaste con `drop_duplicates` y una fila de `a` quedó en los dos conjuntos: la suma ya no da `len(df)`. Si la cuarentena da `0`, no armaste la máscara `duplicated(..., keep=False)`. Separa `q` y `c` con la misma máscara.",
        retrospective: "Quarantine completa + clean sin solapamiento es el split auditable: `rows_in == rows_clean + rows_quarantine`. Contar 0 en `q` es mentir al auditor. Pregunta: ¿qué haría falta para que una fila de `a` pase a clean? Siguiente (E2): conservar columnas de evidencia, no solo la clave.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · split quarantine / clean
# Pista: cada fila va a un solo conjunto; una clave en conflicto no deja filas en clean
import pandas as pd

def separar(df):
    c = df.drop_duplicates("id", keep="last")
    return 0, len(c), len(c) == len(df)

print(*separar(pd.DataFrame({"id": ["a", "a", "b"], "v": [1, 2, 3]})))
print(*separar(pd.DataFrame({"id": ["a", "b", "b", "b", "c"], "v": [1, 2, 3, 4, 5]})))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def separar(df):
    mask = df.duplicated("id", keep=False)
    q = df[mask]
    c = df[~mask]
    return len(q), len(c), len(q) + len(c) == len(df)

print(*separar(pd.DataFrame({"id": ["a", "a", "b"], "v": [1, 2, 3]})))
print(*separar(pd.DataFrame({"id": ["a", "b", "b", "b", "c"], "v": [1, 2, 3, 4, 5]})))`,
          output: `2 1 True
3 2 True`,
        },
      },
      {
        id: "S16-T2-B-E2",
        subtopicId: "S16-T2-B",
        kind: "independent",
        title: "Conservar columnas de evidencia en cuarentena",
        preamble: "- **Contexto:** sin `batch` (u origen), el auditor no reconstruye de dónde vino cada versión de la clave.\n- **Meta:** `cuarentena(df)` devuelve **todas** las columnas de las filas en conflicto.\n- **Éxito:** `['id', 'batch']` para el primer lote y `['id', 'src', 'score']` para el segundo.\n- **Límites:** no dropees columnas de evidencia.",
        instruction: "1. Ejecuta el starter: la cuarentena pierde columnas (DEFECT).\n2. Filtra las filas con `keep=False` y `copy()`.\n3. Devuelve la fila completa, sin subseleccionar columnas.\n4. Imprime `columns.tolist()` de cada lote.",
        hint: "Filtra dups con mask y copy(); no dropear cols de evidencia.",
        hints: ["q = df[df.duplicated('id', keep=False)].copy() — sin seleccionar solo ['id'].", "print(q.columns.tolist()) debe incluir batch, no solo id."],
        edgeCases: ["solo id", "sin batch", "imprimir columnas del df sin filtrar dups"],
        tests: "lote con batch → ['id', 'batch']; lote con src y score → ['id', 'src', 'score']",
        feedback: "Si imprimiste solo `['id']`, perdiste la evidencia de `batch`, `src` y `score`. La cuarentena es la fila completa: sin origen no hay reconstrucción auditable de por qué una persona eligió una versión de la clave.",
        retrospective: "Evidencia = fila completa del conflicto/dup. Proyectar solo la clave convierte la cuarentena en un id inútil. Luego (E3) chequearás si el clean puede ser 1:1 para S17.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · columnas de evidencia en cuarentena
import pandas as pd

def cuarentena(df):
    return df[df.duplicated("id", keep=False)][["id"]].copy()

print(cuarentena(pd.DataFrame({"id": ["a", "a"], "batch": ["b1", "b2"]})).columns.tolist())
print(cuarentena(pd.DataFrame({"id": ["x", "x", "y"], "src": ["a", "b", "a"], "score": [0.9, 0.4, 0.7]})).columns.tolist())`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def cuarentena(df):
    return df[df.duplicated("id", keep=False)].copy()

print(cuarentena(pd.DataFrame({"id": ["a", "a"], "batch": ["b1", "b2"]})).columns.tolist())
print(cuarentena(pd.DataFrame({"id": ["x", "x", "y"], "src": ["a", "b", "a"], "score": [0.9, 0.4, 0.7]})).columns.tolist())`,
          output: `['id', 'batch']
['id', 'src', 'score']`,
        },
      },
      {
        id: "S16-T2-B-E3",
        subtopicId: "S16-T2-B",
        kind: "transfer",
        title: "Validar cardinalidad 1:1 por id",
        preamble: "- **Contexto:** S17 hará joins asumiendo una fila por cliente; si el clean tiene clave duplicada, el join miente.\n- **Meta:** en `cardinalidad(df)`, comparar `nunique(id)` con `len(df)`.\n- **Éxito:** `card_bad` para el lote con id repetido y `card_ok` para el lote sin repetidos.\n- **Límites:** no asumas card_ok; no compares con nunique de todas las columnas.",
        instruction: "1. El starter devuelve `card_ok` sin medir (DEFECT).\n2. Si cada id aparece una vez → `card_ok`; si no → `card_bad`.\n3. Imprime una etiqueta por lote.\n4. No dropees filas en este ejercicio.",
        hint: "Compara nunique de id con len(df); no asumas card_ok.",
        hints: ["card_ok solo si cada id aparece una vez.", "return 'card_ok' if df['id'].nunique() == len(df) else 'card_bad'."],
        edgeCases: ["nunique dropna", "comparar con nunique cols"],
        tests: "id repetido → 'card_bad'; ids únicos → 'card_ok'",
        feedback: "Con id duplicado la cardinalidad 1:1 falla: el primer lote es `card_bad`. El segundo debe dar `card_ok`; si da lo mismo que el primero, la etiqueta no depende de los datos. Asumir ok a ciegas es el mismo anti-patrón que `pass` sin medir.",
        retrospective: "Cardinalidad 1:1 es un contrato del clean hacia S17, no un detalle cosmético. `card_ok` a ciegas es el mismo anti-patrón que `pass` sin medir. Pregunta: si `nunique(id) < len(df)`, ¿qué le pasa a un join one-to-one en S17? Cierra T2. En T3-A normalizarás sin borrar el raw.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · cardinalidad 1:1 por id
# Pista: mide; no devuelvas card_ok a ciegas
import pandas as pd

def cardinalidad(df):
    return "card_ok"

print(cardinalidad(pd.DataFrame({"id": ["a", "a"], "v": [1, 2]})))
print(cardinalidad(pd.DataFrame({"id": ["a", "b"], "v": [1, 2]})))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def cardinalidad(df):
    return "card_ok" if df["id"].nunique() == len(df) else "card_bad"

print(cardinalidad(pd.DataFrame({"id": ["a", "a"], "v": [1, 2]})))
print(cardinalidad(pd.DataFrame({"id": ["a", "b"], "v": [1, 2]})))`,
          output: `card_bad
card_ok`,
        },
      },
      {
        id: "S16-T3-A-E1",
        subtopicId: "S16-T3-A",
        kind: "guided",
        title: "Normalizar región con strip y title",
        preamble: "- **Contexto:** sin normalizar, ` lima ` y `Lima` cuentan como regiones distintas. Eso divide una región en varios conteos y puede crear un conflicto falso en la comprobación de T2-A.\n- **Meta:** aplicar `strip` + `title` a la Series en `canon(s)`.\n- **Éxito:** `['Lima', 'Cusco']` y `['Puno', 'Ica']`.\n- **Límites:** no uses solo lower; aquí solo trabajas la Series, sin columna raw.",
        instruction: "1. El starter solo hace strip (DEFECT).\n2. Encadena `.str.title()` tras strip.\n3. Devuelve `.tolist()`.\n4. Sin replace manual de cada ciudad.",
        hint: "str.strip().str.title() en cadena.",
        hints: ["s.str.strip().str.title().tolist()", "Solo strip no capitaliza CUSCO → Cusco."],
        edgeCases: ["solo lower", "sin strip"],
        tests: "[' lima ', 'CUSCO'] → ['Lima', 'Cusco']; ['puno', '  ICA '] → ['Puno', 'Ica']",
        feedback: "Si quedó `CUSCO` o con espacios, faltó `title` o `strip`. Encadena `.str.strip().str.title()` sobre la Series; usar solo `strip` hace que un conteo por región trate mayúsculas distintas como valores distintos.",
        retrospective: "Canonicidad de strings es el primer filtro antes de mapas de sinónimos (`LIM`→Lima). Usar solo `strip` deja `CUSCO` ruidoso, divide una región en varios conteos y también altera la comprobación de conflictos de T2-A. Si una misma ciudad llega en minúsculas, mayúsculas y con espacios, ¿cuántas regiones distintas quedan después de aplicar ambas operaciones? Siguiente (E2): locale de montos PEN.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · strip + title
# Pista: después de strip aplica title
import pandas as pd

def canon(s):
    return s.str.strip().tolist()

print(canon(pd.Series([" lima ", "CUSCO"])))
print(canon(pd.Series(["puno", "  ICA "])))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def canon(s):
    return s.str.strip().str.title().tolist()

print(canon(pd.Series([" lima ", "CUSCO"])))
print(canon(pd.Series(["puno", "  ICA "])))`,
          output: `['Lima', 'Cusco']
['Puno', 'Ica']`,
        },
      },
      {
        id: "S16-T3-A-E2",
        subtopicId: "S16-T3-A",
        kind: "independent",
        title: "Parsear montos PEN con decimal latino",
        preamble: "- **Contexto:** en un batch sintético PEN, `3,00` es tres soles, no trescientos; borrar la coma a ciegas infla el ticket promedio.\n- **Meta:** quitar `S/` y tratar **solo coma** como separador decimal; sumar cada lote.\n- **Éxito:** `4.5` (1.5 + 3.0) y `2.75` (0.75 + 2.0).\n- **Límites:** no uses `replace(',', '')` como miles por defecto; no dejes el prefijo `S/`.",
        instruction: "1. Revisa `norm_money` del starter: borra comas (DEFECT).\n2. Si hay coma y no hay punto, reemplaza coma por punto.\n3. Convierte a float y suma cada serie.\n4. Imprime un float por lote.",
        hint: "Quita S/; si hay coma sin punto de miles, reemplaza coma por punto antes del float.",
        hints: ["Contrato: solo coma ⇒ separador decimal (3,00 → 3.0).", "print(float(serie.map(norm_money).sum()))"],
        edgeCases: ["borrar coma como miles", "dejar S/", "tratar 3,00 como 300"],
        tests: "['S/1.5', '3,00'] → 4.5; ['0,75', 'S/2'] → 2.75",
        feedback: "Si obtuviste 301.5 y 77.0, borraste la coma como miles. Con solo coma, `3,00` es decimal → 3.0 y `0,75` → 0.75. Locale documentado evita bugs silenciosos de negocio.",
        retrospective: "Locale documentado es parte del contrato del gate, no un “detalle de formato”. `3,00` → 300 es un bug de negocio silencioso que infla el ticket promedio. Pregunta: con solo coma, ¿decimal latino o miles? Luego (E3) conservarás el raw al crear la columna canónica.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · montos PEN con coma decimal
# Pista: borrar la coma a ciegas convierte 3,00 en 300 (error de locale)
import pandas as pd

def norm_money(x):
    s = str(x).strip().replace("S/", "").replace(",", "")
    return float(s)

print(float(pd.Series(["S/1.5", "3,00"]).map(norm_money).sum()))
print(float(pd.Series(["0,75", "S/2"]).map(norm_money).sum()))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def norm_money(x):
    s = str(x).strip().replace("S/", "").strip()
    # Solo coma → decimal; no borrar dígitos
    if "," in s and "." not in s:
        s = s.replace(",", ".")
    return float(s)

print(float(pd.Series(["S/1.5", "3,00"]).map(norm_money).sum()))
print(float(pd.Series(["0,75", "S/2"]).map(norm_money).sum()))`,
          output: `4.5
2.75`,
        },
      },
      {
        id: "S16-T3-A-E3",
        subtopicId: "S16-T3-A",
        kind: "transfer",
        title: "Crear region canónica sin pisar el raw",
        preamble: "- **Contexto:** si normalizas **en** `region_raw`, pierdes el valor original y no puedes defender el transform ante auditoría.\n- **Meta:** en `canonizar(df)`, escribir el canónico en `region` y dejar `region_raw` intacto.\n- **Éxito:** `['lima'] ['Lima']` y `['puno', 'ica'] ['Puno', 'Ica']`.\n- **Límites:** no dropees el raw; no sobreescribas la columna original.",
        instruction: "1. El starter asigna title sobre `region_raw` (DEFECT).\n2. Crea `df[\"region\"]` desde el raw.\n3. Devuelve raw y luego canónica.\n4. Comprueba que el raw sigue en minúsculas en los dos lotes.",
        hint: "Nueva col region; no pises region_raw.",
        hints: ["df['region'] = df['region_raw'].str.title() — columna nueva, no overwrite.", "return df['region_raw'].tolist(), df['region'].tolist()."],
        edgeCases: ["overwrite raw", "drop raw"],
        tests: "['lima'] → ['lima'] ['Lima']; ['puno', 'ica'] → ['puno', 'ica'] ['Puno', 'Ica']",
        feedback: "Si `region_raw` quedó en Title Case, lo pisaste. Escribe en `region` y deja el raw intacto: sin original no hay disputa auditable del transform.",
        retrospective: "Raw al lado = transform disputable. Pisar el original es normalizar de forma no auditable. Pregunta: si solo queda `region` en Title Case, ¿puedes defender el valor de entrada ante auditoría? Cierra T3-A. En T3-B clasificarás outliers sin borrar colas legítimas.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · conservar region_raw
# Pista: escribe en una columna nueva, no pises el raw
import pandas as pd

def canonizar(df):
    df = df.copy()
    df["region_raw"] = df["region_raw"].str.title()
    return df["region_raw"].tolist(), df.get("region", pd.Series([], dtype=str)).tolist()

print(*canonizar(pd.DataFrame({"region_raw": ["lima"]})))
print(*canonizar(pd.DataFrame({"region_raw": ["puno", "ica"]})))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def canonizar(df):
    df = df.copy()
    df["region"] = df["region_raw"].str.title()
    return df["region_raw"].tolist(), df["region"].tolist()

print(*canonizar(pd.DataFrame({"region_raw": ["lima"]})))
print(*canonizar(pd.DataFrame({"region_raw": ["puno", "ica"]})))`,
          output: `['lima'] ['Lima']
['puno', 'ica'] ['Puno', 'Ica']`,
        },
      },
      {
        id: "S16-T3-B-E1",
        subtopicId: "S16-T3-B",
        kind: "guided",
        title: "Marcar domain_error en montos negativos",
        preamble: "- **Contexto:** en el contrato de montos del gate, un valor < 0 es error de dominio, no “outlier curioso”. El dominio es [0, 10000], así que 0 es válido.\n- **Meta:** devolver la máscara booleana `s < 0` en `domain_error(s)`. Este ejercicio revisa solo el límite inferior.\n- **Éxito:** `[False, True, False]` y `[True, False]`.\n- **Límites:** no uses IQR aquí; no inviertas a `>= 0`; no marques el 0.",
        instruction: "1. El starter devuelve `(s >= 0)` (DEFECT).\n2. Cambia a `s < 0`.\n3. Devuelve `.tolist()`.\n4. Sin abs ni drop.",
        hint: "Máscara s < 0; tolist().",
        hints: ["(s < 0).tolist() marca solo negativos.", "No uses >= 0 (invierte la semántica) ni <= 0 (marca el 0, que es válido)."],
        edgeCases: ["usar abs", "IQR only", "marcar el cero"],
        tests: "[1.0, -2.0, 0.0] → [False, True, False]; [-0.5, 3.0] → [True, False]",
        feedback: "Si True está en positivos, invertiste la máscara. Si el 0.0 sale True, usaste `<= 0`: el dominio empieza en 0, así que un monto 0 es válido. `domain_error` es `s < 0`. Los límites de dominio son reglas de negocio, no estadística.",
        retrospective: "Los límites de dominio son reglas de negocio, no estadística: un monto negativo no es “outlier curioso”. Si la máscara marca positivos, el gate cuarentenará filas válidas. Pregunta: ¿por qué este lab **prohíbe** IQR a propósito? Siguiente (E2): outliers estadísticos en una capa aparte.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · máscara domain_error (negativos)
# Pista: error de dominio es s < 0, no s >= 0
import pandas as pd

def domain_error(s):
    return (s >= 0).tolist()

print(domain_error(pd.Series([1.0, -2.0, 0.0])))
print(domain_error(pd.Series([-0.5, 3.0])))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def domain_error(s):
    return (s < 0).tolist()

print(domain_error(pd.Series([1.0, -2.0, 0.0])))
print(domain_error(pd.Series([-0.5, 3.0])))`,
          output: `[False, True, False]
[True, False]`,
        },
      },
      {
        id: "S16-T3-B-E2",
        subtopicId: "S16-T3-B",
        kind: "independent",
        title: "Listar outliers IQR con las dos cercas",
        preamble: "- **Contexto:** el flag estadístico usa el factor 1.5 × IQR en cada lado; una sola cerca deja un extremo sin marcar.\n- **Meta:** en `outliers(s)`, devolver los valores fuera de `[q1 - 1.5 * iqr, q3 + 1.5 * iqr]`.\n- **Éxito:** `[100.0, -50.0]` para el primer lote y `[-40.0]` para el segundo.\n- **Límites:** no dropees filas; el dominio se evalúa aparte.",
        instruction: "1. Calcula q1, q3 e iqr.\n2. El starter solo mira la cerca superior (DEFECT de hábito).\n3. Une la comparación con la cerca inferior y la comparación con la superior mediante `|`.\n4. Devuelve `s[mask].tolist()`.",
        hint: "Cerca inferior y cerca superior: `q1 - 1.5 * iqr` y `q3 + 1.5 * iqr`.",
        hints: ["q1, q3 = quantile 0.25/0.75; iqr = q3 - q1.", "mask = (s < q1 - 1.5*iqr) | (s > q3 + 1.5*iqr)."],
        edgeCases: ["usar solo la cerca superior", "dropear sin listar"],
        tests: "[1, 2, 3, 100, -50] → [100.0, -50.0]; [10, 11, 12, 13, -40] → [-40.0] (una sola cerca daría [100.0] y [])",
        feedback: "Si obtuviste `[100.0]` y `[]`, conservaste la máscara de una sola cerca: faltan `-50.0` y `-40.0`. Combina las comparaciones con la cerca inferior y la superior para recuperar ambos extremos.",
        retrospective: "IQR propone outliers estadísticos; no decide borrar. En el segundo lote, la máscara inicial no encontró nada y omitió `-40.0`. ¿Qué comparación con la cerca inferior recuperó el valor omitido? Luego (E3) combinas dominio + IQR en etiquetas error/flag/ok.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · outliers IQR
# Pista: usa la cerca inferior Y la superior, no solo la superior
import pandas as pd

def outliers(s):
    q1, q3 = s.quantile(0.25), s.quantile(0.75)
    iqr = q3 - q1
    mask = s > q3 + 1.5 * iqr
    return s[mask].tolist()

print(outliers(pd.Series([1.0, 2.0, 3.0, 100.0, -50.0])))
print(outliers(pd.Series([10.0, 11.0, 12.0, 13.0, -40.0])))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def outliers(s):
    q1, q3 = s.quantile(0.25), s.quantile(0.75)
    iqr = q3 - q1
    mask = (s < q1 - 1.5 * iqr) | (s > q3 + 1.5 * iqr)
    return s[mask].tolist()

print(outliers(pd.Series([1.0, 2.0, 3.0, 100.0, -50.0])))
print(outliers(pd.Series([10.0, 11.0, 12.0, 13.0, -40.0])))`,
          output: `[100.0, -50.0]
[-40.0]`,
        },
      },
      {
        id: "S16-T3-B-E3",
        subtopicId: "S16-T3-B",
        kind: "transfer",
        title: "Etiquetar error, flag u ok por monto",
        preamble: "- **Contexto:** el memo del gate no puede decir solo “raro”: debe distinguir error de dominio, flag estadístico y valor ok.\n- **Meta:** en `etiquetas(s, probes)`, priorizar dominio sobre IQR para cada valor de prueba.\n- **Éxito:** `['flag', 'error', 'ok', 'error']` y `['flag', 'ok']`.\n- **Límites:** no marques error por IQR solo; no drops; dominio: <0 o >10000.",
        instruction: "1. Calcula q1/q3/iqr sobre toda la serie.\n2. Para cada valor de prueba: si domain → `error`; elif stat → `flag`; else `ok`.\n3. El starter devuelve `ok` para todo (DEFECT).\n4. Imprime la lista de etiquetas de cada lote.",
        hint: "Domain primero; luego IQR; resto ok.",
        hints: ["Calcula q1/q3/iqr sobre toda la serie.", "Para cada valor de prueba: if domain → error; elif stat → flag; else ok."],
        edgeCases: ["flag en error", "drop"],
        tests: "lote 1, probes [5000, -1, 10, 20000] → flag, error, ok, error; lote 2, probes [400, 100] → flag, ok",
        feedback: "5000 es flag (cola estadística dentro del dominio), -1 y 20000 son errores de dominio, 10 es ok. Si 20000 te salió `flag`, revisaste IQR antes que el dominio. Domain manda sobre IQR: no marques error por IQR solo ni asumas todo ok.",
        retrospective: "Prioridad dominio → estadística → ok es el contrato de outliers del gate. 5000 puede ser cola legítima (flag); -1 no. Pregunta: si un valor es domain_error y también IQR, ¿qué etiqueta gana y por qué? Cierra T3. En T4-A el contrato pasa a schema y reglas cross-field.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · etiquetas error / flag / ok
# Pista: no marques todo ok; combina dominio e IQR
import pandas as pd

def etiquetas(s, probes):
    return ["ok" for v in probes]

print(etiquetas(pd.Series([10.0, 12.0, 11.0, 13.0, 5000.0, -1.0]), [5000.0, -1.0, 10.0, 20000.0]))
print(etiquetas(pd.Series([100.0, 110.0, 105.0, 95.0, 400.0]), [400.0, 100.0]))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def etiquetas(s, probes):
    q1, q3 = s.quantile(0.25), s.quantile(0.75)
    iqr = q3 - q1
    labels = []
    for v in probes:
        domain = (v < 0) or (v > 10000)
        stat = (v < q1 - 1.5 * iqr) or (v > q3 + 1.5 * iqr)
        if domain:
            labels.append("error")
        elif stat:
            labels.append("flag")
        else:
            labels.append("ok")
    return labels

print(etiquetas(pd.Series([10.0, 12.0, 11.0, 13.0, 5000.0, -1.0]), [5000.0, -1.0, 10.0, 20000.0]))
print(etiquetas(pd.Series([100.0, 110.0, 105.0, 95.0, 400.0]), [400.0, 100.0]))`,
          output: `['flag', 'error', 'ok', 'error']
['flag', 'ok']`,
        },
      },
      {
        id: "S16-T4-A-E1",
        subtopicId: "S16-T4-A",
        kind: "guided",
        title: "Listar columnas required faltantes",
        preamble: "- **Contexto:** si falta `monto` en el batch, el operador necesita ver `['monto']`, no un KeyError a mitad del pipeline.\n- **Meta:** en `faltantes(df)`, comparar `required` con `df.columns`.\n- **Éxito:** `['monto']` para el primer lote y `['id']` para el segundo.\n- **Límites:** no trates columnas extra como fail aquí; no devuelvas lista vacía a ciegas.",
        instruction: "1. El starter devuelve `[]` sin comparar (DEFECT).\n2. Lista comprehension: `c not in df.columns`.\n3. Devuelve la lista de faltantes.\n4. No mutes el DataFrame.",
        hint: "List comprehension: c not in df.columns.",
        hints: ["[c for c in required if c not in df.columns]", "No devuelvas lista vacía a ciegas."],
        edgeCases: ["extra cols como fail", "set silent"],
        tests: "lote sin monto → ['monto']; lote sin id → ['id']",
        feedback: "Si imprimiste `[]` a ciegas, no comparaste required con `df.columns`. Al primer lote le falta `monto` y al segundo `id`. Lista vacía fingida es el anti-patrón del gate silencioso.",
        retrospective: "Missing columns = schema drift **legible** para el operador del job (nombres de columna, no KeyError opaco). Lista vacía fingida es el anti-patrón del gate silencioso. Pregunta: ¿por qué el segundo lote nombra `id` y no `monto`? Siguiente (E2): inconsistencias entre campos ya presentes.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · columnas required faltantes
# Pista: compara required contra df.columns
import pandas as pd
required = ["id", "monto"]

def faltantes(df):
    return []

print(faltantes(pd.DataFrame({"id": [1]})))
print(faltantes(pd.DataFrame({"monto": [2.0]})))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
required = ["id", "monto"]

def faltantes(df):
    return [c for c in required if c not in df.columns]

print(faltantes(pd.DataFrame({"id": [1]})))
print(faltantes(pd.DataFrame({"monto": [2.0]})))`,
          output: `['monto']
['id']`,
        },
      },
      {
        id: "S16-T4-A-E2",
        subtopicId: "S16-T4-A",
        kind: "independent",
        title: "Índices donde fin es anterior a inicio",
        preamble: "- **Contexto:** una vigencia con `fin < inicio` rompe el contrato temporal aunque las columnas existan.\n- **Meta:** en `cross_fail(df)`, listar índices de la máscara `fin < inicio`.\n- **Éxito:** `[1]` para el primer lote y `[0]` para el segundo. La fila 2 del primer lote empieza y termina el mismo día: es válida, porque el contrato es `fin >= inicio`.\n- **Límites:** las fechas ya vienen como datetime; no compares strings crudos; no inviertas la desigualdad.",
        instruction: "1. El starter usa `fin > inicio` (DEFECT: lista válidos).\n2. Cambia a `fin < inicio`, estricto.\n3. Devuelve `df.index[mask].tolist()`.\n4. Sin rellenar fechas.",
        hint: "Máscara fin < inicio; index[mask].tolist().",
        hints: ["df['fin'] < df['inicio'] con datetimes parseadas; con <= marcarías la fila 2, que es válida.", "return df.index[mask].tolist()"],
        edgeCases: ["string compare", "sin parse dates", "mismo día"],
        tests: "primer lote → [1] (la fila 2 con fin == inicio es válida); segundo lote → [0]",
        feedback: "Si listaste el índice 0 en el primer lote, invertiste la comparación. Si apareció el 2, usaste `<=`: fin igual a inicio cumple el contrato `fin >= inicio`. La falla es `fin < inicio`. Cross-field = reglas entre columnas, no solo presencia.",
        retrospective: "Cross-field = reglas entre columnas, no solo presencia. Invertir la máscara “falla” las filas buenas de vigencia. Pregunta: si `fin > inicio` en la fila 0, ¿debe entrar a `cross_fail`? Luego (E3) el flag de drift del schema cierra el gate de columnas.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · cross-field fin < inicio
# Pista: la falla es fin < inicio, no fin > inicio
import pandas as pd

def cross_fail(df):
    return df.index[df["fin"] > df["inicio"]].tolist()

print(cross_fail(pd.DataFrame({
    "inicio": pd.to_datetime(["2024-01-01", "2024-06-01", "2024-03-01"]),
    "fin": pd.to_datetime(["2024-02-01", "2024-05-01", "2024-03-01"]),
})))
print(cross_fail(pd.DataFrame({
    "inicio": pd.to_datetime(["2024-09-10"]),
    "fin": pd.to_datetime(["2024-09-01"]),
})))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def cross_fail(df):
    return df.index[df["fin"] < df["inicio"]].tolist()

print(cross_fail(pd.DataFrame({
    "inicio": pd.to_datetime(["2024-01-01", "2024-06-01", "2024-03-01"]),
    "fin": pd.to_datetime(["2024-02-01", "2024-05-01", "2024-03-01"]),
})))
print(cross_fail(pd.DataFrame({
    "inicio": pd.to_datetime(["2024-09-10"]),
    "fin": pd.to_datetime(["2024-09-01"]),
})))`,
          output: `[1]
[0]`,
        },
      },
      {
        id: "S16-T4-A-E3",
        subtopicId: "S16-T4-A",
        kind: "transfer",
        title: "Flag de schema drift fail-closed",
        preamble: "- **Contexto:** medir `missing` y aun así imprimir `schema_ok` es el mismo error que el job que “aprueba en silencio”.\n- **Meta:** en `schema(df)`, devolver `drift` con la lista de columnas faltantes, o `schema_ok`.\n- **Éxito:** `drift ['monto']` para el lote sin `monto` y `schema_ok` para el completo.\n- **Límites:** usa la lista missing; no asumas ok; el operador necesita el nombre de la columna.",
        instruction: "1. Ya tienes `missing` calculado.\n2. El starter ignora missing y devuelve `schema_ok` (DEFECT).\n3. Si missing no está vacío, devuelve `drift` seguido de la lista, como pide el callout de T4-A; si no, `schema_ok`.\n4. Una línea por lote.",
        hint: "Usa la lista missing en el mensaje; no asumas schema_ok.",
        hints: ["missing = [c for c in required if c not in df.columns]", "return 'drift ' + str(missing) if missing else 'schema_ok'"],
        edgeCases: ["siempre ok", "KeyError sin mensaje"],
        tests: "lote sin monto → \"drift ['monto']\"; lote completo → 'schema_ok'",
        feedback: "Falta monto en el primer lote: el gate debe decir `drift ['monto']`, con el nombre, no solo `drift` ni `schema_ok`. Fail-closed ante schema drift: calcular missing y no usarlo es teatro de validación.",
        retrospective: "Fail-closed ante drift protege a S17 y a quien consume el clean. Calcular `missing` y no usarlo es teatro de validación. Pregunta: con `drift ['monto']`, ¿qué hace el gate con las filas del lote? Cierra T4-A. En T4-B publicarás métricas y audit aunque el gate falle.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · schema drift con nombre de columna
# Pista: usa missing; no devuelvas schema_ok a ciegas
import pandas as pd
required = ["id", "monto"]

def schema(df):
    missing = [c for c in required if c not in df.columns]
    return "schema_ok"

print(schema(pd.DataFrame({"id": [1]})))
print(schema(pd.DataFrame({"id": [1], "monto": [2.0]})))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
required = ["id", "monto"]

def schema(df):
    missing = [c for c in required if c not in df.columns]
    return "drift " + str(missing) if missing else "schema_ok"

print(schema(pd.DataFrame({"id": [1]})))
print(schema(pd.DataFrame({"id": [1], "monto": [2.0]})))`,
          output: `drift ['monto']
schema_ok`,
        },
      },
      {
        id: "S16-T4-B-E1",
        subtopicId: "S16-T4-B",
        kind: "guided",
        title: "Armar el bloque metrics del run",
        preamble: "- **Contexto:** el operador del job necesita un dict serializable: cuántas entraron, cuántas salieron limpias, cuántas a cuarentena y si el run aprobó.\n- **Meta:** en `metrics_of(rows_in, quarantine)`, construir `metrics` y serializar con `json.dumps(..., sort_keys=True)`.\n- **Éxito:** `{\"pass\": false, \"rows_clean\": 7, \"rows_in\": 10, \"rows_quarantine\": 3}` y `{\"pass\": true, \"rows_clean\": 4, \"rows_in\": 4, \"rows_quarantine\": 0}`.\n- **Límites:** `rows_clean = rows_in - len(quarantine)`, que vale porque cada fila queda en un solo conjunto; `pass` solo si quarantine está vacía; no inventes literales sueltos.",
        instruction: "1. El starter suma quarantine a rows_in y pone pass True (DEFECT).\n2. Corrige `rows_clean` por resta.\n3. `pass = (len(quarantine) == 0)`.\n4. Imprime el JSON de cada run con claves ordenadas.",
        hint: "rows_clean = rows_in - len(quarantine); pass = (len(quarantine) == 0).",
        hints: ["No sumes filas rechazadas a rows_in; resta para rows_clean.", "json.dumps(metrics, sort_keys=True) fija el orden de claves del oracle."],
        edgeCases: ["porcentaje", "sumar en vez de restar", "pass True con cuarentena"],
        tests: "10 in con 3 en cuarentena → rows_clean 7, pass false; 4 in sin cuarentena → rows_clean 4, pass true",
        feedback: "Con 3 en cuarentena, `rows_clean=7` y `pass=false`; sin cuarentena, `pass=true`. Las métricas se derivan del conteo real: sumar rechazos a `rows_in` o forzar `pass: True` es un bug de reporting. La resta funciona porque ninguna fila está a la vez en clean y en cuarentena.",
        retrospective: "Las métricas se **derivan** del conteo real, no de literales optimistas. Sumar rechazos a `rows_in` o forzar `pass: True` es un bug de reporting. Pregunta: con 10 in y 3 en quarantine, ¿qué es `rows_clean` y por qué `pass` es false? Siguiente (E2): el audit no se pisa al fallar.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · bloque metrics del run
# Pista: rows_clean = rows_in - len(quarantine); pass solo si quarantine vacía
import json

def metrics_of(rows_in, quarantine):
    return {
        "rows_in": rows_in,
        "rows_clean": rows_in + len(quarantine),
        "rows_quarantine": len(quarantine),
        "pass": True,
    }

quarantine = [
    {"id": "C002", "reason": "null_required"},
    {"id": "C004", "reason": "domain_error"},
    {"id": "C007", "reason": "dup_conflict"},
]
print(json.dumps(metrics_of(10, quarantine), sort_keys=True))
print(json.dumps(metrics_of(4, []), sort_keys=True))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import json

def metrics_of(rows_in, quarantine):
    return {
        "rows_in": rows_in,
        "rows_clean": rows_in - len(quarantine),
        "rows_quarantine": len(quarantine),
        "pass": len(quarantine) == 0,
    }

quarantine = [
    {"id": "C002", "reason": "null_required"},
    {"id": "C004", "reason": "domain_error"},
    {"id": "C007", "reason": "dup_conflict"},
]
print(json.dumps(metrics_of(10, quarantine), sort_keys=True))
print(json.dumps(metrics_of(4, []), sort_keys=True))`,
          output: `{"pass": false, "rows_clean": 7, "rows_in": 10, "rows_quarantine": 3}
{"pass": true, "rows_clean": 4, "rows_in": 4, "rows_quarantine": 0}`,
        },
      },
      {
        id: "S16-T4-B-E2",
        subtopicId: "S16-T4-B",
        kind: "independent",
        title: "Append del evento quarantine sin pisar ingest",
        preamble: "- **Contexto:** el audit trail es append-only: el evento `ingest` no se borra cuando llega `quarantine`.\n- **Meta:** en `registrar(audit, n)`, agregar un evento `quarantine` y reportar longitud, primer y último evento.\n- **Éxito:** `2 ingest quarantine` tras el primer registro y `3 ingest quarantine` tras el segundo.\n- **Límites:** no reasignes `audit = [solo el último]`; no omitas `n`.",
        instruction: "1. El starter reasigna la lista y pierde `ingest` (DEFECT).\n2. Agrega el evento `quarantine` con `append` sobre la lista que recibes.\n3. Imprime `len(audit)`, `audit[0][\"event\"]` y `audit[-1][\"event\"]`.\n4. Sin borrar eventos previos.",
        hint: "append sobre la lista recibida; luego print(len, primero, último).",
        hints: ["audit.append({'event': 'quarantine', 'n': n}) no pisa el evento ingest previo.", "Tras dos registros, len(audit) es 3 y audit[0] sigue siendo ingest."],
        edgeCases: ["overwrite de lista", "omitir n", "solo imprimir len"],
        tests: "tras un registro → '2 ingest quarantine'; tras dos → '3 ingest quarantine'",
        feedback: "Si len es 1 y el primer evento es `quarantine`, reasignaste la lista y perdiste `ingest`. Usa `append` para un historial append-only: reasignar es perder la historia del run.",
        retrospective: "Append-only permite reconstruir el run; reasignar es perder historia. Len=1 con solo quarantine es un audit mentiroso. Pregunta: ¿qué evento debe seguir visible en `audit[0]` después de cada append? Luego (E3) el booleano `pass` cierra el contrato fail-closed.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · audit trail append-only
# Pista: agrega el evento con append; no reasignes audit = [solo el último]

def registrar(audit, n):
    audit = [{"event": "quarantine", "n": n}]  # error: pisa el historial
    return audit

audit = [{"event": "ingest"}]
audit = registrar(audit, 2)
print(len(audit), audit[0]["event"], audit[-1]["event"])
audit = registrar(audit, 1)
print(len(audit), audit[0]["event"], audit[-1]["event"])`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def registrar(audit, n):
    audit.append({"event": "quarantine", "n": n})
    return audit

audit = [{"event": "ingest"}]
audit = registrar(audit, 2)
print(len(audit), audit[0]["event"], audit[-1]["event"])
audit = registrar(audit, 1)
print(len(audit), audit[0]["event"], audit[-1]["event"])`,
          output: `2 ingest quarantine
3 ingest quarantine`,
        },
      },
      {
        id: "S16-T4-B-E3",
        subtopicId: "S16-T4-B",
        kind: "transfer",
        title: "metrics.pass False si hay cuarentena",
        preamble: "- **Contexto:** con filas en cuarentena, `pass` debe ser False; invertir la comparación aprueba un batch roto.\n- **Meta:** en `metrics_of(n_q)`, fijar `pass = (n_q == 0)`.\n- **Éxito:** `False` con `n_q=1` y `True` con `n_q=0`.\n- **Límites:** no omitas la métrica; no pongas True “para no alarmar”.",
        instruction: "1. El starter usa `n_q > 0` (DEFECT: True con cuarentena).\n2. Cambia a `n_q == 0`.\n3. Imprime `pass` para los dos runs.\n4. No alteres `rows_quarantine`.",
        hint: "pass = (n_q == 0); no inviertas la lógica.",
        hints: ["return {'pass': n_q == 0, 'rows_quarantine': n_q}", "print(metrics_of(1)['pass']) → False; con 0 → True."],
        edgeCases: ["pass True con q", "omitir métrica"],
        tests: "n_q=1 → False; n_q=0 → True",
        feedback: "Con `n_q=1`, `pass` debe ser False, y con `n_q=0`, True. Invertir la comparación (`n_q > 0`) aprueba un batch con cuarentena: el semáforo del job miente y rompe fail-closed aunque `rows_quarantine` diga la verdad.",
        retrospective: "`pass` es el semáforo del job, no un mensaje de marketing. True con cuarentena rompe fail-closed. Pregunta: ¿puedes tener `rows_quarantine > 0` y `pass=True` en un gate honesto? Cierra T4 y prepara el You Do: metrics + quarantine + audit juntos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · metrics.pass fail-closed
# Pista: pass es True solo si n_q == 0

def metrics_of(n_q):
    return {"pass": n_q > 0, "rows_quarantine": n_q}

print(metrics_of(1)["pass"])
print(metrics_of(0)["pass"])`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def metrics_of(n_q):
    return {"pass": n_q == 0, "rows_quarantine": n_q}

print(metrics_of(1)["pass"])
print(metrics_of(0)["pass"])`,
          output: `False
True`,
        },
      }
    ],
  },
  youDo: {
    title: "Quality gate explicable ante schema drift",
    context:
      "Tú lo haces (You Do). Implementa una suite de checks (verificaciones) sobre un dataset sintético de clientes y transacciones. Las regiones son Lima, Puno, Cusco e Ica; los montos son PEN ficticios.\n\nLa suite debe cubrir:\n\n- null policies required/optional (políticas de nulos obligatorias u opcionales por campo).\n- duplicados exactos vs. conflictos, con evidencia.\n- normalización con columna raw (valor original) lateral.\n- errores de dominio por valores fuera de límites documentados.\n- flags de outliers estadísticos con IQR (ancho de la mitad central) y cercas de Tukey.\n- contratos de schema y cross-field (reglas entre columnas).\n- cuarentena con audit trail append-only (rastro de auditoría donde solo se agregan eventos).\n\nEl conjunto limpio alimenta S17 y CP-N2-A. El gate es fail-closed (fallar de forma segura): si el contrato se rompe, el job no aprueba en silencio. Nunca arregles un dato sin métrica ni uses PII real (datos personales identificables).\n\nAceptación mínima del fixture del starter:\n\n1. cliente_id null en la fila 3 → el gate detecta null_required y manda la fila a cuarentena. No uses fillna mágico.\n2. C001 con Lima y Cusco → las dos filas van a cuarentena con la razón dup_conflict, y ninguna queda en clean. No uses drop_duplicates ciego.\n3. monto -1.0 en C003 → el gate detecta domain_error. No borres solo por IQR.\n4. C004 no rompe ninguna regla → es la única fila de clean.\n5. Resultado del run → metrics.pass == False, rows_quarantine == 4, rows_clean == 1, y rows_in == rows_clean + rows_quarantine.",
    objectives: [
      "Suite de checks que falla explicablemente ante drift, null required y domain_error",
      "Cuantificar pérdida de filas/campos con metrics.rows_in / rows_clean / rows_quarantine",
      "Nunca arreglar silenciosamente un dato (sin fillna mágico de required)",
      "Cuarentena y audit trail sintético append-only (ingest → quarantine → promote)",
      "Demo del fixture: null required, conflicto de región y domain_error de monto; metrics.pass=False con razones codificadas.",
    ],
    requirements: [
      "Fixtures sintéticos (ids C00x, regiones PE, montos S/ ficticios); sin PII real",
      "Función run_quality_gate(df, schema) → dict con claves obligatorias metrics, quarantine, audit (clean opcional)",
      "metrics incluye al menos: rows_in, rows_clean, rows_quarantine, pass (bool). Cada fila queda en clean o en cuarentena, nunca en las dos, así que rows_in == rows_clean + rows_quarantine",
      "quarantine: filas/registros con reason codificada (null_required | dup_exact | dup_conflict | domain_error | cross_field | schema_drift)",
      "audit: list[dict] append-only; no reasignar el historial al fallar",
      "Demo reproducible: assert de claves + pass=False en el fixture del starter",
      "Memo corto en español profesional (qué falló y cuántas filas quedaron fuera del conjunto limpio)",
      "Alineación a CP-N2-A (quality); el conjunto `clean` es el único input válido para S17",
    ],
    starterCode: `import pandas as pd
from typing import Any


def run_quality_gate(df: pd.DataFrame, schema: dict) -> dict[str, Any]:
    """Retorna dict con claves mínimas:
    - metrics: {rows_in, rows_clean, rows_quarantine, pass}
    - quarantine: DataFrame o list[dict] con reason codificada
    - audit: list[dict] append-only (ingest → quarantine → promote)
    - clean (opcional): filas que pasan el gate

    Contrato pedagógico del fixture de demo:
    - null en cliente_id (required) → cuarentena con null_required
    - C001 con dos regiones → sus dos filas a cuarentena con dup_conflict
    - cada fila queda en clean o en cuarentena, nunca en las dos
    - monto < 0 → domain_error
    - metrics["pass"] debe ser False; publica métricas igual

    No mutar df in-place sin copiar; no PII real; no arreglos silenciosos.
    """
    raise NotImplementedError


if __name__ == "__main__":
    df = pd.DataFrame({
        "cliente_id": ["C001", "C001", None, "C003", "C004"],
        "region": ["Lima", "Cusco", "Lima", "Puno", "Ica"],
        "monto": [10.0, 10.0, 5.0, -1.0, 20.0],
    })
    schema = {"cliente_id": "required", "monto": "required", "region": "optional"}
    report = run_quality_gate(df, schema)
    assert set(report) >= {"metrics", "quarantine", "audit"}
    m = report["metrics"]
    assert {"rows_in", "rows_clean", "rows_quarantine", "pass"} <= set(m)
    assert m["pass"] is False, "El fixture debe fallar de forma explicable"
    assert m["rows_in"] == len(df)
    assert m["rows_quarantine"] == 4, "Cuarentena: la fila sin id, las dos de C001 y C003 con monto -1.0"
    assert m["rows_clean"] == 1, "Solo C004 pasa el gate"
    assert m["rows_in"] == m["rows_clean"] + m["rows_quarantine"], "Cada fila queda en un solo conjunto"
    print(m)
`,
    portfolioNote:
      "El gate debe emitir métricas incluso cuando `pass=False`. Ejemplo de forma esperada del JSON: {\"pass\": false, \"rows_in\": 5, \"rows_clean\": 1, \"rows_quarantine\": 4}. El conjunto `clean` (si lo publicas) es el único input válido para los joins y el portfolio de S17. Alinea las `reason` del quarantine con la tabla de aceptación del context (null_required, dup_conflict, domain_error).",
    rubric: [
      { criterion: "Alineación al quality gate de la sección (fail-closed + métricas + cuarentena)", weight: "25%" },
      { criterion: "Correctitud técnica: null policy, duplicados/conflictos, domain, schema", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (fail explicable en el fixture)", weight: "15%" },
      { criterion: "Código legible y límites claros (no mutación silenciosa; audit append-only)", weight: "10%" },
      { criterion: "Documentación en español profesional (memo del gate)", weight: "10%" }
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con `metrics.pass is False` y `rows_in == rows_clean + rows_quarantine` en el fixture? (2) ¿qué reason codificada darías a null required, conflicto de región y monto negativo, y por qué no las “arreglas” con fillna o drop ciego? (3) En el memo, escribe una frase de impacto medible (filas fuera del clean / pass=False) que puedas defender en 30 segundos ante riesgo o cumplimiento. El clean, si lo publicas, es el único input válido para S17.",
  },
  selfCheck: {
    questions: [
      {
        question: "Un campo con política required que tiene nulls debe:",
        options: ["Imputarse con 0 para que el job termine sin errores", "Ignorarse si los nulls son menos del 5% de las filas", "Imputarse con la moda del campo y marcar was_null", "Ir a cuarentena con su razón; el run no aprueba"],
        correctIndex: 3,
        explanation:
          "Required implica presencia: la fila va a cuarentena como `null_required` y el run termina con `pass=False`, con métricas. Imputar con 0 o con la moda inventa el dato, e ignorar un porcentaje pequeño aprueba filas rotas.",
      },
      {
        question: "Duplicado exacto vs. conflicto de clave:",
        options: ["Son lo mismo: drop_duplicates con keep='first' resuelve ambos", "Exacto: filas idénticas; conflicto: misma clave, otros valores", "Exacto: misma clave; conflicto: filas idénticas en todas las columnas", "Conflicto: clave nula; exacto: dos filas con la misma clave"],
        correctIndex: 1,
        explanation:
          "Clasifica antes de borrar. Un exacto deja una copia en clean y las demás van a cuarentena como `dup_exact`; un conflicto va entero a cuarentena como `dup_conflict`. drop_duplicates con keep='first' elegiría una versión del conflicto sin que nadie decida, y las otras dos opciones confunden las definiciones.",
      },
      {
        question: "Conservar region_raw al normalizar sirve para:",
        options: ["Elegir la forma más frecuente y descartar el resto", "Normalizar el texto antes de comparar para no duplicar categorías", "Auditar la forma canónica sin perder el valor original", "Registrar solo la forma canónica, que ya resume el original"],
        correctIndex: 2,
        explanation:
          "Normalizar ≠ borrar historia: el raw lateral permite auditoría y rollback conceptual del transform.",
      },
      {
        question: "IQR sin límites de dominio es riesgoso porque:",
        options: ["Puede marcar (o borrar) colas legítimas de negocio como si fueran error", "Solo detecta valores extremos por arriba, nunca por abajo", "Depende del promedio, así que un extremo desplaza el umbral", "Solo funciona si los valores forman una campana simétrica"],
        correctIndex: 0,
        explanation:
          "El IQR propone outliers estadísticos; los límites de dominio deciden si son errores o flags plausibles. «Solo detecta valores extremos por arriba» es falso porque hay una cerca inferior y otra superior. «Depende del promedio» es falso: las cercas se calculan desde los valores ordenados, no desde el promedio. «Solo funciona si los valores forman una campana simétrica» también es falso porque la regla no exige esa forma.",
      },
      {
        question: "Un quality gate que falla debe:",
        options: ["Ocultar las métricas del run para no alarmar a negocio", "Imputar todos los nulls y reintentar el run en silencio", "Borrar el audit trail del run anterior", "Publicar métricas y cuarentena aunque pass=False"],
        correctIndex: 3,
        explanation:
          "Operar un fallo exige rows_in/clean/quarantine y razones; el audit es append-only y el exit code refleja pass.",
      },
      {
        question: "En un contrato PEN sintético, el monto textual `3,00` (solo coma) se interpreta como:",
        options: ["300.0 (coma de miles)", "3.0 (decimal latino)", "None (inválido)", "30.0 (coma decimal, punto ignorado)"],
        correctIndex: 1,
        explanation:
          "Con solo coma, el contrato documentado de esta sección trata la coma como decimal latino: 3,00 → 3.0. Borrar la coma a ciegas produce 300 y sesga KPIs.",
      },
      {
        question: "Fail-closed en un quality gate significa:",
        options: ["Detener el job en el primer aviso, aunque sea recuperable", "Reintentar la limpieza en silencio hasta que el contrato termine pasando", "Si el contrato se rompe, el run falla y publica métricas y cuarentena", "Aprobar el lote y registrar el incidente para revisarlo al día siguiente"],
        correctIndex: 2,
        explanation:
          "Fail-closed protege al consumidor (S17, gerencia, riesgo): el gate publica el fallo con evidencia en lugar de “arreglar” y seguir. Detenerse en el primer aviso no publica métricas, reintentar en silencio es un arreglo oculto, y aprobar el lote deja pasar los datos rotos.",
      },
      {
        question: "Ante dos filas con el mismo cliente_id y regiones distintas, la acción correcta es:",
        options: ["Enviar las dos filas a cuarentena como dup_conflict", "Quedarse con la primera fila, porque keep='first' es el default", "Elegir la región de la mayoría de filas y borrar las otras versiones", "Rellenar la región con la más frecuente del dataset y seguir el run"],
        correctIndex: 0,
        explanation:
          "Conflicto de atributo ≠ duplicado exacto. Las dos filas van a cuarentena con sus columnas de origen, y una persona decide qué versión pasa a clean con un evento `promote`. keep='first', la mayoría de filas o la moda del dataset eligen una versión sin evidencia y borran las demás.",
      }
    ],
  },
  resources: {
    docs: [
      {
        label: "pandas missing data",
        url: "https://pandas.pydata.org/docs/user_guide/missing_data.html",
        note: "NA, isna, fillna con indicadores",
      },
      {
        label: "pandas drop_duplicates",
        url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.drop_duplicates.html",
        note: "keep + evidencia; no ciego",
      },
      {
        label: "pandas groupby nunique",
        url: "https://pandas.pydata.org/docs/reference/api/pandas.core.groupby.DataFrameGroupBy.nunique.html",
        note: "conflictos de clave",
      },
      {
        label: "Great Expectations (concepts)",
        url: "https://greatexpectations.io/docs/",
        note: "Inspiración de contratos y expectations",
      },
      {
        label: "pandas working with text",
        url: "https://pandas.pydata.org/docs/user_guide/text.html",
        note: "strip, case, normalización",
      },
      {
        label: "pandas quantile / describe",
        url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.quantile.html",
        note: "IQR candidates; dominio decide",
      },
      {
        label: "json — audit trail serializable",
        url: "https://docs.python.org/3/library/json.html",
        note: "métricas y eventos append-only",
      },
    ],
    books: [
      {
        label: "Data Quality / analytics engineering practices",
        note: "Contratos, métricas, cuarentena",
      },
      {
        label: "Python for Data Analysis — cleaning chapters",
        note: "Duplicados, missing, dtypes",
      },
    ],
    courses: [
      {
        label: "pandas user guide",
        url: "https://pandas.pydata.org/docs/user_guide/index.html",
        note: "Limpieza y missing",
      },
      {
        label: "deeplearning.ai — Data Engineering (concepts)",
        url: "https://www.deeplearning.ai/specializations/data-engineering",
        note: "Calidad y pipelines; adaptar a local pandas",
      },
      {
        label: "Coursera — Python for Everybody",
        url: "https://www.coursera.org/specializations/python",
        note: "Fundamentos de datos",
      },
      {
        label: "PyArcana live",
        url: "https://pillb.github.io/pyarcana/",
        note: "Curso desplegado; S16 quality gate",
      },
      {
        label: "MIT 6.100L",
        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
        note: "Lógica y validación",
      },
      {
        label: "Harvard CS50P",
        url: "https://cs50.harvard.edu/python/",
        note: "Práctica Python previa al gate",
      },
    ],
  },
}
