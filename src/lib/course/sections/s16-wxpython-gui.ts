import type { CourseSection } from '../../types'

export const section16: CourseSection = {
  id: "wxpython-gui",
  index: 16,
  title: "Calidad, limpieza y contratos de datos",
  shortTitle: "Calidad y contratos",
  tagline: "suite de calidad que falla de forma explicable ante schema drift, cuantifica pérdida y nunca arregla silenciosamente un dato",
  estimatedHours: 18,
  level: "Competente",
  phase: 1,
  icon: "ShieldCheck",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "Los equipos de datos en banca, fintech y retail en Perú necesitan **quality gates explicables**: políticas de null por campo, duplicados con evidencia, normalización con columna raw al lado, outliers con dominio y cuarentena con audit trail (rastro de auditoría). Aquí construyes el gate de calidad de **CP-N2-A**: falla de forma cerrada (**fail-closed**: si el contrato se rompe, el job no “aprueba” en silencio), sin PII real y sin arreglos silenciosos. Parte de la ingesta tipada de S15 y deja un set limpio + métricas para S17.",
  learningOutcomes: [
    { text: "Definir políticas de null required/optional y listar violaciones con conteo verificable (`isna` + mapa de campos)" },
    { text: "Limitar imputación con cap, indicadores de ausencia (`was_null`) y bloqueo si el rate supera el umbral" },
    { text: "Distinguir duplicados exactos de conflictos de atributo y clasificar antes de borrar" },
    { text: "Resolver claves con cardinalidad 1:1 documentada y conservar evidencia completa en cuarentena" },
    { text: "Normalizar strings, montos con locale PEN documentado, fechas multi-formato y categorías con mapa, sin borrar el raw" },
    { text: "Clasificar outliers como error de dominio, flag estadístico (IQR) o valor ok, con dominio prioritario" },
    { text: "Implementar contratos de schema, schema drift y reglas cross-field con códigos legibles en cuarentena" },
    { text: "Publicar métricas (rows_in/clean/quarantine/pass), cuarentena y audit trail append-only aunque pass=False" }
  ],
  theory: [
    {
      heading: "Mapa de la sección: del CSV tipado al quality gate",
      paragraphs: [
        "En S15 leíste clientes y transacciones con dtypes controlados. En **S16** el foco es el **quality gate de CP-N2-A**: políticas de null, imputación limitada con indicadores, duplicados vs conflictos, normalización, outliers, contratos de schema/cross-field y cuarentena con audit trail. Sin un gate, un `fillna` silencioso puede inflar un KPI de gerencia y nadie sabe qué filas se inventaron.",
        "Regla de oro: **nunca “arreglar” silenciosamente**. Toda transformación deja métrica, indicador o rastro en cuarentena. Datos sintéticos de clientes y montos (regiones Lima/Arequipa/Cusco, prefijos `S/`, ids `C00x`); nunca PII real ni DNIs de personas.",
        "Orden pedagógico: **T1 Ausencia** (required/optional, indicadores, cap de imputación) → **T2 Duplicados** (exactos vs conflictos, evidencia de clave) → **T3 Normalización** (strings/números/fechas/cats, outliers) → **T4 Contratos** (schema, cross-field, métricas y audit). Solo pandas + stdlib de S01–S16.",
      ],
      callout: {
        type: "info",
        title: "Regla de oro del gate",
        content:
          "Si no puedes explicar la transformación con una métrica o una fila en cuarentena, no la apliques. El set limpio de esta sección alimenta el portfolio y los joins de S17.",
      },
    },
    {
      heading: "nulls y políticas por campo",
      subtopicId: "S16-T1-A",
      paragraphs: [
        "Cada campo del contrato tiene política **required** (null ⇒ cuarentena o fail del gate) u **optional** (null permitido, idealmente con indicador de ausencia). Mezclar ambas sin documentar es la causa clásica de “defaults mágicos” que envenenan el EDA de S17.",
        "Contrato operativo: documenta un dict `{campo: 'required'|'optional'}`, mide con `isna`/`notna`, y arma un mapa `violations` solo para required con n>0. No imputes un required “para que pase el job”: eso oculta rotura de fuente y contamina el EDA posterior.",
        "Caso sintético Perú: `cliente_id` y `monto` required; `email` optional. Filas con id o monto nulo entran a violaciones; la tasa de null de email se reporta como métrica pero no tumba el gate por sí sola. Imprime `violations` y `null_rate` de opcionales en el reporte del run.",
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
      heading: "indicadores y límites de imputación",
      subtopicId: "S16-T1-B",
      paragraphs: [
        "Un **indicador de ausencia** (`monto_was_null`) preserva señal cuando imputas un optional: el modelo, el auditor y el stakeholder de riesgo ven qué filas fueron tocadas. Imputar sin indicador borra evidencia y crea falsos ceros indistinguibles de ceros reales de negocio.",
        "Límites del gate: no imputar más del **cap** (p. ej. 30–40% null en la columna), no imputar llaves de negocio (`cliente_id`), y documentar la regla (mediana, constante de dominio). Si `null_rate > cap`, el gate imprime `blocked`/`fail` y **no** rellena en silencio.",
        "Caso: monto con 2/5 null y cap=0.4 → se permite `fillna(mediana)` + columna `was_null`. Si el rate supera el cap, no hay fill silencioso. La mediana se calcula solo sobre no-nulos **pre**-imputación; post-fill no se recalcula para “maquillar” el reporte.",
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
      heading: "duplicados exactos vs conflictos",
      subtopicId: "S16-T2-A",
      paragraphs: [
        "**Duplicado exacto**: mismas columnas relevantes idénticas. **Conflicto**: misma clave de negocio con atributos distintos (p. ej. dos regiones para un `cliente_id`). Tratarlos igual con `drop_duplicates` ciego puede borrar el único rastro del conflicto y dejar un maestro mentiroso.",
        "Contrato: usa `duplicated(keep=False)` para exactos y `groupby(clave)[attr].transform('nunique')>1` para conflictos. Solo después eliges política `keep='first'|'last'` o envío a cuarentena. **Clasifica antes de borrar**; el orden evita pérdida de evidencia.",
        "Caso sintético: C001 repetido exacto (Lima, score 0.9); C002 con Cusco vs Arequipa. Salida esperada: `exact_rows` para C001 y `conflict_ids` para C002. El portfolio de calidad de CP-N2-A debe listar ambos tipos por separado en el memo.",
      ],
      code: {
        language: 'python',
        title: "dups.py",
        code: `def s16_th_3():
    import pandas as pd

    df = pd.DataFrame({
        "cliente_id": ["C001", "C001", "C002", "C002"],
        "region": ["Lima", "Lima", "Cusco", "Arequipa"],
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
      heading: "claves, cardinalidad y conservación de evidencia",
      subtopicId: "S16-T2-B",
      paragraphs: [
        "Define la **clave de negocio** y la cardinalidad esperada (típicamente 1 fila por cliente). Los duplicados de clave van a **cuarentena con evidencia completa** (todas las versiones + columnas de origen/batch), no se eliminan sin log append-only.",
        "Contrato: `clean = drop_duplicates(key, keep=...)` con regla documentada; `quarantine = filas con clave duplicada` sin pérdida de columnas. El set limpio alimenta joins de S17; el audit permite reconstruir por qué se eligió una versión ante revisión humana.",
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
      heading: "normalización de strings, números, fechas y categorías",
      subtopicId: "S16-T3-A",
      paragraphs: [
        "Normalización: strings (`strip`, colapso de espacios, `title`/`casefold`), números con **locale documentado** (no adivines), fechas multi-formato y categorías con mapa de sinónimos (`LIM`→`Lima`). **Normalizar ≠ imputar**: no inventes valores, solo canonicidad.",
        "Contrato de montos PEN sintéticos: quita `S/`; si hay **coma y punto**, el punto es miles y la coma es decimal (`1.250,5` → `1250.5`); si **solo coma**, es decimal latino (`3,00` → `3.0`); si **solo punto**, es decimal estilo anglosajón (`10.50` → `10.5`). Conserva **raw** en columna lateral (`region_raw`, `monto_raw`) cuando el valor canónico puede disputarse. Valida dtypes post-normalización **antes** del join de S17.",
        "Caso Perú sintético: regiones con espacios/`LIM`, montos `S/ 10.50`, `3,00` y `1.250,5`, fechas multi-formato (`01/03/2024`, `2024-03-15`, `15-03-2024`). Salida canónica Lima + floats correctos + fechas ISO; raw intacto para auditoría. Parsea fechas probando formatos documentados (no un solo `format` rígido). Nunca subas padrones reales ni PII al repo del curso.",
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

    cat_map = {"LIM": "Lima", "AQP": "Arequipa", "CUZ": "Cusco"}

    def parse_fecha(x):
        # Multi-formato documentado: prueba formatos; no adivines con un solo format.
        for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"):
            try:
                return pd.to_datetime(x, format=fmt)
            except (ValueError, TypeError):
                continue
        return pd.NaT

    df = pd.DataFrame({
        "region_raw": [" lima ", "LIM", "AREQUIPA"],
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
        output: `{'region': ['Lima', 'Lima', 'Arequipa'], 'monto': [10.5, 3.0, 1250.5]}
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
      heading: "outliers plausibles vs errores",
      subtopicId: "S16-T3-B",
      paragraphs: [
        "Un outlier **plausible** está lejos estadísticamente pero dentro del dominio de negocio (monto alto legítimo en una campaña). Un **error de dominio** viola bounds (monto < 0, lat 999, edad 200). IQR/z-score solo **candidatan**; el dominio de negocio **decide** error vs flag.",
        "Contrato: mantén máscaras `stat_outlier` y `domain_error` por separado; por defecto flag + cuarentena, nunca drop silencioso solo por IQR. Documenta bounds en el memo del gate (p. ej. monto ∈ [0, 10000] PEN sintéticos del fixture de clase).",
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
      heading: "reglas de schema y cross-field",
      subtopicId: "S16-T4-A",
      paragraphs: [
        "Contrato de **schema**: columnas presentes, dtypes esperados y nullability por campo. **Cross-field**: p. ej. `fecha_fin >= fecha_ini`, `monto > 0` si estado=pagado. Cada regla devuelve máscara de fallos + código de error legible para cuarentena.",
        "Ante **schema drift** (desviación de esquema: columna required faltante o renombrada), el gate falla con el **nombre** de la columna — no con un `KeyError` opaco al final del pipeline. Columnas extra pueden warn o fail según política documentada en el runbook.",
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
          "Si falta una columna required, el job falla con el nombre de la columna — no con KeyError opaco al final.",
      },
    },
    {
      heading: "métricas, cuarentena y audit trail",
      subtopicId: "S16-T4-B",
      paragraphs: [
        "Métricas operables del run: `rows_in`, `rows_clean`, `rows_quarantine`, tasas de null/dup/fail_schema y `pass` booleano. Un fail **sin métricas** no se puede operar en un job nocturno ni explicar a negocio, riesgo o auditoría interna.",
        "Cuarentena = tabla de filas rechazadas + razón codificada. **Audit trail** = lista append-only de eventos (`ingest`, `quarantine`, `promote`). El gate publica el reporte aunque `pass=False` (exit code ≠ 0 acompañado de JSON de métricas).",
        "Caso: 2 filas in, 1 clean, 1 quarantine por `null_required_monto`; audit con evento quarantine. `metrics.pass` es false. S17 solo debe consumir `clean` y el memo debe declarar cuántas filas quedaron fuera del universo analítico.",
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
          "Un fail sin métricas no se puede operar. Emite el reporte aunque el exit code sea != 0.",
      },
    }
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
          code: `def s16_ido_3():
    import pandas as pd
    df = pd.DataFrame({
        "cliente_id": ["C001", "C001", "C002", "C002", "C003"],
        "region": ["Lima", "Lima", "Cusco", "Arequipa", "Lima"],
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
        "region_raw": [" lima", "AREQUIPA "],
        "monto_raw": ["S/12.5", "3,00"],
    })
    df["region"] = df["region_raw"].str.strip().str.title()
    df["monto"] = df["monto_raw"].map(norm_money)
    print(df.to_dict(orient="list"))

s16_ido_5()`,
          output: `{'region_raw': [' lima', 'AREQUIPA '], 'monto_raw': ['S/12.5', '3,00'], 'region': ['Lima', 'Arequipa'], 'monto': [12.5, 3.0]}`,
        },
        why: "Raw + normalizado permite disputar transformaciones; locale de monto documentado.",
      },
      {
        demoId: "S16-T3-B-DEMO",
        subtopicId: "S16-T3-B",
        environment: "local-python",
        description: "Clasificar outlier estadístico vs error de dominio en montos",
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
        why: "Métricas + audit permiten operar el gate aunque falle.",
      }
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
          "E1 (guiado) — Concepto: política required y conteo de nulls. Fixture con columna `id` y al menos un null. Cuenta nulls de `id` con `isna` e imprime el entero. Pass: el conteo exacto del fixture del starter (no imputes antes de contar).",
        hint: "isna() cuenta ausencias; notna cuenta presentes. Suma e int().",
        hints: [
          "isna() cuenta ausencias; notna cuenta presentes.",
          "int(df['id'].isna().sum()) imprime el entero del fixture.",
        ],
        edgeCases: ["contar filas", "fillna antes"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · conteo de nulls en id
# Pista: el conteo de ausencias usa isna, no notna
import pandas as pd
df = pd.DataFrame({"id": ["C001", None]})
print(int(df["id"].notna().sum()))`,
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
          "E2 (independiente) — Concepto: mapa de violaciones required. Dado un `policy` required/optional, construye dict solo con campos required que tengan nulls (valor = conteo). Imprime el dict. Pass: coincide con solution (sin opcionales en el mapa).",
        hint: "Itera policy e incluye solo required con n>0.",
        hints: [
          "Itera policy e incluye solo p == 'required'.",
          "Excluye opcionales aunque tengan nulls.",
        ],
        edgeCases: ["incluir optional", "n=0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "E3 (transferencia) — Concepto: gate pass/fail por required. Si hay violaciones required imprime exactamente `fail`; si no, `pass`. No rellenes nulls para forzar pass. Pass string: `fail` o `pass` según el fixture del starter.",
        hint: "Construye viol desde isna de id; imprime fail si viol no vacío.",
        hints: [
          "Construye el dict viol desde isna del campo required.",
          "print('fail' if viol else 'pass').",
        ],
        edgeCases: ["siempre pass", "ignorar null"],
        tests: "salida coincide con solution output",
        feedback: "Si imprimiste pass con id nulo, el gate no es fail-closed: llena viol desde isna antes de decidir.",
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
        instruction:
          "E1 (guiado) — Concepto: indicador de ausencia antes de imputar. Sobre `monto`, crea `was_null` booleana, luego `fillna(0)`; imprime la lista de was_null. Pass: lista booleana alineada a filas (True donde había null).",
        hint: "Marca was_null = isna() ANTES del fillna.",
        hints: [
          "was_null = df['monto'].isna() antes de rellenar.",
          "Luego fillna(0.0) y print de was_null.tolist().",
        ],
        edgeCases: ["indicador después de fill", "perder señal"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "E2 (independiente) — Concepto: cap de imputación. Fixture 2 de 4 null en monto (rate=0.5) con umbral 0.3. Si null_rate>0.3 imprime `blocked`, si no `ok`. Pass: `blocked`. No imputes si está bloqueado.",
        hint: "rate = isna().mean(); bloquea si rate > 0.3.",
        hints: [
          "rate = s.isna().mean().",
          "print('blocked' if rate > 0.3 else 'ok').",
        ],
        edgeCases: ["cap inclusivo confuso", "contar no rate"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "E3 (transferencia) — Concepto: mediana estable pre/post un null. Fixture [1,2,None]: imputa mediana de no-nulos; demuestra que la mediana de valores originales no-nulos se preserva conceptualmente e imprime el vector final según solution. Pass: salida idéntica al oracle.",
        hint: "med = s.median() (skipna por defecto); fillna(med).",
        hints: [
          "median() ignora NaN por defecto.",
          "print(float(med), filled.tolist()).",
        ],
        edgeCases: ["mean vs median", "fillna 0"],
        tests: "salida coincide con solution output",
        feedback: "fillna(0) inventa un cero de negocio. Usa median() de no-nulos y rellena con esa mediana.",
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
        instruction:
          "E1 (guiado) — Concepto: duplicados exactos. DF con una fila exacta repetida; cuenta filas con `duplicated(keep=False)` True e imprime el entero. Pass: conteo del fixture (típicamente 2). No uses drop aún.",
        hint: "duplicated(keep=False) marca TODAS las copias, no solo la segunda.",
        hints: [
          "duplicated(keep=False).sum() cuenta todas las filas del grupo duplicado.",
          "keep por defecto (True) omite la primera aparición.",
        ],
        edgeCases: ["keep='first' cuenta 1", "solo subset cols"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "E2 (independiente) — Concepto: conflictos de atributo. Detecta `cliente_id` con más de una región distinta (`nunique>1`); imprime lista de ids en conflicto. Pass: lista del oracle (p. ej. `['C001']`).",
        hint: "groupby nunique > 1 sobre region.",
        hints: [
          "ids = df.groupby('cliente_id')['region'].nunique()",
          "print(ids[ids > 1].index.tolist())",
        ],
        edgeCases: ["duplicated exacto solo", "filter mal"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "E3 (transferencia) — Concepto: clasificar exact vs conflict vs clean. Para id C001 en el fixture (dos filas, regiones distintas): si dup exacto print `exact`; elif conflicto de región print `conflict`; else `clean`. Pass: `conflict`. Orden: clasifica antes de borrar.",
        hint: "Misma clave + region.nunique()>1 → conflict.",
        hints: [
          "Filtra sub = df[df.cliente_id == 'C001'].",
          "Si region.nunique() > 1 imprime conflict; si filas exactas, exact; si no, clean.",
        ],
        edgeCases: ["orden de if", "sin filtrar id"],
        tests: "salida coincide con solution output",
        feedback: "Lima vs Cusco en el mismo cliente_id es conflicto, no clean. Clasifica con nunique de región antes de borrar.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · exact vs conflict vs clean
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
        instruction:
          "E1 (guiado) — Concepto: split quarantine/clean por clave. Separa quarantine (dup key keep=False) y clean con drop_duplicates keep first; imprime ambos lens. Pass: tupla/lens del oracle. Conserva evidencia en quarantine.",
        hint: "q = mask duplicated(key, keep=False); c = drop keep first.",
        hints: [
          "duplicated(key, keep=False) arma la cuarentena completa.",
          "print(len(q), len(c)) con keep='first' en clean.",
        ],
        edgeCases: ["perder q", "keep last sin documentar"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "E2 (independiente) — Concepto: evidencia en cuarentena. Filtra filas con clave `id` duplicada y conserva **todas** las columnas de evidencia (incluido `batch`). Imprime `q.columns.tolist()`. Pass: `['id', 'batch']`. No proyectes solo la clave: sin `batch` el auditor no reconstruye el origen.",
        hint: "Filtra dups con mask y copy(); no dropear cols de evidencia.",
        hints: [
          "q = df[df.duplicated('id', keep=False)].copy() — sin seleccionar solo ['id'].",
          "print(q.columns.tolist()) debe incluir batch, no solo id.",
        ],
        edgeCases: ["solo id", "sin batch", "imprimir columnas del df sin filtrar dups"],
        tests: "salida coincide con solution output",
        feedback: "Si imprimiste solo ['id'], perdiste la evidencia de batch. La cuarentena es la fila completa.",
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
        instruction:
          "E3 (transferencia) — Concepto: cardinalidad 1 fila por id. Si `nunique(id)==len(df)` imprime `card_ok`; si no, `card_bad`. El fixture del starter tiene clave duplicada. Pass: `card_bad`. Prepara el join 1:1 de S17.",
        hint: "Compara nunique de id con len(df); no asumas card_ok.",
        hints: [
          "card_ok solo si cada id aparece una vez.",
          "print('card_ok' if df['id'].nunique() == len(df) else 'card_bad').",
        ],
        edgeCases: ["nunique dropna", "comparar con nunique cols"],
        tests: "salida coincide con solution output",
        feedback: "Con id duplicado la cardinalidad 1:1 falla: el oracle es card_bad, no card_ok.",
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
        instruction:
          "E1 (guiado) — Concepto: normalización de strings. Sobre `[' lima ','CUSCO']` aplica strip + title; imprime la lista. Pass: `['Lima', 'Cusco']`. No borres el raw si el ejercicio lo pide en columnas separadas.",
        hint: "str.strip().str.title() en cadena.",
        hints: [
          "s.str.strip().str.title().tolist()",
          "Solo strip no capitaliza CUSCO → Cusco.",
        ],
        edgeCases: ["solo lower", "sin strip"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "E2 (independiente) — Concepto: parse de montos PEN con locale documentado. Fixture `['S/1.5','3,00']`: quita `S/`; si hay **solo coma**, es decimal latino (`3,00` → `3.0`), no miles. Suma e imprime float. Pass: `4.5`. No borres la coma a ciegas (`replace(',', '')` convertiría 3,00 en 300).",
        hint: "Quita S/; si hay coma sin punto de miles, reemplaza coma por punto antes del float.",
        hints: [
          "Contrato: solo coma ⇒ decimal latino (3,00 → 3.0).",
          "print(float(series.map(norm_money).sum())) → 4.5",
        ],
        edgeCases: ["borrar coma como miles", "dejar S/", "tratar 3,00 como 300"],
        tests: "salida coincide con solution output",
        feedback: "Si obtuviste ~301.5, borraste la coma como miles. Con solo coma, 3,00 es decimal latino → 3.0; suma 4.5.",
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
        instruction:
          "E3 (transferencia) — Concepto: conservar raw. Crea `region` canónica desde `region_raw` y verifica que `region_raw` sigue igual; imprime evidencia según solution (p. ej. igualdad booleana o dict). Pass: salida del oracle.",
        hint: "Nueva col region; no pises region_raw.",
        hints: [
          "df['region'] = df['region_raw'].str.title()",
          "print ambos: raw intacto + canónico.",
        ],
        edgeCases: ["overwrite raw", "drop raw"],
        tests: "salida coincide con solution output",
        feedback: "Si region_raw quedó en Title Case, lo pisaste. Escribe en region y deja el raw intacto para auditoría.",
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
        instruction:
          "E1 (guiado) — Concepto: domain bounds. Marca `domain_error` si monto < 0; imprime lista booleana alineada. Pass: lista del fixture (True en negativos). No drops por IQR aquí.",
        hint: "Máscara s < 0; tolist().",
        hints: [
          "(s < 0).tolist() marca solo negativos.",
          "No uses >= 0 (eso invierte la semántica de error).",
        ],
        edgeCases: ["usar abs", "IQR only"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "E2 (independiente) — Concepto: outliers estadísticos IQR 1.5. Dado [1,2,3,100], lista valores stat-outlier. Pass: lista del oracle (incluye 100). Domain bounds se evalúan aparte.",
        hint: "Fence inferior y superior: q1-1.5*iqr y q3+1.5*iqr.",
        hints: [
          "q1, q3 = quantile 0.25/0.75; iqr = q3 - q1.",
          "mask = (s < q1 - 1.5*iqr) | (s > q3 + 1.5*iqr).",
        ],
        edgeCases: ["std z confuso", "dropear sin listar"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "E3 (transferencia) — Concepto: etiqueta error/flag/ok. Serie con montos [10,12,11,13,5000,-1]. Para las sondas `[5000, -1, 10]`: `error` si domain (monto < 0 o > 10000), `flag` si solo outlier IQR 1.5, `ok` else. Prioriza domain sobre IQR. Pass: `['flag', 'error', 'ok']`.",
        hint: "Domain primero; luego IQR; resto ok.",
        hints: [
          "Calcula q1/q3/iqr sobre toda la serie.",
          "Para cada sonda: if domain → error; elif stat → flag; else ok.",
        ],
        edgeCases: ["flag en error", "drop"],
        tests: "salida coincide con solution output",
        feedback: "5000 es flag (cola estadística), -1 es error de dominio, 10 es ok. Domain manda sobre IQR.",
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
        instruction:
          "E1 (guiado) — Concepto: columnas required faltantes. Required `['id','monto']` y DF solo con `id`; imprime lista de faltantes. Pass: `['monto']` (u orden del oracle). Mensaje de drift explicable.",
        hint: "List comprehension: c not in df.columns.",
        hints: [
          "[c for c in required if c not in df.columns]",
          "No devuelvas lista vacía a ciegas.",
        ],
        edgeCases: ["extra cols como fail", "set silent"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "E2 (independiente) — Concepto: cross-field temporal. Encuentra índices donde `fin < inicio`; imprime la lista de índices. Pass: índices del fixture. Cada regla devuelve máscara + significado.",
        hint: "Máscara fin < inicio; index[mask].tolist().",
        hints: [
          "df['fin'] < df['inicio'] con datetimes parseadas.",
          "print(df.index[mask].tolist())",
        ],
        edgeCases: ["string compare", "sin parse dates"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
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
        instruction:
          "E3 (transferencia) — Concepto: schema drift gate. Si faltan columnas required imprime `drift`; else `schema_ok`. Pass: cadena del oracle según fixture. Fail-closed ante drift.",
        hint: "Usa lista missing; no asumas schema_ok.",
        hints: [
          "missing = [c for c in required if c not in df.columns]",
          "print('drift' if missing else 'schema_ok')",
        ],
        edgeCases: ["siempre ok", "KeyError sin mensaje"],
        tests: "salida coincide con solution output",
        feedback: "Falta monto en required: el gate debe decir drift, no schema_ok. Fail-closed ante schema drift.",
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
        instruction:
          "E1 (guiado) — Concepto: rows_clean desde cuarentena. Dado `rows_in=10` y una lista `quarantine` con 3 filas rechazadas, imprime `rows_clean = rows_in - len(quarantine)`. Pass: `7`. La métrica se deriva del audit, no de un literal suelto.",
        hint: "Resta len(quarantine) a rows_in; no sumes.",
        hints: [
          "quarantine es una lista de dicts; usa len(quarantine).",
          "print(rows_in - len(quarantine))",
        ],
        edgeCases: ["porcentaje", "sumar en vez de restar"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · rows_clean desde cuarentena
# Pista: limpia = entradas - rechazadas (resta, no suma)
rows_in = 10
quarantine = [
    {"id": "C002", "reason": "null_required"},
    {"id": "C004", "reason": "domain_error"},
    {"id": "C007", "reason": "schema_drift"},
]
print(rows_in + len(quarantine))`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `rows_in = 10
quarantine = [
    {"id": "C002", "reason": "null_required"},
    {"id": "C004", "reason": "domain_error"},
    {"id": "C007", "reason": "schema_drift"},
]
print(rows_in - len(quarantine))`,
          output: `7`,
        },
      },
      {
        id: "S16-T4-B-E2",
        subtopicId: "S16-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: audit append-only. Partiendo de `audit = [{'event': 'start'}]`, append un evento `quarantine` con `n=2` (sin reasignar la lista). Imprime `len(audit)` y el `event` del último ítem. Pass: `2 quarantine`. No pises el historial.",
        hint: "append del dict; luego print(len, audit[-1]['event']).",
        hints: [
          "append no pisa el evento start previo.",
          "print(len(audit), audit[-1]['event']) → 2 quarantine",
        ],
        edgeCases: ["overwrite de lista", "omitir n", "solo imprimir len"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Lab · audit trail append-only
# Pista: append del evento quarantine; no reasignes audit = [...]
audit = [{"event": "start"}]
print(len(audit), "start")`,
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
        instruction:
          "E3 (transferencia) — Concepto: metrics.pass. Si quarantine>0 entonces pass=False; imprime el booleano para n_q=1. Pass: `False`. Publica métricas aunque el gate falle.",
        hint: "pass = (n_q == 0); no inviertas la lógica.",
        hints: [
          "metrics['pass'] = n_q == 0",
          "print(metrics['pass']) → False cuando hay cuarentena.",
        ],
        edgeCases: ["pass True con q", "omitir métrica"],
        tests: "salida coincide con solution output",
        feedback: "Con n_q=1, pass debe ser False. Invertir la comparación rompe el contrato fail-closed.",
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
      "Implementa una suite de checks sobre un dataset sintético de clientes/transacciones (regiones Lima/Arequipa/Cusco, montos PEN ficticios): null policies required/optional, duplicados exactos vs conflictos con evidencia, normalización con raw lateral, outliers dominio+IQR, contratos schema/cross-field, cuarentena y audit trail append-only. El set clean alimenta S17/CP-N2-A. Fail-closed (si el contrato se rompe, el job no aprueba en silencio): nunca arregles un dato sin métrica ni uses PII real.\n\n**Tabla de aceptación mínima (fixture del starter):**\n| Señal en el fixture | Qué debe detectar el gate | reason / efecto |\n| --- | --- | --- |\n| `cliente_id` null (fila 3) | null required | `null_required` → cuarentena; no fillna mágico |\n| C001 con Lima y Cusco | conflicto de atributo | `conflict_region` (o similar); no `drop_duplicates` ciego |\n| monto `-1.0` (C003) | error de dominio | `domain_error`; no borrar solo por IQR |\n| Resultado del run | `metrics.pass == False` | JSON con rows_in / rows_clean / rows_quarantine |",
    objectives: [
      "Suite de checks que falla explicablemente ante drift, null required y domain_error",
      "Cuantificar pérdida de filas/campos con metrics.rows_in / rows_clean / rows_quarantine",
      "Nunca arreglar silenciosamente un dato (sin fillna mágico de required)",
      "Cuarentena + audit trail sintético append-only (ingest → checks → quarantine)",
      "Demo del fixture: null required + conflicto de región + domain_error de monto; metrics.pass=False con razones codificadas",
    ],
    requirements: [
      "Fixtures sintéticos (ids C00x, regiones PE, montos S/ ficticios); sin PII real",
      "Función run_quality_gate(df, schema) → dict con claves obligatorias metrics, quarantine, audit (clean opcional)",
      "metrics incluye al menos: rows_in, rows_clean, rows_quarantine, pass (bool)",
      "quarantine: filas/registros con reason codificada (null_required | conflict_region | domain_error | schema_drift…)",
      "audit: list[dict] append-only; no reasignar el historial al fallar",
      "Demo reproducible: assert de claves + pass=False en el fixture del starter",
      "Memo corto en español profesional (qué falló y cuántas filas quedaron fuera del set limpio)",
      "Alineación a CP-N2-A (quality); el set clean es el único input válido para S17",
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
        "region": ["Lima", "Cusco", "Lima", "Arequipa"],
        "monto": [10.0, 10.0, 5.0, -1.0],
    })
    schema = {"cliente_id": "required", "monto": "required", "region": "optional"}
    report = run_quality_gate(df, schema)
    assert set(report) >= {"metrics", "quarantine", "audit"}
    m = report["metrics"]
    assert {"rows_in", "rows_clean", "rows_quarantine", "pass"} <= set(m)
    assert m["pass"] is False, "El fixture debe fallar de forma explicable"
    assert m["rows_in"] == len(df)
    print(m)
`,
    portfolioNote:
      "El gate debe emitir métricas incluso cuando pass=False. El set clean (si lo publicas) es el único input válido para los joins y el portfolio de S17.",
    rubric: [
      { criterion: "Alineación al quality gate de la sección (fail-closed + métricas + cuarentena)", weight: "25%" },
      { criterion: "Correctitud técnica: null policy, dups/conflictos, domain, schema", weight: "20%" },
      { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
      { criterion: "Pruebas o casos de borde documentados (fail explicable en el fixture)", weight: "15%" },
      { criterion: "Código legible y límites claros (no mutación silenciosa; audit append-only)", weight: "10%" },
      { criterion: "Documentación en español profesional (memo del gate)", weight: "10%" }
    ],
  },
  selfCheck: {
    questions: [
      {
        question: "Un campo con política required que tiene nulls debe:",
        options: ["Imputarse siempre con 0", "Ignorarse si es <5% de filas", "Convertirse a string vacío", "Provocar violación/cuarentena o fail del gate"],
        correctIndex: 3,
        explanation:
          "Required implica presencia: null no se “arregla” en silencio; va a violations/cuarentena o tumba el gate con métricas.",
      },
      {
        question: "Duplicado exacto vs conflicto de clave:",
        options: ["Son lo mismo y siempre se drop_duplicates", "Exacto = filas idénticas; conflicto = misma clave con atributos distintos", "Conflicto solo existe en SQL, no en pandas", "Exacto se resuelve con melt"],
        correctIndex: 1,
        explanation:
          "Clasifica antes de borrar: el conflicto requiere evidencia y regla de resolución; el exacto puede colapsarse tras log.",
      },
      {
        question: "Conservar region_raw al normalizar sirve para:",
        options: ["Acelerar groupby", "Imputar nulls automáticamente", "Auditar y disputar la forma canónica sin perder el valor original", "Validar one_to_one en merge"],
        correctIndex: 2,
        explanation:
          "Normalizar ≠ borrar historia: el raw lateral permite auditoría y rollback conceptual del transform.",
      },
      {
        question: "IQR sin domain bounds es riesgoso porque:",
        options: ["Puede marcar (o borrar) colas legítimas de negocio como si fueran error", "No funciona con floats", "Siempre es más lento que z-score", "Requiere MultiIndex"],
        correctIndex: 0,
        explanation:
          "IQR solo candidata outliers estadísticos; los bounds de dominio deciden error vs flag plausible.",
      },
      {
        question: "Un quality gate que falla debe:",
        options: ["Ocultar métricas para no alarmar", "Imputar todos los nulls y reintentar en silencio", "Borrar el audit trail del run anterior", "Publicar métricas y cuarentena aunque pass=False"],
        correctIndex: 3,
        explanation:
          "Operar un fail exige rows_in/clean/quarantine y razones; el audit es append-only y el exit code refleja pass.",
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
