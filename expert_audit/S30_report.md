# Section 30 — Curriculum Auditor Report

**Section under audit:** Section 30 — *"Entity resolution probabilístico"* (shortTitle: *ER probabilístico*)
**Live site:** https://pillb.github.io/pyarcana/ — confirmed via headless browser render
**Repository file:** `src/lib/course/sections/s30-security-infra.ts` (1,824 lines, 90.5 KB)
**Section id (internal):** `"security-infra"`
**Task ID:** S30
**Auditor:** Curriculum Auditor (general-purpose subagent)
**Method:** Stanford STORM + Graph/Loop/Harness Engineering, multi-pass; Spanish-grammar subplan applied per paragraph and per sentence.

> Verbatim auditor deliverable for Section 30. The Fixer prompt can consume this report directly.

---

## 1. Section Identification & Scope

| Field | Value (verified from source + live render) |
|---|---|
| `index` | 30 |
| `id` | `security-infra` |
| `title` | Entity resolution probabilístico |
| `shortTitle` | ER probabilístico |
| `tagline` | Motor de entity resolution testeable: benchmark etiquetado, blocking medido, comparadores explicables y cola de revisión |
| `estimatedHours` | 18 |
| `level` / `phase` | Competente / Phase 2 (Senior, 27–39) |
| `icon` / `accentColor` | GitMerge / from-fuchsia-500 to-purple-900 |
| Subtopics | T1-A Comparadores, T1-B Missing/frecuencia, T2-A Blocking+candidate recall, T2-B Costo+imposibles, T3-A Pesos+umbrales, T3-B Calibración+clusters, T4-A Splits por entidad, T4-B Métricas+slices |
| Tabs rendered | Teoría · Yo hago · Hacemos juntos · Tú haces · Autocheck (verified live) |
| Total learner-facing records extracted | 228 (334 sentences, 3,716 words of Spanish prose) |

**Scope confirmation.** The 30th entry in `COURSE_SECTIONS` (in `src/lib/course/index.ts`, line 76) is `section30`, imported from `./sections/s30-security-infra`. The live rendered homepage (verified via `agent-browser` snapshot) shows entry #30 as **"ER probabilístico"** with the matching tagline, and the rendered theory tab starts with the heading *"Cierre CP-N3-A: motor de entity resolution testeable"* — matching `theory[0].heading` of the source. Section identity confirmed.

**Course-roadmap alignment.** `learning_roadmap_52_V3.md` lists "S30 — Entity resolution probabilístico" as the closure of **CP-N3-A (Testable Entity Resolution Engine)** with prerequisites S7, S13, S29 — content matches V3 roadmap exactly. However, the *older* master roadmap (`el_arte_de_python_roadmap_maestro_52_secciones.md`) still labels "Sección 30 — NLP Foundations & Embeddings" (legacy/diverged plan). This is not a Section-30 authoring defect but a roadmap-document drift; flagged for the Fixer in the consistency dimension.

---

## 2. Executive Summary of Quality

**Composite quality score: 8.4 / 10**

Section 30 is **one of the strongest Senior-phase sections audited so far**. The pedagogical architecture is tight: a 4-theme × 2-subtopic grid (T1–T4 × A/B) drives every theory block, demo, exercise, and self-check item, with consistent vocabulary (`CASO-LIM-030`, `auto_match | review | non_match`, `filter_before_score`, `Union-Find`, `pair completeness / pair quality`). The I Do → We Do → You Do → Self Check chain is fully populated with 8 demos, 24 exercises (3 per subtopic × 8 subtopics), a real starter skeleton with TODOs, a portfolio note, an 8-criterion rubric, and 9 self-check MCQs. The ethical guardrail ("ER ≠ fraude/parentesco") is repeated deliberately at the right cadence without becoming noise.

Grammar metrics are healthy for a technical Spanish course:
- Average **Fernández-Huerta = 65.5** (band "normal / bastante difícil" — appropriate for senior-level technical prose).
- Average **INFLESZ = 60.8** (perspicuity "normal").
- Average **WPS = 11.1** sentences/word, **SPW = 2.17** syllables/word — well inside the 15–32 WPS soft target for technical Spanish.
- **0 run-on sentences (>45 w)**; only **4 long sentences (>32 w)** (1.2% of all sentences) — among the best in the campaign.
- **0 unbalanced delimiters in actual prose** (the 10 flagged by the heuristic are all inside `edgeCases` strings containing legitimate Python f-strings, e.g. `'{fold(last)}|{fold(city)[:3]}'`).
- **0 missing inverted marks (`¿`/`¡`)**.
- **0 repeated words**, **0 double spaces**, **0 space-before-punctuation** in source.
- **0 gerund pile-ups**, **0 anaphoric monotony**.

The deducting issues are concentrated and small:

| Loss | Cause |
|---|---|
| −0.6 | Filename/`id` carry-over from an older "security-infra" plan; mismatch with the actual ER content (consistency + maintainability). |
| −0.3 | 6 `# TODO:` developer markers visible in the *Tú haces* starter code (minor meta-leak). |
| −0.3 | 3 localized grammar slips in prose: missing comma before *pero* (L150), adjective agreement *"a mano **documentado**"* (L231), missing article *"decide misma entidad"* (L1315). |
| −0.2 | Inconsistent spelling of the Lima surname between theory ("Ana López"/"López Ana", with accent) and the I Do demo description+code ("Ana Lopez"/"Lopez Ana", without accent). |
| −0.2 | 4 long sentences (one of them 44 w) that could be split for cognitive load. |
| −0.0 | Stylistic: 9 occurrences of "vs" without period; Spanglish "approve clerical" (×4) instead of "aprobación clerical". |

**Verdict:** Production-ready with minor polish. Recommended Fixer pass touches 8–10 strings; no structural rewrite needed.

---

## 3. Detailed Issue Registry

Each issue is numbered, with severity (**H/M/L**), evidence (verbatim quote + source line), and pedagogical impact.

### 3.1 — Filename / `id` mismatch with content  *(Severity: L — consistency / maintainability)*
**Evidence.** File is named `s30-security-infra.ts`; section `id: "security-infra"` (L4). Yet `title: "Entity resolution probabilístico"` (L6), and 100% of the content is about probabilistic entity resolution (comparators, blocking, Fellegi–Sunter didactic, Union-Find, pair completeness/quality). The id is referenced from `src/components/course/SectionView.tsx:2452` (`'security-infra': { title: 'Practica blocking y candidate recall', ... }`) and `src/components/course/PdfReport.tsx:70` (`"security-infra": '30. ER probabilístico'`). The live page never exposes the id in a URL (the SPA uses in-app state, no per-section route), so learners do not see "security-infra" — but contributors searching the repo for "security infrastructure" topics will land on the wrong file.

**Pedagogical impact.** None directly for learners; meaningful for maintainability and for future sections that genuinely cover security/infrastructure (no such section exists in the 52-section plan now, but the naming collision with `s14-security.ts` — which is actually NumPy content — suggests a systemic pattern of leftover filenames from earlier roadmap versions).

### 3.2 — `# TODO:` developer markers in learner-facing starter code  *(Severity: L — meta-leak)*
**Evidence.** Six `# TODO:` comments in `youDo.starterCode` (L1591, L1595, L1599, L1646, L1650, L1654):

```python
def edit_sim(a: str, b: str) -> float:
    # TODO: Levenshtein normalizado (ver theory T1-A)
    raise NotImplementedError("edit_sim")

def date_sim(d1: date, d2: date, tol_days: int = 3) -> float:
    # TODO: 1.0 / 0.5 / 0.0 según tolerancia
    raise NotImplementedError("date_sim")

def compare_field(a: Any, b: Any) -> str:
    # TODO: missing | agree | disagree
    raise NotImplementedError("compare_field")
...
def entity_split(pairs: list, train_entities: set) -> tuple:
    # TODO: train si ambas entidades ⊆ train_entities
    raise NotImplementedError("entity_split")

def prf(y_true: list, y_pred: list) -> tuple:
    # TODO: precision, recall, f1
    raise NotImplementedError("prf")

def error_slices(rows: list) -> list:
    # TODO: slices con más errores
    raise NotImplementedError("error_slices")
```

**Pedagogical impact.** `TODO` is a developer tracker convention (TODO/FIXME/XXX). Learners see this as part of the rendered starter. Pedagogically the *intent* is fine ("implement here"), but the marker style reads as an internal engineering artifact rather than a teaching cue. The Spanish course voice used everywhere else would prefer `# Tu implementación:` or `# Implementa:`.

### 3.3 — Missing comma before coordinating conjunction *pero*  *(Severity: M — grammar)*
**Evidence.** L150 (theory T2-A, paragraph 3):

