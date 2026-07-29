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
 icon: "BarChart3",
 accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
 jobRelevance:
 "En analytics y data products de banca, fintech y retail en Perú, un EDA honesto (esto es, un análisis exploratorio de datos que declara supuestos e incertidumbre) separa hallazgo, hipótesis y decisión: cada número lleva n, cobertura e incertidumbre. Aquí practicas resúmenes robustos, sesgo muestral, intervalos básicos y correlación sin causalidad, con notas de datos reproducibles. Es la base para construir un dashboard accesible que no mienta con promedios sobre muestras chicas.",
 learningOutcomes: [
 { text: "Resumir distribuciones con centro, dispersión y cuantiles" },
 { text: "Elegir métricas robustas y escalas honestas" },
 { text: "Identificar sesgo de población/muestra" },
 { text: "Reportar intervalos y tamaños de efecto básicos" },
 { text: "Interpretar correlación sin confundir causalidad" },
 { text: "Segmentar y marcar anomalías con límites claros" },
 { text: "Estructurar preguntas, hipótesis y evidencia" },
 { text: "Entregar notebook/script reproducible con notas de datos" }
 ],
 theory: [
 {
 heading: "Mapa de la sección: del dataset limpio al EDA con incertidumbre",
 paragraphs: [
 "En **S17** cerraste **CP-N2-A** con joins, agregaciones y un memo de límites sobre un dataset limpio. Aquí empiezas **CP-N2-B**: centro/dispersión, métricas robustas, sesgo muestral, intervalos básicos, correlación sin causalidad y notebooks con notas de datos reproducibles. Reutiliza la lógica de limpieza y el hábito de documentar cobertura; ahora cada hallazgo también declara incertidumbre.",
 "El hilo conductor es un **dataset sintético de tickets/montos** con regiones ficticias Lima, Arequipa y Cusco, ids `T00x` y montos en PEN. Cada hallazgo del portafolio (esto es, el dossier de evidencias que entregas al negocio) debe citar un cálculo (n, métrica, IC o flag, una marca de anomalía) y declarar incertidumbre: hallazgo ≠ hipótesis ≠ decisión de negocio. Los gráficos honestos y el dashboard se profundizan en **S19**.",
 "Orden pedagógico: **T1 Distribuciones** (centro, cuantiles, robustez y escalas) → **T2 Inferencia básica** (población/muestra, IC, bootstrap conceptual y tamaño de efecto) → **T3 Relaciones** (Pearson/Spearman, confusión, segmentos y anomalías sin afirmación causal) → **T4 Comunicación** (plantilla Q→H→E y notas de datos). Solo numpy/pandas ya vistos; sin PII real.",
 ],
 callout: {
 type: "info",
 title: "Foco de S18",
 content:
 "Prioriza EDA e incertidumbre con datos sintéticos para el inicio de CP-N2-B. Nunca PII real. No conviertas correlación ni anomalías en culpa ni en decisión automática.",
 },
 },
 {
 heading: "Centro, dispersión y cuantiles",
 subtopicId: "S18-T1-A",
 paragraphs: [
 "El **centro** se resume con media (`mean`) o mediana (`median`); la **dispersión** con desviación estándar muestral (`std`, `ddof=1`) o **IQR** (Q3−Q1). En montos de tickets peruanos sintéticos la media se mueve con colas; la mediana suele ser el “ticket típico” que el negocio pregunta primero.",
 "Contrato operativo: reporta siempre **n**, al menos un cuantil de cola (p90/p95 o max) y la métrica de centro elegida con justificación. Los cuantiles (p25, p50, p75, p90) describen la forma **sin asumir normalidad** — no digas “distribución normal” solo porque calculaste media y std.",
 "Caso sintético: montos `[12.5, 18, 22, 25.5, 30, 45, 120]` PEN → media ~39, mediana 25.5, IQR ~17.5. En el memo de CP-N2-B escribes “mediana 25.5 PEN (n=7); cola p90 elevada por un outlier (un valor atípico) de 120”; no “el ticket promedio es 39 y representa al cliente típico”.",
 ],
 code: {
 language: 'python',
 title: "center_spread.py",
 code: `def s18_th_1():
    import numpy as np

    montos = np.array([12.5, 18.0, 22.0, 25.5, 30.0, 45.0, 120.0]) # sintético PEN
    print("n", montos.size)
    print("mean", round(float(montos.mean()), 2))
    print("median", float(np.median(montos)))
    print("std", round(float(montos.std(ddof=1)), 2))
    q = np.quantile(montos, [0.25, 0.5, 0.75, 0.9])
    print("q25_q50_q75_q90", [round(float(x), 2) for x in q])
    print("IQR", round(float(q[2] - q[0]), 2))

s18_th_1()`,
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
 heading: "Métricas robustas y escalas",
 subtopicId: "S18-T1-B",
 paragraphs: [
 "Métricas **robustas** (mediana, IQR, MAD = mediana de |x − mediana|) resisten outliers mejor que media/std. Úsalas cuando la pregunta sea “típico” o cuando un solo valor extremo distorsione el resumen ejecutivo.",
 "Contrato de escala: `log1p` de montos reduce asimetría visual para EDA, pero **no** compares diferencias log como soles PEN sin transformar de vuelta. Si el eje está en log, dilo en el gráfico y en la conclusión; si el KPI es en PEN, reporta en PEN.",
 "Elige métrica según la pregunta de negocio: “ticket típico web Lima” → mediana + IQR; “ingreso total esperado del día” → suma o media con cola documentada. Caso sintético: x con un 200 PEN junto a tickets ~12 → media ~43 vs. mediana ~12; el dashboard debe preferir mediana para “típico”. Sin PII real.",
 ],
 code: {
 language: 'python',
 title: "robust_scale.py",
 code: `def s18_th_2():
    import numpy as np

    x = np.array([10.0, 12.0, 11.0, 13.0, 12.5, 200.0])
    med = float(np.median(x))
    mad = float(np.median(np.abs(x - med)))
    print("median", med, "MAD", mad)
    print("mean_vs_median", round(float(x.mean()), 2), med)
    print("log1p", np.round(np.log1p(x), 3).tolist())

s18_th_2()`,
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
 heading: "Población, muestra y sesgo",
 subtopicId: "S18-T2-A",
 paragraphs: [
 "La **población** es el universo de interés (p. ej. todos los tickets del canal en el mes); la **muestra** es lo observado. El **sesgo de selección** aparece si el muestreo no es representativo — p. ej. solo Lima o solo canal web — aunque el `mean` esté bien calculado.",
 "Contrato: compara shares de la muestra vs. un **marco** conocido (cuotas por región). Documenta exclusiones (filtros de fecha, canal, `monto>0`). Calcula `bias_pp = share_muestra − share_pob` por segmento y reporta el máximo |bias| como riesgo de generalización.",
 "Sin marco poblacional, declara **cobertura limitada** y no generalices a “todos los clientes del Perú”. Caso sintético: pob Lima 0.55 / Arequipa 0.25 / Cusco 0.20 vs. muestra 80% Lima → bias Lima +0.25; cualquier KPI regional debe llevar esa nota en la nota de datos.",
 ],
 code: {
 language: 'python',
 title: "sample_bias.py",
 code: `def s18_th_3():
    # población sintética de tickets por región
    pob = {"Lima": 0.55, "Arequipa": 0.25, "Cusco": 0.20}
    # muestra sesgada: sobremuestra Lima (lista de str, no ndarray de objetos)
    muestra = ["Lima"] * 40 + ["Arequipa"] * 8 + ["Cusco"] * 2
    from collections import Counter
    c = Counter(muestra)
    n = len(muestra)
    share = {k: round(v / n, 3) for k, v in c.items()}
    print("share_muestra", share)
    print("share_pob", pob)
    bias = {k: round(share.get(k, 0) - pob[k], 3) for k in pob}
    print("bias_pp", bias)

s18_th_3()`,
 output: `share_muestra {'Lima': 0.8, 'Arequipa': 0.16, 'Cusco': 0.04}
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
 heading: "Intervalos básicos y tamaño de efecto",
 subtopicId: "S18-T2-B",
 paragraphs: [
 "Un **intervalo de confianza** aproximado para la media con n grande y colas razonables: media ± z·(s/√n) (z≈1.96 para 95%). El IC habla de un **parámetro** (p. ej. media poblacional) bajo un modelo de muestreo: **no** significa “el 95% de los datos cae en el intervalo” ni “quedó probado al 95% que la media es el punto central”.",
 "Con **n pequeño**, **colas pesadas** o montos lognormales (como tickets de T1), la aproximación z es tosca: reporta n, considera un **bootstrap simple** (remuestrear con reemplazo y tomar percentiles 2.5/97.5 de la media) y evita lenguaje de certeza. No pegues 1.96·s/√n a montos muy sesgados sin advertir el supuesto.",
 "El **tamaño de efecto** (d de Cohen ≈ (μ₁−μ₀)/s_pooled, o diferencia de medianas en PEN) comunica **magnitud**, no solo “significativo”. Contrato de lenguaje: di “compatible con” / “en la muestra” y reporta n + IC; nunca “probado” con un solo IC. Caso sintético: media B ~108 vs. A ~94, d≈1.1 — magnitud + incertidumbre, no veredicto causal de campaña. Sin PII real ni afirmaciones de fraude.",
 ],
 code: {
 language: 'python',
 title: "interval_effect.py",
 code: `def s18_th_4():
    import numpy as np

    rng = np.random.default_rng(7)
    a = rng.normal(100, 15, size=40)
    b = rng.normal(108, 15, size=40)
    ma, mb = float(a.mean()), float(b.mean())
    sa, sb = float(a.std(ddof=1)), float(b.std(ddof=1))
    # IC 95% approx (z) para media de b — OK aquí porque b es normal; con montos lognormales avisa
    se = sb / np.sqrt(len(b))
    ic = (mb - 1.96 * se, mb + 1.96 * se)
    sp = np.sqrt((sa**2 + sb**2) / 2)
    d = (mb - ma) / sp
    print("mean_a", round(ma, 2), "mean_b", round(mb, 2))
    print("ic95_b", (round(float(ic[0]), 2), round(float(ic[1]), 2)))
    print("cohens_d", round(float(d), 3))
    # bootstrap simple: remuestrear b con reemplazo y percentiles 2.5/97.5 de la media
    B = 200
    boot_means = np.empty(B)
    for i in range(B):
        sample = rng.choice(b, size=len(b), replace=True)
        boot_means[i] = sample.mean()
    lo, hi = np.quantile(boot_means, [0.025, 0.975])
    print("boot_n", B)
    print("boot_ic95", (round(float(lo), 2), round(float(hi), 2)))
    print("nota_ic", "z_approx; bootstrap si colas pesadas o n chico")

s18_th_4()`,
 output: `mean_a 94.07 mean_b 108.64
ic95_b (104.39, 112.88)
cohens_d 1.118
boot_n 200
boot_ic95 (104.47, 112.43)
nota_ic z_approx; bootstrap si colas pesadas o n chico`,
 },
 callout: {
 type: "tip",
 title: "Efecto + incertidumbre",
 content:
 "Reporta diferencia puntual, IC y n. El IC no es el rango del 95% de los datos. Con colas pesadas, documenta bootstrap o límites de la aproximación z.",
 },
 },
 {
 heading: "Correlación y confusión",
 subtopicId: "S18-T3-A",
 paragraphs: [
 "La **correlación** mide asociación, **no causa**. **Pearson** captura asociación lineal; **Spearman** usa rangos y resume asociación monótona (útil con relaciones no lineales leves o outliers). Un confusor Z puede crear asociación espuria entre X e Y; residualizar Z (regresión simple) es un chequeo de EDA, no un diseño causal completo.",
 "Contrato de verbos: en EDA etiqueta **asociación observada**. Lista causas comunes y diseños que las romperían (experimento, instrumento) antes de cualquier afirmación causal en el informe de CP-N2-B.",
 "Pearson es sensible a outliers; Spearman tolera monótonas no lineales leves. Caso sintético: X e Y generados por Z → r_xy alto, r residual bajo; el notebook imprime Pearson, residual y un Spearman monótono de control, más la nota “no causal”. Sin PII real.",
 ],
 code: {
 language: 'python',
 title: "corr_confound.py",
 code: `def s18_th_5():
    import numpy as np

    rng = np.random.default_rng(1)
    # confounder Z genera X e Y
    z = rng.normal(0, 1, 80)
    x = 0.8 * z + rng.normal(0, 0.3, 80)
    y = 0.7 * z + rng.normal(0, 0.3, 80)
    r = np.corrcoef(x, y)[0, 1]
    print("pearson_xy", round(float(r), 3))

    def resid(a, zz):
        b = np.polyfit(zz, a, 1)
        return a - (b[0] * zz + b[1])

    rx, ry = resid(x, z), resid(y, z)
    print("pearson_residual", round(float(np.corrcoef(rx, ry)[0, 1]), 3))
    # Spearman via rangos: monótona creciente → correlación de rangos = 1.0
    xs = np.array([1.0, 2.0, 3.0, 10.0])
    ys = np.array([1.0, 4.0, 9.0, 100.0])  # monótona no lineal en escala original
    rank_x = np.argsort(np.argsort(xs)).astype(float)
    rank_y = np.argsort(np.argsort(ys)).astype(float)
    print("spearman_mono", round(float(np.corrcoef(rank_x, rank_y)[0, 1]), 3))
    print("nota", "Spearman=1 monotona; Pearson puede ser <1 en la escala original")

s18_th_5()`,
 output: `pearson_xy 0.828
pearson_residual 0.075
spearman_mono 1.0
nota Spearman=1 monotona; Pearson puede ser <1 en la escala original`,
 },
 callout: {
 type: "warning",
 title: "Correlación ≠ causalidad",
 content:
 "Si no controlas confusores ni tienes diseño causal, no uses verbos causales en el informe. Residualizar es un chequeo, no identificación causal.",
 },
 },
 {
 heading: "Segmentación, anomalías y causalidad no demostrada",
 subtopicId: "S18-T3-B",
 paragraphs: [
 "Segmenta por región, canal o cohorte con **reglas explícitas** (no clusters opacos sin contrato). Las anomalías Tukey (fuera de [Q1−1.5·IQR, Q3+1.5·IQR]) son **candidatos a revisión**, nunca “fraudes demostrados” ni culpa de persona/región.",
 "Contrato: marca flags booleanos, calcula tasas por segmento, documenta umbral, n por segmento y que el método es univariado. Evita “Cusco genera outliers porque…” — eso es afirmación causal no soportada.",
 "Caso sintético: montos con un 80 PEN en Arequipa → flag de anomalía en ese id; tasa Arequipa 0.2 vs. Lima 0.0 es hallazgo descriptivo. El portafolio lista `ids_anom` y el método; la decisión de investigación es humana y posterior. Sin PII real ni autofraude.",
 ],
 code: {
 language: 'python',
 title: "segments_anom.py",
 code: `def s18_th_6():
    import numpy as np
    import pandas as pd

    df = pd.DataFrame({
     "region": ["Lima"] * 5 + ["Arequipa"] * 5,
     "monto": [20, 22, 21, 25, 19, 18, 23, 80, 21, 20],
    })
    q1, q3 = df["monto"].quantile(0.25), df["monto"].quantile(0.75)
    iqr = q3 - q1
    lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    df["anomalia"] = (df["monto"] < lo) | (df["monto"] > hi)
    print("limites", round(float(lo), 2), round(float(hi), 2))
    print(df.groupby("region")["anomalia"].mean().round(3).to_dict())
    print("ids_anom", df.index[df["anomalia"]].tolist())

s18_th_6()`,
 output: `limites 15.88 26.88
{'Arequipa': 0.2, 'Lima': 0.0}
ids_anom [7]`,
 },
 callout: {
 type: "info",
 title: "Sin afirmación causal",
 content:
 "Una tasa mayor de anomalías en un segmento es hallazgo descriptivo, no prueba de causa.",
 },
 },
 {
 heading: "Preguntas, hipótesis y evidencia",
 subtopicId: "S18-T4-A",
 paragraphs: [
 "Separa tres capas: **pregunta de negocio**, **hipótesis comprobable**, **evidencia calculada**. El hallazgo (número + n + límite) no es la decisión (lanzar campaña, bloquear cuenta, cambiar precio).",
 "Plantilla operativa: Pregunta → Métrica → Resultado (n, punto, IC) → Límite de cobertura → Siguiente paso. Cada celda del insight en CP-N2-B debe poder rastrearse a un print/assert del script.",
 "Caso sintético: “¿El ticket mediano en Lima supera 25 PEN?” → median(monto|region==Lima)=27.5, n=40, IC z o bootstrap documentado, límite “solo canal web”. Conclusión permitida: hipótesis provisional en web Lima; no “desplegar campaña nacional”. Sin PII real ni afirmaciones de fraude.",
 ],
 code: {
 language: 'python',
 title: "qhe_template.py",
 code: `def s18_th_7():
    # plantilla de traza hallazgo → cálculo (sintético)
    pregunta = "¿El ticket mediano en Lima supera 25 PEN?"
    metrica = "median(monto | region==Lima)"
    resultado = {"n": 40, "median": 27.5, "ic95_z_or_boot": (24.0, 31.0)}
    limite = "muestra de canal web, no incluye tienda física"
    print("pregunta:", pregunta)
    print("metrica:", metrica)
    print("resultado:", resultado)
    print("limite:", limite)
    print("no_es_decision:", "no lanzar campaña aún")

s18_th_7()`,
 output: `pregunta: ¿El ticket mediano en Lima supera 25 PEN?
metrica: median(monto | region==Lima)
resultado: {'n': 40, 'median': 27.5, 'ic95_z_or_boot': (24.0, 31.0)}
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
 heading: "Notebook reproducible y data notes",
 subtopicId: "S18-T4-B",
 paragraphs: [
 "Una **nota de datos** (*data note*) documenta origen, fecha de corte, filtros, n pre/post, seed y un hash o conteo de filas. Si otra persona no regenera los mismos n y métricas clave, el notebook **no cumple** el criterio de cierre de esta sección.",
 "Contrato de reproducibilidad: versiones (pandas/numpy), rutas relativas, outputs en `out/`, seed fijo, sin celdas que muten estado global en orden opaco. Checklist mínima: seed, schema, n pre/post filtros, hash de payload, límites de generalización.",
 "Caso sintético: CSV de 3 tickets → `row_sha1_8`, n=3, filtros `monto>0`, seed=42. El portafolio adjunta el JSON de la nota junto al resumen de medianas; es la base de trazabilidad hacia S19–S21. Sin PII real.",
 ],
 code: {
 language: 'python',
 title: "data_notes.py",
 code: `def s18_th_8():
    import hashlib
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
    print("mean", float(df["monto"].mean()))

s18_th_8()`,
 output: `{"origen": "sintetico_local", "corte": "2024-06-30", "n": 3, "filtros": ["monto > 0"], "seed": 42, "row_sha1_8": "6b78e80d"}
mean 15.0`,
 },
 callout: {
 type: "success",
 title: "Reproducibilidad mínima",
 content:
 "Si otra persona no puede regenerar los mismos n y métricas clave, el notebook no cumple el criterio de cierre de esta sección.",
 },
 }
 ],
 iDo: {
 intro: "Partimos del dataset limpio y el memo de límites de **S17 (CP-N2-A)**. Te demuestro el inicio del EDA de **CP-N2-B**: resúmenes, sesgo, IC z + bootstrap, correlación sin causalidad, flags Tukey y notas de datos. Uso tickets sintéticos (Lima, Arequipa, Cusco; montos en PEN). En S19 ese paquete alimenta el dashboard accesible.",
 steps: [
 {
 demoId: "S18-T1-A-DEMO",
 subtopicId: "S18-T1-A",
 environment: "local-python",
 description: "Resumir distribución de montos sintéticos con centro, dispersión y cuantiles",
 preamble:
  "Antes de escribir un slide de “ticket promedio” para CP-N2-B, el analista debe *ver* la forma de la distribución. En esta demo generamos montos sintéticos (lognormal + dos outliers de 400 y 450 PEN) y un dict con n, mean, median, std muestral, cuantiles e IQR. No escribas aún: predice si mean y median coincidirán; luego compara con la salida. Si confundes “típico” con media, el memo de negocio miente sobre el cliente mediano.",
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
 why:
  "n siempre viaja con el resumen: sin tamaño el número no es auditable. La mean se infla con cola y outliers (aquí 400 y 450 PEN); median/Q50 es el ticket típico que el negocio suele preguntar primero. IQR y p90 documentan dispersión y cola sin asumir normalidad. En We Do corregirás resúmenes incompletos y empaquetarás el dict reutilizable del portafolio.",
 retrospective:
  "Si puedes explicar por qué mean 30.5 y median ~20 no se contradicen (cola + outliers), ya tienes el hábito de centro dual. El error clásico es reportar solo la media. En We Do practicarás n/mean/median, IQR y un dict reutilizable de portafolio.",
 },
 {
 demoId: "S18-T1-B-DEMO",
 subtopicId: "S18-T1-B",
 environment: "local-python",
 description: "Comparar media vs. mediana/MAD y escala log1p en montos con outlier",
 preamble:
  "Cuando un ticket de 200 PEN se cuela entre montos ~15, la media deja de ser “típico”. Esta demo compara mean, median, MAD y el ratio mean/median, y muestra la mediana en escala `log1p`. No escribas: observa cómo el ratio > 2 avisa cola y por qué log1p no borra la necesidad de declarar la escala. Datos sintéticos, sin PII.",
 code: {
 language: 'python',
 title: "demo_robust.py",
 code: `def s18_ido_2():
    import numpy as np

    x = np.array([15, 16, 14, 18, 17, 16, 15, 200], dtype=float)
    med = float(np.median(x))
    mad = float(np.median(np.abs(x - med)))
    print("mean", round(float(x.mean()), 2))
    print("median", med, "MAD", mad)
    print("ratio_mean_median", round(float(x.mean()) / med, 2))
    print("log1p_median", round(float(np.median(np.log1p(x))), 3))

s18_ido_2()`,
 output: `mean 38.88
median 16.0 MAD 1.0
ratio_mean_median 2.43
log1p_median 2.833`,
 },
 why:
  "MAD ancla la dispersión en la mediana y resiste el outlier de 200. El ratio mean/median es un semáforo de cola: valores ≫ 1 avisan que “típico” no es la media. La función `log1p` reduce asimetría visual para EDA, pero no se reporta como diferencia en soles PEN sin antitransformar. Elige métrica según la pregunta de negocio, no por costumbre.",
 retrospective:
  "Si mean ≫ median, prioriza robustez y declara la cola en el memo; no vendas la media como ticket típico. El error clásico es “el cliente promedio gasta ~39 PEN” cuando el mediano está en 16. We Do: ratio, MAD y log1p honestas con ceros.",
 },
 {
 demoId: "S18-T2-A-DEMO",
 subtopicId: "S18-T2-A",
 environment: "local-python",
 description: "Diagnosticar sesgo de muestreo por región frente a cuotas poblacionales",
 preamble:
  "Un `mean` impecable sobre una muestra sesgada sigue siendo una estimación sesgada de la población. Esta demo compara shares de muestra vs. cuotas sintéticas (Lima/Arequipa/Cusco), calcula el peor |bias_pp| y marca cobertura LIMITADA si supera 0.1. Observa los números: no escribas aún; predice si generalizarías el KPI regional al “todo Perú”.",
 code: {
 language: 'python',
 title: "demo_bias.py",
 code: `def s18_ido_3():
    from collections import Counter
    import numpy as np

    pob = {"Lima": 0.50, "Arequipa": 0.30, "Cusco": 0.20}
    muestra = ["Lima"] * 70 + ["Arequipa"] * 20 + ["Cusco"] * 10
    c = Counter(muestra)
    n = sum(c.values())
    share = {k: c[k] / n for k in pob}
    print({k: round(share[k], 3) for k in pob})
    print("max_abs_bias_pp", round(max(abs(share[k] - pob[k]) for k in pob), 3))
    print("cobertura", "LIMITADA" if max(abs(share[k] - pob[k]) for k in pob) > 0.1 else "OK")

s18_ido_3()`,
 output: `{'Lima': 0.7, 'Arequipa': 0.2, 'Cusco': 0.1}
max_abs_bias_pp 0.2
cobertura LIMITADA`,
 },
 why:
  "El bias se mide en puntos porcentuales (share_muestra − share_pob), no con “se ve bien”. El umbral 0.1 es contrato de la nota de datos de CP-N2-B: por encima, cobertura LIMITADA. Sin marco poblacional se declara cobertura limitada; no se inventa representatividad para generalizar a todo el Perú.",
 retrospective:
  "Sesgo de selección ≠ error aritmético: un mean impecable sobre muestra sesgada sigue siendo local a la muestra. Si max |bias| > umbral, el KPI no es “todo el Perú”. We Do: share, signo del bias_pp y `max_bias` de portafolio.",
 },
 {
 demoId: "S18-T2-B-DEMO",
 subtopicId: "S18-T2-B",
 environment: "local-python",
 description: "Reportar IC 95% z, bootstrap de la diferencia y d de Cohen entre dos grupos sintéticos",
 preamble:
  "Magnitud sin incertidumbre es marketing. Aquí dos grupos sintéticos (ctrl/trat) reportan diferencia de medias, IC 95% z, d de Cohen, bootstrap de la diferencia y n. Observa si el IC cruza 0 y la nota `no_probado`: el EDA dice “compatible con”, no “queda demostrado”. Predice el signo de d y si el bootstrap se parece al IC z.",
 code: {
 language: 'python',
 title: "demo_effect.py",
 code: `def s18_ido_4():
    import numpy as np

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
    print("n", len(ctrl), len(trat))
    # bootstrap de la diferencia: remuestrear ambos grupos con reemplazo
    B = 200
    boot_diff = np.empty(B)
    for i in range(B):
        c = rng.choice(ctrl, size=len(ctrl), replace=True)
        t = rng.choice(trat, size=len(trat), replace=True)
        boot_diff[i] = t.mean() - c.mean()
    lo, hi = np.quantile(boot_diff, [0.025, 0.975])
    print("boot_diff_ic95", (round(float(lo), 2), round(float(hi), 2)))
    print("nota", "z_approx_y_bootstrap; no_probado")

s18_ido_4()`,
 output: `diff 2.15
ic95 (-2.17, 6.47)
cohens_d 0.233
n 35 35
boot_diff_ic95 (-2.11, 6.7)
nota z_approx_y_bootstrap; no_probado`,
 },
 why:
  "El IC habla del parámetro bajo un modelo de muestreo, no del rango donde cae el 95% de los tickets. Bootstrap ayuda con n chico o colas; d de Cohen comunica tamaño de efecto. Ninguno es causalidad ni “probado al 95%”. Siempre reporta magnitud + intervalo + n y lenguaje “compatible con”.",
 retrospective:
  "Si el IC de la diferencia incluye 0, no vendas certeza de efecto. Siempre n + magnitud + intervalo. We Do: margen SE, d con orden B−A, bootstrap de la media.",
 },
 {
 demoId: "S18-T3-A-DEMO",
 subtopicId: "S18-T3-A",
 environment: "local-python",
 description: "Correlación alta por confusor, caída al residualizar, y Spearman monótono de control",
 preamble:
  "Un r de 0.97 puede ser un confusor Z que mueve X e Y a la vez. Esta demo muestra Pearson crudo, Pearson de residuales tras regresar X e Y sobre Z, Spearman en una relación monótona no lineal, y la etiqueta ética `asociacion_observada_no_causal`. Observa la caída de r: no escribas; pregunta en voz alta si recomendarías una campaña automática solo con r_raw.",
 code: {
 language: 'python',
 title: "demo_corr.py",
 code: `def s18_ido_5():
    import numpy as np

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
    # control monótono: Spearman = Pearson sobre rangos
    xs = np.array([1.0, 2.0, 3.0, 10.0])
    ys = np.array([1.0, 4.0, 9.0, 100.0])
    rsx = np.argsort(np.argsort(xs)).astype(float)
    rsy = np.argsort(np.argsort(ys)).astype(float)
    print("spearman_mono", round(float(np.corrcoef(rsx, rsy)[0, 1]), 3))
    print("claim", "asociacion_observada_no_causal")

s18_ido_5()`,
 output: `r_raw 0.974
r_residual_z 0.166
spearman_mono 1.0
claim asociacion_observada_no_causal`,
 },
 why:
  "Residualizar es un control exploratorio, no una prueba causal: r cae cuando Z era el confusor. Spearman captura asociaciones monótonas no lineales vía rangos. El claim (la afirmación ética) `asociacion_observada_no_causal` protege el portafolio de lenguaje de fraude o causa automática. En CP-N2-B ese claim es tan importante como el número.",
 retrospective:
  "r alto es hallazgo de asociación, no veredicto. Si al controlar Z cae, el confusor era el relato. We Do: Pearson correcto, Spearman por rangos, residuales de confusor.",
 },
 {
 demoId: "S18-T3-B-DEMO",
 subtopicId: "S18-T3-B",
 environment: "local-python",
 description: "Segmentar por región y marcar anomalías Tukey sin afirmación causal",
 preamble:
  "Marcar montos fuera de cercas Tukey es un hallazgo univariado, no un veredicto de fraude ni culpa de región. Esta demo calcula lo/hi, flags y sum/mean de flags por Lima/Arequipa/Cusco en datos sintéticos. Observa tasas 0.167 en Arequipa y Cusco: describe, no acusa. Predice si Lima tiene flags antes de mirar la salida.",
 code: {
 language: 'python',
 title: "demo_segments.py",
 code: `def s18_ido_6():
    import pandas as pd

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
    print("sin_claim_causal", True)

s18_ido_6()`,
 output: `lo_hi 13.5 27.5
{'sum': {'Arequipa': 1, 'Cusco': 1, 'Lima': 0}, 'mean': {'Arequipa': 0.167, 'Cusco': 0.167, 'Lima': 0.0}}
sin_claim_causal True`,
 },
 why:
  "1.5·IQR es el contrato clásico de cercas Tukey. Las tasas por segmento son descriptivas: un flag alto en Cusco no implica culpa regional. La decisión de investigar es humana; el booleano `sin_claim_causal` cierra el artefacto ético del EDA.",
 retrospective:
  "Anomalía univariada ≠ causa ni fraude automático. Siempre método + n + límites de segmento. El error clásico es “Cusco tiene más flags → culpable”. We Do: cerca 1.5, tasa solo en Lima, máscara bilateral.",
 },
 {
 demoId: "S18-T4-A-DEMO",
 subtopicId: "S18-T4-A",
 environment: "local-python",
 description: "Separar pregunta, hipótesis, evidencia y no-decisión en un dict trazable",
 preamble:
  "El artefacto de calidad de CP-N2-B separa pregunta, hipótesis, cálculo, resultado e incertidumbre; la decisión de negocio puede quedar en `None` hasta que un humano la tome. Sigue el dict sintético Lima vs. Cusco: imprime pregunta, hallazgo y verifica que decisión es None. No escribas: el hábito es no saltar de mediana a campaña.",
 code: {
 language: 'python',
 title: "demo_qhe.py",
 code: `def s18_ido_7():
    evidencia = {
     "pregunta": "¿Hay diferencia de ticket mediano Lima vs. Cusco?",
     "hipotesis": "mediana_Lima > mediana_Cusco en canal web junio",
     "calculo": "median por region, n>=30",
     "resultado": {"Lima": 28.0, "Cusco": 22.5, "n_Lima": 40, "n_Cusco": 32},
     "incertidumbre": "IC z aproximado; bootstrap si colas pesadas; muestra web-only",
     "decision": None,
    }
    print(evidencia["pregunta"])
    print("hallazgo", evidencia["resultado"])
    print("decision_es_none", evidencia["decision"] is None)

s18_ido_7()`,
 output: `¿Hay diferencia de ticket mediano Lima vs. Cusco?
hallazgo {'Lima': 28.0, 'Cusco': 22.5, 'n_Lima': 40, 'n_Cusco': 32}
decision_es_none True`,
 },
 why:
  "La traza pregunta→cálculo→límite es el artefacto de calidad del inicio de CP-N2-B: hace auditable cada hallazgo. Incertidumbre y cobertura viven en el mismo objeto. `decision: None` es una feature, no un bug: el EDA no lanza campañas ni cierra el caso.",
 retrospective:
  "Si puedes defender por qué `decision` es None con un hallazgo numérico claro, ya separas capas de calidad. El error clásico es rellenar decisión con una campaña “porque la mediana es mayor”. We Do: clave pregunta, umbral hallazgo vs. candidato, traza P→M→V→L.",
 },
 {
 demoId: "S18-T4-B-DEMO",
 subtopicId: "S18-T4-B",
 environment: "local-python",
 description: "Generar nota de datos con n, filtros, seed y huella de filas",
 preamble:
  "El notebook del portafolio no es creíble sin nota de datos: origen, n_raw/n_final, filtros, seed y huella corta del CSV ordenado. Esta demo filtra montos > 0 en tickets sintéticos T001…, arma el dict y calcula mediana final. Observa cómo n cae de 5 a 4 y por qué el sha1 se toma del blob filtrado ordenado. Sin PII real.",
 code: {
 language: 'python',
 title: "demo_datanote.py",
 code: `def s18_ido_8():
    import hashlib, json
    import pandas as pd

    df = pd.DataFrame({
     "ticket_id": [f"T{i:03d}" for i in range(1, 6)],
     "monto": [10.0, 12.0, 0.0, 15.0, 11.0],
     "region": ["Lima", "Arequipa", "Cusco", "Lima", "Arequipa"],
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
    print("median_final", float(df2["monto"].median()))

s18_ido_8()`,
 output: `{"origen": "sintetico", "n_raw": 5, "n_final": 4, "filtros": ["monto > 0"], "seed": 18, "sha1_8": "07e9d521"}
median_final 11.5`,
 },
 why:
  "Ordenar por ticket_id estabiliza el hash: el mismo corte produce la misma huella. Seed fija el generador; filtros listados hacen auditable cada exclusión. Esa nota es la base del dashboard accesible en S19.",
 retrospective:
  "Si cambias el filtro y no actualizas n_final ni el hash, la nota miente. We Do: dict mínimo, sha1[:8], nota post-filtro con seed.",
 }
 ],
 },
 weDo: {
 intro: "Practica 24 ejercicios en liberación gradual (guiado → independiente → transferencia). Los temas son centro y robustez, sesgo muestral, IC y bootstrap, Pearson/Spearman sin causalidad, Tukey sin fraude, y la plantilla Q→H→E con notas de datos. Cada bug del código inicial es un hábito del portafolio CP-N2-B; no copies la solución antes de ejecutar.",
 steps: [
 {
 id: "S18-T1-A-E1",
 subtopicId: "S18-T1-A",
 kind: "guided",
 title: "Reportar n, mean y median juntos",
 preamble:
  "- **Contexto:** en el resumen de un lote de tickets sintéticos de CP-N2-B, un solo `mean` sin n ni median es un hallazgo incompleto.\n- **Meta:** completar el contrato mínimo de centro: n, mean y median.\n- **Éxito:** tres líneas `n 5`, `mean 30.4`, `median 14.0` con el array del starter.\n- **Límites:** no inventes datos; no omitas etiquetas; no borres el array sintético.",
 instruction:
 "1. Abre el starter: solo imprime `mean` (bug nombrado).\n2. Añade `print` de `n` con `montos.size` (o `len`).\n3. Añade `median` con `np.median`.\n4. Redondea mean a 2 decimales; imprime solo las tres etiquetas pedidas.",
 hint: "Usa .size (o len); mean y median del array.",
 hints: [
 "Usa .size (o len); mean y median del array.",
 "round(float(...), 2) para la media.",
 ],
 edgeCases: ["lista vacía", "todos iguales"],
 tests: "salida coincide con solution output",
 feedback:
  "n documenta tamaño; mean se mueve con el 100; median 14 es el ticket típico. Un EDA sin n no es auditable: nadie sabe sobre cuántas filas se basó el número.",
 retrospective:
  "El trio n + mean + median es el mínimo de un hallazgo de distribución. El error clásico es “solo la media del día”. Siguiente (E2): cuantiles Q1/Q3 e IQR para dispersión.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · mean vs median
# Bug a corregir: solo mean; omite median y n
import numpy as np
montos = np.array([10, 12, 14, 16, 100], dtype=float)
print("mean", round(float(montos.mean()), 2))`,
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
 title: "Q1, Q3 e IQR correctos",
 preamble:
  "- **Contexto:** el negocio pregunta “cuánto se dispersa el ticket típico”; p10/p90 miden colas, no el IQR de cuartiles.\n- **Meta:** calcular Q1 (p25), Q3 (p75) e IQR = Q3−Q1.\n- **Éxito:** `Q1 8.5`, `Q3 12.5`, `IQR 4.0` con el array del starter.\n- **Límites:** no uses 0.10/0.90 como si fueran cuartiles; redondea a 2 decimales.",
 instruction:
 "1. Revisa el starter: `np.quantile(..., [0.10, 0.90])` (bug).\n2. Cambia a `[0.25, 0.75]`.\n3. Imprime Q1, Q3 e IQR con las etiquetas exactas.\n4. No alteres el array de montos.",
 hint: "Cuartiles clásicos: 0.25 y 0.75.",
 hints: [
 "Cuartiles clásicos: 0.25 y 0.75.",
 "IQR = Q3 − Q1.",
 ],
 edgeCases: ["n=1", "empates en cuantiles"],
 tests: "salida coincide con solution output",
 feedback:
  "Q1/Q3 son p25/p75; IQR = Q3 − Q1. Usar p10/p90 como “cuartiles” distorsiona el memo de dispersión del cuerpo central.",
 retrospective:
  "IQR es el contrato de dispersión del *cuerpo* sin asumir normalidad; p10/p90 se reportan aparte como cola. El error clásico es etiquetar colas como “Q1/Q3” en el slide. Pregunta: si el negocio pide “rango típico del ticket”, ¿das IQR o p10–p90? Luego (E3) empaquetas n/mean/median/std en un dict reutilizable.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · IQR
# Bug a corregir: usa percentiles 10/90 no Q1/Q3
import numpy as np
montos = np.array([5, 8, 9, 10, 12, 13, 40], dtype=float)
q1, q3 = np.quantile(montos, [0.10, 0.90])
print("Q1", round(float(q1), 2))
print("Q3", round(float(q3), 2))
print("IQR", round(float(q3 - q1), 2))`,
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
 title: "Dict resumen reutilizable del portafolio",
 preamble:
  "- **Contexto:** en CP-N2-B copiar prints sueltos no escala; el notebook necesita una función de resumen.\n- **Meta:** implementar `resumen(x)` → dict con n, mean, median, std muestral.\n- **Éxito:** sobre `[1,2,3,4,5]` imprime `{'n': 5, 'mean': 3.0, 'median': 3.0, 'std': 1.5811}`.\n- **Límites:** `ddof=1` (muestra); redondeo a 4 decimales; no devuelvas `{}` vacío.",
 instruction:
 "1. Completa el cuerpo de `resumen` (starter devuelve `{}`).\n2. Convierte a array float; calcula n, mean, median, std(ddof=1).\n3. Redondea numéricos a 4 decimales; n como int.\n4. Deja el `print(resumen([...]))` de prueba.",
 hint: "std muestral: ddof=1; no olvides median.",
 hints: [
 "std muestral: ddof=1; no olvides median.",
 "Claves del dict: n, mean, median, std.",
 ],
 edgeCases: ["array vacío debe fallar o manejarse"],
 tests: "salida coincide con solution output",
 feedback:
  "¿Incluiste median y usaste ddof=1? La std poblacional (ddof=0) no es el contrato de muestra. Un dict vacío no alimenta tablas del portafolio.",
 retrospective:
  "Un dict con contrato fijo es el artefacto que alimenta tablas y notas de datos. El error clásico es std poblacional (ddof=0) en muestra. Pregunta de cierre: ¿por qué reportas n dentro del dict y no solo en el markdown?",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · resumen dict portfolio (transferencia)
import numpy as np

def resumen(x):
 x = np.asarray(x, dtype=float)
 # Completa: n, mean, median, std(ddof=1) redondeados a 4 dec.
 return {}
print(resumen([1, 2, 3, 4, 5]))`,
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
 title: "Ratio mean/median como semáforo",
 preamble:
  "- **Contexto:** el analista de CP-N2-B necesita un número simple que avise “hay cola” sin graficar aún.\n- **Meta:** imprimir mean, median y ratio = mean/median.\n- **Éxito:** `mean 29.2`, `median 12.0`, `ratio 2.43`.\n- **Límites:** no inviertas la razón; redondea mean y ratio a 2 decimales.",
 instruction:
 "1. El starter usa `med / m` (bug).\n2. Cambia a `m / med`.\n3. Mantén etiquetas `mean`, `median`, `ratio`.\n4. No alteres el array con el 100.",
 hint: "ratio = mean / median (no al revés).",
 hints: [
 "ratio = mean / median (no al revés).",
 "Redondea mean y ratio a 2 decimales.",
 ],
 edgeCases: ["median 0"],
 tests: "salida coincide con solution output",
 feedback:
  "La razón correcta es mean/median. Si la invertiste, el outlier “achica” el aviso en vez de ampliarlo. Ratio ≫ 1 grita cola pesada en el memo.",
 retrospective:
  "El semáforo mean/median es un hábito de *lectura* de forma, no un KPI de campaña. Si lo inviertes, el outlier de 100 “tranquiliza” el slide. Pregunta de cierre: con ratio 2.43, ¿reportas mean o median como “típico”? Siguiente: MAD sin anclar en mean.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · mean/median ratio
# Bug a corregir: ratio median/mean invertido
import numpy as np
x = np.array([10, 11, 12, 13, 100], dtype=float)
m = float(x.mean())
med = float(np.median(x))
print("mean", round(m, 2))
print("median", med)
print("ratio", round(med / m, 2))`,
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
 title: "MAD con mediana, no con media",
 preamble:
  "- **Contexto:** con un outlier de 100, la dispersión “típica” no debe anclarse en la media.\n- **Meta:** calcular MAD = mediana de |x − mediana|.\n- **Éxito:** una línea `MAD 1.0`.\n- **Límites:** no uses mean ni mean de desviaciones absolutas; no mutes el array.",
 instruction:
 "1. Revisa el starter: ancla y promedio con mean.\n2. Cambia ancla a mediana; dispersión a mediana de absolutos.\n3. Imprime solo `MAD` y el valor.\n4. No renombres la etiqueta.",
 hint: "Ancla = mediana; dispersión = mediana de |x − ancla|.",
 hints: [
 "Ancla = mediana; dispersión = mediana de |x − ancla|.",
 "No uses mean para el MAD de este contrato.",
 ],
 edgeCases: ["todos iguales → MAD 0"],
 tests: "salida coincide con solution output",
 feedback:
  "MAD usa mediana dos veces: de x y de |x − mediana|. Mean abs dev es otro estadístico: con el 100 se infla y deja de ser “típico”.",
 retrospective:
  "MAD es un contrato de robustez: cambia el ancla *y* el agregador. El error clásico es “casi igual que mean abs, da igual”. Con el 100, no da igual. Luego (E3): log1p con ceros sin mentir en soles PEN.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · MAD
# Bug a corregir: MAD con mean no median
import numpy as np
x = np.array([2, 3, 4, 5, 100], dtype=float)
m = float(x.mean())
mad = float(np.mean(np.abs(x - m)))
print("MAD", mad)`,
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
 title: "log1p honesto con montos y ceros",
 preamble:
  "- **Contexto:** en EDA de montos ≥0 a veces hay ceros; `log(0)` rompe el pipeline.\n- **Meta:** transformar con `log1p` e imprimir lista a 3 decimales.\n- **Éxito:** `[0.0, 0.693, 2.303, 4.605]`.\n- **Límites:** no uses `log` crudo; no compares diferencias log como soles PEN en el memo.",
 instruction:
 "1. Completa el starter que imprime `[]`.\n2. Aplica `np.log1p(x)`.\n3. Redondea cada valor a 3 decimales en lista.\n4. No inventes otros transformadores.",
 hint: "Para montos ≥0 con ceros, usa log1p (log(1+x)), no log crudo.",
 hints: [
 "Para montos ≥0 con ceros, usa log1p (log(1+x)), no log crudo.",
 "Lista con round por elemento a 3 decimales.",
 ],
 edgeCases: ["negativos no válidos en log1p de montos"],
 tests: "salida coincide con solution output",
 feedback:
  "log(0) es −inf. Para montos ≥0 usa log1p y declara la escala en eje y conclusión; no compares diferencias log como soles PEN.",
 retrospective:
  "log1p es seguro con ceros; la honestidad está en declarar la escala en eje y conclusión. Pregunta: si el KPI es en PEN, ¿reportas en log o antitransformas? Puente a T2: incertidumbre sobre el estimador, no solo la escala.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · escala log honesta (transferencia)
# Montos sintéticos con cero: elige la transformación correcta y lista a 3 dec.
import numpy as np
x = np.array([0, 1, 9, 99], dtype=float)
# Completa: transforma x e imprime lista redondeada a 3 decimales
print([])`,
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
 title: "Proporción de Lima en la muestra",
 preamble:
  "- **Contexto:** antes de comparar con cuotas poblacionales, necesitas el share observado de cada región.\n- **Meta:** calcular e imprimir `share_Lima` (2 decimales).\n- **Éxito:** `share_Lima 0.75` con la lista del starter.\n- **Límites:** cuenta solo `\"Lima\"`; no inventes otra muestra.",
 instruction:
 "1. El starter hace `count(\"Arequipa\")` (bug).\n2. Cambia a `count(\"Lima\")` y divide por `len(muestra)`.\n3. Imprime con etiqueta `share_Lima` y round 2.\n4. No uses Counter si no hace falta.",
 hint: "share = conteo de la región / n de la muestra.",
 hints: [
 "share = conteo de la región / n de la muestra.",
 "Redondea a 2 decimales.",
 ],
 edgeCases: ["muestra vacía"],
 tests: "salida coincide con solution output",
 feedback:
  "¿Contaste Arequipa u otra región? share_Lima = count(\"Lima\") / n. Contar la región equivocada es un bug de negocio silencioso en la nota de cobertura.",
 retrospective:
  "Share = conteo/n es el ladrillo de la nota de cobertura. Un share “correcto” de la región equivocada pasa el test de aritmética y falla el de negocio. Pregunta: ¿por qué no basta con `Counter` bonito si la clave está mal? Siguiente: el *signo* del bias_pp.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · sample share
# Bug a corregir: cuenta Arequipa en lugar de Lima
muestra = ["Lima", "Lima", "Lima", "Arequipa"]
share_lima = muestra.count("Arequipa") / len(muestra)
print("share_Lima", round(share_lima, 2))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `muestra = ["Lima", "Lima", "Lima", "Arequipa"]
share_lima = muestra.count("Lima") / len(muestra)
print("share_Lima", round(share_lima, 2))`,
 output: `share_Lima 0.75`,
 },
 },
 {
 id: "S18-T2-A-E2",
 subtopicId: "S18-T2-A",
 kind: "independent",
 title: "bias_pp = share − población",
 preamble:
  "- **Contexto:** en la nota de datos, bias positivo en Lima significa sobremuestreo de Lima, no “menos Lima”.\n- **Meta:** calcular `bias_Lima_pp` con el orden share − pob.\n- **Éxito:** `bias_Lima_pp 0.3` (share 0.8, pob 0.5).\n- **Límites:** no inviertas la resta; redondea a 2 decimales.",
 instruction:
 "1. Starter imprime `pob - share`.\n2. Corrige a `share - pob`.\n3. Mantén la etiqueta `bias_Lima_pp`.\n4. No cambies los valores 8/10 y 0.5.",
 hint: "bias_pp = share − pob (no al revés).",
 hints: [
 "bias_pp = share − pob (no al revés).",
 "Redondea a 2 decimales.",
 ],
 edgeCases: ["regiones faltantes en muestra"],
 tests: "salida coincide con solution output",
 feedback:
  "Si share > pob, el bias de sobremuestreo debe ser positivo. Invertir la resta miente en el memo de cobertura: el signo comunica dirección del sesgo.",
 retrospective:
  "bias positivo = sobremuestreo de esa región en la muestra. Si inviertes la resta, el memo dice “falta Lima” cuando sobra Lima. El hábito es share − pob, siempre. Luego (E3): el *peor* |bias| decide LIMITADA/OK, no el promedio.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · bias pp
# Bug a corregir: pob - share invertido
share = 8 / 10
pob = 0.5
print("bias_Lima_pp", round(pob - share, 2))`,
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
 title: "Peor |bias_pp| de cobertura",
 preamble:
  "- **Contexto:** la nota de CP-N2-B marca cobertura LIMITADA/OK con el máximo |bias|, no con el promedio ni el mínimo.\n- **Meta:** implementar `max_bias(pob, counts)`.\n- **Éxito:** imprime `0.4` con el fixture (9 Lima / 1 Arequipa vs. 50-50).\n- **Límites:** itera claves de `pob`; usa `counts.get(k, 0)`; no devuelvas el mínimo.",
 instruction:
 "1. Completa el cuerpo (hoy `NotImplementedError`).\n2. n = suma de counts.\n3. Por región: |count/n − share_pob|; devuelve el max.\n4. Deja el `print(round(..., 2))` de prueba.",
 hint: "Por cada región en pob: |counts[k]/n − pob[k]|; devuelve el máximo de esos absolutos.",
 hints: [
 "Por cada región en pob: |counts[k]/n − pob[k]|; devuelve el máximo de esos absolutos.",
 "n = suma de counts; no uses el mínimo (el riesgo es el peor sesgo).",
 ],
 edgeCases: ["keys faltantes"],
 tests: "salida coincide con solution output",
 feedback:
  "Cobertura LIMITADA se decide con el máximo |bias|, no con el mínimo ni el promedio. El riesgo de generalización es el *peor* sesgo de cuota.",
 retrospective:
  "El riesgo de generalización es el *peor* sesgo de cuota. Pregunta: con max |bias| = 0.4, ¿afirmas el KPI para “todo el Perú”? Puente a T2-B: incertidumbre del estimador *además* del sesgo de muestra.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · max_bias de cobertura (transferencia)
def max_bias(pob, counts):
 n = sum(counts.values())
 # Completa: peor |count/n − pob| entre claves de pob
 raise NotImplementedError

print(round(max_bias({"Lima": 0.5, "Arequipa": 0.5}, {"Lima": 9, "Arequipa": 1}), 2))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `def max_bias(pob, counts):
 n = sum(counts.values())
 return max(abs(counts.get(k, 0) / n - pob[k]) for k in pob)

print(round(max_bias({"Lima": 0.5, "Arequipa": 0.5}, {"Lima": 9, "Arequipa": 1}), 2))`,
 output: `0.4`,
 },
 },
 {
 id: "S18-T2-B-E1",
 subtopicId: "S18-T2-B",
 kind: "guided",
 title: "Margen del IC 95% con √n",
 preamble:
  "- **Contexto:** el margen del IC z no es 1.96·s; es 1.96·(s/√n).\n- **Meta:** calcular e imprimir `margen` a 3 decimales.\n- **Éxito:** `margen 0.98` con media=10, s=2, n=16.\n- **Límites:** z≈1.96; no inventes t-student aquí; no omitas √n.",
 instruction:
 "1. Starter: `1.96 * s` sin dividir.\n2. Divide por `math.sqrt(n)`.\n3. Imprime `margen` redondeado a 3.\n4. Deja media/s/n fijos.",
 hint: "margen = 1.96 * s / sqrt(n).",
 hints: [
 "margen = 1.96 * s / sqrt(n).",
 "import math o numpy para la raíz.",
 ],
 edgeCases: ["n=0"],
 tests: "salida coincide con solution output",
 feedback:
  "Sin /√n el margen no es un error estándar: confundes dispersión de datos con error del estimador. El IC es media ± margen, no media ± 1.96·s.",
 retrospective:
  "El SE del estimador se encoge con √n; la std de los datos no. El error clásico es dibujar un “IC” tan ancho como 1.96·s y asustar al negocio sin causa. Pregunta: si n pasa de 16 a 64, ¿qué pasa con el margen? Siguiente: d de Cohen con orden B−A.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · SE margin
# Bug a corregir: sin /sqrt(n)
import math
media, s, n = 10, 2, 16
margen = 1.96 * s
print("margen", round(margen, 3))`,
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
 title: "d de Cohen con orden B − A",
 preamble:
  "- **Contexto:** d resume magnitud estandarizada; el signo depende de qué grupo restas.\n- **Meta:** d = (media_B − media_A) / s_pooled.\n- **Éxito:** `d 1.5` (A=10, B=13, sp=2).\n- **Límites:** no inviertas A y B; no interpretes d como “probado”.",
 instruction:
 "1. Starter usa (10−13)/2.\n2. Corrige a (13−10)/2.\n3. Imprime `d` a 2 decimales.\n4. No cambies s_pooled.",
 hint: "d = (media_B − media_A) / s_pooled con los números del starter.",
 hints: [
 "d = (media_B − media_A) / s_pooled con los números del starter.",
 "Redondea a 2 decimales; etiqueta `d`.",
 ],
 edgeCases: ["sp=0"],
 tests: "salida coincide con solution output",
 feedback:
  "Si inviertes A y B, el signo de d se voltea y el relato de “efecto” miente. El contrato usa B − A; d habla de magnitud, no de “probado”.",
 retrospective:
  "d habla de magnitud estandarizada, no de decisión de campaña ni de “probado”. Invertir grupos voltea el relato del efecto. Pregunta: con d=1.5 y n chico, ¿qué más reportas además del punto? Luego (E3): bootstrap cuando z es dudoso.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · Cohen d
# Bug a corregir: (10-13)/2 signo/orden wrong
# medias sintéticas: A=10, B=13; s_pooled=2
d = (10 - 13) / 2
print("d", round(d, 2))`,
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
 title: "Bootstrap simple de la media",
 preamble:
  "- **Contexto:** con montos de cola pesada y n chico, 1.96·s/√n es tosco; el portafolio pide bootstrap documentado.\n- **Meta:** remuestrear con reemplazo B=100 (seed fija), percentiles 2.5/97.5 de la media.\n- **Éxito:** `boot_ic95 (10.89, 31.17)`, `n 5`, `nota bootstrap_simple`.\n- **Límites:** no reinicies el rng en el bucle; no uses z aquí; el IC no es el rango del 95% de x.",
 instruction:
 "1. Completa el bloque de boots (starter imprime None).\n2. B medias con `rng.choice(..., replace=True)`.\n3. `np.quantile(..., [0.025, 0.975])` redondeado a 2.\n4. Imprime n y nota exacta `bootstrap_simple`.",
 hint: "Para i en range(B): rng.choice(x, size=len(x), replace=True).mean(); luego np.quantile(..., [0.025, 0.975]).",
 hints: [
 "Para i en range(B): rng.choice(x, size=len(x), replace=True).mean(); luego np.quantile(..., [0.025, 0.975]).",
 "No reinicies el Generator dentro del bucle; usa el rng del starter.",
 ],
 edgeCases: ["B=1 inútil", "x vacío"],
 tests: "salida coincide con solution output",
 feedback:
  "Bootstrap = remuestrear con reemplazo y percentiles de la estadística. No es z·s/√n ni el rango del 95% de los tickets crudos: estima incertidumbre del *estimador*.",
 retrospective:
  "Bootstrap estima la incertidumbre del *estimador*, no el intervalo donde viven el 95% de los tickets. Seed fija hace auditable el notebook. Puente a T3: asociación sin vender causa.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · bootstrap de la media (transferencia)
import numpy as np
x = np.array([10.0, 12.0, 11.0, 13.0, 50.0])
rng = np.random.default_rng(42)
B = 100
# Completa: B medias remuestreadas; percentiles 2.5 y 97.5
print("boot_ic95", None)
print("n", len(x))
print("nota", "???")`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import numpy as np
x = np.array([10.0, 12.0, 11.0, 13.0, 50.0])
rng = np.random.default_rng(42)
B = 100
boots = np.empty(B)
for i in range(B):
    boots[i] = rng.choice(x, size=len(x), replace=True).mean()
lo, hi = np.quantile(boots, [0.025, 0.975])
print("boot_ic95", (round(float(lo), 2), round(float(hi), 2)))
print("n", len(x))
print("nota", "bootstrap_simple")`,
 output: `boot_ic95 (10.89, 31.17)
n 5
nota bootstrap_simple`,
 },
 },
 {
 id: "S18-T3-A-E1",
 subtopicId: "S18-T3-A",
 kind: "guided",
 title: "Pearson entre x e y, no y consigo",
 preamble:
  "- **Contexto:** un r=1 en el slide puede ser un bug de correlacionar la serie consigo misma.\n- **Meta:** Pearson de x con y a 3 decimales.\n- **Éxito:** `r 0.934` con x=[1,2,3,4], y=[2,5,5,10] (el starter con y,y imprime 1.0 y **falla**).\n- **Límites:** usa `corrcoef(x, y)[0,1]`; no borres x.",
 instruction:
 "1. Starter: `corrcoef(y, y)`.\n2. Cambia a `corrcoef(x, y)`.\n3. Redondea a 3; etiqueta `r`.\n4. No alteres los arrays.",
 hint: "corrcoef(x, y)[0, 1], no corrcoef(y, y).",
 hints: [
 "corrcoef(x, y)[0, 1], no corrcoef(y, y).",
 "Redondea a 3 decimales.",
 ],
 edgeCases: ["constante en x → nan"],
 tests: "salida coincide con solution output",
 feedback:
  "corrcoef(y, y) siempre da 1: es tautología, no hallazgo. Necesitas la asociación entre las dos series; revisa siempre los dos argumentos.",
 retrospective:
  "Correlacionar y con y siempre da 1: es tautología, no hallazgo. Si tu salida es 1.0 y el fixture no es lineal perfecto, sospecha los argumentos. Revisa siempre los dos vectores. Siguiente: Spearman monótono por rangos.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · corrcoef
# Bug a corregir: r de y vs y no x vs y
import numpy as np
x = np.array([1, 2, 3, 4], dtype=float)
y = np.array([2, 5, 5, 10], dtype=float)
print("r", round(float(np.corrcoef(y, y)[0, 1]), 3))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import numpy as np
x = np.array([1, 2, 3, 4], dtype=float)
y = np.array([2, 5, 5, 10], dtype=float)
print("r", round(float(np.corrcoef(x, y)[0, 1]), 3))`,
 output: `r 0.934`,
 },
 },
 {
 id: "S18-T3-A-E2",
 subtopicId: "S18-T3-A",
 kind: "independent",
 title: "Spearman como Pearson de rangos",
 preamble:
  "- **Contexto:** y crece monótono pero no lineal con x; Pearson en escala original no es el contrato “Spearman”.\n- **Meta:** rangos de x e y + Pearson de rangos.\n- **Éxito:** `spearman 1.0`.\n- **Límites:** usa `argsort(argsort(...))`; no reportes Pearson crudo con etiqueta spearman.",
 instruction:
 "1. Starter imprime Pearson de x,y crudos.\n2. Construye rx, ry con rangos.\n3. `corrcoef(rx, ry)[0,1]` redondeado a 3.\n4. Etiqueta exacta `spearman`.",
 hint: "Rangos estables: np.argsort(np.argsort(serie)); luego corrcoef de los dos vectores de rangos.",
 hints: [
 "Rangos estables: np.argsort(np.argsort(serie)); luego corrcoef de los dos vectores de rangos.",
 "Redondea a 3 decimales; etiqueta exacta spearman.",
 ],
 edgeCases: ["empates en rangos (aquí no hay)"],
 tests: "salida coincide con solution output",
 feedback:
  "Spearman = Pearson sobre rangos. Si usaste corrcoef(x, y) crudo, obtienes Pearson, no Spearman. Confundir etiqueta y método rompe la auditoría del notebook.",
 retrospective:
  "Spearman resume asociación *monótona*; sigue siendo observación, no causa. El error de auditoría es imprimir Pearson con etiqueta spearman: el revisor cree que usaste rangos. Pregunta: si y = x², ¿esperas Spearman 1 y Pearson <1? Luego: residualizar un confusor Z.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · Spearman via rangos
# Bug a corregir: Pearson en escala original (no rangos)
import numpy as np
x = np.array([1.0, 2.0, 3.0, 10.0])
y = np.array([1.0, 4.0, 9.0, 100.0])  # monótona no lineal
print("spearman", round(float(np.corrcoef(x, y)[0, 1]), 3))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import numpy as np
x = np.array([1.0, 2.0, 3.0, 10.0])
y = np.array([1.0, 4.0, 9.0, 100.0])
rx = np.argsort(np.argsort(x)).astype(float)
ry = np.argsort(np.argsort(y)).astype(float)
print("spearman", round(float(np.corrcoef(rx, ry)[0, 1]), 3))`,
 output: `spearman 1.0`,
 },
 },
 {
 id: "S18-T3-A-E3",
 subtopicId: "S18-T3-A",
 kind: "transfer",
 title: "Residualizar confusor y claim no causal",
 preamble:
  "- **Contexto:** en CP-N2-B un r alto entre monto y visitas puede ser tamaño de ciudad (Z).\n- **Meta:** reportar r_raw, r_residual tras residualizar x,y vs. z, y claim ético.\n- **Éxito:** `r_raw 0.828`, `r_residual 0.075`, `claim asociacion_observada_no_causal`.\n- **Límites:** seed 1 y coeficientes del starter fijos; no regeneres datos; no afirmes causa.",
 instruction:
 "1. r_raw ya está; completa residuales.\n2. `polyfit(z, serie, 1)` para x e y; resta la predicción.\n3. Pearson de residuales a 3 decimales.\n4. Imprime claim exacto no causal.",
 hint: "Residualiza con polyfit(z, serie, 1); corrcoef de residuales; redondea a 3 decimales.",
 hints: [
 "Residualiza con polyfit(z, serie, 1); corrcoef de residuales; redondea a 3 decimales.",
 "Misma seed y coeficientes del starter; no regeneres datos distintos.",
 ],
 edgeCases: ["ruido cero → residuales ~0; aquí hay ruido intencional"],
 tests: "salida coincide con solution output",
 feedback:
  "r alto con confusor no prueba causa. Residualiza Z y reporta r_residual + claim no causal: si r cae, el confusor era el relato principal.",
 retrospective:
  "Si r cae al controlar Z, el confusor era el relato principal. El claim protege de lenguaje causal en el portafolio. Puente a T3-B: flags por segmento sin culpa regional.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · confusor y residuales (transferencia)
import numpy as np
rng = np.random.default_rng(1)
z = rng.normal(0, 1, 80)
x = 0.8 * z + rng.normal(0, 0.3, 80)
y = 0.7 * z + rng.normal(0, 0.3, 80)
r_raw = float(np.corrcoef(x, y)[0, 1])
print("r_raw", round(r_raw, 3))
# Completa: residualiza x,y vs z; imprime r_residual (3 dec) y claim no causal
print("r_residual", None)
print("claim", "???")`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import numpy as np
rng = np.random.default_rng(1)
z = rng.normal(0, 1, 80)
x = 0.8 * z + rng.normal(0, 0.3, 80)
y = 0.7 * z + rng.normal(0, 0.3, 80)
r_raw = float(np.corrcoef(x, y)[0, 1])
bx = np.polyfit(z, x, 1)
by = np.polyfit(z, y, 1)
rx = x - (bx[0] * z + bx[1])
ry = y - (by[0] * z + by[1])
r_res = float(np.corrcoef(rx, ry)[0, 1])
print("r_raw", round(r_raw, 3))
print("r_residual", round(r_res, 3))
print("claim", "asociacion_observada_no_causal")`,
 output: `r_raw 0.828
r_residual 0.075
claim asociacion_observada_no_causal`,
 },
 },
 {
 id: "S18-T3-B-E1",
 subtopicId: "S18-T3-B",
 kind: "guided",
 title: "Cerca superior Tukey 1.5·IQR",
 preamble:
  "- **Contexto:** el runbook de anomalías univariadas usa cerca hi = Q3 + 1.5·IQR.\n- **Meta:** contar cuántos montos superan hi.\n- **Éxito:** `n_hi 1` (el 50 del array).\n- **Límites:** multiplicador 1.5 (no 0.5); flag ≠ fraude.",
 instruction:
 "1. Starter usa `0.5 * iqr`.\n2. Cambia a `1.5 * iqr`.\n3. Cuenta `(m > hi).sum()` como int.\n4. Etiqueta `n_hi`.",
 hint: "Multiplicador Tukey clásico: 1.5 sobre el IQR.",
 hints: [
 "Multiplicador Tukey clásico: 1.5 sobre el IQR.",
 "n_hi = cantidad de valores > hi.",
 ],
 edgeCases: ["sin outliers"],
 tests: "salida coincide con solution output",
 feedback:
  "Tukey usa 1.5·IQR, no 0.5. Con 0.5 inventas outliers de más. Los flags son candidatos a revisión humana, no fraude automático.",
 retrospective:
  "El contrato Tukey del runbook es 1.5·IQR; bajar a 0.5 es inventar un método distinto sin documentarlo. Los flags son candidatos a revisión humana. Pregunta: si n_hi se dispara, ¿miras primero el multiplicador o acusas al canal? Siguiente: tasa solo en Lima.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · upper fence outliers
# Bug a corregir: hi = q3 + 0.5*iqr
import numpy as np
m = np.array([10, 12, 11, 13, 50], dtype=float)
q1, q3 = np.quantile(m, [0.25, 0.75])
iqr = q3 - q1
hi = q3 + 0.5 * iqr
print("n_hi", int((m > hi).sum()))`,
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
 title: "Tasa de flags solo en Lima",
 preamble:
  "- **Contexto:** un slide que mezcla regiones miente sobre “riesgo en Lima”.\n- **Meta:** media de flags donde region == \"Lima\".\n- **Éxito:** `tasa_Lima 1.0` con el fixture de 3 filas.\n- **Límites:** no uses `flag.mean()` global; no inventes causalidad regional.",
 instruction:
 "1. Starter imprime mean global.\n2. Enmascara `flag[region == \"Lima\"]`.\n3. Media float; etiqueta `tasa_Lima`.\n4. No alteres los arrays.",
 hint: "Filtra flags donde region == \"Lima\" y toma la media.",
 hints: [
 "Filtra flags donde region == \"Lima\" y toma la media.",
 "No uses flag.mean() global si el contrato pide solo Lima.",
 ],
 edgeCases: ["segmento vacío"],
 tests: "salida coincide con solution output",
 feedback:
  "La tasa global mezcla regiones y miente sobre “riesgo en Lima”. Enmascara con region == \"Lima\" antes del mean; la tasa alta es hallazgo descriptivo, no causa.",
 retrospective:
  "Segmentar antes de promediar es el hábito del EDA por cohorte. Tasa alta en un segmento es hallazgo descriptivo. Luego: máscara Tukey bilateral completa.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · tasa por región
# Bug a corregir: tasa global en lugar de solo Lima
import numpy as np
region = np.array(["Lima", "Arequipa", "Cusco"])
flag = np.array([True, True, False])
print("tasa_Lima", float(flag.mean()))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import numpy as np
region = np.array(["Lima", "Arequipa", "Cusco"])
flag = np.array([True, True, False])
print("tasa_Lima", float(flag[region == "Lima"].mean()))`,
 output: `tasa_Lima 1.0`,
 },
 },
 {
 id: "S18-T3-B-E3",
 subtopicId: "S18-T3-B",
 kind: "transfer",
 title: "Máscara Tukey bilateral a lista",
 preamble:
  "- **Contexto:** el portafolio marca outliers altos *y* bajos; solo `m > hi` pierde la cola inferior.\n- **Meta:** booleans fuera de [lo, hi] como lista.\n- **Éxito:** `[True, False, False, False, True]` con un valor muy bajo (−20) y un 100 (unilateral solo marcaría el alto).\n- **Límites:** bilateral; documenta en memo flag ≠ fraude ni culpa de región.",
 instruction:
 "1. lo/hi ya calculados.\n2. `(m < lo) | (m > hi)` — **ambas** cercas.\n3. `.tolist()` e imprime.\n4. No cambies el array ni las cercas.",
 hint: "flag = (m < lo) | (m > hi); luego .tolist().",
 hints: [
 "flag = (m < lo) | (m > hi); luego .tolist().",
 "Ambas cercas: no basta con m > hi.",
 ],
 edgeCases: ["IQR 0"],
 tests: "salida coincide con solution output",
 feedback:
  "Tukey es bilateral. Si solo usas m > hi, pierdes outliers bajos y sesgas el runbook. Flags son candidatos a revisión, no fraude ni culpa regional.",
 retrospective:
  "Bilateral protege de sesgo a “solo valores altos”. Flags son input a investigación humana. Puente a T4: trazar pregunta→evidencia sin convertir flag en decisión.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · máscara Tukey bilateral (transferencia)
import numpy as np
m = np.array([-20.0, 2.0, 3.0, 4.0, 100.0], dtype=float)
q1, q3 = np.quantile(m, [0.25, 0.75])
iqr = q3 - q1
lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
# Completa: lista de booleans fuera de [lo, hi]
print([])`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import numpy as np
m = np.array([-20.0, 2.0, 3.0, 4.0, 100.0], dtype=float)
q1, q3 = np.quantile(m, [0.25, 0.75])
iqr = q3 - q1
lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
print(((m < lo) | (m > hi)).tolist())`,
 output: `[True, False, False, False, True]`,
 },
 },
 {
 id: "S18-T4-A-E1",
 subtopicId: "S18-T4-A",
 kind: "guided",
 title: "Imprimir la pregunta, no la hipótesis",
 preamble:
  "- **Contexto:** en la traza Q→H→E, la pregunta de negocio y la hipótesis son capas distintas.\n- **Meta:** imprimir solo el valor de `evidencia[\"pregunta\"]`.\n- **Éxito:** `¿Cuál es el ticket mediano?`\n- **Límites:** no reescribas el dict; no imprimas hipótesis ni resultado.",
 instruction:
 "1. Starter imprime `hipotesis`.\n2. Cambia la clave a `pregunta`.\n3. Un solo print del string.\n4. No mutes el dict.",
 hint: "Accede a evidencia[\"pregunta\"], no a \"hipotesis\".",
 hints: [
 "Accede a evidencia[\"pregunta\"], no a \"hipotesis\".",
 "No reescribas el dict; solo el print.",
 ],
 edgeCases: ["claves faltantes"],
 tests: "salida coincide con solution output",
 feedback:
  "Pregunta e hipótesis son capas distintas. Mezclarlas confunde el memo y la revisión: el print de traza de pregunta usa la clave pregunta.",
 retrospective:
  "La traza empieza por la pregunta de negocio; la hipótesis es una apuesta testeable distinta. Si imprimes la hipótesis en el bloque “pregunta”, el revisor no sabe qué se estaba midiendo. Siguiente: etiquetar solo_hallazgo vs. candidato_decision.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · evidencia pregunta
# Bug a corregir: imprime hipotesis no pregunta
evidencia = {
 "pregunta": "¿Cuál es el ticket mediano?",
 "hipotesis": "mediana >= 5",
 "resultado": {"n": 10, "median": 5.0},
}
print(evidencia["hipotesis"])`,
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
 title: "Hallazgo vs. candidato a decisión",
 preamble:
  "- **Contexto:** una mediana de 12 no dispara campaña; solo etiqueta el nivel del hallazgo.\n- **Meta:** si median < 15 → `solo_hallazgo`; si no → `candidato_decision`.\n- **Éxito:** `solo_hallazgo` con median=12.\n- **Límites:** no lances decisiones automáticas; corrige el operador de comparación.",
 instruction:
 "1. Starter usa `median > 15` al revés.\n2. Condición correcta: `median < 15` → solo_hallazgo.\n3. Un print de la etiqueta.\n4. No cambies el umbral 15.",
 hint: "solo_hallazgo cuando median está por debajo del umbral 15.",
 hints: [
 "solo_hallazgo cuando median está por debajo del umbral 15.",
 "Candidato a decisión ≠ decisión automática.",
 ],
 edgeCases: ["igualdad al umbral"],
 tests: "salida coincide con solution output",
 feedback:
  "Revisa el operador de comparación. Hallazgo no es lanzar campaña: solo etiqueta el nivel de la mediana. Candidato a decisión ≠ decisión tomada.",
 retrospective:
  "Candidato a decisión ≠ decisión tomada. El EDA etiqueta; el negocio decide. Luego (E3): traza P→M→V→L con límite de cobertura.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · hallazgo vs decision
# Bug a corregir: umbral invertido
median = 12
print("solo_hallazgo" if median > 15 else "candidato_decision")`,
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
 title: "Traza P→M→V→L auditable",
 preamble:
  "- **Contexto:** sin límite de cobertura (L), un hallazgo de mediana en Lima no es auditable.\n- **Meta:** función `traza` con prints `P:`, `M:`, `V:`, `L:`.\n- **Éxito:** cuatro líneas con “ticket mediano Lima”, median, 27.5, “solo web”.\n- **Límites:** no cambies la llamada de prueba; usa el parámetro `limite`.",
 instruction:
 "1. Completa el `pass` de la función.\n2. Cuatro prints con prefijos exactos.\n3. Orden P, M, V, L.\n4. Deja `traza(...)` intacta.",
 hint: "Cuatro prints con prefijos P/M/V/L; el cuarto usa el parámetro límite (identificador `limite` en el código).",
 hints: [
 "Cuatro prints con prefijos P/M/V/L; el cuarto usa el parámetro límite (identificador `limite` en el código).",
 "No cambies los argumentos de la llamada de prueba.",
 ],
 edgeCases: ["None en valor"],
 tests: "salida coincide con solution output",
 feedback:
  "Sin límite de cobertura (L) el hallazgo no es auditable: “solo web” impide generalizar. Añade print(\"L:\", limite) en orden P→M→V→L.",
 retrospective:
  "L cierra la traza: “solo web” impide generalizar. Pregunta de cierre: ¿qué L pondrías si la muestra es solo canal app? Puente a T4-B: nota de datos con n y hash.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · traza P→M→V→L (transferencia)
def traza(pregunta, metrica, valor, limite):
 # Completa: imprime P, M, V y L con esos prefijos
 pass

traza("ticket mediano Lima", "median", 27.5, "solo web")`,
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
 title: "Nota mínima n_raw, n_final, filtros",
 preamble:
  "- **Contexto:** un `{}` en la nota de datos no pasa revisión de CP-N2-B.\n- **Meta:** dict con n_raw=5, n_final=4, filtros `[\"monto>0\"]`.\n- **Éxito:** imprimir ese dict.\n- **Límites:** n_final ≤ n_raw; no inventes campos extra obligatorios aquí.",
 instruction:
 "1. Starter: `note = {}`.\n2. Llena las tres claves.\n3. `print(note)`.\n4. Filtros como lista de strings.",
 hint: "Claves: n_raw, n_final, filtros (lista de strings).",
 hints: [
 "Claves: n_raw, n_final, filtros (lista de strings).",
 "n_final ≤ n_raw siempre.",
 ],
 edgeCases: ["n_final > n_raw inválido"],
 tests: "salida coincide con solution output",
 feedback:
  "Una nota de datos vacía no es auditable. Incluye n_raw, n_final y la lista de filtros: sin ellos nadie reproduce el corte de filas.",
 retrospective:
  "n_raw vs. n_final hace visible la pérdida por filtro; sin lista de filtros nadie reproduce el corte. El error clásico es copiar n del raw al final “porque casi no filtramos”. Siguiente: huella SHA-1 de 8 hex.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · note filtros
# Bug a corregir: note vacío
note = {}
print(note)`,
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
 title: "SHA-1 de 8 hex del CSV",
 preamble:
  "- **Contexto:** la huella corta del CSV ordenado permite detectar cambios de filas sin pegar el digest entero.\n- **Meta:** sha1 del payload con newlines reales, primeros 8 hex.\n- **Éxito:** `2aa26ec9`.\n- **Límites:** no md5; no digest completo; newlines reales (chr(10)), no la secuencia literal `\\n` de dos caracteres.",
 instruction:
 "1. Starter usa md5 y digest completo.\n2. Cambia a `sha1(...).hexdigest()[:8]`.\n3. Mantén el armado del payload del starter.\n4. Un solo print del string de 8 chars.",
 hint: "Arma el payload con newlines reales (p. ej. uniendo líneas con chr(10)); sha1(...).hexdigest()[:8].",
 hints: [
 "Arma el payload con newlines reales (p. ej. uniendo líneas con chr(10)); sha1(...).hexdigest()[:8].",
 "Algoritmo sha1, no md5; recorta a 8 caracteres.",
 ],
 edgeCases: ["orden de filas cambia hash"],
 tests: "salida coincide con solution output",
 feedback:
  "Debe ser SHA-1, no MD5, y solo 8 hex chars. Los bytes deben incluir newlines reales tras cada línea del CSV; cambiar el orden de filas cambia el hash.",
 retrospective:
  "Algoritmo y longitud son contrato del portafolio. Cambiar el orden de filas cambia el hash: por eso se ordena antes. Luego (E3): nota con n y seed tras filtro.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · sha1 short
# Bug a corregir: usa md5 y el digest completo (no sha1[:8])
import hashlib
# CSV sintético con saltos de línea reales (chr(10)), no la secuencia de dos chars \\ + n
lines = ["a,b", "1,2"]
payload = (chr(10).join(lines) + chr(10)).encode("utf-8")
print(hashlib.md5(payload).hexdigest())`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import hashlib
lines = ["a,b", "1,2"]
payload = (chr(10).join(lines) + chr(10)).encode("utf-8")
print(hashlib.sha1(payload).hexdigest()[:8])`,
 output: `2aa26ec9`,
 },
 },
 {
 id: "S18-T4-B-E3",
 subtopicId: "S18-T4-B",
 kind: "transfer",
 title: "Nota post-filtro con seed 42",
 preamble:
  "- **Contexto:** el cierre hacia S19 exige n_raw, n_final y seed en la misma nota.\n- **Meta:** filtrar monto>0 y armar dict con seed 42.\n- **Éxito:** `{'n_raw': 3, 'n_final': 2, 'seed': 42}`.\n- **Límites:** n_final no puede igualar n_raw si el filtro elimina filas; seed exacto 42.",
 instruction:
 "1. n_raw ya está; df2 filtra monto>0.\n2. Completa note con n_raw, n_final=len(df2), seed=42.\n3. Imprime el dict.\n4. No borres el filtro.",
 hint: "n_raw = len(df) antes del filtro; n_final = len(df2); incluye seed: 42.",
 hints: [
 "n_raw = len(df) antes del filtro; n_final = len(df2); incluye seed: 42.",
 "No iguales n_final a n_raw si el filtro elimina filas.",
 ],
 edgeCases: ["todo filtrado"],
 tests: "salida coincide con solution output",
 feedback:
  "n_final debe reflejar el filtro (aquí 2, no 3). Sin seed el notebook no es reproducible entre compañeros: “me salió distinto” deja de ser auditable.",
 retrospective:
  "Seed + n_final hacen reproducible el notebook entre compañeros. Sin seed, “me salió distinto” no es auditable. Puente a You Do: EDA completo de CP-N2-B con los seis checkpoints.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · data note post-filtro (transferencia)
import pandas as pd
df = pd.DataFrame({"monto": [1.0, 0.0, 3.0]})
n_raw = len(df)
df2 = df[df["monto"] > 0]
# Completa: note con n_raw, n_final y seed 42
note = {}
print(note)`,
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
 }
 ],
 },
 youDo: {
 title: "EDA honesto para CP-N2-B (inicio)",
 context:
 "Eres analista en un equipo de insights de una fintech peruana (escenario sintético). En **S17** dejaste un dataset limpio y un memo de límites (CP-N2-A). Aquí abres **CP-N2-B**: sobre un extracto sintético de tickets (sin PII real) produces un EDA que distingue hallazgo, hipótesis y decisión, con incertidumbre explícita y notas de datos. El artefacto alimenta el dashboard accesible de S19.",
 objectives: [
 "Resumir distribuciones con n, centro, dispersión y cuantiles (y métrica robusta si hay cola)",
 "Diagnosticar sesgo muestral vs. cuotas y declarar cobertura LIMITADA/OK",
 "Reportar al menos un IC (z y/o bootstrap documentado) o tamaño de efecto (p. ej. d de Cohen) con n.",
 "Interpretar correlación/Spearman o segmentos sin afirmaciones causales; flags Tukey ≠ fraude",
 "Entregar script/notebook con notas de datos, seed y huella de filas listo para S19.",
 ],
 requirements: [
 "Solo datos sintéticos o anonimizados de práctica (sin PII real)",
 "Cada conclusión referencia un cálculo (n, métrica, IC/flag o código) y un límite de cobertura",
 "Nota de datos con origen, filtros, n_raw/n_final, seed y hash corto del CSV ordenado",
 "Sin secretos ni credenciales",
 "Español profesional (es-PE)",
 "Salida mínima auditable: (1) resumen tabular, (2) bias_pp + cobertura, (3) ic95_z o boot_ic95 o d + n, (4) etiqueta no-causal, (5) nota de datos en JSON",
 "Si usas z sobre montos lognormales, declara el límite; si hay colas, documenta bootstrap",
 ],
 starterCode: `import hashlib
import json
from collections import Counter
import numpy as np
import pandas as pd

# Portafolio CP-N2-B (inicio) · CASO-LIM-018 · solo sintéticos
# Hilo S17 → S18 → S19: reutiliza filtros documentados; añade incertidumbre y notas de datos.

rng = np.random.default_rng(18)
df_raw = pd.DataFrame({
    "ticket_id": [f"T{i:03d}" for i in range(1, 101)],
    "region": rng.choice(["Lima", "Arequipa", "Cusco"], size=100, p=[0.7, 0.2, 0.1]),
    "monto": rng.lognormal(3.0, 0.5, 100),
    "visitas": rng.integers(1, 20, size=100),
})
df_raw.loc[0, "monto"] = 400.0  # cola sintética

# --- Checkpoint 1: filtro y cobertura de filas ---
df = df_raw[df_raw["monto"] > 0].copy()
n_raw, n_final = len(df_raw), len(df)
print("n_raw", n_raw, "n_final", n_final)

# --- Checkpoint 2: resumen de distribución (completa el dict) ---
q = np.quantile(df["monto"], [0.25, 0.5, 0.75, 0.9])
resumen = {
    "n": n_final,
    "mean": round(float(df["monto"].mean()), 2),
    "median": round(float(df["monto"].median()), 2),
    "std": round(float(df["monto"].std(ddof=1)), 2),
    "IQR": round(float(q[2] - q[0]), 2),
    # Completa: añade p90 si el negocio pregunta por cola
}
print("resumen", resumen)

# --- Checkpoint 3: sesgo muestral vs. cuotas sintéticas ---
pob = {"Lima": 0.55, "Arequipa": 0.25, "Cusco": 0.20}
counts = Counter(df["region"])
share = {k: counts.get(k, 0) / n_final for k in pob}
bias_pp = {k: round(share[k] - pob[k], 3) for k in pob}
max_abs = max(abs(v) for v in bias_pp.values())
cobertura = "LIMITADA" if max_abs > 0.1 else "OK"
print("bias_pp", bias_pp)
print("cobertura", cobertura)

# --- Checkpoint 4: IC z y/o bootstrap de la media (montos lognormales → declara límite) ---
# Esqueleto z: completa la variable se e imprime ic95_z. Opcional: bootstrap B=200 como en T2-B.
m = float(df["monto"].mean())
s = float(df["monto"].std(ddof=1))
# se = s / np.sqrt(n_final)
# ic95_z = (round(m - 1.96 * se, 2), round(m + 1.96 * se, 2))
print("ic95_z", "(completa se e imprime el intervalo)")
print("nota_ic", "z_approx_en_lognormal_limitada; preferir_bootstrap_si_colas")

# --- Checkpoint 5: asociación / segmentos sin afirmación causal ---
# Ejemplo: Pearson monto~visitas + etiqueta; o flags Tukey por región.
# r = float(np.corrcoef(df["monto"], df["visitas"])[0, 1])
print("claim", "asociacion_observada_no_causal")  # no borres esta etiqueta ética

# --- Checkpoint 6: nota de datos reproducible (base hacia S19) ---
payload = df.sort_values("ticket_id").to_csv(index=False).encode()
note = {
    "origen": "sintetico_local",
    "n_raw": n_raw,
    "n_final": n_final,
    "filtros": ["monto > 0"],
    "seed": 18,
    "sha1_8": hashlib.sha1(payload).hexdigest()[:8],
    "limites": "muestra sintética sesgada a Lima; no generalizar a todo el Perú",
    "etica": "flags_y_correlacion_no_son_fraude_ni_causa",
}
print(json.dumps(note, ensure_ascii=False))
print(df.head())
`,
 portfolioNote:
 "Artefacto de inicio CP-N2-B: EDA con incertidumbre y notas de datos; alimenta dashboard y reportes en S19–S21. Reutiliza el criterio de límites de S17.",
 rubric: [
 { criterion: "Cada hallazgo cita cálculo (n, métrica, IC o flag) y límite de cobertura", weight: "25%" },
 { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
 { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
 { criterion: "Pruebas o casos de borde documentados (cola, sesgo, z vs. bootstrap)", weight: "15%" },
 { criterion: "Código legible y sin afirmaciones causales/fraude automático", weight: "10%" },
 { criterion: "Documentación en español profesional", weight: "10%" }
 ],
 retrospective:
  "Antes de marcar listo: (1) ¿cada hallazgo cita n, métrica y un límite de cobertura? (2) ¿declaraste por qué usaste z, bootstrap o ambos en montos lognormales? (3) ¿puedes defender en 30 segundos que un flag Tukey o un r alto no es fraude ni causa? Escribe en el README una frase de impacto medible (antes/después del EDA) y confirma que la nota de datos incluye seed y sha1_8 del CSV ordenado. Ese paquete es lo que alimenta el dashboard de S19.",
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
 question: "¿Qué debe incluir una nota de datos mínima?",
 options: ["Origen, filtros, n y límites de cobertura", "Solo el gráfico final", "La contraseña del VPN", "El prompt del LLM"],
 correctIndex: 0,
 explanation:
 "La nota de datos hace auditable y reproducible el EDA.",
 },
 {
 question: "El sesgo de muestra ocurre cuando:",
 options: ["std es alta", "Usas mediana", "La muestra no representa la población de interés", "n > 30"],
 correctIndex: 2,
 explanation:
 "Selección no representativa sesga estimaciones aunque el cálculo sea correcto.",
 },
 {
 question: "En un EDA de tickets sintéticos Lima/Cusco, ¿cuál es la comunicación correcta de un r de Pearson alto entre monto y visitas cuando ambos crecen con el tamaño de la ciudad (confusor)?",
 options: ["Afirmar que más visitas causan más monto y recomendar campaña automática", "Reportar asociación observada, explorar el confusor y evitar verbos causales sin diseño", "Eliminar la correlación del informe porque “no es causal” y no mostrar el número", "Usar solo la media y omitir n e intervalos para simplificar el slide ejecutivo"],
 correctIndex: 1,
 explanation:
 "Correlación ≠ causalidad. El EDA reporta asociación con n/límites y posibles confusores; no borra el número ni salta a decisión automática.",
 },
 {
 question: "Un IC 95% para la media muestral de tickets, ¿qué NO debes afirmar?",
 options: ["El intervalo es compatible con incertidumbre de muestreo bajo el modelo usado", "Reporto n junto al intervalo", "Con colas pesadas y n chico debo ser cauteloso con la aproximación z", "Quedó probado al 95% que la media poblacional es exactamente el punto central"],
 correctIndex: 3,
 explanation:
 "El IC no “prueba” un valor puntual ni equivale al rango del 95% de los datos; comunica incertidumbre bajo supuestos.",
 },
 {
 question: "Una tasa de flags Tukey más alta en Cusco implica:",
 options: ["Hallazgo descriptivo de anomalías univariadas; la decisión de investigación es humana", "Fraude demostrado en Cusco", "Que la media es mejor que la mediana", "Que el IC es innecesario"],
 correctIndex: 0,
 explanation:
 "Anomalía ≠ culpa ni fraude automático. Documenta método, n y límites; la investigación es posterior y humana.",
 },
 {
 question: "Una d de Cohen ≈ 1.1 entre media de tickets del grupo B y del grupo A (con n reportado) comunica principalmente:",
 options: ["Que la campaña está probada al 95% y debe desplegarse ya", "Que no hay confusores posibles", "Una magnitud de diferencia estandarizada en la muestra; aún hace falta IC, n y límites de cobertura", "Que la mediana es incorrecta y solo debe usarse la media"],
 correctIndex: 2,
 explanation:
 "El tamaño de efecto habla de magnitud, no de prueba causal ni de decisión automática. Siempre acompáñalo de n e incertidumbre.",
 },
 ],
 },
 resources: {
 docs: [
 {
 label: "NumPy statistics",
 url: "https://numpy.org/doc/stable/reference/routines.statistics.html",
 note: "mean, quantile, corrcoef, std ddof",
 },
 {
 label: "pandas describe / basics",
 url: "https://pandas.pydata.org/docs/user_guide/basics.html",
 note: "describe, quantiles",
 },
 {
 label: "SciPy stats overview",
 url: "https://docs.scipy.org/doc/scipy/reference/stats.html",
 note: "distribuciones e IC de referencia",
 },
 {
 label: "NumPy corrcoef",
 url: "https://numpy.org/doc/stable/reference/generated/numpy.corrcoef.html",
 note: "Pearson; no causalidad",
 },
 {
 label: "pandas quantile",
 url: "https://pandas.pydata.org/docs/reference/api/pandas.Series.quantile.html",
 note: "IQR y colas",
 },
 {
 label: "Think Stats (open book)",
 url: "https://allendowney.github.io/ThinkStats/",
 note: "estadística práctica con Python",
 },
 {
 label: "OpenIntro Statistics",
 url: "https://www.openintro.org/book/os/",
 note: "IC, sesgo, interpretación cuidadosa",
 },
 ],
 books: [
 {
 label: "Think Stats (Downey)",
 note: "Estadística práctica con Python",
 },
 {
 label: "Statistical Inference via Data Science",
 note: "Marco de incertidumbre para analistas",
 },
 ],
 courses: [
 {
 label: "Coursera — Python for Everybody",
 url: "https://www.coursera.org/specializations/python",
 note: "fundamentos previos al EDA",
 },
 {
 label: "MIT 6.0002 / intro probability resources",
 url: "https://ocw.mit.edu/courses/6-0002-introduction-to-computational-thinking-and-data-science-fall-2016/",
 note: "pensamiento estadístico básico",
 },
 {
 label: "Harvard CS50P",
 url: "https://cs50.harvard.edu/python/",
 note: "práctica Python",
 },
 {
 label: "Stanford CS109 (concepts)",
 url: "https://web.stanford.edu/class/cs109/",
 note: "probabilidad e incertidumbre; no copiar nivel formal",
 },
 {
 label: "PyArcana live",
 url: "https://pillb.github.io/pyarcana/",
 note: "curso desplegado (referencia del proyecto)",
 },
 {
 label: "Awesome Python Learning",
 url: "https://github.com/skupriienko/Awesome-Python-Learning",
 note: "mapa de recursos",
 },
 ],
 },
}
