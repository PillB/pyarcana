# Section 39 — Curriculum Auditor Report
## Pyarcana · Section 39 — `s39-integrator-phase2.ts` — "Responsible ML Case Triage y cierre de nivel"

> Task ID: S39 · Agent: Curriculum Auditor (general-purpose) · Scope: Section 39 only
> Source files audited:
> - `/home/z/my-project/pyarcana_repo/src/lib/course/sections/s39-integrator-phase2.ts` (2,351 lines)
> - `/home/z/my-project/pyarcana_repo/src/lib/course/index.ts` (line 42 import, line 77 in active list)
> - `/home/z/my-project/pyarcana_repo/src/components/course/SectionView.tsx` (interactive demo map, line 3,013)
> - `/home/z/my-project/pyarcana_repo/src/components/course/PdfReport.tsx` (section label map, line 79)
> - Live site: https://pillb.github.io/pyarcana/ (SPA, JS-rendered; verified Section 39 = `integrator-phase2`, shortTitle "Case Triage N3")
>
> Grammar subplan applied: `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`
> Artifacts produced for this audit:
> - `/home/z/my-project/audits/S39_prose.txt` — 261 learner-facing prose blocks
> - `/home/z/my-project/audits/S39_metrics.json` — per-sentence FH / INFLESZ / WPS / SPW + heuristics
> - `/home/z/my-project/audits/S39_lt.json` — LanguageTool (`es`) rule matches (3 chunks, 1,055 raw matches; 82 non-spelling)

---

## 1. Section Identification & Scope

**Section number confirmed:** 39 (thirty-ninth in the 52-section roadmap, position 39 in the active list inside `index.ts:77`).

**File:** `src/lib/course/sections/s39-integrator-phase2.ts`
**Section id:** `integrator-phase2`
**Index:** 39
**Title:** "Responsible ML Case Triage y cierre de nivel"
**Short title:** "Case Triage N3"
**Tagline:** "Responsible ML Case Triage con baseline, calibración, abstención, monitoreo y revisión; promoción N3 con regresión S27–S39 y CF-3"
**Estimated hours:** 19 · **Level:** "Competente a experto" · **Phase:** 2 (capstone integrator) · **Icon:** Award

**Scope of audit (only S39 learner-facing surface):**
- `jobRelevance` (1 paragraph)
- `learningOutcomes` (9 outcomes)
- `theory` array — 8 theory blocks (T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B), each with heading + 3 paragraphs + code + callout = 24 paragraphs + 8 callouts
- `iDo` — 1 intro + 8 demos (description / code / why)
- `weDo` — 1 intro + 24 exercises (3 per subtopic: guided / independent / transfer), each with instruction, hint(s), edgeCases, tests, feedback, starterCode, solutionCode
- `youDo` — title, context, 8 objectives, 6 requirements, ~120-line starterCode, portfolioNote, 9-criterion rubric
- `selfCheck` — 5 questions with 4 options + explanation each
- `resources` — 8 docs, 2 books, 6 courses

Out of scope (per audit instructions): pure code blocks, `starterCode`/`solutionCode` bodies, id-only strings.

---

## 2. Executive Summary of Quality

**Composite score: 7.2 / 10**

**Verdict:** Section 39 is **pedagogically gold-standard** (full I-Do / We-Do / You-Do / Self-Check / Resources fidelity; 8 demos + 24 exercises + a real CP-N3-C capstone bundle with manifest, audit log, three cards and postmortem; explicit anti-fraud / anti-parentesco / anti-self-promotion guardrails woven through every theory paragraph and every exercise; honest about `auto_fraud=False`, `self_declared_promotion=false`, external CF-3 review). The prose is healthy Spanish for technical curriculum (avg FH 64.06, avg WPS 12.16, avg SPW 2.17, **zero** missing inverted `¿¡`, **zero** double spaces, **zero** space-before-punct, **zero** repeated-word typos, **zero** anaphoric monotony, **zero** gerund pile-ups).

It loses points on four concrete, fixable fronts:

1. **HIGH — Off-topic interactive demo drift (H-1).** `SectionView.tsx:3013` loads a **CI/CD pipeline + monitoring** simulator as the "Pruébalo tú mismo" demo for `integrator-phase2`. It has nothing to do with Responsible ML Case Triage (no intake, no ER, no evidence packet, no audit, no human_only). Same legacy-id drift pattern flagged in S06 / S09 / S10 / S13 / S15.
2. **HIGH — PDF report mislabel (H-2).** `PdfReport.tsx:79` labels the section `39. Capstone P2` instead of its actual title ("Case Triage N3" / "Responsible ML Case Triage"). Same mislabel pattern flagged for S15.
3. **MEDIUM — Two run-on sentences in core theory (M-5).** A 53-word sentence (S39-T1-A, "El flujo canónico N3 es una cadena…") and a 48-word sentence (S39-T1-A, "Por qué este orden importa…") pack 6 and 3 semicolon-separated clauses respectively; both score FH ≤ 40.
4. **MEDIUM — Internal taxonomy leak (M-6).** 8 starterCode files begin with a `# CASO-LIM-039 · <topic>` header comment that exposes the author's internal case-ID taxonomy into the learner's editor (same P0-class pattern flagged for S10 / S15, there 24–31×; here 8×).

Style consistency findings (apply throughout, low cost to fix):
- `auto-declarar` / `auto-fraude` (17×) → RAE-preferred `autodeclarar` / `autofraude` (prefix joined).
- `postmortem` (13×) → `post mórtem` (two words, accented) when used as Spanish noun; or keep `postmortem` in italics as a foreignism.
- `misma entidad` (3×) without determiner → `la misma entidad`.
- `Checklist firmado por owner` → `El checklist firmado por el owner`.
- `(F,F)=normal, (T,F)=abstain_more, (F,T)=human_only` (6× in hints) → space after comma inside parens.
- `vs capacidad` / `reviewer vs admin` (4×) → `vs. capacidad` with period, or rewrite with `frente a` / `contra`.

**Bottom line:** Pedagogical architecture and content safety are excellent; production polish (demo + PDF label) and a handful of redaction fixes are what separate S39 from a 9+ score.

---

## 3. Detailed Issue Registry

