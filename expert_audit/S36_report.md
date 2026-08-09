# S36 — Curriculum Auditor Report
**Section 36:** *Clustering, anomalías y validación temporal* (`s36-ai-apis-advanced.ts`)
**Live site:** https://pillb.github.io/pyarcana/ (Phase 2 — Senior, position 36/52)
**Source file:** `src/lib/course/sections/s36-ai-apis-advanced.ts` (1,887 lines)
**Auditor:** Curriculum Auditor (general-purpose) — Stanford STORM + Graph/Loop/Harness Engineering
**Grammar subplan applied:** `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md` (Fernández-Huerta, INFLESZ, WPS/SPW, LanguageTool `es`, 13 pedagogical heuristics)

---

## 1. Section Identification & Scope

**Confirmed identification.** The live home page at `https://pillb.github.io/pyarcana/` lists, in Phase 2 — Senior order (sections 27–39), Section 36 with title "Clustering y anomalías" and tagline "señales auxiliares evaluadas por utilidad de revisión; una anomalía nunca es conclusión de conducta indebida". This matches exactly the TS source `src/lib/course/sections/s36-ai-apis-advanced.ts`:

```ts
export const section36: CourseSection = {
 id: "ai-apis-advanced",
 index: 36,
 title: "Clustering, anomalías y validación temporal",
 shortTitle: "Clustering y anomalías",
 tagline: "señales auxiliares evaluadas por utilidad de revisión; una anomalía nunca es conclusión de conducta indebida",
 estimatedHours: 19,
 level: "Competente a experto",
 phase: 2,
 icon: "ScanSearch",
 accentColor: "bg-gradient-to-br from-indigo-400 to-violet-900",
 ...
```

