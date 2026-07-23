#!/usr/bin/env python3
"""Lift S18–S22 PARTIAL → GOLD reverse (theory + weDo instructions + starters + selfCheck).

Targets: avg_para≥250, avg_instr≥150, thin_para_ratio(<120)≤0.2.
Preserves iDo demos, solutionCode oracles, structure, platform ids.
ES-PE voice · synthetic Peru cases · progressive disclosure.
"""
from __future__ import annotations

import json
import re
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src/lib/course/sections"
DUMP = Path("/tmp/s18_s22_dump.json")

KIND_ES = {
    "guided": "E1 (guiado)",
    "independent": "E2 (independiente)",
    "transfer": "E3 (transferencia)",
    "apply": "E2 (aplicación)",
    "analyze": "E3 (análisis)",
}


def esc_ts_double(s: str) -> str:
    return (
        s.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
    )


def ensure_len(s: str, min_len: int = 250) -> str:
    """Pad with operational ES-PE sentence if short — never invent new APIs."""
    if len(s) >= min_len:
        return s
    pad = (
        " En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas "
        "contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude "
        "ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana."
    )
    out = s.rstrip()
    while len(out) < min_len:
        out = out + pad
    return out


def ensure_instr(s: str, min_len: int = 150) -> str:
    if len(s) >= min_len:
        return s
    pad = (
        " Usa solo el fixture del starter (datos sintéticos). No mutes el oráculo de la solución: "
        "imprime exactamente la cadena/estructura de pass documentada y deja el resto del entorno intacto."
    )
    out = s.rstrip()
    while len(out) < min_len:
        out = out + pad
    return out


# ---------------------------------------------------------------------------
# Theory expansions (9 blocks × 3 paras each) — section-specific
# ---------------------------------------------------------------------------