| # | ID | Severity | Evidence (excerpt) | Pedagogical impact |
|---|----|----------|--------------------|--------------------|
| 1 | H-1 | HIGH | `SectionView.tsx:3013-3065` — `demos['integrator-phase2']` is `{ title: 'Practica CI/CD y monitoreo', code: … ci_pipeline … }`. | Learner opens "Pruébalo tú mismo" expecting to manipulate intake / ER / packet / queue and gets a `time.sleep`-driven CI/CD simulator with lint/test/build/deploy_canary steps. Breaks the mental model just built by 8 theory blocks and 8 I-Do demos. Same drift class as S15 (`demos['stdlib-deep']` loading functools/itertools into a Pandas section). |
| 2 | H-2 | HIGH | `PdfReport.tsx:79` — `"integrator-phase2": '39. Capstone P2'`. | The downloadable PDF report labels the section with the generic roadmap slot name ("Capstone P2") instead of the actual title ("Case Triage N3" / "Responsible ML Case Triage"). Misaligns the learner's PDF with the live UI and with S38 (`38. Concurrencia`) / S40 (`40. Agentic`) neighbors. |
| 3 | H-3 | HIGH (redaction) | `s39-integrator-phase2.ts:67` — 53-word sentence: "El flujo canónico N3 es una cadena con fronteras claras: intake normaliza registros sintéticos; ER decide misma entidad (no familia ni culpa); el grafo relacional expone paths de co-ocurrencia; features se materializan sin leakage de labels futuros; el modelo emite un score de prioridad; la cola recibe el caso para revisión humana." | FH = 11.3 (extremely difficult), 6 semicolon-separated clauses in one sentence. A learner's working memory cannot hold 6 stages + their constraints in one breath. The sentence is the **first** paragraph of the **first** subtopic of T1 — first-impression cognitive overload. |
| 4 | H-4 | HIGH (redaction) | `s39-integrator-phase2.ts:68` — 48-word sentence: "Por qué este orden importa: ER antes del grafo evita filtrar features con una identidad mal resuelta; features antes del score impiden que el modelo use labels futuros de la cola; la cola al final fuerza HITL (human-in-the-loop: un revisor decide, no el score solo)." | FH = 39.1 (muy difícil). Three causal chains in one sentence; the `(human-in-the-loop: …)` gloss inside parentheses further splits attention. |
| 5 | M-1 | MEDIUM (style) | 17 occurrences of `auto-declarar` / `auto-fraude` / `auto-declara` / `auto-declares` / `auto-declaras` (prefix `auto-` separated by hyphen). LanguageTool rule `PREFIJOS_JUNTOS_EN_DICCIONARIO` fires on each. | RAE (Diccionario panhispánico de dudas, 2005 §"Prefijos") recommends joining the prefix when the resulting word is in the dictionary or readily understandable: `autodeclarar`, `autofraude`. Hyphenation is reserved for cases where the next element starts with capital letter or is a multiword. Course-wide inconsistency: the same prefix appears joined in `auto_fraud` (code identifier, OK) but hyphenated in prose. |
| 6 | M-2 | MEDIUM (style) | 13 occurrences of `postmortem` (no accent, one word). LT rule `ES_SIMPLE_REPLACE_MULTIWORDS_POSTMORTEM`. | Spanish adoption is `post mórtem` (two words, accent on `mórtem`); the course uses the English spelling inconsistently. Also: `postmortem blameless` reads as English noun phrase; the Hispanized `post mórtem blameless` or `revisiones post mórtem sin culpables` reads better in es-PE. |
| 7 | M-3 | MEDIUM (grammar) | 3 occurrences of `misma entidad` without determiner: (a) `s39:67` "ER decide misma entidad"; (b) `s39:69` "ER puede proponer misma entidad"; (c) We-Do hint "ER solo habla de misma entidad". LT rule `MISMO_EL_MISMO`. | Spanish requires the determiner: `la misma entidad`. The omission is grammatically substandard in formal es-PE even when the loanword context (ER = Entity Resolution) makes the meaning recoverable. |
| 8 | M-4 | MEDIUM (grammar) | `s39:133` — callout content "Checklist firmado por owner." LT rule `AGREEMENT_POSTPONED_ADJ`. | Missing article + determiner: should be "El checklist firmado por el owner." (or "Firmado por el dueño del artefacto"). Currently reads as a telegraphic fragment, not a sentence. |
| 9 | M-5 | MEDIUM (redaction) | 14 sentences > 32 words across theory paragraphs and the `jobRelevance` / `iDo.intro` / `youDo.context` fields (see §6 for full list). | Even where FH is still in the 40–60 "normal" band, WPS > 32 is the soft ceiling for technical Spanish pedagogy. Long sentences tax working memory and blur the boundary between conceptual exposition and the next code block. |
| 10 | M-6 | MEDIUM (meta-leak) | 8 starterCode files begin with a `# CASO-LIM-039 · <topic>` header comment (lines 986, 1472, 1656, 1765, 1822, 1886, 1943, 1982). | The `CASO-LIM-039` token is the author's internal taxonomy ID for the synthetic case. Learners see it as the first line of their starterCode in 8 of 24 exercises — it's a leak of the author's case-management vocabulary into the learner's editor. Compare S15 audit (CASO-LIM-015, 24×, flagged P0); S10 (CASO-LIM-010, 31×). S39 is less pervasive but the same pattern class. |
| 11 | M-7 | LOW-MEDIUM (typography) | 6 occurrences of `(F,F)=normal, (T,F)=abstain_more, (F,T)=human_only` across We-Do hints (`s39:1646-1648`, `s39:208-210`). LT rule `COMMA_PARENTHESIS_WHITESPACE`. | Spanish typography requires a space after every comma, including inside parentheses: `(F, F)=normal, (T, F)=abstain_more, (F, T)=human_only`. |
| 12 | M-8 | LOW (grammar) | `edgeCases` array item: "registry de 4 artefactos conceptual" (`s39:980`). LT rule `AGREEMENT_POSTPONED_ADJ`. | `conceptual` should agree with `artefactos` (masc plural): `registry de 4 artefactos conceptuales`. Currently reads as singular adjective modifying a plural noun. |
| 13 | M-9 | LOW (typography) | 4 occurrences of `vs` without period: `vs capacidad`, `reviewer vs admin`, `rollback vs recalibrar`, etc. LT rule `PUNTO_EN_ABREVIATURAS`. | Spanish abbreviation `vs.` (from Latin *versus*) takes a period. RAE accepts `vs` without period in some contexts but LT enforces the period. Recommend `vs.` or rewrite to `frente a` / `contra`. |
| 14 | M-10 | LOW (voice) | 41 occurrences of `# DEFECTO:` and 8 occurrences of `# Contrato: corrige el defecto del predicado; la salida debe coincidir con el enunciado` in starterCode comments. | These are **intentional pedagogical scaffolding** (labeling the bug the learner must fix), so they are not strict meta-leak — but the second-person authorial voice ("corrige el defecto del predicado") crosses slightly from learner-facing instruction into author-to-learner contract note. Pedagogically acceptable; flagged for awareness. |
| 15 | L-1 | LOW (style) | 2 occurrences of `URLs` (plural). LT rule `SIGLAS`. | Spanish rule: siglas are invariable in plural (`las URL`, not `las URLs`). RAE accepts both in practice but recommends the invariable form. |
| 16 | L-2 | LOW (false positive logged) | 4 "unbalanced delimiter" heuristic hits — all caused by the `incl.` abbreviation being unprotected in the sentence splitter, e.g. "Semver major + owner + regresión de contratos (incl. paths del grafo) evitan packets incompatibles…". | Not a real grammar error; the sentence is balanced. But `incl.` is rare in es-PE pedagogical prose — `incluyendo` is clearer. |
| 17 | L-3 | LOW (style) | 58 sentences with high comma density (>0.12 commas per word). | Many are intentional lists ("Entrada: case_id, score, evidence, graph_path") — not strictly wrong but they contribute to WPS pressure. Convert list-heavy sentences to bullet form. |
| 18 | L-4 | LOW (style) | `iDo.intro` (`s39:405`): 39-word run-on enumerating 8 topics: "Te muestro el cierre del nivel N3: pipeline canónico, registry con owners, evidence packet, decisiones con override, checklist de riesgo, modos ops, aceptación/regresión y cards de valor — siempre con fixtures sintéticos y sin auto-declarar promoción ni CF-3." | Functions as a table-of-contents sentence; WPS=39, FH=30.1. Acceptable as a "what's coming" preamble but pedagogically would benefit from being split or rendered as a list. |
| 19 | L-5 | LOW (consistency) | `s39:34` says "ensamblas lo ya aprendido en S27–S38" but `s39:8` and `s39:42` and the rubric say "regresión S27–S39". | The theory paragraph claims S27–S38 is "lo ya aprendido", but the regression scope is S27–S39 (i.e., S39 is included in its own regression smoke). Minor scope wording inconsistency — should clarify "ensamblas lo aprendido en S27–S38; esta sección se auto-incluye en el smoke de regresión S27–S39". |

**Total findings:** 4 HIGH, 10 MEDIUM, 5 LOW = 19 issues.

---

## 4. Meta-Leak Report

### 4.1 Confirmed meta-leak — interactive demo drift (H-1)

**Exact leaked text / location:** `src/components/course/SectionView.tsx` line 3,013–3,065:

```
'integrator-phase2': {
  title: 'Practica CI/CD y monitoreo',
  code: `# Simulacion de CI/CD pipeline y monitoreo
import time
import random

# Simular pipeline CI/CD
def ci_pipeline(commit_hash):
    """Simula un pipeline de CI/CD."""
    steps = [
        ("lint", 0.1, 0.0),      # (nombre, duracion, prob_fallo)
        ("test", 0.2, 0.05),
        ("build", 0.3, 0.02),
        ("deploy_canary", 0.15, 0.03),
        ("smoke_test", 0.1, 0.01),
        ("promote_100", 0.05, 0.0),
    ]
    …
