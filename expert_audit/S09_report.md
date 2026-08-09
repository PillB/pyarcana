# S09 — Curriculum Auditor Report (Explorer pass)

**Section audited:** Section 9 — "Excepciones, debugging y logging seguro"
(shortTitle: "Excepciones & logs" · phase 0 · level Intermedio · 19h)
**Live site:** https://pillb.github.io/pyarcana/ (Section 9 confirmed via sidebar nav)
**Source file:** `src/lib/course/sections/s09-visualization.ts` (2,298 lines, active per `src/lib/course/index.ts:10`)
**Audit date:** 2026-07-24 (campaign)
**Auditor:** Curriculum Auditor (general-purpose subagent, S09)
**Grammar subplan applied:** `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md` (Fernández-Huerta, INFLESZ/Szigriszt-Pazos, WPS/SPW, LanguageTool `es`, pedagogical heuristics)

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| `id` (legacy, immutable) | `"visualization"` |
| `index` | `9` |
| `title` | `"Excepciones, debugging y logging seguro"` |
| `shortTitle` | `"Excepciones & logs"` |
| `tagline` | `"Excepciones específicas, diagnóstico, logging sin PII y resiliencia del pipeline de familiaridad"` |
| `phase` | 0 (Fundamentos) |
| `estimatedHours` | 19 |
| `level` | Intermedio |
| `icon` | `ShieldAlert` |
| Topic retarget | V3 roadmap retarget from "Data Visualization" → "Excepciones, debugging y logging seguro" (documented in `course-state/curriculum_hardening/paragraph_analysis/S09_PARAGRAPHS.md`) |

**Rendered scope verified live (agent-browser):**
- Sidebar button label matches: "9 Excepciones & logs — Excepciones específicas, diagnóstico, logging sin PII y resiliencia del pipeline de familiaridad".
- After click, page renders H1 "Excepciones, debugging y logging seguro" with tabs Teoría / Yo hago / Hacemos juntos / Tú haces / Autocheck (default: Teoría, selected).
- Theory headings rendered live, exact match with source: "Mapa: excepciones, diagnóstico, logs y resiliencia", "Inicio CP-N1-C" callout, "Tipos específicos, raise y chaining", "Fronteras de recuperación y cleanup", "Reproducción mínima, hipótesis y causa raíz", "Niveles y estructura de logging", "Correlation IDs y redacción de PII", "Fallar rápido vs continuar con cuarentena", "Idempotencia, retries y cuarentena".

**Sections audited (all tabs):** Theory (9 blocks, 29 paragraphs, 8 runnable code samples, 8 callouts), I Do (8 demos with code+output+why), We Do (24 exercises E1/E2/E3 × 8 subtopics), You Do (1 capstone CP-N1-C with starter, rubric, portfolio note), Self-check (11 MCQs with explanations), Resources (7 docs, 2 books, 4 courses), `jobRelevance`, `learningOutcomes` (8).

---

## 2. Executive Summary of Quality

**Composite score: 8.0 / 10**

**Verdict:** S09 is a structurally gold-standard Phase-0 section with strong domain honesty (no print-theater, no fraud/parentesco claims, robust progressive disclosure anchored on the synthetic `CASO-LIM-009` intake pipeline). Theory depth (mean 349 chars/paragraph, all blocks ≥3 paragraphs), I Do / We Do / You Do / Self-check fidelity, and exercise scaffolding all meet or exceed the `GOLD_STANDARD_CHECKLIST.md` bar. However, two **HIGH-severity visible inconsistencies** drag the score down:

1. The interactive "Pruébalo tú mismo" playground rendered inside Section 9 still serves the legacy matplotlib sandbox (`SectionView.tsx:1139 'visualization': { title: 'Practica matplotlib', ... }`), so learners opening Section 9 see off-topic visualization code under a section titled "Excepciones, debugging y logging seguro".
2. The PDF progress report (`PdfReport.tsx:49`) labels Section 9 as `"9. Viz"` — a learner-visible mislabeling in exported artifacts.

Both are direct consequences of the V3 retarget leaving the legacy `id: "visualization"` in place while downstream consumers (`PdfReport.tsx`, `SectionView.tsx` playground map) were never updated. The source content itself is high quality; the routing/state layer has not caught up.

Below the headline issues, there are a handful of genuine Spanish grammar/concordance findings (mostly low-to-medium severity) and a DRY violation in the `hint`/`hints[0]` duplication (21 of 24 exercises). No developer meta-leak, no AI-to-author commentary, no `STUB`/`TBD`/`moved from section X` artifacts were detected in learner-facing prose.

---

## 3. Detailed Issue Registry

> Severity: **H** = High (blocks learner value or visible defect), **M** = Medium (clarity/consistency/grammar error), **L** = Low (style/polish).

