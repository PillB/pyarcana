# S18 Explorer Report — EDA, estadística descriptiva e incertidumbre

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM (surface → pedagogy → redaction → meta-leak → comparative) + Graph Engineering + Loop Engineering  
**Scope lock:** Section 18 only  
**Live site:** https://pillb.github.io/pyarcana/ (hash `#data-engineering`)  
**Source:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s18-data-engineering.ts`  
**Platform id:** `data-engineering`  
**Generated:** 2026-07-24  

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Index | 18 |
| Platform id | `data-engineering` |
| Title | EDA, estadística descriptiva e incertidumbre |
| Short title | EDA e incertidumbre |
| Tagline | EDA que diferencia hallazgo, hipótesis y decisión; cada conclusión referencia un cálculo y declara incertidumbre |
| Level / phase / hours | Competente · phase 1 · 18 h |
| Capstone thread | Inicio de **CP-N2-B** (continúa dashboard/reportes en S19–S21) |
| Prior section | S17 cierra CP-N2-A (joins/groupby + portfolio limpio) |
| Next section | S19 viz accesible (dashboard CP-N2-B) |
| Structure inventory | Theory map + **8** subtopics (T1-A…T4-B) · **8** I Do demos · **24** We Do (guided/independent/transfer × 8) · You Do portfolio · **5** selfCheck · resources |

**In-scope analysis:** theory, I Do, We Do, You Do, selfCheck, resources, jobRelevance, learning outcomes, callouts, code/outputs, connective tissue to S17/S19, Peruvian Spanish redaction, meta-leaks.  
**Out of scope:** applying fixes; other sections’ content beyond interface edges; product/TS edits.

**Live site note:** The public SPA at https://pillb.github.io/pyarcana/ renders section content client-side. The curriculum card for Sección 18 (“EDA e incertidumbre”) matches source metadata. Full theory/exercise bodies were audited from the repository source file that powers the live build (`s18-data-engineering.ts`), cross-checked against the published section map and tagline.

**Pre-round pedagogy research (domain-relevant):**
- Honest EDA curricula (e.g. Think Stats, OpenIntro) emphasize **n + uncertainty**, sampling bias, and **correlation ≠ causation** before causal language.
- Gradual release (I Do / We Do / You Do) requires that “transfer” tasks not pre-print the solution formula in the prompt.
- Confidence-interval teaching should avoid “probado al 95%” and clarify when normal/z approximations are rough (small n, heavy tails) — the section states this verbally but under-trains bootstrap.
- Residualization / confounder checks are valuable ethics for analysts, but perfect collinearity demos need careful wording so students do not treat partial residual correlation as causal identification.

---

## 2. Executive Summary of Quality (1–10)

### Score: **7.0 / 10**

**Verdict:** Section 18 is **conceptually strong and ethically well-aligned** (hallazgo ≠ hipótesis ≠ decisión; anomalías ≠ fraude; solo sintéticos; correlación sin causalidad). The V3 retarget from legacy “data engineering” (Prefect/Parquet/GE) to **EDA + incertidumbre for CP-N2-B** is the right curriculum move. However, **user-facing meta-text about platform ids, V3 rethemes, and legacy paths is still heavy**; We Do exercises systematically **leak pass outputs and often the fix itself** in the instruction; several theory **outputs expose raw NumPy dtypes** (`np.str_`, `np.float64`); subtopic headings are **lowercase** unlike polished early sections; and “transfer” items are frequently one-line defect patches rather than genuine transfer of responsibility. Relative to early gold narrative (e.g. S02 dictionary + clean jobRelevance without platform-id chatter) and external EDA texts, S18 is **good intermediate product, not yet gold polish**.

| Dimension | Grade (1–10) | One-line note |
|-----------|--------------|---------------|
| Meta-text / developer leakage | 4.5 | V3 / id conservado / legado / gate V3 visible to learners |
| Grammar & redaction (es-PE) | 7.0 | Clear technical Spanish; heading capitalization + some English meta |
| Connective tissue / flow | 6.5 | Strong internal T1→T4; weak S17 bridge; retheme-first map |
| I Do / We Do / You Do fidelity | 6.5 | Complete skeleton; We Do is “DEFECT theater” with solution spoiler |
| Cognitive load / progressive disclosure | 7.0 | Order sensible; IC+d+residuals dense; bootstrap/Spearman taught only in prose |
| Exercises & selfCheck alignment | 6.0 | Outcomes map, but prompts dump answers; You Do scaffold thin |
| Roadmap consistency | 8.0 | CP-N2-B start → S19–S21 well named; ethics consistent with course |
| External comparative quality | 7.0 | Ethics competitive; exploration habits (describe/plots) deferred thin |
| Technical correctness of demos | 7.5 | Core math sound; two outputs dirty; hash instruction escape risk |

**Strengths (keep):**
1. Ethical spine for analytics in Perú: n, cobertura, no claim causal, no auto-fraude.
2. Complete 8× theory + 8× demo + 24× exercise grid.
3. Q→H→E plantilla and data notes as portfolio gate — industry-realistic.
4. Domain fixtures (Lima/Arequipa/Cusco, PEN, tickets sintéticos).
5. Resources include Think Stats + OpenIntro + NumPy/pandas stats docs.

---

## 3. Detailed Issue Registry

Severity key: **P0** blocker / wrong learning · **P1** high pedagogical or correctness · **P2** medium polish · **P3** low/nit.

### Issue 01 — Meta-leak: platform id + “retematiza a V3” in jobRelevance
- **Severity:** P1  
- **Location:** `jobRelevance`  
- **Evidence:**  
  > «Esta sección (id de plataforma `data-engineering` conservado) retematiza a V3 **EDA, estadística descriptiva e incertidumbre** e inicia **CP-N2-B**…»  
- **Impact:** Student-facing text talks about CMS/platform versioning instead of why EDA honesty matters for their job. Breaks immersion; signals unfinished retheme.

### Issue 02 — Meta-leak: legacy path / Prefect / Parquet / GE in map theory
- **Severity:** P1  
- **Location:** theory[0] paragraphs + callout  
- **Evidence:**  
  > «En V3, **S18 no es el path principal de Prefect, Parquet ni Great Expectations**… El id de plataforma `data-engineering` se conserva…»  
  > Callout: «Material legado de Prefect/Parquet/GE de este archivo **no es el camino V3 del estudiante en S18**. Target: EDA…»  
- **Impact:** Developer changelog presented as lesson intro. Students never needed the old path; mentioning it adds cognitive noise and “meta-leak” pattern flagged across the curriculum.

### Issue 03 — Meta-leak: map heading preserves old title as retheme banner
- **Severity:** P2  
- **Location:** theory[0].heading  
- **Evidence:**  
  > `De “Ingeniería de Datos Intermedia” a EDA e incertidumbre (mapa de la sección)`  
- **Impact:** Exposes historical title. Prefer a student map: “Mapa: de dataset limpio (S17) a EDA con incertidumbre (CP-N2-B)”.

### Issue 04 — Meta-leak: rubric criterion “gate V3”
- **Severity:** P2  
- **Location:** `youDo.rubric[0]`  
- **Evidence:**  
  > `Alineación al gate V3 de la sección` (25%)  
- **Impact:** Rubric speaks curriculum ops language, not observable portfolio criteria (e.g. “cada hallazgo cita n/métrica/IC y declara límite de cobertura”).

### Issue 05 — Meta-leak: resources note “V3 S18 EDA CP-N2-B”
- **Severity:** P3  
- **Location:** `resources.courses` · “PyArcana live”  
- **Evidence:**  
  > `note: "curso desplegado; V3 S18 EDA CP-N2-B"`  
- **Impact:** Low-severity internal shorthand on a student resource list.

### Issue 06 — We Do instructions systematically spoil solutions
- **Severity:** P0/P1  
- **Location:** all 24 `weDo.steps[].instruction`  
- **Evidence (pattern):**  
  > «…Fixture `S18-T1-A-E1` / datos sintéticos: montos = np.array([10, 12, 14, 16, 100]…; print("n", montos.size). Completa el TODO… Pass (salida exacta del solution): `n 5 | mean 30.4 | median 14.0`.»  
  Similar dump of code + exact pass string on E1–E3 of every subtopic (Cohen’s d formula fully given in T2-B-E2 instruction, etc.).  
- **Impact:** Defeats We Do as practice. Guided can show more; **independent/transfer should not paste the solution formula and exact multi-metric pass line**. Collapses active recall; students copy-print.

### Issue 07 — “Completa el TODO … sin borrar el oráculo” mismatches starters
- **Severity:** P1  
- **Location:** every We Do instruction + starters  
- **Evidence:** Instructions say complete TODO and keep oracle; most starters have **no `# TODO`**, only `# DEFECT:`; solutions **remove** `print('ok', True)` “oracle”.  
- **Impact:** Conflicting contracts; student who follows “no borrar oráculo” fails exact-output compare against solution.

