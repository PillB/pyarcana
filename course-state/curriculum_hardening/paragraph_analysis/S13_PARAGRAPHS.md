# S13 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T05:12:42.000+00:00
Section: Familiarity Evidence Dashboard y cierre de nivel
File: `s13-rpa-automation.ts`
STORM cycles: **13**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Python: [re](https://docs.python.org/3/library/re.html) — normalization
- Python: [json](https://docs.python.org/3/library/json.html) — case export
- Python: [sqlite3](https://docs.python.org/3/library/sqlite3.html) — local evidence store
- Python: [math](https://docs.python.org/3/library/math.html) — isfinite scores
- NIST: [800-63 digital identity](https://pages.nist.gov/800-63-3/) — identity vs proof
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course
- Coursera: [Python for Everybody](https://www.coursera.org/specializations/python) — strings data
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — logic tests
- GitHub: [PillB/pyarcana](https://github.com/PillB/pyarcana) — CP-N1-C delivery
- GitHub: [Awesome Python Learning](https://github.com/skupriienko/Awesome-Python-Learning) — learning map
- Python: [statistics](https://docs.python.org/3/library/statistics.html) — batch aggregates
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — python practice
- GitHub: [python-for-everybody-resources](https://github.com/sersavn/python-for-everybody-resources) — exercises

## Gold pass
| Area | Decision |
|------|----------|
| theory | hand deepen + strip theater |
| weDo | CASO DEFECT |
| git | NO restore (WT DEFECT>HEAD) |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### De “RPA & automatización” al Familiarity Evidence Dashboard (mapa)
**P1** (rank 9.55/10)
> En V3, **S13 no es el path principal de Playwright, Ollama, OCR ni Prefect**. Ese material se reubica al tramo de automatización avanzada. Aquí cierras **CP-N1-…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/re.html; Python: https://docs.python.org/3/library/json.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “RPA & automatización” al Familiarity Evidenc» in S13_STORM.json.

**P2** (rank 9.55/10)
> Promoción de nivel: tres capstones N1, **regresión S01–S13 (level-1)** y **CF-1** aprobados. Solo datos sintéticos pseudonimizados (`C00x`, Lima/Arequipa). Si f…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/json.html; Python: https://docs.python.org/3/library/sqlite3.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “RPA & automatización” al Familiarity Evidenc» in S13_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Identidad (ER)** → **T2 Relación** → **T3 Decisión** → **T4 Producto/ops + CF-1**. Métrica del gate: dos scores visibles en ficha + cola clerical + …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/sqlite3.html; Python: https://docs.python.org/3/library/math.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «De “RPA & automatización” al Familiarity Evidenc» in S13_STORM.json.

### Normalización, blocking y entity resolution
**P1** (rank 9.55/10)
> Normaliza nombres y `document_id` (casefold, quitar espacios/guiones) **antes** de comparar. Sin normalización, `D-12.34` y `d1234` parecen identidades distinta…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/math.html; NIST: https://pages.nist.gov/800-63-3/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Normalización, blocking y entity resolution» in S13_STORM.json.

### Verdad etiquetada, precision/recall y revisión clerical
**P1** (rank 9.55/10)
> Con pares etiquetados **sintéticos** calculas **TP/FP/FN** y de ahí precision/recall simples. La etiqueta es ground truth de *identidad* en el fixture del curso…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NIST: https://pages.nist.gov/800-63-3/; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Verdad etiquetada, precision/recall y revisión c» in S13_STORM.json.

**P2** (rank 9.55/10)
> Scores en **banda de duda** van a **cola clerical** (humano), nunca a auto-merge silencioso. Define umbrales explícitos (p. ej. aceptar solo si score ≥ 0.8 y un…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Verdad etiquetada, precision/recall y revisión c» in S13_STORM.json.

**P3** (rank 9.55/10)
> Un **FP no implica fraude**: es error de matching de identidad (colisión estimada), no evidencia de delito. Caso sintético: tabla de 6 pares con TP/FP/FN conoci…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Verdad etiquetada, precision/recall y revisión c» in S13_STORM.json.

### Email/teléfono/dirección compartidos, distancia y apellidos
**P1** (rank 9.55/10)
> Señales de relación: mismo email/teléfono/dirección **normalizados**, distancia geo bajo umbral (S12), solapamiento de tokens de apellido (Jaccard). Cada señal …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; GitHub: https://github.com/PillB/pyarcana
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Email/teléfono/dirección compartidos, distancia » in S13_STORM.json.

**P2** (rank 9.55/10)
> Agrégalas en `relationship_signal_score` con **pesos documentados** (p. ej. 0.5/0.3/0.2). **No es veredicto de parentesco** ni de fraude: es un score de *famili…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** GitHub: https://github.com/PillB/pyarcana; GitHub: https://github.com/skupriienko/Awesome-Python-Learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Email/teléfono/dirección compartidos, distancia » in S13_STORM.json.

**P3** (rank 9.55/10)
> Cada señal debe listarse en la explicación de la ficha. Caso sintético: teléfono compartido + km bajo umbral 2 + Jaccard de apellidos → score ~0.84 y `kinship_v…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** GitHub: https://github.com/skupriienko/Awesome-Python-Learning; Python: https://docs.python.org/3/library/statistics.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Email/teléfono/dirección compartidos, distancia » in S13_STORM.json.

### Transacciones directas y contrapartes comunes
**P1** (rank 9.55/10)
> Transacciones directas A↔B y **contrapartes comunes** (A y C pagan a D) son evidencia de **relación operativa** en el grafo sintético — no de colusión, lavado n…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/statistics.html; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Transacciones directas y contrapartes comunes» in S13_STORM.json.

**P2** (rank 9.55/10)
> Modela un graphlet simple (lista de triples) y emite objetos de evidencia con `type` (`direct_tx`, `common_counterparty`) y traza (`n`, `shared`). Reutiliza el …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; GitHub: https://github.com/sersavn/python-for-everybody-resources
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Transacciones directas y contrapartes comunes» in S13_STORM.json.

**P3** (rank 9.55/10)
> Disclaimer obligatorio en UI y runbook: *common counterparty ≠ collusion claim*. Caso sintético: A↔B con 2 txs y A,C→D → lista de evidencias y `collusion_claim=…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** GitHub: https://github.com/sersavn/python-for-everybody-resources; Python: https://docs.python.org/3/library/re.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Transacciones directas y contrapartes comunes» in S13_STORM.json.

### Score de evidencia, incertidumbre y explicación
**P1** (rank 9.55/10)
> Agrega ER + señales de relación con pesos **explícitos** y produce `evidence_score`, banda de **incertidumbre** (`low`/`med`/`high`) y **bullets** legibles para…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/re.html; Python: https://docs.python.org/3/library/json.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Score de evidencia, incertidumbre y explicación» in S13_STORM.json.

**P2** (rank 9.55/10)
> Campos de auditoría: inputs usados, `missing` fields, `rules_version`. Fail-closed: campos obligatorios ausentes elevan uncertainty; no rellenes telefono invent…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/json.html; Python: https://docs.python.org/3/library/sqlite3.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Score de evidencia, incertidumbre y explicación» in S13_STORM.json.

### Umbral de revisión, abstención y no inferencia automática
**P1** (rank 9.55/10)
> Matriz **total y sin huecos**: score inválido/no finito o uncertainty desconocida → `invalid_input`; uncertainty `high` → `needs_review`; score bajo 0.40 → `abs…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/sqlite3.html; Python: https://docs.python.org/3/library/math.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Umbral de revisión, abstención y no inferencia a» in S13_STORM.json.

**P2** (rank 9.55/10)
> Human-in-the-loop: la acción operativa es de **datos** (revisar / aceptar / rechazar par), no veredicto legal ni KYC automático. Los límites 0.40 y 0.80 son exa…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/math.html; NIST: https://pages.nist.gov/800-63-3/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Umbral de revisión, abstención y no inferencia a» in S13_STORM.json.

**P3** (rank 9.55/10)
> Auditoría de código: grepea y elimina cualquier path que setee parentesco o fraude automático. Caso sintético: tabla de (score, uncertainty) → status + `auto_fr…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** NIST: https://pages.nist.gov/800-63-3/; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Umbral de revisión, abstención y no inferencia a» in S13_STORM.json.

### Dashboard/mapa pseudonimizado y ficha de caso
**P1** (rank 9.55/10)
> Scaffold de producto mínimo: dicts (o HTML estático) con puntos de mapa, coords sintéticas Lima/Arequipa y tooltips de geoseñal **trazable** (`geo_distance_km=……
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Coursera: https://www.coursera.org/specializations/python
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Dashboard/mapa pseudonimizado y ficha de caso» in S13_STORM.json.

**P2** (rank 9.55/10)
> **Pseudonimiza** nombres en vista (`A*** Q***`). La ficha muestra `entity_resolution_score` **y** `relationship_signal_score` en columnas separadas — si los mez…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Coursera: https://www.coursera.org/specializations/python; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Dashboard/mapa pseudonimizado y ficha de caso» in S13_STORM.json.

**P3** (rank 9.55/10)
> Tres casos sintéticos bastan para el gate de producto. Caso demo: CASE-1 A*** Q*** ER 0.92 REL 0.41; CASE-2 con REL más alto y ER medio — el revisor ve la tensi…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; GitHub: https://github.com/PillB/pyarcana
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Dashboard/mapa pseudonimizado y ficha de caso» in S13_STORM.json.

### Privacidad, acceso, pruebas, demo y runbook
**P1** (rank 9.55/10)
> **Privacy sheet**: clase de datos `synthetic_only`, retención local, sin egress de PII bancaria a geocoders públicos (política S12), roles `viewer`/`reviewer`. …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** GitHub: https://github.com/PillB/pyarcana; GitHub: https://github.com/skupriienko/Awesome-Python-Learning
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Privacidad, acceso, pruebas, demo y runbook» in S13_STORM.json.

**P2** (rank 9.55/10)
> **Tests green** de ER, señales y umbrales; **demo de un comando** (`python -m demo_n1_dashboard`); **runbook** con pasos de setup y playbook de incidente (token…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** GitHub: https://github.com/skupriienko/Awesome-Python-Learning; Python: https://docs.python.org/3/library/statistics.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Privacidad, acceso, pruebas, demo y runbook» in S13_STORM.json.

**P3** (rank 9.55/10)
> Artefactos **CF-1** + checklist de **regresión level-1 (S01–S13)** cierran el nivel. Esta lane **no** marca `section_passed` ni actualiza el ledger del estudian…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources; no theater boilerplate.
- **Sources:** Python: https://docs.python.org/3/library/statistics.html; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Privacidad, acceso, pruebas, demo y runbook» in S13_STORM.json.

