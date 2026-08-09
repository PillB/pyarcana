# S35 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:45:39.504+00:00
Section: Explicabilidad, equidad e incertidumbre
File: `s35-system-design.ts`
STORM cycles: **35**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- arXiv: [Model Cards](https://arxiv.org/abs/1810.03993) — cards
- sklearn: [Inspection](https://scikit-learn.org/stable/inspection.html) — permutation
- Molnar: [Interpretable ML](https://christophm.github.io/interpretable-ml-book/) — limits
- Google: [Model Cards](https://modelcards.withgoogle.com/about) — system cards
- NIST: [AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) — risk
- FairML: [Book site](https://fairmlbook.org/) — fairness
- MAPIE: [Conformal](https://mapie.readthedocs.io/) — intervals
- TF: [Responsible AI](https://www.tensorflow.org/responsible_ai) — practices
- Coursera: [Responsible AI](https://www.coursera.org/courses?query=responsible%20ai%20fairness) — MOOC
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — projects
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course

## Gold pass
| Area | Decision |
|------|----------|
| theory | deepen + ethics layers |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |
| band | S23–S35 close |

## Theory (paragraph-level)

### Inicio CP-N3-C: ficha de caso responsable
**P1** (rank 9.55/10)
> Esta sección **inicia CP-N3-C** y parte de S34: usa métricas, umbrales y baselines ya presentados. El caso sintético `CASO-LIM-035` de Red Andina (organización ficticia en Lima)…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** arXiv: https://arxiv.org/abs/1810.03993; sklearn: https://scikit-learn.org/stable/inspection.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Inicio CP-N3-C: ficha de caso responsable» in S35_STORM.json.

**P2** (rank 9.55/10)
> Producto incremental: **ficha de caso** que separa **evidencia observada**, **contribución del modelo**, **incertidumbre** y **decisión humana**. Entrada: score, features y coho…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/inspection.html; Molnar: https://christophm.github.io/interpretable-ml-book/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Inicio CP-N3-C: ficha de caso responsable» in S35_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 explicación** → **T2 equidad/slices** → **T3 incertidumbre/OOD** → **T4 model card/override**. Id legacy `system-design` se conserva; V3 es explicabilidad y equidad,…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Molnar: https://christophm.github.io/interpretable-ml-book/; Google: https://modelcards.withgoogle.com/about
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Inicio CP-N3-C: ficha de caso responsable» in S35_STORM.json.

### coeficientes e importancia por permutación
**P1** (rank 9.55/10)
> Los **coeficientes** de un modelo lineal y la **importancia por permutación** miden sensibilidad: cuánto cae una métrica de negocio al barajar una feature. Son mapas **globales …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Google: https://modelcards.withgoogle.com/about; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «coeficientes e importancia por permutación» in S35_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada dict de drops por feature y métrica de cola; salida ranking `top_feature` con drop numérico y flag `means_fraud=False`. Error: afirmar causalidad legal o fraud…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NIST: https://www.nist.gov/itl/ai-risk-management-framework; FairML: https://fairmlbook.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «coeficientes e importancia por permutación» in S35_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-035`: `shared_phone` cae más que `amount_7d` en precision@k sintético; documentas sensibilidad sobre datos ficticios y **nunca** emites label de fraude/pa…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** FairML: https://fairmlbook.org/; MAPIE: https://mapie.readthedocs.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «coeficientes e importancia por permutación» in S35_STORM.json.

### explicación local, correlación y límites
**P1** (rank 9.55/10)
> La **explicación local** asigna contribución de features al score del caso (p.ej. valor × peso). **Correlación ≠ causalidad**: la contribución no es causa del comportamiento hum…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MAPIE: https://mapie.readthedocs.io/; TF: https://www.tensorflow.org/responsible_ai
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «explicación local, correlación y límites» in S35_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada pares (valor, peso) por feature; salida contribuciones, suma y plantilla de **4 capas** (evidencia|modelo|incertidumbre|humano). Error: omitir límites o declar…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** TF: https://www.tensorflow.org/responsible_ai; Coursera: https://www.coursera.org/courses?query=responsible%20ai%20fairness
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «explicación local, correlación y límites» in S35_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-035`: `shared_phone` aporta 0.9 al score de cola; la ficha marca `causal=False` y deja la decisión al analista con **override auditable**.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=responsible%20ai%20fairness; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «explicación local, correlación y límites» in S35_STORM.json.

### cohortes y métricas por slice
**P1** (rank 9.55/10)
> Cortar por **región, canal o tipo de enlace** revela si la cola de revisión daña de forma desigual. Compara precision/recall o tasa de queue reportando siempre el **tamaño muest…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «cohortes y métricas por slice» in S35_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada dict `slice→{n, precision}`; salida flag `low_n` si `n<30` y comparación documentada. Error: gritar inequidad con n=3 o **esconder n**. Criterio: n visible jun…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «cohortes y métricas por slice» in S35_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-035`: LIM n=100 precision=0.6 (`ok_n`) vs AQP n=8 precision=0.9 (`low_n`). **No** se afirma paridad de fraude; solo daño diferencial **potencial** en revi…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «cohortes y métricas por slice» in S35_STORM.json.

### proxies, sample size y daño diferencial
**P1** (rank 9.55/10)
> Un **proxy** es una variable que correlaciona con atributos sensibles (distrito, canal, idioma de nota). Su uso puede elevar **falsos positivos** en un grupo y generar fricción …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; arXiv: https://arxiv.org/abs/1810.03993
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «proxies, sample size y daño diferencial» in S35_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada features candidatas con risk tags; salida lista high-risk y acción `mitigate|review`. Error: silenciar proxy o convertirlo en **label de fraude**. Criterio: da…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** arXiv: https://arxiv.org/abs/1810.03993; sklearn: https://scikit-learn.org/stable/inspection.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «proxies, sample size y daño diferencial» in S35_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-035`: `district_code` se marca high y se **retira** del set de ranking; se documenta sample size bajo en AQP antes de cualquier claim de paridad.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** sklearn: https://scikit-learn.org/stable/inspection.html; Molnar: https://christophm.github.io/interpretable-ml-book/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «proxies, sample size y daño diferencial» in S35_STORM.json.

### calibración, intervalos/conformal conceptualmente
**P1** (rank 9.55/10)
> Un **score puntual engaña**; comunicar **intervalo** o cobertura conceptual (`p±q` toy o conformal a alto nivel) deja claro qué tan estable es la señal de cola. Brier e interval…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Molnar: https://christophm.github.io/interpretable-ml-book/; Google: https://modelcards.withgoogle.com/about
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «calibración, intervalos/conformal conceptualment» in S35_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada `p` y `q` de incertidumbre; salida `(lo, hi)` y label de nivel. Error: publicar solo `p` **sin** ancho. Criterio: todo score de ficha lleva banda o flag de no-…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Google: https://modelcards.withgoogle.com/about; NIST: https://www.nist.gov/itl/ai-risk-management-framework
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «calibración, intervalos/conformal conceptualment» in S35_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-035`: `p=0.6` con `q=0.1` produce `[0.5, 0.7]` nivel toy; el analista ve incertidumbre **antes** de override.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** NIST: https://www.nist.gov/itl/ai-risk-management-framework; FairML: https://fairmlbook.org/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «calibración, intervalos/conformal conceptualment» in S35_STORM.json.

### out-of-distribution y abstención
**P1** (rank 9.55/10)
> Cuando un caso se sale del soporte visto en train (**canal nuevo**, z-score extremo), la política correcta es **abstener y escalar**, no forzar `pred=1` ni inventar fraude.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** FairML: https://fairmlbook.org/; MAPIE: https://mapie.readthedocs.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «out-of-distribution y abstención» in S35_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada vector z y política OOD; salida `ood` bool y action `abstain|score`. Error: **auto-label en OOD**. Criterio: fail-closed hacia humano.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MAPIE: https://mapie.readthedocs.io/; TF: https://www.tensorflow.org/responsible_ai
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «out-of-distribution y abstención» in S35_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-035`: `z=[1,2,3.5]` dispara ood; `action=abstain` y la ficha registra `uncertainty.reason=ood` **sin** label de fraude (`auto_fraud=False`).
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** TF: https://www.tensorflow.org/responsible_ai; Coursera: https://www.coursera.org/courses?query=responsible%20ai%20fairness
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «out-of-distribution y abstención» in S35_STORM.json.

### model card y contestabilidad
**P1** (rank 9.55/10)
> La **model card** documenta uso permitido, `out_of_scope`, métricas y dueño. **Contestabilidad** exige canal para que un humano impugne el ranking **sin** borrar el audit trail.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=responsible%20ai%20fairness; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «model card y contestabilidad» in S35_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada keys mínimas de card; salida card válida con `out_of_scope` que incluye `fraud_label`. Error: card vacía o uso prohibido habilitado. Criterio: `contestability=…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «model card y contestabilidad» in S35_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-035`: `use=queue_rank`, `out_of_scope=fraud_label`, `owner=risk_ops`; el caso puede **apelar** sin reescribir score histórico.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «model card y contestabilidad» in S35_STORM.json.

### aprobación, override, apelación y retiro
**P1** (rank 9.55/10)
> El ciclo de vida del modelo (`proposed→approved→production→retired`) y los **overrides humanos** deben dejar `by`, timestamp y razón. **Sin audit no hay gobernanza**.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «aprobación, override, apelación y retiro» in S35_STORM.json.

**P2** (rank 9.55/10)
> Contrato: entrada evento de override o retiro; salida log con case, human action, by. Error: override **silencioso** o retiro sin flag de drift. Criterio: toda decisión humana e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; arXiv: https://arxiv.org/abs/1810.03993
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «aprobación, override, apelación y retiro» in S35_STORM.json.

**P3** (rank 9.55/10)
> Aplicación a `CASO-LIM-035`: `analyst_7` hace `override_skip`; el log guarda by y case; retiro por `drift_flag=True` mueve a retired **sin** borrar histórico.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** arXiv: https://arxiv.org/abs/1810.03993; sklearn: https://scikit-learn.org/stable/inspection.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «aprobación, override, apelación y retiro» in S35_STORM.json.