### Issue 08 — Transfer exercises are defect patches, not transfer
- **Severity:** P1  
- **Location:** `kind: "transfer"` items (e.g. T2-B-E2, T1-B-E3, T4-A-E1)  
- **Evidence:** T2-B-E2 “transfer” is literally `d = (13 - 10) / 2`. T4-A-E1 “transfer” is `print(evidencia["pregunta"])` vs wrong key.  
- **Impact:** Violates gradual release: transfer should recombine skills on a slightly novel fixture without labeled DEFECT line.

### Issue 09 — Theory outputs leak NumPy scalar/string wrappers
- **Severity:** P1  
- **Location:** theory T2-A `sample_bias.py` output; T2-B `interval_effect.py` output  
- **Evidence:**  
  > `share_muestra {np.str_('Lima'): 0.8, ...}`  
  > `ic95_b (np.float64(104.39), np.float64(112.88))`  
- **Impact:** Looks like broken demo; teaches students that messy repr is “correct”. Easy fix with `str()` keys / `float(round(...))`.

### Issue 10 — Subtopic headings not title-cased (es-PE editorial)
- **Severity:** P2  
- **Location:** theory headings T1-A…T4-B  
- **Evidence:**  
  > `centro, dispersión y cuantiles` · `métricas robustas y escalas` · `población, muestra y sesgo` · …  