```

This is rendered at the bottom of every Theory tab under the heading **"Pruébalo tú mismo"** (line 4,053). For Section 39, the heading promises an interactive playground for Responsible ML Case Triage but the editor is preloaded with a CI/CD pipeline simulator (lint → test → build → deploy_canary → smoke_test → promote_100). The mismatch is jarring because:
- The 8 theory blocks just taught `intake → ER → relation_graph → features → model_score → queue`.
- The 8 I-Do demos all manipulate `stages = ["intake", "er", "relation_graph", "features", "model_score", "queue"]`.
- The "Pruébalo tú mismo" editor loads an entirely different pipeline (CI/CD), with no `intake`, no `evidence packet`, no `audit`, no `human_only`, no `auto_fraud=False`.

### 4.2 Confirmed meta-leak — PDF label drift (H-2)

**Exact leaked text / location:** `src/components/course/PdfReport.tsx` line 79:

```
"integrator-phase2": '39. Capstone P2',
```

Compare the canonical short title in the source: `shortTitle: "Case Triage N3"` (`s39:7`). The PDF report labels every section with a hand-curated short string, and for S39 it falls back to the roadmap slot name ("Capstone P2") instead of the actual short title. Adjacent labels for context (lines 76–82):
- `"ai-apis-advanced": '36. AI APIs'`
- `"dbt-bigquery": '37. dbt/BQ'`
- `"performance-extreme": '38. Concurrencia'`
- `"integrator-phase2": '39. Capstone P2'`  ← drift
- `"agentic-architecture": '40. Agentic'`
- `"llm-finetuning": '41. FineTune'`

Every neighbor uses a meaningful short label; S39 alone uses the generic phase name.

### 4.3 Borderline meta-leak — `CASO-LIM-039` taxonomy in starterCode (M-6)

**Exact leaked text / location:** 8 starterCode files begin with the comment header `# CASO-LIM-039 · <topic>`:

| Line | Starter file | Header comment |
|------|--------------|----------------|
| 986  | `s39-t1-b-e3.py` | `# CASO-LIM-039 · registry owners+bump` |
| 1472 | `s39-t3-a-e2.py` | `# CASO-LIM-039 · secrets_in_repo block` |
| 1656 | `s39-t3-b-e2.py` | `# CASO-LIM-039 · drift/incident modes` |
| 1765 | `s39-t4-a-e1.py` | `# CASO-LIM-039 · acceptance no auto_fraud` |
| 1822 | `s39-t4-a-e2.py` | `# CASO-LIM-039 · regression notes gate` |
| 1886 | `s39-t4-a-e3.py` | `# CASO-LIM-039 · e2e path matrix` |
| 1943 | `s39-t4-b-e1.py` | `# CASO-LIM-039 · model/data/system cards` |
| 1982 | `s39-t4-b-e2.py` | `# CASO-LIM-039 · value metrics not only auc` |

These are the 8 "transfer" (E3 + E2 in some subtopics) exercises where the starterCode is more elaborate. The header comment exposes the author's internal case-management ID (`CASO-LIM-039`) plus an English shorthand topic slug (`registry owners+bump`, `value metrics not only auc`) that does not appear anywhere in the learner-facing theory or instruction text. This is the same P0-class pattern flagged in:
- S15 audit (`CASO-LIM-015`, 24×, "P0 leak of internal taxonomy into starterCode").
- S10 audit (`CASO-LIM-010`, 31×).

**Severity rationale for S39:** the leak is real (8×) but far less pervasive than S10 / S15. The 8 headers are also the only places where English slug phrases like `value metrics not only auc` or `e2e path matrix` appear in code comments — these read as author notes rather than learner scaffolding.

### 4.4 No other meta-leak found

Searched the entire 2,351-line source file for: `TODO`, `FIXME`, `XXX`, `HACK`, `placeholder`, `lorem`, `wip`, `coming soon`, `moved from`, `mover a`, `borrar` (outside quiz options), `TBD`. No matches that constitute developer-to-developer meta-text. The 41 `# DEFECTO:` comments in starterCode are pedagogical scaffolding (intentional bug labels), not meta-leak — see M-10.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pedagogical structure (I Do / We Do / You Do / Self-Check fidelity)

**I Do — 8 demos (one per subtopic):** ✅ Excellent. Each demo is a self-contained Python script that mirrors the corresponding theory block's `code` example but is slightly different (so the learner sees a second instance, not a copy-paste). Every demo has `description` (what it does), `code` (the runnable snippet), and `why` (one-sentence pedagogical rationale). The 8 demos form a complete vertical slice: pipeline → registry → packet → decisions → checklist → ops modes → acceptance → value/cards.

**We Do — 24 exercises (3 per subtopic):** ✅ Excellent. Each subtopic has the canonical guided → independent → transfer progression:
- E1 (`kind: "guided"`): single fixture, the starter has one inverted-predicate defect, learner fixes the predicate, expected output is `S39-T*-A PASS`.
- E2 (`kind: "independent"`): three fixtures (valid / adverse / missing), three expected output tokens, learner fixes the predicate AND maintains the missing-check.
- E3 (`kind: "transfer"`): three or four scenarios with more complex control flow, learner implements the full decision function.

Every exercise includes `hint`, `hints` (progressive — first generic, then more specific), `edgeCases` (3 each), `tests` (one-line expected-output description), `feedback` (one-sentence post-solve takeaway), `starterCode` (with the DEFECTO scaffold), and `solutionCode` (with assertions and the canonical output). This is the gold-standard We-Do structure.

**You Do — CP-N3-C capstone bundle:** ✅ Excellent. ~120-line Python starter implementing a real `triage()` function, `EvidencePacket` dataclass (frozen), `append_audit()` writer, `build_bundle()` orchestrator that writes `packets.json`, `audit.jsonl`, `model-card.md`, `data-card.md`, `system-card.md`, `manifest.json` (with sha256). Includes a `force_failure` path that triggers rollback to `human_only`. The portfolio note is honest ("no auto-declares promoción"). The 9-criterion rubric includes 2 hard gates (`gate process`, `gate privacy`) and 1 bonus checklist. This is a portfolio-grade artifact.

**Self-Check — 5 questions:** ✅ Good. Five multiple-choice questions covering: `label_space`, regression/CF-3 gates, evidence packet, fail-closed mode, semver breaking-change. Each has 4 options (one clearly correct, three plausible distractors) and a 1–2-sentence explanation. The questions map 1:1 to the 5 highest-priority learning outcomes.

**Overall fidelity:** Full I/We/You/SelfCheck. Connective tissue is strong — every subtopic ID (`S39-T1-A` through `S39-T4-B`) appears in theory headings, I-Do `subtopicId`, We-Do `subtopicId`, and exercises reference the canonical tokens (`CONTINUE`, `REJECT_STAGE_ORDER`, `MISSING:label_space`, `REJECT_BUMP_POLICY`, `ESCALATE_NO_OWNER`, `REJECT_PACKET_INCOMPLETE`, `REJECT_SCORE_ALONE`, `REQUEST_UNCERTAINTY`, `REJECT_OVERRIDE`, `MISSING:second_reviewer`, `REJECT_NO_AUDIT`, `REQUEST_FEEDBACK_ID`, `REJECT_RELEASE`, `REJECT_SECRETS`, `MISSING:rbac`, `REQUEST_SLICE_METRICS`, `REJECT_SLICE_FP`, `REJECT_MODE`, `REQUEST_PREV_MODEL`, `MONITOR abstain_more`, `ROLLBACK previous_model`, `REJECT_ACCEPTANCE`, `REJECT_AUTO_PASS`, `MISSING:regression_scope`, `REJECT_HAPPY_ONLY`, `REQUEST_DEMO_PATH`, `REJECT_CARDS`, `REJECT_VALUE_METRICS`, `MISSING:value`, `REJECT_BLAMEFUL`, `REQUEST_ROOT_CAUSE`, `REQUEST_ACTIONS`) consistently across theory, demos, exercises, and self-check.

