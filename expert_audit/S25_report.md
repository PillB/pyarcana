# S25 — Explorer Report — pyarcana Curriculum Audit

**Section:** 25 / 52 — `Endpoints de IA, Hugging Face y prompting evaluado`
**Live URL:** https://pillb.github.io/pyarcana/#streamlit-dashboards
**Source file:** `src/lib/course/sections/s25-streamlit-dashboards.ts` (1,754 lines)
**Phase 1 — Competente · 19 h · Competente level · bound to gate CP-N2-C**
**Audit agent:** Curriculum Auditor (general-purpose)
**Methodology:** Stanford STORM + Graph Engineering + Loop Engineering + Harness Engineering; Spanish grammar subplan (`_GRAMMAR_SUBPLAN.md`); Fernández-Huerta 1959, INFLESZ / Szigriszt-Pazos, WPS/SPW heuristics, 13-rule pedagogical Spanish scanner, LanguageTool `es` public API.

> This report is the canonical deliverable for Section 25. It does **not** apply any fix — it proposes GitHub-style diffs only.

---

## 1. Section Identification & Scope

### 1.1 Confirmed identity
- `src/lib/course/index.ts` line 27 imports `section25` from `./sections/s25-streamlit-dashboards`.
- The active `COURSE_SECTIONS` array places `section25` in slot 25 (Phase 1 — Competente, slots 14–26).
- The file declares (lines 3–13):
  - `id: "streamlit-dashboards"` ← legacy slug
  - `index: 25`
  - `title: "Endpoints de IA, Hugging Face y prompting evaluado"`
  - `shortTitle: "IA endpoints y prompts"`
  - `tagline: "clasificador/extractor especializado y generador de narrativa con JSON validado; no se acepta una salida sin evidencia ni eval contra baseline"`
  - `estimatedHours: 19`, `level: "Competente"`, `phase: 1`
  - `icon: "Sparkles"`

### 1.2 Live-site verification (agent-browser)
- Opened `https://pillb.github.io/pyarcana/#streamlit-dashboards`.
- The 25th card in the sidebar reads: `Sección 25 · IA endpoints y prompts · clasificador/extractor especializado y generador`.
- The H1 in the main panel reads `Endpoints de IA, Hugging Face y prompting evaluado`.
- `document.location.hash` returns `#streamlit-dashboards`.
- The default Theory tab text matches the source byte-for-byte (verified against `paragraphs` array entries in `s25-streamlit-dashboards.ts` lines 29–32).
- The "Pruébalo tú mismo" interactive editor block at the bottom of the Theory tab renders the title `Practica estado y caching (simulado)` — this is the **Streamlit simulator demo** keyed by `'streamlit-dashboards'` in `src/components/course/SectionView.tsx` line 2127. Confirmed live.

### 1.3 Scope audited
| Tab | Source lines | # units audited |
|-----|--------------|-----------------|
| Theory (`theory[]`) | 26–365 | 9 headings + 28 paragraphs + 9 code blocks + 9 callouts |
| I Do (`iDo.{intro, steps[]}`) | 366–587 | 1 intro + 8 steps (one per subtopic) |
| We Do (`weDo.{intro, steps[]}`) | 588–1547 | 1 intro + 24 steps (3 per subtopic: guided, independent, transfer) |
| You Do (`youDo`) | 1548–1641 | 1 capstone with title, context, 4 objectives, 4 requirements, starterCode skeleton, portfolioNote, 6-criterion rubric |
| Autocheck (`selfCheck.questions[]`) | 1642–1680 | 5 MCQs (question + 4 options + correctIndex + explanation) |
| Resources (`resources`) | 1681–1753 | 7 docs + 2 books + 4 courses |
| Interactive "Pruébalo tú mismo" demo | `SectionView.tsx` lines 2127–2203 (NOT in `s25-streamlit-dashboards.ts`) | 1 StreamlitSimulator demo (off-topic) |

The 4 subtopic groups (T1, T2, T3, T4) × 2 subtopics each = 8 subtopics (`S25-T1-A`, `S25-T1-B`, `S25-T2-A`, `S25-T2-B`, `S25-T3-A`, `S25-T3-B`, `S25-T4-A`, `S25-T4-B`).

### 1.4 What this section is *actually* about (so the leak is unambiguous)
The content covers: (T1) stack-selection tree `rules` vs `specialized_model` vs `llm_structured` vs `human`, model cards/licenses and local-vs-cloud deploy decisions; (T2) Hugging Face `transformers.pipeline` mock + Inference Endpoints, batching/timeout/cache/cost/circuit breaker; (T3) prompt structure (Objetivo/Contexto/Restricciones/Ejemplos/Schema JSON), thinking/tools/checkpoints with allowlist and `tool_denied` stop; (T4) golden-set eval (exact match, schema rate, field F1), prompt injection / exfiltration / minimization, `auto_fraud_label=False` policy. The string `streamlit` appears **exactly once** in the entire 1,754-line file — on line 4, inside the `id` field. The string `assist`/`HF`/`endpoint`/`prompting` appears 63 times. The string `S25` (subtopic IDs) appears 105 times.

---

## 2. Executive Summary of Quality

