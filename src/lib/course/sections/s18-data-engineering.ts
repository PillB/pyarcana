import type { CourseSection } from '../../types'

export const section18: CourseSection = {
  id: "data-engineering",
  index: 18,
  title: "EDA, estadística descriptiva e incertidumbre",
  shortTitle: "EDA e incertidumbre",
  tagline: "EDA que diferencia hallazgo, hipótesis y decisión; cada conclusión referencia un cálculo y declara incertidumbre",
  estimatedHours: 18,
  level: "Competente",
  phase: 1,
  icon: "Wrench",
  accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
  jobRelevance:
    "En analytics y data products de banca, fintech y retail en Perú, un **EDA honesto** separa hallazgo, hipótesis y decisión. Esta sección (id de plataforma `data-engineering` conservado) retematiza a V3 **EDA, estadística descriptiva e incertidumbre** e inicia **CP-N2-B** con datos sintéticos, intervalos básicos y data notes reproducibles.",
  learningOutcomes: [
    { text: "Resumir distribuciones con centro, dispersión y cuantiles" },
    { text: "Elegir métricas robustas y escalas honestas" },
    { text: "Identificar sesgo de población/muestra" },
    { text: "Reportar intervalos y tamaños de efecto básicos" },
    { text: "Interpretar correlación sin confundir causalidad" },
    { text: "Segmentar y marcar anomalías con límites claros" },
    { text: "Estructurar preguntas, hipótesis y evidencia" },
    { text: "Entregar notebook/script reproducible con data notes" },
  ],
  theory: [
    {
      heading: "De “Ingeniería de Datos Intermedia” a EDA e incertidumbre (mapa de la sección)",
      paragraphs: [
        "En V3, **S18 no es el path principal de Prefect, Parquet ni Great Expectations** (eso se reubica a ingeniería avanzada). El id de plataforma `data-engineering` se conserva, pero el camino del estudiante es el **inicio de CP-N2-B**: centro/dispersión, métricas robustas, sesgo muestral, intervalos básicos, correlación sin causalidad y notebooks con data notes reproducibles.",
        "El hilo conductor es un **dataset sintético de tickets/montos** con regiones ficticias Lima, Arequipa y Cusco, ids `T00x` y montos en PEN. Cada hallazgo del portfolio debe citar un cálculo (n, métrica, IC o flag) y declarar incertidumbre: hallazgo ≠ hipótesis ≠ decisión de negocio.",
        "Orden pedagógico: **T1 Distribuciones** (centro, cuantiles, robustez y escalas) → **T2 Inferencia básica** (población/muestra, IC y tamaño de efecto) → **T3 Relaciones** (correlación, confusión, segmentos y anomalías sin claim causal) → **T4 Comunicación** (plantilla Q→H→E y data notes). Solo numpy/pandas ya vistos; sin PII real.",
      ],
      callout: {
        type: "info",
        title: "Contenido reubicado conceptualmente",
        content:
          "Material legado de Prefect/Parquet/GE de este archivo **no es el camino V3 del estudiante en S18**. Target: EDA e incertidumbre para CP-N2-B (inicio). Solo datos sintéticos; nunca PII real.",
      },
    },
    {
      heading: "centro, dispersión y cuantiles",
      subtopicId: "S18-T1-A",
      paragraphs: [
        "El **centro** se resume con media (`mean`) o mediana (`median`); la **dispersión** con desviación estándar muestral (`std`, `ddof=1`) o **IQR** (Q3−Q1). En montos de tickets peruanos sintéticos la media se mueve con colas; la mediana suele ser el “ticket típico” que el negocio pregunta primero.",
        "Contrato operativo: reporta siempre **n**, al menos un cuantil de cola (p90/p95 o max) y la métrica de centro elegida con justificación. Los cuantiles (p25, p50, p75, p90) describen la forma **sin asumir normalidad** — no digas “distribución normal” solo porque calculaste media y std.",
        "Caso sintético: montos `[12.5, 18, 22, 25.5, 30, 45, 120]` PEN → media ~39, mediana 25.5, IQR ~17.5. En el memo de CP-N2-B escribes “mediana 25.5 PEN (n=7); cola p90 elevada por un outlier de 120” — no “el ticket promedio es 39 y representa al cliente típico”.",
      ],
      code: {
        language: 'python',
        title: "center_spread.py",
        code: `import numpy as np

montos = np.array([12.5, 18.0, 22.0, 25.5, 30.0, 45.0, 120.0])  # sintético PEN
print("n", montos.size)
print("mean", round(float(montos.mean()), 2))
print("median", float(np.median(montos)))
print("std", round(float(montos.std(ddof=1)), 2))
q = np.quantile(montos, [0.25, 0.5, 0.75, 0.9])
print("q25_q50_q75_q90", [round(float(x), 2) for x in q])
print("IQR", round(float(q[2] - q[0]), 2))`,
        output: `n 7
mean 39.0
median 25.5
std 37.18
q25_q50_q75_q90 [20.0, 25.5, 37.5, 75.0]
IQR 17.5`,
      },
      callout: {
        type: "tip",
        title: "ddof en std muestral",
        content:
          "Para muestra usa ddof=1 (n−1). Documenta si usas población (ddof=0).",
      },
    },
    {
      heading: "métricas robustas y escalas",
      subtopicId: "S18-T1-B",
      paragraphs: [
        "Métricas **robustas** (mediana, IQR, MAD = mediana de |x − mediana|) resisten outliers mejor que media/std. Úsalas cuando la pregunta sea “típico” o cuando un solo valor extremo distorsione el resumen ejecutivo. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Contrato de escala: `log1p` de montos reduce asimetría visual para EDA, pero **no** compares diferencias log como soles PEN sin transformar de vuelta. Si el eje está en log, dilo en el gráfico y en la conclusión; si el KPI es en PEN, reporta en PEN.",
        "Elige métrica según la pregunta de negocio: “ticket típico web Lima” → mediana + IQR; “ingreso total esperado del día” → suma o media con cola documentada. Caso: x con un 200 PEN junto a tickets ~12 → media ~43 vs mediana ~12; el dashboard debe preferir mediana para “típico”.",
      ],
      code: {
        language: 'python',
        title: "robust_scale.py",
        code: `import numpy as np

x = np.array([10.0, 12.0, 11.0, 13.0, 12.5, 200.0])
med = float(np.median(x))
mad = float(np.median(np.abs(x - med)))
print("median", med, "MAD", mad)
print("mean_vs_median", round(float(x.mean()), 2), med)
print("log1p", np.round(np.log1p(x), 3).tolist())`,
        output: `median 12.25 MAD 1.0
mean_vs_median 43.08 12.25
log1p [2.398, 2.565, 2.485, 2.639, 2.603, 5.303]`,
      },
      callout: {
        type: "warning",
        title: "Escala log y comunicación",
        content:
          "Si usas log, dilo en el eje y en la conclusión; no compares diferencias log como soles PEN sin transformar.",
      },
    },
    {
      heading: "población, muestra y sesgo",
      subtopicId: "S18-T2-A",
      paragraphs: [
        "La **población** es el universo de interés (p. ej. todos los tickets del canal en el mes); la **muestra** es lo observado. El **sesgo de selección** aparece si el muestreo no es representativo — p. ej. solo Lima o solo canal web — aunque el `mean` esté bien calculado.",
        "Contrato: compara shares de la muestra vs un **marco** conocido (cuotas por región). Documenta exclusiones (filtros de fecha, canal, `monto>0`). Calcula `bias_pp = share_muestra − share_pob` por segmento y reporta el máximo |bias| como riesgo de generalización.",
        "Sin marco poblacional, declara **cobertura limitada** y no generalices a “todos los clientes del Perú”. Caso sintético: pob Lima 0.55 / Arequipa 0.25 / Cusco 0.20 vs muestra 80% Lima → bias Lima +0.25; cualquier KPI regional debe llevar esa nota en el data note.",
      ],
      code: {
        language: 'python',
        title: "sample_bias.py",
        code: `import numpy as np

# población sintética de tickets por región
pob = {"Lima": 0.55, "Arequipa": 0.25, "Cusco": 0.20}
# muestra sesgada: sobremuestra Lima
muestra = np.array(["Lima"] * 40 + ["Arequipa"] * 8 + ["Cusco"] * 2)
from collections import Counter
c = Counter(muestra)
n = len(muestra)
share = {k: round(v / n, 3) for k, v in c.items()}
print("share_muestra", share)
print("share_pob", pob)
bias = {k: round(share.get(k, 0) - pob[k], 3) for k in pob}
print("bias_pp", bias)`,
        output: `share_muestra {np.str_('Lima'): 0.8, np.str_('Arequipa'): 0.16, np.str_('Cusco'): 0.04}
share_pob {'Lima': 0.55, 'Arequipa': 0.25, 'Cusco': 0.2}
bias_pp {'Lima': 0.25, 'Arequipa': -0.09, 'Cusco': -0.16}`,
      },
      callout: {
        type: "danger",
        title: "Sesgo ≠ error de cálculo",
        content:
          "Un mean correcto sobre una muestra sesgada sigue siendo una estimación sesgada de la población.",
      },
    },
    {
      heading: "intervalos básicos y tamaño de efecto",
      subtopicId: "S18-T2-B",
      paragraphs: [
        "Un **intervalo de confianza** aproximado para la media con n grande: media ± z·(s/√n) (z≈1.96 para 95%). Con n pequeño o colas pesadas, sé cauteloso: reporta n, considera bootstrap simple y evita lenguaje de “probado al 95%”. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "El **tamaño de efecto** (Cohen's d ≈ (μ₁−μ₀)/s_pooled, o diferencia de medianas en PEN) comunica **magnitud**, no solo “significativo”. Un efecto chico con n enorme puede ser “significativo” y aún irrelevante para la decisión de negocio. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Contrato de lenguaje: di “compatible con” / “en la muestra” y reporta n + IC; nunca “probado” con un solo IC. Caso: media B 108 vs A 94, d≈1.1, IC95 de B — el insight es magnitud + incertidumbre, no un veredicto causal de campaña. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
      ],
      code: {
        language: 'python',
        title: "interval_effect.py",
        code: `import numpy as np

rng = np.random.default_rng(7)
a = rng.normal(100, 15, size=40)
b = rng.normal(108, 15, size=40)
ma, mb = a.mean(), b.mean()
sa, sb = a.std(ddof=1), b.std(ddof=1)
# IC 95% approx para media de b
se = sb / np.sqrt(len(b))
ic = (mb - 1.96 * se, mb + 1.96 * se)
sp = np.sqrt((sa**2 + sb**2) / 2)
d = (mb - ma) / sp
print("mean_a", round(ma, 2), "mean_b", round(mb, 2))
print("ic95_b", (round(ic[0], 2), round(ic[1], 2)))
print("cohens_d", round(float(d), 3))`,
        output: `mean_a 94.07 mean_b 108.64
ic95_b (np.float64(104.39), np.float64(112.88))
cohens_d 1.118`,
      },
      callout: {
        type: "tip",
        title: "Efecto + incertidumbre",
        content:
          "Reporta diferencia puntual, IC y n. El tamaño de efecto evita obsesionarse solo con p-values.",
      },
    },
    {
      heading: "correlación y confusión",
      subtopicId: "S18-T3-A",
      paragraphs: [
        "La **correlación** (Pearson lineal / Spearman monótona) mide asociación, **no causa**. Un confusor Z puede crear asociación espuria entre X e Y; residualizar Z (regresión simple) es un chequeo de EDA, no un diseño causal completo. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Contrato de verbos: en EDA etiqueta **asociación observada**. Lista causas comunes y diseños que las romperían (experimento, instrumento) antes de cualquier claim causal en el informe de CP-N2-B. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Pearson es sensible a outliers; Spearman usa rangos y tolera monótonas no lineales leves. Caso sintético: X e Y generados por Z → r_xy alto, r residual ≈0; el notebook debe imprimir ambos y la nota “no causal”. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
      ],
      code: {
        language: 'python',
        title: "corr_confound.py",
        code: `import numpy as np

rng = np.random.default_rng(1)
# confounder Z genera X e Y
z = rng.normal(0, 1, 80)
x = 0.8 * z + rng.normal(0, 0.3, 80)
y = 0.7 * z + rng.normal(0, 0.3, 80)
r = np.corrcoef(x, y)[0, 1]
print("pearson_xy", round(float(r), 3))
# control parcial tosco: residualizar Z
def resid(a, z):
    b = np.polyfit(z, a, 1)
    return a - (b[0] * z + b[1])
rx, ry = resid(x, z), resid(y, z)
print("pearson_residual", round(float(np.corrcoef(rx, ry)[0, 1]), 3))`,
        output: `pearson_xy 0.828
pearson_residual 0.075`,
      },
      callout: {
        type: "warning",
        title: "Correlación ≠ causalidad",
        content:
          "Si no controlas confusores ni tienes diseño causal, no uses verbos causales en el informe.",
      },
    },
    {
      heading: "segmentación, anomalías y causalidad no demostrada",
      subtopicId: "S18-T3-B",
      paragraphs: [
        "Segmenta por región, canal o cohorte con **reglas explícitas** (no clusters opacos sin contrato). Las anomalías Tukey (fuera de [Q1−1.5·IQR, Q3+1.5·IQR]) son **candidatos a revisión**, nunca “fraudes demostrados” ni culpa de persona/región.",
        "Contrato: marca flags booleanos, calcula tasas por segmento, documenta umbral, n por segmento y que el método es univariado. Evita “Cusco genera outliers porque…” — eso es claim causal no soportado. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Caso sintético: montos con un 80 PEN en Cusco → flag anomalía en ese id; tasa Cusco 0.2 vs Lima 0.0 es hallazgo descriptivo. El portfolio lista `ids_anom` y el método; la decisión de investigación es humana y posterior. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
      ],
      code: {
        language: 'python',
        title: "segments_anom.py",
        code: `import numpy as np
import pandas as pd

df = pd.DataFrame({
    "region": ["Lima"] * 5 + ["Cusco"] * 5,
    "monto": [20, 22, 21, 25, 19, 18, 23, 80, 21, 20],
})
q1, q3 = df["monto"].quantile(0.25), df["monto"].quantile(0.75)
iqr = q3 - q1
lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
df["anomalia"] = (df["monto"] < lo) | (df["monto"] > hi)
print("limites", round(float(lo), 2), round(float(hi), 2))
print(df.groupby("region")["anomalia"].mean().round(3).to_dict())
print("ids_anom", df.index[df["anomalia"]].tolist())`,
        output: `limites 15.88 26.88
{'Cusco': 0.2, 'Lima': 0.0}
ids_anom [7]`,
      },
      callout: {
        type: "info",
        title: "Sin claim causal",
        content:
          "Una tasa mayor de anomalías en un segmento es hallazgo descriptivo, no prueba de causa.",
      },
    },
    {
      heading: "preguntas, hipótesis y evidencia",
      subtopicId: "S18-T4-A",
      paragraphs: [
        "Separa tres capas: **pregunta de negocio**, **hipótesis comprobable**, **evidencia calculada**. El hallazgo (número + n + límite) no es la decisión (lanzar campaña, bloquear cuenta, cambiar precio). En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Plantilla operativa: Pregunta → Métrica → Resultado (n, punto, IC) → Límite de cobertura → Siguiente paso. Cada celda del insight en CP-N2-B debe poder rastrearse a un print/assert del script. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Caso: “¿El ticket mediano en Lima supera 25 PEN?” → median(monto|Lima)=27.5, n=40, IC bootstrap aprox., límite “solo canal web”. Conclusión permitida: hipótesis provisional en web Lima; no “desplegar campaña nacional”. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
      ],
      code: {
        language: 'python',
        title: "qhe_template.py",
        code: `# plantilla de traza hallazgo → cálculo (sintético)
pregunta = "¿El ticket mediano en Lima supera 25 PEN?"
metrica = "median(monto | region==Lima)"
resultado = {"n": 40, "median": 27.5, "ic_boot_approx": (24.0, 31.0)}
limite = "muestra de canal web, no incluye tienda física"
decision_sugerida = "hipótesis provisional: sí en web Lima; validar con marco completo"
print("pregunta:", pregunta)
print("metrica:", metrica)
print("resultado:", resultado)
print("limite:", limite)
print("no_es_decision:", "no lanzar campaña aún")`,
        output: `pregunta: ¿El ticket mediano en Lima supera 25 PEN?
metrica: median(monto | region==Lima)
resultado: {'n': 40, 'median': 27.5, 'ic_boot_approx': (24.0, 31.0)}
limite: muestra de canal web, no incluye tienda física
no_es_decision: no lanzar campaña aún`,
      },
      callout: {
        type: "tip",
        title: "Hallazgo ≠ decisión",
        content:
          "La decisión de negocio requiere costo, riesgo y cobertura; el EDA solo aporta evidencia parcial.",
      },
    },
    {
      heading: "notebook reproducible y data notes",
      subtopicId: "S18-T4-B",
      paragraphs: [
        "Un **data note** documenta origen, fecha de corte, filtros, n pre/post, seed y un hash o conteo de filas. Si otro agente no regenera los mismos n y métricas clave, el notebook **no cierra** el gate S18. En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
        "Contrato de reproducibilidad: versiones (pandas/numpy), rutas relativas, outputs en `out/`, seed fijo, sin celdas que muten estado global en orden opaco. Checklist mínima: seed, schema, n pre/post filtros, hash de payload, límites de generalización.",
        "Caso sintético: CSV de 3 tickets → `row_sha1_8`, n=3, filtros `monto>0`, seed=42. El portfolio adjunta el JSON del note junto al resumen de medianas; es la base de trazabilidad hacia S19–S21 (dashboard y reporting factory). En el workbench sintético (Lima/Cusco/Arequipa, PEN, ids `T00x`/`C00x`) documentas contrato de entrada/salida, n del slice y límites: sin PII real, sin claims de fraude ni causalidad no soportada, y con fail-closed cuando falte evidencia o revisión humana.",
      ],
      code: {
        language: 'python',
        title: "data_notes.py",
        code: `import hashlib
import json
import numpy as np
import pandas as pd

df = pd.DataFrame({"ticket_id": ["T001", "T002", "T003"], "monto": [10.0, 20.0, 15.0]})
payload = df.to_csv(index=False).encode()
note = {
    "origen": "sintetico_local",
    "corte": "2024-06-30",
    "n": len(df),
    "filtros": ["monto > 0"],
    "seed": 42,
    "row_sha1_8": hashlib.sha1(payload).hexdigest()[:8],
}
print(json.dumps(note, ensure_ascii=False))
print("mean", float(df["monto"].mean()))`,
        output: `{"origen": "sintetico_local", "corte": "2024-06-30", "n": 3, "filtros": ["monto > 0"], "seed": 42, "row_sha1_8": "6b78e80d"}
mean 15.0`,
      },
      callout: {
        type: "success",
        title: "Reproducibilidad mínima",
        content:
          "Si otro agente no puede regenerar los mismos n y métricas clave, el notebook no cierra el gate S18.",
      },
    },
  ],
  iDo: {
    intro: "Te demuestro el EDA de CP-N2-B inicio: resúmenes, sesgo, intervalos, correlación sin causalidad y data notes con datos sintéticos peruanos.",
    steps: [
      {
        demoId: "S18-T1-A-DEMO",
        subtopicId: "S18-T1-A",
        environment: "local-python",
        description: "Resumir distribución de montos sintéticos con centro, dispersión y cuantiles",
        code: {
          language: 'python',
          title: "demo_center_spread.py",
          code: `import numpy as np

rng = np.random.default_rng(18)
montos = np.concatenate([rng.lognormal(3.0, 0.4, 90), np.array([400.0, 450.0])])
def resumen(x):
    q = np.quantile(x, [0.25, 0.5, 0.75, 0.9])
    return {
        "n": int(x.size),
        "mean": round(float(x.mean()), 2),
        "median": round(float(np.median(x)), 2),
        "std": round(float(x.std(ddof=1)), 2),
        "q25": round(float(q[0]), 2),
        "q50": round(float(q[1]), 2),
        "q75": round(float(q[2]), 2),
        "q90": round(float(q[3]), 2),
        "IQR": round(float(q[2] - q[0]), 2),
    }
print(resumen(montos))`,
          output: `{'n': 92, 'mean': 30.5, 'median': 20.02, 'std': 60.01, 'q25': 16.12, 'q50': 20.02, 'q75': 25.34, 'q90': 33.98, 'IQR': 9.22}`,
        },
        why: "Un resumen tabular con n y cuantiles es la base de cualquier hallazgo de distribución.",
      },
      {
        demoId: "S18-T1-B-DEMO",
        subtopicId: "S18-T1-B",
        environment: "local-python",
        description: "Comparar media vs mediana/MAD y escala log1p en montos con outlier",
        code: {
          language: 'python',
          title: "demo_robust.py",
          code: `import numpy as np

x = np.array([15, 16, 14, 18, 17, 16, 15, 200], dtype=float)
med = float(np.median(x))
mad = float(np.median(np.abs(x - med)))
print("mean", round(float(x.mean()), 2))
print("median", med, "MAD", mad)
print("ratio_mean_median", round(float(x.mean()) / med, 2))
print("log1p_median", round(float(np.median(np.log1p(x))), 3))`,
          output: `mean 38.88
median 16.0 MAD 1.0
ratio_mean_median 2.43
log1p_median 2.833`,
        },
        why: "Cuando mean ≫ median, prioriza métricas robustas y declara la cola.",
      },
      {
        demoId: "S18-T2-A-DEMO",
        subtopicId: "S18-T2-A",
        environment: "local-python",
        description: "Diagnosticar sesgo de muestreo por región frente a cuotas poblacionales",
        code: {
          language: 'python',
          title: "demo_bias.py",
          code: `from collections import Counter
import numpy as np

pob = {"Lima": 0.50, "Arequipa": 0.30, "Cusco": 0.20}
muestra = ["Lima"] * 70 + ["Arequipa"] * 20 + ["Cusco"] * 10
c = Counter(muestra)
n = sum(c.values())
share = {k: c[k] / n for k in pob}
print({k: round(share[k], 3) for k in pob})
print("max_abs_bias_pp", round(max(abs(share[k] - pob[k]) for k in pob), 3))
print("cobertura", "LIMITADA" if max(abs(share[k] - pob[k]) for k in pob) > 0.1 else "OK")`,
          output: `{'Lima': 0.7, 'Arequipa': 0.2, 'Cusco': 0.1}
max_abs_bias_pp 0.2
cobertura LIMITADA`,
        },
        why: "El sesgo de cuota se mide en puntos porcentuales, no solo con “se ve bien”.",
      },
      {
        demoId: "S18-T2-B-DEMO",
        subtopicId: "S18-T2-B",
        environment: "local-python",
        description: "Reportar IC 95% aproximado y Cohen's d entre dos grupos sintéticos",
        code: {
          language: 'python',
          title: "demo_effect.py",
          code: `import numpy as np

rng = np.random.default_rng(21)
ctrl = rng.normal(50, 10, 35)
trat = rng.normal(55, 10, 35)
diff = trat.mean() - ctrl.mean()
se = np.sqrt(ctrl.var(ddof=1)/len(ctrl) + trat.var(ddof=1)/len(trat))
ic = (diff - 1.96*se, diff + 1.96*se)
sp = np.sqrt((ctrl.var(ddof=1) + trat.var(ddof=1)) / 2)
d = diff / sp
print("diff", round(float(diff), 2))
print("ic95", (round(float(ic[0]), 2), round(float(ic[1]), 2)))
print("cohens_d", round(float(d), 3))
print("n", len(ctrl), len(trat))`,
          output: `diff 2.15
ic95 (-2.17, 6.47)
cohens_d 0.233
n 35 35`,
        },
        why: "Magnitud + intervalo + n comunican incertidumbre mejor que un solo p-value.",
      },
      {
        demoId: "S18-T3-A-DEMO",
        subtopicId: "S18-T3-A",
        environment: "local-python",
        description: "Mostrar correlación alta generada por confusor y caída al residualizar",
        code: {
          language: 'python',
          title: "demo_corr.py",
          code: `import numpy as np

rng = np.random.default_rng(3)
z = rng.normal(size=100)
x = z + rng.normal(scale=0.2, size=100)
y = z + rng.normal(scale=0.2, size=100)
r_raw = float(np.corrcoef(x, y)[0, 1])
bx = np.polyfit(z, x, 1)
by = np.polyfit(z, y, 1)
rx = x - (bx[0]*z + bx[1])
ry = y - (by[0]*z + by[1])
r_res = float(np.corrcoef(rx, ry)[0, 1])
print("r_raw", round(r_raw, 3))
print("r_residual_z", round(r_res, 3))
print("claim", "asociacion_observada_no_causal")`,
          output: `r_raw 0.974
r_residual_z 0.166
claim asociacion_observada_no_causal`,
        },
        why: "Enseña a no inferir causalidad solo porque r es alto.",
      },
      {
        demoId: "S18-T3-B-DEMO",
        subtopicId: "S18-T3-B",
        environment: "local-python",
        description: "Segmentar por región y marcar anomalías Tukey sin claim causal",
        code: {
          language: 'python',
          title: "demo_segments.py",
          code: `import pandas as pd

df = pd.DataFrame({
    "region": ["Lima"]*8 + ["Arequipa"]*6 + ["Cusco"]*6,
    "monto": [20,22,21,19,25,24,23,22, 18,19,20,21,17,55, 16,18,19,20,17,90],
})
q1, q3 = df["monto"].quantile([0.25, 0.75])
iqr = q3 - q1
lo, hi = q1 - 1.5*iqr, q3 + 1.5*iqr
df["flag"] = (df["monto"] < lo) | (df["monto"] > hi)
print("lo_hi", round(float(lo),2), round(float(hi),2))
print(df.groupby("region")["flag"].agg(["sum","mean"]).round(3).to_dict())
print("sin_claim_causal", True)`,
          output: `lo_hi 13.5 27.5
{'sum': {'Arequipa': 1, 'Cusco': 1, 'Lima': 0}, 'mean': {'Arequipa': 0.167, 'Cusco': 0.167, 'Lima': 0.0}}
sin_claim_causal True`,
        },
        why: "Flags + tasas por segmento; la narrativa causal queda fuera del EDA.",
      },
      {
        demoId: "S18-T4-A-DEMO",
        subtopicId: "S18-T4-A",
        environment: "local-python",
        description: "Separar pregunta, hipótesis, evidencia y no-decisión en un dict trazable",
        code: {
          language: 'python',
          title: "demo_qhe.py",
          code: `evidencia = {
    "pregunta": "¿Hay diferencia de ticket mediano Lima vs Cusco?",
    "hipotesis": "mediana_Lima > mediana_Cusco en canal web junio",
    "calculo": "median por region, n>=30",
    "resultado": {"Lima": 28.0, "Cusco": 22.5, "n_Lima": 40, "n_Cusco": 32},
    "incertidumbre": "sin IC bootstrap en este corte; muestra web-only",
    "decision": None,
}
print(evidencia["pregunta"])
print("hallazgo", evidencia["resultado"])
print("decision_es_none", evidencia["decision"] is None)`,
          output: `¿Hay diferencia de ticket mediano Lima vs Cusco?
hallazgo {'Lima': 28.0, 'Cusco': 22.5, 'n_Lima': 40, 'n_Cusco': 32}
decision_es_none True`,
        },
        why: "La traza pregunta→cálculo→límite es el artefacto de calidad de CP-N2-B inicio.",
      },
      {
        demoId: "S18-T4-B-DEMO",
        subtopicId: "S18-T4-B",
        environment: "local-python",
        description: "Generar data note con n, filtros, seed y huella de filas",
        code: {
          language: 'python',
          title: "demo_datanote.py",
          code: `import hashlib, json
import pandas as pd

df = pd.DataFrame({
    "ticket_id": [f"T{i:03d}" for i in range(1, 6)],
    "monto": [10.0, 12.0, 0.0, 15.0, 11.0],
    "region": ["Lima", "Cusco", "Lima", "Arequipa", "Lima"],
})
n0 = len(df)
df2 = df[df["monto"] > 0].copy()
blob = df2.sort_values("ticket_id").to_csv(index=False).encode()
note = {
    "origen": "sintetico",
    "n_raw": n0,
    "n_final": len(df2),
    "filtros": ["monto > 0"],
    "seed": 18,
    "sha1_8": hashlib.sha1(blob).hexdigest()[:8],
}
print(json.dumps(note, ensure_ascii=False))
print("median_final", float(df2["monto"].median()))`,
          output: `{"origen": "sintetico", "n_raw": 5, "n_final": 4, "filtros": ["monto > 0"], "seed": 18, "sha1_8": "71094efb"}
median_final 11.5`,
        },
        why: "Data notes hacen auditable el notebook del portfolio.",
      },
    ],
  },
  weDo: {
    intro: "Practica 24 ejercicios (guided → independent → transfer) sobre distribuciones, incertidumbre y evidencia trazable.",
    steps: [
      {
        id: "S18-T1-A-E1",
        subtopicId: "S18-T1-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: centro (mean/median) y n de montos. Fixture `S18-T1-A-E1` / datos sintéticos: montos = np.array([10, 12, 14, 16, 100], dtype=float); print(\"n\", montos.size). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `n 5 | mean 30.4 | median 14.0`.",
        hint: "Usa len o .size; np.mean y np.median.",
        hints: [
          "Usa len o .size; np.mean y np.median.",
          "round(float(...), 2) para la media.",
        ],
        edgeCases: ["lista vacía", "todos iguales"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
montos = np.array([10, 12, 14, 16, 100], dtype=float)
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
montos = np.array([10, 12, 14, 16, 100], dtype=float)
print("n", montos.size)
print("mean", round(float(montos.mean()), 2))
print("median", float(np.median(montos)))`,
          output: `n 5
mean 30.4
median 14.0`,
        },
      },
      {
        id: "S18-T1-A-E2",
        subtopicId: "S18-T1-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: cuartiles e IQR. Fixture `S18-T1-A-E2` / datos sintéticos: montos = np.array([5, 8, 9, 10, 12, 13, 40], dtype=float); q1, q3 = np.quantile(montos, [0.25, 0.75]). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `Q1 8.5 | Q3 12.5 | IQR 4.0`.",
        hint: "np.quantile con [0.25, 0.75].",
        hints: [
          "np.quantile con [0.25, 0.75].",
          "IQR = Q3 - Q1.",
        ],
        edgeCases: ["n=1", "empates en cuantiles"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
montos = np.array([5, 8, 9, 10, 12, 13, 40], dtype=float)
q1, q3 = np.quantile(montos, [0.25, 0.75])
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
montos = np.array([5, 8, 9, 10, 12, 13, 40], dtype=float)
q1, q3 = np.quantile(montos, [0.25, 0.75])
print("Q1", round(float(q1), 2))
print("Q3", round(float(q3), 2))
print("IQR", round(float(q3 - q1), 2))`,
          output: `Q1 8.5
Q3 12.5
IQR 4.0`,
        },
      },
      {
        id: "S18-T1-A-E3",
        subtopicId: "S18-T1-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: función resumen n/mean/median/std. Fixture `S18-T1-A-E3` / datos sintéticos: def resumen(x):; x = np.asarray(x, dtype=float). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `{'n': 5, 'mean': 3.0, 'median': 3.0, 'std': 1.5811}`.",
        hint: "std con ddof=1.",
        hints: [
          "std con ddof=1.",
          "Redondea mean/median/std a 4 decimales o 2 según print claro.",
        ],
        edgeCases: ["array vacío debe fallar o manejarse"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
import numpy as np

def resumen(x):
    x = np.asarray(x, dtype=float)
    return {
        "n": int(x.size),
        "mean": round(float(x.mean()), 4),
        "median": round(float(np.median(x)), 4),
        "std": round(float(x.std(ddof=1)), 4),
    }
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(resumen([1, 2, 3, 4, 5]))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np

def resumen(x):
    x = np.asarray(x, dtype=float)
    return {
        "n": int(x.size),
        "mean": round(float(x.mean()), 4),
        "median": round(float(np.median(x)), 4),
        "std": round(float(x.std(ddof=1)), 4),
    }
print(resumen([1, 2, 3, 4, 5]))`,
          output: `{'n': 5, 'mean': 3.0, 'median': 3.0, 'std': 1.5811}`,
        },
      },
      {
        id: "S18-T1-B-E1",
        subtopicId: "S18-T1-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: mean vs median y razón. Fixture `S18-T1-B-E1` / datos sintéticos: x = np.array([10, 11, 12, 13, 100], dtype=float); m = float(x.mean()). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `mean 29.2 | median 12.0 | ratio 2.43`.",
        hint: "np.mean y np.median.",
        hints: [
          "np.mean y np.median.",
          "ratio = mean/median.",
        ],
        edgeCases: ["median 0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
x = np.array([10, 11, 12, 13, 100], dtype=float)
m = float(x.mean())
med = float(np.median(x))
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
x = np.array([10, 11, 12, 13, 100], dtype=float)
m = float(x.mean())
med = float(np.median(x))
print("mean", round(m, 2))
print("median", med)
print("ratio", round(m / med, 2))`,
          output: `mean 29.2
median 12.0
ratio 2.43`,
        },
      },
      {
        id: "S18-T1-B-E2",
        subtopicId: "S18-T1-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: MAD respecto a la mediana. Fixture `S18-T1-B-E2` / datos sintéticos: x = np.array([2, 3, 4, 5, 100], dtype=float); med = float(np.median(x)). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `MAD 1.0`.",
        hint: "MAD = median(|x - median(x)|).",
        hints: [
          "MAD = median(|x - median(x)|).",
          "Usa np.median y np.abs.",
        ],
        edgeCases: ["todos iguales → MAD 0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
x = np.array([2, 3, 4, 5, 100], dtype=float)
med = float(np.median(x))
mad = float(np.median(np.abs(x - med)))
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
x = np.array([2, 3, 4, 5, 100], dtype=float)
med = float(np.median(x))
mad = float(np.median(np.abs(x - med)))
print("MAD", mad)`,
          output: `MAD 1.0`,
        },
      },
      {
        id: "S18-T1-B-E3",
        subtopicId: "S18-T1-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: transformación log1p de montos. Fixture `S18-T1-B-E3` / datos sintéticos: x = np.array([0, 1, 9, 99], dtype=float); print([round(float(v), 3) for v in np.log1p(x)]). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `[0.0, 0.693, 2.303, 4.605]`.",
        hint: "np.log1p.",
        hints: [
          "np.log1p.",
          "tolist + round por elemento.",
        ],
        edgeCases: ["negativos no válidos en log1p de montos"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
x = np.array([0, 1, 9, 99], dtype=float)
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
x = np.array([0, 1, 9, 99], dtype=float)
print([round(float(v), 3) for v in np.log1p(x)])`,
          output: `[0.0, 0.693, 2.303, 4.605]`,
        },
      },
      {
        id: "S18-T2-A-E1",
        subtopicId: "S18-T2-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: share muestral vs población. Fixture `S18-T2-A-E1` / datos sintéticos: muestra = [\"Lima\", \"Lima\", \"Cusco\", \"Lima\"]; share_lima = muestra.count(\"Lima\") / len(muestra). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `share_Lima 0.75`.",
        hint: "Cuenta ocurrencias / n.",
        hints: [
          "Cuenta ocurrencias / n.",
          "round a 2 decimales.",
        ],
        edgeCases: ["muestra vacía"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `muestra = ["Lima", "Lima", "Cusco", "Lima"]
share_lima = muestra.count("Lima") / len(muestra)
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `muestra = ["Lima", "Lima", "Cusco", "Lima"]
share_lima = muestra.count("Lima") / len(muestra)
print("share_Lima", round(share_lima, 2))`,
          output: `share_Lima 0.75`,
        },
      },
      {
        id: "S18-T2-A-E2",
        subtopicId: "S18-T2-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: bias en puntos porcentuales. Fixture `S18-T2-A-E2` / datos sintéticos: share = 8 / 10; pob = 0.5. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `bias_Lima_pp 0.3`.",
        hint: "share = 8/10.",
        hints: [
          "share = 8/10.",
          "bias = share - 0.5.",
        ],
        edgeCases: ["regiones faltantes en muestra"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
share = 8 / 10
pob = 0.5
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("bias_Lima_pp", round(share - pob, 2))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `share = 8 / 10
pob = 0.5
print("bias_Lima_pp", round(share - pob, 2))`,
          output: `bias_Lima_pp 0.3`,
        },
      },
      {
        id: "S18-T2-A-E3",
        subtopicId: "S18-T2-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: máximo |bias| entre segmentos. Fixture `S18-T2-A-E3` / datos sintéticos: def max_bias(pob, counts):; n = sum(counts.values()). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `0.4`.",
        hint: "share = count/sum(counts).",
        hints: [
          "share = count/sum(counts).",
          "max de valores absolutos.",
        ],
        edgeCases: ["keys faltantes"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `def max_bias(pob, counts):
    n = sum(counts.values())
    return max(abs(counts[k] / n - pob[k]) for k in pob)

print(round(max_bias({"Lima": 0.5, "Cusco": 0.5}, {"Lima": 9, "Cusco": 1}), 2))
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def max_bias(pob, counts):
    n = sum(counts.values())
    return max(abs(counts[k] / n - pob[k]) for k in pob)

print(round(max_bias({"Lima": 0.5, "Cusco": 0.5}, {"Lima": 9, "Cusco": 1}), 2))`,
          output: `0.4`,
        },
      },
      {
        id: "S18-T2-B-E1",
        subtopicId: "S18-T2-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: margen de IC 95% (1.96·s/√n). Fixture `S18-T2-B-E1` / datos sintéticos: media, s, n = 10, 2, 16; margen = 1.96 * s / math.sqrt(n). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `margen 0.98`.",
        hint: "import math o numpy sqrt.",
        hints: [
          "import math o numpy sqrt.",
          "margen = 1.96 * s / sqrt(n).",
        ],
        edgeCases: ["n=0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import math
media, s, n = 10, 2, 16
margen = 1.96 * s / math.sqrt(n)
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import math
media, s, n = 10, 2, 16
margen = 1.96 * s / math.sqrt(n)
print("margen", round(margen, 3))`,
          output: `margen 0.98`,
        },
      },
      {
        id: "S18-T2-B-E2",
        subtopicId: "S18-T2-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: tamaño de efecto Cohen's d. Fixture `S18-T2-B-E2` / datos sintéticos: d = (13 - 10) / 2; print(\"d\", round(d, 2)). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `d 1.5`.",
        hint: "d = (mb-ma)/sp.",
        hints: [
          "d = (mb-ma)/sp.",
          "round 2.",
        ],
        edgeCases: ["sp=0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
d = (13 - 10) / 2
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("d", round(d, 2))
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `d = (13 - 10) / 2
print("d", round(d, 2))`,
          output: `d 1.5`,
        },
      },
      {
        id: "S18-T2-B-E3",
        subtopicId: "S18-T2-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: IC95 como tupla (low, high). Fixture `S18-T2-B-E3` / datos sintéticos: diff, se = 4, 1.5; ic = (round(diff - 1.96 * se, 2), round(diff + 1.96 * se, 2)). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `ic95 (1.06, 6.94)`.",
        hint: "low = diff - 1.96*se.",
        hints: [
          "low = diff - 1.96*se.",
          "high = diff + 1.96*se.",
        ],
        edgeCases: ["se negativo inválido"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `diff, se = 4, 1.5
ic = (round(diff - 1.96 * se, 2), round(diff + 1.96 * se, 2))
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `diff, se = 4, 1.5
ic = (round(diff - 1.96 * se, 2), round(diff + 1.96 * se, 2))
print("ic95", ic)`,
          output: `ic95 (1.06, 6.94)`,
        },
      },
      {
        id: "S18-T3-A-E1",
        subtopicId: "S18-T3-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: correlación de Pearson. Fixture `S18-T3-A-E1` / datos sintéticos: x = np.array([1, 2, 3, 4], dtype=float); y = np.array([2, 4, 6, 8], dtype=float). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `r 1.0`.",
        hint: "corrcoef[0,1].",
        hints: [
          "corrcoef[0,1].",
          "Debe ser ~1.",
        ],
        edgeCases: ["constante en x → nan"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
x = np.array([1, 2, 3, 4], dtype=float)
y = np.array([2, 4, 6, 8], dtype=float)
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
x = np.array([1, 2, 3, 4], dtype=float)
y = np.array([2, 4, 6, 8], dtype=float)
print("r", round(float(np.corrcoef(x, y)[0, 1]), 3))`,
          output: `r 1.0`,
        },
      },
      {
        id: "S18-T3-A-E2",
        subtopicId: "S18-T3-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: etiqueta asociación_observada (no causa). Fixture `S18-T3-A-E2` / datos sintéticos: r = 0.82; print(\"asociacion_observada\" if abs(r) > 0.5 else \"asociacion_debil\"). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `asociacion_observada`.",
        hint: "if abs(r)>0.5.",
        hints: [
          "if abs(r)>0.5.",
          "Mensaje fijo no causal.",
        ],
        edgeCases: ["r nan"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
r = 0.82
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("asociacion_observada" if abs(r) > 0.5 else "asociacion_debil")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `r = 0.82
print("asociacion_observada" if abs(r) > 0.5 else "asociacion_debil")`,
          output: `asociacion_observada`,
        },
      },
      {
        id: "S18-T3-A-E3",
        subtopicId: "S18-T3-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: correlación residual tras confusor. Fixture `S18-T3-A-E3` / datos sintéticos: z = np.arange(5, dtype=float); x = z.copy(). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `r_raw 1.0 | max_abs_resid 0.0`.",
        hint: "Residualiza x e y respecto a z.",
        hints: [
          "Residualiza x e y respecto a z.",
          "corrcoef de residuales ≈ 0 o nan controlado.",
        ],
        edgeCases: ["colinealidad perfecta"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
z = np.arange(5, dtype=float)
x = z.copy()
y = z.copy()
r_raw = float(np.corrcoef(x, y)[0, 1])
bx = np.polyfit(z, x, 1)
by = np.polyfit(z, y, 1)
rx = x - (bx[0] * z + bx[1])
ry = y - (by[0] * z + by[1])
# residuales ~0 → corr inestable; reporta max abs residual
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
z = np.arange(5, dtype=float)
x = z.copy()
y = z.copy()
r_raw = float(np.corrcoef(x, y)[0, 1])
bx = np.polyfit(z, x, 1)
by = np.polyfit(z, y, 1)
rx = x - (bx[0] * z + bx[1])
ry = y - (by[0] * z + by[1])
# residuales ~0 → corr inestable; reporta max abs residual
print("r_raw", round(r_raw, 3))
print("max_abs_resid", round(float(max(np.max(np.abs(rx)), np.max(np.abs(ry)))), 6))`,
          output: `r_raw 1.0
max_abs_resid 0.0`,
        },
      },
      {
        id: "S18-T3-B-E1",
        subtopicId: "S18-T3-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: conteo de outliers Tukey (hi=Q3+1.5·IQR). Fixture `S18-T3-B-E1` / datos sintéticos: m = np.array([10, 12, 11, 13, 50], dtype=float); q1, q3 = np.quantile(m, [0.25, 0.75]). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `n_hi 1`.",
        hint: "quantile 0.25/0.75.",
        hints: [
          "quantile 0.25/0.75.",
          "suma booleana.",
        ],
        edgeCases: ["sin outliers"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
m = np.array([10, 12, 11, 13, 50], dtype=float)
q1, q3 = np.quantile(m, [0.25, 0.75])
iqr = q3 - q1
hi = q3 + 1.5 * iqr
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
m = np.array([10, 12, 11, 13, 50], dtype=float)
q1, q3 = np.quantile(m, [0.25, 0.75])
iqr = q3 - q1
hi = q3 + 1.5 * iqr
print("n_hi", int((m > hi).sum()))`,
          output: `n_hi 1`,
        },
      },
      {
        id: "S18-T3-B-E2",
        subtopicId: "S18-T3-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: tasa de anomalías por región. Fixture `S18-T3-B-E2` / datos sintéticos: region = np.array([\"Lima\", \"Lima\", \"Cusco\"]); flag = np.array([True, True, False]). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `tasa_Lima 1.0`.",
        hint: "Filtra región Lima.",
        hints: [
          "Filtra región Lima.",
          "mean de flags.",
        ],
        edgeCases: ["segmento vacío"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
region = np.array(["Lima", "Lima", "Cusco"])
flag = np.array([True, True, False])
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
region = np.array(["Lima", "Lima", "Cusco"])
flag = np.array([True, True, False])
print("tasa_Lima", float(flag[region == "Lima"].mean()))`,
          output: `tasa_Lima 1.0`,
        },
      },
      {
        id: "S18-T3-B-E3",
        subtopicId: "S18-T3-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: flags booleanos Tukey. Fixture `S18-T3-B-E3` / datos sintéticos: m = np.array([1, 2, 3, 4, 100], dtype=float); q1, q3 = np.quantile(m, [0.25, 0.75]). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `[False, False, False, False, True]`.",
        hint: "lo = Q1-1.5IQR, hi=Q3+1.5IQR.",
        hints: [
          "lo = Q1-1.5IQR, hi=Q3+1.5IQR.",
          "tolist de bool.",
        ],
        edgeCases: ["IQR 0"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
m = np.array([1, 2, 3, 4, 100], dtype=float)
q1, q3 = np.quantile(m, [0.25, 0.75])
iqr = q3 - q1
lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import numpy as np
m = np.array([1, 2, 3, 4, 100], dtype=float)
q1, q3 = np.quantile(m, [0.25, 0.75])
iqr = q3 - q1
lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
print(((m < lo) | (m > hi)).tolist())`,
          output: `[False, False, False, False, True]`,
        },
      },
      {
        id: "S18-T4-A-E1",
        subtopicId: "S18-T4-A",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: dict pregunta/hipótesis/resultado. Fixture `S18-T4-A-E1` / datos sintéticos: evidencia = {; \"pregunta\": \"¿Cuál es el ticket mediano?\",. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `¿Cuál es el ticket mediano?`.",
        hint: "Dict literal.",
        hints: [
          "Dict literal.",
          "print evidencia['pregunta'].",
        ],
        edgeCases: ["claves faltantes"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `evidencia = {
    "pregunta": "¿Cuál es el ticket mediano?",
    "hipotesis": "mediana >= 5",
    "resultado": {"n": 10, "median": 5.0},
}
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `evidencia = {
    "pregunta": "¿Cuál es el ticket mediano?",
    "hipotesis": "mediana >= 5",
    "resultado": {"n": 10, "median": 5.0},
}
print(evidencia["pregunta"])`,
          output: `¿Cuál es el ticket mediano?`,
        },
      },
      {
        id: "S18-T4-A-E2",
        subtopicId: "S18-T4-A",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: hallazgo vs umbral de decisión. Fixture `S18-T4-A-E2` / datos sintéticos: median = 12; print(\"solo_hallazgo\" if median < 15 else \"candidato_decision\"). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `solo_hallazgo`.",
        hint: "Compara median < 15.",
        hints: [
          "Compara median < 15.",
          "No inventes decisión de campaña.",
        ],
        edgeCases: ["igualdad al umbral"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
median = 12
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print("solo_hallazgo" if median < 15 else "candidato_decision")
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `median = 12
print("solo_hallazgo" if median < 15 else "candidato_decision")`,
          output: `solo_hallazgo`,
        },
      },
      {
        id: "S18-T4-A-E3",
        subtopicId: "S18-T4-A",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: traza Pregunta→Métrica→Valor→Límite. Fixture `S18-T4-A-E3` / datos sintéticos: def traza(pregunta, metrica, valor, limite):; print(\"P:\", pregunta). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `P: ticket mediano Lima | M: median | V: 27.5 | L: solo web`.",
        hint: "Función con 4 prints.",
        hints: [
          "Función con 4 prints.",
          "Etiquetas fijas P/M/V/L.",
        ],
        edgeCases: ["None en valor"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `def traza(pregunta, metrica, valor, limite):
    print("P:", pregunta)
    print("M:", metrica)
    print("V:", valor)
    print("L:", limite)
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `def traza(pregunta, metrica, valor, limite):
    print("P:", pregunta)
    print("M:", metrica)
    print("V:", valor)
    print("L:", limite)

traza("ticket mediano Lima", "median", 27.5, "solo web")`,
          output: `P: ticket mediano Lima
M: median
V: 27.5
L: solo web`,
        },
      },
      {
        id: "S18-T4-B-E1",
        subtopicId: "S18-T4-B",
        kind: "guided",
        instruction:
          "E1 (guiado) — Concepto: data note n_raw/n_final/filtros. Fixture `S18-T4-B-E1` / datos sintéticos: note = {\"n_raw\": 5, \"n_final\": 4, \"filtros\": [\"monto>0\"]}; print(note). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `{'n_raw': 5, 'n_final': 4, 'filtros': ['monto>0']}`.",
        hint: "Dict con n_raw, n_final, filtros.",
        hints: [
          "Dict con n_raw, n_final, filtros.",
          "print el dict.",
        ],
        edgeCases: ["n_final > n_raw inválido"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
note = {"n_raw": 5, "n_final": 4, "filtros": ["monto>0"]}
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(note)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `note = {"n_raw": 5, "n_final": 4, "filtros": ["monto>0"]}
print(note)`,
          output: `{'n_raw': 5, 'n_final': 4, 'filtros': ['monto>0']}`,
        },
      },
      {
        id: "S18-T4-B-E2",
        subtopicId: "S18-T4-B",
        kind: "independent",
        instruction:
          "E2 (independiente) — Concepto: sha1 hex[:8] de payload CSV. Fixture `S18-T4-B-E2` / datos sintéticos: print(hashlib.sha1(b\"a,b\\\\n1,2\\\\n\").hexdigest()[:8]). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `2aa26ec9`.",
        hint: "hashlib.sha1(...).hexdigest()[:8].",
        hints: [
          "hashlib.sha1(...).hexdigest()[:8].",
          "encode no necesario si ya es bytes.",
        ],
        edgeCases: ["orden de filas cambia hash"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `# Fixture del paquete (conserva datos; no reescribas asserts)
import hashlib
# TODO: completa solo print/resultado del contrato (instruction + solution output)
# forma esperada (referencia): print(hashlib.sha1(b"a,b\\n1,2\\n").hexdigest()[:8])
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import hashlib
print(hashlib.sha1(b"a,b\\n1,2\\n").hexdigest()[:8])`,
          output: `2aa26ec9`,
        },
      },
      {
        id: "S18-T4-B-E3",
        subtopicId: "S18-T4-B",
        kind: "transfer",
        instruction:
          "E3 (transferencia) — Concepto: note tras filtro monto>0 con seed. Fixture `S18-T4-B-E3` / datos sintéticos: df = pd.DataFrame({\"monto\": [1.0, 0.0, 3.0]}); n_raw = len(df). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `{'n_raw': 3, 'n_final': 2, 'seed': 42}`.",
        hint: "len antes/después.",
        hints: [
          "len antes/después.",
          "Incluye seed.",
        ],
        edgeCases: ["todo filtrado"],
        tests: "salida coincide con solution output",
        feedback: "Compara tu salida con la solución.",
        starterCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"monto": [1.0, 0.0, 3.0]})
n_raw = len(df)
df2 = df[df["monto"] > 0]
note = {"n_raw": n_raw, "n_final": len(df2), "seed": 42}
# TODO: completa el contrato del ejercicio (ver instruction)
`,
        },
        solutionCode: {
          language: 'python',
          title: "exercise.py",
          code: `import pandas as pd
df = pd.DataFrame({"monto": [1.0, 0.0, 3.0]})
n_raw = len(df)
df2 = df[df["monto"] > 0]
note = {"n_raw": n_raw, "n_final": len(df2), "seed": 42}
print(note)`,
          output: `{'n_raw': 3, 'n_final': 2, 'seed': 42}`,
        },
      },
    ],
  },
  youDo: {
    title: "EDA honesto para CP-N2-B (inicio)",
    context:
      "Eres analista en un equipo de insights en Lima. Recibes un extracto sintético de tickets (sin PII real) y debes producir un EDA que distinga hallazgo, hipótesis y decisión, con incertidumbre explícita. Esto abre el capstone **CP-N2-B**.",
    objectives: [
      "Resumir distribuciones con centro, dispersión y cuantiles",
      "Diagnosticar sesgo muestral y declarar cobertura",
      "Reportar al menos un intervalo o tamaño de efecto",
      "Evitar claims causales en correlaciones y segmentos",
      "Entregar script/notebook con data notes y seed",
    ],
    requirements: [
      "Solo datos sintéticos o anonimizados de práctica",
      "Cada conclusión referencia un cálculo (n, métrica, código)",
      "Data note con origen, filtros, n_raw/n_final",
      "Sin secretos ni credenciales",
      "Español profesional (es-PE)",
    ],
    starterCode: `import numpy as np
import pandas as pd

# TODO: cargar sintético, resumir, sesgo, IC/efecto, data note
rng = np.random.default_rng(18)
df = pd.DataFrame({
    "region": rng.choice(["Lima", "Arequipa", "Cusco"], size=100, p=[0.7, 0.2, 0.1]),
    "monto": rng.lognormal(3.0, 0.5, 100),
})
print(df.head())
`,
    portfolioNote:
      "Artefacto de inicio CP-N2-B: EDA con incertidumbre y data notes; alimenta dashboard y reportes en S19–S21.",
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
        question: "¿Qué comunica mejor un ticket “típico” con outliers fuertes?",
        options: ["Solo la media", "Mediana (y opcionalmente IQR)", "Solo el máximo", "La moda de ids"],
        correctIndex: 1,
        explanation:
          "La mediana es robusta a colas pesadas; la media se infla con outliers.",
      },
      {
        question: "Una correlación alta entre X e Y implica:",
        options: ["Que X causa Y", "Que no hay confusores", "Que el IC es innecesario", "Asociación observada (no causal por sí sola)"],
        correctIndex: 3,
        explanation:
          "Correlación no implica causalidad; puede haber confusores.",
      },
      {
        question: "¿Qué debe incluir un data note mínimo?",
        options: ["Origen, filtros, n y límites de cobertura", "Solo el gráfico final", "La contraseña del VPN", "El prompt del LLM"],
        correctIndex: 0,
        explanation:
          "El data note hace auditable y reproducible el EDA.",
      },
      {
        question: "El sesgo de muestra ocurre cuando:",
        options: ["std es alta", "Usas mediana", "La muestra no representa la población de interés", "n > 30"],
        correctIndex: 2,
        explanation:
          "Selección no representativa sesga estimaciones aunque el cálculo sea correcto.",
      },

{
  question: "En un EDA de tickets sintéticos Lima/Cusco, ¿cuál es la comunicación correcta de un r de Pearson alto entre gasto y visitas cuando ambos crecen con el tamaño de la ciudad (confusor)?",
  options: [
    "Afirmar que más visitas causan más gasto y recomendar campaña automática",
    "Reportar asociación observada, explorar el confusor y evitar verbos causales sin diseño",
    "Eliminar la correlación del informe porque “no es causal” y no mostrar el número",
    "Usar solo la media y omitir n e intervalos para simplificar el slide ejecutivo",
  ],
  correctIndex: 1,
  explanation:
    "Correlación ≠ causalidad. El EDA reporta asociación con n/límites y posibles confusores; no borra el número ni salta a decisión automática.",
},

    ],
  },
  resources: {
    docs: [
      {
        label: "NumPy statistics",
        url: "https://numpy.org/doc/stable/reference/routines.statistics.html",
        note: "mean, quantile, corrcoef",
      },
      {
        label: "pandas essential basic functionality",
        url: "https://pandas.pydata.org/docs/user_guide/basics.html",
        note: "describe, groupby",
      },
    ],
    books: [
      {
        label: "Think Stats (Downey)",
        note: "Estadística práctica con Python",
      },
      {
        label: "Statistical Inference vía Data Science",
        note: "Marco de incertidumbre para analistas",
      },
    ],
    courses: [
      {
        label: "SciPy stats overview",
        url: "https://docs.scipy.org/doc/scipy/reference/stats.html",
        note: "Referencia de distribuciones e IC",
      },
    ],
  },
}
