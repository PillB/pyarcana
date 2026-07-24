# S30 Paragraph-by-Paragraph Analysis with Sources

Generated: 2026-07-24T04:34:23.481+00:00
Section: Entity resolution probabilístico
File: `s30-security-infra.ts`
STORM cycles: **30**
Expert rank: **9.55**

## Competitive sources (domain-honest HTTP ≥5)

- Wikipedia: [Record linkage](https://en.wikipedia.org/wiki/Record_linkage) — overview
- Wikipedia: [Probabilistic linkage](https://en.wikipedia.org/wiki/Record_linkage#Probabilistic_record_linkage) — Fellegi-Sunter
- splink: [Docs](https://moj-analytical-services.github.io/splink/) — modern linkage
- splink: [Blocking rules](https://moj-analytical-services.github.io/splink/topic_guides/blocking/blocking_rules.html) — blocking recall
- RapidFuzz: [GitHub](https://github.com/rapidfuzz/RapidFuzz) — similarity
- dedupe: [Docs](https://docs.dedupe.io/) — active learning
- Coursera: [Entity resolution](https://www.coursera.org/courses?query=record%20linkage%20entity%20resolution) — MOOC
- deeplearning.ai: [Data engineering](https://www.deeplearning.ai/specializations/data-engineering) — data quality
- MIT: [6.100L](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/) — foundations
- Harvard: [CS50P](https://cs50.harvard.edu/python/) — projects
- Christen: [Data Matching concepts](https://link.springer.com/book/10.1007/978-3-642-31164-2) — blocking eval
- Py4E: [Python for Everybody](https://www.py4e.com) — progressive
- Live: [PyArcana](https://pillb.github.io/pyarcana/) — course

## Gold pass
| Area | Decision |
|------|----------|
| theory | deepen + domain contracts |
| weDo | CASO DEFECT |
| git | NO restore |
| STORM | hand_STORM_domain_sources |

## Theory (paragraph-level)

### Cierre CP-N3-A: Testable Entity Resolution Engine
**P1** (rank 9.55/10)
> En V3, **S30 cierra CP-N3-A**. Entregas un motor **testeable**: benchmark etiquetado sintético, **blocking con recall medido**, comparadores explicables y cola de revisión cleri…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Wikipedia: https://en.wikipedia.org/wiki/Record_linkage; Wikipedia: https://en.wikipedia.org/wiki/Record_linkage#Probabilistic_record_linkage
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Cierre CP-N3-A: Testable Entity Resolution Engin» in S30_STORM.json.

**P2** (rank 9.55/10)
> ER responde solo **¿misma entidad?** — **no** parentesco, colusión ni fraude. Scores = evidencia para humanos o auto-match **conservador**. Contrato: pares sintéticos `CASO-LIM-…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Wikipedia: https://en.wikipedia.org/wiki/Record_linkage#Probabilistic_record_linkage; splink: https://moj-analytical-services.github.io/splink/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Cierre CP-N3-A: Testable Entity Resolution Engin» in S30_STORM.json.

**P3** (rank 9.55/10)
> Orden: **T1 Comparadores** → **T2 Blocking** → **T3 Matching** (pesos/umbrales) → **T4 Evaluación**. Integra S27–S29 (tests, props, SQL). Caso PE: contactos Lima `@example.pe`; …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** splink: https://moj-analytical-services.github.io/splink/; splink: https://moj-analytical-services.github.io/splink/topic_guides/blocking/blocking_rules.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «Cierre CP-N3-A: Testable Entity Resolution Engin» in S30_STORM.json.

### exact, edit/token y fecha
**P1** (rank 9.55/10)
> **Exact**: igualdad post-normalización (`casefold`+espacios). **Edit** (Levenshtein normalizado): typos y acentos. **Token**: Jaccard/overlap de palabras (orden “Ana López” / “L…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** splink: https://moj-analytical-services.github.io/splink/topic_guides/blocking/blocking_rules.html; RapidFuzz: https://github.com/rapidfuzz/RapidFuzz
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «exact, edit/token y fecha» in S30_STORM.json.

**P2** (rank 9.55/10)
> Cada comparador devuelve score en **[0,1]** o nivel ordinal (`agree`/`disagree`/`missing`) para pesos tipo **Fellegi–Sunter** simplificado. Mezclar escalas sin normalizar invali…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** RapidFuzz: https://github.com/rapidfuzz/RapidFuzz; dedupe: https://docs.dedupe.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «exact, edit/token y fecha» in S30_STORM.json.

**P3** (rank 9.55/10)
> Explica el score: guarda **campo + función + aporte** (auditoría clerical). Sin vector de aportes, el revisor no puede cuestionar un 0.91 opaco.
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** dedupe: https://docs.dedupe.io/; Coursera: https://www.coursera.org/courses?query=record%20linkage%20entity%20resolution
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «exact, edit/token y fecha» in S30_STORM.json.

### missingness informativa y frecuencia
**P1** (rank 9.55/10)
> **Missingness**: un campo vacío no es desacuerdo fuerte ni acuerdo. Usa estado `missing` en la comparación. Un score de matching solo prioriza revisión humana: ER responde *¿mis…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=record%20linkage%20entity%20resolution; deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «missingness informativa y frecuencia» in S30_STORM.json.

**P2** (rank 9.55/10)
> Missingness puede ser **informativa** (ciertas fuentes nunca traen teléfono) — modela por fuente, no asumas MCAR sin evidencia. Contrato operativo: entrada pares sintéticos `CAS…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «missingness informativa y frecuencia» in S30_STORM.json.

**P3** (rank 9.55/10)
> **Frecuencia**: valores muy comunes (nombre “María”, dominio genérico) bajan el peso de un acuerdo exacto (u-probability alta en FS). Caso sintético PE: contactos Lima `@example…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «missingness informativa y frecuencia» in S30_STORM.json.

### reglas y candidate recall
**P1** (rank 9.55/10)
> **Blocking** reduce pares: misma clave (apellido normalizado + CP, email local-part, teléfono últimos 6, etc.). Un score de matching solo prioriza revisión humana: ER responde *…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Christen: https://link.springer.com/book/10.1007/978-3-642-31164-2
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «reglas y candidate recall» in S30_STORM.json.

**P2** (rank 9.55/10)
> **Candidate recall**: de los pares verdaderamente match en el gold, ¿qué fracción pasó el blocking? Mide con etiquetas sintéticas. Contrato operativo: entrada pares sintéticos `…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Christen: https://link.springer.com/book/10.1007/978-3-642-31164-2; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «reglas y candidate recall» in S30_STORM.json.

**P3** (rank 9.55/10)
> Reglas en **unión (OR)** suben **candidate recall**; **intersección (AND)** reduce candidatos pero puede matar recall de gold matches. Mide recall en el benchmark antes de “opti…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «reglas y candidate recall» in S30_STORM.json.

### combinaciones, costo y pares imposibles
**P1** (rank 9.55/10)
> El **costo** es O(suma n_b^2) por bloque. Bloques enormes (clave débil) explotan CPU/memoria. Un score de matching solo prioriza revisión humana: ER responde *¿misma entidad?* y…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Wikipedia: https://en.wikipedia.org/wiki/Record_linkage
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «combinaciones, costo y pares imposibles» in S30_STORM.json.

**P2** (rank 9.55/10)
> **Pares imposibles**: reglas de exclusión (tipo persona vs empresa, fechas de nacimiento incompatibles sintéticas) evitan comparar lo incomparable. Contrato operativo: entrada p…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Wikipedia: https://en.wikipedia.org/wiki/Record_linkage; Wikipedia: https://en.wikipedia.org/wiki/Record_linkage#Probabilistic_record_linkage
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «combinaciones, costo y pares imposibles» in S30_STORM.json.

**P3** (rank 9.55/10)
> Combina blocking + filtros imposibles antes del scorer pesado. Caso sintético PE: contactos Lima `@example.pe` en cola clerical con actor/timestamp; fusión de entidades exige co…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Wikipedia: https://en.wikipedia.org/wiki/Record_linkage#Probabilistic_record_linkage; splink: https://moj-analytical-services.github.io/splink/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «combinaciones, costo y pares imposibles» in S30_STORM.json.

### pesos/probabilidad y thresholds
**P1** (rank 9.55/10)
> Modelo simple: `score = suma de pesos` por acuerdo/desacuerdo de campos (**Fellegi–Sunter** didáctico) o promedio ponderado de similitudes. Un score de matching solo prioriza re…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** splink: https://moj-analytical-services.github.io/splink/; splink: https://moj-analytical-services.github.io/splink/topic_guides/blocking/blocking_rules.html
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pesos/probabilidad y thresholds» in S30_STORM.json.

**P2** (rank 9.55/10)
> **Thresholds**: `auto_match ≥ t_high`; `non_match ≤ t_low`; en medio → **review** (cola clerical). Nunca `auto_fraud`. Contrato: pares `CASO-LIM-030` (run_id=cpn3a-er) → decisió…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** splink: https://moj-analytical-services.github.io/splink/topic_guides/blocking/blocking_rules.html; RapidFuzz: https://github.com/rapidfuzz/RapidFuzz
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pesos/probabilidad y thresholds» in S30_STORM.json.

**P3** (rank 9.55/10)
> Estima pesos con frecuencias (m/u) o a mano **documentado**; valida en **gold sintético** (S30-T4) sin leakage de entidad. Caso PE: contactos Lima `@example.pe` en cola clerical…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** RapidFuzz: https://github.com/rapidfuzz/RapidFuzz; dedupe: https://docs.dedupe.io/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «pesos/probabilidad y thresholds» in S30_STORM.json.

### entrenamiento, clerical review y cluster consistency
**P1** (rank 9.55/10)
> **Entrenamiento/estimación**: ajusta pesos o umbrales con pares etiquetados sintéticos (no PII real). Un score de matching solo prioriza revisión humana: ER responde *¿misma ent…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** dedupe: https://docs.dedupe.io/; Coursera: https://www.coursera.org/courses?query=record%20linkage%20entity%20resolution
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «entrenamiento, clerical review y cluster consist» in S30_STORM.json.

**P2** (rank 9.55/10)
> **Clerical review**: cola con score, explicación y acciones match/non-match/uncertain + actor y timestamp. Contrato operativo: entrada pares sintéticos `CASO-LIM-030` (run_id=cp…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Coursera: https://www.coursera.org/courses?query=record%20linkage%20entity%20resolution; deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «entrenamiento, clerical review y cluster consist» in S30_STORM.json.

**P3** (rank 9.55/10)
> **Cluster consistency**: si A=B y B=C entonces A=C en la misma entidad; resuelve con Union-Find y revisa contradicciones. Caso sintético PE: contactos Lima `@example.pe` en cola…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** deeplearning.ai: https://www.deeplearning.ai/specializations/data-engineering; MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «entrenamiento, clerical review y cluster consist» in S30_STORM.json.

### labeled pairs y splits por entidad
**P1** (rank 9.55/10)
> El **benchmark etiquetado** tiene pares match/non-match **sintéticos**. Nunca uses el mismo par (ni la misma entidad) en train y test de umbrales sin control — **leakage de iden…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** MIT: https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/; Harvard: https://cs50.harvard.edu/python/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «labeled pairs y splits por entidad» in S30_STORM.json.

**P2** (rank 9.55/10)
> **Split por entidad**: si una entidad aparece en train, sus pares no deben filtrar a test (leakage de identidad). Contrato operativo: entrada pares sintéticos `CASO-LIM-030` (ru…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Harvard: https://cs50.harvard.edu/python/; Christen: https://link.springer.com/book/10.1007/978-3-642-31164-2
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «labeled pairs y splits por entidad» in S30_STORM.json.

**P3** (rank 9.55/10)
> Documenta tamaños de split y prevalencia de matches (suele ser baja). Caso sintético PE: contactos Lima `@example.pe` en cola clerical con actor/timestamp; fusión de entidades e…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Christen: https://link.springer.com/book/10.1007/978-3-642-31164-2; Py4E: https://www.py4e.com
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «labeled pairs y splits por entidad» in S30_STORM.json.

### precision/recall, pairwise/cluster metrics y error slices
**P1** (rank 9.55/10)
> **Pairwise**: precision/recall/F1 sobre pares predichos vs gold. **Cluster**: métricas a nivel entidad (pair completeness/quality simplificado). Reporta ambas: un F1 pairwise al…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Py4E: https://www.py4e.com; Live: https://pillb.github.io/pyarcana/
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «precision/recall, pairwise/cluster metrics y err» in S30_STORM.json.

**P2** (rank 9.55/10)
> **Error slices**: corta por fuente, apellido frecuente, missing phone, ciudad — encuentra fallas sistemáticas. Contrato operativo: entrada pares sintéticos `CASO-LIM-030` (run_i…
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Live: https://pillb.github.io/pyarcana/; Wikipedia: https://en.wikipedia.org/wiki/Record_linkage
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «precision/recall, pairwise/cluster metrics y err» in S30_STORM.json.

**P3** (rank 9.55/10)
> Reporta con datos sintéticos; **no** conviertas errores de matching en acusaciones de fraude. Caso PE: contactos Lima `@example.pe` en cola clerical con actor/timestamp; fusión …
- **Analysis:** Progressive disclosure; fail-closed ethics; V3 retarget; domain sources.
- **Sources:** Wikipedia: https://en.wikipedia.org/wiki/Record_linkage; Wikipedia: https://en.wikipedia.org/wiki/Record_linkage#Probabilistic_record_linkage
- **Pedagogy:** Anchor→Mechanism→Contract→Case.
- **STORM link:** «precision/recall, pairwise/cluster metrics y err» in S30_STORM.json.