> "Reglas en **unión (OR)** suben candidate recall; **intersección (AND)** reduce candidatos pero puede matar recall de gold matches."

**Rule.** RAE: when *pero* joins two clauses with their own verbs, it is preceded by a comma. *"reduce candidatos, pero puede matar recall…"* LanguageTool flags `COMMA_PERO`.

**Pedagogical impact.** Minor readability; a senior learner reads past it, but it is the kind of slip that distracts careful readers and undermines the "professional Spanish" promise declared in the rubric (L1681).

### 3.4 — Adjective agreement: *"a mano **documentado**"*  *(Severity: M — grammar)*
**Evidence.** L231 (theory T3-A, paragraph 3):

> "Estima pesos con frecuencias o a mano **documentado**; valida en gold sintético (T4) sin leakage de entidad."

**Rule.** *documentado* (singular masculine) does not agree with *pesos* (plural masculine). Two valid repairs:
- *Estima pesos con frecuencias, o a mano, **documentados**;* (plural adjective modifying *pesos*)
- *Estima pesos con frecuencias o a mano **de forma documentada**;* (adverbial phrase)

LanguageTool flags `AGREEMENT_POSTPONED_ADJ`. The intent is "estimate weights in a documented way" — the second repair is clearer.

**Pedagogical impact.** Mid-level learners may pause to parse the agreement; the sentence is also informationally dense (it embeds *frecuencias*, *a mano*, *documentado*, *gold sintético*, *leakage de entidad*). The agreement slip compounds the cognitive load.

### 3.5 — Missing article: *"decide misma entidad"*  *(Severity: M — grammar)*
**Evidence.** L1315 (weDo step S30-T3-B-E3, feedback):

> "El motor ER solo decide misma entidad; filtra labels ajenos en el borde del sistema."

**Rule.** *decide* is transitive; the bare noun phrase *misma entidad* needs a determiner: *"decide **la** misma entidad"* or, more idiomatic, *"decide **si dos registros son la** misma entidad"*. The latter matches the framing used everywhere else in the section (e.g. theory L30: *"¿dos registros apuntan a la misma entidad del mundo real?"*; selfCheck Q1: *"Si dos registros son la misma entidad"*).

**Pedagogical impact.** Mid. The feedback line is what the learner reads *after* failing the exercise, when their cognitive bandwidth is already stretched. A grammatical slip here is the worst place for one.

### 3.6 — Surname accent inconsistency between theory and I Do demo  *(Severity: L — consistency)*
**Evidence.** Theory T1-A (L46 and theory code L91) uses the accented form consistently:

> "...orden "Ana **López**" / "**López** Ana")." (L46)
> `print("token", round(token_jaccard("Ana López", "López Ana"), 3))` (L91)

But the I Do demo description (L438) and the I Do demo code (L452) drop the accent:

> `description: "Exact post-normalización (email con distinta capitalización) y Jaccard de tokens con orden invertido ("Ana Lopez" / "Lopez Ana")."` (L438)
> `j = round(jac("Ana Lopez", "Lopez Ana"), 2)` (L452)

LanguageTool flags `ES_SIMPLE_REPLACE_SIMPLE_LOPEZ` twice on L438.

**Note.** The youDo fixture (L1664–1665) intentionally pairs `"Ana López"` (r1) with `"ANA Lopez"` (r2) to demonstrate the `fold_accents` function — that is a deliberate teaching choice, not an inconsistency. The L438/L452 slip is the only unintended one.

**Pedagogical impact.** Low. The I Do demo still works (Jaccard is case- and accent-insensitive at the token level the demo teaches). But it undermines the section's own lesson that *accent folding matters* — the very next subtopic (T2-A) demonstrates that `López` vs `lopez` without folding produces candidate recall 0.0. Showing "Lopez" without accent in the I Do demo for token Jaccard undercuts that message.

### 3.7 — Long sentences (>32 words) increasing cognitive load  *(Severity: L — cognitive load)*
**Evidence.** Four sentences exceed the 32-word soft target; none crosses the 45-word run-on threshold.

| L | Tab | Words | FH | Sentence |
|---|---|---|---|---|
| 432 | iDo.intro | 44 | 29.7 | "Te demuestro el cierre de CP-N3-A en ocho demos alineadas a T1–T4: comparadores con normalización, missing/frecuencia, blocking con candidate recall calculado, costo e imposibles, score+umbrales, Union-Find con approve clerical, split por entidad y métricas con índices de error." |
| 33 | theory[0].paragraphs | 40 | 28.0 | "Orden pedagógico: T1 Comparadores (exact/edit/token/fecha → missing y frecuencia) → T2 Blocking y costo (claves, candidate recall, pares imposibles) → T3 Matching (pesos didácticos, umbrales, cola clerical, clusters) → T4 Evaluación (split por entidad, P/R/F1, pair completeness, error slices)." |
| 364 | theory[7].paragraphs | 39 | 40.9 | "Cluster (simplificado didáctico): pair completeness ≈ fracción de pares gold match que el sistema mantiene en el mismo cluster (recall de uniones); pair quality ≈ fracción de pares predichos como co-cluster que son match en el gold (precisión de uniones)." |
| 316 | theory[6].paragraphs | 33 | 62.3 | "Nunca uses el mismo par (ni la misma entidad) en train y test de umbrales sin control: eso es leakage de identidad (fuga de identidad) e infla métricas del motor de forma engañosa." |

**Pedagogical impact.** Low-to-mid. The first two are *list-like* sentences (comma-separated enumerations of subtopic labels) and read acceptably because each item is short. The third (cluster definitions) is the densest — it crams two definitions into one sentence separated by a semicolon. Splitting at the semicolon is the cleanest fix. The fourth is a single warning shot with an apposition; acceptable.

### 3.8 — `vs` without period (Spanish typographic style)  *(Severity: L — style)*
**Evidence.** 9 occurrences of `vs` without period (L188, 196, 197, 363, 425, 464, 515, 1710, 1738). LanguageTool flags `PUNTO_EN_ABREVIATURAS` for each.

**Rule.** RAE accepts both *vs* and *vs.* in Spanish; the period is preferred in formal writing. The course is otherwise typographically careful (uses `—` em-dashes, `«»`/`""` quotes, `→` arrows). Adding the period matches the course's own polish level.

**Pedagogical impact.** Negligible. Pure stylistic consistency.

### 3.9 — Spanglish: *"approve clerical"* instead of *aprobación clerical*  *(Severity: L — style/anglicism)*
**Evidence.** 4 occurrences (L271, L432, L562, L579[code comment]):
- L271: "...un **approve clerical** de e3–e4 cierra el cluster e1…e4 de forma transitiva."
- L432: "...Union-Find con **approve clerical**..."
- L562: "Union-Find: auto-matches e1–e2–e3 más un **approve clerical** e3–e4 cierran el cluster."
- L579: `union("e3", "e4")  # clerical approve` (code comment — acceptable as code-English)

**Rule.** *Approve* is an English verb used as a noun here. Spanish equivalent: *"aprobación clerical"* (clerical approval) or *"aprobado clerical"* (clerical approval as past-participle noun). The section already uses the Spanish noun *aprobación* in weDo step L296 (`# clerical: aprueba e3-e4`) — consistency would prefer *aprobación clerical*.

**Pedagogical impact.** Low. Senior learners read past it, but the section promises "español profesional" (rubric L1681) and "español peruano" (course meta). The anglicism is the kind of detail a Peruvian reviewer would flag.

### 3.10 — Self-check option uses "leakage" without Spanish gloss  *(Severity: L — consistency)*
**Evidence.** L1725, selfCheck Q6 option: `"Leakage de identidad entre train y test"`. Theory T4-A (L316) introduces the term with the gloss: *"leakage de identidad (fuga de identidad)"*. The option omits the gloss.

**Pedagogical impact.** Low. Self-check options are short by design. But the first time the learner sees "leakage" without gloss is in the answer option, which is a backward introduction order.

### 3.11 — `Monitorea` (anglicism from "monitor")  *(Severity: L — style)*
**Evidence.** L222 (callout content T2-B): "Monitorea tamaño de bloque y redefine la clave antes de escalar." Also L195: "Monitorea el tamaño máximo de bloque como **SLO** de diseño".

**Rule.** *Monitorea* (3rd-person singular imperative of *monitorear*) is widely accepted in LatAm tech Spanish but is still flagged by purists. Alternatives: *Vigila*, *Supervisa*. Not blocking.

**Pedagogical impact.** Negligible.