### 5.2 Cognitive load & progressive disclosure

**Strengths:**
- The 4-topic × 2-subtopic grid (T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B) gives a stable mental scaffold.
- Each theory block follows the same 3-paragraph rhythm: (1) conceptual definition, (2) input / output / error / success contract, (3) application to the synthetic case `CASO-LIM-039-T*A`. Predictable structure reduces cognitive load.
- The "Entrada / Salida / Error / Éxito" pattern is used in 6 of 8 theory blocks — a strong pedagogical contract pattern.
- The dictionary paragraph at the very start (`s39:31`) front-loads all 6 key terms before T1 — good progressive disclosure.

**Weaknesses:**
- T1-A opens with a 53-word sentence (H-3) — first-impression overload.
- T1-A second paragraph is a 48-word sentence (H-4) with 3 causal chains.
- The `iDo.intro` is a 39-word run-on listing 8 topics (L-4).
- The `weDo.intro` is a 35-word sentence (FH=46) packing 4 ideas.
- The `youDo.context` is 28 words with 6 commas.
- These long preamble sentences function as compressed tables-of-contents; splitting them into 2-sentence units (or rendering them as short bullet lists) would reduce cognitive load without losing content.

### 5.3 Consistency with the overall roadmap and previous sections

**Strengths:**
- Honest and explicit cross-references to S27–S38 throughout (ER, grafo, features, ranking, calibración S34, explicación S35, monitoreo, colas).
- The "regresión S27–S39" smoke is named consistently in tagline, theory, demos, exercises, youDo, rubric, selfCheck.
- `auto_fraud=False`, `self_declared_promotion=false`, `CF-3 con revisión externa` — three guardrails repeated consistently across 8 theory blocks, 8 demos, 24 exercises, 1 youDo, 5 selfCheck questions. This is exemplary consistency.
- The phase-2 capstone role (cierre de nivel N3) is clearly framed.

**Weaknesses:**
- L-5: theory paragraph `s39:34` says "ensamblas lo ya aprendido en S27–S38" while the regression scope is S27–S39. The wording should clarify that S39 is part of its own regression smoke (i.e., "ensamblas S27–S38 y esta sección se auto-incluye en el smoke S27–S39").
- The PDF label drift (H-2) breaks roadmap alignment at the artifact level.

### 5.4 Comparison with best-in-class external materials

| Topic | External reference | Pyarcana S39 comparison |
|-------|--------------------|--------------------------|
| Responsible ML / Model cards | Google Model Cards (Mitchell et al. 2019); NIST AI RMF. | S39 covers all three card types (model / data / system), references both Google and NIST in `resources.docs`. The card content in `youDo.starterCode` (lines 2,161–2,188) is a usable template. **Equivalent.** |
| Human-in-the-loop triage | "Building ML Powered Applications" (Vallina-Rodriguez); SRE postmortem culture (Google SRE Book). | S39 frames the triage as HITL with override, audit, and appeal — pedagogically cleaner than most applied-ML textbooks which treat HITL as an afterthought. **Stronger** in pedagogical structure. |
| Drift / incident / rollback | Google SRE Book — Postmortem Culture; embracing risk. | S39's `mode(incident, drift_high)` + `rollback_target(prev_model_id)` decision table is simpler than real SRE runbooks but pedagogically appropriate. The postmortem blameless rubric (4-fixture matrix in E3 of T4-B) is best-in-class for an undergraduate course. **Equivalent.** |
| Fairness by slices | Barocas-Hardt-Narayanan "Fairness and Machine Learning" (ch. on slices). | S39's `slice_metrics` and `REJECT_SLICE_FP` are operationally focused (false-queue rate per slice, not demographic parity). The course explicitly avoids group-blame language ("no etiqueta personas"). **Stronger** in ethical framing. |
| Compared to S15 (Pandas ingesta) — previous best-in-class audited section | S15 score 7.6/10. | S39 has the same structural fidelity (8 demos + 24 exercises + capstone + self-check) but two extra HIGH findings (demo drift, PDF mislabel). S39 prose is slightly cleaner (no CASO-LIM-015 24× starter header leak is more pervasive than S39's 8×; but S39 has 2 run-on sentences vs S15's 1). Net comparable, slightly lower due to demo+PDF drift both being uncorrected. |

---

## 6. Grammatical Improvements & Rewriting — Paragraph by Paragraph (Before / After)

> Method note: per the grammar subplan, every learner-facing Spanish sentence in S39 was scored with Fernández-Huerta (FH) and INFLESZ, WPS, SPW, and the 11 heuristic rules. Aggregate: 448 sentences across 261 prose blocks; avg FH 64.06, avg WPS 12.16, avg SPW 2.17. Below, only the paragraphs requiring intervention are rewritten. The full per-sentence metrics table is in `/home/z/my-project/audits/S39_metrics.json`.

### 6.1 Theory tab

#### T1-A, paragraph 1 (`s39:67`, S39-155-paragraphs) — 53-word RUNON

**Before (FH=11.3, WPS=53):**
> El flujo canónico N3 es una cadena con fronteras claras: intake normaliza registros sintéticos; ER decide misma entidad (no familia ni culpa); el grafo relacional expone paths de co-ocurrencia; features se materializan sin leakage de labels futuros; el modelo emite un score de prioridad; la cola recibe el caso para revisión humana. Cada etapa tiene schema de entrada/salida y un dueño de contrato. El score nunca es veredicto de conducta indebida.

**After (3 sentences, FH≈55):**
> El flujo canónico N3 es una cadena con fronteras claras entre etapas. **Intake** normaliza los registros sintéticos y **ER** decide si dos registros son la misma entidad (no familia ni culpa). El **grafo relacional** expone paths de co-ocurrencia y **features** se materializa sin leakage de labels futuros. El **modelo** emite un score de prioridad y la **cola** recibe el caso para revisión humana. Cada etapa tiene schema de entrada/salida y un dueño de contrato. El score nunca es veredicto de conducta indebida.

**Rationale:** split the 6-clause sentence into 4 shorter sentences; added determiner `la misma entidad` (fixes M-3); kept all bold terms; reduced WPS from 53 to ~14 per sentence; FH lifts from 11.3 ("muy difícil") to ~55 ("normal").

#### T1-A, paragraph 2 (`s39:68`, S39-156-paragraphs) — 48-word RUNON

**Before (FH=39.1, WPS=48):**
> Por qué este orden importa: ER antes del grafo evita filtrar features con una identidad mal resuelta; features antes del score impiden que el modelo use labels futuros de la cola; la cola al final fuerza HITL (human-in-the-loop: un revisor decide, no el score solo). Entrada: payload con `run_id`, registros de intake y umbral. Salida: stages ordenados, `label_space=needs_review` y `auto_fraud=False`. Error: reordenar etapas, saltar ER o mapear score a veredicto legal. Éxito: fallas se aíslan por frontera y el score solo ordena trabajo humano.

**After (FH≈55):**
> Por qué importa este orden: si ER se ejecuta después del grafo, los features pueden filtrar una identidad mal resuelta. Si features se ejecuta después del score, el modelo puede usar labels futuros de la cola. La cola al final fuerza HITL (human-in-the-loop: un revisor decide, no el score solo). Entrada: payload con `run_id`, registros de intake y umbral. Salida: stages ordenados, `label_space=needs_review` y `auto_fraud=False`. Error: reordenar etapas, saltar ER o mapear el score a veredicto legal. Éxito: las fallas se aíslan por frontera y el score solo ordena trabajo humano.

**Rationale:** convert the 3-clause semicolon list into 3 conditional sentences; rewrite "Por qué este orden importa:" → "Por qué importa este orden:" (more natural Spanish word order); add determiner "el score" (last sentence).

#### T1-A, paragraph 3 (`s39:69`, S39-157-paragraphs) — 37-word sentence + `misma entidad` missing determiner