- **Impact:** Inconsistent with course UI polish and Spanish technical writing norms (sentence case at least with capital first letter).

### Issue 11 — Weak connective tissue from S17 → S18
- **Severity:** P2  
- **Location:** theory map / jobRelevance / youDo.context  
- **Evidence:** Map opens with anti-Prefect retheme, not “Traes el dataset limpio y el memo de límites de CP-N2-A (S17); aquí añades incertidumbre y data notes para abrir CP-N2-B.” Portfolio mentions CP-N2-B but does not require reusing S17 artifacts.  
- **Impact:** Breaks narrative of progressive capstone; student may treat S18 as isolated stats unit.

### Issue 12 — Bootstrap & Spearman promised in prose, absent in code path
- **Severity:** P2  
- **Location:** T2-B paragraph (bootstrap); T3-A paragraphs (Spearman); T4-A case (IC bootstrap)  
- **Evidence:** Mentions bootstrap and Spearman; demos/exercises only z·SE IC and Pearson `corrcoef`. I Do QHE even says «sin IC bootstrap en este corte».  
- **Impact:** Progressive disclosure gap: terms appear without practice → illusion of coverage.

### Issue 13 — CI teaching omits common misinterpretation trap beyond one phrase
- **Severity:** P2  
- **Location:** T2-B theory + exercises  
- **Evidence:** Good: avoid “probado al 95%”. Missing: IC is for a **parameter under sampling model**, not “95% of data lies in the interval”; z≈1.96 for mean with large n / approx normality — demos use n=35–40 with normal RNG (OK) but never flag lognormal ticket montos from T1.  
- **Impact:** Students may slap 1.96·s/√n on skewed montos without caution already preached for small n.

### Issue 14 — Residualization demo vs transfer exercise pedagogical clash
- **Severity:** P2  
- **Location:** theory T3-A + I Do T3-A vs We Do `S18-T3-A-E3`  
- **Evidence:** Theory/I Do show r_raw high → r_residual low with noise. Transfer uses **perfect collinearity** `x = y = z` and switches metric to `max_abs_resid` because corr of zero residuals is unstable — advanced edge case labeled “transfer”.  
- **Impact:** Correct numerically, but confuses the main lesson (confounder check) with numerical pathology.

### Issue 15 — You Do starter too thin for 18 h / CP-N2-B gate
- **Severity:** P2  
- **Location:** `youDo.starterCode` + `objectives`  
- **Evidence:** Starter only builds synthetic DF and `print(df.head())`. Objectives list resumen, sesgo, IC/efecto, no-causal, data notes — no intermediate checkpoints or required output schema.  
- **Impact:** High executive function load; weaker portfolio consistency across learners.