### 3.12 — `score+umbrales` and `missing/frecuencia` (compact slash notation)  *(Severity: L — style)*
**Evidence.** L432: "blocking con candidate recall calculado, costo e imposibles, **score+umbrales**, Union-Find con approve clerical...". Same line: "**missing/frecuencia**".

**Rule.** Not incorrect, but the plus-sign juxtaposition (`score+umbrales`) is a code-style compaction that breaks the prose rhythm. The slash (`missing/frecuencia`) is more conventional.

**Pedagogical impact.** Negligible.

### 3.13 — Callout title "Auto-match conservador" mixes English label with Spanish adjective  *(Severity: L — style)*
**Evidence.** L260: `title: "Auto-match conservador"`.

**Rule.** `auto_match` is a code label used throughout the section (with underscore). The title writes it as `Auto-match` (hyphen, capitalized). For consistency with the code style and the other callout titles in the section (which are pure Spanish: *"Explicabilidad"*, *"Missing ≠ disagree"*, *"Recall 0.0 = lección de normalización"*, *"Bloque de 100k"*, *"Auto-match conservador"*, *"Consistencia transitiva"*, *"Leakage por entidad"*, *"Pairwise vs cluster"*), the title could be *"Umbral auto_match conservador"* or just *"Auto_match conservador"* (matching the code identifier).

**Pedagogical impact.** Negligible.

---

## 4. Meta-Leak Report

The Meta-Leak Detector pass searched for: `TODO|FIXME|XXX|TBD|WIP|moved from|fixer|storm|placeholder|draft note|curriculum hardening|pending|lorem ipsum|insert here|<your|your-name`. Findings:

| # | Location | Leaked text | Type | Severity |
|---|---|---|---|---|
| ML-1 | L1591 (`youDo.starterCode`) | `# TODO: Levenshtein normalizado (ver theory T1-A)` | Developer TODO marker visible to learner | L |
| ML-2 | L1595 | `# TODO: 1.0 / 0.5 / 0.0 según tolerancia` | Same | L |
| ML-3 | L1599 | `# TODO: missing \| agree \| disagree` | Same | L |
| ML-4 | L1646 | `# TODO: train si ambas entidades ⊆ train_entities` | Same | L |
| ML-5 | L1650 | `# TODO: precision, recall, f1` | Same | L |
| ML-6 | L1654 | `# TODO: slices con más errores` | Same | L |

**No other meta-leaks detected.** No "moved from section X", no "design note", no AI-to-developer comments, no Fixer/STORM references, no `placeholder`/`draft`/`WIP` strings. The section is clean of internal-authoring residue except for the TODO convention in the You Do starter skeleton.

**Filename/id carry-over** (Issue 3.1) is technically a meta-leak of an *older roadmap plan* into the current filename, but it is not visible to learners and is purely a maintainer concern.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

**Structure (excellent).** The section follows the course's canonical I/We/You pattern with high fidelity:

- **I Do** (`iDo` field, L431–655): 8 demos, one per subtopic (S30-T1-A-DEMO through S30-T4-B-DEMO). Each demo has `subtopicId`, `environment: "local-python"`, `description`, runnable `code`, expected `output`, and a `why` rationale. The `intro` (L432) explicitly maps the 8 demos to T1–T4.
- **We Do** (`weDo`, L656–1547): 24 exercises (3 per subtopic × 8 subtopics), explicitly labeled with `kind: "guided" | "independent" | "transfer"` — the graduated-release progression is **fully respected**: E1 = guided, E2 = independent, E3 = transfer for every subtopic. Each exercise carries `instruction`, `hint`, `hints[]` (3 graduated hints), `edgeCases[]`, `tests`, `feedback`, `starterCode` with a deliberate bug, and `solutionCode` with expected `output`. The `weDo.intro` (L657) explicitly states the support-decreasing contract: *"guiada → independiente → transferencia"*.
- **You Do** (`youDo`, L1549–1685): A real capstone skeleton (`starterCode`, 100+ lines) with 5 objectives, 5 requirements, an 8-criterion weighted rubric, and a `portfolioNote` describing what the README must document. The skeleton uses `raise NotImplementedError(...)` placeholders — the convention is good (Pythonic), the `# TODO:` comments are the only blemish (Issue 3.2).
- **Self Check** (`selfCheck`, L1686–1751): 9 MCQs covering every subtopic. Each has 4 options, `correctIndex`, and an `explanation` of 1–3 sentences. Questions test the right things: ER scope (Q1), candidate recall (Q2), missing ≠ disagree (Q3), OR vs AND blocking (Q4), banda gris (Q5), entity split (Q6), score interpretation (Q7), filter_before_score (Q8), pair completeness (Q9).

**Connective tissue (strong).** Every subtopic ends with a forward link to the next: T1-A → "T1-B te enseña a no tratarlo como desacuerdo" (L48); T1-B → "T2 ataca el problema de escala" (L112); T2-A → "T2-B completa el cuadro con costo y pares imposibles" (L150); T2-B → "T3 define cómo puntuar y decidir" (L197); T3-A → "T3-B cierra el loop operativo" (L231); T3-B → "T4 mide si ese motor generaliza sin leakage" (L271); T4-A → "T4-B convierte predicciones y clusters en métricas y slices de error" (L318); T4-B → "el You Do ensambla el motor CP-N3-A completo" (L365). The theory opener (L32) also threads S27/S28/S29 (prerequisites) → S30 → S31 (successor). This is among the best-connective-tissue sections in the campaign.

**Progressive disclosure (excellent).** Theory opens with a 3-idea seed (L30: ER scope, score-prioritizes-not-labels, blocking+recall), then a section closure contract (L31), then the prerequisite/successor thread (L32), then the T1→T4 ordering (L33). Each theory block follows the same rhythm: opening hook → definition → demo code → callout. Cognitive scaffolding is consistent.

**Cognitive load (good).** Average FH 65.5 is appropriate for senior-level technical Spanish. The 4 long sentences (Issue 3.7) are the only structural load concern, and 2 of them are list-like.

### 5.2 Redaction quality

- **Tone:** confident teacher voice ("Cierras **CP-N3-A**", "Entregas un motor **testeable**", "Te demuestro el cierre..."), never condescending, never hype. Matches the "español peruano profesional" target.
- **Terminology discipline:** the section establishes a small, reused vocabulary (`CASO-LIM-030`, `auto_match`/`review`/`non_match`, `filter_before_score`, `missing`/`agree`/`disagree`, `pair completeness`/`pair quality`, `candidate recall`, `cluster`, `cola clerical`, `Union-Find`) and uses it consistently across theory, demos, exercises, and self-checks.
- **Honesty labels:** the section repeatedly flags its own didactic simplifications — e.g. *"Etiqueta honesta: simplificación didáctica, no 'FS en producción'"* (L229), *"Aquí usamos base/frecuencia como heurística didáctica, no como estimación m/u completa"* (L112). This is excellent redaction practice.
- **Ethical guardrail:** the "ER ≠ fraude/parentesco" message is repeated at the right cadence (intro callout L39, theory L30/L31, callout L141, callout L262, weDo intros L657, weDo feedback L1278/L1315, youDo context L1552, youDo rubric L1683, selfCheck Q1/Q7) — present but not noisy.
- **Blemishes:** the 3 grammar slips (Issues 3.3, 3.4, 3.5) and the surname inconsistency (Issue 3.6) are the only redaction defects in 334 sentences (~0.9% defect rate). This is well below the campaign median.

### 5.3 Exercise and exam alignment

- 24 weDo exercises map 1:1 to theory subtopics (3 per subtopic, in guided/independent/transfer order). Each exercise's `subtopicId` matches a theory `subtopicId`.
- The I Do demos are *exactly* the same 8 subtopics as the We Do exercises — the demo is the model, the exercise is the practice. Clean alignment.
- Each exercise has a `tests` field with the contract `"salida coincide con solution output"` — minimal but honest. The `solutionCode` includes a runnable `output` that the harness can diff against.
- The You Do rubric (8 criteria, weighted 25/20/20/15/10/10/recomendado/ético) matches the learning outcomes (8 outcomes, L17–24). The two "soft" criteria (`recomendado`, `ético`) are nicely distinguished from the numeric weights.
- Self-check 9 questions cover: scope (Q1), candidate recall (Q2), missing (Q3), OR/AND blocking (Q4), banda gris (Q5), entity split (Q6), score semantics (Q7), filter_before_score (Q8), pair completeness (Q9). Every subtopic is represented. Distractors are plausible (e.g. Q1 distractor "Riesgo crediticio" matches the "no fraude/parentesco" ethical line).

### 5.4 Comparison with best-in-class external materials