**Before (FH=26.4):**
> Aplicación al caso sintético `CASO-LIM-039-T1A` (cola de onboarding digital en Lima, fintech ficticia): dos registros comparten un teléfono sintético; ER puede proponer misma entidad; el grafo muestra un path de longitud 2; el score 0.66 sugiere prioridad media de cola. Nada de eso prueba fraude, parentesco ni intención: solo justifica que un revisor mire el evidence packet con citas y path.

**After:**
> Aplicación al caso sintético `CASO-LIM-039-T1A` (cola de onboarding digital en Lima, fintech ficticia). Dos registros comparten un teléfono sintético; ER puede proponer la misma entidad; el grafo muestra un path de longitud 2; el score 0.66 sugiere prioridad media de cola. Nada de eso prueba fraude, parentesco ni intención: solo justifica que un revisor mire el evidence packet con sus citas y path.

**Rationale:** split at the colon into two sentences; add `la` determiner before `misma entidad` (fixes M-3); add `sus` before `citas y path` for natural Spanish flow.

#### T2-A, paragraph 1 (`s39:140`, S39-161-paragraphs) — 36-word sentence + 34-word sentence

**Before (FH=38.5 / 29.2):**
> La cola ordena casos por score calibrado y capacidad del equipo; el evidence packet es lo que el revisor ve: hechos sintéticos, path de grafo, top features, incertidumbre (in/out of distribution) y contribuciones del modelo. Un número suelto no es un workbench: sin path ni evidencia el caso no debe entrar a cola humana como «listo». **Calibración** aquí significa que el umbral se eligió en validación (S34) para una tasa de cola sostenible y una confiabilidad razonable del ranking — no que el score sea probabilidad de fraude ni veredicto legal.

**After:**
> La cola ordena casos por score calibrado y por capacidad del equipo. El evidence packet es lo que el revisor ve: hechos sintéticos, path de grafo, top features, incertidumbre (in/out of distribution) y contribuciones del modelo. Un número suelto no es un workbench: sin path ni evidencia, el caso no debe entrar a cola humana como «listo». **Calibración** aquí significa que el umbral se eligió en validación (S34) para una tasa de cola sostenible y una confiabilidad razonable del ranking. No es que el score sea probabilidad de fraude ni veredicto legal.

**Rationale:** split the 36-word first sentence into two; split the 34-word run-on at the em-dash into two sentences; add comma after "sin path ni evidencia," for prosodic rhythm.

#### T3-A, paragraph 3 (`s39:240`, S39-169-paragraphs) — 43-word sentence

**Before (FH=36.0):**
> Para `CASO-LIM-039-T3A`, el release de la cola en un entorno de laboratorio limeño exige límites de tamaño en adjuntos sintéticos del packet, validación de URLs (sin **SSRF**: el servidor no debe abrir URLs arbitrarias de evidence remota) y slice metrics de false-queue rate. El checklist no declara «sistema justo para siempre»: solo evidencia mínima de release responsable.

**After:**
> Para `CASO-LIM-039-T3A`, el release de la cola en un entorno de laboratorio limeño exige tres controles. Primero, límites de tamaño en los adjuntos sintéticos del packet. Segundo, validación de URLs (sin **SSRF**: el servidor no debe abrir URLs arbitrarias de evidence remota). Tercero, slice metrics de false-queue rate. El checklist no declara «sistema justo para siempre»: solo evidencia mínima de release responsable.

**Rationale:** convert the 3-element comma list into 3 explicit steps ("Primero, … Segundo, … Tercero, …") — reduces WPS from 43 to ~12 per sentence and explicitly signals the enumeration.

#### T4-B, paragraph 1 (`s39:359`, S39-176-paragraphs) — 41-word sentence with 11 commas

**Before (FH=42.1, 11 commas):**
> El cierre de nivel exige **cards** legibles: **model card** (intended use, label_space, límites, no auto-fraude, oversight y métricas por slice), **data card** (fuentes sintéticas, ventanas, minimización de PII, gaps conocidos) y **system card** (modos ops, owners, rollback, demo paths). Las métricas de valor del triage son operativas: precisión@k de la cola, tasa de overrides, tiempo mediano de review — no solo AUC offline.

**After (using a bullet list):**
> El cierre de nivel exige **cards** legibles:
>
> - **Model card:** intended use, `label_space`, límites, no autofraude, oversight y métricas por slice.
> - **Data card:** fuentes sintéticas, ventanas, minimización de PII, gaps conocidos.
> - **System card:** modos ops, owners, rollback, demo paths.
>
> Las métricas de valor del triage son operativas: precisión@k de la cola, tasa de overrides y tiempo mediano de review — no solo AUC offline.

**Rationale:** convert the parenthetical comma list into a Markdown bullet list — eliminates 9 commas and halves WPS; also fixes M-1 (`auto-fraude` → `autofraude`).

### 6.2 I Do tab

#### `iDo.intro` (`s39:405`, S39-32-intro) — 39-word run-on

**Before (FH=30.1, WPS=39):**
> Te muestro el cierre del nivel N3: pipeline canónico, registry con owners, evidence packet, decisiones con override, checklist de riesgo, modos ops, aceptación/regresión y cards de valor — siempre con fixtures sintéticos y sin auto-declarar promoción ni CF-3.

**After:**
> Te muestro el cierre del nivel N3 en ocho demos: pipeline canónico, registry con owners, evidence packet, decisiones con override, checklist de riesgo, modos ops, aceptación/regresión y cards de valor. Todo con fixtures sintéticos; sin autodeclarar promoción ni CF-3.

**Rationale:** split at the em-dash into two sentences; replace "siempre con fixtures sintéticos y sin auto-declarar promoción ni CF-3" with a tighter "Todo con fixtures sintéticos; sin autodeclarar promoción ni CF-3."; join `auto-declarar` → `autodeclarar` (M-1). WPS drops from 39 to ~22 / ~10.

### 6.3 We Do tab

#### `weDo.intro` (`s39:651`, S39-46-intro) — 35-word sentence

**Before (FH=46.0):**
> S39 · Laboratorio Responsible ML Case Triage (CASO-LIM-039, sintético Perú): 24 retos locales. E1 repara un predicado de dominio, E2 separa válido/adverso/missing y E3 demuestra fail-closed con tokens de error exactos. Sin auto-fraude ni auto-declarar promoción de nivel.

**After:**
> S39 · Laboratorio Responsible ML Case Triage (`CASO-LIM-039`, sintético Perú): 24 retos locales. **E1** repara un predicado de dominio; **E2** separa válido, adverso y missing; **E3** demuestra fail-closed con tokens de error exactos. Sin autofraude ni autodeclarar promoción de nivel.

**Rationale:** replace commas with semicolons between the E1/E2/E3 clauses (clearer separation); add bold to E1/E2/E3 (mirrors the theory style); join `auto-fraude` / `auto-declarar` (M-1).

#### Hints typography fix (`s39:1646`, `s39:208-210` — 6 occurrences)

**Before:**
> Tabla de verdad simple: (F,F)=normal, (T,F)=abstain_more, (F,T)=human_only.

**After:**
> Tabla de verdad simple: (F, F) = normal; (T, F) = abstain_more; (F, T) = human_only.

**Rationale:** add space after comma inside parens (M-7); use semicolons between mappings for clearer separation; add spaces around `=` for readability.

#### Edge case agreement fix (`s39:980`)

**Before:**
> `edgeCases: ["owner vacío en un artefacto", "breaking sin major", "registry incompleto"]` — and `"registry de 4 artefactos conceptual"` (line 980, in E3 edge cases).

**After:**
> `"registry de 4 artefactos conceptuales"` (plural agreement with `artefactos`).

**Rationale:** M-8 — `conceptual` → `conceptuales`.

### 6.4 You Do tab

#### `youDo.context` (`s39:2085`, S39-122-context) — 28 words, 6 commas

**Before (FH≈50):**
> Entrega el sistema e2e sintético de triage para `CASO-LIM-039`: contratos versionados, evidence packet, decisiones/overrides auditados, checklist de riesgo, modos human_only, demo de aceptación, cards y postmortem. Incluye **checklist de regresión S27–S39** y referencia a **CF-3**. No auto-fraude ni parentesco automático. Deja evidencia para revisión externa; no auto-declares la promoción de nivel.

