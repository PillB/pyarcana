# S47 — Curriculum Auditor Report (pyarcana)

**Task ID:** S47
**Agent:** Curriculum Auditor (general-purpose)
**Section audited:** 47 (Master phase · `index: 47` · `id: "opensource"`)
**Live URL:** https://pillb.github.io/pyarcana/#opensource (SPA hash route)
**Source file:** `src/lib/course/sections/s47-opensource.ts` (1,869 lines, ~124 KB)
**Audit date:** current session
**Method note:** Stanford STORM + Graph/Loop/Harness Engineering multi-pass audit; Spanish readability metrics (Fernández-Huerta, Szigriszt-Pazos/INFLESZ), structural heuristics (WPS, SPW, run-on, missing terminal punctuation, anaphoric monotony, etc.), and LanguageTool public API (`language=es`) on chunked prose. See `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md` for the full research basis. Metrics artifacts: `S47_prose.json`, `S47_prose.txt`, `S47_metrics.json`, `S47_metrics.md`, `S47_lt.json`.

---

## 1. Section Identification & Scope

| Field | Value |
|-------|-------|
| `index` | 47 |
| `id` | `"opensource"` ⚠ **mismatched with content** |
| `title` | `"MLOps: experimentos, registro y serving"` |
| `shortTitle` | `"MLOps serving"` |
| `tagline` | `"Production Data/ML Platform: experimento→servicio con gates, lineage y rollback; CF-4"` |
| `estimatedHours` | 20 |
| `level` | Master |
| `phase` | 3 (Master — sections 40–52) |
| `icon` / `accentColor` | `Server` / amber→red gradient (matches Master phase) |
| File name | `src/lib/course/sections/s47-opensource.ts` |
| Course roadmap anchor | CF-4 (Checkpoint Final 4) at S47; capstone CP-N4-B (Production Data/ML Platform) |

**Structural scope audited (all tabs of the section):**
- `jobRelevance` (1 prose paragraph)
- `learningOutcomes` (8 bullets)
- `theory` (9 cards: 1 route map + 8 subtopics T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B; each with 3 paragraphs + code + callout)
- `iDo` (1 intro + 8 demos with `description` / `code` / `why`)
- `weDo` (1 intro + 24 exercises: 3 per subtopic × 8 subtopics; each with `instruction`, `hint`, `hints[2]`, `edgeCases[3]`, `tests`, `feedback`, `starterCode`, `solutionCode`)
- `youDo` (1 portfolio project: `title`, `context`, `objectives[4]`, `requirements[8]`, `starterCode`, `portfolioNote`, `rubric[6]`)
- `selfCheck` (8 multiple-choice questions with `explanation`)
- `resources` (10 docs, 2 books, 5 courses)

**Verification of "Section 47" identity:** Confirmed via `src/lib/course/index.ts` line 51 (`import { section47 } from './sections/s47-opensource'`) and line 80 (COURSE_SECTIONS array). Live dashboard renders it as the 47th sequential card under the "Fase 3 — Master" header with the short title "MLOps serving". (Live page is a SPA: hash routing `#opensource` triggers `setActiveSectionId`. The `agent-browser read` of the SPA after hash navigation still showed the dashboard fold; the rendered content is the same TS data we audit here.)

---

## 2. Executive Summary of Quality

**Composite score: 7.0 / 10**

**Verdict.** Section 47 is a high-fidelity, contract-driven Master-phase module on MLOps gates (experiment tracking → model registry → feature parity → shadow/canary → rollback/retirement). The I Do / We Do / You Do structure is exemplary: 8 theory subtopics ↔ 8 demos ↔ 24 exercises (3 per subtopic) ↔ 8 self-check questions ↔ 1 capstone. The pedagogical spine (one synthetic case `CASO-TAC-047`, one ranker domain, four gates `repro_metrics → approve_before_prod → feature_parity → rollback_possible`) is consistent with the roadmap CF-4 anchor.

What drags the score down from a perfect 10 is concentrated in three classes:

1. **A real meta-leak / naming residue (HIGH)**: the file `s47-opensource.ts` and the `id: "opensource"` are leftover strings from a section that was clearly renamed/re-scoped to "MLOps serving". The mismatch is visible in the URL hash (`#opensource`) and in the source tree, and it is confusing to any maintainer (and to the auditor). Section 29 (`s29-mlops.ts`, `id: "mlops"`, title `"SQL avanzado y modelado relacional"`) shows the same disease in reverse — the pair suggests a content swap that left both filenames and `id`s stale.
2. **One high-impact run-on (HIGH for readability)**: the `jobRelevance` paragraph is a single 48-word sentence packing six distinct obligations into one breath.
3. **A handful of concrete Spanish grammar / typography slips (LOW–MEDIUM)** confirmed by LanguageTool: gender-agreement of postponed adjectives (`verificados` / `versionados`), `vs` without period (8 occurrences), `o` → `u` before an `o`-sound (`o over-traffic`), and a missing thin space in `MIT 6.100L`. The heuristics also flagged 19 high-comma-density sentences (mostly code-switched `Entrada: dict con ...` schema dumps — intentional, but worth a pedagogical note).

**Strengths to preserve (do not regress when fixing):**
- Triple-class exercise pattern (E1 guided repair → E2 three-route classification → E3 fail-closed decision) is one of the most disciplined scaffolding designs in the course.
- Each callout ends with the explicit verb vocabulary (`MARK_RUN_NONREPRODUCIBLE`, `INVESTIGATE_RANDOMNESS`, `INVALIDATE_COMPARISON`, …) so students always know which fail-state maps to which breach.
- Synthetic case (`CASO-TAC-047`) consistently paired with explicit "sin PII; el score no prueba fraude ni parentesco" reminders — a strong ethical-ML signal that matches the rest of the course.
- Progressive disclosure is excellent: concept paragraph → contract paragraph → case paragraph → code → callout → demo → exercises → portfolio.

---

## 3. Detailed Issue Registry

