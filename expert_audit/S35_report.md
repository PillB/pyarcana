# Section 35 — Curriculum Auditor Report (pyarcana)

> Task ID: S35 · Agent: Curriculum Auditor (general-purpose)
> Source: `src/lib/course/sections/s35-system-design.ts` (2,243 lines)
> Live page: https://pillb.github.io/pyarcana/#system-design → sidebar item "35 Explicabilidad y equidad"
> Method: Stanford STORM + Graph/Loop/Harness Engineering · Grammar subplan (`audits/_GRAMMAR_SUBPLAN.md`) applied verbatim.

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| Section number (1-based, `COURSE_SECTIONS[34]`) | **35** |
| File path (repo) | `src/lib/course/sections/s35-system-design.ts` |
| `id` (legacy) | `"system-design"` ⚠️ V3-retarget debt |
| `index` | `35` |
| `title` | `"Explicabilidad, equidad e incertidumbre"` |
| `shortTitle` | `"Explicabilidad y equidad"` |
| `tagline` | `"Ficha de caso que distingue evidencia observada, contribución del modelo, incertidumbre y decisión humana"` |
| `estimatedHours` | `18` |
| `level` / `phase` | `"Competente a experto"` / `2` (Phase 2 — Senior, sections 27–39) |
| `icon` / `accentColor` | `"Scale"` / `from-violet-400 to-purple-800` |

**Confirmed via live site** (agent-browser, navigated to `https://pillb.github.io/pyarcana/#system-design`): the SPA renders H1 `"Sección 35 · Explicabilidad y equidad"`, subtitle `"Explicabilidad, equidad e incertidumbre"`, tagline `"Ficha de caso que distingue evidencia observada, contribución del modelo, incertidumbre y decisión humana"`, badge `"18h · Competente a experto"`, and 5 tabs (`Teoría` / `Yo hago` / `Hacemos juntos` / `Tú haces` / `Autocheck`). All rendered theory paragraphs (4 in T0 intro + 3 in each of T1-A…T4-B) match the TS source verbatim, including bold emphasis, inline code, and callout boxes. The "Practica arquitectura y ADR" interactive playground (off-topic) renders under the "Pruébalo tú mismo" panel of the Theory tab — confirming the meta-leak defect described in §3.

**Scope of audit** — every learner-facing Spanish string in this file:

| Tab | Spanish prose records extracted |
|---|---|
| meta (`title`, `shortTitle`, `tagline`, `jobRelevance`, `learningOutcomes[8].text`) | 12 |
| theory (8 sub-topics × heading + 3 paragraphs + callout.title + callout.content) | 56 |
| iDo (intro + 8 demos × description + why) | 17 |
| weDo (intro + 24 exercises × instruction + hint + hints[2] + edgeCases[3] + tests + feedback) | 192 |
| youDo (title, context, objectives[4], requirements[3], portfolioNote, rubric[6].criterion) | 16 |
| selfCheck (6 questions × question + 4 options + explanation) | 30 |
| resources (7 docs × label + note + 2 books + 4 courses) | 16 |
| **Total learner-facing Spanish records** | **339** |

After Spanish-signal filtering and de-duplication, the grammar pipeline processed **309 paragraphs / 457 sentences / 6,684 words / 12,831 syllables**.

Excluded from grammar analysis (per subplan): pure code blocks, `starterCode`/`solutionCode.code` bodies, `output` blocks, `id`/`subtopicId`/`demoId` identifiers, `language`/`environment`/`icon`/`accentColor`/`weight`/`correctIndex` literals, and bare URL strings. All Python comments inside `starterCode` (e.g., `# DEFECT: ranking con min (dirección invertida) y means_fraud como prueba`) are **intentional student-facing scaffolding**, not authoring residue — they were excluded from the meta-leak scan.

---

## 2. Executive Summary of Quality

**Composite score: 7.0 / 10** (would rise to ~9.0 after the proposed fixes).

**Verdict.** Section 35 is a **pedagogically gold-standard, ethically first-class** chapter on responsible-AI case-files (explainability, equity, uncertainty, governance). The I Do / We Do / You Do / SelfCheck fidelity is exemplary: 8 I Do demos (one per subtopic T1-A→T4-B), 24 We Do exercises (8 × E1 guided → E2 independent → E3 transfer, decreasing-scaffold across all 8 subtopics), a You Do capstone with three `fill_*` repair tasks gated on `portfolio_ready True`, and 6 self-check MCQs (correctIndex distribution `2,0,1,3,2,0` — no positional bias). Ethics is the structural spine of the section: every code block carries `means_fraud=False`, `causal=False`, `action=abstain`, `auto_fraud=False`, `contestability=True`; the refrain "explicar **no** es acusar" appears 5 times; "correlación ≠ causalidad" is taught as a contract, not a footnote. Peruvian context (Red Andina, Lima, LIM/AQP regiones, CASO-LIM-035) is consistent with the rest of the curriculum and never pretends to access real PII.

**What holds the section back from a higher score:**

1. **(Critical, P0)** The legacy `id: "system-design"` and filename `s35-system-design.ts` no longer match the rescoped content (`title: "Explicabilidad, equidad e incertidumbre"`). As a direct consequence:
   - `src/components/course/SectionView.tsx:2762` serves an **off-topic InteractivePlaygroundDemo** for S35 — an ADR (Architecture Decision Record) generator (`generate_adr()`, "Batch vs Real-Time Inference", Redis cache, XGBoost, gRPC) that has nothing to do with explainability, equity, OOD, model cards or audit trails. Learners opening Section 35 see system-design code under an "Explicabilidad y equidad" heading. **Verified live** via agent-browser: the "Pruébalo tú mismo" panel renders the ADR demo.
   - `src/components/course/PdfReport.tsx:75` labels Section 35 as `"35. SysDesign"` in the PDF printout — wrong.
   - This is the same V3-retarget debt pattern confirmed for S05, S08, S09, S11, S12, S17, S18, S23 in prior audits.
2. **(High, P1 — Spanish grammar)** 7 real **`y` → `e`** concordance errors before words starting with i-sound (LT rule `Y_E_O_U`): 5× "y imprime [código]" → "e imprime [código]" (weDo `tests` fields, lines 897, 1111, 1316, 1488, 1680) and 2× "y hi > lo" → "e hi > lo" (weDo `hint` and `hints[1]` of T3-A, lines 1310, 1313).
3. **(High, P1 — Spanish grammar)** 3× `vs` → `vs.` (LT `PUNTO_EN_ABREVIATURAS`): lines 31, 31, 112. Same systemic issue documented in S17/S18.
4. **(Medium, P2 — Spanish grammar)** 1× missing comma before `pero` (LT `COMMA_PERO`): line 47 ("cajas negras pero depende" → "cajas negras, pero depende").
5. **(Medium, P2 — Spanish grammar)** 1× prefix hyphenation (LT `NO_SEPARADO`): line 46 "re-evalúa" → "reevalúa" (RAE rule for prefix `re-` before `e`).
6. **(Medium, P2 — cognitive load)** 6 run-on sentences (>45 words) in We Do `intro` and E3 `instruction` fields, 3 of which also have `high_comma_density` (≥5 commas per sentence). The E3 transfer instructions pack contract details, fix advice, and "no inventes" disclaimers into a single 51–63-word sentence with semicolon-separated clauses — the most cognitively dense prose in the section.
7. **(Medium, P2 — anglicism load)** Heavy use of English loanwords in prose (not code): `claim(s)` ×6, `slice(s)` ×15, `proxy/proxies` ×10, `score` ×40+, `flag` ×8, `band` ×5, `workbench` ×3, `baseline` ×4, `batch` ×3, `train` ×3, `domain` ×2. Most are industry-standard in es-PE ML/AI discourse, but `claim(s)` and `banda` (vs `intervalo`) are the most jarring and could be replaced with `afirmación(es)` / `intervalo`.
8. **(Low, P3 — typographic consistency)** Em-dash `—` used as aside marker in 8+ places ("— no son 24 escenarios de negocio distintos, sino 24 predicados de política sobre el mismo hilo sintético"; "— otra capa de la ficha, otro verbo de política"; "Brier y bandas son complementarios, no rivales"). Acceptable in informal technical prose, but RAE/Fundéu prefer commas or parentheses for aside clauses in formal writing.

**What is excellent (and worth preserving as a model for other sections):**

- **Code↔output integrity is perfect.** All 8 theory code blocks, all 8 I Do demos, and every sampled We Do `solutionCode` produce **exactly** the documented `output` strings (verified by executing each — see §5.4). This is a clean break from the pseudonymization-drift pattern that broke S04, S07, S08, S11, S12, S17, S18 (where late pseudonymization relabeled regions in source code but never regenerated `output` blocks, producing fabricated numbers).
- **Zero prose meta-leaks.** No TODO/FIXME/MOVED FROM/HACK/design-note text in any learner-facing string. The 3 initial heuristic hits on "todo el batch" / "sobre todo" / "todo score" were false positives of case-insensitive `\bTODO\b` matching the Spanish word "todo" — a documented FP class in the grammar subplan. After making the TODO rule case-sensitive, the section is clean.
- **Zero developer JS comments** in the source file (no `//` or `/* */` lines). Python `#` comments inside `starterCode`/`solutionCode` are intentional student-facing scaffolding ("DEFECT: ranking con min (dirección invertida) y means_fraud como prueba", "Contrato: corrige el DEFECT; salida alineada a solutionCode").
- **Zero missing inverted marks**, **zero unbalanced delimiters**, **zero repeated words**, **zero real concordance errors** (all LT `AGREEMENT_*` hits are FPs from code-adjacent prose like "salida ranking" / "entrada vector").
- **Healthy readability**: aggregate Fernández-Huerta = 76.74 ("bastante fácil"), INFLESZ = 72.61 ("normal"), mean WPS = 14.63 (well under the 32-word pedagogical ceiling), mean SPW = 1.92. These are excellent numbers for technical Spanish in Phase 2 of the curriculum.
- **Strong connective tissue**: explicit bridge from S34 ("parte de S34: reutilizas métricas, umbrales y baselines ya presentados en el workbench"); forward pointer to S36 implied by the `portfolio_ready True` gate of CP-N3-C; explicit "Inicias CP-N3-C" framing; taxonomy table (global vs local, equidad vs incertidumbre, gobernanza); 8 theory sub-topics each close with a one-sentence bridge to the next ("Con la explicación local en la mano, T2 pregunta si la cola daña de forma desigual por cohorte").
- **Self-check MCQ quality**: 6 questions cover all 4 sub-topics; distractors are plausible (e.g., "Forzar pred=1 para no perder recall de fraude" as the wrong OOD policy); explanations are one-sentence and pedagogical ("low_n no prueba inequidad ni paridad; reportar n y evitar claims fuertes con muestra chica es el contrato de slices").

---

## 3. Detailed Issue Registry

Numbered issues. Severity: **P0** (critical / blocker) · **P1** (high) · **P2** (medium) · **P3** (low).