The external resources listed in `resources.docs` (Wikipedia Record linkage, splink docs, splink Blocking, Fellegi–Sunter overview, Robin Linacre intro, RapidFuzz, dedupe library) and `resources.books` (Christen — Data Matching; Fellegi–Sunter papers) are the canonical references for probabilistic ER. The section's didactic model (`score = sum(sim·peso)/sum(pesos)` as a stand-in for `log₂(m/u)` weights, with explicit "simplificación didáctica" labels) is honest and matches the way Robin Linacre's *Intro to Probabilistic Linkage* teaches the intuition before the full FS math. The blocking + candidate recall + cost + filter_before_score pipeline is the same one splink teaches. **The section is competitive with — and in some pedagogical respects clearer than — the external references**, especially in its insistence on measuring candidate recall against a synthetic gold and on the ethical boundary (ER ≠ fraud).

---

## 6. Grammatical improvements and rewriting report (paragraph by paragraph)

Method note (per the grammar subplan): every learner-facing Spanish sentence (334 sentences across 228 records) was scored with Fernández-Huerta (FH) and INFLESZ formulas, plus 13 pedagogical heuristics (run-on, long, missing terminal, missing inverted marks, unbalanced delimiters, repeated word, double space, space-before-punct, gerund pile-up, high comma density, anaphoric monotony, English-dominant, meta-leak). LanguageTool `es` was run on the cleaned prose (15,837 chars, one chunk). Aggregate metrics are in §2. Only paragraphs/sentences with actual findings are rewritten below; the rest are clean.

### 6.1 Theory tab

#### Paragraph 1 (L30, theory[0].paragraphs[0]) — clean
> "**Antes de T1, tres ideas base** (no memorices el resto aún). **Entity resolution (ER)** responde solo *¿dos registros apuntan a la misma entidad del mundo real?* Un **score de matching** no es veredicto de fraude ni de parentesco: solo **prioriza** la cola de revisión clerical. **Blocking** es la regla que reduce el espacio de pares antes del scorer; sin **candidate recall** medido sobre gold sintético, no sabes si el motor "pierde" matches reales."
**Metrics:** 4 sentences, WPS 18.2, FH 68.0 (normal). No findings. **No rewrite.**

#### Paragraph 2 (L31, theory[0].paragraphs[1]) — clean
> "**S30 cierra CP-N3-A.** Entregas un motor **testeable**: benchmark etiquetado sintético (`CASO-LIM-030`, contactos Lima `@example.pe`), comparadores explicables, blocking con recall medido, umbrales `auto_match | review | non_match` y métricas honestas. Contrato de salida: decisión + explicación por campo. Falta gold o blocking sin recall = error de diseño, no "métrica opcional"."
**Metrics:** 4 sentences, WPS 10.8, FH 62.8. No findings. **No rewrite.**

#### Paragraph 3 (L32, theory[0].paragraphs[2]) — clean
> "Hilo S29 → S30 → S31: el almacén SQL de pares/decisiones (S29) alimenta este motor; la fusión de entidades usa **Union-Find**; en S31 esos nodos de entidad alimentan el grafo de evidencia. Integra tests (S27) y propiedades (S28) en la suite del portfolio."
**Metrics:** 2 sentences, WPS 21.5, FH 66.7. No findings. **No rewrite.**

#### Paragraph 4 (L33, theory[0].paragraphs[3]) — **LONG (40 w)** — minor rewrite proposed
**Before:**
> "Orden pedagógico: **T1 Comparadores** (exact/edit/token/fecha → missing y frecuencia) → **T2 Blocking y costo** (claves, candidate recall, pares imposibles) → **T3 Matching** (pesos didácticos, umbrales, cola clerical, clusters) → **T4 Evaluación** (split por entidad, P/R/F1, pair completeness, error slices). Ritmo sugerido (~18 h): sesiones 1–3 en T1; 4–6 en T2; 7–10 en T3; 11–14 en T4 + You Do; 15–18 pulen tests, README y demos del portfolio."
**After (split first sentence at → T2):**
> "Orden pedagógico: **T1 Comparadores** (exact/edit/token/fecha → missing y frecuencia). Luego **T2 Blocking y costo** (claves, candidate recall, pares imposibles) → **T3 Matching** (pesos didácticos, umbrales, cola clerical, clusters) → **T4 Evaluación** (split por entidad, P/R/F1, pair completeness, error slices). Ritmo sugerido (~18 h): sesiones 1–3 en T1; 4–6 en T2; 7–10 en T3; 11–14 en T4 + You Do; 15–18 pulen tests, README y demos del portfolio."
**Rationale:** Drops the 40-word sentence to two sentences (18 + 22 w). Keeps all content. FH improves from 28.0 to ~45.

#### Paragraph 5 (L46, theory[1].paragraphs[0]) — clean
> "Tras el mapa de la sección, el primer ladrillo del motor son los **comparadores**. **Exact**: igualdad **después** de normalizar (`casefold` + colapsar espacios). **Edit** (Levenshtein normalizado): typos y diferencias de acentos leves. **Token**: Jaccard u overlap de palabras (orden "Ana López" / "López Ana"). **Fecha**: distancia en días con tolerancia. Cada uno aporta evidencia de identidad, no un veredicto de riesgo."
**Metrics:** 6 sentences, WPS 9.7, FH 52.9. No findings. **No rewrite.**

#### Paragraph 6 (L47, theory[1].paragraphs[1]) — clean
> "Cada comparador devuelve un score en **[0,1]** o un nivel ordinal (`agree` / `disagree` / `missing`) listo para un modelo tipo **Fellegi–Sunter didáctico**: aquí usamos promedio ponderado de similitudes. El FS completo usa log₂(m/u) y prior λ (ver recursos de Linacre/Splink); no digas "sé FS" solo por promediar pesos. Mezclar escalas sin normalizar invalida los umbrales de `auto_match` / `review`."
**Metrics:** 3 sentences, WPS 18.0, FH 58.3. No findings. **No rewrite.**

#### Paragraph 7 (L48, theory[1].paragraphs[2]) — clean
> "Para auditoría clerical guarda **campo + función + aporte**. Sin vector de aportes, un 0.91 opaco no se puede cuestionar. En `CASO-LIM-030`, email exacto y nombre con tokens reordenados son el primer humo de un match candidato. Cuando un campo falta, T1-B te enseña a no tratarlo como desacuerdo."
**Metrics:** 4 sentences, WPS 11.5, FH 60.5. No findings. **No rewrite.**

#### Paragraph 8 (L110, theory[2].paragraphs[0]) — clean
> "Los comparadores de T1-A asumen que ambos lados tienen valor. **Ausencia de campo (missingness)**: un vacío no es desacuerdo fuerte ni acuerdo. Usa el estado `missing` en la comparación (no lo trates como `disagree`). Si penalizas missing como desacuerdo, inflas non-matches espurios cuando una fuente simplemente no trae el campo."
**Metrics:** 4 sentences, WPS 12.5, FH 61.8. No findings. **No rewrite.**

#### Paragraph 9 (L111, theory[2].paragraphs[1]) — clean
> "La ausencia puede ser **informativa**: ciertas fuentes nunca publican teléfono. Modela el patrón por fuente (`source_system`); no asumas **MCAR** (missing completely at random: aleatorio completo) sin evidencia. En el scorer, un `missing` suele contribuir 0 al peso de ese campo en lugar de empujar hacia `non_match`."
**Metrics:** 3 sentences, WPS 14.0, FH 49.6. No findings. **No rewrite.**

#### Paragraph 10 (L112, theory[2].paragraphs[2]) — clean
> "**Frecuencia**: valores muy comunes (nombre "María", dominio genérico) bajan el peso de un acuerdo exacto — intuición de *u-probability* alta en Fellegi–Sunter. Aquí usamos `base/frecuencia` como **heurística didáctica**, no como estimación m/u completa. En contactos Lima sintéticos, un acuerdo en "María" pesa menos que en un apellido raro. Con comparadores y missing listos, T2 ataca el problema de escala: no puedes comparar all-pairs."
**Metrics:** 4 sentences, WPS 16.2, FH 49.9. No findings. **No rewrite.**

#### Paragraph 11 (L148, theory[3].paragraphs[0]) — clean
> "Con T1 listo, el cuello de botella es la escala. **Blocking** (bloqueo de candidatos) reduce el espacio de pares: solo comparas registros que comparten una clave (apellido normalizado + prefijo de ciudad, local-part de email, últimos dígitos de teléfono, etc.). Sin blocking, all-pairs es O(n²) e inviable a escala."
**Metrics:** 3 sentences, WPS 17.0, FH 77.2. No findings. **No rewrite.**