### Issue 16 — SelfCheck coverage thin vs learning outcomes
- **Severity:** P2  
- **Location:** `selfCheck.questions` (5 items)  
- **Evidence:** Covers mediana, correlación, data note, sesgo, confusor narrative. Gaps: IC language, Cohen’s d / effect size, Tukey flags ≠ fraude, log scale honesty, n always.  
- **Impact:** Active-recall gate under-samples section outcomes (8 LOs).

### Issue 17 — Pass-string format vs multi-line solution outputs
- **Severity:** P3  
- **Location:** instructions use `n 5 | mean 30.4 | median 14.0`; solutions print newlines  
- **Impact:** Students may literally print pipes; autograder/human compare ambiguity.

### Issue 18 — S18-T4-B-E2 hash fixture escape ambiguity
- **Severity:** P1  
- **Location:** We Do `S18-T4-B-E2` instruction vs `solutionCode`  
- **Evidence:** Instruction shows `b"a,b\\\\n1,2\\\\n"` (literal `\n` risk in student-facing text); solution TS uses `b"a,b\\n1,2\\n"` (newlines when executed). Pass claims `2aa26ec9`.  
- **Impact:** Student following instruction text with escaped backslashes gets different digest → false failure.

### Issue 19 — Theory T3-A code shape inconsistent
- **Severity:** P3  
- **Location:** `corr_confound.py`  
- **Evidence:** Other theory blocks use `def s18_th_N(): ... s18_th_N()`; T3-A is top-level script only. Indentation style also looser.  
- **Impact:** Minor consistency; sandbox runners that expect a function entry may differ.

### Issue 20 — Icon / id residual of data-engineering
- **Severity:** P3  
- **Location:** `icon: "Wrench"`, `id: "data-engineering"`  
- **Impact:** UX smell (wrench for EDA); id is intentional platform constraint — OK if **never narrated** to students (see Issues 01–02). Prefer Chart/BarChart icon if product allows.

### Issue 21 — Exercise instructions use broken dict pseudo-syntax
- **Severity:** P3  
- **Location:** e.g. T4-A-E1 instruction  
- **Evidence:**  
  > `evidencia = {; \"pregunta\": \"¿Cuál es el ticket mediano?\",.`  
- **Impact:** Unreadable fixture dump; looks like corrupted code in UI.

### Issue 22 — Generic feedback loop on all We Do
- **Severity:** P3  
- **Location:** `feedback: "Compara tu salida con la solución."` on essentially all exercises  
- **Impact:** No concept-specific remediation (e.g. “¿Usaste ddof=1?”).

---

## 4. Meta-Leak Report

Exact (or near-exact) user-facing leaks:

| # | Exact / representative text | Location | Type |
|---|----------------------------|----------|------|
| M1 | `(id de plataforma \`data-engineering\` conservado) retematiza a V3` | jobRelevance | Platform/version meta |
| M2 | `En V3, **S18 no es el path principal de Prefect, Parquet ni Great Expectations**` | theory map P1 | Legacy path changelog |
| M3 | `El id de plataforma \`data-engineering\` se conserva` | theory map P1 | Platform id |
| M4 | `Material legado de Prefect/Parquet/GE de este archivo **no es el camino V3 del estudiante en S18**. Target: EDA…` | theory map callout | Developer file note |
| M5 | `De “Ingeniería de Datos Intermedia” a EDA e incertidumbre` | theory map heading | Old title retheme banner |
| M6 | `Alineación al gate V3 de la sección` | youDo.rubric | Internal gate language |
| M7 | `curso desplegado; V3 S18 EDA CP-N2-B` | resources note | Deploy/version shorthand |
| M8 | `# DEFECT: …` + `CASO-LIM-018` on every starter | weDo starterCode | Acceptable **if** framed as lab defect; currently mixed with “TODO/oráculo” meta jargon |
| M9 | `Completa el TODO del starter sin borrar el oráculo` | weDo instructions ×24 | Harness/test jargon, not learner Spanish |

**Meta-leak count (distinct user-facing clusters): 9** (M1–M9; M8 borderline pedagogical pattern).