**After:**
> Entrega el sistema e2e sintético de triage para `CASO-LIM-039`. El bundle incluye: contratos versionados, evidence packet, decisiones/overrides auditados, checklist de riesgo, modos `human_only`, demo de aceptación, cards y post mórtem. Incluye **checklist de regresión S27–S39** y referencia a **CF-3**. Sin autofraude ni parentesco automático. Deja evidencia para revisión externa; no autodeclares la promoción de nivel.

**Rationale:** split at the first colon; join `auto-fraude` → `autofraude` and `auto-declares` → `autodeclares` (M-1); `postmortem` → `post mórtem` (M-2). WPS for the first sentence drops from 28 to 18.

### 6.5 Self-Check tab

All five self-check questions are clean (short question stems, 4 options each, 1-2 sentence explanations, FH in the 50–70 band). No grammatical issues. Two minor stylistic suggestions:

- Q1 explanation: "needs_review (o prioridad de cola)" — the parenthetical is a useful gloss; consider italicizing `needs_review` as a code value (`needs_review`).
- Q5 explanation: "Semver major + owner + regresión de contratos (incl. paths del grafo)" — the abbreviation `incl.` is rare in es-PE; replace with `incluyendo`: "Semver major + owner + regresión de contratos (incluyendo paths del grafo)".

---

## 7. Proposed GitHub-Style Diffs

### Diff 1 — Fix interactive demo drift in `SectionView.tsx` (H-1)

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -3010,21 +3010,40 @@
     },