#### Paragraph 12 (L149, theory[3].paragraphs[1]) — clean
> "**Candidate recall** (recall de candidatos): de los pares verdaderamente match en el **gold** sintético (conjunto etiquetado de referencia), ¿qué fracción pasó el blocking? Si ese recall es bajo, el scorer nunca ve el match — y ninguna métrica posterior lo salva. Mide con etiquetas sintéticas **antes** de "optimizar" CPU."
**Metrics:** 3 sentences, WPS 16.0, FH 56.5. No findings. **No rewrite.**

#### Paragraph 13 (L150, theory[3].paragraphs[2]) — **Issue 3.3** (missing comma before *pero*) — rewrite
**Before:**
> "Reglas en **unión (OR)** suben candidate recall; **intersección (AND)** reduce candidatos pero puede matar recall de gold matches. En el demo de abajo el recall es **0.0 a propósito**: `López` y `lopez` generan claves distintas sin plegado de acentos. Primero normaliza (`casefold` + fold de tildes); luego mide. T2-B completa el cuadro con costo y pares imposibles."
**After:**
> "Reglas en **unión (OR)** suben candidate recall; **intersección (AND)** reduce candidatos**,** pero puede matar recall de gold matches. En el demo de abajo el recall es **0.0 a propósito**: `López` y `lopez` generan claves distintas sin plegado de acentos. Primero normaliza (`casefold` + fold de tildes); luego mide. T2-B completa el cuadro con costo y pares imposibles."
**Rationale:** RAE rule: comma before *pero* joining two clauses with verbs. Single character insert.

#### Paragraph 14 (L195, theory[4].paragraphs[0]) — clean
> "Candidate recall alto no basta si el bloque es monstruoso. El **costo** de comparación es O(suma n_b·(n_b−1)/2) por bloque. Una clave débil (solo ciudad "Lima") mete decenas de miles de registros en un bloque y explota CPU/memoria. Monitorea el tamaño máximo de bloque como **SLO** de diseño y redefine la clave antes de escalar el batch nocturno."
**Metrics:** 4 sentences, WPS 15.5, FH 73.8. (Issue 3.11 "Monitorea" — anglicism, acceptable.) **No rewrite required** (optional: *Monitorea* → *Vigila*).

#### Paragraph 15 (L196, theory[4].paragraphs[1]) — clean
> "**Pares imposibles**: reglas de exclusión (tipo persona vs organización, fechas de nacimiento incompatibles en el fixture sintético) evitan gastar scorer en lo incomparable. El filtro corre **antes** del scorer pesado: política `filter_before_score` (filtrar antes de puntuar), no un post-filtro cosmético."
**Metrics:** 2 sentences, WPS 20.0, FH 46.9. (Issue 3.8 "vs" — minor style.) **No rewrite required.**

#### Paragraph 16 (L197, theory[4].paragraphs[2]) — clean
> "Pipeline sano: blocking → filtro de imposibles → scorer → umbrales. Si inviertes el orden, pagas similitudes caras (distancia de edición, conjuntos de tokens) que nunca debieron calcularse. En `CASO-LIM-030`, person vs org se descarta sin invocar edit distance ni saturar la cola clerical. Con candidatos viables, T3 define cómo puntuar y decidir."
**Metrics:** 4 sentences, WPS 12.2, FH 55.0. No findings. **No rewrite.**

#### Paragraph 17 (L229, theory[5].paragraphs[0]) — clean
> "Los candidatos de T2 llegan al **scorer**. Modelo **didáctico** de esta sección: `score = suma(sim·peso) / suma(pesos)` sobre similitudes en [0,1]. El modelo Fellegi–Sunter completo usa prior λ y pesos log₂(m/u) por acuerdo/desacuerdo; aquí priorizamos intuición operativa y umbrales duales. Etiqueta honesta: *simplificación didáctica*, no "FS en producción"."
**Metrics:** 4 sentences, WPS 11.2, FH 45.2. No findings. **No rewrite.**

#### Paragraph 18 (L230, theory[5].paragraphs[1]) — clean
> "**Umbrales duales**: `auto_match` si score ≥ `t_high`; `non_match` si score ≤ `t_low`; en medio → **review** (revisión clerical / cola humana). Nunca `auto_fraud`. Un `t_high` alto reduce falsos positivos que molestan a operaciones; la banda gris va a humanos con explicación por campo."
**Metrics:** 3 sentences, WPS 11.0, FH 63.7. No findings. **No rewrite.**

#### Paragraph 19 (L231, theory[5].paragraphs[2]) — **Issue 3.4** (adjective agreement) — rewrite
**Before:**
> "Estima pesos con frecuencias o a mano **documentado**; valida en gold sintético (T4) sin leakage de entidad. Un score 0.875 con phone en 0.0 debe aterrizar en `review`, no en `auto_match` ciego. T3-B cierra el loop operativo: cola clerical y clusters transitivos."
**After:**
> "Estima pesos con frecuencias o a mano **de forma documentada**; valida en gold sintético (T4) sin leakage de entidad. Un score 0.875 con phone en 0.0 debe aterrizar en `review`, no en `auto_match` ciego. T3-B cierra el loop operativo: cola clerical y clusters transitivos."
**Rationale:** *documentado* (singular) does not agree with *pesos* (plural). Adverbial phrase *de forma documentada* sidesteps the agreement issue and reads more naturally. (Alternative: *…o a mano, **documentados**;*)

#### Paragraph 20 (L269, theory[6].paragraphs[0]) — clean
> "Decidir un par no termina el trabajo: hay que **calibrar** y **fusionar** con honestidad. **Calibración**: ajusta pesos o umbrales con pares etiquetados **sintéticos** (sin PII real). Aquí "entrenamiento" significa calibración supervisada de un scorer interpretable, no un black-box que invente labels de riesgo o parentesco."
**Metrics:** 3 sentences, WPS 15.3, FH 46.1. No findings. **No rewrite.**

#### Paragraph 21 (L270, theory[6].paragraphs[1]) — clean
> "**Cola clerical (clerical review)**: cada ítem lleva score, explicación por campo y acciones `match` / `non_match` / `uncertain`, más actor y timestamp. El espacio de labels de ER **no incluye** `fraud`: eso es otra tarea del path de investigación y se filtra en el borde del sistema."
**Metrics:** 2 sentences, WPS 20.5, FH 63.4. No findings. **No rewrite.**

#### Paragraph 22 (L271, theory[6].paragraphs[2]) — **Issue 3.9** (Spanglish) — optional rewrite
**Before:**
> "**Consistencia de cluster**: si A=B y B=C entonces A=C en la misma entidad. Resuelve uniones con **Union-Find** y revisa contradicciones (A=B, B≠C, A=C) antes de exportar nodos a S31. En el demo, un approve clerical de e3–e4 cierra el cluster e1…e4 de forma transitiva. T4 mide si ese motor generaliza sin leakage."
**After (optional):**
> "**Consistencia de cluster**: si A=B y B=C entonces A=C en la misma entidad. Resuelve uniones con **Union-Find** y revisa contradicciones (A=B, B≠C, A=C) antes de exportar nodos a S31. En el demo, una **aprobación clerical** de e3–e4 cierra el cluster e1…e4 de forma transitiva. T4 mide si ese motor generaliza sin leakage."
**Rationale:** *approve clerical* → *aprobación clerical* (Spanish noun phrase). Same fix applies to L432 and L562.

#### Paragraph 23 (L316, theory[7].paragraphs[0]) — **LONG (33 w)** — borderline; **No rewrite required**
> "Sin evaluación honesta, el motor de T3 es teatro. El **benchmark etiquetado** tiene pares match/non-match **sintéticos**. Nunca uses el mismo par (ni la misma entidad) en train y test de umbrales sin control: eso es leakage de identidad (fuga de identidad) e infla métricas del motor de forma engañosa."
**Metrics:** 3 sentences, WPS 17.0, FH 63.7. The 33-word third sentence is a single warning with an apposition; splitting would weaken the warning. **No rewrite.**

#### Paragraph 24 (L317, theory[7].paragraphs[1]) — clean
> "**Split por entidad**: si una entidad aparece en train, sus pares no deben filtrar a test. Un split aleatorio de pares con entidades compartidas es el error clásico que "mejora" el F1 en el notebook y falla cuando llegan contactos nuevos en producción."
**Metrics:** 2 sentences, WPS 21.5, FH 68.8. No findings. **No rewrite.**

#### Paragraph 25 (L318, theory[7].paragraphs[2]) — clean
> "Documenta tamaños de split y **prevalencia** (base rate) de matches — suele ser baja: pocos matches reales entre muchos non-matches. En `CASO-LIM-030`, reporta match rate del gold junto al candidate recall del blocking y a P/R en el hold-out de entidades. T4-B convierte predicciones y clusters en métricas y slices de error."
**Metrics:** 3 sentences, WPS 18.0, FH 75.6. No findings. **No rewrite.**