**Not counted as leak:** ethical “sin PII real”, CP-N2-B portfolio naming, CASO-LIM case ids (course brand).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Narrative & connective tissue
- **Internal structure:** Excellent T1 distributions → T2 inference/bias → T3 association/segments → T4 communication. Matches learning science progressive disclosure for stats literacy.
- **External structure:** Weak S17 handoff (clean dataset + non-claims memo) and only soft S19 forward (“base de trazabilidad hacia S19–S21” in T4-B). Gold early sections (e.g. S02) open with a **diccionario** and job story; S18 opens with **retheme denial**.
- **Thread consistency:** Tickets/montos/PEN/Lima–Arequipa–Cusco is coherent across theory, demos, and You Do.

### 5.2 I Do / We Do / You Do fidelity
| Phase | Fidelity | Notes |
|-------|----------|-------|
| I Do | High structure | 8 demos aligned to subtopics; good `why` lines |
| We Do | Medium–low learning value | Complete grid but solution-spoiled DEFECT micro-patches |
| You Do | Medium | Right objectives/ethics; thin starter; generic V3 rubric |
| Autocheck | Medium | 5 solid questions; under-covers IC/effect/Tukey ethics |

### 5.3 Cognitive load
- **Good:** One primary story (tickets sintéticos); repeated contract “reporta n + límite”.
- **Risk:** Same section introduces MAD, log1p honesty, selection bias, z-IC, Cohen’s d, Pearson + residual confounder, Tukey fences, QHE template, data notes + sha1. That is a full stats mini-course. Acceptable for 18 h **if** We Do builds gradually; currently many items are too small and too spoiled, so load sits in **theory absorption**, not practice.
- **Missing practice for stated concepts:** bootstrap, Spearman, `describe()`, any tabular EDA of a multi-column frame beyond mean rates.

### 5.4 Grammar & redaction (español peruano)
- Overall professional, direct, second-person where needed.
- Prefer: capitalizar headings; reduce anglicismos in student-facing meta (`Target:`, `gate V3`, `oráculo`); keep technical terms (IQR, MAD, Pearson) with Spanish gloss on first use (mostly done).
- Book label: `Statistical Inference vía Data Science` — mixed orthography; prefer full English title or Spanish equivalent.
- Code print labels mostly English (`mean`, `cohens_d`) — acceptable in code; narrative Spanish is fine.

### 5.5 Exercise & exam quality
- **Alignment to LOs:** Yes at surface level (each LO has ≥1 exercise cluster).
- **Depth:** Independent/transfer rarely require choosing metric from a business question; often flip one wrong operator.
- **Ethics exercises:** Strong narrative in selfCheck Q5; weaker in We Do (flags/rates without forced “no claim causal” print except I Do).
- **Exam:** Only selfCheck present (course pattern). Recommend +2–3 items on IC language and Tukey ≠ fraude.

### 5.6 Comparative quality (external)
| Source | S18 vs source |
|--------|----------------|
| Think Stats (Downey) | S18 stronger on **business non-claims**; weaker on exploratory narrative and simulation experiments |
| OpenIntro Statistics | S18 lighter on formal sampling distributions; good practical bias_pp |
| Typical industry EDA onboarding | S18 under-uses `describe`/visual scan (deferred S19 — OK if map says so explicitly) |
| PyArcana S02 gold narrative | S02 jobRelevance cleaner; S18 still retheme-first |

### 5.7 Domain ethics (strong — preserve)
- Anomalías como candidatos a revisión, no fraude.
- Correlación = asociación observada.
- Hallazgo ≠ decisión de campaña/bloqueo.
- Solo sintéticos / sin PII.

### 5.8 Graph memory (nodes of concern)
```
[Meta:V3-id] --pollutes--> [Theory:Map] --weakens--> [Motivation]
[WeDo:InstructionSpoil] --breaks--> [ActiveRecall] --undermines--> [Transfer claim]
[Theory:np.str_/float64] --breaks--> [Trust in demos]
[Prose:bootstrap/Spearman] --orphan--> [No code node]
[S17:CP-N2-A] --missing edge--> [S18:Map]
[S18:DataNotes] --good edge--> [S19:Dashboard]
```

---

## 6. Proposed GitHub-style Diffs