-    'integrator-phase2': {
-      title: 'Practica CI/CD y monitoreo',
-      code: `# Simulacion de CI/CD pipeline y monitoreo
-import time
-import random
-
-# Simular pipeline CI/CD
-def ci_pipeline(commit_hash):
-    """Simula un pipeline de CI/CD."""
-    steps = [
-        ("lint", 0.1, 0.0),      # (nombre, duracion, prob_fallo)
-        ("test", 0.2, 0.05),
-        ("build", 0.3, 0.02),
-        ("deploy_canary", 0.15, 0.03),
-        ("smoke_test", 0.1, 0.01),
-        ("promote_100", 0.05, 0.0),
-    ]
-    …
-    `,
-      hint: 'Cambia las probabilidades de fallo a 0.0 y observa si el pipeline siempre pasa',
+    'integrator-phase2': {
+      title: 'Practica triage responsable',
+      code: `# Responsible ML Case Triage — CASO-LIM-039 (sintetico)
+STAGES = ("intake", "er", "relation_graph", "features", "model_score", "queue")
+
+def triage(case_id, score, threshold=0.7):
+    """Score prioriza cola; NO declara fraude ni parentesco."""
+    if score >= threshold:
+        action = "queue_now"
+    elif score >= 0.4:
+        action = "queue_batch"
+    else:
+        action = "skip"
+    return {
+        "case_id": case_id,
+        "stages": list(STAGES),
+        "score": score,
+        "label_space": "needs_review",
+        "auto_fraud": False,
+        "action": action,
+    }
+
+for cid, s in [("CASO-LIM-039-c001", 0.81), ("CASO-LIM-039-c002", 0.55), ("CASO-LIM-039-c003", 0.20)]:
+    r = triage(cid, s)
+    print(f"{r['case_id']} score={r['score']:.2f} -> {r['action']} (auto_fraud={r['auto_fraud']})")
+`,
+      expectedOutput: `CASO-LIM-039-c001 score=0.81 -> queue_now (auto_fraud=False)
+CASO-LIM-039-c002 score=0.55 -> queue_batch (auto_fraud=False)
+CASO-LIM-039-c003 score=0.20 -> skip (auto_fraud=False)`,
+      hint: 'Sube el threshold a 0.85 y observa cuantos casos caen en queue_now',
     },
```

### Diff 2 — Fix PDF report label drift (H-2)

```diff
--- a/src/components/course/PdfReport.tsx
+++ b/src/components/course/PdfReport.tsx
@@ -76,7 +76,7 @@
   "ai-apis-advanced": '36. AI APIs',
   "dbt-bigquery": '37. dbt/BQ',
   "performance-extreme": '38. Concurrencia',
-  "integrator-phase2": '39. Capstone P2',
+  "integrator-phase2": '39. Case Triage N3',
   "agentic-architecture": '40. Agentic',
   "llm-finetuning": '41. FineTune',
   "graph-rag": '42. GraphRAG',
```

### Diff 3 — Split 53-word run-on in theory T1-A (H-3)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ -64,7 +64,11 @@
       paragraphs: [
-        "El flujo canónico N3 es una cadena con fronteras claras: **intake** normaliza registros sintéticos; **ER** decide misma entidad (no familia ni culpa); el **grafo relacional** expone paths de co-ocurrencia; **features** se materializan sin leakage de labels futuros; el **modelo** emite un score de prioridad; la **cola** recibe el caso para revisión humana. Cada etapa tiene schema de entrada/salida y un dueño de contrato. El score **nunca** es veredicto de conducta indebida.",
+        "El flujo canónico N3 es una cadena con fronteras claras entre etapas. **Intake** normaliza los registros sintéticos y **ER** decide si dos registros son la misma entidad (no familia ni culpa). El **grafo relacional** expone paths de co-ocurrencia y **features** se materializa sin leakage de labels futuros. El **modelo** emite un score de prioridad y la **cola** recibe el caso para revisión humana. Cada etapa tiene schema de entrada/salida y un dueño de contrato. El score **nunca** es veredicto de conducta indebida.",
```

### Diff 4 — Split 48-word run-on in theory T1-A (H-4)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ -67,7 +67,9 @@
-        "Por qué este orden importa: ER antes del grafo evita filtrar features con una identidad mal resuelta; features antes del score impiden que el modelo use labels futuros de la cola; la cola al final fuerza **HITL** (human-in-the-loop: un revisor decide, no el score solo). Entrada: payload con `run_id`, registros de intake y umbral. Salida: stages ordenados, `label_space=needs_review` y `auto_fraud=False`. Error: reordenar etapas, saltar ER o mapear score a veredicto legal. Éxito: fallas se aíslan por frontera y el score solo ordena trabajo humano.",
+        "Por qué importa este orden: si ER se ejecuta después del grafo, los features pueden filtrar una identidad mal resuelta. Si features se ejecuta después del score, el modelo puede usar labels futuros de la cola. La cola al final fuerza **HITL** (human-in-the-loop: un revisor decide, no el score solo). Entrada: payload con `run_id`, registros de intake y umbral. Salida: stages ordenados, `label_space=needs_review` y `auto_fraud=False`. Error: reordenar etapas, saltar ER o mapear el score a veredicto legal. Éxito: las fallas se aíslan por frontera y el score solo ordena trabajo humano.",
```

### Diff 5 — Fix `misma entidad` missing determiner (M-3, 3 occurrences)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ -67,7 +67,7 @@
-        "El flujo canónico N3 es una cadena con fronteras claras: **intake** normaliza registros sintéticos; **ER** decide misma entidad (no familia ni culpa); …",
+        "El flujo canónico N3 es una cadena con fronteras claras: **intake** normaliza registros sintéticos; **ER** decide la misma entidad (no familia ni culpa); …",
@@ -69,7 +69,7 @@
-        "Aplicación al caso sintético `CASO-LIM-039-T1A` (cola de onboarding digital en Lima, fintech ficticia): dos registros comparten un teléfono sintético; ER puede proponer misma entidad; el grafo muestra un path de longitud 2; …",
+        "Aplicación al caso sintético `CASO-LIM-039-T1A` (cola de onboarding digital en Lima, fintech ficticia): dos registros comparten un teléfono sintético; ER puede proponer la misma entidad; el grafo muestra un path de longitud 2; …",
@@ -782,7 +782,7 @@
-          "Incertidumbre (missing) no es breach de parentesco: token REQUEST_STAGE_LIST va antes de evaluar contenido.",
-          "ER solo habla de misma entidad; er_claims_parentesco True es REJECT_ER_SCOPE aunque el orden de stages sea correcto.",
+          "Incertidumbre (missing) no es breach de parentesco: token REQUEST_STAGE_LIST va antes de evaluar contenido.",
+          "ER solo habla de la misma entidad; er_claims_parentesco True es REJECT_ER_SCOPE aunque el orden de stages sea correcto.",
```

### Diff 6 — Fix `Checklist firmado por owner` missing article (M-4)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ -131,7 +131,7 @@
       callout: {
         type: "tip",
         title: "Release gate",
         content:
-          "Checklist firmado por owner. secrets_in_repo o falta de RBAC son blockers duros: no se «compensa» con un AUC alto.",
+          "El checklist lo firma el owner. `secrets_in_repo` o la falta de RBAC son blockers duros: no se «compensa» con un AUC alto.",
       },
```

### Diff 7 — Join `auto-` prefix globally (M-1, 17 occurrences)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ -15,1 +15,1 @@
-… sin auto-declarar el cierre del nivel.
+… sin autodeclarar el cierre del nivel.
@@ (16 more occurrences — replace_all: "auto-declarar" -> "autodeclarar", "auto-declara" -> "autodeclara", "auto-declares" -> "autodeclares", "auto-declaras" -> "autodeclaras", "auto-fraude" -> "autofraude")
```

### Diff 8 — Fix `postmortem` orthography (M-2, 13 occurrences)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ (13 occurrences — replace_all: "postmortem" -> "post mórtem"; italicize when used as foreignism: "*postmortem*")
```

### Diff 9 — Fix comma-space typography in hint tables (M-7, 6 occurrences)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ -1646,2 +1646,2 @@
-        hint: "Tabla de verdad simple: (F,F)=normal, (T,F)=abstain_more, (F,T)=human_only.",
-        hints: [
-          "Tabla de verdad simple: (F,F)=normal, (T,F)=abstain_more, (F,T)=human_only.",
+        hint: "Tabla de verdad simple: (F, F) = normal; (T, F) = abstain_more; (F, T) = human_only.",
+        hints: [
+          "Tabla de verdad simple: (F, F) = normal; (T, F) = abstain_more; (F, T) = human_only.",
@@ -1648 same change in the second hint array item, and in the duplicate hints at lines ~208-210
```

### Diff 10 — Fix plural agreement `conceptual` → `conceptuales` (M-8)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ -980,7 +980,7 @@
-        edgeCases: ["owner vacío en un artefacto", "breaking sin major", "registry incompleto", "registry de 4 artefactos conceptual"],
+        edgeCases: ["owner vacío en un artefacto", "breaking sin major", "registry incompleto", "registry de 4 artefactos conceptuales"],
```

### Diff 11 — Fix `vs` typography (M-9, 4 occurrences)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ -98,7 +98,7 @@
-… y carga de cola vs capacidad.
+… y carga de cola vs. capacidad.
@@ -238,7 +238,7 @@
-… **RBAC** por rol (reviewer vs admin), y prohíbe …
+… **RBAC** por rol (reviewer vs. admin), y prohíbe …
@@ -360,7 +360,7 @@
-… actions (p. ej. rollback vs recalibrar). …
+… actions (p. ej. rollback vs. recalibrar). …
```

### Diff 12 — Strip `# CASO-LIM-039 · <topic>` headers from starterCode (M-6, 8 occurrences)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ -986,3 +986,2 @@
-          code: `# CASO-LIM-039 · registry owners+bump
-# DEFECTO: decide no valida owners ni bump
+          code: `# DEFECTO: decide no valida owners ni bump
 # Contrato: corrige el defecto del predicado; la salida debe coincidir con el enunciado
@@ -1472,3 +1472,2 @@
-          code: `# CASO-LIM-039 · secrets_in_repo block
-# DEFECTO: assess PASS sin bloquear secrets_in_repo
+          code: `# DEFECTO: assess PASS sin bloquear secrets_in_repo
 # Contrato: corrige el defecto del predicado; la salida debe coincidir con el enunciado
@@ (6 more occurrences — same pattern, drop the `# CASO-LIM-039 · <topic>` first line)
```

### Diff 13 — Clarify scope inconsistency S27–S38 vs S27–S39 (L-5)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ -34,7 +34,7 @@
-        "Orden pedagógico: **T1 Arquitectura del flujo** (pipeline y ownership) → … El caso sintético `CASO-LIM-039` modela una cola de onboarding digital en una fintech ficticia en Lima: datos inventados, sin PII real y sin etiqueta automática de fraude. Si el mapa se siente denso, avanza T1→T4 en ese orden; el You Do ensambla todo al final.",
+        "Orden pedagógico: **T1 Arquitectura del flujo** (pipeline y ownership) → … El caso sintético `CASO-LIM-039` modela una cola de onboarding digital en una fintech ficticia en Lima: datos inventados, sin PII real y sin etiqueta automática de fraude. Si el mapa se siente denso, avanza T1→T4 en ese orden; el You Do ensambla todo al final. Nota: esta sección se auto-incluye en el smoke de regresión S27–S39.",
```

### Diff 14 — Convert 41-word cards sentence to bullet list (theory T4-B)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ -357,7 +357,12 @@
-        "El cierre de nivel exige **cards** legibles: **model card** (intended use, label_space, límites, no auto-fraude, oversight y métricas por slice), **data card** (fuentes sintéticas, ventanas, minimización de PII, gaps conocidos) y **system card** (modos ops, owners, rollback, demo paths). Las métricas de valor del triage son operativas: precisión@k de la cola, tasa de overrides, tiempo mediano de review — no solo AUC offline.",
+        "El cierre de nivel exige **cards** legibles. Una **model card** documenta el intended use, el `label_space`, los límites, la prohibición de autofraude, el oversight y las métricas por slice. Una **data card** documenta las fuentes sintéticas, las ventanas, la minimización de PII y los gaps conocidos. Una **system card** documenta los modos ops, los owners, el rollback y los demo paths. Las métricas de valor del triage son operativas: precisión@k de la cola, tasa de overrides y tiempo mediano de review — no solo AUC offline.",
```

### Diff 15 — Convert 39-word `iDo.intro` run-on (L-4)

```diff
--- a/src/lib/course/sections/s39-integrator-phase2.ts
+++ b/src/lib/course/sections/s39-integrator-phase2.ts
@@ -405,1 +405,1 @@
-    intro: "Te muestro el cierre del nivel N3: pipeline canónico, registry con owners, evidence packet, decisiones con override, checklist de riesgo, modos ops, aceptación/regresión y cards de valor — siempre con fixtures sintéticos y sin auto-declarar promoción ni CF-3.",
+    intro: "Te muestro el cierre del nivel N3 en ocho demos: pipeline canónico, registry con owners, evidence packet, decisiones con override, checklist de riesgo, modos ops, aceptación/regresión y cards de valor. Todo con fixtures sintéticos; sin autodeclarar promoción ni CF-3.",
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| **P0** | H-1: Replace `demos['integrator-phase2']` with a triage-relevant demo (Diff 1) | Low (one demo) | HIGH — fixes the most visible learner-facing drift |
| **P0** | H-2: Fix PdfReport label `39. Capstone P2` → `39. Case Triage N3` (Diff 2) | Trivial (1 line) | HIGH — aligns PDF with live UI |
| **P1** | H-3 + H-4: Split the two run-on sentences in theory T1-A (Diffs 3, 4) | Low | HIGH — first-impression cognitive load |
| **P1** | M-6: Strip `# CASO-LIM-039 · <topic>` headers from 8 starterCode files (Diff 12) | Low | MEDIUM — meta-leak removal |
| **P1** | M-3: Add determiner to `misma entidad` (3 occurrences) (Diff 5) | Trivial | MEDIUM — grammar correctness |
| **P1** | M-4: Fix `Checklist firmado por owner` (Diff 6) | Trivial | MEDIUM — grammar correctness |
| **P2** | M-1: Join `auto-` prefix globally (17 occurrences) (Diff 7) | Trivial (replace_all) | MEDIUM — style consistency |
| **P2** | M-2: Fix `postmortem` orthography (13 occurrences) (Diff 8) | Trivial (replace_all) | MEDIUM — style consistency |
| **P2** | M-7: Fix comma-space typography in hint tables (6 occurrences) (Diff 9) | Trivial | LOW-MEDIUM — typography |
| **P2** | M-8: Fix `conceptual` plural agreement (Diff 10) | Trivial | LOW — grammar |
| **P2** | M-9: Add period to `vs` (4 occurrences) (Diff 11) | Trivial | LOW — typography |
| **P3** | L-4, L-5: Convert remaining long preambles + scope clarification (Diffs 13–15) | Low | LOW — polish |
| **P3** | L-1, L-2, L-3: URLs plural, `incl.` abbreviation, comma density | Trivial | LOW — style |

---

## 9. Graph Memory Update notes (for shared context files)

- **Section 39 confirmed** as `s39-integrator-phase2.ts` (file), `integrator-phase2` (id), index 39, title "Responsible ML Case Triage y cierre de nivel", shortTitle "Case Triage N3". Imported at `index.ts:42`, active at `index.ts:77`.
- **Demo drift registry entry:** Add `integrator-phase2` to the running list of sections whose `demos[sectionId]` map entry in `SectionView.tsx` is off-topic. Existing entries (from prior audits): `setup`-class S06/S09/S10/S13/S15. S39 demo loads CI/CD simulator (lines 3,013–3,065) — completely unrelated to triage. Fix candidate: the `triage()` function already exists in `youDo.starterCode` (line 2,121) and could be lightly adapted as the demo body.
- **PDF label drift registry entry:** Add `integrator-phase2` → `39. Capstone P2` to the running list of mislabeled entries in `PdfReport.tsx`. Existing entry from S15 audit: `s15` → `15. stdlib`. Pattern: phase-2 capstones tend to fall back to the generic roadmap slot name when no curated short label was authored.
- **CASO-LIM registry:** S39 uses `CASO-LIM-039` 79× total (77 inside backtick string literals, 2 in prose). Of those, 8 are starterCode header comments (`# CASO-LIM-039 · <topic>`) — same pattern as S15 (24×) and S10 (31×), less pervasive. Recommend a course-wide pass to strip these headers OR convert them to learner-facing comments like `# Ejercicio S39-T1-B-E3 — registry de 4 artefactos`.
- **Vocabulary consistency registry:** S39 uses `auto-declarar` / `auto-fraude` (17× hyphenated) and `postmortem` (13×, English spelling). RAE prefers `autodeclarar` / `autofraude` (joined) and `post mórtem` (two words, accented). These are course-wide style choices — recommend a single decision and a global replace.
- **Heuristic-tool bug:** the `long_flag` logic in `/home/z/my-project/grammar_metrics.py` line 89 sets `'LONG'` for any sentence >32 words and never checks `'RUNON'` (>45). For S39, the 53-word and 48-word theory sentences should be classified as RUNON, not LONG. Recommend fixing the ternary: `'RUNON' if wc > 45 else ('LONG' if wc > 32 else '')`.
- **S39 score:** 7.2/10 (composite). Pedagogically gold-standard (8/8/24/1/5 structure with full fidelity, anti-fraud/anti-parentesco/anti-self-promotion guardrails, real CP-N3-C bundle with cards + audit + postmortem + manifest). Loses 2.8 points for: H-1 demo drift (−0.7), H-2 PDF mislabel (−0.4), H-3/H-4 run-ons (−0.7), M-1/M-2 style consistency (−0.6), M-3/M-4 grammar (−0.5), M-6 taxonomy leak (−0.3), misc low (−0.6).
- **Recommended next-section link:** S40 (`agentic-architecture`) should reference S39's `audit log + cards + postmortem` pattern when defining agent observability — same operational vocabulary.

---

## 10. Method Note (Grammar Subplan Applied)

Per the shared grammar subplan (`_GRAMMAR_SUBPLAN.md`), the following research-backed heuristics were applied to **every paragraph and every sentence** of S39's learner-facing Spanish prose:

1. **Fernández-Huerta (1959)** — `206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Spanish Flesch adaptation.
2. **Szigriszt-Pazos / INFLESZ** — `206.835 − 62.3·(syllables/word) − (words/sentence)`.
3. **Words per sentence (WPS)** and **syllables per word (SPW)** — soft targets: WPS 15–32 for technical Spanish; SPW ≈ 2.0–2.4 typical.
4. **Heuristic rules (11):** run-on (>45w) / long (>32w) / missing terminal `.?!` / missing `¿¡` / unbalanced delimiters / repeated word / English-dominant sentence / meta-AI-TODO leak / gerund pile-up (≥3) / high comma density (>0.12) / paragraph = one long sentence / anaphoric monotony / space-before-punct / double space.
5. **LanguageTool (es) public API** — 3 chunks (36,305 chars total), 1,055 raw matches. Filtered to 82 non-spelling matches (the 973 `MORFOLOGIK_RULE_ES` matches are overwhelmingly English code identifiers like `CASO-LIM-039`, `auto_fraud`, `needs_review`, `human_only`, etc. — false positives).

**Aggregate metrics (448 sentences across 261 prose blocks):**
- Avg WPS: **12.16** (max 53, min 2)
- Avg FH: **64.06** ("normal" band — appropriate for technical Spanish curriculum)
- Avg SPW: **2.17**
- LONG (>32w): **14** sentences
- RUNON (>45w): **2** sentences (H-3, H-4)
- Missing terminal punct: 85 (mostly headings, hints, criteria — by design)
- Missing inverted `¿¡`: **0**
- Unbalanced delimiters: 4 (all `incl.` abbreviation false positives — L-2)
- Double space: **0**
- Space-before-punct: **0**
- Gerund pile-up: **0**
- Repeated word: **0**
- Anaphoric monotony blocks: **0**
- High comma density sentences: 58 (mostly intentional "Entrada: a, b, c, d" lists)

**Top LT rule findings (non-spelling):**
- `PREFIJOS_JUNTOS_EN_DICCIONARIO` ×17 → `auto-declarar`/`auto-fraude` → `autodeclarar`/`autofraude` (M-1)
- `ES_SIMPLE_REPLACE_MULTIWORDS_POSTMORTEM` ×13 → `postmortem` → `post mórtem` (M-2)
- `MISMO_EL_MISMO` ×3 → `misma entidad` → `la misma entidad` (M-3)
- `AGREEMENT_POSTPONED_ADJ` ×4 → `Checklist firmado por owner` missing article (M-4) + 3 marginal cases
- `COMMA_PARENTHESIS_WHITESPACE` ×6 → `(F,F)=normal` → `(F, F) = normal` (M-7)
- `AGREEMENT_DET_NOUN` ×8 → mostly false positives on `el checklist` (English loanword, RAE accepts masculine)
- `PUNTO_EN_ABREVIATURAS` ×4 → `vs` → `vs.` (M-9)
- `SIGLAS` ×2 → `URLs` → `URL` (invariable plural, L-1)

**False-positive classes documented:**
- `MORFOLOGIK_RULE_ES` against English code identifiers (`auto_fraud`, `human_only`, `needs_review`, `CASO-LIM-039`, `e2e`, `thr_hi`, `precision_at_k`, `override_rate`, `ml-risk`, `data-quality`, etc.) — these are intentional in-code values and should NOT be changed.
- `AGREEMENT_DET_NOUN` against English loanwords (`checklist`, `registry`, `packet`, `score`, `ranker`) — RAE accepts the gender the author chose (mostly masculine, agreement is correct).
- `DIACRITICS_OTHERS` against `solo`/`mismo`/`sólo` — post-2010 RAE reform dropped the accent on adverbial `solo`; LT still flags it conservatively.
- `VOSEO` ×2 — false positive in Peruvian Spanish (no voseo).
- `BASTO_VASTO` ×1 — LT confused the verb `basta` (from `bastar`) with the adjective `basto` (rough). The sentence "basta un artefacto sin owner" is grammatically correct.

---

**This is the complete Explorer report for Section 39. Ready for the Fixer prompt.**