### H-1 — Off-topic interactive playground renders inside Section 9
- **Severity:** H
- **Location:** `src/components/course/SectionView.tsx:1139-1166` (keyed by `section.id === 'visualization'`), invoked at `SectionView.tsx:408` for every section.
- **Evidence (source):**
  ```ts
  'visualization': {
    title: 'Practica matplotlib',
    code: `# Practica matplotlib (se carga automaticamente)
  import matplotlib.pyplot as plt
  import numpy as np
  ...
  ```
- **Live impact:** When a learner opens Section 9 ("Excepciones, debugging y logging seguro"), the rendered page appends a "Pruébalo tú mismo" panel (Pyodide-backed `CodePlayground`) whose title and code are about matplotlib plotting — a topic no longer taught in S09. Verified live: tabpanel Teoría is followed by `heading "Pruébalo tú mismo" [level=3, ref=e76]` (`agent-browser snapshot`).
- **Pedagogical impact:** Cognitive dissonance at the start of the theory tab; learners are offered an interactive matplotlib exercise before reading a single word about exceptions. Violates the "no forward references to untaught APIs" rule in `GOLD_STANDARD_CHECKLIST.md` (matplotlib is untaught in S01–S09; taught later in the reporting/viz phase).
- **Root cause:** V3 retarget changed the section's topic but kept `id: "visualization"` for routing/state compatibility. The playground map is keyed by `sectionId` and never received a new entry for the retargeted topic (or a removal of the stale entry).

### H-2 — PDF report labels Section 9 as "9. Viz"
- **Severity:** H
- **Location:** `src/components/course/PdfReport.tsx:49` (hardcoded `SECTION_NAMES` map).
- **Evidence (source):**
  ```ts
  const SECTION_NAMES: Record<string, string> = {
    ...
    pandas: '8. Pandas',
    visualization: '9. Viz',
    sklearn: '10. sklearn',
    ...
  }
  ```
- **Live impact:** A learner who downloads the PDF progress report (`PdfReport` component) will see Section 9 listed as "9. Viz" — a mislabel for a section now titled "Excepciones, debugging y logging seguro". Confirmed by code reading; the map is keyed by `id`, not by `index` or `title`.
- **Pedagogical impact:** Brand/registrar inconsistency in the learner's permanent portfolio artifact; weakens trust in the report's metadata.
- **Root cause:** Same as H-1 — the legacy `id: "visualization"` was retained while the topic was retargeted; the PDF label map was never updated to "9. Excepciones" or similar.

### M-1 — `hint` field byte-identical to `hints[0]` in 21 of 24 We Do exercises
- **Severity:** M
- **Location:** Every We Do step from L749 (`S09-T1-A-E1`) through L2005 (`S09-T4-B-E3`).
- **Evidence (sample, `S09-T1-A-E1` at L745-754):**
  ```ts
  hint: "Piensa: tipo incorrecto vs valor ilegal vs clave ausente vs I/O vs genérico de dominio.",
  hints: [
    "Piensa: tipo incorrecto vs valor ilegal vs clave ausente vs I/O vs genérico de dominio.",
    "Usa TypeError, ValueError, KeyError, FileNotFoundError y un custom ValidationError.",
  ],
  ```
- **Tally:** 21 of 24 (87.5%) have `hint === hints[0]` verbatim. Only 3 differ (`S09-T3-A-E2`, `S09-T3-B-E3`, `S09-T4-A-E3`).
- **Pedagogical impact:** No direct learner-facing harm if the UI surfaces only `hints[]` (and ignores `hint`) or only `hint` — but if both are surfaced, learners see the same sentence twice. Either way, the duplication is a maintenance hazard: a future edit to one field leaves the other stale.
- **Root cause:** Most likely the author copied `hint` into `hints[0]` as scaffolding and never deleted the redundant `hint:` field after the `hints[]` array became the canonical source.

### M-2 — Real Spanish concordance / orthography errors (LanguageTool `es`, after FP filter)

| # | Loc | Source text (verbatim) | Issue | LT rule | Fix |
|---|---|---|---|---|---|
| M-2a | `theory` block 1 callout content @ L39 | "…diferencia **fallo** de datos, configuración y proveedor." | "fallo" should agree with the plural list "datos, configuración y proveedor" → "fallos" (or restructure: "diferencia entre falla de datos, configuración y proveedor") | `AGREEMENT_POSTPONED_ADJ` | "diferencia **fallos** de datos, configuración y proveedor." |
| M-2b | `feedback` @ L1510 (S09-T3-A-E3) | "Stdout de datos **limpio**…" | "datos" is masculine plural → "limpios" | `AGREEMENT_POSTPONED_ADJ` | "Stdout de datos **limpios**…" |
| M-2c | `instruction` @ L917 (S09-T1-B-E1) | "…el fallo propaga RuntimeError y **aún así** deja closed True…" | Connector "pese a eso" writes "aun así" without tilde per RAE | `AUN` | "…y **aun así** deja closed True…" |
| M-2d | `instruction` @ L859 (S09-T1-A-E3) | "…re-**lanza** `DataLoadError` con `raise ... from e`." | Prefix "re-" doesn't take hyphen for verbs per RAE | `NO_SEPARADO` | "…**relanza** `DataLoadError` con `raise ... from e`." |
| M-2e | `tests` @ L1032 (S09-T1-B-E3) | "…good_r re-**lanza** RuntimeError capturado como raised…" | Same as M-2d | `NO_SEPARADO` | "…good_r **relanza** RuntimeError capturado como raised…" |
| M-2f | `theory` block 9 para 2 @ L378 | "…permiten re-**correr** un job sin duplicar side-effects." | Same rule as M-2d | `NO_SEPARADO` | "…permiten **recorrer** un job sin duplicar side-effects." |

> Note: the `hint` field for S09-T2-A-E3 (L1202) also reads "No re-ejecutes el código original; parsea el texto." LanguageTool flags `re-ejecutes` as `NO_SEPARADO` (recommends "reejecutes"). However, "reejecutar" is not yet in the DRAE; "re-ejecutar" with hyphen is defensible when the second element is a derivative (per RAE's "reeleccionar / re-eleccionar" guidance for words starting with 'e'). Flag as **L** (style preference, not strict error) rather than M.

### M-3 — Typography / style consistency issues (low-confidence but recurring)

| # | Loc | Pattern | Count | LT rule | Suggested fix |
|---|---|---|---|---|---|
| M-3a | theory blocks 1, 3, 8, 9 + heading L334 + instructions L750 (×4) + tests L1672 | "vs" used without period (e.g. "fail-fast (config) vs cuarentena (data)", "manejar (recuperable) vs propagar") | 8 | `PUNTO_EN_ABREVIATURAS` | Standard Spanish typography prefers "vs." with period; modern RAE accepts "vs" in tech contexts. Decide one and apply consistently across the section. |
| M-3b | multiple (theory blocks 1, 4, 5, 7, 8, 9 + content L39 + feedback L867, L1033, L1616) | "postmortem" used as invariable noun/adjective | ~15 (LT grouped 8 visible) | `ES_SIMPLE_REPLACE_MULTIWORDS_POSTMORTEM` | Spanish traditional form is "post mórtem" (italicized foreignism or adapted). Modern industry usage accepts "postmortem" — pick one and standardize. |
| M-3c | `theory` block 9 para 3 @ L379 | "Backoff simple (sleep creciente: 0.1s, 0.2s, 0.4s…) reduce el thundering herd" | 3 (one per value) | `SPACE_UNITIES` | Spanish typography wants a thin/no-break space between number and unit symbol: "0.1 s, 0.2 s, 0.4 s". Borderline since the values are inline code-style demo. |
| M-3d | `heading` @ L268 | "Correlation IDs y redacción de PII" | 1 | `SIGLAS` | RAE: plural of acronyms is invariable in writing ("los ID", not "los IDs"). However "IDs" is industry-standard in tech Spanish. Borderline; document the choice in the style guide. |

### M-4 — File-name / `id` mismatch is structural debt
- **Severity:** M (technical-debt, no direct learner impact but creates H-1 / H-2)
- **Location:** `src/lib/course/sections/s09-visualization.ts:4` (`id: "visualization"`).
- **Evidence:** The file is named `s09-visualization.ts` and `id` is `"visualization"`, but `title` is `"Excepciones, debugging y logging seguro"`. The mismatch is intentional per V3 retarget (documented in `S09_PARAGRAPHS.md` line 51: "Id de plataforma `visualization` se conserva; V3 es excepciones/logs, no charts"). The retained id propagates to downstream consumers that never received a retarget update (H-1, H-2).
- **Recommendation:** Either (a) introduce a new `id: "exceptions-logging"` (with a migration for progress state and PDF/playground maps) or (b) keep the legacy `id` but **update the downstream consumer maps** (`PdfReport.SECTION_NAMES`, `SectionView.demos`) so the visible labels and sandbox content match the retargeted topic.

### M-5 — Theory run-on / long sentences (>32 words)
- **Severity:** M (cognitive load in dense theory blocks)
- **Source:** 3 run-on sentences (>45 words) and 10 long sentences (>32 words) were detected by the heuristic analyzer. The worst:
  1. **L187** (theory block 5 para 3, 55 words, FH=40.6): "Un **test de regresión** rojo→verde documenta la causa raíz y evita reintroducir el fallo en el siguiente PR. 5-whys ligero: no pares en el síntoma («KeyError email») — pregunta si el schema del lote de S08 realmente exige esa clave en todas las filas o si el productor omitió un campo opcional sin documentarlo."
  2. **L338** (theory block 8 para 2, 54 words, FH=36.2): "**Fail-fast** en config: seguir con schema roto multiplica basura y envenena el **manifest de S08**. **Cuarentena** en data: una fila mala **no** debe tumbar el lote entero — el mismo gate de reconciliación (`in == ok + quarantined`), ahora con `error_class` y `correlation_id` explícitos en cada rechazo para el postmortem de CP-N1-C."
  3. **L2043** (`context`, 47 words, FH=47.8): "Inicias **CP-N1-C**: una bitácora de pipeline que **sintetiza** lo practicado en los We Do — taxonomía data|config|provider, máscaras de PII, `log` con correlation_id, fail-fast de config y cuarentena de filas — en un módulo de portfolio que un junior puede mostrar en GitHub."
- **Pedagogical impact:** The two theory run-ons (1) and (2) are dense: each packs two distinct claims (the test/5-whys claim and the schema question; the fail-fast claim and the quarantine contract). Splitting at the em-dash would yield 4 sentences in the 14-22 word band, which is healthier for technical Spanish (FH band "normal" 50-70).
- **Note:** None of the long sentences are ungrammatical; they are stylistically dense. The em-dash + backtick + parenthetical pattern recurs heavily (theory block 2 para 1, theory block 6 para 1, theory block 8 para 1, etc.).

### L-1 — No issues detected (clean)
- No developer meta-leak / AI-to-author commentary in learner-facing prose.
- No `STUB`, `TBD`, `MOVED FROM`, `WIP`, `placeholder` (learner-facing), `lorem ipsum` markers.
- No byte-identical theory across adjacent sections (Section 9 theory is unique; cross-checked against S08 and S10 theory headings).
- No real PII in any demo or fixture (all emails are `@ejemplo.pe`, all phones synthetic peruvian `999…`, names `ClienteNN`, `Ana Perez Lopez`, etc.).
- No "print theater" — every I Do demo computes from inputs (Decimal parse, StringIO read, KeyError from real `row["email"]` access, split_apellidos, logging.StreamHandler to buffer, log.exception with masked email, process_batch with reconcile, retry_call with flaky counter). No demo just `print("the answer")`.
- No progressive-disclosure breach in exercises — only stdlib (`decimal`, `logging`, `io`, `traceback`, `hashlib`, `json`, `typing`) and Python syntax introduced in S01-S08.
- correctIndex distribution across 11 MCQs: `0, 2, 3, 1, 0, 2, 3, 1, 0, 2, 3` — fair rotation; no answer-key clustering.
- All 24 We Do instructions meet the ≥150-char gold bar (range 165-299 chars, mean 206).
- All 9 theory blocks have ≥3 paragraphs (mean 3.22), mean 349 chars/paragraph (well above the 250-char gold bar).
- All 8 learning outcomes are measurable action verbs ("Elegir tipos…", "Dibujar fronteras…", "Leer tracebacks…", "Reducir fallos…", "Configurar logging…", "Propagar correlation_id…", "Decidir fail-fast…", "Reintentar solo…").

---

## 4. Meta-Leak Report

**Verdict: CLEAN.** No developer-facing commentary, design notes, or AI-to-author residue was detected in any learner-facing prose field of `s09-visualization.ts`.

### Items inspected and cleared
- `// TODO:` and `# TODO:` markers found at L1683, L1686, L2089, L2094, L2105, L2132 — **all inside `starterCode`/`youDo.starterCode` Python code blocks** as intentional pedagogical scaffolding ("TODO del estudiante (el starter NO es la solución)" at L2066, and `# TODO: enmascarar` as inline code comment asking the student to implement). These render as code comments to the learner, not as author notes.
- `# A corregir: …` markers found at L762, L986, L1038, L1213, L1422, L1515, L1738 — **all inside `starterCode` Python code blocks** as intentional pedagogical annotations ("the starter has this defect, fix it"). These are addressed to the learner, not to a developer.
- No matches for: `STORM`, `EXPLORER`, `FIXER`, `n=\d`, `rank \d`, `expert rank`, `residual`, `graph memory`, `loop engineering`, `harness`, `defect log`, `gold pass`, `hand_STORM`, `gold-standard`, `course-state`, `curriculum_hardening`, `design note`, `internal`, `developer`, `editorial note`, `note to self`, `guionista`, `redactor`, `copywriter`, `borrador`, `pendiente`, `WIP`, `TBD`, `próximamente`, `en construcción`, `lorem ipsum`.
- Cross-references such as "preview suave de S10" (L229), "preview del contrato CLI de S10" (L1510), "eco del manifest de S08" (L1783, L2013), "Reutiliza normalizadores de S05-S07 y los conteos reconciliados de S08" (L31) are **pedagogical foreshadowing / backward anchoring**, not meta-leaks. They are addressed to the learner and reinforce progressive disclosure.
- The phrase "Tras el ETL de S08 (cuarentena + manifest), el gate siguiente es…" (L15 in `jobRelevance`) is intentional curriculum-continuity framing.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity — **EXCELLENT**