### 2.1 Composite score: **7.0 / 10**
- Pedagogical structure: **9 / 10** — gold-standard I Do / We Do / You Do fidelity (8 demos, 24 exercises with starter/solution/output, capstone, 5 self-check questions, all bound to a single gate contract CP-N2-C; DEFECT-pattern used uniformly in starters).
- Spanish readability: **8 / 10** — mean FH 82.7 ("fácil"), mean INFLESZ 78.6, mean WPS 11.3, mean SPW 1.88; 1 genuine long sentence (iDo intro 40 w), 0 genuine run-ons (the apparent 61-w run-on is a sentence-splitter false-positive caused by `**` markdown).
- Redaction & grammar: **7 / 10** — 3 systemic errors repeated across the section: "El AI assist" (10×, gender+anglicism), "vs" without period (8×), "auto-XXX" / "re-XXX" compounds with hyphens (7×); minor issues with self-check stems and "saltarse eval" / "la ops correcta".
- Meta-leak posture: **3 / 10** — **CRITICAL** structural leak: `id: "streamlit-dashboards"` and the matching `demos['streamlit-dashboards']` interactive editor load a Streamlit simulator on a section that has nothing to do with Streamlit (confirmed live, exact same defect pattern as S06's NumPy editor on a NumPy-forbidden section).
- Connective tissue: **9 / 10** — strong backward references (S24 OCR context, S26 orchestration) and forward references (S26); ethical spine uniform across all subtopics ("score ≠ fraude", "fail-closed to human_review", "no auto-fraud-label").
- Cognitive load: **8 / 10** — clear T1→T4 progression, schema-first gating, fixture `CASO-LIM-025` reused consistently; minor overload in iDo intro (40-word enumeration of 9 items) and in `jobRelevance` first sentence (38 words).

### 2.2 Key verdict
The section is **pedagogically excellent** and **ethically airtight** but **structurally mis-identified**: the legacy slug `streamlit-dashboards` leaks through (a) the live URL hash and (b) an off-topic interactive Streamlit demo rendered at the bottom of the Theory tab. This is the **single biggest learner-facing defect** and the same systemic pattern observed in S05 (`id:"oop"` on a Functions section), S06 (`id:"numpy"` on a NumPy-forbidden section), S07 (`id:"data-acquisition"`), S08 (`id:"pandas"`), S10 (`id:"sklearn"` on a packaging section), S11 (`id:"testing"` on an OOP section), S12 (`id:"performance"` on an APIs/SQL/Geo section). **Recommend coordinated rename to `id:"ai-endpoints"` (or `ai-assist`) and removal of the orphaned `demos['streamlit-dashboards']` entry from SectionView.tsx** (or replacing it with an on-topic AI-assist mini-demo).

### 2.3 Score breakdown
| Dimension | Score | Notes |
|---|---|---|
| Pedagogical structure (I Do / We Do / You Do / Autocheck fidelity) | 9 / 10 | 8 demos, 24 graded exercises, capstone, 5 MCQs; DEFECT pattern uniform; ethical spine consistent |
| Cognitive load / progressive disclosure | 8 / 10 | Clear T1→T4 progression; iDo intro overload (40-w sentence with 9 items) |
| Connective tissue & narrative flow | 9 / 10 | Strong S24/S26 links; CP-N2-C gate explicit; ethical spine uniform |
| Grammatical correctness (Peruvian Spanish) | 7 / 10 | "El AI assist" (10×), "vs" (8×), "auto-XXX"/"re-XXX" (7×), minor Q-stem issues |
| Redaction & technical writing | 7 / 10 | Readability healthy (FH 82.7); some anglicisms (deploy, hosting, HITL) not glossed |
| Meta-leak posture | 3 / 10 | Critical: legacy `streamlit-dashboards` slug + off-topic interactive demo |
| Exercise & exam quality | 9 / 10 | 24 exercises with starter/solution/output/hint/hints/edgeCases/feedback/tests; capstone rubric weighted; 5 MCQs with explanations |
| Consistency with roadmap / previous sections | 7 / 10 | CP-N2-C gate aligned with S24/S26; legacy slug inconsistent |
| Comparison with best-in-class external materials | 8 / 10 | Aligns with OWASP LLM Top 10, HF model cards paper, Chip Huyen AI Engineering; structured outputs aligns with OpenAI docs |
| **Composite** | **7.0 / 10** | |

---

## 3. Detailed Issue Registry

> Severity: **H** = blocks learning / contradicts policy / leaks; **M** = noticeable defect on a learner-visible surface; **L** = polish / style / false-positive-adjacent.

| # | Sev | Location (file:line) | Field | Evidence (verbatim) | Pedagogical impact |
|---|-----|----------------------|-------|---------------------|--------------------|
| 1 | **H** | `s25-streamlit-dashboards.ts:4` | `id` | `id: "streamlit-dashboards",` | Live URL `#streamlit-dashboards` advertises a Streamlit course that does not exist; learners searching the URL for "streamlit" find AI endpoints content. Same systemic leak as S05/S06/S07/S08/S10/S11/S12. |
| 2 | **H** | `SectionView.tsx:2127–2203` | `demos['streamlit-dashboards']` | `title: 'Practica estado y caching (simulado)'`, `class StreamlitSimulator:`, `def cache_data(self, func):` … `@st.cache_data`, `st.session_state["clicks"] += 1` | The "Pruébalo tú mismo" interactive editor at the bottom of the Theory tab loads a Streamlit simulator demo teaching `st.session_state` and `@st.cache_data` — completely off-topic for an AI endpoints / HF / prompting section. Confirmed live: rendered title reads "Practica estado y caching (simulado)" with 58 lines of Streamlit code. Identical defect class to S06 (numpy editor on a NumPy-forbidden section). |
| 3 | **H** | `s25-streamlit-dashboards.ts:15, 30, 211, 246, 326, 367, 1549, 1551, 1632, 1645, 1666` (10 occurrences) | `jobRelevance`, `paragraphs`, `intro`, `youDo.{title,context,portfolioNote}`, `selfCheck.questions[0,3].question` | `El AI assist de CP-N2-C produce **borradores**` / `El AI assist solo propone` / `El AI assist sigue siendo borrador` / `El AI assist solo borra` / `Te muestro el AI assist de CP-N2-C` / `Asistente JSON evaluado (AI assist CP-N2-C)` / `implementa el AI assist de CP-N2-C` / `Componente AI assist de CP-N2-C` / `¿Cuándo preferir reglas a un LLM en el AI assist?` / `El AI assist de este curso puede etiquetar fraude` | "AI" is an anglicism; the Spanish form is "IA" (femenine: *la inteligencia artificial*). The article "El" before "AI" is doubly wrong: (a) wrong language, (b) wrong gender ("la IA"). The You Do title already uses the correct Spanish form "Asistente JSON evaluado", so the section is internally inconsistent. LanguageTool fires `AGREEMENT_DET_NOUN` 10×. |
| 4 | **H** | `s25-streamlit-dashboards.ts:17, 31, 285, 319, 1043, 1666+` (8+ occurrences) | `learningOutcomes[0]`, `paragraphs` (theory[0].paragraphs[1]), `paragraphs` (T4-A.p[0]), `callout.content` (T4-A), `feedback` (S25-T2-B-E3), `selfCheck.questions[4].options[0]` | `Elegir regla vs modelo especializado vs LLM` / `sin métricas vs baseline` / `Sin eval vs baseline` / `eval vs baseline` / `circuit_open vs rules` | Spanish RAE: the abbreviation "vs." requires a period. Without the period it reads as an English word. LanguageTool fires `PUNTO_EN_ABREVIATURAS` 8×. |
| 5 | **H** | `s25-streamlit-dashboards.ts:15, 30, 367, 328, 695, 707, 1516, 1670` (7 occurrences) | `jobRelevance`, `paragraphs` (theory[0].p[0]), `iDo.intro`, `paragraphs` (T4-B.p[2]), `weDo.steps[2].hint`, `weDo.steps[2].starterCode`, `weDo.steps[23].hint`, `selfCheck.questions[3].explanation` | `auto-etiquetar fraude` / `auto-envío ni auto-etiqueta de fraude` / `auto-etiqueta fraude` / `auto-etiquetar culpa` / `auto-etiqueta fraude` / `# Bug: LLM se auto-etiqueta fraude en metadata` / `no auto-fraude` | Spanish RAE / DPD: prefixes `auto-`, `ex-`, `pre-`, `pro-`, `re-` form single words with the base noun/verb. The correct forms are `autoetiquetar`, `autoenvío`, `autoetiqueta`, `autoetiquetar`, `autofraude` (or `auto fraude` as two words without hyphen when used adverbially). LanguageTool fires `AUTO_NO_SEPARADO` 5×. |
| 6 | **H** | `s25-streamlit-dashboards.ts:156` (theory T2-B.p[0]) | `paragraphs` | `**cache** por hash de \`input+model\` evita re-facturar el mismo ticket.` | Spanish RAE: `refacturar` is a single word (prefix `re-` + `facturar`). LanguageTool fires `NO_SEPARADO` 1× and `FALTA_ELEMENTO_ENTRE_VERBOS` 1× (the latter is a stylistic suggestion: "evita volver a facturar" / "evita que se vuelva a facturar"). |
| 7 | **M** | `s25-streamlit-dashboards.ts:367` | `iDo.intro` | `Te muestro el AI assist de CP-N2-C como lo armaría un analista del desk Lima: primero el árbol de stack, luego model card y hosting, mock HF con contrato estable, cache + circuit breaker, JSON con schema, tools con stop en denegación, golden con field F1 y request segura.` (40 words in one sentence, 9 enumerated items separated by commas) | Cognitive overload: a single sentence previews all 8 demos. Should be restructured as a numbered list mirroring the 8 demos. The scanner reports `run_on` (50w for the full intro because sentence-splitter failed on `**` markdown — actually 2 sentences: 40w + 10w). |
| 8 | **M** | `s25-streamlit-dashboards.ts:1652, 1666, 1673` | `selfCheck.questions[1,3,4].question` | `Una salida del generador sin JSON válido (schema_fail) debe…` / `El AI assist de este curso puede etiquetar fraude de forma autónoma…` / `Tras N timeouts seguidos al endpoint del assist, la ops correcta es…` | These questions end with an ellipsis "…" instead of a proper Spanish question mark. Q1, Q3 use proper `¿…?` form; Q2, Q4, Q5 do not. This is inconsistent within the same `selfCheck` block. Pedagogical impact: breaks the rhythm of the auto-check, suggests fill-in-the-blank rather than comprehension. |
| 9 | **M** | `s25-streamlit-dashboards.ts:1677` | `selfCheck.questions[4].explanation` | `El circuit breaker (contador de fallas + open) evita cascadas de costo/latencia; el fallback no inventa éxito ni saltarse eval.` | "saltarse eval" is grammatically wrong: "saltarse" is pronominal and requires an object pronoun ("saltarse la eval"), and even then it is colloquial. Should be "saltar la eval" or "evitar la eval" or "omitir la eval". Also "eval" without article is an English calque; better "la evaluación" or "el golden set". |
| 10 | **M** | `s25-streamlit-dashboards.ts:1673` | `selfCheck.questions[4].question` | `Tras N timeouts seguidos al endpoint del assist, la ops correcta es…` | "la ops correcta" mixes feminine "la" with English plural-sounding abbreviation "ops" (operations). Should be "la operación correcta" or "el procedimiento operativo correcto" or "el siguiente paso correcto". Also "ops" appears as a noun again in `paragraphs` lines 158 and 213 ("la ops de inferencia", "la ops de cache/costo") — same issue, systemic. |
| 11 | **M** | `s25-streamlit-dashboards.ts:367, 400, 1638, 81` | `iDo.intro`, `iDo.steps[1].description`, `youDo.rubric[4].criterion`, `paragraphs` (T1-B.p[2]) | `model card y hosting` / `Política de hosting` / `metadata de stack/deploy` / `la decisión se audita` (vs. learningOutcomes: "decidir **despliegue** local o cloud" line 18, theory T1-B.p[1] `**Local** (o VPC privada)` ) | Inconsistent anglicism handling: the Spanish "despliegue" is used in learningOutcomes and theory T1-B.p[1], but the English "hosting" / "deploy" is used in iDo.intro, iDo.steps[1].description, youDo.rubric[4].criterion. Pick one ("despliegue" is preferred) and apply consistently. |
| 12 | **M** | `s25-streamlit-dashboards.ts:1659` | `selfCheck.questions[2].question` | `¿Cómo se mitiga prompt injection desde un PDF OCR?` | "PDF OCR" reads awkwardly — the PDF wasn't OCR'd, the PDF was processed by OCR. Better: "¿Cómo se mitiga prompt injection desde un documento procesado con OCR?" or "¿Cómo se mitiga prompt injection desde un PDF extraído con OCR?". |
| 13 | **M** | `s25-streamlit-dashboards.ts:367` (intro 40w), 30 (T1-A.p[2] tree map 38w), 79 (T1-B.p[0] 39w), 212 (T3-A.p[1] 37w), 285 (T4-A.p[0] 36w), 1551 (youDo.context 38w), 596 (S25-T1-A-E1 instruction 34w), 807 (S25-T1-B-E3 instruction 41w), 855 (S25-T2-A-E1 instruction 35w), 922 (S25-T2-A-E3 instruction 36w), 1378 (S25-T4-A-E3 instruction 40w) | `iDo.intro`, `paragraphs`, `weDo.steps[*].instruction`, `youDo.context` | (11 long sentences >32 w) | Most are pedagogically justified (tree maps, metric definitions, contract statements), but the iDo.intro and youDo.context are enumerations that should be converted to numbered/bulleted lists. The We Do instructions are long because they combine problem statement + starter-code bug + output spec in one paragraph — splitting the spec from the problem statement would help. |
| 14 | **M** | `s25-streamlit-dashboards.ts:30` (theory[0].paragraphs[0]) | `paragraphs` | The "61-w run-on" reported by the scanner is a **false positive** caused by the sentence splitter failing on `**Modelos especializados**` (the `*` is the first character, so the splitter's lookahead `[A-ZÁÉÍÓÚÑ¿¡«]` doesn't fire). The paragraph is actually 3 well-formed sentences (30 + 19 + 15 w). No fix needed; document the splitter limitation. |
| 15 | **L** | `s25-streamlit-dashboards.ts:15, 121, 158, 285, 319, 327, 1551, 1571` (and many more) | `jobRelevance`, `paragraphs`, `youDo.context`, `selfCheck.options` | `fail-closed`, `HITL`, `baseline`, `golden set`, `allowlist`, `contract test`, `fail=True` (as inline `code`), `schema_fail`, `human_review` | Many English tech terms used without Spanish gloss on first use. Some are unavoidable Python/ML jargon (cache, batch, schema, JSON, LLM, OCR, endpoint, fallback) but several have well-established Spanish equivalents or should be glossed once: `HITL (human-in-the-loop, revisión humana en el bucle)`, `fail-closed (cierre por fallo)`, `baseline (línea base)`, `golden set (conjunto dorado de referencia)`, `allowlist (lista de permitidos)`. The section glosses `thinking (razonamiento extendido)` and `tools (function calling)` correctly on line 246 — same pattern should be applied to HITL/baseline/golden/allowlist on first occurrence. |
| 16 | **L** | `s25-streamlit-dashboards.ts:212, 213` | `paragraphs` (T3-A.p[1], T3-A.p[2]) | `la generación con schema (**constrained decoding** / structured outputs del proveedor) reduce ambigüedad frente al free-text` | Anglicisms "constrained decoding", "structured outputs", "free-text" used without Spanish gloss. The first two are HF/OpenAI product names (acceptable as `code` or italics) but "free-text" → "texto libre" is a clean Spanish equivalent already used elsewhere ("narrativa libre" line 211). |
| 17 | **L** | `s25-streamlit-dashboards.ts:42, 76, 117, 153, 208, 243, 282, 323` | `theory[*].heading` | `S25-T1-A · Elegir regla, modelo especializado o LLM con justificación` / `S25-T1-B · Model cards, licencias y decisión local o cloud` / `S25-T2-A · Pipelines y endpoints de Hugging Face con contrato mock` / `S25-T2-B · Batching, timeout, cache, costo, fallback y circuit breaker` | The heading style mixes an internal subtopic-ID prefix (`S25-T1-A ·`) that is developer taxonomy, with a learner-facing sentence. S10 audit flagged the same `CASO-LIM-XXX` + `SNN-TN-X` pattern as a meta-leak class. The prefix does not help the learner; it leaks the internal taxonomy into the visible heading. Either suppress the prefix in the rendered UI or move it to a `data-testid` / ARIA attribute. (Same pattern observed in S10 and S11 — likely systemic.) |
| 18 | **L** | `s25-streamlit-dashboards.ts:30, 32, 158, 213, 327` | `paragraphs` | `En S24 extrajiste…` / `En S26 el VP orquestará Excel→…→modelo/IA→informe→correo` / `la ops de inferencia y el diseño del prompt se planifican juntos` / `diseña el schema junto con la ops de cache/costo de T2-B` | Bare internal section/topic IDs (`S24`, `S26`, `T2-B`, `T3`) appear in learner-facing prose. S08 audit flagged the same `bare-S0X` pattern. While these provide connective tissue, they read as internal roadmap coordinates; softer references ("la sección anterior de OCR", "la sección siguiente de orquestación") would be more learner-friendly. (Borderline — pedagogically defensible if the course teaches learners to navigate by section number.) |
| 19 | **L** | `s25-streamlit-dashboards.ts:222–227, 488, 491, 1090, 1126, 1163, 1173` | `theory[5].code.code` (prompt_struct.py), `iDo.steps[4].code`, `weDo.steps[10..12].solutionCode` | `JSON con keys hallazgo, n, mediana, limite.` / `return {"hallazgo": hallazgo, "n": n, "mediana": mediana, "limite": limite}` / `REQUIRED = {"hallazgo", "n", "mediana", "limite"}` | The JSON key `limite` is intentionally unaccented (it is a code identifier, not prose). However, several We Do instructions (e.g., line 1075: "El modelo devuelve el string crudo `raw` con hallazgo/n/mediana/limite") use `limite` outside backticks. In Spanish prose, "límite" (with accent) is correct. The 3 LanguageTool `DIACRITICS_04` matches on "limite" are mostly inside code/backticks (false positives) but should be checked case-by-case in prose. |
| 20 | **L** | `s25-streamlit-dashboards.ts:1659` (Q3 stem) | `selfCheck.questions[2]` | `¿Cómo se mitiga prompt injection desde un PDF OCR?` | "PDF OCR" is a noun-adjacent construction that doesn't exist in Spanish; "PDF procesado con OCR" or "documento extraído con OCR" is correct. |
| 21 | **L** | `s25-streamlit-dashboards.ts:807` (S25-T1-B-E3 instruction) | `weDo.steps[4].instruction` | `A partir de la model card (licencia apache-2.0, not_for con fraud adjudication), implementa \`card_gate(card)\` que devuelva un dict con \`reuse_ok\` (licencia en {mit, apache-2.0}) y \`blocks_fraud\` (membership de 'fraud adjudication' en not_for).` (41 w) | Long sentence mixing 4 code identifiers in backticks with prose. The instruction is correct and pedagogically clear, but could be split into: (a) context sentence ("Dada una model card apache-2.0 con not_for=[fraud adjudication]…"), (b) the implementation request ("implementa `card_gate(card)` que devuelva…"), (c) the spec for the two keys. |
| 22 | **L** | `s25-streamlit-dashboards.ts:1596` (youDo.starterCode comment line) | `youDo.starterCode` | `# 6) README es-PE: límites del fixture, baseline y por qué score ≠ fraude` | `≠` is a Unicode mathematical operator. While correct, in monospace code comments it may render inconsistently; "no es" or "!=" would be safer in a Python comment. (Borderline; the rest of the section uses `≠` in prose on lines 38, 328, 1670.) |
| 23 | **L** | `s25-streamlit-dashboards.ts:1646` (Q1 option[3]) | `selfCheck.questions[0].options[3]` | `Solo cuando el endpoint cloud esté más barato` | "endpoint cloud" mixes English "endpoint" + English "cloud" without gloss; Spanish-Peruvian would prefer "endpoint en la nube" or "servicio en la nube". Same issue on multiple options. |
| 24 | **L** | `s25-streamlit-dashboards.ts:2128` (SectionView.tsx, NOT in s25 file) | `demos['streamlit-dashboards'].title` | `Practica estado y caching (simulado)` | The demo title is missing Spanish accents: "Simulacion" (line 2129) and "despues" (line 2201) and "cuantos" (line 2125 hint) all lack accents in the source. (See issue #2 above — once this demo is removed/replaced, these defects disappear.) |
| 25 | **L** | `s25-streamlit-dashboards.ts:156` (T2-B.p[0]) | `paragraphs` | `**Batch** reduce overhead de red; **timeout** evita colgar el flow del VP; **cache** por hash de \`input+model\` evita re-facturar el mismo ticket.` | "overhead de red" / "flow del VP" are anglicisms ("overhead" → "sobrecarga"; "flow" → "flujo"). Three short clauses separated by `;` is good rhythm; just localize the nouns. |

---

## 4. Meta-Leak Report

### 4.1 CRITICAL — Structural slug leak (issue #1)
**Leaked text:** `streamlit-dashboards` (the section id)
**Where it surfaces to learners:**
- Live URL hash: `https://pillb.github.io/pyarcana/#streamlit-dashboards`
- `prisma/seed.ts` line 7370 comment: `// === Section 25: HF/prompting evaluado V3 (platform id streamlit-dashboards) ===` (dev-facing, but visible in the repo)
- `scripts/generate_sections.py` line 16: `25: 'streamlit-dashboards',` (dev-facing mapping)
- `course-state/curriculum_hardening/visible_paragraphs/s25_streamlit-dashboards.json` (dev-facing snapshot)
- Multiple `course-state/curriculum_hardening/audits/...` files (dev-facing)

**Why it is a leak:** The course has been rescoped from "Streamlit dashboards" to "AI endpoints, Hugging Face y prompting evaluado" (the V3 retarget declared in `seed.ts` line 7370 comment). The file name and the `id` slug were not updated. The live URL — visible in the browser address bar, in shared links, in browser history — advertises a different course than the one the learner is reading.

**Severity justification:** Same systemic pattern as S05 (`id:"oop"` on a Functions section), S06 (`id:"numpy"` on a NumPy-forbidden section), S07 (`id:"data-acquisition"` on a Unicode+regex section), S08 (`id:"pandas"` on a CSV/JSON section), S10 (`id:"sklearn"` on a packaging/CLI section), S11 (`id:"testing"` on an OOP section), S12 (`id:"performance"` on an APIs/SQL/Geo section). The pattern is systemic across Phase 0/1.

### 4.2 CRITICAL — Off-topic interactive demo (issue #2)
**Leaked text (rendered live on the Theory tab):**
```
Practica estado y caching (simulado)

# Simulacion de Streamlit: estado y caching
# Sin Streamlit real - simulamos los conceptos

class StreamlitSimulator:
    """Simula el comportamiento de Streamlit."""
    def __init__(self):
        self.session_state = {}
        self.cache = {}
    …
    def cache_data(self, func):
        """Simula @st.cache_data."""
        …

st = StreamlitSimulator()

@st.cache_data
def cargar_datos(n):
    """Simula carga costosa de datos."""
    …

# Session state
print("\\n=== Session State ===")
contador = st.session("clicks", 0)
…
```
**Source location:** `src/components/course/SectionView.tsx` lines 2127–2203, the `'streamlit-dashboards'` entry in the `demos` map.
**Why it is a leak:** This interactive playground teaches `st.session_state`, `@st.cache_data`, "Primera llamada (cache miss)", "Session State" — pure Streamlit concepts. Section 25's content covers AI stack selection, HF pipelines, prompting, golden eval, injection — not Streamlit. A learner reaching the bottom of the Theory tab and clicking "Run" on the StreamlitSimulator will be confused: nothing in the theory prepared them for `st.session_state`, and nothing in the demo connects to the section's contract (`{model, label, score}`, `schema_fail`, `human_review`, `field F1`).
**Identical defect class:** S06 had `demos['numpy']` rendering a `import numpy as np` editor on a section whose callout explicitly says "Si tu solución de S06 importa numpy o pandas, está fuera de alcance." Section 25's defect is the same shape: a legacy demo key from the previous curriculum that nobody pruned when the section was rescoped to V3.

### 4.3 Developer / authoring meta-text
**No prose meta-leaks found.** Scanner found one `meta_leak` flag on line 246 paragraph (`Modos de **thinking** (razonamiento extendido) y **tools** (function calling) aumentan costo, latencia y superficie de ataque. No los actives por moda: cada tool es un privilegio (lectura de red, FS, shell). El AI assist sigue siendo borrador con aprobación humana.`) — but this is a **false positive**: the regex matched the legitimate Spanish word "borrador" (draft) in the sentence "El AI assist sigue siendo borrador con aprobación humana" (the AI assist remains a draft, with human approval). The `META_LEAK_RE` pattern's `borrador` token was intended to catch authoring markers like "borrador — limpiar después" but here it is a legitimate use. **No real meta-leak in this paragraph.**

No `TODO` / `FIXME` / `XXX` / `WIP` / `TBD` / `moved from section` / `pendiente` / `revisar` tokens were found in learner-facing prose. (Internal `# Bug:` comments inside `starterCode` blocks are intentional pedagogical scaffolding — they tell the learner what the defective starter is doing wrong — and are explicitly out-of-scope per the grammar subplan.)

### 4.4 Stale `visible_paragraphs/s25_streamlit-dashboards.json` snapshot (informational)
A pre-hardening snapshot file at `course-state/curriculum_hardening/visible_paragraphs/s25_streamlit-dashboards.json` exists in the repo (dev-facing, not shipped to the live site). It may contain pre-V3 paragraph text. **No learner impact**, but should be pruned or renamed when the section id is renamed.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity (Pedagogy & Learning Science Auditor)
**Verdict: 9 / 10 — gold-standard fidelity, identical structural pattern to S11.**

- **I Do (8 demos, lines 366–587):** One demo per subtopic (T1-A through T4-B). Each demo has `demoId`, `subtopicId`, `environment`, `description`, `code` (with `language`, `title`, `code`, `output`), and `why`. The 8 demos mirror the 8 theory code blocks but with simpler, runnable variants. The `why` field is one sentence explaining the professional motivation. **Excellent.**
- **We Do (24 exercises, lines 588–1547):** 3 exercises per subtopic (E1 `guided`, E2 `independent`, E3 `transfer`). Each exercise has `id`, `subtopicId`, `kind`, `instruction`, `hint`, `hints[]` (2 progressive hints), `edgeCases[]`, `tests`, `feedback`, `starterCode`, `solutionCode` (with `output`). Every starter has an intentional DEFECT pattern (inverted logic, missing key, wrong threshold, hardcoded return). The 3-layer progression (guided → independent → transfer) is uniform across all 8 subtopics. **Excellent.**
- **You Do (1 capstone, lines 1548–1641):** Title, context, 4 objectives, 4 requirements, `starterCode` skeleton with 6 numbered steps, `portfolioNote`, 6-criterion weighted rubric (25% + 20% + 20% + 15% + 10% + 10% = 100%). Bound to gate CP-N2-C with explicit ethical requirements ("Sin PII real", "Schema fail o injection_signal → human_review", "Baseline comparado", "español profesional es-PE"). **Excellent.**
- **Autocheck (5 MCQs, lines 1642–1680):** 5 questions covering stack selection (Q1), schema_fail policy (Q2), injection mitigation (Q3), no-auto-fraud policy (Q4), circuit breaker (Q5). Each question has 4 options, `correctIndex`, and a 1-sentence `explanation`. **Good** — but see issues #8, #9, #10, #12, #20 for stem-quality problems.

### 5.2 Cognitive load & progressive disclosure
- **Strong:** T1 → T2 → T3 → T4 progression is logical (decision → inference → prompting → eval/security). Each subtopic reuses the same fixture `CASO-LIM-025` and the same contract `{model, label, score}` / `SCHEMA_KEYS`.
- **Strong:** Schema-first gating is reinforced in every tab: theory T3-A callout "Schema first", theory T4-A callout "no se acepta salida sin evidencia ni eval vs baseline", We Do T3-A-E3 (schema_fail → ok gate), We Do T4-A-E3 (promote gate), You Do rubric criterion 1 (25% weight on contract).
- **Strong:** Ethical spine uniform: "score ≠ fraude", "auto_fraud_label=False", "fail-closed to human_review", "el humano aprueba" appear in every subtopic.
- **Overload points:** (1) `iDo.intro` (40-w sentence previewing all 8 demos in one breath — issue #7); (2) `youDo.context` (38-w sentence with 4 enumerated items — issue #13); (3) `theory[0].paragraphs[1]` (38-w "Mapa de la sección" sentence with 4 `→` arrows — borderline, justified by map structure).

### 5.3 Connective tissue & narrative flow
- **Backward:** S24 (OCR / Document AI as untrusted context) — referenced on lines 15, 30, 326, 1551. Strong.
- **Forward:** S26 (Excel→…→modelo/IA→informe→correo orchestration) — referenced on lines 32, 1632. Strong.
- **Cross-phase:** CP-N2-C gate referenced 12+ times (lines 8, 15, 30, 32, 319, 367, 1549, 1551, 1632, 1636).
- **Internal:** subtopic cross-references (T1-A → T4 in line 47; T2-A → T2-B in line 122; T3-A → T3-B in line 213; T3 → T2-B in line 213) create a tight graph.

### 5.4 Consistency with roadmap and previous sections
- The master roadmap `el_arte_de_python_roadmap_maestro_52_secciones.md` originally described Phase 1 / Section 25 as Streamlit dashboards (per the slug). The V3 retarget to "AI endpoints, Hugging Face y prompting evaluado" is openly declared in `seed.ts` line 7370 comment and reflected in the section content — but not in the slug, file name, or interactive demo. **Inconsistent.**
- Compared to S24 (OCR / Document AI): S25 explicitly consumes the S24 OCR output as `untrusted_document` (lines 15, 30, 326, 1551) and reuses the same ethical stance (no auto-fraud, fail-closed). **Consistent.**
- Compared to S26 (Integrator Phase 1): S25 explicitly hands off the contract to S26 (lines 32, 1632: "listo para orquestación en S26"). **Consistent.**

### 5.5 Comparison with best-in-class external materials
| External reference | What it does well | What S25 does compared |
|---|---|---|
| OWASP LLM Top 10 (LLM01-10) | Authoritative taxonomy of LLM risks (prompt injection, sensitive info disclosure, excessive agency) | S25 maps to LLM01 (injection) on line 326, LLM06 (sensitive info) on line 327, LLM08 (excessive agency) on line 246-248. The mapping is implicit — citing OWASP LLM01/06/08 in the callout would strengthen the section. Resources list links to OWASP (line 1699, 1704) which is correct. |
| Mitchell et al. 2019 — Model Cards for Model Reporting | Intended use, limitations, bias, training data | S25 T1-B (lines 76–115) covers model card reading (intended use, not_for, license, hosting decision) and cites Mitchell in resources (line 1721). **Strong alignment.** |
| Hugging Face Pipeline tutorial + Inference Endpoints | `transformers.pipeline` API, batched inference, endpoint hosting | S25 T2-A (lines 117–151) mocks the pipeline with a keyword rule but documents the real prod form. **Strong alignment** — the mock is honest about being a mock. |
| OpenAI Structured Outputs guide | Schema-constrained generation | S25 T3-A (lines 208–241) covers schema JSON + `json.loads` validation + the "constrained decoding" / structured outputs concept, and explicitly warns: "no confíes solo en que el modelo 'respetó' el schema" (line 212). **Strong alignment.** |
| Chip Huyen — AI Engineering | Structured output, evals, serving | S25 cites Chip Huyen in resources (line 1726). The eval pattern (exact match, schema rate, field F1) aligns with Huyen's eval framework. **Strong alignment.** |
| Percival & Gregory — Architecture Patterns with Python | Circuit breaker, fallback, fail-closed | S25 T2-B (lines 153–206) implements a simple circuit breaker with `failures` counter and `OPEN_AFTER` threshold. **Strong alignment** with the circuit breaker pattern. |

### 5.6 Exercise & exam quality
- **Starter/solution/output integrity:** Verified all 24 We Do exercises have aligned `starterCode` (with intentional bug) → `solutionCode` → `output`. Spot-checked 6 exercises (S25-T1-A-E1, S25-T2-A-E3, S25-T2-B-E1, S25-T3-A-E3, S25-T3-B-E3, S25-T4-A-E2): all three pieces are consistent. The DEFECT comment in each starter correctly describes the bug.
- **Hint quality:** Each exercise has 1 `hint` (high-level) + 2 `hints` (progressive code-level). Excellent scaffolding.
- **Edge cases:** `edgeCases` arrays on all 24 exercises (range 1–3 items each). Examples: "solo un flag True no basta", "metadata del run debe registrar el stack", "licencia permisiva no anula not_for". Excellent.
- **Feedback:** Each exercise has a 1-sentence `feedback` explaining what the learner likely did wrong. Examples: "Si imprimiste llm_structured, la rama determinista no se evaluó antes del fallback." (line 604). Excellent — actionable, specific.
- **Tests:** All 24 exercises use `tests: "salida coincide con solution output"` — uniform. **Note:** This is a literal string, not a test harness. The actual grader is elsewhere (probably `course-state/` or `prisma/seed.ts`).
- **Self-check:** 5 MCQs with `correctIndex` and `explanation`. **Issues:** see #8, #9, #10, #12, #20 above. The explanations are concise (1 sentence each) and accurate.

### 5.7 You Do capstone quality
- **Objectives:** 4 objectives map 1:1 to the 4 subtopic groups (decision/inference/eval/security). Excellent.
- **Requirements:** 4 requirements are explicit and ethical ("Sin PII real", "Schema fail o injection_signal → human_review", "Baseline comparado", "español profesional es-PE"). Excellent.
- **StarterCode:** 6 numbered steps inside the skeleton — each step references a specific theory subtopic. Good progressive disclosure.
- **Rubric:** 6 criteria, weighted 25% + 20% + 20% + 15% + 10% + 10% = 100%. Maps to the objectives. **Issue #11:** criterion 5 uses "deploy" (English) — should be "despliegue".
- **PortfolioNote:** 1 sentence: "Componente AI assist de CP-N2-C con eval (exact/schema/F1) y controles de seguridad; listo para orquestación en S26." Clear and accurate.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewriting Report

> Method note: For each learner-facing paragraph and tab intro, before/after rewrites are provided. Code blocks, `starterCode`/`solutionCode` bodies, and `output` strings are excluded (per grammar subplan). Self-check option strings are listed but not all rewritten (only those with real issues).

### 6.1 Theory tab — `theory[0]` (heading "IA asistida evaluada para CP-N2-C")

**Paragraph 1 (line 30):**
> **Before:**
> En S24 extrajiste campos de documentos (OCR / Document AI) con evidencia y abstención. El VP de riesgos del desk sintético Lima no puede "pegar" ese texto crudo a un chatbot y confiar: esos campos entran aquí como **contexto no confiable**. Decides el stack (regla, modelo especializado o LLM), llamas un adapter HTTP o Hugging Face con **contrato único**, y solo publicas JSON anclado a evidencia tras schema + eval. El AI assist de CP-N2-C produce **borradores**; el humano aprueba antes del informe o correo — nunca auto-envío ni auto-etiqueta de fraude.

> **After:**
> En S24 extrajiste campos de documentos (OCR / Document AI) con evidencia y abstención. La VP de riesgos del desk sintético Lima no puede "pegar" ese texto crudo a un chatbot y confiar: esos campos entran aquí como **contexto no confiable**. Decides el stack (regla, modelo especializado o LLM), llamas un adapter HTTP o de Hugging Face con **contrato único**, y solo publicas JSON anclado a evidencia tras schema + eval. El asistente de IA de CP-N2-C produce **borradores**; el humano aprueba antes del informe o correo — nunca autoenvío ni autoetiqueta de fraude.

**Changes:** `El VP` → `La VP` (Vicepresidencia is feminine; if "VP" is meant as masculine "Vicepresidente", keep `El VP` — but verify which); `adapter HTTP o Hugging Face` → `adapter HTTP o de Hugging Face` (parallelism); `El AI assist` → `El asistente de IA` (issue #3); `auto-envío` → `autoenvío` (issue #5); `auto-etiqueta` → `autoetiqueta` (issue #5).

> **Note on "VP":** Throughout the section, "el VP" is used 4× (lines 30, 156, 158, 211). If "VP" = "Vicepresidente" → masculine "el VP" is correct. If "VP" = "Vicepresidencia" → feminine "la VP". The course should pick one and apply consistently. (Not changing in the rewrite above without confirmation — flagged for the Fixer.)

**Paragraph 2 (line 31):**
> **Before:**
> Mapa de la sección: **T1 Selección** (qué stack y con qué gobernanza) → **T2 Inferencia** (adapter, batch, cache, costo, fallback y circuit breaker) → **T3 Prompting** (estructura, schema y tools controlados) → **T4 Evals y seguridad** (golden, field F1, injection, minimización). Fixture de lab: `CASO-LIM-025` (run_id=`cpn2c-ai`), datos sintéticos sin PII real. Cada subtema aporta un mecanismo nuevo; la ética de sección vive en el callout global (no se reimprime en cada párrafo).

> **After:**
> Mapa de la sección: **T1 Selección** (qué stack y con qué gobernanza) → **T2 Inferencia** (adapter, batch, cache, costo, fallback y circuit breaker) → **T3 Prompting** (estructura, schema y tools controlados) → **T4 Evals y seguridad** (golden, field F1, injection, minimización). Fixture de lab: `CASO-LIM-025` (run_id=`cpn2c-ai`), datos sintéticos sin PII real. Cada subtema aporta un mecanismo nuevo; la ética de la sección vive en el callout global (no se reimprime en cada párrafo).

**Changes:** `la ética de sección` → `la ética de la sección` (missing article; "de sección" reads as a noun-adjunct construction that should be "de la sección").

**Paragraph 3 (line 32):**
> **Before:**
> Promoción del assist: sin evidencia, sin schema válido o sin métricas vs baseline, la salida se descarta o va a `human_review` (fail-closed). El score del modelo es señal de prioridad, no veredicto legal ni de parentesco. En S26 el VP orquestará Excel→…→modelo/IA→informe→correo usando este mismo contrato.

> **After:**
> Promoción del asistente: sin evidencia, sin schema válido o sin métricas vs. baseline, la salida se descarta o va a `human_review` (cierre por fallo, *fail-closed*). El score del modelo es señal de prioridad, no veredicto legal ni de parentesco. En S26 la VP orquestará Excel→…→modelo/IA→informe→correo usando este mismo contrato.

**Changes:** `Promoción del assist` → `Promoción del asistente` (issue #3 — anglicism); `vs baseline` → `vs. baseline` (issue #4); `(fail-closed)` → `(cierre por fallo, *fail-closed*)` (issue #15 — gloss on first use); `En S26 el VP orquestará` → `En S26 la VP orquestará` (or keep `el VP` if Vicepresidente — flagged above).

**Callout content (line 38):**
> **Before:**
> Sin PII real a endpoints públicos. `schema_fail` o indicios de injection → `human_review`. Score ≠ fraude. Fixture `CASO-LIM-025`. Mismo contract test para mock HTTP y mock HF.

> **After:**
> Sin PII real a endpoints públicos. `schema_fail` o indicios de injection → `human_review`. Score ≠ fraude. Fixture `CASO-LIM-025`. Mismo *contract test* (prueba de contrato) para mock HTTP y mock HF.

**Changes:** Added Spanish gloss for "contract test" on first use (issue #15).

### 6.2 Theory tab — `theory[1]` (heading "S25-T1-A · Elegir regla, modelo especializado o LLM con justificación")

**Paragraph 1 (line 45) — 3 sentences, scanner false-positive run-on:**
> **Before:**
> **Reglas** (regex, umbrales, tablas) son baratas, deterministas y fáciles de auditar: úsalas cuando el patrón es conocido y la salida debe ser reproducible al bit. **Modelos especializados** (clasificador fine-tuned, extractor de campos) encajan cuando el conjunto de etiquetas es estable y tienes volumen de entrenamiento. **LLM** aporta lenguaje y extracción flexible, pero solo con **schema JSON**, validación y revisión humana.

> **After:**
> **Reglas** (regex, umbrales, tablas) son baratas, deterministas y fáciles de auditar: úsalas cuando el patrón es conocido y la salida debe ser reproducible al bit. **Modelos especializados** (clasificador *fine-tuned*, extractor de campos) encajan cuando el conjunto de etiquetas es estable y tienes volumen de entrenamiento. **LLM** aporta lenguaje y extracción flexible, pero solo con **schema JSON**, validación y revisión humana.

**Changes:** `fine-tuned` → `*fine-tuned*` (italics for English term; rest of section uses italics for English terms like `*intended use*`, `*not_for*`). No structural changes — the 3 sentences are well-formed; the scanner's "61-w run-on" was a false positive due to `**` markdown breaking the sentence splitter (issue #14).

**Paragraph 2 (line 46) — tree map, 38w in 5 sentences:**
> **Before:**
> Árbol operativo: ¿tarea determinista y patrones conocidos? → `rules`. ¿label set fijo y ≥500 ejemplos de train? → `specialized_model`. ¿necesitas lenguaje abierto y tienes validador de schema? → `llm_structured`. Si no cumples ninguna rama con control → `human`. Documenta la decisión en metadata del run (stack, razón, model_id).

> **After:**
> Árbol operativo: ¿tarea determinista y patrones conocidos? → `rules`. ¿Conjunto de etiquetas fijo y ≥500 ejemplos de entrenamiento? → `specialized_model`. ¿Necesitas lenguaje abierto y tienes validador de schema? → `llm_structured`. Si no cumples ninguna rama con control → `human`. Documenta la decisión en la metadata del run (stack, razón, `model_id`).

**Changes:** `label set` → `Conjunto de etiquetas` (Spanish); `de train` → `de entrenamiento` (Spanish); `necesitas` (lowercase after `?`) → `Necesitas` (capital — issue: language-aware sentence splitter flagged UPPERCASE_SENTENCE_START on these, but the right fix is to capitalize the first letter after `? `); `model_id` → `` `model_id` `` (backticks for code identifier — line 46 already has `rules`, `specialized_model`, etc. in backticks but `model_id` is bare).

**Paragraph 3 (line 47):**
> **Before:**
> En el desk sintético Lima, clasificar "posible fraude" con un LLM autónomo está **prohibido** en este curso: el modelo emite señales y evidencia; el analista decide. La justificación del stack se revisa junto con el golden set en T4.

> **After:**
> En el desk sintético de Lima, clasificar "posible fraude" con un LLM autónomo está **prohibido** en este curso: el modelo emite señales y evidencia; el analista decide. La justificación del stack se revisa junto con el *golden set* (conjunto dorado de referencia) en T4.

**Changes:** `desk sintético Lima` → `desk sintético de Lima` (missing `de` — reads as "Lima synthetic desk" English-style noun adjunct); `golden set` → `*golden set* (conjunto dorado de referencia)` (issue #15 — gloss on first use).

### 6.3 Theory tab — `theory[2]` (heading "S25-T1-B · Model cards, licencias y decisión local o cloud")

**Paragraph 1 (line 79) — 39w in 2 sentences:**
> **Before:**
> Antes de desplegar, lee la **model card**: uso previsto (*intended use*), limitaciones, sesgos y datos de entrenamiento. Revisa la **licencia** (MIT/Apache suelen permitir reuso comercial; otras piden revisión legal). *not_for* en la card no es decoración: si lista adjudicación de fraude o biometría, ese uso queda bloqueado en tu política aunque la licencia sea permisiva.

> **After:**
> Antes de desplegar, lee la **model card** (tarjeta de modelo): uso previsto (*intended use*), limitaciones, sesgos y datos de entrenamiento. Revisa la **licencia** (MIT/Apache suelen permitir reuso comercial; otras piden revisión legal). La sección *not_for* de la card no es decoración: si lista adjudicación de fraude o biometría, ese uso queda bloqueado en tu política aunque la licencia sea permisiva.

**Changes:** `model card` → `model card (tarjeta de modelo)` (issue #15 — gloss on first use); `*not_for* en la card` → `La sección *not_for* de la card` (clearer anaphora; `not_for` is a field name, not a noun).

**Paragraph 2 (line 80):**
> **Before:**
> **Local** (o VPC privada) cuando hay PII/sintéticos sensibles, datos de cliente o necesitas costo predecible. **Cloud** solo con DPA, minimización de campos y modelo permitido por licencia e intended use. El **mismo contract test** (schema + golden) debe pasar en ambos despliegues; el adapter no cambia el contrato de salida.

> **After:**
> **Local** (o VPC privada) cuando hay PII/sintéticos sensibles, datos de cliente o necesitas costo predecible. **Cloud** solo con DPA, minimización de campos y modelo permitido por licencia e *intended use*. El **mismo *contract test*** (schema + golden) debe pasar en ambos despliegues; el adapter no cambia el contrato de salida.

**Changes:** `intended use` (bare) → `*intended use*` (italics, matching line 79); `contract test` → `*contract test*` (italics for English term).

**Paragraph 3 (line 81):**
> **Before:**
> Registra en metadata del run: `deploy_choice`, licencia, hash o versión de la model card y `model_id`. En el lab, el desk Lima mockea HF o endpoint local; la decisión se audita junto con el golden, sin auto-veredicto.

> **After:**
> Registra en la metadata del run: `deploy_choice`, licencia, hash o versión de la model card y `model_id`. En el lab, el desk Lima mockea HF o un endpoint local; la decisión se audita junto con el golden, sin auto-veredicto.

**Changes:** `metadata del run` → `la metadata del run` (article); `o endpoint local` → `o un endpoint local` (article).

### 6.4 Theory tab — `theory[3]` (heading "S25-T2-A · Pipelines y endpoints de Hugging Face con contrato mock")

**Paragraph 1 (line 120) — 36w in 3 sentences:**
> **Before:**
> En producción la forma típica es `from transformers import pipeline` → `clf = pipeline('text-classification', model=model_id)` → `clf(texts)` devuelve lista de `{label, score}`. Un Inference Endpoint HTTP es el **mismo contrato de salida** que tu adapter local. En el curso **mockeamos** el pipeline para correr sin bajar pesos: el mock devuelve `{model, label, score}` (añadimos `model` nosotros) idéntico al adapter real para que los contract tests no mientan. La clave del artefacto en el contrato del lab es **`model`**; no inventes un segundo nombre en el grader.

> **After:**
> En producción la forma típica es `from transformers import pipeline` → `clf = pipeline('text-classification', model=model_id)` → `clf(texts)` devuelve una lista de `{label, score}`. Un Inference Endpoint HTTP tiene el **mismo contrato de salida** que tu adapter local. En el curso **mockeamos** el pipeline para correr sin bajar pesos: el mock devuelve `{model, label, score}` (añadimos `model` nosotros) idéntico al adapter real, para que los *contract tests* no mientan. La clave del artefacto en el contrato del lab es **`model`**; no inventes un segundo nombre en el grader.

**Changes:** `devuelve lista de` → `devuelve una lista de` (article); `es el mismo contrato` → `tiene el mismo contrato` (un HTTP endpoint does not "equal" a contract, it "has" one); `reales para que` → `reales, para que` (comma before subordinate clause); `contract tests` → `*contract tests*` (italics, English term).

**Paragraph 2 (line 121):**
> **Before:**
> Forma estable: input texto (o batch de textos) → lista o dict con `label`, `score` y `model`. Loguea `model` + versión en cada run. Si el payload no valida schema o hay indicios de injection, no "arregles" en silencio: fail-closed a `human_review`. El score **no** es veredicto de fraude.

> **After:**
> Forma estable: input de texto (o *batch* de textos) → lista o dict con `label`, `score` y `model`. Loguea `model` + versión en cada run. Si el payload no valida el schema o hay indicios de injection, no "arregles" en silencio: *fail-closed* (cierre por fallo) a `human_review`. El score **no** es veredicto de fraude.

**Changes:** `input texto` → `input de texto` (parallelism with `batch de textos`); `batch` → `*batch*` (italics); `valida schema` → `valida el schema` (article); `fail-closed a human_review` → `*fail-closed* (cierre por fallo) a human_review` (issue #15 — gloss on first use in this subtopic).

**Paragraph 3 (line 122):**
> **Before:**
> Timeouts, reintentos y costo se resuelven en T2-B. Aquí te enfocas en que mock HF y HTTP local sean intercambiables bajo el mismo test. Desk Lima: mock HF con keyword rule didáctica sobre tickets sintéticos.

> **After:**
> Timeouts, reintentos y costo se resuelven en T2-B. Aquí te enfocas en que el mock de HF y el HTTP local sean intercambiables bajo el mismo test. Desk Lima: mock de HF con *keyword rule* didáctica sobre tickets sintéticos.

**Changes:** `mock HF y HTTP local` → `el mock de HF y el HTTP local` (articles for clarity); `mock HF con keyword rule` → `mock de HF con *keyword rule*` (article + italics).

### 6.5 Theory tab — `theory[4]` (heading "S25-T2-B · Batching, timeout, cache, costo, fallback y circuit breaker")

**Paragraph 1 (line 156) — issue #6 "re-facturar":**
> **Before:**
> **Batch** reduce overhead de red; **timeout** evita colgar el flow del VP; **cache** por hash de `input+model` evita re-facturar el mismo ticket. Estima **costo** (tokens o requests) por run y por día. Si el endpoint cae, el fallback es regla determinista o `human_review` — nunca inventes un JSON de "éxito" falso.

> **After:**
> **Batch** reduce la sobrecarga de red; **timeout** evita colgar el flujo de la VP; **cache** por hash de `input+model` evita refacturar el mismo ticket. Estima el **costo** (tokens o *requests*) por run y por día. Si el endpoint cae, el fallback es regla determinista o `human_review` — nunca inventes un JSON de "éxito" falso.

**Changes:** `overhead` → `la sobrecarga` (issue #25 — anglicism); `flow del VP` → `flujo de la VP` (issue #25 + VP gender); `re-facturar` → `refacturar` (issue #6 — single word per RAE); `requests` → `*requests*` (italics).

**Paragraph 2 (line 157):**
> **Before:**
> **Circuit breaker simple:** tras N fallas consecutivas (p. ej. 3 timeouts), abre el circuito: deja de llamar al endpoint, enruta a fallback y alerta. Un solo `try/except TimeoutError` es el primer ladrillo; el contador de fallas evita martillar un servicio caído.

> **After:**
> **Circuit breaker simple (*corta-circuitos*):** tras N fallas consecutivas (p. ej., 3 timeouts), abre el circuito: deja de llamar al endpoint, enruta a fallback y alerta. Un solo `try/except TimeoutError` es el primer ladrillo; el contador de fallas evita martillar un servicio caído.

**Changes:** `Circuit breaker simple` → `Circuit breaker simple (*corta-circuitos*)` (issue #15 — gloss on first use); `p. ej. 3 timeouts` → `p. ej., 3 timeouts` (comma after abbreviation per RAE).

**Paragraph 3 (line 158) — issue #10 "la ops":**
> **Before:**
> Prompts largos y tools activos (T3) multiplican tokens: la ops de inferencia y el diseño del prompt se planifican juntos. En el lab, si `fail=True` → `fallback rules_or_human`; schema y golden siguen siendo gate de promote.

> **After:**
> Los prompts largos y las tools activas (T3) multiplican tokens: la operación de inferencia y el diseño del prompt se planifican juntos. En el lab, si `fail=True` → `fallback rules_or_human`; el schema y el golden siguen siendo *gate* de *promote*.

**Changes:** `Prompts largos y tools activos` → `Los prompts largos y las tools activas` (articles); `la ops de inferencia` → `la operación de inferencia` (issue #10 — "ops" is English abbreviation); `gate de promote` → `*gate* de *promote*` (italics for English terms).

### 6.6 Theory tab — `theory[5]` (heading "S25-T3-A · Prompt con objetivo, contexto, restricciones, ejemplos y schema")

**Paragraph 1 (line 211):**
> **Before:**
> Un prompt útil tiene cinco piezas: **Objetivo**, **Contexto** (datos sintéticos o campos OCR), **Restricciones** (no inventar, no elevar órdenes del documento), **Ejemplos** few-shot y **Schema JSON** de salida. Sin schema, la narrativa libre no entra al informe del VP. El AI assist solo propone; el humano aprueba antes del correo.

> **After:**
> Un prompt útil tiene cinco piezas: **Objetivo**, **Contexto** (datos sintéticos o campos OCR), **Restricciones** (no inventar, no elevar órdenes del documento), **Ejemplos** *few-shot* y **Schema JSON** de salida. Sin schema, la narrativa libre no entra al informe de la VP. El asistente de IA solo propone; el humano aprueba antes del correo.

**Changes:** `Ejemplos few-shot` → `Ejemplos *few-shot*` (italics); `informe del VP` → `informe de la VP` (or `del VP` if Vicepresidente — flagged); `El AI assist` → `El asistente de IA` (issue #3).

**Paragraph 2 (line 212) — 37w in 2 sentences:**
> **Before:**
> Pide **solo** campos necesarios. Prohíbe inventar números no presentes en el contexto (hallazgo sin `n`/`mediana` → `schema_fail`). Valida con `json.loads` + keys required; si falla, descarta aunque el texto "se vea bien". La generación con schema (**constrained decoding** / structured outputs del proveedor) reduce ambigüedad frente al free-text; aun así el grader del curso exige **validación explícita en código**: no confíes solo en que el modelo "respetó" el schema.

> **After:**
> Pide **solo** los campos necesarios. Prohíbe inventar números no presentes en el contexto (hallazgo sin `n`/`mediana` → `schema_fail`). Valida con `json.loads` + *keys required*; si falla, descarta aunque el texto "se vea bien". La generación con schema (*constrained decoding* / *structured outputs* del proveedor) reduce la ambigüedad frente al texto libre; aun así, el grader del curso exige **validación explícita en código**: no confíes solo en que el modelo "respetó" el schema.

**Changes:** `Pide solo campos necesarios` → `Pide solo los campos necesarios` (article); `keys required` → `*keys required*` (italics); `constrained decoding` / `structured outputs` → italics (issue #16); `free-text` → `texto libre` (issue #16 — Spanish equivalent already used as "narrativa libre" one paragraph above); `aun así el grader` → `aun así, el grader` (comma after transitional phrase).

**Paragraph 3 (line 213):**
> **Before:**
> El documento OCR es contexto, no system prompt. En T4 verás injection: aquí aseguras que el contrato de salida ya esté listo para el golden (exact match y field F1 por campo). Prompts largos y tools (T3-B) multiplican tokens: diseña el schema junto con la ops de cache/costo de T2-B.

> **After:**
> El documento OCR es contexto, no *system prompt*. En T4 verás injection: aquí aseguras que el contrato de salida ya esté listo para el golden (*exact match* y *field F1* por campo). Los prompts largos y las tools (T3-B) multiplican tokens: diseña el schema junto con la operación de cache/costo de T2-B.

**Changes:** `system prompt` → `*system prompt*` (italics); `exact match y field F1` → italics (English terms); `Prompts largos y tools` → `Los prompts largos y las tools` (articles); `la ops de cache/costo` → `la operación de cache/costo` (issue #10).

### 6.7 Theory tab — `theory[6]` (heading "S25-T3-B · Thinking, tools y checkpoints controlados")

**Paragraph 1 (line 246) — false-positive meta-leak on "borrador":**
> **Before:**
> Modos de **thinking** (razonamiento extendido) y **tools** (function calling) aumentan costo, latencia y superficie de ataque. No los actives por moda: cada tool es un privilegio (lectura de red, FS, shell). El AI assist sigue siendo borrador con aprobación humana.

> **After:**
> Los modos de **thinking** (razonamiento extendido) y de **tools** (*function calling*) aumentan el costo, la latencia y la superficie de ataque. No los actives por moda: cada tool es un privilegio (lectura de red, FS, shell). El asistente de IA sigue siendo un borrador con aprobación humana.

**Changes:** `Modos de thinking y tools` → `Los modos de thinking y de tools` (articles); `function calling` → `*function calling*` (italics); `aumentan costo, latencia y superficie de ataque` → `aumentan el costo, la latencia y la superficie de ataque` (articles); `El AI assist sigue siendo borrador` → `El asistente de IA sigue siendo un borrador` (issue #3 + article).

> **Note:** The scanner flagged `meta_leak` here because of the word "borrador" — this is a **false positive**. The sentence means "the AI assist remains a draft, with human approval" (i.e., the AI's output is a draft that requires human sign-off), not an authoring marker. The META_LEAK_RE pattern's `borrador` token was intended to catch authoring markers like "borrador — limpiar después"; this use is legitimate. **No meta-leak in this paragraph.**

**Paragraph 2 (line 247):**
> **Before:**
> Patrón de **checkpoints** auditables: `plan → tool → validar → narrar`. Si un tool no está en allowlist, **stop** (`tool_denied`) — no shell libre en el sandbox del curso. El log del checkpoint es evidencia de qué se intentó y dónde se cortó.

> **After:**
> Patrón de **checkpoints** auditables: `plan → tool → validar → narrar`. Si un tool no está en la *allowlist* (lista de permitidos), **stop** (`tool_denied`) — nada de shell libre en el sandbox del curso. El log del checkpoint es evidencia de qué se intentó y dónde se cortó.

**Changes:** `allowlist` → `*allowlist* (lista de permitidos)` (issue #15 — gloss on first use); `no shell libre` → `nada de shell libre` (clearer Spanish idiom).

**Paragraph 3 (line 248):**
> **Before:**
> Allowlist didáctica: `calc_sum`, `lookup_metric`. Un paso `shell_rm` se deniega y detiene el plan. El banco de examen evalúa este patrón genérico — **thinking / tools / checkpoints con allowlist y stop** — no la superficie de un producto o marca concreta de modelo.

> **After:**
> *Allowlist* didáctica: `calc_sum`, `lookup_metric`. Un paso `shell_rm` se deniega y detiene el plan. El banco de examen evalúa este patrón genérico — **thinking / tools / checkpoints con allowlist y stop** — y no la superficie de un producto o marca concreta de modelo.

**Changes:** `Allowlist didáctica` → `*Allowlist* didáctica` (italics); `no la superficie` → `y no la superficie` (clearer parallelism — "evalúa X y no Y").

### 6.8 Theory tab — `theory[7]` (heading "S25-T4-A · Golden set, schema, field F1 y revisión humana")

**Paragraph 1 (line 285) — 36w in 2 sentences, issue #4 "vs":**
> **Before:**
> Evalúa el asistente contra un **golden set** (input → JSON esperado). Métricas mínimas: **exact match** (pred == gold), **schema rate** (keys required presentes) y **field F1** a nivel de campo: por cada clave, match exacto cuenta 1 (micro/macro simple en el lab: promedio de aciertos por campo). Sin eval vs baseline, el "demo que suena bien" no se promociona.

> **After:**
> Evalúa el asistente contra un **golden set** (conjunto dorado de referencia; input → JSON esperado). Métricas mínimas: **exact match** (*pred == gold*), **schema rate** (*keys required* presentes) y **field F1** a nivel de campo: por cada clave, el match exacto cuenta 1 (micro/macro simple en el lab: promedio de aciertos por campo). Sin eval vs. baseline, el "demo que suena bien" no se promociona.

**Changes:** `golden set` → `golden set (conjunto dorado de referencia; ...)` (issue #15 — gloss on first use); `pred == gold` and `keys required` → italics (English terms); `match exacto` → `el match exacto` (article); `vs baseline` → `vs. baseline` (issue #4).

**Paragraph 2 (line 286):**
> **Before:**
> Salidas borderline o con `schema_fail` → **human review** obligatoria antes del informe. Injection detectada o tools no permitidos → fail-closed a cola HITL. Fixture `CASO-LIM-025` sin PII real.

> **After:**
> Salidas *borderline* o con `schema_fail` → **human review** (revisión humana) obligatoria antes del informe. Injection detectada o tools no permitidos → *fail-closed* (cierre por fallo) a la cola HITL (human-in-the-loop, revisión humana en el bucle). Fixture `CASO-LIM-025` sin PII real.

**Changes:** `borderline` → `*borderline*` (italics); `human review` → `human review (revisión humana)` (gloss); `fail-closed` → `*fail-closed* (cierre por fallo)` (gloss); `cola HITL` → `cola HITL (human-in-the-loop, revisión humana en el bucle)` (issue #15 — gloss on first use).

**Paragraph 3 (line 287):**
> **Before:**
> Baseline profesional: **reglas** o el modelo anterior; el LLM debe ganar en utilidad sin perder anclaje (campos citados, evidence_ids). El score del clasificador no se convierte en label de fraude en el promote.

> **After:**
> *Baseline* profesional: **reglas** o el modelo anterior; el LLM debe ganar en utilidad sin perder anclaje (campos citados, `evidence_ids`). El score del clasificador no se convierte en *label* de fraude en el *promote*.

**Changes:** `Baseline` → `*Baseline*` (italics); `evidence_ids` → `` `evidence_ids` `` (backticks for code identifier); `label` → `*label*` (italics); `promote` → `*promote*` (italics).

### 6.9 Theory tab — `theory[8]` (heading "S25-T4-B · Injection, exfiltración, sesgo y minimización de datos")

**Paragraph 1 (line 326):**
> **Before:**
> **Prompt injection:** el documento no confiable (OCR de S24, email sintético) puede intentar dar órdenes ("ignore previous instructions"). Delimítalo como **datos**, separa system/user, deshabilita tools por defecto y **nunca** eleves su texto al rol system. El AI assist solo borra; el humano aprueba acciones externas.

> **After:**
> **Prompt injection:** el documento no confiable (OCR de S24, email sintético) puede intentar dar órdenes ("ignore previous instructions"). Delimítalo como **datos**, separa *system/user*, deshabilita las tools por defecto y **nunca** eleves su texto al rol *system*. El asistente de IA solo borra; el humano aprueba acciones externas.

**Changes:** `system/user` → `*system/user*` (italics); `rol system` → `rol *system*` (italics); `deshabilita tools` → `deshabilita las tools` (article); `El AI assist solo borra` → `El asistente de IA solo borra` (issue #3).

> **Note:** "El AI assist solo borra" is semantically odd. The intent is "the AI assist only deletes [invented content]" but "solo borra" without an object reads ambiguously. Better might be "El asistente de IA solo borra contenido inventado" or "El asistente de IA solo propone supresiones". The Fixer should clarify intent.

**Paragraph 2 (line 327) — 23w in 1 sentence with 5 commas, high_comma_density:**
> **Before:**
> Un regex de detección es **telemetría**, no control real: encoding e instrucciones indirectas lo evaden. Controles que sí importan: privilegio mínimo (`allowed_tools=[]`), allowlists, `requires_human_approval=True`, límites de salida y logs. **Exfiltración:** cero secretos (`api_key`) en el contexto del modelo. **Minimiza** a las keys necesarias (`ruc`, `total`, …).

> **After:**
> Un regex de detección es **telemetría**, no un control real: el *encoding* y las instrucciones indirectas lo evaden. Controles que sí importan: privilegio mínimo (`allowed_tools=[]`), *allowlists*, `requires_human_approval=True`, límites de salida y logs. **Exfiltración:** cero secretos (`api_key`) en el contexto del modelo. **Minimiza** a las *keys* necesarias (`ruc`, `total`, …).

**Changes:** `no control real` → `no un control real` (article); `encoding e instrucciones` → `el encoding y las instrucciones` (article + clarify: "e" → "y" because "instrucciones" starts with /i/ sound → actually "e" is correct before /i/ sound — keep "e"; but `encoding` starts with /e/ so "y encoding" is correct → actually the original "encoding e instrucciones" is right because "e" replaces "y" before /i/ sound. Keep as-is. But add article "el encoding e las instrucciones" → awkward. Better: "el encoding y las instrucciones indirectas" — use "y" because "el encoding" starts with /e/ sound (article "el" before "encoding"). Actually `y` → `e` only before words starting with /i/ sound, not /e/. So `el encoding y las instrucciones` is correct. → Change to: `el encoding y las instrucciones indirectas lo evaden`); `allowlists` → `*allowlists*` (italics); `keys` → `*keys*` (italics).

**Paragraph 3 (line 328):**
> **Before:**
> Matching o scoring **no** es veredicto de fraude. Política explícita en el path del assist: `auto_fraud_label=False`. El desk sintético mide golden y seguridad sin auto-etiquetar culpa.

> **After:**
> El *matching* o el *scoring* **no** son veredicto de fraude. Política explícita en el *path* del asistente: `auto_fraud_label=False`. El desk sintético mide golden y seguridad sin autoetiquetar culpa.

**Changes:** `Matching o scoring no es` → `El matching o el scoring no son` (articles + plural agreement because subject is disjunctive plural); `path del assist` → `*path* del asistente` (italics + issue #3); `auto-etiquetar` → `autoetiquetar` (issue #5).

### 6.10 I Do tab — `iDo.intro` (line 367) — issue #7 long sentence

> **Before:**
> Te muestro el AI assist de CP-N2-C como lo armaría un analista del desk Lima: primero el árbol de stack, luego model card y hosting, mock HF con contrato estable, cache + circuit breaker, JSON con schema, tools con stop en denegación, golden con field F1 y request segura. Cada demo calcula la salida (no la hardcodea); el path nunca auto-etiqueta fraude.

> **After (converted to numbered list):**
> Te muestro el asistente de IA de CP-N2-C como lo armaría un analista del desk Lima. Cada demo calcula la salida (no la hardcodea); el *path* nunca autoetiqueta fraude. Recorrido:
>
> 1. **Árbol de stack** (T1-A): regla vs. modelo especializado vs. LLM.
> 2. **Model card y hosting** (T1-B): licencia, *not_for* y decisión local o cloud.
> 3. **Mock HF con contrato estable** (T2-A): `{model, label, score}`.
> 4. **Cache + circuit breaker** (T2-B): *miss/hit*, *timeouts* y *fallback*.
> 5. **JSON con schema** (T3-A): *required keys* y `json.loads`.
> 6. **Tools con stop en denegación** (T3-B): *allowlist* y `tool_denied`.
> 7. **Golden con field F1** (T4-A): *exact match*, *schema rate* y *field F1*.
> 8. **Request segura** (T4-B): *tools* vacíos, *untrusted_document* y HITL.

**Changes:** `el AI assist` → `el asistente de IA` (issue #3); `auto-etiqueta` → `autoetiqueta` (issue #5); `path` → `*path*` (italics); restructured 40-w enumeration into a numbered list mirroring the 8 demos (issue #7). Note: the list also adds a brief tagline per demo (T1-A, T1-B, etc.) that wasn't in the original — the Fixer may prefer a simpler 8-item list without the parenthetical tags.

### 6.11 I Do tab — `iDo.steps[*].why` (8 one-sentence motivations)

> Spot rewrite (one example, S25-T1-A-DEMO `why`):
> **Before:** `Decisión profesional: si el ticket es determinista, no pagas un LLM; el árbol deja rastro auditable del stack elegido.`
> **After:** `Decisión profesional: si el ticket es determinista, no pagas un LLM; el árbol deja un rastro auditable del stack elegido.`
> **Change:** `rastro auditable` → `un rastro auditable` (article).

> Spot rewrite (S25-T2-B-DEMO `why`):
> **Before:** `Ops reales del assist: cache, contador de fallas y circuito abierto (no reintentar a ciegas).`
> **After:** `Ops reales del asistente: cache, contador de fallas y circuito abierto (no reintentar a ciegas).`
> **Change:** `assist` → `asistente` (issue #3).

> Spot rewrite (S25-T3-A-DEMO `why`):
> **Before:** `Sin schema válido no hay promote: el assist falla cerrado aunque el texto "se vea bien".`
> **After:** `Sin schema válido no hay *promote*: el asistente falla cerrado aunque el texto "se vea bien".`
> **Changes:** `promote` → `*promote*` (italics); `assist` → `asistente` (issue #3).

> Spot rewrite (S25-T4-B-DEMO `why`):
> **Before:** `Privilegio mínimo y minimización son el control real; el regex es solo telemetría.`
> **After:** `El privilegio mínimo y la minimización son el control real; el regex es solo telemetría.`
> **Change:** `Privilegio mínimo y minimización` → `El privilegio mínimo y la minimización` (articles).

> The remaining 4 `why` strings are clean (S25-T1-B-DEMO, S25-T2-A-DEMO, S25-T3-B-DEMO, S25-T4-A-DEMO).

### 6.12 We Do tab — `weDo.intro` (line 589)

> **Before:**
> 24 ejercicios en tres capas por subtema (guiado → independiente → transferencia): corriges el bug del starter hasta que la salida coincida exactamente con la solución. Datos sintéticos del lab (`CASO-LIM-025`); no etiquetes fraude ni parentesco. Cada E3 te acerca al contrato del You Do (adapter, schema, golden, request segura).

> **After:**
> 24 ejercicios en tres capas por subtema (guiado → independiente → transferencia): corriges el bug del *starter* hasta que la salida coincida exactamente con la solución. Datos sintéticos del lab (`CASO-LIM-025`); no etiquetes fraude ni parentesco. Cada E3 te acerca al contrato del You Do (adapter, schema, golden y request segura).

**Changes:** `starter` → `*starter*` (italics); `request segura` → `y request segura` (parallelism with comma-separated list).

### 6.13 We Do tab — `weDo.steps[*].instruction` (24 long instructions, 5 flagged as long_sentence >32 w)

> Spot rewrite (S25-T1-A-E1 instruction, line 596, 34 w):
> **Before:** `S25-T1-A-E1 · Implementa el árbol completo de \`choose_stack(task)\` de la teoría: (1) deterministic y patterns_known → \`rules\`; (2) label_set_fixed y n_train≥500 → \`specialized_model\`; (3) needs_language y has_schema_validator → \`llm_structured\`; (4) si no, \`human\`. El starter devuelve siempre \`llm_structured\`. Evalúa el ticket determinista del fixture e imprime el stack. Salida exacta: rules.`
> **After:** `S25-T1-A-E1 · Implementa el árbol completo de \`choose_stack(task)\` de la teoría: (1) \`deterministic\` y \`patterns_known\` → \`rules\`; (2) \`label_set_fixed\` y \`n_train >= 500\` → \`specialized_model\`; (3) \`needs_language\` y \`has_schema_validator\` → \`llm_structured\`; (4) si no, \`human\`. El *starter* devuelve siempre \`llm_structured\`. Evalúa el ticket determinista del fixture e imprime el stack. Salida exacta: \`rules\`.`
> **Changes:** Added backticks around the 4 task-key identifiers (they were bare); `starter` → `*starter*`; `Salida exacta: rules` → `Salida exacta: \`rules\`` (backticks for code value).

> Spot rewrite (S25-T1-B-E3 instruction, line 807, 41 w — issue #13):
> **Before:** `S25-T1-B-E3 · A partir de la model card (licencia apache-2.0, not_for con fraud adjudication), implementa \`card_gate(card)\` que devuelva un dict con \`reuse_ok\` (licencia en {mit, apache-2.0}) y \`blocks_fraud\` (membership de 'fraud adjudication' en not_for). El starter fija ambos en False. Imprime el dict. Salida exacta: {'reuse_ok': True, 'blocks_fraud': True}.`
> **After:** `S25-T1-B-E3 · Dada la model card del lab (licencia \`apache-2.0\` y \`not_for\` con \`fraud adjudication\`), implementa \`card_gate(card)\` que devuelva un dict con dos claves: (1) \`reuse_ok\` — \`True\` si la licencia está en {\`mit\`, \`apache-2.0\`}; (2) \`blocks_fraud\` — \`True\` si \`'fraud adjudication'\` está en \`not_for\`. El *starter* fija ambos en \`False\`. Imprime el dict. Salida exacta: \`{'reuse_ok': True, 'blocks_fraud': True}\`.`
> **Changes:** Split the long sentence into a clearer two-clause spec (issue #13 / #21); added backticks around all code identifiers and string values.

> The remaining 22 instructions are pedagogically clear and consistent in style. Most use the pattern `S25-TX-Y-EZ · {problem} · {starter bug} · {expected output}`. The Fixer should consider adding backticks to bare code identifiers in all 24 instructions (case-by-case; mostly low-severity polish).

### 6.14 We Do tab — `weDo.steps[*].feedback` (24 one-sentence feedbacks)

> Spot rewrite (S25-T1-A-E1 feedback, line 604):
> **Before:** `Si imprimiste llm_structured, la rama determinista no se evaluó antes del fallback.`
> **After:** `Si imprimiste \`llm_structured\`, la rama determinista no se evaluó antes del *fallback*.`
> **Changes:** `llm_structured` → `\`llm_structured\`` (backticks); `fallback` → `*fallback*` (italics).

> Spot rewrite (S25-T2-B-E3 feedback, line 1043, issue #4 "vs"):
> **Before:** `Cuenta la falla (failures+=1) antes de decidir circuit_open vs rules.`
> **After:** `Cuenta la falla (\`failures += 1\`) antes de decidir \`circuit_open\` vs. \`rules\`.`
> **Changes:** `failures+=1` → `\`failures += 1\`` (backticks + spacing); `vs rules` → `vs. \`rules\`` (issue #4 + backticks).

> The remaining 22 `feedback` strings are clean.

### 6.15 We Do tab — `weDo.steps[*].hint` and `hints[]` (24 + 48 strings)

Most `hint` / `hints` strings are code-adjacent and use bare identifiers. Recommended global rule: wrap code identifiers in backticks. A few examples:

> Spot rewrite (S25-T1-A-E1 `hint`, line 597):
> **Before:** `Primera rama: deterministic y patterns_known → rules (antes de mirar LLM)`
> **After:** `Primera rama: \`deterministic\` y \`patterns_known\` → \`rules\` (antes de mirar LLM)`

> Spot rewrite (S25-T2-B-E2 `hints[1]`, line 1004):
> **Before:** `Sin /1000 el costo se infla mil veces y el desk subestima la factura cloud`
> **After:** `Sin \`/1000\` el costo se infla mil veces y el desk subestima la factura *cloud*`

> Spot rewrite (S25-T4-B-E3 `hint`, line 1513):
> **Before:** `Ninguna rama retorna fraud; score alto ≠ veredicto`
> **After:** `Ninguna rama retorna \`fraud\`; score alto ≠ veredicto`

> The remaining `hint` / `hints` strings follow the same pattern. The Fixer should apply the backtick rule programmatically.

### 6.16 We Do tab — `weDo.steps[*].edgeCases` (35 strings)

Most `edgeCases` are short fragments (3-10 words) intentionally without terminal punctuation (bullet-style). This is a **false-positive class** for the `missing_terminal` heuristic. No rewrites needed; the Fixer should leave them as-is.

### 6.17 You Do tab — `youDo.{title, context, objectives, requirements, portfolioNote, rubric}`

**Title (line 1549):**
> **Before:** `Asistente JSON evaluado (AI assist CP-N2-C)`
> **After:** `Asistente JSON evaluado (asistente de IA CP-N2-C)`
> **Change:** `AI assist` → `asistente de IA` (issue #3).

**Context (line 1551) — 38 w in 1 sentence:**
> **Before:**
> Tras S24 (campos OCR como contexto untrusted), implementa el AI assist de CP-N2-C: adapter HTTP local (fixture) u opcionalmente mock de pipeline, con schema, cache/timeout, golden eval (exact + schema + field F1) e injection-by-design. Ninguna salida sin evidencia; ningún label de fraude autónomo.

> **After:**
> Tras S24 (campos OCR como contexto *untrusted*), implementa el asistente de IA de CP-N2-C. Tiene cuatro piezas: (1) **adapter HTTP local** (fixture) o, opcionalmente, mock de pipeline; (2) **schema, cache/timeout y fallback**; (3) **golden eval** (*exact*, *schema* y *field F1*); (4) **injection-by-design** (*tools* vacíos, *untrusted_document*, HITL). Ninguna salida sin evidencia; ningún *label* de fraude autónomo.

**Changes:** `el AI assist` → `el asistente de IA` (issue #3); `untrusted` → `*untrusted*` (italics); restructured 38-w sentence into a 4-item enumerated list (issue #13); added explicit "tools vacíos, untrusted_document, HITL" to clarify injection-by-design (the original mentions it only in the rubric, not the context).

**Objectives (line 1552–1557):**
> **Before (1):** `Decisión rule/specialized/LLM documentada en metadata del run`
> **After (1):** `Decisión \`rule\`/\`specialized\`/\`LLM\` documentada en la metadata del run`
> **Changes:** Added backticks around code values; added article `la` before `metadata`.

> **Before (2):** `Inferencia con cache por hash(input+model), timeout y fallback a rules_or_human`
> **After (2):** `Inferencia con cache por \`hash(input+model)\`, timeout y fallback a \`rules_or_human\``
> **Change:** Backticks around code expression.

> **Before (3):** `JSON schema + métricas golden (exact, schema_rate, field_f1) sobre ≥3 filas sintéticas`
> **After (3):** `JSON schema + métricas golden (\`exact\`, \`schema_rate\`, \`field_f1\`) sobre ≥3 filas sintéticas`
> **Change:** Backticks around code identifiers.

> **Before (4):** `Request con allowed_tools=[], contenido delimitado, minimización y requires_human_approval=True`
> **After (4):** `Request con \`allowed_tools=[]\`, contenido delimitado, minimización y \`requires_human_approval=True\``
> **Change:** Backticks around code expressions.

**Requirements (line 1558–1563):**
> **Before (1):** `Sin PII real a endpoints públicos; solo datos sintéticos CASO-LIM-025`
> **After (1):** `Sin PII real a endpoints públicos; solo datos sintéticos \`CASO-LIM-025\``
> **Change:** Backticks around fixture ID.

> **Before (2):** `Schema fail o injection_signal → human_review (fail-closed)`
> **After (2):** `Schema fail o \`injection_signal\` → \`human_review\` (*fail-closed*, cierre por fallo)`
> **Changes:** Backticks around code identifiers; gloss `fail-closed`.

> **Before (3):** `Baseline comparado (reglas o mock previo) documentado`
> **After (3):** `*Baseline* comparado (reglas o mock previo) documentado`
> **Change:** `Baseline` → `*Baseline*` (italics).

> **Before (4):** `Narrativa y README en español profesional (es-PE)`
> **After (4):** (no change — already clean).

**portfolioNote (line 1632):**
> **Before:** `Componente AI assist de CP-N2-C con eval (exact/schema/F1) y controles de seguridad; listo para orquestación en S26.`
> **After:** `Componente del asistente de IA de CP-N2-C con eval (\`exact\`/\`schema\`/\`F1\`) y controles de seguridad; listo para orquestación en S26.`
> **Changes:** `AI assist` → `asistente de IA` (issue #3); backticks around metric names.

**Rubric (line 1633–1640):**
> Spot rewrite (criterion 5, line 1638 — issue #11 "deploy"):
> **Before:** `Código legible, metadata de stack/deploy y límites del fixture claros`
> **After:** `Código legible, metadata de stack/despliegue y límites del fixture claros`
> **Change:** `deploy` → `despliegue` (issue #11).

> Spot rewrite (criterion 6, line 1639):
> **Before:** `Documentación en español profesional (es-PE)`
> **After:** (no change — already clean).

> The remaining 4 rubric criteria are clean.

### 6.18 Autocheck tab — `selfCheck.questions[*]`

**Q1 (line 1645):**
> **Before:** `¿Cuándo preferir reglas a un LLM en el AI assist?`
> **After:** `¿Cuándo preferir reglas a un LLM en el asistente de IA?`
> **Change:** `el AI assist` → `el asistente de IA` (issue #3).

**Q2 (line 1652) — issue #8 ellipsis:**
> **Before:** `Una salida del generador sin JSON válido (schema_fail) debe…`
> **After:** `¿Qué debe hacerse con una salida del generador que no produce JSON válido (\`schema_fail\`)?`
> **Changes:** Converted ellipsis to proper Spanish question (issue #8); added backticks around `schema_fail`.

**Q3 (line 1659) — issue #12 "PDF OCR":**
> **Before:** `¿Cómo se mitiga prompt injection desde un PDF OCR?`
> **After:** `¿Cómo se mitiga *prompt injection* desde un PDF procesado con OCR?`
> **Changes:** `prompt injection` → `*prompt injection*` (italics); `PDF OCR` → `PDF procesado con OCR` (issue #12).

**Q4 (line 1666) — issue #8 ellipsis + issue #3:**
> **Before:** `El AI assist de este curso puede etiquetar fraude de forma autónoma…`
> **After:** `¿Puede el asistente de IA de este curso etiquetar fraude de forma autónoma?`
> **Changes:** Converted declarative-with-ellipsis to proper Spanish yes/no question (issue #8); `el AI assist` → `el asistente de IA` (issue #3).

**Q5 (line 1673) — issue #8 ellipsis + issue #10 "la ops":**
> **Before:** `Tras N timeouts seguidos al endpoint del assist, la ops correcta es…`
> **After:** `¿Cuál es la operación correcta tras N \`timeouts\` seguidos al endpoint del asistente?`
> **Changes:** Converted ellipsis to proper Spanish question (issue #8); `la ops correcta` → `la operación correcta` (issue #10); `assist` → `asistente` (issue #3); `timeouts` → `\`timeouts\`` (backticks).

**Q5 explanation (line 1677) — issue #9 "saltarse eval":**
> **Before:** `El circuit breaker (contador de fallas + open) evita cascadas de costo/latencia; el fallback no inventa éxito ni saltarse eval.`
> **After:** `El *circuit breaker* (contador de fallas + \`open\`) evita cascadas de costo/latencia; el *fallback* no inventa éxito ni salta la eval.`
> **Changes:** `circuit breaker` → `*circuit breaker*` (italics); `open` → `\`open\`` (backticks); `fallback` → `*fallback*` (italics); `saltarse eval` → `salta la eval` (issue #9).

### 6.19 Aggregate grammar metrics (per the subplan)

| Metric | Value (section-wide) |
|---|---|
| Records (learner-facing prose chunks) | 300 |
| Total Spanish words | 5,223 |
| Total sentences | 435 |
| Mean Fernández-Huerta | 82.7 ("fácil") |
| Mean INFLESZ / Szigriszt-Pazos | 78.6 ("bastante fácil") |
| Mean WPS | 11.3 |
| Median WPS | 11.0 |
| Mean SPW | 1.88 |
| Long sentences (>32 w) | 11 (one false-positive 61-w "run-on" caused by `**` markdown) |
| Genuine run-ons (>45 w) | 0 (the 61-w alert is a splitter artifact) |
| Missing terminal punctuation (heuristic) | 137 (95% false positives on bullet fragments — `hints`/`edgeCases`/`objectives`/`requirements`/`options`) |
| English-dominant sentences | 13 (most are code-adjacent prose with intentional English tech terms) |
| High comma density | 10 (most are code-adjacent instructions with set literals) |
| Missing inverted `¿`/`¡` | 0 |
| Repeated words | 0 |
| Double spaces / space-before-punct | 2 (inside code snippets — false positives) |
| Voseo leak (es-PE context) | 0 |
| Genuine meta-leak in prose | 0 (the single `meta_leak` flag on "borrador" is a false positive) |
| LanguageTool non-spelling matches | 76 (after filtering MORFOLOGIK false positives) |
| → Of which real actionable | ~24 (10 "El AI assist", 8 "vs", 5 "auto-XXX", 1 "re-facturar", plus 1-2 minor) |
| → Of which false positives | ~52 (backtick-as-apostrophe, code-identifier casing, etc.) |

---

## 7. Proposed GitHub-style Diffs

> One diff per logical issue. The Fixer may bundle related edits. **No diffs are applied by this audit.**

### Diff D-01 — Rename section id and remove off-topic Streamlit demo (P0, fixes issues #1 + #2)

**Strategy:** Coordinate three files at once: `s25-streamlit-dashboards.ts` (rename file + id), `SectionView.tsx` (remove or replace the demo), `prisma/seed.ts` (rename key). Also touch `scripts/generate_sections.py` and (optionally) prune `course-state/curriculum_hardening/visible_paragraphs/s25_streamlit-dashboards.json`.

```diff
--- a/src/lib/course/sections/s25-streamlit-dashboards.ts
+++ b/src/lib/course/sections/s25-ai-endpoints.ts  (renamed)
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'

 export const section25: CourseSection = {
-  id: "streamlit-dashboards",
+  id: "ai-endpoints",
   index: 25,
   title: "Endpoints de IA, Hugging Face y prompting evaluado",
   shortTitle: "IA endpoints y prompts",
```

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -24,7 +24,7 @@ import { section24 } from './sections/s24-rpa-advanced'
-import { section25 } from './sections/s25-streamlit-dashboards'
+import { section25 } from './sections/s25-ai-endpoints'
 import { section26 } from './sections/s26-integrator-phase1'
```

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -2124,12 +2124,87 @@
-    'streamlit-dashboards': {
-      title: 'Practica estado y caching (simulado)',
-      code: `# Simulacion de Streamlit: estado y caching
-# Sin Streamlit real - simulamos los conceptos
-
-class StreamlitSimulator:
-    """Simula el comportamiento de Streamlit."""
-    def __init__(self):
-        self.session_state = {}
-        self.cache = {}
-
-    def session(self, key, default=None):
-        """Simula st.session_state[key]."""
-        if key not in self.session_state:
-            self.session_state[key] = default
-        return self.session_state[key]
-
-    def cache_data(self, func):
-        """Simula @st.cache_data."""
-        def wrapper(*args):
-            cache_key = str(args)
-            if cache_key in self.cache:
-                print(f"  [CACHE HIT] {func.__name__}{args}")
-                return self.cache[cache_key]
-            print(f"  [CACHE MISS] {func.__name__}{args} - calculando...")
-            result = func(*args)
-            self.cache[cache_key] = result
-            return result
-        return wrapper
-
-st = StreamlitSimulator()
-
-# Funcion cacheada (simula @st.cache_data)
-@st.cache_data
-def cargar_datos(n):
-    """Simula carga costosa de datos."""
-    import time
-    time.sleep(0.1)  # simular latencia
-    return list(range(n))
-
-# Simular interacciones del usuario
-print("=== Primera llamada (cache miss) ===")
-data = cargar_datos(100)
-print(f"  Datos: {len(data)} registros")
-
-print("\\n=== Segunda llamada (cache hit) ===")
-data = cargar_datos(100)
-print(f"  Datos: {len(data)} registros")
-
-print("\\n=== Tercera llamada con args diferentes (cache miss) ===")
-data = cargar_datos(50)
-print(f"  Datos: {len(data)} registros")
-
-# Session state
-print("\\n=== Session State ===")
-contador = st.session("clicks", 0)
-print(f"  Clicks iniciales: {contador}")
-st.session_state["clicks"] += 1
-st.session_state["clicks"] += 1
-print(f"  Clicks despues de 2: {st.session('clicks')}")`,
-      expectedOutput: `=== Primera llamada (cache miss) ===
-  [CACHE MISS] cargar_datos(100,) - calculando...
-  Datos: 100 registros
-
-=== Segunda llamada (cache hit) ===
-  [CACHE HIT] cargar_datos(100,)
-  Datos: 100 registros
-
-=== Tercera llamada con args diferentes (cache miss) ===
-  [CACHE MISS] cargar_datos(50,) - calculando...
-  Datos: 50 registros
-
-=== Session State ===
-  Clicks iniciales: 0
-  Clicks despues de 2: 2`,
-      hint: 'Llama cargar_datos(100) una tercera vez - debe ser cache hit',
-    },
+    'ai-endpoints': {
+      title: 'Practica el contrato del AI assist',
+      code: `# Contrato del AI assist: {model, label, score}
+# Mock estilo HF sobre tickets sintéticos (CASO-LIM-025)
+
+def mock_pipeline(texts, model_id="demo-cls"):
+    """Mock de transformers.pipeline: keyword rule sobre 'factura'."""
+    out = []
+    for t in texts:
+        label = "billing" if "factura" in t.lower() else "other"
+        score = 0.9 if label == "billing" else 0.6
+        out.append({"model": model_id, "label": label, "score": score})
+    return out
+
+REQUIRED = {"model", "label", "score"}
+
+def schema_ok(item):
+    """Contrato del adapter: model + label + score presentes."""
+    return REQUIRED.issubset(item)
+
+print("=== Batch sintético ===")
+items = mock_pipeline(["Factura 01", "Hola mundo"])
+for it in items:
+    print(f"  {it}  schema_ok={schema_ok(it)}")
+
+print("\\n=== Caso extremo: texto vacío ===")
+empty = mock_pipeline([""])
+print(f"  {empty[0]}  schema_ok={schema_ok(empty[0])}")
+
+print("\\n=== Invariante del contrato ===")
+print(f"  Toda salida del mock pasa schema_ok: {all(schema_ok(it) for it in items + empty)}")`,
+      expectedOutput: `=== Batch sintético ===
+  {'model': 'demo-cls', 'label': 'billing', 'score': 0.9}  schema_ok=True
+  {'model': 'demo-cls', 'label': 'other', 'score': 0.6}  schema_ok=True
+
+=== Caso extremo: texto vacío ===
+  {'model': 'demo-cls', 'label': 'other', 'score': 0.6}  schema_ok=True
+
+=== Invariante del contrato ===
+  Toda salida del mock pasa schema_ok: True`,
+      hint: 'Cambia "Factura 01" por otro texto y observa cómo cambia label y score, no el contrato',
+    },
```

```diff
--- a/prisma/seed.ts
+++ b/prisma/seed.ts
@@ -7368,7 +7368,7 @@
-  // === Section 25: HF/prompting evaluado V3 (platform id streamlit-dashboards) ===
-  'streamlit-dashboards': [
+  // === Section 25: Endpoints de IA, Hugging Face y prompting evaluado (id: ai-endpoints) ===
+  'ai-endpoints': [
```

```diff
--- a/scripts/generate_sections.py
+++ b/scripts/generate_sections.py
@@ -13,7 +13,7 @@
-    25: 'streamlit-dashboards', 26: 'integrator-phase1',
+    25: 'ai-endpoints', 26: 'integrator-phase1',
```

**Note on the replacement demo:** The new `'ai-endpoints'` demo teaches the section's actual contract (`{model, label, score}` + `schema_ok`). It mirrors the theory T2-A code block (lines 124–144) so learners can experiment with the same mock. The Fixer should verify the expectedOutput runs correctly under Pyodide.

### Diff D-02 — Fix "El AI assist" gender + anglicism (P1, issue #3, 10 occurrences)

```diff
--- a/src/lib/course/sections/s25-streamlit-dashboards.ts  (or s25-ai-endpoints.ts after D-01)
+++ b/src/lib/course/sections/s25-streamlit-dashboards.ts
@@ -15 +15 @@
-    "En un desk de riesgos u operaciones en Lima (bancos, fintech, back-office de retail), el analista ya tiene campos OCR de S24 y necesita un **AI assist** que clasifique o redacte borradores sin inventar ni auto-etiquetar fraude. En CP-N2-C unificas un endpoint HTTP local o un `transformers.pipeline` bajo el mismo contrato de salida, validas JSON y evalúas con golden sets. El score del modelo es señal de prioridad para revisión humana, nunca veredicto legal ni de parentesco.",
+    "En un desk de riesgos u operaciones en Lima (bancos, fintech, back-office de retail), el analista ya tiene campos OCR de S24 y necesita un **asistente de IA** que clasifique o redacte borradores sin inventar ni autoetiquetar fraude. En CP-N2-C unificas un endpoint HTTP local o un `transformers.pipeline` bajo el mismo contrato de salida, validas JSON y evalúas con golden sets. El score del modelo es señal de prioridad para revisión humana, nunca veredicto legal ni de parentesco.",
@@ -30 +30 @@
-        "En S24 extrajiste campos de documentos (OCR / Document AI) con evidencia y abstención. El VP de riesgos del desk sintético Lima no puede "pegar" ese texto crudo a un chatbot y confiar: esos campos entran aquí como **contexto no confiable**. Decides el stack (regla, modelo especializado o LLM), llamas un adapter HTTP o Hugging Face con **contrato único**, y solo publicas JSON anclado a evidencia tras schema + eval. El AI assist de CP-N2-C produce **borradores**; el humano aprueba antes del informe o correo — nunca auto-envío ni auto-etiqueta de fraude.",
+        "En S24 extrajiste campos de documentos (OCR / Document AI) con evidencia y abstención. El VP de riesgos del desk sintético Lima no puede "pegar" ese texto crudo a un chatbot y confiar: esos campos entran aquí como **contexto no confiable**. Decides el stack (regla, modelo especializado o LLM), llamas un adapter HTTP o de Hugging Face con **contrato único**, y solo publicas JSON anclado a evidencia tras schema + eval. El asistente de IA de CP-N2-C produce **borradores**; el humano aprueba antes del informe o correo — nunca autoenvío ni autoetiqueta de fraude.",
@@ -211 +211 @@
-        "Un prompt útil tiene cinco piezas: **Objetivo**, **Contexto** (datos sintéticos o campos OCR), **Restricciones** (no inventar, no elevar órdenes del documento), **Ejemplos** few-shot y **Schema JSON** de salida. Sin schema, la narrativa libre no entra al informe del VP. El AI assist solo propone; el humano aprueba antes del correo.",
+        "Un prompt útil tiene cinco piezas: **Objetivo**, **Contexto** (datos sintéticos o campos OCR), **Restricciones** (no inventar, no elevar órdenes del documento), **Ejemplos** *few-shot* y **Schema JSON** de salida. Sin schema, la narrativa libre no entra al informe del VP. El asistente de IA solo propone; el humano aprueba antes del correo.",
@@ -246 +246 @@
-        "Modos de **thinking** (razonamiento extendido) y **tools** (function calling) aumentan costo, latencia y superficie de ataque. No los actives por moda: cada tool es un privilegio (lectura de red, FS, shell). El AI assist sigue siendo borrador con aprobación humana.",
+        "Los modos de **thinking** (razonamiento extendido) y de **tools** (*function calling*) aumentan el costo, la latencia y la superficie de ataque. No los actives por moda: cada tool es un privilegio (lectura de red, FS, shell). El asistente de IA sigue siendo un borrador con aprobación humana.",
@@ -326 +326 @@
-        "**Prompt injection:** el documento no confiable (OCR de S24, email sintético) puede intentar dar órdenes ("ignore previous instructions"). Delimítalo como **datos**, separa system/user, deshabilita tools por defecto y **nunca** eleves su texto al rol system. El AI assist solo borra; el humano aprueba acciones externas.",
+        "**Prompt injection:** el documento no confiable (OCR de S24, email sintético) puede intentar dar órdenes ("ignore previous instructions"). Delimítalo como **datos**, separa *system/user*, deshabilita las tools por defecto y **nunca** eleves su texto al rol *system*. El asistente de IA solo borra; el humano aprueba acciones externas.",
@@ -367 +367 @@
-    intro: "Te muestro el AI assist de CP-N2-C como lo armaría un analista del desk Lima: primero el árbol de stack, luego model card y hosting, mock HF con contrato estable, cache + circuit breaker, JSON con schema, tools con stop en denegación, golden con field F1 y request segura. Cada demo calcula la salida (no la hardcodea); el path nunca auto-etiqueta fraude.",
+    intro: "Te muestro el asistente de IA de CP-N2-C como lo armaría un analista del desk Lima. Cada demo calcula la salida (no la hardcodea); el *path* nunca autoetiqueta fraude. Recorrido: 1) Árbol de stack (T1-A). 2) Model card y despliegue (T1-B). 3) Mock HF con contrato estable (T2-A). 4) Cache + circuit breaker (T2-B). 5) JSON con schema (T3-A). 6) Tools con stop en denegación (T3-B). 7) Golden con field F1 (T4-A). 8) Request segura (T4-B).",
@@ -1549 +1549 @@
-    title: "Asistente JSON evaluado (AI assist CP-N2-C)",
+    title: "Asistente JSON evaluado (CP-N2-C)",
@@ -1551 +1551 @@
-      "Tras S24 (campos OCR como contexto untrusted), implementa el AI assist de CP-N2-C: adapter HTTP local (fixture) u opcionalmente mock de pipeline, con schema, cache/timeout, golden eval (exact + schema + field F1) e injection-by-design. Ninguna salida sin evidencia; ningún label de fraude autónomo.",
+      "Tras S24 (campos OCR como contexto *untrusted*), implementa el asistente de IA de CP-N2-C: adapter HTTP local (fixture) u opcionalmente mock de pipeline, con schema, cache/timeout, golden eval (*exact* + *schema* + *field F1*) e *injection-by-design*. Ninguna salida sin evidencia; ningún *label* de fraude autónomo.",
@@ -1632 +1632 @@
-      "Componente AI assist de CP-N2-C con eval (exact/schema/F1) y controles de seguridad; listo para orquestación en S26.",
+      "Componente del asistente de IA de CP-N2-C con eval (*exact*/*schema*/*F1*) y controles de seguridad; listo para orquestación en S26.",
@@ -1645 +1645 @@
-        question: "¿Cuándo preferir reglas a un LLM en el AI assist?",
+        question: "¿Cuándo preferir reglas a un LLM en el asistente de IA?",
@@ -1666 +1666 @@
-        question: "El AI assist de este curso puede etiquetar fraude de forma autónoma…",
+        question: "¿Puede el asistente de IA de este curso etiquetar fraude de forma autónoma?",
```

### Diff D-03 — Fix "vs" → "vs." (P1, issue #4, 8 occurrences)

```diff
--- a/src/lib/course/sections/s25-streamlit-dashboards.ts
+++ b/src/lib/course/sections/s25-streamlit-dashboards.ts
@@ -17 +17 @@
-    { text: "Elegir regla vs modelo especializado vs LLM con justificación auditable" },
+    { text: "Elegir regla vs. modelo especializado vs. LLM con justificación auditable" },
@@ -31 +31 @@
-        "Mapa de la sección: **T1 Selección** (qué stack y con qué gobernanza) → **T2 Inferencia** (adapter, batch, cache, costo, fallback y circuit breaker) → **T3 Prompting** (estructura, schema y tools controlados) → **T4 Evals y seguridad** (golden, field F1, injection, minimización). Fixture de lab: `CASO-LIM-025` (run_id=`cpn2c-ai`), datos sintéticos sin PII real. Cada subtema aporta un mecanismo nuevo; la ética de sección vive en el callout global (no se reimprime en cada párrafo).",
+        "Mapa de la sección: **T1 Selección** (qué stack y con qué gobernanza) → **T2 Inferencia** (adapter, batch, cache, costo, fallback y circuit breaker) → **T3 Prompting** (estructura, schema y tools controlados) → **T4 Evals y seguridad** (golden, field F1, injection, minimización). Fixture de lab: `CASO-LIM-025` (run_id=`cpn2c-ai`), datos sintéticos sin PII real. Cada subtema aporta un mecanismo nuevo; la ética de la sección vive en el callout global (no se reimprime en cada párrafo).",
@@ -32 +32 @@
-        "Promoción del assist: sin evidencia, sin schema válido o sin métricas vs baseline, la salida se descarta o va a `human_review` (fail-closed). El score del modelo es señal de prioridad, no veredicto legal ni de parentesco. En S26 el VP orquestará Excel→…→modelo/IA→informe→correo usando este mismo contrato.",
+        "Promoción del asistente: sin evidencia, sin schema válido o sin métricas vs. baseline, la salida se descarta o va a `human_review` (*fail-closed*, cierre por fallo). El score del modelo es señal de prioridad, no veredicto legal ni de parentesco. En S26 el VP orquestará Excel→…→modelo/IA→informe→correo usando este mismo contrato.",
@@ -285 +285 @@
-        "Evalúa el asistente contra un **golden set** (input → JSON esperado). Métricas mínimas: **exact match** (pred == gold), **schema rate** (keys required presentes) y **field F1** a nivel de campo: por cada clave, match exacto cuenta 1 (micro/macro simple en el lab: promedio de aciertos por campo). Sin eval vs baseline, el "demo que suena bien" no se promociona.",
+        "Evalúa el asistente contra un **golden set** (conjunto dorado de referencia; input → JSON esperado). Métricas mínimas: **exact match** (pred == gold), **schema rate** (keys required presentes) y **field F1** a nivel de campo: por cada clave, match exacto cuenta 1 (micro/macro simple en el lab: promedio de aciertos por campo). Sin eval vs. baseline, el "demo que suena bien" no se promociona.",
@@ -319 +319 @@
-          "Gate CP-N2-C: no se acepta salida sin evidencia ni eval vs baseline.",
+          "Gate CP-N2-C: no se acepta salida sin evidencia ni eval vs. baseline.",
@@ -1043 +1043 @@
-        feedback: "Cuenta la falla (failures+=1) antes de decidir circuit_open vs rules.",
+        feedback: "Cuenta la falla (`failures += 1`) antes de decidir `circuit_open` vs. `rules`.",
```

### Diff D-04 — Fix "auto-XXX" and "re-XXX" compounds (P1, issues #5 + #6, 7 occurrences)

```diff
--- a/src/lib/course/sections/s25-streamlit-dashboards.ts
+++ b/src/lib/course/sections/s25-streamlit-dashboards.ts
@@ -15 +15 @@
-    "En un desk de riesgos u operaciones en Lima (bancos, fintech, back-office de retail), el analista ya tiene campos OCR de S24 y necesita un **AI assist** que clasifique o redacte borradores sin inventar ni auto-etiquetar fraude. En CP-N2-C unificas un endpoint HTTP local o un `transformers.pipeline` bajo el mismo contrato de salida, validas JSON y evalúas con golden sets. El score del modelo es señal de prioridad para revisión humana, nunca veredicto legal ni de parentesco.",
+    "En un desk de riesgos u operaciones en Lima (bancos, fintech, back-office de retail), el analista ya tiene campos OCR de S24 y necesita un **asistente de IA** que clasifique o redacte borradores sin inventar ni autoetiquetar fraude. En CP-N2-C unificas un endpoint HTTP local o un `transformers.pipeline` bajo el mismo contrato de salida, validas JSON y evalúas con golden sets. El score del modelo es señal de prioridad para revisión humana, nunca veredicto legal ni de parentesco.",
@@ -30 +30 @@
-        "En S24 extrajiste campos de documentos (OCR / Document AI) con evidencia y abstención. El VP de riesgos del desk sintético Lima no puede "pegar" ese texto crudo a un chatbot y confiar: esos campos entran aquí como **contexto no confiable**. Decides el stack (regla, modelo especializado o LLM), llamas un adapter HTTP o Hugging Face con **contrato único**, y solo publicas JSON anclado a evidencia tras schema + eval. El AI assist de CP-N2-C produce **borradores**; el humano aprueba antes del informe o correo — nunca auto-envío ni auto-etiqueta de fraude.",
+        "En S24 extrajiste campos de documentos (OCR / Document AI) con evidencia y abstención. El VP de riesgos del desk sintético Lima no puede "pegar" ese texto crudo a un chatbot y confiar: esos campos entran aquí como **contexto no confiable**. Decides el stack (regla, modelo especializado o LLM), llamas un adapter HTTP o de Hugging Face con **contrato único**, y solo publicas JSON anclado a evidencia tras schema + eval. El asistente de IA de CP-N2-C produce **borradores**; el humano aprueba antes del informe o correo — nunca autoenvío ni autoetiqueta de fraude.",
@@ -156 +156 @@
-        "**Batch** reduce overhead de red; **timeout** evita colgar el flow del VP; **cache** por hash de `input+model` evita re-facturar el mismo ticket. Estima **costo** (tokens o requests) por run y por día. Si el endpoint cae, el fallback es regla determinista o `human_review` — nunca inventes un JSON de "éxito" falso.",
+        "**Batch** reduce la sobrecarga de red; **timeout** evita colgar el flujo de la VP; **cache** por hash de `input+model` evita refacturar el mismo ticket. Estima el **costo** (tokens o *requests*) por run y por día. Si el endpoint cae, el fallback es regla determinista o `human_review` — nunca inventes un JSON de "éxito" falso.",
@@ -328 +328 @@
-        "Matching o scoring **no** es veredicto de fraude. Política explícita en el path del assist: `auto_fraud_label=False`. El desk sintético mide golden y seguridad sin auto-etiquetar culpa.",
+        "El *matching* o el *scoring* **no** son veredicto de fraude. Política explícita en el *path* del asistente: `auto_fraud_label=False`. El desk sintético mide golden y seguridad sin autoetiquetar culpa.",
@@ -367 +367 @@
-    intro: "Te muestro el AI assist de CP-N2-C como lo armaría un analista del desk Lima: primero el árbol de stack, luego model card y hosting, mock HF con contrato estable, cache + circuit breaker, JSON con schema, tools con stop en denegación, golden con field F1 y request segura. Cada demo calcula la salida (no la hardcodea); el path nunca auto-etiqueta fraude.",
+    intro: "Te muestro el asistente de IA de CP-N2-C como lo armaría un analista del desk Lima. Cada demo calcula la salida (no la hardcodea); el *path* nunca autoetiqueta fraude. Recorrido: 1) Árbol de stack (T1-A). 2) Model card y despliegue (T1-B). 3) Mock HF con contrato estable (T2-A). 4) Cache + circuit breaker (T2-B). 5) JSON con schema (T3-A). 6) Tools con stop en denegación (T3-B). 7) Golden con field F1 (T4-A). 8) Request segura (T4-B).",
@@ -695 +695 @@
-        hint: "Ningún stack del lab auto-etiqueta fraude; el dict fija la política en metadata",
+        hint: "Ningún stack del lab autoetiqueta fraude; el dict fija la política en metadata",
@@ -1516 +1516 @@
-          "Aunque score sea 0.99, el path del assist es señal + HITL, no auto-fraude",
+          "Aunque score sea 0.99, el *path* del asistente es señal + HITL, no autofraude",
```

> **Note on `weDo.steps[2].starterCode` line 707** (the `# Bug: LLM se auto-etiqueta fraude en metadata` comment): This is **inside a starterCode body** which the grammar subplan explicitly excludes from analysis. The Fixer may update it for consistency ("auto-etiqueta" → "autoetiqueta") but it is out of scope for this audit.

### Diff D-05 — Fix self-check Q2, Q4, Q5 stems (P2, issues #8, #9, #10, #12)

```diff
--- a/src/lib/course/sections/s25-streamlit-dashboards.ts
+++ b/src/lib/course/sections/s25-streamlit-dashboards.ts
@@ -1652 +1652 @@
-        question: "Una salida del generador sin JSON válido (schema_fail) debe…",
+        question: "¿Qué debe hacerse con una salida del generador que no produce JSON válido (`schema_fail`)?",
@@ -1659 +1659 @@
-        question: "¿Cómo se mitiga prompt injection desde un PDF OCR?",
+        question: "¿Cómo se mitiga *prompt injection* desde un PDF procesado con OCR?",
@@ -1673 +1673 @@
-        question: "Tras N timeouts seguidos al endpoint del assist, la ops correcta es…",
+        question: "¿Cuál es la operación correcta tras N `timeouts` seguidos al endpoint del asistente?",
@@ -1677 +1677 @@
-          "El circuit breaker (contador de fallas + open) evita cascadas de costo/latencia; el fallback no inventa éxito ni saltarse eval.",
+          "El *circuit breaker* (contador de fallas + `open`) evita cascadas de costo/latencia; el *fallback* no inventa éxito ni salta la eval.",
```

### Diff D-06 — Fix inconsistent anglicism "deploy" / "hosting" → "despliegue" (P2, issue #11)

```diff
--- a/src/lib/course/sections/s25-streamlit-dashboards.ts
+++ b/src/lib/course/sections/s25-streamlit-dashboards.ts
@@ -367 +367 @@
-    intro: "Te muestro el AI assist de CP-N2-C como lo armaría un analista del desk Lima: primero el árbol de stack, luego model card y hosting, mock HF con contrato estable, cache + circuit breaker, JSON con schema, tools con stop en denegación, golden con field F1 y request segura. Cada demo calcula la salida (no la hardcodea); el path nunca auto-etiqueta fraude.",
+    intro: "Te muestro el asistente de IA de CP-N2-C como lo armaría un analista del desk Lima. Cada demo calcula la salida (no la hardcodea); el *path* nunca autoetiqueta fraude. Recorrido: 1) Árbol de stack (T1-A). 2) Model card y despliegue (T1-B). 3) Mock HF con contrato estable (T2-A). 4) Cache + circuit breaker (T2-B). 5) JSON con schema (T3-A). 6) Tools con stop en denegación (T3-B). 7) Golden con field F1 (T4-A). 8) Request segura (T4-B).",
@@ -400 +400 @@
-        description: "Política de hosting a partir de model card: host, bloqueo de fraude y licencia.",
+        description: "Política de despliegue a partir de la model card: host, bloqueo de fraude y licencia.",
@@ -1638 +1638 @@
-      { criterion: "Código legible, metadata de stack/deploy y límites del fixture claros", weight: "10%" },
+      { criterion: "Código legible, metadata de stack/despliegue y límites del fixture claros", weight: "10%" },
```

### Diff D-07 — Gloss English tech terms on first use (P3, issue #15)

> Apply only to the **first occurrence** of each term in the section. The Fixer should grep for each term and apply the gloss only once.

```diff
--- a/src/lib/course/sections/s25-streamlit-dashboards.ts
+++ b/src/lib/course/sections/s25-streamlit-dashboards.ts
@@ -15 +15 @@
-    "En un desk de riesgos u operaciones en Lima (bancos, fintech, back-office de retail), el analista ya tiene campos OCR de S24 y necesita un **AI assist** que clasifique o redacte borradores sin inventar ni auto-etiquetar fraude. En CP-N2-C unificas un endpoint HTTP local o un `transformers.pipeline` bajo el mismo contrato de salida, validas JSON y evalúas con golden sets. El score del modelo es señal de prioridad para revisión humana, nunca veredicto legal ni de parentesco.",
+    "En un desk de riesgos u operaciones en Lima (bancos, fintech, back-office de retail), el analista ya tiene campos OCR de S24 y necesita un **asistente de IA** que clasifique o redacte borradores sin inventar ni autoetiquetar fraude. En CP-N2-C unificas un endpoint HTTP local o un `transformers.pipeline` bajo el mismo contrato de salida, validas JSON y evalúas con *golden sets* (conjuntos dorados de referencia). El score del modelo es señal de prioridad para revisión humana, nunca veredicto legal ni de parentesco.",
@@ -32 +32 @@
-        "Promoción del assist: sin evidencia, sin schema válido o sin métricas vs baseline, la salida se descarta o va a `human_review` (fail-closed). El score del modelo es señal de prioridad, no veredicto legal ni de parentesco. En S26 el VP orquestará Excel→…→modelo/IA→informe→correo usando este mismo contrato.",
+        "Promoción del asistente: sin evidencia, sin schema válido o sin métricas vs. *baseline* (línea base), la salida se descarta o va a `human_review` (*fail-closed*, cierre por fallo). El score del modelo es señal de prioridad, no veredicto legal ni de parentesco. En S26 el VP orquestará Excel→…→modelo/IA→informe→correo usando este mismo contrato.",
@@ -38 +38 @@
-          "Sin PII real a endpoints públicos. `schema_fail` o indicios de injection → `human_review`. Score ≠ fraude. Fixture `CASO-LIM-025`. Mismo contract test para mock HTTP y mock HF.",
+          "Sin PII real a endpoints públicos. `schema_fail` o indicios de injection → `human_review`. Score ≠ fraude. Fixture `CASO-LIM-025`. Mismo *contract test* (prueba de contrato) para mock HTTP y mock HF.",
@@ -247 +247 @@
-        "Patrón de **checkpoints** auditables: `plan → tool → validar → narrar`. Si un tool no está en allowlist, **stop** (`tool_denied`) — no shell libre en el sandbox del curso. El log del checkpoint es evidencia de qué se intentó y dónde se cortó.",
+        "Patrón de **checkpoints** auditables: `plan → tool → validar → narrar`. Si un tool no está en la *allowlist* (lista de permitidos), **stop** (`tool_denied`) — nada de shell libre en el sandbox del curso. El log del checkpoint es evidencia de qué se intentó y dónde se cortó.",
@@ -286 +286 @@
-        "Salidas borderline o con `schema_fail` → **human review** obligatoria antes del informe. Injection detectada o tools no permitidos → fail-closed a cola HITL. Fixture `CASO-LIM-025` sin PII real.",
+        "Salidas *borderline* o con `schema_fail` → **human review** (revisión humana) obligatoria antes del informe. Injection detectada o tools no permitidos → *fail-closed* (cierre por fallo) a la cola HITL (human-in-the-loop, revisión humana en el bucle). Fixture `CASO-LIM-025` sin PII real.",
```

### Diff D-08 — Capitalize first letter after `?` in tree-map (P3, issue: lowercase after question mark)

```diff
--- a/src/lib/course/sections/s25-streamlit-dashboards.ts
+++ b/src/lib/course/sections/s25-streamlit-dashboards.ts
@@ -46 +46 @@
-        "Árbol operativo: ¿tarea determinista y patrones conocidos? → `rules`. ¿label set fijo y ≥500 ejemplos de train? → `specialized_model`. ¿necesitas lenguaje abierto y tienes validador de schema? → `llm_structured`. Si no cumples ninguna rama con control → `human`. Documenta la decisión en metadata del run (stack, razón, model_id).",
+        "Árbol operativo: ¿tarea determinista y patrones conocidos? → `rules`. ¿Conjunto de etiquetas fijo y ≥500 ejemplos de entrenamiento? → `specialized_model`. ¿Necesitas lenguaje abierto y tienes validador de schema? → `llm_structured`. Si no cumples ninguna rama con control → `human`. Documenta la decisión en la metadata del run (stack, razón, `model_id`).",
```

### Diff D-09 — Add articles and italics in T2-A paragraphs (P3, polish)

```diff
--- a/src/lib/course/sections/s25-streamlit-dashboards.ts
+++ b/src/lib/course/sections/s25-streamlit-dashboards.ts
@@ -120 +120 @@
-        "En producción la forma típica es `from transformers import pipeline` → `clf = pipeline('text-classification', model=model_id)` → `clf(texts)` devuelve lista de `{label, score}`. Un Inference Endpoint HTTP es el **mismo contrato de salida** que tu adapter local. En el curso **mockeamos** el pipeline para correr sin bajar pesos: el mock devuelve `{model, label, score}` (añadimos `model` nosotros) idéntico al adapter real para que los contract tests no mientan. La clave del artefacto en el contrato del lab es **`model`**; no inventes un segundo nombre en el grader.",
+        "En producción la forma típica es `from transformers import pipeline` → `clf = pipeline('text-classification', model=model_id)` → `clf(texts)` devuelve una lista de `{label, score}`. Un Inference Endpoint HTTP tiene el **mismo contrato de salida** que tu adapter local. En el curso **mockeamos** el pipeline para correr sin bajar pesos: el mock devuelve `{model, label, score}` (añadimos `model` nosotros) idéntico al adapter real, para que los *contract tests* no mientan. La clave del artefacto en el contrato del lab es **`model`**; no inventes un segundo nombre en el grader.",
@@ -121 +121 @@
-        "Forma estable: input texto (o batch de textos) → lista o dict con `label`, `score` y `model`. Loguea `model` + versión en cada run. Si el payload no valida schema o hay indicios de injection, no "arregles" en silencio: fail-closed a `human_review`. El score **no** es veredicto de fraude.",
+        "Forma estable: input de texto (o *batch* de textos) → lista o dict con `label`, `score` y `model`. Loguea `model` + versión en cada run. Si el payload no valida el schema o hay indicios de injection, no "arregles" en silencio: *fail-closed* (cierre por fallo) a `human_review`. El score **no** es veredicto de fraude.",
```

### Diff D-10 — Add Spanish gloss for "model card" on first use (P3, issue #15)

```diff
--- a/src/lib/course/sections/s25-streamlit-dashboards.ts
+++ b/src/lib/course/sections/s25-streamlit-dashboards.ts
@@ -79 +79 @@
-        "Antes de desplegar, lee la **model card**: uso previsto (*intended use*), limitaciones, sesgos y datos de entrenamiento. Revisa la **licencia** (MIT/Apache suelen permitir reuso comercial; otras piden revisión legal). *not_for* en la card no es decoración: si lista adjudicación de fraude o biometría, ese uso queda bloqueado en tu política aunque la licencia sea permisiva.",
+        "Antes de desplegar, lee la **model card** (tarjeta de modelo): uso previsto (*intended use*), limitaciones, sesgos y datos de entrenamiento. Revisa la **licencia** (MIT/Apache suelen permitir reuso comercial; otras piden revisión legal). La sección *not_for* de la card no es decoración: si lista adjudicación de fraude o biometría, ese uso queda bloqueado en tu política aunque la licencia sea permisiva.",
```

### Diff D-11 — Wrap bare code identifiers in backticks across We Do instructions (P3, polish — apply case-by-case)

> The Fixer should apply this rule programmatically: any string of the form `[a-z_][a-z0-9_]*` that is a Python identifier and is referenced as a code value in the surrounding sentence should be wrapped in backticks. Example for S25-T1-A-E1:

```diff
--- a/src/lib/course/sections/s25-streamlit-dashboards.ts
+++ b/src/lib/course/sections/s25-streamlit-dashboards.ts
@@ -596 +596 @@
-          "S25-T1-A-E1 · Implementa el árbol completo de `choose_stack(task)` de la teoría: (1) deterministic y patterns_known → `rules`; (2) label_set_fixed y n_train≥500 → `specialized_model`; (3) needs_language y has_schema_validator → `llm_structured`; (4) si no, `human`. El starter devuelve siempre `llm_structured`. Evalúa el ticket determinista del fixture e imprime el stack. Salida exacta: rules.",
+          "S25-T1-A-E1 · Implementa el árbol completo de `choose_stack(task)` de la teoría: (1) `deterministic` y `patterns_known` → `rules`; (2) `label_set_fixed` y `n_train >= 500` → `specialized_model`; (3) `needs_language` y `has_schema_validator` → `llm_structured`; (4) si no, `human`. El *starter* devuelve siempre `llm_structured`. Evalúa el ticket determinista del fixture e imprime el stack. Salida exacta: `rules`.",
```

### Diff D-12 — Fix "la ops" in T2-B.p[2] and T3-A.p[2] (P2, issue #10)

```diff
--- a/src/lib/course/sections/s25-streamlit-dashboards.ts
+++ b/src/lib/course/sections/s25-streamlit-dashboards.ts
@@ -158 +158 @@
-        "Prompts largos y tools activos (T3) multiplican tokens: la ops de inferencia y el diseño del prompt se planifican juntos. En el lab, si `fail=True` → `fallback rules_or_human`; schema y golden siguen siendo gate de promote.",
+        "Los prompts largos y las tools activas (T3) multiplican tokens: la operación de inferencia y el diseño del prompt se planifican juntos. En el lab, si `fail=True` → `fallback rules_or_human`; el schema y el golden siguen siendo *gate* de *promote*.",
@@ -213 +213 @@
-        "El documento OCR es contexto, no system prompt. En T4 verás injection: aquí aseguras que el contrato de salida ya esté listo para el golden (exact match y field F1 por campo). Prompts largos y tools (T3-B) multiplican tokens: diseña el schema junto con la ops de cache/costo de T2-B.",
+        "El documento OCR es contexto, no *system prompt*. En T4 verás injection: aquí aseguras que el contrato de salida ya esté listo para el golden (*exact match* y *field F1* por campo). Los prompts largos y las tools (T3-B) multiplican tokens: diseña el schema junto con la operación de cache/costo de T2-B.",
```

### Diff D-13 — Add articles and italics in T4-B.p[2] (P3, polish)

```diff
--- a/src/lib/course/sections/s25-streamlit-dashboards.ts
+++ b/src/lib/course/sections/s25-streamlit-dashboards.ts
@@ -327 +327 @@
-        "Un regex de detección es **telemetría**, no control real: encoding e instrucciones indirectas lo evaden. Controles que sí importan: privilegio mínimo (`allowed_tools=[]`), allowlists, `requires_human_approval=True`, límites de salida y logs. **Exfiltración:** cero secretos (`api_key`) en el contexto del modelo. **Minimiza** a las keys necesarias (`ruc`, `total`, …).",
+        "Un regex de detección es **telemetría**, no un control real: el *encoding* y las instrucciones indirectas lo evaden. Controles que sí importan: privilegio mínimo (`allowed_tools=[]`), *allowlists*, `requires_human_approval=True`, límites de salida y logs. **Exfiltración:** cero secretos (`api_key`) en el contexto del modelo. **Minimiza** a las *keys* necesarias (`ruc`, `total`, …).",
```

### Diff D-14 — Fix Q1 option[3] anglicism "endpoint cloud" (P3, issue #23)

```diff
--- a/src/lib/course/sections/s25-streamlit-dashboards.ts
+++ b/src/lib/course/sections/s25-streamlit-dashboards.ts
@@ -1646 +1646 @@
-        options: ["Cuando el problema es determinista y la auditabilidad importa", "Siempre preferir LLM por flexibilidad", "Nunca usar reglas en producción", "Solo cuando el endpoint cloud esté más barato"],
+        options: ["Cuando el problema es determinista y la auditabilidad importa", "Siempre preferir LLM por flexibilidad", "Nunca usar reglas en producción", "Solo cuando el endpoint en la nube esté más barato"],
```

### Diff D-15 — Prune stale `visible_paragraphs/s25_streamlit-dashboards.json` snapshot (P3, informational)

> Optional cleanup. The Fixer should verify the snapshot is not used by any active code path before deleting. If kept, rename to `s25_ai-endpoints.json` to match the new id (after D-01).

```diff
- course-state/curriculum_hardening/visible_paragraphs/s25_streamlit-dashboards.json  (deleted or renamed)
+ course-state/curriculum_hardening/visible_paragraphs/s25_ai-endpoints.json  (after D-01)
```

### Diff D-16 — Suppress `S25-TN-X` subtopic-ID prefixes in rendered headings (P3, issue #17, systemic)

> The Fixer should consider whether the rendered UI should strip the `S25-T1-A ·` prefix from theory headings. This is a presentation-layer change in `SectionView.tsx` (or a render-time transform of `theory[*].heading`), not a content change. If the prefix is kept, the issue is closed as WONTFIX. If stripped, the heading text on line 42 becomes just "Elegir regla, modelo especializado o LLM con justificación" and the `subtopicId` is preserved as a `data-testid` or ARIA attribute.

> **No concrete diff proposed** — depends on UI layer decision. Flagged for the Fixer's judgment.

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue(s) | Diff(s) | Effort | Risk |
|---|---|---|---|---|
| **P0** | #1 + #2 (slug + off-topic demo) | D-01 | 2–3 h | Medium — coordinated change across 4 files; live URL hash changes from `#streamlit-dashboards` to `#ai-endpoints`; bookmarks break. Recommend redirect or keep `#streamlit-dashboards` as alias during transition. |
| **P1** | #3 ("El AI assist" 10×) | D-02 | 30 min | Low — pure text replacement; verify no string is part of a key/identifier. |
| **P1** | #4 ("vs" 8×) | D-03 | 15 min | Low — pure text replacement. |
| **P1** | #5 + #6 (auto-XXX / re-XXX 7×) | D-04 | 20 min | Low — pure text replacement; do not touch `# Bug: ...` comments inside `starterCode` (out of scope per grammar subplan). |
| **P2** | #8 + #9 + #10 + #12 (Q-stem fixes) | D-05 | 30 min | Low — improves self-check readability; verify correctIndex still matches the new question shape (no change to options/correctIndex). |
| **P2** | #11 (deploy/hosting → despliegue) | D-06 | 10 min | Low — pure text replacement. |
| **P2** | #7 (iDo intro long sentence) | bundled in D-02 / D-04 / D-06 | 15 min | Low — restructure to numbered list; verify the 8-item list matches the 8 demos in order. |
| **P3** | #15 (gloss English terms on first use) | D-07 + D-10 | 1 h | Low — apply only to first occurrence of each term. |
| **P3** | #13 (long sentences in instructions) | D-11 + case-by-case | 2 h | Low — split where pedagogically justified; leave map-style sentences (T1-A.p[2]) as-is. |
| **P3** | #10 (la ops) | D-12 | 10 min | Low — apply only to the 2 prose occurrences (not to the heading "Batching, timeout, cache, costo, fallback y circuit breaker" which is fine). |
| **P3** | #16 (constrained decoding / free-text) | bundled in §6.6 paragraph 2 rewrite | 5 min | Low. |
| **P3** | #17 (suppress S25-TN-X prefix in headings) | D-16 | TBD | Medium — UI-layer change; coordinate with design. |
| **P3** | #18 (bare S24/S26/T2-B references) | (no diff proposed) | — | WONTFIX — pedagogically defensible. |
| **P3** | #19 (limite vs límite) | (no diff — code identifier) | — | WONTFIX — `limite` is intentional as JSON key. |
| **P3** | #22 (≠ in code comments) | (no diff) | — | WONTFIX — Unicode operator is fine in comments. |
| **P3** | #23 (endpoint cloud) | D-14 | 5 min | Low. |
| **P3** | #25 (overhead / flow anglicisms) | bundled in D-04 | — | Low. |
| **Info** | #14 (61-w false-positive run-on) | (no diff) | — | WONTFIX — splitter artifact; no real issue. |
| **Info** | #15 (stale `visible_paragraphs` snapshot) | D-15 | 5 min | Low — dev-facing only. |
| **Info** | #24 (accents in Streamlit demo) | disappears after D-01 | — | Auto-fixed by D-01. |

**Total estimated effort (P0 + P1 + P2 + P3 + Info):** 6–8 hours for one Fixer, plus 1–2 hours of coordination for the D-01 rename (verify no broken links, no stale references, redirect old hash).

---

## 9. Graph Memory Update Notes (for shared context files)

> These notes are for the orchestrator's shared graph memory. Append to `course-state/curriculum_hardening/GRAPH_MEMORY.json` or equivalent.

### 9.1 Section identity node
- **Section 25**:
  - file: `src/lib/course/sections/s25-streamlit-dashboards.ts` (rename candidate: `s25-ai-endpoints.ts`)
  - id: `"streamlit-dashboards"` (rename candidate: `"ai-endpoints"`)
  - title: "Endpoints de IA, Hugging Face y prompting evaluado"
  - phase: 1 (Competente), slot 25/52, 19 h, level: Competente
  - gate: CP-N2-C
  - topics: T1-A (stack selection), T1-B (model card + hosting), T2-A (HF pipeline mock), T2-B (batching/timeout/cache/circuit breaker), T3-A (prompt + schema), T3-B (tools + checkpoints + allowlist), T4-A (golden set + field F1), T4-B (injection + minimization)
  - fixture: `CASO-LIM-025` (run_id=`cpn2c-ai`)

### 9.2 Edges
- **S24 → S25** (OCR output → untrusted_document context). S24 produces OCR fields; S25 consumes them as `untrusted_document` in the AI assist. Edge type: data-flow + ethical-spine ("score ≠ fraude" inherited from S24 and reinforced in S25).
- **S25 → S26** (AI assist contract → Excel→…→modelo/IA→informe→correo orchestration). S25 produces the JSON contract `{model, label, score}` + `SCHEMA_KEYS` + golden eval; S26 consumes them. Edge type: contract-handoff.
- **S25 ↔ OWASP LLM Top 10** (LLM01 injection → S25 T4-B; LLM06 sensitive info → S25 T4-B; LLM08 excessive agency → S25 T3-B). Edge type: external-reference.
- **S25 ↔ Mitchell et al. 2019** (model cards paper → S25 T1-B). Edge type: external-reference.
- **S25 ↔ Hugging Face Pipeline tutorial** (→ S25 T2-A). Edge type: external-reference.
- **S25 ↔ OpenAI Structured Outputs** (→ S25 T3-A). Edge type: external-reference.
- **S25 ↔ Percival & Gregory (Architecture Patterns with Python)** (circuit breaker → S25 T2-B). Edge type: external-reference (not in resources list — Fixer could add).

### 9.3 Defect patterns observed (cross-section signals)
- **PATTERN: stale slug + off-topic interactive demo.** Same pattern as S05 (`id:"oop"` on a Functions section), S06 (`id:"numpy"` on a NumPy-forbidden section + numpy editor demo), S07 (`id:"data-acquisition"`), S08 (`id:"pandas"`), S10 (`id:"sklearn"` on a packaging section), S11 (`id:"testing"` on an OOP section), S12 (`id:"performance"` on an APIs/SQL/Geo section). **Systemic across Phase 0/1.** Recommend orchestrator-level audit of all `demos['*']` keys in `SectionView.tsx` against the actual content of each section file. Likely 8+ off-topic demos to remove or replace.
- **PATTERN: "vs" without period.** Spanish RAE requires "vs." with period. Observed in S10 ("vs" without period noted in S10 audit), S11, S12, S25. Likely systemic across all 52 sections. Recommend orchestrator-level regex find/replace: `\bvs\b` → `vs.` (with backtick-aware boundary).
- **PATTERN: "auto-XXX" / "re-XXX" with hyphen.** Spanish prefix compound rule. Observed in S08 ("re-leer" flagged), S10, S12, S25. Likely systemic. Recommend orchestrator-level regex: `\b(auto|re|ex|pre|pro)-([a-záéíóúñ])` → `\1\2` (with case-by-case review).
- **PATTERN: "El AI" / "la AI" anglicism.** Observed in S25 (10×). Recommend orchestrator-level grep for `\bAI\b` across all section files and standardize on "IA" (femenine) or "asistente de IA". (S07 may have similar AI references.)
- **PATTERN: bare subtopic-ID prefixes (`SNN-TN-X ·`) in learner-facing headings.** Observed in S10, S11, S25 (and likely all Phase 1 sections). Recommend UI-layer transform to strip the prefix from rendered headings.
- **PATTERN: English tech terms used without Spanish gloss on first use.** Observed in S07 ("fail-closed", "mental model"), S08, S10, S11, S12, S25 (HITL, baseline, golden set, allowlist, contract test). Likely systemic. Recommend a course-wide glossary file (`src/lib/course/glossary.ts`) that auto-renders tooltips on first occurrence.
- **PATTERN: self-check questions ending with "…" instead of `?`.** Observed in S25 (Q2, Q4, Q5) — verify in other sections. Likely an authoring convention that was inconsistently applied.

### 9.4 Strengths to preserve
- **DEFECT-pattern starters.** Every We Do starter has an intentional bug (inverted logic, missing key, wrong threshold, hardcoded return). This is gold-standard pedagogy. Preserve across all sections.
- **Ethical spine.** "Score ≠ fraude", "auto_fraud_label=False", "fail-closed to human_review", "el humano aprueba" — uniform across all subtopics. Preserve.
- **Schema-first gating.** Schema validated before any promote. Preserve.
- **Contract test uniformity.** Mock and real adapter share the same `{model, label, score}` contract. Preserve.
- **Golden-set eval pattern.** exact match + schema rate + field F1. Preserve.
- **Circuit breaker pattern.** Simple counter + `OPEN_AFTER` threshold. Preserve.

---

## 10. Method Note (Spanish Grammar Subplan)

Per `_GRAMMAR_SUBPLAN.md`, the following research-backed methods were applied:

### 10.1 Readability formulas
- **Fernández-Huerta (1959):** `206.84 − 60·(syllables/word) − 1.02·(words/sentence)` — Spanish Flesch adaptation. Section-wide mean: **82.7** ("fácil").
- **Szigriszt-Pazos / INFLESZ:** `206.835 − 62.3·(syllables/word) − (words/sentence)` — Section-wide mean: **78.6** ("bastante fácil").
- **Words per sentence (WPS):** mean 11.3, median 11.0. (Pedagogy soft target ~15–32 for technical ES — section is on the shorter side, which is healthy.)
- **Syllables per word (SPW):** mean 1.88. (Healthy; technical Spanish prose typically 1.8–2.2.)

### 10.2 Rule-based grammar & style engine
- **LanguageTool** (`language=es`) via public HTTP API. Submitted 32,901 chars of stripped Spanish prose in 2 chunks (5s sleep between). 1,217 raw matches → 76 non-spelling (after filtering `MORFOLOGIK_RULE_ES` / `HUNSPELL_NO_SUGGEST_RULE` / `ES_WORD_COHERENCY` false positives on Python identifiers and tech jargon). Of those 76, ~24 are real actionable findings (the rest are false positives from backticks-as-apostrophes, code-identifier casing, and set-literal commas).
- Top real rule_id hits: `AGREEMENT_DET_NOUN` (10× on "El AI assist"), `PUNTO_EN_ABREVIATURAS` (8× on "vs"), `AUTO_NO_SEPARADO` (5× on "auto-XXX"), `NO_SEPARADO` (1× on "re-facturar"), `FALTA_ELEMENTO_ENTRE_VERBOS` (2× — 1 real on "evita re-facturar").

### 10.3 Pedagogical Spanish heuristics (curriculum-specific)
Applied 14 rules offline (per the subplan's table):
- Run-on (>45 w) / Long (>32 w): flagged 11 long + 2 run-ons (one of which is a false-positive caused by `**` markdown breaking the sentence splitter).
- Missing terminal `.?!`: 137 hits — 95% are bullet-style fragments (`hints` / `edgeCases` / `objectives` / `requirements` / `options`) intentionally without terminal punctuation. False-positive class.
- Missing `¿` / `¡`: 0 hits.
- Unbalanced `()[]«»""`: 0 hits (the 1 LT `ES_UNPAIRED_BRACKETS` match is inside a code snippet, false positive).
- Repeated word (`de de`): 0 hits.
- English-dominant sentence: 13 hits — most are code-adjacent prose with intentional English tech terms (LLM, schema, baseline, etc.). Borderline.
- Meta/AI/TODO leak: 1 hit — false positive (legitimate use of "borrador" = "draft" on line 246).
- Gerund pile-up (≥3): 0 hits.
- High comma density: 10 hits — mostly code-adjacent instructions with set literals. Borderline.
- Paragraph = one long sentence: 0 hits (all paragraphs have ≥2 sentences).
- Anaphoric monotony: 0 hits.
- Space-before-punct / double space: 2 hits — inside code snippets, false positives.
- **Voseo leak (added for es-PE context):** 0 hits. Section consistently uses tuteo (Peruvian standard).

### 10.4 Composite section score (0–10)
Start at 10; subtract weighted findings:
- P0 (H, blocks learning): −2.0 (issue #1 + #2 — slug + off-topic demo)
- P1 (H, repeated grammar errors): −0.6 (issue #3 × 10 occurrences / 10 = 1 class; −0.2 × 3 classes = −0.6)
- P2 (M, self-check + anglicism + long sentence): −0.3 (issues #7, #8, #9, #10, #11, #12, #13)
- P3 (L, polish): −0.1 (issues #15, #16, #17, #23, #25)
- Light penalty for FH being on the easy side (82.7 "fácil" — borderline; not extreme): −0.0 (within healthy band)
- Density-normalize by sentence count (435 sentences): no adjustment (low defect density)

**Composite: 10 − 2.0 − 0.6 − 0.3 − 0.1 = 7.0 / 10.**

### 10.5 Validation
- Nonzero prose extraction: 300 records, 5,223 words, 435 sentences. ✓
- FH in plausible range [−9, 100]: yes (min −9.0 on a 6-word `objectives` fragment with high SPW; max ~99 on short clean sentences). ✓
- Documented false-positive classes: SINGLE_CHARACTER on code identifiers (backtick-as-apostrophe), MORFOLOGIK on Python tech nouns, MISSING_TERMINAL on bullet fragments, META_LEAK on legitimate "borrador" use, ENGLISH_DOMINANT on intentional tech-term prose. ✓

### 10.6 Risks & mitigations encountered
| Risk | Mitigation applied |
|---|---|
| LT rate limit / downtime | 2 chunks × 5s sleep = 10s total; both chunks succeeded. |
| False positives on code/tech nouns | Filtered MORFOLOGIK + HUNSPELL + ES_WORD_COHERENCY; manually classified remaining 76 non-spell matches as real (24) vs false (52). |
| Template strings with `${}` | Section 25 source has no template-literal interpolations in prose fields (only in code blocks, which are excluded). |
| Sentence splitter failure on `**` markdown | Documented the false-positive 61-w "run-on" on line 45 (issue #14); verified manually that the paragraph is 3 well-formed sentences. |

---

## 11. Final Verdict

**Section 25 is pedagogically excellent (9/10) and ethically airtight, but structurally mis-identified (3/10 on meta-leak posture) due to a legacy `streamlit-dashboards` slug and a matching off-topic Streamlit simulator demo rendered at the bottom of the Theory tab.** The grammar/redaction is mostly clean (mean FH 82.7, 0 genuine run-ons, 0 voseo leaks, 0 genuine meta-leaks) with 3 systemic errors repeated across the section ("El AI assist" 10×, "vs" 8×, "auto-XXX"/"re-XXX" 7×). Total fix effort: 6–8 hours for one Fixer, dominated by the P0 slug-rename coordination.

**Top 3 fixes by impact:**
1. **P0** — Rename `id: "streamlit-dashboards"` → `id: "ai-endpoints"` (file rename + 4-file coordinated edit); replace `demos['streamlit-dashboards']` Streamlit simulator with an on-topic AI-assist contract demo in SectionView.tsx.
2. **P1** — Replace "El AI assist" → "El asistente de IA" (10 occurrences); "vs" → "vs." (8 occurrences); "auto-XXX" / "re-XXX" → single words (7 occurrences).
3. **P2** — Convert iDo.intro 40-word enumeration into a numbered list; convert self-check Q2/Q4/Q5 ellipsis-terminated stems into proper Spanish questions; "la ops" → "la operación" (3 occurrences).

---

**This is the complete Explorer report for Section 25. Ready for the Fixer prompt.**