> Do **not** apply in Explorer. Diffs are proposals against `src/lib/course/sections/s18-data-engineering.ts`.

### Diff A — Clean jobRelevance (Issues 01)
```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@
- jobRelevance:
- "En analytics y data products de banca, fintech y retail en Perú, un **EDA honesto** separa hallazgo, hipótesis y decisión. Esta sección (id de plataforma `data-engineering` conservado) retematiza a V3 **EDA, estadística descriptiva e incertidumbre** e inicia **CP-N2-B** con datos sintéticos, intervalos básicos y data notes reproducibles.",
+ jobRelevance:
+ "En analytics y data products de banca, fintech y retail en Perú, un **EDA honesto** separa hallazgo, hipótesis y decisión: cada número lleva n, cobertura e incertidumbre. Tras el dataset limpio de S17, aquí abres **CP-N2-B** con resúmenes robustos, sesgo muestral, intervalos básicos, correlación sin causalidad y data notes reproducibles — solo datos sintéticos.",
```

### Diff B — Student-facing map (Issues 02, 03, 11)
```diff
--- a/src/lib/course/sections/s18-data-engineering.ts
+++ b/src/lib/course/sections/s18-data-engineering.ts
@@
- heading: "De “Ingeniería de Datos Intermedia” a EDA e incertidumbre (mapa de la sección)",
+ heading: "Mapa de la sección: del dataset limpio al EDA con incertidumbre",
  paragraphs: [
- "En V3, **S18 no es el path principal de Prefect, Parquet ni Great Expectations** (eso se reubica a ingeniería avanzada). El id de plataforma `data-engineering` se conserva, pero el camino del estudiante es el **inicio de CP-N2-B**: centro/dispersión, métricas robustas, sesgo muestral, intervalos básicos, correlación sin causalidad y notebooks con data notes reproducibles.",
+ "En S17 cerraste **CP-N2-A** con joins, agregaciones y un memo de límites. Aquí empiezas **CP-N2-B**: centro/dispersión, métricas robustas, sesgo muestral, intervalos básicos, correlación sin causalidad y notebooks con data notes reproducibles. La ingeniería de orquestación/formatos de almacén a escala se trabaja más adelante en el camino de producción — no es el foco de esta sección.",
  "El hilo conductor es un **dataset sintético de tickets/montos** con regiones ficticias Lima, Arequipa y Cusco, ids `T00x` y montos en PEN. Cada hallazgo del portfolio debe citar un cálculo (n, métrica, IC o flag) y declarar incertidumbre: hallazgo ≠ hipótesis ≠ decisión de negocio.",
  "Orden pedagógico: **T1 Distribuciones** (centro, cuantiles, robustez y escalas) → **T2 Inferencia básica** (población/muestra, IC y tamaño de efecto) → **T3 Relaciones** (correlación, confusión, segmentos y anomalías sin claim causal) → **T4 Comunicación** (plantilla Q→H→E y data notes). Solo numpy/pandas ya vistos; sin PII real. Los gráficos honestos se profundizan en S19.",
  ],
  callout: {
  type: "info",
- title: "Contenido reubicado conceptualmente",
- content:
- "Material legado de Prefect/Parquet/GE de este archivo **no es el camino V3 del estudiante en S18**. Target: EDA e incertidumbre para CP-N2-B (inicio). Solo datos sintéticos; nunca PII real.",
+ title: "Foco de S18",
+ content:
+ "Prioriza EDA e incertidumbre con datos sintéticos para el inicio de CP-N2-B. Nunca PII real. No conviertas correlación ni anomalías en culpa ni en decisión automática.",
  },
```

### Diff C — Capitalize subtopic headings (Issue 10)
```diff
- heading: "centro, dispersión y cuantiles",
+ heading: "Centro, dispersión y cuantiles",
- heading: "métricas robustas y escalas",
+ heading: "Métricas robustas y escalas",
- heading: "población, muestra y sesgo",
+ heading: "Población, muestra y sesgo",
- heading: "intervalos básicos y tamaño de efecto",
+ heading: "Intervalos básicos y tamaño de efecto",
- heading: "correlación y confusión",
+ heading: "Correlación y confusión",
- heading: "segmentación, anomalías y causalidad no demostrada",
+ heading: "Segmentación, anomalías y causalidad no demostrada",
- heading: "preguntas, hipótesis y evidencia",
+ heading: "Preguntas, hipótesis y evidencia",
- heading: "notebook reproducible y data notes",
+ heading: "Notebook reproducible y data notes",
```