#### Paragraph 26 (L363, theory[8].paragraphs[0]) — clean
> "Con el split de T4-A, mide lo que el motor predice. **Pairwise** (par a par): precisión, recall y F1 sobre pares predichos vs gold. Un F1 pairwise alto puede esconder clusters partidos o fusionados de más. Por eso reportas también una vista de **cluster**."
**Metrics:** 4 sentences, WPS 11.2, FH 85.1. No findings. **No rewrite.**

#### Paragraph 27 (L364, theory[8].paragraphs[1]) — **LONG (39 w)** — rewrite proposed
**Before:**
> "**Cluster (simplificado didáctico)**: *pair completeness* ≈ fracción de pares gold match que el sistema mantiene en el mismo cluster (recall de uniones); *pair quality* ≈ fracción de pares predichos como co-cluster que son match en el gold (precisión de uniones). En el demo calculas ambas sobre Union-Find sintético; no es toda la literatura de clustering metrics, pero ya no es solo un nombre en el párrafo."
**After (split at the semicolon):**
> "**Cluster (simplificado didáctico)**: *pair completeness* ≈ fracción de pares gold match que el sistema mantiene en el mismo cluster (recall de uniones). *Pair quality* ≈ fracción de pares predichos como co-cluster que son match en el gold (precisión de uniones). En el demo calculas ambas sobre Union-Find sintético; no es toda la literatura de clustering metrics, pero ya no es solo un nombre en el párrafo."
**Rationale:** Splitting the 39-word sentence at the semicolon yields two ~18-word sentences, each carrying one definition. FH improves from 40.9 to ~55.

#### Paragraph 28 (L365, theory[8].paragraphs[2]) — clean
> "**Error slices** (rebanadas de error): corta fallos por fuente, apellido frecuente, teléfono ausente, ciudad. Encuentra fallas sistemáticas sin convertir un error de matching en acusación de fraude. El índice de error del demo es la semilla de un slice (`missing_phone`, `common_last_name`, …). Con T1–T4 cerrados, el You Do ensambla el motor CP-N3-A completo."
**Metrics:** 4 sentences, WPS 13.2, FH 72.8. No findings. **No rewrite.**

### 6.2 I Do (Yo hago) tab

#### `iDo.intro` (L432) — **Issues 3.7 (long, 44w) + 3.9 (approve clerical)** — rewrite
**Before:**
> "Te demuestro el cierre de CP-N3-A en ocho demos alineadas a T1–T4: comparadores con normalización, missing/frecuencia, blocking con candidate recall calculado, costo e imposibles, score+umbrales, Union-Find con approve clerical, split por entidad y métricas con índices de error. Corre cada demo; la salida debe coincidir con lo declarado. Ningún score infiere fraude."
**After:**
> "Te demuestro el cierre de CP-N3-A en ocho demos alineadas a T1–T4: comparadores con normalización, missing/frecuencia, blocking con candidate recall calculado, costo e imposibles, score + umbrales, Union-Find con **aprobación clerical**, split por entidad y métricas con índices de error. Corre cada demo; la salida debe coincidir con lo declarado. Ningún score infiere fraude."
**Rationale:** (a) *approve clerical* → *aprobación clerical* (Spanish noun). (b) *score+umbrales* → *score + umbrales* (spaces around `+` for prose readability). The 44-word first sentence is kept as a single enumeration; splitting would fragment the demo list. FH for the sentence stays at ~30 but the list-like structure makes it readable.

#### `iDo.steps[0].description` (L438) — **Issue 3.6** (Lopez without accent) — rewrite
**Before:**
> `description: "Exact post-normalización (email con distinta capitalización) y Jaccard de tokens con orden invertido ("Ana Lopez" / "Lopez Ana")."`
**After:**
> `description: "Exact post-normalización (email con distinta capitalización) y Jaccard de tokens con orden invertido ("Ana López" / "López Ana")."`
**Rationale:** Match the spelling used in theory L46 and theory code L91. The token-Jaccard demo result is unchanged (sets of tokens are identical with/without accent).

#### `iDo.steps[0].code` (L452) — **Issue 3.6** (continued) — rewrite
**Before:** `j = round(jac("Ana Lopez", "Lopez Ana"), 2)`
**After:**  `j = round(jac("Ana López", "López Ana"), 2)`
**Rationale:** Same as above. Output `token_jaccard 1.0` is unchanged.

#### `iDo.steps[5].description` (L562) — **Issue 3.9** (approve clerical) — rewrite
**Before:** `"Union-Find: auto-matches e1–e2–e3 más un approve clerical e3–e4 cierran el cluster."`
**After:** `"Union-Find: auto-matches e1–e2–e3 más una aprobación clerical e3–e4 cierran el cluster."`

All other I Do `description` and `why` fields are clean (verified by metrics).

### 6.3 We Do (Hacemos juntos) tab

#### `weDo.intro` (L657) — clean
> "Practicamos las mismas habilidades de las demos I Do, con soporte decreciente (guiada → independiente → transferencia). Cada starter tiene un error deliberado; corrígelo hasta que la salida coincida con la esperada. Solo datos sintéticos de `CASO-LIM-030`; no etiquetas fraude ni parentesco."
**Metrics:** 3 sentences, WPS 17.0, FH 70+ . No findings. **No rewrite.**

#### `weDo.steps[S30-T3-B-E3].feedback` (L1315) — **Issue 3.5** (missing article) — rewrite
**Before:**
> `"El motor ER solo decide misma entidad; filtra labels ajenos en el borde del sistema."`
**After:**
> `"El motor ER solo decide si dos registros son la misma entidad; filtra labels ajenos en el borde del sistema."`
**Rationale:** *decide misma entidad* is ungrammatical (missing determiner). The repair mirrors the framing used everywhere else in the section (theory L30, selfCheck Q1).

All other We Do `instruction`, `hint`, `hints`, `feedback`, `edgeCases`, `tests` fields are clean of grammar defects. The `tests` field is uniformly `"salida coincide con solution output"` (no terminal period — intentional contract string, not prose).

### 6.4 You Do (Tú haces) tab

#### `youDo.context` (L1552) — clean
> "Implementa el motor ER sintético de cierre de **CP-N3-A**: comparadores explicables, blocking con candidate recall medido, scorer con umbrales auto_match/review/non_match, cola clerical, clusters (Union-Find) y evaluación pairwise con split por entidad y error slices. Solo benchmark sintético (`CASO-LIM-030`). ER responde "¿misma entidad?"; no infiere relación ni riesgo/fraude."
**Metrics:** 3 sentences, WPS 26.7, FH 50+. No findings. **No rewrite.**

#### `youDo.starterCode` (L1567–1672) — **Issue 3.2** (TODO markers) — rewrite
Replace each `# TODO:` with a learner-facing Spanish cue:

| Line | Before | After |
|---|---|---|
| 1591 | `# TODO: Levenshtein normalizado (ver theory T1-A)` | `# Tu implementación: Levenshtein normalizado (ver theory T1-A)` |
| 1595 | `# TODO: 1.0 / 0.5 / 0.0 según tolerancia` | `# Tu implementación: 1.0 / 0.5 / 0.0 según tolerancia` |
| 1599 | `# TODO: missing \| agree \| disagree` | `# Tu implementación: missing \| agree \| disagree` |
| 1646 | `# TODO: train si ambas entidades ⊆ train_entities` | `# Tu implementación: train si ambas entidades ⊆ train_entities` |
| 1650 | `# TODO: precision, recall, f1` | `# Tu implementación: precision, recall, f1` |
| 1654 | `# TODO: slices con más errores` | `# Tu implementación: slices con más errores` |

**Rationale:** `# TODO:` is a developer tracker convention; in a polished learner-facing skeleton, `# Tu implementación:` matches the section's teacher voice and reads as an instruction, not an engineering artifact. (Alternative: `# Implementa:` is shorter.)

#### `youDo.objectives`, `youDo.requirements`, `youDo.rubric`, `youDo.portfolioNote` — clean
All 5 objectives, 5 requirements, 8 rubric criteria, and the portfolio note are grammatically clean (verified by metrics; the missing-terminal counts there are intentional infinitive/bullet style, not prose).

### 6.5 Self Check (Autocheck) tab

