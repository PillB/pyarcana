import type { CourseSection } from '../../types'

export const section16: CourseSection = {
  id: "wxpython-gui",
  index: 16,
  title: "Calidad, limpieza y contratos de datos",
  shortTitle: "Calidad y contratos",
  tagline: "Suite de calidad que falla de forma explicable ante schema drift, cuantifica pérdida y nunca arregla silenciosamente un dato",
  estimatedHours: 18,
  level: "Práctica independiente",
  phase: 1,
  icon: "ShieldCheck",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "Los equipos de datos en banca, fintech y retail en Perú necesitan quality gates (puertas de control de calidad) explicables: políticas de nulos por campo, duplicados con evidencia, normalización con la columna raw (valor original) al lado, outliers con dominio y cuarentena con audit trail. Aquí aprendes a construir un gate fail-closed (que falla de forma segura: si el contrato se rompe, el job no aprueba en silencio). Trabajas sin PII real y sin arreglos silenciosos, dejando un conjunto limpio y métricas listas para el siguiente paso.",
  learningOutcomes: [
    { text: "Definir políticas de null required/optional y listar violaciones con conteo verificable (`isna` + mapa de campos)" },
    { text: "Limitar imputación con cap, indicadores de ausencia (`was_null`) y bloqueo si el rate supera el umbral" },
    { text: "Distinguir duplicados exactos de conflictos de atributo y clasificar antes de borrar" },
    { text: "Resolver claves con cardinalidad 1:1 documentada y conservar evidencia completa en cuarentena" },
    { text: "Normalizar strings, montos con locale PEN documentado, fechas multi-formato y categorías con mapa, sin borrar el raw" },
    { text: "Clasificar outliers como error de dominio, flag estadístico (IQR) o valor ok, con dominio prioritario" },
    { text: "Implementar contratos de schema, schema drift y reglas cross-field con códigos legibles en cuarentena" },
    { text: "Publicar métricas (rows_in/clean/quarantine/pass), cuarentena y audit trail append-only (solo se agregan eventos) aunque pass=False" }
  ],
  theory: [
    {
            heading: "El lunes que alguien rellena los nulos con cero",
      paragraphs: [
        "El job venía fallando y la solución fue rápida: `monto.fillna(0)`. Ahora corre. Dos semanas después, en la reunión de gerencia, el ticket promedio aparece más bajo de lo que nadie esperaba y nadie sabe por qué — porque los montos que faltaban ahora valen cero y arrastran el promedio hacia abajo. El código no falló ni una sola vez.",
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
      subtopicId: "S16-T1-A",
      paragraphs: [
        "Cada campo del contrato tiene política **required** (null ⇒ cuarentena o fail del gate) u **optional** (null permitido, idealmente con indicador de ausencia). Mezclar ambas sin documentar es la causa clásica de “defaults mágicos” que envenenan el EDA (análisis exploratorio de datos) de S17.",
        "Contrato operativo: documenta un dict `{campo: 'required'|'optional'}`, mide con `isna`/`notna`, y arma un mapa `violations` solo para required con n>0. No imputes un required “para que pase el job”: eso oculta rotura de fuente y contamina el EDA posterior.",
        "Caso sintético Perú: `cliente_id` y `monto` son required; `email` es optional. Las filas con id o monto nulo entran a `violations`; la tasa de null de email se reporta como métrica, pero no tumba el gate por sí sola. Imprime `violations` y el `null_rate` de los opcionales en el reporte del run.",
      ],
      code: {
        language: 'python',
        title: "null_policy.py",
        code: `def s16_th_1():
    import pandas as pd

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
    print("null_rate_email", float(df["email"].isna().mean()))

s16_th_1()`,
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
      heading: "Indicadores y límites de imputación",
      subtopicId: "S16-T1-B",
      paragraphs: [
        "Un **indicador de ausencia** (`monto_was_null`) preserva señal cuando imputas un optional: el modelo, el auditor y el stakeholder de riesgo ven qué filas fueron tocadas. Imputar sin indicador borra evidencia y crea falsos ceros indistinguibles de ceros reales de negocio.",
        "Límites del gate: no imputar más del **cap** (p. ej. 30–40% null en la columna), no imputar llaves de negocio (`cliente_id`), y documentar la regla (mediana, constante de dominio). Si `null_rate > cap`, el gate imprime `blocked`/`fail` y **no** rellena en silencio.",
        "Caso: monto con 2/5 null y cap=0.4 → **si el campo fuera optional** se permitiría `fillna(mediana)` + columna `was_null`. Con `monto`, que este mismo caso declara required, no: ahí la política manda cuarentena, no relleno. El cap decide *cuánto* nulo tolera un optional; nunca convierte un required en imputable. Si el rate supera el cap, no hay fill silencioso. La mediana se calcula solo sobre no-nulos **pre**-imputación; post-fill no se recalcula para “maquillar” el reporte.",
      ],
      code: {
        language: 'python',
        title: "impute_cap.py",
        code: `def s16_th_2():
    import pandas as pd

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
        print(df.to_dict(orient="list"))

s16_th_2()`,
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
      heading: "Duplicados exactos vs. conflictos",
      subtopicId: "S16-T2-A",
      paragraphs: [
        "**Duplicado exacto**: mismas columnas relevantes idénticas. **Conflicto**: misma clave de negocio con atributos distintos (p. ej. dos regiones para un `cliente_id`). Tratarlos igual con `drop_duplicates` ciego puede borrar el único rastro del conflicto y dejar un maestro mentiroso.",
        "Contrato: usa `duplicated(keep=False)` para exactos y `groupby(clave)[attr].transform('nunique')>1` para conflictos. Solo después eliges política `keep='first'|'last'` o envío a cuarentena. **Clasifica antes de borrar**; el orden evita pérdida de evidencia.",
        "Caso sintético: C001 repetido exacto (Lima, score 0.9); C002 con Cusco vs. Madrid. Salida esperada: `exact_rows` para C001 y `conflict_ids` para C002. El portfolio de calidad de CP-N2-A debe listar ambos tipos por separado en el memo.",
      ],
      code: {
        language: 'python',
        title: "dups.py",
        code: `def s16_th_3():
    import pandas as pd

    df = pd.DataFrame({
        "cliente_id": ["C001", "C001", "C002", "C002"],
        "region": ["Lima", "Lima", "Cusco", "Madrid"],
        "score": [0.9, 0.9, 0.5, 0.5],
    })
    exact = df.duplicated(keep=False)
    conflict = df.groupby("cliente_id")["region"].transform("nunique") > 1
    print("exact_rows", df.loc[exact].to_dict(orient="list"))
    print("conflict_ids", df.loc[conflict, "cliente_id"].unique().tolist())

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
        "Contrato: `clean = drop_duplicates(key, keep=...)` con regla documentada; `quarantine = filas con clave duplicada` sin pérdida de columnas. El conjunto limpio alimenta joins de S17; el audit trail permite reconstruir por qué se eligió una versión ante revisión humana.",
        "Caso: C001 con scores 0.9 y 0.4 de src a/b. `keep='first'` deja 0.9 en clean; `quarantine_n=2` conserva ambas filas y columnas de evidencia. Sin esa evidencia, el gate no es auditable ante un stakeholder de riesgo o cumplimiento.",
      ],
      code: {
        language: 'python',
        title: "key_evidence.py",
        code: `def s16_th_4():
    import pandas as pd

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
    print("evidence_cols", quarantine.columns.tolist())

s16_th_4()`,
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
      heading: "Normalización de strings, números, fechas y categorías",
      subtopicId: "S16-T3-A",
      paragraphs: [
        "Normalización: strings (`strip`, colapso de espacios, `title`/`casefold`), números con **locale documentado** (no adivines), fechas multi-formato y categorías con mapa de sinónimos (`LIM`→`Lima`). **Normalizar ≠ imputar**: no inventes valores, solo canonicidad.",
        "Contrato de montos PEN sintéticos: (1) quita el prefijo `S/`; (2) si hay **coma y punto**, el punto es miles y la coma es decimal (`1.250,5` → `1250.5`); (3) si hay **solo coma**, es decimal latino (`3,00` → `3.0`); (4) si hay **solo punto**, es decimal anglosajón (`10.50` → `10.5`). Conserva el **raw** en una columna lateral (`region_raw`, `monto_raw`) cuando el valor canónico pueda disputarse. Valida los dtypes después de normalizar y **antes** del join de S17.",
        "Caso sintético Perú: regiones con espacios/`LIM`, montos `S/ 10.50`, `3,00` y `1.250,5`, fechas multi-formato (`01/03/2024`, `2024-03-15`, `15-03-2024`). Salida canónica Lima + floats correctos + fechas ISO; raw intacto para auditoría. Parsea fechas probando formatos documentados (no un solo `format` rígido). Nunca subas padrones reales ni PII al repo del curso.",
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
        s = str(x).strip().replace("S/", "").strip()
        # Contrato PE sintético: miles con punto; decimal con coma
        # o punto si no hay coma. Documenta la regla; no adivines.
        if "," in s and "." in s:
            s = s.replace(".", "").replace(",", ".")
        elif "," in s:
            s = s.replace(",", ".")
        else:
            s = s.replace(" ", "")
        return float(re.sub(r"[^0-9.\\-]", "", s) or "nan")

    cat_map = {"LIM": "Lima", "MAD": "Madrid", "CUZ": "Cusco"}

    def parse_fecha(x):
        # Multi-formato documentado: prueba formatos; no adivines con un solo format.
        for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"):
            try:
                return pd.to_datetime(x, format=fmt)
            except (ValueError, TypeError):
                continue
        return pd.NaT

    df = pd.DataFrame({
        "region_raw": [" lima ", "LIM", "MADRID"],
        "monto_raw": ["S/ 10.50", "3,00", "1.250,5"],
        "fecha_raw": ["01/03/2024", "2024-03-15", "15-03-2024"],
    })
    stripped = df["region_raw"].str.strip()
    df["region"] = [cat_map.get(x.upper(), x.title()) for x in stripped]
    df["monto"] = df["monto_raw"].map(norm_money)
    df["fecha"] = df["fecha_raw"].map(parse_fecha)
    print(df[["region", "monto"]].to_dict(orient="list"))
    print("fechas", df["fecha"].dt.strftime("%Y-%m-%d").tolist())

s16_th_5()`,
        output: `{'region': ['Lima', 'Lima', 'Madrid'], 'monto': [10.5, 3.0, 1250.5]}
fechas ['2024-03-01', '2024-03-15', '2024-03-15']`,
      },
      callout: {
        type: "info",
        title: "Raw al lado",
        content:
          "region_raw/monto_raw permiten auditar la normalización. Documenta si la coma es decimal o miles.",
      },
    },
    {
      heading: "Outliers plausibles vs. errores",
      subtopicId: "S16-T3-B",
      paragraphs: [
        "Un outlier **plausible** está lejos estadísticamente pero dentro del dominio de negocio (por ejemplo, un monto alto legítimo en una campaña). Un **error de dominio** viola los bounds (monto < 0, lat 999, edad 200). IQR y z-score solo **identifican candidatos**; el dominio de negocio **decide** si es error o flag.",
        "Contrato: mantén máscaras `stat_outlier` y `domain_error` por separado; por defecto flag y cuarentena, nunca drop silencioso solo por IQR. Documenta bounds en el memo del gate (p. ej. monto ∈ [0, 10000] PEN sintéticos del fixture de clase).",
        "Caso: serie con 5000 (cola plausible) y -1 (error). `stat` marca ambos; `domain` solo -1; `plausible_extreme` = 5000. El EDA de S17 no debe perder la cola legítima de montos por un 1.5·IQR ciego sin revisión explícita de dominio.",
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
        "Contrato de **schema**: columnas presentes, dtypes esperados y nullability por campo. **Cross-field**: p. ej. `fecha_fin >= fecha_ini`, `monto > 0` si estado=pagado. Cada regla devuelve máscara de fallos + código de error legible para cuarentena.",
        "Ante **schema drift** (desviación de esquema: columna required faltante o renombrada), el gate falla con el **nombre** de la columna — no con un `KeyError` sin mensaje claro al final del pipeline. Es el mismo espíritu fail-closed: el drift se hace visible al operador. Las columnas extra pueden emitir `warn` o fallar, según la política documentada en el runbook del job.",
        "Caso: expected `{inicio, fin, monto}`; detecta cross-field `fin<inicio` e índices de monto negativo. Imprime `drift`, `cross_fail_idx` y `neg_idx` con códigos legibles. Este bloque es el puente al join validado y al portfolio de S17.",
      ],
      code: {
        language: 'python',
        title: "contracts.py",
        code: `def s16_th_7():
    import pandas as pd

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
    print("neg_idx", df.index[neg].tolist())

s16_th_7()`,
        output: `drift []
cross_fail_idx [1]
neg_idx [1]`,
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
        "Métricas operables del run: `rows_in`, `rows_clean`, `rows_quarantine`, tasas de null/dup/fail_schema y `pass` booleano. Un fallo **sin métricas** no se puede operar en un job nocturno ni explicar a negocio, riesgo o auditoría interna.",
        "La cuarentena es una tabla de filas rechazadas con la razón codificada. El **audit trail** es una lista append-only de eventos (`ingest`, `quarantine`, `promote`): solo se agregan eventos, nunca se modifican ni borran. El gate publica el reporte aunque `pass=False` (exit code ≠ 0 acompañado de un JSON de métricas).",
        "Caso: 2 filas de entrada, 1 limpia, 1 en cuarentena por `null_required_monto`; el audit trail registra un evento `quarantine`. El campo `metrics.pass` es `false`. S17 solo debe consumir el conjunto `clean`, y el memo debe declarar cuántas filas quedaron fuera del universo analítico.",
      ],
      code: {
        language: 'python',
        title: "quarantine_audit.py",
        code: `def s16_th_8():
    import pandas as pd, json

    clean = pd.DataFrame({"id": ["C001"], "ok": [True]})
    quar = pd.DataFrame({"id": ["C002"], "reason": ["null_required_monto"]})
    audit = [
        {"event": "ingest", "n": 2},
        {"event": "quarantine", "n": 1, "reason": "null_required_monto"}
    ]
    metrics = {
        "rows_in": 2,
        "rows_clean": len(clean),
        "rows_quarantine": len(quar),
        "pass": len(quar) == 0,
    }
    print(json.dumps(metrics, sort_keys=True))
    print(audit[-1])

s16_th_8()`,
        output: `{"pass": false, "rows_clean": 1, "rows_in": 2, "rows_quarantine": 1}
{'event': 'quarantine', 'n': 1, 'reason': 'null_required_monto'}`,
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
        why: "Required se traduce en fail o cuarentena: un null en llave de negocio o monto no se rellena “para que pase el job”. Optional se mide como métrica (`optional_nulls`) sin tumbar el gate por sí solo. El mapa se arma con `isna` filtrando la policy: así evitas el fillna mágico de ids. En We Do practicarás conteo, mapa y decisión pass/fail con el defecto típico de usar `notna`.",
        retrospective:
          "Si puedes explicar por qué un null en `cliente_id` tumba el gate y uno en `telefono` solo se reporta, ya tienes la política por campo. El error clásico es rellenar required “para que pase el job”. En We Do practicarás conteo, mapa y decisión pass/fail.",
      },
      {
        demoId: "S16-T1-B-DEMO",
        subtopicId: "S16-T1-B",
        environment: "local-python",
        description: "Imputar mediana solo si null_rate <= cap; marcar indicador",
        preamble:
          "Cuando el monto optional tiene nulls, el gate puede imputar **solo si** el `null_rate` no supera el cap, y debe dejar un indicador de qué filas se tocaron. En esta demo `cap=0.5` y un null de cuatro filas: sigue el `status`, el rate y el dict final. Predice si verás `imputed` o `blocked` y en qué posición `monto_was_null` es True.",
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
        why: "El cap evita imputación masiva que envenena KPIs: si el rate supera el umbral, el status es `blocked`, no un fill silencioso. El indicador `monto_was_null` se crea **antes** del fill para que auditor y modelo sepan qué filas se tocaron. La mediana se calcula sobre no-nulos pre-fill; no se recalcula después para maquillar el reporte. En We Do el defecto clásico es invertirlo: fillna y luego isna.",
        retrospective:
          "Imputar sin indicador borra la diferencia entre cero real y cero inventado. Si el rate supera el cap, el status es `blocked`, no un fill silencioso. Pregunta de auto-chequeo: ¿en qué fila del demo `monto_was_null` es True y por qué se marca *antes* del fill? En We Do practicarás el orden del indicador y el umbral.",
      },
      {
        demoId: "S16-T2-A-DEMO",
        subtopicId: "S16-T2-A",
        environment: "local-python",
        description: "Detectar duplicados exactos vs. conflictos de región por cliente_id",
        preamble:
          "En un maestro de clientes, C001 se repite idéntico y C002 aparece con Cusco y Madrid. Si haces `drop_duplicates` ciego, puedes borrar el único rastro del conflicto. En esta demo no escribas: cuenta mentalmente filas exactas y lista de ids en conflicto, luego compara con la salida. Observa que la acción de limpieza **depende** de la clase.",
        code: {
          language: 'python',
          title: "demo_dups.py",
          code: `def s16_ido_3():
    import pandas as pd
    df = pd.DataFrame({
        "cliente_id": ["C001", "C001", "C002", "C002", "C003"],
        "region": ["Lima", "Lima", "Cusco", "Madrid", "Lima"],
        "score": [0.5, 0.5, 0.7, 0.7, 0.9],
    })
    exact_n = int(df.duplicated(keep=False).sum())
    conf = df.groupby("cliente_id").filter(lambda g: g["region"].nunique() > 1)
    print("exact_dup_rows", exact_n)
    print("conflict_ids", conf["cliente_id"].unique().tolist())

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
          "C001 llega dos veces con scores distintos y batches `b1`/`b2`. El conjunto limpio puede quedarse con `keep='first'`, pero la cuarentena debe conservar **ambas** filas y columnas para auditoría. En esta demo predice `clean_ids` y el contenido de `quarantine` antes de mirar la salida. Observa que no se “desaparecen” filas sin rastro.",
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
    q = df[df.duplicated("cliente_id", keep=False)].copy()
    clean = df.drop_duplicates("cliente_id", keep="first")
    print("clean_ids", clean["cliente_id"].tolist())
    print("quarantine", q.to_dict(orient="list"))

s16_ido_4()`,
          output: `clean_ids ['C001', 'C002']
quarantine {'cliente_id': ['C001', 'C001'], 'score': [0.9, 0.1], 'batch': ['b1', 'b2']}`,
        },
        why: "El clean con keep documentado alimenta los joins de S17; la quarantine es evidencia completa (todas las versiones y columnas de origen). `keep='first'` solo define qué fila sobrevive al conjunto limpio: no sustituye el log ni el rastro de auditoría. Sin columnas de batch, el gate no es auditable ante riesgo o cumplimiento. En We Do armarás split, columnas y chequeo de cardinalidad 1:1.",
        retrospective:
          "`keep='first'` solo define el clean; no sustituye el audit trail. Sin quarantine con columnas de origen, el gate no es auditable ante riesgo o cumplimiento. Pregunta: ¿por qué `quarantine` guarda *ambas* filas de C001 y no solo la descartada? En We Do armarás conteos (`len`), columnas de evidencia y chequeo de cardinalidad 1:1.",
      },
      {
        demoId: "S16-T3-A-DEMO",
        subtopicId: "S16-T3-A",
        environment: "local-python",
        description: "Normalizar región y montos conservando columnas raw",
        preamble:
          "Los montos llegan como `S/12.5` y `3,00`; las regiones con espacios y mayúsculas. La normalización del gate hace canónicos **sin** pisar el raw, y el locale PEN está documentado (coma sola = decimal latino). En esta demo predice las cuatro columnas del dict final: raw vs. canónico. No escribas aún; sigue el `map` de montos y el `str.title` de región.",
        code: {
          language: 'python',
          title: "demo_norm.py",
          code: `def s16_ido_5():
    import pandas as pd

    def norm_money(x):
        s = str(x).strip().replace("S/", "").strip()
        if "," in s and "." in s:
            s = s.replace(".", "").replace(",", ".")
        elif "," in s:
            s = s.replace(",", ".")
        return float(s)

    df = pd.DataFrame({
        "region_raw": [" lima", "MADRID "],
        "monto_raw": ["S/12.5", "3,00"],
    })
    df["region"] = df["region_raw"].str.strip().str.title()
    df["monto"] = df["monto_raw"].map(norm_money)
    print(df.to_dict(orient="list"))

s16_ido_5()`,
          output: `{'region_raw': [' lima', 'MADRID '], 'monto_raw': ['S/12.5', '3,00'], 'region': ['Lima', 'Madrid'], 'monto': [12.5, 3.0]}`,
        },
        why: "Normalizar no es imputar: no inventas valores, solo canonicidad. Conservar raw al lado permite disputar el transform ante auditoría. El contrato de coma/punto evita convertir `3,00` en 300 y envenenar el ticket promedio. `strip` + `title` unifican regiones PE antes de mapas de sinónimos. En We Do practicarás cada pieza: strings, locale PEN y no-overwrite del raw.",
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
    domain_err = (s < 0) | (s > 1e6)
    print("stat", s[stat].tolist())
    print("error", s[domain_err].tolist())
    print("plausible", s[stat & ~domain_err].tolist())

s16_ido_6()`,
          output: `stat [1000, -3]
error [-3]
plausible [1000]`,
        },
        why: "IQR propone candidatos estadísticos; los bounds de dominio deciden qué es error de negocio. Un monto negativo no es “outlier curioso”: es domain_error. Borrar por IQR a ciegas elimina colas legítimas (p. ej. un ticket alto pero válido). La capa `plausible` aísla lo raro-pero-dentro-de-dominio para flag, no drop. En We Do practicarás máscaras y etiquetas error/flag/ok.",
        retrospective:
          "Si puedes explicar por qué 1000 es `flag` y -3 es `error`, ya separas estadística de regla de negocio. El error clásico es borrar todo lo “raro” por IQR. Pregunta: ¿quién manda si un valor es a la vez outlier estadístico y domain_error? En We Do practicarás cada capa (domain → IQR → etiquetas).",
      },
      {
        demoId: "S16-T4-A-DEMO",
        subtopicId: "S16-T4-A",
        environment: "local-python",
        description: "Validar schema required y regla cross-field fin>=inicio",
        preamble:
          "El contrato del batch exige columnas `inicio`, `fin` y `monto`, y la regla de negocio `fin >= inicio`. En esta demo el schema está completo pero la segunda fila viola el orden temporal. Predice `missing` y `cross_fail` antes de mirar la salida. Observa que el mensaje es un índice y un código, no un crash opaco.",
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
    print("missing", missing, "cross_fail", cross_fail)

s16_ido_7()`,
          output: `missing [] cross_fail [1]`,
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
          "El batch entra con 5 filas y 2 van a cuarentena por schema_drift y domain_error. El gate **publica** métricas con `pass: false` y un audit trail de al menos start + quarantine. En esta demo predice `rows_clean` y el último evento del audit antes de mirar la salida. Observa que el fallo no oculta números.",
        code: {
          language: 'python',
          title: "demo_audit.py",
          code: `def s16_ido_8():
    import json
    rows_in = 5
    quarantine = [{"id": "C002", "reason": "schema_drift"}, {"id": "C004", "reason": "domain_error"}]
    clean_n = rows_in - len(quarantine)
    audit = []
    audit.append({"event": "start", "rows_in": rows_in})
    audit.append({"event": "quarantine", "n": len(quarantine)})
    metrics = {"rows_in": rows_in, "rows_clean": clean_n, "rows_quarantine": len(quarantine), "pass": False}
    print(json.dumps(metrics, sort_keys=True))
    print(len(audit), audit[-1]["event"])

s16_ido_8()`,
          output: `{"pass": false, "rows_clean": 3, "rows_in": 5, "rows_quarantine": 2}
2 quarantine`,
        },
        why: "Operar un fallo exige métricas derivadas del conteo real y razones codificadas, no solo un exit code opaco. El audit append-only (start → quarantine) permite reconstruir el run sin reescribir historia. `pass: false` con JSON publicado es el producto del fail-closed: el operador ve cuántas filas entraron, cuántas quedaron limpias y cuántas cayeron. En We Do armarás el bloque metrics, el append y el booleano `pass`.",
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
        preamble:
          "- **Contexto:** en el gate de CP-N2-A, un `id` required con null no se “maquilla”: se cuenta y se etiqueta.\n- **Meta:** practicar `isna().sum()` y la etiqueta `violates`/`ok`.\n- **Éxito:** con el fixture del starter imprimes exactamente `1 violates`.\n- **Límites:** no imputes antes de contar; no uses `notna` para ausencias.",
        instruction:
          "1. Abre el starter: cuenta con `notna` e imprime `ok` (DEFECT).\n2. Cambia el conteo a `isna().sum()` sobre `id`.\n3. Si `n > 0`, etiqueta `violates`; si no, `ok`.\n4. Imprime solo `n` y la etiqueta (sin texto extra).",
        hint: "n = isna().sum(); etiqueta violates si n>0. notna cuenta valores presentes, no ausencias.",
        hints: [
          "Primero n = int(df['id'].isna().sum()) — isna, no notna.",
          "Luego print(n, 'violates' if n > 0 else 'ok') → 1 violates.",
        ],
        edgeCases: ["contar filas", "fillna antes", "usar notna para ausencias"],
        tests: "salida coincide con solution output",
        feedback:
          "`notna` cuenta presentes; `isna` cuenta ausencias. Required con null ⇒ `violates`, no `ok`. Contar mal invierte la señal del gate y aprueba filas rotas ante el auditor del run.",
        retrospective:
          "El primer paso del gate es **medir** ausencia required, no rellenar. El error clásico es confiar en `notna` o en fillna antes del conteo. Pregunta: con el fixture, ¿por qué `n` debe ser 1 y no 2? Siguiente (E2): armar el mapa solo con campos required.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · nulls en required + etiqueta de violación
# Pista: cuenta con isna (no notna) y etiqueta violates si n > 0
import pandas as pd
df = pd.DataFrame({"id": ["C001", None, "C003"]})
n = int(df["id"].notna().sum())
print(n, "ok")`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"id": ["C001", None, "C003"]})
n = int(df["id"].isna().sum())
print(n, "violates" if n > 0 else "ok")`,
          output: `1 violates`,
        },
      },
      {
        id: "S16-T1-A-E2",
        subtopicId: "S16-T1-A",
        kind: "independent",
        title: "Mapa de violaciones solo required",
        preamble:
          "- **Contexto:** el reporte del run debe listar **solo** campos required con null; los optional van a métricas aparte.\n- **Meta:** construir un dict `viol` filtrando la `policy`.\n- **Éxito:** `{'a': 1}` (sin incluir `b` optional).\n- **Límites:** no incluyas n=0 ni campos optional aunque tengan nulls.",
        instruction:
          "1. Revisa el starter: la comprensión filtra `p == \"optional\"` (DEFECT).\n2. Itera `policy` e incluye solo `required` con `isna().any()`.\n3. El valor del dict es el conteo entero de nulls.\n4. Imprime el dict completo.",
        hint: "Itera policy e incluye solo required con n>0.",
        hints: [
          "Itera policy e incluye solo p == 'required'.",
          "Excluye opcionales aunque tengan nulls.",
        ],
        edgeCases: ["incluir optional", "n=0"],
        tests: "salida coincide con solution output",
        feedback:
          "Si el mapa incluye `b` (optional) o está vacío, filtraste mal la policy. Solo required con n>0 entra a violaciones; mezclar optional diluye el fail ante el auditor.",
        retrospective:
          "El mapa de violaciones es el contrato legible del gate: solo required con n>0. Mezclar optional diluye el fail y confunde al auditor. Pregunta: ¿por qué `b` no entra al dict aunque tenga null? Luego (E3) conviertes el mapa en decisión `pass`/`fail`.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · mapa de violaciones required
# Pista: filtra p == "required", no "optional"
import pandas as pd
policy = {"a": "required", "b": "optional"}
df = pd.DataFrame({"a": [1, None], "b": [None, 2]})
viol = {c: int(df[c].isna().sum()) for c, p in policy.items() if p == "optional" and df[c].isna().any()}
print(viol)`,
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
        title: "Gate pass/fail desde violaciones required",
        preamble:
          "- **Contexto:** el job no debe imprimir `pass` si el contrato required se rompe; eso es el anti-patrón del gate silencioso.\n- **Meta:** decidir `fail` o `pass` a partir de violaciones reales de `id`.\n- **Éxito:** con el fixture (id nulo) imprimes exactamente `fail`.\n- **Límites:** no rellenes nulls para forzar pass; no dejes `viol` vacío a ciegas.",
        instruction:
          "1. El starter imprime `pass` porque `viol` está vacío sin medir.\n2. Llena `viol` desde `isna` del campo required.\n3. Imprime `fail` si hay violaciones; si no, `pass`.\n4. Una sola palabra de salida.",
        hint: "Construye viol desde isna de id; imprime fail si viol no vacío.",
        hints: [
          "Construye el dict viol desde isna del campo required.",
          "print('fail' if viol else 'pass').",
        ],
        edgeCases: ["siempre pass", "ignorar null"],
        tests: "salida coincide con solution output",
        feedback:
          "Si imprimiste `pass` con id nulo, el gate no es fail-closed: llena `viol` desde `isna` antes de decidir. Un pass ciego es mentira operativa.",
        retrospective:
          "Fail-closed = el gate publica el fallo en lugar de maquillar datos. Si `viol` no se llena, el pass es mentira operativa. Pregunta: ¿qué imprimirías si `id` no tuviera nulls? Cierra T1-A: conteo → mapa → decisión. En T1-B practicarás imputar solo lo permitido.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · gate pass/fail por required
# Pista: no imprimas pass a ciegas; llena viol desde isna
import pandas as pd
df = pd.DataFrame({"id": [None]})
viol = {}
print("pass" if not viol else "fail")`,
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
        title: "Marcar was_null antes de imputar",
        preamble:
          "- **Contexto:** el auditor del gate debe ver qué montos fueron tocados; si rellenas primero, `isna()` ya no ve nulls.\n- **Meta:** crear `was_null` **antes** de `fillna`.\n- **Éxito:** `[False, True]` alineado a las filas del fixture.\n- **Límites:** no crees el indicador después del fill; no uses abs ni drop.",
        instruction:
          "1. El starter hace `fillna` y luego `isna` (DEFECT).\n2. Asigna `was_null = monto.isna()` primero.\n3. Luego rellena con `0.0`.\n4. Imprime solo `was_null.tolist()`.",
        hint: "Marca was_null = isna() ANTES del fillna.",
        hints: [
          "was_null = df['monto'].isna() antes de rellenar.",
          "Luego fillna(0.0) y print de was_null.tolist().",
        ],
        edgeCases: ["indicador después de fill", "perder señal"],
        tests: "salida coincide con solution output",
        feedback:
          "Si `was_null` es todo False, creaste el indicador después del fillna. Marca `isna()` primero; luego rellena. El orden es parte del contrato de evidencia.",
        retrospective:
          "El orden es parte del contrato de evidencia: medir ausencia → transformar → publicar. Si el indicador queda todo False, no es un “bug de pandas”: es evidencia inventada. Pregunta: ¿por qué el auditor necesita `was_null` además del monto ya rellenado? Siguiente (E2): el cap decide si se permite imputar.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · indicador was_null antes de imputar
# Pista: si fillna va primero, isna() ya no ve nulls
import pandas as pd
df = pd.DataFrame({"monto": [1.0, None]})
df["monto"] = df["monto"].fillna(0.0)
df["was_null"] = df["monto"].isna()
print(df["was_null"].tolist())`,
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
        title: "Bloquear imputación si null_rate supera cap",
        preamble:
          "- **Contexto:** si la mitad de los montos vienen vacíos, imputar “para que el KPI no falle” envenena el ticket promedio.\n- **Meta:** comparar `null_rate` con umbral 0.3 y decidir `blocked`/`ok`.\n- **Éxito:** con rate=0.5 imprimes `blocked`.\n- **Límites:** no imputes si está bloqueado; no inviertas la comparación del umbral.",
        instruction:
          "1. Calcula `rate = isna().mean()` sobre la serie del fixture.\n2. El starter bloquea cuando rate es bajo (DEFECT).\n3. Corrige: `blocked` si `rate > 0.3`, si no `ok`.\n4. Imprime solo la etiqueta.",
        hint: "rate = isna().mean(); bloquea si rate > 0.3.",
        hints: [
          "rate = s.isna().mean().",
          "print('blocked' if rate > 0.3 else 'ok').",
        ],
        edgeCases: ["cap inclusivo confuso", "contar no rate"],
        tests: "salida coincide con solution output",
        feedback:
          "Si imprimiste `ok`, invertiste el umbral. Con rate=0.5 > 0.3 el gate bloquea la imputación (`blocked`). Rate alto no se “arregla” rellenando en silencio.",
        retrospective:
          "El cap es un freno de negocio, no un detalle de pandas. Rate alto ⇒ no rellenar en silencio. Pregunta: con rate=0.5 y umbral 0.3, ¿qué etiqueta imprime el gate y qué *no* debe hacer con `fillna`? Luego (E3) practicarás mediana estable cuando sí se permite imputar.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · cap de null_rate
# Pista: el umbral bloquea cuando rate es ALTO (> 0.3), no bajo
import pandas as pd
s = pd.Series([1.0, None, None, 2.0])
rate = s.isna().mean()
print("blocked" if rate < 0.3 else "ok")`,
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
        title: "Imputar mediana de no-nulos (no cero)",
        preamble:
          "- **Contexto:** con cap respetado, el relleno permitido de monto no es `0` (cero de negocio falso en ticket PEN).\n- **Meta:** calcular mediana skipna y `fillna` con ese valor.\n- **Éxito:** `1.5 [1.0, 2.0, 1.5]`.\n- **Límites:** no uses mean por defecto aquí; no rellenes con 0.",
        instruction:
          "1. El starter fija `med = 0.0` y `fillna(0.0)` (DEFECT).\n2. Calcula `med = s.median()` (ignora NaN).\n3. Rellena con `med`.\n4. Imprime `float(med)` y la lista final.",
        hint: "med = s.median() (skipna por defecto); fillna(med).",
        hints: [
          "median() ignora NaN por defecto.",
          "print(float(med), filled.tolist()).",
        ],
        edgeCases: ["mean vs. median", "fillna 0"],
        tests: "salida coincide con solution output",
        feedback:
          "`fillna(0)` inventa un cero de negocio y sesga KPIs de ticket PEN. Usa `median()` de no-nulos (skipna) y rellena con esa mediana pre-fill; no recalcules la mediana después del fill para maquillar el reporte.",
        retrospective:
          "Mediana pre-fill es la regla documentada del gate cuando el cap lo permite. Rellenar con 0 inventa volumen y sesga KPIs. Cierra T1-B: indicador → cap → relleno justificado. En T2-A clasificarás filas, no solo celdas.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · imputación por mediana
# Pista: no uses 0; calcula med = s.median() y fillna(med)
import pandas as pd
s = pd.Series([1.0, 2.0, None])
med = 0.0
filled = s.fillna(0.0)
print(float(med), filled.tolist())`,
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
        title: "Contar filas de duplicado exacto (keep=False)",
        preamble:
          "- **Contexto:** para cuarentena o log, necesitas **todas** las copias del grupo exacto, no solo “la segunda”.\n- **Meta:** contar filas con `duplicated(keep=False)`.\n- **Éxito:** entero `2` con el fixture.\n- **Límites:** no uses `drop` aún; no dejes el default de `keep`.",
        instruction:
          "1. El starter usa `duplicated()` sin `keep=False` (DEFECT).\n2. Marca todas las copias del grupo exacto.\n3. Suma la máscara e imprime el entero.\n4. No modifiques el DataFrame.",
        hint: "duplicated(keep=False) marca TODAS las copias, no solo la segunda.",
        hints: [
          "duplicated(keep=False).sum() cuenta todas las filas del grupo duplicado.",
          "keep por defecto (True) omite la primera aparición.",
        ],
        edgeCases: ["keep='first' cuenta 1", "solo subset cols"],
        tests: "salida coincide con solution output",
        feedback:
          "Si contaste 1, usaste el default de `duplicated` (omite la primera). `keep=False` marca todas las copias del grupo; el default es para drop, no para inventario de cuarentena.",
        retrospective:
          "`keep=False` es la máscara de **evidencia** del grupo; el default de `duplicated` sirve para drop, no para inventariar cuarentena. Contar 1 cuando hay 2 filas idénticas subestima el rastro. Pregunta: ¿cuántas filas debe ver el auditor del grupo exacto? Siguiente (E2): conflictos multi-región.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · filas exactas duplicadas
# Pista: keep=False incluye todas las copias; el default no
import pandas as pd
df = pd.DataFrame({"a": [1, 1, 2], "b": [0, 0, 9]})
print(int(df.duplicated().sum()))`,
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
        title: "Listar cliente_id con conflicto de región",
        preamble:
          "- **Contexto:** misma clave con regiones distintas no es “duplicado exacto”; es conflicto que envenena el maestro.\n- **Meta:** listar ids con `region.nunique() > 1`.\n- **Éxito:** `['C001']` (C002 no entra).\n- **Límites:** no uses solo `duplicated` de filas completas; no inviertas el umbral de nunique.",
        instruction:
          "1. Agrupa por `cliente_id` y mide nunique de `region`.\n2. El starter filtra `ids == 1` (DEFECT: lista “limpios”).\n3. Filtra `ids > 1` e imprime el índice como lista.\n4. Sin drop ni fill.",
        hint: "groupby nunique > 1 sobre region.",
        hints: [
          "ids = df.groupby('cliente_id')['region'].nunique()",
          "print(ids[ids > 1].index.tolist())",
        ],
        edgeCases: ["duplicated exacto solo", "filter mal"],
        tests: "salida coincide con solution output",
        feedback:
          "Si listaste C002 o ids sin conflicto, usaste `nunique == 1`. Conflicto es `nunique > 1` sobre región; listar limpios no es listar problemas del maestro.",
        retrospective:
          "Conflicto = misma clave, atributos distintos. Listar limpios no es listar problemas del maestro. Pregunta: ¿por qué C002 no debe aparecer en la lista de conflicto del fixture? Luego (E3) etiquetas exact / conflict / clean en un solo id de prueba.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · conflictos multi-región
# Pista: conflicto es nunique > 1, no == 1
import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001", "C001", "C002"], "region": ["Lima", "Cusco", "Lima"]})
ids = df.groupby("cliente_id")["region"].nunique()
print(ids[ids == 1].index.tolist())`,
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
        title: "Clasificar exact, conflict o clean",
        preamble:
          "- **Contexto:** el runbook del gate elige acción **después** de clasificar; imprimir `clean` sin mirar es el anti-patrón.\n- **Meta:** para C001 del fixture, emitir `exact`, `conflict` o `clean`.\n- **Éxito:** `conflict` (Lima vs. Cusco).\n- **Límites:** clasifica antes de borrar; no asumas clean.",
        instruction:
          "1. Filtra el subconjunto del id C001.\n2. Si hay más de una región distinta → `conflict`.\n3. Si las filas son copias exactas → `exact`; si no, `clean`.\n4. Imprime una sola etiqueta.",
        hint: "Misma clave + region.nunique()>1 → conflict.",
        hints: [
          "Filtra sub = df[df.cliente_id == 'C001'].",
          "Si region.nunique() > 1 imprime conflict; si filas exactas, exact; si no, clean.",
        ],
        edgeCases: ["orden de if", "sin filtrar id"],
        tests: "salida coincide con solution output",
        feedback:
          "Lima vs. Cusco en el mismo `cliente_id` es conflicto, no clean. Clasifica con nunique de región antes de borrar; no asumas clean a ciegas.",
        retrospective:
          "El orden clasificar→actuar evita borrar el rastro del conflicto. Lima/Cusco en el mismo `cliente_id` nunca es `clean`. Pregunta: si `score` es idéntico pero `region` difiere, ¿es exact o conflict? Cierra T2-A. En T2-B partirás clean vs. quarantine con evidencia.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · exact vs. conflict vs. clean
# Pista: el fixture tiene conflicto de región; no imprimas clean a ciegas
import pandas as pd
df = pd.DataFrame({
    "cliente_id": ["C001", "C001"],
    "region": ["Lima", "Cusco"],
    "score": [1.0, 1.0],
})
print("clean")`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({
    "cliente_id": ["C001", "C001"],
    "region": ["Lima", "Cusco"],
    "score": [1.0, 1.0],
})
sub = df[df.cliente_id == "C001"]
if len(sub) > 1 and sub.duplicated(keep=False).all() and sub["region"].nunique() == 1:
    print("exact")
elif sub["region"].nunique() > 1:
    print("conflict")
else:
    print("clean")`,
          output: `conflict`,
        },
      },
      {
        id: "S16-T2-B-E1",
        subtopicId: "S16-T2-B",
        kind: "guided",
        title: "Separar quarantine y clean por clave",
        preamble:
          "- **Contexto:** al resolver clave duplicada, el gate parte evidencia (todas las dups) y clean (una fila por id).\n- **Meta:** imprimir `len(quarantine)` y `len(clean)` con keep first.\n- **Éxito:** `2 2` en el fixture (dos filas en q; dos ids en clean).\n- **Límites:** no pierdas quarantine; documenta keep; no uses keep last sin regla.",
        instruction:
          "1. El starter imprime `0` y usa `keep=\"last\"` (DEFECT).\n2. Arma `q` con `duplicated(id, keep=False)`.\n3. Arma `c` con `drop_duplicates(id, keep=\"first\")`.\n4. Imprime `len(q), len(c)`.",
        hint: "q = mask duplicated(key, keep=False); c = drop keep first.",
        hints: [
          "duplicated(key, keep=False) arma la cuarentena completa.",
          "print(len(q), len(c)) con keep='first' en clean.",
        ],
        edgeCases: ["perder q", "keep last sin documentar"],
        tests: "salida coincide con solution output",
        feedback:
          "Si imprimiste `0` en quarantine, no armaste la máscara `duplicated(..., keep=False)`. Si usaste solo `keep='last'` sin armar `q`, pierdes el inventario de evidencia aunque el clean tenga dos ids. Separa `q` (todas las dups) y `c` (`keep='first'` documentado).",
        retrospective:
          "Quarantine completa + clean documentado es el split auditable. Contar 0 en `q` es mentir al auditor. Pregunta: ¿por qué `len(q)` puede ser 2 y `len(c)` también 2 en el mismo fixture? Siguiente (E2): conservar columnas de evidencia, no solo la clave.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · split quarantine / clean
# Pista: arma quarantine con duplicated(keep=False) y clean con keep first
import pandas as pd
df = pd.DataFrame({"id": ["a", "a", "b"], "v": [1, 2, 3]})
c = df.drop_duplicates("id", keep="last")
print(0, len(c))`,
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
        title: "Conservar columnas de evidencia en cuarentena",
        preamble:
          "- **Contexto:** sin `batch` (u origen), el auditor no reconstruye de dónde vino cada versión de la clave.\n- **Meta:** cuarentena con **todas** las columnas del df filtrado.\n- **Éxito:** `['id', 'batch']`.\n- **Límites:** no proyectes solo la clave; no dropees cols de evidencia.",
        instruction:
          "1. El starter selecciona solo `[\"id\"]` tras el mask (DEFECT).\n2. Filtra dups con `keep=False` y `copy()`.\n3. No subselecciones columnas.\n4. Imprime `q.columns.tolist()`.",
        hint: "Filtra dups con mask y copy(); no dropear cols de evidencia.",
        hints: [
          "q = df[df.duplicated('id', keep=False)].copy() — sin seleccionar solo ['id'].",
          "print(q.columns.tolist()) debe incluir batch, no solo id.",
        ],
        edgeCases: ["solo id", "sin batch", "imprimir columnas del df sin filtrar dups"],
        tests: "salida coincide con solution output",
        feedback:
          "Si imprimiste solo `['id']`, perdiste la evidencia de `batch`. La cuarentena es la fila completa: sin origen/batch no hay reconstrucción auditable de por qué se eligió una versión de la clave.",
        retrospective:
          "Evidencia = fila completa del conflicto/dup. Proyectar solo la clave convierte la cuarentena en un id inútil. Luego (E3) chequearás si el clean puede ser 1:1 para S17.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · columnas de evidencia en cuarentena
# Pista: no proyectes solo la clave; conserva batch en la cuarentena
import pandas as pd
df = pd.DataFrame({"id": ["a", "a"], "batch": ["b1", "b2"]})
q = df[df.duplicated("id", keep=False)][["id"]].copy()
print(q.columns.tolist())`,
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
        title: "Validar cardinalidad 1:1 por id",
        preamble:
          "- **Contexto:** S17 hará joins asumiendo una fila por cliente; si el clean tiene clave duplicada, el join miente.\n- **Meta:** comparar `nunique(id)` con `len(df)`.\n- **Éxito:** `card_bad` en el fixture con id repetido.\n- **Límites:** no asumas card_ok; no compares con nunique de todas las columnas.",
        instruction:
          "1. El starter imprime `card_ok` sin medir (DEFECT).\n2. Si cada id aparece una vez → `card_ok`; si no → `card_bad`.\n3. Imprime una sola etiqueta.\n4. No dropees filas en este ejercicio.",
        hint: "Compara nunique de id con len(df); no asumas card_ok.",
        hints: [
          "card_ok solo si cada id aparece una vez.",
          "print('card_ok' if df['id'].nunique() == len(df) else 'card_bad').",
        ],
        edgeCases: ["nunique dropna", "comparar con nunique cols"],
        tests: "salida coincide con solution output",
        feedback:
          "Con id duplicado la cardinalidad 1:1 falla: el oracle es `card_bad`, no `card_ok`. Asumir ok a ciegas es el mismo anti-patrón que `pass` sin medir.",
        retrospective:
          "Cardinalidad 1:1 es un contrato del clean hacia S17, no un detalle cosmético. `card_ok` a ciegas es el mismo anti-patrón que `pass` sin medir. Pregunta: si `nunique(id) < len(df)`, ¿qué le pasa a un join one-to-one en S17? Cierra T2. En T3-A normalizarás sin borrar el raw.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · cardinalidad 1:1 por id
# Pista: el fixture tiene id duplicado; no imprimas card_ok a ciegas
import pandas as pd
df = pd.DataFrame({"id": ["a", "a"], "v": [1, 2]})
print("card_ok")`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"id": ["a", "a"], "v": [1, 2]})
print("card_ok" if df["id"].nunique() == len(df) else "card_bad")`,
          output: `card_bad`,
        },
      },
      {
        id: "S16-T3-A-E1",
        subtopicId: "S16-T3-A",
        kind: "guided",
        title: "Normalizar región con strip y title",
        preamble:
          "- **Contexto:** ` lima ` y `CUSCO` no deben generar tres buckets en un groupby de regiones PE.\n- **Meta:** aplicar `strip` + `title` a la Series.\n- **Éxito:** `['Lima', 'Cusco']`.\n- **Límites:** no uses solo lower; no borres el raw si el lab lo pide en columnas separadas (aquí solo Series).",
        instruction:
          "1. El starter solo hace strip (DEFECT).\n2. Encadena `.str.title()` tras strip.\n3. Imprime `.tolist()`.\n4. Sin replace manual de cada ciudad.",
        hint: "str.strip().str.title() en cadena.",
        hints: [
          "s.str.strip().str.title().tolist()",
          "Solo strip no capitaliza CUSCO → Cusco.",
        ],
        edgeCases: ["solo lower", "sin strip"],
        tests: "salida coincide con solution output",
        feedback:
          "Si quedó `CUSCO` o con espacios, faltó title o strip. Encadena `strip().title()` sobre la Series; solo strip deja el ruido de mayúsculas para el groupby.",
        retrospective:
          "Canonicidad de strings es el primer filtro antes de mapas de sinónimos (`LIM`→Lima). Solo strip deja `CUSCO` ruidoso y parte el groupby de regiones PE. Pregunta: ¿qué buckets falsos evitas con `title` en este fixture? Siguiente (E2): locale de montos PEN.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · strip + title
# Pista: después de strip aplica title
import pandas as pd
s = pd.Series([" lima ", "CUSCO"])
print(s.str.strip().tolist())`,
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
        title: "Parsear montos PEN con decimal latino",
        preamble:
          "- **Contexto:** en un batch sintético PEN, `3,00` es tres soles, no trescientos; borrar la coma a ciegas infla el ticket promedio.\n- **Meta:** quitar `S/` y tratar **solo coma** como decimal latino; sumar.\n- **Éxito:** `4.5` (1.5 + 3.0).\n- **Límites:** no uses `replace(',', '')` como miles por defecto; no dejes el prefijo `S/`.",
        instruction:
          "1. Revisa `norm_money` del starter: borra comas (DEFECT).\n2. Si hay coma y no hay punto, reemplaza coma por punto.\n3. Convierte a float y suma la serie.\n4. Imprime un solo float.",
        hint: "Quita S/; si hay coma sin punto de miles, reemplaza coma por punto antes del float.",
        hints: [
          "Contrato: solo coma ⇒ decimal latino (3,00 → 3.0).",
          "print(float(series.map(norm_money).sum())) → 4.5",
        ],
        edgeCases: ["borrar coma como miles", "dejar S/", "tratar 3,00 como 300"],
        tests: "salida coincide con solution output",
        feedback:
          "Si obtuviste ~301.5, borraste la coma como miles. Con solo coma, `3,00` es decimal latino → 3.0; suma 4.5. Locale documentado evita bugs silenciosos de negocio.",
        retrospective:
          "Locale documentado es parte del contrato del gate, no un “detalle de formato”. `3,00` → 300 es un bug de negocio silencioso que infla el ticket promedio. Pregunta: con solo coma, ¿decimal latino o miles? Luego (E3) conservarás el raw al crear la columna canónica.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · montos PEN con decimal latino
# Pista: borrar la coma a ciegas convierte 3,00 en 300 (error de locale)
import pandas as pd

def norm_money(x):
    s = str(x).strip().replace("S/", "").replace(",", "")
    return float(s)

s = pd.Series(["S/1.5", "3,00"])
print(float(s.map(norm_money).sum()))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd

def norm_money(x):
    s = str(x).strip().replace("S/", "").strip()
    # Solo coma → decimal latino; no borrar dígitos
    if "," in s and "." not in s:
        s = s.replace(",", ".")
    return float(s)

s = pd.Series(["S/1.5", "3,00"])
print(float(s.map(norm_money).sum()))`,
          output: `4.5`,
        },
      },
      {
        id: "S16-T3-A-E3",
        subtopicId: "S16-T3-A",
        kind: "transfer",
        title: "Crear region canónica sin pisar el raw",
        preamble:
          "- **Contexto:** si normalizas **en** `region_raw`, pierdes el valor original y no puedes defender el transform ante auditoría.\n- **Meta:** escribir canónico en `region` y dejar `region_raw` intacto.\n- **Éxito:** `['lima'] ['Lima']`.\n- **Límites:** no dropees el raw; no sobreescribas la columna original.",
        instruction:
          "1. El starter asigna title sobre `region_raw` (DEFECT).\n2. Crea `df[\"region\"]` desde el raw.\n3. Imprime raw y luego canónica.\n4. Verifica mentalmente que raw sigue en minúsculas.",
        hint: "Nueva col region; no pises region_raw.",
        hints: [
          "df['region'] = df['region_raw'].str.title() — columna nueva, no overwrite.",
          "print(df['region_raw'].tolist(), df['region'].tolist()) → ['lima'] ['Lima'].",
        ],
        edgeCases: ["overwrite raw", "drop raw"],
        tests: "salida coincide con solution output",
        feedback:
          "Si `region_raw` quedó en Title Case, lo pisaste. Escribe en `region` y deja el raw intacto: sin original no hay disputa auditable del transform.",
        retrospective:
          "Raw al lado = transform disputable. Pisar el original es normalizar de forma no auditable. Pregunta: si solo queda `region` en Title Case, ¿puedes defender el valor de entrada ante auditoría? Cierra T3-A. En T3-B clasificarás outliers sin borrar colas legítimas.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · conservar region_raw
# Pista: escribe en una columna nueva, no pises el raw
import pandas as pd
df = pd.DataFrame({"region_raw": ["lima"]})
df["region_raw"] = df["region_raw"].str.title()
print(df["region_raw"].tolist(), df.get("region", pd.Series([])).tolist())`,
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
        title: "Marcar domain_error en montos negativos",
        preamble:
          "- **Contexto:** en el contrato de montos del gate, un valor < 0 es error de dominio, no “outlier curioso”.\n- **Meta:** emitir máscara booleana `s < 0`.\n- **Éxito:** `[False, True, False]`.\n- **Límites:** no uses IQR aquí; no inviertas a `>= 0`.",
        instruction:
          "1. El starter imprime `(s >= 0)` (DEFECT).\n2. Cambia a `s < 0`.\n3. Imprime `.tolist()`.\n4. Sin abs ni drop.",
        hint: "Máscara s < 0; tolist().",
        hints: [
          "(s < 0).tolist() marca solo negativos.",
          "No uses >= 0 (eso invierte la semántica de error).",
        ],
        edgeCases: ["usar abs", "IQR only"],
        tests: "salida coincide con solution output",
        feedback:
          "Si True está en positivos, invertiste la máscara. `domain_error` es `s < 0` (True en el negativo). Domain bounds son reglas de negocio, no estadística.",
        retrospective:
          "Domain bounds son reglas de negocio, no estadística: un monto negativo no es “outlier curioso”. Si la máscara marca positivos, el gate cuarentenará filas válidas. Pregunta: ¿por qué este lab **prohíbe** IQR a propósito? Siguiente (E2): candidatos IQR en una capa aparte.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · máscara domain_error (negativos)
# Pista: error de dominio es s < 0, no s >= 0
import pandas as pd
s = pd.Series([1.0, -2.0, 3.0])
print((s >= 0).tolist())`,
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
        title: "Listar outliers IQR con ambos fences",
        preamble:
          "- **Contexto:** el flag estadístico usa IQR 1.5 a **ambos** lados; un solo fence deja colas inferiores sin marcar.\n- **Meta:** listar valores fuera de `[q1-1.5*iqr, q3+1.5*iqr]`.\n- **Éxito:** `[100.0]` en el fixture.\n- **Límites:** no dropees filas; no uses z-score aquí; domain se evalúa aparte.",
        instruction:
          "1. Calcula q1, q3 e iqr.\n2. El starter solo mira el upper fence (DEFECT de hábito).\n3. Une lower y upper con `|`.\n4. Imprime `s[mask].tolist()`.",
        hint: "Fence inferior y superior: q1-1.5*iqr y q3+1.5*iqr.",
        hints: [
          "q1, q3 = quantile 0.25/0.75; iqr = q3 - q1.",
          "mask = (s < q1 - 1.5*iqr) | (s > q3 + 1.5*iqr).",
        ],
        edgeCases: ["std z confuso", "dropear sin listar"],
        tests: "salida coincide con solution output",
        feedback:
          "Si la lista está vacía, solo miraste un lado del fence o calculaste mal iqr. Incluye lower y upper con 1.5*iqr: el fixture solo ejercita upper, pero la máscara bilateral es el hábito del gate.",
        retrospective:
          "IQR propone candidatos; no decide borrar. Ambos fences evitan ceguera a un lado aunque el fixture solo ejercite el upper. Pregunta: si mañana llega un −50 legible por domain, ¿la máscara IQR bilateral lo habría visto como candidato? Luego (E3) combinas dominio + IQR en etiquetas error/flag/ok.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · outliers IQR
# Pista: usa fence inferior Y superior, no solo upper
import pandas as pd
s = pd.Series([1.0, 2.0, 3.0, 100.0])
q1, q3 = s.quantile(0.25), s.quantile(0.75)
iqr = q3 - q1
mask = s > q3 + 1.5 * iqr
print(s[mask].tolist())`,
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
        title: "Etiquetar error, flag u ok por monto",
        preamble:
          "- **Contexto:** el memo del gate no puede decir solo “raro”: debe distinguir error de dominio, flag estadístico y valor ok.\n- **Meta:** para probes `[5000, -1, 10]`, priorizar domain sobre IQR.\n- **Éxito:** `['flag', 'error', 'ok']`.\n- **Límites:** no marques error por IQR solo; no drops; dominio: <0 o >10000.",
        instruction:
          "1. Calcula q1/q3/iqr sobre toda la serie.\n2. Para cada valor de prueba: si domain → `error`; elif stat → `flag`; else `ok`.\n3. El starter imprime tres `ok` (DEFECT).\n4. Imprime la lista de etiquetas.",
        hint: "Domain primero; luego IQR; resto ok.",
        hints: [
          "Calcula q1/q3/iqr sobre toda la serie.",
          "Para cada valor de prueba: if domain → error; elif stat → flag; else ok.",
        ],
        edgeCases: ["flag en error", "drop"],
        tests: "salida coincide con solution output",
        feedback:
          "5000 es flag (cola estadística), -1 es error de dominio, 10 es ok. Domain manda sobre IQR: no marques error por IQR solo ni asumas todo ok.",
        retrospective:
          "Prioridad dominio → estadística → ok es el contrato de outliers del gate. 5000 puede ser cola legítima (flag); -1 no. Pregunta: si un valor es domain_error y también IQR, ¿qué etiqueta gana y por qué? Cierra T3. En T4-A el contrato pasa a schema y reglas cross-field.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · etiquetas error / flag / ok
# Pista: no marques todo ok; combina dominio e IQR
import pandas as pd
s = pd.Series([10.0, 12.0, 11.0, 13.0, 5000.0, -1.0])
probes = [5000.0, -1.0, 10.0]
print(["ok", "ok", "ok"])`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
s = pd.Series([10.0, 12.0, 11.0, 13.0, 5000.0, -1.0])
q1, q3 = s.quantile(0.25), s.quantile(0.75)
iqr = q3 - q1
labels = []
for v in [5000.0, -1.0, 10.0]:
    domain = (v < 0) or (v > 10000)
    stat = (v < q1 - 1.5 * iqr) or (v > q3 + 1.5 * iqr)
    if domain:
        labels.append("error")
    elif stat:
        labels.append("flag")
    else:
        labels.append("ok")
print(labels)`,
          output: `['flag', 'error', 'ok']`,
        },
      },
      {
        id: "S16-T4-A-E1",
        subtopicId: "S16-T4-A",
        kind: "guided",
        title: "Listar columnas required faltantes",
        preamble:
          "- **Contexto:** si falta `monto` en el batch, el operador necesita ver `['monto']`, no un KeyError a mitad del pipeline.\n- **Meta:** comparar `required` con `df.columns`.\n- **Éxito:** `['monto']`.\n- **Límites:** no trates columnas extra como fail aquí; no devuelvas lista vacía a ciegas.",
        instruction:
          "1. El starter imprime `[]` sin comparar (DEFECT).\n2. Lista comprehension: `c not in df.columns`.\n3. Imprime la lista de faltantes.\n4. No mutes el DataFrame.",
        hint: "List comprehension: c not in df.columns.",
        hints: [
          "[c for c in required if c not in df.columns]",
          "No devuelvas lista vacía a ciegas.",
        ],
        edgeCases: ["extra cols como fail", "set silent"],
        tests: "salida coincide con solution output",
        feedback:
          "Si imprimiste `[]` a ciegas, no comparaste required con `df.columns`. Falta monto → `['monto']`. Lista vacía fingida es el anti-patrón del gate silencioso.",
        retrospective:
          "Missing columns = schema drift **legible** para el operador del job (nombres de columna, no KeyError opaco). Lista vacía fingida es el anti-patrón del gate silencioso. Pregunta: ¿qué columna debe aparecer en la lista del fixture y por qué `id` no? Siguiente (E2): inconsistencias entre campos ya presentes.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · columnas required faltantes
# Pista: compara required contra df.columns
import pandas as pd
df = pd.DataFrame({"id": [1]})
required = ["id", "monto"]
print([])`,
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
        title: "Índices donde fin es anterior a inicio",
        preamble:
          "- **Contexto:** una vigencia con `fin < inicio` rompe el contrato temporal aunque las columnas existan.\n- **Meta:** listar índices de la máscara `fin < inicio`.\n- **Éxito:** `[1]` en el fixture.\n- **Límites:** parsea fechas (ya vienen como datetime); no compares strings crudos; no inviertas la desigualdad.",
        instruction:
          "1. El starter usa `fin > inicio` (DEFECT: lista válidos).\n2. Cambia a `fin < inicio`.\n3. Imprime `df.index[mask].tolist()`.\n4. Sin rellenar fechas.",
        hint: "Máscara fin < inicio; index[mask].tolist().",
        hints: [
          "df['fin'] < df['inicio'] con datetimes parseadas.",
          "print(df.index[mask].tolist())",
        ],
        edgeCases: ["string compare", "sin parse dates"],
        tests: "salida coincide con solution output",
        feedback:
          "Si listaste el índice 0, invertiste la comparación. La falla es `fin < inicio` (fila 1 del fixture). Cross-field = reglas entre columnas, no solo presencia.",
        retrospective:
          "Cross-field = reglas entre columnas, no solo presencia. Invertir la máscara “falla” las filas buenas de vigencia. Pregunta: si `fin > inicio` en la fila 0, ¿debe entrar a `cross_fail`? Luego (E3) el flag de drift del schema cierra el gate de columnas.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · cross-field fin < inicio
# Pista: la falla es fin < inicio, no fin > inicio
import pandas as pd
df = pd.DataFrame({
    "inicio": pd.to_datetime(["2024-01-01", "2024-06-01"]),
    "fin": pd.to_datetime(["2024-02-01", "2024-05-01"]),
})
print(df.index[df["fin"] > df["inicio"]].tolist())`,
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
        title: "Flag de schema drift fail-closed",
        preamble:
          "- **Contexto:** medir `missing` y aun así imprimir `schema_ok` es el mismo error que el job que “aprueba en silencio”.\n- **Meta:** emitir `drift` si hay required faltantes; si no, `schema_ok`.\n- **Éxito:** `drift` en el fixture sin `monto`.\n- **Límites:** usa la lista missing; no asumas ok; no tragues KeyError sin mensaje.",
        instruction:
          "1. Ya tienes `missing` calculado.\n2. El starter ignora missing e imprime `schema_ok` (DEFECT).\n3. Imprime `drift` si missing no vacío; si no, `schema_ok`.\n4. Una sola etiqueta.",
        hint: "Usa lista missing; no asumas schema_ok.",
        hints: [
          "missing = [c for c in required if c not in df.columns]",
          "print('drift' if missing else 'schema_ok')",
        ],
        edgeCases: ["siempre ok", "KeyError sin mensaje"],
        tests: "salida coincide con solution output",
        feedback:
          "Falta monto en required: el gate debe decir `drift`, no `schema_ok`. Fail-closed ante schema drift: calcular missing y no usarlo es teatro de validación.",
        retrospective:
          "Fail-closed ante drift protege a S17 y a quien consume el clean. Calcular `missing` y no usarlo es teatro de validación. Pregunta: ¿qué etiqueta imprime el gate si `missing` es no vacío? Cierra T4-A. En T4-B publicarás métricas y audit aunque el gate falle.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · schema drift flag
# Pista: usa missing; no imprimas schema_ok a ciegas
import pandas as pd
df = pd.DataFrame({"id": [1]})
missing = [c for c in ["id", "monto"] if c not in df.columns]
print("schema_ok")`,
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
        title: "Armar el bloque metrics del run",
        preamble:
          "- **Contexto:** el operador del job necesita un dict serializable: cuántas entraron, cuántas salieron limpias, cuántas a cuarentena y si el run aprobó.\n- **Meta:** construir `metrics` y serializar con `json.dumps(..., sort_keys=True)`.\n- **Éxito:** `{\"pass\": false, \"rows_clean\": 7, \"rows_in\": 10, \"rows_quarantine\": 3}`.\n- **Límites:** `rows_clean = rows_in - len(quarantine)`; `pass` solo si quarantine vacía; no inventes literales sueltos.",
        instruction:
          "1. El starter suma quarantine a rows_in y pone pass True (DEFECT).\n2. Corrige `rows_clean` por resta.\n3. `pass = (len(quarantine) == 0)`.\n4. Imprime el JSON con claves ordenadas.",
        hint: "rows_clean = rows_in - len(quarantine); pass = (len(quarantine) == 0).",
        hints: [
          "No sumes filas rechazadas a rows_in; resta para rows_clean.",
          "json.dumps(metrics, sort_keys=True) fija el orden de claves del oracle.",
        ],
        edgeCases: ["porcentaje", "sumar en vez de restar", "pass True con cuarentena"],
        tests: "salida coincide con solution output",
        feedback:
          "Con 3 en cuarentena, `rows_clean=7` y `pass=false`. Las métricas se derivan del conteo real: sumar rechazos a `rows_in` o forzar `pass: True` es un bug de reporting.",
        retrospective:
          "Las métricas se **derivan** del conteo real, no de literales optimistas. Sumar rechazos a `rows_in` o forzar `pass: True` es un bug de reporting. Pregunta: con 10 in y 3 en quarantine, ¿qué es `rows_clean` y por qué `pass` es false? Siguiente (E2): el audit no se pisa al fallar.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · bloque metrics del run
# Pista: rows_clean = rows_in - len(quarantine); pass solo si quarantine vacía
import json
rows_in = 10
quarantine = [
    {"id": "C002", "reason": "null_required"},
    {"id": "C004", "reason": "domain_error"},
    {"id": "C007", "reason": "schema_drift"},
]
metrics = {
    "rows_in": rows_in,
    "rows_clean": rows_in + len(quarantine),
    "rows_quarantine": len(quarantine),
    "pass": True,
}
print(json.dumps(metrics, sort_keys=True))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import json
rows_in = 10
quarantine = [
    {"id": "C002", "reason": "null_required"},
    {"id": "C004", "reason": "domain_error"},
    {"id": "C007", "reason": "schema_drift"},
]
metrics = {
    "rows_in": rows_in,
    "rows_clean": rows_in - len(quarantine),
    "rows_quarantine": len(quarantine),
    "pass": len(quarantine) == 0,
}
print(json.dumps(metrics, sort_keys=True))`,
          output: `{"pass": false, "rows_clean": 7, "rows_in": 10, "rows_quarantine": 3}`,
        },
      },
      {
        id: "S16-T4-B-E2",
        subtopicId: "S16-T4-B",
        kind: "independent",
        title: "Append del evento quarantine sin pisar start",
        preamble:
          "- **Contexto:** el audit trail es append-only: el evento `start` no se borra cuando llega `quarantine`.\n- **Meta:** agregar un evento con `n=2` y reportar longitud + último event.\n- **Éxito:** `2 quarantine`.\n- **Límites:** no reasignes `audit = [solo el último]`; no omitas `n`.",
        instruction:
          "1. El starter reasigna la lista y pierde `start` (DEFECT).\n2. Usa `append` del dict `quarantine`.\n3. Imprime `len(audit)` y `audit[-1][\"event\"]`.\n4. Sin borrar eventos previos.",
        hint: "append del dict; luego print(len, audit[-1]['event']).",
        hints: [
          "append no pisa el evento start previo.",
          "print(len(audit), audit[-1]['event']) → 2 quarantine",
        ],
        edgeCases: ["overwrite de lista", "omitir n", "solo imprimir len"],
        tests: "salida coincide con solution output",
        feedback:
          "Si len es 1, reasignaste la lista y perdiste el evento `start`. Usa `append` para historial append-only: reasignar es perder la historia del run.",
        retrospective:
          "Append-only permite reconstruir el run; reasignar es perder historia. Len=1 con solo quarantine es un audit mentiroso. Pregunta: ¿qué evento debe seguir visible en `audit[0]` después del append? Luego (E3) el booleano `pass` cierra el contrato fail-closed.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · audit trail append-only
# Pista: append del evento quarantine; no reasignes audit = [solo el último]
audit = [{"event": "start"}]
audit = [{"event": "quarantine", "n": 2}]  # error: pisa el historial
print(len(audit), audit[-1]["event"])`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `audit = [{"event": "start"}]
audit.append({"event": "quarantine", "n": 2})
print(len(audit), audit[-1]["event"])`,
          output: `2 quarantine`,
        },
      },
      {
        id: "S16-T4-B-E3",
        subtopicId: "S16-T4-B",
        kind: "transfer",
        title: "metrics.pass False si hay cuarentena",
        preamble:
          "- **Contexto:** con filas en cuarentena, `pass` debe ser False; invertir la comparación aprueba un batch roto.\n- **Meta:** fijar `pass = (n_q == 0)` y imprimir el booleano.\n- **Éxito:** `False` cuando `n_q=1`.\n- **Límites:** no omitas la métrica; no pongas True “para no alarmar”.",
        instruction:
          "1. El starter usa `n_q > 0` (DEFECT: True con cuarentena).\n2. Cambia a `n_q == 0`.\n3. Imprime `metrics[\"pass\"]`.\n4. No alteres `rows_quarantine`.",
        hint: "pass = (n_q == 0); no inviertas la lógica.",
        hints: [
          "metrics['pass'] = n_q == 0",
          "print(metrics['pass']) → False cuando hay cuarentena.",
        ],
        edgeCases: ["pass True con q", "omitir métrica"],
        tests: "salida coincide con solution output",
        feedback:
          "Con `n_q=1`, `pass` debe ser False. Invertir la comparación (`n_q > 0`) aprueba un batch con cuarentena: el semáforo del job miente y rompe fail-closed aunque `rows_quarantine` diga la verdad.",
        retrospective:
          "`pass` es el semáforo del job, no un mensaje de marketing. True con cuarentena rompe fail-closed. Pregunta: ¿puedes tener `rows_quarantine > 0` y `pass=True` en un gate honesto? Cierra T4 y prepara el You Do: metrics + quarantine + audit juntos.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · metrics.pass fail-closed
# Pista: pass es True solo si n_q == 0
n_q = 1
metrics = {"pass": n_q > 0, "rows_quarantine": n_q}
print(metrics["pass"])`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `n_q = 1
metrics = {"pass": n_q == 0, "rows_quarantine": n_q}
print(metrics["pass"])`,
          output: `False`,
        },
      }
    ],
  },
  youDo: {
    title: "Quality gate explicable ante schema drift",
    context:
      "Tú lo haces (You Do). Implementa una suite de checks (verificaciones) sobre un dataset sintético de clientes y transacciones. Las regiones son Lima, Madrid y Cusco; los montos son PEN ficticios.\n\nLa suite debe cubrir:\n\n- null policies required/optional (políticas de nulos obligatorias u opcionales por campo)\n- duplicados exactos vs. conflictos, con evidencia\n- normalización con columna raw (valor original) lateral\n- outliers de dominio e IQR (rango intercuartílico)\n- contratos de schema y cross-field (reglas entre columnas)\n- cuarentena con audit trail append-only (rastro de auditoría donde solo se agregan eventos)\n\nEl conjunto limpio alimenta S17 y CP-N2-A. El gate es fail-closed (fallar de forma segura): si el contrato se rompe, el job no aprueba en silencio. Nunca arregles un dato sin métrica ni uses PII real (datos personales identificables).\n\nAceptación mínima del fixture del starter:\n\n1. cliente_id null en la fila 3 → el gate detecta null_required y manda la fila a cuarentena. No uses fillna mágico.\n2. C001 con Lima y Cusco → el gate detecta conflict_region (o etiqueta similar). No uses drop_duplicates ciego.\n3. monto -1.0 en C003 → el gate detecta domain_error. No borres solo por IQR.\n4. Resultado del run → metrics.pass == False y el JSON contiene rows_in, rows_clean y rows_quarantine.",
    objectives: [
      "Suite de checks que falla explicablemente ante drift, null required y domain_error",
      "Cuantificar pérdida de filas/campos con metrics.rows_in / rows_clean / rows_quarantine",
      "Nunca arreglar silenciosamente un dato (sin fillna mágico de required)",
      "Cuarentena y audit trail sintético append-only (ingest → checks → quarantine)",
      "Demo del fixture: null required, conflicto de región y domain_error de monto; metrics.pass=False con razones codificadas.",
    ],
    requirements: [
      "Fixtures sintéticos (ids C00x, regiones PE, montos S/ ficticios); sin PII real",
      "Función run_quality_gate(df, schema) → dict con claves obligatorias metrics, quarantine, audit (clean opcional)",
      "metrics incluye al menos: rows_in, rows_clean, rows_quarantine, pass (bool)",
      "quarantine: filas/registros con reason codificada (null_required | conflict_region | domain_error | schema_drift…)",
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
    - audit: list[dict] append-only (ingest → checks → quarantine)
    - clean (opcional): filas que pasan el gate

    Contrato pedagógico del fixture de demo:
    - null en cliente_id (required) → cuarentena / fail
    - C001 con dos regiones → conflicto (no drop ciego)
    - monto < 0 → domain_error
    - metrics["pass"] debe ser False; publica métricas igual

    No mutar df in-place sin copiar; no PII real; no arreglos silenciosos.
    """
    raise NotImplementedError


if __name__ == "__main__":
    df = pd.DataFrame({
        "cliente_id": ["C001", "C001", None, "C003"],
        "region": ["Lima", "Cusco", "Lima", "Madrid"],
        "monto": [10.0, 10.0, 5.0, -1.0],
    })
    schema = {"cliente_id": "required", "monto": "required", "region": "optional"}
    report = run_quality_gate(df, schema)
    assert set(report) >= {"metrics", "quarantine", "audit"}
    m = report["metrics"]
    assert {"rows_in", "rows_clean", "rows_quarantine", "pass"} <= set(m)
    assert m["pass"] is False, "El fixture debe fallar de forma explicable"
    assert m["rows_in"] == len(df)
    assert m["rows_quarantine"] >= 2, "El fixture debe poner al menos 2 filas en cuarentena (null + conflicto + domain_error)"
    print(m)
`,
    portfolioNote:
      "El gate debe emitir métricas incluso cuando `pass=False`. Ejemplo de forma esperada del JSON: {\"pass\": false, \"rows_in\": 4, \"rows_clean\": …, \"rows_quarantine\": …}. El conjunto `clean` (si lo publicas) es el único input válido para los joins y el portfolio de S17. Alinea las `reason` del quarantine con la tabla de aceptación del context (null_required, conflict_region, domain_error).",
    rubric: [
      { criterion: "Alineación al quality gate de la sección (fail-closed + métricas + cuarentena)", weight: "25%" },
      { criterion: "Correctitud técnica: null policy, duplicados/conflictos, domain, schema", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (fail explicable en el fixture)", weight: "15%" },
      { criterion: "Código legible y límites claros (no mutación silenciosa; audit append-only)", weight: "10%" },
      { criterion: "Documentación en español profesional (memo del gate)", weight: "10%" }
    ],
    retrospective:
      "Antes de marcar listo: (1) ¿qué invariante demuestras con `metrics.pass is False` y `rows_quarantine >= 2` en el fixture? (2) ¿qué reason codificada darías a null required, conflicto de región y monto negativo, y por qué no las “arreglas” con fillna o drop ciego? (3) En el memo, escribe una frase de impacto medible (filas fuera del clean / pass=False) que puedas defender en 30 segundos ante riesgo o cumplimiento. El clean, si lo publicas, es el único input válido para S17.",
  },
  selfCheck: {
    questions: [
      {
        question: "Un campo con política required que tiene nulls debe:",
        options: ["Imputarse siempre con 0", "Ignorarse si es <5% de filas", "Imputarse con la moda del campo", "Provocar violación/cuarentena o fail del gate"],
        correctIndex: 3,
        explanation:
          "Required implica presencia: null no se “arregla” en silencio; va a violations/cuarentena o tumba el gate con métricas.",
      },
      {
        question: "Duplicado exacto vs. conflicto de clave:",
        options: ["Son lo mismo y siempre se drop_duplicates", "Exacto = filas idénticas; conflicto = misma clave con atributos distintos", "Conflicto solo existe en SQL, no en pandas", "Exacto se resuelve con melt"],
        correctIndex: 1,
        explanation:
          "Clasifica antes de borrar: el conflicto requiere evidencia y regla de resolución; el exacto puede colapsarse tras log.",
      },
      {
        question: "Conservar region_raw al normalizar sirve para:",
        options: ["Elegir la forma más frecuente y descartar el resto", "Normalizar el texto antes de comparar para no duplicar categorías", "Auditar y disputar la forma canónica sin perder el valor original", "Registrar solo la forma canónica, que ya resume el original"],
        correctIndex: 2,
        explanation:
          "Normalizar ≠ borrar historia: el raw lateral permite auditoría y rollback conceptual del transform.",
      },
      {
        question: "IQR sin domain bounds es riesgoso porque:",
        options: ["Puede marcar (o borrar) colas legítimas de negocio como si fueran error", "Solo detecta valores extremos por arriba, nunca por abajo", "Depende del promedio, así que un extremo desplaza el umbral", "Necesita que la columna siga una distribución normal"],
        correctIndex: 0,
        explanation:
          "IQR solo identifica candidatos estadísticos; los bounds de dominio deciden error vs. flag plausible.",
      },
      {
        question: "Un quality gate que falla debe:",
        options: ["Ocultar métricas para no alarmar", "Imputar todos los nulls y reintentar en silencio", "Borrar el audit trail del run anterior", "Publicar métricas y cuarentena aunque pass=False"],
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
        options: ["Detener el job en el primer aviso, aunque sea recuperable", "Reintentar la limpieza hasta que el contrato pase", "Si el contrato se rompe, el job no aprueba en silencio: falla con métricas y cuarentena", "Aprobar el lote y registrar el incidente para el día siguiente"],
        correctIndex: 2,
        explanation:
          "Fail-closed protege al consumidor (S17, gerencia, riesgo): el gate publica el fallo con evidencia en lugar de “arreglar” y seguir.",
      },
      {
        question: "Ante dos filas con el mismo cliente_id y regiones distintas, la acción correcta es:",
        options: ["Clasificar como conflicto, conservar evidencia en cuarentena y documentar la regla de resolución", "Quedarse con el primer registro, que suele ser el más antiguo", "Elegir la región que aparece en más filas del conflicto", "Rellenar la región con la más frecuente del dataset completo"],
        correctIndex: 0,
        explanation:
          "Conflicto de atributo ≠ duplicado exacto: borrar a ciegas elimina la evidencia. Cuarentena y audit permiten revisión humana.",
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
