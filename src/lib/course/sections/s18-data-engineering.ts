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
 "En analytics y data products de banca, fintech y retail en Perú, un **EDA honesto** separa hallazgo, hipótesis y decisión: cada número lleva n, cobertura e incertidumbre. Tras el dataset limpio y el memo de límites de **S17 (CP-N2-A)**, aquí abres **CP-N2-B** con resúmenes robustos, sesgo muestral, intervalos básicos, correlación sin causalidad y data notes reproducibles — solo datos sintéticos. Ese paquete alimenta el dashboard accesible de S19.",
 learningOutcomes: [
 { text: "Resumir distribuciones con centro, dispersión y cuantiles" },
 { text: "Elegir métricas robustas y escalas honestas" },
 { text: "Identificar sesgo de población/muestra" },
 { text: "Reportar intervalos y tamaños de efecto básicos" },
 { text: "Interpretar correlación sin confundir causalidad" },
 { text: "Segmentar y marcar anomalías con límites claros" },
 { text: "Estructurar preguntas, hipótesis y evidencia" },
 { text: "Entregar notebook/script reproducible con data notes" }
 ],
 theory: [
 {
 heading: "Mapa de la sección: del dataset limpio al EDA con incertidumbre",
 paragraphs: [
 "En **S17** cerraste **CP-N2-A** con joins, agregaciones y un memo de límites sobre un dataset limpio. Aquí empiezas **CP-N2-B**: centro/dispersión, métricas robustas, sesgo muestral, intervalos básicos, correlación sin causalidad y notebooks con data notes reproducibles. Reutiliza la lógica de limpieza y el hábito de documentar cobertura; ahora cada hallazgo también declara incertidumbre.",
 "El hilo conductor es un **dataset sintético de tickets/montos** con regiones ficticias Lima, Arequipa y Cusco, ids `T00x` y montos en PEN. Cada hallazgo del portfolio debe citar un cálculo (n, métrica, IC o flag) y declarar incertidumbre: hallazgo ≠ hipótesis ≠ decisión de negocio. Los gráficos honestos y el dashboard se profundizan en **S19**.",
 "Orden pedagógico: **T1 Distribuciones** (centro, cuantiles, robustez y escalas) → **T2 Inferencia básica** (población/muestra, IC, bootstrap conceptual y tamaño de efecto) → **T3 Relaciones** (Pearson/Spearman, confusión, segmentos y anomalías sin claim causal) → **T4 Comunicación** (plantilla Q→H→E y data notes). Solo numpy/pandas ya vistos; sin PII real.",
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
 "Caso sintético: montos `[12.5, 18, 22, 25.5, 30, 45, 120]` PEN → media ~39, mediana 25.5, IQR ~17.5. En el memo de CP-N2-B escribes “mediana 25.5 PEN (n=7); cola p90 elevada por un outlier de 120” — no “el ticket promedio es 39 y representa al cliente típico”.",
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
 "Elige métrica según la pregunta de negocio: “ticket típico web Lima” → mediana + IQR; “ingreso total esperado del día” → suma o media con cola documentada. Caso sintético: x con un 200 PEN junto a tickets ~12 → media ~43 vs mediana ~12; el dashboard debe preferir mediana para “típico”. Sin PII real.",
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
 "Contrato: compara shares de la muestra vs un **marco** conocido (cuotas por región). Documenta exclusiones (filtros de fecha, canal, `monto>0`). Calcula `bias_pp = share_muestra − share_pob` por segmento y reporta el máximo |bias| como riesgo de generalización.",
 "Sin marco poblacional, declara **cobertura limitada** y no generalices a “todos los clientes del Perú”. Caso sintético: pob Lima 0.55 / Arequipa 0.25 / Cusco 0.20 vs muestra 80% Lima → bias Lima +0.25; cualquier KPI regional debe llevar esa nota en el data note.",
 ],
 code: {
 language: 'python',
 title: "sample_bias.py",
 code: `def s18_th_3():
    # población sintética de tickets por región
    pob = {"Sucursal-Norte": 0.55, "Arequipa": 0.25, "Cusco": 0.20}
    # muestra sesgada: sobremuestra Sucursal-Sur (lista de str, no ndarray de objetos)
    muestra = ["Sucursal-Centro"] * 40 + ["Arequipa"] * 8 + ["Cusco"] * 2
    from collections import Counter
    c = Counter(muestra)
    n = len(muestra)
    share = {k: round(v / n, 3) for k, v in c.items()}
    print("share_muestra", share)
    print("share_pob", pob)
    bias = {k: round(share.get(k, 0) - pob[k], 3) for k in pob}
    print("bias_pp", bias)

s18_th_3()`,
 output: `share_muestra {'Oficina-Este': 0.8, 'Arequipa': 0.16, 'Cusco': 0.04}
share_pob {'Oficina-Oeste': 0.55, 'Arequipa': 0.25, 'Cusco': 0.2}
bias_pp {'Cliente-A': 0.25, 'Cliente-B': -0.09, 'Sucursal-Norte': -0.16}`,
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
 "El **tamaño de efecto** (Cohen's d ≈ (μ₁−μ₀)/s_pooled, o diferencia de medianas en PEN) comunica **magnitud**, no solo “significativo”. Contrato de lenguaje: di “compatible con” / “en la muestra” y reporta n + IC; nunca “probado” con un solo IC. Caso sintético: media B ~108 vs A ~94, d≈1.1 — magnitud + incertidumbre, no veredicto causal de campaña. Sin PII real ni claims de fraude.",
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
 "Contrato de verbos: en EDA etiqueta **asociación observada**. Lista causas comunes y diseños que las romperían (experimento, instrumento) antes de cualquier claim causal en el informe de CP-N2-B.",
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
 "Contrato: marca flags booleanos, calcula tasas por segmento, documenta umbral, n por segmento y que el método es univariado. Evita “Sucursal-Sur genera outliers porque…” — eso es claim causal no soportado.",
 "Caso sintético: montos con un 80 PEN en Sucursal-Centro → flag anomalía en ese id; tasa Oficina-Este 0.2 vs Oficina-Oeste 0.0 es hallazgo descriptivo. El portfolio lista `ids_anom` y el método; la decisión de investigación es humana y posterior. Sin PII real ni auto-fraude.",
 ],
 code: {
 language: 'python',
 title: "segments_anom.py",
 code: `def s18_th_6():
    import numpy as np
    import pandas as pd

    df = pd.DataFrame({
     "region": ["Cliente-A"] * 5 + ["Cliente-B"] * 5,
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
{'Sucursal-Norte': 0.2, 'Sucursal-Sur': 0.0}
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
 heading: "Preguntas, hipótesis y evidencia",
 subtopicId: "S18-T4-A",
 paragraphs: [
 "Separa tres capas: **pregunta de negocio**, **hipótesis comprobable**, **evidencia calculada**. El hallazgo (número + n + límite) no es la decisión (lanzar campaña, bloquear cuenta, cambiar precio).",
 "Plantilla operativa: Pregunta → Métrica → Resultado (n, punto, IC) → Límite de cobertura → Siguiente paso. Cada celda del insight en CP-N2-B debe poder rastrearse a un print/assert del script.",
 "Caso sintético: “¿El ticket mediano en Sucursal-Centro supera 25 PEN?” → median(monto|Oficina-Este)=27.5, n=40, IC z o bootstrap documentado, límite “solo canal web”. Conclusión permitida: hipótesis provisional en web Oficina-Oeste; no “desplegar campaña nacional”. Sin PII real ni claims de fraude.",
 ],
 code: {
 language: 'python',
 title: "qhe_template.py",
 code: `def s18_th_7():
    # plantilla de traza hallazgo → cálculo (sintético)
    pregunta = "¿El ticket mediano en Cliente-A supera 25 PEN?"
    metrica = "median(monto | region==Cliente-B)"
    resultado = {"n": 40, "median": 27.5, "ic95_z_or_boot": (24.0, 31.0)}
    limite = "muestra de canal web, no incluye tienda física"
    print("pregunta:", pregunta)
    print("metrica:", metrica)
    print("resultado:", resultado)
    print("limite:", limite)
    print("no_es_decision:", "no lanzar campaña aún")

s18_th_7()`,
 output: `pregunta: ¿El ticket mediano en Sucursal-Norte supera 25 PEN?
metrica: median(monto | region==Sucursal-Sur)
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
 "Un **data note** documenta origen, fecha de corte, filtros, n pre/post, seed y un hash o conteo de filas. Si otra persona no regenera los mismos n y métricas clave, el notebook **no cumple** el criterio de cierre de esta sección.",
 "Contrato de reproducibilidad: versiones (pandas/numpy), rutas relativas, outputs en `out/`, seed fijo, sin celdas que muten estado global en orden opaco. Checklist mínima: seed, schema, n pre/post filtros, hash de payload, límites de generalización.",
 "Caso sintético: CSV de 3 tickets → `row_sha1_8`, n=3, filtros `monto>0`, seed=42. El portfolio adjunta el JSON del note junto al resumen de medianas; es la base de trazabilidad hacia S19–S21. Sin PII real.",
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
 intro: "Partimos del dataset limpio y el memo de límites de **S17 (CP-N2-A)**. Te demuestro el EDA de **CP-N2-B** inicio: resúmenes, sesgo, IC z + bootstrap, correlación/Spearman sin causalidad, flags Tukey y data notes con tickets sintéticos (Sucursal-Centro/Oficina-Este/Oficina-Oeste, PEN). En S19 ese paquete alimenta el dashboard accesible.",
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
 code: `def s18_ido_3():
    from collections import Counter
    import numpy as np

    pob = {"Cliente-A": 0.50, "Cliente-B": 0.30, "Sucursal-Norte": 0.20}
    muestra = ["Sucursal-Sur"] * 70 + ["Sucursal-Centro"] * 20 + ["Oficina-Este"] * 10
    c = Counter(muestra)
    n = sum(c.values())
    share = {k: c[k] / n for k in pob}
    print({k: round(share[k], 3) for k in pob})
    print("max_abs_bias_pp", round(max(abs(share[k] - pob[k]) for k in pob), 3))
    print("cobertura", "LIMITADA" if max(abs(share[k] - pob[k]) for k in pob) > 0.1 else "OK")

s18_ido_3()`,
 output: `{'Oficina-Oeste': 0.7, 'Cliente-A': 0.2, 'Cliente-B': 0.1}
max_abs_bias_pp 0.2
cobertura LIMITADA`,
 },
 why: "El sesgo de cuota se mide en puntos porcentuales, no solo con “se ve bien”.",
 },
 {
 demoId: "S18-T2-B-DEMO",
 subtopicId: "S18-T2-B",
 environment: "local-python",
 description: "Reportar IC 95% z, bootstrap de la diferencia y Cohen's d entre dos grupos sintéticos",
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
 why: "Magnitud + IC z + bootstrap + n comunican incertidumbre mejor que un solo p-value o un 'probado al 95%'.",
 },
 {
 demoId: "S18-T3-A-DEMO",
 subtopicId: "S18-T3-A",
 environment: "local-python",
 description: "Correlación alta por confusor, caída al residualizar, y Spearman monótono de control",
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
 why: "r alto no implica causa; residualizar confusores y reportar Spearman monótono refuerzan el hábito de asociación observada.",
 },
 {
 demoId: "S18-T3-B-DEMO",
 subtopicId: "S18-T3-B",
 environment: "local-python",
 description: "Segmentar por región y marcar anomalías Tukey sin claim causal",
 code: {
 language: 'python',
 title: "demo_segments.py",
 code: `def s18_ido_6():
    import pandas as pd

    df = pd.DataFrame({
     "region": ["Sucursal-Norte"]*8 + ["Sucursal-Sur"]*6 + ["Sucursal-Centro"]*6,
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
{'sum': {'Oficina-Este': 1, 'Oficina-Oeste': 1, 'Cliente-A': 0}, 'mean': {'Cliente-B': 0.167, 'Sucursal-Norte': 0.167, 'Sucursal-Sur': 0.0}}
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
 code: `def s18_ido_7():
    evidencia = {
     "pregunta": "¿Hay diferencia de ticket mediano Sucursal-Centro vs Oficina-Este?",
     "hipotesis": "mediana_Lima > mediana_Cusco en canal web junio",
     "calculo": "median por region, n>=30",
     "resultado": {"Oficina-Oeste": 28.0, "Cliente-A": 22.5, "n_Lima": 40, "n_Cusco": 32},
     "incertidumbre": "IC z aproximado; bootstrap si colas pesadas; muestra web-only",
     "decision": None,
    }
    print(evidencia["pregunta"])
    print("hallazgo", evidencia["resultado"])
    print("decision_es_none", evidencia["decision"] is None)

s18_ido_7()`,
 output: `¿Hay diferencia de ticket mediano Cliente-B vs Sucursal-Norte?
hallazgo {'Sucursal-Sur': 28.0, 'Sucursal-Centro': 22.5, 'n_Lima': 40, 'n_Cusco': 32}
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
 code: `def s18_ido_8():
    import hashlib, json
    import pandas as pd

    df = pd.DataFrame({
     "ticket_id": [f"T{i:03d}" for i in range(1, 6)],
     "monto": [10.0, 12.0, 0.0, 15.0, 11.0],
     "region": ["Oficina-Este", "Oficina-Oeste", "Cliente-A", "Cliente-B", "Sucursal-Norte"],
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
 output: `{"origen": "sintetico", "n_raw": 5, "n_final": 4, "filtros": ["monto > 0"], "seed": 18, "sha1_8": "71094efb"}
median_final 11.5`,
 },
 why: "Data notes hacen auditable el notebook del portfolio.",
 }
 ],
 },
 weDo: {
 intro: "Practica 24 ejercicios en liberación gradual (guiado → independiente → transferencia): centro/robustez, sesgo, IC y bootstrap, Pearson/Spearman sin causalidad, Tukey sin fraude, Q→H→E y data notes. Cada bug o scaffold del starter es un hábito del portfolio CP-N2-B; no copies la solución antes de ejecutar.",
 steps: [
 {
 id: "S18-T1-A-E1",
 subtopicId: "S18-T1-A",
 kind: "guided",
 instruction:
 "E1 (guiado) — Con el array sintético de montos del starter (`CASO-LIM-018` / `S18-T1-A-E1`), corrige el bug indicado en el starter: reporta **n**, **mean** (2 decimales) y **median** con esas etiquetas. No inventes datos ni dejes un print suelto de control. Compara con la solución solo después de ejecutar.",
 hint: "Usa .size (o len); mean y median del array.",
 hints: [
 "Usa .size (o len); mean y median del array.",
 "round(float(...), 2) para la media.",
 ],
 edgeCases: ["lista vacía", "todos iguales"],
 tests: "salida coincide con solution output",
 feedback: "¿Imprimiste n, mean y median? Con outliers, mean y median suelen diferir.",
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
 instruction:
 "E2 (independiente) — El starter de `S18-T1-A-E2` calcula “cuartiles” con los percentiles equivocados. Corrige el bug indicado en el starter para reportar **Q1**, **Q3** e **IQR** (2 decimales) del array sintético. No uses colas p10/p90 como si fueran Q1/Q3.",
 hint: "Cuartiles clásicos: 0.25 y 0.75.",
 hints: [
 "Cuartiles clásicos: 0.25 y 0.75.",
 "IQR = Q3 − Q1.",
 ],
 edgeCases: ["n=1", "empates en cuantiles"],
 tests: "salida coincide con solution output",
 feedback: "Q1/Q3 son p25/p75; IQR = Q3 − Q1. Revisa los argumentos de quantile.",
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
 instruction:
 "E3 (transferencia) — Diseña un resumen reutilizable para el portfolio (`S18-T1-A-E3`): la función `resumen` debe devolver un dict con **n**, **mean**, **median** y **std muestral** (`ddof=1`), valores numéricos redondeados a 4 decimales. Completa el cuerpo y prueba con la lista sintética del starter.",
 hint: "std muestral: ddof=1; no olvides median.",
 hints: [
 "std muestral: ddof=1; no olvides median.",
 "Claves del dict: n, mean, median, std.",
 ],
 edgeCases: ["array vacío debe fallar o manejarse"],
 tests: "salida coincide con solution output",
 feedback: "¿Incluiste median y usaste ddof=1? La std poblacional (ddof=0) no es el contrato de muestra.",
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
 instruction:
 "E1 (guiado) — Con montos sintéticos del starter (`S18-T1-B-E1`), imprime **mean**, **median** y la **ratio mean/median** (2 decimales). El bug indicado en el starter invierte la razón: corrígelo. Un ratio ≫ 1 avisa cola pesada.",
 hint: "ratio = mean / median (no al revés).",
 hints: [
 "ratio = mean / median (no al revés).",
 "Redondea mean y ratio a 2 decimales.",
 ],
 edgeCases: ["median 0"],
 tests: "salida coincide con solution output",
 feedback: "La razón correcta es mean/median. Si la invertiste, el outlier “achica” el aviso en vez de ampliarlo.",
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
 instruction:
 "E2 (independiente) — Calcula el **MAD** (mediana de las desviaciones absolutas respecto a la mediana) del array sintético en `S18-T1-B-E2`. El starter usa media en ambos pasos: corrige el bug indicado en el starter e imprime `MAD` con el valor correcto.",
 hint: "Ancla = mediana; dispersión = mediana de |x − ancla|.",
 hints: [
 "Ancla = mediana; dispersión = mediana de |x − ancla|.",
 "No uses mean para el MAD de este contrato.",
 ],
 edgeCases: ["todos iguales → MAD 0"],
 tests: "salida coincide con solution output",
 feedback: "MAD usa mediana dos veces: de x y de |x − mediana|. Mean abs dev es otro estadístico.",
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
 instruction:
 "E3 (transferencia) — En el portfolio CP-N2-B a veces necesitas EDA en escala log con montos ≥0 que incluyen ceros (`S18-T1-B-E3`). Completa el starter: transforma el array sintético con la función segura para ceros e imprime la lista redondeada a **3 decimales**. En el memo, si usas log, dilo en el eje y en la conclusión; no compares diferencias log como soles PEN.",
 hint: "Para montos ≥0 con ceros, usa log1p (log(1+x)), no log crudo.",
 hints: [
 "Para montos ≥0 con ceros, usa log1p (log(1+x)), no log crudo.",
 "Lista con round por elemento a 3 decimales.",
 ],
 edgeCases: ["negativos no válidos en log1p de montos"],
 tests: "salida coincide con solution output",
 feedback: "log(0) es −inf. Para montos ≥0 usa log1p y declara la escala en la narrativa.",
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
 instruction:
 "E1 (guiado) — En la muestra sintética de `S18-T2-A-E1`, calcula la **proporción de Sucursal-Sur** y imprímela como `share_Lima` (2 decimales). El bug indicado en el starter cuenta la región equivocada.",
 hint: "share = conteo de la región / n de la muestra.",
 hints: [
 "share = conteo de la región / n de la muestra.",
 "Redondea a 2 decimales.",
 ],
 edgeCases: ["muestra vacía"],
 tests: "salida coincide con solution output",
 feedback: "¿Contaste Sucursal-Centro o otra región? share_Lima = count(Oficina-Este) / n.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · sample share
# Bug a corregir: cuenta Oficina-Oeste no Cliente-A
muestra = ["Cliente-B", "Sucursal-Norte", "Sucursal-Sur", "Sucursal-Centro"]
share_lima = muestra.count("Oficina-Este") / len(muestra)
print("share_Lima", round(share_lima, 2))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `muestra = ["Oficina-Oeste", "Cliente-A", "Cliente-B", "Sucursal-Norte"]
share_lima = muestra.count("Sucursal-Sur") / len(muestra)
print("share_Lima", round(share_lima, 2))`,
 output: `share_Lima 0.75`,
 },
 },
 {
 id: "S18-T2-A-E2",
 subtopicId: "S18-T2-A",
 kind: "independent",
 instruction:
 "E2 (independiente) — El sesgo en puntos porcentuales es **share_muestra − share_población**. En `S18-T2-A-E2` el starter invierte la resta: corrige el signo e imprime `bias_Lima_pp` (2 decimales) con los valores del starter.",
 hint: "bias_pp = share − pob (no al revés).",
 hints: [
 "bias_pp = share − pob (no al revés).",
 "Redondea a 2 decimales.",
 ],
 edgeCases: ["regiones faltantes en muestra"],
 tests: "salida coincide con solution output",
 feedback: "Si share > pob, el bias de sobremuestreo debe ser positivo. Revisa el orden de la resta.",
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
 instruction:
 "E3 (transferencia) — Para el data note de cobertura del portfolio, implementa `max_bias(pob, counts)` que devuelve el **peor** |bias_pp| = |count/n − share_pob| entre regiones (`S18-T2-A-E3`). Completa el cuerpo de la función y prueba con el fixture ya escrito: imprime el resultado redondeado a **2 decimales**. Ese número decide si marcas cobertura LIMITADA.",
 hint: "Por cada región en pob: |counts[k]/n − pob[k]|; devuelve el máximo de esos absolutos.",
 hints: [
 "Por cada región en pob: |counts[k]/n − pob[k]|; devuelve el máximo de esos absolutos.",
 "n = suma de counts; no uses el mínimo (el riesgo es el peor sesgo).",
 ],
 edgeCases: ["keys faltantes"],
 tests: "salida coincide con solution output",
 feedback: "Cobertura LIMITADA se decide con el máximo |bias|, no con el mínimo. Revisa el agregador.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · max_bias de cobertura (transferencia)
def max_bias(pob, counts):
 n = sum(counts.values())
 # Completa: peor |count/n − pob| entre claves de pob
 raise NotImplementedError

print(round(max_bias({"Sucursal-Centro": 0.5, "Oficina-Este": 0.5}, {"Oficina-Oeste": 9, "Cliente-A": 1}), 2))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `def max_bias(pob, counts):
 n = sum(counts.values())
 return max(abs(counts[k] / n - pob[k]) for k in pob)

print(round(max_bias({"Cliente-B": 0.5, "Sucursal-Norte": 0.5}, {"Sucursal-Sur": 9, "Sucursal-Centro": 1}), 2))`,
 output: `0.4`,
 },
 },
 {
 id: "S18-T2-B-E1",
 subtopicId: "S18-T2-B",
 kind: "guided",
 instruction:
 "E1 (guiado) — Con media, s y n del starter (`S18-T2-B-E1`), calcula el **margen** del IC 95% aproximado: z·(s/√n) con z≈1.96. Imprime `margen` a 3 decimales. El bug indicado en el starter olvida dividir por √n.",
 hint: "margen = 1.96 * s / sqrt(n).",
 hints: [
 "margen = 1.96 * s / sqrt(n).",
 "import math o numpy para la raíz.",
 ],
 edgeCases: ["n=0"],
 tests: "salida coincide con solution output",
 feedback: "Sin /√n el margen no es un error estándar. El IC es media ± margen, no media ± 1.96·s.",
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
 instruction:
 "E2 (independiente) — Cohen's d compara **media del grupo B menos media del grupo A**, dividido por la desviación pooled del starter (`S18-T2-B-E2`). El starter invierte el orden de las medias: corrígelo e imprime `d` a 2 decimales. Interpreta d como magnitud, no como “probado”.",
 hint: "d = (media_B − media_A) / s_pooled con los números del starter.",
 hints: [
 "d = (media_B − media_A) / s_pooled con los números del starter.",
 "Redondea a 2 decimales; etiqueta `d`.",
 ],
 edgeCases: ["sp=0"],
 tests: "salida coincide con solution output",
 feedback: "Si inviertes A y B, el signo de d se voltea. El contrato usa B − A.",
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
 instruction:
 "E3 (transferencia) — Con montos sintéticos de cola pesada (`S18-T2-B-E3`), implementa un **bootstrap simple** de la media: remuestrea con reemplazo `B` veces (seed y `B` ya fijos en el starter), toma los percentiles 2.5 y 97.5 de esas medias e imprime `boot_ic95` como tupla a 2 decimales, más `n` y la nota `bootstrap_simple`. No uses la fórmula z·s/√n aquí: el punto es practicar remuestreo cuando la aproximación normal es dudosa. El IC describe incertidumbre del estimador, no el rango donde cae el 95% de los tickets.",
 hint: "Para i en range(B): rng.choice(x, size=len(x), replace=True).mean(); luego np.quantile(..., [0.025, 0.975]).",
 hints: [
 "Para i en range(B): rng.choice(x, size=len(x), replace=True).mean(); luego np.quantile(..., [0.025, 0.975]).",
 "No reinicies el Generator dentro del bucle; usa el rng del starter.",
 ],
 edgeCases: ["B=1 inútil", "x vacío"],
 tests: "salida coincide con solution output",
 feedback: "Bootstrap = remuestrear con reemplazo y percentiles de la estadística. No es z·s/√n ni el rango del 95% de los datos crudos.",
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
 instruction:
 "E1 (guiado) — Calcula la correlación de **Pearson entre x e y** del starter (`S18-T3-A-E1`) e imprime `r` a 3 decimales. El bug indicado en el starter correlaciona un vector consigo mismo.",
 hint: "corrcoef(x, y)[0, 1], no corrcoef(y, y).",
 hints: [
 "corrcoef(x, y)[0, 1], no corrcoef(y, y).",
 "Redondea a 3 decimales.",
 ],
 edgeCases: ["constante en x → nan"],
 tests: "salida coincide con solution output",
 feedback: "corrcoef(y, y) siempre da 1. Necesitas la asociación entre las dos series.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · corrcoef
# Bug a corregir: r de y vs y no x vs y
import numpy as np
x = np.array([1, 2, 3, 4], dtype=float)
y = np.array([2, 4, 6, 8], dtype=float)
print("r", round(float(np.corrcoef(y, y)[0, 1]), 3))`,
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
 "E2 (independiente) — Calcula **Spearman** (correlación de rangos) entre los arrays sintéticos de `S18-T3-A-E2`: convierte cada serie a rangos y aplica Pearson sobre esos rangos; imprime `spearman` a 3 decimales. El bug del starter reporta Pearson en la escala original (útil, pero no es Spearman). Spearman resume asociación monótona; sigue siendo asociación observada, no causa.",
 hint: "Rangos estables: np.argsort(np.argsort(serie)); luego corrcoef de los dos vectores de rangos.",
 hints: [
 "Rangos estables: np.argsort(np.argsort(serie)); luego corrcoef de los dos vectores de rangos.",
 "Redondea a 3 decimales; etiqueta exacta spearman.",
 ],
 edgeCases: ["empates en rangos (aquí no hay)"],
 tests: "salida coincide con solution output",
 feedback: "Spearman = Pearson sobre rangos. Si usaste corrcoef(x, y) crudo, obtienes Pearson, no Spearman.",
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
 instruction:
 "E3 (transferencia) — Un confusor Z genera X e Y en el starter (`S18-T3-A-E3`, seed fija). Reporta **r_raw** (Pearson X–Y), **r_residual** tras residualizar X e Y respecto a Z (`polyfit` grado 1) y la etiqueta `claim asociacion_observada_no_causal`. Completa el bloque de residuales: el punto es ver r alto que cae al controlar Z (no uses colinealidad perfecta).",
 hint: "Residualiza con polyfit(z, serie, 1); corrcoef de residuales; redondea a 3 decimales.",
 hints: [
 "Residualiza con polyfit(z, serie, 1); corrcoef de residuales; redondea a 3 decimales.",
 "Misma seed y coeficientes del starter; no regeneres datos distintos.",
 ],
 edgeCases: ["ruido cero → residuales ~0; aquí hay ruido intencional"],
 tests: "salida coincide con solution output",
 feedback: "r alto con confusor no prueba causa. Residualiza Z y reporta r_residual + claim no causal.",
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
 instruction:
 "E1 (guiado) — Cuenta cuántos montos superan la cerca superior de Tukey en el array sintético (`S18-T3-B-E1`): hi = Q3 + 1.5·IQR. Imprime `n_hi`. El bug indicado en el starter usa un multiplicador incorrecto. Flag ≠ fraude.",
 hint: "Multiplicador Tukey clásico: 1.5 sobre el IQR.",
 hints: [
 "Multiplicador Tukey clásico: 1.5 sobre el IQR.",
 "n_hi = cantidad de valores > hi.",
 ],
 edgeCases: ["sin outliers"],
 tests: "salida coincide con solution output",
 feedback: "Tukey usa 1.5·IQR, no 0.5. Los flags son candidatos a revisión, no fraude.",
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
 instruction:
 "E2 (independiente) — Calcula la **tasa de flags en Oficina-Este** (no la tasa global) con los arrays sintéticos de `S18-T3-B-E2`. Imprime `tasa_Lima`. Una tasa alta es hallazgo descriptivo, no prueba de causa regional.",
 hint: "Filtra flags donde region == \"Oficina-Oeste\" y toma la media.",
 hints: [
 "Filtra flags donde region == \"Cliente-A\" y toma la media.",
 "No uses flag.mean() global si el contrato pide Cliente-B.",
 ],
 edgeCases: ["segmento vacío"],
 tests: "salida coincide con solution output",
 feedback: "La tasa global mezcla regiones. Enmascara con region == \"Sucursal-Norte\" antes del mean.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · tasa por región
# Bug a corregir: tasa global no Sucursal-Sur
import numpy as np
region = np.array(["Sucursal-Centro", "Oficina-Este", "Oficina-Oeste"])
flag = np.array([True, True, False])
print("tasa_Lima", float(flag.mean()))`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `import numpy as np
region = np.array(["Cliente-A", "Cliente-B", "Sucursal-Norte"])
flag = np.array([True, True, False])
print("tasa_Lima", float(flag[region == "Sucursal-Sur"].mean()))`,
 output: `tasa_Lima 1.0`,
 },
 },
 {
 id: "S18-T3-B-E3",
 subtopicId: "S18-T3-B",
 kind: "transfer",
 instruction:
 "E3 (transferencia) — Para el portfolio, marca anomalías univariadas con **Tukey bilateral**: fuera de [Q1−1.5·IQR, Q3+1.5·IQR] en el array sintético de `S18-T3-B-E3`. El starter ya calcula lo/hi; completa la máscara booleana e imprímela como **lista**. Documenta en el memo que flag ≠ fraude ni culpa de región.",
 hint: "flag = (m < lo) | (m > hi); luego .tolist().",
 hints: [
 "flag = (m < lo) | (m > hi); luego .tolist().",
 "Ambas cercas: no basta con m > hi.",
 ],
 edgeCases: ["IQR 0"],
 tests: "salida coincide con solution output",
 feedback: "Tukey es bilateral. Si solo usas m > hi, pierdes outliers bajos. Flags son candidatos a revisión.",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · máscara Tukey bilateral (transferencia)
import numpy as np
m = np.array([1, 2, 3, 4, 100], dtype=float)
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
 "E1 (guiado) — La plantilla Q→H→E del starter (`S18-T4-A-E1`) guarda pregunta, hipótesis y resultado. Imprime solo el valor de la clave **pregunta** (el texto de negocio). El bug indicado en el starter imprime la hipótesis.",
 hint: "Accede a evidencia[\"pregunta\"], no a \"hipotesis\".",
 hints: [
 "Accede a evidencia[\"pregunta\"], no a \"hipotesis\".",
 "No reescribas el dict; solo el print.",
 ],
 edgeCases: ["claves faltantes"],
 tests: "salida coincide con solution output",
 feedback: "Pregunta e hipótesis son capas distintas. El print de traza de pregunta usa la clave pregunta.",
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
 instruction:
 "E2 (independiente) — Separa hallazgo de decisión: con la mediana sintética del starter (`S18-T4-A-E2`), imprime `solo_hallazgo` si median < 15; si no, `candidato_decision`. El starter usa el operador de comparación al revés: corrígelo. No inventes campañas ni bloqueos.",
 hint: "solo_hallazgo cuando median está por debajo del umbral 15.",
 hints: [
 "solo_hallazgo cuando median está por debajo del umbral 15.",
 "Candidato a decisión ≠ decisión automática.",
 ],
 edgeCases: ["igualdad al umbral"],
 tests: "salida coincide con solution output",
 feedback: "Revisa el operador de comparación. Hallazgo no es lanzar campaña; solo etiqueta el nivel de la mediana.",
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
 instruction:
 "E3 (transferencia) — Implementa la traza **P→M→V→L** del portfolio CP-N2-B (`S18-T4-A-E3`): pregunta, métrica, valor y **límite de cobertura**. Completa la función con prints `P:`, `M:`, `V:`, `L:` y no cambies la llamada de prueba. Sin L el hallazgo no es auditable.",
 hint: "Cuatro prints con prefijos P/M/V/L; el cuarto usa el parámetro limite.",
 hints: [
 "Cuatro prints con prefijos P/M/V/L; el cuarto usa el parámetro limite.",
 "No cambies los argumentos de la llamada de prueba.",
 ],
 edgeCases: ["None en valor"],
 tests: "salida coincide con solution output",
 feedback: "Sin límite de cobertura (L) el hallazgo no es auditable. Añade print(\"L:\", limite).",
 starterCode: {
 language: 'python',
 title: "exercise.py",
 code: `# CASO-LIM-018 · traza P→M→V→L (transferencia)
def traza(pregunta, metrica, valor, limite):
 # Completa: imprime P, M, V y L con esos prefijos
 pass

traza("ticket mediano Sucursal-Centro", "median", 27.5, "solo web")`,
 },
 solutionCode: {
 language: 'python',
 title: "exercise.py",
 code: `def traza(pregunta, metrica, valor, limite):
 print("P:", pregunta)
 print("M:", metrica)
 print("V:", valor)
 print("L:", limite)

traza("ticket mediano Oficina-Este", "median", 27.5, "solo web")`,
 output: `P: ticket mediano Oficina-Oeste
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
 "E1 (guiado) — Completa el **data note** mínimo del starter (`S18-T4-B-E1`): dict con `n_raw`, `n_final` y `filtros` (lista). Valores sintéticos de práctica: 5 filas crudas, 4 tras filtro `monto>0`. Imprime el dict. El bug indicado en el starter deja el note vacío.",
 hint: "Claves: n_raw, n_final, filtros (lista de strings).",
 hints: [
 "Claves: n_raw, n_final, filtros (lista de strings).",
 "n_final ≤ n_raw siempre.",
 ],
 edgeCases: ["n_final > n_raw inválido"],
 tests: "salida coincide con solution output",
 feedback: "Un data note vacío no es auditable. Incluye n_raw, n_final y la lista de filtros.",
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
 instruction:
 "E2 (independiente) — Calcula la huella **SHA-1 en hex** de los bytes del CSV sintético del starter (`S18-T4-B-E2`: cabecera `a,b` y fila `1,2`, cada línea terminada en salto de línea real) y muestra solo los **primeros 8** caracteres hex. El bug indicado en el starter usa md5 y el digest completo: corrígelo a sha1 recortado. No uses md5 ni el digest completo.",
 hint: "Arma el payload con newlines reales (p. ej. uniendo líneas con chr(10)); sha1(...).hexdigest()[:8].",
 hints: [
 "Arma el payload con newlines reales (p. ej. uniendo líneas con chr(10)); sha1(...).hexdigest()[:8].",
 "Algoritmo sha1, no md5; recorta a 8 caracteres.",
 ],
 edgeCases: ["orden de filas cambia hash"],
 tests: "salida coincide con solution output",
 feedback: "Debe ser SHA-1, no MD5, y solo 8 hex chars. Los bytes deben incluir newlines reales tras cada línea del CSV.",
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
 instruction:
 "E3 (transferencia) — Cierra el hilo hacia S19: con el DataFrame sintético de `S18-T4-B-E3`, filtra `monto > 0` y arma un data note con **n_raw** (antes del filtro), **n_final** (después) y **seed: 42**. Completa el dict e imprímelo — base de trazabilidad del portfolio.",
 hint: "n_raw = len(df) antes del filtro; n_final = len(df2); incluye seed: 42.",
 hints: [
 "n_raw = len(df) antes del filtro; n_final = len(df2); incluye seed: 42.",
 "No iguales n_final a n_raw si el filtro elimina filas.",
 ],
 edgeCases: ["todo filtrado"],
 tests: "salida coincide con solution output",
 feedback: "n_final debe reflejar el filtro. Sin seed el notebook no es reproducible entre personas.",
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
 "Eres analista en un equipo de insights en Cliente-A. En **S17** dejaste un dataset limpio y un memo de límites (CP-N2-A). Aquí abres **CP-N2-B**: sobre un extracto sintético de tickets (sin PII real) produces un EDA que distingue hallazgo, hipótesis y decisión, con incertidumbre explícita y data notes. El artefacto alimenta el dashboard accesible de S19.",
 objectives: [
 "Resumir distribuciones con n, centro, dispersión y cuantiles (y métrica robusta si hay cola)",
 "Diagnosticar sesgo muestral vs cuotas y declarar cobertura LIMITADA/OK",
 "Reportar al menos un IC (z y/o bootstrap documentado) o tamaño de efecto (p. ej. Cohen's d) con n",
 "Interpretar correlación/Spearman o segmentos sin claims causales; flags Tukey ≠ fraude",
 "Entregar script/notebook con data notes, seed y huella de filas listo para S19",
 ],
 requirements: [
 "Solo datos sintéticos o anonimizados de práctica (sin PII real)",
 "Cada conclusión referencia un cálculo (n, métrica, IC/flag o código) y un límite de cobertura",
 "Data note con origen, filtros, n_raw/n_final, seed y hash corto del CSV ordenado",
 "Sin secretos ni credenciales",
 "Español profesional (es-PE)",
 "Salida mínima auditable: (1) resumen tabular, (2) bias_pp + cobertura, (3) ic95_z o boot_ic95 o d + n, (4) claim no-causal, (5) data note JSON",
 "Si usas z sobre montos lognormales, declara el límite; si hay colas, documenta bootstrap",
 ],
 starterCode: `import hashlib
import json
from collections import Counter
import numpy as np
import pandas as pd

# Portfolio CP-N2-B (inicio) · CASO-LIM-018 · solo sintéticos
# Hilo S17 → S18 → S19: reutiliza filtros documentados; añade incertidumbre y data notes.

rng = np.random.default_rng(18)
df_raw = pd.DataFrame({
    "ticket_id": [f"T{i:03d}" for i in range(1, 101)],
    "region": rng.choice(["Cliente-B", "Sucursal-Norte", "Sucursal-Sur"], size=100, p=[0.7, 0.2, 0.1]),
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
    # TODO: añade p90 si el negocio pregunta por cola
}
print("resumen", resumen)

# --- Checkpoint 3: sesgo muestral vs cuotas sintéticas ---
pob = {"Sucursal-Centro": 0.55, "Oficina-Este": 0.25, "Oficina-Oeste": 0.20}
counts = Counter(df["region"])
share = {k: counts.get(k, 0) / n_final for k in pob}
bias_pp = {k: round(share[k] - pob[k], 3) for k in pob}
max_abs = max(abs(v) for v in bias_pp.values())
cobertura = "LIMITADA" if max_abs > 0.1 else "OK"
print("bias_pp", bias_pp)
print("cobertura", cobertura)

# --- Checkpoint 4: IC z y/o bootstrap de la media (montos lognormales → declara límite) ---
# Esqueleto z (completa se e imprime ic95_z). Opcional: bootstrap B=200 como en T2-B.
m = float(df["monto"].mean())
s = float(df["monto"].std(ddof=1))
# se = s / np.sqrt(n_final)
# ic95_z = (round(m - 1.96 * se, 2), round(m + 1.96 * se, 2))
print("ic95_z", "TODO")
print("nota_ic", "z_approx_en_lognormal_limitada; preferir_bootstrap_si_colas")

# --- Checkpoint 5: asociación / segmentos sin claim causal ---
# Ejemplo: Pearson monto~visitas + etiqueta; o flags Tukey por región.
# r = float(np.corrcoef(df["monto"], df["visitas"])[0, 1])
print("claim", "asociacion_observada_no_causal")  # no borres esta etiqueta ética

# --- Checkpoint 6: data note reproducible (base hacia S19) ---
payload = df.sort_values("ticket_id").to_csv(index=False).encode()
note = {
    "origen": "sintetico_local",
    "n_raw": n_raw,
    "n_final": n_final,
    "filtros": ["monto > 0"],
    "seed": 18,
    "sha1_8": hashlib.sha1(payload).hexdigest()[:8],
    "limites": "muestra sintética sesgada a Cliente-A; no generalizar a todo el Perú",
    "etica": "flags_y_correlacion_no_son_fraude_ni_causa",
}
print(json.dumps(note, ensure_ascii=False))
print(df.head())
`,
 portfolioNote:
 "Artefacto de inicio CP-N2-B: EDA con incertidumbre y data notes; alimenta dashboard y reportes en S19–S21. Reutiliza el criterio de límites de S17.",
 rubric: [
 { criterion: "Cada hallazgo cita cálculo (n, métrica, IC o flag) y límite de cobertura", weight: "25%" },
 { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
 { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
 { criterion: "Pruebas o casos de borde documentados (cola, sesgo, z vs bootstrap)", weight: "15%" },
 { criterion: "Código legible y sin claims causales/fraude automático", weight: "10%" },
 { criterion: "Documentación en español profesional", weight: "10%" }
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
 question: "En un EDA de tickets sintéticos Cliente-B/Sucursal-Norte, ¿cuál es la comunicación correcta de un r de Pearson alto entre gasto y visitas cuando ambos crecen con el tamaño de la ciudad (confusor)?",
 options: ["Afirmar que más visitas causan más gasto y recomendar campaña automática", "Reportar asociación observada, explorar el confusor y evitar verbos causales sin diseño", "Eliminar la correlación del informe porque “no es causal” y no mostrar el número", "Usar solo la media y omitir n e intervalos para simplificar el slide ejecutivo"],
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
 question: "Una tasa de flags Tukey más alta en Sucursal-Sur implica:",
 options: ["Hallazgo descriptivo de anomalías univariadas; la decisión de investigación es humana", "Fraude demostrado en Sucursal-Centro", "Que la media es mejor que la mediana", "Que el IC es innecesario"],
 correctIndex: 0,
 explanation:
 "Anomalía ≠ culpa ni fraude automático. Documenta método, n y límites; la investigación es posterior y humana.",
 },
 {
 question: "Cohen's d ≈ 1.1 entre media de tickets del grupo B y del grupo A (con n reportado) comunica principalmente:",
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