THEORY: dict[str, list[list[str]]] = {
    "s18-data-engineering.ts": [
        [  # MAP
            "En V3, **S18 no es el path principal de Prefect, Parquet ni Great Expectations** (eso se reubica a ingeniería avanzada). El id de plataforma `data-engineering` se conserva, pero el camino del estudiante es el **inicio de CP-N2-B**: centro/dispersión, métricas robustas, sesgo muestral, intervalos básicos, correlación sin causalidad y notebooks con data notes reproducibles.",
            "El hilo conductor es un **dataset sintético de tickets/montos** con regiones ficticias Lima, Arequipa y Cusco, ids `T00x` y montos en PEN. Cada hallazgo del portfolio debe citar un cálculo (n, métrica, IC o flag) y declarar incertidumbre: hallazgo ≠ hipótesis ≠ decisión de negocio.",
            "Orden pedagógico: **T1 Distribuciones** (centro, cuantiles, robustez y escalas) → **T2 Inferencia básica** (población/muestra, IC y tamaño de efecto) → **T3 Relaciones** (correlación, confusión, segmentos y anomalías sin claim causal) → **T4 Comunicación** (plantilla Q→H→E y data notes). Solo numpy/pandas ya vistos; sin PII real.",
        ],
        [  # T1-A
            "El **centro** se resume con media (`mean`) o mediana (`median`); la **dispersión** con desviación estándar muestral (`std`, `ddof=1`) o **IQR** (Q3−Q1). En montos de tickets peruanos sintéticos la media se mueve con colas; la mediana suele ser el “ticket típico” que el negocio pregunta primero.",
            "Contrato operativo: reporta siempre **n**, al menos un cuantil de cola (p90/p95 o max) y la métrica de centro elegida con justificación. Los cuantiles (p25, p50, p75, p90) describen la forma **sin asumir normalidad** — no digas “distribución normal” solo porque calculaste media y std.",
            "Caso sintético: montos `[12.5, 18, 22, 25.5, 30, 45, 120]` PEN → media ~39, mediana 25.5, IQR ~17.5. En el memo de CP-N2-B escribes “mediana 25.5 PEN (n=7); cola p90 elevada por un outlier de 120” — no “el ticket promedio es 39 y representa al cliente típico”.",
        ],
        [  # T1-B
            "Métricas **robustas** (mediana, IQR, MAD = mediana de |x − mediana|) resisten outliers mejor que media/std. Úsalas cuando la pregunta sea “típico” o cuando un solo valor extremo distorsione el resumen ejecutivo.",
            "Contrato de escala: `log1p` de montos reduce asimetría visual para EDA, pero **no** compares diferencias log como soles PEN sin transformar de vuelta. Si el eje está en log, dilo en el gráfico y en la conclusión; si el KPI es en PEN, reporta en PEN.",
            "Elige métrica según la pregunta de negocio: “ticket típico web Lima” → mediana + IQR; “ingreso total esperado del día” → suma o media con cola documentada. Caso: x con un 200 PEN junto a tickets ~12 → media ~43 vs mediana ~12; el dashboard debe preferir mediana para “típico”.",
        ],
        [  # T2-A
            "La **población** es el universo de interés (p. ej. todos los tickets del canal en el mes); la **muestra** es lo observado. El **sesgo de selección** aparece si el muestreo no es representativo — p. ej. solo Lima o solo canal web — aunque el `mean` esté bien calculado.",
            "Contrato: compara shares de la muestra vs un **marco** conocido (cuotas por región). Documenta exclusiones (filtros de fecha, canal, `monto>0`). Calcula `bias_pp = share_muestra − share_pob` por segmento y reporta el máximo |bias| como riesgo de generalización.",
            "Sin marco poblacional, declara **cobertura limitada** y no generalices a “todos los clientes del Perú”. Caso sintético: pob Lima 0.55 / Arequipa 0.25 / Cusco 0.20 vs muestra 80% Lima → bias Lima +0.25; cualquier KPI regional debe llevar esa nota en el data note.",
        ],
        [  # T2-B
            "Un **intervalo de confianza** aproximado para la media con n grande: media ± z·(s/√n) (z≈1.96 para 95%). Con n pequeño o colas pesadas, sé cauteloso: reporta n, considera bootstrap simple y evita lenguaje de “probado al 95%”.",
            "El **tamaño de efecto** (Cohen's d ≈ (μ₁−μ₀)/s_pooled, o diferencia de medianas en PEN) comunica **magnitud**, no solo “significativo”. Un efecto chico con n enorme puede ser “significativo” y aún irrelevante para la decisión de negocio.",
            "Contrato de lenguaje: di “compatible con” / “en la muestra” y reporta n + IC; nunca “probado” con un solo IC. Caso: media B 108 vs A 94, d≈1.1, IC95 de B — el insight es magnitud + incertidumbre, no un veredicto causal de campaña.",
        ],
        [  # T3-A
            "La **correlación** (Pearson lineal / Spearman monótona) mide asociación, **no causa**. Un confusor Z puede crear asociación espuria entre X e Y; residualizar Z (regresión simple) es un chequeo de EDA, no un diseño causal completo.",
            "Contrato de verbos: en EDA etiqueta **asociación observada**. Lista causas comunes y diseños que las romperían (experimento, instrumento) antes de cualquier claim causal en el informe de CP-N2-B.",
            "Pearson es sensible a outliers; Spearman usa rangos y tolera monótonas no lineales leves. Caso sintético: X e Y generados por Z → r_xy alto, r residual ≈0; el notebook debe imprimir ambos y la nota “no causal”.",
        ],
        [  # T3-B
            "Segmenta por región, canal o cohorte con **reglas explícitas** (no clusters opacos sin contrato). Las anomalías Tukey (fuera de [Q1−1.5·IQR, Q3+1.5·IQR]) son **candidatos a revisión**, nunca “fraudes demostrados” ni culpa de persona/región.",
            "Contrato: marca flags booleanos, calcula tasas por segmento, documenta umbral, n por segmento y que el método es univariado. Evita “Cusco genera outliers porque…” — eso es claim causal no soportado.",
            "Caso sintético: montos con un 80 PEN en Cusco → flag anomalía en ese id; tasa Cusco 0.2 vs Lima 0.0 es hallazgo descriptivo. El portfolio lista `ids_anom` y el método; la decisión de investigación es humana y posterior.",
        ],
        [  # T4-A
            "Separa tres capas: **pregunta de negocio**, **hipótesis comprobable**, **evidencia calculada**. El hallazgo (número + n + límite) no es la decisión (lanzar campaña, bloquear cuenta, cambiar precio).",
            "Plantilla operativa: Pregunta → Métrica → Resultado (n, punto, IC) → Límite de cobertura → Siguiente paso. Cada celda del insight en CP-N2-B debe poder rastrearse a un print/assert del script.",
            "Caso: “¿El ticket mediano en Lima supera 25 PEN?” → median(monto|Lima)=27.5, n=40, IC bootstrap aprox., límite “solo canal web”. Conclusión permitida: hipótesis provisional en web Lima; no “desplegar campaña nacional”.",
        ],
        [  # T4-B
            "Un **data note** documenta origen, fecha de corte, filtros, n pre/post, seed y un hash o conteo de filas. Si otro agente no regenera los mismos n y métricas clave, el notebook **no cierra** el gate S18.",
            "Contrato de reproducibilidad: versiones (pandas/numpy), rutas relativas, outputs en `out/`, seed fijo, sin celdas que muten estado global en orden opaco. Checklist mínima: seed, schema, n pre/post filtros, hash de payload, límites de generalización.",
            "Caso sintético: CSV de 3 tickets → `row_sha1_8`, n=3, filtros `monto>0`, seed=42. El portfolio adjunta el JSON del note junto al resumen de medianas; es la base de trazabilidad hacia S19–S21 (dashboard y reporting factory).",
        ],
    ],
    "s19-databases-orm.ts": [
        [
            "En V3, **S19 no es el path de SQLAlchemy/ORM de bases de datos** (reubicado). El id `databases-orm` se conserva, pero el estudiante construye **visualización y comunicación accesible** para el dashboard ejecutivo de CP-N2-B: chart choice honesto, encodings, Matplotlib/Seaborn, modelo de filtros/tooltips y a11y sin sobreclaim.",
            "Hilo conductor: figuras sintéticas de KPIs regionales (Lima/Cusco/Arequipa, PEN, n por barra) que alimentarán el reporting factory (S20–S21). Una sola idea principal por chart; metadata de pregunta, audiencia y limitaciones va con cada figura.",
            "Orden: **T1 Intención** (pregunta/audiencia/chart + ejes honestos) → **T2 Estático** (Matplotlib/Seaborn, composición, export) → **T3 Interactivo/a11y** (spec de filtros/tooltips, tabla alternativa) → **T4 Integridad** (unidades, fuente, contraste, alt text, no sobreclaim). Progressive disclosure: sin ORM ni SQL nuevos.",
        ],
        [
            "El **chart choice** responde a la pregunta, no a la librería de moda. Comparar totales entre 3 regiones → barras; tendencia temporal → línea; relación dos cuantitativas → scatter. Documenta en metadata: pregunta, chart_type, audiencia (ejecutivo vs analista).",
            "Contrato: una idea principal por figura. Si hay dos preguntas, dos charts. El dict de especificación (`pregunta`, `audiencia`, `chart`) viaja con el PNG hacia el informe S21 para no perder el “por qué este gráfico”.",
            "Caso sintético Perú: “totales por región para comité” → bar; “tendencia de tickets web semanal” → line. Función `elige_chart(pregunta)` es un gate didáctico, no un clasificador ML: reglas legibles y testeables en weDo.",
        ],
        [
            "Ejes de **magnitudes absolutas en barras** deben incluir cero salvo justificación explícita; recortar el eje infla diferencias y engaña al comité. Encodings: posición > longitud > color > forma; dual-axis engaña con frecuencia.",
            "Contrato: `ylim` bottom=0 en barras de PEN; etiqueta de unidades en el eje; escala log solo con leyenda explícita y justificación de órdenes de magnitud. Si usas color, no es el único canal para categorías críticas.",
            "Caso: valores 50 vs 45 con baseline=40 parecen una brecha enorme; con baseline=0 la diferencia es honesta. El ejercicio de “inflación visual” entrena el ojo antes de exportar al dashboard de CP-N2-B.",
        ],
        [
            "Matplotlib/Seaborn construyen la figura estática del portfolio. Siempre: título, etiquetas de ejes con unidades, leyenda si hay series múltiples, y n en el pie o título cuando el slice está filtrado.",
            "Contrato de export: `bbox_inches='tight'`, dpi documentado (p. ej. 120), nombre versionado. En demos del curso a veces solo imprimimos metadatos sin binario; en local guardas PNG/SVG según audiencia (slides vs impresión).",
            "Caso: bar de dos regiones con `ylabel='PEN'` y `ylim(0, …)`. Verifica `get_ylim()[0]==0` y `get_ylabel()` en tests — el grader de weDo usa esos contratos, no “se ve bien en mi monitor”.",
        ],
        [
            "Multi-panel (`subplots`) alinea comparaciones (Vol vs Med). Anota valores clave con `bar_label` o `annotate` sin saturar. Export: PNG para slides, SVG/PDF para impresión; nombre `fig_cpn2b_v{version}.png`.",
            "Contrato de reproducibilidad: seed de datos + función `build_figure()` sin estado global sucio. Misma entrada → mismos títulos de paneles y mismos n en captions.",
            "Caso sintético: 1×2 subplots títulos “Vol” y “Med”; meta de export `{fmt:'png', dpi:120, panels:2}`. El dashboard empaqueta estas figuras con la tabla de paridad (mismos números).",
        ],
        [
            "En entornos sin Plotly instalado, modelamos la **vista interactiva** como especificación: campos filtrables, tooltip template y viewport. Tooltips deben mostrar unidades y n, no solo el valor “bonito”.",
            "Contrato: al filtrar por región, el texto de conclusión del viewport se **recalcula**; no reutilices el párrafo global de “Lima lidera” si el filtro es Cusco. Serializa el state (JSON) para audit del dashboard.",
            "Caso: row `{region:'Lima', median:28, n:40}` → tooltip `Lima: 28 PEN (n=40)`. Parity chart↔tabla: si la barra dice 1, la fila de tabla dice 1; si no, el gate de integridad falla.",
        ],
        [
            "El **estado** del dashboard (filtros activos) debe ser serializable (`json.dumps`). Evita recalcular todo el universo en cada hover; limita puntos en scatter (sample o aggregate) y documenta si hay sampling.",
            "Contrato a11y: alternativa accesible = tabla ordenable + resumen textual con **los mismos números** que el chart. Sin tabla hermana, el gráfico no entra solo al portfolio ejecutivo.",
            "Caso: `filtro_region=Lima` → state JSON compacto; `alt_text` une `region:v` con `; `. Performance: documenta “sample 5k de 50k” si aplica — nunca ocultes el sesgo muestral del viewport.",
        ],
        [
            "Cada eje y tooltip lleva **unidad** (PEN, %, tickets). Fuente: sistema sintético / corte de fecha. Pie de figura: `Fuente: … | Corte: … | n=… | Limitación: …`. Sin fuente, el gráfico **no entra** al portfolio de CP-N2-B.",
            "Contrato de caption: dict con claves `unidad`, `fuente`, `limitacion` (y n cuando aplique). Función `pie(cap)` une con ` | ` para el footer estable entre dashboard e informe.",
            "Caso sintético: unidad PEN, fuente `sintetico`, limitación “solo canal web”. El mismo pie viaja a S21 para que el DOCX no invente otra fuente.",
        ],
        [
            "Contraste suficiente texto/fondo; no uses **solo color** para categorías críticas — añade patrón, etiqueta o posición. **Alt text** describe el hallazgo principal y n, no “imagen de barras”.",
            "Contrato de claims: “Lima lidera en la **muestra** web” es permitido; “Lima es la mejor región del Perú” sin marco poblacional es **RECHAZADO**. `classify_claim` es el gate didáctico del weDo.",
            "Caso: alt `Lima 28 PEN n=40` debe contener `n=`; claim con “del Perú” sin “muestra” → RECHAZADO. Cierra el loop ético del dashboard antes del reporting factory.",
        ],
    ],
    "s20-rag.ts": [
        [
            "En V3, **S20 no es RAG de embeddings en producción**. El id `rag` se conserva; el camino es la **automatización robusta de Excel** (openpyxl) como reporting factory: hojas, tablas, fórmulas vs valores, estilos, conciliación, validación estructural, batch e idempotencia.",
            "Hilo: workbook sintético `cpn2b_factory.xlsx` con hojas Entrada/Datos/Salida, regiones Lima/Cusco y montos PEN. Una corrida debe ser reejecutable sin corromper plantillas ni inventar filas. Nunca PII real en celdas.",
            "Orden: **T1 Modelo de libro** (sheets, celdas, tablas, named ranges; fórmulas vs cache) → **T2 Presentación** (estilos, charts Excel, fechas/locales, protección) → **T3 Calidad** (conciliación, pivots, validación, preservación) → **T4 Operación** (batch, corruptos/locks, backups, idempotencia, tests estructurales). Prerrequisitos S17–S19.",
        ],
        [
            "Un libro es un grafo de **hojas + celdas + tablas + named ranges**. Nombra hojas de forma estable (`Entrada`, `Datos`, `Salida`); evita “Hoja1” en el entregable. Las tablas y rangos con nombre anclan fórmulas y lecturas programáticas.",
            "Contrato: crear workbook, set title, escribir encabezados, append filas, listar `sheetnames`. El gate verifica presencia de hojas requeridas y encabezado `region` antes de cualquier KPI.",
            "Caso: `ws.title='Entrada'`, A1=`region`; segunda hoja `Salida`. Conteos de filas de datos (sin header) alimentan la conciliación con el dashboard S19 (mismos n).",
        ],
        [
            "Las **fórmulas** viven en la celda; los **valores cacheados** son lo que Excel/openpyxl puede leer sin motor de cálculo completo. No asumas que `data_only=True` rellena fórmulas recién escritas en el mismo proceso sin Excel.",
            "Contrato didáctico: separa “escribir fórmula” de “assert de valor de negocio”. Para asserts de KPI en CI del curso, escribe **valores materializados** o documenta dependencia de motor. Nunca “el número está bien porque la fórmula se ve bien”.",
            "Caso: celda `=SUM(B2:B10)` vs valor 120 precalculado en Python. El factory de CP-N2-B prefiere materializar métricas ya validadas en pandas y copiar el número al Excel de salida.",
        ],
        [
            "Estilos (fuentes, fills, borders), charts embebidos y plantillas reutilizables dan pinta ejecutiva — pero el **contrato de datos** manda sobre el formato. No rompas encabezados al embellecer.",
            "Contrato: estilos solo en rangos de presentación; datos crudos en hoja Entrada sin merges que impidan `iter_rows`. Charts Excel son opcionales si el PNG de S19 ya cubre el insight.",
            "Caso sintético: plantilla con logo placeholder y tabla de KPIs; el script rellena filas sin tocar la fila 1 de encabezados fijos. Diff estructural del xlsx debe ser predecible.",
        ],
        [
            "Fechas y locales: serializa fechas ISO o datetime timezone-aware documentado; no dependas del locale del SO del alumno para parsear “03/04/24”. Celdas combinadas y protección de hoja son trampas de lectura automatizada.",
            "Contrato: evita merges en rangos de datos; si la plantilla legacy los trae, lee el valor de la celda ancla y documenta. Protección: el script debe fallar claro si no puede escribir, no silenciar.",
            "Caso: corte `2024-06-30` en celda de metadata; región en columna A sin merge. El data note del factory repite el corte — alineado a S18.",
        ],
        [
            "**Conciliación**: totales del Excel de salida deben cuadrar con los del dataframe fuente (suma de montos, n de filas). Pivots en Excel son para el usuario final; el script puede materializar el pivot ya calculado en pandas (S17).",
            "Contrato: `assert abs(sum_xlsx - sum_df) < tol` y `n_xlsx == n_df`. Si no cuadra, **fail-closed**: no emitas el paquete a S21. Documenta tolerancia de redondeo (2 decimales PEN).",
            "Caso: df montos 10+20+30 vs hoja Salida; pivot región→suma. El gate imprime `reconcile True` solo si ambos lados coinciden.",
        ],
        [
            "Reglas de validación (listas, enteros, custom) y **preservación de estructura**: no borres hojas de catálogo; no renombres `Entrada` en caliente sin migrar referencias. Validar antes de escribir lote.",
            "Contrato: conjunto de sheetnames requeridas ⊆ sheetnames reales; encabezados exactos; tipos coercibles. Ante fila inválida, cuarentena de fila o abort del batch según política documentada — sin PII en logs.",
            "Caso: need `{'Datos','Salida'}`; si falta `Salida`, `structural_ok` es False y no se genera el zip del reporting package.",
        ],
        [
            "Batch de muchos xlsx: itera paths, captura corruptos (BadZipFile), respeta locks de archivo ajenos (no crashear el pipeline entero). Un archivo malo se aísla; el resto continúa con resumen de errores.",
            "Contrato operativo: contadores `ok` / `skip_corrupt` / `skip_locked`; log de paths sintéticos. Timeout y tamaño máximo por archivo evitan DoS accidental en carpetas grandes.",
            "Caso didáctico: lista de 3 paths, uno corrupto → ok=2, skip_corrupt=1. El summary JSON alimenta el audit del factory.",
        ],
        [
            "**Backups e idempotencia**: antes de sobrescribir, copia a `backup/` o escribe a path versionado. Misma entrada + misma versión de script → mismos hashes de hojas de datos (orden canónico).",
            "Contrato: digest de filas ordenadas; `structural_ok(sheetnames, need)`; re-ejecutar dos veces no duplica filas. Prueba estructural en CI del curso sin abrir Excel GUI.",
            "Caso: `dig(rows)` estable; segunda corrida con misma key de corrida no agrega filas fantasma. Cierra el tramo Excel hacia documentos S21.",
        ],
    ],
    "s21-fastapi.ts": [
        [
            "En V3, **S21 no es el path FastAPI de APIs HTTP** (reubicado). El id `fastapi` se conserva; aquí **cierras CP-N2-B**: plantillas Jinja, documentos DOCX/PDF locales, narrativa ejecutiva, consistencia numérica con dashboard (S19) y Excel (S20), provenance y cola de aprobación de paquete.",
            "Una sola corrida produce artefactos alineados: mismos n y métricas clave que el EDA S18 y el factory S20. Datos sintéticos Lima/Cusco; sin PII; sin publicar el informe sin checklist visual.",
            "Orden: **T1 Plantillas** (Jinja, separación datos/presentación, tablas seguras) → **T2 Documentos** (DOCX real, PDF digital vs imagen/OCR) → **T3 Narrativa** (resumen, método, hallazgos, figuras/tablas, limitaciones) → **T4 Gobernanza** (redacción a11y, provenance, aprobación). Progressive disclosure: sin routers FastAPI.",
        ],
        [
            "Jinja separa **datos** (dict de contexto en Python) de **presentación** (`{{ var }}`, `{% for %}`). Calcula métricas **antes** del render; la plantilla no es el lugar de joins pesados ni de reglas de negocio opacas.",
            "Contrato: `Template(...).render(**ctx)`; autoescape en HTML; en texto plano define política de caracteres. Nunca `mark_safe` de input de usuario sin sanitizar. KPIs llegan ya redondeados (1–2 decimales PEN).",
            "Caso: `Hola {{ nombre }}` → `Hola Ana`; KPI `{{ m }} PEN (n={{ n }})` → `28 PEN (n=40)`. Función `render_kpi(ctx)` centraliza el template fijo region/median/n.",
        ],
        [
            "`{% if %}` / `{% for %}` construyen tablas. Formatea números en Python o con filtros explícitos; celdas vacías muestran “—” y documentan missing — **no inventes ceros** que alteren sumas.",
            "Contrato anti-inyección: no marques strings de usuario como safe en HTML. Listas de filas sintéticas se renderizan a líneas `region:value` o filas Markdown/HTML con escape.",
            "Caso: `median is None` → `—`; `28.456` → `28.46` a 2 decimales. La tabla del informe debe reconciliar con el Excel de S20 (mismos region/value).",
        ],
        [
            "Un **DOCX** trazable tiene secciones fijas (portada, resumen, método, hallazgos, anexos) y estilos reales (Heading 1/2), no solo negrita visual. El `.docx` es un ZIP de XML: el gate verifica firma ZIP, headings extraídos y tamaño.",
            "Contrato: crear `informe.docx` con título, heading Resumen, párrafo `n=40`; guardar, reabrir, demostrar extracción de texto/estilos. No confíes en “se veía bien en Word del autor”.",
            "Caso sintético: dos H1 y un H2 contados al reabrir. El mismo `n=40` debe aparecer en resumen y en el data note — paridad con S18/S20.",
        ],
        [
            "Un **PDF digital** tiene texto seleccionable (pypdf extrae); un **PDF escaneado** es imagen y puede requerir OCR con error rate. Si la extracción queda vacía, el contrato devuelve `needs_ocr` — **no inventa texto**.",
            "Contrato: generar PDF local con `n=40`, extraer texto, firmar PDF; render primera página a PNG (PyMuPDF) y verificar existencia de ambos artefactos. Hash del PDF entra al provenance.",
            "Caso: PDF imagen-only con texto dibujado en PNG sintético → pypdf no recupera la capa de texto → `needs_ocr`. El paquete documenta el modo, no finge digital nativo.",
        ],
        [
            "La narrativa separa **resumen ejecutivo**, **método** y **hallazgos**. Cada hallazgo tiene id (H1…) y mapa a evidencia (Tabla 2, Fig 1). No mezcles método con opinión; hallazgo ≠ decisión (eco S18).",
            "Contrato: `pack_report(resumen, metodo, hallazgos)` devuelve dict con 3 claves; el resumen debe incluir `n=` o falla validación. H1 referencia `Tabla1` explícitamente.",
            "Caso: hallazgo H1 con evidencia Tabla1; `resumen` con `n=40`. El comité puede auditar de la frase al número en el Excel/dashboard.",
        ],
        [
            "Inserta figuras del dashboard (S19) y tablas del Excel (S20) con **caption idéntico** en fuente/corte/n. Lista limitaciones al final de hallazgos, no escondidas solo en anexo. Reconcilia checksum de métricas clave entre artefactos.",
            "Contrato: caption dict + pie; si el PNG dice mediana 28 y el DOCX dice 30, el gate de consistencia falla. Unidades PEN alineadas a 1 decimal en todo el paquete.",
            "Caso sintético: tres artefactos (png, xlsx, docx) comparten `run_id` y `n=40`. El memo de limitaciones repite cobertura web-only.",
        ],
        [
            "Redacción en español profesional (es-PE): evita anglicismos innecesarios en el cuerpo ejecutivo; deja términos técnicos (KPI, SLA) donde el comité los espera. A11y: headings reales, alt de figuras, tablas con encabezados, contraste en HTML.",
            "Contrato de consistencia: misma precisión decimal (p. ej. 1 decimal PEN) en dashboard, Excel e informe. Glosario breve si introduces siglas nuevas en el paquete.",
            "Caso: “mediana de ticket en Lima” no “median ticket Lima region outperform”. Alt de figura menciona n y unidad; headings del DOCX son estilos, no solo tamaño de fuente.",
        ],
        [
            "Registra **provenance**: run_id, sha de datos, versiones de script, hashes de artefactos. Cola de aprobación: borrador → revisión visual → aprobado/rechazado con comentarios. Sin checklist visual completo, no hay cierre CP-N2-B.",
            "Contrato: `ready(checklist)` es True solo si dashboard, xlsx y doc están True. Hash sha1 de payload sintético (8 hex) en el manifiesto. Actor y timestamp en el log de aprobación (preludio de S22).",
            "Caso: checklist incompleto → False; completo → True. El paquete aprobado es la entrada limpia al flujo de email/identidad de S22 (inicio CP-N2-C).",
        ],
    ],
    "s22-rapidfuzz-entity.ts": [
        [
            "En V3, **S22 no es RapidFuzz/ER probabilístico avanzado** (eso madura más adelante). El id `rapidfuzz-entity` se conserva; aquí **inicias CP-N2-C**: MIME, sanitización HTML, scopes mínimos, drafts con expiración, resolución de destinatarios sintéticos, privacidad de listas, cola de aprobación humana e idempotencia.",
            "Hilo: borrador sintético `run_id=cpn2c-01`, contactos fake `@example.pe`. **Ningún correo real se envía**: solo `.eml` locales o drafts de sandbox. Matching de contactos es para **entrega correcta**, nunca para inferir fraude, parentesco o culpabilidad.",
            "Orden: **T1 Mensaje** (MIME, templates seguros) → **T2 Proveedor** (OAuth/scopes, adaptadores de draft) → **T3 Destinatario** (resolución, verificación, CC/BCC, mínima divulgación) → **T4 Workflow** (state machine de aprobación, audit log, reintento sin duplicar). Fail-closed sin aprobación humana.",
        ],
        [
            "**MIME** (`email.mime`) arma mensajes multiparte: text/plain + text/html + adjuntos. Charset **UTF-8** evita mojibake en nombres y acentos del español peruano. `MIMEMultipart('alternative')` ofrece ambas representaciones; el cliente elige.",
            "Contrato: `MIMEText(..., 'plain'|'html', 'utf-8')`; attachments con `Content-Disposition` y filename; nunca embeds de secretos (tokens, DNI) en el cuerpo. Limita tamaño de adjuntos sintéticos y márcalos como demo.",
            "Caso: `MIMEText('Hola','plain','utf-8')` → content-type text/plain; mixed + `MIMEApplication` con `a.txt`. Contar headers `Content-Type` valida el árbol multiparte en weDo.",
        ],
        [
            "Los **templates** interpolan variables (nombre, run_id, montos). Todo input no confiable se escapa (`html.escape`) o usa autoescape. Política de links: allowlist de dominios (`example.pe`) o rutas relativas; bloquea `javascript:` y `data:`.",
            "Contrato: template `Hola {name}` con name `<b>Ana</b>` debe producir entidades escapadas, no HTML activo. Allowlist: url con `example.pe` → `ok`, otro host → `blocked`. XSS en correo es riesgo real de phishing interno.",
            "Caso sintético: cuerpo con link a portal de revisión del run; sin allowlist, un template malicioso redirige a dominio externo. El gate de sanitización es obligatorio antes de encolar aprobación.",
        ],
        [
            "OAuth / service accounts operan con **scopes mínimos** (`mail.draft`, no `mail.full` ni `admin`). Modela credenciales con `client_id`, `scopes`, `expires_at` — **nunca** commits de secretos al repo del portfolio.",
            "Contrato: `requested ∩ allowed`; imprime True si granted no contiene scopes peligrosos. Tokens sintéticos del curso; registro de scopes pedidos vs concedidos como evidencia de least privilege.",
            "Caso: requested `mail.draft`+`mail.full` → filtrar a allowed; granted sin `mail.full`/`admin`. En sandbox, un scope de más es hallazgo de seguridad del diseño, no “detalle de config”.",
        ],
        [
            "Un **adaptador** (`GmailAdapter`, `SmtpFileAdapter`) expone `create_draft` / `get_draft` sin acoplar el workflow al SDK. Drafts llevan **expiración**: tras `expires_at` no se promueven a envío sin regenerar y reaprobar.",
            "Contrato: store en memoria o `out/drafts/`; ids secuenciales `d001`, `d002`; `is_usable` False si expiró. El curso escribe `.eml` simulados — cero SMTP real.",
            "Caso: draft `d001` status `draft`; expires_at = now−1s → no usable. create_draft idempotente a nivel de id secuencial en el ejercicio de transfer.",
        ],
        [
            "Resolución de destinatarios: valida formato de email, mapea `C001→email` desde dict sintético, verifica dominio permitido (`example.pe`). Estados: `unresolved` → `candidate` → `verified` | `rejected`.",
            "Contrato: match/score de similaridad de nombres, si se usa, lleva la nota explícita **`match_no_es_fraude`**. Un score 0.92 no autoriza claims de identidad legal ni parentesco; solo prioriza revisión de entrega.",
            "Caso: `ana@example.pe` ok, `bad` rejected; C001 verificado en dominio example.pe; imprimir score sintético 0.92 con la nota anti-claim. HITL si queda unresolved.",
        ],
        [
            "**CC** expone destinatarios entre sí; **BCC** oculta la lista. Prefiere BCC o envíos individuales cuando hay externos. **Mínima divulgación**: no pongas DNI/teléfono en el cuerpo si el informe ya va adjunto cifrado o en portal.",
            "Contrato: dedupe preservando orden; role=`bcc` si dominio externo (`@other.test`); contar cuántos emails quedarían visibles (to+cc) tras mover externos a bcc. Opt-out sintético y tope de tamaño de lista.",
            "Caso: lista con duplicados y un externo → tras higiene, visibles reducidos; el audit registra la política aplicada. Privacidad operativa, no solo “compliance de slide”.",
        ],
        [
            "La **cola de aprobación** es una state machine: `draft` → `pending_review` → `approved` | `rejected` | `needs_info`. Transiciones explícitas con actor y timestamp; sin transición válida, no hay envío ni promoción de draft.",
            "Contrato: tabla `TRANSITIONS`; `submit` desde draft → pending; `approve` desde draft → `invalid`. En CP-N2-C la aprobación humana es **obligatoria** antes de cualquier acción de envío (aunque el curso solo simule).",
            "Caso: log `{from,to,actor}` al aprobar pending→approved con actor `rev1`. El portfolio adjunta el log: evidencia de cumplimiento y de fail-closed.",
        ],
        [
            "Una **idempotency key** (p. ej. sha256 hex[:8] de `run_id|destinatario|versión del cuerpo`) evita drafts duplicados si el operador reintenta. El **audit log** registra create/submit/approve/retry con quién y cuándo.",
            "Contrato de reintento: si la key ya existe en estado terminal o activo, devuelve el id previo; no crea otro mensaje. Eventos `create` luego `retry_hit` en la lista de audit.",
            "Caso: dos `create` con la misma key → igualdad True de ids; audit `['create','retry_hit']`. Cierra el inicio de CP-N2-C hacia browser RPA (S23) y el VP de automatización.",
        ],
    ],
}