#### `selfCheck.questions[5].options[3]` (L1725) — **Issue 3.10** (leakage without gloss) — optional rewrite
**Before:** `"Leakage de identidad entre train y test"`
**After:** `"Leakage (fuga) de identidad entre train y test"`
**Rationale:** Theory L316 introduces the term with the gloss *"leakage de identidad (fuga de identidad)"*. The option omits the gloss; the first time the learner sees "leakage" alone should not be in the answer option. Adding the parenthetical gloss mirrors the theory style. (Not blocking — the option is still semantically clear.)

#### All other self-check questions, options, and explanations — clean
The 9 questions and 36 options were all checked. Q1 option "Si dos registros son la misma entidad" uses *si* (without accent) as the conjunction "whether" — correct. The explanations average 2 sentences each, WPS ~12, FH ~70 — clean.

---

## 7. Proposed GitHub-style Diffs

All diffs are against `src/lib/course/sections/s30-security-infra.ts`. Line numbers refer to the current file.

### Diff 1 — Fix missing comma before *pero* (Issue 3.3, L150)

```diff
@@ -150,1 +150,1 @@
-        "Reglas en **unión (OR)** suben candidate recall; **intersección (AND)** reduce candidatos pero puede matar recall de gold matches. En el demo de abajo el recall es **0.0 a propósito**: `López` y `lopez` generan claves distintas sin plegado de acentos. Primero normaliza (`casefold` + fold de tildes); luego mide. T2-B completa el cuadro con costo y pares imposibles.",
+        "Reglas en **unión (OR)** suben candidate recall; **intersección (AND)** reduce candidatos, pero puede matar recall de gold matches. En el demo de abajo el recall es **0.0 a propósito**: `López` y `lopez` generan claves distintas sin plegado de acentos. Primero normaliza (`casefold` + fold de tildes); luego mide. T2-B completa el cuadro con costo y pares imposibles.",
```

### Diff 2 — Fix adjective agreement *documentado* (Issue 3.4, L231)

```diff
@@ -231,1 +231,1 @@
-        "Estima pesos con frecuencias o a mano **documentado**; valida en gold sintético (T4) sin leakage de entidad. Un score 0.875 con phone en 0.0 debe aterrizar en `review`, no en `auto_match` ciego. T3-B cierra el loop operativo: cola clerical y clusters transitivos.",
+        "Estima pesos con frecuencias o a mano **de forma documentada**; valida en gold sintético (T4) sin leakage de entidad. Un score 0.875 con phone en 0.0 debe aterrizar en `review`, no en `auto_match` ciego. T3-B cierra el loop operativo: cola clerical y clusters transitivos.",
```

### Diff 3 — Fix missing article in feedback (Issue 3.5, L1315)

```diff
@@ -1315,1 +1315,1 @@
-        feedback: "El motor ER solo decide misma entidad; filtra labels ajenos en el borde del sistema.",
+        feedback: "El motor ER solo decide si dos registros son la misma entidad; filtra labels ajenos en el borde del sistema.",
```

### Diff 4 — Fix Lopez accent inconsistency in I Do description (Issue 3.6, L438)

```diff
@@ -438,1 +438,1 @@
-        description: "Exact post-normalización (email con distinta capitalización) y Jaccard de tokens con orden invertido ("Ana Lopez" / "Lopez Ana").",
+        description: "Exact post-normalización (email con distinta capitalización) y Jaccard de tokens con orden invertido ("Ana López" / "López Ana").",
```

### Diff 5 — Fix Lopez accent inconsistency in I Do demo code (Issue 3.6, L452)

```diff
@@ -452,1 +452,1 @@
-j = round(jac("Ana Lopez", "Lopez Ana"), 2)
+j = round(jac("Ana López", "López Ana"), 2)
```

### Diff 6 — Replace TODO markers in You Do starter (Issue 3.2, L1591–1654)

```diff
@@ -1591,1 +1591,1 @@
-    # TODO: Levenshtein normalizado (ver theory T1-A)
+    # Tu implementación: Levenshtein normalizado (ver theory T1-A)
@@ -1595,1 +1595,1 @@
-    # TODO: 1.0 / 0.5 / 0.0 según tolerancia
+    # Tu implementación: 1.0 / 0.5 / 0.0 según tolerancia
@@ -1599,1 +1599,1 @@
-    # TODO: missing | agree | disagree
+    # Tu implementación: missing | agree | disagree
@@ -1646,1 +1646,1 @@
-    # TODO: train si ambas entidades ⊆ train_entities
+    # Tu implementación: train si ambas entidades ⊆ train_entities
@@ -1650,1 +1650,1 @@
-    # TODO: precision, recall, f1
+    # Tu implementación: precision, recall, f1
@@ -1654,1 +1654,1 @@
-    # TODO: slices con más errores
+    # Tu implementación: slices con más errores
```

### Diff 7 — Spanglish *approve clerical* → *aprobación clerical* (Issue 3.9, L271/L432/L562)

```diff
@@ -271,1 +271,1 @@
-        "**Consistencia de cluster**: si A=B y B=C entonces A=C en la misma entidad. Resuelve uniones con **Union-Find** y revisa contradicciones (A=B, B≠C, A=C) antes de exportar nodos a S31. En el demo, un approve clerical de e3–e4 cierra el cluster e1…e4 de forma transitiva. T4 mide si ese motor generaliza sin leakage.",
+        "**Consistencia de cluster**: si A=B y B=C entonces A=C en la misma entidad. Resuelve uniones con **Union-Find** y revisa contradicciones (A=B, B≠C, A=C) antes de exportar nodos a S31. En el demo, una aprobación clerical de e3–e4 cierra el cluster e1…e4 de forma transitiva. T4 mide si ese motor generaliza sin leakage.",
@@ -432,1 +432,1 @@
-    intro: "Te demuestro el cierre de CP-N3-A en ocho demos alineadas a T1–T4: comparadores con normalización, missing/frecuencia, blocking con candidate recall calculado, costo e imposibles, score+umbrales, Union-Find con approve clerical, split por entidad y métricas con índices de error. Corre cada demo; la salida debe coincidir con lo declarado. Ningún score infiere fraude.",
+    intro: "Te demuestro el cierre de CP-N3-A en ocho demos alineadas a T1–T4: comparadores con normalización, missing/frecuencia, blocking con candidate recall calculado, costo e imposibles, score + umbrales, Union-Find con aprobación clerical, split por entidad y métricas con índices de error. Corre cada demo; la salida debe coincidir con lo declarado. Ningún score infiere fraude.",
@@ -562,1 +562,1 @@
-        description: "Union-Find: auto-matches e1–e2–e3 más un approve clerical e3–e4 cierran el cluster.",
+        description: "Union-Find: auto-matches e1–e2–e3 más una aprobación clerical e3–e4 cierran el cluster.",
```

### Diff 8 — Split long sentence (Issue 3.7, L364)

```diff
@@ -364,1 +364,1 @@
-        "**Cluster (simplificado didáctico)**: *pair completeness* ≈ fracción de pares gold match que el sistema mantiene en el mismo cluster (recall de uniones); *pair quality* ≈ fracción de pares predichos como co-cluster que son match en el gold (precisión de uniones). En el demo calculas ambas sobre Union-Find sintético; no es toda la literatura de clustering metrics, pero ya no es solo un nombre en el párrafo.",
+        "**Cluster (simplificado didáctico)**: *pair completeness* ≈ fracción de pares gold match que el sistema mantiene en el mismo cluster (recall de uniones). *Pair quality* ≈ fracción de pares predichos como co-cluster que son match en el gold (precisión de uniones). En el demo calculas ambas sobre Union-Find sintético; no es toda la literatura de clustering metrics, pero ya no es solo un nombre en el párrafo.",
```

### Diff 9 (optional) — Split long sentence (Issue 3.7, L33)

```diff
@@ -33,1 +33,1 @@
-        "Orden pedagógico: **T1 Comparadores** (exact/edit/token/fecha → missing y frecuencia) → **T2 Blocking y costo** (claves, candidate recall, pares imposibles) → **T3 Matching** (pesos didácticos, umbrales, cola clerical, clusters) → **T4 Evaluación** (split por entidad, P/R/F1, pair completeness, error slices). Ritmo sugerido (~18 h): sesiones 1–3 en T1; 4–6 en T2; 7–10 en T3; 11–14 en T4 + You Do; 15–18 pulen tests, README y demos del portfolio.",
+        "Orden pedagógico: **T1 Comparadores** (exact/edit/token/fecha → missing y frecuencia). Luego **T2 Blocking y costo** (claves, candidate recall, pares imposibles) → **T3 Matching** (pesos didácticos, umbrales, cola clerical, clusters) → **T4 Evaluación** (split por entidad, P/R/F1, pair completeness, error slices). Ritmo sugerido (~18 h): sesiones 1–3 en T1; 4–6 en T2; 7–10 en T3; 11–14 en T4 + You Do; 15–18 pulen tests, README y demos del portfolio.",
```