| Gold bar | S09 status | Evidence |
|---|---|---|
| ≥8 I Do demos with `demoId`, description, why, code, output | ✅ 8 demos | T1-A → T4-B, one per subtopic, all with `demoId`, `subtopicId`, `environment: "local-python"`, `description`, `code` (with `language`/`title`/`code`/`output`), `why`. |
| 24 We Do exercises (E1/E2/E3 × 8 subtopics) | ✅ 24 | Verified: `S09-T1-A-E1` … `S09-T4-B-E3`, with `kind: guided/independent/transfer` cycling. |
| Exercise instructions ≥ ~150 chars | ✅ all 24 ≥165c | Range 165-299 chars; mean ~206. |
| starterCode with one clear defect (not empty, not pure print-the-answer) | ✅ | Each starter has a real scaffold with a single named defect (`# A corregir: …`). |
| solutionCode aligned with demo contract; honest grader oracle | ✅ | Every `solutionCode` produces the `output` exactly; predicated behavior matches `tests` contract string. |
| youDo: independent challenge + weighted rubric | ✅ | "Bitácora auditable del pipeline (inicio CP-N1-C)" with 6 objectives, 9 requirements, 6-item weighted rubric summing to 100%. |
| selfCheck ≥5 MCQ with non-trivial options + explanation | ✅ 11 MCQs | All have 4 plausible distractors + 1-sentence explanation; correctIndex fairly distributed. |
| learningOutcomes 6-10 measurable | ✅ 8 | All action-verb leads. |
| resources with real URLs | ✅ 7 docs + 2 books + 4 courses | All URLs resolve (Python docs, PEP 3134, OWASP, Real Python, MIT 6.100L, Harvard CS50P, Coursera, O'Reilly). |

### 5.2 Progressive disclosure — **EXCELLENT**
- Backward references: S05 (normalizadores), S06, S07 (conteos reconciliados, phone normalization contract), S08 (manifest, cuarentena, ETL). All are previously-taught material.
- Forward references: S10 ("preview suave", "preview del contrato CLI de S10") — used as scaffolding foreshadowing, not as a prerequisite. Acceptable.
- No untaught APIs: only stdlib (`decimal`, `logging`, `io`, `traceback`, `hashlib`, `json`, `typing`) and Python syntax introduced earlier in the course. No numpy/pandas/matplotlib in S09 demos or exercises (the off-topic matplotlib sandbox in H-1 is a violation, but it is in the `SectionView` playground map, not in the section's own prose/code).

### 5.3 Cognitive load and connective tissue — **STRONG with caveats**
- **Strength:** Section opens with a "Mapa" block (theory block 1) that gives an explicit "Orden de aprendizaje: T1 Excepciones → T2 Diagnóstico → T3 Logging → T4 Resiliencia" (L33). This is a metacognitive advance organizer — best practice from learning science (Mayer's signaling principle).
- **Strength:** Each subtopic block follows the Anchor → Mechanism → Contract → Case pattern (per `S09_PARAGRAPHS.md`). The synthetic `CASO-LIM-009` pipeline is reused as a stable anchor across all 8 subtopics, providing coherence.
- **Strength:** Callouts are actionable, not slogans. "Causa raíz" (info, L218-222) gives both a negative example («Falló en prod» no es causa raíz) and a positive one («split asume 2 tokens y llegó 1» sí lo es) — best practice.
- **Caveat (M-5 above):** Two theory run-ons (>50 words) pack two claims each; splitting at the em-dash would reduce cognitive load per sentence without losing the rhetorical contrast ("fail-fast vs cuarentena").
- **Caveat:** Heavy use of inline code spans mid-sentence (`ValueError`, `TypeError`, `OSError`/`FileNotFoundError`, `Decimal`, `quantize(Decimal('0.01'))`, `correlation_id`, etc.) is appropriate for a Python course but inflates the per-sentence character count. Mean sentence length is 14.56 words — within the 15-32 sweet spot for technical Spanish — but the median FH (72.4) sits in the "fácil" band, which is healthy for a Phase-0 (Fundamentos) section. No readability red flags.

### 5.4 Domain honesty and ethics guardrails — **EXCELLENT**
- "Sin claims de fraude ni parentesco" appears at L30, L2043 — the project-wide guardrail is consistently applied.
- PII redaction is taught as a hard contract ("Redacta **antes** del format string", L273), not as a polite suggestion.
- "Fail-closed / human review" rule (per gold checklist) is enforced: "cierra en fallo (fail closed: no publiques resultados si el reconcile no cuadra)" (L339); the abort policy exercise (S09-T4-A-E3) teaches learners to make `should_abort(metrics)` a testable function rather than a human judgement call.
- "Reintentar un INSERT no idempotente duplica filas. Diseña la clave antes del retry." (warning callout, L417-419) — exemplary pedagogical framing: name the failure mode before introducing the solution.

### 5.5 Comparative quality vs. gold-standard peers (S01, S02, S03, S07, S08)
- Theory depth (mean 349 chars/paragraph, 29 paragraphs across 9 blocks) — comparable to S01-S03 gold peers (which typically run 280-380 chars/paragraph).
- Domain anchoring (CASO-LIM-009) — comparable to S07/S08 (which anchor on the same synthetic intake pipeline), reinforcing the course's longitudinal case study.
- Code depth — every I Do demo and every We Do solution is runnable Python with deterministic `output`. Comparable to S01/S02 runnable demos.
- **Where S09 falls short of gold peers:** the file/id mismatch (M-4) and downstream mislabeling (H-1, H-2) — gold peers (S01-setup, S02-basics, S03-data-structures) have file names, ids, titles, and downstream labels all aligned. S09 is the only section in the audited sample with a retarget that left visible legacy artifacts.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewrites

> Method: Applied the `/_GRAMMAR_SUBPLAN.md` pipeline. Per-sentence metrics (FH, INFLESZ, WPS, SPW) and heuristic findings were computed offline for all 306 sentences extracted from S09 learner-facing prose. LanguageTool `es` was run on the full prose corpus (24,029 chars, 2 batches, 600 raw matches, 19 confirmed real or borderline after false-positive filtering). Only paragraphs/sentences with actionable findings are rewritten below; clean paragraphs are listed as "no change". Code blocks (`code:`, `output:`, `starterCode:`, `solutionCode:`) are excluded per the subplan scope.

### 6.1 Theory — Block 1 (Mapa: excepciones, diagnóstico, logs y resiliencia) @ L29-34

**Paragraph 1 (L30):** CLEAN — no change.

**Paragraph 2 (L31):** Minor — "Reutiliza normalizadores de S05–S07 y los conteos reconciliados de S08" is good. No change.

**Paragraph 3 (L32):** CLEAN — no change.

**Paragraph 4 (L33) — `Orden de aprendizaje` paragraph:** flagged by heuristic for high comma density and unbalanced delimiter (false positive from inline `→` arrow).
- **Before (verbatim):** "Orden de aprendizaje: **T1 Excepciones** (tipos, raise, fronteras) → **T2 Diagnóstico** (traceback, minimal repro) → **T3 Logging** (niveles, correlation_id, redacción) → **T4 Resiliencia** (fail-fast vs cuarentena, retries idempotentes). S10 empaquetará este vocabulario en un CLI con handlers limpios; aquí construyes el contrato operativo del pipeline."
- **After (proposed):** No grammar change needed. The structure is intentional (advance organizer). If polish is desired, the arrow chain could become a bullet list:
  - "**T1 Excepciones** (tipos, raise, fronteras)"
  - "**T2 Diagnóstico** (traceback, minimal repro)"
  - "**T3 Logging** (niveles, correlation_id, redacción)"
  - "**T4 Resiliencia** (fail-fast vs cuarentena, retries idempotentes)"

### 6.2 Theory — Block 1 callout (Inicio CP-N1-C) @ L38-39

- **Before (verbatim):** "Gate operativo: bitácora auditable que nunca registra email/teléfono/dirección completos y diferencia fallo de datos, configuración y proveedor. Sin claims de fraude ni parentesco."
- **Issues:** `AGREEMENT_POSTPONED_ADJ` (M-2a): "fallo" should be plural "fallos" to agree with the list "datos, configuración y proveedor".
- **After (proposed):** "Gate operativo: bitácora auditable que nunca registra email/teléfono/dirección completos y diferencia **fallos** de datos, configuración y proveedor. Sin claims de fraude ni parentesco."

### 6.3 Theory — Block 2 (Tipos específicos, raise y chaining) @ L45-49

**Paragraph 1 (L46):** CLEAN — no change. (The "Un `except Exception` genérico oculta la causa…" sentence is correct; LT's `AGREEMENT_POSTPONED_ADJ` flag on "oculta" was a false positive caused by the backtick-stripped placeholder "X".)

**Paragraph 2 (L47):** CLEAN — no change.

**Paragraph 3 (L48):** One real orthography issue — "p. ej." is correct (RAE abbreviation). The `space_before_punct` heuristic flagged "nombra el borde de tu capa" — false positive. No change needed.

### 6.4 Theory — Block 3 (Fronteras de recuperación y cleanup) @ L97-101

**Paragraph 1 (L98):** Long sentence (38 words per heuristic). The sentence "`try/except/else/finally` dibuja el borde del job…" is grammatically correct but dense.
- **Before (verbatim):** "`try/except/else/finally` dibuja el borde del job: **else** corre solo si no hubo excepción (camino feliz legible, p. ej. «lote legible»); **finally** siempre (cleanup de handles y contadores). El `with` hace lo mismo de forma idiomática vía context managers: no dejes un `StringIO`/archivo abierto en el crash path del intake CASO-LIM-009."
- **After (proposed — optional split for cognitive load):** "`try/except/else/finally` dibuja el borde del job: **else** corre solo si no hubo excepción (camino feliz legible, p. ej. «lote legible»); **finally** siempre (cleanup de handles y contadores). El `with` hace lo mismo de forma idiomática vía context managers. No dejes un `StringIO`/archivo abierto en el crash path del intake CASO-LIM-009."

**Paragraph 2 (L99):** Long sentence (38 words).
- **Before (verbatim):** "No uses **`except:` bare** ni tragues `Exception` sin re-raise o cuarentena documentada. Decide en el borde: **manejar** (recuperable: fila mala del CSV) vs propagar (fatal: config inválida, encoding vacío). `except Exception: pass` es la forma más rápida de esconder corrupción de datos en producción y de mentir al on-call."
- **After (proposed):** "No uses **`except:` bare** ni tragues `Exception` sin re-raise o cuarentena documentada. Decide en el borde: **manejar** (recuperable: fila mala del CSV) **vs.** propagar (fatal: config inválida, encoding vacío). `except Exception: pass` es la forma más rápida de esconder corrupción de datos en producción y de mentir al on-call."  *(Only change: "vs" → "vs." per Spanish typography.)*

**Paragraph 3 (L100):** CLEAN — no change.

### 6.5 Theory — Block 4 (Traceback y debugger) @ L145-149

**Paragraph 1 (L146):** CLEAN.

**Paragraph 2 (L147):** Long sentence (35 words). The parenthetical chain "(solo `id` de fila, nunca el row completo)" creates a slight readability dip.
- **Before (verbatim):** "`breakpoint()` / `pdb` inspeccionan variables en vivo cuando tienes TTY local. En demos, CI y el entorno del curso usamos **`traceback.format_exc` + prints controlados** (solo `id` de fila, nunca el row completo) porque no siempre hay sesión interactiva. El hábito es el mismo: mirar locals seguros, no volcar el diccionario crudo del cliente sintético."
- **After (proposed):** No grammatical change. If desired for readability: split after "sesión interactiva." so the final sentence stands alone.

**Paragraph 3 (L148):** Long sentence (35 words).
- **Before (verbatim):** "Al loguear stacks, **nunca** imprimas secretos ni PII completa que haya en locals (email, token, password). **Redacta** o omite: un traceback con `password=...` o `email=lucia@…` es un incidente de cumplimiento, no un log útil. CASO-LIM-009 exige el mismo cuidado que la bitácora de T3: diagnóstico accionable sin filtrar datos personales al canal de ops."
- **After (proposed):** No grammatical change. Content is excellent (concrete negative examples with redacted placeholders).

### 6.6 Theory — Block 5 (Reproducción mínima, hipótesis y causa raíz) @ L184-188

**Paragraph 1 (L185):** CLEAN.

**Paragraph 2 (L186):** Long sentence (35 words). The em-dash inside parenthetical reasoning is dense but grammatically correct.
- **Before (verbatim):** "Formula **hipótesis falsables** («si el apellido2 vacío rompe el join, entonces con apellido2='X' pasa»). Ojo: un nombre con 3 tokens puede **no lanzar** y aun así truncar mal el segundo apellido — ese bug silencioso no aparece en el `except`; el minimal repro del ValueError es el de 1 token. Descartar una hipótesis es progreso: anótala en la bitácora del incidente."
- **After (proposed):** No grammatical change. (LT's `SUBJUNTIVO_PASADO` flag on "formula" is a false positive — "formula" is the imperative of formular, not the past of formar.)

**Paragraph 3 (L187) — RUN-ON (55 words, M-5):**
- **Before (verbatim):** "Un **test de regresión** rojo→verde documenta la causa raíz y evita reintroducir el fallo en el siguiente PR. 5-whys ligero: no pares en el síntoma («KeyError email») — pregunta si el schema del lote de S08 realmente exige esa clave en todas las filas o si el productor omitió un campo opcional sin documentarlo."
- **After (proposed — split at em-dash):** "Un **test de regresión** rojo→verde documenta la causa raíz y evita reintroducir el fallo en el siguiente PR. 5-whys ligero: no pares en el síntoma («KeyError email»). Pregunta si el schema del lote de S08 realmente exige esa clave en todas las filas o si el productor omitió un campo opcional sin documentarlo."

### 6.7 Theory — Block 6 (Niveles y estructura de logging) @ L227-232

**Paragraph 1 (L228):** Long sentence (37 words, FH=34.5 "difícil"). The inline enumeration of all 5 log levels in one sentence is the densest in the section.
- **Before (verbatim):** "Niveles: **DEBUG** (detalle dev), **INFO** (progreso del job), **WARNING** (anomalía recuperable: fila opcional rara), **ERROR** (fallo de una unidad que cuarentenarás o reintentarás), **CRITICAL** (el proceso o el lote entero está en peligro: config rota, disco lleno). No loguees ERROR para filas esperables de cuarentena si WARNING basta: el ruido entierra el incidente real en el dashboard de ops."
- **After (proposed — convert level list to bullets):** "Niveles: **DEBUG** (detalle dev), **INFO** (progreso del job), **WARNING** (anomalía recuperable: fila opcional rara), **ERROR** (fallo de una unidad que cuarentenarás o reintentarás), **CRITICAL** (el proceso o el lote entero está en peligro: config rota, disco lleno). No loguees ERROR para filas esperables de cuarentena si WARNING basta: el ruido entierra el incidente real en el dashboard de ops."  *(No grammatical change; if visual format is desired, the level enumeration could become a bullet list. The "No loguees ERROR…" sentence is clean.)*

**Paragraph 2 (L229):** CLEAN — no change.

**Paragraph 3 (L230):** CLEAN — no change.

**Paragraph 4 (L231):** CLEAN.

### 6.8 Theory — Block 7 (Correlation IDs y redacción de PII) @ L270-274

**Paragraph 1 (L271):** CLEAN.

**Paragraph 2 (L272):** CLEAN.

**Paragraph 3 (L273):** Long sentence (34 words).
- **Before (verbatim):** "Helpers `mask_email` / `mask_phone` / `mask_address` deben ser el **único** camino hacia los logs; un audit de código falla si alguien hace `log.info(row)` o formatea f-strings con el email crudo. Redacta **antes** del format string. En el `except`, combina redacción con `log.exception(...)` para forensics (stack + correlation_id) sin exponer datos personales."
- **After (proposed):** No grammatical change. (LT's `PREP_VERB` false positive on "con id" was triggered by placeholder substitution; the actual "con id" is the Spanish phrase "con id" meaning "with id" where "id" is a Python variable, not the Spanish imperative "id" of ir. The original text reads "con DEBUG imprime locals seguros (solo `id`, sin row completo)" — correct.)

### 6.9 Theory — Block 8 (Fallar rápido vs continuar con cuarentena) @ L336-340

**Paragraph 1 (L337):** Long sentence (35 words, FH=59.7).
- **Before (verbatim):** "Taxonomía del intake: **data** (fila sucia del CSV), **config** (delimiter, schema path, env `ROOT_PATH` vacía), **provider** (timeout S3, HTTP 503). La **política difiere** por clase: no trates un timeout del proveedor igual que un monto inválido — el primero puede reintentarse (T4-B); el segundo va a cuarentena con `error_class=data` y el lote sigue."
- **After (proposed):** "Taxonomía del intake: **data** (fila sucia del CSV), **config** (delimiter, schema path, env `ROOT_PATH` vacía), **provider** (timeout S3, HTTP 503). La **política difiere** por clase: no trates un timeout del proveedor igual que un monto inválido — el primero puede reintentarse (T4-B); el segundo va a cuarentena con `error_class=data` y el lote sigue."  *(No grammatical change; only "vs" → "vs." if standardizing.)*

**Paragraph 2 (L338) — RUN-ON (54 words, M-5):**
- **Before (verbatim):** "**Fail-fast** en config: seguir con schema roto multiplica basura y envenena el **manifest de S08**. **Cuarentena** en data: una fila mala **no** debe tumbar el lote entero — el mismo gate de reconciliación (`in == ok + quarantined`), ahora con `error_class` y `correlation_id` explícitos en cada rechazo para el postmortem de CP-N1-C."
- **After (proposed — split at em-dash):** "**Fail-fast** en config: seguir con schema roto multiplica basura y envenena el **manifest de S08**. **Cuarentena** en data: una fila mala **no** debe tumbar el lote entero. El mismo gate de reconciliación (`in == ok + quarantined`), ahora con `error_class` y `correlation_id` explícitos en cada rechazo para el postmortem de CP-N1-C."

**Paragraph 3 (L339):** CLEAN — no change.

### 6.10 Theory — Block 9 (Idempotencia, retries y cuarentena) @ L376-380

**Paragraph 1 (L377):** CLEAN.

**Paragraph 2 (L378) — orthography (M-2f):**
- **Before (verbatim):** "Operaciones **idempotentes** (misma clave de escritura) permiten re-correr un job sin duplicar side-effects. Clave típica: `(source, record_id, version)` más un hash del payload — el mismo espíritu del **manifest de S08**, ahora a nivel de re-ingesta tras un retry, un redeploy nocturno o un reprocess parcial del lote cuarentenado."
- **After (proposed):** "Operaciones **idempotentes** (misma clave de escritura) permiten **recorrer** un job sin duplicar side-effects. Clave típica: `(source, record_id, version)` más un hash del payload — el mismo espíritu del **manifest de S08**, ahora a nivel de re-ingesta tras un retry, un redeploy nocturno o un reprocess parcial del lote cuarentenado."
- **Note:** "re-ingesta" / "reprocess" / "redeploy" — "reingesta" is also valid (prefix "re-" + derivative starting with vowel, RAE allows both hyphenated and solid forms for "re-" + vowel-initial derivatives, see DPD "reeleccionar / re-eleccionar"). Keep "re-ingesta" as is; only "re-correr" must become "recorrer" because "recorrer" is a fully lexicalized verb in the DRAE.

**Paragraph 3 (L379):** Typography (M-3c — space before unit symbol).
- **Before (verbatim):** "Backoff simple (sleep creciente: 0.1s, 0.2s, 0.4s…) reduce el **thundering herd**: muchos workers reintentando a la vez y saturando el mismo proveedor. Tras `max_attempts` → cuarentena de la unidad o fail-fast del job según la política del README. **Nunca** retries infinitos en prod: un bucle eterno es un incidente disfrazado de «resiliencia»."
- **After (proposed):** "Backoff simple (sleep creciente: **0.1 s, 0.2 s, 0.4 s…**) reduce el **thundering herd**: muchos workers reintentando a la vez y saturando el mismo proveedor. Tras `max_attempts` → cuarentena de la unidad o fail-fast del job según la política del README. **Nunca** retries infinitos en prod: un bucle eterno es un incidente disfrazado de «resiliencia»."

### 6.11 I Do (Yo hago) — 8 demos @ L422-738

Each `description` and `why` field was scanned; findings:

| Demo | Field | LT finding | Action |
|---|---|---|---|
| S09-T1-A-DEMO @ L429 | `description` | "Validar fila de intake y encadenar ParseError → ValidationError." | CLEAN |
| S09-T1-A-DEMO @ L469 | `why` | "El chaining preserva la causa de parse al subir a validación de dominio." | CLEAN |
| S09-T1-B-DEMO @ L475 | `description` | "Leer lote con `with` + `else`/`finally`; re-raise si config inválida." | CLEAN |
| S09-T1-B-DEMO @ L510 | `why` | "with cierra el handle; else marca el camino feliz; finally corre siempre; config inválida se propaga." | CLEAN |
| S09-T2-A-DEMO @ L516 | `description` | "Reproducir KeyError en normalizer y ubicar frame con traceback." | CLEAN |
| S09-T2-A-DEMO @ L542 | `why` | "El frame útil es normalize_email: falta la clave email en C002; format_exc muestra texto de frame legible." | LT false positive (`CONCORDANCIA_ADJECTIVOS_NEUTROS` on "clave email" — "clave" is feminine and "email" is a masculine English loanword used as the noun complement; this is acceptable tech Spanish. No change.) |
| S09-T2-B-DEMO @ L548 | `description` | "De un lote de 200 filas sintéticas al caso mínimo de apellidos." | CLEAN |
| S09-T2-B-DEMO @ L579 | `why` | "Reducir a 'Solo' permite un test de regresión de una línea." | CLEAN |
| S09-T3-A-DEMO @ L585 | `description` | "Logger de pipeline con campos stage, record_id, duration_ms." | CLEAN |
| S09-T3-A-DEMO @ L616 | `why` | "Campos estables permiten filtrar por stage y record_id en operación." | CLEAN |
| S09-T3-B-DEMO @ L622 | `description` | "log.exception con email enmascarado, correlation_id y stack en el ERROR path." | CLEAN |
| S09-T3-B-DEMO @ L666 | `why` | "log.exception une diagnóstico (stack) con correlation_id y máscara de PII en un solo ERROR path." | CLEAN |
| S09-T4-A-DEMO @ L672 | `description` | "Lote: 1 fila mala a cuarentena; config rota aborta." | CLEAN |
| S09-T4-A-DEMO @ L703 | `why` | "Data → cuarentena; config → fail-fast. Conteos reconciliados." | CLEAN |
| S09-T4-B-DEMO @ L709 | `description` | "Retry 3× en TimeoutError; ValueError va a cuarentena sin retry." | CLEAN |
| S09-T4-B-DEMO @ L737 | `why` | "Transitorio se reintenta; error de datos no gasta reintentos." | CLEAN |

I Do `intro` @ L423: "Ocho demos I Do (uno por subtema), en orden T1→T4. Partes del job de intake CASO-LIM-009: validar filas, leer tracebacks, loguear sin PII y decidir fail-fast vs cuarentena/retry. Datos sintéticos; entorno local-python. Observa el código completo antes de los We Do." — CLEAN (one of 8 `vs` instances flagged by LT; standardize to "vs." per M-3a).

### 6.12 We Do (Hacemos juntos) — 24 exercises @ L741-2038

Each `instruction`, `hint`, `hints[]`, `edgeCases[]`, `tests`, `feedback` was scanned. The full table is in `/home/z/my-project/audits/tmp/s09_lt2.json`. Confirmed real findings:

| Ex | Field | Finding | Fix |
|---|---|---|---|
| S09-T1-A-E3 @ L859 | `instruction` | "re-lanza `DataLoadError`" (M-2d) | "relanza `DataLoadError`" |
| S09-T1-B-E1 @ L917 | `instruction` | "aún así deja closed True" (M-2c) | "aun así deja closed True" |
| S09-T1-B-E3 @ L1032 | `tests` | "good_r re-lanza RuntimeError" (M-2e) | "good_r relanza RuntimeError" |
| S09-T3-A-E3 @ L1510 | `feedback` | "Stdout de datos limpio (RESULT=…)" (M-2b) | "Stdout de datos limpios (RESULT=…)" |

All other We Do prose: CLEAN. (LT's many `MORFOLOGIK_RULE_ES` hits on `ValueError`/`TypeError`/`callable`/`stdlib`/`propagate`/etc. are all false positives caused by tech-term vocabulary; filtered out per the subplan's risk mitigation.)

**Hint duplication (M-1) across all 24 exercises:** See Issue M-1 above for the registry. 21 of 24 have `hint === hints[0]`. Recommended fix: drop the redundant `hint:` field from each step (or, if the consumer requires both, generate `hint` from `hints[0]` programmatically).

### 6.13 You Do (Tú haces) — Capstone CP-N1-C @ L2040-2142

| Field | Status |
|---|---|
| `title` | "Bitácora auditable del pipeline (inicio CP-N1-C)" — CLEAN |
| `context` @ L2043 | Long sentence (47 words, M-5). See rewrite below. |
| `objectives` (6) | All action-verb leads — CLEAN |
| `requirements` (9) | All imperative ("Módulo…", "process_batch…", "Fail-fast si…", "Ningún log…", "assert len(ok)…", "Dataset sintético…", "Al menos 3 tests…", "Solo stdlib…", "Entorno local-python") — CLEAN |
| `starterCode` docstring | Intentional `TODO del estudiante (el starter NO es la solución)` — not a meta-leak (pedagogical scaffold). CLEAN. |
| `portfolioNote` | "Muestra en README: 1 corrida con correlation_id, 1 log enmascarado (email/teléfono/dirección), tabla de taxonomía data/config/provider, política de abort y evidencia de tests. Subraya privacidad." — CLEAN |
| `rubric` (6 items) | Weights: 25+20+20+15+10+10 = 100% — balanced. |

**`context` @ L2043 (M-5 — 47-word run-on):**
- **Before (verbatim):** "Inicias **CP-N1-C**: una bitácora de pipeline que **sintetiza** lo practicado en los We Do — taxonomía data|config|provider, máscaras de PII, `log` con correlation_id, fail-fast de config y cuarentena de filas — en un módulo de portfolio que un junior puede mostrar en GitHub. Usa solo datos sintéticos; sin claims de fraude ni parentesco."
- **After (proposed — split at second em-dash):** "Inicias **CP-N1-C**: una bitácora de pipeline que **sintetiza** lo practicado en los We Do — taxonomía data|config|provider, máscaras de PII, `log` con correlation_id, fail-fast de config y cuarentena de filas. El resultado es un módulo de portfolio que un junior puede mostrar en GitHub. Usa solo datos sintéticos; sin claims de fraude ni parentesco."

### 6.14 Self-check (Autocheck) — 11 MCQs @ L2145-2223

All 11 `question`, `options[]`, `explanation` strings scanned. **CLEAN.** No grammar, concordance, or orthography findings. correctIndex distribution is fair (`0, 2, 3, 1, 0, 2, 3, 1, 0, 2, 3`).

The one LT flag worth noting: at `explanation` L2151 ("from e preserva la excepción original como causa encadenada."), LT flagged `E_SINGLE_CHAR` on the English word "e" (the Python variable name in `from e`). False positive — no action.

### 6.15 Resources @ L2225-2296

All 13 resources (7 docs + 2 books + 4 courses) have valid `label`, `url`, `note`. **CLEAN.** URLs resolve to canonical sources (Python docs, PEP 3134, OWASP, Real Python, MIT OCW 6.100L, Harvard CS50P, Coursera, O'Reilly). No dead links detected at scan time.

---

## 7. Proposed GitHub-style Diffs

> All diffs are proposals only; the auditor did not apply any of them.

### Diff 1 (H-1) — Replace off-topic matplotlib playground with on-topic exceptions/logging sandbox for Section 9

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -1136,13 +1136,40 @@ function InteractivePlaygroundDemo({ sectionId, sectionTitle }: { sectionId: str
       hint: 'Agrega una quinta fila y observa cómo cambian los groupby',
     },
-    'visualization': {
-      title: 'Practica matplotlib',
-      code: `# Practica matplotlib (se carga automaticamente)
-import matplotlib.pyplot as plt
-import numpy as np
-
-# Datos
-meses = ["Ene", "Feb", "Mar", "Abr", "May"]
-ventas_2024 = [120, 145, 138, 165, 178]
-ventas_2025 = [135, 158, 162, 180, 195]
-
-# Crear grafico
-fig, ax = plt.subplots(figsize=(8, 4))
-ax.plot(meses, ventas_2024, marker='o', label='2024')
-ax.plot(meses, ventas_2025, marker='s', label='2025')
-ax.set_title('Ventas mensuales')
-...
-      `,
-      hint: 'Cambia los datos de ventas y observa el gráfico',
+    'visualization': {
+      // S09 V3 retarget: Section 9 is now "Excepciones, debugging y logging seguro".
+      // The matplotlib sandbox was off-topic for the retargeted content.
+      title: 'Practica excepciones, chaining y logging sin PII',
+      code: `# Practica excepciones, chaining y logging estructurado (S09)
+import logging, io
+from decimal import Decimal, InvalidOperation
+
+class ParseError(Exception):
+    pass
+
+class ValidationError(Exception):
+    pass
+
+def parse_monto(raw):
+    try:
+        n = Decimal(str(raw).strip().replace(",", ".")).quantize(Decimal("0.01"))
+        if not n.is_finite():
+            raise InvalidOperation
+        return n
+    except (InvalidOperation, ValueError) as e:
+        raise ParseError(f"monto no parseable: {raw!r}") from e
+
+def mask_email(email):
+    local, _, domain = email.partition("@")
+    return f"{(local[:1] or '*')}***@{domain}" if domain else "***"
+
+# Prueba: cambia el valor de monto y observa el chaining
+for raw in ["12,50", "abc", "-1"]:
+    try:
+        print(raw, "->", parse_monto(raw))
+    except ParseError as e:
+        print(raw, "ERR", type(e).__name__, "->", type(e.__cause__).__name__ if e.__cause__ else None, e)
+print("email enmascarado:", mask_email("ana.rojas@ejemplo.pe"))
+      `,
+      expectedOutput: `12,50 -> 12.50
+abc ERR ParseError -> InvalidOperation monto no parseable: 'abc'
+-1 ERR ParseError -> None monto no parseable: '-1'
+email enmascarado: a***@ejemplo.pe`,
+      hint: 'Cambia "abc" por un número válido y observa cómo cambia el chaining; prueba también "Infinity" o "NaN".',
     },
```

### Diff 2 (H-2) — Fix PDF report label for Section 9

```diff
--- a/src/components/course/PdfReport.tsx
+++ b/src/components/course/PdfReport.tsx
@@ -46,7 +46,7 @@ const SECTION_NAMES: Record<string, string> = {
   "data-acquisition": '7. Data Acq',
   pandas: '8. Pandas',
-  visualization: '9. Viz',
+  visualization: '9. Excepciones & logs',
   sklearn: '10. sklearn',
   testing: '11. Testing',
```

### Diff 3 (M-1) — Remove duplicated `hint:` field (sample for first exercise; replicate pattern for the other 20 duplicates)

```diff
--- a/src/lib/course/sections/s09-visualization.ts
+++ b/src/lib/course/sections/s09-visualization.ts
@@ -746,10 +746,6 @@ export const section09: CourseSection = {
         kind: "guided",
         instruction:
           "Mapea los 5 fallos sintéticos del starter (CASO-LIM-009 intake) al tipo de excepción más adecuado e imprime cada línea como `fallo -> Tipo` en el orden del array. No uses Exception genérico para todos; incluye un `ValidationError` de dominio para la regla de negocio (monto < 0).",
-        hint: "Piensa: tipo incorrecto vs valor ilegal vs clave ausente vs I/O vs genérico de dominio.",
         hints: [
           "Piensa: tipo incorrecto vs valor ilegal vs clave ausente vs I/O vs genérico de dominio.",
           "Usa TypeError, ValueError, KeyError, FileNotFoundError y un custom ValidationError.",
```

*(Apply the same removal for: `S09-T1-A-E2`, `S09-T1-A-E3`, `S09-T1-B-E1`, `S09-T1-B-E2`, `S09-T2-A-E1`, `S09-T2-A-E2`, `S09-T2-A-E3`, `S09-T2-B-E1`, `S09-T2-B-E2`, `S09-T2-B-E3`, `S09-T3-A-E1`, `S09-T3-A-E3`, `S09-T3-B-E1`, `S09-T3-B-E2`, `S09-T4-A-E1`, `S09-T4-A-E2`, `S09-T4-A-E3`, `S09-T4-B-E1`, `S09-T4-B-E2`, `S09-T4-B-E3` — i.e. every exercise where `hint === hints[0]`.)*

### Diff 4 (M-2a) — Fix concordance in CP-N1-C callout content

```diff
--- a/src/lib/course/sections/s09-visualization.ts
+++ b/src/lib/course/sections/s09-visualization.ts
@@ -36,7 +36,7 @@ export const section09: CourseSection = {
       callout: {
         type: "info",
         title: "Inicio CP-N1-C",
         content:
-          "Gate operativo: bitácora auditable que nunca registra email/teléfono/dirección completos y diferencia fallo de datos, configuración y proveedor. Sin claims de fraude ni parentesco.",
+          "Gate operativo: bitácora auditable que nunca registra email/teléfono/dirección completos y diferencia fallos de datos, configuración y proveedor. Sin claims de fraude ni parentesco.",
       },
```

### Diff 5 (M-2b) — Fix concordance in S09-T3-A-E3 feedback

```diff
--- a/src/lib/course/sections/s09-visualization.ts
+++ b/src/lib/course/sections/s09-visualization.ts
@@ -1507,7 +1507,7 @@ export const section09: CourseSection = {
         tests: "Contrato exacto: `RESULT=3` y línea LOGS con event=start y event=done; exit 0.",
-        feedback: "Stdout de datos limpio (RESULT=…); progreso del job en el logger — preview del contrato CLI de S10.",
+        feedback: "Stdout de datos limpios (RESULT=…); progreso del job en el logger — preview del contrato CLI de S10.",
```

### Diff 6 (M-2c) — Fix "aún así" → "aun así" in S09-T1-B-E1 instruction

```diff
--- a/src/lib/course/sections/s09-visualization.ts
+++ b/src/lib/course/sections/s09-visualization.ts
@@ -914,7 +914,7 @@ export const section09: CourseSection = {
         kind: "guided",
         instruction:
-          "Completa el `finally` en `work` para marcar `state['closed']=True` aunque haya excepción. El camino feliz imprime ok; el fallo propaga RuntimeError y aún así deja closed True (CASO-LIM-009).",
+          "Completa el `finally` en `work` para marcar `state['closed']=True` aunque haya excepción. El camino feliz imprime ok; el fallo propaga RuntimeError y aun así deja closed True (CASO-LIM-009).",
```

### Diff 7 (M-2d, M-2e) — Fix "re-lanza" → "relanza" (2 occurrences)

```diff
--- a/src/lib/course/sections/s09-visualization.ts
+++ b/src/lib/course/sections/s09-visualization.ts
@@ -856,7 +856,7 @@ export const section09: CourseSection = {
         kind: "transfer",
         instruction:
-          "Define `DataLoadError` y `load_text(path_fn)` que captura `OSError` del lector (callable que simula open) y re-lanza `DataLoadError` con `raise ... from e`. Imprime el tipo del error y de `__cause__` (CASO-LIM-009 intake).",
+          "Define `DataLoadError` y `load_text(path_fn)` que captura `OSError` del lector (callable que simula open) y relanza `DataLoadError` con `raise ... from e`. Imprime el tipo del error y de `__cause__` (CASO-LIM-009 intake).",
@@ -1029,7 +1029,7 @@ export const section09: CourseSection = {
         tests: "Contrato exacto: bad traga ambos; good_v → quarantine; good_r re-lanza RuntimeError capturado como raised; exit 0.",
+        tests: "Contrato exacto: bad traga ambos; good_v → quarantine; good_r relanza RuntimeError capturado como raised; exit 0.",
```

### Diff 8 (M-2f) — Fix "re-correr" → "recorrer" in theory block 9

```diff
--- a/src/lib/course/sections/s09-visualization.ts
+++ b/src/lib/course/sections/s09-visualization.ts
@@ -375,7 +375,7 @@ export const section09: CourseSection = {
       paragraphs: [
-        "**Retry solo errores transitorios** (`TimeoutError`, HTTP 503, red). Un `ValueError` de datos **no** se reintenta: va a **cuarentena** con `error_class=data`. Reintentar un monto inválido no lo hace válido: solo gasta cuota del proveedor, multiplica logs ERROR y confunde al on-call del intake CASO-LIM-009 a las 02:10.",
-        "Operaciones **idempotentes** (misma clave de escritura) permiten re-correr un job sin duplicar side-effects. Clave típica: `(source, record_id, version)` más un hash del payload — el mismo espíritu del **manifest de S08**, ahora a nivel de re-ingesta tras un retry, un redeploy nocturno o un reprocess parcial del lote cuarentenado.",
+        "**Retry solo errores transitorios** (`TimeoutError`, HTTP 503, red). Un `ValueError` de datos **no** se reintenta: va a **cuarentena** con `error_class=data`. Reintentar un monto inválido no lo hace válido: solo gasta cuota del proveedor, multiplica logs ERROR y confunde al on-call del intake CASO-LIM-009 a las 02:10.",
+        "Operaciones **idempotentes** (misma clave de escritura) permiten recorrer un job sin duplicar side-effects. Clave típica: `(source, record_id, version)` más un hash del payload — el mismo espíritu del **manifest de S08**, ahora a nivel de re-ingesta tras un retry, un redeploy nocturno o un reprocess parcial del lote cuarentenado.",
```

### Diff 9 (M-3a) — Standardize "vs" → "vs." across the section (8 occurrences)

```diff
--- a/src/lib/course/sections/s09-visualization.ts
+++ b/src/lib/course/sections/s09-visualization.ts
@@ -28,7 +28,7 @@ export const section09: CourseSection = {
-        "Hilo conductor: un **pipeline de intake sintético** (clientes `C00x`, emails `ejemplo.pe`, montos con `Decimal`). Validar filas, encadenar causas, **redactar PII** en logs y decidir **fail-fast** (config) vs cuarentena (data). Entorno **local-python**. Reutiliza normalizadores de S05–S07 y los conteos reconciliados de S08: cada fila en cuarentena debería poder llevar `error_class` y `correlation_id` para el postmortem.",
+        "Hilo conductor: un **pipeline de intake sintético** (clientes `C00x`, emails `ejemplo.pe`, montos con `Decimal`). Validar filas, encadenar causas, **redactar PII** en logs y decidir **fail-fast** (config) vs. cuarentena (data). Entorno **local-python**. Reutiliza normalizadores de S05–S07 y los conteos reconciliados de S08: cada fila en cuarentena debería poder llevar `error_class` y `correlation_id` para el postmortem.",
@@ -97,7 +97,7 @@ export const section09: CourseSection = {
-        "No uses **`except:` bare** ni tragues `Exception` sin re-raise o cuarentena documentada. Decide en el borde: **manejar** (recuperable: fila mala del CSV) vs propagar (fatal: config inválida, encoding vacío). `except Exception: pass` es la forma más rápida de esconder corrupción de datos en producción y de mentir al on-call.",
+        "No uses **`except:` bare** ni tragues `Exception` sin re-raise o cuarentena documentada. Decide en el borde: **manejar** (recuperable: fila mala del CSV) vs. propagar (fatal: config inválida, encoding vacío). `except Exception: pass` es la forma más rápida de esconder corrupción de datos en producción y de mentir al on-call.",
@@ -333,7 +333,7 @@ export const section09: CourseSection = {
-      heading: "Fallar rápido vs continuar con cuarentena",
+      heading: "Fallar rápido vs. continuar con cuarentena",
@@ -748,7 +748,7 @@ export const section09: CourseSection = {
-          "Mapea los 5 fallos sintéticos del starter (CASO-LIM-009 intake) al tipo de excepción más adecuado e imprime cada línea como `fallo -> Tipo` en el orden del array. No uses Exception genérico para todos; incluye un `ValidationError` de dominio para la regla de negocio (monto < 0).",
+          "Mapea los 5 fallos sintéticos del starter (CASO-LIM-009 intake) al tipo de excepción más adecuado e imprime cada línea como `fallo -> Tipo` en el orden del array. No uses Exception genérico para todos; incluye un `ValidationError` de dominio para la regla de negocio (monto < 0).",
 *(Plus 4 more `vs` occurrences in instruction L750 hint chain.)*
```

> **Note:** Diff 9 is optional. The RAE accepts both `vs` (modern tech usage) and `vs.` (traditional). If the course style guide already prefers one, follow that; otherwise pick `vs.` and apply consistently.

### Diff 10 (M-5) — Split the two run-on theory sentences for cognitive load

```diff
--- a/src/lib/course/sections/s09-visualization.ts
+++ b/src/lib/course/sections/s09-visualization.ts
@@ -184,7 +184,8 @@ export const section09: CourseSection = {
-        "Un **test de regresión** rojo→verde documenta la causa raíz y evita reintroducir el fallo en el siguiente PR. 5-whys ligero: no pares en el síntoma («KeyError email») — pregunta si el schema del lote de S08 realmente exige esa clave en todas las filas o si el productor omitió un campo opcional sin documentarlo.",
+        "Un **test de regresión** rojo→verde documenta la causa raíz y evita reintroducir el fallo en el siguiente PR. 5-whys ligero: no pares en el síntoma («KeyError email»). Pregunta si el schema del lote de S08 realmente exige esa clave en todas las filas o si el productor omitió un campo opcional sin documentarlo.",
@@ -336,7 +337,8 @@ export const section09: CourseSection = {
-        "**Fail-fast** en config: seguir con schema roto multiplica basura y envenena el **manifest de S08**. **Cuarentena** en data: una fila mala **no** debe tumbar el lote entero — el mismo gate de reconciliación (`in == ok + quarantined`), ahora con `error_class` y `correlation_id` explícitos en cada rechazo para el postmortem de CP-N1-C.",
+        "**Fail-fast** en config: seguir con schema roto multiplica basura y envenena el **manifest de S08**. **Cuarentena** en data: una fila mala **no** debe tumbar el lote entero. El mismo gate de reconciliación (`in == ok + quarantined`), ahora con `error_class` y `correlation_id` explícitos en cada rechazo para el postmortem de CP-N1-C.",
@@ -2042,7 +2044,8 @@ export const section09: CourseSection = {
-      "Inicias **CP-N1-C**: una bitácora de pipeline que **sintetiza** lo practicado en los We Do — taxonomía data|config|provider, máscaras de PII, `log` con correlation_id, fail-fast de config y cuarentena de filas — en un módulo de portfolio que un junior puede mostrar en GitHub. Usa solo datos sintéticos; sin claims de fraude ni parentesco.",
+      "Inicias **CP-N1-C**: una bitácora de pipeline que **sintetiza** lo practicado en los We Do — taxonomía data|config|provider, máscaras de PII, `log` con correlation_id, fail-fast de config y cuarentena de filas. El resultado es un módulo de portfolio que un junior puede mostrar en GitHub. Usa solo datos sintéticos; sin claims de fraude ni parentesco.",
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Effort | Impact |
|---|---|---|---|
| **P0** | H-1: Replace matplotlib playground with on-topic exceptions/logging sandbox for `'visualization'` key | Small (one map entry rewrite + on-topic code sample) | Eliminates the most visible content mismatch; learners opening S09 see consistent on-topic interactive code. |
| **P0** | H-2: Update `PdfReport.SECTION_NAMES['visualization']` to `'9. Excepciones & logs'` | Trivial (1-line edit) | Eliminates learner-visible mislabeling in exported PDF. |
| **P1** | M-2a: Fix "diferencia fallo" → "diferencia fallos" (CP-N1-C callout) | Trivial | Real concordance error in the section's central callout. |
| **P1** | M-2b: Fix "Stdout de datos limpio" → "limpios" (S09-T3-A-E3 feedback) | Trivial | Real concordance error in feedback string learners see after solving. |
| **P1** | M-2c: Fix "aún así" → "aun así" (S09-T1-B-E1 instruction) | Trivial | Real diacritic error per RAE. |
| **P1** | M-2d/e/f: Fix "re-lanza" / "re-correr" → "relanza" / "recorrer" (3 occurrences) | Trivial | Real orthography per RAE. |
| **P2** | M-1: Remove duplicated `hint:` field (21 of 24 We Do exercises) | Small (mechanical, scriptable) | Removes DRY violation and maintenance hazard. |
| **P2** | M-3a: Standardize `vs` → `vs.` (8 occurrences) — optional, follow style guide | Trivial if style guide agrees | Typographic consistency. |
| **P3** | M-5: Split 3 run-on sentences (theory block 5 P3, theory block 8 P2, youDo context) | Trivial | Cognitive-load reduction; not a correctness issue. |
| **P3** | M-4: Document file-name/id mismatch in a style guide / AGENT_STATE note | Trivial | Prevents future retargets from repeating the H-1/H-2 pattern. |
| **P4** | M-3b: Standardize "postmortem" treatment (italicize or use "post mórtem") | Trivial if style guide agrees | Editorial polish. |

---

## 9. Graph Memory Update Notes

For the shared `course-state/curriculum_hardening/GRAPH_MEMORY.json` and any future agent context:

- **Node added/updated:** `S09` — `id: "visualization"` (legacy, immutable per V3 retarget decision); `title: "Excepciones, debugging y logging seguro"`; `phase: 0`; `topic: exceptions_logging_resilience`; `gold_peer_comparison: S01, S02, S03, S07, S08`; `auditor_score: 8.0/10`.
- **Quality edges:**
  - `S08 → S09` (manifest/cuarentena reused; reconcile contract `in == ok + quarantined` extended with `error_class` + `correlation_id`).
  - `S09 → S10` (preview suave: handlers/formatters assembled in CLI entrypoint; S10 will formalize the CLI contract).
  - `S09 → CP-N1-C` (capstone gate; "Inicio CP-N1-C" callout at theory block 1).
- **Defect edges:**
  - `S09.stale_id` → `SectionView.demos['visualization']` (off-topic matplotlib sandbox, H-1).
  - `S09.stale_id` → `PdfReport.SECTION_NAMES['visualization']` ("9. Viz" label, H-2).
  - `S09.weDo_hint_duplication` → 21 of 24 We Do steps (M-1).
- **Cross-section hazard:** Any other section whose `id` no longer matches its `title` (post-V3 retarget) likely has the same downstream consumer mismatch. Recommend scanning `PdfReport.SECTION_NAMES` and `SectionView.demos` against each section's `title` field.
- **Grammar metric baseline (S09):** mean FH 73.32, median 72.4 (band: "fácil", appropriate for Phase 0); mean WPS 14.56; 3 run-on / 10 long sentences; 19 confirmed real LT findings after FP filter (6 concordance/orthography, 8 typography `vs.`, 5 other). Composite grammar sub-score: 7.5/10.

---

## Appendix A — Aggregate Grammar Metrics (S09)

| Metric | Value | Band / interpretation |
|---|---|---|
| Total sentences analyzed | 306 | — |
| Mean words/sentence | 14.56 | Within 15-32 sweet spot for technical Spanish |
| Median words/sentence | 13.50 | Healthy median |
| Max words/sentence | 55 | One run-on (theory block 5 P3) |
| Mean syllables/word | 1.978 | Normal Spanish lexical density |
| Mean Fernández-Huerta | 73.32 | "fácil" band — appropriate for Phase 0 (Fundamentos) |
| Median Fernández-Huerta | 72.40 | — |
| Min FH | -22.20 | Code-only sentence (false positive) |
| Max FH | 144.80 | Very short sentence |
| FH band distribution | muy fácil 106 · fácil 78 · bastante fácil 57 · normal 35 · bastante difícil 14 · difícil 6 · muy difícil 10 | Skewed toward "fácil/bastante fácil" — appropriate for Fundamentos; the "muy difícil" tail is driven by inline-code-heavy sentences, not by genuine prose complexity |
| Long sentences (>32 words) | 10 | M-5 |
| Run-on sentences (>45 words) | 3 | M-5 |
| LT total matches (raw) | 600 | — |
| LT matches after FP filter | 19 confirmed real + ~12 borderline | — |

## Appendix B — Files Inspected

- `/home/z/my-project/pyarcana_repo/src/lib/course/sections/s09-visualization.ts` (2,298 lines, full read)
- `/home/z/my-project/pyarcana_repo/src/lib/course/index.ts` (confirmed active import)
- `/home/z/my-project/pyarcana_repo/src/components/course/SectionView.tsx` (lines 912-1230, 4040-4065)
- `/home/z/my-project/pyarcana_repo/src/components/course/PdfReport.tsx` (lines 30-95)
- `/home/z/my-project/pyarcana_repo/course-state/curriculum_hardening/paragraph_analysis/S09_PARAGRAPHS.md`
- `/home/z/my-project/pyarcana_repo/course-state/curriculum_hardening/dossiers/S09_DONE.md`
- `/home/z/my-project/pyarcana_repo/course-state/curriculum_hardening/dossiers/S09_VERIFY.md`
- `/home/z/my-project/pyarcana_repo/course-state/curriculum_hardening/dossiers/S09_RESEARCH.md`
- `/home/z/my-project/pyarcana_repo/course-state/curriculum_hardening/GOLD_STANDARD_CHECKLIST.md`
- Live site: https://pillb.github.io/pyarcana/ (rendered Section 9 page, all 5 tabs verified present)

## Appendix C — Method Note (Spanish Grammar Audit Pipeline)

Per `/_GRAMMAR_SUBPLAN.md`:

1. **Prose extraction:** Custom Python tokenizer walked `s09-visualization.ts` and captured every prose-bearing field (`intro`, `why`, `instruction`, `description`, `hint`, `hints[]`, `feedback`, `heading`, `paragraphs[]`, `tests`, `context`, `portfolioNote`, `explanation`, `question`, `content`, `tagline`, `jobRelevance`, `objectives[]`, `requirements[]`, `edgeCases[]`). Code bodies (`code`, `output`, `starterCode`, `solutionCode`) excluded per subplan. 260 scalar prose values + 29 paragraph-block items = 289 prose units extracted; 306 sentences after Spanish-aware splitting.
2. **Offline heuristics:** Per sentence, computed WPS, SPW (vowel-group syllable counter with hiato/diptongo handling), Fernández-Huerta, INFLESZ/Szigriszt-Pazos, and the 13-rule pedagogical heuristic table from the subplan (long/run-on, missing terminal, missing `¿`/`¡`, unbalanced delimiters, repeated word, DET-NOUN concordance cue, English-dominant, meta/AI/TODO leak, gerund pile-up, high comma density, paragraph-one-sentence, anaphoric monotony, space-before-punct, double space).
3. **LanguageTool `es`:** Public API, 2 batches of ~12k chars each, 3.5s sleep between batches. 600 raw matches → 19 confirmed after FP filter (filter rules: tech-term allowlist, CamelCase detection, `__attr__` detection).
4. **False-positive classes documented:** (a) Inline code spans stripped for LT input create spurious "missing space before period" artifacts at code-adjacent punctuation (mitigated by replacing backtick code with `X` placeholder in re-run). (b) Tech nouns (`ValueError`, `TypeError`, `callable`, `propagate`, `id`, `done`, `time`) trigger `MORFOLOGIK_RULE_ES` and `PREP_VERB` false positives — filtered. (c) `SUBJUNTIVO_PASADO` fires on English words "time" and "done" — filtered. (d) `SUBJUNTIVO_INCORRECTO` fires on the correct Spanish imperative negative "No re-ejecutes" — filtered.
5. **Validation:** Nonzero prose extraction (289 units ✓); FH in plausible range (mean 73.32, median 72.4 ✓); all confirmed findings cited with source line numbers.

---

**This is the complete Explorer report for Section 9. Ready for the Fixer prompt.**