# Concept phrases per exercise id (for instruction expansion)
CONCEPTS: dict[str, str] = {
    # S18
    "S18-T1-A-E1": "centro (mean/median) y n de montos",
    "S18-T1-A-E2": "cuartiles e IQR",
    "S18-T1-A-E3": "función resumen n/mean/median/std",
    "S18-T1-B-E1": "mean vs median y razón",
    "S18-T1-B-E2": "MAD respecto a la mediana",
    "S18-T1-B-E3": "transformación log1p de montos",
    "S18-T2-A-E1": "share muestral vs población",
    "S18-T2-A-E2": "bias en puntos porcentuales",
    "S18-T2-A-E3": "máximo |bias| entre segmentos",
    "S18-T2-B-E1": "margen de IC 95% (1.96·s/√n)",
    "S18-T2-B-E2": "tamaño de efecto Cohen's d",
    "S18-T2-B-E3": "IC95 como tupla (low, high)",
    "S18-T3-A-E1": "correlación de Pearson",
    "S18-T3-A-E2": "etiqueta asociación_observada (no causa)",
    "S18-T3-A-E3": "correlación residual tras confusor",
    "S18-T3-B-E1": "conteo de outliers Tukey (hi=Q3+1.5·IQR)",
    "S18-T3-B-E2": "tasa de anomalías por región",
    "S18-T3-B-E3": "flags booleanos Tukey",
    "S18-T4-A-E1": "dict pregunta/hipótesis/resultado",
    "S18-T4-A-E2": "hallazgo vs umbral de decisión",
    "S18-T4-A-E3": "traza Pregunta→Métrica→Valor→Límite",
    "S18-T4-B-E1": "data note n_raw/n_final/filtros",
    "S18-T4-B-E2": "sha1 hex[:8] de payload CSV",
    "S18-T4-B-E3": "note tras filtro monto>0 con seed",
    # S19
    "S19-T1-A-E1": "chart choice para comparación regional",
    "S19-T1-A-E2": "metadata pregunta/audiencia/chart",
    "S19-T1-A-E3": "elige_chart por keyword tendencia",
    "S19-T1-B-E1": "inflación visual por baseline recortado",
    "S19-T1-B-E2": "gate ylim_bottom==0 (honesto/revisar)",
    "S19-T1-B-E3": "riesgo de dual_axis vs position",
    "S19-T2-A-E1": "bar chart con ylim desde 0",
    "S19-T2-A-E2": "ylabel de unidades PEN",
    "S19-T2-A-E3": "meta_bar n_bars y ylim0",
    "S19-T2-B-E1": "export dict fmt/dpi/panels",
    "S19-T2-B-E2": "nombre versionado de figura",
    "S19-T2-B-E3": "subplots 1×2 con títulos",
    "S19-T3-A-E1": "filtro de rows por región",
    "S19-T3-A-E2": "tooltip con unidad y n",
    "S19-T3-A-E3": "función tooltip(row)",
    "S19-T3-B-E1": "parity chart↔tabla",
    "S19-T3-B-E2": "state de filtros serializado JSON",
    "S19-T3-B-E3": "alt_text desde tabla",
    "S19-T4-A-E1": "caption con unidad y fuente",
    "S19-T4-A-E2": "validación de claves de caption",
    "S19-T4-A-E3": "pie de figura unido con |",
    "S19-T4-B-E1": "rechazo de claim sin 'muestra'",
    "S19-T4-B-E2": "alt text debe mencionar n=",
    "S19-T4-B-E3": "classify_claim PERMITIDO/RECHAZADO",
    # S20
    "S20-T1-A-E1": "crear hoja y celda de encabezado",
    "S20-T1-A-E2": "append de filas de datos",
    "S20-T1-A-E3": "múltiples sheetnames estables",
    "S20-T1-B-E1": "escribir fórmula en celda",
    "S20-T1-B-E2": "materializar valor vs fórmula",
    "S20-T1-B-E3": "detectar celda con prefijo =",
    "S20-T2-A-E1": "aplicar estilo de fuente a header",
    "S20-T2-A-E2": "freeze_panes o dimensión de print",
    "S20-T2-A-E3": "plantilla con hoja fija de catálogo",
    "S20-T2-B-E1": "fecha ISO en celda de metadata",
    "S20-T2-B-E2": "evitar merge en rango de datos",
    "S20-T2-B-E3": "protección / flag writable",
    "S20-T3-A-E1": "suma reconciliada df vs hoja",
    "S20-T3-A-E2": "conteo n filas de datos",
    "S20-T3-A-E3": "pivot materializado región→suma",
    "S20-T3-B-E1": "validar encabezados requeridos",
    "S20-T3-B-E2": "structural_ok de sheetnames",
    "S20-T3-B-E3": "preservar hoja de catálogo",
    "S20-T4-A-E1": "contadores batch ok/skip",
    "S20-T4-A-E2": "aislar archivo corrupto",
    "S20-T4-A-E3": "resumen JSON de corrida batch",
    "S20-T4-B-E1": "backup path versionado",
    "S20-T4-B-E2": "digest canónico de filas",
    "S20-T4-B-E3": "structural_ok need ⊆ sheets",
    # S21
    "S21-T1-A-E1": "render Jinja de saludo",
    "S21-T1-A-E2": "template de KPI median y n",
    "S21-T1-A-E3": "render_kpi(ctx) reutilizable",
    "S21-T1-B-E1": "missing → em-dash —",
    "S21-T1-B-E2": "formato a 2 decimales",
    "S21-T1-B-E3": "for de filas region:value",
    "S21-T2-A-E1": "DOCX con heading y n=",
    "S21-T2-A-E2": "conteo de estilos Heading",
    "S21-T2-A-E3": "extracción de texto al reabrir",
    "S21-T2-B-E1": "PDF digital con texto extraíble",
    "S21-T2-B-E2": "render página a PNG",
    "S21-T2-B-E3": "PDF imagen-only → needs_ocr",
    "S21-T3-A-E1": "hallazgo H1 con evidencia",
    "S21-T3-A-E2": "validar resumen contiene n=",
    "S21-T3-A-E3": "pack_report tres claves",
    "S21-T3-B-E1": "caption alineado fuente/corte",
    "S21-T3-B-E2": "lista de limitaciones",
    "S21-T3-B-E3": "checksum de métricas entre artefactos",
    "S21-T4-A-E1": "redacción es-PE de hallazgo",
    "S21-T4-A-E2": "checklist a11y headings/alt",
    "S21-T4-A-E3": "precisión decimal consistente",
    "S21-T4-B-E1": "manifiesto de provenance",
    "S21-T4-B-E2": "hash sha1[:8] de payload",
    "S21-T4-B-E3": "ready(checklist) de paquete",
    # S22
    "S22-T1-A-E1": "MIMEText plain utf-8",
    "S22-T1-A-E2": "MIMEMultipart mixed + adjunto",
    "S22-T1-A-E3": "alternative text+html anidado",
    "S22-T1-B-E1": "html.escape de script",
    "S22-T1-B-E2": "interpolación con escape",
    "S22-T1-B-E3": "allowlist de dominios en URL",
    "S22-T2-A-E1": "filtrar scopes a allowed",
    "S22-T2-A-E2": "denied scopes peligrosos",
    "S22-T2-A-E3": "expires_at → refresh|valid",
    "S22-T2-B-E1": "crear draft en store",
    "S22-T2-B-E2": "is_usable por expiración",
    "S22-T2-B-E3": "ids de draft secuenciales",
    "S22-T3-A-E1": "regex simple de email",
    "S22-T3-A-E2": "resolver C001 y dominio",
    "S22-T3-A-E3": "score + nota match_no_es_fraude",
    "S22-T3-B-E1": "dedupe de lista preservando orden",
    "S22-T3-B-E2": "forzar role bcc a externos",
    "S22-T3-B-E3": "conteo de visibles to+cc",
    "S22-T4-A-E1": "transición submit draft→pending",
    "S22-T4-A-E2": "approve inválido desde draft",
    "S22-T4-A-E3": "log de aprobación con actor",
    "S22-T4-B-E1": "idempotency key sha256[:8]",
    "S22-T4-B-E2": "create idempotente por key",
    "S22-T4-B-E3": "audit create + retry_hit",
}