### Diff 10 (optional) — Add gloss to selfCheck option (Issue 3.10, L1725)

```diff
@@ -1725,1 +1725,1 @@
-        options: ["Usar sqlite", "Blocking", "Review", "Leakage de identidad entre train y test"],
+        options: ["Usar sqlite", "Blocking", "Review", "Leakage (fuga) de identidad entre train y test"],
```

### Diff 11 (optional, maintainer-only) — Rename file and id for consistency (Issue 3.1)

This diff is **structural** and touches multiple files. It is *not* required for learner quality but is recommended for repo hygiene.

```diff
# Rename file
git mv src/lib/course/sections/s30-security-infra.ts src/lib/course/sections/s30-entity-resolution.ts

# src/lib/course/index.ts
@@ -33,1 +33,1 @@
-import { section30 } from './sections/s30-security-infra'
+import { section30 } from './sections/s30-entity-resolution'

# src/lib/course/sections/s30-entity-resolution.ts (was s30-security-infra.ts)
@@ -4,1 +4,1 @@
-  id: "security-infra",
+  id: "entity-resolution",

# src/components/course/SectionView.tsx
@@ -2452,1 +2452,1 @@
-    'security-infra': {
+    'entity-resolution': {

# src/components/course/PdfReport.tsx
@@ -70,1 +70,1 @@
-  "security-infra": '30. ER probabilístico',
+  "entity-resolution": '30. ER probabilístico',
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Diff | Effort | Impact |
|---|---|---|---|---|
| **P0** | 3.3 Missing comma before *pero* (L150) | Diff 1 | 1 char | Grammar correctness in theory prose |
| **P0** | 3.4 Adjective agreement *documentado* (L231) | Diff 2 | 1 phrase | Grammar correctness in theory prose |
| **P0** | 3.5 Missing article *decide misma entidad* (L1315) | Diff 3 | 1 phrase | Grammar correctness in feedback (high-visibility) |
| **P1** | 3.6 Surname accent inconsistency (L438, L452) | Diffs 4–5 | 2 strings | Internal consistency with theory + section's own lesson |
| **P1** | 3.2 TODO markers in You Do starter (L1591–1654) | Diff 6 | 6 comments | Meta-leak removal in learner-facing skeleton |
| **P2** | 3.9 Spanglish *approve clerical* (L271/L432/L562) | Diff 7 | 3 strings | Spanish professionalism (rubric criterion) |
| **P2** | 3.7 Long sentence split (L364) | Diff 8 | 1 sentence | Cognitive load on densest definition paragraph |
| **P3** | 3.7 Long sentence split (L33) | Diff 9 | 1 sentence | Cognitive load (cosmetic; list-like sentence reads OK) |
| **P3** | 3.10 Gloss in selfCheck option (L1725) | Diff 10 | 1 string | Terminology introduction order |
| **P3** | 3.8 `vs` without period (9 occurrences) | — | 9 chars | Stylistic typographic consistency |
| **P4** | 3.1 File/id rename (security-infra → entity-resolution) | Diff 11 | Multi-file | Repo maintainability (no learner impact) |
| **P4** | 3.11 *Monitorea* anglicism (L195, L222) | — | 2 strings | Pure-Spanish style (LatAm tech Spanish accepts *monitorea*) |
| **P4** | 3.13 Callout title "Auto-match conservador" (L260) | — | 1 string | Code/prose label consistency |

**Estimated total Fixer effort:** ~20 minutes for P0–P2 (8 string edits + 6 comment replacements + 1 sentence split); another 10 minutes for P3–P4 if pursued.

---

## 9. Graph Memory Update Notes

For the shared orchestrator context files:

- **S30 quality score: 8.4/10.** Above the campaign median for Senior-phase sections. Recommended reference for other Phase-2 sections on connective tissue and exercise alignment.
- **S30 is a "gold-standard" candidate** for: (a) I/We/You exercise alignment (24 exercises, 1:1 with theory subtopics, guided/independent/transfer discipline); (b) connective tissue (every subtopic ends with a forward link; theory opener threads prereqs → S30 → successor); (c) honest labeling of didactic simplifications.
- **S30 inherits a systemic repo pattern:** filename/id leftovers from older roadmap versions (`s14-security.ts` is NumPy content; `s22-rapidfuzz-entity.ts` is Email/approval content; `s30-security-infra.ts` is ER content). This is a graph-level defect: when the Fixer addresses S30's id (P4), it should consider a coordinated rename pass for S14 and S22 as well.
- **S30 grammar metrics** (avg FH 65.5, WPS 11.1, 0 run-on, 4 long, 0 anaphora) can serve as a **benchmark** for Senior-phase sections. Sections deviating more than ±10 FH points or with >2× the long-sentence rate should be flagged.
- **S30 has zero meta-leaks** other than the TODO convention in the You Do skeleton. The Fixer can promote the `# Tu implementación:` convention as a course-wide replacement for `# TODO:` in learner-facing starter code.
- **Roadmap drift:** the legacy master roadmap (`el_arte_de_python_roadmap_maestro_52_secciones.md`) lists Section 30 as "NLP Foundations & Embeddings", while V3 (`learning_roadmap_52_V3.md`) and the actual content agree on "Entity resolution probabilístico". The legacy roadmap should be retired or reconciled — flagged for orchestrator.

---

## Method Appendix — Grammar Subplan Application

**Research-based heuristics applied (per `_GRAMMAR_SUBPLAN.md`):**

1. **Fernández-Huerta (1959)** Spanish Flesch adaptation: `FH = 206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Bands: ≥90 muy fácil → <30 muy difícil. For technical curriculum, 50–70 is healthy.
2. **Szigriszt-Pazos / INFLESZ**: `INF = 206.835 − 62.3·(syllables/word) − (words/sentence)`.
3. **WPS / SPW** structural load metrics.
4. **LanguageTool `es`** (public API, one chunk of 15,837 chars) — rule-based grammar, spelling, typography, style.
5. **13 pedagogical heuristics** (run-on >45w, long >32w, missing terminal `.?!`, missing `¿`/`¡`, unbalanced `()[]«»`, repeated word, double space, space-before-punct, gerund pile-up ≥3, high comma density >0.12, anaphoric monotony, English-dominant, meta-leak patterns).

**Implementation.** Adapted `_s23_extract.py` → `_s30_extract.py` (228 prose records, 334 sentences). Ran `_s30_lt.py` for LanguageTool. Output: `_s30_prose.txt`, `_s30_metrics.json`, `_s30_lt_raw.json` in `/home/z/my-project/audits/`.

**False-positive classes documented:**
- 136 "missing terminal punctuation" hits are all in short labels (edgeCases, options, headings, hints, rubric criteria, learningOutcomes infinitives) — intentional non-sentence fragments. Zero missing-terminal hits in actual prose paragraphs.
- 10 "unbalanced delimiters" hits are all inside `edgeCases` strings containing legitimate Python f-strings or in `criterion` strings with parenthetical abbreviations. Zero unbalanced hits in actual prose.
- 20 "english-dominant" hits are mostly edgeCases/options with code-adjacent strings; only 2 are in paragraphs ("S30 cierra CP-N3-A." and "Nunca `auto_fraud`.") — both false positives (short sentences without Spanish function words but pure Spanish in meaning).
- LanguageTool `MORFOLOGIK_RULE_ES` (175 spelling hits) are all on English tech terms inside backticks (`exact`, `edit`, `token`, `scores`, `slices`, `match`, `gold`) — false positives because the backtick-stripping created bare English words.
- LanguageTool `WHITESPACE_RULE` and `COMMA_PARENTHESIS_WHACK` hits inside paragraphs are all artifacts of inline-code stripping (e.g., `umbrales   |   |   y métricas` was originally `umbrales \`auto_match\` | \`review\` | \`non_match\` y métricas`). The source is fine; the LT input was lossy.
- Real LanguageTool findings (after manual filtering): `ES_SIMPLE_REPLACE_SIMPLE_LOPEZ` ×2 (L438), `COMMA_PERO` ×1 (L150), `AGREEMENT_POSTPONED_ADJ` ×1 (L231), `MISMO_EL_MISMO` ×1 (L1315). All five are reproduced as P0/P1 fixes above.

**Validation.** Nonzero prose extraction (228 records, 334 sentences). FH in plausible range (avg 65.5, distribution 28–85 with most sentences in 50–80). Worst-FH sentences are all short headings/titles where the formula over-penalizes WPS — not actual readability problems.

---

**This is the complete Explorer report for Section 30. Ready for the Fixer prompt.**