| # | Severity | Location (line) | Field | Finding | Pedagogical impact |
|---|----------|------------------|-------|---------|--------------------|
| 1 | **HIGH** | L4 (`id`), file name | section header | `id: "opensource"` and file `s47-opensource.ts` are inconsistent with the actual content (`title: "MLOps: experimentos, registro y serving"`). Section 29 mirrors the disease (`s29-mlops.ts` ↔ `id: "mlops"` ↔ title `"SQL avanzado y modelado relacional"`). | Maintenance burden; future cross-references (other sections linking to "S47 / opensource") will break or be misleading; URL hash routing exposes the mismatch to any learner who reads the URL. |
| 2 | **HIGH** | L15 | `jobRelevance` | 48-word run-on: *"En un equipo de producto en Lima o Arequipa que prioriza atención con un ranker sintético, **MLOps** es el día a día: registrar el run, comparar el candidato con baseline en el mismo holdout, promover solo con firma y aprobación, y abrir canary al 5% con rollback listo. Se promueve cuando el candidato supera el baseline con datos fijos y el serving respeta el feature contract; si el canary rompe el SLO, se revierte sin borrar evidencia."* — the *first* sentence alone is 48 words. | The opening paragraph a learner sees on the section card is the densest in the section (FH=66.6; WPS=48). It packs six operations and two conditional clauses into one sentence. First-impression cognitive load is high; learners may bounce. |
| 3 | **MEDIUM** | L188 (and L958 / L959 echo) | `callout.content` (T2-B) | Postponed adjective agreement: *"Contrato S47-T2-B: demuestra digest/card/compatibilidad **verificados**."* — LT suggests **verificada** (feminine singular, agreeing with the nearest noun *compatibilidad*). | Borderline: under the Spanish rule for adjectives modifying multiple nouns of different genders, masculine plural is acceptable. But the nearest-noun rule makes "verificada" the safer choice. Learners may copy this pattern. |
| 4 | **MEDIUM** | L646, L689 (hint, hints) | `weDo` T1-B E1/E2 hints | Same postponed-adjective pattern: *"data/code/env/split/métrica **versionados**"* — LT suggests **versionada(s)**. | Same as #3: nearest noun *métrica* is feminine singular; the adjective *versionados* (masc. plural) is technically defensible under multi-gender coordination but reads inconsistently with #3. |
| 5 | **MEDIUM** | L1390 (and the L470 iDo demo, L1500 starterCode prose echo) | `weDo` T4-A E1 hint | Disjunctive `o` before an `o`-sound: *"mode full **o over-traffic**"* — should be **u over-traffic** per Spanish phonology rule (the conjunction `o` → `u` before words starting with /o/). | Real grammar slip. Three other LT `Y_E_O_U` hits on `o hooks` / `o over-traffic` are debatable (English /h/ in *hooks*), but `o over-traffic` is unambiguous. |
| 6 | **LOW–MEDIUM** | L18, L66, L364, L509, L600, L658, L698 (8 occurrences) | various (`text`, `paragraphs`, `description`, `feedback`) | `vs` written without period (Spanish abbreviation requires `vs.` or full `versus`). LT `PUNTO_EN_ABREVIATURAS` flags 5 of them. | Minor typography slip; in heavily code-switched technical Spanish it's common, but the consistent fix is trivial. |
| 7 | **LOW** | L1862 | `resources.courses` | `MIT 6.100L` lacks the prescribed thin/no-break space before the unit (`6.100 L` or `6.100 L`). LT `SPACE_UNITIES`. | Minor; only visible in the resources footer. |
| 8 | **LOW** | L8 | `tagline` | Code-switch density: *"Production Data/ML Platform: experimento→servicio con gates, lineage y rollback; CF-4"* mixes an English headline, a Spanish gloss, English ML nouns, an arrow glyph, and a code (CF-4) — 12 tokens, 4 of which are non-Spanish. | Pedagogically intentional (signals "this is the master-level production module") but FH=94.6 ("muy fácil") is misleading because the difficulty hides in the jargon, not the syntax. Flag for awareness, not for rewrite. |
| 9 | **LOW** | L312 | `iDo.intro` | First sentence is fine; second sentence: *"Cada demo calcula el predicado del subtema con un caso local pequeño — no imprime literales precomputados."* (W=16) is fine, but the section opens with a meta-instruction ("Te muestro 8 demos...") that, while legitimately first-person teacher voice, slightly exposes the pedagogical contract. | Acceptable. The course's I Do persona does this throughout. Document for awareness. |
| 10 | **LOW** | 24 × `weDo.instruction` (L501, L535, L588, L643, L682, L738, L794, L837, L894, L951, L988, L1042, L1096, L1133, L1187, L1241, L1278, L1332, L1386, L1423, L1477, L1531, L1568, L1622) | `weDo` instructions | Template anaphora: all 24 instructions open with `S47-T-X-EN · <verb> el contrato de / tres rutas de / fallo cerrado para ...`. Verbs rotate among ~8 roots (Calcula, Compara, Modela, Filtra, Verifica, Clasifica, Audita, Decide, Simula, Extiende, Defiende, Recupera, Contrasta, Instrumenta, Aísla, Demuestra, etc.) but the rhythm is identical. | Intentional and pedagogically defensible (students internalize the contract rhythm). But for the 47th section of a 52-section course, learners may feel fatigue. Worth considering one variation in E3 (transfer) to break the pattern. |
| 11 | **LOW** | 19 sentences flagged `high_comma_density` (mostly in `weDo.instruction` and `weDo.feedback` "Entrada: dict con case_id, ...") | `weDo` instructions | Sentences like *"Entrada: dict con case_id, mode, traffic_pct, quality_delta, max_quality_drop, error_rate, max_error_rate, hooks."* read as schema dumps rather than Spanish sentences. | Intentional and arguably correct (precise specification > literary flow). But it inflates the comma-density heuristic and obscures the verb. A bulleted schema block would be cleaner. |
| 12 | **LOW** | L31 (theory card 1, paragraph 2) | `theory` intro | *"Esta sección cierra el puente desde lineage de datos (S46) hacia **lineage de modelos y serving**: experiment tracking, model registry, feature store parity y rollout con SLO."* — three English compounds ("experiment tracking", "model registry", "feature store parity") plus "rollout con SLO" in one sentence. | Acceptable for Master phase. Document for awareness. |
| 13 | **LOW** | L30 (theory card 1, paragraph 1) | `theory` intro | Glossary paragraph uses **bold:** pairs (*"**Experiment run:** params + metrics + seed + artefactos + dataset version."*) where the English term is bolded and the Spanish gloss is implicit. | This is a deliberate bilingual glossary style; matches the rest of the course. Acceptable. |
| 14 | **INFO** | L8 tagline, L28 heading | section header | The title uses `:` then comma list ("MLOps: experimentos, registro y serving"); the short title is "MLOps serving" (English). The course dashboard card shows "Sección 47 · MLOps serving · Production Data/ML Platform: experimento→servicio con gates, lineage y rollback; CF-4 · 20h · Master". | The card text is dense; a learner scanning the dashboard sees 4 languages/codes (English headline, Spanish gloss, English nouns, code CF-4) in 12 words. Defensible but borderline. |
| 15 | **INFO** | whole section | overall | Section 29 ("SQL avanzado y modelado relacional", file `s29-mlops.ts`, id `mlops`) and Section 47 ("MLOps: experimentos, registro y serving", file `s47-opensource.ts`, id `opensource`) appear to have swapped file/id labels. | Cross-section meta-leak; should be addressed holistically by the fixer (renaming two files plus their ids plus updating `index.ts` imports). |

---

## 4. Meta-Leak Report

**No developer-only prose, no TODO/FIXME/WIP, no "moved from section X", no internal AI notes** were found in the learner-facing prose. The 15 `//` substrings in the file are all inside URL literals (`https://...`), not actual TS comments. Pattern-based scans for `borrador`, `pendiente de`, `placeholder`, `rellenar`, `movido desde`, `revisar después`, etc. returned only legitimate Spanish phrases (e.g. "rellenar evidencia" = "filling in evidence"; "independiente del digest" matched the fuzzy pattern; "todo" matched the word "everything"). **No actionable meta-text leaks in the prose itself.**

The two meta-leaks that *do* exist are at the section-identity level:

### Meta-leak ML-1 (HIGH): filename / `id` / title mismatch

**Exact leaked text / location:**
- File: `src/lib/course/sections/s47-opensource.ts` (line 1 of the file path)
- Section header (L3–L7 of the file):
  ```ts
  export const section47: CourseSection = {
    id: "opensource",
    index: 47,
    title: "MLOps: experimentos, registro y serving",
    shortTitle: "MLOps serving",
    tagline: "Production Data/ML Platform: experimento→servicio con gates, lineage y rollback; CF-4",
  ```
- URL exposed to learner: `https://pillb.github.io/pyarcana/#opensource`
- Companion residue: `src/lib/course/sections/s29-mlops.ts` has `id: "mlops"` but `title: "SQL avanzado y modelado relacional"` — the inverse disease.

**Why this is a meta-leak:** The `id` and filename are authoring-layer artifacts (originally a planned "Open Source" section, presumably) that were not renamed when the section was re-scoped to MLOps. They are visible to learners via the URL hash and to maintainers via the file tree. They are not pedagogical content; they are scaffolding residue that "leaked" into the public surface.

### Meta-leak ML-2 (INFO): CF-4 / CP-N4-B codes used 9 times without in-section definition

**Locations:** L8, L57, L286, L312, L490, L495, L1678, L1679, L1741, L1766.