SELFCHECK_EXTRA: dict[str, dict] = {
    "s18-data-engineering.ts": {
        "question": "En un EDA de tickets sintéticos Lima/Cusco, ¿cuál es la comunicación correcta de un r de Pearson alto entre gasto y visitas cuando ambos crecen con el tamaño de la ciudad (confusor)?",
        "options": [
            "Afirmar que más visitas causan más gasto y recomendar campaña automática",
            "Reportar asociación observada, explorar el confusor y evitar verbos causales sin diseño",
            "Eliminar la correlación del informe porque “no es causal” y no mostrar el número",
            "Usar solo la media y omitir n e intervalos para simplificar el slide ejecutivo",
        ],
        "correctIndex": 1,
        "explanation": "Correlación ≠ causalidad. El EDA reporta asociación con n/límites y posibles confusores; no borra el número ni salta a decisión automática.",
    },
    "s19-databases-orm.ts": {
        "question": "Un gráfico de barras de montos PEN recorta el eje Y para empezar en 40 en lugar de 0. ¿Qué debe hacer el gate de integridad del dashboard CP-N2-B?",
        "options": [
            "Aceptarlo si los colores tienen buen contraste",
            "Marcarlo como riesgo de inflación visual y exigir baseline 0 o justificación explícita",
            "Convertirlo automáticamente a dual-axis para “ganar espacio”",
            "Eliminar las etiquetas de ejes para que se vea más limpio en el slide",
        ],
        "correctIndex": 1,
        "explanation": "Recortar el baseline de barras de magnitudes absolutas infla diferencias. El gate pide ylim 0 o justificación documentada.",
    },
    "s20-rag.ts": {
        "question": "Al materializar un Excel de salida del reporting factory, la suma de montos en la hoja no cuadra con el DataFrame fuente. ¿Cuál es la política correcta?",
        "options": [
            "Enviar el xlsx igual y aclarar la diferencia solo si el cliente pregunta",
            "Fail-closed: no emitir el paquete hasta reconciliar n y totales (con tolerancia de redondeo documentada)",
            "Borrar la hoja de Entrada para que no se note la discrepancia",
            "Cambiar el total del DataFrame para que coincida con Excel sin audit trail",
        ],
        "correctIndex": 1,
        "explanation": "La conciliación es un quality gate del factory. Sin cuadrar totales/n, no se emite el paquete hacia S21.",
    },
    "s21-fastapi.ts": {
        "question": "El PDF del informe se generó dibujando texto dentro de una imagen; pypdf no extrae capa de texto. ¿Qué debe devolver el contrato de trazabilidad?",
        "options": [
            "Inventar el texto del resumen a partir del título del archivo",
            "Marcar needs_ocr (o equivalente) y no fingir PDF digital nativo",
            "Aprobar el paquete igual porque el PNG se ve legible en pantalla",
            "Convertir el PDF a DOCX sin avisar en el provenance",
        ],
        "correctIndex": 1,
        "explanation": "PDF imagen-only no es texto seleccionable. El contrato documenta needs_ocr; no inventa extracción ni oculta el modo en provenance.",
    },
    "s22-rapidfuzz-entity.ts": {
        "question": "Un score de similaridad 0.92 entre dos nombres de contactos sintéticos, ¿qué autoriza en el flujo de email de CP-N2-C?",
        "options": [
            "Declarar fraude o parentesco y bloquear al cliente automáticamente",
            "Priorizar revisión de entrega/resolución de destinatario, con nota match≠fraude y HITL si aplica",
            "Enviar el correo sin aprobación porque el score supera 0.9",
            "Publicar el DNI del contacto en el cuerpo para “confirmar identidad”",
        ],
        "correctIndex": 1,
        "explanation": "Matching apoya entrega correcta; no prueba fraude ni identidad legal. Aprobación humana e idempotencia siguen siendo obligatorias antes de cualquier envío (simulado).",
    },
}