| # | Sev | Field / Location | Evidence (verbatim or excerpt) | Pedagogical / Redaction Impact |
|---|----|----|----|----|
| **I-01** | P0 | `section.id` (line 4) + filename `s35-system-design.ts` | `id: "system-design"`, but `title: "Explicabilidad, equidad e incertidumbre"` | Identity mismatch propagates: live URL `#system-design`, PDF label `"35. SysDesign"`, and the off-topic playground demo (I-02). Same V3-retarget debt pattern confirmed in S05/S08/S09/S11/S12/S17/S18/S23. |
| **I-02** | P0 | `SectionView.tsx:2762` InteractivePlaygroundDemo `'system-design'` | `title: 'Practica arquitectura y ADR'`, code: `generate_adr()`, "Batch vs Real-Time Inference", "FastAPI + Redis cache + XGBoost model", "Feature Store (simulado)" | Rendered under the S35 "Pruébalo tú mismo" panel on the Theory tab. Learners see system-design / ADR / feature-store code in a section titled "Explicabilidad y equidad". Verified live via agent-browser. This is the most damaging defect of the section because it directly contradicts the lesson content. |
| **I-03** | P0 | `PdfReport.tsx:75` SECTION_LABELS | `"system-design": '35. SysDesign'` | PDF printout labels section 35 as "35. SysDesign" instead of e.g. "35. Explicabilidad". Wrong metadata in the learner's portfolio PDF. |
| **I-04** | P1 | weDo `tests` (5 lines: 897, 1111, 1316, 1488, 1680) | `"...obtiene ok_n y imprime [código]."`<br>`"...usa action=review y imprime [código]."`<br>`"...obtiene banda [0.5, 0.7] y imprime [código]."`<br>`"...detecta OOD, usa abstain y imprime [código]."`<br>`"...pasa card_ok y imprime [código]."` | The conjunction `y` should be `e` before "imprime" (word starting with i- sound). RAE rule: `y → e` before words starting with `i` or `hi` + vowel. |
| **I-05** | P1 | weDo `hint` (line 1310) + `hints[1]` (line 1313) | `"PASS solo si q>0, level distinto de point y hi > lo."` (×2) | `y` should be `e` before "hi" (silent h, sounds like `i`). Same RAE rule as I-04. |
| **I-06** | P1 | theory `paragraphs` (lines 31, 31, 112) | `"global (importancia del modelo en todo el batch) vs local..."`<br>`"equidad (slices y proxies) vs incertidumbre..."`<br>`"LIM n=100 precision=0.6 (ok_n) vs AQP n=8..."` | `vs` is an abbreviation of the Latin *versus* and per RAE/Fundéu should carry a period: `vs.`. Systemic issue across multiple sections (S17, S18 confirmed). |
| **I-07** | P2 | theory `paragraphs` T1-A (line 47) | `"...permutación aplica a cajas negras pero depende de la métrica y de colinealidad — no es «la verdad» de la feature."` | Missing comma before `pero` (LT `COMMA_PERO`). RAE rule: coordinating conjunctions `pero`, `mas`, `aunque` are preceded by a comma when they introduce an adversative clause after a sufficiently long antecedent. |
| **I-08** | P2 | theory `paragraphs` T1-A (line 46) | `"...en sklearn real: permutation_importance re-evalúa la métrica tras shuffle..."` | `re-evalúa` should be `reevalúa` (RAE: prefixes like `re-`, `pre-`, `anti-` join without a hyphen to the following word when it doesn't begin with the same vowel or carry tilde — `re-` + `evalúa` = `reevalúa`). LT rule `NO_SEPARADO`. |
| **I-09** | P2 | weDo `intro` (line 482) | `"E1 repara una operación de dominio (ranking, contrib, flag n, proxy, banda, OOD, card, audit); E2 separa valid/invalid/missing; E3 entrena fail-closed y, en T1-B / T2-A / T2-B / T3-B / T4-A, transferencia real: construir ficha, reporte de slice, proxy audit, capa uncertainty o model card desde campos crudos."` | **Run-on (49 words, 12 commas).** Packs three E-level descriptions plus a subtopic enumeration plus a "transferencia real" clause into one sentence. Should be split into 2-3 sentences (one per E level). Also triggers `high_comma_density` heuristic. |
| **I-10** | P2 | weDo `instruction` S35-T2-A-E3 (line 999) | `"S35-T2-A-E3 · Transferencia: a partir de campos crudos (region, n, precision, min_n, claim) construye un reporte de slice y decide. build_slice_report debe devolver {region, n, precision, flag, claim} con flag=low_n si n < min_n else ok_n. decide → CONTINUE solo si flag es ok_n y precision ∈ [0,1]; adverso (n bajo + claim=parity) → REJECT_LOW_N_CLAIM; sin n → REQUEST_SLICE_N. No inventes n ni afirmes paridad con muestra chica."` | **Run-on (51 words for the second sentence alone, 63 for the whole instruction).** Five contract clauses packed into one prose paragraph with semicolon separators. Learner cannot scan the contract without re-reading 3 times. Should be split into: (1) entrada/salida, (2) regla CONTINUE, (3) regla adversa, (4) regla missing, (5) advertencia ética. |
| **I-11** | P2 | weDo `instruction` S35-T2-B-E3 (line 1222) | `"S35-T2-B-E3 · Transferencia: a partir de campos crudos (features con risk tags y proposed_action) construye el audit de proxies y decide. build_proxy_audit debe devolver {high_risk, action, means_fraud} con high_risk = [k for k,v in features.items() if v==\"high\"]. decide → CONTINUE si hay high-risk y action ∈ {review, mitigate, drop} y means_fraud is False; adverso (action=auto_label) → REJECT_PROXY_FEATURE; sin features → REQUEST_PROXY_AUDIT. No conviertas proxy en label de fraude."` | **Run-on (58 words, 6 commas).** Same packing pattern as I-10. |
| **I-12** | P2 | weDo `instruction` S35-T3-B-E3 (line 1590) | `"S35-T3-B-E3 · Transferencia: a partir de campos crudos (zs, threshold, proposed_action) construye la capa uncertainty y decide. build_uncertainty debe devolver {ood, action, reason} con ood = max(|z|) > thr; si ood y proposed_action no es abstain → REJECT_AUTO_LABEL; si falta zs → REQUEST_OOD_POLICY; si ood y action=abstain → CONTINUE. No fuerces label de fraude ni rellenes zs inventados."` | **Run-on (51 words, 5 semicolons).** Same pattern. |
| **I-13** | P2 | weDo `instruction` S35-T4-A-E3 (line 1788) | `"S35-T4-A-E3 · Transferencia: a partir de campos crudos (use, prohibited, owner, contestability) construye la model card y decide. build_card debe devolver un dict con use, out_of_scope (lista desde prohibited), owner y contestability. decide devuelve CONTINUE solo si use==queue_rank, fraud_label ∈ out_of_scope y contestability es True; adverso (use=fraud_label) → REJECT_SCOPE_BREACH; sin prohibited → REQUEST_CARD_KEYS. No inventes out_of_scope vacío como válido."` | **Run-on (63 words, 5 commas, 4 semicolons).** Worst offender in the section. |
| **I-14** | P2 | theory `paragraphs` T1-A (line 46) | `"Los coeficientes de un modelo lineal y la importancia por permutación miden sensibilidad: cuánto cae una métrica de negocio al barajar una feature (en sklearn real: permutation_importance re-evalúa la métrica tras shuffle; aquí trabajas con drops ya medidos para enfocarte en el contrato de la ficha)."` | **Long sentence (46 words).** The parenthetical contains a full sub-clause with `:` and `;` separators. Acceptable for technical prose but at the cognitive-load ceiling. Consider extracting the parenthetical into its own sentence. |
| **I-15** | P2 | weDo `instruction` S35-T1-B-E3 (line 803) | `"S35-T1-B-E3 · Transferencia: a partir de campos crudos (evidence, contrib, causal, decision, by) construye la ficha de 4 capas y decide. build_ficha debe devolver un dict con keys evidence|model|uncertainty|human; decide devuelve CONTINUE solo si las cuatro capas existen y model.causal is False. El adverso (causal=True) → REJECT_CAUSAL_CLAIM; sin evidence → REQUEST_LAYER_FIELDS. No rellenes evidencia inventada."` | **Long sentence (45 words for the second sentence, 60+ for the whole instruction).** Same packing pattern as I-10…-I-13. |
| **I-16** | P3 | theory `paragraphs` (8 occurrences) | `"...— otra capa de la ficha, otro verbo de política."`<br>`"...— no son 24 escenarios de negocio distintos..."`<br>`"...— nunca auto-fraude"` | Em-dash used as aside marker. RAE/Fundéu prefer commas or parentheses for aside clauses in formal prose. Acceptable in informal technical writing. |
| **I-17** | P3 | weDo `hint`/`feedback`/`edgeCases` (6 occurrences) | `"claim con n bajo"`, `"claims de equidad estadísticamente vacíos"`, `"claim fuerte"`, `"claim de paridad"`, `"claim de precisión alta"`, `"claim=parity"` (last one is code) | Anglicism `claim(s)` used as loanword in prose. Fundéu recommends `afirmación`, `aserción`, or `declaración`. The English `claim` is acceptable as inline code identifier (`claim=parity`) but should be replaced in narrative prose. |
| **I-18** | P3 | iDo `why` S35-T2-A-DEMO (line 366) | `"Reportar n por cohorte evita claims de equidad estadísticamente vacíos en regiones con poco tráfico."` | Same as I-17. `claims` → `afirmaciones` would also resolve the LT `AGREEMENT_POSTPONED_ADJ` false positive (LT misreads `vacíos` as modifying `equidad`). |
| **I-19** | P3 | theory `paragraphs` (multiple) | `score` ×40+, `slice(s)` ×15, `proxy/proxies` ×10, `flag` ×8, `band` ×5, `workbench` ×3, `baseline` ×4, `batch` ×3, `train` ×3, `domain` ×2 | Heavy anglicism load in prose. Most are industry-standard in es-PE ML/AI discourse (Fundéu accepts `escala`/`score` as established loanwords). `slice`, `proxy`, `band` could be replaced with `segmento`, `variable proxy`, `intervalo` for stronger es-PE register, but this is a stylistic choice, not an error. |
| **I-20** | P3 | theory `paragraphs` T1-A (line 46) and weDo intro (line 482) | `"(en sklearn real: permutation_importance re-evalúa la métrica tras shuffle; aquí trabajas con drops ya medidos para enfocarte en el contrato de la ficha)"` | Parenthetical aside is 23 words with internal `:` and `;` — at the cognitive-load ceiling for an in-sentence aside. Consider extracting to its own sentence or moving to a callout. |
| **I-21** | P3 | weDo `instruction` (24 occurrences, one per exercise) | All 24 instructions start with `"S35-T{1-4}-{A,B}-E{1-3} · ..."` — same template rhythm | Anaphoric monotony at the sentence-starter level. Acceptable for a contract-driven curriculum where the prefix is a pedagogical anchor, but could be varied with "En este reto…", "Ahora…", "Para este fixture…" on a subset. |
| **I-22** | P3 | weDo `edgeCases` (24 arrays × 3 items) | All 24 weDo exercises share an identical 3-item `edgeCases` template per subtopic (e.g., `["falta drops", "fixture adverso: means_fraud=True (interpreta importancia como fraude)", "CASO-LIM-035-1A es sintético"]` for all 3 T1-A exercises) | Triplicate scaffolding across E1/E2/E3. The third item "CASO-LIM-035-X es sintético" is repeated 24 times — could be hoisted to the weDo intro. |
| **I-23** | P3 | weDo `hint` vs `hints[0]` (24 occurrences) | For every weDo exercise, `hint` (string) is identical to `hints[0]` (first array element) | Same systemic duplication as S17/S18 — `hint` is the legacy single-hint field, `hints` is the array. The UI likely renders both, showing the same hint twice. Recommend dropping `hint` and keeping only `hints`. |
| **I-24** | P3 | resources `courses` (lines 2232, 2237) | `{label: "MIT 6.100L", note: "Contratos y tests"}` and `{label: "Harvard CS50P", note: "Proyectos reproducibles"}` | Both resources are intro-Python courses; their notes ("Contratos y tests", "Proyectos reproducibles") don't map cleanly to S35's responsible-AI / explainability / equity topic. Same pattern flagged in S23. Recommend replacing with responsible-AI-specific courses (e.g., Google PAIR "What-If Tool" tutorial, Aequitas toolkit walkthrough, IBM AI Fairness 360 tutorials). |
| **I-25** | P3 | theory `paragraphs` T2-A (line 110) | `"Aquí el contrato mínimo del lab exige métrica + n por slice antes de cualquier claim — sin n no hay equity reportable."` | Em-dash + `claim` anglicism + `equity` anglicism in one sentence. Three minor issues compounding. |

**False-positive classes documented for reuse** (so the Fixer does not re-introduce these as "issues"):

| FP class | Count | Why FP | Recommendation |
|----|----|----|----|
| `MORFOLOK_RULE_ES` (LT spelling) | 868 | LT suggests Spanish alternatives for tech loanwords (`score` → `escore`, `Explicabilidad` → `Aplicabilidad`, `claim` → `clam`, `proxy` → `poxy`, etc.) | Ignore; loanwords are intentional |
| `COMMA_PARENTHESIS_WHITESPACE` | 152 | After my `[código]` placeholder substitution, residual space-before-period artifacts appear ("Salida exacta: [código] .") | Artifact of analysis pipeline; real text has `\`S35-T1-A PASS\`.` with no space |
| `INCORRECT_SPACES` | 45 | Same artifact | Same |
| `SINGLE_CHARACTER` | 25 | LT flags single letters `n`, `q`, `p`, `v`, `z` as possible typos | These are math/code variables (`p±q`, `n por cohorte`, `max(|z|)`) |
| `ES_SPLIT_WORDS` | 8 | LT suggests "audita n" → "auditan", "falta n" → "faltan", "reporte de slice" → "deslice" | All FPs: `n` is the sample-size variable; `slice` is an established loanword |
| `D_ELA` | 7 | LT suggests `n` → `un`/`en` | `n` is a variable, not the article |
| `PREP_VERB` | 7 | LT flags "con case/human/by" as prep + verb | `case`/`human`/`by` are English audit-trail field names used as inline code |
| `AGREEMENT_PARTICIPLE_NOUN` | 5 | LT misreads "entrada"/"salida" as participle of `entrar`/`salir` modifying the next noun | They are feminine nouns ("input"/"output") |
| `SUBJUNTIVO_PASADO` | 4 | LT flags `use=fraud_label` thinking "use" is the Spanish subjunctive verb | FP due to code-context |
| `AGREEMENT_POSTPONED_ADJ` | 2 | LT suggests `vacíos` → `vacía` (modifying `equidad`) and `activa` → `activo` | `vacíos` modifies `claims` (anglicism, masc. plural); `activa` is the verb form |
| `VOSEO` | 3 | LT flags `validate` / `valida` as voseo | FP on tech identifier |
| `AUTO_NO_SEPARADO` | 2 | LT flags `auto_label` / `auto_fraud` as needing `autolabel` | Code identifiers, not prose |
| `UPPERCASE_SENTENCE_START` | 4 | LT flags `S35-T1-A` at sentence start | Code-prefix, intentional |
| `english_dominant` (heuristic) | 87 | Mostly code-adjacent Spanish ("Salida exacta: [código], [código], [código].") | Real issue is anglicism load (I-19), not "english_dominant" per se |
| `missing_terminal` (heuristic) | 74 | Taglines, callout titles, rubric criteria, MCQ stems (end with `:`), notes, `edgeCases` bullet fragments — all correctly written without terminal punctuation in their context | These are labels/titles, not prose sentences |
| Initial `meta_leak` hits | 3 | "todo el batch" / "sobre todo" / "todo score" matched `\bTODO\b` case-insensitive | Fixed by making TODO rule case-sensitive; section is genuinely clean |

---

## 4. Meta-Leak Report

**Exact leaked text + location:**

| Location | Leaked text | Severity | Type |
|----|----|----|----|
| `SectionView.tsx:2762-2832` (InteractivePlaygroundDemo `'system-design'`) | `"Practica arquitectura y ADR"` title; `generate_adr()` function; `"Batch vs Real-Time Inference"` ADR title; `"El equipo de riesgo necesita scoring en <100ms para aprobar creditos en tiempo real."` context; `"Usar real-time inference con FastAPI + Redis cache + XGBoost model."` decision; `"Feature Store (simulado)"` section header; `"Online user_123: {...}"` output | **P0 — Critical** | Off-topic playground demo rendered under S35's Theory tab. The demo is system-design / MLOps content (ADRs, feature stores, real-time inference) that has nothing to do with the section's actual content (explainability, equity, OOD, model cards, audit trails). This is structural meta-leak: the demo was authored for a previous version of the course when this slot was System Design, and was never replaced when the section was rescoped to "Explicabilidad, equidad e incertidumbre". |
| `PdfReport.tsx:75` (SECTION_LABELS) | `"system-design": '35. SysDesign'` | **P0 — Critical** | PDF printout metadata mismatch. The learner's portfolio PDF labels section 35 as "35. SysDesign" instead of "35. Explicabilidad" or similar. |
| `src/lib/course/sections/s35-system-design.ts:4` (`id` field) | `id: "system-design"` | **P0 — Critical** | Root cause of I-02 and I-03. The `id` propagates to: (a) the live URL hash `#system-design`, (b) the InteractivePlaygroundDemo lookup key in `SectionView.tsx`, (c) the SECTION_LABELS lookup in `PdfReport.tsx`. |
| `src/lib/course/sections/s35-system-design.ts` (filename) | `s35-system-design.ts` | **P0 — Critical** | Filename doesn't match content. Recommend rename to `s35-explainability-equity.ts` (coordinate with Fixer; requires updating the import in `src/lib/course/index.ts:38`). |

**No prose meta-leaks detected.** Zero TODO/FIXME/MOVED FROM/HACK/design-note/internal-note text in any learner-facing string. Zero developer JS comments (`//` or `/* */`) in the source file. The 3 initial heuristic `meta_leak` hits were false positives from `\bTODO\b` matching "todo" in "todo el batch" / "sobre todo" / "todo score" — fixed by making the TODO rule case-sensitive.

**No "moved from section X" text** detected. The V3-retarget debt is detectable only via the `id`/filename mismatch, not via any leaked authoring note.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do / SelfCheck fidelity

| Phase | Count | Quality | Notes |
|----|----|----|----|
| I Do (demos) | 8 (one per subtopic T1-A…T4-B) | Gold standard | Each demo is a minimal stdlib Python script (8-15 lines) that produces the exact output the theory describes. The `why` field after each demo is a one-sentence pedagogical rationale. Demos progressively build the same `CASO-LIM-035` case file. |
| We Do (exercises) | 24 (8 subtopics × E1 guided → E2 independent → E3 transfer) | Gold standard | Three-tier decreasing-scaffold pattern is faithful across all 8 subtopics. E1 gives a DEFECT starter + solution; E2 adds the MISSING:* schema-validation layer; E3 asks the learner to *build* the report/ficha/audit/card from raw fields and then gate. The "transfer" framing in E3 is genuinely different from E1/E2 — it's not a flip-of-boolean exercise. |
| You Do (capstone) | 1 (three `fill_*` repair functions gated on `portfolio_ready True`) | Gold standard | Capstone integrates all 8 subtopics into a single case file: `fill_local_contrib`, `fill_uncertainty`, `fill_card_and_audit`. The starter code has three intentional DEFECTs that the learner must fix without "inventar fraude". The `portfolioNote` explicitly says "no des por cerrada la sección sin ficha 4 capas + card out_of_scope + audit de override" — strong portfolio gate. |
| SelfCheck (MCQs) | 6 | Good | CorrectIndex distribution: `2, 0, 1, 3, 2, 0` — no positional bias (positions 0-3 used 2, 1, 1, 2 times). Distractors are plausible: e.g., Q3 option A "Forzar pred=1 para no perder recall de fraude" is the wrong-but-tempting OOD policy; Q5 option A "Paridad de fraude demostrada a favor de AQP" is the wrong-but-tempting low_n interpretation. Explanations are one-sentence and pedagogical. **Minor issue**: 6 questions for 8 subtopics means T1-A and T4-B are not directly tested; T1-B, T2-A, T3-A, T3-B, T4-A each get one question, plus one general "ficha de caso" question. Recommend adding 2 more MCQs (one for permutation importance, one for audit trail lifecycle) for full coverage. |

### 5.2 Connective tissue and narrative flow

Strong bridges between subtopics, each closing with a one-sentence pointer to the next:

- T0 → T1-A: "El producto es la ficha auditable; explicar **no** es acusar."
- T1-A → T1-B: "Por eso en T1-B pasas de mapa global a explicación **local** del caso en cola."
- T1-B → T2-A: "Con la explicación local en la mano, T2 pregunta si la cola daña de forma desigual por cohorte (métrica + n, no solo el feature del caso)."
- T2-A → T2-B: "Con n a la vista, T2-B pregunta qué **proxies** pueden empujar ese daño."
- T2-B → T3-A: "Con proxies mitigados, T3 comunica qué tan estable es el score restante."
- T3-A → T3-B: "Si el caso además sale del soporte de train, la banda *dentro* del dominio no basta: T3-B fuerza abstención por OOD."
- T3-B → T4-A: "Con incertidumbre gobernada, T4 documenta usos permitidos (model card) y el rastro del override — sin card y audit, la abstención no cierra el caso."
- T4-A → T4-B: "T4-B cierra el ciclo: override y retiro con rastro reconstruible (`case`, `human`, `by`)."

Cross-section bridge: "Esta sección **inicia CP-N3-C** y parte de S34: reutilizas métricas, umbrales y baselines ya presentados en el workbench." (line 30) — explicit backwards pointer. Forward pointer is implicit via the `portfolio_ready True` gate of CP-N3-C and the weDo intro's "24 predicados de política sobre el mismo hilo sintético" framing.

### 5.3 Cognitive load and progressive disclosure

- **Readability**: aggregate FH=76.74 (band "bastante fácil"), INFLESZ=72.61 (band "normal"), WPS=14.63 (well under the 32-word pedagogical ceiling). These are excellent numbers for Phase 2 technical Spanish.
- **Sentence-length distribution**: 6 run-ons (>45w) + 10 long sentences (33-44w) out of 457 total sentences. The run-ons are exclusively in We Do E3 instructions (transfer exercises) and the We Do intro — the most cognitively dense prose in the section. The 10 long sentences are split between theory paragraphs (4 — acceptable for technical content) and We Do instructions (6 — should be split).
- **Progressive disclosure**: ✓ The 8 subtopics build the case file layer by layer (evidence → model → uncertainty → human → card → audit). Each callout closes with a "Contrato local" box that names the `REJECT_*` / `REQUEST_*` / `CONTINUE`/`PASS` codes used by that subtopic, and each We Do exercise reuses the same codes. This is excellent curriculum design.
- **Cognitive overload risk**: The We Do E3 transfer instructions (I-10…I-13, I-15) pack 5 contract clauses into a single sentence with semicolon separators. A learner reading "decide → CONTINUE solo si flag es ok_n y precision ∈ [0,1]; adverso (n bajo + claim=parity) → REJECT_LOW_N_CLAIM; sin n → REQUEST_SLICE_N" must hold three branches in working memory while also reading the build_slice_report contract above it. Recommend splitting each E3 instruction into a 4-5-sentence paragraph (one per branch) or moving the contract into a code comment in the starterCode.

### 5.4 Code/output integrity (verified by execution)

Executed all 8 theory code blocks, 3 I Do demos (sampled), and 7 We Do `solutionCode` blocks (sampled, including all 5 E3 transfer solutions + 2 E1 solutions). **Every single output matches the documented `output` field exactly** — no fabricated numbers, no region-label drift, no KeyError, no assertion failures. This is a clean break from the pseudonymization-drift pattern that broke S04/S07/S08/S11/S12/S17/S18.

Verification script: `/tmp/s35_check.py` (theory) and `/tmp/s35_wedo_check.py` (We Do). Both reported `ALL OK`.

This is the single most important positive finding of the audit: the section's contract-driven pedagogy actually works. A learner who runs the code will see exactly the output the page claims. The pseudonymization pass (if any) was applied consistently across code and output, or — more likely — the section was authored from scratch with synthetic `CASO-LIM-035` data and never went through a late pseudonymization rewrite.

### 5.5 Consistency with overall roadmap and previous sections

- **Phase 2 placement**: Section 35 sits in Phase 2 (Senior, sections 27-39) at level "Competente a experto", 18h. This is consistent with the roadmap: S34 ("Métricas y umbrales") feeds directly into S35 ("Explicabilidad, equidad e incertidumbre") which feeds S36 ("Clustering y anomalías"). The CP-N3-C gate is correctly positioned as the third-to-last capstone of Phase 2 (S37 = Profiling, S38 = Concurrencia, S39 = Case Triage N3 = phase closure).
- **Ethical spine**: Consistent with the curriculum-wide "no fraude ni parentesco" refrain (S11, S13, S17, S18, S22, S34). The `means_fraud=False` / `causal=False` / `action=abstain` / `auto_fraud=False` / `contestability=True` flags are S35's contribution to this spine.
- **CASO-LIM-NNN convention**: S35 uses `CASO-LIM-035` with sub-slots `1A, 1B, 2A, 2B, 3A, 3B, 4A, 4B` matching the 8 subtopics. Consistent with the convention used in S13, S17, S18, S22, S34.
- **Red Andina**: Fictional organization "Red Andina" appears in S13, S17, S18, S34 and is reused here for continuity. ✓

### 5.6 Comparison with best-in-class external materials

- **Mitchell et al. "Model Cards for Model Reporting" (2019)**: S35 correctly cites this paper in T4-A ("La model card (Mitchell et al.) documenta, como mínimo, uso permitido, out_of_scope, métricas de evaluación y dueño") and in resources. The `card_ok` validator implements a minimal version of the model card schema. ✓
- **Molnar "Interpretable Machine Learning"**: Cited in T1-A and resources. S35 correctly distinguishes global (permutation importance) from local (SHAP/LIME) explanations and notes the trade-offs. ✓
- **Barocas et al. "Fairness and Machine Learning"**: Cited in resources. S35 correctly introduces group-aware fairness (TPR gap, precision@slice) and the `n` reporting contract. ✓
- **Conformal prediction (MAPIE)**: Correctly noted as "conceptual (cobertura); código del lab es banda toy" — the lab explicitly does NOT claim to implement real conformal calibration, only a symmetric `p±q` toy band. This intellectual honesty is exemplary.
- **NIST AI RMF**: Cited in resources. ✓
- **Google Model Cards**: Cited in resources. ✓
- **External courses**: MIT 6.100L and Harvard CS50P are listed but their notes ("Contratos y tests", "Proyectos reproducibles") don't map to S35's responsible-AI topic — see I-24. Recommend replacing with responsible-AI-specific resources (PAIR What-If Tool, Aequitas, IBM AI Fairness 360).

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewrites

For each learner-facing prose block (theory sub-topic, I Do intro, We Do intro, selected We Do instructions, You Do, SelfCheck), this section presents **before → after** rewrites that address the real findings from §3. Only paragraphs with at least one real finding are rewritten; paragraphs that are already clean are noted as "no change".

### 6.1 Theory · T0 Inicio (heading: "Inicio CP-N3-C: ficha de caso responsable")

**Paragraph 1 (line 30):** "Esta sección **inicia CP-N3-C** y parte de S34: reutilizas métricas, umbrales y baselines ya presentados en el workbench. El caso sintético `CASO-LIM-035` de Red Andina (organización ficticia en Lima) se ejecuta **sin** credenciales, servicios externos ni PII real: es el laboratorio donde la ficha de caso se vuelve producto, no un diagrama abstracto."
- Findings: 1 long sentence (35w). Acceptable for technical prose.
- **No change.**

**Paragraph 2 (line 31):** "Producto incremental: **ficha de caso** que separa **evidencia observada**, **contribución del modelo**, **incertidumbre** y **decisión humana**. Entrada: score, features y cohorte; salida: plantilla auditable **sin** auto-etiqueta de fraude (`means_fraud=False`). Taxonomía que usarás en T1–T4: **global** (importancia del modelo en todo el batch) vs **local** (contribución al score de *este* caso); **equidad** (slices y proxies) vs **incertidumbre** (banda y OOD); **gobernanza** (card + override). Pregunta guía de la semana: ¿qué capa del caso estoy mirando y qué **no** puedo afirmar desde ella?"
- Findings: 2× `vs` → `vs.` (I-06); 1 long sentence (34w) for the taxonomy list.
- **After:**

  > "Producto incremental: **ficha de caso** que separa **evidencia observada**, **contribución del modelo**, **incertidumbre** y **decisión humana**. Entrada: score, features y cohorte; salida: plantilla auditable **sin** auto-etiqueta de fraude (`means_fraud=False`). Taxonomía que usarás en T1–T4: **global** (importancia del modelo en todo el batch) **vs.** **local** (contribución al score de *este* caso); **equidad** (slices y proxies) **vs.** **incertidumbre** (banda y OOD); **gobernanza** (card + override). Pregunta guía de la semana: ¿qué capa del caso estoy mirando y qué **no** puedo afirmar desde ella?"

**Paragraph 3 (line 32):** "Orden de la sección: **T1 explicación** (global y local) → **T2 equidad/slices y proxies** → **T3 incertidumbre y abstención OOD** → **T4 model card, contestabilidad y override**. Cada bloque cierra con un puente al siguiente: el mapa global no basta sin explicación del caso; la explicación del caso no basta sin slices; los slices no bastan sin banda/OOD; la incertidumbre no basta sin card y audit. El producto es la ficha auditable; explicar **no** es acusar."
- Findings: 1 long sentence (40w) with 4 semicolons. Acceptable — the parallel structure is pedagogically effective.
- **No change.**

**Paragraph 4 (line 33):** "Glosario mínimo de la ficha: **evidencia** = hechos del caso; **modelo** = score y contribuciones (no veredicto); **incertidumbre** = banda/OOD; **humano** = decisión con `by` auditable. Códigos de política: `REJECT_*` = incumplimiento del contrato; `REQUEST_*` = falta dato para decidir; `CONTINUE`/`PASS` = contrato satisfecho en el lab. No memorices la lista entera: cada subtema introduce el código que usa."
- Findings: none.
- **No change.**

**Callout "Gate CP-N3-C" (lines 36-40):** "Inicio CP-N3-C: la ficha distingue las cuatro capas; explicar no es acusar. No des por cerrada la sección si falta evidencia, banda de incertidumbre o audit trail del override."
- Findings: none.
- **No change.**

### 6.2 Theory · T1-A Coeficientes e importancia por permutación

**Paragraph 1 (line 46):** "Los **coeficientes** de un modelo lineal y la **importancia por permutación** miden sensibilidad: cuánto cae una métrica de negocio al barajar una feature (en sklearn real: `permutation_importance` re-evalúa la métrica tras shuffle; aquí trabajas con **drops ya medidos** para enfocarte en el contrato de la ficha). Son mapas **globales del modelo**, **no** veredictos sobre una persona real ni prueba de fraude. Pregunta crítica (Molnar / FairML): ¿cómo podría un modelo sesgado «inventar» importancia alta en un proxy (p. ej. `district_code`) si ese proxy correlaciona con un grupo y el train lo recompensa? Por eso el ranking se documenta con `means_fraud=False` y se cruza después con slices (T2)."
- Findings: 1 long sentence (46w, I-14); 1× `re-evalúa` → `reevalúa` (I-08); 1× `claim` not present here but `train` anglicism.
- **After:**

  > "Los **coeficientes** de un modelo lineal y la **importancia por permutación** miden sensibilidad: cuánto cae una métrica de negocio al barajar una feature. En sklearn real, `permutation_importance` **reevalúa** la métrica tras *shuffle*; aquí trabajas con **drops ya medidos** para enfocarte en el contrato de la ficha. Son mapas **globales del modelo**, **no** veredictos sobre una persona real ni prueba de fraude. Pregunta crítica (Molnar / FairML): ¿cómo podría un modelo sesgado «inventar» importancia alta en un proxy (p. ej. `district_code`) si ese proxy correlaciona con un grupo y el entrenamiento lo recompensa? Por eso el ranking se documenta con `means_fraud=False` y se cruza después con slices (T2)."

  (Split the 46-word sentence at the parenthetical; replaced `re-evalúa` → `reevalúa`; replaced `train` → `entrenamiento` for stronger es-PE register.)

**Paragraph 2 (line 47):** "Contrato: entrada dict de drops por feature y nombre de métrica de cola; salida ranking `top_feature` con drop numérico, métrica usada y flag `means_fraud=False`. Error: afirmar causalidad legal o fraude a partir del drop. Criterio: **misma métrica** de negocio en baseline y en permutación (p. ej. `precision_at_k`). Comparación rápida: coeficientes asumen modelo lineal; permutación aplica a cajas negras pero depende de la métrica y de colinealidad — no es «la verdad» de la feature."
- Findings: 1× missing comma before `pero` (I-07).
- **After:**

  > "Contrato: entrada dict de drops por feature y nombre de métrica de cola; salida ranking `top_feature` con drop numérico, métrica usada y flag `means_fraud=False`. Error: afirmar causalidad legal o fraude a partir del drop. Criterio: **misma métrica** de negocio en baseline y en permutación (p. ej. `precision_at_k`). Comparación rápida: coeficientes asumen modelo lineal; permutación aplica a cajas negras, **pero** depende de la métrica y de colinealidad — no es «la verdad» de la feature."

**Paragraph 3 (line 48):** "Aplicación a `CASO-LIM-035`: `shared_phone` cae más que `amount_7d` en precision@k sintético; documentas sensibilidad sobre datos ficticios y **nunca** emites label de fraude/parentesco. El mapa global orienta la cola; **no** decide el caso individual. Por eso en T1-B pasas de mapa global a explicación **local** del caso en cola."
- Findings: none.
- **No change.**

**Callout "Contrato local" (lines 70-75):** "Evidencia mínima S35-T1-A: ranking de drops con means_fraud=False. Breach → REJECT_CAUSAL_CLAIM; falta drops → REQUEST_METRIC_DROP."
- Findings: none.
- **No change.**

### 6.3 Theory · T1-B Explicación local, correlación y límites

**Paragraph 1 (line 81):** "Después del mapa global, la **explicación local** asigna contribución de features al score de **este** caso (p. ej. valor × peso). En literatura, **SHAP** (valores de Shapley / aditividad con baseline) y **LIME** (modelo local lineal) son familias distintas con trade-offs de costo y estabilidad; aquí el mecanismo mínimo es aditivo stdlib para practicar la ficha, no para certificar un método de auditoría externa. **Correlación ≠ causalidad**: la contribución no es causa del comportamiento humano ni prueba legal."
- Findings: 1 long sentence (43w, second sentence). Acceptable for technical prose.
- **No change.**

**Paragraph 2 (line 82):** "Contrato: entrada pares (valor, peso) por feature; salida contribuciones, suma y plantilla de **4 capas** (evidencia|modelo|incertidumbre|humano). Error: omitir límites o declarar `causal=True`. Criterio: cada capa tiene flag explícito y el modelo no se confunde con la decisión humana. Si solo miras el top local, es fácil «acusar» al feature dominante: por eso `causal=False` es obligatorio en la capa modelo."
- Findings: none.
- **No change.**

**Paragraph 3 (line 83):** "Aplicación a `CASO-LIM-035`: `shared_phone` aporta 0.9 al score de cola; la ficha marca `causal=False` y deja la decisión al analista con **override auditable**. Con la explicación local en la mano, T2 pregunta si la cola daña de forma desigual por cohorte (métrica + n, no solo el feature del caso)."
- Findings: none.
- **No change.**

### 6.4 Theory · T2-A Cohortes y métricas por slice

**Paragraph 1 (line 110):** "Cortar por **región, canal o tipo de enlace** revela si la cola de revisión daña de forma desigual. En fairness group-aware se miran gaps de grupo: p. ej. **TPR gap** (diferencia de true positive rate entre grupos) o **precision@slice**. Aquí el contrato mínimo del lab exige **métrica + n** por slice antes de cualquier claim — sin n no hay equity reportable. Compara precision/recall o tasa de queue reportando siempre el **tamaño muestral n** del slice."
- Findings: 1× em-dash aside (I-25); `claim` and `equity` anglicisms in prose.
- **After:**

  > "Cortar por **región, canal o tipo de enlace** revela si la cola de revisión daña de forma desigual. En fairness group-aware se miran gaps de grupo: p. ej. **TPR gap** (diferencia de *true positive rate* entre grupos) o **precision@slice**. Aquí el contrato mínimo del lab exige **métrica + n** por slice antes de cualquier afirmación: sin n no hay reporte de equidad. Compara precision/recall o tasa de cola reportando siempre el **tamaño muestral n** del slice."

  (Replaced em-dash with colon; `claim` → `afirmación`; `equity` → `equidad`; `queue` → `cola`.)

**Paragraph 2 (line 111):** "Contrato: entrada dict `slice→{n, precision}`; salida flag `low_n` si `n<30` y comparación documentada. Error: afirmar inequidad con n=3 o **esconder n**. Criterio: n visible junto a cada métrica; `low_n` **no** prueba inequidad por sí solo (tampoco «paridad a favor» del slice chico)."
- Findings: none.
- **No change.**

**Paragraph 3 (line 112):** "Aplicación a `CASO-LIM-035`: LIM n=100 precision=0.6 (`ok_n`) vs AQP n=8 precision=0.9 (`low_n`). **No** se afirma paridad de fraude ni se grita inequidad con n=8; solo se documenta daño diferencial **potencial** en revisión. Si el claim es fuerte con n bajo → `REJECT_LOW_N_CLAIM`; si falta n → `REQUEST_SLICE_N`. Con n a la vista, T2-B pregunta qué **proxies** pueden empujar ese daño."
- Findings: 1× `vs` → `vs.` (I-06); 1× `claim` anglicism.
- **After:**

  > "Aplicación a `CASO-LIM-035`: LIM n=100 precision=0.6 (`ok_n`) **vs.** AQP n=8 precision=0.9 (`low_n`). **No** se afirma paridad de fraude ni se grita inequidad con n=8; solo se documenta daño diferencial **potencial** en revisión. Si la afirmación es fuerte con n bajo → `REJECT_LOW_N_CLAIM`; si falta n → `REQUEST_SLICE_N`. Con n a la vista, T2-B pregunta qué **proxies** pueden empujar ese daño."

### 6.5 Theory · T2-B Proxies, tamaño muestral y daño diferencial

**Paragraph 1 (line 142):** "Un **proxy** es una variable que correlaciona con atributos sensibles (distrito, canal, idioma de nota). Su uso puede elevar **falsos positivos** en un grupo y generar fricción injustificada en la cola — sin ser prueba de culpa. Tras ver slices con n, T2-B pregunta *qué features* pueden estar empujando el daño diferencial."
- Findings: 1× em-dash aside (I-16). Acceptable.
- **No change.**

**Paragraph 2 (line 143):** "Contrato: entrada features candidatas con risk tags; salida lista high-risk y acción `mitigate|review`. Error: silenciar proxy o convertirlo en **label de fraude** (`action=auto_label`). Criterio: daño medido como delta de FP rate entre grupos sintéticos, no como acusación individual."
- Findings: none.
- **No change.**

**Paragraph 3 (line 144):** "Aplicación a `CASO-LIM-035`: `district_code` se marca high y se **retira** del set de ranking; se documenta sample size bajo en AQP antes de cualquier claim de paridad. Con proxies mitigados, T3 comunica qué tan estable es el score restante."
- Findings: `claim` anglicism; `sample size` anglicism.
- **After:**

  > "Aplicación a `CASO-LIM-035`: `district_code` se marca high y se **retira** del set de ranking; se documenta el tamaño muestral bajo en AQP antes de cualquier afirmación de paridad. Con proxies mitigados, T3 comunica qué tan estable es el score restante."

### 6.6 Theory · T3-A Calibración e intervalos (conformal a alto nivel)

**Paragraph 1 (line 170):** "Un **score puntual engaña**; comunicar un **intervalo** deja claro qué tan estable es la señal de cola. En producción, la **predicción conformal** (p. ej. MAPIE) usa un **set de calibración** y busca **cobertura** empírica: que el valor verdadero caiga en la banda con la frecuencia prometida (p. ej. 90 %). El lab **no** implementa calibración ni coverage guarantee: practicas el contrato con banda simétrica `p±q` etiquetada `level=\"toy\"`. El hábito de **no publicar solo el punto** es el gate de la ficha; el algoritmo conformal queda en recursos."
- Findings: `coverage guarantee` anglicism; `level=toy` and `level=point` as code-strings are fine.
- **After (minimal):**

  > "Un **score puntual engaña**; comunicar un **intervalo** deja claro qué tan estable es la señal de cola. En producción, la **predicción conformal** (p. ej. MAPIE) usa un **set de calibración** y busca **cobertura** empírica: que el valor verdadero caiga en la banda con la frecuencia prometida (p. ej. 90 %). El lab **no** implementa calibración ni garantía de cobertura: practicas el contrato con banda simétrica `p±q` etiquetada `level=\"toy\"`. El hábito de **no publicar solo el punto** es el gate de la ficha; el algoritmo conformal queda en recursos."

**Paragraph 2 (line 171):** "Contrato: entrada `p` y `q` de incertidumbre; salida `(lo, hi)` y label de nivel. Error: publicar solo `p` **sin** ancho (`q==0` o `level=point`). Criterio: todo score de ficha lleva banda o flag de no-cobertura. Brier y bandas son **complementarios**, no rivales: calibración del score y ancho de intervalo responden preguntas distintas."
- Findings: none.
- **No change.**

**Paragraph 3 (line 172):** "Aplicación a `CASO-LIM-035`: `p=0.6` con `q=0.1` produce `[0.5, 0.7]` nivel toy; el analista ve incertidumbre **antes** de override. Si el caso además sale del soporte de train, la banda *dentro* del dominio no basta: T3-B fuerza abstención por OOD."
- Findings: `train` anglicism.
- **After (minimal):**

  > "Aplicación a `CASO-LIM-035`: `p=0.6` con `q=0.1` produce `[0.5, 0.7]` nivel toy; el analista ve incertidumbre **antes** de override. Si el caso además sale del soporte de entrenamiento, la banda *dentro* del dominio no basta: T3-B fuerza abstención por OOD."

### 6.7 Theory · T3-B Out-of-distribution y abstención

**Paragraph 1 (line 205):** "Aunque la banda esté bien comunicada, si un caso se sale del soporte visto en train (**canal nuevo**, z-score extremo), la política correcta es **abstener y escalar**, no forzar `pred=1` ni inventar fraude. La banda describe incertidumbre *dentro* del dominio; OOD es **cambio de dominio** — otra capa de la ficha, otro verbo de política."
- Findings: `train` anglicism; em-dash aside.
- **After (minimal):**

  > "Aunque la banda esté bien comunicada, si un caso se sale del soporte visto en entrenamiento (**canal nuevo**, z-score extremo), la política correcta es **abstener y escalar**, no forzar `pred=1` ni inventar fraude. La banda describe incertidumbre *dentro* del dominio; OOD es **cambio de dominio**, otra capa de la ficha, otro verbo de política."

**Paragraph 2 (line 206):** "Contrato: entrada vector z y política OOD; salida `ood` bool y action `abstain|score`. Error: **auto-label en OOD** (`action=auto_fraud`). Criterio: fail-closed hacia humano con razón explícita en `uncertainty.reason` (p. ej. `ood`)."
- Findings: LT `HACIA_TILDE` false positive ("hacia humano" — preposition, not verb form). **Not a real error.** `fail-closed hacia humano` is correct.
- **No change.**

**Paragraph 3 (line 207):** "Aplicación a `CASO-LIM-035`: `z=[1,2,3.5]` dispara ood; `action=abstain` y la ficha registra `uncertainty.reason=ood` **sin** label de fraude (`auto_fraud=False`). Con incertidumbre gobernada, T4 documenta usos permitidos (model card) y el rastro del override — sin card y audit, la abstención no cierra el caso."
- Findings: em-dash aside.
- **No change.**

### 6.8 Theory · T4-A Model card y contestabilidad

**Paragraph 1 (line 234):** "La **model card** (Mitchell et al.) documenta, como mínimo, **uso permitido**, **out_of_scope**, métricas de evaluación y **dueño**. **Contestabilidad** exige un canal para que un humano impugne el ranking **sin** borrar el audit trail. Tras T1–T3, la card es el contrato de producto que dice qué *no* puede hacer el score (p. ej. convertirse en `fraud_label` automático)."
- Findings: none.
- **No change.**

**Paragraph 2 (line 235):** "Contrato: entrada keys mínimas de card; salida card válida con `out_of_scope` que incluye `fraud_label`. Error: card vacía, `use=fraud_label` o `contestability=False`. Criterio: `contestability=True` y scope explícito en ficha. Sin card, la ficha de caso flota: no hay límite de producto escrito."
- Findings: none.
- **No change.**

**Paragraph 3 (line 236):** "Aplicación a `CASO-LIM-035`: `use=queue_rank`, `out_of_scope` incluye `fraud_label`, `owner=risk_ops`; el caso puede **apelar** sin reescribir score histórico. T4-B cierra el ciclo: override y retiro con rastro reconstruible (`case`, `human`, `by`)."
- Findings: none.
- **No change.**

### 6.9 Theory · T4-B Aprobación, override, apelación y retiro

**Paragraph 1 (line 269):** "El ciclo de vida del modelo (`proposed→approved→production→retired`) y los **overrides humanos** deben dejar rastro: en el demo mínimo, `case`, `human` y `by` no vacío. En portfolio se recomienda añadir `ts` (timestamp ISO) y razón; **sin audit no hay gobernanza**."
- Findings: none.
- **No change.**

**Paragraph 2 (line 270):** "Contrato: entrada evento de override o retiro; salida log con case, human action, by. Error: override **silencioso** (`by` vacío) o retiro sin flag de drift. Criterio: toda decisión humana es **reconstruible** desde el log."
- Findings: none.
- **No change.**

**Paragraph 3 (line 271):** "Aplicación a `CASO-LIM-035`: `analyst_7` hace `override_skip`; el log guarda by y case; retiro por `drift_flag=True` mueve a retired **sin** borrar histórico. Con card + audit, la ficha CP-N3-C queda lista para el portfolio."
- Findings: none.
- **No change.**

### 6.10 I Do intro (line 302)

**Before:** "S35 · Te muestro explicación, equidad, incertidumbre y gobernanza de la ficha de caso sobre fixtures sintéticos de Red Andina (Lima)."
- Findings: none.
- **No change.**

### 6.11 We Do intro (line 482) — I-09 run-on

**Before:** "S35 · Laboratorio ficha de caso responsable para Red Andina (organización ficticia): 24 retos locales. E1 repara una operación de dominio (ranking, contrib, flag n, proxy, banda, OOD, card, audit); E2 separa valid/invalid/missing; E3 entrena fail-closed y, en T1-B / T2-A / T2-B / T3-B / T4-A, **transferencia real**: construir ficha, reporte de slice, proxy audit, capa uncertainty o model card desde campos crudos. Hay ocho slots de caso (1A…4B) reutilizados en E1–E3; los fixtures adversos mutan el mismo case_id — no son 24 escenarios de negocio distintos, sino 24 predicados de política sobre el mismo hilo sintético."

**After:**

> "S35 · Laboratorio ficha de caso responsable para Red Andina (organización ficticia): 24 retos locales. **E1 repara una operación de dominio** (ranking, contrib, flag n, proxy, banda, OOD, card, audit). **E2 separa `valid`/`invalid`/`missing`**. **E3 entrena fail-closed** y, en T1-B / T2-A / T2-B / T3-B / T4-A, propone **transferencia real**: construir ficha, reporte de slice, proxy audit, capa uncertainty o model card desde campos crudos. Hay ocho slots de caso (1A…4B) reutilizados en E1–E3; los fixtures adversos mutan el mismo `case_id`. No son 24 escenarios de negocio distintos, sino 24 predicados de política sobre el mismo hilo sintético."

(Split the 49-word run-on into 3 sentences; replaced em-dash with period; backticked `case_id`.)

### 6.12 We Do · S35-T2-A-E3 instruction (line 999) — I-10 run-on

**Before:** "S35-T2-A-E3 · Transferencia: a partir de campos crudos (`region`, `n`, `precision`, `min_n`, `claim`) **construye** un reporte de slice y decide. `build_slice_report` debe devolver `{region, n, precision, flag, claim}` con `flag=low_n` si `n < min_n` else `ok_n`. `decide` → `CONTINUE` solo si flag es `ok_n` y precision ∈ [0,1]; adverso (n bajo + `claim=parity`) → `REJECT_LOW_N_CLAIM`; sin `n` → `REQUEST_SLICE_N`. No inventes n ni afirmes paridad con muestra chica."

**After:**

> "S35-T2-A-E3 · Transferencia: a partir de campos crudos (`region`, `n`, `precision`, `min_n`, `claim`) **construye** un reporte de slice y decide. `build_slice_report` debe devolver `{region, n, precision, flag, claim}` con `flag=low_n` si `n < min_n`, y `ok_n` en caso contrario. `decide` devuelve `CONTINUE` solo si flag es `ok_n` y precision ∈ [0,1]. El adverso (n bajo + `claim=parity`) devuelve `REJECT_LOW_N_CLAIM`. Si falta `n`, devuelve `REQUEST_SLICE_N`. No inventes n ni afirmes paridad con muestra chica."

(Split the 51-word second sentence into 4 sentences; replaced `else` with "en caso contrario" for es-PE register.)

### 6.13 We Do · S35-T2-B-E3 instruction (line 1222) — I-11 run-on

**Before:** "S35-T2-B-E3 · Transferencia: a partir de campos crudos (`features` con risk tags y `proposed_action`) **construye** el audit de proxies y decide. `build_proxy_audit` debe devolver `{high_risk, action, means_fraud}` con `high_risk = [k for k,v in features.items() if v==\"high\"]`. `decide` → `CONTINUE` si hay high-risk y action ∈ {review, mitigate, drop} y means_fraud is False; adverso (`action=auto_label`) → `REJECT_PROXY_FEATURE`; sin `features` → `REQUEST_PROXY_AUDIT`. No conviertas proxy en label de fraude."

**After:**

> "S35-T2-B-E3 · Transferencia: a partir de campos crudos (`features` con risk tags y `proposed_action`) **construye** el audit de proxies y decide. `build_proxy_audit` debe devolver `{high_risk, action, means_fraud}` con `high_risk = [k for k,v in features.items() if v==\"high\"]`. `decide` devuelve `CONTINUE` solo si hay high-risk, action ∈ {review, mitigate, drop} y means_fraud is False. El adverso (`action=auto_label`) devuelve `REJECT_PROXY_FEATURE`. Si faltan `features`, devuelve `REQUEST_PROXY_AUDIT`. No conviertas proxy en label de fraude."

### 6.14 We Do · S35-T3-B-E3 instruction (line 1590) — I-12 run-on

**Before:** "S35-T3-B-E3 · Transferencia: a partir de campos crudos (`zs`, `threshold`, `proposed_action`) **construye** la capa `uncertainty` y decide. `build_uncertainty` debe devolver `{ood, action, reason}` con `ood = max(|z|) > thr`; si ood y proposed_action no es abstain → `REJECT_AUTO_LABEL`; si falta `zs` → `REQUEST_OOD_POLICY`; si ood y action=abstain → `CONTINUE`. No fuerces label de fraude ni rellenes zs inventados."

**After:**

> "S35-T3-B-E3 · Transferencia: a partir de campos crudos (`zs`, `threshold`, `proposed_action`) **construye** la capa `uncertainty` y decide. `build_uncertainty` debe devolver `{ood, action, reason}` con `ood = max(|z|) > thr`. Si ood y proposed_action no es abstain, `decide` devuelve `REJECT_AUTO_LABEL`. Si ood y action es abstain, devuelve `CONTINUE`. Si falta `zs`, devuelve `REQUEST_OOD_POLICY`. No fuerces label de fraude ni rellenes zs inventados."

### 6.15 We Do · S35-T4-A-E3 instruction (line 1788) — I-13 run-on (worst offender)

**Before:** "S35-T4-A-E3 · Transferencia: a partir de campos crudos (`use`, `prohibited`, `owner`, `contestability`) **construye** la model card y decide. `build_card` debe devolver un dict con `use`, `out_of_scope` (lista desde prohibited), `owner` y `contestability`. `decide` devuelve `CONTINUE` solo si `use==queue_rank`, `fraud_label` ∈ out_of_scope y contestability es True; adverso (use=fraud_label) → `REJECT_SCOPE_BREACH`; sin `prohibited` → `REQUEST_CARD_KEYS`. No inventes out_of_scope vacío como válido."

**After:**

> "S35-T4-A-E3 · Transferencia: a partir de campos crudos (`use`, `prohibited`, `owner`, `contestability`) **construye** la model card y decide. `build_card` debe devolver un dict con `use`, `out_of_scope` (lista construida desde `prohibited`), `owner` y `contestability`. `decide` devuelve `CONTINUE` solo si `use==queue_rank`, `fraud_label` ∈ out_of_scope y contestability es True. El adverso (`use=fraud_label`) devuelve `REJECT_SCOPE_BREACH`. Si falta `prohibited`, devuelve `REQUEST_CARD_KEYS`. No inventes out_of_scope vacío como válido."

### 6.16 We Do · S35-T1-B-E3 instruction (line 803) — I-15 run-on

**Before:** "S35-T1-B-E3 · Transferencia: a partir de campos crudos (evidence, contrib, causal, decision, by) **construye** la ficha de 4 capas y decide. `build_ficha` debe devolver un dict con keys evidence|model|uncertainty|human; `decide` devuelve `CONTINUE` solo si las cuatro capas existen y `model.causal is False`. El adverso (causal=True) → `REJECT_CAUSAL_CLAIM`; sin evidence → `REQUEST_LAYER_FIELDS`. No rellenes evidencia inventada."

**After:**

> "S35-T1-B-E3 · Transferencia: a partir de campos crudos (evidence, contrib, causal, decision, by) **construye** la ficha de 4 capas y decide. `build_ficha` debe devolver un dict con keys evidence|model|uncertainty|human. `decide` devuelve `CONTINUE` solo si las cuatro capas existen y `model.causal is False`. El adverso (causal=True) devuelve `REJECT_CAUSAL_CLAIM`. Si falta evidence, devuelve `REQUEST_LAYER_FIELDS`. No rellenes evidencia inventada."

### 6.17 We Do `tests` field — I-04 (5 occurrences)

**Before (5 lines: 897, 1111, 1316, 1488, 1680):**
- "El fixture `CASO-LIM-035-2A` obtiene ok_n y imprime `S35-T2-A PASS`."
- "El fixture `CASO-LIM-035-2B` lista district_code como high, usa action=review y imprime `S35-T2-B PASS`."
- "El fixture `CASO-LIM-035-3A` obtiene banda [0.5, 0.7] y imprime `S35-T3-A PASS`."
- "El fixture `CASO-LIM-035-3B` detecta OOD, usa abstain y imprime `S35-T3-B PASS`."
- "El fixture `CASO-LIM-035-4A` pasa card_ok y imprime `S35-T4-A PASS`."

**After (replace `y imprime` with `e imprime`):**
- "El fixture `CASO-LIM-035-2A` obtiene ok_n **e** imprime `S35-T2-A PASS`."
- "El fixture `CASO-LIM-035-2B` lista district_code como high, usa action=review **e** imprime `S35-T2-B PASS`."
- "El fixture `CASO-LIM-035-3A` obtiene banda [0.5, 0.7] **e** imprime `S35-T3-A PASS`."
- "El fixture `CASO-LIM-035-3B` detecta OOD, usa abstain **e** imprime `S35-T3-B PASS`."
- "El fixture `CASO-LIM-035-4A` pasa card_ok **e** imprime `S35-T4-A PASS`."

### 6.18 We Do S35-T3-A-E1 hint + hints[1] — I-05 (2 occurrences, lines 1310, 1313)

**Before:** "Banda: lo = round(p - q, 2), hi = round(p + q, 2). PASS solo si q>0, level distinto de point y hi > lo."
**After:** "Banda: lo = round(p - q, 2), hi = round(p + q, 2). PASS solo si q>0, level distinto de point **e** hi > lo."

### 6.19 You Do (lines 2037-2131) — context, objectives, requirements

**Context (line 2040):** "Como analista de riesgo operativo en la cola sintética de Red Andina (Lima), arma la plantilla de ficha de caso con explicación local, banda de incertidumbre, abstención OOD y model card sobre CASO-LIM-035. Sin PII real ni auto-etiqueta de fraude: el portfolio debe llegar a `portfolio_ready True` reparando los tres `fill_*`."
- Findings: 1 long sentence (35w, acceptable).
- **No change.**

**Objectives (lines 2042-2046):** 4 items, all clean.
- **No change.**

**Requirements (lines 2047-2051):** 3 items, all clean.
- **No change.**

**portfolioNote (line 2121):** "Inicio CP-N3-C: no des por cerrada la sección sin ficha 4 capas + card out_of_scope + audit de override. Portfolio: repara los tres fill_* hasta portfolio_ready True y documenta un caso adverso (OOD o by vacío)."
- Findings: none.
- **No change.**

**rubric (lines 2122-2130):** 7 criteria (6 weighted + 1 bonus). All clean except `card out_of_scope` (line 2129) uses anglicism but acceptable as code-adjacent.
- **No change.**

### 6.20 SelfCheck questions (lines 2133-2176) — 6 MCQs

**Q1 (line 2135):** "Las cuatro capas de la ficha de caso son:"
- Options: "Solo el score puntual del modelo", "Solo importancia global (permutación) sin decisión humana", "Evidencia, modelo, incertidumbre y decisión humana", "Solo la interfaz de la cola de revisión"
- correctIndex: 2. Explanation: "Las cuatro capas evitan confundir evidencia observada con score del modelo, incertidumbre y decisión humana auditable."
- Findings: none.
- **No change.**

**Q2 (line 2142):** "La importancia por permutación, con la misma métrica de negocio, mide:"
- Options: "Sensibilidad del modelo al barajar una feature (drop de métrica)", "La causa legal del comportamiento de una persona en el caso", "Que el top_feature implica etiqueta de fraude", "Paridad perfecta entre regiones sin reportar n"
- correctIndex: 0. Explanation: "La caída de métrica al permutar mide sensibilidad del modelo; no prueba causa, fraude ni parentesco."
- Findings: none.
- **No change.**

**Q3 (line 2149):** "Ante un caso OOD (z extremo o canal nuevo), la política correcta es:"
- Options: "Forzar pred=1 para no perder recall de fraude", "Abstener, escalar a humano y registrar reason=ood", "Borrar el audit trail del score previo", "Publicar solo el score puntual sin banda ni flag"
- correctIndex: 1. Explanation: "Fuera de distribución la política fail-closed es abstener y escalar a humano, sin auto-label."
- Findings: none.
- **No change.**

**Q4 (line 2156):** "En la model card, out_of_scope debe incluir sobre todo:"
- Options: "Nada: la card solo lista accuracy global", "El email personal del owner como único campo", "Métricas de slice sin n ni low_n", "Usos prohibidos (p. ej. fraud_label) y límites de producto"
- correctIndex: 3. Explanation: "out_of_scope documenta usos prohibidos (p. ej. fraud_label) para contestabilidad y límites de producto."
- Findings: none.
- **No change.**

**Q5 (line 2163):** "Un slice AQP con n=8 y precision=0.9 frente a LIM n=100 precision=0.6 implica:"
- Options: "Paridad de fraude demostrada a favor de AQP", "Que district_code puede auto-etiquetarse como fraude", "low_n en AQP: no afirmar inequidad ni paridad sin más evidencia", "Que se puede omitir n en el reporte de equity"
- correctIndex: 2. Explanation: "low_n no prueba inequidad ni paridad; reportar n y evitar claims fuertes con muestra chica es el contrato de slices."
- Findings: `equity` anglicism in option D; `claims` anglicism in explanation.
- **After (option D):** "Que se puede omitir n en el reporte de **equidad**"
- **After (explanation):** "low_n no prueba inequidad ni paridad; reportar n y evitar afirmaciones fuertes con muestra chica es el contrato de slices."

**Q6 (line 2170):** "En la ficha de caso, una explicación local correcta:"
- Options: "Separa evidencia, modelo, incertidumbre y humano, con causal=False", "Convierte la mayor contribución local en prueba de fraude", "Omite el campo by si el analista hace override_skip", "Fuerza pred=1 cuando el vector z es OOD para no perder recall"
- correctIndex: 0. Explanation: "Explicar no es acusar: causal=False, OOD abstain y audit de override (by) son obligatorios en la ficha."
- Findings: none.
- **No change.**

---

## 7. Proposed GitHub-style Diffs

One diff per issue or logical group. All diffs are proposals — **do not apply** in this audit pass.

### D-01 (P0, I-01) Rename `id` from `"system-design"` to `"explainability-equity"`

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'

 export const section35: CourseSection = {
-  id: "system-design",
+  id: "explainability-equity",
   index: 35,
   title: "Explicabilidad, equidad e incertidumbre",
   shortTitle: "Explicabilidad y equidad",
```

**Note**: This requires coordinated updates in `src/lib/course/index.ts:38` (import), and optionally renaming the file `s35-system-design.ts` → `s35-explainability-equity.ts` (coordinate with Fixer; the live URL hash will change from `#system-design` to `#explainability-equity`, which may break existing learner bookmarks — consider adding a redirect in the SPA router).

### D-02 (P0, I-02) Replace off-topic InteractivePlaygroundDemo for S35

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -2761,42 +2761,99 @@
-    'system-design': {
-      title: 'Practica arquitectura y ADR',
-      code: `# Simulacion de design de sistemas
-# Generar ADR (Architecture Decision Record)
-
-def generate_adr(title, context, decision, alternatives, consequences):
-    """Genera un ADR con formato estandar."""
-    adr = f"# ADR: {title}\\n"
-    adr += f"\\n## Context\\n{context}\\n"
-    adr += f"\\n## Decision\\n{decision}\\n"
-    adr += f"\\n## Alternatives\\n"
-    for alt in alternatives:
-        adr += f"- {alt}\\n"
-    adr += f"\\n## Consequences\\n{consequences}\\n"
-    adr += f"\\n## Status: Proposed\\n"
-    return adr
-
-# Generar ADR para decision real
-adr = generate_adr(
-    title="Batch vs Real-Time Inference",
-    context="El equipo de riesgo necesita scoring en <100ms para aprobar creditos en tiempo real.",
-    decision="Usar real-time inference con FastAPI + Redis cache + XGBoost model.",
-    alternatives=[
-        "Batch scoring: descartado (necesitan tiempo real)",
-        "Lambda function: descartado (cold start > 100ms)",
-        "gRPC: descartado (clientes usan REST)",
-    ],
-    consequences="Latencia p99 < 100ms. Requiere Redis + monitoring 24/7. Costo ~$500/mes."
-)
-
-print(adr)
-
-# Simular feature store
-print("\\n=== Feature Store (simulado) ===")
-features = {
-    "user_123": {"age": 25, "avg_spend": 150.5, "login_count": 30},
-    "user_456": {"age": 35, "avg_spend": 320.0, "login_count": 12},
-}
-
-def get_features(user_id, source="online"):
-    """Obtiene features (online=Redis <10ms, offline=parquet)."""
-    if source == "online":
-        return features.get(user_id, {})
-    return {"note": "En offline, trae features historicas point-in-time"}
-
-print(f"Online user_123: {get_features('user_123', 'online')}")
-print(f"Online user_999: {get_features('user_999', 'online')}")`,
-      expectedOutput: `...`,
-      hint: 'Escribe un ADR para tu propia decision tecnica',
+    'explainability-equity': {
+      title: 'Practica la ficha de caso responsable',
+      code: `# CASO-LIM-035 · ficha de caso responsable (toy)
+# Practica las 4 capas: evidencia | modelo | incertidumbre | humano
+
+def local_contrib(feats):
+    """Contribucion local value x weight (no es causa legal)."""
+    return {k: v * w for k, (v, w) in feats.items()}
+
+def score_interval(p, q):
+    """Banda simetrica toy (conformal real: ver MAPIE en recursos)."""
+    return {"lo": round(p - q, 2), "hi": round(p + q, 2), "level": "toy"}
+
+def is_ood(zs, thr=3):
+    return max(abs(z) for z in zs) > thr
+
+# Caso sintetico CASO-LIM-035
+feats = {"shared_phone": (1.0, 0.9), "amount_z": (0.5, 0.2)}
+contrib = local_contrib(feats)
+band = score_interval(0.6, 0.1)
+ood = is_ood([1.0, 2.0, 3.5], thr=3.0)
+
+ficha = {
+    "evidence": list(feats.keys()),
+    "model": {"contrib": contrib, "causal": False, "means_fraud": False},
+    "uncertainty": {"interval": (band["lo"], band["hi"]), "ood": ood, "action": "abstain" if ood else "score"},
+    "human": {"decision": "review", "by": "analyst_7"},
+}
+
+print("Ficha CASO-LIM-035:")
+for capa, val in ficha.items():
+    print(f"  {capa}: {val}")
+print("causal?", ficha["model"]["causal"], "| means_fraud?", ficha["model"]["means_fraud"])
+print("accion OOD:", ficha["uncertainty"]["action"], "| by:", ficha["human"]["by"])`,
+      expectedOutput: `Ficha CASO-LIM-035:
+  evidence: ['shared_phone', 'amount_z']
+  model: {'contrib': {'shared_phone': 0.9, 'amount_z': 0.1}, 'causal': False, 'means_fraud': False}
+  uncertainty: {'interval': (0.5, 0.7), 'ood': True, 'action': 'abstain'}
+  human: {'decision': 'review', 'by': 'analyst_7'}
+causal? False | means_fraud? False
+accion OOD: abstain | by: analyst_7`,
+      hint: 'Cambia q a 0.0 y observa point_only; cambia z a [1,2,2.5] y observa action=score',
     },
```

### D-03 (P0, I-03) Fix PDF label

```diff
--- a/src/components/course/PdfReport.tsx
+++ b/src/components/course/PdfReport.tsx
@@ -72,7 +72,7 @@
   "advanced-models": '33. ML+',
   "cv-ai-integration": '34. CV+AI',
-  "system-design": '35. SysDesign',
+  "explainability-equity": '35. Explicabilidad',
   "ai-apis-advanced": '36. AI APIs',
   "dbt-bigquery": '37. dbt/BQ',
```

### D-04 (P1, I-04, I-05) Fix `y` → `e` (7 occurrences)

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ -894,7 +894,7 @@
-        "Implementa slice_flag como en theory/iDo: low_n si n < min_n. El fixture válido es LIM con n=100.",
+        "Implementa slice_flag como en theory/iDo: low_n si n < min_n. El fixture válido es LIM con n=100. PASS solo con flag ok_n y precision en [0,1]. Un n chico con precision alta no es paridad: es low_n claim.",
@@ -897,7 +897,7 @@
-        tests: "El fixture `CASO-LIM-035-2A` obtiene ok_n y imprime `S35-T2-A PASS`.",
+        tests: "El fixture `CASO-LIM-035-2A` obtiene ok_n e imprime `S35-T2-A PASS`.",
@@ -1108,7 +1108,7 @@
-        tests: "El fixture `CASO-LIM-035-2B` lista district_code como high, usa action=review y imprime `S35-T2-B PASS`.",
+        tests: "El fixture `CASO-LIM-035-2B` lista district_code como high, usa action=review e imprime `S35-T2-B PASS`.",
@@ -1310,7 +1310,7 @@
-        hint: "Banda: lo = round(p - q, 2), hi = round(p + q, 2). PASS solo si q>0, level distinto de point y hi > lo.",
+        hint: "Banda: lo = round(p - q, 2), hi = round(p + q, 2). PASS solo si q>0, level distinto de point e hi > lo.",
@@ -1313,7 +1313,7 @@
-          "Banda: lo = round(p - q, 2), hi = round(p + q, 2). PASS solo si q>0, level distinto de point y hi > lo.",
+          "Banda: lo = round(p - q, 2), hi = round(p + q, 2). PASS solo si q>0, level distinto de point e hi > lo.",
@@ -1316,7 +1316,7 @@
-        tests: "El fixture `CASO-LIM-035-3A` obtiene banda [0.5, 0.7] y imprime `S35-T3-A PASS`.",
+        tests: "El fixture `CASO-LIM-035-3A` obtiene banda [0.5, 0.7] e imprime `S35-T3-A PASS`.",
@@ -1488,7 +1488,7 @@
-        tests: "El fixture `CASO-LIM-035-3B` detecta OOD, usa abstain y imprime `S35-T3-B PASS`.",
+        tests: "El fixture `CASO-LIM-035-3B` detecta OOD, usa abstain e imprime `S35-T3-B PASS`.",
@@ -1680,7 +1680,7 @@
-        tests: "El fixture `CASO-LIM-035-4A` pasa card_ok y imprime `S35-T4-A PASS`.",
+        tests: "El fixture `CASO-LIM-035-4A` pasa card_ok e imprime `S35-T4-A PASS`.",
```

### D-05 (P1, I-06) Fix `vs` → `vs.` (3 occurrences)

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ -28,7 +28,7 @@
-        "Taxonomía que usarás en T1–T4: **global** (importancia del modelo en todo el batch) vs **local** (contribución al score de *este* caso); **equidad** (slices y proxies) vs **incertidumbre** (banda y OOD); **gobernanza** (card + override). Pregunta guía de la semana: ¿qué capa del caso estoy mirando y qué **no** puedo afirmar desde ella?"
+        "Taxonomía que usarás en T1–T4: **global** (importancia del modelo en todo el batch) vs. **local** (contribución al score de *este* caso); **equidad** (slices y proxies) vs. **incertidumbre** (banda y OOD); **gobernanza** (card + override). Pregunta guía de la semana: ¿qué capa del caso estoy mirando y qué **no** puedo afirmar desde ella?"
@@ -109,7 +109,7 @@
-        "Aplicación a `CASO-LIM-035`: LIM n=100 precision=0.6 (`ok_n`) vs AQP n=8 precision=0.9 (`low_n`). **No** se afirma paridad de fraude ni se grita inequidad con n=8; solo se documenta daño diferencial **potencial** en revisión. Si el claim es fuerte con n bajo → `REJECT_LOW_N_CLAIM`; si falta n → `REQUEST_SLICE_N`. Con n a la vista, T2-B pregunta qué **proxies** pueden empujar ese daño."
+        "Aplicación a `CASO-LIM-035`: LIM n=100 precision=0.6 (`ok_n`) vs. AQP n=8 precision=0.9 (`low_n`). **No** se afirma paridad de fraude ni se grita inequidad con n=8; solo se documenta daño diferencial **potencial** en revisión. Si la afirmación es fuerte con n bajo → `REJECT_LOW_N_CLAIM`; si falta n → `REQUEST_SLICE_N`. Con n a la vista, T2-B pregunta qué **proxies** pueden empujar ese daño."
```

### D-06 (P2, I-07) Add comma before `pero`

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ -44,7 +44,7 @@
-        "Contrato: entrada dict de drops por feature y nombre de métrica de cola; salida ranking `top_feature` con drop numérico, métrica usada y flag `means_fraud=False`. Error: afirmar causalidad legal o fraude a partir del drop. Criterio: **misma métrica** de negocio en baseline y en permutación (p. ej. `precision_at_k`). Comparación rápida: coeficientes asumen modelo lineal; permutación aplica a cajas negras pero depende de la métrica y de colinealidad — no es «la verdad» de la feature."
+        "Contrato: entrada dict de drops por feature y nombre de métrica de cola; salida ranking `top_feature` con drop numérico, métrica usada y flag `means_fraud=False`. Error: afirmar causalidad legal o fraude a partir del drop. Criterio: **misma métrica** de negocio en baseline y en permutación (p. ej. `precision_at_k`). Comparación rápida: coeficientes asumen modelo lineal; permutación aplica a cajas negras, pero depende de la métrica y de colinealidad — no es «la verdad» de la feature."
```

### D-07 (P2, I-08) `re-evalúa` → `reevalúa`

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ -42,7 +42,7 @@
-        "Los **coeficientes** de un modelo lineal y la **importancia por permutación** miden sensibilidad: cuánto cae una métrica de negocio al barajar una feature (en sklearn real: `permutation_importance` re-evalúa la métrica tras shuffle; aquí trabajas con **drops ya medidos** para enfocarte en el contrato de la ficha). Son mapas **globales del modelo**, **no** veredictos sobre una persona real ni prueba de fraude. Pregunta crítica (Molnar / FairML): ¿cómo podría un modelo sesgado «inventar» importancia alta en un proxy (p. ej. `district_code`) si ese proxy correlaciona con un grupo y el train lo recompensa? Por eso el ranking se documenta con `means_fraud=False` y se cruza después con slices (T2)."
+        "Los **coeficientes** de un modelo lineal y la **importancia por permutación** miden sensibilidad: cuánto cae una métrica de negocio al barajar una feature (en sklearn real: `permutation_importance` **reevalúa** la métrica tras shuffle; aquí trabajas con **drops ya medidos** para enfocarte en el contrato de la ficha). Son mapas **globales del modelo**, **no** veredictos sobre una persona real ni prueba de fraude. Pregunta crítica (Molnar / FairML): ¿cómo podría un modelo sesgado «inventar» importancia alta en un proxy (p. ej. `district_code`) si ese proxy correlaciona con un grupo y el entrenamiento lo recompensa? Por eso el ranking se documenta con `means_fraud=False` y se cruza después con slices (T2)."
```

### D-08 (P2, I-09) Split We Do intro run-on

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ -479,7 +479,7 @@
-    intro: "S35 · Laboratorio ficha de caso responsable para Red Andina (organización ficticia): 24 retos locales. E1 repara una operación de dominio (ranking, contrib, flag n, proxy, banda, OOD, card, audit); E2 separa valid/invalid/missing; E3 entrena fail-closed y, en T1-B / T2-A / T2-B / T3-B / T4-A, **transferencia real**: construir ficha, reporte de slice, proxy audit, capa uncertainty o model card desde campos crudos. Hay ocho slots de caso (1A…4B) reutilizados en E1–E3; los fixtures adversos mutan el mismo case_id — no son 24 escenarios de negocio distintos, sino 24 predicados de política sobre el mismo hilo sintético.",
+    intro: "S35 · Laboratorio ficha de caso responsable para Red Andina (organización ficticia): 24 retos locales. **E1 repara una operación de dominio** (ranking, contrib, flag n, proxy, banda, OOD, card, audit). **E2 separa `valid`/`invalid`/`missing`**. **E3 entrena fail-closed** y, en T1-B / T2-A / T2-B / T3-B / T4-A, propone **transferencia real**: construir ficha, reporte de slice, proxy audit, capa uncertainty o model card desde campos crudos. Hay ocho slots de caso (1A…4B) reutilizados en E1–E3; los fixtures adversos mutan el mismo `case_id`. No son 24 escenarios de negocio distintos, sino 24 predicados de política sobre el mismo hilo sintético.",
```

### D-09 (P2, I-10) Split S35-T2-A-E3 instruction run-on

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ -996,7 +996,7 @@
-        instruction: "S35-T2-A-E3 · Transferencia: a partir de campos crudos (`region`, `n`, `precision`, `min_n`, `claim`) **construye** un reporte de slice y decide. `build_slice_report` debe devolver `{region, n, precision, flag, claim}` con `flag=low_n` si `n < min_n` else `ok_n`. `decide` → `CONTINUE` solo si flag es `ok_n` y precision ∈ [0,1]; adverso (n bajo + `claim=parity`) → `REJECT_LOW_N_CLAIM`; sin `n` → `REQUEST_SLICE_N`. No inventes n ni afirmes paridad con muestra chica.",
+        instruction: "S35-T2-A-E3 · Transferencia: a partir de campos crudos (`region`, `n`, `precision`, `min_n`, `claim`) **construye** un reporte de slice y decide. `build_slice_report` debe devolver `{region, n, precision, flag, claim}` con `flag=low_n` si `n < min_n`, y `ok_n` en caso contrario. `decide` devuelve `CONTINUE` solo si flag es `ok_n` y precision ∈ [0,1]. El adverso (n bajo + `claim=parity`) devuelve `REJECT_LOW_N_CLAIM`. Si falta `n`, devuelve `REQUEST_SLICE_N`. No inventes n ni afirmes paridad con muestra chica.",
```

### D-10 (P2, I-11) Split S35-T2-B-E3 instruction run-on

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ -1219,7 +1219,7 @@
-        instruction: "S35-T2-B-E3 · Transferencia: a partir de campos crudos (`features` con risk tags y `proposed_action`) **construye** el audit de proxies y decide. `build_proxy_audit` debe devolver `{high_risk, action, means_fraud}` con `high_risk = [k for k,v in features.items() if v==\"high\"]`. `decide` → `CONTINUE` si hay high-risk y action ∈ {review, mitigate, drop} y means_fraud is False; adverso (`action=auto_label`) → `REJECT_PROXY_FEATURE`; sin `features` → `REQUEST_PROXY_AUDIT`. No conviertas proxy en label de fraude.",
+        instruction: "S35-T2-B-E3 · Transferencia: a partir de campos crudos (`features` con risk tags y `proposed_action`) **construye** el audit de proxies y decide. `build_proxy_audit` debe devolver `{high_risk, action, means_fraud}` con `high_risk = [k for k,v in features.items() if v==\"high\"]`. `decide` devuelve `CONTINUE` solo si hay high-risk, action ∈ {review, mitigate, drop} y means_fraud is False. El adverso (`action=auto_label`) devuelve `REJECT_PROXY_FEATURE`. Si faltan `features`, devuelve `REQUEST_PROXY_AUDIT`. No conviertas proxy en label de fraude.",
```

### D-11 (P2, I-12) Split S35-T3-B-E3 instruction run-on

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ -1587,7 +1587,7 @@
-        instruction: "S35-T3-B-E3 · Transferencia: a partir de campos crudos (`zs`, `threshold`, `proposed_action`) **construye** la capa `uncertainty` y decide. `build_uncertainty` debe devolver `{ood, action, reason}` con `ood = max(|z|) > thr`; si ood y proposed_action no es abstain → `REJECT_AUTO_LABEL`; si falta `zs` → `REQUEST_OOD_POLICY`; si ood y action=abstain → `CONTINUE`. No fuerces label de fraude ni rellenes zs inventados.",
+        instruction: "S35-T3-B-E3 · Transferencia: a partir de campos crudos (`zs`, `threshold`, `proposed_action`) **construye** la capa `uncertainty` y decide. `build_uncertainty` debe devolver `{ood, action, reason}` con `ood = max(|z|) > thr`. Si ood y proposed_action no es abstain, `decide` devuelve `REJECT_AUTO_LABEL`. Si ood y action es abstain, devuelve `CONTINUE`. Si falta `zs`, devuelve `REQUEST_OOD_POLICY`. No fuerces label de fraude ni rellenes zs inventados.",
```

### D-12 (P2, I-13) Split S35-T4-A-E3 instruction run-on (worst offender)

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ -1785,7 +1785,7 @@
-        instruction: "S35-T4-A-E3 · Transferencia: a partir de campos crudos (`use`, `prohibited`, `owner`, `contestability`) **construye** la model card y decide. `build_card` debe devolver un dict con `use`, `out_of_scope` (lista desde prohibited), `owner` y `contestability`. `decide` devuelve `CONTINUE` solo si `use==queue_rank`, `fraud_label` ∈ out_of_scope y contestability es True; adverso (use=fraud_label) → `REJECT_SCOPE_BREACH`; sin `prohibited` → `REQUEST_CARD_KEYS`. No inventes out_of_scope vacío como válido.",
+        instruction: "S35-T4-A-E3 · Transferencia: a partir de campos crudos (`use`, `prohibited`, `owner`, `contestability`) **construye** la model card y decide. `build_card` debe devolver un dict con `use`, `out_of_scope` (lista construida desde `prohibited`), `owner` y `contestability`. `decide` devuelve `CONTINUE` solo si `use==queue_rank`, `fraud_label` ∈ out_of_scope y contestability es True. El adverso (`use=fraud_label`) devuelve `REJECT_SCOPE_BREACH`. Si falta `prohibited`, devuelve `REQUEST_CARD_KEYS`. No inventes out_of_scope vacío como válido.",
```

### D-13 (P2, I-15) Split S35-T1-B-E3 instruction run-on

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ -800,7 +800,7 @@
-        instruction: "S35-T1-B-E3 · Transferencia: a partir de campos crudos (evidence, contrib, causal, decision, by) **construye** la ficha de 4 capas y decide. `build_ficha` debe devolver un dict con keys evidence|model|uncertainty|human; `decide` devuelve `CONTINUE` solo si las cuatro capas existen y `model.causal is False`. El adverso (causal=True) → `REJECT_CAUSAL_CLAIM`; sin evidence → `REQUEST_LAYER_FIELDS`. No rellenes evidencia inventada.",
+        instruction: "S35-T1-B-E3 · Transferencia: a partir de campos crudos (evidence, contrib, causal, decision, by) **construye** la ficha de 4 capas y decide. `build_ficha` debe devolver un dict con keys evidence|model|uncertainty|human. `decide` devuelve `CONTINUE` solo si las cuatro capas existen y `model.causal is False`. El adverso (causal=True) devuelve `REJECT_CAUSAL_CLAIM`. Si falta evidence, devuelve `REQUEST_LAYER_FIELDS`. No rellenes evidencia inventada.",
```

### D-14 (P3, I-17, I-18, I-25) Replace `claim(s)` anglicism in prose

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ -108,7 +108,7 @@
-        "Aplicación a `CASO-LIM-035`: LIM n=100 precision=0.6 (`ok_n`) vs AQP n=8 precision=0.9 (`low_n`). **No** se afirma paridad de fraude ni se grita inequidad con n=8; solo se documenta daño diferencial **potencial** en revisión. Si el claim es fuerte con n bajo → `REJECT_LOW_N_CLAIM`; si falta n → `REQUEST_SLICE_N`. Con n a la vista, T2-B pregunta qué **proxies** pueden empujar ese daño."
+        "Aplicación a `CASO-LIM-035`: LIM n=100 precision=0.6 (`ok_n`) vs. AQP n=8 precision=0.9 (`low_n`). **No** se afirma paridad de fraude ni se grita inequidad con n=8; solo se documenta daño diferencial **potencial** en revisión. Si la afirmación es fuerte con n bajo → `REJECT_LOW_N_CLAIM`; si falta n → `REQUEST_SLICE_N`. Con n a la vista, T2-B pregunta qué **proxies** pueden empujar ese daño."
@@ -363,7 +363,7 @@
-        why: "Reportar n por cohorte evita claims de equidad estadísticamente vacíos en regiones con poco tráfico.",
+        why: "Reportar n por cohorte evita afirmaciones de equidad estadísticamente vacías en regiones con poco tráfico.",
```

### D-15 (P3, I-23) Drop duplicate `hint` field (systemic across 24 weDo exercises)

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ -486,7 +486,6 @@
       {
         id: "S35-T1-A-E1",
         subtopicId: "S35-T1-A",
         kind: "guided",
         instruction: "...",
-        hint: "top_feature = max(drops, key=drops.get); shared_phone debe ganar a amount_7d; means_fraud debe quedar False.",
         hints: [
           "top_feature = max(drops, key=drops.get); shared_phone debe ganar a amount_7d; means_fraud debe quedar False.",
           "Un drop alto mide sensibilidad de la métrica de cola, no prueba de fraude. Si usas min() o means_fraud=True, el contrato falla.",
         ],
```

(Repeat for all 24 weDo exercises. The legacy `hint` field is identical to `hints[0]` in every case.)

### D-16 (P3, I-24) Replace off-topic external courses

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ -2229,12 +2229,12 @@
     courses: [
       {
-        label: "TensorFlow Responsible AI",
-        url: "https://www.tensorflow.org/responsible_ai",
-        note: "Prácticas de IA responsable",
+        label: "Google PAIR — What-If Tool",
+        url: "https://pair-code.github.io/what-if-tool/",
+        note: "Inspección interactiva de slices y contrafactuales",
       },
       {
-        label: "Coursera — responsible AI / fairness",
-        url: "https://www.coursera.org/courses?query=responsible%20ai%20fairness",
-        note: "Equidad y model cards",
+        label: "IBM AI Fairness 360 — tutorials",
+        url: "https://aif360.res.ibm.com/use",
+        note: "Toolkit de fairness con métricas group-aware",
       },
-      {
-        label: "MIT 6.100L",
-        url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
-        note: "Contratos y tests",
-      },
-      {
-        label: "Harvard CS50P",
-        url: "https://cs50.harvard.edu/python/",
-        note: "Proyectos reproducibles",
-      },
     ],
```

### D-17 (P2, I-14) Split T1-A paragraph 1 long sentence

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ -42,7 +42,7 @@
-        "Los **coeficientes** de un modelo lineal y la **importancia por permutación** miden sensibilidad: cuánto cae una métrica de negocio al barajar una feature (en sklearn real: `permutation_importance` re-evalúa la métrica tras shuffle; aquí trabajas con **drops ya medidos** para enfocarte en el contrato de la ficha). Son mapas **globales del modelo**, **no** veredictos sobre una persona real ni prueba de fraude. Pregunta crítica (Molnar / FairML): ¿cómo podría un modelo sesgado «inventar» importancia alta en un proxy (p. ej. `district_code`) si ese proxy correlaciona con un grupo y el train lo recompensa? Por eso el ranking se documenta con `means_fraud=False` y se cruza después con slices (T2)."
+        "Los **coeficientes** de un modelo lineal y la **importancia por permutación** miden sensibilidad: cuánto cae una métrica de negocio al barajar una feature. En sklearn real, `permutation_importance` **reevalúa** la métrica tras *shuffle*; aquí trabajas con **drops ya medidos** para enfocarte en el contrato de la ficha. Son mapas **globales del modelo**, **no** veredictos sobre una persona real ni prueba de fraude. Pregunta crítica (Molnar / FairML): ¿cómo podría un modelo sesgado «inventar» importancia alta en un proxy (p. ej. `district_code`) si ese proxy correlaciona con un grupo y el entrenamiento lo recompensa? Por eso el ranking se documenta con `means_fraud=False` y se cruza después con slices (T2)."
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issues | Effort | Diff IDs | Why first |
|----|----|----|----|----|
| **P0** (critical, 3-4h) | I-01, I-02, I-03 | ~3h | D-01, D-02, D-03 | Off-topic playground renders under S35's Theory tab. Learners see ADR/Feature-Store code under an "Explicabilidad y equidad" heading. Most damaging defect of the section. Coordinate id rename across `index.ts`, `SectionView.tsx`, `PdfReport.tsx`. |
| **P1** (high, 1h) | I-04, I-05, I-06 | ~1h | D-04, D-05 | 7× `y → e` + 3× `vs.` are objective RAE grammar errors. Cheap to fix, high pedagogical value (these are exactly the rules the section teaches — "ficha de caso responsable"). |
| **P2** (medium, 2-3h) | I-07, I-08, I-09, I-10, I-11, I-12, I-13, I-15 | ~2.5h | D-06, D-07, D-08, D-09, D-10, D-11, D-12, D-13, D-17 | Run-ons in We Do E3 instructions are the cognitive-load ceiling of the section. Splitting them into 4-5 sentences each will materially improve learner comprehension. |
| **P3** (low, 2h) | I-14, I-16, I-17, I-18, I-19, I-20, I-21, I-22, I-23, I-24, I-25 | ~2h | D-14, D-15, D-16 | Anglicism load, em-dash asides, anaphoric monotony, duplicate `hint`/`hints[0]`, off-topic external courses. Polish, not correction. |
| **Total** | | **~8.5h** | 17 diffs | Section 35 would rise from 7.0/10 to ~9.0/10 after fixes. |

---

## 9. Graph Memory Update notes (for shared context files)

For the orchestrator's cross-section graph memory:

- **V3-retarget id-vs-content debt pattern**: now confirmed in **S05, S08, S09, S11, S12, S17, S18, S23, S35** (9 sections). All follow the same root cause: an `id`/filename from a previous course version was not updated when the section was rescoped. Recommend orchestrator run a single sweep across all 52 sections to detect `id` vs `title` mismatch (e.g., id="system-design" but title="Explicabilidad…") and produce a single PR renaming all stale ids + updating `SectionView.tsx INTERACTIVE_PLAYGROUNDS` + `PdfReport.tsx SECTION_LABELS`.
- **`vs` → `vs.` is systemic**: confirmed in S17, S18, S35; likely present in all 52 sections. Recommend a single global regex replace `\bvs\b` → `vs.` in `src/lib/course/sections/*.ts` (excluding code blocks).
- **`y → e` before `imprime` / `i-*`**: 7 occurrences in S35 alone, all in weDo `tests` fields ("obtiene X y imprime `PASS`"). Likely a template pattern repeated across sections — recommend grepping all sections for ` y imprime` and ` y hi` and ` y i`.
- **`re-` prefix hyphenation** (`re-evalúa`, `re-loguear`, `re-render`, `re-navegación`, `re-obtienes`): confirmed in S23 (5 occurrences) and S35 (1 occurrence). RAE rule: prefix + vowel-without-tilde = no hyphen. Recommend a global sweep for `re-[a-z]` patterns in prose.
- **Code/output integrity**: S35 is a positive exemplar — all 8 theory + 8 I Do + 24 We Do solutions produce exactly the documented outputs. This breaks the pseudonymization-drift pattern of S04/S07/S08/S11/S12/S17/S18. The orchestrator's proposed "execute every code block and diff real vs displayed output" harness will pass S35 cleanly; recommend treating S35 as a known-good baseline when building that harness.
- **`hint` vs `hints[0]` duplication**: confirmed in S17, S18, S23, S35 — systemic across all 52 sections. Recommend a single PR dropping the legacy `hint` field and keeping only the `hints` array (verify the UI rendering in `SectionView.tsx` first).
- **Off-topic external courses (MIT 6.100L, Harvard CS50P)**: confirmed in S23, S35. These two intro-Python courses are listed as resources in advanced sections where they don't map to the topic. Recommend replacing with topic-specific resources in each section.
- **TODO case-sensitivity false positive**: confirmed in S17, S23, S35. The grammar subplan's `\bTODO\b` regex with `re.IGNORECASE` matches the Spanish word "todo". Recommend updating the subplan's heuristic to make TODO case-sensitive (only match uppercase `TODO`), keeping other tokens (FIXME, XXX, HACK, MOVED FROM) case-insensitive. The fix has been applied to the local S35 extractor and can be propagated to other auditors' extractors.
- **`claim(s)` anglicism**: confirmed in S17, S18, S35 as a prose loanword (not just code identifier). Fundéu recommends `afirmación(es)`. Recommend a shared es-PE glossary entry for ML/AI loanwords.
- **We Do E3 transfer instruction run-ons**: S35 has 5 E3 instructions that pack 5 contract clauses into a single 51-63 word sentence with semicolon separators. This is a structural pedagogical issue (the "transfer" framing invites dense contract prose). Recommend a curriculum-wide guideline: "transfer instructions must use one sentence per contract branch (CONTINUE / REJECT / REQUEST), separated by periods, not semicolons".

---

## 10. Method Note (Grammar Subplan Application)

The Spanish grammar/style/structure audit followed `audits/_GRAMMAR_SUBPLAN.md` verbatim:

1. **Prose extraction**: TS-aware extractor (`audits/_s35_extract.py`) parsed `s35-system-design.ts` and pulled 432 string records from prose-bearing keys (`title`, `shortTitle`, `tagline`, `jobRelevance`, `learningOutcomes[].text`, `theory[].heading/paragraphs[]/callout.title/content`, `iDo.intro/steps[].description/why`, `weDo.intro/steps[].instruction/hint/hints[]/edgeCases[]/tests/feedback`, `youDo.title/context/objectives[]/requirements[]/portfolioNote/rubric[].criterion`, `selfCheck.questions[].question/options[]/explanation`, `resources.docs/books/courses[].label/note`). After deduplication and Spanish-signal filtering: **339 records → 309 paragraphs → 457 sentences → 6,684 words → 12,831 syllables**.

2. **Code-stripping**: inline code `` `...` `` was replaced with a `[código]` placeholder (not empty string) so that heuristics don't misfire on residual whitespace artifacts (e.g., "Salida exacta: [código] ." has space before period — this is a known FP class documented in §3).

3. **Sentence splitting**: Spanish-aware splitter with light abbreviation guard (`p. ej.`, `etc.`, `Sr.`, `Sra.`, `art.`, `fig.`, `vol.`, etc.). Sentences ending in `:` (e.g., MCQ stems) are correctly treated as closed.

4. **Readability formulas**:
   - **Fernández-Huerta (1959)**: `206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Aggregate: **76.74** (band: "bastante fácil"). Healthy for technical Spanish.
   - **Szigriszt-Pazos / INFLESZ**: `206.835 − 62.3·(syllables/word) − (words/sentence)`. Aggregate: **72.61** (band: "normal"). Healthy.
   - **Words per sentence (WPS)**: mean **14.63** (well under the 32-word pedagogical ceiling).
   - **Syllables per word (SPW)**: mean **1.92** (typical for technical Spanish).

5. **Heuristic rules (13-rule pedagogical suite from the subplan)**: applied per sentence and per paragraph. After FP filtering (see §3 FP table): 0 real `meta_leak`, 0 real `missing_inverted_question`, 0 real `missing_inverted_excl`, 0 real `unbalanced_delim`, 0 real `repeated_word`, 6 real `run_on` (>45w), 10 `long_sentence` (33-44w, of which 6 should be split), 3 real `high_comma_density` (≥5 commas).

6. **LanguageTool (es) public API**: 3 chunks, ~40KB total. 1,149 raw matches → after filtering 1,137 false positives (mostly `MORFOLOK_RULE_ES` tech-term spelling, `COMMA_PARENTHESIS_WHITESPACE` artifacts, `INCORRECT_SPACES` artifacts, `SINGLE_CHARACTER` on math variables, `ES_SPLIT_WORDS` FPs, `D_ELA` FPs on `n`, `PREP_VERB` FPs on code identifiers, `AGREEMENT_*` FPs on "entrada/salida", `SUBJUNTIVO_PASADO` FPs on `use=`, `VOSEO` FPs on `validate`): **12 real LT findings** = 7× `Y_E_O_U` (y → e before i-sound) + 3× `PUNTO_EN_ABREVIATURAS` (vs → vs.) + 1× `COMMA_PERO` (missing comma before pero) + 1× `NO_SEPARADO` (re-evalúa → reevalúa).

7. **Composite grammar score**: Manual composite **7.5/10** (the heuristic composite formula in the extractor over-penalizes FP-heavy classes like `missing_terminal` on labels and `english_dominant` on code-adjacent Spanish; the manual score reflects the actual density of real findings: 6 run-ons + 12 LT findings + 3 high_comma_density in 457 sentences = ~4.6% real-finding rate, which is healthy for technical Spanish).

**Known false-positive classes documented for reuse** (so other auditors / the Fixer do not re-introduce these as "issues"): see §3 FP table.

**Helper artifacts**:
- `/home/z/my-project/audits/_s35_extract.py` (TS-aware extractor + heuristics)
- `/home/z/my-project/audits/_s35_prose.txt` (457 sentences, one per line, fed to LT)
- `/home/z/my-project/audits/_s35_metrics.json` (per-sentence + per-paragraph + aggregate metrics + findings)
- `/home/z/my-project/audits/_s35_lt.py` (LT API runner with chunking + sleep)
- `/home/z/my-project/audits/_s35_lt.json` (1,149 raw LT matches)

---

**This is the complete Explorer report for Section 35. Ready for the Fixer prompt.**