### Diff D — Fix dirty theory outputs (Issue 09)
```diff
--- sample_bias share dict keys as plain str
- muestra = np.array(["Lima"] * 40 + ["Arequipa"] * 8 + ["Cusco"] * 2)
- from collections import Counter
- c = Counter(muestra)
+ muestra = ["Lima"] * 40 + ["Arequipa"] * 8 + ["Cusco"] * 2
+ from collections import Counter
+ c = Counter(muestra)
...
- output: `share_muestra {np.str_('Lima'): 0.8, np.str_('Arequipa'): 0.16, np.str_('Cusco'): 0.04}
+ output: `share_muestra {'Lima': 0.8, 'Arequipa': 0.16, 'Cusco': 0.04}
...
--- interval_effect cast IC to float
- print("ic95_b", (round(ic[0], 2), round(ic[1], 2)))
+ print("ic95_b", (round(float(ic[0]), 2), round(float(ic[1]), 2)))
- output: `... ic95_b (np.float64(104.39), np.float64(112.88))
+ output: `... ic95_b (104.39, 112.88)
```

### Diff E — Instruction template without spoilers (Issues 06, 07, 17, 21)
```diff
# Pattern for guided (E1) — keep fixture; remove full pass multi-metric dump of every print
- "E1 (guiado) — Concepto: centro (mean/median) y n de montos. Fixture `S18-T1-A-E1` / datos sintéticos: montos = np.array([10, 12, 14, 16, 100], dtype=float); print(\"n\", montos.size). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `n 5 | mean 30.4 | median 14.0`.",
+ "E1 (guiado) — Con el array sintético de montos del starter (`CASO-LIM-018`), corrige el defecto indicado en el comentario `# DEFECT` para reportar **n**, **mean** (2 decimales) y **median**. No inventes datos. Compara con la solución solo después de ejecutar.",

# Pattern for independent/transfer — do NOT paste formula or exact numeric pass in the prompt
- "E2 (independiente) — Concepto: tamaño de efecto Cohen's d. Fixture ... d = (13 - 10) / 2; ... Pass: `d 1.5`.",
+ "E2 (independiente) — El starter calcula el tamaño de efecto con el orden de medias invertido. Corrígelo para obtener d = (media_B − media_A) / s_pooled con los valores del starter, redondeado a 2 decimales, etiqueta `d`.",
```
Apply analogously to all 24 instructions; align starters with either (a) keep `print('ok', True)` in solutions or (b) drop “oráculo” language.

### Diff F — Fix sha1 exercise clarity (Issue 18)
```diff
--- instruction
- "... print(hashlib.sha1(b\"a,b\\\\n1,2\\\\n\").hexdigest()[:8]) ... Pass: `2aa26ec9`."
+ "... Calcula sha1 en hex de los **bytes** del CSV sintético con saltos de línea reales (`a,b` + newline + `1,2` + newline) y muestra los **primeros 8** caracteres. No uses md5 ni el digest completo."