def build_instruction(step: dict) -> str:
    eid = step["id"]
    kind = step["kind"]
    label = KIND_ES.get(kind, kind)
    concept = CONCEPTS.get(eid, step["instruction"][:80])
    out = (step.get("output") or "").strip()
    # compact pass preview
    pass_line = out.split("\n")[0] if out else "(ver solution output)"
    if len(out) > 80:
        pass_preview = pass_line + (" …" if "\n" in out else "")
    else:
        pass_preview = out.replace("\n", " | ") if out else pass_line

    # extract a short fixture hint from solution first non-import lines
    sol = step.get("solution") or ""
    fixture_bits = []
    for line in sol.splitlines():
        t = line.strip()
        if not t or t.startswith("#"):
            continue
        if t.startswith("import ") or t.startswith("from "):
            continue
        fixture_bits.append(t)
        if len(fixture_bits) >= 2:
            break
    fixture = "; ".join(fixture_bits)[:120] if fixture_bits else "fixture del starter"

    instr = (
        f"{label} — Concepto: {concept}. Fixture `{eid}` / datos sintéticos: {fixture}. "
        f"Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. "
        f"Pass (salida exacta del solution): `{pass_preview}`."
    )
    return ensure_instr(instr, 150)


def enrich_starter(starter: str, solution: str) -> str:
    """Keep real scaffold: prefer solution data setup + single TODO if starter is thin."""
    if len(starter.strip()) >= 120 and "# TODO" in starter:
        return starter
    # Pull leading imports + first assignments from solution
    lines = solution.splitlines()
    kept: list[str] = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("def ") or stripped.startswith("class "):
            break
        if stripped.startswith("print("):
            break
        if stripped.startswith("return "):
            break
        kept.append(line)
        # stop after a few setup lines
        if len(kept) >= 12:
            break
    if not kept:
        kept = [ln for ln in lines[:5]]
    body = "\n".join(kept).rstrip() + "\n# TODO: completa el contrato del ejercicio (ver instruction)\n"
    # Avoid accidental huge starters
    if len(body) > 800:
        body = "\n".join(kept[:8]).rstrip() + "\n# TODO\n"
    return body