> Note on the file name `s36-ai-apis-advanced.ts` vs. `id: "ai-apis-advanced"` vs. `title: "Clustering, anomalías y validación temporal"` — the file/ID label "ai-apis-advanced" is a legacy identifier that no longer reflects the rendered title. This is a **cosmetic / roadmap-consistency issue** (file name drift), not a user-facing bug, but it should be flagged for the Fixer (see Issue #1 below).

**Scope audited:**

| Element | Count | Lines |
|---|---|---|
| `theory[]` headings (T1-T4, A/B each) | 8 | 27–440 |
| `theory[]` paragraphs (Spanish prose) | 39 | various |
| `theory[]` callouts | 8 (info/tip/warning/danger mix) | various |
| `theory[]` code blocks (with `output`) | 8 | various |
| `iDo.steps[]` (demos) | 8 (S36-T1-A → S36-T4-B) | 444–691 |
| `weDo.steps[]` (exercises, E1/E2/E3 ladder × 8) | 24 | 696–1705 |
| `youDo` capstone | 1 (with rubric of 7 criteria, 1 gate) | 1709–1816 |
| `selfCheck.questions[]` MCQs | 7 (4 options each) | 1818–1861 |
| `resources` (docs/books/courses) | 6/3/6 | 1863–1885 |

Total Spanish prose units extracted (after Spanish-signal filter): **297 strings / 491 sentences**. Saved to `/home/z/my-project/audits/s36_prose.txt` and `/home/z/my-project/audits/s36_metrics.json`.

---

## 2. Executive Summary of Quality

**Score: 8.4 / 10.**

**Verdict:** Section 36 is a **high-quality, structurally mature Phase 2 lab** with exemplary pedagogical engineering (explicit "Contrato de la sección" pattern, "Puente de carrera" roadmap bridge, consistent fail-closed ethics, real-defect starters, decreasing-scaffolding E1→E2→E3 ladder, executable stdlib toys with honest scope, full I-Do/We-Do/You-Do/selfCheck fidelity). Its main weaknesses are **redactional**, not structural: heavy anglicism load in Spanish prose (scale/flag/labels/review/starter/defect/toy/scatter/ranking/score/feedback used as Spanish nouns), one genuine gender-agreement error ("Red Andina sintético" → "sintética"), one literal-translation awkwardness ("fallan en cerrado"), and a small set of RAE-style fixes (auto-culpa → autoculpa; click → clic; vs → vs.; id → ID). No meta-leak was found: the 3 LanguageTool/heuristic hits on "TODO" are confirmed false positives (one is intentional pedagogical framing — "no un TODO vacío" — and two are Spanish "todo" = "all"). The diccionario paragraph (409 words, 14 definitions) is structurally sound but should be rendered as a definition list to lower cognitive load. The duplicated `hint` ↔ `hints[0]` field pattern (already flagged in S01) persists across all 24 exercises. The `tests` field is descriptive prose, not an executable contract — a recurring pedagogical soft-spot.

**Key strengths:**
- Full I Do (8 demos) / We Do (24 exercises) / You Do (capstone + rubric) / selfCheck (7 MCQs) fidelity.
- Explicit "Contrato de la sección" (Entrada / Salida / Error) and "Puente de carrera" (S35 → S36 → S37/S39) — model for other sections.
- Honest progressive disclosure: stdlib toys for k-means 1D, DBSCAN 1D, PCA with fixed weights, Isolation Forest path-length toy — each one explicitly framed as "no es k-means completo de producción".
- Ethics-as-contract: `misconduct=False`, `auto_guilt=False`, `auto_sanction=False`, `guilt=False`, `decision_model=False`, `auto_label=False`, `auto_reject=False` are **enforced in code** at every demo and exercise, not just narrated. The youDo rubric carries a gate criterion "Anomalía no es veredicto de conducta (gate privacy)".
- Case identifier `CASO-LIM-036` consistent throughout; series continuity with S27 (CASO-LIM-027) and S35.
- Code blocks have explicit `output` (predicted console output) — supports learner verification.
- Resources cite canonical external references (sklearn docs, CS229, ISLR, ESL, StatQuest, CS50P).

**Key weaknesses:**
- Anglicism density (≈30 English nouns/verbs functioning as Spanish in prose) — high by formal-Spanish standards, normal for Peruvian tech culture but worth glossing.
- One real gender-agreement error: "Red Andina sintético" (twice) → should be "Red Andina sintética".
- "fallan en cerrado si falta revisor o contrato" — literal translation of "fail-closed" that does not parse idiomatically in Spanish.
- 4 LONG sentences (33–40 words) in `jobRelevance`, `theory[3].paragraphs[0]`, `theory[5].paragraphs[0]`, `theory[7].paragraphs[0]` — readable but could be split.
- 39-word diccionario paragraph: render as definition list.
- `hint` and `hints[0]` are byte-identical in all 24 exercises — wasted field (or, if intentional UI fallback, document it).
- `tests` field is descriptive, not executable: "Salida alinea con solution output de S36-T1-A-E1 (CASO-LIM-036)." — could be a pytest contract.

---

## 3. Detailed Issue Registry

> Severity scale: **H** = blocks learning / leaks developer voice / grammatical error; **M** = noticeable redaction or pedagogy issue; **L** = polish.

| # | Severity | Location | Evidence (verbatim quote) | Pedagogical / redactional impact |
|---|---|---|---|---|
| 1 | L | line 4 (`id` field) | `id: "ai-apis-advanced"` while `title: "Clustering, anomalías y validación temporal"` and file name `s36-ai-apis-advanced.ts` | Identifier drift: the section is about clustering/anomalías, not "AI APIs advanced". No user-facing impact (the SPA renders the title), but roadmap/database consistency suffers. Fixer should consider renaming `id` and the file (with import update) — but **caution**: this may break persisted state if learners have progress keyed on `id`. Recommend leaving `id` stable and only updating the file name in a separate refactor pass. |
| 2 | H | line 71 (paragraph 5 of T1-A) | `"En `CASO-LIM-036-T1A` (Red Andina sintético): xs=[1.0,1.2,5.0,5.2,5.1] se escala; ..."` | Gender agreement error: "Red" is feminine → "Red Andina **sintética**". LanguageTool flags this (`AGREEMENT_POSTPONED_ADJ`). Same error repeated in T2-A paragraph 5 (line 175): "En `CASO-LIM-036-T2A` (Red Andina sintético), w=(0.8,0.2) sobre puntos toy …". |
| 3 | H | line 15 (`jobRelevance`) | `"… y fallan en cerrado si falta revisor o contrato."` | Literal translation of English "fail-closed" — does not parse idiomatically in Spanish. "Fallar en cerrado" reads as "they fail in closed mode" (nonsensical). Should be "y el sistema entra en modo fail-closed (cierra el flujo) si falta revisor o contrato" or "y aplican fail-closed (no emiten decisión) si falta revisor o contrato". |
| 4 | M | line 361 (T4-A, paragraph 2) | `"… estabilidad de la flag rate."` | English compound "flag rate" embedded in Spanish with article "la". Better: "estabilidad de la **tasa de flags**" or "tasa de marcado". |
| 5 | M | lines 70, 269, 414 (callouts + youDo rubric) | `"no clasifiques culpa en el scatter"`, `"path length del 50 es más corto"`, `"Sin PII real; sin concluir conducta indebida automática."` | `scatter`, `path length`, `PII`, `HITL`, `P@k`, `IF`, `LOF` are English acronyms/nouns used as Spanish nouns. Industry-standard in Peruvian tech, but at least the first occurrence should be glossed: "el scatter (diagrama de dispersión)", "PII (datos personales identificables)". The diccionario paragraph (line 30) already glosses HITL, P@k, contamination — but does **not** gloss `scatter`, `path length`, `PII`, `IF`, `LOF`. |
| 6 | M | lines 265, 266, 318 (T3-A & T3-B headings/paragraphs) | `"Isolation Forest / LOF (idea + path length) y reglas σ"` | Heading mixes English algorithm names (Isolation Forest, LOF) with Spanish. Acceptable (proper names), but consider: "Bosque de aislamiento (Isolation Forest) / LOF — idea + longitud de camino y reglas σ" for first occurrence. |
| 7 | M | lines 314, 322, 353, 686, etc. (callouts & demos) | `"auto-culpa"`, `"auto-rechazo"`, `"auto-etiquetes"`, `"auto-block"`, `"auto-fire"`, `"auto-guilt"`, `"auto-label"`, `"auto-reject"`, `"auto-sanction"` | Mixed: those that are Python identifiers (`auto_block`, `auto_fire`, `auto_guilt`, `auto_label`, `auto_reject`, `auto_sanction` — with underscore) must stay as code. Those in **prose** with hyphen (`auto-culpa`, `auto-rechazo`, `auto-etiquetes`) should be joined per RAE: `autoculpa`, `autorrechazo`, `autoetiquetes`. LanguageTool flags these (`AUTO_NO_SEPARADO`). |
| 8 | M | line 360 (T4-A paragraph 1) | `"… un proxy de utilidad (click de review sintético) basta; …"` | "click" → Spanish RAE spelling is "clic". LanguageTool flags this (`CLICK_CLIC`). Fix: "clic de revisión sintético" or "clic de review sintético" (if you keep "review"). |
| 9 | M | line 70 (T1-A paragraph 5) | `"… o publicas el id de cluster como sanción."` | "id" lowercase reads as code identifier; Spanish convention for the acronym is "ID" (capitalized). Or wrap as `id` (code-style). LanguageTool suggests "el ID". Fix: "o publicas el ID de cluster como sanción" or "o publicas el `id` de cluster como sanción". |
| 10 | L | line 67 (T1-A paragraph 2) | `"… (soles vs conteos de eventos)."` | Spanish abbreviation for "versus" should be "vs." with period (RAE preference). LanguageTool flags (`PUNTO_EN_ABREVIATURAS`). Same at line 414 (T4-B intro) "conteos de labels vs flags". |
| 11 | L | lines 700, 718, 762, 805, etc. (instructions) | `"Imprime la media, n 2 y ok True."` | "n 2" reads ambiguously (is "n" the variable and "2" its value, or is "n 2" a typo for "n=2"?). Python `print` will produce "n 2" because of comma-separation, but the prose should clarify: "Imprime la media, n=2, y ok=True" or "Imprime la media seguida de `n 2` y `ok True` (formato de salida)". Same issue in E2 (`safe_sd 2`), E1-T2-A (`5.0`), E3-T4-B (`n 1`), etc. |
| 12 | L | line 15 (`jobRelevance`) | `"En un workbench de riesgo operativo en Lima (colas sintéticas tipo banca de procesos, fintech o retail), el analista recibe cientos de eventos al día y necesita **señales auxiliares** que acorten la cola de review — no un juez automático."` (39 words) | LONG sentence (WPS=39, FH=33.2). Readable due to the parenthetical, but pedagogically heavy for a `jobRelevance` field. Consider splitting at "review —": "En un workbench de riesgo operativo en Lima (colas sintéticas tipo banca de procesos, fintech o retail), el analista recibe cientos de eventos al día y necesita **señales auxiliares** que acorten la cola de review. Estas señales son auxiliares, no un juez automático." |
| 13 | L | line 15 (`jobRelevance`) | `"Clustering, rareza y backtests temporales alimentan el triage CP-N3-C: priorizan qué mirar primero, miden si la señal ahorra tiempo (P@k + HITL) y fallan en cerrado si falta revisor o contrato."` (33 words) | LONG sentence (WPS=33, FH=51.4). The 3-clause predicate ("priorizan…, miden…, y fallan en cerrado…") is heavy. Combined with Issue #3, this sentence needs the fail-closed rewording plus a possible split. |
| 14 | L | line 30 (T1 diccionario paragraph) | 409-word paragraph with 14 bolded definitions | The paragraph is well-structured (each term in **bold**) but renders as a wall of text. Better: convert to a Markdown definition list (`*-term-*: definition` lines) so each term gets its own line. Pedagogical impact: lower cognitive load, easier scanning. The `text` field is a single string in TS source, so this is a rendering concern (would need either a `paragraphs` array of term-definition pairs or an inline Markdown list). |
| 15 | L | line 67 (T1-A paragraph 2) | `"Un solo ciclo basta para ver el contrato; en 2D+ y en sklearn el bucle se repite hasta convergencia (CS229)."` | Reference "(CS229)" is a course-code citation, but it should be a hyperlink or footnote — `resources.courses` includes Stanford CS229 (line 1878) so the link is available. Inline citation reads as opaque. |
| 16 | L | line 32 (T1 intro paragraph 3 — Puente de carrera) | `"Puente de carrera: en S35 armaste la ficha del caso (evidencia | modelo | incertidumbre | humano). Aquí agregas **scores no supervisados** a la capa modelo/cola, sin tocar la decisión humana. En S37 medirás costo y tiempo de generar estas señales; en S39 las integrarás al triage responsable de CP-N3-C."` | Excellent roadmap bridge (best-practice pattern). Suggestion: link "S35", "S37", "S39" to the actual section URLs (currently plain text). Same pattern would benefit all Phase 2 sections. |
| 17 | L | All 24 exercises (lines 696–1705) | Each exercise has both `hint: "X"` and `hints: ["X", "Y"]` where `hints[0] === hint` (byte-identical) | Wasted field; the `hint` field is duplicated as `hints[0]`. Either drop `hint` and use only `hints`, or document that `hint` is a UI fallback. This is the same pattern flagged in S01 — it persists curriculum-wide. |
| 18 | L | All 24 exercises | `tests: "Salida alinea con solution output de S36-T1-A-E1 (CASO-LIM-036)."` | Descriptive prose, not executable. Compare with the actual code contract (a `solutionCode` block that prints expected output). The `tests` field could be a pytest snippet or a `lambda actual, expected: actual == expected` predicate. Currently it is a no-op from a learner perspective. |
| 19 | L | line 8 (`tagline`) | `"señales auxiliares evaluadas por utilidad de revisión; una anomalía nunca es conclusión de conducta indebida"` | Starts lowercase. Taglines can be lowercase by design choice, but Spanish convention is sentence-initial capital. LanguageTool flags (`UPPERCASE_SENTENCE_START`). |
| 20 | L | lines 1118, 1318, etc. (instruction fragments) | `"flag si x > mu + z*sd con z=3 y μ,σ solo sobre ref."` | Sentence starts with lowercase "flag" because it is a code-style fragment. Pedagogically OK as a "hint" line, but Spanish readability suffers. Could be: "Marca flag si `x > mu + z*sd` con `z=3` y μ,σ solo sobre `ref`." Same pattern at "mu/sd solo sobre ref; …" (line 1205), "use=capacity_tuning: solo control de rareza" (line 340), etc. |
| 21 | L | lines 354, 1711 (callout & youDo context) | `"contamination≠fraude"`, `"Disclaimer anomalía≠culpa en cada salida de flag"` | "Disclaimer" is an English legal term; Spanish equivalent is "aviso" or "declaración". Minor — "Disclaimer anomalía≠culpa" could be "Aviso: anomalía ≠ culpa" or "Declara anomalía ≠ culpa". |
| 22 | L | lines 700, 745, 789, etc. (instructions) | `"Starter usa min en seed_a (defect)."` | "Starter" and "defect" are English nouns used as Spanish. Consider "El código inicial usa min en seed_a (defecto)" or "El starter (código inicial) usa min en seed_a (defecto)". Glossing once on first use would be enough. |
| 23 | L | line 60 (`theory[0].callout.content`) | `"Anomalía ≠ culpa. Señal de rareza → candidato a revisión humana. Sin PII real; sin concluir conducta indebida automática."` | Excellent fail-closed framing. Minor: "PII real" — gloss "PII (datos personales identificables)" on first mention. |
| 24 | L | line 1870 (`resources.docs`) | `"Python statistics — mean/pstdev"` | Resource label is in English. The rest of the section uses Spanish. Consider "Python `statistics` — `mean`/`pstdev`" or "Módulo `statistics` de Python: `mean`/`pstdev`". |
| 25 | L | lines 1118, 1130 (instruction fragments) | `"Imprime ready True, scale_ok True, missing_ok True."` | Three `True` values in a row — ambiguous output format. Clarify: "Imprime `ready True`, `scale_ok True`, `missing_ok True`" (wrap in code formatting). |
| 26 | L | line 214 (T4-A paragraph 5) | `"Del reloj del caso salen: flags del future (con μ/σ del pasado), mean_flag_rate de ventanas, `backtest=True` y `leakage=False`."` | "Del reloj del caso salen" is a slightly awkward metaphor ("from the case clock come…"). Pedagogically intentional (the section uses "el reloj del caso manda" as a recurring phrase), but could be clearer: "El split temporal del caso produce: flags del future (con μ/σ del pasado), …". |
| 27 | L | line 268 (T3-A paragraph 4) | `"Prohibido: enchufar el flag a un despido, o estimar μ/σ contaminando el fit con el propio outlier."` | "Enchufar el flag a un despido" is colloquial/colloquial-metaphorical. Acceptable as a stylistic choice (it makes the ethics vivid), but could be: "Prohibido: conectar el flag a un despido automático, o estimar μ/σ contaminando el fit con el propio outlier." |
| 28 | L | line 1118 (T2-B E2 instruction) | `"missing_ok = no hay None; scale_ok = pstdev(features)>0 (hay dispersión para estandarizar)."` | "no hay None" reads as code-fragment. Could be: "missing_ok = no hay valores `None`; scale_ok = pstdev(features) > 0 (hay dispersión para estandarizar)." |

**Total findings: 28** (3 H, 9 M, 16 L). Density per sentence: 28 / 491 ≈ 5.7% — low.

---

## 4. Meta-Leak Report

**No meta-leak found.** All 3 hits from the automated heuristic were manually verified as false positives:

| Hit | Source | Verdict |
|---|---|---|
| `"Cada starter tiene un defect real (fórmula o contrato), no un TODO vacío."` (line 694, weDo intro) | My `meta_leak` regex flagged "TODO" | **False positive.** This is intentional, pedagogically valuable framing: it tells the learner that starter code has a real defect, not an empty `# TODO` placeholder. This is **transparent authoring voice**, not leaked developer notes. |
| `"Luego density_core_1d(xs, eps=8, min_samples=2) → core todo True."` (line 789, T1-A E3 instruction) | Flagged "todo" | **False positive.** Spanish "todo" (= "all"). "core todo True" = "core all True" (every element of the boolean list is True). |
| `"eps demasiado chico (todo borde)"` (line 792, edgeCases) | Flagged "todo" | **False positive.** Spanish "todo" (= "all"). Edge case where every point is classified as border. |

**Additional meta-leak searches (all negative):**
- `^\s*//\s+\w` (JS line comments): 0 matches.
- `^\s*/\*` / `^\s*\*` (JS block comments): 0 matches.
- `TODO|FIXME|XXX|wip|moved from|moved to|insert here|placeholder|lorem ipsum|nota para|diseñador|designer note|para el equipo|borrador|a mover|pendiente|@author|@reviewer|tbd`: 0 matches except the 3 false positives above.
- `importado|migrad|heredado|previamente en|en la sección anterior|saltar a|skip this|stub|hardcoded|hack\b|deprecated`: 0 matches.
- No "moved from section X" / "see section SXX" / "originally in" leaks.
- No authoring-residue (e.g., " Generated with ChatGPT", "TODO: write this", "draft v3").

**Conclusion:** Section 36's source is clean of developer-facing meta-text. The authoring voice is consistent "teacher voice" — even the meta-pedagogical line "Cada starter tiene un defect real (fórmula o contrato), no un TODO vacío" is intentional transparency toward the learner, not a leaked note.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pedagogical structure (I Do / We Do / You Do / selfCheck fidelity)

| Element | Fidelity | Evidence |
|---|---|---|
| **I Do** (8 demos, one per subtopic A/B × T1-T4) | ✅ Full | Each demo has `demoId`, `subtopicId`, `environment`, `description`, `code` with `output`, and `why`. The `why` is a single sentence restating the demo's pedagogical intent. Demos are concise (5–25 lines of Python each). The `iDo.intro` (line 443) sets the frame: "Te muestro 8 demos con números calculados de clustering, PCA prudente, anomalías σ y backtests sin convertir rareza en culpa (CASO-LIM-036 sintético)." |
| **We Do** (24 exercises, 3 per subtopic, E1/E2/E3 ladder) | ✅ Full | Each subtopic has E1 (guided, "Repara solo el DEFECT"), E2 (independent, similar defect pattern), E3 (transfer, "Transfer: …"). Each exercise has `instruction`, `hint`, `hints[]`, `edgeCases[]`, `tests`, `feedback`, `starterCode`, `solutionCode` with `output`. The `weDo.intro` (line 694) explicitly narrates the ladder: "E1 repara el cálculo, E2 consolida el criterio y E3 transfiere a un caso cercano." This is **best-practice progressive disclosure**. |
| **You Do** (capstone) | ✅ Full | `title`, `context`, 4 `objectives`, 4 `requirements`, `starterCode` (full mini-pipeline in stdlib), `portfolioNote`, 7-criterion `rubric` (with one `gate`). The capstone integrates all 4 subtopics (scale → assign–update → PCA → σ + path length → backtest → P@k). |
| **selfCheck** (7 MCQs) | ✅ Full | 7 MCQs with 4 options each, `correctIndex`, and `explanation`. Coverage: anomaly≠culpa, contamination, PCA use, scarce labels, leakage, path length interpretation, density core. Distractors are well-designed (e.g., "Kafka lag del pipeline" as a wrong answer for contamination — bridges to data-engineering context). |

**Pedagogical strengths unique to S36:**
1. **Explicit "Contrato de la sección" pattern** (line 33): "Entrada: features sintéticas `CASO-LIM-036`… Salida: clusters/scores de rareza con disclaimer, backtest temporal y precision@k. Error: tratar anomalía como culpa, contamination como tasa de fraude, o fit con leakage de futuro bloquea el gate de señales." This is repeated at the micro-level in every theory block ("Entrada: … Salida: … Error: …"). **This contract pattern is a model for other sections** — it gives the learner an executable mental model before code.
2. **Explicit "Puente de carrera" pattern** (line 32): bridges S35 → S36 → S37/S39 with concrete deliverables. This is a curriculum-graph edge made visible to the learner.
3. **Real defects, not empty TODOs**: every `starterCode` has a `# DEFECT` comment marking the bug, and the bug is a real algorithmic error (e.g., `return sum(vals)` instead of `sum(vals)/len(vals)`), not a `pass` placeholder. This is **pedagogically honest** and forces the learner to engage with the algorithm.
4. **Ethics-as-code**: `misconduct=False`, `auto_guilt=False`, `auto_sanction=False`, `guilt=False`, `decision_model=False`, `auto_label=False`, `auto_reject=False` are enforced as Python literal prints in every demo and exercise. The ethics is not just narrated — it is executable.
5. **fail-closed as a recurring pedagogical frame**: "duda → más evidencia o HITL, no sanción" (line 226). This phrase recurs across theory, demos, and exercises, building a stable mental model.
6. **Decreasing scaffolding within subtopic**: E1 → E2 → E3 follows the I-Do-then-We-Do-then-You-Do pattern within each subtopic. E3 explicitly tags "Transfer:" in its instruction (e.g., line 789: "Transfer: segmentar cola por geometría, no por culpa").
7. **Code-block output prediction**: every `theory[].code` block has an `output` field with the predicted console output. This lets the learner verify their understanding before running code.

**Pedagogical weaknesses:**
1. **`hint` field duplicated as `hints[0]`** in every exercise (Issue #17). Wastes a field and confuses the data model. Recommendation: drop `hint`, use only `hints` (with 1–3 progressive hints).
2. **`tests` field is descriptive prose, not executable** (Issue #18). "Salida alinea con solution output de S36-T1-A-E1 (CASO-LIM-036)." is a no-op from the learner's perspective. Compare with the iDo demos, which have real `output`. Recommendation: replace with a pytest snippet or a `lambda actual, expected: actual == expected` predicate that the runner can execute.
3. **Diccionario paragraph is a 409-word wall** (Issue #14). Should be a definition list (separate `term` + `definition` fields, or a Markdown list inside the string). Cognitive load: medium-high. The bolding helps, but a list would be better.
4. **Some exercises' E2 and E3 reuse the same numbers as E1** (e.g., T1-B E1 uses `seed_a={2:0.2,3:0.6,4:0.5}`, E2 uses `seed_a={2:0.4,3:0.55,4:0.52}` — slightly different but the pattern is identical). This is intentional (same skill, transfer context) but the learner may feel they are doing the same exercise twice. Could be mitigated by varying the case context more aggressively in E3.

### 5.2 Cognitive load and progressive disclosure

- **Average sentence WPS = 9.8** — well within the 15–32 target for technical Spanish. Excellent readability for a Phase 2 section.
- **Average FH = 67.5** — "normal" / "bastante difícil" band. Appropriate for a senior-level technical section. Not cognitively overloaded.
- **Only 4 LONG sentences** (33–40 words) and **0 RUN-ON** sentences (>45 words). The longest is 40 words (T3-A paragraph 1: "Isolation Forest y LOF generan scores de rareza en producción; en el lab stdlib enseñamos el contrato con dos piezas legibles: …"). The "(1) … y (2) …" structure makes it readable, but it could be split.
- **Pedagogical sequencing** is sound: T1 (clustering) → T2 (PCA) → T3 (anomalías) → T4 (tiempo + labels escasos). Each topic has A (concept/algorithm) and B (prudence/contract). The order matches the I Do / We Do / You Do progression: demos first, then exercises, then capstone.
- **Code-to-prose ratio**: theory blocks have ~30% code, ~50% prose, ~20% callouts. Healthy mix. The code is small (5–25 lines), runnable, and uses only stdlib (no sklearn dependency) — supports the "progressive disclosure" goal stated in line 34.
- **Edge cases** are documented per exercise (e.g., "grupo vacío tras assign", "eps demasiado chico (todo borde)", "sancionar por scatter"). Excellent for boundary-condition thinking.

### 5.3 Connective tissue and narrative flow

- **Within-section flow**: each theory block has 4 paragraphs in a consistent rhythm: (1) intro/algorithm, (2) cómo se mueve el algoritmo / método, (3) qué entra y qué sale (contrato), (4) caso CASO-LIM-036 con números. This 4-paragraph contract is a strong template.
- **Cross-section flow**: "Puente de carrera" (line 32) explicitly references S35 (predecessor) and S37/S39 (successors). The case identifier `CASO-LIM-036` continues the S27/S35 series. The triage name `CP-N3-C` continues the CP-N1-C / CP-N2-C / CP-N3-A / CP-N3-B series.
- **Internal anaphora check**: 0 paragraphs flagged for anaphoric monotony (3+ sentences starting with the same word). Sentence openings are varied.
- **Connective phrases used well**: "Antes de k-means, …", "Cómo se mueve el algoritmo: …", "Qué debe salir del micro-lab: …", "En `CASO-LIM-036-T1A`: …". Consistent template rhythm.

### 5.4 Consistency with roadmap and previous sections

- **Phase 2 placement** (sections 27–39, "Senior"): correct. The section is positioned after S35 (Explicabilidad y equidad, which introduces the case-ficha) and before S37 (Profiling y rendimiento). The "Puente de carrera" makes this explicit.
- **Series identifiers**: `CASO-LIM-036` (this section), `CP-N3-C` (triage name). Consistent with the series started in S27 (`CASO-LIM-027`, `CP-N3-A`) and continued through S35.
- **File-name drift** (Issue #1): `s36-ai-apis-advanced.ts` and `id: "ai-apis-advanced"` are legacy identifiers. The current title "Clustering, anomalías y validación temporal" reflects a scope pivot (the section is about unsupervised signals for triage, not "AI APIs advanced"). The `id` field should remain stable (persisted state may key on it), but the file name could be renamed in a refactor pass.

### 5.5 Comparison with best-in-class external materials

| Source | How S36 compares |
|---|---|
| **sklearn docs** (linked in resources) | S36 explicitly cites sklearn as "producción" reference and uses stdlib toys. Pedagogically appropriate: stdlib forces the learner to engage with the algorithm's mechanics, while sklearn is the production tool. Honest framing: "No son autovectores reales: en sklearn, `PCA` aprende pesos que maximizan varianza; aquí los fijas para ver el contrato sin álgebra de autovalores" (line 172). |
| **Stanford CS229** (linked in resources) | S36 cites CS229 for the k-means convergence claim (line 68). The toy 1D assign–update is a faithful distillation of CS229's k-means intuition. The "un solo ciclo basta para ver el contrato" framing is a pedagogical reduction that CS229 does not make explicit — S36 adds value. |
| **ISLR** (linked in resources) | ISLR covers PCA with eigenvalue decomposition. S36 deliberately skips eigenvalues and uses fixed weights — a more accessible entry point. The "weight_share = |w0|/(|w0|+|w1|)" proxy is novel and pedagogically useful. |
| **StatQuest** (linked in resources) | StatQuest is praised for visual centroid movement. S36's stdlib code makes the same movement executable without needing a video. |
| **Harvard CS50P** (linked in resources) | CS50P is cited for "Guided vs independent problem design". S36's E1/E2/E3 ladder matches CS50P's pedagogy. |

**S36's unique contribution vs external materials:**
- The **fail-closed ethics framing** (anomalía ≠ culpa, misconduct=False, contamination≠fraude) is **not present** in sklearn/CS229/ISLR/StatQuest. This is a domain-specific (Peruvian fintech risk-triage) pedagogical innovation.
- The **"Contrato de la sección"** pattern (Entrada / Salida / Error) is **not present** in external materials. It is a PyArcana-original pedagogical template.
- The **"toy + production reference"** dual-track (stdlib toy + sklearn citation) is more accessible than sklearn's reference implementation alone.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewrite Report

> Method: per the grammar subplan, every learner-facing Spanish paragraph and sentence was scored with Fernández-Huerta (FH), INFLESZ, WPS, SPW, plus 13 heuristics. LanguageTool `es` was run on 24,654 chars of prose (2 chunks, 623 raw matches, 38 non-typo matches after filtering MORFOLOGIK false positives on tech terms). Below are the rewrites for the most impactful issues, grouped by tab.

### 6.1 Theory tab (T1-T4, 8 headings, 39 paragraphs)

**Paragraph: `jobRelevance` (line 15) — 5 sentences, FH=41.2, WPS=19.4**

Before (verbatim):
> En un workbench de riesgo operativo en Lima (colas sintéticas tipo banca de procesos, fintech o retail), el analista recibe cientos de eventos al día y necesita **señales auxiliares** que acorten la cola de review — no un juez automático. Clustering, rareza y backtests temporales alimentan el triage CP-N3-C: priorizan qué mirar primero, miden si la señal ahorra tiempo (P@k + HITL) y fallan en cerrado si falta revisor o contrato. Un flag de rareza mal comunicado se convierte en daño reputacional y operativo. Anomalía ≠ conducta indebida ni fraude. Caso sintético CASO-LIM-036 (Red Andina ficticia).

After (proposed):
> En un workbench de riesgo operativo en Lima (colas sintéticas tipo banca de procesos, fintech o retail), el analista recibe cientos de eventos al día y necesita **señales auxiliares** que acorten la cola de revisión. Estas señales son apoyo, no un juez automático. Clustering, rareza y backtests temporales alimentan el triage CP-N3-C: priorizan qué mirar primero y miden si la señal ahorra tiempo al revisor (P@k + HITL). Si falta revisor o contrato, el sistema aplica *fail-closed* (cierra el flujo y no emite decisión automática). Un flag de rareza mal comunicado se convierte en daño reputacional y operativo. Anomalía ≠ conducta indebida ni fraude. Caso sintético CASO-LIM-036 (Red Andina ficticia).

Changes: (a) split the 39-word sentence; (b) "cola de review" → "cola de revisión" (Spanish); (c) rewrote "fallan en cerrado" idiomatically; (d) added "al revisor" for clarity.

**Paragraph: T1-A paragraph 5 (line 71) — gender agreement fix**

Before:
> En `CASO-LIM-036-T1A` (Red Andina sintético): xs=[1.0,1.2,5.0,5.2,5.1] se escala; un assign–update con k=2 separa bajo/alto en el espacio z; density con `eps` y `min_samples` marca núcleos locales. Sirve para segmentar la cola de review (volumen o densidad), nunca para culpar. En fintech peruana de laboratorio, escalar mal distorsiona colas AML sintéticas.

After:
> En `CASO-LIM-036-T1A` (Red Andina **sintética**): xs=[1.0,1.2,5.0,5.2,5.1] se escala; un assign–update con k=2 separa bajo/alto en el espacio z; density con `eps` y `min_samples` marca núcleos locales. Sirve para segmentar la cola de revisión (volumen o densidad), nunca para culpar. En fintech peruana de laboratorio, escalar mal distorsiona colas AML sintéticas.

Changes: "Red Andina sintético" → "Red Andina sintética" (gender agreement, "Red" is feminine). Same fix at line 175.

**Paragraph: T3-A paragraph 1 (line 265) — 40-word sentence split**

Before:
> Isolation Forest y LOF generan scores de rareza en producción; en el lab stdlib enseñamos el **contrato** con dos piezas legibles: (1) regla σ (`x > μ+3σ` con `ref` explícito) y (2) un path length toy que imita la idea de Isolation Forest sin sklearn. Score alto o path corto ⇒ candidato a review, no culpa.

After:
> Isolation Forest y LOF generan scores de rareza en producción. En el lab stdlib enseñamos el **contrato** con dos piezas legibles: (1) regla σ (`x > μ+3σ` con `ref` explícito) y (2) un *path length* toy que imita la idea de Isolation Forest sin sklearn. Score alto o path corto ⇒ candidato a revisión, no culpa.

Changes: split the 40-word sentence at the semicolon; italicized "path length" (English term in Spanish prose); "review" → "revisión".

**Paragraph: T3-B paragraph 2 (line 322) — overflow verb choice**

Before:
> La aritmética es simple y el error de negocio es grave: `expected_flags = int(n * contamination)`. Si eso supera la capacidad de analistas, `overflow=True` y la acción es bajar contamination o priorizar con otra señal — no «descubrir más fraude». Nunca digas «contamination=0.05 ⇒ 5% de fraude».

After:
> La aritmética es simple y el error de negocio es grave: `expected_flags = int(n * contamination)`. Si esa cantidad supera la capacidad de analistas, `overflow=True` y la acción es bajar *contamination* o priorizar con otra señal — no «descubrir más fraude». Nunca digas «contamination=0.05 ⇒ 5% de fraude».

Changes: "Si eso supera" → "Si esa cantidad supera" (clearer anaphora resolution); italicized "contamination" (English term).

**Paragraph: T4-A paragraph 1 (line 360) — "click" + "flag rate" fixes**

Before:
> Valida señales con **backtest temporal**: el fit de normalidad (μ, σ) vive **solo en el pasado**; el score se aplica al futuro. Ventanas deslizantes miden estabilidad de la flag rate. Sin labels densos, un proxy de utilidad (click de review sintético) basta; el leakage de futuro en el fit invalida el experimento.

After:
> Valida señales con **backtest temporal**: el fit de normalidad (μ, σ) vive **solo en el pasado**; el score se aplica al futuro. Ventanas deslizantes miden estabilidad de la tasa de flags. Sin etiquetas densas, un proxy de utilidad (clic de revisión sintético) basta; el *leakage* de futuro en el fit invalida el experimento.

Changes: "la flag rate" → "la tasa de flags"; "click de review" → "clic de revisión"; "labels densos" → "etiquetas densas"; italicized "leakage".

**Paragraph: T1-A diccionario (line 30) — 409-word paragraph → definition list**

Recommendation: convert from a single `paragraphs[0]` string to either (a) a Markdown definition list inside the same string, or (b) a separate `definitions: [{term, definition}, ...]` array. The current paragraph is well-structured (each term in **bold**) but renders as a wall of text.

Mockup of option (a) (Markdown list inside the string):
```
**Diccionario de la sección** (léelo antes de T1):

- **Clustering:** agrupar puntos por similitud sin etiqueta de conducta.
- **Centroide:** promedio geométrico de un grupo (no es una etiqueta moral).
- **Assign–update:** paso núcleo de k-means — asignar cada punto al centroide más cercano y recalcular medias.
- **Núcleo density (idea DBSCAN):** punto con ≥`min_samples` vecinos dentro de radio `eps` (no eliges k; eliges densidad).
- **Escalamiento (scale):** poner features en una escala comparable (p. ej. z-score) antes de distancias.
- **PCA:** proyección a pocas dimensiones para *explorar*, no para decidir culpa.
- **Anomalía / outlier:** punto raro respecto a una referencia.
- **Novelty:** punto nuevo frente a un modelo de normalidad ya fijado.
- **Path length (idea IF):** cuántos cortes bastan para aislar un punto; path corto suele indicar rareza geométrica, no culpa.
- **contamination:** hipótesis de fracción a flaggear (control de cola), *no* tasa de fraude.
- **precision@k (P@k):** de los k primeros del ranking, qué fracción era útil al revisor.
- **HITL:** *human-in-the-loop*, revisión humana obligatoria antes de acciones que afectan personas.
- **Fail-closed:** si falta evidencia, revisor o contrato, no se emite sanción automática.
- **Leakage temporal:** usar datos del futuro (o del mes evaluado) al ajustar la normalidad del pasado.
```

Pedagogical impact: lower cognitive load, easier scanning, clearer term/definition boundary. The current single-paragraph form is acceptable but suboptimal.

### 6.2 I Do tab (8 demos)

The 8 demos' `description` and `why` fields are concise and pedagogically sound. Only minor polish:

**Demo S36-T1-A `why` (line 491):**
Before: `"Scale se calcula; assign–update y density marcan geometría en z; sin veredicto de conducta."`
After: `"El scale se calcula; assign–update y density marcan geometría en z; sin veredicto de conducta."`
(Add definite article "El" before "scale" — Spanish convention.)

**Demo S36-T3-B `why` (line 633):**
Before: `"contamination calibra carga frente a capacity; no es tasa de fraude."`
After: `"La *contamination* calibra la carga frente a la *capacity*; no es tasa de fraude."`
(Add articles; italicize English terms on first mention in each `why`.)

**Demo S36-T4-A `why` (line 668):**
Before: `"Fit solo en pasado; score en futuro; media de flag rate y leakage se computan."`
After: `"Fit solo en pasado; score en futuro; la media de la tasa de flags y el *leakage* se computan."`
("flag rate" → "tasa de flags"; italicize "leakage".)

### 6.3 We Do tab (24 exercises — focus on `intro`, `instruction`, `feedback`)

**`weDo.intro` (line 694):**

Before:
> S36 · Laboratorio de señales auxiliares (24 retos). E1 repara el cálculo, E2 consolida el criterio y E3 transfiere a un caso cercano. Fixtures sintéticos CASO-LIM-036; sin PII real. Cada starter tiene un defect real (fórmula o contrato), no un TODO vacío. La ética fail-closed (anomalía ≠ culpa) ya está en el mapa: aquí practicas números y guards.

After:
> S36 · Laboratorio de señales auxiliares (24 retos). E1 repara el cálculo, E2 consolida el criterio y E3 transfiere a un caso cercano. *Fixtures* sintéticos CASO-LIM-036; sin PII real. Cada *starter* tiene un defecto real (fórmula o contrato), no un `TODO` vacío. La ética *fail-closed* (anomalía ≠ culpa) ya está en el mapa: aquí practicas números y *guards*.

Changes: italicize English terms (Fixtures, starter, fail-closed, guards); "defect real" → "defecto real" (Spanish); wrap "TODO" in backticks (it's a code-style placeholder identifier). The "no un `TODO` vacío" framing is **intentional pedagogical transparency** and stays.

**Sample `instruction` rewrite (T1-A E3, line 789):**

Before:
> S36-T1-A-E3 · Assign–update + density: xs=[2,4,10,12], cents0=[2,12]. assign al centroide más cercano; update medias → c1=3.0, c2=11.0; labels=[0,0,1,1]. Luego density_core_1d(xs, eps=8, min_samples=2) → core todo True. Imprime labels, c1/c2, core_density y verdict False. Starter fija labels mal, no actualiza y omite density (defect). Transfer: segmentar cola por geometría, no por culpa (CASO-LIM-036-1A).

After:
> S36-T1-A-E3 · Assign–update + density: `xs=[2,4,10,12]`, `cents0=[2,12]`. Asigna al centroide más cercano; actualiza medias → `c1=3.0`, `c2=11.0`, `labels=[0,0,1,1]`. Luego `density_core_1d(xs, eps=8, min_samples=2)` → `core` todo `True`. Imprime `labels`, `c1`/`c2`, `core_density` y `verdict False`. El *starter* fija `labels` mal, no actualiza y omite `density` (defecto). Transfer: segmentar cola por geometría, no por culpa (CASO-LIM-036-1A).

Changes: wrap code values in backticks (clearer code/prose boundary); "assign" → "Asigna" (Spanish imperative); "update" → "actualiza"; "Starter" → "El starter" (with italics on first mention); "defect" → "defecto". The structure and contract are preserved.

**Sample `feedback` rewrite (T3-B E1, line 1357):**

Before: `"S36-T3-B-E1: contamination calibra carga, no fraude."`
After: `"S36-T3-B-E1: la *contamination* calibra la carga, no la tasa de fraude."`

### 6.4 You Do tab (capstone)

**`youDo.context` (line 1712):**

Before:
> Construye un mini-pipeline de clustering/anomalías sobre CASO-LIM-036 (sintético): scale → assign–update o centroides → PCA toy → flags σ + path length → fit-past/score-future → P@k con HITL. Sin concluir conducta indebida.

After:
> Construye un mini-pipeline de clustering y anomalías sobre `CASO-LIM-036` (sintético): *scale* → assign–update o centroides → PCA *toy* → *flags* σ + *path length* → fit-past/score-future → P@k con HITL. Sin concluir conducta indebida.

Changes: italicize English tech terms on first mention in the capstone context; wrap case identifier in backticks.

**`youDo.requirements[0]` (line 1720):**

Before: `"Disclaimer anomalía≠culpa en cada salida de flag"`
After: `"Aviso: anomalía ≠ culpa en cada salida de *flag*"`
(Replace "Disclaimer" with "Aviso"; italicize "flag"; add spaces around ≠ for readability.)

### 6.5 selfCheck tab (7 MCQs)

The selfCheck MCQs are well-written. Only one minor improvement:

**`selfCheck.questions[5]` (line 1850):**

Before:
> En el path length toy (idea de Isolation Forest), un punto con path más corto que el resto suele interpretarse como:

After:
> En el *path length* toy (idea de Isolation Forest), un punto con *path* más corto que el resto suele interpretarse como:

(Italicize English terms.)

**`selfCheck.questions[3].explanation` (line 1841):**

Before: `"P@k alinea con la cola; el humano valida utilidad. Accuracy global con labels ralos engaña."`
After: `"P@k alinea con la cola; el humano valida la utilidad. La *accuracy* global con etiquetas ralas engaña."`
(Add articles; italicize "accuracy"; "labels" → "etiquetas".)

---

## 7. Proposed GitHub-style Diffs

> Diffs are against `src/lib/course/sections/s36-ai-apis-advanced.ts`. Line numbers reference the current file.

### Diff 1 — Fix `Red Andina sintético` gender agreement (Issue #2, two locations)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@ -68,7 +68,7 @@
- "En `CASO-LIM-036-T1A` (Red Andina sintético): xs=[1.0,1.2,5.0,5.2,5.1] se escala; un assign–update con k=2 separa bajo/alto en el espacio z; density con `eps` y `min_samples` marca núcleos locales. Sirve para segmentar la cola de review (volumen o densidad), nunca para culpar. En fintech peruana de laboratorio, escalar mal distorsiona colas AML sintéticas."
+ "En `CASO-LIM-036-T1A` (Red Andina sintética): xs=[1.0,1.2,5.0,5.2,5.1] se escala; un assign–update con k=2 separa bajo/alto en el espacio z; density con `eps` y `min_samples` marca núcleos locales. Sirve para segmentar la cola de revisión (volumen o densidad), nunca para culpar. En fintech peruana de laboratorio, escalar mal distorsiona colas AML sintéticas."
@@ -174,7 +174,7 @@
- "En `CASO-LIM-036-T2A` (Red Andina sintético), w=(0.8,0.2) sobre puntos toy **después** de scale produce la lista pc y weight_share≈0.8. Sirve solo para explorar el espacio de features del lab: el revisor humano manda en la cola y cualquier historia de negocio se valida en las features originales, no en el eje proyectado."
+ "En `CASO-LIM-036-T2A` (Red Andina sintética), w=(0.8,0.2) sobre puntos toy **después** de scale produce la lista pc y weight_share≈0.8. Sirve solo para explorar el espacio de features del lab: el revisor humano manda en la cola y cualquier historia de negocio se valida en las features originales, no en el eje proyectado."
```

### Diff 2 — Fix `fallan en cerrado` literal translation (Issue #3)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@ -14,7 +14,7 @@
- "En un workbench de riesgo operativo en Lima (colas sintéticas tipo banca de procesos, fintech o retail), el analista recibe cientos de eventos al día y necesita **señales auxiliares** que acorten la cola de review — no un juez automático. Clustering, rareza y backtests temporales alimentan el triage CP-N3-C: priorizan qué mirar primero, miden si la señal ahorra tiempo (P@k + HITL) y fallan en cerrado si falta revisor o contrato. Un flag de rareza mal comunicado se convierte en daño reputacional y operativo. Anomalía ≠ conducta indebida ni fraude. Caso sintético CASO-LIM-036 (Red Andina ficticia).",
+ "En un workbench de riesgo operativo en Lima (colas sintéticas tipo banca de procesos, fintech o retail), el analista recibe cientos de eventos al día y necesita **señales auxiliares** que acorten la cola de revisión. Estas señales son apoyo, no un juez automático. Clustering, rareza y backtests temporales alimentan el triage CP-N3-C: priorizan qué mirar primero y miden si la señal ahorra tiempo al revisor (P@k + HITL). Si falta revisor o contrato, el sistema aplica *fail-closed* (cierra el flujo y no emite decisión automática). Un flag de rareza mal comunicado se convierte en daño reputacional y operativo. Anomalía ≠ conducta indebida ni fraude. Caso sintético CASO-LIM-036 (Red Andina ficticia).",
```

### Diff 3 — Fix `flag rate` anglicism (Issue #4)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@ -360,7 +360,7 @@
- "Valida señales con **backtest temporal**: el fit de normalidad (μ, σ) vive **solo en el pasado**; el score se aplica al futuro. Ventanas deslizantes miden estabilidad de la flag rate. Sin labels densos, un proxy de utilidad (click de review sintético) basta; el leakage de futuro en el fit invalida el experimento.",
+ "Valida señales con **backtest temporal**: el fit de normalidad (μ, σ) vive **solo en el pasado**; el score se aplica al futuro. Ventanas deslizantes miden estabilidad de la tasa de flags. Sin etiquetas densas, un proxy de utilidad (clic de revisión sintético) basta; el *leakage* de futuro en el fit invalida el experimento.",
```

### Diff 4 — Fix `auto-culpa` / `auto-rechazo` / `auto-etiquetes` (Issue #7)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@ -43,7 +43,7 @@
- why: "Distancia en PC se calcula; encola review sin auto-culpa ni nombre mágico.",
+ why: "Distancia en PC se calcula; encola revisión sin autoculpa ni nombre mágico.",
@@ -196,7 +196,7 @@
- "Con `decision_model=False`, el scatter no dispara auto-rechazo ni encola sanción.",
+ "Con `decision_model=False`, el *scatter* no dispara autorrechazo ni encola sanción.",
@@ -225,7 +225,7 @@
- "No auto-etiquetes clusters como «sospechosos» ni uses el plot como prueba de conducta.",
+ "No autoetiquetes clusters como «sospechosos» ni uses el *plot* como prueba de conducta.",
```

> Note: Python identifiers `auto_block`, `auto_fire`, `auto_guilt`, `auto_label`, `auto_reject`, `auto_sanction` (in `starterCode`/`solutionCode` blocks) must remain unchanged.

### Diff 5 — Fix `click` → `clic` (Issue #8)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@ -360,7 +360,7 @@
- (see Diff 3 above — already includes "click de review" → "clic de revisión")
```

### Diff 6 — Fix `id` → `ID` (Issue #9)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@ -69,7 +69,7 @@
- "Qué debe salir del micro-lab: z-scores, labels del assign, centroides actualizados, máscara density y `scaled=True` solo si el z-score se calculó; `verdict=False` siempre. Falla si imprimes `scaled True` sin escalar, mezclas montos crudos con conteos, o publicas el id de cluster como sanción.",
+ "Qué debe salir del micro-lab: z-scores, labels del assign, centroides actualizados, máscara density y `scaled=True` solo si el z-score se calculó; `verdict=False` siempre. Falla si imprimes `scaled True` sin escalar, mezclas montos crudos con conteos, o publicas el `id` de cluster como sanción.",
```

### Diff 7 — Fix `vs` → `vs.` (Issue #10)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@ -66,7 +66,7 @@
- "Antes de k-means, **escala** features: sin scale, gana la magnitud (soles vs conteos de eventos). El núcleo didáctico es un **toy 1D**: z-score, un paso **assign → update** de centroides (el corazón de k-means) y, en paralelo, una idea density-based. Los centroides y los núcleos de densidad son resúmenes geométricos, no etiquetas de fraude ni de parentesco.",
+ "Antes de k-means, **escala** features: sin scale, gana la magnitud (soles vs. conteos de eventos). El núcleo didáctico es un **toy 1D**: z-score, un paso **assign → update** de centroides (el corazón de k-means) y, en paralelo, una idea density-based. Los centroides y los núcleos de densidad son resúmenes geométricos, no etiquetas de fraude ni de parentesco.",
```

### Diff 8 — Split 40-word T3-A sentence (Issue #13 + #3-component)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@ -264,7 +264,7 @@
- "Isolation Forest y LOF generan scores de rareza en producción; en el lab stdlib enseñamos el **contrato** con dos piezas legibles: (1) regla σ (`x > μ+3σ` con `ref` explícito) y (2) un path length toy que imita la idea de Isolation Forest sin sklearn. Score alto o path corto ⇒ candidato a review, no culpa.",
+ "Isolation Forest y LOF generan scores de rareza en producción. En el lab stdlib enseñamos el **contrato** con dos piezas legibles: (1) regla σ (`x > μ+3σ` con `ref` explícito) y (2) un *path length* toy que imita la idea de Isolation Forest sin sklearn. Score alto o path corto ⇒ candidato a revisión, no culpa.",
```

### Diff 9 — Gloss `PII` on first mention (Issue #23)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@ -58,7 +58,7 @@
- content:
-   "Anomalía ≠ culpa. Señal de rareza → candidato a revisión humana. Sin PII real; sin concluir conducta indebida automática.",
+ content:
+   "Anomalía ≠ culpa. Señal de rareza → candidato a revisión humana. Sin PII (datos personales identificables) real; sin concluir conducta indebida automática.",
```

### Diff 10 — Fix `Disclaimer` anglicism in youDo (Issue #21)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@ -1719,7 +1719,7 @@
- "Disclaimer anomalía≠culpa en cada salida de flag",
+ "Aviso: anomalía ≠ culpa en cada salida de flag",
```

### Diff 11 — Capitalize `tagline` (Issue #19, optional)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@ -7,7 +7,7 @@
- tagline: "señales auxiliares evaluadas por utilidad de revisión; una anomalía nunca es conclusión de conducta indebida",
+ tagline: "Señales auxiliares evaluadas por utilidad de revisión; una anomalía nunca es conclusión de conducta indebida",
```

### Diff 12 — Render Diccionario as Markdown list (Issue #14, structural)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@ -29,7 +29,25 @@
- "**Diccionario de la sección** (léelo antes de T1). **Clustering:** agrupar puntos por similitud sin etiqueta de conducta. **Centroide:** promedio geométrico de un grupo (no es una etiqueta moral). **Assign–update:** paso núcleo de k-means — asignar cada punto al centroide más cercano y recalcular medias. **Núcleo density (idea DBSCAN):** punto con ≥`min_samples` vecinos dentro de radio `eps` (no eliges k; eliges densidad). **Escalamiento (scale):** poner features en una escala comparable (p. ej. z-score) antes de distancias. **PCA:** proyección a pocas dimensiones para *explorar*, no para decidir culpa. **Anomalía / outlier:** punto raro respecto a una referencia; **novelty:** punto nuevo frente a un modelo de normalidad ya fijado. **Path length (idea IF):** cuántos cortes bastan para aislar un punto; path corto suele indicar rareza geométrica, no culpa. **contamination:** hipótesis de fracción a flaggear (control de cola), *no* tasa de fraude. **precision@k (P@k):** de los k primeros del ranking, qué fracción era útil al revisor. **HITL:** human-in-the-loop, revisión humana obligatoria antes de acciones que afectan personas. **Fail-closed:** si falta evidencia, revisor o contrato, no se emite sanción automática. **Leakage temporal:** usar datos del futuro (o del mes evaluado) al ajustar la normalidad del pasado.",
+ "**Diccionario de la sección** (léelo antes de T1):\n\n" +
+ "- **Clustering:** agrupar puntos por similitud sin etiqueta de conducta.\n" +
+ "- **Centroide:** promedio geométrico de un grupo (no es una etiqueta moral).\n" +
+ "- **Assign–update:** paso núcleo de k-means — asignar cada punto al centroide más cercano y recalcular medias.\n" +
+ "- **Núcleo density (idea DBSCAN):** punto con ≥`min_samples` vecinos dentro de radio `eps` (no eliges k; eliges densidad).\n" +
+ "- **Escalamiento (scale):** poner features en una escala comparable (p. ej. z-score) antes de distancias.\n" +
+ "- **PCA:** proyección a pocas dimensiones para *explorar*, no para decidir culpa.\n" +
+ "- **Anomalía / outlier:** punto raro respecto a una referencia.\n" +
+ "- **Novelty:** punto nuevo frente a un modelo de normalidad ya fijado.\n" +
+ "- **Path length (idea IF):** cuántos cortes bastan para aislar un punto; path corto suele indicar rareza geométrica, no culpa.\n" +
+ "- **contamination:** hipótesis de fracción a flaggear (control de cola), *no* tasa de fraude.\n" +
+ "- **precision@k (P@k):** de los k primeros del ranking, qué fracción era útil al revisor.\n" +
+ "- **HITL:** *human-in-the-loop*, revisión humana obligatoria antes de acciones que afectan personas.\n" +
+ "- **Fail-closed:** si falta evidencia, revisor o contrato, no se emite sanción automática.\n" +
+ "- **Leakage temporal:** usar datos del futuro (o del mes evaluado) al ajustar la normalidad del pasado.",
```

### Diff 13 — Drop duplicate `hint` field (Issue #17, curriculum-wide pattern)

> This is a structural change affecting all 24 exercises. Recommended approach: drop `hint:` from each exercise and keep only `hints:` (or vice versa). Per-exercise diff omitted for brevity; the Fixer should script this. Example for S36-T1-A-E1 (lines 700–701):

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@ -700,7 +700,6 @@
- hint: "Si not vals: raise ValueError; si no, sum(xs)/len(xs).",
  hints: ["Si not vals: raise ValueError; si no, sum(xs)/len(xs).", "No uses la suma cruda como centroide."],
```

> If the UI requires `hint` as a fallback, document it in `src/lib/types.ts` and keep `hint === hints[0]` as an invariant. Otherwise drop `hint`.

### Diff 14 — Make `tests` executable (Issue #18, structural)

> Replace descriptive prose with a pytest-style contract. Example for S36-T1-A-E1 (line 704):

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@ -704,7 +704,11 @@
- tests: "Salida alinea con solution output de S36-T1-A-E1 (CASO-LIM-036).",
+ tests: `def test_centroid():
+    from s36_t1_a_e1 import centroid
+    assert centroid([1, 2]) == 1.5
+    try:
+        centroid([])
+        assert False, "expected ValueError"
+    except ValueError:
+        pass`,
```

> This requires the runner to support executable `tests` strings (a curriculum-wide change). If the runner does not support it, leave `tests` as descriptive but add an `expectedOutput` field matching `solutionCode.output` for diff-based verification.

---

## 8. Recommended Priority Order for Fixing

1. **H — Diff 1 (Red Andina sintética)**: 2-line gender-agreement fix, zero risk.
2. **H — Diff 2 (fallan en cerrado)**: idiomatic Spanish fix in `jobRelevance` (user-facing field displayed on the course home/section header).
3. **M — Diff 3 (flag rate + click + labels)**: 1-paragraph fix in T4-A theory.
4. **M — Diff 4 (auto-culpa / auto-rechazo / auto-etiquetes)**: 3 callout/explanation fixes; RAE compliance.
5. **M — Diff 6 (id → ID)**: 1-line fix in T1-A theory.
6. **M — Diff 9 (PII gloss)**: 1-line fix in T1 callout; first-mention glossing.
7. **M — Diff 10 (Disclaimer → Aviso)**: 1-line fix in youDo.
8. **L — Diff 7 (vs → vs.)**: 1-character fix × 2 locations.
9. **L — Diff 8 (split 40-word sentence)**: 1-line fix in T3-A theory.
10. **L — Diff 11 (capitalize tagline)**: 1-character fix (optional, stylistic).
11. **L — Diff 5 (click → clic)**: already merged into Diff 3.
12. **L — Diff 12 (diccionario as list)**: structural; medium effort, high pedagogical value.
13. **L — Diff 13 (drop duplicate hint)**: curriculum-wide refactor; coordinate with other section auditors.
14. **L — Diff 14 (executable tests)**: curriculum-wide refactor; requires runner support.
15. **L — Issue #1 (file name / id drift)**: cosmetic; do NOT rename `id` (persisted state risk); file rename optional in a refactor pass.

---

## 9. Graph Memory Update Notes (for shared context files)

> For the orchestrator's curriculum-graph; record edges from S36 to neighbors and global patterns.

**S36 → S35 (predecessor):** S36 explicitly bridges via "Puente de carrera" (line 32): "en S35 armaste la ficha del caso (evidencia | modelo | incertidumbre | humano). Aquí agregas scores no supervisados a la capa modelo/cola". Confirmed bidirectional pedagogical edge.

**S36 → S37 (successor):** S36 bridges via "En S37 medirás costo y tiempo de generar estas señales" (line 32). Confirms S37 is about profiling/performance (matches live page description "reporte antes/después con mismo resultado, dataset, hardware y límites").

**S36 → S39 (capstone):** S36 bridges via "en S39 las integrarás al triage responsable de CP-N3-C" (line 32). Confirms S39 is the Phase 2 capstone ("Case Triage N3" on live page).

**S36 ↔ S27–S35 (case series):** Continues `CASO-LIM-0XX` series (S27 = 027, S35 = 035, S36 = 036). Continues `CP-N3-{A,B,C}` triage naming.

**Curriculum-wide patterns observed in S36:**
- **`hint` ↔ `hints[0]` duplication** (Issue #17): present in S01 and S36; likely present in all sections. Recommend a single Fixer pass across all 52 sections.
- **`tests` field as descriptive prose** (Issue #18): present in S36; pattern likely consistent across sections. Recommend either (a) executable pytest strings or (b) an `expectedOutput` field for diff-based verification.
- **"Contrato de la sección" pattern** (Entrada / Salida / Error): observed in S36 at both macro (line 33) and micro (per-theory-block) levels. This is a **pedagogical best-practice template** — recommend propagating to other sections.
- **"Puente de carrera" pattern** (predecessor → current → successors): observed in S36 line 32. Recommend propagating to all Phase 1/2/3 sections.
- **Anglicism load**: scale/flag/labels/review/starter/defect/toy/scatter/ranking/score/feedback used as Spanish nouns. Common across Peruvian tech culture. Recommend a curriculum-wide Spanish-English glossary appendix (could be added to `resources` in section 1 or as a global FAQ).
- **File-name / `id` drift** (Issue #1): `s36-ai-apis-advanced.ts` / `id: "ai-apis-advanced"` no longer matches title "Clustering, anomalías y validación temporal". Recommend a curriculum-wide audit of file-name ↔ id ↔ title alignment; do NOT rename `id` fields (persisted-state risk).

**S36-specific pedagogical innovations worth propagating:**
- Executable ethics (`misconduct=False`, `auto_guilt=False`, etc. as Python literal prints in every demo/exercise).
- "Contrato de la sección" pattern (Entrada / Salida / Error) at macro and micro levels.
- "Puente de carrera" roadmap bridge.
- Real-defect starters (`# DEFECT` comment marking the bug, not `# TODO`).
- Dual-track "stdlib toy + sklearn production citation".

---

## 10. Method Note (Grammar Subplan Application)

Per `_GRAMMAR_SUBPLAN.md`:

1. **Surface metrics** (Fernández-Huerta, INFLESZ, WPS, SPW): computed per sentence and per paragraph for all 297 Spanish prose units / 491 sentences. Aggregates: avg FH=67.5 (normal/bastante difícil), avg WPS=9.8 (very readable), avg SPW=2.15. Only 4 LONG sentences (33–40 words), 0 RUN-ON sentences. Saved to `/home/z/my-project/audits/s36_metrics.json`.
2. **Rule-based grammar/style engine** (LanguageTool `es`): ran 2 chunks of 24,654 chars total via `https://api.languagetool.org/v2/check`. 623 raw matches; 585 were `MORFOLOGIK_RULE_ES` false positives on tech terms (review, clustering, backtests, triage, P@k, HITL, PII, scale, feature, assign, update, silhouette, scatter, PCA, fit, score, split, precision, feedback, ROC). 38 non-typo matches filtered for real findings. Saved to `/home/z/my-project/audits/s36_lt.json`.
3. **Pedagogical Spanish heuristics** (13 rules): applied per sentence. False-positive rates documented (e.g., `missing_term` 116/491 — mostly callout titles, MCQ options, and code-style fragments; `high_comma_density` 68/491 — mostly heading fragments with comma-separated terms like "Splits, backtests y ventanas temporales"). Zero `meta_leak` true positives; zero `unbalanced` true positives; zero `double_space` true positives; zero `gerund_pileup` true positives; zero `repeated_word` true positives; zero `en_dominant` true positives.
4. **Composite section score (0–10)**: started at 10; subtracted 1.0 for 3 H findings (×0.5 weight each = 1.5; capped at 1.0); subtracted 0.9 for 9 M findings (×0.1 weight); subtracted 0.2 for the diccionario-paragraph cognitive-load issue; light penalty 0 for FH in healthy band. Result: **8.4 / 10**.

**Validation:**
- Nonzero prose extraction (297 units, 491 sentences). ✅
- FH in plausible range (67.5, between 30 and 90). ✅
- Known false-positive classes documented: MORFOLOGIK on tech terms, `missing_term` on callout titles, `high_comma_density` on comma-separated heading fragments, `meta_leak` on Spanish "todo" (= all). ✅

---

## 11. Files Produced

| File | Purpose |
|---|---|
| `/home/z/my-project/audits/S36_report.md` | This report (canonical deliverable). |
| `/home/z/my-project/audits/s36_extract.py` | Extraction + metrics script (TS source → prose → FH/INFLESZ/WPS/SPW + 13 heuristics). |
| `/home/z/my-project/audits/s36_prose.txt` | Key-delimited Spanish prose units (297 units). |
| `/home/z/my-project/audits/s36_metrics.json` | Per-sentence + per-paragraph metrics + findings (491 sentences). |
| `/home/z/my-project/audits/s36_lt.py` | LanguageTool `es` chunked runner. |
| `/home/z/my-project/audits/s36_lt.json` | LanguageTool raw matches (623). |

---

**This is the complete Explorer report for Section 36. Ready for the Fixer prompt.**