--- solutionCode (explicit bytes)
+ payload = b"a,b\n1,2\n"
+ print(hashlib.sha1(payload).hexdigest()[:8])
```
Re-verify digest once in CI after edit.

### Diff G — You Do rubric + starter (Issues 04, 15)
```diff
- { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+ { criterion: "Cada hallazgo cita cálculo (n, métrica, IC o flag) y límite de cobertura", weight: "25%" },

# starterCode: add TODOs for resumen, bias_pp, one IC or d, one corr note, data note JSON
```

### Diff H — SelfCheck additions (Issue 16) — sketch
```diff
+ {
+   question: "Un IC 95% para la media muestral de tickets, ¿qué NO debes afirmar?",
+   options: [
+     "El intervalo es compatible con incertidumbre de muestreo bajo el modelo usado",
+     "Reporto n junto al intervalo",
+     "Quedó probado al 95% que la media poblacional es exactamente el punto central",
+     "Con colas pesadas y n chico debo ser cauteloso con la aproximación z"
+   ],
+   correctIndex: 2,
+   explanation: "El IC no 'prueba' un valor puntual; comunica incertidumbre bajo supuestos."
+ },
+ {
+   question: "Una tasa de flags Tukey más alta en Cusco implica:",
+   options: [
+     "Fraude demostrado en Cusco",
+     "Hallazgo descriptivo de anomalías univariadas; la decisión de investigación es humana",
+     "Que la media es mejor que la mediana",
+     "Que el IC es innecesario"
+   ],
+   correctIndex: 1,
+   explanation: "Anomalía ≠ culpa ni fraude automático."
+ }
```

### Diff I — Resources / icon polish (Issues 05, 20)
```diff
- note: "curso desplegado; V3 S18 EDA CP-N2-B",
+ note: "curso desplegado (referencia del proyecto)",
- icon: "Wrench",
+ icon: "BarChart3", // or existing icon enum used for analytics sections
```

### Diff J — T3-A-E3 transfer reframe (Issue 14)
Replace perfect collinearity fixture with noisy residualization matching I Do (`r_raw` high, `r_residual` low) so transfer practices the **concept**, not corrcoef-on-zeros.

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|----------|--------|-----------|
| **1 (P0/P1)** | 06, 07, 18 | Spoiled exercises + oracle mismatch + hash ambiguity break learning/assessment |
| **2 (P1)** | 01, 02, 09 | Meta-leaks in first screen + dirty demo outputs erode trust |
| **3 (P1/P2)** | 08, 15, 04 | Restore real transfer + portfolio/rubric quality |
| **4 (P2)** | 03, 10, 11, 12, 13, 14, 16 | Narrative map, headings, S17 bridge, concept–code gaps, selfCheck |
| **5 (P3)** | 05, 17, 19, 20, 21, 22 | Polish, consistency, feedback strings |

**Suggested Fixer batches:**
1. **Batch Meta+Outputs:** Diffs A, B, C, D, I  
2. **Batch WeDo contracts:** Diffs E, F, J (all 24 instructions + oracle policy)  
3. **Batch Portfolio/Exam:** Diffs G, H  

---

## 8. Graph Memory Update Notes

For shared curriculum context files / next agents:

```yaml
section: 18
id: data-engineering
file: s18-data-engineering.ts
title: EDA, estadística descriptiva e incertidumbre
explorer_score: 7.0
status_after_explorer: needs_fixer_polish
capstone: CP-N2-B_start
edges:
  - from: S17_CP-N2-A_close
    to: S18_EDA_uncertainty
    type: should_bridge
    state: weak_in_map
  - from: S18_data_notes
    to: S19_accessible_viz
    type: forward_ref
    state: present_soft
  - from: meta_V3_platform_id
    to: student_facing_copy
    type: leak
    state: active
  - from: weDo_instruction
    to: solution_output
    type: spoiler
    state: systemic_x24
preserve:
  - ethics_hallazgo_vs_decision
  - correlation_not_causation
  - anomalies_not_fraud
  - synthetic_only_PEN_tickets
  - eight_subtopic_grid
  - QHE_template
  - data_notes_sha_seed
fixer_do_not:
  - reintroduce Prefect/Parquet/GE as student path in S18
  - claim causal from r or Tukey rates
  - use real PII
comparative_note: >
  Expert ledger rank 9.55 overstates polish; independent Explorer finds
  systemic WeDo spoiler pattern and meta retheme text still student-visible.
```

**Paragraph-analysis / STORM dossiers** (`S18_PARAGRAPHS.md`, `S18_STORM.json`) already encode domain ethics and V3 retarget; Explorer adds that **retarget language must leave student copy** once content is correct, and that DEFECT WeDo without spoiler discipline is “theater.”

---

## Appendix — Structure checklist (evidence)

| Element | Count / status |
|---------|----------------|
| Learning outcomes | 8 |
| Theory blocks (incl. map) | 9 headings / 8 subtopicIds |
| Theory code samples | 8 |
| I Do demos | 8 |
| We Do exercises | 24 (3×8) |
| You Do | 1 portfolio block |
| SelfCheck | 5 questions |
| Resources docs | 7 |
| Resources books | 2 |
| Resources courses | 6 |
| Automated S18_AUDIT.json | ACCEPT, high_issue_count 0 (structural redaction only; does not replace this audit) |

---

This is the complete Explorer report for Section 18. Ready for the Fixer prompt.