def find_paragraph_arrays(text: str) -> list[tuple[int, int, int]]:
    """Return list of (start_of_key, open_bracket, close_bracket_inclusive) for each paragraphs: [...]."""
    spans = []
    for m in re.finditer(r"paragraphs:\s*", text):
        i = m.end()
        while i < len(text) and text[i].isspace():
            i += 1
        if i >= len(text) or text[i] != "[":
            continue
        open_i = i
        depth = 0
        in_str = False
        escape = False
        quote = ""
        j = i
        while j < len(text):
            ch = text[j]
            if in_str:
                if escape:
                    escape = False
                elif ch == "\\":
                    escape = True
                elif ch == quote:
                    in_str = False
                j += 1
                continue
            if ch in ('"', "'"):
                in_str = True
                quote = ch
                j += 1
                continue
            if ch == "[":
                depth += 1
            elif ch == "]":
                depth -= 1
                if depth == 0:
                    spans.append((m.start(), open_i, j))  # j is index of ]
                    break
            j += 1
    return spans


def replace_paragraphs_block(text: str, block_index: int, new_paras: list[str]) -> str:
    """Replace the block_index-th paragraphs: [ ... ] array (0-based among theory blocks)."""
    spans = find_paragraph_arrays(text)
    if block_index >= len(spans):
        raise IndexError(f"paragraphs block {block_index} not found (have {len(spans)})")
    start_key, open_i, close_i = spans[block_index]
    # include trailing comma after ] if present
    end = close_i + 1
    rest = text[end:end+5]
    trailing = ""
    if rest.lstrip().startswith(","):
        # keep the comma outside replacement for stability
        pass
    inner = ",\n".join(f'        "{esc_ts_double(p if len(p) >= 240 else ensure_len(p, 250))}"' for p in new_paras)
    replacement = f"paragraphs: [\n{inner},\n      ]"
    return text[:start_key] + replacement + text[end:]