**Why this is borderline:** `CF-4` is the **Checkpoint Final 4** defined in `learning_roadmap_52_V3.md` line 110 as *"arquitectura desplegable, lineage, SLO, rollback y evidencia de supply chain · staging/E2E/rollback pasan y artefactos se vinculan a revisiones inmutables"*. `CP-N4-B` is the capstone project of Nivel 4 phase B. Both are legitimate course-internal vocabulary, not developer leaks. They are defined elsewhere in the course roadmap, but a learner landing on S47 without having read the roadmap will encounter undefined acronyms in the first 60 characters of the section. **Recommendation:** add a one-line glossary entry to the first theory card (the existing "Diccionario de la sección" block on L30) defining CF-4 and CP-N4-B.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity (dimension 4) — **STRONG**

| Stage | Count | Mapping | Fidelity |
|-------|-------|---------|----------|
| Theory | 9 cards (1 route map + 8 subtopics) | 1:1 with 8 sub-subtopic IDs (S47-T1-A through S47-T4-B) | ✓ |
| I Do | 8 demos | 1 demo per subtopic | ✓ |
| We Do | 24 exercises (3 per subtopic) | E1 guided, E2 independent, E3 transfer | ✓ triple-pattern |
| You Do | 1 portfolio project | Subsumes all 8 subtopics under CP-N4-B + CF-4 | ✓ |
| Self-check | 8 MCQ | 1 per subtopic | ✓ |

The triple-pattern in We Do (E1 = repair the broken boolean, E2 = classify three routes valid/invalid/missing, E3 = decide fail-closed CONTINUE/BREACH/UNCERTAIN) is one of the most rigorous scaffolding designs in the course. Each exercise has aligned `starterCode` + `solutionCode` + `output` + `assert`, and the `feedback` field explicitly names the breach verb and the missing-data verb (e.g. `MARK_RUN_NONREPRODUCIBLE` vs `INVESTIGATE_RANDOMNESS`). This is excellent contract-driven pedagogy.

### 5.2 Connective tissue and narrative flow (dimension 3) — **STRONG**

Each theory card opens with a connective anchor:
- T1-B opens: *"Habiendo fijado el rerun, el siguiente riesgo es **comparar manzanas con naranjas**."* — explicitly bridges from T1-A.
- T2-A opens: *"Con un candidato que ya ganó en holdout, el **registry** exige otra capa de gobernanza."* — bridges from T1-B.
- T2-B opens: *"El registry no solo guarda un pickle..."* — bridges from T2-A.
- T3-A opens: *"Habiendo registrado el modelo, el riesgo clásico de production es el **training-serving skew**..."* — bridges from T2-B.
- T3-B opens: *"Con features alineadas, el serving aún puede fallar por **latencia y capacidad**."* — bridges from T3-A.
- T4-A opens: *"El modelo ya sirve con SLO; ahora el tráfico se abre con cuidado."* — bridges from T3-B.
- T4-B opens: *"Si el canary falla — o si una versión envejeció — el camino CF-4 exige **rollback**..."* — bridges from T4-A.

This is **exemplary narrative tissue** — every subtopic names the previous step's success and the next step's risk. The course's early-section guidance on connective tissue is honored.

### 5.3 Cognitive load and progressive disclosure (dimension 5) — **GOOD with caveats**

The theory disclosure pattern (concept → contract → case → code → callout → demo → exercises) is excellent. However:

- The `jobRelevance` paragraph (L15) is the highest-load text in the section and is the **first** thing learners see on the section card. It should be split (see Issue #2).
- The 24 We Do instructions are templated to near-identical rhythm (Issue #10). The first time a learner reads E1+E2+E3 for T1-A, the rhythm is helpful; by T4-B-E3, it's fatiguing.
- The 19 `high_comma_density` sentences (Issue #11) are mostly the schema-dump "Entrada: dict con case_id, ... , hooks" lines. They are precise but read as JSON, not Spanish. A bulleted schema block in Markdown would be more scannable.

### 5.4 Exercise and exam quality and alignment (dimension 6) — **STRONG**

- Each E1 starter has a deliberately **inverted** boolean (`>` instead of `≤`, `not approved or stage==production` instead of `approved and stage==staging`, etc.). The student must identify and flip the comparator. Good contract-repair exercise.
- Each E2 starter re-uses the inverted E1 logic but adds the missing-field branch. The student must preserve the missing-field check while fixing the domain logic. Good progression.
- Each E3 starter **silently swallows missing as CONTINUE** (the worst fail-open pattern). The student must route missing to the human-review verb (`INVESTIGATE_RANDOMNESS`, `RESTORE_LINEAGE`, `REQUEST_MODEL_APPROVAL`, etc.). This is the key fail-closed lesson and it's taught 8 times in 8 different domains — excellent reinforcement.
- Self-check questions probe the right concepts (reproducibility evidence, fail-closed verbs, gate semantics, synthetic data ethics, registry without approval, feature skew, canary over-traffic, model card completeness). Distractors are well-designed (e.g. "borrar el trace para reducir ruido" as a wrong answer to the rollback question — directly names the failure mode the theory warns about).

### 5.5 Consistency with the overall roadmap (dimension 7) — **STRONG**

- The section is anchored to CF-4 (Checkpoint Final 4 at S47) and CP-N4-B (Production Data/ML Platform capstone), both defined in `learning_roadmap_52_V3.md` L110 and L648.
- The theory explicitly bridges from S46 (lineage de datos → lineage de modelos y serving).
- The portfolio project's `rubric` weights (`Correctitud del contrato y gate 25%`, `Pruebas normal/breach/uncertain y recuperación 20%`, `Seguridad/privacidad/least privilege 15%`, `Reproducibilidad/lineage/evidencia 15%`, `Operación: SLO/observabilidad/rollback 15%`, `Comunicación de trade-offs y límites 10%`) match the course-wide rubric template used in other Master-phase sections.
- The synthetic case identifier `CASO-TAC-047` follows the course's case-id convention (CASO-<CITY>-<SECTION>). The city rotates (Tacna here; Lima, Arequipa in `jobRelevance`) — consistent with the course's Peruvian geography motif.

### 5.6 Comparison with best-in-class external materials (dimension 8)

| External reference | How S47 compares |
|--------------------|-------------------|
| Google MLOps whitepaper (linked in resources) | S47 covers the same three maturity levels (tracking, registry, serving with SLO/rollback) but in stdlib-only Python — a deliberate didactic simplification that the Google paper does not attempt. |
| MLflow docs (linked) | S47's `tracking_reproducibility.py` / `signatures_stages_approvals.py` contracts mirror MLflow's Tracking + Model Registry APIs but model them as plain predicates. Excellent conceptual primer. |
| SRE Book release engineering (linked) | S47's canary/rollback contract is faithful to the SRE book's progressive-rollout + error-budget pattern, including the `traffic_pct ≤ 10%` rule of thumb. |
| Coursera MLOps (linked) | S47 is denser and more contract-driven than typical Coursera modules; less video, more code. Appropriate for the course's self-paced, evidence-first philosophy. |
| Harvard CS50P / MIT 6.100L (linked) | These are general-Python references, not MLOps-specific. They are appropriate as "contratos verificables" / "tests reproducibles" primers but somewhat tangential to S47's core. |

**Verdict:** the resource list is well-curated and current (KServe, Feast, Model Cards, NIST AI RMF all appear). S47 holds its own against the linked materials in terms of conceptual coverage; its unique value is the contract-predicate framing that turns each MLOps gate into a Python boolean.

### 5.7 Other domain issues (dimension 9)

- **Accessibility:** the section relies heavily on inline code spans (e.g. `MARK_RUN_NONREPRODUCIBLE`, `service_feature_version`) which screen readers will spell out character-by-character. The glossary block on L30 mitigates this for the top-level vocabulary but not for the 30+ uppercase breach verbs used throughout.
- **Motivation:** the `jobRelevance` paragraph is the only explicit "why this matters in a Peruvian job market" hook. It's strong but suffers from the run-on (Issue #2). The rest of the section stays technical.
- **Ethical framing:** consistent with the course's anti-PII / anti-fraud-inference stance. Each theory case ends with "Sin PII; el score no prueba fraude ni parentesco" or equivalent. Excellent.

---

## 6. Grammatical Improvements and Rewriting Report (paragraph by paragraph, tab by tab)

Below, the **Before** is the verbatim text from the source, and the **After** is a proposed rewrite. Only paragraphs/sentences with a real issue are rewritten; clean paragraphs are listed as "OK" with their metrics.

### 6.1 Section header / metadata

**`tagline` (L8) — Before**
```
Production Data/ML Platform: experimento→servicio con gates, lineage y rollback; CF-4
```
**`tagline` (L8) — After (proposed)**
```
Production Data/ML Platform: del experimento al servicio con gates, lineage y rollback (CF-4)
```
Rationale: replace the bare arrow glyph (which screen readers pronounce awkwardly) with the Spanish connective "del … al"; wrap CF-4 in parentheses to signal it's a code; keep the English headline to preserve the master-phase signal.

FH before: 94.6 (W=12) | FH after: ~88 (W=13) — both "muy fácil".

**`jobRelevance` (L15) — Before**
```
En un equipo de producto en Lima o Arequipa que prioriza atención con un ranker sintético, **MLOps** es el día a día: registrar el run, comparar el candidato con baseline en el mismo holdout, promover solo con firma y aprobación, y abrir canary al 5% con rollback listo. Se promueve cuando el candidato supera el baseline con datos fijos y el serving respeta el feature contract; si el canary rompe el SLO, se revierte sin borrar evidencia.
```
**`jobRelevance` (L15) — After (proposed)**
```
En un equipo de producto en Lima o Arequipa que prioriza atención con un ranker sintético, **MLOps** es el día a día. El ciclo es: registrar el run, comparar el candidato con el baseline en el mismo holdout, promover solo con firma y aprobación, y abrir canary al 5% con rollback listo. La promoción ocurre cuando el candidato supera al baseline con datos fijos y el serving respeta el feature contract. Si el canary rompe el SLO, se revierte sin borrar evidencia.
```
Rationale: split the 48-word run-on into four sentences (15 / 24 / 19 / 9 words). The first sentence now states the context; the second lists the cycle as a colon-introduced list; the third states the promotion criterion; the fourth states the rollback trigger. FH before: 66.6 (run-on) | FH after (sentence-level): ~80–88 (normal).

### 6.2 Theory tab

**Theory card 1, paragraph 1 (L30) — glossary block.** OK as-is; the bilingual glossary is the section's deliberate style. FH per item: 70–95 (very easy, intentionally). No rewrite.

**Theory card 1, paragraph 2 (L31) — Before**
```
Esta sección cierra el puente desde lineage de datos (S46) hacia **lineage de modelos y serving**: experiment tracking, model registry, feature store parity y rollout con SLO. Los demos usan **stdlib** al estilo MLflow/registry (sin cluster GPU ni servicios externos). El caso `CASO-TAC-047` (priorización sintética de atención en Tacna) no entrena en GPU ni sube modelos reales.
```
**After (proposed)**
```
Esta sección cierra el puente desde el lineage de datos (S46) hacia el **lineage de modelos y serving**: experiment tracking, model registry, feature store parity y rollout con SLO. Los demos usan **stdlib** al estilo MLflow/registry (sin cluster GPU ni servicios externos). El caso `CASO-TAC-047` (priorización sintética de atención en Tacna) no entrena en GPU ni sube modelos reales.
```
Rationale: add the definite article "el" before "lineage de datos" and "lineage de modelos" (Spanish grammar requires the article before a noun phrase; "lineage" is treated as a masculine Spanish noun here). Minor grammar polish. FH before/after: ~93 (very easy).

**Theory card 1, paragraph 3 (L32) — Before**
```
Producto incremental (una versión del ranker sintético en Tacna recorre toda la sección): **T1** deja un run comparable y un candidato que gana en holdout → **T2** lo registra con firma, card y approve en Staging → **T3** exige paridad batch/online y p95 con fallback → **T4** abre canary al 5% y, si rompe, rollback a last-good con audit. Error de promoción en cualquier tramo: métrica no reproducible, `stage=production` sin approve, leakage train/serve o p95 fuera de SLO sin fallback.
```
**After (proposed)** — OK as-is; the arrow chain is a deliberate visual scaffold and reads cleanly. FH per sentence: 65–80.

**Theory card 1, paragraph 4 (L33) — Before**
```
Orden de lectura y lab: T1 runs/métricas → T2 registry/cards → T3 features online/batch → T4 traffic y rollback. Teoría medible, demos con helpers y laboratorio con un defecto de promoción por ejercicio. Stack didáctico: **stdlib** que modela contratos al estilo MLflow/registry sin cluster GPU ni servicios externos obligatorios.
```
**After (proposed)** — OK. FH 78–95.

**Theory T1-A, paragraph 1 (L64) — Before**
```
Tracking registra **parámetros, métricas, seed, artefactos y versión de dataset**. Reproducibilidad no es «el dashboard se ve bien»: es poder **re-ejecutar el run** con el mismo seed y params y obtener la métrica dentro de una tolerancia declarada. Sin seed presente y sin params no vacíos, el número es anécdota, no evidencia de promote.
```
**After (proposed)** — OK. FH 75–90. Clean.

**Theory T1-A, paragraph 2 (L65) — Before**
```
Contrato de reproducibilidad. Entrada: `seed`, `params`, `metric`, `rerun_metric`, `tolerance`. Salida: `PASS` solo si el seed está presente, hay params y `|metric − rerun| ≤ tolerance`. Error local: delta fuera de tolerancia o params vacíos → `MARK_RUN_NONREPRODUCIBLE`. Si falta `tolerance` → `INVESTIGATE_RANDOMNESS` (incertidumbre, no breach silencioso).
```
**After (proposed)** — OK. This is the "Contrato de X" template that repeats across all 8 theory cards. Intentional. FH 65–80.

**Theory T1-A, paragraph 3 (L66) — Before**
```
En `CASO-TAC-047-1A` (priorización sintética en Tacna) el run con seed fijo, `depth=4` y f1 0.81 vs rerun 0.805 (tol 0.01) es reproducible. Un run con params vacíos o delta 0.16 se marca no reproducible aunque el score «parezca» alto. Sin PII; el score no prueba fraude ni parentesco.
```
**After (proposed)**
```
En `CASO-TAC-047-1A` (priorización sintética en Tacna) el run con seed fijo, `depth=4` y f1 0.81 vs. rerun 0.805 (tol 0.01) es reproducible. Un run con params vacíos o delta 0.16 se marca no reproducible aunque el score «parezca» alto. Sin PII; el score no prueba fraude ni parentesco.
```
Rationale: `vs` → `vs.` (Issue #6). FH unchanged.

**Theory T1-B, paragraph 1 (L94) — Before**
```
Habiendo fijado el rerun, el siguiente riesgo es **comparar manzanas con naranjas**. Un run solo es comparable si fija tres anclas de lineage: versión de datos, commit de código y entorno bloqueado (lockfile/imagen). Además, la **definición de métrica** y el **split** (holdout, no el train) deben ser idénticos entre baseline y candidato; si no, un F1=0.90 en train no es evidencia de promote.
```
**After (proposed)** — OK. Strong opening, clear contract.

**Theory T2-A, paragraph 1 (L131) — Before**
```
Con un candidato que ya ganó en holdout, el **registry** exige otra capa de gobernanza. Una firma fija nombres y tipos de entrada/salida (el **contrato del servicio**, no un dict inventado por el run); los stages (None → Staging → Production) son estados gobernados, no etiquetas cosméticas. La aprobación es **independiente del digest**: un hash correcto sin `approved=True` no autoriza Production.
```
**After (proposed)** — OK.

**Theory T2-B, paragraph 1 (L165) — Before**
```
El registry no solo guarda un pickle: el artefacto necesita **digest** (p. ej. `sha256:…`), la **misma versión de features** en train y serving, y una **model card** con uso, límites, métricas y riesgos. Sin card, el equipo de producto no sabe cuándo el score no aplica; con skew de features, el modelo «funciona» sobre otra realidad.
```
**After (proposed)** — OK.

**Theory T3-A, paragraph 1 (L195) — Before**
```
Habiendo registrado el modelo, el riesgo clásico de production es el **training-serving skew**: el batch de entrenamiento calcula features de un modo y el path online de otro. Batch y online deben compartir transformación o contract tests; el leakage (usar información del futuro o del label) invalida el servicio aunque el F1 de laboratorio sea alto.
```
**After (proposed)** — OK.

**Theory T3-B, paragraph 1 (L223) — Before**
```
Con features alineadas, el serving aún puede fallar por **latencia y capacidad**. Se presupuesta p95/p99, se acota el batch size y se exige un fallback **probado** (reglas o modelo previo menos capaz). Un fallback «none» o no ensayado convierte el timeout en caída silenciosa del producto.
```
**After (proposed)** — OK.

**Theory T4-A, paragraph 1 (L251) — Before**
```
El modelo ya sirve con SLO; ahora el tráfico se abre con cuidado. **Shadow** observa sin decidir; **canary** recibe un presupuesto de tráfico (p. ej. ≤ 10%) y los monitoring hooks comparan calidad, drift y errores antes de promover. Un mode `full` al 100% sin hooks no es canary: es un deploy a ciegas.
```
**After (proposed)** — OK.

**Theory T4-B, paragraph 1 (L286) — Before**
```
Si el canary falla — o si una versión envejeció — el camino CF-4 exige **rollback al last-known-good** con features compatibles y **retirement** auditado: se bloquea uso nuevo, se conserva evidencia y se registra quién retiró qué. Borrar el trace para «reducir ruido» destruye el gate de auditoría.
```
**After (proposed)** — OK. (The em-dash spacing is correct Spanish typography.)

**Callout contents (L57, L87, L124, L158, L188, L216, L244, L279, L307):**

- L87, L124, L158, L216, L244, L279, L307 — OK.
- **L57** — OK.
- **L188 — Before**
  ```
  Contrato S47-T2-B: demuestra digest/card/compatibilidad verificados. Falla cerrada con `REJECT_MODEL_ARTIFACT` y deriva incertidumbre mediante `COMPLETE_MODEL_CARD`.
  ```
  **L188 — After (proposed)**
  ```
  Contrato S47-T2-B: demuestra digest/card/compatibilidad verificadas. Falla cerrada con `REJECT_MODEL_ARTIFACT` y deriva incertidumbre mediante `COMPLETE_MODEL_CARD`.
  ```
  Rationale: postponed adjective agreement — the nearest noun *compatibilidad* is feminine singular, and *card* (English loanword, "tarjeta" in Spanish, feminine) is also feminine; *digest* is masculine but it's the first in the list. Use feminine plural **verificadas** to agree with the feminine head nouns *card/compatibilidad*. Alternatively, keep the masculine plural **verificados** under the multi-gender coordination rule — this is a judgment call. LT suggests singular "verificada".

### 6.3 I Do tab

**`iDo.intro` (L312) — Before**
```
Te muestro 8 demos de S47 (MLOps: experimentos, registro y serving) alineadas a CP-N4-B + CF-4. Cada demo calcula el predicado del subtema con un caso local pequeño — no imprime literales precomputados.
```
**After (proposed)** — OK. (First-person teacher voice is the course's deliberate style.)

**`iDo.steps[].description` (L318, L340, L364, L387, L409, L429, L449, L476):**

- L318, L387, L409, L429, L449, L476 — OK.
- **L340 — Before** `Demo: lineage completo y comparación candidato > baseline` — OK (the `>` here is a math operator, not a delimiter; my heuristic's false positive).
- **L364 — Before** `Demo: firma vs SERVICE_SIG + staging + approved`
  **L364 — After** `Demo: firma vs. SERVICE_SIG + staging + approved`
  Rationale: `vs` → `vs.` (Issue #6).

**`iDo.steps[].why` (L334, L358, L381, L403, L423, L443, L470, L490):**

- L334, L381, L403, L423, L443, L490 — OK.
- **L358 — Before**
  ```
  Muestra por qué un score alto en train con code=latest no valida promote: sin lineage completo la comparación se invalida aunque candidate > baseline en el papel.
  ```
  **After (proposed)** — OK. (The `>` is a math operator; FH=88.2, W=27 — within tolerance.)
- **L470 — Before**
  ```
  Modela presupuesto de tráfico, caída de calidad y hooks: mode full al 100%, quality_delta fuera de presupuesto o hooks apagados detienen el canary aunque el digest sea válido.
  ```
  **After (proposed)** — OK. (W=29; FH=86.2; acceptable.)

### 6.4 We Do tab

**`weDo.intro` (L495) — Before**
```
S47 · Laboratorio Production Data/ML Platform con CF-4: 24 retos locales. E1 repara una operación de dominio, E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed con ocho fixtures peruanos sintéticos distintos.
```
**After (proposed)** — OK. (W=27; FH=89.2.)

**`weDo.steps[].instruction` (24 of them):** The 24 instructions follow the template documented in Issue #10. Below are the specific lines with concrete fixable issues:

- **L501 (E1 T1-A) — OK.**
- **L535 (E2 T1-A) — OK.**
- **L588 (E3 T1-A) — Before**
  ```
  S47-T1-A-E3 · Simula fallo cerrado para `tracking y reproducibilidad` con tres fixtures distintos. `CASO-TAC-047-1A` debe continuar, el adverso debe devolver `MARK_RUN_NONREPRODUCIBLE` y la ausencia de `tolerance` debe devolver `INVESTIGATE_RANDOMNESS`. El starter continúa tanto ante incertidumbre como con un predicado equivocado: corrige ambas ramas sin ocultar ni rellenar evidencia.
  ```
  **After (proposed)** — OK. (W=31; FH=53.3 — within tolerance; the dense code-switched identifiers drive the FH down but the structure is clear.)
- **L646 (E1 T1-B) — OK** (the `versionados` issue is in the hint, not the instruction).
- **L685 (E2 T1-B) — Before**
  ```
  S47-T1-B-E2 · Verifica tres rutas de `data/code/env lineage y comparación`: fixture válido, fixture adverso y registro sin `baseline`. Entrada: dict con case_id, data, code, env, split, metric_definition, candidate, baseline. Salidas exactas: `PASS`, `INVALIDATE_COMPARISON`, `MISSING:baseline`. El starter contiene el mismo criterio invertido visto en E1; modifica solo la decisión de dominio y conserva la validación de campos.
  ```
  **After (proposed)** — OK. (W=35; FH=63.1. The schema-dump sentence is intentional.)
- **L741, L797, L840, L897, L991, L1045, L1099, L1136, L1190, L1244, L1281, L1335, L1389, L1426, L1480, L1534, L1571, L1625** — Same template; the only systematically fixable issue is `vs` → `vs.` (Issue #6) which doesn't appear in these instructions.

**`weDo.steps[].hint` (24 of them):**

- **L502, L536, L593, L647, L686, L742, L798, L841, L898, L956, L992, L1046, L1100, L1137, L1191, L1245, L1282, L1336, L1390, L1427, L1481, L1535, L1572, L1626** — Most are OK. The two with real issues:

- **L647 — Before**
  ```
  El DEFECT niega el data o exige candidate ≤ baseline: invierte a lineage completo + versionado (no latest/train/unknown) + candidate > baseline.
  ```
  **L647 — After (proposed)** — OK. (LT flagged `El DEFECT` for `EL_TILDE` but this is a false positive — "DEFECT" is an English code identifier and the masculine article "El" without tilde is correct.)
- **L1390 — Before**
  ```
  El DEFECT aprueba mode full o over-traffic: exige mode shadow/canary, traffic≤10%, quality_delta ≥ −max_drop, error≤max y hooks=True.
  ```
  **L1390 — After (proposed)**
  ```
  El DEFECT aprueba mode full u over-traffic: exige mode shadow/canary, traffic≤10%, quality_delta ≥ −max_drop, error≤max y hooks=True.
  ```
  Rationale: `o` → `u` before the /o/ sound of "over-traffic" (Issue #5).

**`weDo.steps[].hints[]` (48 of them, 2 per exercise):**

- **L504–505, L541–542, L594–595, L649–650, L687–688, L743–744, L799–800, L842–843, L899–900, L957–958, L993–994, L1047–1048, L1101–1102, L1138–1139, L1192–1193, L1246–1247, L1283–1284, L1337–1338, L1391–1392, L1428–1429, L1482–1483, L1536–1537, L1573–1574, L1627–1628** — Most are OK. The two with issues:

- **L689 — Before**
  ```
  Después aplica la regla de S47-T1-B: data/code/env/split/métrica versionados y candidato mejor. El fixture adverso debe fallar por contenido, no por schema.
  ```
  **L689 — After (proposed)**
  ```
  Después aplica la regla de S47-T1-B: data, code, env, split y métrica versionados, y candidato mejor. El fixture adverso debe fallar por contenido, no por schema.
  ```
  Rationale: replace the slash-list `data/code/env/split/métrica` with a comma-and list (clearer Spanish typography) and add a comma before the second `y` to disambiguate. The postponed adjective `versionados` is acceptable under multi-gender coordination but could also be `versionadas` if interpreted as agreeing with the nearest feminine noun *métrica*.

**`weDo.steps[].edgeCases[]` (72 of them, 3 per exercise):** All follow the template `["falta `field` → MISSING / VERB", "adverso: … → VERB", "CASO-TAC-047-X es sintético (sin PII)"]`. OK.

**`weDo.steps[].tests` (24 of them):** All OK; FH 75–95.

**`weDo.steps[].feedback` (24 of them):**

- **L509 — Before**
  ```
  S47-T1-A-E1: la dirección del comparador es ≤ tolerancia (no >). Di qué delta produce PASS en 0.81 vs 0.805 y por qué seed presente + params no vacíos son parte del contrato.
  ```
  **L509 — After**
  ```
  S47-T1-A-E1: la dirección del comparador es ≤ tolerancia (no >). Di qué delta produce PASS en 0.81 vs. 0.805 y por qué seed presente + params no vacíos son parte del contrato.
  ```
  Rationale: `vs` → `vs.` (Issue #6).
- **L654 — Before**
  ```
  S47-T1-B-E1: la comparación exige lineage completo y candidate > baseline. ¿Qué campo del adverso (code=latest, split=train) invalida primero?
  ```
  **L654 — After** — OK. (The `>` is a math operator.)
- **L693 — Before**
  ```
  S47-T1-B-E2: missing de baseline es RESTORE_LINEAGE, no INVALIDATE. Di por qué un candidate 0.90 con split=train sigue siendo INVALIDATE.
  ```
  **L693 — After** — OK.
- **L749, L805, L848, L905, L962, L999, L1053, L1107, L1144, L1198, L1252, L1289, L1343, L1397, L1434, L1488, L1542, L1579, L1633** — Same template; the `vs` issue doesn't appear here, but `vs.` should be applied where present.

### 6.5 You Do tab

**`youDo.title` (L1678) — OK.**

**`youDo.context` (L1679) — Before**
```
Production Data/ML Platform con CF-4. Trabaja sobre un modelo sintético de priorización de atención para una organización ficticia en Tacna. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida: run comparable, modelo registrado, deployment canary y decisión auditable. El gate se bloquea si un lineage incompleto, una firma incompatible, una regresión o un fallback ausente impiden la promoción.
```
**After (proposed)** — OK. (FH 88–95 across sentences.)

**`youDo.objectives[4]` (L1681–1684) — OK** (bullet items without terminal period, which is the bullet convention; not a real issue).

**`youDo.requirements[8]` (L1687–1694) — OK.**

**`youDo.portfolioNote` (L1741) — Before**
```
Evidencia de CP-N4-B + CF-4 · modelo promovible y reversible: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. Parte del scaffold con predicados reales; no pases a READY solo flipando flags sin evidencia.
```
**After (proposed)** — OK. ("flipando flags" is colloquial Peruvian Spanish — fits the course's voice.)

**`youDo.rubric[6]` (L1743–1748) — OK.**

### 6.6 Self Check tab

**`selfCheck.questions[8]` (L1753–1801):**

- **Q1 (L1753) — OK.** Question text: "¿Qué evidencia permite aprobar tracking y reproducibilidad en CASO-TAC-047?" — properly opens with `¿`. Options are well-designed distractors.
- **Q2 (L1759) — OK.**
- **Q3 (L1765) — OK.**
- **Q4 (L1771) — OK.**
- **Q5 (L1777) — OK.**
- **Q6 (L1783) — OK.**
- **Q7 (L1789) — OK.**
- **Q8 (L1795) — OK.**

All 8 questions correctly pair `¿…?` and have well-differentiated distractors. FH 44–85 (the question stems are slightly harder than the explanations because of code-switched nouns).

### 6.7 Resources tab

**`resources.docs[10]` (L1804–1854):**

- All `note` strings are short Spanish glosses (e.g. "Tracking, registry y serving"). OK.
- **L1862 — Before** `{ label: "MIT 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables" }`
  **L1862 — After** `{ label: "MIT 6.100 L", ... note: "Contratos verificables" }` — Issue #7: insert a (thin) space between the course number and the suffix letter `L`.

**`resources.books[2]` (L1857–1858) — OK.**

**`resources.courses[5]` (L1861–1865) — OK** except for L1862 noted above.

---

## 7. Proposed GitHub-style Diffs (one per issue or logical group)

> The Diff Architect sub-agent produced these as ready-to-apply patches against `src/lib/course/sections/s47-opensource.ts` (and `src/lib/course/index.ts` for Issue #1). **Do not apply in this audit pass.**

### Diff 1 (Issue #1, HIGH) — Rename file + `id` to match content

This is a two-file change because the import path lives in `index.ts`.

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -48,7 +48,7 @@
 import { section46 } from './sections/s46-gpu-computing'
-import { section47 } from './sections/s47-opensource'
+import { section47 } from './sections/s47-mlops-serving'
 import { section48 } from './sections/s48-ai-governance'

--- /dev/null
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'

 export const section47: CourseSection = {
-  id: "opensource",
+  id: "mlops-serving",
   index: 47,
   title: "MLOps: experimentos, registro y serving",
```
(Associated: `git mv src/lib/course/sections/s47-opensource.ts src/lib/course/sections/s47-mlops-serving.ts`. Note: any learners who bookmarked `#opensource` will need a redirect or a note in the section header. The same operation should be done for `s29-mlops.ts` → `s29-sql-avanzado.ts` to fix the inverse disease.)

### Diff 2 (Issue #2, HIGH) — Split the `jobRelevance` run-on

```diff
--- a/src/lib/course/sections/s47-mlops-serving.ts
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@ -14,7 +14,9 @@
   jobRelevance:
-    "En un equipo de producto en Lima o Arequipa que prioriza atención con un ranker sintético, **MLOps** es el día a día: registrar el run, comparar el candidato con baseline en el mismo holdout, promover solo con firma y aprobación, y abrir canary al 5% con rollback listo. Se promueve cuando el candidato supera el baseline con datos fijos y el serving respeta el feature contract; si el canary rompe el SLO, se revierte sin borrar evidencia.",
+    "En un equipo de producto en Lima o Arequipa que prioriza atención con un ranker sintético, **MLOps** es el día a día. El ciclo es: registrar el run, comparar el candidato con el baseline en el mismo holdout, promover solo con firma y aprobación, y abrir canary al 5% con rollback listo. La promoción ocurre cuando el candidato supera al baseline con datos fijos y el serving respeta el feature contract. Si el canary rompe el SLO, se revierte sin borrar evidencia.",
```

### Diff 3 (Issue #3, MEDIUM) — Postponed adjective agreement in T2-B callout

```diff
--- a/src/lib/course/sections/s47-mlops-serving.ts
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@ -185,7 +185,7 @@
         content:
-          "Contrato S47-T2-B: demuestra digest/card/compatibilidad verificados. Falla cerrada con `REJECT_MODEL_ARTIFACT` y deriva incertidumbre mediante `COMPLETE_MODEL_CARD`.",
+          "Contrato S47-T2-B: demuestra digest/card/compatibilidad verificadas. Falla cerrada con `REJECT_MODEL_ARTIFACT` y deriva incertidumbre mediante `COMPLETE_MODEL_CARD`.",
```

### Diff 4 (Issue #4, MEDIUM) — Postponed adjective + slash-list in T1-B hints

```diff
--- a/src/lib/course/sections/s47-mlops-serving.ts
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@ -686,7 +686,7 @@
         hints: [
           "Primero se calcula `missing`; ningún acceso a baseline debe ocurrir antes de esa rama.",
-          "Después aplica la regla de S47-T1-B: data/code/env/split/métrica versionados y candidato mejor. El fixture adverso debe fallar por contenido, no por schema.",
+          "Después aplica la regla de S47-T1-B: data, code, env, split y métrica versionados, y candidato mejor. El fixture adverso debe fallar por contenido, no por schema.",
         ],
```

### Diff 5 (Issue #5, MEDIUM) — `o` → `u` before "over-traffic"

```diff
--- a/src/lib/course/sections/s47-mlops-serving.ts
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@ -1387,7 +1387,7 @@
         kind: "guided",
-        instruction: "S47-T4-A-E1 · Audita el contrato de `shadow/canary y monitoring hooks` sobre `CASO-TAC-047-4A`. La entrada es el dict completo del starter; la operación debe demostrar tráfico limitado, quality/error gates y hooks. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S47-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `STOP_CANARY` en E2.",
-        hint: "El DEFECT aprueba mode full o over-traffic: exige mode shadow/canary, traffic≤10%, quality_delta ≥ −max_drop, error≤max y hooks=True.",
+        instruction: "S47-T4-A-E1 · Audita el contrato de `shadow/canary y monitoring hooks` sobre `CASO-TAC-047-4A`. La entrada es el dict completo del starter; la operación debe demostrar tráfico limitado, quality/error gates y hooks. Reemplaza la expresión booleana defectuosa, no los datos ni el assert. Salida exacta: `S47-T4-A PASS`; la misma operación sobre el fixture adverso debe activar `STOP_CANARY` en E2.",
+        hint: "El DEFECT aprueba mode full u over-traffic: exige mode shadow/canary, traffic≤10%, quality_delta ≥ −max_drop, error≤max y hooks=True.",
```

### Diff 6 (Issue #6, LOW–MEDIUM) — `vs` → `vs.` (8 occurrences)

Apply with `replace_all` for the 8 prose occurrences (do **not** replace inside URL strings). The 8 prose lines are L18, L66, L364, L509, L600, L658, L698 (and one more in `feedback` at L509 already covered). A safe `sed`-style replacement would target only the `vs` tokens that are followed by whitespace and a non-`/` character:

```diff
--- a/src/lib/course/sections/s47-mlops-serving.ts
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@ -15,7 +15,7 @@
-{ text: "Comparar baseline vs candidato solo cuando data, code, env, split y la definición de métrica coinciden" },
+{ text: "Comparar baseline vs. candidato solo cuando data, code, env, split y la definición de métrica coinciden" },
@@ -63,7 +63,7 @@
-"En `CASO-TAC-047-1A` (priorización sintética en Tacna) el run con seed fijo, `depth=4` y f1 0.81 vs rerun 0.805 (tol 0.01) es reproducible. Un run con params vacíos o delta 0.16 se marca no reproducible aunque el score «parezca» alto. Sin PII; el score no prueba fraude ni parentesco.",
+"En `CASO-TAC-047-1A` (priorización sintética en Tacna) el run con seed fijo, `depth=4` y f1 0.81 vs. rerun 0.805 (tol 0.01) es reproducible. Un run con params vacíos o delta 0.16 se marca no reproducible aunque el score «parezca» alto. Sin PII; el score no prueba fraude ni parentesco.",
@@ -361,7 +361,7 @@
-        description: "Demo: firma vs SERVICE_SIG + staging + approved",
+        description: "Demo: firma vs. SERVICE_SIG + staging + approved",
@@ -506,7 +506,7 @@
-        feedback: "S47-T1-A-E1: la dirección del comparador es ≤ tolerancia (no >). Di qué delta produce PASS en 0.81 vs 0.805 y por qué seed presente + params no vacíos son parte del contrato.",
+        feedback: "S47-T1-A-E1: la dirección del comparador es ≤ tolerancia (no >). Di qué delta produce PASS en 0.81 vs. 0.805 y por qué seed presente + params no vacíos son parte del contrato.",
```
(Remaining occurrences on L600, L658, L698 follow the same pattern.)

### Diff 7 (Issue #7, LOW) — Thin space in `MIT 6.100L`

```diff
--- a/src/lib/course/sections/s47-mlops-serving.ts
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@ -1859,7 +1859,7 @@
-      { label: "MIT 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables" },
+      { label: "MIT 6.100 L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables" },
```

### Diff 8 (Issue ML-2, INFO) — Define CF-4 / CP-N4-B in the section glossary

```diff
--- a/src/lib/course/sections/s47-mlops-serving.ts
+++ b/src/lib/course/sections/s47-mlops-serving.ts
@@ -27,7 +27,7 @@
       heading: "Ruta de S47: MLOps: experimentos, registro y serving",
       paragraphs: [
-        "**Diccionario de la sección** (léelo antes de T1). **Experiment run:** params + metrics + seed + artefactos + dataset version. **Lineage:** data/code/env que produjo el run. **Model registry stage:** None → Staging → Production (con approve). **Model card:** límites, intended use y riesgos. **Feature consistency:** mismas firmas train/serve. **Shadow/canary:** tráfico gradual sin sustituir todo. **Fallback:** modelo o regla previa si p95/errores fallan. **Retirement:** retirar versión con audit, no borrar evidencia.",
+        "**Diccionario de la sección** (léelo antes de T1). **CF-4:** Checkpoint Final 4 (S47) — arquitectura desplegable, lineage, SLO, rollback y evidencia de supply chain. **CP-N4-B:** capstone Production Data/ML Platform de Nivel 4. **Experiment run:** params + metrics + seed + artefactos + dataset version. **Lineage:** data/code/env que produjo el run. **Model registry stage:** None → Staging → Production (con approve). **Model card:** límites, intended use y riesgos. **Feature consistency:** mismas firmas train/serve. **Shadow/canary:** tráfico gradual sin sustituir todo. **Fallback:** modelo o regla previa si p95/errores fallan. **Retirement:** retirar versión con audit, no borrar evidencia.",
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 1 | **#1** Rename file + `id` (Diff 1) | low (mechanical) | high (removes meta-leak; requires coordination with the parallel s29 rename) |
| 2 | **#2** Split `jobRelevance` run-on (Diff 2) | trivial | high (first-impression paragraph) |
| 3 | **#5** `o` → `u` before "over-traffic" (Diff 5) | trivial | medium (real grammar slip) |
| 4 | **#3, #4** Postponed adjective agreement (Diffs 3, 4) | trivial | medium (grammar polish) |
| 5 | **#6** `vs` → `vs.` (Diff 6) | low (search-replace) | low–medium (typography) |
| 6 | **#7** Thin space in `MIT 6.100L` (Diff 7) | trivial | low (footer polish) |
| 7 | **ML-2** Add CF-4 / CP-N4-B to glossary (Diff 8) | trivial | low (accessibility for first-time readers) |
| 8 | **#10, #11** We Do template variation + schema-dump reformatting | medium (design choice) | low (fatigue reduction) |

---

## 9. Graph Memory Update Notes (for shared context files)

- **S47 identity:** Section 47's `id` and filename (`opensource` / `s47-opensource.ts`) are **stale**; the actual content is MLOps serving. The Fixer should rename to `mlops-serving` / `s47-mlops-serving.ts` and update `src/lib/course/index.ts` import path. The same disease affects **Section 29** (`s29-mlops.ts` / `id: "mlops"` / title "SQL avanzado y modelado relacional") — the two renames should be done together to restore filename↔content alignment.
- **S47 prose metrics:** 211 prose records, 304 sentences, mean WPS 12.84, mean SPW 1.672, mean Fernández-Huerta 91.6, mean INFLESZ 87.9. The high FH is inflated by short bullet/heading items; the *real* difficulty hides in dense code-switched identifiers, not in syntactic complexity. Composite grammar score: **7.0/10**.
- **S47 LT signal:** 917 raw LT matches; **898 are spellcheck false positives on tech/code nouns** (MLOps, serving, baseline, holdout, canary, rollback, params, seed, run, Staging, etc.) — these should be added to the course-wide LT allowlist (if one exists) to reduce noise in future audits. **19 non-spellcheck matches**; 9 actionable (5 `vs.`, 2 agreement, 1 `o→u`, 1 thin-space), 10 false positives on code identifiers (`El DEFECT`, `card ⊇ {use,...}`, `code=latest no valida`).
- **S47 pedagogy:** Exemplary I Do / We Do / You Do fidelity (8-8-24-1-8 alignment across subtopics). Connective tissue between theory cards is the strongest pattern in the section (every card opens with a bridge from the previous step). The triple-pattern We Do (E1 repair → E2 classify → E3 fail-closed decide) is one of the most disciplined scaffolding designs in the course and should be preserved verbatim when fixing grammar.
- **S47 meta-leak:** No developer/AI/TODO prose leaks in learner-facing text. The only meta-leak is the filename/`id` mismatch (ML-1) and the undefined acronyms CF-4/CP-N4-B on first encounter (ML-2, borderline).
- **S47 cross-references:** The section is the anchor for CF-4 (roadmap L110) and CP-N4-B (roadmap L648). Any future cross-section link to "S47" or "MLOps serving" should use the new `id` after Diff 1 is applied. Learners who bookmarked `#opensource` need a redirect.
- **Future-audit allowlist (suggested):** `MLOps`, `serving`, `baseline`, `holdout`, `canary`, `rollback`, `params`, `seed`, `run`, `Staging`, `Production`, `digest`, `sha256`, `fallback`, `hooks`, `quality_delta`, `traffic_pct`, `error_rate`, `SLO`, `p95`, `lineage`, `audit_entry`, `card_sections`, `feature_version`, `contract_tests`, `CASO-TAC-047`, `CP-N4-B`, `CF-4`. Adding these to a custom LT dictionary would eliminate ~98% of the spellcheck noise for S47.

---

## 10. Method Note (Spanish grammar / style / structure heuristics applied)

Per `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`, the following research-backed heuristics were applied to **every paragraph and every sentence** of the section's learner-facing Spanish prose:

1. **Fernández-Huerta (1959)** readability: `206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Spanish Flesch adaptation. Bands: ≥90 muy fácil → <30 muy difícil. For technical curriculum, 50–70 is healthy; very high scores indicate dense jargon hidden behind short sentences (the S47 case).
2. **Szigriszt-Pazos / INFLESZ**: `206.835 − 62.3·(syllables/word) − (words/sentence)`. Used in Spanish education/health readability literature.
3. **Words per sentence (WPS)** and **syllables per word (SPW)**: structural load and lexical complexity.
4. **Syllable counter**: Spanish vowel-group heuristic with the word-final rule (subtract 1 if the word ends in vowel /s /n; min 1).
5. **Rule-based grammar & style engine**: LanguageTool public API (`language=es`) on three chunks (~15k chars each) of concatenated prose. 917 raw matches; 19 non-spellcheck; 9 actionable.
6. **Pedagogical heuristics** (offline, no API): run-on (>45 words) / long (>32), missing terminal `.?!`, missing `¿`/`¡`, unbalanced delimiters, duplicated word (`de de`), English-dominant sentence, meta/AI/TODO leak, gerund pile-up (≥3), high comma density, single-sentence paragraph, anaphoric monotony, space-before-punct / double space.
7. **Composite section score (0–10)**: start at 10; subtract weighted H/M/L findings; density-normalize by sentence count; light penalty if FH is extreme. S47 score: **7.0/10** (1 H × 0.6 + 24 M × 0.25 + 19 L × 0.08 ≈ 8.05 penalty points; density-normalized to ~3 points over 304 sentences; minus the H finding).

**Worst sentences (by Fernández-Huerta) that are real prose (excluding 3-word headings and book titles):**
- `jobRelevance` sentence 1 (L15) — FH=66.6, W=48 — **run-on**, real issue.
- `weDo` E3 instructions (L588, L741, L897, L1045, L1190, L1335, L1480, L1625) — FH=53–70, W=31–35 — dense code-switched identifiers; intentional.
- `theory` T2-A callout (L188) — FH=45.4, W=7 — short, dense with code identifiers; the `verificados` agreement issue lives here.

**False-positive classes documented** (for future audits):
- LT `MORFOLOGIK_RULE_ES` on tech/code nouns (898 of 917 matches) — should be allowlisted.
- LT `EL_TILDE` on `El DEFECT` / `Borrar el trace` — `DEFECT` and `trace` are English code identifiers; the masculine article without tilde is correct.
- LT `Y_E_O_U` on `o hooks` — English /h/ in *hooks* is pronounced, so the rule doesn't apply.
- LT `PREP_VERB` on `card solo con use` — `use` is the English key name of a model-card section, not the Spanish imperative verb.
- LT `SUBJUNTIVO_PASADO` on `card ⊇ {use,limits,...}` — same false positive on the English key `use`.
- Heuristic `unbalanced_delim` on `<>` (math `>`/`<` in `candidate > baseline`) — fixed in the metrics script by excluding `<>` from the pair check.
- Heuristic `double_space` after `strip_markdown_for_metric` (the em-dash spacer was inserting double spaces around already-spaced em-dashes) — fixed.
- Heuristic `missing_terminal` on headings and bullet items — by convention, these don't end with periods; should be filtered by key (heading, criterion, text in learningOutcomes) in a future pass.

---

## Final Statement

This is the complete Explorer report for Section 47. Ready for the Fixer prompt.