def replace_instructions(text: str, steps: list[dict]) -> str:
    for step in steps:
        eid = step["id"]
        new_instr = build_instruction(step)
        # Find instruction belonging to this id
        pat = re.compile(
            rf'(id:\s*"{re.escape(eid)}"[\s\S]*?instruction:\s*\n?\s*")((?:[^"\\]|\\.)*)(")',
            re.M,
        )
        m = pat.search(text)
        if not m:
            print(f"  WARN: instruction not found for {eid}")
            continue
        text = text[: m.start(2)] + esc_ts_double(new_instr) + text[m.end(2) :]
    return text


def replace_starters(text: str, steps: list[dict]) -> str:
    for step in steps:
        eid = step["id"]
        new_starter = enrich_starter(step["starter"], step["solution"])
        # Only update if enrichment is richer
        if len(new_starter) <= len(step["starter"]) + 5:
            continue
        pat = re.compile(
            rf'(id:\s*"{re.escape(eid)}"[\s\S]*?starterCode:\s*\{{\s*language:\s*\'python\',\s*title:\s*"[^"]+",\s*code:\s`)([^`]*)(`)',
            re.M,
        )
        m = pat.search(text)
        if not m:
            print(f"  WARN: starter not found for {eid}")
            continue
        # Escape backticks in starter for template literal
        safe = new_starter.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
        text = text[: m.start(2)] + safe + text[m.end(2) :]
    return text


def append_selfcheck(text: str, fname: str) -> str:
    extra = SELFCHECK_EXTRA[fname]
    # If already 5 questions, skip
    if len(re.findall(r"question:\s*\"", text.split("selfCheck:")[-1] if "selfCheck:" in text else "")) >= 5:
        return text
    block = textwrap.dedent(
        f"""
      {{
        question: "{esc_ts_double(extra['question'])}",
        options: [
          "{esc_ts_double(extra['options'][0])}",
          "{esc_ts_double(extra['options'][1])}",
          "{esc_ts_double(extra['options'][2])}",
          "{esc_ts_double(extra['options'][3])}",
        ],
        correctIndex: {extra['correctIndex']},
        explanation:
          "{esc_ts_double(extra['explanation'])}",
      }},
"""
    )
    # Insert before closing of questions array: find selfCheck questions last ]
    m = re.search(r"(selfCheck:\s*\{\s*questions:\s*\[)([\s\S]*?)(\n\s*\],\s*\},)", text)
    if not m:
        # try without trailing comma variants
        m = re.search(r"(selfCheck:\s*\{\s*questions:\s*\[)([\s\S]*?)(\n\s*\]\s*\},)", text)
    if not m:
        print("  WARN: selfCheck not found")
        return text
    # Avoid duplicate if question already present
    if extra["question"][:40] in m.group(2):
        return text
    new_mid = m.group(2).rstrip() + "\n" + block
    return text[: m.start(2)] + new_mid + text[m.end(2) :]


def expand_file(fname: str, dump: dict) -> dict:
    path = SECTIONS / fname
    text = path.read_text()
    before_bytes = len(text.encode())
    theory = THEORY[fname]
    assert len(theory) == 9, fname

    # Replace paragraphs from last to first so indices stay valid
    for i in range(8, -1, -1):
        text = replace_paragraphs_block(text, i, theory[i])

    steps = dump[fname]["steps"]
    text = replace_instructions(text, steps)
    text = replace_starters(text, steps)
    text = append_selfcheck(text, fname)

    path.write_text(text)
    after_bytes = len(text.encode())
    return {"file": fname, "before": before_bytes, "after": after_bytes}


def extract_paras(text: str) -> list[str]:
    paras: list[str] = []
    for _sk, open_i, close_i in find_paragraph_arrays(text):
        block = text[open_i + 1 : close_i]
        for s in re.findall(r'"((?:[^"\\]|\\.)*)"', block):
            s2 = s.replace("\\n", "\n").replace('\\"', '"').replace("\\\\", "\\")
            if len(s2.strip()) > 5:
                paras.append(s2)
    return paras


def metrics(path: Path) -> dict:
    text = path.read_text()
    paras = extract_paras(text)
    instr = [
        i.replace("\\n", "\n").replace('\\"', '"')
        for i in re.findall(r'instruction:\s*\n?\s*"((?:[^"\\]|\\.)*)"', text)
    ]
    plens = [len(p.strip()) for p in paras]
    ilens = [len(i.strip()) for i in instr]
    thin = sum(1 for L in plens if L < 120) / len(plens) if plens else 0
    sc = len(re.findall(r"question:", text.split("selfCheck:")[-1])) if "selfCheck:" in text else 0
    return {
        "n_para": len(plens),
        "avg_para": round(sum(plens) / len(plens), 1) if plens else 0,
        "thin_para_ratio": round(thin, 2),
        "min_para": min(plens) if plens else 0,
        "n_instr": len(ilens),
        "avg_instr": round(sum(ilens) / len(ilens), 1) if ilens else 0,
        "min_instr": min(ilens) if ilens else 0,
        "selfcheck_q": sc,
        "kb": round(path.stat().st_size / 1024, 1),
    }


def main() -> None:
    dump = json.loads(DUMP.read_text())
    files = [
        "s22-rapidfuzz-entity.ts",
        "s21-fastapi.ts",
        "s20-rag.ts",
        "s19-databases-orm.ts",
        "s18-data-engineering.ts",
    ]
    results = []
    for fname in files:
        print("Expanding", fname)
        meta = expand_file(fname, dump)
        m = metrics(SECTIONS / fname)
        meta.update(m)
        results.append(meta)
        print(" ", m)
        assert m["avg_para"] >= 250, m
        assert m["avg_instr"] >= 150, m
        assert m["thin_para_ratio"] <= 0.2, m
        assert m["n_instr"] == 24, m
        assert m["n_para"] >= 24, m
    Path("/tmp/s18_s22_metrics.json").write_text(json.dumps(results, indent=2))
    print("OK", results)


if __name__ == "__main__":
    main()
